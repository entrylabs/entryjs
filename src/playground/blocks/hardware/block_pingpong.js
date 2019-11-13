'use strict';

Entry.Pingpong_G1 = {
    id: '35.1',
    name: 'Pingpong_G1',
    url: 'http://roborisen.com',
    imageName: 'pingpong_g1.png',
    delayTime: 30,
    title: {
		ko: '핑퐁 G1',
        en: 'Pingpong G1',
    },

	TILT_THRESHOLD: 20,
	MOVE_THRESHOLD: 30,
	send_cmd_id: 0,

	sensor_data: {
		MOVE_X: 0,
		MOVE_Y: 0,
		MOVE_Z: 0,
		TILT_X: 0,
		TILT_Y: 0,
		TILT_Z: 0,
		BUTTON: 0,
		PROXIMITY: 0,
		AIN: 0
	},
	prev_sensor_data: {
		MOVE_X: 0,
		MOVE_Y: 0,
		MOVE_Z: 0,
		TILT_X: 0,
		TILT_Y: 0,
		TILT_Z: 0,
		BUTTON: 0,
		PROXIMITY: 0,
		AIN: 0
	},

    setZero: function() {
		//console.log(Entry.hw.sendQueue);

		Entry.hw.sendQueue.COMMAND = {
			id: -1,
		};
		Entry.hw.update();

		Entry.hw.sendQueue.COMMAND = {};
    },
	//afterReceive({ BUTTON, MOVE_Z, TILT_X, TILT_Y }) {
	afterReceive(pd) {
		//console.log(pd);
		//this.sensor_data = pd.SENSOR;

		//if (Entry.engine.isState('run') && this.prev_sensor_data.BUTTON != BUTTON) {
		if (this.prev_sensor_data.BUTTON != pd.BUTTON) {
			this.prev_sensor_data.BUTTON = pd.BUTTON;
			Entry.engine.fireEvent('pp_when_button_pressed');
		}

		if (Entry.engine.isState('run')) {
			if (Math.abs(pd.MOVE_Z) >= Entry.Pingpong_G1.MOVE_THRESHOLD) {
				//this.prev_sensor_data.MOVE_Z = MOVE_Z;
				Entry.engine.fireEvent('pp_when_moved');
			}
			if ((Math.abs(pd.TILT_X) >= Entry.Pingpong_G1.TILT_THRESHOLD)
				|| (Math.abs(pd.TILT_Y) >= Entry.Pingpong_G1.TILT_THRESHOLD)) {
				Entry.engine.fireEvent('pp_when_tilted');
			}
		}

	},
	monitorTemplate: {
		imgPath: 'hw/pingpong_g1.png',
		width: 400,
        height: 400,
        listPorts: {
			BUTTON: {
				name: 'button',
				type: 'input',
				pos: { x:0, y:0 },
			},
			MOVE_X: {
				name: 'move_x',
				type: 'input',
				pos: { x:0, y:0 },
			},
			MOVE_Y: {
				name: 'move_y',
				type: 'input',
				pos: { x:0, y:0 },
			},
			MOVE_Z: {
				name: 'move_z',
				type: 'input',
				pos: { x:0, y:0 },
			},
			TILT_X: {
				name: 'tilt_x',
				type: 'input',
				pos: { x:0, y:0 },
			},
			TILT_Y: {
				name: 'tilt_y',
				type: 'input',
				pos: { x:0, y:0 },
			},
			TILT_Z: {
				name: 'tilt_z',
				type: 'input',
				pos: { x:0, y:0 },
			},
			PROXIMITY: {
				name: 'proximity',
				type: 'input',
				pos: { x:0, y:0 },
			},
			AIN: {
				name: 'ain',
				type: 'input',
				pos: { x:0, y:0 },
			},
		},
		ports: {
		},
        mode: 'both',
    },


};

function makePacketHeader(opcode, task_id, opt) {
	// make heder   ( cubeid, cubecnt, op, size, method
	var header = Buffer.from(
		[	0xFF, 0xFF,
			0xFF, 0xFF,
			0, 0,
			opcode,
			0, 0
		]);
	var property = Buffer.from(opt);

	//header.writeUInt16BE(0xFFFF, 0);
	//header.writeUInt16BE(0xFFFF, 2);	// cubdid

	header.writeUInt16BE(task_id, 4);
	header.writeUInt16BE(header.length + property.length, 7);

	return Buffer.concat([header, property]);
};

