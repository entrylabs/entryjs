'use strict';


Entry.ProboConnect = {
    afterReceive(pd) {
        if(Entry.engine.isState('run')){
            Entry.engine.fireEvent('event_remote_input');
            Entry.engine.fireEvent('event_digital_input');
        }

    },

    id: '27.1',
    name: 'ProboConnect', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://www.probo.kr/', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'ProboConnect.png', // images/hardware 폴더 내에 존재하는 이미지입니다. 엔트리 사이트에서 홍보시 사용됩니다.
    title: {
        ko: '프로보커넥트',
        en: 'ProboConnect',
    },
    Color: [
        /*레드*/ [13, 37],
        /*그린*/ [38, 62],
        /*블루*/ [63, 87],
        /*옐로우*/ [88, 112],
        /*블랙*/ [113, 137],
        /*화이트*/ [138, 162],
    ],
    
    Note:{
        n32	:	48,// = 1*3*4*4,
        n16	:	96,// = 2*3*4*4,
        n16d:	144,// = 3*3*4*4,
        n16t:	64,// = 2*2*4*4,
        n8	:	192,// = 4*3*4*4,
        n8d	:	288,// = 6*3*4*4,
        n8t	:	128,// = 4*2*4*4,
        n4	:	384,// = 8*3*4*4,
        n4d	:	576,// = 12*3*4*4,
        n4t	:	256,// = 8*2*4*4,
        n2	:	768,// = 16*3*4*4,
        n2d	:	1152,// = 24*3*4*4,
        n2t	:	512,// = 16*2*4*4,
        n1	:	1536,// = 32*3*4*4
    },

    RGB_LED:{
        red :	    1,		//RED ON
        red1: 	    2,		//RED 0.05 ON  -> OFF 반복
        red2: 	    3,		//RED 0.1  ON  -> OFF 반복
        red3: 	    4,		//RED 0.2  ON  -> OFF 반복
        red4: 	    5,		//RED 0.5  ON  -> OFF 반복
        red5: 	    6,		//RED 1    ON  -> OFF 반복
        _red1: 	    7,		//RED 0.05 OFF -> ON 반복
        _red2: 	    8,		//RED 0.1  OFF -> ON 반복
        _red3: 	    9,		//RED 0.2  OFF -> ON 반복
        _red4: 	    10,		//RED 0.5  OFF -> ON 반복
        _red5: 	    11,		//RED 1    OFF -> ON 반복
                    
        yellow: 	12,		//YELLOW ON
        yellow1: 	13,		//YELLOW 0.05 ON  -> OFF 반복
        yellow2: 	14,		//YELLOW 0.1  ON  -> OFF 반복
        yellow3: 	15,		//YELLOW 0.2  ON  -> OFF 반복
        yellow4: 	16,		//YELLOW 0.5  ON  -> OFF 반복
        yellow5: 	17,		//YELLOW 1    ON  -> OFF 반복
        _yellow1: 	18,		//YELLOW 0.05 OFF -> ON 반복
        _yellow2: 	19,		//YELLOW 0.1  OFF -> ON 반복
        _yellow3: 	20,		//YELLOW 0.2  OFF -> ON 반복
        _yellow4: 	21,		//YELLOW 0.5  OFF -> ON 반복
        _yellow5: 	22,		//YELLOW 1    OFF -> ON 반복
                    
        green :	    23,		//GREEN ON
        green1: 	24,		//GREEN 0.05 ON  -> OFF 반복
        green2: 	25,		//GREEN 0.1  ON  -> OFF 반복
        green3: 	26,		//GREEN 0.2  ON  -> OFF 반복
        green4: 	27,		//GREEN 0.5  ON  -> OFF 반복
        green5: 	28,		//GREEN 1    ON  -> OFF 반복
        _green1: 	29,		//GREEN 0.05 OFF -> ON 반복
        _green2: 	30,		//GREEN 0.1  OFF -> ON 반복
        _green3: 	31,		//GREEN 0.2  OFF -> ON 반복
        _green4: 	32,		//GREEN 0.5  OFF -> ON 반복
        _green5: 	33,		//GREEN 1    OFF -> ON 반복
                    
        cyan :	    34,		//CYAN ON
        cyan1: 	    35,		//CYAN 0.05 ON  -> OFF 반복
        cyan2: 	    36,		//CYAN 0.1  ON  -> OFF 반복
        cyan3: 	    37,		//CYAN 0.2  ON  -> OFF 반복
        cyan4: 	    38,		//CYAN 0.5  ON  -> OFF 반복
        cyan5: 	    39,		//CYAN 1    ON  -> OFF 반복
        _cyan1: 	40,		//CYAN 0.05 OFF -> ON 반복
        _cyan2: 	41,		//CYAN 0.1  OFF -> ON 반복
        _cyan3: 	42,		//CYAN 0.2  OFF -> ON 반복
        _cyan4: 	43,		//CYAN 0.5  OFF -> ON 반복
        _cyan5: 	44,		//CYAN 1    OFF -> ON 반복
                    
        blue:	    45,		//BLUE ON
        blue1: 	    46,		//BLUE 0.05 ON  -> OFF 반복
        blue2: 	    47,		//BLUE 0.1  ON  -> OFF 반복
        blue3: 	    48,		//BLUE 0.2  ON  -> OFF 반복
        blue4: 	    49,		//BLUE 0.5  ON  -> OFF 반복
        blue5: 	    50,		//BLUE 1    ON  -> OFF 반복
        _blue1: 	51,		//BLUE 0.05 OFF -> ON 반복
        _blue2: 	52,		//BLUE 0.1  OFF -> ON 반복
        _blue3: 	53,		//BLUE 0.2  OFF -> ON 반복
        _blue4: 	54,		//BLUE 0.5  OFF -> ON 반복
        _blue5: 	55,		//BLUE 1    OFF -> ON 반복
                    
        magenta: 	56,		//MAGENTA ON
        magenta1: 	57,		//MAGENTA 0.05 ON  -> OFF 반복
        magenta2: 	58,		//MAGENTA 0.1  ON  -> OFF 반복
        magenta3: 	59,		//MAGENTA 0.2  ON  -> OFF 반복
        magenta4: 	60,		//MAGENTA 0.5  ON  -> OFF 반복
        magenta5: 	61,		//MAGENTA 1    ON  -> OFF 반복
        _magenta1: 	62,		//MAGENTA 0.05 OFF -> ON 반복
        _magenta2: 	63,		//MAGENTA 0.1  OFF -> ON 반복
        _magenta3: 	64,		//MAGENTA 0.2  OFF -> ON 반복
        _magenta4: 	65,		//MAGENTA 0.5  OFF -> ON 반복
        _magenta5: 	66,		//MAGENTA 1    OFF -> ON 반복
                    
        white:	    67,		//WHITE ON
        white1: 	68,		//WHITE 0.05 ON  -> OFF 반복
        white2: 	69,		//WHITE 0.1  ON  -> OFF 반복
        white3: 	70,		//WHITE 0.2  ON  -> OFF 반복
        white4: 	71,		//WHITE 0.5  ON  -> OFF 반복
        white5: 	72,		//WHITE 1    ON  -> OFF 반복
        _white1: 	73,		//WHITE 0.05 OFF -> ON 반복
        _white2: 	74,		//WHITE 0.1  OFF -> ON 반복
        _white3: 	75,		//WHITE 0.2  OFF -> ON 반복
        _white4: 	76,		//WHITE 0.5  OFF -> ON 반복
        _white5: 	77,		//WHITE 1    OFF -> ON 반복
                    
        rgbrnd1:	78,		//RANDOM 1
        rgbrnd2:	79,		//RANDOM 2
                    
        red_d:		90,	//RED 
        yellow_d:	91,	//YELLOW 
        green_d:	92,	//GREEN
        cyan_d:		93,	//CYAN
        blue_d:		94,	//BLUE
        magenta_d:	95,	//MAGENTA
        white_d:	96,	//WHITE
                    
        rgboff:		100	//RGB LED OFF
    },

    Melody: [0, 35391, 33405, 31530, 29760, 28090, 26513, 25025, 23621, 22295, 21044, 19863, 18748],
    Melody_S: [0, 35391, 31530, 28090, 26513, 23621, 21044, 18748],

    Track:[
        [0x451F,0x3D95,0x36DD,0x33C8,0x2E22,0x291A,0x249E],// Start : size 7,
        [0x228F,0x249E,0x291A,0x2E22,0x33C8,0x36DD,0x3D95,0x451F],// End : size 8,
        [0x228F,0x1B6E,0x1711,0x1147],// LevelUp : size 4,
        [0x1147,0x1711,0x1B6E,0x228F],// LevelDwon : size 4,
    ],
    
    Infinite_Buff: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },
    Infinite_Count: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },
    Infinite_Start: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },

    SenserSet:{AA1: 0, AA2: 0, AA3: 0, AA4: 0 },

    InputData: {
        Analog: {
            AA1: 0,
            AA2: 0,
            AA3: 0,
            AA4: 0,
        },
        Digital: {
            A1: 0,
            A2: 0,
            A3: 0,
            A4: 0,
            FEA1: 0,
            FEA2: 0,
            FEA3: 0,
            FEA4: 0,
            REA1: 0,
            REA2: 0,
            REA3: 0,
            REA4: 0,
            BEA1: 0,
            BEA2: 0,
            BEA3: 0,
            BEA4: 0,
        },
        Remote: {
            R_1: 0,
            R_2: 0,
            R_3: 0,
            R_4: 0,
            R_5: 0,
            R_6: 0,
            R_7: 0,
            R_8: 0,
            R_L1: 0,
            R_L2: 0,
            R_R1: 0,
            R_R2: 0,
        },
        EEPROM: {
            EC: 0,
            EEPR2: 0,
            EEPR1: 0,
        },
        Infinite:{
            ROTATION_1:0,
            ROTATION_2:0,
            ROTATION_3:0,
            ROTATION_4:0
        },
        Acceler:{
            AXIS_X1:0,
            AXIS_X2:0,
            AXIS_X3:0,
            AXIS_X4:0,
            AXIS_Y1:0,
            AXIS_Y2:0,
            AXIS_Y3:0,
            AXIS_Y4:0,
            AXIS_Z1:0,
            AXIS_Z2:0,
            AXIS_Z3:0,
            AXIS_Z4:0,
        }
    },
    RemoteData: {
        B1: 0,
        B2: 0,
        B3: 0,
        B4: 0,
        Servo1: 0,
        Servo2: 0,
        Servo3: 0,
        Servo4: 0,
        DC1: 0,
        DC2: 0,
        DC3: 0,
        DC4: 0,
        MEL2: 0,
        MEL1: 0,
        FND: 100,
        EEPR4: 0,
        EEPR3: 0,
        EEPR2: 0,
        EEPR1: 0,
        ASET2: 0,
        ASET1: 0,
    },
    EdgeFlag: {
        FEA1: 0,
        FEA2: 0,
        FEA3: 0,
        FEA4: 0,
        REA1: 0,
        REA2: 0,
        REA3: 0,
        REA4: 0,
        BEA1: 0,
        BEA2: 0,
        BEA3: 0,
        BEA4: 0,
    },
    EEPROM: {
        EEPROM_Buff: 0,
        EEPROM_Count: 0,
    },

    setZero: function() {
        for (var key in this.EdgeFlag) this.EdgeFlag[key] = 0;
        for (var key in this.RemoteData) Entry.hw.sendQueue[key] = this.RemoteData[key];
        // for (var key in this.Infinite_Start) this.Infinite_Start[key] = 0;
        // for (var key in this.Infinite_Count) this.Infinite_Count[key] = 0;
        // for (var key in this.Infinite_Buff) this.Infinite_Buff[key] = 0;
        for (var key in this.SenserSet) this.SenserSet[key] = 0;
        Entry.hw.update();
    },
};

