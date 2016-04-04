"use strict";


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
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        sq.leftEye = 0;
        sq.rightEye = 0;
    } else if (direction == 'LEFT') sq.leftEye = 0;
    else sq.rightEye = 0;

    return script.callReturn();
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("STATE", script);
    if (direction == 'ON')
        sq.bodyLed = 1;
    else sq.bodyLed = 0;

    return script.callReturn();
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("STATE", script);
    if (direction == 'ON')
        sq.frontLed = 1;
    else sq.frontLed = 0;

    return script.callReturn();
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        delete sq.note;
        sq.buzzer = 440;
        var timeValue = 0.2 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.buzzer = 0;
        return script.callReturn();
    }
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
  },
  "albert_hand_found": {
    "color": "#00979D",
    "skeleton": "basic_boolean_field",
    "statements": [],
    "template": "손 찾음?",
    "params": [],
    "events": {},
    "func": function (sprite, script) {
    var pd = Entry.hw.portData;
    return pd.leftProximity > 40 ||
        pd.rightProximity > 40;
},
    "class": "albert_novice",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = 30;
        sq.rightWheel = 30;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
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
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -30 : 30;
        script.rightValue = isLeft ? 30 : -30;
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
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
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var note = script.getNumberField("NOTE", script);
        var octave = script.getNumberField("OCTAVE", script);
        var beat = script.getNumberValue("VALUE", script);
        var tempo = Entry.Albert.tempo;
        note += (octave-1)*12;
        var timeValue = beat*60*1000/tempo;
        script.note = note;

        script.isStart = true;
        script.timeFlag = 1;
        if (timeValue > 100) {
            setTimeout(function() {
                sq.note = 0;
            }, timeValue-100);
        }
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.note = script.note;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.note;
        Entry.engine.isContinue = false;
        sq.note = 0;
        return script.callReturn();
    }

},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue('VALUE');
        timeValue = timeValue*60*1000/Entry.Albert.tempo;
        sq.note = 0;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.isStart;
        delete script.timeFlag;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    Entry.Albert.tempo += script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    Entry.Albert.tempo = script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "intermediate",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var pd = Entry.hw.portData;
    var left = sq.leftWheel != undefined ?
        sq.leftWheel : pd.leftWheel;
    var right = sq.rightWheel != undefined ?
        sq.rightWheel : pd.rightWheel;

    left += script.getNumberValue('LEFT');
    right += script.getNumberValue('RIGHT');

    sq.leftWheel = left;
    sq.rightWheel = right;

    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = script.getNumberValue('LEFT');
    sq.rightWheel = script.getNumberValue('RIGHT');
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = 0;
    sq.rightWheel = 0;

    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData;
        value = script.getNumberValue('VALUE');
    delete sq.note;
    sq.buzzer = sq.buzzer == undefined ?
        value : sq.buzzer + value;
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    delete sq.note;
    sq.buzzer = script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    Entry.hw.sendQueue.buzzer = 0;
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData,
        port = script.getField('PORT');

    return sq[port] != undefined ?
        sq[port] : pd[port]
},
    "class": "rank",
    "isNotFor": [
      "albert"
    ]
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
    "func": function (sprite, script) {
    return script.getStringField("NAME");
}
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
    "template": "신호 %1 의 숫자 결과값",
    "params": [
      {
        "type": "Block",
        "accept": "stringMagnet"
      }
    ],
    "events": {},
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
    "template": "신호 %1 의 글자 결과값",
    "params": [
      {
        "type": "Block",
        "accept": "stringMagnet"
      }
    ],
    "events": {},
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
    "func": function (sprite, script) {
    return script.getStringField("PORT");
}
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
    "func": function (sprite, script) {
    return script.getStringField("PORT");
}
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
    "func": function (sprite, script) {
    return script.getStringField("PORT");
}
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
    "func": function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    return Entry.hw.getAnalogPortValue(signal[1]);
},
    "class": "arduino_value",
    "isNotFor": [
      "arduino"
    ]
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
    "func": function (sprite, script) {
    var signal = script.getNumberValue("VALUE", script);
    return Entry.hw.getDigitalPortValue(signal);
},
    "class": "arduino_value",
    "isNotFor": [
      "arduino"
    ]
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
    "func": function (sprite, script) {
    var port = script.getNumberValue("VALUE");
    var operator = script.getField("OPERATOR");
    var value = operator == "on" ? 255 : 0;
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
},
    "class": "arduino_set",
    "isNotFor": [
      "arduino"
    ]
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
    "func": function (sprite, script) {
    var port = script.getNumberValue("PORT");
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 255);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
},
    "class": "arduino_set",
    "isNotFor": [
      "arduino"
    ]
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
},
    "class": "arduino",
    "isNotFor": [
      "arduino"
    ]
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
    "func": function (sprite, script) {
    return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
},
    "class": "sensorBoard",
    "isNotFor": [
      "sensorBoard"
    ]
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
    "func": function (sprite, script) {
    return Entry.hw.getDigitalPortValue(script.getNumberField("PORT", script));
},
    "class": "sensorBoard",
    "isNotFor": [
      "sensorBoard"
    ]
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
    "func": function (sprite, script) {
    Entry.hw.setDigitalPortValue(script.getField("PORT"),
                                 script.getNumberField("OPERATOR"));
    return script.callReturn();
},
    "class": "sensorBoard",
    "isNotFor": [
      "sensorBoard"
    ]
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
    "func": function (sprite, script) {
  var port = script.getStringField("PORT");
  console.log(port);
  console.log(Entry.hw.portData[port]);
  return Entry.hw.portData[port].value;
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
  return Entry.hw.portData[script.getStringField("PORT")].value === 0;
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
  Entry.hw.sendQueue["LEDR"] = 0;
  Entry.hw.sendQueue["LEDG"] = 0;
  Entry.hw.sendQueue["LEDB"] = 0;
  return script.callReturn();
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
    var port = script.getStringField("VALUE");
    Entry.hw.sendQueue["LEDR"] = parseInt(port.substr(1,2), 16);
    Entry.hw.sendQueue["LEDG"] = parseInt(port.substr(3,2), 16);
    Entry.hw.sendQueue["LEDB"] = parseInt(port.substr(5,2), 16);
    return script.callReturn();
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE");
    value = Math.min(value, Entry.Bitbrick.dcMaxValue);
    value = Math.max(value, Entry.Bitbrick.dcMinValue);

    Entry.hw.sendQueue[script.getStringField("PORT")] =
        value + 128;
    return script.callReturn();
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
    var isFront = script.getStringField("DIRECTION") === "CW";
    var value = script.getNumberValue("VALUE");
    value = Math.min(value, Entry.Bitbrick.dcMaxValue);
    value = Math.max(value, 0);

    Entry.hw.sendQueue[script.getStringField("PORT")] =
        isFront ? value + 128 : 128 - value;
    return script.callReturn();
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE") + 1;
    value = Math.min(value, Entry.Bitbrick.servoMaxValue);
    value = Math.max(value, Entry.Bitbrick.servoMinValue);
    Entry.hw.sendQueue[script.getStringField("PORT")] = value;
    return script.callReturn();
},
    "class": "condition",
    "isNotFor": [
      "bitbrick"
    ]
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
    "func": function (sprite, script) {

    if (sprite.brush)
        sprite.brush.stop = false;
    else
        Entry.setBasicBrush(sprite);

    Entry.stage.sortZorder();
    sprite.brush.moveTo(sprite.getX(), sprite.getY()*-1);

    return script.callReturn();
},
    "class": "brush_control",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    if (sprite.brush && sprite.shape)
        sprite.brush.stop = true;

    return script.callReturn();
},
    "class": "brush_control",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_color",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_color",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_thickness",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_thickness",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_opacity",
    "isNotFor": [
      "textBox"
    ]
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

},
    "class": "brush_opacity",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_clear",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    sprite.parent.addStampEntity(sprite);

    return script.callReturn();
},
    "class": "stamp",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "brush_opacity",
    "isNotFor": [
      "textBox"
    ]
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

},
    "class": "brush_opacity",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    return script.getField('NUM');
},
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
    "func": function (sprite, script) {
    return script.getNumberField("ANGLE");
}
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
    "func": function (sprite, script) {
    return sprite.getX();
},
    "class": "calc",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return sprite.getY();
},
    "class": "calc",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return parseFloat(sprite.getRotation().toFixed(1));
}
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
    "func": function (sprite, script) {
    var o = script.getField("OPERATOR", script);
    if (o.toUpperCase() == 'DIRECTION')
        return parseFloat(sprite.getDirection().toFixed(1));
    else
        return parseFloat(sprite.getRotation().toFixed(1));
},
    "class": "calc",
    "isNotFor": []
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
},
    "class": "calc_distance",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var targetCoordinate = script.getField("VALUE", script);
    if (targetCoordinate === 'x') {
        return Number(Entry.stage.mouseCoordinate.x);
    } else {
        return Number(Entry.stage.mouseCoordinate.y);
    }
},
    "class": "calc",
    "isNotFor": []
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
},
    "class": "calc",
    "isNotFor": []
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
        "fontSize": 11,
        "arrowColor": 'red',
      },
      {
        "type": "Block",
        "accept": "stringMagnet"
      }
    ],
    "events": {},
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
},
    "class": "calc",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue % rightValue;
},
    "class": "calc",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return Math.floor(leftValue/rightValue);
},
    "class": "calc",
    "isNotFor": []
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
},
    "class": "calc",
    "isNotFor": []
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
},
    "class": "calc",
    "isNotFor": []
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
},
    "class": "calc_date",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var soundId = script.getField("VALUE", script);
    var soundsArr = sprite.parent.sounds;

    for (var i = 0; i < soundsArr.length; i++) {
        if (soundsArr[i].id == soundId)
            return soundsArr[i].duration;
    }
},
    "class": "calc_duration",
    "isNotFor": []
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
    "func": function (sprite, script) {
    Entry.engine.updateProjectTimer(0);
    return script.callReturn();
},
    "class": "calc_timer",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var action = script.getField("ACTION", script);
    var timer = Entry.engine.projectTimer;
    if (action == 'SHOW')
        timer.setVisible(true);
    else
        timer.setVisible(false);

    return script.callReturn();
},
    "class": "calc_timer",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return Entry.container.inputValue.getValue();
}
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
    "func": function (sprite, script) {
    return Entry.engine.projectTimer.getValue();
},
    "class": "calc_timer",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var str = script.getStringValue("LEFTHAND", script);
    var index = script.getNumberValue("RIGHTHAND", script)-1;
    if (index <0 || index >str.length-1)
        throw new Error();
    else
        return str[index];
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.getStringValue("STRING", script).length;
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var str = script.getStringValue("STRING", script);
    var start = script.getNumberValue("START", script)-1;
    var end = script.getNumberValue("END", script)-1;
    var strLen = str.length-1;
    if (start <0 || end<0 || start>strLen || end>strLen)
        throw new Error();
    else
        return str.substring(Math.min(start, end), Math.max(start, end)+1);
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.getStringValue("STRING", script).
        replace(
            new RegExp(script.getStringValue("OLD_WORD", script), 'gm'),
            script.getStringValue("NEW_WORD", script)
        );
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.getStringValue("STRING", script)[script.getField("CASE", script)]();
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var str = script.getStringValue("LEFTHAND", script);
    var target = script.getStringValue("RIGHTHAND", script);
    var index = str.indexOf(target);
    return index > -1?index+1:0;
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getStringValue("VALUE1", script);
    var rightValue = script.getStringValue("VALUE2", script);

    if (!isNaN(leftValue))
        leftValue = Entry.convertToRoundedDecimals(leftValue, 3);
    if (!isNaN(rightValue))
        rightValue = Entry.convertToRoundedDecimals(rightValue, 3);
    return leftValue + rightValue;
},
    "class": "calc_string",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return createjs.Sound.getVolume() * 100;
},
    "class": "calc",
    "isNotFor": [
      ""
    ]
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
},
    "class": "calc",
    "isNotFor": [
      ""
    ]
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
},
    "class": "calc_timer",
    "isNotFor": [
      ""
    ]
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
},
    "class": "delay",
    "isNotFor": []
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
},
    "class": "repeat",
    "isNotFor": []
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
    "func": function (sprite, script) {
    //return script.getStatement("DO", script);
    script.isLooped = true;
    return script.getStatement('DO');
},
    "class": "repeat",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var parentScript = script;
    while (parentScript.type.substr(0, 6).toUpperCase() != "REPEAT" &&
        parentScript.parentScript) {
        parentScript = parentScript.parentScript;
        delete parentScript.isLooped;
        delete parentScript.iterCount;
    }
    var nextScript = parentScript.callReturn();
    if (parentScript.statements && nextScript) {
        return nextScript;
    }
    else if (parentScript)
        return null;
    else
        return script.callReturn();
},
    "class": "repeat",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getBooleanValue("BOOL", script);
    if (value) {
        return script.callReturn();
    } else {
        return script;
    }
},
    "class": "wait",
    "isNotFor": []
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
},
    "class": "condition",
    "isNotFor": []
  },
  "if_else": {
    "color": "#498deb",
    "skeleton": "basic_loop",
    "statements": [
      {
        "accept": "basic"
      },
      {
        "accept": "basic"
      }
    ],
    "template": "만일 %1 이라면 %2 아니면",
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
},
    "class": "condition",
    "isNotFor": []
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
},
    "class": "clone",
    "isNotFor": []
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
    "func": function (sprite, script) {
    if (!sprite.isClone)
        return script.callReturn();
    sprite.removeClone();
    return;
},
    "class": "clone",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "clone",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getBooleanValue("BOOL", script);

    if (script.getField("OPTION", script) == 'until')
        value = !value;
    script.isLooped = value;

    return value ? script.getStatement("DO", script) :
        script.callReturn();
},
    "class": "repeat",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var target = script.getField("TARGET", script);
    var container = Entry.container;

    switch(target) {
        case 'all':
            container.mapEntityIncludeCloneOnScene(function (entity){
                entity.clearScript();
            });
            break;
        case 'thisObject':
            sprite.clearScript();
            var clonedEntities = sprite.parent.clonedEntities;
            clonedEntities.map(function (entity) {
                entity.clearScript();
            });
            break;
        case 'thisOnly':
            sprite.clearScript();
            break;
        case 'thisThread':
            break;
        case 'otherThread':
            sprite.clearScript();
            var clonedEntities = sprite.parent.clonedEntities;
            clonedEntities.map(function (entity) {
                entity.clearScript();
            });
            return script.callReturn();
    }
    return null;
},
    "class": "terminate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    Entry.engine.toggleStop();
    Entry.engine.toggleRun();
},
    "class": "terminate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var clonedEntities = sprite.parent.getClonedEntities();
    clonedEntities.map(function (entity) {
        entity.removeClone();
    });
    clonedEntities = null;

    return script.callReturn();
},
    "class": "clone",
    "isNotFor": []
  },
  functionAddButton: {
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
            function() {
                Entry.variableContainer.createFunction();
            }
      ]
    }
  },
  function_field_label: {
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
  function_field_string: {
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
        "accept": "basic_param",
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
        sq.leftWheel = 50;
        sq.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
        sq.leftWheel = -50;
        sq.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -50 : 50;
        script.rightValue = isLeft ? 50 : -50;
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
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    var color = Number(script.getField("COLOR", script));
    if (direction == 'FRONT') {
        sq.leftLed = color;
        sq.rightLed = color;
    } else if (direction == 'LEFT')
        sq.leftLed = color;
    else
        sq.rightLed = color;

    return script.callReturn();
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var direction = script.getField("DIRECTION", script);
    if (direction == 'FRONT') {
        sq.leftLed = 0;
        sq.rightLed = 0;
    } else if (direction == 'LEFT') sq.leftLed = 0;
    else sq.rightLed = 0;

    return script.callReturn();
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        delete sq.note;
        sq.buzzer = 440;
        var timeValue = 0.2 * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.buzzer = 0;
        return script.callReturn();
    }
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
  },
  "hamster_hand_found": {
    "color": "#00979D",
    "skeleton": "basic_boolean_field",
    "statements": [],
    "template": "손 찾음?",
    "params": [],
    "events": {},
    "func": function (sprite, script) {
    var pd = Entry.hw.portData;
    return pd.leftProximity > 40 ||
        pd.rightProximity > 40;
},
    "class": "hamster_novice",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = 50;
        sq.rightWheel = 50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.leftWheel = -50;
        sq.rightWheel = -50;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        Entry.engine.isContinue = false;
        sq.leftWheel = 0;
        sq.rightWheel = 0;
        return script.callReturn();
    }
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var direction = script.getField("DIRECTION", script);
        var isLeft = direction == 'LEFT';
        script.leftValue = isLeft ? -50 : 50;
        script.rightValue = isLeft ? 50 : -50;
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue("VALUE") * 1000;
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
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        var note = script.getNumberField("NOTE", script);
        var octave = script.getNumberField("OCTAVE", script);
        var beat = script.getNumberValue("VALUE", script);
        var tempo = Entry.Hamster.tempo;
        note += (octave-1)*12;
        var timeValue = beat*60*1000/tempo;
        script.note = note;

        script.isStart = true;
        script.timeFlag = 1;
        if (timeValue > 100) {
            setTimeout(function() {
                sq.note = 0;
            }, timeValue-100);
        }
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else if (script.timeFlag == 1) {
        sq.note = script.note;
        return script;
    } else {
        delete script.timeFlag;
        delete script.isStart;
        delete script.note;
        Entry.engine.isContinue = false;
        sq.note = 0;
        return script.callReturn();
    }

},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    if (!script.isStart) {
        script.isStart = true;
        script.timeFlag = 1;
        var timeValue = script.getNumberValue('VALUE');
        timeValue = timeValue*60*1000/Entry.Hamster.tempo;
        sq.note = 0;
        setTimeout(function() {
            script.timeFlag = 0;
        }, timeValue);
        return script;
    } else {
        delete script.isStart;
        delete script.timeFlag;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    Entry.Hamster.tempo += script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    Entry.Hamster.tempo = script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "intermediate",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    var pd = Entry.hw.portData;
    var left = sq.leftWheel != undefined ?
        sq.leftWheel : pd.leftWheel;
    var right = sq.rightWheel != undefined ?
        sq.rightWheel : pd.rightWheel;

    left += script.getNumberValue('LEFT');
    right += script.getNumberValue('RIGHT');

    sq.leftWheel = left;
    sq.rightWheel = right;

    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = script.getNumberValue('LEFT');
    sq.rightWheel = script.getNumberValue('RIGHT');
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    sq.leftWheel = 0;
    sq.rightWheel = 0;

    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData;
        value = script.getNumberValue('VALUE');
    delete sq.note;
    sq.buzzer = sq.buzzer == undefined ?
        value : sq.buzzer + value;
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;
    delete sq.note;
    sq.buzzer = script.getNumberValue('VALUE');
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    Entry.hw.sendQueue.buzzer = 0;
    return script.callReturn();
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    var hw = Entry.hw,
        sq = hw.sendQueue,
        pd = hw.portData,
        port = script.getField('PORT');

    return sq[port] != undefined ?
        sq[port] : pd[port]
},
    "class": "rank",
    "isNotFor": [
      "hamster"
    ]
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
    "func": function (sprite, script) {
    return Entry.stage.isClick;
},
    "class": "boolean_input",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var keycode = Number(script.getField("VALUE", script));
    return Entry.pressedKeys.indexOf(keycode) >= 0;
},
    "class": "boolean_input",
    "isNotFor": []
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
                if (!entity.getVisible() || entity.isStamp)
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
                if (!entity.getVisible() || entity.isStamp)
                    continue;
                if (collision(object,entity.object,ath,true))
                    return true;
            }
        }
    }
    return false;
},
    "class": "boolean_collision",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getStringValue("LEFTHAND", script);
    var rightValue = script.getStringValue("RIGHTHAND", script);
    return leftValue == rightValue;
},
    "class": "boolean_compare",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue > rightValue;
},
    "class": "boolean_compare",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getNumberValue("LEFTHAND", script);
    var rightValue = script.getNumberValue("RIGHTHAND", script);
    return leftValue < rightValue;
},
    "class": "boolean_compare",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getBooleanValue("LEFTHAND", script);
    var rightValue = script.getBooleanValue("RIGHTHAND", script);
    return leftValue && rightValue;
},
    "class": "boolean",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var leftValue = script.getBooleanValue("LEFTHAND", script);
    var rightValue = script.getBooleanValue("RIGHTHAND", script);
    return leftValue || rightValue;
},
    "class": "boolean",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return !script.getBooleanValue("VALUE");
},
    "class": "boolean",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.children[0].textContent;
    return value == "true";
}
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
    "func": function (sprite, script) {
    return true;
},
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
    "func": function (sprite, script) {
    return false;
},
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
},
    "class": "boolean_compare",
    "isNotFor": []
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
    "func": function (sprite, script) {
    sprite.setVisible(true);
    return script.callReturn();
},
    "class": "visibility",
    "isNotFor": []
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
    "func": function (sprite, script) {
    sprite.setVisible(false);
    return script.callReturn();
},
    "class": "visibility",
    "isNotFor": []
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
},
    "class": "say",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "say",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    if(sprite.dialog)   sprite.dialog.remove();
    return script.callReturn();
},
    "class": "say",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    var imageId = script.getField("VALUE", script);
    var picture = sprite.parent.getPicture(imageId);
    sprite.setImage(picture);
    return script.callReturn();
},
    "class": "shape",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var picture = sprite.parent.getNextPicture(sprite.picture.id);
    sprite.setImage(picture);
    return script.callReturn();
},
    "class": "shape",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    sprite.resetFilter();
    return script.callReturn();
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
    "func": function (sprite, script) {
    var scaleValue = (script.getNumberValue("VALUE", script) + 100) / 100;
    sprite.setScaleX(sprite.getScaleX() * scaleValue);
    sprite.setScaleY(sprite.getScaleY() * scaleValue);
    return script.callReturn();
},
    "class": "scale",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var scaleValue = script.getNumberValue("VALUE", script) / 100;
    var snapshot = sprite.snapshot_;
    sprite.setScaleX(scaleValue * snapshot.scaleX);
    sprite.setScaleY(scaleValue * snapshot.scaleY);
    return script.callReturn();
},
    "class": "scale",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var sizeValue = script.getNumberValue("VALUE", script);
    sprite.setSize(sprite.getSize() + sizeValue);
    return script.callReturn();
},
    "class": "scale",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var sizeValue = script.getNumberValue("VALUE", script);
    sprite.setSize(sizeValue);
    return script.callReturn();
},
    "class": "scale",
    "isNotFor": []
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
    "func": function (sprite, script) {
    sprite.setScaleX((-1)*sprite.getScaleX());
    return script.callReturn();
},
    "class": "flip",
    "isNotFor": []
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
    "func": function (sprite, script) {
    sprite.setScaleY((-1)*sprite.getScaleY());
    return script.callReturn();
},
    "class": "flip",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var targetIndex = script.getField("VALUE", script);
    //var currentIndex = Entry.container.getBelongedObjectsToScene().indexOf(sprite.parent);
    var currentIndex = Entry.container.getCurrentObjects().indexOf(sprite.parent);

    if (currentIndex > -1) {
        Entry.container.moveElementByBlock(currentIndex, targetIndex);
        return script.callReturn();
    } else
        throw new Error('object is not available');
},
    "class": "z-index",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.getStringField("VALUE");
}
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
    "func": function (sprite, script) {
    var imageId = script.getStringValue("VALUE");
    var value = Entry.parseNumber(imageId);
    var picture = sprite.parent.getPicture(imageId);

    sprite.setImage(picture);
    return script.callReturn();
},
    "class": "shape",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "effect",
    "isNotFor": [
      "textBox"
    ]
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
},
    "class": "z-index",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(sprite.getX() + value * Math.cos((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
    sprite.setY(sprite.getY() - value * Math.sin((sprite.getRotation() + sprite.getDirection() - 90) / 180 * Math.PI));
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "walk",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(sprite.getX() + value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_relative",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setY(sprite.getY() + value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_relative",
    "isNotFor": []
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
    "func": function (sprite, script) {
    if (!script.isStart) {
        var timeValue;
        timeValue = script.getNumberValue("VALUE1", script);
        var xValue = script.getNumberValue("VALUE2", script) - sprite.getX();
        var yValue = script.getNumberValue("VALUE3", script) - sprite.getY();
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
},
    "class": "move_absolute",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setRotation(sprite.getRotation() + value);
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getField("VALUE", script);
    sprite.setRotation(sprite.getRotation() + Number(value));
    return script.callReturn();
},
    "class": "ebs",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setDirection(value);
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var targetEntity = Entry.container.getEntity(targetId);//fuck
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
    "func": function (sprite, script) {
    var value1 = script.getNumberValue("VALUE1", script);
    sprite.setX(value1);
    var value2 = script.getNumberValue("VALUE2", script);
    sprite.setY(value2);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_absolute",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setX(value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_absolute",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    //sprite.y = 340 - value;
    sprite.setY(value);
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_absolute",
    "isNotFor": []
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
},
    "class": "move_absolute",
    "isNotFor": []
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
},
    "class": "move_relative",
    "isNotFor": []
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
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var threshold = 0;

    var method = sprite.parent.getRotateMethod();
    var bound = sprite.object.getTransformedBounds();
    var size = {};
    size.width = bound.width * Math.sqrt(1.0 + (bound.height/bound.width) * (bound.height/bound.width));
    size.height = bound.height * Math.sqrt(1.0 + (bound.width/bound.height) * (bound.width/bound.height));

    if (method == 'free')
        var angle = (sprite.getRotation() + sprite.getDirection()).mod(360);
    else
        var angle = sprite.getDirection();

    if ((angle < 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
        var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);
        if (up) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
            else
                sprite.setDirection(- sprite.getDirection() + 180);

            sprite.setY(135 - size.height/2 - 1);
        } else {
            var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);
            if (down) {
                if (method == 'free')
                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                else
                    sprite.setDirection(- sprite.getDirection() + 180);

                sprite.setY(-135 + size.height/2 + 1);
            }

        }
    } else if (angle < 270 && angle >= 90) {
        var down = ndgmr.checkPixelCollision(Entry.stage.wall.down,sprite.object,threshold,false);
        if (down) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
            else
                sprite.setDirection(- sprite.getDirection() + 180);

            sprite.setY(-135 + size.height/2 + 1);
        } else {
            var up = ndgmr.checkPixelCollision(Entry.stage.wall.up,sprite.object,threshold,false);
            if (up) {
                if (method == 'free')
                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2 + 180);
                else
                    sprite.setDirection(- sprite.getDirection() + 180);

                sprite.setY(135 - size.height/2 - 1);
            }
        }
    }
    if (angle < 360 && angle >= 180) {
        var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);
        if (left) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
            else
                sprite.setDirection(- sprite.getDirection() + 360);

            sprite.setX(-240 + size.width/2 + 1);
        } else {
            var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);
            if (right) {
                if (method == 'free')
                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                else
                    sprite.setDirection(- sprite.getDirection() + 360);

                sprite.setX(240 - size.width/2 - 1);
            }

        }
    } else if (angle < 180 && angle >= 0) {
        var right = ndgmr.checkPixelCollision(Entry.stage.wall.right,sprite.object,threshold,false);
        if (right) {
            if (method == 'free')
                sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
            else
                sprite.setDirection(- sprite.getDirection() + 360);

            sprite.setX(240 - size.width/2 - 1);
        } else {
            var left = ndgmr.checkPixelCollision(Entry.stage.wall.left,sprite.object,threshold,false);
            if (left) {
                if (method == 'free')
                    sprite.setRotation(- sprite.getRotation() - sprite.getDirection() * 2);
                else
                    sprite.setDirection(- sprite.getDirection() + 360);

                sprite.setX(-240 + size.width/2 + 1);
            }
        }
    }
    return script.callReturn();
},
    "class": "walk",
    "isNotFor": []
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
    "func": function (sprite, script) {
    sprite.setDirection(sprite.getDirection() + 180);
    return script.callReturn();
}
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
    "func": function (sprite, script) {
    sprite.setDirection(sprite.getDirection() + 180);
    return script.callReturn();
}
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
    "func": function (sprite, script) {
    var targetId = script.getField("VALUE", script);
    var spriteX = sprite.getX();
    var spriteY = sprite.getY();
    var deltaX, deltaY;

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

    if ( deltaX >= 0 ) {
        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
    } else {
        var value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
    }
    var nativeDirection = sprite.getDirection() + sprite.getRotation();
    sprite.setRotation(sprite.getRotation() + value - nativeDirection);
    return script.callReturn();
},
    "class": "rotate_absolute",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    var nativeDirection = sprite.getDirection() + sprite.getRotation();
    sprite.setRotation(sprite.getRotation() + value - nativeDirection);
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    sprite.setDirection(value + sprite.getDirection());
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
},
    "class": "move_absolute",
    "isNotFor": []
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
    "func": function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setRotation(value);
    return script.callReturn();
},
    "class": "rotate_absolute",
    "isNotFor": []
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
    "func": function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setRotation(value + entity.getRotation());
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setDirection(value);
    return script.callReturn();
},
    "class": "rotate_absolute",
    "isNotFor": []
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
    "func": function (entity, script) {
    var value = script.getNumberValue("VALUE", script);
    entity.setDirection(value + entity.getDirection());
    return script.callReturn();
},
    "class": "rotate",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script);
    var angle = script.getNumberValue("ANGLE", script);
    sprite.setX(sprite.getX() + value * Math.cos((angle - 90) / 180 * Math.PI));
    sprite.setY(sprite.getY() - value * Math.sin((angle - 90) / 180 * Math.PI));
    if (sprite.brush && !sprite.brush.stop) {
        sprite.brush.lineTo(sprite.getX(), sprite.getY()*-1);
    }
    return script.callReturn();
},
    "class": "move_rotate",
    "isNotFor": []
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
},
    "class": "rotate",
    "isNotFor": []
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
},
    "class": "rotate",
    "isNotFor": [
      ""
    ]
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
    "func": function (sprite, script) {
    var port = script.getStringField("PORT");
    return Entry.hw.portData[port];
},
    "class": "neobot_value",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    var port = script.getNumberField("VALUE");
    var direction = script.getNumberField("DIRECTION");
    Entry.hw.sendQueue["LMOT"] = port * direction;
    return script.callReturn();
},
    "class": "neobot_motor",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    Entry.hw.sendQueue["LMOT"] = 0;
    return script.callReturn();
},
    "class": "neobot_motor",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    var port = script.getNumberField("VALUE");
    var direction = script.getNumberField("DIRECTION");
    Entry.hw.sendQueue["RMOT"] = port * direction;
    return script.callReturn();
},
    "class": "neobot_motor",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    Entry.hw.sendQueue["RMOT"] = 0;
    return script.callReturn();
},
    "class": "neobot_motor",
    "isNotFor": [
      "neobot"
    ]
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
},
    "class": "neobot_motor",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    var value = script.getNumberField("VALUE");
    var speed = script.getNumberField("SPEED");
    Entry.hw.sendQueue["SERVO1"] = value;
    Entry.hw.sendQueue["SERVO1_SPEED"] = speed;
    return script.callReturn();
},
    "class": "neobot_servo",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    var value = script.getNumberField("VALUE");
    var speed = script.getNumberField("SPEED");
    Entry.hw.sendQueue["SERVO2"] = value;
    Entry.hw.sendQueue["SERVO2_SPEED"] = speed;
    return script.callReturn();
},
    "class": "neobot_servo",
    "isNotFor": [
      "neobot"
    ]
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

},
    "class": "neobot_note",
    "isNotFor": [
      "neobot"
    ]
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
    "func": function (sprite, script) {
    var sq = Entry.hw.sendQueue;

    var port = script.getStringField("PORT", script);
    var value = script.getNumberField("VALUE", script);
    sq[port] = value;
    return script.callReturn();
},
    "class": "neobot_set_value",
    "isNotFor": [
      "neobot"
    ]
  },
  "when_scene_start": {
    "color": "#3BBD70",
    "skeleton": "basic_event",
    "statements": [],
    "template": "%1 장면이 시작 되었을 때",
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "scene",
    "isNotFor": [
      "scene"
    ]
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
        "fontSize": 11,
        "options": [
          [
            "장면 1",
            "7dwq"
          ]
        ]
      },
      {
        "type": "Indicator",
        "img": "/lib/entryjs/images/block_icon/start_03.png",
        "size": 12
      }
    ],
    "events": {},
    "func": function (sprite, script) {
    var value = script.getField("VALUE", script);
    var scene = Entry.scene.getSceneById(value);
    if (scene) {
        Entry.scene.selectScene(scene);
        Entry.engine.fireEvent('when_scene_start');
    }
    return null;
},
    "class": "scene",
    "isNotFor": [
      "scene"
    ]
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
            "이전",
            "pre"
          ],
          [
            "다음",
            "next"
          ]
        ],
        "value": "pre",
        "fontSize": 11
      },
      {
        "type": "Indicator",
        "img": "/lib/entryjs/images/block_icon/start_03.png",
        "size": 12
      }
    ],
    "events": {},
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
},
    "class": "scene",
    "isNotFor": [
      "scene"
    ]
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
    "func": function (sprite, script) {
    var soundId = script.getField("VALUE", script);
    var sounds = sprite.parent.sounds;
    var isExist = Entry.isExist(soundId, 'id', sounds);
    if (isExist)
        createjs.Sound.play(soundId);
    return script.callReturn();
},
    "class": "sound",
    "isNotFor": []
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
},
    "class": "sound",
    "isNotFor": []
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
},
    "class": "sound",
    "isNotFor": []
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
},
    "class": "sound",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script) / 100;
    value = value + createjs.Sound.getVolume();
    if (value>1)
        value = 1;
    if (value<0)
        value = 0;
    createjs.Sound.setVolume(value);
    return script.callReturn();
},
    "class": "sound_volume",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var value = script.getNumberValue("VALUE", script) / 100;
    if (value>1)
        value = 1;
    if (value<0)
        value = 0;
    createjs.Sound.setVolume(value);
    return script.callReturn();
},
    "class": "sound_volume",
    "isNotFor": []
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
    "func": function (sprite, script) {
    createjs.Sound.stop();
    return script.callReturn();
},
    "class": "sound_stop",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.getStringField("VALUE");
}
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
    "func": function (sprite, script) {
    var soundId = script.getStringValue("VALUE", script);
    var sound = sprite.parent.getSound(soundId);

    if (sound)
        createjs.Sound.play(sound.id);

    return script.callReturn();
},
    "class": "sound_play",
    "isNotFor": []
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
},
    "class": "sound_play",
    "isNotFor": []
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
},
    "class": "sound_play",
    "isNotFor": []
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
},
    "class": "sound_play",
    "isNotFor": []
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
    "func": function (sprite, script) {
    var soundId = script.getField("SOUND", script);
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
},
    "class": "",
    "isNotFor": [
      ""
    ]
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
    "func": function (sprite, script) {
    if (!script.isPlay) {
        script.isPlay = true;
        script.playState = 1;
        var sound = sprite.parent.getSound(script.getField("SOUND", script));
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
},
    "class": "sound_play",
    "isNotFor": [
      ""
    ]
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": [],
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
    "func": function (sprite, script) {
    return script.callReturn();
}
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "event",
    "isNotFor": []
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
    "func": function (sprite, script) {
    return script.callReturn();
}
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
        "fontSize": 11,
        "options": [
          [
            "대상없음",
            "null"
          ]
        ]
      }
    ],
    "events": {},
    "func": function (sprite, script) {
    return script.callReturn();
},
    "class": "message",
    "isNotFor": [
      "message"
    ]
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
        "fontSize": 11,
        "options": [
          [
            "대상없음",
            "null"
          ]
        ]
      },
      {
        "type": "Indicator",
        "img": "/lib/entryjs/images/block_icon/start_03.png",
        "size": 12
      }
    ],
    "events": {},
    "func": function (sprite, script) {
    var value = script.getField("VALUE", script);

    var arr = Entry.variableContainer.messages_;
    var isExist = Entry.isExist(value, 'id', arr);

    if (value == 'null' || !isExist)
        throw new Error('value can not be null or undefined');
    Entry.container.mapEntityIncludeCloneOnScene(Entry.engine.raiseKeyEvent,
                              ["when_message_cast", value]);
    return script.callReturn();
},
    "class": "message",
    "isNotFor": [
      "message"
    ]
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
        "fontSize": 11,
        "options": [
          [
            "대상없음",
            "null"
          ]
        ]
      },
      {
        "type": "Indicator",
        "img": "/lib/entryjs/images/block_icon/start_03.png",
        "size": 12
      }
    ],
    "events": {},
    "func": function (sprite, script) {
    if (script.runningScript) {
        if (script.runningScript.length) {
            Entry.engine.computeFunction(script);
            return script;
        } else {
            delete script.runningScript;
            return script.callReturn();
        }
    } else {
        var value = script.getField("VALUE", script);
        var arr = Entry.variableContainer.messages_;
        var isExist = Entry.isExist(value, 'id', arr);
        if (value == 'null' || !isExist)
            throw new Error('value can not be null or undefined');
        var runningScript = []

        Entry.container.mapEntityIncludeCloneOnScene(function(entity, param) {
            var eventName = param[0];
            var keyCode = param[1];
            var blocks = entity.parent.script.childNodes;
            //handle clone entity
            for (var i=0; i<blocks.length; i++) {
                var block = blocks[i];
                var value = Entry.Xml.getField("VALUE", block);
                if (Entry.Xml.isTypeOf(eventName, block) &&
                   (value == keyCode)) {
                    var script = new Entry.Script(entity);
                    script.init(block);
                    runningScript.push(script);
                }
            };
        }, ["when_message_cast", value]);

        script.runningScript = runningScript;
        return script;
    }
},
    "class": "message",
    "isNotFor": [
      "message"
    ]
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
    "func": function (sprite, script) {
    return script.getField('NAME');
},
    "class": "text",
    "isNotFor": [
      "sprite"
    ],
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
    "func": function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    text = Entry.convertToRoundedDecimals(text, 3);
    sprite.setText(text);
    return script.callReturn();
},
    "class": "text",
    "isNotFor": [
      "sprite"
    ]
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
    "func": function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    sprite.setText(Entry.convertToRoundedDecimals(sprite.getText(),3) +
                  Entry.convertToRoundedDecimals(text, 3));
    return script.callReturn();
},
    "class": "text",
    "isNotFor": [
      "sprite"
    ]
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
    "func": function (sprite, script) {
    var text = script.getStringValue("VALUE", script);
    sprite.setText(Entry.convertToRoundedDecimals(text, 3) +
                  Entry.convertToRoundedDecimals(sprite.getText(), 3));
    return script.callReturn();
},
    "class": "text",
    "isNotFor": [
      "sprite"
    ]
  },
  "text_flush": {
    "color": "#FFCA36",
    "skeleton": "basic",
    "statements": [],
    "template": "텍스트 모두 지우기",
    "params": [],
    "events": {},
    "func": function (sprite, script) {
    sprite.setText('');
    return script.callReturn();
},
    "class": "text",
    "isNotFor": [
      "sprite"
    ]
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
            function() {
                Entry.variableContainer.openVariableAddPanel('variable');
            }
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
    "events": {},
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
},
    "class": "variable",
    "isNotFor": [
      "variable",
      "variableNotExist"
    ]
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
    "events": {},
    "func": function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var value = script.getValue("VALUE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setValue(value);
    return script.callReturn();
},
    "class": "variable",
    "isNotFor": [
      "variable",
      "variableNotExist"
    ]
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
    "events": {},
    "func": function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setVisible(true);
    variable.updateView();
    return script.callReturn();
},
    "class": "variable_visibility",
    "isNotFor": [
      "variable",
      "variableNotExist"
    ]
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
    "events": {},
    "func": function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    variable.setVisible(false);
    return script.callReturn();
},
    "class": "variable_visibility",
    "isNotFor": [
      "variable",
      "variableNotExist"
    ]
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
    "events": {},
    "func": function (sprite, script) {
    var variableId = script.getField("VARIABLE", script);
    var variable = Entry.variableContainer.getVariable(variableId, sprite);
    return variable.getValue();
},
    "class": "variable",
    "isNotFor": [
      "variable",
      "variableNotExist"
    ]
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
},
    "class": "ask",
    "isNotFor": []
  },
  "get_canvas_input_value": {
    "color": "#E457DC",
    "skeleton": "basic_string_field",
    "statements": [],
    "template": "대답  ",
    "params": [],
    "events": {
      "whenBlockAdd": [
        null
      ],
      "whenBlockDestroy": [
        null
      ]
    },
    "func": function (sprite, script) {
    return Entry.container.getInputValue();
},
    "class": "ask",
    "isNotFor": []
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
    "events": {},
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var value = script.getValue("VALUE", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_)
        list.array_ = [];
    list.array_.push({'data' : value});
    list.updateView();
    return script.callReturn();
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var value = script.getValue("VALUE", script);
    var list = Entry.variableContainer.getList(listId, sprite);

    if (!list.array_ || isNaN(value) || value > list.array_.length)
        throw new Error('can not remove value from array');

    list.array_.splice(value-1,1);

    list.updateView();
    return script.callReturn();
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var index = script.getValue("INDEX", script);
    var list = Entry.variableContainer.getList(listId, sprite);
    index = Entry.getListRealIndex(index, list);

    if (!list.array_ || isNaN(index) || index > list.array_.length)
        throw new Error('can not insert value to array');

    return list.array_[index-1].data
},
    "class": "list_element",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    return list.array_.length;
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    list.setVisible(true);
    return script.callReturn();
},
    "class": "list_visibility",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    var listId = script.getField("LIST", script);
    var list = Entry.variableContainer.getList(listId);

    list.setVisible(false);
    return script.callReturn();
},
    "class": "list_visibility",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "func": function (sprite, script) {
    return script.getField("OPERATOR", script);
}
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
    "func": function (sprite, script) {
    var bool = script.getField("BOOL", script);
    if (bool == 'HIDE')
        Entry.container.inputValue.setVisible(false);
    else
        Entry.container.inputValue.setVisible(true);
    return script.callReturn();
},
    "class": "ask",
    "isNotFor": [
      ""
    ]
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
},
    "class": "list",
    "isNotFor": [
      "list",
      "listNotExist"
    ]
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
    "template": "만약 앞에 %1 있다면%2",
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
    "template": "만약 앞에 %1 있다면%2",
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
