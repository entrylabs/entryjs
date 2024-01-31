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
    if (!Entry.hw.sendQueue.SET) {
      Entry.hw.sendQueue = {
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
    CO2:      5,
    OLED:     6,
    TIMER:    8,
    READ_BLUETOOTH: 9,
    WRITE_BLUETOOTH: 10,
  },

  highList: ['high', '1', 'on'],
  lowList: ['low', '0', 'off'],
  BlockState: {},
};


Entry.ETkit.setLanguage = function () {
  return {
    ko: {
      template: {
        etkit_set_digital_pin: '디지털 %1 번 핀 %2 %3',
        etkit_get_dht: '%1 번 핀의 온습도 센서 값 ',
        etkit_lcd_first_line: '첫 번째',
        etkit_lcd_seconds_line: '두 번째',
        etkit_module_digital_lcd: 'LCD화면 %1 줄에 %2 나타내기 %3',
        etkit_get_digital_bluetooth: '블루투스 RX 2 핀 데이터 값',
        etkit_set_digital_bluetooth: '블루투스 TX 3 핀에 %1 데이터 보내기 %2',
        etkit_set_digital_oled: 'OLED화면 X 좌표 %1  Y 좌표 %2 에 %3 나타내기 %4',
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
        etkit_set_digital_pin: 'Digital %1 Pin %2 %3',
        etkit_get_dht: 'pin %1 DHT sensor value',
        etkit_lcd_first_line: 'first',
        etkit_lcd_seconds_line: 'seconds',
        etkit_module_digital_lcd: 'LCD %1 line %2 appear %3',
        etkit_get_digital_bluetooth: 'Bluetooth RX 2 value',
        etkit_set_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
        etkit_set_digital_oled: 'OLED X coordinate %1 Y coordinate %2 appear %3 %4',
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
Entry.ETkit.blockMenuBlocks = [
  'etkit_set_digital_pin',
  'etkit_get_dht',
  'etkit_module_digital_lcd',
  'etkit_get_digital_bluetooth',
  'etkit_set_digital_bluetooth',
  'etkit_set_digital_oled',
];

Entry.ETkit.getBlocks = function () {
  return {
    etkit_set_digital_oled: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic',
      statements: [],
      template: Lang.template.etkit_set_digital_oled,
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
            params: ['20'],
          },
          {
            type: 'text',
            params: ['20'],
          },
          {
            type: 'text',
            params: ['My Entry!!'],
          },
          null,
        ],
        type: 'etkit_set_digital_oled',
      },
      paramsKeyMap: {
        VALUE0: 0,
        VALUE1: 1,
        STRING: 2,
      },
      class: 'ETkitOLED',
      isNotFor: ['ETkit'],
      func: function (sprite, script) {
        var port = 0; 
        var coordinate_x = script.getNumberValue('VALUE0');
        var coordinate_y = script.getNumberValue('VALUE1');
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

          coordinate_x = Math.min(coordinate_x, 127);
          coordinate_x = Math.max(coordinate_x, 0);
          coordinate_y = Math.min(coordinate_y, 63);
          coordinate_y = Math.max(coordinate_y, 0);

          Entry.hw.sendQueue['SET'][port] = {
            type: Entry.ETkit.sensorTypes.OLED,
            data: {
              value0: coordinate_x,
              value1: coordinate_y,
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
      syntax: { js: [], py: ['etkit.set_digital_oled(%1, %2, %3)'] },
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
            [Lang.template.etkit_lcd_first_line, '0'],
            [Lang.template.etkit_lcd_seconds_line, '1'],
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
    etkit_set_digital_bluetooth: {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      skeleton: 'basic',
      template: Lang.template.etkit_set_digital_bluetooth,
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
        type: 'etkit_set_digital_bluetooth',
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
      syntax: { js: [], py: ['etkit.set_digital_bluetooth(%1)'] },
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
      class: 'ETkitDHT',
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
        Entry.hw.sendQueue['GET'][
          Entry.ETkit.sensorTypes.DHT_PIN
        ] = {
          port: port,
          time: new Date().getTime(),
        };

        var temp;
        temp = Entry.hw.portData.DHT_PIN;
        return temp || 0;

      },
      syntax: { js: [], py: [] },
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
                  type: 'arduino_get_port_number',
                  params: ['3'],
              },
              {
                  type: 'arduino_get_digital_toggle',
                  params: ['on'],
              },
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
          return script.callReturn();
      },
      syntax: {
          js: [],
          py: ['etkit.set_digital_toggle(%1, %2)'
          ],
      },
  },
  };
}

module.exports = Entry.ETkit;
