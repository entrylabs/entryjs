'use strict';

Entry.avmboard = {
    id: ['99.1'],
    name: 'avmboard',
    url: 'http://avatarmecha.co.kr',
    imageName: 'avmboard.png',
    title: {
        ko: 'AVM-BOARD',
        en: 'AVM-BOARD',
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
      COM: 242,
    	NEOPIXELCOLOR: 243,

    },
    duration: {
          TIME_1ms: 1,
          TIME_5ms: 5,
          TIME_10ms: 10,
          TIME_20ms: 20,
          TIME_50ms: 50,
          TIME_100ms: 100,
          TIME_200ms: 200,
          TIME_500ms: 500,
          TIME_600ms: 600,
      },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.avmboard.setLanguage = function() {
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
                avmboard_serial_set: '시리얼 통신으로 설정하고 %1 속도로 전송하기',
                avmboard_ble_set: '블루투스 통신으로 설정하고 %1 속도로 전송하기',
                avmboard_get_analog_value: '아날로그 %1 센서값',
                avmboard_toggle_pin: '디지털 %1 번핀 %2',
                avmboard_port_number: '%1',
                avmboard_ultrasonic_get_value:'초음파 송신 %1 핀 수신 %2 핀',
                avmboard_get_digital_button: '%1 누름',
                avmboard_get_digital: '디지털 %1번 센서값',
                avmboard_toggle_led: 'LED %1 을 %2',
                avmboard_get_port_number1: '%1',
                avmboard_get_port_number: '%1',
                avmboard_get_ultrasonic_port_number: '%1',
                avmboard_set_servo: '서보모터 %1번 핀을 %2 도로 정하기',
                avmboard_oled_set: 'OLED %1 번째 줄의 %2 표시하기',
                avmboard_pw_get_port_number: '%1',
                avmboard_neopixel_set: '디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 %3 개 사용하기',
                avmboard_neopixel_led: '네오픽셀 %1 번에 %2 번째 LED R: %3 , G: %4 , B: %5 색을 밝기 %6 으로 켜기',
                avmboard_neopixel_all_led: '네오픽셀 %1 번에 LED R: %2 , G: %3 , B: %4 색을 밝기 %5 으로 켜기',
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
              avmboard_serial_set: 'Set Serial COMM %1 boardrates',
              avmboard_ble_set: 'Set Bluetooth COMM %1 boardrates',
              avmboard_get_analog_value: 'Analog %1 Value',
              avmboard_toggle_pin: 'Digital %1 PIN %2',
              avmboard_port_number: '%1',
              avmboard_ultrasonic_get_value:'Ultrasonic Trigger %1 PIN echo %2 PIN Value',
              avmboard_get_digital_button: '%1 Push',
              avmboard_get_digital: 'Digital %1 PIN Value',
              avmboard_toggle_led: '%1 LED %2',
              avmboard_get_port_number1: '%1',
              avmboard_get_port_number: '%1',
              avmboard_get_ultrasonic_port_number: '%1',
              avmboard_set_servo: 'Servo %1 PIN %2 degree set',
              avmboard_oled_set: 'OLE %1 line %2 Display',
              avmboard_pw_get_port_number: '%1',
              avmboard_neopixel_set: '디지털 %1 번핀에 연결된 %2 개의 네오픽셀 LED 사용하기',
              avmboard_neopixel_led: '디지털 %1 번핀에 연결된 %2  번째 네오픽셀 LED R: %3 , G: %4 , B: %5 색으로 켜기',
              avmboard_neopixel_all_led: '디지털 %1 번 핀에 연결된 %2  번째 네오픽셀 LED R: %3 , G: %4 , B: %5 색으로 켜기',
            },
        },
    };
};

Entry.avmboard.blockMenuBlocks = [
    'avmboard_serial_set',
    'avmboard_ble_set',
    'avmboard_get_analog_value',
    'avmboard_ultrasonic_get_value',
    'avmboard_get_digital_button',
    'avmboard_get_digital',
    'avmboard_toggle_pin',
    'avmboard_toggle_led',
    'avmboard_set_servo',
    'avmboard_oled_set',
    'avmboard_neopixel_set',
    'avmboard_neopixel_led',
    'avmboard_neopixel_all_led',

];

