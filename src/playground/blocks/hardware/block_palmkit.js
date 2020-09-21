'use strict';

Entry.PalmKit = {
    id: 'E.1',
    name: 'palmkit',
    url: 'http://http://www.needsrobot.com/',
    imageName: 'palmkit.png',
    title: {
        'ko': '팜킷',
        'en': 'PALM KIT',
    },
    setZero: function() {
        var mcell = Entry.PalmKit.KEY;
        var sq = Entry.hw.sendQueue;
        for(var key in mcell)
            delete sq[Entry.PalmKit.KEY[key]];
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
        imgPath: 'hw/palmkit.png',
        width: 700,
        height: 524,
        listPorts:{
        },
        ports:{
            CDS0: {
                name: '조도센서',
                type: 'input',
                pos: {x: 200, y: 290},
            },
            POT0: {
                name: '가변저항',
                type: 'input',
                pos: {x: 500, y: 350},
            },
            TACT_SWITCH0: {
                name: '버튼',
                type: 'input',
                pos: {x: 300, y: 260},
            },
        },
        mode:'both',
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

        var r = Math.max(0, Entry.PalmKit.hueToRGB(p, q, h + (1/3)));
        var g = Math.max(0, Entry.PalmKit.hueToRGB(p, q, h));
        var b = Math.max(0, Entry.PalmKit.hueToRGB(p, q, h - (1/3)));


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

Entry.PalmKit.blockMenuBlocks = [
    'palmkit_inputsensor',
    'palmkit_ispressed',

    'palmkit_buzzer_off',
    'palmkit_buzzer_note',
    'palmkit_buzzer_note_delay',

    'palmkit_led_toggle',
    'palmkit_led_color',
    'palmkit_led_color_number',
    'palmkit_led',
    'palmkit_led_pwm',

    'palmkit_motor_stop',
    'palmkit_dc_motor',
    'palmkit_dc_motor_for_secs',
    'palmkit_rc_motor',
//    'palmkit_rc_motor_for_secs',
];

Entry.PalmKit.getBlocks = function() {
    return {
        palmkit_inputsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_pot, 'POT'],
                        [Lang.Blocks.PALMKIT_button, 'TACT_SWITCH'],
                        [Lang.Blocks.PALMKIT_cds, 'CDS'],
                    ],
                    value: 'CDS',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '0'],
                        [Lang.Blocks.PALMKIT_idx1, '1'],
                        [Lang.Blocks.PALMKIT_idx2, '2'],
                        [Lang.Blocks.PALMKIT_idx3, '3'],
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
                type: 'palmkit_inputsensor'
            },
            paramsKeyMap: {
                'TYPE': 0,
                'INDEX': 1
            },
            class: 'palmkit_input',
            isNotFor: ['palmkit'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData[script.getField('TYPE', script)+script.getField('INDEX', script)];
                return pd;
            },
            syntax: { js: [], py: ['PalmKit.inputsensor(%1, %2)']},
        },
        palmkit_ispressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '0'],
                        [Lang.Blocks.PALMKIT_idx1, '1'],
                        [Lang.Blocks.PALMKIT_idx2, '2'],
                        [Lang.Blocks.PALMKIT_idx3, '3'],
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
                type: 'palmkit_ispressed'
            },
            paramsKeyMap: {
                'INDEX': 0
            },
            class: 'palmkit_input',
            isNotFor: ['palmkit'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData['TACT_SWITCH' + script.getField('INDEX', script)];
                if(pd == 1) return true;
                else return false;
            },
            syntax: { js: [], py: ['PalmKit.ispressed(%1)']},
        },
        palmkit_buzzer_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
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
                params: [null],
                type: 'palmkit_buzzer_off'
            },
            paramsKeyMap: {
                'INDEX': 0,
            },
            class: 'palmkit_buzzer',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.buzzer_off(%1, %2)']}
        },
        palmkit_buzzer_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_buzzer_note_c, '48'],
                        [Lang.Blocks.PALMKIT_buzzer_note_cs, '49'],
                        [Lang.Blocks.PALMKIT_buzzer_note_d, '50'],
                        [Lang.Blocks.PALMKIT_buzzer_note_ds, '51'],
                        [Lang.Blocks.PALMKIT_buzzer_note_e, '52'],
                        [Lang.Blocks.PALMKIT_buzzer_note_f, '53'],
                        [Lang.Blocks.PALMKIT_buzzer_note_fs, '54'],
                        [Lang.Blocks.PALMKIT_buzzer_note_g, '55'],
                        [Lang.Blocks.PALMKIT_buzzer_note_gs, '56'],
                        [Lang.Blocks.PALMKIT_buzzer_note_a, '57'],
                        [Lang.Blocks.PALMKIT_buzzer_note_as, '58'],
                        [Lang.Blocks.PALMKIT_buzzer_note_b, '59'],
                    ],
                    value:'48',
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
                type: 'palmkit_buzzer_note'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'NOTE': 1,
            },
            class: 'palmkit_buzzer',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.buzzer_note(%1, %2, %3)']}
        },
        palmkit_buzzer_note_delay: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_buzzer_note_c, '48'],
                        [Lang.Blocks.PALMKIT_buzzer_note_cs, '49'],
                        [Lang.Blocks.PALMKIT_buzzer_note_d, '50'],
                        [Lang.Blocks.PALMKIT_buzzer_note_ds, '51'],
                        [Lang.Blocks.PALMKIT_buzzer_note_e, '52'],
                        [Lang.Blocks.PALMKIT_buzzer_note_f, '53'],
                        [Lang.Blocks.PALMKIT_buzzer_note_fs, '54'],
                        [Lang.Blocks.PALMKIT_buzzer_note_g, '55'],
                        [Lang.Blocks.PALMKIT_buzzer_note_gs, '56'],
                        [Lang.Blocks.PALMKIT_buzzer_note_a, '57'],
                        [Lang.Blocks.PALMKIT_buzzer_note_as, '58'],
                        [Lang.Blocks.PALMKIT_buzzer_note_b, '59'],
                    ],
                    value:'48',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_buzzer_note_delay'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'NOTE': 1,
                'SEC': 2,
            },
            class: 'palmkit_buzzer',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.buzzer_note_delay(%1, %2, %3, %4)']}
        },
        palmkit_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_led_on, '255'],
                        [Lang.Blocks.PALMKIT_led_off, '0'],
                    ],
                    value:'255',
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
                type: 'palmkit_led_toggle'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1,
            },
            class: 'palmkit_led',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.led_toggle(%1, %2, %3)']}
        },
        palmkit_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_led_color'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1
            },
            class: 'palmkit_led',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.led_color(%1, %2, %3)']}
        },
        palmkit_led_color_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_led_color_number'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'VALUE': 1
            },
            class: 'palmkit_led',
            isNotFor: ['palmkit'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                var idx = script.getField('INDEX', script);
                var value = script.getNumberValue('VALUE', script);
                var rgb = Entry.PalmKit.toRGB(value);

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
            syntax: { js: [], py: ['PalmKit.led_color_number(%1, %2, %3)']}
        },
        palmkit_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_led_on, '255'],
                        [Lang.Blocks.PALMKIT_led_off, '0'],
                    ],
                    value:'255',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_led_on, '255'],
                        [Lang.Blocks.PALMKIT_led_off, '0'],
                    ],
                    value:'255',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_led_on, '255'],
                        [Lang.Blocks.PALMKIT_led_off, '0'],
                    ],
                    value:'255',
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
                type: 'palmkit_led'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'R': 1,
                'G': 2,
                'B': 3,
            },
            class: 'palmkit_led',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.led(%1, %2, %3, %4, %5)']}
        },
        palmkit_led_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_led_pwm'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'R': 1,
                'G': 2,
                'B': 3,
            },
            class: 'palmkit_led',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.led_pwm(%1, %2, %3, %4, %5)']}
        },
        palmkit_motor_stop: {
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
                type: 'palmkit_motor_stop'
            },
            paramsKeyMap: {},
            class: 'palmkit_motor',
            isNotFor: ['palmkit'],
            func: function (sprite, script) {
                var buf = {};
                var sq = Entry.hw.sendQueue;

                if(sq.dc_motor) delete sq.dc_motor;
                if(sq.servo_motor) delete sq.servo_motor;

                sq.stop = buf;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: ['PalmKit.motor_stop(%1)']}
        },
        palmkit_rc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_rc_motor'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'ANGLE': 1,
                 'SPEED': 2,
            },
            class: 'palmkit_motor',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.rc_motor(%1, %2, %3, %4)']}
        },
        palmkit_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_motor_cw, '0'],
                        [Lang.Blocks.PALMKIT_motor_ccw, '1'],
                    ],
                    value:'0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_dc_motor'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'DIR': 1,
                 'SPEED': 2,
            },
            class: 'palmkit_motor',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.dc_motor(%1, %2, %3, %4)']}
        },
        palmkit_dc_motor_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_idx0, '1'],
                        [Lang.Blocks.PALMKIT_idx1, '2'],
                        [Lang.Blocks.PALMKIT_idx2, '3'],
                        [Lang.Blocks.PALMKIT_idx3, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.PALMKIT_motor_cw, '0'],
                        [Lang.Blocks.PALMKIT_motor_ccw, '1'],
                    ],
                    value:'0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                type: 'palmkit_dc_motor_for_secs'
            },
            paramsKeyMap: {
                 'INDEX': 0,
                 'DIR': 1,
                 'SPEED': 2,
                 'SECS' : 3,
            },
            class: 'palmkit_motor',
            isNotFor: ['palmkit'],
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
            syntax: { js: [], py: ['PalmKit.dc_motor_for_secs(%1, %2, %3, %4, %5)']}
        },
    };
};