// 언어 적용
Entry.ProboConnect.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                connect_remote_event: '%1 리모컨 %2 키를 눌렀을 때 %3',
                connect_digital_event: '%1 디지털 입력 %2 이(가) 들어왔을 때 %3',

                connect_senser_setting: '센서 설정 A1:%1 A2:%2 A3:%3 A4:%4 %5',

                connect_remote_input: '리모컨 입력 %1',
                connect_digital_input: '디지털 센서 %1',
                connect_analog_input: '아날로그 센서 %1',
                connect_value_mapping: '%1 의 %2 ~ %3 값을 %4 ~ %5 (으)로 변환',
                //connect_ultrasonic_cm: '초음파 센서 %1 의 거리(cm)',
                connect_color_input_b: '컬러 센서 %1 이(가) %2 색 인가?',
                connect_color_input_r: '컬러 센서 %1 의 색상',
                connect_infinite_reset: '%1 센서 %2 초기화 %3',
                connect_infinite_setting: '%1 센서 %2 의 값을 %3 값으로 정하기 %4',
                connect_infinite_transform_input: '%1 센서 %2 의  %3',
                connect_infinite_mm_diameter: '%1 센서 %2 지름 %3 의 mm 값',
                connect_3axis_acceler_x: '3가속도 %1의 X축',
                connect_3axis_acceler_y: '3가속도 %1의 Y축',
                connect_3axis_acceler_z: '3가속도 %1의 Z축',
                connect_multi_sensor: '멀티키 센서 %1의 %2',
      

                connect_port_output: '출력포트 %1 을(를) %2 %3',
                connect_servo_output: '서보 모터 %1 의 위치를 %2 로 이동 %3',
                connect_s_dc_output: 'S 모터 %1 을(를) %2 속도로 회전 %3',
                connect_dc_output: 'DC 모터 %1 을(를) %2 속도로 회전 %3',
                connect_rgbled_on_output: 'RGB LED %1 을(를) %2 으로 켜기 %3',
                connect_rgbled_flashing_output: 'RGB LED %1 %2 으로 %3 초 간격 %4',
                connect_rgbled_dimming_output: 'RGB LED %1 을(를) %2 으로 디밍 %3',
                connect_rgbled_off_output: 'RGB LED %1 을(를) 끄기 %2',
                connect_mel_sec_output: '멜로디 %1 을(를) %2 초 동안 소리내기 %3',
                connect_melody_output: '멜로디 %1 을(를) 소리내기 %2',
                connect_mel_number_sec_output: '멜로디 %1 을(를) %2 초 동안 소리내기 %3',
                connect_melody_number_output: '멜로디 %1 을(를) 소리내기 %2',
                connect_melody_number_note_output: '멜로디 %1 을(를) %2음표로 소리내기 %3',
                connect_value_output: '멜로디 %1 값을 소리내기 %2',
                connect_melody_track_output: '멜로디 %1 을(를) %2초 간격으로 소리내기 %3',
                connect_melody_off: '멜로디 소리끄기 %1',
                connect_fnd_output: 'FND를 %1 (으)로 켜기 %2',
                connect_fnd_off: 'FND를 끄기 %1',

                connect_eeprom_write: 'EEPROM %1 주소에 %2 값 설정하기 %3',
                connect_eeprom_buffset: 'EEPROM %1 주소의 값 임시저장소로 호출하기 %2',
                connect_buff_read: 'EEPROM 임시저장소의 값',
            },
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                connect_remote_event: '%1 when remote control %2 key pressed %3',
                connect_digital_event: '%1 when digital input %2 is on %3',

                connect_senser_setting: 'senser setting A1:%1 A2:%2 A3:%3 A4:%4 %5',

                connect_remote_input: 'remote input %1',
                connect_digital_input: 'digital senser %1',
                connect_analog_input: 'analog senser %1',
                connect_value_mapping: '%1 to value %2 ~ %3 change %4 ~ %5',
                //connect_ultrasonic_cm: 'Distance(cm) of ultrasonic sensor %1',
                connect_color_input_b: 'is color sensor %1 to %2 ?',
                connect_color_input_r: 'color of color sensor %1',
                connect_infinite_reset: '%1 rotation sensor %2 reset %3',
                connect_infinite_setting: '%1 rotation sensor %2 setting the %3 %4',
                connect_infinite_transform_input: '%1 rotation sensor %2 to %3',
                connect_infinite_mm_diameter: 'mm value of %1 rotation sensor %2 diameter %3',
                connect_3axis_acceler_x: 'acceleration %1 of X-axis',
                connect_3axis_acceler_y: 'acceleration %1 of Y-axis',
                connect_3axis_acceler_z: 'acceleration %1 of Z-axis',
                connect_multi_sensor: 'multi sensor %1 key %2',

                connect_port_output: 'output %1 port %2 %3',
                connect_servo_output: 'move position of servo motor %1 to %2 %3',
                connect_s_dc_output: 'rotate S motor %1 at %2 speed %3',
                connect_dc_output: 'rotate dc motor %1 at %2 speed %3',
                connect_rgbled_on_output: 'RGB LED %1 at %2 on %3',
                connect_rgbled_flashing_output: 'RGB LED %1 %2 with %3 second interval %4',
                connect_rgbled_dimming_output: 'RGB LED %1 at %2 Dimming %3',
                connect_rgbled_off_output: 'RGB LED %1 off %2',
                connect_mel_sec_output: 'melody %1 sounds for %2 seconds %3',
                connect_melody_output: 'off melody sound %1',
                connect_mel_number_sec_output: 'play melody %1 sounds for %2 seconds %3',
                connect_melody_number_output: 'play the melody %1 %2',
                connect_melody_number_note_output: 'play melody %1 with %2 notes %2',
                connect_value_output: 'play the melody %1 value %2',
                connect_melody_track_output: 'play the melody %1 at intervals of %2 second %3',
                connect_melody_off: 'off melody sound %1',
                connect_fnd_output: 'FND on %1 %2',
                connect_fnd_off: 'FND off %1',
                connect_eeprom_write: 'setting the EEPROM %1 address to a value of %2 %3',
                connect_eeprom_buffset:
                    'calling the value of the EEPROM %1 address into the temporary store %2',
                connect_buff_read: 'value of EEPROM temporary store',
            },
        },
    };
};

