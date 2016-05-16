Entry.Neobot = {
    name: 'neobot',
    LOCAL_MAP: [
        'IN1',
        'IN2',
        'IN3',
        'IR',
        'BAT'
    ],
    REMOTE_MAP: [
        'OUT1',
        'OUT2',
        'OUT3',
        'DCR',
        'DCL',
        'SND',
        'FND',
        'OPT'
    ],
    setZero: function () {
        for(var port in Entry.Neobot.REMOTE_MAP) {
            Entry.hw.sendQueue[Entry.Neobot.REMOTE_MAP[port]] = 0;
        }
        Entry.hw.update();
    },
    name: 'neobot',
    monitorTemplate: {
        imgPath: 'hw/neobot.png',
        width: 700,
        height: 700,
        listPorts: {
            'NOTE':{name: Lang.Hw.buzzer , type: 'output', pos: {x: 0, y: 0}},
            'FND':{name: 'FND', type: 'output', pos: {x: 0, y: 0}}
        },
        ports: {
            'IN1':{name: 'IN1', type: 'input', pos: {x: 270, y: 200}},
            'IN2':{name: 'IN2', type: 'input', pos: {x : 325, y: 200}},
            'IN3':{name: 'IN3', type: 'input', pos: {x: 325, y: 500}},
            'DCL':{name: 'L-Motor', type: 'output', pos: {x: 270, y: 500}},
            'DCR':{name: 'R-Motor', type: 'output', pos: {x: 435, y: 500}},
            'OUT1':{name: 'OUT1', type: 'output', pos: {x: 380, y: 200}},
            'OUT2':{name: 'OUT2', type: 'output', pos: {x: 435, y: 200}},
            'OUT3':{name: 'OUT3', type: 'output', pos: {x: 380, y: 500}}
        },
        mode: 'both'
    }
}

Blockly.Blocks.neobot_sensor_value = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('')
            .appendField(new Blockly.FieldDropdown([
                ['1번 포트','IN1'],
                ['2번 포트','IN2'],
                ['3번 포트','IN3'],
                ['리모컨','IR'],
                ['배터리','BAT'],
            ]), 'PORT')
            .appendField(' 값');
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
    }
};

Entry.block.neobot_sensor_value = function (sprite, script) {
    var port = script.getStringField('PORT');
    return Entry.hw.portData[port];
};

Blockly.Blocks.neobot_left_motor = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('왼쪽모터를')
            .appendField(new Blockly.FieldDropdown([
                ['앞으로', '16'],
                ['뒤로', '32']
            ]), 'DIRECTION')
            .appendField(new Blockly.FieldDropdown([
                ['0','0'],
                ['1','1'],
                ['2','2'],
                ['3','3'],
                ['4','4'],
                ['5','5'],
                ['6','6'],
                ['7','7'],
                ['8','8'],
                ['9','9'],
                ['10','10'],
                ['11','11'],
                ['12','12'],
                ['13','13'],
                ['14','14'],
                ['15','15']
            ]), 'SPEED')
            .appendField('의 속도로 회전')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_left_motor = function (sprite, script) {
    var speed = script.getNumberField('SPEED');
    var direction = script.getNumberField('DIRECTION');
    Entry.hw.sendQueue['DCL'] = speed + direction;
    return script.callReturn();
};

Blockly.Blocks.neobot_stop_left_motor = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('왼쪽모터 정지')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_stop_left_motor = function (sprite, script) {
    Entry.hw.sendQueue['DCL'] = 0;
    return script.callReturn();
};

Blockly.Blocks.neobot_right_motor = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('오른쪽모터를')
            .appendField(new Blockly.FieldDropdown([
                ['앞으로', '16'],
                ['뒤로', '32']
            ]), 'DIRECTION')
            .appendField(new Blockly.FieldDropdown([
                ['0','0'],
                ['1','1'],
                ['2','2'],
                ['3','3'],
                ['4','4'],
                ['5','5'],
                ['6','6'],
                ['7','7'],
                ['8','8'],
                ['9','9'],
                ['10','10'],
                ['11','11'],
                ['12','12'],
                ['13','13'],
                ['14','14'],
                ['15','15']
            ]), 'SPEED')
            .appendField('의 속도로 회전')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_right_motor = function (sprite, script) {
    var speed = script.getNumberField('SPEED');
    var direction = script.getNumberField('DIRECTION');
    Entry.hw.sendQueue['DCR'] = speed + direction;
    return script.callReturn();
};


Blockly.Blocks.neobot_stop_right_motor = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('오른쪽모터 정지')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_stop_right_motor = function (sprite, script) {
    Entry.hw.sendQueue['DCR'] = 0;
    return script.callReturn();
};

Blockly.Blocks.neobot_all_motor = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('양쪽 모터를 ')
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['0','0'],
                ['1','1'],
                ['2','2'],
                ['3','3'],
                ['4','4'],
                ['5','5'],
                ['6','6'],
                ['7','7'],
                ['8','8'],
                ['9','9'],
                ['10','10'],
                ['11','11'],
                ['12','12'],
                ['13','13'],
                ['14','14'],
                ['15','15']
            ]), 'SPEED')
            .appendField(' 의 속도로 ')
            .appendField(new Blockly.FieldDropdown([
                ['전진','1'],
                ['후진','2'],
                ['제자리 좌회전','3'],
                ['제자리 우회전','4'],
                ['좌회전','5'],
                ['우회전','6'],
            ]), 'DIRECTION')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_all_motor = function (sprite, script) {
    var type = script.getNumberField('TYPE');
    var speed = script.getNumberField('SPEED');
    var direction = script.getNumberField('DIRECTION');
    switch (direction) {
        case 1:
        Entry.hw.sendQueue['DCL'] = 0x10 + speed;
        Entry.hw.sendQueue['DCR'] = 0x10 + speed;
        break;
        case 2:
        Entry.hw.sendQueue['DCL'] = 0x20 + speed;
        Entry.hw.sendQueue['DCR'] = 0x20 + speed;
        break;
        case 3:
        Entry.hw.sendQueue['DCL'] = 0x20 + speed;
        Entry.hw.sendQueue['DCR'] = 0x10 + speed;
        break;
        case 4:
        Entry.hw.sendQueue['DCL'] = 0x10 + speed;
        Entry.hw.sendQueue['DCR'] = 0x20 + speed;
        break;
        case 5:
        Entry.hw.sendQueue['DCL'] = 0;
        Entry.hw.sendQueue['DCR'] = 0x10 + speed;
        break;
        case 6:
        Entry.hw.sendQueue['DCL'] = 0x10 + speed;
        Entry.hw.sendQueue['DCR'] = 0;
        break;
    }

    return script.callReturn();
};


