'use strict';

const PinMode = {
    INPUT: 0x00,
    OUTPUT: 0x01,
    ANALOG: 0x02,
    I2C: 0x06,
}

class ArduinoBase {
    constructor () {
        this.resetState();
    }

    setLanguage () {throw new Error('재정의 필요');}
    getBlocks () {throw new Error('재정의 필요');}

    setZero () {
        this.resetState();
        this.request('reset', null, null, true);
    }

    afterReceive = function (data) {
        const keys = data.state ? Object.keys(data.state) : [];
        keys.forEach(key => this.state[key] = data.state[key]);
    }

    afterSend = function () {
        Entry.hw.sendQueue = {};
    }

    request (func, subkey, value, updateNow = false) {
        if (!Entry.hw.sendQueue[func]) Entry.hw.sendQueue[func] = {};

        if (subkey) {
            Entry.hw.sendQueue[func][subkey.toString()] = value;
        } else {
            Entry.hw.sendQueue[func] = value;
        }

        if (updateNow) Entry.hw.update();
    }

    resetState () {
        this.state = {
            pin: [],
            rx: {}
        };
    }

    pinToNumber (pin) {
        if (pin === undefined || pin === null) return 0;
        if (typeof pin === 'number') {
            if (Number.isNaN(pin)) return 0;
            return pin;
        }

        const pinStr = pin.toString().toLowerCase();
        switch (pinStr) {
            case 'd2': return 2;
            case 'd3': return 3;
            case 'd4': return 4;
            case 'd5': return 5;
            case 'd6': return 6;
            case 'd7': return 7;
            case 'd8': return 8;
            case 'd9': return 9;
            case 'd10': return 10;
            case 'd11': return 11;
            case 'd12': return 12;
            case 'd13': return 13;
            case 'a0': return 14;
            case 'a1': return 15;
            case 'a2': return 16;
            case 'a3': return 17;
            case 'a4': return 18;
            case 'a5': return 19;
            default: {
                const n = Number(pin);
                if (Number.isNaN(n)) return 0;
                return n;
            }
        }
    }

    isEqualsPinMode (pin, mode) {
        return typeof pin === 'number' && this.state.pin[pin] && this.state.pin[pin].mode == mode;
    }

    isDigitalPin (pin) {
        return typeof pin === 'number' && 2 <= pin && pin <= 15;
    }

    isAnalogPin (pin) {
        return typeof pin === 'number' && 14 <= pin && pin <= 19;
    }

    measureAnalogPin (pin) {
        const analogPin = pin - 14;
        return Math.min(5, Math.max(0, analogPin));
    }

    getDigitalValue (pin) {
        if (!this.isDigitalPin(pin)) return 0;

        if (!this.isEqualsPinMode(pin, PinMode.INPUT)) {
            this.request('enableDigitalInput', pin, {pin}, true);
        }

        return this.state.rx.digital && typeof this.state.rx.digital[pin] === 'number'
            ? this.state.rx.digital[pin]
            : 0;
    }

    getAnalogValue (pin, defValue = 0) {
        if (!this.isAnalogPin(pin)) return defValue;

        if (!this.isEqualsPinMode(pin, PinMode.ANALOG)) {
            this.request('enableAnalogInput', pin, {pin}, true);
        }

        const analogPin = this.measureAnalogPin(pin);
        return this.state.rx.analog && typeof this.state.rx.analog[analogPin] === 'number'
            ? this.state.rx.analog[analogPin]
            : defValue;
    }

    set_digital (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const value = script.getNumberValue('VALUE');

        this.request('setDigital', pin, {pin, value});
        return script.callReturn();
    }

    set_motor (sprite, script) {
        const motor = script.getNumberValue('MOTOR');
        const speed = script.getNumberValue('SPEED');
        const state = script.getStringValue('STATE');

        let stateNum = 0;
        if (state == 'cw') stateNum = 1;
        else if (state == 'ccw') stateNum = 2;

        this.request('setMotor', motor, {motor, speed, state: stateNum});
        return script.callReturn();
    }

