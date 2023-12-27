'use strict';

function format_str() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp('\\{' + i + '\\}', 'gm');
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function random_str(count) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Entry.AsomeKit = {
    id: '32.2',
    name: 'AsomeKit',
    url: 'http://www.asomeit.com/',
    imageName: 'AsomeKit.png',
    title: {
        ko: 'AsomeKit',
        en: 'AsomeKit',
    },
    setZero: function() {
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
        Entry.hw.update();
    },
    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },
    asyncFlowControl: function({ script, data }, scope) {
        if (!this.isExecBlock && !scope.isStart) {
            const blockId = this.getHashKey();
            this.isExecBlock = true;
            scope.isStart = true;
            scope.timeFlag = 1;
            this.nowBlockId = blockId;
            this.blockIds[blockId] = false;
            _merge(Entry.hw.sendQueue, {
                [blockId]: data,
            });
            Entry.hw.update();
            setTimeout(() => {
                scope.timeFlag = 0;
            });
            return false;
        } else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
            delete this.blockIds[this.nowBlockId];
            delete scope.isStart;
            this.execTimeFlag = 0;
            this.execTimeFlag = undefined;
            this.isExecBlock = false;
            Entry.engine.isContinue = false;
            return true;
        }
        return false;
    },
    postCallReturn: function(args) {
        const { script } = args;
        if (!this.asyncFlowControl(args, script)) {
            return Entry.STATIC.BREAK;
        }
    },
};

