'use strict';

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
        {num:0,angle:0},{num:1,angle:0},{num:2,angle:0},
        {num:3,angle:0},{num:4,angle:0},{num:5,angle:0},
        {num:6,angle:0},{num:7,angle:0},{num:8,angle:0},
        {num:9,angle:0},{num:10,angle:0},{num:11,angle:0},
        {num:12,angle:0},{num:13,angle:0},{num:14,angle:0},
        {num:15,angle:0},{num:16,angle:0},{num:17,angle:0}
    ],
    runningStart: false,
    isMotionRunning: false,
    motionFrame:[
        {frame:0,data:null,time:0},{frame:1,data:null,time:0},{frame:2,data:null,time:0},{frame:3,data:null,time:0},
        {frame:4,data:null,time:0},{frame:5,data:null,time:0},{frame:6,data:null,time:0},{frame:7,data:null,time:0},
        {frame:8,data:null,time:0},{frame:9,data:null,time:0},{frame:10,data:null,time:0},{frame:11,data:null,time:0},
        {frame:12,data:null,time:0},{frame:13,data:null,time:0},{frame:14,data:null,time:0},{frame:15,data:null,time:0},
        {frame:16,data:null,time:0},{frame:17,data:null,time:0},{frame:18,data:null,time:0},{frame:19,data:null,time:0}
    ],
    playcnt: 0,
    checkTimeout:0,
    timeoutCnt:0,
    setTimeout:function(time){
        this.timeoutCnt = time;
        this.checkTimeout = new Date;
    },
    timeOut: function(){
        if(new Date-this.checkTimeout>this.timeoutCnt){
            return true;
        }
        else{
            return false;
        }
    },
    setZero: function() {
        for(var i of this.motData){
            i.angle = 0;
        }
        for(var i of this.motionFrame){
            i.data = null;
            i.time = 0;
        }
        Entry.hw.sendQueue.msg = { 'prot': "RT", 'data': null};
        this.playcnt = 0;
        this.checkTimeout = 0;
        this.timeoutCnt = 0;
    },
    copyObj: function(obj){
        const result = {};
        for(let key in obj){
            if(typeof obj[key] === 'object'){
                result[key] = this.copyObj(obj[key]);
            }else{
                result[key] = obj[key];
            }
        }
        return result;
    }
};
Entry.kkmoo.setLanguage = function() {
    return {
        ko: {
            template: {
                kkmoo_rotate_motor: '%1번 모터의 각도를 %2도로 회전 %3',
                //kkmoo_isPlaying: '동작이 실행중인가?',
                kkmoo_motion_play_basic:'기본 %1번 동작 실행 %2',
                kkmoo_motion_play_custom:'커스텀 %1번 동작 실행 %2',
                kkmoo_rotate_motor_time: '%1번 모터의 각도를 %2도로 %3밀리초 동안 회전 %4',
                kkmoo_set_motor_degree: '%1번 모터의 각도를 %2도로 설정 %3',
                kkmoo_run_set_value_time:'설정값 %1밀리초 동안 실행%2',
                kkmoo_set_frame: '설정값을 임시동작 %1 번 프레임으로 지정 %2',
                kkmoo_set_frame_time: '임시동작의 %1 번 프레임의 시간을 %2 밀리초로 설정 %3',
                kkmoo_play_temp_motion: '임시동작 실행 %1',
                kkmoo_save_to_robot: '임시동작을 까무 커스텀동작 %1 번에 %2 으로 저장 %3'
            },
            Menus: {
                kkmoo: '까무',
            },
        },
        en: {
            template: {
                kkmoo_rotate_motor: 'Rotate motor %1 to %2 degrees %3',
                //kkmoo_isPlaying: 'Is motion running?',
                kkmoo_motion_play_basic:'Play basic motion number %1 %2',
                kkmoo_motion_play_custom:'Play custom motion number %1 %2',
                kkmoo_rotate_motor_time:'Rotate motor %1 to %2 degrees for%3 milliseconds %4',
                kkmoo_set_motor_degree: 'Set motor %1 to %2 degrees %3',
                kkmoo_run_set_value_time:'Run setting value for %1 milliseconds %2',
                kkmoo_set_frame: 'Set the setting value as frame number %1 for temporary-motion %2',
                kkmoo_set_frame_time: 'Set the time of frame number %1 of temporary-motion to %2 milliseconds %3',
                kkmoo_play_temp_motion: 'Run temporary-Motion %1',
                kkmoo_save_to_robot: 'Save the temporary-motion to Kamu-Custom-Motion number %1, name as %2 %3'
            },
            Menus: {
                kkmoo: 'kkmoo',
            },
        },
    };
};

