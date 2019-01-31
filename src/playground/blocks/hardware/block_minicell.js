'use strict';

Entry.Minicell = {
    id: 'FF.FF',
    name: 'minicell',
    url: 'http://http://www.needsrobot.com/',
    title: {
        'ko': '미니셀',
        'en': 'MiniCell',
    },
    setZero: function() {
        var mcell = Entry.Minicell.KEY;
        var sq = Entry.hw.sendQueue;
        for(var key in mcell)
            delete sq[Entry.Minicell.KEY[key]];
        sq.set_zero = {};
        Entry.hw.update();
        delete sq.set_zero;
    },
    KEY: {
        DC_MOTOR: 'dc_motor',
        RC_MOTOR: 'rc_motor',
        BUZZER: 'buzzer',
        LED_R: 'led_r',  
        LED_G: 'led_g',  
        LED_B: 'led_b',
    },
    monitorTemplate:{
        imgPath: 'hw/minicell.png',
        width: 700,
        height: 421,
        listPorts:{
            IR0: {name: '바닥감지센서', type: 'input', pos: {x: 0, y: 0}},
            CDS0: {name: '조도센서', type: 'input', pos: {x: 0, y: 0}},
            POT0: {name: '가변저항', type: 'input', pos: {x: 0, y: 0}},
            TACT_SWITCH0: {name: '버튼', type: 'input', pos: {x: 0, y: 0}},
        },
        mode:'both'
    },
    toRGB: function(h) {
        var rgb = {};
        if(h > 1000) {
            rgb.r = 255;
            rgb.g = 255;
            rgb.b = 255;
            return rgb;
        } else if(h < -1000) {
            rgb.r = 0;
            rgb.g = 0;
            rgb.b = 0;
            return rgb;
        }

        var _h = parseInt(h / 100); 
        var s = 100;
        var l = 50 + 5*_h;
        h = parseFloat(h) % 100;

        h = h / 100;
        s = parseFloat(s) / 100;
        l = parseFloat(l) / 100;

        

        var q = 0;

        if (l < 0.5) q = l * (1+s);
        else q = (l+s) - (s*l);

        var p = 2*l - q;

        var r = Math.max(0, Entry.Minicell.hueToRGB(p, q, h + (1/3)));
        var g = Math.max(0, Entry.Minicell.hueToRGB(p, q, h));
        var b = Math.max(0, Entry.Minicell.hueToRGB(p, q, h - (1/3)));

        
        rgb.r = Math.round(Math.min(r, 1) * 255);
        rgb.g = Math.round(Math.min(g, 1) * 255);
        rgb.b = Math.round(Math.min(b, 1) * 255);


        return rgb;
    },

    hueToRGB: function(p, q, h) {
        if (h < 0) h += 1;
        if (h > 1) h -= 1;

        if (6*h < 1) return p + ((q-p) * 6 * h);
        if (2*h < 1) return q;
        if (3*h < 2) return p + ((q-p) * 6 * ((2/3)-h));

        return p;
    },        

};

Entry.Minicell.blockMenuBlocks = [
    'minicell_inputsensor',
    'minicell_ispressed',

    'minicell_buzzer_off',
    'minicell_buzzer_note',
    'minicell_buzzer_note_delay',

    'minicell_led_toggle',
    'minicell_led_color',
    'minicell_led_color_number',
    'minicell_led',
    'minicell_led_pwm',

    'minicell_motor_stop',
    'minicell_dc_motor',
    'minicell_dc_motor_for_secs',
    'minicell_rc_motor',
//    'minicell_rc_motor_for_secs',
];

