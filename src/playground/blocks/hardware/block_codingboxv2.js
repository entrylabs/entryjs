'use strict';

Entry.CodingBoxV2 = new (class CodingBoxV2 {
    constructor() {
        this.functionKeys = {
            SET_LED: 'set-led',
            RESET: 'reset',
            SERVO: 'servo',
            TONE: 'tone',
            OLED_PRINT: 'oled-print',
            OLED_ICON: 'oled-icon',
            OLED_CLEAR: 'oled-clear',
            FAN: 'fan',
            RAINBOW_LIST: 'rainbow-list',
            RAINBOW_ALL: 'rainbow-all',
            RAINBOW_ONE: 'rainbow-one',
            RAINBOW_CLEAR: 'rainbow-clear',
            WIFI_CONNECT: 'wifi-connect',
            WIFI_DISCONNECT: 'wifi-disconnect',
            WEBPANEL_RESET: 'webpanel-reset',
            WEBPANEL_TITLE: 'webpanel-title',
            WEBPANEL_READOUT: 'webpanel-readout',
        };

        this.id = ['6F.1'];
        this.url = '';
        this.imageName = 'codingboxv2.png';
        this.title = {
            en: 'PLAYCODING BOX V2.0',
            ko: '플레이코딩 박스 V2.0',
        };
        this.name = 'codingboxv2';
        this.communicationType = 'manual';

        this.commandStatus = {};
        this.commandValue = {};

        this.blockMenuBlocks = [
            'codingboxv2_set_led',
            'codingboxv2_is_button_pressed',

            'codingboxv2_get_light',
            'codingboxv2_get_sound',
            'codingboxv2_get_pir',
            'codingboxv2_get_distance',
            'codingboxv2_get_joystick',
            'codingboxv2_get_temperature',
            'codingboxv2_get_humidity',
            'codingboxv2_get_pressure',
            'codingboxv2_get_altitude',
            // 'codingboxv2_get_compass_x',
            // 'codingboxv2_get_compass_y',
            // 'codingboxv2_get_compass_z',
            'codingboxv2_get_heading',
            'codingboxv2_get_rfid',            

            'codingboxv2_set_servo',
            'codingboxv2_play_note',

            'codingboxv2_oled_print',
            'codingboxv2_oled_icon',
            'codingboxv2_oled_clear',

            'codingboxv2_set_fan_power',
            'codingboxv2_fan_off',

            'codingboxv2_set_rainbow_all',
            'codingboxv2_set_rainbow_one',
            'codingboxv2_set_rainbow_list',
            'codingboxv2_clear_rainbow',

            'codingboxv2_wifi_connect',
            'codingboxv2_wifi_disconnect',
            'codingboxv2_wifi_is_connected',

            'codingboxv2_webpanel_reset',
            'codingboxv2_webpanel_title',
            'codingboxv2_webpanel_readout',
            'codingboxv2_webpanel_url',
            'codingboxv2_bottom_space',
        ];

        this.ledColorMenu = [
            ['빨강', 'red'],
            ['노랑', 'yellow'],
            ['초록', 'green'],
            ['모두', 'all'],
        ];

        this.ledStateMenu = [
            ['켜기', '1'],
            ['끄기', '0'],
        ];

        this.noteMenu = [
            ['도', '262'],
            ['레', '294'],
            ['미', '330'],
            ['파', '349'],
            ['솔', '392'],
            ['라', '440'],
            ['시', '494'],
            ['높은 도', '523'],
        ];

        this.oledIconMenu = [
            ['웃는 얼굴', 'smile'],
            ['우는 얼굴', 'sad'],
            ['큰 하트', 'bigheart'],
            ['작은 하트', 'smallheart'],
            ['체크', 'check'],
            ['X', 'x'],
            ['오리', 'duck'],
            ['로켓', 'rocket'],
            ['음표', 'note'],
            ['네모', 'square'],
            ['세모', 'triangle'],
        ];        

        this.buttonColorMenu = [
            ['빨강', '1'],
            ['노랑', '2'],
            ['초록', '3'],
        ];

        this.joystickAxisMenu = [
            ['X', 'x'],
            ['Y', 'y'],
        ];

        this.webPanelSensorMenu = [
            ['조도 센서', 'light'],
            ['사운드 센서', 'sound'],
            ['인체 감지 센서', 'pir'],
            ['초음파 거리', 'distance'],
            ['온도', 'temperature'],
            ['습도', 'humidity'],
            ['기압', 'pressure'],
            ['고도', 'altitude'],
            ['나침반 방향', 'heading'],
            ['RFID ID', 'rfid'],
            ['와이파이 연결 상태', 'wifiConnected'],
        ];
    }

    setZero() {
        this.requestCommand(this.functionKeys.RESET, 0);
        this.commandStatus = {};
        this.commandValue = {};
    }

    requestCommand(type, payload) {
        Entry.hw.sendQueue = {
            type,
            payload,
        };
        Entry.hw.update();
    }

    afterReceive(portData) {
        if (!portData) {
            return;
        }

        if (!Entry.engine.isState('run')) {
            this.commandStatus = {};
        }
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    codingboxv2_set_led: '%1 LED를 %2',
                    codingboxv2_get_light: '조도 센서 값',
                    codingboxv2_get_sound: '사운드 센서 값',
                    codingboxv2_get_pir: '인체가 감지되었는가?',
                    codingboxv2_get_distance: '초음파 거리(cm)',
                    codingboxv2_get_joystick: '방향 버튼 %1 값',
                    codingboxv2_set_servo: '서보 모터 각도를 %1 도로 정하기',
                    codingboxv2_play_note: '스피커 %1 음을 %2 박자 연주하기',
                    codingboxv2_oled_print: 'OLED의 X %1 Y %2 위치에 %3 %4 출력하기',
                    codingboxv2_oled_icon: 'OLED에 %1 아이콘 표시하기',
                    codingboxv2_oled_clear: 'OLED 지우기',    
                    codingboxv2_get_temperature: '온도(℃)',
                    codingboxv2_get_humidity: '습도(%)',        
                    codingboxv2_get_pressure: '기압(hPa)',
                    codingboxv2_get_altitude: '고도(m)',                                                
                    codingboxv2_set_fan_power: '모터 팬 세기를 %1 (-100 ~ 100)으로 정하기',
                    codingboxv2_fan_off: '모터 팬 끄기',
                    // codingboxv2_get_compass_x: '나침반 X축 값',
                    // codingboxv2_get_compass_y: '나침반 Y축 값',
                    // codingboxv2_get_compass_z: '나침반 Z축 값',
                    codingboxv2_get_heading: '나침반 방향(°)',  
                    codingboxv2_is_button_pressed: '%1 버튼이 눌렸는가?',    
                    codingboxv2_get_rfid: 'RFID ID',            
                    codingboxv2_set_rainbow_all: '레인보우 LED 전체를 %1 색으로 정하기',
                    codingboxv2_set_rainbow_one: '레인보우 LED %1 번째를 %2 색으로 정하기',
                    codingboxv2_set_rainbow_list: '레인보우 LED 색을 %1 %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 으로 정하기',
                    codingboxv2_clear_rainbow: '레인보우 LED 모두 끄기',
                    codingboxv2_wifi_connect: '와이파이 이름 %1 비밀번호 %2 로 연결하기',
                    codingboxv2_wifi_disconnect: '와이파이 연결 끊기',
                    codingboxv2_wifi_is_connected: '와이파이가 연결되었는가?',   
                    codingboxv2_webpanel_reset: '웹 패널 초기화하기',
                    codingboxv2_webpanel_title: '웹 패널 제목을 %1 로 정하기',
                    codingboxv2_webpanel_readout: '웹 패널에 %1 이름의 %2 값 표시창 추가하기',   
                    codingboxv2_webpanel_url: '웹 패널 주소',                                
                },
                Helper: {
                    codingboxv2_set_led: '선택한 LED를 켜거나 끕니다.',
                    codingboxv2_get_light: '조도 센서에서 측정한 밝기 값을 확인합니다.',
                    codingboxv2_get_sound: '사운드 센서에서 측정한 소리 값을 확인합니다.',
                    codingboxv2_get_pir: '인체 감지 센서에서 사람의 움직임이 감지되었는지 확인합니다.',
                    codingboxv2_get_distance: '초음파 센서에서 측정한 거리를 센티미터(cm) 단위로 확인합니다.',
                    codingboxv2_get_joystick: '방향 버튼의 선택한 방향 값을 확인합니다.',
                    codingboxv2_set_servo: '서보 모터의 각도를 지정한 각도로 정합니다.',
                    codingboxv2_play_note: '스피커에서 선택한 음을 지정한 박자 동안 연주합니다.',
                    codingboxv2_oled_print: 'OLED의 지정한 X, Y 위치에 선택한 크기로 내용을 출력합니다.',
                    codingboxv2_oled_icon: 'OLED에 선택한 아이콘을 표시합니다.',
                    codingboxv2_oled_clear: 'OLED에 표시된 내용을 모두 지웁니다.',
                    codingboxv2_get_temperature: '온도 센서에서 측정한 온도를 섭씨(℃) 단위로 확인합니다.',
                    codingboxv2_get_humidity: '습도 센서에서 측정한 습도를 퍼센트(%) 단위로 확인합니다.',
                    codingboxv2_get_pressure: '기압 센서에서 측정한 기압을 헥토파스칼(hPa) 단위로 확인합니다.',
                    codingboxv2_get_altitude: '기압 센서를 이용하여 측정한 고도를 미터(m) 단위로 확인합니다.',
                    codingboxv2_set_fan_power: '모터 팬의 세기를 -100에서 100 사이의 값으로 정합니다.',
                    codingboxv2_fan_off: '모터 팬의 작동을 멈춥니다.',
                    // codingboxv2_get_compass_x: '나침반 센서의 X축 값을 확인합니다.',
                    // codingboxv2_get_compass_y: '나침반 센서의 Y축 값을 확인합니다.',
                    // codingboxv2_get_compass_z: '나침반 센서의 Z축 값을 확인합니다.',
                    codingboxv2_get_heading: '나침반 센서에서 측정한 방향을 각도(°)로 확인합니다.',
                    codingboxv2_is_button_pressed: '선택한 버튼이 눌렸는지 확인합니다.',
                    codingboxv2_get_rfid: 'RFID에서 인식한 카드 또는 태그의 ID를 확인합니다.',
                    codingboxv2_set_rainbow_all: '모든 레인보우 LED를 선택한 색으로 정합니다.',
                    codingboxv2_set_rainbow_one: '선택한 번호의 레인보우 LED 색을 지정한 색으로 정합니다.',
                    codingboxv2_set_rainbow_list: '12개의 레인보우 LED 색을 각각 지정한 색으로 정합니다.',
                    codingboxv2_clear_rainbow: '모든 레인보우 LED를 끕니다.',
                    codingboxv2_wifi_connect: '입력한 와이파이 이름과 비밀번호를 사용하여 와이파이에 연결합니다.',
                    codingboxv2_wifi_disconnect: '현재 연결된 와이파이의 연결을 끊습니다.',
                    codingboxv2_wifi_is_connected: '와이파이가 연결되어 있는지 확인합니다.',
                    codingboxv2_webpanel_reset: '웹 패널의 설정과 표시 항목을 초기화합니다.',
                    codingboxv2_webpanel_title: '웹 패널에 표시할 제목을 정합니다.',
                    codingboxv2_webpanel_readout: '웹 패널에 지정한 이름과 값을 표시하는 값 표시창을 추가합니다.',
                    codingboxv2_webpanel_url: '웹 패널에 접속할 수 있는 주소를 확인합니다.',
                },
            },
            en: {
                template: {
                    codingboxv2_set_led: 'set %1 LED to %2',
                    codingboxv2_get_light: 'light sensor value',
                    codingboxv2_get_sound: 'sound sensor value',
                    codingboxv2_get_pir: 'PIR motion detected?',
                    codingboxv2_get_distance: 'ultrasonic distance(cm)',
                    codingboxv2_get_joystick: 'joystick %1 value',
                    codingboxv2_set_servo: 'set servo angle to %1 degrees',
                    codingboxv2_play_note: 'play %1 note for %2 beats',
                    codingboxv2_oled_print: 'print %4 on OLED at X %1 Y %2 size %3',
                    codingboxv2_oled_icon: 'show %1 icon on OLED',
                    codingboxv2_oled_clear: 'clear OLED display',  
                    codingboxv2_get_temperature: 'temperature(℃)',
                    codingboxv2_get_humidity: 'humidity(%)',        
                    codingboxv2_get_pressure: 'pressure(hPa)',
                    codingboxv2_get_altitude: 'altitude(m)',  
                    codingboxv2_set_fan_power: 'set motor fan power to %1 (-100 ~ 100)',
                    codingboxv2_fan_off: 'turn off motor fan',
                    // codingboxv2_get_compass_x: 'compass X value',
                    // codingboxv2_get_compass_y: 'compass Y value',
                    // codingboxv2_get_compass_z: 'compass Z value',
                    codingboxv2_get_heading: 'compass heading(°)',                
                    codingboxv2_is_button_pressed: 'is %1 button pressed?',                 
                    codingboxv2_get_rfid: 'RFID ID',
                    codingboxv2_set_rainbow_all: 'set all rainbow LEDs to %1',
                    codingboxv2_set_rainbow_one: 'set rainbow LED %1 to %2',
                    codingboxv2_set_rainbow_list: 'set rainbow LED colors to %1 %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12',
                    codingboxv2_clear_rainbow: 'turn off all rainbow LEDs',
                    codingboxv2_wifi_connect: 'connect to Wi-Fi %1 with password %2',
                    codingboxv2_wifi_disconnect: 'disconnect Wi-Fi',
                    codingboxv2_wifi_is_connected: 'is Wi-Fi connected?',         
                    codingboxv2_webpanel_reset: 'reset web panel',
                    codingboxv2_webpanel_title: 'set web panel title to %1',
                    codingboxv2_webpanel_readout: 'add %2 readout named %1 to web panel',
                    codingboxv2_webpanel_url: 'web panel address',                              
                },
                Helper: {
                    codingboxv2_set_led: 'Turns the selected LED on or off.',
                    codingboxv2_get_light: 'Gets the brightness value measured by the light sensor.',
                    codingboxv2_get_sound: 'Gets the sound value measured by the sound sensor.',
                    codingboxv2_get_pir: 'Checks whether human movement is detected by the motion sensor.',
                    codingboxv2_get_distance: 'Gets the distance measured by the ultrasonic sensor in centimeters (cm).',
                    codingboxv2_get_joystick: 'Gets the value of the selected direction button.',
                    codingboxv2_set_servo: 'Sets the servo motor to the specified angle.',
                    codingboxv2_play_note: 'Plays the selected note through the speaker for the specified beat.',
                    codingboxv2_oled_print: 'Displays content at the specified X and Y position on the OLED using the selected size.',
                    codingboxv2_oled_icon: 'Displays the selected icon on the OLED.',
                    codingboxv2_oled_clear: 'Clears all content displayed on the OLED.',
                    codingboxv2_get_temperature: 'Gets the temperature measured by the temperature sensor in degrees Celsius (℃).',
                    codingboxv2_get_humidity: 'Gets the humidity measured by the humidity sensor as a percentage (%).',
                    codingboxv2_get_pressure: 'Gets the atmospheric pressure measured by the pressure sensor in hectopascals (hPa).',
                    codingboxv2_get_altitude: 'Gets the altitude measured using the pressure sensor in meters (m).',
                    codingboxv2_set_fan_power: 'Sets the motor fan power to a value between -100 and 100.',
                    codingboxv2_fan_off: 'Stops the motor fan.',
                    // codingboxv2_get_compass_x: 'Gets the X-axis value of the compass sensor.',
                    // codingboxv2_get_compass_y: 'Gets the Y-axis value of the compass sensor.',
                    // codingboxv2_get_compass_z: 'Gets the Z-axis value of the compass sensor.',
                    codingboxv2_get_heading: 'Gets the direction measured by the compass sensor in degrees (°).',
                    codingboxv2_is_button_pressed: 'Checks whether the selected button is pressed.',
                    codingboxv2_get_rfid: 'Gets the ID of the card or tag detected by the RFID reader.',
                    codingboxv2_set_rainbow_all: 'Sets all rainbow LEDs to the selected color.',
                    codingboxv2_set_rainbow_one: 'Sets the selected rainbow LED to the specified color.',
                    codingboxv2_set_rainbow_list: 'Sets each of the 12 rainbow LEDs to the specified color.',
                    codingboxv2_clear_rainbow: 'Turns off all rainbow LEDs.',
                    codingboxv2_wifi_connect: 'Connects to Wi-Fi using the entered Wi-Fi name and password.',
                    codingboxv2_wifi_disconnect: 'Disconnects from the currently connected Wi-Fi network.',
                    codingboxv2_wifi_is_connected: 'Checks whether Wi-Fi is connected.',
                    codingboxv2_webpanel_reset: 'Resets the web panel settings and display items.',
                    codingboxv2_webpanel_title: 'Sets the title displayed on the web panel.',
                    codingboxv2_webpanel_readout: 'Adds a readout to the web panel that displays the specified name and value.',
                    codingboxv2_webpanel_url: 'Gets the address used to access the web panel.',
                },
            },
        };
    }

    getBlocks = function () {
        return {
            // 신호등 LED
            codingboxv2_set_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_set_led,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.ledColorMenu,
                        value: 'red',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: this.ledStateMenu,
                        value: '1',
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
                class: 'codingboxv2_led',
                isNotFor: ['codingboxv2'],
                def: {
                    params: ['red', '1', null],
                    type: 'codingboxv2_set_led',
                },
                paramsKeyMap: {
                    COLOR: 0,
                    STATE: 1,
                },
                func: (sprite, script) => {
                    const color = script.getField('COLOR', script);
                    const state = script.getField('STATE', script);

                    this.requestCommand(
                        this.functionKeys.SET_LED,
                        `${color},${state}`
                    );
                },
            },

            // 조도 센서
            codingboxv2_get_light: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_light',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.light || 0;
                },
            },

            // 사운드 센서
            codingboxv2_get_sound: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_sound',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.sound || 0;
                },
            },

            // 인체감지 센서
            codingboxv2_get_pir: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_pir',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.pir == 1;
                },
            },

            // 초음파 센서
            codingboxv2_get_distance: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_distance',
                },
                paramsKeyMap: {},
                func: () => {
                    return Math.round(Entry.hw.portData.distance || 0);
                },
            },

            // 방향 버튼 값
            codingboxv2_get_joystick: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: Lang.template.codingboxv2_get_joystick,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.joystickAxisMenu,
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    params: ['x'],
                    type: 'codingboxv2_get_joystick',
                },
                paramsKeyMap: {
                    AXIS: 0,
                },
                func: (sprite, script) => {
                    const axis = script.getField('AXIS', script);

                    if (axis === 'x') {
                        return Entry.hw.portData.joyX || 0;
                    }

                    return Entry.hw.portData.joyY || 0;
                },
            },           

            // 서보 모터
            codingboxv2_set_servo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 90,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_output',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['90'],
                        },
                    ],
                    type: 'codingboxv2_set_servo',
                },
                paramsKeyMap: {
                    ANGLE: 0,
                },
                func: (sprite, script) => {
                    let angle = script.getNumberValue('ANGLE');

                    angle = Math.max(0, Math.min(180, angle));

                    this.requestCommand(
                        this.functionKeys.SERVO,
                        angle
                    );
                },
            },

            // 스피커
            codingboxv2_play_note: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.noteMenu,
                        value: '262',
                        fontSize: 11,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 1,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_output',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        '262',
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'codingboxv2_play_note',
                },
                paramsKeyMap: {
                    NOTE: 0,
                    BEAT: 1,
                },
                func: (sprite, script) => {
                    const note = script.getField('NOTE', script);
                    const beat = script.getNumberValue('BEAT');

                    this.requestCommand(
                        this.functionKeys.TONE,
                        `${note},${beat}`
                    );
                },
            },

            // OLED 출력
            codingboxv2_oled_print: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 20,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 20,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['작게', '1'],
                            ['크게', '2'],
                        ],
                        value: '2',   // 크게를 기본값으로
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'text',
                        value: 'Hello',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_oled',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['20'],
                        },
                        {
                            type: 'number',
                            params: ['20'],
                        },
                        '2',
                        {
                            type: 'text',
                            params: ['Hello'],
                        },
                        null,
                    ],
                    type: 'codingboxv2_oled_print',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    SIZE: 2,
                    TEXT: 3,
                },
                func: (sprite, script) => {
                    const x = script.getNumberValue('X') || 0;
                    const y = script.getNumberValue('Y') || 0;
                    const size = script.getField('SIZE', script);

                    const text = script.getStringValue('TEXT') || '';

                    this.requestCommand(
                        this.functionKeys.OLED_PRINT,
                        `${x},${y},${size},${text}`
                    );
                },
            },      
            
            // OLED 아이콘 표시
            codingboxv2_oled_icon: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_oled_icon,
                params: [
                    {
                        type: 'Dropdown',
                        options: this.oledIconMenu,
                        value: 'smile',
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
                class: 'codingboxv2_oled',
                isNotFor: ['codingboxv2'],
                def: {
                    params: ['smile', null],
                    type: 'codingboxv2_oled_icon',
                },
                paramsKeyMap: {
                    ICON: 0,
                },
                func: (sprite, script) => {
                    const icon = script.getField('ICON', script);

                    this.requestCommand(
                        this.functionKeys.OLED_ICON,
                        icon
                    );
                },
            },

            // OLED 지우기
            codingboxv2_oled_clear: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
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
                class: 'codingboxv2_oled',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_oled_clear',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.OLED_CLEAR,
                        0
                    );
                },
            },            

            // 온도
            codingboxv2_get_temperature: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: { type: 'codingboxv2_get_temperature' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.temperature || 0,
            },

            // 습도
            codingboxv2_get_humidity: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: { type: 'codingboxv2_get_humidity' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.humidity || 0,
            },            

            // 기압
            codingboxv2_get_pressure: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: { type: 'codingboxv2_get_pressure' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.pressure || 0,
            },

            // 고도
            codingboxv2_get_altitude: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: { type: 'codingboxv2_get_altitude' },
                paramsKeyMap: {},
                func: () => Entry.hw.portData.altitude || 0,
            },

            // 모터 팬
            codingboxv2_set_fan_power: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_fan',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['100'],
                        },
                        null,
                    ],
                    type: 'codingboxv2_set_fan_power',
                },
                paramsKeyMap: {
                    POWER: 0,
                },
                func: (sprite, script) => {
                    let power = script.getNumberValue('POWER');
                    power = Math.max(-100, Math.min(100, power));

                    this.requestCommand(this.functionKeys.FAN, power);
                },
            },

            // 모터 팬 끄기
            codingboxv2_fan_off: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_fan_off,
                params: [],
                events: {},
                class: 'codingboxv2_fan',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [],
                    type: 'codingboxv2_fan_off',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.FAN,
                        0
                    );
                },
            },            

            /*
            // 나침반 X축
            codingboxv2_get_compass_x: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_compass_x',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.compassX || 0;
                },
            },

            // 나침반 Y축
            codingboxv2_get_compass_y: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_compass_y',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.compassY || 0;
                },
            },

            // 나침반 Z축
            codingboxv2_get_compass_z: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_compass_z',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.compassZ || 0;
                },
            },
            */

            // 나침반 방향
            codingboxv2_get_heading: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_heading',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.heading || 0;
                },
            },

            // 버튼
            codingboxv2_is_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: this.buttonColorMenu,
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'codingboxv2_led',
                isNotFor: ['codingboxv2'],
                def: {
                    params: ['1'],
                    type: 'codingboxv2_is_button_pressed',
                },
                paramsKeyMap: {
                    BUTTON: 0,
                },
                func: (sprite, script) => {
                    const selectedButton = Number(script.getField('BUTTON', script));
                    const currentButton = Number(Entry.hw.portData.button || 0);

                    return currentButton === selectedButton;
                },
            },

            // RFID
            codingboxv2_get_rfid: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                params: [],
                events: {},
                class: 'codingboxv2_sensor',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_get_rfid',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.rfid || '';
                },
            },

            // 레인보우 LED 전체
            codingboxv2_set_rainbow_all: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_set_rainbow_all,
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
                class: 'codingboxv2_rainbow',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        '#ff0000',
                        null,
                    ],
                    type: 'codingboxv2_set_rainbow_all',
                },
                paramsKeyMap: {
                    COLOR: 0,
                },
                func: (sprite, script) => {
                    const color = script.getField('COLOR', script) || '#ff0000';

                    const r = parseInt(color.substring(1, 3), 16);
                    const g = parseInt(color.substring(3, 5), 16);
                    const b = parseInt(color.substring(5, 7), 16);

                    this.requestCommand(
                        this.functionKeys.RAINBOW_ALL,
                        `${r},${g},${b}`
                    );
                },
            },

            // 레인보우 LED 개별 색
            codingboxv2_set_rainbow_list: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_set_rainbow_list,
                params: [
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    { type: 'Color' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_rainbow',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        '#ff0000', // 1
                        '#ff4600', // 2
                        '#ff8b00', // 3
                        '#ffd100', // 4
                        '#e8ff00', // 5
                        '#8cff00', // 6
                        '#31ff00', // 7
                        '#00ff73', // 8
                        '#00e6d5', // 9
                        '#008cff', // 10
                        '#3100ff', // 11
                        '#8b00ff', // 12
                        null,
                    ],
                    type: 'codingboxv2_set_rainbow_list',
                },
                paramsKeyMap: {
                    COLOR1: 0,
                    COLOR2: 1,
                    COLOR3: 2,
                    COLOR4: 3,
                    COLOR5: 4,
                    COLOR6: 5,
                    COLOR7: 6,
                    COLOR8: 7,
                    COLOR9: 8,
                    COLOR10: 9,
                    COLOR11: 10,
                    COLOR12: 11,
                },
                func: (sprite, script) => {
                    const colors = [];

                    for (let i = 1; i <= 12; i++) {
                        const color =
                            script.getField(`COLOR${i}`, script) || '#ff0000';

                        const r = parseInt(color.substring(1, 3), 16);
                        const g = parseInt(color.substring(3, 5), 16);
                        const b = parseInt(color.substring(5, 7), 16);

                        colors.push(`${r},${g},${b}`);
                    }

                    this.requestCommand(
                        this.functionKeys.RAINBOW_LIST,
                        colors.join('|')
                    );
                },
            },
            
            // 레인보우 LED 하나
            codingboxv2_set_rainbow_one: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_set_rainbow_one,
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 1,
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
                class: 'codingboxv2_rainbow',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        '#ff0000',
                        null,
                    ],
                    type: 'codingboxv2_set_rainbow_one',
                },
                paramsKeyMap: {
                    NUMBER: 0,
                    COLOR: 1,
                },
                func: (sprite, script) => {
                    let number = script.getNumberValue('NUMBER');
                    number = Math.max(1, Math.min(12, number));

                    const color = script.getField('COLOR', script) || '#ff0000';

                    const r = parseInt(color.substring(1, 3), 16);
                    const g = parseInt(color.substring(3, 5), 16);
                    const b = parseInt(color.substring(5, 7), 16);

                    this.requestCommand(
                        this.functionKeys.RAINBOW_ONE,
                        `${number},${r},${g},${b}`
                    );
                },
            },

            // 레인보우 LED 모두 끄기
            codingboxv2_clear_rainbow: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_clear_rainbow,
                params: [],
                events: {},
                class: 'codingboxv2_rainbow',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [],
                    type: 'codingboxv2_clear_rainbow',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.RAINBOW_CLEAR,
                        0
                    );
                },
            },

            // 와이파이 연결
            codingboxv2_wifi_connect: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_wifi_connect,
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'text',
                        value: 'WiFi',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'text',
                        value: '12345678',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_wifi',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['WiFi'],
                        },
                        {
                            type: 'text',
                            params: ['12345678'],
                        },
                        null,
                    ],
                    type: 'codingboxv2_wifi_connect',
                },
                paramsKeyMap: {
                    SSID: 0,
                    PASSWORD: 1,
                },
                func: (sprite, script) => {
                    if (!script.wifiWaitStartTime) {
                        const ssid = script.getStringValue('SSID') || '';
                        const password = script.getStringValue('PASSWORD') || '';

                        Entry.hw.portData.wifiConnecting = 1;
                        Entry.hw.portData.wifiConnected = 0;

                        this.requestCommand(
                            this.functionKeys.WIFI_CONNECT,
                            `${ssid},${password}`
                        );

                        script.wifiWaitStartTime = Date.now();

                        return script;
                    }

                    const elapsed = Date.now() - script.wifiWaitStartTime;

                    if (elapsed < 5000) {
                        return script;
                    }

                    delete script.wifiWaitStartTime;
                    return;
                },
            },
            // 와이파이 연결 끊기
            codingboxv2_wifi_disconnect: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_wifi_disconnect,
                params: [],
                events: {},
                class: 'codingboxv2_wifi',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [],
                    type: 'codingboxv2_wifi_disconnect',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.WIFI_DISCONNECT,
                        0
                    );
                },
            },

            // 와이파이 연결 상태
            codingboxv2_wifi_is_connected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_wifi',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_wifi_is_connected',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.wifiConnected == 1;
                },
            },            

            // 웹 패널 초기화
            codingboxv2_webpanel_reset: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_webpanel_reset,
                params: [],
                events: {},
                class: 'codingboxv2_webpanel',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [],
                    type: 'codingboxv2_webpanel_reset',
                },
                paramsKeyMap: {},
                func: () => {
                    this.requestCommand(
                        this.functionKeys.WEBPANEL_RESET,
                        0
                    );
                },
            },

            // 웹 패널 제목
            codingboxv2_webpanel_title: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_webpanel_title,
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'text',
                        value: 'PLAYCODING BOX V2.0 Web Panel',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                class: 'codingboxv2_webpanel',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['PLAYCODING BOX V2.0 Web Panel'],
                        },
                        null,
                    ],
                    type: 'codingboxv2_webpanel_title',
                },
                paramsKeyMap: {
                    TITLE: 0,
                },
                func: (sprite, script) => {
                    const title =
                        script.getStringValue('TITLE') || 'PLAYCODING BOX V2.0 Web Panel';

                    this.requestCommand(
                        this.functionKeys.WEBPANEL_TITLE,
                        title
                    );
                },
            },

            // 웹 패널 값 표시
            codingboxv2_webpanel_readout: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                template: Lang.template.codingboxv2_webpanel_readout,
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'text',
                        value: 'Temperature',
                    },
                    {
                        type: 'Dropdown',
                        options: this.webPanelSensorMenu,
                        value: 'temperature',
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
                class: 'codingboxv2_webpanel',
                isNotFor: ['codingboxv2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Temperature'],
                        },
                        'temperature',
                        null,
                    ],
                    type: 'codingboxv2_webpanel_readout',
                },
                paramsKeyMap: {
                    LABEL: 0,
                    SENSOR: 1,
                },
                func: (sprite, script) => {
                    const label =
                        script.getStringValue('LABEL') || '';

                    const sensor =
                        script.getField('SENSOR', script);

                    this.requestCommand(
                        this.functionKeys.WEBPANEL_READOUT,
                        `${label},${sensor}`
                    );
                },
            },

            // 웹 패널 주소
            codingboxv2_webpanel_url: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [],
                events: {},
                class: 'codingboxv2_webpanel',
                isNotFor: ['codingboxv2'],
                def: {
                    type: 'codingboxv2_webpanel_url',
                },
                paramsKeyMap: {},
                func: () => {
                    return Entry.hw.portData.webPanelUrl || '';
                },
            },

            // 블록 공간 여백
            codingboxv2_bottom_space: {
                skeleton: 'basic_text',
                color: EntryStatic.colorSet.common.TRANSPARENT,
                fontColor: 'transparent',
                template: '%1',
                params: [
                    {
                        type: 'Text',
                        text: ' ',
                        color: 'transparent',
                    },
                ],
                def: {
                    type: 'codingboxv2_bottom_space',
                },
                class: 'codingboxv2',
                isNotFor: ['codingboxv2'],
                events: {},
            },
        };
    };
})();

module.exports = Entry.CodingBoxV2;