Entry.kkmoo.blockMenuBlocks = [
    'kkmoo_rotate_motor',
    //'kkmoo_isPlaying',
    'kkmoo_motion_play_basic',
    'kkmoo_motion_play_custom',
    'kkmoo_rotate_motor_time',
    'kkmoo_set_motor_degree',
    'kkmoo_run_set_value_time',
    'kkmoo_set_frame',
    'kkmoo_set_frame_time',
    'kkmoo_play_temp_motion',
    'kkmoo_save_to_robot'
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
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;
                        if (angle >= -90 && angle <= 90) {
                            msg = { 'MOT': motnum, 'ANG': angle };
                        }
                        Entry.hw.sendQueue.msg = { 'prot': prot, 'data': msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete Entry.hw.sendQueue.msg;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        /*kkmoo_isPlaying:{
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
                //const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
                //await wait(300);
                //await Entry.hw.update();
                Entry.hw.update();
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
            }
        },*/
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
                const prot = "PM"
                const motionnum = script.getValue('MOTIONNUM',script);
                var msg = motionnum;
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;                    
                        Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete  Entry.hw.sendQueue.msg;
                        return script.callReturn();
                    }
                    else{
                        console.log("!!");
                        return script;
                    } 
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
                const prot = "CM"
                const motionnum = script.getValue('MOTIONNUM',script);
                var msg = motionnum;
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;                    
                        Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete  Entry.hw.sendQueue.msg;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
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
                        type:"number",
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
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;                    
                        if(angle>=-90 && angle<=90){
                            msg={'MOT':motnum,'ANG':angle,"TME":time};
                        }
                        Entry.hw.sendQueue.msg = {'prot':prot,'data':msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || script.getValue('TIME',script)==0 ||Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete  Entry.hw.sendQueue.msg;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
                }     
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
//===================================================================동작 만들기=============================================
        kkmoo_set_motor_degree: {
            template: Lang.template.kkmoo_set_motor_degree,
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
                        type:"number",
                        params:['0'],
                }],
                type: 'kkmoo_set_motor_degree',
            },
            class: 'Make_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const motnum = script.getField('MOTNUM',script);
                const angle = script.getValue('ANGLE',script);
                Entry.hw.update();
                if (script.isStart != true) {
                                       
                    script.isStart = true;
                    if (angle >= -90 && angle <= 90) {
                        Entry.kkmoo.motData[motnum].angle = angle;
                    }
                    else if(angle>90){
                        Entry.kkmoo.motData[motnum].angle = 90;
                    }else{
                        Entry.kkmoo.motData[motnum].angle = -90;
                    }
                    return script;
                   
                }
                else {       
                    delete script.isStart;
                    console.log(Entry.kkmoo.motData);
                    return script.callReturn();
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        kkmoo_run_set_value_time: {
            template: Lang.template.kkmoo_run_set_value_time,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                TIME: 0,
            },
            events: {},
            def: {
                params: [{
                        type:"number",
                        params:['0'],
                }],
                type: 'kkmoo_run_set_value_time',
            },
            class: 'Make_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const prot = "MP"
                var msg = [];
                Entry.hw.update();
                console.log(Entry.hw.portData.data);
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;
                        for(var i of Entry.kkmoo.motData){
                            var angle = i.angle;
                            var motnum = i.num;
                            msg.push({ 'MOT': motnum, 'ANG': angle });
                        }
                        msg.push(script.getValue('TIME',script));
                        Entry.hw.sendQueue.msg = { 'prot': prot, 'data': msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;  
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || script.getValue('TIME',script) == 0 || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete Entry.hw.sendQueue.msg;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
                }
            },
        },
        kkmoo_set_frame: {
            template: Lang.template.kkmoo_set_frame,
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
                    ['18','18'],['19','19'],['20','20']
                ],
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
            },
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }               
            ],
            paramsKeyMap: {
                FRAME: 0,
            },
            events: {},
            def: {
                params: [
                    "0", //dropdown의 경우 VALUE값이 초기값
                    ],
                type: 'kkmoo_set_frame',
            },
            class: 'Save_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const motnum = script.getField('FRAME',script);
                Entry.hw.update();
                if (script.isStart != true) {   
                    script.isStart = true;
                    var data = Entry.kkmoo.copyObj(Entry.kkmoo.motData);
                    Entry.kkmoo.motionFrame[motnum].data = data;
                    return script;
                   
                }
                else {       
                    delete script.isStart;
                    console.log(Entry.kkmoo.motionFrame);
                    return script.callReturn();
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        kkmoo_set_frame_time: {
            template: Lang.template.kkmoo_set_frame_time,
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
                    ['18','18'],['19','19'],['20','20']
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
                FRAME: 0,
                TIME: 1,
            },
            events: {},
            def: {
                params: [
                    "0", //dropdown의 경우 VALUE값이 초기값
                    {
                        type:"number",
                        params:['0'],
                    } 
                    ],
                type: 'kkmoo_set_frame_time',
            },
            class: 'Save_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const motnum = script.getField('FRAME',script);
                const time = script.getValue('TIME',script);
                Entry.hw.update();
                if (script.isStart != true) {   
                    script.isStart = true;
                    Entry.kkmoo.motionFrame[motnum].time = time;
                    return script;
                   
                }
                else {       
                    delete script.isStart;
                    console.log(Entry.kkmoo.motionFrame);
                    return script.callReturn();
                }
                
                
                //return null;
                //return script.callReturn();
            },
            //syntax: undefined,
        },
        kkmoo_play_temp_motion: {
            template: Lang.template.kkmoo_play_temp_motion,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }               
            ],
            paramsKeyMap: {},
            events: {},
            def: {
                params: [],
                type: 'kkmoo_play_temp_motion',
            },
            class: 'Save_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const prot = "PT"
                var msg = [];
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;
                        
                        for(var dat of Entry.kkmoo.motionFrame){//frame,data,time
                            if(dat.data != null && dat.time !=0){
                                Entry.kkmoo.playcnt ++;
                                msg.push(dat);
                            }
                        }
                        Entry.hw.sendQueue.msg = { 'prot': prot, 'data': msg};
                        Entry.kkmoo.setTimeout(500);
                        return script;  
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || Entry.kkmoo.playcnt == 0 || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete Entry.hw.sendQueue.msg;
                        Entry.kkmoo.playcnt = 0;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
                }
            },
        },
        kkmoo_save_to_robot: {
            template: Lang.template.kkmoo_save_to_robot,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_without_next',
            statements: [],
            params: [
            {
                type:'Block',
                accept:"string",
                converter: Entry.block.converters.returnStringOrNumberByValue,
            },
            {
                type:'Block',
                accept:"string",
            },   
            {
                type:'Indicator',
                img : 'block_icon/hardware_icon.svg',
                size: 12,
            }               
            ],
            paramsKeyMap: {
                SLOT: 0,
                NAME: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type:"number",
                        params:['0'],
                    } , 
                    {
                        type:"text",
                        params:['이름'],
                    } 
                    ],
                type: 'kkmoo_save_to_robot',
            },
            class: 'Save_Motion',
            isNotFor: ['kkmoo'],
            func: function(sprite, script) {
                const prot = "SV"
                var msg = [];
                var my_json = {"name":"","frame_length":"","frames":[]};
                Entry.hw.update();
                if (script.isStart != true) {
                    if (Entry.hw.portData.data == 'true') {
                        return script;
                    }
                    else {
                        script.isStart = true;
                        
                        for(var dat of Entry.kkmoo.motionFrame){//frame,data,time
                            if(dat.data != null && dat.time !=0){
                                msg.push(dat);
                                var frame = {"index":"","transition_time":"","outputs":[]};
                                frame.index = Entry.kkmoo.playcnt;
                                frame.transition_time = parseInt(dat.time);
                                Entry.kkmoo.playcnt ++;
                                var my_data = [
                                    {"device":"left_shoulder_pitch","value":""},{"device":"left_thigh_yaw","value":""},{"device":"left_shoulder_roll","value":""},{"device":"left_elbow_roll","value":""},
                                    {"device":"left_thigh_roll","value":""},{"device":"left_thigh_pitch","value":""},{"device":"left_knee_pitch","value":""},{"device":"left_foot_pitch","value":""},
                                    {"device":"left_foot_roll","value":""},{"device":"right_shoulder_pitch","value":""},{"device":"right_thigh_yaw","value":""},{"device":"right_shoulder_roll","value":""},
                                    {"device":"right_elbow_roll","value":""},{"device":"right_thigh_roll","value":""},{"device":"right_thigh_pitch","value":""},{"device":"right_knee_pitch","value":""},
                                    {"device":"right_foot_pitch","value":""},{"device":"right_foot_roll","value":""}
                                ]; 
                                for(var i in dat.data){
                                    my_data[i].value = parseInt(dat.data[i].angle);
                                }
                                frame.outputs = my_data;
                                my_json.frames.push(frame);
                            }
                        }
                        var slot = script.getValue('SLOT',script);
                        var name = script.getValue('NAME',script);
                        var namelength = 0;
                        var result = "";
                        for(var i of name){
                            var buf = Buffer.from(i,'utf-8').toString('hex');
                            var length = buf.length;
                            if(namelength+length>40){
                                break;
                            }
                            else{
                                namelength += length;
                                result += buf;
                            }
                        }
                        result = result.padEnd(40,"20");
                        var numBytes = result.length / 2;
                        var byteArray = new Uint8Array(numBytes);
                        for (var i=0; i<numBytes; i++) {
                            byteArray[i] = parseInt(result.substr(i*2, 2), 16);
                        }
                        const decoder = new TextDecoder('utf-8');
                        var name_string = decoder.decode(byteArray);
                        my_json.name = name_string;
                        my_json.frame_length = msg.length;
                        const CryptoJS = require('crypto-js');
                        var hash = CryptoJS.SHA256(JSON.stringify(my_json)).toString().substring(0,10);
                        Entry.hw.sendQueue.msg = { 'prot': prot, 'data': msg,'slot':slot,'name':name_string,'hash':hash};
                        Entry.kkmoo.setTimeout(500);
                        return script;  
                    }
                }
                else {       
                    if(Entry.hw.portData.data == 'true' || Entry.kkmoo.playcnt == 0 || Entry.kkmoo.timeOut()){
                        delete script.isStart;
                        delete Entry.hw.sendQueue.msg;
                        Entry.kkmoo.playcnt = 0;
                        return script.callReturn();
                    }
                    else{
                        return script;
                    } 
                }
            },
        }
    };
};

module.exports = Entry.kkmoo;
