'use strict';

Entry.Krypton0 = {
    PORT_MAP: {
		LMOTOR: 				0,
        RMOTOR: 				0,
		INTERSND: 		undefined,
		
		BUTTON:			undefined,
		GRAY_INFRARED1:	undefined,
		GRAY_INFRARED2:	undefined,
		LIGHT:			undefined,
		MICROPHONE:		undefined,
		LED:			undefined,
    },

    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setZero: function() {
        var portMap = this.PORT_MAP;
        Object.keys(portMap).forEach(function(port) {
			Entry.hw.sendQueue[port] = portMap[port];
        });
        Entry.hw.update();
    },
	
	abilix_controller : {
		MIN_MOTOR_SPEED: -50,
		MAX_MOTOR_SPEED: 50,
		
		check_max_speed: function(speed_value) {
			var adj_speed = speed_value;
			
			if (speed_value > this.MAX_MOTOR_SPEED) {
				adj_speed = this.MAX_MOTOR_SPEED;
			}
			else if (speed_value < this.MIN_MOTOR_SPEED) {
				adj_speed = this.MAX_MOTOR_SPEED;
			}
			else {
				adj_speed = speed_value;
			}

            return adj_speed;
        },
	},
	
    id: '30.1',
    name: 'ABILIX Krypton 0 for School',
    url: 'http://abilix.co.kr',
    imageName: 'Abilix_Krypton0.png',
    title: {
        ko: '크립톤 0',
        en: 'Krypton 0 for School',
    },
};

Entry.Krypton0.setLanguage = function() {
    return {
        ko: {
            template: {
				Krypton0_turnon_motor: '모터를 %1(으)로 %2 속도로 움직인다',
				Krypton0_move_to_direction_during_secs : '모터를 %1(으)로 %2 초동안 움직인다.',
	
				Krypton0_turnoff_motor : '모터를 정지 시킨다.',
				Krypton0_change_direction_during_secs : '모터를 %1 방향으로 %2초 동안 움직인다.',
				Krypton0_change_speed : '모터를 %1의 속도를 %2로 변경한다.',
				
				Krypton0_play_sound : '크립톤에서 %1 을 재생한다',
				
				Krypton0_get_sensor_value: '센서 %1 의 값을 읽는다.',
				
                Krypton0_button_pressed: '버튼이 눌려져있는가?',
				Krypton0_turnon_led: 'LED를 %1.',
            },
        },
        en: {
            template: {
				Krypton0_turnon_motor: 'Motors move to %1 as %2 speed',
				Krypton0_move_to_direction_during_secs : 'Motors move to %1 during %2 sec.',
	
				Krypton0_turnoff_motor : 'Stop Motors',
				Krypton0_change_direction_during_secs : 'Motors go to %1 during %2 secs.',
				Krypton0_change_speed : 'Motor change from speed of %1 to %2.', 
				
				Krypton0_play_sound : 'Kripton play %1 audio.',
				
                Krypton0_get_sensor_value: 'Read sensor %1s value',
                Krypton0_button_pressed: 'Button is pressed?',
				Krypton0_turnon_led: 'Turn %1 LED.',		
            },
        },
    };
};

Entry.Krypton0.blockMenuBlocks = [
	'Krypton0_turnon_motor',
    'Krypton0_move_to_direction_during_secs',
	
	'Krypton0_turnoff_motor',
	'Krypton0_change_direction_during_secs',
	'Krypton0_change_speed',
	
	'Krypton0_play_sound',
	
	'Krypton0_get_sensor_value',
	'Krypton0_button_pressed',
	'Krypton0_turnon_led',
];