Entry.PalmKit.setLanguage = function() {
    return {
        ko: {
            template: {
                palmkit_inputsensor: '%1 %2 번',
                palmkit_ispressed: '%1 번 버튼 누르기?',
                palmkit_buzzer_off: '%1 번 부저 끄기 %2',
                palmkit_buzzer_note: '%1 번 부저 %2 음 내기 %3',
                palmkit_buzzer_note_delay: '%1 번 부저 %2 음 %3 박자로 연주하기 %4',
                palmkit_led_toggle: '%1 번 LED %2 %3',
                palmkit_led_color: '%1 번 LED 색 %2 으로 정하기 %3',
                palmkit_led_color_number: '%1 번 LED 색 %2 으로 정하기 %3',
                palmkit_led: '%1 번 LED R %2 G %3 B %4 %5',
                palmkit_led_pwm: '%1 번 LED R %2 G %3 B %4 %5',
                palmkit_motor_stop: '모터 정지하기 %1',
                palmkit_dc_motor: '%1 번 DC모터 %2 속력 %3 으로 움직이기 %4',
                palmkit_dc_motor_for_secs: '%1 번 DC모터 %2 속력 %3 으로 %4 초간 움직이기 %5',
                palmkit_rc_motor: '%1 번 RC모터 각도 %2 속력 %3 으로 움직이기 %4',
            },
            Blocks: {
                PALMKIT_idx0: '1',
                PALMKIT_idx1: '2',
                PALMKIT_idx2: '3',
                PALMKIT_idx3: '4',
                PALMKIT_ir: '바닥센서',
                PALMKIT_pot: '가변저항',
                PALMKIT_button: '버튼',
                PALMKIT_cds: '조도센서',
                PALMKIT_led_on: '켜기',
                PALMKIT_led_off: '끄기',
                PALMKIT_buzzer_note_c: '도',
                PALMKIT_buzzer_note_cs: '도#',
                PALMKIT_buzzer_note_d: '레',
                PALMKIT_buzzer_note_ds: '레#',
                PALMKIT_buzzer_note_e: '미',
                PALMKIT_buzzer_note_f: '파',
                PALMKIT_buzzer_note_fs: '파#',
                PALMKIT_buzzer_note_g: '솔',
                PALMKIT_buzzer_note_gs: '솔#',
                PALMKIT_buzzer_note_a: '라',
                PALMKIT_buzzer_note_as: '라#',
                PALMKIT_buzzer_note_b: '시',
                PALMKIT_motor_cw: '시계방향',
                PALMKIT_motor_ccw: '반시계방향',
            }

        },
        en: {
            template: {
                palmkit_inputsensor: '%1 No. %2',
                palmkit_ispressed: 'No. %1 Button is pressed?',
                palmkit_buzzer_off: 'No. %1 Buzzer off %2',
                palmkit_buzzer_note: 'No. %1 Buzzer play note %2 %3',
                palmkit_buzzer_note_delay: 'No. %1 Buzzer play note %2 for %3 beats %4',
                palmkit_led_toggle: 'No. %1 LED %2 %3',
                palmkit_led_color: 'No. %1 LED set color to %2 %3',
                palmkit_led_color_number: 'No. %1 LED set color to %2 %3',
                palmkit_led: 'No. %1 LED R %2 G %3 B %4 %5',
                palmkit_led: 'No. %1 LED R %2 G %3 B %4 %5',
                palmkit_motor_stop: 'Motor stop %1',
                palmkit_dc_motor: 'No. %1 DC motor move to direction %2 at speed %3 %4',
                palmkit_dc_motor: 'No. %1 DC motor move to direction %2 at speed %3 for %4 secs %5',
                palmkit_rc_motor: 'No. %1 RC motor move to angle %2 at speed %3 %4',
            },
            Blocks: {
                PALMKIT_idx0: '1',
                PALMKIT_idx1: '2',
                PALMKIT_idx2: '3',
                PALMKIT_idx3: '4',
                PALMKIT_ir: 'IR',
                PALMKIT_pot: 'Potentiometer',
                PALMKIT_button: 'Button',
                PALMKIT_cds: 'CDS',
                PALMKIT_led_on: 'On',
                PALMKIT_led_off: 'Off',
                PALMKIT_buzzer_note_c: 'C',
                PALMKIT_buzzer_note_cs: 'C#',
                PALMKIT_buzzer_note_d: 'D',
                PALMKIT_buzzer_note_ds: 'D#',
                PALMKIT_buzzer_note_e: 'E',
                PALMKIT_buzzer_note_f: 'F',
                PALMKIT_buzzer_note_fs: 'F#',
                PALMKIT_buzzer_note_g: 'G',
                PALMKIT_buzzer_note_gs: 'G#',
                PALMKIT_buzzer_note_a: 'A',
                PALMKIT_buzzer_note_as: 'A#',
                PALMKIT_buzzer_note_b: 'B',
                PALMKIT_motor_cw: 'Clockwise',
                PALMKIT_motor_ccw: 'Counter clockwise',
            }
        }
    }
};

module.exports = Entry.PalmKit;
