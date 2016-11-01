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

Entry.byrobot_dronefighter =
{
	name: 'byrobot_dronefighter',

	// 하드웨어로 전송할 때 사용하는 변수 목록('setZero'에서 sendQueue에 등록하여 사용)
	// 'entry-hw' 프로젝트 byrobot_dronefighter.js 파일 내부의 'var DataType'에 정의된 것과 동일하게 사용해야 함
	PORT_MAP:
	{
		ledModeColor_mode: 0,
		ledModeColor_r: 0,
		ledModeColor_g: 0,
		ledModeColor_b: 0,
		ledModeColor_interval: 0,

		ledEventColor_mode: 0,
		ledEventColor_r: 0,
		ledEventColor_g: 0,
		ledEventColor_b: 0,
		ledEventColor_interval: 0,
		ledEventColor_repeat: 0,

		control_roll: 0,
		control_pitch: 0,
		control_yaw: 0,
		control_throttle: 0
	},

	// 초기화
	setZero: function()
	{
		var portMap = Entry.byrobot_dronefighter.PORT_MAP;
		var send = Entry.hw.sendQueue;

		for (var port in portMap)
		{
			send[port] = undefined;
		}

		Entry.hw.update();
		//var byrobot_dronefighter = Entry.byrobot_dronefighter;
	},

	// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
	// listPorts와 ports 두 곳 동시에 동일한 속성을 표시할 수는 없음
    monitorTemplate:
	{
        imgPath: "hw/byrobot_dronefighter.png",		// 배경 이미지
        width: 500,		// 이미지의 폭
        height: 450,	// 이미지의 높이
		
		// 모니터 화면 상단에 차례대로 나열하는 값
        listPorts:
		{
            "attitude_roll"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_roll,		type: "input", pos: {x: 0, y: 0}},
            "attitude_pitch"	:{name: Lang.Blocks.byrobot_dronefighter_attitude_pitch,	type: "input", pos: {x: 0, y: 0}},
            "attitude_yaw"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_yaw,		type: "input", pos: {x: 0, y: 0}}
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


