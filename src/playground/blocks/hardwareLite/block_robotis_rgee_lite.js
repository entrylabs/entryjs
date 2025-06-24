'use strict';

const INST_NONE = 0;
const INST_READ = 2;
const INST_WRITE = 3;
const INST_DXL_SYNCWRITE = 4;
const INST_DXL_REGWRITE = 5;
const INST_DXL_ACTION = 6;
const INST_BYPASS_READ = 0xa2;
const INST_BYPASS_WRITE = 0xa3;

const INST_STATUS = 0x55;

const PACKET_STATE_IDLE = 0;
const PACKET_STATE_RESERVED = 1;
const PACKET_STATE_ID = 2;
const PACKET_STATE_LENGTH_L = 3;
const PACKET_STATE_LENGTH_H = 4;
const PACKET_STATE_DATA = 5;
const PACKET_STATE_CRC_L = 6;
const PACKET_STATE_CRC_H = 7;

const DEFAULT_DELAY = 50;

const rxPacket = {
    header: [0, 0, 0],
    reserved: 0,
    id: 0,
    cmd: 0,
    error: 0,
    type: 0,
    index: 0,
    packetLength: 0,
    paramLength: 0,
    crc: 0,
    crcReceived: 0,
    checksum: 0,
    checksumReceived: 0,
    data: [],
};

const addrMap = [
    [0, 4, 302],
    [4, 1, 42],
    [5, 1, 44],
    [6, 1, 45],
    [7, 1, 47],
    [8, 1, 50],
    [9, 1, 51],
    [10, 1, 52],
    [11, 1, 68],
    [12, 2, 70],
    [14, 2, 72],
    [16, 2, 74],
    [18, 2, 76],
    [20, 2, 78],
    [22, 2, 80],
    [24, 2, 82],
    [26, 2, 84],
    [28, 1, 86],
    [29, 1, 87],
    [30, 2, 88],
    [32, 2, 90],
    [34, 1, 112],
    [35, 1, 118],
    [36, 1, 119],
    [37, 1, 122],
    [38, 1, 123],
    [39, 1, 124],
    [40, 1, 125],
    [41, 1, 160],
    [42, 1, 220],
    [43, 2, 360],
    [45, 2, 362],
    [47, 2, 364],
    [49, 2, 366],
    [51, 2, 368],
    [53, 2, 370],
    [55, 1, 372],
    [56, 1, 373],
    [57, 1, 374],
    [58, 1, 375],
    [59, 1, 376],
    [60, 1, 377],
    [61, 1, 378],
    [62, 1, 379],
    [63, 1, 380],
    [64, 1, 381],
    [65, 1, 382],
    [66, 1, 383],
    [67, 1, 500],
    [68, 1, 501],
    [69, 8, 502],
    [77, 1, 700],
    [78, 1, 810],
    [79, 1, 2134],
    [80, 1, 5015],
    [81, 1, 5030],
    [82, 1, 5031],
    [83, 1, 5040],
];

const addrMap2 = [
    [153, 1, 4000],
    [154, 2, 4003],
    [156, 1, 4005],
    [157, 1, 4006],
    [158, 2, 4009],
    [160, 2, 4011],
    [162, 2, 4013],
    [164, 2, 4015],
    [166, 2, 4017],
    [168, 2, 4019],
    [170, 2, 4021],
    [172, 2, 4023],
    [174, 2, 4025],
    [176, 2, 4027],
    [178, 1, 4031],
    [179, 1, 4032],
    [180, 1, 4033],
    [181, 2, 4036],
    [183, 2, 4038],
    [185, 2, 4040],
    [187, 2, 4042],
    [189, 2, 4044],
    [191, 2, 4046],
    [193, 2, 4048],
    [195, 2, 4050],
];

const crcTable = [
    0x0000, 0x8005, 0x800f, 0x000a, 0x801b, 0x001e, 0x0014, 0x8011, 0x8033, 0x0036, 0x003c, 0x8039,
    0x0028, 0x802d, 0x8027, 0x0022, 0x8063, 0x0066, 0x006c, 0x8069, 0x0078, 0x807d, 0x8077, 0x0072,
    0x0050, 0x8055, 0x805f, 0x005a, 0x804b, 0x004e, 0x0044, 0x8041, 0x80c3, 0x00c6, 0x00cc, 0x80c9,
    0x00d8, 0x80dd, 0x80d7, 0x00d2, 0x00f0, 0x80f5, 0x80ff, 0x00fa, 0x80eb, 0x00ee, 0x00e4, 0x80e1,
    0x00a0, 0x80a5, 0x80af, 0x00aa, 0x80bb, 0x00be, 0x00b4, 0x80b1, 0x8093, 0x0096, 0x009c, 0x8099,
    0x0088, 0x808d, 0x8087, 0x0082, 0x8183, 0x0186, 0x018c, 0x8189, 0x0198, 0x819d, 0x8197, 0x0192,
    0x01b0, 0x81b5, 0x81bf, 0x01ba, 0x81ab, 0x01ae, 0x01a4, 0x81a1, 0x01e0, 0x81e5, 0x81ef, 0x01ea,
    0x81fb, 0x01fe, 0x01f4, 0x81f1, 0x81d3, 0x01d6, 0x01dc, 0x81d9, 0x01c8, 0x81cd, 0x81c7, 0x01c2,
    0x0140, 0x8145, 0x814f, 0x014a, 0x815b, 0x015e, 0x0154, 0x8151, 0x8173, 0x0176, 0x017c, 0x8179,
    0x0168, 0x816d, 0x8167, 0x0162, 0x8123, 0x0126, 0x012c, 0x8129, 0x0138, 0x813d, 0x8137, 0x0132,
    0x0110, 0x8115, 0x811f, 0x011a, 0x810b, 0x010e, 0x0104, 0x8101, 0x8303, 0x0306, 0x030c, 0x8309,
    0x0318, 0x831d, 0x8317, 0x0312, 0x0330, 0x8335, 0x833f, 0x033a, 0x832b, 0x032e, 0x0324, 0x8321,
    0x0360, 0x8365, 0x836f, 0x036a, 0x837b, 0x037e, 0x0374, 0x8371, 0x8353, 0x0356, 0x035c, 0x8359,
    0x0348, 0x834d, 0x8347, 0x0342, 0x03c0, 0x83c5, 0x83cf, 0x03ca, 0x83db, 0x03de, 0x03d4, 0x83d1,
    0x83f3, 0x03f6, 0x03fc, 0x83f9, 0x03e8, 0x83ed, 0x83e7, 0x03e2, 0x83a3, 0x03a6, 0x03ac, 0x83a9,
    0x03b8, 0x83bd, 0x83b7, 0x03b2, 0x0390, 0x8395, 0x839f, 0x039a, 0x838b, 0x038e, 0x0384, 0x8381,
    0x0280, 0x8285, 0x828f, 0x028a, 0x829b, 0x029e, 0x0294, 0x8291, 0x82b3, 0x02b6, 0x02bc, 0x82b9,
    0x02a8, 0x82ad, 0x82a7, 0x02a2, 0x82e3, 0x02e6, 0x02ec, 0x82e9, 0x02f8, 0x82fd, 0x82f7, 0x02f2,
    0x02d0, 0x82d5, 0x82df, 0x02da, 0x82cb, 0x02ce, 0x02c4, 0x82c1, 0x8243, 0x0246, 0x024c, 0x8249,
    0x0258, 0x825d, 0x8257, 0x0252, 0x0270, 0x8275, 0x827f, 0x027a, 0x826b, 0x026e, 0x0264, 0x8261,
    0x0220, 0x8225, 0x822f, 0x022a, 0x823b, 0x023e, 0x0234, 0x8231, 0x8213, 0x0216, 0x021c, 0x8219,
    0x0208, 0x820d, 0x8207, 0x0202,
];

const rb100_last_valid_value = [];
let bg_color = 0;
let beat_per_minute = 75;
let camera_id_for_use = 0;

