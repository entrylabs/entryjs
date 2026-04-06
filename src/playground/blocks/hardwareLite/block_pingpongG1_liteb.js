// 'use strict';

// import _range from 'lodash/range';

// const OPCODE = {
//     SINGLE_STEPS: 0xc1,
//     SCHEDULED_STEPS: 0xca,
//     SCHEDULED_POINTS: 0xcb,
//     CONTINUOUS_STEPS: 0xcc,
//     AGGREGATE_STEPS: 0xcd,
//     LEDMATRIX: 0xa2,
//     SERVO: 0xe1,
//     MUSIC: 0xe8,
// };

// const METHOD = {
//     CONTINOUS: 0,
//     RELATIVE_SINGLE: 1,
//     ABSOLUTE_SINGLE: 2,
//     SCHED_STEPS: 3,
//     sCHED_POINT: 4,
// };

// const MODE = {
//     BASIC: 1,
//     MULTIROLE: 2,
//     CHECKCRC: 3,
// };

// const PROPERTY = {
//     PERI: 0x01,
//     MULTI: 0x02,
//     PORT: 0x80,
//     ADDRESS: 0x70,
//     PAUSE: 1,
//     RESUME: 2,
//     MUSIC_PLAY: 0,
// };

// const DEFAULT_TEMPO = 60;
// (function() {
//     Entry.PingpongG1Lite = new (class PingpongG1Lite {
//         constructor() {
//             this.id = '060101';
//             this.webapiType = 'ble';
//             this.bluetoothInfo = {
//                 filters: [
//                     {
//                         namePrefix: 'PINGPONG',
//                     },
//                 ],
//             };
//             this.services=null
//             this.name = 'PingpongG1Lite';
//             this.url = 'http://www.roborisen.com';
//             this.imageName = 'PingpongG1Lite.png';
//             this.title = {
//                 ko: 'G큐브(Web)',
//                 en: 'G-cube(Web)',
//             };

//             this.customPrompt = {
//                 title: '그룹 번호 입력',
//                 description: '연결할 기기의 그룹 번호를 입력해 주세요.\n 별도로 지정하지 않았다면 00을 입력합니다.',
//                 defaultValue: '00',
//                 negativeButtonText: '취소',
//                 positiveButtonText: '설정',
//             };

//             this.communicationType = 'manual';
//             this.cubeCount = 1;
//             this.checkMultiroleAction = false;
//             this.isplaying = false;
//             this.sendBuffer = [];
//             this.TILT_THRESHOLD = 20;
//             this.MOVE_THRESHOLD = 30;
//             this.send_cmd_id = 0;
//             // 엔트리Js에서 기기와 통신하는 함수 호출 Duration 간격
//             this.duration = 50;
//             this.portData = {
//                 baudRate: 115200,
//                 duration: 50,
//                 dataBits: 8,
//                 parity: 'none',
//                 stopBits: 1,
//                 bufferSize: 65536,
//                 constantServing: true,
//             };

//             this.sensor_data = {
//                 MOVE_X: 0,
//                 MOVE_Y: 0,
//                 MOVE_Z: 0,
//                 TILT_X: 0,
//                 TILT_Y: 0,
//                 TILT_Z: 0,
//                 BUTTON: 0,
//                 PROXIMITY: 0,
//                 AIN: 0,
//             };

//             this.blockMenuBlocks = [
//                 'pingpong_lite_g1_when_button_pressed',
//                 'pingpong_lite_g1_is_button_pressed',
//                 'pingpong_lite_g1_when_tilted',
//                 'pingpong_lite_g1_is_tilted',
//                 'pingpong_lite_g1_get_tilt_value',
//                 'pingpong_lite_g1_is_top_shape',
//                 'pingpong_lite_g1_get_sensor_value',
//                 'pingpong_lite_g1_motor_rotate',
//                 'pingpong_lite_g1_start_motor_rotate',
//                 'pingpong_lite_g1_stop_motor_rotate',
//                 'pingpong_lite_g1_rotate_servo_mortor',
//                 'pingpong_lite_g1_set_dot_pixel',
//                 'pingpong_lite_g1_set_dot_string',
//                 'pingpong_lite_g1_set_dot_clear',
//                 'pingpong_lite_g1_playNoteForBeats',
//                 'pingpong_lite_g1_restForBeats',
//                 'pingpong_lite_g1_setTempo',
//                 'pingpong_lite_g1_getTempo',
//             ];
//             this.tempo = 60;
//             this.readablePorts = [];
//             this.setZero();
//         }

//         // 그룹번호 넣기
//         requestInitialData(sp, payload) {
//             console.log('g1함수이름:requestInitialData');
//             const grpid = payload.match(/[0-9]{1,2}$/g);
//             if (grpid == null) {
//                 console.warn('Wrong group id inputted', payload);
//                 return null;
//             }
//             const grpno = parseInt(grpid[0], 16);

//             if (this.checkMultiroleAction == false) {
//                 this.checkMultiroleAction = true;
//                 return this.makePackets('connect', grpno);
//             } else {
//                 return null;
//             }
//         }

//         async initialHandshake() {
//             console.log('g1함수이름:initialHandshake');
//             const 원본disconnect = Entry.hwLite.disconnect;

