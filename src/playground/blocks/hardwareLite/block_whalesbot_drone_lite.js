'use strict';

// - 라이프사이클 재점검
// - Entry.hw 부분 Entry.hwLite로 수정
// - portData 파라미터 확인
// - 모니터링 로직 확인

import _range from 'lodash/range';
import DataTable from '../../../class/DataTable';
import entryModuleLoader from '../../../class/entryModuleLoader';
import metadata from './metadata_whalesbot_drone_lite.json';

(function() {
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
                //'whalesbot_drone_openning_3d_simulator',
                'whalesbot_drone_entering_pitch_mode',
                'whalesbot_drone_exit_pitch_mode',
                'whalesbot_drone_automatic_take_off_height',
                'whalesbot_drone_automatic_take_off_altitude_speed_offset',
                'whalesbot_drone_automatic_landing',
                'whalesbot_drone_automatic_descent_speed_offset',
                'whalesbot_drone_set_the_flight_speed',
                'whalesbot_drone_get_setting_speed',
                'whalesbot_drone_rise',
                'whalesbot_drone_down',
                'whalesbot_drone_fly_forward',
                'whalesbot_drone_fly_backward',
                'whalesbot_drone_fly_left',
                'whalesbot_drone_fly_right',
                'whalesbot_drone_turn_left',
                'whalesbot_drone_turn_right',
                'whalesbot_drone_fly_in_the_specified_direction',
                'whalesbot_drone_flight_designated',
                'whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control',
                'whalesbot_drone_stop_moving_and_hover',
                'whalesbot_drone_hover_at_specified_altitude',
                'whalesbot_drone_emergency_stop',
                'whalesbot_drone_set_the_steering_gear',
                'whalesbot_drone_execute_script',
                'whalesbot_drone_clean',
                'whalesbot_drone_restart'
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
            this.revtemplength = 0 ;
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
                0x77,  0x78,  0x66,  0x1,  0x2,  0x2,  0x3,  0x3,  0x4,  0x4,  0x5,  0x5, 
                0x6,  0x6,  0x7,  0x7,  0x8,  0x8,  0x9,  0x9,  0xa,  0xa,  0xb,  0xb,  0xc,  0xc, 
                0xd,  0xd,  0xe,  0xe,  0xf,  0xf,  0x10,  0x10,  0x11,  0x11,  0x12,  0x12,  0x13,
                0x13,  0x14,  0x14,  0x15,  0x15,  0x16,  0x16,  0x17,  0x17,  0x18,  0x18, 
                0x19,  0x19,  0x1a,  0x1a,  0x1b,  0x1b,  0x1c,  0x1c,  0x1d,  0x1d,  0x1e,  0x1e, 
                0x1f,  0x1f,  0x20,  0x20,  0x21,  0x21,  0x22,  0x22,  0x23,  0x23,  0x24,  0x24, 
                0x25,  0x25,  0x26,  0x26,  0x27,  0x27,  0x28,  0x28,  0x29,  0x29,  0x2a,  0x2a, 
                0x2b,  0x2b,  0x2c,  0x2c,  0x2d,  0x2d,  0x2e,  0x2e,  0x2f,  0x2f,  0x30,  0x30, 
                0x31,  0x31,  0x32,  0x32,  0x33,  0x33,  0x34,  0x34,  0x35,  0x35,  0x36,  0x36, 
                0x37,  0x37,  0x38,  0x38,  0x39,  0x39,  0x3a,  0x3a,  0x3b,  0x3b,  0x3c,  0x3c, 
                0x3d,  0x3d,  0x3e,  0x3e,  0x3f,  0x3f,  0x40,  0x40,  0x41,  0x41,  0x42,  0x42, 
                0x43,  0x43,  0x44,  0x44,  0x45,  0x45,  0x46,  0x46,  0x47,  0x47,  0x48,  0x48, 
                0x49,  0x49,  0x4a,  0x4a,  0x4b,  0x4b,  0x0,  0x56
            ];

            this.getStateCode = [
                0x77,0x78,0x50,0x1,0x2,0x2,0x3,0x3,0x4,0x4,0x5,0x5,0x6,0x6,0x7,0x7,0x8,0x8,0x9,0x9,
                0xa,0xa,0xb,0xb,0xc,0xc,0xd,0xd,0xe,0xe,0xf,0xf,0x10,0x10,0x11,0x11,0x12,0x12
                ,0x13,0x13,0x14,0x14,0x15,0x15,0x16,0x16,0x17,0x17,0x18,0x18,0x19,0x19,0x1a,0x1a
                ,0x1b,0x1b,0x1c,0x1c,0x1d,0x1d,0x1e,0x1e,0x1f,0x1f,0x20,0x20,0x21,0x21,0x22,0x22
                ,0x23,0x23,0x24,0x24,0x25,0x25,0x26,0x26,0x27,0x27,0x28,0x28,0x29,0x29,0x2a,0x2a
                ,0x2b,0x2b,0x2c,0x2c,0x2d,0x2d,0x2e,0x2e,0x2f,0x2f,0x30,0x30,0x31,0x31,0x32,0x32
                ,0x33,0x33,0x34,0x34,0x35,0x35,0x36,0x36,0x37,0x37,0x38,0x38,0x39,0x39,0x3a,0x3a
                ,0x3b,0x3b,0x3c,0x3c,0x3d,0x3d,0x3e,0x3e,0x3f,0x3f,0x40,0x40,0x41,0x41,0x42,0x42
                ,0x43,0x43,0x44,0x44,0x45,0x45,0x46,0x46,0x47,0x47,0x48,0x48,0x49,0x49,0x4a,0x4a
                ,0x4b,0x4b,0x0,0x6c
            ];

            this.stopCode = [
                0x77,  0x78,  0x68,  0x1,  0x2,  0x2,  0x3,  0x3,  0x4,  0x4,  0x5,  0x5,
                0x6,  0x6,  0x7,  0x7,  0x8,  0x8,  0x9,  0x9,  0xa,  0xa,  0xb,  0xb,  0xc,
                0xc,  0xd,  0xd,  0xe,  0xe,  0xf,  0xf,  0x10,  0x10,  0x11,  0x11,  0x12,
                0x12,  0x13,  0x13,  0x14,  0x14,  0x15,  0x15,  0x16,  0x16,  0x17,  0x17,
                0x18,  0x18,  0x19,  0x19,  0x1a,  0x1a,  0x1b,  0x1b,  0x1c,  0x1c,  0x1d,
                0x1d,  0x1e,  0x1e,  0x1f,  0x1f,  0x20,  0x20,  0x21,  0x21,  0x22,  0x22,
                0x23,  0x23,  0x24,  0x24,  0x25,  0x25,  0x26,  0x26,  0x27,  0x27,  0x28,
                0x28,  0x29,  0x29,  0x2a,  0x2a,  0x2b,  0x2b,  0x2c,  0x2c,  0x2d,  0x2d,
                0x2e,  0x2e,  0x2f,  0x2f,  0x30,  0x30,  0x31,  0x31,  0x32,  0x32,  0x33,
                0x33,  0x34,  0x34,  0x35,  0x35,  0x36,  0x36,  0x37,  0x37,  0x38,  0x38,
                0x39,  0x39,  0x3a,  0x3a,  0x3b,  0x3b,  0x3c,  0x3c,  0x3d,  0x3d,  0x3e,
                0x3e,  0x3f,  0x3f,  0x40,  0x40,  0x41,  0x41,  0x42,  0x42,  0x43,  0x43,
                0x44,  0x44,  0x45,  0x45,  0x46,  0x46,  0x47,  0x47,  0x48,  0x48,  0x49,
                0x49,  0x4a,  0x4a,  0x4b,  0x4b,  0x0,  0x54
            ];
            this.simulatorPopup = null;
            this.setZero();
            this.unsupportBlockExist = false;
            this.getStateTimeSleep = 500;
            this.lock= false;
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
            this.BIT0    =0x01;
            this.BIT1    =0x02;
            this.BIT2    =0x04;
            this.BIT3    =0x08;
            this.BIT4    =0x10;
            this.BIT5    =0x20;
            this.BIT6    =0x40;
            this.BIT7    =0x80;

            this.simulatorUrl = metadata.simulator_url;
        }

        setZero() {
            if (Entry.hwLite && Entry.hwLite.serial) {
                Entry.hwLite.serial.update();
            }
        }

        lockGetState(lock){
            this.lock = lock
        }

        isLockGetState(){
            return this.lock;
        }
        
        connectDrone(){
            this.getStateInterval = setInterval(()=>{
                if(this.countDroneConnectionAttempt == 0 || !this.isLockGetState()){
                    this.sendPacket(this.getStateCode);
                    console.log("Connection Attempt",this.countDroneConnectionAttempt+1)
                    this.countDroneConnectionAttempt = this.countDroneConnectionAttempt +1
                    if(this.isDroneConnection == false){
                        if( this.countDroneConnectionAttempt == 4){
                            console.log("Connection failed");
                            this.countDroneConnectionAttempt = 0 ;
                            clearInterval(this.getStateInterval);    
                            return
                        }
                    }
                    else{
                        console.log("Connection succeed");
                        console.log("Drone is connected")
                        this.isDroneConnection = true;
                        this.countDroneConnectionAttempt = 0 ;
                        clearInterval(this.getStateInterval);    
                    }
                }
            },this.getStateTimeSleep)
            this.getStateInterval;
            
        }

        waitRevData(data){
            var prevrevtemplength= this.revtemplength;
                this.revtemplength += data.length;
            // console.log(data.length);
            console.log("prevrevtemplength: ",prevrevtemplength);
            console.log("revtemplength: ",this.revtemplength);
            if(this.revtemplength <= this.DATAREVLEN){
                for (let i = 0; i < data.length; i++) {
                    this.revtmpdata[prevrevtemplength +i] = data[i];
                }
                if(this.revtemplength==this.DATAREVLEN){
                    console.log("revtempdata")
                    console.log(this.revtmpdata);
                    console.log(this.revtmpdata[this.BT_INDEX_REVCHECKSUM]+"=="+this.calChecksum(this.revtmpdata));
                    // if(parseInt(this.revtmpdata[this.BT_INDEX_REVCHECKSUM]) === this.calChecksum(this.revtmpdata) ){
                        for (let i = 0; i <this.DATAREVLEN ; i++) {
                            this.revdata[i] = parseInt(this.revtmpdata[i])
                        }
                        console.log("revdata: ",this.revdata);

                        this.getInjectStatus(this.revdata);
                        this.revtemplength = 0;
                        this.revtmpdata = [];
                    // }
                    // else{
                    //     console.log("Checksum error");
                    //     this.revtemplength = 0;
                    //     this.revtmpdata = []
                    // }
                }
            }
            else{
                console.log("Download error")
                this.revtemplength = 0;
                this.revtmpdata = []
            }
        }
        checkGetState(data){
            var prevrevtemplength= this.revtemplength;
            this.revtemplength += data.length
            console.log("prevrevtemplength: ",prevrevtemplength);
            console.log("revtemplength: ",this.revtemplength);
            for (let i = 0; i < data.length; i++) {
                this.revtmpdata[prevrevtemplength +i] = data[i];
            }
            if (this.revtemplength <=20) {
                console.log("conection checking");
                if(this.revtemplength ==20){
                    clearInterval(this.getStateInterval);
                    this.isDroneConnection = true;
                    this.revtemplength = 0;
                    this.revtmpdata = [];
                    this.lockGetState(false);
                    console.log("Drone connect succeed")
                    console.log("Unlock senpacket GetState");
                }
            }
            else if(this.revtemplength>20){
                clearInterval(this.getStateInterval)
                this.isDroneConnection = true;
                console.log("Drone is already connected")
                // this.waitRevData(data);
                this.lockGetState(false);
                console.log("Unlock senpacket GetState");
            }
        }
        // 디바이스에서 값을 읽어온다.
        async handleLocalData(data) {
           // const decoded = this.decoder.decode(data);
            // console.log("Data received")
            // console.log("Decoded: ", decoded);
            console.log("data received: ",data);
            if(this.isDroneConnection == false){
                this.lockGetState(true);
                this.checkGetState(data)
                return;
            }
            
            this.waitRevData(data);
            // this.monitorDownloadProgress(decoded);
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

        async sendPacket(packet, hex=true, callback=null)
        {
            if(hex){
                await Entry.hwLite.serial.writer.write(Buffer.from(packet))
            } else {
                console.log(this.retHex(packet).join(","))
                await Entry.hwLite.serial.writer.write(packet)
            }
            await new Promise(resolve => setTimeout(resolve, 250));
        }

        monitorDownloadProgress(data)
        {
            if (data && data.search("user_main();"))
            {
                console.log("Call user_main();");
                this.setDownloadStatus(true);
            }else{
                this.setDownloadStatus(false);
            }
        }

        setDownloadStatus(status)
        {
            this.isDownloadDone = status;
        }

        isDownloadSuccess()
        {
            return this.isDownloadDone;
        }

        isLatestChunk(chunkData)
        {
            if(chunkData[this.BT_INDEX_CMD_SEND] == 0x64)
            {
                for(let i=0;i<=chunkData.length-1;i++)
                {
                    if(chunkData[i] == 0xff 
                        && chunkData[i+1] == 0x42 
                        && chunkData[i+2] == 0x43
                        && chunkData[i+3] == 0x43
                        && chunkData[i+4] == 0x44
                        && chunkData[i+5] == 0x44
                    ){
                        return true;
                    }
                }
            }

            return false;
        }

        generateBytesCode(type, Picocode="", nowdwpack=0) {
            let ret = Buffer.alloc(this.DATASENDLEN);

            ret[0] = 0x77;
            ret[1] = 0x78;

            ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_GETFLYSTATE1;
            for (let i = this.BT_INDEX_DATA_SEND; i < this.BT_INDEX_SENDCHECKSUM - 1; i++) {
                ret[i] = (Math.floor(i / 2)) & 0x000000ff;
            }

            if (type == this.cmdType.Download)
            {
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
                        ret[this.BT_INDEX_DATA_SEND + 2 + i] = Picocode.charCodeAt(i +  nowdwpack * this.packlen);
                    }
                }
            }else if(type == this.cmdType.Stop)
            {
                ret[this.BT_INDEX_CMD_SEND] = this.BT_CMD_PICOCSTOP
            }

            ret[this.BT_INDEX_SENDCHECKSUM] = this.calChecksum(ret);
            console.log(ret[this.BT_INDEX_SENDCHECKSUM]);
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

        VERSTR(){
            return (this.sensor.TYPE).toString() + "_" + parseInt(this.sensor.VER).toString()

        }
        Errcode2Msg(ErrorCode){
    if (ErrorCode == 0){
        return "No Error"
    }
    if (ErrorCode == 1){
        return "can't assign to this"
    }
    if (ErrorCode == 2){
        return "NULL pointer dereference"
    }
    if (ErrorCode == 3){
        return "first argument to '?' should be a number"
    }
    if (ErrorCode == 4){
        return "can't get the address of this"
    }
    if (ErrorCode == 5){
        return "invalid operation"
    }
    if (ErrorCode == 6){
        return "invalid use of a NULL pointer"
    }
    if (ErrorCode == 7){
        return "not supported"
    }
    if (ErrorCode == 8){
        return "invalid expression"
    }
    if (ErrorCode == 9){
        return "array index must be an integer"
    }
    if (ErrorCode == 10){
        return "this Target is not an array"
    }
    if (ErrorCode == 11){
        return "need an structure or union member"
    }
    if (ErrorCode == 12){
        return "struct or union error"
    }
    if (ErrorCode == 13){
        return "doesn't have a member"
    }
    if (ErrorCode == 14){
        return "operator not expected here"
    }
    if (ErrorCode == 15){
        return "brackets not closed"
    }
    if (ErrorCode == 16){
        return "identifier not expected here"
    }
    if (ErrorCode == 17){
        return "macro arguments missing"
    }
    if (ErrorCode == 18){
        return "expression expected"
    }
    if (ErrorCode == 19){
        return "a void value isn't much use here"
    }
    if (ErrorCode == 20){
        return "value not expected here"
    }
    if (ErrorCode == 21){
        return "type not expected here"
    }
    if (ErrorCode == 22){
        return "brackets not closed"
    }
    if (ErrorCode == 23){
        return "ExpressionParseMacroCall out of memory"
    }
    if (ErrorCode == 24){
        return "too many arguments"
    }
    if (ErrorCode == 25){
        return "comma expected"
    }
    if (ErrorCode == 26){
        return "bad argument"
    }
    if (ErrorCode == 27){
        return "not enough arguments"
    }
    if (ErrorCode == 28){
        return "Macro undefined"
    }
    if (ErrorCode == 29){
        return "function - can't call"
    }
    if (ErrorCode == 30){
        return "ExpressionParseFunctionCall out of memory"
    }
    if (ErrorCode == 31){
        return "too many arguments"
    }
    if (ErrorCode == 32){
        return "comma expected"
    }
    if (ErrorCode == 33){
        return "bad argument"
    }
    if (ErrorCode == 34){
        return "not enough arguments"
    }
    if (ErrorCode == 35){
        return "undefined Fun name"
    }
    if (ErrorCode == 36){
        return "function body expected"
    }
    if (ErrorCode == 37){
        return "no value returned from a function returning"
    }
    if (ErrorCode == 38){
        return "couldn't find goto label"
    }
    if (ErrorCode == 39){
        return "expression expected"
    }
    if (ErrorCode == 40){
        return "integer value expected instead"
    }
    if (ErrorCode == 41){
        return "identifier expected"
    }
    if (ErrorCode == 42){
        return "undefined Identifier"
    }
    if (ErrorCode == 43){
        return "value expected"
    }
    if (ErrorCode == 44){
        return "#else without #if"
    }
    if (ErrorCode == 45){
        return "#endif without #if"
    }
    if (ErrorCode == 46){
        return "nested function definitions are not allowed"
    }
    if (ErrorCode == 47){
        return "too many parameters"
    }
    if (ErrorCode == 48){
        return "comma expected"
    }
    if (ErrorCode == 49){
        return "bad parameter"
    }
    if (ErrorCode == 50){
        return "main() should return an int or void"
    }
    if (ErrorCode == 51){
        return "bad parameters to main()"
    }
    if (ErrorCode == 52){
        return "bad function definition"
    }
    if (ErrorCode == 53){
        return "function definition expected"
    }
    if (ErrorCode == 54){
        return "Identifier is already defined"
    }
    if (ErrorCode == 55){
        return "} expected"
    }
    if (ErrorCode == 56){
        return "can't define a void variable"
    }
    if (ErrorCode == 57){
        return "close bracket expected"
    }
    if (ErrorCode == 58){
        return "Macro is already defined"
    }
    if (ErrorCode == 59){
        return "'(' expected"
    }
    if (ErrorCode == 60){
        return "statement expected"
    }
    if (ErrorCode == 61){
        return "';' expected"
    }
    if (ErrorCode == 62){
        return "')' expected"
    }
    if (ErrorCode == 63){
        return "'while' expected"
    }
    if (ErrorCode == 64){
        return "'{' expected"
    }
    if (ErrorCode == 65){
        return "filename.h expected"
    }
    if (ErrorCode == 66){
        return "'' expected"
    }
    if (ErrorCode == 67){
        return "value required in return"
    }
    if (ErrorCode == 68){
        return "value in return from a void function"
    }
    if (ErrorCode == 69){
        return "PicocParse out of memory"
    }
    if (ErrorCode == 70){
        return "parse error"
    }
    if (ErrorCode == 71){
        return "AssignFail"
    }
    if (ErrorCode == 72){
        return "TableSetIdentifier out of memory"
    }
    if (ErrorCode == 73){
        return "data type is already defined"
    }
    if (ErrorCode == 74){
        return "structure isn't defined"
    }
    if (ErrorCode == 75){
        return "struct/union definitions can only be globals"
    }
    if (ErrorCode == 76){
        return "invalid type in struct"
    }
    if (ErrorCode == 77){
        return "member already defined"
    }
    if (ErrorCode == 78){
        return "semicolon expected"
    }
    if (ErrorCode == 79){
        return "enum isn't defined"
    }
    if (ErrorCode == 80){
        return "enum definitions can only be globals"
    }
    if (ErrorCode == 81){
        return "bad type declaration"
    }
    if (ErrorCode == 82){
        return "']' expected"
    }
    if (ErrorCode == 83){
        return "Variable out of memory"
    }
    if (ErrorCode == 84){
        return "stack underrun"
    }
    if (ErrorCode == 85){
        return "VariableStack out of memory"
    }
    if (ErrorCode == 86){
        return "stack is empty - can't go back"
    }
    return ""
}
        
        ErrFly2String(ErrFly){
            let msg=""
            const ERR_NONE 		=0		
            const ERR_LOWBATT 	=this.BIT0	
            const ERR_CODE		=this.BIT1	
            const ERR_TEMP		=this.BIT3	
            const ERR_SENSORS   =this.BIT4	
            const ERR_LOADER	=this.BIT5	
            const ERR_ANGLE		=this.BIT6	
            if (ErrFly == ERR_NONE){
                msg=msg +"NO_Error"

            }
            if (ErrFly & ERR_LOWBATT == ERR_LOWBATT){
                msg= "Low_Battery" + " "
            }
            if (ErrFly & ERR_CODE == ERR_CODE){
                msg=msg + "Code_Error" + " "
            }
            if (ErrFly & ERR_TEMP == ERR_TEMP){
                msg=msg + "motherboard_temperature_is_too_high" + " "
            }
            if (ErrFly & ERR_SENSORS == ERR_SENSORS){
                msg=msg + "Sensor_Error" + " "
            }
            if (ErrFly & ERR_LOADER == ERR_LOADER){
                msg=msg + "Excessive_load" + " "
            }
            if (ErrFly & ERR_ANGLE == ERR_ANGLE){
                msg=msg + "Excessive_inclination_angle" + " "
            }
            return msg

        }
        Sensor2String(){
            let SPLIT_STRING = "------------------------------------\n"
            let msg =   "STATE_PITCH=    " + (Math.round(this.sensor.Pitch, 3)).toString() + "\n"     
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
        
            // Đọc giá trị float từ ArrayBuffer dưới dạng big-endian
            return view.getFloat32(0, false); // false chỉ định big-endian
        }


        getInjectStatus(revtmp) {
            let revdata = Buffer.alloc(this.DATAREVLEN);
            if (revtmp.byteLength == this.DATAREVLEN)
            {
                if(revtmp[0] == 0x77 && revtmp[1] == 0x78)
                {
                    if (revtmp[this.BT_INDEX_REVCHECKSUM] == this.calChecksum(revtmp))
                    {
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
                    console.log("download success");
                    return true
                }
            }
            else if(this.revdata[this.BT_INDEX_CMD_REV] == this.BT_CMD_GETFLYSTATE1){
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
                console.log(msg);
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
                        whalesbot_drone_openning_3d_simulator: '3D 시뮬레이터를 엽니 다',
                        whalesbot_drone_clean:'삭제',
                        whalesbot_drone_restart: '재시작',
                        whalesbot_drone_entering_pitch_mode:'준비모드 시작하기',
                        whalesbot_drone_exit_pitch_mode:'준비모드 끝내기',
                        whalesbot_drone_automatic_take_off_height:'자동 이륙 높이 %1 cm',
                        whalesbot_drone_automatic_take_off_altitude_speed_offset:'자동 이륙 고도 %1 cm 속도 %2 X 오프셋 %3 도 Y 오프셋 %4 도 으로 이동하기',
                        whalesbot_drone_automatic_landing:'드로착륙',
                        whalesbot_drone_automatic_descent_speed_offset:'자동 낙하 속도 %1 X 오프셋 %2 도 Y 오프셋 %3 도',
                        whalesbot_drone_set_the_flight_speed:'설정된 비행 속도는 %1 cm/s',
                        whalesbot_drone_get_setting_speed:'설정 속도 가져오기',
                        whalesbot_drone_rise:'위로 %1 cm',
                        whalesbot_drone_down:'아래로 %1 cm',
                        whalesbot_drone_fly_forward:'앞으로 %1 cm',
                        whalesbot_drone_fly_backward:'뒤로 %1 cm',
                        whalesbot_drone_fly_left:'왼쪽으로 %1 cm',
                        whalesbot_drone_fly_right:'오른쪽으로 %1 cm',
                        whalesbot_drone_turn_left:'왼쪽으로 회전 %1 °',
                        whalesbot_drone_turn_right:'오른쪽으로 회전 %1 °',

                        whalesbot_drone_fly_in_the_specified_direction:'속도 %1 , 방향 %2 으로이동하기',
                        whalesbot_drone_flight_designated:'지정된 거리를 비행합니다 x %1 cm y %2 cm z%3 cm 속도 %4 cm/s',
                        whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control:'리모컨 4개 채널 로드 설정 Pitch %1 Roll %2 액셀러레이터 %3 Yaw %4',
                        whalesbot_drone_stop_moving_and_hover:'호버링기능',
                        whalesbot_drone_hover_at_specified_altitude:'지정된 높이에 서스펜션 %1 cm',
                        whalesbot_drone_emergency_stop:'긴급정지',
                        whalesbot_drone_set_the_steering_gear:'스티어링기어 ID 설정 포트 %1 속도 %2 각도 %3',
                        whalesbot_drone_execute_script:'스크립트 실행',
                    },
                    Device: {
                        whalesbot_drone_lite: 'whalesbot_drone_lite',
                    },
                    Menus: {
                        whalesbot_drone_lite: 'WhalesbotDroneLite',
                    },
                    Blocks: {
                        whalesbot_drone_toast_status_title: "Drone Status",
                        whalesbot_drone_toast_download_success: "Download code successed",
                        whalesbot_drone_toast_download_failed: "Download code failed",
                        whalesbot_drone_toast_clean_failed: "Clean code failed",
                        whalesbot_drone_toast_clean_success: "Clean code success",
                        whalesbot_drone_toast_unsupport_block_title: "Unsupport Block",
                        whalesbot_drone_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
                    }
                },
                en: {
                    template: {
                        whalesbot_drone_openning_3d_simulator: 'Open 3D Simulator',
                        whalesbot_drone_clean:'Clean',
                        whalesbot_drone_restart: 'Restart',
                        whalesbot_drone_entering_pitch_mode:'Entering Pitch Mode',
                        whalesbot_drone_exit_pitch_mode:'Exit Pitch Mode',
                        whalesbot_drone_automatic_take_off_height:'Automatic Take Off Height %1 cm',
                        whalesbot_drone_automatic_take_off_altitude_speed_offset:'Automatic Take Off Altitude %1 cm, Speed %2, X offset %3 degree, Y offset %4 degree',
                        whalesbot_drone_automatic_landing:'Automatic Landing',
                        whalesbot_drone_automatic_descent_speed_offset:'Automatic Descent Speed %1, X offset %2 degree, Y offset %3 degree',
                        whalesbot_drone_set_the_flight_speed:'Set The Flight Speed To %1 cm/s',
                        whalesbot_drone_get_setting_speed:'Get Setting Speed',
                        whalesbot_drone_rise:'Rise %1 cm',
                        whalesbot_drone_down:'Down %1 cm',
                        whalesbot_drone_fly_forward:'Fly Forward %1 cm',
                        whalesbot_drone_fly_backward:'Fly Backward %1 cm',
                        whalesbot_drone_fly_left:'Fly Left %1 cm',
                        whalesbot_drone_fly_right:'Fly Right %1 cm',
                        whalesbot_drone_turn_left:'Turn Left %1 °',
                        whalesbot_drone_turn_right:'Turn Right %1 °',
                        whalesbot_drone_fly_in_the_specified_direction:'Fly In The Specified Direction Speed %1 cm/s Direction %2 °',
                        whalesbot_drone_flight_designated:'Flight Designated Distance X %1 cm Y %2 cm Z %3 cm Speed %4 cm/s',
                        whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control:'Set The Four Channel Lever Quantity Of Remote Control Pitch %1° Roll %2° Throttle %3° Roll %4°',
                        whalesbot_drone_stop_moving_and_hover:'Stop Moving And Hover',
                        whalesbot_drone_hover_at_specified_altitude:'Hover At a Specified Altitude %1 cm',
                        whalesbot_drone_emergency_stop:'Emergency Stop',
                        whalesbot_drone_set_the_steering_gear:'Set The Steering Gear Port %1 Speed %2 cm/s Angle %3 °',
                        whalesbot_drone_execute_script:'Execute Script',
                    },
                    Device: {
                        whalesbot_drone_lite: 'whalesbot_drone_lite',
                    },
                    Menus: {
                        whalesbot_drone_lite: 'WhalesbotDroneLite',
                    },
                    Blocks: {
                        whalesbot_drone_toast_status_title: "Drone Status",
                        whalesbot_drone_toast_download_success: "Download code successed",
                        whalesbot_drone_toast_download_failed: "Download code failed",
                        whalesbot_drone_toast_clean_failed: "Clean code failed",
                        whalesbot_drone_toast_clean_success: "Clean code success",
                        whalesbot_drone_toast_unsupport_block_title: "Unsupport Block",
                        whalesbot_drone_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
                    }
                },
            };
        }

        getBlocks() {            
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
                "whalesbot_drone_get_setting_speed": "fly_state(SETSPEED)"
            }

            const startBlocks = [
                "when_run_button_click",
                "when_some_key_pressed",
                "mouse_clicked",
                "mouse_click_cancled",
                "when_object_click",
                "when_object_click_canceled",
            ]

            let globlalCVariables = {}

            function _getParameter (parameter) {
                let param = parameter.params[0] != "" ? parameter.params[0] : "0"
                if (parameter.type != "text" && parameter.type != "number" && parameter.type != "get_variable") {
                    param = wbVariables[parameter.type]
                } else if (parameter.type == "get_variable") {
                    param = globlalCVariables[parameter.params[0]]
                }
                return param
            }

            function _generateConditions (params) {
                let left = _getParameter(params[0])
                let operator = params[1] != undefined ? wbOperators[params[1]] : "0"
                let right = _getParameter(params[2])
                return { left, operator, right }
            }

            function generateCCode (block) {
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
                        return `\twhile(!(${generateCCode(rpWhileDecision)})) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

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
                        return "0";

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
                    case 'whalesbot_drone_entering_pitch_mode':
                        return '\tfly_unlock();\n'; 

                    case 'whalesbot_drone_exit_pitch_mode':
                        return '\tfly_lock();\n';

                    case 'whalesbot_drone_automatic_take_off_height':
                        let takeOffHeight = _getParameter(block.params[0]);
                        return `\tfly_start(${takeOffHeight});\n`;

                    case 'whalesbot_drone_automatic_take_off_altitude_speed_offset':
                        let takeOffAltitude = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultAltitude;
                        let takeOffSpeed = _getParameter(block.params[1]) != "" ? _getParameter(block.params[1]) : defaultSpeed;
                        let takeOffXoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                        let takeOffYoffset = (-10.00 <= _getParameter(block.params[3]) || _getParameter(block.params[3]) <= 10.00) ? _getParameter(block.params[3]) : defaultOffset;
                        return `\tfly_start_2(${takeOffAltitude},${takeOffSpeed},${takeOffXoffset},${takeOffYoffset});\n`

                    case 'whalesbot_drone_automatic_landing':
                        return `\tfly_land();\n`;

                    case 'whalesbot_drone_automatic_descent_speed_offset':
                        let automaticSpeed = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultSpeed;
                        let automaticXoffset = (-10.00 <= _getParameter(block.params[1]) || _getParameter(block.params[1]) <= 10.00) ? _getParameter(block.params[1]) : defaultOffset;
                        let automaticYoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                        return `\tfly_land_2(${automaticSpeed},${automaticXoffset},${automaticYoffset});\n`

                    case 'whalesbot_drone_set_the_flight_speed':
                        let speed = _getParameter(block.params[0]);
                        return `\tfly_setspeed(${speed});\n`;

                    case 'whalesbot_drone_get_setting_speed':
                        return `\tfly_state(SETSPEED);\n`;

                    case 'whalesbot_drone_rise':
                        let up = _getParameter(block.params[0]);
                        return `\tfly_moveto(UP,${up});\n`;

                    case 'whalesbot_drone_down':
                        let down = _getParameter(block.params[0]);
                        return `\tfly_moveto(DOWN,${down});\n`;

                    case 'whalesbot_drone_fly_forward':
                        let front = _getParameter(block.params[0]);
                        return `\tfly_moveto(FRONT,${front});\n`;

                    case 'whalesbot_drone_fly_backward':
                        let back = _getParameter(block.params[0]);
                        return `\tfly_moveto(BACK,${back});\n`;

                    case 'whalesbot_drone_fly_left':
                        let left = _getParameter(block.params[0]);
                        return `\tfly_moveto(LEFT,${left});\n`;

                    case 'whalesbot_drone_fly_right':
                        let right = _getParameter(block.params[0]);
                        return `\tfly_moveto(RIGHT,${right});\n`;

                    case 'whalesbot_drone_turn_left':
                        let turnLeft = _getParameter(block.params[0]);
                        if (0 > turnLeft || turnLeft > 360) {
                            turnLeft = 360
                        }
                        return `\tfly_turn(CCW,${turnLeft});\n`;

                    case 'whalesbot_drone_turn_right':
                        let turnRight = _getParameter(block.params[0]);
                        if (0 > turnRight || turnRight > 360) {
                            turnRight = 360
                        }
                        return `\tfly_turn(CW,${turnRight});\n`;

                    case 'whalesbot_drone_fly_in_the_specified_direction':
                        let dirSpeed = _getParameter(block.params[0]);
                        let dirDirection = _getParameter(block.params[1]);
                        if (0 > dirDirection || dirDirection > 360) {
                            dirDirection = 360
                        }
                        return `\tfly_dir(${dirSpeed},${dirDirection});\n`;

                    case 'whalesbot_drone_flight_designated':
                        let disX = _getParameter(block.params[0]);
                        let disY = _getParameter(block.params[1]);
                        let disZ = _getParameter(block.params[2]);
                        let disSpeed = _getParameter(block.params[3]);
                        return `\tfly_move_dis(${disX},${disY},${disZ},${disSpeed});\n`;

                    case 'whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control':
                        let pitch = _getParameter(block.params[0]);
                        let roll = _getParameter(block.params[1]);
                        let throttle = _getParameter(block.params[2]);
                        let yaw = _getParameter(block.params[3]);
                        return `\tfly_move(${pitch},${roll},${throttle},${yaw});\n`;

                    case 'whalesbot_drone_stop_moving_and_hover':
                        return `\tfly_hover();\n`;
                        
                    case 'whalesbot_drone_hover_at_specified_altitude':
                        let hoverSpecifiedAltitude = (_getParameter(block.params[0]) == "" || _getParameter(block.params[0]) < 20) ? "20" : _getParameter(block.params[0]);
                        hoverSpecifiedAltitude = (_getParameter(block.params[0]) > 200) ? "200" : _getParameter(block.params[0]);
                        return `\tfly_hover_laser(${hoverSpecifiedAltitude});\n`;

                    case 'whalesbot_drone_emergency_stop':
                        return `\tfly_lock();\n`;

                    case 'whalesbot_drone_set_the_steering_gear':
                        let servoSpeed = _getParameter(block.params[1]);
                        let servoAngle = _getParameter(block.params[2]);
                        if (0 > servoAngle || servoAngle > 360) {
                            servoAngle = 360
                        }
                        return `\tSetServo(P2,${servoSpeed},${servoAngle});\n`;

                    default:
                        if (!startBlocks.includes(block.type)) {
                            _this.unsupportBlockExist = true;
                        }
                        return '';
                }
            }

            function setUpCVariables (variable) {
                if (variable.visible) {
                    const varName = `var_${variable.name}`
                    globlalCVariables[variable.id] = varName
                    const varValue = variable.value;
                    return `float ${varName} = ${varValue};\n`
                }
                return ""
            }

            function openedSimulatorPopup () {
                if (_this.simulatorPopup == null) {
                    return false;
                }
                return !_this.simulatorPopup.closed;
            }

            return {
                whalesbot_drone_openning_3d_simulator: {
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
                        type: 'whalesbot_drone_openning_3d_simulator',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func (sprite, script) {
                        const width = window.innerWidth * 0.8;
                        const height = window.innerHeight * 0.8;
                        _this.simulatorPopup = window.open(
                            metadata.simulator_url,
                            'DroneSimulatorPopup',
                            `width=${width},height=${height}`
                        );
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_openning_3d_simulator()'] },
                },
                whalesbot_drone_restart: {
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
                        type: 'whalesbot_drone_restart',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func (sprite, script) {
                        await _this.sendPacket(_this.getStateCode);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_restart()'] },
                },
                whalesbot_drone_clean: {
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
                        type: 'whalesbot_drone_clean',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func (sprite, script) {
                        await _this.sendPacket(_this.stopCode);
                        await _this.sendPacket(_this.stopCode);
                        Entry.toast.success(Lang.Blocks.whalesbot_drone_toast_status_title, 
                            Lang.Blocks.whalesbot_drone_toast_clean_success);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_clean()'] },
                },
                whalesbot_drone_entering_pitch_mode: {
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
                        type: 'whalesbot_drone_entering_pitch_mode',
                    },
                    paramsKeyMap: {},
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func (sprite, script) {
                        console.log("whalesbot_drone_entering_pitch_mode")
                        await _this.sendPacket(_this.getStateCode);
                        await _this.sendPacket(_this.getStateCode);
                        cFunctions.push(`fly_unlock();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_entering_pitch_mode()'] },
                },
                whalesbot_drone_exit_pitch_mode: {
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
                        type: 'whalesbot_drone_exit_pitch_mode',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
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
                                Lang.Blocks.whalesbot_drone_toast_unsupport_block_title,
                                Lang.Blocks.whalesbot_drone_toast_unsupport_block_msg
                            )
                            _this.unsupportBlockExist = false;
                            Entry.engine.toggleStop();
                            return;
                        }
                        console.log(sourceCode)

                        if (openedSimulatorPopup()) {
                            Entry.toast.success(
                                Lang.Blocks.whalesbot_drone_toast_status_title,         
                                Lang.Blocks.whalesbot_drone_toast_download_success
                            );
                            return;
                        }

                        let i = 0;
                        _this.setDownloadStatus(false);
                        _this.isGetFlyState = false;

                        // get fly state
                        // await _this.sendPacket(_this.getStateCode);
                        // await _this.sendPacket(_this.getStateCode);
                        // Entry.hwLite.serial.flush();
                        // download
                        _this.connectDrone();
                        // send first chunk
                        if(_this.isDroneConnection == true){
                            console.log("Send chunk 0");
                            let byteCode = _this.generateBytesCode(_this.cmdType.Download, sourceCode, 0);
                            await _this.sendPacket(byteCode, false);
                            i++;

                            while(true)
                            {
                                console.log("Send chunk ", i);
                                byteCode = _this.generateBytesCode(_this.cmdType.Download, sourceCode, i);
                                await _this.sendPacket(byteCode, false);
                                if(_this.isLatestChunk(byteCode))
                                {
                                    console.log("Latest chunk sent!");
                                    this.revdata = [];
                                    Entry.toast.success(Lang.Blocks.whalesbot_drone_toast_status_title, 
                                        Lang.Blocks.whalesbot_drone_toast_download_success);
                                    break;
                                }
                                i++;
                            }
                        }
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_exit_pitch_mode()'] },
                },
                whalesbot_drone_automatic_take_off_height: {
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
                        type: 'whalesbot_drone_automatic_take_off_height',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_automatic_take_off_height")
                        cFunctions.push(`fly_start(${script.getValue('VALUE')})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_automatic_take_off_height();'] },
                },
                whalesbot_drone_automatic_take_off_altitude_speed_offset: {
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
                        type: 'whalesbot_drone_automatic_take_off_altitude_speed_offset',
                    },
                    paramsKeyMap: {
                        altitude: 0,
                        speed: 1,
                        x: 2,
                        y: 3,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_automatic_take_off_altitude_speed_offset")
                        cFunctions.push(`fly_start(${script.getValue('VALUE')})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_automatic_take_off_altitude_speed_offset();'] },
                },
                whalesbot_drone_automatic_landing: {
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
                        type: 'whalesbot_drone_automatic_landing',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        console.log("whalesbot_drone_automatic_landing")
                        cFunctions.push(`fly_land();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_automatic_landing()'] },
                },
                whalesbot_drone_automatic_descent_speed_offset: {
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
                        type: 'whalesbot_drone_automatic_descent_speed_offset',
                    },
                    paramsKeyMap: {
                        speed: 0,
                        x: 1,
                        y: 2,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        console.log("whalesbot_drone_automatic_descent_speed_offset")
                        cFunctions.push(`fly_land_2();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_automatic_descent_speed_offset()'] },
                },
                whalesbot_drone_set_the_flight_speed: {
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
                        type: 'whalesbot_drone_set_the_flight_speed',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        const speed = script.getValue('SPEED');
                        console.log("whalesbot_drone_set_the_flight_speed")
                        cFunctions.push(`fly_setspeed(${speed});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_set_the_flight_speed()'] },
                },
                whalesbot_drone_get_setting_speed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_drone_get_setting_speed',
                    },
                    paramsKeyMap: {},
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        console.log("whalesbot_drone_get_setting_speed");
                        cFunctions.push(`fly_state(SETSPEED);`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_get_setting_speed()'] },
                },
                whalesbot_drone_rise: {
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
                        type: 'whalesbot_drone_rise',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_rise");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(UP,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_rise();'] },
                },
                whalesbot_drone_down: {
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
                        type: 'whalesbot_drone_down',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_down");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(DOWN,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_down();'] },
                },
                whalesbot_drone_fly_forward: {
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
                        type: 'whalesbot_drone_fly_forward',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_fly_forward");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(FRONT,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_fly_forward();'] },
                },
                whalesbot_drone_fly_backward: {
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
                        type: 'whalesbot_drone_fly_backward',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_fly_backward");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(BACK,${value})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_fly_backward();'] },
                },
                whalesbot_drone_fly_left: {
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
                        type: 'whalesbot_drone_fly_left',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_fly_left");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(LEFT,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_fly_left();'] },
                },
                whalesbot_drone_fly_right: {
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
                        type: 'whalesbot_drone_fly_right',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_fly_right");
                        const value = script.getValue('value');
                        cFunctions.push(`fly_moveto(RIGHT,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_fly_right();'] },
                },
                whalesbot_drone_turn_left: {
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
                        type: 'whalesbot_drone_turn_left',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_turn_left");
                        const value = script.getValue('value');
                        if (value < 0 && value > 360) {
                            value = 360
                        }
                        cFunctions.push(`fly_turn(CCW,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_turn_left();'] },
                },
                whalesbot_drone_turn_right: {
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
                        type: 'whalesbot_drone_turn_right',
                    },
                    paramsKeyMap: {
                        value: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_turn_right");
                        const value = script.getValue('value');
                        if (value < 0 && value > 360) {
                            value = 360
                        }
                        cFunctions.push(`fly_turn(CW,${value});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_turn_right();'] },
                },
                whalesbot_drone_fly_in_the_specified_direction: {
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
                        type: 'whalesbot_drone_fly_in_the_specified_direction',
                    },
                    paramsKeyMap: {
                        speed: 0,
                        direction: 1,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_fly_in_the_specified_direction");
                        const speed = script.getValue('speed');
                        const direction = script.getValue('direction');
                        if (direction < 0 && direction > 360) {
                            direction = 360
                        }
                        cFunctions.push(`fly_dir(${speed},${direction});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_fly_in_the_specified_direction();'] },
                },
                whalesbot_drone_flight_designated: {
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
                        type: 'whalesbot_drone_flight_designated',
                    },
                    paramsKeyMap: {
                        x: 0,
                        y: 1,
                        z: 2,
                        speed: 3,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_flight_designated");
                        const x = script.getValue('x');
                        const y = script.getValue('y');
                        const z = script.getValue('z');
                        const speed = script.getValue('speed');
                        cFunctions.push(`fly_move_dis(${x},${y},${z},${speed})`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_flight_designated();'] },
                },
                whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control: {
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
                        type: 'whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control',
                    },
                    paramsKeyMap: {
                        pitch: 0,
                        roll: 1,
                        throttle: 2,
                        yaw: 3,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control");
                        const pitch = script.getValue('pitch');
                        const roll = script.getValue('roll');
                        const throttle = script.getValue('throttle');
                        const yaw = script.getValue('yaw');
                        cFunctions.push(`fly_move(${pitch},${roll},${throttle},${yaw});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_set_the_four_channel_lever_quantity_of_remote_control();'] },
                },
                whalesbot_drone_stop_moving_and_hover: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'whalesbot_drone_stop_moving_and_hover',
                    },
                    paramsKeyMap: {},
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_stop_moving_and_hover");
                        cFunctions.push(`fly_hover();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_stop_moving_and_hover();'] },
                },
                whalesbot_drone_hover_at_specified_altitude: {
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
                        type: 'whalesbot_drone_hover_at_specified_altitude',
                    },
                    paramsKeyMap: {
                        altitude: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_hover_at_specified_altitude");
                        cFunctions.push(`fly_hover_laser();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_hover_at_specified_altitude();'] },
                },
                whalesbot_drone_emergency_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        type: 'whalesbot_drone_emergency_stop',
                    },
                    paramsKeyMap: {},
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        console.log("whalesbot_drone_emergency_stop")
                        cFunctions.push(`fly_lock();`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_emergency_stop()'] },
                },
                whalesbot_drone_set_the_steering_gear: {
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
                        type: 'whalesbot_drone_set_the_steering_gear',
                    },
                    paramsKeyMap: {
                        port: 0,
                        speed: 1,
                        angle: 2,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    func(sprite, script) {
                        console.log("whalesbot_drone_set_the_steering_gear");
                        const speed = script.getValue('speed');
                        const angle = script.getValue('angle');
                        cFunctions.push(`SetServo(P2,${speed},${angle});`);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_set_the_steering_gear();'] },
                },
                whalesbot_drone_execute_script: {
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
                        type: 'whalesbot_drone_execute_script',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['WhalesbotDroneLite'],
                    async func(sprite, script) {
                        if (openedSimulatorPopup()) {
                            _this.simulatorPopup.postMessage({
                                function: "enteringPitchMode",
                                args: [],
                                script: sourceCode
                            }, '*');
                            return;
                        }
                        await _this.sendPacket(_this.runCode);
                    },
                    syntax: { js: [], py: ['Entry.whalesbot_drone_execute_script()'] },
                },
            };
        }
    })();
})();

module.exports = Entry.WhalesbotDroneLite;
