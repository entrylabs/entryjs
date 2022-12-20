'use strict';

const { flattenDiagnosticMessageText } = require("typescript");

Entry.kkmoo = {
    id: '53.1',
    name: 'kkmoo',
    url: '',
    imageName: 'kkmoo.png',
    title: {
        ko: 'kkmoo',
        en: 'kkmoo',
    },
    isReceive: 0,
    motData:[
        {num:0,enable:0,angle:0},{num:1,enable:0,angle:0},{num:2,enable:0,angle:0},
        {num:3,enable:0,angle:0},{num:4,enable:0,angle:0},{num:5,enable:0,angle:0},
        {num:6,enable:0,angle:0},{num:7,enable:0,angle:0},{num:8,enable:0,angle:0},
        {num:9,enable:0,angle:0},{num:10,enable:0,angle:0},{num:11,enable:0,angle:0},
        {num:12,enable:0,angle:0},{num:13,enable:0,angle:0},{num:14,enable:0,angle:0},
        {num:15,enable:0,angle:0},{num:16,enable:0,angle:0},{num:17,enable:0,angle:0}
    ],
    isMotionRunning: false,
    setZero: function() {
        for(var i of this.motData){
            i.enable = 0;
            i.angle = 0;
        }
    },
};

Entry.kkmoo.setLanguage = function() {
    return {
        ko: {
            template: {
                kkmoo_rotate_motor: '%1번 모터의 각도를 %2도로 회전 %3',
                kkmoo_isPlaying: '동작이 실행중인가?',
                kkmoo_motion_play_basic:'기본 %1번 동작 실행 %2',
                kkmoo_motion_play_custom:'커스텀 %1번 동작 실행 %2',
                kkmoo_rotate_motor_time: '%1번 모터의 각도를 %2도로 %3밀리초 동안 회전 %4'
            },
            Menus: {
                kkmoo: '까무',
            },
        },
        en: {
            template: {
                kkmoo_rotate_motor: 'Rotate motor %1 to %2 degrees %3',
                kkmoo_isPlaying: 'Is motion running?',
                kkmoo_motion_play_basic:'Play basic motion number %1 %2',
                kkmoo_motion_play_custom:'Play custom motion number %1 %2',
                kkmoo_rotate_motor_time:'Rotate motor %1 to %2 degrees for%3 milliseconds %4'
            },
            Menus: {
                kkmoo: 'kkmoo',
            },
        },
    };
};

Entry.kkmoo.blockMenuBlocks = [
    'kkmoo_rotate_motor',
    'kkmoo_isPlaying',
    'kkmoo_motion_play_basic',
    'kkmoo_motion_play_custom',
    'kkmoo_rotate_motor_time',
];