Entry.avmboard.getBlocks = function() {
    return {
        avmboard_serial_set: {
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
              type: 'avmboard_serial_set',
          },
          isNotFor: [ 'avmboard' ],
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
        avmboard_ble_set: {
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
                  "type": "avmboard_ble_set"
              },
              isNotFor: [ "avmboard" ],
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
          avmboard_get_analog_value: {
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
                "type": "avmboard_get_analog_value"
              },
              isNotFor: [ "avmboard" ],
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
          avmboard_get_port_number: {
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
          avmboard_get_ultrasonic_port_number: {
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
          avmboard_port_number: {
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
          avmboard_toggle_pin: {
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
                          "type": "avmboard_get_port_number"
                      },
                      {
                          "type": "arduino_get_digital_toggle",
                          "params": [ "on" ],
                      },
                      null
                  ],
                  "type": "avmboard_toggle_pin"
              },
              paramsKeyMap: {
                  "PORT": 0,
                  "VALUE": 1,
              },
              isNotFor: [ "avmboard" ],
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
                      type: Entry.avmboard.sensorTypes.DIGITAL,
                      data: value,
                      time: new Date().getTime()
                  };
                  return script.callReturn();
              },
          },
          avmboard_ultrasonic_get_value: {
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
                    type: 'avmboard_get_ultrasonic_port_number',
                    params: [ '6' ],
                }, {
                    type: 'avmboard_get_ultrasonic_port_number',
                    params: [ '8' ],
                }],
                type: "avmboard_ultrasonic_get_value"
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
                Entry.hw.sendQueue['GET'][Entry.avmboard.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime()
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            isNotFor: [ "avmboard" ],
            class: "SENSOR",
        },
        avmboard_get_digital_button: {
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
                        "type": "avmboard_port_number",
                        "params": [6]
                    }
                ],
                "type": "avmboard_get_digital_button"
            },
            paramsKeyMap: {
                "PORT": 0
            },
            class: "digital",
            isNotFor: [ "avmboard" ],
            func: function (sprite, script) {
                var port = script.getNumberValue("PORT", script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.avmboard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                return (DIGITAL) ? DIGITAL[port] || 0 : 0;
            },
        },
        avmboard_get_digital: {
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
                        "type": "avmboard_get_port_number"
                    }
                ],
                "type": "avmboard_get_digital"
            },
            paramsKeyMap: {
                 "PORT": 0
             },
            isNotFor: [ "avmboard" ],
            class: "digital",
            func: function (sprite, script) {
                var port = script.getNumberValue("PORT", script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if(!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.avmboard.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime()
                };
                return (DIGITAL) ? DIGITAL[port] || 0 : 0;
            },
        },
        avmboard_get_port_number1: {
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
        avmboard_toggle_led: {
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
                      "type": "avmboard_get_port_number1"
                  },
                  {
                      "type": "arduino_get_digital_toggle",
                      "params": [ "on" ],
                  },
              ],
              "type": "avmboard_toggle_led"
            },
            "paramsKeyMap": {
                "PORT": 0,
                "VALUE": 1
            },
            "isNotFor": [ "avmboard" ],
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
                    type: Entry.avmboard.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime()
                };
                return script.callReturn();
            },
        },
        avmboard_pw_get_port_number: {
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
        avmboard_set_servo: {
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
                    type: "avmboard_pw_get_port_number"
                    },
                    {
                        "type": "text",
                        "params": [ "0" ]
                    },
                    null
                ],
                type: "avmboard_set_servo"
            },
            paramsKeyMap: {
                "PORT": 0,
                "VALUE": 1
            },
            class: "ext",
            isNotFor: [ "avmboard" ],
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
        avmboard_oled_set: {
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
              "type": "avmboard_oled_set"
          },
          isNotFor: [ "avmboard" ],
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
          avmboard_neopixel_set: {
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
                              "type": "Dropdown",
                              "options": [
                               ["1","1"],
                               ["2","2"],
                              ],
                              "value":"1",
                              "fontSize":11,
                              bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                              arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                  events: {},
      			def: {
                      params: [
                          {
                              type: 'arduino_get_port_number',
                              params: ['9'],
                          },
                          null,
      					          {
                              type: 'number',
                              params: ['12'],
                          },
                          null,
                      ],
                      type: 'avmboard_neopixel_set',
                  },
                  paramsKeyMap: {
                      PORT: 0,
                      INDEX: 1,
                      VALUE: 2,
                  },
                  class: 'neopixel',
                  isNotFor: ['avmboard'],
                  func(sprite, script) {
                    var port = script.getNumberValue("PORT");
                    var mode = 1;
                    var index = script.getNumberValue("INDEX");
                    var value = script.getNumberValue("VALUE");

                    if (!script.isStart)
                    {

                    if(!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    var duration = Entry.Orange.duration.TIME_10ms;
          						script.isStart = true;
          						script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.avmboard.sensorTypes.NEOPIXELCOLOR,
                        data:
                        {
                          value : value,
                          mode: mode,
                          index: index,
                        },
                        time: new Date().getTime()
                    };
                    setTimeout(function() {
                                  script.timeFlag = 0;
                              }, duration );
                              return script;
          				}
          				else if (script.timeFlag == 1)
                          {
                              return script;
                          }
                          else
                          {
                              delete script.timeFlag;
                              delete script.isStart;

                              Entry.engine.isContinue = false;
                              return script.callReturn();
                          }
                  },
                  syntax: {
                  },
              },
      		avmboard_neopixel_led: {
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
                              ],
                              "value":"1",
                              "fontSize":11,
                              bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                              arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                  events: {},
      			def: {
                      params: [
                          null,
      					          {
                              type: 'number',
                              params: ['1'],
                          },
      					          {
                              type: 'number',
                              params: ['255'],
                          },
      					{
                              type: 'number',
                              params: ['255'],
                          },
      					{
                              type: 'number',
                              params: ['255'],
                          },
                          {
                              type: 'number',
                              params: ['100'],
                          },
                          null,
                      ],
                      type: 'avmboard_neopixel_led',
                  },
                  paramsKeyMap: {
                      INDEX : 0,
                      POS: 1,
              				RED: 2,
              				GREEN: 3,
              				BLUE: 4,
                      BRIG: 5,
                  },
                  class: 'neopixel',
                  isNotFor: ['avmboard'],
                  func(sprite, script) {
                    var port = script.getNumberValue("INDEX");
                    var pos = script.getNumberValue("POS");
                    var red = script.getNumberValue("RED");
                    var green = script.getNumberValue("GREEN");
                    var blue = script.getNumberValue("BLUE");
                    var brig = script.getNumberValue("BRIG");
                    var mode = 2;


                    if (!script.isStart)
                    {

                    if(!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    var duration = Entry.Orange.duration.TIME_10ms;
                      script.isStart = true;
                      script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.avmboard.sensorTypes.NEOPIXELCOLOR,
                        data:
                        {
                          index : port,
                          pos : pos,
                          mode: mode,
                          red: red,
                          green: green,
                          blue: blue,
                          brig: brig,
                        },
                        time: new Date().getTime()
                    };
                    setTimeout(function() {
                                  script.timeFlag = 0;
                              }, duration );
                              return script;
          				}
          				else if (script.timeFlag == 1)
                          {
                              return script;
                          }
                          else
                          {
                              delete script.timeFlag;
                              delete script.isStart;

                              Entry.engine.isContinue = false;
                              return script.callReturn();
                          }
                  },
                  syntax: {
                  },
              },
              avmboard_neopixel_all_led: {
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
                                  ],
                                  "value":"1",
                                  "fontSize":11,
                                  bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                  arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                      events: {},
          			def: {
                          params: [
                              null,
          					          {
                                  type: 'number',
                                  params: ['255'],
                              },
          					{
                                  type: 'number',
                                  params: ['255'],
                              },
          					{
                                  type: 'number',
                                  params: ['255'],
                              },
                              {
                                  type: 'number',
                                  params: ['100'],
                              },
                              null,
                          ],
                          type: 'avmboard_neopixel_all_led',
                      },
                      paramsKeyMap: {
                          INDEX : 0,
                  				RED: 1,
                  				GREEN: 2,
                  				BLUE: 3,
                          BRIG: 4,
                      },
                      class: 'neopixel',
                      isNotFor: ['avmboard'],
                      func(sprite, script) {
                        var port = script.getNumberValue("INDEX");
                        var red = script.getNumberValue("RED");
                        var green = script.getNumberValue("GREEN");
                        var blue = script.getNumberValue("BLUE");
                        var brig = script.getNumberValue("BRIG");
                        var mode = 3;

                        if (!script.isStart)
                        {

                        if(!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        var duration = Entry.Orange.duration.TIME_10ms;
                          script.isStart = true;
                          script.timeFlag = 1;

                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.avmboard.sensorTypes.NEOPIXELCOLOR,
                            data:
                            {
                              index : port,
                              mode: mode,
                              red: red,
                              green: green,
                              blue: blue,
                              brig: brig,
                            },
                            time: new Date().getTime()
                        };
                        setTimeout(function() {
                                      script.timeFlag = 0;
                                  }, duration );
                                  return script;
                      }
                      else if (script.timeFlag == 1)
                              {
                                  return script;
                              }
                              else
                              {
                                  delete script.timeFlag;
                                  delete script.isStart;

                                  Entry.engine.isContinue = false;
                                  return script.callReturn();
                              }
                      },
                      syntax: {
                      },
                  },
    }   //return
};  //function

module.exports = Entry.avmboard;
