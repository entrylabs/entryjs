Entry.NeobotGameTheme = {
    id: '5.4',
    name: 'neobot_game_theme',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot_game_theme.png',
    title: {
        ko: '네오코딩 게임테마',
        en: 'NEOCODING GameTheme',
    },
    LOCAL_MAP: [
		'JoystickX',
		'JoystickY',
		'GyroX',
		'GyroY',
		'Acceleration',
		'BtnPressEvent',
		'JoystickPressEvent',
		'JoystickMoveEvent'
    ],
    setZero: function() {
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot_game_theme.png',
        width: 700,
        height: 700,
        listPorts: {
            JoystickX: { 
                name: 'JoystickX', 
                type: 'input',
                pos: { x: 0, y: 0 }
            },
            JoystickY: {
                name: 'JoystickY',
                type: 'input', 
                pos: { x: 0, y: 0 } 
            },
            GyroX: {
                name: 'GyroX', 
                type: 'input', 
                pos: { x: 0, y: 0 } 
            },
            GyroY: {
                name: 'GyroY', 
                type: 'input', 
                pos: { x: 0, y: 0 }
            },
            Acceleration: {
                name: 'Accel', 
                type: 'input', 
                pos: { x: 0, y: 0 } 
            },
        },
        ports: {
            /* JoystickX: { 
                name: 'Joystick X', 
                type: 'input',
                pos: { x: 200, y: 200 }
            },
            JoystickY: {
                name: 'Joystick Y',
                type: 'input', 
                pos: { x: 200, y: 200 } 
            },
            GyroX: {
                name: 'Gyro X', 
                type: 'input', 
                pos: { x: 400, y: 200 } 
            },
            GyroY: {
                name: 'Gyro Y', 
                type: 'input', 
                pos: { x: 400, y: 200 }
            },
            Acceleration: {
                name: 'Accel', 
                type: 'input', 
                pos: { x: 500, y: 200 } 
            },
            JoystickPressEvent: {
                name: 'Joystick Press', 
                type: 'input', 
                pos: { x: 200, y: 500 } 
            },
            JoystickMoveEvent: { 
                name: 'Joystick Move', 
                type: 'input', 
                pos: { x: 200, y: 500 } 
            },
            BtnPressEvent: { 
                name: 'Button', 
                type: 'input', 
                pos: { x: 400, y: 500 } 
            }, */
        },
        mode: 'both',
    },
    isNumber: function(s) {
        s += '';
        s = s.replace(/^\s*|\s*$/g, '');
        if (s == '' || isNaN(s)) return false;
        return true;
    }
};

