'use strict';

Entry.ETkit = {
  id: '58.1',
  name: 'ETkit',
  url: 'https://2tc.co.kr/',
  imageName: 'etkit.png',
  title: {
    ko: '이티키트',
    en: 'ETkit',
  },

  setZero: function() {
    //Entry.hw.sendQueue.readablePorts = [];
    //for (let port = 2; port < 14; port++) {
    //    Entry.hw.sendQueue[port] = 0;
    //    Entry.hw.sendQueue.readablePorts.push(port);
    //}
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
    Entry.hw.sendQueue.GET = {};
    Entry.hw.update();
  },
  sensorTypes: {
    ALIVE:    0,
    DIGITAL:  1,
    ANALOG:   2,
    DHT_PIN:  3,
    LCD:      4,
    PWM:      5,
    SERVO:       6,
    PULSEIN:         7,
    ULTRASONIC:      8,
    TIMER:              9,
    WRITE_SEG:                10,
    READ_SEG: 13,
    READ_BLUETOOTH:     11,
    WRITE_BLUETOOTH:    12,
    GAS:                14
  },

  highList: ['high', '1', 'on'],
  lowList: ['low', '0', 'off'],
  BlockState: {},
};


Entry.ETkit.setLanguage = function () {
  return {
    ko: {
      template: {
        etkit_get_digital_pin:'디지털 %1 번 핀 센서 값',
        etkit_get_digital_pin_bool:'디지털 %1 번 핀 센서 값',
        etkit_get_analog_pin: '아날로그 %1 번 핀 센서 값',
        etkit_get_dht: '%1 번 핀의 온도 센서 값 ',
        etkit_set_digital_pin: '디지털 %1 번 핀 %2 %3',
        etkit_set_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
        etkit_set_digital_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
        etkit_module_digital_lcd: 'LCD화면 %1 줄에 %2 나타내기 %3',
        etkit_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',
        etkit_get_digital_bluetooth: '블루투스 RX 2 핀 데이터 값',
        etkit_module_digital_bluetooth: '블루투스 TX 3 핀에 %1 데이터 보내기 %2',
        etkit_module_digital_seg: 'SEGMENT 화면에 %1 나타내기 %2',
        etkit_get_digital_segment: '세그먼트 데이터 값',
      },
      Blocks: {
        etkit_toggle_on: '켜기',
        etkit_toggle_off: '끄기',
        etkit_lcd_first_line: '첫 번째',
        etkit_lcd_seconds_line: '두 번째',
      },
      Menus: {
        etkit: '이티키트',
      },
      
    },
    en: {
      template: {
        etkit_get_digital_pin: 'Digital %1 pin sensor value',
        etkit_get_digital_pin_bool: 'Digital %1 pin sensor value',
        etkit_get_analog_pin: 'Read analog %1 pin sensor value',
        etkit_set_digital_pin: 'Digital %1 Pin %2 %3',
        etkit_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',
        etkit_set_digital_servo: 'Set servo pin %1 angle as %2 %3',
        etkit_get_dht: 'pin %1 DHT sensor value',
        etkit_module_digital_lcd: 'LCD %1 line %2 appear %3',
        etkit_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',
        etkit_get_digital_bluetooth: 'Bluetooth RX 2 value',
        etkit_module_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
        etkit_module_digital_seg: 'SEGMENT %1 display %2',  
        etkit_get_digital_segment: 'Segment data value',
      },
      Blocks: {
        etkit_toggle_on: 'on',
        etkit_toggle_off: 'off',
        etkit_lcd_first_line: 'first',
        etkit_lcd_seconds_line: 'seconds',
      },
      Menus: {
        etkit: 'ETkit',
      },
      
    },
  };
};
Entry.ETkit.blockMenuBlocks = [ // 여기서 순서를 정함.
  'etkit_get_analog_pin',
  'etkit_get_digital_pin',
  'etkit_get_digital_ultrasonic',
  'etkit_get_dht',
  'etkit_get_digital_pin_bool',
  'etkit_get_digital_bluetooth',
  'etkit_get_digital_segment',
  'etkit_set_digital_pin',
  'etkit_set_digital_pwm',
  'etkit_set_digital_servo',
  'etkit_module_digital_lcd',
  'etkit_module_digital_bluetooth',
  'etkit_module_digital_seg',
];

