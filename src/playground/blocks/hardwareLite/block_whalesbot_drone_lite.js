'use strict';

// - 라이프사이클 재점검
// - Entry.hw 부분 Entry.hwLite로 수정
// - portData 파라미터 확인
// - 모니터링 로직 확인

import _range from 'lodash/range';
import DataTable from '../../../class/DataTable';
import entryModuleLoader from '../../../class/entryModuleLoader';
import metadata from './metadata_whalesbot_drone_lite.json';

(function () {
    Entry.WhalesbotDroneLite = new (class WhalesbotDroneLite {
        constructor() {
            this.id = '620101';
            this.name = 'WhalesbotDroneLite';
            this.url = 'https://gaion-edu.kr/';
            this.imageName = 'whalesbotlite.png';
            this.title = {
                ko: 'Whalesbot Eagle1001',
                en: 'Whalesbot Eagle1001',
            };
            // duration도 미확인
            this.duration = 32;
            this.blockMenuBlocks = [
                // 'whalesbot_eagle_1001_lite_openning_3d_simulator',
                'whalesbot_eagle_1001_lite_entering_pitch_mode',
                'whalesbot_eagle_1001_lite_exit_pitch_mode',
                'whalesbot_eagle_1001_lite_automatic_take_off_height',
                'whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset',
                'whalesbot_eagle_1001_lite_automatic_landing',
                'whalesbot_eagle_1001_lite_automatic_descent_speed_offset',
                'whalesbot_eagle_1001_lite_set_the_flight_speed',
                'whalesbot_eagle_1001_lite_get_setting_speed',
                'whalesbot_eagle_1001_lite_rise',
                'whalesbot_eagle_1001_lite_down',
                'whalesbot_eagle_1001_lite_fly_forward',
                'whalesbot_eagle_1001_lite_fly_backward',
                'whalesbot_eagle_1001_lite_fly_left',
                'whalesbot_eagle_1001_lite_fly_right',
                'whalesbot_eagle_1001_lite_turn_left',
                'whalesbot_eagle_1001_lite_turn_right',
                'whalesbot_eagle_1001_lite_fly_in_the_specified_direction',
                'whalesbot_eagle_1001_lite_flight_designated',
                'whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control',
                'whalesbot_eagle_1001_lite_stop_moving_and_hover',
                'whalesbot_eagle_1001_lite_hover_at_specified_altitude',
                'whalesbot_eagle_1001_lite_emergency_stop',
                'whalesbot_eagle_1001_lite_set_the_steering_gear',
                // 'whalesbot_eagle_1001_lite_execute_script',
                'whalesbot_eagle_1001_lite_clean',
                'whalesbot_eagle_1001_lite_restart',
                'whalesbot_eagle_1001_lite_get_status',
                // light & speaker blocks
                'whalesbot_eagle_1001_lite_ls_debug_value',
                'whalesbot_eagle_1001_lite_ls_display_symbol',
                'whalesbot_eagle_1001_lite_ls_off_LED',
                'whalesbot_eagle_1001_lite_ls_display_digital_tube',
                'whalesbot_eagle_1001_lite_ls_display_digital_tube_score',
                'whalesbot_eagle_1001_lite_ls_off_digital_tube',
                'whalesbot_eagle_1001_lite_ls_set_RGB',
                'whalesbot_eagle_1001_lite_ls_fly_RGB',
                // 'whalesbot_eagle_1001_lite_ls_set_DO',
                // 'whalesbot_eagle_1001_lite_ls_execute_script',
                // sensors
                'whalesbot_eagle_1001_lite_ss_fly_state_POS_Z',
                'whalesbot_eagle_1001_lite_ss_fly_state_LASER',
                'whalesbot_eagle_1001_lite_ss_battery_voltage',
                'whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP',
                'whalesbot_eagle_1001_lite_ss_attitude_angle',
                'whalesbot_eagle_1001_lite_ss_flight_angular_velocity',
                'whalesbot_eagle_1001_lite_ss_flight_acceleration',
                'whalesbot_eagle_1001_lite_ss_optical_flow',
                'whalesbot_eagle_1001_lite_ss_get_infrared_distance',
                'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool',
                // 'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string',
                // 'whalesbot_eagle_1001_lite_ss_human_infrared_value_bool',
                // 'whalesbot_eagle_1001_lite_ss_human_infrared_value_string',
                'whalesbot_eagle_1001_lite_ss_AI',
                // 'whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance',
                'whalesbot_eagle_1001_lite_ss_get_ambient_light',
                // 'whalesbot_eagle_1001_lite_ss_get_temperature',
                // 'whalesbot_eagle_1001_lite_ss_get_humidity',
                // 'whalesbot_eagle_1001_lite_ss_get_flame',
                // 'whalesbot_eagle_1001_lite_ss_get_gesture',
                // 'whalesbot_eagle_1001_lite_ss_get_tof',
                // 'whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE',
                // 'whalesbot_eagle_1001_lite_ss_get_bt_remote_control',
                // 'whalesbot_eagle_1001_lite_ss_seconds',
                // 'whalesbot_eagle_1001_lite_ss_resettime',
            ];
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 255,
                constantServing: 'ReadOnly',
                connectionType: 'bytestream',
            };
            this.readablePorts = [];
            this.remainValue = null;
            this.decoder = new TextDecoder();
            this.nowdwpack = 0;
            this.BT_INDEX_CMD_SEND = 2;
            this.BT_INDEX_DATA_SEND = 3;
            this.packlen = 128;
            this.DATASENDLEN = 154;
            this.BT_INDEX_SENDCHECKSUM = this.DATASENDLEN - 1;
            this.DATAREVLEN = 160;
            this.BT_INDEX_REVCHECKSUM = this.DATAREVLEN - 1;
            this.BT_INDEX_CMD_REV = 8;
            this.BT_INDEX_DATA_REV = 9
            this.BT_CMD_GETFLYSTATE1 = 0x50;
            this.isDroneConnection = false;
            this.countDroneConnectionAttempt = 0;
            this.IsPicocStop = false;
            this.revtmp = Buffer.alloc(this.DATAREVLEN);
            this.revtemplength = 0;
            this.revtmpdata = Buffer.alloc(this.DATAREVLEN);
            this.revdata = Buffer.alloc(this.DATAREVLEN);
            this.BT_CMD_DOWNLOAD = 0x62;
            this.BT_CMD_DOWNLOAD_END = 0x64;
            this.BT_CMD_PICOCSTOP = 0x68;
            this.isDownloadDone = false;
            this.isGetFlyState = false;
            this.cmdType = {
                'Download': 1,
                'Stop': 2,
            }
            this.runCode = [
                0x77, 0x78, 0x66, 0x1, 0x2, 0x2, 0x3, 0x3, 0x4, 0x4, 0x5, 0x5,
                0x6, 0x6, 0x7, 0x7, 0x8, 0x8, 0x9, 0x9, 0xa, 0xa, 0xb, 0xb, 0xc, 0xc,
                0xd, 0xd, 0xe, 0xe, 0xf, 0xf, 0x10, 0x10, 0x11, 0x11, 0x12, 0x12, 0x13,
                0x13, 0x14, 0x14, 0x15, 0x15, 0x16, 0x16, 0x17, 0x17, 0x18, 0x18,
                0x19, 0x19, 0x1a, 0x1a, 0x1b, 0x1b, 0x1c, 0x1c, 0x1d, 0x1d, 0x1e, 0x1e,
                0x1f, 0x1f, 0x20, 0x20, 0x21, 0x21, 0x22, 0x22, 0x23, 0x23, 0x24, 0x24,
                0x25, 0x25, 0x26, 0x26, 0x27, 0x27, 0x28, 0x28, 0x29, 0x29, 0x2a, 0x2a,
                0x2b, 0x2b, 0x2c, 0x2c, 0x2d, 0x2d, 0x2e, 0x2e, 0x2f, 0x2f, 0x30, 0x30,
                0x31, 0x31, 0x32, 0x32, 0x33, 0x33, 0x34, 0x34, 0x35, 0x35, 0x36, 0x36,
                0x37, 0x37, 0x38, 0x38, 0x39, 0x39, 0x3a, 0x3a, 0x3b, 0x3b, 0x3c, 0x3c,
                0x3d, 0x3d, 0x3e, 0x3e, 0x3f, 0x3f, 0x40, 0x40, 0x41, 0x41, 0x42, 0x42,
                0x43, 0x43, 0x44, 0x44, 0x45, 0x45, 0x46, 0x46, 0x47, 0x47, 0x48, 0x48,
                0x49, 0x49, 0x4a, 0x4a, 0x4b, 0x4b, 0x0, 0x56
            ];

            this.getStateCode = [
                0x77, 0x78, 0x50, 0x1, 0x2, 0x2, 0x3, 0x3, 0x4, 0x4, 0x5, 0x5, 0x6, 0x6, 0x7, 0x7, 0x8, 0x8, 0x9, 0x9,
                0xa, 0xa, 0xb, 0xb, 0xc, 0xc, 0xd, 0xd, 0xe, 0xe, 0xf, 0xf, 0x10, 0x10, 0x11, 0x11, 0x12, 0x12
                , 0x13, 0x13, 0x14, 0x14, 0x15, 0x15, 0x16, 0x16, 0x17, 0x17, 0x18, 0x18, 0x19, 0x19, 0x1a, 0x1a
                , 0x1b, 0x1b, 0x1c, 0x1c, 0x1d, 0x1d, 0x1e, 0x1e, 0x1f, 0x1f, 0x20, 0x20, 0x21, 0x21, 0x22, 0x22
                , 0x23, 0x23, 0x24, 0x24, 0x25, 0x25, 0x26, 0x26, 0x27, 0x27, 0x28, 0x28, 0x29, 0x29, 0x2a, 0x2a
                , 0x2b, 0x2b, 0x2c, 0x2c, 0x2d, 0x2d, 0x2e, 0x2e, 0x2f, 0x2f, 0x30, 0x30, 0x31, 0x31, 0x32, 0x32
                , 0x33, 0x33, 0x34, 0x34, 0x35, 0x35, 0x36, 0x36, 0x37, 0x37, 0x38, 0x38, 0x39, 0x39, 0x3a, 0x3a
                , 0x3b, 0x3b, 0x3c, 0x3c, 0x3d, 0x3d, 0x3e, 0x3e, 0x3f, 0x3f, 0x40, 0x40, 0x41, 0x41, 0x42, 0x42
                , 0x43, 0x43, 0x44, 0x44, 0x45, 0x45, 0x46, 0x46, 0x47, 0x47, 0x48, 0x48, 0x49, 0x49, 0x4a, 0x4a
                , 0x4b, 0x4b, 0x0, 0x6c
            ];

            this.stopCode = [
                0x77, 0x78, 0x68, 0x1, 0x2, 0x2, 0x3, 0x3, 0x4, 0x4, 0x5, 0x5,
                0x6, 0x6, 0x7, 0x7, 0x8, 0x8, 0x9, 0x9, 0xa, 0xa, 0xb, 0xb, 0xc,
                0xc, 0xd, 0xd, 0xe, 0xe, 0xf, 0xf, 0x10, 0x10, 0x11, 0x11, 0x12,
                0x12, 0x13, 0x13, 0x14, 0x14, 0x15, 0x15, 0x16, 0x16, 0x17, 0x17,
                0x18, 0x18, 0x19, 0x19, 0x1a, 0x1a, 0x1b, 0x1b, 0x1c, 0x1c, 0x1d,
                0x1d, 0x1e, 0x1e, 0x1f, 0x1f, 0x20, 0x20, 0x21, 0x21, 0x22, 0x22,
                0x23, 0x23, 0x24, 0x24, 0x25, 0x25, 0x26, 0x26, 0x27, 0x27, 0x28,
                0x28, 0x29, 0x29, 0x2a, 0x2a, 0x2b, 0x2b, 0x2c, 0x2c, 0x2d, 0x2d,
                0x2e, 0x2e, 0x2f, 0x2f, 0x30, 0x30, 0x31, 0x31, 0x32, 0x32, 0x33,
                0x33, 0x34, 0x34, 0x35, 0x35, 0x36, 0x36, 0x37, 0x37, 0x38, 0x38,
                0x39, 0x39, 0x3a, 0x3a, 0x3b, 0x3b, 0x3c, 0x3c, 0x3d, 0x3d, 0x3e,
                0x3e, 0x3f, 0x3f, 0x40, 0x40, 0x41, 0x41, 0x42, 0x42, 0x43, 0x43,
                0x44, 0x44, 0x45, 0x45, 0x46, 0x46, 0x47, 0x47, 0x48, 0x48, 0x49,
                0x49, 0x4a, 0x4a, 0x4b, 0x4b, 0x0, 0x54
            ];
            this.simulatorPopup = null;
            this.setZero();
            this.unsupportBlockExist = false;
            this.getStateTimeSleep = 500;
            this.lock = false;
            this.sensor = {
                ACC_x: 0.0,
                ACC_y: 0.0,
                ACC_z: 0.0,
                Gypo_x: 0.0,
                Gypo_y: 0.0,
                Gypo_z: 0.0,
                SPL06_temp: 0.0,
                SPL06_Press: 0.0,
                SPL06_asl: 0.0,
                Pitch: 0.0,
                Roll: 0.0,
                Yaw: 0.0,
                Battery: 0.0,
                LaserTof: 0.0,
                GL_X: 0.0,
                GL_Y: 0.0,
                timertick: 0.0,
                M1: 0,
                M2: 0,
                M3: 0,
                M4: 0,
                Debug_0: 0.0,
                Debug_1: 0.0,
                Debug_2: 0.0,
                Debug_3: 0.0,
                Debug_4: 0.0,
                Debug_5: 0.0,
                FusedHeight: 0.0,
                VER: 100,
                TYPE: "TYPE_EG_DUMMY",
                ErrFly: 0,
                asl_dis: 0.0,
                startBaroAsl: 0.0,
                LineNo: 0,
                LineError: 0,
                ErrorCode: 0,
                state_position_x: 0.0,
                state_position_y: 0.0,
                state_position_z: 0.0,
                state_velocity_x: 0.0,
                state_velocity_y: 0.0,
                state_velocity_z: 0.0,
                btkey: 0,
                btstick1: 0,
                btstick2: 0,
                btstick3: 0,
                btstick4: 0,
                btstick5: 0
            };
            this.BIT0 = 0x01;
            this.BIT1 = 0x02;
            this.BIT2 = 0x04;
            this.BIT3 = 0x08;
            this.BIT4 = 0x10;
            this.BIT5 = 0x20;
            this.BIT6 = 0x40;
            this.BIT7 = 0x80;

            this.simulatorUrl = metadata.simulator_url;
            this.currentProcess = '';
            this.received_data = [];
        }

        setZero() {
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        // 디바이스에서 값을 읽어온다.
        async handleLocalData(data) {
            if (this.currentProcess == 'pingControl') {
                const CMD_PING_REV_SIZE = 3;
                const revtemp = Buffer.alloc(CMD_PING_REV_SIZE);
                for (let i = 0; i < data.length; i++) {
                    revtemp[i] = data[i];
                }
                if (revtemp.length == CMD_PING_REV_SIZE) {
                    if (revtemp[0] == 0x77 && revtemp[1] == 0x78 && revtemp[2] == 0x80) {
                        this.sp.close();
                        this.currentProcess = 'getStatus';
                    }
                }
            }

            if (this.currentProcess == 'getStatus') {
                for (let i = 0; i < data.length; i++) {
                    this.received_data.push(data[i]);
                }
                console.log('data.length: ', data.length);
                if (this.received_data.length >= this.DATAREVLEN) {
                    let revtmp = Buffer.from(this.received_data.slice(0, this.DATAREVLEN));
                    this.received_data = this.received_data.slice(this.DATAREVLEN);
                    // const hexStringX = Array.from(revtmp)
                    //     .map(byte => `0x${byte.toString(16).padStart(2, '0')}`)
                    //     .join(',');
                    // console.log(`revtmp (hex): ${hexStringX}`);
                    // let revtmp = Buffer.alloc(this.DATAREVLEN);
                    // for (let i = 0; i < this.received_data.length; i++) {
                    //     revtmp[i] = this.received_data[i];
                    // }
                    // revtmp = [0x77,0x78,0x0,0x0,0x63,0x5e,0x62,0x62,0x50,0xc3,0xd,0x3d,0xbc,0x39,0x6b,0xe0,0x3c,0xa6,0xb8,0x7f,0x3f,0x12,0xf0,0xa1,0xbd,0xac,0xe5,0x56,0x3e,0x48,0x62,0x0,0xbf,0x7b,0x87,0x23,0x42,0xe6,0xa9,0x7b,0x44,0x70,0xb,0xac,0x45,0xe6,0x2b,0x8b,0x3f,0x4f,0x3f,0xc1,0x3f,0x26,0xab,0x5d,0xc2,0x7a,0xe9,0x66,0x40,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x71,0x3d,0x21,0x43,0x0,0x0,0x0,0x0,0xba,0x5d,0x4c,0x3f,0x22,0xc,0x8e,0x38,0x74,0xb7,0x8e,0x40,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x30,0xbf,0xa2,0xbc,0x6b,0x0,0x0,0x1,0x0,0x0,0x0,0x0,0x70,0xb,0xac,0x45,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x1f,0x49,0x5a,0x3f,0x1e,0x63,0x6,0x3e,0x4e,0x24,0x92,0x3c,0x4b,0x0,0xfd]
                    if (revtmp[0] == 0x77 && revtmp[1] == 0x78) {
                        // console.log(revtmp[this.BT_INDEX_REVCHECKSUM], this.btremotecalchecksum(revtmp));
                        if (revtmp[this.BT_INDEX_REVCHECKSUM] == this.btremotecalchecksum(revtmp)) {
                            for (let i = 0; i < revtmp.length; i++) {
                                this.revdata[i] = revtmp[i];
                            }
                            this.makerevcmd();
                            this.revcount = this.revcount + 1;
                            if (this.isConnectEagle == false) {
                                this.isConnectEagle = true;
                                this.reverrcount = 0;
                            }
                        } else {
                            this.reverrcount = this.reverrcount + 1;
                            setTimeout(() => { }, 500);
                        }
                    } else {
                        this.reverrcount = this.reverrcount + 1;
                    }
                    this.currentProcess = '';
                }
            }
        }

        retHex(bytes) {
            const l = Array.from(bytes).map(byte => '0x' + byte.toString(16).padStart(1, '0'));
            return l;
        }

        convertToBufferArray(input) {
            const hexArray = input.split(',');
            const byteArray = hexArray.map(hex => parseInt(hex, 16));
            const buffer = Buffer.from(byteArray);
            return buffer;
        }

        //디바이스에 값을 쓴다.
        requestLocalData() {
            // return this.getStateCode;
            return null;
            // return this.stopCode;
        }

        makerevcmd() {
            this.IsRevPID = false; // 指示是否进行读取PID操作
            this.IsSetPID = false; // 指示是否进行设置PID操作
            this.IsDownload = false; // 指示是否进行下载操作
            this.IsPicocRun = false; // 指示飞飞控上的解释器是否开始运行脚本
            this.IsPicocStop = false; // 指示飞飞控上的解释器是否停止运行
            this.IsAutoDownload = false; // 指示飞飞控是否强制自动降落
            this.nowdwpack = 0;
            this.dwmsg = '';
            this.IsNewDataRevForLog = false;
            this.revcount = 0;
            this.sendcount = 0;
            this.sensor = {};
            this.TYPE_EG101 = 1;
            this.TYPE_EG102 = 2;
            if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_GETFLYSTATE1) {
                // const hexStringX = Array.from(this.revdata)
                //     .map(byte => `0x${byte.toString(16).padStart(2, '0')}`)
                //     .join(',');
                // console.log(`revtmp (hex): ${hexStringX}`);

                this.sensor.btkey = parseInt(this.revdata[2] + this.revdata[3] * 256, 10);
                this.sensor.btstick1 = parseInt(this.revdata[4], 10);
                this.sensor.btstick2 = parseInt(this.revdata[5], 10);
                this.sensor.btstick3 = parseInt(this.revdata[6], 10);
                this.sensor.btstick4 = parseInt(this.revdata[7], 10);

                this.sensor.ACC_x = this.byte2float(this.BT_INDEX_DATA_REV + 0 * 4);
                this.sensor.ACC_y = this.byte2float(this.BT_INDEX_DATA_REV + 1 * 4);
                this.sensor.ACC_z = this.byte2float(this.BT_INDEX_DATA_REV + 2 * 4);
                this.sensor.Gypo_x = this.byte2float(this.BT_INDEX_DATA_REV + 3 * 4);
                this.sensor.Gypo_y = this.byte2float(this.BT_INDEX_DATA_REV + 4 * 4);
                this.sensor.Gypo_z = this.byte2float(this.BT_INDEX_DATA_REV + 5 * 4);
                this.sensor.SPL06_temp = this.byte2float(this.BT_INDEX_DATA_REV + 6 * 4);
                this.sensor.SPL06_Press = this.byte2float(this.BT_INDEX_DATA_REV + 7 * 4);
                this.sensor.SPL06_asl = this.byte2float(this.BT_INDEX_DATA_REV + 8 * 4);
                this.sensor.Pitch = this.byte2float(this.BT_INDEX_DATA_REV + 9 * 4);
                this.sensor.Roll = this.byte2float(this.BT_INDEX_DATA_REV + 10 * 4);
                this.sensor.Yaw = this.byte2float(this.BT_INDEX_DATA_REV + 11 * 4);
                this.sensor.Battery = this.byte2float(this.BT_INDEX_DATA_REV + 12 * 4);

                this.sensor.LaserTof = this.byte2float(this.BT_INDEX_DATA_REV + 13 * 4);
                this.sensor.GL_X = this.byte2float(this.BT_INDEX_DATA_REV + 14 * 4);
                this.sensor.GL_Y = this.byte2float(this.BT_INDEX_DATA_REV + 15 * 4);
                this.sensor.timertick = this.byte2float(this.BT_INDEX_DATA_REV + 16 * 4);
                this.sensor.M1 = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 0], 10);
                this.sensor.M2 = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 1], 10);
                this.sensor.M3 = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 2], 10);
                this.sensor.M4 = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 3], 10);

                this.sensor.state_velocity_x = this.byte2float(this.BT_INDEX_DATA_REV + 18 * 4);
                this.sensor.state_velocity_y = this.byte2float(this.BT_INDEX_DATA_REV + 19 * 4);
                this.sensor.state_velocity_z = this.byte2float(this.BT_INDEX_DATA_REV + 20 * 4);

                this.sensor.Debug_0 = this.byte2float(this.BT_INDEX_DATA_REV + 21 * 4);
                this.sensor.Debug_1 = this.byte2float(this.BT_INDEX_DATA_REV + 22 * 4);
                this.sensor.Debug_2 = this.byte2float(this.BT_INDEX_DATA_REV + 23 * 4);
                this.sensor.Debug_3 = this.byte2float(this.BT_INDEX_DATA_REV + 24 * 4);
                this.sensor.Debug_4 = this.byte2float(this.BT_INDEX_DATA_REV + 25 * 4);
                this.sensor.Debug_5 = this.byte2float(this.BT_INDEX_DATA_REV + 26 * 4);
                this.sensor.FusedHeight = this.byte2float(this.BT_INDEX_DATA_REV + 27 * 4);

                this.sensor.VER = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 0], 10);
                this.sensor.ErrFly = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 1], 10);
                // 飞机种类
                if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 1) {
                    this.sensor.TYPE = this.TYPE_EG101;
                } else if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 2) {
                    this.sensor.TYPE = this.TYPE_EG102;
                } else if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 3) {
                    this.sensor.TYPE = this.TYPE_FPV101;
                } else {
                    this.sensor.TYPE = `${this.TYPE_EGXXX}${this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3]}`;
                }

                this.sensor.asl_dis = this.byte2float(this.BT_INDEX_DATA_REV + 29 * 4);
                this.sensor.startBaroAsl = this.byte2float(this.BT_INDEX_DATA_REV + 30 * 4);
                this.sensor.LineNo = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 31 * 4), 10);
                this.sensor.LineError = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 32 * 4), 10);
                this.sensor.ErrorCode = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 33 * 4), 10);
                this.sensor.state_position_x = this.byte2float(this.BT_INDEX_DATA_REV + 34 * 4);
                this.sensor.state_position_y = this.byte2float(this.BT_INDEX_DATA_REV + 35 * 4);
                this.sensor.state_position_z = this.byte2float(this.BT_INDEX_DATA_REV + 36 * 4);

                console.log('this.sensor', this.sensor);
            } else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_GETFLYSTATE_SCRATCH) {
                // const hexStringX = Array.from(this.revdata)
                //     .map(byte => `0x${byte.toString(16).padStart(2, '0')}`)
                //     .join(',');
                // console.log(`revtmp (hex): ${hexStringX}`);

                this.sensor.btkey = parseInt(this.revdata[2] + this.revdata[3] * 256, 10);
                this.sensor.btstick1 = parseInt(this.revdata[4], 10);
                this.sensor.btstick2 = parseInt(this.revdata[5], 10);
                this.sensor.btstick3 = parseInt(this.revdata[6], 10);
                this.sensor.btstick4 = parseInt(this.revdata[7], 10);

                if (this.revdata[this.BT_INDEX_DATA_REV + 0 * 4] == 0x77) { //蓝牙名称有效
                    const bytename = new Uint8Array(14);
                    for (let i = 0; i < 14; i++) {
                        if (this.revdata[this.BT_INDEX_DATA_REV + 0 * 4 + i] == '\0') { //避免\0干扰上位机解析
                            break;
                        }
                        bytename[i] = this.revdata[this.BT_INDEX_DATA_REV + 0 * 4 + i];
                    }
                    this.sensor.BTname = String.fromCharCode(...bytename);
                }
                this.sensor.FlyTime_h = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 4 * 4), 10);
                this.sensor.FlyTime_m = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 5 * 4), 10);
                this.sensor.SPL06_temp = this.byte2float(this.BT_INDEX_DATA_REV + 6 * 4);
                this.sensor.FlyTime_s = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 7 * 4), 10);
                this.sensor.SPL06_asl = this.byte2float(this.BT_INDEX_DATA_REV + 8 * 4);
                this.sensor.Pitch = this.byte2float(this.BT_INDEX_DATA_REV + 9 * 4);
                this.sensor.Roll = this.byte2float(this.BT_INDEX_DATA_REV + 10 * 4);
                this.sensor.Yaw = this.byte2float(this.BT_INDEX_DATA_REV + 11 * 4);
                this.sensor.Battery = this.byte2float(this.BT_INDEX_DATA_REV + 12 * 4);

                this.sensor.Debug_0 = this.byte2float(this.BT_INDEX_DATA_REV + 21 * 4);
                this.sensor.Debug_1 = this.byte2float(this.BT_INDEX_DATA_REV + 22 * 4);
                this.sensor.Debug_2 = this.byte2float(this.BT_INDEX_DATA_REV + 23 * 4);
                this.sensor.Debug_3 = this.byte2float(this.BT_INDEX_DATA_REV + 24 * 4);
                this.sensor.Debug_4 = this.byte2float(this.BT_INDEX_DATA_REV + 25 * 4);
                this.sensor.Debug_5 = this.byte2float(this.BT_INDEX_DATA_REV + 26 * 4);
                this.sensor.FusedHeight = this.byte2float(this.BT_INDEX_DATA_REV + 27 * 4);

                this.sensor.VER = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 0], 10);
                this.sensor.ErrFly = parseInt(this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 1], 10);
                //飞机种类
                if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 1) {
                    this.sensor.TYPE = this.TYPE_EG101;
                } else if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 2) {
                    this.sensor.TYPE = this.TYPE_EG102;
                } else if (this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3] == 3) {
                    this.sensor.TYPE = this.TYPE_FPV101;
                } else {
                    this.sensor.TYPE = `${this.TYPE_EGXXX}${this.revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 3]}`;
                }

                this.sensor.LineNo = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 31 * 4), 10);
                this.sensor.LineError = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 32 * 4), 10);
                this.sensor.ErrorCode = parseInt(this.byte2float(this.BT_INDEX_DATA_REV + 33 * 4), 10);
                this.sensor.state_position_x = this.byte2float(this.BT_INDEX_DATA_REV + 34 * 4);
                this.sensor.state_position_y = this.byte2float(this.BT_INDEX_DATA_REV + 35 * 4);
                this.sensor.state_position_z = this.byte2float(this.BT_INDEX_DATA_REV + 36 * 4);
            } else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_DOWNLOAD
                || this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_DOWNLOAD_END) {
                // const hexStringX = Array.from(this.revdata)
                //     .map(byte => `0x${byte.toString(16).padStart(2, '0')}`)
                //     .join(',');
                // console.log(`revtmp (hex): ${hexStringX}`);

                let isrevsame = true;
                for (let i = 0; i < this.packlen; i++) {  //(int i = 0; i < packlen; i++)
                    if (this.senddata[i + this.BT_INDEX_CMD_SEND] != this.revdata[i + this.BT_INDEX_CMD_REV]) {
                        isrevsame = false;
                        break;
                    }
                }
                if (isrevsame == true) {
                    this.nowdwpack = this.nowdwpack + 1;
                }
                if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_DOWNLOAD_END) {
                    // 已经超过下载文件长度，可以停止下载
                    this.IsDownload = false;
                    this.dwmsg = 'download success';
                    this.IsPicocStop = true;
                } else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_PICOCRUN) {
                    this.IsPicocRun = false;
                } else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_PICOCSTOP) {
                    this.IsPicocStop = false;
                } else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_AUTOLAND) {
                    this.IsAutoDownload = false;
                }
                // 指示新的数据收到
                this.IsNewDataRevForLog = true;
            }
        }

        resetSensor() {
            this.sensor.Pitch = 0;
            this.sensor.Roll = 0;
            this.sensor.Yaw = 0;
            this.sensor.state_position_x = 0.0;
            this.sensor.state_position_y = 0.0;
            this.sensor.state_position_z = 0.0;
            this.sensor.state_velocity_x = 0.0;
            this.sensor.state_velocity_y = 0.0;
            this.sensor.state_velocity_z = 0.0;
        }

        makesendcmd() {
            this.IsRevPID = false;
            this.IsSetPID = false;
            this.IsDownload = false;
            this.IsPicocRun = false;
            this.IsPicocStop = false;
            this.IsAutoDownload = false;
            this.nowdwpack = 0;
            this.dwmsg = '';
            this.IsNewDataRevForLog = false;
            if (this.IsDownload == true) {
                this.resetSensor();
                this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_DOWNLOAD;
                this.senddata[this.BT_INDEX_DATA_SEND] = this.nowdwpack & 0x000000ff;
                this.senddata[this.BT_INDEX_DATA_SEND + 1] = parseInt(((this.nowdwpack & 0x0000ff00) / 256), 10);
                if ((this.nowdwpack * this.packlen) > this.Picocode.length) {
                    this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_DOWNLOAD_END;
                }
                for (let i = 0; i < this.packlen; i++) {
                    if (i + (this.nowdwpack * this.packlen) >= this.Picocode.length) {
                        this.senddata[this.BT_INDEX_DATA_SEND + 2 + i] = 0xff;
                    } else {
                        this.senddata[this.BT_INDEX_DATA_SEND + 2 + i] = this.Picocode[i + (this.nowdwpack * this.packlen)];
                    }
                    this.dwmsg = `正在下载: ${this.nowdwpack * this.packlen} / ${this.Picocode.length}`;
                    //PrintLog(5, dwmsg)
                    console.log(this.dwmsg);
                }
            } else if (this.IsPicocRun == true) {
                this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_PICOCRUN;
            } else if (this.IsPicocStop == true) {
                this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_PICOCSTOP;
                this.IsPicocStop = false;
            } else if (this.IsAutoDownload == true) {
                this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_AUTOLAND;
            } else {
                // if (this.sensor.VER >= 109 && this.sensor.VER <= 200) {
                //     this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_GETFLYSTATE_SCRATCH;
                // } else {
                //     this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_GETFLYSTATE1;
                // }
                this.senddata[this.BT_INDEX_CMD_SEND] = this.BT_CMD_GETFLYSTATE1;
                for (let i = this.BT_INDEX_DATA_SEND; i < this.BT_INDEX_SENDCHECKSUM - 1; i++) {
                    // this.senddata[i] = parseInt((i / 2), 10) & 0x000000ff;
                    this.senddata[i] = Math.floor(i / 2) & 0xFF;
                }
            }
        }

        btremotecalchecksum(data) {
            let sum = 0;
            const codelen = data.byteLength - 1;
            for (let i = 2; i < codelen; i++) {
                sum = sum + data[i];
            }
            sum = (sum & 0xff);
            sum = (~sum) & 0xff;
            return +sum;
        }

        sleep(time = 300) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        async handleClean() {
            let i = 0;
            while (i < 2) {
                await Entry.hwLite.serial.writer.write(Buffer.from(this.stopCode));
                await this.sleep();
                i++;
            }
        }

        async downloadCode(sourceCode) {
            // console.log("Send chunk 0");
            let byteCode = this.generateBytesCode(this.cmdType.Download, sourceCode, 0);
            await Entry.hwLite.serial.writer.write(byteCode);

            await this.sleep();
            await Entry.hwLite.serial.writer.write(Buffer.from(this.getStateCode));
            let i = 0;

            await this.sleep();

            while (true) {
                // console.log("Send chunk ", i);
                byteCode = this.generateBytesCode(this.cmdType.Download, sourceCode, i);
                await Entry.hwLite.serial.writer.write(byteCode);
                await this.sleep();
                if (this.isLatestChunk(byteCode)) {
                    // console.log("Latest chunk sent!");
                    this.revdata = [];
                    break;
                }
                i++;
            }
        }

        async handleGetStatus() {
            this.currentProcess = 'getStatus';
            await Entry.hwLite.serial.writer.write(Buffer.from(this.getStateCode));
            await this.sleep();
        }

        async handleRestart() {
            await Entry.hwLite.serial.writer.write(Buffer.from(this.getStateCode));
            await this.sleep();
        }

        async handleRun() {
            await Entry.hwLite.serial.writer.write(Buffer.from(this.runCode));
            await this.sleep();
        }

        async sendPacket(packet, hex = true, callback = null) {
            if (hex) {
                await Entry.hwLite.serial.writer.write(Buffer.from(packet))
            } else {
                // console.log(this.retHex(packet).join(","))
                await Entry.hwLite.serial.writer.write(packet)
            }
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        isLatestChunk(chunkData) {
            if (chunkData[this.BT_INDEX_CMD_SEND] == 0x64) {
                for (let i = 0; i <= chunkData.length - 1; i++) {
                    if (chunkData[i] == 0xff
                        && chunkData[i + 1] == 0x42
                        && chunkData[i + 2] == 0x43
                        && chunkData[i + 3] == 0x43
                        && chunkData[i + 4] == 0x44
                        && chunkData[i + 5] == 0x44
                    ) {
                        return true;
                    }
                }
            }

            return false;
        }

        generateBytesCode(type, Picocode = "", nowdwpack = 0) {
            let ret = Buffer.alloc(this.DATASENDLEN);

            ret[0] = 0x77;
            ret[1] = 0x78;

            ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_GETFLYSTATE1;
            for (let i = this.BT_INDEX_DATA_SEND; i < this.BT_INDEX_SENDCHECKSUM - 1; i++) {
                ret[i] = (Math.floor(i / 2)) & 0x000000ff;
            }

            if (type == this.cmdType.Download) {
                ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_DOWNLOAD;
                ret[this.BT_INDEX_DATA_SEND] = nowdwpack & 0x000000ff;
                ret[this.BT_INDEX_DATA_SEND + 1] = ((nowdwpack & 0x0000ff00) / 256) | 0;

                if (nowdwpack * this.packlen > Picocode.length) {
                    ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_DOWNLOAD_END;
                }

                for (let i = 0; i < this.packlen; i++) {
                    if (i + nowdwpack * this.packlen >= Picocode.length) {
                        ret[this.BT_INDEX_DATA_SEND + 2 + i] = 0xff;
                    } else {
                        ret[this.BT_INDEX_DATA_SEND + 2 + i] = Picocode.charCodeAt(i + nowdwpack * this.packlen);
                    }
                }
            } else if (type == this.cmdType.Stop) {
                ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_PICOCSTOP
            }

            ret[this.BT_INDEX_SENDCHECKSUM] = this.calChecksum(ret);
            // console.log(ret[this.BT_INDEX_SENDCHECKSUM]);
            return ret;
        }

        calChecksum(data) {
            let sum = 0;
            const codelen = data.byteLength - 1;
            for (let i = 2; i < codelen; i++) {
                sum = sum + data[i];
            }
            sum = (sum & 0xff);
            sum = (~sum) & 0xff;
            return +sum;
        }

        VERSTR() {
            return (this.sensor.TYPE).toString() + "_" + parseInt(this.sensor.VER).toString()

        }
        Errcode2Msg(ErrorCode) {
            if (ErrorCode == 0) {
                return "No Error"
            }
            if (ErrorCode == 1) {
                return "can't assign to this"
            }
            if (ErrorCode == 2) {
                return "NULL pointer dereference"
            }
            if (ErrorCode == 3) {
                return "first argument to '?' should be a number"
            }
            if (ErrorCode == 4) {
                return "can't get the address of this"
            }
            if (ErrorCode == 5) {
                return "invalid operation"
            }
            if (ErrorCode == 6) {
                return "invalid use of a NULL pointer"
            }
            if (ErrorCode == 7) {
                return "not supported"
            }
            if (ErrorCode == 8) {
                return "invalid expression"
            }
            if (ErrorCode == 9) {
                return "array index must be an integer"
            }
            if (ErrorCode == 10) {
                return "this Target is not an array"
            }
            if (ErrorCode == 11) {
                return "need an structure or union member"
            }
            if (ErrorCode == 12) {
                return "struct or union error"
            }
            if (ErrorCode == 13) {
                return "doesn't have a member"
            }
            if (ErrorCode == 14) {
                return "operator not expected here"
            }
            if (ErrorCode == 15) {
                return "brackets not closed"
            }
            if (ErrorCode == 16) {
                return "identifier not expected here"
            }
            if (ErrorCode == 17) {
                return "macro arguments missing"
            }
            if (ErrorCode == 18) {
                return "expression expected"
            }
            if (ErrorCode == 19) {
                return "a void value isn't much use here"
            }
            if (ErrorCode == 20) {
                return "value not expected here"
            }
            if (ErrorCode == 21) {
                return "type not expected here"
            }
            if (ErrorCode == 22) {
                return "brackets not closed"
            }
            if (ErrorCode == 23) {
                return "ExpressionParseMacroCall out of memory"
            }
            if (ErrorCode == 24) {
                return "too many arguments"
            }
            if (ErrorCode == 25) {
                return "comma expected"
            }
            if (ErrorCode == 26) {
                return "bad argument"
            }
            if (ErrorCode == 27) {
                return "not enough arguments"
            }
            if (ErrorCode == 28) {
                return "Macro undefined"
            }
            if (ErrorCode == 29) {
                return "function - can't call"
            }
            if (ErrorCode == 30) {
                return "ExpressionParseFunctionCall out of memory"
            }
            if (ErrorCode == 31) {
                return "too many arguments"
            }
            if (ErrorCode == 32) {
                return "comma expected"
            }
            if (ErrorCode == 33) {
                return "bad argument"
            }
            if (ErrorCode == 34) {
                return "not enough arguments"
            }
            if (ErrorCode == 35) {
                return "undefined Fun name"
            }
            if (ErrorCode == 36) {
                return "function body expected"
            }
            if (ErrorCode == 37) {
                return "no value returned from a function returning"
            }
            if (ErrorCode == 38) {
                return "couldn't find goto label"
            }
            if (ErrorCode == 39) {
                return "expression expected"
            }
            if (ErrorCode == 40) {
                return "integer value expected instead"
            }
            if (ErrorCode == 41) {
                return "identifier expected"
            }
            if (ErrorCode == 42) {
                return "undefined Identifier"
            }
            if (ErrorCode == 43) {
                return "value expected"
            }
            if (ErrorCode == 44) {
                return "#else without #if"
            }
            if (ErrorCode == 45) {
                return "#endif without #if"
            }
            if (ErrorCode == 46) {
                return "nested function definitions are not allowed"
            }
            if (ErrorCode == 47) {
                return "too many parameters"
            }
            if (ErrorCode == 48) {
                return "comma expected"
            }
            if (ErrorCode == 49) {
                return "bad parameter"
            }
            if (ErrorCode == 50) {
                return "main() should return an int or void"
            }
            if (ErrorCode == 51) {
                return "bad parameters to main()"
            }
            if (ErrorCode == 52) {
                return "bad function definition"
            }
            if (ErrorCode == 53) {
                return "function definition expected"
            }
            if (ErrorCode == 54) {
                return "Identifier is already defined"
            }
            if (ErrorCode == 55) {
                return "} expected"
            }
            if (ErrorCode == 56) {
                return "can't define a void variable"
            }
            if (ErrorCode == 57) {
                return "close bracket expected"
            }
            if (ErrorCode == 58) {
                return "Macro is already defined"
            }
            if (ErrorCode == 59) {
                return "'(' expected"
            }
            if (ErrorCode == 60) {
                return "statement expected"
            }
            if (ErrorCode == 61) {
                return "';' expected"
            }
            if (ErrorCode == 62) {
                return "')' expected"
            }
            if (ErrorCode == 63) {
                return "'while' expected"
            }
            if (ErrorCode == 64) {
                return "'{' expected"
            }
            if (ErrorCode == 65) {
                return "filename.h expected"
            }
            if (ErrorCode == 66) {
                return "'' expected"
            }
            if (ErrorCode == 67) {
                return "value required in return"
            }
            if (ErrorCode == 68) {
                return "value in return from a void function"
            }
            if (ErrorCode == 69) {
                return "PicocParse out of memory"
            }
            if (ErrorCode == 70) {
                return "parse error"
            }
            if (ErrorCode == 71) {
                return "AssignFail"
            }
            if (ErrorCode == 72) {
                return "TableSetIdentifier out of memory"
            }
            if (ErrorCode == 73) {
                return "data type is already defined"
            }
            if (ErrorCode == 74) {
                return "structure isn't defined"
            }
            if (ErrorCode == 75) {
                return "struct/union definitions can only be globals"
            }
            if (ErrorCode == 76) {
                return "invalid type in struct"
            }
            if (ErrorCode == 77) {
                return "member already defined"
            }
            if (ErrorCode == 78) {
                return "semicolon expected"
            }
            if (ErrorCode == 79) {
                return "enum isn't defined"
            }
            if (ErrorCode == 80) {
                return "enum definitions can only be globals"
            }
            if (ErrorCode == 81) {
                return "bad type declaration"
            }
            if (ErrorCode == 82) {
                return "']' expected"
            }
            if (ErrorCode == 83) {
                return "Variable out of memory"
            }
            if (ErrorCode == 84) {
                return "stack underrun"
            }
            if (ErrorCode == 85) {
                return "VariableStack out of memory"
            }
            if (ErrorCode == 86) {
                return "stack is empty - can't go back"
            }
            return ""
        }

        ErrFly2String(ErrFly) {
            let msg = ""
            const ERR_NONE = 0
            const ERR_LOWBATT = this.BIT0
            const ERR_CODE = this.BIT1
            const ERR_TEMP = this.BIT3
            const ERR_SENSORS = this.BIT4
            const ERR_LOADER = this.BIT5
            const ERR_ANGLE = this.BIT6
            if (ErrFly == ERR_NONE) {
                msg = msg + "NO_Error"

            }
            if (ErrFly & ERR_LOWBATT == ERR_LOWBATT) {
                msg = "Low_Battery" + " "
            }
            if (ErrFly & ERR_CODE == ERR_CODE) {
                msg = msg + "Code_Error" + " "
            }
            if (ErrFly & ERR_TEMP == ERR_TEMP) {
                msg = msg + "motherboard_temperature_is_too_high" + " "
            }
            if (ErrFly & ERR_SENSORS == ERR_SENSORS) {
                msg = msg + "Sensor_Error" + " "
            }
            if (ErrFly & ERR_LOADER == ERR_LOADER) {
                msg = msg + "Excessive_load" + " "
            }
            if (ErrFly & ERR_ANGLE == ERR_ANGLE) {
                msg = msg + "Excessive_inclination_angle" + " "
            }
            return msg

        }
        Sensor2String() {
            let SPLIT_STRING = "------------------------------------\n"
            let msg = "STATE_PITCH=    " + (Math.round(this.sensor.Pitch, 3)).toString() + "\n"
            msg = msg + "STATE_ROLL=    " + (Math.round(this.sensor.Roll, 3)).toString() + "\n"
            msg = msg + "STATE_YAW=    " + (Math.round(this.sensor.Yaw, 3)).toString() + "\n"
            msg = msg + SPLIT_STRING

            msg = msg + "STATE_TEMP=    " + (Math.round(this.sensor.SPL06_temp, 3)).toString() + "\n"

            msg = msg + "FusedHeight=    " + (Math.round(this.sensor.FusedHeight, 3)).toString() + "\n"

            msg = msg + "BATTERY=    " + (Math.round(this.sensor.Battery, 3)).toString() + "\n"

            msg = msg + "VER=    " + this.VERSTR() + "\n"
            msg = msg + SPLIT_STRING
            msg = msg + "FLY_ERR=    " + this.ErrFly2String(parseInt(this.sensor.ErrFly)) + "\n"
            msg = msg + "LINE_NO=    " + (this.sensor.LineNo) + "\n"
            msg = msg + "ERROR_NO=    " + (this.sensor.LineError) + "\n"
            msg = msg + "ERROR_MSG=    " + this.Errcode2Msg(this.sensor.ErrorCode) + "\n"

            msg = msg + "DEBUG1=    " + (Math.round(this.sensor.Debug_0, 6)).toString() + "\n"
            msg = msg + "DEBUG2=    " + (Math.round(this.sensor.Debug_1, 6)).toString() + "\n"
            msg = msg + "DEBUG3=    " + (Math.round(this.sensor.Debug_2, 6)).toString() + "\n"
            msg = msg + "DEBUG4=    " + (Math.round(this.sensor.Debug_3, 6)).toString() + "\n"
            msg = msg + "DEBUG5=    " + (Math.round(this.sensor.Debug_4, 6)).toString() + "\n"
            msg = msg + "DEBUG6=    " + (Math.round(this.sensor.Debug_5, 6)).toString() + "\n"
            return msg
        }

        byte2float(offset) {
            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);

            view.setUint8(3, this.revdata[offset + 0]);
            view.setUint8(2, this.revdata[offset + 1]);
            view.setUint8(1, this.revdata[offset + 2]);
            view.setUint8(0, this.revdata[offset + 3]);

            return view.getFloat32(0, false);
        }


        getInjectStatus(revtmp) {
            let revdata = Buffer.alloc(this.DATAREVLEN);
            if (revtmp.byteLength == this.DATAREVLEN) {
                if (revtmp[0] == 0x77 && revtmp[1] == 0x78) {
                    if (revtmp[this.BT_INDEX_REVCHECKSUM] == this.calChecksum(revtmp)) {
                        for (let i = 0; i < revtmp.length; i++) {
                            revdata[i] = revtmp[i];
                        }
                    }
                }
            }

            if (revdata[this.BT_INDEX_CMD_REV] === this.BT_CMD_DOWNLOAD || revdata[this.BT_INDEX_CMD_REV] === this.BT_CMD_DOWNLOAD_END) {
                let isrevsame = true;
                for (let i = 0; i < this.packlen; i++) {
                    if (revtmp !== revdata[i + this.BT_INDEX_CMD_REV]) {
                        isrevsame = false;
                        break;
                    }
                }
                if (isrevsame === true) {
                    this.nowdwpack = this.nowdwpack + 1;
                }
                if (revdata[this.BT_INDEX_CMD_REV] === this.BT_CMD_DOWNLOAD_END) {
                    // IsDownload = false;
                    // console.log("download success");
                    return true
                }
            }
            else if (this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_GETFLYSTATE1) {
                this.sensor.btkey = parseInt(revdata[2] + revdata[3] * 256)
                this.sensor.btstick1 = parseInt(revdata[4])
                this.sensor.btstick2 = parseInt(revdata[5])
                this.sensor.btstick3 = parseInt(revdata[6])
                this.sensor.btstick4 = parseInt(revdata[7])
                this.sensor.ACC_x = this.byte2float(this.BT_INDEX_DATA_REV + 0 * 4)
                this.sensor.ACC_y = this.byte2float(this.BT_INDEX_DATA_REV + 1 * 4)
                this.sensor.ACC_z = this.byte2float(this.BT_INDEX_DATA_REV + 2 * 4)
                this.sensor.Gypo_x = this.byte2float(this.BT_INDEX_DATA_REV + 3 * 4)
                this.sensor.Gypo_y = this.byte2float(this.BT_INDEX_DATA_REV + 4 * 4)
                this.sensor.Gypo_z = this.byte2float(this.BT_INDEX_DATA_REV + 5 * 4)
                this.sensor.SPL06_temp = this.byte2float(this.BT_INDEX_DATA_REV + 6 * 4)
                this.sensor.SPL06_Press = this.byte2float(this.BT_INDEX_DATA_REV + 7 * 4)
                this.sensor.SPL06_asl = this.byte2float(this.BT_INDEX_DATA_REV + 8 * 4)
                this.sensor.Pitch = this.byte2float(this.BT_INDEX_DATA_REV + 9 * 4)
                this.sensor.Roll = this.byte2float(this.BT_INDEX_DATA_REV + 10 * 4)
                this.sensor.Yaw = this.byte2float(this.BT_INDEX_DATA_REV + 11 * 4)
                this.sensor.Battery = this.byte2float(this.BT_INDEX_DATA_REV + 12 * 4)
                this.sensor.LaserTof = this.byte2float(this.BT_INDEX_DATA_REV + 13 * 4)
                this.sensor.GL_X = this.byte2float(this.BT_INDEX_DATA_REV + 14 * 4)
                this.sensor.GL_Y = this.byte2float(this.BT_INDEX_DATA_REV + 15 * 4)
                this.sensor.timertick = this.byte2float(this.BT_INDEX_DATA_REV + 16 * 4)
                this.sensor.M1 = parseInt(revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 0])
                this.sensor.M2 = parseInt(revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 1])
                this.sensor.M3 = parseInt(revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 2])
                this.sensor.M4 = parseInt(revdata[this.BT_INDEX_DATA_REV + 17 * 4 + 3])

                this.sensor.state_velocity_x = this.byte2float(this.BT_INDEX_DATA_REV + 18 * 4)
                this.sensor.state_velocity_y = this.byte2float(this.BT_INDEX_DATA_REV + 19 * 4)
                this.sensor.state_velocity_z = this.byte2float(this.BT_INDEX_DATA_REV + 20 * 4)

                this.sensor.Debug_0 = this.byte2float(this.BT_INDEX_DATA_REV + 21 * 4)
                this.sensor.Debug_1 = this.byte2float(this.BT_INDEX_DATA_REV + 22 * 4)
                this.sensor.Debug_2 = this.byte2float(this.BT_INDEX_DATA_REV + 23 * 4)
                this.sensor.Debug_3 = this.byte2float(this.BT_INDEX_DATA_REV + 24 * 4)
                this.sensor.Debug_4 = this.byte2float(this.BT_INDEX_DATA_REV + 25 * 4)
                this.sensor.Debug_5 = this.byte2float(this.BT_INDEX_DATA_REV + 26 * 4)
                this.sensor.FusedHeight = this.byte2float(this.BT_INDEX_DATA_REV + 27 * 4)

                this.sensor.VER = parseInt(revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 0])
                this.sensor.ErrFly = parseInt(revdata[this.BT_INDEX_DATA_REV + 28 * 4 + 1])
                let msg = this.Sensor2String();
                // console.log(msg);
            }

            return false;
        }

        exportProject() {
            let project = {};

            project.objects = Entry.container.toJSON();
            const objects = project.objects;
            project.scenes = Entry.scene.toJSON();
            project.variables = Entry.variableContainer.getVariableJSON();
            project.messages = Entry.variableContainer.getMessageJSON();
            project.functions = Entry.variableContainer.getFunctionJSON();
            project.tables = DataTable.getTableJSON();
            project.speed = Entry.FPS;
            project.interface = Entry.captureInterfaceState();
            project.expansionBlocks = Entry.expansionBlocks;
            project.aiUtilizeBlocks = Entry.aiUtilizeBlocks;
            project.hardwareLiteBlocks = Entry.hardwareLiteBlocks;
            project.learning = Entry.aiLearning?.toJSON();
            project.externalModules = entryModuleLoader.moduleList;
            project.externalModulesLite = entryModuleLoader.moduleListLite;

            if (!objects || !objects.length) {
                return false;
            }

            return project;
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        whalesbot_eagle_1001_lite_openning_3d_simulator: '3D 시뮬레이터를 엽니 다',
                        whalesbot_eagle_1001_lite_clean: '삭제',
                        whalesbot_eagle_1001_lite_restart: '재시작',
                        whalesbot_eagle_1001_lite_get_status: '상태 가져오기',
                        whalesbot_eagle_1001_lite_entering_pitch_mode: '준비모드 시작하기',
                        whalesbot_eagle_1001_lite_exit_pitch_mode: '준비모드 끝내기',
                        whalesbot_eagle_1001_lite_automatic_take_off_height: '자동 이륙 높이 %1 cm',
                        whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset: '자동 이륙 고도 %1 cm 속도 %2 X 오프셋 %3 도 Y 오프셋 %4 도 으로 이동하기',
                        whalesbot_eagle_1001_lite_automatic_landing: '드론착륙',
                        whalesbot_eagle_1001_lite_automatic_descent_speed_offset: '자동 낙하 속도 %1 X 오프셋 %2 도 Y 오프셋 %3 도',
                        whalesbot_eagle_1001_lite_set_the_flight_speed: '설정된 비행 속도는 %1 cm/s',
                        whalesbot_eagle_1001_lite_get_setting_speed: '설정 속도 가져오기',
                        whalesbot_eagle_1001_lite_rise: '위로 %1 cm',
                        whalesbot_eagle_1001_lite_down: '아래로 %1 cm',
                        whalesbot_eagle_1001_lite_fly_forward: '앞으로 %1 cm',
                        whalesbot_eagle_1001_lite_fly_backward: '뒤로 %1 cm',
                        whalesbot_eagle_1001_lite_fly_left: '왼쪽으로 %1 cm',
                        whalesbot_eagle_1001_lite_fly_right: '오른쪽으로 %1 cm',
                        whalesbot_eagle_1001_lite_turn_left: '왼쪽으로 회전 %1 °',
                        whalesbot_eagle_1001_lite_turn_right: '오른쪽으로 회전 %1 °',
                        whalesbot_eagle_1001_lite_fly_in_the_specified_direction: '속도 %1 , 방향 %2 으로이동하기',
                        whalesbot_eagle_1001_lite_flight_designated: '지정된 거리를 비행합니다 x %1 cm y %2 cm z%3 cm 속도 %4 cm/s',
                        whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control: '리모컨 4개 채널 설정 Pitch %1 Roll %2 Throttle %3 Yaw %4',
                        whalesbot_eagle_1001_lite_stop_moving_and_hover: '호버링기능',
                        whalesbot_eagle_1001_lite_hover_at_specified_altitude: '지정된 높이에 서스펜션 %1 cm',
                        whalesbot_eagle_1001_lite_emergency_stop: '긴급정지',
                        whalesbot_eagle_1001_lite_set_the_steering_gear: '스티어링기어 ID 설정 포트 %1 속도 %2 각도 %3',
                        whalesbot_eagle_1001_lite_execute_script: '스크립트 실행',
                        // light & speaker blocks
                        whalesbot_eagle_1001_lite_ls_debug_value: '센서 값 확인 %1 %2',
                        whalesbot_eagle_1001_lite_ls_display_symbol: '도트매트릭스 %1 포트 %2',
                        whalesbot_eagle_1001_lite_ls_off_LED: '표현스크린 닫기 포트 %1',
                        whalesbot_eagle_1001_lite_ls_display_digital_tube: '디지털튜브 포트 %1 %2',
                        whalesbot_eagle_1001_lite_ls_display_digital_tube_score: '디지털튜브에 점수 표시 포트 %1 %2 : %3',
                        whalesbot_eagle_1001_lite_ls_off_digital_tube: '디지털튜브 닫기 포트 %1',
                        whalesbot_eagle_1001_lite_ls_set_RGB: 'LED색상설정 포트 %1 색상 R %2 G %3 B %4',
                        whalesbot_eagle_1001_lite_ls_fly_RGB: 'Led 조명인가요? %1',
                        whalesbot_eagle_1001_lite_ls_set_DO: '전자석 포트 %1 %2',
                        whalesbot_eagle_1001_lite_ls_execute_script: '동작 없이 스크립트 실행',
                        // sensors
                        whalesbot_eagle_1001_lite_ss_fly_state_POS_Z: '비행 고도 cm',
                        whalesbot_eagle_1001_lite_ss_fly_state_LASER: '동체 내부 레이저 거리 측정 cm',
                        whalesbot_eagle_1001_lite_ss_battery_voltage: '배터리 전압 (V)',
                        whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP: '메인보드 온도 (°)',
                        whalesbot_eagle_1001_lite_ss_attitude_angle: '자세각 %1 (°)',
                        whalesbot_eagle_1001_lite_ss_flight_angular_velocity: '비행각속도 %1 cm/s',
                        whalesbot_eagle_1001_lite_ss_flight_acceleration: '비행 가속도 %1 (1g)',
                        whalesbot_eagle_1001_lite_ss_optical_flow: '광류 %1 (cm)',
                        whalesbot_eagle_1001_lite_ss_get_infrared_distance: '적외선센 포트 %1 값',
                        whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool: '적외선센서 포트 %1 장애물 감지',
                        whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string: '적외선센서 포트 %1 장애물 감지',
                        whalesbot_eagle_1001_lite_ss_human_infrared_value_bool: '인체 감지 센서 포트 %1 사람을 감지하다',
                        whalesbot_eagle_1001_lite_ss_human_infrared_value_string: '인체 감지 센서 포트 %1 사람을 감지하다',
                        whalesbot_eagle_1001_lite_ss_AI: '아날로그 입력 포트 %1 값',
                        whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance: '초음파센서 포트 %1 거리 강지 cm',
                        whalesbot_eagle_1001_lite_ss_get_ambient_light: '조도센서 입력 포트 %1 값',
                        whalesbot_eagle_1001_lite_ss_get_temperature: '온도 센서 포트 %1 °C',
                        whalesbot_eagle_1001_lite_ss_get_humidity: '습도 센서 포트 %1 값 %',
                        whalesbot_eagle_1001_lite_ss_get_flame: '불꽃센서 포트 %1 값',
                        whalesbot_eagle_1001_lite_ss_get_gesture: '동작인식 포트 %1',
                        whalesbot_eagle_1001_lite_ss_get_tof: '레이저 거리 측정 포트 %1',
                        whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE: '레이저 높이 %1',
                        whalesbot_eagle_1001_lite_ss_get_bt_remote_control: '리모콘 버튼 %1 값',
                        whalesbot_eagle_1001_lite_ss_seconds: '현재 타이머 값',
                        whalesbot_eagle_1001_lite_ss_resettime: '타이머 재설정',
                    },
                    Device: {
                        whalesbot_eagle_1001_lite_lite: 'whalesbot_eagle_1001_lite_lite',
                    },
                    Menus: {
                        whalesbot_eagle_1001_lite_lite: 'WhalesbotEagle1001Lite',
                    },
                    Blocks: {
                        light_speaker: {
                            electro_magnet: { absorption: '붙다', break_off: '떨어지다' },
                        },
                        sensor: {
                            attitude_angle: { pitch: 'Pitch', roll: 'Roll', yaw: 'Yaw' },
                            laser_height_determination: { on: 'On', off: 'Off' },
                            remote_control_button: { key: 'Key', left_rocker_x: 'Left rocker X', left_rocker_y: 'Left rocker Y', right_rocker_x: 'Right rocker X', right_rocker_y: 'Right rocker Y' },
                        },
                        whalesbot_eagle_1001_lite_toast_status_title: "드론 상태",
                        whalesbot_eagle_1001_lite_toast_prepare_download: "다운로드 준비...",
                        whalesbot_eagle_1001_lite_toast_downloading_code: "코드 다운로드...",
                        whalesbot_eagle_1001_lite_toast_download_success: "다운로드 코드가 성공했습니다",
                        whalesbot_eagle_1001_lite_toast_download_failed: "다운로드 코드가 실패했습니다",
                        whalesbot_eagle_1001_lite_toast_clean_failed: "깨끗한 코드가 실패했습니다",
                        whalesbot_eagle_1001_lite_toast_clean_success: "깨끗한 코드 성공",
                        whalesbot_eagle_1001_lite_toast_unsupport_block_title: "지원되지 않는 블록",
                        whalesbot_eagle_1001_lite_toast_unsupport_block_msg: "하드웨어에서는 일부 블록이 지원되지 않습니다"
                    }
                },
                en: {
                    template: {
                        whalesbot_eagle_1001_lite_openning_3d_simulator: 'Open 3D Simulator',
                        whalesbot_eagle_1001_lite_clean: 'Clean',
                        whalesbot_eagle_1001_lite_restart: 'Restart',
                        whalesbot_eagle_1001_lite_get_status: 'Get Status',
                        whalesbot_eagle_1001_lite_entering_pitch_mode: 'Entering Pitch Mode',
                        whalesbot_eagle_1001_lite_exit_pitch_mode: 'Exit Pitch Mode',
                        whalesbot_eagle_1001_lite_automatic_take_off_height: 'Automatic Take Off Height %1 cm',
                        whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset: 'Automatic Take Off Altitude %1 cm, Speed %2, X offset %3 degree, Y offset %4 degree',
                        whalesbot_eagle_1001_lite_automatic_landing: 'Automatic Landing',
                        whalesbot_eagle_1001_lite_automatic_descent_speed_offset: 'Automatic Descent Speed %1, X offset %2 degree, Y offset %3 degree',
                        whalesbot_eagle_1001_lite_set_the_flight_speed: 'Set The Flight Speed To %1 cm/s',
                        whalesbot_eagle_1001_lite_get_setting_speed: 'Get Setting Speed',
                        whalesbot_eagle_1001_lite_rise: 'Rise %1 cm',
                        whalesbot_eagle_1001_lite_down: 'Down %1 cm',
                        whalesbot_eagle_1001_lite_fly_forward: 'Fly Forward %1 cm',
                        whalesbot_eagle_1001_lite_fly_backward: 'Fly Backward %1 cm',
                        whalesbot_eagle_1001_lite_fly_left: 'Fly Left %1 cm',
                        whalesbot_eagle_1001_lite_fly_right: 'Fly Right %1 cm',
                        whalesbot_eagle_1001_lite_turn_left: 'Turn Left %1 °',
                        whalesbot_eagle_1001_lite_turn_right: 'Turn Right %1 °',
                        whalesbot_eagle_1001_lite_fly_in_the_specified_direction: 'Fly In The Specified Direction Speed %1 cm/s Direction %2 °',
                        whalesbot_eagle_1001_lite_flight_designated: 'Flight Designated Distance X %1 cm Y %2 cm Z %3 cm Speed %4 cm/s',
                        whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control: 'Set The Four Channel Lever Quantity Of Remote Control Pitch %1° Roll %2° Throttle %3° Roll %4°',
                        whalesbot_eagle_1001_lite_stop_moving_and_hover: 'Stop Moving And Hover',
                        whalesbot_eagle_1001_lite_hover_at_specified_altitude: 'Hover At a Specified Altitude %1 cm',
                        whalesbot_eagle_1001_lite_emergency_stop: 'Emergency Stop',
                        whalesbot_eagle_1001_lite_set_the_steering_gear: 'Set The Steering Gear Port %1 Speed %2 cm/s Angle %3 °',
                        whalesbot_eagle_1001_lite_execute_script: 'Execute Script',
                        // light & speaker blocks
                        whalesbot_eagle_1001_lite_ls_debug_value: 'Debugging: Data %1 %2',
                        whalesbot_eagle_1001_lite_ls_display_symbol: 'Emotion screen symbols %1 port %2',
                        whalesbot_eagle_1001_lite_ls_off_LED: 'Clear emotion screen port %1',
                        whalesbot_eagle_1001_lite_ls_display_digital_tube: 'Digital tube port %1 %2',
                        whalesbot_eagle_1001_lite_ls_display_digital_tube_score: 'Digital tube score display port %1 %2 : %3',
                        whalesbot_eagle_1001_lite_ls_off_digital_tube: 'Clear digital tube port %1',
                        whalesbot_eagle_1001_lite_ls_set_RGB: 'Set LED lights port %1 color R %2 G %3 B %4',
                        whalesbot_eagle_1001_lite_ls_fly_RGB: 'Airborne lighting %1',
                        whalesbot_eagle_1001_lite_ls_set_DO: 'Electromagnet port %1 %2',
                        whalesbot_eagle_1001_lite_ls_execute_script: 'Execute Script Without Motion',
                        // sensors
                        whalesbot_eagle_1001_lite_ss_fly_state_POS_Z: 'Flight attitude cm',
                        whalesbot_eagle_1001_lite_ss_fly_state_LASER: 'Laser ranging inside the fuselage cm',
                        whalesbot_eagle_1001_lite_ss_battery_voltage: 'Battery voltage (V)',
                        whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP: 'Main board temperature (°C)',
                        whalesbot_eagle_1001_lite_ss_attitude_angle: 'Attitude angle %1 (°)',
                        whalesbot_eagle_1001_lite_ss_flight_angular_velocity: 'Flight angular velocity %1 cm/s',
                        whalesbot_eagle_1001_lite_ss_flight_acceleration: 'Flight acceleration %1 (1g)',
                        whalesbot_eagle_1001_lite_ss_optical_flow: 'Optical flow %1 (cm)',
                        whalesbot_eagle_1001_lite_ss_get_infrared_distance: 'Infrared ranging sensor port %1 value',
                        whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool: 'Infrared port %1 obstacle detected',
                        whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string: 'Infrared port %1 obstacle detected',
                        whalesbot_eagle_1001_lite_ss_human_infrared_value_bool: 'Human infrared sensor port %1 detects a person',
                        whalesbot_eagle_1001_lite_ss_human_infrared_value_string: 'Human infrared sensor port %1 detects a person',
                        whalesbot_eagle_1001_lite_ss_AI: 'Analog input port %1 value',
                        whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance: 'Ultrasonic sensor port %1 detect distance cm',
                        whalesbot_eagle_1001_lite_ss_get_ambient_light: 'Ambient light port %1 value',
                        whalesbot_eagle_1001_lite_ss_get_temperature: 'Temperature sensor port %1 °C',
                        whalesbot_eagle_1001_lite_ss_get_humidity: 'Humidity sensor port %1 value %',
                        whalesbot_eagle_1001_lite_ss_get_flame: 'Flame sensor port %1 value',
                        whalesbot_eagle_1001_lite_ss_get_gesture: 'Gesture recognition port %1',
                        whalesbot_eagle_1001_lite_ss_get_tof: 'Laser ranging port %1',
                        whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE: 'Laser height determination %1',
                        whalesbot_eagle_1001_lite_ss_get_bt_remote_control: 'Remote control button %1 value',
                        whalesbot_eagle_1001_lite_ss_seconds: 'current timer value',
                        whalesbot_eagle_1001_lite_ss_resettime: 'Reset timer',
                    },
                    Device: {
                        whalesbot_eagle_1001_lite_lite: 'whalesbot_eagle_1001_lite_lite',
                    },
                    Menus: {
                        whalesbot_eagle_1001_lite_lite: 'WhalesbotEagle1001Lite',
                    },
                    Blocks: {
                        light_speaker: {
                            electro_magnet: { absorption: 'Absorption', break_off: 'Break off' },
                        },
                        sensor: {
                            attitude_angle: { pitch: 'Pitch', roll: 'Roll', yaw: 'Yaw' },
                            laser_height_determination: { on: 'On', off: 'Off' },
                            remote_control_button: { key: 'Key', left_rocker_x: 'Left rocker X', left_rocker_y: 'Left rocker Y', right_rocker_x: 'Right rocker X', right_rocker_y: 'Right rocker Y' },
                        },
                        whalesbot_eagle_1001_lite_toast_status_title: "Drone Status",
                        whalesbot_eagle_1001_lite_toast_prepare_download: "Prepare Downloading...",
                        whalesbot_eagle_1001_lite_toast_downloading_code: "Downloading Code...",
                        whalesbot_eagle_1001_lite_toast_download_success: "Download Code Successed",
                        whalesbot_eagle_1001_lite_toast_download_failed: "Download code failed",
                        whalesbot_eagle_1001_lite_toast_clean_failed: "Clean code failed",
                        whalesbot_eagle_1001_lite_toast_clean_success: "Clean code success",
                        whalesbot_eagle_1001_lite_toast_unsupport_block_title: "Unsupport Block",
                        whalesbot_eagle_1001_lite_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
                    }
                },
            };
        }

        getBlocks() {
            const blockColors = {
                color: {
                    light_speaker: '#5b90ff',
                    sensor: '#8066f9'
                },
                outerLine: {
                    light_speaker: '#2b6eff',
                    sensor: '#8a6bf0'
                },
            }

            const notificationType = {
                "SUCCESS": "success",
                "UNSUPPORTED": "unsupported",
                "ALERT": "alert",
            }

            let cFunctions = [];
            let _this = this;
            let sourceCode;

            const defaultSpeed = "10";
            const defaultAltitude = "50";
            const defaultOffset = "0";

            const wbOperators = {
                "EQUAL": "==",
                "NOT_EQUAL": "!=",
                "GREATER": ">",
                "GREATER_OR_EQUAL": ">=",
                "LESS": "<",
                "LESS_OR_EQUAL": "<=",
                "AND": "&&",
                "OR": "||",
            };

            const wbVariables = {
                'whalesbot_eagle_1001_lite_get_setting_speed': 'fly_state(SETSPEED)',
                'whalesbot_eagle_1001_lite_ss_fly_state_POS_Z': 'fly_state(POS_Z)',
                'whalesbot_eagle_1001_lite_ss_fly_state_LASER': 'fly_state(LASER)',
                'whalesbot_eagle_1001_lite_ss_battery_voltage': 'battery()',
                'whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP': 'fly_state(STATE_TEMP)',
                'whalesbot_eagle_1001_lite_ss_attitude_angle': 'fly_state($VALUE)',
                'whalesbot_eagle_1001_lite_ss_flight_angular_velocity': 'fly_state($VALUE)',
                'whalesbot_eagle_1001_lite_ss_flight_acceleration': 'fly_state($VALUE)',
                'whalesbot_eagle_1001_lite_ss_optical_flow': 'fly_state($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_infrared_distance': 'get_infrared_distance($VALUE)',
                'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string': 'obstacle_infrared_detected($VALUE)',
                'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool': 'obstacle_infrared_detected($VALUE)',
                'whalesbot_eagle_1001_lite_ss_human_infrared_value_string': 'human_infrared_value($VALUE)',
                'whalesbot_eagle_1001_lite_ss_human_infrared_value_bool': 'human_infrared_value($VALUE)',
                'whalesbot_eagle_1001_lite_ss_AI': 'AI($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance': 'get_ultrasonic_distance($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_ambient_light': 'get_ambient_light($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_temperature': 'get_temperature($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_humidity': 'get_humidity($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_flame': 'get_flame($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_gesture': 'get_gesture($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_tof': 'get_tof($VALUE)',
                'whalesbot_eagle_1001_lite_ss_get_bt_remote_control': 'get_bt_remote_control($VALUE)',
                'whalesbot_eagle_1001_lite_ss_seconds': 'seconds()',
            }

            const startBlocks = [
                "when_run_button_click",
                "when_some_key_pressed",
                "mouse_clicked",
                "mouse_click_cancled",
                "when_object_click",
                "when_object_click_canceled",
                'whalesbot_eagle_1001_lite_execute_script',
                'whalesbot_eagle_1001_lite_ls_debug_value',
                'whalesbot_eagle_1001_lite_ls_display_symbol',
                'whalesbot_eagle_1001_lite_ls_off_LED',
                'whalesbot_eagle_1001_lite_ls_display_digital_tube',
                'whalesbot_eagle_1001_lite_ls_display_digital_tube_score',
                'whalesbot_eagle_1001_lite_ls_off_digital_tube',
                'whalesbot_eagle_1001_lite_ls_set_RGB',
                'whalesbot_eagle_1001_lite_ls_fly_RGB',
                'whalesbot_eagle_1001_lite_ls_set_DO',
                // 'whalesbot_eagle_1001_lite_ls_execute_script',
            ]

            let globlalCVariables = {}

            function _getParameter(parameter) {
                let param = parameter.params[0] != "" ? parameter.params[0] : "0"
                if (parameter.type != "text" && parameter.type != "number" && parameter.type != "get_variable") {
                    let raw_param = wbVariables[parameter.type]
                    param = raw_param.includes("$VALUE") ? raw_param.replace("$VALUE", parameter.params[0]) : raw_param;
                } else if (parameter.type == "get_variable") {
                    param = globlalCVariables[parameter.params[0]]
                }
                return param
            }

            function _generateConditions(params) {
                let left = _getParameter(params[0])
                let operator = params[1] != undefined ? wbOperators[params[1]] : "0"
                let right = _getParameter(params[2])
                return { left, operator, right }
            }

            function generateCCode(block) {
                switch (block.type) {
                    // LOOP
                    case 'repeat_basic':
                        let times = _getParameter(block.params[0]);
                        return `\tfor(int i=0; i<${times}; ++i) {\n${block.statements[0].map((generateCCode)).join('')}\t}\n`;

                    case 'repeat_inf':
                        return `\twhile(1) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

                    case 'repeat_while_true':
                        let rpWhileDecision = {
                            "type": block.params[0].type,
                            "params": block.params[0].params,
                        };
                        let rpWhileMark = block.params[1] == 'until' ? '!' : '';
                        return `\twhile(${rpWhileMark}(${generateCCode(rpWhileDecision)})) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

                    case 'wait_second':
                        let second = _getParameter(block.params[0]);
                        return `\twait(${second});\n`;

                    case 'wait_until_true':
                        let waitUntilTrueDecision = {
                            "type": block.params[0].type,
                            "params": block.params[0].params,
                        };
                        return `\twhile(!(${generateCCode(waitUntilTrueDecision)})) {\n\t}\n`;

                    case 'stop_repeat':
                        return `\tbreak;\n`;

                    // CONDITION
                    case '_if':
                        let ifDecision = {
                            "type": block.params[0].type,
                            "params": block.params[0].params,
                        };
                        return `\tif(${generateCCode(ifDecision)}) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

                    case 'if_else':
                        let ifElseDecision = {
                            "type": block.params[0].type,
                            "params": block.params[0].params,
                        };
                        return `\tif(${generateCCode(ifElseDecision)}) {\n${block.statements[0].map(generateCCode).join('')}\t} else {\n${block.statements[1].map(generateCCode).join('')}\t}\n`;

                    // DECISION
                    case 'boolean_and_or':
                        let boolAndOrBasicLeftValue = generateCCode(block.params[0]);
                        let boolAndOrBasicOperator = wbOperators[block.params[1]];
                        let boolAndOrBasicRightValue = generateCCode(block.params[2]);
                        return `(${boolAndOrBasicLeftValue} ${boolAndOrBasicOperator} ${boolAndOrBasicRightValue})`;

                    case 'boolean_not':
                        let boolNotDecision = generateCCode(block.params[1]);
                        return `!(${boolNotDecision})`;

                    case 'boolean_basic_operator':
                        let boolBasicCondition = "0"
                        if (block.params[0].params[0] != null) {
                            let boolBasicLeftValue = _generateConditions(block.params).left;
                            let boolBasicOperator = _generateConditions(block.params).operator;
                            let boolBasicRightValue = _generateConditions(block.params).right;
                            boolBasicCondition = `(${boolBasicLeftValue} ${boolBasicOperator} ${boolBasicRightValue})`;
                        }
                        return `${boolBasicCondition}`;

                    // VARIABLE
                    case 'True':
                        return "1";

                    case 'False':
                        return "0";

                    case 'set_variable':
                        let variableName = globlalCVariables[block.params[0]];
                        let variableValue = _getParameter(block.params[1]);
                        return `\t${variableName} = ${variableValue};\n`;

                    case 'change_variable':
                        let changedVariableName = globlalCVariables[block.params[0]];
                        let changedVariableValue = _getParameter(block.params[1]);
                        return `\t${changedVariableName} += ${changedVariableValue};\n`;

                    // HARDWARE
                    case 'whalesbot_eagle_1001_lite_entering_pitch_mode':
                        return '\tfly_unlock();\n';

                    case 'whalesbot_eagle_1001_lite_exit_pitch_mode':
                        return '\tfly_lock();\n';

                    case 'whalesbot_eagle_1001_lite_automatic_take_off_height':
                        let takeOffHeight = _getParameter(block.params[0]);
                        return `\tfly_start(${takeOffHeight});\n`;

                    case 'whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset':
                        let takeOffAltitude = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultAltitude;
                        let takeOffSpeed = _getParameter(block.params[1]) != "" ? _getParameter(block.params[1]) : defaultSpeed;
                        let takeOffXoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                        let takeOffYoffset = (-10.00 <= _getParameter(block.params[3]) || _getParameter(block.params[3]) <= 10.00) ? _getParameter(block.params[3]) : defaultOffset;
                        return `\tfly_start_2(${takeOffAltitude},${takeOffSpeed},${takeOffXoffset},${takeOffYoffset});\n`

                    case 'whalesbot_eagle_1001_lite_automatic_landing':
                        return `\tfly_land();\n`;

                    case 'whalesbot_eagle_1001_lite_automatic_descent_speed_offset':
                        let automaticSpeed = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultSpeed;
                        let automaticXoffset = (-10.00 <= _getParameter(block.params[1]) || _getParameter(block.params[1]) <= 10.00) ? _getParameter(block.params[1]) : defaultOffset;
                        let automaticYoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                        return `\tfly_land_2(${automaticSpeed},${automaticXoffset},${automaticYoffset});\n`

                    case 'whalesbot_eagle_1001_lite_set_the_flight_speed':
                        let speed = _getParameter(block.params[0]);
                        return `\tfly_setspeed(${speed});\n`;

                    case 'whalesbot_eagle_1001_lite_rise':
                        let up = _getParameter(block.params[0]);
                        return `\tfly_moveto(UP,${up});\n`;

                    case 'whalesbot_eagle_1001_lite_down':
                        let down = _getParameter(block.params[0]);
                        return `\tfly_moveto(DOWN,${down});\n`;

                    case 'whalesbot_eagle_1001_lite_fly_forward':
                        let front = _getParameter(block.params[0]);
                        return `\tfly_moveto(FRONT,${front});\n`;

                    case 'whalesbot_eagle_1001_lite_fly_backward':
                        let back = _getParameter(block.params[0]);
                        return `\tfly_moveto(BACK,${back});\n`;

                    case 'whalesbot_eagle_1001_lite_fly_left':
                        let left = _getParameter(block.params[0]);
                        return `\tfly_moveto(LEFT,${left});\n`;

                    case 'whalesbot_eagle_1001_lite_fly_right':
                        let right = _getParameter(block.params[0]);
                        return `\tfly_moveto(RIGHT,${right});\n`;

                    case 'whalesbot_eagle_1001_lite_turn_left':
                        let turnLeft = _getParameter(block.params[0]);
                        if (0 > turnLeft || turnLeft > 360) {
                            turnLeft = 360
                        }
                        return `\tfly_turn(CCW,${turnLeft});\n`;

                    case 'whalesbot_eagle_1001_lite_turn_right':
                        let turnRight = _getParameter(block.params[0]);
                        if (0 > turnRight || turnRight > 360) {
                            turnRight = 360
                        }
                        return `\tfly_turn(CW,${turnRight});\n`;

                    case 'whalesbot_eagle_1001_lite_fly_in_the_specified_direction':
                        let dirSpeed = _getParameter(block.params[0]);
                        let dirDirection = _getParameter(block.params[1]);
                        if (0 > dirDirection || dirDirection > 360) {
                            dirDirection = 360
                        }
                        return `\tfly_dir(${dirSpeed},${dirDirection});\n`;

                    case 'whalesbot_eagle_1001_lite_flight_designated':
                        let disX = _getParameter(block.params[0]);
                        let disY = _getParameter(block.params[1]);
                        let disZ = _getParameter(block.params[2]);
                        let disSpeed = _getParameter(block.params[3]);
                        return `\tfly_move_dis(${disX},${disY},${disZ},${disSpeed});\n`;

                    case 'whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control':
                        let pitch = _getParameter(block.params[0]);
                        let roll = _getParameter(block.params[1]);
                        let throttle = _getParameter(block.params[2]);
                        let yaw = _getParameter(block.params[3]);
                        return `\tfly_move(${pitch},${roll},${throttle},${yaw});\n`;

                    case 'whalesbot_eagle_1001_lite_stop_moving_and_hover':
                        return `\tfly_hover();\n`;

                    case 'whalesbot_eagle_1001_lite_hover_at_specified_altitude':
                        let hoverSpecifiedAltitude = (_getParameter(block.params[0]) == "" || _getParameter(block.params[0]) < 20) ? "20" : _getParameter(block.params[0]);
                        hoverSpecifiedAltitude = (_getParameter(block.params[0]) > 200) ? "200" : _getParameter(block.params[0]);
                        return `\tfly_hover_laser(${hoverSpecifiedAltitude});\n`;

                    case 'whalesbot_eagle_1001_lite_emergency_stop':
                        return `\tfly_lock();\n`;

                    case 'whalesbot_eagle_1001_lite_set_the_steering_gear':
                        let servoSpeed = _getParameter(block.params[1]);
                        let servoAngle = _getParameter(block.params[2]);
                        if (0 > servoAngle || servoAngle > 360) {
                            servoAngle = 360
                        }
                        return `\tSetServo(P2,${servoSpeed},${servoAngle});\n`;

                    // light & speaker blocks
                    case 'whalesbot_eagle_1001_lite_ls_debug_value':
                        let lsDebugValue1 = _getParameter(block.params[0]);
                        let lsDebugValue2 = _getParameter(block.params[1]);
                        return `\tDebugValue(${lsDebugValue1}, ${lsDebugValue2});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_display_symbol':
                        let lsDisplaySymbol = block.params[0];
                        let lsDisplaySymbolPort = block.params[1];
                        return `\tdisplay_symbol(${lsDisplaySymbolPort}, ${lsDisplaySymbol});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_off_LED':
                        let lsOffLedPort = block.params[0];
                        return `\toff_LED(${lsOffLedPort});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_display_digital_tube':
                        let lsDisplayDigitalTubePort = block.params[0];
                        let lsDisplayDigitalTubeValue = _getParameter(block.params[1]);
                        return `\tdisplay_digital_tube(${lsDisplayDigitalTubePort}, ${lsDisplayDigitalTubeValue});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_display_digital_tube_score':
                        let lsDisplayDigitalTubeScorePort = block.params[0];
                        let lsDisplayDigitalTubeScoreValue1 = _getParameter(block.params[1]);
                        let lsDisplayDigitalTubeScoreValue2 = _getParameter(block.params[2]);
                        return `\tdisplay_digital_tube_score(${lsDisplayDigitalTubeScorePort}, ${lsDisplayDigitalTubeScoreValue1}, ${lsDisplayDigitalTubeScoreValue2});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_off_digital_tube':
                        let lsOffDigitalTubePort = block.params[0];
                        return `\toff_digital_tube(${lsOffDigitalTubePort});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_set_RGB':
                        let lsSetRGBPort = block.params[0];
                        let lsSetRGBR = _getParameter(block.params[1]);
                        let lsSetRGBG = _getParameter(block.params[2]);
                        let lsSetRGBB = _getParameter(block.params[3]);
                        return `\tset_RGB(${lsSetRGBPort}, ${lsSetRGBR}, ${lsSetRGBG}, ${lsSetRGBB});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_fly_RGB':
                        let lsFlyRGB = block.params[0];
                        // let lsFlyRGBR = _getParameter(block.params[1]);
                        // let lsFlyRGBG = _getParameter(block.params[2]);
                        // let lsFlyRGBB = _getParameter(block.params[3]);
                        return `\tfly_RGB(${lsFlyRGB});\n`;

                    case 'whalesbot_eagle_1001_lite_ls_set_DO':
                        let lsSetDOPort = block.params[0];
                        let lsSetDOValue = block.params[1];
                        return `\tSetDO(${lsSetDOPort}, ${lsSetDOValue});\n`;

                    // sensors
                    case 'whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE':
                        let ssFlySetpointToggle = block.params[0];
                        return `\tfly_setpoint(LASER_ENABLE, ${ssFlySetpointToggle});\n`;

                    case 'whalesbot_eagle_1001_lite_ss_resettime':
                        return `\tresettime();\n`;

                    case 'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool':
                        let ssBbstacleInfraredDetectedBool = block.params[0];
                        return `obstacle_infrared_detected(${ssBbstacleInfraredDetectedBool})`;

                    default:
                        if (!startBlocks.includes(block.type)) {
                            _this.unsupportBlockExist = true;
                        }
                        return '';
                }
            }

            function setUpCVariables(variable) {
                if (variable.visible) {
                    const varName = `var_${variable.name}`
                    globlalCVariables[variable.id] = varName
                    const varValue = variable.value;
                    return `float ${varName} = ${varValue};\n`
                }
                return ""
            }

            function openedSimulatorPopup() {
                if (_this.simulatorPopup == null) {
                    return false;
                }
                return !_this.simulatorPopup.closed;
            }

            function notify(type, msg) {
                switch (type) {
                    case notificationType["SUCCESS"]:
                        Entry.toast.success(
                            Lang.Blocks.whalesbot_mc_102_toast_success_title,
                            msg
                        );
                        break;
                    default:
                        Entry.toast.alert(
                            Lang.Blocks.whalesbot_mc_102_toast_alert_title,
                            msg
                        );
                }
            }

            return {
                whalesbot_eagle_1001_lite_openning_3d_simulator: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_without_next',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_openning_3d_simulator',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const width = window.innerWidth * 0.8;
                        const height = window.innerHeight * 0.8;
                        _this.simulatorPopup = window.open(
                            metadata.simulator_url,
                            'DroneSimulatorPopup',
                            `width=${width},height=${height}`
                        );
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_openning_3d_simulator()'] },
                },
                whalesbot_eagle_1001_lite_restart: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_without_next',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/moving_icon.svg',
                            size: 11,
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_restart',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        await _this.sendPacket(_this.getStateCode);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_restart()'] },
                },
                whalesbot_eagle_1001_lite_clean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_without_next',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/moving_icon.svg',
                            size: 11,
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_clean',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        await _this.sendPacket(_this.stopCode);
                        await _this.sendPacket(_this.stopCode);
                        Entry.toast.success(Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_clean_success);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_clean()'] },
                },
                whalesbot_eagle_1001_lite_get_status: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                            img: 'block_icon/moving_icon.svg',
                            size: 11,
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_get_status',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        await _this.handleGetStatus();
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_get_status()'] },
                },
                whalesbot_eagle_1001_lite_entering_pitch_mode: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_entering_pitch_mode',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        await _this.sendPacket(_this.getStateCode);
                        await _this.sendPacket(_this.getStateCode);
                        cFunctions.push(`fly_unlock();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_entering_pitch_mode()'] },
                },
                whalesbot_eagle_1001_lite_exit_pitch_mode: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_without_next',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_exit_pitch_mode',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        const project = _this.exportProject();
                        const listVariables = project.variables;
                        const rawScript = project.objects[0].script;
                        const allScript = JSON.parse(rawScript);
                        const droneScript = allScript.filter((arr) => arr.length > 2);

                        sourceCode = `#include "whalesbot.h"\n${listVariables.map(setUpCVariables).join('')}\nvoid user_main() {\n`;
                        sourceCode += `${droneScript[0].map(generateCCode).join('')}}\n\nuser_main();`;

                        if (_this.unsupportBlockExist) {
                            Entry.toast.alert(
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_unsupport_block_title,
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_unsupport_block_msg
                            )
                            _this.unsupportBlockExist = false;
                            Entry.engine.toggleStop();
                            return;
                        }
                        console.log(sourceCode)

                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_prepare_download
                        );
                        await _this.handleClean();
                        await _this.sleep(3000);
                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_downloading_code
                        );
                        await _this.downloadCode(sourceCode);
                        await _this.sleep(4000);
                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_download_success
                        );
                        await _this.handleRun();
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_exit_pitch_mode()'] },
                },
                whalesbot_eagle_1001_lite_automatic_take_off_height: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['100'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_automatic_take_off_height',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        cFunctions.push(`fly_start(${script.getValue('VALUE')})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_automatic_take_off_height();'] },
                },
                whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset',
                    },
                    paramsKeyMap: {
                        altitude: 0,
                        speed: 1,
                        x: 2,
                        y: 3,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        cFunctions.push(`fly_start(${script.getValue('VALUE')})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_automatic_take_off_altitude_speed_offset();'] },
                },
                whalesbot_eagle_1001_lite_automatic_landing: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_automatic_landing',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        cFunctions.push(`fly_land();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_automatic_landing()'] },
                },
                whalesbot_eagle_1001_lite_automatic_descent_speed_offset: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_automatic_descent_speed_offset',
                    },
                    paramsKeyMap: {
                        speed: 0,
                        x: 1,
                        y: 2,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        cFunctions.push(`fly_land_2();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_automatic_descent_speed_offset()'] },
                },
                whalesbot_eagle_1001_lite_set_the_flight_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_set_the_flight_speed',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        const speed = script.getValue('SPEED');
                        cFunctions.push(`fly_setspeed(${speed});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_set_the_flight_speed()'] },
                },
                whalesbot_eagle_1001_lite_get_setting_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_get_setting_speed',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        cFunctions.push(`fly_state(SETSPEED);`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_get_setting_speed()'] },
                },
                whalesbot_eagle_1001_lite_rise: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_rise',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(UP,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_rise();'] },
                },
                whalesbot_eagle_1001_lite_down: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_down',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(DOWN,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_down();'] },
                },
                whalesbot_eagle_1001_lite_fly_forward: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_fly_forward',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(FRONT,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_fly_forward();'] },
                },
                whalesbot_eagle_1001_lite_fly_backward: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_fly_backward',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(BACK,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_fly_backward();'] },
                },
                whalesbot_eagle_1001_lite_fly_left: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_fly_left',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(LEFT,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_fly_left();'] },
                },
                whalesbot_eagle_1001_lite_fly_right: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_fly_right',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(RIGHT,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_fly_right();'] },
                },
                whalesbot_eagle_1001_lite_turn_left: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['90'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_turn_left',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        if (value < 0 && value > 360) {
                            value = 360
                        }
                        cFunctions.push(`fly_turn(CCW,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_turn_left();'] },
                },
                whalesbot_eagle_1001_lite_turn_right: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['90'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_turn_right',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const value = script.getValue('value');
                        if (value < 0 && value > 360) {
                            value = 360
                        }
                        cFunctions.push(`fly_turn(CW,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_turn_right();'] },
                },
                whalesbot_eagle_1001_lite_fly_in_the_specified_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['30'],
                            },
                            {
                                type: 'number',
                                params: ['0'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_fly_in_the_specified_direction',
                    },
                    paramsKeyMap: {
                        speed: 0,
                        direction: 1,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const speed = script.getValue('speed');
                        const direction = script.getValue('direction');
                        if (direction < 0 && direction > 360) {
                            direction = 360
                        }
                        cFunctions.push(`fly_dir(${speed},${direction});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_fly_in_the_specified_direction();'] },
                },
                whalesbot_eagle_1001_lite_flight_designated: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['30'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_flight_designated',
                    },
                    paramsKeyMap: {
                        x: 0,
                        y: 1,
                        z: 2,
                        speed: 3,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const x = script.getValue('x');
                        const y = script.getValue('y');
                        const z = script.getValue('z');
                        const speed = script.getValue('speed');
                        cFunctions.push(`fly_move_dis(${x},${y},${z},${speed})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_flight_designated();'] },
                },
                whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['50'],
                            },
                            {
                                type: 'number',
                                params: ['50'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control',
                    },
                    paramsKeyMap: {
                        pitch: 0,
                        roll: 1,
                        throttle: 2,
                        yaw: 3,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const pitch = script.getValue('pitch');
                        const roll = script.getValue('roll');
                        const throttle = script.getValue('throttle');
                        const yaw = script.getValue('yaw');
                        cFunctions.push(`fly_move(${pitch},${roll},${throttle},${yaw});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_set_the_four_channel_lever_quantity_of_remote_control();'] },
                },
                whalesbot_eagle_1001_lite_stop_moving_and_hover: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'whalesbot_eagle_1001_lite_stop_moving_and_hover',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        cFunctions.push(`fly_hover();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_stop_moving_and_hover();'] },
                },
                whalesbot_eagle_1001_lite_hover_at_specified_altitude: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['20'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_hover_at_specified_altitude',
                    },
                    paramsKeyMap: {
                        altitude: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        cFunctions.push(`fly_hover_laser();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_hover_at_specified_altitude();'] },
                },
                whalesbot_eagle_1001_lite_emergency_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_emergency_stop',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        cFunctions.push(`fly_lock();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_emergency_stop()'] },
                },
                whalesbot_eagle_1001_lite_set_the_steering_gear: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P2', 'P2'],
                            ],
                            value: 'P2',
                            fontSize: 10,
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
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'number',
                                params: ['40'],
                            },
                            {
                                type: 'number',
                                params: ['90'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_set_the_steering_gear',
                    },
                    paramsKeyMap: {
                        port: 0,
                        speed: 1,
                        angle: 2,
                    },
                    class: 'whalesbot_eagle_1001_lite_lite',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const speed = script.getValue('speed');
                        const angle = script.getValue('angle');
                        cFunctions.push(`SetServo(P2,${speed},${angle});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_set_the_steering_gear();'] },
                },
                // whalesbot_eagle_1001_lite_execute_script: {
                //     color: EntryStatic.colorSet.block.default.HARDWARE,
                //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                //     fontColor: '#fff',
                //     skeleton: 'basic_without_next',
                //     statements: [],
                //     params: [
                //         {
                //             type: 'Block',
                //             accept: 'string',
                //             defaultType: 'number',
                //         },
                //         {
                //             type: 'Indicator',
                //             img: 'block_icon/moving_icon.svg',
                //             size: 11,
                //         },
                //     ],
                //     events: {},
                //     def: {
                //         type: 'whalesbot_eagle_1001_lite_execute_script',
                //     },
                //     paramsKeyMap: {
                //         VALUE: 0,
                //     },
                //     class: 'whalesbot_eagle_1001_lite_lite',
                //     isNotFor: ['WhalesbotDroneLite'],
                //     async func(sprite, script) {
                //         if (openedSimulatorPopup()) {
                //             _this.simulatorPopup.postMessage({
                //                 function: "enteringPitchMode",
                //                 args: [],
                //                 script: sourceCode
                //             }, '*');
                //             return;
                //         }
                //         await _this.sendPacket(_this.runCode);
                //     },
                //     syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_execute_script()'] },
                // },

                // light & speaker blocks
                whalesbot_eagle_1001_lite_ls_debug_value: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'number',
                                params: ['1'],
                            },
                            {
                                type: 'number',
                                params: [''],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_debug_value',
                    },
                    paramsKeyMap: {
                        VALUE1: 0,
                        VALUE2: 1,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var value1 = Number(script.values[0]);
                        var value2 = Number(script.values[1]);
                        if (value1 < 1 || value1 > 6) {
                            notify(notificationType.ALERT, 'Debugging: Data [1 ~ 6] and [0 ~ 999999]')
                            _this.invalidParamValue = true;
                            throw new Error();
                        }
                        if (value2 < 0 || value2 > 999999) {
                            notify(notificationType.ALERT, 'Debugging: Data [1 ~ 6] and [0 ~ 999999]')
                            _this.invalidParamValue = true;
                            throw new Error();
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_debug_value()'] },
                },

                whalesbot_eagle_1001_lite_ls_display_symbol: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['?', 'LED_symbol_question_mark'], ['!', 'LED_symbol_exclamation'], ['$', 'LED_symbol_dollar'], ['¥', 'LED_symbol_RMB'],
                                ['=', 'LED_symbol_equal'], ['+', 'LED_symbol_plus'], ['-', 'LED_symbol_minus'], ['x', 'LED_symbol_multiplied'],
                                ['÷', 'LED_symbol_divided'], ['0', 'LED_symbol_0'], ['1', 'LED_symbol_1'], ['2', 'LED_symbol_2'],
                                ['3', 'LED_symbol_3'], ['4', 'LED_symbol_4'], ['5', 'LED_symbol_5'], ['6', 'LED_symbol_6'],
                                ['7', 'LED_symbol_7'], ['8', 'LED_symbol_8'], ['9', 'LED_symbol_9'], ['A', 'LED_symbol_A'],
                                ['B', 'LED_symbol_B'], ['C', 'LED_symbol_C'], ['D', 'LED_symbol_D'], ['E', 'LED_symbol_E'],
                                ['F', 'LED_symbol_F'], ['G', 'LED_symbol_G'], ['H', 'LED_symbol_H'], ['I', 'LED_symbol_I'],
                                ['J', 'LED_symbol_J'], ['K', 'LED_symbol_K'], ['L', 'LED_symbol_L'], ['M', 'LED_symbol_M'],
                                ['N', 'LED_symbol_N'], ['O', 'LED_symbol_O'], ['P', 'LED_symbol_P'], ['Q', 'LED_symbol_Q'],
                                ['R', 'LED_symbol_R'], ['S', 'LED_symbol_S'], ['T', 'LED_symbol_T'], ['U', 'LED_symbol_U'],
                                ['V', 'LED_symbol_V'], ['W', 'LED_symbol_W'], ['X', 'LED_symbol_X'], ['Y', 'LED_symbol_Y'],
                                ['Z', 'LED_symbol_Z'], ['❤︎', 'LED_symbol_big_heart'], ['♥︎', 'LED_symbol_little_heart'], ['↑', 'LED_symbol_forward'],
                                ['↓', 'LED_symbol_backward'], ['←', 'LED_symbol_turnleft'], ['→', 'LED_symbol_turnright'], ['GO', 'LED_symbol_GO'],
                                ['⊘', 'LED_symbol_stop'],
                            ],
                            value: 'LED_symbol_question_mark',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_display_symbol',
                    },
                    paramsKeyMap: {
                        SYMBOLS: 0,
                        PORT: 1,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_display_symbol()'] },
                },

                whalesbot_eagle_1001_lite_ls_off_LED: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_off_LED',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_off_LED()'] },
                },

                whalesbot_eagle_1001_lite_ls_display_digital_tube: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                                params: [''],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_display_digital_tube',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        NUMBER: 1,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var number = Number(script.values[1]);
                        if (number < 0 || number > 9999) {
                            notify(notificationType.ALERT, '0 ~ 9999')
                            _this.invalidParamValue = true;
                            throw new Error();
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_display_digital_tube()'] },
                },

                whalesbot_eagle_1001_lite_ls_display_digital_tube_score: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
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
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'number',
                                params: [''],
                            },
                            {
                                type: 'number',
                                params: [''],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_display_digital_tube_score',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        NUMBER1: 1,
                        NUMBER2: 2,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var number1 = Number(script.values[1]);
                        var number2 = Number(script.values[2]);
                        if (number1 < 0 || number1 > 9999 || number2 < 0 || number2 > 9999) {
                            notify(notificationType.ALERT, '0 ~ 9999')
                            _this.invalidParamValue = true;
                            throw new Error();
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_display_digital_tube_score()'] },
                },

                whalesbot_eagle_1001_lite_ls_off_digital_tube: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_off_digital_tube',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_off_digital_tube()'] },
                },

                whalesbot_eagle_1001_lite_ls_set_RGB: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
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
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
                            },
                            {
                                type: 'number',
                                params: ['255'],
                            },
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_set_RGB',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var red = Number(script.values[1]);
                        var green = Number(script.values[2]);
                        var blue = Number(script.values[3]);
                        if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
                            notify(notificationType.ALERT, '0 ~ 255')
                            _this.invalidParamValue = true;
                            throw new Error();
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_set_RGB()'] },
                },

                whalesbot_eagle_1001_lite_ls_fly_RGB: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['⚪', 'color_white'], ['🟡', 'color_yellow'],
                                ['🟣', 'color_purple'], ['🟦', 'color_cyan'],
                                ['🔴', 'color_red'], ['🟢', 'color_green'],
                                ['🔵', 'color_blue'], ['⚫', 'color_black'],
                            ],
                            value: 'color_white',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_fly_RGB',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_fly_RGB()'] },
                },

                whalesbot_eagle_1001_lite_ls_set_DO: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.light_speaker.electro_magnet.absorption, 'true'],
                                [Lang.Blocks.light_speaker.electro_magnet.break_off, 'false']
                            ],
                            value: 'true',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ls_set_DO',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        ELECTROMAGNET: 1,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_set_DO()'] },
                },

                whalesbot_eagle_1001_lite_ls_execute_script: {
                    color: blockColors.color.light_speaker,
                    outerLine: blockColors.outerLine.light_speaker,
                    fontColor: '#fff',
                    skeleton: 'basic_without_next',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/moving_icon.svg',
                            size: 11,
                        },
                    ],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ls_execute_script',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'whalesbot_eagle_1001_lite_ls',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        const project = _this.exportProject();
                        const listVariables = project.variables;
                        const rawScript = project.objects[0].script;
                        const allScript = JSON.parse(rawScript);
                        const droneScript = allScript.filter((arr) => arr.length > 2);

                        let sourceCode = `#include "whalesbot.h"\n${listVariables.map(setUpCVariables).join('')}\nvoid user_main() {\n`;
                        sourceCode += `${droneScript[0].map(generateCCode).join('')}}\n\nuser_main();`;

                        if (_this.unsupportBlockExist) {
                            Entry.toast.alert(
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_unsupport_block_title,
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_unsupport_block_msg
                            )
                            _this.unsupportBlockExist = false;
                            Entry.engine.toggleStop();
                            return;
                        }

                        if (_this.invalidParamValue) {
                            _this.invalidParamValue = false;
                            return;
                        }

                        if (openedSimulatorPopup()) {
                            Entry.toast.success(
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_download_success
                            );
                            return;
                        }

                        console.log(sourceCode);

                        _this.sendCmd(sourceCode);

                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_lite_toast_prepare_download
                        );
                        setTimeout(() => {
                            Entry.toast.success(
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                                Lang.Blocks.whalesbot_eagle_1001_lite_toast_downloading_code
                            );
                            setTimeout(() => {
                                Entry.toast.success(
                                    Lang.Blocks.whalesbot_eagle_1001_lite_toast_status_title,
                                    Lang.Blocks.whalesbot_eagle_1001_lite_toast_download_success
                                );
                            }, 3000);
                        }, 4000);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ls_execute_script()'] },
                },

                // sensors
                whalesbot_eagle_1001_lite_ss_fly_state_POS_Z: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_fly_state_POS_Z',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        _this.sleep();
                        return _this.sensor.state_position_z || '0';
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_fly_state_POS_Z()'] },
                },

                whalesbot_eagle_1001_lite_ss_fly_state_LASER: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_fly_state_LASER',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        _this.sleep();
                        return _this.sensor.LaserTof || '0';
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_fly_state_LASER()'] },
                },

                whalesbot_eagle_1001_lite_ss_battery_voltage: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_battery_voltage',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        _this.sleep();
                        return _this.sensor.Battery || '0';
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_battery_voltage()'] },
                },

                whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        _this.sleep();
                        return _this.sensor.SPL06_temp || '0';
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_fly_state_STATE_TEMP()'] },
                },

                whalesbot_eagle_1001_lite_ss_attitude_angle: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.sensor.attitude_angle.pitch, 'STATE_PITCH'],
                                [Lang.Blocks.sensor.attitude_angle.roll, 'STATE_ROLL'],
                                [Lang.Blocks.sensor.attitude_angle.yaw, 'STATE_YAW'],
                            ],
                            value: 'STATE_PITCH',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_attitude_angle',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var state = script.values[0];
                        if (state === 'STATE_PITCH') {
                            _this.sleep();
                            return _this.sensor.Pitch || '0';
                        } else if (state === 'STATE_ROLL') {
                            _this.sleep();
                            return _this.sensor.Roll || '0';
                        } else if (state === 'STATE_YAW') {
                            _this.sleep();
                            return _this.sensor.Yaw || '0';
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_attitude_angle()'] },
                },

                whalesbot_eagle_1001_lite_ss_flight_angular_velocity: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['X', 'GYPO_X'], ['Y', 'GYPO_Y'], ['Z', 'GYPO_Z'],
                            ],
                            value: 'GYPO_X',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_flight_angular_velocity',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var state = script.values[0];
                        if (state === 'GYPO_X') {
                            _this.sleep();
                            return _this.sensor.Gypo_x || '0';
                        } else if (state === 'GYPO_Y') {
                            _this.sleep();
                            return _this.sensor.Gypo_y || '0';
                        } else if (state === 'GYPO_Z') {
                            _this.sleep();
                            return _this.sensor.Gypo_z || '0';
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_flight_angular_velocity()'] },
                },

                whalesbot_eagle_1001_lite_ss_flight_acceleration: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['X', 'ACC_X'], ['Y', 'ACC_Y'], ['Z', 'ACC_Z'],
                            ],
                            value: 'ACC_X',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_flight_acceleration',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        var state = script.values[0];
                        if (state === 'ACC_X') {
                            _this.sleep();
                            return _this.sensor.ACC_x || '0';
                        } else if (state === 'ACC_Y') {
                            _this.sleep();
                            return _this.sensor.ACC_y || '0';
                        } else if (state === 'ACC_Z') {
                            _this.sleep();
                            return _this.sensor.ACC_z || '0';
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_flight_acceleration()'] },
                },

                whalesbot_eagle_1001_lite_ss_optical_flow: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['X', 'OPX'], ['Y', 'OPY']
                            ],
                            value: 'OPX',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_optical_flow',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_optical_flow()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_infrared_distance: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_infrared_distance',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_infrared_distance()'] },
                },

                whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_string()'] },
                },

                whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_obstacle_infrared_detected_bool()'] },
                },

                whalesbot_eagle_1001_lite_ss_human_infrared_value_string: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_human_infrared_value_string',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_human_infrared_value_string()'] },
                },

                whalesbot_eagle_1001_lite_ss_human_infrared_value_bool: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_human_infrared_value_bool',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_human_infrared_value_bool()'] },
                },

                whalesbot_eagle_1001_lite_ss_AI: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_AI',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_AI()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_ultrasonic_distance()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_ambient_light: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_ambient_light',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_ambient_light()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_temperature: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_temperature',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_temperature()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_humidity: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_humidity',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_humidity()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_flame: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_flame',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_flame()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_gesture: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_gesture',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_gesture()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_tof: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['P1', 'P1'], ['P2', 'P2']
                            ],
                            value: 'P1',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_tof',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_tof()'] },
                },

                whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.sensor.laser_height_determination.on, 'true'],
                                [Lang.Blocks.sensor.laser_height_determination.off, 'false']
                            ],
                            value: 'true',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_fly_setpoint_LASER_ENABLE()'] },
                },

                whalesbot_eagle_1001_lite_ss_get_bt_remote_control: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.sensor.remote_control_button.key, 'BTKEY'],
                                [Lang.Blocks.sensor.remote_control_button.left_rocker_x, 'BTSTICK2'],
                                [Lang.Blocks.sensor.remote_control_button.left_rocker_y, 'BTSTICK1'],
                                [Lang.Blocks.sensor.remote_control_button.right_rocker_x, 'BTSTICK4'],
                                [Lang.Blocks.sensor.remote_control_button.right_rocker_y, 'BTSTICK3'],
                            ],
                            value: 'BTKEY',
                            fontSize: 10,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                        ],
                        type: 'whalesbot_eagle_1001_lite_ss_get_bt_remote_control',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_get_bt_remote_control()'] },
                },

                whalesbot_eagle_1001_lite_ss_seconds: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_seconds',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_seconds()'] },
                },

                whalesbot_eagle_1001_lite_ss_resettime: {
                    color: blockColors.color.sensor,
                    outerLine: blockColors.outerLine.sensor,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_eagle_1001_lite_ss_resettime',
                    },
                    paramsKeyMap: {},
                    class: 'whalesbot_eagle_1001_lite_ss',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_lite_ss_resettime()'] },
                },
            };
        }
    })();
})();

module.exports = Entry.WhalesbotDroneLite;