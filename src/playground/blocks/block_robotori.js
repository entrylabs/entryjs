"use strict";

Entry.robotori = {
	PORT_MAP:{
		A0: 0,
		A1: 0,
		A2: 0,
		A3: 0,
		A4: 0,
		A5: 0,
		D2: 0,
		D3: 0,
		D10: 0,
		D11: 0,
		D12: 0,
		D13: 0,
		AOUT5: 0,
		AOUT6: 0,
		AOUT9: 0,
		SERVO: 90,
		rightMotor: 0,
		leftMotor: 0
	},
	setZero: function() {
		//Entry.hw.sendQueue.readablePorts = [];
	
		var portMap = Entry.robotori.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
			//sq[portMap[port] = 0;

			//Entry.hw.sendQueue.readablePorts.push(port);
		}
		Entry.hw.update();
		var Robotori = Entry.robotori;
	},
	name: 'robotori',
	monitorTemplate: {
        imgPath: "hw/robotori.png",
        width: 395,
        height: 372,
        listPorts: {
            "A0":{name: "A0", type: "input", pos: {x: 0, y: 0}},
            "A1":{name: "A1", type: "input", pos: {x: 0, y: 0}},
            "A2":{name: "A2", type: "input", pos: {x: 0, y: 0}},
            "A3":{name: "A3", type: "input", pos: {x: 0, y: 0}},
            "A4":{name: "A4", type: "input", pos: {x: 0, y: 0}},
            "A5":{name: "A5", type: "input", pos: {x: 0, y: 0}},
            "D2":{name: "D2", type: "input", pos: {x: 0, y: 0}},
            "D3":{name: "D3", type: "input", pos: {x: 0, y: 0}},
        },
        mode: 'both'
    }
};