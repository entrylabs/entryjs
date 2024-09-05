'use strict';

let RobicoState = {
	STATE_READY: 'ready',
	STATE_WAIT: 'wait',
	STATE_DONE: 'done',
};

Entry.Robico = {
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
		let portMap = Entry.Robico.PORT_MAP;
		let sq = Entry.hw.sendQueue;
		Entry.Robico.sequance = 1;
		Entry.Robico.isStarted = false;
		Entry.Robico.state = RobicoState.STATE_DONE;
		for (let port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
	},
	id: '24.5',
	name: 'Robico',
	url: 'https://robico.info',
	imageName: 'robico.png',
	title: {
		ko: '로비코',
		en: 'RoBico',
	},
	sequance: 1,
	isStarted: false,
	state: RobicoState.STATE_DONE,
};
Entry.Robico.blockMenuBlocks = [
	'Robico_SensorColF',
	'Robico_SensorIR',
	'Robico_SensorDrop',
	'Robico_Move1',
	'Robico_Move2',
	'Robico_Wheel',
	'Robico_Rotate1',
	'Robico_Rotate2',
	'Robico_Stop',
	'Robico_Linetrace',
	'Robico_Ladder',
	'Robico_Maze',
	'Robico_TracingSpeed',
	'Robico_LightColorL',
	'Robico_LightColorF',
	'Robico_LightOff',
	'Robico_LightFun',
	'Robico_SoundNum',
	'Robico_SoundCol',
	'Robico_SoundMov',
	'Robico_SoundAni',
	'Robico_SoundEmo',
	'Robico_SoundGre',
	'Robico_SoundMis',
	'Robico_SoundTon',
	'Robico_SoundColF',
	'Robico_SoundRec',
	'Robico_Fun'
];
Entry.Robico.getBlocks = function () {
	return {
		Robico_SensorColF: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '바닥 색깔 %1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['검은색', 3],
						['빨간색', 4],
						['초록색', 5],
						['파란색', 6],
						['노란색', 7],
						['흰색', 1],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [3],
				type: 'Robico_SensorColF',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Robico'],
			class: 'Robico_Sensor',
			func: function (sprite, script) {
				let var1 = script.getNumberField('VALUE', script);
				let pd = Entry.hw.portData;
				if (var1 == pd.color)
					return true;
				return false;
			},
		},
		Robico_SensorIR: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '%1 장애물',
			params: [
				{
					type: 'Dropdown',
					options: [
						['앞쪽', 1],
						['뒤쪽', 2],
						['앞뒤', 3],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [1],
				type: 'Robico_SensorIR',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Robico'],
			class: 'Robico_Sensor',
			func: function (sprite, script) {
				let var1 = script.getNumberField('VALUE', script);
				let pd = Entry.hw.portData;
				switch (var1) {
					case 1:
						return pd.ir_front_left == 1 || pd.ir_front_right == 1;
					case 2:
						return pd.ir_rear == 1;
					case 3:
						return (pd.ir_front_left == 1 || pd.ir_front_right == 1) && pd.ir_rear == 1;
				}
				return false;
			},
		},
		Robico_Sensor6: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '로비코 %1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['들림', 1],
						['내림', 2],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [1],
				type: 'Robico_Sensor6',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Robico'],
			class: 'Robico_Sensor',
			func: function (sprite, script) {
				let var1 = script.getNumberField('VALUE', script);
				let pd = Entry.hw.portData;
				switch (var1) {
					case 1:
						return (pd.acc & 8) > 0;
					case 2:
						return (pd.acc & 4) > 0;
				}
				return false;
			},
		},
		Robico_SensorDrop: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '로비코 %1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['들림', 1],
						['내림', 2],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [1],
				type: 'Robico_SensorDrop',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Robico'],
			class: 'Robico_Sensor',
			func: function (sprite, script) {
				let var1 = script.getNumberField('VALUE', script);
				let pd = Entry.hw.portData;
				switch (var1) {
					case 1:
						return pd.drop == 1;
					case 2:
						return pd.drop == 0;
				}
				return false;
			},
		},
		Robico_DetectLine: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic_boolean_field',
			template: '%1',
			params: [
				{
					type: 'Dropdown',
					options: [
						['라인 감지', 1],
						['갈림길 감지', 2],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
			],
			def: {
				params: [1],
				type: 'Robico_DetectLine',
			},
			paramsKeyMap: {
				VALUE: 0,
			},
			isNotFor: ['Robico'],
			class: 'Robico_Sensor',
			func: function (sprite, script) {
				let var1 = script.getNumberField('VALUE', script);
				let pd = Entry.hw.portData;
				switch (var1) {
					case 1:
						if (pd.line)
							return true;
						break;
					case 2:
						if (pd.line_mode)
							return true;
						break;
				}
				return false;
			},
		},
		Robico_Move1: {
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
						['앞', 1],
						['뒤', -1],
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
						['느리게', 4],
						['보통으로', 6],
						['빠르게', 9],
						['부스터', 12],
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
				params: [1, 10, 6],
				type: 'Robico_Move1',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				DISTANCE: 1,
				SPEED: 2,
			},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('DIRECTION', script);
				let var2 = script.getNumberValue('DISTANCE', script);
				let var3 = script.getNumberValue('SPEED', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var2 * var1 * 10;
					sq.p2 = var3 * 10;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.motor) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.motor) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Move2: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 cm 거리를 %2 cm/s 속도로 이동하기 %3',
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
				params: [5, 5],
				type: 'Robico_Move2',
			},
			paramsKeyMap: {
				DISTANCE: 0,
				SPEED: 1,
			},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('DISTANCE', script);
				let var2 = script.getNumberValue('SPEED', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var1 * 10;
					sq.p2 = var2 * 10;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.motor) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.motor) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Wheel: {
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
						['앞', 1],
						['뒤', -1],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['느리게', 4],
						['보통으로', 6],
						['빠르게', 9],
						['부스터', 12],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['앞', 1],
						['뒤', -1],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['느리게', 4],
						['보통으로', 6],
						['빠르게', 9],
						['부스터', 12],
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
				params: [1, 6, 1, 6],
				type: 'Robico_Wheel',
			},
			paramsKeyMap: {
				DIRECTION_L: 0,
				SPEED_L: 1,
				DIRECTION_R: 2,
				SPEED_R: 3,
			},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('DIRECTION_L', script);
				let var2 = script.getNumberField('SPEED_L', script);
				let var3 = script.getNumberField('DIRECTION_R', script);
				let var4 = script.getNumberField('SPEED_R', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1 * var2 * 10;
					sq.p2 = var3 * var4 * 10;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Rotate1: {
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
						['시계 방향', 1],
						['반 시계 방향', -1],
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
				params: [1, 90],
				type: 'Robico_Rotate1',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				ANGLE: 1,
			},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('DIRECTION', script);
				let var2 = script.getNumberValue('ANGLE', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 3;
					sq.pcnt = 2;
					sq.p1 = var1 * var2;
					sq.p2 = 90;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.motor) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.motor) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Rotate2: {
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
						['시계 방향', 1],
						['반 시계 방향', -1],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['반 바퀴', 180],
						['한 바퀴', 360],
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
				params: [1, 360],
				type: 'Robico_Rotate2',
			},
			paramsKeyMap: {
				DIRECTION: 0,
				ANGLE: 1,
			},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('DIRECTION', script);
				let var2 = script.getNumberValue('ANGLE', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 3;
					sq.pcnt = 2;
					sq.p1 = var1 * var2;
					sq.p2 = 90;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.motor) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.motor) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Stop: {
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
				type: 'Robico_Stop',
			},
			paramsKeyMap: {},
			class: 'Robico_Movement',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 1;
					sq.act = 0;
					sq.pcnt = 0;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Linetrace: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '선을 따라 이동하기 %1 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['시작', 0],
						['멈춤', 3],
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
				type: 'Robico_Linetrace',
			},
			paramsKeyMap: {
				MODE: 0,
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('MODE', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 1000);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Ladder: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '선을 따라 사다리 타기 %1 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['시작', 1],
						['멈춤', 3],
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
				type: 'Robico_Ladder',
			},
			paramsKeyMap: {
				MODE: 0,
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('MODE', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 2;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 1000);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_Maze: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '선을 따라 %1 으로 미로 찾기 %2 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['랜덤', 0],
						['왼쪽', 1],
						['오른쪽', 2],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['시작', 2],
						['멈춤', 3],
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
				params: [0, 2],
				type: 'Robico_Maze',
			},
			paramsKeyMap: {
				RULE: 0,
				MODE: 1,
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('RULE', script);
				let var2 = script.getNumberValue('MODE', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 2;
					sq.act = 0;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = var2;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 1000);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_WaitCL: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '다음 갈림길까지 기다리기 %1',
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
				type: 'Robico_WaitCL',
			},
			paramsKeyMap: {
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							if(pd.line_mode) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_HR: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '갈림길에서 방향을 %1 으로 선택하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['좌회전', 1],
						['우회전', 2],
						['직진', 3],
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
				type: 'Robico_HR',
			},
			paramsKeyMap: {
				HR: 0,
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('HR', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 2;
					sq.act = 2;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 500);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_TracingSpeed: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '선을 따라가는 속도를 %1 설정하기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['느리게', 0],
						['보통으로', 1],
						['빠르게', 2],
						['부스터', 3],
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
				type: 'Robico_TracingSpeed',
			},
			paramsKeyMap: {
				SPEED: 0,
			},
			class: 'Robico_Linetrace',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberValue('SPEED', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 2;
					sq.act = 3;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 500);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_LightColorP: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 불빛 %2 색으로 켜기 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['왼쪽', 5],
						['오른쪽', 10],
						['양쪽', 15],
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
				params: [5, null],
				type: 'Robico_LightColorP',
			},
			paramsKeyMap: {
				SELECT: 0,
				COLOR: 1,
			},
			class: 'Robico_LEDs',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				let var2 = script.getStringField('COLOR', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 3;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var1;
					sq.p2 = parseInt(parseInt(var2.substr(1, 6), 16));
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_LightColorL: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 불빛 %2 색으로 켜기 %3',
			params: [
				{
					type: 'Dropdown',
					options: [
						['왼쪽', 5],
						['오른쪽', 10],
						['양쪽', 15],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['빨강', 0],
						['주황', 1],
						['노랑', 2],
						['초록', 3],
						['파랑', 4],
						['분홍', 5],
						['보라', 6],
						['하양', 7],
						['무작위', -1],
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
				params: [15, 0],
				type: 'Robico_LightColorL',
			},
			paramsKeyMap: {
				SELECT: 0,
				COLOR: 1,
			},
			class: 'Robico_LEDs',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				let var2 = script.getNumberField('COLOR', script);
				let pool = new Array(0xFF0000, 0xFF4500, 0xFFFF00, 0x008000, 0x1E32FF, 0xFF00FF, 0x4B00C8, 0xFFFFFF);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 3;
					sq.act = 1;
					sq.pcnt = 2;
					sq.p1 = var1;
					if (var2 >= 0) {
						sq.p2 = pool[var2];
					}
					else {
						sq.p2 = pool[Math.floor(Math.random() * 8)];
					}
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_LightColorF: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '바닥 색상을 불빛으로 켜기 %1',
			params: [
				{
					type: 'Indicator',
					img: 'block_icon/hardware_icon.svg',
					size: 12,
				},
			],
			events: {},
			def: {
				type: 'Robico_LightColorF',
			},
			paramsKeyMap: {},
			class: 'Robico_LEDs',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 3;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = 15;
					switch (pd.color) {
						case 1:
							sq.p1 = 0xFFFFFF;
							break;
						case 3:
							sq.p1 = 0x000000;
							break;
						case 4:
							sq.p1 = 0xFF0000;
							break;
						case 5:
							sq.p1 = 0x00FF00;
							break;
						case 6:
							sq.p1 = 0x0000FF;
							break;
						case 7:
							sq.p1 = 0xFFFF00;
							break;
						default:
							sq.p1 = 0x010101;
							break;
					}
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_LightOff: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 불빛 끄기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['왼쪽', 5],
						['오른쪽', 10],
						['양쪽', 15],
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
				params: [15],
				type: 'Robico_LightOff',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_LEDs',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 3;
					sq.act = 0;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_LightFun: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '재미있는 불빛 %1 켜기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['신호등', 1],
						['무지개', 3],
						['경찰차', 4],
						['크리스마스', 2],
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
				type: 'Robico_LightFun',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_LEDs',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 5;
					sq.act = 2;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundNum: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '숫자 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['1', 311],
						['2', 312],
						['3', 313],
						['4', 314],
						['5', 315],
						['6', 316],
						['7', 317],
						['8', 318],
						['9', 319],
						['10', 320],
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
				params: [311],
				type: 'Robico_SoundNum',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundCol: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '색상 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['빨강', 301],
						['주황', 302],
						['노랑', 303],
						['초록', 304],
						['파랑', 305],
						['분홍', 308],
						['보라', 307],
						['하양', 310],
						['검정', 309],
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
				params: [301],
				type: 'Robico_SoundCol',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundMov: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '이동 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['사이렌', 23],
						['경적', 24],
						['엔진음', 25],
						['헬리콥터', 26],
						['뱃고동', 27],
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
				params: [23],
				type: 'Robico_SoundMov',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundAni: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '동물 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['개', 28],
						['호랑이', 29],
						['소', 30],
						['닭', 31],
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
				params: [28],
				type: 'Robico_SoundAni',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundEmo: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '감정 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['행복', 321],
						['슬픔', 322],
						['신남', 323],
						['지루함', 324],
						['화남', 325],
						['사랑', 326],
						['놀람', 336],
						['안심', 335],
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
				params: [321],
				type: 'Robico_SoundEmo',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundGre: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '인사 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['안녕?', 112],
						['반가워!', 332],
						['고마워!', 350],
						['도와줘!', 340],
						['걱정 마!', 342],
						['조심해!', 347],
						['맛있어!', 348],
						['응', 337],
						['아니', 338],
						['좋아', 204],
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
				params: [112],
				type: 'Robico_SoundGre',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundMis: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '미션 %1 소리 내기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['시작!', 330],
						['출발!', 201],
						['도착!', 331],
						['짜잔', 334],
						['한번 해 볼까?', 341],
						['앗, 큰일이야!', 346],
						['야호!', 203],
						['박수', 22],
						['미션 성공!', 345],
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
				params: [330],
				type: 'Robico_SoundMis',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 1;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundTon: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 음을 %2 음으로 %3 초동안 연주하기 %4',
			params: [
				{
					type: 'Dropdown',
					options: [
						['도', 523],
						['레', 587],
						['미', 659],
						['파', 699],
						['솔', 784],
						['라', 880],
						['시', 988],
					],
					fontSize: 11,
					bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
					arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				},
				{
					type: 'Dropdown',
					options: [
						['낮은', 2],
						['높은', 4],
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
				params: [523, 2, 0.5],
				type: 'Robico_SoundTon',
			},
			paramsKeyMap: {
				SELECT: 0,
				OCTAVE: 1,
				INTERVAL: 2,
			},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				let var2 = script.getNumberField('OCTAVE', script);
				let var3 = script.getNumberValue('INTERVAL', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 2;
					sq.pcnt = 2;
					sq.p1 = var1 * var2;
					sq.p2 = var3 * 1000;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundColF: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '바닥 색상을 소리 내기 %1',
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
				type: 'Robico_SoundColF',
			},
			paramsKeyMap: {},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 4;
					sq.pcnt = 1;
					switch (pd.color) {
						case 1:
							sq.p1 = 310;
							break;
						case 3:
							sq.p1 = 309;
							break;
						case 4:
							sq.p1 = 301;
							break;
						case 5:
							sq.p1 = 304;
							break;
						case 6:
							sq.p1 = 305;
							break;
						case 7:
							sq.p1 = 303;
							break;
						default:
							sq.p1 = 0;
							break;
					}
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundRec: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '녹음된 소리 내기 %1',
			params: [
				{
					type: 'Indicator',
					img: 'block_icon/hardware_icon.svg',
					size: 12,
				},
			],
			events: {},
			def: {
				params: [1],
				type: 'Robico_SoundRec',
			},
			paramsKeyMap: {},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 3;
					sq.pcnt = 1;
					sq.p1 = 0;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							if (!pd.audio) {
								Entry.Robico.state = RobicoState.STATE_WAIT;
							}
							return script;
						case RobicoState.STATE_WAIT:
							if (pd.audio) {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
		Robico_SoundStop: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '소리 끄기 %1',
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
				type: 'Robico_SoundStop',
			},
			paramsKeyMap: {},
			class: 'Robico_Sounds',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 4;
					sq.act = 0;
					sq.pcnt = 0;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							Entry.Robico.state = RobicoState.STATE_DONE;
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},

		Robico_Fun: {
			color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			skeleton: 'basic',
			fontColor: '#fff',
			statements: [],
			template: '%1 움직이기 %2',
			params: [
				{
					type: 'Dropdown',
					options: [
						['댄스', 5],
						['소용돌이', 6],
						['뒤로가기', 7],
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
				params: [5],
				type: 'Robico_Fun',
			},
			paramsKeyMap: {
				SELECT: 0,
			},
			class: 'Robico_Fun',
			isNotFor: ['Robico'],
			func: function (sprite, script) {
				let sq = Entry.hw.sendQueue;
				let pd = Entry.hw.portData;
				let var1 = script.getNumberField('SELECT', script);
				if (!Entry.Robico.isStarted) {
					sq.seq = Entry.Robico.sequance++;
					sq.cat = 5;
					sq.act = 2;
					sq.pcnt = 1;
					sq.p1 = var1;
					Entry.Robico.isStarted = true;
					Entry.Robico.state = RobicoState.STATE_READY;
					return script;
				} else {
					switch (Entry.Robico.state) {
						case RobicoState.STATE_READY:
							setTimeout(() => {
								Entry.Robico.state = RobicoState.STATE_DONE;
							}, 100);
							Entry.Robico.state = RobicoState.STATE_WAIT;
							return script;
						case RobicoState.STATE_WAIT:
							return script;
						case RobicoState.STATE_DONE:
							Entry.Robico.isStarted = false;
							return script.callReturn();
					}
				}
				return script;
			},
		},
	};
};

module.exports = Entry.Robico;
