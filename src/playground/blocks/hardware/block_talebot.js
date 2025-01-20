'use strict';

var TalebotState = {
	STATE_READY: 'ready',
	STATE_WAIT: 'wait',
	STATE_DONE: 'done',
};

Entry.Talebot = {
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
		var portMap = Entry.Talebot.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		Entry.Talebot.sequance = 1;
		Entry.Talebot.isStarted = false;
		Entry.Talebot.state = TalebotState.STATE_DONE;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
	},
	id: '24.4',
	name: 'Talebot Pro',
	url: 'http://www.marusysedu.kr',
	imageName: 'talebot.png',
	title: {
		ko: '테일봇',
		en: 'Talebot',
	},
	monitorTemplate: {
		imgPath: 'hw/talebot.png',
		width: 605,
		height: 434,
	},
	sequance: 1,
	isStarted: false,
	state: TalebotState.STATE_DONE,
};
Entry.Talebot.blockMenuBlocks = [
	'Talebot_Move',
	'Talebot_Rotate',
	'Talebot_Rotate_round',
	'Talebot_Rotate_wheel',
	'Talebot_Speed',
	'Talebot_Stop',
	'Talebot_LED_all',
	'Talebot_LED_select',
	'Talebot_LED_eyes',
	'Talebot_LED_eyes_random',
	'Talebot_Sound_play',
	'Talebot_Sound_play_animal',
	'Talebot_Sound_play_praise',
	'Talebot_Sound_record',
	'Talebot_Sound_volume',
	'Talebot_Dance',
	'Talebot_Play_instruments',
	'Talebot_Play_tone',
];
Entry.Talebot.getBlocks = function () {
	return {
		Talebot_Move: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 (으)로 %2 cm만큼 이동하기 %3',
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
					type: 'Indicator',
					img: 'block_icon/hardware_icon.svg',
					size: 12,
				},
			],
			events: {},
			def: {
				params: [0, 10],
				type: 'Talebot_Move',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				DISTANCE: 1,
			},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberValue('DISTANCE', script);
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2 * 10;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Rotate: {
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
						['시계 방향', 0x00],
						['반시계 방향', 0x01],
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
				params: [0, 90],
				type: 'Talebot_Rotate',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				ANGLE: 1,
			},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberValue('ANGLE', script);
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 1;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Rotate_round: {
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
						['시계 방향', 0x00],
						['반시계 방향', 0x01],
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
				type: 'Talebot_Rotate_round',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				VALUE: 1
			},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION', script);
				var var2 = script.getNumberField('VALUE', script);
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 1;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2 == 0 ? 360 : 180;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Rotate_wheel: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '왼쪽 바퀴 %1(으)로 %2 오른쪽 바퀴 %3(으)로 %4 회전하기 %5',
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
						['느리게', 0x00],
						['보통으로', 0x01],
						['빠르게', 0x02],
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
					
				},
				{
					type: 'Dropdown',
					options: [
						['느리게', 0x00],
						['보통으로', 0x01],
						['빠르게', 0x02],
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
				params: [0, 1, 0, 1],
				type: 'Talebot_Rotate_wheel',
			},
			paramsKeyMap: {
				DIRECTION_L: 0,
				SPEED_L: 1,
				DIRECTION_R: 2,
				SPEED_R: 3
			},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('DIRECTION_L', script);
				var var2 = script.getNumberField('SPEED_L', script);
				var var3 = script.getNumberField('DIRECTION_R', script);
				var var4 = script.getNumberField('SPEED_R', script);
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 1;
					sq.act = 0;
					sq.pcnt = 4;
					sq.p1 = var1;
					sq.p2 = var2;
					sq.p3 = var3;
					sq.p4 = var4;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Speed: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '바퀴 속도 %1 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['느리게', 0x00],
						['보통으로', 0x01],
						['빠르게', 0x02],
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
				type: 'Talebot_Speed',
			},
			paramsKeyMap: {
				SPEED: 0,
			},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				var var1 = script.getNumberField('SPEED', script);
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 1;
					sq.act = 3;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Stop: {
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
				type: 'Talebot_Stop',
			},
			paramsKeyMap: {},
			class: 'Talebot_Movement',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					// sq.cat = 2;
					// sq.act = 0;
					// sq.pcnt = 0;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = 0;
					sq.p2 = 0;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 100);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_LED_all: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '모든 머리 불빛 색상 %1 %2',
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
				type: 'Talebot_LED_all',
			},
			paramsKeyMap: {
				COLOR: 0,
			},
			class: 'Talebot_Lights',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = 0;
					sq.p2 = parseInt(parseInt(var1.substr(1, 6), 16));
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 1000);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_LED_select: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 머리 불빛 색상 %2 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['1번', 0x01],
						['2번', 0x02],
						['3번', 0x03],
						['4번', 0x04],
						['5번', 0x05],
						['6번', 0x06],
						['7번', 0x07],
						['8번', 0x08],
						['9번', 0x09],
						['10번', 0xA],
						['11번', 0x0B],
						['12번', 0x0C],
						['무작위', 0x00],
					],
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
				params: [ 1 ],
				type: 'Talebot_LED_select',
			},
			paramsKeyMap: {
				SELECT: 0,
				COLOR: 1,
			},
			class: 'Talebot_Lights',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('SELECT', script);
				var var2 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 3;
					sq.p1 = 1;
					if(var1 == 0)
					{
						sq.p2 = Math.floor(Math.random() * 13);
					}
					else {
						sq.p2 = var1 - 1;
					}
					sq.p3 = parseInt(parseInt(var2.substr(1, 6), 16));
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 1000);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_LED_eyes: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '눈 불빛 색상 %1 %2',
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
				params: [],
				type: 'Talebot_LED_eyes',
			},
			paramsKeyMap: {
				COLOR: 0,
			},
			class: 'Talebot_Lights',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getStringField('COLOR', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 3;
					sq.p1 = 2;
					sq.p2 = parseInt(parseInt(var1.substr(1, 6), 16));
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 1000);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_LED_eyes_random: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '눈 불빛 색상 무작위 %1',
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
				type: 'Talebot_LED_eyes_random',
			},
			paramsKeyMap: {
				COLOR: 0,
			},
			class: 'Talebot_Lights',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 4;
					sq.p1 = 2;
					sq.p2 = (Math.floor(Math.random() * 256) << 16) | (Math.floor(Math.random() * 256) << 8) | Math.floor(Math.random() * 256);
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 1000);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Play_instruments: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '악기를 %1(으)로 정하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['피아노', 0x00],
						['오르간', 0x02],
						['기타', 0x03],
						['베이스', 0x05],
						['첼로', 0x07],
						['트롬본', 0x08],
						['클라리넷', 0x09],
						['색소폰', 0x0A],
						['플루트', 0x0B],
						['바순', 0x0D],
						['비브라폰', 0x0F],
						['오르골', 0x10],
						['마림바', 0x12],
						['합창단', 0x0E],
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
				params: [ 0 ],
				type: 'Talebot_Play_instruments',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Talebot_Play',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberField('SELECT', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = 0;
					sq.p2 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							var timer = setTimeout(() => {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}, 500);
							Entry.Talebot.state = TalebotState.STATE_WAIT;
							return script;
						case TalebotState.STATE_WAIT:
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Play_tone: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '음 %1 %2 %3 박자로 연주하기 %4',
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
				params: [ 6, 1, 1 ],
				type: 'Talebot_Play_tone',
			},
			paramsKeyMap: {
				OCTAV: 0,
				TONE: 1,
				LENGTH: 2,
			},
			class: 'Talebot_Play',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('OCTAV', script);
				var var2 = script.getNumberValue('TONE', script);
				var var3 = script.getNumberValue('LENGTH', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 2;
					sq.pcnt = 4;
					sq.p1 = 1;
					sq.p2 = var1;
					sq.p3 = var2;
					sq.p4 = var3;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},		
		Talebot_Dance: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 춤추기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['까불까불', 0x01],
						['빙글빙글', 0x02],
						['살랑살랑', 0x03],
						['뱅그르르', 0x04],
						['실룩실룩', 0x05],
						['쿵짝쿵짝', 0x06],
						['무작위', 0x00],
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
				type: 'Talebot_Dance',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Dance',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('VALUE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 3;
					sq.pcnt = 1;
					if(var1 == 0) {
						sq.p1 = Math.floor(Math.random() * 7);
					}
					else {
						sq.p1 = var1;
					}
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Sound_record: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '녹음 %1 말하기 %2',
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
						['무작위', 0x00],
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
				type: 'Talebot_Sound_record',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Sound',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					var var1 = script.getNumberField('VALUE', script);
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 4;
					sq.pcnt = 1;
					if (var1 == 0) {
						sq.p1 = Math.floor(Math.random() * 9);
					}
					else {
						sq.p1 = var1;
					}
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Sound_volume: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '소리 크기 %1 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['작게', 0x00],
						['보통으로', 0x01],
						['크게', 0x02],
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
				type: 'Talebot_Sound_volume',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Sound',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('VALUE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 5;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Sound_play: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['자동차', 0x00],
						['경찰차', 0x01],
						['소방차', 0x02],
						['박수', 0x03],
						['뾰로롱', 0x04],
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
				params: [ 0x00 ],
				type: 'Talebot_Sound_play',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Sound',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('VALUE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 6;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Sound_play_animal: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '동물 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['돼지', 0x10],
						['양', 0x11],
						['소', 0x12],
						['말', 0x13],
						['오리', 0x14],
						['암탉', 0x15],
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
				params: [ 0x10 ],
				type: 'Talebot_Sound_play_animal',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Sound',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('VALUE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 6;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Talebot_Sound_play_praise: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '칭찬 %1 말하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['좋아!', 0x20],
						['맞아!', 0x21],
						['훌륭해!', 0x22],
						['우아!', 0x23],
						['만세!', 0x24],
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
				params: [ 0x20 ],
				type: 'Talebot_Sound_play_praise',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			class: 'Talebot_Sound',
			isNotFor: ['Talebot Pro'],
			func: function (sprite, script) {
				var var1 = script.getNumberValue('VALUE', script);
				var sq = Entry.hw.sendQueue;
				var pd = Entry.hw.portData;
				if (!Entry.Talebot.isStarted) {
					sq.seq = Entry.Talebot.sequance++;
					sq.cat = 2;
					sq.act = 6;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Talebot.isStarted = true;
					Entry.Talebot.state = TalebotState.STATE_READY;
					return script;
				} else {
					switch (Entry.Talebot.state) {
						case TalebotState.STATE_READY:
							if (!pd.done) {
								Entry.Talebot.state = TalebotState.STATE_WAIT;
							}
							return script;
						case TalebotState.STATE_WAIT:
							if (pd.done) {
								Entry.Talebot.state = TalebotState.STATE_DONE;
							}
							return script;
						case TalebotState.STATE_DONE:
							Entry.Talebot.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
	};
};

module.exports = Entry.Talebot;