(function () {
    Entry.RobotisRgeeLite = new (class RobotisRgeeLite {
        constructor() {
            this.id = '070501';
            this.url = 'http://www.robotis.com';
            this.imageName = 'robotis_rgee_lite.png';
            this.name = 'RobotisRgeeLite';
            this.blockMenuBlocks = [
                // 값 블록
                'robotis_rgee_lite_cm_ir_value',
                'robotis_rgee_lite_cm_ir_compare',
                'robotis_rgee_lite_detectFrontObj',
                'robotis_rgee_lite_cm_btn_value',
                'robotis_rgee_lite_cm_joystick_value',
                'robotis_rgee_lite_mic',
                'robotis_rgee_lite_detectSound_compare',
                'robotis_rgee_lite_imu',
                'robotis_rgee_lite_roll_pitch',

                // 음계
                'robotis_rgee_lite_buzzer_index',

                // LCD 제어
                'robotis_rgee_lite_rgee_screen',
                'robotis_rgee_lite_rgee_anim_screen',
                'robotis_rgee_lite_icon',
                'robotis_rgee_lite_LCDBright',
                'robotis_rgee_lite_LCDColor',

                // LED 제어
                'robotis_rgee_lite_led_brightness',
                'robotis_rgee_lite_led_pattern',


                // 소리
                'robotis_rgee_lite_Hello',
                'robotis_rgee_lite_effectSound',
                'robotis_rgee_lite_record',
                'robotis_rgee_lite_playRecord',

                // 다른 로봇 LCD 화면 제어
                'robotis_rgee_lite_rla_screen',
                'robotis_rgee_lite_rla_anim_screen',
                'robotis_rgee_lite_kkokdu_screen',
                'robotis_rgee_lite_kkokdu_anim_screen',
                'robotis_rgee_lite_text_screen',
                
                // 주행 제어
                'robotis_rgee_lite_drive_simple',
                'robotis_rgee_lite_drive_stop',
                'robotis_rgee_lite_motion',
                'robotis_rgee_lite_follow_line',
                'robotis_rgee_lite_stop_follow_line',
            ];
            this.portData = {
                baudRate: 57600,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                connectionType: 'bytestream',
                bufferSize: 128,
                constantServing: true,
            };
            this.duration = 15;
            this.setZero();

            this.timeouts = [];

            this.robotisBuffer = []; // buffer to transmit to H/W
            this.receiveBuffer = []; // buffer to receive from H/W
            this.dataBuffer = []; // saved control table value buffer

            this.packetReceiveState = 0;
            this.headerCount = 0;

            this.dxlPositions = [];

            this.pirPir = [];
            this.pirTemperature = [];
            this.pirHumidity = [];
            this.pirBrightness = [];
            this.distanceDistance = [];
            this.distanceButton = [];
            this.distanceBrightness = [];
        }

        setZero() {
            this.timeouts = [];
            this.__removeAllTimeouts();
            this.robotisBuffer = [];
            this.robotisBuffer.push([INST_WRITE, 21, 2, 7]); // App Coding 모드
            this.robotisBuffer.push([INST_WRITE, 40, 2, 0]); // LED 끄기
            this.robotisBuffer.push([INST_WRITE, 66, 2, 0]); // 모션 종료
            this.robotisBuffer.push([INST_WRITE, 710, 2, 0]); // 바퀴 정지
            this.robotisBuffer.push([INST_WRITE, 21, 2, 20]); // App Coding 모드
            this.robotisBuffer.push([INST_WRITE, 19, 1, 1]); // bypass 모드 켜기
            camera_id_for_use = 0;
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) {
                this.timeouts.splice(idx, 1);
            }
        }

        __removeAllTimeouts() {
            const timeouts = this.timeouts;
            for (const i in timeouts) {
                clearTimeout(timeouts[i]);
            }
            this.timeouts = [];
        }

        getMonitorPort() {
            return { ...this.sensory, ...this.motoring, ...this.lineTracer };
        }

        writePacket(id, address, length, value) {
            if (length > 256) {
                console.log(`######### invalid length: ${length}`);
                return null;
            }
            console.log('######### writePacket');
            const packet = [];
            let i = 0;
            packet.push(0xff);
            packet.push(0xff);
            packet.push(0xfd);
            packet.push(0x00);
            packet.push(id);
            packet.push(length + 5);
            packet.push(0x00);
            packet.push(INST_WRITE);
            packet.push(this.getLowByte(address));
            packet.push(this.getHighByte(address));
            switch (length) {
                case 1:
                    packet.push(this.getLowByte(value));
                    break;
                case 2:
                    packet.push(this.getLowByte(value));
                    packet.push(this.getHighByte(value));
                    break;
                case 4:
                    packet.push(this.getLowByte(this.getLowWord(value)));
                    packet.push(this.getHighByte(this.getLowWord(value)));
                    packet.push(this.getLowByte(this.getHighWord(value)));
                    packet.push(this.getHighByte(this.getHighWord(value)));
                    break;
                default:
                    for (i = 0; i < length; i++) {
                        if (typeof value[i] == 'number') {
                            packet.push(value[i]);
                        } else if (typeof value[i] == 'string') {
                            packet.push(value[i].charCodeAt(0));
                        }
                    }
                    break;
            }
            const crc = this.updateCRC(0, packet, packet.length);
            packet.push(this.getLowByte(crc));
            packet.push(this.getHighByte(crc));
            return packet;
        }

        makeWord(a, b) {
            return (a & 0xff) | ((b & 0xff) << 8);
        }

        getLowByte(a) {
            return a & 0xff;
        }

        getHighByte(a) {
            return (a >> 8) & 0xff;
        }

        getLowWord(a) {
            return a & 0xffff;
        }

        getHighWord(a) {
            return (a >> 16) & 0xffff;
        }

        updateCRC(crcAccum, dataBlkPtr, dataBlkSize) {
            let i = 0;
            let j = 0;
            let crc = crcAccum;

            for (j = 0; j < dataBlkSize; j++) {
                i = ((crc >> 8) ^ dataBlkPtr[j]) & 0xff;
                crc = (crc << 8) ^ crcTable[i];
            }

            return crc;
        }

        removeStuffing(buffer, length) {
            let i = 0;
            let stuffLength = 0;
            let index = 0;

            for (i = 0; i < length; i++) {
                if (i >= 2) {
                    if (buffer[i - 2] == 0xff && buffer[i - 1] == 0xff && buffer[i] == 0xfd) {
                        i++;
                        stuffLength++;
                    }
                }
                buffer[index++] = buffer[i];
            }

            return stuffLength;
        }

        postCallReturn(script, data, ms) {
            /*
            if (data == null) {
                Entry.engine.isContinue = false;
                return script.callReturn();
            } else if (data.length == 0) {
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
            */
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                for (let i = 0; i < data.length; i++) {
                    this.robotisBuffer.push(data[i]);
                }
                //delay ms
                setTimeout(() => {
                    script.timeFlag = 0;
                }, ms);
                return script;
            } else if (script.timeFlag) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        // 값 블록
                        robotis_rgee_lite_cm_ir_value: '%1 번 IR 센서 값',
                        robotis_rgee_lite_cm_ir_compare: '%1 번 IR 센서 값이 %2  %3이면',
                        robotis_rgee_lite_detectFrontObj: '앞에 물체가 있으면',
                        robotis_rgee_lite_cm_btn_value: '%1 버튼이 %2 이면',
                        robotis_rgee_lite_cm_joystick_value:
                            '조이스틱 위치가 %1 이면',
                        robotis_rgee_lite_mic: '마이크 음량(dB)',
                        robotis_rgee_lite_detectSound_compare: '소리가 %1에서 나면',
                        robotis_rgee_lite_imu: '%1축의 %2 값',
                        robotis_rgee_lite_roll_pitch: '제어기 각도 %1 값',

                        // 음계
                        robotis_rgee_lite_buzzer_index: '제어기 음계값 %1 을(를) %2 옥타브로 %3 초 동안 %4 %5',

                        // LCD 제어
                        robotis_rgee_lite_rgee_screen: '제어기 화면 배경을 알쥐 %1 (으)로 선택 %2',
                        robotis_rgee_lite_rgee_anim_screen:
                            '제어기 화면 애니메이션을 알쥐 %1 (으)로 선택 %2',
                        robotis_rgee_lite_icon: 
                            "제어기 화면에 %1 출력하기 %5",
                        robotis_rgee_lite_LCDBright: '제어기 화면 밝기를 %1 (으)로 정하기 %2',
                        robotis_rgee_lite_LCDColor: '제어기 화면 색상을 %1 (으)로 정하기 %2',

                        // LED 제어
                        robotis_rgee_lite_led_brightness: '제어기 %1 LED 밝기를 %2(으)로 정하기 %3',
                        robotis_rgee_lite_led_pattern: '제어기 %1 LED %2 %3',
                        
                        // 소리
                        robotis_rgee_lite_Hello: '%1 말하기 %2',
                        robotis_rgee_lite_effectSound: '효과음 %1 재생하기 %2',
                        robotis_rgee_lite_record: '%1 번 방에 녹음하기 %2',
                        robotis_rgee_lite_playRecord: '%1 번 방 소리 재생하기 %2',

                        // 다른 로봇 LCD 제어
                        robotis_rgee_lite_rla_screen: '제어기 화면 배경을 알라 %1 (으)로 선택 %2',
                        robotis_rgee_lite_rla_anim_screen:
                            '제어기 화면 애니메이션을 알라 %1 (으)로 선택 %2',
                        robotis_rgee_lite_kkokdu_screen: '제어기 화면 배경을 꼭두 %1 (으)로 선택 %2',
                        robotis_rgee_lite_kkokdu_anim_screen:
                            '제어기 화면 애니메이션을 꼭두 %1 (으)로 선택 %2',
                        robotis_rgee_lite_text_screen:
                            '제어기 화면에 %1을(를) (%2, %3)위치에 %4 로 %5(으)로 출력하기 %6',

                            
                        // 주행 제어
                        robotis_rgee_lite_drive_simple: '알쥐 %1 속도로 %2 하기 %3',
                        robotis_rgee_lite_drive_stop: '알쥐 정지하기 %1',
                        robotis_rgee_lite_motion: '알쥐 %1 %2',
                        robotis_rgee_lite_follow_line: '%1 속도로 라인 따라가기 %2',
                        robotis_rgee_lite_stop_follow_line: '라인 따라가기 종료 %1',
                    },
                    Helper: {
                        // 값 블록
                        robotis_rgee_lite_cm_ir_value:
                            '지정한 번호의 IR 센서 값(범위: 0 ~ 400)',
                        robotis_rgee_lite_cm_ir_compare:
                            "지정한 번호의 IR 센서 값과 지정한 값의 비교식이 맞으면 '참', 아니면 '거짓'으로 판단합니다.",
                        robotis_rgee_lite_detectFrontObj:
                            "지정한 센서 앞에 물체가 감지되면 '참', 아니면 '거짓'으로 판단합니다.",
                        robotis_rgee_lite_cm_btn_value:
                            "지정한 버튼이 눌렸다가 해제되면 '참', 아니면 '거짓'으로 판단합니다.",
                        robotis_rgee_lite_cm_joystick_value:
                            "조이스틱 위치가 지정한 상태이면 '참', 아니면 '거짓'으로 판단합니다..",
                        robotis_rgee_lite_mic:
                            '마이크로 감지된 소리의 세기를 데시벨(dB)로 표시합니다.',
                        robotis_rgee_lite_detectSound_compare:
                            "소리가 나는 방향이 지정한 방향과 동일하면 '참', 아니면 '거짓'으로 판단합니다.",
                        robotis_rgee_lite_imu:
                            '지정한 축의 지정한 가속도센서/자이로센서의 값\n범위: -100 ~ 100',
                        robotis_rgee_lite_roll_pitch:
                            'roll/pitch 값\nroll: -180° ~ 180°, pitch: -90° ~ 90°',

                        // 소리
                        robotis_rgee_lite_buzzer_index: '지정한 음계, 옥타브, 시간만큼 연주하기',

                        // LCD 제어
                        robotis_rgee_lite_rgee_screen: '제어기 화면배경을 알쥐의 지정한 표정으로 설정',
                        robotis_rgee_lite_rgee_anim_screen:
                            '제어기 화면 애니메이션을 알쥐의 지정한 표정으로 설정',
                        robotis_rgee_lite_icon:
                            '화면 중앙에 지정한 아이콘을 표시',
                        robotis_rgee_lite_LCDBright: '화면 밝기를 설정\n밝기범위: 1% ~ 100%',
                        robotis_rgee_lite_LCDColor: '화면 색상을 설정',

                        // LED 제어
                        robotis_rgee_lite_led_brightness: '제어기의 지정한 LED의 밝기를 설정정',
                        robotis_rgee_lite_led_pattern: '제어기의 LED의 깜박임 패턴 설정',

                        // 소리
                        robotis_rgee_lite_Hello: '지정한 문장을 말하기',
                        robotis_rgee_lite_effectSound: '지정한 효과음 재생하기',
                        robotis_rgee_lite_record: '제어기의 지정한 번호에 녹음하기',
                        robotis_rgee_lite_playRecord: '제어기의 지정한 번호의 녹음음성 재생하기기',

                        // 다른 로봇 LCD 제어
                        robotis_rgee_lite_rla_screen: '제어기 화면배경을 알라의 지정한 표정으로 설정',
                        robotis_rgee_lite_rla_anim_screen:
                            '제어기 화면 애니메이션을 알라의 지정한 표정으로 설정',
                        robotis_rgee_lite_kkokdu_screen: '제어기 화면배경을 꼭두의 지정한 표정으로 설정',
                        robotis_rgee_lite_kkokdu_anim_screen:
                            '제어기 화면 애니메이션을 꼭두두의 지정한 표정으로 설정',
                        robotis_rgee_lite_text_screen:
                            '화면에 지정한 문구를 표시할 위치와 폰트크기, 색상을 설정\nX좌표: -160 ~ 160\nY좌표: -120 ~ 120',
                            
                        // 주행 제어
                        robotis_rgee_lite_drive_simple: '알쥐를 지정한 속도와 방향으로 주행',
                        robotis_rgee_lite_drive_stop: '알쥐 정지하기',
                        robotis_rgee_lite_motion: '알쥐 지정한 동작을 하기',
                        robotis_rgee_lite_follow_line: '지정한 속도로 라인 따라가기',
                        robotis_rgee_lite_stop_follow_line: '라인 따라가기 종료',

                    },
                    Blocks: {
                        robotis_white: "흰색",
                        robotis_gray: "회색",
                        robotis_darkgray: "진회색",
                        robotis_black: "검정",
                        robotis_purple: "보라",
                        robotis_pink: "분홍색",
                        robotis_red: "빨강",
                        robotis_orange: "주황",
                        robotis_brown: "갈색",
                        robotis_yellow: "노랑",
                        robotis_green: "초록",
                        robotis_blue: "파랑",
                        robotis_lightblue: "연파랑",
                        robotis_darkblue: "남색",
                        robotis_left: "왼쪽",
                        robotis_center: "중앙",
                        robotis_right: "오른쪽",
                        robotis_both: "양쪽",
                        robotis_korean1: "안녕하세요",
                        robotis_korean2: "반가워요",
                        robotis_korean3: "알겠어요",
                        robotis_korean4: "아니에요",
                        robotis_korean5: "모르겠어요",
                        robotis_korean6: "좋아요",
                        robotis_korean7: "싫어요",
                        robotis_korean8: "이름을말하세요",
                        robotis_korean9: "무엇을도와줄까?",
                        robotis_korean10: "잘했어",
                        robotis_korean11: "괜찮아",
                        robotis_korean12: "다시해보자",
                        robotis_korean13: "고마워",
                        robotis_korean14: "다시말해줄래?",
                        robotis_korean15: "최고야!",
                        robotis_korean16: "신나요",
                        robotis_korean17: "즐거워요",
                        robotis_korean18: "미안해요",
                        robotis_korean19: "화나요",
                        robotis_korean20: "부끄러워요",
                        robotis_korean21: "무서워요",
                        robotis_korean22: "속상해요",
                        robotis_korean23: "사랑해요",
                        robotis_korean24: "예뻐요",
                        robotis_korean25: "신기해요",
                        robotis_korean26: "초조해요",
                        robotis_korean27: "앞으로가자",
                        robotis_korean28: "뒤로가자",
                        robotis_korean29: "일어나자",
                        robotis_korean30: "넘어졌네?",
                        robotis_korean31: "오예",
                        robotis_korean32: "아싸",
                        robotis_korean33: "어머",
                        robotis_korean34: "이런",
                        robotis_korean35: "오호",
                        robotis_korean36: "하하하",
                        robotis_korean37: "호호호",
                        robotis_korean38: "졸려",
                        robotis_korean39: "자장가를들려줘",
                        robotis_korean40: "안녕",
                        robotis_korean41: "배고프다",
                        robotis_korean42: "도토리땡긴다",
                        robotis_korean43: "아.씻고싶어",
                        robotis_korean44: "비누목욕시간이야",
                        robotis_korean45: "심심한데",
                        robotis_korean46: "간식먹을까",
                        robotis_korean47: "아파요",
                        robotis_korean48: "약은없나요?",
                        robotis_korean49: "어디로가야하지?",
                        robotis_korean50: "와아도착이다",
                        robotis_korean51: "왼쪽으로가자",
                        robotis_korean52: "오른쪽으로가자",
                        robotis_korean53: "깜짝이야",
                        robotis_korean54: "찾았다",
                        robotis_korean55: "여긴없네",
                        robotis_korean56: "혹시나불렀어?",
                        robotis_korean57: "내려주세요",
                        robotis_korean58: "앗",
                        robotis_korean59: "힝",
                        robotis_korean60: "이익",
                        robotis_dog: "개",
                        robotis_frog: "개구리",
                        robotis_cat: "고양이",
                        robotis_chicken: "닭",
                        robotis_tiger: "호랑이",
                        robotis_mouse: "쥐",
                        robotis_ambul: "앰뷸런스",
                        robotis_Horn: "경적(빵빵)",
                        robotis_siren: "사이렌(경찰차)",
                        robotis_whistle: "호루라기",
                        robotis_gun: "총소리",
                        robotis_clap: "박수소리",
                        robotis_melody1: "멜로디1",
                        robotis_melody2: "멜로디2",
                        robotis_melody3: "멜로디3",
                        robotis_melody4: "멜로디4",
                        robotis_forward: "앞으로",
                        robotis_backward: "뒤로",
                        robotis_acceleration: "가속도",
                        robotis_gyro: "자이로",
                        robotis_run: "실행",
                        robotis_cancel: "취소",
                        robotis_push: "눌림",
                        robotis_notPush: "안눌림",
                        robotis_play: "연주",
                        robotis_rest: "쉼표",
                        robotis_face01: "와하하",
                        robotis_face02: "싱글벙글",
                        robotis_face03: "큭큭큭",
                        robotis_face04: "냠냠",
                        robotis_face05: "겁먹음",
                        robotis_face06: "답답",
                        robotis_face07: "갸우뚱",
                        robotis_face08: "어벙벙",
                        robotis_face09: "고함",
                        robotis_face10: "화남",
                        robotis_face11: "킁킁(왼쪽)",
                        robotis_face12: "킁킁(오른쪽)",
                        robotis_face13: "킁킁(아래)",
                        robotis_face14: "안심",
                        robotis_face15: "기절",
                        robotis_face16: "헤롱헤롱",
                        robotis_face17: "하품",
                        robotis_face18: "졸림",
                        robotis_face19: "잠듦",
                        robotis_face20: "마음앓이",
                        robotis_face21: "폭풍눈물",
                        robotis_face22: "목욕",
                        robotis_face23: "햐트뿅뿅",
        
                        robotis_car_anim01: "기본 표정",
                        robotis_car_anim02: "감동",
                        robotis_car_anim03: "미소",
                        robotis_car_anim04: "웃음",
                        robotis_car_anim05: "기쁨",
                        robotis_car_anim06: "행복",
                        robotis_car_anim07: "자신감",
                        robotis_car_anim08: "화남",
                        robotis_car_anim09: "우울",
                        robotis_car_anim10: "슬픔",
                        robotis_car_anim11: "고통",
                        robotis_car_anim12: "기절",
                        robotis_car_anim13: "공포",
                        robotis_car_anim14: "하품",
                        robotis_car_anim15: "졸림",
                        robotis_car_anim16: "오른쪽보기",
                        robotis_car_anim17: "왼쪽보기",
                        robotis_car_anim18: "앞쪽보기",
                        robotis_car_anim19: "깜짝놀람",
        
                        robotis_flashing1: "점멸1",
                        robotis_flashing2: "점멸2",
                        robotis_flashing3: "점멸3",
                        robotis_flashing4: "점멸4",
                        robotis_flashing5: "점멸5",
                        robotis_flashing6: "점멸6",
                        robotis_flashing7: "점멸7",
                        robotis_flashing8: "점멸8",
                        robotis_flashing9: "점멸9",
                        robotis_moveF: "전진",
                        robotis_moveB: "후진",
                        robotis_moveL: "좌회전",
                        robotis_moveR: "우회전",
                        robotis_moveU: 'U턴',
                        robotis_moveL_in_place: '제자리 좌회전',
                        robotis_moveR_in_place: '제자리 우회전',
                        robotis_moveU_in_place: '제자리 U턴',
                        robotis_moveRG1: "일어서기",
                        robotis_moveRG2: "앉기",
                        robotis_moveRG3: "발버둥",
                        robotis_moveRG4: "발들기",
                        robotis_stMotion1: "기본자세",
                        robotis_stMotion2: "전진",
                        robotis_stMotion3: "우전진",
                        robotis_stMotion4: "좌전진",
                        robotis_stMotion5: "후진",
                        robotis_stMotion6: "오른쪽으로",
                        robotis_stMotion7: "왼쪽으로",
                        robotis_stMotion8: "우회전",
                        robotis_stMotion9: "좌회전",
                        robotis_spMotion1: "오른손 들기",
                        robotis_spMotion2: "오른손 내리기",
                        robotis_spMotion3: "왼손 들기",
                        robotis_spMotion4: "왼손 내리기",
                        robotis_spMotion5: "양손 들기",
                        robotis_spMotion6: "양손 내리기",
                        robotis_spMotion7: "뒤로 넘어지기",
                        robotis_spMotion8: "앞으로 넘어지기",
                        robotis_spMotion9: "앞으로 일어서기",
                        robotis_spMotion10: "뒤로 일어서기",
                        robotis_spMotion11: "방어",
                        robotis_spMotion12: "공격1",
                        robotis_spMotion13: "공격2",
                        robotis_spMotion14: "공격3",
                        robotis_spMotion15: "공격4",
                        robotis_screen1: "가위",
                        robotis_screen2: "바위",
                        robotis_screen3: "보",
                        robotis_screen_text_font_small: "작은 폰트",
                        robotis_screen_text_font_big: "큰 폰트",
                        robotis_sensing_temperature: "온도센서",
                        robotis_sensing_humidity: "습도센서",
                        robotis_sensing_brightness: "밝기센서",
                        robotis_sensing_motion: "움직임센서",
                        robotis_sensing_button: "버튼센서",
                        robotis_sensing_distance: "거리센서",
                        robotis_sensing_ir_left: "왼쪽 적외선센서",
                        robotis_sensing_ir_right: "오른쪽 적외선센서",
                    },
                },
                en: {
                    template: {                        
                        // Value Blocks
                        robotis_rgee_lite_cm_ir_value: 'IR sensor value of No. %1',
                        robotis_rgee_lite_cm_ir_compare: 'If the IR sensor value of No. %1 is %2 %3',
                        robotis_rgee_lite_detectFrontObj: 'If there is an object in front',
                        robotis_rgee_lite_cm_btn_value: 'If button %1 is %2',
                        robotis_rgee_lite_cm_joystick_value: 'If joystick is at %1',
                        robotis_rgee_lite_mic: 'Microphone volume (dB)',
                        robotis_rgee_lite_detectSound_compare: 'If the sound comes from %1',
                        robotis_rgee_lite_imu: '%2 value of %1 axis',
                        robotis_rgee_lite_roll_pitch: 'Controller angle %1 value',

                        // Musical Scale
                        robotis_rgee_lite_buzzer_index: 'Play note %1 on controller in octave %2 for %3 seconds %4 %5',

                        // LCD Control
                        robotis_rgee_lite_rgee_screen: 'Set controller screen background to R-Gee %1 %2',
                        robotis_rgee_lite_rgee_anim_screen: 'Set controller screen animation to R-Gee %1 %2',
                        robotis_rgee_lite_icon: 'Display %1 on controller screen %5',
                        robotis_rgee_lite_LCDBright: 'Set controller screen brightness to %1 %2',
                        robotis_rgee_lite_LCDColor: 'Set controller screen color to %1 %2',

                        // LED Control
                        robotis_rgee_lite_led_brightness: 'Set controller LED %1 brightness to %2 %3',
                        robotis_rgee_lite_led_pattern: 'Controller LED %1 %2 %3',

                        // Sound
                        robotis_rgee_lite_Hello: 'Say "%1" %2',
                        robotis_rgee_lite_effectSound: 'Play sound effect %1 %2',
                        robotis_rgee_lite_record: 'Record in slot %1 %2',
                        robotis_rgee_lite_playRecord: 'Play sound from slot %1 %2',

                        // Other Robot LCD Control
                        robotis_rgee_lite_rla_screen: 'Set controller screen background to Kodala %1 %2',
                        robotis_rgee_lite_rla_anim_screen: 'Set controller screen animation to Kodala %1 %2',
                        robotis_rgee_lite_kkokdu_screen: 'Set controller screen background to TIG %1 %2',
                        robotis_rgee_lite_kkokdu_anim_screen: 'Set controller screen animation to TIG %1 %2',
                        robotis_rgee_lite_text_screen: 'Display "%1" on screen at (%2, %3) with font %4 and color %5 %6',

                        // Driving Control
                        robotis_rgee_lite_drive_simple: 'Move R-Gee at speed %1 in direction %2 %3',
                        robotis_rgee_lite_drive_stop: 'Stop R-Gee %1',
                        robotis_rgee_lite_motion: 'R-Gee %1 %2',
                        robotis_rgee_lite_follow_line: 'Follow line at speed %1 %2',
                        robotis_rgee_lite_stop_follow_line: 'Stop following line %1',
                    },
                    Helper: {
                        // Value blocks
                        robotis_rgee_lite_cm_ir_value: 'IR sensor value of the specified number (Range: 0 ~ 400)',
                        robotis_rgee_lite_cm_ir_compare: "Returns 'true' if the comparison of the IR sensor value of the specified number and the given value is correct; otherwise returns 'false'.",
                        robotis_rgee_lite_detectFrontObj: "Returns 'true' if an object is detected in front of the specified sensor; otherwise returns 'false'.",
                        robotis_rgee_lite_cm_btn_value: "Returns 'true' if the specified button was pressed and released; otherwise returns 'false'.",
                        robotis_rgee_lite_cm_joystick_value: "Returns 'true' if the joystick position matches the specified state; otherwise returns 'false'.",
                        robotis_rgee_lite_mic: 'Displays the intensity of sound detected by the microphone in decibels (dB).',
                        robotis_rgee_lite_detectSound_compare: "Returns 'true' if the direction of the sound matches the specified direction; otherwise returns 'false'.",
                        robotis_rgee_lite_imu: 'Value of the specified axis of the accelerometer/gyroscope sensor\nRange: -100 ~ 100',
                        robotis_rgee_lite_roll_pitch: 'Roll/pitch values\nRoll: -180° ~ 180°, Pitch: -90° ~ 90°',

                        // Sound
                        robotis_rgee_lite_buzzer_index: 'Play the specified scale, octave, and duration',

                        // LCD control
                        robotis_rgee_lite_rgee_screen: 'Set the controller screen background to the specified R-Gee expression',
                        robotis_rgee_lite_rgee_anim_screen: 'Set the controller screen animation to the specified R-Gee expression',
                        robotis_rgee_lite_icon: 'Display the specified icon at the center of the screen',
                        robotis_rgee_lite_LCDBright: 'Set the screen brightness\nBrightness range: 1% ~ 100%',
                        robotis_rgee_lite_LCDColor: 'Set the screen color',

                        // LED control
                        robotis_rgee_lite_led_brightness: 'Set the brightness of the specified LED on the controller',
                        robotis_rgee_lite_led_pattern: 'Set the blinking pattern of the LED on the controller',

                        // Sound
                        robotis_rgee_lite_Hello: 'Speak the specified sentence',
                        robotis_rgee_lite_effectSound: 'Play the specified sound effect',
                        robotis_rgee_lite_record: 'Record on the specified number of the controller',
                        robotis_rgee_lite_playRecord: 'Play the recorded voice of the specified number on the controller',

                        // Other robot LCD control
                        robotis_rgee_lite_rla_screen: 'Set the controller screen background to the specified expression of R-LA',
                        robotis_rgee_lite_rla_anim_screen: 'Set the controller screen animation to the specified expression of R-LA',
                        robotis_rgee_lite_kkokdu_screen: 'Set the controller screen background to the specified expression of Kkokdu',
                        robotis_rgee_lite_kkokdu_anim_screen: 'Set the controller screen animation to the specified expression of Kkokdu',
                        robotis_rgee_lite_text_screen: 'Set the location, font size, and color of the specified phrase to be displayed on the screen\nX coordinate: -160 ~ 160\nY coordinate: -120 ~ 120',

                        // Driving control (duplicate entries for R-Gee)
                        robotis_rgee_lite_drive_simple: 'Drive R-Gee at the specified speed and direction',
                        robotis_rgee_lite_drive_stop: 'Stop R-Gee',
                        robotis_rgee_lite_motion: 'Make R-Gee perform the specified motion',
                        robotis_rgee_lite_follow_line: 'Start following the line at the specified speed',
                        robotis_rgee_lite_stop_follow_line: 'Stop following the line'
                    },

                    Blocks: {
                        robotis_white: 'White',
                        robotis_gray: 'Gray',
                        robotis_darkgray: 'Darkgray',
                        robotis_black: 'Black',
                        robotis_purple: 'Purple',
                        robotis_pink: 'Pink',
                        robotis_red: 'Red',
                        robotis_orange: 'Orange',
                        robotis_brown: 'Brown',
                        robotis_yellow: 'Yellow',
                        robotis_green: 'Green',
                        robotis_blue: 'Blue',
                        robotis_lightblue: 'Lightblue',
                        robotis_darkblue: 'Darkblue',
                        robotis_brown: 'Brown',
                        robotis_left: 'Left',
                        robotis_center: 'Center',
                        robotis_right: 'Right',
                        robotis_both: 'Both',

                        robotis_rgee: 'R-GEE',
                        robotis_rla: 'KODALA',
                        robotis_kkokdu: 'TIG',
                        
                        robotis_korean1: 'Hello!',
                        robotis_korean2: 'Great to see you.',
                        robotis_korean3: 'Okay ~',
                        robotis_korean4: 'No!',
                        robotis_korean5: "I don't know.",
                        robotis_korean6: 'I like it.',
                        robotis_korean7: "I don't like it.",
                        robotis_korean8: 'What is your name? ',
                        robotis_korean9: 'How can I help you? ',
                        robotis_korean10: 'Great job! ',
                        robotis_korean11: "It's alright.",
                        robotis_korean12: "Let's do it again! ",
                        robotis_korean13: 'Thank you! ',
                        robotis_korean14: 'Can you say that one more time?',
                        robotis_korean15: 'Awesome!',
                        robotis_korean16: "I'm excited! ",
                        robotis_korean17: "I'm having a great time! ",
                        robotis_korean18: "I'm sorry.",
                        robotis_korean19: "I'm angry! ",
                        robotis_korean20: "I'm embarassed.",
                        robotis_korean21: "I'm scared.",
                        robotis_korean22: "I'm upset.",
                        robotis_korean23: 'I love you.',
                        robotis_korean24: 'Very pretty! ',
                        robotis_korean25: 'Interesting.',
                        robotis_korean26: "I'm nervous.",
                        robotis_korean27: "Let's move forward! ",
                        robotis_korean28: "Let's move backward! ",
                        robotis_korean29: "Let's stand up! ",
                        robotis_korean30: 'Did you fall down? ',
                        robotis_korean31: 'Oh Yeah~',
                        robotis_korean32: 'Sweet! ',
                        robotis_korean33: 'Oh no',
                        robotis_korean34: 'My My ',
                        robotis_korean35: 'Whoo hoo! ',
                        robotis_korean36: 'Ha Ha Ha',
                        robotis_korean37: 'Ho Ho Ho ',
                        robotis_korean38: "I'm sleepy.",
                        robotis_korean39: 'Sing me a bedtime song! ',
                        robotis_korean40: 'Hello!',
                        robotis_korean41: "I'm hungry.",
                        robotis_korean42: "I'm craving an acorn! ",
                        robotis_korean43: 'I want to take a bath! ',
                        robotis_korean44: 'Time for a bath! ',
                        robotis_korean45: "I'm bored. ",
                        robotis_korean46: 'Do you want a snack? ',
                        robotis_korean47: "I'm sick.",
                        robotis_korean48: 'Do you have any medicine? ',
                        robotis_korean49: 'Where do we have to go? ',
                        robotis_korean50: "We're here! ",
                        robotis_korean51: "Let's go to the left side! ",
                        robotis_korean52: "Let's go to the right side! ",
                        robotis_korean53: 'Oh my, you scared me! ',
                        robotis_korean54: 'Found you! ',
                        robotis_korean55: "There's nothing here. ",
                        robotis_korean56: 'Did you call me?',
                        robotis_korean57: 'Please let me down. ',
                        robotis_korean58: 'Oops! ',
                        robotis_korean59: 'Hmmph! ',
                        robotis_korean60: 'Eek! ',
                        robotis_dog: 'Dog',
                        robotis_frog: 'Frog',
                        robotis_cat: 'Cat',
                        robotis_chicken: 'Rooster',
                        robotis_tiger: 'Tiger',
                        robotis_mouse: 'Mouse',
                        robotis_whistle: 'Whistle',
                        robotis_ambul: 'Ambulance',
                        robotis_Horn: 'CarHorn',
                        robotis_siren: 'Siren',
                        robotis_gun: 'Gunshot',
                        robotis_clap: 'Clap',
                        robotis_melody1: 'Melody1',
                        robotis_melody2: 'Melody2',
                        robotis_melody3: 'Melody3',
                        robotis_melody4: 'Melody4',
                        robotis_forward: 'Forward',
                        robotis_backward: 'Backward',
                        robotis_acceleration: 'acceleration',
                        robotis_gyro: 'gyro',
                        robotis_run: 'Run',
                        robotis_cancel: 'Cancel',
                        robotis_push: 'Pressed',
                        robotis_notPush: 'Unpressed',
                        robotis_play: 'Play',
                        robotis_rest: 'Rest',
                        robotis_face01: 'Haha',
                        robotis_face02: 'Smile',
                        robotis_face03: 'Laugh',
                        robotis_face04: 'Yum Yum',
                        robotis_face05: 'Scared',
                        robotis_face06: 'Uncomfortable',
                        robotis_face07: 'Confused',
                        robotis_face08: 'Dazed',
                        robotis_face09: 'Yell',
                        robotis_face10: 'Angry',
                        robotis_face11: 'Sniff (Left)',
                        robotis_face12: 'Sniff (Right)',
                        robotis_face13: 'Sniff (Down)',
                        robotis_face14: 'Whew',
                        robotis_face15: 'Faint',
                        robotis_face16: 'Dizzy',
                        robotis_face17: 'Yawn',
                        robotis_face18: 'Sleepy',
                        robotis_face19: 'Sleep',
                        robotis_face20: 'Sad',
                        robotis_face21: 'Cry',
                        robotis_face22: 'Bath',
                        robotis_face23: 'Heart-Eyes',
                                
                        robotis_car_anim01: "Default",
                        robotis_car_anim02: "Touched",
                        robotis_car_anim03: "Smile",
                        robotis_car_anim04: "Laugh",
                        robotis_car_anim05: "Joy",
                        robotis_car_anim06: "Happiness",
                        robotis_car_anim07: "Confidence",
                        robotis_car_anim08: "Anger",
                        robotis_car_anim09: "Depressed",
                        robotis_car_anim10: "Sadness",
                        robotis_car_anim11: "Pain",
                        robotis_car_anim12: "Fainting",
                        robotis_car_anim13: "Fear",
                        robotis_car_anim14: "Yawn",
                        robotis_car_anim15: "Sleepy",
                        robotis_car_anim16: "Looking Right",
                        robotis_car_anim17: "Looking Left",
                        robotis_car_anim18: "Looking Forward",
                        robotis_car_anim19: "Surprised",

        
                        robotis_flashing1: "Flashing1",
                        robotis_flashing2: "Flashing2",
                        robotis_flashing3: "Flashing3",
                        robotis_flashing4: "Flashing4",
                        robotis_flashing5: "Flashing5",
                        robotis_flashing6: "Flashing6",
                        robotis_flashing7: "Flashing7",
                        robotis_flashing8: "Flashing8",
                        robotis_flashing9: "Flashing9",



                        robotis_moveF: 'Forward',
                        robotis_moveB: 'Backward',
                        robotis_moveL: 'LeftTurn',
                        robotis_moveR: 'RightTurn',
                        robotis_moveU: 'U-turn',
                        robotis_moveL_in_place: 'Turn left in place',
                        robotis_moveR_in_place: 'Trun right in place',
                        robotis_moveU_in_place: 'U-turn in place',
                        robotis_moveRG1: 'Stand',
                        robotis_moveRG2: 'Sit',
                        robotis_moveRG3: 'Struggle',
                        robotis_moveRG4: 'RaiseFeet',
                        robotis_fast: 'Fast',
                        robotis_normal: 'Normal',
                        robotis_slow: 'Slow',
                        robotis_stop: 'Stop',
                        robotis_roll: 'Left-right rotate angle (roll)',
                        robotis_pitch: 'Forward-backward rotate angle (pitch)',
                        robotis_stMotion1: 'Standard',
                        robotis_stMotion2: 'Forward',
                        robotis_stMotion3: 'TurnRight',
                        robotis_stMotion4: 'TurnLeft',
                        robotis_stMotion5: 'Backward',
                        robotis_stMotion6: 'ToRight',
                        robotis_stMotion7: 'ToLeft',
                        robotis_stMotion8: 'TurnAroundRight',
                        robotis_stMotion9: 'TurnAroundLeft',
                        robotis_spMotion1: 'RightHandUp',
                        robotis_spMotion2: 'RightHandDown',
                        robotis_spMotion3: 'LeftHandUp',
                        robotis_spMotion4: 'LeftHandDown',
                        robotis_spMotion5: 'BothHandsUp',
                        robotis_spMotion6: 'BothHandsDown',
                        robotis_spMotion7: 'FallBackward',
                        robotis_spMotion8: 'FallForward',
                        robotis_spMotion9: 'StandForward',
                        robotis_spMotion10: 'StandBackward',
                        robotis_spMotion11: 'Defence',
                        robotis_spMotion12: 'Offense1',
                        robotis_spMotion13: 'Offense2',
                        robotis_spMotion14: 'Offense3',
                        robotis_spMotion15: 'Offense4',
                        robotis_screen1: 'Sissor',
                        robotis_screen2: 'Rock',
                        robotis_screen3: 'Paper',
                        robotis_screen_text_font_small: "Small font",
                        robotis_screen_text_font_big: "Big font",
                    },
                },
            };
        }
        getBlocks() {
            return {
                robotis_rgee_lite_cm_ir_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '360'],
                                ['2', '362'],
                                ['3', '364'],
                                ['4', '366'],
                                ['5', '368'],
                                ['6', '370'],
                            ],
                            value: '360',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'robotis_rgee_lite_cm_ir_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        const scope = script.executor.scope;

                        const data_default_address = script.getNumberValue('VALUE');

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_default_address];
                        if (result == undefined) {
                            result = rb100_last_valid_value[data_default_address];
                        } else {
                            rb100_last_valid_value[data_default_address] = result;
                        }
                        if (typeof result == 'undefined') {
                            return 0;
                        }
                        return Math.round(result % 65536);
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.ir_value(%1)'],
                    },
                },
                robotis_rgee_lite_cm_ir_compare: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '360'],
                                ['2', '362'],
                                ['3', '364'],
                                ['4', '366'],
                                ['5', '368'],
                                ['6', '370'],
                            ],
                            value: '360',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['>', '0'],
                                ['<', '1'],
                                ['=', '2'],
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
                    ],
                    events: {},
                    def: {
                        params: [null, null, 200],
                        type: 'robotis_rgee_lite_cm_ir_compare',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        COMPARE_OP: 1,
                        COMPARE_VAL: 2,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = script.getNumberValue('VALUE');
                        let compareValue = script.getNumberValue('COMPARE_VAL');
                        let compareOP = script.getNumberValue('COMPARE_OP');

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];

                        if (result == undefined) {
                            return false;
                        }

                        result = Math.round(result % 65536);

                        switch (compareOP) {
                            case 0:
                                return result > compareValue;
                            case 1:
                                return result < compareValue;
                            default:
                                return false;
                        }
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.ir_compare(%1)'],
                    },
                },
                robotis_rgee_lite_detectFrontObj: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [

                    ],
                    events: {},
                    def: {
                        params: [

                        ],
                        type: 'robotis_rgee_lite_detectFrontObj',
                    },
                    paramsKeyMap: {

                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;

                        // instruction / address / length / value / default length
                        let ir_1 = 0;
                        let ir_2 = 0;

                        
                            
                        ir_1 = Entry.RobotisRgeeLite.dataBuffer[360];
                        ir_2 = Entry.RobotisRgeeLite.dataBuffer[362];
                        if (ir_1 == undefined) {
                            ir_1 = 0;
                        }
                        if (ir_2 == undefined) {
                            ir_2 = 0;
                        }
                        return ir_1 > 100 || ir_2 > 100;
                            
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.detectFrontObj()'],
                    },
                },
                robotis_rgee_lite_cm_btn_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_run, '45'],
                                [Lang.Blocks.robotis_cancel, '42'],
                            ],
                            value: '45',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_push, '1'],
                                [Lang.Blocks.robotis_notPush, '0'],
        
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'robotis_rgee_lite_cm_btn_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = script.getNumberValue('VALUE');
                        let compareValue = 1;

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];
                        if (result == undefined) {
                            return false;
                        }

                        return result == compareValue;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.btn_value(%1)'],
                    },
                },
                robotis_rgee_lite_cm_joystick_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_center, '0'],
                                ['←', '1'],
                                ['→', '2'],
                                ['↑', '3'],
                                ['↓', '4'],
                                ['↖', '5'],
                                ['↗', '6'],
                                ['↙', '7'],
                                ['↘', '8'],
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
                        type: 'robotis_rgee_lite_cm_joystick_value',
                    },
                    paramsKeyMap: {
                        COMPARE_VAL: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = 50;
                        let compareValue = script.getNumberValue('COMPARE_VAL', script);

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];
                        if (result == undefined) {
                            return false;
                        }

                        return result == compareValue;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.joystick_value()'],
                    },
                },
                robotis_rgee_lite_mic: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [null],
                        type: 'robotis_rgee_lite_mic',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    async func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = 119;

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];

                        if (typeof result == 'undefined') {
                            return 0;
                        }
                        return result;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.mic()'],
                    },
                },
                robotis_rgee_lite_detectSound_compare: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_right, '255'],
                                [Lang.Blocks.robotis_center, '0'],
                                [Lang.Blocks.robotis_left, '1'],
                            ],
                            value: '255',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'robotis_rgee_lite_detectSound_compare',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = 5031;
                        let compareValue = script.getNumberValue('VALUE');

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];
                        if (result == undefined) {
                            return false;
                        }

                        return result == compareValue;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.detectSound_compare(%1)'],
                    },
                },
                robotis_rgee_lite_imu: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['x', '78'], //72
                                ['y', '80'], //74
                                ['z', '82'], //76
                            ],
                            value: '78',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_acceleration, '0'], //72
                                [Lang.Blocks.robotis_gyro, '6'], //74
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'robotis_rgee_lite_imu',
                    },
                    paramsKeyMap: {
                        AXIS: 0,
                        MODE: 1,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address =
                            script.getField('AXIS', script) - script.getField('MODE', script);

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];

                        if (typeof result == 'undefined') {
                            return 0;
                        }
                        return result;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.imu()'],
                    },
                },
                robotis_rgee_lite_roll_pitch: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_roll, '70'], //72
                                [Lang.Blocks.robotis_pitch, '88'], //74
                            ],
                            value: '70',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'robotis_rgee_lite_roll_pitch',
                    },
                    paramsKeyMap: {
                        AXIS: 0,
                    },
                    class: 'robotis_rgee_lite_value',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        let scope = script.executor.scope;
                        let data_address = script.getNumberValue('AXIS');

                        let result = Entry.RobotisRgeeLite.dataBuffer[data_address];

                        if (typeof result == 'undefined') {
                            return 0;
                        }
                        return result;
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.roll_pitch(%1)'],
                    },
                },

                
                robotis_rgee_lite_buzzer_index: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.General.note_c + '', '1'],
                                [Lang.General.note_c + '#', '2'],
                                [Lang.General.note_d + '', '3'],
                                [Lang.General.note_d + '#', '4'],
                                [Lang.General.note_e + '', '5'],
                                [Lang.General.note_f + '', '6'],
                                [Lang.General.note_f + '#', '7'],
                                [Lang.General.note_g + '', '8'],
                                [Lang.General.note_g + '#', '9'],
                                [Lang.General.note_a + '', '10'],
                                [Lang.General.note_a + '#', '11'],
                                [Lang.General.note_b + '', '12'],
                            ],
                            value: '11',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                            ],
                            value: '4',
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
                                [Lang.Blocks.robotis_play, '1'],
                                [Lang.Blocks.robotis_rest, '2'],
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
                        params: [null, null, 1, null, null],
                        type: 'robotis_rgee_lite_buzzer_index',
                    },
                    paramsKeyMap: {
                        CM_BUZZER_INDEX: 0,
                        CM_BUZZER_OCTAV: 1,
                        CM_BUZZER_DELAY: 2,
                        CM_BUZZER_PLAY: 3
                    },
                    class: 'robotis_rgee_lite_sound',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let cmBuzzerIndex = script.getNumberValue('CM_BUZZER_INDEX', script);
                        let cmBuzzerOffset = script.getNumberValue('CM_BUZZER_OCTAV', script);
                        let cmBuzzerTime = script.getNumberValue('CM_BUZZER_DELAY', script);
                        let cmBuzzerPlay = script.getNumberValue('CM_BUZZER_PLAY', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 0;
                        let data_value = 0;
                        let interval = 0;
                        let data_buf = [];

                        cmBuzzerTime = Math.round(cmBuzzerTime * 1000);

                        data_address = 740;
                        // data_value_1 = cmBuzzerTime * 10;
                        // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초

                        if (cmBuzzerTime < 0) {
                            cmBuzzerTime = 0;
                        }
                        if (cmBuzzerTime > 50000) {
                            cmBuzzerTime = 50000;
                        }

                        data_buf.push(cmBuzzerTime % 256);
                        data_buf.push(Math.floor(cmBuzzerTime / 256));

                        data_value = cmBuzzerIndex + (cmBuzzerOffset - 1) * 12;
                        data_buf.push(Math.floor(data_value));

                        // console.log("buzzer send");
                        let data_sendqueue = [[data_instruction, data_address, 3, data_buf]];

                        if(cmBuzzerPlay == '2') {
                            data_sendqueue = [];
                        }
                        
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            cmBuzzerTime + interval
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.buzzer_index(%1, %2, %3)'],
                    },
                },


                robotis_rgee_lite_rgee_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_face01, '2817'],
                                [Lang.Blocks.robotis_face02, '2818'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face03, '2819'],
                                [Lang.Blocks.robotis_face04, '2820'],
                                [Lang.Blocks.robotis_face05, '2821'],
        
                                [Lang.Blocks.robotis_face06, '2822'],
                                [Lang.Blocks.robotis_face07, '2823'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face08, '2824'],
                                [Lang.Blocks.robotis_face09, '2825'],
                                [Lang.Blocks.robotis_face10, '2826'],
        
                                [Lang.Blocks.robotis_face11, '2827'],
                                [Lang.Blocks.robotis_face12, '2828'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face13, '2829'],
                                
                                [Lang.Blocks.robotis_face14, '2830'],
                                [Lang.Blocks.robotis_face15, '2831'],
                                [Lang.Blocks.robotis_face16, '2832'],
                                [Lang.Blocks.robotis_face17, '2833'],
                                [Lang.Blocks.robotis_face18, '2834'],
        
                                [Lang.Blocks.robotis_face19, '2835'],
                                [Lang.Blocks.robotis_face20, '2836'],
                                [Lang.Blocks.robotis_face21, '2837'],
                                [Lang.Blocks.robotis_face22, '2838'],
                                [Lang.Blocks.robotis_face23, '2839'],
                            ],
                            value: '2817',
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
                        type: 'robotis_rgee_lite_rgee_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 200
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.rgee_screen(%1)'] },
                },

                robotis_rgee_lite_rgee_anim_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_face01, '30748'],
                                [Lang.Blocks.robotis_face02, '30749'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face03, '30750'],
                                [Lang.Blocks.robotis_face04, '30756'],
                                [Lang.Blocks.robotis_face05, '30754'],
        
                                [Lang.Blocks.robotis_face06, '30741'],
                                [Lang.Blocks.robotis_face07, '30747'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face08, '30738'],
                                [Lang.Blocks.robotis_face09, '30740'],
                                [Lang.Blocks.robotis_face10, '30739'],
        
                                [Lang.Blocks.robotis_face11, '30733'],
                                [Lang.Blocks.robotis_face12, '30734'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_face13, '30732'],
                                
                                [Lang.Blocks.robotis_face14, '30757'],
                                [Lang.Blocks.robotis_face15, '30736'],
                                [Lang.Blocks.robotis_face16, '30731'],
                                [Lang.Blocks.robotis_face17, '30742'],
                                [Lang.Blocks.robotis_face18, '30743'],
        
                                [Lang.Blocks.robotis_face19, '30744'],
                                [Lang.Blocks.robotis_face20, '30751'],
                                [Lang.Blocks.robotis_face21, '30752'],
                                [Lang.Blocks.robotis_face22, '30755'],
                                [Lang.Blocks.robotis_face23, '30758'],
                            ],
                            value: '30748',
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
                        type: 'robotis_rgee_lite_rgee_anim_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY //+ 1000
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.rgee_animation_screen(%1)'] },
                },




                robotis_rgee_lite_icon: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_screen1, '11545'],
                                        [Lang.Blocks.robotis_screen2, '11546'],
                                [Lang.Blocks.robotis_screen3, '11547'],
                                ['0', '11283'],
                                ['1', '11284'],
                                ['2', '11285'],
                                ['3', '11286'],
                                ['4', '11287'],
                                ['5', '11288'],
                                ['6', '11289'],
                                ['7', '11290'],
                                ['8', '11291'],
                                ['9', '11292'],
                                ['10', '11293'],
                            ],
                            value: '11545',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            50,
                            null,
                        ],
                        type: 'robotis_rgee_lite_icon',
                    },
                    paramsKeyMap: {
                        ICON: 0,
                        X: 1,
                        Y: 2,
                        SIZE: 3,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let iconNum = script.getField('ICON', script);
                        let x = script.getNumberValue('X', script);
                        let y = script.getNumberValue('Y', script);
                        let size = script.getNumberValue('SIZE', script) * 2;

                        let data_instruction = INST_WRITE;
                        let data_address = 166;
                        let data_length = 2;
                        let data_value = 10496;

                        if (x < -160) {
                            x = -160;
                        } else if (x > 160) {
                            x = 160;
                        }

                        if (y < -120) {
                            y = -120;
                        } else if (y > 120) {
                            y = 120;
                        }

                        if (size < 0) {
                            size = 0;
                        } else if (size > 400) {
                            size = 400;
                        }

                        data_value = iconNum;

                        let data_sendqueue = [
                            [INST_WRITE, 130, 2, x],
                            [INST_WRITE, 132, 2, y],
                            [INST_WRITE, 149, 2, size],
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 200
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.icon_screen(%1,%2,%3,%4)'],
                    },
                },


                robotis_rgee_lite_LCDBright: {
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
                        params: [10],
                        type: 'robotis_rgee_lite_LCDBright',
                    },
                    paramsKeyMap: {
                        BRIGHT: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let bright = script.getNumberValue('BRIGHT', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 180;
                        let data_length = 1;
                        let data_value = 0;

                        bright = Math.min(Math.max(bright, 0), 100);

                        data_value = bright;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.LCDBright(%1)'],
                    },
                },
                robotis_rgee_lite_LCDColor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_red, '224'],
                                [Lang.Blocks.robotis_orange, '244'],
                                [Lang.Blocks.robotis_yellow, '252'],
                                [Lang.Blocks.robotis_green, '28'],
                                [Lang.Blocks.robotis_blue, '3'],
                                [Lang.Blocks.robotis_darkblue, '2'],
                                [Lang.Blocks.robotis_purple, '130'],
                                [Lang.Blocks.robotis_brown, '173'],
                                [Lang.Blocks.robotis_black, '0'],
                                [Lang.Blocks.robotis_white, '255'],
                            ],
                            value: '224',
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
                        type: 'robotis_rgee_lite_LCDColor',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let color = script.getNumberValue('COLOR', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = 0;

                        data_value = color;
                        bg_color = color;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 100
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.LCDColor(%1)'],
                    },
                },

                robotis_rgee_lite_led_brightness: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_left, '1'],
                                [Lang.Blocks.robotis_right, '2'],
                                [Lang.Blocks.robotis_both, '3'],
                            ],
                            value: '1',
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
                                params: [100]
                            }
                        ],
                        type: 'robotis_rgee_lite_led_brightness',
                    },
                    paramsKeyMap: {
                        RB_LED: 0,
                        BRIGHT: 1,
                    },
                    class: 'robotis_rgee_lite_led',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let cmLed = script.getNumberValue('RB_LED', script);
                        let bright = script.getNumberValue('BRIGHT', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 0;
                        let data_length = 1;
                        let data_value = 0;
                        
                        if(bright < 0){ 
                            bright = 0;
                        } else if(bright > 100) {
                            bright = 100
                        }
                        data_value = 100+bright;

                        if (cmLed == 1) {
                            data_address = 40;
                            data_length = 1;
                        } else if (cmLed == 2) {
                            data_address = 41;
                            data_length = 1;
                        } else if (cmLed == 3) {
                            data_address = 40;
                            data_length = 2;
                            data_value = data_value * 257
                        }

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.led_brightness(%1, %2)'] },
                },
                robotis_rgee_lite_led_pattern: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_flashing1, '11'],
                                [Lang.Blocks.robotis_flashing2, '12'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_flashing3, '13'],
        
                                [Lang.Blocks.robotis_flashing4, '21'],
                                [Lang.Blocks.robotis_flashing5, '22'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_flashing6, '23'],
        
                                [Lang.Blocks.robotis_flashing7, '31'],
                                [Lang.Blocks.robotis_flashing8, '32'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_flashing9, '33'],
        
                            ],
                            value: '11',
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
                        type: 'robotis_rgee_lite_led_pattern',
                    },
                    paramsKeyMap: {
                        RB_LED: 0,
                        VALUE: 1,
                    },
                    class: 'robotis_rgee_lite_led',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let cmLed = script.getNumberValue('RB_LED', script);
                        let value = script.getNumberValue('VALUE', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 40;
                        let data_length = 1;
                        let data_value = 0;

                        data_value = value * cmLed;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.led_pattern(%1, %2)'] },
                },

                

                robotis_rgee_lite_Hello: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_korean1, '0'],
                                [Lang.Blocks.robotis_korean2, '1'],
                                [Lang.Blocks.robotis_korean3, '2'],
                                [Lang.Blocks.robotis_korean4, '3'],
                                [Lang.Blocks.robotis_korean5, '4'],
                                [Lang.Blocks.robotis_korean6, '5'],
                                [Lang.Blocks.robotis_korean7, '6'],
                                [Lang.Blocks.robotis_korean8, '7'],
                                [Lang.Blocks.robotis_korean9, '8'],
                                [Lang.Blocks.robotis_korean10, '9'],
                                [Lang.Blocks.robotis_korean11, '10'],
                                [Lang.Blocks.robotis_korean12, '11'],
                                [Lang.Blocks.robotis_korean13, '12'],
                                [Lang.Blocks.robotis_korean14, '13'],
                                [Lang.Blocks.robotis_korean15, '14'],
                                [Lang.Blocks.robotis_korean16, '15'],
                                [Lang.Blocks.robotis_korean17, '16'],
                                [Lang.Blocks.robotis_korean18, '17'],
                                [Lang.Blocks.robotis_korean19, '18'],
                                [Lang.Blocks.robotis_korean20, '19'],
                                [Lang.Blocks.robotis_korean21, '20'],
                                [Lang.Blocks.robotis_korean22, '21'],
                                [Lang.Blocks.robotis_korean23, '22'],
                                [Lang.Blocks.robotis_korean24, '23'],
                                [Lang.Blocks.robotis_korean25, '24'],
                                [Lang.Blocks.robotis_korean26, '25'],
                                [Lang.Blocks.robotis_korean27, '26'],
                                [Lang.Blocks.robotis_korean28, '27'],
                                [Lang.Blocks.robotis_korean29, '28'],
                                [Lang.Blocks.robotis_korean30, '29'],
                                [Lang.Blocks.robotis_korean31, '30'],
                                [Lang.Blocks.robotis_korean32, '31'],
                                [Lang.Blocks.robotis_korean33, '32'],
                                [Lang.Blocks.robotis_korean34, '33'],
                                [Lang.Blocks.robotis_korean35, '34'],
                                [Lang.Blocks.robotis_korean36, '35'],
                                [Lang.Blocks.robotis_korean37, '36'],
                                [Lang.Blocks.robotis_korean38, '37'],
                                [Lang.Blocks.robotis_korean39, '38'],
                                [Lang.Blocks.robotis_korean40, '39'],
                                [Lang.Blocks.robotis_korean41, '40'],
                                [Lang.Blocks.robotis_korean42, '41'],
                                [Lang.Blocks.robotis_korean43, '42'],
                                [Lang.Blocks.robotis_korean44, '43'],
                                [Lang.Blocks.robotis_korean45, '44'],
                                [Lang.Blocks.robotis_korean46, '45'],
                                [Lang.Blocks.robotis_korean47, '46'],
                                [Lang.Blocks.robotis_korean48, '47'],
                                [Lang.Blocks.robotis_korean49, '48'],
                                [Lang.Blocks.robotis_korean50, '49'],
                                [Lang.Blocks.robotis_korean51, '50'],
                                [Lang.Blocks.robotis_korean52, '51'],
                                [Lang.Blocks.robotis_korean53, '52'],
                                [Lang.Blocks.robotis_korean54, '53'],
                                [Lang.Blocks.robotis_korean55, '54'],
                                [Lang.Blocks.robotis_korean56, '55'],
                                [Lang.Blocks.robotis_korean57, '56'],
                                [Lang.Blocks.robotis_korean58, '57'],
                                [Lang.Blocks.robotis_korean59, '58'],
                                [Lang.Blocks.robotis_korean60, '59'],
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
                        params: [null],
                        type: 'robotis_rgee_lite_Hello',
                    },
                    paramsKeyMap: {
                        HELLO: 0,
                    },
                    class: 'robotis_rgee_lite_sound',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let cmHello = script.getField('HELLO', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 110;
                        let data_length = 2;
                        let data_value = 0;

                        data_value = 25601 + Number(cmHello);

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [data_instruction, 0, 2, 0],
                        ];

                        let extraTime = 0;

                        if (cmHello == '38' || cmHello == '55') {
                            extraTime = 2000;
                        }

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            2000 + extraTime
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.speak(%1)'],
                    },
                },
                robotis_rgee_lite_effectSound: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_dog, '0'],
                                [Lang.Blocks.robotis_frog, '1'],
                                [Lang.Blocks.robotis_cat, '2'],
                                [Lang.Blocks.robotis_chicken, '7'],
                                [Lang.Blocks.robotis_tiger, '19'],
                                [Lang.Blocks.robotis_mouse, '17'],

                                [Lang.Blocks.robotis_ambul, '773'],
                                [Lang.Blocks.robotis_Horn, '781'],
                                [Lang.Blocks.robotis_siren, '774'],
                                [Lang.Blocks.robotis_whistle, '274'],
                                [Lang.Blocks.robotis_gun, '775'],
                                [Lang.Blocks.robotis_clap, '260'],

                                [Lang.Blocks.robotis_melody1, '786'],
                                [Lang.Blocks.robotis_melody2, '787'],
                                [Lang.Blocks.robotis_melody3, '788'],
                                [Lang.Blocks.robotis_melody4, '789'],
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
                        params: [null],
                        type: 'robotis_rgee_lite_effectSound',
                    },
                    paramsKeyMap: {
                        HELLO: 0,
                    },
                    class: 'robotis_rgee_lite_sound',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let cmHello = script.getField('HELLO', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 110;
                        let data_length = 2;
                        let data_value = 0;

                        data_value = Number(cmHello);

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [data_instruction, 0, 2, 0],
                        ];

                        let extraTime = 0;
                        if (
                            cmHello == '272' ||
                            cmHello == '786' ||
                            cmHello == '787' ||
                            cmHello == '788' ||
                            cmHello == '789'
                        ) {
                            //오리
                            extraTime = 0;
                            if (cmHello == '788' || cmHello == '789') {
                                extraTime += 500;
                            }
                        }
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            3000 + extraTime
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.effect_sound(%1)'],
                    },
                },
                robotis_rgee_lite_record: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '0'],
                                ['2', '1'],
                                ['3', '2'],
                                ['4', '3'],
                                ['5', '4'],
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
                        params: [null],
                        type: 'robotis_rgee_lite_record',
                    },
                    paramsKeyMap: {
                        ROOM: 0,
                    },
                    class: 'robotis_rgee_lite_sound',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let roomNum = script.getField('ROOM', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 115;
                        let data_length = 1;
                        let data_value = 0;

                        data_value = roomNum;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            6000
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.record(%1)'],
                    },
                },
                robotis_rgee_lite_playRecord: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '0'],
                                ['2', '1'],
                                ['3', '2'],
                                ['4', '3'],
                                ['5', '4'],
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
                        params: [null],
                        type: 'robotis_rgee_lite_playRecord',
                    },
                    paramsKeyMap: {
                        ROOM: 0,
                    },
                    class: 'robotis_rgee_lite_sound',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let roomNum = script.getField('ROOM', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 116;
                        let data_length = 1;
                        let data_value = 0;

                        data_value = roomNum;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            6000
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.playRecord(%1)'],
                    },
                },



                
                robotis_rgee_lite_rla_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_car_anim01, '3329'],
                                [Lang.Blocks.robotis_car_anim02, '3330'],
                                [Lang.Blocks.robotis_car_anim03, '3331'],
                                [Lang.Blocks.robotis_car_anim04, '3332'],
                                [Lang.Blocks.robotis_car_anim05, '3333'],
        
                                [Lang.Blocks.robotis_car_anim06, '3334'],
                                [Lang.Blocks.robotis_car_anim07, '3335'], 
                                [Lang.Blocks.robotis_car_anim08, '3336'],
                                [Lang.Blocks.robotis_car_anim09, '3337'],
                                [Lang.Blocks.robotis_car_anim10, '3338'],
        
                                [Lang.Blocks.robotis_car_anim11, '3339'],
                                [Lang.Blocks.robotis_car_anim12, '3340'], 
                                [Lang.Blocks.robotis_car_anim13, '3341'],
                                [Lang.Blocks.robotis_car_anim14, '3342'],
                                [Lang.Blocks.robotis_car_anim15, '3343'],
        
                                [Lang.Blocks.robotis_car_anim16, '3344'],
                                [Lang.Blocks.robotis_car_anim17, '3345'], 
                                [Lang.Blocks.robotis_car_anim18, '3346'],
                                [Lang.Blocks.robotis_car_anim19, '3347'],
                            ],
                            value: '3329',
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
                        type: 'robotis_rgee_lite_rla_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 200
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.rla_screen(%1)'] },
                },

                robotis_rgee_lite_rla_anim_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_car_anim01, '30978'],
                                [Lang.Blocks.robotis_car_anim02, '30981'],
                                [Lang.Blocks.robotis_car_anim03, '30982'],
                                [Lang.Blocks.robotis_car_anim04, '30983'],
                                [Lang.Blocks.robotis_car_anim05, '30984'],
        
                                [Lang.Blocks.robotis_car_anim06, '30985'],
                                [Lang.Blocks.robotis_car_anim07, '30986'], 
                                [Lang.Blocks.robotis_car_anim08, '30987'],
                                [Lang.Blocks.robotis_car_anim09, '30988'],
                                [Lang.Blocks.robotis_car_anim10, '30989'],
        
                                [Lang.Blocks.robotis_car_anim11, '30990'],
                                [Lang.Blocks.robotis_car_anim12, '30991'], 
                                [Lang.Blocks.robotis_car_anim13, '30992'],
                                [Lang.Blocks.robotis_car_anim14, '30993'],
                                [Lang.Blocks.robotis_car_anim15, '30994'],
        
                                [Lang.Blocks.robotis_car_anim16, '30995'],
                                [Lang.Blocks.robotis_car_anim17, '30996'], 
                                [Lang.Blocks.robotis_car_anim18, '30997'],
                                [Lang.Blocks.robotis_car_anim19, '30998'],
                            ],
                            value: '30978',
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
                        type: 'robotis_rgee_lite_rla_anim_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY //+ 1000
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.rla_animation_screen(%1)'] },
                },
                
                robotis_rgee_lite_kkokdu_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_car_anim01, '3585'],
                                [Lang.Blocks.robotis_car_anim02, '3586'],
                                [Lang.Blocks.robotis_car_anim03, '3587'],
                                [Lang.Blocks.robotis_car_anim04, '3588'],
                                [Lang.Blocks.robotis_car_anim05, '3589'],
        
                                [Lang.Blocks.robotis_car_anim06, '3590'],
                                [Lang.Blocks.robotis_car_anim07, '3591'], 
                                [Lang.Blocks.robotis_car_anim08, '3592'],
                                [Lang.Blocks.robotis_car_anim09, '3593'],
                                [Lang.Blocks.robotis_car_anim10, '3594'],
        
                                [Lang.Blocks.robotis_car_anim11, '3595'],
                                [Lang.Blocks.robotis_car_anim12, '3596'], 
                                [Lang.Blocks.robotis_car_anim13, '3597'],
                                [Lang.Blocks.robotis_car_anim14, '3598'],
                                [Lang.Blocks.robotis_car_anim15, '3599'],
        
                                [Lang.Blocks.robotis_car_anim16, '3600'],
                                [Lang.Blocks.robotis_car_anim17, '3601'], 
                                [Lang.Blocks.robotis_car_anim18, '3602'],
                                [Lang.Blocks.robotis_car_anim19, '3603'],
                            ],
                            value: '3585',
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
                        type: 'robotis_rgee_lite_kkokdu_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 200
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.kkokdu_screen(%1)'] },
                },

                robotis_rgee_lite_kkokdu_anim_screen: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_car_anim01, '31234'],
                                [Lang.Blocks.robotis_car_anim02, '31237'],
                                [Lang.Blocks.robotis_car_anim03, '31238'],
                                [Lang.Blocks.robotis_car_anim04, '31239'],
                                [Lang.Blocks.robotis_car_anim05, '31240'],
        
                                [Lang.Blocks.robotis_car_anim06, '31241'],
                                [Lang.Blocks.robotis_car_anim07, '31242'], 
                                [Lang.Blocks.robotis_car_anim08, '31243'],
                                [Lang.Blocks.robotis_car_anim09, '31244'],
                                [Lang.Blocks.robotis_car_anim10, '31245'],
        
                                [Lang.Blocks.robotis_car_anim11, '31246'],
                                [Lang.Blocks.robotis_car_anim12, '31247'], 
                                [Lang.Blocks.robotis_car_anim13, '31248'],
                                [Lang.Blocks.robotis_car_anim14, '31249'],
                                [Lang.Blocks.robotis_car_anim15, '31250'],
        
                                [Lang.Blocks.robotis_car_anim16, '31251'],
                                [Lang.Blocks.robotis_car_anim17, '31252'], 
                                [Lang.Blocks.robotis_car_anim18, '31253'],
                                [Lang.Blocks.robotis_car_anim19, '31254'],
                            ],
                            value: '31234',
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
                        type: 'robotis_rgee_lite_kkokdu_anim_screen',
                    },
                    paramsKeyMap: {
                        BACKGROUND: 0,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let screenValue = script.getNumberValue('BACKGROUND', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 163;
                        let data_length = 2;
                        let data_value = screenValue;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY //+ 1000
                        );
                    },
                    syntax: { js: [], py: ['RgeeLite.kkokdu_animation_screen(%1)'] },
                },
                robotis_rgee_lite_text_screen: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_screen_text_font_small, '0'],
                                [Lang.Blocks.robotis_screen_text_font_big, '1'],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_red, '224'],
                                [Lang.Blocks.robotis_orange, '244'],
                                [Lang.Blocks.robotis_yellow, '252'],
                                [Lang.Blocks.robotis_green, '28'],
                                [Lang.Blocks.robotis_blue, '3'],
                                [Lang.Blocks.robotis_darkblue, '2'],
                                [Lang.Blocks.robotis_purple, '130'],
                                [Lang.Blocks.robotis_brown, '173'],
                                [Lang.Blocks.robotis_black, '0'],
                                [Lang.Blocks.robotis_white, '255'],
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
                        params: [
                            ' ',
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            null,
                            null,
                        ],
                        type: 'robotis_rgee_lite_text_screen',
                    },
                    paramsKeyMap: {
                        TEXT: 0,
                        X: 1,
                        Y: 2,
                        FONT: 3,
                        COLOR: 4,
                    },
                    class: 'robotis_rgee_lite_lcd',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let text = script.getStringValue('TEXT', script);
                        let x = script.getNumberValue('X', script);
                        let y = script.getNumberValue('Y', script);
                        let font = script.getNumberValue('FONT', script);
                        let color = script.getNumberValue('COLOR', script);
                        let data_buf = [];
                        let i = 0;

                        let data_instruction = INST_WRITE;
                        let data_address = 900;
                        let data_length = 2;

                        if (x < -160) {
                            x = -160;
                        } else if (x > 160) {
                            x = 160;
                        }

                        if (y < -120) {
                            y = -120;
                        } else if (y > 120) {
                            y = 120;
                        }

                        let encoder = new TextEncoder('utf-8');
                        let byteArray = encoder.encode(text);

                        data_buf.push(x % 256);
                        data_buf.push(Math.floor(x / 256));
                        data_buf.push(y % 256);
                        data_buf.push(Math.floor(y / 256));
                        data_buf.push(font);
                        data_buf.push(0);
                        data_buf.push(0);
                        data_buf.push(color);
                        data_buf.push(byteArray.length);
                        for (i = 0; i < byteArray.length; i++) {
                            data_buf.push(byteArray[i]);
                        }

                        data_length = 9 + byteArray.length;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, data_buf],
                            [INST_WRITE, 162, 1, 1],
                        ];

                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY + 200
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.text_screen(%1,%2,%3,%4,%5)'],
                    },
                },


                
                robotis_rgee_lite_drive_simple: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_moveF, '1'],
                                [Lang.Blocks.robotis_moveB, '2'],
                                [Lang.Blocks.robotis_moveL, '3'],
                                [Lang.Blocks.robotis_moveR, '4'],
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
                        params: [10, null, null],
                        type: 'robotis_rgee_lite_drive_simple',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                        DIRECTION: 1,
                    },
                    class: 'robotis_rgee_lite_move',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        const speed = script.getNumberValue('SPEED', script);
                        const direction = script.getField('DIRECTION', script);

                        const data_instruction = INST_WRITE;
                        const data_address = 710;
                        const data_length = 2;
                        let data_value = 0;

                        switch (direction) {
                            case '1':
                                data_value = speed * 256 + speed;
                                break;
                            case '2':
                                data_value = (256 - speed) * 256 + (256 - speed);
                                break;
                            case '3':
                                data_value = speed * 256 + (256 - speed);
                                break;
                            case '4':
                                data_value = (256 - speed) * 256 + speed;
                                break;
                            default:
                                data_value = 0;
                                break;
                        }

                        const data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.go_simple(%1, %2)'],
                    },
                },
                
                robotis_rgee_lite_drive_stop: {
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
                        type: 'robotis_rgee_lite_drive_stop',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'robotis_rgee_lite_move',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length

                        let data_instruction = INST_WRITE;
                        let data_address = 710;
                        let data_length = 2;
                        let data_value = 0;

                        let data_sendqueue = [
                            [data_instruction, 5200, 1, 0],
                            [data_instruction, data_address, data_length, data_value],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.stop(%1, %2)'],
                    },
                },
                robotis_rgee_lite_motion: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.robotis_moveRG1, '50007'],
                                [Lang.Blocks.robotis_moveRG2, '50008'], //Lang.Blocks.robotis_robotis_common_green_color
                                [Lang.Blocks.robotis_moveRG3, '50071'],
                                [Lang.Blocks.robotis_moveRG4, '50072'],
                            ],
                            value: '50007',
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
                        type: 'robotis_rgee_lite_motion',
                    },
                    paramsKeyMap: {
                        MotionNumber: 0,
                    },
                    class: 'robotis_rgee_lite_move',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        const data_instruction = INST_WRITE;
                        const data_address = 66;
                        const data_length = 2;
                        let data_value = script.getField('MotionNumber', script);

                        const data_sendqueue = [
                            [data_instruction, data_address, data_length, data_value],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            data_value > 50070 ? 2000 : 1000 
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.run_motion(%1)'],
                    },
                },
                robotis_rgee_lite_follow_line: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1단계', '1'],
                                ['2단계', '2'],
                                ['3단계', '3'],
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
                        params: [null, null],
                        type: 'robotis_rgee_lite_follow_line',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'robotis_rgee_lite_move',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length
                        let speed_level = script.getNumberValue('SPEED', script);

                        let data_instruction = INST_WRITE;
                        let data_address = 5200;
                        let data_length = 1;

                        let data_sendqueue = [
                            [data_instruction, data_address, data_length, speed_level],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.follow_line(%1)'],
                    },
                },

                robotis_rgee_lite_stop_follow_line: {
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
                        type: 'robotis_rgee_lite_stop_follow_line',
                    },
                    paramsKeyMap: {
                    },
                    class: 'robotis_rgee_lite_move',
                    isNotFor: ['RobotisRgeeLite'],
                    func(sprite, script) {
                        // instruction / address / length / value / default length

                        let data_instruction = INST_WRITE;
                        let data_address = 710;
                        let data_length = 2;
                        let data_value = 0;

                        let data_sendqueue = [
                            [data_instruction, 5200, 1, 0],
                            [data_instruction, data_address, data_length, data_value],
                        ];
                        return Entry.RobotisRgeeLite.postCallReturn(
                            script,
                            data_sendqueue,
                            DEFAULT_DELAY
                        );
                    },
                    syntax: {
                        js: [],
                        py: ['RgeeLite.stop_follow_line()'],
                    },
                },

