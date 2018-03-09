"use strict";

Entry.Xbot = {
	PORT_MAP: {
		rightWheel: 0,
		leftWheel: 0,
		head: 90,
		armR: 90,
		armL: 90,
		analogD5: 127,//D4
		analogD6: 127,//D5
		D4: 0,
		D7: 0,
		D12: 0,
		D13: 0,
		ledR: 0,
		ledG: 0,
		ledB: 0,
		lcdNum: 0,
		lcdTxt: '                ',
		note: 262,
		duration: 0		
	},
	setZero: function() {
		var portMap = Entry.Xbot.PORT_MAP;
		var sq = Entry.hw.sendQueue;
		for (var port in portMap) {
			sq[port] = portMap[port];
		}
		Entry.hw.update();
		var Xbot = Entry.Xbot;
		Xbot.removeAllTimeouts();
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
	name: 'xbot_epor_edge'
};