'use strict';

Entry.Cobl = {
    id: '1.A',
    name: 'cobl',
    url: 'http://www.cobl.co.kr/',
    imageName: 'cobl.png',
    title: {
        ko: 'ì½”ë¸”',
        en: 'Cobl',
    },
    setZero: function() {
        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
    },
};
Entry.Cobl.blockMenuBlocks = [
    'cobl_read_ultrason',
    'cobl_read_potenmeter',
    'cobl_read_irread1',
    'cobl_read_irread2',
    'cobl_read_joyx',
    'cobl_read_joyy',
    //"cobl_read_sens1",
    //"cobl_read_sens2",
    'cobl_read_tilt',
    'cobl_read_temps',
    'cobl_read_light',
    'cobl_read_btn',
    'cobl_led_control',
    'cobl_rgb_boardled',
    'cobl_servo_angle_control',
    'cobl_melody',
    'cobl_dcmotor',
    'cobl_extention_port',
    'cobl_external_RainBowled',
    'cobl_external_led',
    'cobl_7_segment',
];
Entry.Cobl.getBlocks = function() {
    return {
        //region cobl ì½”ë¸”
        cobl_read_ultrason: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '1. ì´ˆìŒ?Œê±°ë¦?0~400)',
            def: {
                type: 'cobl_read_ultrason',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('ultrason');
            },
        },
        cobl_read_potenmeter: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '2.ê°€ë³€?€??0~1023)',
            def: {
                type: 'cobl_read_potenmeter',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('potenmeter');
            },
        },
        cobl_read_irread1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '3.?ì™¸? ì„¼??(0~1023)',
            def: {
                type: 'cobl_read_irread1',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('irread1');
            },
        },
        cobl_read_irread2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '4.?ì™¸? ì„¼??(0~1023)',
            def: {
                type: 'cobl_read_irread2',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('irread2');
            },
        },
        cobl_read_joyx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '5.ì¡°ì´?¤í‹±Xì¶?1, 0, -1)',
            def: {
                type: 'cobl_read_joyx',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('joyx');
            },
        },
        cobl_read_joyy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '6.ì¡°ì´?¤í‹±Yì¶?1, 0, -1)',
            def: {
                type: 'cobl_read_joyy',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('joyy');
            },
        },
        cobl_read_tilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '7.ê¸°ìš¸ê¸°ì„¼??0~4)',
            def: {
                type: 'cobl_read_tilt',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('tilt');
            },
        },
        cobl_read_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '8.?‰ìƒ?¼ì„œ',
            def: {
                type: 'cobl_read_color',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var colorval = Entry.hw.getAnalogPortValue('color');

                if (colorval == 1) return 'ë¹¨ê°•';
                else if (colorval == 2) return '?¹ìƒ‰';
                else if (colorval == 3) return '?Œëž‘';
                else return '?Œìˆ˜?†ìŒ';
            },
        },
        cobl_read_humid: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '9.?µë„?¼ì„œ',
            def: {
                type: 'cobl_read_humid',
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('humid');
            },
        },
        cobl_read_temps: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '10.?¨ë„?¼ì„œ@?¬íŠ¸%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['1'],
                type: 'cobl_read_temps',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                //    console.log("-----temptest------")
                var signal = script.getField('VALUE', script);
                if (signal == 1) {
                    //    console.log("-----temp1 selected ");
                    return Entry.hw.getAnalogPortValue('temps1');
                }

                if (signal == 2) {
                    //     console.log("-----temp2 selected ");
                    return Entry.hw.getAnalogPortValue('temps2');
                }
            },
        },
        cobl_read_light: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '11.ë¹›ì„¼???¬íŠ¸%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['1'],
                type: 'cobl_read_light',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var signal = script.getField('VALUE', script);
                if (signal == 1) {
                    return Entry.hw.getAnalogPortValue('light1');
                }

                if (signal == 2) {
                    return Entry.hw.getAnalogPortValue('light2');
                }
            },
        },
        cobl_read_btn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: '12.ë²„íŠ¼?¤ìœ„ì¹??¬íŠ¸%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['1'],
                type: 'cobl_read_btn',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var signal = script.getField('VALUE', script);
                if (signal == 1) {
                    return Entry.hw.getDigitalPortValue('btn1');
                }

                if (signal == 2) {
                    return Entry.hw.getDigitalPortValue('btn2');
                }
            },
        },
        cobl_led_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '13-1.ë¬´ì?ê°œLED%1%2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['OFF', 'OFF'],
                        ['ë¹¨ê°•', 'Red'],
                        ['ì£¼í™©', 'Orange'],
                        ['?¸ëž‘', 'Yellow'],
                        ['ì´ˆë¡', 'Green'],
                        ['?Œëž‘', 'Blue'],
                        ['?¨ìƒ‰', 'Dark Blue'],
                        ['ë³´ë¼', 'Purple'],
                        ['?°ìƒ‰', 'White'],
                    ],
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
            def: {
                params: ['1', 'OFF'],
                type: 'cobl_led_control',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var value = script.getStringField('OPERATOR');
                Entry.hw.setDigitalPortValue('RainBowLED_' + port, value);
                Entry.hw.update();
                delete Entry.hw.sendQueue['RainBowLED_' + port];
                return script.callReturn();
            },
        },
        cobl_rgb_boardled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '13-2.ë¬´ì?ê°œLED%1R%2G%3B%4 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
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
            def: {
                params: ['1', '1', '1', '1'],
                type: 'cobl_rgb_boardled',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var led = script.getNumberField('LED');
                var r = script.getStringField('RED');
                var g = script.getStringField('GREEN');
                var b = script.getStringField('BLUE');

                Entry.hw.setDigitalPortValue('BLED_IDX', led);
                Entry.hw.setDigitalPortValue('BLED_R', r);
                Entry.hw.setDigitalPortValue('BLED_G', g);
                Entry.hw.setDigitalPortValue('BLED_B', b);
                Entry.hw.update();

                delete Entry.hw.sendQueue['BLED_IDX'];
                delete Entry.hw.sendQueue['BLED_R'];
                delete Entry.hw.sendQueue['BLED_G'];
                delete Entry.hw.sendQueue['BLED_B'];

                return script.callReturn();
            },
        },
        cobl_servo_angle_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '14.ê°ë„ëª¨í„° ê°ë„%1(15~165) ',
            params: [
                {
                    type: 'Block',
                   accept: 'string',
            
                },
            ],
            def: {
                params: [
					{
                        type: 'number',
                        params: ['90'],
                    },
					],
                type: 'cobl_servo_angle_control',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
             
//console.log("%d", value);
                Entry.hw.setDigitalPortValue('Servo1', value);
                Entry.hw.update();
                delete Entry.hw.sendQueue['Servo1'];

                return script.callReturn();
            },
        },
        cobl_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '15.ë©œë¡œ??1 ?œê°„%2(ì´? %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['(???)??, 'L_So'],
                        ['(???)??', 'L_So#'],
                        ['(???)??, 'L_La'],
                        ['(???)??', 'L_La#'],
                        ['(???)??, 'L_Ti'],
                        ['??, 'Do'],
                        ['??', 'Do#'],
                        ['??, 'Re'],
                        ['??', 'Re#'],
                        ['ë¯?, 'Mi'],
                        ['??, 'Fa'],
                        ['??', 'Fa#'],
                        ['??, 'So'],
                        ['??', 'So#'],
                        ['??, 'La'],
                        ['??', 'La#'],
                        ['??, 'Ti'],
                        ['(?’ì?)??, 'H_Do'],
                        ['(?’ì?)??', 'H_Do#'],
                        ['(?’ì?)??, 'H_Re'],
                        ['(?’ì?)??', 'H_Re#'],
                        ['(?’ì?)ë¯?, 'H_Mi'],
                        ['(?’ì?)??, 'H_Fa'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 1,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: ['Do', '1'],
                type: 'cobl_melody',
            },
            paramsKeyMap: {
                MELODY: 0,
                DURATION: 1,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var melody = script.getStringField('MELODY');
                var duration = script.getNumberValue('DURATION');
//console.log("%d", duration);
                Entry.hw.setDigitalPortValue('Melody', melody);
                Entry.hw.setDigitalPortValue('Melody_DUR', duration);

                Entry.hw.update();
                delete Entry.hw.sendQueue['Melody'];
                delete Entry.hw.sendQueue['Melody_DUR'];

                return script.callReturn();
            },
        },
        cobl_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '16.?Œì „ëª¨í„°%1%2?ë„%3 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1.?œê³„ë°©í–¥', '1'], ['2.ë°˜ì‹œê³„ë°©??, '2'], ['3.?•ì?', '3']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5']],
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
            def: {
                params: ['1', '1', '1'],
                type: 'cobl_dcmotor',
            },
            paramsKeyMap: {
                MOTOR: 0,
                DIRECTION: 1,
                SPEED: 2,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var motor = script.getStringField('MOTOR');
                var direction = script.getStringField('DIRECTION');
                var speed = script.getStringField('SPEED');

                if (motor == 1) {
                    Entry.hw.setDigitalPortValue('DC1_DIR', direction);
                    Entry.hw.setDigitalPortValue('DC1_SPEED', speed);
                    Entry.hw.update();
                    delete Entry.hw.sendQueue['DC1_DIR'];
                    delete Entry.hw.sendQueue['DC1_SPEED'];
                }

                if (motor == 2) {
                    Entry.hw.setDigitalPortValue('DC2_DIR', direction);
                    Entry.hw.setDigitalPortValue('DC2_SPEED', speed);
                    Entry.hw.update();
                    delete Entry.hw.sendQueue['DC2_DIR'];
                    delete Entry.hw.sendQueue['DC2_SPEED'];
                }

                return script.callReturn();
            },
        },
        cobl_extention_port: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '17.USB?¬íŠ¸%1?¨ê³„%2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
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
            def: {
                params: ['1', '0'],
                type: 'cobl_extention_port',
            },
            paramsKeyMap: {
                PORT: 0,
                LEVEL: 1,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var level = script.getStringField('LEVEL');

                if (port == 1) {
                    Entry.hw.setDigitalPortValue('EXUSB1', level);
                    Entry.hw.update();
                    delete Entry.hw.sendQueue['EXUSB1'];
                }

                if (port == 2) {
                    Entry.hw.setDigitalPortValue('EXUSB2', level);
                    Entry.hw.update();
                    delete Entry.hw.sendQueue['EXUSB2'];
                }
                return script.callReturn();
            },
        },
        cobl_external_RainBowled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '18-1.?¸ë?LED%1 (1~64)%2 %3',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['OFF', 'OFF'],
                        ['ë¹¨ê°•', 'Red'],
                        ['ì£¼í™©', 'Orange'],
                        ['?¸ëž‘', 'Yellow'],
                        ['ì´ˆë¡', 'Green'],
                        ['?Œëž‘', 'Blue'],
                        ['?¨ìƒ‰', 'Dark Blue'],
                        ['ë³´ë¼', 'Purple'],
                        ['?°ìƒ‰', 'White'],
                    ],
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
            def: {
                params: ['1', 'OFF'],
                type: 'cobl_external_RainBowled',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var led = script.getNumberValue('PORT');
                var value = script.getStringField('OPERATOR');

                Entry.hw.setDigitalPortValue('ELED_IDX', led);

                if (value == 'OFF') {
                    Entry.hw.setDigitalPortValue('ELED_R', 0);
                    Entry.hw.setDigitalPortValue('ELED_G', 0);
                    Entry.hw.setDigitalPortValue('ELED_B', 0);
                } else if (value == 'Red') {
                    Entry.hw.setDigitalPortValue('ELED_R', 10);
                    Entry.hw.setDigitalPortValue('ELED_G', 0);
                    Entry.hw.setDigitalPortValue('ELED_B', 0);
                } else if (value == 'Orange') {
                    Entry.hw.setDigitalPortValue('ELED_R', 10);
                    Entry.hw.setDigitalPortValue('ELED_G', 3);
                    Entry.hw.setDigitalPortValue('ELED_B', 0);
                } else if (value == 'Yellow') {
                    Entry.hw.setDigitalPortValue('ELED_R', 10);
                    Entry.hw.setDigitalPortValue('ELED_G', 10);
                    Entry.hw.setDigitalPortValue('ELED_B', 0);
                } else if (value == 'Green') {
                    Entry.hw.setDigitalPortValue('ELED_R', 0);
                    Entry.hw.setDigitalPortValue('ELED_G', 10);
                    Entry.hw.setDigitalPortValue('ELED_B', 0);
                } else if (value == 'Blue') {
                    Entry.hw.setDigitalPortValue('ELED_R', 0);
                    Entry.hw.setDigitalPortValue('ELED_G', 0);
                    Entry.hw.setDigitalPortValue('ELED_B', 10);
                } else if (value == 'Dark Blue') {
                    Entry.hw.setDigitalPortValue('ELED_R', 0);
                    Entry.hw.setDigitalPortValue('ELED_G', 7);
                    Entry.hw.setDigitalPortValue('ELED_B', 10);
                } else if (value == 'Purple') {
                    Entry.hw.setDigitalPortValue('ELED_R', 10);
                    Entry.hw.setDigitalPortValue('ELED_G', 0);
                    Entry.hw.setDigitalPortValue('ELED_B', 10);
                } else if (value == 'White') {
                    Entry.hw.setDigitalPortValue('ELED_R', 10);
                    Entry.hw.setDigitalPortValue('ELED_G', 10);
                    Entry.hw.setDigitalPortValue('ELED_B', 10);
                }
                Entry.hw.update();

                delete Entry.hw.sendQueue['ELED_IDX'];
                delete Entry.hw.sendQueue['ELED_R'];
                delete Entry.hw.sendQueue['ELED_G'];
                delete Entry.hw.sendQueue['ELED_B'];
            },
        },
        cobl_external_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '18-2.?¸ë?LED%1(1~64)R%2G%3B%4 %5',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
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
            def: {
                params: ['1', '1', '1', '1'],
                type: 'cobl_external_led',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var led = script.getNumberValue('LED');
                var r = script.getStringField('RED');
                var g = script.getStringField('GREEN');
                var b = script.getStringField('BLUE');

                Entry.hw.setDigitalPortValue('ELED_IDX', led);
                Entry.hw.setDigitalPortValue('ELED_R', r);
                Entry.hw.setDigitalPortValue('ELED_G', g);
                Entry.hw.setDigitalPortValue('ELED_B', b);
                Entry.hw.update();

                delete Entry.hw.sendQueue['ELED_IDX'];
                delete Entry.hw.sendQueue['ELED_R'];
                delete Entry.hw.sendQueue['ELED_G'];
                delete Entry.hw.sendQueue['ELED_B'];

                return script.callReturn();
            },
        },
        cobl_7_segment: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '19.?«ìž?„ê´‘??1(0~9999) %2',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                   
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: ['0'],
                type: 'cobl_7_segment',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cobl',
            isNotFor: ['cobl'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var value_s = value.toString();
                var value_c = value_s.substring(0, 4);
                Entry.hw.setDigitalPortValue('7SEG', value_c);
                Entry.hw.update();
                delete Entry.hw.sendQueue['7SEG'];
                return script.callReturn();
            },
        },
        //endregion cobl ì½”ë¸”
    };
};

module.exports = Entry.Cobl;
