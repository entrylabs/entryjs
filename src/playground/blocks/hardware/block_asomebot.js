'use strict';

function format_str() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function random_str(count)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i <count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Entry.AsomeBot = {
    id: '32.1',
    name: 'AsomeBot',
    url: 'http://www.asomeit.com/',
    imageName: 'AsomeBot.png',
    title: {
        ko: 'AsomeBot',
        en: 'AsomeBot',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },
    asyncFlowControl: function({ script, data }, scope) {
        if (!this.isExecBlock && !scope.isStart) {
            const blockId = this.getHashKey();
            this.isExecBlock = true;
            scope.isStart = true;
            scope.timeFlag = 1;
            this.nowBlockId = blockId;
            this.blockIds[blockId] = false;
            _merge(Entry.hw.sendQueue, {
                [blockId]: data,
            });
            Entry.hw.update();
            setTimeout(() => {
                scope.timeFlag = 0;
            });
            return false;
        } else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
            delete this.blockIds[this.nowBlockId];
            delete scope.isStart;
            this.execTimeFlag = 0;
            this.execTimeFlag = undefined;
            this.isExecBlock = false;
            Entry.engine.isContinue = false;
            return true;
        }
        return false;
    },
    postCallReturn: function(args) {
        const { script } = args;
        if (!this.asyncFlowControl(args, script)) {
            return Entry.STATIC.BREAK;
        }
    },
};

Entry.AsomeBot.setLanguage = function() {
    return {
        ko: {
            template: {
                asomebot_toggle_led: '파란 LED %1 %2',
                asomebot_get_ultrasonic_value: '초음파 센서 거리 센서값',

                asomebot_buzzer_open: '부저 켜기 %1',
                asomebot_buzzer_note: '부저를 %1음으로 %2초 연주하기 %3',
                asomebot_buzzer_tone: '부저를 %1주파수로 %2초 연주하기 %3',
                asomebot_buzzer_close: '부저 끄기 %1',

                asomebot_align: '중심잡기 %1 %2 %3 %4 %5',
                asomebot_home: '차렷 %1',
                asomebot_angle: '%1번 모터를 %2도로 %3초 동안 회전 %4',

                asomebot_forward: '앞으로 전진 %1',
                asomebot_forward2: '앞으로 전진 %1 %2 %3',

                asomebot_backward: '뒤로 후진 %1',
                asomebot_backward2: '뒤로 후진 %1 %2 %3',

                asomebot_turn_left: '왼쪽으로 회전 %1',
                asomebot_turn_left2: '왼쪽으로 회전 %1 %2',

                asomebot_turn_right: '오른쪽으로 회전 %1',
                asomebot_turn_right2: '오른쪽으로 회전 %1 %2',

                asomebot_mouse: '발인사하기 %1 %2', // 왼쪽, 오른쪽
                asomebot_flap: '깡총 뛰기 %1',
                asomebot_warigari: '트위스트 춤추기 %1',
                asomebot_tock: '발바닥 까닥하기 %1 %2', // 왼쪽, 오른쪽
                asomebot_tick_tock: '발목 비틀어서 까닥하기 %1',
                asomebot_wiggle: '좌우로 흔들 #1 %1',
                asomebot_swing2: '좌우로 흔들 #2 %1',
                asomebot_ballet: '발바닥 모으기 %1',
                asomebot_swing: '발목 비틀어서 발바닥 들기 %1 %2', // 왼쪽(left_swing), 오른쪽(right_swing)
                asomebot_yaho: '야호 %1',
                asomebot_moonwalk: '문워크 춤추기 %1',

                internet_connect: '인터넷 연결하기 %1 %2 %3',
                internet_open_ap: '공유기 모드로 변경하기 %1 %2',
                internet_open_udp: '%1번 포트로 UDP 소켓 열기 %2',
                internet_udp_msg: 'UDP 수신값',
                internet_send_msg: '%1코드로 %2메시지를 전송하기 %3',
            },
        },
        en: {
            template: {
                asomebot_toggle_led: 'Blue LED %1 %2',
                asomebot_get_ultrasonic_value: 'distance',

                asomebot_buzzer_open: 'Buzzer on %1',
                asomebot_buzzer_note: 'Play note %1 in %2 sec %3',
                asomebot_buzzer_tone: 'Mkae sound on %1 Hz in %2 sec %3',
                asomebot_buzzer_close: 'Buzzer off %1',

                asomebot_align: 'Set align %1 %2 %3 %4 %5',
                asomebot_home: 'Attention %1',
                asomebot_angle: 'Set angle of motor %1 to %2 degree in %3 sec %4',

                asomebot_forward: 'Moving forward %1',
                asomebot_forward2: 'Moving forward %1 %2 %3',

                asomebot_backward: 'Moving backward %1',
                asomebot_backward2: 'Moving backward %1 %2 %3',

                asomebot_turn_left: 'Turn left %1',
                asomebot_turn_left2: 'Turn left %1 %2',

                asomebot_turn_right: 'Turn right %1',
                asomebot_turn_right2: 'Turn right %1 %2',

                asomebot_mouse: 'Greeting %1 %2',
                asomebot_flap: 'Flap %1',
                asomebot_warigari: 'Twist %1',
                asomebot_tock: 'Tock %1 %2',
                asomebot_tick_tock: 'Tick tock %1',
                asomebot_wiggle: 'Wiggle %1',
                asomebot_swing2: 'Swing %1',
                asomebot_ballet: 'Ballet %1',
                asomebot_swing: 'Swing %1 %2',
                asomebot_yaho: 'Yaho %1',
                asomebot_moonwalk: 'Moonwalk %1',

                internet_connect: 'Connect to internet - %1 %2 %3',
                internet_open_ap: 'Change to access point mode - %1 %2',
                internet_open_udp: 'Open UDP socket on post %1 %2',
                internet_udp_msg: 'UDP message',
                internet_send_msg: 'Send message %2 to %1 %3',
            },
        },
    };
};

