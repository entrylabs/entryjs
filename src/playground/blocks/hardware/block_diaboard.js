'use strict';

const PromiseManager = require('../../../core/promiseManager');

Entry.Diaboard = {
    // g:T:F:9:7:2:120:1:200
    // g : L버튼상태 : R버튼상태 : 9컬러센서 : 색상 : 2 IR센서: IR값 : 1빛센서 : 조도값
    // 프로토콜 인자값 : 표준 주파수
    STANDARD_FREQ: {	
        0:	32.7031875,
        1:	34.64784375,
        2:	36.70809375,
        3:	38.890875,
        4:	41.2034375,
        5:	43.6535,
        6:	46.2493125,
        7:	48.9994375,
        8:	51.9130625,
        9:	55,
        10:	58.2705,
        11:	61.7354375,
        12:	65.406375,
        13:	69.2956875,
        14:	73.4161875,
        15:	77.78175,
        16:	82.406875,
        17:	87.307,
        18:	92.498625,
        19:	97.998875,
        20:	103.826125,
        21:	110,
        22:	116.541,
        23:	123.470875,
        24:	130.81275,
        25:	138.591375,
        26:	146.832375,
        27:	155.5635,
        28:	164.81375,
        29:	174.614,
        30:	184.99725,
        31:	195.99775,
        32:	207.65225,
        33:	220,
        34:	233.082,
        35:	246.94175,
        36:	261.6255,
        37:	277.18275,
        38:	293.66475,
        39:	311.127,
        40:	329.6275,
        41:	349.228,
        42:	369.9945,
        43:	391.9955,
        44:	415.3045,
        45:	440,
        46:	466.164,
        47:	493.8835,
        48:	523.251,
        49:	554.3655,
        50:	587.3295,
        51:	622.254,
        52:	659.255,
        53:	698.456,
        54:	739.989,
        55:	783.991,
        56:	830.609,
        57:	880,
        58:	932.328,
        59:	987.767,
        60:	1046.502,
        61:	1108.731,
        62:	1174.659,
        63:	1244.508,
        64:	1318.51,
        65:	1397,
        66:	1479.978,
        67:	1567.982,
        68:	1661.218,
        69:	1760,
        70:	1864.656,
        71:	1975.534,
        72:	2093.004,
        73:	2217.462,
        74:	2349.318,
        75:	2489.016,
        76:	2637.02,
        77:	2794,
        78:	2959.956,
        79:	3135.964,
        80:	3322.436,
        81:	3520,
        82:	3729.312,
        83:	3951.068,
        84:	4186.008,
        85:	4434.924,
        86:	4698.636,
        87:	4978.032,
        88:	5274.04,
        89:	5588,
        90:	5919.912,
        91:	6271.928,
        92:	6644.872,
        93:	7040,
        94:	7458.624,
        95:	7902.136
    },

    COLOR_TYPE: {
        0: 'no_color',
        1: 'red',
        2: 'yellow',
        3: 'green',
        4: 'cyan',
        5: 'blue',
        6: 'magenta',
        7: 'white',
    },

    EFFECT_TYPE: {
        0: 'f',     // effect_flame
        1: 'd',     // effect_drop
        2: 'g',     // effect_glitter
        3: 'm',     // effect_dimming
    },

    INEQ_SIGN : [
        ["<", "<"],
        [">", ">"],
        ["=", "="]
    ],

    OCTAVE_TYPE : [
        ["1", 1],
        ["2", 2],
        ["3", 3],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7]
    ],

    RHYTHM_TYPE : [
        ["0.125", 0.125],
        ["0.25",  0.25],
        ["0.5",   0.5],
        ["1",     1],
        ["2",     2],
        ["4",     4],
        ["8",     8],
        ["16",    16]
    ],

    MELODY_TYPE: {
        //상승음
        0: {
            gap: 120,
            commands : [ "b:n:48:20", "b:n:50:20", "b:n:57:20", "b:n:55:20", "b:n:53:20", "b:n:52:20", "b:n:59:20", "b:n:60:20" ]
        },
        // 하강음
        1: {
            gap : 120,
            commands : [ "b:n:60:10", "b:n:60:10", "b:n:55:10", "b:n:55:10", "b:n:52:10", "b:n:52:10", "b:n:48:10", "b:n:48:10" ]
        },
        // 엘리제를 위하여 (이것만 총 9개의 음입니다.)
        2: {
            gap : 150,
            commands : [ "b:n:64:20", "b:n:63:20", "b:n:64:20", "b:n:63:20", "b:n:64:20", "b:n:59:20", "b:n:62:20", "b:n:60:20", "b:n:57:20" ]
        },
        // 긴장감
        3: { 
            gap : 150,
            commands : [ "b:n:69:20", "b:n:60:20", "b:n:69:20", "b:n:64:20", "b:n:69:20", "b:n:62:20", "b:n:69:20", "b:n:65:20",
                         "b:n:69:20", "b:n:60:20", "b:n:69:20", "b:n:64:20", "b:n:69:20", "b:n:62:20", "b:n:69:20", "b:n:65:20" ]
        },
        // 연결음
        4: { 
            gap : 150,
            commands : [ "b:n:67:20", "b:n:65:20", "b:n:67:20", "b:x", "b:n:64:20", "b:n:65:20", "b:n:62:20", "b:x" ]
        },
        // 뛰어 오르는
        5: {
            gap : 120,
            commands : [ "b:n:48:20", "b:n:50:20", "b:n:52:20", "b:n:48:20", "b:n:53:20", "b:x", "b:x", "b:x" ] 
        },
        // 뛰어 내리는
        6: {
            gap : 120,
            commands : [ "b:n:60:20", "b:n:53:20", "b:n:52:20", "b:n:50:20", "b:n:52:20", "b:n:48:20", "b:x", "b:x" ]
        }, 
        // 생일 축하
        7: {
            gap : 150,
            commands : [ "b:n:48:10", "b:n:48:10", "b:n:50:20", "b:x", "b:n:48:20", "b:n:53:10", "b:n:52:10" ]
        }
    },

    COLOR_RANDOM: '8',
    EFFECT_RANDOM: 'r',
    DEFAULT_SLEEP: 50,  // 전체 블록 마다 SLEEP

    /**
     * 명령어 시퀀스는 엔트리 하드웨어앱으로 한번 메세지를 보내게 되면,
     * 엔트리 하드웨어앱에서는, 마지막 명령어를 계속 내부적으로 보낸다.
     * 그렇기 때문에, 엔트리에서 같은 명령어의 블록을 두개를 연결시켜 보내면,
     * 두번째 블록 명령어를 엔트리 하드웨어앱에서 무시하게 되어 있기 때문에
     * ( 왜냐하면, 다이아보드 특성상, 시간이 들어간 명령어는 한번만 보내야하기 때문 )
     * 그래서, 시퀀스를 보냄으로서, 같은 명령어지만, 다른 블록에 의해서, 호출됨을 만들어,
     * 같은 블록을 연달아 하더라도, 동작하게끔 만들려는 목적으로 사용
     */
    _cmd_seq: 0,
    _frequency: 60,     // default값은 60
    _bpm: 120,          // default값은 120BPM 이라, 1분에 120비트 => 60초    

    getBPM : function() {
        return this._bpm;
    },

    setBPM : function( bpm ) {
        // 출력을 위해, 세팅
        Entry.hw.sendQueue['bpm']   = bpm;
        Entry.hw.update();
        // 글로벌 저장
        this._bpm   = bpm;
    },

    /**
     * 시간(초) = ( 60 / bpm ) * 박자 (rhythm)
     * @param {*} rhythm 
     * @returns 시간(초)
     */
    convertTimeForBPM : function( rhythm ) {
        return this.convertTimeByBPM( this.getBPM(), rhythm );
    },

    /**
     * 시간(초) = ( 60 / bpm ) * 박자(rhythm)
     * @param {*} rhythm 
     * @returns 시간(초)
     */
    convertTimeByBPM : function( bpm, rhythm ) {
        return parseFloat( ( 60.0 / ( bpm * 1.0 ) * rhythm ).toFixed( 2 ) );
    },

    getFrequency : function() {
        return this._frequency;
    },

    deferredReturn : function( blockReturn, sleep = Entry.Diaboard.DEFAULT_SLEEP ) {
        if( sleep > 0 ) {
            return new PromiseManager().Promise( ( resolve ) => {
                setTimeout(() => {
                    return resolve( blockReturn );
                }, sleep );
            });
        } else {
            return blockReturn();
        }
    },

    setFrequency : function( frequency ) {
        // 출력을 위해, 세팅
        Entry.hw.sendQueue['frequency'] = frequency;
        Entry.hw.update();
        // 글로벌 저장
        this._frequency = frequency
    },

    fireCommand : function( cmd ) {
        Entry.hw.sendQueue['cmd'] = cmd;
        Entry.hw.sendQueue['seq'] = ++this._cmd_seq;
        Entry.hw.update();
        // console.log( '>>> ' + cmd );
    },
    
    setZero: function() {
        this.fireCommand( "stopNow" );
        // this.fireCommand( "b:x" );      // 부저 끄기
        // this.fireCommand( "m:x" );      // 모터 끄기
        // this.fireCommand( "l:x:0" );    // LED 끄기
    },
    id: '3.2',
    name: 'diaboard',
    url: 'http://www.bitbrick.cc/',
    imageName: 'diaboard.png',
    title: {
        ko: '다이아보드',
        en: 'diaboard',
    },
    servoMaxValue: 181,
    servoMinValue: 1,
    dcMaxValue: 100,
    dcMinValue: -100,
    monitorTemplate: {
        keys: ['value'],
        imgPath: 'hw/diaboard.png',
        width: 400,
        height: 400,
        listPorts: {
            'DISP_L_BUTTON':    { name: '왼쪽 버튼',        type: 'input',  pos: { x: 0, y: 0 }},
            'DISP_R_BUTTON':    { name: '오른쪽 버튼',      type: 'input',  pos: { x: 0, y: 0 }},
            'C1':               { name: '컬러센서 색상(hue)',   type: 'input',  pos: { x: 0, y: 0 }},
            'DISP_COLOR':       { name: '컬러센서 색상',    type: 'input',  pos: { x: 0, y: 0 }},
            'S6':   { name: '적외선 센서',          type: 'input',  pos: { x: 0, y: 0 }},
            'S8':   { name: '밝기 센서',            type: 'input',  pos: { x: 0, y: 0 }},
            // 'cmd':  { name: '커맨드',               type: 'output',  pos: { x: 0, y: 0 }},
            'bpm':  { name: '연주속도(BPM)',                  type: 'output',  pos: { x: 0, y: 0 }},
        },
        mode: 'both',
    },
    /**
     * 콜백 함수. 계속해서 센서 데이터를 받는다.
     * @param {*} pd 
     */
    afterReceive(pd) {
        let items = pd[ 0 ];    // ['g', 'T', 'F', '9', '7', '2', '120', '1', '200']
        let cmd   = items[ 0 ];
        if( cmd == 'g' ) {      // sensor data
            Entry.engine.fireEvent('diaboardSensorEventReceive');
        }
    },
    calculateDCMotorValue: function( value ) {
        let val = 0;
        if ( value > 0 ) { 
            val  = Math.floor( ( value * 0.8 ) + 16 );
        } else if ( value < 0 ) {
            val  = Math.ceil( ( value * 0.8 ) - 19 );
        } else { 
            val  = 0; 
        }
        // DC_MOTOR_ADJUSTMENT  128
        val = 128 + val;
        if ( val == 128 ) {
            val = 129;
        }
        return val;
    }
};

