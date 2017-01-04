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

Entry.byrobot_petrone =
{
	name: 'byrobot_petrone',

	// 초기화
	setZero: function()
	{
		// 초기화
		{
			var send = Entry.hw.sendQueue;	
			
			// 한 번에 명령을 전송하면 hw까지 제대로 전달되지 않는 경우가 있어
			// 명령을 각각 분리하여 전송하게 함(2017.01.03)
			
			// Drone reset
			send.target								= 0x10;
			
			for (var i = 0; i < 1; i++)
			{
				{
					send.target						= 0x10;
					send.command_command			= 0x24;
					send.command_option				= 0;
					
					Entry.hw.update();
			
					send.command_command			= undefined;
					send.command_option				= undefined;
				}
				
				{
					send.target						= 0x11;
					send.buzzer_mode				= 0;
					send.buzzer_value				= 0;
					send.buzzer_time				= 0;
				
					Entry.hw.update();
					
					send.buzzer_mode				= undefined;
					send.buzzer_value				= undefined;
					send.buzzer_time				= undefined;
				}
				
				{
					send.target						= 0x11;
					send.vibrator_mode				= 0;
					send.vibrator_on				= 0;
					send.vibrator_off				= 0;
					send.vibrator_total				= 0;
					
					Entry.hw.update();
			
					send.vibrator_mode				= undefined;
					send.vibrator_on				= undefined;
					send.vibrator_off				= undefined;
					send.vibrator_total				= undefined;
				}
				
				{
					send.target						= 0x10;
					send.light_manual_flags			= 0xff;
					send.light_manual_brightness	= 0;
			
					Entry.hw.update();
					
					send.light_manual_flags			= undefined;
					send.light_manual_brightness	= undefined;
				}				
				
				{
					send.target						= 0x11;
					send.light_manual_flags			= 0xff;
					send.light_manual_brightness	= 0;
				
					Entry.hw.update();
					
					send.light_manual_flags			= undefined;
					send.light_manual_brightness	= undefined;
				}
				
			}
			
			send.target								= undefined;
		}
	},
	
	// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
	// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
	{
        imgPath: "hw/byrobot_petrone.png",		// 배경 이미지
        width: 500,		// 이미지의 폭
        height: 500,	// 이미지의 높이
		
		// 모니터 화면 상단에 차례대로 나열하는 값
        listPorts:
		{
            "state_modeVehicle"			:{name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_vehicle,				type: "input", pos: {x: 0, y: 0}},
            "state_modeFlight"			:{name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_flight,				type: "input", pos: {x: 0, y: 0}},
            "state_modeDrive"			:{name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_drive,				type: "input", pos: {x: 0, y: 0}},
            "state_coordinate"			:{name: Lang.Blocks.byrobot_dronefighter_drone_state_mode_coordinate,			type: "input", pos: {x: 0, y: 0}},
            "state_battery"				:{name: Lang.Blocks.byrobot_dronefighter_drone_state_battery,					type: "input", pos: {x: 0, y: 0}},
            "attitude_roll"				:{name: Lang.Blocks.byrobot_dronefighter_drone_attitude_roll,					type: "input", pos: {x: 0, y: 0}},
            "attitude_pitch"			:{name: Lang.Blocks.byrobot_dronefighter_drone_attitude_pitch,					type: "input", pos: {x: 0, y: 0}},
            "attitude_yaw"				:{name: Lang.Blocks.byrobot_dronefighter_drone_attitude_yaw,					type: "input", pos: {x: 0, y: 0}},
            "irmessage_irdata"			:{name: Lang.Blocks.byrobot_dronefighter_drone_irmessage,						type: "input", pos: {x: 0, y: 0}},
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
			/*
            "attitude_roll"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_roll,		type: "input", pos: {x: 100, y: 30}},
            "attitude_pitch"	:{name: Lang.Blocks.byrobot_dronefighter_attitude_pitch,	type: "input", pos: {x: 100, y: 60}},
            "attitude_yaw"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_yaw,		type: "input", pos: {x: 100, y: 90}}
			*/
        },

		mode : 'both'	// 표시 모드
    }
};