//             Entry.hwLite.disconnect = async function(...인수) {
//                 console.log('disconnect 호출됨');

//                 await 캐릭터리스틱쓰기.writeValue(new Uint8Array([0xff,0xff,0xff,0xff,0x00,0x00,0xa8,0x00,0x0a,0x01]));
//                 return await 원본disconnect.apply(this, 인수);
//             };


//             const 디바이스 = Entry.hwLite.webConnector.device
//             console.log('디바이스',디바이스);
//             const 서비스 = await 디바이스.gatt.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
//             console.log('서비스',서비스);
//             const 캐릭터리스틱쓰기 = await 서비스.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
//             const 캐릭터리스틱읽기 = await 서비스.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
//             console.log('캐릭터리스틱쓰기',캐릭터리스틱쓰기);
//             console.log('캐릭터리스틱읽기',캐릭터리스틱읽기);
//             await 캐릭터리스틱읽기.startNotifications();
//             캐릭터리스틱읽기.addEventListener('characteristicvaluechanged', (이벤트) => {
//                 const 대상 = 이벤트.target;
//                 const 값 = 대상.value;

//                 if (!값 || 값.byteLength == 0) {return;}

//                 const 바이트배열 = new Uint8Array(값.buffer);
//                 console.log('구독 데이터', 바이트배열);
//             });
//             await 캐릭터리스틱쓰기.writeValue(new Uint8Array([0xff,0xff,0x00,0x07,0x00,0x00,0xce,0x00,0x0e,0x02,0x00,0x00,0x07,0x50]));
//             setTimeout(async () => {
//                 await 캐릭터리스틱쓰기.writeValue(new Uint8Array([0xff,0xff,0x00,0xff,0x00,0xc8,0xb8,0x00,0x0b,0x0a,0x01]));
//             }, 5000);


//         }
//         // async initialHandshake() {
//         //     Entry.hwLite.serial.sendAsciiAsBuffer(this.requestInitialData(0,'0'));

//         //     return true;
//         // }

//         makePackets(method, grpid = 0) {
//             console.log('g1함수이름:makePackets');
//             let result = null;
//             if (method === 'connect') {
//                 result = Buffer.from([
//                     0xdd,
//                     0xdd,
//                     grpid,
//                     0x00,
//                     0x00,
//                     0x00,
//                     0xda,
//                     0x00,
//                     0x0b,
//                     0x00,
//                     0x00,
//                 ]);
//                 //result[2] = this.groupId;
//             } else if (method === 'getSensorData') {
//                 result = Buffer.from([
//                     0xff,
//                     0xff,
//                     0xff,
//                     0xff, // position
//                     0x00,
//                     0xc8, // continuous sampling
//                     0xb8,
//                     0x00,
//                     0x0b,
//                     10, // interval //YIM's 30->10
//                     0x01,
//                 ]);
//             }  else if (method === 'setColorLed') {
//                 result = Buffer.from('ffff00070000ce000e0200000750', 'hex');
//             }
//             return result;
//         }

//         makePacket(opcode, taskid, opt) {
//             console.log('g1함수이름:makePacket');

//             const header = Buffer.from([0xff, 0xff, 0xff, 0xff, 0, 0, opcode, 0, 0]);
//             const property = Buffer.from(opt);

//             //header.writeUInt16BE(0xFFFF, 0);
//             //header.writeUInt16BE(0xFFFF, 2);	// cubdid

//             header.writeUInt16BE(taskid, 4);
//             header.writeUInt16BE(header.length + property.length, 7);

//             return Buffer.concat([header, property]);
//         }


//         async postCallReturn(script, myfunc) {
//             console.log('g1함수이름:postCallReturn');
//             if (myfunc == undefined) {
//                 return script.callReturn();
//             }

//             if (script.is_start == undefined) {
//                 script.is_start = true;

//                 const [packet, waitTime = this.delayTime] = myfunc();

//                 if (packet && packet.length > 0) {
//                     Entry.hwLite.serial.sendAsciiAsBuffer(packet)
//                     this.isplaying = true;
//                 }

//                 await new Promise(resolve => setTimeout(resolve, waitTime));  // waitTime 동안 대기

//                 script.is_start = false;

//                 return script.callReturn();
//             } else if (script.is_start == true) {
//                 return script;
//             } else {
//                 delete script.is_start;

//                 return script.callReturn();
//             }
//         }

//         // 연결시 기기 초기화
//         async setZero() {
//             console.log('g1함수이름:setZero');
//             console.log('pingpong g1 lite loaded');
//             Entry.hwLite.testCustomPromptPayload()
//         }
//         // async setZero() {
//         //     if (Entry.hwLite && Entry.hwLite.serial) {
//         //         Entry.hwLite.serial.update();
//         //         Entry.hwLite.serial.sendAsciiAsBuffer(this.makePackets('setColorLed', 0));
//         //     }

//         //     // 기기 정지
//         //     if(this.isplaying){
//         //         for(let j = 0; j < 5; j++){
//         //             const packet = Entry.PingpongG1Lite.makeContStepPacket(0, 0);
//         //             Entry.hwLite.serial.sendAsciiAsBuffer(packet);

//         //             await new Promise(resolve => setTimeout(resolve, 50));  // 50ms 대기
//         //         }
//         //     }
//         //     this.isplaying = false
//         // }

