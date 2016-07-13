if (typeof Entry !== "object")
    var Entry = {};

if (typeof exports == "object") {
    var Lang = require('../../extern/lang/ko.js').Lang;
    if (typeof Entry !== "object")
        var Entry = {};
    Entry.Bitbrick = {};
    EntryStatic = {};
}

Entry.block = {
    "albert_hand_found": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "albert_hand_found"
        },
        "class": "albert_sensor",
        "isNotFor": ["albert"],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData
            return pd.leftProximity > 40 || pd.rightProximity > 40;
        }
    },
    "albert_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.ALBERT_sensor_leftProximity ,"leftProximity"],
                    [Lang.Blocks.ALBERT_sensor_rightProximity,"rightProximity"],
                    [Lang.Blocks.ALBERT_sensor_light,"light"],
                    [Lang.Blocks.ALBERT_sensor_battery,"battery"],
                    [Lang.Blocks.ALBERT_sensor_signalStrength,"signalStrength"],
                    [Lang.Blocks.ALBERT_sensor_frontOid,"frontOid"],
                    [Lang.Blocks.ALBERT_sensor_backOid,"backOid"],
                    [Lang.Blocks.ALBERT_sensor_positionX,"positionX"],
                    [Lang.Blocks.ALBERT_sensor_positionY,"positionY"],
                    [Lang.Blocks.ALBERT_sensor_orientation,"orientation"]
                ],
                "value": "leftProximity",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "albert_value"
        },
        "paramsKeyMap": {
            "DEVICE": 0
        },
        "class": "albert_sensor",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData;
            var dev = script.getField('DEVICE');
            return pd[dev];
        }
    },
    "albert_move_forward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "albert_move_forward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.leftWheel = 30;
                sq.rightWheel = 30;
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer);
                }, timeValue);
                Entry.Albert.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_move_backward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "albert_move_backward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.leftWheel = -30;
                sq.rightWheel = -30;
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer);
                }, timeValue);
                Entry.Albert.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_turn_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "albert_turn_for_secs",
            "id": "como"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var direction = script.getField("DIRECTION", script);
                if (direction == 'LEFT') {
                    sq.leftWheel = -30;
                    sq.rightWheel = 30;
                } else {
                    sq.leftWheel = 30;
                    sq.rightWheel = -30;
                }
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer);
                }, timeValue);
                Entry.Albert.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_change_both_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "albert_change_both_wheels_by"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var left = script.getNumberValue('LEFT');
            var right = script.getNumberValue('RIGHT');
            sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
            sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
            return script.callReturn();
        }
    },
    "albert_set_both_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                null
            ],
            "type": "albert_set_both_wheels_to"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.leftWheel = script.getNumberValue('LEFT');
            sq.rightWheel = script.getNumberValue('RIGHT');
            return script.callReturn();
        }
    },
    "albert_change_wheel_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "albert_change_wheel_by"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');
            if (direction == 'LEFT') {
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
            } else if (direction == 'RIGHT') {
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
            } else {
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
            }
            return script.callReturn();
        }
    },
    "albert_set_wheel_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                null
            ],
            "type": "albert_set_wheel_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');
            if (direction == 'LEFT') {
                sq.leftWheel = value;
            } else if (direction == 'RIGHT') {
                sq.rightWheel = value;
            } else {
                sq.leftWheel = value;
                sq.rightWheel = value;
            }
            return script.callReturn();
        }
    },
    "albert_stop": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "albert_stop",
            "id": "4adb"
        },
        "class": "albert_wheel",
        "isNotFor": [
            "albert"
        ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.leftWheel = 0;
            sq.rightWheel = 0;
            return script.callReturn();
        }
    },
    "albert_set_pad_size_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "108" ]
                },
                {
                    "type": "text",
                    "params": [ "76" ]
                },
                null
            ],
            "type": "albert_set_pad_size_to",
            "id": "5mhg"
        },
        "paramsKeyMap": {
            "WIDTH": 0,
            "HEIGHT": 1
        },
        "class": "albert_wheel",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.padWidth = script.getNumberValue('WIDTH');
            sq.padHeight = script.getNumberValue('HEIGHT');
            return script.callReturn();
        }
    },
    "albert_set_eye_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.red,"4"],
                    [Lang.General.yellow,"6"],
                    [Lang.General.green,"2"],
                    [Lang.Blocks.ALBERT_color_cyan,"3"],
                    [Lang.General.blue,"1"],
                    [Lang.Blocks.ALBERT_color_magenta,"5"],
                    [Lang.General.white,"7"]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "albert_set_eye_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "COLOR": 1
        },
        "class": "albert_led",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            var color = Number(script.getField("COLOR", script));
            if (direction == 'LEFT') {
                sq.leftEye = color;
            } else if (direction == 'RIGHT') {
                sq.rightEye = color;
            } else {
                sq.leftEye = color;
                sq.rightEye = color;
            }
            return script.callReturn();
        }
    },
    "albert_clear_eye": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "albert_clear_eye"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "albert_led",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            if (direction == 'LEFT') {
                sq.leftEye = 0;
            } else if (direction == 'RIGHT') {
                sq.rightEye = 0;
            } else {
                sq.leftEye = 0;
                sq.rightEye = 0;
            }
            return script.callReturn();
        }
    },
    "albert_body_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "ON" ],
                    [ "끄기", "OFF" ]
                ],
                "value": "ON",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "albert_body_led"
        },
        "paramsKeyMap": {
            "STATE": 0
        },
        "class": "albert_led",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var state = script.getField("STATE", script);
            if (state == 'ON') sq.bodyLed = 1;
            else sq.bodyLed = 0;
            return script.callReturn();
        }
    },
    "albert_front_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "ON" ],
                    [ "끄기", "OFF" ]
                ],
                "value": "ON",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "albert_front_led"
        },
        "paramsKeyMap": {
            "STATE": 0
        },
        "class": "albert_led",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var state = script.getField("STATE", script);
            if (state == 'ON') sq.frontLed = 1;
            else sq.frontLed = 0;
            return script.callReturn();
        }
    },
    "albert_beep": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "albert_beep"
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.buzzer = 440;
                sq.note = 0;
                var timeValue = 0.2 * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer);
                }, timeValue);
                Entry.Albert.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.buzzer = 0;
                return script.callReturn();
            }
        }
    },
    "albert_change_buzzer_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "albert_change_buzzer_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var value = script.getNumberValue('VALUE');
            sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
            sq.note = 0;
            return script.callReturn();
        }
    },
    "albert_set_buzzer_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "1000" ]
                },
                null
            ],
            "type": "albert_set_buzzer_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.buzzer = script.getNumberValue('VALUE');
            sq.note = 0;
            return script.callReturn();
        }
    },
    "albert_clear_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "albert_clear_buzzer"
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.buzzer = 0;
            sq.note = 0;
            return script.callReturn();
        }
    },
    "albert_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.note_c + '',"4"],
                    [Lang.General.note_c + '#',"5"],
                    [Lang.General.note_d + '',"6"],
                    [Lang.General.note_e + 'b',"7"],
                    [Lang.General.note_e + '',"8"],
                    [Lang.General.note_f + '',"9"],
                    [Lang.General.note_f + '#',"10"],
                    [Lang.General.note_g + '',"11"],
                    [Lang.General.note_g + '#',"12"],
                    [Lang.General.note_a + '',"13"],
                    [Lang.General.note_b + 'b',"14"],
                    [Lang.General.note_b + '',"15"]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                "4",
                {
                    "type": "text",
                    "params": [ "0.5" ]
                },
                null
            ],
            "type": "albert_play_note_for"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "VALUE": 2
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                var note = script.getNumberField("NOTE", script);
                var octave = script.getNumberField("OCTAVE", script);
                var beat = script.getNumberValue("VALUE", script);
                var tempo = Entry.Albert.tempo;
                note += (octave-1)*12;
                var timeValue = beat*60*1000/tempo;
                script.isStart = true;
                script.timeFlag = 1;
                sq.buzzer = 0;
                sq.note = note;
                if (timeValue > 100) {
                    var timer1 = setTimeout(function() {
                        sq.note = 0;
                        Entry.Albert.removeTimeout(timer1);
                    }, timeValue-100);
                    Entry.Albert.timeouts.push(timer1);
                }
                var timer2 = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer2);
                }, timeValue);
                Entry.Albert.timeouts.push(timer2);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.note = 0;
                return script.callReturn();
            }
        }
    },
    "albert_rest_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "0.25" ]
                },
                null
            ],
            "type": "albert_rest_for"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = script.getNumberValue('VALUE');
                timeValue = timeValue*60*1000/Entry.Albert.tempo;
                sq.buzzer = 0;
                sq.note = 0;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Albert.removeTimeout(timer);
                }, timeValue);
                Entry.Albert.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }
    },
    "albert_change_tempo_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "20" ]
                },
                null
            ],
            "type": "albert_change_tempo_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            Entry.Albert.tempo += script.getNumberValue('VALUE');
            if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
            return script.callReturn();
        }
    },
    "albert_set_tempo_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "60" ]
                },
                null
            ],
            "type": "albert_set_tempo_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "albert_buzzer",
        "isNotFor": [ "albert" ],
        "func": function (sprite, script) {
            Entry.Albert.tempo = script.getNumberValue('VALUE');
            if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
            return script.callReturn();
        }
    },
    "albert_move_forward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.leftWheel = 30;
                sq.rightWheel = 30;
                var timeValue = 1 * 1000;
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
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_move_backward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = 1 * 1000;
                setTimeout(function() {
                    script.timeFlag = 0;
                }, timeValue);
                return script;
            } else if (script.timeFlag == 1) {
                sq.leftWheel = -30;
                sq.rightWheel = -30;
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_turn_around": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                var direction = script.getField("DIRECTION", script);
                var isLeft = direction == 'LEFT';
                script.leftValue = isLeft ? -30 : 30;
                script.rightValue = isLeft ? 30 : -30;
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = 1 * 1000;
                setTimeout(function() {
                    script.timeFlag = 0;
                }, timeValue);
                return script;
            } else if (script.timeFlag == 1) {
                sq.leftWheel = script.leftValue;
                sq.rightWheel = script.rightValue;
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                delete script.leftValue;
                delete script.rightValue;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "albert_set_led_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "FRONT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "빨간색", "4" ],
                    [ "노란색", "6" ],
                    [ "초록색", "2" ],
                    [ "하늘색", "3" ],
                    [ "파란색", "1" ],
                    [ "보라색", "5" ],
                    [ "하얀색", "7" ]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ]
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "COLOR": 1
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            var color = Number(script.getField("COLOR", script));
            if (direction == 'FRONT') {
                sq.leftEye = color;
                sq.rightEye = color;
            } else if (direction == 'LEFT')
                sq.leftEye = color;
            else
                sq.rightEye = color;

            return script.callReturn();
        }
    },
    "albert_clear_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "FRONT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            if (direction == 'FRONT') {
                sq.leftEye = 0;
                sq.rightEye = 0;
            } else if (direction == 'LEFT') sq.leftEye = 0;
            else sq.rightEye = 0;

            return script.callReturn();
        }
    },
    "albert_change_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "FRONT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var pd = Entry.hw.portData;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');

            if (direction == 'LEFT') {
                sq.leftWheel = sq.leftWheel != undefined ?
                    sq.leftWheel + value : pd.leftWheel + value;
            } else if (direction == 'RIGHT')
                sq.rightWheel = sq.rightWheel != undefined ?
                sq.rightWheel + value : pd.rightWheel + value;
                else {
                    sq.leftWheel = sq.leftWheel != undefined ?
                        sq.leftWheel + value : pd.leftWheel + value;
                        sq.rightWheel = sq.rightWheel != undefined ?
                            sq.rightWheel + value : pd.rightWheel + value;
                }

                return script.callReturn();
        }
    },
    "albert_set_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "FRONT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');

            if (direction == 'LEFT') sq.leftWheel = value;
            else if (direction == 'RIGHT') sq.rightWheel = value;
            else {
                sq.leftWheel = value;
                sq.rightWheel = value;
            }

            return script.callReturn();
        }
    },
    "arduino_text": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "TextInput",
                "value": 10
            }
        ],
        "events": {},
        "def": {
            "params": []
        },
        "paramsKeyMap": {
            "NAME": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("NAME");
        }
    },
    "arduino_send": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": []
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
            xmlHttp.send(String(signal));
            Entry.assert(xmlHttp.status == 200, "arduino is not connected");
            return script.callReturn();
        }
    },
    "arduino_get_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": []
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
            xmlHttp.send(String(signal));
            Entry.assert(xmlHttp.status == 200, "arduino is not connected");
            var data = xmlHttp.responseText;
            return Number(data);
        }
    },
    "arduino_get_string": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": []
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
            xmlHttp.send(String(signal));
            Entry.assert(xmlHttp.status == 200, "arduino is not connected");
            var data = xmlHttp.responseText;
            return data;
        }
    },
    "arduino_get_sensor_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "A0" ],
                    [ "1", "A1" ],
                    [ "2", "A2" ],
                    [ "3", "A3" ],
                    [ "4", "A4" ],
                    [ "5", "A5" ]
                ],
                "value": "A0",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("PORT");
        }
    },
    "arduino_get_port_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "0" ],
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ],
                    [ "8", "8" ],
                    [ "9", "9" ],
                    [ "10", "10" ],
                    [ "11", "11" ],
                    [ "12", "12" ],
                    [ "13", "13" ]
                ],
                "value": "0",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("PORT");
        }
    },
    "arduino_get_pwm_port_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "3", "3" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "9", "9" ],
                    [ "10", "10" ],
                    [ "11", "11" ]
                ],
                "value": "3",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("PORT");
        }
    },
    "arduino_get_number_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "arduino_get_number_sensor_value"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "arduino_value",
        "isNotFor": [ "arduino" ],
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            return Entry.hw.getAnalogPortValue(signal[1]);
        }
    },
    "arduino_get_digital_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "arduino_get_digital_value"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "arduino_value",
        "isNotFor": [ "arduino" ],
        "func": function (sprite, script) {
            var signal = script.getNumberValue("VALUE", script);
            return Entry.hw.getDigitalPortValue(signal);
        }
    },
    "arduino_toggle_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.ARDUINO_on,"on"],
                    [Lang.Blocks.ARDUINO_off,"off"]
                ],
                "value": "on",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "arduino_toggle_led"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "OPERATOR": 1
        },
        "class": "arduino_set",
        "isNotFor": [ "arduino" ],
        "func": function (sprite, script) {
            var port = script.getNumberValue("VALUE");
            var operator = script.getField("OPERATOR");
            var value = operator == "on" ? 255 : 0;
            Entry.hw.setDigitalPortValue(port, value);
            return script.callReturn();
        }
    },
    "arduino_toggle_pwm": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "arduino_toggle_pwm"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "arduino_set",
        "isNotFor": [ "arduino" ],
        "func": function (sprite, script) {
            var port = script.getNumberValue("PORT");
            var value = script.getNumberValue("VALUE");
            value = Math.round(value);
            value = Math.max(value, 0);
            value = Math.min(value, 255);
            Entry.hw.setDigitalPortValue(port, value);
            return script.callReturn();
        }
    },
    "arduino_convert_scale": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number",
                            "id": "bl5e"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "arduino_convert_scale"
        },
        "paramsKeyMap": {
            "VALUE1": 0,
            "VALUE2": 1,
            "VALUE3": 2,
            "VALUE4": 3,
            "VALUE5": 4
        },
        "class": "arduino",
        "isNotFor": [ "arduino" ],
        "func": function (sprite, script) {
            var value1 = script.getNumberValue("VALUE1", script);
            var value2 = script.getNumberValue("VALUE2", script);
            var value3 = script.getNumberValue("VALUE3", script);
            var value4 = script.getNumberValue("VALUE4", script);
            var value5 = script.getNumberValue("VALUE5", script);
            var result = value1;
            if (value2 > value3) {
                var swap = value2;
                value2 = value3;
                value3 = swap;
            }
            if (value4 > value5) {
                var swap = value4;
                value4 = value5;
                value5 = swap;
            }
            result -= value2;
            result = result * ((value5 - value4) / (value3 - value2));
            result += value4;
            result = Math.min(value5, result);
            result = Math.max(value4, result);
            return Math.round(result);
        }
    },
    "sensorBoard_get_named_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "소리", "0" ],
                    [ "빛 감지", "1" ],
                    [ "슬라이더", "2" ],
                    [ "온도", "3" ]
                ],
                "value": "0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "sensorBoard_get_named_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "sensorBoard",
        "isNotFor": [ "sensorBoard" ],
        "func": function (sprite, script) {
            return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
        }
    },
    "sensorBoard_is_button_pressed": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "빨간", "8" ],
                    [ "파란", "9" ],
                    [ "노랑", "10" ],
                    [ "초록", "11" ]
                ],
                "value": "8",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "sensorBoard_is_button_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "sensorBoard",
        "isNotFor": [ "sensorBoard" ],
        "func": function (sprite, script) {
            return Entry.hw.getDigitalPortValue(script.getNumberField("PORT", script));
        }
    },
    "sensorBoard_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "빨간", "2" ],
                    [ "초록", "3" ],
                    [ "파란", "4" ],
                    [ "노랑", "5" ]
                ],
                "value": "2",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "255" ],
                    [ "끄기", "0" ]
                ],
                "value": "255",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "sensorBoard_led"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "OPERATOR": 1
        },
        "class": "sensorBoard",
        "isNotFor": [ "sensorBoard" ],
        "func": function (sprite, script) {
            Entry.hw.setDigitalPortValue(script.getField("PORT"),
                                         script.getNumberField("OPERATOR"));
                                         return script.callReturn();
        }
    },
    "arduino_download_connector": {
        "skeleton": "basic_button",
        "isNotFor": ["arduinoDisconnected"],
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": !Entry.isOffline ? Lang.Blocks.ARDUINO_download_connector : Lang.Blocks.ARDUINO_open_connector,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.hw.downloadConnector();
                }
            ]
        }
    },
    "arduino_download_source": {
        "skeleton": "basic_button",
        "isNotFor": ["arduinoDisconnected"],
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.ARDUINO_download_source,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.hw.downloadSource();
                }
            ]
        }
    },
    "arduino_connected": {
        "skeleton": "basic_button",
        "color": "#eee",
        "isNotFor": ["arduinoConnected"],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.ARDUINO_connected,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {}
    },
    "arduino_reconnect": {
        "skeleton": "basic_button",
        "color": "#eee",
        "isNotFor": ["arduinoDisconnected"],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.ARDUINO_reconnect,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.hw.retryConnect();
                }
            ]
        }
    },
    "CODEino_get_sensor_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "A0" ],
                    [ "1", "A1" ],
                    [ "2", "A2" ],
                    [ "3", "A3" ],
                    [ "4", "A4" ],
                    [ "5", "A5" ],
                    [ "6", "A6" ]
                ],
                "value": "A0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("PORT");
        }
    },
    "CODEino_get_named_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CODEino_sensor_name_0,"0"],
                    [Lang.Blocks.CODEino_sensor_name_1,"1"],
                    [Lang.Blocks.CODEino_sensor_name_2,"2"],
                    [Lang.Blocks.CODEino_sensor_name_3,"3"],
                    [Lang.Blocks.CODEino_sensor_name_4,"4"],
                    [Lang.Blocks.CODEino_sensor_name_5,"5"],
                    [Lang.Blocks.CODEino_sensor_name_6,"6"]
                ],
                "value": "0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_get_named_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
        }
    },
    "CODEino_get_sound_status": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CODEino_string_11,"GREAT"],
                    [Lang.Blocks.CODEino_string_12,"SMALL"]
                ],
                "value": "GREAT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_get_sound_status"
        },
        "paramsKeyMap": {
            "STATUS": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            var value1 = script.getField("STATUS", script);
            var value2 = 0;
            if (value1 == "GREAT") return Entry.hw.getAnalogPortValue(value2) > 600 ? 1 : 0;
            else return Entry.hw.getAnalogPortValue(value2) < 600 ? 1 : 0;
        }
    },
    "CODEino_get_light_status": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CODEino_string_14,"BRIGHT"],
                    [Lang.Blocks.CODEino_string_15,"DARK"]
                ],
                "value": "BRIGHT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_get_light_status"
        },
        "paramsKeyMap": {
            "STATUS": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            var value1 = script.getField("STATUS", script);
            var value2 = 1;
            if (value1 == "DARK") return Entry.hw.getAnalogPortValue(value2) > 800 ? 1 : 0;
            else return Entry.hw.getAnalogPortValue(value2) < 800 ? 1 : 0;
        }
    },
    "CODEino_is_button_pressed": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CODEino_string_3,"4"],
                    [Lang.Blocks.CODEino_string_4,"17"],
                    [Lang.Blocks.CODEino_string_5,"18"],
                    [Lang.Blocks.CODEino_string_6,"19"],
                    [Lang.Blocks.CODEino_string_7,"20"]
                ],
                "value": "4",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_is_button_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            var value = script.getNumberField("PORT", script);
            if (value > 14) {
                value = value - 14;
                return !Entry.hw.getAnalogPortValue(value);
            } else return !Entry.hw.getDigitalPortValue(value);
        }
    },
    "CODEino_get_accelerometer_direction": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CODEino_string_16, "LEFT"],
                    [Lang.Blocks.CODEino_string_17, "RIGHT"],
                    [Lang.Blocks.CODEino_string_18, "FRONT"],
                    [Lang.Blocks.CODEino_string_19, "REAR"],
                    [Lang.Blocks.CODEino_string_20, "REVERSE"]
                ],
                "value": "LEFT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_get_accelerometer_direction"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            var value1 = script.getField("DIRECTION", script);
            var value2 = 0;
            if (value1 == "LEFT" || value1 =="RIGHT") value2 = 3;
            else if (value1 == "FRONT" || value1 =="REAR") value2 = 4;
            else if (value1 == "REVERSE") value2 = 5;
            var value3 = Entry.hw.getAnalogPortValue(value2);
            var value4 = 265;
            var value5 = 402;
            var value6 = -90;
            var value7 = 90;
            var result = value3;
            result -= value4;
            result = result * ((value7 - value6) / (value5 - value4));
            result += value6;
            result = Math.min(value7, result);
            result = Math.max(value6, result);
            result = Math.round(result);
            if (value1 == "LEFT" || value1 == "REAR") return result < -30 ? 1 : 0;
            else if (value1 == "RIGHT" || value1 == "FRONT") return result > 30 ? 1 : 0;
            else if (value1 == "REVERSE") return result < -50 ? 1 : 0;
        }
    },
    "CODEino_get_accelerometer_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "X", "3" ],
                    [ "Y", "4" ],
                    [ "Z", "5" ]
                ],
                "value": "3",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "CODEino_get_accelerometer_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "CODEino",
        "isNotFor": [ "CODEino" ],
        "func": function (sprite, script) {
            var value1 = Entry.hw.getAnalogPortValue(script.getField("PORT", script));
            var value2 = 265;
            var value3 = 402;
            var value4 = -90;
            var value5 = 90;
            var result = value1;
            if (value2 > value3) {
                var swap = value2;
                value2 = value3;
                value3 = swap;
            }
            if (value4 > value5) {
                var swap = value4;
                value4 = value5;
                value5 = swap;
            }
            result -= value2;
            result = result * ((value5 - value4) / (value3 - value2));
            result += value4;
            result = Math.min(value5, result);
            result = Math.max(value4, result);
            return Math.round(result);
        }
    },
    "nemoino_get_named_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 센서값",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    ["소리","0"],
                    ["빛","1"],
                    ["슬라이더","2"],
                    ["저항-A","3"],
                    ["저항-B","4"],
                    ["저항-C","5"],
                    ["저항-D","6"]
                ],
                "value": "0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "nemoino_get_named_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "nemoino",
        "isNotFor": [ "nemoino" ],
        "func": function (sprite, script) {
            return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
        }
    },
    "nemoino_get_sound_status": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "소리센서 %1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    ["소리큼","GREAT"],
                    ["소리작음","SMALL"]
                ],
                "value": "GREAT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "nemoino_get_sound_status"
        },
        "paramsKeyMap": {
            "STATUS": 0
        },
        "class": "nemoino",
        "isNotFor": [ "nemoino" ],
        "func": function (sprite, script) {
            var value1 = script.getField("STATUS", script);
            var value2 = 0;
            if (value1 == "GREAT") return Entry.hw.getAnalogPortValue(value2) > 600 ? 1 : 0;
            else return Entry.hw.getAnalogPortValue(value2) < 600 ? 1 : 0;
        }
    },
    "nemoino_is_button_pressed": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "보드의 %1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    ["버튼누름","4"],
                    ["A연결됨","17"],
                    ["B연결됨","18"],
                    ["C연결됨","19"],
                    ["D연결됨","20"]
                ],
                "value": "4",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "nemoino_is_button_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "nemoino",
        "isNotFor": [ "nemoino" ],
        "func": function (sprite, script) {
            var value = script.getNumberField("PORT", script);
            if (value > 14) {
                value = value - 14;
                return !Entry.hw.getAnalogPortValue(value);
            } else return !Entry.hw.getDigitalPortValue(value);
        }
    },
    "nemoino_get_accelerometer_direction": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "3축 가속도센서 %1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    ["왼쪽 기울임", "LEFT"],
                    ["오른쪽 기울임", "RIGHT"],
                    ["위쪽 기울임", "FRONT"],
                    ["아래쪽 기울임", "REAR"],
                    ["뒤집힘", "REVERSE"]
                ],
                "value": "LEFT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "nemoino_get_accelerometer_direction"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "nemoino",
        "isNotFor": [ "nemoino" ],
        "func": function (sprite, script) {
            var value1 = script.getField("DIRECTION", script);
            var value2 = 0;
            if (value1 == "LEFT" || value1 =="RIGHT") value2 = 3;
            else if (value1 == "FRONT" || value1 =="REAR") value2 = 4;
            else if (value1 == "REVERSE") value2 = 5;
            var value3 = Entry.hw.getAnalogPortValue(value2);
            var value4 = 265;
            var value5 = 402;
            var value6 = -90;
            var value7 = 90;
            var result = value3;
            result -= value4;
            result = result * ((value7 - value6) / (value5 - value4));
            result += value6;
            result = Math.min(value7, result);
            result = Math.max(value6, result);
            result = Math.round(result);
            if (value1 == "LEFT" || value1 == "REAR") return result < -30 ? 1 : 0;
            else if (value1 == "RIGHT" || value1 == "FRONT") return result > 30 ? 1 : 0;
            else if (value1 == "REVERSE") return result < -50 ? 1 : 0;
        }
    },
    "nemoino_get_accelerometer_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "3축 가속도센서 %1 축의 센서값",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "X", "3" ],
                    [ "Y", "4" ],
                    [ "Z", "5" ]
                ],
                "value": "3",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "nemoino_get_accelerometer_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "nemoino",
        "isNotFor": [ "nemoino" ],
        "func": function (sprite, script) {
            var value1 = Entry.hw.getAnalogPortValue(script.getField("PORT", script));
            var value2 = 265;
            var value3 = 402;
            var value4 = -90;
            var value5 = 90;
            var result = value1;
            if (value2 > value3) {
                var swap = value2;
                value2 = value3;
                value3 = swap;
            }
            if (value4 > value5) {
                var swap = value4;
                value4 = value5;
                value5 = swap;
            }
            result -= value2;
            result = result * ((value5 - value4) / (value3 - value2));
            result += value4;
            result = Math.min(value5, result);
            result = Math.max(value4, result);
            return Math.round(result);
        }
    },
    "bitbrick_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW,
                menuName: Entry.Bitbrick.sensorList

            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bitbrick_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var port = script.getStringField("PORT");
            return Entry.hw.portData[port].value;
        }
    },
    "bitbrick_is_touch_pressed": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                menuName: Entry.Bitbrick.touchList
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bitbrick_is_touch_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            return Entry.hw.portData[script.getStringField("PORT")].value === 0;
        }
    },
    "bitbrick_turn_off_color_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bitbrick_turn_off_color_led",
            "id": "i3je"
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            Entry.hw.sendQueue["LEDR"] = 0;
            Entry.hw.sendQueue["LEDG"] = 0;
            Entry.hw.sendQueue["LEDB"] = 0;
            return script.callReturn();
        }
    },
    "bitbrick_turn_on_color_led_by_rgb": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "bitbrick_turn_on_color_led_by_rgb"
        },
        "paramsKeyMap": {
            "rValue": 0,
            "gValue": 1,
            "bValue": 2
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var red = script.getNumberValue("rValue"),
                green = script.getNumberValue("gValue"),
                blue = script.getNumberValue("bValue"),
                min = 0,
                max = 255,
                adjustor = Entry.adjustValueWithMaxMin,
                sq = Entry.hw.sendQueue;

                sq["LEDR"] = adjustor(red, min, max);
                sq["LEDG"] = adjustor(green, min, max);
                sq["LEDB"] = adjustor(blue, min, max);
                return script.callReturn();
        }
    },
    "bitbrick_turn_on_color_led_by_picker": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Color"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bitbrick_turn_on_color_led_by_picker"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var port = script.getStringField("VALUE");
            Entry.hw.sendQueue["LEDR"] = parseInt(port.substr(1,2), 16);
            Entry.hw.sendQueue["LEDG"] = parseInt(port.substr(3,2), 16);
            Entry.hw.sendQueue["LEDB"] = parseInt(port.substr(5,2), 16);
            return script.callReturn();
        }
    },
    "bitbrick_turn_on_color_led_by_value": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "bitbrick_turn_on_color_led_by_value"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE");
            var red, green, blue;
            value = value % 200;
            if ( value < 67 ) {
                red = 200 - (value * 3);
                green = value * 3;
                blue = 0;
            } else if ( value < 134 ) {
                value = value - 67;
                red = 0;
                green = 200 - (value * 3);
                blue = value * 3;
            } else if ( value < 201 ) {
                value = value - 134;
                red = value * 3;
                green = 0;
                blue = 200 - (value * 3);
            }
            Entry.hw.sendQueue["LEDR"] = red;
            Entry.hw.sendQueue["LEDG"] = green;
            Entry.hw.sendQueue["LEDB"] = blue;
            return script.callReturn();
        }
    },
    "bitbrick_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "60" ]
                },
                null
            ],
            "type": "bitbrick_buzzer"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var value = script.getNumberValue("VALUE");
                Entry.hw.sendQueue["buzzer"] = value;
                script.isStart = true;
                return script;
            } else {
                Entry.hw.sendQueue["buzzer"] = 0;
                delete script.isStart;
                return script.callReturn();
            }
        }
    },
    "bitbrick_turn_off_all_motors": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bitbrick_turn_off_all_motors"
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var bitbrick = Entry.Bitbrick;
            bitbrick.servoList().map(function(servo){
                sq[servo[1]] = 0;
            });
            bitbrick.dcList().map(function(dc){
                sq[dc[1]] = 128;
            });
            return script.callReturn();
        }
    },
    "bitbrick_dc_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                menuName: Entry.Bitbrick.dcList
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "60" ]
                },
                null
            ],
            "type": "bitbrick_dc_speed"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE");
            value = Math.min(value, Entry.Bitbrick.dcMaxValue);
            value = Math.max(value, Entry.Bitbrick.dcMinValue);

            Entry.hw.sendQueue[script.getStringField("PORT")] =
                value + 128;
            return script.callReturn();
        }
    },
    "bitbrick_dc_direction_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                menuName: Entry.Bitbrick.dcList
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.BITBRICK_dc_direction_cw,"CW"],
                    [Lang.Blocks.BITBRICK_dc_direction_ccw,"CCW"]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                null,
                {
                    "type": "text",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "bitbrick_dc_direction_speed"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "DIRECTION": 1,
            "VALUE": 2
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var isFront = script.getStringField("DIRECTION") === "CW";
            var value = script.getNumberValue("VALUE");
            value = Math.min(value, Entry.Bitbrick.dcMaxValue);
            value = Math.max(value, 0);

            Entry.hw.sendQueue[script.getStringField("PORT")] =
                isFront ? value + 128 : 128 - value;
            return script.callReturn();
        }
    },
    "bitbrick_servomotor_angle": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                menuName: Entry.Bitbrick.servoList
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "bitbrick_servomotor_angle"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var value = Entry.Bitbrick.servoMaxValue - (script.getNumberValue("VALUE") + 1);
            value = Math.min(value, Entry.Bitbrick.servoMaxValue);
            value = Math.max(value, Entry.Bitbrick.servoMinValue);
            Entry.hw.sendQueue[script.getStringField("PORT")] = value;
            return script.callReturn();
        }
    },
    "bitbrick_convert_scale": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11,
                menuName: Entry.Bitbrick.sensorList
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "-100" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "bitbrick_convert_scale"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE2": 1,
            "VALUE3": 2,
            "VALUE4": 3,
            "VALUE5": 4
        },
        "class": "condition",
        "isNotFor": [ "bitbrick" ],
        "func": function (sprite, script) {
            var port = script.getNumberField("PORT");
            var value1 = Entry.hw.portData[port].value;
            var value2 = script.getNumberValue("VALUE2", script);
            var value3 = script.getNumberValue("VALUE3", script);
            var value4 = script.getNumberValue("VALUE4", script);
            var value5 = script.getNumberValue("VALUE5", script);
            var result = value1;

            if (value4 > value5) {
                var swap = value4;
                value4 = value5;
                value5 = swap;
            }

            result -= value2;
            result = result * ((value5 - value4) / (value3 - value2));
            result += value4;
            result = Math.min(value5, result);
            result = Math.max(value4, result);
            return Math.round(result);
        }
    },
    "start_drawing": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "start_drawing"
        },
        "class": "brush_control",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {

            if (sprite.brush)
                sprite.brush.stop = false;
            else
                Entry.setBasicBrush(sprite);

            Entry.stage.sortZorder();
            sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);

            return script.callReturn();
        }
    },
    "stop_drawing": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "stop_drawing"
        },
        "class": "brush_control",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            if (sprite.brush && sprite.shape)
                sprite.brush.stop = true;

            return script.callReturn();
        }
    },
    "set_color": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Color"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "set_color"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_color",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var colour = script.getField("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                var rgb = Entry.hex2rgb(colour);
                sprite.brush.rgb = rgb;
                sprite.brush.endStroke();
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");

                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();
        }
    },
    "set_random_color": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "set_random_color"
        },
        "class": "brush_color",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                var rgb = Entry.generateRgb();
                sprite.brush.rgb = rgb;
                sprite.brush.endStroke();
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");

                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "change_thickness": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "change_thickness"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_thickness",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var thickness = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.thickness += thickness;
                if (sprite.brush.thickness < 1)
                    sprite.brush.thickness = 1;

                sprite.brush.setStrokeStyle(sprite.brush.thickness);

                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();
        }
    },
    "set_thickness": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "set_thickness"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_thickness",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var thickness = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.thickness = thickness;
                sprite.brush.setStrokeStyle(sprite.brush.thickness);

                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();
        }
    },
    "change_opacity": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_opacity"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var opacity = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }
            opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity + opacity, 0, 100);

            if (sprite.brush) {
                sprite.brush.opacity = opacity;
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();
        }
    },
    "set_opacity": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "50" ]
                },
                null
            ],
            "type": "set_opacity"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var opacity = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();

        }
    },
    "brush_erase_all": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "brush_erase_all"
        },
        "class": "brush_clear",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var brush = sprite.brush;
            if (brush) {
                var stroke = brush._stroke.style;
                var style = brush._strokeStyle.width;
                brush.clear().setStrokeStyle(style).beginStroke(stroke);
                brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            var stampEntities = sprite.parent.getStampEntities();
            stampEntities.map(function (entity) {
                entity.removeClone();
            });
            stampEntities = null;

            return script.callReturn();
        }
    },
    "brush_stamp": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "brush_stamp"
        },
        "class": "stamp",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            sprite.parent.addStampEntity(sprite);

            return script.callReturn();
        }
    },
    "change_brush_transparency": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_brush_transparency"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var opacity = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }
            opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity - opacity, 0, 100);

            if (sprite.brush) {
                sprite.brush.opacity = opacity;
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sprite.brush.opacity/100)+")");
                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();
        }
    },
    "set_brush_tranparency": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "50" ]
                },
                null
            ],
            "type": "set_brush_tranparency"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var opacity = script.getNumberValue("VALUE", script);

            if (!sprite.brush) {
                Entry.setBasicBrush(sprite);
                sprite.brush.stop = true;
            }

            if (sprite.brush) {
                sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);
                sprite.brush.endStroke();
                var rgb = sprite.brush.rgb;
                sprite.brush.beginStroke("rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(1 - sprite.brush.opacity/100)+")");
                sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);
            }

            return script.callReturn();

        }
    },
    "number": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "TextInput",
                "value": 10
            }
        ],
        "events": {},
        "def": {
            "params": []
        },
        "paramsKeyMap": {
            "NUM": 0
        },
        "func": function (sprite, script) {
            return script.getField('NUM', script);
        },
        "isPrimitive": true
    },
    "angle": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Angle"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "angle"
        },
        "paramsKeyMap": {
            "ANGLE": 0
        },
        "func": function (sprite, script) {
            return script.getNumberField("ANGLE");
        }
    },
    "get_x_coordinate": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_x_coordinate,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "get_x_coordinate"
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            return sprite.getX();
        }
    },
    "get_y_coordinate": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_y_coordinate,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "get_y_coordinate"
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            return sprite.getY();
        }
    },
    "get_angle": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_angle,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            return parseFloat(sprite.getRotation().toFixed(1));
        }
    },
    "get_rotation_direction": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_rotation_value,"ROTATION"],
                    [Lang.Blocks.CALC_direction_value,"DIRECTION"]
                ],
                "value": "ROTATION",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "get_rotation_direction"
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var o = script.getField("OPERATOR", script);
            if (o.toUpperCase() == 'DIRECTION')
                return parseFloat(sprite.getDirection().toFixed(1));
            else
                return parseFloat(sprite.getRotation().toFixed(1));
        }
    },
    "distance_something": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_distance_something_1,
                "color": "#3D3D3D"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_distance_something_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "distance_something"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc_distance",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetId = script.getField("VALUE", script);
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
        }
    },
    "coordinate_mouse": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_coordinate_mouse_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "x", "x" ],
                    [ "y", "y" ]
                ],
                "value": "x",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_coordinate_mouse_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "coordinate_mouse"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetCoordinate = script.getField("VALUE", script);
            if (targetCoordinate === 'x') {
                return Number(Entry.stage.mouseCoordinate.x);
            } else {
                return Number(Entry.stage.mouseCoordinate.y);
            }
        }
    },
    "coordinate_object": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_coordinate_object_1,
                "color": "#3D3D3D"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithSelf",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_coordinate_object_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_coordinate_x_value,"x"],
                    [Lang.Blocks.CALC_coordinate_y_value, "y"],
                    [Lang.Blocks.CALC_coordinate_rotation_value, "rotation"],
                    [Lang.Blocks.CALC_coordinate_direction_value, "direction"],
                    [Lang.Blocks.CALC_coordinate_size_value, "size"],
                    [Lang.Blocks.CALC_picture_index, "picture_index"],
                    [Lang.Blocks.CALC_picture_name, "picture_name"]
                ],
                "value": "x",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null, null ],
            "type": "coordinate_object"
        },
        "paramsKeyMap": {
            "VALUE": 1,
            "COORDINATE": 3
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetId = script.getField("VALUE", script);
            var targetEntity;
            if (targetId == 'self')
                targetEntity = sprite;
            else
                targetEntity = Entry.container.getEntity(targetId);

            var targetCoordinate = script.getField("COORDINATE", script);
            switch(targetCoordinate) {
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
                    var picture = pictures[pictures.indexOf(targetEntity.picture)];
                    return picture.name;
            }
        }
    },
    "calc_basic": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "+", "PLUS" ],
                    [ "-", "MINUS" ],
                    [ "x", "MULTI" ],
                    [ "/", "DIVIDE" ]
                ],
                "value": "PLUS",
                "fontSize": 11,
                noArrow: true
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                "PLUS",
                {
                    "type": "number",
                    "params": [ "10" ]
                }
            ],
            "type": "calc_basic"
        },
        "defs": [
            {
                "params": [
                    {
                        "type": "number",
                        "params": [ "10" ]
                    },
                    "PLUS",
                    {
                        "type": "number",
                        "params": [ "10" ]
                    }
                ],
                "type": "calc_basic"
            },
            {
                "params": [
                    {
                        "type": "number",
                        "params": [ "10" ]
                    },
                    "MINUS",
                    {
                        "type": "number",
                        "params": [ "10" ]
                    }
                ],
                "type": "calc_basic"
            },
            {
                "params": [
                    {
                        "type": "number",
                        "params": [ "10" ]
                    },
                    "MULTI",
                    {
                        "type": "number",
                        "params": [ "10" ]
                    }
                ],
                "type": "calc_basic"
            },
            {
                "params": [
                    {
                        "type": "number",
                        "params": [ "10" ]
                    },
                    "DIVIDE",
                    {
                        "type": "number",
                        "params": [ "10" ]
                    }
                ],
                "type": "calc_basic"
            }
        ],
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var operator = script.getField("OPERATOR", script);
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            if (operator == "PLUS")
                return leftValue + rightValue;
            else if (operator == "MINUS")
                return leftValue - rightValue;
            else if (operator == "MULTI")
                return leftValue * rightValue;
            else
                return leftValue / rightValue;
        }
    },
    "calc_plus": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "+",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue + rightValue;
        }
    },
    "calc_minus": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "-",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue - rightValue;
        }
    },
    "calc_times": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "x",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue * rightValue;
        }
    },
    "calc_divide": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue / rightValue;
        }
    },
    "calc_mod": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_mod_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "calc_mod"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue % rightValue;
        }
    },
    "calc_share": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "의 몫",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "calc_share"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return Math.floor(leftValue/rightValue);
        }
    },
    "calc_operation": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_operation_of_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_operation_of_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_calc_operation_square,"square"],
                    [Lang.Blocks.CALC_calc_operation_root, "root"],
                    [Lang.Blocks.CALC_calc_operation_sin, "sin"],
                    [Lang.Blocks.CALC_calc_operation_cos,"cos"],
                    [Lang.Blocks.CALC_calc_operation_tan,"tan"],
                    [Lang.Blocks.CALC_calc_operation_asin, "asin_radian"],
                    [Lang.Blocks.CALC_calc_operation_acos,"acos_radian"],
                    [Lang.Blocks.CALC_calc_operation_atan,"atan_radian"],
                    [Lang.Blocks.CALC_calc_operation_log,"log"],
                    [Lang.Blocks.CALC_calc_operation_ln,"ln"],
                    [Lang.Blocks.CALC_calc_operation_unnatural,"unnatural"],
                    [Lang.Blocks.CALC_calc_operation_floor,"floor"],
                    [Lang.Blocks.CALC_calc_operation_ceil,"ceil"],
                    [Lang.Blocks.CALC_calc_operation_round,"round"],
                    [Lang.Blocks.CALC_calc_operation_factorial,"factorial"],
                    [Lang.Blocks.CALC_calc_operation_abs,"abs"]
                ],
                "value": "square",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                null
            ],
            "type": "calc_operation"
        },
        "paramsKeyMap": {
            "LEFTHAND": 1,
            "VALUE": 3
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("LEFTHAND", script);
            var operator = script.getField("VALUE", script);
            var xRangeCheckList = ['asin_radian', 'acos_radian'];
            if ((xRangeCheckList.indexOf(operator) > -1) &&
                (value > 1 || value < -1))
                throw new Error('x range exceeded');

            var needToConvertList = ['sin', 'cos', 'tan'];
            if (operator.indexOf('_'))
                operator = operator.split('_')[0];

            if (needToConvertList.indexOf(operator) > -1)
                value = Entry.toRadian(value);

            var returnVal = 0;
            switch(operator){
                case "square":
                    returnVal = value * value;
                    break;
                case "factorial":
                    returnVal = Entry.factorial(value);
                    break;
                case "root":
                    returnVal = Math.sqrt(value);
                    break;
                case "log":
                    returnVal = Math.log(value) / Math.LN10;
                    break;
                case "ln":
                    returnVal = Math.log(value);
                    break;
                case "asin":
                case "acos":
                case "atan":
                    returnVal = Entry.toDegrees(Math[operator](value));
                    break;
                case "unnatural":
                    returnVal = value - Math.floor(value);
                    if (value < 0)
                        returnVal = 1 - returnVal;
                    break;
                default:
                    returnVal = Math[operator](value);
            }
            return Math.round(returnVal*1000)/1000;
        }
    },
    "calc_rand": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_rand_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_rand_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_calc_rand_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "calc_rand"
        },
        "paramsKeyMap": {
            "LEFTHAND": 1,
            "RIGHTHAND": 3
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getStringValue("LEFTHAND", script);
            var rightValue = script.getStringValue("RIGHTHAND", script);
            var left = Math.min(leftValue, rightValue);
            var right = Math.max(leftValue, rightValue);
            var isLeftFloat = Entry.isFloat(leftValue);
            var isRightFloat = Entry.isFloat(rightValue);
            if (isRightFloat || isLeftFloat)
                return  (Math.random() * (right - left) + left).toFixed(2);
            else
                return  Math.floor((Math.random() * (right - left +1) + left));
        }
    },
    "get_date": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_date_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_get_date_year,"YEAR"],
                    [Lang.Blocks.CALC_get_date_month,"MONTH"],
                    [Lang.Blocks.CALC_get_date_day,"DAY"],
                    [Lang.Blocks.CALC_get_date_hour,"HOUR"],
                    [Lang.Blocks.CALC_get_date_minute,"MINUTE"],
                    [Lang.Blocks.CALC_get_date_second,"SECOND"]
                ],
                "value": "YEAR",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_date_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, "YEAR", null ],
            "type": "get_date"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc_date",
        "isNotFor": [],
        "func": function (sprite, script) {
            var operator = script.getField("VALUE", script);
            var dateTime = new Date();
            if (operator == "YEAR")
                return dateTime.getFullYear();
            else if (operator == "MONTH")
                return dateTime.getMonth()+1;
            else if (operator == "DAY")
                return dateTime.getDate();
            else if (operator == "HOUR")
                return dateTime.getHours();
            else if (operator == "MINUTE")
                return dateTime.getMinutes();
            else
                return dateTime.getSeconds();
        }
    },
    "get_sound_duration": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_sound_duration_1,
                "color": "#3D3D3D"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_sound_duration_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "get_sound_duration"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc_duration",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getField("VALUE", script);
            var soundsArr = sprite.parent.sounds;

            for (var i = 0; i < soundsArr.length; i++) {
                if (soundsArr[i].id == soundId)
                    return soundsArr[i].duration;
            }
        }
    },
    "reset_project_timer": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": "초시계 초기화",
                "color": "#3D3D3D"
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.engine) Entry.engine.hideProjectTimer(block);
                }
            ]
        },
        "def": {
            "params": [ null ],
            "type": "reset_project_timer"
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": function (sprite, script) {
            Entry.engine.updateProjectTimer(0);
            return script.callReturn();
        }
    },
    "set_visible_project_timer": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_timer_visible_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_timer_visible_show,"SHOW"],
                    [Lang.Blocks.CALC_timer_visible_hide,"HIDE"]
                ],
                "value": "SHOW",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_timer_visible_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Indicator",
                "img": "block_icon/calc_01.png",
                "size": 12
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.engine) Entry.engine.hideProjectTimer(block);
                }
            ]
        },
        "def": {
            "params": [ null, "HIDE", null, null ],
            "type": "set_visible_project_timer"
        },
        "paramsKeyMap": {
            "ACTION": 1
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": function (sprite, script) {
            var action = script.getField("ACTION", script);
            var timer = Entry.engine.projectTimer;
            if (action == 'SHOW')
                timer.setVisible(true);
            else
                timer.setVisible(false);

            return script.callReturn();
        }
    },
    "timer_variable": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": "초시계 값",
                "color": "#3D3D3D"
            },
            {
                "type": "Text",
                "text": " ",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "func": function (sprite, script) {
            return Entry.container.inputValue.getValue();
        }
    },
    "get_project_timer_value": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_timer_value,
                "color": "#3D3D3D"
            },
            {
                "type": "Text",
                "text": "",
                "color": "#3D3D3D"
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.engine) Entry.engine.hideProjectTimer(block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "get_project_timer_value"
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": function (sprite, script) {
            return Entry.engine.projectTimer.getValue();
        }
    },
    "char_at": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_char_at_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_char_at_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_char_at_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.hi_entry ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "char_at"
        },
        "paramsKeyMap": {
            "LEFTHAND": 1,
            "RIGHTHAND": 3
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            var str = script.getStringValue("LEFTHAND", script);
            var index = script.getNumberValue("RIGHTHAND", script)-1;
            if (index <0 || index >str.length-1)
                throw new Error();
            else
                return str[index];
        }
    },
    "length_of_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_length_of_string_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_length_of_string_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                },
                null
            ],
            "type": "length_of_string"
        },
        "paramsKeyMap": {
            "STRING": 1
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.getStringValue("STRING", script).length;
        }
    },
    "substring": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_substring_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_substring_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_substring_3,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_substring_4,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.hi_entry ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "5" ]
                },
                null
            ],
            "type": "substring"
        },
        "paramsKeyMap": {
            "STRING": 1,
            "START": 3,
            "END": 5
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            var str = script.getStringValue("STRING", script);
            var start = script.getNumberValue("START", script)-1;
            var end = script.getNumberValue("END", script)-1;
            var strLen = str.length-1;
            if (start <0 || end<0 || start>strLen || end>strLen)
                throw new Error();
            else
                return str.substring(Math.min(start, end), Math.max(start, end)+1);
        }
    },
    "replace_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_replace_string_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_replace_string_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_replace_string_3,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_replace_string_4,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.hi_entry ]
                },
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.hello ]
                },
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.nice ]
                },
                null
            ],
            "type": "replace_string"
        },
        "paramsKeyMap": {
            "STRING": 1,
            "OLD_WORD": 3,
            "NEW_WORD": 5
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.getStringValue("STRING", script).
                replace(
                    new RegExp(script.getStringValue("OLD_WORD", script), 'gm'),
                    script.getStringValue("NEW_WORD", script)
                );
        }
    },
    "change_string_case": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_change_string_case_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_change_string_case_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_change_string_case_sub_1,"toUpperCase"],
                    [Lang.Blocks.CALC_change_string_case_sub_2,"toLowerCase"]
                ],
                "value": "toUpperCase",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_change_string_case_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "Hello Entry!" ]
                },
                null,
                null,
                null
            ],
            "type": "change_string_case"
        },
        "paramsKeyMap": {
            "STRING": 1,
            "CASE": 3
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.getStringValue("STRING", script)[script.getField("CASE", script)]();
        }
    },
    "index_of_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_index_of_string_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_index_of_string_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_index_of_string_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.hi_entry ]
                },
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                },
                null
            ],
            "type": "index_of_string"
        },
        "paramsKeyMap": {
            "LEFTHAND": 1,
            "RIGHTHAND": 3
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            var str = script.getStringValue("LEFTHAND", script);
            var target = script.getStringValue("RIGHTHAND", script);
            var index = str.indexOf(target);
            return index > -1 ? index + 1 : 0;
        }
    },
    "combine_something": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_combine_something_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_combine_something_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_combine_something_3,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.block_hi ]
                },
                null,
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                },
                null
            ],
            "type": "combine_something"
        },
        "paramsKeyMap": {
            "VALUE1": 1,
            "VALUE2": 3
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getStringValue("VALUE1", script);
            var rightValue = script.getStringValue("VALUE2", script);

            return leftValue + rightValue;
        }
    },
    "get_sound_volume": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_get_sound_volume,
                "color": "#3D3D3D"
            },
            {
                "type": "Text",
                "text": "",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "get_sound_volume"
        },
        "class": "calc",
        "isNotFor": [
            ""
        ],
        "func": function (sprite, script) {
            return createjs.Sound.getVolume() * 100;
        }
    },
    "quotient_and_mod": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_quotient_and_mod_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_quotient_and_mod_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_quotient_and_mod_3,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                      [Lang.Blocks.CALC_quotient_and_mod_sub_1,"QUOTIENT"],
                      [Lang.Blocks.CALC_quotient_and_mod_sub_2,"MOD"]
                ],
                "value": "QUOTIENT",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null,
                null
            ],
            "type": "quotient_and_mod"
        },
        "paramsKeyMap": {
            "LEFTHAND": 1,
            "RIGHTHAND": 3,
            "OPERATOR": 5
        },
        "class": "calc",
        "isNotFor": [],
        "func": function (sprite, script) {
            var left = script.getNumberValue("LEFTHAND", script);
            var right = script.getNumberValue("RIGHTHAND", script);
            if (isNaN(left) || isNaN(right))
                throw new Error();
            var operator = script.getField("OPERATOR", script);
            if (operator == 'QUOTIENT')
                return Math.floor(left/right);
            else
                return left % right;
        }
    },
    "choose_project_timer_action": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_choose_project_timer_action_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_choose_project_timer_action_sub_1,"START"],
                    [Lang.Blocks.CALC_choose_project_timer_action_sub_2,"STOP"],
                    [Lang.Blocks.CALC_choose_project_timer_action_sub_3,"RESET"]
                ],
                "value": "START",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_CALC
            },
            {
                "type": "Text",
                "text": Lang.Blocks.CALC_choose_project_timer_action_2,
                "color": "#3D3D3D"
            },
            {
                "type": "Indicator",
                "img": "block_icon/calc_01.png",
                "size": 12
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.engine) Entry.engine.showProjectTimer();
                }
            ],
            "dataDestroy": [
                function(block) {
                    if (Entry.engine) Entry.engine.hideProjectTimer(block);
                }
            ]
        },
        "def": {
            "params": [
                null,
                "START",
                null,
                null
            ],
            "type": "choose_project_timer_action"
        },
        "paramsKeyMap": {
            "ACTION": 1
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": function (sprite, script) {
            var action = script.getField('ACTION');
            var engine = Entry.engine;
            var timer = engine.projectTimer;

            if (action == 'START') {
                if (!timer.isInit) {
                    engine.startProjectTimer();
                }
                else if (timer.isInit && timer.isPaused) {
                    if (timer.pauseStart)
                        timer.pausedTime += (new Date()).getTime() - timer.pauseStart;
                    delete timer.pauseStart;
                    timer.isPaused = false;
                }
            } else if (action == 'STOP') {
                if (timer.isInit && !timer.isPaused) {
                    timer.isPaused = true;
                    timer.pauseStart = (new Date()).getTime();
                }
            } else if (action == 'RESET') {
                if (timer.isInit) {
                    timer.setValue(0);
                    timer.start = (new Date()).getTime();
                    timer.pausedTime = 0;
                    delete timer.pauseStart;
                }

            }
            return script.callReturn();
        }
    },
    "wait_second": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                null
            ],
            "type": "wait_second"
        },
        "paramsKeyMap": {
            "SECOND": 0
        },
        "class": "delay",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = script.getNumberValue("SECOND", script);
                var fps = Entry.FPS || 60;
                timeValue = 60/fps*timeValue*1000;
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
        }
    },
    "repeat_basic": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "repeat_basic"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "statementsKeyMap": {
            "DO": 0
        },
        "class": "repeat",
        "isNotFor": [],
        "func": function (sprite, script) {
            var iterNumber;
            if (!script.isLooped) {
                script.isLooped = true;
                var iterNumber = script.getNumberValue("VALUE", script);
                if(iterNumber < 0) throw new Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);
                script.iterCount = Math.floor(iterNumber);
            }
            if (script.iterCount != 0 && !(script.iterCount < 0)) {
                script.iterCount--;
                return script.getStatement("DO", script);
            } else {
                delete script.isLooped;
                delete script.iterCount;
                return script.callReturn();
            }
        }
    },
    "repeat_inf": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "repeat_inf"
        },
        "statementsKeyMap": {
            "DO": 0
        },
        "class": "repeat",
        "isNotFor": [],
        "func": function (sprite, script) {
            //return script.getStatement("DO", script);
            script.isLooped = true;
            return script.getStatement('DO');
        }
    },
    "stop_repeat": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "stop_repeat"
        },
        "class": "repeat",
        "isNotFor": [],
        "func": function (sprite, script) {
            return this.executor.breakLoop();
        }
    },
    "wait_until_true": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "True"
                },
                null
            ],
            "type": "wait_until_true"
        },
        "paramsKeyMap": {
            "BOOL": 0
        },
        "class": "wait",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getBooleanValue("BOOL", script);
            if (value) {
                return script.callReturn();
            } else {
                return script;
            }
        }
    },
    "_if": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "True"
                },
                null
            ],
            "type": "_if"
        },
        "paramsKeyMap": {
            "BOOL": 0
        },
        "statementsKeyMap": {
            "STACK": 0
        },
        "class": "condition",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = script.getBooleanValue("BOOL", script);
            if (value) {
                script.isCondition = true;
                return script.getStatement("STACK", script);
            } else {
                return script.callReturn();
            }
        }
    },
    "if_else": {
        "color": "#498deb",
        "skeleton": "basic_double_loop",
        "statements": [
            {
                "accept": "basic"
            },
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            },
            {
                "type": "LineBreak"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "True"
                },
                null
            ],
            "type": "if_else"
        },
        "paramsKeyMap": {
            "BOOL": 0
        },
        "statementsKeyMap": {
            "STACK_IF": 0,
            "STACK_ELSE": 1
        },
        "class": "condition",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (script.isCondition) {
                delete script.isCondition;
                return script.callReturn();
            }
            var value = script.getBooleanValue("BOOL", script);
            script.isCondition = true;
            if (value)
                return script.getStatement("STACK_IF", script);
            else
                return script.getStatement("STACK_ELSE", script);
        }
    },
    "create_clone": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "clone",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_FLOW
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "create_clone"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "clone",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetSpriteId = script.getField("VALUE", script);
            var returnBlock = script.callReturn();
            if (targetSpriteId == "self")
                sprite.parent.addCloneEntity(sprite.parent, sprite, null);
            else {
                var object = Entry.container.getObject(targetSpriteId);
                object.addCloneEntity(sprite.parent, null, null);
            }
            return returnBlock;
        }
    },
    "delete_clone": {
        "color": "#498deb",
        "skeleton": "basic_without_next",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "delete_clone"
        },
        "class": "clone",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!sprite.isClone)
                return script.callReturn();
            sprite.removeClone();
            return this.die();
        }
    },
    "when_clone_start": {
        "color": "#498deb",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_clone.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "when_clone_start"
        },
        "class": "clone",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "when_clone_start"
    },
    "stop_run": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            return Entry.engine.toggleStop();
        }
    },
    "repeat_while_true": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.FLOW_repeat_while_true_until, "until" ],
                    [ Lang.Blocks.FLOW_repeat_while_true_while, "while" ]
                ],
                "value": "until",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_FLOW
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "True"
                },
                null,
                null
            ],
            "type": "repeat_while_true"
        },
        "paramsKeyMap": {
            "BOOL": 0,
            "OPTION": 1
        },
        "statementsKeyMap": {
            "DO": 0
        },
        "class": "repeat",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getBooleanValue("BOOL", script);

            if (script.getField("OPTION", script) == 'until')
                value = !value;
            script.isLooped = value;

            return value ? script.getStatement("DO", script) :
                script.callReturn();
        }
    },
    "stop_object": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.FLOW_stop_object_all, "all" ],
                    [ Lang.Blocks.FLOW_stop_object_this_object, "thisOnly" ],
                    [ Lang.Blocks.FLOW_stop_object_this_thread, "thisThread" ],
                    [ Lang.Blocks.FLOW_stop_object_other_thread, "otherThread" ]
                ],
                "value": "all",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_FLOW
            },
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "stop_object"
        },
        "paramsKeyMap": {
            "TARGET": 0
        },
        "class": "terminate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var target = script.getField("TARGET", script);
            var container = Entry.container;

            switch(target) {
                case 'all':
                    container.clearRunningState();
                    return this.die();
                case 'thisOnly':
                    sprite.parent.script.clearExecutorsByEntity(sprite);
                    return this.die();
                case 'thisObject':
                    sprite.parent.script.clearExecutors();
                return this.die();
                case 'thisThread':
                    return this.die();
                case 'otherThread':
                    var executor = this.executor;
                    var code = sprite.parent.script;
                    var executors = code.executors;

                    for (var i = 0 ; i < executors.length; i++) {
                        var currentExecutor = executors[i];
                        if (currentExecutor !== executor) {
                            code.removeExecutor(currentExecutor);
                            --i;
                        }
                    }
                    return script.callReturn();
            }
        }
    },
    "restart_project": {
        "color": "#498deb",
        "skeleton": "basic_without_next",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "restart_project"
        },
        "class": "terminate",
        "isNotFor": [],
        "func": function (sprite, script) {
            Entry.engine.toggleStop();
            Entry.engine.toggleRun();
        }
    },
    "remove_all_clones": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/flow_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "remove_all_clones"
        },
        "class": "clone",
        "isNotFor": [],
        "func": function (sprite, script) {
            var clonedEntities = sprite.parent.getClonedEntities();
            clonedEntities.map(function (entity) {
                entity.removeClone();
            });
            clonedEntities = null;

            return script.callReturn();
        }
    },
    "functionAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "isNotFor": [
            "functionInit"
        ],
        "params": [
            {
                "type": "Text",
                "text": Lang.Workspace.function_create,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.variableContainer.createFunction();
                }
            ]
        }
    },
    "function_field_label": {
        "skeleton": "basic_param",
        "isNotFor": [ "functionEdit" ],
        "color": "#f9c535",
        "params": [
            {
                "type": "TextInput",
                "value": Lang.Blocks.FUNCTION_explanation_1
            },
            {
                "type": "Output",
                "accept": "param"
            }
        ],
        paramsKeyMap:{
            NAME: 0,
            NEXT: 1
        },
        "def": {
            "params": [ "이름" ],
            "type": "function_field_label"
        }
    },
    "function_field_string": {
        "skeleton": "basic_param",
        "isNotFor": [ "functionEdit" ],
        "color": "#ffd974",
        "params": [
            {
                "type": "Block",
                "accept": "string",
                "restore": true
            },
            {
                "type": "Output",
                "accept": "param"
            }
        ],
        paramsKeyMap:{
            PARAM: 0,
            NEXT: 1
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "문자/숫자값" ]
                }
            ],
            "type": "function_field_string"
        }
    },
    "function_field_boolean": {
        "skeleton": "basic_param",
        "isNotFor": [ "functionEdit" ],
        "color": "#aeb8ff",
        "params": [
            {
                "type": "Block",
                "accept": "boolean",
                "restore": true
            },
            {
                "type": "Output",
                "accept": "param"
            }
        ],
        paramsKeyMap:{
            PARAM: 0,
            NEXT: 1
        },
        "def": {
            "params": [
                {
                    "type": "True",
                    "params": [ "판단값" ]
                }
            ],
            "type": "function_field_boolean"
        }
    },
    "function_param_string": {
        "skeleton": "basic_string_field",
        "color": "#ffd974",
        "template": "%1 %2",
        "events": {
            "viewAdd": [
                function() {
                    Entry.Func.refreshMenuCode();
                }
            ]
        },
        func: function() {
            return this.executor.register.params[this.executor.register.paramMap[this.block.type]];
        }
    },
    "function_param_boolean": {
        "skeleton": "basic_boolean_field",
        "color": "#aeb8ff",
        "template": "%1 %2",
        "events": {
            "viewAdd": [
                function() {
                    Entry.Func.refreshMenuCode();
                }
            ]
        },
        func: function() {
            return this.executor.register.params[this.executor.register.paramMap[this.block.type]];
        }
    },
    "function_create": {
        "skeleton": "basic_create",
        "color": "#cc7337",
        "event": "funcDef",
        "params": [
            {
                "type": "Block",
                "accept": "param",
                "value": {
                    "type": "function_field_label",
                    "params": [Lang.Blocks.FUNC]
                }
            },
            {
                "type": "Indicator",
                "img": "block_icon/function_03.png",
                "size": 12
            }
        ],
        paramsKeyMap:{
            FIELD: 0
        },
        func: function() {
        }
    },
    "function_general": {
        "skeleton": "basic",
        "color": "#cc7337",
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/function_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_functionRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_functionRefs', block);
                }
            ],
            "dblclick": [
                function(blockView) {
                    var mode = blockView.getBoard().workspace.getMode();
                    if (mode !== Entry.Workspace.MODE_BOARD) return;
                    var block = blockView.block;
                    var id = block.type.substr(5);
                    Entry.Func.edit(Entry.variableContainer.functions_[id]);
                }
            ]
        },
        func: function(entity) {
            if (!this.initiated) {
                this.initiated = true;

                var func = Entry.variableContainer.getFunction(
                    this.block.type.substr(5, 9)
                );
                this.funcCode = func.content;
                this.funcExecutor = this.funcCode.raiseEvent("funcDef", entity)[0];
                this.funcExecutor.register.params = this.getParams();
                var paramMap = {};
                this.funcExecutor.register.paramMap = func.paramMap;
            }
            this.funcExecutor.execute();
            if (!this.funcExecutor.isEnd()) {
                this.funcCode.removeExecutor(this.funcExecutor);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "hamster_hand_found": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "hamster_hand_found"
        },
        "class": "hamster_sensor",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData;
            return pd.leftProximity > 50 || pd.rightProximity > 50;
        }
    },
    "hamster_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_sensor_leftProximity, "leftProximity"],
                    [Lang.Blocks.HAMSTER_sensor_rightProximity, "rightProximity"],
                    [Lang.Blocks.HAMSTER_sensor_leftFloor, "leftFloor"],
                    [Lang.Blocks.HAMSTER_sensor_rightFloor, "rightFloor"],
                    [Lang.Blocks.HAMSTER_sensor_accelerationX, "accelerationX"],
                    [Lang.Blocks.HAMSTER_sensor_accelerationY, "accelerationY"],
                    [Lang.Blocks.HAMSTER_sensor_accelerationZ, "accelerationZ"],
                    [Lang.Blocks.HAMSTER_sensor_light, "light"],
                    [Lang.Blocks.HAMSTER_sensor_temperature, "temperature"],
                    [Lang.Blocks.HAMSTER_sensor_signalStrength, "signalStrength"],
                    [Lang.Blocks.HAMSTER_sensor_inputA, "inputA"],
                    [Lang.Blocks.HAMSTER_sensor_inputB, "inputB"]
                ],
                "value": "leftProximity",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hamster_value"
        },
        "paramsKeyMap": {
            "DEVICE": 0
        },
        "class": "hamster_sensor",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData;
            var dev = script.getField('DEVICE');
            return pd[dev];
        }
    },
    "hamster_move_forward_once": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hamster_move_forward_once"
        },
        "class": "hamster_board",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var pd = Entry.hw.portData;
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                script.count = 0;
                script.boardState = 1;
                sq.leftWheel = 45;
                sq.rightWheel = 45;
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script;
            } else if (script.isMoving) {
                switch(script.boardState) {
                    case 1: {
                        if(script.count < 2) {
                            if(pd.leftFloor < 50 && pd.rightFloor < 50)
                                script.count ++;
                            else
                                script.count = 0;
                            var diff = pd.leftFloor - pd.rightFloor;
                            sq.leftWheel = 45 + diff * 0.25;
                            sq.rightWheel = 45 - diff * 0.25;
                        } else {
                            script.count = 0;
                            script.boardState = 2;
                        }
                        break;
                    }
                case 2: {
                    var diff = pd.leftFloor - pd.rightFloor;
                    sq.leftWheel = 45 + diff * 0.25;
                    sq.rightWheel = 45 - diff * 0.25;
                    script.boardState = 3;
                    var timer = setTimeout(function() {
                        script.boardState = 4;
                        Entry.Hamster.removeTimeout(timer);
                    }, 250);
                    Entry.Hamster.timeouts.push(timer);
                    break;
                }
            case 3: {
                var diff = pd.leftFloor - pd.rightFloor;
                sq.leftWheel = 45 + diff * 0.25;
                sq.rightWheel = 45 - diff * 0.25;
                break;
            }
        case 4: {
            sq.leftWheel = 0;
            sq.rightWheel = 0;
            script.boardState = 0;
            script.isMoving = false;
            break;
        }
                }
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                delete script.count;
                delete script.boardState;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_turn_once": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "hamster_turn_once"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "hamster_board",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var pd = Entry.hw.portData;
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                script.count = 0;
                script.boardState = 1;
                var direction = script.getField("DIRECTION", script);
                if (direction == 'LEFT') {
                    script.isLeft = true;
                    sq.leftWheel = -45;
                    sq.rightWheel = 45;
                } else {
                    script.isLeft = false;
                    sq.leftWheel = 45;
                    sq.rightWheel = -45;
                }
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script;
            } else if (script.isMoving) {
                if(script.isLeft) {
                    switch(script.boardState) {
                        case 1: {
                            if(script.count < 2) {
                                if(pd.leftFloor > 50)
                                    script.count ++;
                            } else {
                                script.count = 0;
                                script.boardState = 2;
                            }
                            break;
                        }
                    case 2: {
                        if(pd.leftFloor < 20) {
                            script.boardState = 3;
                        }
                        break;
                    }
                case 3: {
                    if(script.count < 2) {
                        if(pd.leftFloor < 20)
                            script.count ++;
                    } else {
                        script.count = 0;
                        script.boardState = 4;
                    }
                    break;
                }
            case 4: {
                if(pd.leftFloor > 50) {
                    script.boardState = 5;
                }
                break;
            }
        case 5: {
            var diff = pd.leftFloor - pd.rightFloor;
            if(diff > -15) {
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                script.boardState = 0;
                script.isMoving = false;
            } else {
                sq.leftWheel = diff * 0.5;
                sq.rightWheel = -diff * 0.5;
            }
            break;
        }
                    }
                } else {
                    switch(script.boardState) {
                        case 1: {
                            if(script.count < 2) {
                                if(pd.rightFloor > 50)
                                    script.count ++;
                            } else {
                                script.count = 0;
                                script.boardState = 2;
                            }
                            break;
                        }
                    case 2: {
                        if(pd.rightFloor < 20) {
                            script.boardState = 3;
                        }
                        break;
                    }
                case 3: {
                    if(script.count < 2) {
                        if(pd.rightFloor < 20)
                            script.count ++;
                    } else {
                        script.count = 0;
                        script.boardState = 4;
                    }
                    break;
                }
            case 4: {
                if(pd.rightFloor > 50) {
                    script.boardState = 5;
                }
                break;
            }
        case 5: {
            var diff = pd.rightFloor - pd.leftFloor;
            if(diff > -15) {
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                script.boardState = 0;
                script.isMoving = false;
            } else {
                sq.leftWheel = -diff * 0.5;
                sq.rightWheel = diff * 0.5;
            }
            break;
        }
                    }
                }
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                delete script.count;
                delete script.boardState;
                delete script.isLeft;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_move_forward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "hamster_move_forward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.leftWheel = 30;
                sq.rightWheel = 30;
                Entry.Hamster.setLineTracerMode(sq, 0);
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_move_backward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "hamster_move_backward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.leftWheel = -30;
                sq.rightWheel = -30;
                Entry.Hamster.setLineTracerMode(sq, 0);
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_turn_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "hamster_turn_for_secs"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var direction = script.getField("DIRECTION", script);
                if (direction == 'LEFT') {
                    sq.leftWheel = -30;
                    sq.rightWheel = 30;
                } else {
                    sq.leftWheel = 30;
                    sq.rightWheel = -30;
                }
                Entry.Hamster.setLineTracerMode(sq, 0);
                var timeValue = script.getNumberValue("VALUE") * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_change_both_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "hamster_change_both_wheels_by"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var left = script.getNumberValue('LEFT');
            var right = script.getNumberValue('RIGHT');
            sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
            sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
            Entry.Hamster.setLineTracerMode(sq, 0);
            return script.callReturn();
        }
    },
    "hamster_set_both_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                null
            ],
            "type": "hamster_set_both_wheels_to"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.leftWheel = script.getNumberValue('LEFT');
            sq.rightWheel = script.getNumberValue('RIGHT');
            Entry.Hamster.setLineTracerMode(sq, 0);
            return script.callReturn();
        }
    },
    "hamster_change_wheel_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "hamster_change_wheel_by"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');
            if (direction == 'LEFT') {
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
            } else if (direction == 'RIGHT') {
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
            } else {
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
            }
            Entry.Hamster.setLineTracerMode(sq, 0);
            return script.callReturn();
        }
    },
    "hamster_set_wheel_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "30" ]
                },
                null
            ],
            "type": "hamster_set_wheel_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField('DIRECTION');
            var value = script.getNumberValue('VALUE');
            if (direction == 'LEFT') {
                sq.leftWheel = value;
            } else if (direction == 'RIGHT') {
                sq.rightWheel = value;
            } else {
                sq.leftWheel = value;
                sq.rightWheel = value;
            }
            Entry.Hamster.setLineTracerMode(sq, 0);
            return script.callReturn();
        }
    },
    "hamster_follow_line_using": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_color_black,"BLACK"],
                    [Lang.General.white,"WHITE"]
                ],
                "value": "BLACK",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "hamster_follow_line_using"
        },
        "paramsKeyMap": {
            "COLOR": 0,
            "DIRECTION": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var color = script.getField('COLOR');
            var direction = script.getField('DIRECTION');

            var mode = 1;
            if (direction == 'RIGHT') mode = 2;
            else if (direction == 'BOTH') mode = 3;
            if (color == 'WHITE') mode += 7;

            sq.leftWheel = 0;
            sq.rightWheel = 0;
            Entry.Hamster.setLineTracerMode(sq, mode);
            return script.callReturn();
        }
    },
    "hamster_follow_line_until": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_color_black,"BLACK"],
                    [Lang.General.white,"WHITE"]
                ],
                "value": "BLACK",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.Blocks.HAMSTER_front,"FRONT"],
                    [Lang.Blocks.HAMSTER_rear,"REAR"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "hamster_follow_line_until"
        },
        "paramsKeyMap": {
            "COLOR": 0,
            "DIRECTION": 1
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var pd = Entry.hw.portData;
            var color = script.getField('COLOR');
            var direction = script.getField('DIRECTION');

            var mode = 4;
            if (direction == 'RIGHT') mode = 5;
            else if (direction == 'FRONT') mode = 6;
            else if (direction == 'REAR') mode = 7;
            if (color == 'WHITE') mode += 7;

            if (!script.isStart) {
                script.isStart = true;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                Entry.Hamster.setLineTracerMode(sq, mode);
                return script;
            } else {
                var hamster = Entry.Hamster;
                if (pd.lineTracerStateId != hamster.lineTracerStateId) {
                    hamster.lineTracerStateId = pd.lineTracerStateId;
                    if (pd.lineTracerState == 0x40) {
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        hamster.setLineTracerMode(sq, 0);
                        return script.callReturn();
                    }
                }
                return script;
            }
        }
    },
    "hamster_set_following_speed_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ],
                    [ "8", "8" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ "5", null ],
            "type": "hamster_set_following_speed_to"
        },
        "paramsKeyMap": {
            "SPEED": 0
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.lineTracerSpeed = Number(script.getField("SPEED", script));
            return script.callReturn();
        }
    },
    "hamster_stop": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hamster_stop"
        },
        "class": "hamster_wheel",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.leftWheel = 0;
            sq.rightWheel = 0;
            Entry.Hamster.setLineTracerMode(sq, 0);
            return script.callReturn();
        }
    },
    "hamster_set_led_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.red,"4"],
                    [Lang.General.yellow,"6"],
                    [Lang.General.green,"2"],
                    [Lang.Blocks.HAMSTER_color_cyan,"3"],
                    [Lang.General.blue,"1"],
                    [Lang.Blocks.HAMSTER_color_magenta,"5"],
                    [Lang.General.white,"7"]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "hamster_set_led_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "COLOR": 1
        },
        "class": "hamster_led",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            var color = Number(script.getField("COLOR", script));
            if (direction == 'LEFT') {
                sq.leftLed = color;
            } else if (direction == 'RIGHT') {
                sq.rightLed = color;
            } else {
                sq.leftLed = color;
                sq.rightLed = color;
            }
            return script.callReturn();
        }
    },
    "hamster_clear_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"],
                    [Lang.General.both,"BOTH"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "hamster_clear_led"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "hamster_led",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var direction = script.getField("DIRECTION", script);
            if (direction == 'LEFT') {
                sq.leftLed = 0;
            } else if (direction == 'RIGHT') {
                sq.rightLed = 0;
            } else {
                sq.leftLed = 0;
                sq.rightLed = 0;
            }
            return script.callReturn();
        }
    },
    "hamster_beep": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hamster_beep"
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                sq.buzzer = 440;
                sq.note = 0;
                var timeValue = 0.2 * 1000;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.buzzer = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_change_buzzer_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "hamster_change_buzzer_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var value = script.getNumberValue('VALUE');
            sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
            sq.note = 0;
            return script.callReturn();
        }
    },
    "hamster_set_buzzer_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "1000" ]
                },
                null
            ],
            "type": "hamster_set_buzzer_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.buzzer = script.getNumberValue('VALUE');
            sq.note = 0;
            return script.callReturn();
        }
    },
    "hamster_clear_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hamster_clear_buzzer"
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            sq.buzzer = 0;
            sq.note = 0;
            return script.callReturn();
        }
    },
    "hamster_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.note_c + '',"4"],
                    [Lang.General.note_c + '#',"5"],
                    [Lang.General.note_d + '',"6"],
                    [Lang.General.note_e + 'b',"7"],
                    [Lang.General.note_e + '',"8"],
                    [Lang.General.note_f + '',"9"],
                    [Lang.General.note_f + '#',"10"],
                    [Lang.General.note_g + '',"11"],
                    [Lang.General.note_g + '#',"12"],
                    [Lang.General.note_a + '',"13"],
                    [Lang.General.note_b + 'b',"14"],
                    [Lang.General.note_b + '',"15"]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                "4",
                {
                    "type": "text",
                    "params": [ "0.5" ]
                },
                null
            ],
            "type": "hamster_play_note_for"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "VALUE": 2
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                var note = script.getNumberField("NOTE", script);
                var octave = script.getNumberField("OCTAVE", script);
                var beat = script.getNumberValue("VALUE", script);
                var tempo = Entry.Hamster.tempo;
                note += (octave-1)*12;
                var timeValue = beat*60*1000/tempo;
                script.isStart = true;
                script.timeFlag = 1;
                sq.buzzer = 0;
                sq.note = note;
                if (timeValue > 100) {
                    var timer1 = setTimeout(function() {
                        sq.note = 0;
                        Entry.Hamster.removeTimeout(timer1);
                    }, timeValue-100);
                    Entry.Hamster.timeouts.push(timer1);
                }
                var timer2 = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer2);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer2);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                sq.note = 0;
                return script.callReturn();
            }
        }
    },
    "hamster_rest_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "0.25" ]
                },
                null
            ],
            "type": "hamster_rest_for"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = script.getNumberValue('VALUE');
                timeValue = timeValue*60*1000/Entry.Hamster.tempo;
                sq.buzzer = 0;
                sq.note = 0;
                var timer = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.Hamster.removeTimeout(timer);
                }, timeValue);
                Entry.Hamster.timeouts.push(timer);
                return script;
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }
    },
    "hamster_change_tempo_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "20" ]
                },
                null
            ],
            "type": "hamster_change_tempo_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            Entry.Hamster.tempo += script.getNumberValue('VALUE');
            if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
            return script.callReturn();
        }
    },
    "hamster_set_tempo_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "60" ]
                },
                null
            ],
            "type": "hamster_set_tempo_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "hamster_buzzer",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            Entry.Hamster.tempo = script.getNumberValue('VALUE');
            if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
            return script.callReturn();
        }
    },
    "hamster_set_port_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_port_a, "A"],
                    [Lang.Blocks.HAMSTER_port_b, "B"],
                    [Lang.Blocks.HAMSTER_port_ab, "AB"]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_analog_input, "0"],
                    [Lang.Blocks.HAMSTER_digital_input, "1"],
                    [Lang.Blocks.HAMSTER_servo_output, "8"],
                    [Lang.Blocks.HAMSTER_pwm_output, "9"],
                    [Lang.Blocks.HAMSTER_digital_output, "10"]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "hamster_set_port_to"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "MODE": 1
        },
        "class": "hamster_port",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var port = script.getField("PORT", script);
            var mode = Number(script.getField("MODE", script));
            if (port == 'A') {
                sq.ioModeA = mode;
            } else if (port == 'B') {
                sq.ioModeB = mode;
            } else {
                sq.ioModeA = mode;
                sq.ioModeB = mode;
            }
            return script.callReturn();
        }
    },
    "hamster_change_output_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_port_a, "A"],
                    [Lang.Blocks.HAMSTER_port_b, "B"],
                    [Lang.Blocks.HAMSTER_port_ab, "AB"]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "hamster_change_output_by"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "hamster_port",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var port = script.getField('PORT');
            var value = script.getNumberValue('VALUE');
            if (port == 'A') {
                sq.outputA = sq.outputA != undefined ? sq.outputA + value : value;
            } else if (port == 'B') {
                sq.outputB = sq.outputB != undefined ? sq.outputB + value : value;
            } else {
                sq.outputA = sq.outputA != undefined ? sq.outputA + value : value;
                sq.outputB = sq.outputB != undefined ? sq.outputB + value : value;
            }
            return script.callReturn();
        }
    },
    "hamster_set_output_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.HAMSTER_port_a, "A"],
                    [Lang.Blocks.HAMSTER_port_b, "B"],
                    [Lang.Blocks.HAMSTER_port_ab, "AB"]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "hamster_set_output_to"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "hamster_port",
        "isNotFor": [ "hamster" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var port = script.getField('PORT');
            var value = script.getNumberValue('VALUE');
            if (port == 'A') {
                sq.outputA = value;
            } else if (port == 'B') {
                sq.outputB = value;
            } else {
                sq.outputA = value;
                sq.outputB = value;
            }
            return script.callReturn();
        }
    },
    "is_clicked": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_is_clicked,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "is_clicked"
        },
        "class": "boolean_input",
        "isNotFor": [],
        "func": function (sprite, script) {
            return Entry.stage.isClick;
        }
    },
    "is_press_some_key": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Keyboard",
                "value": 81
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_is_press_some_key_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "is_press_some_key"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "boolean_input",
        "isNotFor": [],
        "func": function (sprite, script) {
            var keycode = Number(script.getField("VALUE", script));
            return Entry.pressedKeys.indexOf(keycode) >= 0;
        }
    },
    "reach_something": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_reach_something_1,
                "color": "#3D3D3D"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "collision",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_JUDGE
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_reach_something_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "reach_something"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "boolean_collision",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!sprite.getVisible())
                return false;
            var targetSpriteId = script.getField("VALUE", script);
            var reg = /wall/;
            var ath = 0.2;
            var object = sprite.object
            var isWall = reg.test(targetSpriteId);
            var collision = ndgmr.checkPixelCollision;
            if (isWall) {
                var wall = Entry.stage.wall;
                switch(targetSpriteId) {
                    case 'wall':
                        if (collision(object,wall.up,ath,true) ||
                            collision(object,wall.down,ath,true) ||
                            collision(object,wall.left,ath,true) ||
                                collision(object,wall.right,ath,true))
                                return true;
                        else
                            return false;

                        case 'wall_up':
                            if (collision(object,wall.up,ath,true))
                                return true;
                            else
                                return false;
                            case 'wall_down':
                                if (collision(object,wall.down,ath,true))
                                    return true;
                                else
                                    return false;
                            case 'wall_right':
                                if (collision(object,wall.right,ath,true))
                                    return true;
                                else
                                    return false;
                            case 'wall_left':
                                if (collision(object,wall.left,ath,true))
                                    return true;
                                else
                                    return false;
                }
            } else if (targetSpriteId == 'mouse') {
                var stage = Entry.stage.canvas;
                var pt = object.globalToLocal(stage.mouseX, stage.mouseY);
                return object.hitTest(pt.x, pt.y);
            } else {
                var targetSprite = Entry.container.getEntity(targetSpriteId);
                if (targetSprite.type == "textBox" || sprite.type == 'textBox') {
                    var targetBound = targetSprite.object.getTransformedBounds();
                    var bound = object.getTransformedBounds();
                    if (Entry.checkCollisionRect(bound, targetBound))
                        return true;
                    var clonedEntities = targetSprite.parent.clonedEntities;
                    for (var i=0, len=clonedEntities.length; i<len; i++) {
                        var entity = clonedEntities[i];
                        if(entity.isStamp)
                            continue;
                        if (!entity.getVisible())
                            continue;
                        if (Entry.checkCollisionRect(bound, entity.object.getTransformedBounds()))
                            return true;
                    }
                } else {
                    if (targetSprite.getVisible() &&
                        collision(object,targetSprite.object,ath,true))
                    return true;
                    var clonedEntities = targetSprite.parent.clonedEntities;
                    for (var i=0, len=clonedEntities.length; i<len; i++) {
                        var entity = clonedEntities[i];
                        if(entity.isStamp)
                            continue;
                        if (!entity.getVisible())
                            continue;
                        if (collision(object,entity.object,ath,true))
                            return true;
                    }
                }
            }
            return false;
        }
    },
    "boolean_comparison": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "=", "EQUAL" ],
                    [ "<", "SMALLER" ],
                    [ ">", "BIGGER" ]
                ],
                "value": "EQUAL",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            type: "boolean_comparison"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var operator = script.getField("OPERATOR", script);
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            if (operator == "EQUAL")
                return leftValue == rightValue;
            else if (operator == "BIGGER")
                return leftValue > rightValue;
            else
                return leftValue < rightValue;
        }
    },
    "boolean_equal": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "=",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                }
            ],
            "type": "boolean_equal"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "boolean_compare",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getStringValue("LEFTHAND", script);
            var rightValue = script.getStringValue("RIGHTHAND", script);
            return leftValue == rightValue;
        }
    },
    "boolean_bigger": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": ">",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                }
            ],
            "type": "boolean_bigger"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "boolean_compare",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue > rightValue;
        }
    },
    "boolean_smaller": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": "<",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                }
            ],
            "type": "boolean_smaller"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "boolean_compare",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getNumberValue("LEFTHAND", script);
            var rightValue = script.getNumberValue("RIGHTHAND", script);
            return leftValue < rightValue;
        }
    },
    "boolean_and_or": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.JUDGEMENT_boolean_and, "AND" ],
                    [ Lang.Blocks.JUDGEMENT_boolean_or, "OR" ]
                ],
                "value": "AND",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "boolean"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "func": function (sprite, script) {
            var operator = script.getField("OPERATOR", script);
            var leftValue = script.getBooleanValue("LEFTHAND", script);
            var rightValue = script.getBooleanValue("RIGHTHAND", script);
            if (operator == "AND")
                return leftValue && rightValue;
            else
                return leftValue || rightValue;
        }
    },
    "boolean_and": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_boolean_and,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "boolean"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "True"
                },
                null,
                {
                    "type": "True"
                }
            ],
            "type": "boolean_and"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "boolean",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getBooleanValue("LEFTHAND", script);
            var rightValue = script.getBooleanValue("RIGHTHAND", script);
            return leftValue && rightValue;
        }
    },
    "boolean_or": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_boolean_or,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "boolean"
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "True" },
                null,
                { "type": "False" }
            ],
            "type": "boolean_or"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "boolean",
        "isNotFor": [],
        "func": function (sprite, script) {
            var leftValue = script.getBooleanValue("LEFTHAND", script);
            var rightValue = script.getBooleanValue("RIGHTHAND", script);
            return leftValue || rightValue;
        }
    },
    "boolean_not": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_boolean_not_1,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_boolean_not_2,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                { "type": "True" },
                null
            ],
            "type": "boolean_not"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "boolean",
        "isNotFor": [],
        "func": function (sprite, script) {
            return !script.getBooleanValue("VALUE");
        }
    },
    "true_or_false": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.JUDGEMENT_true,"true"],
                    [Lang.Blocks.JUDGEMENT_false, "false"]
                ],
                "value": "true",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            var value = script.children[0].textContent;
            return value == "true";
        }
    },
    "True": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_true,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            type: "True"
        },
        "func": function (sprite, script) {
            return true;
        },
        "isPrimitive": true
    },
    "False": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_false,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            type: "False"
        },
        "func": function (sprite, script) {
            return false;
        },
        "isPrimitive": true
    },
    "boolean_basic_operator": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "=", "EQUAL" ],
                    [ ">", "GREATER" ],
                    [ "<", "LESS" ],
                    [ "≥", "GREATER_OR_EQUAL" ],
                    [ "≤", "LESS_OR_EQUAL" ]
                ],
                "value": "EQUAL",
                "fontSize": 11,
                noArrow: true
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                "EQUAL",
                {
                    "type": "text",
                    "params": [ "10" ]
                }
            ],
            "type": "boolean_basic_operator"
        },
        "defs": [
            {
                "params": [
                    {
                        "type": "text",
                        "params": [ "10" ]
                    },
                    "EQUAL",
                    {
                        "type": "text",
                        "params": [ "10" ]
                    }
                ],
                "type": "boolean_basic_operator"
            },
            {
                "params": [
                    {
                        "type": "text",
                        "params": [ "10" ]
                    },
                    "GREATER",
                    {
                        "type": "text",
                        "params": [ "10" ]
                    }
                ],
                "type": "boolean_basic_operator"
            },
            {
                "params": [
                    {
                        "type": "text",
                        "params": [ "10" ]
                    },
                    "LESS",
                    {
                        "type": "text",
                        "params": [ "10" ]
                    }
                ],
                "type": "boolean_basic_operator"
            },
            {
                "params": [
                    {
                        "type": "text",
                        "params": [ "10" ]
                    },
                    "GREATER_OR_EQUAL",
                    {
                        "type": "text",
                        "params": [ "10" ]
                    }
                ],
                "type": "boolean_basic_operator"
            },
            {
                "params": [
                    {
                        "type": "text",
                        "params": [ "10" ]
                    },
                    "LESS_OR_EQUAL",
                    {
                        "type": "text",
                        "params": [ "10" ]
                    }
                ],
                "type": "boolean_basic_operator"
            }
        ],
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "class": "boolean_compare",
        "isNotFor": [],
        "func": function (sprite, script) {
            var operator = script.getField("OPERATOR", script);
            var leftValue = script.getStringValue("LEFTHAND", script);
            var rightValue = script.getStringValue("RIGHTHAND", script);

            switch(operator) {
                case 'EQUAL':
                    return leftValue == rightValue;
                case 'GREATER':
                    return Number(leftValue) > Number(rightValue);
                case 'LESS':
                    return Number(leftValue) < Number(rightValue);
                case 'GREATER_OR_EQUAL':
                    return Number(leftValue) >= Number(rightValue);
                case 'LESS_OR_EQUAL':
                    return Number(leftValue) <= Number(rightValue);
            }
        }
    },
    "show": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "show"
        },
        "class": "visibility",
        "isNotFor": [],
        "func": function (sprite, script) {
            sprite.setVisible(true);
            return script.callReturn();
        }
    },
    "hide": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "hide"
        },
        "class": "visibility",
        "isNotFor": [],
        "func": function (sprite, script) {
            sprite.setVisible(false);
            return script.callReturn();
        }
    },
    "dialog_time": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.speak, "speak" ]
                ],
                "value": "speak",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.block_hi ]
                },
                {
                    "type": "number",
                    "params": [ "4" ]
                },
                null,
                null
            ],
            "type": "dialog_time"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1,
            "OPTION": 2
        },
        "class": "say",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue = script.getNumberValue("SECOND", script);
                var message = script.getStringValue("VALUE", script);
                var mode = script.getField("OPTION", script);
                script.isStart = true;
                script.timeFlag = 1;
                if (!message && typeof message != 'number')
                    message = '    ';
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
                if(sprite.dialog)   sprite.dialog.remove();
                return script.callReturn();
            } else {
                if (!sprite.dialog) {
                    var message = script.getStringValue("VALUE", script);
                    var mode = script.getField("OPTION", script);
                    if (!message && typeof message != 'number')
                        message = '    ';
                    message = Entry.convertToRoundedDecimals(message, 3);
                    new Entry.Dialog(sprite, message, mode);
                    sprite.syncDialogVisible(sprite.getVisible());
                }
                return script;
            }
        }
    },
    "dialog": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.speak, "speak" ]
                ],
                "value": "speak",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.block_hi ]
                },
                null, null
            ],
            "type": "dialog"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "OPTION": 1
        },
        "class": "say",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var message = script.getStringValue("VALUE", script);
            if (!message && typeof message != 'number') {
                message = '    ';
            }
            var mode = script.getField("OPTION", script);
            message = Entry.convertToRoundedDecimals(message, 3);
            new Entry.Dialog(sprite, message, mode);
            sprite.syncDialogVisible(sprite.getVisible());
            return script.callReturn();
        }
    },
    "remove_dialog": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "remove_dialog"
        },
        "class": "say",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            if(sprite.dialog)   sprite.dialog.remove();
            return script.callReturn();
        }
    },
    "change_to_nth_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "pictures",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "change_to_nth_shape"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "shape",
        "isNotFor": [],
        "func": function (sprite, script) {
            var imageId = script.getField("VALUE", script);
            var picture = sprite.parent.getPicture(imageId);
            sprite.setImage(picture);
            return script.callReturn();
        }
    },
    "change_to_next_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.LOOKS_change_shape_next, "next" ],
                    [ Lang.Blocks.LOOKS_change_shape_prev, "prev" ]
                ],
                "value": "next",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "change_to_next_shape"
        },
        "paramsKeyMap": {
            "DRIECTION": 0
        },
        "class": "shape",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var picture;
            if(script.getStringField("DRIECTION") !== 'prev') {
                picture = sprite.parent.getNextPicture(sprite.picture.id);
            } else {
                picture = sprite.parent.getPrevPicture(sprite.picture.id);
            }
            sprite.setImage(picture);
            return script.callReturn();
        }
    },
    "set_effect_volume": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.color, "color"],
                    [Lang.Blocks.brightness, "brightness"],
                    [Lang.Blocks.opacity, "opacity"]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "set_effect_volume"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hue = effectValue + sprite.effect.hue;
            } else if (effect == "lens") {
            } else if (effect == "swriling") {
            } else if (effect == "pixel") {
            } else if (effect == "mosaic") {
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue + sprite.effect.brightness;
            } else if (effect == "blur") {
            } else if (effect == "opacity") {
                sprite.effect.alpha = (sprite.effect.alpha + effectValue / 100) ;
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "set_effect": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.color, "color"],
                    [Lang.Blocks.brightness, "brightness"],
                    [Lang.Blocks.opacity, "opacity"]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "set_effect"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hue = effectValue;
            } else if (effect == "lens") {
            } else if (effect == "swriling") {
            } else if (effect == "pixel") {
            } else if (effect == "mosaic") {
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue;
            } else if (effect == "blur") {
            } else if (effect == "opacity") {
                sprite.effect.alpha = effectValue / 100;
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "erase_all_effects": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "erase_all_effects"
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            sprite.resetFilter();
            return script.callReturn();
        }
    },
    "change_scale_percent": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_scale_percent"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scale",
        "isNotFor": [],
        "func": function (sprite, script) {
            var scaleValue = (script.getNumberValue("VALUE", script) + 100) / 100;
            sprite.setScaleX(sprite.getScaleX() * scaleValue);
            sprite.setScaleY(sprite.getScaleY() * scaleValue);
            return script.callReturn();
        }
    },
    "set_scale_percent": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "set_scale_percent"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scale",
        "isNotFor": [],
        "func": function (sprite, script) {
            var scaleValue = script.getNumberValue("VALUE", script) / 100;
            var snapshot = sprite.snapshot_;
            sprite.setScaleX(scaleValue * snapshot.scaleX);
            sprite.setScaleY(scaleValue * snapshot.scaleY);
            return script.callReturn();
        }
    },
    "change_scale_size": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_scale_size"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scale",
        "isNotFor": [],
        "func": function (sprite, script) {
            var sizeValue = script.getNumberValue("VALUE", script);
            sprite.setSize(sprite.getSize() + sizeValue);
            return script.callReturn();
        }
    },
    "set_scale_size": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "set_scale_size"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scale",
        "isNotFor": [],
        "func": function (sprite, script) {
            var sizeValue = script.getNumberValue("VALUE", script);
            sprite.setSize(sizeValue);
            return script.callReturn();
        }
    },
    "flip_y": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "flip_y"
        },
        "class": "flip",
        "isNotFor": [],
        "func": function (sprite, script) {
            sprite.setScaleX((-1)*sprite.getScaleX());
            return script.callReturn();
        }
    },
    "flip_x": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "flip_x"
        },
        "class": "flip",
        "isNotFor": [],
        "func": function (sprite, script) {
            sprite.setScaleY((-1)*sprite.getScaleY());
            return script.callReturn();
        }
    },
    "set_object_order": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "objectSequence",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "set_object_order"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "z-index",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetIndex = script.getField("VALUE", script);
            //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);
            var currentIndex = Entry.container.getCurrentObjects().indexOf(sprite.parent);

            if (currentIndex > -1) {
                Entry.container.moveElementByBlock(currentIndex, targetIndex);
                return script.callReturn();
            } else
                throw new Error('object is not available');
        }
    },
    "get_pictures": {
        "color": "#EC4466",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "pictures",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("VALUE");
        }
    },
    "change_to_some_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_pictures",
                    "id": "z4jm"
                },
                null
            ],
            "type": "change_to_some_shape"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "shape",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var imageId = script.getStringValue("VALUE");
            var value = Entry.parseNumber(imageId);
            var picture = sprite.parent.getPicture(imageId);

            sprite.setImage(picture);
            return script.callReturn();
        }
    },
    "add_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.color, "color" ],
                    [ Lang.Blocks.brightness, "brightness" ],
                    [ Lang.Blocks.transparency, "transparency" ]
                ],
                "value": "color",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "add_effect_amount"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hsv = effectValue + sprite.effect.hsv;
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue + sprite.effect.brightness;
            } else if (effect == "transparency") {
                sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "change_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.color, "color" ],
                    [ Lang.Blocks.brightness, "brightness" ],
                    [ Lang.Blocks.transparency, "transparency" ]
                ],
                "value": "color",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "change_effect_amount"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hsv = effectValue;
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue;
            } else if (effect == "transparency") {
                sprite.effect.alpha = 1 - (effectValue / 100);
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "set_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.color, "color"],
                    [Lang.Blocks.brightness, "brightness"],
                    [Lang.Blocks.transparency, "transparency"]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "set_effect_amount"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hue = effectValue + sprite.effect.hue;
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue + sprite.effect.brightness;
            } else if (effect == "transparency") {
                sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "set_entity_effect": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.color, "color"],
                    [Lang.Blocks.brightness, "brightness"],
                    [Lang.Blocks.transparency, "transparency"]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "100" ]
                },
                null
            ],
            "type": "set_entity_effect"
        },
        "paramsKeyMap": {
            "EFFECT": 0,
            "VALUE": 1
        },
        "class": "effect",
        "isNotFor": [ "textBox" ],
        "func": function (sprite, script) {
            var effect = script.getField("EFFECT", script);
            var effectValue = script.getNumberValue("VALUE", script);
            if (effect == "color") {
                sprite.effect.hue = effectValue;
            } else if (effect == "brightness") {
                sprite.effect.brightness = effectValue;
            } else if (effect == "transparency") {
                sprite.effect.alpha = 1 - (effectValue / 100);
            }
            sprite.applyFilter();
            return script.callReturn();
        }
    },
    "change_object_index": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.LOOKS_change_object_index_sub_1, "FRONT" ],
                    [ Lang.Blocks.LOOKS_change_object_index_sub_2, "FORWARD" ],
                    [ Lang.Blocks.LOOKS_change_object_index_sub_3, "BACKWARD" ],
                    [ Lang.Blocks.LOOKS_change_object_index_sub_4, "BACK" ]
                ],
                "value": "FRONT",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_LOOKS
            },
            {
                "type": "Indicator",
                "img": "block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "change_object_index"
        },
        "paramsKeyMap": {
            "LOCATION": 0
        },
        "class": "z-index",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetIndex;
            var location = script.getField("LOCATION", script);
            var objects = Entry.container.getCurrentObjects();
            var currentIndex = objects.indexOf(sprite.parent);
            var max = objects.length-1

            if (currentIndex < 0)
                throw new Error('object is not available for current scene');

            switch (location) {
                case 'FRONT':
                    targetIndex = 0;
                    break;
                case 'FORWARD':
                    targetIndex = Math.max(0, currentIndex-1);
                    break;
                case 'BACKWARD':
                    targetIndex = Math.min(max, currentIndex+1);
                    break;
                case 'BACK':
                    targetIndex = max;
                    break;

            }

            Entry.container.moveElementByBlock(currentIndex, targetIndex);
            return script.callReturn();
        }
    },
    "move_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "move_direction"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "walk",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setX(sprite.getX() + value * Math.cos((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
            sprite.setY(sprite.getY() - value * Math.sin((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "move_x": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "move_x"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_relative",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setX(sprite.getX() + value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "move_y": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "move_y"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_relative",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setY(sprite.getY() + value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "locate_xy_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "locate_xy_time"
        },
        "paramsKeyMap": {
            "VALUE1": 0,
            "VALUE2": 1,
            "VALUE3": 2
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("VALUE1", script);
                script.isStart = true;
                script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                script.x = script.getNumberValue("VALUE2", script);
                script.y = script.getNumberValue("VALUE3", script);

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
                    sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
                }
            }
        }
    },
    "rotate_by_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "90" ]
                },
                null
            ],
            "type": "rotate_by_angle"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setRotation(sprite.getRotation() + value);
            return script.callReturn();
        }
    },
    "rotate_by_angle_dropdown": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "45", "45" ],
                    [ "90", "90" ],
                    [ "135", "135" ],
                    [ "180", "180" ]
                ],
                "value": "45",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ "45", null ],
            "type": "rotate_by_angle_dropdown"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "ebs",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getField("VALUE", script);
            sprite.setRotation(sprite.getRotation() + Number(value));
            return script.callReturn();
        }
    },
    "see_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "90" ]
                },
                null
            ],
            "type": "see_angle"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setDirection(value);
            return script.callReturn();
        }
    },
    "see_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sprites",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            var targetId = script.getField("VALUE", script);
            var targetEntity = Entry.container.getEntity(targetId);
            var deltaX = targetEntity.getX() - sprite.getX();
            var deltaY = targetEntity.getY() - sprite.getY();
            if (deltaX>=0) {
                sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 90);
            } else {
                sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 270);
            }
            return script.callReturn();
        }
    },
    "locate_xy": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "locate_xy"
        },
        "paramsKeyMap": {
            "VALUE1": 0,
            "VALUE2": 1
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value1 = script.getNumberValue("VALUE1", script);
            var value2 = script.getNumberValue("VALUE2", script);
            sprite.setX(value1);
            sprite.setY(value2);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "locate_x": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "locate_x"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setX(value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "locate_y": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "locate_y"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            //sprite.y = 340 - value;
            sprite.setY(value);
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "locate": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_MOVING
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "locate"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetId = script.getField("VALUE", script);
            var x,y;
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
                sprite.brush.lineTo(x, y*-1);
            }
            return script.callReturn();
        }
    },
    "move_xy_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "move_xy_time"
        },
        "paramsKeyMap": {
            "VALUE1": 0,
            "VALUE2": 1,
            "VALUE3": 2
        },
        "class": "move_relative",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("VALUE1", script);
                var xValue = script.getNumberValue("VALUE2", script);
                var yValue = script.getNumberValue("VALUE3", script);
                script.isStart = true;
                script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                script.dX = xValue/script.frameCount;
                script.dY = yValue/script.frameCount;

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
                    sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
                }
            };
        }
    },
    "rotate_by_angle_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            { "type": "Angle" },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                null,
                null
            ],
            "type": "rotate_by_angle_time"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("VALUE", script);
                var angleValue = script.getNumberField("VALUE", script);
                script.isStart = true;
                script.frameCount = Math.floor(timeValue * Entry.FPS)
                script.dAngle = angleValue/script.frameCount;
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
        }
    },
    "bounce_wall": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "bounce_wall"
        },
        "class": "walk",
        "isNotFor": [],
        "func": function (sprite, script) {
            var threshold = 0;

            var method = sprite.parent.getRotateMethod();
            /*
               var bound = sprite.object.getTransformedBounds();
               var size = {};
               size.width = bound.width * Math.sqrt(1.0 + (bound.height/bound.width) * (bound.height/bound.width));
               size.height = bound.height * Math.sqrt(1.0 + (bound.width/bound.height) * (bound.width/bound.height));
               */

            if (method == 'free')
                var angle = (sprite.getRotation() + sprite.getDirection()).mod(360);
            else
                var angle = sprite.getDirection();

            var skip = Entry.Utils.COLLISION.NONE;
            if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
                skip = (sprite.collision == Entry.Utils.COLLISION.UP);
                var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);
                if (!up && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (up && skip)
                    up = false;

                if (up) {
                    if (method == 'free')
                        sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                    else
                        sprite.setDirection(- sprite.getDirection() + 180);

                    sprite.collision = Entry.Utils.COLLISION.UP;
                    //sprite.setY(135 - bound.height/2 - 1);
                } else {
                    skip = (sprite.collision == Entry.Utils.COLLISION.DOWN);
                    var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);
                    if (!down && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (down && skip)
                        down = false;

                    if (down) {
                        if (method == 'free')
                            sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                        else
                            sprite.setDirection(- sprite.getDirection() + 180);

                        sprite.collision = Entry.Utils.COLLISION.DOWN;
                        //sprite.setY(-135 + bound.height/2 + 1);
                    }

                }
            } else if (angle < 270 && angle >= 90) {
                skip = (sprite.collision == Entry.Utils.COLLISION.DOWN);
                var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);
                if (!down && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (down && skip)
                    down = false;

                if (down) {
                    if (method == 'free')
                        sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                    else
                        sprite.setDirection(- sprite.getDirection() + 180);

                    sprite.collision = Entry.Utils.COLLISION.DOWN;
                    //sprite.setY(-135 + bound.height/2 + 1);
                } else {
                    skip = (sprite.collision == Entry.Utils.COLLISION.UP);
                    var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);
                    if (!up && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (up && skip)
                        up = false;

                    if (up) {
                        if (method == 'free')
                            sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                        else
                            sprite.setDirection(- sprite.getDirection() + 180);

                        sprite.collision = Entry.Utils.COLLISION.UP;
                        //sprite.setY(135 - bound.height/2 - 1);
                    }
                }
            }
            if (angle < 360 && angle >= 180) {
                skip = (sprite.collision == Entry.Utils.COLLISION.LEFT);
                var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);
                if (!left && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (left && skip)
                    left = false;

                if (left) {
                    if (method == 'free')
                        sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                    else
                        sprite.setDirection(- sprite.getDirection() + 360);

                    sprite.collision = Entry.Utils.COLLISION.LEFT;
                    //sprite.setX(-240 + bound.width/2 + 1);
                } else {
                    skip = (sprite.collision == Entry.Utils.COLLISION.RIGHT);
                    var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);
                    if (!right && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (right && skip)
                        right = false;

                    if (right) {
                        if (method == 'free')
                            sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                        else
                            sprite.setDirection(- sprite.getDirection() + 360);

                        sprite.collision = Entry.Utils.COLLISION.RIGHT;
                        //sprite.setX(240 - bound.width/2 - 1);
                    }

                }
            } else if (angle < 180 && angle >= 0) {
                skip = (sprite.collision == Entry.Utils.COLLISION.RIGHT);
                var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);
                if (!right && skip)
                    sprite.collision = Entry.Utils.COLLISION.NONE;

                if (right && skip)
                    right = false;

                if (right) {
                    if (method == 'free')
                        sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                    else
                        sprite.setDirection(- sprite.getDirection() + 360);

                    sprite.collision = Entry.Utils.COLLISION.RIGHT;
                    //sprite.setX(240 - bound.width/2 - 1);
                } else {
                    skip = (sprite.collision == Entry.Utils.COLLISION.LEFT);
                    var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);
                    if (!left && skip)
                        sprite.collision = Entry.Utils.COLLISION.NONE;

                    if (left && skip)
                        left = false;

                    if (left) {
                        if (method == 'free')
                            sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                        else
                            sprite.setDirection(- sprite.getDirection() + 360);

                        sprite.collision = Entry.Utils.COLLISION.LEFT;
                        //sprite.setX(-240 + bound.width/2 + 1);
                    }
                }
            }
            return script.callReturn();
        }
    },
    "flip_arrow_horizontal": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        }
    },
    "flip_arrow_vertical": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            sprite.setDirection(sprite.getDirection() + 180);
            return script.callReturn();
        }
    },
    "see_angle_object": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_MOVING
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "see_angle_object"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            var targetId = script.getField("VALUE", script);
            var spriteX = sprite.getX();
            var spriteY = sprite.getY();
            var deltaX, deltaY, value;

            if (sprite.parent.id == targetId)
                return script.callReturn();

            if ( targetId == 'mouse' ) {
                var mX = Entry.stage.mouseCoordinate.x;
                var mY = Entry.stage.mouseCoordinate.y;

                deltaX = mX - spriteX;
                deltaY = mY - spriteY;
            } else {
                var targetEntity = Entry.container.getEntity(targetId);
                deltaX = targetEntity.getX() - spriteX;
                deltaY = targetEntity.getY() - spriteY;
            }

            if(deltaX === 0 && deltaY === 0) {
                value = sprite.getDirection() + sprite.getRotation();
            } else if ( deltaX >= 0 ) {
                value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
            } else {
                value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
            }
            var nativeDirection = sprite.getDirection() + sprite.getRotation();
            sprite.setRotation(sprite.getRotation() + value - nativeDirection);
            return script.callReturn();
        }
    },
    "see_angle_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "90" ]
                },
                null
            ],
            "type": "see_angle_direction"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            var nativeDirection = sprite.getDirection() + sprite.getRotation();
            sprite.setRotation(sprite.getRotation() + value - nativeDirection);
            return script.callReturn();
        }
    },
    "rotate_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "90" ]
                },
                null
            ],
            "type": "rotate_direction"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            sprite.setDirection(value + sprite.getDirection());
            return script.callReturn();
        }
    },
    "locate_object_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_MOVING
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                null,
                null
            ],
            "type": "locate_object_time"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "TARGET": 1
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue, xValue, yValue;
                var targetId = script.getField("TARGET", script);
                timeValue = script.getNumberValue("VALUE", script);
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
                    script.dX = xValue/script.frameCount;
                    script.dY = yValue/script.frameCount;
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
                        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
                    }
                    return script.callReturn();
                }
            }
            if (script.frameCount != 0) {
                sprite.setX(sprite.getX() + script.dX);
                sprite.setY(sprite.getY() + script.dY);
                script.frameCount--;
                if (sprite.brush && !sprite.brush.stop)
                    sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }
        }
    },
    "rotate_absolute": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "angle" },
                null
            ],
            "type": "rotate_absolute"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate_absolute",
        "isNotFor": [],
        "func": function (entity, script) {
            var value = script.getNumberValue("VALUE", script);
            entity.setRotation(value);
            return script.callReturn();
        }
    },
    "rotate_relative": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "angle" },
                null
            ],
            "type": "rotate_relative"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (entity, script) {
            var value = script.getNumberValue("VALUE", script);
            entity.setRotation(value + entity.getRotation());
            return script.callReturn();
        }
    },
    "direction_absolute": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "angle" },
                null
            ],
            "type": "direction_absolute"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate_absolute",
        "isNotFor": [],
        "func": function (entity, script) {
            var value = script.getNumberValue("VALUE", script);
            entity.setDirection(value);
            return script.callReturn();
        }
    },
    "direction_relative": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "angle" },
                null
            ],
            "type": "direction_relative"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (entity, script) {
            var value = script.getNumberValue("VALUE", script);
            entity.setDirection(value + entity.getDirection());
            return script.callReturn();
        }
    },
    "move_to_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                { "type": "angle" },
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "move_to_angle"
        },
        "paramsKeyMap": {
            "ANGLE": 0,
            "VALUE": 1
        },
        "class": "move_rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script);
            var angle = script.getNumberValue("ANGLE", script);
            sprite.setX(sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI));
            sprite.setY(sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI));
            if (sprite.brush && !sprite.brush.stop) {
                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
            }
            return script.callReturn();
        }
    },
    "rotate_by_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "2" ]
                },
                {
                    "type": "angle"
                },
                null
            ],
            "type": "rotate_by_time"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "ANGLE": 1
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("VALUE", script);
                var angleValue = script.getNumberValue("ANGLE", script);
                script.isStart = true;
                script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                script.dAngle = angleValue/script.frameCount;

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
        }
    },
    "direction_relative_duration": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "2" ]
                },
                { "type": "angle" },
                null
            ],
            "type": "direction_relative_duration"
        },
        "paramsKeyMap": {
            "DURATION": 0,
            "AMOUNT": 1
        },
        "class": "rotate",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("DURATION", script);
                var directionValue = script.getNumberValue("AMOUNT", script);
                script.isStart = true;
                script.frameCount = Math.max(Math.floor(timeValue * Entry.FPS), 1);
                script.dDirection = directionValue/script.frameCount;

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
        }
    },
    "neobot_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "fontColor": "#fff",
        "statements": [],
        "template": "%1  값",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["1번 포트", "IN1"],
                ["2번 포트", "IN2"],
                ["3번 포트", "IN3"],
                ["리모컨", "IR"],
                ["배터리", "BAT"]
            ],
            "value": "IN1",
            "fontSize": 11
        }],
        "events": {},
        "def": {
            "params": [null],
            "type": "neobot_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "neobot_value",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var port = script.getStringField('PORT');
            return Entry.hw.portData[port];
        }
    },
    "neobot_sensor_convert_scale": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "fontColor": "#fff",
        "statements": [],
        "template": "%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 변환",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["1번 포트", "IN1"],
                ["2번 포트", "IN2"],
                ["3번 포트", "IN3"],
                ["리모컨", "IR"],
                ["배터리", "BAT"]
            ],
            "value": "IN1",
            "fontSize": 11
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Block",
            "accept": "string"
        }],
        "events": {},
        "def": {
            "params": [null, {
                "type": "number",
                "params": [ "0" ]
            }, {
                "type": "number",
                "params": [ "255" ]
            }, {
                "type": "number",
                "params": [ "0" ]
            }, {
                "type": "number",
                "params": [ "100" ]
            }],
            "type": "neobot_sensor_convert_scale"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "OMIN": 1,
            "OMAX": 2,
            "MIN": 3,
            "MAX": 4
        },
        "class": "neobot_value",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var port = script.getStringField('PORT');
            var value = Entry.hw.portData[port];
            var omin = script.getNumberValue("OMIN", script);
            var omax = script.getNumberValue("OMAX", script);
            var min = script.getNumberValue("MIN", script);
            var max = script.getNumberValue("MAX", script);

            if (omin > omax) {
                var temp = omin;
                omin = omax;
                omax = temp;
            }

            if(min > max) {
                var temp = min;
                min = max;
                max = temp;
            }

            value -= omin;
            value = value * ((max - min) / (omax - omin));
            value += min;
            value = Math.min(max, value);
            value = Math.max(min, value);

            return Math.round(value);
        }
    },
    "neobot_left_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 모터를 %1 %2 의 속도로 회전 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["앞으로", "16"],
                ["뒤로", "32"]
            ],
            "value": "16",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["0", "0"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"],
                ["10", "10"],
                ["11", "11"],
                ["12", "12"],
                ["13", "13"],
                ["14", "14"],
                ["15", "15"]
            ],
            "value": "0",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, "15", null],
            "type": "neobot_left_motor"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "SPEED": 1
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var speed = script.getNumberField('SPEED');
            var direction = script.getNumberField('DIRECTION');
            Entry.hw.sendQueue['DCL'] = speed + direction;
            return script.callReturn();
        }
    },
    "neobot_stop_left_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 모터를 정지 %1",
        "params": [{
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null],
            "type": "neobot_stop_left_motor"
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            Entry.hw.sendQueue['DCL'] = 0;
            return script.callReturn();
        }
    },
    "neobot_right_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "오른쪽 모터를 %1 %2 의 속도로 회전 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["앞으로", "16"],
                ["뒤로", "32"]
            ],
            "value": "16",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["0", "0"],
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"],
                ["10", "10"],
                ["11", "11"],
                ["12", "12"],
                ["13", "13"],
                ["14", "14"],
                ["15", "15"]
            ],
            "value": "0",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, "15", null],
            "type": "neobot_right_motor"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "SPEED": 1
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var speed = script.getNumberField('SPEED');
            var direction = script.getNumberField('DIRECTION');
            Entry.hw.sendQueue['DCR'] = speed + direction;
            return script.callReturn();
        }
    },
    "neobot_stop_right_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "오른쪽 모터를 정지 %1",
        "params": [{
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null],
            "type": "neobot_stop_right_motor"
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            Entry.hw.sendQueue['DCR'] = 0;
            return script.callReturn();
        }
    },
    "neobot_all_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "양쪽 모터를 %1 %2의 속도로 %3초 동안 회전 %4",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "앞으로", "1" ],
                    [ "뒤로", "2" ],
                    [ "제자리에서 왼쪽 돌기", "3" ],
                    [ "제자리에서 오른쪽 돌기", "4" ],
                    [ "왼쪽으로 돌기", "5" ],
                    [ "오른쪽으로 돌기", "6" ]
                ],
                "value": "1",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "0" ],
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ],
                    [ "8", "8" ],
                    [ "9", "9" ],
                    [ "10", "10" ],
                    [ "11", "11" ],
                    [ "12", "12" ],
                    [ "13", "13" ],
                    [ "14", "14" ],
                    [ "15", "15" ]
                ],
                "value": "1",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": ["1", "15", {
                "type": "number",
                "params": ["0"]
            }],
            "type": "neobot_all_motor"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "SPEED": 1,
            "DURATION": 2
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;

            if (!script.isStart) {
                var speed = script.getNumberField('SPEED');
                var direction = script.getNumberField('DIRECTION');
                var duration = script.getNumberValue('DURATION');

                if(duration < 0) {
                    duration = 0;
                }

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

                if(duration === 0) {
                    return script.callReturn();
                } else {
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                }
            } else if (script.timeFlag == 1) {
                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.hw.sendQueue['DCL'] = 0;
                Entry.hw.sendQueue['DCR'] = 0;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }
    },
    "neobot_stop_all_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "양쪽 모터를 정지 %1",
        "params": [{
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null],
            "type": "neobot_stop_all_motor",
        },
        "class": "neobot_motor",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            Entry.hw.sendQueue['DCL'] = 0;
            Entry.hw.sendQueue['DCR'] = 0;
            return script.callReturn();
        }
    },
    "neobot_set_servo": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 포트의 서보모터를 %2 도 이동 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["OUT1", "1"],
                ["OUT2", "2"],
                ["OUT3", "3"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, null, null],
            "type": "neobot_set_servo"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "DEGREE": 1
        },
        "class": "neobot_output",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var port = script.getNumberField('PORT');
            var degree = script.getNumberValue('DEGREE');
            if(degree < 0) {
                degree = 0;
            } else if(degree > 180){
                degree = 180;
            }
            Entry.hw.sendQueue['OUT' + port] = degree;
            var option = port;
            if(option === 3) {
                option = 4;
            }
            Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | option;
            return script.callReturn();
        }
    },
    "neobot_set_output": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 번 포트의 값을 %2 만큼 출력 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["OUT1", "1"],
                ["OUT2", "2"],
                ["OUT3", "3"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, {
                "type": "number",
                "params": ["255"]
            }, null],
            "type": "neobot_set_output",
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "neobot_output",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
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
        }
    },
    "neobot_set_fnd": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "FND에 %1 출력 %2",
        "params": [{
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [ {
                "type": "number",
                "params": [ "0" ]
            }, null],
            "type": "neobot_set_fnd"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "neobot_output",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var value = script.getNumberValue('VALUE', script);
            if(value > 99) {
                value = 99;
            }
            Entry.hw.sendQueue['FND'] = parseInt('0x' + value);
            Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | 8;
            return script.callReturn();
        }
    },
    "neobot_set_fnd_off": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "FND 출력 끄기 %1",
        "params": [{
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null],
            "type": "neobot_set_fnd_off"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "neobot_output",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            Entry.hw.sendQueue['FND'] = parseInt('0x00');
            Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & (~8);
            return script.callReturn();
        }
    },
    "neobot_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["무음", "0"],
                ["도", "1"],
                ["도#", "2"],
                ["레", "3"],
                ["레#", "4"],
                ["미", "5"],
                ["파", "6"],
                ["파#", "7"],
                ["솔", "8"],
                ["솔#", "9"],
                ["라", "10"],
                ["라#", "11"],
                ["시", "12"]
            ],
            "value": "0",
            "fontSize": 11
        }, {
            "type": "Dropdown",
            "options": [
                ["1", "0"],
                ["2", "1"],
                ["3", "2"],
                ["4", "3"],
                ["5", "4"],
                ["6", "5"]
            ],
            "value": "0",
            "fontSize": 11
        }, {
            "type": "Dropdown",
            "options": [
                ["2분음표", "2"],
                ["4분음표", "4"],
                ["8분음표", "8"],
                ["16분음표", "16"]
            ],
            "value": "2",
            "fontSize": 11
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": ["1", "2", "4", null],
            "type": "neobot_play_note_for"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "DURATION": 2
        },
        "class": "neobot_note",
        "isNotFor": ["neobot"],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;

            if (!script.isStart) {
                var note = script.getNumberField("NOTE", script);
                var octave = script.getNumberField("OCTAVE", script);
                var duration = script.getNumberField("DURATION", script);
                var value = (note > 0) ? note + (12 * octave) : 0;

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

        }
    },
    "robotis_openCM70_cm_custom_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "BYTE", "BYTE" ],
                    [ "WORD", "WORD" ],
                    [ "DWORD", "DWORD" ]
                ],
                "value": "BYTE",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "robotis_openCM70_cm_custom_value"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SIZE": 1
        },
        "class": "robotis_openCM70_custom",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
              // instruction / address / length / value / default length
            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            var data_default_address = 0;
            var data_default_length = 0;

            var size = script.getStringField("SIZE");

            if (size == 'BYTE') {
                data_length = 1;
            } else if (size == 'WORD') {
                data_length = 2;
            } else if (size == 'DWORD') {
                data_length = 4;
            }

            data_address = script.getNumberValue('VALUE');

            data_default_address = data_address;
            data_default_length = data_length;

            Entry.Robotis_carCont.setRobotisData([[data_instruction, data_address, data_length, data_value, data_default_length]]);
            // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
            Entry.Robotis_carCont.update();

            return Entry.hw.portData[data_default_address];
        }
    },
    "robotis_openCM70_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.robotis_cm_sound_detected, "CM_SOUND_DETECTED" ],
                    [ Lang.Blocks.robotis_cm_sound_detecting, "CM_SOUND_DETECTING" ],
                    [ Lang.Blocks.robotis_cm_user_button, "CM_USER_BUTTON" ]
                ],
                "value": "CM_SOUND_DETECTED",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "robotis_openCM70_sensor_value"
        },
        "paramsKeyMap": {
            "SENSOR": 0
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            var data_default_address = 0;
            var data_default_length = 0;

            var sensor = script.getStringField("SENSOR");

            var increase = 0;

            if (sensor == 'CM_SOUND_DETECTED') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            } else if (sensor == 'CM_SOUND_DETECTING') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1];
            } else if (sensor == 'CM_USER_BUTTON') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1];
            }

            data_default_address = data_default_address + increase * data_default_length;

            Entry.Robotis_carCont.setRobotisData([[data_instruction, data_address, data_length, data_value, data_default_length]]);
            // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
            Entry.Robotis_carCont.update();

            return Entry.hw.portData[data_default_address];
        }
    },
    "robotis_openCM70_aux_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "3", "PORT_3" ],
                    [ "4", "PORT_4" ],
                    [ "5", "PORT_5" ],
                    [ "6", "PORT_6" ]
                ],
                "value": "PORT_3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.robotis_aux_servo_position, "AUX_SERVO_POSITION" ],
                    [ Lang.Blocks.robotis_aux_ir, "AUX_IR" ],
                    [ Lang.Blocks.robotis_aux_touch, "AUX_TOUCH" ],
                    [ Lang.Blocks.robotis_aux_brightness, "AUX_BRIGHTNESS" ],
                    [ Lang.Blocks.robotis_aux_hydro_themo_humidity, "AUX_HYDRO_THEMO_HUMIDITY" ],
                    [ Lang.Blocks.robotis_aux_hydro_themo_temper, "AUX_HYDRO_THEMO_TEMPER" ],
                    [ Lang.Blocks.robotis_aux_temperature, "AUX_TEMPERATURE" ],
                    [ Lang.Blocks.robotis_aux_ultrasonic, "AUX_ULTRASONIC" ],
                    [ Lang.Blocks.robotis_aux_magnetic, "AUX_MAGNETIC" ],
                    [ Lang.Blocks.robotis_aux_motion_detection, "AUX_MOTION_DETECTION" ],
                    [ Lang.Blocks.robotis_aux_color, "AUX_COLOR" ],
                    [ Lang.Blocks.robotis_aux_custom, "AUX_CUSTOM" ]
                ],
                "value": "AUX_SERVO_POSITION",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "robotis_openCM70_aux_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "SENSOR": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.READ;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            var data_default_address = 0;
            var data_default_length = 0;

            var port = script.getStringField("PORT");
            var sensor = script.getStringField("SENSOR");

            var increase = 0;
            if (port == 'PORT_3') {
                increase = 2;
            } else if (port == 'PORT_4') {
                increase = 3;
            } else if (port == 'PORT_5') {
                increase = 4;
            } else if (port == 'PORT_6') {
                increase = 5;
            }

            if (sensor == 'AUX_SERVO_POSITION') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
            } else if (sensor == 'AUX_IR') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1];
            } else if (sensor == 'AUX_TOUCH') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1];
            } else if (sensor == 'AUX_TEMPERATURE') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1];
            } else if (sensor == 'AUX_BRIGHTNESS') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1];
            } else if (sensor == 'AUX_HYDRO_THEMO_HUMIDITY') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1];
            } else if (sensor == 'AUX_HYDRO_THEMO_TEMPER') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1];
            } else if (sensor == 'AUX_ULTRASONIC') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1];
            } else if (sensor == 'AUX_MAGNETIC') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1];
            } else if (sensor == 'AUX_MOTION_DETECTION') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1];
            } else if (sensor == 'AUX_COLOR') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1];
            } else if (sensor == 'AUX_CUSTOM') {
                data_default_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                data_default_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
            }

            data_default_address = data_default_address + increase * data_default_length;
            if (increase != 0) {
                data_length = 6 * data_default_length;
            }

            Entry.Robotis_carCont.setRobotisData([[data_instruction, data_address, data_length, data_value, data_default_length]]);
            // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
            Entry.Robotis_carCont.update();

            return Entry.hw.portData[data_default_address];
        }
    },
    "robotis_openCM70_cm_buzzer_index": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.note_a + '(0)',"0"],
                    [Lang.General.note_a + '#(1)',"1"],
                    [Lang.General.note_b + '(2)',"2"],
                    [Lang.General.note_c + '(3)',"3"],
                    [Lang.General.note_c + '#(4)',"4"],
                    [Lang.General.note_d + '(5)',"5"],
                    [Lang.General.note_d + '#(6)',"6"],
                    [Lang.General.note_e + '(7)',"7"],
                    [Lang.General.note_f + '(8)',"8"],
                    [Lang.General.note_f + '#(9)',"9"],
                    [Lang.General.note_g + '(10)',"10"],
                    [Lang.General.note_g + '#(11)',"11"],
                    [Lang.General.note_a + '(12)',"12"],
                    [Lang.General.note_a + '#(13)',"13"],
                    [Lang.General.note_b + '(14)',"14"],
                    [Lang.General.note_c + '(15)',"15"],
                    [Lang.General.note_c + '#(16)',"16"],
                    [Lang.General.note_d + '(17)',"17"],
                    [Lang.General.note_d + '#(18)',"18"],
                    [Lang.General.note_e + '(19)',"19"],
                    [Lang.General.note_f + '(20)',"20"],
                    [Lang.General.note_f + '#(21)',"21"],
                    [Lang.General.note_g + '(22)',"22"],
                    [Lang.General.note_g + '#(23)',"23"],
                    [Lang.General.note_a + '(24)',"24"],
                    [Lang.General.note_a + '#(25)',"25"],
                    [Lang.General.note_b + '(26)',"26"],
                    [Lang.General.note_c + '(27)',"27"],
                    [Lang.General.note_c + '#(28)',"28"],
                    [Lang.General.note_d + '(29)',"29"],
                    [Lang.General.note_d + '#(30)',"30"],
                    [Lang.General.note_e + '(31)',"31"],
                    [Lang.General.note_f + '(32)',"32"],
                    [Lang.General.note_f + '#(33)',"33"],
                    [Lang.General.note_g + '(34)',"34"],
                    [Lang.General.note_g + '#(35)',"35"],
                    [Lang.General.note_a + '(36)',"36"],
                    [Lang.General.note_a + '#(37)',"37"],
                    [Lang.General.note_b + '(38)',"38"],
                    [Lang.General.note_c + '(39)',"39"],
                    [Lang.General.note_c + '#(40)',"40"],
                    [Lang.General.note_d + '(41)',"41"],
                    [Lang.General.note_d + '#(42)',"42"],
                    [Lang.General.note_e + '(43)',"43"],
                    [Lang.General.note_f + '(44)',"44"],
                    [Lang.General.note_f + '#(45)',"45"],
                    [Lang.General.note_g + '(46)',"46"],
                    [Lang.General.note_g + '#(47)',"47"],
                    [Lang.General.note_a + '(48)',"48"],
                    [Lang.General.note_a + '#(49)',"49"],
                    [Lang.General.note_b + '(50)',"50"],
                    [Lang.General.note_c + '(51)',"51"]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "robotis_openCM70_cm_buzzer_index"
        },
        "paramsKeyMap": {
            "CM_BUZZER_INDEX": 0,
            "CM_BUZZER_TIME": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var cmBuzzerIndex = script.getField("CM_BUZZER_INDEX", script);
            var cmBuzzerTime = script.getNumberValue("CM_BUZZER_TIME", script);

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address_1 = 0;
            var data_length_1 = 0;
            var data_value_1 = 0;
            var data_address_2 = 0;
            var data_length_2 = 0;
            var data_value_2 = 0;

            data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
            data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
            // data_value_1 = cmBuzzerTime * 10;
            // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
            data_value_1 = parseInt(cmBuzzerTime * 10);
            if (data_value_1 > 50) {
                data_value_1 = 50;
            }

            data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
            data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
            data_value_2 = cmBuzzerIndex;

            var data_sendqueue = [[data_instruction, data_address_1, data_length_1, data_value_1], [data_instruction, data_address_2, data_length_2, data_value_2]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, cmBuzzerTime * 1000);
        }
    },
    "robotis_openCM70_cm_buzzer_melody": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "0" ],
                    [ "1", "1" ],
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ],
                    [ "8", "8" ],
                    [ "9", "9" ],
                    [ "10", "10" ],
                    [ "11", "11" ],
                    [ "12", "12" ],
                    [ "13", "13" ],
                    [ "14", "14" ],
                    [ "15", "15" ],
                    [ "16", "16" ],
                    [ "17", "17" ],
                    [ "18", "18" ],
                    [ "19", "19" ],
                    [ "20", "20" ],
                    [ "21", "21" ],
                    [ "22", "22" ],
                    [ "23", "23" ],
                    [ "24", "24" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "robotis_openCM70_cm_buzzer_melody"
        },
        "paramsKeyMap": {
            "CM_BUZZER_MELODY": 0
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var cmBuzzerMelody = script.getField("CM_BUZZER_MELODY", script);

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address_1 = 0;
            var data_length_1 = 0;
            var data_value_1 = 0;
            var data_address_2 = 0;
            var data_length_2 = 0;
            var data_value_2 = 0;

            data_address_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0];
            data_length_1 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1];
            data_value_1 = 255;

            data_address_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
            data_length_2 = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
            data_value_2 = cmBuzzerMelody;

            var data_sendqueue = [[data_instruction, data_address_1, data_length_1, data_value_1], [data_instruction, data_address_2, data_length_2, data_value_2]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, 1000);
        }
    },
    "robotis_openCM70_cm_sound_detected_clear": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "robotis_openCM70_cm_sound_detected_clear"
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            data_value = 0;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_cm_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_red_color,"CM_LED_R"],
                    [Lang.Blocks.robotis_common_green_color,"CM_LED_G"],
                    [Lang.Blocks.robotis_common_blue_color,"CM_LED_B"],
                ],
                "value": "CM_LED_R",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_on,"1"],
                    [Lang.Blocks.robotis_common_off,"0"]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "robotis_openCM70_cm_led"
        },
        "paramsKeyMap": {
            "CM_LED": 0,
            "VALUE": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var cmLed = script.getField("CM_LED", script);
            var value = script.getField("VALUE", script);

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            if (cmLed == 'CM_LED_R') {
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[1];
            } else if (cmLed == 'CM_LED_G') {
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[1];
            } else if (cmLed == 'CM_LED_B') {
                data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[0];
                data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[1];
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_cm_motion": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "robotis_openCM70_cm_motion"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[1];
            data_value = script.getNumberValue("VALUE", script);

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_motor_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_1,"1"],
                    [Lang.Blocks.robotis_common_port_2,"2"]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_clockwhise,"CW"],
                    [Lang.Blocks.robotis_common_counter_clockwhise,"CCW"]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                null,
                {
                    "type": "number",
                    "params": [ "500" ]
                },
                null
            ],
            "type": "robotis_openCM70_aux_motor_speed"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "DIRECTION_ANGLE": 1,
            "VALUE": 2
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var directionAngle = script.getField("DIRECTION_ANGLE", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];

            data_address = data_address + (port - 1) * data_length;

            if (directionAngle == 'CW') {
                value = value + 1024;
                if (value > 2047) {
                    value = 2047;
                }
            } else {
                if (value > 1023) {
                    value = 1023;
                }
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_servo_mode": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_3,"3"],
                    [Lang.Blocks.robotis_common_port_4,"4"],
                    [Lang.Blocks.robotis_common_port_5,"5"],
                    [Lang.Blocks.robotis_common_port_6,"6"]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_wheel_mode,"0"],
                    [Lang.Blocks.robotis_common_joint_mode,"1"]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "robotis_openCM70_aux_servo_mode"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "MODE": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var mode = script.getField("MODE", script);

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];

            data_address = data_address + (port - 1) * data_length;
            data_value = mode;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_servo_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_3,"3"],
                    [Lang.Blocks.robotis_common_port_4,"4"],
                    [Lang.Blocks.robotis_common_port_5,"5"],
                    [Lang.Blocks.robotis_common_port_6,"6"]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_clockwhise,"CW"],
                    [Lang.Blocks.robotis_common_counter_clockwhise,"CCW"]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                null,
                {
                    "type": "number",
                    "params": [ "500" ]
                },
                null
            ],
            "type": "robotis_openCM70_aux_servo_speed"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "DIRECTION_ANGLE": 1,
            "VALUE": 2
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var directionAngle = script.getField("DIRECTION_ANGLE", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];

            data_address = data_address + (port - 1) * data_length;

            if (directionAngle == 'CW') {
                value = value + 1024;
                if (value > 2047) {
                    value = 2047;
                }
            } else {
                if (value > 1023) {
                    value = 1023;
                }
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_servo_position": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_3,"3"],
                    [Lang.Blocks.robotis_common_port_4,"4"],
                    [Lang.Blocks.robotis_common_port_5,"5"],
                    [Lang.Blocks.robotis_common_port_6,"6"]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "512" ]
                },
                null
            ],
            "type": "robotis_openCM70_aux_servo_position"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];

            data_address = data_address + (port - 1) * data_length;

            if (value > 1023) {
                value = 1023;
            } else if (value < 0) {
                value = 0;
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_led_module": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_3,"3"],
                    [Lang.Blocks.robotis_common_port_4,"4"],
                    [Lang.Blocks.robotis_common_port_5,"5"],
                    [Lang.Blocks.robotis_common_port_6,"6"]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_cm_led_both + Lang.Blocks.robotis_common_off,"0"],
                    [Lang.Blocks.robotis_cm_led_right + Lang.Blocks.robotis_common_on,"1"],
                    [Lang.Blocks.robotis_cm_led_left + Lang.Blocks.robotis_common_on,"2"],
                    [Lang.Blocks.robotis_cm_led_both + Lang.Blocks.robotis_common_on,"3"]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "robotis_openCM70_aux_led_module"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "LED_MODULE": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var ledModule = script.getField("LED_MODULE", script);

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];

            data_address = data_address + (port - 1) * data_length;
            data_value = ledModule;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_aux_custom": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_port_3,"3"],
                    [Lang.Blocks.robotis_common_port_4,"4"],
                    [Lang.Blocks.robotis_common_port_5,"5"],
                    [Lang.Blocks.robotis_common_port_6,"6"]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "robotis_openCM70_aux_custom"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "robotis_openCM70_cm",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var port = script.getField("PORT", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0];
            data_length = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];

            data_address = data_address + (port - 1) * data_length;
            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_cm_custom": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "robotis_openCM70_cm_custom"
        },
        "paramsKeyMap": {
            "ADDRESS": 0,
            "VALUE": 1
        },
        "class": "robotis_openCM70_custom",
        "isNotFor": [ "robotis_openCM70" ],
        "func": function (sprite, script) {
              // instruction / address / length / value / default length
            var data_instruction = Entry.Robotis_openCM70.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

              data_address = script.getNumberValue('ADDRESS');
            data_value = script.getNumberValue('VALUE');
            if (data_value > 65535) {
                data_length = 4;
            } else if (data_value > 255) {
                data_length = 2;
            } else {
                data_length = 1;
            }

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_carCont_sensor_value": {
        "color": "#00979D",
        "fontColor": "#fff",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_cm_spring_left,"CM_SPRING_LEFT"],
                    [Lang.Blocks.robotis_cm_spring_right,"CM_SPRING_RIGHT"],
                    [Lang.Blocks.robotis_cm_switch,"CM_SWITCH"],
                    [Lang.Blocks.robotis_cm_sound_detected,"CM_SOUND_DETECTED"],
                    [Lang.Blocks.robotis_cm_sound_detecting,"CM_SOUND_DETECTING"],
                    [Lang.Blocks.robotis_cm_ir_left,"CM_IR_LEFT"],
                    [Lang.Blocks.robotis_cm_ir_right,"CM_IR_RIGHT"],
                    [Lang.Blocks.robotis_cm_calibration_left,"CM_CALIBRATION_LEFT"],
                    [Lang.Blocks.robotis_cm_calibration_right,"CM_CALIBRATION_RIGHT"],
                ],
                "value": "CM_SPRING_LEFT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "robotis_carCont_sensor_value"
        },
        "paramsKeyMap": {
            "SENSOR": 0
        },
        "class": "robotis_carCont_cm",
        "isNotFor": [ "robotis_carCont" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var data_instruction = Entry.Robotis_carCont.INSTRUCTION.READ;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            var data_default_address = 0;
            var data_default_length = 0;

              var sensor = script.getStringField("SENSOR");

              if (sensor == 'CM_SPRING_LEFT') {
                  data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[1];
                  data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[2];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[3];
              } else if (sensor == 'CM_SPRING_RIGHT') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[2];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[3];
              } else if (sensor == 'CM_SWITCH') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1];
              } else if (sensor == 'CM_SOUND_DETECTED') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
              } else if (sensor == 'CM_SOUND_DETECTING') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1];
              } else if (sensor == 'CM_IR_LEFT') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[2];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[3];
              } else if (sensor == 'CM_IR_RIGHT') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[2];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[3];
              } else if (sensor == 'CM_CALIBRATION_LEFT') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
              } else if (sensor == 'CM_CALIBRATION_RIGHT') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
              } else if (sensor == 'CM_BUTTON_STATUS') {
                data_default_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                data_default_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1];
              }

            Entry.Robotis_carCont.setRobotisData([[data_instruction, data_address, data_length, data_value, data_default_length]]);
            // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
            Entry.Robotis_carCont.update();

            return Entry.hw.portData[data_default_address];
        }
    },
    "robotis_carCont_cm_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_on,"1"],
                    [Lang.Blocks.robotis_common_off,"0"]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_on,"1"],
                    [Lang.Blocks.robotis_common_off,"0"]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "robotis_carCont_cm_led"
        },
        "paramsKeyMap": {
            "VALUE_LEFT": 0,
            "VALUE_RIGHT": 1
        },
        "class": "robotis_carCont_cm",
        "isNotFor": [ "robotis_carCont" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var value_left = script.getField("VALUE_LEFT", script);
            var value_right = script.getField("VALUE_RIGHT", script);

            var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[0];
            data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[1];

            if (value_left == 1 && value_right == 1) {
                data_value = 9;
            } else if (value_left == 1 && value_right == 0) {
                data_value = 8;
            } if (value_left == 0 && value_right == 1) {
                data_value = 1;
            }

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_carCont.delay);
        }
    },
    "robotis_carCont_cm_sound_detected_clear": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "robotis_carCont_cm_sound_detected_clear"
        },
        "class": "robotis_carCont_cm",
        "isNotFor": [ "robotis_carCont" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length

            var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0];
            data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            data_value = 0;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_carCont.delay);
        }
    },
    "robotis_carCont_aux_motor_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.robotis_common_clockwhise,"CW"],
                    [Lang.Blocks.robotis_common_counter_clockwhise,"CCW"]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                null,
                {
                    "type": "number",
                    "params": [ "500" ]
                },
                null
            ],
            "type": "robotis_carCont_aux_motor_speed"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "DIRECTION_ANGLE": 1,
            "VALUE": 2
        },
        "class": "robotis_carCont_cm",
        "isNotFor": [ "robotis_carCont" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var direction = script.getField("DIRECTION", script);
            var directionAngle = script.getField("DIRECTION_ANGLE", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            if (direction == 'LEFT') {
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[1];
            } else {
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[1];
            }

            if (directionAngle == 'CW') {
                value = value + 1024;
                if (value > 2047) {
                    value = 2047;
                }
            } else {
                if (value > 1023) {
                    value = 1023;
                }
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_carCont.delay);
        }
    },
    "robotis_carCont_cm_calibration": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.General.left,"LEFT"],
                    [Lang.General.right,"RIGHT"]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "robotis_carCont_cm_calibration"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "robotis_carCont_cm",
        "isNotFor": [ "robotis_carCont" ],
        "func": function (sprite, script) {
            // instruction / address / length / value / default length
            var direction = script.getField("DIRECTION", script);
            var value = script.getNumberValue('VALUE');

            var data_instruction = Entry.Robotis_carCont.INSTRUCTION.WRITE;
            var data_address = 0;
            var data_length = 0;
            var data_value = 0;

            if (direction == 'LEFT') {
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1];
            } else {
                data_address = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0];
                data_length = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1];
            }

            data_value = value;

            var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
            return Entry.Robotis_carCont.postCallReturn(script, data_sendqueue, Entry.Robotis_carCont.delay);

            // Entry.hw.sendQueue['ROBOTIS_DATA'] = [[data_instruction, data_address, data_length, data_value]];
            // update();
            // return script.callReturn();
        }
    },
    "when_scene_start": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_scene_1_2.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "when_scene_start"
        },
        "class": "scene",
        "isNotFor": [ "scene" ],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "when_scene_start"
    },
    "start_scene": {
        "color": "#3BBD70",
        "skeleton": "basic_without_next",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "scenes",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_START
            },
            {
                "type": "Indicator",
                "img": "block_icon/start_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "start_scene"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scene",
        "isNotFor": [ "scene" ],
        "func": function (sprite, script) {
            var value = script.getField("VALUE", script);
            var scene = Entry.scene.getSceneById(value);
            if (scene) {
                Entry.scene.selectScene(scene);
                Entry.engine.fireEvent('when_scene_start');
            }
            return null;
        }
    },
    "start_neighbor_scene": {
        "color": "#3BBD70",
        "skeleton": "basic_without_next",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ Lang.Blocks.SCENE_start_scene_next, "next" ],
                    [ Lang.Blocks.SCENE_start_scene_pre, "pre" ]
                ],
                "value": "next",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_START
            },
            {
                "type": "Indicator",
                "img": "block_icon/start_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "start_neighbor_scene"
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "class": "scene",
        "isNotFor": [ "scene" ],
        "func": function (sprite, script) {
            var currentScene = Entry.scene.selectedScene;
            var scenes = Entry.scene.getScenes();
            var index = scenes.indexOf(currentScene);
            var o = script.getField("OPERATOR", script);
            if (o == 'next') {
                if (index + 1 < scenes.length) {
                    var nextScene = Entry.scene.getSceneById(scenes[index + 1].id);
                    if (nextScene) {
                        Entry.scene.selectScene(nextScene);
                        Entry.engine.fireEvent('when_scene_start');
                    }
                }
            } else {
                if (index > 0) {
                    var nextScene = Entry.scene.getSceneById(scenes[index - 1].id);
                    if (nextScene) {
                        Entry.scene.selectScene(nextScene);
                        Entry.engine.fireEvent('when_scene_start');
                    }
                }
            }
            return null;
        }
    },
    "sound_something": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "sound_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getField("VALUE", script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist)
                createjs.Sound.play(soundId);
            return script.callReturn();
        }
    },
    "sound_something_second": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "sound_something_second"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1
        },
        "class": "sound",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getField("VALUE", script);
            var timeValue = script.getNumberValue("SECOND", script);
            var sounds = sprite.parent.sounds;
            var isExist = Entry.isExist(soundId, 'id', sounds);
            if (isExist) {
                //var instance = createjs.Sound.play(soundId, {startTime: 0, duration: timeValue * 1000});
                var instance = createjs.Sound.play(soundId);
                setTimeout(function() {
                    instance.stop();
                }, timeValue * 1000);
            }
            return script.callReturn();
        }
    },
    "sound_something_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "sound_something_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField("VALUE", script);
                var sound = sprite.parent.getSound(soundId);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    setTimeout(function() {
                        script.playState = 0;
                    }, sound.duration * 1000)
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.playState;
                delete script.isPlay;
                return script.callReturn();
            }
        }
    },
    "sound_something_second_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "sound_something_second_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1
        },
        "class": "sound",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getField("VALUE", script);
                var sounds = sprite.parent.sounds;
                var isExist = Entry.isExist(soundId, 'id', sounds);
                if (isExist) {
                    var instance = createjs.Sound.play(soundId);
                    var timeValue = script.getNumberValue("SECOND", script);
                    setTimeout(function() {
                        instance.stop();
                        script.playState = 0;
                    }, timeValue * 1000)
                    instance.addEventListener('complete', function(e) {
                    });
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        }
    },
    "sound_volume_change": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "sound_volume_change"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound_volume",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script) / 100;
            value = value + createjs.Sound.getVolume();
            if (value>1)
                value = 1;
            if (value<0)
                value = 0;
            createjs.Sound.setVolume(value);
            return script.callReturn();
        }
    },
    "sound_volume_set": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "sound_volume_set"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound_volume",
        "isNotFor": [],
        "func": function (sprite, script) {
            var value = script.getNumberValue("VALUE", script) / 100;
            if (value>1)
                value = 1;
            if (value<0)
                value = 0;
            createjs.Sound.setVolume(value);
            return script.callReturn();
        }
    },
    "sound_silent_all": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "sound_silent_all"
        },
        "class": "sound_stop",
        "isNotFor": [],
        "func": function (sprite, script) {
            createjs.Sound.stop();
            return script.callReturn();
        }
    },
    "get_sounds": {
        "color": "#A4D01D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_SOUNDS
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "get_sounds"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": function (sprite, script) {
            return script.getStringField("VALUE");
        }
    },
    "sound_something_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds"
                },
                null
            ],
            "type": "sound_something_with_block"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound_play",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getStringValue("VALUE", script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) createjs.Sound.play(sound.id);
            //else
                //Entry.engine.stopProjectWithToast(
                    //this.block,
                    //'소리를 찾지 못했습니다.'
                //);

            return script.callReturn();
        }
    },
    "sound_something_second_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds",
                    "id": "95dw"
                },
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "sound_something_second_with_block"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1
        },
        "class": "sound_play",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getStringValue("VALUE", script);
            var timeValue = script.getNumberValue("SECOND", script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) {
                var instance = createjs.Sound.play(sound.id, {startTime: 0, duration: timeValue * 1000});
                /*
                   var instance = createjs.Sound.play(sound.id);
                   setTimeout(function() {
                   instance.stop();
                   }, timeValue * 1000);
                   */
            }
            return script.callReturn();
        }
    },
    "sound_something_wait_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds"
                },
                null
            ],
            "type": "sound_something_wait_with_block"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound_wait",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue("VALUE", script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var instance = createjs.Sound.play(sound.id);
                    setTimeout(function() {
                        script.playState = 0;
                    }, sound.duration * 1000)
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.playState;
                delete script.isPlay;
                return script.callReturn();
            }
        }
    },
    "sound_something_second_wait_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds"
                },
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "sound_something_second_wait_with_block"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1
        },
        "class": "sound_wait",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue("VALUE", script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var instance = createjs.Sound.play(sound.id);
                    var timeValue = script.getNumberValue("SECOND", script);
                    setTimeout(function() {
                        instance.stop();
                        script.playState = 0;
                    }, timeValue * 1000)
                    instance.addEventListener('complete', function(e) {
                    });
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        }
    },
    "sound_from_to": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds"
                },
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "sound_from_to"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "START": 1,
            "END": 2
        },
        "class": "sound_play",
        "isNotFor": [],
        "func": function (sprite, script) {
            var soundId = script.getStringValue("VALUE", script);
            var sound = sprite.parent.getSound(soundId);

            if (sound) {
                var start = script.getNumberValue("START", script)*1000;
                var end = script.getNumberValue("END", script)*1000;
                createjs.Sound.play(sound.id, {
                    startTime: Math.min(start, end),
                    duration: Math.max(start, end) - Math.min(start, end)
                });
            }
            return script.callReturn();
        }
    },
    "sound_from_to_and_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "get_sounds"
                },
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "sound_from_to_and_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "START": 1,
            "END": 2
        },
        "class": "sound_wait",
        "isNotFor": [],
        "func": function (sprite, script) {
            if (!script.isPlay) {
                script.isPlay = true;
                script.playState = 1;
                var soundId = script.getStringValue("VALUE", script);
                var sound = sprite.parent.getSound(soundId);
                if (sound) {
                    var start = script.getNumberValue("START", script)*1000;
                    var end = script.getNumberValue("END", script)*1000;
                    var startValue = Math.min(start, end);
                    var endValue = Math.max(start, end);
                    var duration = endValue - startValue;

                    createjs.Sound.play(sound.id, {
                        startTime: startValue,
                        duration: duration
                    });

                    setTimeout(function() {
                        script.playState = 0;
                    }, duration)
                }
                return script;
            } else if (script.playState == 1) {
                return script;
            } else {
                delete script.isPlay;
                delete script.playState;
                return script.callReturn();
            }
        }
    },
    "when_run_button_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_play.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "when_run_button_click"
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "start"
    },
    "press_some_key": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_keyboard.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "q", "81" ],
                    [ "w", "87" ],
                    [ "e", "69" ],
                    [ "r", "82" ],
                    [ "a", "65" ],
                    [ "s", "83" ],
                    [ "d", "68" ],
                    [ "위쪽 화살표", "38" ],
                    [ "아래쪽 화살표", "40" ],
                    [ "왼쪽 화살표", "37" ],
                    [ "오른쪽 화살표", "39" ],
                    [ "엔터", "13" ],
                    [ "스페이스", "32" ]
                ],
                "value": "81",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/start_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ]
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "func": function (sprite, script) {
            return script.callReturn();
        }
    },
    "when_some_key_pressed": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_keyboard.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            {
                "type": "Keyboard",
                "value": '81'
            }
        ],
        "events": {},
        "def": {
            "params": [ null, "81" ],
            "type": "when_some_key_pressed"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "keyPress"
    },
    "mouse_clicked": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_mouse.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "mouse_clicked"
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "mouse_clicked"
    },
    "mouse_click_cancled": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_mouse.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "mouse_click_cancled"
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "mouse_click_cancled"
    },
    "when_object_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_mouse.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "when_object_click"
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "when_object_click"
    },
    "when_object_click_canceled": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_mouse.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "when_object_click_canceled"
        },
        "class": "event",
        "isNotFor": [],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "when_object_click_canceled"
    },
    "when_some_key_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_keyboard.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "keyPress"
    },
    "when_message_cast": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "block_icon/start_icon_signal.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "messages",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_START
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                }
            ],
            "viewDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "when_message_cast"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "message",
        "isNotFor": [ "message" ],
        "func": function (sprite, script) {
            return script.callReturn();
        },
        "event": "when_message_cast"
    },
    "message_cast": {
        "color": "#3BBD70",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "messages",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_START
            },
            {
                "type": "Indicator",
                "img": "block_icon/start_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                }
            ],
            "viewDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "message_cast"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "message",
        "isNotFor": [ "message" ],
        "func": function (sprite, script) {
            var value = script.getField("VALUE", script);

            var arr = Entry.variableContainer.messages_;
            var isExist = Entry.isExist(value, 'id', arr);

            if (value == 'null' || !isExist)
                throw new Error('value can not be null or undefined');

            Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent,
                                                         ["when_message_cast", value]);
                                                         return script.callReturn();
        }
    },
    "message_cast_wait": {
        "color": "#3BBD70",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "messages",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_START
            },
            {
                "type": "Indicator",
                "img": "block_icon/start_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_messageRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_messageRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "message_cast_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "message",
        "isNotFor": [ "message" ],
        "func": function (sprite, script) {
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
                var value = script.getField("VALUE", script);
                var arr = Entry.variableContainer.messages_;
                var isExist = Entry.isExist(value, 'id', arr);
                if (value == 'null' || !isExist)
                    throw new Error('value can not be null or undefined');
                var data = Entry.container.mapEntityIncludeCloneOnScene(
                    Entry.engine.raiseKeyEvent,
                    ["when_message_cast", value]
                );
                var runningScript = [];
                while (data.length) {
                    var executor = data.shift();
                    if (executor)
                        runningScript = runningScript.concat(executor);
                }

                script.runningScript = runningScript;
                return script;
            }
        }
    },
    "text": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "TextInput",
                "value": 10
            }
        ],
        "events": {},
        "def": {
            "params": [],
            type: "text"
        },
        "paramsKeyMap": {
            "NAME": 0
        },
        "func": function (sprite, script) {
            return script.getField('NAME', script);
        },
        "isPrimitive": true
    },
    "text_write": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                }
            ],
            "type": "text_write"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "text",
        "isNotFor": [ "sprite" ],
        "func": function (sprite, script) {
            var text = script.getStringValue("VALUE", script);
            text = Entry.convertToRoundedDecimals(text, 3);
            sprite.setText(text);
            return script.callReturn();
        }
    },
    "text_append": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                }
            ],
            "type": "text_append"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "text",
        "isNotFor": [ "sprite" ],
        "func": function (sprite, script) {
            var text = script.getStringValue("VALUE", script);
            sprite.setText(Entry.convertToRoundedDecimals(sprite.getText(),3) +
                           Entry.convertToRoundedDecimals(text, 3));
                           return script.callReturn();
        }
    },
    "text_prepend": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.entry ]
                }
            ],
            "type": "text_prepend"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "text",
        "isNotFor": [ "sprite" ],
        "func": function (sprite, script) {
            var text = script.getStringValue("VALUE", script);
            sprite.setText(Entry.convertToRoundedDecimals(text, 3) +
                           Entry.convertToRoundedDecimals(sprite.getText(), 3));
                           return script.callReturn();
        }
    },
    "text_flush": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "text_flush"
        },
        "class": "text",
        "isNotFor": [ "sprite" ],
        "func": function (sprite, script) {
            sprite.setText('');
            return script.callReturn();
        }
    },
    "variableAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": Lang.Workspace.variable_create,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.variableContainer.openVariableAddPanel('variable');
                }
            ]
        }
    },
    "listAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": Lang.Workspace.create_list_block,
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                function() {
                    Entry.variableContainer.openVariableAddPanel('list');
                }
            ]
        }
    },
    "change_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0,
            "VALUE": 1
        },
        "class": "variable",
        "isNotFor": [ "variable", "variableNotExist" ],
        "func": function (sprite, script) {
            var variableId = script.getField("VARIABLE", script);
            var value = script.getNumberValue("VALUE", script);
            var fixed = 0;

            value = Entry.parseNumber(value);
            if ((value == false && typeof value == 'boolean'))
                throw new Error('Type is not correct');
            var variable = Entry.variableContainer.getVariable(variableId, sprite);
            fixed = Entry.getMaxFloatPoint([value, variable.getValue()]);
            variable.setValue((value + variable.getValue()).toFixed(fixed));
            return script.callReturn();
        }
    },
    "set_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "set_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0,
            "VALUE": 1
        },
        "class": "variable",
        "isNotFor": [ "variable", "variableNotExist" ],
        "func": function (sprite, script) {
            var variableId = script.getField("VARIABLE", script);
            var value = script.getValue("VALUE", script);
            var variable = Entry.variableContainer.getVariable(variableId, sprite);
            variable.setValue(value);
            return script.callReturn();
        }
    },
    "show_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "show_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable_visibility",
        "isNotFor": [ "variable", "variableNotExist" ],
        "func": function (sprite, script) {
            var variableId = script.getField("VARIABLE", script);
            var variable = Entry.variableContainer.getVariable(variableId, sprite);
            variable.setVisible(true);
            variable.updateView();
            return script.callReturn();
        }
    },
    "hide_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "hide_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable_visibility",
        "isNotFor": [ "variable", "variableNotExist" ],
        "func": function (sprite, script) {
            var variableId = script.getField("VARIABLE", script);
            var variable = Entry.variableContainer.getVariable(variableId, sprite);
            variable.setVisible(false);
            return script.callReturn();
        }
    },
    "get_variable": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_get_variable_1,
                "color": "white"
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null ],
            "type": "get_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable",
        "isNotFor": [ "variable", "variableNotExist" ],
        "func": function (sprite, script) {
            var variableId = script.getField("VARIABLE", script);
            var variable = Entry.variableContainer.getVariable(variableId, sprite);
            return variable.getValue();
        }
    },
    "ask_and_wait": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.container) Entry.container.showProjectAnswer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.container) Entry.container.hideProjectAnswer(block);
                }
            ]
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ Lang.Blocks.block_hi ]
                },
                null
            ],
            "type": "ask_and_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "ask",
        "isNotFor": [],
        "func": function (sprite, script) {
            var inputModel = Entry.container.inputValue,
                inputView = Entry.stage.inputField,
                    message = script.getValue("VALUE", script);

            if (!message)
                throw new Error('message can not be empty');

            if (inputModel.sprite == sprite &&
                inputView && !inputView._isHidden) {
                if (!sprite.dialog) {
                    message = Entry.convertToRoundedDecimals(message, 3);
                    new Entry.Dialog(sprite, message, 'speak');
                }
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
            }
        }
    },
    "get_canvas_input_value": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_get_canvas_input_value,
                "color": "#fff"
            }
        ],
        "events": {
            "viewAdd": [
                function() {
                    if (Entry.container) Entry.container.showProjectAnswer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.container) Entry.container.hideProjectAnswer(block);
                }
            ]
        },
        "def": {
            "params": [ null ],
            "type": "get_canvas_input_value"
        },
        "class": "ask",
        "isNotFor": [],
        "func": function (sprite, script) {
            return Entry.container.getInputValue();
        }
    },
    "add_value_to_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null,
                null
            ],
            "type": "add_value_to_list"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "LIST": 1
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var value = script.getValue("VALUE", script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (!list.array_)
                list.array_ = [];
            list.array_.push({'data' : value});
            list.updateView();
            return script.callReturn();
        }
    },
    "remove_value_from_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                {
                    "type": "number",
                    "params": [ "1" ]
                },
                null,
                null
            ],
            "type": "remove_value_from_list"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "LIST": 1
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var value = script.getValue("VALUE", script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (!list.array_ || isNaN(value) || value > list.array_.length)
                throw new Error('can not remove value from array');

            list.array_.splice(value-1,1);

            list.updateView();
            return script.callReturn();
        }
    },
    "insert_value_to_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                null
            ],
            "type": "insert_value_to_list"
        },
        "paramsKeyMap": {
            "DATA": 0,
            "LIST": 1,
            "INDEX": 2
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var data = script.getValue("DATA", script);
            var index = script.getValue("INDEX", script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (!list.array_ || isNaN(index) || index == 0 || index > list.array_.length +1)
                throw new Error('can not insert value to array');

            list.array_.splice(index-1, 0, {'data': data});
            list.updateView();
            return script.callReturn();
        }
    },
    "change_value_list_index": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "1" ]
                },
                {
                    "type": "text",
                    "params": [ "10" ]
                },
                null
            ],
            "type": "change_value_list_index"
        },
        "paramsKeyMap": {
            "LIST": 0,
            "INDEX": 1,
            "DATA": 2
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var data = script.getValue("DATA", script);
            var index = script.getValue("INDEX", script);
            var list = Entry.variableContainer.getList(listId, sprite);

            if (!list.array_ || isNaN(index) || index > list.array_.length)
                throw new Error('can not insert value to array');

            list.array_[index-1].data = data;
            list.updateView();
            return script.callReturn();
        }
    },
    "value_of_index_from_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_value_of_index_from_list_1,
                "color": "white"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_value_of_index_from_list_2,
                "color": "white"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_value_of_index_from_list_3,
                "color": "white"
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                null,
                null,
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                }
            ],
            "type": "value_of_index_from_list"
        },
        "paramsKeyMap": {
            "LIST": 1,
            "INDEX": 3
        },
        "class": "list_element",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var index = script.getValue("INDEX", script);
            var list = Entry.variableContainer.getList(listId, sprite);
            index = Entry.getListRealIndex(index, list);

            if (!list.array_ || isNaN(index) || index > list.array_.length)
                throw new Error('can not insert value to array');

            return list.array_[index-1].data
        }
    },
    "length_of_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_length_of_list_1,
                "color": "white"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_length_of_list_2,
                "color": "white"
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null, null ],
            "type": "length_of_list"
        },
        "paramsKeyMap": {
            "LIST": 1
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var list = Entry.variableContainer.getList(listId, sprite);

            return list.array_.length;
        }
    },
    "show_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "show_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list_visibility",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var list = Entry.variableContainer.getList(listId);

            list.setVisible(true);
            return script.callReturn();
        }
    },
    "hide_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [ null, null ],
            "type": "hide_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list_visibility",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var list = Entry.variableContainer.getList(listId);

            list.setVisible(false);
            return script.callReturn();
        }
    },
    "options_for_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "첫번째", "FIRST" ],
                    [ "마지막", "LAST" ],
                    [ "무작위", "RANDOM" ]
                ],
                "value": "FIRST",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ]
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "func": function (sprite, script) {
            return script.getField("OPERATOR", script);
        }
    },
    "set_visible_answer": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.CALC_timer_visible_show,"SHOW"],
                    [Lang.Blocks.CALC_timer_visible_hide,"HIDE"]
                ],
                "value": "SHOW",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Indicator",
                "img": "block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {
            "viewAdd": [
                function(block) {
                    if (Entry.container) Entry.container.showProjectAnswer();
                }
            ],
            "viewDestroy": [
                function(block) {
                    if (Entry.container) Entry.container.hideProjectAnswer(block);
                }
            ]
        },
        "def": {
            "params": [ "HIDE", null ],
            "type": "set_visible_answer"
        },
        "paramsKeyMap": {
            "BOOL": 0
        },
        "class": "ask",
        "isNotFor": [],
        "func": function (sprite, script) {
            var bool = script.getField("BOOL", script);
            if (bool == 'HIDE')
                Entry.container.inputValue.setVisible(false);
            else
                Entry.container.inputValue.setVisible(true);
            return script.callReturn();
        }
    },
    "is_included_in_list": {
        "color": "#E457DC",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_is_included_in_list_1,
                "color": "white"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_VARIABLE
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_is_included_in_list_2,
                "color": "white"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.VARIABLE_is_included_in_list_3,
                "color": "white"
            }
        ],
        "events": {
            "dataAdd": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.addRef('_variableRefs', block);
                }
            ],
            "dataDestroy": [
                function(block) {
                    var vc = Entry.variableContainer;
                    if (vc) vc.removeRef('_variableRefs', block);
                }
            ]
        },
        "def": {
            "params": [
                null, null, null,
                {
                    "type": "text",
                    "params": [ "10" ]
                }, null
            ],
            "type": "is_included_in_list"
        },
        "paramsKeyMap": {
            "LIST": 1,
            "DATA": 3
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var data = script.getStringValue("DATA", script);
            var list = Entry.variableContainer.getList(listId, sprite);
            if (!list)
                return false;
            var arr = list.array_;

            for (var i=0, len=arr.length; i<len; i++) {
                if (arr[i].data.toString() == data.toString())
                    return true;
            }
            return false;
        }
    },
    "xbot_digitalInput": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_D2_digitalInput, "D2"],
                    [Lang.Blocks.XBOT_D3_digitalInput, "D3"],
                    [Lang.Blocks.XBOT_D11_digitalInput, "D11"]
                ],
                "value": "D2",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "xbot_digitalInput"
        },
        "paramsKeyMap": {
            "DEVICE": 0
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData;
            var dev = script.getField('DEVICE');
            return pd[dev];
        }
    },
    "xbot_analogValue": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_CDS, "light"],
                    [Lang.Blocks.XBOT_MIC, "mic"],
                    [Lang.Blocks.XBOT_analog0, "adc0"],
                    [Lang.Blocks.XBOT_analog1, "adc1"],
                    [Lang.Blocks.XBOT_analog2, "adc2"],
                    [Lang.Blocks.XBOT_analog3, "adc3"],
                ],
                "value": "light",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "xbot_analogValue"
        },
        "paramsKeyMap": {
            "DEVICE": 0
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var pd = Entry.hw.portData;
            var dev = script.getField('DEVICE');
            return pd[dev];
        }
    },
    "xbot_digitalOutput": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "LED", "D13" ],
                    [ "D4", "D4" ],
                    [ "D7", "D7" ],
                    [ "D12 ", "D12" ]
                ],
                "value": "D13",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_High, "HIGH"],
                    [Lang.Blocks.XBOT_Low, "LOW"],
                ],
                "value": "HIGH",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "xbot_digitalOutput"
        },
        "paramsKeyMap": {
            "DEVICE": 0,
            "VALUE": 1
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var dev = script.getStringField("DEVICE", script);
            var value = script.getStringField('VALUE', script);

            if (dev == 'D13' && value == 'HIGH') {
                sq.D13 = 1;
            } else {
                sq.D13 = 0;
            }

            if (dev == 'D4' && value == 'HIGH') {
                sq.D4 = 1;
            } else {
                sq.D4 = 0;
            }

            if (dev == 'D7' && value == 'HIGH') {
                sq.D7 = 1;
            } else {
                sq.D7 = 0;
            }

            if (dev == 'D12' && value == 'HIGH') {
                sq.D12 = 1;
            } else {
                sq.D12 = 0;
            }
            //sq.D13 = 1;
            return script.callReturn();
        }
    },
    "xbot_analogOutput": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "D5", "analogD5" ],
                    [ "D6", "analogD6" ]
                ],
                "value": "analogD5",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "xbot_analogOutput"
        },
        "paramsKeyMap": {
            "DEVICE": 0,
            "VALUE": 1
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var dev = script.getStringField("DEVICE", script);
            var value = script.getNumberValue("VALUE", script);

            if (dev == 'analogD5') {
                sq.analogD5 = value;
            } else if(dev == 'analogD6') {
                sq.analogD6 = value;
            }
            return script.callReturn();
        }
    },
    "xbot_servo": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_Head,"head"],
                    [Lang.Blocks.XBOT_ArmR, "right"],
                    [Lang.Blocks.XBOT_ArmL, "left"]
                ],
                "value": "head",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "90" ]
                },
                null
            ],
            "type": "xbot_servo"
        },
        "paramsKeyMap": {
            "DEVICE": 0,
            "VALUE": 1
        },
        "class": "xbot_motor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var mtype = script.getStringField("DEVICE", script);
            var angle = script.getNumberValue("VALUE", script);

            if(mtype == 'head') {
                sq.head = angle;
            } else if(mtype == 'right') {
                sq.armR = angle;
            } else if(mtype == 'left') {
                sq.armL = angle;
            }

            return script.callReturn();
        }
    },
    "xbot_oneWheel": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_rightWheel,"rightWheel"],
                    [Lang.Blocks.XBOT_leftWheel, "leftWheel"],
                    [Lang.Blocks.XBOT_bothWheel, "bothWheel"]
                ],
                "value": "rightWheel",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "xbot_oneWheel"
        },
        "paramsKeyMap": {
            "DEVICE": 0,
            "VALUE": 1
        },
        "class": "xbot_motor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            //console.log('xbot_move_forward_for_secs');
            var sq = Entry.hw.sendQueue;
            var dir = script.getStringField("DEVICE", script);
            var speed =script.getNumberValue('VALUE', script);

            if (dir == 'rightWheel')
                sq.rightWheel = speed;
            else if (dir == 'leftWheel')
                sq.leftWheel = speed;
            else
                sq.rightWheel = sq.leftWheel = speed;

            return script.callReturn();
        }
    },
    "xbot_twoWheel": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "0" ]
                },
                {
                    "type": "text",
                    "params": [ "0" ]
                },
                null
            ],
            "type": "xbot_twoWheel"
        },
        "paramsKeyMap": {
            "rightWheel": 0,
            "leftWheel": 1
        },
        "class": "xbot_motor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            //console.log('xbot_move_forward_for_secs');
            var sq = Entry.hw.sendQueue;

            sq.rightWheel = script.getNumberValue('rightWheel');
            sq.leftWheel = script.getNumberValue('leftWheel');

            return script.callReturn();
        }
    },
    "xbot_rgb": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                {
                    "type": "text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "xbot_rgb"
        },
        "paramsKeyMap": {
            "ledR": 0,
            "ledG": 1,
            "ledB": 2
        },
        "class": "xbot_rgb",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;

            sq.ledR = script.getNumberValue('ledR');
            sq.ledG = script.getNumberValue('ledG');
            sq.ledB = script.getNumberValue('ledB');

            //console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB);
            return script.callReturn();
        }
    },
    "xbot_rgb_picker": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Color"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "xbot_rgb_picker"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "xbot_rgb",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var port = script.getStringField("VALUE");
            var sq = Entry.hw.sendQueue;

            sq.ledR = parseInt(parseInt(port.substr(1,2), 16) * 0.3);
            sq.ledG =  parseInt(parseInt(port.substr(3,2), 16) * 0.3);
            sq.ledB = parseInt(parseInt(port.substr(5,2), 16) * 0.3);

            return script.callReturn();
        }
    },
    "xbot_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Blocks.XBOT_c ,"C"],
                    [Lang.Blocks.XBOT_d ,"D"],
                    [Lang.Blocks.XBOT_e ,"E"],
                    [Lang.Blocks.XBOT_f ,"F"],
                    [Lang.Blocks.XBOT_g ,"G"],
                    [Lang.Blocks.XBOT_a ,"A"],
                    [Lang.Blocks.XBOT_b ,"B"]
                ],
                "value": "C",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "2", "2" ],
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ],
                    [ "7", "7" ]
                ],
                "value": "2",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                "4",
                {
                    "type": "text",
                    "params": [ "0.5" ]
                },
                null
            ],
            "type": "xbot_buzzer"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "VALUE": 2
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var note = script.getStringField("NOTE", script);
            var octave = script.getStringField("OCTAVE", script);
            var duration = script.getNumberValue("VALUE", script);


            var noteOctave = note + octave; // 'C'+ 2 = "C2"
            //console.log('xbot_buzzer noteOctave' + note + ' ' + octave + ' ' + duration);

            if(noteOctave == "C2") sq.note = 65;
            else if(noteOctave == "D2") sq.note = 73;
            else if(noteOctave == "E2") sq.note = 82;
            else if(noteOctave == "F2") sq.note = 87;
            else if(noteOctave == "G2") sq.note = 98;
            else if(noteOctave == "A2") sq.note = 110;
            else if(noteOctave == "B2") sq.note = 123;
            else if(noteOctave == "C3") sq.note = 131;
            else if(noteOctave == "D3") sq.note = 147;
            else if(noteOctave == "E3") sq.note = 165;
            else if(noteOctave == "F3") sq.note = 175;
            else if(noteOctave == "G3") sq.note = 196;
            else if(noteOctave == "A3") sq.note = 220;
            else if(noteOctave == "B3") sq.note = 247;
            else if(noteOctave == "C4") sq.note = 262;
            else if(noteOctave == "D4") sq.note = 294;
            else if(noteOctave == "E4") sq.note = 330;
            else if(noteOctave == "F4") sq.note = 349;
            else if(noteOctave == "G4") sq.note = 392;
            else if(noteOctave == "A4") sq.note = 440;
            else if(noteOctave == "B4") sq.note = 494;
            else if(noteOctave == "C5") sq.note = 523;
            else if(noteOctave == "D5") sq.note = 587;
            else if(noteOctave == "E5") sq.note = 659;
            else if(noteOctave == "F5") sq.note = 698;
            else if(noteOctave == "G5") sq.note = 784;
            else if(noteOctave == "A5") sq.note = 880;
            else if(noteOctave == "B5") sq.note = 988;
            else if(noteOctave == "C6") sq.note = 1047;
            else if(noteOctave == "D6") sq.note = 1175;
            else if(noteOctave == "E6") sq.note = 1319;
            else if(noteOctave == "F6") sq.note = 1397;
            else if(noteOctave == "G6") sq.note = 1568;
            else if(noteOctave == "A6") sq.note = 1760;
            else if(noteOctave == "B6") sq.note = 1976;
            else if(noteOctave == "C7") sq.note = 2093;
            else if(noteOctave == "D7") sq.note = 2349;
            else if(noteOctave == "E7") sq.note = 2637;
            else if(noteOctave == "F7") sq.note = 2794;
            else if(noteOctave == "G7") sq.note = 3136;
            else if(noteOctave == "A7") sq.note = 3520;
            else if(noteOctave == "B7") sq.note = 3951;
            else sq.note = 262;

            //sq.duration = 200;

            duration *= 40; //  convert to mSec
            sq.duration =  duration;

            return script.callReturn();
        }
    },
    "xbot_lcd": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "0", "0" ],
                    [ "1", "1" ]
                ],
                "value": "0",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "Hello" ]
                },
                null
            ],
            "type": "xbot_lcd"
        },
        "paramsKeyMap": {
            "LINE": 0,
            "VALUE": 1
        },
        "class": "xbot_sensor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;
            var line = script.getNumberField("LINE", script);
            var str =  script.getStringValue("VALUE", script);

            if (line == 0) {
                sq.lcdNum = 0;
                sq.lcdTxt = str;
            } else if (line == 1)
            {
                sq.lcdNum = 1;
                sq.lcdTxt = str;
            }
            //console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB);
            return script.callReturn();
        }
    },
    "run": {
        "skeleton": "basic",
        "color": "#3BBD70",
        "contents": [
            "this is",
            "basic block"
        ]
    },
    "mutant": {
        "skeleton": "basic",
        "event": "start",
        "color": "#3BBD70",
        "params": [],
        "changeEvent": {
            "_listeners": []
        }
    },
    "jr_start": {
        "skeleton": "pebble_event",
        "event": "start",
        "color": "#3BBD70",
        "params": [
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_play_image.png",
                "highlightColor": "#3BBD70",
                "position": {
                    "x": 0,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            var entities =
                Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT);

            for (var key in entities) this._unit = entities[key];

            Ntry.unitComp =
                Ntry.entityManager.getComponent(this._unit.id, Ntry.STATIC.UNIT);
        }
    },
    "jr_repeat": {
        "skeleton": "pebble_loop",
        "color": "#127CDB",
        "params": [
            {
                "type": "Text",
                "text": ""
            },
            {
                "type": "Dropdown",
                "options": [
                    [ 1, 1 ],
                    [ 2, 2 ],
                    [ 3, 3 ],
                    [ 4, 4 ],
                    [ 5, 5 ],
                    [ 6, 6 ],
                    [ 7, 7 ],
                    [ 8, 8 ],
                    [ 9, 9 ],
                    [ 10, 10 ]
                ],
                "value": 3,
                "fontSize": 14,
                "roundValue": 3
            },
            {
                "type": "Text",
                "text": "반복"
            }
        ],
        statements: [
            { accept: "pebble_basic" }
        ],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[1];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0)
                    return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        }
    },
    "jr_item": {
        "skeleton": "pebble_basic",
        "color": "#F46C6C",
        "params": [
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_item_image.png",
                "highlightColor": "#FFF",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent("getItem");
                    self.isAction = false;
                };
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM , callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "cparty_jr_item": {
        "skeleton": "pebble_basic",
        "color": "#8ABC1D",
        "params": [
            {
                "type": "Text",
                "text": "연필 줍기"
            },
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/cpartyjr/pen.png",
                "highlightColor": "#FFF",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    Ntry.dispatchEvent("getItem");
                    self.isAction = false;
                };
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.GET_ITEM , callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;

            }
        }
    },
    "jr_north": {
        "skeleton": "pebble_basic",
        "color": "#A751E3",
        "params": [
            {
                "type": "Text",
                "text": "  위쪽"
            },
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_up_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(
                        function() { Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, function() {
                            self.isAction = false;
                            }
                        );}, 3);
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
                    Ntry.dispatchEvent("unitAction", actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_east": {
        "skeleton": "pebble_basic",
        "color": "#A751E3",
        "params": [
            {
                "type": "Text",
                "text": "오른쪽"
            },
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_right_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            var STATIC = Ntry.STATIC;

             if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    window.setTimeout(
                        function() {
                            Ntry.dispatchEvent(
                                "unitAction",
                                STATIC.WALK,
                                function() { self.isAction = false; } );},
                        3);
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
                    Ntry.dispatchEvent("unitAction", actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_south": {
        "skeleton": "pebble_basic",
        "color": "#A751E3",
        "params": [
            {
                "type": "Text",
                "text": "  아래쪽"
            },
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_down_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
             if (!this.isContinue) {

                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(
                        function() {
                            Ntry.dispatchEvent(
                                "unitAction",
                                Ntry.STATIC.WALK,
                                function() { self.isAction = false; } );},
                    3);
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
                    Ntry.dispatchEvent("unitAction", actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_west": {
        "skeleton": "pebble_basic",
        "color": "#A751E3",
        "params": [
            {
                "type": "Text",
                "text": "  왼쪽"
            },
            {
                "type": "Indicator",
                "img": "../../../img/assets/ntry/bitmap/jr/block_left_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var STATIC = Ntry.STATIC;
                var self = this;
                var callBack = function() {
                    window.setTimeout(
                        function() { Ntry.dispatchEvent(
                            "unitAction",
                            STATIC.WALK,
                            function() { self.isAction = false; } );},
                    3);
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
                    Ntry.dispatchEvent("unitAction", actionType, callBack);
                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_start_basic": {
        "skeleton": "basic_event",
        "event": "start",
        "color": "#3BBD70",
        "params": [
            {
                "type": "Indicator",
                "boxMultiplier": 2,
                "img": "../../../img/assets/block_icon/start_icon_play.png",
                "highlightColor": "#3BBD70",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            {
                text: "시작하기를 클릭했을때",
                type: "Text"
            }
        ],
        func: function() {
            var entities = Ntry.entityManager.getEntitiesByComponent(
            Ntry.STATIC.UNIT);

            for (var key in entities)
                this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
            this._unit.id, Ntry.STATIC.UNIT);
        }
    },
    "jr_go_straight": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            {
                text: "앞으로 가기",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/cparty_go_straight.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_turn_left": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            {
                text: "왼쪽으로 돌기",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/cparty_rotate_l.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_turn_right": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            {
                text: "오른쪽으로 돌기",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_go_slow": {
        "skeleton": "basic",
        "color": "#f46c6c",
        "params": [
            {
                text: "천천히 가기",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/cparty_go_slow.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.GO_SLOW, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "jr_repeat_until_dest": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "syntax": [
            "BasicWhile",
            "true"
        ],
        "params": [
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/jr_goal_image.png",
                "size": 18
            },
            {
                text: "만날 때 까지 반복하기",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0)
                return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        }
    },
    "jr_if_construction": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "params": [
            {
                text: "만약",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/jr_construction_image.png",
                "size": 18
            },
            {
                text: "앞에 있다면",
                type: "Text"
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            if (this.isContinue)
                return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
            Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_REPAIR
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
        }
    },
    "jr_if_speed": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "params": [
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/jr/jr_speed_image.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function()  {
            if (this.isContinue)
                return;
            var entities = Ntry.entityManager.getEntitiesByComponent(
            Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_SLOW
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) return;
            else if(statement.getBlocks().length === 0) return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "maze_step_start": {
        "skeleton": "basic_event",
        "mode": "maze",
        "event": "start",
        "color": "#3BBD70",
        "syntax": [
            "Program"
        ],
        "params": [
            {
                "type": "Indicator",
                "boxMultiplier": 2,
                "img": "../../../img/assets/block_icon/start_icon_play.png",
                "highlightColor": "#3BBD70",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ],
        "func": function () {
            var entities = Ntry.entityManager.getEntitiesByComponent(
            Ntry.STATIC.UNIT);

            for (var key in entities)
                this._unit = entities[key];

            Ntry.unitComp = Ntry.entityManager.getComponent(
            this._unit.id, Ntry.STATIC.UNIT);
        }
    },
    "maze_step_jump": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#FF6E4B",
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/jump.png",
                "size": 24
            }
        ],
        "syntax": [ "Scope", "jump" ],
        func: function() {
            if (!this.isContinue) {
                this.isContinue = true;
                this.isAction = true;
                var self = this;
                var callBack = function() {
                    self.isAction = false;
                };

                Ntry.dispatchEvent("unitAction", Ntry.STATIC.JUMP, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "maze_step_for": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicIteration"
        ],
        "params": [
            {
                "type": "Dropdown",
                "key": "REPEAT",
                "options": [
                    [ 1, 1 ],
                    [ 2, 2 ],
                    [ 3, 3 ],
                    [ 4, 4 ],
                    [ 5, 5 ],
                    [ 6, 6 ],
                    [ 7, 7 ],
                    [ 8, 8 ],
                    [ 9, 9 ],
                    [ 10, 10 ]
                ],
                "value": 1
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            if (this.repeatCount === undefined) {
                this.repeatCount = this.block.params[0];
                return Entry.STATIC.BREAK;
            } else if (this.repeatCount > 0) {
                this.repeatCount--;
                var statement = this.block.statements[0];
                if (statement.getBlocks().length === 0)
                    return;
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            } else {
                delete this.repeatCount;
            }
        }
    },
    "test": {
        "skeleton": "basic_boolean_field",
        "mode": "maze",
        "color": "#127CDB",
        "params": [
            {
                "type": "Angle",
                "value": "90"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ 1, 1 ],
                    [ 2, 2 ],
                    [ 3, 3 ],
                    [ 4, 4 ],
                    [ 5, 5 ],
                    [ 6, 6 ],
                    [ 7, 7 ],
                    [ 8, 8 ],
                    [ 9, 9 ],
                    [ 10, 10 ]
                ],
                "value": 1
            }
        ]
    },
    "maze_repeat_until_1": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicWhile",
            "true"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/block_inner/repeat_goal_1.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0)
                return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        }
    },
    "maze_repeat_until_2": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicWhile",
            "true"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/block_inner/repeat_goal_1.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0)
                return;

            this.executor.stepInto(statement);
            return Entry.STATIC.BREAK;
        }
    },
    "maze_step_if_1": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicIf",
            "front == wall"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/block_inner/if_target_1.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/if.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            if (this.isContinue)
                return;
            var entities =
                Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var existEntities = Ntry.entityManager.find(
            {
                type: Ntry.STATIC.GRID,
                x: grid.x,
                y: grid.y
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
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL
                }
            );

            this.isContinue = true;

            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0)
                return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "maze_step_if_2": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicIf",
            "front == bee"
        ],
        "params": [
            {
                "type": "Image",
                "img": "../../../img/assets/ntry/bitmap/maze2/obstacle_01.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/if.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            if (this.isContinue) return;

            var entities =
                Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BEE
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0)
                return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "maze_call_function": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#B57242",
        "syntax": [
            "Scope",
            "promise"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/function.png",
                "size": 24
            }
        ],
        func: function() {
            if (!this.funcExecutor) {
                var codes =
                    Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.CODE);

                for (var key in codes) {
                    var code = codes[key].components[Ntry.STATIC.CODE].code;
                    this.funcExecutor = new Entry.Executor(
                        code.getEventMap("define")[0]
                    );
                }
            }

            this.funcExecutor.execute();
            if (this.funcExecutor.scope.block === null)
                return;
            else
                return Entry.STATIC.BREAK;
        }
    },
    "maze_define_function": {
        "skeleton": "basic_define",
        "mode": "maze",
        "color": "#B57242",
        "event": "define",
        "syntax": [
            "BasicFunction"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/function.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function(executor) {
            if (this.executed)
                return;
            var statement = this.block.statements[0];
            if (statement.getBlocks().length === 0)
                return;
            this.executor.stepInto(statement);
            this.executed = true;
            return Entry.STATIC.BREAK;
        }
    },
    "maze_step_if_3": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicIf",
            "front == banana"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/block_inner/if_target_3.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/if.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
        func: function() {
            if (this.isContinue) return;

            var entities =
                Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.OBSTACLE_BANANA
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0)
                return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "maze_step_if_4": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "BasicIf",
            "front == wall"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/block_inner/if_target_2.png",
                "size": 18
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/if.png",
                "size": 24
            }
        ],
        "statements": [
            {
                "accept": "basic"
            }
        ],
    func: function() {
            if (this.isContinue) return;

            var entities =
                Ntry.entityManager.getEntitiesByComponent(Ntry.STATIC.UNIT);

            var entity;
            for (var key in entities)
                entity = entities[key];

            var unitComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.UNIT);
            var gridComp = Ntry.entityManager.getComponent(
                entity.id, Ntry.STATIC.GRID);

            var grid = {x: gridComp.x, y: gridComp.y};
            Ntry.addVectorByDirection(grid, unitComp.direction, 1);

            var fitEntities = Ntry.entityManager.find(
                {
                    type: Ntry.STATIC.GRID,
                    x: grid.x,
                    y: grid.y
                },
                {
                    type: Ntry.STATIC.TILE,
                    tileType: Ntry.STATIC.WALL
                }
            );

            this.isContinue = true;

            var statement = this.block.statements[0];
            if (fitEntities.length === 0) {
                return;
            } else if (statement.getBlocks().length === 0)
                return;
            else {
                this.executor.stepInto(statement);
                return Entry.STATIC.BREAK;
            }
        }
    },
    "maze_step_move_step": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/moveStep.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.WALK, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "maze_step_rotate_left": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "left"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/turnL.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_LEFT, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "maze_step_rotate_right": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "right"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/turnR.png",
                "size": 24
            }
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
                Ntry.dispatchEvent("unitAction", Ntry.STATIC.TURN_RIGHT, callBack);

                return Entry.STATIC.BREAK;
            } else if (this.isAction) {
                return Entry.STATIC.BREAK;
            } else {
                delete this.isAction;
                delete this.isContinue;
            }
        }
    },
    "test_wrapper": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#3BBD70",
        "params": [
            {
                "type": "Block",
                "accept": "basic_boolean_field",
                "value": [
                    {
                        "type": "test",
                        "params": [
                            30,
                            50
                        ]
                    }
                ]
            },
            {
                "type": "Dropdown",
                "options": [
                    [ 1, 1 ],
                    [ 2, 2 ],
                    [ 3, 3 ],
                    [ 4, 4 ],
                    [ 5, 5 ],
                    [ 6, 6 ],
                    [ 7, 7 ],
                    [ 8, 8 ],
                    [ 9, 9 ],
                    [ 10, 10 ]
                ],
                "value": 1
            }
        ]
    },
    "basic_button": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": "basic button",
                "color": "#333",
                "align": "center"
            }
        ]
    },
    "dplay_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "dplay_get_number_sensor_value"
        },
        "class": "dplay_get"
    },
    "dplay_get_dust_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "template": "아날로그 %1 번  먼지 센서값",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "dplay_get_dust_sensor_value"
        },
        "class": "dplay_get"
    },
    "dplay_get_CO2_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "template": "아날로그 %1 번  이산화탄소 센서값",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "dplay_get_CO2_sensor_value"
        },
        "class": "dplay_get"
    },
    "dplay_get_gas_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "template": "아날로그 %1 번 가스 센서값",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "dplay_get_gas_sensor_value",
            "id": "hh5b"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "dplay_get",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            return Entry.hw.getAnalogPortValue(signal[1]);
        }
    },
    "dplay_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number",
                            "id": "bl5e"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "dplay_convert_scale"
        },
        "class": "dplay_get"
    },
    "dplay_get_value": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "아날로그 %1 번  %2 센서값",
        "params": [{
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Dropdown",
            "options": [
                ["적외선", "INFR"],
                ["가변저항", "ADJU"],
                ["빛센서", "LIGHT"],
                ["온도센서", "TEMP"],
                ["조이스틱 X", "JOYSX"],
                ["조이스틱 Y", "JOYSY"]
            ],
            "value": "INFR",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }],
        "events": {},
        "def": {
            "params": [{
                "type": "arduino_get_sensor_number"
            }, null],
            "type": "dplay_get_value",
            "id": "hh5b"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "OPERATOR": 1
        },
        "class": "dplay_get",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var signal = script.getValue("VALUE", script);
            return Entry.hw.getAnalogPortValue(signal[1]);
        }
    },
    "dplay_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "dplay_get_digital_value"
        },
        "class": "dplay_get"
    },
    "dplay_get_switch_status": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "디지털 %1 번 스위치가 %2  ",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["2", "2"],
                ["4", "4"]
            ],
            "value": "2",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["눌림", "ON"],
                ["열림", "OFF"]
            ],
            "value": "ON",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }],
        "events": {},
        "def": {
            "params": [null, null],
            "type": "dplay_get_switch_status"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "STATUS": 1
        },
        "class": "dplay_get",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = script.getField("PORT");
            var port = 2;
            if (port1 == "2") port = 2;
            else if (port1 == "4") port = 4;
            var value1 = script.getField("STATUS");
            if (value1 == "ON") return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
            else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
        }
    },
    "dplay_get_tilt": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "디지털  %1 번 기울기센서가 %2  ",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["2", "2"],
                ["4", "4"]
            ],
            "value": "2",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["왼쪽", "LEFT"],
                ["오른쪽", "LIGHT"]
            ],
            "value": "LEFT",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }],
        "events": {},
        "def": {
            "params": [null, null],
            "type": "dplay_get_tilt"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "STATUS": 1
        },
        "class": "dplay_get",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = script.getField("PORT");
            var port = 2;
            if (port1 == "2") port = 2;
            else if (port1 == "4") port = 4;
            var value1 = script.getField("STATUS");
            if (value1 == "LIGHT") return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
            else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
        }
    },
    "dplay_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "dplay_toggle_led"
        },
        "class": "dplay_set"
    },
    "dplay_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "dplay"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "dplay_toggle_pwm"
        },
        "class": "dplay_set"
    },
    "dplay_select_led": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "디지털 %1 LED 상태를 %2 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["7", "7"],
                ["8", "8"],
                ['12', "12"],
                ['13', "13"]
            ],
            "value": "7",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["켜기", "ON"],
                ["끄기", "OFF"]
            ],
            "value": "ON",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, null, null],
            "type": "dplay_select_led"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "OPERATOR": 1
        },
        "class": "dplay_set",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = script.getField("PORT");
            var port = 7;
            if (port1 == "7") port = 7;
            else if (port1 == "8") port = 8;
            else if (port1 == "12") port = 12;
            else if (port1 == "13") port = 13;
            var operator = script.getField("OPERATOR");
            var value = operator == "ON" ? 255 : 0;
            Entry.hw.setDigitalPortValue(port, value);
            return script.callReturn();
        }
    },
    "dplay_DCmotor": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "%1  DC모터 상태를 %2 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["왼쪽", "1"],
                ["오른쪽", "2"],
                ['양쪽', "3"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Dropdown",
            "options": [
                ["정방향", "FRONT"],
                ["역방향", "REAR"],
                ["정지", "OFF"]
            ],
            "value": "FRONT",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [null, null, null],
            "type": "dplay_DCmotor"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "OPERATOR": 1
        },
        "class": "dplay_set",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port = script.getField("PORT");
            var port1 = 0;
            var port2 = 0;
            var port3 = 0;
            var port4 = 0;
            if (port == "1") {
              port1 = 3; port2 = 5;
            }
            else if (port == "2") {
              port1 = 6; port2 = 11;
            }
            else if (port == "3") {
              port1 = 3; port2 = 5; port3 = 11; port4 = 6;
            }
            var temp = Entry.dplay.vel_value;
            var operator = script.getField("OPERATOR");
            var value1 = 0;
            var value2 = 0;
            var value3 = 0;
            var value4 = 0;
            if (operator == "FRONT") {
                value1 = temp;
                value2 = 0;
            }
            else if (operator == "REAR") {
                value1 = 0;
                value2 = temp;
            }
            else if (operator == "OFF") {
                value1 = 0;
                value2 = 0;
            }
            Entry.hw.setDigitalPortValue(port1, value2);
            Entry.hw.setDigitalPortValue(port2, value1);
            Entry.hw.setDigitalPortValue(port3, value2);
            Entry.hw.setDigitalPortValue(port4, value1);
            return script.callReturn();
        }
    },
    "dplay_DCmotor_speed": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 DC모터 속도를 %2(으)로 정하기 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
                ["왼쪽", "1"],
                ["오른쪽", "2"],
                ['양쪽', "3"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [null, {
                "type": "text",
                "params": ["100"]
            }, null],
            "type": "dplay_DCmotor_speed"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "dplay_set",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
          var port1 = 0;
          var port2 = 0;
          var port3 = 0;
          var port4 = 0;
          var value1 = 0;
          var value2 = 0;
          var result = 0;
          var port = script.getField("PORT");
          if (port == "1") {
              port1 = 3; port2 = 5;
          }
          else if (port == "2") {
              port1 = 11; port2 = 6;
          }
          else if (port == "3") {
              port1 = 3; port2 = 5; port3 = 11; port4 = 6;
          }
          var operator = script.getNumberValue("VALUE", script);
          operator = Math.max(operator, -100);
          operator = Math.min(operator, 100);
          if (operator == 0) {
              value1 = 0;
              value2 = 0;
              Entry.dplay.vel_value = value2;
          }
          else if (operator > 0) {
              result = operator + 155;
              result = Math.round(result);
              value1 = 0;
              value2 = result;
              Entry.dplay.vel_value = value2;
          }
          else if (operator < 0) {
              result = operator - 155;
              result = Math.round(result);
              value1 = -result;
              value2 = 0;
              Entry.dplay.vel_value = value1;
          }
          if (!script.isStart) {
              script.isStart = true;
              script.timeFlag = 1;
              var timeValue = 50;
              var timer = setTimeout(function() {
                script.timeFlag = 2;
                Entry.dplay.removeTimeout(timer);
              }, timeValue);
              Entry.dplay.timeouts.push(timer);
              return script;
          } else if (script.timeFlag == 1) {
              Entry.hw.setDigitalPortValue(3, 0);
              Entry.hw.setDigitalPortValue(5, 0);
              Entry.hw.setDigitalPortValue(6, 0);
              Entry.hw.setDigitalPortValue(11, 0);
              return script;
          } else if (script.timeFlag == 2) {
              Entry.hw.setDigitalPortValue(port1, value1);
              Entry.hw.setDigitalPortValue(port2, value2);
              Entry.hw.setDigitalPortValue(port3, value1);
              Entry.hw.setDigitalPortValue(port4, value2);
              delete script.isStart;
              delete script.timeFlag;
              Entry.engine.isContinue = false;
              return script.callReturn();
          }
       }
    },
    "dplay_buzzer": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "디지털 10번 부저를 %1 %2 %3 박자로 연주하기",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    ['도', "1"],
                    ['도#', "2"],
                    ['레', "3"],
                    ['미b', "4"],
                    ['미', "5"],
                    ['파', "6"],
                    ['파#', "7"],
                    ['솔', "8"],
                    ['솔#', "9"],
                    ['라', "10"],
                    ['시b', "11"],
                    ['시', "12"],
                    ['무음', "100"]
                ],
                "value": "1",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Dropdown",
                "options": [
                    ['1', "1"],
                    ['2', "2"],
                    ['3', "3"]
                ],
                "value": "1",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Block",
                "accept": "string"
            },
            {
                "type": "Indicator",
                "img": "block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                "1",
                "1",
                {
                    "type": "text",
                    "params": [ "0.5" ]
                },
                null
            ],
            "type": "dplay_buzzer"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "VALUE": 2
        },
        "class": "dplay_set",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var note = script.getNumberField("NOTE", script);
                var octave = script.getNumberField("OCTAVE", script);
                var beat = script.getNumberValue("VALUE");
                var tempo = 60;
                var note_go = note + ((octave-1)*12);
                var timeValue = beat*60*1000/tempo;
                script.isStart = true;
                script.timeFlag = 1;
                if(note == 100)   Entry.hw.setDigitalPortValue(10, 100);
                else            Entry.hw.setDigitalPortValue(10, note_go);
                if(timeValue > 100) {
                    var timer1 = setTimeout(function() {
                        Entry.hw.setDigitalPortValue(10, 100);
                        Entry.dplay.removeTimeout(timer1);
                    }, timeValue-100);
                    Entry.dplay.timeouts.push(timer1);
                }
                var timer2 = setTimeout(function() {
                    script.timeFlag = 0;
                    Entry.dplay.removeTimeout(timer2);
                }, timeValue);
                Entry.dplay.timeouts.push(timer2);
                return script;
            }
            else if (script.timeFlag == 1) {
                return script;
            }
            else {
                Entry.hw.setDigitalPortValue(10, 100);
                delete script.isStart;
                delete script.timeFlag;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }
    },
    "dplay_servo": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "디지털 9번 서보모터 각도를 %1 (도)로 이동",
        "params": [{
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params": [{
                "type": "text",
                "params": ["180"],
            }, null],
            "type": "dplay_servo",
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "dplay_set",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port = 9;
            var value = script.getNumberValue("VALUE");
            value = Math.round(value);
            value = Math.max(value, 1);
            value = Math.min(value, 179);
            Entry.hw.setDigitalPortValue(9, value);
            return script.callReturn();
        }
    },
    "dplay_Robot_run": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "로봇을 %1 하기 %2",
        "params": [{
            "type": "Dropdown",
            "options": [
              ['전진',"1"],
              ['후진',"2"],
              ['우회전',"3"],
              ['좌회전',"4"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [null, null],
            "type": "dplay_Robot_run"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "dplay_robot",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port = script.getField("PORT");
            var port1 = 3;
            var port2 = 5;
            var port3 = 6;
            var port4 = 11;
            var value1 = 0;
            var value2 = 0;
            var value3 = 0;
            var value4 = 0;
            var temp_Left = Entry.dplay.Left_value;
            var temp_Right = Entry.dplay.Right_value;
            if(port == "1") {
              value1 = 0; value2 = temp_Left; value3 = temp_Right; value4 = 0;
            }
            else if(port == "2") {
              value1 = temp_Left; value2 = 0; value3 = 0; value4 = temp_Right;
            }
            else if(port == "3") {
              value1 = 0; value2 = temp_Left; value3 = 0; value4 = 0;
            }
            else if(port == "4") {
              value1 = 0; value2 = 0; value3 = temp_Right; value4 = 0;
            }
            Entry.hw.setDigitalPortValue(port1, value1);
            Entry.hw.setDigitalPortValue(port2, value2);
            Entry.hw.setDigitalPortValue(port3, value3);
            Entry.hw.setDigitalPortValue(port4, value4);
            return script.callReturn();
        }
    },
    "dplay_Robot_run_sec": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "로봇을 %1 초 동안 %2 하기 %3",
        "params": [{
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Dropdown",
            "options": [
              ['전진',"1"],
              ['후진',"2"],
              ['우회전',"3"],
              ['좌회전',"4"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [{
                "type": "text",
                "params": ["1"]
            }, null, null],
            "type": "dplay_Robot_run_sec"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "PORT": 1
        },
        "class": "dplay_robot",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = 3;
            var port2 = 5;
            var port3 = 6;
            var port4 = 11;
            var value1 = 0;
            var value2 = 0;
            var value3 = 0;
            var value4 = 0;
            var temp_Left = Entry.dplay.Left_value;
            var temp_Right = Entry.dplay.Right_value;
            var port = script.getField("PORT");
            if (!script.isStart) {
              script.isStart = true;
              script.timeFlag = 1;
              var timeValue = script.getNumberValue("VALUE") * 1000;
              var timer = setTimeout(function() {
                script.timeFlag = 0;
                Entry.dplay.removeTimeout(timer);
              }, timeValue);
              Entry.dplay.timeouts.push(timer);
              return script;
            } else if (script.timeFlag == 1) {
             if(port == "1") {
                value1 = 0; value2 = temp_Left; value3 = temp_Right; value4 = 0;
              }
              else if(port == "2") {
                value1 = temp_Left; value2 = 0; value3 = 0; value4 = temp_Right;
              }
              else if(port == "3") {
                value1 = 0; value2 = temp_Left; value3 = 0; value4 = 0;
              }
              else if(port == "4") {
                value1 = 0; value2 = 0; value3 = temp_Right; value4 = 0;
              }
              Entry.hw.setDigitalPortValue(port1, value1);
              Entry.hw.setDigitalPortValue(port2, value2);
              Entry.hw.setDigitalPortValue(port3, value3);
              Entry.hw.setDigitalPortValue(port4, value4);
              return script;
            } else {
              delete script.isStart;
              delete script.timeFlag;
              Entry.engine.isContinue = false;
              value1 = 0;
              value2 = 0;
              value3 = 0;
              value4 = 0;
              return script.callReturn();
            }
        }
    },
    "dplay_robot_speed_sel": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 바퀴 속도를 %2(으)로 정하기 %3",
        "params": [{
            "type": "Dropdown",
            "options": [
              ['왼쪽',"1"],
              ['오른쪽',"2"],
              ['양쪽', "3"]
            ],
            "value": "1",
            "fontSize": 11,
            'arrowColor': EntryStatic.ARROW_COLOR_HW
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [null, {
                "type": "text",
                "params": ["100"]
            }, null],
            "type": "dplay_robot_speed_sel"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "dplay_robot",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = 0;
            var port2 = 0;
            var port3 = 0;
            var port4 = 0;
            var value1 = 0;
            var value2 = 0;
            var value3 = 0;
            var value4 = 0;
            var result = 0;
            var port = script.getField("PORT");
            var operator = script.getNumberValue("VALUE", script);
            operator = Math.max(operator, -100);
            operator = Math.min(operator, 100);
            if (port == "1") {
                   port1 = 3; port2 = 5;
                   if(operator > 0) {
                     result = operator + 155;
                     result = Math.round(result);
                     value1 = 0;
                     value2 = result;
                     Entry.dplay.Left_value = value2;
                   }
                   else if (operator < 0) {
                     result = operator - 155;
                     result = Math.round(result);
                     value1 = -result;
                     value2 = 0;
                     Entry.dplay.Left_value = value1;
                   }
                   else if( operator == 0) {
                     value1 = 0;
                     value2 = 0;
                     Entry.dplay.Left_value = 0;
                   }
            }
            if (port == "2") {
                  port3 = 6; port4 = 11;
                  if(operator > 0) {
                    result = operator + 155;
                    result = Math.round(result);
                    value3 = 0;
                    value4 = result;
                    Entry.dplay.Right_value = value4;
                  }
                  else if (operator < 0) {
                    result = operator - 155;
                    result = Math.round(result);
                    value3 = -result;
                    value4 = 0;
                    Entry.dplay.Right_value = value3;
                  }
                  else if( operator == 0) {
                    value3 = 0;
                    value4 = 0;
                    Entry.dplay.Right_value = value3;
                  }
            }
            if (port == "3") {
                port1 = 3; port2 = 5; port3 = 6; port4 = 11;
                if(operator > 0) {
                  result = operator + 155;
                  result = Math.round(result);
                  value1 = 0;
                  value2 = result;
                  value3 = 0;
                  value4 = result;
                  Entry.dplay.Left_value = value2;
                  Entry.dplay.Right_value = value4;
                }
                else if (operator < 0) {
                  result = operator - 155;
                  result = Math.round(result);
                  value1 = -result;
                  value2 = 0;
                  value3 = -result;
                  value4 = 0;
                  Entry.dplay.Left_value = value1;
                  Entry.dplay.Right_value = value3;
                }
                else if(operator == 0){
                  value1 = 0;
                  value2 = 0;
                  value3 = 0;
                  value4 = 0;
                  Entry.dplay.Left_value = 0;
                  Entry.dplay.Right_value = 0;
                }
            }
            if (!script.isStart) {
                  script.isStart = true;
                  script.timeFlag = 1;
                  var timeValue = 50;
                  var timer = setTimeout(function() {
                    script.timeFlag = 2;
                    Entry.dplay.removeTimeout(timer);
                  }, timeValue);
                  Entry.dplay.timeouts.push(timer);
                  return script;
            } else if (script.timeFlag == 1) {
                  Entry.hw.setDigitalPortValue(3, 0);
                  Entry.hw.setDigitalPortValue(5, 0);
                  Entry.hw.setDigitalPortValue(6, 0);
                  Entry.hw.setDigitalPortValue(11, 0);
                  return script;
            } else if (script.timeFlag == 2) {
                  Entry.hw.setDigitalPortValue(port1, value1);
                  Entry.hw.setDigitalPortValue(port2, value2);
                  Entry.hw.setDigitalPortValue(port3, value4);
                  Entry.hw.setDigitalPortValue(port4, value3);
                  delete script.isStart;
                  delete script.timeFlag;
                  Entry.engine.isContinue = false;
                  return script.callReturn();
              }
          }
    },
    "dplay_robot_speed_set": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "오른쪽 바퀴 %1 왼쪽 바퀴 %2(으)로 정하기 %3",
        "params": [{
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Block",
            "accept": "string"
        }, {
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [{
                "type": "text",
                "params": ["100"]
            }, {
                "type": "text",
                "params": ["100"]
            }, null],
            "type": "dplay_robot_speed_set"
        },
        "paramsKeyMap": {
            "R_VALUE": 0,
            "L_VALUE": 1
        },
        "class": "dplay_robot",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = 3;
            var port2 = 5;
            var port3 = 6;
            var port4 = 11;
            var value1 = 0;
            var value2 = 0;
            var value3 = 0;
            var value4 = 0;
            var result_R = 0;
            var result_L = 0;
            var value_L = script.getNumberValue("L_VALUE", script);
            value_L = Math.max(value_L, -100);
            value_L = Math.min(value_L, 100);
            if(value_L > 0) {
              result_L = value_L + 155;
              result_L = Math.round(result_L);
              value1 = 0;
              value2 = result_L;
              Entry.dplay.Left_value = value2;
            }
            else if (value_L < 0) {
              result_L = value_L - 155;
              result_L = Math.round(result_L);
              value1 = -result_L;
              value2 = 0;
              Entry.dplay.Left_value = value1;
            }
            else if(value_L == 0){
              value1 = 0;
              value2 = 0;
              Entry.dplay.Left_value = 0;
            }
            var value_R = script.getNumberValue("R_VALUE", script);
            value_R = Math.max(value_R, -100);
            value_R = Math.min(value_R, 100);
            if(value_R > 0) {
              result_R = value_R + 155;
              result_R = Math.round(result_R);
              value3 = 0;
              value4 = result_R;
              Entry.dplay.Right_value = value4;
            }
            else if (value_R < 0) {
              result_R = value_R - 155;
              result_R = Math.round(result_R);
              value3 = -result_R;
              value4 = 0;
              Entry.dplay.Right_value = value3;
            }
            else if(value_R == 0){
              value3 = 0;
              value4 = 0;
              Entry.dplay.Right_value = 0;
            }
            if (!script.isStart) {
                  script.isStart = true;
                  script.timeFlag = 1;
                  var timeValue = 50;
                  var timer = setTimeout(function() {
                    script.timeFlag = 2;
                    Entry.dplay.removeTimeout(timer);
                  }, timeValue);
                  Entry.dplay.timeouts.push(timer);
                  return script;
            } else if (script.timeFlag == 1) {
                  Entry.hw.setDigitalPortValue(3, 0);
                  Entry.hw.setDigitalPortValue(5, 0);
                  Entry.hw.setDigitalPortValue(6, 0);
                  Entry.hw.setDigitalPortValue(11, 0);
                  return script;
            } else if (script.timeFlag == 2) {
                  Entry.hw.setDigitalPortValue(port1, value1);
                  Entry.hw.setDigitalPortValue(port2, value2);
                  Entry.hw.setDigitalPortValue(port3, value4);
                  Entry.hw.setDigitalPortValue(port4, value3);
                  delete script.isStart;
                  delete script.timeFlag;
                  Entry.engine.isContinue = false;
                  return script.callReturn();
              }
          }
    },
    "dplay_robot_stop": {
        "color": "#00979D",
        "fontColor": "#FFF",
        "skeleton": "basic",
        "statements": [],
        "template": "로봇을 정지하기 %1",
        "params": [{
            "type": "Indicator",
            "img": "block_icon/hardware_03.png",
            "size": 12
        }],
        "events": {},
        "def": {
            "params":  [null],
            "type": "dplay_robot_stop"
        },
        "paramsKeyMap": {
        },
        "class": "dplay_robot",
        "isNotFor": ["dplay"],
        "func": function (sprite, script) {
            var port1 = 3;
            var port2 = 5;
            var port3 = 6;
            var port4 = 11;
            var value1 = 0;
            var value2 = 0;
            Entry.hw.setDigitalPortValue(port1, value1);
            Entry.hw.setDigitalPortValue(port2, value2);
            Entry.hw.setDigitalPortValue(port4, value1);
            Entry.hw.setDigitalPortValue(port3, value2);
            return script.callReturn();
        }
    },
    "nemoino_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "nemoino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "nemoino_get_number_sensor_value"
        },
        "class": "arduino_value"
    },
    "nemoino_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "nemoino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "nemoino_get_digital_value"
        },
        "class": "arduino_value"
    },
    "nemoino_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "nemoino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "nemoino_toggle_led"
        },
        "class": "arduino_set"
    },
    "nemoino_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "nemoino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "nemoino_toggle_pwm"
        },
        "class": "arduino_set"
    },
    "nemoino_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "nemoino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "nemoino_convert_scale"
        },
        "class": "arduino"
    },
    "sensorBoard_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "sensorBoard"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "sensorBoard_get_number_sensor_value"
        },
        "class": "arduino_value"
    },
    "sensorBoard_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "sensorBoard"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "sensorBoard_get_digital_value"
        },
        "class": "arduino_value"
    },
    "sensorBoard_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "sensorBoard"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "sensorBoard_toggle_led"
        },
        "class": "arduino_set"
    },
    "sensorBoard_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "sensorBoard"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "sensorBoard_toggle_pwm"
        },
        "class": "arduino_set"
    },
    "sensorBoard_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "sensorBoard"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number",
                            "id": "bl5e"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "sensorBoard_convert_scale"
        },
        "class": "arduino"
    },
    "CODEino_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "CODEino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "CODEino_get_number_sensor_value"
        },
        "class": "arduino_value"
    },
    "CODEino_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "CODEino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "CODEino_get_digital_value"
        },
        "class": "arduino_value"
    },
    "CODEino_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "CODEino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "CODEino_toggle_led"
        },
        "class": "arduino_set"
    },
    "CODEino_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "CODEino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "CODEino_toggle_pwm"
        },
        "class": "arduino_set"
    },
    "CODEino_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "CODEino"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "CODEino_convert_scale"
        },
        "class": "arduino"
    },
	// ardublock Added 2016-06-01
    "ardublock_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "ardublock"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "ardublock_get_number_sensor_value"
        },
        "class": "arduino_value"
    },
    "ardublock_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "ardublock"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "ardublock_get_digital_value"
        },
        "class": "arduino_value"
    },
    "ardublock_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "ardublock"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "ardublock_toggle_led"
        },
        "class": "arduino_set"
    },
    "ardublock_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "ardublock"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "ardublock_toggle_pwm"
        },
        "class": "arduino_set"
    },
    "ardublock_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "ardublock"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "ardublock_convert_scale"
        },
        "class": "arduino"
    },
	// ardublock Added 2016-06-01
    "joystick_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "joystick"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_sensor_number"
                }
            ],
            "type": "joystick_get_number_sensor_value"
        },
        "class": "arduino_value"
    },
    "joystick_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "joystick"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                }
            ],
            "type": "joystick_get_digital_value"
        },
        "class": "arduino_value"
    },
    "joystick_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "joystick"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_port_number"
                },
                null,
                null
            ],
            "type": "joystick_toggle_led"
        },
        "class": "arduino_set"
    },
    "joystick_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "joystick"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_pwm_port_number"
                },
                {
                    "type": "arduino_text",
                    "params": [ "255" ]
                },
                null
            ],
            "type": "joystick_toggle_pwm"
        },
        "class": "arduino_set"
    },
    "joystick_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "joystick"
        ],
        "def": {
            "params": [
                {
                    "type": "arduino_get_number_sensor_value",
                    "params": [
                        {
                            "type": "arduino_get_sensor_number"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "1023" ]
                },
                {
                    "type": "number",
                    "params": [ "0" ]
                },
                {
                    "type": "number",
                    "params": [ "100" ]
                }
            ],
            "type": "joystick_convert_scale"
        },
        "class": "arduino"
    },
    "ebs_if": {
        "parent": "_if",
        "def": {
            type: "_if",
            params: [
                {
                    type: 'reach_something',
                    params: [
                        null,
                        "wall"
                    ]
                }
            ]
        }
    },
    "ebs_if2": {
        "parent": "_if",
        "def": {
            type: "_if",
            params: [
                {
                    type: 'reach_something',
                    params: [
                        null,
                        "cwz5"
                    ]
                }
            ]
        }
    },
    "ai_move_right": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/moveStep.png",
                "size": 24
            }
        ],
        func: function() {
            if (!script.isStart) {
                script.isStart = true;
                script.isAction = true;
                Ntry.dispatchEvent("gridChange", function() {
                    script.isAction = false;
                });
                var spaceShipComp = Ntry.entityManager.getComponent(
                    entity.id, Ntry.STATIC.SPACE_SHIP
                );
                spaceShipComp.direction = Ntry.STATIC.EAST;
                var gridComp = Ntry.entityManager.getComponent(
                    entity.id, Ntry.STATIC.GRID
                );
                Ntry.entityManager.addComponent(
                    entity.id, {
                        type: Ntry.STATIC.ANIMATE,
                        animateType: Ntry.STATIC.ROTATE_TO,
                        animateValue: 0
                    }
                );
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
        }
    },
    "ai_move_up": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/ai_move_up.png",
                "size": 24
            }
        ],
        func: function() {
        }
    },
    "ai_move_down": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#A751E3",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/ai_move_down.png",
                "size": 24
            }
        ],
        func: function() {
        }
    },
    "ai_repeat_until_reach": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            }
        ],
        func: function() {
        }
    },
    "ai_if_else_1": {
        "skeleton": "basic_double_loop",
        "mode": "maze",
        "color": "#498DEB",
        "syntax": [
            "Scope",
            "move"
        ],
        "statements": [
            {
                "accept": "basic"
            },
            {
                "accept": "basic"
            }
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/ai/obstacle_1.png",
                "size": 24
            },
            {
                "type": "Image",
                "img": "/img/assets/week/blocks/for.png",
                "size": 24
            },
            {
                "type": "LineBreak"
            }
        ],
        func: function() {
        }
    },
    "ai_boolean_distance": {
        "skeleton": "basic_boolean_field",
        "mode": "maze",
        "color": "#2fc9f0",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Menus.ai_above, "UP"],
                    [Lang.Menus.ai_front, "RIGHT"],
                    [Lang.Menus.ai_under, "DOWN"]
                ],
                "value": "RIGHT",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Dropdown",
                "options": [
                    [">","BIGGER"],
                    [">=","BIGGER_EQUAL"],
                    ["=","EQUAL"],
                    ["<","SMALLER"],
                    ["<=","SMALLER_EQUAL"]
                ],
                "value": "BIGGER",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Block",
                "accept": "string"
            }
        ],
        func: function() {
        }
    },
    "ai_distance_value": {
        "skeleton": "basic_string_field",
        "mode": "maze",
        "color": "#ffd974",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Menus.ai_above, "UP"],
                    [Lang.Menus.ai_front, "RIGHT"],
                    [Lang.Menus.ai_under, "DOWN"]
                ],
                "value": "RIGHT",
                "fontSize": 11
            }
        ],
        func: function() {
        }
    },
    "ai_boolean_object": {
        "skeleton": "basic_boolean_field",
        "mode": "maze",
        "color": "#2fc9f0",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Menus.ai_above, "UP"],
                    [Lang.Menus.ai_front, "RIGHT"],
                    [Lang.Menus.ai_under, "DOWN"]
                ],
                "value": "RIGHT",
                "fontSize": 11,
                'arrowColor': EntryStatic.ARROW_COLOR_HW
            },
            {
                "type": "Dropdown",
                "options": [
                    [Lang.Menus.asteroids, "OBSTACLE"],
                    [Lang.Menus.wall, "WALL"],
                    [Lang.Menus.item, "ITEM"]
                ],
                "value": "OBSTACLE",
                "fontSize": 11
            }
        ],
        func: function() {
        }
    },
    "ai_use_item": {
        "skeleton": "basic",
        "mode": "maze",
        "color": "#EACF11",
        "syntax": [
            "Scope",
            "move"
        ],
        "params": [
            {
                "type": "Image",
                "img": '/img/assets/week/blocks/item.png',
                "size": 24
            }
        ],
        func: function() {
        }
    },
    "ai_boolean_and": {
        "color": "#2fc9f0",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "boolean"
            },
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_boolean_and,
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "boolean"
            }
        ],
        "events": {},
        "func": function (sprite, script) {
            var leftValue = script.getBooleanValue("LEFTHAND", script);
            var rightValue = script.getBooleanValue("RIGHTHAND", script);
            return leftValue && rightValue;
        }
    },
    "ai_True": {
        "color": "#2fc9f0",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Text",
                "text": Lang.Blocks.JUDGEMENT_true,
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            type: "True"
        },
        "func": function (sprite, script) {
            return true;
        },
        "isPrimitive": true
    }
};

(function() {
    for (var type in Entry.block) {
        var block = Entry.block[type];
        if (block.parent) {
            var f = function() {};
            f.prototype = Entry.block[block.parent];
            var schema = new f();
            for (var key in block) {
                schema[key] = block[key];
            }
            Entry.block[type] = schema;
        }
    }
})();

if (typeof exports == "object") {
    exports.block = Entry.block;
}
