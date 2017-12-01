"use strict";

Entry.Roborobo_Roduino = {
    name: 'roborobo_roduino',
    INSTRUCTION : {
        DIGITAL_READ: 1,
        DIGITAL_SET_MODE: 2,
        DIGITAL_WRITE: 3,
        ANALOG_WRITE: 4,
        ANALOG_READ: 5,
        MOTOR: 6,
        COLOR: 7
    },
    setZero: function() {        
        Entry.hw.sendQueue.colorPin = 0;
        Entry.hw.sendQueue.analogEnable = [ 0, 0, 0, 0, 0, 0 ];
        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
        }
        this.ColorPin = [ 0, 0, 0 ];
        Entry.hw.update();
    },
    ColorPin: [ 0, 0, 0 ]
};

Entry.Roborobo_SchoolKit = {
    name: 'roborobo_schoolkit',
    pinMode : {
        INPUT:  0,
        OUTPUT: 1,
        ANALOG: 2,
        PWM:    3,
        SERVO:  4
    },
	inputPort : {
		ir : 7,
		sound : 8,
		contact : 9,
		cds : 10
	},
    setZero: function() {       
        Entry.hw.sendQueue.digitalPinMode = [];
        Entry.hw.sendQueue.servo = [ false, false, false, false, false ];
        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
			Entry.hw.sendQueue.digitalPinMode[port] = 0;
        }
        Entry.hw.update();
    }
};