Entry.Minicell.getBlocks = function() {
    return {
        minicell_inputsensor: { 
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_ir, 'IR'],
                        [Lang.Blocks.MINICELL_pot, 'POT'],
                        [Lang.Blocks.MINICELL_button, 'TACT_SWITCH'],
                        [Lang.Blocks.MINICELL_cds, 'CDS'],
                    ],
                    value: 'IR',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value: '1',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'minicell_inputsensor'
            },
            paramsKeyMap: {
                'TYPE': 0,
                'INDEX': 1
            },
            class: 'minicell_input',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData[script.getField('TYPE', script)+script.getField('INDEX', script)];
                return pd;
            },
            syntax: { js: [], py: ['Minicell.inputsensor(%1, %2)']},
        },
        minicell_ispressed: { 
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value: '1',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'minicell_ispressed'
            },
            paramsKeyMap: {
                'INDEX': 0
            },
            class: 'minicell_input',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData['TACT_SWITCH' + script.getField('INDEX', script)];
                if(pd == 1) return true;
                else return false;
            },
            syntax: { js: [], py: ['Minicell.ispressed(%1)']},
        },
        minicell_buzzer_off: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
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
                type: 'minicell_buzzer_off'
            },
            paramsKeyMap: {
                'INDEX': 0,
            },
            class: 'minicell_buzzer',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);

                buf.idx = idx;
                buf.value = 0;

                sq.buzzer = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.buzzer_off(%1, %2)']}
        },
        minicell_buzzer_note: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_buzzer_note_c, '48'],
                        [Lang.Blocks.MINICELL_buzzer_note_cs, '49'],
                        [Lang.Blocks.MINICELL_buzzer_note_d, '50'],
                        [Lang.Blocks.MINICELL_buzzer_note_ds, '51'],
                        [Lang.Blocks.MINICELL_buzzer_note_e, '52'],
                        [Lang.Blocks.MINICELL_buzzer_note_f, '53'],
                        [Lang.Blocks.MINICELL_buzzer_note_fs, '54'],
                        [Lang.Blocks.MINICELL_buzzer_note_g, '55'],
                        [Lang.Blocks.MINICELL_buzzer_note_gs, '56'],
                        [Lang.Blocks.MINICELL_buzzer_note_a, '57'],
                        [Lang.Blocks.MINICELL_buzzer_note_as, '58'],
                        [Lang.Blocks.MINICELL_buzzer_note_b, '59'],
                    ],
                    value:'48'
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
                type: 'minicell_buzzer_note'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'NOTE': 1,
            },
            class: 'minicell_buzzer',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var value = script.getNumberField('NOTE', script);

                buf.idx = idx;
                buf.value = value;

                sq.buzzer = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.buzzer_note(%1, %2, %3)']}
        },
        minicell_buzzer_note_delay: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_buzzer_note_c, '48'],
                        [Lang.Blocks.MINICELL_buzzer_note_cs, '49'],
                        [Lang.Blocks.MINICELL_buzzer_note_d, '50'],
                        [Lang.Blocks.MINICELL_buzzer_note_ds, '51'],
                        [Lang.Blocks.MINICELL_buzzer_note_e, '52'],
                        [Lang.Blocks.MINICELL_buzzer_note_f, '53'],
                        [Lang.Blocks.MINICELL_buzzer_note_fs, '54'],
                        [Lang.Blocks.MINICELL_buzzer_note_g, '55'],
                        [Lang.Blocks.MINICELL_buzzer_note_gs, '56'],
                        [Lang.Blocks.MINICELL_buzzer_note_a, '57'],
                        [Lang.Blocks.MINICELL_buzzer_note_as, '58'],
                        [Lang.Blocks.MINICELL_buzzer_note_b, '59'],
                    ],
                    value:'48'
                },
                {
                    "type": "Block",
                    "accept": "string"
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        null,
                        {
                            type: "number",
                            params: [ "0.5" ]
                        },
                        null
                    ],
                type: 'minicell_buzzer_note_delay'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'NOTE': 1,
                'SEC': 2,
            },
            class: 'minicell_buzzer',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                var idx = script.getField('INDEX', script);
                var value = script.getNumberField('NOTE', script);
                var sec = script.getNumberValue('SEC', script);
                
                if(!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    buf.idx = idx;
                    buf.value = value;
                    sq.buzzer = buf;

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, sec * 1000);

                    return script;
                } else if(script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;

                    buf.idx = idx;
                    buf.value = 0;
                    sq.buzzer = buf;
                    Entry.hw.update();
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Minicell.buzzer_note_delay(%1, %2, %3, %4)']}
        },
        minicell_led_toggle: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_led_on, '255'],
                        [Lang.Blocks.MINICELL_led_off, '0'],
                    ],
                    value:'255'
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
                type: 'minicell_led_toggle'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1,
            },
            class: 'minicell_led',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var value = script.getNumberField('VALUE', script);

                buf.idx = idx;
                buf.value_r = value;
                buf.value_g = value;
                buf.value_b = value;

                sq.led_r = buf;
                sq.led_g = buf;
                sq.led_b = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.led_toggle(%1, %2, %3)']}
        },
        minicell_led_color: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Color',
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
                type: 'minicell_led_color'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1
            },
            class: 'minicell_led',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var value = script.getField('VALUE', script);
                var rgb = Entry.hex2rgb(value);

                buf.idx = idx;
                buf.value_r = rgb.r;
                buf.value_g = rgb.g;
                buf.value_b = rgb.b;

                sq.led_r = buf;
                sq.led_g = buf;
                sq.led_b = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.led_color(%1, %2, %3)']}
        },
        minicell_led_color_number: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        {
                            type: 'number',
                            params: [ '0' ]
                        },
                        null
                    ],
                type: 'minicell_led_color_number'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1
            },
            class: 'minicell_led',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var value = script.getNumberValue('VALUE', script);
                var rgb = Entry.Minicell.toRGB(value);

                buf.idx = idx;
                buf.value_r = rgb.r;
                buf.value_g = rgb.g;
                buf.value_b = rgb.b;

                sq.led_r = buf;
                sq.led_g = buf;
                sq.led_b = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.led_color_number(%1, %2, %3)']}
        },
        minicell_led: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_led_on, '255'],
                        [Lang.Blocks.MINICELL_led_off, '0'],
                    ],
                    value:'255'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_led_on, '255'],
                        [Lang.Blocks.MINICELL_led_off, '0'],
                    ],
                    value:'255'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_led_on, '255'],
                        [Lang.Blocks.MINICELL_led_off, '0'],
                    ],
                    value:'255'
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
                type: 'minicell_led'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'R': 1,
                'G': 2,
                'B': 3,
            },
            class: 'minicell_led',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var r = script.getNumberField('R', script);
                var g = script.getNumberField('G', script);
                var b = script.getNumberField('B', script);

                buf.idx = idx;
                buf.value_r = r;
                buf.value_g = g;
                buf.value_b = b;

                sq.led_r = buf;
                sq.led_g = buf;
                sq.led_b = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.led(%1, %2, %3, %4, %5)']}
        },
        minicell_led_pwm: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        {
                            type: 'number',
                            params: [ '255' ]
                        },
                        {
                            type: 'number',
                            params: [ '255' ]
                        },
                        {
                            type: 'number',
                            params: [ '255' ]
                        },
                        null,
                    ],
                type: 'minicell_led_pwm'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'R': 1,
                'G': 2,
                'B': 3,
            },
            class: 'minicell_led',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                
                var idx = script.getField('INDEX', script);
                var r = script.getNumberValue('R', script);
                var g = script.getNumberValue('G', script);
                var b = script.getNumberValue('B', script);

                buf.idx = idx;
                buf.value_r = r;
                buf.value_g = g;
                buf.value_b = b;

                sq.led_r = buf;
                sq.led_g = buf;
                sq.led_b = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.led_pwm(%1, %2, %3, %4, %5)']}
        },
        minicell_motor_stop: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
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
                type: 'minicell_motor_stop'
            },
            paramsKeyMap: {},
            class: 'minicell_motor',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                if(sq.dc_motor) delete sq.dc_motor;
                if(sq.servo_motor) delete sq.servo_motor;

                sq.stop = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.motor_stop(%1)']}
        },
        minicell_rc_motor: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        {
                            type: 'number',
                            params: [ '15' ]
                        },
                        {
                            type: 'number',
                            params: [ '30' ]
                        },
                        null,
                    ],
                type: 'minicell_rc_motor'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'ANGLE': 1,
                 'SPEED': 2,
            },
            class: 'minicell_motor',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                var idx = script.getField('INDEX');
                var angle = script.getNumberValue('ANGLE');
                var speed = script.getNumberValue('SPEED');
                if(speed > 0xff) {
                    speed = 0xff;
                }

                buf.idx = idx;
                buf.angle = angle;
                buf.speed = speed;

                if(sq.stop) delete sq.stop;
                sq.servo_motor = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.rc_motor(%1, %2, %3, %4)']}
        },
        minicell_dc_motor: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_motor_cw, '0'],
                        [Lang.Blocks.MINICELL_motor_ccw, '1'],
                    ],
                    value:'0'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        null,
                        {
                            type: 'number',
                            params: [ '30' ]
                        },
                        null,
                    ],
                type: 'minicell_dc_motor'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'DIR': 1,
                 'SPEED': 2,
            },
            class: 'minicell_motor',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                var idx = script.getField('INDEX');
                var dir = script.getField('DIR');
                var speed = script.getNumberValue('SPEED');

                buf.idx = idx;
                buf.dir = dir;
                buf.speed = speed;

                if(sq.stop) delete sq.stop;
                sq.dc_motor = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['Minicell.dc_motor(%1, %2, %3, %4)']}
        },
        minicell_dc_motor_for_secs: {
            color: '#00CFCA',
            outerLine: '#04B5B0',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_idx0, '1'],
                        [Lang.Blocks.MINICELL_idx1, '2'],
                        [Lang.Blocks.MINICELL_idx2, '3'],
                        [Lang.Blocks.MINICELL_idx3, '4'],
                    ],
                    value:'1'
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.MINICELL_motor_cw, '0'],
                        [Lang.Blocks.MINICELL_motor_ccw, '1'],
                    ],
                    value:'0'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    'type': 'Block',
                    'accept': 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: 
                    [
                        null,
                        null,
                        {
                            type: 'number',
                            params: [ '30' ]
                        },
                        {
                            type: 'number',
                            params: [ '2' ]
                        },
                        null,
                    ],
                type: 'minicell_dc_motor_for_secs'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'DIR': 1,
                 'SPEED': 2,
                 'SECS' : 3,
            },
            class: 'minicell_motor',
            isNotFor: ['minicell'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;
                var idx = script.getField('INDEX');
                var dir = script.getField('DIR');
                var speed = script.getNumberValue('SPEED');
                var secs = script.getNumberValue('SECS');

                if(!script.isStart) {
                    if(sq.stop) delete sq.stop;
                    script.isStart = true;
                    script.timeFlag = 1;

                    buf.idx = idx;
                    buf.dir = dir;
                    buf.speed = speed;

                    sq.dc_motor = buf;

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, secs * 1000);

                    return script;
                } else if(script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;

                    buf.idx = idx;
                    buf.dir = dir;
                    buf.speed = 0;

                    sq.dc_motor = buf;
                    Entry.hw.update();
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Minicell.dc_motor_for_secs(%1, %2, %3, %4, %5)']}
        },
    };
};