Blockly.Blocks.neobot_set_servo = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ['OUT1','1'],
            ['OUT2','2'],
            ['OUT3','3']
        ]), 'PORT')
        .appendField('포트의 서보모터를')
        .appendField(new Blockly.FieldDropdown([
            ['0도','0'],
            ['10도','10'],
            ['20도','20'],
            ['30도','30'],
            ['40도','40'],
            ['50도','50'],
            ['60도','60'],
            ['70도','70'],
            ['80도','80'],
            ['90도','90'],
            ['100도','100'],
            ['110도','110'],
            ['120도','120'],
            ['130도','130'],
            ['140도','140'],
            ['150도','150'],
            ['160도','160'],
            ['170도','170'],
            ['180도','180']
        ]), 'DEGREE')
        .appendField(' 이동')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_set_servo = function (sprite, script) {
    var port = script.getNumberField('PORT');
    var degree = script.getNumberField('DEGREE');
    Entry.hw.sendQueue['OUT' + port] = degree;
    var option = port;
    if(option === 3) {
        option = 4;
    }
    Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | option;
    return script.callReturn();
};

Blockly.Blocks.neobot_set_output = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['OUT1','1'],
                ['OUT2','2'],
                ['OUT3','3']
            ]), 'PORT')
            .appendField('번 포트의 값을')
        this.appendValueInput("VALUE")
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('만큼 출력')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_set_output = function (sprite, script) {
    var port = script.getStringField('PORT', script);
    var value = script.getNumberValue('VALUE', script);
    var option = port;
    if(value < 0) {
        value = 0;
    } else if (value > 255) {
        value = 255;
    }
    if(option === 3) {
        option = 4;
    }
    Entry.hw.sendQueue['OUT' + port] = value;
    Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~option);
    return script.callReturn();
};

Blockly.Blocks.neobot_set_fnd = {
    init: function() {
        this.setColour('#00979D');
        this.appendDummyInput()
            .appendField('FND에')
        this.appendValueInput("VALUE")
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('출력')
            .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Entry.block.neobot_set_fnd = function (sprite, script) {
    var value = script.getNumberValue('VALUE', script);
    if(value > 255) {
        value = 255;
    } else if(value < 0) {
        value = 0;
    }
    Entry.hw.sendQueue['FND'] = value;
    return script.callReturn();
};

Blockly.Blocks.neobot_play_note_for = {
  init: function() {
    this.setColour('#00979D');
    this.appendDummyInput()
    .appendField('멜로디')
    .appendField(new Blockly.FieldDropdown([
        ['무음','0'],
        [Lang.General.note_c,'1'],
        [Lang.General.note_c + '#','2'],
        [Lang.General.note_d,'3'],
        [Lang.General.note_d + '#','4'],
        [Lang.General.note_e,'5'],
        [Lang.General.note_f,'6'],
        [Lang.General.note_f + '#','7'],
        [Lang.General.note_g,'8'],
        [Lang.General.note_g + '#','9'],
        [Lang.General.note_a,'10'],
        [Lang.General.note_a + '#','11'],
        [Lang.General.note_b,'12']
    ]), 'NOTE')
    .appendField('을(를)')
    .appendField(new Blockly.FieldDropdown([
        ['1','0'],
        ['2','1'],
        ['3','2'],
        ['4','3'],
        ['5','4'],
        ['6','5']
    ]), 'OCTAVE')
    .appendField('옥타브로')
    .appendField(new Blockly.FieldDropdown([
        ['2분음표','2'],
        ['4분음표','4'],
        ['8분음표','8'],
        ['16분음표','16'],
    ]), 'DURATION');
    this.appendDummyInput()
    .appendField('길이만큼 소리내기')
    .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.neobot_play_note_for = function (sprite, script) {
    // var note = script.getNumberField('NOTE', script);
    // var octave = script.getNumberField('OCTAVE', script);
    // var duration = script.getNumberField('DURATION', script);
    // var value = note * octave;
    // if(value > 65) {
    //     value = 65;
    // }
    // Entry.hw.sendQueue['SND'] = value;

    // return script.callReturn();

    var sq = Entry.hw.sendQueue;

    if (!script.isStart) {
        var note = script.getNumberField("NOTE", script);
        var octave = script.getNumberField("OCTAVE", script);
        var duration = script.getNumberField("DURATION", script);
        var value = note + (12 * octave);

        script.isStart = true;
        script.timeFlag = 1;
        if(value > 65) {
            value = 65;
        }
        sq.SND = value;
        setTimeout(function() {
            script.timeFlag = 0;
        }, 1 / duration * 2000);
        return script;
    } else if (script.timeFlag == 1) {
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.hw.sendQueue['SND'] = 0;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }

};