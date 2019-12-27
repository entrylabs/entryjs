'use strict';

var OzobotState = {
	STATE_READY: 'ready',
	STATE_WAIT: 'wait',
	STATE_DONE: 'done',
};

Entry.Ozobot = {
	PORT_MAP: {
		seq: 0,
		cat: 0,
		act: 0,
		pcnt: 0,
		p1: 0,
		p2: 0,
		p3: 0,
		p4: 0,
		p5: 0,
		p6: 0
	},
	setZero: function () {
		var portMap = Entry.Ozobot.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		Entry.Ozobot.sequance = 1;
		Entry.Ozobot.isStarted = false;
		Entry.Ozobot.state = OzobotState.STATE_DONE;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
	},
	id: '24.2',
	name: 'Ozobot Evo',
	url: 'http://www.ozobot.kr',
	imageName: 'ozobot.png',
	title: {
		ko: '오조봇 이보',
		en: 'Ozobot Evo',
	},
	monitorTemplate: {
		imgPath: 'hw/ozobot.png',
		width: 605,
		height: 434,
	},
	sequance: 1,
	isStarted: false,
	state: OzobotState.STATE_DONE,
};
Entry.Ozobot.blockMenuBlocks = [
	//region ozobot
	'Ozobot_Sensor_floor_color',
	'Ozobot_Sensor_obstacle',
	'Ozobot_Move_wheel',
	'Ozobot_Move1',
	'Ozobot_Move2',
	'Ozobot_Rotate1',
	'Ozobot_Rotate2',
	'Ozobot_Move_stop',
	'Ozobot_LED_head',
	'Ozobot_LED_head_floor',
	'Ozobot_LED_head_random',
	'Ozobot_LED_head_off',
	'Ozobot_LED_front',
	'Ozobot_LED_front_random',
	'Ozobot_LED_front_off',
	'Ozobot_Sound_emotion',
	'Ozobot_Sound_direction',
	'Ozobot_Sound_number',
	'Ozobot_Sound_color',
	'Ozobot_Sound_tone',
	'Ozobot_Sound_tone_time',
	'Ozobot_Sound_stop',
	'Ozobot_Power_off',
	//end region ozobot
];
Entry.Ozobot.getBlocks = function () {
	return {
		// Sensor
		Ozobot_Sensor_floor_color: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '바닥 색깔 %1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['검은색', 0x00],
						['빨간색', 0x01],
						['초록색', 0x02],
						['노란색', 0x03],
						['파란색', 0x04],
						['자주색', 0x05],
						['흰색', 0x06],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [0],
				type: 'Ozobot_Sensor_floor_color',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Ozobot Evo'],
			class: 'Ozobot_Sensor',
			func: function (sprite, script) {
				var var1 = script.getNumberField('VALUE', script);
				var pd = Entry.hw.portData;
				if (var1 == pd.surface_color)
					return true;
				return false;
			},
		},
		Ozobot_Sensor_obstacle: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '%1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['앞쪽 장애물', 0x00],
						['뒤쪽 장애물', 0x01],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [0],
				type: 'Ozobot_Sensor_obstacle',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Ozobot Evo'],
			class: 'Ozobot_Sensor',
			func: function (sprite, script) {
				var var1 = script.getNumberField('VALUE', script);
				var pd = Entry.hw.portData;
				switch (var1) {
					case 0x00:
						if (pd.obstacle_front_left || pd.obstacle_front_right)
							return true;
						break;
					case 0x01:
						if (pd.obstacle_rear_left || pd.obstacle_rear_right)
							return true;
						break;
				}
				return false;
			},
		},
		// Movement
		Ozobot_Move_wheel: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '왼쪽 바퀴 %1 (으)로 %2, 오른쪽 바퀴 %3 (으)로 %4 움직이기 %5',
			params: [
				{
					type: 'Dropdown',
					options: [
						['앞', 0x00],
						['뒤', 0x01],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['느리게', 25],
						['보통으로', 45],
						['빠르게', 65],
						['매우빠르게', 85],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['앞', 0x00],
						['뒤', 0x01],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['느리게', 25],
						['보통으로', 45],
						['빠르게', 65],
						['매우빠르게', 85],
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
				params: [0, 45, 0, 45],
				type: 'Ozobot_Move_wheel',
			},
			paramsKeyMap: {
				DIRECTION_LEFT: 0,
				SPEED_LEFT: 1,
				DIRECTION_RIGHT: 2,
				SPEED_RIGHT: 3,
			},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION_LEFT', script);
				var var2 = script.getNumberField('SPEED_LEFT', script);
				var var3 = script.getNumberField('DIRECTION_RIGHT', script);
				var var4 = script.getNumberField('SPEED_RIGHT', script);
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 0;
					sq.pcnt = 4;
					sq.p1 = var1;
					sq.p2 = var2;
					sq.p3 = var3;
					sq.p4 = var4;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Move1: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 (으)로 %2 cm만큼 %3 이동하기 %4',
			params: [
				{
					type: 'Dropdown',
					options: [
						['앞', 0x00],
						['뒤', 0x01],
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
					type: 'Dropdown',
					options: [
						['느리게', 25],
						['보통으로', 45],
						['빠르게', 65],
						['매우빠르게', 85],
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
				params: [0, 5, 45],
				type: 'Ozobot_Move1',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				DISTANCE: 1,
				SPEED: 2,
			},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberValue('DISTANCE', script);
				var var3 = script.getNumberField('SPEED', script);
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 3;
					sq.p1 = var1;
					sq.p2 = var2 * 10;
					sq.p3 = var3;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							if (!pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_WAIT;
							}
							return script;
							break;
						case OzobotState.STATE_WAIT:
							if (pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Move2: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 mm 거리를 %2 mm/s 속도로 이동하기 %3',
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
				params: [20, 30],
				type: 'Ozobot_Move2',
			},
			paramsKeyMap: {
				DISTANCE: 0,
				SPEED: 1,
			},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberValue('DISTANCE', script);
				var var2 = script.getNumberValue('SPEED', script);
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 3;
					sq.p1 = 0;
					sq.p2 = var1;
					sq.p3 = var2;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							if (!pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_WAIT;
							}
							return script;
							break;
						case OzobotState.STATE_WAIT:
							if (pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Rotate1: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 으로 %2 만큼 회전하기 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['시계 방향', 0x01],
						['반시계 방향', 0x00],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Block',
					accept: 'string',
					defaultType: 'angle',
				},
				{
					type: 'Indicator',
					img: 'block_icon/hardware_icon.svg',
					size: 12,
				},
			],
			events: {},
			def: {
				params: [0, 30],
				type: 'Ozobot_Rotate1',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				ANGLE: 1,
			},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberValue('ANGLE', script);
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							if (!pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_WAIT;
							}
							return script;
							break;
						case OzobotState.STATE_WAIT:
							if (pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Rotate2: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 으로 %2 회전하기 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['시계 방향', 0x01],
						['반시계 방향', 0x00],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['한 바퀴', 0x00],
						['반 바퀴', 0x01],
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
				params: [0, 0],
				type: 'Ozobot_Rotate2',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				ANGLE: 1,
			},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberField('ANGLE', script);
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2 == 0 ? 360 : 180;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							if (!pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_WAIT;
							}
							return script;
							break;
						case OzobotState.STATE_WAIT:
							if (pd.movement_finish) {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Move_stop: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '바퀴 정지 %1',
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
				type: 'Ozobot_Move_stop',
			},
			paramsKeyMap: {},
			class: 'Ozobot_Movement',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 1;
					sq.act = 0;
					sq.pcnt = 4;
					sq.p1 = 0;
					sq.p2 = 0;
					sq.p3 = 0;
					sq.p4 = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		// Control
		Ozobot_LED_head: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '머리 불빛 색상 설정 %1 %2',
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
				type: 'Ozobot_LED_head',
			},
			paramsKeyMap: {
				COLOR: 0,
			},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = 1;
					sq.p2 = parseInt(parseInt(var1.substr(1, 6), 16));
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_head_floor: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '머리 불빛 바닥 색상 가져오기 %1',
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
				type: 'Ozobot_LED_head_floor',
			},
			paramsKeyMap: {},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = 1;
					sq.p2 = 0;
					if (pd.surface_color == 8) {
						sq.p1 = 4;
					}
					if (pd.surface_color & 1) sq.p2 |= 16711680;
					if (pd.surface_color & 2) sq.p2 |= 65280;
					if (pd.surface_color & 4) sq.p2 |= 255;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_head_random: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '머리 불빛 색상 무작위 %1',
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
				type: 'Ozobot_LED_head_random',
			},
			paramsKeyMap: {},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = 1;
					sq.p2 = 0;
					sq.p2 |= (Math.floor(Math.random() * 256) << 16);
					sq.p2 |= (Math.floor(Math.random() * 256) << 8);
					sq.p2 |= Math.floor(Math.random() * 256);
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_head_off: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '머리 불빛 끄기 %1',
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
				type: 'Ozobot_LED_head_off',
			},
			paramsKeyMap: {},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = 1;
					sq.p2 = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_front: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '정면 불빛 색상 설정 %1 %2 %3 %4 %5 %6',
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
					type: 'Indicator',
					img: 'block_icon/hardware_icon.svg',
					size: 12,
				},
			],
			events: {},
			def: {
				params: [null],
				type: 'Ozobot_LED_front',
			},
			paramsKeyMap: {
				COLOR1: 0,
				COLOR2: 1,
				COLOR3: 2,
				COLOR4: 3,
				COLOR5: 4,
			},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR1', script);
				var var2 = script.getStringField('COLOR2', script);
				var var3 = script.getStringField('COLOR3', script);
				var var4 = script.getStringField('COLOR4', script);
				var var5 = script.getStringField('COLOR5', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 6;
					sq.p1 = 0;
					sq.p2 = parseInt(parseInt(var5.substr(1, 6), 16));
					sq.p3 = parseInt(parseInt(var4.substr(1, 6), 16));
					sq.p4 = parseInt(parseInt(var3.substr(1, 6), 16));
					sq.p5 = parseInt(parseInt(var2.substr(1, 6), 16));
					sq.p6 = parseInt(parseInt(var1.substr(1, 6), 16));
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_front_random: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '정면 불빛 색상 무작위 %1',
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
				type: 'Ozobot_LED_front_random',
			},
			paramsKeyMap: {},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR1', script);
				var var2 = script.getStringField('COLOR2', script);
				var var3 = script.getStringField('COLOR3', script);
				var var4 = script.getStringField('COLOR4', script);
				var var5 = script.getStringField('COLOR5', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 6;
					sq.p1 = 0;
					sq.p2 = 0;
					sq.p3 = 0;
					sq.p4 = 0;
					sq.p5 = 0;
					sq.p6 = 0;
					sq.p2 |= (Math.floor(Math.random() * 256) << 16);
					sq.p2 |= (Math.floor(Math.random() * 256) << 8);
					sq.p2 |= Math.floor(Math.random() * 256);
					sq.p3 |= (Math.floor(Math.random() * 256) << 16);
					sq.p3 |= (Math.floor(Math.random() * 256) << 8);
					sq.p3 |= Math.floor(Math.random() * 256);
					sq.p4 |= (Math.floor(Math.random() * 256) << 16);
					sq.p4 |= (Math.floor(Math.random() * 256) << 8);
					sq.p4 |= Math.floor(Math.random() * 256);
					sq.p5 |= (Math.floor(Math.random() * 256) << 16);
					sq.p5 |= (Math.floor(Math.random() * 256) << 8);
					sq.p5 |= Math.floor(Math.random() * 256);
					sq.p6 |= (Math.floor(Math.random() * 256) << 16);
					sq.p6 |= (Math.floor(Math.random() * 256) << 8);
					sq.p6 |= Math.floor(Math.random() * 256);
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_LED_front_off: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '정면 불빛 끄기 %1',
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
				type: 'Ozobot_LED_front_off',
			},
			paramsKeyMap: {},
			class: 'Ozobot_LED',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = 0;
					sq.p2 = 0;
					sq.p3 = 0;
					sq.p4 = 0;
					sq.p5 = 0;
					sq.p6 = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_emotion: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '감정 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['행복', 0x00],
						['슬픔', 0x01],
						['놀람', 0x02],
						['웃음', 0x03],
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
				params: [0],
				type: 'Ozobot_Sound_emotion',
			},
			paramsKeyMap: {
				SOUND: 0,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('SOUND', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 3100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_direction: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '방향 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['Left', 0x01],
						['Right', 0x02],
						['Forward', 0x00],
						['Back', 0x03],
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
				params: [0],
				type: 'Ozobot_Sound_direction',
			},
			paramsKeyMap: {
				DIRECTION: 0,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('DIRECTION', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = 4;
					sq.p2 = var1;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 1600);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_number: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '숫자 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['1', 0x01],
						['2', 0x02],
						['3', 0x03],
						['4', 0x04],
						['5', 0x05],
						['6', 0x06],
						['7', 0x07],
						['8', 0x08],
						['9', 0x09],
						['10', 0x0A],
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
				params: [1],
				type: 'Ozobot_Sound_number',
			},
			paramsKeyMap: {
				DIRECTION: 0,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('DIRECTION', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = 5;
					sq.p2 = var1;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 1600);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_color: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '색깔 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['Red', 0x01],
						['Green', 0x02],
						['Yellow', 0x03],
						['Blue', 0x04],
						['Cyan', 0x06],
						['White', 0x07],
						['Black', 0x00]
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
				params: [ 1 ],
				type: 'Ozobot_Sound_color',
			},
			paramsKeyMap: {
				COLOR: 0,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = 8;
					sq.p2 = var1;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 1600);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_tone: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '음 %1 %2 연주 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['5 옥타브', 0x05],
						['6 옥타브', 0x06],
						['7 옥타브', 0x07],
						['8 옥타브', 0x08]
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['도', 0x01],
						['도#', 0x02],
						['레', 0x03],
						['레#', 0x04],
						['미', 0x05],
						['파', 0x06],
						['파#', 0x07],
						['솔', 0x08],
						['솔#', 0x09],
						['라', 0x0A],
						['라#', 0x0B],
						['시', 0x0C],
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
				params: [5, 1],
				type: 'Ozobot_Sound_tone',
			},
			paramsKeyMap: {
				OCTAV: 0,
				TONE: 1,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('OCTAV', script);
				var var2 = script.getNumberField('TONE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 2;
					sq.pcnt = 3;
					sq.p1 = var2;
					sq.p2 = var1 + 1;
					sq.p3 = 500;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 600);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_tone_time: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '음 %1 %2 %3 초 동안 연주 %4',
			params: [
				{
					type: 'Dropdown',
					options: [
						['5 옥타브', 0x05],
						['6 옥타브', 0x06],
						['7 옥타브', 0x07],
						['8 옥타브', 0x08]
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['도', 0x01],
						['도#', 0x02],
						['레', 0x03],
						['레#', 0x04],
						['미', 0x05],
						['파', 0x06],
						['파#', 0x07],
						['솔', 0x08],
						['솔#', 0x09],
						['라', 0x0A],
						['라#', 0x0B],
						['시', 0x0C],
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
			events: {},
			def: {
				params: [5, 1, 1],
				type: 'Ozobot_Sound_tone_time',
			},
			paramsKeyMap: {
				OCTAV: 0,
				TONE: 1,
				TIME: 2,
			},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('OCTAV', script);
				var var2 = script.getNumberField('TONE', script);
				var var3 = script.getNumberValue('TIME', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 2;
					sq.pcnt = 3;
					sq.p1 = var2;
					sq.p2 = var1;
					sq.p3 = var3 * 1000;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, var3 * 1000 + 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Sound_stop: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '소리 정지 %1',
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
				type: 'Ozobot_Sound_stop',
			},
			paramsKeyMap: {},
			class: 'Ozobot_Sound',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 3;
					sq.pcnt = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
		Ozobot_Power_off: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '전원 끄기 %1',
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
				type: 'Ozobot_Power_off',
			},
			paramsKeyMap: {},
			class: 'Ozobot_Power',
			isNotFor: ['Ozobot Evo'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Ozobot.isStarted) {
					sq.seq = Entry.Ozobot.sequance++;
					sq.cat = 2;
					sq.act = 4;
					sq.pcnt = 0;
					Entry.Ozobot.isStarted = true;
					Entry.Ozobot.state = OzobotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Ozobot.state) {
						case OzobotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Ozobot.state = OzobotState.STATE_DONE;
							}, 100);
							Entry.Ozobot.state = OzobotState.STATE_WAIT;
							return script;
							break;
						case OzobotState.STATE_WAIT:
							return script;
							break;
						case OzobotState.STATE_DONE:
							Entry.Ozobot.isStarted = false;
							return script.callReturn();
							break;
					}
				}
				return script;
			},
		},
	};
};

module.exports = Entry.Ozobot;
