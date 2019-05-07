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

Entry.AsomeBoard = {
    id: ['FF.FF', '1A.1'],
    name: 'AsomeBoard',
    url: 'http://www.asomeit.com/',
    imageName: 'AsomeBoard.png',
    title: {
        ko: 'AsomeBoard',
        en: 'AsomeBoard',
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

Entry.AsomeBoard.setLanguage = function() {
    return {
        ko: {
            template: {
                asomeboard_get_analog_value: 'Analog %1 번 센서값',
                asomeboard_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                asomeboard_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
                asomeboard_toggle_led: '디지털 %1 번 핀 %2 %3',
                asomeboard_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                asomeboard_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                asomeboard_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                asomeboard_get_digital: '디지털 %1 번 센서값',
            },
        },
        en: {
            template: {
                asomeboard_get_analog_value: 'Analog %1 Sensor value',
                asomeboard_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                asomeboard_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                asomeboard_toggle_led: 'Digital %1 Pin %2 %3',
                asomeboard_digital_pwm: 'Digital %1 Pin %2 %3',
                asomeboard_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                asomeboard_set_servo: 'Set servo pin %1 angle as %2 %3',
                asomeboard_get_digital: 'Digital %1 Sensor value',
            },
        },
    };
};

Entry.AsomeBoard.blockMenuBlocks = [
    'asomeboard_toggle_led',
];

Entry.AsomeBoard.getBlocks = function() {
    return {
        asomeboard_toggle_led: {
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
                type: 'asomeboard_toggle_led',
            },
            isNotFor: ['AsomeBoard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = String.format("OutputPin({0}).{1}()", port, value);
                    return script;
                } 
                
                if (pd.msg_id.indexOf(script.msg_id) >= 0) {
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

module.exports = Entry.AsomeBoard;
