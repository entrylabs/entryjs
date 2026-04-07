const OPCODE = {
    SINGLE_STEPS: 0xc1,
    SCHEDULED_STEPS: 0xca,
    SCHEDULED_POINTS: 0xcb,
    CONTINUOUS_STEPS: 0xcc,
    AGGREGATE_STEPS: 0xcd,
    LEDMATRIX: 0xa2,
    SERVO: 0xe1,
    MUSIC: 0xe8,
};

const METHOD = {
    CONTINOUS: 0,
    RELATIVE_SINGLE: 1,
    ABSOLUTE_SINGLE: 2,
    SCHED_STEPS: 3,
    sCHED_POINT: 4,
};

const MODE = {
    BASIC: 1,
    MULTIROLE: 2,
    CHECKCRC: 3,
};

const PROPERTY = {
    PERI: 0x01,
    MULTI: 0x02,
    PORT: 0x80,
    ADDRESS: 0x70,
    PAUSE: 1,
    RESUME: 2,
    MUSIC_PLAY: 0,
};

class PingpongConnectLite {
    constructor(connectCount, name) {
        this.cubeCount = connectCount;
        this.name = name;
        this.url = 'http://www.roborisen.com';
        this.title = {
            ko: 'G큐브',
            en: 'G-cube',
        };
        this.communicationType = 'manual';

        this.isplaying = false;
        this.dataReceiveQueue = [];
        this.isProcessing = false;
        this.groupID = 0;
        this.isAllConnected = false;
        this.OPCODE = OPCODE;
        this.METHOD = METHOD;
        this.MODE = MODE;
        this.PROPERTY = PROPERTY;

        this.TILT_THRESHOLD = 20;
        this.MOVE_THRESHOLD = 30;
        // 엔트리Js에서 기기와 통신하는 함수 호출 Duration 간격
        this.duration = 50;
        this.portData = {
            baudRate: 115200,
            duration: 50,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            bufferSize: 65536,
            constantServing: true,
        };

        this.customPrompt = {
            title: '그룹 번호 입력',
            description: '연결할 기기의 그룹 번호를 입력해 주세요.\n 별도로 지정하지 않았다면 00을 입력합니다.',
            defaultValue: '00',
            negativeButtonText: '취소',
            positiveButtonText: '설정',
        };

        this.sensor_data=[];

        for (let i = 0; i < this.cubeCount; i++) {
            this.sensor_data.push({
                MOVE_X: 0,
                MOVE_Y: 0,
                MOVE_Z: 0,
                TILT_X: 0,
                TILT_Y: 0,
                TILT_Z: 0,
                BUTTON: 0,
                PROXIMITY: 0,
                AIN: 0,
            })
        }

        this.monitorTemplate = {
            width: 100,
            height: 100,
            imgPath: `hw_lite/PingpongG${this.cubeCount}Lite.png`,
            listPorts: this.createPortView(this.cubeCount),
            ports: {},
            mode: 'both',
        };

        this.tempo = 60;
        this.readablePorts = [];
        this.setZero();
    }

            //#region init
    async initialHandshake() {
        const self = this;
        const originalDisconnect = Entry.hwLite.disconnect;
        Entry.hwLite.disconnect = function (...params) {

            try {
                if (Entry.hwLite && Entry.hwLite.serial) {
                    self.requestLocalData(self.makePackets('cubeReboot'));
                }
            } catch (e) {
                console.warn('PingpongConnect:disconnect 전송 중 오류:', e);
            } finally {
                setTimeout(() => {
                    console.log('PingpongConnect:disconnect 실행, 연결 상태 초기화');
                    self.isAllConnected = false;
                    Entry.hwLite.disconnect = originalDisconnect;
                    return originalDisconnect.apply(this, params);
                }, 1000);
            }

        };
        // 그룹 번호 값 가져오기
        const payload = Entry.hwLite.getCustomPromptPayload();
        // 입력값 검증 (10진수 2자리)
        if (!/^\d{2}$/.test(payload)) {
            Entry.hwLite.serial.disconnect();
            window.alert('Wrong group id inputted:', payload);
            return null;
        }

        this.groupID = parseInt(payload, 16);
        this.requestLocalData(this.makePackets('connect'));

        return true;
    }

    makePackets(method) {
        const isGroup = this.groupID == 0 ? 0x0a : 0x1a;
        const packetMap = {
            connect1:      [0xff,0xff,0x00,0x07,0x00,0x00,0xce,0x00,0x0e,0x02,0x00,0x00,0x07,0x50],
            connect2:      [0xff,0xff,0xff,0xaa,0x20,0x00,0xad,0x00,0x0b,isGroup,0x00],
            connect3:      [0xff,0xff,0xff,0xaa,0x30,0x00,0xad,0x00,0x0b,isGroup,0x00],
            connect4:      [0xff,0xff,0xff,0xaa,0x40,0x00,0xad,0x00,0x0b,isGroup,0x00],
            cubeReboot:    [0xff,0xff,0xff,0xff,0x00,0x00,0xa8,0x00,0x0a,0x01],
            getSensorData: [0xff,0xff,0xff,0xff,0x00,0xc8,0xb8,0x00,0x0b,0x10,0x01],

            connect:       [0xdd,0xdd,this.groupID,0x00,0x00,0x00,0xda,0x00,0x0b,0x00,0x00],
            checkDongle:   [0xdd,0xdd,0xdd,0xdd,0x00,0x01,0xda,0x00,0x0b,0x00,0x0d],
            clearDongle:   [0xdd,0xdd,0xdd,0xdd,0x00,0x01,0xda,0x00,0x0b,0x00,0xcd],
        };

        return packetMap[method]
    }

