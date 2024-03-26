'use strict';

const PreAction = {
	STOP: 0x00,
    MOVE_FORWARD: 0x01,
    MOVE_BACKWARD: 0x02,
    TURN_LEFT: 0x03,
    TURN_RIGHT: 0x04,

	ACTION_UNKNOWN: 0xFF,
}

class TelliotBase {
	constructor () {
		this.resetState();
    }

	setZero() {
		this.resetState();
        Entry.hw.update();
    }

    afterReceive = function (data) {
        const keys = data.state ? Object.keys(data.state) : [];
        keys.forEach(key => {
			this.state[key] = data.state[key]
			console.log(typeof(this.state.sensors))
		});

		console.log('[afterReceive] : ' + keys);
    }

	afterSend = function () {
		this.resetState();
        Entry.hw.sendQueue = {};
    }

    resetState () {
        this.state = {
            sensors: 0,
            rfid: []
        };
    }

	request (func, subkey, value, updateNow = false) {
		if (!Entry.hw.sendQueue[func])
			Entry.hw.sendQueue[func] = {};

		if (subkey) {
			Entry.hw.sendQueue[func][subkey.toString()] = value;
		}
		else {
			Entry.hw.sendQueue[func] = value;
		}

		console.log('[' + func + '] : ' + value);

		if (updateNow)
			Entry.hw.update();
	}

	req_add_chatbot (sprite, script) {
		const ask = script.getStringValue('AI_CHATBOT_ASK');
		const resp = script.getStringValue('AI_CHATBOT_RESP');

		console.log('[req_chatbot] : ' + ask + ' => ' + resp);
		this.request('add_chatbot', null, {ask, resp}, true);
		return script.callReturn();
	}

	req_voice_trigger (sprite, script) {
		this.request('req_voice_trigger_click', null, 1);
		return script.callReturn();
	}

	req_speech_to_text (sprite, script) {
		this.request('req_stt', null, 1);
		return script.callReturn();
	}

	req_text_to_speech (sprite, script) {
		const stot = script.getStringValue('TEXT_TO_SPEECH');

		console.log('[req_tts] : ' + stot);
		this.request('req_tts', null, stot, true);
		return script.callReturn();
	}

	req_add_prompt (sprite, script) {
		const ai_prompt = script.getStringValue('AI_PROMPT');

		console.log('[add_prompt] : ' + ai_prompt);
		this.request('add_prompt', null, ai_prompt, true);
		return script.callReturn();
	}

	req_predefined_action (sprite, script) {
		const action_stridx = script.getStringValue('PREDEFINED_MOTION_ID');
		const action_value = script.getNumberValue('PREDEFINED_MOTION_VALUE');
		let action_id = PreAction.ACTION_UNKNOWN;

		switch(action_stridx) {
			case 'forward' :
				action_id = PreAction.MOVE_FORWARD;
				break;
			case 'backward' :
				action_id = PreAction.MOVE_BACKWARD;
				break;
			case 'left' :
				action_id = PreAction.TURN_LEFT;
				break;
            case 'right' :
				action_id = PreAction.TURN_RIGHT;
				break;
		}

		this.request('pre_action', null, {action_id, action_value}, true);

		return script.callReturn();
	}

	req_action_stop (sprite, script) {
		const action_id = PreAction.STOP;
		const action_value = 0;

		this.request('pre_action', null, {action_id, action_value}, true);
		return script.callReturn();
	}

	req_motor_control (sprite, script) {
		const port = script.getStringValue('MOTOR_PORT_ID');
		const motor_value = script.getNumberValue('MOTOR_PORT_VALUE');
		const dir = script.getStringValue('MOTOR_DIRECTION');
		var   motor_id, motor_dir;

		switch(port)
		{
			case 'left wheel' :		motor_id = 0;	break;
			case 'right wheel' :	motor_id = 1;	break;
			case 'left foot' :		motor_id = 0;	break;
			case 'right foot' :		motor_id = 1;	break;
			case 'left Leg' :		motor_id = 2;	break;
			case 'right Leg' :		motor_id = 3;	break;
			case 'left arm' :		motor_id = 4;	break;
			case 'right arm' :		motor_id = 5;	break;
			case 'head' :			motor_id = 6;	break;
		}

		switch(dir)
		{
			case 'clockwise' :
				motor_dir = 0;
				break;
			case 'counterclockwise' :
				motor_dir = 1;
				break;
		}

		this.request('motor_ctrl', null, {motor_id, motor_dir, motor_value}, true);
		return script.callReturn();
	}

	req_line_trace (sprite, script) {
		const dir = script.getStringField('LINE_TRACE_DIR');
		var line_color = 0;
		var line_dir;

		switch(dir)
		{
			case 'forward' :
				line_dir = 0;
				break;
			case 'backward' :
				line_dir = 1;
				break;
		}

		this.request('line_trace', null, {line_color, line_dir}, true);

		return script.callReturn();
	}

	req_detect_object (sprite, script) {
		const obj = script.getStringField('OBJECT_DETECT');
		var sensor_id = 0;
		var detect_object = 0;

		if (obj === 'detected')
			detect_object = 1;
		else
			detect_object = 0;
		console.log(this.state.sensors)
		console.log('[req_detect_object] : ' + this.state.sensors);
		if (detect_object === 1 && this.state.sensors !== 0 && typeof(this.state.sensors) === 'number') {
			console.log('1111111111111111')
			return true;
		}else if (detect_object === 0 && this.state.sensors.length === 0){
			console.log('22222222222222222')
			return true;
		} else {
			console.log('123981237980123091238079231809')
			return false
		}
	}

	req_rfid_tag_detect (sprite, script) {
		const tag = script.getStringField('TAG_DETECT');
		var tag_id = 0;

		switch(tag) {
			case 'circle' :		tag_id = 0;	break;
			case 'rectangle' :	tag_id = 1;	break;
			case 'triangle' :	tag_id = 2;	break;
			case 'star' :		tag_id = 3;	break;
			case 'diamond' :	tag_id = 4;	break;
			case 'heart' :		tag_id = 5;	break;
		}

		console.log('[req_rfid_tag_detect] : ' + tag_id + '   ' + this.state.rfid);
		if (this.state.rfid[tag_id]) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = {TelliotBase, PreAction};