    set_motors (sprite, script) {
        const motors = script.getNumberValue('MOTORS');
        const speed1 = script.getNumberValue('SPEED1');
        const speed2 = script.getNumberValue('SPEED2');
        const state = script.getStringValue('STATE');

        const speed = [speed1, speed2];
        let motor = []
        if (motors == 12) {
            motor = [1, 2];
        } else if (motors == 34) {
            motor = [3, 4];
        }

        let stateNum = [0, 0];
        switch (state) {
            case 'forward':
                stateNum = [2, 1];
                break;
            case 'turn-left':
                stateNum = [1, 1];
                break;
            case 'backward':
                stateNum = [1, 2];
                break;
            case 'turn-right':
                stateNum = [2, 2];
                break;
        }

        for (let i = 0; i < 2; i++) {
            this.request('setMotor', i + 1, {motor: motor[i], speed: speed[i], state: stateNum[i]});
        }
        return script.callReturn();
    }

    set_servo_angle (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const angle = script.getNumberValue('ANGLE');

        this.request('setServo', pin, {pin, angle});
        return script.callReturn();
    }

    set_rgbled_color (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        let colorString = script.getStringValue('COLOR');

        let color;
        if (typeof colorString === 'string' && colorString.substring(0, 1) === '#') {
            const shorThandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            colorString = colorString.replace(shorThandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString);
            color = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        if (!color) color = {r: 0, g: 0, b: 0};

        this.request('setRgbLedColor', pin, {pin, color});
        return script.callReturn();

    }

    change_rgbled_brightness_by (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const brightness = script.getNumberValue('BRIGHTNESS');

        this.request('changeRgbLedBrightnessBy', pin, {pin, brightness});
        return script.callReturn();
    }

    set_rgbled_brightness_to (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const brightness = script.getNumberValue('BRIGHTNESS');

        this.request('setRgbLedBrightnessTo', pin, {pin, brightness});
        return script.callReturn();
    }

    play_piezobuzzer (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const octave = script.getNumberValue('OCTAVE');
        const duration = script.getNumberValue('DURATION');
        let note = script.getNumberValue('NOTE');
        note = (octave - 1) * 12 + note;

        this.request('setPiezoBuzzer', pin, {pin, note, duration});
        return script.callReturn();
    }

    play_piezobuzzer_until_done (sprite, script) {
        const duration = script.getNumberValue('DURATION');
        this.play_piezobuzzer(sprite, script);
        return new Promise(resolve => setTimeout(() => resolve(), duration * 1000));
    }

    get_digital_value (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        return this.getDigitalValue(pin);
    }

    is_digital_detected (sprite, script) {
        return this.get_digital_value(sprite, script) == 1;
    }

    get_analog_value (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        return this.getAnalogValue(pin);
    }

    compare_analog_value (sprite, script) {
        const value1 = this.get_analog_value(sprite, script);
        const symbol = script.getStringValue('SYMBOL');
        const value2 = script.getStringValue('VALUE');

        return this._compare(value1, value2, symbol);
    }

    _compare (v1, v2, symbol) {
        switch (symbol) {
            case 'greater-than':
                return v1 > v2;
            case 'equal':
                return v1 == v2;
            case 'less-than':
                return v1 < v2;
            default: return false;
        }
    }

    get_sensor_value (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const sensor = script.getStringValue('SENSOR');

        if (sensor == 'ultrasonic') {
            if (!this.isEqualsPinMode(pin, PinMode.INPUT)) {
                this.request('enableSonarSensor', pin, {pin}, true);
            }
            return this.state.rx.digital[pin];
        }

        if (!this.isEqualsPinMode(pin, PinMode.ANALOG)) {
            this.request('enableAnalogInput', pin, {pin}, true);
        }
        const analogPin = this.measureAnalogPin(pin);
        switch (sensor) {
            case "joystickx":
            case "joysticky": {
                const analogValue = this.getAnalogValue(pin, 512);
                const value = analogValue >> 6;

                if (value > 14) return 2;
                else if (value > 9) return 1;
                else if (value > 5) return 0;
                else if (value > 1) return -1;
                else return -2;
            }
            case "light": {
                const analogValue = this.getAnalogValue(pin);
                return parseInt(Math.round(analogValue * 0.1));
            }
            case "dial": {
                const analogValue = this.getAnalogValue(pin);
                return Math.round(analogValue * 0.1);
            }
            case "akeypad": {
                const analogValue = this.getAnalogValue(pin);
                if (analogValue >= 450) return 1;
                else if (analogValue >= 390) return 2;
                else if (analogValue >= 310) return 3;
                else if (analogValue >= 200) return 4;
                else if (analogValue >= 100) return 5;
                else return 0;
            }
            case 'temperature': {
                if (!this.state.rx.temperature[analogPin] || !this.state.rx.temperature[analogPin].enable) {
                    this.request('enableTemperatureSensor', pin, {pin}, true);
                }

                if (this.state.rx.temperature[analogPin] && this.state.rx.temperature[analogPin].value) {
                    return this.state.rx.temperature[analogPin].value;
                }
            } break;
            case 'magnetic': {
                const analogValue = this.getAnalogValue(pin, 512);

                const zero = 512;
                const zeroGap = 32;
                const startS = zero + zeroGap;
                const startN = zero - zeroGap;
                const maxArea = 64;

                let value = 0;
                if (analogValue > startS) {
                    value = (analogValue > 1024 - maxArea) ? 1024 - maxArea : analogValue;
                    value = Math.min(10, parseInt(Math.round((value - startS) / 32)));
                } else if (analogValue < startN) {
                    value = (analogValue < maxArea) ? maxArea : analogValue;
                    value = Math.min(10, parseInt(Math.round((startN - value) / 32))) * -1;
                }
                return value;
            }
            case 'rotaryposition': {
                if (!this.state.rx.rotaryPosition[analogPin] || !this.state.rx.rotaryPosition[analogPin].enable) {
                    this.request('enableRotaryPositionSensor', pin, {pin}, true);
                }

                if (this.state.rx.rotaryPosition[analogPin] && this.state.rx.rotaryPosition[analogPin].rotation) {
                    return this.state.rx.rotaryPosition[analogPin].originAngle;
                }
            } break;
        }
        return 0;
    }

    compare_sensor_value (sprite, script) {
        const value1 = this.get_sensor_value(sprite, script);
        const symbol = script.getStringValue('SYMBOL');
        const value2 = script.getStringValue('VALUE');

        return this._compare(value1, value2, symbol);
    }

    get_rotary_position_sensor_value (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const analogPin = this.measureAnalogPin(pin);
        const type = script.getStringValue('PROPERTY');

        if (!this.state.rx.rotaryPosition[analogPin] || !this.state.rx.rotaryPosition[analogPin].enable) {
            this.request('enableRotaryPositionSensor', pin, {pin}, true);
        }

        if (!this.state.rx.rotaryPosition[analogPin] || !this.state.rx.rotaryPosition[analogPin].rotation) return 0;

        const obj = this.state.rx.rotaryPosition[analogPin];
        let value = 0;
        switch (type) {
            case 'rotation': {
                if (obj.isIntegerRotation) {
                    value = parseInt(obj.rotation);
                } else {
                    value = obj.rotation;
                }
            } break;
            case 'position': {
                if (obj.isIntegerPosition) {
                    value = parseInt(Math.round(obj.position));
                } else {
                    value = obj.position;
                }
            } break;
            case 'angle': {
                value = obj.angle;
            } break;
            case 'angle-origin': {
                value = obj.originAngle;
            } break;
        }
        return value;
    }

    reset_rotary_position_sensor (sprite, script) {
        const pin = this.pinToNumber(script.getStringValue('PIN'));
        const type = script.getStringValue('PROPERTY');
        const value = script.getNumberValue('VALUE');

        this.request('resetRotaryPositionSensor', pin, {pin, type, value});
    }
}

module.exports = {ArduinoBase, PinMode};