Entry.ETkit.getBlocks = function () {
  return {
    etkit_list_analog_basic: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      statements: [],
      template: '%1',
      params: [
        {
          type: 'Dropdown',
          options: [
            ['A0', '0'],
            ['A1', '1'],
            ['A2', '2'],
            ['A3', '3'],
            ['A4', '4'],
            ['A5', '5'],
          ],
          value: '0',
          fontSize: 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
      ],
      events: {},
      def: {
        params: [null],
      },
      paramsKeyMap: {
        PORT: 0,
      },
      func: function (sprite, script) {
        return script.getField('PORT');
      },
    },
    etkit_get_analog_pin: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic_string_field',
      template: Lang.template.etkit_get_analog_pin,
      statements: [],
      params: [
        {
          type: 'Block',
          accept: 'string',
        },
      ],
      events: {},
      def: {
        params: [
          {
            type: 'etkit_list_analog_basic',
          },
        ],
        type: 'etkit_get_analog_pin',
      },
      paramsKeyMap: {
        PORT: 0,
      },
      class: 'ETkitGet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = script.getValue('PORT', script);
        var ANALOG = Entry.hw.portData.ANALOG;

        if (port[0] === 'A') port = port.substring(1);

        return ANALOG ? ANALOG[port] || 0 : 0;
      },
      syntax: { js: [], py: ['etkit.get_analog_pin(%1)'] },
    },
    etkit_get_digital_ultrasonic: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic_string_field',
      template: Lang.template.etkit_get_digital_ultrasonic,
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
      ],
      events: {},
      def: {
        params: [
          {
            type: 'text',
            params: ['4'],
          },
          {
            type: 'text',
            params: ['5'],
          },
        ],
        type: 'etkit_get_digital_ultrasonic',
      },
      paramsKeyMap: {
        PORT1: 0,
        PORT2: 1,
      },
      class: 'ETkitGet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port1 = script.getNumberValue('PORT1');
        var port2 = script.getNumberValue('PORT2');

        if (!Entry.hw.sendQueue['SET']) {
          Entry.hw.sendQueue['SET'] = {};
        }
        delete Entry.hw.sendQueue['SET'][port1];
        delete Entry.hw.sendQueue['SET'][port2];
        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.ULTRASONIC] = {
          port: [port1, port2],
          time: new Date().getTime(),
        };

        return Entry.hw.portData.ULTRASONIC || 0;
      },
      syntax: {
        js: [],
        py: ['etkit.get_digital_ultrasonic(%1, %2)'],
      },
    },
    etkit_set_digital_pwm: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic',
      statements: [],
      template: Lang.template.etkit_set_digital_pwm,
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
      events: {},
      def: {
        params: [
          {
            type: 'etkit_list_digital_pwm',
          },
          {
            type: 'text',
            params: ['254'],
          },
          null,
        ],
        type: 'etkit_set_digital_pwm',
      },
      paramsKeyMap: {
        PORT: 0,
        VALUE: 1,
      },
      class: 'ETkitSet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = script.getNumberValue('PORT');
        var value = script.getNumberValue('VALUE');

        value = Math.round(value);
        value = Math.min(value, 254);
        value = Math.max(value, 0);
        if (!Entry.hw.sendQueue['SET']) {
          Entry.hw.sendQueue['SET'] = {};
        }
        Entry.hw.sendQueue['SET'][port] = {
          type: Entry.ETkit.sensorTypes.PWM,
          data: value,
          time: new Date().getTime(),
        };

        return script.callReturn();
      },
      syntax: { js: [], py: ['etkit.set_digital_pwm(%1, %2)'] },
    },
    etkit_list_digital_pwm: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      statements: [],
      template: '%1',
      params: [
        {
          type: 'Dropdown',
          options: [
            ['~3', '3'],
            ['~5', '5'],
            ['~6', '6'],
            ['~9', '9'],
            ['~10', '10'],
            ['~11', '11'],
          ],
          value: '11',
          fontSize: 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
      ],
      events: {},
      def: {
        params: [null],
      },
      paramsKeyMap: {
        PORT: 0,
      },
      func: function (sprite, script) {
        return script.getStringField('PORT');
      },
    },
    etkit_list_digital_lcd: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      statements: [],
      template: '%1',
      params: [
        {
          type: 'Dropdown',
          options: [
            [Lang.Blocks.etkit_lcd_first_line, '0'],
            [Lang.Blocks.etkit_lcd_seconds_line, '1'],
          ],
          value: '0',
          fontSize: 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
      ],
      events: {},
      def: {
        params: [null],
      },
      paramsKeyMap: {
        LINE: 0,
      },
      func: function (sprite, script) {
        return script.getField('LINE');
      },
    },
    etkit_module_digital_lcd: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic',
      template: Lang.template.etkit_module_digital_lcd,
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
      events: {},
      def: {
        params: [
          {
            type: 'etkit_list_digital_lcd',
          },
          {
            type: 'text',
            params: ['My Entry!!'],
          },
          null,
        ],
        type: 'etkit_module_digital_lcd',
      },
      paramsKeyMap: {
        LINE: 0,
        STRING: 1,
      },
      class: 'ETkitLCD',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var line = script.getNumberValue('LINE');
        var string = script.getValue('STRING');
        var text = [];

        if (!script.isStart) {
          if (typeof string === 'string') {
            for (var i = 0; i < string.length; i++) {
              text[i] = string.charCodeAt(i);
            }
          } else if (typeof string === 'number') {
            text[0] = 1;
            text[1] = string / 1;
          } else {
            text[0] = string;
          }

          if (!Entry.hw.sendQueue['SET']) {
            Entry.hw.sendQueue['SET'] = {};
          }

          script.isStart = true;
          script.timeFlag = 1;
          var fps = Entry.FPS || 60;
          var timeValue = (60 / fps) * 50;

          Entry.hw.sendQueue['SET'][line] = {
            type: Entry.ETkit.sensorTypes.LCD,
            data: {
              text0: text[0],
              text1: text[1],
              text2: text[2],
              text3: text[3],
              text4: text[4],
              text5: text[5],
              text6: text[6],
              text7: text[7],
              text8: text[8],
              text9: text[9],
              text10: text[10],
              text11: text[11],
              text12: text[12],
              text13: text[13],
              text14: text[14],
              text15: text[15],
            },
            time: new Date().getTime(),
          };

          setTimeout(function () {
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
      syntax: { js: [], py: ['etkit.module_digital_lcd(%1, %2)'] },
    },

    etkit_get_dht: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      params: [
        {
          type: 'Block',
          accept: 'string',
          defaultType: 'number',
        },
      ],
      events: {},
      def: {
        params: [
          {
            type: 'arduino_get_port_number',
            params: ['7'],
          },
          null,
        ],
        type: 'etkit_get_dht',
      },
      paramsKeyMap: {
        PORT: 0,
      },
      class: 'ETkitGet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = script.getNumberValue('PORT');

        if (!Entry.hw.sendQueue['SET']) {
          Entry.hw.sendQueue['SET'] = {};
        }
        delete Entry.hw.sendQueue['SET'][port];

        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.DHT_PIN] = {
          port: port,
          time: new Date().getTime(),
        };

        var temp;
        temp = Entry.hw.portData.DHT_PIN;
        return temp || 0;

      },
      syntax: { js: [], py: [] },
    },
    etkit_get_digital_pin: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic_string_field',
      statements: [],
      template: Lang.template.etkit_get_digital_pin,
      params: [
        {
          type: 'Block',
          accept: 'string',
          defaultType: 'number',
        },
      ],
      events: {},
      def: {
        params: [
          {
            type: 'etkit_list_digital_basic',
          },
        ],
        type: 'etkit_get_digital_pin',
      },
      paramsKeyMap: {
        PORT: 0,
      },
      class: 'ETkitGet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = script.getNumberValue('PORT');
        var DIGITAL = Entry.hw.portData.DIGITAL;
        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        if (Entry.hw.sendQueue.SET[port]) {
          return Entry.hw.sendQueue.SET[port].data;
        } else {
          Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.DIGITAL] = {
            port: port,
            time: new Date().getTime(),
          };
        }
        return DIGITAL ? DIGITAL[port] || 0 : 0;
      },
      syntax: { js: [], py: ['etkit.get_digital_pin(%1)'] },
    },
    etkit_get_digital_pin_bool: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic_boolean_field',
      statements: [],
      template: Lang.template.etkit_get_digital_pin_bool,
      params: [
        {
          type: 'Block',
          accept: 'string',
        },
      ],
      events: {},
      def: {
        params: [
          {
            type: 'etkit_list_digital_basic',
          },
        ],
        type: 'etkit_get_digital_pin_bool',
      },
      paramsKeyMap: {
        PORT: 0,
      },
      class: 'ETkitGet',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = script.getNumberValue('PORT');
        var DIGITAL = Entry.hw.portData.DIGITAL;
        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        if (Entry.hw.sendQueue.SET[port]) {
          return Entry.hw.sendQueue.SET[port].data;
        } else {
          Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.DIGITAL] = {
            port: port,
            time: new Date().getTime(),
          };
        }
        return DIGITAL ? DIGITAL[port] || 0 : 0;
      },
      syntax: { js: [], py: ['etkit.get_digital_pin_bool(%1)'] },
    },
    etkit_set_digital_pin: {
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
              type: 'Dropdown',
              options: [
                  [Lang.Blocks.ARDUINO_on, 'on'],
                  [Lang.Blocks.ARDUINO_off, 'off'],
              ],
              value: 'on',
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
      events: {},
      def: {
          params: [
              {
                  type: 'arduino_get_port_number',
                  params: ['11'],
              },
              null,
              null,
          ],
          type: 'etkit_set_digital_pin',
      },
      paramsKeyMap: {
          PORT: 0,
          VALUE: 1,
      },
      class: 'ETkitSet',
      isNotFor: ['ETkit'],
      func: function(sprite, script) {
        const port = script.getNumberValue('PORT');
        let value = script.getValue('VALUE');

        if (typeof value === 'string') {
            value = value.toLowerCase();
        }
        if (Entry.ETkit.highList.indexOf(value) > -1) {
            value = 255;
        } else if (Entry.ETkit.lowList.indexOf(value) > -1) {
            value = 0;
        } else {
            throw new Error();
        }        
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET[port] = {
            type: Entry.ETkit.sensorTypes.DIGITAL,
            data: value,
            time: new Date().getTime(),
        };
        //Entry.hw.setDigitalPortValue(port, value);
        
        Entry.hw.sendQueue[port] = value;
        return script.callReturn();
      },
      syntax: {
          js: [],
          py: [
              'etkit.set_digital_pin(%1, %2)'
          ],
      },
    },
    etkit_list_digital_basic: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      statements: [],
      template: '%1',
      params: [
        {
          type: 'Dropdown',
          options: [
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['5', '5'],
            ['6', '6'],
            ['7', '7'],
            ['8', '8'],
            ['9', '9'],
            ['10', '10'],
            ['11', '11'],
            ['12', '12'],
            ['13', '13'],
          ],
          value: '10',
          fontSize: 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
      ],
      events: {},
      def: {
        params: [null],
      },
      paramsKeyMap: {
        PORT: 0,
      },
      func: function (sprite, script) {
        return script.getStringField('PORT');
      },
    },
    etkit_set_digital_servo: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#fff',
      skeleton: 'basic',
      template: Lang.template.etkit_set_digital_servo,
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
      events: {},
      def: {
          params: [
              {
                  type: 'etkit_list_digital_basic',
              },
              {
                  type: 'text',
                  params: ['90'],
              },
              null,
          ],
          type: 'etkit_set_digital_servo',
      },
      paramsKeyMap: {
          PORT: 0,
          VALUE: 1,
      },
      class: 'ETkitSet',
      isNotFor: ['ETkit'],
      func: function(sprite, script) {
          var port = script.getNumberValue('PORT');
          var value = script.getNumberValue('VALUE');
          value = Math.min(value, 180);
          value = Math.max(value, 0);

          if (!Entry.hw.sendQueue['SET']) {
              Entry.hw.sendQueue['SET'] = {};
          }
          Entry.hw.sendQueue['SET'][port] = {
              type: Entry.ETkit.sensorTypes.SERVO,
              data: value,
              time: new Date().getTime(),
          };

          return script.callReturn();
      },
      syntax: { js: [], py: ['etkit.set_digital_servo(%1, %2)'] },
    },
    etkit_get_digital_bluetooth: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      template: Lang.template.etkit_get_digital_bluetooth,
      statements: [],
      params: [],
      events: {},
      def: {
        params: [],
        type: 'etkit_get_digital_bluetooth',
      },
      paramsKeyMap: {},
      class: 'ETkitBT',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = 2;
        var getString = Entry.hw.portData.READ_BLUETOOTH;
        if (!Entry.hw.sendQueue['SET']) {
          Entry.hw.sendQueue['SET'] = {};
        }
        delete Entry.hw.sendQueue['SET'][port];
        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.READ_BLUETOOTH] = {
          port: port,
          time: new Date().getTime(),
        };

        return getString ? getString.slice(0, getString.length - 1) : ' ';
      },
      syntax: { js: [], py: ['etkit.get_digital_bluetooth()'] },
    },
    etkit_module_digital_bluetooth: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic',
      template: Lang.template.etkit_module_digital_bluetooth,
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
      events: {},
      def: {
        params: [
          {
            type: 'text',
            params: ['My Entry!!'],
          },
          null,
        ],
        type: 'etkit_module_digital_bluetooth',
      },
      paramsKeyMap: {
        STRING: 0,
      },
      class: 'ETkitBT',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var string = script.getValue('STRING');
        var port = 3;
        var text = [];

        if (!script.isStart) {
          if (typeof string === 'string') {
            for (var i = 0; i < string.length; i++) {
              text[i] = string.charCodeAt(i);
            }
          } else {
            text[0] = string;
          }
          if (!Entry.hw.sendQueue['SET']) {
            Entry.hw.sendQueue['SET'] = {};
          }

          script.isStart = true;
          script.timeFlag = 1;
          var fps = Entry.FPS || 60;
          var timeValue = (60 / fps) * 50;

          Entry.hw.sendQueue['SET'][port] = {
            type: Entry.ETkit.sensorTypes.WRITE_BLUETOOTH,
            data: {
              text0: text[0],
              text1: text[1],
              text2: text[2],
              text3: text[3],
              text4: text[4],
              text5: text[5],
              text6: text[6],
              text7: text[7],
              text8: text[8],
              text9: text[9],
              text10: text[10],
              text11: text[11],
              text12: text[12],
              text13: text[13],
              text14: text[14],
              text15: text[15],
            },
            time: new Date().getTime(),
          };

          setTimeout(function () {
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
      syntax: { js: [], py: ['etkit.module_digital_bluetooth(%1)'] },
    },
    etkit_module_digital_seg: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic',
      statements: [],
      template: Lang.template.etkit_module_digital_seg,
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
      events: {},
      def: {
        params: [
          {
            type: 'text',
            params: ['1234'],
          },
          null,
        ],
        type: 'etkit_module_digital_seg',
      },
      paramsKeyMap: {
        STRING : 0,
      },
      class: 'ETkitSEG',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = 0;
        var string = script.getValue('STRING');
        var string2 = script.getValue('STRING2');
        var text = [];
        if(!script.isStart) {
          if(typeof string === 'string') {
            for(var i=0; i<string.length; i++) {
              text[i] = string.charCodeAt(i);
            }
          }
          else if(typeof string === 'number') {
            text[0] = 1;
            text[1] = string / 1;
          } else {
            text[0] = string;
          }
          if (!Entry.hw.sendQueue['SET']) {
            Entry.hw.sendQueue['SET'] = {};
          }
          script.isStart = true;
          script.timeFlag = 1;
          var fps = Entry.FPS || 60;
          var timeValue = (60 / fps) * 50;

          Entry.hw.sendQueue['SET'][port] = {
            type: Entry.ETkit.sensorTypes.WRITE_SEG,
            data: {
              text0: text[0],
              text1: text[1],
              text2: text[2],
              text3: text[3],
              text4: text[4],
              text5: text[5],
              text6: text[6],
              text7: text[7],
              text8: text[8],
              text9: text[9],
              text10: text[10],
              text11: text[11],
              text12: text[12],
              text13: text[13],
              text14: text[14],
              text15: text[15],
            },
            time: new Date().getTime(),
          };
          setTimeout(function () {
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
      syntax: { js: [], py: [] },
    },
    etkit_get_digital_segment: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic_string_field',
      template: Lang.template.etkit_get_digital_segment,
      statements: [],
      params: [],
      events: {},
      def: {
        params: [],
        type: 'etkit_get_digital_segment',
      },
      paramsKeyMap: {},
      class: 'ETkitSEG',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = 4;
        var getString = Entry.hw.portData.READ_SEG;
        if (!Entry.hw.sendQueue['SET']) {
          Entry.hw.sendQueue['SET'] = {};
        }
        delete Entry.hw.sendQueue['SET'][port];
        if (!Entry.hw.sendQueue['GET']) {
          Entry.hw.sendQueue['GET'] = {};
        }
        Entry.hw.sendQueue['GET'][Entry.ETkit.sensorTypes.READ_SEG] = {
          port: port,
          time: new Date().getTime(),
        };
        var temp = getString.slice(0, getString.length - 1);
        
        return getString ? getString.slice(0, getString.length - 1) : ' ';
      },
      syntax: { js: [], py: ['etkit.get_digital_segment()'] },
    },
  };
}



module.exports = Entry.ETkit;