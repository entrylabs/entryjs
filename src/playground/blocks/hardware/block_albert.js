'use strict';

Entry.Albert = {
    PORT_MAP: {
        leftWheel: 0,
        rightWheel: 0,
        buzzer: 0,
        leftEye: 0,
        rightEye: 0,
        note: 0,
        bodyLed: 0,
        frontLed: 0,
        padWidth: 0,
        padHeight: 0,
    },
    setZero: function() {
        var portMap = Entry.Albert.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var albert = Entry.Albert;
        albert.tempo = 60;
        albert.removeAllTimeouts();
    },
    monitorTemplate: {
        imgPath: 'hw/albert.png',
        width: 387,
        height: 503,
        listPorts: {
            temperature: {
                name: Lang.Blocks.ALBERT_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.ALBERT_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.ALBERT_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.ALBERT_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            frontOid: {
                name: Lang.Blocks.ALBERT_sensor_front_oid,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            backOid: {
                name: Lang.Blocks.ALBERT_sensor_back_oid,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            positionX: {
                name: Lang.Blocks.ALBERT_sensor_position_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            positionY: {
                name: Lang.Blocks.ALBERT_sensor_position_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            orientation: {
                name: Lang.Blocks.ALBERT_sensor_orientation,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Hw.buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: { name: Lang.Hw.note, type: 'output', pos: { x: 0, y: 0 } },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.ALBERT_sensor_left_proximity,
                type: 'input',
                pos: { x: 178, y: 401 },
            },
            rightProximity: {
                name: Lang.Blocks.ALBERT_sensor_right_proximity,
                type: 'input',
                pos: { x: 66, y: 359 },
            },
            battery: {
                name: Lang.Blocks.ALBERT_sensor_battery,
                type: 'input',
                pos: { x: 88, y: 368 },
            },
            light: {
                name: Lang.Blocks.ALBERT_sensor_light,
                type: 'input',
                pos: { x: 127, y: 391 },
            },
            leftWheel: {
                name: Lang.Hw.leftWheel,
                type: 'output',
                pos: { x: 299, y: 406 },
            },
            rightWheel: {
                name: Lang.Hw.rightWheel,
                type: 'output',
                pos: { x: 22, y: 325 },
            },
            leftEye: {
                name: Lang.Hw.leftEye,
                type: 'output',
                pos: { x: 260, y: 26 },
            },
            rightEye: {
                name: Lang.Hw.rightEye,
                type: 'output',
                pos: { x: 164, y: 13 },
            },
            bodyLed: {
                name: Lang.Hw.body + ' ' + Lang.Hw.led_en,
                type: 'output',
                pos: { x: 367, y: 308 },
            },
            frontLed: {
                name: Lang.Hw.front + ' ' + Lang.Hw.led_en,
                pos: { x: 117, y: 410 },
            },
        },
        mode: 'both',
    },
    tempo: 60,
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    controller: {
        PI: 3.14159265,
        PI2: 6.2831853,
        prevDirection: 0,
        prevDirectionFine: 0,
        directionFineCount: 0,
        positionCount: 0,
        finalPositionCount: 0,
        GAIN_ANGLE: 30,
        GAIN_ANGLE_FINE: 30,
        GAIN_POSITION_FINE: 30,
        STRAIGHT_SPEED: 20,
        MAX_BASE_SPEED: 20,
        GAIN_BASE_SPEED: 1.0,
        GAIN_POSITION: 35,
        POSITION_TOLERANCE_FINE: 3,
        POSITION_TOLERANCE_FINE_LARGE: 5,
        POSITION_TOLERANCE_ROUGH: 5,
        POSITION_TOLERANCE_ROUGH_LARGE: 10,
        ORIENTATION_TOLERANCE_FINE: 0.08,
        ORIENTATION_TOLERANCE_ROUGH: 0.09,
        ORIENTATION_TOLERANCE_ROUGH_LARGE: 0.18,
        MINIMUM_WHEEL_SPEED: 18,
        MINIMUM_WHEEL_SPEED_FINE: 15,
        clear: function() {
            this.prevDirection = 0;
            this.prevDirectionFine = 0;
            this.directionFineCount = 0;
            this.positionCount = 0;
            this.finalPositionCount = 0;
        },
        controlAngleFine: function(currentRadian, targetRadian) {
            var sq = Entry.hw.sendQueue;
            var diff = this.validateRadian(targetRadian - currentRadian);
            var mag = Math.abs(diff);
            if (mag < this.ORIENTATION_TOLERANCE_FINE) return false;

            var direction = diff > 0 ? 1 : -1;
            if (direction * this.prevDirectionFine < 0) {
                if (++this.directionFineCount > 5) return false;
            }
            this.prevDirectionFine = direction;

            var value = 0;
            if (diff > 0) {
                value = Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
                if (value < this.MINIMUM_WHEEL_SPEED) value = this.MINIMUM_WHEEL_SPEED;
            } else {
                value = -Math.log(1 + mag) * this.GAIN_ANGLE_FINE;
                if (value > -this.MINIMUM_WHEEL_SPEED) value = -this.MINIMUM_WHEEL_SPEED;
            }
            value = parseInt(value);
            sq.leftWheel = -value;
            sq.rightWheel = value;
            return true;
        },
        controlAngle: function(currentRadian, targetRadian) {
            var sq = Entry.hw.sendQueue;
            var diff = this.validateRadian(targetRadian - currentRadian);
            var mag = Math.abs(diff);
            if (mag < this.ORIENTATION_TOLERANCE_ROUGH) return false;

            var direction = diff > 0 ? 1 : -1;
            if (mag < this.ORIENTATION_TOLERANCE_ROUGH_LARGE && direction * this.prevDirection < 0)
                return false;
            this.prevDirection = direction;

            var value = 0;
            if (diff > 0) {
                value = Math.log(1 + mag) * this.GAIN_ANGLE;
                if (value < this.MINIMUM_WHEEL_SPEED) value = this.MINIMUM_WHEEL_SPEED;
            } else {
                value = -Math.log(1 + mag) * this.GAIN_ANGLE;
                if (value > -this.MINIMUM_WHEEL_SPEED) value = -this.MINIMUM_WHEEL_SPEED;
            }
            value = parseInt(value);
            sq.leftWheel = -value;
            sq.rightWheel = value;
            return true;
        },
        controlPositionFine: function(currentX, currentY, currentRadian, targetX, targetY) {
            var sq = Entry.hw.sendQueue;
            var targetRadian = Math.atan2(targetY - currentY, targetX - currentX);
            var diff = this.validateRadian(targetRadian - currentRadian);
            var mag = Math.abs(diff);
            var ex = targetX - currentX;
            var ey = targetY - currentY;
            var dist = Math.sqrt(ex * ex + ey * ey);
            if (dist < this.POSITION_TOLERANCE_FINE) return false;
            if (dist < this.POSITION_TOLERANCE_FINE_LARGE) {
                if (++this.finalPositionCount > 5) {
                    this.finalPositionCount = 0;
                    return false;
                }
            }
            var value = 0;
            if (diff > 0) value = Math.log(1 + mag) * this.GAIN_POSITION_FINE;
            else value = -Math.log(1 + mag) * this.GAIN_POSITION_FINE;
            value = parseInt(value);
            sq.leftWheel = this.MINIMUM_WHEEL_SPEED_FINE - value;
            sq.rightWheel = this.MINIMUM_WHEEL_SPEED_FINE + value;
            return true;
        },
        controlPosition: function(currentX, currentY, currentRadian, targetX, targetY) {
            var sq = Entry.hw.sendQueue;
            var targetRadian = Math.atan2(targetY - currentY, targetX - currentX);
            var diff = this.validateRadian(targetRadian - currentRadian);
            var mag = Math.abs(diff);
            var ex = targetX - currentX;
            var ey = targetY - currentY;
            var dist = Math.sqrt(ex * ex + ey * ey);
            if (dist < this.POSITION_TOLERANCE_ROUGH) return false;
            if (dist < this.POSITION_TOLERANCE_ROUGH_LARGE) {
                if (++this.positionCount > 10) {
                    this.positionCount = 0;
                    return false;
                }
            } else {
                this.positionCount = 0;
            }
            if (mag < 0.01) {
                sq.leftWheel = this.STRAIGHT_SPEED;
                sq.rightWheel = this.STRAIGHT_SPEED;
            } else {
                var base = (this.MINIMUM_WHEEL_SPEED + 0.5 / mag) * this.GAIN_BASE_SPEED;
                if (base > this.MAX_BASE_SPEED) base = this.MAX_BASE_SPEED;

                var value = 0;
                if (diff > 0) value = Math.log(1 + mag) * this.GAIN_POSITION;
                else value = -Math.log(1 + mag) * this.GAIN_POSITION;
                base = parseInt(base);
                value = parseInt(value);
                sq.leftWheel = base - value;
                sq.rightWheel = base + value;
            }
            return true;
        },
        validateRadian: function(radian) {
            if (radian > this.PI) return radian - this.PI2;
            else if (radian < -this.PI) return radian + this.PI2;
            return radian;
        },
        toRadian: function(degree) {
            return degree * 3.14159265 / 180.0;
        },
    },
    id: '2.5',
    name: 'albert',
    url: 'http://albert.school/',
    imageName: 'albertschool.png',
    title: {
        ko: '알버트 스쿨버전',
        en: 'Albert School',
    },
};

Entry.Albert.blockMenuBlocks = [
    'albert_hand_found',
    'albert_is_oid_value',
    'albert_value',
    'albert_move_forward_for_secs',
    'albert_move_backward_for_secs',
    'albert_turn_for_secs',
    'albert_change_both_wheels_by',
    'albert_set_both_wheels_to',
    'albert_change_wheel_by',
    'albert_set_wheel_to',
    'albert_stop',
    'albert_set_pad_size_to',
    'albert_move_to_x_y_on_board',
    'albert_set_orientation_on_board',
    'albert_set_eye_to',
    'albert_clear_eye',
    'albert_body_led',
    'albert_front_led',
    'albert_beep',
    'albert_change_buzzer_by',
    'albert_set_buzzer_to',
    'albert_clear_buzzer',
    'albert_play_note_for',
    'albert_rest_for',
    'albert_change_tempo_by',
    'albert_set_tempo_to',
];

Entry.Albert.getBlocks = function() {
    return {
        //region albert 알버트
        albert_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'albert_hand_found',
            },
            class: 'albert_sensor',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                return pd.leftProximity > 40 || pd.rightProximity > 40;
            },
            syntax: { js: [], py: ['Albert.hand_found()'] },
        },
        albert_is_oid_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_front_oid, 'FRONT'],
                        [Lang.Blocks.ALBERT_back_oid, 'BACK'],
                    ],
                    value: 'FRONT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'albert_is_oid_value',
            },
            paramsKeyMap: {
                OID: 0,
                VALUE: 1,
            },
            class: 'albert_sensor',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var oid = script.getField('OID', script);
                var value = script.getNumberValue('VALUE');
                if (oid == 'FRONT') {
                    return pd.frontOid == value;
                } else {
                    return pd.backOid == value;
                }
            },
        },
        albert_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_sensor_left_proximity, 'leftProximity'],
                        [Lang.Blocks.ALBERT_sensor_right_proximity, 'rightProximity'],
                        [Lang.Blocks.ALBERT_sensor_acceleration_x, 'accelerationX'],
                        [Lang.Blocks.ALBERT_sensor_acceleration_y, 'accelerationY'],
                        [Lang.Blocks.ALBERT_sensor_acceleration_z, 'accelerationZ'],
                        [Lang.Blocks.ALBERT_sensor_front_oid, 'frontOid'],
                        [Lang.Blocks.ALBERT_sensor_back_oid, 'backOid'],
                        [Lang.Blocks.ALBERT_sensor_position_x, 'positionX'],
                        [Lang.Blocks.ALBERT_sensor_position_y, 'positionY'],
                        [Lang.Blocks.ALBERT_sensor_orientation, 'orientation'],
                        [Lang.Blocks.ALBERT_sensor_light, 'light'],
                        [Lang.Blocks.ALBERT_sensor_temperature, 'temperature'],
                        [Lang.Blocks.ALBERT_sensor_battery, 'battery'],
                        [Lang.Blocks.ALBERT_sensor_signal_strength, 'signalStrength'],
                    ],
                    value: 'leftProximity',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albert_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'albert_sensor',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['Albert.value(%1)'] },
        },
        albert_move_forward_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'albert_move_forward_for_secs',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.leftWheel = 30;
                    sq.rightWheel = 30;
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.move_forward_for_secs(%1)'] },
        },
        albert_move_backward_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'albert_move_backward_for_secs',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.leftWheel = -30;
                    sq.rightWheel = -30;
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.move_backward_for_secs(%1)'] },
        },
        albert_turn_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_turn_left, 'LEFT'],
                        [Lang.Blocks.ALBERT_turn_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'albert_turn_for_secs',
                id: 'como',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        sq.leftWheel = -30;
                        sq.rightWheel = 30;
                    } else {
                        sq.leftWheel = 30;
                        sq.rightWheel = -30;
                    }
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.turn_for_secs(%1, %2)'] },
        },
        albert_change_both_wheels_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'albert_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var left = script.getNumberValue('LEFT');
                var right = script.getNumberValue('RIGHT');
                sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + left : left;
                sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + right : right;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.change_both_wheels(%1, %2)'] },
        },
        albert_set_both_wheels_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'albert_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.leftWheel = script.getNumberValue('LEFT');
                sq.rightWheel = script.getNumberValue('RIGHT');
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_both_wheels(%1, %2)'] },
        },
        albert_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_wheel, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_wheel, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_wheels, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'albert_change_wheel_by',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                if (direction == 'LEFT') {
                    sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
                } else {
                    sq.leftWheel = sq.leftWheel != undefined ? sq.leftWheel + value : value;
                    sq.rightWheel = sq.rightWheel != undefined ? sq.rightWheel + value : value;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.change_wheel(%1, %2)'] },
        },
        albert_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_wheel, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_wheel, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_wheels, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'albert_set_wheel_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                if (direction == 'LEFT') {
                    sq.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = value;
                } else {
                    sq.leftWheel = value;
                    sq.rightWheel = value;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_wheel(%1, %2)'] },
        },
        albert_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albert_stop',
                id: '4adb',
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.stop()'] },
        },
        albert_set_pad_size_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['108'],
                    },
                    {
                        type: 'text',
                        params: ['76'],
                    },
                    null,
                ],
                type: 'albert_set_pad_size_to',
                id: '5mhg',
            },
            paramsKeyMap: {
                WIDTH: 0,
                HEIGHT: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.padWidth = script.getNumberValue('WIDTH');
                sq.padHeight = script.getNumberValue('HEIGHT');
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_pad_size(%1, %2)'] },
        },
        albert_move_to_x_y_on_board: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albert_move_to_x_y_on_board',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var controller = Entry.Albert.controller;
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.initialized = false;
                    script.boardState = 1;
                    script.x = -1;
                    script.y = -1;
                    script.theta = -200;
                    script.targetX = script.getNumberValue('X');
                    script.targetY = script.getNumberValue('Y');
                    controller.clear();
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script;
                } else if (script.isMoving) {
                    if (pd.positionX >= 0) script.x = pd.positionX;
                    if (pd.positionY >= 0) script.y = pd.positionY;
                    script.theta = pd.orientation;
                    switch (script.boardState) {
                        case 1: {
                            if (script.initialized == false) {
                                if (script.x < 0 || script.y < 0) {
                                    sq.leftWheel = 20;
                                    sq.rightWheel = -20;
                                    return script;
                                }
                                script.initialized = true;
                            }
                            var current = controller.toRadian(script.theta);
                            var dx = script.targetX - script.x;
                            var dy = script.targetY - script.y;
                            var target = Math.atan2(dy, dx);
                            if (controller.controlAngle(current, target) == false)
                                script.boardState = 2;
                            break;
                        }
                        case 2: {
                            if (
                                controller.controlPosition(
                                    script.x,
                                    script.y,
                                    controller.toRadian(script.theta),
                                    script.targetX,
                                    script.targetY
                                ) == false
                            )
                                script.boardState = 3;
                            break;
                        }
                        case 3: {
                            if (
                                controller.controlPositionFine(
                                    script.x,
                                    script.y,
                                    controller.toRadian(script.theta),
                                    script.targetX,
                                    script.targetY
                                ) == false
                            ) {
                                sq.leftWheel = 0;
                                sq.rightWheel = 0;
                                script.isMoving = false;
                            }
                            break;
                        }
                    }
                    return script;
                } else {
                    delete script.isStart;
                    delete script.isMoving;
                    delete script.initialized;
                    delete script.boardState;
                    delete script.x;
                    delete script.y;
                    delete script.theta;
                    delete script.targetX;
                    delete script.targetY;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
        },
        albert_set_orientation_on_board: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'albert_set_orientation_on_board',
            },
            paramsKeyMap: {
                ORIENTATION: 0,
            },
            class: 'albert_wheel',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var controller = Entry.Albert.controller;
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.boardState = 1;
                    script.theta = -200;
                    script.targetTheta = script.getNumberValue('ORIENTATION');
                    controller.clear();
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script;
                } else if (script.isMoving) {
                    script.theta = pd.orientation;
                    switch (script.boardState) {
                        case 1: {
                            var current = controller.toRadian(script.theta);
                            var target = controller.toRadian(script.targetTheta);
                            if (controller.controlAngle(current, target) == false)
                                script.boardState = 2;
                            break;
                        }
                        case 2: {
                            var current = controller.toRadian(script.theta);
                            var target = controller.toRadian(script.targetTheta);
                            if (controller.controlAngleFine(current, target) == false) {
                                sq.leftWheel = 0;
                                sq.rightWheel = 0;
                                script.isMoving = false;
                            }
                            break;
                        }
                    }
                    return script;
                } else {
                    delete script.isStart;
                    delete script.isMoving;
                    delete script.boardState;
                    delete script.theta;
                    delete script.targetTheta;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
        },
        albert_set_eye_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_eye, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_eye, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_eyes, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_color_red, '4'],
                        [Lang.Blocks.ALBERT_color_yellow, '6'],
                        [Lang.Blocks.ALBERT_color_green, '2'],
                        [Lang.Blocks.ALBERT_color_cyan, '3'],
                        [Lang.Blocks.ALBERT_color_blue, '1'],
                        [Lang.Blocks.ALBERT_color_magenta, '5'],
                        [Lang.Blocks.ALBERT_color_white, '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'albert_set_eye_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                COLOR: 1,
            },
            class: 'albert_led',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);
                var color = Number(script.getField('COLOR', script));
                if (direction == 'LEFT') {
                    sq.leftEye = color;
                } else if (direction == 'RIGHT') {
                    sq.rightEye = color;
                } else {
                    sq.leftEye = color;
                    sq.rightEye = color;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_eye(%1, %2)'] },
        },
        albert_clear_eye: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_eye, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_eye, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_eyes, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'albert_clear_eye',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'albert_led',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);
                if (direction == 'LEFT') {
                    sq.leftEye = 0;
                } else if (direction == 'RIGHT') {
                    sq.rightEye = 0;
                } else {
                    sq.leftEye = 0;
                    sq.rightEye = 0;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.clear_eye(%1)'] },
        },
        albert_body_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_turn_on, 'ON'],
                        [Lang.Blocks.ALBERT_turn_off, 'OFF'],
                    ],
                    value: 'ON',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'albert_body_led',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'albert_led',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var state = script.getField('STATE', script);
                if (state == 'ON') sq.bodyLed = 1;
                else sq.bodyLed = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.body_led(%1)'] },
        },
        albert_front_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_turn_on, 'ON'],
                        [Lang.Blocks.ALBERT_turn_off, 'OFF'],
                    ],
                    value: 'ON',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'albert_front_led',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'albert_led',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var state = script.getField('STATE', script);
                if (state == 'ON') sq.frontLed = 1;
                else sq.frontLed = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.front_led(%1)'] },
        },
        albert_beep: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albert_beep',
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 440;
                    sq.note = 0;
                    var timeValue = 0.2 * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.buzzer = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.beep()'] },
        },
        albert_change_buzzer_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'albert_change_buzzer_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('VALUE');
                sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
                sq.note = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.change_buzzer(%1)'] },
        },
        albert_set_buzzer_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'albert_set_buzzer_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.buzzer = script.getNumberValue('VALUE');
                sq.note = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_buzzer(%1)'] },
        },
        albert_clear_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'albert_clear_buzzer',
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.buzzer = 0;
                sq.note = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.clear_buzzer()'] },
        },
        albert_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_note_c + '', '4'],
                        [Lang.Blocks.ALBERT_note_c + '#', '5'],
                        [Lang.Blocks.ALBERT_note_d + '', '6'],
                        [Lang.Blocks.ALBERT_note_e + 'b', '7'],
                        [Lang.Blocks.ALBERT_note_e + '', '8'],
                        [Lang.Blocks.ALBERT_note_f + '', '9'],
                        [Lang.Blocks.ALBERT_note_f + '#', '10'],
                        [Lang.Blocks.ALBERT_note_g + '', '11'],
                        [Lang.Blocks.ALBERT_note_g + '#', '12'],
                        [Lang.Blocks.ALBERT_note_a + '', '13'],
                        [Lang.Blocks.ALBERT_note_b + 'b', '14'],
                        [Lang.Blocks.ALBERT_note_b + '', '15'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'albert_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE', script);
                    var tempo = Entry.Albert.tempo;
                    note += (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 0;
                    sq.note = note;
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            sq.note = 0;
                            Entry.Albert.removeTimeout(timer1);
                        }, timeValue - 100);
                        Entry.Albert.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer2);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.note = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.play_note(%1, %2, %3)'] },
        },
        albert_rest_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'albert_rest_for',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE');
                    timeValue = timeValue * 60 * 1000 / Entry.Albert.tempo;
                    sq.buzzer = 0;
                    sq.note = 0;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Albert.removeTimeout(timer);
                    }, timeValue);
                    Entry.Albert.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.rest(%1)'] },
        },
        albert_change_tempo_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'albert_change_tempo_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                Entry.Albert.tempo += script.getNumberValue('VALUE');
                if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.change_tempo(%1)'] },
        },
        albert_set_tempo_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'albert_set_tempo_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'albert_buzzer',
            isNotFor: ['albert'],
            func: function(sprite, script) {
                Entry.Albert.tempo = script.getNumberValue('VALUE');
                if (Entry.Albert.tempo < 1) Entry.Albert.tempo = 1;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_tempo(%1)'] },
        },
        albert_move_forward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.leftWheel = 30;
                    sq.rightWheel = 30;
                    var timeValue = 1 * 1000;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.move_forward()'] },
        },
        albert_move_backward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 1 * 1000;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    sq.leftWheel = -30;
                    sq.rightWheel = -30;
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.move_backward()'] },
        },
        albert_turn_around: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_turn_left, 'LEFT'],
                        [Lang.Blocks.ALBERT_turn_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    var direction = script.getField('DIRECTION', script);
                    var isLeft = direction == 'LEFT';
                    script.leftValue = isLeft ? -30 : 30;
                    script.rightValue = isLeft ? 30 : -30;
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 1 * 1000;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    sq.leftWheel = script.leftValue;
                    sq.rightWheel = script.rightValue;
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.leftValue;
                    delete script.rightValue;
                    Entry.engine.isContinue = false;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Albert.turn_around()'] },
        },
        albert_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'FRONT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_red, '4'],
                        [Lang.Blocks.HAMSTER_color_yellow, '6'],
                        [Lang.Blocks.HAMSTER_color_green, '2'],
                        [Lang.Blocks.HAMSTER_color_cyan, '3'],
                        [Lang.Blocks.HAMSTER_color_blue, '1'],
                        [Lang.Blocks.HAMSTER_color_magenta, '5'],
                        [Lang.Blocks.HAMSTER_color_white, '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
            },
            paramsKeyMap: {
                DIRECTION: 0,
                COLOR: 1,
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);
                var color = Number(script.getField('COLOR', script));
                if (direction == 'FRONT') {
                    sq.leftEye = color;
                    sq.rightEye = color;
                } else if (direction == 'LEFT') sq.leftEye = color;
                else sq.rightEye = color;

                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_led(%1, %2)'] },
        },
        albert_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'FRONT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);
                if (direction == 'FRONT') {
                    sq.leftEye = 0;
                    sq.rightEye = 0;
                } else if (direction == 'LEFT') sq.leftEye = 0;
                else sq.rightEye = 0;

                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.clear_led(%1)'] },
        },
        albert_change_wheels_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_wheel, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_wheel, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_wheels, 'FRONT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');

                if (direction == 'LEFT') {
                    sq.leftWheel =
                        sq.leftWheel != undefined ? sq.leftWheel + value : pd.leftWheel + value;
                } else if (direction == 'RIGHT')
                    sq.rightWheel =
                        sq.rightWheel != undefined ? sq.rightWheel + value : pd.rightWheel + value;
                else {
                    sq.leftWheel =
                        sq.leftWheel != undefined ? sq.leftWheel + value : pd.leftWheel + value;
                    sq.rightWheel =
                        sq.rightWheel != undefined ? sq.rightWheel + value : pd.rightWheel + value;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.change_wheels(%1, %2)'] },
        },
        albert_set_wheels_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_left_wheel, 'LEFT'],
                        [Lang.Blocks.ALBERT_right_wheel, 'RIGHT'],
                        [Lang.Blocks.ALBERT_both_wheels, 'FRONT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');

                if (direction == 'LEFT') sq.leftWheel = value;
                else if (direction == 'RIGHT') sq.rightWheel = value;
                else {
                    sq.leftWheel = value;
                    sq.rightWheel = value;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['Albert.set_wheels(%1, %2)'] },
        },
        //endregion albert 알버트
    };
};

module.exports = Entry.Albert;