Entry.NeobotGameTheme.setLanguage = function() {
    return {
        ko: {
            template: {
                // class neobot_value
                neobot_gyro_value: '자이로 %1 값', 
                neobot_joystick_value: '조이스틱 %1 값',
                neobot_crash_value: '가속값',
                neobot_random_value: '%1 랜덤값',
                // class neobot_judgement
                neobot_judge_joystick_move: '조이스틱 컨트롤? %1',
                neobot_judge_joystick_direction: '조이스틱 방향? %1',
                neobot_judge_button: '%1 버튼 클릭?',
                neobot_judge_gyro_direction_angle: '%1으로 기울었는가?',
                neobot_judge_coord: '%1위치 %2 %3',
                neobot_judge_crash: '가속값 %1 %2',
                // class neobot_movement
                neobot_locate: '%1위치로 %2이동하기%3',
                neobot_look: '%1쪽 바라보기%2',

                // dropdown
                get_gyro_degree: '%1',
                get_move_method: '%1',
                get_number_type1: '%1',
                get_number_type2: '%1',
            },
            Blocks: {
                neobot_axis_x: 'X',
                neobot_axis_y: 'Y',

                neobot_joystick_move_1: '뒤에서 앞으로',
                neobot_joystick_move_2: '밑에서 위로',
                neobot_joystick_move_3: '아래 반바퀴',
                neobot_joystick_move_4: '한 바퀴',

                neobot_joystick_dir_right: '오른쪽',
                neobot_joystick_dir_left: '왼쪽',
                neobot_joystick_dir_up: '위',
                neobot_joystick_dir_down: '아래',
                
                neobot_button_a: 'A',
                neobot_button_b: 'B',
                neobot_button_c: 'C',
                
                neobot_gyro_dir_left: '왼쪽',
                neobot_gyro_dir_right: '오른쪽',
                neobot_gyro_dir_front: '앞쪽',
                neobot_gyro_dir_rear: '뒤쪽',
                
                neobot_degree_0: '0',
                neobot_degree_5: '5',
                neobot_degree_10: '10',
                neobot_degree_15: '15',
                neobot_degree_20: '20',
                neobot_degree_25: '25',
                neobot_degree_30: '30',
                neobot_degree_35: '35',
                neobot_degree_40: '40',
                neobot_degree_45: '45',
                neobot_degree_50: '50',
                neobot_degree_55: '55',
                neobot_degree_60: '60',
                neobot_degree_65: '65',
                neobot_degree_70: '70',
                neobot_degree_75: '75',
                neobot_degree_80: '80',
                neobot_degree_85: '85',
                neobot_degree_90: '90',
                neobot_degree_95: '95',
                neobot_degree_100: '100',
                neobot_degree_105: '105',
                neobot_degree_110: '110',
                neobot_degree_115: '115',
                neobot_degree_120: '120',
                neobot_degree_125: '125',
                neobot_degree_130: '130',
                neobot_degree_135: '135',
                neobot_degree_140: '140',
                neobot_degree_145: '145',
                neobot_degree_150: '150',
                neobot_degree_155: '155',
                neobot_degree_160: '160',
                neobot_degree_165: '165',
                neobot_degree_170: '170',
                neobot_degree_175: '175',
                neobot_degree_180: '180',
                
                neobot_joystick_x: '조이스틱 X',
                neobot_joystick_y: '조이스틱 Y',
                neobot_gyro_x: '자이로센서 X',
                neobot_gyro_y: '자이로센서 Y',

                neobot_compare_left_bigger: '>',
                neobot_compare_equal: '=',
                neobot_compare_right_bigger: '<',

                neobot_joystick: '조이스틱',
                neobot_gyro: '자이로센서',

                neobot_realtime: '실시간',
                neobot_from_distance: '거리대비',

                neobot_joystick_coord: '조이스틱 위치',
                neobot_gyro_coord: '자이로센서 위치',
            }
        },
        en: {
            template: {
                // class neobot_value
                neobot_gyro_value: 'Gyro sensor value %1', 
                neobot_joystick_value: 'Joystick position %1',
                neobot_crash_value: 'Impact value',
                neobot_random_value: 'Random position %1',
                // class neobot_judgement // TODO translate english
                neobot_judge_joystick_move: 'Moved the joystick? %1',
                neobot_judge_joystick_direction: 'Joystick in the %1',
                neobot_judge_button: 'Press the %1 button?',
                neobot_judge_gyro_direction_angle: 'Is it tilted to %1',
                neobot_judge_coord: 'The %1position %2 %3',
                neobot_judge_crash: 'Impact value %1 %2',
                // class neobot_movement
                neobot_locate: 'Move to %1position %2 %3',
                neobot_look: 'Looking at the %1 position %2',

                // dropdown
                get_gyro_degree: '%1',
                get_move_method: '%1',
                get_number_type1: '%1',
                get_number_type2: '%1',
            },
            Blocks: {
                neobot_axis_x: 'X',
                neobot_axis_y: 'Y',

                neobot_joystick_move_1: 'From back to front',
                neobot_joystick_move_2: 'From bottom up',
                neobot_joystick_move_3: 'Half turn down',
                neobot_joystick_move_4: 'One rotation',

                neobot_joystick_dir_right: 'right',
                neobot_joystick_dir_left: 'left',
                neobot_joystick_dir_up: 'up',
                neobot_joystick_dir_down: 'down',
                
                neobot_button_a: 'A',
                neobot_button_b: 'B',
                neobot_button_c: 'C',
                
                neobot_gyro_dir_left: 'left',
                neobot_gyro_dir_right: 'right',
                neobot_gyro_dir_front: 'forward',
                neobot_gyro_dir_rear: 'backward',
                
                neobot_degree_0: '0',
                neobot_degree_5: '5',
                neobot_degree_10: '10',
                neobot_degree_15: '15',
                neobot_degree_20: '20',
                neobot_degree_25: '25',
                neobot_degree_30: '30',
                neobot_degree_35: '35',
                neobot_degree_40: '40',
                neobot_degree_45: '45',
                neobot_degree_50: '50',
                neobot_degree_55: '55',
                neobot_degree_60: '60',
                neobot_degree_65: '65',
                neobot_degree_70: '70',
                neobot_degree_75: '75',
                neobot_degree_80: '80',
                neobot_degree_85: '85',
                neobot_degree_90: '90',
                neobot_degree_95: '95',
                neobot_degree_100: '100',
                neobot_degree_105: '105',
                neobot_degree_110: '110',
                neobot_degree_115: '115',
                neobot_degree_120: '120',
                neobot_degree_125: '125',
                neobot_degree_130: '130',
                neobot_degree_135: '135',
                neobot_degree_140: '140',
                neobot_degree_145: '145',
                neobot_degree_150: '150',
                neobot_degree_155: '155',
                neobot_degree_160: '160',
                neobot_degree_165: '165',
                neobot_degree_170: '170',
                neobot_degree_175: '175',
                neobot_degree_180: '180',
                
                neobot_joystick_x: 'joystick X',
                neobot_joystick_y: 'joystick Y',
                neobot_gyro_x: 'gyro sensor X',
                neobot_gyro_y: 'gyro sensor Y',
                
                neobot_compare_left_bigger: '>',
                neobot_compare_equal: '=',
                neobot_compare_right_bigger: '<',

                neobot_joystick: 'joystick',
                neobot_gyro: 'gyro sensor',

                neobot_realtime: 'in real time',
                neobot_from_distance: 'relative to distance',

                neobot_joystick_coord: 'joystick position',
                neobot_gyro_coord: 'gyro sensor position',
            },
        },
    };
};