Entry.ProboConnect.blockMenuBlocks = [
    //region proboconnect
    ////Start
    'connect_remote_event',
    'connect_digital_event',

    ////input
    'connect_senser_setting',
    'connect_remote_input',
    'connect_digital_input',
    'connect_analog_input',
    'connect_value_mapping',
    //"connect_ultrasonic_cm",
    'connect_color_input_b',
    'connect_color_input_r',
    'connect_infinite_reset',
    'connect_infinite_setting',
    'connect_infinite_transform_input',
    'connect_infinite_mm_diameter',
    'connect_3axis_acceler_x',
    'connect_3axis_acceler_y',
    'connect_3axis_acceler_z',
    'connect_multi_sensor',

    
    ////output
    'connect_port_output',
    'connect_servo_output',
    'connect_s_dc_output',
    'connect_dc_output',
    'connect_rgbled_on_output',
    'connect_rgbled_flashing_output',
    'connect_rgbled_dimming_output',
    'connect_rgbled_off_output',
    'connect_mel_sec_output',
    'connect_melody_output',
    'connect_mel_number_sec_output',
    'connect_melody_number_output',
    'connect_melody_number_note_output',
    'connect_value_output',
    'connect_melody_track_output',
    'connect_melody_off',
    'connect_fnd_output',
    'connect_fnd_off',

    //// EEPROM
    'connect_eeprom_write',
    'connect_eeprom_buffset',
    'connect_buff_read',
    //endregion proboconnect
];