    makePacket(opcode, taskid, cubeNo, opt) {
        const property = Buffer.from(opt);
        const header = Buffer.alloc(9, 0xff);

        if (cubeNo <= -1) {
            header[3] = 0xff;
        } else {
            header[3] = cubeNo;
        }

        header[4] = (taskid >> 8) & 0xff;
        header[5] = taskid & 0xff;
        header[6] = opcode;

        const size = header.length + property.length;
        header[7] = (size >> 8) & 0xff;
        header[8] = size & 0xff;

        return Buffer.concat([header, property]);
    }


    async postCallReturn(script, myfunc) {
        if (myfunc == undefined) {
            return script.callReturn();
        }

        if (script.is_start == undefined) {
            script.is_start = true;

            const [packet, waitTime = this.delayTime] = myfunc();

            if (packet && packet.length > 0) {
                this.requestLocalData(packet)
                this.isplaying = true;
            }

            await new Promise(resolve => setTimeout(resolve, waitTime));  // waitTime 동안 대기

            script.is_start = false;

            return script.callReturn();
        } else if (script.is_start == true) {
            return script;
        } else {
            delete script.is_start;

            return script.callReturn();
        }
    }

    // 연결시 기기 초기화
    async setZero() {
        if (Entry.hwLite && Entry.hwLite.serial) {
            Entry.hwLite.serial.update();
        }

        // 기기 정지
        if(this.isplaying){
            const arr = this.makeContStepPacket(-1, 0);
            const packet = Buffer.from(arr);
            this.requestLocalData(packet);
            await new Promise(resolve => setTimeout(resolve, 50));  // 50ms 대기
        }
        this.isplaying = false
    }

    // 하드웨어에서 온 데이터 처리
    //#region Rx
    handleLocalData(data) {
        if (!data || data.length === 0) {
            return;
        }

        this.dataReceiveQueue.push(...data);
        this.startQueueProcessing();
    }

