'use strict';

Entry.Robotry_Robit_Stage = {
    id: ['4B.1'],
    name: 'Robotry_Robit_Stage',
    url: 'http://robotry.co.kr',
    imageName: 'arduinoNano.png',
    title: {
        ko: '로빗 무대',
        en: 'Robit Stage',
    },

   setZero() {
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
    },
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
    BlockState: {},
};

Entry.Robotry_Robit_Stage.setLanguage = function() {
    return {
        ko: {
            template: {
                // 로빗 무대 블록
                Robotry_Robit_Stage_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                Robotry_Robit_Stage_get_ultrasonic: '초음파 센서 (cm) ',
                Robotry_Robit_Stage_get_sensor_value: '%1 센서 (0 ~ 1023)',

                Robotry_Robit_Stage_set_tone: '%2 옥타브 %3 %4 초 동안 연주하기 %5',
                Robotry_Robit_Stage_set_led:'%1 LED %2 %3',
                Robotry_Robit_Stage_set_bidirectional_motor:'%3 으로 모터 회전시키기 %4',
                
                Robotry_Robit_Stage_set_led_pwm: '%1 LED 를 %2 의 밝기로 켜기 %3',
                Robotry_Robit_Stage_set_bidirectional_motor_pwm:'%3 으로 %4 만큼 모터 회전시키기 %5',
            },
            Helper:{ // 블록 선택시 나타나는 한글 설명
                // Get
                Robotry_Robit_Stage_get_analog_value_map:
                "놓여진 센서블록 값의 범위를 원하는 범위로 변환합니다. </br></br>이 블록을 사용하면 센서로부터 받은 데이터를 </br>사용자의 상황에 맞게 가공할 수 있습니다. </br></br>ex) 0 부터 1023 까지의 값을 0 부터 255 까지의 값으로 맵핑합니다.",
                Robotry_Robit_Stage_get_ultrasonic:
                "로빗무대에 전면에 있는 초음파 센서로부터 앞에 놓여진 </br>대상과의 거리를 계산합니다. (단위는 cm 입니다.)",
                Robotry_Robit_Stage_get_sensor_value:
                "로빗무대는 제품 상단에 위치한 구멍으로 부터 </br>빛(왼쪽 구멍)과 소리(오른쪽 구멍)를 감지할 수 있습니다. </br></br>센서블록은 각 센서로부터 주변 환경 데이터를 받아 </br>0 부터 1023 까지의 값으로 표현합니다. </br></br>블럭의 값은 센서에 입력되는 빛 혹은 소리의 세기가 </br>강하면 값이 높아지고 약하면 낮아집니다.",
                // Set
                Robotry_Robit_Stage_set_tone:
                "옥타브와 음계를 선택해서 해당하는 음을 내장된 부저를 통해 </br>연주할 수 있습니다.",
                Robotry_Robit_Stage_set_led:
                "LED 를 On / Off 할 수 있습니다.",
                Robotry_Robit_Stage_set_bidirectional_motor:
                "모터는 정방향과 역방향으로 회전할 수 있습니다.",
                // PMW
                Robotry_Robit_Stage_set_led_pwm:
                "LED 의 밝기를 0 부터 255까지 값으로 조절할 수 있습니다. </br></br>LED 의 밝기는 0 에 가까워 질수록 어두워지고 </br>255 에 가까워 질수록 밝아집니다.",
                Robotry_Robit_Stage_set_bidirectional_motor_pwm:
                "모터의 회전 방향과 0 부터 255 값으로 모터의 회전력을 </br>제어할 수 있습니다. </br></br>모터의 회전력은 0 에 가까워 질수록 약해지고 </br>255 에 가까워 질수록 강해집니다.",
            },  
            Blocks : {
                // 드롭 다운 메뉴
                left : '왼쪽',
                right : '오른쪽',
                light_s : '빛 감지',
                mic_s : '소리 감지',
                clockwise : '정방향',
                counter_clockwise : '역방향',
                position_the_sensorblock : '센서블록을 놓아주세요.',
                
            }
        },
        en: {
            template: {
                // 로빗 무대 블록
                Robotry_Robit_Stage_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                Robotry_Robit_Stage_get_ultrasonic: '초음파 센서 (cm) ',
                Robotry_Robit_Stage_get_sensor_value: '%1 센서 (0 ~ 1023)',

                Robotry_Robit_Stage_set_tone: '%2 옥타브 %3 %4 초 동안 연주하기 %5',
                Robotry_Robit_Stage_set_led:'%1 LED %2 %3',
                Robotry_Robit_Stage_set_bidirectional_motor:'%3 으로 모터 회전시키기 %4',
                
                Robotry_Robit_Stage_set_led_pwm: '%1 LED 를 %2 의 밝기로 켜기 %3',
                Robotry_Robit_Stage_set_bidirectional_motor_pwm:'%3 으로 %4 만큼 모터 회전시키기 %5',
            },
            Helper:{
                // Get
                Robotry_Robit_Stage_get_analog_value_map:
                "놓여진 센서블록 값의 범위를 원하는 범위로 변환합니다. </br></br>이 블록을 사용하면 센서로부터 받은 데이터를 </br>사용자의 상황에 맞게 가공할 수 있습니다. </br></br>ex) 0 부터 1023 까지의 값을 0 부터 255 까지의 값으로 맵핑합니다.",
                Robotry_Robit_Stage_get_ultrasonic:
                "로빗무대에 전면에 있는 초음파 센서로부터 앞에 놓여진 </br>대상과의 거리를 계산합니다. (단위는 cm 입니다.)",
                Robotry_Robit_Stage_get_sensor_value:
                "로빗무대는 제품 상단에 위치한 구멍으로 부터 </br>빛(왼쪽 구멍)과 소리(오른쪽 구멍)를 감지할 수 있습니다. </br></br>센서블록은 각 센서로부터 주변 환경 데이터를 받아 </br>0 부터 1023 까지의 값으로 표현합니다. </br></br>블럭의 값은 센서에 입력되는 빛 혹은 소리의 세기가 </br>강하면 값이 높아지고 약하면 낮아집니다.",
                // Set
                Robotry_Robit_Stage_set_tone:
                "옥타브와 음계를 선택해서 해당하는 음을 내장된 부저를 통해 </br>연주할 수 있습니다.",
                Robotry_Robit_Stage_set_led:
                "LED 를 On / Off 할 수 있습니다.",
                Robotry_Robit_Stage_set_bidirectional_motor:
                "모터는 정방향과 역방향으로 회전할 수 있습니다.",
                // PMW
                Robotry_Robit_Stage_set_led_pwm:
                "LED 의 밝기를 0 부터 255까지 값으로 조절할 수 있습니다. </br></br>LED 의 밝기는 0 에 가까워 질수록 어두워지고 </br>255 에 가까워 질수록 밝아집니다.",
                Robotry_Robit_Stage_set_bidirectional_motor_pwm:
                "모터의 회전 방향과 0 부터 255 값으로 모터의 회전력을 </br>제어할 수 있습니다. </br></br>모터의 회전력은 0 에 가까워 질수록 약해지고 </br>255 에 가까워 질수록 강해집니다.",
            }, 
            Blocks : {
                // 드롭 다운 메뉴
                left : 'left',
                right : 'right',
                light_s : 'Ambient Light Sensor',
                mic_s : 'Sound Sensor',
                clockwise : 'Clockwise',
                counter_clockwise : 'Counterclockwise'
            },
        },
    };
};