Entry.Minicell.setLanguage = function() {
    return {
        ko: {
            template: {
                minicell_inputsensor: '%1 %2 번',
                minicell_ispressed: '%1 번 버튼 누르기?',
                minicell_buzzer_off: '%1 번 부저 끄기 %2',
                minicell_buzzer_note: '%1 번 부저 %2 음 내기 %3',
                minicell_buzzer_note_delay: '%1 번 부저 %2 음 %3 박자로 연주하기 %4',
                minicell_led_toggle: '%1 번 LED %2 %3',
                minicell_led_color: '%1 번 LED 색 %2 으로 정하기 %3',
                minicell_led_color_number: '%1 번 LED 색 %2 으로 정하기 %3',
                minicell_led: '%1 번 LED R %2 G %3 B %4 %5',
                minicell_led_pwm: '%1 번 LED R %2 G %3 B %4 %5',
                minicell_motor_stop: '모터 정지하기 %1',
                minicell_dc_motor: '%1 번 DC모터 %2 속력 %3 으로 움직이기 %4',
                minicell_dc_motor_for_secs: '%1 번 DC모터 %2 속력 %3 으로 %4 초간 움직이기 %5',
                minicell_rc_motor: '%1 번 RC모터 각도 %2 속력 %3 으로 움직이기 %4',
            },
            Blocks: {
                MINICELL_idx0: '1',
                MINICELL_idx1: '2',
                MINICELL_idx2: '3',
                MINICELL_idx3: '4',
                MINICELL_ir: '바닥센서',
                MINICELL_pot: '가변저항',
                MINICELL_button: '버튼',
                MINICELL_cds: '조도센서',
                MINICELL_led_on: '켜기',
                MINICELL_led_off: '끄기',
                MINICELL_buzzer_note_c: '도',
                MINICELL_buzzer_note_cs: '도#',
                MINICELL_buzzer_note_d: '레',
                MINICELL_buzzer_note_ds: '레#',
                MINICELL_buzzer_note_e: '미',
                MINICELL_buzzer_note_f: '파',
                MINICELL_buzzer_note_fs: '파#',
                MINICELL_buzzer_note_g: '솔',
                MINICELL_buzzer_note_gs: '솔#',
                MINICELL_buzzer_note_a: '라',
                MINICELL_buzzer_note_as: '라#',
                MINICELL_buzzer_note_b: '시',
                MINICELL_motor_cw: '시계방향',
                MINICELL_motor_ccw: '반시계방향',
            }

        },
        en: {
            template: {
                minicell_inputsensor: '%1 No. %2',
                minicell_ispressed: 'No. %1 Button is pressed?',
                minicell_buzzer_off: 'No. %1 Buzzer off %2',
                minicell_buzzer_note: 'No. %1 Buzzer play note %2 %3',
                minicell_buzzer_note_delay: 'No. %1 Buzzer play note %2 for %3 beats %4',
                minicell_led_toggle: 'No. %1 LED %2 %3',
                minicell_led_color: 'No. %1 LED set color to %2 %3',
                minicell_led_color_number: 'No. %1 LED set color to %2 %3',
                minicell_led: 'No. %1 LED R %2 G %3 B %4 %5',
                minicell_led: 'No. %1 LED R %2 G %3 B %4 %5',
                minicell_motor_stop: 'Motor stop %1',
                minicell_dc_motor: 'No. %1 DC motor move to direction %2 at speed %3 %4',
                minicell_dc_motor: 'No. %1 DC motor move to direction %2 at speed %3 for %4 secs %5',
                minicell_rc_motor: 'No. %1 RC motor move to angle %2 at speed %3 %4',
            },
            Blocks: {
                MINICELL_idx0: '1',
                MINICELL_idx1: '2',
                MINICELL_idx2: '3',
                MINICELL_idx3: '4',
                MINICELL_ir: 'IR',
                MINICELL_pot: 'Potentiometer',
                MINICELL_button: 'Button',
                MINICELL_cds: 'CDS',
                MINICELL_led_on: 'On',
                MINICELL_led_off: 'Off',
                MINICELL_buzzer_note_c: 'C',
                MINICELL_buzzer_note_cs: 'C#',
                MINICELL_buzzer_note_d: 'D',
                MINICELL_buzzer_note_ds: 'D#',
                MINICELL_buzzer_note_e: 'E',
                MINICELL_buzzer_note_f: 'F',
                MINICELL_buzzer_note_fs: 'F#',
                MINICELL_buzzer_note_g: 'G',
                MINICELL_buzzer_note_gs: 'G#',
                MINICELL_buzzer_note_a: 'A',
                MINICELL_buzzer_note_as: 'A#',
                MINICELL_buzzer_note_b: 'B',
                MINICELL_motor_cw: 'Clockwise',
                MINICELL_motor_ccw: 'Counter clockwise',
            }
        }
    }
};

module.exports = Entry.Minicell;
