if (typeof Entry !== "object")
    var Entry = {};

if (typeof exports == "object") {
    var Lang = require('../../extern/lang/ko.js').Lang;
}

Entry.block = {
    "albert_hand_found": {
        "color": "#00979D",
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
                    [ "왼쪽 근접 센서", "leftProximity" ],
                    [ "오른쪽 근접 센서", "rightProximity" ],
                    [ "밝기", "light" ],
                    [ "배터리", "battery" ],
                    [ "신호 세기", "signalStrength" ],
                    [ "앞쪽 OID", "frontOid" ],
                    [ "뒤쪽 OID", "backOid" ],
                    [ "x 위치", "positionX" ],
                    [ "y 위치", "positionY" ],
                    [ "방향", "orientation" ]
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
            "type": "albert_value",
            "id": "nw7o"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "도", "4" ],
                    [ "도#", "5" ],
                    [ "레", "6" ],
                    [ "미b", "7" ],
                    [ "미", "8" ],
                    [ "파", "9" ],
                    [ "파#", "10" ],
                    [ "솔", "11" ],
                    [ "솔#", "12" ],
                    [ "라", "13" ],
                    [ "시b", "14" ],
                    [ "시", "15" ]
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
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
    "arduino_get_number_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "on" ],
                    [ "끄기", "off" ]
                ],
                "value": "on",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "빨간", "8" ],
                    [ "파란", "9" ],
                    [ "노란", "10" ],
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
                    [ "흰색", "5" ]
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": "연결 프로그램 다운로드",
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                null
            ]
        }
    },
    "arduino_download_source": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": "엔트리 아두이노 소스",
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                null
            ]
        }
    },
    "arduino_connected": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": "연결 됨",
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                null
            ]
        }
    },
    "arduino_reconnect": {
        "skeleton": "basic_button",
        "color": "#eee",
        "params": [
            {
                "type": "Text",
                "text": "다시 연결하기",
                "color": "#333",
                "align": "center"
            }
        ],
        "events": {
            "mousedown": [
                null
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
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "소리", "0" ],
                    [ "빛", "1" ],
                    [ "슬라이더", "2" ],
                    [ "저항-A", "3" ],
                    [ "저항-B", "4" ],
                    [ "저항-C", "5" ],
                    [ "저항-D", "6" ]
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "소리큼", "GREAT" ],
                    [ "소리작음", "SMALL" ]
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "밝음", "BRIGHT" ],
                    [ "어두움", "DARK" ]
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "버튼누름", "4" ],
                    [ "A 연결됨", "17" ],
                    [ "B 연결됨", "18" ],
                    [ "C 연결됨", "19" ],
                    [ "D 연결됨", "20" ]
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽 기울임", "LEFT" ],
                    [ "오른쪽 기울임", "RIGHT" ],
                    [ "위쪽 기울임", "FRONT" ],
                    [ "아래쪽 기울임", "REAR" ],
                    [ "뒤집힘", "REVERSE" ]
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
    "bitbrick_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
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
        "skeleton": "basic_boolean_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "시계", "CW" ],
                    [ "반시계", "CCW" ]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
            var value = script.getNumberValue("VALUE") + 1;
            value = Math.min(value, Entry.Bitbrick.servoMaxValue);
            value = Math.max(value, Entry.Bitbrick.servoMinValue);
            Entry.hw.sendQueue[script.getStringField("PORT")] = value;
            return script.callReturn();
        }
    },
    "bitbrick_convert_scale": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
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
            "params": [ null ]
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
                "text": "X 좌푯값",
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
                "text": "Y 좌푯값",
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
                "text": "각도값",
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
                    [ "방향값", "ROTATION" ],
                    [ "이동 방향값", "DIRECTION" ]
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": "까지의 거리",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "distance_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
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
                "text": "마우스",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "x", "x" ],
                    [ "y", "y" ]
                ],
                "value": "x",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": "좌표",
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithSelf",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "x 좌푯값", "x" ],
                    [ "y 좌푯값", "y" ],
                    [ "방향", "rotation" ],
                    [ "이동방향", "direction" ],
                    [ "크기", "size" ],
                    [ "모양 번호", "picture_index" ],
                    [ "모양 이름", "picture_name" ]
                ],
                "value": "x",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "coordinate_object"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "COORDINATE": 2
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "+",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "-",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "x",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의 나머지",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "제곱", "square" ],
                    [ "루트", "root" ],
                    [ "사인값", "sin" ],
                    [ "코사인값", "cos" ],
                    [ "탄젠트값", "tan" ],
                    [ "아크사인값", "asin_radian" ],
                    [ "아크코사인값", "acos_radian" ],
                    [ "아크탄젠트값", "atan_radian" ],
                    [ "로그값", "log" ],
                    [ "자연로그값", "ln" ],
                    [ "소수점 부분", "unnatural" ],
                    [ "소수점 버림값", "floor" ],
                    [ "소수점 올림값", "ceil" ],
                    [ "반올림값", "round" ],
                    [ "펙토리얼값", "factorial" ],
                    [ "절댓값", "abs" ]
                ],
                "value": "square",
                "fontSize": 11
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
                null
            ],
            "type": "calc_operation"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "VALUE": 2
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "부터",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "사이의 무작위 수",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
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
            "LEFTHAND": 0,
            "RIGHTHAND": 2
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
                "text": "현재",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "연도", "YEAR" ],
                    [ "월", "MONTH" ],
                    [ "일", "DAY" ],
                    [ "시각(시)", "HOUR" ],
                    [ "시각(분)", "MINUTE" ],
                    [ "시각(초)", "SECOND" ]
                ],
                "value": "YEAR",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null, "YEAR" ],
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "sounds",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": "소리의 길이",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "get_sound_duration"
        },
        "paramsKeyMap": {
            "VALUE": 0
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
                "text": "초시계",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "보이기", "SHOW" ],
                    [ "숨기기", "HIDE" ]
                ],
                "value": "SHOW",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/calc_01.png",
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
            "params": [ null, "HIDE", null ],
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
                "text": "초시계 값",
                "color": "#3D3D3D"
            },
            {
                "type": "Text",
                "text": " ",
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "번째 글자",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕 엔트리!" ]
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
            "LEFTHAND": 0,
            "RIGHTHAND": 2
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의 글자 수",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "엔트리" ]
                },
                null
            ],
            "type": "length_of_string"
        },
        "paramsKeyMap": {
            "STRING": 0
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "번째 글자부터",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "번째 글자까지의 글자",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕 엔트리!" ]
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
            "STRING": 0,
            "START": 2,
            "END": 4
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "을(를)",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "로 바꾸기",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕 엔트리!" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "안녕" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "반가워" ]
                },
                null
            ],
            "type": "replace_string"
        },
        "paramsKeyMap": {
            "STRING": 0,
            "OLD_WORD": 2,
            "NEW_WORD": 4
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "대문자",
                        "toUpperCase"
                    ],
                    [
                        "소문자",
                        "toLowerCase"
                    ]
                ],
                "value": "toUpperCase",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": " ",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
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
            "STRING": 0,
            "CASE": 2
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "에서",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의 시작 위치",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕 엔트리!" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "엔트리" ]
                },
                null
            ],
            "type": "index_of_string"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "class": "calc_string",
        "isNotFor": [],
        "func": function (sprite, script) {
            var str = script.getStringValue("LEFTHAND", script);
            var target = script.getStringValue("RIGHTHAND", script);
            var index = str.indexOf(target);
            return index > -1?index+1:0;
        }
    },
    "combine_something": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "과(와)",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "를 합치기",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕!" ]
                },
                null,
                {
                    "type": "text",
                    "params": [ "엔트리" ]
                },
                null
            ],
            "type": "combine_something"
        },
        "paramsKeyMap": {
            "VALUE1": 0,
            "VALUE2": 2
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
                "text": "소릿값",
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
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "/",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "의",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "몫", "QUOTIENT" ],
                    [ "나머지", "MOD" ]
                ],
                "value": "QUOTIENT",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
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
            "LEFTHAND": 0,
            "RIGHTHAND": 2,
            "OPERATOR": 4
        },
        "class": "calc",
        "isNotFor": [ "" ],
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
                "text": "초시계",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "시작하기", "START" ],
                    [ "정지하기", "STOP" ],
                    [ "초기화하기", "RESET" ]
                ],
                "value": "START",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/calc_01.png",
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
                null
            ],
            "type": "choose_project_timer_action"
        },
        "paramsKeyMap": {
            "ACTION": 1
        },
        "class": "calc_timer",
        "isNotFor": [ "" ],
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
            return this.executor.break();
        }
    },
    "wait_until_true": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "booleanMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
            if (script.isLooped) {
                delete script.isLooped;
                return script.callReturn();
            }
            var value = script.getBooleanValue("BOOL", script);
            if (value) {
                script.isLooped = true;
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
            if (script.isLooped) {
                delete script.isLooped;
                return script.callReturn();
            }
            var value = script.getBooleanValue("BOOL", script);
            script.isLooped = true;
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
                "options": [
                    [ "자신", "self" ],
                    [ "엔트리봇", "7y0y" ]
                ]
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
            return;
        }
    },
    "when_clone_start": {
        "color": "#498deb",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_icon_clone.png",
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "이 될 때까지", "until" ],
                    [ "인 동안", "while" ]
                ],
                "value": "until",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                    [ "모든", "all" ],
                    [ "자신의", "thisOnly" ],
                    [ "이", "thisThread" ],
                    [ "자신의 다른", "otherThread" ]
                ],
                "value": "all",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                case 'thisThread':
                    return this.die();
                case 'otherThread':
                    sprite.parent.script.clearExecutors();
                    sprite.parent.script.addExecutor(this.executor);
                    return;
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "img": "/lib/entryjs/images/block_icon/flow_03.png",
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
                "text": "함수 추가",
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
                "value": "함수"
            },
            {
                "type": "Output",
                "accept": "paramMagnet"
            }
        ]
    },
    "function_field_string": {
        "skeleton": "basic_param",
        "isNotFor": [
            "functionEdit"
        ],
        "color": "#ffd974",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet",
                "restore": true
            },
            {
                "type": "Output",
                "accept": "paramMagnet"
            }
        ]
    },
    "function_field_boolean": {
        "skeleton": "basic_param",
        "isNotFor": [ "functionEdit" ],
        "color": "#aeb8ff",
        "params": [
            {
                "type": "Block",
                "accept": "booleanMagnet",
                "restore": true
            },
            {
                "type": "Output",
                "accept": "paramMagnet"
            }
        ]
    },
    "function_param_string": {
        "skeleton": "basic_string_field",
        "color": "#ffd974",
        func: function() {
            return this.executor.register.params[this.executor.register.paramMap[this.block.type]];
        }
    },
    "function_param_boolean": {
        "skeleton": "basic_boolean_field",
        "color": "#aeb8ff",
        func: function() {
            return this.executor.register.params[this.executor.register.paramMap[this.block.type]];
        }
    },
    "function_create": {
        "skeleton": "basic",
        "color": "#cc7337",
        "event": "funcDef",
        "params": [
            {
                "type": "Block",
                "accept": "paramMagnet",
                "value": {
                    "type": "function_field_label"
                }
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/function_03.png",
                "size": 12
            }
        ],
        func: function() {
        }
    },
    "function_general": {
        "skeleton": "basic",
        "color": "#cc7337",
        "params": [],
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
                    [ "왼쪽 근접 센서", "leftProximity" ],
                    [ "오른쪽 근접 센서", "rightProximity" ],
                    [ "왼쪽 바닥 센서", "leftFloor" ],
                    [ "오른쪽 바닥 센서", "rightFloor" ],
                    [ "x축 가속도", "accelerationX" ],
                    [ "y축 가속도", "accelerationY" ],
                    [ "z축 가속도", "accelerationZ" ],
                    [ "밝기", "light" ],
                    [ "온도", "temperature" ],
                    [ "신호 세기", "signalStrength" ],
                    [ "입력 A", "inputA" ],
                    [ "입력 B", "inputB" ]
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "검은색", "BLACK" ],
                    [ "하얀색", "WHITE" ]
                ],
                "value": "BLACK",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "검은색", "BLACK" ],
                    [ "하얀색", "WHITE" ]
                ],
                "value": "BLACK",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "앞쪽", "FRONT" ],
                    [ "뒤쪽", "REAR" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ],
                    [ "양쪽", "BOTH" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "도", "4" ],
                    [ "도#", "5" ],
                    [ "레", "6" ],
                    [ "미b", "7" ],
                    [ "미", "8" ],
                    [ "파", "9" ],
                    [ "파#", "10" ],
                    [ "솔", "11" ],
                    [ "솔#", "12" ],
                    [ "라", "13" ],
                    [ "시b", "14" ],
                    [ "시", "15" ]
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "A", "A" ],
                    [ "B", "B" ],
                    [ "A와 B", "AB" ]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "아날로그 입력", "0" ],
                    [ "디지털 입력", "1" ],
                    [ "서보 출력", "8" ],
                    [ "PWM 출력", "9" ],
                    [ "디지털 출력", "10" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "A", "A" ],
                    [ "B", "B" ],
                    [ "A와 B", "AB" ]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                    [ "A", "A" ],
                    [ "B", "B" ],
                    [ "A와 B", "AB" ]
                ],
                "value": "A",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                "text": "마우스를 클릭했는가?",
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
                "text": "키가 눌러져 있는가?",
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "collision",
                "fontSize": 11
            },
            {
                "type": "Text",
                "text": "에 닿았는가?",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null ],
            "type": "reach_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "=",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": ">",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
            },
            {
                "type": "Text",
                "text": "<",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "그리고", "AND" ],
                    [ "또는", "OR" ]
                ],
                "value": "AND",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "booleanMagnet"
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Text",
                "text": "그리고",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "booleanMagnet"
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
                "accept": "booleanMagnet"
            },
            {
                "type": "Text",
                "text": "또는",
                "color": "#3D3D3D"
            },
            {
                "type": "Block",
                "accept": "booleanMagnet"
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
                    "type": "False"
                }
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
                "type": "Block",
                "accept": "booleanMagnet"
            },
            {
                "type": "Text",
                "text": "(이)가 아니다",
                "color": "#3D3D3D"
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
            "type": "boolean_not"
        },
        "paramsKeyMap": {
            "VALUE": 0
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
                    [ "참", "true" ],
                    [ "거짓", "false" ]
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
                "text": "참",
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
                "text": "거짓",
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
                "accept": "stringMagnet"
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
                "accept": "stringMagnet"
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "말하기", "speak" ]
                ],
                "value": "speak",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕!" ]
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
            } else
                return script;
        }
    },
    "dialog": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "말하기", "speak" ]
                ],
                "value": "speak",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [ "안녕!" ]
                },
                null,
                null
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "다음", "next" ],
                    [ "이전", "prev" ]
                ],
                "value": "next",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
            if(!script.fields || script.getStringField("DRIECTION") !== 'prev') {
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "불투명도", "opacity" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "불투명도", "opacity" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "options": [
                    [ "엔트리봇_걷기1", "vx80" ],
                    [ "엔트리봇_걷기1", "vx80" ],
                    [ "엔트리봇_걷기2", "4t48" ]
                ]
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
            "type": "change_to_some_shape",
            "id": "0x2t"
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "투명도", "transparency" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "투명도", "transparency" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "투명도", "transparency" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "색깔", "color" ],
                    [ "밝기", "brightness" ],
                    [ "투명도", "transparency" ]
                ],
                "value": "color",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                    [ "맨 앞으로", "FRONT" ],
                    [ "앞으로", "FORWARD" ],
                    [ "뒤로", "BACKWARD" ],
                    [ "맨 뒤로", "BACK" ]
                ],
                "value": "FRONT",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/looks_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                script.frameCount = Math.floor(timeValue * Entry.FPS)
                script.x = script.getNumberValue("VALUE2", script);
                script.y = script.getNumberValue("VALUE3", script);
            }
            if (script.frameCount != 0) {
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
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
            sprite.setX(value1);
            var value2 = script.getNumberValue("VALUE2", script);
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                script.frameCount = Math.floor(timeValue * Entry.FPS)
                script.dX = xValue/script.frameCount;
                script.dY = yValue/script.frameCount;
            }
            if (script.frameCount != 0) {
                sprite.setX(sprite.getX() + script.dX);
                sprite.setY(sprite.getY() + script.dY);
                script.frameCount--;
                if (sprite.brush && !sprite.brush.stop) {
                    sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
                }
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                return script.callReturn();
            }
        }
    },
    "rotate_by_angle_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Angle"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                    "params": [ "2" ]
                },
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
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "spritesWithMouse",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "angle"
                },
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "angle"
                },
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "angle"
                },
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "angle"
                },
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "angle"
                },
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
    "direction_relative_duration": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
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
                {
                    "type": "angle"
                },
                null
            ],
            "type": "direction_relative_duration"
        },
        "paramsKeyMap": {
            "DURATION": 0,
            "AMOUNT": 1
        },
        "class": "rotate",
        "isNotFor": [ "" ],
        "func": function (sprite, script) {
            if (!script.isStart) {
                var timeValue;
                timeValue = script.getNumberValue("DURATION", script);
                var directionValue = script.getNumberValue("AMOUNT", script);
                script.isStart = true;
                script.frameCount = Math.floor(timeValue * Entry.FPS)
                script.dDirection = directionValue/script.frameCount;
            }
            if (script.frameCount != 0) {
                sprite.setDirection(sprite.getDirection() + script.dDirection);
                script.frameCount--;
                return script;
            } else {
                delete script.isStart;
                delete script.frameCount;
                delete script.dDirection;
                return script.callReturn();
            }
        }
    },
    "neobot_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "1번 포트", "1" ],
                    [ "2번 포트", "2" ],
                    [ "3번 포트", "3" ],
                    [ "리모컨", "4" ]
                ],
                "value": "1",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "neobot_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "neobot_value",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var port = script.getStringField("PORT");
            return Entry.hw.portData[port];
        }
    },
    "neobot_turn_left": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "앞으로", "1" ],
                    [ "뒤로", "-1" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "느리게", "1" ],
                    [ "보통", "2" ],
                    [ "빠르게", "3" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "neobot_turn_left"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "neobot_motor",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var port = script.getNumberField("VALUE");
            var direction = script.getNumberField("DIRECTION");
            Entry.hw.sendQueue["LMOT"] = port * direction;
            return script.callReturn();
        }
    },
    "neobot_stop_left": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "neobot_stop_left"
        },
        "class": "neobot_motor",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            Entry.hw.sendQueue["LMOT"] = 0;
            return script.callReturn();
        }
    },
    "neobot_turn_right": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "앞으로", "1" ],
                    [ "뒤로", "-1" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "느리게", "1" ],
                    [ "보통", "2" ],
                    [ "빠르게", "3" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "neobot_turn_right"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "neobot_motor",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var port = script.getNumberField("VALUE");
            var direction = script.getNumberField("DIRECTION");
            Entry.hw.sendQueue["RMOT"] = port * direction;
            return script.callReturn();
        }
    },
    "neobot_stop_right": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "neobot_stop_right"
        },
        "class": "neobot_motor",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            Entry.hw.sendQueue["RMOT"] = 0;
            return script.callReturn();
        }
    },
    "neobot_run_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "양쪽", "1" ],
                    [ "왼쪽", "2" ],
                    [ "오른쪽", "3" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "느리게", "1" ],
                    [ "보통", "2" ],
                    [ "빠르게", "3" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "전진", "1" ],
                    [ "후진", "2" ],
                    [ "좌회전", "3" ],
                    [ "우회전", "4" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
                null,
                null,
                null
            ],
            "type": "neobot_run_motor"
        },
        "paramsKeyMap": {
            "TYPE": 0,
            "DURATION": 1,
            "VALUE": 2,
            "DIRECTION": 3
        },
        "class": "neobot_motor",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            if (!script.isStart) {
                script.isStart = true;
                script.timeFlag = 1;
                var timeValue = script.getNumberValue("DURATION") * 1000;
                setTimeout(function() {
                    script.timeFlag = 0;
                }, timeValue);
                return script;
            } else if (script.timeFlag == 1) {
                var type = script.getNumberField("TYPE");
                var value = script.getNumberField("VALUE");
                var direction = script.getNumberField("DIRECTION");
                switch (direction) {
                    case 1:
                        Entry.hw.sendQueue["LMOT"] = value;
                        Entry.hw.sendQueue["RMOT"] = value;
                        break;
                    case 2:
                        Entry.hw.sendQueue["LMOT"] = value * -1;
                        Entry.hw.sendQueue["RMOT"] = value * -1;
                        break;
                    case 3:
                        Entry.hw.sendQueue["LMOT"] = value;
                        Entry.hw.sendQueue["RMOT"] = value * -1;
                        break;
                    case 4:
                        Entry.hw.sendQueue["LMOT"] = value * -1;
                        Entry.hw.sendQueue["RMOT"] = value;
                        break;
                }

                if(type === 2)  {
                    Entry.hw.sendQueue["RMOT"] = 0;
                } else if(type === 3) {
                    Entry.hw.sendQueue["LMOT"] = 0;
                }

                return script;
            } else {
                delete script.timeFlag;
                delete script.isStart;
                Entry.engine.isContinue = false;
                Entry.hw.sendQueue["LMOT"] = 0;
                Entry.hw.sendQueue["RMOT"] = 0;
                return script.callReturn();
            }
        }
    },
    "neobot_servo_1": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "빠른", "3" ],
                    [ "보통", "2" ],
                    [ "느린", "1" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "0도", "0" ],
                    [ "10도", "1" ],
                    [ "20도", "2" ],
                    [ "30도", "3" ],
                    [ "40도", "4" ],
                    [ "50도", "5" ],
                    [ "60도", "6" ],
                    [ "70도", "7" ],
                    [ "80도", "8" ],
                    [ "90도", "9" ],
                    [ "100도", "10" ],
                    [ "110도", "11" ],
                    [ "120도", "12" ],
                    [ "130도", "13" ],
                    [ "140도", "14" ],
                    [ "150도", "15" ],
                    [ "160도", "16" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "neobot_servo_1"
        },
        "paramsKeyMap": {
            "SPEED": 0,
            "VALUE": 1
        },
        "class": "neobot_servo",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var value = script.getNumberField("VALUE");
            var speed = script.getNumberField("SPEED");
            Entry.hw.sendQueue["SERVO1"] = value;
            Entry.hw.sendQueue["SERVO1_SPEED"] = speed;
            return script.callReturn();
        }
    },
    "neobot_servo_2": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "빠른", "3" ],
                    [ "보통", "2" ],
                    [ "느린", "1" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "0도", "0" ],
                    [ "10도", "1" ],
                    [ "20도", "2" ],
                    [ "30도", "3" ],
                    [ "40도", "4" ],
                    [ "50도", "5" ],
                    [ "60도", "6" ],
                    [ "70도", "7" ],
                    [ "80도", "8" ],
                    [ "90도", "9" ],
                    [ "100도", "10" ],
                    [ "110도", "11" ],
                    [ "120도", "12" ],
                    [ "130도", "13" ],
                    [ "140도", "14" ],
                    [ "150도", "15" ],
                    [ "160도", "16" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "neobot_servo_2"
        },
        "paramsKeyMap": {
            "SPEED": 0,
            "VALUE": 1
        },
        "class": "neobot_servo",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var value = script.getNumberField("VALUE");
            var speed = script.getNumberField("SPEED");
            Entry.hw.sendQueue["SERVO2"] = value;
            Entry.hw.sendQueue["SERVO2_SPEED"] = speed;
            return script.callReturn();
        }
    },
    "neobot_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "도", "1" ],
                    [ "레", "2" ],
                    [ "미", "3" ],
                    [ "파", "4" ],
                    [ "솔", "5" ],
                    [ "라", "6" ],
                    [ "시", "7" ],
                    [ "도", "8" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "1", "0" ],
                    [ "2", "1" ],
                    [ "3", "2" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "2분음표", "2" ],
                    [ "4분음표", "4" ],
                    [ "8분음표", "8" ]
                ],
                "value": "2",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null, null ],
            "type": "neobot_play_note_for"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "DURATION": 2
        },
        "class": "neobot_note",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;

            if (!script.isStart) {
                var note = script.getNumberField("NOTE", script);
                var octave = script.getNumberField("OCTAVE", script);
                var duration = script.getNumberField("DURATION", script);
                script.note = note;

                script.isStart = true;
                script.timeFlag = 1;
                sq.note = note;
                sq.octave = octave;
                sq.duration = duration;
                sq.sound_check = (Math.random() * 100000).toFixed(0);
                setTimeout(function() {
                    script.timeFlag = 0;
                }, 1 / duration * 2000);
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
    "neobot_set_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "1", "O_1" ],
                    [ "2", "O_2" ]
                ],
                "value": "O_1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "1" ],
                    [ "끄기", "0" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [ null, null, null ],
            "type": "neobot_set_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "neobot_set_value",
        "isNotFor": [ "neobot" ],
        "func": function (sprite, script) {
            var sq = Entry.hw.sendQueue;

            var port = script.getStringField("PORT", script);
            var value = script.getNumberField("VALUE", script);
            sq[port] = value;
            return script.callReturn();
        }
    },
    "robotis_openCM70_cm_custom_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.READ, d = 0, e = 0, f = 0, d = a.getStringField("SIZE");
            "BYTE" == d ? e = 1 : "WORD" == d ? e = 2 : "DWORD" == d && (e = 4);
            f = d = a.getNumberValue("VALUE");
            Entry.Robotis_carCont.setRobotisData([[c, d, e, 0, e]]);
            Entry.Robotis_carCont.update();
            return Entry.hw.portData[f];
        }
    },
    "robotis_openCM70_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "최종 소리 감지 횟수", "CM_SOUND_DETECTED" ],
                    [ "실시간 소리 감지 횟수", "CM_SOUND_DETECTING" ],
                    [ "사용자 버튼 상태", "CM_USER_BUTTON" ]
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.READ, d = 0, e = 0, f = 0, g = 0, h = a.getStringField("SENSOR");
            "CM_SOUND_DETECTED" == h ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1]) : "CM_SOUND_DETECTING" == h ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[0],
                                                                                                                                                                                                                                                                                                                                   e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTING[1]) : "CM_USER_BUTTON" == h && (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_USER_BUTTON[1]);
                                                                                                                                                                                                                                                                                                                                   f += 0 * g;
                                                                                                                                                                                                                                                                                                                                   Entry.Robotis_carCont.setRobotisData([[c, d, e, 0, g]]);
                                                                                                                                                                                                                                                                                                                                   Entry.Robotis_carCont.update();
                                                                                                                                                                                                                                                                                                                                   return Entry.hw.portData[f];
        }
    },
    "robotis_openCM70_aux_sensor_value": {
        "color": "#00979D",
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
                    [ "서보모터 위치", "AUX_SERVO_POSITION" ],
                    [ "적외선센서", "AUX_IR" ],
                    [ "접촉센서", "AUX_TOUCH" ],
                    [ "조도센서(CDS)", "AUX_BRIGHTNESS" ],
                    [ "온습도센서(습도)", "AUX_HYDRO_THEMO_HUMIDITY" ],
                    [ "온습도센서(온도)", "AUX_HYDRO_THEMO_TEMPER" ],
                    [ "온도센서", "AUX_TEMPERATURE" ],
                    [ "초음파센서", "AUX_ULTRASONIC" ],
                    [ "자석센서", "AUX_MAGNETIC" ],
                    [ "동작감지센서", "AUX_MOTION_DETECTION" ],
                    [ "컬러센서", "AUX_COLOR" ],
                    [ "사용자 장치", "AUX_CUSTOM" ]
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.READ, d = 0, e = 0, f = 0, g = 0, h = a.getStringField("PORT"), k = a.getStringField("SENSOR"), l = 0;
            "PORT_3" == h ? l = 2 : "PORT_4" == h ? l = 3 : "PORT_5" == h ? l = 4 : "PORT_6" == h && (l = 5);
            "AUX_SERVO_POSITION" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1]) : "AUX_IR" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_IR[1]) :
                "AUX_TOUCH" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TOUCH[1]) : "AUX_TEMPERATURE" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_TEMPERATURE[1]) :
                    "AUX_BRIGHTNESS" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_BRIGHTNESS[1]) : "AUX_HYDRO_THEMO_HUMIDITY" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[0],
                                                                                                                                                                                                                                                                                                                                  e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_HUMIDITY[1]) : "AUX_HYDRO_THEMO_TEMPER" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_HYDRO_THEMO_TEMPER[1]) : "AUX_ULTRASONIC" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1],
                                                                                                                                                                                                                                                                                                                                      d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_ULTRASONIC[1]) : "AUX_MAGNETIC" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MAGNETIC[1]) : "AUX_MOTION_DETECTION" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1],
                                                                                                                                                                                                                                                                                                                                          d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTION_DETECTION[1]) : "AUX_COLOR" == k ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1], d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_COLOR[1]) : "AUX_CUSTOM" == k && (f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1],
                                                                                                                                                                                                                                                                                                                                              d = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1]);
                                                                                                                                                                                                                                                                                                                                              f += l * g;
                                                                                                                                                                                                                                                                                                                                              0 != l && (e = 6 * g);
                                                                                                                                                                                                                                                                                                                                              Entry.Robotis_carCont.setRobotisData([[c, d, e, 0, g]]);
                                                                                                                                                                                                                                                                                                                                              Entry.Robotis_carCont.update();
                                                                                                                                                                                                                                                                                                                                              return Entry.hw.portData[f];
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
                    [ "라(0)", "0" ],
                    [ "라#(1)", "1" ],
                    [ "시(2)", "2" ],
                    [ "도(3)", "3" ],
                    [ "도#(4)", "4" ],
                    [ "레(5)", "5" ],
                    [ "레#(6)", "6" ],
                    [ "미(7)", "7" ],
                    [ "파(8)", "8" ],
                    [ "파#(9)", "9" ],
                    [ "솔(10)", "10" ],
                    [ "솔#(11)", "11" ],
                    [ "라(12)", "12" ],
                    [ "라#(13)", "13" ],
                    [ "시(14)", "14" ],
                    [ "도(15)", "15" ],
                    [ "도#(16)", "16" ],
                    [ "레(17)", "17" ],
                    [ "레#(18)", "18" ],
                    [ "미(19)", "19" ],
                    [ "파(20)", "20" ],
                    [ "파#(21)", "21" ],
                    [ "솔(22)", "22" ],
                    [ "솔#(23)", "23" ],
                    [ "라(24)", "24" ],
                    [ "라#(25)", "25" ],
                    [ "시(26)", "26" ],
                    [ "도(27)", "27" ],
                    [ "도#(28)", "28" ],
                    [ "레(29)", "29" ],
                    [ "레#(30)", "30" ],
                    [ "미(31)", "31" ],
                    [ "파(32)", "32" ],
                    [ "파#(33)", "33" ],
                    [ "솔(34)", "34" ],
                    [ "솔#(35)", "35" ],
                    [ "라(36)", "36" ],
                    [ "라#(37)", "37" ],
                    [ "시(38)", "38" ],
                    [ "도(39)", "39" ],
                    [ "도#(40)", "40" ],
                    [ "레(41)", "41" ],
                    [ "레#(42)", "42" ],
                    [ "미(43)", "43" ],
                    [ "파(44)", "44" ],
                    [ "파#(45)", "45" ],
                    [ "솔(46)", "46" ],
                    [ "솔#(47)", "47" ],
                    [ "라(48)", "48" ],
                    [ "라#(49)", "49" ],
                    [ "시(50)", "50" ],
                    [ "도(51)", "51" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("CM_BUZZER_INDEX", a), d = a.getNumberValue("CM_BUZZER_TIME", a), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0, h = 0, k = 0, l = 0, f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1], h = parseInt(10 * d);
            50 < h && (h = 50);
            k = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0];
            l = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f, g, h], [e, k, l, c]], 1E3 * d);
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("CM_BUZZER_MELODY", a), d = Entry.Robotis_openCM70.INSTRUCTION.WRITE, e = 0, f = 0, g = 0, h = 0, e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[0], f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_TIME[1], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[0], h = Entry.Robotis_openCM70.CONTROL_TABLE.CM_BUZZER_INDEX[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[d, e, f, 255], [d, g, h, c]], 1E3);
        }
    },
    "robotis_openCM70_cm_sound_detected_clear": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.WRITE, d = 0, e = 0, d = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[c, d, e, 0]], Entry.Robotis_openCM70.delay);
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
                    [ "빨간색", "CM_LED_R" ],
                    [ "녹색", "CM_LED_G" ],
                    [ "파란색", "CM_LED_B" ]
                ],
                "value": "CM_LED_R",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "1" ],
                    [ "끄기", "0" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("CM_LED", a), d = a.getField("VALUE", a), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0;
            "CM_LED_R" == c ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_R[1]) : "CM_LED_G" == c ? (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_G[1]) : "CM_LED_B" == c && (f = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.CM_LED_B[1]);
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f, g, d]], Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_cm_motion": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.WRITE, d = 0, e = 0, f = 0, d = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[0], e = Entry.Robotis_openCM70.CONTROL_TABLE.CM_MOTION[1], f = a.getNumberValue("VALUE", a);
            return Entry.Robotis_carCont.postCallReturn(a, [[c, d, e, f]], Entry.Robotis_openCM70.delay);
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
                    [ "1", "1" ],
                    [ "2", "2" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "시계방향", "CW" ],
                    [ "반시계방향", "CCW" ]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getField("DIRECTION_ANGLE", a), e = a.getNumberValue("VALUE"), f = Entry.Robotis_openCM70.INSTRUCTION.WRITE, g = 0, h = 0, g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[0], h = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
            "CW" == d ? (e += 1024, 2047 < e && (e = 2047)) : 1023 < e && (e = 1023);
            return Entry.Robotis_carCont.postCallReturn(a, [[f, g + (c - 1) * h, h, e]], Entry.Robotis_openCM70.delay);
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
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "회전모드", "0" ],
                    [ "관절모드", "1" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getField("MODE", a), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0, f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_MODE[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f + (c - 1) * g, g, d]], Entry.Robotis_openCM70.delay);
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
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "시계방향", "CW" ],
                    [ "반시계방향", "CCW" ]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getField("DIRECTION_ANGLE", a), e = a.getNumberValue("VALUE"), f = Entry.Robotis_openCM70.INSTRUCTION.WRITE, g = 0, h = 0, g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[0], h = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_SPEED[1];
            "CW" == d ? (e += 1024, 2047 < e && (e = 2047)) : 1023 < e && (e = 1023);
            return Entry.Robotis_carCont.postCallReturn(a, [[f, g + (c - 1) * h, h, e]], Entry.Robotis_openCM70.delay);
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
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getNumberValue("VALUE"), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0, f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_SERVO_POSITION[1];
            1023 < d ? d = 1023 : 0 > d && (d = 0);
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f + (c - 1) * g, g, d]], Entry.Robotis_openCM70.delay);
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
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "양 쪽 LED끄기", "0" ],
                    [ "오른쪽 LED켜기", "1" ],
                    [ "왼쪽 LED켜기", "2" ],
                    [ "양 쪽 LED켜기", "3" ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getField("LED_MODULE", a), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0, f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_LED_MODULE[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f + (c - 1) * g, g, d]], Entry.Robotis_openCM70.delay);
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
                    [ "3", "3" ],
                    [ "4", "4" ],
                    [ "5", "5" ],
                    [ "6", "6" ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("PORT", a), d = a.getNumberValue("VALUE"), e = Entry.Robotis_openCM70.INSTRUCTION.WRITE, f = 0, g = 0, f = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[0], g = Entry.Robotis_openCM70.CONTROL_TABLE.AUX_CUSTOM[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f + (c - 1) * g, g, d]], Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_openCM70_cm_custom": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.Robotis_openCM70.INSTRUCTION.WRITE, d = 0, e = 0, d = a.getNumberValue("ADDRESS"), e = a.getNumberValue("VALUE");
            return Entry.Robotis_carCont.postCallReturn(a, [[c, d, 65535 < e ? 4 : 255 < e ? 2 : 1, e]], Entry.Robotis_openCM70.delay);
        }
    },
    "robotis_carCont_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [ "왼쪽 접촉 센서", "CM_SPRING_LEFT" ],
                    [ "오른쪽 접촉 센서", "CM_SPRING_RIGHT" ],
                    [ "선택 버튼 상태", "CM_SWITCH" ],
                    [ "최종 소리 감지 횟수", "CM_SOUND_DETECTED" ],
                    [ "실시간 소리 감지 횟수", "CM_SOUND_DETECTING" ],
                    [ "왼쪽 적외선 센서", "CM_IR_LEFT" ],
                    [ "오른쪽 적외선 센서", "CM_IR_RIGHT" ],
                    [ "왼쪽 적외선 센서 캘리브레이션 값", "CM_CALIBRATION_LEFT" ],
                    [ "오른쪽 적외선 센서 캘리브레이션 값", "CM_CALIBRATION_RIGHT" ]
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
        "func": function (b, a) {
            var c = Entry.Robotis_carCont.INSTRUCTION.READ, d = 0, e = 0, f = 0, g = 0, h = a.getStringField("SENSOR");
            "CM_SPRING_LEFT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[2], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_LEFT[3]) : "CM_SPRING_RIGHT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[2], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SPRING_RIGHT[3]) :
                "CM_SWITCH" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SWITCH[1]) : "CM_SOUND_DETECTED" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1]) :
                    "CM_SOUND_DETECTING" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTING[1]) : "CM_IR_LEFT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[2], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_LEFT[3]) :
                        "CM_IR_RIGHT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[2], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_IR_RIGHT[3]) : "CM_CALIBRATION_LEFT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1]) :
                            "CM_CALIBRATION_RIGHT" == h ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1]) : "CM_BUTTON_STATUS" == h && (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1], d = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[0],
                                                                                                                                                                                                                                                                                                                                                             e = Entry.Robotis_carCont.CONTROL_TABLE.CM_BUTTON_STATUS[1]);
                                                                                                                                                                                                                                                                                                                                                             Entry.Robotis_carCont.setRobotisData([[c, d, e, 0, g]]);
                                                                                                                                                                                                                                                                                                                                                             Entry.Robotis_carCont.update();
                                                                                                                                                                                                                                                                                                                                                             return Entry.hw.portData[f];
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
                    [ "켜기", "1" ],
                    [ "끄기", "0" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "켜기", "1" ],
                    [ "끄기", "0" ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("VALUE_LEFT", a), d = a.getField("VALUE_RIGHT", a), e = Entry.Robotis_carCont.INSTRUCTION.WRITE, f = 0, g = 0, h = 0, f = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_LED[1];
            1 == c && 1 == d ? h = 9 : 1 == c && 0 == d && (h = 8);
            0 == c && 1 == d && (h = 1);
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f, g, h]], Entry.Robotis_carCont.delay);
        }
    },
    "robotis_carCont_cm_sound_detected_clear": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.Robotis_carCont.INSTRUCTION.WRITE, d = 0, e = 0, d = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[0], e = Entry.Robotis_carCont.CONTROL_TABLE.CM_SOUND_DETECTED[1];
            return Entry.Robotis_carCont.postCallReturn(a, [[c, d, e, 0]], Entry.Robotis_carCont.delay);
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [ "시계방향", "CW" ],
                    [ "반시계방향", "CCW" ]
                ],
                "value": "CW",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("DIRECTION", a), d = a.getField("DIRECTION_ANGLE", a), e = a.getNumberValue("VALUE"), f = Entry.Robotis_carCont.INSTRUCTION.WRITE, g = 0, h = 0;
            "LEFT" == c ? (g = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[0], h = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_LEFT[1]) : (g = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[0], h = Entry.Robotis_carCont.CONTROL_TABLE.AUX_MOTOR_SPEED_RIGHT[1]);
            "CW" == d ? (e += 1024, 2047 < e && (e = 2047)) : 1023 < e && (e = 1023);
            return Entry.Robotis_carCont.postCallReturn(a, [[f, g, h, e]], Entry.Robotis_carCont.delay);
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
                    [ "왼쪽", "LEFT" ],
                    [ "오른쪽", "RIGHT" ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getField("DIRECTION", a), d = a.getNumberValue("VALUE"), e = Entry.Robotis_carCont.INSTRUCTION.WRITE, f = 0, g = 0;
            "LEFT" == c ? (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_LEFT[1]) : (f = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[0], g = Entry.Robotis_carCont.CONTROL_TABLE.CM_CALIBRATION_RIGHT[1]);
            return Entry.Robotis_carCont.postCallReturn(a, [[e, f, g, d]], Entry.Robotis_carCont.delay);
        }
    },
    "when_scene_start": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_icon_scene_1_2.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_03.png",
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
                    [ "다음", "next" ],
                    [ "이전", "pre" ]
                ],
                "value": "next",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_03.png",
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
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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

            if (sound)
                createjs.Sound.play(sound.id);

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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
        "isNotFor": [ "" ],
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
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
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
        "isNotFor": [ "" ],
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
                "img": "/lib/entryjs/images/block_icon/start_icon_play.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_keyboard.png",
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
                "img": "/lib/entryjs/images/block_icon/start_03.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_keyboard.png",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            {
                "type": "Keyboard",
                "value": 81
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
                "img": "/lib/entryjs/images/block_icon/start_icon_mouse.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_mouse.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_mouse.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_mouse.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_keyboard.png",
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
                "img": "/lib/entryjs/images/block_icon/start_icon_signal.png",
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
                "fontSize": 11
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/start_03.png",
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
                "accept": "stringMagnet"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text"
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
                "accept": "stringMagnet"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text"
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
                "accept": "stringMagnet"
            }
        ],
        "events": {},
        "def": {
            "params": [
                {
                    "type": "text"
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
                "text": "변수 추가",
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
                "text": "리스트 추가",
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "fontSize": 11
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                    "params": [ "안녕!" ]
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
                "text": "대답",
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
                "accept": "stringMagnet"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "accept": "stringMagnet"
            },
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "number",
                    "params": [ "1" ]
                }
            ],
            "type": "value_of_index_from_list"
        },
        "paramsKeyMap": {
            "LIST": 0,
            "INDEX": 1
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [ null ],
            "type": "length_of_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var list = Entry.variableContainer.getList(listId);

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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {},
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
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
                "size": 12
            }
        ],
        "events": {},
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
                    [ "보이기", "SHOW" ],
                    [ "숨기기", "HIDE" ]
                ],
                "value": "SHOW",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/variable_03.png",
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
        "isNotFor": [ "" ],
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
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "lists",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [ "10" ]
                }
            ],
            "type": "is_included_in_list",
            "id": "otu1"
        },
        "paramsKeyMap": {
            "LIST": 0,
            "DATA": 1
        },
        "class": "list",
        "isNotFor": [ "list", "listNotExist" ],
        "func": function (sprite, script) {
            var listId = script.getField("LIST", script);
            var data = script.getStringValue("DATA", script);
            var list = Entry.variableContainer.getList(listId);
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
                    [ "D2", "D2" ],
                    [ "D3", "D3" ],
                    [ "D11", "D11" ]
                ],
                "value": "D2",
                "fontSize": 11
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
        "func": function (b, a) {
            var c = Entry.hw.portData, d = a.getField("DEVICE");
            return c[d];
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
                    [ "광 센서", "light" ],
                    [ "마이크 센서", "mic" ],
                    [ "아날로그 0번 핀", "adc0" ],
                    [ "아날로그 1번 핀", "adc1" ],
                    [ "아날로그 2번 핀", "adc2" ],
                    [ "아날로그 3번 핀", "adc3" ]
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
        "func": function (b, a) {
            var c = Entry.hw.portData, d = a.getField("DEVICE");
            return c[d];
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
                    [ "높음", "HIGH" ],
                    [ "낮음", "LOW" ]
                ],
                "value": "HIGH",
                "fontSize": 11
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getStringField("DEVICE", a), e = a.getStringField("VALUE", a);
            c.D13 = "D13" == d && "HIGH" == e ? 1 : 0;
            c.D4 = "D4" == d && "HIGH" == e ? 1 : 0;
            c.D7 = "D7" == d && "HIGH" == e ? 1 : 0;
            c.D12 = "D12" == d && "HIGH" == e ? 1 : 0;
            return a.callReturn();
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getStringField("DEVICE", a), e = a.getNumberValue("VALUE", a);
            "analogD5" == d ? c.analogD5 = e : "analogD6" == d && (c.analogD6 = e);
            return a.callReturn();
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
                    [ "머리(D8)", "head" ],
                    [ "오른 팔(D9)", "right" ],
                    [ "왼 팔(D10)", "left" ]
                ],
                "value": "head",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
            "type": "xbot_servo",
            "id": "bcuz"
        },
        "paramsKeyMap": {
            "DEVICE": 0,
            "VALUE": 1
        },
        "class": "xbot_motor",
        "isNotFor": [ "xbot_epor_edge" ],
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getStringField("DEVICE", a), e = a.getNumberValue("VALUE", a);
            "head" == d ? c.head = e : "right" == d ? c.armR = e : "left" == d && (c.armL = e);
            return a.callReturn();
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
                    [ "오른쪽", "rightWheel" ],
                    [ "왼쪽", "leftWheel" ],
                    [ "양쪽", "bothWheel" ]
                ],
                "value": "rightWheel",
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getStringField("DEVICE", a), e = a.getNumberValue("VALUE", a);
            "rightWheel" == d ? c.rightWheel = e : "leftWheel" == d ? c.leftWheel = e : c.rightWheel = c.leftWheel = e;
            return a.callReturn();
        }
    },
    "xbot_twoWheel": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue;
            c.rightWheel = a.getNumberValue("rightWheel");
            c.leftWheel = a.getNumberValue("leftWheel");
            return a.callReturn();
        }
    },
    "xbot_rgb": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue;
            c.ledR = a.getNumberValue("ledR");
            c.ledG = a.getNumberValue("ledG");
            c.ledB = a.getNumberValue("ledB");
            return a.callReturn();
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
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = a.getStringField("VALUE"), d = Entry.hw.sendQueue;
            d.ledR = parseInt(.3 * parseInt(c.substr(1, 2), 16));
            d.ledG = parseInt(.3 * parseInt(c.substr(3, 2), 16));
            d.ledB = parseInt(.3 * parseInt(c.substr(5, 2), 16));
            return a.callReturn();
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
                    [ "도", "C" ],
                    [ "레", "D" ],
                    [ "미", "E" ],
                    [ "파", "F" ],
                    [ "솔", "G" ],
                    [ "라", "A" ],
                    [ "시", "B" ]
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
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getStringField("NOTE", a), e = a.getStringField("OCTAVE", a), f = a.getNumberValue("VALUE", a), d = d + e;
            c.note = "C2" == d ? 65 : "D2" == d ? 73 : "E2" == d ? 82 : "F2" == d ? 87 : "G2" == d ? 98 : "A2" == d ? 110 : "B2" == d ? 123 : "C3" == d ? 131 : "D3" == d ? 147 : "E3" == d ? 165 : "F3" == d ? 175 : "G3" == d ? 196 : "A3" == d ? 220 : "B3" == d ? 247 : "C4" == d ? 262 : "D4" == d ? 294 : "E4" == d ? 330 : "F4" == d ? 349 : "G4" == d ? 392 : "A4" == d ? 440 : "B4" == d ? 494 : "C5" == d ? 523 : "D5" == d ? 587 : "E5" == d ? 659 : "F5" == d ? 698 : "G5" == d ? 784 : "A5" == d ? 880 : "B5" == d ?
                988 : "C6" == d ? 1047 : "D6" == d ? 1175 : "E6" == d ? 1319 : "F6" == d ? 1397 : "G6" == d ? 1568 : "A6" == d ? 1760 : "B6" == d ? 1976 : "C7" == d ? 2093 : "D7" == d ? 2349 : "E7" == d ? 2637 : "F7" == d ? 2794 : "G7" == d ? 3136 : "A7" == d ? 3520 : "B7" == d ? 3951 : 262;
                c.duration = 40 * f;
                return a.callReturn();
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
                "fontSize": 11
            },
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/hardware_03.png",
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
        "func": function (b, a) {
            var c = Entry.hw.sendQueue, d = a.getNumberField("LINE", a), e = a.getStringValue("VALUE", a);
            0 == d ? (c.lcdNum = 0, c.lcdTxt = e) : 1 == d && (c.lcdNum = 1, c.lcdTxt = e);
            return a.callReturn();
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
                "img": "/img/assets/ntry/bitmap/jr/block_play_image.png",
                "highlightColor": "#3BBD70",
                "position": {
                    "x": 0,
                    "y": 0
                },
                "size": 22
            }
        ]
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
        "statements": []
    },
    "jr_item": {
        "skeleton": "pebble_basic",
        "color": "#F46C6C",
        "params": [
            {
                "type": "Indicator",
                "img": "/img/assets/ntry/bitmap/jr/block_item_image.png",
                "highlightColor": "#FFF",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
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
                "img": "/img/assets/ntry/bitmap/cpartyjr/pen.png",
                "highlightColor": "#FFF",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
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
                "img": "/img/assets/ntry/bitmap/jr/block_up_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
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
                "img": "/img/assets/ntry/bitmap/jr/block_right_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
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
                "img": "/img/assets/ntry/bitmap/jr/block_down_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
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
                "img": "/img/assets/ntry/bitmap/jr/block_left_image.png",
                "position": {
                    "x": 83,
                    "y": 0
                },
                "size": 22
            }
        ]
    },
    "jr_start_basic": {
        "skeleton": "basic_event",
        "event": "start",
        "color": "#3BBD70",
        "params": [
            {
                "type": "Indicator",
                "boxMultiplier": 2,
                "img": "/img/assets/block_icon/start_icon_play.png",
                "highlightColor": "#3BBD70",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            },
            "시작하기를 클릭했을때"
        ]
    },
    "jr_go_straight": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            "앞으로 가기",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/cparty_go_straight.png",
                "size": 24
            }
        ]
    },
    "jr_turn_left": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            "왼쪽으로 돌기",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/cparty_rotate_l.png",
                "size": 24
            }
        ]
    },
    "jr_turn_right": {
        "skeleton": "basic",
        "color": "#A751E3",
        "params": [
            "오른쪽으로 돌기",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/cparty_rotate_r.png",
                "size": 24
            }
        ]
    },
    "jr_go_slow": {
        "skeleton": "basic",
        "color": "#f46c6c",
        "params": [
            "천천히 가기",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/cparty_go_slow.png",
                "size": 24
            }
        ]
    },
    "jr_repeat_until_dest": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "syntax": [
            "BasicWhile",
            "true"
        ],
        "params": [
            "",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/jr_goal_image.png",
                "size": 18
            },
            "만날 때 까지 반복하기",
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
        ]
    },
    "jr_if_construction": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "params": [
            "만약",
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/jr_construction_image.png",
                "size": 18
            },
            "앞에 있다면",
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
        ]
    },
    "jr_if_speed": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/jr_speed_image.png",
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
        ]
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
                "img": "/img/assets/block_icon/start_icon_play.png",
                "highlightColor": "#3BBD70",
                "size": 17,
                "position": {
                    "x": 0,
                    "y": -2
                }
            }
        ]
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
        "syntax": [
            "Scope",
            "jump"
        ]
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
                    [
                        1,
                        1
                    ],
                    [
                        2,
                        2
                    ],
                    [
                        3,
                        3
                    ],
                    [
                        4,
                        4
                    ],
                    [
                        5,
                        5
                    ],
                    [
                        6,
                        6
                    ],
                    [
                        7,
                        7
                    ],
                    [
                        8,
                        8
                    ],
                    [
                        9,
                        9
                    ],
                    [
                        10,
                        10
                    ]
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
        ]
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
        ]
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
        ]
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
        ]
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
                "img": "/img/assets/ntry/bitmap/maze2/obstacle_01.png",
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        "class": "arduino_value"
    },
    "dplay_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "dplay"
        ],
        "class": "arduino_value"
    },
    "dplay_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "dplay"
        ],
        "class": "arduino_set"
    },
    "dplay_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "dplay"
        ],
        "class": "arduino_set"
    },
    "dplay_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "dplay"
        ],
        "class": "arduino"
    },
    "nemoino_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "nemoino"
        ],
        "class": "arduino_value"
    },
    "nemoino_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "nemoino"
        ],
        "class": "arduino_value"
    },
    "nemoino_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "nemoino"
        ],
        "class": "arduino_set"
    },
    "nemoino_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "nemoino"
        ],
        "class": "arduino_set"
    },
    "nemoino_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "nemoino"
        ],
        "class": "arduino"
    },
    "sensorBoard_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "sensorBoard"
        ],
        "class": "arduino_value"
    },
    "sensorBoard_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "sensorBoard"
        ],
        "class": "arduino_value"
    },
    "sensorBoard_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "sensorBoard"
        ],
        "class": "arduino_set"
    },
    "sensorBoard_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "sensorBoard"
        ],
        "class": "arduino_set"
    },
    "sensorBoard_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "sensorBoard"
        ],
        "class": "arduino"
    },
    "CODEino_get_number_sensor_value": {
        "parent": "arduino_get_number_sensor_value",
        "isNotFor": [
            "CODEino"
        ],
        "class": "arduino_value"
    },
    "CODEino_get_digital_value": {
        "parent": "arduino_get_digital_value",
        "isNotFor": [
            "CODEino"
        ],
        "class": "arduino_value"
    },
    "CODEino_toggle_led": {
        "parent": "arduino_toggle_led",
        "isNotFor": [
            "CODEino"
        ],
        "class": "arduino_set"
    },
    "CODEino_toggle_pwm": {
        "parent": "arduino_toggle_pwm",
        "isNotFor": [
            "CODEino"
        ],
        "class": "arduino_set"
    },
    "CODEino_convert_scale": {
        "parent": "arduino_convert_scale",
        "isNotFor": [
            "CODEino"
        ],
        "class": "arduino"
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

