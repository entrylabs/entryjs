"use strict";

Entry.hummingbird = {	

	PORT_MAP: {
		triLEDR1: 256, //D7
		triLEDG1: 256, //D4
		triLEDB1: 256, //D12
		triLEDR2: 256, //D11
		triLEDG2: 256, //D6
        triLEDB2: 256, //D5	
		led1: 256, //D3
		led2: 256, //D2
		led3: 256, //HWB
		led4: 256, //A0
		vibrat1: 256, //D9
		vibrat2: 256, //D10
		dcMotor1: 256, //spi
		dcMotor2: 256, //spi
		//servo1: 256,  //spi
		//servo2: 256,  //spi
		//servo3: 256, //spi
		//servo4: 256  //spi
	},
	setZero: function() {
		var portMap = Entry.hummingbird.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var hummingbird = Entry.hummingbird;
		hummingbird.removeAllTimeouts();
	},
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

	//장치이름, 부사장님과 상의가 필요 일단 허밍버드로
	name: 'hummingbird'
};