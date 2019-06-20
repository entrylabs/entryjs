'use strict';

var DashState = {
    STATE_READY: 'ready',
    STATE_WAIT: 'wait',
    STATE_DONE: 'done',
};

Entry.Dash = {
    PORT_MAP: {
        seq: 0,
        category: 0,
        action: 0,
        param_cnt: 0,
        paramA: 0,
        paramB: 0,
        paramC: 0,
        paramD: 0,
        modeA: 0, //1:RO, 2:RW, 3:WO
        modeB: 0,
    },
    setZero: function() {
        var portMap = Entry.Dash.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        Entry.Dash.sequance = 1;
        Entry.Dash.isStarted = false;
        Entry.Dash.state = DashState.STATE_DONE;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
    },
    id: '24.1',
    name: 'Dash',
    url: 'http://www.dashedu.kr/',
    imageName: 'dash.png',
    title: {
        ko: '대시',
        en: 'Dash',
    },
    monitorTemplate: {
        imgPath: 'hw/dash.png',
        width: 605,
        height: 434,
    },
    sequance: 1,
    isStarted: false,
    state: DashState.STATE_DONE,
};
Entry.Dash.blockMenuBlocks = [
    //region dash
    'dash_sensor1',
    'dash_sensor2',
    'dash_turn_drive',
    'dash_turn_drive_360',
    'dash_drive',
    'dash_wheel_speed',
    'dash_drive_stop',
    'dash_v_head',
    'dash_h_head',
    'dash_forward_head',
    'dash_sound_say',
    'dash_sound_animal',
    'dash_sound_move',
    'dash_sound_strange',
    'dash_my_sound',
    'dash_light_color',
    'dash_tail_light_color',
    'dash_eye',
    'dash_animation',
    //endregion dash
];
Entry.Dash.getBlocks = function() {
    return {
        // 소리
        dash_sound_say: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '말하기 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['안녕', 0x00],
                        ['응?', 0x01],
                        ['어 어!', 0x02],
                        ['좋아', 0x03],
                        ['한숨..', 0x04],
                        ['짜잔!', 0x05],
                        ['위!', 0x06],
                        ['잘 가', 0x07],
                        ['무작위', 0x1e],
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
                // 기본 값
                params: ['0'],
                type: 'dash_sound_say',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Dash_Sound',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Dash.isStarted) {
                    sq.category = 5; // 소리
                    sq.action = 2; // 말하기
                    sq.param_cnt = 1; // param 갯수
                    if (var1 == 0x1e) {
                        var1 = Math.floor(Math.random() * 8);
                    }
                    sq.paramA = var1;
                    sq.modeA = 2; // WR
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            // 재생이 시작되었는지 확인
                            if (pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            // 재생이 끝났는지 확인
                            if (!pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_sound_animal: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '동물 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['말', 0x08],
                        ['고양이', 0x09],
                        ['개', 0x0a],
                        ['공룡', 0x0b],
                        ['사자', 0x0c],
                        ['염소', 0x0d],
                        ['악어', 0x0e],
                        ['코끼리', 0x0f],
                        ['무작위', 0x1e],
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
                // 기본 값
                params: ['8'],
                type: 'dash_sound_animal',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Dash_Sound',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Dash.isStarted) {
                    console.log(var1);
                    sq.category = 5; // 소리
                    sq.action = 2; // 말하기
                    sq.param_cnt = 1; // param 갯수
                    if (var1 == 0x1e) {
                        var1 = Math.floor(Math.random() * 8) + 0x08;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2; // WR
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            // 재생이 시작되었는지 확인
                            if (pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            // 재생이 끝났는지 확인
                            if (!pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            console.log('Goto Next Block');
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_sound_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '이동 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['화재 경보', 0x10],
                        ['트럭 경적', 0x11],
                        ['자동차 엔진', 0x12],
                        ['자동차 타이어 끼익 소리', 0x13],
                        ['헬리콥터', 0x14],
                        ['제트기', 0x15],
                        ['보트', 0x16],
                        ['기차', 0x17],
                        ['무작위', 0x1e],
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
                // 기본 값
                params: ['16'],
                type: 'dash_sound_move',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Dash_Sound',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Dash.isStarted) {
                    console.log(var1);
                    sq.category = 5; // 소리
                    sq.action = 2; // 말하기
                    sq.param_cnt = 1; // param 갯수
                    if (var1 == 0x1e) {
                        var1 = Math.floor(Math.random() * 8) + 0x10;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2; // WR
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            // 재생이 시작되었는지 확인
                            if (pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            // 재생이 끝났는지 확인
                            if (!pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            console.log('Goto Next Block');
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_sound_strange: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '이상한 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['경고음', 0x18],
                        ['레이저', 0x19],
                        ['고르륵 소리', 0x1a],
                        ['윙윙 소리', 0x1b],
                        ['어 어 어', 0x1c],
                        ['찍 소리', 0x1d],
                        ['무작위', 0x1e],
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
                // 기본 값
                params: ['24'],
                type: 'dash_sound_strange',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Dash_Sound',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Dash.isStarted) {
                    console.log(var1);
                    sq.category = 5; // 소리
                    sq.action = 2; // 말하기
                    sq.param_cnt = 1; // param 갯수
                    if (var1 == 0x1e) {
                        var1 = Math.floor(Math.random() * 6) + 0x18;
                    }
                    sq.paramA = var1;
                    sq.modeA = 2; // WR
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            // 재생이 시작되었는지 확인
                            if (pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            // 재생이 끝났는지 확인
                            if (!pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            console.log('Goto Next Block');
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_my_sound: {
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
                // 기본 값
                params: ['0'],
                type: 'dash_my_sound',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'Dash_Sound',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('SOUND', script);
                if (!Entry.Dash.isStarted) {
                    sq.category = 5;
                    sq.action = 1;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 2;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            // 재생이 시작되었는지 확인
                            if (pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            // 재생이 끝났는지 확인
                            if (!pd.isPlaying) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        // LED
        dash_light_color: {
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
                type: 'dash_light_color',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'Dash_light',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('LED', script);
                var var2 = script.getStringField('COLOR', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 4;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = parseInt(parseInt(var2.substr(1, 2), 16));
                    sq.paramB = parseInt(parseInt(var2.substr(3, 2), 16));
                    sq.paramC = parseInt(parseInt(var2.substr(5, 2), 16));
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_tail_light_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '꼬리 라이트 %1 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['켜기', 0x01], ['끄기', 0x00]],
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
                type: 'dash_tail_light_color',
            },
            paramsKeyMap: {
                LED: 0,
            },
            class: 'Dash_light',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('LED', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 4;
                    sq.action = 0x05;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_eye: {
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
                type: 'dash_eye',
            },
            paramsKeyMap: {
                EYE: 0,
            },
            class: 'Dash_light',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('EYE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 4;
                    sq.action = 6;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        // 머리
        dash_v_head: {
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
                type: 'dash_v_head',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'Dash_head',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 3;
                    sq.action = var1;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_h_head: {
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
                // {	// 드롭다운으로 변경
                // 	"type": "Angle",
                // 	"accept": "string"
                // },
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
                type: 'dash_h_head',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'Dash_head',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var var2 = script.getNumberField('VALUE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 3;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    if (var2 > 120) {
                        var2 = 120; // 각도 값이 120이 넘지 않도록 한다.
                    }
                    sq.paramA = var2;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_forward_head: {
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
                type: 'dash_forward_head',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Dash_head',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 3;
                    sq.action = 0x02;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_voice_head: {
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
                type: 'dash_voice_head',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Dash_head',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 3;
                    sq.action = 7;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            if (pd.soundDirection) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                                var timer = setTimeout(function() {
                                    Entry.Dash.state = DashState.STATE_DONE;
                                }, 500);
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        // 움직임
        dash_turn_drive: {
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
                type: 'dash_turn_drive',
            },
            paramsKeyMap: {
                ROTATION: 0,
                VALUE: 1,
            },
            class: 'Dash_drive',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('ROTATION', script);
                var var2 = script.getNumberValue('VALUE', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = var2;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_turn_drive_360: {
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
                type: 'dash_turn_drive_360',
            },
            paramsKeyMap: {
                ROTATION: 0,
            },
            class: 'Dash_drive',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('ROTATION', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 1;
                    sq.paramA = 360;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_drive: {
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
                type: 'dash_drive',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
                SPEED: 2,
            },
            class: 'Dash_drive',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('DIRECTION', script);
                var var2 = script.getNumberValue('DISTANCE', script);
                var var3 = script.getNumberField('SPEED', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 1;
                    sq.action = var1;
                    sq.param_cnt = 2;
                    if (var2 > 1638) {
                        var2 = 1638;
                    }
                    sq.paramA = var2;
                    sq.paramB = var3;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            if (pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            if (!pd.isDriving) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_wheel_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '왼쪽 바퀴 %1 (으)로 %2, 오른쪽 바퀴 %3 (으)로 %4 움직이기 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [['앞', 0x01], ['뒤', 0x02]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    type: 'Dropdown',
                    options: [['앞', 0x01], ['뒤', 0x02]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: ['1', '3', '1', '3'],
                type: 'dash_wheel_speed',
            },
            paramsKeyMap: {
                DIRECTION_L: 0,
                SPEED_L: 1,
                DIRECTION_R: 2,
                SPEED_R: 3,
            },
            class: 'Dash_drive',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var var1 = script.getNumberField('DIRECTION_L', script);
                var var2 = script.getNumberField('SPEED_L', script);
                var var3 = script.getNumberField('DIRECTION_R', script);
                var var4 = script.getNumberField('SPEED_R', script);
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 0x01;
                    sq.action = 0x05;
                    sq.param_cnt = 0x04;
                    sq.paramA = var1;
                    sq.paramB = var2;
                    sq.paramC = var3;
                    sq.paramD = var4;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_drive_stop: {
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
                type: 'dash_drive_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Dash_drive',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                if (!Entry.Dash.isStarted) {
                    sq.category = 0x01;
                    sq.action = 0x06;
                    sq.param_cnt = 0;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            var timer = setTimeout(function() {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }, 500);
                            Entry.Dash.state = DashState.STATE_WAIT;
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
        dash_sensor1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가운데 버튼', 0x05],
                        ['1번 버튼', 0x06],
                        ['2번 버튼', 0x07],
                        ['3번 버튼', 0x08],
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
                type: 'dash_sensor1',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            isNotFor: ['Dash'],
            class: 'Dash_senor',
            func: function(sprite, script) {
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
        dash_sensor2: {
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
                type: 'dash_sensor2',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            isNotFor: ['Dash'],
            class: 'Dash_senor',
            func: function(sprite, script) {
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
        dash_animation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: '애니메이션 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['안녕', 0x00],
                        ['안녕하세요', 0x01],
                        ['걱정 마 (오른쪽)', 0x02],
                        ['걱정 마 (왼쪽)', 0x07],
                        ['잘가 #1', 0x03],
                        ['잘가 #2', 0x04],
                        ['자신감 있는', 0x05],
                        ['그래그래', 0x06],
                        ['아무도 없나요', 0x08],
                        ['그윽', 0x09],
                        ['하품', 0x0a],
                        ['드르렁', 0x0b],
                        ['휘파람', 0x0c],
                        ['어지러워', 0x0d],
                        ['출발', 0x0e],
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
                params: [0],
                type: 'dash_animation',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Dash_animation',
            isNotFor: ['Dash'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var var1 = script.getNumberField('PORT', script);
                if (!Entry.Dash.isStarted) {
                    sq.category = 0x06;
                    sq.action = 0x01;
                    sq.param_cnt = 1;
                    sq.paramA = var1;
                    sq.modeA = 3;
                    sq.seq = Entry.Dash.sequance++;
                    Entry.Dash.isStarted = true;
                    Entry.Dash.state = DashState.STATE_READY;
                    return script;
                } else {
                    switch (Entry.Dash.state) {
                        case DashState.STATE_READY:
                            if (pd.animation) {
                                Entry.Dash.state = DashState.STATE_WAIT;
                            }
                            return script;
                            break;
                        case DashState.STATE_WAIT:
                            if (!pd.animation) {
                                Entry.Dash.state = DashState.STATE_DONE;
                            }
                            return script;
                            break;
                        case DashState.STATE_DONE:
                            // 다음 블럭 진행
                            Entry.Dash.isStarted = false;
                            return script.callReturn();
                            break;
                    }
                }
                return script;
            },
        },
    };
};

module.exports = Entry.Dash;