Entry.AsomeKit.setLanguage = function() {
    return {
        ko: {
            template: {
                asomekit_turnoff_pin: '핀 초기화 %1',
                
                asomekit_led_ready: 'LED 준비하기 %1 %2 %3 %4 %5',
                asomekit_rgb_led_ready: 'RGB LED 준비하기 %1 %2 %3 %4',
                asomekit_button_ready: '버튼 준비하기 %1 %2',
                asomekit_music_ready: '음악 준비하기 %1 %2',
                asomekit_buzzer_ready: '부저 준비하기 %1 %2',
                asomekit_dht_ready: '온습도 센서 준비하기 %1 %2',
                asomekit_led_tube_ready: 'LED 튜브 준비하기 %1 %2 %3',
                asomekit_vibration_ready: '진동 센서 준비하기 %1 %2 %3',
                asomekit_ultrasound_ready: '초음파 센서 준비하기 %1 %2 %3',
                asomekit_brightness_ready: '조도 센서 준비하기 %1 %2',
                asomekit_sound_ready: '소리 센서 준비하기 %1 %2',
                
                asomekit_led: '%1 LED %2 %3',
                asomekit_rgb_brightness: '%1 밝기 설정 %2 %3',
                asomekit_led_tube: 'LED 튜브에 %1 표시 %2',
                asomekit_led_tube_time: 'LED 튜브에 시간표시 %1 %2 %3 %4',
                
                asomekit_ultrasound_measurement: '초음파 센서 거리측정 %1',
                asomekit_humidity_measurement: '습도 재기 %1',
                asomekit_temperature_measurement: '온도 재기 %1',
                asomekit_brightness_measurement: '밝기 재기 %1',
                asomekit_vibration_detection: '진동 센서 감지 %1',
                asomekit_button_read: '버튼 정보 읽기 %1',
                asomekit_sound_measurement: '소리 감지 %1',
                
                asomekit_ultrasound_measurement_value: '초음파 센서 측정 거리 값',
                asomekit_humidity_measurement_value: '습도',
                asomekit_temperature_measurement_value: '온도',
                asomekit_brightness_measurement_value: '밝기',
                asomekit_vibration_detection_value: '진동',
                asomekit_bt_value: '버튼',
                asomekit_sound_measurement_value: '소리',
                
                asomekit_buzzer_onoff: '부저 %1 %2',
                asomekit_buzzer_note: '음계로 소리내기 %1 %2 연주시간 %3초 %4',
                asomekit_buzzer_tone: '주파수로 소리내기 %1Hz 연주시간 %2초 %3',
                
                asomekit_input_num: '%1',
                asomekit_input_text: '"%1"',
                asomekit_variable: '변수 %1 = %2 %3',
                
                asomekit_internet_connect: '인터넷 접속하기 | 아이디%1 비밀번호%2 %3',
                asomekit_wifi_connect: '비밀번호 없는 와이파이 연결하기 | 아이디%1 %2',
                asomekit_port: '메시지 받을 준비 %1 포트 %2',
                asomekit_read_message: '메시지 읽어오기 %1',
                asomekit_send_message: '메시지 보내기 | 보낼 메시지 %1, 보낼 대상%2 %3',
                asomekit_weather: '날씨 데이터 가져오기 [%1 %2]%3'
            },
            Menus: {
                awesomekit: '어썸키트',
            },
        },
        en: {
            template: {
                asomekit_turnoff_pin: 'Turn off pins %1',
                
                asomekit_led_ready: 'Prepare LED %1 %2 %3 %4 %5',
                asomekit_rgb_led_ready: 'Prepare RGB %1 %2 %3 %4',
                asomekit_button_ready: 'Prepare button %1 %2',
                asomekit_music_ready: 'Prepare sound %1 %2',
                asomekit_buzzer_ready: 'Prepare buzzer %1 %2',
                asomekit_dht_ready: 'Prepare temperature and humidity sensor %1 %2',
                asomekit_led_tube_ready: 'Prepare LED tube %1 %2 %3',
                asomekit_vibration_ready: 'Prepare vibration sensor %1 %2 %3',
                asomekit_ultrasound_ready: 'Prepare ultrasonic sensor %1 %2 %3',
                asomekit_brightness_ready: 'Prepare light sensor %1 %2',
                asomekit_sound_ready: 'Prepare sound sensor %1 %2',
                
                asomekit_led: '%1 LED %2 %3',
                asomekit_rgb_brightness: 'Set brightness of %1 to %2 %3',
                asomekit_led_tube: 'Display %1 on LED tube %2',
                asomekit_led_tube_time: 'Display time %1 %2 %3 on LED tube %4',
                
                asomekit_ultrasound_measurement: 'Measure distance %1',
                asomekit_humidity_measurement: 'Measure humidity %1',
                asomekit_temperature_measurement: 'Measure temperature %1',
                asomekit_brightness_measurement: 'Check light sensor %1',
                asomekit_vibration_detection: 'Check vibration sensor %1',
                asomekit_button_read: 'Check button value %1',
                asomekit_sound_measurement: 'Check sound sensor %1',
                
                asomekit_ultrasound_measurement_value: 'distance',
                asomekit_humidity_measurement_value: 'humidity',
                asomekit_temperature_measurement_value: 'temperature',
                asomekit_brightness_measurement_value: 'brightness',
                asomekit_vibration_detection_value: 'vibration',
                asomekit_bt_value: 'button',
                asomekit_sound_measurement_value: 'sound',
                
                asomekit_buzzer_onoff: 'buzzer %1 %2',
                asomekit_buzzer_note: 'Play %1 %2 for %3 seconds %4',
                asomekit_buzzer_tone: 'Make sound of %1 for %2 seconds %3',

                asomekit_input_num: '%1',
                asomekit_input_text: '"%1"',
                asomekit_variable: 'Variable %1 = %2 %3',
                
                asomekit_internet_connect: 'internet connect | ID%1PW%2 %3',
                asomekit_wifi_connect: 'Connecting to Wi-Fi without a password | ID%2 %3',
                asomekit_port: 'Get Ready to Receive Messages %1 port%2',
                asomekit_read_message: 'Read Message %1',
                asomekit_send_message: 'Send Message | Message %1, recipient%2 %3',
                asomekit_weather: 'Get weater date[%1 %2]%3'
            },
            Menus: {
                awesomekit: 'AsomeKit',
            },
        },
    };
};

