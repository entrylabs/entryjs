Entry.JDKit = {
	Cmd: {
		"LED": 1,
		"TUNE": 2,
		"TUNEDUR": 3,
		"ROLL": 4,
		"PITCH": 5,
		"YAW": 6,
		"THROTTLE": 7,
		"OPTION": 8,
		"MOTOR0": 9,
		"MOTOR1": 10,
		"MOTOR2": 11,
		"MOTOR3": 12,
	},
	Sensor: {
		"JOYSTICK_LLR": 1,
		"JOYSTICK_LTB": 2,
		"JOYSTICK_RLR": 3,
		"JOYSTICK_RTB": 4,
		"BUTTON": 5,
		"DRONECONNECT": 6,
		"ULTRASONIC": 7,
		"GYRO_X": 8,
		"GYRO_Y": 9,
		"DRONEREADY": 10,
	},
	setZero: function () {
		Entry.hw.sendQueue.CMD = [0xF0, 0x00, 0x00, 0x00, 0x64, 0x64, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		Entry.hw.update();
	},
	name: "JDKit",
	monitorTemplate: {
		imgPath: "hw/coconut.png",
		width: 256,
		height: 256,
		listPorts: {
			"CMD[1]": {
				name: Lang.Blocks.coconut_sensor_temperature,
				type: "input",
				pos: {
					x: 0,
					y: 0
				}
			},
			"accelerationX": {
				name: Lang.Blocks.coconut_sensor_acceleration_x,
				type: "input",
				pos: {
					x: 0,
					y: 0
				}
			},
			"accelerationY": {
				name: Lang.Blocks.coconut_sensor_acceleration_y,
				type: "input",
				pos: {
					x: 0,
					y: 0
				}
			},
			"accelerationZ": {
				name: Lang.Blocks.coconut_sensor_acceleration_z,
				type: "input",
				pos: {
					x: 0,
					y: 0
				}
			},
		},
		ports: {
			"leftProximityValue": {
				name: Lang.Blocks.coconut_sensor_left_proximity,
				type: "input",
				pos: {
					x: 122,
					y: 156
				}
			},
			"rightProximityValue": {
				name: Lang.Blocks.coconut_sensor_right_proximity,
				type: "input",
				pos: {
					x: 10,
					y: 108
				}
			},
			"leftFloorValue": {
				name: Lang.Blocks.coconut_sensor_left_floor,
				type: "input",
				pos: {
					x: 100,
					y: 234
				}
			},
			"rightFloorValue": {
				name: Lang.Blocks.coconut_sensor_right_floor,
				type: "input",
				pos: {
					x: 13,
					y: 180
				}
			},
			"light": {
				name: Lang.Blocks.coconut_sensor_light,
				type: "input",
				pos: {
					x: 56,
					y: 189
				}
			},
		},
		mode: 'both'
	}
};