'use strict';

String.format = function() {
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
    id: ['F0.F0', '1A.1'],
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
                asomebot_toggle_led: '디지털 %1 번 핀 %2 %3',
                asomebot_home: '차렷',
                asomebot_forward: '앞으로 전진',
                asomebot_backward: '뒤로 후진',
                asomebot_turn_left: '왼쪽으로 회전',
                asomebot_turn_right: '오른쪽으로 회전',
            },
        },
        en: {
            template: {
                asomebot_toggle_led: 'Digital %1 Pin %2 %3',
                asomebot_home: 'attention',
                asomebot_forward: 'Moving forward',
                asomebot_backward: 'Moving backward',
                asomebot_turn_left: 'Turn left',
                asomebot_turn_right: 'Turn right',
            },
        },
    };
};

Entry.AsomeBot.blockMenuBlocks = [
    'asomebot_toggle_led',
    'asomebot_home',
    'asomebot_forward',
    'asomebot_backward',
    'asomebot_turn_left',
    'asomebot_turn_right',
];

Entry.AsomeBot.getBlocks = function() {
    return {
        asomebot_toggle_led: {
            template: Lang.template.arduino_ext_toggle_led,
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
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [0],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                ],
                type: 'asomebot_toggle_led',
            },
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                sq.msg_id = random_str(16);
                sq.msg = String.format("OutputPin({0}).{1}()", port, value);
                return script.callReturn();
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
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.home()");
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
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.forward()");
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
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.backward()");
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
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.turn_left()");
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
            isNotFor: ['AsomeBot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("asomebot.turn_righ()");
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
