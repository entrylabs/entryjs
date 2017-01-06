"use strict";

/***************************************************************************************
 * 
 *	이름 붙이기 규칙(2016.10.26)
 *
 *	1. 변수에 해당하는 이름들은 모두 소문자로 시작
 *	2. 열거형에 해당하는 이름들은 모두 대문자로 시작
 *	3. 모든 이름들은 카멜 표기법을 사용
 *	4. 이어지는 추가 이름은 '_'를 붙여서 연결
 *
 ***************************************************************************************/

/***************************************************************************************
 *	장치와 연관된 변수 및 함수 정의
 ***************************************************************************************/

Entry.byrobot_dronefighter_controller =
{
	name: 'byrobot_dronefighter_controller',

	// 초기화
	setZero: function()
	{
		// 초기화
		
		// 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
		// 명령을 각각 분리하여 전송하게 함(2017.01.03)
		for (var i = 0; i < 1; i++)
		{
			this.transferVibrator(0, 0, 0, 0);
			this.transferbuzzer(0, 0, 0);
			this.transferLightManual(0x11, 0xFF, 0);
		}
	},
	
	// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
	// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
	{
        imgPath: "hw/byrobot_dronefighter_controller.png",		// 배경 이미지
        width: 500,		// 이미지의 폭
        height: 500,	// 이미지의 높이
		
		// 모니터 화면 상단에 차례대로 나열하는 값
        listPorts:
		{
            "joystick_left_x"			:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_left_x,			type: "input", pos: {x: 0, y: 0}},
            "joystick_left_y"			:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_left_y,			type: "input", pos: {x: 0, y: 0}},
            "joystick_left_direction"	:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_left_direction,	type: "input", pos: {x: 0, y: 0}},
            "joystick_left_event"		:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_left_event,		type: "input", pos: {x: 0, y: 0}},
            "joystick_left_command"		:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_left_command,		type: "input", pos: {x: 0, y: 0}},
            "joystick_right_x"			:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_right_x,			type: "input", pos: {x: 0, y: 0}},
            "joystick_right_y"			:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_right_y,			type: "input", pos: {x: 0, y: 0}},
            "joystick_right_direction"	:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_right_direction,	type: "input", pos: {x: 0, y: 0}},
            "joystick_right_event"		:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_right_event,		type: "input", pos: {x: 0, y: 0}},
            "joystick_right_command"	:{name: Lang.Blocks.byrobot_dronefighter_controller_joystick_right_command,		type: "input", pos: {x: 0, y: 0}},
            "button_button"				:{name: Lang.Blocks.byrobot_dronefighter_controller_button_button,				type: "input", pos: {x: 0, y: 0}},
            "button_event"				:{name: Lang.Blocks.byrobot_dronefighter_controller_button_event,				type: "input", pos: {x: 0, y: 0}},
        },

		// 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
        ports:
		{
			
        },

		mode : 'both'	// 표시 모드
    },
	
	
	// functions
	
	// 시간 지연
	checkFinish: function(script, ms)
	{
		if (!script.isStart)
		{
			script.isStart = true;
			script.timeFlag = 1;
			
			var fps = Entry.FPS || 60;
			var timeValue = (60 / fps) * ms;
			
			setTimeout(function()
			{
				script.timeFlag = 0;
			}, timeValue);
			
			return "Start";
		}
		else if (script.timeFlag == 1)
		{
			return "Running";
		}
		else
		{
			delete script.timeFlag;
			delete script.isStart;
			Entry.engine.isContinue = false;
			return "Finish";
		}
	},
	
	// 데이터 전송
	transferLightManual: function(target, flags, brightness)
	{
		// 범위 조정
		target = Math.max(target, 0);
		target = Math.min(target, 255);
		flags = Math.max(flags, 0);
		flags = Math.min(flags, 255);
		brightness = Math.max(brightness, 0);
		brightness = Math.min(brightness, 255);
		
		// 전송
		Entry.hw.setDigitalPortValue("target", target);
		Entry.hw.setDigitalPortValue("light_manual_flags", flags);
		Entry.hw.setDigitalPortValue("light_manual_brightness", brightness);

		Entry.hw.update();

		delete Entry.hw.sendQueue["target"];
		delete Entry.hw.sendQueue["light_manual_flags"];
		delete Entry.hw.sendQueue["light_manual_brightness"];
	},
	
	transferbuzzer: function(mode, value, time)
	{
		// 전송
		Entry.hw.setDigitalPortValue("target", 0x11);
		Entry.hw.setDigitalPortValue("buzzer_mode", mode);
		Entry.hw.setDigitalPortValue("buzzer_value", value);
		Entry.hw.setDigitalPortValue("buzzer_time", time);

		Entry.hw.update();

		delete Entry.hw.sendQueue["target"];
		delete Entry.hw.sendQueue["buzzer_mode"];
		delete Entry.hw.sendQueue["buzzer_value"];
		delete Entry.hw.sendQueue["buzzer_time"];
	},
	
	transferVibrator: function(mode, timeOn, timeOff, timeRun)
	{
		// 범위 조정
		timeOn = Math.max(timeOn, 1);
		timeOn = Math.min(timeOn, 60000);
		timeOff = Math.max(timeOff, 1);
		timeOff = Math.min(timeOff, 60000);
		
		// 전송
		Entry.hw.setDigitalPortValue("target", 0x11);
		Entry.hw.setDigitalPortValue("vibrator_mode", mode);
		Entry.hw.setDigitalPortValue("vibrator_on", timeOn);
		Entry.hw.setDigitalPortValue("vibrator_off", timeOff);
		Entry.hw.setDigitalPortValue("vibrator_total", timeRun);

		Entry.hw.update();

		delete Entry.hw.sendQueue["target"];
		delete Entry.hw.sendQueue["vibrator_mode"];
		delete Entry.hw.sendQueue["vibrator_on"];
		delete Entry.hw.sendQueue["vibrator_off"];
		delete Entry.hw.sendQueue["vibrator_total"];
	},
	
	transferCommand: function(target, command, option)
	{
		// 전송
		Entry.hw.setDigitalPortValue("target", target);
		Entry.hw.setDigitalPortValue("command_command", command);
		Entry.hw.setDigitalPortValue("command_option", option);

		Entry.hw.update();

		delete Entry.hw.sendQueue["target"];
		delete Entry.hw.sendQueue["command_command"];
		delete Entry.hw.sendQueue["command_option"];
	},
	
	// functions for block
	
	// 데이터 읽기
	getData: function(script, device)
	{
		return Entry.hw.portData[device];
	},
	
	// LED 수동 설정
	setLightManual: function(script, target, flags, brightness)
	{
		switch( this.checkFinish(script, 40) )
		{
		case "Start":
			{
				this.transferLightManual(target, flags, brightness);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},
	
	// 버저 설정(함수 호출 시 시간은 모두 ms 단위 사용)
	/*	
		MuteInstantally		= 1,	// 묵음 즉시 적용
		MuteContinually		= 2,	// 묵음 예약
		
		ScaleInstantally	= 3,	// 음계 즉시 적용
		ScaleContinually	= 4,	// 음계 예약
		
		HzInstantally		= 5,	// 주파수 즉시 적용
		HzContinually		= 6,	// 주파수 예약
	 */
	 // 정지
	setBuzzerStop: function(script)
	{
		switch( this.checkFinish(script, 40) )
		{
		case "Start":
			{
				this.transferbuzzer(0, 0, 0);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},
	
	 // 묵음
	setBuzzerMute: function(script, time, flagDelay, flagInstantly)
	{
		time = Math.max(time, 0);
		time = Math.min(time, 60000);
		
		var timeDelay = 40;
		if( flagDelay )
			timeDelay = time;
		
		switch( this.checkFinish(script, timeDelay) )
		{
		case "Start":
			{
				var mode = 2;	// 묵음 연속
				if( flagInstantly )
					mode = 1;	// 묵음 즉시
				
				this.transferbuzzer(mode, 0xEE, time);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},
	
	setBuzzerScale: function(script, octave, scale, time, flagDelay, flagInstantly)
	{
		time = Math.max(time, 0);
		time = Math.min(time, 60000);
		
		var timeDelay = 40;
		if( flagDelay )
			timeDelay = time;
		
		switch( this.checkFinish(script, timeDelay) )
		{
		case "Start":
			{
				var mode = 4;	// Scale 연속
				if( flagInstantly )
					mode = 3;	// Scale 즉시
				
				var scalecalc = (octave * 12) + scale;
				
				this.transferbuzzer(mode, scalecalc, time);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},

	setBuzzerHz: function(script, hz, time, flagDelay, flagInstantly)
	{
		time = Math.max(time, 0);
		time = Math.min(time, 60000);
		
		var timeDelay = 40;
		if( flagDelay )
			timeDelay = time;
		
		switch( this.checkFinish(script, timeDelay) )
		{
		case "Start":
			{
				var mode = 6;	// Hz 연속
				if( flagInstantly )
					mode = 5;	// Hz 즉시
				
				// 범위 조정
				hz = Math.max(hz, 1);
				hz = Math.min(hz, 63999);
				
				this.transferbuzzer(mode, hz, time);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},

	// 진동 제어
	/*
		Stop			= 0,	// 정지
		Instantally		= 1,	// 즉시 적용
		Continually		= 2,	// 예약
	 */
	setVibratorStop: function(script)
	{
		switch( this.checkFinish(script, 40) )
		{
		case "Start":
			{
				this.transferVibrator(0, 0, 0, 0);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},

	setVibrator: function(script, timeOn, timeOff, timeRun, flagDelay, flagInstantly)
	{
		timeRun = Math.max(timeRun, 0);
		timeRun = Math.min(timeRun, 60000);
		
		var timeDelay = 40;
		if( flagDelay )
			timeDelay = timeRun;
		
		switch( this.checkFinish(script, timeDelay) )
		{
		case "Start":
			{
				var mode = 2;	// 예약
				if( flagInstantly )
					mode = 1;	// 즉시
				
				this.transferVibrator(mode, timeOn, timeOff, timeRun);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},
	
	sendCommand: function(script, target, command, option)
	{
		switch( this.checkFinish(script, 40) )
		{
		case "Start":
			{
				this.transferCommand(target, command, option);
			}
			return script;
			
		case "Running":
			return script;
		
		case "Finish":
			return script.callReturn();
			
		default:
			return script.callReturn();
		}
	},
};
