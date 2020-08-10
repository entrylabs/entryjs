'use strict';

Entry.etboard = {
    id: ['2F.1'],
    name: 'etboard',
    url: 'http://et.ketri.re.kr',
    imageName: 'etboard.png',
    title: {
        ko: 'ET-BOARD(USB)',
        en: 'ET-BOARD(USB)',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
      ALIVE: 0,
      DIGITAL: 1,
      ANALOG: 2,
      PWM: 3,
      SERVO_PIN: 4,
      TONE: 5,
      PULSEIN: 6,
      ULTRASONIC: 7,
      TIMER: 8,
      OLED: 241,
      COM: 242
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.etboard.setLanguage = function() {
    return {
        ko: {
            Blocks: {
              GreenColor: '초록색',
              BlueColor: '파랑색',
              YellowColor: '노랑색',
              RedColor: '빨강색',
              GreenButton: '초록 버튼',
              BlueButton: '파랑 버튼',
              YellowButton: '노랑 버튼',
              RedButton: '빨강 버튼',
            },
            template: {
                etboard_serial_set: '시리얼 통신으로 설정하고 %1 속도로 전송하기',
                etboard_ble_set: '블루투스 통신으로 설정하고 %1 속도로 전송하기',
                etboard_get_analog_value: '아날로그 %1 센서값',
                etboard_toggle_pin: '디지털 %1 번핀 %2',
                etboard_port_number: '%1',
                etboard_ultrasonic_get_value:'초음파 송신 %1 핀 수신 %2 핀',
                etboard_get_digital_button: '%1 누름',
                etboard_get_digital: '디지털 %1번 센서값',
                etboard_toggle_led: 'LED %1 을 %2',
                etboard_get_port_number1: '%1',
                etboard_get_port_number: '%1',
                etboard_get_ultrasonic_port_number: '%1',
                etboard_set_servo: '서보모터 %1번 핀을 %2 도로 정하기',
                etboard_oled_set: 'OLED %1 번째 줄의 %2 표시하기',
                etboard_pw_get_port_number: '%1',
            },
        },
        en: {
            Blocks: {
              GreenColor: 'Green Color',
              BlueColor: 'Blue Color',
              YellowColor: 'Yellow Color',
              RedColor: 'Red Color',
              GreenButton: 'Green Button',
              BlueButton: 'Blue Button',
              YellowButton: 'Yellow Button',
              RedButton: 'Red Button',
            },
            template: {
              etboard_serial_set: 'Set Serial COMM %1 boardrates',
              etboard_ble_set: 'Set Bluetooth COMM %1 boardrates',
              etboard_get_analog_value: 'Analog %1 Value',
              etboard_toggle_pin: 'Digital %1 PIN %2',
              etboard_port_number: '%1',
              etboard_ultrasonic_get_value:'Ultrasonic Trigger %1 PIN echo %2 PIN Value',
              etboard_get_digital_button: '%1 Push',
              etboard_get_digital: 'Digital %1 PIN Value',
              etboard_toggle_led: '%1 LED %2',
              etboard_get_port_number1: '%1',
              etboard_get_port_number: '%1',
              etboard_get_ultrasonic_port_number: '%1',
              etboard_set_servo: 'Servo %1 PIN %2 degree set',
              etboard_oled_set: 'OLE %1 line %2 Display',
              etboard_pw_get_port_number: '%1',

            },
        },
    };
};

Entry.etboard.blockMenuBlocks = [
    'etboard_serial_set',
    'etboard_ble_set',
    'etboard_get_analog_value',
    'etboard_ultrasonic_get_value',
    'etboard_get_digital_button',
    'etboard_get_digital',
    'etboard_toggle_pin',
    'etboard_toggle_led',
    'etboard_set_servo',
    'etboard_oled_set',
];

Entry.etboard.getBlocks = function() {
    return {
        etboard_serial_set: {
          color: EntryStatic.colorSet.block.default.HARDWARE,
          outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
          skeleton: 'basic',
          statements: [],
          params : [
            {
                  type: 'Dropdown',
                  options: [
                   ['1','1'],
                   ['2','2'],
                   ['3','3'],
                   ['4','4'],
                   ['5','5'],
                   ['6','6'],
                   ['7','7'],
                   ['8','8'],
                   ['9','9'],
                   ['10','10'],
                  ],
                  value:'10',
                  fontSize:11,
                  bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                  arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
              },
          ],
          events: {},
          def: {
              params: [null],
              type: 'etboard_serial_set',
          },
          isNotFor: [ 'etboard' ],
          syntax: undefined,
          paramsKeyMap: {
              NOTE: 0,
          },
          class: 'COM',
          func: function (sprite, script) {
              var data = script.getField('NOTE');

              if(!Entry.hw.sendQueue['SET']) {
                  Entry.hw.sendQueue['SET'] = {};
              }
              Entry.hw.sendQueue['SET'][0] = {
                  type: 242,
                  data: data,
                  time: new Date().getTime()
              };
              return script.callReturn();
          },
        },
        etboard_ble_set: {
              color: EntryStatic.colorSet.block.default.HARDWARE,
              outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: 'basic',
              statements: [],
              params: [
          		{
                      "type": "Dropdown",
                      "options": [
                       ["1","1"],
                       ["2","2"],
                       ["3","3"],
                      ],
                      "value":"3",
                      "fontSize":11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  },
              ],
              events: {},
              def: {
                  "params": [
                      null,
                  ],
                  "type": "etboard_ble_set"
              },
              isNotFor: [ "etboard" ],
              paramsKeyMap: {
                  "VALUE1": 0,
              },
              class: "COM",
              func: function (sprite, script) {
                  var data = script.getField("VALUE1");

                  if(!Entry.hw.sendQueue['SET']) {
                      Entry.hw.sendQueue['SET'] = {};
                  }
                  Entry.hw.sendQueue['SET'][1] = {
                      type: 242,
                      data: data,
                      time: new Date().getTime()
                  };
                  return script.callReturn();

              },
          },
          etboard_get_analog_value: {
              color: EntryStatic.colorSet.block.default.HARDWARE,
              outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: 'basic_string_field',
              statements: [],
              events: {},
              params: [
                    {
                        "type": "Dropdown",
                        "options": [
                            [ "A0", "0" ],
                            [ "A1", "1" ],
                            [ "A2", "2" ],
                            [ "A3", "3" ],
                            [ "A4", "4" ],
                            [ "A5", "5" ],
                        ],
                        "value": "0",
                        "fontSize": 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
              def: {
                params: [ null ],
                "type": "etboard_get_analog_value"
              },
              isNotFor: [ "etboard" ],
              class: "SENSOR",
              paramsKeyMap: {
                  "PORT": 0,
              },
              func: function (sprite, script) {
                var port = script.getValue("PORT", script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === "A")
                    port = port.substring(1)
                return ANALOG ? ANALOG[port] || 0 : 0;
              },
          },
          etboard_get_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: "basic_string_field",
              statements: [],
              params: [
                  {
                      "type": "Dropdown",
                      "options": [
                          [ "2", "2" ],
                          [ "3", "3" ],
                          [ "4", "4" ],
                          [ "5", "5" ],
                          [ "6", "6" ],
                          [ "7", "7" ],
                          [ "8", "8" ],
                          [ "9", "9" ],
                      ],
                      "value": "2",
                      "fontSize": 11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  }
              ],
              events: {},
              def: {
                  "params": [ null ]
              },
              paramsKeyMap: {
                  "PORT": 0
              },
              func: function (sprite, script) {
                  return script.getStringField("PORT");
              },
          },
          etboard_get_ultrasonic_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: "basic_string_field",
              statements: [],
              params: [
                  {
                      "type": "Dropdown",
                      "options": [
                          [ "6", "6" ],
                          [ "7", "7" ],
                          [ "8", "8" ],
                          [ "9", "9" ],
                      ],
                      "value": "2",
                      "fontSize": 11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  }
              ],
              events: {},
              def: {
                  "params": [ null ]
              },
              paramsKeyMap: {
                  "PORT": 0
              },
              func: function (sprite, script) {
                  return script.getStringField("PORT");
              },
          },
          etboard_port_number: {
              color: EntryStatic.colorSet.block.default.HARDWARE,
              outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: "basic_string_field",
              statements: [],
              params: [
                  {
                    "type": "Dropdown",
                    "options": [
                      [ Lang.Blocks.RedButton, "6" ],
                      [ Lang.Blocks.BlueButton, "7" ],
                      [ Lang.Blocks.GreenButton, "8" ],
                      [ Lang.Blocks.YellowButton, "9" ],
                    ],
                      value: "6",
                      fontSize: 11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  }
              ],
              events: {},
              def: {
                  "params": [ null ]
              },
              paramsKeyMap: {
                  "PORT": 0
              },
              func: function (sprite, script) {
                  return script.getStringField("PORT");
              },
          },
          etboard_toggle_pin: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    "type": "Block",
                    "accept": "string"
                },
                {
                    "type": "Block",
                    "accept": "string"
                }
            ],
             events: {},
              def: {
                  "params": [
                      {
                          "type": "etboard_get_port_number"
                      },
                      {
                          "type": "arduino_get_digital_toggle",
                          "params": [ "on" ],
                      },
                      null
                  ],
                  "type": "etboard_toggle_pin"
              },
              paramsKeyMap: {
                  "PORT": 0,
                  "VALUE": 1,
              },
              isNotFor: [ "etboard" ],
              class: "run",
              func: function (sprite, script) {
                  var port = script.getNumberValue("PORT");
                  var value = script.getValue("VALUE");

                  if(typeof value === 'string') {
                      value = value.toLowerCase();
                  }
                  if(Entry.ArduinoExt.highList.indexOf(value) > -1) {
                      value = 255;
                  } else if(Entry.ArduinoExt.lowList.indexOf(value) > -1) {
                      value = 0;
                  } else {
                      throw new Error();
                  }
                  if(!Entry.hw.sendQueue['SET']) {
                      Entry.hw.sendQueue['SET'] = {};
                  }
                  Entry.hw.sendQueue['SET'][port] = {
                      type: Entry.etboard.sensorTypes.DIGITAL,
                      data: value,
                      time: new Date().getTime()
                  };
                  return script.callReturn();
              },
          },
          etboard_ultrasonic_get_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: "basic_string_field",
            params: [
                {
                    "type": "Block",
                    "accept": "string"
                },
                {
                    "type": "Block",
                    "accept": "string"
                }
            ],
            def: {
                params: [{
                    type: 'etboard_get_ultrasonic_port_number',
                    params: [ '6' ],
                }, {
                    type: 'etboard_get_ultrasonic_port_number',
                    params: [ '8' ],
                }],
                type: "etboard_ultrasonic_get_value"
            },
            paramsKeyMap: {
                "PORT1": 0,
                "PORT2": 1,
            },
            func: function (sprite, script) {
                var port1 = script.getNumberValue("PORT1", script);
                var port2 = script.getNumberValue("PORT2", script);

                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.etboard.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime()
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            isNotFor: [ "etboard" ],
            class: "SENSOR",
        },
        etboard_get_digital_button: {
          color: EntryStatic.colorSet.block.default.HARDWARE,
          outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: "basic_boolean_field",
            params: [{
                "type": "Block",
                "accept": "string"
            }],
            def: {
                "params": [
                    {
                        "type": "etboard_port_number",
                        "params": [6]
                    }
                ],
                "type": "etboard_get_digital_button"
            },
            paramsKeyMap: {
                "PORT": 0
            },
            class: "digital",
            isNotFor: [ "etboard" ],
            func: function (sprite, script) {
                var port = script.getNumberValue("PORT", script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.etboard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                return (DIGITAL) ? DIGITAL[port] || 0 : 0;
            },
        },
        etboard_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: "basic_boolean_field",
            params: [{
                "type": "Block",
                "accept": "string"
            }],
            def: {
                "params": [
                    {
                        "type": "etboard_get_port_number"
                    }
                ],
                "type": "etboard_get_digital"
            },
            paramsKeyMap: {
                 "PORT": 0
             },
            isNotFor: [ "etboard" ],
            class: "digital",
            func: function (sprite, script) {
                var port = script.getNumberValue("PORT", script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.etboard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                return (DIGITAL) ? DIGITAL[port] || 0 : 0;
            },
        },
        etboard_get_port_number1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: "basic_string_field",
            statements: [],
            params: [
                {
                    "type": "Dropdown",
                    "options": [
                        [ Lang.Blocks.RedColor, "2" ],
                        [ Lang.Blocks.BlueColor, "3" ],
                        [ Lang.Blocks.GreenColor, "4" ],
                        [ Lang.Blocks.YellowColor, "5" ],
                    ],
                    "value": "2",
                    "fontSize": 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            },
            "class": "ArduinoExt"
        },
        etboard_toggle_led: {
          color: EntryStatic.colorSet.block.default.HARDWARE,
          outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
          skeleton: 'basic',
          params: [
              {
                  "type": "Block",
                  "accept": "string"
              },
              {
                  "type": "Block",
                  "accept": "string"
              }
          ],
          def: {
              "params": [
                  {
                      "type": "etboard_get_port_number1"
                  },
                  {
                      "type": "arduino_get_digital_toggle",
                      "params": [ "on" ],
                  },
              ],
              "type": "etboard_toggle_led"
            },
            "paramsKeyMap": {
                "PORT": 0,
                "VALUE": 1
            },
            "isNotFor": [ "etboard" ],
            "class": "run",
            "func": function (sprite, script) {
                var port = script.getNumberValue("PORT");
                var value = script.getValue("VALUE");

                if(typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if(Entry.ArduinoExt.highList.indexOf(value) > -1) {
                    value = 255;
                } else if(Entry.ArduinoExt.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.etboard.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime()
                };
                return script.callReturn();
            },
        },
        etboard_pw_get_port_number: {
              color: EntryStatic.colorSet.block.default.HARDWARE,
              outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
              skeleton: "basic_string_field",
              statements: [],
              params: [
                  {
                      "type": "Dropdown",
                      "options": [
                          [ "5", "5" ]
                      ],
                      "value": "5",
                      "fontSize": 11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  }
              ],
              events: {},
              def: {
                  "params": [ null ]
              },
              paramsKeyMap: {
                  "PORT": 0
              },
              func: function (sprite, script) {
                  return script.getStringField("PORT");
              },
          },
        etboard_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: "basic",
            statements: [],
            params: [
                {
                    "type": "Block",
                    "accept": "string"
                },
                {
                    "type": "Block",
                    "accept": "string"
                },
            ],
            events: {},
            def: {
                params: [
                    {
                    type: "etboard_pw_get_port_number"
                    },
                    {
                        "type": "text",
                        "params": [ "0" ]
                    },
                    null
                ],
                type: "etboard_set_servo"
            },
            paramsKeyMap: {
                "PORT": 0,
                "VALUE": 1
            },
            class: "ext",
            isNotFor: [ "etboard" ],
            func: function (sprite, script) {
                var port = script.getNumberValue("PORT");
                var value = script.getNumberValue("VALUE");
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 180);
                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: 4,
                    data: value,
                    time: new Date().getTime()
                };
                return script.callReturn();
            },
            "syntax": {}
        },
        etboard_oled_set: {
          color: EntryStatic.colorSet.block.default.HARDWARE,
          outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
          skeleton: "basic",
          statements: [],
          params: [
              {
                  "type": "Dropdown",
                  "options": [
                   ["1","1"],
                   ["2","2"],
                   ["3","3"]
                  ],
                  "value":"1",
                  "fontSize":11,
                  bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                  arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
              },
      		    {
                  "type": "Block",
                  "accept": "string"
              }
          ],
          events: {},
          def: {
              "params": [
                  null,
                  {
                      "type":"text",
                      "params": [ "1" ],
                  },
              ],
              "type": "etboard_oled_set"
          },
          isNotFor: [ "etboard" ],
          paramsKeyMap: {
              "VALUE1": 0,
              "VALUE2": 1
          },
          class: "ext",
          func: function (sprite, script) {
              var line = script.getField("VALUE1");
              var text = script.getValue("VALUE2");

              if(!Entry.hw.sendQueue['SET']) {
                  Entry.hw.sendQueue['SET'] = {};
              }
              Entry.hw.sendQueue['SET'][line] = {
                  type: 241,
                  data: text,
                  time: new Date().getTime()
              };
              return script.callReturn();

          },
          "syntax": {}
          },
    }   //return
};  //function

module.exports = Entry.etboard;