Entry.kkmoo.getBlocks = function() {
    return {
        // 까무_모터 개별회전
        kkmoo_rotate_motor: {
            template: Lang.template.kkmoo_rotate_motor,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type: 'Dropdown',
                options:[
                    ['0','0'],['1','1'],['2','2'],
                    ['3','3'],['4','4'],['5','5'],
                    ['6','6'],['7','7'],['8','8'],
                    ['9','9'],['10','10'],['11','11'],
                    ['12','12'],['13','13'],['14','14'],
                    ['15','15'],['16','16'],['17','17'],
                ],
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
            },
            {
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }
               
            ],
            paramsKeyMap: {
                MOTNUM: 0,
                ANGLE: 1,
            },
            events: {},
            def: {
                params: [
                    "0" //dropdown의 경우 VALUE값이 초기값
                    ,
                    {
                        type:"number",//최대최소값설정?
                        params:['0'],
                }],
                type: 'kkmoo_rotate_motor',
            },
            class: 'Basic',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const prot = "EC"
                const motnum = script.getField('MOTNUM',script);
                const angle = script.getValue('ANGLE',script);
                var msg = null;
                if(script.isStart != true){
                    script.isStart = true;
                    if(angle>=-90 && angle<=90){
                        msg={'MOT':motnum,'ANG':angle};
                    }
                    Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                    return script;
                }
                else{
                    delete script.isStart;
                    delete  Entry.hw.sendQueue.msg
                    return script.callReturn();
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        kkmoo_isPlaying:{
            template: Lang.template.kkmoo_isPlaying,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'kkmoo_isPlaying',
            },
            class: 'Basic',
            isNotFor: ['kkmoo'],
            func: async function(sprite,script){
                const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
                await wait(100);
                await Entry.hw.update();
                if(Entry.hw.portData.data == 'true'){
                    Entry.kkmoo.isMotionRunning = true;
                    console.log("true");
                    return true;
                }
                else if(Entry.hw.portData.data == 'false'){
                    Entry.kkmoo.isMotionRunning = false;
                    console.log("false");
                    return false;
                }
                else{
                    console.log(Entry.hw.portData.data);
                    console.log("else");
                    return Entry.kkmoo.isMotionRunning;
                }
                /*console.log(Entry.hw.portData.data);
                console.log(Entry.kkmoo.isReceive);
                if(Entry.kkmoo.isReceive == 2)
                {
                    if(Entry.hw.portData.data == "true")
                    {
                        Entry.kkmoo.isReceive = 1;
                    }
                    // else if(Entry.hw.portData.data == "false")
                    // {
                    //     Entry.kkmoo.isReceive = 0;
                    // }
                }
                else
                {
                    if(Entry.hw.portData.data == "true")
                    {
                        Entry.kkmoo.isReceive = 1;
                    }
                    else if(Entry.hw.portData.data == "false")
                    {
                        Entry.kkmoo.isReceive = 0;
                    }
                }
                
                if(Entry.kkmoo.isReceive == 0)
                {
                    console.log(Entry.kkmoo.isReceive);
                    return false;
                }
                else if(Entry.kkmoo.isReceive == 1)
                {
                    console.log(Entry.kkmoo.isReceive);
                    return true;
                }
                else
                {
                    console.log(Entry.kkmoo.isReceive);
                    return true;
                }*/

                
                // console.log(Entry.kkmoo.isReceive);
                // console.log("------------------");

                // return Entry.kkmoo.isReceive;
            }
        },
        kkmoo_motion_play_basic: {
            template: Lang.template.kkmoo_motion_play_basic,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }
               
            ],
            paramsKeyMap: {
                MOTIONNUM : 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type:"number",
                        params:["0"]
                    }
                   ],
                   
                type: 'kkmoo_motion_play_basic',
            },
            class: 'Basic',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                console.log("motionPlay");
                const prot = "PM"
                const motionnum = script.getValue('MOTIONNUM',script);
                var msg = motionnum;
                if(script.isStart != true){
                    script.isStart = true;                    
                    Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                    return script;
                }
                else{
                    delete script.isStart;
                    delete Entry.hw.sendQueue.msg;
                    return script.callReturn();
                } 
            },
            //syntax: undefined,
        },
        kkmoo_motion_play_custom: {
            template: Lang.template.kkmoo_motion_play_custom,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }
               
            ],
            paramsKeyMap: {
                MOTIONNUM : 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type:"number",
                        params:["0"]
                    }
                   ],
                   
                type: 'kkmoo_motion_play_custom',
            },
            class: 'Basic',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                console.log("motionPlay");
                const prot = "CM"
                const motionnum = script.getValue('MOTIONNUM',script);
                var msg = motionnum;
                if(script.isStart != true){
                    setTimeout(()=>{script.isStart = true;},100)
                    
                    Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                    return script;
                }
                else{
                    delete script.isStart;
                    delete Entry.hw.sendQueue.msg;
                    return script.callReturn();
                } 
            },
            //syntax: undefined,
        },
        kkmoo_rotate_motor_time: {
            template: Lang.template.kkmoo_rotate_motor_time,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type: 'Dropdown',
                options:[
                    ['0','0'],['1','1'],['2','2'],
                    ['3','3'],['4','4'],['5','5'],
                    ['6','6'],['7','7'],['8','8'],
                    ['9','9'],['10','10'],['11','11'],
                    ['12','12'],['13','13'],['14','14'],
                    ['15','15'],['16','16'],['17','17'],
                ],
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
            },
            {
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }
               
            ],
            paramsKeyMap: {
                MOTNUM: 0,
                ANGLE: 1,
                TIME: 2,
            },
            events: {},
            def: {
                params: [
                    "0" //dropdown의 경우 VALUE값이 초기값
                    ,
                    {
                        type:"number",//최대최소값설정?
                        params:['0'],
                    },
                    {
                        type:"number",
                        params:['0'],
                    },
            ],
                type: 'kkmoo_rotate_motor_time',
            },
            class: 'Basic',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const prot = "AD"
                const motnum = script.getField('MOTNUM',script);
                const angle = script.getValue('ANGLE',script);
                const time = script.getValue('TIME',script);
                var msg = null;
                if(script.isStart != true){
                    script.isStart = true;
                    //Entry.kkmoo.isReceive = 2;
                    if(angle>=-90 && angle<=90){
                        msg={'MOT':motnum,'ANG':angle,"TME":time};
                    }
                    Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};   
                    return script;
                }
                else{
                    delete script.isStart;
                    delete  Entry.hw.sendQueue.msg
                    return script.callReturn();
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        
    };
};

module.exports = Entry.kkmoo;