Entry.AsomeKit.blockMenuBlocks = [
    'asomekit_turnoff_pin',
    
    'asomekit_led_ready',
    'asomekit_rgb_led_ready',
    'asomekit_button_ready',
    'asomekit_music_ready',
    'asomekit_buzzer_ready',
    'asomekit_dht_ready',
    'asomekit_led_tube_ready',
    'asomekit_vibration_ready',
    'asomekit_ultrasound_ready',
    'asomekit_brightness_ready',
    'asomekit_sound_ready',
    
    'asomekit_led',
    'asomekit_rgb_brightness',
    'asomekit_led_tube',
    'asomekit_led_tube_time',
    
    'asomekit_ultrasound_measurement',
    'asomekit_humidity_measurement',
    'asomekit_temperature_measurement',
    'asomekit_brightness_measurement',
    'asomekit_vibration_detection',
    'asomekit_button_read',
    'asomekit_sound_measurement',
    
    'asomekit_ultrasound_measurement_value',
    'asomekit_humidity_measurement_value',
    'asomekit_temperature_measurement_value',
    'asomekit_brightness_measurement_value',
    'asomekit_vibration_detection_value',
    'asomekit_bt_value',
    'asomekit_sound_measurement_value',
    
    'asomekit_buzzer_onoff',
    'asomekit_buzzer_note',
    'asomekit_buzzer_tone',
    
    'asomekit_input_num',
    'asomekit_input_text',
    'asomekit_variable',
    
    'asomekit_internet_connect',
    'asomekit_wifi_connect',
    'asomekit_port',
    'asomekit_read_message',
    'asomekit_send_message',
    'asomekit_weather',
];