Entry.AsomeBot.blockMenuBlocks = [
    'asomebot_toggle_led',
    'asomebot_get_ultrasonic_value',

    'asomebot_buzzer_open',
    'asomebot_buzzer_note',
    'asomebot_buzzer_tone',
    'asomebot_buzzer_close',

    'asomebot_angle',
    'asomebot_align',
    'asomebot_home',

    'asomebot_forward',
    'asomebot_forward2',

    'asomebot_backward',
    'asomebot_backward2',

    'asomebot_turn_left',
    'asomebot_turn_left2',

    'asomebot_turn_right',
    'asomebot_turn_right2',

    'asomebot_mouse',
    'asomebot_flap',
    'asomebot_warigari',
    'asomebot_tock',
    'asomebot_tick_tock',
    'asomebot_wiggle',
    'asomebot_swing2',
    'asomebot_ballet',
    'asomebot_swing',
    'asomebot_yaho',
    'asomebot_moonwalk',
 
    'internet_connect',
    'internet_open_ap',
    'internet_open_udp',
    'internet_udp_msg',
    'internet_send_msg',
];

Entry.AsomeBot.getBlocks = function() {
    return {
        // Basic
        asomebot_toggle_led: {
            template: Lang.template.asomebot_toggle_led,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null
                ],
                type: 'asomebot_toggle_led',
            },
            class: 'Basic',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;

                    // 어썸보드 built-in LED가 반대로 연결되어 있음
                    if (value == "on") {
                        value = "off";
                    } else {
                        value = "on";
                    }

                    sq.msg = format_str("OutputPin(4).{0}()", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_get_ultrasonic_value: {
            template: Lang.template.asomebot_get_ultrasonic_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                type: 'asomebot_get_ultrasonic_value',
            },
            class: 'Basic',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!sprite.old_tick) {
                    sprite.old_tick = new Date().getTime() - 1000;
                }
                var tick = new Date().getTime();

                if ((tick - sprite.old_tick) > 500) {
                    sq.msg_id = random_str(16);
                    sq.msg = "print('#' + 'DT ' + str(hcsr04.get_distance()) + '  ###')";
                    sprite.old_tick = tick;
                }

                return pd.distance;
            },
            syntax: undefined,
        },
        
        // Buzzer
        asomebot_buzzer_open: {
            template: Lang.template.asomebot_buzzer_open,
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
                type: 'asomebot_buzzer_open',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "turnoff_pins( (1, 5, 6, 7, 8) ); import music; music.open(1)"
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_note: {
            template: Lang.template.asomebot_buzzer_note,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['C4'],
                    },
                    {
                        type: 'text',
                        params: ['0.3'],
                    },
                    null
                ],
                type: 'asomebot_buzzer_note',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = parseInt( parseFloat(script.getValue('VALUE2')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("music.note('{0}', {1})", value1, String(value2));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_tone: {
            template: Lang.template.asomebot_buzzer_tone,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['400'],
                    },
                    {
                        type: 'text',
                        params: ['0.3'],
                    },
                    null
                ],
                type: 'asomebot_buzzer_tone',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = parseInt( parseFloat(script.getValue('VALUE2')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("music.tone({0}, {1})", value1, String(value2));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_buzzer_close: {
            template: Lang.template.asomebot_buzzer_close,
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
                type: 'asomebot_buzzer_close',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "turnoff_pins( (1, 5, 6, 7, 8) ); import asomebot; asomebot.ready(5, 6, 7,8)"
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Moving
        asomebot_align: {
            template: Lang.template.asomebot_align,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null
                ],
                type: 'asomebot_align',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = script.getValue('VALUE3');
                var value4 = script.getValue('VALUE4');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.align({0}, {1}, {2}, {3})", value1, value2, value3, value4);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_home: {
            template: Lang.template.asomebot_home,
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
                type: 'asomebot_home',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.home()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_angle: {
            template: Lang.template.asomebot_angle,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null
                ],
                type: 'asomebot_angle',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = parseInt( parseFloat(script.getValue('VALUE3')) * 1000 );

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.angles( [{0}], [{1}], {2})", value1, value2, String(value3));
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_forward: {
            template: Lang.template.asomebot_forward,
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
                type: 'asomebot_forward',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.forward()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_backward: {
            template: Lang.template.asomebot_backward,
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
                type: 'asomebot_backward',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.backward()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_left: {
            template: Lang.template.asomebot_turn_left,
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
                type: 'asomebot_turn_left',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.turn_left()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_right: {
            template: Lang.template.asomebot_turn_right,
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
                type: 'asomebot_turn_right',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.turn_right()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_forward2: {
            template: Lang.template.asomebot_forward2,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['150'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null
                ],
                type: 'asomebot_forward2',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.forward(s1={0}, s2={1})", value1, value2);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_backward2: {
            template: Lang.template.asomebot_backward2,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['150'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null
                ],
                type: 'asomebot_backward2',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.backward(s1={0}, s2={1})", value1, value2);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_left2: {
            template: Lang.template.asomebot_turn_left2,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null
                ],
                type: 'asomebot_turn_left2',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.turn_left(s={0})", value1);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_turn_right2: {
            template: Lang.template.asomebot_turn_right2,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null
                ],
                type: 'asomebot_turn_right2',
            },
            class: 'Moving',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.turn_right(s={0})", value1);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Dancing
        asomebot_mouse: {
            template: Lang.template.asomebot_mouse,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null, null],
                type: 'asomebot_mouse',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.mouse({0})", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_flap: {
            template: Lang.template.asomebot_flap,
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
                type: 'asomebot_flap',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.flap()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_warigari: {
            template: Lang.template.asomebot_warigari,
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
                type: 'asomebot_warigari',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.warigari()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_tock: {
            template: Lang.template.asomebot_tock,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null, null],
                type: 'asomebot_tock',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.tock({0})", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_tick_tock: {
            template: Lang.template.asomebot_tick_tock,
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
                type: 'asomebot_tick_tock',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.tick_tock()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_wiggle: {
            template: Lang.template.asomebot_wiggle,
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
                type: 'asomebot_wiggle',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.wiggle()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_swing2: {
            template: Lang.template.asomebot_swing2,
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
                params: [null, null],
                type: 'asomebot_swing2',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.swing()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_ballet: {
            template: Lang.template.asomebot_ballet,
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
                type: 'asomebot_ballet',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.ballet()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_yaho: {
            template: Lang.template.asomebot_yaho,
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
                type: 'asomebot_yaho',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.yaho()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_swing: {
            template: Lang.template.asomebot_swing,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ '왼쪽',    '1'],
                        [ '오른쪽', '-1'],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [null],
                type: 'asomebot_swing',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringField('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    if (value == '1') {
                        sq.msg = format_str("asomebot.left_swing()");
                    } else {
                        sq.msg = format_str("asomebot.right_swing()");
                    }
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomebot_moonwalk: {
            template: Lang.template.asomebot_moonwalk,
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
                type: 'asomebot_moonwalk',
            },
            class: 'Dancing',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("asomebot.moonwalk()");
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },

        // Internet
        internet_connect: {
            template: Lang.template.internet_connect,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['SSID'],
                    },
                    {
                        type: 'text',
                        params: ['Password'],
                    },
                    null
                ],
                type: 'internet_connect',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getStringValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("import internet; internet.connect('{0}', '{1}')", value1, value2);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        internet_open_ap: {
            template: Lang.template.internet_open_ap,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['SSID'],
                    },
                    null
                ],
                type: 'internet_open_ap',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getStringValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("import internet; internet.open_ap('{0}')", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        internet_open_udp: {
            template: Lang.template.internet_open_udp,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
            paramsKeyMap: {
                VALUE: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        defaultType: 'number',
                        params: ['1234'],
                    },
                    null
                ],
                type: 'internet_open_udp',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value = script.getValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("import udp_socket; udp_socket.open({0})", value);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        internet_udp_msg: {
            template: Lang.template.internet_udp_msg,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                type: 'internet_udp_msg',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!sprite.old_tick) {
                    sprite.old_id = "";
                    sprite.old_tick = new Date().getTime() - 1000;
                }
                var tick = new Date().getTime();

                if ((tick - sprite.old_tick) > 300) {
                    sq.msg_id = random_str(16);
                    sq.msg = "udp_socket.read_text()";
                    sprite.old_tick = tick;
                }

                if (sprite.old_id != pd.udp_id) {
                    sprite.old_id = pd.udp_id;
                    return pd.udp_msg;
                } else {
                    return pd.udp_id;
                }
            },
            syntax: undefined,
        },
        internet_send_msg: {
            template: Lang.template.internet_send_msg,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['Code'],
                    },
                    {
                        type: 'text',
                        params: ['Message'],
                    },
                    null
                ],
                type: 'internet_send_msg',
            },
            class: 'Internet',
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getStringValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("import internet; internet.send_msg('{0}', '{1}')", value1, value2);
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
    };
};

module.exports = Entry.AsomeBot;