// 블록의 배치 순서
Entry.Robotry_Robit_Stage.blockMenuBlocks = [
    // Get
    'Robotry_Robit_Stage_get_analog_value_map',
    'Robotry_Robit_Stage_get_ultrasonic',
    'Robotry_Robit_Stage_get_sensor_value',
    // Set
    'Robotry_Robit_Stage_set_tone',
    'Robotry_Robit_Stage_set_led',
    'Robotry_Robit_Stage_set_bidirectional_motor',
    // PWM
    'Robotry_Robit_Stage_set_led_pwm',
    'Robotry_Robit_Stage_set_bidirectional_motor_pwm',
];

/* 
 *  로보트리의 아두이노 제어 블록 리스트
 *  주석에 블록이라고 표시된것만 제어 블록임 나머진 포트 리스트
 */
Entry.Robotry_Robit_Stage.getBlocks = function() {

    const ALS = 0;
    const CMS = 1;
    const Buzzer = 2;
    const US_T = 3;
    const US_E = 4;
    const Motor_P = 5;
    const Motor_N = 6;
    const Led_R = 9;
    const Led_L = 10;

    return {
        Robotry_Robit_Stage_text: {
            color: '#FFD974',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['10'],
            },
            paramsKeyMap: {
                NAME: 0,
            },
            func(sprite, script) {
                return script.getStringField('NAME');
            },
            syntax: {
                js: [],
                py: [],
            },
        },
       
        // Buzzer define Start
        Robotry_Robit_Stage_tone_list: {         // 버저 톤 리스트
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
            syntax: {
                js: [],
                py: [],
            },
        },
        Robotry_Robit_Stage_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        type: 'Robotry_Robit_Stage_tone_list',
                    },
                ],
                type: 'Robotry_Robit_Stage_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'Robotry_Robit_Stage_tone_value',
                    },
                ],
            },
        },
        Robotry_Robit_Stage_octave_list: {      // 옥타브 조절
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
            syntax: {
                js: [],
                py: [],
            },
        }, 
        // Buzzer define End


        /* Robit Stage Block Code Script Start */
        // Analog value Mapping Start
        Robotry_Robit_Stage_get_analog_value_map: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [Lang.Blocks.position_the_sensorblock],
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
                        params: ['255'],
                    },
                ],
                type: 'Robotry_Robit_Stage_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'Get',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                let result = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

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

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }

                return result;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        // Analog value Mapping End

        // Sensor Start
        Robotry_Robit_Stage_get_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.light_s, ALS], [Lang.Blocks.mic_s, CMS]],
                    value: [ALS],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'Robotry_Robit_Stage_get_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Get',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                let value = 0;

                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                
                if (port === 1){
                    value = Math.pow(Math.abs(ANALOG[port] - 88), 3);
                }
                else {
                    value = ANALOG[port]; 
                }
                return ANALOG && value < 1024 ?  value || 0 : 0;
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // Sensor End
        
        // Ultra Sonic Driver Start (Unit of length : 1cm)
        Robotry_Robit_Stage_get_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    value: [US_T]
                },
                {
                    value: [US_E]
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'Robotry_Robit_Stage_get_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'Get',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Robotry_Robit_Stage.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return  parseInt(Entry.hw.portData.ULTRASONIC) || 0; // cm 소수점 이하 표시 안함
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // Ultra Sonic Driver End

        // LED ON/OFF Start
        Robotry_Robit_Stage_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.right, Led_R], [Lang.Blocks.left, Led_L]],
                    value: [Led_R],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
                    value: 'on',
                    fontSize: 12,
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
                    null,
                    null,
                ],
                type: 'Robotry_Robit_Stage_set_led',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'Set',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Robit_Stage.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // LED ON/OFF Block End 


        // LED PWM Start
        Robotry_Robit_Stage_set_led_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.right, Led_R], [Lang.Blocks.left, Led_L]],
                    value: [Led_R],
                    fontSize: 12,
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
            event: {},
            def: {
                params: [
                    null,
                    {
                        type: 'Robotry_Robit_Stage_text',
                        params: ['255'],
                    },
                ],
                type: 'Robotry_Robit_Stage_set_led_pwm',
            },
            paramsKeyMap:{
                PORT: 0,
                VALUE: 1
            },
            class: 'Set_PWM',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script){
                const port = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
                // console.log(value);
                if(!Entry.hw.sendQueue.SET){
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Robit_Stage.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        // LED PWM End

        // Buzzer Control Start
        Robotry_Robit_Stage_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    value: [Buzzer],
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
                        type: 'Robotry_Robit_Stage_octave_list',
                    },
                    {
                        type: 'Robotry_Robit_Stage_tone_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'Robotry_Robit_Stage_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                OCTAVE: 1,
                NOTE: 2,
                DURATION: 3,
            },
            class: 'Set',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.Robotry_Robit_Stage.toneTable[note];
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

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.Robotry_Robit_Stage.sensorTypes.TONE,
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
                        value = Entry.Robotry_Robit_Stage.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.Robotry_Robit_Stage.sensorTypes.TONE,
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
                        type: Entry.Robotry_Robit_Stage.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // Buzzer Control End

        // Bidirectional DC Motor Start
        // 드롭다운 메뉴에서 정방향 역방향을 선택해서 모터의 방향을 제어할수 있따.
        Robotry_Robit_Stage_set_bidirectional_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    value: [Motor_P],
                },
                {
                    value: [Motor_N],
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.clockwise, 'on'], [Lang.Blocks.counter_clockwise, 'off']],
                    value: 'on',
                    fontSize: 12,
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
                ],
                type: 'Robotry_Robit_Stage_set_bidirectional_motor',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                OPERATOR: 2,
            },
            class: 'Set',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1');
                const port2 = script.getNumberValue('PORT2');
                const operator = script.getField('OPERATOR');
                const forward = operator == 'on' ? 255 : 0;
                const backward = operator == 'on' ? 0 : 255;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Robotry_Robit_Stage.sensorTypes.DIGITAL,
                    data: forward,
                    time: new Date().getTime(),
                };
                
                Entry.hw.sendQueue.SET[port2] = {
                    
                    type: Entry.Robotry_Robit_Stage.sensorTypes.DIGITAL,
                    data: backward,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // Bidirectional DC Motor End

        // Bidirectional DC Motor PWM Start
        // 드롭다운 메뉴에서 정방향 역방향을 선택해서 모터의 방향을 제어할수 있따.
        Robotry_Robit_Stage_set_bidirectional_motor_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    value: [Motor_P],
                },
                {
                    value: [Motor_N],
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.clockwise, 'on'], [Lang.Blocks.counter_clockwise, 'off']],
                    value: 'on',
                    fontSize: 12,
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
                    null,
                    {
                        type: 'Robotry_Robit_Stage_text',
                        params: ['255'],
                    },
                ],
                type: 'Robotry_Robit_Stage_set_bidirectional_motor_pwm',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                OPERATOR: 2,
                VALUE: 3,
            },
            class: 'Set_PWM',
            isNotFor: ['Robotry_Robit_Stage'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1');
                const port2 = script.getNumberValue('PORT2');
                
                const operator = script.getField('OPERATOR');
                const value = script.getNumberValue('VALUE');

                const forward = operator == 'on' ? value : 0;
                const backward = operator == 'on' ? 0 : value;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Robotry_Robit_Stage.sensorTypes.PWM,
                    data: forward,
                    time: new Date().getTime(),
                };
                
                Entry.hw.sendQueue.SET[port2] = {
                    
                    type: Entry.Robotry_Robit_Stage.sensorTypes.PWM,
                    data: backward,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        }, // Bidirectional DC Motor PWM End
        /* Robit Stage Block Code Script End */
    };
};


module.exports = Entry.Robotry_Robit_Stage;