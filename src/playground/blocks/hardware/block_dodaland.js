'use strict';

Entry.Dodaland = {
    id: '4F.1',
    name: 'dodaland',
    url: 'http://www.dodaland.com/',
    imageName: 'dodaland.png',
    title: {
        ko: '도다랜드',
        en: 'Dodaland',
    },
    setZero: () => {
        Entry.hw.sendQueue[
            'command'
        ] = `{"doda-control":{"def-normal-inst":2,"led-app-control":false,"fix-volume":false,"fix-tempo":false}}`;
        Entry.hw.update();
    },
};

Entry.Dodaland.setLanguage = function() {
    return {
        ko: {
            template: {
                dodaland_start_button_pressed: '재생 버튼이 눌렸을 때',
                dodaland_play_note_with_length: '계이름 %1 를 %2 길이만큼 연주',
                dodaland_onoff_channel_led: '채널 %1 번의 LED %2',
                dodaland_onoff_location_led: '좌표 %1, %2 위치의 채널 LED %3',
                dodaland_select_instrument: '%1 악기 사용하기',
                dodaland_press_start_button: '재생 버튼 누르기',
                dodaland_press_stop_button: '정지 버튼 누르기',
                dodaland_play_channel: '채널 %1 번 연주하기',
                dodaland_play_location: '좌표 %1, %2 위치의 채널 연주하기',
                dodaland_control_led: 'LED 제어 모드 %1',
                dodaland_control_volume: '볼륨 제어 모드 %1',
                dodaland_control_tempo: '템포 제어 모드 %1',
                dodaland_set_volume: '볼륨값 %1 으로 설정하기',
                dodaland_set_tempo: '템포값 %1 으로 설정하기',
            },
        },
        en: {
            template: {
                dodaland_start_button_pressed: '재생 버튼이 눌렸을 때',
                dodaland_play_note_with_length: '계이름 %1 를 %2 길이만큼 연주',
                dodaland_onoff_channel_led: '채널 %1 번의 LED %2',
                dodaland_onoff_location_led: '좌표 %1, %2 위치의 채널 LED %3',
                dodaland_select_instrument: '%1 악기 사용하기',
                dodaland_press_start_button: '재생 버튼 누르기',
                dodaland_press_stop_button: '정지 버튼 누르기',
                dodaland_play_channel: '채널 %1 번 연주하기',
                dodaland_play_location: '좌표 %1, %2 위치의 채널 연주하기',
                dodaland_control_led: 'LED 제어 모드 %1',
                dodaland_control_volume: '볼륨 제어 모드 %1',
                dodaland_control_tempo: '템포 제어 모드 %1',
                dodaland_set_volume: '볼륨값 %1 으로 설정하기',
                dodaland_set_tempo: '템포값 %1 으로 설정하기',
            },
        },
    };
};

Entry.Dodaland.blockMenuBlocks = [
    'dodaland_press_start_button',
    'dodaland_press_stop_button',
    'dodaland_onoff_channel_led',
    'dodaland_onoff_location_led',
    'dodaland_select_instrument',
    'dodaland_play_channel',
    'dodaland_play_location',
    'dodaland_control_led',
    'dodaland_control_volume',
    'dodaland_control_tempo',
    'dodaland_set_volume',
    'dodaland_set_tempo',
];