//         // 하드웨어에서 온 데이터 처리
//         handleLocalData(data) {
//             console.log('g1함수이름:handleLocalData');
//             console.log('그룹',Entry.hwLite.getCustomPromptPayload());

//             if (data.length >= 9) {
//                 const dataView = new DataView(data.buffer);
//                 const packetSize = dataView.getUint16(7, false);
//                 const opcode = data[6];

//                 if (data.length === packetSize && opcode === 0xb8) {
//                     const sensor = Entry.PingpongG1Lite.sensor_data;

//                     sensor.MOVE_X = dataView.getInt8(12);
//                     sensor.MOVE_Y = dataView.getInt8(13);
//                     sensor.MOVE_Z = dataView.getInt8(14);

//                     const xx = Math.max(Math.min(dataView.getInt8(15), 90), -90);
//                     let yy = Math.max(Math.min(dataView.getInt8(16), 90), -90);
//                     yy *= -1;
//                     const zz = Math.max(Math.min(dataView.getInt8(17), 90), -90);

//                     if(sensor.TILT_X != xx || sensor.TILT_Y != yy || sensor.TILT_Z != zz){
//                         Entry.engine.fireEvent('pp_when_tilted');
//                     }

//                     sensor.TILT_X = xx;
//                     sensor.TILT_Y = yy;
//                     sensor.TILT_Z = zz;

//                     if(sensor.BUTTON != dataView.getUint8(11)){
//                         Entry.engine.fireEvent('pp_when_button_pressed');
//                     }

//                     console.log(zz);

//                     sensor.BUTTON = dataView.getUint8(11);

//                     sensor.PROXIMITY = dataView.getUint8(18);

//                     // 기존 FW 70 버전 = data length 19 bytes (ANALOG IN 미지원)
//                     if (packetSize > 19) {
//                         sensor.AIN = dataView.getUint8(19) * 4;
//                     } else {
//                         sensor.AIN = 0;
//                     }
//                 }
//             }
//         }


//         // 하드웨어 기기에 전달할 데이터
//         requestLocalData() {
//             console.log('g1함수이름:requestLocalData');
//             this.sendBuffer = [];
//             this.sendBuffer.push(this.makePackets('getSensorData', 1))

//             return this.sendBuffer[0];
//         }

//         _clampBeats(beats) {
//             console.log('g1함수이름:_clampBeats');
//             return Math.min(Math.max(beats, 0), 40);
//         }

//         _clampTempo(tempo) {
//             console.log('g1함수이름:_clampTempo');
//             return Math.min(Math.max(tempo, 20), 500);
//         }

//         _beatsToDuration(beats) {
//             console.log('g1함수이름:_beatsToDuration');
//             let duration = Math.round((60 / this.tempo) * beats * 100);
//             return duration;
//         }

//         _fillPacketIntoArray(data, opcode, taskid, cubeNo, size) {
//             console.log('g1함수이름:_fillPacketIntoArray');
//             data[0] = 0xff;
//             data[1] = 0xff;
//             data[2] = 0xff;

//             if (cubeNo <= -1) {
//                 data[3] = 0xff;
//             } else {
//                 data[3] = cubeNo;
//             }

//             data[4] = taskid / 256;
//             data[5] = taskid % 256;

//             data[6] = opcode;

//             data[7] = size / 256;
//             data[8] = size % 256;
//         }

//         makeMusicNotePacket(cubeNo, note, duration) {
//             console.log('g1함수이름:makeMusicNotePacket');
//             const packet = new Uint8Array(9 + 5);
//             this._fillPacketIntoArray(packet, OPCODE.MUSIC, 0xa1, cubeNo, 9 + 5);

//             packet[9] = 0;
//             packet[10] = PROPERTY.MUSIC_PLAY;
//             packet[11] = note - 8;
//             packet[12] = duration;
//             packet[13] = 0;

//             return packet;
//         }

//         makeContStepPacket(cubeNo, speed) {
//             console.log('g1함수이름:makeContStepPacket');
//             const packet = new Uint8Array(9 + 6);

//             this._fillPacketIntoArray(packet, OPCODE.CONTINUOUS_STEPS, 0, cubeNo, 15);

//             const sps = this._calcSpsFromSpeed(speed);

//             packet[9] = MODE.MULTIROLE;
//             packet[10] = METHOD.CONTINOUS;
//             packet[11] = 0; //step_type; full=0, servo=4

//             if (sps == 0) {
//                 packet[12] = PROPERTY.PAUSE;
//                 packet[13] = 0;
//                 packet[14] = 0;
//             } else {
//                 packet[12] = PROPERTY.RESUME;
//                 packet[13] = sps / 256;
//                 packet[14] = sps % 256;
//             }

//             return packet;
//         }

//         _calcSpsFromSpeed(speed_) {
//             console.log('g1함수이름:_calcSpsFromSpeed');
//             let speed = speed_;
//             if (speed > 100) {
//                 speed = 100;
//             }
//             if (speed < -100) {
//                 speed = -100;
//             }

//             let sps = 0;
//             if (speed != 0) {
//                 if (speed < 0) {
//                     sps = 65536 + (speed * 9 - 100);
//                 } else {
//                     sps = speed * 9 + 100;
//                 }
//                 sps = Math.round(sps);
//             }
//             return sps;
//         }

