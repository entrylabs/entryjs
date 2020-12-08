'use strict';


const COMMAND_TYPE = {
    MOVE_FORWARD: 0x01,
    MOVE_BACKWARD: 0x02,
    TURN_LEFT: 0x03,
    TURN_RIGHT: 0x04,
    TURN_LEFT_RIGHT: 0x05,
    ONOFF_REAR_LED: 0x06,
    ONOFF_SIDE_LED: 0x07,
    PLAY_SOUND: 0x08,    
    GET_FORWARD_SENSOR: 0x09,
    GET_BOTTOM_SENSOR: 0x0A,
    GET_LIGHT_SENSOR: 0x0B,
};

Entry.Jjoggo = {
    id: '99.1',
    name: 'jjoggo',
    url: "http://jjomulrak.com/",
    imageName: 'jjoggo.png',
    title: {
        ko: '쪼꼬',
        en: 'JjoGgo',
    },

    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },

    setZero: function () {
        Entry.hw.update(); // 해당 데이터를 하드웨어에 전달한다.
    },
};

Entry.Jjoggo.setLanguage = function() {
    return {
        ko: {
            template: {
                jjoggo_move_forward: "앞으로 %1 %2 이동 %3",
                jjoggo_move_backward: "뒤로 %1 %2 이동 %3",
                jjoggo_turn_left: "왼쪽으로 %1 %2 돌기 %3",
                jjoggo_turn_right: "오른쪽으로 %1 %2 돌기 %3",
                jjoggo_move_left_right: "오른쪽으로 %1 %2,왼쪽 %3 %4 이동 %5",
            },
            Blocks: {
                jjoggo_move_step: '칸',
                jjoggo_move_cm: 'cm',
                jjoggo_trun_drgree: '도',
                jjoggo_trun_round: '바퀴',
                jjoggo_toggle_on: '켜기',
                jjoggo_toggle_off: '끄기',                
            }
        },
        en: {
            template: {
                jjoggo_move_forward: "move forward %1 %2 block %3",
                jjoggo_move_backward: "move backward %1 %2 block %3",
                jjoggo_turn_left: "%1 %2 to the left %3",
                jjoggo_turn_right: "%1 %2 to the right %3",
                jjoggo_move_left_right: "move right %1 %2,left %3 %4 %5",
            },
            Blocks: {
                jjoggo_move_step: 'step',
                jjoggo_move_cm: 'cm',
                jjoggo_trun_drgree: 'degree',
                jjoggo_trun_round: 'turns',
                jjoggo_toggle_on: 'on',
                jjoggo_toggle_off: 'off',
            }
        },
    };
};

Entry.Jjoggo.blockMenuBlocks = [
    //jjoggo
    'jjoggo_move_forward',
    'jjoggo_move_backward',
    'jjoggo_turn_left',
    'jjoggo_turn_right',
    'jjoggo_move_left_right',    
    'jjoggo_onoff_led_rear',
    'jjoggo_set_led_color',
    'jjoggo_play_sound',
    
    'jjoggo_detected_front_sensor',
    'jjoggo_detected_light_sensor',
    'jjoggo_detected_line_sensor',
    'jjoggo_get_front_sensor',
    'jjoggo_get_bottom_sensor',
    'jjoggo_get_light_sensor',    
];