Entry.NeobotGameTheme.blockMenuBlocks = [
    'neobot_gyro_value',
    'neobot_joystick_value',
    'neobot_crash_value',
    'neobot_random_value',
    'neobot_judge_joystick_move',
    'neobot_judge_joystick_direction',
    'neobot_judge_button',
    'neobot_judge_gyro_direction_angle',
    'neobot_judge_coord',
    'neobot_judge_crash',
    'neobot_locate',
    'neobot_look',
];

Entry.NeobotGameTheme.getBlocks = function() {
    return {
        /**
         *  Class neobot_value
         */
        neobot_gyro_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_axis_x, 'GyroX'],
                        [Lang.Blocks.neobot_axis_y, 'GyroY'],
                    ],
                    value: 'GyroX',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_gyro_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return port == 'GyroX' ? Entry.hw.portData[port] : Entry.hw.portData[port];
            },
            syntax: { js: [], py: ['NeobotGameTheme.gyro_value(%1)'] },
        },
    
        neobot_joystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_axis_x, 'JoystickX'],
                        [Lang.Blocks.neobot_axis_y, 'JoystickY'],
                    ],
                    value: 'JoystickX',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_joystick_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return port == 'JoystickX' ? Entry.hw.portData[port] : Entry.hw.portData[port];
            },
            syntax: { js: [], py: ['NeobotGameTheme.joystick_value(%1)'] },
        },

        neobot_crash_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            def: {
                type: 'neobot_crash_value',
            },
            class: 'neobot_value',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['Acceleration'];
            },
            syntax: { js: [], py: ['NeobotGameTheme.joystick_value(%1)'] },
        },

        neobot_random_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_axis_x, 'X'],
                        [Lang.Blocks.neobot_axis_y, 'Y'],
                    ],
                    value: 'X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_random_value',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var axis = script.getStringField('AXIS');
                var randNum = 0;
                if (axis == 'X') {
                    randNum = Math.floor(Math.random() * 480) - 240;
                } else if (axis == 'Y') {
                    randNum = Math.floor(Math.random() * 270) - 135;
                }
                return randNum;
            },
            syntax: { js: [], py: ['NeobotGameTheme.random_value(%1)'] },
        },

        /**
         *  Class neobot_judgement
         */
        neobot_judge_joystick_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_joystick_move_1, '1'],
                        [Lang.Blocks.neobot_joystick_move_2, '2'],
                        [Lang.Blocks.neobot_joystick_move_3, '3'],
                        [Lang.Blocks.neobot_joystick_move_4, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_judge_joystick_move',
            },
            paramsKeyMap: {
                MOVE: 0,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var move = script.getNumberField('MOVE');
                var value = Entry.hw.portData['JoystickMoveEvent'];
                
                if ( move == '1' && value == '1' ) return true;
                else if ( move == '2' && value =='3' ) return true;
                else if ( move == '3' && (value == '5' || value == '6') ) return true;
                else if ( move == '4' && (value == '7' || value == '8') ) return true;
                else return false;
            },
        },
        
        neobot_judge_joystick_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_joystick_dir_right, '3'],
                        [Lang.Blocks.neobot_joystick_dir_left, '7'],
                        [Lang.Blocks.neobot_joystick_dir_up, '1'],
                        [Lang.Blocks.neobot_joystick_dir_down, '5'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_judge_joystick_direction',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var dir = script.getNumberField('DIR');
                var value = Entry.hw.portData['JoystickPressEvent'];
                return dir == value;
            },
        },

        neobot_judge_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_button_a, '1'],
                        [Lang.Blocks.neobot_button_b, '2'],
                        [Lang.Blocks.neobot_button_c, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_judge_button',
            },
            paramsKeyMap: {
                BTN: 0,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var button = script.getNumberField('BTN');
                var value = Entry.hw.portData['BtnPressEvent'];
                return button == value;
            },
        },

        // don't use
        get_gyro_degree: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_degree_0, '0'],
                        [Lang.Blocks.neobot_degree_5, '5'],
                        [Lang.Blocks.neobot_degree_10, '10'],
                        [Lang.Blocks.neobot_degree_15, '15'],
                        [Lang.Blocks.neobot_degree_20, '20'],
                        [Lang.Blocks.neobot_degree_25, '25'],
                        [Lang.Blocks.neobot_degree_30, '30'],
                        [Lang.Blocks.neobot_degree_35, '35'],
                        [Lang.Blocks.neobot_degree_40, '40'],
                        [Lang.Blocks.neobot_degree_45, '45'],
                        [Lang.Blocks.neobot_degree_50, '50'],
                        [Lang.Blocks.neobot_degree_55, '55'],
                        [Lang.Blocks.neobot_degree_60, '60'],
                        [Lang.Blocks.neobot_degree_65, '65'],
                        [Lang.Blocks.neobot_degree_70, '70'],
                        [Lang.Blocks.neobot_degree_75, '75'],
                        [Lang.Blocks.neobot_degree_80, '80'],
                        [Lang.Blocks.neobot_degree_85, '85'],
                        [Lang.Blocks.neobot_degree_90, '90'],
                        [Lang.Blocks.neobot_degree_95, '95'],
                        [Lang.Blocks.neobot_degree_100, '100'],
                        [Lang.Blocks.neobot_degree_105, '105'],
                        [Lang.Blocks.neobot_degree_110, '110'],
                        [Lang.Blocks.neobot_degree_115, '115'],
                        [Lang.Blocks.neobot_degree_120, '120'],
                        [Lang.Blocks.neobot_degree_125, '125'],
                        [Lang.Blocks.neobot_degree_130, '130'],
                        [Lang.Blocks.neobot_degree_135, '135'],
                        [Lang.Blocks.neobot_degree_140, '140'],
                        [Lang.Blocks.neobot_degree_145, '145'],
                        [Lang.Blocks.neobot_degree_150, '150'],
                        [Lang.Blocks.neobot_degree_155, '155'],
                        [Lang.Blocks.neobot_degree_160, '160'],
                        [Lang.Blocks.neobot_degree_165, '165'],
                        [Lang.Blocks.neobot_degree_170, '170'],
                        [Lang.Blocks.neobot_degree_175, '175'],
                        [Lang.Blocks.neobot_degree_180, '180'],
                    ],
                    value: '45',
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_gyro_degree#'] },
        },

        get_number_type1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['10', '10'],
                        ['20', '20'],
                        ['30', '30'],
                        ['40', '40'],
                        ['50', '50'],
                        ['60', '60'],
                        ['70', '70'],
                        ['80', '80'],
                        ['90', '90'],
                        ['100', '100'],
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
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_number_type1#'] },
        },

        get_number_type2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['10', '10'],
                        ['20', '20'],
                        ['30', '30'],
                        ['40', '40'],
                        ['50', '50'],
                        ['60', '60'],
                        ['70', '70'],
                        ['80', '80'],
                        ['90', '90'],
                        ['100', '100'],
                    ],
                    value: '50',
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_number_type1#'] },
        },

        neobot_judge_gyro_direction_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_gyro_dir_left, '1'],
                        [Lang.Blocks.neobot_gyro_dir_right, '2'],
                        [Lang.Blocks.neobot_gyro_dir_front, '3'],
                        [Lang.Blocks.neobot_gyro_dir_rear, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'neobot_judge_gyro_direction_angle',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var direction = script.getNumberField('DIR');
                /* var degree = Entry.parseNumber(script.getStringValue('DEGREE')); */
                var gyroX = Entry.hw.portData['GyroX'];
                var gyroY = Entry.hw.portData['GyroY'];
                var isTilted = false;

                switch (direction) {
                    case 1: // 왼쪽
                        if (gyroX < -80)
                            isTilted = true;
                        break;
                    case 2: // 오른쪽
                        if (gyroX > 80) 
                            isTilted = true;
                        break;
                    case 3: // 앞
                        if (gyroY > 45)
                            isTilted = true;
                        break;
                    case 4: // 뒤
                        if (gyroY < -45)
                            isTilted = true;
                        break;
                }

                return isTilted;
            },
        },

        neobot_judge_coord: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_joystick_x, 'X'],
                        [Lang.Blocks.neobot_joystick_y, 'Y'],
                    ],
                    value: 'X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_compare_left_bigger, '>'],
                        [Lang.Blocks.neobot_compare_equal, '='],
                        [Lang.Blocks.neobot_compare_right_bigger, '<'],
                    ],
                    value: '>',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    '0',
                    /* {
                        type: 'get_number_type1',
                        id: 'm200',
                    }, */
                ],
                type: 'neobot_judge_coord',
            },
            paramsKeyMap: {
                AXIS: 0,
                COMPARE: 1,
                VALUE: 2,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var axis = script.getStringField('AXIS');
                var compare = script.getStringField('COMPARE');
                var targetValue = script.getNumberValue('VALUE');

                var ret = false;
                var portValue = ( axis == 'X' ? Entry.hw.portData['JoystickX'] : Entry.hw.portData['JoystickY'] );
                switch (compare) {
                    case '>':
                        if (portValue > targetValue) ret = true;
                        else ret = false;
                        break;
                    case '=':
                        if (portValue == targetValue) ret = true;
                        else ret = false;
                        break;
                    case '<':
                        if (portValue < targetValue) ret = true;
                        else ret = false;
                        break;
                }
                
                return ret;
            },
        },

        neobot_judge_crash: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_compare_left_bigger, '>'],
                        [Lang.Blocks.neobot_compare_equal, '='],
                        [Lang.Blocks.neobot_compare_right_bigger, '<'],
                    ],
                    value: '>',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        type: 'get_number_type2',
                        id: 'm300',
                    },
                ],
                type: 'neobot_judge_crash',
            },
            paramsKeyMap: {
                COMPARE: 0,
                VALUE: 1,
            },
            class: 'neobot_judgement',
            isNotFor: ['neobot_game_theme'],
            func: function(sprite, script) {
                var compare = script.getStringField('COMPARE');
                var targetValue = Entry.parseNumber(script.getStringValue('VALUE'));

                var ret = false;
                var portValue = Entry.hw.portData['Acceleration'];
                switch (compare) {
                    case '>':
                        if (portValue > targetValue) ret = true;
                        else ret = false;
                        break;
                    case '=':
                        if (portValue == targetValue) ret = true;
                        else ret = false;
                        break;
                    case '<':
                        if (portValue < targetValue) ret = true;
                        else ret = false;
                        break;
                }
                
                return ret;
            },
        },

        get_move_method: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_realtime, 'Realtime'],
                        [Lang.Blocks.neobot_from_distance, 'Distance'],
                    ],
                    value: 'Realtime',
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_move_method#'] },
        },

        neobot_locate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_joystick,   'Joystick'],
                        [Lang.Blocks.neobot_gyro,       'Gyro'],
                        [Lang.Blocks.neobot_joystick_x, 'JX'],
                        [Lang.Blocks.neobot_joystick_y, 'JY'],
                        [Lang.Blocks.neobot_gyro_x,     'GX'],
                        [Lang.Blocks.neobot_gyro_y,     'GY'],
                    ],
                    value: 'Joystick',
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
                    {
                        type: 'get_move_method',
                        id: 'm100',
                    },
                    null
                ],
                type: 'neobot_locate',
            },
            paramsKeyMap: {
                DEVICE: 0,
                METHOD: 1,
            },
            class: 'neobot_movement',
            isNotFor: ['neobot_game_theme'],
            func(sprite, script) {
                const targetDevice = script.getField('DEVICE', script);
                const targetMethod = script.getStringValue('METHOD', script);
                
                var targetX;
                var targetY;

                switch (targetDevice) {
                    case 'Joystick':
                        targetX = Entry.hw.portData['JoystickX'];
                        targetY = Entry.hw.portData['JoystickY'];
                        break;
                    case 'Gyro':
                        targetX = Entry.hw.portData['GyroX'];
                        targetY = Entry.hw.portData['GyroY'];
                        break;
                    case 'JX':
                        targetX = Entry.hw.portData['JoystickX'];
                        targetY = sprite.getY();
                        break;
                    case 'JY':
                        targetX = sprite.getX();
                        targetY = Entry.hw.portData['JoystickY'];
                        break;
                    case 'GX':
                        targetX = Entry.hw.portData['GyroX'];
                        targetY = sprite.getY();
                        break;
                    case 'GY':
                        targetX = sprite.getX();
                        targetY = Entry.hw.portData['GyroY'];
                        break;
                }

                /* var targetX = (targetDevice == 'Joystick' ?
                 Entry.hw.portData['JoystickX'] : Entry.hw.portData['GyroX'] );
                var targetY = (targetDevice == 'Joystick' 
                ? Entry.hw.portData['JoystickY'] : Entry.hw.portData['GyroY']
                ); */
                
                var distX = targetX - sprite.getX();
                var distY = targetY - sprite.getY();
                
                const isNumber = Entry.NeobotGameTheme.isNumber(targetMethod);
                // 드롭다운 제거 후 별도 숫자, 센서 값 등을 입력한 경우
                if (isNumber) {
                    var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                    if (dist > Number(targetMethod)) {
                        // move direction
                        var angle;
                        if (distX === 0 && distY === 0) {
                            angle = sprite.getDirection() + sprite.getRotation();
                        } else if (distX >= 0) {
                            angle = -Math.atan(distY / distX) / Math.PI * 180 + 90;
                        } else {
                            angle = -Math.atan(distY / distX) / Math.PI * 180 + 270;
                        }
                        sprite.setX(
                            sprite.getX() +
                            Number(targetMethod) *
                            Math.cos(
                                (angle - 90) /
                                180 *
                                Math.PI
                                )
                        );
                        sprite.setY(
                            sprite.getY() -
                            Number(targetMethod) *
                            Math.sin(
                                (angle - 90) /
                                    180 *
                                    Math.PI
                                )
                        );

                    } else {
                        sprite.setX(targetX);
                        sprite.setY(targetY);
                    }
                    return script.callReturn();
                } else { // 드롭다운 값을 선택한 경우
                    if (targetMethod == 'Distance') {
                        sprite.setX(sprite.getX() + distX/50);
                        sprite.setY(sprite.getY() + distY/50);
                        return script.callReturn();
                    } else {
                        sprite.setX(targetX);
                        sprite.setY(targetY);
                        /* if (sprite.brush && !sprite.brush.stop) {
                            sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
                        } */
                        return script.callReturn();
                    }
                } // end else
            }, // end func
        },

        neobot_look: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_joystick_coord, 'Joystick'],
                        [Lang.Blocks.neobot_gyro_coord, 'Gyro'],
                    ],
                    value: 'Joystick',
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
                params: [null, null],
                type: 'neobot_look',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'neobot_movement',
            isNotFor: ['neobot_game_theme'],
            func(sprite, script) {
                const targetDevice = script.getField('DEVICE', script);
                var targetX = (targetDevice == 'Joystick' 
                        ? Entry.hw.portData['JoystickX'] : Entry.hw.portData['GyroX'] );
                var targetY = (targetDevice == 'Joystick' 
                        ? Entry.hw.portData['JoystickY'] : Entry.hw.portData['GyroY'] );
                const spriteX = sprite.getX();
                const spriteY = sprite.getY();
                let deltaX = targetX - spriteX;
                let deltaY = targetY - spriteY;
                let value;

                if (deltaX === 0 && deltaY === 0) {
                    value = sprite.getDirection() + sprite.getRotation();
                } else if (deltaX >= 0) {
                    value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 90;
                } else {
                    value = -Math.atan(deltaY / deltaX) / Math.PI * 180 + 270;
                }
                if (this.entity.parent.getRotateMethod() === 'free') {
                    const nativeDirection = sprite.getDirection() + sprite.getRotation();
                    sprite.setRotation(sprite.getRotation() + value - nativeDirection);
                } else {
                    sprite.setDirection(value);   
                }
                return script.callReturn();
            },
            
        },

    }; // end getBlocks
};

module.exports = Entry.NeobotGameTheme;
