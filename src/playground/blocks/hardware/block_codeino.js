'use strict';

Entry.CODEino = {
    id: '1.3',
    name: 'CODEino',
    url: 'http://www.kcsi.co.kr/ko/bbs/content.php?co_id=CODEino1',
    imageName: 'codeino.png',
    title: {
        ko: '코드이노',
        en: 'CODEino',
    },
    getSensorKey: function() {
        return 'xxxxxxxx'
            .replace(/[xy]/g, function(f) {
                var e = (Math.random() * 16) | 0,
                    d = f == 'x' ? e : (e & (0 * 3)) | (0 * 8);
                return d.toString(16);
            })
            .toUpperCase();
    },
    getSensorTime: function(type) {
        return new Date().getTime() + type;
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            let isFirst = true;
            keySet.forEach(function(key) {
                if(Entry.hw.sendQueue.SET[key].type===Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL){
                    Entry.hw.sendQueue.SET[key].data = {
                        rValue:0,
                        gValue:0,
                        bValue:0,
                        brightness:22,
                    }
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } else if(Entry.hw.sendQueue.SET[key].type===Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER) {
                    Entry.CODEino.CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE=22;
                    Entry.hw.sendQueue.SET[key].data= {
                            isOn:0,
                            brightness:Entry.CODEino.CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE,
                    }
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } 
                else if(Entry.hw.sendQueue.SET[key].type===Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_LED_HANDLE) {
                    delete Entry.hw.sendQueue.SET[key];
                }else if((Entry.hw.sendQueue.SET[key].type===Entry.CODEino.sensorTypes.RGBLED_PIN) ||
                (Entry.hw.sendQueue.SET[key].type===Entry.CODEino.sensorTypes.ULTRASONIC)) {
                    if(isFirst) {
                        Entry.CODEino.LED_VALUES = [0,0,0];
                        Entry.hw.sendQueue.SET[key].type=Entry.CODEino.sensorTypes.RESET;
                        Entry.hw.sendQueue.SET[key].data = {
                            r:Entry.CODEino.LED_VALUES[0],
                            g:Entry.CODEino.LED_VALUES[1],
                            b:Entry.CODEino.LED_VALUES[2]
                        };
                        Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                        isFirst = false;
                    } else {
                        delete Entry.hw.sendQueue.SET[key];
                    }
                } 
                else {
                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
        }
        Entry.CODEino.LAST_ORDER_PORT=0;
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/codeino.png',
        width: 431,
        height: 354,
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' 2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: Lang.Hw.port_en + ' 3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: Lang.Hw.port_en + ' 4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: Lang.Hw.port_en + ' 5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: Lang.Hw.port_en + ' 6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: Lang.Hw.port_en + ' 7 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: Lang.Hw.port_en + ' 8 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: Lang.Hw.port_en + ' 9 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' 10 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: Lang.Hw.port_en + ' 11 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: Lang.Hw.port_en + ' 12 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: Lang.Hw.port_en + ' 13 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: Lang.Hw.port_en + ' A0 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: Lang.Hw.port_en + ' A1 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: Lang.Hw.port_en + ' A2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: Lang.Hw.port_en + ' A3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: Lang.Hw.port_en + ' A4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: Lang.Hw.port_en + ' A5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a6: {
                name: Lang.Hw.port_en + ' A6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        RGBLED_PIN: 4,
        ULTRASONIC: 7,
        TIMER: 8,
        
        SERVO_PIN: 10,
        DEFAULT_NEOPIXEL: 11,
        CUSTOM_NEOPIXEL_POWER:12,
        CUSTOM_NEOPIXEL_LED_HANDLE:13,

        DEFAULT_BUZZER: 5,
        CUSTOM_BUZZER: 6,
        RESET:0xFF
    },
    BlockState: {},
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    customNeoPixelPin:50,
    customNeoPixelBrightness: 0,
    LED_VALUES:[0,0,0],
    LED_RED_VALUE: 0,
    LED_GREEN_VALUE: 0,
    LED_BLUE_VALUE: 0,

    DEFAULT_NEOPIXEL_RED_VALUE: 0,
    DEFAULT_NEOPIXEL_GREEN_VALUE: 0,
    DEFAULT_NEOPIXEL_BLUE_VALUE: 0,
    DEFAULT_NEOPIXEL_BRIGHTNESS_VALUE: 22,

    CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE: 22,

    LAST_ORDER_PORT:0,
};

Entry.CODEino.setLanguage = function () {
    return {
        ko: {
            template: {
                CODEino_default_neopixel_on: "기본 네오픽셀을 %1(으)로 켜기 %2",
                CODEino_default_neopixel_setBrightness: "기본 네오픽셀의 밝기를 %1(으)로 설정%2",
                CODEino_default_neopixel_off: "기본 네오픽셀을 끄기 %1",
                CODEino_default_buzzer: '기본 부저를 %1옥타브 %2음으로 %3초 연주하기%4',
                CODEino_custom_buzzer: '%1번핀 부저를 %2옥타브 %3음으로 %4초 연주하기%5',

                CODEino_custom_neopixel_on: "네오픽셀을 %1번 핀에 등록%2",
                CODEino_custom_neopixel_setBrightness: "네오픽셀의 밝기를 %1(으)로 설정%2",
                CODEino_custom_neopixel_off: "네오픽셀을 모두 끄기 %1",

                CODEino_custom_neopixel_set_led_color: "네오픽셀 %1번째 LED를 %2로 설정%3",
                CODEino_custom_neopixel_set_led_off: "네오픽셀 %1번째 LED를 끄기%2",
                
                CODEino_set_servo:"%1번 핀의 서보모터를 %2의 각도로 정하기%3",
                CODEino_get_ultrasonic:"초음파센서(Trig:%1, Echo:%2)의 값",
               
            }
        },
        en: {
            template: {
                CODEino_default_neopixel_on: "Default Neopixel ON %1 %2",
                CODEino_default_neopixel_setBrightness: "Set Default Neopixel-brightness %1 %2",
                CODEino_default_neopixel_off: "Default Neopixel OFF %1",
                CODEino_default_buzzer: 'Play the default buzzer in a %1 octave %2 notes for %3 seconds %4',
                CODEino_custom_buzzer: 'Play the buzzer on %1pin in a %2 octave %3 notes for %4 seconds %5',

                CODEino_custom_neopixel_on: "Set Neopixel on %1pin%2",
                CODEino_custom_neopixel_setBrightness: "Set Neopixel-brightness %1 %2",
                CODEino_custom_neopixel_off: "Set Neopixel OFF %1",

                CODEino_custom_neopixel_set_led_color: "Set Neopixel %1LED to %2 %3",
                CODEino_custom_neopixel_set_led_off: "Set Neopixel %1LED OFF %2",

                CODEino_set_servo:"Set servo in %1 to degree %2 %3",
                CODEino_get_ultrasonic:"Get value of Ultrasonic(Trig:%1, Echo:%2)",
            }
        }
    }
};
Entry.CODEino.blockMenuBlocks = [
    'CODEino_get_sensor_number',
    'CODEino_get_named_sensor_value',
    'CODEino_get_sound_status',
    'CODEino_get_light_status',
    'CODEino_is_button_pressed',
    'CODEino_get_accelerometer_direction',
    'CODEino_get_accelerometer_value',

    //digital
    'CODEino_get_digital_value',
    'CODEino_set_digital_value',
    'CODEino_set_pwm_value',

    //analog
    'CODEino_get_analog_value',
    'CODEino_convert_scale',

    // 200528 기본블록 : 기본네오픽셀, 기본패시브부저
    'CODEino_default_neopixel_on',
    'CODEino_default_neopixel_setBrightness',
    'CODEino_default_neopixel_off',
    'CODEino_default_buzzer',
    'CODEino_custom_buzzer',

    'CODEino_led_by_value',
    'CODEino_set_rgb_off',
    'CODEino_set__led_by_rgb',
    'CODEino_rgb_set_color',
    'CODEino_set_rgb_value',
    'CODEino_set_rgb_add_value',

    'CODEino_custom_neopixel_on',
    'CODEino_custom_neopixel_off',
    'CODEino_custom_neopixel_setBrightness',

    'CODEino_custom_neopixel_set_led_color',
    'CODEino_custom_neopixel_set_led_off',

    'CODEino_get_ultrasonic',
    'CODEino_set_servo',
];
Entry.CODEino.getBlocks = function() {
    return {
        //region codeino 코드이노
        CODEino_get_sensor_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', 'A0'],
                        ['1', 'A1'],
                        ['2', 'A2'],
                        ['3', 'A3'],
                        ['4', 'A4'],
                        ['5', 'A5'],
                        ['6', 'A6'],
                    ],
                    value: 'A0',
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
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        CODEino_get_named_sensor_value: {
            // Block UI : <아날로그센서> 센서값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_sensor_name_0, '0'],
                        [Lang.Blocks.CODEino_sensor_name_1, '1'],
                        [Lang.Blocks.CODEino_sensor_name_2, '2'],
                        [Lang.Blocks.CODEino_sensor_name_3, '3'],
                        [Lang.Blocks.CODEino_sensor_name_4, '4'],
                        [Lang.Blocks.CODEino_sensor_name_5, '5'],
                        [Lang.Blocks.CODEino_sensor_name_6, '6'],
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
                type: 'CODEino_get_named_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_sound_status: {
            // Block UI : 소리센서 <음량>
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_11, 'GREAT'],
                        [Lang.Blocks.CODEino_string_12, 'SMALL'],
                    ],
                    value: 'GREAT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_sound_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('STATUS', script);
                var value2 = 1;
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: 0,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[0] > 600 ? 1 : 0;
                    else return ANALOG[0] <= 600 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[0] > 600 ? 1 : 0;
                    else return ANALOG[0] <= 600 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_light_status: {
            // Block UI : 빛센서 <밝기>
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_14, 'BRIGHT'],
                        [Lang.Blocks.CODEino_string_15, 'DARK'],
                    ],
                    value: 'BRIGHT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_light_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('STATUS', script);
                var value2 = 1;
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: 1,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[value2] < 800 ? 1 : 0;
                    else return ANALOG[value2] <= 800 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[value2] < 800 ? 1 : 0;
                    else return ANALOG[value2] <= 800 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_is_button_pressed: {
            // Block UI : 보드의 <버튼누름/저항연결>
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_3, '4'],
                        [Lang.Blocks.CODEino_string_4, '17'],
                        [Lang.Blocks.CODEino_string_5, '18'],
                        [Lang.Blocks.CODEino_string_6, '19'],
                        [Lang.Blocks.CODEino_string_7, '20'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                if (port < 10) {
                    var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL);
                    var hardwareTime = Entry.hw.portData['TIME'] || 0;
                    var scope = script.executor.scope;
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!scope.isStart) {
                        scope.isStart = true;
                        scope.stamp = nowTime;
                        if (!Entry.hw.sendQueue['GET']) {
                            Entry.hw.sendQueue['GET'] = {};
                        }
                        Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.DIGITAL] = {
                            port: 4,
                            time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL),
                        };
                        throw new Entry.Utils.AsyncError();
                        return;
                    } else if (hardwareTime && hardwareTime === scope.stamp) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return DIGITAL ? !(DIGITAL[port] || 0) : 0;
                    } else if (nowTime - scope.stamp > 64) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return DIGITAL ? !(DIGITAL[port] || 0) : 0;
                    } else {
                        throw new Entry.Utils.AsyncError();
                        return;
                    }
                } else {
                    var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                    var hardwareTime = Entry.hw.portData['TIME'] || 0;
                    var scope = script.executor.scope;
                    var ANALOG = Entry.hw.portData.ANALOG;
                    if (!scope.isStart) {
                        scope.isStart = true;
                        scope.stamp = nowTime;
                        if (!Entry.hw.sendQueue['GET']) {
                            Entry.hw.sendQueue['GET'] = {};
                        }
                        Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                            port: port - 14,
                            time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                        };
                        throw new Entry.Utils.AsyncError();
                        return;
                    } else if (hardwareTime && hardwareTime === scope.stamp) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return ANALOG[port - 14] < 1000 ? 1 : 0;
                    } else if (nowTime - scope.stamp > 64) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return ANALOG[port - 14] < 1000 ? 1 : 0;
                    } else {
                        throw new Entry.Utils.AsyncError();
                        return;
                    }
                }
            },
        },
        CODEino_get_accelerometer_direction: {
            // Block UI : 3축 가속도센서 <기울기>
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_16, 'LEFT'],
                        [Lang.Blocks.CODEino_string_17, 'RIGHT'],
                        [Lang.Blocks.CODEino_string_18, 'FRONT'],
                        [Lang.Blocks.CODEino_string_19, 'REAR'],
                        [Lang.Blocks.CODEino_string_20, 'REVERSE'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_accelerometer_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('DIRECTION', script);
                var port = 0;
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value4 = 265;
                var value5 = 402;
                var value6 = -90;
                var value7 = 90;
                var result;
                if (value1 == 'LEFT' || value1 == 'RIGHT') port = 3;
                else if (value1 == 'FRONT' || value1 == 'REAR') port = 4;
                else if (value1 == 'REVERSE') port = 5;

                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result -= value4;
                    result = result * ((value7 - value6) / (value5 - value4));
                    result += value6;
                    result = Math.min(value7, result);
                    result = Math.max(value6, result);
                    result = Math.round(result);
                    if (value1 == 'LEFT' || value1 == 'REAR') return result < -30 ? 1 : 0;
                    else if (value1 == 'RIGHT' || value1 == 'FRONT') return result > 30 ? 1 : 0;
                    else if (value1 == 'REVERSE') return result < -50 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result -= value4;
                    result = result * ((value7 - value6) / (value5 - value4));
                    result += value6;
                    result = Math.min(value7, result);
                    result = Math.max(value6, result);
                    result = Math.round(result);
                    if (value1 == 'LEFT' || value1 == 'REAR') return result < -30 ? 1 : 0;
                    else if (value1 == 'RIGHT' || value1 == 'FRONT') return result > 30 ? 1 : 0;
                    else if (value1 == 'REVERSE') return result < -50 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_accelerometer_value: {
            // Block UI : 3축 가속도센서 <방향> 축의 센서값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['X', '3'], ['Y', '4'], ['Z', '5']],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_accelerometer_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                var result = 0;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result = (result - 333) * 1.46;
                    result = Math.min(90, result);
                    result = Math.max(-90, result);
                    return Math.round(result);
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result = (result - 333) * 1.46;
                    result = Math.min(90, result);
                    result = Math.max(-90, result);
                    return Math.round(result);
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_analog_value: {
            // Block UI : 아날로그 <핀번호> 센서의 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_analogSensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.ANALOG] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ANALOG),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_digital_value: {
            // Block UI : 디지털 <핀번호> 핀의 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    accept: 'string',
                    type: 'Dropdown',
                    options: [
                        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                        ['10', '10'], ['11', '11'], ['12', '12']
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    // {
                    //     type: 'arduino_get_port_number',
                    //     params:['13'],
                    // },
                    null
                ],
                type: 'CODEino_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_digitalSensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL);
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.CODEino.sensorTypes.DIGITAL] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_set_digital_value: {
            // Block UI : 디지털 <핀번호> 핀의 <켜기/끄기>
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    accept: 'string',
                    type: 'Dropdown',
                    options: [
                        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                        ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, '255'], [Lang.Blocks.ARDUINO_off, '0']],
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
                    null,
                    '255',
                    null,
                ],
                type: 'CODEino_set_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_digitalSensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberField('VALUE');
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                if(Entry.CODEino.LAST_ORDER_PORT === port){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=port;
                }

                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.DIGITAL,
                    data: value,
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL),
                };
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        CODEino_set_pwm_value: {
            // Block UI : 디지털 <핀번호> 번 핀을 <숫자> (으)로 정하기
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                        type: 'arduino_get_pwm_port_number',
                        params:['3'],
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_set_pwm_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_analogSensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === port){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=port;
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.PWM,
                    data: value,
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.PWM),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        CODEino_convert_scale: {
            // Block UI : 아날로그 <핀번호> 센서의 값 값의 범위를 0~1023에서 0~100 (으)로 바꾼 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'CODEino_get_analog_value',
                        value: '2',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'CODEino_convert_scale',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'CODEino_analogSensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
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
        },
        CODEino_set_rgb_value: {
            // Block UI : 컬러 LED의 <색> 색상을 <숫자> (으)로 정하기
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_led_red, '17'],
                        [Lang.Blocks.CODEino_led_green, '18'],
                        [Lang.Blocks.CODEino_led_blue, '19'],
                    ],
                    value: '17',
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
                params: [null, null],
                type: 'CODEino_set_rgb_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function (sprite, script) {
                var port = script.getNumberField('PORT', script);
                var value = script.getNumberValue('VALUE', script);

                value = Math.min(255, value);
                value = Math.max(0, value);
                Entry.CODEino.LED_VALUES[port - 17] = value;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                Entry.hw.sendQueue['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r: Entry.CODEino.LED_VALUES[0],
                        g: Entry.CODEino.LED_VALUES[1],
                        b: Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        CODEino_set_rgb_add_value: {
            // Block UI : 컬러 LED의 <색> 색상에 <숫자> 만큼 더하기
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_led_red, '17'],
                        [Lang.Blocks.CODEino_led_green, '18'],
                        [Lang.Blocks.CODEino_led_blue, '19'],
                    ],
                    value: '17',
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
                type: 'CODEino_set_rgb_add_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var value = script.getNumberValue('VALUE', script);

                value += Entry.CODEino.LED_VALUES[port-17];
                value = Math.min(255, value);
                value = Math.max(0, value);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                Entry.hw.sendQueue['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r:Entry.CODEino.LED_VALUES[0],
                        g:Entry.CODEino.LED_VALUES[1],
                        b:Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };
                return script.callReturn();
            },
        },
        CODEino_rgb_set_color: {
            // Block UI : 컬러 LED의 색상을 <색상표> (으)로 정하기
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null],
                type: 'CODEino_rgb_set_color',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value = script.getStringField('VALUE');
                var sq = Entry.hw.sendQueue;

                Entry.CODEino.LED_VALUES= [
                    parseInt(value.substr(1, 2), 16),
                    parseInt(value.substr(3, 2), 16),
                    parseInt(value.substr(5, 2), 16)
                ];
                
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                sq['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r:Entry.CODEino.LED_VALUES[0],
                        g:Entry.CODEino.LED_VALUES[1],
                        b:Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };

                return script.callReturn();
            },
        },
        CODEino_set_rgb_off: {
            // Block UI : 컬러 LED 끄기
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
                type: 'CODEino_set_rgb_off',
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                Entry.CODEino.LED_VALUES = [0,0,0]
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                sq['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r:Entry.CODEino.LED_VALUES[0],
                        g:Entry.CODEino.LED_VALUES[1],
                        b:Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        CODEino_set__led_by_rgb: {
            // r값 g값 b값 수동으로 주는 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_set__led_by_rgb',
            },
            paramsKeyMap: {
                rValue: 0,
                gValue: 1,
                bValue: 2,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                let values = [
                    script.getNumberValue('rValue'), 
                    script.getNumberValue('gValue'), 
                    script.getNumberValue('bValue')
                ];
                for(let i=0; i<values.length; ++i) {
                    if(values[i] >=0 && values[i] <=255) {
                        Entry.CODEino.LED_VALUES[i] = values[i]; 
                    }
                }

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                sq['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r:Entry.CODEino.LED_VALUES[0],
                        g:Entry.CODEino.LED_VALUES[1],
                        b:Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };

                return script.callReturn();
            },
        },
        CODEino_led_by_value: {
            // Block UI : 컬러 LED 켜기
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
                type: 'CODEino_led_by_value',
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                Entry.CODEino.LED_VALUES = [100,100,100];

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                if(Entry.CODEino.LAST_ORDER_PORT === 18){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=18;
                }
                sq['SET'][18] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: {
                        r:Entry.CODEino.LED_VALUES[0],
                        g:Entry.CODEino.LED_VALUES[1],
                        b:Entry.CODEino.LED_VALUES[2]
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.RGBLED_PIN),
                };

                return script.callReturn();
            },
        },
        CODEino_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'CODEino_get_number_sensor_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['CODEino.get_number_sensor_value(%1)'] },
        },
        CODEino_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'CODEino_toggle_led',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['CODEino.toggle_led(%1)'] },
        },
        CODEino_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_toggle_pwm',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['CODEino.toggle_pwm(%1, %2)'] },
        },

        CODEino_default_neopixel_on: {
            // Block UI : 기본 네오픽셀을 <색상표>(으)로 켜기
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null],
                type: 'CODEino_default_neopixel_on',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'CODEino_default_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value = script.getStringField('VALUE');
                var sq = Entry.hw.sendQueue;
                var port = 11;

                let red = parseInt(value.substr(1, 2), 16);
                let green = parseInt(value.substr(3, 2), 16);
                let blue = parseInt(value.substr(5, 2), 16);
                if (!sq.SET) {
                    sq.SET = {};
                }
                
                Entry.CODEino.DEFAULT_NEOPIXEL_RED_VALUE= red;
                Entry.CODEino.DEFAULT_NEOPIXEL_GREEN_VALUE= green;
                Entry.CODEino.DEFAULT_NEOPIXEL_BLUE_VALUE= blue;
                
                if(Entry.CODEino.LAST_ORDER_PORT === port){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=port;
                }
                
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL,
                    data: {
                        rValue:Entry.CODEino.DEFAULT_NEOPIXEL_RED_VALUE,
                        gValue:Entry.CODEino.DEFAULT_NEOPIXEL_GREEN_VALUE,
                        bValue:Entry.CODEino.DEFAULT_NEOPIXEL_BLUE_VALUE,
                        brightness:Entry.CODEino.DEFAULT_NEOPIXEL_BRIGHTNESS_VALUE,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL),
                };
                
                return script.callReturn();
            },
        },
        CODEino_default_neopixel_off: {
            // Block UI : 기본 네오픽셀을 끄기 %1
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
                type: 'CODEino_default_neopixel_off',
            },
            class: 'CODEino_default_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port = 11;
                if (!sq.SET) {
                    sq.SET = {};
                }
                Entry.CODEino.DEFAULT_NEOPIXEL_RED_VALUE= 0;
                Entry.CODEino.DEFAULT_NEOPIXEL_GREEN_VALUE= 0;
                Entry.CODEino.DEFAULT_NEOPIXEL_BLUE_VALUE= 0;
                
                if(Entry.CODEino.LAST_ORDER_PORT === port){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=port;
                }
                
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL,
                    data: {
                        rValue:Entry.CODEino.DEFAULT_NEOPIXEL_RED_VALUE,
                        gValue:Entry.CODEino.DEFAULT_NEOPIXEL_GREEN_VALUE,
                        bValue:Entry.CODEino.DEFAULT_NEOPIXEL_BLUE_VALUE,
                        brightness:Entry.CODEino.DEFAULT_NEOPIXEL_BRIGHTNESS_VALUE,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL),
                };

                return script.callReturn();
            },
        },
        CODEino_default_neopixel_setBrightness: {
            // Block UI : 기본 네오픽셀의 밝기를 %1(으)로 하기 %2
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'number',
                    params: ['22'],
                    },
                    null
                ],
                type: 'CODEino_default_neopixel_setBrightness',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'CODEino_default_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE', script);
                var sq = Entry.hw.sendQueue;

                var port = 11;

                if (!sq.SET) {
                    sq.SET = {};
                }
                Entry.CODEino.DEFAULT_NEOPIXEL_BRIGHTNESS_VALUE = value;

                if(Entry.CODEino.LAST_ORDER_PORT === port){
                    Entry.hw.update();
                } else {
                    Entry.CODEino.LAST_ORDER_PORT=port;
                }
                
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL,
                    data: {
                        rValue:Entry.CODEino.DEFAULT_NEOPIXEL_RED_VALUE,
                        gValue:Entry.CODEino.DEFAULT_NEOPIXEL_GREEN_VALUE,
                        bValue:Entry.CODEino.DEFAULT_NEOPIXEL_BLUE_VALUE,
                        brightness:Entry.CODEino.DEFAULT_NEOPIXEL_BRIGHTNESS_VALUE,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DEFAULT_NEOPIXEL),
                };

                return script.callReturn();
            },
        },
        CODEino_default_buzzer: {
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
                        type: 'CODEino_octave_list',
                    },
                    {
                        type: 'CODEino_tone_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'CODEino_default_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                DURATION: 2,
            },
            class: 'CODEino_default_buzzer_mode',
            isNotFor: ['CODEino'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12;

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.CODEino.toneTable[note];
                    }

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    if (Entry.CODEino.LAST_ORDER_PORT === port) {
                        Entry.hw.update();
                    } else {
                        Entry.CODEino.LAST_ORDER_PORT = port;
                    }

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.CODEino.sensorTypes.DEFAULT_BUZZER,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.CODEino.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.CODEino.sensorTypes.DEFAULT_BUZZER,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.CODEino.sensorTypes.DEFAULT_BUZZER,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        CODEino_custom_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    accept: 'string',
                    type: 'Dropdown',
                    options: [
                        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                        ['10', '10'], ['11', '11'], ['12', '12']
                    ],
                    value: '12',
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
                    type: 'Block',
                    accept: 'string',
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
                        type: 'CODEino_octave_list',
                    },
                    {
                        type: 'CODEino_tone_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'CODEino_custom_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                OCTAVE: 1,
                NOTE: 2,
                DURATION: 3,
            },
            class: 'CODEino_custom_buzzer_mode',
            isNotFor: ['CODEino'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT');

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.CODEino.toneTable[note];
                    }

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }
                    
                    if (Entry.CODEino.LAST_ORDER_PORT === port) {
                        Entry.hw.update();
                    } else {
                        Entry.CODEino.LAST_ORDER_PORT = port;
                    }

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.CODEino.sensorTypes.CUSTOM_BUZZER,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.CODEino.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.CODEino.sensorTypes.CUSTOM_BUZZER,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.CODEino.sensorTypes.CUSTOM_BUZZER,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        CODEino_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
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
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getField('NOTE');
            },            
        },
        CODEino_octave_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '4',
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
                OCTAVE: 0,
            },
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        CODEino_custom_neopixel_on: {
            // Block UI : %1번핀에 커스텀 네오픽셀 등록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    accept: 'string',
                    type: 'Dropdown',
                    options: [
                        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                        ['10', '10'], ['11', '11'], ['12', '12']
                    ],
                    value: '10',
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
                    null
                ],
                type: 'CODEino_custom_neopixel_on',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_custom_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT');

                if (!sq.SET) {
                    sq.SET = {};
                }

                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER,
                    data: {
                        isOn:1,
                        brightness:22,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER),
                };
                
                return script.callReturn();
            },
        },
        CODEino_custom_neopixel_off: {
            // Block UI : 커스텀 네오픽셀 모두 끄기 %1
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
                type: 'CODEino_custom_neopixel_off',
            },
            class: 'CODEino_custom_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port = Entry.CODEino.customNeoPixelPin+9;//59
                if (!sq.SET) {
                    sq.SET = {};
                }

                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER,
                    data: {
                        isOn:0,
                        brightness:Entry.CODEino.CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER),
                };

                return script.callReturn();
            },
        },
        CODEino_custom_neopixel_setBrightness: {
            // Block UI : 커스텀 네오픽셀의 밝기를 %1(으)로 하기 %2
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'number',
                    params: ['22'],
                    },
                    null
                ],
                type: 'CODEino_custom_neopixel_setBrightness',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'CODEino_custom_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE', script);
                var sq = Entry.hw.sendQueue;

                var port = Entry.CODEino.customNeoPixelPin+10;//60
                if (!sq.SET) {
                    sq.SET = {};
                }
                Entry.CODEino.CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE = value;
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER,
                    data: {
                        isOn:2,
                        brightness:Entry.CODEino.CUSTOM_NEOPIXEL_BRIGHTNESS_VALUE,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_POWER),
                };

                return script.callReturn();
            },
        },
        CODEino_custom_neopixel_set_led_color: {
            // Block UI : 커스텀 네오픽셀 %1번째 LED를 <색상표>(으)로 설정
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8']
                    ],
                    value: '0',
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
                params: [null],
                type: 'CODEino_custom_neopixel_set_led_color',
            },
            paramsKeyMap: {
                LED:0,
                COLOR: 1
            },
            class: 'CODEino_custom_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                let led = script.getNumberValue('LED', script)

                var value = script.getStringField('COLOR');
                var sq = Entry.hw.sendQueue;
                
                var port = Entry.CODEino.customNeoPixelPin+led;

                let red = parseInt(value.substr(1, 2), 16);
                let green = parseInt(value.substr(3, 2), 16);
                let blue = parseInt(value.substr(5, 2), 16);
                if (!sq.SET) {
                    sq.SET = {};
                }
                                
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_LED_HANDLE,
                    data :{ 
                        r: red,
                        g: green,
                        b: blue,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_LED_HANDLE),
                };
                return script.callReturn();
            },
        },
        CODEino_custom_neopixel_set_led_off: {
            // Block UI : 커스텀 네오픽셀 %1번째 LED를 끄기%2
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8']
                    ],
                    value: '0',
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
                params: [null],
                type: 'CODEino_custom_neopixel_set_led_off',
            },
            paramsKeyMap: {
                LED:0
            },
            class: 'CODEino_custom_neopixel_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                let led = script.getNumberValue('LED', script)

                var sq = Entry.hw.sendQueue;
                // 등록부터 해서 핀값을 정해놔야함
                // 200601 : port를 (가상디폴트포트50 + led 넘버로 정하자)
                var port = Entry.CODEino.customNeoPixelPin+led;

                if (!sq.SET) {
                    sq.SET = {};
                }

                // led 
                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_LED_HANDLE,
                    data :{ 
                        r: 0,
                        g: 0,
                        b: 0,
                    },
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.CUSTOM_NEOPIXEL_LED_HANDLE),
                };
                return script.callReturn();
            },
            //syntax: { js: [], py: ['CODEino.toggle_pwm(%1, %2)'] },
        },
        CODEino_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    accept: 'string',
                    type: 'Dropdown',
                    options: [
                        ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                        ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                        ['10', '10'], ['11', '11'], ['12', '12']
                    ],
                    value: '7',
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
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'CODEino_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_servo',
            isNotFor: ['CODEino'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);
                console.log("servo_script:",script);
                if (!sq.SET) {
                    sq.SET = {};
                }

                if (Entry.CODEino.LAST_ORDER_PORT === port) {
                    Entry.hw.update();
                    delete Entry.hw.sendQueue["SET"][port];
                } else {
                    Entry.CODEino.LAST_ORDER_PORT = port;                    
                }

                sq.SET[port] = {
                    type: Entry.CODEino.sensorTypes.SERVO_PIN,
                    data: value,
                    time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.SERVO_PIN),
                };
                Entry.hw.update();
                return script.callReturn();            
            },
        },

        CODEino_get_ultrasonic: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#fff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        accept: 'string',
                        type: 'Dropdown',
                        options: [
                            ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                            ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                            ['10', '10'], ['11', '11'], ['12', '12']
                        ],
                        value: '2',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        accept: 'string',
                        type: 'Dropdown',
                        options: [
                            ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                            ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                            ['10', '10'], ['11', '11'], ['12', '12']
                        ],
                        value: '3',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null
                    ],
                    type: 'CODEino_get_ultrasonic',
                },
                paramsKeyMap: {
                    PORT1: 0,
                    PORT2: 1,
                },
                class: 'CODEino_ultrasonic',
                isNotFor: ['CODEino'],
                func(sprite, script) {
                    const port1 = script.getNumberValue('PORT1', script);
                    const port2 = script.getNumberValue('PORT2', script);
    
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port1] = {
                        type: Entry.CODEino.sensorTypes.ULTRASONIC,
                        data: port2,
                        time: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.ULTRASONIC),
                    };
                    return Entry.hw.portData.ULTRASONIC || 0;
                },
            },
        //endregion codeino 코드이노
    };
};

module.exports = Entry.CODEino;