//         monitorTemplate = {
//             imgPath: 'hw_lite/PingpongG1Lite.png',
//             width: 400,
//             height: 400,
//             listPorts: {
//                 BUTTON: {
//                     name: 'button',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 MOVE_X: {
//                     name: 'move_x',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 MOVE_Y: {
//                     name: 'move_y',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 MOVE_Z: {
//                     name: 'move_z',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 TILT_X: {
//                     name: 'tilt_x',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 TILT_Y: {
//                     name: 'tilt_y',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 TILT_Z: {
//                     name: 'tilt_z',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 PROXIMITY: {
//                     name: 'proximity',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//                 AIN: {
//                     name: 'ain',
//                     type: 'input',
//                     pos: { x: 0, y: 0 },
//                 },
//             },
//             ports: {},
//             mode: 'both',
//         };

//         setLanguage() {
//             console.log('g1함수이름:setLanguage');
//             return {
//                 ko: {
//                     template: {
//                         pingpong_lite_g1_when_button_pressed: '%1 큐브 버튼을 눌렀을 때',
//                         pingpong_lite_g1_when_tilted: '%1 큐브를 %2 방향으로 기울였을 때',
//                         pingpong_lite_g1_is_button_pressed: '큐브 버튼이 눌렸는가?',
//                         pingpong_lite_g1_is_tilted: '큐브가 %1 방향으로 기울어졌는가?',
//                         pingpong_lite_g1_get_tilt_value: '%1 방향 큐브 기울기',
//                         pingpong_lite_g1_get_sensor_value: '%1 센서값',
//                         pingpong_lite_g1_motor_rotate: '모터를 %1 방향으로 %2 도 회전하기 %3',
//                         pingpong_lite_g1_start_motor_rotate: '모터의 속도를 %1으로 계속 회전하기 %2',
//                         pingpong_lite_g1_stop_motor_rotate: '모터 멈추기 %1',
//                         pingpong_lite_g1_rotate_servo_mortor: '서보모터를 %1도로 설정하기 %2',
//                         pingpong_lite_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
//                         pingpong_lite_g1_set_dot_pixel: '도트 X:%1 Y:%2 %3 %4',
//                         pingpong_lite_g1_set_dot_string: '도트에 문자열 %1  %2초동안 출력 %3',
//                         pingpong_lite_g1_set_dot_clear: '도트 화면 지우기 %1',
//                         pingpong_lite_g1_playNoteForBeats: '%1 음을 %2 박자로 연주하기 %3',
//                         pingpong_lite_g1_restForBeats: '%1 박자 쉬기 %2',
//                         pingpong_lite_g1_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
//                         pingpong_lite_g1_getTempo: '악보 빠르기',
//                     },
//                     Blocks: {
//                         pingpong_right: '오른쪽',
//                         pingpong_left: '왼쪽',

//                         pingpong_rotate_cw: '시계',
//                         pingpong_rotate_ccw: '반시계',

//                         pingpong_sensor_proximity: '근접',
//                         pingpong_sensor_ain: '아날로그',
//                         pingpong_dot_on: '켜기',
//                         pingpong_dot_off: '끄기',

//                         pingpong_opts_cube_tiltDir: [
//                             ['동그라미', 'F_CIRCLE'],
//                             ['세모', 'B_TRIANGLE'],
//                             ['네모', 'L_RECTANGLE'],
//                             ['별', 'R_STAR'],
//                         ],

//                         pingpong_opts_cube_dir6: [
//                             ['네모', 'DF_RECTANGLE'],
//                             ['별', 'DB_STAR'],
//                             ['세모', 'DL_TRIANGLE'],
//                             ['동그라미', 'DR_CIRCLE'],
//                             ['하트', 'DU_HEART'],
//                             ['빈칸', 'DD_NONE'],
//                         ],

