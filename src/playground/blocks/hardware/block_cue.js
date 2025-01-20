'use strict';

var CueState = {
    STATE_READY: 'ready',
    STATE_WAIT: 'wait',
    STATE_DONE: 'done',
};

Entry.Cue = {
    PORT_MAP: {
        seq: 0,
        category: 0,
        action: 0,
        param_cnt: 0,
        paramA: 0,
        paramB: 0,
        paramC: 0,
        paramD: 0,
        modeA: 0,
        modeB: 0,
    },
    setZero: function () {
        var portMap = Entry.Cue.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        Entry.Cue.sequance = 1;
        Entry.Cue.isStarted = false;
        Entry.Cue.state = CueState.STATE_DONE;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
    },
    id: '24.3',
    name: 'Cue',
    url: 'https://clevermate.kr/',
    imageName: 'cue.png',
    title: {
        ko: '큐',
        en: 'Cue',
    },
    monitorTemplate: {
        imgPath: 'hw/cue.png',
        width: 605,
        height: 434,
    },
    sequance: 1,
    isStarted: false,
    state: CueState.STATE_DONE,
};
Entry.Cue.blockMenuBlocks = [
    'cue_sensor1',
    'cue_sensor2',
    'cue_turn_drive',
    'cue_turn_drive_360',
    'cue_drive',
    'cue_wheel_speed',
    'cue_drive_stop',
    'cue_v_head',
    'cue_h_head',
    'cue_forward_head',
    'cue_light_color',
    'cue_eye',
    'cue_sound_emotion',
    'cue_sound_moving',
    'cue_sound_greeting',
    'cue_sound_shape',
    'cue_sound_color',
    'cue_sound_number',
    'cue_sound_direction',
    'cue_my_sound',
];
Entry.Cue.getBlocks = function () {
    return {

        cue_sensor1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가운데 버튼', 0x05],
                        ['버튼 ●', 0x06],
                        ['버튼 ■', 0x07],
                        ['버튼 ▲', 0x08],
                        ['박수 소리', 0x09],
                        ['소리', 0x0a],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['5'],
                type: 'cue_sensor1',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            isNotFor: ['Cue'],
            class: 'Cue_senor',
            func: function (sprite, script) {
                var var1 = script.getNumberField('VALUE', script);
                var pd = Entry.hw.portData;
                switch (var1) {
                    case 0x05:
                        return pd.button0 ? true : false;
                        break;
                    case 0x06:
                        return pd.button1 ? true : false;
                        break;
                    case 0x07:
                        return pd.button2 ? true : false;
                        break;
                    case 0x08:
                        return pd.button3 ? true : false;
                        break;
                    case 0x09:
                        return pd.clap ? true : false;
                        break;
                    case 0x0a:
                        return pd.sound ? true : false;
                        break;
                    default:
                        break;
                }
                return -1;
            },
        },
        cue_sensor2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞쪽 장애물', 0x00],
                        ['뒤쪽 장애물', 0x01],
                        ['오른쪽 장애물', 0x02],
                        ['왼쪽 장애물', 0x03],
                        // [ "움직이지 못함", 0x04 ],	// not support.
                        ['들림', 0x0a],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['0'],
                type: 'cue_sensor2',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            isNotFor: ['Cue'],
            class: 'Cue_senor',
            func: function (sprite, script) {
                var var1 = script.getNumberField('VALUE', script);
                var pd = Entry.hw.portData;
                switch (var1) {
                    case 0x00:
                        return pd.barrier_front ? true : false;
                        break;
                    case 0x01:
                        return pd.barrier_rear ? true : false;
                        break;
                    case 0x02:
                        return pd.barrier_right ? true : false;
                        break;
                    case 0x03:
                        return pd.barrier_left ? true : false;
                        break;
                    case 0x04:
                        return pd.barrier_move ? true : false;
                        break;
                    case 0x0a:
                        return pd.pickup ? true : false;
                        break;
                    default:
                        break;
                }
                return -1;
            },
        },

        cue_turn_drive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 으로 %2 만큼 회전하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['시계 방향', 0x03], ['반 시계 방향', 0x04]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'angle',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['3', 30],
                type: 'cue_turn_drive',
            },
            paramsKeyMap: {
                ROTATION: 0,
                VALUE: 1,
            },
            class: 'Cue_drive',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('ROTATION', script);
                var var2 = script.getNumberValue('VALUE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = var2;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_turn_drive_360: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 으로 한 바퀴 회전하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['시계 방향', 0x03], ['반 시계 방향', 0x04]],
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
                params: ['3'],
                type: 'cue_turn_drive_360',
            },
            paramsKeyMap: {
                ROTATION: 0,
            },
            class: 'Cue_drive',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('ROTATION', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = 360;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_drive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 (으)로 %2 cm 만큼 %3이동하기 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [['앞', 0x01], ['뒤', 0x02]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['매우 느리게', 0x01],
                        ['느리게', 0x02],
                        ['보통 속도로', 0x03],
                        ['빠르게', 0x04],
                        ['매우 빠르게', 0x05],
                    ],
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
                params: ['1', 30, '3'],
                type: 'cue_drive',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
                SPEED: 2,
            },
            class: 'Cue_drive',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var var2 = script.getNumberValue('DISTANCE', script);
                var var3 = script.getNumberField('SPEED', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 2;
                    if (var2 > 1638) {
                        var2 = 1638;
                    }
                    sq.paramA = var2;
                    sq.paramB = var3;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_wheel_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '왼쪽 바퀴 %1(으)로 %2cm/s, 오른쪽 바퀴 %3(으)로 %4cm/s 속도로 움직이기 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [['앞', 0x01], ['뒤', 0x02]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [['앞', 0x01], ['뒤', 0x02]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: ['1', '20', '1', '20'],
                type: 'cue_wheel_speed',
            },
            paramsKeyMap: {
                DIRECTION_L: 0,
                SPEED_L: 1,
                DIRECTION_R: 2,
                SPEED_R: 3,
            },
            class: 'Cue_drive',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('DIRECTION_L', script);
                var var2 = script.getNumberValue('SPEED_L', script);
                var var3 = script.getNumberField('DIRECTION_R', script);
                var var4 = script.getNumberValue('SPEED_R', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 0x01;
                    sq.action = 0x05;
                    sq.param_cnt = 0x04;
                    sq.paramA = var1;
                    sq.paramB = var2;
                    sq.paramC = var3;
                    sq.paramD = var4;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 50);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_drive_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '정지 %1',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cue_drive_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Cue_drive',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 0x01;
                    sq.action = 0x06;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 50);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_v_head: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 바라보기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['위쪽', 0x04], ['가운데', 0x05], ['아래쪽', 0x06]],
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
                params: ['4'],
                type: 'cue_v_head',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'Cue_head',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 3;
                    sq.action = var1;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 500);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_h_head: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 을 %2 방향으로 바라보기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 0x01],
                        // [ "가운데", 0x02 ],
                        ['오른쪽', 0x03],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['15˚', 15],
                        ['30˚', 30],
                        ['45˚', 45],
                        ['60˚', 60],
                        ['75˚', 75],
                        ['90˚', 90],
                        ['105˚', 105],
                        ['120˚', 120],
                    ],
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
                params: ['1', 30],
                type: 'cue_h_head',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'Cue_head',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var var2 = script.getNumberField('VALUE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 3;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    if (var2 > 120) {
                        var2 = 120;
                    }
                    sq.paramA = var2;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 1000);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_forward_head: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '앞을 바라보기 %1',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cue_forward_head',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Cue_head',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 3;
                    sq.action = 0x02;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 500);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_voice_head: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '소리가 나는 쪽 바라보기 %1',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cue_voice_head',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Cue_head',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 3;
                    sq.action = 7;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.soundDirection) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                                var timer = setTimeout(function () {
                                    Entry.Cue.state = CueState.STATE_DONE;
                                }, 100);
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_light_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '%1 라이트 %2 색으로 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['모든', 0x01],
                        ['왼쪽 귀', 0x02],
                        ['오른쪽 귀', 0x03],
                        ['전면', 0x04],
                        ['버튼', 0x07],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'cue_light_color',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'Cue_light',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('LED', script);
                var var2 = script.getStringField('COLOR', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 4;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = parseInt(parseInt(var2.substr(1, 2), 16));
                    sq.paramB = parseInt(parseInt(var2.substr(3, 2), 16));
                    sq.paramC = parseInt(parseInt(var2.substr(5, 2), 16));
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 50);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_eye: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '눈 패턴 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0x00],
                        ['웃는 얼굴', 0x01],
                        ['익살스러운 얼굴', 0x02],
                        ['화난 얼굴', 0x03],
                        ['놀란 얼굴', 0x04],
                        ['모두 켜기', 0x05],
                    ],
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
                params: ['0'],
                type: 'cue_eye',
            },
            paramsKeyMap: {
                EYE: 0,
            },
            class: 'Cue_light',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var var1 = script.getNumberField('EYE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Cue.isStarted) {
                    sq.category = 4;
                    sq.action = 6;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 3;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            var timer = setTimeout(function () {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }, 50);
                            Entry.Cue.state = CueState.STATE_WAIT;
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_emotion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '감정 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['행복', 1],
                        ['슬픔', 2],
                        ['기쁨', 3],
                        ['아픔', 4],
                        ['무서움', 5],
                        ['무작위', 0],
                    ],
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
                params: ['1'],
                type: 'cue_sound_emotion',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 5) + 1;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_moving: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '동작 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['간다!', 6],
                        ['해 보자!', 7],
                        ['미션 성공!', 8],
                        ['새로운 계획', 15],
                        ['박수', 9],
                        ['센서 가동', 10],
                        ['들어올리기', 11],
                        ['내려놓기', 12],
                        ['손 앞에', 13],
                        ['손 뒤에', 14],
                        ['무작위', 0],
                    ],
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
                params: ['6'],
                type: 'cue_sound_moving',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 10) + 6;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_greeting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '인사 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['안녕!', 16],
                        ['다음에 만나!', 17],
                        ['생일 축하해!', 18],
                        ['휴일 잘 보내!', 19],
                        ['무작위', 0],
                    ],
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
                params: ['16'],
                type: 'cue_sound_greeting',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 4) + 16;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_shape: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '모양 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['원', 20],
                        ['삼각형', 21],
                        ['사각형', 22],
                        ['무작위', 0],
                    ],
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
                params: ['20'],
                type: 'cue_sound_shape',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 3) + 20;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '색깔 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨간색', 23],
                        ['주황색', 24],
                        ['노란색', 25],
                        ['초록색', 26],
                        ['파란색', 27],
                        ['무작위', 0],
                    ],
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
                params: ['23'],
                type: 'cue_sound_color',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 5) + 23;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '숫자 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 28],
                        ['2', 29],
                        ['3', 30],
                        ['무작위', 0],
                    ],
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
                params: ['28'],
                type: 'cue_sound_number',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 3) + 28;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_sound_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '방향 %1 말하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞쪽', 31],
                        ['뒤쪽', 32],
                        ['오른쪽', 33],
                        ['왼쪽', 34],
                        ['무작위', 0],
                    ],
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
                params: ['31'],
                type: 'cue_sound_direction',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 2;
                    sq.param_cnt = 1;
                    if (var1 == 0) {
                        var1 = Math.floor(Math.random() * 4) + 31;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        cue_my_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '녹음된 %1 소리 내기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['#1', 0x00],
                        ['#2', 0x01],
                        ['#3', 0x02],
                        ['#4', 0x03],
                        ['#5', 0x04],
                        ['#6', 0x05],
                        ['#7', 0x06],
                        ['#8', 0x07],
                        ['#9', 0x08],
                        ['#10', 0x09],
                    ],
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
                params: ['0'],
                type: 'cue_my_sound',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Cue_Sound',
            isNotFor: ['Cue'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Cue.isStarted) {
                    sq.category = 5;
                    sq.action = 1;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Cue.sequance++;
                    Entry.Cue.isStarted = true;
                    Entry.Cue.state = CueState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Cue.state) {
                        case CueState.STATE_READY:
                            if (pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case CueState.STATE_WAIT:
                            if (!pd.isPlaying) {
                                Entry.Cue.state = CueState.STATE_DONE;
                            }
                            return script;
                            break;
                        case CueState.STATE_DONE:
                            Entry.Cue.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
    };
};

module.exports = Entry.Cue;