// 블록 생성
Entry.ProboConnect.getBlocks = function() {
    return {
        // 리모컨 입력 이벤트
        connect_remote_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_event',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_play.svg',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['R_1', 'R_1'],
                        ['R_2', 'R_2'],
                        ['R_3', 'R_3'],
                        ['R_4', 'R_4'],
                        ['R_5', 'R_5'],
                        ['R_6', 'R_6'],
                        ['R_7', 'R_7'],
                        ['R_8', 'R_8'],
                        ['R_L1', 'R_L1'],
                        ['R_L2', 'R_L2'],
                        ['R_R1', 'R_R1'],
                        ['R_R2', 'R_R2'],
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
                params: [null,'R_1',null],
                type: 'connect_remote_event',
            },
            paramsKeyMap: {
                BUTTON: 1,
            },
            class: 'event',
            isNotFor: ['ProboConnect'],
            event: 'event_remote_input',
            func(sprite, script) {
                const btn = script.getStringField('BUTTON', script);
                if(Entry.hw.portData.InputData.Remote[btn] == 1 )
                    return script.callReturn();

                return this.die();
            },
        },
        // 디지털 입력 이벤트
        connect_digital_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_event',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_play.svg',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['A1', 'A1'],
                        ['A2', 'A2'],
                        ['A3', 'A3'],
                        ['A4', 'A4'],
                        ['FEA1', 'FEA1'],
                        ['FEA2', 'FEA2'],
                        ['FEA3', 'FEA3'],
                        ['FEA4', 'FEA4'],
                        ['REA1', 'REA1'],
                        ['REA2', 'REA2'],
                        ['REA3', 'REA3'],
                        ['REA4', 'REA4'],
                        ['BEA1', 'BEA1'],
                        ['BEA2', 'BEA2'],
                        ['BEA3', 'BEA3'],
                        ['BEA4', 'BEA4'],
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
                params: [null,'A1',null],
                type: 'connect_digital_event',
            },
            paramsKeyMap: {
                PORT: 1,
            },
            class: 'event',
            isNotFor: ['ProboConnect'],
            event: 'event_digital_input',
            func(sprite, script) {
                const port = script.getStringField('PORT', script);
                var rt = false;
                if (
                    port == 'FEA1' ||
                    port == 'FEA2' ||
                    port == 'FEA3' ||
                    port == 'FEA4' ||
                    port == 'REA1' ||
                    port == 'REA2' ||
                    port == 'REA3' ||
                    port == 'REA4' ||
                    port == 'BEA1' ||
                    port == 'BEA2' ||
                    port == 'BEA3' ||
                    port == 'BEA4'
                ) {
                    if (Entry.hw.portData.InputData.Digital[port] == 1) {
                        if (Entry.ProboConnect.EdgeFlag[port] == 0) {
                            Entry.ProboConnect.EdgeFlag[port] = 1;
                            return script.callReturn();
                        }
                    } else {
                        Entry.ProboConnect.EdgeFlag[port] = 0;
                    }
                } else if(Entry.hw.portData.InputData.Digital[port] == 1 ){
                    return script.callReturn();
                }
                return this.die();
            },
        },
        // 리모컨 입력
        connect_remote_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                    // [["key1", "value1"],
                    //  ["key2", "value2"]]
                    options: [
                        ['R_1', 'R_1'],
                        ['R_2', 'R_2'],
                        ['R_3', 'R_3'],
                        ['R_4', 'R_4'],
                        ['R_5', 'R_5'],
                        ['R_6', 'R_6'],
                        ['R_7', 'R_7'],
                        ['R_8', 'R_8'],
                        ['R_L1', 'R_L1'],
                        ['R_L2', 'R_L2'],
                        ['R_R1', 'R_R1'],
                        ['R_R2', 'R_R2'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['R_1'],
                type: 'connect_remote_input',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const btn = script.getStringField('BUTTON', script);

                return Entry.hw.portData.InputData.Remote[btn] == 1 ? true : false;
            },
        },
        // 디지털 입력
        connect_digital_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['A1', 'A1'],
                        ['A2', 'A2'],
                        ['A3', 'A3'],
                        ['A4', 'A4'],
                        ['FEA1', 'FEA1'],
                        ['FEA2', 'FEA2'],
                        ['FEA3', 'FEA3'],
                        ['FEA4', 'FEA4'],
                        ['REA1', 'REA1'],
                        ['REA2', 'REA2'],
                        ['REA3', 'REA3'],
                        ['REA4', 'REA4'],
                        ['BEA1', 'BEA1'],
                        ['BEA2', 'BEA2'],
                        ['BEA3', 'BEA3'],
                        ['BEA4', 'BEA4'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['A1'],
                type: 'connect_digital_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var rt = false;

                if (
                    port == 'FEA1' ||
                    port == 'FEA2' ||
                    port == 'FEA3' ||
                    port == 'FEA4' ||
                    port == 'REA1' ||
                    port == 'REA2' ||
                    port == 'REA3' ||
                    port == 'REA4' ||
                    port == 'BEA1' ||
                    port == 'BEA2' ||
                    port == 'BEA3' ||
                    port == 'BEA4'
                ) {
                    if (Entry.hw.portData.InputData.Digital[port] == 1) {
                        if (Entry.ProboConnect.EdgeFlag[port] == 0) {
                            Entry.ProboConnect.EdgeFlag[port] = 1;
                            rt = true;
                        }
                    } else {
                        Entry.ProboConnect.EdgeFlag[port] = 0;
                    }
                } else rt = Entry.hw.portData.InputData.Digital[port] == 1 ? true : false;

                return rt;
            },
        },
        // 아날로그 입력
        connect_analog_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                    // [["key1", "value1"],
                    //  ["key2", "value2"]]
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [
                    // Dropdown 값의 경우 Value를 세팅하면 초기값이 처리 됩니다.
                    'AA1',
                ],
                type: 'connect_analog_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);

                // Port 라는 key값을 가진 정보를 읽는다.
                var value = 0;

                if(Entry.ProboConnect.SenserSet[port]==5)
                    value = 255 - Entry.hw.portData.InputData.Analog[port];
                else
                    value = Entry.hw.portData.InputData.Analog[port];

                return value;
            },
        },
        // 아날로그 입력 값 맵핑 블럭
        connect_value_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
            ],
            def: {
                params: [
                    // Dropdown 값의 경우 Value를 세팅하면 초기값이 처리 됩니다.
                    '0',
                    '0',
                    '0',
                    '0',
                    '0',
                ],
                type: 'connect_value_mapping',
            },
            paramsKeyMap: {
                DATA: 0,
                SOURCE1: 1,
                SOURCE2: 2,
                TARGET1: 3,
                TARGET2: 4,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const data = script.getNumberValue('DATA', script);
                const source1 = script.getNumberValue('SOURCE1', script);
                const source2 = script.getNumberValue('SOURCE2', script);
                const target1 = script.getNumberValue('TARGET1', script);
                const target2 = script.getNumberValue('TARGET2', script);

                var value = 0;
                var rate = (data - source1) / (source2 - source1);
                var num = 0;

                if (target1 < target2) {
                    value = (target2 - target1) * rate;

                    num = value % 1;

                    if (num < 0.5) value -= num;
                    else value += 1 - num;

                    value = target1 + value;

                    if (value < target1) value = target1;
                    else if (value > target2) value = target2;
                } else {
                    value = (target1 - target2) * rate;

                    num = value % 1;

                    if (num < 0.5) value -= num;
                    else value += 1 - num;

                    value = target1 - value;

                    if (value > target1) value = target1;
                    else if (value < target2) value = target2;
                }

                return value;
            },
        },
        // 컬러센서 bool
        connect_color_input_b: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', '0'],
                        ['초록', '1'],
                        ['파랑', '2'],
                        ['노랑', '3'],
                        ['검정', '4'],
                        ['하양', '5'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1', '0'],
                type: 'connect_color_input_b',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const target = script.getNumberField('COLOR', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                var color = Entry.ProboConnect.Color;

                return color[target][0] <= value && value <= color[target][1];
            },
        },
        // 컬러센서 value
        connect_color_input_r: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1'],
                type: 'connect_color_input_r',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                var color = Entry.ProboConnect.Color;

                for (var i = 0; i < 6; i++) {
                    if (color[i][0] <= value && value <= color[i][1]) {
                        switch (i) {
                            case 0:
                                return '빨강';
                            case 1:
                                return '초록';
                            case 2:
                                return '파랑';
                            case 3:
                                return '노랑';
                            case 4:
                                return '검정';
                            case 5:
                                return '하양';
                        }
                    }
                }
                return 0;
            },
        },
        // 무한회전 센서 값 초기화
        connect_infinite_reset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['무한회전', '0'], ['나침반', '1']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
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
            def: {
                params: [0,'AA1', null],
                type: 'connect_infinite_reset',
            },
            paramsKeyMap: {
                PORT: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                Entry.ProboConnect.Infinite_Start[port] = value;
                Entry.ProboConnect.Infinite_Buff[port] = value;
                Entry.ProboConnect.Infinite_Count[port] = 0;
            },
        },
        // 무한회전 센서 값 설정
        connect_infinite_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['무한회전', '0'], ['나침반', '1']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
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
                }
            ],
            def: {
                params: [0, 'AA1', '0', null],
                type: 'connect_infinite_setting',
            },
            paramsKeyMap: {
                NAME: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var count = 0;
                // console.log("Start",Entry.ProboConnect.Infinite_Start[port]);
                // console.log("Buff",Entry.ProboConnect.Infinite_Buff[port]);
                // console.log("Count",Entry.ProboConnect.Infinite_Count[port]);
                
                if (value!=0){
                    count = Number(value / 255).toFixed(0);
                    value = value % 255;
                }else{
                    value = 0;
                    count = 0;
                }
                console.log("count",count);
                console.log("value",value);
                console.log("Infinite_Buff",Entry.ProboConnect.Infinite_Buff[port]);

                
                Entry.ProboConnect.Infinite_Buff[port] = Entry.hw.portData.InputData.Analog[port];
                Entry.ProboConnect.Infinite_Start[port] = Entry.hw.portData.InputData.Analog[port]-value;
                Entry.ProboConnect.Infinite_Count[port] = count;

                console.log("Infinite_Start",Entry.ProboConnect.Infinite_Start[port]);
                console.log("Infinite_Buff",Entry.ProboConnect.Infinite_Buff[port]);
                console.log("Infinite_Count",Entry.ProboConnect.Infinite_Count[port]);

            },
        },
        // 무한회전 센서
        connect_infinite_transform_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['무한회전', '0'], ['나침반', '1']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['값', '1'], ['각도', '2'], ['회전 수', '3'], ['절대각도', '4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [0,'AA1', '1'],
                type: 'connect_infinite_transform_input',
            },
            paramsKeyMap: {
                PORT: 1,
                SELECT: 2,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = Entry.hw.portData.InputData.Analog[port];
                const select = script.getNumberField('SELECT', script);

                if (value < (Entry.ProboConnect.Infinite_Buff[port] - 150))
                    Entry.ProboConnect.Infinite_Count[port]++;
                else if (value > (Entry.ProboConnect.Infinite_Buff[port] + 150))
                    Entry.ProboConnect.Infinite_Count[port]--;

                Entry.ProboConnect.Infinite_Buff[port] = value;

                console.log("-Infinite_Start",Entry.ProboConnect.Infinite_Start[port]);
                console.log("-Infinite_Buff",Entry.ProboConnect.Infinite_Buff[port]);
                console.log("-Infinite_Count",Entry.ProboConnect.Infinite_Count[port]);

                value = (Entry.ProboConnect.Infinite_Buff[port] - Entry.ProboConnect.Infinite_Start[port]) + (Entry.ProboConnect.Infinite_Count[port] * 255);
                
                switch (select) {
                    case 2:
                        if(value > 0)
                            return Math.floor((value%255) * 1.41732);
                        else
                            return Math.ceil((value%255) * 1.41732);
                    case 3:
                        if(value > 0)
                            return Math.floor(value / 255);
                        else
                            return Math.ceil(value / 255);
                    case 4:
                        return Number((360/255) * Entry.hw.portData.InputData.Analog[port]).toFixed(0);
                    default:
                        return value;
                }
            },
        },
        // 무한회전 센서 지름 설정
        connect_infinite_mm_diameter: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['무한회전', '0'], ['나침반', '1']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [0,'AA1', 53.5],
                type: 'connect_infinite_mm_diameter',
            },
            paramsKeyMap: {
                PORT: 1,
                DIAMETER: 2,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = Entry.hw.portData.InputData.Analog[port];
                const diameter = script.getNumberValue('DIAMETER', script);

                if (value < Entry.ProboConnect.Infinite_Buff[port] - 150)
                    Entry.ProboConnect.Infinite_Count[port]++;
                else if (value > Entry.ProboConnect.Infinite_Buff[port] + 150)
                    Entry.ProboConnect.Infinite_Count[port]--;

                Entry.ProboConnect.Infinite_Buff[port] = value;

                value = (Entry.ProboConnect.Infinite_Buff[port] - Entry.ProboConnect.Infinite_Start[port]) + (Entry.ProboConnect.Infinite_Count[port] * 255);

                return Number(
                    2 *
                    3.141592 *
                    (diameter / 2) /
                    255 *
                    value
                ).toFixed(3);
            },
        },
        // 3가속도 X
        connect_3axis_acceler_x: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AXIS_X1'], ['AA2', 'AXIS_X2'], ['AA3', 'AXIS_X3'], ['AA4', 'AXIS_X4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [
                    'AXIS_X1',
                ],
                type: 'connect_3axis_acceler_x',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = (Entry.hw.portData.InputData.Acceler[port])
                if(value & 0x80) value = (value - 255);
                return Number(value / 10).toFixed(1);
            },
        },
        // 3가속도 Y
        connect_3axis_acceler_y: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AXIS_Y1'], ['AA2', 'AXIS_Y2'], ['AA3', 'AXIS_Y3'], ['AA4', 'AXIS_Y4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [
                    'AXIS_Y1',
                ],
                type: 'connect_3axis_acceler_y',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = (Entry.hw.portData.InputData.Acceler[port])
                if(value & 0x80) value = (value - 255);
                return Number(value / 10).toFixed(1);
            },
        },
        // 3가속도 Z
        connect_3axis_acceler_z: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AXIS_Z1'], ['AA2', 'AXIS_Z2'], ['AA3', 'AXIS_Z3'], ['AA4', 'AXIS_Z4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [
                    'AXIS_Z1',
                ],
                type: 'connect_3axis_acceler_z',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var value = (Entry.hw.portData.InputData.Acceler[port])
                if(value & 0x80) value = (value - 255);
                return Number(value / 10).toFixed(1);
            },
        },
        // 멀티키 센서
        connect_multi_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['키1', 0],
                        ['키2', 1],
                        ['키3', 2],
                        ['키4', 3],
                        ['키5', 4],
                        ['키6', 5],
                        ['키7', 6],
                        ['키8', 7],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1', '0'],
                type: 'connect_multi_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
                KEY: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const key = script.getNumberField('KEY', script);
                const value = Entry.hw.portData.InputData.Analog[port] & (0x1<<key)? 1: 0;
                return value;
            },
        },

        //=========================================================================================================
        //============================================ output =====================================================
        //=========================================================================================================
        connect_senser_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'], ['적외선', '2'], ['자석', '3'], ['초음파', '4'], ['회전', '5'], ['조도', '6'], ['온도', '7'], ['소리', '8'], ['기울기', '9'],
                        ['압력', '10'], ['심박', '11'], ['컬러', '12'], ['가속도', '13'], ['멀티키', '14'], ['나침반', '15'], ['3가속', '16'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'], ['적외선', '2'], ['자석', '3'], ['초음파', '4'], ['회전', '5'], ['조도', '6'], ['온도', '7'], ['소리', '8'], ['기울기', '9'],
                        ['압력', '10'], ['심박', '11'], ['컬러', '12'], ['가속도', '13'], ['멀티키', '14'], ['나침반', '15'], ['3가속', '16'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'], ['적외선', '2'], ['자석', '3'], ['초음파', '4'], ['회전', '5'], ['조도', '6'], ['온도', '7'], ['소리', '8'], ['기울기', '9'],
                        ['압력', '10'], ['심박', '11'], ['컬러', '12'], ['가속도', '13'], ['멀티키', '14'], ['나침반', '15'], ['3가속', '16'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'], ['적외선', '2'], ['자석', '3'], ['초음파', '4'], ['회전', '5'], ['조도', '6'], ['온도', '7'], ['소리', '8'], ['기울기', '9'],
                        ['압력', '10'], ['심박', '11'], ['컬러', '12'], ['가속도', '13'], ['멀티키', '14'], ['나침반', '15'], ['3가속', '16'],
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
            def: {
                params: ['1', '1', '1', '1', null],
                type: 'connect_senser_setting',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                PORT4: 3,
            },
            class: 'setting',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    var Aset = [0, 0, 0, 0];
                    var value = [0, 0, 0, 0];
                    Aset[0] = script.getNumberField('PORT1', script);
                    Aset[1] = script.getNumberField('PORT2', script);
                    Aset[2] = script.getNumberField('PORT3', script);
                    Aset[3] = script.getNumberField('PORT4', script);

                    for (var i = 0; i < 4; i++) {
                        switch (Aset[i]) {
                            case 1:
                            case 2:
                            case 3:
                                value[i] = 1;
                                break;
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                value[i] = 2;
                                break;
                            case 8:
                                value[i] = 3;
                                break;
                            case 9:
                                value[i] = 4;
                                break;
                            case 10:
                                value[i] = 5;
                                break;
                            case 11:
                                value[i] = 6;
                                break;
                            case 12:
                                value[i] = 7;
                                break;
                            case 13:
                                value[i] = 8;
                                break;
                            case 14:
                                value[i] = 11;
                                break;
                            case 16:
                            case 15:
                                value[i] = 9;
                                break;
                        }
                    }

                    Entry.ProboConnect.SenserSet.AA1 = value[0];
                    Entry.ProboConnect.SenserSet.AA2 = value[1];
                    Entry.ProboConnect.SenserSet.AA3 = value[2];
                    Entry.ProboConnect.SenserSet.AA4 = value[3];

                    Entry.hw.sendQueue['ASET2'] = (value[0] << 4) | value[1];
                    Entry.hw.sendQueue['ASET1'] = (value[2] << 4) | value[3];

                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 200; // 0.2초

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
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
        },
        connect_port_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'B1'], ['B2', 'B2'], ['B3', 'B3'], ['B4', 'B4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['on', 1], ['off', 0]],
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
            def: {
                params: ['B1', 1, null],
                type: 'connect_port_output',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const motor = script.getStringField('PORT', script);
                const value = script.getNumberField('VALUE', script);

                Entry.hw.sendQueue[motor] = value;
            },
        },
        connect_servo_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['B1', 'Servo1'],
                        ['B2', 'Servo2'],
                        ['B3', 'Servo3'],
                        ['B4', 'Servo4'],
                    ],
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
            def: {
                params: ['Servo1', { type: 'number', params: ['1'] }, null],
                type: 'connect_servo_output',
            },
            paramsKeyMap: {
                SERVO: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                // const servo = script.getStringField('SERVO', script);
                // const value = script.getNumberValue('VALUE', script) | 0x80;

                const servo = script.getStringField('SERVO', script);
                const value = script.getNumberValue('VALUE', script);
                if(value<1) value=0;
                else if (value>100) value = 100;

                Entry.hw.sendQueue[servo] = value;
            },
        },
        connect_dc_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['M1', 'DC1'], ['M2', 'DC2'], ['M3', 'DC3'], ['M4', 'DC4'], ['M1,M2', 'DC5'], ['M3,M4', 'DC6'], ['ALL', 'DC7']],
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
            def: {
                params: ['DC1', { type: 'number', params: ['0'] }, null],
                type: 'connect_dc_output',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const motor = script.getStringField('MOTOR', script);
                const value = script.getNumberValue('VALUE', script);
                if(motor=='DC5'){
                    Entry.hw.sendQueue['DC1'] = value;
                    Entry.hw.sendQueue['DC2'] = value;
                }else if(motor=='DC6'){
                    Entry.hw.sendQueue['DC3'] = value;
                    Entry.hw.sendQueue['DC4'] = value;
                }else if(motor=='DC7'){
                    Entry.hw.sendQueue['DC1'] = value;
                    Entry.hw.sendQueue['DC2'] = value;
                    Entry.hw.sendQueue['DC3'] = value;
                    Entry.hw.sendQueue['DC4'] = value;
                }else{
                    Entry.hw.sendQueue[motor] = value;
                }
            },
        },
        connect_s_dc_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['S1', 'Servo1'], ['S2', 'Servo2'], ['S3', 'Servo3'], ['S4', 'Servo4']],
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
            def: {
                params: ['Servo1', { type: 'number', params: ['0'] }, null],
                type: 'connect_s_dc_output',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const motor = script.getStringField('MOTOR', script);
                var value = script.getNumberValue('VALUE', script);

                if(value > 20) value = 20;
                else if(value < -20) value = -20;
                value += 148;

                console.log(value);

                if(motor=='Servo5'){
                    Entry.hw.sendQueue['Servo1'] = value;
                    Entry.hw.sendQueue['Servo2'] = value;
                }else if(motor=='Servo6'){
                    Entry.hw.sendQueue['Servo3'] = value;
                    Entry.hw.sendQueue['Servo4'] = value;
                }else{
                    Entry.hw.sendQueue[motor] = value;
                }
            },
        },
        connect_rgbled_on_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'Servo1'], ['B2', 'Servo2'], ['B3', 'Servo3'], ['B4', 'Servo4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [                  
                    ['빨강', '1'],
                    ['노랑', '12'],
                    ['초록', '23'],
                    ['청록', '34'],
                    ['파랑', '45'],
                    ['자홍', '56'],
                    ['하양', '67'],],
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
            def: {
                params: ['Servo1', '1', null],
                type: 'connect_rgbled_on_output',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const color = script.getNumberValue('COLOR', script);
                console.log(port);
                console.log(color);
                Entry.hw.sendQueue[port] = color;
            },
        },
        connect_rgbled_flashing_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'Servo1'], ['B2', 'Servo2'], ['B3', 'Servo3'], ['B4', 'Servo4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [                  
                        ['빨강', '1'],
                        ['노랑', '12'],
                        ['초록', '23'],
                        ['청록', '34'],
                        ['파랑', '45'],
                        ['자홍', '56'],
                        ['하양', '67'],],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [                  
                        ['0.05', '1'],
                        ['0.1', '2'],
                        ['0.2', '3'],
                        ['0.5', '4'],
                        ['1', '5'],],
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
            def: {
                params: ['Servo1', '1', '3', null],
                type: 'connect_rgbled_flashing_output',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
                SEC: 2,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const color = script.getNumberValue('COLOR', script);
                const sec = script.getNumberField('SEC', script);
                const value = color+sec;
                console.log("color",color);
                console.log("sec",sec);
                console.log("color+sec",value);

                Entry.hw.sendQueue[port] = value;
                
            },
        },
        connect_rgbled_dimming_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'Servo1'], ['B2', 'Servo2'], ['B3', 'Servo3'], ['B4', 'Servo4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [                  
                        ['빨강', '90'],
                        ['노랑', '91'],
                        ['초록', '92'],
                        ['청록', '93'],
                        ['파랑', '94'],
                        ['자홍', '95'],
                        ['하양', '96'],],
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
            def: {
                params: ['Servo1', '90', null],
                type: 'connect_rgbled_dimming_output',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const color = script.getNumberValue('COLOR', script);
                Entry.hw.sendQueue[port] = color;
            },
        },
        connect_rgbled_off_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'Servo1'], ['B2', 'Servo2'], ['B3', 'Servo3'], ['B4', 'Servo4']],
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
            def: {
                params: ['Servo1', null],
                type: 'connect_rgbled_off_output',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const color = script.getNumberValue('COLOR', script);
                Entry.hw.sendQueue[port] = color;
            },
        },
        connect_mel_sec_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['[1]도', 1],
                        ['[1]레', 3],
                        ['[1]미', 5],
                        ['[1]파', 6],
                        ['[1]솔', 8],
                        ['[1]라', 10],
                        ['[1]시', 12],
                        ['[2]도', 13],
                        ['[2]레', 15],
                        ['[2]미', 17],
                        ['[2]파', 18],
                        ['[2]솔', 20],
                        ['[2]라', 22],
                        ['[2]시', 24],
                        ['[3]도', 25],
                        ['[3]레', 27],
                        ['[3]미', 29],
                        ['[3]파', 30],
                        ['[3]솔', 32],
                        ['[3]라', 34],
                        ['[3]시', 36],
                        ['[4]도', 37],
                        ['[4]레', 39],
                        ['[4]미', 41],
                        ['[4]파', 42],
                        ['[4]솔', 44],
                        ['[4]라', 46],
                        ['[4]시', 48],
                    ],
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
            def: {
                params: [1, { type: 'number', params: ['1'] }, null],
                type: 'connect_mel_sec_output',
            },
            paramsKeyMap: {
                MELODY: 0,
                SEC: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const mel = script.getNumberField('MELODY', script);
                    var timeValue = script.getNumberValue('SEC', script);
                    var melody = 0;

                    if (mel > 0 && mel < 13) melody = Entry.ProboConnect.Melody[mel];
                    else if (mel < 25) melody = Entry.ProboConnect.Melody[mel - 12] / 2;
                    else if (mel < 37) melody = Entry.ProboConnect.Melody[mel - 24] / 4;
                    else if (mel < 49) melody = Entry.ProboConnect.Melody[mel - 36] / 8;

                    Entry.hw.sendQueue['MEL2'] = melody >> 8;
                    Entry.hw.sendQueue['MEL1'] = melody;

                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue['MEL2'] = 0;
                    Entry.hw.sendQueue['MEL1'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_melody_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['[1]도', 1],
                        ['[1]레', 3],
                        ['[1]미', 5],
                        ['[1]파', 6],
                        ['[1]솔', 8],
                        ['[1]라', 10],
                        ['[1]시', 12],
                        ['[2]도', 13],
                        ['[2]레', 15],
                        ['[2]미', 17],
                        ['[2]파', 18],
                        ['[2]솔', 20],
                        ['[2]라', 22],
                        ['[2]시', 24],
                        ['[3]도', 25],
                        ['[3]레', 27],
                        ['[3]미', 29],
                        ['[3]파', 30],
                        ['[3]솔', 32],
                        ['[3]라', 34],
                        ['[3]시', 36],
                        ['[4]도', 37],
                        ['[4]레', 39],
                        ['[4]미', 41],
                        ['[4]파', 42],
                        ['[4]솔', 44],
                        ['[4]라', 46],
                        ['[4]시', 48],
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
            def: {
                params: [1, null],
                type: 'connect_melody_output',
            },
            paramsKeyMap: {
                MELODY: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const mel = script.getNumberField('MELODY', script);
                var melody = 0;

                if (mel > 0 && mel < 13) melody = Entry.ProboConnect.Melody[mel];
                else if (mel < 25) melody = Entry.ProboConnect.Melody[mel - 12] / 2;
                else if (mel < 37) melody = Entry.ProboConnect.Melody[mel - 24] / 4;
                else if (mel < 49) melody = Entry.ProboConnect.Melody[mel - 36] / 8;
                
                Entry.hw.sendQueue['MEL2'] = melody >> 8;
                Entry.hw.sendQueue['MEL1'] = melody;
            },
        },
        connect_mel_number_sec_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    { type: 'number', params: ['1'] }, 
                    { type: 'number', params: ['1'] },
                     null],
                type: 'connect_mel_number_sec_output',
            },
            paramsKeyMap: {
                MELODY: 0,
                SEC: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const mel = script.getNumberValue('MELODY', script);
                    var timeValue = script.getNumberValue('SEC', script);
                    var melody = 0;

                    if (mel > 0 && mel < 8) melody = Entry.ProboConnect.Melody_S[mel];
                    else if (mel < 15) melody = Entry.ProboConnect.Melody_S[mel - 7] / 2;
                    else if (mel < 22) melody = Entry.ProboConnect.Melody_S[mel - 14] / 4;
                    else if (mel < 29) melody = Entry.ProboConnect.Melody_S[mel - 21] / 8;
                    else melody = 0;
    
                    Entry.hw.sendQueue['MEL2'] = melody >> 8;
                    Entry.hw.sendQueue['MEL1'] = melody;

                    console.log(melody);
                    console.log(timeValue);

                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue['MEL2'] = 0;
                    Entry.hw.sendQueue['MEL1'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_melody_number_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: [{ type: 'number', params: ['1'] }, null],
                type: 'connect_melody_number_output',
            },
            paramsKeyMap: {
                MELODY: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const mel = script.getNumberValue('MELODY', script);

                if (mel > 0 && mel < 8) melody = Entry.ProboConnect.Melody_S[mel];
                else if (mel < 15) melody = Entry.ProboConnect.Melody_S[mel - 7] / 2;
                else if (mel < 22) melody = Entry.ProboConnect.Melody_S[mel - 14] / 4;
                else if (mel < 29) melody = Entry.ProboConnect.Melody_S[mel - 21] / 8;
                else melody = 0;

                Entry.hw.sendQueue['MEL2'] = melody >> 8;
                Entry.hw.sendQueue['MEL1'] = melody;
            },
        },
        connect_melody_number_note_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['온', 'n1'],
                        ['2분','n2'],
                        ['4분','n4'],
                        ['8분','n8'],
                        ['16분','n16'],
                        ['32분','n32'],
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
            def: {
                params: [{ type: 'number', params: ['1'] }, 'n1', null],
                type: 'connect_melody_number_note_output',
            },
            paramsKeyMap: {
                MELODY: 0,
                NOTE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var mel = script.getNumberValue('MELODY', script);
                    const note = script.getStringField('NOTE', script);
                    var timeValue = Entry.ProboConnect.Note[note];
                    var melody = 0;

                    if (mel > 0 && mel < 8) melody = Entry.ProboConnect.Melody_S[mel];
                    else if (mel < 15) melody = Entry.ProboConnect.Melody_S[mel - 7] / 2;
                    else if (mel < 22) melody = Entry.ProboConnect.Melody_S[mel - 14] / 4;
                    else if (mel < 29) melody = Entry.ProboConnect.Melody_S[mel - 21] / 8;
                    else melody = 0;

                    Entry.hw.sendQueue['MEL2'] = melody >> 8;
                    Entry.hw.sendQueue['MEL1'] = melody;

                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue['MEL2'] = 0;
                    Entry.hw.sendQueue['MEL1'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_value_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: [35391, null],
                type: 'connect_value_output',
            },
            paramsKeyMap: {
                MELODY: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                var melody = script.getNumberValue('MELODY', script);

                Entry.hw.sendQueue['MEL2'] = (melody >> 8) & 0xff;
                Entry.hw.sendQueue['MEL1'] = melody & 0xff;
            },
        },
        connect_melody_track_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [                  
                    ['시작음', 0],
                    ['종료음', 1],
                    ['레벨업', 2],
                    ['레벨다운', 3]],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [                  
                    ['0.1', 100],
                    ['0.3', 300],
                    ['0.5', 500],
                    ['0.7', 700],
                    ['1', 1000],
                    ['2', 2000]],
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
            def: {
                params: [0, 1000, null],
                type: 'connect_melody_track_output',
            },
            paramsKeyMap: {
                MELODY: 0,
                SEC: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                function getTrackStep(track,script){
                    if(!script.isStart){
                        script.isStart = true;
                        script.trackStep = 0;
                    }
                    else
                        script.trackStep++;

                    var timeValue = script.getNumberValue('SEC', script);

                    script.timeFlag = 1;
                    var melody = Entry.ProboConnect.Track[track][script.trackStep];
                    Entry.hw.sendQueue['MEL2'] = (melody >> 8) & 0xff;
                    Entry.hw.sendQueue['MEL1'] = melody & 0xff;

                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * timeValue;

                    Entry.TimeWaitManager.add(
                        script.block.id,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                }

                const TR = script.getNumberValue('MELODY', script);
                if (!script.isStart) {
                    switch(TR){
                        case 0 :
                            script.maxStep = 6;
                            break;
                        case 1 :
                            script.maxStep = 7;
                            break;
                        case 2 :
                            script.maxStep = 3;
                            break;
                        case 3 :
                            script.maxStep = 3;
                            break;
                    }
                    getTrackStep(TR,script);
                    return script;
                } else if (script.timeFlag == 1) {
                    console.log('timeFlag',script.timeFlag);
                    return script;
                } else if (script.trackStep < script.maxStep){
                    getTrackStep(TR,script);
                    return script;
                } else {

                    Entry.hw.sendQueue['MEL2'] = 0;
                    Entry.hw.sendQueue['MEL1'] = 0;

                    delete script.trackStep;
                    delete script.maxStep;
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
     
        connect_melody_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'connect_melody_off',
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['MEL2'] = 0;
                Entry.hw.sendQueue['MEL1'] = 0;
            },
        },
        connect_fnd_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: ['0', null],
                type: 'connect_fnd_output',
            },
            paramsKeyMap: {
                FND: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const fnd = script.getNumberValue('FND', script);
                Entry.hw.sendQueue['FND'] = fnd;
            },
        },
        connect_fnd_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'connect_fnd_off',
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['FND'] = 100;
            },
        },

        //============================================ EEPROM =====================================================
        connect_eeprom_buffset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: [{ type: 'number', params: ['0'] }, null],
                type: 'connect_eeprom_buffset',
            },
            paramsKeyMap: {
                ADDRESS: 0,
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const address = script.getNumberValue('ADDRESS', script);
                if (!script.isStart) {
                    Entry.ProboConnect.EEPROM.EEPROM_Count = Entry.hw.portData.InputData.EEPROM.EC;
                    Entry.hw.sendQueue['EEPR4'] = 0x40;
                    Entry.hw.sendQueue['EEPR3'] = address;

                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 0.05;
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.ProboConnect.EEPROM.EEPROM_Buff =
                        (Entry.hw.portData.InputData.EEPROM.EEPR2 << 8) +
                        Entry.hw.portData.InputData.EEPROM.EEPR1;
                    Entry.hw.sendQueue['EEPR4'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_buff_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            def: {
                type: 'connect_buff_read',
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                var value = 0;
                const count = Entry.ProboConnect.EEPROM.EEPROM_Count;
                if (Entry.hw.portData.InputData.EEPROM.EC != count) {
                    value = Entry.ProboConnect.EEPROM.EEPROM_Buff;
                }
                return value;
            },
        },
        connect_eeprom_write: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    null,
                ],
                type: 'connect_eeprom_write',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                VALUE: 1,
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const address = script.getNumberValue('ADDRESS', script);
                const value = script.getNumberValue('VALUE', script);
                if (!script.isStart) {
                    Entry.hw.sendQueue['EEPR4'] = 0x80;
                    Entry.hw.sendQueue['EEPR3'] = address;
                    Entry.hw.sendQueue['EEPR2'] = value >> 8;
                    Entry.hw.sendQueue['EEPR1'] = value & 0xff;

                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 0.05;
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

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
        },
    };
};

module.exports = Entry.ProboConnect;