Entry.Jjoggo.getBlocks = function () {
    return {
        jjoggo_move_forward: {
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
                        [Lang.Blocks.jjoggo_move_step, '칸'],
                        [Lang.Blocks.jjoggo_move_cm, 'cm'],                        
                    ],
                    value: '칸',
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
                params: [1, '칸', null],
                type: 'jjoggo_move_forward',
            },
            paramsKeyMap: {
                MOVE_CNT: 0,
                MOVE_UNIT: 1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const move_cnt = parseInt( script.getValue('MOVE_CNT'));
                let move_unit = script.getValue('MOVE_UNIT');
                if(move_unit==='칸') move_unit = 'step';

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_FORWARD,
                        data: {
                            param1:move_cnt,
                            param2:move_unit,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        jjoggo_move_backward: {
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
                          [Lang.Blocks.jjoggo_move_step, '칸'],
                          [Lang.Blocks.jjoggo_move_cm, 'cm'],                        
                      ],
                      value: '칸',
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
                  params: [1, '칸', null],
                  type: 'jjoggo_move_backward',
              },
              paramsKeyMap: {
                  MOVE_CNT: 0,
                  MOVE_UNIT: 1,
              },
              class: 'jjoggo_command',
              //isNotFor: ['jjoggo'],
              func: function (sprite, script) {
                  const sq = Entry.hw.sendQueue;
                  const move_cnt = parseInt( script.getValue('MOVE_CNT'));
                  let move_unit = script.getValue('MOVE_UNIT');
                  if(move_unit==='칸') move_unit = 'step';
  
                  if (!script.is_started) {
                      script.is_started = true;
                      const msgId = Entry.Jjoggo.getHashKey();
                      script.msg_id = msgId;
                      sq.msg_id = script.msg_id;
                      const msg = {
                          id: msgId,
                          type: COMMAND_TYPE.MOVE_BACKWARD,
                          data: {
                              param1:move_cnt,
                              param2:move_unit,
                          },
                          time: Date.now()
                      };
                      sq.msg = msg;
                      return script;
                  } 
                  
                  if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                      delete script.is_started;
                      delete script.msg_id;
                      delete pd.msgId;
                      return script.callReturn();
                  }
                  return script;
              },
          },
          jjoggo_turn_left: {
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
                          [Lang.Blocks.jjoggo_trun_drgree, '도'],
                          [Lang.Blocks.jjoggo_trun_round, '바퀴'],                        
                      ],
                      value: '도',
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
                  params: [90, '도', null],
                  type: 'jjoggo_turn_left',
              },
              paramsKeyMap: {
                  TURN_CNT: 0,
                  TURN_UNIT: 1,
              },
              class: 'jjoggo_command',
              //isNotFor: ['jjoggo'],
              func: function (sprite, script) {
                  const sq = Entry.hw.sendQueue;
                  const turn_cnt = parseInt( script.getValue('TURN_CNT'));
                  let turn_unit = script.getValue('TURN_UNIT');
                  if(turn_unit==='도') turn_unit = 'degree';
                  else if(turn_unit==='바퀴') turn_unit = 'turns';
                  if(turn_unit === 'degree') {
                    if(turn_cnt<0) turn_cnt = 0;
                    else if(turn_cnt>180) turn_cnt = 180;
                  }
  
                  if (!script.is_started) {
                      script.is_started = true;
                      const msgId = Entry.Jjoggo.getHashKey();
                      script.msg_id = msgId;
                      sq.msg_id = script.msg_id;
                      const msg = {
                          id: msgId,
                          type: COMMAND_TYPE.TURN_LEFT,
                          data: {
                              param1:turn_cnt,
                              param2:turn_unit,
                          },
                          time: Date.now()
                      };
                      sq.msg = msg;
                      return script;
                  } 
                  
                  if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                      delete script.is_started;
                      delete script.msg_id;
                      delete pd.msgId;
                      return script.callReturn();
                  }
                  return script;
              },
          },
          jjoggo_turn_right: {
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
                          [Lang.Blocks.jjoggo_trun_drgree, '도'],
                          [Lang.Blocks.jjoggo_trun_round, '바퀴'],                        
                      ],
                      value: '도',
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
                  params: [90, '도', null],
                  type: 'jjoggo_turn_right',
              },
              paramsKeyMap: {
                  TURN_CNT: 0,
                  TURN_UNIT: 1,
              },
              class: 'jjoggo_command',
              //isNotFor: ['jjoggo'],
              func: function (sprite, script) {
                  const sq = Entry.hw.sendQueue;
                  const turn_cnt = parseInt(script.getValue('TURN_CNT'));
                  if(turn_unit==='도') turn_unit = 'degree';
                  else if(turn_unit==='바퀴') turn_unit = 'turns';                  
                  if(turn_unit === 'degree') {
                    if(turn_cnt<0) turn_cnt = 0;
                    else if(turn_cnt>180) turn_cnt = 180;
                  }
  
                  if (!script.is_started) {
                      script.is_started = true;
                      const msgId = Entry.Jjoggo.getHashKey();
                      script.msg_id = msgId;
                      sq.msg_id = script.msg_id;
                      const msg = {
                          id: msgId,
                          type: COMMAND_TYPE.TURN_RIGHT,
                          data: {
                              param1:turn_cnt,
                              param2:turn_unit,
                          },
                          time: Date.now()
                      };
                      sq.msg = msg;
                      return script;
                  } 
                  
                  if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                      delete script.is_started;
                      delete script.msg_id;
                      delete pd.msgId;
                      return script.callReturn();
                  }
                  return script;
              },
          },  
          jjoggo_move_left_right: {
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
                          [Lang.Blocks.jjoggo_move_step, '칸'],
                          [Lang.Blocks.jjoggo_move_cm, 'cm'],                        
                      ],
                      value: '칸',
                      fontSize: 11,
                      bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                      arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                  },
                  {
                      type: 'Block',
                      accept: 'string',
                      defaultType: 'number',
                  },
                  {
                      type: 'Dropdown',
                      options: [
                          [Lang.Blocks.jjoggo_move_step, '칸'],
                          [Lang.Blocks.jjoggo_move_cm, 'cm'],                        
                      ],
                      value: '칸',
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
                  params: [1, '칸', 1, '칸', null],
                  type: 'jjoggo_move_left_right',
              },
              paramsKeyMap: {
                  MOVE_RIGHT_CNT: 0,
                  MOVE_RIGHT_UNIT: 1,
                  MOVE_LEFT_CNT: 2,
                  MOVE_LEFT_UNIT: 3,
              },
              class: 'jjoggo_command',
              //isNotFor: ['jjoggo'],
              func: function (sprite, script) {
                  const sq = Entry.hw.sendQueue;
                  const turn_right_cnt = parseInt(script.getValue('MOVE_RIGHT_CNT'));
                  const turn_left_cnt = parseInt(script.getValue('MOVE_LEFT_CNT'));
                  let move_right_unit = script.getValue('MOVE_RIGHT_UNIT');
                  let move_left_unit = script.getValue('MOVE_LEFT_UNIT');
                  
                  if(move_right_unit==='칸') move_right_unit = 'step';
                  if(move_left_unit==='칸') move_left_unit = 'step';
  
                  if (!script.is_started) {
                      script.is_started = true;
                      const msgId = Entry.Jjoggo.getHashKey();
                      script.msg_id = msgId;
                      sq.msg_id = script.msg_id;
                      const msg = {
                          id: msgId,
                          type: COMMAND_TYPE.TURN_LEFT_RIGHT,
                          data: {
                              param1:turn_right_cnt,
                              param2:move_right_unit,
                              param1:turn_left_cnt,
                              param2:move_left_unit,
                          },
                          time: Date.now()
                      };
                      sq.msg = msg;
                      return script;
                  } 
                  
                  if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                      delete script.is_started;
                      delete script.msg_id;
                      delete pd.msgId;
                      return script.callReturn();
                  }
                  return script;
              },
          },
    };
};

module.exports = Entry.Jjoggo;
