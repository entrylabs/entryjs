"use strict";

/*******************************************************
* 명명 규칙
*
* 함수명, 변수명 : 첫 글자 소문자, 다음 단어 첫 글자 대문자, 두단어 이상 조합     예) nameRull
* 키  값 : 모두 대문자, 단어사이 '_' 사용함                                    예) NAME_RULL
*
*********************************************************/

Entry.mechatro = {

    name: 'mechatro',
    setZero: function()
    {
        Entry.hw.sendQueue = {};
        Entry.hw.sendQueue["entryStop"]=0;
        Entry.hw.update();

        //Entry.mechatro.entryState.VALUE        =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.VALUE_U_FLAG =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.MODE         =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.MODE_U_FLAG  =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        Entry.hw.update();
        Entry.hw.sendQueue = {};
    },

    monitorTemplate: {
        imgPath: "hw/transparent.png",
        width: 605,
        height: 434,
        listPorts: {
            "2":{name: Lang.Hw.port_en + " 2 " + Lang.Hw.port_ko, type: "input", pos: {x : 0, y: 0}},
            "4":{name: Lang.Hw.port_en + " 4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "5":{name: Lang.Hw.port_en + " 5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "6":{name: Lang.Hw.port_en + " 6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "7":{name: Lang.Hw.port_en + " 7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "10":{name: Lang.Hw.port_en + " 10 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "14":{name: Lang.Hw.port_en + " a0 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "15":{name: Lang.Hw.port_en + " a1 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "16":{name: Lang.Hw.port_en + " a2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "17":{name: Lang.Hw.port_en + " a3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "18":{name: Lang.Hw.port_en + " a4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "19":{name: Lang.Hw.port_en + " a5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "20":{name: Lang.Hw.port_en + " a6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "21":{name: Lang.Hw.port_en + " a7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m2":{name: Lang.Hw.port_en + " m2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m4":{name: Lang.Hw.port_en + " m4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m5":{name: Lang.Hw.port_en + " m5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m6":{name: Lang.Hw.port_en + " m6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m7":{name: Lang.Hw.port_en + " m7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m10":{name: Lang.Hw.port_en + " m10 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "M3":{name: Lang.Hw.port_en + " MA " + "모터 속도", type: "input", pos: {x: 0, y: 0}},
            "M11":{name: Lang.Hw.port_en + " MB " + "모터 속도", type: "input", pos: {x: 0, y: 0}},
        },
        mode : 'both'
    },
    
    state : {
        //"VALUE"        : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"MODE"         : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"VALUE_U_FLAG" : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"MODE_U_FLAG"  : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        "THRESHOLD"      : [50,50,50,50,50,  50,50,50,50,50,  50,50,50,50,50,  50,50,50,50,50,  50,50],
    },

    portMode : {
        SET_G_DEVICE       : 0x80,
        COM_ALIVE          : 0x80,
        COM_INIT_DEVICE    : 0x81,
        COM_STANDBY_DEVICE : 0x82,
        COM_NO_TONE        : 0x83,
        COM_SET_BLUE_PW    : 0x84,
        SET_DIGITAL_OUT    : 0x90,

        SET_G_MOTOR        : 0xA0,
        SET_MOTOR_SPEED    : 0xA0,
        SET_MOTOR_CURRENT  : 0xB0,

        SET_G_SERVO_PWM_TON: 0xC0,
        SET_SERVO_POSITION : 0xC0,
        SET_SERVO_SPEED    : 0xC8,
        SET_PWM            : 0xD0,
        SET_TONE           : 0xD8,

        SET_G_INPUT        : 0xE0,
        SET_ANALOG_IN      : 0xE0,
        SET_DIGITAL_IN     : 0xE8,
        SET_ULTRASONIC     : 0xF0,
    },

    transferModeValue: function(portNo, mode, value)
    {
        var mPortNo = 'm' + portNo;
        if( Entry.hw.portData[mPortNo] !== mode )
        {
            Entry.hw.sendQueue[mPortNo] = mode;
            Entry.hw.sendQueue[portNo] = value;
            Entry.hw.update();
            delete Entry.hw.sendQueue[mPortNo];
            delete Entry.hw.sendQueue[portNo]; // 큐에서 지우면 하드웨어 모니터에서 값 표시가 안됨. 값을 HW 프로그램에서 전송하여 표시
        }else{
            Entry.hw.sendQueue[portNo] = value;
            Entry.hw.update();
            delete Entry.hw.sendQueue[portNo];    
        }
    },

    transferValue: function(portNo, value)
    {
        Entry.hw.sendQueue[portNo] = value;
        Entry.hw.update();
        delete Entry.hw.sendQueue[portNo];
    },
    transferMode: function(portNo, mode)
    {
        var mPortNo = 'm' + portNo;
        if( Entry.hw.portData[mPortNo] !== mode )
        {
            Entry.hw.sendQueue[mPortNo] = mode;
            Entry.hw.update();
            delete Entry.hw.sendQueue[mPortNo];
        }
    },
};