Entry.Pingpong_G1.blockMenuBlocks = [
	'pingpong_g1_when_button_pressed',
	'pingpong_g1_is_button_pressed',
	'pingpong_g1_when_moved',
	'pingpong_g1_when_tilted',
	'pingpong_g1_is_tilted',
	'pingpong_g1_get_tilt_circle',
	'pingpong_g1_get_tilt_triangle',
	'pingpong_g1_get_tilt_star',
	'pingpong_g1_get_tilt_rectangle',
	//'pingpong_g1_is_top_shape',
	'pingpong_g1_get_sensor_value',
	'pingpong_g1_motor_rotate',
	'pingpong_g1_rotate_servo_mortor',
	'pingpong_g1_set_led_color',
	'pingpong_g1_set_dotmatrix',
];

Entry.Pingpong_G1.getBlocks = function() {
    return {
        pingpong_g1_when_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
			],
            events: {},
            def: {
                params: [],
                type: 'pingpong_g1_when_button_pressed',
            },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
			event: 'pp_when_button_pressed',
            func: function(sprite, script) {
                var buttonData = Entry.hw.portData.BUTTON;
				//console.log('event: button_pressed? ' + buttonData);

                if (buttonData != 1) {
					return this.die();
                }
				return script.callReturn();
            },
        },
        pingpong_g1_when_moved: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pingpong_left, 'LEFT'],
                        [Lang.Blocks.pingpong_right, 'RIGHT'],
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
                type: 'pingpong_g1_when_moved',
            },
            paramsKeyMap: {
                DIRECTION: 1,
            },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
			event: 'pp_when_moved',
            func: function(sprite, script) {
                const dir = script.getStringField('DIRECTION');
                var pd = Entry.hw.portData;

				if ((dir == 'LEFT' && (pd.MOVE_Z*-1) >= Entry.Pingpong_G1.MOVE_THRESHOLD)
					|| (dir == 'RIGHT' && pd.MOVE_Z >= Entry.Pingpong_G1.MOVE_THRESHOLD)) {
					return script.callReturn();
				}
				return this.die();
            },
        },
		pingpong_g1_when_tilted: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pingpong_circle, 'FRONT'],
                        [Lang.Blocks.pingpong_triangle, 'BACK'],
                        [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                        [Lang.Blocks.pingpong_star, 'RIGHT'],
                    ],
					value: 'FRONT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'pingpong_g1_when_tilted',
            },
            paramsKeyMap: {
                TILT_DIR: 1,
            },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
			event: "pp_when_tilted",
            func: function(sprite, script) {
                const tilt_dir = script.getStringField('TILT_DIR');
                var pd = Entry.hw.portData;

				var tilt_value = 0;
				switch (tilt_dir) {
					case 'FRONT': tilt_value = pd.TILT_X * -1; break;
					case 'BACK':  tilt_value = pd.TILT_X; break;
					case 'LEFT':  tilt_value = pd.TILT_Y * -1; break;
					case 'RIGHT': tilt_value = pd.TILT_Y; break;
					default: break;
				}

				if  (tilt_value >= Entry.Pingpong_G1.TILT_THRESHOLD)
					return script.callReturn();
				else
					return this.die();
            },
        },
		pingpong_g1_is_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            //statements: [],
            //params: [],
            //events: {},
            def: {
                type: 'pingpong_g1_is_button_pressed',
            },
            //paramsKeyMap: { },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
				//return Entry.Pingpong_G1.sensor_data.BUTTON == 1;
				return pd.BUTTON == 1;
            },
        },
		pingpong_g1_is_tilted: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            //statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pingpong_circle, 'FRONT'],
                        [Lang.Blocks.pingpong_triangle, 'BACK'],
                        [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                        [Lang.Blocks.pingpong_star, 'RIGHT'],
                    ],
					value: 'FRONT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
			],
            //events: {},
            def: { params: [], type: 'pingpong_g1_is_tilted' },
            paramsKeyMap: {
                TILT_DIR: 0,
            },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
                const tilt_dir = script.getStringField('TILT_DIR', script);
                var pd = Entry.hw.portData;
				var tilt_value = 0;
				switch (tilt_dir) {
					case 'FRONT': tilt_value = pd.TILT_X * -1; break;
					case 'BACK':  tilt_value = pd.TILT_X; break;
					case 'LEFT':  tilt_value = pd.TILT_Y * -1; break;
					case 'RIGHT': tilt_value = pd.TILT_Y; break;
					default: break;
				}
				return (tilt_value >= Entry.Pingpong_G1.TILT_THRESHOLD);
            },
        },
		pingpong_g1_get_tilt_circle: {	//'동그라미 방향 큐브 기울기',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [],
			events: {
				viewAdd: [ function() {
					//console.log('... viewAdd called!');
				}],
				viewDestroy: [ function() {
					//console.log('... viewDestroy called!');
				}],
				dataAdd: [ function(block) {
					//console.log(' ...... dataAdd called');
				}],
				dataDestroy: [ function(block) {
					//console.log(' ...... dataDestroy called');
				}],
			},
            def: { params: [], type: 'pingpong_g1_get_tilt_circle' },
            paramsKeyMap: { },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				return Entry.hw.portData.TILT_X * -1;
            },
		},
		pingpong_g1_get_tilt_triangle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [],
            def: { params: [], type: 'pingpong_g1_get_tilt_triangle' },
            paramsKeyMap: { },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				return Entry.hw.portData.TILT_X;
            },
		},
		pingpong_g1_get_tilt_rectangle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [],
            def: { params: [], type: 'pingpong_g1_get_tilt_rectangle' },
            paramsKeyMap: { },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				return Entry.hw.portData.TILT_Y * -1;
            },
		},
		pingpong_g1_get_tilt_star: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [],
            def: { params: [], type: 'pingpong_g1_get_tilt_star' },
            paramsKeyMap: { },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				return Entry.hw.portData.TILT_Y;
            },
		},
		pingpong_g1_get_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            params: [
				{
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pingpong_sensor_proximity, 'PROXIMITY'],
                        [Lang.Blocks.pingpong_sensor_ain, 'AIN'],
                    ],
					value: 'PROXIMITY',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
            def: { params: [], type: 'pingpong_g1_get_sensor_value' },
            paramsKeyMap: {	SENSOR: 0, },
            class: 'Pingpong_G1',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
                const sensor_type = script.getStringField('SENSOR', script);
                var pd = Entry.hw.portData;
				var value = 0;
				switch (sensor_type) {
					case 'PROXIMITY': value = pd.PROXIMITY; break;
					case 'AIN':  value = pd.AIN; break;
					default: break;
				}
				return value;
            },
		},
		//pingpong_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',

		pingpong_g1_set_dotmatrix: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
						['CLEAR', 'CLEAR'],
						['TURN ON', 'TURN_ON'],
						['TEST_STR', 'TEST_STR'],
						['TEST', 'TEST'],
						['PORT_Q', 'PORT_QUERY'],
						['BLINK', 'BLINK'],
                    ],
					value: 'CLEAR',
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
            //events: {},
            def: { params: [null], type: 'pingpong_g1_set_dotmatrix' },
            paramsKeyMap: { CMD: 0 },
            class: 'Pingpong_G1_peripheral',
			template: 'dot matrix %1 %2',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				const cmd = script.getStringField('CMD', script);
				var packet = null;

				if (cmd == 'CLEAR') {
					packet = makePacketHeader(0xA2, 4, [0x70, 2]);	// ClearPixels
				} else if (cmd == 'TURN_ON') {
					packet = makePacketHeader(0xA2, 4, [0x70, 1]);	// turn on
				} else if (cmd == 'TEST_STR') {
					packet = makePacketHeader(0xA2, 3, [0x70, 200, 64,65,66,67,68,69,70]);	// write string
				} else if (cmd == 'TEST') {
					packet = makePacketHeader(0xA2, 1, [0x70, 1, 1, 1]);	// board on
				} else if (cmd == 'PORT_QUERY') {
					packet = makePacketHeader(0xA2, 0, [0x80]);
				} else if (cmd == 'BLINK') {
					packet = makePacketHeader(0xA2, 5, [0x70, 15]);
				}

				//FIXME
				Entry.Pingpong_G1.send_cmd_id++;
				Entry.hw.sendQueue.COMMAND = {
					id: Entry.Pingpong_G1.send_cmd_id,
					data: packet,
				};

				return script.callReturn();
            },
		},

		pingpong_g1_set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
						['RED', 0], ['GREEN', 1], ['BLUE', 2], ['CYAN', 3],
						['MAGENTA', 4], ['YELLOW', 5], ['VIOLET', 6],
						['ORANGE', 7], ['WHITE', 0xe], ['BLACK', 0xF],
                    ],
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
            //events: {},
            def: { params: [null], type: 'pingpong_g1_set_led_color' },
            paramsKeyMap: { COLOR: 0 },
            class: 'Pingpong_G1_led',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				const color = script.getNumberField('COLOR');
				var brightness = 80;

				var packet = makePacketHeader(0xCE, 0, [2, 0,0,color, brightness]);	// SET_LED

				//FIXME
				Entry.Pingpong_G1.send_cmd_id++;
				Entry.hw.sendQueue.COMMAND = {
					id: Entry.Pingpong_G1.send_cmd_id,
					data: packet,
				};

				return script.callReturn();
            },
		},
		pingpong_g1_motor_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                        [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                    ],
					value: 'RIGHT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
						["10",10], ["20",20], ["30",30], ["40",40], ["50",50], ["60",60],
						["70",70], ["80",80], ["90",90], ["100",100], ["110",110], ["120",120],
						["130",130], ["140",140], ["150",150], ["160",160], ["170",170], ["180",180],
						["190",190], ["200",200], ["210",210], ["220",220], ["230",230], ["240",240],
						["250",250], ["260",260], ["270",270], ["280",280], ["290",290], ["300",300],
						["310",310], ["320",320], ["330",330], ["340",340], ["350",350], ["360",360],
                    ],
					value: 10,
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
            //events: {},
            def: { params: [null, null], type: 'pingpong_g1_motor_rotate' },
            paramsKeyMap: { DIR: 0, DEGREE: 1, },
            class: 'Pingpong_G1_motor',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				const dir = script.getStringField('DIR');
				var degree = script.getNumberField('DEGREE');

				var speed = 800;
				if (dir == 'LEFT') {
					speed *= -1;
				}
				var step = Math.round(degree*5.5);
				if (step > 32768) step=32768;

				if (!script.is_start) {
					script.is_start = true;
					script.step_flag = 1;

					var packet = makePacketHeader(0xC1, 0x0004, [2, 1, 0, 2, 0,0,0,0,0,0]);	// STEP_MOTOR
					packet.writeInt16BE(speed, 13);
					packet.writeUInt16BE(step, 17);

					/*
					packet[6] = 0xc1; // opcode  SINGLE_STEP
					packet[9] = 2; // mode?? MULTIROLE=2, CRCHECK=3
					packet[10] = 1; // method, CONTINOUS=0, RELATIVE_SINGLE=1, ABSOLUTE_SINGLE=2, sched_steps=3, sched_point=4
					packet[11] = 0;	//step_type; full=0, servo=4
					packet[12] = 2;	//pause_state; PAUSE=1, RESUME=2
					*/

					//FIXME
					Entry.Pingpong_G1.send_cmd_id++;
					Entry.hw.sendQueue.COMMAND = {
						id: Entry.Pingpong_G1.send_cmd_id,
						data: packet,
					};

					var delay_ms = Math.round((1100- Math.abs(speed))/99*step)+400;;
					var myTimer = setTimeout(function() {
						script.step_flag = 2;
					}, delay_ms);
					return script;
				} else if (script.step_flag == 2) {
					delete script.is_start;
					delete script.step_flag;
                    //Entry.engine.isContinue = false;
                    return script.callReturn();
				}

				return script;
            },
		},
		pingpong_g1_rotate_servo_mortor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //statements: [],
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
            //events: {},
            def: { params: [ { type: 'angle', }, ], type: 'pingpong_g1_rotate_servo_mortor' },
            paramsKeyMap: { DEGREE: 0, },
            class: 'Pingpong_G1_motor',
            isNotFor: ['Pingpong_G1'],
            func: function(sprite, script) {
				var angle = script.getValue('DEGREE', script);

				//console.log(' servo: angle = ', angle);
				angle = Math.min( Math.max(angle,0), 180 );

				if (!script.is_start) {
					script.is_start = true;
					script.step_flag = 1;

					var packet = makePacketHeader(0xE1, 0x00, [2, 0, angle, 1]);	// SERVO_MOTOR

					//FIXME
					Entry.Pingpong_G1.send_cmd_id++;
					Entry.hw.sendQueue.COMMAND = {
						id: Entry.Pingpong_G1.send_cmd_id,
						data: packet,
					};

					var delay_ms = 400;
					var myTimer = setTimeout(function() {
						script.step_flag = 2;
					}, delay_ms);
					return script;
				} else if (script.step_flag == 2) {
					delete script.is_start;
					delete script.step_flag;
                    //Entry.engine.isContinue = false;
                    return script.callReturn();
				}

				return script;
            },
		},

    };
};

