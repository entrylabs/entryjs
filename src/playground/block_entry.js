'use strict';
require('./blocks');

if (typeof global.Entry !== 'object') global.Entry = {};

if (typeof exports == 'object') {
    /* IGNORE_WEBPACK:START */
    var Lang = require('../../extern/lang/ko.js').Lang;
    /* IGNORE_WEBPACK:END */
    if (typeof EntryStatic !== 'object') {
        global.EntryStatic = {};
    }
}
if (!Entry.block) {
    Entry.block = {};
}

if (!Entry.block.converters) {
    Entry.block.converters = {};
}

if (Entry && Entry.block) {
    (function(c) {
        c.keyboardCode = function(key, value) {
            var code;

            if (key) code = key.toUpperCase();

            var map = {
                32: 'space',
                13: 'enter',
                38: 'up',
                37: 'left',
                39: 'right',
                40: 'down',
            };

            code = map[value] || code || value;
            if (!Entry.Utils.isNumber(code)) {
                return '"()"'.replace('()', code);
            } else return '"()"'.replace('"()"', code);
        };

        c.returnStringKey = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';
            key = String(key);
            if (value === 'mouse') key = 'mouse';

            var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                value,
                this.menuName
            );
            if (name) key = name;
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) key = codeMapValue;
            }

            key = key.replace(/\"/gi, '');
            return '"()"'.replace('()', key);
        };

        c.returnRawStringKey = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';
            key = String(key);
            if (value === 'mouse') key = value;
            var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(
                value,
                this.menuName
            );
            if (name) key = name;
            key = key.replace(/\"/gi, '');
            return '"()"'.replace('"()"', key);
        };

        c.returnStringValue = function(key, value) {
            if ((!value && typeof value !== 'number') || value === 'null')
                return 'None';

            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value);
        };

        c.returnOperator = function(key, value) {
            var map = {
                EQUAL: '==',
                GREATER: '>',
                LESS: '<',
                GREATER_OR_EQUAL: '>=',
                LESS_OR_EQUAL: '<=',
                PLUS: '+',
                MINUS: '-',
                MULTI: '*',
                DIVIDE: '/',
                '==': 'EQUAL',
                '>': 'GREATER',
                '<': 'LESS',
                '>=': 'GREATER_OR_EQUAL',
                '<=': 'LESS_OR_EQUAL',
                '+': 'PLUS',
                '-': 'MINUS',
                '*': 'MULTI',
                '/': 'DIVIDE',
                AND: 'and',
                OR: 'or',
            };
            return map[value];
        };

        c.returnRawNumberValueByKey = function(key, value) {
            //return String(key).replace(/\D/, '');
            return key;
        };

        c.returnStringOrNumberByValue = function(key, value) {
            if (!Entry.Utils.isNumber(value)) {
                value = value.replace(/\"/gi, '');
                return '"()"'.replace('()', value);
            } else return value;
        };

        c.returnObjectOrStringValue = function(key, value) {
            if (Entry.container && Entry.container.getObject(value)) {
                var objectName = Entry.container.getObject(value).name;
                return '"()"'.replace('()', objectName);
            } else {
                if (this.codeMap) var codeMap = eval(this.codeMap);
                var codeMapKey = value;
                if (codeMap) {
                    var codeMapValue = codeMap[codeMapKey];
                    if (codeMapValue) value = codeMapValue;
                }
                value = value.replace(/\"/gi, '');
                return '"()"'.replace('()', value);
            }
        };

        c.returnStringValueUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value).toUpperCase();
        };

        c.returnValueUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return value.toUpperCase();
        };

        c.returnStringValueLowerCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            return '"()"'.replace('()', value).toLowerCase();
        };

        c.returnValuePartialUpperCase = function(key, value) {
            if (this.codeMap) var codeMap = eval(this.codeMap);
            var codeMapKey = value;
            if (codeMap) {
                var codeMapValue = codeMap[codeMapKey];
                if (codeMapValue) value = codeMapValue;
            }
            var dot = value.indexOf('.') + 1;
            if (dot > 1) {
                return (
                    value.charAt(0).toUpperCase() +
                    value.substring(1, dot) +
                    value.substring(dot).toUpperCase()
                );
            } else {
                return value.toUpperCase();
            }
        };
    })(Entry.block.converters);
}

