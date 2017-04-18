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

Blockly.Blocks.modi_microphone_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("마이크")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.microphoneList), "name")
        .appendField("번의 볼륨");        this.setOutput(true, 'Number');

        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_environment_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("환경센서")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.environmentList), "name")
        .appendField("번의 ");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([//리스트 바꿔야함 순서 바꿔
            [Lang.Blocks.modi_enviroment_temperature,"온도"],
          [Lang.Blocks.modi_enviroment_humidity,"습도"],
          [Lang.Blocks.modi_enviroment_illuminance,"조도"],
          ]), "envValue");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.moid_dial_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("다이얼")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.dialList), "name")
        .appendField("번의 각도");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_gyroscope_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("자이로센서")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.gyroscopeList), "name")
        .appendField("번의 ");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Roll","Roll"],
          ["Pitch","Pitch"],
          ["Yaw","Yaw"],
          [Lang.Blocks.modi_gyroscope_xAcceleratior,"X축 가속"],
          [Lang.Blocks.modi_gyroscope_yAcceleratior,"Y축 가속"],
          [Lang.Blocks.modi_gyroscope_zAcceleratior,"Z축 가속"]
          ]), "gyroValue");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_button_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("버튼 ")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.buttonList), "name")
        .appendField("번의 ");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Click","Click"],
          ["Double Click","Double Click"],
          ["Toggle","Toggle"],
          ["Press","Press"]
          ]), "buttonValue");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_is_button_touch = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("버튼 ")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.buttonList), "name")
        .appendField("번의 ");
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ["Click","Click"],
          ["Double Click","Double Click"],
          ["Toggle","Toggle"],
          ["Press","Press"]
          ]), "buttonValue")
        .appendField("했는가?");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_button_true = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("눌림");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_button_false = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("안눌림");
        this.setOutput(true, 'Boolean');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_infrared_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("적외선")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.infraredList), "name")
        .appendField("번 센서의 거리(%)");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_ultrasonic_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField("초음파")
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.ultrasonicList), "name")
        .appendField("번 센서의 거리(%)");
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Blockly.Blocks.modi_set_motor_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('모터 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.motorList), "name")
        .appendField('번 ');
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.modi_motor_angle,"각도"],
          [Lang.Blocks.modi_motor_speed,"속도"],
          [Lang.Blocks.modi_motor_torque,"회전"]
          ]), "motorValue")
        .appendField('의 상단값은 ');
        this.appendValueInput("uValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('하단값은 ');
        this.appendValueInput("bValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField(' (으)로 정하기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_change_motor_upper_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('모터 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.motorList), "name")
        .appendField('번 ');
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.modi_motor_angle,"각도"],
          [Lang.Blocks.modi_motor_speed,"속도"],
          [Lang.Blocks.modi_motor_torque,"회전"]
          ]), "motorValue")
        .appendField('의 상단값을 ');
        this.appendValueInput("uValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('만큼 바꾸기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_change_motor_bottom_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('모터 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.motorList), "name")
        .appendField('번 ');
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.modi_motor_angle,"각도"],
          [Lang.Blocks.modi_motor_speed,"속도"],
          [Lang.Blocks.modi_motor_torque,"회전"]
          ]), "motorValue")
        .appendField('의 하단값을 ');
        this.appendValueInput("bValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('만큼 바꾸기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_clear_led = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('LED ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.ledList), "name")
        .appendField('번의 색 끄기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_set_led_rgb = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('LED ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.ledList), "name")
        .appendField('번 R');
        this.appendValueInput("rValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('G');
        this.appendValueInput("gValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('B');
        this.appendValueInput("bValue")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('(으)로 켜기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_set_led_color = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('LED ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.ledList), "name")
        .appendField('번 색')
        .appendField(new Blockly.FieldColour('#ff0000'),'color')
        .appendField('로 정하기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_set_basic_speaker = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('스피커 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.speakerList), "name")
        .appendField('번을')
        .appendField(new Blockly.FieldDropdown([
            [Lang.Blocks.modi_speaker_F_DO_4,"도4"],
            [Lang.Blocks.modi_speaker_F_RE_4,"레4"],
            [Lang.Blocks.modi_speaker_F_MI_4,"미4"],
            [Lang.Blocks.modi_speaker_F_PA_4,"파4"],
            [Lang.Blocks.modi_speaker_F_SOL_4,"솔4"],
            [Lang.Blocks.modi_speaker_F_RA_4,"라4"],
            [Lang.Blocks.modi_speaker_F_SO_4,"시4"],
            [Lang.Blocks.modi_speaker_F_DO_S_4,"도#4"],
            [Lang.Blocks.modi_speaker_F_RE_S_4,"레#4"],
            [Lang.Blocks.modi_speaker_F_PA_S_4,"파#4"],
            [Lang.Blocks.modi_speaker_F_SOL_S_4,"솔#4"],
            [Lang.Blocks.modi_speaker_F_RA_S_4,"라#4"],
            [Lang.Blocks.modi_speaker_F_DO_5,"도5"],
            [Lang.Blocks.modi_speaker_F_RE_5,"레5"],
            [Lang.Blocks.modi_speaker_F_MI_5,"미5"],
            [Lang.Blocks.modi_speaker_F_PA_5,"파5"],
            [Lang.Blocks.modi_speaker_F_SOL_5,"솔5"],
            [Lang.Blocks.modi_speaker_F_RA_5,"라5"],
            [Lang.Blocks.modi_speaker_F_SO_5,"시5"],
            [Lang.Blocks.modi_speaker_F_DO_S_5,"도#5"],
            [Lang.Blocks.modi_speaker_F_RE_S_5,"라#5"],
            [Lang.Blocks.modi_speaker_F_PA_S_5,"파#5"],
            [Lang.Blocks.modi_speaker_F_SOL_S_5,"솔#5"],
            [Lang.Blocks.modi_speaker_F_RA_S_5,"라#5"],
            [Lang.Blocks.modi_speaker_F_DO_6,"도6"],
            [Lang.Blocks.modi_speaker_F_RE_6,"레6"],
            [Lang.Blocks.modi_speaker_F_MI_6,"미6"],
            [Lang.Blocks.modi_speaker_F_PA_6,"파6"],
            [Lang.Blocks.modi_speaker_F_SOL_6,"솔6"],
            [Lang.Blocks.modi_speaker_F_RA_6,"라6"],
            [Lang.Blocks.modi_speaker_F_SO_6,"시6"],
            [Lang.Blocks.modi_speaker_F_DO_S_6,"도#6"],
            [Lang.Blocks.modi_speaker_F_RE_S_6,"레#6"],
            [Lang.Blocks.modi_speaker_F_PA_S_6,"파#6"],
            [Lang.Blocks.modi_speaker_F_SOL_S_6,"솔#6"],
            [Lang.Blocks.modi_speaker_F_RA_S_6,"라#6"],
            [Lang.Blocks.modi_speaker_F_DO_7,"도7"],
            [Lang.Blocks.modi_speaker_F_RE_7,"레7"],
            [Lang.Blocks.modi_speaker_F_MI_7,"미7"],
            [Lang.Blocks.modi_speaker_F_PA_7,"파7"],
            [Lang.Blocks.modi_speaker_F_SOL_7,"솔7"],
            [Lang.Blocks.modi_speaker_F_RA_7,"라7"],
            [Lang.Blocks.modi_speaker_F_SO_7,"시7"],
            [Lang.Blocks.modi_speaker_F_DO_S_7,"도#7"],
            [Lang.Blocks.modi_speaker_F_RE_S_7,"레#7"],
            [Lang.Blocks.modi_speaker_F_PA_S_7,"파#7"],
            [Lang.Blocks.modi_speaker_F_SOL_S_7,"솔#7"],
            [Lang.Blocks.modi_speaker_F_RA_S_7,"라#7"]
          ]), "speakerValue");
        this.appendDummyInput()
        .appendField('음으로 크기는');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('(으)로 정하기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_set_custom_speaker = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('스피커 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.speakerList), "name")
        .appendField('번의 진동수는');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('크기는 ');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('(으)로 정하기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_change_speaker_frequence = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('스피커 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.speakerList), "name")
        .appendField('번의 진동수를');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('만큼 바꾸기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_change_speaker_volume = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('스피커 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.speakerList), "name")
        .appendField('번의 크기를');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('만큼 바꾸기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.Blocks.modi_print_display_by_value = {
    init: function() {
        this.setColour("#00979D");
        this.appendDummyInput()
        .appendField('디스플레이 ')
        .appendField(new Blockly.FieldDropdownDynamic(Entry.MODI.displayList), "name")
        .appendField('번의 화면에');
        this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
        this.appendDummyInput()
        .appendField('보이기')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};