Entry.AsomeKit.getBlocks = function() {
    return {
        asomekit_turnoff_pin: {
            template: Lang.template.asomekit_turnoff_pin,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_turnoff_pin',
            },
            class: 'PIN',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = 'turnoff_pins()';
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_led_ready: {
            template: Lang.template.asomekit_led_ready,
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
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['13'],
                    },
                    {
                        type: 'text',
                        params: ['14'],
                    },
                    {
                        type: 'text',
                        params: ['15'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'asomekit_led_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = script.getValue('VALUE3');
                var value4 = script.getValue('VALUE4');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('red = OutputPin({0}); yellow = OutputPin({1}); green = OutputPin({2}); bright = OutputPin({3});', value1, value2, value3, value4);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_rgb_led_ready: {
            template: Lang.template.asomekit_rgb_led_ready,
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
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['17'],
                    },
                    {
                        type: 'text',
                        params: ['18'],
                    },
                    {
                        type: 'text',
                        params: ['19'],
                    },
                    null,
                ],
                type: 'asomekit_rgb_led_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = script.getValue('VALUE3');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('r = ServoPin({0}); g = ServoPin({1}); b = ServoPin({2});', value1, value2, value3);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_button_ready: {
            template: Lang.template.asomekit_button_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                ],
                type: 'asomekit_button_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import button; bt = button.create({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_music_ready: {
            template: Lang.template.asomekit_music_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['12'],
                    },
                    null,
                ],
                type: 'asomekit_music_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import music; music.open({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_buzzer_ready: {
            template: Lang.template.asomekit_buzzer_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['11'],
                    },
                    null,
                ],
                type: 'asomekit_buzzer_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('buzzer = OutputPin({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_dht_ready: {
            template: Lang.template.asomekit_dht_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['5'],
                    },
                    null,
                ],
                type: 'asomekit_dht_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import dht11; ht = dht11.create({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_led_tube_ready: {
            template: Lang.template.asomekit_led_tube_ready,
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
                    defaultType: 'number',
                    
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['3'],
                    },
                    {
                        type: 'text',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'asomekit_led_tube_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import tm1637; tm1637.open({0},{1});', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_vibration_ready: {
            template: Lang.template.asomekit_vibration_ready,
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
                    defaultType: 'number',
                    
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'asomekit_vibration_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import vibration_sensor; vs = vibration_sensor.create({0}, {1});', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_ultrasound_ready: {
            template: Lang.template.asomekit_ultrasound_ready,
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
                    defaultType: 'number',
                    
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['7'],
                    },
                    {
                        type: 'text',
                        params: ['8'],
                    },
                    null,
                ],
                type: 'asomekit_ultrasound_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import hcsr04; hcsr04.open({0}, {1});', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_brightness_ready: {
            template: Lang.template.asomekit_brightness_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'asomekit_brightness_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('brightness=AnalogPin({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_sound_ready: {
            template: Lang.template.asomekit_sound_ready,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'asomekit_sound_ready',
            },
            class: 'READY',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('sound_sensor = AnalogPin({0});', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        
        // LED
        asomekit_led: {
            template: Lang.template.asomekit_led,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ "Red", "red" ],
                        [ "Yellow", "yellow" ],
                        [ "Green", "green" ],
                        [ "Bright", "bright"],
                    ],
                    value: 'red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    
                },
                {
                    type: 'Dropdown',
                    options: [
                        [ "On", "on" ],
                        [ "Off", "off" ]
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
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    null, null, null
                ],
                type: 'asomekit_led',
            },
            class: 'LED',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getStringValue('VALUE2');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('{0}.{1}()', value1,value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_rgb_brightness: {
            template: Lang.template.asomekit_rgb_brightness,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ "Red", "r" ],
                        [ "Green", "g" ],
                        [ "Blue", "b" ],
                    ],
                    value: 'r',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'asomekit_rgb_brightness',
            },
            class: 'LED',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('{0}.duty({1})', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_led_tube: {
            template: Lang.template.asomekit_led_tube,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'asomekit_led_tube',
            },
            class: 'LED',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('tm1637.number({0})', String(value1));
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_led_tube_time: {
            template: Lang.template.asomekit_led_tube_time,
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
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [ "True", "True" ],
                        [ "False", "False" ],
                    ],
                    value: 'True',
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
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['h'],
                    },
                    {
                        type: 'text',
                        params: ['m'],
                    },
                    null,
                ],
                type: 'asomekit_led_tube_time',
            },
            class: 'LED',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');
                var value3 = script.getStringValue('VALUE3');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("tm1637.time({0},{1},{2})", value1, value2, value3);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_ultrasound_measurement: {
            template: Lang.template.asomekit_ultrasound_measurement,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_ultrasound_measurement',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "cm = hcsr04.get_distance(); print('#' + 'CM ' + str(cm) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_humidity_measurement: {
            template: Lang.template.asomekit_humidity_measurement,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_humidity_measurement',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "ht.measure(); humidity = ht.humidity(); print('#' + 'HD ' + str(humidity) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_temperature_measurement: {
            template: Lang.template.asomekit_temperature_measurement,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_temperature_measurement',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "ht.measure(); temperature = ht.temperature(); print('#' + 'TP ' + str(temperature) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_brightness_measurement: {
            template: Lang.template.asomekit_brightness_measurement,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_brightness_measurement',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "light = brightness.read(); print('#' + 'BN ' + str(light) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_button_read: {
            template: Lang.template.asomekit_button_read,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_button_read',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "bt_value = bt.value(); print('#' + 'BT ' + str(bt_value) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_vibration_detection: {
            template: Lang.template.asomekit_vibration_detection,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_vibration_detection',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "vibration = vs.is_active(); print('#' + 'VT ' + str(vibration) + '  ###')";
                    console.log(pd.vibration);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_sound_measurement: {
            template: Lang.template.asomekit_sound_measurement,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                type: 'asomekit_sound_measurement',
            },
            class: 'Measurment',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = "sound = sound_sensor.read(); print('#' + 'SO ' + str(sound) + '  ###')";
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_temperature_measurement_value: {
            template: Lang.template.asomekit_temperature_measurement_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_temperature_measurement_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.temperature;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'temperature',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_brightness_measurement_value: {
            template: Lang.template.asomekit_brightness_measurement_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_brightness_measurement_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.light;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'light',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_ultrasound_measurement_value: {
            template: Lang.template.asomekit_ultrasound_measurement_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_ultrasound_measurement_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.cm;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cm',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_humidity_measurement_value: {
            template: Lang.template.asomekit_humidity_measurement_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_humidity_measurement_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.humidity;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'humidity',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_vibration_detection_value: {
            template: Lang.template.asomekit_vibration_detection_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_vibration_detection_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                console.log(pd.vibration);
                return pd.vibration;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'vibration',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_bt_value: {
            template: Lang.template.asomekit_bt_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_bt_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.bt_value;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'bt_value',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_sound_measurement_value: {
            template: Lang.template.asomekit_sound_measurement_value,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'asomekit_sound_measurement_value',
            },
            class: 'Value',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;

                return pd.sound;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'sound',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_buzzer_onoff: {
            template: Lang.template.asomekit_buzzer_onoff,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ "On", "on" ],
                        [ "Off", "off" ],
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
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    null,null
                ],
                type: 'asomekit_buzzer_onoff',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                    
                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('buzzer.{0}()', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_buzzer_note: {
            template: Lang.template.asomekit_buzzer_note,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [ "C", "C" ],
                        [ "C#", "C#" ],
                        [ "D", "D" ],
                        [ "D#", "D#" ],
                        [ "Db", "Db" ],
                        [ "E", "E" ],
                        [ "Eb", "Eb" ],
                        [ "F", "F" ],
                        [ "F#", "F#" ],
                        [ "G", "G" ],
                        [ "G#", "G#" ],
                        [ "Gb", "Gb" ],
                        [ "A", "A" ],
                        [ "A#", "A#" ],
                        [ "Ab", "Ab" ],
                        [ "B", "B" ],
                        [ "Bb", "Bb" ],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [ "1", "1" ],
                        [ "2", "2" ],
                        [ "3", "3" ],
                        [ "4", "4" ],
                        [ "5", "5" ],
                    ],
                    value: '1',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'asomekit_buzzer_note',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getStringValue('VALUE1');
                var value2 = script.getStringValue('VALUE2');
                var value3 = parseInt(parseFloat(script.getValue('VALUE3')) * 1000);

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str("music.note('{0}{1}', {2})", value1, value2, String(value3));
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_buzzer_tone: {
            template: Lang.template.asomekit_buzzer_tone,
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
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'asomekit_buzzer_tone',
            },
            class: 'Buzzer',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                var value1 = script.getValue('VALUE1');
                var value2 = parseInt(parseFloat(script.getValue('VALUE2')) * 1000);

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('music.tone({0}, {1})', value1, String(value2));
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_input_num: {
            template: Lang.template.asomekit_input_num,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'asomekit_input_num',
            },
            class: 'Advance',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var value1 = script.getValue('VALUE1');
                
                return '{0}', value1;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'sound',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_input_text: {
            template: Lang.template.asomekit_input_text,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'asomekit_input_text',
            },
            class: 'Advance',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var value1 = script.getValue('VALUE1');
                
                return '"{0}"', value1;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'sound',
                        blockType: 'param',
                    }
                ]
            }
        },
        asomekit_variable: {
            template: Lang.template.asomekit_variable,
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
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['i'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'asomekit_variable',
            },
            class: 'Advance',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = '{0}={1}';
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_internet_connect: {
            template: Lang.template.asomekit_internet_connect,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [''],
                    },
                    {
                        type: 'text',
                        params: [''],
                    },
                ],
                type: 'asomekit_internet_connect',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import internet; internet.connect("{0}","{1}")', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_wifi_connect: {
            template: Lang.template.asomekit_wifi_connect,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [''],
                    },
                ],
                type: 'asomekit_wifi_connect',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import internet; internet.open_ap("{0}")', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_port: {
            template: Lang.template.asomekit_port,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1234'],
                    },
                ],
                type: 'asomekit_port',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import udp_socket; udp_socket.open({0})', value1);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_read_message: {
            template: Lang.template.asomekit_read_message,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'asomekit_read_message',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = 'msg = udp_socket.read_text()';
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_send_message: {
            template: Lang.template.asomekit_send_message,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
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
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [''],
                    },
                    {
                        type: 'text',
                        params: [''],
                    },
                ],
                type: 'asomekit_send_message',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import http_utils; http_utils.send_msg("{1}","{0}")', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
        asomekit_weather: {
            template: Lang.template.asomekit_weather,
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'text',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [''],
                    },
                    {
                        type: 'text',
                        params: [''],
                    },
                ],
                type: 'asomekit_weather',
            },
            class: 'Internet',
            isNotFor: ['AsomeKit'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                
                var value1 = script.getValue('VALUE1');
                var value2 = script.getValue('VALUE2');

                if (!script.is_started) {
                    script.is_started = true;
                    script.msg_id = random_str(16);
                    sq.msg_id = script.msg_id;
                    sq.msg = format_str('import internet; weather_data = internet.get_weather("{0}}","{1}"); weather = weather_data[0]; temp = weather_data[1]; humidity = weather_data[2]', value1, value2);
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    return script.callReturn();
                }

                return script;
            },
            syntax: undefined,
        },
    };
};

module.exports = Entry.AsomeKit;