//                         pingpong_opts_music_notes: [
//                             ['라  (A3)', 45],
//                             ['라# (A3#)', 46],
//                             ['시  (B3)', 47],
//                             ['도  (C4)', 48],
//                             ['도# (C4#)', 49],
//                             ['레  (D4)', 50],
//                             ['레# (D4#)', 51],
//                             ['미  (E4)', 52],
//                             ['파  (F4)', 53],
//                             ['파# (F4#)', 54],
//                             ['솔  (G4)', 55],
//                             ['솔# (G4#)', 56],
//                             ['라  (A4)', 57],
//                             ['라# (A4#)', 58],
//                             ['시  (B4)', 59],
//                             ['도  (C5)', 60],
//                             ['도# (C5#)', 61],
//                             ['레  (D5)', 62],
//                             ['레# (D5#)', 63],
//                             ['미  (E5)', 64],
//                             ['파  (F5)', 65],
//                             ['파# (F5#)', 66],
//                             ['솔  (G5)', 67],
//                             ['솔# (G5#)', 68],
//                             ['라  (A5)', 69],
//                             ['라# (A5#)', 70],
//                             ['시  (B5)', 71],
//                             ['도  (C6)', 72],
//                         ],
//                     },
//                 },
//                 en: {
//                     template: {
//                         pingpong_lite_g1_when_button_pressed: '%1 Button pressed',
//                         pingpong_lite_g1_when_tilted: '%1 Tilted to %2',
//                         pingpong_lite_g1_is_button_pressed: 'button pressed?',
//                         pingpong_lite_g1_is_tilted: 'cube tilted to %1',
//                         pingpong_lite_g1_get_tilt_value: 'tilt angle to %1',
//                         pingpong_lite_g1_get_sensor_value: 'read sensor %1',
//                         pingpong_lite_g1_motor_rotate: 'rotate %2 degrees %1 %3',
//                         pingpong_lite_g1_start_motor_rotate: 'set motor speed to %1 %2',
//                         pingpong_lite_g1_stop_motor_rotate: 'stop motor rotate %1',
//                         pingpong_lite_g1_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
//                         pingpong_lite_g1_is_top_shape: '%1 shown in top view?',
//                         pingpong_lite_g1_set_dot_pixel: 'set %3 DOT X:%1 Y:%2 %4',
//                         pingpong_lite_g1_set_dot_string: 'print string %1 during %2 seconds to DOT %3',
//                         pingpong_lite_g1_set_dot_clear: 'clear DOT %1',
//                         pingpong_lite_g1_playNoteForBeats: 'play note %1 for %2 beats %3',
//                         pingpong_lite_g1_restForBeats: 'rest for %1 beats %2',
//                         pingpong_lite_g1_setTempo: 'set tempo to %1 %2',
//                         pingpong_lite_g1_getTempo: 'tempo',
//                     },
//                     Blocks: {
//                         pingpong_right: 'right',
//                         pingpong_left: 'left',

//                         pingpong_rotate_cw: 'clockwise',
//                         pingpong_rotate_ccw: 'counter clockwise',

//                         pingpong_sensor_proximity: 'proximity',
//                         pingpong_sensor_ain: 'ain',
//                         pingpong_dot_on: 'ON',
//                         pingpong_dot_off: 'OFF',

//                         pingpong_opts_cube_tiltDir: [
//                             ['circle', 'F_CIRCLE'],
//                             ['triangle', 'B_TRIANGLE'],
//                             ['rectangle', 'L_RECTANGLE'],
//                             ['star', 'R_STAR'],
//                         ],

//                         pingpong_opts_cube_dir6: [
//                             ['rectangle', 'DF_RECTANGLE'],
//                             ['star', 'DB_STAR'],
//                             ['triangle', 'DL_TRIANGLE'],
//                             ['circle', 'DR_CIRCLE'],
//                             ['heart', 'DU_HEART'],
//                             ['none', 'DD_NONE'],
//                         ],
//                         pingpong_opts_music_notes: [
//                             ['La  (A3)', 45],
//                             ['La# (A3#)', 46],
//                             ['Ti  (B3)', 47],
//                             ['Do  (C4)', 48],
//                             ['Do# (C4#)', 49],
//                             ['Re  (D4)', 50],
//                             ['Re# (D4#)', 51],
//                             ['Mi  (E4)', 52],
//                             ['Fa  (F4)', 53],
//                             ['Fa# (F4#)', 54],
//                             ['Sol (G4)', 55],
//                             ['Sol#(G4#)', 56],
//                             ['La  (A4)', 57],
//                             ['La# (A4#)', 58],
//                             ['Ti  (B4)', 59],
//                             ['Do  (C5)', 60],
//                             ['Do# (C5#)', 61],
//                             ['Re  (D5)', 62],
//                             ['Re# (D5#)', 63],
//                             ['Mi  (E5)', 64],
//                             ['Fa  (F5)', 65],
//                             ['Fa# (F5#)', 66],
//                             ['Sol (G5)', 67],
//                             ['Sol#(G5#)', 68],
//                             ['La  (A5)', 69],
//                             ['La# (A5#)', 70],
//                             ['Ti  (B5)', 71],
//                             ['Do  (C6)', 72],
//                         ],
//                     },
//                 },
//             };
//         }

//         getBlocks() {
//             console.log('g1함수이름:getBlocks');
//             return {
//                 pingpong_lite_g1_when_button_pressed: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_event',
//                     statements: [],
//                     params: [
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/start_icon_hardware.svg',
//                             size: 14,
//                             position: { x: 0, y: -2 },
//                         },
//                     ],
//                     events: {},
//                     def: {
//                         params: [],
//                         type: 'pingpong_lite_g1_when_button_pressed',
//                     },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     event: 'pp_when_button_pressed',
//                     func(sprite, script) {
//                         const pd = Entry.PingpongG1Lite.sensor_data;

//                         if (pd.BUTTON == 1) {
//                             return script.callReturn();
//                         }

//                         return this.die();
//                     },
//                 },
//                 pingpong_lite_g1_when_tilted: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_event',
//                     statements: [],
//                     params: [
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/start_icon_hardware.svg',
//                             size: 14,
//                             position: { x: 0, y: -2 },
//                         },
//                         {
//                             type: 'Dropdown',
//                             options: Lang.Blocks.pingpong_opts_cube_tiltDir,
//                             value: 'F_CIRCLE',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                     ],
//                     events: {},
//                     def: {
//                         params: [null],
//                         type: 'pingpong_lite_g1_when_tilted',
//                     },
//                     paramsKeyMap: {
//                         TILT_DIR: 1,
//                     },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     event: 'pp_when_tilted',
//                     func(sprite, script) {
//                         const tiltDir = script.getStringField('TILT_DIR');
//                         const pd = Entry.PingpongG1Lite.sensor_data;

