"use strict";
Entry.MODI = {
    name: 'modi',
    setZero: function() {
        Entry.hw.sendQueue.moduleValue = {
            "led" : [],
            "motor" : [], 
            "speaker" : [],
            "display" : []
        }
        Entry.hw.sendQueue["getProperty"] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0
        };
        Entry.hw.update();
        
    },
    initSend: function() {
        Entry.hw.sendQueue.moduleValue = {
            "led" : [],
            "motor" : [], 
            "speaker" : [],
            "display" : []
        }
        Entry.hw.sendQueue["getProperty"] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0
        };
        Entry.hw.update();
    },
    getModule: {
        id: 0,
        property: 0
    },
    microphoneList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["mic"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["mic"].length ; i++) {
            if(moduleData["mic"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    environmentList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["environment"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["environment"].length ; i++) {
            if(moduleData["environment"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    dialList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["dial"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["dial"].length ; i++) {
            if(moduleData["dial"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    gyroscopeList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};
       
        if(moduleData["gyro"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["gyro"].length ; i++) {
            if(moduleData["gyro"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    buttonList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};
        
        if(moduleData["button"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["button"].length ; i++) {
            if(moduleData["button"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    infraredList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};
        
        if(moduleData["ir"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["ir"].length ; i++) {
            if(moduleData["ir"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ultrasonicList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["ultrasonic"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["ultrasonic"].length ; i++) {
            if(moduleData["ultrasonic"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    motorList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};
 
        if(moduleData["motor"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }
        list = [];
        for (var i = 0; i < moduleData["motor"].length ; i++) {
            if(moduleData["motor"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ledList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};
        
        if(moduleData["led"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["led"].length ; i++) {
            if(moduleData["led"][i])
                list.push([i, i]);
        }
        return list;
    },
    speakerList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["speaker"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["speaker"].length ; i++) {
            if(moduleData["speaker"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    displayList: function() {
        var list;
        var moduleData = Entry.hw.portData["module"] || {};

        if(moduleData["display"] === undefined){
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData["display"].length ; i++) {
            if(moduleData["display"][i])
                list.push([i.toString(), i.toString()]);
        }
        return list;
    }
};