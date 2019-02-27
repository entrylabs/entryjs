'use strict';
Entry.MODI = {
    id: '16.1',
    name: 'modi',
    url: 'http://www.luxrobo.com/',
    imageName: 'modi.png',
    title: {
        ko: '모디',
        en: 'MODI',
    },
    setZero: function() {
        Entry.hw.sendQueue.moduleValue = {
            led: [],
            motor: [],
            speaker: [],
            display: [],
        };
        Entry.hw.sendQueue['getProperty'] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0,
        };
        Entry.hw.update();
    },
    initSend: function() {
        Entry.hw.sendQueue.moduleValue = {
            led: [],
            motor: [],
            speaker: [],
            display: [],
        };
        Entry.hw.sendQueue['getProperty'] = {};
        Entry.hw.getModule = {
            id: 0,
            property: 0,
        };
        Entry.hw.update();
    },
    getModule: {
        id: 0,
        property: 0,
    },
    microphoneList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['mic'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['mic'].length; i++) {
            if (moduleData['mic'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    environmentList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['environment'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['environment'].length; i++) {
            if (moduleData['environment'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    dialList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['dial'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['dial'].length; i++) {
            if (moduleData['dial'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    gyroscopeList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['gyro'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['gyro'].length; i++) {
            if (moduleData['gyro'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    buttonList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['button'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['button'].length; i++) {
            if (moduleData['button'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    infraredList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['ir'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['ir'].length; i++) {
            if (moduleData['ir'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ultrasonicList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['ultrasonic'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['ultrasonic'].length; i++) {
            if (moduleData['ultrasonic'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    motorList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['motor'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }
        list = [];
        for (var i = 0; i < moduleData['motor'].length; i++) {
            if (moduleData['motor'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    ledList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['led'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['led'].length; i++) {
            if (moduleData['led'][i]) list.push([i, i]);
        }
        return list;
    },
    speakerList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['speaker'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['speaker'].length; i++) {
            if (moduleData['speaker'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
    displayList: function() {
        var list;
        var moduleData = Entry.hw.portData['module'] || {};

        if (moduleData['display'] === undefined) {
            return [[Lang.Blocks.no_target, 'null']];
        }

        list = [];
        for (var i = 0; i < moduleData['display'].length; i++) {
            if (moduleData['display'][i]) list.push([i.toString(), i.toString()]);
        }
        return list;
    },
};
Entry.MODI.blockMenuBlocks = [
    //MODI
    'modi_microphone_value',
    'modi_environment_value',
    'modi_dial_value',
    'modi_gyroscope_value',
    'modi_button_value',
    'modi_button_true',
    'modi_button_false',
    'modi_infrared_value',
    'modi_ultrasonic_value',
    'modi_set_motor_value',
    'modi_change_motor_upper_value',
    'modi_change_motor_bottom_value',
    'modi_clear_led',
    'modi_set_led_rgb',
    'modi_set_led_color',
    'modi_set_basic_speaker',
    'modi_set_custom_speaker',
    'modi_print_display_by_value',
];
//region modi 모디
Entry.MODI.getBlocks = function() {
    return {
        modi_microphone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '마이크 %1번의 볼륨',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.microphoneList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'modi_microphone_value',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'microphone',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['mic'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                return pd.value[2];
            },
        },
        modi_environment_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '환경센서 %1번의 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.environmentList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_enviroment_temperature, 6],
                        [Lang.Blocks.modi_enviroment_humidity, 7],
                        [Lang.Blocks.modi_enviroment_illuminance, 2],
                        [Lang.Blocks.modi_enviroment_red, 3],
                        [Lang.Blocks.modi_enviroment_bule, 5],
                        [Lang.Blocks.modi_enviroment_green, 4],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 6],
                type: 'modi_environment_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'environment',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');
                var property = script.getNumberField('property');

                var pd = JSON.parse(Entry.hw.portData.module['environment'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[property]) {
                    pd.value[property] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
                Entry.MODI.getModule.property = property;
            }*/
                }

                return pd.value[property];
            },
        },
        modi_dial_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '다이얼 %1번의 각도',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.dialList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'modi_dial_value',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'dial',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['dial'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                var moduleID = JSON.parse(Entry.hw.portData.module['dial'][key]).id;

                return pd.value[2];
            },
        },
        modi_gyroscope_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '자이로센서 %1번의 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.gyroscopeList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['Roll', 2],
                        ['Pitch', 3],
                        ['Yaw', 4],
                        [Lang.Blocks.modi_gyroscope_xAcceleratior, 8],
                        [Lang.Blocks.modi_gyroscope_yAcceleratior, 9],
                        [Lang.Blocks.modi_gyroscope_zAcceleratior, 10],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 2],
                type: 'modi_gyroscope_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'gyroscope',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');
                var property = script.getNumberField('property');

                var pd = JSON.parse(Entry.hw.portData.module['gyro'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }
                if (!pd.value[property]) {
                    pd.value[property] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
                Entry.MODI.getModule.property = property;
            }*/
                }

                return pd.value[property];
            },
        },
        modi_button_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '버튼 %1번의 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.buttonList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['Click', 2], ['Double Click', 3], ['Toggle', 5], ['Press', 4]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null, 2],
                type: 'modi_button_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue || !Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name');
                var property = script.getNumberField('property');
                var moduleID = JSON.parse(Entry.hw.portData.module['button'][key]).id;
                var pd = JSON.parse(Entry.hw.portData.module['button'][key]);

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[property]) {
                    pd.value[property] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Entry.MODI.getModule.property != property || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: property, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
                Entry.MODI.getModule.property = property;
            }*/
                    return 0;
                }

                return pd.value[property];
            },
        },
        modi_button_true: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '눌림',
            def: {
                params: [null],
                type: 'modi_button_true',
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 100;
            },
        },
        modi_button_false: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '안눌림',
            def: {
                params: [null],
                type: 'modi_button_false',
            },
            class: 'button',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                return 0;
            },
        },
        modi_infrared_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '적외선 %1번 센서의 거리(%)',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.infraredList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'modi_infrared_value',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'infrared',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['ir'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                return pd.value[2];
            },
        },
        modi_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: '초음파 %1번 센서의 거리(%)',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ultrasonicList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'modi_ultrasonic_value',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'ultrasonic',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                var key = script.getStringField('name');

                var pd = JSON.parse(Entry.hw.portData.module['ultrasonic'][key]);
                var moduleID = pd.id;

                if (!Entry.hw.sendQueue['getProperty']) {
                    Entry.MODI.initSend();
                }

                if (!pd.value[2]) {
                    pd.value[2] = 0;

                    // send GETPROPERTY
                    /*if(Entry.MODI.getModule.id != moduleID || Object.keys(Entry.hw.sendQueue["getProperty"]).length == 0){
                Entry.hw.sendQueue["getProperty"][moduleID] = JSON.stringify({module: 2, id: moduleID});
                Entry.MODI.getModule.id = moduleID;
            }*/
                }

                return pd.value[2];
            },
        },
        modi_set_motor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: '모터 %1번 %2의 상단값은 %3 하단값은 %4 (으)로 정하기 %5',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_set_motor_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
                upper: 2,
                bottom: 3,
            },
            class: 'motor',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    property = script.getStringField('property'),
                    upper = script.getNumberValue('upper'),
                    bottom = script.getNumberValue('bottom');
                var moduleID = JSON.parse(Entry.hw.portData.module['motor'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },
        },
        modi_change_motor_upper_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '모터 %1번 %2의 상단값을 %3만큼 바꾸기 %4',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_change_motor_upper_value',
            },
            paramsKeyMap: {
                name: 0,
                property: 1,
                value: 2,
            },
            class: 'motor',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    value = script.getNumberValue('value'),
                    property = script.getStringField('property');

                var pd = JSON.parse(Entry.hw.portData.module['motor'][key]);
                var moduleID = pd.id;

                var sq = Entry.hw.sendQueue.moduleValue;
                var upper = value,
                    bottom = 0;

                if (upper > 100) upper = 100;
                else if (upper < 0 && property == 'MOTOR_ANGLE') upper = 0;
                else if (upper < -100 && property != 'MOTOR_ANGLE') upper = -100;

                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },
        },
        modi_change_motor_bottom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '모터 %1번 %2의 하단값을 %3만큼 바꾸기 %4',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.motorList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_motor_angle, 'MOTOR_ANGLE'],
                        [Lang.Blocks.modi_motor_speed, 'MOTOR_SPEED'],
                        [Lang.Blocks.modi_motor_torque, 'MOTOR_TORQUE'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            events: {},
            def: {
                params: [
                    null,
                    'MOTOR_ANGLE',
                    {
                        type: 'text',
                        params: ['100'],
                    },
                ],
                type: 'modi_change_motor_bottom_value',
            },
            class: 'motor',
            isNotFor: ['modi'],
            paramsKeyMap: {
                name: 0,
                property: 1,
                value: 2,
            },
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    value = script.getNumberValue('value'),
                    property = script.getStringField('property');

                var pd = JSON.parse(Entry.hw.portData.module['motor'][key]);
                var moduleID = pd.id;

                var sq = Entry.hw.sendQueue.moduleValue;
                var upper = 0,
                    bottom = value;

                if (bottom > 100) bottom = 100;
                else if (bottom < 0 && property == 'MOTOR_ANGLE') bottom = 0;
                else if (bottom < -100 && property != 'MOTOR_ANGLE') bottom = -100;

                sq['motor'][key] = JSON.stringify({
                    module: property,
                    id: moduleID,
                    value1: upper,
                    value2: bottom,
                });

                return script.callReturn();
            },
        },
        modi_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: 'LED %1번의 색 끄기 %2',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ledList,
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
                params: [null],
                type: 'modi_clear_led',
            },
            paramsKeyMap: {
                name: 0,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name');
                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: 0,
                    value2: 0,
                    value3: 0,
                });

                return script.callReturn();
            },
        },
        modi_set_led_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: 'LED %1번 R %2 G %3 B %4  %5',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ledList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_set_led_rgb',
            },
            paramsKeyMap: {
                name: 0,
                rValue: 1,
                gValue: 2,
                bValue: 3,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name');
                var red = script.getNumberValue('rValue');
                var green = script.getNumberValue('gValue');
                var blue = script.getNumberValue('bValue');

                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: red,
                    value2: green,
                    value3: blue,
                });

                return script.callReturn();
            },
        },
        modi_set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: 'LED %1번 색 %2로 정하기 %3',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.ledList,
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
            def: {
                params: [null],
                type: 'modi_set_led_color',
            },
            paramsKeyMap: {
                name: 0,
                color: 1,
            },
            class: 'led',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name');
                var color = script.getStringField('color');

                color = color.substring(1, 7);
                var bigint = parseInt(color, 16);
                var red = Math.round(((bigint >> 16) & 255) / 255 * 100);
                var green = Math.round(((bigint >> 8) & 255) / 255 * 100);
                var blue = Math.round((bigint & 255) / 255 * 100);
                var moduleID = JSON.parse(Entry.hw.portData.module['led'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['led'][key] = JSON.stringify({
                    module: 'LED_RGB',
                    id: moduleID,
                    value1: red,
                    value2: green,
                    value3: blue,
                });

                return script.callReturn();
            },
        },
        modi_set_basic_speaker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '스피커 %1번을 %2음으로 크기는 %3(으)로 정하기 %4',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.speakerList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.modi_speaker_F_PA_5, 'F_PA_5'],
                        [Lang.Blocks.modi_speaker_F_SOL_5, 'F_SOL_5'],
                        [Lang.Blocks.modi_speaker_F_RA_5, 'F_RA_5'],
                        [Lang.Blocks.modi_speaker_F_SO_5, 'F_SO_5'],
                        [Lang.Blocks.modi_speaker_F_PA_S_5, 'F_PA_S_5'],
                        [Lang.Blocks.modi_speaker_F_SOL_S_5, 'F_SOL_S_5'],
                        [Lang.Blocks.modi_speaker_F_RA_S_5, 'F_RA_S_5'],
                        [Lang.Blocks.modi_speaker_F_DO_6, 'F_DO_6'],
                        [Lang.Blocks.modi_speaker_F_RE_6, 'F_RE_6'],
                        [Lang.Blocks.modi_speaker_F_MI_6, 'F_MI_6'],
                        [Lang.Blocks.modi_speaker_F_PA_6, 'F_PA_6'],
                        [Lang.Blocks.modi_speaker_F_SOL_6, 'F_SOL_6'],
                        [Lang.Blocks.modi_speaker_F_RA_6, 'F_RA_6'],
                        [Lang.Blocks.modi_speaker_F_SO_6, 'F_SO_6'],
                        [Lang.Blocks.modi_speaker_F_DO_S_6, 'F_DO_S_6'],
                        [Lang.Blocks.modi_speaker_F_RE_S_6, 'F_RE_S_6'],
                        [Lang.Blocks.modi_speaker_F_PA_S_6, 'F_PA_S_6'],
                        [Lang.Blocks.modi_speaker_F_SOL_S_6, 'F_SOL_S_6'],
                        [Lang.Blocks.modi_speaker_F_RA_S_6, 'F_RA_S_6'],
                        [Lang.Blocks.modi_speaker_F_DO_7, 'F_DO_7'],
                        [Lang.Blocks.modi_speaker_F_RE_7, 'F_RE_7'],
                        [Lang.Blocks.modi_speaker_F_MI_7, 'F_MI_7'],
                        [Lang.Blocks.modi_speaker_F_DO_S_7, 'F_DO_S_7'],
                        [Lang.Blocks.modi_speaker_F_RE_S_7, 'F_RE_S_7'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            events: {},
            def: {
                params: [
                    null,
                    'F_DO_6',
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_set_basic_speaker',
            },
            paramsKeyMap: {
                name: 0,
                frequence: 1,
                volume: 2,
            },
            class: 'speaker',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    frequence = script.getStringField('frequence'),
                    volume = script.getNumberValue('volume', script);
                var moduleID = JSON.parse(Entry.hw.portData.module['speaker'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['speaker'][key] = JSON.stringify({
                    module: 'SPEAKER_BUZZER',
                    id: moduleID,
                    value1: frequence,
                    value2: volume,
                });

                return script.callReturn();
            },
        },
        modi_set_custom_speaker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '스피커 %1번의 진동수는 %2 크기는 %3(으)로 정하기 %4',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.speakerList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'modi_set_custom_speaker',
            },
            paramsKeyMap: {
                name: 0,
                frequence: 1,
                volume: 2,
            },
            class: 'speaker',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }
                var key = script.getStringField('name'),
                    frequence = script.getNumberValue('frequence'),
                    volume = script.getNumberValue('volume', script);
                var moduleID = JSON.parse(Entry.hw.portData.module['speaker'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['speaker'][key] = JSON.stringify({
                    module: 'SPEAKER_BUZZER',
                    id: moduleID,
                    value1: frequence,
                    value2: volume,
                });

                return script.callReturn();
            },
        },
        modi_print_display_by_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: '디스플레이 %1번의 화면에 %2 보이기 %3',
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.MODI.displayList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['text'],
                    },
                ],
                type: 'modi_print_display_by_value',
            },
            paramsKeyMap: {
                name: 0,
                text: 1,
            },
            class: 'display',
            isNotFor: ['modi'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.moduleValue) {
                    Entry.MODI.initSend();
                }

                var key = script.getStringField('name'),
                    text = script.getStringValue('text');

                if (text.length > 27) {
                    return script.callReturn();
                }

                var moduleID = JSON.parse(Entry.hw.portData.module['display'][key]).id;

                var sq = Entry.hw.sendQueue.moduleValue;
                sq['display'][key] = JSON.stringify({
                    module: 'DISPLAY_TEXT',
                    id: moduleID,
                    value1: text,
                });
                return script.callReturn();
            },
        },
    };
};
//endregion modi 모디

module.exports = Entry.MODI;
