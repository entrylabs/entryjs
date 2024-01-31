'use strict';
(function() {
    /*
 엔트리에 정의된 블럭 명령어
 엔트리에서 받을 때는 BlockTypes 로 통신하고,
 하드웨어로 전송할 때는 Command 로 변환 후 Pdu 로 Wrapping 하여 전송한다.
 */
    const NeoBlockType = {
        // MOTOR 명령어 0x1X
        MOTOR_MOVE: 0x11,
        MOTOR_MOVE_BOTH: 0x12,
        MOTOR_STOP: 0x13,
        ROBOT_MOVE: 0x14,
        ROBOT_STOP: 0x15,
        // SERVO 명령어 0x2X
        SERVO_RESET: 0x21,
        SERVO_ANGLE: 0x22,
        SERVO_ANGLE_WAIT: 0x23,
        SERVO_ROTATE: 0x24,
        SERVO_STOP: 0x25,
        // LINE_TRACER 명령어 0x3X
        LINE_TRACER_START: 0x31,
        LINE_CROSS_MOVE: 0x32,
        LINE_CROSS_TURN: 0x33,
        LINE_CHANGE_START: 0x34,
        LINE_CHANGE_TURN: 0x35,
        // AUTO_DRIVING 명령어 0x4X
        AUTO_DRIVING_START: 0x41,
        AUTO_DRIVING_SENSOR_START: 0x42,
        AUTO_DRIVING_STOP: 0x43,
        AUTO_PARKING_START: 0x44,
        AUTO_DETECT_WALL_START: 0x45,
        AUTO_DETECT_WALL_TURN: 0x46,
        // LED 명령어 0x5X
        LED_ON: 0x51,
        LED_BLINK: 0x52,
        LED_OFF: 0x53,
        COLOR_LED_ON: 0x54,
        COLOR_LED_OFF: 0x55,
        COLOR_LED_ON_SENSOR: 0x56,
        // SET_OUTPUT 명령어 0x6X
        SET_OUTPUT: 0x61,
        // BUZZER 명령어 0x7X
        BUZZER_START: 0x71,
        BUZZER_WITH_SENSOR: 0x72,
        BUZZER_STOP: 0x73,
        // LCD 명령어 0x8X
        LCD_IMAGE: 0x81,
        LCD_TEXT: 0x82,
    };

    /*
     PDU 정의
     */
    const HEADER = [0xaa, 0xaa, 0xcc];
    const IDX_LENGTH = 3;
    const IDX_FRAME_CODE = 4;
    const IDX_PDU_CODE = 5;
    const IDX_ACK_NUM = 6;

    const FrameCode = {
        BASIC: 0x01,
        CONNECTION: 0x02,
    };

    const PduConnectionCode = {
        PAIRING_START: 0x01,
        PAIRING_INFO: 0x03,
        PAIRING_REMOVE: 0x06,
        NOTIFY_LIVE: 0x07,
    };

    const PduBasicCode = {
        SENSOR_DATA: 0x01,
        BASIC: 0x10,
        EXTEND_1: 0x11,
    };

    const SensorKind = {
        CONTROLLER: 0x00,
        ANALOG: 0x01,
        DIGITAL: 0x02,
        COLOR: 0x03,
    };

    const PduCode = {
        SENSOR_DATA: 0x01,
        CONTROLLER_COMMAND: 0x02,
        ACTION_COMMAND: 0x03,
        BASIC: 0x10,
        EXTEND_1: 0x11,
        EXTEND_2: 0x12,
        EXTEND_3: 0x13,
    };

    const ActorKind = {
        CONTROLLER: 0x00,
        LED: 0x80,
        SERVO: 0x81,
        COLOR_LED: 0x82,
        LCD: 0x83,
    };

    const ControllerCommand = {
        CONTROLLER_LED: 0x01,
        BUZZER: 0x02,
        MOTOR: 0x03,
        MOTOR_BOTH: 0x04,
        ROBOT: 0x05,
        LINE_TRACER: 0x06,
        AUTO_DRIVING: 0x07,
        AUTO_PARKING: 0x08,
        AUTO_DETECT_WALL: 0x09,
    };

    const ServoCommand = {
        STOP: 0x01,
        RESET: 0x02,
        ANGLE: 0x03,
        ANGLE_WAIT: 0x04,
        ROTATE: 0x05,
    };

    const LedCommand = {
        OFF: 0x00,
        ON: 0x01,
    };

    const LcdCommand = {
        IMAGE: 0x01,
        TEXT: 0x02,
    };

    const UnitId = {
        CONTROLLER: 0x00,
        CONTROLLER_IN1: 0x01,
        CONTROLLER_IN2: 0x02,
        CONTROLLER_IN3: 0x03,
        SENSOR_STICK: 0x10,
        SENSOR_STICK_IN1: 0x11,
        IOT: 0x80,
        CONTROLLER_OUT1: 0x81,
        CONTROLLER_OUT2: 0x82,
        CONTROLLER_OUT12: 0x83,
        CONTROLLER_OUT3: 0x84,
        CONTROLLER_OUT13: 0x85,
        CONTROLLER_OUT23: 0x86,
        CONTROLLER_OUT123: 0x87,
        CONTROLLER_OUT_ALL: 0x8f,
    };

    /*
     블럭 실행 단계
     execute: 최초 실행
     pending_response: 최초 실행의 response 대기중인 상태
     set_timeout: 블럭에서 duration 필드에 의거하여 타임아웃을 설정
     wait_timeout: timeout 대기중인 상태
     stop: 파라미터를 0으로 바꿔서 실행
     pending_stop: 파라미터를 0으로 바꾼 실행의 response 대기중인 상태
     end: 실행 종료 단계
     */
    const ExecPhase = {
        EXECUTE: 'execute',
        PENDING_RESPONSE: 'pending_response',
        SET_TIMEOUT: 'set_timeout',
        WAIT_TIMEOUT: 'wait_timeout',
        STOP: 'stop',
        PENDING_STOP: 'pending_stop',
        END: 'end',
    };

    Entry.NeoLite = new (class NeoLite {
        constructor() {
            this.id = '5.8';
            this.name = 'NeoLite';
            this.url = 'http://neobot.co.kr/';
            this.imageName = 'neo_lite.png';
            this.portData = {
                baudRate: 500000,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                duration: 32,
                constantServing: true,
            };
            this.duration = 32;

            this.sensorValues = {
                controllerBattery: 0,
                irCode: 0,
                in1Kind: 0,
                in1Values: [0, 0, 0, 0],
                in2Kind: 0,
                in2Values: [0, 0, 0, 0],
                in3Kind: 0,
                in3Values: [0, 0, 0, 0],
                sensorStickBattery: 0,
                in4Kind: 0,
                in4Values: [0, 0, 0, 0],
            }; // 센서 데이터

            this.blockMenuBlocks = [
                // robot
                'neo_lite_robot_title',
                'neo_lite_robot_move',
                'neo_lite_robot_stop',
                // auto driving
                'neo_lite_auto_driving_title',
                'neo_lite_auto_driving_start',
                'neo_lite_auto_driving_sensor_start',
                'neo_lite_auto_driving_stop',
                // auto parking
                'neo_lite_auto_parking_title',
                'neo_lite_auto_parking_start',
                // line tracer
                'neo_lite_line_tracer_title',
                'neo_lite_line_tracer_start',
                'neo_lite_line_cross_move',
                'neo_lite_line_cross_turn',
                // motor
                'neo_lite_motor_title',
                'neo_lite_motor_move',
                'neo_lite_motor_move_both',
                'neo_lite_motor_stop',
                // servo
                'neo_lite_servo_title',
                'neo_lite_servo_reset',
                'neo_lite_servo_angle',
                'neo_lite_servo_angle_var',
                'neo_lite_servo_angle_wait',
                'neo_lite_servo_rotate',
                'neo_lite_servo_stop',

                // led
                'neo_lite_led_title',
                'neo_lite_led_on',
                'neo_lite_led_blink',
                'neo_lite_led_off',

                // set output
                'neo_lite_set_output_title',
                'neo_lite_set_output',

                // color led
                'neo_lite_color_led_title',
                'neo_lite_color_led_on',
                'neo_lite_color_led_off',
                'neo_lite_color_led_on_with_sensor',

                // sensor
                'neo_lite_sensor_title',
                'neo_lite_sensor_in',
                'neo_lite_sensor_digital_in',
                'neo_lite_sensor_convert',
                'neo_lite_sensor_compare',
                'neo_lite_sensor_between',
                'neo_lite_sensor_digital_compare',
                'neo_lite_sensor_color_compare',
                'neo_lite_sensor_color_sequence_compare',
                'neo_lite_sensor_button_pressed',
                // buzzer
                'neo_lite_buzzer_title',
                'neo_lite_buzzer_start',
                'neo_lite_buzzer_with_sensor',
                'neo_lite_buzzer_stop',
                // lcd
                'neo_lite_lcd_title',
                'neo_lite_lcd_image',
                'neo_lite_lcd_text',
            ];

            this.executeList = [];
            this.pendingResponseList = {};

            this.isDebug = false;
            this.isDebugSensor = false;
            this.isDebugPdu = false;

            this.seqBlockId = 0;

            this.setZero();
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw/neo.png',
                width: 700,
                height: 700,
                listPorts: {
                    IN11: { name: 'IN1 1', type: 'input', pos: { x: 0, y: 0 } },
                    IN12: { name: 'IN1 2', type: 'input', pos: { x: 0, y: 0 } },
                    IN13: { name: 'IN1 3', type: 'input', pos: { x: 0, y: 0 } },
                    IN14: { name: 'IN1 4', type: 'input', pos: { x: 0, y: 0 } },
                    IN21: { name: 'IN2 1', type: 'input', pos: { x: 0, y: 0 } },
                    IN22: { name: 'IN2 2', type: 'input', pos: { x: 0, y: 0 } },
                    IN23: { name: 'IN2 3', type: 'input', pos: { x: 0, y: 0 } },
                    IN24: { name: 'IN2 4', type: 'input', pos: { x: 0, y: 0 } },
                    IN31: { name: 'IN3 1', type: 'input', pos: { x: 0, y: 0 } },
                    IN32: { name: 'IN3 2', type: 'input', pos: { x: 0, y: 0 } },
                    IN33: { name: 'IN3 3', type: 'input', pos: { x: 0, y: 0 } },
                    IN34: { name: 'IN3 4', type: 'input', pos: { x: 0, y: 0 } },
                    IR: { name: 'IR', type: 'input', pos: { x: 0, y: 0 } },
                    BAT: { name: 'BAT', type: 'input', pos: { x: 0, y: 0 } },
                },
                mode: 'both',
            };
        }

        setZero() {
            if (Entry.hwLite) {
                const blockId = this.generateBlockId();
                const pdu = this.makePdu([
                    FrameCode.BASIC,
                    PduCode.CONTROLLER_COMMAND,
                    blockId,
                    0x04,
                ]);
                this.executeList = [
                    {
                        blockId,
                        pdu,
                    },
                ];
                Entry.hwLite.update();
            }
        }

        /*
        연결 후 초기에 송신할 데이터가 필요한 경우 사용합니다.
        requestInitialData 를 사용한 경우 checkInitialData 가 필수입니다.
        이 두 함수가 정의되어있어야 로직이 동작합니다. 필요없으면 작성하지 않아도 됩니다.
        */
        requestInitialData() {
            this.logPdu('request initial data (request paring info to hw)');
            return this.makePdu(this.getPairingInfoCmd());
        }

        validateLocalData(pdu) {
            return true;
        }

        async initialHandshake() {
            const initPdu = this.requestInitialData();
            this.executeList.push({
                blockId: 0,
                pdu: initPdu,
            });
            Entry.hwLite.update();
            return true;
        }

        /**
         * 하드웨어에서 온 데이터 처리
         * @param {ArrayBuffer} data
         */
        handleLocalData(data) {
            this.logPdu(`incoming pdu : ${this.byteArrayToHex(data)}`);
            let validPdu = this.getValidPdu(data);
            while (validPdu) {
                this.onReceivePdu(validPdu);
                if (!this.remainingPdu || this.remainingPdu.length <= 0) {
                    break;
                }
                validPdu = this.getValidPdu([]);
            }
        }

        /**
         * remainingPdu 와 병합 처리하여 유효한 pdu 를 반환한다.
         * 전체 길이가 짧을 경우 remainingPdu 에 저장 후 다음에 오는 패킷과 병합하여 처리함.
         * 전체 길이가 Pdu Length 보다 길 경우 유효한 부분까지만 잘라 쓰고
         * 나머지는 remainingPdu 에 저장 후 다음에 오는 패킷과 병합하여 처리함.
         * @param pdu
         * @return {null|Array} validPdu
         */
        getValidPdu(pdu) {
            const mergedPdu = [];
            if (this.remainingPdu) {
                mergedPdu.push(...this.remainingPdu);
                this.remainingPdu = null;
            }
            mergedPdu.push(...pdu);
            this.logPdu(`merged pdu : ${this.byteArrayToHex(mergedPdu)}`);
            if (mergedPdu.length < 4) {
                this.remainingPdu = [...mergedPdu];
                this.logPdu(`too short header : ${this.byteArrayToHex(mergedPdu)}`);
                return null;
            }

            // 헤더 불일치는 버림
            if (!this.checkHeader(mergedPdu)) {
                this.logPdu(`incorrect header : ${this.byteArrayToHex(mergedPdu)}`);
                return null;
            }

            // 유효 데이터 길이는 data length + header length (3) + length byte (1) + checksum byte (1)
            const validDataLength = mergedPdu[IDX_LENGTH] + HEADER.length + 1 + 1;
            /*
            전체 길이가 유효 데이터 길이보다 작을 경우
            아직 도착하지 않은 부분이 있으므로 병합을 위해 remainingPdu 에 저장
             */
            if (mergedPdu.length < validDataLength) {
                this.logPdu(`too short pdu : ${this.byteArrayToHex(mergedPdu)}`);
                this.remainingPdu = [...mergedPdu];
                this.logPdu(`remaining pdu : ${this.byteArrayToHex(this.remainingPdu)}`);
                return null;
            }

            /*
            전체 길이가 유효 데이터 길이보다 클 경우
            유효한 부분만 잘라내고 나머지는 remainingPdu 에 저장
             */
            if (mergedPdu.length > validDataLength) {
                this.logPdu(`too long pdu : ${this.byteArrayToHex(mergedPdu)}`);
                this.remainingPdu = mergedPdu.slice(validDataLength, mergedPdu.length);
                this.logPdu(`remaining pdu : ${this.byteArrayToHex(this.remainingPdu)}`);
            }

            const validPdu = mergedPdu.slice(0, validDataLength);
            //this.logPdu(`valid pdu : ${this.byteArrayToHex(validPdu)}`);

            /*
            유효 Pdu 의 checksum 확인
             */
            const dataLength = validPdu[IDX_LENGTH];
            let checkSum = 0;
            for (let i = 0; i < dataLength; i++) {
                checkSum += validPdu[i + 4];
            }
            checkSum = checkSum & 255;
            const pduCheckSum = validPdu[HEADER.length + 1 + dataLength];
            if (pduCheckSum !== checkSum) {
                this.logPdu(`checksum error : ${pduCheckSum} ${checkSum}`);
                return null;
            }

            if (validPdu[IDX_FRAME_CODE] === 0xfe) {
                this.logPdu('error data arrived!!');
            }

            return validPdu;
        }

        /**
         * 유효한 pdu 수신 처리함.
         * 센서 데이터 수신, Action Command 의 Response 만 처리함.
         * 나머지는 NEO Platform 전용이므로 무시함.
         * @param pdu
         */
        onReceivePdu(pdu) {
            if (pdu[IDX_FRAME_CODE] === FrameCode.BASIC) {
                if (pdu[IDX_PDU_CODE] === PduBasicCode.SENSOR_DATA) {
                    // this.logD(this.byteArrayToHex(pdu));
                    this.parseSensorPdu(pdu);
                    return;
                }

                this.logD(this.byteArrayToHex(pdu));

                const responseData = this.parseResponsePdu(pdu);

                if (responseData && responseData.blockId) {
                    if (this.pendingResponseList[responseData.blockId]) {
                        delete this.pendingResponseList[responseData.blockId];
                    }
                }
            }
        }

        parseSensorPdu(pdu) {
            let body = pdu.slice(IDX_PDU_CODE + 1, pdu.length - 1);
            this.logSensor(`sensor pdu : ${this.byteArrayToHex(body)}`);
            while (body && body.length > 0) {
                const sensorDataKind = body[0];
                const unitId = body[1];
                const valueLength = body[2];
                const value = body.slice(3, 3 + valueLength);
                const buffer = Buffer.from(value);
                if (sensorDataKind === SensorKind.CONTROLLER) {
                    if (unitId === UnitId.CONTROLLER) {
                        this.sensorValues.irCode = buffer.readInt16LE(2);
                        this.sensorValues.controllerBattery = buffer.readInt16LE(4);
                    }
                }
                if (sensorDataKind === SensorKind.ANALOG) {
                    const analogValue = buffer.readInt16LE(0);
                    if (unitId === UnitId.CONTROLLER_IN1) {
                        this.sensorValues.in1Values = [analogValue, 0, 0, 0];
                    } else if (unitId === UnitId.CONTROLLER_IN2) {
                        this.sensorValues.in2Values = [analogValue, 0, 0, 0];
                    } else if (unitId === UnitId.CONTROLLER_IN3) {
                        this.sensorValues.in3Values = [analogValue, 0, 0, 0];
                    }
                } else if (
                  sensorDataKind === SensorKind.DIGITAL ||
                  sensorDataKind === SensorKind.COLOR
                ) {
                    const value1 = buffer.readInt16LE(0);
                    const value2 = buffer.readInt16LE(2);
                    const value3 = buffer.readInt16LE(4);
                    const value4 = buffer.readInt16LE(6);
                    if (unitId === UnitId.CONTROLLER_IN1) {
                        this.sensorValues.in1Values = [value1, value2, value3, value4];
                    } else if (unitId === UnitId.CONTROLLER_IN2) {
                        this.sensorValues.in2Values = [value1, value2, value3, value4];
                    } else if (unitId === UnitId.CONTROLLER_IN3) {
                        this.sensorValues.in3Values = [value1, value2, value3, value4];
                    }
                }
                body = body.slice(3 + valueLength, body.length);
            }
            this.logSensor(`sensor data : ${JSON.stringify(this.sensorValues)}`);
        }

        parseResponsePdu(pdu) {
            return {
                blockId: pdu[IDX_PDU_CODE + 1],
                result: pdu[IDX_PDU_CODE + 2],
            };
        }

        getMonitorPort() {
            return {
                IN11: this.sensorValues.in1Values[0],
                IN12: this.sensorValues.in1Values[1],
                IN13: this.sensorValues.in1Values[2],
                IN14: this.sensorValues.in1Values[3],
                IN21: this.sensorValues.in2Values[0],
                IN22: this.sensorValues.in2Values[1],
                IN23: this.sensorValues.in2Values[2],
                IN24: this.sensorValues.in2Values[3],
                IN31: this.sensorValues.in3Values[0],
                IN32: this.sensorValues.in3Values[1],
                IN33: this.sensorValues.in3Values[2],
                IN34: this.sensorValues.in3Values[3],
                IR: this.sensorValues.irCode,
                BAT: this.sensorValues.controllerBattery,
            };
        }
        requestLocalData() {
            if (Entry.hwLite) {
                if (this.executeList.length > 0) {
                    const executeData = this.executeList.shift();
                    this.logD(this.byteArrayToHex(executeData.pdu));
                    return executeData.pdu;
                }
            }
            return null;
        }

        getCheckSum(command) {
            let checkSum = 0;
            for (let i = 0; i < command.length; i++) {
                checkSum += command[i];
            }
            return checkSum & 255;
        }

        /**
         * pdu 길이 확인
         * 전체 길이는 pdu[3] data length + header(3) + length byte(1) + checkSum byte(1)
         * @param pdu
         * @return {boolean} result
         */
        checkPduLength(pdu) {
            const dataLength = pdu[IDX_LENGTH];
            return pdu.length >= dataLength + HEADER.length + 1 + 1;
        }

        /**
         * pdu 의 시작이 HEADER 와 일치하는지 확인
         * @param pdu
         * @return {boolean} result
         */
        checkHeader(pdu) {
            if (pdu.length < HEADER.length) {
                return false;
            }

            for (let i = 0; i < HEADER.length; i++) {
                if (HEADER[i] !== pdu[i]) {
                    return false;
                }
            }

            return true;
        }

        getUnitId(port) {
            switch (port) {
                case 'OUT1':
                    return UnitId.CONTROLLER_OUT1;
                case 'OUT2':
                    return UnitId.CONTROLLER_OUT2;
                case 'OUT3':
                    return UnitId.CONTROLLER_OUT3;
                case 'OUT12':
                    return UnitId.CONTROLLER_OUT12;
                case 'OUT123':
                    return UnitId.CONTROLLER_OUT_ALL;
                case 'IN1':
                    return UnitId.CONTROLLER_IN1;
                case 'IN2':
                    return UnitId.CONTROLLER_IN2;
                case 'IN3':
                    return UnitId.CONTROLLER_IN3;
            }
            return UnitId.CONTROLLER;
        }

        /**
         * 페어링 정보 요청 command (handshake 로 사용)
         * @return {Array} Pairing Info command
         */
        getPairingInfoCmd() {
            return [FrameCode.CONNECTION, PduConnectionCode.PAIRING_INFO];
        }

        makePdu(command) {
            const pdu = [];
            pdu.push(...HEADER);
            pdu.push(command.length);
            pdu.push(...command);
            pdu.push(this.getCheckSum(command));
            return pdu;
        }

        requestCommand(blockId, type, params) {
            if (this.pendingResponseList[blockId]) {
                delete this.pendingResponseList[blockId];
            }
            this.pendingResponseList[blockId] = 'executed';
            const command = this.makeCommand(blockId, type, params);
            if (!command) return;
            const pdu = this.makePdu(command);
            this.executeList.push({
                blockId,
                pdu,
            });
            // Entry.hwLite.writePortData(pdu);
        }

        requestExtCommand(blockId, type, params) {
            if (this.pendingResponseList[blockId]) {
                delete this.pendingResponseList[blockId];
            }
            this.pendingResponseList[blockId] = 'executed';
            const command = this.makeCommandExt(blockId, type, params);
            if (!command) return;
            const pdu = this.makePdu(command);
            this.executeList.push({
                blockId,
                pdu,
            });
        }

        requestExt2Command(blockId, type, params) {
            if (this.pendingResponseList[blockId]) {
                delete this.pendingResponseList[blockId];
            }
            this.pendingResponseList[blockId] = 'executed';
            const command = this.makeCommandExt2(blockId, type, params);
            if (!command) return;
            const pdu = this.makePdu(command);
            this.executeList.push({
                blockId,
                pdu,
            });
        }

        generateBlockId() {
            this.seqBlockId += 1;
            if (this.seqBlockId > 255) {
                this.seqBlockId = 1;
            }
            return this.seqBlockId;
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        // robot
                        neo_lite_robot_title: '로봇',
                        neo_lite_robot_move: '로봇 제어하기 %1 %2 %3 %4',
                        neo_lite_robot_stop: '로봇 멈추기 %1',

                        // auto driving
                        neo_lite_auto_driving_title: '자율주행',
                        neo_lite_auto_driving_start: '자율주행 시작하기 %1 %2 %3',
                        neo_lite_auto_driving_sensor_start: '%1 를 감지하여 자율주행 %2 %3',
                        neo_lite_auto_driving_stop: '자율주행 멈추기 %1',

                        // auto parking
                        neo_lite_auto_parking_title: '자율주차',
                        neo_lite_auto_parking_start: '주차하기 %1 %2 %3',

                        // line tracer
                        neo_lite_line_tracer_title: '라인트레이서',
                        neo_lite_line_tracer_start: '검은색 선 따라가기 %1 %2 %3',
                        neo_lite_line_cross_move: '%1 교차로까지 직진하기 %2',
                        neo_lite_line_cross_turn: '%1 교차로에서 방향바꾸기 %2 %3',

                        // motor
                        neo_lite_motor_title: '회전모터',
                        neo_lite_motor_move: '회전모터 제어하기 %1 %2 %3 %4',
                        neo_lite_motor_move_both: '회전모터 동시에 제어하기 L %1 R %2 %3',
                        neo_lite_motor_stop: '회전모터 멈추기 %1 %2',

                        // servo
                        neo_lite_servo_title: '서보모터',
                        neo_lite_servo_reset: '%1 서보모터 현위치를 0도로 설정하기 %2',
                        neo_lite_servo_angle: '서보모터 각도 바꾸기 %1 %2 %3 %4',
                        neo_lite_servo_angle_var: '서보모터 각도 바꾸기 %1 %2 %3 %4',
                        neo_lite_servo_angle_wait: '각도 바뀔때까지 기다리기 %1 %2 %3 %4',
                        neo_lite_servo_rotate: '서보모터 회전하기 %1 %2 %3 %4',
                        neo_lite_servo_stop: '서보모터 멈추기 %1 %2',

                        // led
                        neo_lite_led_title: 'LED',
                        neo_lite_led_on: 'LED 켜기 %1 %2 %3 %4',
                        neo_lite_led_blink: 'LED 깜빡이기 %1 %2 %3 %4',
                        neo_lite_led_off: 'LED 끄기 %1 %2',

                        // set output
                        neo_lite_set_output_title: '출력',
                        neo_lite_set_output: '값 출력하기 %1 %2 %3 %4',

                        // color led
                        neo_lite_color_led_title: '컬러 LED',
                        neo_lite_color_led_on: '컬러LED 켜기 %1 %2 %3 %4',
                        neo_lite_color_led_off: '컬러LED 끄기 %1 %2',
                        neo_lite_color_led_on_with_sensor: '컬러센서 %1 로 컬러LED %2 제어 %3',

                        // sensor
                        neo_lite_sensor_title: '센서',
                        neo_lite_sensor_in: '%1',
                        neo_lite_sensor_digital_in: '%1 의 %2',
                        neo_lite_sensor_convert: '%1 : %2 %3 → %4 %5',
                        neo_lite_sensor_compare: '%1 %2 %3',
                        neo_lite_sensor_between: '%1 %2 %3 %4 %5',
                        neo_lite_sensor_digital_compare: '%1 의 %2 %3 %4',
                        neo_lite_sensor_color_compare: '%1 = %2',
                        neo_lite_sensor_color_sequence_compare: '%1 = %2',
                        neo_lite_sensor_button_pressed: '%1 %2',

                        // buzzer
                        neo_lite_buzzer_title: '버저',
                        neo_lite_buzzer_start: '버저 울리기 %1 %2 %3 %4',
                        neo_lite_buzzer_with_sensor: '센서로 버저 울리기 %1 %2',
                        neo_lite_buzzer_stop: '버저 멈추기 %1',

                        // lcd
                        neo_lite_lcd_title: 'LCD',
                        neo_lite_lcd_image: 'LCD에 이미지 보여주기 %1 %2 %3',
                        neo_lite_lcd_text: 'LCD에 텍스트 보여주기 %1 %2 %3',

                        // args
                        neo_lite_arg_duration: '%1',
                        neo_lite_arg_both_motor_speed: '%1',
                        neo_lite_arg_servo_angle: '%1',
                    },
                    Blocks: {
                        neo_lite_input_1: 'IN1',
                        neo_lite_input_2: 'IN2',
                        neo_lite_input_3: 'IN3',
                        neo_lite_input_12: 'IN1&2',
                        neo_lite_input_123: 'IN1&2&3',
                        neo_lite_input_1_2: 'IN1&IN2',
                        neo_lite_input_11_12: 'IN1-1&IN1-2',
                        neo_lite_input_13_14: 'IN1-3&IN1-4',
                        neo_lite_input_21_22: 'IN2-1&IN2-2',
                        neo_lite_input_23_24: 'IN2-3&IN2-4',
                        neo_lite_input_31_32: 'IN3-1&IN3-2',
                        neo_lite_input_33_34: 'IN3-3&IN3-4',

                        neo_lite_output_1: 'OUT1',
                        neo_lite_output_2: 'OUT2',
                        neo_lite_output_3: 'OUT3',
                        neo_lite_output_12: 'OUT1&2',
                        neo_lite_output_123: 'OUT1&2&3',

                        neo_lite_speed_0: '0%',
                        neo_lite_speed_5: '5%',
                        neo_lite_speed_10: '10%',
                        neo_lite_speed_15: '15%',
                        neo_lite_speed_20: '20%',
                        neo_lite_speed_25: '25%',
                        neo_lite_speed_30: '30%',
                        neo_lite_speed_35: '35%',
                        neo_lite_speed_40: '40%',
                        neo_lite_speed_45: '45%',
                        neo_lite_speed_50: '50%',
                        neo_lite_speed_55: '55%',
                        neo_lite_speed_60: '60%',
                        neo_lite_speed_65: '65%',
                        neo_lite_speed_70: '70%',
                        neo_lite_speed_75: '75%',
                        neo_lite_speed_80: '80%',
                        neo_lite_speed_85: '85%',
                        neo_lite_speed_90: '90%',
                        neo_lite_speed_95: '95%',
                        neo_lite_speed_100: '100%',

                        neo_lite_duration_c: '계속',
                        neo_lite_duration_0: '0초',
                        neo_lite_duration_1: '1초',
                        neo_lite_duration_2: '2초',
                        neo_lite_duration_3: '3초',
                        neo_lite_duration_4: '4초',
                        neo_lite_duration_5: '5초',
                        neo_lite_duration_6: '6초',
                        neo_lite_duration_7: '7초',
                        neo_lite_duration_8: '8초',
                        neo_lite_duration_9: '9초',

                        neo_lite_compare_gt: '≥',
                        neo_lite_compare_g: '>',
                        neo_lite_compare_e: '=',
                        neo_lite_compare_l: '<',
                        neo_lite_compare_lt: '≤',

                        neo_lite_turn_direction_l: '좌회전',
                        neo_lite_turn_direction_r: '우회전',
                        neo_lite_turn_direction_u: 'U턴',

                        neo_lite_motor_out_l: 'L모터',
                        neo_lite_motor_out_r: 'R모터',
                        neo_lite_motor_out_lr: 'L/R모터',

                        neo_lite_motor_speed_n100: '-100%',
                        neo_lite_motor_speed_n95: '-95%',
                        neo_lite_motor_speed_n90: '-90%',
                        neo_lite_motor_speed_n85: '-85%',
                        neo_lite_motor_speed_n80: '-80%',
                        neo_lite_motor_speed_n75: '-75%',
                        neo_lite_motor_speed_n70: '-70%',
                        neo_lite_motor_speed_n65: '-65%',
                        neo_lite_motor_speed_n60: '-60%',
                        neo_lite_motor_speed_n55: '-55%',
                        neo_lite_motor_speed_n50: '-50%',
                        neo_lite_motor_speed_n45: '-45%',
                        neo_lite_motor_speed_n40: '-40%',
                        neo_lite_motor_speed_n35: '-35%',
                        neo_lite_motor_speed_n30: '-30%',
                        neo_lite_motor_speed_n25: '-25%',
                        neo_lite_motor_speed_n20: '-20%',
                        neo_lite_motor_speed_n15: '-15%',
                        neo_lite_motor_speed_n10: '-10%',
                        neo_lite_motor_speed_n5: '-5%',
                        neo_lite_motor_speed_0: '0%',
                        neo_lite_motor_speed_5: '5%',
                        neo_lite_motor_speed_10: '10%',
                        neo_lite_motor_speed_15: '15%',
                        neo_lite_motor_speed_20: '20%',
                        neo_lite_motor_speed_25: '25%',
                        neo_lite_motor_speed_30: '30%',
                        neo_lite_motor_speed_35: '35%',
                        neo_lite_motor_speed_40: '40%',
                        neo_lite_motor_speed_45: '45%',
                        neo_lite_motor_speed_50: '50%',
                        neo_lite_motor_speed_55: '55%',
                        neo_lite_motor_speed_60: '60%',
                        neo_lite_motor_speed_65: '65%',
                        neo_lite_motor_speed_70: '70%',
                        neo_lite_motor_speed_75: '75%',
                        neo_lite_motor_speed_80: '80%',
                        neo_lite_motor_speed_85: '85%',
                        neo_lite_motor_speed_90: '90%',
                        neo_lite_motor_speed_95: '95%',
                        neo_lite_motor_speed_100: '100%',

                        neo_lite_robot_direction_f: '앞으로',
                        neo_lite_robot_direction_b: '뒤로',
                        neo_lite_robot_direction_l: '왼쪽으로',
                        neo_lite_robot_direction_r: '오른쪽으로',
                        neo_lite_robot_direction_tl: '제자리왼쪽',
                        neo_lite_robot_direction_tr: '제자리오른쪽',

                        neo_lite_servo_angle_n360: '-360도',
                        neo_lite_servo_angle_n350: '-350도',
                        neo_lite_servo_angle_n340: '-340도',
                        neo_lite_servo_angle_n330: '-330도',
                        neo_lite_servo_angle_n320: '-320도',
                        neo_lite_servo_angle_n310: '-310도',
                        neo_lite_servo_angle_n300: '-300도',
                        neo_lite_servo_angle_n290: '-290도',
                        neo_lite_servo_angle_n280: '-280도',
                        neo_lite_servo_angle_n270: '-270도',
                        neo_lite_servo_angle_n260: '-260도',
                        neo_lite_servo_angle_n250: '-250도',
                        neo_lite_servo_angle_n240: '-240도',
                        neo_lite_servo_angle_n230: '-230도',
                        neo_lite_servo_angle_n220: '-220도',
                        neo_lite_servo_angle_n210: '-210도',
                        neo_lite_servo_angle_n200: '-200도',
                        neo_lite_servo_angle_n190: '-190도',
                        neo_lite_servo_angle_n180: '-180도',
                        neo_lite_servo_angle_n170: '-170도',
                        neo_lite_servo_angle_n160: '-160도',
                        neo_lite_servo_angle_n150: '-150도',
                        neo_lite_servo_angle_n140: '-140도',
                        neo_lite_servo_angle_n130: '-130도',
                        neo_lite_servo_angle_n120: '-120도',
                        neo_lite_servo_angle_n110: '-110도',
                        neo_lite_servo_angle_n100: '-100도',
                        neo_lite_servo_angle_n90: '-90도',
                        neo_lite_servo_angle_n80: '-80도',
                        neo_lite_servo_angle_n70: '-70도',
                        neo_lite_servo_angle_n60: '-60도',
                        neo_lite_servo_angle_n50: '-50도',
                        neo_lite_servo_angle_n40: '-40도',
                        neo_lite_servo_angle_n30: '-30도',
                        neo_lite_servo_angle_n20: '-20도',
                        neo_lite_servo_angle_n10: '-10도',
                        neo_lite_servo_angle_0: '0도',
                        neo_lite_servo_angle_10: '10도',
                        neo_lite_servo_angle_20: '20도',
                        neo_lite_servo_angle_30: '30도',
                        neo_lite_servo_angle_40: '40도',
                        neo_lite_servo_angle_50: '50도',
                        neo_lite_servo_angle_60: '60도',
                        neo_lite_servo_angle_70: '70도',
                        neo_lite_servo_angle_80: '80도',
                        neo_lite_servo_angle_90: '90도',
                        neo_lite_servo_angle_100: '100도',
                        neo_lite_servo_angle_110: '110도',
                        neo_lite_servo_angle_120: '120도',
                        neo_lite_servo_angle_130: '130도',
                        neo_lite_servo_angle_140: '140도',
                        neo_lite_servo_angle_150: '150도',
                        neo_lite_servo_angle_160: '160도',
                        neo_lite_servo_angle_170: '170도',
                        neo_lite_servo_angle_180: '180도',
                        neo_lite_servo_angle_190: '190도',
                        neo_lite_servo_angle_200: '200도',
                        neo_lite_servo_angle_210: '210도',
                        neo_lite_servo_angle_220: '220도',
                        neo_lite_servo_angle_230: '230도',
                        neo_lite_servo_angle_240: '240도',
                        neo_lite_servo_angle_250: '250도',
                        neo_lite_servo_angle_260: '260도',
                        neo_lite_servo_angle_270: '270도',
                        neo_lite_servo_angle_280: '280도',
                        neo_lite_servo_angle_290: '290도',
                        neo_lite_servo_angle_300: '300도',
                        neo_lite_servo_angle_310: '310도',
                        neo_lite_servo_angle_320: '320도',
                        neo_lite_servo_angle_330: '330도',
                        neo_lite_servo_angle_340: '340도',
                        neo_lite_servo_angle_350: '350도',
                        neo_lite_servo_angle_360: '360도',

                        neo_lite_servo_direction_f: '앞으로',
                        neo_lite_servo_direction_b: '뒤로',

                        neo_lite_line_cross_move_1: '1번째',
                        neo_lite_line_cross_move_2: '2번째',
                        neo_lite_line_cross_move_3: '3번째',
                        neo_lite_line_cross_move_4: '4번째',
                        neo_lite_line_cross_move_5: '5번째',
                        neo_lite_line_cross_move_6: '6번째',
                        neo_lite_line_cross_move_7: '7번째',
                        neo_lite_line_cross_move_8: '8번째',
                        neo_lite_line_cross_move_9: '9번째',
                        neo_lite_line_cross_move_10: '10번째',

                        neo_lite_line_cross_turn_direction_l: '좌회전',
                        neo_lite_line_cross_turn_direction_r: '우회전',
                        neo_lite_line_cross_turn_direction_u: 'U턴',

                        neo_lite_line_cross_turn_which_next: '다음',
                        neo_lite_line_cross_turn_which_current: '현재',

                        neo_lite_auto_driving_speed_in3: 'IN3',

                        neo_lite_auto_parking_which_l: '왼쪽에',
                        neo_lite_auto_parking_which_r: '오른쪽에',

                        neo_lite_auto_parking_direction_b: '후면주차',
                        neo_lite_auto_parking_direction_s: '평행주차',

                        neo_lite_led_brightness_0: '0%',
                        neo_lite_led_brightness_5: '5%',
                        neo_lite_led_brightness_10: '10%',
                        neo_lite_led_brightness_15: '15%',
                        neo_lite_led_brightness_20: '20%',
                        neo_lite_led_brightness_25: '25%',
                        neo_lite_led_brightness_30: '30%',
                        neo_lite_led_brightness_35: '35%',
                        neo_lite_led_brightness_40: '40%',
                        neo_lite_led_brightness_45: '45%',
                        neo_lite_led_brightness_50: '50%',
                        neo_lite_led_brightness_55: '55%',
                        neo_lite_led_brightness_60: '60%',
                        neo_lite_led_brightness_65: '65%',
                        neo_lite_led_brightness_70: '70%',
                        neo_lite_led_brightness_75: '75%',
                        neo_lite_led_brightness_80: '80%',
                        neo_lite_led_brightness_85: '85%',
                        neo_lite_led_brightness_90: '90%',
                        neo_lite_led_brightness_95: '95%',
                        neo_lite_led_brightness_100: '100%',

                        neo_lite_led_blink_speed_1: '1단계',
                        neo_lite_led_blink_speed_2: '2단계',
                        neo_lite_led_blink_speed_3: '3단계',
                        neo_lite_led_blink_speed_4: '4단계',
                        neo_lite_led_blink_speed_5: '5단계',

                        neo_lite_set_output_value_0: '0',
                        neo_lite_set_output_value_5: '5',
                        neo_lite_set_output_value_10: '10',
                        neo_lite_set_output_value_15: '15',
                        neo_lite_set_output_value_20: '20',
                        neo_lite_set_output_value_25: '25',
                        neo_lite_set_output_value_30: '30',
                        neo_lite_set_output_value_35: '35',
                        neo_lite_set_output_value_40: '40',
                        neo_lite_set_output_value_45: '45',
                        neo_lite_set_output_value_50: '50',
                        neo_lite_set_output_value_55: '55',
                        neo_lite_set_output_value_60: '60',
                        neo_lite_set_output_value_65: '65',
                        neo_lite_set_output_value_70: '70',
                        neo_lite_set_output_value_75: '75',
                        neo_lite_set_output_value_80: '80',
                        neo_lite_set_output_value_85: '85',
                        neo_lite_set_output_value_90: '90',
                        neo_lite_set_output_value_95: '95',
                        neo_lite_set_output_value_100: '100',
                        neo_lite_set_output_value_105: '105',
                        neo_lite_set_output_value_110: '110',
                        neo_lite_set_output_value_115: '115',
                        neo_lite_set_output_value_120: '120',
                        neo_lite_set_output_value_125: '125',
                        neo_lite_set_output_value_130: '130',
                        neo_lite_set_output_value_135: '135',
                        neo_lite_set_output_value_140: '140',
                        neo_lite_set_output_value_145: '145',
                        neo_lite_set_output_value_150: '150',
                        neo_lite_set_output_value_155: '155',
                        neo_lite_set_output_value_160: '160',
                        neo_lite_set_output_value_165: '165',
                        neo_lite_set_output_value_170: '170',
                        neo_lite_set_output_value_175: '175',
                        neo_lite_set_output_value_180: '180',
                        neo_lite_set_output_value_185: '185',
                        neo_lite_set_output_value_190: '190',
                        neo_lite_set_output_value_195: '195',
                        neo_lite_set_output_value_200: '200',
                        neo_lite_set_output_value_205: '205',
                        neo_lite_set_output_value_210: '210',
                        neo_lite_set_output_value_215: '215',
                        neo_lite_set_output_value_220: '220',
                        neo_lite_set_output_value_225: '225',
                        neo_lite_set_output_value_230: '230',
                        neo_lite_set_output_value_235: '235',
                        neo_lite_set_output_value_240: '240',
                        neo_lite_set_output_value_245: '245',
                        neo_lite_set_output_value_250: '250',
                        neo_lite_set_output_value_255: '255',

                        neo_lite_sensor_in_digital_1: '1번',
                        neo_lite_sensor_in_digital_2: '2번',
                        neo_lite_sensor_in_digital_3: '3번',
                        neo_lite_sensor_in_digital_4: '4번',

                        neo_lite_color_black: '검정',
                        neo_lite_color_white: '흰색',
                        neo_lite_color_red: '빨강',
                        neo_lite_color_yellow: '노랑',
                        neo_lite_color_green: '녹색',
                        neo_lite_color_blue: '파랑',

                        neo_lite_color_seq_ryg: '빨노녹',
                        neo_lite_color_seq_ryb: '빨노파',
                        neo_lite_color_seq_rgy: '빨녹노',
                        neo_lite_color_seq_rgb: '빨녹파',
                        neo_lite_color_seq_rby: '빨파노',
                        neo_lite_color_seq_rbg: '빨파녹',
                        neo_lite_color_seq_yrb: '노빨파',
                        neo_lite_color_seq_ygr: '노녹빨',
                        neo_lite_color_seq_ygb: '노녹파',
                        neo_lite_color_seq_ybr: '노파빨',
                        neo_lite_color_seq_grb: '녹빨파',
                        neo_lite_color_seq_gyr: '녹노빨',
                        neo_lite_color_seq_gyb: '녹노파',
                        neo_lite_color_seq_gbr: '녹파빨',
                        neo_lite_color_seq_bry: '파빨노',
                        neo_lite_color_seq_brg: '파빨녹',
                        neo_lite_color_seq_byr: '파노빨',
                        neo_lite_color_seq_byg: '파노녹',
                        neo_lite_color_seq_bgr: '파녹빨',
                        neo_lite_color_seq_bgy: '파녹노',

                        neo_lite_button_1: '버튼1',
                        neo_lite_button_2: '버튼2',
                        neo_lite_button_3: '버튼3',
                        neo_lite_button_4: '버튼4',

                        neo_lite_button_on: 'ON',
                        neo_lite_button_off: 'OFF',

                        neo_lite_buzzer_octave_1: '1옥타브',
                        neo_lite_buzzer_octave_2: '2옥타브',
                        neo_lite_buzzer_octave_3: '3옥타브',
                        neo_lite_buzzer_octave_4: '4옥타브',
                        neo_lite_buzzer_octave_5: '5옥타브',
                        neo_lite_buzzer_octave_6: '6옥타브',

                        neo_lite_buzzer_do: '도',
                        neo_lite_buzzer_do_sharp: '도#',
                        neo_lite_buzzer_re: '레',
                        neo_lite_buzzer_re_sharp: '레#',
                        neo_lite_buzzer_mi: '미',
                        neo_lite_buzzer_fa: '파',
                        neo_lite_buzzer_fa_sharp: '파#',
                        neo_lite_buzzer_sol: '솔',
                        neo_lite_buzzer_sol_sharp: '솔#',
                        neo_lite_buzzer_la: '라',
                        neo_lite_buzzer_la_sharp: '라#',
                        neo_lite_buzzer_ti: '시',

                        neo_lite_buzzer_whole_note: '온음표',
                        neo_lite_buzzer_half_note: '2분 음표',
                        neo_lite_buzzer_quarter_note: '4분 음표',
                        neo_lite_buzzer_8th_note: '8분 음표',

                        neo_lite_lcd_image_1: '화남',
                        neo_lite_lcd_image_2: '어지러움',
                        neo_lite_lcd_image_3: '똑똑함',
                        neo_lite_lcd_image_4: '활기참',
                        neo_lite_lcd_image_5: '뽀뽀',
                        neo_lite_lcd_image_6: '사랑해',
                        neo_lite_lcd_image_7: '윙크',
                        neo_lite_lcd_image_8: '폭풍눈물',
                        neo_lite_lcd_image_9: '졸림',
                        neo_lite_lcd_image_10: '미소',
                        neo_lite_lcd_image_11: '깜찍함',
                        neo_lite_lcd_image_12: '의심',
                        neo_lite_lcd_image_13: '못마땅',
                    },
                },
                en: {
                    // en.js에 작성하던 내용
                    template: {
                        // robot
                        neo_lite_robot_title: 'Robot',
                        neo_lite_robot_move: 'Move robot %1 %2 %3 %4',
                        neo_lite_robot_stop: 'Stop robot %1',

                        // auto driving
                        neo_lite_auto_driving_title: 'Self-driving',
                        neo_lite_auto_driving_start: 'Start self-driving %1 %2 %3',
                        neo_lite_auto_driving_sensor_start: 'Start self-driving with %1 %2 %3',
                        neo_lite_auto_driving_stop: 'Stop self-driving %1',

                        // auto parking
                        neo_lite_auto_parking_title: 'Auto parking',
                        neo_lite_auto_parking_start: 'Start auto parking %1 %2 %3',

                        // line tracer
                        neo_lite_line_tracer_title: 'Line tracer',
                        neo_lite_line_tracer_start: 'Start line tracer with black line %1 %2 %3',
                        neo_lite_line_cross_move: 'Keep moving to the %1 intersection %2',
                        neo_lite_line_cross_turn: 'Turn %2 at the %1 intersection %3',

                        // motor
                        neo_lite_motor_title: 'Motor',
                        neo_lite_motor_move: 'Move motor %1 %2 %3 %4',
                        neo_lite_motor_move_both: 'Move both motor L %1 R %2 %3',
                        neo_lite_motor_stop: 'Stop motor %1 %2',

                        // servo
                        neo_lite_servo_title: 'Servo motor',
                        neo_lite_servo_reset:
                          'Reset the current position of %1 servo motor to 0 degree %2',
                        neo_lite_servo_angle: 'Change servo angle %1 %2 %3 %4',
                        neo_lite_servo_angle_var: 'Change servo angle %1 %2 %3 %4',
                        neo_lite_servo_angle_wait: 'Wait to change servo angle %1 %2 %3 %4',
                        neo_lite_servo_rotate: 'Rotate servo motor %1 %2 %3 %4',
                        neo_lite_servo_stop: 'Stop servo motor %1 %2',

                        // led
                        neo_lite_led_title: 'LED',
                        neo_lite_led_on: 'Turn on the LED %1 %2 %3 %4',
                        neo_lite_led_blink: 'Blink the LED %1 %2 %3 %4',
                        neo_lite_led_off: 'Turn off the LED %1 %2',

                        // color led
                        neo_lite_color_led_title: 'Color LED',
                        neo_lite_color_led_on: 'Turn on the color LED %1 %2 %3 %4',
                        neo_lite_color_led_off: 'Turn off the color LED %1 %2',
                        neo_lite_color_led_on_with_sensor:
                          'Turn on the color LED %2 with color sensor %1 %3',

                        // set output
                        neo_lite_set_output_title: 'Set output',
                        neo_lite_set_output: 'Set output %1 %2 %3 %4',

                        // sensor
                        neo_lite_sensor_title: 'Sensor',
                        neo_lite_sensor_in: '%1',
                        neo_lite_sensor_digital_in: '%1 %2',
                        neo_lite_sensor_convert: '%1 : %2 %3 → %4 %5',
                        neo_lite_sensor_compare: '%1 %2 %3',
                        neo_lite_sensor_between: '%1 %2 %3 %4 %5',
                        neo_lite_sensor_digital_compare: '%1 %2 %3 %4',
                        neo_lite_sensor_color_compare: '%1 = %2',
                        neo_lite_sensor_color_sequence_compare: '%1 = %2',
                        neo_lite_sensor_button_pressed: '%1 %2',

                        // buzzer
                        neo_lite_buzzer_title: 'Buzzer',
                        neo_lite_buzzer_start: 'Buzzer %1 %2 %3 %4',
                        neo_lite_buzzer_with_sensor: 'Buzzer by sensor value %1 %2',
                        neo_lite_buzzer_stop: 'Stop the buzzer %1',

                        // lcd
                        neo_lite_lcd_title: 'LCD',
                        neo_lite_lcd_image: 'Show image on LCD %1 %2 %3',
                        neo_lite_lcd_text: 'Show text on LCD %1 %2 %3',

                        // args
                        neo_lite_arg_duration: '%1',
                        neo_lite_arg_both_motor_speed: '%1',
                        neo_lite_arg_servo_angle: '%1',
                    },
                    Blocks: {
                        neo_lite_input_1: 'IN1',
                        neo_lite_input_2: 'IN2',
                        neo_lite_input_3: 'IN3',
                        neo_lite_input_12: 'IN1&2',
                        neo_lite_input_123: 'IN1&2&3',
                        neo_lite_input_1_2: 'IN1&IN2',
                        neo_lite_input_11_12: 'IN1-1&IN1-2',
                        neo_lite_input_13_14: 'IN1-3&IN1-4',
                        neo_lite_input_21_22: 'IN2-1&IN2-2',
                        neo_lite_input_23_24: 'IN2-3&IN2-4',
                        neo_lite_input_31_32: 'IN3-1&IN3-2',
                        neo_lite_input_33_34: 'IN3-3&IN3-4',

                        neo_lite_output_1: 'OUT1',
                        neo_lite_output_2: 'OUT2',
                        neo_lite_output_3: 'OUT3',
                        neo_lite_output_12: 'OUT1&2',
                        neo_lite_output_123: 'OUT1&2&3',

                        neo_lite_speed_0: '0%',
                        neo_lite_speed_5: '5%',
                        neo_lite_speed_10: '10%',
                        neo_lite_speed_15: '15%',
                        neo_lite_speed_20: '20%',
                        neo_lite_speed_25: '25%',
                        neo_lite_speed_30: '30%',
                        neo_lite_speed_35: '35%',
                        neo_lite_speed_40: '40%',
                        neo_lite_speed_45: '45%',
                        neo_lite_speed_50: '50%',
                        neo_lite_speed_55: '55%',
                        neo_lite_speed_60: '60%',
                        neo_lite_speed_65: '65%',
                        neo_lite_speed_70: '70%',
                        neo_lite_speed_75: '75%',
                        neo_lite_speed_80: '80%',
                        neo_lite_speed_85: '85%',
                        neo_lite_speed_90: '90%',
                        neo_lite_speed_95: '95%',
                        neo_lite_speed_100: '100%',

                        neo_lite_duration_c: 'constantly',
                        neo_lite_duration_0: '0 second',
                        neo_lite_duration_1: '1 second',
                        neo_lite_duration_2: '2 seconds',
                        neo_lite_duration_3: '3 seconds',
                        neo_lite_duration_4: '4 seconds',
                        neo_lite_duration_5: '5 seconds',
                        neo_lite_duration_6: '6 seconds',
                        neo_lite_duration_7: '7 seconds',
                        neo_lite_duration_8: '8 seconds',
                        neo_lite_duration_9: '9 seconds',

                        neo_lite_compare_gt: '≥',
                        neo_lite_compare_g: '>',
                        neo_lite_compare_e: '=',
                        neo_lite_compare_l: '<',
                        neo_lite_compare_lt: '≤',

                        neo_lite_turn_direction_l: 'left',
                        neo_lite_turn_direction_r: 'right',
                        neo_lite_turn_direction_u: 'U-turn',

                        neo_lite_motor_out_l: 'left',
                        neo_lite_motor_out_r: 'right',
                        neo_lite_motor_out_lr: 'both',

                        neo_lite_motor_speed_n100: '-100%',
                        neo_lite_motor_speed_n95: '-95%',
                        neo_lite_motor_speed_n90: '-90%',
                        neo_lite_motor_speed_n85: '-85%',
                        neo_lite_motor_speed_n80: '-80%',
                        neo_lite_motor_speed_n75: '-75%',
                        neo_lite_motor_speed_n70: '-70%',
                        neo_lite_motor_speed_n65: '-65%',
                        neo_lite_motor_speed_n60: '-60%',
                        neo_lite_motor_speed_n55: '-55%',
                        neo_lite_motor_speed_n50: '-50%',
                        neo_lite_motor_speed_n45: '-45%',
                        neo_lite_motor_speed_n40: '-40%',
                        neo_lite_motor_speed_n35: '-35%',
                        neo_lite_motor_speed_n30: '-30%',
                        neo_lite_motor_speed_n25: '-25%',
                        neo_lite_motor_speed_n20: '-20%',
                        neo_lite_motor_speed_n15: '-15%',
                        neo_lite_motor_speed_n10: '-10%',
                        neo_lite_motor_speed_n5: '-5%',
                        neo_lite_motor_speed_0: '0%',
                        neo_lite_motor_speed_5: '5%',
                        neo_lite_motor_speed_10: '10%',
                        neo_lite_motor_speed_15: '15%',
                        neo_lite_motor_speed_20: '20%',
                        neo_lite_motor_speed_25: '25%',
                        neo_lite_motor_speed_30: '30%',
                        neo_lite_motor_speed_35: '35%',
                        neo_lite_motor_speed_40: '40%',
                        neo_lite_motor_speed_45: '45%',
                        neo_lite_motor_speed_50: '50%',
                        neo_lite_motor_speed_55: '55%',
                        neo_lite_motor_speed_60: '60%',
                        neo_lite_motor_speed_65: '65%',
                        neo_lite_motor_speed_70: '70%',
                        neo_lite_motor_speed_75: '75%',
                        neo_lite_motor_speed_80: '80%',
                        neo_lite_motor_speed_85: '85%',
                        neo_lite_motor_speed_90: '90%',
                        neo_lite_motor_speed_95: '95%',
                        neo_lite_motor_speed_100: '100%',

                        neo_lite_robot_direction_f: 'forward',
                        neo_lite_robot_direction_b: 'backward',
                        neo_lite_robot_direction_l: 'left',
                        neo_lite_robot_direction_r: 'right',
                        neo_lite_robot_direction_tl: 'left in place',
                        neo_lite_robot_direction_tr: 'right in place',

                        neo_lite_servo_angle_n360: '-360 degree',
                        neo_lite_servo_angle_n350: '-350 degree',
                        neo_lite_servo_angle_n340: '-340 degree',
                        neo_lite_servo_angle_n330: '-330 degree',
                        neo_lite_servo_angle_n320: '-320 degree',
                        neo_lite_servo_angle_n310: '-310 degree',
                        neo_lite_servo_angle_n300: '-300 degree',
                        neo_lite_servo_angle_n290: '-290 degree',
                        neo_lite_servo_angle_n280: '-280 degree',
                        neo_lite_servo_angle_n270: '-270 degree',
                        neo_lite_servo_angle_n260: '-260 degree',
                        neo_lite_servo_angle_n250: '-250 degree',
                        neo_lite_servo_angle_n240: '-240 degree',
                        neo_lite_servo_angle_n230: '-230 degree',
                        neo_lite_servo_angle_n220: '-220 degree',
                        neo_lite_servo_angle_n210: '-210 degree',
                        neo_lite_servo_angle_n200: '-200 degree',
                        neo_lite_servo_angle_n190: '-190 degree',
                        neo_lite_servo_angle_n180: '-180 degree',
                        neo_lite_servo_angle_n170: '-170 degree',
                        neo_lite_servo_angle_n160: '-160 degree',
                        neo_lite_servo_angle_n150: '-150 degree',
                        neo_lite_servo_angle_n140: '-140 degree',
                        neo_lite_servo_angle_n130: '-130 degree',
                        neo_lite_servo_angle_n120: '-120 degree',
                        neo_lite_servo_angle_n110: '-110 degree',
                        neo_lite_servo_angle_n100: '-100 degree',
                        neo_lite_servo_angle_n90: '-90 degree',
                        neo_lite_servo_angle_n80: '-80 degree',
                        neo_lite_servo_angle_n70: '-70 degree',
                        neo_lite_servo_angle_n60: '-60 degree',
                        neo_lite_servo_angle_n50: '-50 degree',
                        neo_lite_servo_angle_n40: '-40 degree',
                        neo_lite_servo_angle_n30: '-30 degree',
                        neo_lite_servo_angle_n20: '-20 degree',
                        neo_lite_servo_angle_n10: '-10 degree',
                        neo_lite_servo_angle_0: '0 degree',
                        neo_lite_servo_angle_10: '10 degree',
                        neo_lite_servo_angle_20: '20 degree',
                        neo_lite_servo_angle_30: '30 degree',
                        neo_lite_servo_angle_40: '40 degree',
                        neo_lite_servo_angle_50: '50 degree',
                        neo_lite_servo_angle_60: '60 degree',
                        neo_lite_servo_angle_70: '70 degree',
                        neo_lite_servo_angle_80: '80 degree',
                        neo_lite_servo_angle_90: '90 degree',
                        neo_lite_servo_angle_100: '100 degree',
                        neo_lite_servo_angle_110: '110 degree',
                        neo_lite_servo_angle_120: '120 degree',
                        neo_lite_servo_angle_130: '130 degree',
                        neo_lite_servo_angle_140: '140 degree',
                        neo_lite_servo_angle_150: '150 degree',
                        neo_lite_servo_angle_160: '160 degree',
                        neo_lite_servo_angle_170: '170 degree',
                        neo_lite_servo_angle_180: '180 degree',
                        neo_lite_servo_angle_190: '190 degree',
                        neo_lite_servo_angle_200: '200 degree',
                        neo_lite_servo_angle_210: '210 degree',
                        neo_lite_servo_angle_220: '220 degree',
                        neo_lite_servo_angle_230: '230 degree',
                        neo_lite_servo_angle_240: '240 degree',
                        neo_lite_servo_angle_250: '250 degree',
                        neo_lite_servo_angle_260: '260 degree',
                        neo_lite_servo_angle_270: '270 degree',
                        neo_lite_servo_angle_280: '280 degree',
                        neo_lite_servo_angle_290: '290 degree',
                        neo_lite_servo_angle_300: '300 degree',
                        neo_lite_servo_angle_310: '310 degree',
                        neo_lite_servo_angle_320: '320 degree',
                        neo_lite_servo_angle_330: '330 degree',
                        neo_lite_servo_angle_340: '340 degree',
                        neo_lite_servo_angle_350: '350 degree',
                        neo_lite_servo_angle_360: '360 degree',

                        neo_lite_servo_direction_f: 'forward',
                        neo_lite_servo_direction_b: 'backward',

                        neo_lite_line_cross_move_1: '1st',
                        neo_lite_line_cross_move_2: '2nd',
                        neo_lite_line_cross_move_3: '3rd',
                        neo_lite_line_cross_move_4: '4th',
                        neo_lite_line_cross_move_5: '5th',
                        neo_lite_line_cross_move_6: '6th',
                        neo_lite_line_cross_move_7: '7th',
                        neo_lite_line_cross_move_8: '8th',
                        neo_lite_line_cross_move_9: '9th',
                        neo_lite_line_cross_move_10: '10th',

                        neo_lite_line_cross_turn_direction_l: 'to left',
                        neo_lite_line_cross_turn_direction_r: 'to right',
                        neo_lite_line_cross_turn_direction_u: 'U-turn',

                        neo_lite_line_cross_turn_which_next: 'next',
                        neo_lite_line_cross_turn_which_current: 'current',

                        neo_lite_auto_driving_speed_in3: 'IN3',

                        neo_lite_auto_parking_which_l: 'to left',
                        neo_lite_auto_parking_which_r: 'to right',

                        neo_lite_auto_parking_direction_b: 'rear parking',
                        neo_lite_auto_parking_direction_s: 'parallel parking',

                        neo_lite_led_brightness_0: '0%',
                        neo_lite_led_brightness_5: '5%',
                        neo_lite_led_brightness_10: '10%',
                        neo_lite_led_brightness_15: '15%',
                        neo_lite_led_brightness_20: '20%',
                        neo_lite_led_brightness_25: '25%',
                        neo_lite_led_brightness_30: '30%',
                        neo_lite_led_brightness_35: '35%',
                        neo_lite_led_brightness_40: '40%',
                        neo_lite_led_brightness_45: '45%',
                        neo_lite_led_brightness_50: '50%',
                        neo_lite_led_brightness_55: '55%',
                        neo_lite_led_brightness_60: '60%',
                        neo_lite_led_brightness_65: '65%',
                        neo_lite_led_brightness_70: '70%',
                        neo_lite_led_brightness_75: '75%',
                        neo_lite_led_brightness_80: '80%',
                        neo_lite_led_brightness_85: '85%',
                        neo_lite_led_brightness_90: '90%',
                        neo_lite_led_brightness_95: '95%',
                        neo_lite_led_brightness_100: '100%',

                        neo_lite_led_blink_speed_1: '1 step',
                        neo_lite_led_blink_speed_2: '2 steps',
                        neo_lite_led_blink_speed_3: '3 steps',
                        neo_lite_led_blink_speed_4: '4 steps',
                        neo_lite_led_blink_speed_5: '5 steps',

                        neo_lite_set_output_value_0: '0',
                        neo_lite_set_output_value_5: '5',
                        neo_lite_set_output_value_10: '10',
                        neo_lite_set_output_value_15: '15',
                        neo_lite_set_output_value_20: '20',
                        neo_lite_set_output_value_25: '25',
                        neo_lite_set_output_value_30: '30',
                        neo_lite_set_output_value_35: '35',
                        neo_lite_set_output_value_40: '40',
                        neo_lite_set_output_value_45: '45',
                        neo_lite_set_output_value_50: '50',
                        neo_lite_set_output_value_55: '55',
                        neo_lite_set_output_value_60: '60',
                        neo_lite_set_output_value_65: '65',
                        neo_lite_set_output_value_70: '70',
                        neo_lite_set_output_value_75: '75',
                        neo_lite_set_output_value_80: '80',
                        neo_lite_set_output_value_85: '85',
                        neo_lite_set_output_value_90: '90',
                        neo_lite_set_output_value_95: '95',
                        neo_lite_set_output_value_100: '100',
                        neo_lite_set_output_value_105: '105',
                        neo_lite_set_output_value_110: '110',
                        neo_lite_set_output_value_115: '115',
                        neo_lite_set_output_value_120: '120',
                        neo_lite_set_output_value_125: '125',
                        neo_lite_set_output_value_130: '130',
                        neo_lite_set_output_value_135: '135',
                        neo_lite_set_output_value_140: '140',
                        neo_lite_set_output_value_145: '145',
                        neo_lite_set_output_value_150: '150',
                        neo_lite_set_output_value_155: '155',
                        neo_lite_set_output_value_160: '160',
                        neo_lite_set_output_value_165: '165',
                        neo_lite_set_output_value_170: '170',
                        neo_lite_set_output_value_175: '175',
                        neo_lite_set_output_value_180: '180',
                        neo_lite_set_output_value_185: '185',
                        neo_lite_set_output_value_190: '190',
                        neo_lite_set_output_value_195: '195',
                        neo_lite_set_output_value_200: '200',
                        neo_lite_set_output_value_205: '205',
                        neo_lite_set_output_value_210: '210',
                        neo_lite_set_output_value_215: '215',
                        neo_lite_set_output_value_220: '220',
                        neo_lite_set_output_value_225: '225',
                        neo_lite_set_output_value_230: '230',
                        neo_lite_set_output_value_235: '235',
                        neo_lite_set_output_value_240: '240',
                        neo_lite_set_output_value_245: '245',
                        neo_lite_set_output_value_250: '250',
                        neo_lite_set_output_value_255: '255',

                        neo_lite_sensor_in_digital_1: '1st',
                        neo_lite_sensor_in_digital_2: '2nd',
                        neo_lite_sensor_in_digital_3: '3rd',
                        neo_lite_sensor_in_digital_4: '4th',

                        neo_lite_color_black: 'black',
                        neo_lite_color_white: 'white',
                        neo_lite_color_red: 'red',
                        neo_lite_color_yellow: 'yellow',
                        neo_lite_color_green: 'green',
                        neo_lite_color_blue: 'blue',

                        neo_lite_color_seq_ryg: 'RYG',
                        neo_lite_color_seq_ryb: 'RYB',
                        neo_lite_color_seq_rgy: 'RGY',
                        neo_lite_color_seq_rgb: 'RGB',
                        neo_lite_color_seq_rby: 'RBY',
                        neo_lite_color_seq_rbg: 'RBG',
                        neo_lite_color_seq_yrb: 'YRB',
                        neo_lite_color_seq_ygr: 'YGR',
                        neo_lite_color_seq_ygb: 'YGB',
                        neo_lite_color_seq_ybr: 'YBR',
                        neo_lite_color_seq_grb: 'GRB',
                        neo_lite_color_seq_gyr: 'GYR',
                        neo_lite_color_seq_gyb: 'GYB',
                        neo_lite_color_seq_gbr: 'GBR',
                        neo_lite_color_seq_bry: 'BRY',
                        neo_lite_color_seq_brg: 'BRG',
                        neo_lite_color_seq_byr: 'BYR',
                        neo_lite_color_seq_byg: 'BYG',
                        neo_lite_color_seq_bgr: 'BGR',
                        neo_lite_color_seq_bgy: 'BGY',

                        neo_lite_button_1: 'button 1',
                        neo_lite_button_2: 'button 2',
                        neo_lite_button_3: 'button 3',
                        neo_lite_button_4: 'button 4',

                        neo_lite_button_on: 'ON',
                        neo_lite_button_off: 'OFF',

                        neo_lite_buzzer_octave_1: '1 octave',
                        neo_lite_buzzer_octave_2: '2 octave',
                        neo_lite_buzzer_octave_3: '3 octave',
                        neo_lite_buzzer_octave_4: '4 octave',
                        neo_lite_buzzer_octave_5: '5 octave',
                        neo_lite_buzzer_octave_6: '6 octave',

                        neo_lite_buzzer_do: 'Do',
                        neo_lite_buzzer_do_sharp: 'Do#',
                        neo_lite_buzzer_re: 'Re',
                        neo_lite_buzzer_re_sharp: 'Re#',
                        neo_lite_buzzer_mi: 'Mi',
                        neo_lite_buzzer_fa: 'Fa',
                        neo_lite_buzzer_fa_sharp: 'Fa#',
                        neo_lite_buzzer_sol: 'So',
                        neo_lite_buzzer_sol_sharp: 'So#',
                        neo_lite_buzzer_la: 'La',
                        neo_lite_buzzer_la_sharp: 'La#',
                        neo_lite_buzzer_ti: 'Si',

                        neo_lite_buzzer_whole_note: 'whole note',
                        neo_lite_buzzer_half_note: 'a half note',
                        neo_lite_buzzer_quarter_note: 'a quarter note',
                        neo_lite_buzzer_8th_note: 'a eighth note',

                        neo_lite_lcd_image_1: 'angry',
                        neo_lite_lcd_image_2: 'dizzy',
                        neo_lite_lcd_image_3: 'smart',
                        neo_lite_lcd_image_4: 'lively',
                        neo_lite_lcd_image_5: 'kiss',
                        neo_lite_lcd_image_6: 'lovely',
                        neo_lite_lcd_image_7: 'wink',
                        neo_lite_lcd_image_8: 'cry',
                        neo_lite_lcd_image_9: 'sleepy',
                        neo_lite_lcd_image_10: 'smiley',
                        neo_lite_lcd_image_11: 'cute',
                        neo_lite_lcd_image_12: 'doubt',
                        neo_lite_lcd_image_13: 'bad',
                    },
                }, //
            };
        }

        getBlocks() {
            return {
                /**
                 * 로봇
                 */
                neo_lite_robot_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_robot_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_robot_title',
                    },
                    class: 'neo_lite_robot',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_robot_move: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_robot_direction_f, 1],
                                [Lang.Blocks.neo_lite_robot_direction_b, 2],
                                [Lang.Blocks.neo_lite_robot_direction_l, 3],
                                [Lang.Blocks.neo_lite_robot_direction_r, 4],
                                [Lang.Blocks.neo_lite_robot_direction_tl, 5],
                                [Lang.Blocks.neo_lite_robot_direction_tr, 6],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_95, '95'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_85, '85'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_75, '75'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_65, '65'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_55, '55'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_45, '45'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_35, '35'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_25, '25'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_15, '15'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_5, '5'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '100',
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
                            null,
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_robot_move',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SPEED: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_robot',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const direction = script.getNumberField('DIRECTION', script);
                            const speed = script.getStringField('SPEED', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.ROBOT_MOVE, [
                                    direction,
                                    speed,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [
                                    direction,
                                    speed,
                                ]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.block_id = blockId;
                                script.exec_phase = ExecPhase.PENDING_STOP;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const direction = script.getNumberField('DIRECTION', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.ROBOT_MOVE, [direction, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_robot_stop: {
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
                        type: 'neo_lite_robot_stop',
                    },
                    paramsKeyMap: {
                        //
                    },
                    class: 'neo_lite_robot',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            this.requestCommand(blockId, NeoBlockType.ROBOT_STOP, []);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },

                /**
                 * 자율주행
                 */
                neo_lite_auto_driving_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_auto_driving_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_auto_driving_title',
                    },
                    class: 'neo_lite_auto_driving',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_auto_driving_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_95, '95'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_85, '85'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_75, '75'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_65, '65'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_55, '55'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_45, '45'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_35, '35'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_25, '25'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_15, '15'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_5, '5'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '100',
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
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_auto_driving_start',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                        DURATION: 1,
                    },
                    class: 'neo_lite_auto_driving',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const speed = script.getStringField('SPEED', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [
                                    speed,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [
                                    speed,
                                ]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.block_id = blockId;
                                script.exec_phase = ExecPhase.PENDING_STOP;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_START, [0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_auto_driving_sensor_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_input_1_2, 0x10],
                                [Lang.Blocks.neo_lite_input_11_12, 0x11],
                                [Lang.Blocks.neo_lite_input_13_14, 0x12],
                                [Lang.Blocks.neo_lite_input_21_22, 0x13],
                                [Lang.Blocks.neo_lite_input_23_24, 0x14],
                                [Lang.Blocks.neo_lite_input_31_32, 0x15],
                                [Lang.Blocks.neo_lite_input_33_34, 0x16],
                            ],
                            value: 0x10,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_95, '95'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_85, '85'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_75, '75'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_65, '65'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_55, '55'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_45, '45'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_35, '35'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_25, '25'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_15, '15'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_5, '5'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '60',
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
                        type: 'neo_lite_auto_driving_sensor_start',
                    },
                    paramsKeyMap: {
                        SENSOR: 0,
                        SPEED: 1,
                    },
                    class: 'neo_lite_auto_driving',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const sensor = script.getNumberField('SENSOR', script);
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(
                                  blockId,
                                  NeoBlockType.AUTO_DRIVING_SENSOR_START,
                                  [sensor, speed]
                                );
                            } else {
                                this.requestCommand(
                                  blockId,
                                  NeoBlockType.AUTO_DRIVING_SENSOR_START,
                                  [sensor, speed]
                                );
                            }
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_auto_driving_stop: {
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
                        type: 'neo_lite_auto_driving_stop',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'neo_lite_auto_driving',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.AUTO_DRIVING_STOP, []);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * 자율주차
                 */
                neo_lite_auto_parking_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_auto_parking_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_auto_parking_title',
                    },
                    class: 'neo_lite_auto_parking',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_auto_parking_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_auto_parking_which_l, 1],
                                [Lang.Blocks.neo_lite_auto_parking_which_r, 2],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_auto_parking_direction_b, 1],
                                [Lang.Blocks.neo_lite_auto_parking_direction_s, 2],
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
                        params: [null, null, null],
                        type: 'neo_lite_auto_parking_start',
                    },
                    paramsKeyMap: {
                        WHICH: 0,
                        DIRECTION: 1,
                    },
                    class: 'neo_lite_auto_parking',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        return this.runAutoParking(script);
                    },
                },

                /**
                 * 라인트레이서
                 */
                neo_lite_line_tracer_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_line_tracer_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_line_tracer_title',
                    },
                    class: 'neo_lite_line_tracer',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_line_tracer_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '100',
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
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_line_tracer_start',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                        DURATION: 1,
                    },
                    class: 'neo_lite_line_tracer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            const duration = script.getStringValue('DURATION', script);
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.LINE_TRACER_START, [
                                    speed,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.LINE_TRACER_START, [
                                    speed,
                                ]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.block_id = blockId;
                                script.exec_phase = ExecPhase.PENDING_STOP;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LINE_TRACER_START, [0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_line_cross_move: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_line_cross_move_1, 1],
                                [Lang.Blocks.neo_lite_line_cross_move_2, 2],
                                [Lang.Blocks.neo_lite_line_cross_move_3, 3],
                                [Lang.Blocks.neo_lite_line_cross_move_4, 4],
                                [Lang.Blocks.neo_lite_line_cross_move_5, 5],
                                [Lang.Blocks.neo_lite_line_cross_move_6, 6],
                                [Lang.Blocks.neo_lite_line_cross_move_7, 7],
                                [Lang.Blocks.neo_lite_line_cross_move_8, 8],
                                [Lang.Blocks.neo_lite_line_cross_move_9, 9],
                                [Lang.Blocks.neo_lite_line_cross_move_10, 10],
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
                        params: [null, null],
                        type: 'neo_lite_line_cross_move',
                    },
                    paramsKeyMap: {
                        COUNT: 0,
                    },
                    class: 'neo_lite_line_tracer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const count = script.getStringValue('COUNT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LINE_CROSS_MOVE, [count]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_line_cross_turn: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_line_cross_turn_which_next, 1],
                                [Lang.Blocks.neo_lite_line_cross_turn_which_current, 2],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_turn_direction_l, 10],
                                [Lang.Blocks.neo_lite_turn_direction_r, 11],
                                [Lang.Blocks.neo_lite_turn_direction_u, 12],
                            ],
                            value: 10,
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
                        type: 'neo_lite_line_cross_turn',
                    },
                    paramsKeyMap: {
                        WHICH: 0,
                        DIRECTION: 1,
                    },
                    class: 'neo_lite_line_tracer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const which = script.getNumberValue('WHICH', script);
                            let direction = script.getStringValue('DIRECTION', script);
                            if (which === 1) direction += 20;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LINE_CROSS_TURN, [direction]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },

                /**
                 * 회전모터
                 */
                neo_lite_motor_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_motor_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_motor_title',
                    },
                    class: 'neo_lite_motor',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_motor_move: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_out_l, 1],
                                [Lang.Blocks.neo_lite_motor_out_r, 2],
                                [Lang.Blocks.neo_lite_motor_out_lr, 0],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_95, '95'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_85, '85'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_75, '75'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_65, '65'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_55, '55'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_45, '45'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_35, '35'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_25, '25'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_15, '15'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_5, '5'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_motor_speed_n5, '-5'],
                                [Lang.Blocks.neo_lite_motor_speed_n10, '-10'],
                                [Lang.Blocks.neo_lite_motor_speed_n15, '-15'],
                                [Lang.Blocks.neo_lite_motor_speed_n20, '-20'],
                                [Lang.Blocks.neo_lite_motor_speed_n25, '-25'],
                                [Lang.Blocks.neo_lite_motor_speed_n30, '-30'],
                                [Lang.Blocks.neo_lite_motor_speed_n35, '-35'],
                                [Lang.Blocks.neo_lite_motor_speed_n40, '-40'],
                                [Lang.Blocks.neo_lite_motor_speed_n45, '-45'],
                                [Lang.Blocks.neo_lite_motor_speed_n50, '-50'],
                                [Lang.Blocks.neo_lite_motor_speed_n55, '-55'],
                                [Lang.Blocks.neo_lite_motor_speed_n60, '-60'],
                                [Lang.Blocks.neo_lite_motor_speed_n65, '-65'],
                                [Lang.Blocks.neo_lite_motor_speed_n70, '-70'],
                                [Lang.Blocks.neo_lite_motor_speed_n75, '-75'],
                                [Lang.Blocks.neo_lite_motor_speed_n80, '-80'],
                                [Lang.Blocks.neo_lite_motor_speed_n85, '-85'],
                                [Lang.Blocks.neo_lite_motor_speed_n90, '-90'],
                                [Lang.Blocks.neo_lite_motor_speed_n95, '-95'],
                                [Lang.Blocks.neo_lite_motor_speed_n100, '-100'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '100',
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
                            null,
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_motor_move',
                    },
                    paramsKeyMap: {
                        DC: 0,
                        SPEED: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_motor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const dc = script.getNumberField('DC', script);
                            const speed = script.getStringField('SPEED', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.MOTOR_MOVE, [
                                    dc,
                                    speed,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE, [dc, speed]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.block_id = blockId;
                                script.exec_phase = ExecPhase.PENDING_STOP;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const dc = script.getNumberField('DC', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE, [dc, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_motor_move_both: {
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
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'neo_lite_arg_both_motor_speed',
                            },
                            {
                                type: 'neo_lite_arg_both_motor_speed',
                            },
                            null,
                        ],
                        type: 'neo_lite_motor_move_both',
                    },
                    paramsKeyMap: {
                        SPEED_L: 0,
                        SPEED_R: 1,
                    },
                    class: 'neo_lite_motor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const speedL = script.getNumberValue('SPEED_L', script);
                            const speedR = script.getNumberValue('SPEED_R', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.MOTOR_MOVE_BOTH, [
                                speedL,
                                speedR,
                            ]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_motor_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_out_l, 1],
                                [Lang.Blocks.neo_lite_motor_out_r, 2],
                                [Lang.Blocks.neo_lite_motor_out_lr, 0],
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
                        params: [null, null],
                        type: 'neo_lite_motor_stop',
                    },
                    paramsKeyMap: {
                        DC: 0,
                    },
                    class: 'neo_lite_motor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const dc = script.getStringValue('DC', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            this.requestCommand(blockId, NeoBlockType.MOTOR_STOP, [dc]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },

                /**
                 * 서보모터
                 */
                neo_lite_servo_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_servo_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_servo_title',
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_servo_reset: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                        type: 'neo_lite_servo_reset',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.SERVO_RESET, [output]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_servo_angle: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_servo_angle_360, '360'],
                                [Lang.Blocks.neo_lite_servo_angle_350, '350'],
                                [Lang.Blocks.neo_lite_servo_angle_340, '340'],
                                [Lang.Blocks.neo_lite_servo_angle_330, '330'],
                                [Lang.Blocks.neo_lite_servo_angle_320, '320'],
                                [Lang.Blocks.neo_lite_servo_angle_310, '310'],
                                [Lang.Blocks.neo_lite_servo_angle_300, '300'],
                                [Lang.Blocks.neo_lite_servo_angle_290, '290'],
                                [Lang.Blocks.neo_lite_servo_angle_280, '280'],
                                [Lang.Blocks.neo_lite_servo_angle_270, '270'],
                                [Lang.Blocks.neo_lite_servo_angle_260, '260'],
                                [Lang.Blocks.neo_lite_servo_angle_250, '250'],
                                [Lang.Blocks.neo_lite_servo_angle_240, '240'],
                                [Lang.Blocks.neo_lite_servo_angle_230, '230'],
                                [Lang.Blocks.neo_lite_servo_angle_220, '220'],
                                [Lang.Blocks.neo_lite_servo_angle_210, '210'],
                                [Lang.Blocks.neo_lite_servo_angle_200, '200'],
                                [Lang.Blocks.neo_lite_servo_angle_190, '190'],
                                [Lang.Blocks.neo_lite_servo_angle_180, '180'],
                                [Lang.Blocks.neo_lite_servo_angle_170, '170'],
                                [Lang.Blocks.neo_lite_servo_angle_160, '160'],
                                [Lang.Blocks.neo_lite_servo_angle_150, '150'],
                                [Lang.Blocks.neo_lite_servo_angle_140, '140'],
                                [Lang.Blocks.neo_lite_servo_angle_130, '130'],
                                [Lang.Blocks.neo_lite_servo_angle_120, '120'],
                                [Lang.Blocks.neo_lite_servo_angle_110, '110'],
                                [Lang.Blocks.neo_lite_servo_angle_100, '100'],
                                [Lang.Blocks.neo_lite_servo_angle_90, '90'],
                                [Lang.Blocks.neo_lite_servo_angle_80, '80'],
                                [Lang.Blocks.neo_lite_servo_angle_70, '70'],
                                [Lang.Blocks.neo_lite_servo_angle_60, '60'],
                                [Lang.Blocks.neo_lite_servo_angle_50, '50'],
                                [Lang.Blocks.neo_lite_servo_angle_40, '40'],
                                [Lang.Blocks.neo_lite_servo_angle_30, '30'],
                                [Lang.Blocks.neo_lite_servo_angle_20, '20'],
                                [Lang.Blocks.neo_lite_servo_angle_10, '10'],
                                [Lang.Blocks.neo_lite_servo_angle_0, '0'],
                                [Lang.Blocks.neo_lite_servo_angle_n10, '-10'],
                                [Lang.Blocks.neo_lite_servo_angle_n20, '-20'],
                                [Lang.Blocks.neo_lite_servo_angle_n30, '-30'],
                                [Lang.Blocks.neo_lite_servo_angle_n40, '-40'],
                                [Lang.Blocks.neo_lite_servo_angle_n50, '-50'],
                                [Lang.Blocks.neo_lite_servo_angle_n60, '-60'],
                                [Lang.Blocks.neo_lite_servo_angle_n70, '-70'],
                                [Lang.Blocks.neo_lite_servo_angle_n80, '-80'],
                                [Lang.Blocks.neo_lite_servo_angle_n90, '-90'],
                                [Lang.Blocks.neo_lite_servo_angle_n100, '-100'],
                                [Lang.Blocks.neo_lite_servo_angle_n110, '-110'],
                                [Lang.Blocks.neo_lite_servo_angle_n120, '-120'],
                                [Lang.Blocks.neo_lite_servo_angle_n130, '-130'],
                                [Lang.Blocks.neo_lite_servo_angle_n140, '-140'],
                                [Lang.Blocks.neo_lite_servo_angle_n150, '-150'],
                                [Lang.Blocks.neo_lite_servo_angle_n160, '-160'],
                                [Lang.Blocks.neo_lite_servo_angle_n170, '-170'],
                                [Lang.Blocks.neo_lite_servo_angle_n180, '-180'],
                                [Lang.Blocks.neo_lite_servo_angle_n190, '-190'],
                                [Lang.Blocks.neo_lite_servo_angle_n200, '-200'],
                                [Lang.Blocks.neo_lite_servo_angle_n210, '-210'],
                                [Lang.Blocks.neo_lite_servo_angle_n220, '-220'],
                                [Lang.Blocks.neo_lite_servo_angle_n230, '-230'],
                                [Lang.Blocks.neo_lite_servo_angle_n240, '-240'],
                                [Lang.Blocks.neo_lite_servo_angle_n250, '-250'],
                                [Lang.Blocks.neo_lite_servo_angle_n260, '-260'],
                                [Lang.Blocks.neo_lite_servo_angle_n270, '-270'],
                                [Lang.Blocks.neo_lite_servo_angle_n280, '-280'],
                                [Lang.Blocks.neo_lite_servo_angle_n290, '-290'],
                                [Lang.Blocks.neo_lite_servo_angle_n300, '-300'],
                                [Lang.Blocks.neo_lite_servo_angle_n310, '-310'],
                                [Lang.Blocks.neo_lite_servo_angle_n320, '-320'],
                                [Lang.Blocks.neo_lite_servo_angle_n330, '-330'],
                                [Lang.Blocks.neo_lite_servo_angle_n340, '-340'],
                                [Lang.Blocks.neo_lite_servo_angle_n350, '-350'],
                                [Lang.Blocks.neo_lite_servo_angle_n360, '-360'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '90',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '50',
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
                        params: [null, null, null, null],
                        type: 'neo_lite_servo_angle',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        ANGLE: 1,
                        SPEED: 2,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringField('OUTPUT', script);
                            const angle = script.getStringField('ANGLE', script);
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            const isExt2 = angle.indexOf('IN') >= 0 && speed.indexOf('IN') >= 0;
                            if (isExt2) {
                                this.requestExt2Command(blockId, NeoBlockType.SERVO_ANGLE, [
                                    output,
                                    angle,
                                    speed,
                                ]);
                            } else {
                                const isExt1 = angle.indexOf('IN') >= 0 || speed.indexOf('IN') >= 0;
                                if (isExt1) {
                                    this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE, [
                                        output,
                                        angle,
                                        speed,
                                    ]);
                                } else {
                                    this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE, [
                                        output,
                                        angle,
                                        speed,
                                    ]);
                                }
                            }
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_servo_angle_var: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '50',
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
                                type: 'neo_lite_arg_servo_angle',
                            },
                            null,
                            null,
                        ],
                        type: 'neo_lite_servo_angle_var',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        ANGLE: 1,
                        SPEED: 2,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringField('OUTPUT', script);
                            const angle = script.getNumberValue('ANGLE', script);
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE, [
                                output,
                                angle,
                                speed,
                            ]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_servo_angle_wait: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_servo_angle_360, '360'],
                                [Lang.Blocks.neo_lite_servo_angle_350, '350'],
                                [Lang.Blocks.neo_lite_servo_angle_340, '340'],
                                [Lang.Blocks.neo_lite_servo_angle_330, '330'],
                                [Lang.Blocks.neo_lite_servo_angle_320, '320'],
                                [Lang.Blocks.neo_lite_servo_angle_310, '310'],
                                [Lang.Blocks.neo_lite_servo_angle_300, '300'],
                                [Lang.Blocks.neo_lite_servo_angle_290, '290'],
                                [Lang.Blocks.neo_lite_servo_angle_280, '280'],
                                [Lang.Blocks.neo_lite_servo_angle_270, '270'],
                                [Lang.Blocks.neo_lite_servo_angle_260, '260'],
                                [Lang.Blocks.neo_lite_servo_angle_250, '250'],
                                [Lang.Blocks.neo_lite_servo_angle_240, '240'],
                                [Lang.Blocks.neo_lite_servo_angle_230, '230'],
                                [Lang.Blocks.neo_lite_servo_angle_220, '220'],
                                [Lang.Blocks.neo_lite_servo_angle_210, '210'],
                                [Lang.Blocks.neo_lite_servo_angle_200, '200'],
                                [Lang.Blocks.neo_lite_servo_angle_190, '190'],
                                [Lang.Blocks.neo_lite_servo_angle_180, '180'],
                                [Lang.Blocks.neo_lite_servo_angle_170, '170'],
                                [Lang.Blocks.neo_lite_servo_angle_160, '160'],
                                [Lang.Blocks.neo_lite_servo_angle_150, '150'],
                                [Lang.Blocks.neo_lite_servo_angle_140, '140'],
                                [Lang.Blocks.neo_lite_servo_angle_130, '130'],
                                [Lang.Blocks.neo_lite_servo_angle_120, '120'],
                                [Lang.Blocks.neo_lite_servo_angle_110, '110'],
                                [Lang.Blocks.neo_lite_servo_angle_100, '100'],
                                [Lang.Blocks.neo_lite_servo_angle_90, '90'],
                                [Lang.Blocks.neo_lite_servo_angle_80, '80'],
                                [Lang.Blocks.neo_lite_servo_angle_70, '70'],
                                [Lang.Blocks.neo_lite_servo_angle_60, '60'],
                                [Lang.Blocks.neo_lite_servo_angle_50, '50'],
                                [Lang.Blocks.neo_lite_servo_angle_40, '40'],
                                [Lang.Blocks.neo_lite_servo_angle_30, '30'],
                                [Lang.Blocks.neo_lite_servo_angle_20, '20'],
                                [Lang.Blocks.neo_lite_servo_angle_10, '10'],
                                [Lang.Blocks.neo_lite_servo_angle_0, '0'],
                                [Lang.Blocks.neo_lite_servo_angle_n10, '-10'],
                                [Lang.Blocks.neo_lite_servo_angle_n20, '-20'],
                                [Lang.Blocks.neo_lite_servo_angle_n30, '-30'],
                                [Lang.Blocks.neo_lite_servo_angle_n40, '-40'],
                                [Lang.Blocks.neo_lite_servo_angle_n50, '-50'],
                                [Lang.Blocks.neo_lite_servo_angle_n60, '-60'],
                                [Lang.Blocks.neo_lite_servo_angle_n70, '-70'],
                                [Lang.Blocks.neo_lite_servo_angle_n80, '-80'],
                                [Lang.Blocks.neo_lite_servo_angle_n90, '-90'],
                                [Lang.Blocks.neo_lite_servo_angle_n100, '-100'],
                                [Lang.Blocks.neo_lite_servo_angle_n110, '-110'],
                                [Lang.Blocks.neo_lite_servo_angle_n120, '-120'],
                                [Lang.Blocks.neo_lite_servo_angle_n130, '-130'],
                                [Lang.Blocks.neo_lite_servo_angle_n140, '-140'],
                                [Lang.Blocks.neo_lite_servo_angle_n150, '-150'],
                                [Lang.Blocks.neo_lite_servo_angle_n160, '-160'],
                                [Lang.Blocks.neo_lite_servo_angle_n170, '-170'],
                                [Lang.Blocks.neo_lite_servo_angle_n180, '-180'],
                                [Lang.Blocks.neo_lite_servo_angle_n190, '-190'],
                                [Lang.Blocks.neo_lite_servo_angle_n200, '-200'],
                                [Lang.Blocks.neo_lite_servo_angle_n210, '-210'],
                                [Lang.Blocks.neo_lite_servo_angle_n220, '-220'],
                                [Lang.Blocks.neo_lite_servo_angle_n230, '-230'],
                                [Lang.Blocks.neo_lite_servo_angle_n240, '-240'],
                                [Lang.Blocks.neo_lite_servo_angle_n250, '-250'],
                                [Lang.Blocks.neo_lite_servo_angle_n260, '-260'],
                                [Lang.Blocks.neo_lite_servo_angle_n270, '-270'],
                                [Lang.Blocks.neo_lite_servo_angle_n280, '-280'],
                                [Lang.Blocks.neo_lite_servo_angle_n290, '-290'],
                                [Lang.Blocks.neo_lite_servo_angle_n300, '-300'],
                                [Lang.Blocks.neo_lite_servo_angle_n310, '-310'],
                                [Lang.Blocks.neo_lite_servo_angle_n320, '-320'],
                                [Lang.Blocks.neo_lite_servo_angle_n330, '-330'],
                                [Lang.Blocks.neo_lite_servo_angle_n340, '-340'],
                                [Lang.Blocks.neo_lite_servo_angle_n350, '-350'],
                                [Lang.Blocks.neo_lite_servo_angle_n360, '-360'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '90',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                            ],
                            value: '50',
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
                        params: [null, null, null, null],
                        type: 'neo_lite_servo_angle_wait',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        ANGLE: 1,
                        SPEED: 2,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringField('OUTPUT', script);
                            const angle = script.getStringField('ANGLE', script);
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            const isExt2 = angle.indexOf('IN') >= 0 && speed.indexOf('IN') >= 0;
                            if (isExt2) {
                                this.requestExt2Command(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [
                                    output,
                                    angle,
                                    speed,
                                ]);
                            } else {
                                const isExt1 = angle.indexOf('IN') >= 0 || speed.indexOf('IN') >= 0;
                                if (isExt1) {
                                    this.requestExtCommand(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [
                                        output,
                                        angle,
                                        speed,
                                    ]);
                                } else {
                                    this.requestCommand(blockId, NeoBlockType.SERVO_ANGLE_WAIT, [
                                        output,
                                        angle,
                                        speed,
                                    ]);
                                }
                            }
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_servo_rotate: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_servo_direction_f, 1],
                                [Lang.Blocks.neo_lite_servo_direction_b, 2],
                            ],
                            value: 1,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '50',
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
                        params: [null, null, null, null],
                        type: 'neo_lite_servo_rotate',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        DIRECTION: 1,
                        SPEED: 2,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringField('OUTPUT', script);
                            const direction = script.getStringField('DIRECTION', script);
                            const speed = script.getStringField('SPEED', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            if (speed.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.SERVO_ROTATE, [
                                    output,
                                    direction,
                                    speed,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.SERVO_ROTATE, [
                                    output,
                                    direction,
                                    speed,
                                ]);
                            }
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_servo_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                        type: 'neo_lite_servo_stop',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                    },
                    class: 'neo_lite_servo',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.SERVO_STOP, [output]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },

                /**
                 * LED
                 */
                neo_lite_led_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_led_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_led_title',
                    },
                    class: 'neo_lite_led',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_led_on: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_led_brightness_100, '100'],
                                [Lang.Blocks.neo_lite_led_brightness_90, '90'],
                                [Lang.Blocks.neo_lite_led_brightness_80, '80'],
                                [Lang.Blocks.neo_lite_led_brightness_70, '70'],
                                [Lang.Blocks.neo_lite_led_brightness_60, '60'],
                                [Lang.Blocks.neo_lite_led_brightness_50, '50'],
                                [Lang.Blocks.neo_lite_led_brightness_40, '40'],
                                [Lang.Blocks.neo_lite_led_brightness_30, '30'],
                                [Lang.Blocks.neo_lite_led_brightness_20, '20'],
                                [Lang.Blocks.neo_lite_led_brightness_10, '10'],
                                [Lang.Blocks.neo_lite_led_brightness_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '100',
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
                            null,
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_led_on',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        BRIGHTNESS: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const output = script.getStringValue('OUTPUT', script);
                            const brightness = script.getStringValue('BRIGHTNESS', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            if (brightness.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.LED_ON, [
                                    output,
                                    brightness,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.LED_ON, [
                                    output,
                                    brightness,
                                ]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.block_id = blockId;
                                script.exec_phase = ExecPhase.PENDING_STOP;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const output = script.getStringField('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LED_ON, [output, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_led_blink: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_led_blink_speed_1, 500],
                                [Lang.Blocks.neo_lite_led_blink_speed_2, 400],
                                [Lang.Blocks.neo_lite_led_blink_speed_3, 300],
                                [Lang.Blocks.neo_lite_led_blink_speed_4, 200],
                                [Lang.Blocks.neo_lite_led_blink_speed_5, 100],
                            ],
                            value: 500,
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
                            null,
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_led_blink',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        SPEED: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const output = script.getStringValue('OUTPUT', script);
                            const speed = script.getStringValue('SPEED', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            this.requestCommand(blockId, NeoBlockType.LED_BLINK, [
                                output,
                                speed,
                                100,
                            ]);
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.exec_phase = ExecPhase.PENDING_STOP;
                                script.block_id = blockId;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LED_BLINK, [output, 0, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_led_off: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                        type: 'neo_lite_led_off',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                    },
                    class: 'neo_lite_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LED_OFF, [output]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * 컬러 LED
                 */
                neo_lite_color_led_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_color_led_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_color_led_title',
                    },
                    class: 'neo_lite_color_led',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_color_led_on: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Color',
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
                            '#0000FF',
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_color_led_on',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        COLOR: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_color_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const output = script.getStringValue('OUTPUT', script);
                            const color = script.getStringValue('COLOR', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            this.requestCommand(blockId, NeoBlockType.COLOR_LED_ON, [
                                output,
                                color,
                            ]);
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.exec_phase = ExecPhase.PENDING_STOP;
                                script.block_id = blockId;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.COLOR_LED_ON, [output, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_color_led_off: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                        type: 'neo_lite_color_led_off',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                    },
                    class: 'neo_lite_color_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.COLOR_LED_OFF, [output]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_color_led_on_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
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
                        type: 'neo_lite_color_led_on_with_sensor',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        OUTPUT: 1,
                    },
                    class: 'neo_lite_color_led',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const input = script.getStringValue('INPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestExtCommand(blockId, NeoBlockType.COLOR_LED_ON_SENSOR, [
                                output,
                                input,
                            ]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * 출력
                 */
                neo_lite_set_output_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_set_output_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_set_output_title',
                    },
                    class: 'neo_lite_set_output',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_set_output: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                                [Lang.Blocks.neo_lite_output_12, 'OUT12'],
                                [Lang.Blocks.neo_lite_output_123, 'OUT123'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_set_output_value_255, '255'],
                                [Lang.Blocks.neo_lite_set_output_value_250, '250'],
                                [Lang.Blocks.neo_lite_set_output_value_245, '245'],
                                [Lang.Blocks.neo_lite_set_output_value_240, '240'],
                                [Lang.Blocks.neo_lite_set_output_value_235, '235'],
                                [Lang.Blocks.neo_lite_set_output_value_230, '230'],
                                [Lang.Blocks.neo_lite_set_output_value_225, '225'],
                                [Lang.Blocks.neo_lite_set_output_value_220, '220'],
                                [Lang.Blocks.neo_lite_set_output_value_215, '215'],
                                [Lang.Blocks.neo_lite_set_output_value_210, '210'],
                                [Lang.Blocks.neo_lite_set_output_value_205, '205'],
                                [Lang.Blocks.neo_lite_set_output_value_200, '200'],
                                [Lang.Blocks.neo_lite_set_output_value_195, '195'],
                                [Lang.Blocks.neo_lite_set_output_value_190, '190'],
                                [Lang.Blocks.neo_lite_set_output_value_185, '185'],
                                [Lang.Blocks.neo_lite_set_output_value_180, '180'],
                                [Lang.Blocks.neo_lite_set_output_value_175, '175'],
                                [Lang.Blocks.neo_lite_set_output_value_170, '170'],
                                [Lang.Blocks.neo_lite_set_output_value_165, '165'],
                                [Lang.Blocks.neo_lite_set_output_value_160, '160'],
                                [Lang.Blocks.neo_lite_set_output_value_155, '155'],
                                [Lang.Blocks.neo_lite_set_output_value_150, '150'],
                                [Lang.Blocks.neo_lite_set_output_value_145, '145'],
                                [Lang.Blocks.neo_lite_set_output_value_140, '140'],
                                [Lang.Blocks.neo_lite_set_output_value_135, '135'],
                                [Lang.Blocks.neo_lite_set_output_value_130, '130'],
                                [Lang.Blocks.neo_lite_set_output_value_125, '125'],
                                [Lang.Blocks.neo_lite_set_output_value_120, '120'],
                                [Lang.Blocks.neo_lite_set_output_value_115, '115'],
                                [Lang.Blocks.neo_lite_set_output_value_110, '110'],
                                [Lang.Blocks.neo_lite_set_output_value_105, '105'],
                                [Lang.Blocks.neo_lite_set_output_value_100, '100'],
                                [Lang.Blocks.neo_lite_set_output_value_95, '95'],
                                [Lang.Blocks.neo_lite_set_output_value_90, '90'],
                                [Lang.Blocks.neo_lite_set_output_value_85, '85'],
                                [Lang.Blocks.neo_lite_set_output_value_80, '80'],
                                [Lang.Blocks.neo_lite_set_output_value_75, '75'],
                                [Lang.Blocks.neo_lite_set_output_value_70, '70'],
                                [Lang.Blocks.neo_lite_set_output_value_65, '65'],
                                [Lang.Blocks.neo_lite_set_output_value_60, '60'],
                                [Lang.Blocks.neo_lite_set_output_value_55, '55'],
                                [Lang.Blocks.neo_lite_set_output_value_50, '50'],
                                [Lang.Blocks.neo_lite_set_output_value_45, '45'],
                                [Lang.Blocks.neo_lite_set_output_value_40, '40'],
                                [Lang.Blocks.neo_lite_set_output_value_35, '35'],
                                [Lang.Blocks.neo_lite_set_output_value_30, '30'],
                                [Lang.Blocks.neo_lite_set_output_value_25, '25'],
                                [Lang.Blocks.neo_lite_set_output_value_20, '20'],
                                [Lang.Blocks.neo_lite_set_output_value_15, '15'],
                                [Lang.Blocks.neo_lite_set_output_value_10, '10'],
                                [Lang.Blocks.neo_lite_set_output_value_5, '5'],
                                [Lang.Blocks.neo_lite_set_output_value_0, '0'],
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: '255',
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
                            null,
                            {
                                type: 'neo_lite_arg_duration',
                            },
                            null,
                        ],
                        type: 'neo_lite_set_output',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        VALUE: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_set_output',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const output = script.getStringValue('OUTPUT', script);
                            const value = script.getStringValue('VALUE', script);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            if (value.indexOf('IN') >= 0) {
                                this.requestExtCommand(blockId, NeoBlockType.SET_OUTPUT, [
                                    output,
                                    value,
                                ]);
                            } else {
                                this.requestCommand(blockId, NeoBlockType.SET_OUTPUT, [
                                    output,
                                    value,
                                ]);
                            }
                            if (duration === 'c' || !Entry.parseNumber(duration)) {
                                script.exec_phase = ExecPhase.PENDING_STOP;
                                script.block_id = blockId;
                            } else {
                                script.exec_phase = ExecPhase.SET_TIMEOUT;
                            }
                        } else if (script.exec_phase === ExecPhase.SET_TIMEOUT) {
                            const duration = script.getStringValue('DURATION', script);
                            const durationValue = Entry.parseNumber(duration);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, durationValue * 1000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const output = script.getStringValue('OUTPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.SET_OUTPUT, [output, 0]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * 센서
                 */
                neo_lite_sensor_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_sensor_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_sensor_title',
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_sensor_in: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neo_lite_sensor_in',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getStringField('INPUT');
                        const sensorData = this.sensorValues;
                        switch (input) {
                            case 'IN1':
                                return sensorData['in1Values'][0];
                            case 'IN2':
                                return sensorData['in2Values'][0];
                            case 'IN3':
                                return sensorData['in3Values'][0];
                        }
                        return 0;
                    },
                },
                neo_lite_sensor_digital_in: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                            ],
                            value: 'IN1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_sensor_in_digital_1, 0],
                                [Lang.Blocks.neo_lite_sensor_in_digital_2, 1],
                                [Lang.Blocks.neo_lite_sensor_in_digital_3, 2],
                                [Lang.Blocks.neo_lite_sensor_in_digital_4, 3],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'neo_lite_sensor_digital_in',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        INDEX: 1,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getStringField('INPUT');
                        const index = script.getNumberField('INDEX');
                        const sensorData = this.sensorValues;
                        switch (input) {
                            case 'IN1':
                                return sensorData['in1Values'][index];
                            case 'IN2':
                                return sensorData['in2Values'][index];
                            case 'IN3':
                                return sensorData['in3Values'][index];
                        }
                        return 0;
                    },
                },
                neo_lite_sensor_convert: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    fontColor: '#fff',
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
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'neo_lite_sensor_in',
                            },
                            {
                                type: 'number',
                                params: ['10'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
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
                        type: 'neo_lite_sensor_convert',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        FROM_MIN: 1,
                        FROM_MAX: 2,
                        TO_MIN: 3,
                        TO_MAX: 4,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getNumberValue('INPUT', script);
                        let value = input;
                        let fromMin = script.getNumberValue('FROM_MIN', script);
                        let fromMax = script.getNumberValue('FROM_MAX', script);
                        let toMin = script.getNumberValue('TO_MIN', script);
                        let toMax = script.getNumberValue('TO_MAX', script);

                        if (fromMin > fromMax) {
                            const temp = fromMin;
                            fromMin = fromMax;
                            fromMax = temp;
                        }

                        if (toMin > toMax) {
                            const temp = toMin;
                            toMin = toMax;
                            toMax = temp;
                        }

                        value -= fromMin;
                        value = value * ((toMax - toMin) / (fromMax - fromMin));
                        value += toMin;
                        value = Math.min(toMax, value);
                        value = Math.max(toMin, value);

                        return Math.round(value);
                    },
                },
                neo_lite_sensor_compare: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_compare_gt, '>='],
                                [Lang.Blocks.neo_lite_compare_g, '>'],
                                [Lang.Blocks.neo_lite_compare_e, '='],
                                [Lang.Blocks.neo_lite_compare_l, '<'],
                                [Lang.Blocks.neo_lite_compare_lt, '<='],
                            ],
                            value: '>',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'neo_lite_sensor_in',
                            },
                            ,
                            null,
                            10,
                        ],
                        type: 'neo_lite_sensor_compare',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        SYMBOL: 1,
                        VALUE: 2,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getNumberValue('INPUT', script);
                        const symbol = script.getStringField('SYMBOL');
                        const value = Entry.parseNumber(script.getStringValue('VALUE'));

                        let sensorValue = input;
                        if (symbol === '=') {
                            return sensorValue === value;
                        } else if (symbol === '>') {
                            return sensorValue > value;
                        } else if (symbol === '<') {
                            return sensorValue < value;
                        } else if (symbol === '>=') {
                            return sensorValue >= value;
                        } else if (symbol === '<=') {
                            return sensorValue <= value;
                        }

                        return false;
                    },
                },
                neo_lite_sensor_between: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_compare_gt, '>='],
                                [Lang.Blocks.neo_lite_compare_g, '>'],
                                [Lang.Blocks.neo_lite_compare_e, '='],
                                [Lang.Blocks.neo_lite_compare_l, '<'],
                                [Lang.Blocks.neo_lite_compare_lt, '<='],
                            ],
                            value: '<',
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_compare_gt, '>='],
                                [Lang.Blocks.neo_lite_compare_g, '>'],
                                [Lang.Blocks.neo_lite_compare_e, '='],
                                [Lang.Blocks.neo_lite_compare_l, '<'],
                                [Lang.Blocks.neo_lite_compare_lt, '<='],
                            ],
                            value: '<',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            10,
                            null,
                            {
                                type: 'neo_lite_sensor_in',
                            },
                            ,
                            null,
                            30,
                        ],
                        type: 'neo_lite_sensor_between',
                    },
                    paramsKeyMap: {
                        L_VALUE: 0,
                        L_SYMBOL: 1,
                        INPUT: 2,
                        R_SYMBOL: 3,
                        R_VALUE: 4,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getNumberValue('INPUT', script);
                        const lSymbol = script.getStringField('L_SYMBOL');
                        const lValue = Entry.parseNumber(script.getStringValue('L_VALUE'));
                        const rSymbol = script.getStringField('R_SYMBOL');
                        const rValue = Entry.parseNumber(script.getStringValue('R_VALUE'));

                        let sensorValue = input;
                        let lResult = false;
                        if (lSymbol === '=') {
                            lResult = lValue === sensorValue;
                        } else if (lSymbol === '>') {
                            lResult = lValue > sensorValue;
                        } else if (lSymbol === '<') {
                            lResult = lValue < sensorValue;
                        } else if (lSymbol === '>=') {
                            lResult = lValue >= sensorValue;
                        } else if (lSymbol === '<=') {
                            lResult = lValue <= sensorValue;
                        }
                        let rResult = false;
                        if (rSymbol === '=') {
                            rResult = sensorValue === rValue;
                        } else if (rSymbol === '>') {
                            rResult = sensorValue > rValue;
                        } else if (rSymbol === '<') {
                            rResult = sensorValue < rValue;
                        } else if (rSymbol === '>=') {
                            rResult = sensorValue >= rValue;
                        } else if (rSymbol === '<=') {
                            rResult = sensorValue <= rValue;
                        }
                        return lResult && rResult;
                    },
                },
                neo_lite_sensor_color_compare: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_color_black, 1],
                                [Lang.Blocks.neo_lite_color_white, 2],
                                [Lang.Blocks.neo_lite_color_red, 3],
                                [Lang.Blocks.neo_lite_color_yellow, 4],
                                [Lang.Blocks.neo_lite_color_green, 5],
                                [Lang.Blocks.neo_lite_color_blue, 6],
                            ],
                            value: '2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'neo_lite_sensor_in',
                            },
                            ,
                            null,
                        ],
                        type: 'neo_lite_sensor_color_compare',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        COLOR: 1,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getNumberValue('INPUT', script);
                        const color = script.getNumberField('COLOR');
                        let sensorValue = input;
                        if (color === 1) {
                            return 0 <= sensorValue && sensorValue <= 10;
                        } else if (color === 2) {
                            return 11 <= sensorValue && sensorValue <= 59;
                        } else if (color === 3) {
                            return 61 <= sensorValue && sensorValue <= 99;
                        } else if (color === 4) {
                            return 101 <= sensorValue && sensorValue <= 139;
                        } else if (color === 5) {
                            return 141 <= sensorValue && sensorValue <= 179;
                        } else if (color === 6) {
                            return 181 <= sensorValue && sensorValue <= 219;
                        }

                        return false;
                    },
                },
                neo_lite_sensor_color_sequence_compare: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#ffffff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['IN1', 'IN1'],
                                ['IN2', 'IN2'],
                                ['IN3', 'IN3'],
                            ],
                            value: 'IN2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_color_seq_ryg, 1],
                                [Lang.Blocks.neo_lite_color_seq_ryb, 2],
                                [Lang.Blocks.neo_lite_color_seq_rgy, 3],
                                [Lang.Blocks.neo_lite_color_seq_rgb, 4],
                                [Lang.Blocks.neo_lite_color_seq_rby, 5],
                                [Lang.Blocks.neo_lite_color_seq_rbg, 6],
                                [Lang.Blocks.neo_lite_color_seq_yrb, 7],
                                [Lang.Blocks.neo_lite_color_seq_ygr, 8],
                                [Lang.Blocks.neo_lite_color_seq_ygb, 9],
                                [Lang.Blocks.neo_lite_color_seq_ybr, 10],
                                [Lang.Blocks.neo_lite_color_seq_grb, 11],
                                [Lang.Blocks.neo_lite_color_seq_gyr, 12],
                                [Lang.Blocks.neo_lite_color_seq_gyb, 13],
                                [Lang.Blocks.neo_lite_color_seq_gbr, 14],
                                [Lang.Blocks.neo_lite_color_seq_bry, 15],
                                [Lang.Blocks.neo_lite_color_seq_brg, 16],
                                [Lang.Blocks.neo_lite_color_seq_byr, 17],
                                [Lang.Blocks.neo_lite_color_seq_byg, 18],
                                [Lang.Blocks.neo_lite_color_seq_bgr, 19],
                                [Lang.Blocks.neo_lite_color_seq_bgy, 20],
                            ],
                            value: '2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neo_lite_sensor_color_sequence_compare',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        COLOR: 1,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const input = script.getNumberField('INPUT');
                        const color = script.getNumberField('COLOR');
                        const sensorData = this.sensorValues;
                        let seq1 = 0;
                        let seq2 = 0;
                        let seq3 = 0;
                        switch (input) {
                            case 'IN1':
                                seq1 = sensorData['in1Values'][1];
                                seq2 = sensorData['in1Values'][2];
                                seq3 = sensorData['in1Values'][3];
                                break;
                            case 'IN2':
                                seq1 = sensorData['in2Values'][1];
                                seq2 = sensorData['in2Values'][2];
                                seq3 = sensorData['in2Values'][3];
                                break;
                            case 'IN3':
                                seq1 = sensorData['in3Values'][1];
                                seq2 = sensorData['in3Values'][2];
                                seq3 = sensorData['in3Values'][3];
                                break;
                        }
                        switch (color) {
                            case 1:
                                return seq1 === 80 && seq2 === 120 && seq3 === 160;
                            case 2:
                                return seq1 === 80 && seq2 === 120 && seq3 === 200;
                            case 3:
                                return seq1 === 80 && seq2 === 160 && seq3 === 120;
                            case 4:
                                return seq1 === 80 && seq2 === 160 && seq3 === 200;
                            case 5:
                                return seq1 === 80 && seq2 === 200 && seq3 === 120;
                            case 6:
                                return seq1 === 80 && seq2 === 200 && seq3 === 160;
                            case 7:
                                return seq1 === 120 && seq2 === 80 && seq3 === 200;
                            case 8:
                                return seq1 === 120 && seq2 === 160 && seq3 === 80;
                            case 9:
                                return seq1 === 120 && seq2 === 160 && seq3 === 200;
                            case 10:
                                return seq1 === 120 && seq2 === 200 && seq3 === 80;
                            case 11:
                                return seq1 === 160 && seq2 === 80 && seq3 === 200;
                            case 12:
                                return seq1 === 160 && seq2 === 120 && seq3 === 80;
                            case 13:
                                return seq1 === 160 && seq2 === 120 && seq3 === 200;
                            case 14:
                                return seq1 === 160 && seq2 === 200 && seq3 === 80;
                            case 15:
                                return seq1 === 200 && seq2 === 80 && seq3 === 120;
                            case 16:
                                return seq1 === 200 && seq2 === 80 && seq3 === 160;
                            case 17:
                                return seq1 === 200 && seq2 === 120 && seq3 === 80;
                            case 18:
                                return seq1 === 200 && seq2 === 120 && seq3 === 160;
                            case 19:
                                return seq1 === 200 && seq2 === 160 && seq3 === 80;
                            case 20:
                                return seq1 === 200 && seq2 === 160 && seq3 === 120;
                        }

                        return false;
                    },
                },
                neo_lite_sensor_button_pressed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#FFFFFF',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_button_1, '1'],
                                [Lang.Blocks.neo_lite_button_2, '2'],
                                [Lang.Blocks.neo_lite_button_3, '3'],
                                [Lang.Blocks.neo_lite_button_4, '4'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_button_on, 'ON'],
                                [Lang.Blocks.neo_lite_button_off, 'OFF'],
                            ],
                            value: 'on',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'neo_lite_sensor_button_pressed',
                    },
                    paramsKeyMap: {
                        BUTTON: 0,
                        PRESSED: 1,
                    },
                    class: 'neo_lite_sensor',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        const button = script.getNumberField('BUTTON');
                        const pressed = script.getStringField('PRESSED');
                        const sensorData = this.sensorValues;
                        const value = sensorData['IR'];
                        if (button === 1) {
                            if (pressed === 'ON') return value === 10;
                            else return value !== 10;
                        } else if (button === 2) {
                            if (pressed === 'ON') return value === 11;
                            else return value !== 11;
                        } else if (button === 3) {
                            if (pressed === 'ON') return value === 12;
                            else return value !== 12;
                        } else if (button === 4) {
                            if (pressed === 'ON') return value === 13;
                            else return value !== 13;
                        }
                    },
                },
                /**
                 * 버저
                 */
                neo_lite_buzzer_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_buzzer_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_buzzer_title',
                    },
                    class: 'neo_lite_buzzer',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_buzzer_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_buzzer_octave_1, '0'],
                                [Lang.Blocks.neo_lite_buzzer_octave_2, '1'],
                                [Lang.Blocks.neo_lite_buzzer_octave_3, '2'],
                                [Lang.Blocks.neo_lite_buzzer_octave_4, '3'],
                                [Lang.Blocks.neo_lite_buzzer_octave_5, '4'],
                                [Lang.Blocks.neo_lite_buzzer_octave_6, '5'],
                            ],
                            value: '2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_buzzer_do, '1'],
                                [Lang.Blocks.neo_lite_buzzer_do_sharp, '2'],
                                [Lang.Blocks.neo_lite_buzzer_re, '3'],
                                [Lang.Blocks.neo_lite_buzzer_re_sharp, '4'],
                                [Lang.Blocks.neo_lite_buzzer_mi, '5'],
                                [Lang.Blocks.neo_lite_buzzer_fa, '6'],
                                [Lang.Blocks.neo_lite_buzzer_fa_sharp, '7'],
                                [Lang.Blocks.neo_lite_buzzer_sol, '8'],
                                [Lang.Blocks.neo_lite_buzzer_sol_sharp, '9'],
                                [Lang.Blocks.neo_lite_buzzer_la, '10'],
                                [Lang.Blocks.neo_lite_buzzer_la_sharp, '11'],
                                [Lang.Blocks.neo_lite_buzzer_ti, '12'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },

                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_buzzer_whole_note, '1'],
                                [Lang.Blocks.neo_lite_buzzer_half_note, '2'],
                                [Lang.Blocks.neo_lite_buzzer_quarter_note, '4'],
                                [Lang.Blocks.neo_lite_buzzer_8th_note, '8'],
                            ],
                            value: '4',
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
                        params: [null, null, null, null],
                        type: 'neo_lite_buzzer_start',
                    },
                    paramsKeyMap: {
                        OCTAVE: 0,
                        NOTE: 1,
                        DURATION: 2,
                    },
                    class: 'neo_lite_buzzer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            const octave = script.getNumberField('OCTAVE', script);
                            const note = script.getNumberField('NOTE', script);
                            const value = Math.min(note + 12 * octave, 72);
                            const duration = script.getStringValue('DURATION', script);
                            const blockId = this.generateBlockId();
                            this.requestCommand(blockId, NeoBlockType.BUZZER_START, [value]);
                            script.exec_phase = ExecPhase.WAIT_TIMEOUT;
                            setTimeout(function() {
                                script.exec_phase = ExecPhase.STOP;
                            }, (1 / duration) * 2000);
                        } else if (script.exec_phase === ExecPhase.WAIT_TIMEOUT) {
                            return script;
                        } else if (script.exec_phase === ExecPhase.STOP) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.BUZZER_STOP, []);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_buzzer_with_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_input_1, 'IN1'],
                                [Lang.Blocks.neo_lite_input_2, 'IN2'],
                                [Lang.Blocks.neo_lite_input_3, 'IN3'],
                            ],
                            value: 'IN1',
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
                        type: 'neo_lite_buzzer_with_sensor',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                    },
                    class: 'neo_lite_buzzer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const input = script.getStringValue('INPUT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestExtCommand(blockId, NeoBlockType.BUZZER_WITH_SENSOR, [
                                input,
                            ]);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_buzzer_stop: {
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
                        type: 'neo_lite_buzzer_stop',
                    },
                    paramsKeyMap: {},
                    class: 'neo_lite_buzzer',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_STOP;
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.BUZZER_STOP, []);
                        } else if (script.exec_phase === ExecPhase.PENDING_STOP) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * LCD
                 */
                neo_lite_lcd_title: {
                    color: EntryStatic.colorSet.common.TRANSPARENT,
                    fontColor: '#191970',
                    skeleton: 'basic_text',
                    skeletonOptions: {
                        contentPos: {
                            x: 5,
                        },
                    },
                    params: [
                        {
                            type: 'Text',
                            text: Lang.template.neo_lite_lcd_title,
                            color: '#191970',
                            align: 'left',
                        },
                    ],
                    def: {
                        type: 'neo_lite_lcd_title',
                    },
                    class: 'neo_lite_lcd',
                    isNotFor: ['NeoLite'],
                    events: {},
                },
                neo_lite_lcd_image: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                            ],
                            value: 'OUT1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_lcd_image_1, '1'],
                                [Lang.Blocks.neo_lite_lcd_image_2, '2'],
                                [Lang.Blocks.neo_lite_lcd_image_3, '3'],
                                [Lang.Blocks.neo_lite_lcd_image_4, '4'],
                                [Lang.Blocks.neo_lite_lcd_image_5, '5'],
                                [Lang.Blocks.neo_lite_lcd_image_6, '6'],
                                [Lang.Blocks.neo_lite_lcd_image_7, '7'],
                                [Lang.Blocks.neo_lite_lcd_image_8, '8'],
                                [Lang.Blocks.neo_lite_lcd_image_9, '9'],
                                [Lang.Blocks.neo_lite_lcd_image_10, '10'],
                                [Lang.Blocks.neo_lite_lcd_image_11, '11'],
                                [Lang.Blocks.neo_lite_lcd_image_12, '12'],
                                [Lang.Blocks.neo_lite_lcd_image_13, '13'],
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
                        type: 'neo_lite_lcd_image',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        IMAGE: 1,
                    },
                    class: 'neo_lite_lcd',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const image = script.getStringValue('IMAGE', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LCD_IMAGE, [output, image]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                neo_lite_lcd_text: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_output_1, 'OUT1'],
                                [Lang.Blocks.neo_lite_output_2, 'OUT2'],
                                [Lang.Blocks.neo_lite_output_3, 'OUT3'],
                            ],
                            value: 'OUT1',
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
                        params: [null, 'NEO', null],
                        type: 'neo_lite_lcd_text',
                    },
                    paramsKeyMap: {
                        OUTPUT: 0,
                        TEXT: 1,
                    },
                    class: 'neo_lite_lcd',
                    isNotFor: ['NeoLite'],
                    func: (sprite, script) => {
                        if (!script.exec_phase) {
                            script.exec_phase = ExecPhase.PENDING_RESPONSE;
                            const output = script.getStringValue('OUTPUT', script);
                            const text = script.getStringValue('TEXT', script);
                            const blockId = this.generateBlockId();
                            script.block_id = blockId;
                            this.requestCommand(blockId, NeoBlockType.LCD_TEXT, [output, text]);
                        } else if (script.exec_phase === ExecPhase.PENDING_RESPONSE) {
                            if (!this.pendingResponseList[script.block_id]) {
                                delete script.block_id;
                                delete script.exec_phase;
                                return script.callReturn();
                            }
                        }
                        return script;
                    },
                },
                /**
                 * ARG Blocks
                 */
                neo_lite_arg_duration: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_duration_c, 'c'],
                                [Lang.Blocks.neo_lite_duration_0, '0'],
                                [Lang.Blocks.neo_lite_duration_1, '1'],
                                [Lang.Blocks.neo_lite_duration_2, '2'],
                                [Lang.Blocks.neo_lite_duration_3, '3'],
                                [Lang.Blocks.neo_lite_duration_4, '4'],
                                [Lang.Blocks.neo_lite_duration_5, '5'],
                                [Lang.Blocks.neo_lite_duration_6, '6'],
                                [Lang.Blocks.neo_lite_duration_7, '7'],
                                [Lang.Blocks.neo_lite_duration_8, '8'],
                                [Lang.Blocks.neo_lite_duration_9, '9'],
                            ],
                            value: 'c',
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
                        VALUE: 0,
                    },
                    class: 'neo_lite_arg',
                    isNotFor: ['NeoLite'],
                    func: function(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },
                neo_lite_arg_both_motor_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_motor_speed_100, '100'],
                                [Lang.Blocks.neo_lite_motor_speed_95, '95'],
                                [Lang.Blocks.neo_lite_motor_speed_90, '90'],
                                [Lang.Blocks.neo_lite_motor_speed_85, '85'],
                                [Lang.Blocks.neo_lite_motor_speed_80, '80'],
                                [Lang.Blocks.neo_lite_motor_speed_75, '75'],
                                [Lang.Blocks.neo_lite_motor_speed_70, '70'],
                                [Lang.Blocks.neo_lite_motor_speed_65, '65'],
                                [Lang.Blocks.neo_lite_motor_speed_60, '60'],
                                [Lang.Blocks.neo_lite_motor_speed_55, '55'],
                                [Lang.Blocks.neo_lite_motor_speed_50, '50'],
                                [Lang.Blocks.neo_lite_motor_speed_45, '45'],
                                [Lang.Blocks.neo_lite_motor_speed_40, '40'],
                                [Lang.Blocks.neo_lite_motor_speed_35, '35'],
                                [Lang.Blocks.neo_lite_motor_speed_30, '30'],
                                [Lang.Blocks.neo_lite_motor_speed_25, '25'],
                                [Lang.Blocks.neo_lite_motor_speed_20, '20'],
                                [Lang.Blocks.neo_lite_motor_speed_15, '15'],
                                [Lang.Blocks.neo_lite_motor_speed_10, '10'],
                                [Lang.Blocks.neo_lite_motor_speed_5, '5'],
                                [Lang.Blocks.neo_lite_motor_speed_0, '0'],
                                [Lang.Blocks.neo_lite_motor_speed_n5, '-5'],
                                [Lang.Blocks.neo_lite_motor_speed_n10, '-10'],
                                [Lang.Blocks.neo_lite_motor_speed_n15, '-15'],
                                [Lang.Blocks.neo_lite_motor_speed_n20, '-20'],
                                [Lang.Blocks.neo_lite_motor_speed_n25, '-25'],
                                [Lang.Blocks.neo_lite_motor_speed_n30, '-30'],
                                [Lang.Blocks.neo_lite_motor_speed_n35, '-35'],
                                [Lang.Blocks.neo_lite_motor_speed_n40, '-40'],
                                [Lang.Blocks.neo_lite_motor_speed_n45, '-45'],
                                [Lang.Blocks.neo_lite_motor_speed_n50, '-50'],
                                [Lang.Blocks.neo_lite_motor_speed_n55, '-55'],
                                [Lang.Blocks.neo_lite_motor_speed_n60, '-60'],
                                [Lang.Blocks.neo_lite_motor_speed_n65, '-65'],
                                [Lang.Blocks.neo_lite_motor_speed_n70, '-70'],
                                [Lang.Blocks.neo_lite_motor_speed_n75, '-75'],
                                [Lang.Blocks.neo_lite_motor_speed_n80, '-80'],
                                [Lang.Blocks.neo_lite_motor_speed_n85, '-85'],
                                [Lang.Blocks.neo_lite_motor_speed_n90, '-90'],
                                [Lang.Blocks.neo_lite_motor_speed_n95, '-95'],
                                [Lang.Blocks.neo_lite_motor_speed_n100, '-100'],
                            ],
                            value: '100',
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
                        VALUE: 0,
                    },
                    class: 'neo_lite_arg',
                    isNotFor: ['NeoLite'],
                    func: function(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },
                neo_lite_arg_servo_angle: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.neo_lite_servo_angle_360, '360'],
                                [Lang.Blocks.neo_lite_servo_angle_350, '350'],
                                [Lang.Blocks.neo_lite_servo_angle_340, '340'],
                                [Lang.Blocks.neo_lite_servo_angle_330, '330'],
                                [Lang.Blocks.neo_lite_servo_angle_320, '320'],
                                [Lang.Blocks.neo_lite_servo_angle_310, '310'],
                                [Lang.Blocks.neo_lite_servo_angle_300, '300'],
                                [Lang.Blocks.neo_lite_servo_angle_290, '290'],
                                [Lang.Blocks.neo_lite_servo_angle_280, '280'],
                                [Lang.Blocks.neo_lite_servo_angle_270, '270'],
                                [Lang.Blocks.neo_lite_servo_angle_260, '260'],
                                [Lang.Blocks.neo_lite_servo_angle_250, '250'],
                                [Lang.Blocks.neo_lite_servo_angle_240, '240'],
                                [Lang.Blocks.neo_lite_servo_angle_230, '230'],
                                [Lang.Blocks.neo_lite_servo_angle_220, '220'],
                                [Lang.Blocks.neo_lite_servo_angle_210, '210'],
                                [Lang.Blocks.neo_lite_servo_angle_200, '200'],
                                [Lang.Blocks.neo_lite_servo_angle_190, '190'],
                                [Lang.Blocks.neo_lite_servo_angle_180, '180'],
                                [Lang.Blocks.neo_lite_servo_angle_170, '170'],
                                [Lang.Blocks.neo_lite_servo_angle_160, '160'],
                                [Lang.Blocks.neo_lite_servo_angle_150, '150'],
                                [Lang.Blocks.neo_lite_servo_angle_140, '140'],
                                [Lang.Blocks.neo_lite_servo_angle_130, '130'],
                                [Lang.Blocks.neo_lite_servo_angle_120, '120'],
                                [Lang.Blocks.neo_lite_servo_angle_110, '110'],
                                [Lang.Blocks.neo_lite_servo_angle_100, '100'],
                                [Lang.Blocks.neo_lite_servo_angle_90, '90'],
                                [Lang.Blocks.neo_lite_servo_angle_80, '80'],
                                [Lang.Blocks.neo_lite_servo_angle_70, '70'],
                                [Lang.Blocks.neo_lite_servo_angle_60, '60'],
                                [Lang.Blocks.neo_lite_servo_angle_50, '50'],
                                [Lang.Blocks.neo_lite_servo_angle_40, '40'],
                                [Lang.Blocks.neo_lite_servo_angle_30, '30'],
                                [Lang.Blocks.neo_lite_servo_angle_20, '20'],
                                [Lang.Blocks.neo_lite_servo_angle_10, '10'],
                                [Lang.Blocks.neo_lite_servo_angle_0, '0'],
                                [Lang.Blocks.neo_lite_servo_angle_n10, '-10'],
                                [Lang.Blocks.neo_lite_servo_angle_n20, '-20'],
                                [Lang.Blocks.neo_lite_servo_angle_n30, '-30'],
                                [Lang.Blocks.neo_lite_servo_angle_n40, '-40'],
                                [Lang.Blocks.neo_lite_servo_angle_n50, '-50'],
                                [Lang.Blocks.neo_lite_servo_angle_n60, '-60'],
                                [Lang.Blocks.neo_lite_servo_angle_n70, '-70'],
                                [Lang.Blocks.neo_lite_servo_angle_n80, '-80'],
                                [Lang.Blocks.neo_lite_servo_angle_n90, '-90'],
                                [Lang.Blocks.neo_lite_servo_angle_n100, '-100'],
                                [Lang.Blocks.neo_lite_servo_angle_n110, '-110'],
                                [Lang.Blocks.neo_lite_servo_angle_n120, '-120'],
                                [Lang.Blocks.neo_lite_servo_angle_n130, '-130'],
                                [Lang.Blocks.neo_lite_servo_angle_n140, '-140'],
                                [Lang.Blocks.neo_lite_servo_angle_n150, '-150'],
                                [Lang.Blocks.neo_lite_servo_angle_n160, '-160'],
                                [Lang.Blocks.neo_lite_servo_angle_n170, '-170'],
                                [Lang.Blocks.neo_lite_servo_angle_n180, '-180'],
                                [Lang.Blocks.neo_lite_servo_angle_n190, '-190'],
                                [Lang.Blocks.neo_lite_servo_angle_n200, '-200'],
                                [Lang.Blocks.neo_lite_servo_angle_n210, '-210'],
                                [Lang.Blocks.neo_lite_servo_angle_n220, '-220'],
                                [Lang.Blocks.neo_lite_servo_angle_n230, '-230'],
                                [Lang.Blocks.neo_lite_servo_angle_n240, '-240'],
                                [Lang.Blocks.neo_lite_servo_angle_n250, '-250'],
                                [Lang.Blocks.neo_lite_servo_angle_n260, '-260'],
                                [Lang.Blocks.neo_lite_servo_angle_n270, '-270'],
                                [Lang.Blocks.neo_lite_servo_angle_n280, '-280'],
                                [Lang.Blocks.neo_lite_servo_angle_n290, '-290'],
                                [Lang.Blocks.neo_lite_servo_angle_n300, '-300'],
                                [Lang.Blocks.neo_lite_servo_angle_n310, '-310'],
                                [Lang.Blocks.neo_lite_servo_angle_n320, '-320'],
                                [Lang.Blocks.neo_lite_servo_angle_n330, '-330'],
                                [Lang.Blocks.neo_lite_servo_angle_n340, '-340'],
                                [Lang.Blocks.neo_lite_servo_angle_n350, '-350'],
                                [Lang.Blocks.neo_lite_servo_angle_n360, '-360'],
                            ],
                            value: '90',
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
                        VALUE: 0,
                    },
                    class: 'neo_lite_arg',
                    isNotFor: ['NeoLite'],
                    func: function(sprite, script) {
                        return script.getStringField('VALUE');
                    },
                },
            };
        }

        /*
         Functions for logging
         */
        logD(msg) {
            if (this.isDebug) {
                console.log(msg);
            }
        }

        logPdu(msg) {
            if (this.isDebugPdu) {
                this.logD(msg);
            }
        }

        logSensor(msg) {
            if (this.isDebugSensor) {
                this.logD(msg);
            }
        }

        byteArrayToHex(data) {
            let hexStr = '';
            for (let i = 0; i < data.length; i++) {
                hexStr += this.byteToHexString(data[i]);
                hexStr += ' ';
            }
            return hexStr;
        }

        byteToHexString(byte) {
            return `0${byte.toString(16)}`.slice(-2).toUpperCase();
        }

        getCurrentTime() {
            const date = new Date();
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        }

        makeCommand(blockId, type, params) {
            //const body = [FrameCode.BASIC, PduCode.ACTION_COMMAND, PduType.REQUEST];
            const body = [FrameCode.BASIC, PduCode.BASIC, blockId];
            if (type === NeoBlockType.MOTOR_MOVE) {
                const which = params[0];
                const speed = Math.abs(params[1]);
                const direction = params[1] < 0 ? 1 : 0;
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR);
                const data = Buffer.from([0, 0, 0, 0, 0, 0]);
                data.writeInt16LE(speed, 0);
                data.writeInt16LE(which, 2);
                data.writeInt16LE(direction, 4);
                body.push(...data);
            } else if (type === NeoBlockType.MOTOR_MOVE_BOTH) {
                const speedL = params[0];
                const speedR = params[1];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR_BOTH);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(speedL, 0);
                data.writeInt16LE(speedR, 2);
                body.push(...data);
            } else if (type === NeoBlockType.ROBOT_MOVE) {
                const robotCommand = params[0];
                const speed = params[1];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(speed, 0);
                data.writeInt16LE(robotCommand, 2);
                body.push(...data);
            } else if (
              type === NeoBlockType.MOTOR_STOP ||
              type === NeoBlockType.AUTO_DRIVING_STOP
            ) {
                const which = params[0];
                const direction = 1;
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.MOTOR);
                const data = Buffer.from([0, 0, 0, 0, 0, 0]);
                data.writeInt16LE(which, 2);
                data.writeInt16LE(direction, 4);
                body.push(...data);
            } else if (type === NeoBlockType.ROBOT_STOP) {
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
                const data = Buffer.from([0, 0, 0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_RESET) {
                const output = params[0];
                body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.RESET);
                const data = Buffer.from([0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_ANGLE) {
                const output = params[0];
                const angle = params[1];
                const speed = params[2];
                body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ANGLE);
                const data = Buffer.from([0, 0, 0, 0, 1, 0]);
                data.writeInt16LE(angle, 0);
                data.writeInt16LE(speed, 2);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_ANGLE_WAIT) {
                const output = params[0];
                const angle = params[1];
                const speed = params[2];
                body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ANGLE_WAIT);
                const data = Buffer.from([0, 0, 0, 0, 1, 0]);
                data.writeInt16LE(angle, 0);
                data.writeInt16LE(speed, 2);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_ROTATE) {
                const output = params[0];
                const direction = params[1];
                const speed = params[2];
                body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.ROTATE);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(speed, 0);
                data.writeInt16LE(direction, 2);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_STOP) {
                const output = params[0];
                body.push(this.getUnitId(output), ActorKind.SERVO, ServoCommand.STOP);
            } else if (
              type === NeoBlockType.LINE_TRACER_START ||
              type === NeoBlockType.AUTO_DRIVING_START ||
              type === NeoBlockType.AUTO_DETECT_WALL_START
            ) {
                const speed = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
                const data = Buffer.from([0, 0, 0x10, 0]);
                data.writeInt16LE(speed, 0);
                body.push(...data);
            } else if (type === NeoBlockType.AUTO_DRIVING_SENSOR_START) {
                const sensor = params[0];
                const speed = params[1];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.ROBOT);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(speed, 0);
                data.writeInt16LE(sensor, 2);
                body.push(...data);
            } else if (type === NeoBlockType.LINE_CROSS_MOVE) {
                const count = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.LINE_TRACER);
                const data = Buffer.from([0, 0]);
                data.writeInt16LE(count, 0);
                body.push(...data);
            } else if (type === NeoBlockType.LINE_CROSS_TURN) {
                const direction = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.LINE_TRACER);
                const data = Buffer.from([0, 0]);
                data.writeInt16LE(direction, 0);
                body.push(...data);
            } else if (type === NeoBlockType.AUTO_PARKING_START) {
                // TODO : which 누락
                const which = params[0];
                const direction = params[1];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_PARKING);
                const data = Buffer.from([0, 0]);
                data.writeInt16LE(direction, 0);
                body.push(...data);
            } else if (type === NeoBlockType.LINE_CHANGE_START) {
                const direction = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_DRIVING);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(60, 0);
                data.writeInt16LE(direction, 2);
                body.push(...data);
            } else if (type === NeoBlockType.LINE_CHANGE_TURN) {
                const direction = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.AUTO_DRIVING);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(60, 0);
                data.writeInt16LE(direction, 2);
                body.push(...data);
            } else if (type === NeoBlockType.AUTO_DETECT_WALL_TURN) {
                const direction = params[0];
                body.push(
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.AUTO_DETECT_WALL
                );
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(60, 0);
                data.writeInt16LE(direction, 2);
                body.push(...data);
            } else if (type === NeoBlockType.LED_ON) {
                const output = params[0];
                const brightness = params[1];
                body.push(this.getUnitId(output), ActorKind.LED, 0);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(brightness, 0);
                body.push(...data);
            } else if (type === NeoBlockType.LED_BLINK) {
                const output = params[0];
                const speed = params[1];
                const brightness = params[2];
                body.push(this.getUnitId(output), ActorKind.LED, 0);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(brightness, 0);
                data.writeInt16LE(speed, 2);
                body.push(...data);
            } else if (type === NeoBlockType.LED_OFF) {
                const output = params[0];
                body.push(this.getUnitId(output), ActorKind.LED, 0);
                const data = Buffer.from([0, 0, 0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.COLOR_LED_ON) {
                const output = params[0];
                body.push(this.getUnitId(output), ActorKind.COLOR_LED, LedCommand.ON);
                const data = Buffer.from([0, 0, 0, 0, 0, 0]);
                const color = params[1];
                if (color.length === 7 && color[0] === '#') {
                    const r = color.substr(1, 2);
                    const g = color.substr(3, 2);
                    const b = color.substr(5, 2);
                    data.writeInt16LE(parseInt(r, 16), 0);
                    data.writeInt16LE(parseInt(g, 16), 2);
                    data.writeInt16LE(parseInt(b, 16), 4);
                }
                body.push(...data);
            } else if (type === NeoBlockType.COLOR_LED_OFF) {
                const output = params[0];
                body.push(this.getUnitId(output), ActorKind.COLOR_LED, LedCommand.OFF);
            } else if (type === NeoBlockType.SET_OUTPUT) {
                const output = params[0];
                const value = params[1];
                body.push(this.getUnitId(output), ActorKind.LED, 0);
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(value, 0);
                body.push(...data);
            } else if (type === NeoBlockType.BUZZER_START) {
                const value = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.BUZZER);
                const data = Buffer.from([0, 0]);
                data.writeInt16LE(value, 0);
                body.push(...data);
            } else if (type === NeoBlockType.BUZZER_STOP) {
                const value = params[0];
                body.push(UnitId.CONTROLLER, ActorKind.CONTROLLER, ControllerCommand.BUZZER);
                const data = Buffer.from([0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.LCD_IMAGE) {
                const output = this.getUnitId(params[0]);
                const value = params[1];
                body.push(output, ActorKind.LCD, LcdCommand.IMAGE);
                const data = Buffer.from([value, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.LCD_TEXT) {
                const output = this.getUnitId(params[0]);
                const value = params[1];
                body.push(output, ActorKind.LCD, LcdCommand.TEXT);
                body.push(0); // 글씨크기 : 지금 안됨.
                if (value.length > 0) {
                    for (let idx = 0; idx < value.length; idx++) {
                        body.push(value.charCodeAt(idx));
                    }
                }
            }
            return body;
        }

        makeCommandExt(blockId, type, params) {
            const body = [FrameCode.BASIC];
            if (type === NeoBlockType.MOTOR_MOVE) {
                const which = params[0];
                const unitId = this.getUnitId(params[1]);
                body.push(
                  PduCode.EXTEND_1,
                  blockId,
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.MOTOR
                );
                const data = Buffer.from([unitId, 0, which, 0, 0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.ROBOT_MOVE) {
                const robotCommand = params[0];
                const unitId = this.getUnitId(params[1]);
                body.push(
                  PduCode.EXTEND_1,
                  blockId,
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.ROBOT
                );
                const data = Buffer.from([unitId, 0, 0, 0]);
                data.writeInt16LE(robotCommand, 2);
                body.push(...data);
            } else if (
              type === NeoBlockType.SERVO_ANGLE ||
              type === NeoBlockType.SERVO_ANGLE_WAIT
            ) {
                const unitId = this.getUnitId(params[0]);
                let angle = params[1];
                let speed = params[2];
                if (angle.indexOf('IN') >= 0) angle = this.getUnitId(angle);
                body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.SERVO, ServoCommand.ANGLE);
                const data = Buffer.from([angle, 0, 0, 0, 1, 0]);
                data.writeInt16LE(speed, 2);
                body.push(...data);
            } else if (type === NeoBlockType.SERVO_ROTATE) {
                const unitId = this.getUnitId(params[0]);
                const direction = params[1];
                const inUnitId = this.getUnitId(params[2]);
                body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.SERVO, ServoCommand.ROTATE);
                const data = Buffer.from([inUnitId, 0, 0, 0]);
                data.writeInt16LE(direction, 2);
                body.push(...data);
            } else if (
              type === NeoBlockType.LINE_TRACER_START ||
              type === NeoBlockType.AUTO_DRIVING_START ||
              type === NeoBlockType.AUTO_DETECT_WALL_START
            ) {
                const unitId = this.getUnitId(params[0]);
                body.push(
                  PduCode.EXTEND_1,
                  blockId,
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.ROBOT
                );
                const data = Buffer.from([unitId, 0, 0x10, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.AUTO_DRIVING_SENSOR_START) {
                const sensor = params[0];
                const unitId = this.getUnitId(params[1]);
                body.push(
                  PduCode.EXTEND_1,
                  blockId,
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.ROBOT
                );
                const data = Buffer.from([0, 0, 0, 0]);
                data.writeInt16LE(unitId, 0);
                data.writeInt16LE(sensor, 2);
                body.push(...data);
            } else if (type === NeoBlockType.LED_ON) {
                const unitId = this.getUnitId(params[0]);
                const inUnitId = this.getUnitId(params[1]);
                body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.LED, 0);
                const data = Buffer.from([inUnitId, 0, 0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.SET_OUTPUT) {
                const unitId = this.getUnitId(params[0]);
                const inUnitId = this.getUnitId(params[1]);
                body.push(PduCode.EXTEND_1, blockId, unitId, ActorKind.LED, 0);
                const data = Buffer.from([inUnitId, 0, 0, 0]);
                body.push(...data);
            } else if (type === NeoBlockType.BUZZER_WITH_SENSOR) {
                const sensorUnitId = this.getUnitId(params[0]);
                body.push(
                  PduCode.EXTEND_1,
                  blockId,
                  UnitId.CONTROLLER,
                  ActorKind.CONTROLLER,
                  ControllerCommand.BUZZER
                );
                const data = Buffer.from([0, 0]);
                data.writeInt16LE(sensorUnitId, 0);
                body.push(...data);
            } else if (type === NeoBlockType.COLOR_LED_ON_SENSOR) {
                const outUnitId = this.getUnitId(params[0]);
                const inUnitId = this.getUnitId(params[1]);
                body.push(PduCode.EXTEND_3, blockId, outUnitId, ActorKind.COLOR_LED, LedCommand.ON);
                const data = Buffer.from([inUnitId, 1, inUnitId, 2, inUnitId, 3]);
                body.push(...data);
            }
            return body;
        }

        makeCommandExt2(blockId, type, params) {
            const body = [FrameCode.BASIC];
            if (type === NeoBlockType.SERVO_ANGLE || type === NeoBlockType.SERVO_ANGLE_WAIT) {
                const unitId = this.getUnitId(params[0]);
                const angleInUnitId = this.getUnitId(params[1]);
                const speedInUnitId = this.getUnitId(params[2]);
                body.push(PduCode.EXTEND_2, blockId, unitId, ActorKind.SERVO, ServoCommand.ANGLE);
                const data = Buffer.from([angleInUnitId, 0, speedInUnitId, 0, 1, 0]);
                body.push(...data);
            }
            return body;
        }

        async runAutoParking(script) {
            const type = script.getNumberValue('DIRECTION', script);
            const side = script.getNumberValue('WHICH', script);
            let which = 0;
            if (type === 1) {
                // 후면주차
                this.requestCommand(this.generateBlockId(), NeoBlockType.LINE_TRACER_START, [40]);
                await Entry.Utils.sleep(2400);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                which = side === 1 ? 1 : 2;
                this.requestCommand(this.generateBlockId(), NeoBlockType.MOTOR_MOVE, [which, 30]);
                await Entry.Utils.sleep(2000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_MOVE, [2, 25]);
                await Entry.Utils.sleep(2500);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                which = side === 1 ? 2 : 1;
                this.requestCommand(this.generateBlockId(), NeoBlockType.MOTOR_MOVE, [which, -30]);
                await Entry.Utils.sleep(1300);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_MOVE, [2, 25]);
                await Entry.Utils.sleep(1700);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
            } else {
                // 평행주차
                this.requestCommand(this.generateBlockId(), NeoBlockType.LINE_TRACER_START, [40]);
                await Entry.Utils.sleep(3000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                which = side === 1 ? 1 : 2;
                this.requestCommand(this.generateBlockId(), NeoBlockType.MOTOR_MOVE, [which, 30]);
                await Entry.Utils.sleep(2000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_MOVE, [2, 30]);
                await Entry.Utils.sleep(3000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                which = side === 1 ? 1 : 2;
                this.requestCommand(this.generateBlockId(), NeoBlockType.MOTOR_MOVE, [which, -30]);
                await Entry.Utils.sleep(1000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                which = side === 1 ? 2 : 1;
                this.requestCommand(this.generateBlockId(), NeoBlockType.MOTOR_MOVE, [which, 25]);
                await Entry.Utils.sleep(1000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_MOVE, [2, 20]);
                await Entry.Utils.sleep(1000);
                this.requestCommand(this.generateBlockId(), NeoBlockType.ROBOT_STOP, [0]);
            }
            return script.callReturn();
        }
    })();
})();

module.exports = Entry.NeoLite;
