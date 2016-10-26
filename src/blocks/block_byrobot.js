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
	// 'entry-hw' 프로젝트 byrobot_dronefighter.js 파일 내부의 'var DataType'에 정의된 것과 동일하게 사용해야함
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
		var sq = Entry.hw.sendQueue;

		for (var port in portMap)
		{
			sq[port] = portMap[port];
		}

		Entry.hw.update();
		var byrobot_dronefighter = Entry.byrobot_dronefighter;
	},

	// Entry 좌측 하단 하드웨어 모니터 화면에 표시하는 속성 
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

		// 모니터 화면 지정 위치에 표시하는 값
        ports:
		{
            "attitude_roll"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_roll,		type: "input", pos: {x: 100, y: 30}},
            "attitude_pitch"	:{name: Lang.Blocks.byrobot_dronefighter_attitude_pitch,	type: "input", pos: {x: 100, y: 60}},
            "attitude_yaw"		:{name: Lang.Blocks.byrobot_dronefighter_attitude_yaw,		type: "input", pos: {x: 100, y: 90}}
        },

		mode : 'both'	// 표시 모드
    }
};


/***************************************************************************************
 *	블럭 정의
 *
 *	Entry.hw.portData	: 값 읽기
 *	Entry.hw.sendQueue	: 값 쓰기
 ***************************************************************************************/


// -- 모니터 블럭 -----------------------------------------------------------------------

// 드론과 컨트롤러로부터 읽어오는 데이터에 대한 정의 및 해당 데이터를 Entry.hw.portData에 등록
// 'entry-hw' 프로젝트 byrobot_dronefighter.js 파일 내부의 'var DataType'에 정의된 것과 동일하게 사용해야함
Blockly.Blocks.byrobot_dronefighter_value =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField('')
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_attitude_roll,	"attitude_roll"],
					[Lang.Blocks.byrobot_dronefighter_attitude_pitch,	"attitude_pitch"],
					[Lang.Blocks.byrobot_dronefighter_attitude_yaw,		"attitude_yaw"]
				]), "DEVICE");
		this.setInputsInline(true);
		this.setOutput(true, 'Number');
	}
};

Entry.block.byrobot_dronefighter_value = function (sprite, script)
{
	var read	= Entry.hw.portData;
	var device	= script.getField('DEVICE');
	return read[device];
};

// -- 일반 제어 블럭 --------------------------------------------------------------------

// 팀 LED 모드
Blockly.Blocks.byrobot_dronefighter_ledModeColor_team =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_team_Red,		"RED"],
					[Lang.Blocks.byrobot_dronefighter_team_Blue,	"BLUE"]
				]), "TEAM")
			.appendField(Lang.Blocks.byrobot_dronefighter_team)
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_0)
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamHold,			"17"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamFlicker,		"19"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamFlickerDouble,	"20"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamDimming,		"21"]
				]), "MODE")
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_1);
		this.appendValueInput("INTERVAL")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_2)
			.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.byrobot_dronefighter_ledModeColor_team = function (sprite, script)
{
	var send = Entry.hw.sendQueue;

	var team = script.getField('TEAM');
	var mode = script.getField('MODE');
	var interval = script.getNumberValue('INTERVAL');
	
	// 범위 조정
    interval = Math.max(interval, 0);
    interval = Math.min(interval, 255);
	
	// 전송
	send.ledModeColor_mode = mode;
	if ( team == 'RED' )
		send.ledModeColor_r = 255;
	else
		send.ledModeColor_b = 255;
	send.ledModeColor_interval = interval;

	return script.callReturn();
};

// LED 모드
Blockly.Blocks.byrobot_dronefighter_ledModeColor =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_0)
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmHold,			"65"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmFlicker,		"67"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmFlickerDouble,	"68"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmDimming,		"69"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_AllEnergyBeamIn,	"151"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_AllEnergyBeamOut,	"152"]
				]), "MODE")
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_1);
		this.appendValueInput("INTERVAL")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledModeColor_2)
			.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.byrobot_dronefighter_ledModeColor = function (sprite, script)
{
	var send		= Entry.hw.sendQueue;

	var mode		= script.getField('MODE');
	var interval	= script.getNumberValue('INTERVAL');
	
	// 범위 조정
    interval = Math.max(interval, 0);
    interval = Math.min(interval, 255);
	
	// 전송
	send.ledModeColor_mode		= mode;
	send.ledModeColor_interval	= interval;

	return script.callReturn();
};



