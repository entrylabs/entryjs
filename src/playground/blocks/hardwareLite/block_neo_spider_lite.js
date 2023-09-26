'use strict';

(function() {
    Entry.NeoSpiderLite = new (class NeoSpiderLite {
        constructor() {
            this.id = '41.1';
            this.name = 'NeoSpiderLite';
            this.url = 'http://www.neo3ds.com/';
            this.imageName = 'neospiderlite.png';
            this.title = {
                ko: '네오스파이더',
                en: 'NeoSpider',
            };
            this.duration = 32;
            this.blockMenuBlocks = [
                'neospiderlite_get_analog_value',
                'neospiderlite_get_analog_value_map',
                'neospiderlite_get_ultrasonic_value',
                'neospiderlite_get_motion_value',
                'neospiderlite_get_infared_value',
                'neospiderlite_set_servo',
                'neospiderlite_set_servo_direction',
                'neospiderlite_set_tone',
                'neospiderlite_motor_state',
                'neospiderlite_motor_state_secs',
                'neospiderlite_motor_stop',
                'neospiderlite_neopixel_color_picker',
                'neospiderlite_neopixel_color_picker_all_on',
                'neospiderlite_neopixel',
                'neospiderlite_neopixel_all_on',
                'neospiderlite_neopixel_all_off',
                'neospiderlite_outer_motor',
                'neospiderlite_outer_motor_pwm',
            ];
            this.portData = {
                baudRate: 115200,
                duration: 32,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: true,
            };
            this.__toneTable = {
                '0': 0,
                C: 1,
                CS: 2,
                D: 3,
                DS: 4,
                E: 5,
                F: 6,
                FS: 7,
                G: 8,
                GS: 9,
                A: 10,
                AS: 11,
                B: 12,
            };
            this.__toneMap = {
                '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
                '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
                '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
                '4': [39, 78, 156, 310, 622, 1245, 2637, 4978],
                '5': [41, 82, 165, 330, 659, 1319, 2794, 5274],
                '6': [44, 87, 175, 349, 698, 1397, 2849, 5588],
                '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
                '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
                '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
                '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
                '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
                '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
            };
            this.setZero();
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw_lite/neospiderlite.png',
                width: 256,
                height: 256,
                listPorts: {
                    GAS: {
                        name: '가스/외부센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    CDS: {
                        name: '조도센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    TMP: {
                        name: '온도센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    VIBE: {
                        name: '진동센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    LEFT_INFARED: {
                        name: '적외선(좌)',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    RIGHT_INFARED: {
                        name: '적외선(우)',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    ULTRASONIC: {
                        name: '초음파센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    MOTION: {
                        name: '모션센서',
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                },
                mode: 'both',
            };
        }

        getMonitorPort() {
            return { ...this.sensorData };
        }

        setZero() {
            this.txData = new Array(36).fill(0);

            this.sensorData = {
                LEFT_INFARED: 0,
                RIGHT_INFARED: 0,
                MOTION: 0,
                ULTRASONIC: 0,
                GAS: 0,
                CDS: 0,
                TMP: 0,
                VIBE: 0,
            };
            this.workerData = {
                OCTAVE: 0,
                NOTE: 0,
                ULTRASONIC: 0,
                MOTION: 0,
                MOTOR: 0,
                SERVO: 0,
                NEOPIXEL: [
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                    { RED: 0, GREEN: 0, BLUE: 0 },
                ],
                OUT_MOTOR_LEFT: 0,
                OUT_MOTOR_RIGHT: 0,
            };

            if (Entry.hwLite) {
                Entry.hwLite.update();
            }
        }

        getDataByBuffer(buffer) {
            const datas = [];
            let lastIndex = 0;
            buffer.forEach((value, idx) => {
                if (value == 13 && buffer[idx + 1] == 10) {
                    datas.push(buffer.subarray(lastIndex, idx));
                    lastIndex = idx + 2;
                }
            });
            return datas;
        }

        // 디바이스에서 값을 읽어온다.
        handleLocalData(data) {
            const datas = this.getDataByBuffer(data);
            const sensorData = this.sensorData;

            datas.forEach((data) => {
                if (data.length <= 4 || data[0] !== 255 || data[1] !== 16) {
                    return;
                }
                const readData = data.subarray(2, data.length);
                let value;
                let checkSum;
                const idx = readData[0];
                if (idx == 1) {
                    if (readData.length != 12) {
                        return;
                    }
                    const analogL0 = readData[1];
                    const analogS0 = readData[2];
                    const analogL1 = readData[3];
                    const analogS1 = readData[4];
                    const analogL2 = readData[5];
                    const analogS2 = readData[6];
                    const analogL3 = readData[7];
                    const analogS3 = readData[8];
                    const infaredLv = readData[9];
                    const infaredRv = readData[10];
                    checkSum =
                        (idx +
                            analogL0 +
                            analogS0 +
                            analogL1 +
                            analogS1 +
                            analogL2 +
                            analogS2 +
                            analogL3 +
                            analogS3 +
                            infaredLv +
                            infaredRv) &
                        0xff;
                    if (checkSum != readData[11]) {
                        return;
                    }
                    let tempValue = (analogL2 << 8) + analogS2;
                    tempValue = Math.log(10240000 / tempValue - 10000);
                    tempValue =
                        1 /
                        (0.001129148 +
                            0.000234125 * tempValue +
                            0.0000000876741 * tempValue * tempValue * tempValue);
                    tempValue = tempValue - 273.15 - 4.0; // Downsize temperature
                    sensorData.GAS = (analogL0 << 8) + analogS0;
                    sensorData.CDS = (analogL1 << 8) + analogS1;
                    sensorData.TMP = tempValue.toFixed(2);
                    sensorData.VIBE = (analogL3 << 8) + analogS3;
                    sensorData.LEFT_INFARED = infaredLv;
                    sensorData.RIGHT_INFARED = infaredRv;
                } else if (idx == 2 || idx == 3) {
                    if (readData.length != 6) {
                        return;
                    }
                    const subArray = new Uint8Array(readData.subarray(1, 5));
                    subArray.reverse();
                    const buffer = subArray.buffer;
                    const view = new DataView(buffer);
                    value = view.getFloat32(0);
                    value = Math.round(value * 100) / 100;
                    checkSum = (idx + value) & 0xff;
                    if (checkSum != readData[5]) {
                        return;
                    }
                    if (idx == 2) {
                        sensorData.ULTRASONIC = value;
                    } else {
                        sensorData.MOTION = value;
                    }
                }
            });
            this.sensorData = sensorData;
        }

        //디바이스에 값을 쓴다.
        requestLocalData() {
            const workerData = this.workerData;
            const txData = this.txData;
            let checkSum = 0;
            const dataLen = txData.length;

            txData[0] = 0xff;
            txData[1] = 0x24;
            txData[2] = workerData.OCTAVE;
            txData[3] = workerData.NOTE;
            txData[4] = workerData.ULTRASONIC;
            txData[5] = workerData.MOTION;
            txData[6] = workerData.MOTOR;
            txData[7] = workerData.SERVO;
            txData[8] = workerData.NEOPIXEL[0].RED;
            txData[9] = workerData.NEOPIXEL[0].GREEN;
            txData[10] = workerData.NEOPIXEL[0].BLUE;
            txData[11] = workerData.NEOPIXEL[1].RED;
            txData[12] = workerData.NEOPIXEL[1].GREEN;
            txData[13] = workerData.NEOPIXEL[1].BLUE;
            txData[14] = workerData.NEOPIXEL[2].RED;
            txData[15] = workerData.NEOPIXEL[2].GREEN;
            txData[16] = workerData.NEOPIXEL[2].BLUE;
            txData[17] = workerData.NEOPIXEL[3].RED;
            txData[18] = workerData.NEOPIXEL[3].GREEN;
            txData[19] = workerData.NEOPIXEL[3].BLUE;
            txData[20] = workerData.NEOPIXEL[4].RED;
            txData[21] = workerData.NEOPIXEL[4].GREEN;
            txData[22] = workerData.NEOPIXEL[4].BLUE;
            txData[23] = workerData.NEOPIXEL[5].RED;
            txData[24] = workerData.NEOPIXEL[5].GREEN;
            txData[25] = workerData.NEOPIXEL[5].BLUE;
            txData[26] = workerData.NEOPIXEL[6].RED;
            txData[27] = workerData.NEOPIXEL[6].GREEN;
            txData[28] = workerData.NEOPIXEL[6].BLUE;
            txData[29] = workerData.NEOPIXEL[7].RED;
            txData[30] = workerData.NEOPIXEL[7].GREEN;
            txData[31] = workerData.NEOPIXEL[7].BLUE;
            txData[32] = workerData.OUT_MOTOR_LEFT;
            txData[33] = workerData.OUT_MOTOR_RIGHT;
            txData[35] = 0xa;

            for (let i = 2; i < dataLen - 2; i++) {
                checkSum += txData[i];
            }
            txData[dataLen - 2] = checkSum & 255;

            this.tx_data = txData;

            return txData;
        }

        getAnalogValue(script) {
            let port = script.getValue('PORT', script);
            port = port === 'OUTER' ? 'GAS' : port;
            return this.sensorData[port];
        }

        getAnalogMapValue(script) {
            let port = script.getValue('PORT', script);
            const minValue = script.getNumberValue('MINV', script);
            const maxValue = script.getNumberValue('MAXV', script);
            const minTrans = script.getNumberValue('TMIN', script);
            const maxTrans = script.getNumberValue('TMAX', script);

            port = port === 'OUTER' ? 'GAS' : port;
            let value = this.sensorData[port];
            value = ((value - minValue) * (maxTrans - minTrans)) / maxValue - minValue + minTrans;

            if (value % 1 == 0) {
                value = Math.round(value);
            } else {
                value = Math.round((value * 100) / 100);
            }
            return value;
        }

        getUltrasonic() {
            this.workerData.ULTRASONIC = 1;
            return this.sensorData.ULTRASONIC || 0;
        }

        getMotion() {
            this.workerData.MOTION = 1;
            return this.sensorData.MOTION || 0;
        }

        getInfared(script) {
            const port = script.getValue('PORT', script);
            return this.sensorData[port] || 0;
        }

        setTone(script) {
            if (!script.isStart) {
                let note = script.getValue('NOTE', script);
                if (!Entry.Utils.isNumber(note)) {
                    note = this.__toneTable[note];
                }

                if (note < 0) {
                    note = 0;
                } else if (note > 12) {
                    note = 12;
                }

                let duration = script.getNumberValue('DURATION', script);

                if (duration <= 0) {
                    duration = 0;
                    this.workerData.OCTAVE = 0;
                    this.workerData.NOTE = 0;
                    return script.callReturn();
                }

                let octave = script.getNumberValue('OCTAVE', script) - 1;

                if (octave < 0) {
                    octave = 0;
                } else if (octave > 5) {
                    octave = 5;
                }

                let value = 0;
                if (note != 0) {
                    value = this.__toneMap[note][octave];
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                this.workerData.OCTAVE = value >> 8;
                this.workerData.NOTE = value & 255;

                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration + 32);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                this.workerData.OCTAVE = 0;
                this.workerData.NOTE = 0;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setServo(script) {
            let value = script.getNumberValue('VALUE', script);
            value = Math.min(130, value);
            value = Math.max(50, value);

            this.workerData.SERVO = value;
            return script.callReturn();
        }

        setMotor(script) {
            const state = script.getField('STATE');

            this.workerData.MOTOR = state;
            return script.callReturn();
        }

        setMotorSecs(script) {
            if (!script.isStart) {
                let state = script.getField('STATE');
                let duration = script.getNumberValue('DURATION', script);

                if (duration <= 0) {
                    duration = 0;
                    state = 0;
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                this.workerData.MOTOR = state;

                setTimeout(() => {
                    script.timeFlag = 0;
                }, duration + 32);

                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                this.workerData.MOTOR = 0;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setMotorStop(script) {
            this.workerData.MOTOR = 0;
            return script.callReturn();
        }

        setNeopixel(script) {
            let num = script.getNumberValue('NUM', script);
            const redPower = script.getNumberValue('RED', script);
            const greenPower = script.getNumberValue('GREEN', script);
            const bluePower = script.getNumberValue('BLUE', script);

            num = num & 7;

            this.workerData.NEOPIXEL[num].RED = redPower;
            this.workerData.NEOPIXEL[num].GREEN = greenPower;
            this.workerData.NEOPIXEL[num].BLUE = bluePower;
            return script.callReturn();
        }

        setAllNeopixel(script) {
            const redPower = script.getNumberValue('RED', script);
            const greenPower = script.getNumberValue('GREEN', script);
            const bluePower = script.getNumberValue('BLUE', script);

            for (let num = 0; num < 8; num++) {
                this.workerData.NEOPIXEL[num].RED = redPower;
                this.workerData.NEOPIXEL[num].GREEN = greenPower;
                this.workerData.NEOPIXEL[num].BLUE = bluePower;
            }

            return script.callReturn();
        }

        setNeopixelPicker(script) {
            let num = script.getNumberValue('NUM', script);
            const color = script.getStringField('COLOR');

            num = num & 7;

            const redPower = parseInt(color.substr(1, 2), 16);
            const greenPower = parseInt(color.substr(3, 2), 16);
            const bluePower = parseInt(color.substr(5, 2), 16);

            this.workerData.NEOPIXEL[num].RED = redPower;
            this.workerData.NEOPIXEL[num].GREEN = greenPower;
            this.workerData.NEOPIXEL[num].BLUE = bluePower;
            return script.callReturn();
        }

        setAllNeopixelPicker(script) {
            const color = script.getStringField('COLOR');

            const redPower = parseInt(color.substr(1, 2), 16);
            const greenPower = parseInt(color.substr(3, 2), 16);
            const bluePower = parseInt(color.substr(5, 2), 16);

            for (let num = 0; num < 8; num++) {
                this.workerData.NEOPIXEL[num].RED = redPower;
                this.workerData.NEOPIXEL[num].GREEN = greenPower;
                this.workerData.NEOPIXEL[num].BLUE = bluePower;
            }

            return script.callReturn();
        }

        setNeopixelOff(script) {
            for (let num = 0; num < 8; num++) {
                this.workerData.NEOPIXEL[num].RED = 0;
                this.workerData.NEOPIXEL[num].GREEN = 0;
                this.workerData.NEOPIXEL[num].BLUE = 0;
            }

            return script.callReturn();
        }

        setOuterMotor(script) {
            const port = script.getNumberValue('PORT', script);
            let state = script.getNumberValue('STATE', script);
            state = state ? 255 : 0;

            if (port == 5) {
                this.workerData.OUT_MOTOR_LEFT = state;
                this.workerData.OUT_MOTOR_RIGHT = 0;
            } else if (port == 6) {
                this.workerData.OUT_MOTOR_LEFT = 0;
                this.workerData.OUT_MOTOR_RIGHT = state;
            }

            return script.callReturn();
        }

        setOuterMotorPWM(script) {
            const port = script.getNumberValue('PORT', script);
            let power = script.getNumberValue('VALUE', script);

            power = Math.round(power);
            power = Math.max(power, 0);
            power = Math.min(power, 255);

            if (port == 5) {
                this.workerData.OUT_MOTOR_LEFT = power;
                this.workerData.OUT_MOTOR_RIGHT = 0;
            } else if (port == 6) {
                this.workerData.OUT_MOTOR_LEFT = 0;
                this.workerData.OUT_MOTOR_RIGHT = power;
            }

            return script.callReturn();
        }

        // Block
        setLanguage() {
            return {
                ko: {
                    template: {
                        neospiderlite_get_analog_value: '아날로그 %1 센서값',
                        neospiderlite_get_analog_value_map:
                            '아날로그 %1 센서값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                        neospiderlite_get_ultrasonic_value: '초음파 센서값',
                        neospiderlite_get_motion_value: '모션 센서 감지됨',
                        neospiderlite_get_infared_value: '적외선센서 %1 감지됨',
                        neospiderlite_set_tone: '부저를 %1 %2 음으로 %3 초 연주하기 %4',
                        neospiderlite_set_servo:
                            '머리방향 %1 의 각도로 정하기 (최소:50, 최대:130) %2',
                        neospiderlite_set_servo_direction: '머리방향 %1 바라보기 %2',
                        neospiderlite_motor_state: '네오스파이더 %1 이동하기 %2',
                        neospiderlite_motor_state_secs: '네오스파이더 %1(으)로 %2초 이동하기 %3',
                        neospiderlite_motor_stop: '네오스파이더 정지하기 %1',
                        neospiderlite_neopixel_color_picker: 'RGB LED %1번  %2 (으)로 켜기 %3',
                        neospiderlite_neopixel: 'RGB LED %1번  빨 %2 녹 %3 파 %4 (으)로 켜기 %5',
                        neospiderlite_neopixel_color_picker_all_on:
                            'RGB LED 전체 %1 (으)로 켜기 %2',
                        neospiderlite_neopixel_all_on:
                            'RGB LED 전체  빨 %1 녹 %2 파 %3 (으)로 켜기 %4',
                        neospiderlite_neopixel_all_off: 'RGB LED 전체 끄기 %1',
                        neospiderlite_outer_motor: '디지털 %1핀 %2 %3',
                        neospiderlite_outer_motor_pwm: '디지털 %1핀 %2 (으)로 정하기 %3',
                    },
                    Device: {
                        neospiderlite: '네오스파이더',
                    },
                    Menus: {
                        neospiderlite: '네오스파이더',
                    },
                },
                en: {
                    template: {
                        neospiderlite_get_analog_value: 'Analog %1 pin Sensor value',
                        neospiderlite_get_analog_value_map:
                            'Analog %1 value Map range %2 ~ %3 to %4 ~ %5',
                        neospiderlite_get_ultrasonic_value: 'Ultrasonic Sensor value',
                        neospiderlite_get_motion_value: 'Motion Sensor value',
                        neospiderlite_get_infared_value: 'Infared ray %1 Sensor value',
                        neospiderlite_set_tone: 'Play tone note %1 octave %2 beat %3 %4',
                        neospiderlite_set_servo: 'Set head direction as %1 (min:50, max:130) %2',
                        neospiderlite_set_servo_direction: 'Set head direction as %1 %2',
                        neospiderlite_motor_state: 'Move neospider %1 %2',
                        neospiderlite_motor_state_secs: 'Move neospider %1 %2 secs %3',
                        neospiderlite_motor_stop: 'Neospider stop %1',
                        neospiderlite_neopixel_color_picker: 'RGB LED number %1 turn on %2 %3',
                        neospiderlite_neopixel: 'RGB LED number %1 turn on R %2 G %3 B %4 %5',
                        neospiderlite_neopixel_color_picker_all_on: 'All RGB LED turn on %1 %2',
                        neospiderlite_neopixel_all_on: 'All RGB LED turn on R %1 G %2 B %3 %4',
                        neospiderlite_neopixel_all_off: 'All RGB LED turn off %1',
                        neospiderlite_outer_motor: 'Digital %1 pin %2 %3',
                        neospiderlite_outer_motor_pwm: 'Digital %1 pin %2 %3',
                    },
                    Device: {
                        neospiderlite: 'neospiderlite',
                    },
                    Menus: {
                        neospiderlite: 'NeoSpiderLite',
                    },
                },
            };
        }

        getBlocks() {
            return {
                neospiderlite_get_analog_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['가스', 'GAS'],
                                ['조도', 'CDS'],
                                ['온도', 'TMP'],
                                ['진동', 'VIBE'],
                                ['외부', 'OUTER'],
                            ],
                            value: 'GAS',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neospiderlite_get_analog_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'NeoSpiderLiteGet',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.getAnalogValue(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.analogRead(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['가스', 'GAS'],
                                            ['조도', 'CDS'],
                                            ['온도', 'TMP'],
                                            ['진동', 'VIBE'],
                                            ['외부', 'OUTER'],
                                        ],
                                        value: 'GAS',
                                        fontSize: 11,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringValueLowerCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_get_analog_value_map: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['가스', 'GAS'],
                                ['조도', 'CDS'],
                                ['온도', 'TMP'],
                                ['진동', 'VIBE'],
                                ['외부', 'OUTER'],
                            ],
                            value: 'GAS',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
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
                            {
                                type: 'number',
                                params: ['1023'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                        ],
                        type: 'neospiderlite_get_analog_value_map',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MINV: 1,
                        MAXV: 2,
                        TMIN: 3,
                        TMAX: 4,
                    },
                    class: 'NeoSpiderLiteGet',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.getAnalogMapValue(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.mapAnalog(%1, %2, %3, %4, %5)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['가스', 'GAS'],
                                            ['조도', 'CDS'],
                                            ['온도', 'TMP'],
                                            ['진동', 'VIBE'],
                                            ['외부', 'OUTER'],
                                        ],
                                        value: 'GAS',
                                        fontSize: 11,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringValueLowerCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
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
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_get_ultrasonic_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'neospiderlite_get_ultrasonic_value',
                    },
                    paramsKeyMap: {},
                    class: 'NeoSpiderLiteGet',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.getUltrasonic();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.getUltrasonic()',
                                blockType: 'param',
                                textParams: [],
                            },
                        ],
                    },
                },
                neospiderlite_get_motion_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'neospiderlite_get_motion_value',
                    },
                    paramsKeyMap: {},
                    class: 'NeoSpiderLiteGet',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.getMotion();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.getMotionValue()',
                                blockType: 'param',
                                textParams: [],
                            },
                        ],
                    },
                },
                neospiderlite_get_infared_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['왼쪽', 'LEFT_INFARED'],
                                ['오른쪽', 'RIGHT_INFARED'],
                            ],
                            value: 'LEFT_INFARED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neospiderlite_get_infared_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'NeoSpiderLiteGet',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.getInfared(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.getInfaredValue(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['왼쪽', 'LEFT_INFARED'],
                                            ['오른쪽', 'RIGHT_INFARED'],
                                        ],
                                        value: 'LEFT_INFARED',
                                        fontSize: 11,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringValueLowerCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_tone_list: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.silent, '0'],
                                [Lang.Blocks.do_name, 'C'],
                                [Lang.Blocks.do_sharp_name, 'CS'],
                                [Lang.Blocks.re_name, 'D'],
                                [Lang.Blocks.re_sharp_name, 'DS'],
                                [Lang.Blocks.mi_name, 'E'],
                                [Lang.Blocks.fa_name, 'F'],
                                [Lang.Blocks.fa_sharp_name, 'FS'],
                                [Lang.Blocks.sol_name, 'G'],
                                [Lang.Blocks.sol_sharp_name, 'GS'],
                                [Lang.Blocks.la_name, 'A'],
                                [Lang.Blocks.la_sharp_name, 'AS'],
                                [Lang.Blocks.si_name, 'B'],
                            ],
                            value: 'C',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                    },
                    func(sprite, script) {
                        return script.getField('NOTE');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.silent, '0'],
                                            [Lang.Blocks.do_name, 'C'],
                                            [Lang.Blocks.do_sharp_name, 'CS'],
                                            [Lang.Blocks.re_name, 'D'],
                                            [Lang.Blocks.re_sharp_name, 'DS'],
                                            [Lang.Blocks.mi_name, 'E'],
                                            [Lang.Blocks.fa_name, 'F'],
                                            [Lang.Blocks.fa_sharp_name, 'FS'],
                                            [Lang.Blocks.sol_name, 'G'],
                                            [Lang.Blocks.sol_sharp_name, 'GS'],
                                            [Lang.Blocks.la_name, 'A'],
                                            [Lang.Blocks.la_sharp_name, 'AS'],
                                            [Lang.Blocks.si_name, 'B'],
                                        ],
                                        value: 'C',
                                        fontSize: 11,
                                        converter:
                                            Entry.block.converters.returnStringValueUpperCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    },
                                ],
                                keyOption: 'neospiderlite_tone_list',
                            },
                        ],
                    },
                },
                neospiderlite_tone_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'neospiderlite_tone_list',
                            },
                        ],
                        type: 'neospiderlite_tone_value',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                    },
                    func(sprite, script) {
                        return script.getNumberValue('NOTE');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                keyOption: 'neospiderlite_tone_value',
                            },
                        ],
                    },
                },
                neospiderlite_octave_list: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    template: '%1',
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                    },
                    paramsKeyMap: {
                        OCTAVE: 0,
                    },
                    func(sprite, script) {
                        return script.getField('OCTAVE');
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: '%1',
                                keyOption: 'neospiderlite_octave_list',
                            },
                        ],
                    },
                },
                neospiderlite_set_tone: {
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
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
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
                                type: 'neospiderlite_tone_list',
                            },
                            {
                                type: 'neospiderlite_octave_list',
                            },
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'neospiderlite_set_tone',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        DURATION: 2,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setTone(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.tone(%1, %2, %3)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_set_servo: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [90],
                        type: 'neospiderlite_set_servo',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setServo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.servomotorWrite(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_set_servo_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['앞', '90'],
                                ['왼쪽', '50'],
                                ['오른쪽', '130'],
                            ],
                            value: '90',
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
                        type: 'neospiderlite_set_servo_direction',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setServo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.servomotorWrite(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_motor_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['앞으로', 1],
                                ['왼쪽으로', 2],
                                ['오른쪽으로', 3],
                                ['뒤로', 4],
                            ],
                            value: 1,
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
                        type: 'neospiderlite_motor_state',
                    },
                    paramsKeyMap: {
                        STATE: 0,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setMotor(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.motorState(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['앞으로', '1'],
                                            ['왼쪽으로', '2'],
                                            ['오른쪽으로', '3'],
                                            ['뒤로', '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringValueUpperCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_motor_state_secs: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['앞으로', 1],
                                ['왼쪽으로', 2],
                                ['오른쪽으로', 3],
                                ['뒤로', 4],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
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
                        type: 'neospiderlite_motor_state_secs',
                    },
                    paramsKeyMap: {
                        STATE: 0,
                        DURATION: 1,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setMotorSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.motorStateSecs(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['앞으로', '1'],
                                            ['왼쪽으로', '2'],
                                            ['오른쪽으로', '3'],
                                            ['뒤로', '4'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringValueUpperCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_motor_stop: {
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
                        type: 'neospiderlite_motor_stop',
                    },
                    paramsKeyMap: {},
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setMotorStop(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.motorStop()',
                                textParams: [],
                            },
                        ],
                    },
                },
                neospiderlite_neopixel: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
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
                                params: ['100'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                            null,
                        ],
                        type: 'neospiderlite_neopixel',
                    },
                    paramsKeyMap: {
                        NUM: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setNeopixel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.neopixel(%1, %2, %3, %4)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
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
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_neopixel_color_picker: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Color',
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
                            null,
                            null,
                        ],
                        type: 'neospiderlite_neopixel_color_picker',
                    },
                    paramsKeyMap: {
                        NUM: 0,
                        COLOR: 1,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setNeopixelPicker(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.neopixelColorPicker(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Color',
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_neopixel_color_picker_all_on: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Color',
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
                        type: 'neospiderlite_neopixel_color_picker_all_on',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setAllNeopixelPicker(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.neopixelColorPickerAllOn(%1)',
                                textParams: [
                                    {
                                        type: 'Color',
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_neopixel_all_on: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
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
                                params: ['100'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                            {
                                type: 'number',
                                params: ['100'],
                            },
                            null,
                        ],
                        type: 'neospiderlite_neopixel_all_on',
                    },
                    paramsKeyMap: {
                        RED: 0,
                        GREEN: 1,
                        BLUE: 2,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setAllNeopixel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.neopixelAllON(%1, %2, %3)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_neopixel_all_off: {
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
                        type: 'neospiderlite_neopixel_all_off',
                    },
                    paramsKeyMap: {},
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setNeopixelOff(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.neopixelAllOFF()',
                                textParams: [],
                            },
                        ],
                    },
                },
                neospiderlite_outer_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['5', '5'],
                                ['6', '6'],
                            ],
                            value: '5',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['LOW', '0'],
                                ['HIGH', '1'],
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
                        params: [5, null],
                        type: 'neospiderlite_outer_motor',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        STATE: 1,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setOuterMotor(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.outerDigitalPin(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['5', '5'],
                                            ['6', '6'],
                                        ],
                                        value: '5',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['LOW', '0'],
                                            ['HIGH', '1'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    },
                                ],
                            },
                        ],
                    },
                },
                neospiderlite_outer_motor_pwm: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['5', '5'],
                                ['6', '6'],
                            ],
                            value: '5',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [5, null],
                        type: 'neospiderlite_outer_motor_pwm',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'NeoSpiderLite',
                    isNotFor: ['NeoSpiderLite'],
                    func(sprite, script) {
                        return Entry.NeoSpiderLite.setOuterMotorPWM(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'NeoSpiderLite.outerDigitalPinPWM(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['5', '5'],
                                            ['6', '6'],
                                        ],
                                        value: '5',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
            };
        }
    })();
})();

module.exports = Entry.NeoSpiderLite;
