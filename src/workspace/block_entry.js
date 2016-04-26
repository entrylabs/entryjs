Entry.block = {
    "albert_move_forward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "앞으로 이동하기 %1",
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
            "type": "albert_move_forward"
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        func: "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        sq.leftWheel = 30;newLine        sq.rightWheel = 30;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_move_backward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "뒤로 이동하기 %1",
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
            "type": "albert_move_backward"
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = -30;newLine        sq.rightWheel = -30;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_turn_around": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 으로 돌기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "albert_turn_around"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var direction = script.getField(\"DIRECTION\", script);newLine        var isLeft = direction == 'LEFT';newLine        script.leftValue = isLeft ? -30 : 30;newLine        script.rightValue = isLeft ? 30 : -30;newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = script.leftValue;newLine        sq.rightWheel = script.rightValue;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.leftValue;newLine        delete script.rightValue;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_set_led_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 으로 정하기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빨간색",
                        "4"
                    ],
                    [
                        "노란색",
                        "6"
                    ],
                    [
                        "초록색",
                        "2"
                    ],
                    [
                        "하늘색",
                        "3"
                    ],
                    [
                        "파란색",
                        "1"
                    ],
                    [
                        "보라색",
                        "5"
                    ],
                    [
                        "하얀색",
                        "7"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "albert_set_led_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "COLOR": 1
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"DIRECTION\", script);newLine    var color = Number(script.getField(\"COLOR\", script));newLine    if (direction == 'FRONT') {newLine        sq.leftEye = color;newLine        sq.rightEye = color;newLine    } else if (direction == 'LEFT')newLine        sq.leftEye = color;newLine    elsenewLine        sq.rightEye = color;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_clear_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "albert_clear_led"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"DIRECTION\", script);newLine    if (direction == 'FRONT') {newLine        sq.leftEye = 0;newLine        sq.rightEye = 0;newLine    } else if (direction == 'LEFT') sq.leftEye = 0;newLine    else sq.rightEye = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_body_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "몸통 LED %1 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "켜기",
                        "ON"
                    ],
                    [
                        "끄기",
                        "OFF"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "albert_body_led"
        },
        "paramsKeyMap": {
            "STATE": 0
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"STATE\", script);newLine    if (direction == 'ON')newLine        sq.bodyLed = 1;newLine    else sq.bodyLed = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_front_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "앞쪽 LED %1 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "켜기",
                        "ON"
                    ],
                    [
                        "끄기",
                        "OFF"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "albert_front_led"
        },
        "paramsKeyMap": {
            "STATE": 0
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"STATE\", script);newLine    if (direction == 'ON')newLine        sq.frontLed = 1;newLine    else sq.frontLed = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_beep": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "삐 소리내기 %1",
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
            "type": "albert_beep"
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        delete sq.note;newLine        sq.buzzer = 440;newLine        var timeValue = 0.2 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.buzzer = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_hand_found": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "손 찾음?",
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "albert_hand_found"
        },
        "class": "albert_novice",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var pd = Entry.hw.portData;newLine    return pd.leftProximity > 40 ||newLine        pd.rightProximity > 40;newLine}_dummy"
    },
    "albert_move_forward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "앞으로 %1 초 이동하기 %2",
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
            "type": "albert_move_forward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = 30;newLine        sq.rightWheel = 30;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_move_backward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "뒤로 %1 초 이동하기 %2",
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
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = -30;newLine        sq.rightWheel = -30;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_turn_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 으로 %2 초 돌기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ]
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
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "albert_turn_for_secs"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var direction = script.getField(\"DIRECTION\", script);newLine        var isLeft = direction == 'LEFT';newLine        script.leftValue = isLeft ? -30 : 30;newLine        script.rightValue = isLeft ? 30 : -30;newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = script.leftValue;newLine        sq.rightWheel = script.rightValue;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.leftValue;newLine        delete script.rightValue;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 음을 %3 박자 연주하기 %4",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "도",
                        "4"
                    ],
                    [
                        "도#",
                        "5"
                    ],
                    [
                        "레",
                        "6"
                    ],
                    [
                        "미b",
                        "7"
                    ],
                    [
                        "미",
                        "8"
                    ],
                    [
                        "파",
                        "9"
                    ],
                    [
                        "파#",
                        "10"
                    ],
                    [
                        "솔",
                        "11"
                    ],
                    [
                        "솔#",
                        "12"
                    ],
                    [
                        "라",
                        "13"
                    ],
                    [
                        "시b",
                        "14"
                    ],
                    [
                        "시",
                        "15"
                    ]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "1",
                        "1"
                    ],
                    [
                        "2",
                        "2"
                    ],
                    [
                        "3",
                        "3"
                    ],
                    [
                        "4",
                        "4"
                    ],
                    [
                        "5",
                        "5"
                    ],
                    [
                        "6",
                        "6"
                    ],
                    [
                        "7",
                        "7"
                    ]
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
                    "params": [
                        "0.5"
                    ]
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
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var note = script.getNumberField(\"NOTE\", script);newLine        var octave = script.getNumberField(\"OCTAVE\", script);newLine        var beat = script.getNumberValue(\"VALUE\", script);newLine        var tempo = Entry.Albert.tempo;newLine        note += (octave-1)*12;newLine        var timeValue = beat*60*1000/tempo;newLine        script.note = note;newLinenewLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        if (timeValue > 100) {newLine            setTimeout(function() {newLine                sq.note = 0;newLine            }, timeValue-100);newLine        }newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.note = script.note;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.note;newLine        Entry.engine.isContinue = false;newLine        sq.note = 0;newLine        return script.callReturn();newLine    }newLinenewLine}_dummy"
    },
    "albert_rest_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 박자 쉬기 %2",
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
                        "0.25"
                    ]
                },
                null
            ],
            "type": "albert_rest_for"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue('VALUE');newLine        timeValue = timeValue*60*1000/Entry.Albert.tempo;newLine        sq.note = 0;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.timeFlag;newLine        Entry.engine.isContinue = false;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "albert_change_tempo_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "연주 속도를 %1 만큼 바꾸기 %2",
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
                        "20"
                    ]
                },
                null
            ],
            "type": "albert_change_tempo_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.Albert.tempo += script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_set_tempo_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "연주 속도를 %1 BPM으로 정하기 %2",
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
                        "60"
                    ]
                },
                null
            ],
            "type": "albert_set_tempo_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.Albert.tempo = script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_change_both_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3",
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
                    "params": [
                        "10"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "albert_change_both_wheels_by"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var pd = Entry.hw.portData;newLine    var left = sq.leftWheel != undefined ?newLine        sq.leftWheel : pd.leftWheel;newLine    var right = sq.rightWheel != undefined ?newLine        sq.rightWheel : pd.rightWheel;newLinenewLine    left += script.getNumberValue('LEFT');newLine    right += script.getNumberValue('RIGHT');newLinenewLine    sq.leftWheel = left;newLine    sq.rightWheel = right;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_set_both_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3",
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
                    "params": [
                        "30"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "30"
                    ]
                },
                null
            ],
            "type": "albert_set_both_wheels_to"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    sq.leftWheel = script.getNumberValue('LEFT');newLine    sq.rightWheel = script.getNumberValue('RIGHT');newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_change_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "albert_change_wheels_by"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var pd = Entry.hw.portData;newLine    var direction = script.getField('DIRECTION');newLine    var value = script.getNumberValue('VALUE');newLinenewLine    if (direction == 'LEFT') {newLine        sq.leftWheel = sq.leftWheel != undefined ?newLine            sq.leftWheel + value : pd.leftWheel + value;newLine    } else if (direction == 'RIGHT')newLine        sq.rightWheel = sq.rightWheel != undefined ?newLine            sq.rightWheel + value : pd.rightWheel + value;newLine    else {newLine        sq.leftWheel = sq.leftWheel != undefined ?newLine            sq.leftWheel + value : pd.leftWheel + value;newLine        sq.rightWheel = sq.rightWheel != undefined ?newLine            sq.rightWheel + value : pd.rightWheel + value;newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_set_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
                    "params": [
                        "30"
                    ]
                },
                null
            ],
            "type": "albert_set_wheels_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField('DIRECTION');newLine    var value = script.getNumberValue('VALUE');newLinenewLine    if (direction == 'LEFT') sq.leftWheel = value;newLine    else if (direction == 'RIGHT') sq.rightWheel = value;newLine    else {newLine        sq.leftWheel = value;newLine        sq.rightWheel = value;newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_stop": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "정지하기 %1",
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
            "type": "albert_stop"
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    sq.leftWheel = 0;newLine    sq.rightWheel = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "albert_change_buzzer_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 음을 %1 만큼 바꾸기 %2",
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
                        "10"
                    ]
                },
                null
            ],
            "type": "albert_change_buzzer_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var hw = Entry.hw,newLine        sq = hw.sendQueue,newLine        pd = hw.portData;newLine        value = script.getNumberValue('VALUE');newLine    delete sq.note;newLine    sq.buzzer = sq.buzzer == undefined ?newLine        value : sq.buzzer + value;newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_set_buzzer_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 음을 %1 (으)로 정하기 %2",
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
                        "1000"
                    ]
                },
                null
            ],
            "type": "albert_set_buzzer_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    delete sq.note;newLine    sq.buzzer = script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_clear_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 끄기 %1",
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
            "type": "albert_clear_buzzer"
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.hw.sendQueue.buzzer = 0;newLine    return script.callReturn();newLine}_dummy"
    },
    "albert_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽 근접 센서",
                        "leftProximity"
                    ],
                    [
                        "오른쪽 근접 센서",
                        "rightProximity"
                    ],
                    [
                        "밝기",
                        "light"
                    ],
                    [
                        "oid",
                        "oid"
                    ]
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
            "PORT": 0
        },
        "class": "rank",
        "isNotFor": [
            "albert"
        ],
        "func": "dummy_function (sprite, script) {newLine    var hw = Entry.hw,newLine        sq = hw.sendQueue,newLine        pd = hw.portData,newLine        port = script.getField('PORT');newLinenewLine    return sq[port] != undefined ?newLine        sq[port] : pd[port]newLine}_dummy"
    },
    "arduino_text": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
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
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"NAME\");newLine}_dummy"
    },
    "arduino_send": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "신호 %1 보내기",
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
        "func": "dummy_function (sprite, script) {newLine    var signal = script.getValue(\"VALUE\", script);newLine    var xmlHttp = new XMLHttpRequest();newLine    xmlHttp.open( \"POST\", 'http://localhost:23518/arduino/', false );newLine    xmlHttp.send(String(signal));newLine    Entry.assert(xmlHttp.status == 200, \"arduino is not connected\");newLine    return script.callReturn();newLine}_dummy"
    },
    "arduino_get_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "신호 %1 의 숫자 결과값",
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
        "func": "dummy_function (sprite, script) {newLine    var signal = script.getValue(\"VALUE\", script);newLine    var xmlHttp = new XMLHttpRequest();newLine    xmlHttp.open( \"POST\", 'http://localhost:23518/arduino/', false );newLine    xmlHttp.send(String(signal));newLine    Entry.assert(xmlHttp.status == 200, \"arduino is not connected\");newLine    var data = xmlHttp.responseText;newLine    return Number(data);newLine}_dummy"
    },
    "arduino_get_string": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "신호 %1 의 글자 결과값",
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
        "func": "dummy_function (sprite, script) {newLine    var signal = script.getValue(\"VALUE\", script);newLine    var xmlHttp = new XMLHttpRequest();newLine    xmlHttp.open( \"POST\", 'http://localhost:23518/arduino/', false );newLine    xmlHttp.send(String(signal));newLine    Entry.assert(xmlHttp.status == 200, \"arduino is not connected\");newLine    var data = xmlHttp.responseText;newLine    return data;newLine}_dummy"
    },
    "arduino_get_sensor_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "0",
                        "A0"
                    ],
                    [
                        "1",
                        "A1"
                    ],
                    [
                        "2",
                        "A2"
                    ],
                    [
                        "3",
                        "A3"
                    ],
                    [
                        "4",
                        "A4"
                    ],
                    [
                        "5",
                        "A5"
                    ]
                ],
                "value": "A0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"PORT\");newLine}_dummy"
    },
    "arduino_get_port_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "0",
                        "0"
                    ],
                    [
                        "1",
                        "1"
                    ],
                    [
                        "2",
                        "2"
                    ],
                    [
                        "3",
                        "3"
                    ],
                    [
                        "4",
                        "4"
                    ],
                    [
                        "5",
                        "5"
                    ],
                    [
                        "6",
                        "6"
                    ],
                    [
                        "7",
                        "7"
                    ],
                    [
                        "8",
                        "8"
                    ],
                    [
                        "9",
                        "9"
                    ],
                    [
                        "10",
                        "10"
                    ],
                    [
                        "11",
                        "11"
                    ],
                    [
                        "12",
                        "12"
                    ],
                    [
                        "13",
                        "13"
                    ]
                ],
                "value": "0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"PORT\");newLine}_dummy"
    },
    "arduino_get_pwm_port_number": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "3",
                        "3"
                    ],
                    [
                        "5",
                        "5"
                    ],
                    [
                        "6",
                        "6"
                    ],
                    [
                        "9",
                        "9"
                    ],
                    [
                        "10",
                        "10"
                    ],
                    [
                        "11",
                        "11"
                    ]
                ],
                "value": "3",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"PORT\");newLine}_dummy"
    },
    "arduino_get_number_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "아날로그 %1 번 센서값",
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
        "isNotFor": [
            "arduino"
        ],
        "func": "dummy_function (sprite, script) {newLine    var signal = script.getValue(\"VALUE\", script);newLine    return Entry.hw.getAnalogPortValue(signal[1]);newLine}_dummy"
    },
    "arduino_get_digital_value": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "디지털 %1 번 센서값",
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
        "isNotFor": [
            "arduino"
        ],
        "func": "dummy_function (sprite, script) {newLine    var signal = script.getNumberValue(\"VALUE\", script);newLine    return Entry.hw.getDigitalPortValue(signal);newLine}_dummy"
    },
    "arduino_toggle_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "디지털 %1 번 핀 %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "켜기",
                        "on"
                    ],
                    [
                        "끄기",
                        "off"
                    ]
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
        "isNotFor": [
            "arduino"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getNumberValue(\"VALUE\");newLine    var operator = script.getField(\"OPERATOR\");newLine    var value = operator == \"on\" ? 255 : 0;newLine    Entry.hw.setDigitalPortValue(port, value);newLine    return script.callReturn();newLine}_dummy"
    },
    "arduino_toggle_pwm": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "디지털 %1 번 핀을 %2 (으)로 정하기 %3",
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
                    "params": [
                        "255"
                    ]
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
        "isNotFor": [
            "arduino"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getNumberValue(\"PORT\");newLine    var value = script.getNumberValue(\"VALUE\");newLine    value = Math.round(value);newLine    value = Math.max(value, 0);newLine    value = Math.min(value, 255);newLine    Entry.hw.setDigitalPortValue(port, value);newLine    return script.callReturn();newLine}_dummy"
    },
    "arduino_convert_scale": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값",
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
                            "type": "arduino_get_sensor_number"
                        }
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "0"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "1023"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "0"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "arduino"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value1 = script.getNumberValue(\"VALUE1\", script);newLine    var value2 = script.getNumberValue(\"VALUE2\", script);newLine    var value3 = script.getNumberValue(\"VALUE3\", script);newLine    var value4 = script.getNumberValue(\"VALUE4\", script);newLine    var value5 = script.getNumberValue(\"VALUE5\", script);newLine    var result = value1;newLine    if (value2 > value3) {newLine        var swap = value2;newLine        value2 = value3;newLine        value3 = swap;newLine    }newLine    if (value4 > value5) {newLine        var swap = value4;newLine        value4 = value5;newLine        value5 = swap;newLine    }newLine    result -= value2;newLine    result = result * ((value5 - value4) / (value3 - value2));newLine    result += value4;newLine    result = Math.min(value5, result);newLine    result = Math.max(value4, result);newLine    return Math.round(result);newLine}_dummy"
    },
    "sensorBoard_get_named_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  센서값",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "소리",
                        "0"
                    ],
                    [
                        "빛 감지",
                        "1"
                    ],
                    [
                        "슬라이더",
                        "2"
                    ],
                    [
                        "온도",
                        "3"
                    ]
                ],
                "value": "0",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "sensorBoard_get_named_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "sensorBoard",
        "isNotFor": [
            "sensorBoard"
        ],
        "func": "dummy_function (sprite, script) {newLine    return Entry.hw.getAnalogPortValue(script.getField(\"PORT\", script));newLine}_dummy"
    },
    "sensorBoard_is_button_pressed": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1  버튼을 눌렀는가?",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빨간",
                        "8"
                    ],
                    [
                        "파란",
                        "9"
                    ],
                    [
                        "노란",
                        "10"
                    ],
                    [
                        "초록",
                        "11"
                    ]
                ],
                "value": "8",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "sensorBoard_is_button_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "sensorBoard",
        "isNotFor": [
            "sensorBoard"
        ],
        "func": "dummy_function (sprite, script) {newLine    return Entry.hw.getDigitalPortValue(script.getNumberField(\"PORT\", script));newLine}_dummy"
    },
    "sensorBoard_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1  LED %2   %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빨간",
                        "2"
                    ],
                    [
                        "초록",
                        "3"
                    ],
                    [
                        "파란",
                        "4"
                    ],
                    [
                        "흰색",
                        "5"
                    ]
                ],
                "value": "2",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "켜기",
                        "255"
                    ],
                    [
                        "끄기",
                        "0"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "sensorBoard_led"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "OPERATOR": 1
        },
        "class": "sensorBoard",
        "isNotFor": [
            "sensorBoard"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.hw.setDigitalPortValue(script.getField(\"PORT\"),newLine                                 script.getNumberField(\"OPERATOR\"));newLine    return script.callReturn();newLine}_dummy"
    },
    "arduino_download_connector": {
        "skeleton": "basic_button",
        "color": "#eee",
        "template": "%1",
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
        "template": "%1",
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
        "template": "%1",
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
        "template": "%1",
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
    "bitbrick_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  값",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "bitbrick_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine  var port = script.getStringField(\"PORT\");newLine  console.log(port);newLine  console.log(Entry.hw.portData[port]);newLine  return Entry.hw.portData[port].value;newLine}_dummy"
    },
    "bitbrick_is_touch_pressed": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "터치센서 %1  가 눌렸는가?",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "bitbrick_is_touch_pressed"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine  return Entry.hw.portData[script.getStringField(\"PORT\")].value === 0;newLine}_dummy"
    },
    "bitbrick_turn_off_color_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "컬러 LED 끄기 %1",
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
            "type": "bitbrick_turn_off_color_led"
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine  Entry.hw.sendQueue[\"LEDR\"] = 0;newLine  Entry.hw.sendQueue[\"LEDG\"] = 0;newLine  Entry.hw.sendQueue[\"LEDB\"] = 0;newLine  return script.callReturn();newLine}_dummy"
    },
    "bitbrick_turn_on_color_led_by_rgb": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "컬러 LED 켜기 R %1 G %2 B %3 %4",
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
                    "params": [
                        "255"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "255"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "255"
                    ]
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
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var red = script.getNumberValue(\"rValue\"),newLine        green = script.getNumberValue(\"gValue\"),newLine        blue = script.getNumberValue(\"bValue\"),newLine        min = 0,newLine        max = 255,newLine        adjustor = Entry.adjustValueWithMaxMin,newLine        sq = Entry.hw.sendQueue;newLinenewLine    sq[\"LEDR\"] = adjustor(red, min, max);newLine    sq[\"LEDG\"] = adjustor(green, min, max);newLine    sq[\"LEDB\"] = adjustor(blue, min, max);newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_turn_on_color_led_by_picker": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "컬러 LED 색  %1 로 정하기 %2",
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
            "params": [
                null
            ],
            "type": "bitbrick_turn_on_color_led_by_picker"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getStringField(\"VALUE\");newLine    Entry.hw.sendQueue[\"LEDR\"] = parseInt(port.substr(1,2), 16);newLine    Entry.hw.sendQueue[\"LEDG\"] = parseInt(port.substr(3,2), 16);newLine    Entry.hw.sendQueue[\"LEDB\"] = parseInt(port.substr(5,2), 16);newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_turn_on_color_led_by_value": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "컬러 LED 켜기 색 %1 로 정하기 %2",
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
                        "0"
                    ]
                },
                null
            ],
            "type": "bitbrick_turn_on_color_led_by_value"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\");newLine    var red, green, blue;newLine    value = value % 200;newLine    if ( value < 67 ) {newLine        red = 200 - (value * 3);newLine        green = value * 3;newLine        blue = 0;newLine    } else if ( value < 134 ) {newLine        value = value - 67;newLine        red = 0;newLine        green = 200 - (value * 3);newLine        blue = value * 3;newLine    } else if ( value < 201 ) {newLine        value = value - 134;newLine        red = value * 3;newLine        green = 0;newLine        blue = 200 - (value * 3);newLine    }newLine    Entry.hw.sendQueue[\"LEDR\"] = red;newLine    Entry.hw.sendQueue[\"LEDG\"] = green;newLine    Entry.hw.sendQueue[\"LEDB\"] = blue;newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "부저음  %1 내기 %2",
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
                        "60"
                    ]
                },
                null
            ],
            "type": "bitbrick_buzzer"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var value = script.getNumberValue(\"VALUE\");newLine        Entry.hw.sendQueue[\"buzzer\"] = value;newLine        script.isStart = true;newLine        return script;newLine    } else {newLine        Entry.hw.sendQueue[\"buzzer\"] = 0;newLine        delete script.isStart;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "bitbrick_turn_off_all_motors": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "모든 모터 끄기 %1",
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
            "type": "bitbrick_turn_off_all_motors"
        },
        "class": "condition",
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var bitbrick = Entry.Bitbrick;newLine    bitbrick.servoList().map(function(servo){newLine        sq[servo[1]] = 0;newLine    });newLine    bitbrick.dcList().map(function(dc){newLine        sq[dc[1]] = 128;newLine    });newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_dc_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "DC 모터 %1  속도 %2 %3",
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
                    "params": [
                        "60"
                    ]
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
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\");newLine    value = Math.min(value, Entry.Bitbrick.dcMaxValue);newLine    value = Math.max(value, Entry.Bitbrick.dcMinValue);newLinenewLine    Entry.hw.sendQueue[script.getStringField(\"PORT\")] =newLine        value + 128;newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_dc_direction_speed": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "DC 모터 %1  방향 %2  속력 %3 %4",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "CCW",
                        "CCW"
                    ],
                    [
                        "CW",
                        "CW"
                    ]
                ],
                "value": "CCW",
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
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var isFront = script.getStringField(\"DIRECTION\") === \"CW\";newLine    var value = script.getNumberValue(\"VALUE\");newLine    value = Math.min(value, Entry.Bitbrick.dcMaxValue);newLine    value = Math.max(value, 0);newLinenewLine    Entry.hw.sendQueue[script.getStringField(\"PORT\")] =newLine        isFront ? value + 128 : 128 - value;newLine    return script.callReturn();newLine}_dummy"
    },
    "bitbrick_servomotor_angle": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "서보 모터 %1  각도 %2 %3",
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
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "bitbrick"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\") + 1;newLine    value = Math.min(value, Entry.Bitbrick.servoMaxValue);newLine    value = Math.max(value, Entry.Bitbrick.servoMinValue);newLine    Entry.hw.sendQueue[script.getStringField(\"PORT\")] = value;newLine    return script.callReturn();newLine}_dummy"
    },
    "start_drawing": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "그리기 시작하기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "start_drawing"
        },
        "class": "brush_control",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLinenewLine    if (sprite.brush)newLine        sprite.brush.stop = false;newLine    elsenewLine        Entry.setBasicBrush(sprite);newLinenewLine    Entry.stage.sortZorder();newLine    sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "stop_drawing": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "그리기 멈추기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "stop_drawing"
        },
        "class": "brush_control",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (sprite.brush && sprite.shape)newLine        sprite.brush.stop = true;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "set_color": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 색을 %1 (으)로 정하기 %2",
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
            "params": [
                null
            ],
            "type": "set_color"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_color",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var colour = script.getField(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        var rgb = Entry.hex2rgb(colour);newLine        sprite.brush.rgb = rgb;newLine        sprite.brush.endStroke();newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(sprite.brush.opacity/100)+\")\");newLinenewLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "set_random_color": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 색을 무작위로 정하기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "set_random_color"
        },
        "class": "brush_color",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        var rgb = Entry.generateRgb();newLine        sprite.brush.rgb = rgb;newLine        sprite.brush.endStroke();newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(sprite.brush.opacity/100)+\")\");newLinenewLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "change_thickness": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 굵기를 %1 만큼 바꾸기 %2",
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
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "change_thickness"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_thickness",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var thickness = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        sprite.brush.thickness += thickness;newLine        if (sprite.brush.thickness < 1)newLine            sprite.brush.thickness = 1;newLinenewLine        sprite.brush.setStrokeStyle(sprite.brush.thickness);newLinenewLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "set_thickness": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 굵기를 %1 (으)로 정하기 %2",
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
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "set_thickness"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_thickness",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var thickness = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        sprite.brush.thickness = thickness;newLine        sprite.brush.setStrokeStyle(sprite.brush.thickness);newLinenewLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "change_opacity": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 불투명도를 %1 % 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "change_opacity"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var opacity = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLine    opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity + opacity, 0, 100);newLinenewLine    if (sprite.brush) {newLine        sprite.brush.opacity = opacity;newLine        sprite.brush.endStroke();newLine        var rgb = sprite.brush.rgb;newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(sprite.brush.opacity/100)+\")\");newLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "set_opacity": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 불투명도를 %1 % 로 정하기 %2",
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
                    "params": [
                        "50"
                    ]
                },
                null
            ],
            "type": "set_opacity"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var opacity = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);newLine        sprite.brush.endStroke();newLine        var rgb = sprite.brush.rgb;newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(sprite.brush.opacity/100)+\")\");newLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLinenewLine}_dummy"
    },
    "brush_erase_all": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "모든 붓 지우기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "brush_erase_all"
        },
        "class": "brush_clear",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var brush = sprite.brush;newLine    if (brush) {newLine        var stroke = brush._stroke.style;newLine        var style = brush._strokeStyle.width;newLine        brush.clear().setStrokeStyle(style).beginStroke(stroke);newLine        brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    var stampEntities = sprite.parent.getStampEntities();newLine    stampEntities.map(function (entity) {newLine        entity.removeClone();newLine    });newLine    stampEntities = null;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "brush_stamp": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "도장찍기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/brush_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "brush_stamp"
        },
        "class": "stamp",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    sprite.parent.addStampEntity(sprite);newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "change_brush_transparency": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 투명도를 %1 % 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "change_brush_transparency"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var opacity = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLine    opacity = Entry.adjustValueWithMaxMin(sprite.brush.opacity - opacity, 0, 100);newLinenewLine    if (sprite.brush) {newLine        sprite.brush.opacity = opacity;newLine        sprite.brush.endStroke();newLine        var rgb = sprite.brush.rgb;newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(sprite.brush.opacity/100)+\")\");newLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "set_brush_tranparency": {
        "color": "#FF9E20",
        "skeleton": "basic",
        "statements": [],
        "template": "붓의 투명도를 %1 % 로 정하기 %2",
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
                    "params": [
                        "50"
                    ]
                },
                null
            ],
            "type": "set_brush_tranparency"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "brush_opacity",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var opacity = script.getNumberValue(\"VALUE\", script);newLinenewLine    if (!sprite.brush) {newLine        Entry.setBasicBrush(sprite);newLine        sprite.brush.stop = true;newLine    }newLinenewLine    if (sprite.brush) {newLine        sprite.brush.opacity = Entry.adjustValueWithMaxMin(opacity, 0, 100);newLine        sprite.brush.endStroke();newLine        var rgb = sprite.brush.rgb;newLine        sprite.brush.beginStroke(\"rgba(\"+rgb.r+\",\"+rgb.g+\",\"+rgb.b+\",\"+(1 - sprite.brush.opacity/100)+\")\");newLine        sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);newLine    }newLinenewLine    return script.callReturn();newLinenewLine}_dummy"
    },
    "number": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
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
        "func": "dummy_function (sprite, script) {newLine    return script.getField('NUM', script);newLine}_dummy",
        "isPrimitive": true
    },
    "angle": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Angle"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "ANGLE": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getNumberField(\"ANGLE\");newLine}_dummy"
    },
    "get_x_coordinate": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "X 좌푯값",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "get_x_coordinate"
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return sprite.getX();newLine}_dummy"
    },
    "get_y_coordinate": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "Y 좌푯값",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "get_y_coordinate"
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return sprite.getY();newLine}_dummy"
    },
    "get_angle": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "각도값",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return parseFloat(sprite.getRotation().toFixed(1));newLine}_dummy"
    },
    "get_rotation_direction": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "방향값",
                        "ROTATION"
                    ],
                    [
                        "이동 방향값",
                        "DIRECTION"
                    ]
                ],
                "value": "ROTATION",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "get_rotation_direction"
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var o = script.getField(\"OPERATOR\", script);newLine    if (o.toUpperCase() == 'DIRECTION')newLine        return parseFloat(sprite.getDirection().toFixed(1));newLine    elsenewLine        return parseFloat(sprite.getRotation().toFixed(1));newLine}_dummy"
    },
    "distance_something": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ],
            "type": "distance_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "calc_distance",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetId = script.getField(\"VALUE\", script);newLine    if (targetId == 'mouse') {newLine        var mousePos = Entry.stage.mouseCoordinate;newLine        return Math.sqrt(newLine                Math.pow(sprite.getX() - mousePos.x, 2) +newLine                Math.pow(sprite.getY() - mousePos.y, 2)newLine            );newLine    } else {newLine        var targetEntity = Entry.container.getEntity(targetId);newLine        return Math.sqrt(newLine                Math.pow(sprite.getX() - targetEntity.getX(), 2) +newLine                Math.pow(sprite.getY() - targetEntity.getY(), 2)newLine            );newLine    }newLine}_dummy"
    },
    "coordinate_mouse": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Text",
                "text": "마우스",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "x",
                        "x"
                    ],
                    [
                        "y",
                        "y"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "coordinate_mouse"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetCoordinate = script.getField(\"VALUE\", script);newLine    if (targetCoordinate === 'x') {newLine        return Number(Entry.stage.mouseCoordinate.x);newLine    } else {newLine        return Number(Entry.stage.mouseCoordinate.y);newLine    }newLine}_dummy"
    },
    "coordinate_object": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
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
                    [
                        "x 좌푯값",
                        "x"
                    ],
                    [
                        "y 좌푯값",
                        "y"
                    ],
                    [
                        "방향",
                        "rotation"
                    ],
                    [
                        "이동방향",
                        "direction"
                    ],
                    [
                        "크기",
                        "size"
                    ],
                    [
                        "모양 번호",
                        "picture_index"
                    ],
                    [
                        "모양 이름",
                        "picture_name"
                    ]
                ],
                "value": "x",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                null,
                null
            ],
            "type": "coordinate_object"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "COORDINATE": 2
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetId = script.getField(\"VALUE\", script);newLine    var targetEntity;newLine    if (targetId == 'self')newLine        targetEntity = sprite;newLine    elsenewLine        targetEntity = Entry.container.getEntity(targetId);newLinenewLine    var targetCoordinate = script.getField(\"COORDINATE\", script);newLine    switch(targetCoordinate) {newLine        case 'x':newLine            return targetEntity.getX();newLine        case 'y':newLine            return targetEntity.getY();newLine        case 'rotation':newLine            return targetEntity.getRotation();newLine        case 'direction':newLine            return targetEntity.getDirection();newLine        case 'picture_index':newLine            var object = targetEntity.parent;newLine            var pictures = object.pictures;newLine            return pictures.indexOf(targetEntity.picture) + 1;newLine        case 'size':newLine            return Number(targetEntity.getSize().toFixed(1));newLine        case 'picture_name':newLine            var object = targetEntity.parent;newLine            var pictures = object.pictures;newLine            var picture = pictures[pictures.indexOf(targetEntity.picture)];newLine            return picture.name;newLine    }newLine}_dummy"
    },
    "calc_basic": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "+",
                        "PLUS"
                    ],
                    [
                        "-",
                        "MINUS"
                    ],
                    [
                        "x",
                        "MULTI"
                    ],
                    [
                        "/",
                        "DIVIDE"
                    ]
                ],
                "value": "PLUS",
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
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
                },
                "PLUS",
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
                }
            ],
            "type": "calc_basic"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "class": "calc",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var operator = script.getField(\"OPERATOR\", script);newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    if (operator == \"PLUS\")newLine        return leftValue + rightValue;newLine    else if (operator == \"MINUS\")newLine        return leftValue - rightValue;newLine    else if (operator == \"MULTI\")newLine        return leftValue * rightValue;newLine    elsenewLine        return leftValue / rightValue;newLine}_dummy"
    },
    "calc_plus": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue + rightValue;newLine}_dummy"
    },
    "calc_minus": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue - rightValue;newLine}_dummy"
    },
    "calc_times": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue * rightValue;newLine}_dummy"
    },
    "calc_divide": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3",
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue / rightValue;newLine}_dummy"
    },
    "calc_mod": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue % rightValue;newLine}_dummy"
    },
    "calc_share": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return Math.floor(leftValue/rightValue);newLine}_dummy"
    },
    "calc_operation": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3  ",
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
                        "제곱",
                        "square"
                    ],
                    [
                        "루트",
                        "root"
                    ],
                    [
                        "사인값",
                        "sin"
                    ],
                    [
                        "코사인값",
                        "cos"
                    ],
                    [
                        "탄젠트값",
                        "tan"
                    ],
                    [
                        "아크사인값",
                        "asin_radian"
                    ],
                    [
                        "아크코사인값",
                        "acos_radian"
                    ],
                    [
                        "아크탄젠트값",
                        "atan_radian"
                    ],
                    [
                        "로그값",
                        "log"
                    ],
                    [
                        "자연로그값",
                        "ln"
                    ],
                    [
                        "소수점 부분",
                        "unnatural"
                    ],
                    [
                        "소수점 버림값",
                        "floor"
                    ],
                    [
                        "소수점 올림값",
                        "ceil"
                    ],
                    [
                        "반올림값",
                        "round"
                    ],
                    [
                        "펙토리얼값",
                        "factorial"
                    ],
                    [
                        "절댓값",
                        "abs"
                    ]
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"LEFTHAND\", script);newLine    var operator = script.getField(\"VALUE\", script);newLine    var xRangeCheckList = ['asin_radian', 'acos_radian'];newLine    if ((xRangeCheckList.indexOf(operator) > -1) &&newLine           (value > 1 || value < -1))newLine            throw new Error('x range exceeded');newLinenewLine    var needToConvertList = ['sin', 'cos', 'tan'];newLine    if (operator.indexOf('_'))newLine        operator = operator.split('_')[0];newLinenewLine    if (needToConvertList.indexOf(operator) > -1)newLine        value = Entry.toRadian(value);newLinenewLine    var returnVal = 0;newLine    switch(operator){newLine        case \"square\":newLine            returnVal = value * value;newLine            break;newLine        case \"factorial\":newLine            returnVal = Entry.factorial(value);newLine            break;newLine        case \"root\":newLine            returnVal = Math.sqrt(value);newLine            break;newLine        case \"log\":newLine            returnVal = Math.log(value) / Math.LN10;newLine            break;newLine        case \"ln\":newLine            returnVal = Math.log(value);newLine            break;newLine        case \"asin\":newLine        case \"acos\":newLine        case \"atan\":newLine            returnVal = Entry.toDegrees(Math[operator](value));newLine            break;newLine        case \"unnatural\":newLine            returnVal = value - Math.floor(value);newLine            if (value < 0)newLine                returnVal = 1 - returnVal;newLine            break;newLine        default:newLine            returnVal = Math[operator](value);newLine    }newLine    return Math.round(returnVal*1000)/1000;newLine}_dummy"
    },
    "calc_rand": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "0"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getStringValue(\"LEFTHAND\", script);newLine    var rightValue = script.getStringValue(\"RIGHTHAND\", script);newLine    var left = Math.min(leftValue, rightValue);newLine    var right = Math.max(leftValue, rightValue);newLine    var isLeftFloat = Entry.isFloat(leftValue);newLine    var isRightFloat = Entry.isFloat(rightValue);newLine    if (isRightFloat || isLeftFloat)newLine        return  (Math.random() * (right - left) + left).toFixed(2);newLine    elsenewLine        return  Math.floor((Math.random() * (right - left +1) + left));newLine}_dummy"
    },
    "get_date": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2  ",
        "params": [
            {
                "type": "Text",
                "text": "현재",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "연도",
                        "YEAR"
                    ],
                    [
                        "월",
                        "MONTH"
                    ],
                    [
                        "일",
                        "DAY"
                    ],
                    [
                        "시각(시)",
                        "HOUR"
                    ],
                    [
                        "시각(분)",
                        "MINUTE"
                    ],
                    [
                        "시각(초)",
                        "SECOND"
                    ]
                ],
                "value": "YEAR",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null,
                "YEAR"
            ],
            "type": "get_date"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "calc_date",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var operator = script.getField(\"VALUE\", script);newLine    var dateTime = new Date();newLine    if (operator == \"YEAR\")newLine        return dateTime.getFullYear();newLine    else if (operator == \"MONTH\")newLine        return dateTime.getMonth()+1;newLine    else if (operator == \"DAY\")newLine        return dateTime.getDate();newLine    else if (operator == \"HOUR\")newLine        return dateTime.getHours();newLine    else if (operator == \"MINUTE\")newLine        return dateTime.getMinutes();newLine    elsenewLine        return dateTime.getSeconds();newLine}_dummy"
    },
    "get_sound_duration": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ],
            "type": "get_sound_duration"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "calc_duration",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getField(\"VALUE\", script);newLine    var soundsArr = sprite.parent.sounds;newLinenewLine    for (var i = 0; i < soundsArr.length; i++) {newLine        if (soundsArr[i].id == soundId)newLine            return soundsArr[i].duration;newLine    }newLine}_dummy"
    },
    "reset_project_timer": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "초시계 초기화",
                "color": "#3D3D3D"
            }
        ],
        "events": {
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null
            ],
            "type": "reset_project_timer"
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    Entry.engine.updateProjectTimer(0);newLine    return script.callReturn();newLine}_dummy"
    },
    "set_visible_project_timer": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Text",
                "text": "초시계",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "보이기",
                        "SHOW"
                    ],
                    [
                        "숨기기",
                        "HIDE"
                    ]
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                "HIDE",
                null
            ],
            "type": "set_visible_project_timer"
        },
        "paramsKeyMap": {
            "ACTION": 1
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var action = script.getField(\"ACTION\", script);newLine    var timer = Entry.engine.projectTimer;newLine    if (action == 'SHOW')newLine        timer.setVisible(true);newLine    elsenewLine        timer.setVisible(false);newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "timer_variable": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return Entry.container.inputValue.getValue();newLine}_dummy"
    },
    "get_project_timer_value": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "get_project_timer_value"
        },
        "class": "calc_timer",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return Entry.engine.projectTimer.getValue();newLine}_dummy"
    },
    "char_at": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "안녕, 엔트리!"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "1"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var str = script.getStringValue(\"LEFTHAND\", script);newLine    var index = script.getNumberValue(\"RIGHTHAND\", script)-1;newLine    if (index <0 || index >str.length-1)newLine        throw new Error();newLine    elsenewLine        return str[index];newLine}_dummy"
    },
    "length_of_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
                    "params": [
                        "엔트리"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    return script.getStringValue(\"STRING\", script).length;newLine}_dummy"
    },
    "substring": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4 %5 %6",
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
                    "params": [
                        "안녕, 엔트리!"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "2"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "5"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var str = script.getStringValue(\"STRING\", script);newLine    var start = script.getNumberValue(\"START\", script)-1;newLine    var end = script.getNumberValue(\"END\", script)-1;newLine    var strLen = str.length-1;newLine    if (start <0 || end<0 || start>strLen || end>strLen)newLine        throw new Error();newLine    elsenewLine        return str.substring(Math.min(start, end), Math.max(start, end)+1);newLine}_dummy"
    },
    "replace_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4 %5 %6",
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
                    "params": [
                        "안녕, 엔트리!"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "안녕"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "반가워"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    return script.getStringValue(\"STRING\", script).newLine        replace(newLine            new RegExp(script.getStringValue(\"OLD_WORD\", script), 'gm'),newLine            script.getStringValue(\"NEW_WORD\", script)newLine        );newLine}_dummy"
    },
    "change_string_case": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "안녕, 엔트리!"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    return script.getStringValue(\"STRING\", script)[script.getField(\"CASE\", script)]();newLine}_dummy"
    },
    "index_of_string": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "안녕, 엔트리!"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "엔트리"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var str = script.getStringValue(\"LEFTHAND\", script);newLine    var target = script.getStringValue(\"RIGHTHAND\", script);newLine    var index = str.indexOf(target);newLine    return index > -1?index+1:0;newLine}_dummy"
    },
    "combine_something": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4",
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
                    "params": [
                        "안녕!"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "엔트리"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getStringValue(\"VALUE1\", script);newLine    var rightValue = script.getStringValue(\"VALUE2\", script);newLinenewLine    if (!isNaN(leftValue))newLine        leftValue = Entry.convertToRoundedDecimals(leftValue, 3);newLine    if (!isNaN(rightValue))newLine        rightValue = Entry.convertToRoundedDecimals(rightValue, 3);newLine    return leftValue + rightValue;newLine}_dummy"
    },
    "get_sound_volume": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ],
            "type": "get_sound_volume"
        },
        "class": "calc",
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    return createjs.Sound.getVolume() * 100;newLine}_dummy"
    },
    "quotient_and_mod": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 %2 %3 %4 %5",
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
                    [
                        "몫",
                        "QUOTIENT"
                    ],
                    [
                        "나머지",
                        "MOD"
                    ]
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    var left = script.getNumberValue(\"LEFTHAND\", script);newLine    var right = script.getNumberValue(\"RIGHTHAND\", script);newLine    if (isNaN(left) || isNaN(right))newLine        throw new Error();newLine    var operator = script.getField(\"OPERATOR\", script);newLine    if (operator == 'QUOTIENT')newLine        return Math.floor(left/right);newLine    elsenewLine        return left % right;newLine}_dummy"
    },
    "choose_project_timer_action": {
        "color": "#FFD974",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Text",
                "text": "초시계",
                "color": "#3D3D3D"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "시작하기",
                        "START"
                    ],
                    [
                        "정지하기",
                        "STOP"
                    ],
                    [
                        "초기화하기",
                        "RESET"
                    ]
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
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
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    var action = script.getField('ACTION');newLine    var engine = Entry.engine;newLine    var timer = engine.projectTimer;newLinenewLine    if (action == 'START') {newLine        if (!timer.isInit) {newLine            engine.startProjectTimer();newLine        }newLine        else if (timer.isInit && timer.isPaused) {newLine            if (timer.pauseStart)newLine                timer.pausedTime += (new Date()).getTime() - timer.pauseStart;newLine            delete timer.pauseStart;newLine            timer.isPaused = false;newLine        }newLine    } else if (action == 'STOP') {newLine        if (timer.isInit && !timer.isPaused) {newLine            timer.isPaused = true;newLine            timer.pauseStart = (new Date()).getTime();newLine        }newLine    } else if (action == 'RESET') {newLine        if (timer.isInit) {newLine            timer.setValue(0);newLine            timer.start = (new Date()).getTime();newLine            timer.pausedTime = 0;newLine            delete timer.pauseStart;newLine        }newLinenewLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "wait_second": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 기다리기 %2",
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
                    "params": [
                        "2"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"SECOND\", script);newLine        var fps = Entry.FPS || 60;newLine        timeValue = 60/fps*timeValue*1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "repeat_basic": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "template": "%1 번 반복하기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var iterNumber;newLine    if (!script.isLooped) {newLine        script.isLooped = true;newLine        var iterNumber = script.getNumberValue(\"VALUE\", script);newLine        if(iterNumber < 0) throw new Error(Lang.Blocks.FLOW_repeat_basic_errorMsg);newLine        script.iterCount = Math.floor(iterNumber);newLine    }newLine    if (script.iterCount != 0 && !(script.iterCount < 0)) {newLine        script.iterCount--;newLine        return script.getStatement(\"DO\", script);newLine    } else {newLine        delete script.isLooped;newLine        delete script.iterCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "repeat_inf": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "template": "계속 반복하기 %1",
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
            "type": "repeat_inf"
        },
        "statementsKeyMap": {
            "DO": 0
        },
        "class": "repeat",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    //return script.getStatement(\"DO\", script);newLine    script.isLooped = true;newLine    return script.getStatement('DO');newLine}_dummy"
    },
    "stop_repeat": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "반복 중단하기 %1",
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
        "func": "dummy_function (sprite, script) {newLine    return this.executor.break();newLine}_dummy"
    },
    "wait_until_true": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 이(가) 될 때까지 기다리기 %2",
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getBooleanValue(\"BOOL\", script);newLine    if (value) {newLine        return script.callReturn();newLine    } else {newLine        return script;newLine    }newLine}_dummy"
    },
    "_if": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "template": "만일 %1 이라면 %2",
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
        "func": "dummy_function (sprite, script) {newLine    if (script.isLooped) {newLine        delete script.isLooped;newLine        return script.callReturn();newLine    }newLine    var value = script.getBooleanValue(\"BOOL\", script);newLine    if (value) {newLine        script.isLooped = true;newLine        return script.getStatement(\"STACK\", script);newLine    } else {newLine        return script.callReturn();newLine    }newLine}_dummy"
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
        "template": "만일 %1 이라면 %2 %3 아니면",
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
        "func": "dummy_function (sprite, script) {newLine    if (script.isLooped) {newLine        delete script.isLooped;newLine        return script.callReturn();newLine    }newLine    var value = script.getBooleanValue(\"BOOL\", script);newLine    script.isLooped = true;newLine    if (value)newLine        return script.getStatement(\"STACK_IF\", script);newLine    elsenewLine        return script.getStatement(\"STACK_ELSE\", script);newLine}_dummy"
    },
    "create_clone": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 의 복제본 만들기 %2",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "clone",
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
                null,
                null
            ],
            "type": "create_clone"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "clone",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetSpriteId = script.getField(\"VALUE\", script);newLine    var returnBlock = script.callReturn();newLine    if (targetSpriteId == \"self\")newLine        sprite.parent.addCloneEntity(sprite.parent, sprite, null);newLine    else {newLine        var object = Entry.container.getObject(targetSpriteId);newLine        object.addCloneEntity(sprite.parent, null, null);newLine    }newLine    return returnBlock;newLine}_dummy"
    },
    "delete_clone": {
        "color": "#498deb",
        "skeleton": "basic_without_next",
        "statements": [],
        "template": "이 복제본 삭제하기 %1",
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
            "type": "delete_clone"
        },
        "class": "clone",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    if (!sprite.isClone)newLine        return script.callReturn();newLine    sprite.removeClone();newLine    return;newLine}_dummy"
    },
    "when_clone_start": {
        "color": "#498deb",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 복제본이 처음 생성되었을때",
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
            "params": [
                null
            ],
            "type": "when_clone_start"
        },
        "class": "clone",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy",
        "event": "when_clone_start"
    },
    "stop_run": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "프로그램 끝내기 %1",
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
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return Entry.engine.toggleStop();newLine}_dummy"
    },
    "repeat_while_true": {
        "color": "#498deb",
        "skeleton": "basic_loop",
        "statements": [
            {
                "accept": "basic"
            }
        ],
        "template": "%1 %2  반복하기 %3",
        "params": [
            {
                "type": "Block",
                "accept": "booleanMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "이 될 때까지",
                        "until"
                    ],
                    [
                        "인 동안",
                        "while"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getBooleanValue(\"BOOL\", script);newLinenewLine    if (script.getField(\"OPTION\", script) == 'until')newLine        value = !value;newLine    script.isLooped = value;newLinenewLine    return value ? script.getStatement(\"DO\", script) :newLine        script.callReturn();newLine}_dummy"
    },
    "stop_object": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 멈추기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "모든",
                        "all"
                    ],
                    [
                        "자신의",
                        "thisOnly"
                    ],
                    [
                        "이",
                        "thisThread"
                    ],
                    [
                        "자신의 다른",
                        "otherThread"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "stop_object"
        },
        "paramsKeyMap": {
            "TARGET": 0
        },
        "class": "terminate",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var target = script.getField(\"TARGET\", script);newLine    var container = Entry.container;newLinenewLine    switch(target) {newLine        case 'all':newLine            container.mapEntityIncludeCloneOnScene(function (entity){newLine                entity.clearScript();newLine            });newLine            break;newLine        case 'thisObject':newLine            sprite.clearScript();newLine            var clonedEntities = sprite.parent.clonedEntities;newLine            clonedEntities.map(function (entity) {newLine                entity.clearScript();newLine            });newLine            break;newLine        case 'thisOnly':newLine            sprite.clearScript();newLine            break;newLine        case 'thisThread':newLine            break;newLine        case 'otherThread':newLine            sprite.clearScript();newLine            var clonedEntities = sprite.parent.clonedEntities;newLine            clonedEntities.map(function (entity) {newLine                entity.clearScript();newLine            });newLine            return script.callReturn();newLine    }newLine    return null;newLine}_dummy"
    },
    "restart_project": {
        "color": "#498deb",
        "skeleton": "basic_without_next",
        "statements": [],
        "template": "처음부터 다시 실행하기 %1",
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
            "type": "restart_project"
        },
        "class": "terminate",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    Entry.engine.toggleStop();newLine    Entry.engine.toggleRun();newLine}_dummy"
    },
    "remove_all_clones": {
        "color": "#498deb",
        "skeleton": "basic",
        "statements": [],
        "template": "모든 복제본 삭제하기 %1",
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
            "type": "remove_all_clones"
        },
        "class": "clone",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var clonedEntities = sprite.parent.getClonedEntities();newLine    clonedEntities.map(function (entity) {newLine        entity.removeClone();newLine    });newLine    clonedEntities = null;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "functionAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "isNotFor": [
            "functionInit"
        ],
        "template": "%1",
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
                null
            ]
        }
    },
    "function_field_label": {
        "skeleton": "basic_param",
        "isNotFor": [
            "functionEdit"
        ],
        "color": "#f9c535",
        "template": "%1%2",
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
        "template": "%1%2",
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
        "isNotFor": [
            "functionEdit"
        ],
        "color": "#aeb8ff",
        "template": "%1%2",
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
        "template": "문자/숫자값"
    },
    "function_param_boolean": {
        "skeleton": "basic_boolean_field",
        "color": "#aeb8ff",
        "template": "판단값"
    },
    "function_create": {
        "skeleton": "basic",
        "color": "#cc7337",
        "event": "funcDef",
        "template": "함수 정의하기 %1 %2",
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
        ]
    },
    "function_general": {
        "skeleton": "basic",
        "color": "#cc7337",
        "template": "함수",
        "params": []
    },
    "hamster_move_forward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "앞으로 이동하기 %1",
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
            "type": "hamster_move_forward"
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = 50;newLine        sq.rightWheel = 50;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_move_backward": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "뒤로 이동하기 %1",
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
            "type": "hamster_move_backward"
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = -50;newLine        sq.rightWheel = -50;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_turn_around": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 으로 돌기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "hamster_turn_around"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var direction = script.getField(\"DIRECTION\", script);newLine        var isLeft = direction == 'LEFT';newLine        script.leftValue = isLeft ? -50 : 50;newLine        script.rightValue = isLeft ? 50 : -50;newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = 1 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = script.leftValue;newLine        sq.rightWheel = script.rightValue;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.leftValue;newLine        delete script.rightValue;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_set_led_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 LED를 %2 으로 정하기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
                ],
                "value": "LEFT",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빨간색",
                        "4"
                    ],
                    [
                        "노란색",
                        "6"
                    ],
                    [
                        "초록색",
                        "2"
                    ],
                    [
                        "하늘색",
                        "3"
                    ],
                    [
                        "파란색",
                        "1"
                    ],
                    [
                        "보라색",
                        "5"
                    ],
                    [
                        "하얀색",
                        "7"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "hamster_set_led_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "COLOR": 1
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"DIRECTION\", script);newLine    var color = Number(script.getField(\"COLOR\", script));newLine    if (direction == 'FRONT') {newLine        sq.leftLed = color;newLine        sq.rightLed = color;newLine    } else if (direction == 'LEFT')newLine        sq.leftLed = color;newLine    elsenewLine        sq.rightLed = color;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_clear_led": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 LED 끄기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "hamster_clear_led"
        },
        "paramsKeyMap": {
            "DIRECTION": 0
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField(\"DIRECTION\", script);newLine    if (direction == 'FRONT') {newLine        sq.leftLed = 0;newLine        sq.rightLed = 0;newLine    } else if (direction == 'LEFT') sq.leftLed = 0;newLine    else sq.rightLed = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_beep": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "삐 소리내기 %1",
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
            "type": "hamster_beep"
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        delete sq.note;newLine        sq.buzzer = 440;newLine        var timeValue = 0.2 * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.buzzer = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_hand_found": {
        "color": "#00979D",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "손 찾음?",
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "hamster_hand_found"
        },
        "class": "hamster_novice",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var pd = Entry.hw.portData;newLine    return pd.leftProximity > 40 ||newLine        pd.rightProximity > 40;newLine}_dummy"
    },
    "hamster_move_forward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "앞으로 %1 초 이동하기 %2",
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
            "type": "hamster_move_forward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = 50;newLine        sq.rightWheel = 50;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_move_backward_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "뒤로 %1 초 이동하기 %2",
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
            "type": "hamster_move_backward_for_secs"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = -50;newLine        sq.rightWheel = -50;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_turn_for_secs": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 으로 %2 초 돌기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ]
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
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "hamster_turn_for_secs"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var direction = script.getField(\"DIRECTION\", script);newLine        var isLeft = direction == 'LEFT';newLine        script.leftValue = isLeft ? -50 : 50;newLine        script.rightValue = isLeft ? 50 : -50;newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"VALUE\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.leftWheel = script.leftValue;newLine        sq.rightWheel = script.rightValue;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.leftValue;newLine        delete script.rightValue;newLine        Entry.engine.isContinue = false;newLine        sq.leftWheel = 0;newLine        sq.rightWheel = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 음을 %3 박자 연주하기 %4",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "도",
                        "4"
                    ],
                    [
                        "도#",
                        "5"
                    ],
                    [
                        "레",
                        "6"
                    ],
                    [
                        "미b",
                        "7"
                    ],
                    [
                        "미",
                        "8"
                    ],
                    [
                        "파",
                        "9"
                    ],
                    [
                        "파#",
                        "10"
                    ],
                    [
                        "솔",
                        "11"
                    ],
                    [
                        "솔#",
                        "12"
                    ],
                    [
                        "라",
                        "13"
                    ],
                    [
                        "시b",
                        "14"
                    ],
                    [
                        "시",
                        "15"
                    ]
                ],
                "value": "4",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "1",
                        "1"
                    ],
                    [
                        "2",
                        "2"
                    ],
                    [
                        "3",
                        "3"
                    ],
                    [
                        "4",
                        "4"
                    ],
                    [
                        "5",
                        "5"
                    ],
                    [
                        "6",
                        "6"
                    ],
                    [
                        "7",
                        "7"
                    ]
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
                    "params": [
                        "0.5"
                    ]
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
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        var note = script.getNumberField(\"NOTE\", script);newLine        var octave = script.getNumberField(\"OCTAVE\", script);newLine        var beat = script.getNumberValue(\"VALUE\", script);newLine        var tempo = Entry.Hamster.tempo;newLine        note += (octave-1)*12;newLine        var timeValue = beat*60*1000/tempo;newLine        script.note = note;newLinenewLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        if (timeValue > 100) {newLine            setTimeout(function() {newLine                sq.note = 0;newLine            }, timeValue-100);newLine        }newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        sq.note = script.note;newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        delete script.note;newLine        Entry.engine.isContinue = false;newLine        sq.note = 0;newLine        return script.callReturn();newLine    }newLinenewLine}_dummy"
    },
    "hamster_rest_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 박자 쉬기 %2",
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
                        "0.25"
                    ]
                },
                null
            ],
            "type": "hamster_rest_for"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue('VALUE');newLine        timeValue = timeValue*60*1000/Entry.Hamster.tempo;newLine        sq.note = 0;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.timeFlag;newLine        Entry.engine.isContinue = false;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "hamster_change_tempo_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "연주 속도를 %1 만큼 바꾸기 %2",
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
                        "20"
                    ]
                },
                null
            ],
            "type": "hamster_change_tempo_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.Hamster.tempo += script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_set_tempo_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "연주 속도를 %1 BPM으로 정하기 %2",
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
                        "60"
                    ]
                },
                null
            ],
            "type": "hamster_set_tempo_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "intermediate",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.Hamster.tempo = script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_change_both_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3",
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
                    "params": [
                        "10"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "hamster_change_both_wheels_by"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var pd = Entry.hw.portData;newLine    var left = sq.leftWheel != undefined ?newLine        sq.leftWheel : pd.leftWheel;newLine    var right = sq.rightWheel != undefined ?newLine        sq.rightWheel : pd.rightWheel;newLinenewLine    left += script.getNumberValue('LEFT');newLine    right += script.getNumberValue('RIGHT');newLinenewLine    sq.leftWheel = left;newLine    sq.rightWheel = right;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_set_both_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3",
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
                    "params": [
                        "30"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "30"
                    ]
                },
                null
            ],
            "type": "hamster_set_both_wheels_to"
        },
        "paramsKeyMap": {
            "LEFT": 0,
            "RIGHT": 1
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    sq.leftWheel = script.getNumberValue('LEFT');newLine    sq.rightWheel = script.getNumberValue('RIGHT');newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_change_wheels_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "hamster_change_wheels_by"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var pd = Entry.hw.portData;newLine    var direction = script.getField('DIRECTION');newLine    var value = script.getNumberValue('VALUE');newLinenewLine    if (direction == 'LEFT') {newLine        sq.leftWheel = sq.leftWheel != undefined ?newLine            sq.leftWheel + value : pd.leftWheel + value;newLine    } else if (direction == 'RIGHT')newLine        sq.rightWheel = sq.rightWheel != undefined ?newLine            sq.rightWheel + value : pd.rightWheel + value;newLine    else {newLine        sq.leftWheel = sq.leftWheel != undefined ?newLine            sq.leftWheel + value : pd.leftWheel + value;newLine        sq.rightWheel = sq.rightWheel != undefined ?newLine            sq.rightWheel + value : pd.rightWheel + value;newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_set_wheels_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽",
                        "LEFT"
                    ],
                    [
                        "오른쪽",
                        "RIGHT"
                    ],
                    [
                        "양쪽",
                        "FRONT"
                    ]
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
                    "params": [
                        "30"
                    ]
                },
                null
            ],
            "type": "hamster_set_wheels_to"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    var direction = script.getField('DIRECTION');newLine    var value = script.getNumberValue('VALUE');newLinenewLine    if (direction == 'LEFT') sq.leftWheel = value;newLine    else if (direction == 'RIGHT') sq.rightWheel = value;newLine    else {newLine        sq.leftWheel = value;newLine        sq.rightWheel = value;newLine    }newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_stop": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "정지하기 %1",
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
            "type": "hamster_stop"
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    sq.leftWheel = 0;newLine    sq.rightWheel = 0;newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_change_buzzer_by": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 음을 %1 만큼 바꾸기 %2",
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
                        "10"
                    ]
                },
                null
            ],
            "type": "hamster_change_buzzer_by"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var hw = Entry.hw,newLine        sq = hw.sendQueue,newLine        pd = hw.portData;newLine        value = script.getNumberValue('VALUE');newLine    delete sq.note;newLine    sq.buzzer = sq.buzzer == undefined ?newLine        value : sq.buzzer + value;newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_set_buzzer_to": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 음을 %1 (으)로 정하기 %2",
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
                        "1000"
                    ]
                },
                null
            ],
            "type": "hamster_set_buzzer_to"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLine    delete sq.note;newLine    sq.buzzer = script.getNumberValue('VALUE');newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_clear_buzzer": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "버저 끄기 %1",
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
            "type": "hamster_clear_buzzer"
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.hw.sendQueue.buzzer = 0;newLine    return script.callReturn();newLine}_dummy"
    },
    "hamster_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "왼쪽 근접 센서",
                        "leftProximity"
                    ],
                    [
                        "오른쪽 근접 센서",
                        "rightProximity"
                    ],
                    [
                        "왼쪽 바닥 센서",
                        "leftFloor"
                    ],
                    [
                        "오른쪽 바닥 센서",
                        "rightFloor"
                    ],
                    [
                        "x축 가속도",
                        "accelerationX"
                    ],
                    [
                        "y축 가속도",
                        "accelerationY"
                    ],
                    [
                        "z축 가속도",
                        "accelerationZ"
                    ],
                    [
                        "밝기",
                        "light"
                    ],
                    [
                        "온도",
                        "temperature"
                    ],
                    [
                        "신호 세기",
                        "signalStrength"
                    ],
                    [
                        "입력 A",
                        "inputA"
                    ],
                    [
                        "입력 B",
                        "inputB"
                    ]
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
            "type": "hamster_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "rank",
        "isNotFor": [
            "hamster"
        ],
        "func": "dummy_function (sprite, script) {newLine    var hw = Entry.hw,newLine        sq = hw.sendQueue,newLine        pd = hw.portData,newLine        port = script.getField('PORT');newLinenewLine    return sq[port] != undefined ?newLine        sq[port] : pd[port]newLine}_dummy"
    },
    "is_clicked": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "마우스를 클릭했는가?",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "is_clicked"
        },
        "class": "boolean_input",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return Entry.stage.isClick;newLine}_dummy"
    },
    "is_press_some_key": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ],
            "type": "is_press_some_key"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "boolean_input",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var keycode = Number(script.getField(\"VALUE\", script));newLine    return Entry.pressedKeys.indexOf(keycode) >= 0;newLine}_dummy"
    },
    "reach_something": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2",
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
            "params": [
                null,
                null
            ],
            "type": "reach_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "boolean_collision",
        "isNotFor": []
        //"func": "dummy_function (sprite, script) {newLine    if (!sprite.getVisible())newLine        return false;newLine    var targetSpriteId = script.getField(\"VALUE\", script);newLine    var reg = /wall/;newLine    var ath = 0.2;newLine    var object = sprite.objectnewLine    var isWall = reg.test(targetSpriteId);newLine    var collision = ndgmr.checkPixelCollision;newLine    if (isWall) {newLine        var wall = Entry.stage.wall;newLine        switch(targetSpriteId) {newLine            case 'wall':newLine                if (collision(object,wall.up,ath,true) ||newLine                    collision(object,wall.down,ath,true) ||newLine                    collision(object,wall.left,ath,true) ||newLine                    collision(object,wall.right,ath,true))newLine                    return true;newLine                elsenewLine                    return false;newLine            case 'wall_up':newLine                if (collision(object,wall.up,ath,true))newLine                    return true;newLine                elsenewLine                    return false;newLine            case 'wall_down':newLine                if (collision(object,wall.down,ath,true))newLine                    return true;newLine                elsenewLine                    return false;newLine            case 'wall_right':newLine                if (collision(object,wall.right,ath,true))newLine                    return true;newLine                elsenewLine                    return false;newLine            case 'wall_left':newLine                if (collision(object,wall.left,ath,true))newLine                    return true;newLine                elsenewLine                    return false;newLine        }newLine    } else if (targetSpriteId == 'mouse') {newLine        var stage = Entry.stage.canvas;newLine        var pt = object.globalToLocal(stage.mouseX, stage.mouseY);newLine        return object.hitTest(pt.x, pt.y);newLine    } else {newLine        var targetSprite = Entry.container.getEntity(targetSpriteId);newLine        if (targetSprite.type == \"textBox\" || sprite.type == 'textBox') {newLine            var targetBound = targetSprite.object.getTransformedBounds();newLine            var bound = object.getTransformedBounds();newLine            if (Entry.checkCollisionRect(bound, targetBound))newLine                return true;newLine            var clonedEntities = targetSprite.parent.clonedEntities;newLine            for (var i=0, len=clonedEntities.length; i<len; i++) {newLine                var entity = clonedEntities[i];newLine                if (!entity.getVisible() || entity.isStamp)newLine                    continue;newLine                if (Entry.checkCollisionRect(bound, entity.object.getTransformedBounds()))newLine                    return true;newLine            }newLine        } else {newLine            if (targetSprite.getVisible() &&newLine                collision(object,targetSprite.object,ath,true))newLine                return true;
        //newLine            var clonedEntities = targetSprite.parent.clonedEntities;newLine            for (var i=0, len=clonedEntities.length; i<len; i++) {newLine                var entity = clonedEntities[i];newLine                if (!entity.getVisible() || entity.isStamp)newLine                    continue;newLine                if (collision(object,entity.object,ath,true))newLine                    return true;newLine            }newLine        }newLine    }newLine    return false;newLine}_dummy"
    },
    "boolean_comparison": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "=",
                        "EQUAL"
                    ],
                    [
                        "<",
                        "SMALLER"
                    ],
                    [
                        ">",
                        "BIGGER"
                    ]
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var operator = script.getField(\"OPERATOR\", script);newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    if (operator == \"EQUAL\")newLine        return leftValue == rightValue;newLine    else if (operator == \"BIGGER\")newLine        return leftValue > rightValue;newLine    elsenewLine        return leftValue < rightValue;newLine}_dummy"
    },
    "boolean_equal": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getStringValue(\"LEFTHAND\", script);newLine    var rightValue = script.getStringValue(\"RIGHTHAND\", script);newLine    return leftValue == rightValue;newLine}_dummy"
    },
    "boolean_bigger": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue > rightValue;newLine}_dummy"
    },
    "boolean_smaller": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getNumberValue(\"LEFTHAND\", script);newLine    var rightValue = script.getNumberValue(\"RIGHTHAND\", script);newLine    return leftValue < rightValue;newLine}_dummy"
    },
    "boolean_and_or": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "booleanMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "그리고",
                        "AND"
                    ],
                    [
                        "또는",
                        "OR"
                    ]
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "func": "dummy_function (sprite, script) {newLine    var operator = script.getField(\"OPERATOR\", script);newLine    var leftValue = script.getBooleanValue(\"LEFTHAND\", script);newLine    var rightValue = script.getBooleanValue(\"RIGHTHAND\", script);newLine    if (operator == \"AND\")newLine        return leftValue && rightValue;newLine    elsenewLine        return leftValue || rightValue;newLine}_dummy"
    },
    "boolean_and": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getBooleanValue(\"LEFTHAND\", script);newLine    var rightValue = script.getBooleanValue(\"RIGHTHAND\", script);newLine    return leftValue && rightValue;newLine}_dummy"
    },
    "boolean_or": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
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
        "func": "dummy_function (sprite, script) {newLine    var leftValue = script.getBooleanValue(\"LEFTHAND\", script);newLine    var rightValue = script.getBooleanValue(\"RIGHTHAND\", script);newLine    return leftValue || rightValue;newLine}_dummy"
    },
    "boolean_not": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2",
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
        "func": "dummy_function (sprite, script) {newLine    return !script.getBooleanValue(\"VALUE\");newLine}_dummy"
    },
    "true_or_false": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "참",
                        "true"
                    ],
                    [
                        "거짓",
                        "false"
                    ]
                ],
                "value": "true",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": "dummy_function (sprite, script) {newLine    var value = script.children[0].textContent;newLine    return value == \"true\";newLine}_dummy"
    },
    "True": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Text",
                "text": "참",
                "color": "#3D3D3D"
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return true;newLine}_dummy",
        "isPrimitive": true
    },
    "False": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1  ",
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
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return false;newLine}_dummy",
        "isPrimitive": true
    },
    "boolean_basic_operator": {
        "color": "#AEB8FF",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "=",
                        "EQUAL"
                    ],
                    [
                        "＞",
                        "GREATER"
                    ],
                    [
                        "＜",
                        "LESS"
                    ],
                    [
                        "≥",
                        "GREATER_OR_EQUAL"
                    ],
                    [
                        "≤",
                        "LESS_OR_EQUAL"
                    ]
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
            "params": [
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                },
                "EQUAL",
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                }
            ],
            "type": "boolean_basic_operator"
        },
        "paramsKeyMap": {
            "LEFTHAND": 0,
            "OPERATOR": 1,
            "RIGHTHAND": 2
        },
        "class": "boolean_compare",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var operator = script.getField(\"OPERATOR\", script);newLine    var leftValue = script.getStringValue(\"LEFTHAND\", script);newLine    var rightValue = script.getStringValue(\"RIGHTHAND\", script);newLinenewLine    switch(operator) {newLine        case 'EQUAL':newLine            return leftValue == rightValue;newLine        case 'GREATER':newLine            return Number(leftValue) > Number(rightValue);newLine        case 'LESS':newLine            return Number(leftValue) < Number(rightValue);newLine        case 'GREATER_OR_EQUAL':newLine            return Number(leftValue) >= Number(rightValue);newLine        case 'LESS_OR_EQUAL':newLine            return Number(leftValue) <= Number(rightValue);newLine    }newLine}_dummy"
    },
    "show": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "모양 보이기 %1",
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
            "type": "show"
        },
        "class": "visibility",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    sprite.setVisible(true);newLine    return script.callReturn();newLine}_dummy"
    },
    "hide": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "모양 숨기기 %1",
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
            "type": "hide"
        },
        "class": "visibility",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    sprite.setVisible(false);newLine    return script.callReturn();newLine}_dummy"
    },
    "dialog_time": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 을(를) %2 초 동안 %3 %4",
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
                    [
                        "말하기",
                        "speak"
                    ]
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
                    "params": [
                        "안녕!"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "4"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue = script.getNumberValue(\"SECOND\", script);newLine        var message = script.getStringValue(\"VALUE\", script);newLine        var mode = script.getField(\"OPTION\", script);newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        if (!message && typeof message != 'number')newLine            message = '    ';newLine        message = Entry.convertToRoundedDecimals(message, 3);newLine        new Entry.Dialog(sprite, message, mode);newLine        sprite.syncDialogVisible(sprite.getVisible());newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue * 1000);newLine    }newLine    if (script.timeFlag == 0) {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        if(sprite.dialog)   sprite.dialog.remove();newLine        return script.callReturn();newLine    } elsenewLine        return script;newLine}_dummy"
    },
    "dialog": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 을(를) %2 %3",
        "params": [
            {
                "type": "Block",
                "accept": "stringMagnet"
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "말하기",
                        "speak"
                    ]
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
                    "params": [
                        "안녕!"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var message = script.getStringValue(\"VALUE\", script);newLine    if (!message && typeof message != 'number') {newLine        message = '    ';newLine    }newLine    var mode = script.getField(\"OPTION\", script);newLine    message = Entry.convertToRoundedDecimals(message, 3);newLine    new Entry.Dialog(sprite, message, mode);newLine    sprite.syncDialogVisible(sprite.getVisible());newLine    return script.callReturn();newLine}_dummy"
    },
    "remove_dialog": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "말하기 지우기 %1",
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
            "type": "remove_dialog"
        },
        "class": "say",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    if(sprite.dialog)   sprite.dialog.remove();newLine    return script.callReturn();newLine}_dummy"
    },
    "change_to_nth_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 모양으로 바꾸기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "change_to_nth_shape"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "shape",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var imageId = script.getField(\"VALUE\", script);newLine    var picture = sprite.parent.getPicture(imageId);newLine    sprite.setImage(picture);newLine    return script.callReturn();newLine}_dummy"
    },
    "change_to_next_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "다음 모양으로 바꾸기 %1",
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
            "type": "change_to_next_shape"
        },
        "class": "shape",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var picture = sprite.parent.getNextPicture(sprite.picture.id);newLine    sprite.setImage(picture);newLine    return script.callReturn();newLine}_dummy"
    },
    "set_effect_volume": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 만큼 주기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "불투명도",
                        "opacity"
                    ]
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
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hue = effectValue + sprite.effect.hue;newLine    } else if (effect == \"lens\") {newLine    } else if (effect == \"swriling\") {newLine    } else if (effect == \"pixel\") {newLine    } else if (effect == \"mosaic\") {newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue + sprite.effect.brightness;newLine    } else if (effect == \"blur\") {newLine    } else if (effect == \"opacity\") {newLine        sprite.effect.alpha = (sprite.effect.alpha + effectValue / 100) ;newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "set_effect": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 (으)로 정하기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "불투명도",
                        "opacity"
                    ]
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
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hue = effectValue;newLine    } else if (effect == \"lens\") {newLine    } else if (effect == \"swriling\") {newLine    } else if (effect == \"pixel\") {newLine    } else if (effect == \"mosaic\") {newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue;newLine    } else if (effect == \"blur\") {newLine    } else if (effect == \"opacity\") {newLine        sprite.effect.alpha = effectValue / 100;newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "erase_all_effects": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "효과 모두 지우기 %1",
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
            "type": "erase_all_effects"
        },
        "class": "effect",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    sprite.resetFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "change_scale_percent": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "크기를 %1 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var scaleValue = (script.getNumberValue(\"VALUE\", script) + 100) / 100;newLine    sprite.setScaleX(sprite.getScaleX() * scaleValue);newLine    sprite.setScaleY(sprite.getScaleY() * scaleValue);newLine    return script.callReturn();newLine}_dummy"
    },
    "set_scale_percent": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "크기를 %1  (으)로 정하기 %2",
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
                    "params": [
                        "100"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var scaleValue = script.getNumberValue(\"VALUE\", script) / 100;newLine    var snapshot = sprite.snapshot_;newLine    sprite.setScaleX(scaleValue * snapshot.scaleX);newLine    sprite.setScaleY(scaleValue * snapshot.scaleY);newLine    return script.callReturn();newLine}_dummy"
    },
    "change_scale_size": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "크기를 %1 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var sizeValue = script.getNumberValue(\"VALUE\", script);newLine    sprite.setSize(sprite.getSize() + sizeValue);newLine    return script.callReturn();newLine}_dummy"
    },
    "set_scale_size": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "크기를 %1  (으)로 정하기 %2",
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
                    "params": [
                        "100"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var sizeValue = script.getNumberValue(\"VALUE\", script);newLine    sprite.setSize(sizeValue);newLine    return script.callReturn();newLine}_dummy"
    },
    "flip_y": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "좌우 모양 뒤집기 %1",
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
            "type": "flip_y"
        },
        "class": "flip",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    sprite.setScaleX((-1)*sprite.getScaleX());newLine    return script.callReturn();newLine}_dummy"
    },
    "flip_x": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "상하 모양 뒤집기 %1",
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
        "func": "dummy_function (sprite, script) {newLine    sprite.setScaleY((-1)*sprite.getScaleY());newLine    return script.callReturn();newLine}_dummy"
    },
    "set_object_order": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 번째로 올라오기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "set_object_order"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "z-index",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetIndex = script.getField(\"VALUE\", script);newLine    //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);newLine    var currentIndex = Entry.container.getCurrentObjects().indexOf(sprite.parent);newLinenewLine    if (currentIndex > -1) {newLine        Entry.container.moveElementByBlock(currentIndex, targetIndex);newLine        return script.callReturn();newLine    } elsenewLine        throw new Error('object is not available');newLine}_dummy"
    },
    "get_pictures": {
        "color": "#EC4466",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "pictures",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"VALUE\");newLine}_dummy"
    },
    "change_to_some_shape": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 모양으로 바꾸기 %2",
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
                    "type": "get_pictures"
                },
                null
            ],
            "type": "change_to_some_shape"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "shape",
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var imageId = script.getStringValue(\"VALUE\");newLine    var value = Entry.parseNumber(imageId);newLine    var picture = sprite.parent.getPicture(imageId);newLinenewLine    sprite.setImage(picture);newLine    return script.callReturn();newLine}_dummy"
    },
    "add_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 만큼 주기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "투명도",
                        "transparency"
                    ]
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
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hsv = effectValue + sprite.effect.hsv;newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue + sprite.effect.brightness;newLine    } else if (effect == \"transparency\") {newLine        sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "change_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 (으)로 정하기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "투명도",
                        "transparency"
                    ]
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
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hsv = effectValue;newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue;newLine    } else if (effect == \"transparency\") {newLine        sprite.effect.alpha = 1 - (effectValue / 100);newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "set_effect_amount": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 만큼 주기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "투명도",
                        "transparency"
                    ]
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
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hue = effectValue + sprite.effect.hue;newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue + sprite.effect.brightness;newLine    } else if (effect == \"transparency\") {newLine        sprite.effect.alpha = (sprite.effect.alpha - effectValue / 100) ;newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "set_entity_effect": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 효과를 %2 (으)로 정하기 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "색깔",
                        "color"
                    ],
                    [
                        "밝기",
                        "brightness"
                    ],
                    [
                        "투명도",
                        "transparency"
                    ]
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
                    "params": [
                        "100"
                    ]
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
        "isNotFor": [
            "textBox"
        ],
        "func": "dummy_function (sprite, script) {newLine    var effect = script.getField(\"EFFECT\", script);newLine    var effectValue = script.getNumberValue(\"VALUE\", script);newLine    if (effect == \"color\") {newLine        sprite.effect.hue = effectValue;newLine    } else if (effect == \"brightness\") {newLine        sprite.effect.brightness = effectValue;newLine    } else if (effect == \"transparency\") {newLine        sprite.effect.alpha = 1 - (effectValue / 100);newLine    }newLine    sprite.applyFilter();newLine    return script.callReturn();newLine}_dummy"
    },
    "change_object_index": {
        "color": "#EC4466",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 보내기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "맨 앞으로",
                        "FRONT"
                    ],
                    [
                        "앞으로",
                        "FORWARD"
                    ],
                    [
                        "뒤로",
                        "BACKWARD"
                    ],
                    [
                        "맨 뒤로",
                        "BACK"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "change_object_index"
        },
        "paramsKeyMap": {
            "LOCATION": 0
        },
        "class": "z-index",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetIndex;newLine    var location = script.getField(\"LOCATION\", script);newLine    var objects = Entry.container.getCurrentObjects();newLine    var currentIndex = objects.indexOf(sprite.parent);newLine    var max = objects.length-1newLinenewLine    if (currentIndex < 0)newLine        throw new Error('object is not available for current scene');newLinenewLine    switch (location) {newLine        case 'FRONT':newLine            targetIndex = 0;newLine            break;newLine        case 'FORWARD':newLine            targetIndex = Math.max(0, currentIndex-1);newLine            break;newLine        case 'BACKWARD':newLine            targetIndex = Math.min(max, currentIndex+1);newLine            break;newLine        case 'BACK':newLine            targetIndex = max;newLine            break;newLinenewLine    }newLinenewLine    Entry.container.moveElementByBlock(currentIndex, targetIndex);newLine    return script.callReturn();newLine}_dummy"
    },
    "move_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "이동 방향으로 %1 만큼 움직이기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setX(sprite.getX() + value * Math.cos((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));newLine    sprite.setY(sprite.getY() - value * Math.sin((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "move_x": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "x 좌표를 %1 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setX(sprite.getX() + value);newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "move_y": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "y 좌표를 %1 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setY(sprite.getY() + value);newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "locate_xy_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 동안 x: %2 y: %3 위치로 이동하기 %4",
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
                    "params": [
                        "2"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue;newLine        timeValue = script.getNumberValue(\"VALUE1\", script);newLine        var xValue = script.getNumberValue(\"VALUE2\", script) - sprite.getX();newLine        var yValue = script.getNumberValue(\"VALUE3\", script) - sprite.getY();newLine        script.isStart = true;newLine        script.frameCount = Math.floor(timeValue * Entry.FPS)newLine        script.dX = xValue/script.frameCount;newLine        script.dY = yValue/script.frameCount;newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setX(sprite.getX() + script.dX);newLine        sprite.setY(sprite.getY() + script.dY);newLine        script.frameCount--;newLine        if (sprite.brush && !sprite.brush.stop) {newLine            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine        }newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "rotate_by_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "오브젝트를 %1 만큼 회전하기 %2",
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
                    "params": [
                        "90"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setRotation(sprite.getRotation() + value);newLine    return script.callReturn();newLine}_dummy"
    },
    "rotate_by_angle_dropdown": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 만큼 회전하기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "45",
                        "45"
                    ],
                    [
                        "90",
                        "90"
                    ],
                    [
                        "135",
                        "135"
                    ],
                    [
                        "180",
                        "180"
                    ]
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
            "params": [
                "45",
                null
            ],
            "type": "rotate_by_angle_dropdown"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "ebs",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getField(\"VALUE\", script);newLine    sprite.setRotation(sprite.getRotation() + Number(value));newLine    return script.callReturn();newLine}_dummy"
    },
    "see_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "이동 방향을 %1 (으)로 정하기 %2",
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
                    "params": [
                        "90"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setDirection(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "see_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 쪽 보기 %2",
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
            "params": [
                null,
                null
            ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": "dummy_function (sprite, script) {newLine    var targetId = script.getField(\"VALUE\", script);newLine    var targetEntity = Entry.container.getEntity(targetId);//fucknewLine    var deltaX = targetEntity.getX() - sprite.getX();newLine    var deltaY = targetEntity.getY() - sprite.getY();newLine    if (deltaX>=0) {newLine        sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 90);newLine    } else {newLine        sprite.setRotation(Math.atan(deltaY / deltaX) / Math.PI * 180 + 270);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "locate_xy": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "x: %1 y: %2 위치로 이동하기 %3",
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
                    "params": [
                        "0"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "0"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value1 = script.getNumberValue(\"VALUE1\", script);newLine    sprite.setX(value1);newLine    var value2 = script.getNumberValue(\"VALUE2\", script);newLine    sprite.setY(value2);newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "locate_x": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "x: %1 위치로 이동하기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setX(value);newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "locate_y": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "y: %1 위치로 이동하기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    //sprite.y = 340 - value;newLine    sprite.setY(value);newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "locate": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 위치로 이동하기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "locate"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "move_absolute",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetId = script.getField(\"VALUE\", script);newLine    var x,y;newLine    if (targetId == 'mouse') {newLine        x = Entry.stage.mouseCoordinate.x;newLine        y = Entry.stage.mouseCoordinate.y;newLine    } else {newLine        var targetEntity = Entry.container.getEntity(targetId);newLine        x = targetEntity.getX();newLine        y = targetEntity.getY();newLine    }newLine    sprite.setX(Number(x));newLine    sprite.setY(Number(y));newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(x, y*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "move_xy_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 동안 x: %2 y: %3 만큼 움직이기 %4",
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
                    "params": [
                        "2"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue;newLine        timeValue = script.getNumberValue(\"VALUE1\", script);newLine        var xValue = script.getNumberValue(\"VALUE2\", script);newLine        var yValue = script.getNumberValue(\"VALUE3\", script);newLine        script.isStart = true;newLine        script.frameCount = Math.floor(timeValue * Entry.FPS)newLine        script.dX = xValue/script.frameCount;newLine        script.dY = yValue/script.frameCount;newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setX(sprite.getX() + script.dX);newLine        sprite.setY(sprite.getY() + script.dY);newLine        script.frameCount--;newLine        if (sprite.brush && !sprite.brush.stop) {newLine            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine        }newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "rotate_by_angle_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "오브젝트를 %1 초 동안 %2 만큼 회전하기 %3",
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
                    "params": [
                        "2"
                    ]
                },
                {
                    "type": "number",
                    "params": [
                        "2"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue;newLine        timeValue = script.getNumberValue(\"VALUE\", script);newLine        var angleValue = script.getNumberField(\"VALUE\", script);newLine        script.isStart = true;newLine        script.frameCount = Math.floor(timeValue * Entry.FPS)newLine        script.dAngle = angleValue/script.frameCount;newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setRotation(sprite.getRotation() + script.dAngle);newLine        script.frameCount--;newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "bounce_wall": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "화면 끝에 닿으면 튕기기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "bounce_wall"
        },
        "class": "walk",
        "isNotFor": []
        //"func": "dummy_function (sprite, script) {newLine    var threshold = 0;newLinenewLine    var method = sprite.parent.getRotateMethod();newLine    var bound = sprite.object.getTransformedBounds();newLine    var size = {};newLine    size.width = bound.width * Math.sqrt(1.0 + (bound.height/bound.width) * (bound.height/bound.width));newLine    size.height = bound.height * Math.sqrt(1.0 + (bound.width/bound.height) * (bound.width/bound.height));newLinenewLine    if (method == 'free')newLine        var angle = (sprite.getRotation() + sprite.getDirection()).mod(360);newLine    elsenewLine        var angle = sprite.getDirection();newLinenewLine    if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {newLine        var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);newLine        if (up) {newLine            if (method == 'free')newLine                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);newLine            elsenewLine                sprite.setDirection(- sprite.getDirection() + 180);newLinenewLine            sprite.setY(135 - size.height/2 - 1);newLine        } else {newLine            var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);newLine            if (down) {newLine                if (method == 'free')newLine                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);newLine                elsenewLine                    sprite.setDirection(- sprite.getDirection() + 180);newLinenewLine                sprite.setY(-135 + size.height/2 + 1);newLine            }newLinenewLine        }newLine    } else if (angle < 270 && angle >= 90) {newLine        var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);newLine        if (down) {newLine            if (method == 'free')newLine                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);newLine            elsenewLine                sprite.setDirection(- sprite.getDirection() + 180);newLinenewLine            sprite.setY(-135 + size.height/2 + 1);newLine        } else {newLine            var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);newLine            if (up) {newLine                if (method == 'free')newLine                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);newLine                elsenewLine                    sprite.setDirection(- sprite.getDirection() + 180);newLinenewLine                sprite.setY(135 - size.height/2 - 1);newLine            }newLine        }newLine    }newLine    if (angle < 360 && angle >= 180) {newLine        var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);newLine        if (left) {newLine            if (method == 'free')newLine                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);newLine
       //elsenewLine                sprite.setDirection(- sprite.getDirection() + 360);newLinenewLine            sprite.setX(-240 + size.width/2 + 1);newLine        } else {newLine            var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);newLine            if (right) {newLine                if (method == 'free')newLine                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);newLine                elsenewLine                    sprite.setDirection(- sprite.getDirection() + 360);newLinenewLine                sprite.setX(240 - size.width/2 - 1);newLine            }newLinenewLine        }newLine    } else if (angle < 180 && angle >= 0) {newLine        var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);newLine        if (right) {newLine            if (method == 'free')newLine                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);newLine            elsenewLine                sprite.setDirection(- sprite.getDirection() + 360);newLinenewLine            sprite.setX(240 - size.width/2 - 1);newLine        } else {newLine            var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);newLine            if (left) {newLine                if (method == 'free')newLine                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);newLine                elsenewLine                    sprite.setDirection(- sprite.getDirection() + 360);newLinenewLine                sprite.setX(-240 + size.width/2 + 1);newLine            }newLine        }newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "flip_arrow_horizontal": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "화살표 방향 좌우 뒤집기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    sprite.setDirection(sprite.getDirection() + 180);newLine    return script.callReturn();newLine}_dummy"
    },
    "flip_arrow_vertical": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "화살표 방향 상하 뒤집기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/moving_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    sprite.setDirection(sprite.getDirection() + 180);newLine    return script.callReturn();newLine}_dummy"
    },
    "see_angle_object": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 쪽 바라보기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "see_angle_object"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "rotate_absolute",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var targetId = script.getField(\"VALUE\", script);newLine    var spriteX = sprite.getX();newLine    var spriteY = sprite.getY();newLine    var deltaX, deltaY;newLinenewLine    if (sprite.parent.id == targetId)newLine        return script.callReturn();newLinenewLine    if ( targetId == 'mouse' ) {newLine        var mX = Entry.stage.mouseCoordinate.x;newLine        var mY = Entry.stage.mouseCoordinate.y;newLinenewLine        deltaX = mX - spriteX;newLine        deltaY = mY - spriteY;newLine    } else {newLine        var targetEntity = Entry.container.getEntity(targetId);newLine        deltaX = targetEntity.getX() - spriteX;newLine        deltaY = targetEntity.getY() - spriteY;newLine    }newLinenewLine    if ( deltaX >= 0 ) {newLine        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;newLine    } else {newLine        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;newLine    }newLine    var nativeDirection = sprite.getDirection() + sprite.getRotation();newLine    sprite.setRotation(sprite.getRotation() + value - nativeDirection);newLine    return script.callReturn();newLine}_dummy"
    },
    "see_angle_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "오브젝트를 %1 (으)로 정하기 %2",
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
                    "params": [
                        "90"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    var nativeDirection = sprite.getDirection() + sprite.getRotation();newLine    sprite.setRotation(sprite.getRotation() + value - nativeDirection);newLine    return script.callReturn();newLine}_dummy"
    },
    "rotate_direction": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "이동 방향을 %1 만큼 회전하기 %2",
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
                    "params": [
                        "90"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    sprite.setDirection(value + sprite.getDirection());newLine    return script.callReturn();newLine}_dummy"
    },
    "locate_object_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 동안 %2 위치로 이동하기 %3",
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
                    "params": [
                        "2"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue, xValue, yValue;newLine        var targetId = script.getField(\"TARGET\", script);newLine        timeValue = script.getNumberValue(\"VALUE\", script);newLine        var frameCount = Math.floor(timeValue * Entry.FPS);newLine        var mouseCoordi = Entry.stage.mouseCoordinate;newLinenewLine        if (frameCount != 0) {newLine            if (targetId == 'mouse') {newLine                xValue = mouseCoordi.x - sprite.getX();newLine                yValue = mouseCoordi.y - sprite.getY();newLine            } else {newLine                var targetEntity = Entry.container.getEntity(targetId);newLine                xValue = targetEntity.getX() - sprite.getX();newLine                yValue = targetEntity.getY() - sprite.getY();newLine            }newLine            script.isStart = true;newLine            script.frameCount = frameCount;newLine            script.dX = xValue/script.frameCount;newLine            script.dY = yValue/script.frameCount;newLine        } else {newLine            //frame count is zero so execute immediatelynewLine            if (targetId == 'mouse') {newLine                xValue = Number(mouseCoordi.x);newLine                yValue = Number(mouseCoordi.y);newLine            } else {newLine                var targetEntity = Entry.container.getEntity(targetId);newLine                xValue = targetEntity.getX();newLine                yValue = targetEntity.getY();newLine            }newLine            sprite.setX(xValue);newLine            sprite.setY(yValue);newLine            if (sprite.brush && !sprite.brush.stop) {newLine                sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine            }newLine            return script.callReturn();newLine        }newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setX(sprite.getX() + script.dX);newLine        sprite.setY(sprite.getY() + script.dY);newLine        script.frameCount--;newLine        if (sprite.brush && !sprite.brush.stop)newLine            sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "rotate_absolute": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "방향을 %1 (으)로 정하기 %2",
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
        "func": "dummy_function (entity, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    entity.setRotation(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "rotate_relative": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "방향을 %1 만큼 회전하기 %2",
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
        "func": "dummy_function (entity, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    entity.setRotation(value + entity.getRotation());newLine    return script.callReturn();newLine}_dummy"
    },
    "direction_absolute": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "이동 방향을 %1 (으)로 정하기 %2",
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
        "func": "dummy_function (entity, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    entity.setDirection(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "direction_relative": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "이동 방향을 %1 만큼 회전하기 %2",
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
        "func": "dummy_function (entity, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    entity.setDirection(value + entity.getDirection());newLine    return script.callReturn();newLine}_dummy"
    },
    "move_to_angle": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 방향으로 %2 만큼 움직이기 %3",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    var angle = script.getNumberValue(\"ANGLE\", script);newLine    sprite.setX(sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI));newLine    sprite.setY(sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI));newLine    if (sprite.brush && !sprite.brush.stop) {newLine        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "rotate_by_time": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 동안 방향을 %2 만큼 회전하기 %3",
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
                    "params": [
                        "2"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue;newLine        timeValue = script.getNumberValue(\"VALUE\", script);newLine        var angleValue = script.getNumberValue(\"ANGLE\", script);newLine        script.isStart = true;newLine        script.frameCount = Math.floor(timeValue * Entry.FPS)newLine        script.dAngle = angleValue/script.frameCount;newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setRotation(sprite.getRotation() + script.dAngle);newLine        script.frameCount--;newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "direction_relative_duration": {
        "color": "#A751E3",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 초 동안 이동 방향 %2 만큼 회전하기 %3",
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
                    "params": [
                        "2"
                    ]
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
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        var timeValue;newLine        timeValue = script.getNumberValue(\"DURATION\", script);newLine        var directionValue = script.getNumberValue(\"AMOUNT\", script);newLine        script.isStart = true;newLine        script.frameCount = Math.floor(timeValue * Entry.FPS)newLine        script.dDirection = directionValue/script.frameCount;newLine    }newLine    if (script.frameCount != 0) {newLine        sprite.setDirection(sprite.getDirection() + script.dDirection);newLine        script.frameCount--;newLine        return script;newLine    } else {newLine        delete script.isStart;newLine        delete script.frameCount;newLine        delete script.dDirection;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "neobot_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  값",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "1번 포트",
                        "1"
                    ],
                    [
                        "2번 포트",
                        "2"
                    ],
                    [
                        "3번 포트",
                        "3"
                    ],
                    [
                        "리모컨",
                        "4"
                    ]
                ],
                "value": "1",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "neobot_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0
        },
        "class": "neobot_value",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getStringField(\"PORT\");newLine    return Entry.hw.portData[port];newLine}_dummy"
    },
    "neobot_turn_left": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽모터를 %1 %2 회전 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "앞으로",
                        "1"
                    ],
                    [
                        "뒤로",
                        "-1"
                    ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "느리게",
                        "1"
                    ],
                    [
                        "보통",
                        "2"
                    ],
                    [
                        "빠르게",
                        "3"
                    ]
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
                null,
                null
            ],
            "type": "neobot_turn_left"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "neobot_motor",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getNumberField(\"VALUE\");newLine    var direction = script.getNumberField(\"DIRECTION\");newLine    Entry.hw.sendQueue[\"LMOT\"] = port * direction;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_stop_left": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "왼쪽모터 정지 %1",
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
            "type": "neobot_stop_left"
        },
        "class": "neobot_motor",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.hw.sendQueue[\"LMOT\"] = 0;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_turn_right": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "오른쪽모터를 %1 %2 회전 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "앞으로",
                        "1"
                    ],
                    [
                        "뒤로",
                        "-1"
                    ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "느리게",
                        "1"
                    ],
                    [
                        "보통",
                        "2"
                    ],
                    [
                        "빠르게",
                        "3"
                    ]
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
                null,
                null
            ],
            "type": "neobot_turn_right"
        },
        "paramsKeyMap": {
            "DIRECTION": 0,
            "VALUE": 1
        },
        "class": "neobot_motor",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var port = script.getNumberField(\"VALUE\");newLine    var direction = script.getNumberField(\"DIRECTION\");newLine    Entry.hw.sendQueue[\"RMOT\"] = port * direction;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_stop_right": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "오른쪽모터 정지 %1",
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
            "type": "neobot_stop_right"
        },
        "class": "neobot_motor",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    Entry.hw.sendQueue[\"RMOT\"] = 0;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_run_motor": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 모터를  %2 초간 %3 %4 %5",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "양쪽",
                        "1"
                    ],
                    [
                        "왼쪽",
                        "2"
                    ],
                    [
                        "오른쪽",
                        "3"
                    ]
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
                    [
                        "느리게",
                        "1"
                    ],
                    [
                        "보통",
                        "2"
                    ],
                    [
                        "빠르게",
                        "3"
                    ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "전진",
                        "1"
                    ],
                    [
                        "후진",
                        "2"
                    ],
                    [
                        "좌회전",
                        "3"
                    ],
                    [
                        "우회전",
                        "4"
                    ]
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
                    "params": [
                        "1"
                    ]
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
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isStart) {newLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        var timeValue = script.getNumberValue(\"DURATION\") * 1000;newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, timeValue);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        var type = script.getNumberField(\"TYPE\");newLine        var value = script.getNumberField(\"VALUE\");newLine        var direction = script.getNumberField(\"DIRECTION\");newLine        switch (direction) {newLine            case 1:newLine            Entry.hw.sendQueue[\"LMOT\"] = value;newLine            Entry.hw.sendQueue[\"RMOT\"] = value;newLine            break;newLine            case 2:newLine            Entry.hw.sendQueue[\"LMOT\"] = value * -1;newLine            Entry.hw.sendQueue[\"RMOT\"] = value * -1;newLine            break;newLine            case 3:newLine            Entry.hw.sendQueue[\"LMOT\"] = value;newLine            Entry.hw.sendQueue[\"RMOT\"] = value * -1;newLine            break;newLine            case 4:newLine            Entry.hw.sendQueue[\"LMOT\"] = value * -1;newLine            Entry.hw.sendQueue[\"RMOT\"] = value;newLine            break;newLine        }newLinenewLine        if(type === 2)  {newLine            Entry.hw.sendQueue[\"RMOT\"] = 0;newLine        } else if(type === 3) {newLine            Entry.hw.sendQueue[\"LMOT\"] = 0;newLine        }newLinenewLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        Entry.hw.sendQueue[\"LMOT\"] = 0;newLine        Entry.hw.sendQueue[\"RMOT\"] = 0;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "neobot_servo_1": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "SERVO1에 연결된 서보모터를 %1 속도로 %2 로 이동 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빠른",
                        "3"
                    ],
                    [
                        "보통",
                        "2"
                    ],
                    [
                        "느린",
                        "1"
                    ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "0도",
                        "0"
                    ],
                    [
                        "10도",
                        "1"
                    ],
                    [
                        "20도",
                        "2"
                    ],
                    [
                        "30도",
                        "3"
                    ],
                    [
                        "40도",
                        "4"
                    ],
                    [
                        "50도",
                        "5"
                    ],
                    [
                        "60도",
                        "6"
                    ],
                    [
                        "70도",
                        "7"
                    ],
                    [
                        "80도",
                        "8"
                    ],
                    [
                        "90도",
                        "9"
                    ],
                    [
                        "100도",
                        "10"
                    ],
                    [
                        "110도",
                        "11"
                    ],
                    [
                        "120도",
                        "12"
                    ],
                    [
                        "130도",
                        "13"
                    ],
                    [
                        "140도",
                        "14"
                    ],
                    [
                        "150도",
                        "15"
                    ],
                    [
                        "160도",
                        "16"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "neobot_servo_1"
        },
        "paramsKeyMap": {
            "SPEED": 0,
            "VALUE": 1
        },
        "class": "neobot_servo",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberField(\"VALUE\");newLine    var speed = script.getNumberField(\"SPEED\");newLine    Entry.hw.sendQueue[\"SERVO1\"] = value;newLine    Entry.hw.sendQueue[\"SERVO1_SPEED\"] = speed;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_servo_2": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "SERVO2에 연결된 서보모터를 %1 속도로 %2 로 이동 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "빠른",
                        "3"
                    ],
                    [
                        "보통",
                        "2"
                    ],
                    [
                        "느린",
                        "1"
                    ]
                ],
                "value": "3",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "0도",
                        "0"
                    ],
                    [
                        "10도",
                        "1"
                    ],
                    [
                        "20도",
                        "2"
                    ],
                    [
                        "30도",
                        "3"
                    ],
                    [
                        "40도",
                        "4"
                    ],
                    [
                        "50도",
                        "5"
                    ],
                    [
                        "60도",
                        "6"
                    ],
                    [
                        "70도",
                        "7"
                    ],
                    [
                        "80도",
                        "8"
                    ],
                    [
                        "90도",
                        "9"
                    ],
                    [
                        "100도",
                        "10"
                    ],
                    [
                        "110도",
                        "11"
                    ],
                    [
                        "120도",
                        "12"
                    ],
                    [
                        "130도",
                        "13"
                    ],
                    [
                        "140도",
                        "14"
                    ],
                    [
                        "150도",
                        "15"
                    ],
                    [
                        "160도",
                        "16"
                    ]
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
            "params": [
                null,
                null,
                null
            ],
            "type": "neobot_servo_2"
        },
        "paramsKeyMap": {
            "SPEED": 0,
            "VALUE": 1
        },
        "class": "neobot_servo",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberField(\"VALUE\");newLine    var speed = script.getNumberField(\"SPEED\");newLine    Entry.hw.sendQueue[\"SERVO2\"] = value;newLine    Entry.hw.sendQueue[\"SERVO2_SPEED\"] = speed;newLine    return script.callReturn();newLine}_dummy"
    },
    "neobot_play_note_for": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "도",
                        "1"
                    ],
                    [
                        "레",
                        "2"
                    ],
                    [
                        "미",
                        "3"
                    ],
                    [
                        "파",
                        "4"
                    ],
                    [
                        "솔",
                        "5"
                    ],
                    [
                        "라",
                        "6"
                    ],
                    [
                        "시",
                        "7"
                    ],
                    [
                        "도",
                        "8"
                    ]
                ],
                "value": "1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "1",
                        "0"
                    ],
                    [
                        "2",
                        "1"
                    ],
                    [
                        "3",
                        "2"
                    ]
                ],
                "value": "0",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "2분음표",
                        "2"
                    ],
                    [
                        "4분음표",
                        "4"
                    ],
                    [
                        "8분음표",
                        "8"
                    ]
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
            "params": [
                null,
                null,
                null,
                null
            ],
            "type": "neobot_play_note_for"
        },
        "paramsKeyMap": {
            "NOTE": 0,
            "OCTAVE": 1,
            "DURATION": 2
        },
        "class": "neobot_note",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLinenewLine    if (!script.isStart) {newLine        var note = script.getNumberField(\"NOTE\", script);newLine        var octave = script.getNumberField(\"OCTAVE\", script);newLine        var duration = script.getNumberField(\"DURATION\", script);newLine        script.note = note;newLinenewLine        script.isStart = true;newLine        script.timeFlag = 1;newLine        sq.note = note;newLine        sq.octave = octave;newLine        sq.duration = duration;newLine        sq.sound_check = (Math.random() * 100000).toFixed(0);newLine        setTimeout(function() {newLine            script.timeFlag = 0;newLine        }, 1 / duration * 2000);newLine        return script;newLine    } else if (script.timeFlag == 1) {newLine        return script;newLine    } else {newLine        delete script.timeFlag;newLine        delete script.isStart;newLine        Entry.engine.isContinue = false;newLine        return script.callReturn();newLine    }newLinenewLine}_dummy"
    },
    "neobot_set_sensor_value": {
        "color": "#00979D",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 번 포트의 값을 %2 %3",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "1",
                        "O_1"
                    ],
                    [
                        "2",
                        "O_2"
                    ]
                ],
                "value": "O_1",
                "fontSize": 11
            },
            {
                "type": "Dropdown",
                "options": [
                    [
                        "켜기",
                        "1"
                    ],
                    [
                        "끄기",
                        "0"
                    ]
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
                null,
                null
            ],
            "type": "neobot_set_sensor_value"
        },
        "paramsKeyMap": {
            "PORT": 0,
            "VALUE": 1
        },
        "class": "neobot_set_value",
        "isNotFor": [
            "neobot"
        ],
        "func": "dummy_function (sprite, script) {newLine    var sq = Entry.hw.sendQueue;newLinenewLine    var port = script.getStringField(\"PORT\", script);newLine    var value = script.getNumberField(\"VALUE\", script);newLine    sq[port] = value;newLine    return script.callReturn();newLine}_dummy"
    },
    "when_scene_start": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 장면이 시작되었을때",
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
            "params": [
                null
            ],
            "type": "when_scene_start"
        },
        "class": "scene",
        "isNotFor": [
            "scene"
        ],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy",
        "event": "when_scene_start"
    },
    "start_scene": {
        "color": "#3BBD70",
        "skeleton": "basic_without_next",
        "statements": [],
        "template": "%1 시작하기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "start_scene"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "scene",
        "isNotFor": [
            "scene"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getField(\"VALUE\", script);newLine    var scene = Entry.scene.getSceneById(value);newLine    if (scene) {newLine        Entry.scene.selectScene(scene);newLine        Entry.engine.fireEvent('when_scene_start');newLine    }newLine    return null;newLine}_dummy"
    },
    "start_neighbor_scene": {
        "color": "#3BBD70",
        "skeleton": "basic_without_next",
        "statements": [],
        "template": "%1 장면 시작하기 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "다음",
                        "next"
                    ],
                    [
                        "이전",
                        "pre"
                    ]
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
            "params": [
                null,
                null
            ],
            "type": "start_neighbor_scene"
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "class": "scene",
        "isNotFor": [
            "scene"
        ],
        "func": "dummy_function (sprite, script) {newLine    var currentScene = Entry.scene.selectedScene;newLine    var scenes = Entry.scene.getScenes();newLine    var index = scenes.indexOf(currentScene);newLine    var o = script.getField(\"OPERATOR\", script);newLine    if (o == 'next') {newLine        if (index + 1 < scenes.length) {newLine            var nextScene = Entry.scene.getSceneById(scenes[index + 1].id);newLine            if (nextScene) {newLine                Entry.scene.selectScene(nextScene);newLine                Entry.engine.fireEvent('when_scene_start');newLine            }newLine        }newLine    } else {newLine        if (index > 0) {newLine            var nextScene = Entry.scene.getSceneById(scenes[index - 1].id);newLine            if (nextScene) {newLine                Entry.scene.selectScene(nextScene);newLine                Entry.engine.fireEvent('when_scene_start');newLine            }newLine        }newLine    }newLine    return null;newLine}_dummy"
    },
    "sound_something": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 재생하기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "sound_something"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getField(\"VALUE\", script);newLine    var sounds = sprite.parent.sounds;newLine    var isExist = Entry.isExist(soundId, 'id', sounds);newLine    if (isExist)newLine        createjs.Sound.play(soundId);newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_something_second": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 %2 초 재생하기 %3",
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
                    "params": [
                        "1"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getField(\"VALUE\", script);newLine    var timeValue = script.getNumberValue(\"SECOND\", script);newLine    var sounds = sprite.parent.sounds;newLine    var isExist = Entry.isExist(soundId, 'id', sounds);newLine    if (isExist) {newLine        //var instance = createjs.Sound.play(soundId, {startTime: 0, duration: timeValue * 1000});newLine        var instance = createjs.Sound.play(soundId);newLine        setTimeout(function() {newLine            instance.stop();newLine        }, timeValue * 1000);newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_something_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리  %1 재생하고 기다리기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "sound_something_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "sound",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isPlay) {newLine        script.isPlay = true;newLine        script.playState = 1;newLine        var soundId = script.getField(\"VALUE\", script);newLine        var sound = sprite.parent.getSound(soundId);newLine        var sounds = sprite.parent.sounds;newLine        var isExist = Entry.isExist(soundId, 'id', sounds);newLine        if (isExist) {newLine            var instance = createjs.Sound.play(soundId);newLine            setTimeout(function() {newLine                script.playState = 0;newLine            }, sound.duration * 1000)newLine        }newLine        return script;newLine    } else if (script.playState == 1) {newLine        return script;newLine    } else {newLine        delete script.playState;newLine        delete script.isPlay;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "sound_something_second_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 %2 초 재생하고 기다리기 %3",
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
                    "params": [
                        "1"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    if (!script.isPlay) {newLine        script.isPlay = true;newLine        script.playState = 1;newLine        var soundId = script.getField(\"VALUE\", script);newLine        var sounds = sprite.parent.sounds;newLine        var isExist = Entry.isExist(soundId, 'id', sounds);newLine        if (isExist) {newLine            var instance = createjs.Sound.play(soundId);newLine            var timeValue = script.getNumberValue(\"SECOND\", script);newLine            setTimeout(function() {newLine                instance.stop();newLine                script.playState = 0;newLine            }, timeValue * 1000)newLine            instance.addEventListener('complete', function(e) {newLine            });newLine        }newLine        return script;newLine    } else if (script.playState == 1) {newLine        return script;newLine    } else {newLine        delete script.isPlay;newLine        delete script.playState;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "sound_volume_change": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 크기를 %1 % 만큼 바꾸기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script) / 100;newLine    value = value + createjs.Sound.getVolume();newLine    if (value>1)newLine        value = 1;newLine    if (value<0)newLine        value = 0;newLine    createjs.Sound.setVolume(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_volume_set": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 크기를 %1 % 로 정하기 %2",
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
                    "params": [
                        "10"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var value = script.getNumberValue(\"VALUE\", script) / 100;newLine    if (value>1)newLine        value = 1;newLine    if (value<0)newLine        value = 0;newLine    createjs.Sound.setVolume(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_silent_all": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "모든 소리 멈추기 %1",
        "params": [
            {
                "type": "Indicator",
                "img": "/lib/entryjs/images/block_icon/sound_03.png",
                "size": 12
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ],
            "type": "sound_silent_all"
        },
        "class": "sound_stop",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    createjs.Sound.stop();newLine    return script.callReturn();newLine}_dummy"
    },
    "get_sounds": {
        "color": "#A4D01D",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
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
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getStringField(\"VALUE\");newLine}_dummy"
    },
    "sound_something_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 재생하기 %2",
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
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getStringValue(\"VALUE\", script);newLine    var sound = sprite.parent.getSound(soundId);newLinenewLine    if (sound)newLine        createjs.Sound.play(sound.id);newLinenewLine    return script.callReturn();newLine}_dummy"
    },
    "sound_something_second_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1   %2 초 재생하기 %3",
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
                    "params": [
                        "1"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getStringValue(\"VALUE\", script);newLine    var timeValue = script.getNumberValue(\"SECOND\", script);newLine    var sound = sprite.parent.getSound(soundId);newLinenewLine    if (sound) {newLine        var instance = createjs.Sound.play(sound.id, {startTime: 0, duration: timeValue * 1000});newLine        /*newLine        var instance = createjs.Sound.play(sound.id);newLine        setTimeout(function() {newLine            instance.stop();newLine        }, timeValue * 1000);newLine        */newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_something_wait_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리  %1 재생하고 기다리기 %2",
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
        "class": "sound_play",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isPlay) {newLine        script.isPlay = true;newLine        script.playState = 1;newLine        var soundId = script.getStringValue(\"VALUE\", script);newLine        var sound = sprite.parent.getSound(soundId);newLine        if (sound) {newLine            var instance = createjs.Sound.play(sound.id);newLine            setTimeout(function() {newLine                script.playState = 0;newLine            }, sound.duration * 1000)newLine        }newLine        return script;newLine    } else if (script.playState == 1) {newLine        return script;newLine    } else {newLine        delete script.playState;newLine        delete script.isPlay;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "sound_something_second_wait_with_block": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1   %2 초 재생하고 기다리기 %3",
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
                    "params": [
                        "1"
                    ]
                },
                null
            ],
            "type": "sound_something_second_wait_with_block"
        },
        "paramsKeyMap": {
            "VALUE": 0,
            "SECOND": 1
        },
        "class": "sound_play",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isPlay) {newLine        script.isPlay = true;newLine        script.playState = 1;newLine        var soundId = script.getStringValue(\"VALUE\", script);newLine        var sound = sprite.parent.getSound(soundId);newLine        if (sound) {newLine            var instance = createjs.Sound.play(sound.id);newLine            var timeValue = script.getNumberValue(\"SECOND\", script);newLine            setTimeout(function() {newLine                instance.stop();newLine                script.playState = 0;newLine            }, timeValue * 1000)newLine            instance.addEventListener('complete', function(e) {newLine            });newLine        }newLine        return script;newLine    } else if (script.playState == 1) {newLine        return script;newLine    } else {newLine        delete script.isPlay;newLine        delete script.playState;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "sound_from_to": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 %2 초 부터 %3 초까지 재생하기 %4",
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
                    "type": "text",
                    "params": [
                        "1"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "sound_from_to"
        },
        "paramsKeyMap": {
            "SOUND": 0,
            "START": 1,
            "END": 2
        },
        "class": "",
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    var soundId = script.getField(\"SOUND\", script);newLine    var sound = sprite.parent.getSound(soundId);newLinenewLine    if (sound) {newLine        var start = script.getNumberValue(\"START\", script)*1000;newLine        var end = script.getNumberValue(\"END\", script)*1000;newLine        createjs.Sound.play(sound.id, {newLine            startTime: Math.min(start, end),newLine            duration: Math.max(start, end) - Math.min(start, end)newLine        });newLine    }newLine    return script.callReturn();newLine}_dummy"
    },
    "sound_from_to_and_wait": {
        "color": "#A4D01D",
        "skeleton": "basic",
        "statements": [],
        "template": "소리 %1 %2 초 부터 %3 초까지 재생하고 기다리기 %4",
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
                    "type": "text",
                    "params": [
                        "1"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
                },
                null
            ],
            "type": "sound_from_to_and_wait"
        },
        "paramsKeyMap": {
            "SOUND": 0,
            "START": 1,
            "END": 2
        },
        "class": "sound_play",
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    if (!script.isPlay) {newLine        script.isPlay = true;newLine        script.playState = 1;newLine        var sound = sprite.parent.getSound(script.getField(\"SOUND\", script));newLine        if (sound) {newLine            var start = script.getNumberValue(\"START\", script)*1000;newLine            var end = script.getNumberValue(\"END\", script)*1000;newLine            var startValue = Math.min(start, end);newLine            var endValue = Math.max(start, end);newLine            var duration = endValue - startValue;newLinenewLine            createjs.Sound.play(sound.id, {newLine                startTime: startValue,newLine                duration: durationnewLine            });newLinenewLine            setTimeout(function() {newLine                script.playState = 0;newLine            }, duration)newLine        }newLine        return script;newLine    } else if (script.playState == 1) {newLine        return script;newLine    } else {newLine        delete script.isPlay;newLine        delete script.playState;newLine        return script.callReturn();newLine    }newLine}_dummy"
    },
    "when_run_button_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 시작하기 버튼을 클릭했을 때",
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
            "params": [
                null
            ],
            "type": "when_run_button_click"
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy",
        "event": "start"
    },
    "press_some_key": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 %2 키를 눌렀을 때 %3",
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
                    [
                        "q",
                        "81"
                    ],
                    [
                        "w",
                        "87"
                    ],
                    [
                        "e",
                        "69"
                    ],
                    [
                        "r",
                        "82"
                    ],
                    [
                        "a",
                        "65"
                    ],
                    [
                        "s",
                        "83"
                    ],
                    [
                        "d",
                        "68"
                    ],
                    [
                        "위쪽 화살표",
                        "38"
                    ],
                    [
                        "아래쪽 화살표",
                        "40"
                    ],
                    [
                        "왼쪽 화살표",
                        "37"
                    ],
                    [
                        "오른쪽 화살표",
                        "39"
                    ],
                    [
                        "엔터",
                        "13"
                    ],
                    [
                        "스페이스",
                        "32"
                    ]
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
            "params": [
                null,
                null,
                null
            ]
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "when_some_key_pressed": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 %2 키를 눌렀을 때",
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
            "params": [
                null,
                "67"
            ],
            "type": "when_some_key_pressed"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy",
        "event": "keyPress"
    },
    "mouse_clicked": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 마우스를 클릭했을 때",
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
            "params": [
                null
            ],
            "type": "mouse_clicked"
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "mouse_click_cancled": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 마우스 클릭을 해제했을 때",
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
            "params": [
                null
            ],
            "type": "mouse_click_cancled"
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "when_object_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 오브젝트를 클릭했을 때",
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
            "params": [
                null
            ],
            "type": "when_object_click"
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "when_object_click_canceled": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 오브젝트 클릭을 해제했을 때",
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
            "params": [
                null
            ],
            "type": "when_object_click_canceled"
        },
        "class": "event",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "when_some_key_click": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 키를 눌렀을 때",
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
            "params": [
                null
            ]
        },
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy"
    },
    "when_message_cast": {
        "color": "#3BBD70",
        "skeleton": "basic_event",
        "statements": [],
        "template": "%1 %2 신호를 받았을 때",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "when_message_cast"
        },
        "paramsKeyMap": {
            "VALUE": 1
        },
        "class": "message",
        "isNotFor": [
            "message"
        ],
        "func": "dummy_function (sprite, script) {newLine    return script.callReturn();newLine}_dummy",
        "event": "when_message_cast"
    },
    "message_cast": {
        "color": "#3BBD70",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 신호 보내기 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "message_cast"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "message",
        "isNotFor": [
            "message"
        ],
        "func": "dummy_function (sprite, script) {newLine    var value = script.getField(\"VALUE\", script);newLinenewLine    var arr = Entry.variableContainer.messages_;newLine    var isExist = Entry.isExist(value, 'id', arr);newLinenewLine    if (value == 'null' || !isExist)newLine        throw new Error('value can not be null or undefined');newLinenewLine    Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent,newLine                              [\"when_message_cast\", value]);newLine    return script.callReturn();newLine}_dummy"
    },
    "message_cast_wait": {
        "color": "#3BBD70",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 신호 보내고 기다리기 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "message_cast_wait"
        },
        "paramsKeyMap": {
            "VALUE": 0
        },
        "class": "message",
        "isNotFor": [
            "message"
        ],
        "func": "dummy_function (sprite, script) {newLine    if (script.runningScript) {newLine        if (script.runningScript.length) {newLine            Entry.engine.computeFunction(script);newLine            return script;newLine        } else {newLine            delete script.runningScript;newLine            return script.callReturn();newLine        }newLine    } else {newLine        var value = script.getField(\"VALUE\", script);newLine        var arr = Entry.variableContainer.messages_;newLine        var isExist = Entry.isExist(value, 'id', arr);newLine        if (value == 'null' || !isExist)newLine            throw new Error('value can not be null or undefined');newLine        var runningScript = []newLinenewLine        Entry.container.mapEntityIncludeCloneOnScene(function(entity, param) {newLine            var eventName = param[0];newLine            var keyCode = param[1];newLine            var blocks = entity.parent.script.childNodes;newLine            //handle clone entitynewLine            for (var i=0; i<blocks.length; i++) {newLine                var block = blocks[i];newLine                var value = Entry.Xml.getField(\"VALUE\", block);newLine                if (Entry.Xml.isTypeOf(eventName, block) &&newLine                   (value == keyCode)) {newLine                    var script = new Entry.Script(entity);newLine                    script.init(block);newLine                    runningScript.push(script);newLine                }newLine            };newLine        }, [\"when_message_cast\", value]);newLinenewLine        script.runningScript = runningScript;newLine        return script;newLine    }newLine}_dummy"
    },
    "text": {
        "color": "#FFD974",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1",
        "params": [
            {
                "type": "TextInput",
                "value": 10
            }
        ],
        "events": {},
        "def": {
            "params": [],
            "type": "text"
        },
        "paramsKeyMap": {
            "NAME": 0
        },
        "class": "text",
        "isNotFor": [
            "sprite"
        ],
        "func": "dummy_function (sprite, script) {newLine    return script.getField('NAME', script);newLine}_dummy",
        "isPrimitive": true
    },
    "text_write": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 라고 글쓰기",
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
        "isNotFor": [
            "sprite"
        ],
        "func": "dummy_function (sprite, script) {newLine    var text = script.getStringValue(\"VALUE\", script);newLine    text = Entry.convertToRoundedDecimals(text, 3);newLine    sprite.setText(text);newLine    return script.callReturn();newLine}_dummy"
    },
    "text_append": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 라고 뒤에 이어쓰기",
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
        "isNotFor": [
            "sprite"
        ],
        "func": "dummy_function (sprite, script) {newLine    var text = script.getStringValue(\"VALUE\", script);newLine    sprite.setText(Entry.convertToRoundedDecimals(sprite.getText(),3) +newLine                  Entry.convertToRoundedDecimals(text, 3));newLine    return script.callReturn();newLine}_dummy"
    },
    "text_prepend": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 라고 앞에 추가하기",
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
        "isNotFor": [
            "sprite"
        ],
        "func": "dummy_function (sprite, script) {newLine    var text = script.getStringValue(\"VALUE\", script);newLine    sprite.setText(Entry.convertToRoundedDecimals(text, 3) +newLine                  Entry.convertToRoundedDecimals(sprite.getText(), 3));newLine    return script.callReturn();newLine}_dummy"
    },
    "text_flush": {
        "color": "#FFCA36",
        "skeleton": "basic",
        "statements": [],
        "template": "텍스트 모두 지우기",
        "params": [],
        "events": {},
        "def": {
            "params": [],
            "type": "text_flush"
        },
        "class": "text",
        "isNotFor": [
            "sprite"
        ],
        "func": "dummy_function (sprite, script) {newLine    sprite.setText('');newLine    return script.callReturn();newLine}_dummy"
    },
    "variableAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "template": "%1",
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
                null
            ]
        }
    },
    "listAddButton": {
        "skeleton": "basic_button",
        "color": "#eee",
        "template": "%1",
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
                null
            ]
        }
    },
    "change_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 에 %2 만큼 더하기 %3",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "variable",
            "variableNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var variableId = script.getField(\"VARIABLE\", script);newLine    var value = script.getNumberValue(\"VALUE\", script);newLine    var fixed = 0;newLinenewLine    value = Entry.parseNumber(value);newLine    if ((value == false && typeof value == 'boolean'))newLine        throw new Error('Type is not correct');newLine    var variable = Entry.variableContainer.getVariable(variableId, sprite);newLine    fixed = Entry.getMaxFloatPoint([value, variable.getValue()]);newLine    variable.setValue((value + variable.getValue()).toFixed(fixed));newLine    return script.callReturn();newLine}_dummy"
    },
    "set_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 를 %2 로 정하기 %3",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "variable",
            "variableNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var variableId = script.getField(\"VARIABLE\", script);newLine    var value = script.getValue(\"VALUE\", script);newLine    var variable = Entry.variableContainer.getVariable(variableId, sprite);newLine    variable.setValue(value);newLine    return script.callReturn();newLine}_dummy"
    },
    "show_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "변수 %1 보이기 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "show_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable_visibility",
        "isNotFor": [
            "variable",
            "variableNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var variableId = script.getField(\"VARIABLE\", script);newLine    var variable = Entry.variableContainer.getVariable(variableId, sprite);newLine    variable.setVisible(true);newLine    variable.updateView();newLine    return script.callReturn();newLine}_dummy"
    },
    "hide_variable": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "변수 %1 숨기기 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null,
                null
            ],
            "type": "hide_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable_visibility",
        "isNotFor": [
            "variable",
            "variableNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var variableId = script.getField(\"VARIABLE\", script);newLine    var variable = Entry.variableContainer.getVariable(variableId, sprite);newLine    variable.setVisible(false);newLine    return script.callReturn();newLine}_dummy"
    },
    "get_variable": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 값",
        "params": [
            {
                "type": "DropdownDynamic",
                "value": null,
                "menuName": "variables",
                "fontSize": 11
            }
        ],
        "events": {
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null
            ],
            "type": "get_variable"
        },
        "paramsKeyMap": {
            "VARIABLE": 0
        },
        "class": "variable",
        "isNotFor": [
            "variable",
            "variableNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var variableId = script.getField(\"VARIABLE\", script);newLine    var variable = Entry.variableContainer.getVariable(variableId, sprite);newLine    return variable.getValue();newLine}_dummy"
    },
    "ask_and_wait": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 을(를) 묻고 대답 기다리기 %2",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [
                        "안녕!"
                    ]
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
        "func": "dummy_function (sprite, script) {newLine    var inputModel = Entry.container.inputValue,newLine        inputView = Entry.stage.inputField,newLine        message = script.getValue(\"VALUE\", script);newLinenewLine    if (!message)newLine        throw new Error('message can not be empty');newLinenewLine    if (inputModel.sprite == sprite &&newLine        inputView && !inputView._isHidden) {newLine        return script;newLine    } else if (inputModel.sprite != sprite && script.isInit) {newLine        if(sprite.dialog)newLine            sprite.dialog.remove();newLine        delete script.isInit;newLine        return script.callReturn();newLine    } else if (inputModel.complete &&newLine               inputModel.sprite == sprite &&newLine               inputView._isHidden && script.isInit) {newLine        if(sprite.dialog)newLine            sprite.dialog.remove();newLine        delete inputModel.complete;newLine        delete script.isInit;newLine        return script.callReturn();newLine    } else {newLine        message = Entry.convertToRoundedDecimals(message, 3);newLine        new Entry.Dialog(sprite, message, 'speak');newLine        Entry.stage.showInputField();newLine        inputModel.script = script;newLine        inputModel.sprite = sprite;newLine        script.isInit = true;newLine        return script;newLine    }newLine}_dummy"
    },
    "get_canvas_input_value": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Text",
                "text": "대답",
                "color": "#fff"
            }
        ],
        "events": {
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                null
            ],
            "type": "get_canvas_input_value"
        },
        "class": "ask",
        "isNotFor": [],
        "func": "dummy_function (sprite, script) {newLine    return Entry.container.getInputValue();newLine}_dummy"
    },
    "add_value_to_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 항목을 %2 에 추가하기 %3",
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var value = script.getValue(\"VALUE\", script);newLine    var list = Entry.variableContainer.getList(listId, sprite);newLinenewLine    if (!list.array_)newLine        list.array_ = [];newLine    list.array_.push({'data' : value});newLine    list.updateView();newLine    return script.callReturn();newLine}_dummy"
    },
    "remove_value_from_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 번째 항목을 %2 에서 삭제하기 %3",
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
                    "params": [
                        "1"
                    ]
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
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var value = script.getValue(\"VALUE\", script);newLine    var list = Entry.variableContainer.getList(listId, sprite);newLinenewLine    if (!list.array_ || isNaN(value) || value > list.array_.length)newLine        throw new Error('can not remove value from array');newLinenewLine    list.array_.splice(value-1,1);newLinenewLine    list.updateView();newLine    return script.callReturn();newLine}_dummy"
    },
    "insert_value_to_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1 을(를) %2 의 %3 번째에 넣기 %4",
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
                    "params": [
                        "10"
                    ]
                },
                null,
                {
                    "type": "text",
                    "params": [
                        "1"
                    ]
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
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var data = script.getValue(\"DATA\", script);newLine    var index = script.getValue(\"INDEX\", script);newLine    var list = Entry.variableContainer.getList(listId, sprite);newLinenewLine    if (!list.array_ || isNaN(index) || index == 0 || index > list.array_.length +1)newLine        throw new Error('can not insert value to array');newLinenewLine    list.array_.splice(index-1, 0, {'data': data});newLine    list.updateView();newLine    return script.callReturn();newLine}_dummy"
    },
    "change_value_list_index": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "%1    %2 번째 항목을 %3 (으)로 바꾸기 %4",
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
                    "params": [
                        "1"
                    ]
                },
                {
                    "type": "text",
                    "params": [
                        "10"
                    ]
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
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var data = script.getValue(\"DATA\", script);newLine    var index = script.getValue(\"INDEX\", script);newLine    var list = Entry.variableContainer.getList(listId, sprite);newLinenewLine    if (!list.array_ || isNaN(index) || index > list.array_.length)newLine        throw new Error('can not insert value to array');newLinenewLine    list.array_[index-1].data = data;newLine    list.updateView();newLine    return script.callReturn();newLine}_dummy"
    },
    "value_of_index_from_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1 의 %2 번째 항목",
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
                    "type": "options_for_list"
                }
            ],
            "type": "value_of_index_from_list"
        },
        "paramsKeyMap": {
            "LIST": 0,
            "INDEX": 1
        },
        "class": "list_element",
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var index = script.getValue(\"INDEX\", script);newLine    var list = Entry.variableContainer.getList(listId, sprite);newLine    index = Entry.getListRealIndex(index, list);newLinenewLine    if (!list.array_ || isNaN(index) || index > list.array_.length)newLine        throw new Error('can not insert value to array');newLinenewLine    return list.array_[index-1].datanewLine}_dummy"
    },
    "length_of_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  항목 수",
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
            "params": [
                null
            ],
            "type": "length_of_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list",
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var list = Entry.variableContainer.getList(listId);newLinenewLine    return list.array_.length;newLine}_dummy"
    },
    "show_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "리스트 %1 보이기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "show_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list_visibility",
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var list = Entry.variableContainer.getList(listId);newLinenewLine    list.setVisible(true);newLine    return script.callReturn();newLine}_dummy"
    },
    "hide_list": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "리스트 %1 숨기기 %2",
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
            "params": [
                null,
                null
            ],
            "type": "hide_list"
        },
        "paramsKeyMap": {
            "LIST": 0
        },
        "class": "list_visibility",
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var list = Entry.variableContainer.getList(listId);newLinenewLine    list.setVisible(false);newLine    return script.callReturn();newLine}_dummy"
    },
    "options_for_list": {
        "color": "#E457DC",
        "skeleton": "basic_string_field",
        "statements": [],
        "template": "%1  ",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "첫번째",
                        "FIRST"
                    ],
                    [
                        "마지막",
                        "LAST"
                    ],
                    [
                        "무작위",
                        "RANDOM"
                    ]
                ],
                "value": "FIRST",
                "fontSize": 11
            }
        ],
        "events": {},
        "def": {
            "params": [
                null
            ]
        },
        "paramsKeyMap": {
            "OPERATOR": 0
        },
        "func": "dummy_function (sprite, script) {newLine    return script.getField(\"OPERATOR\", script);newLine}_dummy"
    },
    "set_visible_answer": {
        "color": "#E457DC",
        "skeleton": "basic",
        "statements": [],
        "template": "대답 %1 %2",
        "params": [
            {
                "type": "Dropdown",
                "options": [
                    [
                        "보이기",
                        "SHOW"
                    ],
                    [
                        "숨기기",
                        "HIDE"
                    ]
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
            "whenBlockAdd": [
                null
            ],
            "whenBlockDestroy": [
                null
            ]
        },
        "def": {
            "params": [
                "SHOW",
                null
            ],
            "type": "set_visible_answer"
        },
        "paramsKeyMap": {
            "BOOL": 0
        },
        "class": "ask",
        "isNotFor": [
            ""
        ],
        "func": "dummy_function (sprite, script) {newLine    var bool = script.getField(\"BOOL\", script);newLine    if (bool == 'HIDE')newLine        Entry.container.inputValue.setVisible(false);newLine    elsenewLine        Entry.container.inputValue.setVisible(true);newLine    return script.callReturn();newLine}_dummy"
    },
    "is_included_in_list": {
        "color": "#E457DC",
        "skeleton": "basic_boolean_field",
        "statements": [],
        "template": "%1 에 %2 이 포함되어 있는가?",
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
                    "params": [
                        "10"
                    ]
                }
            ],
            "type": "is_included_in_list"
        },
        "paramsKeyMap": {
            "LIST": 0,
            "DATA": 1
        },
        "class": "list",
        "isNotFor": [
            "list",
            "listNotExist"
        ],
        "func": "dummy_function (sprite, script) {newLine    var listId = script.getField(\"LIST\", script);newLine    var data = script.getStringValue(\"DATA\", script);newLine    var list = Entry.variableContainer.getList(listId);newLine    if (!list)newLine        return false;newLine    var arr = list.array_;newLinenewLine    for (var i=0, len=arr.length; i<len; i++) {newLine        if (arr[i].data.toString() == data.toString())newLine            return true;newLine    }newLine    return false;newLine}_dummy"
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
        "template": "test mutant block",
        "params": [],
        "changeEvent": {
            "_listeners": []
        }
    },
    "jr_start": {
        "skeleton": "pebble_event",
        "event": "start",
        "color": "#3BBD70",
        "template": "%1",
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
        "template": "%1 반복",
        "params": [
            {
                "type": "Dropdown",
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
                "value": 3,
                "fontSize": 14,
                "roundValue": 3
            }
        ],
        "statements": [
            {
                "accept": "pebble_basic"
            }
        ]
    },
    "jr_item": {
        "skeleton": "pebble_basic",
        "color": "#F46C6C",
        "template": "꽃 모으기 %1",
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
        "template": "연필 줍기 %1",
        "params": [
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
        "template": "위쪽 %1",
        "params": [
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
        "template": "오른쪽 %1",
        "params": [
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
        "template": "아래쪽 %1",
        "params": [
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
        "template": "왼쪽 %1",
        "params": [
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
        "template": "%1 시작 버튼을 눌렀을 떄",
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
    "jr_go_straight": {
        "skeleton": "basic",
        "color": "#A751E3",
        "template": "앞으로 가기 %1",
        "params": [
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
        "template": "왼쪽으로 돌기 %1",
        "params": [
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
        "template": "오른쪽으로 돌기 %1",
        "params": [
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
        "template": "천천히 가기 %1",
        "params": [
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
        "template": "%1 만날 때 까지 반복하기 %2",
        "syntax": [
            "BasicWhile",
            "true"
        ],
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/jr_goal_image.png",
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
    "jr_if_construction": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "template": "만약 %1 앞에 있다면 %2",
        "params": [
            {
                "type": "Image",
                "img": "/img/assets/ntry/bitmap/jr/jr_construction_image.png",
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
    "jr_if_speed": {
        "skeleton": "basic_loop",
        "color": "#498DEB",
        "template": "만약 %1 앞에 있다면 %2",
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
        "template": "%1 시작하기를 클릭했을 때",
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
        "template": "뛰어넘기%1",
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
        "template": "%1 번 반복하기%2",
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
        "template": "%1 this is test block %2",
        "params": [
            {
                "type": "Angle",
                "value": "90"
            },
            {
                "type": "Dropdown",
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
            }
        ]
    },
    "maze_repeat_until_1": {
        "skeleton": "basic_loop",
        "mode": "maze",
        "color": "#498DEB",
        "template": "%1 만날 때 까지 반복%2",
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
        "template": "모든 %1 만날 때 까지 반복%2",
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
        "template": "만약 앞에 %1 있다면%2",
        "syntax": [
            "BasicIf",
            "front == \"wall\""
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
        "template": "만약 앞에 %1 있다면%2",
        "syntax": [
            "BasicIf",
            "front == \"bee\""
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
        "template": "약속 불러오기%1",
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
        "template": "약속하기%1",
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
        "template": "만약 앞에 %1 있다면%2",
        "syntax": [
            "BasicIf",
            "front == \"banana\""
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
        "template": "만약 앞에 %1 있다면%2",
        "syntax": [
            "BasicIf",
            "front == \"wall\""
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
        "template": "앞으로 한 칸 이동%1",
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
        "template": "왼쪽으로 회전%1",
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
        "template": "오른쪽으로 회전%1",
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
        "template": "%1 this is test block %2",
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
            }
        ]
    },
    "basic_button": {
        "skeleton": "basic_button",
        "color": "#eee",
        "template": "%1",
        "params": [
            {
                "type": "Text",
                "text": "basic button",
                "color": "#333",
                "align": "center"
            }
        ]
    }
}