Entry.Krypton0.getBlocks = function() {
    return {
        //region Krypton0
		/*************************************************************************
		* Name: Krypton0_turnon_motor
		*
		* Description: Turn on Motor.
		*			   "Kripton0 move to %1 as %2 speed"
		*************************************************************************/
		Krypton0_turnon_motor : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
			params: [
                {
                    type: 'Dropdown',
					options: [['앞', 'Forward'], ['뒤', 'Backward']],
                    value: '앞',
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
                    {
                        type: 'number',
                        params: ['3'],
                    },
                ],
                type: 'Krypton0_turnon_motor',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE_SPD: 1,
            },
            class: 'Krypton0_motor_control',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
				var direction = script.getStringField('DIRECTION', script);
				var speedValue = script.getNumberValue('VALUE_SPD');
				if (direction == 'Forward') {
					speedValue = Entry.Krypton0.abilix_controller.check_max_speed(speedValue);
				}
				else {
					speedValue = Entry.Krypton0.abilix_controller.check_max_speed(speedValue * -1);
				}
				Entry.hw.sendQueue.LMOTOR = speedValue;
				Entry.hw.sendQueue.RMOTOR = speedValue;
                return script.callReturn();
            },
		},
		
		/*************************************************************************
		* Name: Krypton0_move_to_direction_during_secs
		*
		* Description: Moter move to Forward / Backword during some sec.
		*			   "Krypton go for %1 during %2 sec."
		*************************************************************************/
		Krypton0_move_to_direction_during_secs : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
			params: [
                {
                    type: 'Dropdown',
					options: [['앞', 'Forward'], ['뒤', 'Backward']],
                    value: '앞',
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
                    {
                        type: 'number',
                        params: ['3'],
                    },
                ],
                type: 'Krypton0_move_to_direction_during_secs',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE_SEC: 1,
            },
            class: 'Krypton0_motor_control',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                if (!script.isStart) {
					var direction = script.getStringField('DIRECTION', script);
                    script.isStart = true;
                    script.timeFlag = 1;
					if (direction == 'Forward') {
						Entry.hw.sendQueue.LMOTOR = 30;
						Entry.hw.sendQueue.RMOTOR = 30;
					}
					else {
						Entry.hw.sendQueue.LMOTOR = -30;
						Entry.hw.sendQueue.RMOTOR = -30;
					}
                 
                    var timeValue = script.getNumberValue('VALUE_SEC') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Krypton0.removeTimeout(timer);
                    }, timeValue);
                    Entry.Krypton0.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    Entry.hw.sendQueue.LMOTOR = 0;
                    Entry.hw.sendQueue.RMOTOR = 0;
                    return script.callReturn();
                }
            },
		},			
		
		/*************************************************************************
		* Name: Krypton0_turnoff_motor
		*
		* Description: Turn off motor.
		*			   "Stop Krypton 0 for School"
		*************************************************************************/
		Krypton0_turnoff_motor : {
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
                type: 'Krypton0_turnoff_motor',
            },
            class: 'Krypton0_motor_control',
			isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                Entry.hw.sendQueue.LMOTOR = 0;
                Entry.hw.sendQueue.RMOTOR = 0;
                return script.callReturn();
            },
        },
		
		/*************************************************************************
		* Name: Krypton0_change_direction_during_secs
		*
		* Description: Turn left or right during some sec.
		*			   "Kripton go to %1 during %2 secs."
		*************************************************************************/
		Krypton0_change_direction_during_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'LEFT'],
                        ['오른쪽', 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'Krypton0_change_direction_during_secs',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'Krypton0_motor_control',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        Entry.hw.sendQueue.LMOTOR = -30;
                        Entry.hw.sendQueue.RMOTOR = 30;
                    } else {
                        Entry.hw.sendQueue.LMOTOR = 30;
                        Entry.hw.sendQueue.RMOTOR = -30;
                    }
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Krypton0.removeTimeout(timer);
                    }, timeValue);
                    Entry.Krypton0.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    Entry.hw.sendQueue.LMOTOR = 0;
                    Entry.hw.sendQueue.RMOTOR = 0;
                    return script.callReturn();
                }
            },
        },
		
		/*************************************************************************
		* Name: Krypton0_change_speed
		*
		* Description: change motor speed about left, right and both.
		*			   "Kripton change from speed of %1 to %2."
		*************************************************************************/
		Krypton0_change_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'LEFT'],
                        ['B', 'RIGHT'],
                        ['양쪽', 'BOTH'],
                    ],
                    value: 'BOTH',
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'Krypton0_change_speed',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'Krypton0_motor_control',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE'); //Entry.Krypton0.abilix_controller.check_max_speed(script.getNumberValue('VALUE'));
                if (direction == 'LEFT') {
                    Entry.hw.sendQueue.LMOTOR = value;
					Entry.hw.sendQueue.RMOTOR = Entry.hw.sendQueue.RMOTOR != undefined ? Entry.hw.sendQueue.RMOTOR : 0;
                } else if (direction == 'RIGHT') {
					Entry.hw.sendQueue.LMOTOR = Entry.hw.sendQueue.LMOTOR != undefined ? Entry.hw.sendQueue.LMOTOR : 0;
                    Entry.hw.sendQueue.RMOTOR = value;
                } else {
                    Entry.hw.sendQueue.LMOTOR = value;
                    Entry.hw.sendQueue.RMOTOR = value;
                }
                return script.callReturn();
            },
        },
		
		/*************************************************************************
		* Name: Krypton0_play_sound
		*
		* Description: play internal sound - hello, by, welcom, cheer.
		*			   "Kripton play %1 audio."
		*************************************************************************/
		Krypton0_play_sound : {
			color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['hello', 'hello'],
                        ['bye', 'bye'],
                        ['welcome', 'welcome'],
						['cheer', 'cheer'],
                    ],
                    value: 'hello',
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
                type: 'Krypton0_play_sound',
            },
            paramsKeyMap: {
                SOUND_VALUE: 0,
            },
			class: 'Krypton0_motor_control',
			isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                var audio_file = script.getField('SOUND_VALUE');
				Entry.hw.sendQueue.INTERSND = audio_file;
                return script.callReturn();
            },
        },
		
		/*************************************************************************
		* Name: Krypton0_get_sensor_value
		*
		* Description: Get sensor values - GRAY_INFRARED, ULTRASONIC, 
		*                                  COLOR, LIGHT, MICROPHONE, LANTERN.
		*			   "Read sensor %1s value'"
		*************************************************************************/
		Krypton0_get_sensor_value : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['적외선1', 'GRAY_INFRARED1'],
						['적외선2', 'GRAY_INFRARED2'],
                        ['빛', 'LIGHT'],
                        ['소리센서', 'MICROPHONE'],
                        ['LED', 'LED'],
                    ],
                    value: 'GRAY_INFRARED1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'Krypton0_get_sensor_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'Krypton0_sensor',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
				var dev = script.getField('DEVICE')
                var sensor_value = Entry.hw.getDigitalPortValue(dev);
                 
				//console.log('Krypton0_get_sensor_value : ' + dev + '   ' + sensor_value);
				if (sensor_value == undefined)
					return 'undefined';
				
				// need to check entry sensor values
				switch(dev) {
					case 'GRAY_INFRARED1' :
					case 'GRAY_INFRARED2' :
					case 'LIGHT' :
						return (sensor_value / 8);
					case 'MICROPHONE' :
					case 'LED' :
						return sensor_value;
					default:
						break;
				}
                return sensor_value;
            },
		},
		
		/*************************************************************************
		* Name: Krypton0_button_pressed
		*
		* Description: Is Button pressed?.
		*			   "Button is pressed?"
		*************************************************************************/
		Krypton0_button_pressed : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                type: 'Krypton0_button_pressed',
            },
            class: 'Krypton0_sensor',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
                var buttonData = Entry.hw.getDigitalPortValue('BUTTON');
				//console.log('Krypton0_button_pressed : ' + buttonData);
                if (buttonData == 1) {
					//console.log('Krypton0_button_pressed');
                    return true;
                }

                return false;
            },
		},			
		
		/*************************************************************************
		* Name: Krypton0_turnon_led
		*
		* Description: Turn on / off LED
		*			   "Turn %1 LED."
		*************************************************************************/
		Krypton0_turnon_led : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['켠다', 'ON'],
                        ['끈다', 'OFF'],
                    ],
                    value: 'ON',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'Krypton0_turnon_led',
            },
            paramsKeyMap: {
                LED_VALUE: 0,
            },
			class: 'Krypton0_sensor',
            isNotFor: ['ABILIX Krypton 0 for School'],
            func: function(sprite, script) {
				var led_value = script.getField('LED_VALUE');
				if (led_value == 'ON')
					Entry.hw.sendQueue.LED = 1;
				else
					Entry.hw.sendQueue.LED = 0;
				return script.callReturn();
            },
		},
        //endregion
    };
};

module.exports = Entry.Krypton0;
