'use strict';
const Buffer = require('buffer').Buffer;

(function() {
    Entry.ChocoLite = new (class ChocoLite {
        constructor() {
            this.id = '45.1';
            this.name = 'ChocoLite';
            this.url = 'http://jjomulrak.com';
            this.imageName = 'chocolite.png';
            this.title = {
                ko: '쪼코',
                en: 'Choco',
            };
            this.duration = 32;
            this.blockMenuBlocks = [
                'chocolite_move_forward',
                'chocolite_move_backward',
                'chocolite_turn_left',
                'chocolite_turn_right',
                'chocolite_move_right_left',
                'chocolite_onoff_led_rear',
                'chocolite_set_led_color',
                'chocolite_play_sound',
                'chocolite_is_front_sensor',
                'chocolite_is_bottom_sensor',
                'chocolite_is_light_sensor',
                'chocolite_get_front_sensor',
                'chocolite_get_bottom_sensor',
                'chocolite_get_light_sensor',
            ];
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: true,
                connectionType: 'bytestream',
            };

            // prettier-ignore
            this.crctab16 = new Uint16Array([
                0X0000, 0X1189, 0X2312, 0X329B, 0X4624, 0X57AD, 0X6536, 0X74BF,
                0X8C48, 0X9DC1, 0XAF5A, 0XBED3, 0XCA6C, 0XDBE5, 0XE97E, 0XF8F7,
                0X1081, 0X0108, 0X3393, 0X221A, 0X56A5, 0X472C, 0X75B7, 0X643E,
                0X9CC9, 0X8D40, 0XBFDB, 0XAE52, 0XDAED, 0XCB64, 0XF9FF, 0XE876,
                0X2102, 0X308B, 0X0210, 0X1399, 0X6726, 0X76AF, 0X4434, 0X55BD,
                0XAD4A, 0XBCC3, 0X8E58, 0X9FD1, 0XEB6E, 0XFAE7, 0XC87C, 0XD9F5,
                0X3183, 0X200A, 0X1291, 0X0318, 0X77A7, 0X662E, 0X54B5, 0X453C,
                0XBDCB, 0XAC42, 0X9ED9, 0X8F50, 0XFBEF, 0XEA66, 0XD8FD, 0XC974,
                0X4204, 0X538D, 0X6116, 0X709F, 0X0420, 0X15A9, 0X2732, 0X36BB,
                0XCE4C, 0XDFC5, 0XED5E, 0XFCD7, 0X8868, 0X99E1, 0XAB7A, 0XBAF3,
                0X5285, 0X430C, 0X7197, 0X601E, 0X14A1, 0X0528, 0X37B3, 0X263A,
                0XDECD, 0XCF44, 0XFDDF, 0XEC56, 0X98E9, 0X8960, 0XBBFB, 0XAA72,
                0X6306, 0X728F, 0X4014, 0X519D, 0X2522, 0X34AB, 0X0630, 0X17B9,
                0XEF4E, 0XFEC7, 0XCC5C, 0XDDD5, 0XA96A, 0XB8E3, 0X8A78, 0X9BF1,
                0X7387, 0X620E, 0X5095, 0X411C, 0X35A3, 0X242A, 0X16B1, 0X0738,
                0XFFCF, 0XEE46, 0XDCDD, 0XCD54, 0XB9EB, 0XA862, 0X9AF9, 0X8B70,
                0X8408, 0X9581, 0XA71A, 0XB693, 0XC22C, 0XD3A5, 0XE13E, 0XF0B7,
                0X0840, 0X19C9, 0X2B52, 0X3ADB, 0X4E64, 0X5FED, 0X6D76, 0X7CFF,
                0X9489, 0X8500, 0XB79B, 0XA612, 0XD2AD, 0XC324, 0XF1BF, 0XE036,
                0X18C1, 0X0948, 0X3BD3, 0X2A5A, 0X5EE5, 0X4F6C, 0X7DF7, 0X6C7E,
                0XA50A, 0XB483, 0X8618, 0X9791, 0XE32E, 0XF2A7, 0XC03C, 0XD1B5,
                0X2942, 0X38CB, 0X0A50, 0X1BD9, 0X6F66, 0X7EEF, 0X4C74, 0X5DFD,
                0XB58B, 0XA402, 0X9699, 0X8710, 0XF3AF, 0XE226, 0XD0BD, 0XC134,
                0X39C3, 0X284A, 0X1AD1, 0X0B58, 0X7FE7, 0X6E6E, 0X5CF5, 0X4D7C,
                0XC60C, 0XD785, 0XE51E, 0XF497, 0X8028, 0X91A1, 0XA33A, 0XB2B3,
                0X4A44, 0X5BCD, 0X6956, 0X78DF, 0X0C60, 0X1DE9, 0X2F72, 0X3EFB,
                0XD68D, 0XC704, 0XF59F, 0XE416, 0X90A9, 0X8120, 0XB3BB, 0XA232,
                0X5AC5, 0X4B4C, 0X79D7, 0X685E, 0X1CE1, 0X0D68, 0X3FF3, 0X2E7A,
                0XE70E, 0XF687, 0XC41C, 0XD595, 0XA12A, 0XB0A3, 0X8238, 0X93B1,
                0X6B46, 0X7ACF, 0X4854, 0X59DD, 0X2D62, 0X3CEB, 0X0E70, 0X1FF9,
                0XF78F, 0XE606, 0XD49D, 0XC514, 0XB1AB, 0XA022, 0X92B9, 0X8330,
                0X7BC7, 0X6A4E, 0X58D5, 0X495C, 0X3DE3, 0X2C6A, 0X1EF1, 0X0F78,
            ]);

            this.SEND_PACKET = {
                START: 0x7c,
                END: 0x7e,
            };

            this.cmdSeq = 0;
            this.isSendInitData = 'none';

            this.sendBuffers = [];
            this.recvBuffers = [];
            this.executeCmd = {
                processing: 'none',
                cb: null,
            };

            this.sensorData = {
                is_front_sensor: false,
                is_bottom_sensor: false,
                is_light_sensor: false,
                front_sensor: 0,
                bottom_sensor: 0,
                light_sensor: 0,
            };

            this.sensorInit = {
                inited: 'none',
                sensor0: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
                sensor1: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
                sensor2: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
            };

            this.ledStatus = [0, 0, 0]; //right, left, rear

            this.setZero();
        }

        // get monitorTemplate() {
        //     return {
        //         imgPath: 'hw_lite/choco2.png',
        //         width: 256,
        //         height: 256,
        //         listPorts: {
        //             '2': {
        //                 name: `${Lang.Hw.port_en} 2 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '3': {
        //                 name: `${Lang.Hw.port_en} 3 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '4': {
        //                 name: `${Lang.Hw.port_en} 4 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '5': {
        //                 name: `${Lang.Hw.port_en} 5 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '6': {
        //                 name: `${Lang.Hw.port_en} 6 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '7': {
        //                 name: `${Lang.Hw.port_en} 7 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '8': {
        //                 name: `${Lang.Hw.port_en} 8 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '9': {
        //                 name: `${Lang.Hw.port_en} 9 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '10': {
        //                 name: `${Lang.Hw.port_en} 10 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '11': {
        //                 name: `${Lang.Hw.port_en} 11 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '12': {
        //                 name: `${Lang.Hw.port_en} 12 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '13': {
        //                 name: `${Lang.Hw.port_en} 13 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a0: {
        //                 name: `${Lang.Hw.port_en} A0 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a1: {
        //                 name: `${Lang.Hw.port_en} A1 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a2: {
        //                 name: `${Lang.Hw.port_en} A2 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a3: {
        //                 name: `${Lang.Hw.port_en} A3 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a4: {
        //                 name: `${Lang.Hw.port_en} A4 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a5: {
        //                 name: `${Lang.Hw.port_en} A5 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //         },
        //         mode: 'both',
        //     };
        // }

        // getMonitorPort() {
        //     return {
        //         //TODO : 통신때마다 모니터되는 포트 업데이트 하기위해 현재 포트값들 리턴
        //     }
        // }

        setZero() {
            this.cmdSeq = 0;
            this.isSendInitData = 'none';

            this.sendBuffers = [];
            this.recvBuffers = [];
            this.executeCmd = {
                processing: 'none',
                cb: null,
            };

            this.sensorData = {
                is_front_sensor: false,
                is_bottom_sensor: false,
                is_light_sensor: false,
                front_sensor: 0,
                bottom_sensor: 0,
                light_sensor: 0,
            };

            this.sensorInit = {
                inited: 'none',
                sensor0: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
                sensor1: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
                sensor2: {
                    min: 0,
                    max: 0,
                    threshold: 0,
                },
            };

            if (Entry.hwLite) {
                Entry.hwLite.update();
            }
        }

        _addRecvData(value) {
            let parsed = false;
            let startIdx = 0;
            this.recvBuffers = this.recvBuffers.concat(...value);
            for (let i = 0; i < this.recvBuffers.length; i++) {
                if (this.recvBuffers[i] === this.SEND_PACKET.END) {
                    if (this.recvBuffers[0] === this.SEND_PACKET.START) {
                        this._parseRecvData(this.recvBuffers.slice(startIdx, i + 1));
                        this.recvBuffers.splice(0, i + 1);
                        parsed = true;
                        break;
                    }
                    this.recvBuffers.splice(0, i + 1);
                    startIdx = i;
                }
            }
            return parsed;
        }

        _parseRecvData(data) {
            if (data.length > 12 && data[0] === this.SEND_PACKET.START) {
                const idx = data.indexOf(this.SEND_PACKET.END);
                if (idx > 0) {
                    const decodedData = this.escapeEecode(data.slice(1, idx));

                    const command = decodedData.readUInt8(0);
                    const seqNo = decodedData.readUInt8(1);
                    const sensor0 = decodedData.readUInt16LE(2);
                    const sensor1 = decodedData.readUInt16LE(4);
                    const sensor2 = decodedData.readUInt16LE(6);

                    this.sensorData.front_sensor = sensor0;
                    this.sensorData.bottom_sensor = sensor1;
                    this.sensorData.light_sensor = sensor2;

                    if (decodedData.length === 29) {
                        this.sensorInit.inited = 'inited';
                        this.sensorInit.sensor0.min = decodedData.readUInt16LE(9);
                        this.sensorInit.sensor0.max = decodedData.readUInt16LE(11);
                        this.sensorInit.sensor0.threshold = decodedData.readUInt16LE(13);
                        this.sensorInit.sensor1.min = decodedData.readUInt16LE(15);
                        this.sensorInit.sensor1.max = decodedData.readUInt16LE(17);
                        this.sensorInit.sensor1.threshold = decodedData.readUInt16LE(19);
                        this.sensorInit.sensor2.min = decodedData.readUInt16LE(21);
                        this.sensorInit.sensor2.max = decodedData.readUInt16LE(23);
                        this.sensorInit.sensor2.threshold = decodedData.readUInt16LE(25);

                        // console.log(
                        //     `Sensor inited`,
                        //     `${this.sensorInit.sensor0.min},`,
                        //     `${this.sensorInit.sensor0.max},`,
                        //     `${this.sensorInit.sensor0.threshold}`
                        // );
                    }
                    if (this.sensorInit.inited === 'inited') {
                        if (this.sensorData.front_sensor < this.sensorInit.sensor0.min) {
                            this.sensorData.front_sensor = this.sensorInit.sensor0.min;
                        }
                        if (this.sensorData.front_sensor > this.sensorInit.sensor0.max) {
                            this.sensorData.front_sensor = this.sensorInit.sensor0.max;
                        }
                        if (this.sensorData.bottom_sensor < this.sensorInit.sensor1.min) {
                            this.sensorData.bottom_sensor = this.sensorInit.sensor1.min;
                        }
                        if (this.sensorData.bottom_sensor > this.sensorInit.sensor1.max) {
                            this.sensorData.bottom_sensor = this.sensorInit.sensor1.max;
                        }
                        if (this.sensorData.light_sensor < this.sensorInit.sensor2.min) {
                            this.sensorData.light_sensor = this.sensorInit.sensor2.min;
                        }
                        if (this.sensorData.light_sensor > this.sensorInit.sensor2.max) {
                            this.sensorData.light_sensor = this.sensorInit.sensor2.max;
                        }
                        this.sensorData.is_front_sensor =
                            this.sensorData.front_sensor < this.sensorInit.sensor0.threshold;
                        this.sensorData.is_bottom_sensor =
                            this.sensorData.bottom_sensor > this.sensorInit.sensor1.threshold;
                        this.sensorData.is_light_sensor =
                            this.sensorData.light_sensor < this.sensorInit.sensor2.threshold;

                        let fVal = this.sensorData.front_sensor;
                        const fMin = this.sensorInit.sensor0.min;
                        const fMmax = this.sensorInit.sensor0.max;
                        fVal = ((fVal - fMin) * 100) / (fMmax - fMin);

                        let bVal = this.sensorData.bottom_sensor;
                        const bMin = this.sensorInit.sensor1.min;
                        const bMmax = this.sensorInit.sensor1.max;
                        bVal = ((bVal - bMin) * 100) / (bMmax - bMin);

                        let lVal = this.sensorData.light_sensor;
                        const lMin = this.sensorInit.sensor2.min;
                        const lMmax = this.sensorInit.sensor2.max;
                        lVal = ((lVal - lMin) * 100) / (lMmax - lMin);

                        this.sensorData.front_sensor = parseInt(fVal, 10);
                        if (this.sensorData.front_sensor < 0) {
                            this.sensorData.front_sensor = 0;
                        } else if (this.sensorData.front_sensor > 100) {
                            this.sensorData.front_sensor = 100;
                        }
                        this.sensorData.bottom_sensor = parseInt(bVal, 10);
                        if (this.sensorData.bottom_sensor < 0) {
                            this.sensorData.bottom_sensor = 0;
                        } else if (this.sensorData.bottom_sensor > 100) {
                            this.sensorData.bottom_sensor = 100;
                        }
                        this.sensorData.light_sensor = parseInt(lVal, 10);
                        if (this.sensorData.light_sensor < 0) {
                            this.sensorData.light_sensor = 0;
                        } else if (this.sensorData.light_sensor > 100) {
                            this.sensorData.light_sensor = 100;
                        }
                    }

                    // console.log(
                    //     `command:${command}, len: ${decodedData.length}`,
                    //     `data:${data.toString('hex')}, seqNo:${seqNo}`,
                    //     `${sensor0},${sensor1},${sensor2}`,
                    //     `${this.sensorData.is_front_sensor},`,
                    //     `${this.sensorData.is_bottom_sensor},`,
                    //     `${this.sensorData.is_light_sensor}`,
                    //     `${this.sensorData.front_sensor},`,
                    //     `${this.sensorData.bottom_sensor},`,
                    //     `${this.sensorData.light_sensor}`
                    // );
                    if (command === 0x02 && this.executeCmd.processing === 'started') {
                        this.executeCmd.processing = 'done';
                        if (this.executeCmd.cb) {
                            this.executeCmd.cb();
                            this.executeCmd.cb = null;
                        }
                    }

                    if (this.isSendInitData === 'sent') {
                        this.isSendInitData = 'inited';
                    }
                }
            }
        }

        // 디바이스에서 값을 읽어온다.
        handleLocalData(data) {
            this._addRecvData(data);
        }

        //디바이스에 값을 쓴다.
        requestLocalData() {
            if (this.executeCmd.processing === 'none' || this.executeCmd.processing === 'done') {
                if (this.sendBuffers.length > 0) {
                    const cmd = this.sendBuffers.shift();

                    this.executeCmd.cb = cmd.cb;
                    this.executeCmd.processing = 'started';
                    return cmd.sendData;
                }
            }

            return null;
        }

        async initialHandshake() {
            this.recvBuffers = [];
            const cmdReady = this.makeData({
                type: 'ready',
            });
            this.sensorInit.inited = 'sent';
            // this.sensorInit.inited 가 inited 될 때까지 기다린다.
            while (this.sensorInit.inited === 'sent') {
                //parsed되었는데 상태가 변경안되면.. 다시 요청을 보낸다.
                this.log('Send Data:ready');
                await Entry.hwLite.sendAsync(cmdReady, false, (value) => {
                    this._addRecvData(value);
                });
            }

            this.recvBuffers = [];
            const cmdPing = this.makeData({
                type: 'ping2',
            });
            this.ledStatus = [0, 0, 0];
            this.isSendInitData = 'sent';
            await Entry.hwLite.sendAsync(cmdPing);

            while (this.isSendInitData === 'sent') {
                // this.isSendInitData 가 inited 될 때까지 기다린다.
                this.log('Send Data:ping2');
                await Entry.hwLite.sendAsync(cmdPing, false, (value) => {
                    this._addRecvData(value);
                });
            }
            return true;
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        chocolite_move_forward: '앞으로 %1 %2 이동 %3',
                        chocolite_move_backward: '뒤로 %1 %2 이동 %3',
                        chocolite_turn_left: '왼쪽으로 %1 %2 돌기 %3',
                        chocolite_turn_right: '오른쪽으로 %1 %2 돌기 %3',
                        chocolite_move_right_left: '오른쪽으로 %1 왼쪽으로 %2 %3 이동 %4',
                        chocolite_onoff_led_rear: '뒤쪽 LED %1 %2',
                        chocolite_set_led_color: '%1 LED %2 %3',
                        chocolite_play_sound: '%1 소리내기 %2',
                        chocolite_is_front_sensor: '전방센서',
                        chocolite_is_bottom_sensor: '바닥센서',
                        chocolite_is_light_sensor: '빛센서',
                        chocolite_get_front_sensor: '전방센서',
                        chocolite_get_bottom_sensor: '바닥센서',
                        chocolite_get_light_sensor: '빛센서',
                    },
                    Blocks: {
                        chocolite_move_step: '칸',
                        chocolite_move_cm: 'cm',
                        chocolite_trun_drgree: '도',
                        chocolite_trun_round: '바퀴',
                        chocolite_toggle_on: '켜기',
                        chocolite_toggle_off: '끄기',
                        chocolite_direction_right: '오른쪽',
                        chocolite_direction_left: '왼쪽',
                        chocolite_direction_dual: '양쪽(오른쪽,왼쪽)',

                        chocolite_color_off: '끄기',
                        chocolite_color_blue: '파란색',
                        chocolite_color_red: '빨간색',
                        chocolite_color_green: '초록색',
                        chocolite_color_yellow: '노랑색',
                        chocolite_color_pink: '분홍색',
                        chocolite_color_bluegreen: '청록색',
                        chocolite_color_white: '흰색',

                        chocolite_sound_car: '자동차',
                        chocolite_sound_robot: '로봇',
                        chocolite_sound_dog: '강아지',
                        chocolite_sound_cat: '고양이',
                        chocolite_sound_chicken: '닭',
                        chocolite_sound_tiger: '호랑이',
                        chocolite_sound_lion: '사자',
                        chocolite_sound_fart: '방귀소리',
                        chocolite_sound_helicopter: '헬리콥터',
                        chocolite_sound_train: '기차',
                        chocolite_sound_frog: '개구리',
                        chocolite_sound_jjajan: '짜잔(효과음)',
                        chocolite_sound_sheep: '양',
                        chocolite_sound_elephant: '코끼리',
                        chocolite_sound_camel: '낙타',
                        chocolite_sound_dolphin: '고래',
                        chocolite_sound_ttiyong: '띠용(효과음)',
                        chocolite_sound_hello_parrot: '헬로(앵무새)',
                        chocolite_sound_hello_manga: '헬로(만화)',
                        chocolite_sound_hello_man: '헬로(남자)',
                        chocolite_sound_ppong: '뽕(효과음)',
                        chocolite_sound_buzzer: '부저(효과음)',
                        chocolite_sound_ttalilalan: '따라리라란~(효과음)',
                        chocolite_sound_ttattattatta: '따따따따~(효과음)',
                        chocolite_sound_laughter: '웃음소리',
                        chocolite_sound_magic: '마술(효과음)',
                        chocolite_sound_woodpecker: '딱따구리',
                        chocolite_sound_bird: '새',
                        chocolite_sound_burp: '트림',
                        chocolite_sound_hiccup: '딸꾹질',
                        chocolite_sound_doridori: '도리도리',
                        chocolite_sound_firetruck: '소방차',
                        chocolite_sound_police_car: '경찰차',
                        chocolite_sound_applause: '박수환호',
                        chocolite_sound_kiss: '뽀뽀',
                        chocolite_sound_missile: '미사일',
                        chocolite_sound_angry_duck: '화난오리',
                        chocolite_sound_fly: '파리',
                        chocolite_sound_ufo: 'UFO',
                        chocolite_sound_fanfare: '팡파레',
                        chocolite_sound_sigh: '한숨소리',
                        chocolite_sound_alright: '올라잇~',
                        chocolite_sound_genius: '지니어스~',
                        chocolite_sound_no: '노우~',
                        chocolite_sound_wow: '오우~',
                        chocolite_sound_yahoo: '야호~',

                        chocolite_sound_low_do: '낮은 도',
                        chocolite_sound_low_dosharp: '낮은 도#',
                        chocolite_sound_low_re: '낮은 레',
                        chocolite_sound_low_resharp: '낮은 레#',
                        chocolite_sound_low_mi: '낮은 미',
                        chocolite_sound_low_fa: '낮은 파',
                        chocolite_sound_low_fasharp: '낮은 파#',
                        chocolite_sound_low_sol: '낮은 솔',
                        chocolite_sound_low_solsharp: '낮은 솔#',
                        chocolite_sound_low_ra: '낮은 라',
                        chocolite_sound_low_rasharp: '낮은 라#',
                        chocolite_sound_low_si: '낮은 시',
                        chocolite_sound_do: '도',
                        chocolite_sound_dosharp: '도#',
                        chocolite_sound_re: '레',
                        chocolite_sound_resharp: '레#',
                        chocolite_sound_mi: '미',
                        chocolite_sound_fa: '파',
                        chocolite_sound_fasharp: '파#',
                        chocolite_sound_sol: '솔',
                        chocolite_sound_solsharp: '솔#',
                        chocolite_sound_ra: '라',
                        chocolite_sound_rasharp: '라#',
                        chocolite_sound_si: '시',
                        chocolite_sound_high_do: '높은 도',
                        chocolite_sound_high_dosharp: '높은 도#',
                        chocolite_sound_high_re: '높은 레',
                        chocolite_sound_high_resharp: '높은 레#',
                        chocolite_sound_high_mi: '높은 미',
                        chocolite_sound_high_fa: '높은 파',
                        chocolite_sound_high_fasharp: '높은 파#',
                        chocolite_sound_high_sol: '높은 솔',
                        chocolite_sound_high_solsharp: '높은 솔#',
                        chocolite_sound_high_ra: '높은 라',
                        chocolite_sound_high_rasharp: '높은 라#',
                        chocolite_sound_high_si: '높은 시',
                    },
                },
                en: {
                    template: {
                        chocolite_move_forward: 'move forward %1 %2 block %3',
                        chocolite_move_backward: 'move backward %1 %2 block %3',
                        chocolite_turn_left: '%1 %2 to the left %3',
                        chocolite_turn_right: '%1 %2 to the right %3',
                        chocolite_move_right_left: 'move right %1 left %2 %3 %4',
                        chocolite_onoff_led_rear: 'Rear LED %1 %2',
                        chocolite_set_led_color: '%1 LED %2 %3',
                        chocolite_play_sound: 'play %1 %2',
                        chocolite_is_front_sensor: 'front sensor',
                        chocolite_is_bottom_sensor: 'bottom sensor',
                        chocolite_is_light_sensor: 'light sensor',
                        chocolite_get_front_sensor: 'front sensor',
                        chocolite_get_bottom_sensor: 'bottom sensor',
                        chocolite_get_light_sensor: 'light sensor',
                    },
                    Blocks: {
                        chocolite_move_step: 'step',
                        chocolite_move_cm: 'cm',
                        chocolite_trun_drgree: 'degree',
                        chocolite_trun_round: 'turns',
                        chocolite_toggle_on: 'on',
                        chocolite_toggle_off: 'off',
                        chocolite_direction_right: 'right',
                        chocolite_direction_left: 'left',
                        chocolite_direction_dual: 'all(right,left)',

                        chocolite_color_off: 'off',
                        chocolite_color_blue: 'blue',
                        chocolite_color_red: 'red',
                        chocolite_color_green: 'green',
                        chocolite_color_yellow: 'yellow',
                        chocolite_color_pink: 'pink',
                        chocolite_color_bluegreen: 'bluegreen',
                        chocolite_color_white: 'white',

                        chocolite_sound_car: 'car',
                        chocolite_sound_robot: 'robot',
                        chocolite_sound_dog: 'dog',
                        chocolite_sound_cat: 'cat',
                        chocolite_sound_chicken: 'chicken',
                        chocolite_sound_tiger: 'tiger',
                        chocolite_sound_lion: 'lion',
                        chocolite_sound_fart: 'fart',
                        chocolite_sound_helicopter: 'helicopter',
                        chocolite_sound_train: 'train',
                        chocolite_sound_frog: 'frog',
                        chocolite_sound_jjajan: 'jjajan(effect)',
                        chocolite_sound_sheep: 'sheep',
                        chocolite_sound_elephant: 'elephant',
                        chocolite_sound_camel: 'camel',
                        chocolite_sound_dolphin: 'dolphin',
                        chocolite_sound_ttiyong: 'ttiyong(effect)',
                        chocolite_sound_hello_parrot: 'hello(parrot)',
                        chocolite_sound_hello_manga: 'hello(manga)',
                        chocolite_sound_hello_man: 'hello(man)',
                        chocolite_sound_ppong: 'ppong(effect)',
                        chocolite_sound_buzzer: 'buzzer(effect)',
                        chocolite_sound_ttalilalan: 'ttalilalan(effect)',
                        chocolite_sound_ttattattatta: 'ttattattatta(effect)',
                        chocolite_sound_laughter: 'laughter',
                        chocolite_sound_magic: 'magic(effect)',
                        chocolite_sound_woodpecker: 'woodpecker',
                        chocolite_sound_bird: 'bird',
                        chocolite_sound_burp: 'burp',
                        chocolite_sound_hiccup: 'hiccup',
                        chocolite_sound_doridori: 'doridori',
                        chocolite_sound_firetruck: 'fire truck',
                        chocolite_sound_police_car: 'police car',
                        chocolite_sound_applause: 'applause',
                        chocolite_sound_kiss: 'kiss',
                        chocolite_sound_missile: 'missile',
                        chocolite_sound_angry_duck: 'angry duck',
                        chocolite_sound_fly: 'fly',
                        chocolite_sound_ufo: 'UFO',
                        chocolite_sound_fanfare: 'fanfare',
                        chocolite_sound_sigh: 'sigh',
                        chocolite_sound_alright: 'alright',
                        chocolite_sound_genius: 'genius',
                        chocolite_sound_no: 'no',
                        chocolite_sound_wow: 'wow',
                        chocolite_sound_yahoo: 'yahoo',

                        chocolite_sound_low_do: 'low do',
                        chocolite_sound_low_dosharp: 'low do#',
                        chocolite_sound_low_re: 'low re',
                        chocolite_sound_low_resharp: 'low re#',
                        chocolite_sound_low_mi: 'low mi',
                        chocolite_sound_low_fa: 'low fa',
                        chocolite_sound_low_fasharp: 'low fa#',
                        chocolite_sound_low_sol: 'low sol',
                        chocolite_sound_low_solsharp: 'low sol#',
                        chocolite_sound_low_ra: 'low ra',
                        chocolite_sound_low_rasharp: 'low ra#',
                        chocolite_sound_low_si: 'low si',
                        chocolite_sound_do: 'do',
                        chocolite_sound_dosharp: 'do#',
                        chocolite_sound_re: 're',
                        chocolite_sound_resharp: 're#',
                        chocolite_sound_mi: 'mi',
                        chocolite_sound_fa: 'fa',
                        chocolite_sound_fasharp: 'fa#',
                        chocolite_sound_sol: 'sol',
                        chocolite_sound_solsharp: 'sol#',
                        chocolite_sound_ra: 'ra',
                        chocolite_sound_rasharp: 'ra#',
                        chocolite_sound_si: 'si',
                        chocolite_sound_high_do: 'high do',
                        chocolite_sound_high_dosharp: 'high do#',
                        chocolite_sound_high_re: 'high re',
                        chocolite_sound_high_resharp: 'high re#',
                        chocolite_sound_high_mi: 'high mi',
                        chocolite_sound_high_fa: 'high fa',
                        chocolite_sound_high_fasharp: 'high fa#',
                        chocolite_sound_high_sol: 'high sol',
                        chocolite_sound_high_solsharp: 'high sol#',
                        chocolite_sound_high_ra: 'high ra',
                        chocolite_sound_high_rasharp: 'high ra#',
                        chocolite_sound_high_si: 'high si',
                    },
                },
            };
        }

        getBlocks() {
            return {
                chocolite_move_forward: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_move_step, 'step'],
                                [Lang.Blocks.chocolite_move_cm, 'cm'],
                            ],
                            value: 'step',
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
                        params: [1, 'step', null],
                        type: 'chocolite_move_forward',
                    },
                    paramsKeyMap: {
                        MOVE_CNT: 0,
                        MOVE_UNIT: 1,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const moveCnt = script.getValue('MOVE_CNT');
                        const moveUnit = script.getValue('MOVE_UNIT');
                        if (moveCnt === 0) {
                            return script.callReturn();
                        }

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'move_forward',
                                data: {
                                    param1: moveCnt,
                                    param2: moveUnit,
                                },
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_move_backward: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_move_step, 'step'],
                                [Lang.Blocks.chocolite_move_cm, 'cm'],
                            ],
                            value: 'step',
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
                        params: [1, 'step', null],
                        type: 'chocolite_move_backward',
                    },
                    paramsKeyMap: {
                        MOVE_CNT: 0,
                        MOVE_UNIT: 1,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const moveCnt = script.getValue('MOVE_CNT');
                        const moveUnit = script.getValue('MOVE_UNIT');
                        if (moveCnt === 0) {
                            return script.callReturn();
                        }

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'move_backward',
                                data: {
                                    param1: moveCnt,
                                    param2: moveUnit,
                                },
                            };
                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_turn_left: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_trun_drgree, 'degree'],
                                [Lang.Blocks.chocolite_trun_round, 'turns'],
                            ],
                            value: 'degree',
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
                        params: [90, 'degree', null],
                        type: 'chocolite_turn_left',
                    },
                    paramsKeyMap: {
                        TURN_CNT: 0,
                        TURN_UNIT: 1,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let turnCnt = script.getValue('TURN_CNT');
                        const turnUnit = script.getValue('TURN_UNIT');
                        if (turnCnt < 0) {
                            turnCnt = 0;
                        }
                        if (turnCnt === 0) {
                            return script.callReturn();
                        }

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'turn_left',
                                data: {
                                    param1: turnCnt,
                                    param2: turnUnit,
                                },
                            };
                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_turn_right: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_trun_drgree, 'degree'],
                                [Lang.Blocks.chocolite_trun_round, 'turns'],
                            ],
                            value: 'degree',
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
                        params: [90, 'degree', null],
                        type: 'chocolite_turn_right',
                    },
                    paramsKeyMap: {
                        TURN_CNT: 0,
                        TURN_UNIT: 1,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let turnCnt = script.getValue('TURN_CNT');
                        const turnUnit = script.getValue('TURN_UNIT');
                        if (turnCnt < 0) {
                            turnCnt = 0;
                        }
                        if (turnCnt === 0) {
                            return script.callReturn();
                        }

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'turn_right',
                                data: {
                                    param1: turnCnt,
                                    param2: turnUnit,
                                },
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });

                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_move_right_left: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_move_step, 'step'],
                                [Lang.Blocks.chocolite_move_cm, 'cm'],
                            ],
                            value: 'step',
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
                        params: [1, 1, 'step', null],
                        type: 'chocolite_move_right_left',
                    },
                    paramsKeyMap: {
                        MOVE_RIGHT_CNT: 0,
                        MOVE_LEFT_CNT: 1,
                        MOVE_UNIT: 2,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const moveRightCnt = script.getValue('MOVE_RIGHT_CNT');
                        const moveLeftCnt = script.getValue('MOVE_LEFT_CNT');
                        const moveUnit = script.getValue('MOVE_UNIT');

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'move_right_left',
                                data: {
                                    param1: moveRightCnt,
                                    param2: moveLeftCnt,
                                    param3: moveUnit,
                                },
                                time: Date.now(),
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_onoff_led_rear: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_toggle_on, 'On'],
                                [Lang.Blocks.chocolite_toggle_off, 'Off'],
                            ],
                            value: 'On',
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
                        params: ['On', null],
                        type: 'chocolite_onoff_led_rear',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const ledOnoff = script.getValue('VALUE');

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'onoff_led_rear',
                                data: {
                                    param1: ledOnoff,
                                },
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_set_led_color: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_direction_right, 'right'],
                                [Lang.Blocks.chocolite_direction_left, 'left'],
                                [Lang.Blocks.chocolite_direction_dual, 'dual'],
                            ],
                            value: 'right',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_color_off, 0],
                                [Lang.Blocks.chocolite_color_blue, 1],
                                [Lang.Blocks.chocolite_color_red, 2],
                                [Lang.Blocks.chocolite_color_green, 3],
                                [Lang.Blocks.chocolite_color_yellow, 4],
                                [Lang.Blocks.chocolite_color_pink, 5],
                                [Lang.Blocks.chocolite_color_bluegreen, 6],
                                [Lang.Blocks.chocolite_color_white, 7],
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
                        params: ['right', 1, null],
                        type: 'chocolite_set_led_color',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        COLOR: 1,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const ledDir = script.getValue('DIRECTION');
                        const ledColor = script.getValue('COLOR');

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'set_led_color',
                                data: {
                                    param1: ledDir,
                                    param2: ledColor,
                                },
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_play_sound: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.chocolite_sound_car, 1],
                                [Lang.Blocks.chocolite_sound_robot, 2],
                                [Lang.Blocks.chocolite_sound_dog, 3],
                                [Lang.Blocks.chocolite_sound_cat, 4],
                                [Lang.Blocks.chocolite_sound_chicken, 5],
                                [Lang.Blocks.chocolite_sound_tiger, 6],
                                [Lang.Blocks.chocolite_sound_lion, 7],
                                [Lang.Blocks.chocolite_sound_fart, 8],
                                [Lang.Blocks.chocolite_sound_helicopter, 9],
                                [Lang.Blocks.chocolite_sound_train, 10],
                                [Lang.Blocks.chocolite_sound_frog, 11],
                                [Lang.Blocks.chocolite_sound_jjajan, 12],
                                [Lang.Blocks.chocolite_sound_sheep, 13],
                                [Lang.Blocks.chocolite_sound_elephant, 14],
                                [Lang.Blocks.chocolite_sound_camel, 15],
                                [Lang.Blocks.chocolite_sound_dolphin, 16],
                                [Lang.Blocks.chocolite_sound_ttiyong, 17],
                                [Lang.Blocks.chocolite_sound_hello_parrot, 18],
                                [Lang.Blocks.chocolite_sound_hello_manga, 19],
                                [Lang.Blocks.chocolite_sound_hello_man, 20],
                                [Lang.Blocks.chocolite_sound_ppong, 21],
                                [Lang.Blocks.chocolite_sound_buzzer, 22],
                                [Lang.Blocks.chocolite_sound_ttalilalan, 23],
                                [Lang.Blocks.chocolite_sound_ttattattatta, 24],
                                [Lang.Blocks.chocolite_sound_laughter, 25],
                                [Lang.Blocks.chocolite_sound_magic, 26],
                                [Lang.Blocks.chocolite_sound_woodpecker, 27],
                                [Lang.Blocks.chocolite_sound_bird, 28],
                                [Lang.Blocks.chocolite_sound_burp, 29],
                                [Lang.Blocks.chocolite_sound_hiccup, 30],
                                [Lang.Blocks.chocolite_sound_doridori, 31],
                                [Lang.Blocks.chocolite_sound_firetruck, 32],
                                [Lang.Blocks.chocolite_sound_police_car, 33],
                                [Lang.Blocks.chocolite_sound_applause, 34],
                                [Lang.Blocks.chocolite_sound_kiss, 35],
                                [Lang.Blocks.chocolite_sound_missile, 36],
                                [Lang.Blocks.chocolite_sound_angry_duck, 37],
                                [Lang.Blocks.chocolite_sound_fly, 38],
                                [Lang.Blocks.chocolite_sound_ufo, 39],
                                [Lang.Blocks.chocolite_sound_fanfare, 40],
                                [Lang.Blocks.chocolite_sound_sigh, 41],
                                [Lang.Blocks.chocolite_sound_alright, 42],
                                [Lang.Blocks.chocolite_sound_genius, 43],
                                [Lang.Blocks.chocolite_sound_no, 44],
                                [Lang.Blocks.chocolite_sound_wow, 45],
                                [Lang.Blocks.chocolite_sound_yahoo, 46],

                                [Lang.Blocks.chocolite_sound_low_do, 47],
                                [Lang.Blocks.chocolite_sound_low_dosharp, 48],
                                [Lang.Blocks.chocolite_sound_low_re, 49],
                                [Lang.Blocks.chocolite_sound_low_resharp, 50],
                                [Lang.Blocks.chocolite_sound_low_mi, 51],
                                [Lang.Blocks.chocolite_sound_low_fa, 52],
                                [Lang.Blocks.chocolite_sound_low_fasharp, 53],
                                [Lang.Blocks.chocolite_sound_low_sol, 54],
                                [Lang.Blocks.chocolite_sound_low_solsharp, 55],
                                [Lang.Blocks.chocolite_sound_low_ra, 56],
                                [Lang.Blocks.chocolite_sound_low_rasharp, 57],
                                [Lang.Blocks.chocolite_sound_low_si, 58],
                                [Lang.Blocks.chocolite_sound_do, 59],
                                [Lang.Blocks.chocolite_sound_dosharp, 60],
                                [Lang.Blocks.chocolite_sound_re, 61],
                                [Lang.Blocks.chocolite_sound_resharp, 62],
                                [Lang.Blocks.chocolite_sound_mi, 63],
                                [Lang.Blocks.chocolite_sound_fa, 64],
                                [Lang.Blocks.chocolite_sound_fasharp, 65],
                                [Lang.Blocks.chocolite_sound_sol, 66],
                                [Lang.Blocks.chocolite_sound_solsharp, 67],
                                [Lang.Blocks.chocolite_sound_ra, 68],
                                [Lang.Blocks.chocolite_sound_rasharp, 69],
                                [Lang.Blocks.chocolite_sound_si, 70],
                                [Lang.Blocks.chocolite_sound_high_do, 71],
                                [Lang.Blocks.chocolite_sound_high_dosharp, 72],
                                [Lang.Blocks.chocolite_sound_high_re, 73],
                                [Lang.Blocks.chocolite_sound_high_resharp, 74],
                                [Lang.Blocks.chocolite_sound_high_mi, 75],
                                [Lang.Blocks.chocolite_sound_high_fa, 76],
                                [Lang.Blocks.chocolite_sound_high_fasharp, 77],
                                [Lang.Blocks.chocolite_sound_high_sol, 78],
                                [Lang.Blocks.chocolite_sound_high_solsharp, 79],
                                [Lang.Blocks.chocolite_sound_high_ra, 80],
                                [Lang.Blocks.chocolite_sound_high_rasharp, 81],
                                [Lang.Blocks.chocolite_sound_high_si, 82],
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
                        params: [1, null],
                        type: 'chocolite_play_sound',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                    },
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        const sound = script.getValue('SOUND');

                        if (!script.is_started) {
                            script.is_started = true;
                            const msg = {
                                type: 'play_sound',
                                data: {
                                    param1: sound,
                                },
                            };

                            const sendData = this.makeData(msg);
                            script.isDone = false;
                            this.sendBuffers.push({
                                sendData,
                                cb: () => {
                                    script.isDone = true;
                                },
                            });
                            return script;
                        }

                        if (script.isDone) {
                            delete script.is_started;
                            delete script.isDone;
                            return script.callReturn();
                        }
                        return script;
                    },
                },
                chocolite_is_front_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_is_front_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = false;
                        if (this.sensorData) {
                            retVal = this.sensorData.is_front_sensor;
                        }
                        return retVal;
                    },
                },
                chocolite_is_bottom_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_is_bottom_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = false;
                        if (this.sensorData) {
                            retVal = this.sensorData.is_bottom_sensor;
                        }
                        return retVal;
                    },
                },
                chocolite_is_light_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_is_light_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = false;
                        if (this.sensorData) {
                            retVal = this.sensorData.is_light_sensor;
                        }
                        return retVal;
                    },
                },

                chocolite_get_front_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_get_front_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = 0;
                        if (this.sensorData) {
                            retVal = this.sensorData.front_sensor;
                        }
                        return retVal;
                    },
                },
                chocolite_get_bottom_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_get_bottom_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = 0;
                        if (this.sensorData) {
                            retVal = this.sensorData.bottom_sensor;
                        }
                        return retVal;
                    },
                },
                chocolite_get_light_sensor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Text',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'chocolite_get_light_sensor',
                    },
                    paramsKeyMap: {},
                    class: 'chocolite_command',
                    isNotFor: ['ChocoLite'],
                    func: (sprite, script) => {
                        let retVal = 0;
                        if (this.sensorData) {
                            retVal = this.sensorData.light_sensor;
                        }
                        return retVal;
                    },
                },
            };
        }

        /***************************************************************************************
         *  프로토롤 제어 함수
         ***************************************************************************************/
        sequenceNo() {
            if (this.cmdSeq > 254) {
                this.cmdSeq = 0;
            } else {
                this.cmdSeq++;
            }
            return this.cmdSeq;
        }

        calMoveVal(args) {
            let retval = 0;
            if (args.param2 === 'cm') {
                retval = parseInt(args.param1 * 10, 10);
                if (args.param1 > 0 && retval === 0) {
                    retval = 1;
                }
            } else {
                retval = args.param1 * 10;
            }
            retval = parseInt(retval, 10);
            if (retval < 0) {
                retval = 0;
            }
            if (retval > 990) {
                retval = 990;
            }
            return retval;
        }

        calTurnVal(args) {
            let retval = 0;
            if (args.param2 === 'degree') {
                retval = parseInt((args.param1 * 10) / 90, 10);
                if (args.param1 > 0 && retval === 0) {
                    retval = 1;
                }
            } else {
                retval = args.param1 * 10 * 4;
            }
            retval = parseInt(retval, 10);
            if (retval < 0) {
                retval = 0;
            }
            if (retval > 990) {
                retval = 990;
            }
            return retval;
        }

        calLedCol(args) {
            let rightLed = 0;
            let leftLed = 0;

            if (args.param1 === 'right') {
                rightLed = args.param2;
            } else if (args.param1 === 'left') {
                leftLed = args.param2;
            } else if (args.param1 === 'dual') {
                rightLed = args.param2;
                leftLed = args.param2;
            }

            return {
                rightLed,
                leftLed,
            };
        }

        /***************************************************************************************
         *  Protocol 데이터 생성
         ***************************************************************************************/
        makeData(msg) {
            const seqNo = this.sequenceNo();
            let data = null;
            let crc = 0;
            let encodedCmd = [];

            const type = msg.type;
            let args = {};
            if (msg.data) {
                args = msg.data;
            }

            switch (type) {
                case 'ping':
                    data = Buffer.from([0x03, seqNo]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'ping2':
                    data = Buffer.from([0x13, seqNo]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'ping3':
                    data = Buffer.from([0x14, seqNo]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'ping2_end':
                    data = Buffer.from([0x17, seqNo]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'ready':
                    data = Buffer.from([0x04, seqNo]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'move_forward':
                    if (args.param2 === 'cm') {
                        data = Buffer.from([0x19, seqNo, 0, 0, 0, 0]);
                    } else {
                        data = Buffer.from([0x05, seqNo, 0, 0, 0, 0]);
                    }
                    data.writeUInt32LE(this.calMoveVal(args), 2);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'move_backward':
                    if (args.param2 === 'cm') {
                        data = Buffer.from([0x1a, seqNo, 0, 0, 0, 0]);
                    } else {
                        data = Buffer.from([0x06, seqNo, 0, 0, 0, 0]);
                    }
                    data.writeUInt32LE(this.calMoveVal(args), 2);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'turn_left':
                    data = Buffer.from([0x07, seqNo, 0, 0, 0, 0]);
                    data.writeUInt32LE(this.calTurnVal(args), 2);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'turn_right':
                    data = Buffer.from([0x08, seqNo, 0, 0, 0, 0]);
                    data.writeUInt32LE(this.calTurnVal(args), 2);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;

                case 'move_right_left': {
                    if (args.param3 === 'cm') {
                        data = Buffer.from([0x1b, seqNo, 0, 0, 0, 0, 0, 0, 0, 0]);
                    } else {
                        data = Buffer.from([0x0d, seqNo, 0, 0, 0, 0, 0, 0, 0, 0]);
                    }
                    const args1 = {
                        param1: args.param1,
                        param2: args.param3,
                    };
                    const args2 = {
                        param1: args.param2,
                        param2: args.param3,
                    };
                    data.writeUInt32LE(this.calMoveVal(args1), 2);
                    data.writeUInt32LE(this.calMoveVal(args2), 6);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;
                }

                case 'onoff_led_rear': {
                    const rearLed = args.param1 === 'On' ? 1 : 0;
                    this.ledStatus[2] = rearLed;
                    data = Buffer.from([
                        0x0b,
                        seqNo,
                        this.ledStatus[0],
                        this.ledStatus[1],
                        this.ledStatus[2],
                    ]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;
                }

                case 'set_led_color': {
                    const { rightLed, leftLed } = this.calLedCol(args);
                    if (args.param1 === 'right') {
                        this.ledStatus[0] = rightLed;
                    } else if (args.param1 === 'left') {
                        this.ledStatus[1] = leftLed;
                    } else if (args.param1 === 'dual') {
                        this.ledStatus[0] = rightLed;
                        this.ledStatus[1] = leftLed;
                    }
                    data = Buffer.from([
                        0x0b,
                        seqNo,
                        this.ledStatus[0],
                        this.ledStatus[1],
                        this.ledStatus[2],
                    ]);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;
                }

                case 'play_sound':
                    data = Buffer.from([0x0f, seqNo, 0, 0, 0, 0]);
                    data.writeUInt32LE(args.param1, 2);
                    crc = this.calCrc16(data);
                    encodedCmd = this.escapeEncode(
                        Buffer.concat([data, Buffer.from([crc & 0xff, (crc >> 8) & 0xff])])
                    );
                    break;
            }

            const cmdData = Buffer.from([0x7c, ...encodedCmd, 0x7e]);
            //console.log(cmdData);
            return cmdData;
        }

        /***************************************************************************************
         *  데이터 encoding
         ***************************************************************************************/
        escapeEncode(data) {
            const buffer = Buffer.alloc(data.length * 2);
            let idx = 0;
            for (const d of data) {
                if (d === 0x7c) {
                    buffer[idx] = 0x7d;
                    buffer[idx + 1] = 0x5c;
                    idx += 2;
                } else if (d === 0x7d) {
                    buffer[idx] = 0x7d;
                    buffer[idx + 1] = 0x5d;
                    idx += 2;
                } else if (d === 0x7e) {
                    buffer[idx] = 0x7d;
                    buffer[idx + 1] = 0x5e;
                    idx += 2;
                } else {
                    buffer[idx] = d;
                    idx++;
                }
            }
            return buffer.slice(0, idx);
        }

        /***************************************************************************************
         *  데이터 decoding
         ***************************************************************************************/
        escapeEecode(data) {
            const buffer = Buffer.alloc(data.length);
            let idx = 0;
            let i = 0;
            while (i < data.length) {
                if (data[i] === 0x7d) {
                    buffer[idx++] = data[i + 1] ^ 0x20;
                    i += 2;
                } else {
                    buffer[idx++] = data[i++];
                }
            }
            return buffer.slice(0, idx);
        }

        /***************************************************************************************
         *  CRC 생성
         ***************************************************************************************/
        calCrc16(data) {
            let res = 0x0ffff;

            for (const b of data) {
                res = ((res >> 8) & 0x0ff) ^ this.crctab16[(res ^ b) & 0xff];
            }

            return ~res & 0x0ffff;
        }

        /***************************************************************************************
         *  로그 출력
         ***************************************************************************************/
        // #region Functions for log

        log(message, data = undefined) {
            // 로그를 출력하지 않으려면 아래 주석을 활성화 할 것
            let strInfo = '';
            switch (typeof data) {
                case 'object':
                    {
                        strInfo = ` - [ ${this.convertByteArrayToHexString(data)} ]`;
                        console.log(`${message} - ${typeof data}${strInfo}`);
                    }
                    break;
                default:
                    {
                        console.log(message);
                    }
                    break;
            }
        }

        // 바이트 배열을 16진수 문자열로 변경
        convertByteArrayToHexString(data) {
            let strHexArray = '';
            let strHex;

            if (typeof data === 'object' && data.length > 1) {
                for (let i = 0; i < data.length; i++) {
                    strHex = data[i].toString(16).toUpperCase();
                    strHexArray += ' ';
                    if (strHex.length === 1) {
                        strHexArray += '0';
                    }
                    strHexArray += strHex;
                }
                strHexArray = strHexArray.substr(1, strHexArray.length - 1);
            } else {
                strHexArray = data.toString();
            }

            return strHexArray;
        }
    })();
})();

module.exports = Entry.ChocoLite;
