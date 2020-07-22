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
    setZero: function () {
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
        "ko": "로보티즈 로봇자동차",
        "en": "Robotis Robot car"
    },
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

Entry.Robotis_openCM70 = {
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
    setZero: function () {
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
        "ko": "로보티즈 IoT",
        "en": "Robotis Open CM70"
    },
    delay: 15,
};

Entry.Robotis_openCM70EDU = {
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
    setZero: function () {
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
            'USERBUTTONSTATE': { name: 'USERBUTTON', type: 'input', pos: { x: 565, y: 335 } },
            //'LEDR': { name: 'R', type: 'input', pos: { x: 140, y: 300 } },
            //'LEDG': { name: 'G', type: 'input', pos: { x: 170, y: 300 } },
            //'LEDB': { name: 'B', type: 'input', pos: { x: 200, y: 300 } },
            //'GM1': { name: 'GEARD1', type: 'input', pos: { x: 450, y: 300 } },
            //'GM2': { name: 'GEARD2', type: 'input', pos: { x: 450, y: 480 } },
            'MONITORPORT0': { name: 'PORT3', type: 'input', pos: { x: 320, y: 320 } },
            'MONITORPORT1': { name: 'PORT4', type: 'input', pos: { x: 330, y: 330 } },
            'MONITORPORT2': { name: 'PORT5', type: 'input', pos: { x: 320, y: 440 } },
            'MONITORPORT3': { name: 'PORT6', type: 'input', pos: { x: 330, y: 460 } }
        },
        mode: 'both'
    },
    id: '7.3',
    name: 'robotis_openCM70EDU',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_openCM70EDU.png',
    title: {
        "ko": "로보티즈 실과",
        "en": "ROBOTIS InfoRobot"
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

Entry.Robotis_carCont.getBlocks = function () {
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
                        [
                            Lang.Blocks.robotis_cm_spring_right,
                            'CM_SPRING_RIGHT',
                        ],
                        [Lang.Blocks.robotis_cm_switch, 'CM_SWITCH'],
                        [
                            Lang.Blocks.robotis_cm_sound_detected,
                            'CM_SOUND_DETECTED',
                        ],
                        [
                            Lang.Blocks.robotis_cm_sound_detecting,
                            'CM_SOUND_DETECTING',
                        ],
                        [Lang.Blocks.robotis_cm_ir_left, 'CM_IR_LEFT'],
                        [Lang.Blocks.robotis_cm_ir_right, 'CM_IR_RIGHT'],
                        [
                            Lang.Blocks.robotis_cm_calibration_left,
                            'CM_CALIBRATION_LEFT',
                        ],
                        [
                            Lang.Blocks.robotis_cm_calibration_right,
                            'CM_CALIBRATION_RIGHT',
                        ],
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
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var sensor = script.getStringField('SENSOR');

                if (sensor == 'CM_SPRING_LEFT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[2];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[3];
                } else if (sensor == 'CM_SPRING_RIGHT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[2];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[3];
                } else if (sensor == 'CM_SWITCH') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
                } else if (sensor == 'CM_SOUND_DETECTED') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTED[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTED[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTED[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTED[1];
                } else if (sensor == 'CM_SOUND_DETECTING') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTING[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTING[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTING[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_SOUND_DETECTING[1];
                } else if (sensor == 'CM_IR_LEFT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[2];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[3];
                } else if (sensor == 'CM_IR_RIGHT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[2];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[3];
                } else if (sensor == 'CM_CALIBRATION_LEFT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[1];
                } else if (sensor == 'CM_CALIBRATION_RIGHT') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[1];
                } else if (sensor == 'CM_BUTTON_STATUS') {
                    data_default_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                    data_default_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
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
            func: function (sprite, script) {
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

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
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
            func: function (sprite, script) {
                // instruction / address / length / value / default length

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length =
                    Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_value = 0;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
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
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var direction = script.getField('DIRECTION', script);
                var directionAngle = script.getField('DIRECTION_ANGLE', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (direction == 'LEFT') {
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .AUX_MOTOR_SPEED_LEFT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .AUX_MOTOR_SPEED_LEFT[1];
                } else {
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .AUX_MOTOR_SPEED_RIGHT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .AUX_MOTOR_SPEED_RIGHT[1];
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

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
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
            func: function (sprite, script) {
                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE,
                    address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .AUX_MOTOR_SPEED_LEFT[0];

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
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var direction = script.getField('DIRECTION', script);
                var value = script.getNumberValue('VALUE');

                var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                if (direction == 'LEFT') {
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_LEFT[1];
                } else {
                    data_address =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[0];
                    data_length =
                        Entry.Robotis_carCont.CONTROL_TABLE
                            .CM_CALIBRATION_RIGHT[1];
                }

                data_value = value;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
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

Entry.Robotis_openCM70.getBlocks = function () {
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
            isNotFor: ['robotis_openCM70', 'robotis_openCM70EDU'],
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
};

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