Entry.Pingpong_G1.setLanguage = function() {
    return {
        ko: {
            template: {
				pingpong_g1_when_button_pressed: '%1 큐브 단추를 눌렀을 때',
				pingpong_g1_when_moved: '%1 큐브가 %2 방향으로 움직였을 때',
				pingpong_g1_when_tilted: '%1 큐브가 %2 방향으로 기울였을 때',
				pingpong_g1_is_button_pressed: '큐브 단추를 눌렀는가?',
				pingpong_g1_is_tilted: '큐브가 %1 방향으로 기울여졌는가?',
				pingpong_g1_get_tilt_circle: '동그라미 방향 큐브 기울기',
				pingpong_g1_get_tilt_triangle: '세모 방향 큐브 기울기',
				pingpong_g1_get_tilt_star: '별 방향 큐브 기울기',
				pingpong_g1_get_tilt_rectangle: '네모 방향 큐브 기울기',
				pingpong_g1_get_sensor_value: '%1 센서값',
				pingpong_g1_motor_rotate: '모터를 %1 방향으로 %2 도 회전하기 %3',
				pingpong_g1_rotate_servo_mortor: '서보모터를 %1도로 설정하기 %2',
				pingpong_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
				pingpong_g1_set_led_color: 'LED를 %1 색으로 변경 %2',
            },
            Blocks: {
				pingpong_right: '오른쪽',
				pingpong_left: '왼쪽',
				pingpong_circle: '동그라미',
				pingpong_star: '별',
				pingpong_rectangle: '네모',
				pingpong_triangle: '세모',

				pingpong_rotate_cw: '시계',
				pingpong_rotate_ccw: '반시계',

				pingpong_sensor_proximity: '근접',
				pingpong_sensor_ain: '아날로그',
            },
        },
        en: {
            template: {
				pingpong_g1_when_button_pressed: '%1 Button pressed',
				pingpong_g1_when_moved: '%%1 When cube moved to %2',
				pingpong_g1_when_tilted: '%1 Tilted to %2',
				pingpong_g1_is_button_pressed: 'button pressed?',
				pingpong_g1_is_tilted: 'cube tilted to %1',
				pingpong_g1_get_tilt_circle: 'tilt angle to circle',
				pingpong_g1_get_tilt_triangle: 'tilt angle to triangle',
				pingpong_g1_get_tilt_star: 'tilt angle to star',
				pingpong_g1_get_tilt_rectangle: 'tilt angle to rectangle',
				pingpong_g1_get_sensor_value: 'read sensor %1',
				pingpong_g1_motor_rotate: 'rotate %2 degrees %1 %3',
				pingpong_g1_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
				pingpong_g1_is_top_shape: '%1 shown in top view?',
				pingpong_g1_set_led_color: 'set led color to %1 %2',
            },
            Blocks: {
				pingpong_right: 'right',
				pingpong_left: 'left',
				pingpong_circle: 'circle',
				pingpong_star: 'star',
				pingpong_rectangle: 'rectangle',
				pingpong_triangle: 'triangle',

				pingpong_rotate_cw: 'clockwise',
				pingpong_rotate_ccw: 'counter clockwise',

				pingpong_sensor_proximity: 'proximity',
				pingpong_sensor_ain: 'ain',
            },
        },
    };
};

module.exports = Entry.Pingpong_G1;