const block = {
    //region hardware 하드웨어 기본
    arduino_download_connector: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: !Entry.isOffline
                    ? Lang.Blocks.ARDUINO_download_connector
                    : Lang.Blocks.ARDUINO_open_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadConnector();
                },
            ],
        },
    },
    download_guide: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.download_guide,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadGuide();
                },
            ],
        },
    },
    arduino_download_source: {
        skeleton: 'basic_button',
        isNotFor: ['arduinoDisconnected'],
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_download_source,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.downloadSource();
                },
            ],
        },
    },
    arduino_connected: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnected'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_connected,
                color: '#333',
                align: 'center',
            },
        ],
        events: {},
    },
    arduino_connect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnect'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_connect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {},
    },
    arduino_reconnect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_reconnect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.retryConnect();
                },
            ],
        },
    },
    robot_reconnect: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ROBOT_reconnect,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.retryConnect();
                },
            ],
        },
    },
    arduino_open: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoDisconnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_open_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.openHardwareProgram();
                },
            ],
        },
    },
    arduino_cloud_pc_open: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['arduinoConnect', 'arduinoConnected'],
        template: '%1',
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.ARDUINO_cloud_pc_connector,
                color: '#333',
                align: 'center',
            },
        ],
        events: {
            mousedown: [
                function() {
                    Entry.hw.openHardwareProgram();
                },
            ],
        },
    },
    //endregion hardware 하드웨어 기본
    //region basic 기본블록
    start_drawing: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'start_drawing',
        },
        class: 'brush_control',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            Entry.setBasicBrush(sprite);

            sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.start_drawing()'] },
    },
    stop_drawing: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'stop_drawing',
        },
        class: 'brush_control',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            if (sprite.brush && sprite.shapes.length) sprite.brush.stop = true;

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.stop_drawing()'] },
    },
    set_color: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Color',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'set_color',
        },
        pyHelpDef: {
            params: ['A&value'],
            type: 'set_color',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_color',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var colour = script.getField('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                var rgb = Entry.hex2rgb(colour);
                sprite.brush.rgb = rgb;
                sprite.brush.endStroke();
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );

                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.set_brush_color_to(%1)',
                    textParams: [
                        {
                            type: 'Color',
                            converter:
                                Entry.block.converters
                                    .returnStringValueUpperCase,
                            codeMap: 'Entry.CodeMap.Entry.set_color[0]',
                        },
                    ],
                },
            ],
        },
    },
    set_random_color: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'set_random_color',
        },
        class: 'brush_color',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                var rgb = Entry.generateRgb();
                sprite.brush.rgb = rgb;
                sprite.brush.endStroke();
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );

                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_brush_color_to_random()'] },
    },
    change_thickness: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'change_thickness',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'change_thickness',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_thickness',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var thickness = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.thickness += thickness;
                if (sprite.brush.thickness < 1) sprite.brush.thickness = 1;

                sprite.brush.setStrokeStyle(sprite.brush.thickness);

                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_brush_size(%1)'] },
    },
    set_thickness: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'set_thickness',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'set_thickness',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_thickness',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var thickness = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.thickness = thickness;
                sprite.brush.setStrokeStyle(sprite.brush.thickness);

                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_brush_size(%1)'] },
    },
    change_opacity: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_opacity',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }
            opacity = Entry.adjustValueWithMaxMin(
                sprite.brush.opacity + opacity,
                0,
                100
            );

            if (sprite.brush) {
                sprite.brush.opacity = opacity;
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_opacity: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
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
            type: 'set_opacity',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.opacity = Entry.adjustValueWithMaxMin(
                    opacity,
                    0,
                    100
                );
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    brush_erase_all: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'brush_erase_all',
        },
        class: 'brush_clear',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            sprite.eraseBrush && sprite.eraseBrush();

            sprite.removeStamps();

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.clear_drawing()'] },
    },
    brush_stamp: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'brush_stamp',
        },
        class: 'stamp',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            sprite.addStamp();

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.stamp()'] },
    },
    change_brush_transparency: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_brush_transparency',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'change_brush_transparency',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }
            opacity = Entry.adjustValueWithMaxMin(
                sprite.brush.opacity - opacity,
                0,
                100
            );

            if (sprite.brush) {
                sprite.brush.opacity = opacity;
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        sprite.brush.opacity / 100 +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_brush_transparency(%1)'] },
    },
    set_brush_tranparency: {
        color: '#FF9E20',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/brush_03.png',
                size: 12,
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
            type: 'set_brush_tranparency',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'set_brush_tranparency',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'brush_opacity',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var opacity = script.getNumberValue('VALUE', script);

            if (!sprite.brush || !sprite.shapes.length) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.opacity = Entry.adjustValueWithMaxMin(
                    opacity,
                    0,
                    100
                );
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke(
                    'rgba(' +
                        rgb.r +
                        ',' +
                        rgb.g +
                        ',' +
                        rgb.b +
                        ',' +
                        (1 - sprite.brush.opacity / 100) +
                        ')'
                );
                sprite.brush.moveTo(sprite.getX(), sprite.getY() * -1);
            }

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_brush_transparency(%1)'] },
    },
    number: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 10,
            },
        ],
        events: {},
        def: {
            params: [],
        },
        paramsKeyMap: {
            NUM: 0,
        },
        func: function(sprite, script) {
            return script.getField('NUM', script);
        },
        isPrimitive: true,
        syntax: {
            js: ['Scope', '%1'],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'number',
                    textParams: [
                        {
                            type: 'TextInput',
                            converter:
                                Entry.block.converters
                                    .returnStringOrNumberByValue,
                        },
                    ],
                },
            ],
        },
    },
    angle: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Angle',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'angle',
        },
        paramsKeyMap: {
            ANGLE: 0,
        },
        func: function(sprite, script) {
            return script.getNumberField('ANGLE');
        },
        isPrimitive: true,
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'angle',
                    textParams: [
                        {
                            type: 'Angle',
                            converter:
                                Entry.block.converters
                                    .returnRawNumberValueByKey,
                        },
                    ],
                },
            ],
        },
    },
    get_x_coordinate: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_x_coordinate,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_x_coordinate',
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            return sprite.getX();
        },
        syntax: { js: [], py: [''] },
    },
    get_y_coordinate: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_y_coordinate,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_y_coordinate',
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            return sprite.getY();
        },
        syntax: { js: [], py: [''] },
    },
    get_angle: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_angle,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return parseFloat(sprite.getRotation().toFixed(1));
        },
        syntax: { js: [], py: [''] },
    },
    get_rotation_direction: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_rotation_value, 'ROTATION'],
                    [Lang.Blocks.CALC_direction_value, 'DIRECTION'],
                ],
                value: 'ROTATION',
                fontSize: 11,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_rotation_direction',
        },
        paramsKeyMap: {
            OPERATOR: 0,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var o = script.getField('OPERATOR', script);
            if (o.toUpperCase() == 'DIRECTION')
                return parseFloat(sprite.getDirection().toFixed(1));
            else return parseFloat(sprite.getRotation().toFixed(1));
        },
        syntax: { js: [], py: [''] },
    },
    distance_something: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_distance_something_1,
                color: '#3D3D3D',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'spritesWithMouse',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_distance_something_2,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'distance_something',
        },
        pyHelpDef: {
            params: [null, 'A&value', null],
            type: 'distance_something',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'calc_distance',
        isNotFor: [],
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            if (targetId == 'mouse') {
                var mousePos = Entry.stage.mouseCoordinate;
                return Math.sqrt(
                    Math.pow(sprite.getX() - mousePos.x, 2) +
                        Math.pow(sprite.getY() - mousePos.y, 2)
                );
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                return Math.sqrt(
                    Math.pow(sprite.getX() - targetEntity.getX(), 2) +
                        Math.pow(sprite.getY() - targetEntity.getY(), 2)
                );
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_distance_to(%2)',
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'spritesWithMouse',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap:
                                'Entry.CodeMap.Entry.distance_something[1]',
                        },
                    ],
                },
            ],
        },
    },
    coordinate_mouse: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_coordinate_mouse_1,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [['x', 'x'], ['y', 'y']],
                value: 'x',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_coordinate_mouse_2,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'coordinate_mouse',
        },
        pyHelpDef: {
            params: [null, 'A&value', null],
            type: 'coordinate_mouse',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var targetCoordinate = script.getField('VALUE', script);
            if (targetCoordinate === 'x') {
                return Number(Entry.stage.mouseCoordinate.x);
            } else {
                return Number(Entry.stage.mouseCoordinate.y);
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_mouse_pointer(%2)',
                    blockType: 'param',
                    textParams: [
                        {
                            type: 'Text',
                            text: Lang.Blocks.CALC_coordinate_mouse_1,
                            color: '#3D3D3D',
                        },
                        {
                            type: 'Dropdown',
                            options: [['x', 'x'], ['y', 'y']],
                            value: 'x',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap: 'Entry.CodeMap.Entry.coordinate_mouse[1]',
                        },
                        {
                            type: 'Text',
                            text: Lang.Blocks.CALC_coordinate_mouse_2,
                            color: '#3D3D3D',
                        },
                    ],
                },
            ],
        },
    },
    coordinate_object: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_coordinate_object_1,
                color: '#3D3D3D',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'spritesWithSelf',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_coordinate_object_2,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_coordinate_x_value, 'x'],
                    [Lang.Blocks.CALC_coordinate_y_value, 'y'],
                    [Lang.Blocks.CALC_coordinate_rotation_value, 'rotation'],
                    [Lang.Blocks.CALC_coordinate_direction_value, 'direction'],
                    [Lang.Blocks.CALC_coordinate_size_value, 'size'],
                    [Lang.Blocks.CALC_picture_index, 'picture_index'],
                    [Lang.Blocks.CALC_picture_name, 'picture_name'],
                ],
                value: 'x',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
        ],
        events: {},
        def: {
            params: [null, null, null, null],
            type: 'coordinate_object',
        },
        pyHelpDef: {
            params: [null, 'A&value', null, 'B&value'],
            type: 'coordinate_object',
        },
        paramsKeyMap: {
            VALUE: 1,
            COORDINATE: 3,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            var targetEntity;
            if (targetId == 'self') targetEntity = sprite;
            else targetEntity = Entry.container.getEntity(targetId);

            var targetCoordinate = script.getField('COORDINATE', script);
            switch (targetCoordinate) {
                case 'x':
                    return targetEntity.getX();
                case 'y':
                    return targetEntity.getY();
                case 'rotation':
                    return targetEntity.getRotation();
                case 'direction':
                    return targetEntity.getDirection();
                case 'picture_index':
                    var object = targetEntity.parent;
                    var pictures = object.pictures;
                    return pictures.indexOf(targetEntity.picture) + 1;
                case 'size':
                    return Number(targetEntity.getSize().toFixed(1));
                case 'picture_name':
                    var object = targetEntity.parent;
                    var pictures = object.pictures;
                    var picture =
                        pictures[pictures.indexOf(targetEntity.picture)];
                    return picture.name;
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_object(%2, %4)',
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'spritesWithSelf',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter:
                                Entry.block.converters
                                    .returnObjectOrStringValue,
                            codeMap: 'Entry.CodeMap.Entry.coordinate_object[1]',
                        },
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.CALC_coordinate_x_value, 'x'],
                                [Lang.Blocks.CALC_coordinate_y_value, 'y'],
                                [
                                    Lang.Blocks.CALC_coordinate_rotation_value,
                                    'rotation',
                                ],
                                [
                                    Lang.Blocks.CALC_coordinate_direction_value,
                                    'direction',
                                ],
                                [
                                    Lang.Blocks.CALC_coordinate_size_value,
                                    'size',
                                ],
                                [
                                    Lang.Blocks.CALC_picture_index,
                                    'picture_index',
                                ],
                                [Lang.Blocks.CALC_picture_name, 'picture_name'],
                            ],
                            value: 'x',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap: 'Entry.CodeMap.Entry.coordinate_object[3]',
                        },
                    ],
                },
            ],
        },
    },
    calc_basic: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [
                    ['+', 'PLUS'],
                    ['-', 'MINUS'],
                    ['x', 'MULTI'],
                    ['/', 'DIVIDE'],
                ],
                value: 'PLUS',
                fontSize: 11,
                noArrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                'PLUS',
                {
                    type: 'number',
                    params: ['10'],
                },
            ],
            type: 'calc_basic',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                'PLUS',
                {
                    type: 'number',
                    params: ['B&value'],
                },
            ],
            type: 'calc_basic',
        },
        defs: [
            {
                params: [
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    'PLUS',
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'calc_basic',
            },
            {
                params: [
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    'MINUS',
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'calc_basic',
            },
            {
                params: [
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    'MULTI',
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'calc_basic',
            },
            {
                params: [
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    'DIVIDE',
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'calc_basic',
            },
        ],
        paramsKeyMap: {
            LEFTHAND: 0,
            OPERATOR: 1,
            RIGHTHAND: 2,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var operator = script.getField('OPERATOR', script);
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            if (operator == 'PLUS') {
                var leftStringValue = script.getValue('LEFTHAND', script);
                var rightStringValue = script.getValue('RIGHTHAND', script);
                if (!Entry.Utils.isNumber(leftStringValue))
                    leftValue = leftStringValue;
                if (!Entry.Utils.isNumber(rightStringValue))
                    rightValue = rightStringValue;
                if (
                    typeof leftValue === 'number' &&
                    typeof rightValue === 'number'
                )
                    return new BigNumber(leftValue).plus(rightValue).toNumber();
                else return leftValue + rightValue;
            }
            leftValue = new BigNumber(leftValue);
            if (operator == 'MINUS')
                return leftValue.minus(rightValue).toNumber();
            else if (operator == 'MULTI')
                return leftValue.times(rightValue).toNumber();
            else return leftValue.dividedBy(rightValue).toNumber();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%1 %2 %3)',
                    template: '%1 %2 %3',
                    keyOption: 'calc_basic',
                    blockType: 'param',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['+', 'PLUS'],
                                ['-', 'MINUS'],
                                ['x', 'MULTI'],
                                ['/', 'DIVIDE'],
                            ],
                            value: 'PLUS',
                            fontSize: 11,
                            noArrow: true,
                            converter: Entry.block.converters.returnOperator,
                            paramType: 'operator',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    calc_plus: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '+',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue + rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_minus: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '-',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue - rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_times: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: 'x',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue * rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_divide: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue / rightValue;
        },
        syntax: { js: [], py: [''] },
    },
    calc_mod: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_mod_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'calc_mod',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return leftValue % rightValue;
        },
        syntax: { js: [], py: ['Entry.get_remainder(%1, %3)'] },
    },
    calc_share: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '/',
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: '의 몫',
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'calc_share',
        },
        paramsKeyMap: {
            LEFTHAND: 0,
            RIGHTHAND: 2,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getNumberValue('LEFTHAND', script);
            var rightValue = script.getNumberValue('RIGHTHAND', script);
            return Math.floor(leftValue / rightValue);
        },
        syntax: { js: [], py: [''] },
    },
    calc_operation: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_operation_of_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_operation_of_2,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_calc_operation_square, 'square'],
                    [Lang.Blocks.CALC_calc_operation_root, 'root'],
                    [Lang.Blocks.CALC_calc_operation_sin, 'sin'],
                    [Lang.Blocks.CALC_calc_operation_cos, 'cos'],
                    [Lang.Blocks.CALC_calc_operation_tan, 'tan'],
                    [Lang.Blocks.CALC_calc_operation_asin, 'asin_radian'],
                    [Lang.Blocks.CALC_calc_operation_acos, 'acos_radian'],
                    [Lang.Blocks.CALC_calc_operation_atan, 'atan_radian'],
                    [Lang.Blocks.CALC_calc_operation_log, 'log'],
                    [Lang.Blocks.CALC_calc_operation_ln, 'ln'],
                    [Lang.Blocks.CALC_calc_operation_unnatural, 'unnatural'],
                    [Lang.Blocks.CALC_calc_operation_floor, 'floor'],
                    [Lang.Blocks.CALC_calc_operation_ceil, 'ceil'],
                    [Lang.Blocks.CALC_calc_operation_round, 'round'],
                    [Lang.Blocks.CALC_calc_operation_factorial, 'factorial'],
                    [Lang.Blocks.CALC_calc_operation_abs, 'abs'],
                ],
                value: 'square',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
                null,
            ],
            type: 'calc_operation',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
                null,
            ],
            type: 'calc_operation',
        },
        paramsKeyMap: {
            LEFTHAND: 1,
            VALUE: 3,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('LEFTHAND', script);
            var operator = script.getField('VALUE', script);
            var xRangeCheckList = ['asin_radian', 'acos_radian'];
            if (
                xRangeCheckList.indexOf(operator) > -1 &&
                (value > 1 || value < -1)
            )
                throw new Error('x range exceeded');

            var needToConvertList = ['sin', 'cos', 'tan'];
            if (operator.indexOf('_')) operator = operator.split('_')[0];

            if (needToConvertList.indexOf(operator) > -1)
                value = Entry.toRadian(value);

            var returnVal = 0;
            switch (operator) {
                case 'square':
                    returnVal = value * value;
                    break;
                case 'factorial':
                    returnVal = Entry.factorial(value);
                    break;
                case 'root':
                    returnVal = Math.sqrt(value);
                    break;
                case 'log':
                    returnVal = Math.log(value) / Math.LN10;
                    break;
                case 'ln':
                    returnVal = Math.log(value);
                    break;
                case 'asin':
                case 'acos':
                case 'atan':
                    returnVal = Entry.toDegrees(Math[operator](value));
                    break;
                case 'unnatural':
                    returnVal = new BigNumber(value)
                        .minus(Math.floor(value))
                        .toNumber();
                    if (value < 0) returnVal = 1 - returnVal;
                    break;
                default:
                    returnVal = Math[operator](value);
            }

            return returnVal;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%2 ** 2)',
                    template: '%2 ** 2',
                    params: [null, null, null, 'square'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    // for square
                    syntax: 'math.pow(%2)',
                    params: [null, null, null, 'square'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.sqrt(%2)',
                    params: [null, null, null, 'root'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            isListIndex: true,
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.sin(%2)',
                    params: [null, null, null, 'sin'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.cos(%2)',
                    params: [null, null, null, 'cos'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.tan(%2)',
                    params: [null, null, null, 'tan'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.asin(%2)',
                    params: [null, null, null, 'asin_radian'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.acos(%2)',
                    params: [null, null, null, 'acos_radian'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.atan(%2)',
                    params: [null, null, null, 'atan_radian'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.log10(%2)',
                    params: [null, null, null, 'log'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.log(%2)',
                    params: [null, null, null, 'ln'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: '%2 - math.floor(%2)',
                    params: [null, null, null, 'unnatural'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.floor(%2)',
                    params: [null, null, null, 'floor'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.ceil(%2)',
                    params: [null, null, null, 'ceil'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.round(%2)',
                    params: [null, null, null, 'round'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.factorial(%2)',
                    params: [null, null, null, 'factorial'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
                {
                    syntax: 'math.fabs(%2)',
                    params: [null, null, null, 'abs'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        null,
                    ],
                },
            ],
        },
    },
    calc_rand: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_rand_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_rand_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_calc_rand_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['0'],
                },
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'calc_rand',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'calc_rand',
        },
        paramsKeyMap: {
            LEFTHAND: 1,
            RIGHTHAND: 3,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getStringValue('LEFTHAND', script);
            var rightValue = script.getStringValue('RIGHTHAND', script);
            var left = Math.min(leftValue, rightValue);
            var right = Math.max(leftValue, rightValue);
            var isLeftFloat = Entry.isFloat(leftValue);
            var isRightFloat = Entry.isFloat(rightValue);
            if (isRightFloat || isLeftFloat)
                return (Math.random() * (right - left) + left).toFixed(2);
            else return Math.floor(Math.random() * (right - left + 1) + left);
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'random.randint(%2, %4)',
                    blockType: 'param',
                    textParams: [
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'integer',
                        },
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'integer',
                        },
                        null,
                    ],
                },
                {
                    syntax: 'random.uniform(%2, %4)',
                    blockType: 'param',
                    textParams: [
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'float',
                        },
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'float',
                        },
                        null,
                    ],
                },
            ],
        },
    },
    get_date: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_date_1,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_get_date_year, 'YEAR'],
                    [Lang.Blocks.CALC_get_date_month, 'MONTH'],
                    [Lang.Blocks.CALC_get_date_day, 'DAY'],
                    [Lang.Blocks.CALC_get_date_hour, 'HOUR'],
                    [Lang.Blocks.CALC_get_date_minute, 'MINUTE'],
                    [Lang.Blocks.CALC_get_date_second, 'SECOND'],
                ],
                value: 'YEAR',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_date_2,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, 'YEAR', null],
            type: 'get_date',
        },
        pyHelpDef: {
            params: [null, 'A&value', null],
            type: 'get_date',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'calc_date',
        isNotFor: [],
        func: function(sprite, script) {
            var operator = script.getField('VALUE', script);
            var dateTime = new Date();
            if (operator == 'YEAR') return dateTime.getFullYear();
            else if (operator == 'MONTH') return dateTime.getMonth() + 1;
            else if (operator == 'DAY') return dateTime.getDate();
            else if (operator == 'HOUR') return dateTime.getHours();
            else if (operator == 'MINUTE') return dateTime.getMinutes();
            else return dateTime.getSeconds();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_current_time(%2)',
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.CALC_get_date_year, 'YEAR'],
                                [Lang.Blocks.CALC_get_date_month, 'MONTH'],
                                [Lang.Blocks.CALC_get_date_day, 'DAY'],
                                [Lang.Blocks.CALC_get_date_hour, 'HOUR'],
                                [Lang.Blocks.CALC_get_date_minute, 'MINUTE'],
                                [Lang.Blocks.CALC_get_date_second, 'SECOND'],
                            ],
                            value: 'YEAR',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap: 'Entry.CodeMap.Entry.get_date[1]',
                        },
                    ],
                },
            ],
        },
    },
    get_sound_duration: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_sound_duration_1,
                color: '#3D3D3D',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_sound_duration_2,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
            type: 'get_sound_duration',
        },
        pyHelpDef: {
            params: [null, 'A&value', null],
            type: 'get_sound_duration',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'calc_duration',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getField('VALUE', script);
            var soundsArr = sprite.parent.sounds;

            for (var i = 0; i < soundsArr.length; i++) {
                if (soundsArr[i].id == soundId) return soundsArr[i].duration;
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_sound_length_of(%2)',
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'sounds',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    get_user_name: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [],
        events: {},
        def: {
            params: [],
            type: 'get_user_name',
        },
        class: 'calc_user',
        isNotFor: [],
        func: function(sprite, script) {
            return user ? user.username : ' ';
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_username()',
                    blockType: 'param',
                },
            ],
        },
    },
    reset_project_timer: {
        color: '#FFD974',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Text',
                text: '초시계 초기화',
                color: '#3D3D3D',
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.engine)
                        Entry.engine.hideProjectTimer(block, notIncludeSelf);
                },
            ],
        },
        def: {
            params: [null],
            type: 'reset_project_timer',
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            Entry.engine.updateProjectTimer(0);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_visible_project_timer: {
        color: '#FFD974',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_timer_visible_1,
                color: '#000',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                    [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                ],
                value: 'SHOW',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_timer_visible_2,
                color: '#000',
            },
            {
                type: 'Indicator',
                img: 'block_icon/calc_01.png',
                size: 12,
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.engine)
                        Entry.engine.hideProjectTimer(block, notIncludeSelf);
                },
            ],
        },
        def: {
            params: [null, 'HIDE', null, null],
            type: 'set_visible_project_timer',
        },
        pyHelpDef: {
            params: [null, 'A&value', null, null],
            type: 'set_visible_project_timer',
        },
        paramsKeyMap: {
            ACTION: 1,
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            var action = script.getField('ACTION');
            var timer = Entry.engine.projectTimer;
            if (action == 'SHOW') timer.setVisible(true);
            else timer.setVisible(false);

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    template: '%1 %2 %3',
                    syntax: 'Entry.timer_view(%2)',
                    textParams: [
                        {
                            type: 'Text',
                            text: 'Entry.timer_view(',
                            color: '#000',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                                [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                            ],
                            value: 'SHOW',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap:
                                'Entry.CodeMap.Entry.set_visible_project_timer[1]',
                        },
                        {
                            type: 'Text',
                            text: ')',
                            color: '#000',
                        },
                    ],
                },
            ],
        },
    },
    timer_variable: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: '초시계 값',
                color: '#3D3D3D',
            },
            {
                type: 'Text',
                text: ' ',
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null],
        },
        func: function(sprite, script) {
            return Entry.container.inputValue.getValue();
        },
        syntax: { js: [], py: [''] },
    },
    get_project_timer_value: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_timer_value,
                color: '#3D3D3D',
            },
            {
                type: 'Text',
                text: '',
                color: '#3D3D3D',
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.engine)
                        Entry.engine.hideProjectTimer(block, notIncludeSelf);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'get_project_timer_value',
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            return Entry.engine.projectTimer.getValue();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_timer()',
                    blockType: 'param',
                },
            ],
        },
    },
    char_at: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_char_at_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_char_at_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_char_at_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.hi_entry],
                },
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'char_at',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'char_at',
        },
        paramsKeyMap: {
            LEFTHAND: 1,
            RIGHTHAND: 3,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            var str = script.getStringValue('LEFTHAND', script);
            var index = script.getNumberValue('RIGHTHAND', script) - 1;
            if (index < 0 || index > str.length - 1) throw new Error();
            else return str[index];
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2[%4]',
                    blockType: 'param',
                    textParams: [
                        {
                            type: 'Text',
                            text: Lang.Blocks.CALC_char_at_1,
                            color: '#3D3D3D',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Text',
                            text: Lang.Blocks.CALC_char_at_2,
                            color: '#3D3D3D',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                        {
                            type: 'Text',
                            text: Lang.Blocks.CALC_char_at_3,
                            color: '#3D3D3D',
                        },
                    ],
                    keyOption: 'char_at',
                },
            ],
        },
    },
    length_of_string: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_length_of_string_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_length_of_string_2,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'length_of_string',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'length_of_string',
        },
        paramsKeyMap: {
            STRING: 1,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            return script.getStringValue('STRING', script).length;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'len(%2)',
                    blockType: 'param',
                    keyOption: 'length_of_string',
                },
            ],
        },
    },
    substring: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_substring_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_substring_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_substring_3,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_substring_4,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.hi_entry],
                },
                null,
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                {
                    type: 'number',
                    params: ['5'],
                },
                null,
            ],
            type: 'substring',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
                {
                    type: 'number',
                    params: ['C&value'],
                },
                null,
            ],
            type: 'substring',
        },
        paramsKeyMap: {
            STRING: 1,
            START: 3,
            END: 5,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            var str = script.getStringValue('STRING', script);
            var start = script.getNumberValue('START', script) - 1;
            var end = script.getNumberValue('END', script) - 1;
            var strLen = str.length - 1;
            if (start < 0 || end < 0 || start > strLen || end > strLen)
                throw new Error();
            else
                return str.substring(
                    Math.min(start, end),
                    Math.max(start, end) + 1
                );
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2[%4:%6]',
                    blockType: 'param',
                    textParams: [
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                        null,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        null,
                    ],
                },
            ],
        },
    },
    replace_string: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_replace_string_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_replace_string_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_replace_string_3,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_replace_string_4,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.hi_entry],
                },
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.hello],
                },
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.nice],
                },
                null,
            ],
            type: 'replace_string',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
                {
                    type: 'text',
                    params: ['C&value'],
                },
                null,
            ],
            type: 'replace_string',
        },
        paramsKeyMap: {
            STRING: 1,
            OLD_WORD: 3,
            NEW_WORD: 5,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            return script
                .getStringValue('STRING', script)
                .replace(
                    new RegExp(script.getStringValue('OLD_WORD', script), 'gm'),
                    script.getStringValue('NEW_WORD', script)
                );
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2.replace(%4, %6)',
                    blockType: 'param',
                },
            ],
        },
    },
    change_string_case: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_change_string_case_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_change_string_case_2,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_change_string_case_sub_1, 'toUpperCase'],
                    [Lang.Blocks.CALC_change_string_case_sub_2, 'toLowerCase'],
                ],
                value: 'toUpperCase',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_change_string_case_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['Hello Entry!'],
                },
                null,
                null,
                null,
            ],
            type: 'change_string_case',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                null,
                null,
            ],
            type: 'change_string_case',
        },
        paramsKeyMap: {
            STRING: 1,
            CASE: 3,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            return script
                .getStringValue('STRING', script)
                [script.getField('CASE', script)]();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2.upper()',
                    params: [null, null, null, 'toUpperCase', null],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks.CALC_change_string_case_sub_1,
                                    'toUpperCase',
                                ],
                                [
                                    Lang.Blocks.CALC_change_string_case_sub_2,
                                    'toLowerCase',
                                ],
                            ],
                            value: 'toUpperCase',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringValue,
                        },
                    ],
                },
                {
                    syntax: '%2.lower()',
                    params: [null, null, null, 'toLowerCase', null],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks.CALC_change_string_case_sub_1,
                                    'toUpperCase',
                                ],
                                [
                                    Lang.Blocks.CALC_change_string_case_sub_2,
                                    'toLowerCase',
                                ],
                            ],
                            value: 'toUpperCase',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringValue,
                        },
                    ],
                },
            ],
        },
    },
    index_of_string: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_index_of_string_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_index_of_string_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_index_of_string_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.hi_entry],
                },
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'index_of_string',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'index_of_string',
        },
        paramsKeyMap: {
            LEFTHAND: 1,
            RIGHTHAND: 3,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            var str = script.getStringValue('LEFTHAND', script);
            var target = script.getStringValue('RIGHTHAND', script);
            var index = str.indexOf(target);
            return index + 1;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2.find(%4)',
                    blockType: 'param',
                },
            ],
        },
    },
    combine_something: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_combine_something_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_combine_something_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_combine_something_3,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.block_hi],
                },
                null,
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'combine_something',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'combine_something',
        },
        paramsKeyMap: {
            VALUE1: 1,
            VALUE2: 3,
        },
        class: 'calc_string',
        isNotFor: [],
        func: function(sprite, script) {
            var leftValue = script.getStringValue('VALUE1', script);
            var rightValue = script.getStringValue('VALUE2', script);

            return leftValue + rightValue;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%2 + %4)',
                    template: '%2 + %4',
                    blockType: 'param',
                },
            ],
        },
    },
    get_sound_volume: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_get_sound_volume,
                color: '#3D3D3D',
            },
            {
                type: 'Text',
                text: '',
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'get_sound_volume',
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            return createjs.Sound.getVolume() * 100;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.value_of_sound_volume()',
                    blockType: 'param',
                },
            ],
        },
    },
    quotient_and_mod: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_quotient_and_mod_1,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_quotient_and_mod_2,
                color: '#3D3D3D',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_quotient_and_mod_3,
                color: '#3D3D3D',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_quotient_and_mod_sub_1, 'QUOTIENT'],
                    [Lang.Blocks.CALC_quotient_and_mod_sub_2, 'MOD'],
                ],
                value: 'QUOTIENT',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
                null,
            ],
            type: 'quotient_and_mod',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
                null,
            ],
            type: 'quotient_and_mod',
        },
        paramsKeyMap: {
            LEFTHAND: 1,
            RIGHTHAND: 3,
            OPERATOR: 5,
        },
        class: 'calc',
        isNotFor: [],
        func: function(sprite, script) {
            var left = script.getNumberValue('LEFTHAND', script);
            var right = script.getNumberValue('RIGHTHAND', script);
            if (isNaN(left) || isNaN(right)) throw new Error();
            var operator = script.getField('OPERATOR', script);
            if (operator == 'QUOTIENT') return Math.floor(left / right);
            else return left % right;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '(%2 // %4)',
                    template: '%2 // %4',
                    params: [null, null, null, null, null, 'QUOTIENT'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks.CALC_quotient_and_mod_sub_1,
                                    'QUOTIENT',
                                ],
                                [
                                    Lang.Blocks.CALC_quotient_and_mod_sub_2,
                                    'MOD',
                                ],
                            ],
                            value: 'QUOTIENT',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringValue,
                        },
                    ],
                },
                {
                    syntax: '(%2 % %4)',
                    template: '%2 % %4',
                    params: [null, null, null, null, null, 'MOD'],
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        undefined,
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks.CALC_quotient_and_mod_sub_1,
                                    'QUOTIENT',
                                ],
                                [
                                    Lang.Blocks.CALC_quotient_and_mod_sub_2,
                                    'MOD',
                                ],
                            ],
                            value: 'QUOTIENT',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter: Entry.block.converters.returnStringValue,
                        },
                    ],
                },
            ],
        },
    },
    choose_project_timer_action: {
        color: '#FFD974',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.CALC_choose_project_timer_action_1,
                color: '#000',
            },
            {
                type: 'Dropdown',
                options: [
                    [
                        Lang.Blocks.CALC_choose_project_timer_action_sub_1,
                        'START',
                    ],
                    [
                        Lang.Blocks.CALC_choose_project_timer_action_sub_2,
                        'STOP',
                    ],
                    [
                        Lang.Blocks.CALC_choose_project_timer_action_sub_3,
                        'RESET',
                    ],
                ],
                value: 'START',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_CALC,
            },
            {
                type: 'Text',
                text: Lang.Blocks.CALC_choose_project_timer_action_2,
                color: '#000',
            },
            {
                type: 'Indicator',
                img: 'block_icon/calc_01.png',
                size: 12,
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                },
            ],
            dataDestroy: [
                function(block) {
                    if (Entry.engine) Entry.engine.hideProjectTimer(block);
                },
            ],
        },
        def: {
            params: [null, 'START', null, null],
            type: 'choose_project_timer_action',
        },
        pyHelpDef: {
            params: [null, 'A&value', null, null],
            type: 'choose_project_timer_action',
        },
        paramsKeyMap: {
            ACTION: 1,
        },
        class: 'calc_timer',
        isNotFor: [],
        func: function(sprite, script) {
            var engine = Entry.engine;
            var timer = engine.projectTimer;
            var isPaused = timer.isPaused;
            var isInit = timer.isInit;
            var currentTime = new Date().getTime();

            switch (script.getField('ACTION')) {
                case 'START':
                    if (!isInit) {
                        engine.startProjectTimer();
                    } else if (isInit && isPaused) {
                        if (timer.pauseStart)
                            timer.pausedTime += currentTime - timer.pauseStart;
                        delete timer.pauseStart;
                        timer.isPaused = false;
                    }
                    break;
                case 'STOP':
                    if (isInit && !isPaused) {
                        timer.isPaused = true;
                        timer.pauseStart = currentTime;
                    }
                    break;
                case 'RESET':
                    engine.resetTimer();
                    break;
            }

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    template: '%1 %2 %3',
                    syntax: 'Entry.timer(%2)',
                    textParams: [
                        {
                            type: 'Text',
                            text: 'Entry.timer(',
                            color: '#000',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks
                                        .CALC_choose_project_timer_action_sub_1,
                                    'START',
                                ],
                                [
                                    Lang.Blocks
                                        .CALC_choose_project_timer_action_sub_2,
                                    'STOP',
                                ],
                                [
                                    Lang.Blocks
                                        .CALC_choose_project_timer_action_sub_3,
                                    'RESET',
                                ],
                            ],
                            value: 'START',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_CALC,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap:
                                'Entry.CodeMap.Entry.choose_project_timer_action[1]',
                        },
                        {
                            type: 'Text',
                            text: ')',
                            color: '#000',
                        },
                    ],
                },
            ],
        },
    },
    wait_second: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
            ],
            type: 'wait_second',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'wait_second',
        },
        paramsKeyMap: {
            SECOND: 0,
        },
        class: 'delay',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = script.getNumberValue('SECOND', script);
                var fps = Entry.FPS || 60;
                timeValue = 60 / fps * timeValue * 1000;
                setTimeout(function() {
                    script.timeFlag = 0;
                }, timeValue);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.wait_for_sec(%1)',
                },
            ],
        },
    },
    repeat_basic: {
        color: '#498deb',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'repeat_basic',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'repeat_basic',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        statementsKeyMap: {
            DO: 0,
        },
        class: 'repeat',
        isNotFor: [],
        func: function(sprite, script) {
            var iterNumber;
            if (!script.isLooped) {
                script.isLooped = true;
                var iterNumber = script.getNumberValue('VALUE', script);
                if (iterNumber < 0)
                    throw new Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
                script.iterCount = Math.floor(iterNumber);
            }
            if (script.iterCount != 0 && !(script.iterCount < 0)) {
                script.iterCount--;
                return script.getStatement('DO', script);
            } else {
                delete script.isLooped;
                delete script.iterCount;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'for i in range(%1):\n$1',
                    template: 'for i in range(%1):',
                    idChar: ['i', 'j', 'k'],
                },
            ],
        },
    },
    repeat_inf: {
        color: '#498deb',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
            {
                type: 'Block',
                accept: 'Boolean',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'repeat_inf',
        },
        pyHelpDef: {
            params: [
                null,
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
            ],
            type: 'repeat_inf',
        },
        statementsKeyMap: {
            DO: 0,
        },
        class: 'repeat',
        isNotFor: [],
        func: function(sprite, script) {
            //return script.getStatement("DO", script);
            script.isLooped = true;
            return script.getStatement('DO');
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'while True:\n$1',
                    template: 'while %2\n:',
                    textParams: [
                        undefined,
                        {
                            type: 'Block',
                            accept: 'boolean',
                        },
                    ],
                },
            ],
        },
    },
    stop_repeat: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'stop_repeat',
        },
        class: 'repeat',
        isNotFor: [],
        func: function(sprite, script) {
            return this.executor.breakLoop();
        },
        syntax: { js: [], py: ['break'] },
    },
    wait_until_true: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'True',
                },
                null,
            ],
            type: 'wait_until_true',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
            ],
            type: 'wait_until_true',
        },
        paramsKeyMap: {
            BOOL: 0,
        },
        class: 'wait',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getBooleanValue('BOOL', script);
            if (value) {
                return script.callReturn();
            } else {
                return script;
            }
        },
        syntax: { js: [], py: ['Entry.wait_until(%1)'] },
    },
    _if: {
        color: '#498deb',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'True',
                },
                null,
            ],
            type: '_if',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
            ],
            type: '_if',
        },
        paramsKeyMap: {
            BOOL: 0,
        },
        statementsKeyMap: {
            STACK: 0,
        },
        class: 'condition',
        isNotFor: [],
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = script.getBooleanValue('BOOL', script);
            if (value) {
                script.isCondition = true;
                return script.getStatement('STACK', script);
            } else {
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [{ syntax: 'if %1:\n$1', template: 'if %1:' }],
        },
    },
    if_else: {
        color: '#498deb',
        skeleton: 'basic_double_loop',
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'True',
                },
                null,
            ],
            type: 'if_else',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
            ],
            type: 'if_else',
        },
        paramsKeyMap: {
            BOOL: 0,
        },
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        class: 'condition',
        isNotFor: [],
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = script.getBooleanValue('BOOL', script);
            script.isCondition = true;
            if (value) return script.getStatement('STACK_IF', script);
            else return script.getStatement('STACK_ELSE', script);
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'if %1:\n$1\nelse:\n$2',
                    template: 'if %1: %3 else:',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'boolean',
                        },
                        undefined,
                        {
                            type: 'LineBreak',
                        },
                    ],
                },
            ],
        },
    },
    create_clone: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'clone',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_FLOW,
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'create_clone',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'create_clone',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'clone',
        isNotFor: [],
        func: function(sprite, script) {
            var targetSpriteId = script.getField('VALUE', script);
            var returnBlock = script.callReturn();
            if (targetSpriteId == 'self')
                sprite.parent.addCloneEntity(sprite.parent, sprite, null);
            else {
                var object = Entry.container.getObject(targetSpriteId);
                object.addCloneEntity(sprite.parent, null, null);
            }
            return returnBlock;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.make_clone_of(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'clone',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_FLOW,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap: 'Entry.CodeMap.Entry.create_clone[0]',
                        },
                    ],
                },
            ],
        },
    },
    delete_clone: {
        color: '#498deb',
        skeleton: 'basic_without_next',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'delete_clone',
        },
        class: 'clone',
        isNotFor: [],
        func: function(sprite, script) {
            if (!sprite.isClone) return script.callReturn();
            sprite.removeClone();
            return this.die();
        },
        syntax: { js: [], py: ['Entry.remove_this_clone()'] },
    },
    when_clone_start: {
        color: '#498deb',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_clone.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'when_clone_start',
        },
        class: 'clone',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'when_clone_start',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_make_clone():',
                    blockType: 'event',
                },
            ],
        },
    },
    stop_run: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return Entry.engine.toggleStop();
        },
        syntax: { js: [], py: [''] },
    },
    repeat_while_true: {
        color: '#498deb',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.FLOW_repeat_while_true_until, 'until'],
                    [Lang.Blocks.FLOW_repeat_while_true_while, 'while'],
                ],
                value: 'until',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_FLOW,
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'True',
                },
                null,
                null,
            ],
            type: 'repeat_while_true',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'boolean_shell',
                    params: ['A'],
                },
                null,
                null,
            ],
            type: 'repeat_while_true',
        },
        paramsKeyMap: {
            BOOL: 0,
            OPTION: 1,
        },
        statementsKeyMap: {
            DO: 0,
        },
        class: 'repeat',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getBooleanValue('BOOL', script);

            if (script.getField('OPTION', script) == 'until') value = !value;
            script.isLooped = value;

            return value
                ? script.getStatement('DO', script)
                : script.callReturn();
        },
        syntax: {
            js: [],
            py: [{ syntax: 'while %1 %2:\n$1', template: 'while not %1:' }],
        },
    },
    stop_object: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.FLOW_stop_object_all, 'all'],
                    [Lang.Blocks.FLOW_stop_object_this_object, 'thisOnly'],
                    [Lang.Blocks.FLOW_stop_object_this_thread, 'thisThread'],
                    [Lang.Blocks.FLOW_stop_object_other_thread, 'otherThread'],
                    [
                        Lang.Blocks.FLOW_stop_object_other_objects,
                        'other_objects',
                    ],
                ],
                value: 'all',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_FLOW,
            },
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'stop_object',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'stop_object',
        },
        paramsKeyMap: {
            TARGET: 0,
        },
        class: 'terminate',
        isNotFor: [],
        func: function(sprite, script) {
            var object = sprite.parent;

            switch (script.getField('TARGET', script)) {
                case 'all':
                    Entry.container.mapObject(function(obj) {
                        if (!obj.objectType) return;

                        obj.script.clearExecutors();
                    });
                    return this.die();
                case 'thisOnly':
                    object.script.clearExecutorsByEntity(sprite);
                    return this.die();
                case 'thisObject':
                    object.script.clearExecutors();
                    return this.die();
                case 'thisThread':
                    return this.die();
                case 'otherThread':
                    var executor = this.executor;
                    var code = object.script;
                    var executors = code.executors;
                    var spriteId = sprite.id;

                    for (var i = 0; i < executors.length; i++) {
                        var currentExecutor = executors[i];
                        if (
                            currentExecutor !== executor &&
                            currentExecutor.entity.id === spriteId
                        ) {
                            code.removeExecutor(currentExecutor);
                            --i;
                        }
                    }
                    return script.callReturn();
                case 'other_objects':
                    Entry.container.mapObject(function(obj) {
                        if (!obj.objectType || obj === object) {
                            return;
                        }

                        obj.script.clearExecutors();
                    });
                    return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.stop_code(%1)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.FLOW_stop_object_all, 'all'],
                                [
                                    Lang.Blocks.FLOW_stop_object_this_object,
                                    'thisOnly',
                                ],
                                [
                                    Lang.Blocks.FLOW_stop_object_this_thread,
                                    'thisThread',
                                ],
                                [
                                    Lang.Blocks.FLOW_stop_object_other_thread,
                                    'otherThread',
                                ],
                                [
                                    Lang.Blocks.FLOW_stop_object_other_objects,
                                    'other_objects',
                                ],
                            ],
                            value: 'all',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_FLOW,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap: 'Entry.CodeMap.Entry.stop_object[0]',
                        },
                    ],
                },
            ],
        },
    },
    restart_project: {
        color: '#498deb',
        skeleton: 'basic_without_next',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'restart_project',
        },
        class: 'terminate',
        isNotFor: [],
        func: function(sprite, script) {
            Entry.engine.toggleStop();
            Entry.engine.toggleRun();
        },
        syntax: { js: [], py: ['Entry.start_again()'] },
    },
    remove_all_clones: {
        color: '#498deb',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/flow_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'remove_all_clones',
        },
        class: 'clone',
        isNotFor: [],
        func: function(sprite, script) {
            var clonedEntities = sprite.parent.getClonedEntities();
            clonedEntities.map(function(entity) {
                entity.removeClone();
            });
            clonedEntities = null;

            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.remove_all_clone()'] },
    },
    functionAddButton: {
        skeleton: 'basic_button',
        color: '#eee',
        isNotFor: ['functionInit'],
        params: [
            {
                type: 'Text',
                text: Lang.Workspace.function_create,
                color: '#333',
                align: 'center',
            },
        ],
        def: {
            type: 'functionAddButton',
        },
        events: {
            mousedown: [
                function() {
                    Entry.variableContainer.createFunction();
                },
            ],
        },
    },
    function_field_label: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#f9c535',
        params: [
            {
                type: 'TextInput',
                value: Lang.Blocks.FUNCTION_explanation_1,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            NAME: 0,
            NEXT: 1,
        },
        def: {
            params: [Lang.Blocks.FUNCTION_explanation_1],
            type: 'function_field_label',
        },
        //"syntax": {"js": [], "py": ["%1function_field_label#"]}
        syntax: { js: [], py: ['name'] },
    },
    function_field_string: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#ffd974',
        params: [
            {
                type: 'Block',
                accept: 'string',
                restore: true,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            PARAM: 0,
            NEXT: 1,
        },
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.template.function_param_string],
                },
            ],
            type: 'function_field_string',
        },
        //"syntax": {"js": [], "py": ["%1function_field_string#"]}
        syntax: { js: [], py: ['value'] },
    },
    function_field_boolean: {
        skeleton: 'basic_param',
        isNotFor: ['functionEdit'],
        color: '#aeb8ff',
        params: [
            {
                type: 'Block',
                accept: 'boolean',
                restore: true,
            },
            {
                type: 'Output',
                accept: 'param',
            },
        ],
        paramsKeyMap: {
            PARAM: 0,
            NEXT: 1,
        },
        def: {
            params: [
                {
                    type: 'True',
                    params: [Lang.template.function_param_boolean],
                },
            ],
            type: 'function_field_boolean',
        },
        //"syntax": {"js": [], "py": ["%1function_field_boolean#"]}
        syntax: { js: [], py: ['boolean'] },
    },
    function_param_string: {
        skeleton: 'basic_string_field',
        color: '#ffd974',
        template: '%1 %2',
        events: {
            viewAdd: [
                function() {
                    if (Entry.Func.isEdit) Entry.Func.refreshMenuCode();
                },
            ],
        },
        func: function() {
            return this.executor.register.params[
                this.executor.register.paramMap[this.block.type]
            ];
        },
        syntax: { js: [], py: [''] },
    },
    function_param_boolean: {
        skeleton: 'basic_boolean_field',
        color: '#aeb8ff',
        template: '%1 %2',
        events: {
            viewAdd: [
                function() {
                    if (Entry.Func.isEdit) Entry.Func.refreshMenuCode();
                },
            ],
        },
        func: function() {
            return this.executor.register.params[
                this.executor.register.paramMap[this.block.type]
            ];
        },
        syntax: { js: [], py: [''] },
    },
    function_create: {
        skeleton: 'basic_create',
        color: '#cc7337',
        event: 'funcDef',
        params: [
            {
                type: 'Block',
                accept: 'param',
                value: {
                    type: 'function_field_label',
                    params: [Lang.Blocks.FUNC],
                    copyable: false,
                },
            },
            {
                type: 'Indicator',
                img: 'block_icon/function_03.png',
                size: 12,
            },
        ],
        paramsKeyMap: {
            FIELD: 0,
        },
        func: function() {},
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'function_create',
                },
            ],
        },
    },
    function_general: {
        skeleton: 'basic',
        color: '#cc7337',
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/function_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_functionRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_functionRefs', block);
                },
            ],
            dblclick: [
                function(blockView) {
                    var mode = blockView.getBoard().workspace.getMode();
                    if (mode !== Entry.Workspace.MODE_BOARD) return;
                    if (Entry.type !== 'workspace') return;
                    var block = blockView.block;
                    var id = block.getFuncId();
                    Entry.Func.edit(Entry.variableContainer.functions_[id]);
                },
            ],
        },
        func: function(entity) {
            if (!this.initiated) {
                this.initiated = true;
                Entry.callStackLength++;

                if (Entry.callStackLength > Entry.Executor.MAXIMUM_CALLSTACK) {
                    Entry.toast.alert(
                        Lang.Workspace.RecursiveCallWarningTitle,
                        Lang.Workspace.RecursiveCallWarningContent
                    );
                    throw new Error();
                }

                var func = Entry.variableContainer.getFunction(
                    this.block.getFuncId()
                );
                this.funcCode = func.content;
                this.funcExecutor = this.funcCode.raiseEvent(
                    'funcDef',
                    entity
                )[0];
                this.funcExecutor.register.params = this.getParams();
                var paramMap = {};
                this.funcExecutor.register.paramMap = func.paramMap;
                this.funcExecutor.parentExecutor = this.executor;
                this.funcExecutor.isFuncExecutor = true;
            }
            this.funcExecutor.execute();
            if (!this.funcExecutor.isEnd()) {
                this.funcCode.removeExecutor(this.funcExecutor);
                return Entry.STATIC.BREAK;
            }

            Entry.callStackLength--;
        },
        syntax: { js: [], py: [''] },
    },
    //endregion basic 기본블록
    //region basic 기본
    show: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'show',
        },
        class: 'visibility',
        isNotFor: [],
        func: function(sprite, script) {
            sprite.setVisible(true);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.show()'] },
    },
    hide: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hide',
        },
        class: 'visibility',
        isNotFor: [],
        func: function(sprite, script) {
            sprite.setVisible(false);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.hide()'] },
    },
    dialog_time: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [[Lang.Blocks.speak, 'speak']],
                value: 'speak',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.block_hi],
                },
                {
                    type: 'number',
                    params: ['4'],
                },
                null,
                null,
            ],
            type: 'dialog_time',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
                null,
            ],
            type: 'dialog_time',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
            OPTION: 2,
        },
        class: 'say',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue = script.getNumberValue('SECOND', script);
                var message = script.getValue('VALUE', script);
                var mode = script.getField('OPTION', script);
                script.isStart = true;
                script.timeFlag = 1;
                if (message === '') {
                    message = '    ';
                } else if (typeof message === 'boolean') {
                    message = message ? 'True' : 'False';
                } else {
                    message = message + '';
                }
                message = Entry.convertToRoundedDecimals(message, 3);
                new Entry.Dialog(sprite, message, mode);
                sprite.syncDialogVisible(sprite.getVisible());
                setTimeout(function() {
                    script.timeFlag = 0;
                }, timeValue * 1000);
            }
            if (script.timeFlag == 0) {
                delete script.timeFlag;
                delete script.isStart;
                if (sprite.dialog) sprite.dialog.remove();
                return script.callReturn();
            } else {
                if (!sprite.dialog) {
                    var message = script.getStringValue('VALUE', script);
                    var mode = script.getField('OPTION', script);
                    if (!message && typeof message != 'number')
                        message = '    ';
                    message = Entry.convertToRoundedDecimals(message, 3);
                    new Entry.Dialog(sprite, message, mode);
                    sprite.syncDialogVisible(sprite.getVisible());
                }
                return script;
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.print_for_sec(%1, %2)',
                    params: [null, null, 'speak'],
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [[Lang.Blocks.speak, 'speak']],
                            value: 'speak',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringValue,
                        },
                    ],
                },
            ],
        },
    },
    dialog: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Dropdown',
                options: [[Lang.Blocks.speak, 'speak']],
                value: 'speak',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.block_hi],
                },
                null,
                null,
            ],
            type: 'dialog',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
                null,
            ],
            type: 'dialog',
        },
        paramsKeyMap: {
            VALUE: 0,
            OPTION: 1,
        },
        class: 'say',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var message = script.getValue('VALUE', script);
            if (message === '') {
                message = '    ';
            } else if (typeof message === 'boolean') {
                message = message ? 'True' : 'False';
            } else {
                message = message + '';
            }
            var mode = script.getField('OPTION', script);
            message = Entry.convertToRoundedDecimals(message, 3);
            new Entry.Dialog(sprite, message, mode);
            sprite.syncDialogVisible(sprite.getVisible());
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.print(%1)',
                    params: [null, 'speak'],
                },
            ],
        },
    },
    remove_dialog: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'remove_dialog',
        },
        class: 'say',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            if (sprite.dialog) sprite.dialog.remove();
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.clear_print()'] },
    },
    change_to_nth_shape: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'pictures',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'change_to_nth_shape',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'shape',
        isNotFor: [],
        func: function(sprite, script) {
            var imageId = script.getField('VALUE', script);
            var picture = sprite.parent.getPicture(imageId);
            sprite.setImage(picture);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    change_to_next_shape: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.LOOKS_change_shape_next, 'next'],
                    [Lang.Blocks.LOOKS_change_shape_prev, 'prev'],
                ],
                value: 'next',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'change_to_next_shape',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'change_to_next_shape',
        },
        paramsKeyMap: {
            DRIECTION: 0,
        },
        class: 'shape',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var picture;
            if (script.getStringField('DRIECTION') !== 'prev') {
                picture = sprite.parent.getNextPicture(sprite.picture.id);
            } else {
                picture = sprite.parent.getPrevPicture(sprite.picture.id);
            }
            sprite.setImage(picture);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.change_shape_to(%1)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.LOOKS_change_shape_next, 'next'],
                                [Lang.Blocks.LOOKS_change_shape_prev, 'prev'],
                            ],
                            value: 'next',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap:
                                'Entry.CodeMap.Entry.change_to_next_shape[0]',
                        },
                    ],
                },
            ],
        },
    },
    set_effect_volume: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        deprecated: true,
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.opacity, 'opacity'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'set_effect_volume',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue + sprite.effect.hue;
                effectName = 'hue';
            } else if (effect == 'lens') {
            } else if (effect == 'swriling') {
            } else if (effect == 'pixel') {
            } else if (effect == 'mosaic') {
            } else if (effect == 'brightness') {
                sprite.effect.brightness =
                    effectValue + sprite.effect.brightness;
                effectName = 'brightness';
            } else if (effect == 'blur') {
            } else if (effect == 'opacity') {
                sprite.effect.alpha = sprite.effect.alpha + effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_effect_volume(%1, %2)'] },
    },
    set_effect: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.opacity, 'opacity'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_effect',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue;
                effectName = 'hue';
            } else if (effect == 'lens') {
            } else if (effect == 'swriling') {
            } else if (effect == 'pixel') {
            } else if (effect == 'mosaic') {
            } else if (effect == 'brightness') {
                sprite.effect.brightness = effectValue;
                effectName = 'brightness';
            } else if (effect == 'blur') {
            } else if (effect == 'opacity') {
                sprite.effect.alpha = effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_effect(%1, %2)'] },
    },
    erase_all_effects: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'erase_all_effects',
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            sprite.resetFilter();
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.clear_effect()'] },
    },
    change_scale_percent: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_scale_percent',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var scaleValue =
                (script.getNumberValue('VALUE', script) + 100) / 100;
            sprite.setScaleX(sprite.getScaleX() * scaleValue);
            sprite.setScaleY(sprite.getScaleY() * scaleValue);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_scale_percent: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_scale_percent',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var scaleValue = script.getNumberValue('VALUE', script) / 100;
            var snapshot = sprite.snapshot_;
            sprite.setScaleX(scaleValue * snapshot.scaleX);
            sprite.setScaleY(scaleValue * snapshot.scaleY);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    change_scale_size: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_scale_size',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'change_scale_size',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var sizeValue = script.getNumberValue('VALUE', script);
            sprite.setSize(sprite.getSize() + sizeValue);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_size(%1)'] },
    },
    set_scale_size: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_scale_size',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'set_scale_size',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scale',
        isNotFor: [],
        func: function(sprite, script) {
            var sizeValue = script.getNumberValue('VALUE', script);
            sprite.setSize(sizeValue);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_size(%1)'] },
    },
    flip_y: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'flip_y',
        },
        class: 'flip',
        isNotFor: [],
        func: function(sprite, script) {
            sprite.setScaleX(-1 * sprite.getScaleX());
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.flip_vertical()'] },
    },
    flip_x: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'flip_x',
        },
        class: 'flip',
        isNotFor: [],
        func: function(sprite, script) {
            sprite.setScaleY(-1 * sprite.getScaleY());
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.flip_horizontal()'] },
    },
    set_object_order: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'objectSequence',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'set_object_order',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'z-index',
        isNotFor: [],
        func: function(sprite, script) {
            var targetIndex = script.getField('VALUE', script);
            //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);
            var currentIndex = Entry.container
                .getCurrentObjects()
                .indexOf(sprite.parent);

            if (currentIndex > -1) {
                return script.callReturn();
            } else throw new Error('object is not available');
        },
        syntax: { js: [], py: [''] },
    },
    get_pictures: {
        color: '#EC4466',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'pictures',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            return script.getStringField('VALUE');
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'get_pictures',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'pictures',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    change_to_some_shape: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_pictures',
                    id: 'z4jm',
                },
                null,
            ],
            type: 'change_to_some_shape',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_pictures',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'change_to_some_shape',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'shape',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var imageId = script.getStringValue('VALUE');
            var value = Entry.parseNumber(imageId);
            var picture = sprite.parent.getPicture(imageId);

            sprite.setImage(picture);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.change_shape(%1)',
                },
            ],
        },
    },
    add_effect_amount: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'add_effect_amount',
        },
        pyHelpDef: {
            params: [
                'A&value',
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'add_effect_amount',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hsv = effectValue + sprite.effect.hsv;
                effectName = 'hsv';
            } else if (effect == 'brightness') {
                sprite.effect.brightness =
                    effectValue + sprite.effect.brightness;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = sprite.effect.alpha - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.add_effect(%1, %2)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.color, 'color'],
                                [Lang.Blocks.brightness, 'brightness'],
                                [Lang.Blocks.transparency, 'transparency'],
                            ],
                            value: 'color',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap: 'Entry.CodeMap.Entry.add_effect_amount[0]',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    change_effect_amount: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'change_effect_amount',
        },
        pyHelpDef: {
            params: [
                'A&value',
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'change_effect_amount',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hsv = effectValue;
                effectName = 'hsv';
            } else if (effect == 'brightness') {
                sprite.effect.brightness = effectValue;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = 1 - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.set_effect(%1, %2)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.color, 'color'],
                                [Lang.Blocks.brightness, 'brightness'],
                                [Lang.Blocks.transparency, 'transparency'],
                            ],
                            value: 'color',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap:
                                'Entry.CodeMap.Entry.change_effect_amount[0]',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    set_effect_amount: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'set_effect_amount',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue + sprite.effect.hue;
                effectName = 'hue';
            } else if (effect == 'brightness') {
                sprite.effect.brightness =
                    effectValue + sprite.effect.brightness;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = sprite.effect.alpha - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    set_entity_effect: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.color, 'color'],
                    [Lang.Blocks.brightness, 'brightness'],
                    [Lang.Blocks.transparency, 'transparency'],
                ],
                value: 'color',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['100'],
                },
                null,
            ],
            type: 'set_entity_effect',
        },
        paramsKeyMap: {
            EFFECT: 0,
            VALUE: 1,
        },
        class: 'effect',
        isNotFor: ['textBox'],
        func: function(sprite, script) {
            var effect = script.getField('EFFECT', script);
            var effectValue = script.getNumberValue('VALUE', script);
            var effectName = '';
            if (effect == 'color') {
                sprite.effect.hue = effectValue;
                effectName = 'hue';
            } else if (effect == 'brightness') {
                sprite.effect.brightness = effectValue;
                effectName = 'brightness';
            } else if (effect == 'transparency') {
                sprite.effect.alpha = 1 - effectValue / 100;
                effectName = 'alpha';
            }
            sprite.applyFilter(true, [effectName]);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    change_object_index: {
        color: '#EC4466',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.LOOKS_change_object_index_sub_1, 'FRONT'],
                    [Lang.Blocks.LOOKS_change_object_index_sub_2, 'FORWARD'],
                    [Lang.Blocks.LOOKS_change_object_index_sub_3, 'BACKWARD'],
                    [Lang.Blocks.LOOKS_change_object_index_sub_4, 'BACK'],
                ],
                value: 'FRONT',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
            },
            {
                type: 'Indicator',
                img: 'block_icon/looks_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'change_object_index',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'change_object_index',
        },
        paramsKeyMap: {
            LOCATION: 0,
        },
        class: 'z-index',
        isNotFor: [],
        func: function(sprite, script) {
            var location = script.getField('LOCATION', script);
            var selectedObjectContainer = Entry.stage.selectedObjectContainer;
            var currentIndex = selectedObjectContainer.getChildIndex(
                sprite.object
            );
            var max = selectedObjectContainer.children.length - 1;
            var targetIndex = currentIndex;

            switch (location) {
                case 'FRONT':
                    targetIndex = max;
                    break;
                case 'FORWARD':
                    if (currentIndex === max) break;

                    var frontEntity = selectedObjectContainer.getChildAt(
                        currentIndex + 1
                    ).entity;
                    targetIndex +=
                        (frontEntity.shapes.length ? 2 : 1) +
                        frontEntity.stamps.length;
                    break;
                case 'BACKWARD':
                    targetIndex -=
                        (sprite.shapes.length ? 2 : 1) + sprite.stamps.length;
                    var backEntity = selectedObjectContainer.getChildAt(
                        targetIndex
                    );
                    if (!backEntity) {
                        targetIndex = 0;
                        break;
                    }
                    backEntity = backEntity.entity;
                    targetIndex -=
                        (backEntity.shapes.length ? 1 : 0) +
                        backEntity.stamps.length;
                    break;
                case 'BACK':
                    targetIndex = 0;
                    break;
            }
            Entry.stage.setEntityIndex(sprite, targetIndex);

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.send_layer_to(%1)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [
                                    Lang.Blocks.LOOKS_change_object_index_sub_1,
                                    'FRONT',
                                ],
                                [
                                    Lang.Blocks.LOOKS_change_object_index_sub_2,
                                    'FORWARD',
                                ],
                                [
                                    Lang.Blocks.LOOKS_change_object_index_sub_3,
                                    'BACKWARD',
                                ],
                                [
                                    Lang.Blocks.LOOKS_change_object_index_sub_4,
                                    'BACK',
                                ],
                            ],
                            value: 'FRONT',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_LOOKS,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap:
                                'Entry.CodeMap.Entry.change_object_index[0]',
                        },
                    ],
                },
            ],
        },
    },
    move_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'move_direction',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'move_direction',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'walk',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setX(
                sprite.getX() +
                    value *
                        Math.cos(
                            (sprite.getRotation() +
                                sprite.getDirection() -
                                90) /
                                180 *
                                Math.PI
                        )
            );
            sprite.setY(
                sprite.getY() -
                    value *
                        Math.sin(
                            (sprite.getRotation() +
                                sprite.getDirection() -
                                90) /
                                180 *
                                Math.PI
                        )
            );
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.move_to_direction(%1)'] },
    },
    move_x: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'move_x',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'move_x',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'move_relative',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setX(sprite.getX() + value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_x(%1)'] },
    },
    move_y: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'move_y',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'move_y',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'move_relative',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setY(sprite.getY() + value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_y(%1)'] },
    },
    locate_xy_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                {
                    type: 'number',
                    params: ['10'],
                },
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'locate_xy_time',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['C&value'],
                },
                {
                    type: 'number',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'locate_xy_time',
        },
        paramsKeyMap: {
            VALUE1: 0,
            VALUE2: 1,
            VALUE3: 2,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('VALUE1', script);
                script.isStart = true;
                script.frameCount = Math.max(
                    Math.floor(timeValue * Entry.FPS),
                    1
                );
                script.x = script.getNumberValue('VALUE2', script);
                script.y = script.getNumberValue('VALUE3', script);

                if (script.frameCount == 1) action();
            }

            if (script.frameCount != 0) {
                action();
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }

            function action() {
                var dX = script.x - sprite.getX();
                var dY = script.y - sprite.getY();
                dX /= script.frameCount;
                dY /= script.frameCount;
                sprite.setX(sprite.getX() + dX);
                sprite.setY(sprite.getY() + dY);
                script.frameCount--;
                if (sprite.brush && !sprite.brush.stop) {
                    sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                }
            }
        },
        syntax: { js: [], py: ['Entry.set_xy_for_sec(%2, %3, %1)'] },
    },
    rotate_by_angle: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_by_angle',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setRotation(sprite.getRotation() + value);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_by_angle_dropdown: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['45', '45'],
                    ['90', '90'],
                    ['135', '135'],
                    ['180', '180'],
                ],
                value: '45',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: ['45', null],
            type: 'rotate_by_angle_dropdown',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'ebs',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getField('VALUE', script);
            sprite.setRotation(sprite.getRotation() + Number(value));
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_angle: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'see_angle',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setDirection(value);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sprites',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            var targetEntity = Entry.container.getEntity(targetId);
            var deltaX = targetEntity.getX() - sprite.getX();
            var deltaY = targetEntity.getY() - sprite.getY();
            if (deltaX >= 0) {
                sprite.setRotation(
                    Math.atan(deltaY / deltaX) / Math.PI * 180 + 90
                );
            } else {
                sprite.setRotation(
                    Math.atan(deltaY / deltaX) / Math.PI * 180 + 270
                );
            }
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    locate_xy: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['0'],
                },
                {
                    type: 'number',
                    params: ['0'],
                },
                null,
            ],
            type: 'locate_xy',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
            ],
            type: 'locate_xy',
        },
        paramsKeyMap: {
            VALUE1: 0,
            VALUE2: 1,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            var value1 = script.getNumberValue('VALUE1', script);
            var value2 = script.getNumberValue('VALUE2', script);
            sprite.setX(value1);
            sprite.setY(value2);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_xy(%1, %2)'] },
    },
    locate_x: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'locate_x',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'locate_x',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setX(value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_x(%1)'] },
    },
    locate_y: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'locate_y',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'locate_y',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            //sprite.y = 340 - value;
            sprite.setY(value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_y(%1)'] },
    },
    locate: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'spritesWithMouse',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_MOVING,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'locate',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'locate',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            var x, y;
            if (targetId == 'mouse') {
                x = Entry.stage.mouseCoordinate.x;
                y = Entry.stage.mouseCoordinate.y;
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                x = targetEntity.getX();
                y = targetEntity.getY();
            }
            sprite.setX(Number(x));
            sprite.setY(Number(y));
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(x, y * -1);
            }
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.move_to(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'spritesWithMouse',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_MOVING,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap: 'Entry.CodeMap.Entry.locate[0]',
                        },
                    ],
                },
            ],
        },
    },
    move_xy_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                {
                    type: 'number',
                    params: ['10'],
                },
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'move_xy_time',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['C&value'],
                },
                {
                    type: 'number',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'move_xy_time',
        },
        paramsKeyMap: {
            VALUE1: 0,
            VALUE2: 1,
            VALUE3: 2,
        },
        class: 'move_relative',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('VALUE1', script);
                var xValue = script.getNumberValue('VALUE2', script);
                var yValue = script.getNumberValue('VALUE3', script);
                script.isStart = true;
                script.frameCount = Math.max(
                    Math.floor(timeValue * Entry.FPS),
                    1
                );
                script.dX = xValue / script.frameCount;
                script.dY = yValue / script.frameCount;

                if (script.frameCount == 1) action();
            }

            if (script.frameCount != 0) {
                action();
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }

            function action() {
                sprite.setX(sprite.getX() + script.dX);
                sprite.setY(sprite.getY() + script.dY);
                script.frameCount--;
                if (sprite.brush && !sprite.brush.stop) {
                    sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                }
            }
        },
        syntax: { js: [], py: ['Entry.add_xy_for_sec(%2, %3, %1)'] },
    },
    rotate_by_angle_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'angle',
                params: ['90'],
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                null,
            ],
            type: 'rotate_by_angle_time',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('VALUE', script);
                var angleValue = script.getNumberField('VALUE', script);
                script.isStart = true;
                script.frameCount = Math.floor(timeValue * Entry.FPS);
                script.dAngle = angleValue / script.frameCount;
            }
            if (script.frameCount != 0) {
                sprite.setRotation(sprite.getRotation() + script.dAngle);
                script.frameCount--;
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    bounce_wall: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'bounce_wall',
        },
        class: 'walk',
        isNotFor: [],
        func: function(sprite, script) {
            var threshold = 0;

            var method = sprite.parent.getRotateMethod();
            /*
           var bound = sprite.object.getTransformedBounds();
           var size = {};
           size.width = bound.width * Math.sqrt(1.0 + (bound.height/bound.width) * (bound.height/bound.width));
           size.height = bound.height * Math.sqrt(1.0 + (bound.width/bound.height) * (bound.width/bound.height));
           */

            if (method == 'free')
                var angle = (sprite.getRotation() + sprite.getDirection()).mod(
                    360
                );
            else var angle = sprite.getDirection();

            var skip = Entry.Utils.COLLISION.NONE;
            if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
                skip = sprite.collision == Entry.Utils.COLLISION.UP;
                var up = ndgmr.checkPixelCollision(
                    Entry.stage.wall.up,
                    sprite.object,
                    threshold,
                    false
                );
                if (!up && skip) sprite.collision = Entry.Utils.COLLISION.NONE;

                if (up && skip) up = false;

                if (up) {
                    if (method == 'free')
                        sprite.setRotation(
                            -sprite.getRotation() -
                                sprite.getDirection() * 2 +
                                180
                        );
                    else sprite.setDirection(-sprite.getDirection() + 180);

                    sprite.collision = Entry.Utils.COLLISION.UP;
                    //sprite.setY(135 - bound.height/2 - 1);
                } else {
                    skip = sprite.collision == Entry.Utils.COLLISION.DOWN;
                    var down = ndgmr.checkPixelCollision(
                        Entry.stage.wall.down,
                        sprite.object,
                        threshold,
                        false
                    );
                    if (!down && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (down && skip) down = false;

                    if (down) {
                        if (method == 'free')
                            sprite.setRotation(
                                -sprite.getRotation() -
                                    sprite.getDirection() * 2 +
                                    180
                            );
                        else sprite.setDirection(-sprite.getDirection() + 180);

                        sprite.collision = Entry.Utils.COLLISION.DOWN;
                        //sprite.setY(-135 + bound.height/2 + 1);
                    }
                }
            } else if (angle < 270 && angle >= 90) {
                skip = sprite.collision == Entry.Utils.COLLISION.DOWN;
                var down = ndgmr.checkPixelCollision(
                    Entry.stage.wall.down,
                    sprite.object,
                    threshold,
                    false
                );
                if (!down && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (down && skip) down = false;

                if (down) {
                    if (method == 'free')
                        sprite.setRotation(
                            -sprite.getRotation() -
                                sprite.getDirection() * 2 +
                                180
                        );
                    else sprite.setDirection(-sprite.getDirection() + 180);

                    sprite.collision = Entry.Utils.COLLISION.DOWN;
                    //sprite.setY(-135 + bound.height/2 + 1);
                } else {
                    skip = sprite.collision == Entry.Utils.COLLISION.UP;
                    var up = ndgmr.checkPixelCollision(
                        Entry.stage.wall.up,
                        sprite.object,
                        threshold,
                        false
                    );
                    if (!up && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (up && skip) up = false;

                    if (up) {
                        if (method == 'free')
                            sprite.setRotation(
                                -sprite.getRotation() -
                                    sprite.getDirection() * 2 +
                                    180
                            );
                        else sprite.setDirection(-sprite.getDirection() + 180);

                        sprite.collision = Entry.Utils.COLLISION.UP;
                        //sprite.setY(135 - bound.height/2 - 1);
                    }
                }
            }
            if (angle < 360 && angle >= 180) {
                skip = sprite.collision == Entry.Utils.COLLISION.LEFT;
                var left = ndgmr.checkPixelCollision(
                    Entry.stage.wall.left,
                    sprite.object,
                    threshold,
                    false
                );
                if (!left && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (left && skip) left = false;

                if (left) {
                    if (method == 'free')
                        sprite.setRotation(
                            -sprite.getRotation() - sprite.getDirection() * 2
                        );
                    else sprite.setDirection(-sprite.getDirection() + 360);

                    sprite.collision = Entry.Utils.COLLISION.LEFT;
                    //sprite.setX(-240 + bound.width/2 + 1);
                } else {
                    skip = sprite.collision == Entry.Utils.COLLISION.RIGHT;
                    var right = ndgmr.checkPixelCollision(
                        Entry.stage.wall.right,
                        sprite.object,
                        threshold,
                        false
                    );
                    if (!right && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (right && skip) right = false;

                    if (right) {
                        if (method == 'free')
                            sprite.setRotation(
                                -sprite.getRotation() -
                                    sprite.getDirection() * 2
                            );
                        else sprite.setDirection(-sprite.getDirection() + 360);

                        sprite.collision = Entry.Utils.COLLISION.RIGHT;
                        //sprite.setX(240 - bound.width/2 - 1);
                    }
                }
            } else if (angle < 180 && angle >= 0) {
                skip = sprite.collision == Entry.Utils.COLLISION.RIGHT;
                var right = ndgmr.checkPixelCollision(
                    Entry.stage.wall.right,
                    sprite.object,
                    threshold,
                    false
                );
                if (!right && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (right && skip) right = false;

                if (right) {
                    if (method == 'free')
                        sprite.setRotation(
                            -sprite.getRotation() - sprite.getDirection() * 2
                        );
                    else sprite.setDirection(-sprite.getDirection() + 360);

                    sprite.collision = Entry.Utils.COLLISION.RIGHT;
                    //sprite.setX(240 - bound.width/2 - 1);
                } else {
                    skip = sprite.collision == Entry.Utils.COLLISION.LEFT;
                    var left = ndgmr.checkPixelCollision(
                        Entry.stage.wall.left,
                        sprite.object,
                        threshold,
                        false
                    );
                    if (!left && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (left && skip) left = false;

                    if (left) {
                        if (method == 'free')
                            sprite.setRotation(
                                -sprite.getRotation() -
                                    sprite.getDirection() * 2
                            );
                        else sprite.setDirection(-sprite.getDirection() + 360);

                        sprite.collision = Entry.Utils.COLLISION.LEFT;
                        //sprite.setX(-240 + bound.width/2 + 1);
                    }
                }
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.bounce_on_edge()'] },
    },
    flip_arrow_horizontal: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    flip_arrow_vertical: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    see_angle_object: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'spritesWithMouse',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_MOVING,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'see_angle_object',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'see_angle_object',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            var targetId = script.getField('VALUE', script);
            var spriteX = sprite.getX();
            var spriteY = sprite.getY();
            var deltaX, deltaY, value;

            if (sprite.parent.id == targetId) return script.callReturn();

            if (targetId == 'mouse') {
                var mX = Entry.stage.mouseCoordinate.x;
                var mY = Entry.stage.mouseCoordinate.y;

                deltaX = mX - spriteX;
                deltaY = mY - spriteY;
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                deltaX = targetEntity.getX() - spriteX;
                deltaY = targetEntity.getY() - spriteY;
            }

            if (deltaX === 0 && deltaY === 0) {
                value = sprite.getDirection() + sprite.getRotation();
            } else if (deltaX >= 0) {
                value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
            } else {
                value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
            }
            var nativeDirection = sprite.getDirection() + sprite.getRotation();
            sprite.setRotation(sprite.getRotation() + value - nativeDirection);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.look_at(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'spritesWithMouse',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_MOVING,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap: 'Entry.CodeMap.Entry.see_angle_object[0]',
                        },
                    ],
                },
            ],
        },
    },
    see_angle_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'see_angle_direction',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            var nativeDirection = sprite.getDirection() + sprite.getRotation();
            sprite.setRotation(sprite.getRotation() + value - nativeDirection);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    rotate_direction: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_direction',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            sprite.setDirection(value + sprite.getDirection());
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    locate_object_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'spritesWithMouse',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_MOVING,
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                null,
                null,
            ],
            type: 'locate_object_time',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['B&value'],
                },
                'A&value',
            ],
            type: 'locate_object_time',
        },
        paramsKeyMap: {
            VALUE: 0,
            TARGET: 1,
        },
        class: 'move_absolute',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue, xValue, yValue;
                var targetId = script.getField('TARGET', script);
                timeValue = script.getNumberValue('VALUE', script);
                var frameCount = Math.floor(timeValue * Entry.FPS);
                var mouseCoordi = Entry.stage.mouseCoordinate;

                if (frameCount != 0) {
                    if (targetId == 'mouse') {
                        xValue = mouseCoordi.x - sprite.getX();
                        yValue = mouseCoordi.y - sprite.getY();
                    } else {
                        var targetEntity = Entry.container.getEntity(targetId);
                        xValue = targetEntity.getX() - sprite.getX();
                        yValue = targetEntity.getY() - sprite.getY();
                    }
                    script.isStart = true;
                    script.frameCount = frameCount;
                    script.dX = xValue / script.frameCount;
                    script.dY = yValue / script.frameCount;
                } else {
                    //frame count is zero so execute immediately
                    if (targetId == 'mouse') {
                        xValue = Number(mouseCoordi.x);
                        yValue = Number(mouseCoordi.y);
                    } else {
                        var targetEntity = Entry.container.getEntity(targetId);
                        xValue = targetEntity.getX();
                        yValue = targetEntity.getY();
                    }
                    sprite.setX(xValue);
                    sprite.setY(yValue);
                    if (sprite.brush && !sprite.brush.stop) {
                        sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                    }
                    return script.callReturn();
                }
            }
            if (script.frameCount != 0) {
                sprite.setX(sprite.getX() + script.dX);
                sprite.setY(sprite.getY() + script.dY);
                script.frameCount--;
                if (sprite.brush && !sprite.brush.stop)
                    sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.move_to_for_sec(%2, %1)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'spritesWithMouse',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_MOVING,
                            converter: Entry.block.converters.returnStringKey,
                            codeMap:
                                'Entry.CodeMap.Entry.locate_object_time[1]',
                        },
                    ],
                },
            ],
        },
    },
    rotate_absolute: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_absolute',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'angle',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'rotate_absolute',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate_absolute',
        isNotFor: [],
        func: function(entity, script) {
            var value = script.getNumberValue('VALUE', script);
            entity.setRotation(value);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_rotation(%1)'] },
    },
    rotate_relative: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
                defaultType: 'angle',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_relative',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'angle',
                    params: ['A&value'],
                },
            ],
            type: 'rotate_relative',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(entity, script) {
            var value = script.getNumberValue('VALUE', script);
            entity.setRotation(value + entity.getRotation());
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_rotation(%1)'] },
    },
    direction_absolute: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'direction_absolute',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'angle',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'direction_absolute',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate_absolute',
        isNotFor: [],
        func: function(entity, script) {
            var value = script.getNumberValue('VALUE', script);
            entity.setDirection(value);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_direction(%1)'] },
    },
    direction_relative: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'direction_relative',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'angle',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'direction_relative',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(entity, script) {
            var value = script.getNumberValue('VALUE', script);
            entity.setDirection(value + entity.getDirection());
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_direction(%1)'] },
    },
    move_to_angle: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'angle',
                    params: ['90'],
                },
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'move_to_angle',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'angle',
                    params: ['B&value'],
                },
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'move_to_angle',
        },
        paramsKeyMap: {
            ANGLE: 0,
            VALUE: 1,
        },
        class: 'move_rotate',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            var angle = script.getNumberValue('ANGLE', script);
            sprite.setX(
                sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI)
            );
            sprite.setY(
                sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI)
            );
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.move_to_degree(%2, %1)'] },
    },
    rotate_by_time: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['2'],
                },
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'rotate_by_time',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['B&value'],
                },
                {
                    type: 'angle',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'rotate_by_time',
        },
        paramsKeyMap: {
            VALUE: 0,
            ANGLE: 1,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('VALUE', script);
                var angleValue = script.getNumberValue('ANGLE', script);
                script.isStart = true;
                script.frameCount = Math.max(
                    Math.floor(timeValue * Entry.FPS),
                    1
                );
                script.dAngle = angleValue / script.frameCount;

                if (script.frameCount == 1) action();
            }
            if (script.frameCount != 0) {
                action();
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }

            function action() {
                sprite.setRotation(sprite.getRotation() + script.dAngle);
                script.frameCount--;
            }
        },
        syntax: { js: [], py: ['Entry.add_rotation_for_sec(%2, %1)'] },
    },
    direction_relative_duration: {
        color: '#A751E3',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                defaultType: 'angle',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/moving_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: ['2'],
                },
                {
                    type: 'angle',
                    params: ['90'],
                },
                null,
            ],
            type: 'direction_relative_duration',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['B&value'],
                },
                {
                    type: 'angle',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'direction_relative_duration',
        },
        paramsKeyMap: {
            DURATION: 0,
            AMOUNT: 1,
        },
        class: 'rotate',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue('DURATION', script);
                var directionValue = script.getNumberValue('AMOUNT', script);
                script.isStart = true;
                script.frameCount = Math.max(
                    Math.floor(timeValue * Entry.FPS),
                    1
                );
                script.dDirection = directionValue / script.frameCount;

                if (script.frameCount == 1) action();
            }
            if (script.frameCount != 0) {
                action();
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                delete script.dDirection;
                return script.callReturn();
            }

            function action() {
                sprite.setDirection(sprite.getDirection() + script.dDirection);
                script.frameCount--;
            }
        },
        syntax: { js: [], py: ['Entry.add_direction_for_sec(%2, %1)'] },
    },
    //endregion basic 기본
    //region basic 기본
    when_scene_start: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_scene_1_2.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'when_scene_start',
        },
        class: 'scene',
        isNotFor: ['scene'],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'when_scene_start',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_start_scene():',
                    blockType: 'event',
                },
            ],
        },
    },
    start_scene: {
        color: '#3BBD70',
        skeleton: 'basic_without_next',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'scenes',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_START,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'start_scene',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'start_scene',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'scene',
        isNotFor: ['scene'],
        func: function(sprite, script) {
            var value = script.getField('VALUE', script);
            var scene = Entry.scene.getSceneById(value);
            if (scene) {
                Entry.scene.selectScene(scene);
                Entry.engine.fireEvent('when_scene_start');
            }
            return null;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.start_scene(%1)',
                    blockType: 'last',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'scenes',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_START,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    start_neighbor_scene: {
        color: '#3BBD70',
        skeleton: 'basic_without_next',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.SCENE_start_scene_next, 'next'],
                    [Lang.Blocks.SCENE_start_scene_pre, 'pre'],
                ],
                value: 'next',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_START,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'start_neighbor_scene',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'start_neighbor_scene',
        },
        paramsKeyMap: {
            OPERATOR: 0,
        },
        class: 'scene',
        isNotFor: ['scene'],
        func: function(sprite, script) {
            var currentScene = Entry.scene.selectedScene;
            var scenes = Entry.scene.getScenes();
            var index = scenes.indexOf(currentScene);
            var o = script.getField('OPERATOR', script);
            if (o == 'next') {
                if (index + 1 < scenes.length) {
                    var nextScene = Entry.scene.getSceneById(
                        scenes[index + 1].id
                    );
                    if (nextScene) {
                        Entry.scene.selectScene(nextScene);
                        Entry.engine.fireEvent('when_scene_start');
                    }
                }
            } else {
                if (index > 0) {
                    var nextScene = Entry.scene.getSceneById(
                        scenes[index - 1].id
                    );
                    if (nextScene) {
                        Entry.scene.selectScene(nextScene);
                        Entry.engine.fireEvent('when_scene_start');
                    }
                }
            }
            return null;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.start_scene_of(%1)',
                    blockType: 'last',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.SCENE_start_scene_next, 'next'],
                                [Lang.Blocks.SCENE_start_scene_pre, 'pre'],
                            ],
                            value: 'next',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_START,
                            converter: Entry.block.converters.returnStringValue,
                            codeMap:
                                'Entry.CodeMap.Entry.start_neighbor_scene[0]',
                        },
                    ],
                },
            ],
        },
    },
    sound_something: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'sound_something',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getField('VALUE', script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist) createjs.Sound.play(soundId);
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_second: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getField('VALUE', script);
            var timeValue = script.getNumberValue('SECOND', script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist) {
                var instance = createjs.Sound.play(soundId);
                Entry.Utils.addSoundInstances(instance);
                setTimeout(function() {
                    instance.stop();
                }, timeValue * 1000);
            }
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_wait: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null],
            type: 'sound_something_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField('VALUE', script);
                var sound = sprite.parent.getSound(soundId);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    Entry.Utils.addSoundInstances(instance);
                    setTimeout(function() {
                        script.playState = 0;
                    }, sound.duration * 1000);
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.playState;
                delete script.isPlay;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    sound_something_second_wait: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField('VALUE', script);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    var timeValue = script.getNumberValue('SECOND', script);
                    Entry.Utils.addSoundInstances(instance);
                    setTimeout(function() {
                        instance.stop();
                        script.playState = 0;
                    }, timeValue * 1000);
                    instance.addEventListener('complete', function(e) {});
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        },
        syntax: { js: [], py: [''] },
    },
    sound_volume_change: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'sound_volume_change',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'sound_volume_change',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound_volume',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script) / 100;
            value = value + createjs.Sound.getVolume();
            if (value > 1) value = 1;
            if (value < 0) value = 0;
            createjs.Sound.setVolume(value);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.add_sound_volume(%1)'] },
    },
    sound_volume_set: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'number',
                    params: ['10'],
                },
                null,
            ],
            type: 'sound_volume_set',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'sound_volume_set',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound_volume',
        isNotFor: [],
        func: function(sprite, script) {
            var value = script.getNumberValue('VALUE', script) / 100;
            if (value > 1) value = 1;
            if (value < 0) value = 0;
            createjs.Sound.setVolume(value);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.set_sound_volume(%1)'] },
    },
    sound_silent_all: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'sound_silent_all',
        },
        class: 'sound_stop',
        isNotFor: [],
        func: function(sprite, script) {
            createjs.Sound.stop();
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.stop_sound()'] },
    },
    get_sounds: {
        color: '#A4D01D',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sounds',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_SOUNDS,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'get_sounds',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        func: function(sprite, script) {
            return script.getStringField('VALUE');
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'sounds',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_SOUNDS,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                    keyOption: 'get_sounds',
                },
            ],
        },
    },
    sound_something_with_block: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                },
                null,
            ],
            type: 'sound_something_with_block',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'sound_something_with_block',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound_play',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getStringValue('VALUE', script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) {
                Entry.Utils.addSoundInstances(createjs.Sound.play(sound.id));
            }

            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.play_sound(%1)',
                },
            ],
        },
    },
    sound_something_second_with_block: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                    id: '95dw',
                },
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second_with_block',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'sound_something_second_with_block',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound_play',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getStringValue('VALUE', script);
            var timeValue = script.getNumberValue('SECOND', script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) {
                Entry.Utils.addSoundInstances(
                    createjs.Sound.play(sound.id, {
                        startTime: 0,
                        duration: timeValue * 1000,
                    })
                );
            }
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.play_sound_for_sec(%1, %2)',
                },
            ],
        },
    },
    sound_something_wait_with_block: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                },
                null,
            ],
            type: 'sound_something_wait_with_block',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'sound_something_wait_with_block',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'sound_wait',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue('VALUE', script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var instance = createjs.Sound.play(sound.id);
                    Entry.Utils.addSoundInstances(instance);
                    setTimeout(function() {
                        script.playState = 0;
                    }, sound.duration * 1000);
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.playState;
                delete script.isPlay;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.play_sound_and_wait(%1)',
                },
            ],
        },
    },
    sound_something_second_wait_with_block: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                },
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
            ],
            type: 'sound_something_second_wait_with_block',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                {
                    type: 'number',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'sound_something_second_wait_with_block',
        },
        paramsKeyMap: {
            VALUE: 0,
            SECOND: 1,
        },
        class: 'sound_wait',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue('VALUE', script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var instance = createjs.Sound.play(sound.id);
                    var timeValue = script.getNumberValue('SECOND', script);
                    setTimeout(function() {
                        instance.stop();
                        script.playState = 0;
                    }, timeValue * 1000);
                    instance.addEventListener('complete', function(e) {});
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.play_sound_for_sec_and_wait(%1, %2)',
                },
            ],
        },
    },
    sound_from_to: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                },
                {
                    type: 'text',
                    params: ['1'],
                },
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'sound_from_to',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                {
                    type: 'text',
                    params: ['B&value'],
                },
                {
                    type: 'text',
                    params: ['C&value'],
                },
                null,
            ],
            type: 'sound_from_to',
        },
        paramsKeyMap: {
            VALUE: 0,
            START: 1,
            END: 2,
        },
        class: 'sound_play',
        isNotFor: [],
        func: function(sprite, script) {
            var soundId = script.getStringValue('VALUE', script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) {
                var start = script.getNumberValue('START', script) * 1000;
                var end = script.getNumberValue('END', script) * 1000;
                createjs.Sound.play(sound.id, {
                    startTime: Math.min(start, end),
                    duration: Math.max(start, end) - Math.min(start, end),
                });
            }
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: 'Entry.play_sound_from_to(%1, %2, %3)',
                },
            ],
        },
    },
    sound_from_to_and_wait: {
        color: '#A4D01D',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/sound_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'get_sounds',
                },
                {
                    type: 'text',
                    params: ['1'],
                },
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'sound_from_to_and_wait',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'get_sounds',
                    params: ['A&value'],
                },
                {
                    type: 'text',
                    params: ['B&value'],
                },
                {
                    type: 'text',
                    params: ['C&value'],
                },
                null,
            ],
            type: 'sound_from_to_and_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
            START: 1,
            END: 2,
        },
        class: 'sound_wait',
        isNotFor: [],
        func: function(sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue('VALUE', script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var start = script.getNumberValue('START', script) * 1000;
                    var end = script.getNumberValue('END', script) * 1000;
                    var startValue = Math.min(start, end);
                    var endValue = Math.max(start, end);
                    var duration = endValue - startValue;

                    createjs.Sound.play(sound.id, {
                        startTime: startValue,
                        duration: duration,
                    });

                    setTimeout(function() {
                        script.playState = 0;
                    }, duration);
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        },
        syntax: {
            js: [],
            py: ['Entry.play_sound_from_to_and_wait(%1, %2, %3)'],
        },
    },
    when_run_button_click: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_play.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'when_run_button_click',
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'start',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_start():',
                    blockType: 'event',
                },
            ],
        },
    },
    press_some_key: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_keyboard.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                type: 'Dropdown',
                options: [
                    ['q', '81'],
                    ['w', '87'],
                    ['e', '69'],
                    ['r', '82'],
                    ['a', '65'],
                    ['s', '83'],
                    ['d', '68'],
                    ['위쪽 화살표', '38'],
                    ['아래쪽 화살표', '40'],
                    ['왼쪽 화살표', '37'],
                    ['오른쪽 화살표', '39'],
                    ['엔터', '13'],
                    ['스페이스', '32'],
                ],
                value: '81',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, null, null],
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        func: function(sprite, script) {
            return script.callReturn();
        },
        syntax: { js: [], py: [''] },
    },
    when_some_key_pressed: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_keyboard.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                type: 'Keyboard',
                value: '81',
            },
        ],
        events: {},
        def: {
            params: [null, '81'],
            type: 'when_some_key_pressed',
        },
        pyHelpDef: {
            params: [null, 'A&value'],
            type: 'when_some_key_pressed',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'keyPress',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_press_key(%2):',
                    passTest: true,
                    blockType: 'event',
                    textParams: [
                        undefined,
                        {
                            type: 'Keyboard',
                            value: '81',
                            converter: Entry.block.converters.keyboardCode1,
                        },
                    ],
                },
            ],
        },
    },
    mouse_clicked: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_mouse.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'mouse_clicked',
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'mouse_clicked',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_click_mouse_on():',
                    blockType: 'event',
                },
            ],
        },
    },
    mouse_click_cancled: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_mouse.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'mouse_click_cancled',
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'mouse_click_cancled',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_click_mouse_off():',
                    blockType: 'event',
                },
            ],
        },
    },
    when_object_click: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_mouse.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'when_object_click',
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'when_object_click',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_click_object_on():',
                    blockType: 'event',
                },
            ],
        },
    },
    when_object_click_canceled: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_mouse.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'when_object_click_canceled',
        },
        class: 'event',
        isNotFor: [],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'when_object_click_canceled',
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_click_object_off():',
                    blockType: 'event',
                },
            ],
        },
    },
    when_some_key_click: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_keyboard.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'keyPress',
        syntax: { js: [], py: ['Entry.on_key_press_down(%1)'] },
    },
    when_message_cast: {
        color: '#3BBD70',
        skeleton: 'basic_event',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/start_icon_signal.png',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'messages',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_START,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                },
            ],
            viewDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'when_message_cast',
        },
        pyHelpDef: {
            params: [null, 'A&value'],
            type: 'when_message_cast',
        },
        paramsKeyMap: {
            VALUE: 1,
        },
        class: 'message',
        isNotFor: ['message'],
        func: function(sprite, script) {
            return script.callReturn();
        },
        event: 'when_message_cast',

        //"syntax": {"js": [], "py": ["def entry_event_signal():\n\tif signal == %2:"]}
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'def when_get_signal(%2):',
                    blockType: 'event',
                    passTest: true,
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'messages',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_START,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    message_cast: {
        color: '#3BBD70',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'messages',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_START,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                },
            ],
            viewDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'message_cast',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'message_cast',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'message',
        isNotFor: ['message'],
        func: function(sprite, script) {
            var value = script.getField('VALUE', script);

            var arr = Entry.variableContainer.messages_;
            var isExist = Entry.isExist(value, 'id', arr);

            if (value == 'null' || !isExist)
                throw new Error('value can not be null or undefined');

            setTimeout(function() {
                Entry.engine.raiseMessage(value);
            });
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.send_signal(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'messages',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_START,
                            converter: Entry.block.converters.returnStringKey,
                            paramType: 'signal',
                        },
                        undefined,
                    ],
                },
            ],
        },
    },
    message_cast_wait: {
        color: '#3BBD70',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'messages',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_START,
            },
            {
                type: 'Indicator',
                img: 'block_icon/start_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'message_cast_wait',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'message_cast_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'message',
        isNotFor: ['message'],
        func: function(sprite, script) {
            if (script.runningScript) {
                var runningScript = script.runningScript;
                var length = runningScript.length;
                for (var i = 0; i < length; i++) {
                    var executor = runningScript.shift();
                    if (executor && !executor.isEnd())
                        runningScript.push(executor);
                }
                if (runningScript.length) {
                    return script;
                } else {
                    return script.callReturn();
                }
            } else {
                var value = script.getField('VALUE', script);
                var arr = Entry.variableContainer.messages_;
                var isExist = Entry.isExist(value, 'id', arr);
                if (value == 'null' || !isExist)
                    throw new Error('value can not be null or undefined');
                var data = Entry.engine.raiseMessage(value);
                var runningScript = [];
                while (data.length) {
                    var executor = data.shift();
                    if (executor)
                        runningScript = runningScript.concat(executor);
                }

                script.runningScript = runningScript;
                return script;
            }
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.send_signal_wait(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'messages',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_START,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    text: {
        color: '#FFD974',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 10,
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'text',
        },
        paramsKeyMap: {
            NAME: 0,
        },
        func: function(sprite, script) {
            return script.getField('NAME', script);
        },
        isPrimitive: true,
        syntax: {
            js: ['Scope', '%1'],
            py: [
                {
                    syntax: '%1',
                    keyOption: 'text',
                    textParams: [
                        {
                            type: 'TextInput',
                            converter:
                                Entry.block.converters
                                    .returnStringOrNumberByValue,
                        },
                    ],
                },
            ],
        },
    },
    text_write: {
        color: '#FFCA36',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/text.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'text_write',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'text_write',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'text',
        isNotFor: ['sprite'],
        func: function(sprite, script) {
            var text = script.getStringValue('VALUE', script);
            sprite.setText(text);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.write_text(%1)'] },
    },
    text_append: {
        color: '#FFCA36',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/text.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'text_append',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'text_append',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'text',
        isNotFor: ['sprite'],
        func: function(sprite, script) {
            var text = script.getStringValue('VALUE', script);
            sprite.setText(sprite.getText() + '' + text);
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.append_text(%1)'] },
    },
    text_prepend: {
        color: '#FFCA36',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/text.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.entry],
                },
                null,
            ],
            type: 'text_prepend',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'text_prepend',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'text',
        isNotFor: ['sprite'],
        func: function(sprite, script) {
            var text = script.getStringValue('VALUE', script);
            sprite.setText(text + '' + sprite.getText());
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.prepend_text(%1)'] },
    },
    text_flush: {
        color: '#FFCA36',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Indicator',
                img: 'block_icon/text.png',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'text_flush',
        },
        class: 'text',
        isNotFor: ['sprite'],
        func: function(sprite, script) {
            sprite.setText('');
            return script.callReturn();
        },
        syntax: { js: [], py: ['Entry.clear_text()'] },
    },
    variableAddButton: {
        skeleton: 'basic_button',
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Workspace.variable_create,
                color: '#333',
                align: 'center',
            },
        ],
        def: {
            type: 'variableAddButton',
        },
        events: {
            mousedown: [
                function() {
                    Entry.variableContainer.openVariableAddPanel('variable');
                },
            ],
        },
        syntax: { js: [], py: [''] },
    },
    listAddButton: {
        skeleton: 'basic_button',
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: Lang.Workspace.create_list_block,
                color: '#333',
                align: 'center',
            },
        ],
        def: {
            type: 'listAddButton',
        },
        events: {
            mousedown: [
                function() {
                    Entry.variableContainer.openVariableAddPanel('list');
                },
            ],
        },
    },
    change_variable: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'variables',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_variable',
        },
        pyHelpDef: {
            params: [
                'A&value',
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'change_variable',
        },
        paramsKeyMap: {
            VARIABLE: 0,
            VALUE: 1,
        },
        class: 'variable',
        isNotFor: ['variableNotExist'],
        func: function(sprite, script) {
            var variableId = script.getField('VARIABLE', script);
            var value = script.getValue('VALUE', script);
            var fixed = 0;

            if (value == false && typeof value == 'boolean')
                throw new Error('Type is not correct');

            var variable = Entry.variableContainer.getVariable(
                variableId,
                sprite
            );
            var variableValue = variable.getValue();
            var sumValue;
            if (Entry.Utils.isNumber(value) && variable.isNumber()) {
                value = Entry.parseNumber(value);
                variableValue = Entry.parseNumber(variableValue);
                fixed = Entry.getMaxFloatPoint([value, variable.getValue()]);
                sumValue = new BigNumber(value)
                    .plus(variableValue)
                    .toNumber()
                    .toFixed(fixed);
            } else {
                sumValue = '' + variableValue + value;
            }

            variable.setValue(sumValue);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1 += %2',
                    passTest: true,
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
                {
                    syntax: '%1 = %1 + %2',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    set_variable: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'variables',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'set_variable',
        },
        pyHelpDef: {
            params: [
                'A&value',
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'set_variable',
        },
        paramsKeyMap: {
            VARIABLE: 0,
            VALUE: 1,
        },
        class: 'variable',
        isNotFor: ['variableNotExist'],
        func: function(sprite, script) {
            var variableId = script.getField('VARIABLE', script);
            var value = script.getValue('VALUE', script);
            var variable = Entry.variableContainer.getVariable(
                variableId,
                sprite
            );
            variable.setValue(value);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1 = %2',
                    passTest: true,
                    blockType: 'variable',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    show_variable: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'variables',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'show_variable',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'show_variable',
        },
        paramsKeyMap: {
            VARIABLE: 0,
        },
        class: 'variable_visibility',
        isNotFor: ['variableNotExist'],
        func: function(sprite, script) {
            var variableId = script.getField('VARIABLE', script);
            var variable = Entry.variableContainer.getVariable(
                variableId,
                sprite
            );
            variable.setVisible(true);
            variable.updateView();
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.show_variable(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    hide_variable: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'variables',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'hide_variable',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'hide_variable',
        },
        paramsKeyMap: {
            VARIABLE: 0,
        },
        class: 'variable_visibility',
        isNotFor: ['variableNotExist'],
        func: function(sprite, script) {
            var variableId = script.getField('VARIABLE', script);
            var variable = Entry.variableContainer.getVariable(
                variableId,
                sprite
            );
            variable.setVisible(false);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.hide_variable(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    get_variable: {
        color: '#E457DC',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'variables',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_get_variable_1,
                color: 'white',
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null],
            type: 'get_variable',
        },
        pyHelpDef: {
            params: ['A&value'],
            type: 'get_variable',
        },
        paramsKeyMap: {
            VARIABLE: 0,
        },
        class: 'variable',
        isNotFor: ['variableNotExist'],
        func: function(sprite, script) {
            var variableId = script.getField('VARIABLE', script);
            var variable = Entry.variableContainer.getVariable(
                variableId,
                sprite
            );
            return variable.getValue();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1',
                    passTest: true,
                    keyOption: 'get_variable',
                    blockType: 'param',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'variables',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                    ],
                },
            ],
        },
    },
    ask_and_wait: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.container) Entry.container.showProjectAnswer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.container)
                        Entry.container.hideProjectAnswer(
                            block,
                            notIncludeSelf
                        );
                },
            ],
        },
        def: {
            params: [
                {
                    type: 'text',
                    params: [Lang.Blocks.block_hi],
                },
                null,
            ],
            type: 'ask_and_wait',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'ask_and_wait',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'ask',
        isNotFor: [],
        func: function(sprite, script) {
            var inputModel = Entry.container.inputValue,
                inputView = Entry.stage.inputField,
                /*message = script.getValue("VALUE", script);

            if (!message)
                throw new Error('message can not be empty');

            if (inputModel.sprite == sprite &&
                inputView && !inputView._isHidden) {
                    return script;
                } else if (inputModel.sprite != sprite && script.isInit) {
                    if(sprite.dialog)
                        sprite.dialog.remove();
                    delete script.isInit;
                    return script.callReturn();
                } else if (inputModel.complete &&
                           inputModel.sprite == sprite &&
                           inputView._isHidden && script.isInit) {
                               if(sprite.dialog)
                                   sprite.dialog.remove();
                               delete inputModel.complete;
                               delete script.isInit;
                               return script.callReturn();
                           } else {
                               message = Entry.convertToRoundedDecimals(message, 3);
                               new Entry.Dialog(sprite, message, 'speak');
                               Entry.stage.showInputField();
                               inputModel.script = script;
                               inputModel.sprite = sprite;
                               script.isInit = true;
                               return script;
                           }*/

                message = script.getValue('VALUE', script);

            if (!message) throw new Error('message can not be empty');

            if (
                inputModel.sprite == sprite &&
                inputView &&
                !inputView._isHidden
            ) {
                return script;
            } else if (inputModel.sprite != sprite && script.isInit) {
                if (sprite.dialog) sprite.dialog.remove();
                delete script.isInit;
                return script.callReturn();
            } else if (
                inputModel.complete &&
                inputModel.sprite == sprite &&
                inputView._isHidden &&
                script.isInit
            ) {
                if (sprite.dialog) sprite.dialog.remove();
                delete inputModel.complete;
                delete script.isInit;
                return script.callReturn();
            } else {
                message = Entry.convertToRoundedDecimals(message, 3);
                Entry.stage.showInputField();
                new Entry.Dialog(sprite, message, 'ask');
                inputModel.script = script;
                inputModel.sprite = sprite;
                inputModel.complete = false;
                script.isInit = true;
                return script;
            }
        },
        syntax: { js: [], py: ['Entry.input(%1)'] },
    },
    get_canvas_input_value: {
        color: '#E457DC',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_get_canvas_input_value,
                color: '#fff',
            },
        ],
        events: {
            viewAdd: [
                function() {
                    if (Entry.container) Entry.container.showProjectAnswer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.container)
                        Entry.container.hideProjectAnswer(
                            block,
                            notIncludeSelf
                        );
                },
            ],
        },
        def: {
            params: [null],
            type: 'get_canvas_input_value',
        },
        class: 'ask',
        isNotFor: [],
        func: function(sprite, script) {
            return Entry.container.getInputValue();
        },
        syntax: {
            js: [],
            py: [
                {
                    template: '%1',
                    syntax: 'Entry.answer()',
                    blockType: 'param',
                    textParams: [
                        {
                            type: 'Text',
                            text: 'Entry.answer()',
                            color: '#fff',
                        },
                    ],
                },
            ],
        },
    },
    add_value_to_list: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
                null,
            ],
            type: 'add_value_to_list',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['B&value'],
                },
                'A&value',
                null,
            ],
            type: 'add_value_to_list',
        },
        paramsKeyMap: {
            VALUE: 0,
            LIST: 1,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var value = script.getValue('VALUE', script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (!list.array_) list.array_ = [];
            list.array_.push({ data: value });
            list.updateView();
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    passTest: true,
                    syntax: '%2.append(%1)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                    ],
                },
            ],
        },
    },
    remove_value_from_list: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                {
                    type: 'number',
                    params: ['1'],
                },
                null,
                null,
            ],
            type: 'remove_value_from_list',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'number',
                    params: ['B&value'],
                },
                'A&value',
                null,
            ],
            type: 'remove_value_from_list',
        },
        paramsKeyMap: {
            VALUE: 0,
            LIST: 1,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var value = script.getValue('VALUE', script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (
                !list.array_ ||
                !Entry.Utils.isNumber(value) ||
                value > list.array_.length
            )
                throw new Error('can not remove value from array');

            list.array_.splice(value - 1, 1);

            list.updateView();
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2.pop(%1)',
                    passTest: true,
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                    ],
                },
            ],
        },
    },
    insert_value_to_list: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
                {
                    type: 'text',
                    params: ['1'],
                },
                null,
            ],
            type: 'insert_value_to_list',
        },
        pyHelpDef: {
            params: [
                {
                    type: 'text',
                    params: ['C&value'],
                },
                'A&value',
                {
                    type: 'text',
                    params: ['B&value'],
                },
                null,
            ],
            type: 'insert_value_to_list',
        },
        paramsKeyMap: {
            DATA: 0,
            LIST: 1,
            INDEX: 2,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var data = script.getValue('DATA', script);
            var index = script.getValue('INDEX', script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (
                !list.array_ ||
                !Entry.Utils.isNumber(index) ||
                index == 0 ||
                index > list.array_.length + 1
            )
                throw new Error('can not insert value to array');

            list.array_.splice(index - 1, 0, { data: data });
            list.updateView();
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2.insert(%3, %1)',
                    passTest: true,
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                    ],
                },
            ],
        },
    },
    change_value_list_index: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                null,
                {
                    type: 'text',
                    params: ['1'],
                },
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'change_value_list_index',
        },
        pyHelpDef: {
            params: [
                'A&value',
                {
                    type: 'text',
                    params: ['B&value'],
                },
                {
                    type: 'text',
                    params: ['C&value'],
                },
                null,
            ],
            type: 'change_value_list_index',
        },
        paramsKeyMap: {
            LIST: 0,
            INDEX: 1,
            DATA: 2,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var data = script.getValue('DATA', script);
            var index = script.getValue('INDEX', script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (
                !list.array_ ||
                !Entry.Utils.isNumber(index) ||
                index > list.array_.length
            )
                throw new Error('can not insert value to array');

            list.array_[index - 1].data = data;
            list.updateView();
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%1[%2] = %3',
                    passTest: true,
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    value_of_index_from_list: {
        color: '#E457DC',
        fontColor: '#fff',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_value_of_index_from_list_1,
                color: 'white',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_value_of_index_from_list_2,
                color: 'white',
            },
            {
                type: 'Block',
                isListIndex: true,
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_value_of_index_from_list_3,
                color: 'white',
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                null,
                null,
                null,
                {
                    type: 'number',
                    params: ['1'],
                },
            ],
            type: 'value_of_index_from_list',
        },
        pyHelpDef: {
            params: [
                null,
                'A&value',
                null,
                {
                    type: 'number',
                    params: ['B&value'],
                },
            ],
            type: 'value_of_index_from_list',
        },
        paramsKeyMap: {
            LIST: 1,
            INDEX: 3,
        },
        class: 'list_element',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var index = script.getValue('INDEX', script);
            var list = Entry.variableContainer.getList(listId, sprite);
            index = Entry.getListRealIndex(index, list);

            if (
                !list.array_ ||
                !Entry.Utils.isNumber(index) ||
                index > list.array_.length
            )
                throw new Error('can not insert value to array');

            return list.array_[index - 1].data;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%2[%4]',
                    passTest: true,
                    blockType: 'param',
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                            paramType: 'index',
                        },
                    ],
                },
            ],
        },
    },
    length_of_list: {
        color: '#E457DC',
        fontColor: '#fff',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_length_of_list_1,
                color: 'white',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_length_of_list_2,
                color: 'white',
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null, null, null],
            type: 'length_of_list',
        },
        pyHelpDef: {
            params: [null, 'A&value', null],
            type: 'length_of_list',
        },
        paramsKeyMap: {
            LIST: 1,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var list = Entry.variableContainer.getList(listId, sprite);

            return list.array_.length;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'len(%2)',
                    blockType: 'param',
                    passTest: true,
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                    ],
                },
            ],
        },
    },
    show_list: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'show_list',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'show_list',
        },
        paramsKeyMap: {
            LIST: 0,
        },
        class: 'list_visibility',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var list = Entry.variableContainer.getList(listId);

            list.setVisible(true);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.show_list(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    hide_list: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [null, null],
            type: 'hide_list',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'hide_list',
        },
        paramsKeyMap: {
            LIST: 0,
        },
        class: 'list_visibility',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var list = Entry.variableContainer.getList(listId);

            list.setVisible(false);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.hide_list(%1)',
                    textParams: [
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter: Entry.block.converters.returnStringKey,
                        },
                    ],
                },
            ],
        },
    },
    options_for_list: {
        color: '#E457DC',
        skeleton: 'basic_string_field',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    ['첫번째', 'FIRST'],
                    ['마지막', 'LAST'],
                    ['무작위', 'RANDOM'],
                ],
                value: 'FIRST',
                fontSize: 11,
            },
        ],
        events: {},
        def: {
            params: [null],
        },
        paramsKeyMap: {
            OPERATOR: 0,
        },
        func: function(sprite, script) {
            return script.getField('OPERATOR', script);
        },
        syntax: { js: [], py: [''] },
    },
    set_visible_answer: {
        color: '#E457DC',
        skeleton: 'basic',
        statements: [],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                    [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                ],
                value: 'SHOW',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Indicator',
                img: 'block_icon/variable_03.png',
                size: 12,
            },
        ],
        events: {
            viewAdd: [
                function(block) {
                    if (Entry.container) Entry.container.showProjectAnswer();
                },
            ],
            viewDestroy: [
                function(block, notIncludeSelf) {
                    if (Entry.container)
                        Entry.container.hideProjectAnswer(
                            block,
                            notIncludeSelf
                        );
                },
            ],
        },
        def: {
            params: ['HIDE', null],
            type: 'set_visible_answer',
        },
        pyHelpDef: {
            params: ['A&value', null],
            type: 'set_visible_answer',
        },
        paramsKeyMap: {
            BOOL: 0,
        },
        class: 'ask',
        isNotFor: [],
        func: function(sprite, script) {
            var bool = script.getField('BOOL', script);
            if (bool == 'HIDE') Entry.container.inputValue.setVisible(false);
            else Entry.container.inputValue.setVisible(true);
            return script.callReturn();
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: 'Entry.answer_view(%1)',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                                [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                            ],
                            value: 'SHOW',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters
                                    .returnStringValueLowerCase,
                            codeMap:
                                'Entry.CodeMap.Entry.set_visible_answer[0]',
                        },
                    ],
                },
            ],
        },
    },
    is_included_in_list: {
        color: '#E457DC',
        fontColor: '#fff',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_is_included_in_list_1,
                color: 'white',
            },
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'lists',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_is_included_in_list_2,
                color: 'white',
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Text',
                text: Lang.Blocks.VARIABLE_is_included_in_list_3,
                color: 'white',
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                },
            ],
            dataDestroy: [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                },
            ],
        },
        def: {
            params: [
                null,
                null,
                null,
                {
                    type: 'text',
                    params: ['10'],
                },
                null,
            ],
            type: 'is_included_in_list',
        },
        pyHelpDef: {
            params: [
                null,
                'B&value',
                null,
                {
                    type: 'text',
                    params: ['A&value'],
                },
                null,
            ],
            type: 'is_included_in_list',
        },
        paramsKeyMap: {
            LIST: 1,
            DATA: 3,
        },
        class: 'list',
        isNotFor: ['listNotExist'],
        func: function(sprite, script) {
            var listId = script.getField('LIST', script);
            var data = script.getStringValue('DATA', script);
            var list = Entry.variableContainer.getList(listId, sprite);
            if (!list) return false;
            var arr = list.array_;

            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].data.toString() == data.toString()) return true;
            }
            return false;
        },
        syntax: {
            js: [],
            py: [
                {
                    syntax: '%4 in %2',
                    blockType: 'param',
                    passTest: true,
                    textParams: [
                        undefined,
                        {
                            type: 'DropdownDynamic',
                            value: null,
                            menuName: 'lists',
                            fontSize: 11,
                            arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                            converter:
                                Entry.block.converters.returnRawStringKey,
                        },
                        undefined,
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },
            ],
        },
    },
    //endregion basic 기본
    //region basic 기본
    run: {
        skeleton: 'basic',
        color: '#3BBD70',
        contents: ['this is', 'basic block'],
    },
    mutant: {
        skeleton: 'basic',
        event: 'start',
        color: '#3BBD70',
        params: [],
        changeEvent: {
            _listeners: [],
        },
    },
    jr_start: {
        skeleton: 'pebble_event',
        event: 'start',
        color: '#3BBD70',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_play_image.png',
                highlightColor: '#3BBD70',
                position: {
                    x: 0,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
        },
    },
    jr_repeat: {
        skeleton: 'pebble_loop',
        color: '#127CDB',
        params: [
            {
                type: 'Text',
                text: '',
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 3,
                fontSize: 14,
                roundValue: 3,
            },
        ],
        statements: [{ accept: 'pebble_basic' }],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[1];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0) return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        },
    },
    jr_item: {
        skeleton: 'pebble_basic',
        color: '#F46C6C',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_item_image.png',
                highlightColor: '#FFF',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent('getItem');
                    self.isAction = false;
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.GET_ITEM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    cparty_jr_item: {
        skeleton: 'pebble_basic',
        color: '#8ABC1D',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/cpartyjr/pen.png',
                highlightColor: '#FFF',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent('getItem');
                    self.isAction = false;
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.GET_ITEM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_north: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_up_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case Ntry.STATIC.EAST:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    case Ntry.STATIC.SOUTH:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case Ntry.STATIC.WEST:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_east: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_right_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            var STATIC = Ntry.STATIC;

            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.SOUTH:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    case STATIC.WEST:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_south: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_down_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.EAST:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.WEST:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_west: {
        skeleton: 'pebble_basic',
        color: '#A751E3',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/ntry/bitmap/jr/block_left_image.png',
                position: {
                    x: 83,
                    y: 0,
                },
                size: 22,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(function() {
                        Ntry.dispatchEvent(
                            'unitAction',
                            STATIC.WALK,
                            function() {
                                self.isAction = false;
                            }
                        );
                    }, 3);
                };

                // turn direction
                var actionType;
                switch (Ntry.unitComp.direction) {
                    case STATIC.SOUTH:
                        actionType = STATIC.TURN_RIGHT;
                        break;
                    case STATIC.EAST:
                        actionType = STATIC.HALF_ROTATION;
                        break;
                    case STATIC.NORTH:
                        actionType = STATIC.TURN_LEFT;
                        break;
                    default:
                        callBack();
                        break;
                }
                if (actionType)
                    Ntry.dispatchEvent('unitAction', actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    jr_start_basic: {
        skeleton: 'basic_event',
        event: 'start',
        color: '#3BBD70',
        params: [
            {
                type: 'Indicator',
                boxMultiplier: 2,
                img: '../../../img/assets/block_icon/start_icon_play.png',
                highlightColor: '#3BBD70',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
            {
                text: '시작하기를 클릭했을때',
                type: 'Text',
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
        },
    },
    jr_go_straight: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img:
                    '../../../img/assets/ntry/bitmap/jr/cparty_go_straight.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'move'],
    },
    jr_turn_left: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_rotate_l.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'left'],
    },
    jr_turn_right: {
        skeleton: 'basic',
        color: '#A751E3',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_rotate_r.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'right'],
    },
    jr_go_slow: {
        skeleton: 'basic',
        color: '#f46c6c',
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/cparty_go_slow.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.GO_SLOW, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
        syntax: ['Scope', 'move_slowly'],
    },
    jr_repeat_until_dest: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/jr_goal_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    jr_if_construction: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'wall'"],
        params: [
            {
                type: 'Image',
                img:
                    '../../../img/assets/ntry/bitmap/jr/jr_construction_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_REPAIR,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) return;
            else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    jr_if_speed: {
        skeleton: 'basic_loop',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'hump'"],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/jr/jr_speed_image.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_SLOW,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) return;
            else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_start: {
        skeleton: 'basic_event',
        mode: 'maze',
        event: 'start',
        color: '#3BBD70',
        syntax: ['Program'],
        params: [
            {
                type: 'Indicator',
                boxMultiplier: 2,
                img: '../../../img/assets/block_icon/start_icon_play.png',
                highlightColor: '#3BBD70',
                size: 17,
                position: {
                    x: 0,
                    y: -2,
                },
            },
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
                this._unit.id,
                Ntry.STATIC.UNIT
            );
            Ntry.unit = this._unit;
        },
    },
    maze_step_jump: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#FF6E4B',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/jump.png',
                size: 24,
            },
        ],
        syntax: ['Scope', 'jump'],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_jump2: {
        parent: 'maze_step_jump',
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var checkGrid = {
                    x: unitGrid.x,
                    y: unitGrid.y,
                };
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_IRON],
                    2
                );
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.FAIL_JUMP,
                        callBack
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.CONTACT_IRON
                    );
                    return;
                }
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_jump_pinkbean: {
        parent: 'maze_step_jump',
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                var unit = Ntry.getUnit();
                var components = unit.components || {};
                var unitComp = components[Ntry.STATIC.UNIT] || {};
                var unitGrid = $.extend({}, components[Ntry.STATIC.GRID]);
                var checkGrid = {
                    x: unitGrid.x,
                    y: unitGrid.y,
                };
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_MUSHROOM],
                    1
                );
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.FAIL_JUMP,
                        callBack
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.HIT_UNIT_BY_MUSHROOM
                    );
                    return;
                }

                Ntry.dispatchEvent('unitAction', Ntry.STATIC.JUMP, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_for: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIteration'],
        params: [
            {
                type: 'Dropdown',
                key: 'REPEAT',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[0];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0) return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        },
    },
    test: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#127CDB',
        params: [
            {
                type: 'Angle',
                value: '90',
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
        ],
    },
    maze_repeat_until_1: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/repeat_goal_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    maze_repeat_until_2: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/repeat_goal_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        },
    },
    maze_step_if_1: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'wall'"],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var existEntities = Ntry.entityManager.find({
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y,
            });

            var statement = this.block.statements[0];

            if (existEntities.length === 0) {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL,
                }
            );

            this.isContinue = true;

            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_2: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'bee'"],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/maze2/obstacle_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BEE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_call_function: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#B57242',
        syntax: ['Scope', 'promise'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/function.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.funcExecutor) {
                var codes = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.CODE
                );

                for (var key in codes) {
                    var code = codes[key].components[Ntry.STATIC.CODE].code;
                    this.funcExecutor = new Entry.Executor(
                        code.getEventMap('define')[0]
                    );
                }
            }

            this.funcExecutor.execute();
            if (this.funcExecutor.scope.block === null) return;
            else return Entry.STATIC.BREAK;
        },
    },
    maze_define_function: {
        skeleton: 'basic_define',
        mode: 'maze',
        color: '#B57242',
        event: 'define',
        syntax: ['BasicFunction'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/function.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function(executor) {
            if (this.executed) return;
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;
            this.executor.stepInto(statement);
            this.executed = true;
            return Entry.STATIC.BREAK;
        },
    },
    maze_step_if_3: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == banana'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_3.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BANANA,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_4: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == wall'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/block_inner/if_target_2.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_move_step: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_rotate_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'left'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnL.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_rotate_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnR.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_step_forward: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };
                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_turn_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'turn_right'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/right_ic.png',
                size: 12,
            },
        ],
        func: function() {
            if (this.isDead) {
                return Entry.STATIC.BREAK;
            } else if (this.executor.register.isTurned) {
                Ntry.dispatchEvent('startEnemyWalk', false, function() {});
                this.isDead = true;
                return Entry.STATIC.BREAK;
            } else {
                Ntry.unit.components[Ntry.STATIC.UNIT].direction =
                    Ntry.STATIC.EAST;
                this.executor.register.isTurned = true;
            }
        },
    },
    maze_turn_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'turn_left'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/left_ic.png',
                size: 12,
            },
        ],
        func: function() {
            if (this.isDead) {
                return Entry.STATIC.BREAK;
            } else if (this.executor.register.isTurned) {
                Ntry.dispatchEvent('startEnemyWalk', false, function() {});
                this.isDead = true;
                return Entry.STATIC.BREAK;
            } else {
                Ntry.unit.components[Ntry.STATIC.UNIT].direction =
                    Ntry.STATIC.WEST;
                this.executor.register.isTurned = true;
            }
        },
    },
    maze_step_if_left_monster: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'left == monster'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x - 1, y: gridComp.y };
            var fitEntities = Ntry.entityManager
                .find({
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                })
                .filter(function(e) {
                    return e.components[Ntry.STATIC.ENEMY];
                });
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_step_if_right_monster: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'right == monster'],
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x + 1, y: gridComp.y };
            var fitEntities = Ntry.entityManager
                .find({
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                })
                .filter(function(e) {
                    return e.components[Ntry.STATIC.ENEMY];
                });
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_step_if_yeti: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == yeti'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/yeti.png',
                size: 24,
            },
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (this.isContinue) return;
            var unitComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                Ntry.unit.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_YETI,
                }
            );
            this.isContinue = true;
            if (fitEntities.length === 0) {
                return script.getStatement('STACK_ELSE', script);
            } else {
                return script.getStatement('STACK_IF', script);
            }
        },
    },
    maze_repeat_until_beat_monster: {
        parent: 'repeat_inf',
        params: [
            {
                type: 'Indicator',
                img: '../../../img/assets/week/blocks/for.png',
                size: 12,
            },
        ],
    },
    maze_ladder_climb: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#71C11B',
        emphasizedColor: '#9BDB40',
        syntax: ['Scope', 'climb'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ladder.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                script.isContinue = true;
                script.isAction = true;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                script.direction = unitComp.direction;
                var callBack = function() {
                    unitComp.direction = script.direction;
                    script.isAction = false;
                };
                var isCollisionPossible = false;
                if (unitGrid.y > 3) {
                    unitComp.direction = Ntry.STATIC.NORTH;
                    isCollisionPossible = Ntry.checkCollisionTile(
                        unitGrid,
                        unitComp.direction,
                        [Ntry.STATIC.LADDER],
                        2
                    );
                } else {
                    unitComp.direction = Ntry.STATIC.SOUTH;
                    var tile = Ntry.getTileByGrid(unitGrid);
                    if (tile.tileType === Ntry.STATIC.LADDER) {
                        isCollisionPossible = true;
                    }
                }
                if (isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.CLIMB,
                        callBack
                    );
                } else {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_LADDER,
                        callBack
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_lupin: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'yoyo'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                script.isContinue = true;
                script.isAction = true;
                var isFoundMushroom = false;
                var grid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                for (var i = 0; i < 2; i++) {
                    Ntry.addVectorByDirection(grid, unitComp.direction, 1);
                    var findTile = Ntry.entityManager.find(
                        {
                            type: Ntry.STATIC.GRID,
                            x: grid.x,
                            y: grid.y,
                        },
                        {
                            type: Ntry.STATIC.TILE,
                            tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                        }
                    );
                    if (findTile && findTile.length) {
                        isFoundMushroom = true;
                    }
                }
                if (isFoundMushroom) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.WRONG_ATTACK_OBSTACLE,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_LUPIN],
                    2
                );
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                var callBack = function() {
                    Ntry.dispatchEvent('playSound', 'dieLupin');
                    Ntry.dispatchEvent('destroyObstacle', 2, function(state) {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK_LUPIN,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_both_side: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var frontExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var backExist = !!Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                if (!frontExist || !backExist) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.BOTH_SIDE_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                    return Entry.STATIC.BREAK;
                }
                Ntry.dispatchEvent('destroyObstacle', 1, function(state) {});
                Ntry.dispatchEvent('destroyObstacle', -1, function(state) {});
                var callBack = function() {
                    Ntry.dispatchEvent('startEnemyWalk', true, function() {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.BOTH_SIDE,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_pepe: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pepe.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_PEPE,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            console.log('???');
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.PEPE_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_yeti: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/yeti.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_YETI,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    var callBack = function() {
                        Ntry.dispatchEvent('destroyObstacle', 1, function(
                            state
                        ) {});
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PEPE,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.YETI_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.YETI_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_mushroom: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_MUSHROOM],
                    1
                );
                script.isContinue = true;
                script.isAction = true;
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT,
                        function() {
                            script.isAction = false;
                        }
                    );
                    // Ntry.dispatchEvent("unitAction", Ntry.STATIC.NOT_FOUND_MEAT, callBack);
                    return Entry.STATIC.BREAK;
                }
                var callBack = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        script.isAction = false;
                    });
                };
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK_MUSHROOM,
                    callBack
                );
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_attack_peti: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#ef6d6a',
        emphasizedColor: '#f29999',
        syntax: ['Scope', 'both_side'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/bigYeti.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/pinkbean_ic.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                Ntry.dispatchEvent('stopEnemyWalk');
                this.executor.register.isTurned = false;
                script.isContinue = true;
                script.isAction = true;
                var grid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                var backGrid = $.extend(
                    { type: Ntry.STATIC.GRID },
                    Ntry.entityManager.getComponent(
                        Ntry.unit.id,
                        Ntry.STATIC.GRID
                    )
                );
                Ntry.addVectorByDirection(grid, Ntry.unitComp.direction, 1);
                var findTile = Ntry.entityManager.find(grid, {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_PETI,
                });
                Ntry.addVectorByDirection(
                    backGrid,
                    Ntry.unitComp.direction,
                    -1
                );
                var findBackTile = Ntry.entityManager
                    .find(backGrid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    });
                var frontEnemyExist = !!Ntry.entityManager
                    .find(grid)
                    .filter(function(e) {
                        return e.components[Ntry.STATIC.ENEMY];
                    }).length;
                var frontEnemyValid = !!findTile.length;
                var backEnemyExist = !!findBackTile.length;
                if (frontEnemyValid && !backEnemyExist) {
                    // success
                    Ntry.dispatchEvent('destroyObstacle', 1, function(
                        state
                    ) {});
                    var callBack = function() {
                        Ntry.dispatchEvent('startEnemyWalk', true, function() {
                            script.isAction = false;
                        });
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI,
                        callBack
                    );
                } else if (frontEnemyValid && backEnemyExist) {
                    // attack and dead
                    Ntry.dispatchEvent('destroyObstacle', 1, function(
                        state
                    ) {});
                    var callBack = function() {
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                    };
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI,
                        callBack
                    );
                } else if (backEnemyExist) {
                    // dead
                    if (frontEnemyExist)
                        Ntry.dispatchEvent(
                            'unitAction',
                            Ntry.STATIC.PETI_FAIL,
                            function() {
                                script.isAction = false;
                            }
                        );
                    else
                        Ntry.dispatchEvent(
                            'startEnemyWalk',
                            false,
                            function() {}
                        );
                } else {
                    // music time
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.PETI_FAIL,
                        function() {
                            script.isAction = false;
                        }
                    );
                }
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_eat_item: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#b2521d',
        emphasizedColor: '#9BDB40',
        syntax: ['Scope', 'item'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/eat.png',
                size: 24,
            },
        ],
        func: function(sprite, script) {
            if (!script.isContinue) {
                script.isContinue = true;
                script.isAction = true;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var callBack = function() {
                    script.isAction = false;
                };
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var meatEntity = Ntry.checkTileByGrid(
                    unitGrid,
                    Ntry.STATIC.MEAT
                );
                if (
                    !meatEntity ||
                    meatEntity.components[Ntry.STATIC.ITEM].isEaten
                ) {
                    Ntry.dispatchEvent(
                        'unitAction',
                        Ntry.STATIC.NOT_FOUND_MEAT,
                        callBack
                    );
                    return Entry.STATIC.BREAK;
                }
                Ntry.dispatchEvent('unlockItem');
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.EAT, callBack);
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isContinue;
            }
        },
    },
    maze_rotate_left: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'left'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnL.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_LEFT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_rotate_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/turnR.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                // turn direction
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.TURN_RIGHT,
                    callBack
                );

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_moon_kick: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#2EB0E8',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/moon_icon.png',
                size: 24,
            },
        ],
        func: function() {
            // TODO: func 내용은 변경해야 함.

            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_BRICK],
                    1
                );

                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callback = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        switch (state) {
                            case Ntry.STATIC.OBSTACLE_DESTROY_SUCCESS:
                                self.isAction = false;
                                break;
                        }
                    });
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.ATTACK, callback);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_cony_flower_throw: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D8617D',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/cony_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;

                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_SPIDER]
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                var particle = Ntry.entityManager.addEntity();
                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_SPIDER,
                                    ],
                                });
                            }
                        });
                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.FLOWER_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_cony_flower_throw2: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D8617D',
        template: Lang.template.maze_cony_flower_throw,
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/cony_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY5,
                        Ntry.STATIC.OBSTACLE_ENERMY4,
                    ],
                    2,
                    true
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY5,
                                        ,
                                        Ntry.STATIC.OBSTACLE_ENERMY4,
                                    ],
                                    penetrationList: [Ntry.STATIC.WALL],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_james_heart: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D39D18',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/james_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY1,
                        Ntry.STATIC.OBSTACLE_ENERMY2,
                        Ntry.STATIC.OBSTACLE_ENERMY3,
                        Ntry.STATIC.OBSTACLE_ENERMY5,
                    ]
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY1,
                                        Ntry.STATIC.OBSTACLE_ENERMY2,
                                        Ntry.STATIC.OBSTACLE_ENERMY3,
                                        Ntry.STATIC.OBSTACLE_ENERMY5,
                                    ],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_james_heart2: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#D39D18',
        template: Lang.template.maze_james_heart,
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/james_icon.png',
                size: 24,
            },
        ],
        func: function() {
            var self = this;
            if (!this.isContinue) {
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );

                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });

                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [
                        Ntry.STATIC.OBSTACLE_ENERMY3,
                        Ntry.STATIC.OBSTACLE_ENERMY4,
                    ],
                    2
                );
                var particleZIndex = 550;
                if (unitComp.direction === Ntry.STATIC.NORTH) {
                    particleZIndex = 450;
                }
                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }

                this.isContinue = true;
                this.isAction = true;

                var particle = Ntry.entityManager.addEntity();

                Ntry.dispatchEvent(
                    'unitAction',
                    Ntry.STATIC.ATTACK,
                    function() {
                        $.each(components, function(type, component) {
                            if (+type === Ntry.STATIC.SPRITE) {
                                var cloneComponent = $.extend({}, component);
                                cloneComponent.zIndex = particleZIndex;
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    cloneComponent
                                );
                            } else if (+type != Ntry.STATIC.UNIT) {
                                Ntry.entityManager.addComponent(
                                    particle.id,
                                    component
                                );
                            } else {
                                Ntry.entityManager.addComponent(particle.id, {
                                    type: Ntry.STATIC.PARTICLE,
                                    direction: component.direction,
                                    collisionList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY3,
                                        Ntry.STATIC.OBSTACLE_ENERMY4,
                                        Ntry.STATIC.OBSTACLE_ENERMY_AREA,
                                    ],
                                    penetrationList: [
                                        Ntry.STATIC.OBSTACLE_ENERMY_AREA,
                                    ],
                                });
                            }
                        });

                        Ntry.dispatchEvent('particleAction', {
                            entityId: particle.id,
                            actionType: Ntry.STATIC.HEART_ATTACK,
                            callback: function() {
                                Ntry.entityManager.removeEntity(particle.id);
                                self.isAction = false;
                            },
                        });
                    }
                );
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_iron_switch: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#748d69',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/iron_icon.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var eventCount = 0;
                var self = this;
                var gridSize = Ntry.configManager.getConfig('gridSize');
                var tileSize = Ntry.configManager.getConfig('tileSize').width;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.OBSTACLE
                );

                for (var id in entities) {
                    var obstacleComp = Ntry.entityManager.getComponent(
                        id,
                        Ntry.STATIC.OBSTACLE
                    );
                    if (obstacleComp.tileType === Ntry.STATIC.OBSTACLE_IRON) {
                        var obstacleGrid = Ntry.entityManager.getComponent(
                            id,
                            Ntry.STATIC.GRID
                        );
                        var obstaclePosition = Ntry.entityManager.getComponent(
                            id,
                            Ntry.STATIC.POSITION
                        );
                        var grid = {
                            x: obstacleGrid.x,
                            y: obstacleGrid.y === 1 ? 3 : 1,
                        };

                        obstacleGrid.y = obstacleGrid.y === 1 ? 3 : 1;

                        var deltaY = tileSize * 2;

                        if (obstacleGrid.y === 1) {
                            deltaY = -deltaY;
                        }

                        var deltaPos = {
                            x: 0,
                            y: deltaY * 0.5,
                        };

                        var deltaPos2 = {
                            x: 0,
                            y: deltaY,
                        };

                        var targetPos = {
                            minY: 0,
                            maxY: gridSize.height * tileSize,
                        };

                        if (deltaY > 0) {
                            targetPos.maxY =
                                obstacleGrid.y * tileSize + tileSize / 2;
                        } else {
                            targetPos.minY =
                                obstacleGrid.y * tileSize + tileSize / 2;
                        }

                        (function(
                            _id,
                            _deltaPos,
                            _deltaPos2,
                            _targetPos,
                            obstacleGrid
                        ) {
                            var comp = Ntry.entityManager.getComponent(
                                _id,
                                Ntry.STATIC.ANIMATE
                            );
                            if (comp) {
                                if (eventCount === 0) {
                                    self.isAction = false;
                                }
                                Ntry.entityManager.addComponent(_id, {
                                    type: Ntry.STATIC.ANIMATE,
                                    animateType: Ntry.STATIC.TRANSITION,
                                    duration: 20,
                                    option: {
                                        deltaPos: _deltaPos2,
                                        targetPos: _targetPos,
                                    },
                                    afterAnimate: function() {
                                        var unitGrid = Ntry.getUtilGrid();

                                        if (
                                            obstacleGrid.x == unitGrid.x &&
                                            obstacleGrid.y == unitGrid.y
                                        ) {
                                            Ntry.dispatchEvent(
                                                'unitAction',
                                                Ntry.STATIC.CONTACT_IRON2
                                            );
                                        }
                                    },
                                });
                            } else {
                                Ntry.entityManager.addComponent(_id, {
                                    type: Ntry.STATIC.ANIMATE,
                                    animateType: Ntry.STATIC.TRANSITION,
                                    duration: 10,
                                    option: {
                                        deltaPos: _deltaPos,
                                    },
                                    afterAnimate: function() {
                                        if (eventCount === 0) {
                                            self.isAction = false;
                                        }
                                        Ntry.entityManager.addComponent(_id, {
                                            type: Ntry.STATIC.ANIMATE,
                                            animateType: Ntry.STATIC.TRANSITION,
                                            duration: 10,
                                            option: {
                                                deltaPos: _deltaPos,
                                                targetPos: _targetPos,
                                            },
                                            afterAnimate: function() {
                                                var unitGrid = Ntry.getUtilGrid();

                                                if (
                                                    obstacleGrid.x ==
                                                        unitGrid.x &&
                                                    obstacleGrid.y == unitGrid.y
                                                ) {
                                                    console.log('충돌');
                                                    // Ntry.dispatchEvent("playSound", Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT);
                                                    Ntry.dispatchEvent(
                                                        'unitAction',
                                                        Ntry.STATIC
                                                            .CONTACT_IRON2
                                                    );
                                                    // Ntry.dispatchEvent("complete", false, Ntry.STATIC.CONTACT_IRON2);
                                                }
                                            },
                                        });
                                    },
                                });
                            }
                        })(id, deltaPos, deltaPos2, targetPos, obstacleGrid);
                    }
                }
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_brown_punch: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#6C483A',
        syntax: ['Scope', 'right'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/sprite/brown_icon.png',
                size: 24,
            },
        ],
        func: function() {
            if (!this.isContinue) {
                var self = this;
                var entities = Ntry.entityManager.getEntitiesByComponent(
                    Ntry.STATIC.UNIT
                );
                var unitId;
                $.each(entities, function(id, entity) {
                    unitId = id;
                    components = entity.components;
                });
                var unitComp = Ntry.entityManager.getComponent(
                    unitId,
                    Ntry.STATIC.UNIT
                );
                var unitGrid = $.extend(
                    {},
                    Ntry.entityManager.getComponent(unitId, Ntry.STATIC.GRID)
                );
                var isCollisionPossible = Ntry.checkCollisionTile(
                    unitGrid,
                    unitComp.direction,
                    [Ntry.STATIC.OBSTACLE_ICE],
                    1
                );

                if (!isCollisionPossible) {
                    Ntry.dispatchEvent(
                        'playSound',
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    Ntry.dispatchEvent(
                        'complete',
                        false,
                        Ntry.STATIC.NOT_FOUND_DESTORY_OBJECT
                    );
                    return;
                }
                this.isContinue = true;
                this.isAction = true;

                var callback = function() {
                    Ntry.dispatchEvent('destroyObstacle', 1, function(state) {
                        switch (state) {
                            case Ntry.STATIC.OBSTACLE_DESTROY_SUCCESS:
                                self.isAction = false;
                                break;
                        }
                    });
                };

                // turn direction
                Ntry.dispatchEvent('unitAction', Ntry.STATIC.ATTACK, callback);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        },
    },
    maze_repeat_until_3: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            var isGoal = false;
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) {
                return;
            }

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );

            if (unitComp.isStartedUnit) {
                var unitGrid = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                var entities = Ntry.entityManager.getEntitiesByGrid(
                    unitGrid.x,
                    unitGrid.y
                );

                for (var idx in entities) {
                    var entity = entities[idx];
                    var tile = Ntry.entityManager.getComponent(
                        entity.id,
                        Ntry.STATIC.TILE
                    );
                    var item = Ntry.entityManager.getComponent(
                        entity.id,
                        Ntry.STATIC.ITEM
                    );

                    if (
                        tile &&
                        item &&
                        tile.tileType === Ntry.STATIC.GOAL &&
                        Ntry.STATIC.GOAL_ITEM_LIST.indexOf(item.itemType) > -1
                    ) {
                        isGoal = true;
                        break;
                    }
                }
            }

            if (!isGoal) {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
            // Ntry.dispatchEvent('executeEnd');
        },
    },
    maze_repeat_until_4: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_02.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_5: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_03.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_6: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-1.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_7: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-4.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_8: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-5.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_9: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-6.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_10: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-7.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_11: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-9.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_12: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-10.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_13: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-11.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_14: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/blcok-12.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_15: {
        template: Lang.template.maze_repeat_until_7,
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/bitmap/ws/tile_goal_04.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_repeat_until_goal: {
        parent: 'maze_repeat_until_3',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
    },
    maze_radar_check: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#AEB8FF',
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.maze_distance1, '1'],
                    [Lang.Menus.maze_distance2, '2'],
                ],
                value: '1',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.maze_object_trap, 'TRAP'],
                    [Lang.Menus.maze_object_monster, 'MONSTER'],
                    [Lang.Menus.maze_object_obstacle1, 'OBSTACLE'],
                ],
                value: 'TRAP',
                fontSize: 11,
            },
        ],
        paramsKeyMap: {
            DISTANCE: 0,
            TYPE: 1,
        },
        func: function(sprite, script) {
            var distance = script.getNumberField('DISTANCE', script);
            var type = script.getField('TYPE', script);

            var entityId = Ntry.getRadarEntityIdByDistance(distance);
            var tileType;
            if (entityId) {
                var tileComp = Ntry.entityManager.getComponent(
                    entityId,
                    Ntry.STATIC.TILE
                );
                switch (tileComp.tileType) {
                    case Ntry.STATIC.OBSTACLE_HOLE:
                        tileType = 'TRAP';
                        break;
                    case Ntry.STATIC.OBSTACLE_ENERMY1:
                    case Ntry.STATIC.OBSTACLE_ENERMY2:
                    case Ntry.STATIC.OBSTACLE_ENERMY3:
                    case Ntry.STATIC.OBSTACLE_ENERMY4:
                    case Ntry.STATIC.OBSTACLE_ENERMY5:
                        tileType = 'MONSTER';
                        break;
                    case Ntry.STATIC.OBSTACLE_IRON:
                        tileType = 'OBSTACLE';
                        break;
                }
            } else {
                tileType = 'TRAP';
            }

            if (type === tileType) {
                return true;
            } else {
                return false;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_5: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == bee'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/ntry/bitmap/maze2/obstacle_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BEE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_6: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == bee'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/maze/bitmap/stage4/road_4_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.ROAD,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length > 0) {
                return;
            } else if (statement.getBlocks().length === 0) {
                return;
            } else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    // TODO: 해당 부분 수정 필요
    maze_step_if_7: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == ice'],
        params: [
            {
                type: 'Image',
                img: '../../../img/assets/maze/bitmap/stage4/obj_ice_01.png',
                size: 18,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;

            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );

            var entity;
            for (var key in entities) entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );

            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_ICE,
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_8: {
        parent: '_if',
        class: '',
        syntax: { js: [], py: [] },
    },
    maze_step_if_mushroom: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == mushroom'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                }
            );
            this.isContinue = true;
            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_lupin: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', 'front == lupin'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
        ],
        func: function() {
            if (this.isContinue) return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 2);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_LUPIN,
                }
            );
            this.isContinue = true;
            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        },
    },
    maze_step_if_else_road: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.ROAD,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_mushroom: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/mushroom.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_MUSHROOM,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_lupin: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/lupin.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            Ntry.addVectorByDirection(grid, unitComp.direction, 2);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_LUPIN,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else_ladder: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ic_ladder.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/if.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        statementsKeyMap: {
            STACK_IF: 0,
            STACK_ELSE: 1,
        },
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var entities = Ntry.entityManager.getEntitiesByComponent(
                Ntry.STATIC.UNIT
            );
            var entity;
            for (var key in entities) {
                entity = entities[key];
            }
            var unitComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.UNIT
            );
            var gridComp = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.GRID
            );
            var grid = { x: gridComp.x, y: gridComp.y };
            if (grid.y > 3) {
                grid.y = 2;
            }
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);
            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y,
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.LADDER,
                }
            );
            script.isCondition = true;
            if (fitEntities.length) {
                return script.getStatement('STACK_IF', script);
            } else {
                return script.getStatement('STACK_ELSE', script);
            }
        },
    },
    maze_step_if_else: {
        parent: 'if_else',
        class: '',
        syntax: { js: [], py: [] },
    },
    test_wrapper: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#3BBD70',
        params: [
            {
                type: 'Block',
                accept: 'basic_boolean_field',
                value: [
                    {
                        type: 'test',
                        params: [30, 50],
                    },
                ],
            },
            {
                type: 'Dropdown',
                options: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7],
                    [8, 8],
                    [9, 9],
                    [10, 10],
                ],
                value: 1,
            },
        ],
    },
    basic_button: {
        skeleton: 'basic_button',
        color: '#eee',
        params: [
            {
                type: 'Text',
                text: 'basic button',
                color: '#333',
                align: 'center',
            },
        ],
    },
    //endregion basic 기본
    //region basic 기본
    ebs_if: {
        parent: '_if',
        def: {
            type: '_if',
            params: [
                {
                    type: 'reach_something',
                    params: [null, 'wall'],
                },
            ],
        },
        syntax: { js: [], py: [] },
    },
    ebs_if2: {
        parent: '_if',
        def: {
            type: '_if',
            params: [
                {
                    type: 'reach_something',
                    params: [null, 'cwz5'],
                },
            ],
        },
        syntax: { js: [], py: [] },
    },
    ai_move_right: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'move'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/moveStep.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.EAST;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 0,
                });
                gridComp.x++;
                return Entry.STATIC.BREAK;
            } else if (script.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete script.isAction;
                delete script.isStart;
                //Entry.engine.isContinue = false;
            }
        },
    },
    ai_move_up: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'up'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ai_move_up.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.NORTH;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: -45,
                });
                gridComp.x++;
                gridComp.y--;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                return script.callReturn();
            }
        },
    },
    ai_move_down: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#A751E3',
        syntax: ['Scope', 'down'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/ai_move_down.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.SOUTH;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 45,
                });
                gridComp.x++;
                gridComp.y++;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                return script.callReturn();
            }
        },
    },
    ai_repeat_until_reach: {
        skeleton: 'basic_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicWhile', 'true'],
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0) return;

            return this.executor.stepInto(statement);
        },
    },
    ai_if_else_1: {
        skeleton: 'basic_double_loop',
        mode: 'maze',
        color: '#498DEB',
        syntax: ['BasicIf', "front == 'stone'"],
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/ntry/bitmap/ai/obstacle_1.png',
                size: 24,
            },
            {
                type: 'Image',
                img: '/img/assets/week/blocks/for.png',
                size: 24,
            },
            {
                type: 'LineBreak',
            },
        ],
        func: function(entity, script) {
            if (script.isLooped) {
                delete script.isLooped;
                return script.callReturn();
            }
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var statements = this.block.statements;
            var index = 1;
            script.isLooped = true;
            if (
                radar.center.type == Ntry.STATIC.AI_METEO &&
                radar.center.distance == 1
            )
                index = 0;
            this.executor.stepInto(statements[index]);
            return Entry.STATIC.BREAK;
        },
    },
    ai_boolean_distance: {
        skeleton: 'basic_boolean_field',
        mode: 'maze',
        color: '#2fc9f0',
        fontColor: '#fff',
        syntax: ['Scope', 'radar_%1 %2 %3#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    ['>', 'BIGGER'],
                    ['>=', 'BIGGER_EQUAL'],
                    ['=', 'EQUAL'],
                    ['<', 'SMALLER'],
                    ['<=', 'SMALLER_EQUAL'],
                ],
                value: 'BIGGER',
                fontSize: 11,
            },
            {
                type: 'Block',
                accept: 'string',
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var params = this.block.params;

            var direction = params[0];
            var operator = params[1];
            var value = this.getParam(2);

            var radarValue;
            switch (direction) {
                case 'UP':
                    radarValue = radar.left;
                    break;
                case 'RIGHT':
                    radarValue = radar.center;
                    break;
                case 'DOWN':
                    radarValue = radar.right;
                    break;
            }
            if (radarValue.type == Ntry.STATIC.AI_GOAL)
                radarValue = Number.MAX_VALUE;
            else radarValue = radarValue.distance;

            switch (operator) {
                case 'BIGGER':
                    return radarValue > value;
                case 'BIGGER_EQUAL':
                    return radarValue >= value;
                case 'EQUAL':
                    return radarValue == value;
                case 'SMALLER':
                    return radarValue < value;
                case 'SMALLER_EQUAL':
                    return radarValue <= value;
            }
        },
    },
    ai_distance_value: {
        skeleton: 'basic_string_field',
        mode: 'maze',
        color: '#ffd974',
        syntax: ['Scope', 'radar_%1#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            switch (this.block.params[0]) {
                case 'UP':
                    radarValue = radar.left;
                    break;
                case 'RIGHT':
                    radarValue = radar.center;
                    break;
                case 'DOWN':
                    radarValue = radar.right;
                    break;
            }
            return radarValue.type == Ntry.STATIC.AI_GOAL
                ? Number.MAX_VALUE
                : radarValue.distance;
        },
    },
    ai_boolean_object: {
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        mode: 'maze',
        color: '#2fc9f0',
        syntax: ['Scope', 'object_%1 == %2#'],
        params: [
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.ai_above, 'UP'],
                    [Lang.Menus.ai_front, 'RIGHT'],
                    [Lang.Menus.ai_under, 'DOWN'],
                ],
                value: 'RIGHT',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_HW,
            },
            {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.asteroids, 'OBSTACLE'],
                    [Lang.Menus.wall, 'WALL'],
                    [Lang.Menus.item, 'ITEM'],
                ],
                value: 'OBSTACLE',
                fontSize: 11,
            },
        ],
        func: function(entity, script) {
            var radar = Ntry.entityManager.getComponent(
                entity.id,
                Ntry.STATIC.RADAR
            );

            var params = this.block.params;

            var radarValue;
            switch (params[0]) {
                case 'UP':
                    radarValue = radar.left.type;
                    break;
                case 'RIGHT':
                    radarValue = radar.center.type;
                    break;
                case 'DOWN':
                    radarValue = radar.right.type;
                    break;
            }
            switch (params[1]) {
                case 'OBSTACLE':
                    return radarValue == Ntry.STATIC.AI_METEO;
                case 'WALL':
                    return radarValue == Ntry.STATIC.AI_WALL;
                case 'ITEM':
                    return radarValue == Ntry.STATIC.AI_ITEM;
            }
        },
    },
    ai_use_item: {
        skeleton: 'basic',
        mode: 'maze',
        color: '#EACF11',
        syntax: ['Scope', 'use_item'],
        params: [
            {
                type: 'Image',
                img: '/img/assets/week/blocks/item.png',
                size: 24,
            },
        ],
        func: function(entity, script) {
            if (!script.isStart) {
                Ntry.dispatchEvent('triggerWeapon');
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent('gridChange', function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.EAST;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id,
                    Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(entity.id, {
                    type: Ntry.STATIC.ANIMATE,
                    animateType: Ntry.STATIC.ROTATE_TO,
                    animateValue: 0,
                });
                gridComp.x++;
                return script;
            } else if (script.isAction) {
                return script;
            } else {
                delete script.isAction;
                delete script.isStart;
                //Entry.engine.isContinue = false;
                return script.callReturn();
            }
        },
    },
    ai_boolean_and: {
        color: '#2fc9f0',
        skeleton: 'basic_boolean_field',
        fontColor: '#fff',
        statements: [],
        syntax: ['Scope', '%1 && %3#'],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_boolean_and,
                color: '#fff',
            },
            {
                type: 'Block',
                accept: 'boolean',
            },
        ],
        events: {},
        func: function() {
            return this.getParam(0) && this.getParam(2);
        },
    },
    ai_True: {
        color: '#2fc9f0',
        skeleton: 'basic_boolean_field',
        statements: [],
        params: [
            {
                type: 'Text',
                text: Lang.Blocks.JUDGEMENT_true,
                color: '#3D3D3D',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'True',
        },
        func: function(sprite, script) {
            return true;
        },
        isPrimitive: true,
    },
    ai_if_else: {
        color: '#498deb',
        skeleton: 'basic_double_loop',
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Block',
                accept: 'boolean',
            },
            {
                type: 'Indicator',
                img: 'block_icon/if.png',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        func: function(sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = this.getParam(0);
            script.isCondition = true;
            var statement = this.block.statements[value ? 0 : 1];
            //no blocks end execute
            if (statement.getBlocks().length === 0) return this.executor.end();
            else return this.executor.stepInto(statement);
        },
        syntax: ['BasicIf', 'true'],
    },
    //endregion basic 기본
    //region basic 기본
    hidden: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '         %1       %2',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_event: {
        color: '#7C7C7C',
        skeleton: 'basic_event',
        template: '         %1       ',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_event',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_loop: {
        color: '#7C7C7C',
        skeleton: 'basic_loop',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'Image',
                img: '/img/assets/maze/icon/group.png',
                size: {
                    width: 47,
                    height: 20,
                },
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_if',
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_if_else: {
        color: '#7C7C7C',
        skeleton: 'basic_double_loop',
        template: '         %1       %2%3',
        statements: [
            {
                accept: 'basic',
            },
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
            {
                type: 'LineBreak',
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'hidden_if',
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    check_object_property: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '%1 가 %2 %3 %4 %5 %6',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sprites',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [['언젠가', 0], ['지금', 1]],
                value: '0',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    ['x', 'x'],
                    ['y', 'y'],
                    ['크기', 'size'],
                    ['방향', 'rotation'],
                    ['이동 방향', 'direction'],
                    ['텍스트', 'text'],
                ],
                value: 'x',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [
                    ['=', 'EQUAL'],
                    ['>', 'GREATER'],
                    ['<', 'LESS'],
                    ['≥', 'GREATER_OR_EQUAL'],
                    ['≤', 'LESS_OR_EQUAL'],
                ],
                value: 'EQUAL',
                fontSize: 11,
                noArrow: true,
            },
            {
                type: 'Block',
                accept: 'string',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'check_object_property',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            var obj = Entry.container.getObject(this.block.params[0]),
                flow = this.block.params[1],
                propertyKey = this.block.params[2],
                rightValue = this.getParam(4);
            propertyKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
            var leftValue = obj.entity['get' + propertyKey].call(obj.entity),
                returnVal;

            switch (this.block.params[3]) {
                case 'EQUAL':
                    returnVal = leftValue == rightValue;
                    break;
                case 'GREATER':
                    returnVal = Number(leftValue) > Number(rightValue);
                    break;
                case 'LESS':
                    returnVal = Number(leftValue) < Number(rightValue);
                    break;
                case 'GREATER_OR_EQUAL':
                    returnVal = Number(leftValue) >= Number(rightValue);
                    break;
                case 'LESS_OR_EQUAL':
                    returnVal = Number(leftValue) <= Number(rightValue);
                    break;
            }
            if (returnVal) return;
            else if (flow == 0) return Entry.STATIC.BREAK;
            else this.die();
        },
    },
    check_lecture_goal: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '목표 %1 %2 ( %3 ) %4',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 0,
            },
            {
                type: 'Dropdown',
                options: [['달성', 1], ['실패', 0]],
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [['공식', 1], ['비공식', 0]],
                value: 1,
                fontSize: 11,
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {
            dataAdd: [
                function(block) {
                    Entry.registerAchievement(block);
                },
            ],
        },
        def: {
            params: [0, 1, 1],
            type: 'check_lecture_goal',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            Entry.targetChecker.achieveCheck(
                this.block.params[1],
                this.block.params[0] + ''
            );
        },
    },
    switch_scope: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '%1 오브젝트 기준으로 실행하기 %2',
        statements: [],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sprites',
                fontSize: 11,
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'switch_scope',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            var obj = Entry.container.getObject(this.block.params[0]);
            this.executor.entity = obj.entity;
        },
    },
    is_answer_submited: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '대답을 입력 받을때 까지 기다리기 %1',
        statements: [],
        params: [
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null],
            type: 'is_answer_submited',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            if (this.isSubmitted) {
                Entry.removeEventListener('answerSubmitted', checkFunc);
                return;
            } else if (this.isSubmitted === false) return Entry.STATIC.BREAK;
            var checkFunc = function() {
                that.isSubmitted = true;
            };
            this.isSubmitted = false;
            var that = this;
            Entry.addEventListener('answerSubmitted', checkFunc);
            return Entry.STATIC.BREAK;
        },
    },
    check_block_execution: {
        color: '#7C7C7C',
        skeleton: 'basic_loop',
        template: '%1 에서 아래 블록이 %2 %3 번 실행되었는가 %4',
        statements: [
            {
                accept: 'basic',
            },
        ],
        params: [
            {
                type: 'DropdownDynamic',
                value: null,
                menuName: 'sprites',
                fontSize: 11,
            },
            {
                type: 'Dropdown',
                options: [['비슷하게', 0], ['똑같이', 1]],
                value: '16',
                fontSize: 11,
            },
            {
                type: 'TextInput',
                value: 1,
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [null, 0],
            type: 'check_block_execution',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            if (this.listener) {
                if (this.remainCheck === 0) {
                    this.listener.destroy();
                    return;
                } else return Entry.STATIC.BREAK;
            }
            var code = Entry.container.getObject(this.block.params[0]).script,
                accuracy = this.block.params[1],
                statements = this.block.statements[0].getBlocks(),
                lastBlock = null;
            this.remainCheck = Number(this.block.params[2]);
            var index = 0;
            this.listener = code.watchEvent.attach(this, function(blocks) {
                //dangerous
                blocks = blocks.concat();
                var block,
                    isFirst = true;
                while (blocks.length && index < statements.length) {
                    block = blocks.shift();
                    if (isFirst && block === lastBlock) continue;
                    if (
                        accuracy === 0 &&
                        statements[index].type === block.type
                    ) {
                        index++;
                    } else if (
                        accuracy === 1 &&
                        statements[index].isSameParamWith(block)
                    ) {
                        index++;
                    } else {
                        index = 0;
                    }
                    isFirst = false;
                }
                lastBlock = block;
                if (index === statements.length) {
                    this.remainCheck = this.remainCheck - 1;
                    index = 0;
                }
            });
            return Entry.STATIC.BREAK;
        },
    },
    check_variable_by_name: {
        color: '#7C7C7C',
        skeleton: 'basic_string_field',
        template: '%1 이름의 변수',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
            },
        ],
        events: {},
        def: {
            params: ['변수'],
            type: 'check_variable_by_name',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            var variableName = this.block.params[0] + '';
            var variable = Entry.variableContainer.getVariableByName(
                variableName
            );
            if (variable) return variable.getValue();
            else return;
        },
    },
    show_prompt: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '%1 안내하기 %2',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: [' '],
            type: 'show_prompt',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            if (Entry.targetChecker)
                Entry.targetChecker.showStatusMessage(this.block.params[0]);
        },
    },
    check_goal_success: {
        color: '#7C7C7C',
        skeleton: 'basic_boolean_field',
        template: '목표 %1 이 성공?',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '',
            },
        ],
        events: {},
        def: {
            params: ['0'],
            type: 'check_goal_success',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            var goalName = this.block.params[0] + '';
            return Entry.targetChecker.checkGoal(goalName);
        },
    },
    wildcard_string: {
        color: '#7C7C7C',
        skeleton: 'basic_string_field',
        template: '    *    ',
        fontColor: '#fff',
        statements: [],
        params: [],
        events: {},
        def: {
            params: [],
            type: 'wildcard_string',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {},
    },
    wildcard_boolean: {
        color: '#7C7C7C',
        skeleton: 'basic_boolean_field',
        template: '    *    ',
        fontColor: '#fff',
        statements: [],
        params: [],
        events: {},
        def: {
            params: [],
            type: 'wildcard_boolean',
        },
        paramsKeyMap: {},
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {},
    },
    hidden_string: {
        color: '#7C7C7C',
        skeleton: 'basic_string_field',
        template: '    %1    ',
        fontColor: '#fff',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'hidden_string',
        },
        paramsKeyMap: {
            VALUE: 0,
        },
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    hidden_boolean: {
        color: '#7C7C7C',
        skeleton: 'basic_boolean_field',
        template: '    %1    ',
        fontColor: '#fff',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: '?',
                clearBG: true,
                color: 'white',
            },
        ],
        events: {},
        def: {
            params: [],
            type: 'hidden_boolean',
        },
        paramsKeyMap: {},
        class: 'etc',
        isNotFor: [],
        func: function(sprite, script) {},
    },
    //endregion basic 기본
    //region basic 기본
    boolean_shell: {
        color: '#AEB8FF',
        skeleton: 'basic_boolean_field',
        template: '%1',
        isPrimitive: true,
        params: [
            {
                type: 'Text',
                text: 'A',
                color: '#3D3D3D',
            },
        ],
        func: function(sprite, script) {},
    },
    //endregion basic 기본
    //region basic 기본
    register_score: {
        color: '#7C7C7C',
        skeleton: 'basic',
        template: '%1를 %2로 정하기 %3',
        statements: [],
        params: [
            {
                type: 'TextInput',
                value: 'score',
            },
            {
                type: 'TextInput',
                value: '1',
            },
            {
                type: 'Indicator',
                color: '#6B6B6B',
                size: 12,
            },
        ],
        events: {},
        def: {
            params: ['score', 1],
            type: 'register_score',
        },
        class: 'checker',
        isNotFor: ['checker'],
        func: function(sprite, script) {
            var obj = {};
            obj[this.block.params[0]] = this.block.params[1];
            if (typeof entrylms !== 'undefined')
                entrylms.emit('registerScore', obj);
            return script.callReturn();
        },
    },
    //endregion basic 기본
};

_.extend(Entry.block, block);


(function() {
    // console.log('hw', Entry.HW, Entry.Arduino);
    for(let id in Entry.HARDWARE_LIST) {
        const hw = Entry.HARDWARE_LIST[id];
        if('setLanguage' in hw) {
            var hwLang = hw.setLanguage();
            var data = hwLang[global.Lang.type];
            for(let key in data) {
                _.extend(Lang[key], data[key]);
            }
        }
        if('getBlocks' in hw) {
            var block = hw.getBlocks();
            _.extend(Entry.block, block);
        }
    };

    for (var type in Entry.block) {
        var block = Entry.block[type];
        if (!block.isNotFor) block.isNotFor = [];
        if (block.parent) {
            var f = function() {};
            f.prototype = Entry.block[block.parent];
            var schema = new f();
            schema.syntax = undefined;
            for (var key in block) {
                schema[key] = block[key];
            }
            Entry.block[type] = schema;
        }
    }
})();

if (typeof exports == 'object') {
    exports.block = Entry.block;
}