    async startQueueProcessing() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            while (this.dataReceiveQueue.length >= 9) {
                const dataPacketSize = (this.dataReceiveQueue[7] << 8) | this.dataReceiveQueue[8];
                if (dataPacketSize === 0) {
                    console.error('패킷 길이 0 → 20바이트 버림',Buffer.from(this.dataReceiveQueue.slice(0, 20)).toString('hex').match(/.{1,2}/g).join(' '));
                    const removalLength = Math.min(20, this.dataReceiveQueue.length);
                    this.dataReceiveQueue.splice(0, removalLength);
                    continue;
                }
                if (this.dataReceiveQueue.length < dataPacketSize) break;
                const dataPacket = this.dataReceiveQueue.splice(0, dataPacketSize);
                await this.processData(dataPacket);
            }
        } catch (e) {
            console.error('데이터 처리 오류:', e);
        }
        this.isProcessing = false;
    }

    async processData(data) {
        if (!data) return
        const bufferData = Buffer.from(data);
        const opcode = bufferData[6];
        console.log(`Rx[${opcode.toString(16).padStart(2, '0')}]: ${Buffer.from(bufferData).toString('hex').match(/.{1,2}/g).join(' ')} /${bufferData.length} = ${(bufferData[7] << 8) | bufferData[8]}`);

        //센서데이터 처리
        if (opcode === 0xb8 && bufferData.length == 20) {
            const cubeid = this.cubeCount > 1 ? bufferData[3] : 0;
            const sensor = this.sensor_data[cubeid];

            sensor.MOVE_X = this.hexToSignedDecimal(bufferData[12]);
            sensor.MOVE_Y = this.hexToSignedDecimal(bufferData[13]);
            sensor.MOVE_Z = this.hexToSignedDecimal(bufferData[14]);

            const xx = this.hexToSignedDecimal(bufferData[15]);
            const yy = this.hexToSignedDecimal(bufferData[16]);
            const zz = this.hexToSignedDecimal(bufferData[17]);

            if(sensor.TILT_X != xx || sensor.TILT_Y != yy || sensor.TILT_Z != zz){
                Entry.engine.fireEvent('pp_when_tilted');
            }

            sensor.TILT_X = xx;
            sensor.TILT_Y = yy;
            sensor.TILT_Z = zz;
            if(sensor.BUTTON != bufferData[11]){
                Entry.engine.fireEvent('pp_when_button_pressed');
            }
            sensor.BUTTON = bufferData[11];
            sensor.PROXIMITY = bufferData[18];
            sensor.AIN = bufferData[19];
        }

        //동글 응답
        if (opcode === 0xda) {
            switch (data[9]) {
                case 0xc0:
                    Entry.toast.alert(Lang.template.pingpong_lite_cube_connection_lost,Lang.template.pingpong_lite_cube_reconnect_notice,false);
                    this.requestLocalData(this.makePackets(`connect`));
                    break;
                case 0xc1:
                    Entry.toast.success(Lang.template.pingpong_lite_cube_connection_first,Lang.template.pingpong_lite_cube_first_connected,false);
                    setTimeout(() => {
                        this.requestLocalData(this.makePackets(`connect${this.cubeCount}`));
                    }, 1000);
                    break;
            }
        }

        //큐브1개 연결된 경우
        if (opcode === 0xce) {
            Entry.toast.success(Lang.template.pingpong_lite_cube_connection_success,Lang.template.pingpong_lite_cube_all_connected,false);
            setTimeout(() => {
                this.requestLocalData(this.makePackets('getSensorData'));
            }, 3000);
        }

        //큐브 여러개 연결된 경우, 마지막 큐브가 연결됐다는 응답이 왔을 때 센서데이터 요청
        if (opcode === 0xad) {
            if (bufferData[9]==this.cubeCount-1) {
                Entry.toast.success(Lang.template.pingpong_lite_cube_connection_success,Lang.template.pingpong_lite_cube_all_connected,false);
                setTimeout(() => {this.requestLocalData(this.makePackets('getSensorData'));}, 3000);
                this.isAllConnected = true;
            } else if (this.isAllConnected) {
                this.isAllConnected = false;
                this.requestLocalData(this.makePackets('cubeReboot'));
            }
        }
    }


    // 하드웨어 기기에 전달할 데이터
    //#region Tx
    requestLocalData(data) {
        if (!data) return
        const bufferData = Buffer.from(data);
        const opcode = data[6];
        console.log(`Tx[${opcode.toString(16).padStart(2, '0')}]: ${bufferData.toString('hex').match(/.{1,2}/g).join(' ')} /${bufferData.length}`);
        Entry.hwLite.serial.sendAsciiAsBuffer(bufferData);
        return;
    }

    //#region functions
    getMonitorPort() {
        const result = {};

        this.sensor_data.forEach((item, i) => {
            Object.keys(item).forEach((key) => {
                result[`${key}${i}`] = item[key];
            });
        });

        return result;
    }

    createPortView(count) {
        const result = {};
        const inputMapping = [
            'BUTTON',
            'MOVE_X',
            'MOVE_Y',
            'MOVE_Z',
            'TILT_X',
            'TILT_Y',
            'TILT_Z',
            'PROXIMITY',
            'AIN',
        ];

        inputMapping.forEach((k) => {
            for (let i = 0; i < count; i++) {
                result[`${k}${i}`] = {
                    name: `${i + 1}: ${k}`,
                    type: 'input',
                    pos: {x:0, y:0,},
                };
            }
        });
        return result;
    }


    makeContStepPacket(cubeNo, speed) {
        const packet = new Uint8Array(9 + 6);

        this._fillPacketIntoArray(packet, this.OPCODE.CONTINUOUS_STEPS, 0, cubeNo, 15);

        const sps = this._calcSpsFromSpeed(speed);

        packet[9] = this.MODE.MULTIROLE;
        packet[10] = this.METHOD.CONTINOUS;
        packet[11] = 0; //step_type; full=0, servo=4

        if (sps == 0) {
            packet[12] = this.PROPERTY.PAUSE;
            packet[13] = 0;
            packet[14] = 0;
        } else {
            packet[12] = this.PROPERTY.RESUME;
            packet[13] = sps / 256;
            packet[14] = sps % 256;
        }

        return packet;
    }

    _fillPacketIntoArray(data, opcode, taskid, cubeNo, size) {
        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;

        if (cubeNo <= -1) {
            data[3] = 0xff;
        } else {
            data[3] = cubeNo;
        }

        data[4] = taskid / 256;
        data[5] = taskid % 256;

        data[6] = opcode;

        data[7] = size / 256;
        data[8] = size % 256;
    }


    _calcSpsFromSpeed(speed_) {
        let speed = speed_;
        if (speed > 100) {
            speed = 100;
        }
        if (speed < -100) {
            speed = -100;
        }

        let sps = 0;
        if (speed != 0) {
            if (speed < 0) {
                sps = 65536 + (speed * 9 - 100);
            } else {
                sps = speed * 9 + 100;
            }
            sps = Math.round(sps);
        }
        return sps;
    }

    makeMusicNotePacket(cubeNo, note, duration) {
        const packet = new Uint8Array(9 + 5);
        this._fillPacketIntoArray(packet, this.OPCODE.MUSIC, 0xa1, cubeNo, 9 + 5);

        packet[9] = 0;
        packet[10] = this.PROPERTY.MUSIC_PLAY;
        packet[11] = note - 8;
        packet[12] = duration;
        packet[13] = 0;

        return packet;
    }

    _clampBeats(beats) {
        return Math.min(Math.max(beats, 0), 40);
    }

    _clampTempo(tempo) {
        return Math.min(Math.max(tempo, 20), 500);
    }

    _beatsToDuration(beats) {
        let duration = Math.round((60 / this.tempo) * beats * 100);
        return duration;
    }

    _getCubeNoFromBlock(script) {
        let cubeNo = script.getNumberValue('cubeno') - 1;
        if (cubeNo < 0) {
            cubeNo = 0;
        }
        if (cubeNo >= this.cubeCount) {
            cubeNo = this.cubeCount - 1;
        }
        return cubeNo;
    }

    _getTiltValue(cubeNo=0, tiltDir) {
        const pd = this.sensor_data;
        let tiltValue = 0;
        if (tiltDir == 'F_CIRCLE') {
            tiltValue = pd[cubeNo].TILT_X * -1;
        } else if (tiltDir == 'B_TRIANGLE') {
            tiltValue = pd[cubeNo].TILT_X;
        } else if (tiltDir == 'L_RECTANGLE') {
            tiltValue = pd[cubeNo].TILT_Y;
        } else if (tiltDir == 'R_STAR') {
            tiltValue = pd[cubeNo].TILT_Y * -1;
        }
        return tiltValue;
    }

    _isUpperDir(cubeNo, tiltDir) {
        const pd = this.sensor_data;
        const sensorValue = pd[cubeNo];
        const thresholdValue = 70;

        switch (tiltDir) {
            case 'DF_RECTANGLE':
                return -sensorValue.TILT_Y > thresholdValue;
            case 'DB_STAR':
                return sensorValue.TILT_Y > thresholdValue;
            case 'DR_CIRCLE':
                return sensorValue.TILT_X > thresholdValue;
            case 'DL_TRIANGLE':
                return -sensorValue.TILT_X > thresholdValue;
            case 'DD_NONE':
                return sensorValue.TILT_Z > thresholdValue;
            case 'DU_HEART':
                return -sensorValue.TILT_Z > thresholdValue;
            default:
                return false;
        }
    }

    makeSingleStepPacket(cubeNo, speed, degree) {
        const packet = new Uint8Array(9 + 10);

        this._fillPacketIntoArray(packet, this.OPCODE.SINGLE_STEPS, 0 /*cubeCount*/, cubeNo, 19);

        const sps = this._calcSpsFromSpeed(speed);
        let step = Math.round(Math.min(Math.max(degree, 0), 5000) * 5.5);
        if (step > 32768) {
            step = 32768;
        }

        packet[9] = this.MODE.MULTIROLE;
        packet[10] = this.METHOD.RELATIVE_SINGLE;
        packet[11] = 0; //step_type; full=0, servo=4
        packet[12] = this.PROPERTY.RESUME;

        packet[13] = sps / 256;
        packet[14] = sps % 256;
        packet[15] = 0;
        packet[16] = 0;
        packet[17] = step / 256;
        packet[18] = step % 256;

        const waitTime = Math.round(((1000 - Math.abs(speed) * 9) / 99) * step) + 400;

        return [packet, waitTime];
    }

    makeAggregatePacket(opcode, taskid, packets, opt = []) {
        let size = 9 + opt.length;
        let options = opt;
        let usedCubeIds = [];

        packets.forEach((n) => {
            size += n.length;
            Array.prototype.push.apply(options, n);
            usedCubeIds.push(n[3]);
        });

        // aggregate command must have cubeCount commands. add dummy packet
        if (packets.length < this.cubeCount) {
            for (let i = 0; i < this.cubeCount; i++) {
                if (usedCubeIds.includes(i) == false) {
                    let dummyPacket = packets[0].slice();
                    dummyPacket[3] = i;
                    dummyPacket[6] = 0; // set opcode to zero
                    Array.prototype.push.apply(options, dummyPacket);
                }
            }
        }

        const cmd = this.makePacket(opcode, (packets.length << 12) | taskid, 0xaa, options);
        return cmd;
    }

    hexToSignedDecimal(hex) {
        if (hex >= 0x80) {return hex - 256;}
        return hex;
    }

    //#region setLanguage
    setLanguage(){
        const lang = {
            ko: {
                template: {
                    pingpong_lite_cube_connection_first: "큐브 연결 준비됨",
                    pingpong_lite_cube_first_connected: "첫 번째 큐브가 연결되었습니다",
                    pingpong_lite_cube_connection_lost: "연결 끊어짐",
                    pingpong_lite_cube_reconnect_notice: "큐브의 연결이 끊어졌습니다.\n연결을 재시도합니다",
                    pingpong_lite_cube_connection_success: "연결 완료",
                    pingpong_lite_cube_all_connected: "모든 큐브가 연결되었습니다",
                    ...(this.cubeCount === 1 ?{
                        pingpong_lite_g1_when_button_pressed: '%1 큐브 버튼을 눌렀을 때',
                        pingpong_lite_g1_when_tilted: '%1 큐브를 %2 방향으로 기울였을 때',
                        pingpong_lite_g1_is_button_pressed: '큐브 버튼이 눌렸는가?',
                        pingpong_lite_g1_is_tilted: '큐브가 %1 방향으로 기울어졌는가?',
                        pingpong_lite_g1_get_tilt_value: '%1 방향 큐브 기울기',
                        pingpong_lite_g1_get_sensor_value: '%1 센서값',
                        pingpong_lite_g1_motor_rotate: '모터를 %1 방향으로 %2 도 회전하기 %3',
                        pingpong_lite_g1_start_motor_rotate: '모터의 속도를 %1으로 계속 회전하기 %2',
                        pingpong_lite_g1_stop_motor_rotate: '모터 멈추기 %1',
                        pingpong_lite_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
                        pingpong_lite_g1_rotate_servo_mortor: '서보모터를 %1도로 설정하기 %2',
                        pingpong_lite_g1_set_dot_pixel: '도트 X:%1 Y:%2 %3 %4',
                        pingpong_lite_g1_set_dot_string: '도트에 문자열 %1  %2초동안 출력 %3',
                        pingpong_lite_g1_set_dot_clear: '도트 화면 지우기 %1',
                        pingpong_lite_g1_playNoteForBeats: '%1 음을 %2 박자로 연주하기 %3',
                        pingpong_lite_art_set_steering_direction: '조향 바퀴를 %1 방향으로 설정',
                        pingpong_lite_art_move_by_distance: '%1으로%2cm 이동하기',
                        pingpong_lite_g1_restForBeats: '%1 박자 쉬기 %2',
                        pingpong_lite_g1_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
                        pingpong_lite_g1_getTempo: '악보 빠르기',
                    }:{
                        [`pingpong_lite_g${this.cubeCount}_when_button_pressed`]: '%1 %2 큐브 버튼을 눌렀을 때',
                        [`pingpong_lite_g${this.cubeCount}_when_tilted`]: '%1 %2 큐브를 %3로 기울였을 때',
                        [`pingpong_lite_g${this.cubeCount}_is_button_pressed`]: '%1 큐브 버튼이 눌렸는가?',
                        [`pingpong_lite_g${this.cubeCount}_is_tilted`]: '%1 큐브가 %2로 기울어졌는가?',
                        [`pingpong_lite_g${this.cubeCount}_get_tilt_value`]: '%1 큐브의 %2 방향 기울기',
                        [`pingpong_lite_g${this.cubeCount}_get_sensor_value`]: '%1 큐브의 %2 센서값',
                        [`pingpong_lite_g${this.cubeCount}_motor_rotate`]: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                        [`pingpong_lite_g${this.cubeCount}_start_motor_rotate`]: '%1 모터의 속도를 %2으로 계속 회전하기 %3',
                        [`pingpong_lite_g${this.cubeCount}_stop_motor_rotate`]: '%1 모터 멈추기 %2',
                        [`pingpong_lite_g${this.cubeCount}_is_top_shape`]: '%1 큐브의 윗면에 %2 모양이 있는가?',
                        [`pingpong_lite_g${this.cubeCount}_rotate_servo_mortor`]: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_pixel`]: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_string`]: '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_clear`]: '%1 번째 큐브의 화면 지우기 %2',
                        [`pingpong_lite_g${this.cubeCount}_playNoteForBeats`]: '%1 큐브의 %2 음을 %3 박자로 연주하기 %4',
                        [`pingpong_lite_g${this.cubeCount}_restForBeats`]: '%1 박자 쉬기 %2',
                        [`pingpong_lite_g${this.cubeCount}_setTempo`]: '악보 빠르기를 %1 으로 정하기 %2',
                        [`pingpong_lite_g${this.cubeCount}_getTempo`]: '악보 빠르기',
                        ...(() => {
                            switch (this.cubeCount) {
                                case 2: return {
                                        pingpong_lite_g2_multi_motor_rotate: '모터1: %1 방향 %2 도, 모터2: %3 방향 %4 도 회전하기 %5',
                                        pingpong_lite_g2_multi_start_motor_rotate: '모터1 속도를 %1, 모터2 속도를 %2으로 계속 회전하기 %3',
                                        pingpong_lite_g2_multi_playChordForBeats: '큐브1: %1, 큐브2: %2, %3박자로 연주하기 %4',
                                    };
                                case 3: return {
                                        pingpong_lite_g3_multi_motor_rotate: '모터1: %1 방향 %2 도, 모터2: %3 방향 %4 도, 모터3: %5방향 %6도 회전하기 %7',
                                        pingpong_lite_g3_multi_start_motor_rotate: '모터1 속도를 %1, 모터2 속도를 %2, 모터3 속도를 %3으로 계속 회전하기 %4',
                                        pingpong_lite_g3_multi_playChordForBeats: '큐브1: %1, 큐브2: %2, 큐브3: %3, %4박자로 연주하기 %5',
                                    };
                                case 4: return {
                                        pingpong_lite_g4_multi_motor_rotate: '모터1: %1 방향 %2 도, 모터2: %3 방향 %4 도, 모터3: %5방향 %6도, 모터4: %7 방향 %8 도 회전하기 %9',
                                        pingpong_lite_g4_multi_start_motor_rotate: '모터1 속도를 %1, 모터2 속도를 %2, 모터3 속도를 %3, 모터4 속도를 %4으로 계속 회전하기 %5',
                                        pingpong_lite_g4_multi_playChordForBeats: '큐브1: %1, 큐브2: %2, 큐브3: %3, 큐브4: %4, %5박자로 연주하기 %6',
                                    };
                                default: return {};
                            }
                        })(),
                    }),
                },

                Blocks: {
                    pingpong_right: '오른쪽',
                    pingpong_left: '왼쪽',

                    pingpong_direction :[
                        ['앞쪽','front'],
                        ['뒤쪽','back']
                    ],

                    pingpong_rotate_cw: '시계',
                    pingpong_rotate_ccw: '반시계',

                    pingpong_sensor_proximity: '근접',
                    pingpong_sensor_ain: '아날로그',

                    pingpong_dot_on: '켜기',
                    pingpong_dot_off: '끄기',


                    pingpong_opts_cube_tiltDir: [
                        ['동그라미', 'F_CIRCLE'],
                        ['세모', 'B_TRIANGLE'],
                        ['네모', 'L_RECTANGLE'],
                        ['별', 'R_STAR'],
                    ],

                    pingpong_opts_cube_dir6: [
                        ['네모', 'DF_RECTANGLE'],
                        ['별', 'DB_STAR'],
                        ['세모', 'DL_TRIANGLE'],
                        ['동그라미', 'DR_CIRCLE'],
                        ['하트', 'DU_HEART'],
                        ['빈칸', 'DD_NONE'],
                    ],

                    pingpong_opts_music_notes: [
                        ['라  (A3)', 45],
                        ['라# (A3#)', 46],
                        ['시  (B3)', 47],
                        ['도  (C4)', 48],
                        ['도# (C4#)', 49],
                        ['레  (D4)', 50],
                        ['레# (D4#)', 51],
                        ['미  (E4)', 52],
                        ['파  (F4)', 53],
                        ['파# (F4#)', 54],
                        ['솔  (G4)', 55],
                        ['솔# (G4#)', 56],
                        ['라  (A4)', 57],
                        ['라# (A4#)', 58],
                        ['시  (B4)', 59],
                        ['도  (C5)', 60],
                        ['도# (C5#)', 61],
                        ['레  (D5)', 62],
                        ['레# (D5#)', 63],
                        ['미  (E5)', 64],
                        ['파  (F5)', 65],
                        ['파# (F5#)', 66],
                        ['솔  (G5)', 67],
                        ['솔# (G5#)', 68],
                        ['라  (A5)', 69],
                        ['라# (A5#)', 70],
                        ['시  (B5)', 71],
                        ['도  (C6)', 72],
                    ],

                    pingpong_opts_mono :[
                        ['왼쪽 45°'   ,45],
                        ['왼쪽 40°'   ,50],
                        ['왼쪽 35°'   ,55],
                        ['왼쪽 30°'   ,60],
                        ['왼쪽 25°'   ,65],
                        ['왼쪽 20°'   ,70],
                        ['왼쪽 15°'   ,75],
                        ['왼쪽 10°'   ,80],
                        ['왼쪽 5°'    ,85],
                        ['정면'     ,90],
                        ['오른쪽 5°'  ,95],
                        ['오른쪽 10°' ,100],
                        ['오른쪽 15°' ,105],
                        ['오른쪽 20°' ,110],
                        ['오른쪽 25°' ,115],
                        ['오른쪽 30°' ,120],
                        ['오른쪽 35°' ,125],
                        ['오른쪽 40°' ,130],
                        ['오른쪽 45°' ,135],
                    ],

                    pingpong_lite_g2_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                    ],
                    pingpong_lite_g2_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['모든', -1],
                    ],

                    pingpong_lite_g3_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                    ],
                    pingpong_lite_g3_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['모든', -1],
                    ],

                    pingpong_lite_g4_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['4번', 3],
                    ],
                    pingpong_lite_g4_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['4번', 3],
                        ['모든', -1],
                    ],
                },
            },
            en: {
                template: {
                    pingpong_lite_cube_connection_first: "Cube connection ready",
                    pingpong_lite_cube_first_connected: "First cube connected",
                    pingpong_lite_cube_connection_lost: "Connection lost",
                    pingpong_lite_cube_reconnect_notice: "Cube connection lost.\nRetrying connection",
                    pingpong_lite_cube_connection_success: "Connection successful",
                    pingpong_lite_cube_all_connected: "All cubes connected",

                    ...(this.cubeCount === 1 ? {
                        pingpong_lite_g1_when_button_pressed: 'When %1 cube button is pressed',
                        pingpong_lite_g1_when_tilted: 'When %1 cube is tilted to %2',
                        pingpong_lite_g1_is_button_pressed: 'Is the cube button pressed?',
                        pingpong_lite_g1_is_tilted: 'Is the cube tilted to %1?',
                        pingpong_lite_g1_get_tilt_value: 'Cube tilt value (%1)',
                        pingpong_lite_g1_get_sensor_value: '%1 sensor value',
                        pingpong_lite_g1_motor_rotate: 'Rotate motor %2 degrees to %1 direction %3',
                        pingpong_lite_g1_start_motor_rotate: 'Rotate motor continuously at speed %1 %2',
                        pingpong_lite_g1_stop_motor_rotate: 'Stop motor %1',
                        pingpong_lite_g1_is_top_shape: 'Is there a %1 shape on top of the cube?',
                        pingpong_lite_g1_rotate_servo_mortor: 'Set servo motor to %1 degrees %2',
                        pingpong_lite_g1_set_dot_pixel: 'Dot X:%1 Y:%2 %3 %4',
                        pingpong_lite_g1_set_dot_string: 'Display "%1" on dot for %2 seconds %3',
                        pingpong_lite_g1_set_dot_clear: 'Clear dot display %1',
                        pingpong_lite_g1_playNoteForBeats: 'Play note %1 for %2 beats %3',
                        pingpong_lite_art_set_steering_direction: 'Set steering wheel to %1 direction',
                        pingpong_lite_art_move_by_distance: 'Move %2 cm to %1',
                        pingpong_lite_g1_restForBeats: 'Rest for %1 beats %2',
                        pingpong_lite_g1_setTempo: 'Set tempo to %1 %2',
                        pingpong_lite_g1_getTempo: 'Tempo',
                    } : {
                        [`pingpong_lite_g${this.cubeCount}_when_button_pressed`]: 'When %1 %2 cube button is pressed',
                        [`pingpong_lite_g${this.cubeCount}_when_tilted`]: 'When %1 %2 cube is tilted to %3',
                        [`pingpong_lite_g${this.cubeCount}_is_button_pressed`]: 'Is %1 cube button pressed?',
                        [`pingpong_lite_g${this.cubeCount}_is_tilted`]: 'Is %1 cube tilted to %2?',
                        [`pingpong_lite_g${this.cubeCount}_get_tilt_value`]: '%1 cube tilt value (%2)',
                        [`pingpong_lite_g${this.cubeCount}_get_sensor_value`]: '%1 cube %2 sensor value',
                        [`pingpong_lite_g${this.cubeCount}_motor_rotate`]: 'Rotate %1 motor %3 degrees to %2 direction %4',
                        [`pingpong_lite_g${this.cubeCount}_start_motor_rotate`]: 'Rotate %1 motor continuously at speed %2 %3',
                        [`pingpong_lite_g${this.cubeCount}_stop_motor_rotate`]: 'Stop %1 motor %2',
                        [`pingpong_lite_g${this.cubeCount}_is_top_shape`]: 'Is there a %2 shape on top of %1 cube?',
                        [`pingpong_lite_g${this.cubeCount}_rotate_servo_mortor`]: 'Set servo motor of cube %1 to %2 degrees %3',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_pixel`]: 'Cube %1 dot X:%2 Y:%3 %4 %5',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_string`]: 'Display "%2" on cube %1 for %3 seconds %4',
                        [`pingpong_lite_g${this.cubeCount}_set_dot_clear`]: 'Clear display of cube %1 %2',
                        [`pingpong_lite_g${this.cubeCount}_playNoteForBeats`]: 'Play note %2 on cube %1 for %3 beats %4',
                        [`pingpong_lite_g${this.cubeCount}_restForBeats`]: 'Rest for %1 beats %2',
                        [`pingpong_lite_g${this.cubeCount}_setTempo`]: 'Set tempo to %1 %2',
                        [`pingpong_lite_g${this.cubeCount}_getTempo`]: 'Tempo',

                        ...(() => {
                            switch (this.cubeCount) {
                                case 2: return {
                                    pingpong_lite_g2_multi_motor_rotate: 'Motor1: rotate %2 degrees %1, Motor2: rotate %4 degrees %3 %5',
                                    pingpong_lite_g2_multi_start_motor_rotate: 'Motor1 speed %1, Motor2 speed %2 continuous rotation %3',
                                    pingpong_lite_g2_multi_playChordForBeats: 'Cube1: %1, Cube2: %2, play for %3 beats %4',
                                };
                                case 3: return {
                                    pingpong_lite_g3_multi_motor_rotate: 'Motor1: rotate %2 degrees %1, Motor2: rotate %4 degrees %3, Motor3: rotate %6 degrees %5 %7',
                                    pingpong_lite_g3_multi_start_motor_rotate: 'Motor1 speed %1, Motor2 speed %2, Motor3 speed %3 continuous rotation %4',
                                    pingpong_lite_g3_multi_playChordForBeats: 'Cube1: %1, Cube2: %2, Cube3: %3, play for %4 beats %5',
                                };
                                case 4: return {
                                    pingpong_lite_g4_multi_motor_rotate: 'Motor1: rotate %2 degrees %1, Motor2: rotate %4 degrees %3, Motor3: rotate %6 degrees %5, Motor4: rotate %8 degrees %7 %9',
                                    pingpong_lite_g4_multi_start_motor_rotate: 'Motor1 speed %1, Motor2 speed %2, Motor3 speed %3, Motor4 speed %4 continuous rotation %5',
                                    pingpong_lite_g4_multi_playChordForBeats: 'Cube1: %1, Cube2: %2, Cube3: %3, Cube4: %4, play for %5 beats %6',
                                };
                                default: return {};
                            }
                        })(),
                    }),
                },

                Blocks: {
                    pingpong_right: 'Right',
                    pingpong_left: 'Left',

                    pingpong_direction: [
                        ['Forward', 'front'],
                        ['Backward', 'back']
                    ],

                    pingpong_rotate_cw: 'Clockwise',
                    pingpong_rotate_ccw: 'Counterclockwise',

                    pingpong_sensor_proximity: 'Proximity',
                    pingpong_sensor_ain: 'Analog',

                    pingpong_dot_on: 'On',
                    pingpong_dot_off: 'Off',

                    pingpong_opts_cube_tiltDir: [
                        ['Circle', 'F_CIRCLE'],
                        ['Triangle', 'B_TRIANGLE'],
                        ['Square', 'L_RECTANGLE'],
                        ['Star', 'R_STAR'],
                    ],

                    pingpong_opts_cube_dir6: [
                        ['Square', 'DF_RECTANGLE'],
                        ['Star', 'DB_STAR'],
                        ['Triangle', 'DL_TRIANGLE'],
                        ['Circle', 'DR_CIRCLE'],
                        ['Heart', 'DU_HEART'],
                        ['None', 'DD_NONE'],
                    ],

                    pingpong_opts_music_notes: [
                        ['A (A3)', 45],
                        ['A# (A3#)', 46],
                        ['B (B3)', 47],
                        ['C (C4)', 48],
                        ['C# (C4#)', 49],
                        ['D (D4)', 50],
                        ['D# (D4#)', 51],
                        ['E (E4)', 52],
                        ['F (F4)', 53],
                        ['F# (F4#)', 54],
                        ['G (G4)', 55],
                        ['G# (G4#)', 56],
                        ['A (A4)', 57],
                        ['A# (A4#)', 58],
                        ['B (B4)', 59],
                        ['C (C5)', 60],
                        ['C# (C5#)', 61],
                        ['D (D5)', 62],
                        ['D# (D5#)', 63],
                        ['E (E5)', 64],
                        ['F (F5)', 65],
                        ['F# (F5#)', 66],
                        ['G (G5)', 67],
                        ['G# (G5#)', 68],
                        ['A (A5)', 69],
                        ['A# (A5#)', 70],
                        ['B (B5)', 71],
                        ['C (C6)', 72],
                    ],

                    pingpong_opts_mono: [
                        ['Left 45°', 45],
                        ['Left 40°', 50],
                        ['Left 35°', 55],
                        ['Left 30°', 60],
                        ['Left 25°', 65],
                        ['Left 20°', 70],
                        ['Left 15°', 75],
                        ['Left 10°', 80],
                        ['Left 5°', 85],
                        ['Center', 90],
                        ['Right 5°', 95],
                        ['Right 10°', 100],
                        ['Right 15°', 105],
                        ['Right 20°', 110],
                        ['Right 25°', 115],
                        ['Right 30°', 120],
                        ['Right 35°', 125],
                        ['Right 40°', 130],
                        ['Right 45°', 135],
                    ],
                },
            }
        };
        console.log(this.name,'lang',lang);
        return lang;
    }

    //#region getBlocks
    getBlocks() {
        const self = this;
        const blocks = {
            [`pingpong_lite_g${self.cubeCount}_when_button_pressed`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_hardware.svg',
                        size: 14,
                        position: { x: 0, y: -2 },
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: `pingpong_lite_g${self.cubeCount}_when_button_pressed`,
                },
                paramsKeyMap: {
                    CUBEID: 1,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = self.sensor_data;

                    return (pd[cubeId]?.BUTTON == 1)
                        ? script.callReturn()
                        : this.die();
                },
            },
            [`pingpong_lite_g${self.cubeCount}_when_tilted`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_hardware.svg',
                        size: 14,
                        position: { x: 0, y: -2 },
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: `pingpong_lite_g${self.cubeCount}_when_tilted`,
                },
                paramsKeyMap: {
                    CUBEID: 1,
                    TILT_DIR: 2,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = self._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= self.TILT_THRESHOLD) {
                        return script.callReturn();
                    }

                    return this.die();
                },
            },
            [`pingpong_lite_g${self.cubeCount}_is_button_pressed`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: {
                    params: [null],
                    type: `pingpong_lite_g${self.cubeCount}_is_button_pressed`,
                },
                paramsKeyMap: {
                    CUBEID: 0,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    return self.sensor_data[cubeId].BUTTON == 1;
                },
            },
            [`pingpong_lite_g${self.cubeCount}_is_tilted`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_is_tilted` },
                paramsKeyMap: {
                    CUBEID: 0,
                    TILT_DIR: 1,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = self._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= self.TILT_THRESHOLD;
                },
            },
            [`pingpong_lite_g${self.cubeCount}_get_tilt_value`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: `pingpong_lite_g${self.cubeCount}_get_tilt_value`,
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return self._getTiltValue(cubeId, tiltDir);
                },
            },
            [`pingpong_lite_g${self.cubeCount}_get_sensor_value`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_sensor_proximity, 'PROXIMITY'],
                            [Lang.Blocks.pingpong_sensor_ain, 'AIN'],
                        ],
                        value: 'PROXIMITY',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_get_sensor_value` },
                paramsKeyMap: { CUBEID: 0, SENSOR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = self.sensor_data;

                    return pd[cubeId][sensorType];
                },
            },
            [`pingpong_lite_g${self.cubeCount}_is_top_shape`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_dir6,
                        value: 'DF_RECTANGLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_is_top_shape` },
                paramsKeyMap: { CUBEID: 0, TILT_DIR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    return self._isUpperDir(cubeId, tiltDir);
                },
            },
            [`pingpong_lite_g${self.cubeCount}_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 10,
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                events: {},
                def: {
                    params: [null, null, null],
                    type: `pingpong_lite_g${self.cubeCount}_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1, DEGREE: 2 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');
                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                        const [arr, waitTime] = self.makeSingleStepPacket(cubeId,speed,degree);
                        const packet = Buffer.from(arr);
                        return [packet, waitTime];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_start_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [null, null],
                    type: `pingpong_lite_g${self.cubeCount}_start_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0, SPEED: 1 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');

                        const arr = self.makeContStepPacket(cubeId, speed);
                        const packet = Buffer.from(arr);

                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_stop_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
                        value: 0,
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
                def: {
                    params: [],
                    type: `pingpong_lite_g${self.cubeCount}_stop_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const arr = self.makeContStepPacket(cubeId, 0);
                        const packet = Buffer.from(arr);

                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_rotate_servo_mortor`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                def: { params: [null, { type: 'angle' }], type: `pingpong_lite_g${self.cubeCount}_rotate_servo_mortor` },
                paramsKeyMap: { cubeno: 0, DEGREE: 1 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = self._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = self.makePacket(self.OPCODE.SERVO, 0x00, cubeId, opt);
                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_set_dot_pixel`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_dot_on, 1],
                            [Lang.Blocks.pingpong_dot_off, 0],
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
                    type: `pingpong_lite_g${self.cubeCount}_set_dot_pixel`,
                },
                paramsKeyMap: { cubeno: 0, X: 1, Y: 2, onoff: 3 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = self._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = self.makePacket(
                            self.OPCODE.LEDMATRIX,
                            0xe1,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_set_dot_string`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', value: 'Hello!' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, null], type: `pingpong_lite_g${self.cubeCount}_set_dot_string` },
                paramsKeyMap: { cubeno: 0, STR: 1, DURATION: 2 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = self._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = self.makePacket(
                            self.OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
                        return [packet, waitTime];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_set_dot_clear`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_set_dot_clear` },
                paramsKeyMap: { cubeno: 0 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = self._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = self.makePacket(
                            self.OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet, 400];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_playNoteForBeats`]: {
                //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_playNoteForBeats` },
                paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const NOTE = script.getNumberField('NOTE', script);
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;
                        const arr = self.makeMusicNotePacket(cubeId, NOTE, durationSec);
                        const packet = Buffer.from(arr);

                        return [packet, waitTime];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_restForBeats`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_restForBeats` },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        return [null, waitTime];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_setTempo`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '60' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_setTempo` },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    self.tempo = self._clampTempo(tempo);
                    return script.callReturn();
                },
            },
            [`pingpong_lite_g${self.cubeCount}_getTempo`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_getTempo` },
                paramsKeyMap: {},
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.tempo;
                },
            },
            pingpong_lite_g2_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 10,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 10,
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [null],
                    type: 'pingpong_lite_g2_multi_motor_rotate',
                },
                paramsKeyMap: { DIR_1: 0, DEGREE_1: 1, DIR_2: 2, DEGREE_2: 3 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const dir4 = script.getStringField('DIR_4');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');
                        const degree4 = script.getNumberValue('DEGREE_4');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);
                        const speed4 = 80 * (dir4 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g2_multi_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_lite_g2_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g2_multi_playChordForBeats: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_lite_g2_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    BEATS: 2,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g3_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 10,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [],
                    type: 'pingpong_lite_g3_multi_motor_rotate',
                },
                paramsKeyMap: {
                    DIR_1: 0,
                    DEGREE_1: 1,
                    DIR_2: 2,
                    DEGREE_2: 3,
                    DIR_3: 4,
                    DEGREE_3: 5,
                },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const dir4 = script.getStringField('DIR_4');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');
                        const degree4 = script.getNumberValue('DEGREE_4');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);
                        const speed4 = 80 * (dir4 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g3_multi_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_lite_g3_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g3_multi_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_lite_g3_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    NOTE_3: 2,
                    BEATS: 3,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g4_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [],
                    type: 'pingpong_lite_g4_multi_motor_rotate',
                },
                paramsKeyMap: {
                    DIR_1: 0,
                    DEGREE_1: 1,
                    DIR_2: 2,
                    DEGREE_2: 3,
                    DIR_3: 4,
                    DEGREE_3: 5,
                    DIR_4: 6,
                    DEGREE_4: 7,
                },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const dir4 = script.getStringField('DIR_4');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');
                        const degree4 = script.getNumberValue('DEGREE_4');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);
                        const speed4 = 80 * (dir4 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g4_multi_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_lite_g4_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2, SPEED_4: 3 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g4_multi_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_lite_g4_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    NOTE_3: 2,
                    NOTE_4: 3,
                    BEATS: 4,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
        };
        console.log(this.name,'blocks',blocks);
        return blocks;
    }
}

module.exports = PingpongConnectLite;