Entry.Diaboard.blockMenuBlocks = [
    // 이벤트
    'diaboard_when_button_pressed',
    'diaboard_when_color_is',
    'diaboard_when_sensor_is',
    
    // 센서/버튼
    'diaboard_button_pressed',
    'diaboard_color_sensor_is',
    'diaboard_sensor_condition',
    'diaboard_color_sensor_seven_hue',
    'diaboard_color_sensor_one_hue',
    'diaboard_sensor_value',
    'diaboard_convert_scale',

    // 엘이디
    'diaboard_led_rainbow',
    'diaboard_led_rainbow_time',
    'diaboard_led_effect',
    'diaboard_led_effect_time',
    'diaboard_led_six',
    'diaboard_led_one',
    'diaboard_led_one_time',
    'diaboard_led_hue',
    'diaboard_led_rgb',
    'diaboard_led_turn_off_all',
    
    // 모터
    'diaboard_servomotor_angle',
    'diaboard_servomotor_angle_time',
    'diaboard_dc_direction_speed',
    'diaboard_dc_direction_speed_time',
    'diaboard_dc_speed',
    'diaboard_dc_speed_time',
    'diaboard_turn_off_all_motors',
    
    // 버저
    'diaboard_buzzer_melody_type',
    'diaboard_buzzer_effect_type',
    'diaboard_buzzer_eight_melody_bpm',
    'diaboard_buzzer_octave',
    'diaboard_buzzer_octave_rhythm',
    'diaboard_buzzer_hz',
    'diaboard_buzzer_hz_change',
    'diaboard_buzzer_speed_bpm',
    'diaboard_buzzer_speed_bpm_change',
    'diaboard_buzzer_sleep_rhythm',
    'diaboard_buzzer_stop'
];