//////////////////////////////////////////////////////////////////////////////////////////////////////////
            };
        }

        requestLocalData() {
            let packets = [];
            while (this.robotisBuffer.length > 0) {
                const data = this.robotisBuffer.shift();
                const instruction = data[0];
                const address = data[1];
                const length = data[2];
                const value = data[3];
                const dataBuffer = data[4];
                let id = 0;
                let packet = null;

                switch (instruction) {
                    case INST_WRITE:
                        id = 200;
                        packet = this.writePacket(id, address, length, value);
                        break;
                    case INST_BYPASS_WRITE:
                        id = value;
                        packet = this.writePacket(id, address, length, dataBuffer);
                        break;
                }

                if (packet !== null && Array.isArray(packet)) {
                    packets.push(...packet);
                }
            }
            return packets;
        }

        handleLocalData(data) {
            let stuffLength = 0;
            //console.log(`length: ${data.length}`);
            for (let i = 0; i < data.length; i++) {
                //this.receiveBuffer.push(data[i]);
                const dataIn = data[i];

                switch (this.packetReceiveState) {
                    case PACKET_STATE_IDLE:
                        if (this.headerCount >= 2) {
                            rxPacket.header[2] = dataIn;

                            if (
                                rxPacket.header[0] == 0xff &&
                                rxPacket.header[1] == 0xff &&
                                rxPacket.header[2] == 0xfd
                            ) {
                                this.headerCount = 0;
                                this.packetReceiveState = PACKET_STATE_RESERVED;
                            } else {
                                rxPacket.header[0] = rxPacket.header[1];
                                rxPacket.header[1] = rxPacket.header[2];
                                rxPacket.header[2] = 0;
                            }
                        } else {
                            rxPacket.header[this.headerCount] = dataIn;
                            this.headerCount++;
                        }
                        break;

                    case PACKET_STATE_RESERVED:
                        if (dataIn == 0xfd) {
                            this.packetReceiveState = PACKET_STATE_IDLE;
                        } else {
                            rxPacket.reserved = dataIn;
                            this.packetReceiveState = PACKET_STATE_ID;
                        }
                        break;

                    case PACKET_STATE_ID:
                        rxPacket.id = dataIn;
                        this.packetReceiveState = PACKET_STATE_LENGTH_L;
                        break;

                    case PACKET_STATE_LENGTH_L:
                        rxPacket.packetLength = dataIn;
                        this.packetReceiveState = PACKET_STATE_LENGTH_H;
                        break;

                    case PACKET_STATE_LENGTH_H:
                        rxPacket.packetLength |= dataIn << 8;
                        if (rxPacket.packetLength < 1000) {
                            this.packetReceiveState = PACKET_STATE_DATA;
                        } else {
                            this.packetReceiveState = PACKET_STATE_IDLE;
                        }
                        rxPacket.index = 0;
                        break;

                    case PACKET_STATE_DATA:
                        rxPacket.data[rxPacket.index] = dataIn;
                        rxPacket.index++;

                        if (rxPacket.index >= rxPacket.packetLength - 2) {
                            this.packetReceiveState = PACKET_STATE_CRC_L;
                        }
                        break;

                    case PACKET_STATE_CRC_L:
                        rxPacket.crcReceived = dataIn;
                        this.packetReceiveState = PACKET_STATE_CRC_H;
                        break;

                    case PACKET_STATE_CRC_H:
                        rxPacket.crcReceived |= dataIn << 8;

                        stuffLength = this.removeStuffing(rxPacket.data, rxPacket.packetLength);
                        rxPacket.packetLength -= stuffLength;

                        rxPacket.cmd = rxPacket.data[0];
                        rxPacket.error = rxPacket.data[1];

                        if (rxPacket.cmd == INST_STATUS) {
                            //console.log(`rx length: ${rxPacket.packetLength}`);
                            if (rxPacket.packetLength >= 147) {
                                let tempValue = 0;
                                for (let i = 0; i < addrMap.length; i++) {
                                    switch (addrMap[i][1]) {
                                        case 1:
                                            this.dataBuffer[addrMap[i][2]] =
                                                rxPacket.data[2 + addrMap[i][0]];
                                            break;

                                        case 2:
                                            tempValue =
                                                rxPacket.data[2 + addrMap[i][0]] +
                                                (rxPacket.data[2 + addrMap[i][0] + 1] << 8);
                                            if (tempValue >= 32768) {
                                                tempValue = tempValue - 65536;
                                            }
                                            this.dataBuffer[addrMap[i][2]] = tempValue;
                                            break;

                                        case 4:
                                            this.dataBuffer[addrMap[i][2]] =
                                                rxPacket.data[2 + addrMap[i][0]] +
                                                (rxPacket.data[2 + addrMap[i][0] + 1] << 8) +
                                                (rxPacket.data[2 + addrMap[i][0] + 2] << 16) +
                                                (rxPacket.data[2 + addrMap[i][0] + 3] << 24);
                                            break;
                                    }
                                }

                                const dxlPositionStartAddr =
                                    addrMap[addrMap.length - 1][0] + addrMap[addrMap.length - 1][1];

                                // DXL Position
                                for (let i = 0; i < 20; i++) {
                                    const currentId =
                                        rxPacket.data[2 + dxlPositionStartAddr + 3 * i];
                                    const currentPos =
                                        rxPacket.data[2 + dxlPositionStartAddr + 3 * i + 1] +
                                        (rxPacket.data[2 + dxlPositionStartAddr + 3 * i + 2] << 8);
                                    if (currentId != 0xff && currentPos != 0xffff) {
                                        this.dxlPositions[currentId] = currentPos;
                                    }
                                }

                                const lineCategoryStartAddr = dxlPositionStartAddr + 3 * 20;
                                // line category
                                this.dataBuffer[5201] = rxPacket.data[2 + lineCategoryStartAddr];

                                const sensorStartAddr = lineCategoryStartAddr + 1;

                                // 온습도+조도+동작감지센서값
                                this.pirPir[0] = rxPacket.data[2 + sensorStartAddr];
                                this.pirTemperature[0] = rxPacket.data[2 + sensorStartAddr + 1];
                                this.pirHumidity[0] = rxPacket.data[2 + sensorStartAddr + 2];
                                this.pirBrightness[0] = rxPacket.data[2 + sensorStartAddr + 3];

                                // 거리+버튼+조도센서값
                                this.distanceDistance[0] =
                                    rxPacket.data[2 + sensorStartAddr + 4] +
                                    (rxPacket.data[2 + sensorStartAddr + 5] << 8);
                                this.distanceButton[0] = rxPacket.data[2 + sensorStartAddr + 6];
                                this.distanceBrightness[0] = rxPacket.data[2 + sensorStartAddr + 7];

                                for (let i = 0; i < addrMap2.length; i++) {
                                    switch (addrMap2[i][1]) {
                                        case 1:
                                            this.dataBuffer[addrMap2[i][2]] =
                                                rxPacket.data[2 + addrMap2[i][0]];
                                            break;

                                        case 2:
                                            tempValue =
                                                rxPacket.data[2 + addrMap2[i][0]] +
                                                (rxPacket.data[2 + addrMap2[i][0] + 1] << 8);
                                            if (tempValue >= 32768) {
                                                tempValue = tempValue - 65536;
                                            }
                                            this.dataBuffer[addrMap2[i][2]] = tempValue;
                                            break;

                                        case 4:
                                            this.dataBuffer[addrMap2[i][2]] =
                                                rxPacket.data[2 + addrMap2[i][0]] +
                                                (rxPacket.data[2 + addrMap2[i][0] + 1] << 8) +
                                                (rxPacket.data[2 + addrMap2[i][0] + 2] << 16) +
                                                (rxPacket.data[2 + addrMap2[i][0] + 3] << 24);
                                            break;
                                    }
                                }
                            }
                        }

                        this.packetReceiveState = PACKET_STATE_IDLE;
                        break;

                    default:
                    // code block
                }
            }
        }

        requestInitialData() {
            this.robotisBuffer = [];
            this.robotisBuffer.push([INST_WRITE, 21, 2, 20]);
            this.robotisBuffer.push([INST_WRITE, 19, 1, 1]); // bypass 모드 켜기
            this.robotisBuffer.push([INST_WRITE, 20, 1, 0]); // bypass port를 BLE로 설정
            this.robotisBuffer.push([INST_WRITE, 23, 1, 1]); // auto report 기능 켜기
            this.robotisBuffer.push([INST_WRITE, 4250, 1, 1]); // ai_camera 텍스트 지우기
            this.robotisBuffer.push([INST_WRITE, 722, 1, 0]); // dxl 토크 끄기
            //this.robotisBuffer.push([INST_WRITE, 63, 1, 1]); // 부저음 시간 설정
            //this.robotisBuffer.push([INST_WRITE, 60, 1, 70]); // 부저음 발생
            this.robotisBuffer.push([INST_WRITE, 113, 2, 1040]); // "띵" 효과음 발생
            /*
            //const ping = [0xff, 0xff, 0xfd, 0x00, 0xc8, 0x03, 0x00, 0x01, 0x3b, 0xfa];
            // run entry mode
            const packet = [
                0xff, 0xff, 0xfd, 0x00, 0xc8, 0x07, 0x00, 0x03, 0x15, 0x00, 0x14, 0x00, 0xc1, 0xb3,
            ];
            return packet;
            */
        }

        async initialHandshake() {
            const status = true;
            let sendBuffer = null;
            this.requestInitialData();
            while (this.robotisBuffer.length) {
                const data = this.robotisBuffer.shift();
                const instruction = data[0];
                const address = data[1];
                const length = data[2];
                const value = data[3];
                const dataBuffer = data[4];
                let id = 0;

                switch (instruction) {
                    case INST_WRITE:
                        id = 200;
                        sendBuffer = this.writePacket(id, address, length, value);
                        break;
                    case INST_BYPASS_WRITE:
                        id = value;
                        sendBuffer = this.writePacket(id, address, length, dataBuffer);
                        break;
                }
                Entry.hwLite.serial.sendAsciiAsBuffer(sendBuffer);
                if (instruction == INST_WRITE && address == 2100 && length == 1 && value == 1) {
                    this.robotisBuffer = [];
                }
            }
            return status;
        }
    })();
})();

module.exports = Entry.RobotisRgeeLite;