// 팀 LED 이벤트
Blockly.Blocks.byrobot_dronefighter_ledEventColor_team =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_team_Red,		"RED"],
					[Lang.Blocks.byrobot_dronefighter_team_Blue,	"BLUE"]
				]), "TEAM")
			.appendField(Lang.Blocks.byrobot_dronefighter_team)
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_0)
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamHold,			"17"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamFlicker,		"19"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamFlickerDouble,	"20"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_TeamDimming,		"21"]
				]), "EVENT")
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_1);
		this.appendValueInput("INTERVAL")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_2)
		this.appendValueInput("REPEAT")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_3)
			.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.byrobot_dronefighter_ledEventColor_team = function (sprite, script)
{
	var send		= Entry.hw.sendQueue;

	var team		= script.getField('TEAM');
	var event		= script.getField('EVENT');
	var interval	= script.getNumberValue('INTERVAL');
	var repeat		= script.getNumberValue('REPEAT');
	
	// 범위 조정
    interval = Math.max(interval, 0);
    interval = Math.min(interval, 255);
    repeat = Math.max(repeat, 0);
    repeat = Math.min(repeat, 255);
	
	// 전송
	send.ledEventColor_event	= event;
	if ( team == 'RED' )
		send.ledEventColor_r	= 255;
	else
		send.ledEventColor_b	= 255;
	send.ledEventColor_interval	= interval;
	send.ledEventColor_repeat	= repeat;

	return script.callReturn();
};


// LED 이벤트
Blockly.Blocks.byrobot_dronefighter_ledEventColor =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_0)
			.appendField(new Blockly.FieldDropdown([
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmHold,			"65"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmFlicker,		"67"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmFlickerDouble,	"68"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_ArmDimming,		"69"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_AllEnergyBeamIn,	"151"],
					[Lang.Blocks.byrobot_dronefighter_light_mode_AllEnergyBeamOut,	"152"]
				]), "MODE")
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_1);
		this.appendValueInput("INTERVAL")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_2)
		this.appendValueInput("REPEAT")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_ledEventColor_3)
			.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.byrobot_dronefighter_ledEventColor = function (sprite, script)
{
	var send		= Entry.hw.sendQueue;

	var event		= script.getField('EVENT');
	var interval	= script.getNumberValue('INTERVAL');
	var repeat		= script.getNumberValue('REPEAT');
	
	// 범위 조정
    interval = Math.max(interval, 0);
    interval = Math.min(interval, 255);
    repeat = Math.max(repeat, 0);
    repeat = Math.min(repeat, 255);
	
	// 전송
	send.ledModeColor_mode		= mode;
	send.ledEventColor_interval	= interval;
	send.ledEventColor_repeat	= repeat;

	return script.callReturn();
};



// Control
Blockly.Blocks.byrobot_dronefighter_control =
{
	init: function()
	{
		this.setColour("#00979D");
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_control_0)
		this.appendValueInput("ROLL")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_control_1)
		this.appendValueInput("PITCH")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_control_2)
		this.appendValueInput("YAW")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_control_3)
		this.appendValueInput("THROTTLE")
			.setCheck(["Number", "String"]);
		this.appendDummyInput()
			.appendField(Lang.Blocks.byrobot_dronefighter_control_4)
			.appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
	}
};

Entry.block.byrobot_dronefighter_control = function (sprite, script)
{
	var send		= Entry.hw.sendQueue;

	var roll		= script.getNumberValue('ROLL');
	var pitch		= script.getNumberValue('PITCH');
	var yaw			= script.getNumberValue('YAW');
	var throttle	= script.getNumberValue('THROTTLE');
	
	// 범위 조정
    roll		= Math.max(roll, 0);
    roll		= Math.min(roll, 100);
    pitch		= Math.max(pitch, 0);
    pitch		= Math.min(pitch, 100);
    yaw			= Math.max(yaw, 0);
    yaw			= Math.min(yaw, 100);
    throttle	= Math.max(throttle, 0);
    throttle	= Math.min(throttle, 100);
	
	// 전송
	send.control_roll		= roll;
	send.control_pitch		= pitch;
	send.control_yaw		= yaw;
	send.control_throttle	= throttle;

	return script.callReturn();
};