Entry.Diaboard.getBlocks = function() {

    let options_DIABOARD_button1     = 
    [
        [Lang.Blocks.DIABOARD_button_left,  'left'],
        [Lang.Blocks.DIABOARD_button_right, 'right'],
        [Lang.Blocks.DIABOARD_button_all,   'all'],
    ];

    let options_DIABOARD_button2    = 
    [
        [Lang.Blocks.DIABOARD_button_pressed,  'pressed'],
        [Lang.Blocks.DIABOARD_button_released, 'released'],
    ];

    let options_DIABOARD_color      = 
    [
        [Lang.Blocks.DIABOARD_color_red,        1],
        [Lang.Blocks.DIABOARD_color_yellow,     2],
        [Lang.Blocks.DIABOARD_color_green,      3],
        [Lang.Blocks.DIABOARD_color_cyan,       4],
        [Lang.Blocks.DIABOARD_color_blue,       5],
        [Lang.Blocks.DIABOARD_color_magenta,    6],
        [Lang.Blocks.DIABOARD_color_white,      7],
        [Lang.Blocks.DIABOARD_color_no_color,   0],
    ];

    let options_DIABOARD_color2     =
    [
        [Lang.Blocks.DIABOARD_color_red,        1],
        [Lang.Blocks.DIABOARD_color_yellow,     2],
        [Lang.Blocks.DIABOARD_color_green,      3],
        [Lang.Blocks.DIABOARD_color_cyan,       4],
        [Lang.Blocks.DIABOARD_color_blue,       5],
        [Lang.Blocks.DIABOARD_color_magenta,    6],
        [Lang.Blocks.DIABOARD_color_white,      7],
        [Lang.Blocks.DIABOARD_color_random,     8],
    ];

    let options_DIABOARD_sensor     = 
    [
        [Lang.Blocks.DIABOARD_sensor_ir,            'ir'],
        [Lang.Blocks.DIABOARD_sensor_brightness,    'brightness'],
    ];

    let options_DIABOARD_effect     =
    [
        [Lang.Blocks.DIABOARD_effect_flame,     'f'],
        [Lang.Blocks.DIABOARD_effect_drop,      'd'],
        [Lang.Blocks.DIABOARD_effect_glitter,   'g'],
        [Lang.Blocks.DIABOARD_effect_dimming,   'm'],
        [Lang.Blocks.DIABOARD_effect_random,    'r'],
    ];

    let options_DIABOARD_led        =
    [
        [ Lang.Blocks.DIABOARD_led_all,      0 ],
        [ Lang.Blocks.DIABOARD_led_1,        1 ],
        [ Lang.Blocks.DIABOARD_led_2,        2 ],
        [ Lang.Blocks.DIABOARD_led_3,        3 ],
        [ Lang.Blocks.DIABOARD_led_4,        4 ],
        [ Lang.Blocks.DIABOARD_led_5,        5 ],
        [ Lang.Blocks.DIABOARD_led_6,        6 ],
        [ Lang.Blocks.DIABOARD_led_random,   7 ],
    ];

    let options_DIABOARD_motor      =
    [
        [Lang.Blocks.DIABOARD_motor_a,   'A'],
        [Lang.Blocks.DIABOARD_motor_b,   'B'],
        [Lang.Blocks.DIABOARD_motor_all, 'X'],
    ];

    let options_DIABOARD_dc_direction   =
    [
        [Lang.Blocks.DIABOARD_dc_direction_cw,  'CW'],
        [Lang.Blocks.DIABOARD_dc_direction_ccw, 'CCW'],
    ];

    let options_DIABOARD_melody     =
    [
        [ Lang.Blocks.DIABOARD_melody_rising,        0 ],
        [ Lang.Blocks.DIABOARD_melody_falling,       1 ],
        [ Lang.Blocks.DIABOARD_melody_forelise,      2 ],
        [ Lang.Blocks.DIABOARD_melody_tension,       3 ],
        [ Lang.Blocks.DIABOARD_melody_connecting,    4 ],
        [ Lang.Blocks.DIABOARD_melody_jumpup,        5 ],
        [ Lang.Blocks.DIABOARD_melody_jumpdown,      6 ],
        [ Lang.Blocks.DIABOARD_melody_birthday,      7 ],
    ];

    let options_DIABOARD_effect_sound   =
    [
        [ Lang.Blocks.DIABOARD_effect_sound_happy,              0 ],
        [ Lang.Blocks.DIABOARD_effect_sound_sullen,             1 ],
        [ Lang.Blocks.DIABOARD_effect_sound_sad,                2 ],
        [ Lang.Blocks.DIABOARD_effect_sound_engery_gathering,   3 ],
        [ Lang.Blocks.DIABOARD_effect_sound_laser_beam,         4 ],
    ];

    let options_DIABOARD_tonicsolfa     =
    [
        [Lang.Blocks.DIABOARD_tonicsolfa_do,         0],
        [Lang.Blocks.DIABOARD_tonicsolfa_do_sharp,   1],
        [Lang.Blocks.DIABOARD_tonicsolfa_re,         2],
        [Lang.Blocks.DIABOARD_tonicsolfa_re_sharp,   3],
        [Lang.Blocks.DIABOARD_tonicsolfa_mi,         4],
        [Lang.Blocks.DIABOARD_tonicsolfa_fa,         5],
        [Lang.Blocks.DIABOARD_tonicsolfa_fa_sharp,   6],
        [Lang.Blocks.DIABOARD_tonicsolfa_sol,        7],
        [Lang.Blocks.DIABOARD_tonicsolfa_sol_sharp,  8],
        [Lang.Blocks.DIABOARD_tonicsolfa_la,         9],
        [Lang.Blocks.DIABOARD_tonicsolfa_la_sharp,  10],
        [Lang.Blocks.DIABOARD_tonicsolfa_si,        11],
        [Lang.Blocks.DIABOARD_tonicsolfa_high_do,   12],
        [Lang.Blocks.DIABOARD_tonicsolfa_rest,     100],
    ];

    let options_DIABOARD_tonicsolfa2    =
    [
        [Lang.Blocks.DIABOARD_tonicsolfa_do,         0],
        [Lang.Blocks.DIABOARD_tonicsolfa_do_sharp,   1],
        [Lang.Blocks.DIABOARD_tonicsolfa_re,         2],
        [Lang.Blocks.DIABOARD_tonicsolfa_re_sharp,   3],
        [Lang.Blocks.DIABOARD_tonicsolfa_mi,         4],
        [Lang.Blocks.DIABOARD_tonicsolfa_fa,         5],
        [Lang.Blocks.DIABOARD_tonicsolfa_fa_sharp,   6],
        [Lang.Blocks.DIABOARD_tonicsolfa_sol,        7],
        [Lang.Blocks.DIABOARD_tonicsolfa_sol_sharp,  8],
        [Lang.Blocks.DIABOARD_tonicsolfa_la,         9],
        [Lang.Blocks.DIABOARD_tonicsolfa_la_sharp,  10],
        [Lang.Blocks.DIABOARD_tonicsolfa_si,        11],
    ];

    return {
        //region 
        diaboard_when_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                    position: {
                        x: 0,
                        y: 0
                    }
                },      
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_button1,
                    value: 'left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_button2,
                    value: 'pressed',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'diaboard_when_button_pressed',
            },
            paramsKeyMap: {
                DUMMY:  0,
                PORT:   1,     // left/right/all
                STATUS: 2,     // pressed
            },
            class: 'event',
            isNotFor: ['diaboard'],
            event: 'diaboardSensorEventReceive',
            func: function(sprite, script) {
                let port    = script.getStringField('PORT');
                let status  = script.getStringField('STATUS');
                let leftButton      = ( Entry.hw.portData[ 'S1' ] == 'T' ? true : false );
                let rightButton     = ( Entry.hw.portData[ 'S2' ] == 'T' ? true : false );
                let buttonStatus    = ( status == 'pressed' ? true : false );
                if ( port == 'all' ) {    // all
                    if ( leftButton == buttonStatus && rightButton == buttonStatus ) {
                        return script.callReturn();
                    }
                } else if( port == 'left' ) {
                    if ( leftButton == buttonStatus ) {
                        return script.callReturn();
                    }
                } else if( port == 'right' ) {
                    if ( rightButton == buttonStatus ) {
                        return script.callReturn();
                    }
                }
                return this.die();
            },
            syntax: { js: [], py: ['Diaboard.when_button_pressed(%2,%3)'] },
        },
        diaboard_when_color_is: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                    position: {
                        x: 0,
                        y: 0
                    }
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_color,
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'diaboard_when_color_is',
            },
            paramsKeyMap: {
                DUMMY: 0,
                COLOR: 1,     // red/yellow/green/cyan/blue/purple/white
            },
            class: 'event',
            isNotFor: ['diaboard'],
            event: 'diaboardSensorEventReceive',
            func: function(sprite, script) {
                let color   = script.getNumberField('COLOR');
                let sensorColor = Entry.hw.portData[ 'S4' ];               // 컬러센서 값 범위 0 ~ 7
                if( color == sensorColor ) {
                    return script.callReturn();
                } else {
                    return this.die();
                }
            },
            syntax: { js: [], py: ['Diaboard.when_color_is(%2)'] },
        },
        diaboard_when_sensor_is: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                    position: {
                        x: 0,
                        y: 0
                    }
                },                
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_sensor,
                    value: 'ir',
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: Entry.Diaboard.INEQ_SIGN,
                    value: '<',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    }
                ],
                type: 'diaboard_when_sensor_is',
            },
            paramsKeyMap: {
                DUMMY: 0,
                SENSOR: 1,
                INEQ_SIGN: 2,
                VALUE: 3
            },
            class: 'event',
            isNotFor: ['diaboard'],
            event: 'diaboardSensorEventReceive',
            func: function(sprite, script) {
                let sensor      = script.getStringField('SENSOR');
                let ineqSign    = script.getStringField('INEQ_SIGN');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                if( sensor == 'ir' ) {
                    let irValue     = Entry.hw.portData[ 'S6' ];
                    if( ineqSign == '<' && irValue < value ) {
                        return script.callReturn();
                    } else if( ineqSign == '>' && irValue > value ) {
                        return script.callReturn();
                    } else if( ineqSign == '=' && irValue == value ) {
                        return script.callReturn();
                    } else {
                        return this.die();
                    }
                } else if( sensor == 'brightness' ) {
                    let brightnessValue     = Entry.hw.portData[ 'S8' ];
                    if( ineqSign == '<' && brightnessValue < value ) {
                        return script.callReturn();
                    } else if( ineqSign == '>' && brightnessValue > value ) {
                        return script.callReturn();
                    } else if( ineqSign == '=' && brightnessValue == value ) {
                        return script.callReturn();
                    } else {
                        return this.die();
                    }
                } else {
                    return this.die();
                }
            },
            syntax: { js: [], py: ['Diaboard.when_sensor_is(%2,%3,%4)'] },
        },
        // ---
        diaboard_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_button1,
                    value: 'left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_button2,
                    value: 'pressed',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'diaboard_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
                STATUS: 1,
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let port    = script.getStringField('PORT');
                let status  = script.getStringField('STATUS');
                let leftButton      = ( Entry.hw.portData[ 'S1' ] == 'T' ? true : false );
                let rightButton     = ( Entry.hw.portData[ 'S2' ] == 'T' ? true : false );
                let buttonStatus    = ( status == 'pressed' ? true : false );
                if ( port == 'all' ) {    // all
                    return ( leftButton == buttonStatus && rightButton == buttonStatus );
                } else if( port == 'left' ) {
                    return ( leftButton == buttonStatus );
                } else if( port == 'right' ) {
                    return ( rightButton == buttonStatus );
                }
                return false;
            },
            syntax: { js: [], py: ['Diaboard.button_pressed(%1,%2)'] },
        },
        diaboard_color_sensor_is: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_color,
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'diaboard_color_sensor_is',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let color   = script.getNumberField('COLOR');
                let sensorColor = Entry.hw.portData[ 'S4' ];               // 컬러센서 값 범위 0 ~ 7
                if( color == sensorColor ) {
                    return true;
                } else {
                    return false;
                }
            },
            syntax: { js: [], py: ['Diaboard.color_sensor_is(%1)'] },
        },
        diaboard_sensor_condition: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_sensor,
                    value: 'ir',
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: Entry.Diaboard.INEQ_SIGN,
                    value: '<',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    }
                ],
                type: 'diaboard_sensor_condition',
            },
            paramsKeyMap: {
                SENSOR:     0,
                INEQ_SIGN:  1,
                VALUE:      2,
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let sensor      = script.getStringField('SENSOR');
                let ineqSign    = script.getStringField('INEQ_SIGN');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                if( sensor == 'ir' ) {
                    let irValue     = Entry.hw.portData[ 'S6' ];
                    if( ineqSign == '<' && irValue < value ) {
                        return true;
                    } else if( ineqSign == '>' && irValue > value ) {
                        return true;
                    } else if( ineqSign == '=' && irValue == value ) {
                        return true;
                    } else {
                        return false;
                    }
                } else if( sensor == 'brightness' ) {
                    let brightnessValue     = Entry.hw.portData[ 'S8' ];
                    if( ineqSign == '<' && brightnessValue < value ) {
                        return true;
                    } else if( ineqSign == '>' && brightnessValue > value ) {
                        return true;
                    } else if( ineqSign == '=' && brightnessValue == value ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            syntax: { js: [], py: ['Diaboard.sensor_condition(%1,%2,%3)'] },
        },
        diaboard_color_sensor_seven_hue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'diaboard_color_sensor_seven_hue',
            },
            paramsKeyMap: {
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let sensorValue     = Entry.hw.portData[ 'S4' ];            // sensorValue can be 0 ~ 7
                let colorName       = Entry.Diaboard.COLOR_TYPE[ sensorValue ];     // colorName can be red, blue, white and so on
                return Lang.Blocks['DIABOARD_color_' + colorName];
            },
            syntax: { js: [], py: ['Diaboard.color_sensor_seven_hue()'] },
        },
        diaboard_color_sensor_one_hue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'diaboard_color_sensor_one_hue',
            },
            paramsKeyMap: {
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let hue         = Entry.hw.portData[ 'C1' ];
                // let saturation  = Entry.hw.portData[ 'C2' ];
                // let intensity   = Entry.hw.portData[ 'C3' ];
                return hue;
            },
            syntax: { js: [], py: ['Diaboard.color_sensor_one_hue()'] },
        },
        diaboard_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_sensor,
                    value: 'ir',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'diaboard_sensor_value',
            },
            paramsKeyMap: {
                SENSOR: 0,      // IR/brightness
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let sensor  = script.getStringField('SENSOR');
                if( sensor == 'ir' ) {
                    let irSensor    = Entry.hw.portData[ 'S5' ];
                    let irValue     = Entry.hw.portData[ 'S6' ];
                    return irValue;
                } else if( sensor == 'brightness' ) {
                    let brightnessSensor    = Entry.hw.portData[ 'S7' ];
                    let brightnessValue     = Entry.hw.portData[ 'S8' ];
                    return brightnessValue;
                } else {
                    return "";
                }                
            },
            syntax: { js: [], py: ['Diaboard.sensor_value(%1)'] },
        },
        diaboard_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_sensor,
                    value: 'ir',
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1023'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                ],
                type: 'diaboard_convert_scale',
            },
            paramsKeyMap: {
                SENSOR: 0,
                VALUE1: 1,
                VALUE2: 2,
                VALUE3: 3,
                VALUE4: 4,
            },
            class: 'condition',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let sensor  = script.getStringField('SENSOR');
                let in_min  = script.getNumberValue('VALUE1');
                let in_max  = script.getNumberValue('VALUE2');
                let out_min = script.getNumberValue('VALUE3');
                let out_max = script.getNumberValue('VALUE4');

                in_min   = isNaN( in_min ) ? 0 : in_min;
                in_max   = isNaN( in_min ) ? 0 : in_max;
                out_min  = isNaN( in_min ) ? 0 : out_min;
                out_max  = isNaN( in_min ) ? 0 : out_max;

                if( sensor == 'ir' ) {
                    let irSensor            = Entry.hw.portData[ 'S5' ];
                    let irValue             = Entry.hw.portData[ 'S6' ];
                    let v                   = (irValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
                    return v.toString();
                } else if ( sensor == 'brightness' ) {
                    let brightnessSensor    = Entry.hw.portData[ 'S7' ];
                    let brightnessValue     = Entry.hw.portData[ 'S8' ];
                    let v                   = (brightnessValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
                    return v.toString();
                } else {
                    return "0";
                }       
            },
            syntax: {
                js: [],
                py: ['Diaboard.convert_scale(%1, %2, %3, %4, %5)'],
            },
        },
        // ---
        diaboard_led_rainbow: {
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
                type: 'diaboard_led_rainbow',
                id: 'i3je',
            },
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let effect = "r";   // rainbow
                let color  = 0;
                let time   = 0;       
                let cmd = `l:p:${effect}:${color}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_rainbow()'] },
        },
        diaboard_led_rainbow_time: {
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
                        type: 'text',
                        params: ['1'],
                    },
                    null
                ],
                type: 'diaboard_led_rainbow_time',
                id: 'i3je',
            },
            paramsKeyMap: {
                TIME: 0
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let effect  = "r";   // rainbow
                let color   = 0;
                let second  = script.getNumberValue('TIME');
                second      = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let time    = second * 10;   // 입력 시간이 1.5초 라면 15로 세팅 (곱하기 10 해야함)
                let cmd     = `l:p:${effect}:${color}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.led_rainbow_time(%1)'] },
        },
        diaboard_led_effect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_effect,
                    value: 'f',
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_color2,
                    value: 1,
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
                    null
                ],
                type: 'diaboard_led_effect',
                id: 'i3je',
            },
            paramsKeyMap: {
                EFFECT: 0,
                COLOR: 1,
            },
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let effect  = script.getStringValue('EFFECT');
                if( effect == Entry.Diaboard.EFFECT_RANDOM ) {
                    // returns a random integer from 0 to 3
                    let v = Math.floor(Math.random() * 4);          // 0 ~ 3
                    effect  = Entry.Diaboard.EFFECT_TYPE[ v ];      // v can be 'f' ~ 'm'
                }
                let color   = script.getStringValue('COLOR');       // '1' ~ '8'
                if( color == Entry.Diaboard.COLOR_RANDOM ) {        // '8'
                    // returns a random integer from 1 to 7
                    color   = Math.floor(Math.random() * 7) + 1;    // red(1) ~ white(7)
                }
                let time    = 0;
                let cmd     = `l:p:${effect}:${color}:${time}`;     // l:p:d:5:50
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_effect(%1,%2)'] },
        },
        diaboard_led_effect_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_effect,
                    value: 'f',
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_color2,
                    value: 1,
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },                    
                    null
                ],
                type: 'diaboard_led_effect_time',
                id: 'i3je',
            },
            paramsKeyMap: {
                EFFECT: 0,
                COLOR: 1,
                TIME: 2,
            },
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let effect  = script.getStringValue('EFFECT');
                if( effect == Entry.Diaboard.EFFECT_RANDOM ) {
                    // returns a random integer from 0 to 3
                    let v = Math.floor(Math.random() * 4);          // 0 ~ 3
                    effect  = Entry.Diaboard.EFFECT_TYPE[ v ];      // v can be 'f' ~ 'm'
                }                    
                let color   = script.getNumberValue('COLOR');
                if( color == Entry.Diaboard.COLOR_RANDOM ) {        // '8'
                    // returns a random integer from 1 to 7
                    color   = Math.floor(Math.random() * 7) + 1;    // red(1) ~ white(7)
                }                    
                let second  = script.getNumberValue('TIME');       
                second      = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let time    = second * 10;   // 입력 시간이 1.5초 라면 15로 세팅 (곱하기 10 해야함)
                let cmd     = `l:p:${effect}:${color}:${time}`;     // l:p:d:5:50
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.led_effect_time(%1,%2,%3)'] },
        },
        diaboard_led_six: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
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
                params: [
                    null
                ],
                type: 'diaboard_led_six',
                id: 'i3je',
            },
            paramsKeyMap: {
                COLOR1: 0,
                COLOR2: 1,
                COLOR3: 2,
                COLOR4: 3,
                COLOR5: 4,
                COLOR6: 5
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let color1  = script.getStringValue('COLOR1');
                let red1    = parseInt(color1.substr(1, 2), 16);
                let green1  = parseInt(color1.substr(3, 2), 16);
                let blue1   = parseInt(color1.substr(5, 2), 16);

                let color2  = script.getStringValue('COLOR2');
                let red2    = parseInt(color2.substr(1, 2), 16);
                let green2  = parseInt(color2.substr(3, 2), 16);
                let blue2   = parseInt(color2.substr(5, 2), 16);

                let color3  = script.getStringValue('COLOR3');
                let red3    = parseInt(color3.substr(1, 2), 16);
                let green3  = parseInt(color3.substr(3, 2), 16);
                let blue3   = parseInt(color3.substr(5, 2), 16);

                let color4  = script.getStringValue('COLOR4');
                let red4    = parseInt(color4.substr(1, 2), 16);
                let green4  = parseInt(color4.substr(3, 2), 16);
                let blue4   = parseInt(color4.substr(5, 2), 16);

                let color5  = script.getStringValue('COLOR5');
                let red5    = parseInt(color5.substr(1, 2), 16);
                let green5  = parseInt(color5.substr(3, 2), 16);
                let blue5   = parseInt(color5.substr(5, 2), 16);

                let color6  = script.getStringValue('COLOR6');
                let red6    = parseInt(color6.substr(1, 2), 16);
                let green6  = parseInt(color6.substr(3, 2), 16);
                let blue6   = parseInt(color6.substr(5, 2), 16);

                let cmd     = `l:a:${red1}:${green1}:${blue1}:${red2}:${green2}:${blue2}:${red3}:${green3}:${blue3}:${red4}:${green4}:${blue4}:${red5}:${green5}:${blue5}:${red6}:${green6}:${blue6}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_six(%1,%2,%3,%4,%5,%6)'] },
        },
        diaboard_led_one: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_led,
                    value: '0',
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
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'diaboard_led_one',
                id: 'i3je',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let led     = script.getNumberValue('LED');
                if( led == 7 ) {        // 7은 랜덤
                    led     = Math.floor(Math.random() * 6) + 1;    // 1 ~ 6
                }
                let color   = script.getStringValue('COLOR');
                let red     = parseInt(color.substr(1, 2), 16);
                let green   = parseInt(color.substr(3, 2), 16);
                let blue    = parseInt(color.substr(5, 2), 16);
                let time    = 0;
                let cmd     = `l:c:${led}:${red}:${green}:${blue}:${time}`; // l:c:0:255:255:255:1
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_one(%1,%2)'] },
        },
        diaboard_led_one_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_led,
                    value: 0,
                },
                {
                    type: 'Color',
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },                    
                ],
                type: 'diaboard_led_one_time',
                id: 'i3je',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
                TIME: 2,
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let led     = script.getNumberValue('LED');
                if( led == 7 ) {        // 7은 랜덤
                    led     = Math.floor(Math.random() * 6) + 1;    // 1 ~ 6
                }
                let color   = script.getStringValue('COLOR');
                let red     = parseInt(color.substr(1, 2), 16);
                let green   = parseInt(color.substr(3, 2), 16);
                let blue    = parseInt(color.substr(5, 2), 16);
                let second  = script.getNumberValue('TIME');       
                second      = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let time    = second * 10;   // 입력 시간이 1.5초 라면 15로 세팅 (곱하기 10 해야함)
                let cmd     = `l:c:${led}:${red}:${green}:${blue}:${time}`; // l:c:0:255:255:255:1
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.led_one_time(%1,%2,%3)'] },
        },

        diaboard_led_hue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_led,
                    value: 0,
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null
                ],
                type: 'diaboard_led_hue',
                id: 'i3je',
            },
            paramsKeyMap: {
                LED: 0,
                HUE: 1,
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let led     = script.getNumberValue('LED');
                if( led == 7 ) {        // 7은 랜덤
                    led     = Math.floor(Math.random() * 6) + 1;    // 1 ~ 6
                }

                let hue     = script.getNumberValue('HUE');
                hue         = ( isNaN( hue ) || hue < 0 ) ? 0 : hue;
                hue         = Math.floor( hue % 360 );  // 0 ~ 359 범위로 조정하기
                let r_value = 0;
                let g_value = 0;
                let b_value = 0;
                if (hue <= 120) {
                    r_value = 120 - hue;
                    g_value = hue;
                    b_value = 0;
                }
                else if (hue <= 240) {
                    r_value = 0;
                    g_value = 240 - hue;
                    b_value = hue - 120;
                } else {
                    r_value = hue - 240;
                    g_value = 0;
                    b_value = 360 - hue;
                }
                let time    = 0;
                let cmd     = `l:c:${led}:${r_value}:${g_value}:${b_value}:${time}`; // l:x:c:255:255:255:1
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_hue(%1,%2)'] },
        },
        diaboard_led_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_led,
                    value: 0,
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
                ],
                type: 'diaboard_led_rgb',
                id: 'i3je',
            },
            paramsKeyMap: {
                LED: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let led     = script.getNumberValue('LED');
                if( led == 7 ) {        // 7은 랜덤
                    led     = Math.floor(Math.random() * 6) + 1;    // 1 ~ 6
                }
                let red     = script.getNumberValue('RED');
                let green   = script.getNumberValue('GREEN');
                let blue    = script.getNumberValue('BLUE');
                red         = Math.max(Math.min(red,   255), 0);
                green       = Math.max(Math.min(green, 255), 0);
                blue        = Math.max(Math.min(blue,  255), 0);
                let time    = 0;
                let cmd     = `l:c:${led}:${red}:${green}:${blue}:${time}`; // l:x:c:255:255:255:1
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_rgb(%1,%2,%3,%4)'] },
        },
        diaboard_led_turn_off_all: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_led,
                    value: 0,
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
                    null
                ],
                type: 'diaboard_led_turn_off_all',
                id: 'i3je',
            },
            paramsKeyMap: {
                LED: 0
            },            
            class: 'led',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let led = script.getNumberValue('LED');
                if( led == 7 ) {        // 7은 랜덤
                    led     = Math.floor(Math.random() * 6) + 1;    // 1 ~ 6
                }
                let cmd = `l:x:${led}`;        // l:x:0
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.led_turn_off_all(%1)'] },
        },
        // ---
        diaboard_servomotor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'diaboard_servomotor_angle',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                let type        = "S";      // servo motor
                let endAngle    = Math.max( Math.min(value, 180), 0 );      
                let startAngle  = 0;
                let time        = 0;
                let cmd         = `m:${motor}:${type}:${endAngle}:${startAngle}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.servomotor_angle(%1, %2)'] },
        },
        diaboard_servomotor_angle_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
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
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['180'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'diaboard_servomotor_angle_time',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE1: 1,
                VALUE2: 2,
                TIME: 3
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let value1      = script.getNumberValue('VALUE1');
                value1          = isNaN( value1 ) ? 0 : value1;
                let value2      = script.getNumberValue('VALUE2');
                value2          = isNaN( value2 ) ? 0 : value2;
                let second      = script.getNumberValue('TIME');
                second          = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let type        = "S";      // servo motor
                let startAngle  = Math.max( Math.min(value1, 180), 0 );
                let endAngle    = Math.max( Math.min(value2, 180), 0 );
                let time        = second * 10;
                let cmd         = `m:${motor}:${type}:${endAngle}:${startAngle}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.servomotor_angle_time(%1,%2,%3,%4)'] },
        },
        diaboard_dc_direction_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_dc_direction,
                    value: 'CW',
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
                params: [
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'diaboard_dc_direction_speed',
            },
            paramsKeyMap: {
                MOTOR: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let direction   = script.getStringValue('DIRECTION');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                let time        = 0;
                let type        = "D";      // db motor
                let speed       = Math.max( Math.min(value, 100), 0 );
                if( direction == 'CCW' ) {
                    speed = -1 * speed;
                }
                let cmd         = `m:${motor}:${type}:${speed}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.dc_direction_speed(%1, %2, %3)'] },
        },
        diaboard_dc_direction_speed_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_dc_direction,
                    value: 'CW',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'diaboard_dc_direction_speed_time',
            },
            paramsKeyMap: {
                MOTOR: 0,
                DIRECTION: 1,
                VALUE: 2,
                TIME: 3,
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let direction   = script.getStringValue('DIRECTION');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                let second      = script.getNumberValue('TIME');
                second          = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let type        = "D";      // db motor
                let speed       = Math.max( Math.min(value, 100), 0 );
                if( direction == 'CCW' ) {
                    speed = -1 * speed;
                }
                let time        = second * 10;
                let cmd         = `m:${motor}:${type}:${speed}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.dc_direction_speed_time(%1,%2,%3,%4)'] },
        },
        diaboard_dc_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
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
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'diaboard_dc_speed',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                let time        = 0;
                let type        = "D";      // db motor
                let speed       = Math.max( Math.min(value, 100), -100 );
                let cmd         = `m:${motor}:${type}:${speed}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.dc_speed(%1, %2)'] },
        },
        diaboard_dc_speed_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
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
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'diaboard_dc_speed_time',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
                TIME: 2
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor       = script.getStringValue('MOTOR');
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : value;
                let second      = script.getNumberValue('TIME');
                second          = ( isNaN( second ) || second < 0 ) ? 0 : second;
                let type        = "D";      // db motor
                let speed       = Math.max( Math.min(value, 100), -100 );
                let time        = second * 10;
                let cmd         = `m:${motor}:${type}:${speed}:${time}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.dc_speed_time(%1,%2,%3)'] },
        },
        diaboard_turn_off_all_motors: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: options_DIABOARD_motor,
                    value: 'A'
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
                type: 'diaboard_turn_off_all_motors',
            },
            paramsKeyMap: {
                MOTOR: 0
            },
            class: 'motor',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let motor   = script.getStringValue('MOTOR');
                motor       = motor.toLowerCase();
                let cmd     = `m:${motor}`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.turn_off_all_motors(%1)'] },
        },
        // ---
        diaboard_buzzer_melody_type: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_melody,
                    value: 0,
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
                ],
                type: 'diaboard_buzzer_melody_type',
            },
            paramsKeyMap: {
                MELODY: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let melodyIndex = script.getNumberValue('MELODY');
                let melodyItem  = Entry.Diaboard.MELODY_TYPE[ melodyIndex ];
                let gap         = melodyItem.gap;
                let commands    = melodyItem.commands;
                let totalMs     = commands.length * gap;        // gap은 ms
                for( let index = 0; index < commands.length; index++ ) {
                    let cmd = commands[ index ];
                    if( index == 0 ) {
                        Entry.Diaboard.fireCommand( cmd );
                    } else {
                        setTimeout( () => {
                            Entry.Diaboard.fireCommand( cmd );
                        }, index * gap );
                    }
                }
                return Entry.Diaboard.deferredReturn( script.callReturn, totalMs );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_melody_type(%1)'] },
        },
        diaboard_buzzer_effect_type: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_effect_sound,
                    value: 0,
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
                ],
                type: 'diaboard_buzzer_effect_type',
            },
            paramsKeyMap: {
                EFFECT: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let effectIndex = script.getNumberValue('EFFECT');
                if( effectIndex == 0 ) {
                    // 1. 신바람
                    let command     = "n";
                    let inc         = 0;
                    let delay       = 20;
                    let time        = 5;    
                    for( let i = 0; i <= 50; i++ ) {
                        let setNote = 0;
                        if ( parseInt( i / 5 ) == 0) setNote = i * 2;
                        else if ( parseInt( i / 5 ) == 1 ) setNote = i * 3;
                        else if ( parseInt( i / 5 ) == 2 ) setNote = i * 4;
                        else if ( parseInt( i / 5 ) == 3 ) setNote = i * 2;
                        else if ( parseInt( i / 5 ) == 4 ) setNote = i * 4;
                        else if ( parseInt( i / 5 )  > 4 ) setNote = i * 2;

                        setNote         = setNote + 20;
                        let note        = setNote;
                        let cmd         = `b:${command}:${note}:${time}`;               // buzzer : comman n(노트) : 노트번호 : 시간( 100 = 1초 = 1000ms )
                        if( i == 0 ) {
                            Entry.Diaboard.fireCommand( cmd );
                        } else {
                            setTimeout( () => {
                                Entry.Diaboard.fireCommand( cmd );
                            }, delay * inc );                // every 20ms
                        }
                        inc += 1;
                    }
                    let totalSecond = inc * delay;  // delay 단위는 ms 
                    return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond );
                } else if( effectIndex == 1 ) {
                    // 2. 시무룩
                    let command     = "f";    
                    let time        = 1;
                    let inc         = 0;
                    let delay       = 20;
                    for( let i = 0; i < 10; i++ ) {
                        let freq    = i * 4 + 240;
                        let cmd     = `b:${command}:${freq}:${time}`;
                        if( inc == 0 ) {
                            Entry.Diaboard.fireCommand( cmd );
                        } else {
                            setTimeout( () => {
                                Entry.Diaboard.fireCommand( cmd );
                            }, delay * inc );        // every 20ms
                        }
                        inc += 1;
                    }
                    for( let i = 10 ; i >= 0; i-- ) {
                        let freq    = i * 4 + 240;
                        let cmd     = `b:${command}:${freq}:${time}`;
                        setTimeout( () => {
                            Entry.Diaboard.fireCommand( cmd );
                        }, delay * inc );       // every 20ms
                        inc += 1;
                    }
                    let totalSecond = inc * delay;  // delay 단위는 ms 
                    return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond );
                } else if( effectIndex == 2 ) {
                    // 3. 슬픔
                    let command     = "f";    
                    let time        = 1;
                    let inc         = 0;
                    let delay       = 20;
                    for( let i = 0; i < 15; i++ ) {
                        let freq    =   i * 7 + 900;
                        let cmd     = `b:${command}:${freq}:${time}`;
                        if( inc == 0 ) {
                            Entry.Diaboard.fireCommand( cmd );
                        } else {
                            setTimeout( () => {
                                Entry.Diaboard.fireCommand( cmd );
                            }, delay * inc );              // every 20ms
                        }
                        inc += 1;
                    }
                    for( let i = 15; i >= 0; i-- ) {
                        let freq    =   i * 7 + 900;
                        let cmd     = `b:${command}:${freq}:${time}`;
                        setTimeout( () => {
                            Entry.Diaboard.fireCommand( cmd );
                        }, delay * inc );        // every 20ms
                        inc += 1;
                    }
                    let totalSecond = inc * delay;  // delay 단위는 ms 
                    return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond );
                } else if( effectIndex == 3 ) {
                    // 4. 에너지 모으는
                    let command     = "f";
                    let time        = 1;
                    let inc         = 0;
                    let delay       = 20;
                    for( let i = 0; i <= 70; i++ ) {
                        let freq    = 0;
                        if ( i <= 51 ) {
                            freq    = i * 45;   // 최대 2295 (=51 * 45)
                        } else {
                            freq    = 2380;     // 최대 2380 ( 52 ~ 70 )
                        }
                        let cmd     = `b:${command}:${freq}:${time}`;
                        if( i == 0 ) {
                            Entry.Diaboard.fireCommand( cmd );
                        } else {
                            setTimeout( () => {
                                Entry.Diaboard.fireCommand( cmd );
                            }, delay * inc );        // every 20ms
                        }
                        inc += 1;
                    }
                    let totalSecond = inc * delay;  // delay 단위는 ms 
                    return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond );
                } else if( effectIndex == 4 ) {
                    // 5. 레이저빔
                    let command     = "n";
                    let time        = 1;
                    let inc         = 0;
                    let delay       = 20;
                    for( let i = 20; i >= 0; i-- ) {
                        let freq    = i * 4 + 10;
                        let cmd     = `b:${command}:${freq}:${time}`;
                        if( i == 20 ) {
                            Entry.Diaboard.fireCommand( cmd );
                        } else {
                            setTimeout( () => {
                                Entry.Diaboard.fireCommand( cmd );
                            }, delay * inc );                // every 20ms
                        }
                        inc += 1;
                    }
                    let totalSecond = inc * delay;  // delay 단위는 ms 
                    return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond );
                } else {
                    // invalid effectIndex
                    return Entry.Diaboard.deferredReturn( script.callReturn );
                }
            },
            syntax: { js: [], py: ['Diaboard.buzzer_effect_type(%1)'] },
        },
        diaboard_buzzer_eight_melody_bpm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa,
                    value: 0,
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
                params: [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['120'],
                    },
                    null
                ],
                type: 'diaboard_buzzer_eight_melody_bpm',
            },
            paramsKeyMap: {
                TONICSOLFA_1: 0,
                TONICSOLFA_2: 1,
                TONICSOLFA_3: 2,
                TONICSOLFA_4: 3,
                TONICSOLFA_5: 4,
                TONICSOLFA_6: 5,
                TONICSOLFA_7: 6,
                TONICSOLFA_8: 7,
                BPM: 8
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let tonicsolfaItems = [
                    script.getNumberValue('TONICSOLFA_1'),
                    script.getNumberValue('TONICSOLFA_2'),
                    script.getNumberValue('TONICSOLFA_3'),
                    script.getNumberValue('TONICSOLFA_4'),
                    script.getNumberValue('TONICSOLFA_5'),
                    script.getNumberValue('TONICSOLFA_6'),
                    script.getNumberValue('TONICSOLFA_7'),
                    script.getNumberValue('TONICSOLFA_8')
                ];
                let bpm         = script.getNumberValue('BPM');
                bpm             = isNaN( bpm ) ? 120 : bpm;                         // 유효하지 않은 값은 120bpm으로 설정
                bpm             = Math.max( Math.min( bpm, 300 ), 30);             // bpm은 30 ~ 300
                let second      = Entry.Diaboard.convertTimeByBPM( bpm, 0.5 );      // 리턴 단위 초, ( bpm, 박자 )
                let totalSecond = second * 8;
                let octave      = 4;                                                // 기본값 4 옥타브
                let command     = "n";    
                for( let index = 0; index < tonicsolfaItems.length; index++ ) {
                    let tonicsolfa  = tonicsolfaItems[ index ];
                    let note        = ( tonicsolfa == 100 ) ? 96 : ( ( octave - 1 ) * 12 + tonicsolfa );        // 100은 무음 (note 번호 96은 무음 (박자 쉬기 블록일 때))
                    let time        = second * 100;                                 // 메세지 시간 세팅 시 ( 초 * 100 )
                    let cmd         = `b:${command}:${note}:${time}`;               // buzzer : comman n(노트) : 노트번호 : 시간
                    if( index == 0 ) {
                        Entry.Diaboard.fireCommand( cmd );
                    } else {
                        setTimeout( () => {
                            Entry.Diaboard.fireCommand( cmd );
                        }, ( second * 1000 ) * index );
                    }
                }
                return Entry.Diaboard.deferredReturn( script.callReturn, totalSecond * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_eight_melody_bpm(%1,%2,%3,%4,%5,%6,%7,%8,%9,%10)'] },
        },
        diaboard_buzzer_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: Entry.Diaboard.OCTAVE_TYPE,
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa2,
                    value: 0,
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
                    null,
                    null,
                ],
                type: 'diaboard_buzzer_octave',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                TONICSOLFA: 1
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let octave      = script.getNumberValue('OCTAVE');
                let tonicsolfa  = script.getNumberValue('TONICSOLFA');
                let command     = "n";    
                let note        = ( octave - 1 ) * 12 + tonicsolfa;     // 프로토콜 인자값 ( 0 ~ 11 )
                let stdFreq     = Entry.Diaboard.STANDARD_FREQ[ note ]; // 프로토콜 인자값으로 표준주파수값을 가져온다
                Entry.Diaboard.setFrequency( Math.ceil( stdFreq ) );    // 표준주파수값을 저장한다. 
                let time        = 0;
                let cmd         = `b:${command}:${note}:${time}`;       // buzzer : comman n(노트) : 노트번호 : 시간
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_octave(%1,%2)'] },
        },
        diaboard_buzzer_octave_rhythm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: Entry.Diaboard.OCTAVE_TYPE,
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_DIABOARD_tonicsolfa2,
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: Entry.Diaboard.RHYTHM_TYPE,
                    value: 0.5,
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
                    null,
                    null,                    
                    null,
                ],
                type: 'diaboard_buzzer_octave_rhythm',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                TONICSOLFA: 1,
                RHYTHM: 2,
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let octave      = script.getNumberValue('OCTAVE');
                let tonicsolfa  = script.getNumberValue('TONICSOLFA');
                let rhythm      = script.getNumberValue('RHYTHM');
                let command     = "n";    
                let note        = ( octave - 1 ) * 12 + tonicsolfa;
                let stdFreq     = Entry.Diaboard.STANDARD_FREQ[ note ];         // 프로토콜 인자값으로 표준주파수값을 가져온다
                Entry.Diaboard.setFrequency( Math.ceil( stdFreq ) );            // 표준주파수값을 저장한다. 
                let second      = Entry.Diaboard.convertTimeForBPM( rhythm );   // 초
                let time        = second * 100;                                 // 메세지 시간 세팅 시 ( 초 * 100 )
                let cmd         = `b:${command}:${note}:${time}`;               // buzzer : comman n(노트) : 노트번호 : 시간
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_octave_rhythm(%1,%2,%3)'] },
        },
        diaboard_buzzer_hz: {
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
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'diaboard_buzzer_hz',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 60 : Math.round( value );    // 유효하지 않은 값은, 60로 처리
                let command     = "f";    
                let freq        = Math.max( Math.min( value, 8000 ), 32);   // 주파수는 32~8000hz 범위로 보내기 
                Entry.Diaboard.setFrequency( freq );
                let time        = 0;
                let cmd         = `b:${command}:${freq}:${time}`;   // buzzer : comman n(노트) : 노트번호 : 시간
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_hz(%1)'] },
        },
        diaboard_buzzer_hz_change: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'diaboard_buzzer_hz_change',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let value       = script.getNumberValue('VALUE');
                value           = isNaN( value ) ? 0 : Math.round( value );                     // 유효하지 않은 값은, 0으로 설정
                let command     = "f";    
                let diffFreq    = Math.max( Math.min( value, 8000 - 32 ), ( -8000 + 32 ) );     // 주파수 변화 값 -7968 ~ 7968
                let freq        = Entry.Diaboard.getFrequency() + diffFreq;
                Entry.Diaboard.setFrequency( freq );
                let time        = 0;
                let cmd         = `b:${command}:${freq}:${time}`;   // buzzer : comman n(노트) : 노트번호 : 시간
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_hz_change(%1)'] },
        },
        diaboard_buzzer_speed_bpm: {
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
                        type: 'text',
                        params: ['120'],
                    },
                    null,
                ],
                type: 'diaboard_buzzer_speed_bpm',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let value   = script.getNumberValue('VALUE');
                value       = isNaN( value ) ? 120 : Math.round( value );       // 유효하지 않은 값은 120
                let bpm     = Math.max(Math.min( value, 300 ), 30 );            // BPM 범위는 30 ~ 300
                Entry.Diaboard.setBPM( bpm );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_speed_bpm(%1)'] },
        },
        diaboard_buzzer_speed_bpm_change: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'diaboard_buzzer_speed_bpm_change',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let value   = script.getNumberValue('VALUE');
                value       = isNaN( value ) ? 120 : Math.round( value );       // 유효하지 않은 값은 120
                let newVal  = Entry.Diaboard.getBPM() + value;
                let bpm     = Math.max( Math.min( newVal, 300 ), 30 );          // BPM 범위는 30 ~ 300
                Entry.Diaboard.setBPM( bpm );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_speed_bpm_change(%1)'] },
        },
        diaboard_buzzer_sleep_rhythm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: Entry.Diaboard.RHYTHM_TYPE,
                    value: 0.5,
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
                    null,
                ],
                type: 'diaboard_buzzer_sleep_rhythm',
            },
            paramsKeyMap: {
                RHYTHM: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let rhythm      = script.getNumberValue('RHYTHM');
                let second      = Entry.Diaboard.convertTimeForBPM( rhythm );   // 초
                let time        = second * 100;                                 // 메세지 시간 세팅 시 ( 초 * 100 )
                let cmd         = `b:n:96:${time}`;                             // 96은 무음 (박자 쉬기 블록일 때)
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn, second * 1000 );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_sleep_rhythm(%1)'] },
        },
        diaboard_buzzer_stop: {
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
                params: [
                    null,
                ],
                type: 'diaboard_buzzer_stop',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'buzzer',
            isNotFor: ['diaboard'],
            func: function(sprite, script) {
                let cmd         = `b:x`;
                Entry.Diaboard.fireCommand( cmd );
                return Entry.Diaboard.deferredReturn( script.callReturn );
            },
            syntax: { js: [], py: ['Diaboard.buzzer_stop(%1)'] },
        },
        //endregion Diaboard 비트브릭
    };
};
// 언어 적용
Entry.Diaboard.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                // 이벤트
                diaboard_when_button_pressed:		'%1 %2 버튼이 %3 일 때',
                diaboard_when_color_is:				'%1 컬러센서 색상이 %2 일 때',
                diaboard_when_sensor_is:			'%1 %2 값 %3 %4 일 때',
                // 센서/버튼 2
                diaboard_button_pressed:			'%1 버튼이 %2 인가?',
                diaboard_color_sensor_is:		    '컬러센서의 색상이 %1 인가?',
                diaboard_sensor_condition:			'%1 값 %2 %3 인가?',
                diaboard_color_sensor_seven_hue:    '컬러센서 색상(7가지)',
                diaboard_color_sensor_one_hue:		'컬러센서 색상(hue)',
                diaboard_sensor_value:				'%1 값',
                diaboard_convert_scale:				'변환 %1 값 %2 ~ %3 에서 %4 ~ %5',
                // 엘이디
                diaboard_led_rainbow:				'엘이디 무지개 효과를 켜기',
                diaboard_led_rainbow_time:			'엘이디 무지개 효과를 %1초 동안 켜기 %2',
                diaboard_led_effect:				'엘이디 %1 효과를 %2 (으)로 켜기 %3',
                diaboard_led_effect_time:			'엘이디 %1 효과를 %2 (으)로 %3 초 동안 켜기 %4',
                diaboard_led_six:				    '엘이디 %1 %2 %3 %4 %5 %6 (으)로 켜기 %7',
                diaboard_led_one:				    '엘이디 %1 (을)를 %2 (으)로 켜기 %3',
                diaboard_led_one_time:				'엘이디 %1 (을)를 %2 (으)로 %3 초 동안 켜기 %4',
                diaboard_led_hue:				    '엘이디 %1 (을)를 색상(hue) %2 (으)로 켜기 %3',
                diaboard_led_rgb:				    '엘이디 %1 (을)를 빨강 %2 녹색 %3 파랑 %4 (으)로 켜기 %5',
                diaboard_led_turn_off_all:			'엘이디 %1 끄기 %2',
                // 모터
                diaboard_servomotor_angle:			'서보모터 %1 각도 %2 %3',
                diaboard_servomotor_angle_time:		'서보모터 %1 각도 %2 ~ %3 범위를 %4 초 동안 동작 %5',
                diaboard_dc_direction_speed:		'디씨모터 %1 %2 방향 속력 %3 %4',
                diaboard_dc_direction_speed_time:	'디씨모터 %1 %2 방향 속력 %3 (으)로 %4 초 동안 동작 %5',
                diaboard_dc_speed:				    '디씨모터 %1 속도 %2 %3',
                diaboard_dc_speed_time:				'디씨모터 %1 속도 %2 (으)로 %3 초 동안 동작 %4',
                diaboard_turn_off_all_motors:		'모터 %1 멈추기 %2',
                // 버저
                diaboard_buzzer_melody_type:		'%1 멜로디 연주하기 %2',
                diaboard_buzzer_effect_type:		'%1 효과음 내기 %2',
                diaboard_buzzer_eight_melody_bpm:	'%1 %2 %3 %4 %5 %6 %7 %8 멜로디를 %9 BPM으로 연주하기 %10',
                diaboard_buzzer_octave:				'%1 옥타브 %2 음을 연주하기 %3',
                diaboard_buzzer_octave_rhythm:		'%1 옥타브 %2 음을 %3 박자 연주하기 %4',
                diaboard_buzzer_hz:				    '버저 음을 %1 Hz로 연주하기 %2',
                diaboard_buzzer_hz_change:			'버저 음을 %1 Hz 만큼 바꾸기 %2',
                diaboard_buzzer_speed_bpm:			'연주 속도를 %1 BPM으로 정하기 %2',
                diaboard_buzzer_speed_bpm_change:	'연주 속도를 %1 BPM만큼 바꾸기 %2',
                diaboard_buzzer_sleep_rhythm:		'%1 박자 쉬기',
                diaboard_buzzer_stop:				'버저음 멈추기',
            },
            Blocks: {
                DIABOARD_button_left:   '왼쪽',
                DIABOARD_button_right:  '오른쪽',
                DIABOARD_button_all:    '모든',
                DIABOARD_button_pressed:    '누름',
                DIABOARD_button_released:   '누르지 않음',
                DIABOARD_color_no_color:    '없음',
                DIABOARD_color_black:   '검정',
                DIABOARD_color_red:     '빨강',
                DIABOARD_color_yellow:  '노랑',
                DIABOARD_color_green:   '녹색',
                DIABOARD_color_cyan:    '청록',
                DIABOARD_color_blue:    '파랑',
                DIABOARD_color_magenta: '보라',
                DIABOARD_color_white:   '하양',
                DIABOARD_color_random:  '아무 색',
                DIABOARD_sensor_ir:            '적외선 센서',
                DIABOARD_sensor_brightness:    '밝기 센서',
                DIABOARD_effect_flame:     '불꽃',
                DIABOARD_effect_drop:      '별똥별',
                DIABOARD_effect_glitter:   '반짝임',
                DIABOARD_effect_dimming:   '숨쉬기',
                DIABOARD_effect_random:    '아무',
                DIABOARD_led_all:    '모두',
                DIABOARD_led_1:      '1',
                DIABOARD_led_2:      '2',
                DIABOARD_led_3:      '3',
                DIABOARD_led_4:      '4',
                DIABOARD_led_5:      '5',
                DIABOARD_led_6:      '6',
                DIABOARD_led_random: '아무 곳',
                DIABOARD_motor_a:   'A',
                DIABOARD_motor_b:   'B',
                DIABOARD_motor_all: '모두',
                DIABOARD_dc_direction_cw: '시계',
                DIABOARD_dc_direction_ccw: '반시계',
                DIABOARD_melody_rising:        '상승음',
                DIABOARD_melody_falling:       '하강음',
                DIABOARD_melody_forelise:      '엘리제를 위하여',
                DIABOARD_melody_tension:       '긴장감',
                DIABOARD_melody_connecting:    '연결음',
                DIABOARD_melody_jumpup:        '뛰어 오르는',
                DIABOARD_melody_jumpdown:      '뛰어 내리는',
                DIABOARD_melody_birthday:      '생일 축하',
                DIABOARD_effect_sound_happy:              "신바람",
                DIABOARD_effect_sound_sullen:             "시무룩",
                DIABOARD_effect_sound_sad:                "슬픔",
                DIABOARD_effect_sound_engery_gathering:   "에너지 모으는",
                DIABOARD_effect_sound_laser_beam:         "레이저빔",
                DIABOARD_tonicsolfa_do:         '도',
                DIABOARD_tonicsolfa_do_sharp:   '도#(레b)',
                DIABOARD_tonicsolfa_re:         '레',
                DIABOARD_tonicsolfa_re_sharp:   '레#(미b)',
                DIABOARD_tonicsolfa_mi:         '미',
                DIABOARD_tonicsolfa_fa:         '파',
                DIABOARD_tonicsolfa_fa_sharp:   '파#(솔b)',
                DIABOARD_tonicsolfa_sol:        '솔',
                DIABOARD_tonicsolfa_sol_sharp:  '솔#(라b)',
                DIABOARD_tonicsolfa_la:         '라',
                DIABOARD_tonicsolfa_la_sharp:   '라#(시b)',
                DIABOARD_tonicsolfa_si:         '시',
                DIABOARD_tonicsolfa_high_do:    '(높은)도',
                DIABOARD_tonicsolfa_rest:       '쉬기',
            },
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                // 이벤트
                diaboard_when_button_pressed:		'%1 when %2 button %3',
                diaboard_when_color_is:				'%1 when color is %2',
                diaboard_when_sensor_is:			'%1 when %2 %3 %4',
                // 센서/버튼 2
                diaboard_button_pressed:			'%1 button %2 ?',
                diaboard_color_sensor_is:		    'color is %1 ?',
                diaboard_sensor_condition:			'%1 %2 %3 ?',
                diaboard_color_sensor_seven_hue:    '7 colors',
                diaboard_color_sensor_one_hue:		'color hues',
                diaboard_sensor_value:				'%1 value',
                diaboard_convert_scale:				'map %1 value from %2 ~ %3 to %4 ~ %5',
                // 엘이디
                diaboard_led_rainbow:				'show effect rainbow %1',
                diaboard_led_rainbow_time:			'show effect rainbow for %1 seconds %2',
                diaboard_led_effect:				'show effect %1 to %2 %3',
                diaboard_led_effect_time:			'show effect %1 to %2 for %3 seconds %4',
                diaboard_led_six:				    'turn on %1 %2 %3 %4 %5 %6 %7',
                diaboard_led_one:				    'turn on %1 to %2 %3',
                diaboard_led_one_time:				'turn on %1 to %2 for %3 seconds %4',
                diaboard_led_hue:				    'turn on %1 to %2 %3',
                diaboard_led_rgb:				    'turn on %1 to red %2 green %3 blue %4 %5',
                diaboard_led_turn_off_all:			'turn off %1 %2',
                // 모터
                diaboard_servomotor_angle:			'servo motor %1 degree %2 %3',
                diaboard_servomotor_angle_time:		'servo motor %1 degree %2 ~ %3 for %4 seconds %5',
                diaboard_dc_direction_speed:		'DC motor %1 direction %2 speed %3 %4',
                diaboard_dc_direction_speed_time:	'DC motor %1 direction %2 speed %3 for %4 seconds %5',
                diaboard_dc_speed:				    'DC motor %1 velocity %2 %3',
                diaboard_dc_speed_time:				'DC motor %1 velocity %2 for %3 second %4',
                diaboard_turn_off_all_motors:		'stop %1 motor %2',
                // 버저
                diaboard_buzzer_melody_type:		'play melody %1 %2',
                diaboard_buzzer_effect_type:		'play sound %1 %2',
                diaboard_buzzer_eight_melody_bpm:	'play melody %1 %2 %3 %4 %5 %6 %7 %8 at tempo %9 bpm %10',
                diaboard_buzzer_octave:				'play octave %1 tone %2 %3',
                diaboard_buzzer_octave_rhythm:		'play octave %1 tone %2 for %3 beat %4',
                diaboard_buzzer_hz:				    'play tone %1 Hz %2',
                diaboard_buzzer_hz_change:			'change tone %1 Hz %2',
                diaboard_buzzer_speed_bpm:			'set tempo to %1 bpm %2',
                diaboard_buzzer_speed_bpm_change:	'change tempo by %1 bpm %2',
                diaboard_buzzer_sleep_rhythm:		'rest sound for %1 beat',
                diaboard_buzzer_stop:				'stop all sound',
            },
            Blocks: {
                DIABOARD_button_left:   'left',
                DIABOARD_button_right:  'right',
                DIABOARD_button_all:    'all',
                DIABOARD_button_pressed:    'pressed',
                DIABOARD_button_released:   'release',
                DIABOARD_color_no_color:    'no color',
                DIABOARD_color_black:   'black',
                DIABOARD_color_red:     'red',
                DIABOARD_color_yellow:  'yellow',
                DIABOARD_color_green:   'green',
                DIABOARD_color_cyan:    'cyan',
                DIABOARD_color_blue:    'blue',
                DIABOARD_color_magenta: 'magenta',
                DIABOARD_color_white:   'white',
                DIABOARD_color_random:  'random',
                DIABOARD_sensor_ir:            'IR',
                DIABOARD_sensor_brightness:    'Brightness',
                DIABOARD_effect_flame:     'flame',
                DIABOARD_effect_drop:      'drop',
                DIABOARD_effect_glitter:   'glitter',
                DIABOARD_effect_dimming:   'dimming',
                DIABOARD_effect_random:    'random',
                DIABOARD_led_all:    'all',
                DIABOARD_led_1:      '1',
                DIABOARD_led_2:      '2',
                DIABOARD_led_3:      '3',
                DIABOARD_led_4:      '4',
                DIABOARD_led_5:      '5',
                DIABOARD_led_6:      '6',                
                DIABOARD_led_random: 'random',                
                DIABOARD_motor_a:   'A',
                DIABOARD_motor_b:   'B',
                DIABOARD_motor_all: 'all',                
                DIABOARD_dc_direction_cw: 'CW',
                DIABOARD_dc_direction_ccw: 'CCW',
                DIABOARD_melody_rising:        'rising',
                DIABOARD_melody_falling:       'falling',
                DIABOARD_melody_forelise:      'For Elise',
                DIABOARD_melody_tension:       'tension',
                DIABOARD_melody_connecting:    'connecting',
                DIABOARD_melody_jumpup:        'jump up',
                DIABOARD_melody_jumpdown:      'jump down',
                DIABOARD_melody_birthday:      'birthday',
                DIABOARD_effect_sound_happy:              "happy",
                DIABOARD_effect_sound_sullen:             "sullen",
                DIABOARD_effect_sound_sad:                "sad",
                DIABOARD_effect_sound_engery_gathering:   "energy gathering",
                DIABOARD_effect_sound_laser_beam:         "laser beam",
                DIABOARD_tonicsolfa_do:         'do',
                DIABOARD_tonicsolfa_do_sharp:   'do#(reb)',
                DIABOARD_tonicsolfa_re:         're',
                DIABOARD_tonicsolfa_re_sharp:   're#(mib)',
                DIABOARD_tonicsolfa_mi:         'mi',
                DIABOARD_tonicsolfa_fa:         'fa',
                DIABOARD_tonicsolfa_fa_sharp:   'fa#(solb)',
                DIABOARD_tonicsolfa_sol:        'sol',
                DIABOARD_tonicsolfa_sol_sharp:  'sol#(lab)',
                DIABOARD_tonicsolfa_la:         'la',
                DIABOARD_tonicsolfa_la_sharp:   'la#(sib)',
                DIABOARD_tonicsolfa_si:         'si',
                DIABOARD_tonicsolfa_high_do:    '(C5)do',
                DIABOARD_tonicsolfa_rest:       'rest',
            },
        },
    };
};

module.exports = Entry.Diaboard;
