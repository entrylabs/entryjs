"use strict";

Entry.Altino = {
	PORT_MAP: {
		rightWheel: 0,
		leftWheel: 0,
		steering: 0,
		ascii: 0,		
		led: 0,
		led2: 0,
		note: 0,
        dot1: 0,
        dot2: 0,
        dot3: 0,
        dot4: 0,
        dot5: 0,
        dot6: 0,
        dot7: 0,
        dot8: 0	
	},
	setZero: function() {
		var portMap = Entry.Altino.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var Altino = Entry.Altino;
		Altino.removeAllTimeouts();
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
	name: 'altino'
};