//                         let tiltValue = 0;
//                         switch (tiltDir) {
//                             case 'F_CIRCLE':
//                                 tiltValue = pd.TILT_X * -1;
//                                 break;
//                             case 'B_TRIANGLE':
//                                 tiltValue = pd.TILT_X;
//                                 break;
//                             case 'L_RECTANGLE':
//                                 tiltValue = pd.TILT_Y * -1;
//                                 break;
//                             case 'R_STAR':
//                                 tiltValue = pd.TILT_Y;
//                                 break;
//                             default:
//                                 break;
//                         }

//                         if (tiltValue >= Entry.PingpongG1Lite.TILT_THRESHOLD) {
//                             return script.callReturn();
//                         } else {
//                             return this.die();
//                         }
//                     },
//                 },
//                 pingpong_lite_g1_is_button_pressed: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_boolean_field',
//                     def: {
//                         type: 'pingpong_lite_g1_is_button_pressed',
//                     },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         const pd = Entry.PingpongG1Lite.sensor_data;
//                         return pd.BUTTON == 1;
//                     },
//                 },
//                 pingpong_lite_g1_is_tilted: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_boolean_field',
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: Lang.Blocks.pingpong_opts_cube_tiltDir,
//                             value: 'F_CIRCLE',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                     ],
//                     def: { params: [], type: 'pingpong_lite_g1_is_tilted' },
//                     paramsKeyMap: {
//                         TILT_DIR: 0,
//                     },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         const tiltDir = script.getStringField('TILT_DIR', script);
//                         const pd = Entry.PingpongG1Lite.sensor_data;
//                         let tiltValue = 0;
//                         switch (tiltDir) {
//                             case 'F_CIRCLE':
//                                 tiltValue = pd.TILT_X * -1;
//                                 break;
//                             case 'B_TRIANGLE':
//                                 tiltValue = pd.TILT_X;
//                                 break;
//                             case 'L_RECTANGLE':
//                                 tiltValue = pd.TILT_Y * -1;
//                                 break;
//                             case 'R_STAR':
//                                 tiltValue = pd.TILT_Y;
//                                 break;
//                             default:
//                                 break;
//                         }
//                         return tiltValue >= Entry.PingpongG1Lite.TILT_THRESHOLD;
//                     },
//                 },
//                 pingpong_lite_g1_get_tilt_value: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_string_field',
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: Lang.Blocks.pingpong_opts_cube_tiltDir,
//                             value: 'F_CIRCLE',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                     ],
//                     events: {
//                         viewAdd: [
//                             function() {
//                                 //console.log('... viewAdd called!');
//                             },
//                         ],
//                         viewDestroy: [
//                             function() {
//                                 //console.log('... viewDestroy called!');
//                             },
//                         ],
//                         dataAdd: [
//                             function(block) {
//                                 //console.log(' ...... dataAdd called');
//                             },
//                         ],
//                         dataDestroy: [
//                             function(block) {
//                                 //console.log(' ...... dataDestroy called');
//                             },
//                         ],
//                     },
//                     def: {
//                         params: [null],
//                         type: 'pingpong_lite_g1_get_tilt_value',
//                     },
//                     paramsKeyMap: { DIR: 0 },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         const dir = script.getStringField('DIR', script);
//                         const pd = Entry.PingpongG1Lite.sensor_data;
//                         let value = 0;
//                         switch (dir) {
//                             case 'F_CIRCLE':
//                                 value = pd.TILT_X * -1;
//                                 break;
//                             case 'B_TRIANGLE':
//                                 value = pd.TILT_X;
//                                 break;
//                             case 'L_RECTANGLE':
//                                 value = pd.TILT_Y * -1;
//                                 break;
//                             case 'R_STAR':
//                                 value = pd.TILT_Y;
//                                 break;
//                             default:
//                                 break;
//                         }
//                         return value;
//                     },
//                 },
//                 pingpong_lite_g1_get_sensor_value: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_string_field',
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: [
//                                 [Lang.Blocks.pingpong_sensor_proximity, 'PROXIMITY'],
//                                 [Lang.Blocks.pingpong_sensor_ain, 'AIN'],
//                             ],
//                             value: 'PROXIMITY',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                     ],
//                     def: { params: [], type: 'pingpong_lite_g1_get_sensor_value' },
//                     paramsKeyMap: { SENSOR: 0 },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         const sensorType = script.getStringField('SENSOR', script);
//                         const pd = Entry.PingpongG1Lite.sensor_data;
//                         let value = 0;
//                         switch (sensorType) {
//                             case 'PROXIMITY':
//                                 value = pd.PROXIMITY;
//                                 break;
//                             case 'AIN':
//                                 value = pd.AIN;
//                                 break;
//                             default:
//                                 break;
//                         }
//                         return value;
//                     },
//                 },
//                 pingpong_lite_g1_is_top_shape: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_boolean_field',
//                     statements: [],
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: Lang.Blocks.pingpong_opts_cube_dir6,
//                             value: 'DF_RECTANGLE',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                     ],
//                     events: {},
//                     def: { params: [], type: 'pingpong_lite_g1_is_top_shape' },
//                     paramsKeyMap: {
//                         TILT_DIR: 0,
//                     },
//                     class: 'PingpongG1',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         const tiltDir = script.getStringField('TILT_DIR', script);
//                         const pd = Entry.PingpongG1Lite.sensor_data;

//                         if (tiltDir == 'DF_RECTANGLE' && pd.TILT_Y > 70) return true;
//                         if (tiltDir == 'DB_STAR' && pd.TILT_Y < -70) return true;
//                         if (tiltDir == 'DR_CIRCLE' && pd.TILT_X > 70) return true;
//                         if (tiltDir == 'DL_TRIANGLE' && pd.TILT_X < -70) return true;
//                         if (tiltDir == 'DD_NONE' && pd.TILT_Z > 70) return true;
//                         if (tiltDir == 'DU_HEART' && pd.TILT_Z < -70) return true;
//                         return false;
//                     },
//                 },
//                 pingpong_lite_g1_motor_rotate: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: [
//                                 [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
//                                 [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
//                             ],
//                             value: 'RIGHT',
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                         {
//                             type: 'Block',
//                             accept: 'string',
//                             defaultType: 'number',
//                         },
//                         { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
//                     ],
//                     def: {
//                         params: [
//                             null,
//                             {
//                                 type: 'number',
//                                 params: ['10'],
//                             },
//                         ],
//                         type: 'pingpong_lite_g1_motor_rotate',
//                     },
//                     paramsKeyMap: { DIR: 0, DEGREE: 1 },
//                     class: 'PingpongG1_motor',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const dir = script.getStringField('DIR');
//                             let degree = script.getNumberValue('DEGREE');

//                             let speed = 800;
//                             if (dir == 'LEFT') {
//                                 speed *= -1;
//                             }

//                             degree = Math.min(Math.max(degree, 0), 5000);

//                             let step = Math.round(degree * 5.5);
//                             if (step > 32768) {
//                                 step = 32768;
//                             }

//                             const opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
//                             const packet = Entry.PingpongG1Lite.makePacket(0xc1, 0x0004, opt); // SETP_MOTOR

//                             packet.writeInt16BE(speed, 13);
//                             packet.writeUInt16BE(step, 17);

//                             const waitTime = Math.round(((1100 - Math.abs(speed)) / 99) * step) + 400;

//                             return [packet, waitTime];
//                         });
//                     },
//                 },

//                 pingpong_lite_g1_start_motor_rotate: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         {
//                             type: 'Block',
//                             accept: 'string',
//                             defaultType: 'number',
//                         },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: {
//                         params: [
//                             {
//                                 type: 'number',
//                                 params: ['100'],
//                             },
//                         ],
//                         type: 'pingpong_lite_g1_start_motor_rotate',
//                     },
//                     paramsKeyMap: { SPEED: 0 },
//                     class: 'PingpongG1_motor',
//                     isNotFor: ['PingpongG1Lite'],
//                     func (sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             let speed = script.getNumberValue('SPEED');
//                             if (speed > 100) {
//                                 speed = 100;
//                             }
//                             if (speed < -100) {
//                                 speed = -100;
//                             }

//                             let sps = 0;
//                             if (speed != 0) {
//                                 if (speed < 0) {
//                                     sps = 65536 + (speed * 9 - 100);
//                                 } else {
//                                     sps = speed * 9 + 100;
//                                 }
//                                 sps = Math.round(sps);
//                             }

//                             const opt = [2, 0, 0, 2, sps / 256, sps % 256];
//                             const packet = Entry.PingpongG1Lite.makePacket(0xcc, 0x0004, opt);

//                             const waitTime = Math.round(((1100 - Math.abs(sps)) / 99) * 10) + 400;
//                             return [packet, waitTime];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_stop_motor_rotate: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: {
//                         params: [],
//                         type: 'pingpong_lite_g1_stop_motor_rotate',
//                     },
//                     paramsKeyMap: {},
//                     class: 'PingpongG1_motor',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const opt = [2, 0, 0, 1, 0, 0];
//                             const packet = Entry.PingpongG1Lite.makePacket(0xcc, 0x0004, opt);
//                             return [packet];
//                         });
//                     },
//                 },

//                 pingpong_lite_g1_rotate_servo_mortor: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         {
//                             type: 'Block',
//                             accept: 'string',
//                             defaultType: 'number',
//                         },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: { params: [{ type: 'angle' }], type: 'pingpong_lite_g1_rotate_servo_mortor' },
//                     paramsKeyMap: { DEGREE: 0 },
//                     class: 'PingpongG1_motor',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             let angle = script.getNumberValue('DEGREE', script);

//                             angle = Math.min(Math.max(angle, 0), 180);

//                             const packet = Entry.PingpongG1Lite.makePacket(0xe1, 0x00, [2, 0, angle, 1]);
//                             return [packet, 400];
//                         });
//                     },
//                 },

//                 pingpong_lite_g1_set_dot_pixel: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
//                         {
//                             type: 'Dropdown',
//                             options: [
//                                 [Lang.Blocks.pingpong_dot_on, 1],
//                                 [Lang.Blocks.pingpong_dot_off, 0],
//                             ],
//                             value: 1,
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: {
//                         params: [null, null, null],
//                         type: 'pingpong_lite_g1_set_dot_pixel',
//                     },
//                     paramsKeyMap: { X: 0, Y: 1, onoff: 2 },
//                     class: 'PingpongG1_peripheral_LED',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             let dotX = script.getNumberValue('X', script);
//                             let dotY = script.getNumberValue('Y', script);
//                             const onoff = script.getNumberField('onoff', script);

//                             dotX = Math.min(Math.max(dotX, 0), 7);
//                             dotY = Math.min(Math.max(dotY, 0), 7);

//                             const packet = Entry.PingpongG1Lite.makePacket(0xa2, 0xe1, [
//                                 0x70,
//                                 dotY,
//                                 dotX,
//                                 onoff,
//                             ]); // turn on
//                             return [packet,500];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_set_dot_string: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         { type: 'Block', accept: 'string', value: 'Hello!' },
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: { params: [null, null], type: 'pingpong_lite_g1_set_dot_string' },
//                     paramsKeyMap: { STR: 0, DURATION: 1 },
//                     class: 'PingpongG1_peripheral_LED',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const str = script.getStringValue('STR', script);
//                             const duration = script.getNumberValue('DURATION', script);

//                             let period = Math.round((duration * 100) / (str.length * 8));
//                             period = Math.min(Math.max(period, 1), 200);

//                             const opt = Buffer.concat([
//                                 Buffer.from([0x70, period, 0]),
//                                 Buffer.from(str.substring(0, 20)),
//                             ]);

//                             const packet = Entry.PingpongG1Lite.makePacket(0xa2, 0xe3, opt);
//                             const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
//                             return [packet, waitTime];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_set_dot_clear: {
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: { params: [], type: 'pingpong_lite_g1_set_dot_clear' },
//                     paramsKeyMap: {},
//                     class: 'PingpongG1_peripheral_LED',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const packet = Entry.PingpongG1Lite.makePacket(0xa2, 0xe3, [0x70, 1, 0, ' ']);
//                             return [packet, 400];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_playNoteForBeats: {
//                     //'%1 번 음을 %2 박자로 연주하기 %3',
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     statements: [],
//                     params: [
//                         {
//                             type: 'Dropdown',
//                             options: Lang.Blocks.pingpong_opts_music_notes,
//                             value: 48,
//                             fontSize: 11,
//                             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
//                             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                         },
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     events: {},
//                     def: { params: [], type: 'pingpong_lite_g1_playNoteForBeats' },
//                     paramsKeyMap: { NOTE: 0, BEATS: 1 },
//                     class: 'PingpongG1_Music',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const NOTE = script.getNumberField('NOTE', script);
//                             const BEATS = script.getNumberValue('BEATS', script);

//                             const cBeats = Entry.PingpongG1Lite._clampBeats(BEATS);
//                             const durationSec = Entry.PingpongG1Lite._beatsToDuration(cBeats);

//                             const waitTime = durationSec * 10 + 60;

//                             const arr = Entry.PingpongG1Lite.makeMusicNotePacket(0, NOTE, durationSec);
//                             const packet = Buffer.from(arr);

//                             return [packet, waitTime];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_restForBeats: {
//                     //'%1 박자 쉬기 %2',
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: { params: [], type: 'pingpong_lite_g1_restForBeats' },
//                     paramsKeyMap: { BEATS: 0 },
//                     class: 'PingpongG1_Music',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.postCallReturn(script, () => {
//                             const BEATS = script.getNumberValue('BEATS', script);

//                             const cBeats = Entry.PingpongG1Lite._clampBeats(BEATS);
//                             const durationSec = Entry.PingpongG1Lite._beatsToDuration(cBeats);

//                             const waitTime = durationSec * 10 + 60;

//                             return [null, waitTime];
//                         });
//                     },
//                 },
//                 pingpong_lite_g1_setTempo: {
//                     //'악보 빠르기를 %1 으로 정하기 %2',
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic',
//                     params: [
//                         { type: 'Block', accept: 'string', defaultType: 'number', value: '60' },
//                         {
//                             type: 'Indicator',
//                             img: 'block_icon/hardware_icon.svg',
//                             size: 12,
//                         },
//                     ],
//                     def: { params: [], type: 'pingpong_lite_g1_setTempo' },
//                     paramsKeyMap: { TEMPO: 0 },
//                     class: 'PingpongG1_Music',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         let tempo = script.getNumberValue('TEMPO', script);
//                         Entry.PingpongG1Lite.tempo = Entry.PingpongG1Lite._clampTempo(tempo);
//                         return script.callReturn();
//                     },
//                 },
//                 pingpong_lite_g1_getTempo: {
//                     //'악보 빠르기',
//                     color: EntryStatic.colorSet.block.default.HARDWARE,
//                     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//                     skeleton: 'basic_string_field',
//                     params: [],
//                     def: { params: [], type: 'pingpong_lite_g1_getTempo' },
//                     paramsKeyMap: {},
//                     class: 'PingpongG1_Music',
//                     isNotFor: ['PingpongG1Lite'],
//                     func(sprite, script) {
//                         return Entry.PingpongG1Lite.tempo;
//                     },
//                 },
//             };
//         }

//     })();
// })();

// module.exports = Entry.PingpongG1Lite;