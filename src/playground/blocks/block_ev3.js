"use strict";

Entry.EV3 = {
	PORT_MAP: {
		A: 0,
		B: 0,
		C: 0,
		D: 0,
		'1': undefined,
		'2': undefined,
		'3': undefined,
		'4': undefined
	},
	motorMovementTypes: {
		Degrees: 0,
		Power: 1
	},
	deviceTypes: {
		NxtTouch: 1,
		NxtLight: 2,
		NxtSound: 3,
		NxtColor: 4,
		NxtUltrasonic: 5,
		NxtTemperature: 6,
		LMotor: 7,
		MMotor: 8,
		Touch: 16,
		Color: 29,
		Ultrasonic: 30,
		Gyroscope: 32,
		Infrared: 33,
		Initializing: 0x7d,
		Empty: 0x7e,
		WrongPort: 0x7f,
		Unknown: 0xff
	},
	colorSensorValue: ['', '000000', '0000FF', '00FF00', 'FFFF00', 'FF0000', 'FFFFFF', 'A52A2A'],
	timeouts: [],
	removeTimeout: function(id) {
		clearTimeout(id);
		var timeouts = this.timeouts;
		var index = timeouts.indexOf(id);
		if(index >= 0) {
			timeouts.splice(index, 1);
		}
	},
	removeAllTimeouts: function() {
		var timeouts = this.timeouts;
		for(var i in timeouts) {
			clearTimeout(timeouts[i]);
		}
		this.timeouts = [];
	},
	setZero: function() {
		var portMap = this.PORT_MAP;
		Object.keys(portMap).forEach(function (port) {
			var regex = /[A-D]/i;
			if(regex.test(port)) {
				Entry.hw.sendQueue[port] = {
					type: Entry.EV3.motorMovementTypes.Power,
					power: 0
				}
			} else {
				Entry.hw.sendQueue[port] = portMap[port];
			}

		});
		Entry.hw.update();
	},
	name: 'EV3'
};