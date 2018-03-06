"use strict";

Entry.trueRobot = {
    name: 'trueRobot',
    PORT_MAP: {
        singlemotor:0x0A,
        dualmotor:0x0A,
        colorled:0x08,
        leds: 0x46,
        linetracer: 0x4C,
        led_line: 0x05,
        leftWheel: 0x09,
        rightWheel: 0x0A,
        allWheel: 0x0B,
        colorRed: 0,
        colorGreen: 0,
        colorBlue: 0,
        ledPort: 0,
        dualPort: 11
    },
    setZero: function() {
	
        var portMap = Entry.trueRobot.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
/*
        var trueRobot = Entry.trueRobot.DeviceID;
        trueRobot.leftWheel = 0;
        trueRobot.rightWheel = 0;
        trueRobot.colorRed = 0;
        trueRobot.colorGreen = 0;
        trueRobot.colorBlue = 0;
	*/
    }
	
};
