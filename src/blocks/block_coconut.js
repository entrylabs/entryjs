Entry.coconut = {
		PORT_MAP: {
		leftFloorValue: 0,					
		rightFloorValue: 0,					
		BothFloorDetection: 0,		
		leftProximityValue: 0,				
		rightProximityValue: 0,				
		BothProximityDetection: 0,	
		obstacleDetection: 0,				
		light: 0,							
		temp: 0,		     				
		extIrA2 : 0,						
		extIrA3 : 0,	
	},
 setZero:function() {
  var a = Entry.coconut.PORT_MAP, b = Entry.hw.sendQueue, d;
  for (d in a) {
    b[d] = a[d];
  }
  Entry.hw.update();
  a = Entry.coconut;
  a.lineTracerModeId = 0;
  a.lineTracerStateId = -1;
  a.tempo = 60;
  a.removeAllTimeouts();
}, lineTracerModeId:0, lineTracerStateId:-1, tempo:60, timeouts:[], removeTimeout:function(a) {
  clearTimeout(a);
  var b = this.timeouts;
  a = b.indexOf(a);
  0 <= a && b.splice(a, 1);
}, removeAllTimeouts:function() {
  var a = this.timeouts, b;
  for (b in a) {
    clearTimeout(a[b]);
  }
  this.timeouts = [];
}, setLineTracerMode:function(a, b) {
  this.lineTracerModeId = this.lineTracerModeId + 1 & 255;
  a.lineTracerMode = b;
  a.lineTracerModeId = this.lineTracerModeId;
}, 
//START : 2017.02.22 : LTW
msgValue:0,
insertQueue:function(msg, sq){
	sq.msgValue = msg;
},
clearQueue:function(sq){
	sq.msgValue = "";
},
//END 
name:"coconut", 
monitorTemplate: {
        imgPath: "hw/coconut.png",
        width: 256,
        height: 256,
        listPorts:{
            "temperature":{name: Lang.Blocks.coconut_sensor_temperature, type: "input", pos: {x: 0, y: 0}},
            "accelerationX":{name: Lang.Blocks.coconut_sensor_acceleration_x, type: "input", pos: {x: 0, y: 0}},
            "accelerationY":{name: Lang.Blocks.coconut_sensor_acceleration_y, type: "input", pos: {x: 0, y: 0}},
            "accelerationZ":{name: Lang.Blocks.coconut_sensor_acceleration_z, type: "input", pos: {x: 0, y: 0}},
            "buzzer":{name: Lang.Hw.buzzer , type: "output", pos: {x: 0, y: 0}},
            "note":{name:  Lang.Hw.note , type: "output", pos: {x: 0, y: 0}},
        },
        ports: {
            "leftProximityValue":{name: Lang.Blocks.coconut_sensor_left_proximity, type: "input", pos: {x: 122, y: 156}},
            "rightProximityValue":{name: Lang.Blocks.coconut_sensor_right_proximity, type: "input", pos: {x : 10, y: 108}},
            "leftFloorValue":{name: Lang.Blocks.coconut_sensor_left_floor, type: "input", pos: {x: 100, y: 234}},
            "rightFloorValue":{name: Lang.Blocks.coconut_sensor_right_floor, type: "input", pos: {x: 13, y: 180}},
            "light":{name: Lang.Blocks.coconut_sensor_light, type: "input", pos: {x: 56, y: 189}},
        },
      mode : 'both'
    }
};