Entry.Dodaland.getBlocks = function() {
    return {
        dodaland_start_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_play.svg',
                    size: 12,
                },
            ],
            def: {
                type: 'dodaland_start_button_pressed',
            },
            class: 'buttons',
            func: (sprite, script) => {},
        },
        dodaland_play_note_with_length: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['도', '도'],
                        ['레', '레'],
                        ['미', '미'],
                        ['파', '파'],
                        ['솔', '솔'],
                        ['라', '라'],
                        ['시', '시'],
                        ['도', '도'],
                    ],
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['온음표', '온음표'],
                        ['2분음표', '2분음표'],
                        ['4분음표', '4분음표'],
                        ['8분음표', '8분음표'],
                        ['16분음표', '16분음표'],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: ['도', '4분음표'],
                type: 'dodaland_play_note_with_length',
            },
            paramsKeyMap: {
                PITCH_NAME: 0,
                NOTE_NAME: 1,
            },
            class: 'blocks',
            func: (sprite, script) => {
                const pitchName = script.getValue('PITCH_NAME', script);
                const noteName = script.getValue('NOTE_NAME', script);
                console.log(pitchName, noteName);
            },
        },
        dodaland_press_start_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_play.svg',
                    size: 12,
                },
            ],
            def: {
                type: 'dodaland_press_start_button',
            },
            class: 'buttons',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                Entry.hw.sendQueue['command'] = '{"doda-button":{"play":true}}';
                Entry.hw.update();
            },
        },
        dodaland_press_stop_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_play.svg',
                    size: 12,
                },
            ],
            def: {
                type: 'dodaland_press_stop_button',
            },
            class: 'buttons',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                Entry.hw.sendQueue['command'] = '{"doda-button":{"stop":true}}';
                Entry.hw.update();
            },
        },
        dodaland_onoff_channel_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                        [13, 12],
                        [14, 13],
                        [15, 14],
                        [16, 15],
                        [17, 16],
                        [18, 17],
                        [19, 18],
                        [20, 19],
                        [21, 20],
                        [22, 21],
                        [23, 22],
                        [24, 23],
                        [25, 24],
                        [26, 25],
                        [27, 26],
                        [28, 27],
                        [29, 28],
                        [30, 29],
                        [31, 30],
                        [32, 31],
                        [33, 32],
                        [34, 33],
                        [35, 34],
                        [36, 35],
                        [37, 36],
                        [38, 37],
                        [39, 38],
                        [40, 39],
                    ],
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0],
                        ['켜기', 1],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: ['0', '1'],
                type: 'dodaland_onoff_channel_led',
            },
            paramsKeyMap: {
                CHANNEL_NUMBER: 0,
                ONOFF: 1,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const channelNumber = script.getValue('CHANNEL_NUMBER', script);
                const onOrOff = script.getValue('ONOFF', script);
                console.log(channelNumber, onOrOff);
                Entry.hw.sendQueue['command'] = `{"doda-led":{"${
                    onOrOff ? 'ledon' : 'ledoff'
                }":[${channelNumber}]}}`;
                Entry.hw.update();
            },
        },
        dodaland_onoff_location_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0],
                        ['켜기', 1],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    1,
                ],
                type: 'dodaland_onoff_location_led',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                ON_OR_OFF: 2,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const xLocation = script.getNumberValue('X', script);
                const yLocation = script.getNumberValue('Y', script);
                const onOrOff = script.getValue('ON_OR_OFF', script);
                console.log(xLocation, yLocation, onOrOff);
                if (xLocation > 10 || yLocation > 4) {
                    // do nothing
                } else {
                    const channelNumber = (yLocation - 1) * 10 + (xLocation - 1);
                    console.log(xLocation, yLocation, onOrOff, channelNumber);
                    Entry.hw.sendQueue['command'] = `{"doda-led":{"${
                        onOrOff ? 'ledon' : 'ledoff'
                    }":[${channelNumber}]}}`;
                    Entry.hw.update();
                }
            },
        },
        dodaland_select_instrument: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['피아노', '2'],
                        ['전자피아노', '6'],
                        ['글로켄슈필', '10'],
                        ['오르골', '11'],
                        ['종', '15'],
                        ['오르간', '20'],
                        ['어쿠스틱 기타', '25'],
                        ['전자기타', '31'],
                        ['베이스', '34'],
                        ['바이올린', '41'],
                        ['비올라', '42'],
                        ['첼로', '43'],
                        ['더블 베이스', '44'],
                        ['하프', '47'],
                        ['목소리', '53'],
                        ['트럼펫', '58'],
                        ['튜바', '62'],
                        ['색소폰', '65'],
                        ['오보에', '69'],
                        ['호른', '70'],
                        ['클라리넷', '72'],
                        ['플루트', '74'],
                        ['팬플루트', '76'],
                        ['오카리나', '80'],
                        ['단소', '83'],
                        ['비', '97'],
                        ['보석', '99'],
                        ['밴조', '106'],
                        ['칼림바', '109'],
                        ['핸드벨', '113'],
                        ['우드블럭', '116'],
                        ['오리', '121'],
                        ['파도', '123'],
                        ['전화벨', '125'],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: ['2'],
                type: 'dodaland_select_instrument',
            },
            paramsKeyMap: {
                INSTRUMENT_NAME: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const instrumentName = script.getValue('INSTRUMENT_NAME', script);
                console.log(instrumentName);
                Entry.hw.sendQueue[
                    'command'
                ] = `{"doda-control":{"def-normal-inst":${instrumentName}}}`;
                Entry.hw.update();
            },
        },
        dodaland_play_channel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                        [13, 12],
                        [14, 13],
                        [15, 14],
                        [16, 15],
                        [17, 16],
                        [18, 17],
                        [19, 18],
                        [20, 19],
                        [21, 20],
                        [22, 21],
                        [23, 22],
                        [24, 23],
                        [25, 24],
                        [26, 25],
                        [27, 26],
                        [28, 27],
                        [29, 28],
                        [30, 29],
                        [31, 30],
                        [32, 31],
                        [33, 32],
                        [34, 33],
                        [35, 34],
                        [36, 35],
                        [37, 36],
                        [38, 37],
                        [39, 38],
                        [40, 39],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: ['0'],
                type: 'dodaland_play_channel',
            },
            paramsKeyMap: {
                CHANNEL_NUMBER: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const channelNumber = script.getValue('CHANNEL_NUMBER', script);
                console.log(channelNumber);
                Entry.hw.sendQueue[
                    'command'
                ] = `{"doda-entry":{"single-channel-play": ${channelNumber}}}`;
                Entry.hw.update();
            },
        },
        dodaland_play_location: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    1,
                ],
                type: 'dodaland_play_location',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const xLocation = script.getNumberValue('X', script);
                const yLocation = script.getNumberValue('Y', script);
                if (xLocation > 10 || yLocation > 4) {
                    // do nothing
                } else {
                    const channelNumber = (yLocation - 1) * 10 + (xLocation - 1);
                    console.log(xLocation, yLocation, channelNumber);
                    Entry.hw.sendQueue[
                        'command'
                    ] = `{"doda-entry":{"single-channel-play": ${channelNumber}}}`;
                    Entry.hw.update();
                }
            },
        },
        dodaland_control_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0],
                        ['켜기', 1],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: [1],
                type: 'dodaland_control_led',
            },
            paramsKeyMap: {
                ENABLE: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const controlEnable = script.getValue('ENABLE', script);
                console.log(controlEnable);
                Entry.hw.sendQueue['command'] = `{"doda-control":{"led-app-control":${
                    controlEnable ? true : false
                }}}`;
                Entry.hw.update();
            },
        },
        dodaland_control_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0],
                        ['켜기', 1],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: [1],
                type: 'dodaland_control_volume',
            },
            paramsKeyMap: {
                ENABLE: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const controlEnable = script.getValue('ENABLE', script);
                console.log(controlEnable);
                Entry.hw.sendQueue['command'] = `{"doda-control":{"fix-volume":${
                    controlEnable ? true : false
                }}}`;
                Entry.hw.update();
            },
        },
        dodaland_control_tempo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['끄기', 0],
                        ['켜기', 1],
                    ],
                    fontSize: 11,
                },
            ],
            def: {
                params: [1],
                type: 'dodaland_control_tempo',
            },
            paramsKeyMap: {
                ENABLE: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                const controlEnable = script.getValue('ENABLE', script);
                console.log(controlEnable);
                Entry.hw.sendQueue['command'] = `{"doda-control":{"fix-tempo":${
                    controlEnable ? true : false
                }}}`;
                Entry.hw.update();
            },
        },
        dodaland_set_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'dodaland_set_volume',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                let controlValue = script.getNumberValue('VALUE', script);
                if (controlValue > 100) {
                    controlValue = 100;
                }
                console.log(controlValue);
                Entry.hw.sendQueue['command'] = `{"doda-control":{"set-volume":${controlValue}}}`;
                Entry.hw.update();
            },
        },
        dodaland_set_tempo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'dodaland_set_tempo',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'blocks',
            isNotFor: ['dodaland'],
            func: (sprite, script) => {
                let controlValue = script.getNumberValue('VALUE', script);
                if (controlValue > 100) {
                    controlValue = 100;
                }
                console.log(controlValue);
                Entry.hw.sendQueue['command'] = `{"doda-control":{"set-tempo":${controlValue}}}`;
                Entry.hw.update();
            },
        },
    };
};

module.exports = Entry.Dodaland;
