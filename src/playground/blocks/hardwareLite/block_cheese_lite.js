'use strict';

(function () {
    const HANDSHAKE_TIMEOUT_MS = 5000; // FF 핸드셰이크 상한(같은 동글을 쓰는 로봇 공통 값)
    const REALIGN_TIMEOUT_MS = 5000; // 세션 중 재핸드셰이크 상한
    const TX_MIN_GAP_MS = 12; // 동글은 한 줄을 직렬로 받는 동안(약 4.8ms) 들어온 다음 줄을 버린다(실측: 5ms 간격은 3회 중 0회, 8ms 간격은 10회 중 10회 수신)
    const DRAIN_MAX = 8; // 정지와 연결 직후 바로 내보내는 프레임 수 상한(확장 2 + 일반 2 면 충분)
    const INVALID_LINE_LIMIT = 50; // 잘못된 줄이 이만큼 이어지면 다시 핸드셰이크(약 1초)
    const MISMATCH_LIMIT = 2; // 다른 주소의 유효 프레임이 이만큼 이어지면 다시 핸드셰이크
    const MAX_TIMER_MS = 2147483647;

    const CHEESE = {
        OUTPUT_SA: 'outputSa',
        OUTPUT_SB: 'outputSb',
        OUTPUT_SC: 'outputSc',
        OUTPUT_LA: 'outputLa',
        OUTPUT_LB: 'outputLb',
        OUTPUT_LC: 'outputLc',
        OUTPUT_MAB: 'outputMab',
        OUTPUT_MCD: 'outputMcd',
        BUZZER: 'buzzer',
        VELOCITY: 'velocity',
        STEP: 'step',
        STEP_ID: 'stepId',
        NOTE: 'note',
        SOUND: 'sound',
        SOUND_REPEAT: 'soundRepeat',
        SOUND_ID: 'soundId',
        MODE_SA: 'modeSa',
        MODE_SB: 'modeSb',
        MODE_SC: 'modeSc',
        MODE_LA: 'modeLa',
        MODE_LB: 'modeLb',
        MODE_LC: 'modeLc',
        MODE_MAB: 'modeMab',
        MODE_MCD: 'modeMcd',
        MODE_PID: 'modePid',
        MODE_EXT: 'modeExt',
        WRITE_HAT: 'writeHat',
        WRITE_HAT_ID: 'writeHatId',
        WRITE_PID: 'writePid',
        WRITE_PID_ID: 'writePidId',
        WRITE_NEOPIXEL: 'writeNeopixel',
        WRITE_NEOPIXEL_ID: 'writeNeopixelId',
        PACKET_NORMAL: 1,
        PACKET_HAT: 2,
        PACKET_PID: 3,
        PACKET_NEOPIXEL: 4,
        MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: 0x00,
        MODE_S_MAKEY_INPUT: 0x00, // pull down 2M
        MODE_S_BUTTON_INPUT: 0x90, // pull up 50K
        MODE_S_DIGITAL_INPUT_PULL_UP_50K: 0x10,
        MODE_S_DIGITAL_INPUT_PULL_DOWN_50K: 0x20,
        MODE_S_ANALOG_INPUT_RELATIVE: 0x01, // pull down 2M
        MODE_S_ANALOG_INPUT_ABSOLUTE: 0x41, // pull down 2M
        MODE_S_VOLTAGE_INPUT: 0xc1, // pull down 2M absolute
        MODE_SC_PULSE_INPUT_PULL_DOWN_2M: 0x04,
        MODE_SC_PULSE_INPUT_PULL_UP_50K: 0x14,
        MODE_SC_PULSE_INPUT_PULL_DOWN_50K: 0x24,
        MODE_S_PWM_OUTPUT: 0x02,
        MODE_S_DIGITAL_OUTPUT: 0x82,
        MODE_S_SERVO_OUTPUT: 0x03,
        MODE_SA_NEOPIXEL_OUTPUT: 0x08,
        MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: 0x00,
        MODE_L_MAKEY_INPUT: 0x00, // pull down 2M
        MODE_L_BUTTON_INPUT: 0x90, // pull up 50K
        MODE_L_DIGITAL_INPUT_PULL_UP_50K: 0x10,
        MODE_L_DIGITAL_INPUT_PULL_DOWN_50K: 0x20,
        MODE_L_ANALOG_INPUT_RELATIVE: 0x01, // pull down 2M
        MODE_L_ANALOG_INPUT_ABSOLUTE: 0x41, // pull down 2M
        MODE_L_VOLTAGE_INPUT: 0xc1, // pull down 2M absolute
        MODE_LC_PULSE_INPUT_PULL_DOWN_2M: 0x04,
        MODE_LC_PULSE_INPUT_PULL_UP_50K: 0x14,
        MODE_LC_PULSE_INPUT_PULL_DOWN_50K: 0x24,
        MODE_L_PWM_OUTPUT: 0x02,
        MODE_L_DIGITAL_OUTPUT: 0x82,
        MODE_L_SERVO_OUTPUT: 0x03,
        MODE_M_DIGITAL_OUTPUT: 0x00,
        MODE_M_DC: 0x01,
        MODE_M_SERVO_DUAL: 0x02,
        MODE_MAB_SOUND: 0x03,
        MODE_M_SERVO_MONO: 0x40, // 0100
        MODE_M_STEP_SW_OFF: 0x80, // 1000
        MODE_M_STEP_SW_WAVE: 0x90, // 1001
        MODE_M_STEP_SW_FULL: 0xa0, // 1010
        MODE_M_STEP_HW_OFF: 0xc0, // 1100
        MODE_M_STEP_HW_WAVE: 0xd0, // 1101
        MODE_M_STEP_HW_FULL: 0xe0, // 1110
        MODE_PID_SERIAL: 3,
        MODE_PID_ULTRASONIC: 10,
        MODE_PID_DHT: 11,
        MODE_PID_DS18B20: 12,
        MODE_PID_JOYSTICK_BUTTON: 13,
        MODE_PID_JOYSTICK_DUAL: 14,
        MODE_PID_IR_TRANSCEIVER: 15,
        MODE_PID_ENCODER: 16,
        HAT_RGB_5X5_MATRIX: 10, // 0x00a
        HAT_NEO_5X5_MATRIX: 11, // 0x00b
        HAT_TOUCH: 20, // 0x014
        HAT_PIANO: 21, // 0x015
        HAT_MINI_PIANO: 22, // 0x016
        HAT_GESTURE: 30, // 0x01e
        HAT_COLOR: 31, // 0x01f
        HAT_PRIXIMITY_COLOR: 32, // 0x020
        HAT_MONO_5X15_MATRIX: 40, // 0x028
        HAT_RFID: 50, // 0x032
        SOUND_OFF: 0,
        SOUND_BEEP: 1,
        SOUND_RANDOM_BEEP: 2,
        SOUND_NOISE: 10,
        SOUND_SIREN: 3,
        SOUND_ENGINE: 4,
        SOUND_CHOP: 11,
        SOUND_ROBOT: 5,
        SOUND_DIBIDIBIDIP: 8,
        SOUND_GOOD_JOB: 9,
        SOUND_HAPPY: 12,
        SOUND_ANGRY: 13,
        SOUND_SAD: 14,
        SOUND_SLEEP: 15,
        SOUND_MARCH: 6,
        SOUND_BIRTHDAY: 7,
    };

    function RoboidWriteQueue(size) {
        this.setSize(size);
        this.output = new Array(19);
    }

    RoboidWriteQueue.prototype.setSize = function (size) {
        this.buffer = new Array(size);
        this.mask = size - 1;
        this.provider = 0;
        this.consumer = 0;
    };

    RoboidWriteQueue.prototype.reset = function () {
        this.provider = 0;
        this.consumer = 0;
    };

    // from https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js
    RoboidWriteQueue.prototype.stringToUtf8ByteArray = function (str) {
        const out = [];
        let p = 0,
            c;
        for (let i = 0; i < str.length; i++) {
            c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            } else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            } else if (
                (c & 0xfc00) == 0xd800 &&
                i + 1 < str.length &&
                (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00
            ) {
                c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            } else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return out;
    };

    RoboidWriteQueue.prototype.push = function (str, line) {
        const buffer = this.buffer;
        const mask = this.mask;
        let provider = this.provider;
        let consumer = this.consumer;

        if (str.length > 0) {
            const out = this.stringToUtf8ByteArray(str);
            for (let i = 0; i < out.length; ++i) {
                if (((provider - consumer) & mask) == mask) {
                    // full
                    consumer = (consumer + 1) & mask;
                }
                buffer[provider] = out[i];
                provider = (provider + 1) & mask;
            }
        }
        if (line) {
            if (((provider - consumer) & mask) == mask) {
                // full
                consumer = (consumer + 1) & mask;
            }
            buffer[provider] = 0x0d;
            provider = (provider + 1) & mask;
        }
        this.provider = provider;
        this.consumer = consumer;
    };

    RoboidWriteQueue.prototype.pop = function () {
        const provider = this.provider;
        let consumer = this.consumer;
        if (provider == consumer) return undefined; // empty

        const buffer = this.buffer;
        const mask = this.mask;
        const output = this.output;
        let len = (provider - consumer) & mask;
        if (len > 18) len = 18;

        output[0] = len;
        let i = 1;
        for (; i <= len && consumer != provider; ++i) {
            output[i] = buffer[consumer];
            consumer = (consumer + 1) & mask;
        }
        for (; i <= 18; ++i) {
            output[i] = 0;
        }
        this.consumer = consumer;
        return output;
    };

    function RoboidReadQueue(size) {
        this.setSize(size);
    }

    RoboidReadQueue.prototype.setSize = function (size) {
        this.buffer = new Array(size);
        this.mask = size - 1;
        this.provider = 0;
        this.consumer = 0;
    };

    RoboidReadQueue.prototype.reset = function () {
        this.provider = 0;
        this.consumer = 0;
    };

    RoboidReadQueue.prototype.utf8ByteArrayToString = function (bytes, current, end) {
        const mask = this.mask,
            out = [];
        let c = 0,
            c1,
            c2,
            c3,
            c4,
            u;
        while (current != end) {
            c1 = bytes[current];
            current = (current + 1) & mask;
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            } else if (c1 > 191 && c1 < 224) {
                if (current == end) break;
                c2 = bytes[current];
                current = (current + 1) & mask;
                out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            } else if (c1 > 239 && c1 < 365) {
                if (current == end) break;
                c2 = bytes[current];
                current = (current + 1) & mask;
                if (current == end) break;
                c3 = bytes[current];
                current = (current + 1) & mask;
                if (current == end) break;
                c4 = bytes[current];
                current = (current + 1) & mask;
                u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) - 0x10000;
                out[c++] = String.fromCharCode(0xd800 + (u >> 10));
                out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
            } else {
                if (current == end) break;
                c2 = bytes[current];
                current = (current + 1) & mask;
                if (current == end) break;
                c3 = bytes[current];
                current = (current + 1) & mask;
                out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            }
        }
        this.consumer = current;
        return out.join('');
    };

    RoboidReadQueue.prototype.push = function (packet, offset) {
        let len = packet[offset];
        if (len > 0) {
            if (len > 18) len = 18;

            const buffer = this.buffer;
            const mask = this.mask;
            let provider = this.provider;
            let consumer = this.consumer;
            const end = len + offset;
            for (let i = 1 + offset; i <= end; ++i) {
                if (((provider - consumer) & mask) == mask) {
                    // full
                    consumer = (consumer + 1) & mask;
                }
                buffer[provider] = packet[i];
                provider = (provider + 1) & mask;
            }
            this.provider = provider;
            this.consumer = consumer;
        }
    };

    RoboidReadQueue.prototype.pop = function (delimiter) {
        const provider = this.provider;
        let consumer = this.consumer;
        if (provider == consumer) return undefined; // empty

        if (delimiter == 0) {
            return this.utf8ByteArrayToString(this.buffer, consumer, provider);
        } else {
            const buffer = this.buffer;
            const mask = this.mask;
            let found = -1;
            while (consumer != provider) {
                if (buffer[consumer] == delimiter) {
                    found = consumer;
                    break;
                }
                consumer = (consumer + 1) & mask;
            }
            if (found >= 0) {
                const str = this.utf8ByteArrayToString(buffer, this.consumer, found);
                this.consumer = (this.consumer + 1) & mask;
                return str;
            }
        }
    };

    const CHEESE_HAT_SHAPES = {
        SQUARE: [0xf8, 0x88, 0x88, 0x88, 0xf8], //1111 1/1000 1/1000 1/1000 1/1111 1
        TRIANGLE: [0x00, 0x20, 0x50, 0xf8, 0x00], //0000 0/0010 0/0101 0/1111 1/0000 0
        DIAMOND: [0x20, 0x50, 0x88, 0x50, 0x20], //0010 0/0101 0/1000 1/0101 0/0010 0
        CIRCLE: [0x70, 0x88, 0x88, 0x88, 0x70], //0111 0/1000 1/1000 1/1000 1/0111 0
        X: [0x88, 0x50, 0x20, 0x50, 0x88], //1000 1/0101 0/0010 0/0101 0/1000 1
        LIKE: [0x50, 0x50, 0x00, 0x88, 0x70], //0101 0/0101 0/0000 0/1000 1/0111 0
        DISLIKE: [0x50, 0x50, 0x00, 0x70, 0x88], //0101 0/0101 0/0000 0/0111 0/1000 1
        ANGRY: [0x88, 0x50, 0x00, 0xf8, 0x88], //1000 1/0101 0/0000 0/1111 1/1000 1
        OPEN_MOUTH: [0x50, 0x00, 0x70, 0x88, 0x70], //0101 0/0000 0/0111 0/1000 1/0111 0
        CLOSE_MOUTH: [0x50, 0x00, 0x00, 0xf8, 0x00], //0101 0/0000 0/0000 0/1111 1/0000 0
        WALK1: [0x20, 0x30, 0x60, 0x20, 0x50], //0010 0/0011 0/0110 0/0010 0/0101 0
        WALK2: [0x20, 0x60, 0x30, 0x20, 0x20], //0010 0/0110 0/0011 0/0010 0/0010 0
        HEART: [0x50, 0xf8, 0xf8, 0x70, 0x20], //0101 0/1111 1/1111 1/0111 0/0010 0
        STAR: [0x20, 0xf8, 0x70, 0x70, 0x88], //0010 0/1111 1/0111 0/0111 0/1000 1
        AIRPLANE: [0x20, 0xb0, 0xc8, 0xb0, 0x20], //0010 0/1011 0/1100 1/1011 0/0010 0
        PUPPY: [0x30, 0x38, 0xf0, 0x70, 0x50], //0011 0/0011 1/1111 0/0111 0/0101 0
        BUTTERFLY: [0x88, 0xd8, 0xa8, 0xd8, 0x88], //1000 1/1101 1/1010 1/1101 1/1000 1
        QUARTER_NOTE: [0x10, 0x10, 0x10, 0x70, 0x70], //0001 0/0001 0/0001 0/0111 0/0111 0
        EIGHTH_NOTE: [0x20, 0x30, 0x28, 0xe0, 0xe0], //0010 0/0011 0/0010 1/1110 0/1110 0
        LEFT_ARROW: [0x20, 0x40, 0xf8, 0x40, 0x20], //0010 0/0100 0/1111 1/0100 0/0010 0
        RIGHT_ARROW: [0x20, 0x10, 0xf8, 0x10, 0x20], //0010 0/0001 0/1111 1/0001 0/0010 0
        UP_ARROW: [0x20, 0x70, 0xa8, 0x20, 0x20], //0010 0/0111 0/1010 1/0010 0/0010 0
        DOWN_ARRAY: [0x20, 0x20, 0xa8, 0x70, 0x20], //0010 0/0010 0/1010 1/0111 0/0010 0
    };

    const CHEESE_HAT_ALPHABETS = {
        a: { width: 5, data: [0x00, 0x70, 0x90, 0x90, 0x70] }, //0000 0/0111 0/1001 0/1001 0/0111 0
        b: { width: 5, data: [0x80, 0xe0, 0x90, 0x90, 0xe0] }, //1000 0/1110 0/1001 0/1001 0/1110 0
        c: { width: 5, data: [0x00, 0x70, 0x80, 0x80, 0x70] }, //0000 0/0111 0/1000 0/1000 0/0111 0
        d: { width: 5, data: [0x10, 0x70, 0x90, 0x90, 0x70] }, //0001 0/0111 0/1001 0/1001 0/0111 0
        e: { width: 5, data: [0x00, 0x70, 0xf0, 0x80, 0x70] }, //0000 0/0111 0/1111 0/1000 0/0111 0
        f: { width: 5, data: [0x30, 0x40, 0xf0, 0x40, 0x40] }, //0011 0/0100 0/1111 0/0100 0/0100 0
        g: { width: 5, data: [0x70, 0x90, 0x70, 0x10, 0xe0] }, //0111 0/1001 0/0111 0/0001 0/1110 0
        h: { width: 5, data: [0x80, 0x80, 0xe0, 0x90, 0x90] }, //1000 0/1000 0/1110 0/1001 0/1001 0
        i: { width: 2, data: [0x80, 0x00, 0x80, 0x80, 0x80] }, //10/00/10/10/10
        j: { width: 4, data: [0x20, 0x00, 0x20, 0xa0, 0x40] }, //0010/0000/0010/1010/0100
        k: { width: 4, data: [0x80, 0x80, 0xa0, 0xc0, 0xa0] }, //1000/1000/1010/1100/1010
        l: { width: 3, data: [0x80, 0x80, 0x80, 0x80, 0x40] }, //100/100/100/100/010
        m: { width: 6, data: [0x00, 0xf0, 0xa8, 0xa8, 0xa8] }, //0000 00/1111 00/1010 10/1010 10/1010 10
        n: { width: 5, data: [0x00, 0xe0, 0x90, 0x90, 0x90] }, //0000 0/1110 0/1001 0/1001 0/1001 0
        o: { width: 5, data: [0x00, 0x60, 0x90, 0x90, 0x60] }, //0000 0/0110 0/1001 0/1001 0/0110 0
        p: { width: 5, data: [0x00, 0xe0, 0x90, 0xe0, 0x80] }, //0000 0/1110 0/1001 0/1110 0/1000 0
        q: { width: 5, data: [0x00, 0x70, 0x90, 0x70, 0x10] }, //0000 0/0111 0/1001 0/0111 0/0001 0
        r: { width: 4, data: [0x00, 0x60, 0x80, 0x80, 0x80] }, //0000/0110/1000/1000/1000
        s: { width: 5, data: [0x00, 0x70, 0xc0, 0x30, 0xe0] }, //0000 0/0111 0/1100 0/0011 0/1110 0
        t: { width: 5, data: [0x40, 0xf0, 0x40, 0x40, 0x30] }, //0100 0/1111 0/0100 0/0100 0/0011 0
        u: { width: 5, data: [0x00, 0x90, 0x90, 0x90, 0x70] }, //0000 0/1001 0/1001 0/1001 0/0111 0
        v: { width: 6, data: [0x00, 0x88, 0x50, 0x50, 0x20] }, //0000 00/1000 10/0101 00/0101 00/0010 00
        w: { width: 6, data: [0x00, 0x88, 0xa8, 0xa8, 0x50] }, //0000 00/1000 10/1010 10/1010 10/0101 00
        x: { width: 4, data: [0x00, 0xa0, 0x40, 0x40, 0xa0] }, //0000/1010/0100/0100/1010
        y: { width: 5, data: [0x00, 0x90, 0x70, 0x10, 0x60] }, //0000 0/1001 0/0111 0/0001 0/0110 0
        z: { width: 5, data: [0x00, 0xf0, 0x20, 0x40, 0xf0] }, //0000 0/1111 0/0010 0/0100 0/1111 0
        A: { width: 5, data: [0x60, 0x90, 0xf0, 0x90, 0x90] }, //0110 0/1001 0/1111 0/1001 0/1001 0
        B: { width: 5, data: [0xe0, 0x90, 0xe0, 0x90, 0xe0] }, //1110 0/1001 0/1110 0/1001 0/1110 0
        C: { width: 5, data: [0x60, 0x90, 0x80, 0x90, 0x60] }, //0110 0/1001 0/1000 0/1001 0/0110 0
        D: { width: 5, data: [0xe0, 0x90, 0x90, 0x90, 0xe0] }, //1110 0/1001 0/1001 0/1001 0/1110 0
        E: { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0xf0] }, //1111 0/1000 0/1111 0/1000 0/1111 0
        F: { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0x80] }, //1111 0/1000 0/1111 0/1000 0/1000 0
        G: { width: 5, data: [0x70, 0x80, 0xb0, 0x90, 0x60] }, //0111 0/1000 0/1011 0/1001 0/0110 0
        H: { width: 5, data: [0x90, 0x90, 0xf0, 0x90, 0x90] }, //1001 0/1001 0/1111 0/1001 0/1001 0
        I: { width: 4, data: [0xe0, 0x40, 0x40, 0x40, 0xe0] }, //1110/0100/0100/0100/1110
        J: { width: 5, data: [0xf0, 0x20, 0x20, 0xa0, 0x40] }, //1111 0/0010 0/0010 0/1010 0/0100 0
        K: { width: 5, data: [0x90, 0xa0, 0xc0, 0xa0, 0x90] }, //1001 0/1010 0/1100 0/1010 0/1001 0
        L: { width: 5, data: [0x80, 0x80, 0x80, 0x80, 0xf0] }, //1000 0/1000 0/1000 0/1000 0/1111 0
        M: { width: 6, data: [0x88, 0xd8, 0xa8, 0x88, 0x88] }, //1000 10/1101 10/1010 10/1000 10/1000 10
        N: { width: 6, data: [0x88, 0xc8, 0xa8, 0x98, 0x88] }, //1000 10/1100 10/1010 10/1001 10/1000 10
        O: { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
        P: { width: 5, data: [0xe0, 0x90, 0xe0, 0x80, 0x80] }, //1110 0/1001 0/1110 0/1000 0/1000 0
        Q: { width: 5, data: [0x60, 0x90, 0x90, 0xa0, 0x50] }, //0110 0/1001 0/1001 0/1010 0/0101 0
        R: { width: 5, data: [0xe0, 0x90, 0xe0, 0x90, 0x90] }, //1110 0/1001 0/1110 0/1001 0/1001 0
        S: { width: 5, data: [0x70, 0x80, 0x60, 0x10, 0xe0] }, //0111 0/1000 0/0110 0/0001 0/1110 0
        T: { width: 6, data: [0xf8, 0x20, 0x20, 0x20, 0x20] }, //1111 10/0010 00/0010 00/0010 00/0010 00
        U: { width: 5, data: [0x90, 0x90, 0x90, 0x90, 0x60] }, //1001 0/1001 0/1001 0/1001 0/0110 0
        V: { width: 6, data: [0x88, 0x88, 0x50, 0x50, 0x20] }, //1000 10/1000 10/0101 00/0101 00/0010 00
        W: { width: 6, data: [0x88, 0xa8, 0xa8, 0xa8, 0x50] }, //1000 10/1010 10/1010 10/1010 10/0101 00
        X: { width: 5, data: [0x90, 0x90, 0x60, 0x90, 0x90] }, //1001 0/1001 0/0110 0/1001 0/1001 0
        Y: { width: 6, data: [0x88, 0x50, 0x20, 0x20, 0x20] }, //1000 10/0101 00/0010 00/0010 00/0010 00
        Z: { width: 5, data: [0xf0, 0x10, 0x60, 0x80, 0xf0] }, //1111 0/0001 0/0110 0/1000 0/1111 0
        1: { width: 4, data: [0x40, 0xc0, 0x40, 0x40, 0xe0] }, //0100/1100/0100/0100/1110
        2: { width: 5, data: [0x60, 0x90, 0x20, 0x40, 0xf0] }, //0110 0/1001 0/0010 0/0100 0/1111 0
        3: { width: 5, data: [0x60, 0x90, 0x20, 0x90, 0x60] }, //0110 0/1001 0/0010 0/1001 0/0110 0
        4: { width: 5, data: [0x20, 0x60, 0xa0, 0xf0, 0x20] }, //0010 0/0110 0/1010 0/1111 0/0010 0
        5: { width: 5, data: [0xf0, 0x80, 0xe0, 0x10, 0xe0] }, //1111 0/1000 0/1110 0/0001 0/1110 0
        6: { width: 5, data: [0x60, 0x80, 0xe0, 0x90, 0x60] }, //0110 0/1000 0/1110 0/1001 0/0110 0
        7: { width: 5, data: [0xf0, 0x10, 0x20, 0x40, 0x80] }, //1111 0/0001 0/0010 0/0100 0/1000 0
        8: { width: 5, data: [0x60, 0x90, 0x60, 0x90, 0x60] }, //0110 0/1001 0/0110 0/1001 0/0110 0
        9: { width: 5, data: [0x60, 0x90, 0x70, 0x10, 0x60] }, //0110 0/1001 0/0111 0/0001 0/0110 0
        0: { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
        '`': { width: 3, data: [0x80, 0x40] }, //100/010/000/000/000
        '~': { width: 6, data: [0x00, 0x40, 0xa8, 0x10] }, //0000 00/0100 00/1010 10/0001 00/0000 00
        '!': { width: 2, data: [0x80, 0x80, 0x80, 0x00, 0x80] }, //10/10/10/00/10
        '@': { width: 5, data: [0x00, 0x60, 0x90, 0xb0, 0xb0] }, //0000 0/0110 0/1001 0/1011 0/1011 0
        '#': { width: 6, data: [0x50, 0xf8, 0x50, 0xf8, 0x50] }, //0101 00/1111 10/0101 00/1111 10/0101 00
        $: { width: 6, data: [0x70, 0xa0, 0x70, 0x28, 0x70] }, //0111 00/1010 00/0111 00/0010 10/0111 00
        '%': { width: 5, data: [0x00, 0x90, 0x20, 0x40, 0x90] }, //0000 0/1001 0/0010 0/0100 0/1001 0
        '^': { width: 4, data: [0x40, 0xa0] }, //0100/1010/0000/0000/0000
        '&': { width: 5, data: [0x60, 0x90, 0x60, 0xb0, 0x50] }, //0110 0/1001 0/0110 0/1011 0/0101 0
        '*': { width: 4, data: [0x00, 0xa0, 0x40, 0xa0] }, //0000/1010/0100/1010/0000
        '(': { width: 3, data: [0x40, 0x80, 0x80, 0x80, 0x40] }, //010/100/100/100/010
        ')': { width: 3, data: [0x80, 0x40, 0x40, 0x40, 0x80] }, //100/010/010/010/100
        _: { width: 5, data: [0x00, 0x00, 0x00, 0x00, 0xf0] }, //0000 0/0000 0/0000 0/0000 0/1111 0
        '-': { width: 4, data: [0x00, 0x00, 0xe0] }, //0000/0000/1110/0000/0000
        '+': { width: 4, data: [0x00, 0x40, 0xe0, 0x40] }, //0000/0100/1110/0100/0000
        '|': { width: 2, data: [0x80, 0x80, 0x80, 0x80, 0x80] }, //10/10/10/10/10
        '=': { width: 4, data: [0x00, 0xe0, 0x00, 0xe0] }, //0000/1110/0000/1110/0000
        '\\': { width: 5, data: [0x00, 0x80, 0x40, 0x20, 0x10] }, //0000 0/1000 0/0100 0/0010 0/0001 0
        '{': { width: 4, data: [0x60, 0x40, 0xc0, 0x40, 0x60] }, //0110/0100/1100/0100/0110
        '}': { width: 4, data: [0xc0, 0x40, 0x60, 0x40, 0xc0] }, //1100/0100/0110/0100/1100
        '[': { width: 3, data: [0xc0, 0x80, 0x80, 0x80, 0xc0] }, //110/100/100/100/110
        ']': { width: 3, data: [0xc0, 0x40, 0x40, 0x40, 0xc0] }, //110/010/010/010/110
        ':': { width: 2, data: [0x00, 0x80, 0x00, 0x80] }, //00/10/00/10/00
        ';': { width: 3, data: [0x00, 0x40, 0x00, 0x40, 0x80] }, //000/010/000/010/100
        '"': { width: 4, data: [0xa0, 0xa0] }, //1010/1010/0000/0000/0000
        "'": { width: 2, data: [0x80, 0x80] }, //10/10/00/00/00
        '<': { width: 4, data: [0x20, 0x40, 0x80, 0x40, 0x20] }, //0010/0100/1000/0100/0010
        '>': { width: 4, data: [0x80, 0x40, 0x20, 0x40, 0x80] }, //1000/0100/0010/0100/1000
        '?': { width: 5, data: [0x60, 0x90, 0x20, 0x00, 0x20] }, //0110 0/1001 0/0010 0/0000 0/0010 0
        ',': { width: 3, data: [0x00, 0x00, 0x00, 0x40, 0x80] }, //000/000/000/010/100
        '.': { width: 2, data: [0x00, 0x00, 0x00, 0x00, 0x80] }, //00/00/00/00/10
        '/': { width: 5, data: [0x00, 0x10, 0x20, 0x40, 0x80] }, //0000 0/0001 0/0010 0/0100 0/1000 0
    };

    const CHEESE_HAT_KO_CHO_JONG = [
        { width: 5, data: [0xf0, 0x10, 0x10, 0x10, 0x10] }, //1111 0/0001 0/0001 0/0001 0/0001 0
        { width: 5, data: [0xf0, 0x50, 0x50, 0x50, 0x50] }, //1111 0/0101 0/0101 0/0101 0/0101 0
        { width: 5, data: [0x80, 0x80, 0x80, 0x80, 0xf0] }, //1000 0/1000 0/1000 0/1000 0/1111 0
        { width: 5, data: [0xf0, 0x80, 0x80, 0x80, 0xf0] }, //1111 0/1000 0/1000 0/1000 0/1111 0
        { width: 5, data: [0xf0, 0xa0, 0xa0, 0xa0, 0xf0] }, //1111 0/1010 0/1010 0/1010 0/1111 0
        { width: 5, data: [0xf0, 0x10, 0xf0, 0x80, 0xf0] }, //1111 0/0001 0/1111 0/1000 0/1111 0
        { width: 5, data: [0xf0, 0x90, 0x90, 0x90, 0xf0] }, //1111 0/1001 0/1001 0/1001 0/1111 0
        { width: 5, data: [0x90, 0x90, 0xf0, 0x90, 0xf0] }, //1001 0/1001 0/1111 0/1001 0/1111 0
        { width: 6, data: [0xa8, 0xa8, 0xf8, 0xa8, 0xf8] }, //1010 1/1010 1/1111 1/1010 1/1111 1
        { width: 5, data: [0x40, 0x40, 0xa0, 0x90, 0x90] }, //0100 0/0100 0/1010 0/1001 0/1001 0
        { width: 6, data: [0x50, 0x50, 0xa8, 0xa8, 0xa8] }, //0101 0/0101 0/1010 1/1010 1/1010 1
        { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
        { width: 5, data: [0xf0, 0x40, 0x40, 0xa0, 0x90] }, //1111 0/0100 0/0100 0/1010 0/1001 0
        { width: 6, data: [0xf8, 0x50, 0x50, 0xa8, 0xa8] }, //1111 1/0101 0/0101 0/1010 1/1010 1
        { width: 5, data: [0x40, 0xf0, 0x40, 0xa0, 0x90] }, //0100 0/1111 0/0100 0/1010 0/1001 0
        { width: 5, data: [0xf0, 0x10, 0xf0, 0x10, 0x10] }, //1111 0/0001 0/1111 0/0001 0/0001 0
        { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0xf0] }, //1111 0/1000 0/1111 0/1000 0/1111 0
        { width: 5, data: [0xf0, 0x60, 0x60, 0x60, 0xf0] }, //1111 0/0110 0/0110 0/0110 0/1111 0
        { width: 5, data: [0x60, 0xf0, 0x60, 0x90, 0x60] }, //0110 0/1111 0/0110 0/1001 0/0110 0
        { width: 6, data: [0xd0, 0x50, 0x68, 0x68, 0x68] }, //1101 0/0101 0/0110 1/0110 1/0110 1
        { width: 6, data: [0xb8, 0x90, 0x90, 0xa8, 0xe8] }, //1011 1/1001 0/1001 0/1010 1/1110 1
        { width: 6, data: [0x90, 0xb8, 0x90, 0xa8, 0xd0] }, //1001 0/1011 1/1001 0/1010 1/1101 0
        { width: 5, data: [0xf0, 0x50, 0xd0, 0x90, 0xd0] }, //1111 0/0101 0/1101 0/1001 0/1101 0
        { width: 6, data: [0xf8, 0x68, 0xe8, 0xa8, 0xf8] }, //1111 1/0110 1/1110 1/1010 1/1111 1
        { width: 6, data: [0xe8, 0x68, 0xf8, 0xa8, 0xf8] }, //1110 1/0110 1/1111 1/1010 1/1111 1
        { width: 6, data: [0xd0, 0x50, 0xe8, 0xa8, 0xe8] }, //1101 0/0101 0/1110 1/1010 1/1110 1
        { width: 5, data: [0xf0, 0x60, 0xf0, 0xa0, 0xf0] }, //1111 0/0110 0/1111 0/1010 0/1111 0
        { width: 6, data: [0xf8, 0x50, 0xf8, 0x90, 0xf8] }, //1111 1/0101 0/1111 1/1001 0/1111 1
        { width: 6, data: [0xd0, 0x78, 0xd0, 0xa8, 0xd0] }, //1101 0/0111 1/1101 0/1010 1/1101 0
        { width: 7, data: [0xa8, 0xa8, 0xf4, 0xb4, 0xf4] }, //1010 10/1010 10/1111 01/1011 01/1111 01
    ];

    const CHEESE_HAT_KO_JUNG = [
        { width: 4, data: [0x80, 0x80, 0xe0, 0x80, 0x80] }, //1000 0/1000 0/1110 0/1000 0/1000 0
        { width: 4, data: [0xa0, 0xa0, 0xe0, 0xa0, 0xa0] }, //1010 0/1010 0/1110 0/1010 0/1010 0
        { width: 4, data: [0x80, 0xe0, 0x80, 0xe0, 0x80] }, //1000 0/1110 0/1000 0/1110 0/1000 0
        { width: 4, data: [0xa0, 0xe0, 0xa0, 0xe0, 0xa0] }, //1010 0/1110 0/1010 0/1110 0/1010 0
        { width: 4, data: [0x20, 0x20, 0xe0, 0x20, 0x20] }, //0010 0/0010 0/1110 0/0010 0/0010 0
        { width: 4, data: [0x60, 0x60, 0xe0, 0x60, 0x60] }, //0110 0/0110 0/1110 0/0110 0/0110 0
        { width: 4, data: [0x20, 0xe0, 0x20, 0xe0, 0x20] }, //0010 0/1110 0/0010 0/1110 0/0010 0
        { width: 4, data: [0x60, 0xe0, 0x60, 0xe0, 0x60] }, //0110 0/1110 0/0110 0/1110 0/0110 0
        { width: 6, data: [0x00, 0x20, 0x20, 0xf8, 0x00] }, //0000 0/0010 0/0010 0/1111 1/0000 0
        { width: 6, data: [0x10, 0x50, 0x58, 0xf0, 0x10] }, //0001 0/0101 0/0101 1/1111 0/0001 0
        { width: 6, data: [0x18, 0x58, 0x58, 0xf8, 0x18] }, //0001 1/0101 1/0101 1/1111 1/0001 1
        { width: 5, data: [0x10, 0x50, 0x50, 0xf0, 0x10] }, //0001 0/0101 0/0101 0/1111 0/0001 0
        { width: 6, data: [0x00, 0x50, 0x50, 0xf8, 0x00] }, //0000 0/0101 0/0101 0/1111 1/0000 0
        { width: 6, data: [0x00, 0xf8, 0x20, 0x20, 0x00] }, //0000 0/1111 1/0010 0/0010 0/0000 0
        { width: 6, data: [0x08, 0xf8, 0x48, 0x58, 0x08] }, //0000 1/1111 1/0100 1/0101 1/0000 1
        { width: 6, data: [0x18, 0xf8, 0x58, 0x78, 0x18] }, //0001 1/1111 1/0101 1/0111 1/0001 1
        { width: 5, data: [0x10, 0x10, 0xf0, 0x50, 0x50] }, //0001 0/0001 0/1111 0/0101 0/0101 0
        { width: 6, data: [0x00, 0xf8, 0x50, 0x50, 0x00] }, //0000 0/1111 1/0101 0/0101 0/0000 0
        { width: 5, data: [0x00, 0x00, 0x00, 0xf0, 0x00] }, //0000 0/0000 0/0000 0/1111 0/0000 0
        { width: 5, data: [0x10, 0x10, 0x10, 0xf0, 0x10] }, //0001 0/0001 0/0001 0/1111 0/0001 0
        { width: 2, data: [0x80, 0x80, 0x80, 0x80, 0x80] }, //1000 0/1000 0/1000 0/1000 0/1000 0
    ];

    function CheeseHatColorLedBackground(size) {
        this.display = new Array(size);
        this.pos = { x: 0, y: 0 };
        this.reset();
    }

    CheeseHatColorLedBackground.prototype.clearDisplay = function () {
        const display = this.display;
        for (let i = 0; i < display.length; ++i) {
            display[i] = 0;
        }
    };

    CheeseHatColorLedBackground.prototype.clear = function () {
        this.data = {};
        this.clearDisplay();
        this.pos.x = 0;
        this.pos.y = 0;
    };

    CheeseHatColorLedBackground.prototype.reset = function () {
        this.clear();
    };

    function CheeseHatColorLedSprite(size) {
        this.size = size;
        this.display = new Array(size);
        this.pos = { x: 0, y: 0 };
        this.roi = {};
        this.rot = new Array(4);
        this.rotTmp = new Array(4);
        this.reset();
    }

    CheeseHatColorLedSprite.prototype.clearDisplay = function () {
        const display = this.display;
        for (let i = 0; i < display.length; ++i) {
            display[i] = 0;
        }
    };

    CheeseHatColorLedSprite.prototype.clear = function () {
        this.data = {};
        this.clearDisplay();
        this.width = 0;
        this.height = 0;
        const roi = this.roi;
        roi.left = this.size;
        roi.right = 0;
        roi.top = this.size;
        roi.bottom = 0;
    };

    CheeseHatColorLedSprite.prototype.reset = function () {
        this.clear();
        this.pos.x = 0;
        this.pos.y = 0;
        const rot = this.rot;
        rot[0] = 0;
        rot[1] = 1;
        rot[2] = 2;
        rot[3] = 3;
        this.visible = true;
    };

    function CheeseHatColorLedTouchCalculator(size) {
        this.size = size;
    }

    CheeseHatColorLedTouchCalculator.prototype.__checkTouch = function (display1, display2) {
        const size = this.size;
        for (let i = 0; i < size; ++i) {
            if (display1[i] & display2[i]) return true;
        }
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkSprites = function (sprite1, sprite2) {
        if (sprite1 && sprite2) return this.__checkTouch(sprite1.display, sprite2.display);
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkOtherSprite = function (sprites, i) {
        if (sprites) {
            const sprite = sprites[i];
            if (sprite) {
                let other;
                for (const j in sprites) {
                    if (i != j) {
                        other = sprites[j];
                        if (other) {
                            if (this.__checkTouch(sprite.display, other.display)) return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkBackground = function (sprite, background) {
        if (sprite && background) return this.__checkTouch(sprite.display, background.display);
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkLeftWall = function (sprite) {
        if (sprite) return sprite.roi.left < 0;
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkRightWall = function (sprite) {
        if (sprite) return sprite.roi.right >= this.size;
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkTopWall = function (sprite) {
        if (sprite) return sprite.roi.top < 0;
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkBottomWall = function (sprite) {
        if (sprite) return sprite.roi.bottom >= this.size;
        return false;
    };

    CheeseHatColorLedTouchCalculator.prototype.checkAnyWall = function (sprite) {
        if (sprite) {
            const roi = sprite.roi;
            const size = this.size;
            return roi.left < 0 || roi.right >= size || roi.top < 0 || roi.bottom >= size;
        }
        return false;
    };

    function CheeseHatColorLedMatrix(id, size) {
        this.size = size;
        this.packet = new Array(20);
        this.packet[0] = (id & 0x0f) | 0x20;
        this.packet[1] = (id >> 4) & 0xff;
        this.background = new CheeseHatColorLedBackground(size);
        this.touchCalculator = new CheeseHatColorLedTouchCalculator(size);
        this.reset();
    }

    CheeseHatColorLedMatrix.prototype.reset = function () {
        const packet = this.packet;
        for (let i = 2; i < 20; ++i) {
            packet[i] = 0;
        }
        packet[19] = 20;
        this.background.reset();
        this.sprites = {};
        this.orderedKey = [];
        this.brightness = 20;
    };

    CheeseHatColorLedMatrix.prototype.getPacket = function () {
        return this.packet;
    };

    CheeseHatColorLedMatrix.prototype.__updateBackground = function (target, packet) {
        const data = target.data;
        const display = target.display;
        const pos = target.pos;
        let xy, px, py, value, index;

        target.clearDisplay();

        const size = this.size;
        for (const i in data) {
            if (data[i] > 0) {
                xy = parseInt(i);
                px = (xy >> 16) & 0xffff;
                if (px > 0x7fff) px -= 0x10000;
                px += pos.x;
                if (px >= 0 && px < size) {
                    py = xy & 0xffff;
                    if (py > 0x7fff) py -= 0x10000;
                    py += pos.y;
                    if (py >= 0 && py < size) {
                        value = 0x10 >> py;
                        display[px] |= value;
                        value = py * 5 + px;
                        index = parseInt(value / 2) + 2;
                        if (value % 2 == 1) {
                            packet[index] = (packet[index] & 0xf0) | (data[i] & 0x0f);
                        } else {
                            packet[index] = (packet[index] & 0x0f) | ((data[i] << 4) & 0xf0);
                        }
                    }
                }
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.__updateSprite = function (target, packet) {
        const data = target.data;
        const display = target.display;
        const pos = target.pos;
        const rot = target.rot;
        const rmp = target.rotTmp;
        const width = target.width,
            height = target.height;
        let xy, px, py, t, value, index;

        target.clearDisplay();

        if (width > 0 && height > 0) {
            const size = this.size;
            const roi = target.roi;
            const flip = (rot[0] + 1) % 4 != rot[1];
            if (flip) {
                rmp[0] = rot[1];
                rmp[1] = rot[0];
                rmp[2] = rot[3];
                rmp[3] = rot[2];
            } else {
                rmp[0] = rot[0];
                rmp[1] = rot[1];
                rmp[2] = rot[2];
                rmp[3] = rot[3];
            }

            let count = 0;
            for (let i = 0; i < 4; ++i) {
                if (rmp[i] == 0) {
                    count = i;
                    break;
                }
            }

            if (flip) {
                if (count == 1) count = 3;
                else if (count == 3) count = 1;
            }

            for (const i in data) {
                if (data[i] > 0) {
                    xy = parseInt(i);
                    px = (xy >> 16) & 0xffff;
                    if (px > 0x7fff) px -= 0x10000;
                    py = xy & 0xffff;
                    if (py > 0x7fff) py -= 0x10000;
                    if (flip) {
                        px = width - 1 - px;
                    }
                    switch (count) {
                        case 1: {
                            t = px;
                            px = width - 1 - py;
                            py = t;
                            break;
                        }
                        case 2: {
                            px = width - 1 - px;
                            py = height - 1 - py;
                            break;
                        }
                        case 3: {
                            t = px;
                            px = py;
                            py = height - 1 - t;
                            break;
                        }
                    }
                    px += pos.x;
                    if (px >= 0 && px < size) {
                        py += pos.y;
                        if (py >= 0 && py < size) {
                            value = 0x10 >> py;
                            display[px] |= value;
                            value = py * 5 + px;
                            index = parseInt(value / 2) + 2;
                            if (value % 2 == 1) {
                                packet[index] = (packet[index] & 0xf0) | (data[i] & 0x0f);
                            } else {
                                packet[index] = (packet[index] & 0x0f) | ((data[i] << 4) & 0xf0);
                            }
                        }
                    }
                    if (px < roi.left) roi.left = px;
                    if (px > roi.right) roi.right = px;
                    if (py < roi.top) roi.top = py;
                    if (py > roi.bottom) roi.bottom = py;
                }
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.update = function () {
        const packet = this.packet;
        for (let i = 2; i < 20; ++i) {
            packet[i] = 0;
        }
        this.__updateBackground(this.background, packet);
        const sprites = this.sprites;
        const orderedKey = this.orderedKey;
        let sprite, roi;
        const size = this.size;
        for (const i in orderedKey) {
            sprite = sprites[orderedKey[i]];
            if (sprite) {
                roi = sprite.roi;
                roi.left = size;
                roi.right = 0;
                roi.top = size;
                roi.bottom = 0;
                if (sprite.visible) {
                    this.__updateSprite(sprite, packet);
                }
            }
        }
        packet[19] = this.brightness;
        return packet;
    };

    CheeseHatColorLedMatrix.prototype.__drawPixel = function (data, tx, ty, color) {
        data[((tx & 0xffff) << 16) | (ty & 0xffff)] = color;
    };

    CheeseHatColorLedMatrix.prototype.__drawShape = function (data, tx, ty, shape, width, color) {
        let value, mask;
        for (let y = 0; y < shape.length; ++y) {
            value = shape[y];
            mask = 0x80;
            for (let x = 0; x < width; ++x) {
                if (value & mask) {
                    data[(((tx + x) & 0xffff) << 16) | (ty & 0xffff)] = color;
                }
                mask >>= 1;
            }
            ++ty;
        }
    };

    CheeseHatColorLedMatrix.prototype.__KO_JAMO = [
        [0],
        [0, 0],
        [0, 9],
        [2],
        [2, 12],
        [2, 18],
        [3],
        [3, 3],
        [5],
        [5, 0],
        [5, 6],
        [5, 7],
        [5, 9],
        [5, 16],
        [5, 17],
        [5, 18],
        [6],
        [7],
        [7, 7],
        [7, 9],
        [9],
        [9, 9],
        [11],
        [12],
        [12, 12],
        [14],
        [15],
        [16],
        [17],
        [18],
    ];
    CheeseHatColorLedMatrix.prototype.__KO_CHO = [
        [0],
        [0, 0],
        [2],
        [3],
        [3, 3],
        [5],
        [6],
        [7],
        [7, 7],
        [9],
        [9, 9],
        [11],
        [12],
        [12, 12],
        [14],
        [15],
        [16],
        [17],
        [18],
    ];
    CheeseHatColorLedMatrix.prototype.__KO_JUNG = [
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [8, 0],
        [8, 1],
        [8, 20],
        [12],
        [13],
        [13, 4],
        [13, 5],
        [13, 20],
        [17],
        [18],
        [18, 20],
        [20],
    ];
    CheeseHatColorLedMatrix.prototype.__KO_JONG = [
        [],
        [0],
        [0, 0],
        [0, 9],
        [2],
        [2, 12],
        [2, 18],
        [3],
        [5],
        [5, 0],
        [5, 6],
        [5, 7],
        [5, 9],
        [5, 16],
        [5, 17],
        [5, 18],
        [6],
        [7],
        [7, 9],
        [9],
        [9, 9],
        [11],
        [12],
        [14],
        [15],
        [16],
        [17],
        [18],
    ];

    CheeseHatColorLedMatrix.prototype.__drawString = function (data, tx, ty, text, len, color) {
        let t,
            width = 0,
            blank,
            index,
            shape;
        for (let j = 0; j < len; ++j) {
            t = text.charCodeAt(j);
            if (t == 32) {
                blank = true;
                tx += 5;
                width += 5;
            } else {
                blank = false;
                if (t >= 0x3131 && t <= 0x314e) {
                    index = t - 0x3131;
                    if (index >= 0 && index < 30) {
                        index = this.__KO_JAMO[index];
                        for (const i in index) {
                            shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                            this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                            tx += shape.width;
                            width += shape.width;
                            if (index.length > 1 && i == 0) {
                                tx--;
                                width--;
                            }
                        }
                    }
                } else if (t >= 0x314f && t <= 0x3163) {
                    index = t - 0x314f;
                    if (index >= 0 && index < 21) {
                        index = this.__KO_JUNG[index];
                        for (const i in index) {
                            shape = CHEESE_HAT_KO_JUNG[index[i]];
                            this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                            tx += shape.width;
                            width += shape.width;
                            if (index.length > 1 && i == 0) {
                                tx--;
                                width--;
                            }
                        }
                    }
                } else if (t >= 0xac00 && t <= 0xd7a3) {
                    t -= 0xac00;

                    index = Math.floor(t / 28 / 21);
                    if (index >= 0 && index < 19) {
                        index = this.__KO_CHO[index];
                        for (const i in index) {
                            shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                            this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                            tx += shape.width;
                            width += shape.width;
                            if (index.length > 1 && i == 0) {
                                tx--;
                                width--;
                            }
                        }
                    }

                    index = Math.floor((t / 28) % 21);
                    if (index >= 0 && index < 21) {
                        index = this.__KO_JUNG[index];
                        for (const i in index) {
                            shape = CHEESE_HAT_KO_JUNG[index[i]];
                            this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                            tx += shape.width;
                            width += shape.width;
                            if (index.length > 1 && i == 0) {
                                tx--;
                                width--;
                            }
                        }
                    }

                    index = t % 28;
                    if (index > 0 && index < 28) {
                        index = this.__KO_JONG[index];
                        for (const i in index) {
                            shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                            this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                            tx += shape.width;
                            width += shape.width;
                            if (index.length > 1 && i == 0) {
                                tx--;
                                width--;
                            }
                        }
                    }

                    tx += 2;
                    width += 2;
                } else {
                    shape = CHEESE_HAT_ALPHABETS[text.charAt(j)];
                    if (shape) {
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                    }
                }
            }
        }
        if (blank) width -= 5; // last blank
        return width - 1;
    };

    CheeseHatColorLedMatrix.prototype.__drawPattern = function (
        data,
        tx,
        ty,
        value,
        start,
        len,
        color
    ) {
        let ch, pos;
        for (let x = 0; x < len; ++x) {
            ch = value.charAt(start + x);
            pos = (((tx + x) & 0xffff) << 16) | (ty & 0xffff);
            if (ch === '1') {
                data[pos] = color;
            } else if (ch === '0') {
                data[pos] = 0;
            } else if (ch === '~') {
                if (data[pos] > 0) data[pos] = 0;
                else data[pos] = color;
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.setBackgroundPixel = function (x, y, color) {
        const background = this.background;
        const pos = background.pos;
        const tx = x - pos.x,
            ty = y - pos.y;
        this.__drawPixel(background.data, tx, ty, color);
    };

    CheeseHatColorLedMatrix.prototype.drawBackgroundShape = function (x, y, shape, color) {
        shape = CHEESE_HAT_SHAPES[shape];
        if (shape) {
            const background = this.background;
            const pos = background.pos;
            const tx = x - pos.x,
                ty = y - pos.y;
            this.__drawShape(background.data, tx, ty, shape, 5, color);
            return true;
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.drawBackgroundString = function (x, y, text, color) {
        const len = text.length;
        if (len > 0) {
            const background = this.background;
            const pos = background.pos;
            const tx = x - pos.x,
                ty = y - pos.y;
            this.__drawString(background.data, tx, ty, text, len, color);
            return true;
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.drawBackgroundPattern = function (x, y, pattern, color) {
        pattern = pattern.trim();
        let len = pattern.length;
        if (len > 0) {
            const background = this.background;
            const data = background.data;
            const pos = background.pos;
            let start, end;
            const tx = x - pos.x;
            let ty = y - pos.y;
            const patterns = pattern.split('/');

            const candidates = {};
            let del = false;
            let cy = ty;
            for (const i in patterns) {
                pattern = patterns[i].trim();
                len = pattern.length;
                if (len > 0) {
                    start = 0;
                    end = false;
                    if (pattern == '$') {
                        start = 1;
                        end = true;
                        len = 0;
                        del = true;
                    } else {
                        if (pattern[len - 1] == '$') {
                            end = true;
                            --len;
                            del = true;
                        }
                        if (pattern[0] == '$') {
                            start = 1;
                            --len;
                            del = true;
                        }
                    }
                    candidates[cy] = [start, end, len, pattern];
                } else {
                    candidates[cy] = undefined;
                }
                ++cy;
            }

            let candidate;
            if (del) {
                let xy, px, py;
                for (const i in data) {
                    xy = parseInt(i);
                    py = xy & 0xffff;
                    if (py > 0x7fff) py -= 0x10000;
                    py += pos.y;
                    candidate = candidates[py];
                    if (candidate) {
                        px = (xy >> 16) & 0xffff;
                        if (px > 0x7fff) px -= 0x10000;
                        px += pos.x;
                        if (
                            (candidate[0] > 0 && px < tx) ||
                            (candidate[1] && px >= tx + candidate[2])
                        ) {
                            delete data[i];
                        }
                    }
                }
            }

            for (const i in candidates) {
                candidate = candidates[i];
                if (candidate) {
                    this.__drawPattern(
                        data,
                        tx,
                        i,
                        candidate[3],
                        candidate[0],
                        candidate[2],
                        color
                    );
                }
            }
            return true;
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.clearBackground = function () {
        this.background.clear();
    };

    CheeseHatColorLedMatrix.prototype.clearAll = function () {
        this.background.clear();
        const sprites = this.sprites;
        let sprite;
        for (const i in sprites) {
            sprite = sprites[i];
            if (sprite) sprite.clear();
        }
    };

    CheeseHatColorLedMatrix.prototype.scrollBackgroundBy = function (x, y) {
        const pos = this.background.pos;
        pos.x += x;
        pos.y += y;
    };

    CheeseHatColorLedMatrix.prototype.scrollAllBy = function (x, y) {
        this.scrollBackgroundBy(x, y);
        const sprites = this.sprites;
        let sprite;
        for (const i in sprites) {
            sprite = sprites[i];
            if (sprite) {
                sprite.pos.x += x;
                sprite.pos.y += y;
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.__getOrCreateSprite = function (i) {
        let sprite = this.sprites[i];
        if (!sprite) {
            sprite = this.sprites[i] = new CheeseHatColorLedSprite(this.size);
            this.orderedKey.push(i);
            this.orderedKey.sort((a, b) => {
                return a - b;
            });
        }
        return sprite;
    };

    CheeseHatColorLedMatrix.prototype.__getOrCreateEmptySprite = function (i) {
        let sprite = this.sprites[i];
        if (sprite) {
            sprite.data = {};
        } else {
            sprite = this.sprites[i] = new CheeseHatColorLedSprite(this.size);
            this.orderedKey.push(i);
            this.orderedKey.sort((a, b) => {
                return a - b;
            });
        }
        return sprite;
    };

    CheeseHatColorLedMatrix.prototype.__setSpriteShape = function (sprite, shape, color) {
        if (sprite) {
            shape = CHEESE_HAT_SHAPES[shape];
            if (shape) {
                sprite.width = 5;
                sprite.height = 5;
                this.__drawShape(sprite.data, 0, 0, shape, 5, color);
                return true;
            }
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.setSpriteShape = function (i, shape, color) {
        if (i < 0) {
            const sprites = this.sprites;
            let res = false;
            for (const j in sprites) {
                if (this.__setSpriteShape(sprites[j], shape, color)) res = true;
            }
            return res;
        } else {
            const sprite = this.__getOrCreateEmptySprite(i);
            return this.__setSpriteShape(sprite, shape, color);
        }
    };

    CheeseHatColorLedMatrix.prototype.__setSpriteString = function (sprite, text, color) {
        if (sprite) {
            const len = text.length;
            if (len > 0) {
                sprite.width = this.__drawString(sprite.data, 0, 0, text, len, color);
                sprite.height = 5;
                return true;
            }
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.setSpriteString = function (i, text, color) {
        if (i < 0) {
            const sprites = this.sprites;
            let res = false;
            for (const j in sprites) {
                if (this.__setSpriteString(sprites[j], text, color)) res = true;
            }
            return res;
        } else {
            const sprite = this.__getOrCreateEmptySprite(i);
            return this.__setSpriteString(sprite, text, color);
        }
    };

    CheeseHatColorLedMatrix.prototype.__setSpritePattern = function (sprite, pattern, color) {
        if (sprite) {
            pattern = pattern.trim();
            const len = pattern.length;
            if (len > 0) {
                const data = sprite.data;
                let ty = 0,
                    width = 0;
                const patterns = pattern.split('/');
                for (const i in patterns) {
                    pattern = patterns[i].trim();
                    this.__drawPattern(data, 0, ty, pattern, 0, pattern.length, color);
                    width = Math.max(width, pattern.length);
                    ++ty;
                }
                sprite.width = width;
                sprite.height = ty;
                return true;
            }
        }
        return false;
    };

    CheeseHatColorLedMatrix.prototype.setSpritePattern = function (i, pattern, color) {
        if (i < 0) {
            const sprites = this.sprites;
            let res = false;
            for (const j in sprites) {
                if (this.__setSpritePattern(sprites[j], pattern, color)) res = true;
            }
            return res;
        } else {
            const sprite = this.__getOrCreateEmptySprite(i);
            return this.__setSpritePattern(sprite, pattern, color);
        }
    };

    CheeseHatColorLedMatrix.prototype.clearSprite = function (i) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) sprite.clear();
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            sprite.clear();
        }
    };

    CheeseHatColorLedMatrix.prototype.showSprite = function (i) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) sprite.visible = true;
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            sprite.visible = true;
        }
    };

    CheeseHatColorLedMatrix.prototype.hideSprite = function (i) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) sprite.visible = false;
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            sprite.visible = false;
        }
    };

    CheeseHatColorLedMatrix.prototype.changeSpritePositionsBy = function (i, x, y) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) {
                    sprite.pos.x += x;
                    sprite.pos.y += y;
                }
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            sprite.pos.x += x;
            sprite.pos.y += y;
        }
    };

    CheeseHatColorLedMatrix.prototype.setSpritePositionsTo = function (i, x, y) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) {
                    sprite.pos.x = x;
                    sprite.pos.y = y;
                }
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            sprite.pos.x = x;
            sprite.pos.y = y;
        }
    };

    CheeseHatColorLedMatrix.prototype.changeSpritePositionBy = function (i, positionX, value) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) {
                    if (positionX) sprite.pos.x += value;
                    else sprite.pos.y += value;
                }
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            if (positionX) sprite.pos.x += value;
            else sprite.pos.y += value;
        }
    };

    CheeseHatColorLedMatrix.prototype.setSpritePositionTo = function (i, positionX, value) {
        if (i < 0) {
            const sprites = this.sprites;
            let sprite;
            for (const j in sprites) {
                sprite = sprites[j];
                if (sprite) {
                    if (positionX) sprite.pos.x = value;
                    else sprite.pos.y = value;
                }
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            if (positionX) sprite.pos.x = value;
            else sprite.pos.y = value;
        }
    };

    CheeseHatColorLedMatrix.prototype.__rotateSprite = function (sprite, clockwise) {
        if (sprite) {
            const rot = sprite.rot;
            const t0 = rot[0],
                t1 = rot[1],
                t2 = rot[2],
                t3 = rot[3];
            if (clockwise) {
                rot[0] = t3;
                rot[1] = t0;
                rot[2] = t1;
                rot[3] = t2;
            } else {
                rot[0] = t1;
                rot[1] = t2;
                rot[2] = t3;
                rot[3] = t0;
            }

            const width = sprite.width,
                height = sprite.height;
            const shift = parseInt((width - height) / 2);
            sprite.pos.x += shift;
            sprite.pos.y -= shift;
            sprite.width = height;
            sprite.height = width;
        }
    };

    CheeseHatColorLedMatrix.prototype.rotateSprite = function (i, clockwise) {
        if (i < 0) {
            const sprites = this.sprites;
            for (const j in sprites) {
                this.__rotateSprite(sprites[j], clockwise);
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            this.__rotateSprite(sprite, clockwise);
        }
    };

    CheeseHatColorLedMatrix.prototype.__flipSprite = function (sprite, horz) {
        if (sprite) {
            const rot = sprite.rot;
            const t0 = rot[0],
                t1 = rot[1],
                t2 = rot[2],
                t3 = rot[3];
            if (horz) {
                rot[0] = t1;
                rot[1] = t0;
                rot[2] = t3;
                rot[3] = t2;
            } else {
                rot[0] = t3;
                rot[1] = t2;
                rot[2] = t1;
                rot[3] = t0;
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.flipSprite = function (i, horz) {
        if (i < 0) {
            const sprites = this.sprites;
            for (const j in sprites) {
                this.__flipSprite(sprites[j], horz);
            }
        } else {
            const sprite = this.__getOrCreateSprite(i);
            this.__flipSprite(sprite, horz);
        }
    };

    CheeseHatColorLedMatrix.prototype.__stampSprite = function (sprite) {
        if (sprite) {
            const background = this.background;
            const spriteData = sprite.data;
            const backgroundData = background.data;
            const spritePos = sprite.pos;
            const backgroundPos = background.pos;
            let xy, px, py;
            for (const i in spriteData) {
                xy = parseInt(i);
                px = (xy >> 16) & 0xffff;
                if (px > 0x7fff) px -= 0x10000;
                px += spritePos.x - backgroundPos.x;
                py = xy & 0xffff;
                if (py > 0x7fff) py -= 0x10000;
                py += spritePos.y - backgroundPos.y;
                backgroundData[((px & 0xffff) << 16) | (py & 0xffff)] = spriteData[i];
            }
        }
    };

    CheeseHatColorLedMatrix.prototype.stampSprite = function (i) {
        if (i < 0) {
            const sprites = this.sprites;
            for (const j in sprites) {
                this.__stampSprite(sprites[j]);
            }
        } else {
            this.__stampSprite(this.sprites[i]);
        }
    };

    CheeseHatColorLedMatrix.prototype.changeBrightnessBy = function (value) {
        value += this.brightness;
        if (value < 0) value = 0;
        else if (value > 100) value = 100;
        this.brightness = value;
    };

    CheeseHatColorLedMatrix.prototype.setBrightnessTo = function (value) {
        if (value < 0) value = 0;
        else if (value > 100) value = 100;
        this.brightness = value;
    };

    CheeseHatColorLedMatrix.prototype.getSpritePosition = function (i, positionX) {
        const sprite = this.sprites[i];
        if (sprite) {
            if (positionX) return sprite.pos.x;
            else return sprite.pos.y;
        }
        return 0;
    };

    CheeseHatColorLedMatrix.prototype.checkSpritesTouched = function (i, j) {
        return this.touchCalculator.checkSprites(this.sprites[i], this.sprites[j]);
    };

    CheeseHatColorLedMatrix.prototype.checkOtherSpriteTouched = function (i) {
        return this.touchCalculator.checkOtherSprite(this.sprites, i);
    };

    CheeseHatColorLedMatrix.prototype.checkBackgroundTouched = function (i) {
        return this.touchCalculator.checkBackground(this.sprites[i], this.background);
    };

    CheeseHatColorLedMatrix.prototype.checkWallTouched = function (i, direction) {
        switch (direction) {
            case -1:
                return this.touchCalculator.checkAnyWall(this.sprites[i]);
            case 0:
                return this.touchCalculator.checkLeftWall(this.sprites[i]);
            case 1:
                return this.touchCalculator.checkRightWall(this.sprites[i]);
            case 2:
                return this.touchCalculator.checkTopWall(this.sprites[i]);
            case 3:
                return this.touchCalculator.checkBottomWall(this.sprites[i]);
        }
        return false;
    };

    function CheeseRange() {
        this.__ranges = {};
    }

    CheeseRange.prototype.__getOrCreate = function (port) {
        let range = this.__ranges[port];
        if (!range) {
            range = this.__ranges[port] = {};
            this.__reset(range);
        }
        return range;
    };

    CheeseRange.prototype.__reset = function (range) {
        range.active = false;
        range.has_middle = false;
        range.has_decimal = true;
        range.in_lower = 0;
        range.in_middle = 127;
        range.in_upper = 255;
        range.out_lower = -100;
        range.out_middle = 0;
        range.out_upper = 100;
        range.out_min = -100;
        range.out_max = 100;
    };

    CheeseRange.prototype.reset = function () {
        const ranges = this.__ranges;
        for (const i in ranges) {
            this.__reset(ranges[i]);
        }
    };

    CheeseRange.prototype.setLowHigh = function (port, low1, high1, low2, high2, decimal) {
        const range = this.__getOrCreate(port);
        range.has_middle = false;
        range.has_decimal = decimal;
        range.in_lower = low1;
        range.in_upper = high1;
        range.out_lower = low2;
        range.out_upper = high2;
        range.out_min = Math.min(low2, high2);
        range.out_max = Math.max(low2, high2);
        range.active = true;
    };

    CheeseRange.prototype.setLowMidHigh = function (
        port,
        low1,
        mid1,
        high1,
        low2,
        mid2,
        high2,
        decimal
    ) {
        const range = this.__getOrCreate(port);
        if (mid1 == low1 || mid1 == high1) {
            range.has_middle = false;
        } else {
            range.has_middle = true;
        }
        range.has_decimal = decimal;
        range.in_lower = low1;
        range.in_middle = mid1;
        range.in_upper = high1;
        range.out_lower = low2;
        range.out_middle = mid2;
        range.out_upper = high2;
        range.out_min = Math.min(low2, mid2, high2);
        range.out_max = Math.max(low2, mid2, high2);
        range.active = true;
    };

    CheeseRange.prototype.calc = function (port, value) {
        const range = this.__getOrCreate(port);
        if (range.active) {
            if (range.has_middle) {
                if (range.in_middle == range.in_upper || range.in_middle == range.in_lower) {
                    if (range.in_lower == range.in_upper) {
                    } else {
                        value =
                            ((range.out_upper - range.out_lower) * (value - range.in_lower)) /
                                (range.in_upper - range.in_lower) +
                            range.out_lower;
                    }
                } else {
                    if (value > range.in_middle) {
                        value =
                            ((range.out_upper - range.out_middle) * (value - range.in_middle)) /
                                (range.in_upper - range.in_middle) +
                            range.out_middle;
                    } else {
                        value =
                            ((range.out_middle - range.out_lower) * (value - range.in_lower)) /
                                (range.in_middle - range.in_lower) +
                            range.out_lower;
                    }
                }
            } else {
                if (range.in_lower == range.in_upper) {
                } else {
                    value =
                        ((range.out_upper - range.out_lower) * (value - range.in_lower)) /
                            (range.in_upper - range.in_lower) +
                        range.out_lower;
                }
            }
            if (value < range.out_min) value = range.out_min;
            else if (value > range.out_max) value = range.out_max;
        }
        if (range.has_decimal) return value;
        else return Math.round(value);
    };

    function CheeseButtonCounter() {
        this.__counters = {};
    }

    CheeseButtonCounter.prototype.reset = function () {
        const counters = this.__counters;
        for (const i in counters) {
            counters[i] = 0;
        }
    };

    CheeseButtonCounter.prototype.tick = function () {
        const counters = this.__counters;
        for (const i in counters) {
            if (counters[i] > 0) --counters[i];
        }
    };

    CheeseButtonCounter.prototype.setCount = function (port, value) {
        this.__counters[port] = value;
    };

    CheeseButtonCounter.prototype.isCounting = function (port) {
        const counter = this.__counters[port];
        return counter === undefined ? false : counter > 0;
    };

    function CheeseLed(port) {
        this.__port = port;
        this.__PORT_A = port + 'a';
        this.__PORT_B = port + 'b';
        this.__PORT_C = port + 'c';
        this.reset();
    }

    CheeseLed.prototype.reset = function () {
        this.__r = 0;
        this.__g = 0;
        this.__b = 0;
        this.__anode = false;
        this.__portR = this.__PORT_A;
        this.__portG = this.__PORT_B;
        this.__portB = this.__PORT_C;
    };

    CheeseLed.prototype.setType = function (type) {
        switch (type) {
            case 'DEFAULT':
            case '-RGB':
                this.__anode = false;
                this.__portR = this.__PORT_A;
                this.__portG = this.__PORT_B;
                this.__portB = this.__PORT_C;
                break;
            case '-RBG':
                this.__anode = false;
                this.__portR = this.__PORT_A;
                this.__portB = this.__PORT_B;
                this.__portG = this.__PORT_C;
                break;
            case '-GRB':
                this.__anode = false;
                this.__portG = this.__PORT_A;
                this.__portR = this.__PORT_B;
                this.__portB = this.__PORT_C;
                break;
            case '-GBR':
                this.__anode = false;
                this.__portG = this.__PORT_A;
                this.__portB = this.__PORT_B;
                this.__portR = this.__PORT_C;
                break;
            case '-BRG':
                this.__anode = false;
                this.__portB = this.__PORT_A;
                this.__portR = this.__PORT_B;
                this.__portG = this.__PORT_C;
                break;
            case '-BGR':
                this.__anode = false;
                this.__portB = this.__PORT_A;
                this.__portG = this.__PORT_B;
                this.__portR = this.__PORT_C;
                break;
            case '+RGB':
                this.__anode = true;
                this.__portR = this.__PORT_A;
                this.__portG = this.__PORT_B;
                this.__portB = this.__PORT_C;
                break;
            case '+RBG':
                this.__anode = true;
                this.__portR = this.__PORT_A;
                this.__portB = this.__PORT_B;
                this.__portG = this.__PORT_C;
                break;
            case '+GRB':
                this.__anode = true;
                this.__portG = this.__PORT_A;
                this.__portR = this.__PORT_B;
                this.__portB = this.__PORT_C;
                break;
            case '+GBR':
                this.__anode = true;
                this.__portG = this.__PORT_A;
                this.__portB = this.__PORT_B;
                this.__portR = this.__PORT_C;
                break;
            case '+BRG':
                this.__anode = true;
                this.__portB = this.__PORT_A;
                this.__portR = this.__PORT_B;
                this.__portG = this.__PORT_C;
                break;
            case '+BGR':
                this.__anode = true;
                this.__portB = this.__PORT_A;
                this.__portG = this.__PORT_B;
                this.__portR = this.__PORT_C;
                break;
        }
    };

    CheeseLed.prototype.getR = function () {
        return this.__r;
    };

    CheeseLed.prototype.getG = function () {
        return this.__g;
    };

    CheeseLed.prototype.getB = function () {
        return this.__b;
    };

    CheeseLed.prototype.setRgb = function (r, g, b) {
        this.__r = r;
        this.__g = g;
        this.__b = b;
    };

    CheeseLed.prototype.isAnode = function () {
        return this.__anode;
    };

    CheeseLed.prototype.getPortR = function () {
        return this.__portR;
    };

    CheeseLed.prototype.getPortG = function () {
        return this.__portG;
    };

    CheeseLed.prototype.getPortB = function () {
        return this.__portB;
    };

    function CheeseButtonChecker() {
        this.reset();
    }

    CheeseButtonChecker.prototype.reset = function () {
        this.__state = 0;
        this.__pressTime = 0;
        this.__clicked = false;
        this.__longPressed = false;
        this.__clickedEvent = false;
        this.__longPressedEvent = false;
    };

    CheeseButtonChecker.prototype.clearEvent = function () {
        this.__clickedEvent = false;
        this.__longPressedEvent = false;
    };

    CheeseButtonChecker.prototype.check = function (pressed) {
        this.__clicked = false;
        this.__longPressed = false;
        switch (this.__state) {
            case 0: // ready state and wait for press
                if (pressed) {
                    this.__pressTime = Date.now();
                    this.__state = 1;
                }
                break;
            case 1: // check how long button is pressed
                if (pressed) {
                    if (Date.now() - this.__pressTime > 1500) {
                        this.__longPressed = true;
                        this.__state = 2;
                    }
                } else {
                    if (Date.now() - this.__pressTime < 750) {
                        this.__clicked = true;
                    }
                    this.__state = 0;
                }
                break;
            case 2: // check release of long-click
                if (!pressed) this.__state = 0;
                break;
        }
        if (this.__clicked) this.__clickedEvent = true;
        if (this.__longPressed) this.__longPressedEvent = true;
    };

    CheeseButtonChecker.prototype.isClicked = function () {
        return this.__clickedEvent;
    };

    CheeseButtonChecker.prototype.isLongPressed = function () {
        return this.__longPressedEvent;
    };

    function CheeseNeopixel() {
        const packet = (this.__packet = new Array(20));
        for (let i = 0; i < 20; ++i) packet[i] = 0;
        this.__reset();
    }

    CheeseNeopixel.prototype.__reset = function () {
        this.__cmdId = 0;
        this.__hasWhite = false;
        this.__numLeds = 0;
        this.__brightness = 128;
        this.__brightnessPerc = 50;
        this.__auto = true;
    };

    CheeseNeopixel.prototype.getPacket = function () {
        return this.__packet;
    };

    CheeseNeopixel.prototype.end = function () {
        const packet = this.__packet;
        packet[0] = this.__hasWhite ? 0x4d : 0x45;
        packet[1] = 0x50;
        packet[19] = 1;

        this.__reset();
        return packet;
    };

    CheeseNeopixel.prototype.setType = function (type) {
        switch (type) {
            case 0: // grb
                this.__hasWhite = false;
                break;
            case 1: // grbw
                this.__hasWhite = true;
                break;
        }
    };

    CheeseNeopixel.prototype.setNumLeds = function (value) {
        if (value < 0) value = 0;
        else if (value > 144) value = 144;
        this.__numLeds = value;
    };

    CheeseNeopixel.prototype.__preparePacket = function (cmd) {
        this.__cmdId = (this.__cmdId % 15) + 1;
        const packet = this.__packet;
        packet[0] = this.__hasWhite ? 0x4d : 0x45;
        packet[1] = ((cmd << 4) & 0xf0) | (this.__cmdId & 0x0f);
        for (let i = 2; i < 20; ++i) packet[i] = 0;
        packet[19] = this.__auto ? 1 : 0;
        return packet;
    };

    CheeseNeopixel.prototype.__setRgb = function (from, to, inc, r, g, b) {
        const packet = this.__preparePacket(0);
        if (from > to) {
            packet[2] = inc == 0 ? from : ((from - to) % inc) + to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = inc;
        packet[5] = 0;
        packet[6] = r;
        packet[7] = g;
        packet[8] = b;
        packet[9] = this.__brightness;
    };

    CheeseNeopixel.prototype.__changeRgb = function (from, to, inc, r, g, b) {
        const packet = this.__preparePacket(1);
        if (from > to) {
            packet[2] = inc == 0 ? from : ((from - to) % inc) + to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = inc;
        packet[10] = 0;
        if (r < 0) {
            r = -r;
            packet[10] |= 0x04;
        }
        if (g < 0) {
            g = -g;
            packet[10] |= 0x02;
        }
        if (b < 0) {
            b = -b;
            packet[10] |= 0x01;
        }
        packet[5] = 0;
        packet[6] = r;
        packet[7] = g;
        packet[8] = b;
        packet[9] = this.__brightness;
    };

    CheeseNeopixel.prototype.__clear = function (from, to, inc) {
        const packet = this.__preparePacket(3);
        if (from > to) {
            packet[2] = inc == 0 ? from : ((from - to) % inc) + to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = 0;
        packet[5] = this.__brightness;
        packet[6] = 1;
        packet[7] = inc > 0 ? inc - 1 : inc;
    };

    CheeseNeopixel.prototype.__setPattern = function (from, to, pattern) {
        const packet = this.__preparePacket(3);
        if (from > to) {
            packet[2] = to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = pattern;
        packet[5] = this.__brightness;
        packet[6] = packet[3] - packet[2] + 1;
        packet[7] = 0;
    };

    CheeseNeopixel.prototype.__shift = function (from, to, bit, shift, left) {
        const packet = this.__preparePacket(4);
        if (from > to) {
            packet[2] = to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = bit;
        packet[5] = shift ? 0 : 1;
        packet[6] = left ? 1 : 0;
        packet[7] = this.__brightness;
    };

    CheeseNeopixel.prototype.__setBrightness = function (from, to, inc, perc) {
        this.__brightnessPerc = perc;
        this.__brightness = parseInt(perc * 2.55);
        const packet = this.__preparePacket(2);
        if (from > to) {
            packet[2] = inc == 0 ? from : ((from - to) % inc) + to;
            packet[3] = from;
        } else {
            packet[2] = from;
            packet[3] = to;
        }
        packet[4] = inc;
        packet[5] = this.__brightness;
        packet[6] = 255;
        packet[7] = 255;
        packet[8] = 255;
        packet[9] = 255;
    };

    CheeseNeopixel.prototype.setAllRgb = function (r, g, b) {
        this.__setRgb(0, this.__numLeds - 1, 1, r, g, b);
    };

    CheeseNeopixel.prototype.changeAllRgb = function (r, g, b) {
        this.__changeRgb(0, this.__numLeds - 1, 1, r, g, b);
    };

    CheeseNeopixel.prototype.setAllPattern = function (pattern) {
        this.__setPattern(0, this.__numLeds - 1, pattern);
    };

    CheeseNeopixel.prototype.setRgbAt = function (index, r, g, b) {
        if (index < 0 || index >= this.__numLeds) return false;
        this.__setRgb(index, index, 0, r, g, b);
        return true;
    };

    CheeseNeopixel.prototype.changeRgbAt = function (index, r, g, b) {
        if (index < 0 || index >= this.__numLeds) return false;
        this.__changeRgb(index, index, 0, r, g, b);
        return true;
    };

    CheeseNeopixel.prototype.setPatternAt = function (index, pattern) {
        if (index < 0 || index >= this.__numLeds) return false;
        this.__setPattern(index, index, pattern);
        return true;
    };

    CheeseNeopixel.prototype.setRgbFromTo = function (from, to, interval, r, g, b) {
        if (from < 0 || from >= this.__numLeds) return false;
        if (to < 0 || to >= this.__numLeds) return false;
        if (interval < 0) interval = -interval;
        if (interval >= this.__numLeds) return false;
        if (interval == 0) to = from;
        this.__setRgb(from, to, interval, r, g, b);
        return true;
    };

    CheeseNeopixel.prototype.changeRgbFromTo = function (from, to, interval, r, g, b) {
        if (from < 0 || from >= this.__numLeds) return false;
        if (to < 0 || to >= this.__numLeds) return false;
        if (interval < 0) interval = -interval;
        if (interval >= this.__numLeds) return false;
        if (interval == 0) to = from;
        this.__changeRgb(from, to, interval, r, g, b);
        return true;
    };

    CheeseNeopixel.prototype.setPatternFromTo = function (from, to, pattern) {
        if (from < 0 || from >= this.__numLeds) return false;
        if (to < 0 || to >= this.__numLeds) return false;
        this.__setPattern(from, to, pattern);
        return true;
    };

    CheeseNeopixel.prototype.clearAll = function () {
        this.__preparePacket(5);
    };

    CheeseNeopixel.prototype.clearAt = function (index) {
        if (index < 0 || index >= this.__numLeds) return false;
        this.__clear(index, index, 0);
        return true;
    };

    CheeseNeopixel.prototype.clearFromTo = function (from, to, interval) {
        if (from < 0 || from >= this.__numLeds) return false;
        if (to < 0 || to >= this.__numLeds) return false;
        if (interval < 0) interval = -interval;
        if (interval >= this.__numLeds) return false;
        if (interval >= 127) return false;
        if (interval == 0) to = from;
        this.__clear(from, to, interval);
        return true;
    };

    CheeseNeopixel.prototype.shiftAll = function (bit) {
        if (bit == 0) return false;
        if (bit < 0) {
            if (bit < -143) return false;
            this.__shift(0, this.__numLeds - 1, -bit, true, true);
        } else {
            if (bit > 143) return false;
            this.__shift(0, this.__numLeds - 1, bit, true, false);
        }
        return true;
    };

    CheeseNeopixel.prototype.rotateAll = function (bit) {
        if (bit == 0) return false;
        if (bit < 0) {
            if (bit < -143) return false;
            this.__shift(0, this.__numLeds - 1, -bit, false, true);
        } else {
            if (bit > 143) return false;
            this.__shift(0, this.__numLeds - 1, bit, false, false);
        }
        return true;
    };

    CheeseNeopixel.prototype.changeBrightnessBy = function (value) {
        value += this.__brightnessPerc;
        if (value < 0) value = 0;
        else if (value > 100) value = 100;
        this.__setBrightness(0, this.__numLeds - 1, 1, value);
    };

    CheeseNeopixel.prototype.setBrightnessTo = function (value) {
        if (value < 0) value = 0;
        else if (value > 100) value = 100;
        this.__setBrightness(0, this.__numLeds - 1, 1, value);
    };

    function CheesePid() {
        this.__buttonChecker1 = new CheeseButtonChecker();
        this.__buttonChecker2 = new CheeseButtonChecker();
        this.reset();
    }

    CheesePid.prototype.reset = function () {
        this.__distance = 0;
        this.__time = 0;
        this.__temperature = 0;
        this.__humidity = 0;
        this.__x1 = 0;
        this.__y1 = 0;
        this.__x2 = 0;
        this.__y2 = 0;
        this.__button1 = 0;
        this.__button2 = 0;
        this.__buttonChecker1.reset();
        this.__buttonChecker2.reset();
        this.__encoder = 0;
    };

    CheesePid.prototype.clearEvent = function () {
        this.__buttonChecker1.clearEvent();
        this.__buttonChecker2.clearEvent();
    };

    CheesePid.prototype.handleSensory = function (modePid, recv) {
        switch (modePid) {
            case 10: // ultrasonic
                this.__distance = (((recv[1] & 0xff) << 8) | (recv[2] & 0xff)) / 10.0;
                this.__time = ((recv[3] & 0xff) << 8) | (recv[4] & 0xff);
                break;
            case 11: // dht
                this.__humidity = (((recv[1] & 0xff) << 8) | (recv[2] & 0xff)) / 10.0;
                this.__temperature = (((recv[4] & 0xff) << 8) | (recv[5] & 0xff)) / 10.0;
                if (recv[3] > 0) this.__temperature = -this.__temperature;
                break;
            case 12: // ds18b20
                this.__temperature = (((recv[2] & 0xff) << 8) | (recv[3] & 0xff)) / 100.0;
                if (recv[1] > 0) this.__temperature = -this.__temperature;
                break;
            case 13: // joystick + button
                this.__x1 = recv[1];
                this.__y1 = recv[2];
                this.__button1 = recv[4];
                this.__button2 = recv[3];
                this.__buttonChecker1.check(this.__button1 == 1);
                this.__buttonChecker2.check(this.__button2 == 1);
                break;
            case 14: // dual joystick
                this.__x1 = recv[4];
                this.__y1 = recv[5];
                this.__button1 = recv[3];
                this.__x2 = recv[1];
                this.__y2 = recv[2];
                this.__button2 = recv[6];
                this.__buttonChecker1.check(this.__button1 == 1);
                this.__buttonChecker2.check(this.__button2 == 1);
                break;
            case 15: // ir transceiver
                break;
            case 16: {
                // encoder
                this.__button1 = 1 - recv[1];
                let val = (((recv[2] & 0xff) << 8) | (recv[3] & 0xff)) & 0x7ff;
                if (val > 0x3ff) val -= 0x800;
                this.__encoder = val;
                this.__buttonChecker1.check(this.__button1 == 1);
                break;
            }
        }
    };

    CheesePid.prototype.getDistance = function () {
        return this.__distance;
    };

    CheesePid.prototype.getTime = function () {
        return this.__time;
    };

    CheesePid.prototype.getTemperature = function () {
        return this.__temperature;
    };

    CheesePid.prototype.getHumidity = function () {
        return this.__humidity;
    };

    CheesePid.prototype.getX1 = function () {
        return this.__x1;
    };

    CheesePid.prototype.getY1 = function () {
        return this.__y1;
    };

    CheesePid.prototype.getX2 = function () {
        return this.__x2;
    };

    CheesePid.prototype.getY2 = function () {
        return this.__y2;
    };

    CheesePid.prototype.getButton1 = function () {
        return this.__button1;
    };

    CheesePid.prototype.getButton2 = function () {
        return this.__button2;
    };

    CheesePid.prototype.isButton1Clicked = function () {
        return this.__buttonChecker1.isClicked();
    };

    CheesePid.prototype.isButton2Clicked = function () {
        return this.__buttonChecker2.isClicked();
    };

    CheesePid.prototype.isButton1LongPressed = function () {
        return this.__buttonChecker1.isLongPressed();
    };

    CheesePid.prototype.isButton2LongPressed = function () {
        return this.__buttonChecker2.isLongPressed();
    };

    CheesePid.prototype.getEncoder = function () {
        return this.__encoder;
    };

    function CheeseHat010(sendPacket) {
        this.__sendPacket = sendPacket;
        this.__ledMatrix = new CheeseHatColorLedMatrix(10, 5);
        this.__buttonCheckerA = new CheeseButtonChecker();
        this.__buttonCheckerB = new CheeseButtonChecker();
        this.reset();
    }

    CheeseHat010.prototype.reset = function () {
        // mandatory
        this.__waiting = false;
        this.__requestId = 0;
        this.__requestPrevId = 0;
        this.__buttonA = 0;
        this.__buttonB = 0;
        this.__ledMatrix.reset();
        this.__buttonCheckerA.reset();
        this.__buttonCheckerB.reset();
    };

    CheeseHat010.prototype.clearEvent = function () {
        // mandatory
        this.__buttonCheckerA.clearEvent();
        this.__buttonCheckerB.clearEvent();
    };

    CheeseHat010.prototype.getPacket = function () {
        // mandatory
        return this.__ledMatrix.getPacket();
    };

    CheeseHat010.prototype.getLedMatrix = function () {
        return this.__ledMatrix;
    };

    CheeseHat010.prototype.getButtonA = function () {
        return this.__buttonA;
    };

    CheeseHat010.prototype.getButtonB = function () {
        return this.__buttonB;
    };

    CheeseHat010.prototype.isButtonAClicked = function () {
        return this.__buttonCheckerA.isClicked();
    };

    CheeseHat010.prototype.isButtonBClicked = function () {
        return this.__buttonCheckerB.isClicked();
    };

    CheeseHat010.prototype.isButtonALongPressed = function () {
        return this.__buttonCheckerA.isLongPressed();
    };

    CheeseHat010.prototype.isButtonBLongPressed = function () {
        return this.__buttonCheckerB.isLongPressed();
    };

    CheeseHat010.prototype.issueMatrixUpdate = function () {
        this.__ledMatrix.update();
        this.__requestId = (this.__requestId % 255) + 1;
    };

    CheeseHat010.prototype.handleSensory = function (recv) {
        // mandatory
        this.__buttonA = 1 - recv[2];
        this.__buttonB = 1 - recv[3];
        this.__buttonCheckerA.check(this.__buttonA == 1);
        this.__buttonCheckerB.check(this.__buttonB == 1);
    };

    CheeseHat010.prototype.handleRequest = function (sent) {
        if (this.__waiting && sent) this.__waiting = false;
        if (!this.__waiting) {
            if (this.__requestId != this.__requestPrevId) {
                this.__requestPrevId = this.__requestId;
                const packet = this.__ledMatrix.getPacket();
                if (packet) {
                    this.__sendPacket(packet);
                }
            }
        }
    };

    function CheeseHat(sendPacket) {
        this.__sendPacket = sendPacket;
        this.__id = -1;
        this.__hat = undefined;
    }

    CheeseHat.prototype.__createHat = function (id) {
        this.__hat = undefined;
        switch (id) {
            case 10:
                this.__hat = new CheeseHat010(this.__sendPacket);
                break;
        }
        if (this.__hat) this.__id = id;
        return this.__hat;
    };

    CheeseHat.prototype.getHat = function (id) {
        if (id == this.__id) return this.__hat;
    };

    CheeseHat.prototype.reset = function () {
        if (this.__hat) this.__hat.reset();
        this.__id = -1;
        this.__hat = undefined;
    };

    CheeseHat.prototype.start = function (id) {
        let hat = this.getHat(id);
        if (!hat) {
            hat = this.__createHat(id);
            if (hat) {
                this.__sendPacket(hat.getPacket());
            }
        }
    };

    CheeseHat.prototype.end = function () {
        const hat = this.__hat;
        this.reset();
        if (hat) {
            this.__sendPacket(hat.getPacket());
        }
    };

    CheeseHat.prototype.clearEvent = function () {
        if (this.__hat) this.__hat.clearEvent();
    };

    CheeseHat.prototype.handleSensory = function (recv) {
        if (recv && (recv[0] & 0xf0) == 0x20) {
            const id = ((recv[1] & 0xff) << 4) | (recv[0] & 0x0f);
            if (id == this.__id && this.__hat) {
                this.__hat.handleSensory(recv);
            }
        }
    };

    CheeseHat.prototype.handleRequest = function (sent) {
        if (this.__hat && this.__hat.handleRequest) this.__hat.handleRequest(sent);
    };

    /**CheeseRobot**/
    function CheeseRobot(index) {
        const self = this;
        self.sensory = {
            signalStrength: 0,
            accelerationX: 0,
            accelerationY: 0,
            accelerationZ: 0,
            internalTemperature: 0,
            inputSa: 0,
            inputSb: 0,
            inputSc: 0,
            inputLa: 0,
            inputLb: 0,
            inputLc: 0,
            tilt: 0,
            stepCount: 0,
            batteryState: 2,
        };
        self.motoring = {
            group: 'cheese',
            module: 'cheese',
            index,
        };
        self.stepId = 0;
        self.soundId = 0;
        self.writeHatId = 0;
        self.writePidId = 0;
        self.writeNeopixelId = 0;
        self.pulseScId = -1;
        self.pulseLcId = -1;
        self.freeFallId = -1;
        self.tapId = -1;
        self.stepStateId = -1;
        self.soundStateId = -1;
        self.hatStateId = -1;
        self.pidStateId = -1;
        self.neopixelStateId = -1;
        self.readHatId = -1;
        self.readPidId = -1;

        self.blockId = 0;
        self.stepMode = 0x90; // sw wave
        self.stepCallback = undefined;
        self.soundCallback = undefined;
        self.noteBlockId = 0;
        self.noteTimer1 = undefined;
        self.noteTimer2 = undefined;
        self.writeSerialCallbacks = [];
        self.readSerialCallbacks = [];
        self.serialInput = '';
        self.serialDelimiter = 0;
        self.serialPin = 2;
        self.serialRate = 0;
        self.serialSendId = 0;
        self.serialRecvId = -1;
        self.neopixelCallback = undefined;
        self.pulseSc = false;
        self.pulseLc = false;
        self.freeFall = false;
        self.tap = false;
        self.modeMab = 0;
        self.resetEncoderFlag = 0;
        self.tempo = 60;
        self.range = new CheeseRange();
        self.buttonCounter = new CheeseButtonCounter();
        self.buttonChecker = {};
        self.leds = {
            S: new CheeseLed('S'),
            L: new CheeseLed('L'),
        };
        self.pid = new CheesePid();
        self.hat = new CheeseHat((packet) => {
            if (packet) {
                self.motoring.writeHat = packet;
                self.__issueHat();
            }
        });
        self.neopixel = new CheeseNeopixel();
        self.writeQueue = new RoboidWriteQueue(64);
        self.readQueue = new RoboidReadQueue(64);
        self.timeouts = [];
    }

    CheeseRobot.prototype.__PORT_MAP = {
        group: 'cheese',
        module: 'cheese',
        outputSa: 0,
        outputSb: 0,
        outputSc: 0,
        outputLa: 0,
        outputLb: 0,
        outputLc: 0,
        outputMab: 0,
        outputMcd: 0,
        buzzer: 0,
        velocity: 0,
        step: 0,
        stepId: 0,
        note: 0,
        sound: 0,
        soundRepeat: 1,
        soundId: 0,
        modeSa: 0,
        modeSb: 0,
        modeSc: 0,
        modeLa: 0,
        modeLb: 0,
        modeLc: 0,
        modeMab: 0,
        modeMcd: 0,
        modePid: 0,
        modeExt: 0,
    };

    CheeseRobot.prototype.setZero = function () {
        const portMap = this.__PORT_MAP;
        const motoring = this.motoring;
        for (const port in portMap) {
            motoring[port] = portMap[port];
        }
        this.stepId = 0;
        this.soundId = 0;
        this.writeHatId = 0;
        this.writePidId = 0;
        this.writeNeopixelId = 0;
        this.pulseScId = -1;
        this.pulseLcId = -1;
        this.freeFallId = -1;
        this.tapId = -1;
        this.stepStateId = -1;
        this.soundStateId = -1;
        this.hatStateId = -1;
        this.pidStateId = -1;
        this.neopixelStateId = -1;
        this.readHatId = -1;
        this.readPidId = -1;

        this.blockId = 0;
        this.stepMode = 0x90; // sw wave
        this.stepCallback = undefined;
        this.soundCallback = undefined;
        this.noteBlockId = 0;
        this.noteTimer1 = undefined;
        this.noteTimer2 = undefined;
        this.writeSerialCallbacks = [];
        this.readSerialCallbacks = [];
        this.serialInput = '';
        this.serialDelimiter = 0;
        this.serialPin = 2;
        this.serialRate = 0;
        this.serialRecvId = -1;
        this.neopixelCallback = undefined;
        this.pulseSc = false;
        this.pulseLc = false;
        this.freeFall = false;
        this.tap = false;
        this.modeMab = 0;
        this.tempo = 60;

        this.range.reset();
        this.buttonCounter.reset();
        this.buttonChecker = {};
        for (const i in this.leds) {
            this.leds[i].reset();
        }
        this.pid.reset();
        this.hat.end();
        this.__cancelNeopixel();
        this.__setNeopixel(this.neopixel.end());
        this.__removeAllTimeouts();
        this.writeQueue.reset();
        this.readQueue.reset();
    };

    CheeseRobot.prototype.afterReceive = function (pd) {
        this.sensory = pd;
        this.handleSensory();
    };

    CheeseRobot.prototype.afterSend = function (sq) {
        this.pulseSc = false;
        this.pulseLc = false;
        this.freeFall = false;
        this.tap = false;
        let bc;
        for (const i in this.buttonChecker) {
            bc = this.buttonChecker[i];
            if (bc) bc.clearEvent();
        }
        this.pid.clearEvent();
        this.hat.clearEvent();
    };

    CheeseRobot.prototype.setMotoring = function (motoring) {
        this.motoring = motoring;
    };

    CheeseRobot.prototype.__setModule = function () {
        this.motoring.group = 'cheese';
        this.motoring.module = 'cheese';
    };

    CheeseRobot.prototype.__removeTimeout = function (id) {
        clearTimeout(id);
        const idx = this.timeouts.indexOf(id);
        if (idx >= 0) {
            this.timeouts.splice(idx, 1);
        }
    };

    CheeseRobot.prototype.__removeAllTimeouts = function () {
        const timeouts = this.timeouts;
        for (const i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    };

    CheeseRobot.prototype.__fireWriteSerialCallbacks = function () {
        const callbacks = this.writeSerialCallbacks;
        for (const i in callbacks) {
            callbacks[i]();
        }
        this.writeSerialCallbacks = [];
    };

    CheeseRobot.prototype.__fireReadSerialCallbacks = function () {
        const callbacks = this.readSerialCallbacks;
        for (const i in callbacks) {
            callbacks[i]();
        }
        this.readSerialCallbacks = [];
    };

    CheeseRobot.prototype.__setStep = function (step) {
        this.stepId = (this.stepId % 255) + 1;
        this.motoring.step = step;
        this.motoring.stepId = this.stepId;
    };

    CheeseRobot.prototype.__cancelStep = function () {
        this.stepCallback = undefined;
    };

    CheeseRobot.prototype.__setNote = function (note) {
        this.motoring.note = note;
    };

    CheeseRobot.prototype.__issueNoteBlockId = function () {
        this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
        return this.noteBlockId;
    };

    CheeseRobot.prototype.__cancelNote = function () {
        this.noteBlockId = 0;
        if (this.noteTimer1 !== undefined) {
            this.__removeTimeout(this.noteTimer1);
        }
        if (this.noteTimer2 !== undefined) {
            this.__removeTimeout(this.noteTimer2);
        }
        this.noteTimer1 = undefined;
        this.noteTimer2 = undefined;
    };

    CheeseRobot.prototype.__setSound = function (sound) {
        this.soundId = (this.soundId % 255) + 1;
        this.motoring.sound = sound;
        this.motoring.soundId = this.soundId;
    };

    CheeseRobot.prototype.__runSound = function (sound, count) {
        if (typeof count != 'number') count = 1;
        if (count < 0) count = -1;
        if (count) {
            this.motoring.soundRepeat = count;
            this.__setSound(sound);
        }
    };

    CheeseRobot.prototype.__cancelSound = function () {
        this.soundCallback = undefined;
    };

    CheeseRobot.prototype.__setModeSa = function (mode) {
        this.motoring.modeSa = mode;
    };

    CheeseRobot.prototype.__setModeSb = function (mode) {
        this.motoring.modeSb = mode;
    };

    CheeseRobot.prototype.__setModeSc = function (mode) {
        this.motoring.modeSc = mode;
    };

    CheeseRobot.prototype.__setModeLa = function (mode) {
        this.motoring.modeLa = mode;
    };

    CheeseRobot.prototype.__setModeLb = function (mode) {
        this.motoring.modeLb = mode;
    };

    CheeseRobot.prototype.__setModeLc = function (mode) {
        this.motoring.modeLc = mode;
    };

    CheeseRobot.prototype.__setModeMab = function (mode) {
        this.modeMab = mode;
        this.motoring.modeMab = mode;
    };

    CheeseRobot.prototype.__setModeMcd = function (mode) {
        this.motoring.modeMcd = mode;
    };

    CheeseRobot.prototype.__setModePid = function (mode) {
        this.motoring.modePid = mode;
    };

    CheeseRobot.prototype.__setSerialModePid = function () {
        this.motoring.outputLa = ((this.serialPin & 0x3) << 4) | (this.serialRate & 0x7);
        this.__setModeLa(255);
        this.__setModePid(0x03); // serial
    };

    CheeseRobot.prototype.__setModeExt = function (mode) {
        this.motoring.modeExt = mode;
    };

    CheeseRobot.prototype.__issueHat = function () {
        this.writeHatId = (this.writeHatId % 255) + 1;
        this.motoring.writeHatId = this.writeHatId;
    };

    CheeseRobot.prototype.__getOrCreateWritePidArray = function () {
        const motoring = this.motoring;
        if (motoring.writePid == undefined) {
            motoring.writePid = new Array(20);
            for (let i = 0; i < 20; ++i) motoring.writePid[i] = 0;
        }
        return motoring.writePid;
    };

    CheeseRobot.prototype.__issuePid = function () {
        this.writePidId = (this.writePidId % 255) + 1;
        this.motoring.writePidId = this.writePidId;
    };

    CheeseRobot.prototype.__setSerial = function (arr) {
        var pid = this.__getOrCreateWritePidArray();
        this.serialSendId = (this.serialSendId % 15) + 1;
        pid[0] = 0x30 | (this.serialSendId & 0x0f);
        for (let i = 1, j = 0; i < 20; ++i, ++j) {
            pid[i] = arr[j];
        }
        this.__issuePid();
    };

    CheeseRobot.prototype.__setNeopixel = function (packet) {
        this.__setModeSa(0x08); // neopixel output
        this.motoring.writeNeopixel = packet;
        this.__issueNeopixel();
    };

    CheeseRobot.prototype.__issueNeopixel = function () {
        this.writeNeopixelId = (this.writeNeopixelId % 255) + 1;
        this.motoring.writeNeopixelId = this.writeNeopixelId;
    };

    CheeseRobot.prototype.__cancelNeopixel = function () {
        this.neopixelCallback = undefined;
    };

    CheeseRobot.prototype.__isNeopixelIdle = function () {
        return this.neopixelCallback === undefined;
    };

    CheeseRobot.prototype.handleSensory = function () {
        const self = this;
        const sensory = self.sensory;

        self.pulseSc = sensory.pulseSc == 1;
        self.pulseLc = sensory.pulseLc == 1;
        self.freeFall = sensory.freeFall == 1;
        self.tap = sensory.tap == 1;

        if (self.stepCallback) {
            if (sensory.stepStateId != self.stepStateId) {
                self.stepStateId = sensory.stepStateId;
                if (sensory.stepState == 0) {
                    self.motoring.velocity = 0;
                    var callback = self.stepCallback;
                    self.__cancelStep();
                    if (callback) callback();
                }
            }
        }
        if (self.soundCallback) {
            if (sensory.soundStateId != self.soundStateId) {
                self.soundStateId = sensory.soundStateId;
                if (sensory.soundState == 0) {
                    var callback = self.soundCallback;
                    self.__cancelSound();
                    if (callback) callback();
                }
            }
        }
        self.buttonCounter.tick();
        let bc;
        for (const i in self.buttonChecker) {
            bc = self.buttonChecker[i];
            if (bc) {
                if (self.buttonCounter.isCounting(i)) {
                    bc.check(false);
                } else {
                    bc.check(sensory['input' + i] == 1);
                }
            }
        }

        if (sensory.readPidId != self.readPidId) {
            if (self.readPidId >= 0) {
                const recv = sensory.readPid;
                if (recv && (recv[0] & 0xf0) == 0x30) {
                    const id = recv[0] & 0x0f;
                    if (self.motoring.modePid == 3) {
                        // serial
                        if (id != self.serialRecvId) {
                            if (self.serialRecvId != -1) {
                                self.readQueue.push(recv, 1);
                            }
                            self.serialRecvId = id;
                        }
                    } else if (id > 0) {
                        self.pid.handleSensory(self.motoring.modePid, recv);
                    }
                }
            }
            self.readPidId = sensory.readPidId;
        }
        if (sensory.readHatId != self.readHatId) {
            if (self.readHatId >= 0) {
                self.hat.handleSensory(sensory.readHat);
            }
            self.readHatId = sensory.readHatId;
        }
        let hatSent = false;
        if (sensory.hatStateId != self.hatStateId) {
            self.hatStateId = sensory.hatStateId;
            if (sensory.hatState == 1) {
                hatSent = true;
            }
        }
        this.hat.handleRequest(hatSent);
        if (sensory.pidStateId != self.pidStateId) {
            self.pidStateId = sensory.pidStateId;
            if (sensory.pidState == 1) {
                const tmp = self.writeQueue.pop();
                if (self.motoring.modePid == 3) {
                    // serial
                    if (tmp) {
                        self.__setSerial(tmp);
                    } else {
                        self.__fireWriteSerialCallbacks();
                    }
                }
            }
        }
        if (sensory.neopixelStateId != self.neopixelStateId) {
            self.neopixelStateId = sensory.neopixelStateId;
            if (sensory.neopixelState == 1) {
                const callback = self.neopixelCallback;
                self.__cancelNeopixel();
                if (callback) callback();
            }
        }
        if (self.readSerialCallbacks.length > 0) {
            const tmp = self.readQueue.pop(self.serialDelimiter);
            if (tmp && self.motoring.modePid == 3) {
                // serial
                self.serialInput = tmp;
                self.__fireReadSerialCallbacks();
            }
        }
    };

    CheeseRobot.prototype.__SENSORS = {
        SIGNAL_STRENGTH: 'signalStrength',
        ACCELERATION_X: 'accelerationX',
        ACCELERATION_Y: 'accelerationY',
        ACCELERATION_Z: 'accelerationZ',
    };

    CheeseRobot.prototype.getValue = function (script) {
        this.__setModule();
        const dev = script.getField('DEVICE');

        const sensor = this.__SENSORS[dev] || dev;
        return this.sensory[sensor];
    };

    CheeseRobot.prototype.checkBoolean = function (script) {
        this.__setModule();
        const dev = script.getField('DEVICE');
        switch (dev) {
            case 'TILT_FORWARD':
                return this.sensory.tilt == 1;
            case 'TILT_BACKWARD':
                return this.sensory.tilt == -1;
            case 'TILT_LEFT':
                return this.sensory.tilt == 2;
            case 'TILT_RIGHT':
                return this.sensory.tilt == -2;
            case 'TILT_FLIP':
                return this.sensory.tilt == 3;
            case 'TILT_NOT':
                return this.sensory.tilt == -3;
            case 'TAP':
                return this.tap;
            case 'FREE_FALL':
                return this.freeFall;
            case 'BATTERY_NORMAL':
                return this.sensory.batteryState === 2;
            case 'BATTERY_LOW':
                return this.sensory.batteryState === 1;
            case 'BATTERY_EMPTY':
                return this.sensory.batteryState === 0;
        }
        return false;
    };

    CheeseRobot.prototype.__SOUNDS = {
        BEEP: 1,
        RANDOM_BEEP: 2,
        NOISE: 10,
        SIREN: 3,
        ENGINE: 4,
        CHOP: 11,
        ROBOT: 5,
        DIBIDIBIDIP: 8,
        GOOD_JOB: 9,
        HAPPY: 12,
        ANGRY: 13,
        SAD: 14,
        SLEEP: 15,
        MARCH: 6,
        BIRTHDAY: 7,
    };

    CheeseRobot.prototype.playSound = function (script) {
        this.__setModule();
        this.__cancelNote();
        this.__cancelSound();

        let sound = script.getField('SOUND');
        let count = script.getNumberValue('COUNT');

        sound = this.__SOUNDS[sound];
        count = parseInt(count);
        this.motoring.buzzer = 0;
        this.__setNote(0);
        if (sound && count) {
            this.__runSound(sound, count);
        } else {
            this.__runSound(0);
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.playSoundUntil = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isPlaying = true;
            this.__cancelNote();
            this.__cancelSound();

            let sound = script.getField('SOUND');
            let count = script.getNumberValue('COUNT');

            sound = this.__SOUNDS[sound];
            count = parseInt(count);
            this.motoring.buzzer = 0;
            this.__setNote(0);
            if (sound && count) {
                this.__runSound(sound, count);
                this.soundCallback = function () {
                    script.isPlaying = false;
                };
            } else {
                this.__runSound(0);
                script.isPlaying = false;
            }
            return script;
        } else if (script.isPlaying) {
            return script;
        } else {
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.setBuzzer = function (script) {
        this.__setModule();
        this.__cancelNote();
        this.__cancelSound();
        let hz = script.getNumberValue('HZ');

        hz = parseFloat(hz);
        if (typeof hz == 'number') {
            this.motoring.buzzer = hz;
        }
        this.__setNote(0);
        this.__runSound(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.changeBuzzer = function (script) {
        this.__setModule();
        this.__cancelNote();
        this.__cancelSound();
        let hz = script.getNumberValue('HZ');

        hz = parseFloat(hz);
        if (typeof hz == 'number') {
            const motoring = this.motoring;
            motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
        }
        this.__setNote(0);
        this.__runSound(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.clearSound = function (script, motoring) {
        this.__setModule();
        this.__cancelNote();
        this.__cancelSound();

        this.motoring.buzzer = 0;
        this.__setNote(0);
        this.__runSound(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.__NOTES = {
        C: 4,
        'C#': 5,
        Db: 5,
        D: 6,
        'D#': 7,
        Eb: 7,
        E: 8,
        F: 9,
        'F#': 10,
        Gb: 10,
        G: 11,
        'G#': 12,
        Ab: 12,
        A: 13,
        'A#': 14,
        Bb: 14,
        B: 15,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13,
        14: 14,
        15: 15,
    };

    CheeseRobot.prototype.playNote = function (script) {
        this.__setModule();
        this.__cancelNote();
        this.__cancelSound();

        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        this.motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8) {
            note += (octave - 1) * 12;
            this.__setNote(note);
        } else {
            this.__setNote(0);
        }
        this.__runSound(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.playNoteBeat = function (script) {
        const self = this;
        self.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isPlaying = true;
            self.__cancelNote();
            self.__cancelSound();

            let note = script.getField('NOTE');
            let octave = script.getNumberField('OCTAVE');
            let beat = script.getNumberValue('BEAT');

            note = parseInt(this.__NOTES[note]);
            octave = parseInt(octave);
            beat = parseFloat(beat);
            self.motoring.buzzer = 0;
            if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
                const id = self.__issueNoteBlockId();
                note += (octave - 1) * 12;
                self.__setNote(note);
                const timeValue = (beat * 60 * 1000) / self.tempo;
                if (timeValue > 100) {
                    self.noteTimer1 = setTimeout(() => {
                        if (self.noteBlockId == id) {
                            self.__setNote(0);
                            if (self.noteTimer1 !== undefined) {
                                self.__removeTimeout(self.noteTimer1);
                            }
                            self.noteTimer1 = undefined;
                        }
                    }, timeValue - 100);
                    self.timeouts.push(self.noteTimer1);
                }
                self.noteTimer2 = setTimeout(() => {
                    if (self.noteBlockId == id) {
                        self.__setNote(0);
                        self.__cancelNote();
                        script.isPlaying = false;
                    }
                }, timeValue);
                self.timeouts.push(self.noteTimer2);
                self.__runSound(0);
            } else {
                self.__setNote(0);
                self.__runSound(0);
                script.isPlaying = false;
            }
            return script;
        } else if (script.isPlaying) {
            return script;
        } else {
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            self.__setNote(0);
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.restBeat = function (script) {
        const self = this;
        self.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isPlaying = true;
            self.__cancelNote();
            self.__cancelSound();
            let beat = script.getNumberValue('BEAT');

            beat = parseFloat(beat);
            self.motoring.buzzer = 0;
            self.__setNote(0);
            self.__runSound(0);
            if (beat && beat > 0 && self.tempo > 0) {
                const id = self.__issueNoteBlockId();
                const timeValue = (beat * 60 * 1000) / self.tempo;
                self.noteTimer1 = setTimeout(() => {
                    if (self.noteBlockId == id) {
                        self.__cancelNote();
                        script.isPlaying = false;
                    }
                }, timeValue);
                self.timeouts.push(self.noteTimer1);
            } else {
                script.isPlaying = false;
            }
            return script;
        } else if (script.isPlaying) {
            return script;
        } else {
            delete script.isStart;
            delete script.isPlaying;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.setTempo = function (script) {
        this.__setModule();
        let bpm = script.getNumberValue('BPM');

        bpm = parseFloat(bpm);
        if (typeof bpm == 'number') {
            this.tempo = bpm;
            if (this.tempo < 1) {
                this.tempo = 1;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.changeTempo = function (script) {
        this.__setModule();
        let bpm = script.getNumberValue('BPM');

        bpm = parseFloat(bpm);
        if (typeof bpm == 'number') {
            this.tempo += bpm;
            if (this.tempo < 1) {
                this.tempo = 1;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setSoundPort = function (script) {
        this.__setModule();
        const port = script.getField('PORT');

        if (port == 'INTERNAL') {
            this.motoring.modeMab = this.modeMab;
        } else {
            this.motoring.modeMab = 0x03; // sound out
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__LITERAL_TO_PORT = {
        SA: 'Sa',
        SB: 'Sb',
        SC: 'Sc',
        LA: 'La',
        LB: 'Lb',
        LC: 'Lc',
        MAB: 'Mab',
        MCD: 'Mcd',
        MABC: 'Mabc',
    };

    CheeseRobot.prototype.__INPUT_SL_MODES = {
        MAKEY: 0x00,
        BUTTON: 0x90,
        DIGITAL_PULL_UP: 0x10,
        DIGITAL_PULL_DOWN: 0x20,
        PULSE: 0x04,
        PULSE_PULL_UP: 0x14,
        PULSE_PULL_DOWN: 0x24,
        ANALOG: 0x01,
        VOLTAGE: 0xc1,
    };

    CheeseRobot.prototype.setInputModeTo = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let mode = script.getField('MODE');

        mode = this.__INPUT_SL_MODES[mode];
        if (mode == 0x90) {
            this.buttonCounter.setCount(port, 10);
            this.buttonChecker[port] = new CheeseButtonChecker();
        } else {
            this.buttonCounter.setCount(port, 0);
        }
        switch (port) {
            case 'Sa':
                this.__setModeSa(mode);
                break;
            case 'Sb':
                this.__setModeSb(mode);
                break;
            case 'Sc':
                this.__setModeSc(mode);
                break;
            case 'La':
                this.__setModeLa(mode);
                break;
            case 'Lb':
                this.__setModeLb(mode);
                break;
            case 'Lc':
                this.__setModeLc(mode);
                break;
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setInputRangeTo = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let low1 = script.getNumberValue('LOW1');
        let high1 = script.getNumberValue('HIGH1');
        let low2 = script.getNumberValue('LOW2');
        let high2 = script.getNumberValue('HIGH2');
        const decimal = script.getField('DECIMAL');

        low1 = parseFloat(low1);
        high1 = parseFloat(high1);
        low2 = parseFloat(low2);
        high2 = parseFloat(high2);
        if (
            typeof low1 == 'number' &&
            typeof high1 == 'number' &&
            typeof low2 == 'number' &&
            typeof high2 == 'number'
        ) {
            this.range.setLowHigh(port, low1, high1, low2, high2, decimal == 'REAL');
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setThreeInputRangesTo = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let low1 = script.getNumberValue('LOW1');
        let mid1 = script.getNumberValue('MIDDLE1');
        let high1 = script.getNumberValue('HIGH1');
        let low2 = script.getNumberValue('LOW2');
        let mid2 = script.getNumberValue('MIDDLE2');
        let high2 = script.getNumberValue('HIGH2');
        const decimal = script.getField('DECIMAL');

        low1 = parseFloat(low1);
        mid1 = parseFloat(mid1);
        high1 = parseFloat(high1);
        low2 = parseFloat(low2);
        mid2 = parseFloat(mid2);
        high2 = parseFloat(high2);
        if (
            typeof low1 == 'number' &&
            typeof mid1 == 'number' &&
            typeof high1 == 'number' &&
            typeof low2 == 'number' &&
            typeof mid2 == 'number' &&
            typeof high2 == 'number'
        ) {
            this.range.setLowMidHigh(port, low1, mid1, high1, low2, mid2, high2, decimal == 'REAL');
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__PORT_TO_INPUTS = {
        Sa: 'inputSa',
        Sb: 'inputSb',
        Sc: 'inputSc',
        La: 'inputLa',
        Lb: 'inputLb',
        Lc: 'inputLc',
    };

    CheeseRobot.prototype.getAnalogInput = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];

        const dev = this.__PORT_TO_INPUTS[port];
        if (dev) {
            let val = this.sensory[dev];
            if (this.buttonCounter.isCounting(port)) val = 0;
            return this.range.calc(port, val);
        }
        return 0;
    };

    CheeseRobot.prototype.checkDigitalInput = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        const value = Number(script.getField('VALUE'));

        const dev = this.__PORT_TO_INPUTS[port];
        if (dev) {
            let val = this.sensory[dev];
            if (this.buttonCounter.isCounting(port)) val = 0;
            return val === parseInt(value);
        }
        return false;
    };

    CheeseRobot.prototype.checkButtonState = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        const state = script.getField('STATE');

        if (this.buttonCounter.isCounting(port)) return false;
        const bc = this.buttonChecker[port];
        if (bc) {
            switch (state) {
                case 'CLICKED':
                    return bc.isClicked();
                case 'LONG_PRESSED':
                    return bc.isLongPressed();
            }
        }
        return false;
    };

    CheeseRobot.prototype.checkPulseInput = function (script) {
        this.__setModule();
        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];

        switch (port) {
            case 'Sc':
                return this.pulseSc;
            case 'Lc':
                return this.pulseLc;
        }
        return false;
    };

    CheeseRobot.prototype.__setDigitalOutputMode = function (port) {
        switch (port) {
            case 'Sa':
                this.__setModeSa(0x82);
                break;
            case 'Sb':
                this.__setModeSb(0x82);
                break;
            case 'Sc':
                this.__setModeSc(0x82);
                break;
            case 'La':
                this.__setModeLa(0x82);
                break;
            case 'Lb':
                this.__setModeLb(0x82);
                break;
            case 'Lc':
                this.__setModeLc(0x82);
                break;
            case 'Mab':
                this.__setModeMab(0x00);
                break;
            case 'Mcd':
                this.__setModeMcd(0x00);
                break;
        }
    };

    CheeseRobot.prototype.__PORT_TO_OUTPUTS = {
        Sa: 'outputSa',
        Sb: 'outputSb',
        Sc: 'outputSc',
        La: 'outputLa',
        Lb: 'outputLb',
        Lc: 'outputLc',
        Mab: 'outputMab',
        Mcd: 'outputMcd',
        Mabc: 'outputMab',
    };

    CheeseRobot.prototype.setDigitalOutput = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = Number(script.getField('VALUE'));

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseInt(value);
            if (typeof value == 'number') {
                this.__setDigitalOutputMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__setPwmOutputMode = function (port) {
        switch (port) {
            case 'Sa':
                this.__setModeSa(0x02);
                break;
            case 'Sb':
                this.__setModeSb(0x02);
                break;
            case 'Sc':
                this.__setModeSc(0x02);
                break;
            case 'La':
                this.__setModeLa(0x02);
                break;
            case 'Lb':
                this.__setModeLb(0x02);
                break;
            case 'Lc':
                this.__setModeLc(0x02);
                break;
        }
    };

    CheeseRobot.prototype.changePwmOutput = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                let val = this.motoring[dev];
                this.__setPwmOutputMode(port);
                this.motoring[dev] = val != undefined ? val + value : value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setPwmOutput = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                this.__setPwmOutputMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__setServoMotorMode = function (port) {
        switch (port) {
            case 'Sa':
                this.__setModeSa(0x03);
                break;
            case 'Sb':
                this.__setModeSb(0x03);
                break;
            case 'Sc':
                this.__setModeSc(0x03);
                break;
            case 'La':
                this.__setModeLa(0x03);
                break;
            case 'Lb':
                this.__setModeLb(0x03);
                break;
            case 'Lc':
                this.__setModeLc(0x03);
                break;
            case 'Mab':
                this.__setModeMab(0x02);
                break;
            case 'Mcd':
                this.__setModeMcd(0x02);
                break;
            case 'Mabc':
                this.__setModeMab(0x40);
                break;
        }
    };

    CheeseRobot.prototype.changeServoMotorAngle = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                let val = this.motoring[dev];
                value = val != undefined ? val + value : value;
                if (value < 1) value = 1;
                else if (value > 180) value = 180;
                this.__setServoMotorMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setServoMotorAngle = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                if (value < 1) value = 1;
                else if (value > 180) value = 180;
                this.__setServoMotorMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.turnOffServoMotor = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            this.__setServoMotorMode(port);
            this.motoring[dev] = 0;
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__setDcMotorMode = function (port) {
        switch (port) {
            case 'Mab':
                this.__setModeMab(0x01);
                break;
            case 'Mcd':
                this.__setModeMcd(0x01);
                break;
        }
    };

    CheeseRobot.prototype.changeDcMotorVelocity = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                let val = this.motoring[dev];
                value = val != undefined ? val + value : value;
                if (value < -100) value = -100;
                else if (value > 100) value = 100;
                this.__setDcMotorMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setDcMotorVelocity = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
        let value = script.getNumberValue('VALUE');

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            value = parseFloat(value);
            if (typeof value == 'number') {
                if (value < -100) value = -100;
                else if (value > 100) value = 100;
                this.__setDcMotorMode(port);
                this.motoring[dev] = value;
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.stopDcMotor = function (script) {
        this.__setModule();

        const port = this.__LITERAL_TO_PORT[script.getField('PORT')];

        const dev = this.__PORT_TO_OUTPUTS[port];
        if (dev) {
            this.__setDcMotorMode(port);
            this.motoring[dev] = 0;
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.rotateStepMotor = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isMoving = true;
            this.__cancelStep();
            this.__setModeMab(this.stepMode);

            let step = script.getNumberValue('STEP');
            let velocity = script.getNumberValue('VELOCITY');

            step = parseInt(step);
            velocity = parseFloat(velocity);

            if (typeof step == 'number' && typeof velocity == 'number') {
                if (velocity < -500) velocity = -500;
                else if (velocity > 500) velocity = 500;
                this.motoring.velocity = velocity;
                this.__setStep(step);
                this.stepCallback = function () {
                    script.isMoving = false;
                };
            } else {
                this.motoring.velocity = 0;
                this.__setStep(0);
                script.isMoving = false;
            }
            return script;
        } else if (script.isMoving) {
            return script;
        } else {
            delete script.isStart;
            delete script.isMoving;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.changeStepMotorVelocity = function (script) {
        this.__setModule();
        this.__cancelStep();
        this.__setModeMab(this.stepMode);

        let velocity = script.getNumberValue('VELOCITY');

        velocity = parseFloat(velocity);
        if (typeof velocity == 'number') {
            let vel = this.motoring.velocity;
            velocity = vel != undefined ? vel + velocity : velocity;
            if (velocity < -500) velocity = -500;
            else if (velocity > 500) velocity = 500;
            this.motoring.velocity = velocity;
        }
        this.__setStep(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.setStepMotorVelocity = function (script) {
        this.__setModule();
        this.__cancelStep();
        this.__setModeMab(this.stepMode);

        let velocity = script.getNumberValue('VELOCITY');

        velocity = parseFloat(velocity);
        if (typeof velocity == 'number') {
            if (velocity < -500) velocity = -500;
            else if (velocity > 500) velocity = 500;
            this.motoring.velocity = velocity;
        }
        this.__setStep(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.stopOffStepMotor = function (script) {
        this.__setModule();
        this.__cancelStep();

        const action = script.getField('ACTION');
        if (action == 'STOP') {
            this.__setModeMab(this.stepMode);
        } else {
            this.__setModeMab(0x80); // sw off
        }
        this.motoring.velocity = 0;
        this.__setStep(0);
        return script.callReturn();
    };

    CheeseRobot.prototype.__MODE_STEP_MOTORS = {
        NORMAL: 0x90,
        POWER: 0xa0,
    };

    CheeseRobot.prototype.setStepMotorMode = function (script) {
        this.__setModule();

        let mode = script.getField('MODE');

        mode = this.__MODE_STEP_MOTORS[mode];
        if (typeof mode == 'number') {
            this.stepMode = mode;
            this.__setModeMab(mode);
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.getStepCount = function (script) {
        this.__setModule();
        return this.sensory.stepCount;
    };

    CheeseRobot.prototype.__RGB_COLORS = {
        DARK: {
            RED: [15, 0, 0],
            ORANGE: [15, 3, 0],
            YELLOW: [15, 15, 0],
            GREEN: [0, 15, 0],
            SKY_BLUE: [0, 15, 15],
            BLUE: [0, 0, 15],
            VIOLET: [3, 0, 15],
            PURPLE: [15, 0, 15],
            WHITE: [15, 15, 15],
        },
        NORMAL: {
            RED: [63, 0, 0],
            ORANGE: [63, 15, 0],
            YELLOW: [63, 63, 0],
            GREEN: [0, 63, 0],
            SKY_BLUE: [0, 63, 63],
            BLUE: [0, 0, 63],
            VIOLET: [15, 0, 63],
            PURPLE: [63, 0, 63],
            WHITE: [63, 63, 63],
        },
        BRIGHT: {
            RED: [255, 0, 0],
            ORANGE: [255, 63, 0],
            YELLOW: [255, 255, 0],
            GREEN: [0, 255, 0],
            SKY_BLUE: [0, 255, 255],
            BLUE: [0, 0, 255],
            VIOLET: [63, 0, 255],
            PURPLE: [255, 0, 255],
            WHITE: [255, 255, 255],
        },
    };

    CheeseRobot.prototype.__setLedMode = function (port) {
        switch (port) {
            case 'S':
                this.__setModeSa(0x02);
                this.__setModeSb(0x02);
                this.__setModeSc(0x02);
                break;
            case 'L':
                this.__setModeLa(0x02);
                this.__setModeLb(0x02);
                this.__setModeLc(0x02);
                break;
        }
    };

    CheeseRobot.prototype.__setLedRgb = function (port, red, green, blue) {
        const led = this.leds[port];
        if (led) {
            led.setRgb(red, green, blue);
            red = parseInt((red * 100) / 255.0);
            green = parseInt((green * 100) / 255.0);
            blue = parseInt((blue * 100) / 255.0);
            if (red < 0) red = 0;
            else if (red > 100) red = 100;
            if (green < 0) green = 0;
            else if (green > 100) green = 100;
            if (blue < 0) blue = 0;
            else if (blue > 100) blue = 100;
            if (led.isAnode()) {
                red = 100 - red;
                green = 100 - green;
                blue = 100 - blue;
            }
            this.__setLedMode(port);
            let dev = this.__PORT_TO_OUTPUTS[led.getPortR()];
            if (dev) this.motoring[dev] = red;
            dev = this.__PORT_TO_OUTPUTS[led.getPortG()];
            if (dev) this.motoring[dev] = green;
            dev = this.__PORT_TO_OUTPUTS[led.getPortB()];
            if (dev) this.motoring[dev] = blue;
        }
    };

    CheeseRobot.prototype.setLedColor = function (script) {
        this.__setModule();

        const port = script.getField('PORT');
        const intensity = script.getField('INTENSITY');
        const color = script.getField('COLOR');

        const rgb = this.__RGB_COLORS[intensity][color];
        if (rgb) {
            this.__setLedRgb(port, rgb[0], rgb[1], rgb[2]);
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setLedRgbArray = function (script) {
        this.__setModule();

        const port = script.getField('PORT');
        const color = script.getField('COLOR');

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this.__setLedRgb(port, r, g, b);
        return script.callReturn();
    };

    CheeseRobot.prototype.changeLedRgb = function (script) {
        this.__setModule();

        const port = script.getField('PORT');
        let red = script.getNumberValue('RED');
        let green = script.getNumberValue('GREEN');
        let blue = script.getNumberValue('BLUE');

        const led = this.leds[port];
        if (led) {
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if (typeof red == 'number' && typeof green == 'number' && typeof blue == 'number') {
                red += led.getR();
                green += led.getG();
                blue += led.getB();
                if (red < 0) red = 0;
                else if (red > 255) red = 255;
                if (green < 0) green = 0;
                else if (green > 255) green = 255;
                if (blue < 0) blue = 0;
                else if (blue > 255) blue = 255;
                this.__setLedRgb(port, red, green, blue);
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.setLedRgb = function (script) {
        this.__setModule();

        const port = script.getField('PORT');
        let red = script.getNumberValue('RED');
        let green = script.getNumberValue('GREEN');
        let blue = script.getNumberValue('BLUE');

        red = parseInt(red);
        green = parseInt(green);
        blue = parseInt(blue);
        if (typeof red == 'number' && typeof green == 'number' && typeof blue == 'number') {
            if (red < 0) red = 0;
            else if (red > 255) red = 255;
            if (green < 0) green = 0;
            else if (green > 255) green = 255;
            if (blue < 0) blue = 0;
            else if (blue > 255) blue = 255;
            this.__setLedRgb(port, red, green, blue);
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.clearLed = function (script) {
        this.__setModule();

        const port = script.getField('PORT');

        this.__setLedRgb(port, 0, 0, 0);
        return script.callReturn();
    };

    CheeseRobot.prototype.setLedType = function (script) {
        this.__setModule();

        const port = script.getField('PORT');
        const type = script.getField('TYPE');

        const led = this.leds[port];
        if (led) {
            led.setType(type);
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__refreshNeopixel = function (callback) {
        const packet = this.neopixel.getPacket();
        if (packet) {
            this.__setNeopixel(packet);
            this.neopixelCallback = callback;
        } else {
            callback();
        }
    };

    CheeseRobot.prototype.__NEOPIXEL_TYPES = {
        GRB: 0,
        GRBW: 1,
    };

    CheeseRobot.prototype.neopixelSetNumberAndType = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let number = script.getNumberValue('NUMBER');
                let type = script.getField('TYPE');

                number = parseInt(number);
                type = this.__NEOPIXEL_TYPES[type];
                if (typeof number == 'number' && typeof type == 'number') {
                    this.neopixel.setNumLeds(number);
                    this.neopixel.setType(type);

                    this.neopixel.clearAll();
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetAllColor = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                const color = script.getField('COLOR');

                const rgb = this.__RGB_COLORS['BRIGHT'][color];
                if (rgb) {
                    this.neopixel.setAllRgb(rgb[0], rgb[1], rgb[2]);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetAllRgbArray = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                const color = script.getField('COLOR');

                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                if (typeof r == 'number' && typeof g == 'number' && typeof b == 'number') {
                    this.neopixel.setAllRgb(r, g, b);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelChangeAllRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (typeof red == 'number' && typeof green == 'number' && typeof blue == 'number') {
                    this.neopixel.changeAllRgb(red, green, blue);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetAllRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (typeof red == 'number' && typeof green == 'number' && typeof blue == 'number') {
                    this.neopixel.setAllRgb(red, green, blue);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.__NEOPIXEL_PATTERNS = {
        GRADIENT_RED_GREEN: 128,
        GRADIENT_RED_BLUE: 129,
        GRADIENT_RED_WHITE: 130,
        GRADIENT_RED_BLACK: 131,
        GRADIENT_GREEN_BLUE: 132,
        GRADIENT_GREEN_RED: 133,
        GRADIENT_GREEN_WHITE: 134,
        GRADIENT_GREEN_BLACK: 135,
        GRADIENT_BLUE_RED: 136,
        GRADIENT_BLUE_GREEN: 137,
        GRADIENT_BLUE_WHITE: 138,
        GRADIENT_BLUE_BLACK: 139,
        GRADIENT_WHITE_RED: 140,
        GRADIENT_WHITE_GREEN: 141,
        GRADIENT_WHITE_BLUE: 142,
        GRADIENT_WHITE_BLACK: 143,
        GRADIENT_BLACK_RED: 144,
        GRADIENT_BLACK_GREEN: 145,
        GRADIENT_BLACK_BLUE: 146,
        GRADIENT_BLACK_WHITE: 147,
        FILL_3_COLORS: 192,
        FILL_6_COLORS: 193,
        FILL_12_COLORS: 194,
    };

    CheeseRobot.prototype.neopixelSetAllPattern = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pattern = script.getField('PATTERN');

                pattern = this.__NEOPIXEL_PATTERNS[pattern];
                if (typeof pattern == 'number') {
                    this.neopixel.setAllPattern(pattern);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelClearAll = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;

                this.neopixel.clearAll();
                this.__refreshNeopixel(function () {
                    script.isWorking = false;
                });
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetLedColor = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pixel = script.getNumberValue('PIXEL');
                const color = script.getField('COLOR');

                pixel = parseInt(pixel);
                const rgb = this.__RGB_COLORS['BRIGHT'][color];
                if (typeof pixel == 'number' && rgb) {
                    if (this.neopixel.setRgbAt(pixel - 1, rgb[0], rgb[1], rgb[2])) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetLedRgbArray = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pixel = script.getNumberValue('PIXEL');
                const color = script.getField('COLOR');

                pixel = parseInt(pixel);
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                if (
                    typeof pixel == 'number' &&
                    typeof r == 'number' &&
                    typeof g == 'number' &&
                    typeof b == 'number'
                ) {
                    if (this.neopixel.setRgbAt(pixel - 1, r, g, b)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelChangeLedRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pixel = script.getNumberValue('PIXEL');
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                pixel = parseInt(pixel);
                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (
                    typeof pixel == 'number' &&
                    typeof red == 'number' &&
                    typeof green == 'number' &&
                    typeof blue == 'number'
                ) {
                    if (this.neopixel.changeRgbAt(pixel - 1, red, green, blue)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetLedRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pixel = script.getNumberValue('PIXEL');
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                pixel = parseInt(pixel);
                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (
                    typeof pixel == 'number' &&
                    typeof red == 'number' &&
                    typeof green == 'number' &&
                    typeof blue == 'number'
                ) {
                    if (this.neopixel.setRgbAt(pixel - 1, red, green, blue)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelClearLed = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let pixel = script.getNumberValue('PIXEL');

                pixel = parseInt(pixel);
                if (typeof pixel == 'number') {
                    if (this.neopixel.clearAt(pixel - 1)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetRangeColor = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let increment = script.getNumberValue('INCREMENT');
                const color = script.getField('COLOR');

                start = parseInt(start);
                end = parseInt(end);
                increment = parseInt(increment);
                const rgb = this.__RGB_COLORS['BRIGHT'][color];
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof increment == 'number' &&
                    rgb
                ) {
                    if (
                        this.neopixel.setRgbFromTo(
                            start - 1,
                            end - 1,
                            increment,
                            rgb[0],
                            rgb[1],
                            rgb[2]
                        )
                    ) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetRangeRgbArray = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let increment = script.getNumberValue('INCREMENT');
                const color = script.getField('COLOR');

                start = parseInt(start);
                end = parseInt(end);
                increment = parseInt(increment);
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof increment == 'number' &&
                    typeof r == 'number' &&
                    typeof g == 'number' &&
                    typeof b == 'number'
                ) {
                    if (this.neopixel.setRgbFromTo(start - 1, end - 1, increment, r, g, b)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelChangeRangeRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let increment = script.getNumberValue('INCREMENT');
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                start = parseInt(start);
                end = parseInt(end);
                increment = parseInt(increment);
                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof increment == 'number' &&
                    typeof red == 'number' &&
                    typeof green == 'number' &&
                    typeof blue == 'number'
                ) {
                    if (
                        this.neopixel.changeRgbFromTo(
                            start - 1,
                            end - 1,
                            increment,
                            red,
                            green,
                            blue
                        )
                    ) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetRangeRgb = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let increment = script.getNumberValue('INCREMENT');
                let red = script.getNumberValue('RED');
                let green = script.getNumberValue('GREEN');
                let blue = script.getNumberValue('BLUE');

                start = parseInt(start);
                end = parseInt(end);
                increment = parseInt(increment);
                red = parseInt(red);
                green = parseInt(green);
                blue = parseInt(blue);
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof increment == 'number' &&
                    typeof red == 'number' &&
                    typeof green == 'number' &&
                    typeof blue == 'number'
                ) {
                    if (
                        this.neopixel.setRgbFromTo(start - 1, end - 1, increment, red, green, blue)
                    ) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetRangePattern = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let pattern = script.getField('PATTERN');

                start = parseInt(start);
                end = parseInt(end);
                pattern = this.__NEOPIXEL_PATTERNS[pattern];
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof pattern == 'number'
                ) {
                    if (this.neopixel.setPatternFromTo(start - 1, end - 1, pattern)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelClearRange = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let start = script.getNumberValue('START');
                let end = script.getNumberValue('END');
                let increment = script.getNumberValue('INCREMENT');

                start = parseInt(start);
                end = parseInt(end);
                increment = parseInt(increment);
                if (
                    typeof start == 'number' &&
                    typeof end == 'number' &&
                    typeof increment == 'number'
                ) {
                    if (this.neopixel.clearFromTo(start - 1, end - 1, increment)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelShift = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let bit = script.getNumberValue('BIT');

                bit = parseInt(bit);
                if (typeof bit == 'number') {
                    if (this.neopixel.shiftAll(bit)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelRotate = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let bit = script.getNumberValue('BIT');

                bit = parseInt(bit);
                if (typeof bit == 'number') {
                    if (this.neopixel.rotateAll(bit)) {
                        this.__refreshNeopixel(function () {
                            script.isWorking = false;
                        });
                    } else {
                        script.isWorking = false;
                    }
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelChangeBrightness = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let value = script.getNumberValue('VALUE');

                value = parseInt(value);
                if (typeof value == 'number') {
                    this.neopixel.changeBrightnessBy(value);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.neopixelSetBrightness = function (script) {
        this.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWaiting = true;
            script.isWorking = true;
            return script;
        } else if (script.isWaiting) {
            if (this.__isNeopixelIdle()) {
                script.isWaiting = false;
                let value = script.getNumberValue('VALUE');

                value = parseInt(value);
                if (typeof value == 'number') {
                    this.neopixel.setBrightnessTo(value);
                    this.__refreshNeopixel(function () {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            }
            return script;
        } else if (script.isWorking) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWaiting;
            delete script.isWorking;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.writeSerial = function (script) {
        const self = this;
        self.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isWriting = true;

            const mode = script.getField('MODE');
            const text = script.getValue('STRING');

            this.__setSerialModePid();
            const queue = this.writeQueue;
            queue.push(text, mode != 'STRING');
            const data = queue.pop();
            if (data) {
                this.writeSerialCallbacks.push(() => {
                    script.isWriting = false;
                });
                this.__setSerial(data);
            } else {
                script.isWriting = false;
            }
            return script;
        } else if (script.isWriting) {
            return script;
        } else {
            delete script.isStart;
            delete script.isWriting;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.__SERIAL_DELIMITERS = {
        ALL: 0,
        COMMA: 0x2c,
        COLON: 0x3a,
        DOLLAR: 0x24,
        SHARP: 0x23,
        NEW_LINE: 0x0d,
    };

    CheeseRobot.prototype.readSerialUntil = function (script) {
        const self = this;
        self.__setModule();
        if (!script.isStart) {
            script.isStart = true;
            script.isReading = true;

            let delimiter = script.getField('DELIMITER');

            this.__setSerialModePid();
            delimiter = this.__SERIAL_DELIMITERS[delimiter];
            if (typeof delimiter == 'number') {
                this.serialDelimiter = delimiter;
                this.readSerialCallbacks.push(() => {
                    script.isReading = false;
                });
            } else {
                script.isReading = false;
            }
            return script;
        } else if (script.isReading) {
            return script;
        } else {
            delete script.isStart;
            delete script.isReading;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    };

    CheeseRobot.prototype.__SERIAL_PORTS = {
        WRITE_READ: 2,
        READ_WRITE: 3,
        WRITE: 0,
        READ: 1,
    };

    CheeseRobot.prototype.setSerialPort = function (script) {
        this.__setModule();
        const port = this.__SERIAL_PORTS[script.getField('PORT')];

        if (typeof port == 'number') {
            this.serialPin = port;
            this.__setSerialModePid();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__SERIAL_BAUDS = {
        9600: 0,
        14400: 1,
        19200: 2,
        28800: 3,
        38400: 4,
        57600: 5,
        76800: 6,
        115200: 7,
    };

    CheeseRobot.prototype.setSerialRate = function (script) {
        this.__setModule();
        const baud = this.__SERIAL_BAUDS[script.getField('BAUD')];

        if (typeof baud == 'number') {
            this.serialRate = baud;
            this.__setSerialModePid();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.getSerialInput = function (script) {
        this.__setModule();
        return this.serialInput;
    };

    CheeseRobot.prototype.pidStart = function (script) {
        this.__setModule();

        const dev = script.getField('DEVICE');
        switch (dev) {
            case '10': // PID-10 ultrasonic sensor (HC-SR04+)
                // 0: La(trigger) Lb(echo) Lc(GND)
                // 1: La(trigger) Lb(echo)
                this.motoring.outputLa = 0;
                this.__setModeLa(255);
                this.__setModePid(10);
                break;
            case '11-1': // PID-11-1 humidity/temperature sensor (DHT11)
                // upper 4bits
                // 0: La(data)
                // 1: La(data), Lb(GND)
                // 2: La(data), Lb(VCC)
                this.motoring.outputLa = 1;
                this.__setModeLa(255);
                this.__setModePid(11);
                break;
            case '11-2': // PID-11-2 humidity/temperature sensor (DHT21)
                // upper 4bits
                // 0: La(data)
                // 1: La(data), Lb(GND)
                // 2: La(data), Lb(VCC)
                this.motoring.outputLa = 2;
                this.__setModeLa(255);
                this.__setModePid(11);
                break;
            case '11-3': // PID-11-3 humidity/temperature sensor (DHT22)
                // upper 4bits
                // 0: La(data)
                // 1: La(data), Lb(GND)
                // 2: La(data), Lb(VCC)
                this.motoring.outputLa = 3;
                this.__setModeLa(255);
                this.__setModePid(11);
                break;
            case '12': // PID-12 temperature sensor (DS18B20)
                this.__setModePid(12);
                break;
            case '13': // PID-13 joystick and button
                this.__setModePid(13);
                break;
            case '14': // PID-14 dual joystick
                this.__setModePid(14);
                break;
            case '15': // PID-15 IR transceiver
                this.__setModePid(15);
                break;
            case '16': // PID-16 encoder
                this.__setModePid(16);
                this.__resetEncoder();
                break;
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.pidSetRangeTo = function (script) {
        this.__setModule();

        const input = script.getField('INPUT');
        let low1 = script.getNumberValue('LOW1');
        let high1 = script.getNumberValue('HIGH1');
        let low2 = script.getNumberValue('LOW2');
        let high2 = script.getNumberValue('HIGH2');
        const decimal = script.getField('DECIMAL');

        low1 = parseFloat(low1);
        high1 = parseFloat(high1);
        low2 = parseFloat(low2);
        high2 = parseFloat(high2);
        if (
            typeof low1 == 'number' &&
            typeof high1 == 'number' &&
            typeof low2 == 'number' &&
            typeof high2 == 'number'
        ) {
            this.range.setLowHigh(input, low1, high1, low2, high2, decimal == 'REAL');
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.pidSetThreeRangesTo = function (script) {
        this.__setModule();

        const input = script.getField('INPUT');
        let low1 = script.getNumberValue('LOW1');
        let mid1 = script.getNumberValue('MIDDLE1');
        let high1 = script.getNumberValue('HIGH1');
        let low2 = script.getNumberValue('LOW2');
        let mid2 = script.getNumberValue('MIDDLE2');
        let high2 = script.getNumberValue('HIGH2');
        const decimal = script.getField('DECIMAL');

        low1 = parseFloat(low1);
        mid1 = parseFloat(mid1);
        high1 = parseFloat(high1);
        low2 = parseFloat(low2);
        mid2 = parseFloat(mid2);
        high2 = parseFloat(high2);
        if (
            typeof low1 == 'number' &&
            typeof mid1 == 'number' &&
            typeof high1 == 'number' &&
            typeof low2 == 'number' &&
            typeof mid2 == 'number' &&
            typeof high2 == 'number'
        ) {
            this.range.setLowMidHigh(
                input,
                low1,
                mid1,
                high1,
                low2,
                mid2,
                high2,
                decimal == 'REAL'
            );
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.__resetEncoder = function () {
        if (this.motoring.modePid == 16) {
            // encoder
            this.resetEncoderFlag = (this.resetEncoderFlag % 255) + 1;
            const pid = this.__getOrCreateWritePidArray();
            pid[0] = 0x31;
            pid[1] = this.resetEncoderFlag;
            this.__issuePid();
        }
    };

    CheeseRobot.prototype.pidResetEncoder = function (script) {
        this.__setModule();
        this.__resetEncoder();
        return script.callReturn();
    };

    CheeseRobot.prototype.pidGetInput = function (script) {
        this.__setModule();
        const input = script.getField('INPUT');
        switch (input) {
            case 'DISTANCE':
                return this.pid.getDistance();
            case 'TEMPERATURE':
                return this.pid.getTemperature();
            case 'HUMIDITY':
                return this.pid.getHumidity();
            case 'X1':
                return this.range.calc('X1', this.pid.getX1());
            case 'Y1':
                return this.range.calc('Y1', this.pid.getY1());
            case 'X2':
                return this.range.calc('X2', this.pid.getX2());
            case 'Y2':
                return this.range.calc('Y2', this.pid.getY2());
            case 'BUTTON1':
                return this.pid.getButton1();
            case 'BUTTON2':
                return this.pid.getButton2();
            case 'ENCODER':
                return this.pid.getEncoder();
        }
        return 0;
    };

    CheeseRobot.prototype.pidCheckButtonState = function (script) {
        this.__setModule();

        const button = script.getField('BUTTON');
        const state = script.getField('STATE');
        switch (button) {
            case '1':
                switch (state) {
                    case 'CLICKED':
                        return this.pid.isButton1Clicked();
                    case 'LONG_PRESSED':
                        return this.pid.isButton1LongPressed();
                }
                break;
            case '2':
                switch (state) {
                    case 'CLICKED':
                        return this.pid.isButton2Clicked();
                    case 'LONG_PRESSED':
                        return this.pid.isButton2LongPressed();
                }
                break;
        }
        return false;
    };

    CheeseRobot.prototype.hat010Start = function (script) {
        this.__setModule();
        this.hat.start(10);
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010GetButton = function (script) {
        this.__setModule();

        const hat = this.hat.getHat(10);
        if (hat) {
            const button = script.getField('BUTTON');
            switch (button) {
                case 'A':
                    return hat.getButtonA();
                case 'B':
                    return hat.getButtonB();
            }
        }
        return 0;
    };

    CheeseRobot.prototype.hat010CheckButtonState = function (script) {
        this.__setModule();

        const hat = this.hat.getHat(10);
        if (hat) {
            const button = script.getField('BUTTON');
            const state = script.getField('STATE');
            switch (button) {
                case 'A':
                    switch (state) {
                        case 'CLICKED':
                            return hat.isButtonAClicked();
                        case 'LONG_PRESSED':
                            return hat.isButtonALongPressed();
                    }
                    break;
                case 'B':
                    switch (state) {
                        case 'CLICKED':
                            return hat.isButtonBClicked();
                        case 'LONG_PRESSED':
                            return hat.isButtonBLongPressed();
                    }
                    break;
            }
        }
        return false;
    };

    CheeseRobot.prototype.__LED_MATRIX_COLORS = {
        RED: 4,
        ORANGE: 8,
        YELLOW: 6,
        GREEN: 2,
        SKY_BLUE: 3,
        BLUE: 1,
        PURPLE: 5,
        VIOLET: 9,
        WHITE: 7,
    };

    CheeseRobot.prototype.hat010BackgroundTurnOnXY = function (script) {
        this.__setModule();

        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        let color = script.getField('COLOR');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        color = this.__LED_MATRIX_COLORS[color];
        if (hat && typeof x == 'number' && typeof y == 'number' && typeof color == 'number') {
            hat.getLedMatrix().setBackgroundPixel(x, y, color);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010BackgroundTurnOffXY = function (script) {
        this.__setModule();

        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        if (hat && typeof x == 'number' && typeof y == 'number') {
            hat.getLedMatrix().setBackgroundPixel(x, y, 0);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010BackgroundDrawShapeAtXY = function (script) {
        this.__setModule();

        let color = script.getField('COLOR');
        const shape = script.getField('SHAPE');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        color = this.__LED_MATRIX_COLORS[color];
        if (
            hat &&
            typeof x == 'number' &&
            typeof y == 'number' &&
            typeof color == 'number' &&
            shape
        ) {
            if (hat.getLedMatrix().drawBackgroundShape(x, y, shape, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010BackgroundDrawStringAtXY = function (script) {
        this.__setModule();

        let color = script.getField('COLOR');
        const text = script.getStringValue('TEXT');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        color = this.__LED_MATRIX_COLORS[color];
        if (
            hat &&
            typeof x == 'number' &&
            typeof y == 'number' &&
            typeof color == 'number' &&
            text
        ) {
            if (hat.getLedMatrix().drawBackgroundString(x, y, text, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010BackgroundDrawPatternAtXY = function (script) {
        this.__setModule();

        let color = script.getField('COLOR');
        const pattern = script.getStringValue('PATTERN');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        color = this.__LED_MATRIX_COLORS[color];
        if (
            hat &&
            typeof x == 'number' &&
            typeof y == 'number' &&
            typeof color == 'number' &&
            pattern
        ) {
            if (hat.getLedMatrix().drawBackgroundPattern(x, y, pattern, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010Clear = function (script) {
        this.__setModule();

        const target = script.getField('TARGET');
        const hat = this.hat.getHat(10);

        if (hat) {
            if (target == 'ALL') hat.getLedMatrix().clearAll();
            else hat.getLedMatrix().clearBackground();
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010ScrollByXY = function (script) {
        this.__setModule();

        const target = script.getField('TARGET');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        x = parseInt(x);
        y = parseInt(y);
        if (hat && typeof x == 'number' && typeof y == 'number') {
            if (target == 'ALL') hat.getLedMatrix().scrollAllBy(x, y);
            else hat.getLedMatrix().scrollBackgroundBy(x, y);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteSetToShape = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let color = script.getField('COLOR');
        const shape = script.getField('SHAPE');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        color = this.__LED_MATRIX_COLORS[color];
        if (hat && typeof sprite == 'number' && typeof color == 'number' && shape) {
            if (hat.getLedMatrix().setSpriteShape(sprite, shape, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteSetToString = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let color = script.getField('COLOR');
        const text = script.getStringValue('TEXT');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        color = this.__LED_MATRIX_COLORS[color];
        if (hat && typeof sprite == 'number' && typeof color == 'number' && text) {
            if (hat.getLedMatrix().setSpriteString(sprite, text, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteSetToPattern = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let color = script.getField('COLOR');
        const pattern = script.getStringValue('PATTERN');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        color = this.__LED_MATRIX_COLORS[color];
        if (hat && typeof sprite == 'number' && typeof color == 'number' && pattern) {
            if (hat.getLedMatrix().setSpritePattern(sprite, pattern, color)) {
                hat.issueMatrixUpdate();
            }
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteClearShowHide = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const action = script.getField('ACTION');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            switch (action) {
                case 'CLEAR':
                    hat.getLedMatrix().clearSprite(sprite);
                    break;
                case 'SHOW':
                    hat.getLedMatrix().showSprite(sprite);
                    break;
                case 'HIDE':
                    hat.getLedMatrix().hideSprite(sprite);
                    break;
            }
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteChangePositionsByXY = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        x = parseInt(x);
        y = parseInt(y);
        if (hat && typeof sprite == 'number' && typeof x == 'number' && typeof y == 'number') {
            hat.getLedMatrix().changeSpritePositionsBy(sprite, x, y);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteSetPositionsToXY = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let x = script.getNumberValue('X');
        let y = script.getNumberValue('Y');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        x = parseInt(x);
        y = parseInt(y);
        if (hat && typeof sprite == 'number' && typeof x == 'number' && typeof y == 'number') {
            hat.getLedMatrix().setSpritePositionsTo(sprite, x, y);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteChangePositionByValue = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const position = script.getField('POSITION');
        let value = script.getNumberValue('VALUE');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        value = parseInt(value);
        if (hat && typeof sprite == 'number' && typeof value == 'number') {
            hat.getLedMatrix().changeSpritePositionBy(sprite, position == 'X', value);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteSetPositionToValue = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const position = script.getField('POSITION');
        let value = script.getNumberValue('VALUE');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        value = parseInt(value);
        if (hat && typeof sprite == 'number' && typeof value == 'number') {
            hat.getLedMatrix().setSpritePositionTo(sprite, position == 'X', value);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteRotate = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const direction = script.getField('DIRECTION');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            hat.getLedMatrix().rotateSprite(sprite, direction == 'CLOCKWISE');
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteFlipInDirection = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const direction = script.getField('DIRECTION');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            hat.getLedMatrix().flipSprite(sprite, direction == 'LEFT_RIGHT');
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SpriteStampToBackground = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            hat.getLedMatrix().stampSprite(sprite);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010GetSpritePosition = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const position = script.getField('POSITION');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            return hat.getLedMatrix().getSpritePosition(sprite, position == 'X');
        }
        return 0;
    };

    CheeseRobot.prototype.hat010CheckCheckSpriteSpriteTouched = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        let target = script.getNumberValue('TARGET');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        target = parseInt(target);
        if (hat && typeof sprite == 'number' && typeof target == 'number') {
            const matrix = hat.getLedMatrix();
            matrix.update();
            return matrix.checkSpritesTouched(sprite, target);
        }
        return false;
    };

    CheeseRobot.prototype.hat010CheckCheckSpriteTouched = function (script) {
        this.__setModule();

        let sprite = script.getNumberValue('SPRITE');
        const target = script.getField('TARGET');
        const hat = this.hat.getHat(10);

        sprite = parseInt(sprite);
        if (hat && typeof sprite == 'number') {
            const matrix = hat.getLedMatrix();
            matrix.update();
            switch (target) {
                case 'BACKGROUND':
                    return matrix.checkBackgroundTouched(sprite);
                case 'OTHER_SPRITE':
                    return matrix.checkOtherSpriteTouched(sprite);
                case 'LEFT_WALL':
                    return matrix.checkWallTouched(sprite, 0);
                case 'RIGHT_WALL':
                    return matrix.checkWallTouched(sprite, 1);
                case 'TOP_WALL':
                    return matrix.checkWallTouched(sprite, 2);
                case 'BOTTOM_WALL':
                    return matrix.checkWallTouched(sprite, 3);
                case 'ANY_WALL':
                    return matrix.checkWallTouched(sprite, -1);
            }
        }
        return false;
    };

    CheeseRobot.prototype.hat010ChangeBrightnessBy = function (script) {
        this.__setModule();

        let brightness = script.getNumberValue('BRIGHTNESS');
        const hat = this.hat.getHat(10);

        brightness = parseInt(brightness);
        if (hat && typeof brightness == 'number') {
            hat.getLedMatrix().changeBrightnessBy(brightness);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    CheeseRobot.prototype.hat010SetBrightnessTo = function (script) {
        this.__setModule();

        let brightness = script.getNumberValue('BRIGHTNESS');
        const hat = this.hat.getHat(10);

        brightness = parseInt(brightness);
        if (hat && typeof brightness == 'number') {
            hat.getLedMatrix().setBrightnessTo(brightness);
            hat.issueMatrixUpdate();
        }
        return script.callReturn();
    };

    class CheeseLite {
        constructor() {
            this.id = '020D01';
            this.name = 'CheeseLite';
            this.title = {
                ko: '치즈 스틱',
                en: 'Cheese Stick',
                jp: 'チーズスティック',
                vn: 'Cheese Stick',
            };
            this.url = 'http://www.robomation.net';
            this.imageName = 'cheeselite.png';
            this.blockMenuBlocks = [
                'cheeselite_value',
                'cheeselite_boolean',
                'cheeselite_play_sound_times',
                'cheeselite_play_sound_times_until_done',
                'cheeselite_change_buzzer_by',
                'cheeselite_set_buzzer_to',
                'cheeselite_clear_sound',
                'cheeselite_play_note',
                'cheeselite_play_note_for',
                'cheeselite_rest_for',
                'cheeselite_change_tempo_by',
                'cheeselite_set_tempo_to',
                'cheeselite_set_sound_port_to',
                'cheeselite_set_input_mode_to',
                'cheeselite_set_input_range_to',
                'cheeselite_set_three_input_ranges_to',
                'cheeselite_analog_input',
                'cheeselite_digital_input',
                'cheeselite_button_state',
                'cheeselite_set_pulse_mode_to',
                'cheeselite_pulse_input',
                'cheeselite_set_digital_output_to',
                'cheeselite_change_pwm_output_by',
                'cheeselite_set_pwm_output_to',
                'cheeselite_change_servo_motor_angle_by',
                'cheeselite_set_servo_motor_angle_to',
                'cheeselite_turn_off_servo_motor',
                'cheeselite_change_dc_motor_velocity_by',
                'cheeselite_set_dc_motor_velocity_to',
                'cheeselite_stop_dc_motor',
                'cheeselite_rotate_step_motor',
                'cheeselite_change_step_motor_velocity_by',
                'cheeselite_set_step_motor_velocity_to',
                'cheeselite_stop_off_step_motor',
                'cheeselite_set_step_motor_mode_to',
                'cheeselite_step_count',
                'cheeselite_set_led_to_color',
                'cheeselite_pick_led_to',
                'cheeselite_change_led_by_rgb',
                'cheeselite_setLed_to_rgb',
                'cheeselite_clear_led',
                'cheeselite_set_led_type_to',
                'cheeselite_neopixel_set_number_and_type_to',
                'cheeselite_neopixel_set_all_leds_to_pattern',
                'cheeselite_neopixel_set_all_leds_to_color',
                'cheeselite_neopixel_pick_all_leds_to',
                'cheeselite_neopixel_change_all_leds_by_rgb',
                'cheeselite_neopixel_set_all_leds_to_rgb',
                'cheeselite_neopixel_clear_all_leds',
                'cheeselite_neopixel_set_led_to_color',
                'cheeselite_neopixel_pick_led_to',
                'cheeselite_neopixel_change_led_by_rgb',
                'cheeselite_neopixel_set_led_to_rgb',
                'cheeselite_neopixel_clear_led',
                'cheeselite_neopixel_set_led_range_to_pattern',
                'cheeselite_neopixel_set_led_range_to_color',
                'cheeselite_neopixel_pick_led_range_to',
                'cheeselite_neopixel_change_led_range_by_rgb',
                'cheeselite_neopixel_set_led_range_to_rgb',
                'cheeselite_neopixel_clear_led_range',
                'cheeselite_neopixel_shift',
                'cheeselite_neopixel_rotate',
                'cheeselite_neopixel_change_brightness_by',
                'cheeselite_neopixel_set_brightness_to',
                'cheeselite_write_serial',
                'cheeselite_read_serial_until',
                'cheeselite_set_serial_port_to',
                'cheeselite_set_serial_rate_to',
                'cheeselite_serial_input',
                'cheeselite_pid_start',
                'cheeselite_pid_set_range_to',
                'cheeselite_pid_set_three_ranges_to',
                'cheeselite_pid_reset_encoder',
                'cheeselite_pid_input',
                'cheeselite_pid_button_state',
                'cheeselite_hat010_start',
                'cheeselite_hat010_button',
                'cheeselite_hat010_button_state',
                'cheeselite_hat010_background_turn_on_xy',
                'cheeselite_hat010_background_turn_off_xy',
                'cheeselite_hat010_background_draw_shape_at_xy',
                'cheeselite_hat010_background_draw_string_at_xy',
                'cheeselite_hat010_background_draw_pattern_at_xy',
                'cheeselite_hat010_clear',
                'cheeselite_hat010_scroll_by_xy',
                'cheeselite_hat010_sprite_set_to_shape',
                'cheeselite_hat010_sprite_set_to_string',
                'cheeselite_hat010_sprite_set_to_pattern',
                'cheeselite_hat010_sprite_clear_show_hide',
                'cheeselite_hat010_sprite_change_positions_by_xy',
                'cheeselite_hat010_sprite_set_positions_to_xy',
                'cheeselite_hat010_sprite_change_position_by_value',
                'cheeselite_hat010_sprite_set_position_to_value',
                'cheeselite_hat010_sprite_rotate',
                'cheeselite_hat010_sprite_flip_in_direction',
                'cheeselite_hat010_sprite_stamp_to_background',
                'cheeselite_hat010_sprite_position',
                'cheeselite_hat010_sprite_touching_sprite',
                'cheeselite_hat010_sprite_touching',
                'cheeselite_hat010_change_brightness_by',
                'cheeselite_hat010_set_brightness_to',
            ];
            this.delimeter = '\r';
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                connectionType: 'bytestream',
                bufferSize: 65536,
                constantServing: true,
                writeAscii: false,
                readAscii: true,
                flowControl: 'hardware',
            };
            this.state = 'idle'; // idle | handshaking | ready | realigning
            this.address = '';
            this.variant = '';
            this.motoring = this.__defaultMotoring(); // 블록이 쓰는 명령 객체(하드웨어 연결 프로그램의 sendQueue 역할)
            this.out = this.__defaultMotoring(); // 장치로 나가는 사본(entry-hw cheese.js 의 motoring 역할). id 로 묶인 6필드는 id 가 바뀔 때만 복사한다
            this.shadow = {
                stepId: 0,
                soundId: 0,
                writeHatId: 0,
                writePidId: 0,
                writeNeopixelId: 0,
            };
            Object.assign(this, this.__defaultHw());
            this.sensory = this.__defaultSensory();
            this.robot = new CheeseRobot(0); // 블록 쪽 상태는 CheeseRobot 인스턴스를 그대로 쓴다
            this.robot.setMotoring(this.motoring);
            this.__installOverrides(); // 취소 함수 4종을 덮어쓴다
            this.timeouts = [];
            this.__lastTxAt = -Infinity;
            this.__drain = 0;
            this.__drainNormalCount = 0;
            this.mismatchCount = 0;
            this.invalidCount = 0;
            this.__forceFrame = false;
            this.__noteScript = null;
        }

        __now() {
            return Date.now();
        }

        // CheeseRobot 인스턴스의 취소 함수를 덮어 취소된 블록도 끝나게 한다. 메서드 본문은 바꾸지 않고
        // 인스턴스 속성으로 덮으므로 CheeseRobot 안의 this.__cancelX() 호출이 전부 여기로 온다.
        __installOverrides() {
            const self = this,
                r = this.robot;
            r.__cancelStep = function () {
                self.__resolvePending('step');
            }; // handleSensory 는 취소 뒤 콜백을 한 번 더 부르므로 여러 번 불려도 결과가 같아야 한다
            r.__cancelSound = function () {
                self.__resolvePending('sound');
            };
            r.__cancelNeopixel = function () {
                self.__resolvePending('neopixel');
            };
            r.__cancelNote = function () {
                self.__resolvePending('note');
            }; // 기다리는 script 는 __noteScript 로 쥔다(playNoteBeat, restBeat)
        }

        __defaultMotoring() {
            const m = Object.assign({}, CheeseRobot.prototype.__PORT_MAP); // 28키(group/module 포함)
            m.index = 0;
            m.writeHat = undefined;
            m.writeHatId = 0;
            m.writePid = undefined;
            m.writePidId = 0;
            m.writeNeopixel = undefined;
            m.writeNeopixelId = 0;
            return m;
        }

        __defaultHw() {
            // cheese.js Module() 생성자의 상태 객체들. 이름 그대로.
            return {
                step: { written: false, id: 0, pulse: 0, pulsePrev: -1, event: 0, stateId: -1 },
                sound: { written: false, flag: 0, prev: 0, event: 0, stateId: -1 },
                hat: {
                    written: false,
                    sendId: 0,
                    sendPrevId: 0,
                    activated: 0,
                    deactivating: false,
                },
                pid: { written: false, sendId: 0, sendPrevId: 0 },
                neopixel: {
                    written: false,
                    sendId: 0,
                    sendPrevId: 0,
                    updateId: 0,
                    activated: false,
                    deactivating: false,
                },
                port: { ackId: -1, modePid: 0 },
                packetSent: 0,
                packetReceived: 0, // entry-hw cheese.js 와 같은 필드. 수신 처리에서 쓴다
                acceleration: {
                    x: new Array(5),
                    y: new Array(5),
                    z: new Array(5),
                    sumx: 0.0,
                    sumy: 0.0,
                    sumz: 0.0,
                    index: 0,
                    count: 0,
                },
                event: { freeFallId: -1, tapId: -1, tilt: -4, stepCount: -40000, batteryState: -1 },
            };
        }

        __defaultSensory() {
            // cheese.js Module() sensory 초기값 그대로(tilt 포함). model 은 센서 값을 블록 쪽으로 넘기기 직전에만 pd 에 넣는다.
            return {
                signalStrength: 0,
                accelerationX: 0,
                accelerationY: 0,
                accelerationZ: 0,
                internalTemperature: 0,
                inputSa: 0,
                inputSb: 0,
                inputSc: 0,
                inputLa: 0,
                inputLb: 0,
                inputLc: 0,
                pulseSc: 0,
                pulseScId: 0,
                pulseLc: 0,
                pulseLcId: 0,
                freeFall: 0,
                freeFallId: 0,
                tap: 0,
                tapId: 0,
                tilt: 0,
                stepCount: 0,
                stepState: -1,
                stepStateId: 0,
                soundState: -1,
                soundStateId: 0,
                batteryState: 2,
                hatState: 0,
                hatStateId: 0,
                pidState: 0,
                pidStateId: 0,
                neopixelState: 0,
                neopixelStateId: 0,
                readHat: undefined,
                readHatId: 0,
                readPid: undefined,
                readPidId: 0,
            };
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw_lite/cheeselite.png',
                width: 444,
                height: 300,
                listPorts: {
                    accelerationX: {
                        name: Lang.Blocks.ROBOID_sensor_acceleration_x,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationY: {
                        name: Lang.Blocks.ROBOID_sensor_acceleration_y,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationZ: {
                        name: Lang.Blocks.ROBOID_sensor_acceleration_z,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    stepCount: {
                        name: Lang.Blocks.ROBOID_sensor_step_count,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    buzzer: {
                        name: Lang.Blocks.ROBOID_monitor_buzzer,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    note: {
                        name: Lang.Blocks.ROBOID_monitor_note,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                },
                ports: {
                    inputSa: {
                        name: Lang.Blocks.ROBOID_sensor_input_sa,
                        type: 'input',
                        pos: { x: 199, y: 219 },
                    },
                    inputSb: {
                        name: Lang.Blocks.ROBOID_sensor_input_sb,
                        type: 'input',
                        pos: { x: 305, y: 169 },
                    },
                    inputSc: {
                        name: Lang.Blocks.ROBOID_sensor_input_sc,
                        type: 'input',
                        pos: { x: 400, y: 123 },
                    },
                    inputLa: {
                        name: Lang.Blocks.ROBOID_sensor_input_la,
                        type: 'input',
                        pos: { x: 83, y: 102 },
                    },
                    inputLb: {
                        name: Lang.Blocks.ROBOID_sensor_input_lb,
                        type: 'input',
                        pos: { x: 100, y: 96 },
                    },
                    inputLc: {
                        name: Lang.Blocks.ROBOID_sensor_input_lc,
                        type: 'input',
                        pos: { x: 118, y: 89 },
                    },
                    outputSa: {
                        name: Lang.Blocks.ROBOID_monitor_output_sa,
                        type: 'output',
                        pos: { x: 199, y: 219 },
                    },
                    outputSb: {
                        name: Lang.Blocks.ROBOID_monitor_output_sb,
                        type: 'output',
                        pos: { x: 305, y: 169 },
                    },
                    outputSc: {
                        name: Lang.Blocks.ROBOID_monitor_output_sc,
                        type: 'output',
                        pos: { x: 400, y: 123 },
                    },
                    outputLa: {
                        name: Lang.Blocks.ROBOID_monitor_output_la,
                        type: 'output',
                        pos: { x: 83, y: 102 },
                    },
                    outputLb: {
                        name: Lang.Blocks.ROBOID_monitor_output_lb,
                        type: 'output',
                        pos: { x: 100, y: 96 },
                    },
                    outputLc: {
                        name: Lang.Blocks.ROBOID_monitor_output_lc,
                        type: 'output',
                        pos: { x: 118, y: 89 },
                    },
                    outputMab: {
                        name: Lang.Blocks.ROBOID_monitor_output_mab,
                        type: 'output',
                        pos: { x: 274, y: 26 },
                    },
                    outputMcd: {
                        name: Lang.Blocks.ROBOID_monitor_output_mcd,
                        type: 'output',
                        pos: { x: 305, y: 15 },
                    },
                },
                mode: 'both',
            };
        }

        getMonitorPort() {
            const s = this.sensory;
            const m = this.motoring;
            return {
                accelerationX: s.accelerationX,
                accelerationY: s.accelerationY,
                accelerationZ: s.accelerationZ,
                stepCount: s.stepCount,
                buzzer: m.buzzer,
                note: m.note,
                inputSa: s.inputSa,
                inputSb: s.inputSb,
                inputSc: s.inputSc,
                inputLa: s.inputLa,
                inputLb: s.inputLb,
                inputLc: s.inputLc,
                outputSa: m.outputSa,
                outputSb: m.outputSb,
                outputSc: m.outputSc,
                outputLa: m.outputLa,
                outputLb: m.outputLb,
                outputLc: m.outputLc,
                outputMab: m.outputMab,
                outputMcd: m.outputMcd,
            };
        }

        __messages() {
            const ko = { foreignRobot: '치즈 스틱이 아닌 로봇이 연결되어 있습니다.' };
            const en = { foreignRobot: 'The connected robot is not a Cheese Stick.' };
            const jp = { foreignRobot: '接続されたロボットはチーズスティックではありません。' };
            const vn = { foreignRobot: 'Robot được kết nối không phải là Cheese Stick.' };
            return { ko, en, jp, vn }[Lang.type] || en;
        }

        // 연결
        parseIdentityData(line) {
            // 이름 필드는 사용자가 바꿀 수 있어 뒤에서 센다.
            if (typeof line !== 'string' || line.slice(0, 2) !== 'FF') return undefined;
            const info = line.replace(/[\r\n]+$/, '').split(',');
            if (info.length < 5) return undefined;
            const model = info[info.length - 3];
            const variant = info[info.length - 2];
            const address = info[info.length - 1].toUpperCase();
            if (!/^[0-9A-Fa-f]{2}$/.test(variant) || !/^[0-9A-F]{12}$/.test(address))
                return undefined;
            return model === '0D'
                ? { model, address, variant }
                : { model, address, variant, foreign: true };
        }

        __txAllowed() {
            return this.__now() - this.__lastTxAt >= TX_MIN_GAP_MS;
        }
        __markTx() {
            this.__lastTxAt = this.__now();
        }
        __armDrain() {
            this.__drain = DRAIN_MAX;
            this.__drainNormalCount = 0;
        }
        __isValidFrame(l) {
            return (
                typeof l === 'string' &&
                l.length === 53 &&
                l[40] === '-' &&
                /^[0-9A-Fa-f]{12}$/.test(l.slice(41))
            );
        }

        __addTimeout(fn, ms) {
            const t = setTimeout(() => {
                const i = this.timeouts.indexOf(t);
                if (i >= 0) this.timeouts.splice(i, 1);
                fn();
            }, this.__clampMs(ms));
            this.timeouts.push(t);
            return t;
        }
        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) this.timeouts.splice(idx, 1);
        }
        __removeAllTimeouts() {
            this.timeouts.forEach((t) => clearTimeout(t));
            this.timeouts = [];
        }
        __clampMs(ms) {
            // 유한하지 않거나 상한을 넘으면 상한, 음수와 NaN 은 0
            ms = Number(ms);
            if (!(ms > 0)) return 0;
            return Math.min(Math.floor(ms), MAX_TIMER_MS);
        }
        __clearRealign() {
            if (this.realign && this.realign.timer) clearTimeout(this.realign.timer);
            this.realign = undefined;
        }

        __resolvePending(kind) {
            // CheeseRobot 의 콜백은 플래그만 세우므로 두 번 불려도 결과가 같다. 참조를 먼저 비우고 받아 둔 콜백을 부른다.
            const r = this.robot;
            if (kind === 'step') {
                const cb = r.stepCallback;
                r.stepCallback = undefined;
                if (cb) cb();
            } else if (kind === 'sound') {
                const cb = r.soundCallback;
                r.soundCallback = undefined;
                if (cb) cb();
            } else if (kind === 'neopixel') {
                const cb = r.neopixelCallback;
                r.neopixelCallback = undefined;
                if (cb) cb();
            } else if (kind === 'serialWrite') {
                const cbs = r.writeSerialCallbacks;
                r.writeSerialCallbacks = [];
                cbs.forEach((cb) => cb());
            } else if (kind === 'serialRead') {
                const cbs = r.readSerialCallbacks;
                r.readSerialCallbacks = [];
                cbs.forEach((cb) => cb());
            } else if (kind === 'note') {
                const sc = this.__noteScript;
                this.__noteScript = null;
                r.noteBlockId = 0;
                if (r.noteTimer1 !== undefined) {
                    this.__removeTimeout(r.noteTimer1);
                    r.noteTimer1 = undefined;
                }
                if (r.noteTimer2 !== undefined) {
                    this.__removeTimeout(r.noteTimer2);
                    r.noteTimer2 = undefined;
                }
                if (sc) sc.isPlaying = false;
            }
        }
        __resolveAllPending() {
            for (const k of ['step', 'sound', 'note', 'neopixel', 'serialWrite', 'serialRead'])
                this.__resolvePending(k);
        }

        __resetRobotNoPackets() {
            // CheeseRobot.setZero 에서 motoring 루프와 end() 두 줄(hat.end, __setNeopixel(neopixel.end()))을 뺀 것. 줄 순서는 그대로다.
            const r = this.robot;
            r.stepId = 0;
            r.soundId = 0;
            r.writeHatId = 0;
            r.writePidId = 0;
            r.writeNeopixelId = 0;
            r.pulseScId = -1;
            r.pulseLcId = -1;
            r.freeFallId = -1;
            r.tapId = -1;
            r.stepStateId = -1;
            r.soundStateId = -1;
            r.hatStateId = -1;
            r.pidStateId = -1;
            r.neopixelStateId = -1;
            r.readHatId = -1;
            r.readPidId = -1;

            r.blockId = 0;
            r.stepMode = 0x90;
            r.stepCallback = undefined;
            r.soundCallback = undefined;
            r.noteBlockId = 0;
            r.noteTimer1 = undefined;
            r.noteTimer2 = undefined;
            r.writeSerialCallbacks = [];
            r.readSerialCallbacks = [];
            r.serialInput = '';
            r.serialDelimiter = 0;
            r.serialPin = 2;
            r.serialRate = 0;
            r.serialRecvId = -1;
            r.neopixelCallback = undefined;
            r.pulseSc = false;
            r.pulseLc = false;
            r.freeFall = false;
            r.tap = false;
            r.modeMab = 0;
            r.tempo = 60;

            r.range.reset();
            r.buttonCounter.reset();
            r.buttonChecker = {};
            for (const i in r.leds) r.leds[i].reset();
            r.pid.reset();
            r.hat.reset(); // 패킷 없음
            r.__cancelNeopixel();
            r.neopixel = new CheeseNeopixel(); // 내부 버퍼, LED 수, 종류를 초기값으로. 패킷 없음
            r.__removeAllTimeouts();
            r.writeQueue.reset();
            r.readQueue.reset();
        }

        __resetSession() {
            // 연결 시(initialHandshake 머리, realigning 완료 직전). address/variant/state 와 __lastTxAt 은 건드리지 않는다.
            this.__clearRealign();
            this.__drain = 0;
            this.__drainNormalCount = 0;
            this.mismatchCount = 0;
            this.invalidCount = 0;
            this.__removeAllTimeouts();
            this.robot.__removeAllTimeouts();
            this.__resolveAllPending();
            this.__resetRobotNoPackets();
            this.motoring = this.__defaultMotoring();
            this.robot.setMotoring(this.motoring);
            this.out = this.__defaultMotoring();
            this.shadow = {
                stepId: 0,
                soundId: 0,
                writeHatId: 0,
                writePidId: 0,
                writeNeopixelId: 0,
            };
            Object.assign(this, this.__defaultHw());
            this.sensory = this.__defaultSensory();
        }

        async initialHandshake() {
            const serial = Entry.hwLite.serial;
            this.address = '';
            this.variant = '';
            this.state = 'handshaking';
            this.__resetSession();
            let timedOut = false;
            let timer;
            let result = 'timeout';
            let identity;
            const timeoutPromise = new Promise((resolve) => {
                timer = setTimeout(() => {
                    timedOut = true;
                    resolve('timeout');
                }, HANDSHAKE_TIMEOUT_MS);
            });
            const sendFF = () => {
                if (this.__txAllowed()) {
                    serial.sendAsciiAsBuffer('FF\r');
                    this.__markTx();
                }
            };
            try {
                sendFF();
                while (!timedOut) {
                    const r = await Promise.race([serial.reader.read(), timeoutPromise]); // 진행 중 read 는 항상 1개
                    if (r === 'timeout' || r.done) break;
                    const l = r.value;
                    if (!identity) {
                        if (typeof l === 'string' && l.slice(0, 5) === 'FF01,') {
                            const id = this.parseIdentityData(l);
                            if (!id) {
                                sendFF();
                                continue;
                            }
                            if (id.foreign) {
                                result = 'foreign';
                                break;
                            }
                            identity = id;
                            this.address = id.address;
                            this.variant = id.variant;
                        } else {
                            sendFF();
                        }
                    } else if (
                        this.__isValidFrame(l) &&
                        l[0] === '1' &&
                        l.slice(41).toUpperCase() === this.address
                    ) {
                        result = 'ok';
                        break;
                    }
                }
            } catch (error) {
                console.error(error);
                result = 'timeout';
            }
            clearTimeout(timer);
            if (result !== 'ok') {
                this.state = 'idle';
                this.__removeAllTimeouts();
                try {
                    await serial.removeSerialPort();
                } catch (error) {
                    console.error(error);
                } // 코어는 실패 시 포트를 닫지 않으므로 여기서 닫는다
                if (result === 'foreign') this.__toastForeign();
                return false;
            }
            this.state = 'ready';
            this.__armDrain(); // push 없음. 안전 프레임은 다음 수신 줄에서 정지 프레임과 같은 경로로 나간다
            return true;
        }

        __toastForeign() {
            if (Entry.toast && Entry.toast.alert)
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    this.__messages().foreignRobot,
                    false
                );
        }

        __gateOpen() {
            return (
                Entry.hwLite.getStatus() === 'connected' &&
                (this.__forceFrame || (Entry.engine && Entry.engine.isState('run'))) &&
                this.__txAllowed()
            );
        }
        __pushNow() {
            if (Entry.hwLite.getStatus() !== 'connected' || Entry.hwLite.hwModule !== this) return;
            try {
                this.__forceFrame = true;
                Entry.hwLite.serial.update();
            } finally {
                this.__forceFrame = false;
            }
        }

        // 송신
        requestLocalData() {
            // 코어 루프(엔진 실행 중)와 __pushNow(정지 프레임 내보내기)가 부른다. 송신 조건 밖에서는 상태를 바꾸지 않는다.
            if (this.state === 'realigning')
                return this.__forceFrame && this.__txAllowed() ? this.__realignPacket() : undefined; // 코어 루프는 undefined, __pushNow 만 FF 를 낸다
            if (this.state !== 'ready' || !this.__gateOpen()) return undefined;
            this.__clampToOut();
            this.__latchCommands(); // entry-hw cheese.js handleRemoteData 처럼 클램프한 뒤 id 래칭
            const line = this.__buildFrame();
            if (line) this.__markTx();
            return line;
        }
        __rd(v) {
            const j = JSON.parse(JSON.stringify({ v })).v;
            return j || 0;
        } // entry-hw dataHandler.ts 의 read 와 같다(JSON 왕복 뒤 || 0)
        __clampToOut() {
            // entry-hw cheese.js handleRemoteData 에서 id 래칭(step, sound, hat, pid, neopixel)을 뺀 나머지. 원문 순서 그대로다.
            // handler.e(K) 는 this.motoring.k !== undefined 로, handler.read(K) 는 this.__rd(this.motoring.k) 로 옮겼다.
            // 대입 대상 motoring 은 사본(out)이다.
            const motoring = this.out;
            let t;
            // mode
            if (this.motoring.modeSa !== undefined) {
                t = this.__rd(this.motoring.modeSa);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeSa = t;
            }
            if (this.motoring.modeSb !== undefined) {
                t = this.__rd(this.motoring.modeSb);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeSb = t;
            }
            if (this.motoring.modeSc !== undefined) {
                t = this.__rd(this.motoring.modeSc);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeSc = t;
            }
            if (this.motoring.modeLa !== undefined) {
                t = this.__rd(this.motoring.modeLa);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeLa = t;
            }
            if (this.motoring.modeLb !== undefined) {
                t = this.__rd(this.motoring.modeLb);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeLb = t;
            }
            if (this.motoring.modeLc !== undefined) {
                t = this.__rd(this.motoring.modeLc);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeLc = t;
            }
            if (this.motoring.modeMab !== undefined) {
                t = this.__rd(this.motoring.modeMab);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeMab = t;
            }
            if (this.motoring.modeMcd !== undefined) {
                t = this.__rd(this.motoring.modeMcd);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeMcd = t;
            }
            if (this.motoring.modePid !== undefined) {
                t = this.__rd(this.motoring.modePid);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modePid = t;
            }
            if (this.motoring.modeExt !== undefined) {
                t = this.__rd(this.motoring.modeExt);
                if (t < 0) {
                    t = 0;
                } else if (t > 255) {
                    t = 255;
                }
                motoring.modeExt = t;
            }
            // output S
            if (this.motoring.outputSa !== undefined) {
                t = this.__rd(this.motoring.outputSa);
                switch (motoring.modeSa) {
                    case CHEESE.MODE_S_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_S_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_S_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputSa = t;
            }
            if (this.motoring.outputSb !== undefined) {
                t = this.__rd(this.motoring.outputSb);
                switch (motoring.modeSb) {
                    case CHEESE.MODE_S_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_S_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_S_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputSb = t;
            }
            if (this.motoring.outputSc !== undefined) {
                t = this.__rd(this.motoring.outputSc);
                switch (motoring.modeSc) {
                    case CHEESE.MODE_S_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_S_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_S_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputSc = t;
            }
            // output L
            if (this.motoring.outputLa !== undefined) {
                t = this.__rd(this.motoring.outputLa);
                switch (motoring.modeLa) {
                    case CHEESE.MODE_L_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_L_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_L_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputLa = t;
            }
            if (this.motoring.outputLb !== undefined) {
                t = this.__rd(this.motoring.outputLb);
                switch (motoring.modeLb) {
                    case CHEESE.MODE_L_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_L_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_L_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputLb = t;
            }
            if (this.motoring.outputLc !== undefined) {
                t = this.__rd(this.motoring.outputLc);
                switch (motoring.modeLc) {
                    case CHEESE.MODE_L_DIGITAL_OUTPUT:
                        break;
                    case CHEESE.MODE_L_PWM_OUTPUT:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_L_SERVO_OUTPUT:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputLc = t;
            }
            // output M
            if (this.motoring.outputMab !== undefined) {
                t = this.__rd(this.motoring.outputMab);
                switch (motoring.modeMab) {
                    case CHEESE.MODE_M_DIGITAL_OUTPUT:
                        if (t != 0) {
                            t = 2;
                        }
                        break;
                    case CHEESE.MODE_M_DC:
                        if (t < -100) {
                            t = -100;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_M_SERVO_DUAL:
                    case CHEESE.MODE_M_SERVO_MONO:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputMab = t;
            }
            if (this.motoring.outputMcd !== undefined) {
                t = this.__rd(this.motoring.outputMcd);
                switch (motoring.modeMcd) {
                    case CHEESE.MODE_M_DIGITAL_OUTPUT:
                        if (t != 0) {
                            t = 2;
                        }
                        break;
                    case CHEESE.MODE_M_DC:
                        if (t < -100) {
                            t = -100;
                        } else if (t > 100) {
                            t = 100;
                        }
                        break;
                    case CHEESE.MODE_M_SERVO_DUAL:
                        if (t != 0) {
                            if (t < 1) {
                                t = 1;
                            } else if (t > 180) {
                                t = 180;
                            }
                        }
                        break;
                    default:
                        if (t < 0) {
                            t = 0;
                        } else if (t > 255) {
                            t = 255;
                        }
                        break;
                }
                motoring.outputMcd = t;
            }
            // buzzer
            if (this.motoring.buzzer !== undefined) {
                t = this.__rd(this.motoring.buzzer);
                if (t < 0) {
                    t = 0;
                } else if (t > 170000) {
                    t = 170000;
                }
                motoring.buzzer = t;
            }
            // velocity
            if (this.motoring.velocity !== undefined) {
                t = this.__rd(this.motoring.velocity);
                if (t < -500) {
                    t = -500;
                } else if (t > 500) {
                    t = 500;
                }
                motoring.velocity = t;
            }
            // note
            if (this.motoring.note !== undefined) {
                t = this.__rd(this.motoring.note);
                if (t < 0) {
                    t = 0;
                } else if (t > 88) {
                    t = 88;
                }
                motoring.note = t;
            }
        }
        __latchCommands() {
            const m = this.motoring,
                o = this.out,
                s = this.shadow;
            // step 래칭(entry-hw 원문): `if (handler.e(STEP_ID)) { t = read(STEP_ID); if (t != motoring.stepId) { motoring.stepId = t; t = read(STEP); 클램프; motoring.step = t; this.step.written = true; } }`
            if (m.stepId !== s.stepId) {
                s.stepId = m.stepId;
                let t = this.__rd(m.step);
                if (t < 0) t = 0;
                else if (t > 65535) t = 65535;
                o.step = t;
                this.step.written = true;
            }
            // sound 래칭
            if (m.soundId !== s.soundId) {
                s.soundId = m.soundId;
                let t = this.__rd(m.sound);
                if (t < 0) t = 0;
                else if (t > 127) t = 127;
                const t2 = this.__rd(m.soundRepeat);
                this.__runSound(t, t2);
            }
            // hat 래칭(배열은 entry-hw 처럼 통째로 읽고 원소를 복사한다)
            if (m.writeHatId !== s.writeHatId) {
                s.writeHatId = m.writeHatId;
                const t = this.__rd(m.writeHat);
                if (t) {
                    const a = this.__getOrCreateWriteHatArray();
                    for (let i = 0; i < 20; ++i) a[i] = t[i];
                    if ((t[0] & 0xf0) == 0x20)
                        this.hat.activated = ((t[1] & 0xff) << 4) | (t[0] & 0x0f);
                    this.hat.written = true;
                }
            } // activated 는 entry-hw 원문대로 둔다. reset 에서만 읽혀 여기서는 쓰이지 않는다
            // pid 래칭
            if (m.writePidId !== s.writePidId) {
                s.writePidId = m.writePidId;
                const t = this.__rd(m.writePid);
                if (t) {
                    const a = this.__getOrCreateWritePidArray();
                    for (let i = 0; i < 20; ++i) a[i] = t[i];
                    this.pid.written = true;
                }
            }
            // neopixel 래칭
            if (m.writeNeopixelId !== s.writeNeopixelId) {
                s.writeNeopixelId = m.writeNeopixelId;
                const t = this.__rd(m.writeNeopixel);
                if (t) {
                    const a = this.__getOrCreateWriteNeopixelArray();
                    for (let i = 0; i < 20; ++i) a[i] = t[i];
                    this.neopixel.activated = true;
                    this.neopixel.written = true;
                }
            }
        }
        toHex(number) {
            let value = parseInt(number);
            if (value < 0) {
                value += 0x100;
            }

            value = value.toString(16).toUpperCase();
            if (value.length > 1) {
                return value;
            } else {
                return `0${value}`;
            }
        }
        toHex2(number) {
            let value = parseInt(number);
            if (value < 0) {
                value += 0x10000;
            }

            value = value.toString(16).toUpperCase();
            let result = '';
            for (let i = value.length; i < 4; ++i) {
                result += '0';
            }
            return result + value;
        }
        __runSound(sound, count) {
            if (typeof count != 'number') {
                count = 1;
            }
            if (count < 0) {
                count = -1;
            }
            if (count) {
                const motoring = this.out;
                motoring.sound = sound;
                motoring.soundRepeat = count;
                this.sound.written = true;
            }
        }
        __getOrCreateWriteHatArray() {
            const motoring = this.out;
            if (motoring.writeHat == undefined) {
                motoring.writeHat = new Array(20);
            }
            return motoring.writeHat;
        }
        __getOrCreateWritePidArray() {
            const motoring = this.out;
            if (motoring.writePid == undefined) {
                motoring.writePid = new Array(20);
            }
            return motoring.writePid;
        }
        __getOrCreateWriteNeopixelArray() {
            const motoring = this.out;
            if (motoring.writeNeopixel == undefined) {
                motoring.writeNeopixel = new Array(20);
            }
            return motoring.writeNeopixel;
        }
        __buildFrame() {
            // entry-hw cheese.js requestLocalData 원문. motoring 은 사본(out)이다.
            const self = this;
            const motoring = this.out;
            const port = this.port;

            // hat
            if (self.hat.written && self.packetSent != CHEESE.PACKET_HAT) {
                self.hat.written = false;
                self.packetSent = CHEESE.PACKET_HAT;
                self.hat.sendId = (self.hat.sendId % 255) + 1;

                const writeHat = motoring.writeHat;
                if (self.hat.deactivating) {
                    self.hat.deactivating = false;
                    motoring.writeHat = undefined;
                }
                if (writeHat) {
                    var str = '';
                    for (var i = 0; i < 20; ++i) {
                        str += self.toHex(writeHat[i]);
                    }
                    str += '-';
                    str += self.address;
                    str += '\r';
                    return str;
                }
            }

            // pid
            if (
                self.pid.written &&
                port.modePid == motoring.modePid &&
                self.packetSent != CHEESE.PACKET_PID
            ) {
                self.pid.written = false;
                self.packetSent = CHEESE.PACKET_PID;
                self.pid.sendId = (self.pid.sendId % 255) + 1;

                const writePid = motoring.writePid;
                if (writePid) {
                    var str = '';
                    for (var i = 0; i < 20; ++i) {
                        str += self.toHex(writePid[i]);
                    }
                    str += '-';
                    str += self.address;
                    str += '\r';
                    return str;
                }
            }

            // neopixel
            if (self.neopixel.written && self.packetSent != CHEESE.PACKET_NEOPIXEL) {
                self.neopixel.written = false;
                self.packetSent = CHEESE.PACKET_NEOPIXEL;
                self.neopixel.sendId = (self.neopixel.sendId % 255) + 1;

                const writeNeopixel = motoring.writeNeopixel;
                if (self.neopixel.deactivating) {
                    self.neopixel.deactivating = false;
                    motoring.writeNeopixel = undefined;
                }
                if (writeNeopixel) {
                    if (writeNeopixel[19] == 1) {
                        self.neopixel.updateId = (self.neopixel.updateId % 255) + 1;
                    }
                    var str = '';
                    for (var i = 0; i < 20; ++i) {
                        str += self.toHex(writeNeopixel[i]);
                    }
                    str += '-';
                    str += self.address;
                    str += '\r';
                    return str;
                }
            }

            var str = '10';
            // mode S
            let tmp = 0;
            switch (motoring.modeSa) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT:
                case CHEESE.MODE_S_BUTTON_INPUT:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    tmp |= 0x01;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_S_PWM_OUTPUT:
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    tmp |= 0x02;
                    break;
                case CHEESE.MODE_S_SERVO_OUTPUT:
                    tmp |= 0x03;
                    break;
                case CHEESE.MODE_SA_NEOPIXEL_OUTPUT:
                    tmp |= 0x80;
                    break;
            }
            switch (motoring.modeSb) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT:
                case CHEESE.MODE_S_BUTTON_INPUT:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    tmp |= 0x04;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_S_PWM_OUTPUT:
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    tmp |= 0x08;
                    break;
                case CHEESE.MODE_S_SERVO_OUTPUT:
                    tmp |= 0x0c;
                    break;
                case CHEESE.MODE_SA_NEOPIXEL_OUTPUT:
                    break;
            }
            switch (motoring.modeSc) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT:
                case CHEESE.MODE_S_BUTTON_INPUT:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    tmp |= 0x10;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp |= 0x40;
                    break;
                case CHEESE.MODE_S_PWM_OUTPUT:
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    tmp |= 0x20;
                    break;
                case CHEESE.MODE_S_SERVO_OUTPUT:
                    tmp |= 0x30;
                    break;
                case CHEESE.MODE_SA_NEOPIXEL_OUTPUT:
                    break;
            }
            str += self.toHex(tmp);

            // mode L
            tmp = 0;
            switch (motoring.modeLa) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT:
                case CHEESE.MODE_L_BUTTON_INPUT:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    tmp |= 0x01;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_L_PWM_OUTPUT:
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    tmp |= 0x02;
                    break;
                case CHEESE.MODE_L_SERVO_OUTPUT:
                    tmp |= 0x03;
                    break;
            }
            switch (motoring.modeLb) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT:
                case CHEESE.MODE_L_BUTTON_INPUT:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    tmp |= 0x04;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_L_PWM_OUTPUT:
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    tmp |= 0x08;
                    break;
                case CHEESE.MODE_L_SERVO_OUTPUT:
                    tmp |= 0x0c;
                    break;
            }
            switch (motoring.modeLc) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT:
                case CHEESE.MODE_L_BUTTON_INPUT:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K:
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K:
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE:
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE:
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    tmp |= 0x10;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp |= 0x40;
                    break;
                case CHEESE.MODE_L_PWM_OUTPUT:
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    tmp |= 0x20;
                    break;
                case CHEESE.MODE_L_SERVO_OUTPUT:
                    tmp |= 0x30;
                    break;
            }
            str += self.toHex(tmp);

            // mode M
            tmp = 0;
            switch (motoring.modeMab) {
                case CHEESE.MODE_M_DIGITAL_OUTPUT:
                case CHEESE.MODE_M_DC:
                case CHEESE.MODE_M_SERVO_DUAL:
                case CHEESE.MODE_MAB_SOUND:
                    switch (motoring.modeMab) {
                        case CHEESE.MODE_M_DIGITAL_OUTPUT:
                            break;
                        case CHEESE.MODE_M_DC:
                            tmp |= 0x01;
                            break;
                        case CHEESE.MODE_M_SERVO_DUAL:
                            tmp |= 0x02;
                            break;
                        case CHEESE.MODE_MAB_SOUND:
                            tmp |= 0x03;
                            break;
                    }
                    switch (motoring.modeMcd) {
                        case CHEESE.MODE_M_DIGITAL_OUTPUT:
                            break;
                        case CHEESE.MODE_M_DC:
                            tmp |= 0x04;
                            break;
                        case CHEESE.MODE_M_SERVO_DUAL:
                            tmp |= 0x08;
                            break;
                    }
                    break;
                case CHEESE.MODE_M_SERVO_MONO:
                    tmp |= 0x40;
                    break;
                case CHEESE.MODE_M_STEP_SW_OFF:
                    tmp |= 0x80;
                    break;
                case CHEESE.MODE_M_STEP_SW_WAVE:
                    tmp |= 0x90;
                    break;
                case CHEESE.MODE_M_STEP_SW_FULL:
                    tmp |= 0xa0;
                    break;
                case CHEESE.MODE_M_STEP_HW_OFF:
                    tmp |= 0xc0;
                    break;
                case CHEESE.MODE_M_STEP_HW_WAVE:
                    tmp |= 0xd0;
                    break;
                case CHEESE.MODE_M_STEP_HW_FULL:
                    tmp |= 0xe0;
                    break;
            }
            str += self.toHex(tmp);

            // mode pid
            str += self.toHex(motoring.modePid & 0xff);

            // config gravity / band width
            tmp = 0;
            str += self.toHex(tmp);

            // output S
            switch (motoring.modeSa) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_S_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_S_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    if (motoring.outputSa == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                case CHEESE.MODE_SA_NEOPIXEL_OUTPUT:
                    tmp = self.neopixel.updateId;
                    break;
                default:
                    tmp = motoring.outputSa;
                    break;
            }
            str += self.toHex(tmp);
            switch (motoring.modeSb) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_S_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_S_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    if (motoring.outputSb == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                default:
                    tmp = motoring.outputSb;
                    break;
            }
            str += self.toHex(tmp);
            switch (motoring.modeSc) {
                //		case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_S_MAKEY_INPUT
                case CHEESE.MODE_S_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_S_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_S_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_S_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_S_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_S_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_S_DIGITAL_OUTPUT:
                    if (motoring.outputSc == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                default:
                    tmp = motoring.outputSc;
                    break;
            }
            str += self.toHex(tmp);

            // output L
            switch (motoring.modeLa) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_L_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_L_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    if (motoring.outputLa == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                default:
                    tmp = motoring.outputLa;
                    break;
            }
            str += self.toHex(tmp);
            switch (motoring.modeLb) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_L_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_L_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    if (motoring.outputLb == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                default:
                    tmp = motoring.outputLb;
                    break;
            }
            str += self.toHex(tmp);
            switch (motoring.modeLc) {
                //		case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_2M: == MODE_L_MAKEY_INPUT
                case CHEESE.MODE_L_MAKEY_INPUT: // pull down 2M
                case CHEESE.MODE_L_ANALOG_INPUT_RELATIVE: // pull down 2M
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_L_BUTTON_INPUT: // pull up 50K
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_UP_50K: // pull up 50K
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_L_DIGITAL_INPUT_PULL_DOWN_50K: // pull down 50K
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_L_ANALOG_INPUT_ABSOLUTE: // pull down 2M
                case CHEESE.MODE_L_VOLTAGE_INPUT: // pull down 2M
                    tmp = 0x10;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                    tmp = 0x00;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                    tmp = 0x01;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K:
                    tmp = 0x02;
                    break;
                case CHEESE.MODE_L_DIGITAL_OUTPUT:
                    if (motoring.outputLc == 0) {
                        tmp = 0;
                    } else {
                        tmp = 255;
                    }
                    break;
                default:
                    tmp = motoring.outputLc;
                    break;
            }
            str += self.toHex(tmp);

            // output M
            switch (motoring.modeMab) {
                case CHEESE.MODE_M_STEP_SW_OFF:
                case CHEESE.MODE_M_STEP_SW_WAVE:
                case CHEESE.MODE_M_STEP_SW_FULL:
                case CHEESE.MODE_M_STEP_HW_OFF:
                case CHEESE.MODE_M_STEP_HW_WAVE:
                case CHEESE.MODE_M_STEP_HW_FULL:
                    str += self.toHex2(motoring.velocity);
                    break;
                default:
                    str += self.toHex(motoring.outputMab);
                    str += self.toHex(motoring.outputMcd);
                    break;
            }

            // led, step
            const step = self.step;
            step.pulse = motoring.step;
            if (step.written) {
                step.written = false;
                if (step.pulse != 0 || step.pulsePrev != 0) {
                    step.id = (step.id % 3) + 1;
                }
                if (step.pulse > 0) {
                    step.event = 1;
                } else {
                    step.event = 0;
                }
                step.pulsePrev = step.pulse;
            }
            tmp = step.id & 0x03;
            str += self.toHex(tmp);
            str += self.toHex2(step.pulse);

            // sound
            const sound = self.sound;
            let sndid = 0;
            switch (motoring.sound) {
                case CHEESE.SOUND_OFF:
                    sndid = 0x00;
                    break;
                case CHEESE.SOUND_BEEP:
                    sndid = 0x01;
                    break;
                case CHEESE.SOUND_RANDOM_BEEP:
                    sndid = 0x05;
                    break;
                case CHEESE.SOUND_NOISE:
                    sndid = 0x07;
                    break;
                case CHEESE.SOUND_SIREN:
                    sndid = 0x09;
                    break;
                case CHEESE.SOUND_ENGINE:
                    sndid = 0x0b;
                    break;
                case CHEESE.SOUND_CHOP:
                    sndid = 0x12;
                    break;
                case CHEESE.SOUND_ROBOT:
                    sndid = 0x20;
                    break;
                case CHEESE.SOUND_DIBIDIBIDIP:
                    sndid = 0x21;
                    break;
                case CHEESE.SOUND_GOOD_JOB:
                    sndid = 0x23;
                    break;
                case CHEESE.SOUND_HAPPY:
                    sndid = 0x30;
                    break;
                case CHEESE.SOUND_ANGRY:
                    sndid = 0x31;
                    break;
                case CHEESE.SOUND_SAD:
                    sndid = 0x32;
                    break;
                case CHEESE.SOUND_SLEEP:
                    sndid = 0x33;
                    break;
                case CHEESE.SOUND_MARCH:
                    sndid = 0x34;
                    break;
                case CHEESE.SOUND_BIRTHDAY:
                    sndid = 0x35;
                    break;
            }
            if (sound.written) {
                sound.written = false;
                if (sndid > 0) {
                    sound.flag ^= 0x80;
                    sound.event = 1;
                } else {
                    sound.event = 0;
                }
            }
            if (sndid > 0) {
                // sound
                str += '00';
                str += self.toHex(sndid | sound.flag);
                sound.prev = sndid;
            } else if (sound.prev > 0) {
                sound.prev = 0;
                str += '0000';
            } else if (motoring.note > 0) {
                // note
                str += '01';
                str += self.toHex(motoring.note);
            } else {
                // buzzer
                tmp = parseInt(motoring.buzzer * 100);
                if (tmp < 10000) {
                    tmp += 512;
                } else if (tmp < 100001) {
                    tmp = ((tmp - 10000) >> 2) + 10512;
                } else if (tmp < 999970) {
                    tmp = ((tmp - 100001) >> 6) + 33013;
                } else if (tmp < 9999907) {
                    tmp = ((tmp - 999970) >> 9) + 47076;
                } else {
                    tmp = ((tmp - 9999907) >> 13) + 64655;
                }
                str += self.toHex2(tmp);
            }

            // mode X
            str += '00';

            str += '-';
            str += self.address;
            str += '\r';
            self.packetSent = CHEESE.PACKET_NORMAL;
            return str;
        }
        __resetState() {
            // 정지(CheeseRobot.setZero 대응). shadow(마지막으로 보낸 id)는 종류별로 다르게 맞춘다.
            this.__removeAllTimeouts();
            this.robot.__removeAllTimeouts();
            this.__resolveAllPending();
            const r = this.robot,
                m = this.motoring;
            for (const k in CheeseRobot.prototype.__PORT_MAP)
                m[k] = CheeseRobot.prototype.__PORT_MAP[k]; // stepId, soundId 도 0. shadow 는 그대로 두어 id 가 N 에서 0 으로 바뀐 것으로 보이게 한다
            m.index = 0;
            m.writeHatId = 0;
            m.writePidId = 0;
            m.writeNeopixelId = 0;
            this.shadow.writeHatId = 0;
            this.shadow.writePidId = 0;
            this.shadow.writeNeopixelId = 0; // motoring 과 shadow 를 함께 0 으로 맞춰 바뀐 것으로 보이지 않게 한다
            this.pid.written = false;
            this.out.writePid = undefined; // 묵은 시리얼 청크 폐기(CheeseRobot 쪽 motoring.writePid 는 그대로)
            if (this.state === 'ready') {
                // CheeseRobot.setZero 원문(카운터 5종 0, 래치 11종 -1, 상태 초기화, pid.reset)
                r.stepId = 0;
                r.soundId = 0;
                r.writeHatId = 0;
                r.writePidId = 0;
                r.writeNeopixelId = 0;
                r.pulseScId = -1;
                r.pulseLcId = -1;
                r.freeFallId = -1;
                r.tapId = -1;
                r.stepStateId = -1;
                r.soundStateId = -1;
                r.hatStateId = -1;
                r.pidStateId = -1;
                r.neopixelStateId = -1;
                r.readHatId = -1;
                r.readPidId = -1;

                r.blockId = 0;
                r.stepMode = 0x90; // sw wave
                r.stepCallback = undefined;
                r.soundCallback = undefined;
                r.noteBlockId = 0;
                r.noteTimer1 = undefined;
                r.noteTimer2 = undefined;
                r.writeSerialCallbacks = [];
                r.readSerialCallbacks = [];
                r.serialInput = '';
                r.serialDelimiter = 0;
                r.serialPin = 2;
                r.serialRate = 0;
                r.serialRecvId = -1;
                r.neopixelCallback = undefined;
                r.pulseSc = false;
                r.pulseLc = false;
                r.freeFall = false;
                r.tap = false;
                r.modeMab = 0;
                r.tempo = 60;

                r.range.reset();
                r.buttonCounter.reset();
                r.buttonChecker = {};
                for (const i in r.leds) {
                    r.leds[i].reset();
                }
                r.pid.reset();
                r.hat.end();
                r.__cancelNeopixel();
                r.__setNeopixel(r.neopixel.end()); // __issueHat, __issueNeopixel 이 motoring id 를 1 로 올리므로 0 에서 1 로 바뀐 것으로 보인다
                r.__removeAllTimeouts();
                r.writeQueue.reset();
                r.readQueue.reset();
            } else {
                this.__resetRobotNoPackets(); // ready 가 아니면 end() 를 부르지 않는다
            }
        }
        setZero() {
            this.__resetState();
            if (this.state === 'ready') {
                // 송신 없이 entry-hw handleRemoteData 를 한 번 거친 것과 같다(모드와 출력 클램프, 래칭).
                // shadow 가 motoring 과 같아지고 out 의 모드가 바로 정지 값이 된다. step, sound 의
                // written 은 다음에 내보낼 프레임을 만들 때 반영된다.
                this.__clampToOut();
                this.__latchCommands();
                this.__armDrain();
            } else {
                this.__drain = 0;
            }
        }
        __drainStep() {
            // handleLocalData 에서 센서 값을 넘기기 직전에 부른다.
            if (this.__drain <= 0) return;
            if (Entry.engine && Entry.engine.isState('run')) {
                this.__drain = 0;
                return;
            } // 코어 루프가 송신을 맡는다(run 전환 감지)
            if (!this.__txAllowed()) return; // 시간 게이트에 막히면 다음 줄에서 (ready 검사는 handleLocalData 가 이미 했다)
            this.__pushNow();
            this.__drain--;
            if (this.packetSent === CHEESE.PACKET_NORMAL) this.__drainNormalCount++;
            if (
                this.__drainNormalCount >= 2 &&
                !this.hat.written &&
                !this.pid.written &&
                !this.neopixel.written
            )
                this.__drain = 0;
        }

        // 수신
        handleLocalData(line) {
            if (this.state === 'realigning') return this.__realignStep(line); // 로봇 교체 처리 중
            if (this.state !== 'ready') return;
            if (typeof line === 'string' && line.startsWith('FF01,')) return;
            if (!this.__isValidFrame(line)) {
                this.__countInvalid();
                return;
            }
            this.invalidCount = 0;
            if (line.slice(41).toUpperCase() !== this.address) {
                this.__onAddressMismatch();
                return;
            } // 불일치 프레임은 항상 버린다
            this.mismatchCount = 0;
            this.packetReceived = 0; // entry-hw cheese.js handleLocalData 와 같다
            const nib = parseInt(line[0], 16);
            if (nib === 1) {
                this.__parseNormal(line);
                this.__handleExtensionSensory();
            } else if (nib === 2) {
                this.__parseHat(line);
                this.__handleExtensionSensory();
            } else if (nib === 3) {
                this.__parsePid(line);
                this.__handleExtensionSensory();
            }
            // 4 이상: 아무것도 하지 않는다(entry-hw cheese.js 와 같다)
            this.__drainStep(); // 센서 값을 넘기기 전에 정지 프레임을 내보낸다
            this.__publish();
        }
        __publish() {
            const pd = JSON.parse(JSON.stringify(this.sensory));
            pd.model = 0x0d;
            pd.index = 0;
            pd.company = 0x02;
            this.robot.afterReceive(pd); // CheeseRobot.afterReceive -> handleSensory
            const sensory = this.sensory;
            sensory.pulseSc = 0;
            sensory.pulseLc = 0;
            sensory.freeFall = 0;
            sensory.tap = 0;
            sensory.stepState = -1;
            sensory.soundState = -1;
            sensory.hatState = 0;
            sensory.pidState = 0;
            sensory.neopixelState = 0; // entry-hw requestRemoteData 가 값을 넘긴 직후 지우던 값들
            this.__armAfterSend();
        }
        __armAfterSend() {
            // 하드웨어 연결 프로그램에서 CheeseRobot.afterSend 는 엔진 틱 말미에 불린다. 엔진 실행 중이면
            // engine.setTimeout(0) 이 같은 자리다. 아니면 다음 수신 처리가 덮는다.
            if (
                Entry.engine &&
                typeof Entry.engine.isState === 'function' &&
                Entry.engine.isState('run') &&
                typeof Entry.engine.setTimeout === 'function'
            )
                Entry.engine.setTimeout(() => this.robot.afterSend(this.motoring), 0);
        }
        __parseNormal(data) {
            const motoring = this.out;
            const sensory = this.sensory;
            let str, value;
            const event = this.event;

            // input S
            str = data.slice(2, 4);
            value = parseInt(str, 16);
            switch (motoring.modeSa) {
                case CHEESE.MODE_S_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputSa = 1;
                    } else {
                        sensory.inputSa = 0;
                    }
                    break;
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    sensory.inputSa = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                default:
                    sensory.inputSa = value;
                    break;
            }
            str = data.slice(4, 6);
            value = parseInt(str, 16);
            switch (motoring.modeSb) {
                case CHEESE.MODE_S_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputSb = 1;
                    } else {
                        sensory.inputSb = 0;
                    }
                    break;
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    sensory.inputSb = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                default:
                    sensory.inputSb = value;
                    break;
            }
            str = data.slice(6, 8);
            value = parseInt(str, 16);
            switch (motoring.modeSc) {
                case CHEESE.MODE_S_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputSc = 1;
                    } else {
                        sensory.inputSc = 0;
                    }
                    break;
                case CHEESE.MODE_S_VOLTAGE_INPUT:
                    sensory.inputSc = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_SC_PULSE_INPUT_PULL_DOWN_50K: {
                    sensory.inputSc = (value >> 7) & 0x01;
                    if ((value & 0x7f) > 0) {
                        sensory.pulseSc = 1;
                        sensory.pulseScId = (sensory.pulseScId % 255) + 1;
                    }
                    break;
                }
                default:
                    sensory.inputSc = value;
                    break;
            }

            // input L
            str = data.slice(8, 10);
            value = parseInt(str, 16);
            switch (motoring.modeLa) {
                case CHEESE.MODE_L_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputLa = 1;
                    } else {
                        sensory.inputLa = 0;
                    }
                    break;
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    sensory.inputLa = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                default:
                    sensory.inputLa = value;
                    break;
            }
            str = data.slice(10, 12);
            value = parseInt(str, 16);
            switch (motoring.modeLb) {
                case CHEESE.MODE_L_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputLb = 1;
                    } else {
                        sensory.inputLb = 0;
                    }
                    break;
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    sensory.inputLb = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                default:
                    sensory.inputLb = value;
                    break;
            }
            str = data.slice(12, 14);
            value = parseInt(str, 16);
            switch (motoring.modeLc) {
                case CHEESE.MODE_L_BUTTON_INPUT:
                    if (value == 0) {
                        sensory.inputLc = 1;
                    } else {
                        sensory.inputLc = 0;
                    }
                    break;
                case CHEESE.MODE_L_VOLTAGE_INPUT:
                    sensory.inputLc = Math.round((value * 360) / 255.0) / 100.0;
                    break;
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_2M:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_UP_50K:
                case CHEESE.MODE_LC_PULSE_INPUT_PULL_DOWN_50K: {
                    sensory.inputLc = (value >> 7) & 0x01;
                    if ((value & 0x7f) > 0) {
                        sensory.pulseLc = 1;
                        sensory.pulseLcId = (sensory.pulseLcId % 255) + 1;
                    }
                    break;
                }
                default:
                    sensory.inputLc = value;
                    break;
            }

            // acceleration
            const acc = this.acceleration;
            if (acc.count < 5) {
                ++acc.count;
            } else {
                acc.index %= 5;
                acc.sumx -= acc.x[acc.index];
                acc.sumy -= acc.y[acc.index];
                acc.sumz -= acc.z[acc.index];
            }
            // acceleration x
            str = data.slice(14, 18);
            value = parseInt(str, 16) & 0xfff;
            if (value > 0x7ff) {
                value -= 0x1000;
            }
            value *= 16;
            acc.sumx += value;
            acc.x[acc.index] = value;
            // acceleration y
            str = data.slice(18, 22);
            value = parseInt(str, 16) & 0xfff;
            if (value > 0x7ff) {
                value -= 0x1000;
            }
            value *= 16;
            acc.sumy += value;
            acc.y[acc.index] = value;
            // acceleration z
            str = data.slice(22, 26);
            value = parseInt(str, 16) & 0xfff;
            if (value > 0x7ff) {
                value -= 0x1000;
            }
            value *= -16;
            acc.sumz += value;
            acc.z[acc.index] = value;
            ++acc.index;
            sensory.accelerationX = Math.round(acc.sumx / acc.count);
            sensory.accelerationY = Math.round(acc.sumy / acc.count);
            sensory.accelerationZ = Math.round(acc.sumz / acc.count);
            // tilt
            if (
                sensory.accelerationZ < 8192 &&
                sensory.accelerationX > 8192 &&
                sensory.accelerationY > -4096 &&
                sensory.accelerationY < 4096
            ) {
                value = 1;
            } else if (
                sensory.accelerationZ < 8192 &&
                sensory.accelerationX < -8192 &&
                sensory.accelerationY > -4096 &&
                sensory.accelerationY < 4096
            ) {
                value = -1;
            } else if (
                sensory.accelerationZ < 8192 &&
                sensory.accelerationY > 8192 &&
                sensory.accelerationX > -4096 &&
                sensory.accelerationX < 4096
            ) {
                value = 2;
            } else if (
                sensory.accelerationZ < 8192 &&
                sensory.accelerationY < -8192 &&
                sensory.accelerationX > -4096 &&
                sensory.accelerationX < 4096
            ) {
                value = -2;
            } else if (
                sensory.accelerationZ > 12288 &&
                sensory.accelerationX > -8192 &&
                sensory.accelerationX < 8192 &&
                sensory.accelerationY > -8192 &&
                sensory.accelerationY < 8192
            ) {
                value = 3;
            } else if (
                sensory.accelerationZ < -12288 &&
                sensory.accelerationX > -4096 &&
                sensory.accelerationX < 4096 &&
                sensory.accelerationY > -4096 &&
                sensory.accelerationY < 4096
            ) {
                value = -3;
            } else {
                value = 0;
            }
            sensory.tilt = value;

            // step count
            str = data.slice(26, 30);
            value = parseInt(str, 16);
            if (value > 0x7fff) {
                value -= 0x10000;
            }
            sensory.stepCount = value;

            // free fall
            str = data.slice(30, 32);
            value = parseInt(str, 16);
            let id = (value >> 6) & 0x03;
            if (id != event.freeFallId) {
                if (event.freeFallId != -1) {
                    sensory.freeFall = 1;
                    sensory.freeFallId = (sensory.freeFallId % 255) + 1;
                }
                event.freeFallId = id;
            }

            // tap
            id = (value >> 4) & 0x03;
            if (id != event.tapId) {
                if (event.tapId != -1) {
                    sensory.tap = 1;
                    sensory.tapId = (sensory.tapId % 255) + 1;
                }
                event.tapId = id;
            }

            // step state
            str = data.slice(32, 34);
            value = parseInt(str, 16);
            id = (value >> 6) & 0x03;
            const step = this.step;
            if (step.event == 1) {
                if (id != step.stateId && step.stateId != -1) {
                    sensory.stepState = 0;
                    sensory.stepStateId = (sensory.stepStateId % 255) + 1;
                    step.event = 0;
                }
            }
            step.stateId = id;

            // sound state
            id = (value >> 4) & 0x03;
            const sound = this.sound;
            if (sound.event == 1) {
                if (id != sound.stateId && sound.stateId != -1) {
                    sound.event = 0;
                    if (motoring.sound > 0) {
                        if (motoring.soundRepeat < 0) {
                            this.__runSound(motoring.sound, -1);
                        } else if (motoring.soundRepeat > 1) {
                            motoring.soundRepeat--;
                            this.__runSound(motoring.sound, motoring.soundRepeat);
                        } else {
                            motoring.sound = 0;
                            motoring.soundRepeat = 1;
                            sensory.soundState = 0;
                            sensory.soundStateId = (sensory.soundStateId % 255) + 1;
                        }
                    } else {
                        motoring.sound = 0;
                        motoring.soundRepeat = 1;
                        sensory.soundState = 0;
                        sensory.soundStateId = (sensory.soundStateId % 255) + 1;
                    }
                }
            }
            sound.stateId = id;

            // battery state
            let state = value & 0x03;
            if (state == 0) {
                state = 2;
            } // normal
            else if (state >= 2) {
                state = 0;
            } // empty
            sensory.batteryState = state;

            // ack
            const port = this.port;
            id = (value >> 2) & 0x03;
            if (id != port.ackId) {
                if (port.ackId != -1) {
                    port.modePid = motoring.modePid;
                }
                port.ackId = id;
            }

            // temperature
            str = data.slice(34, 36);
            value = parseInt(str, 16);
            if (value > 0x7f) {
                value -= 0x100;
            }
            value = value / 2.0 + 23;
            sensory.internalTemperature = parseInt(value);

            // signal strength
            str = data.slice(36, 38);
            value = parseInt(str, 16);
            value -= 0x100;
            sensory.signalStrength = value;

            this.packetReceived = CHEESE.PACKET_NORMAL;
        }
        __parseHat(data) {
            const sensory = this.sensory;
            let str;
            const readHat = this.__getOrCreateReadHatArray();
            for (var i = 0, j = 0; i < 20; ++i, j += 2) {
                str = data.slice(j, j + 2);
                readHat[i] = parseInt(str, 16);
            }
            sensory.readHatId = (sensory.readHatId % 255) + 1;
            this.packetReceived = CHEESE.PACKET_HAT;
        }
        __parsePid(data) {
            const motoring = this.out;
            const sensory = this.sensory;
            let str;
            if (motoring.modePid > 0) {
                const readPid = this.__getOrCreateReadPidArray();
                for (var i = 0, j = 0; i < 20; ++i, j += 2) {
                    str = data.slice(j, j + 2);
                    readPid[i] = parseInt(str, 16);
                }
                sensory.readPidId = (sensory.readPidId % 255) + 1;
            }
            this.packetReceived = CHEESE.PACKET_PID;
        }
        __handleExtensionSensory() {
            const sensory = this.sensory;
            const hat = this.hat;
            if (hat.sendId != hat.sendPrevId) {
                hat.sendPrevId = hat.sendId;
                sensory.hatState = 1;
                sensory.hatStateId = (sensory.hatStateId % 255) + 1;
            }
            const pid = this.pid;
            if (pid.sendId != pid.sendPrevId) {
                pid.sendPrevId = pid.sendId;
                sensory.pidState = 1;
                sensory.pidStateId = (sensory.pidStateId % 255) + 1;
            }
            const neopixel = this.neopixel;
            if (neopixel.sendId != neopixel.sendPrevId) {
                neopixel.sendPrevId = neopixel.sendId;
                sensory.neopixelState = 1;
                sensory.neopixelStateId = (sensory.neopixelStateId % 255) + 1;
            }
        }
        __getOrCreateReadHatArray() {
            const sensory = this.sensory;
            if (sensory.readHat == undefined) {
                sensory.readHat = new Array(20);
            }
            return sensory.readHat;
        }
        __getOrCreateReadPidArray() {
            const sensory = this.sensory;
            if (sensory.readPid == undefined) {
                sensory.readPid = new Array(20);
            }
            return sensory.readPid;
        }
        __countInvalid() {
            if (++this.invalidCount >= INVALID_LINE_LIMIT) {
                this.invalidCount = 0;
                this.__startRealign();
            }
        }
        __onAddressMismatch() {
            if (++this.mismatchCount >= MISMATCH_LIMIT) {
                this.mismatchCount = 0;
                this.__startRealign();
            }
        }
        // 세션 중 로봇 교체. FF 재핸드셰이크 뒤 새 주소의 일반 프레임을 기다리는 두 단계다(보정 왕복 없음).
        __startRealign() {
            this.__clearRealign();
            this.mismatchCount = 0;
            this.invalidCount = 0;
            this.state = 'realigning';
            this.__drain = 0;
            this.__resolveAllPending();
            this.__removeAllTimeouts();
            this.realign = {
                pending: 'FF',
                timer: setTimeout(() => {
                    const hw = Entry.hwLite;
                    if (
                        !hw ||
                        (typeof hw.getStatus === 'function' && hw.getStatus() !== 'connected') ||
                        (hw.hwModule && hw.hwModule !== this)
                    ) {
                        this.__clearRealign();
                        this.state = 'idle';
                        return;
                    }
                    this.__failRealign('timeout');
                }, REALIGN_TIMEOUT_MS),
            };
            this.__pushNow();
        }
        // 재정렬 실패 출구 공통: 코어는 세션 중 실패 시 포트를 닫지 않으므로 직접 닫고 실패 메뉴와 토스트를 띄운다.
        __failRealign(reason) {
            this.state = 'idle';
            this.__clearRealign();
            this.__resolveAllPending();
            this.__removeAllTimeouts();
            if (
                Entry.engine &&
                typeof Entry.engine.isState === 'function' &&
                Entry.engine.isState('run') &&
                typeof Entry.engine.toggleStop === 'function'
            )
                Promise.resolve(Entry.engine.toggleStop()).catch(console.error);
            const hw = Entry.hwLite;
            if (hw && hw.serial && typeof hw.serial.removeSerialPort === 'function') {
                Promise.resolve(hw.serial.removeSerialPort()).catch(console.error);
            }
            if (hw && hw.getConnectFailedMenu) hw.getConnectFailedMenu();
            if (reason === 'model') this.__toastForeign();
            else if (Entry.toast && Entry.toast.alert)
                Entry.toast.alert(
                    Lang.Msgs.hw_connection_failed_title,
                    Lang.Msgs.hw_connection_failed_desc,
                    false
                );
        }
        __realignPacket() {
            if (!this.realign || this.realign.pending !== 'FF') return undefined;
            this.__markTx();
            return 'FF\r';
        }
        __realignStep(line) {
            const r = this.realign;
            if (!r) return;
            if (r.pending === 'FF') {
                const id = this.parseIdentityData(line);
                if (!id) {
                    if (typeof line !== 'string' || line.slice(0, 2) !== 'FF') this.__pushNow();
                    return;
                }
                if (id.foreign) {
                    this.__failRealign('model');
                    return;
                }
                this.address = id.address;
                this.variant = id.variant;
                r.pending = 'FRAME';
                return;
            }
            if (
                this.__isValidFrame(line) &&
                line[0] === '1' &&
                line.slice(41).toUpperCase() === this.address
            ) {
                this.__resetSession();
                this.state = 'ready';
                this.__armDrain(); // push 없음. 안전 프레임은 다음 수신 줄에서 정지 프레임과 같은 경로로 나간다
            }
        }

        // 블록 정의와 번역(하드웨어 연결 프로그램용 block_cheese.js 와 같은 정의)
        getBlocks() {
            return {
                cheeselite_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_sensor_acceleration_x, 'ACCELERATION_X'],
                                [Lang.Blocks.ROBOID_sensor_acceleration_y, 'ACCELERATION_Y'],
                                [Lang.Blocks.ROBOID_sensor_acceleration_z, 'ACCELERATION_Z'],
                                [Lang.Blocks.ROBOID_sensor_signal_strength_dbm, 'SIGNAL_STRENGTH'],
                            ],
                            value: 'ACCELERATION_X',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_value',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'cheeselite_sensor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.getValue(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_boolean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_logo_sky_direction, 'TILT_NOT'],
                                [Lang.Blocks.ROBOID_logo_earth_direction, 'TILT_FLIP'],
                                [Lang.Blocks.ROBOID_power_switch_sky_direction, 'TILT_LEFT'],
                                [Lang.Blocks.ROBOID_power_switch_earth_direction, 'TILT_RIGHT'],
                                [Lang.Blocks.ROBOID_port_s_sky_direction, 'TILT_FORWARD'],
                                [Lang.Blocks.ROBOID_port_s_earth_direction, 'TILT_BACKWARD'],
                                [Lang.Blocks.ROBOID_tap, 'TAP'],
                                [Lang.Blocks.ROBOID_free_fall, 'FREE_FALL'],
                                [Lang.Blocks.ROBOID_battery_normal, 'BATTERY_NORMAL'],
                                [Lang.Blocks.ROBOID_battery_low, 'BATTERY_LOW'],
                                [Lang.Blocks.ROBOID_battery_empty, 'BATTERY_EMPTY'],
                            ],
                            value: 'TILT_NOT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_boolean',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'cheeselite_sensor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.checkBoolean(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_play_sound_times: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                            ],
                            value: 'BEEP',
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
                        type: 'cheeselite_play_sound_times',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.playSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_play_sound_times_until_done: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_sound_beep, 'BEEP'],
                                [Lang.Blocks.ROBOID_sound_random_beep, 'RANDOM_BEEP'],
                                [Lang.Blocks.ROBOID_sound_noise, 'NOISE'],
                                [Lang.Blocks.ROBOID_sound_siren, 'SIREN'],
                                [Lang.Blocks.ROBOID_sound_engine, 'ENGINE'],
                                [Lang.Blocks.ROBOID_sound_chop, 'CHOP'],
                                [Lang.Blocks.ROBOID_sound_robot, 'ROBOT'],
                                [Lang.Blocks.ROBOID_sound_dibidibidip, 'DIBIDIBIDIP'],
                                [Lang.Blocks.ROBOID_sound_good_job, 'GOOD_JOB'],
                                [Lang.Blocks.ROBOID_sound_happy, 'HAPPY'],
                                [Lang.Blocks.ROBOID_sound_angry, 'ANGRY'],
                                [Lang.Blocks.ROBOID_sound_sad, 'SAD'],
                                [Lang.Blocks.ROBOID_sound_sleep, 'SLEEP'],
                                [Lang.Blocks.ROBOID_sound_march, 'MARCH'],
                                [Lang.Blocks.ROBOID_sound_birthday, 'BIRTHDAY'],
                            ],
                            value: 'BEEP',
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
                        type: 'cheeselite_play_sound_times_until_done',
                    },
                    paramsKeyMap: {
                        SOUND: 0,
                        COUNT: 1,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.playSoundUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_buzzer_by: {
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
                        type: 'cheeselite_change_buzzer_by',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_buzzer_to: {
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
                        type: 'cheeselite_set_buzzer_to',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setBuzzer(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_clear_sound: {
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
                        type: 'cheeselite_clear_sound',
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.clearSound(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_note_c, 'C'],
                                [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                [Lang.Blocks.ROBOID_note_d, 'D'],
                                [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                [Lang.Blocks.ROBOID_note_e, 'E'],
                                [Lang.Blocks.ROBOID_note_f, 'F'],
                                [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                [Lang.Blocks.ROBOID_note_g, 'G'],
                                [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                [Lang.Blocks.ROBOID_note_a, 'A'],
                                [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                [Lang.Blocks.ROBOID_note_b, 'B'],
                            ],
                            value: 'C',
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
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, '4', null],
                        type: 'cheeselite_play_note',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.playNote(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_note_c, 'C'],
                                [Lang.Blocks.ROBOID_note_c_sharp, 'C#'],
                                [Lang.Blocks.ROBOID_note_d, 'D'],
                                [Lang.Blocks.ROBOID_note_d_sharp, 'D#'],
                                [Lang.Blocks.ROBOID_note_e, 'E'],
                                [Lang.Blocks.ROBOID_note_f, 'F'],
                                [Lang.Blocks.ROBOID_note_f_sharp, 'F#'],
                                [Lang.Blocks.ROBOID_note_g, 'G'],
                                [Lang.Blocks.ROBOID_note_g_sharp, 'G#'],
                                [Lang.Blocks.ROBOID_note_a, 'A'],
                                [Lang.Blocks.ROBOID_note_a_sharp, 'A#'],
                                [Lang.Blocks.ROBOID_note_b, 'B'],
                            ],
                            value: 'C',
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
                        type: 'cheeselite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        BEAT: 2,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.playNoteBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_rest_for: {
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
                        type: 'cheeselite_rest_for',
                    },
                    paramsKeyMap: {
                        BEAT: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.restBeat(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_tempo_by: {
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
                        type: 'cheeselite_change_tempo_by',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_tempo_to: {
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
                        type: 'cheeselite_set_tempo_to',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setTempo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_sound_port_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_speaker_internal, 'INTERNAL'],
                                [Lang.Blocks.ROBOID_speaker_port_mab, 'MAB'],
                            ],
                            value: 'INTERNAL',
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
                        type: 'cheeselite_set_sound_port_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_sound',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setSoundPort(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_input_mode_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_io_mode_makey, 'MAKEY'],
                                [Lang.Blocks.ROBOID_io_mode_button, 'BUTTON'],
                                [Lang.Blocks.ROBOID_io_mode_digital_pull_up, 'DIGITAL_PULL_UP'],
                                [Lang.Blocks.ROBOID_io_mode_digital_pull_down, 'DIGITAL_PULL_DOWN'],
                                [Lang.Blocks.ROBOID_io_mode_analog, 'ANALOG'],
                                [Lang.Blocks.ROBOID_io_mode_voltage, 'VOLTAGE'],
                            ],
                            value: 'MAKEY',
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
                        type: 'cheeselite_set_input_mode_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MODE: 1,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setInputModeTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_input_range_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                [Lang.Blocks.ROBOID_range_real, 'REAL'],
                            ],
                            value: 'INTEGER',
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
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['100'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_set_input_range_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        LOW1: 1,
                        HIGH1: 2,
                        LOW2: 3,
                        HIGH2: 4,
                        DECIMAL: 5,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setInputRangeTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_three_input_ranges_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                [Lang.Blocks.ROBOID_range_real, 'REAL'],
                            ],
                            value: 'INTEGER',
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
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['127'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['-100'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['100'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_set_three_input_ranges_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        LOW1: 1,
                        MIDDLE1: 2,
                        HIGH1: 3,
                        LOW2: 4,
                        MIDDLE2: 5,
                        HIGH2: 6,
                        DECIMAL: 7,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setThreeInputRangesTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_analog_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_analog_input',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.getAnalogInput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_digital_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['0', '0'],
                                ['1', '1'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'cheeselite_digital_input',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.checkDigitalInput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                            ],
                            value: 'CLICKED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'cheeselite_button_state',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        STATE: 1,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.checkButtonState(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_pulse_mode_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sc', 'SC'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SC',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_io_mode_pulse, 'PULSE'],
                                [Lang.Blocks.ROBOID_io_mode_pulse_pull_up, 'PULSE_PULL_UP'],
                                [Lang.Blocks.ROBOID_io_mode_pulse_pull_down, 'PULSE_PULL_DOWN'],
                            ],
                            value: 'PULSE',
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
                        type: 'cheeselite_set_pulse_mode_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MODE: 1,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setInputModeTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pulse_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sc', 'SC'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SC',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_pulse_input',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_input',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.checkPulseInput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_digital_output_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                                [Lang.Blocks.ROBOID_io_port_high_current_mab, 'MAB'],
                                [Lang.Blocks.ROBOID_io_port_high_current_mcd, 'MCD'],
                            ],
                            value: 'SA',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['0', '0'],
                                ['1', '1'],
                            ],
                            value: '1',
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
                        type: 'cheeselite_set_digital_output_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_digital_output',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setDigitalOutput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_pwm_output_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
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
                        type: 'cheeselite_change_pwm_output_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_pwm_output',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changePwmOutput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_pwm_output_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                            ],
                            value: 'SA',
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
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'cheeselite_set_pwm_output_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_pwm_output',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setPwmOutput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_servo_motor_angle_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                                ['Ma(-)b(+)c', 'MABC'],
                                ['Ma(-)b', 'MAB'],
                                ['Mc(-)d', 'MCD'],
                            ],
                            value: 'SA',
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
                        type: 'cheeselite_change_servo_motor_angle_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_servo_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeServoMotorAngle(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_servo_motor_angle_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                                ['Ma(-)b(+)c', 'MABC'],
                                ['Ma(-)b', 'MAB'],
                                ['Mc(-)d', 'MCD'],
                            ],
                            value: 'SA',
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
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_set_servo_motor_angle_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_servo_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setServoMotorAngle(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_turn_off_servo_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Sa', 'SA'],
                                ['Sb', 'SB'],
                                ['Sc', 'SC'],
                                ['La', 'LA'],
                                ['Lb', 'LB'],
                                ['Lc', 'LC'],
                                ['Ma(-)b(+)c', 'MABC'],
                                ['Ma(-)b', 'MAB'],
                                ['Mc(-)d', 'MCD'],
                            ],
                            value: 'SA',
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
                        type: 'cheeselite_turn_off_servo_motor',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_servo_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.turnOffServoMotor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_dc_motor_velocity_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Mab', 'MAB'],
                                ['Mcd', 'MCD'],
                            ],
                            value: 'MAB',
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
                        type: 'cheeselite_change_dc_motor_velocity_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_dc_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeDcMotorVelocity(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_dc_motor_velocity_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Mab', 'MAB'],
                                ['Mcd', 'MCD'],
                            ],
                            value: 'MAB',
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
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'cheeselite_set_dc_motor_velocity_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'cheeselite_dc_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setDcMotorVelocity(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_stop_dc_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['Mab', 'MAB'],
                                ['Mcd', 'MCD'],
                            ],
                            value: 'MAB',
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
                        type: 'cheeselite_stop_dc_motor',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_dc_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.stopDcMotor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_rotate_step_motor: {
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
                                params: ['100'],
                            },
                            {
                                type: 'text',
                                params: ['300'],
                            },
                            null,
                        ],
                        type: 'cheeselite_rotate_step_motor',
                    },
                    paramsKeyMap: {
                        STEP: 0,
                        VELOCITY: 1,
                    },
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.rotateStepMotor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_step_motor_velocity_by: {
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
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'cheeselite_change_step_motor_velocity_by',
                    },
                    paramsKeyMap: {
                        VELOCITY: 0,
                    },
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeStepMotorVelocity(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_step_motor_velocity_to: {
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
                                params: ['300'],
                            },
                            null,
                        ],
                        type: 'cheeselite_set_step_motor_velocity_to',
                    },
                    paramsKeyMap: {
                        VELOCITY: 0,
                    },
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setStepMotorVelocity(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_stop_off_step_motor: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_io_action_stop, 'STOP'],
                                [Lang.Blocks.ROBOID_io_action_turn_off, 'OFF'],
                            ],
                            value: 'STOP',
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
                        type: 'cheeselite_stop_off_step_motor',
                    },
                    paramsKeyMap: {
                        ACTION: 0,
                    },
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.stopOffStepMotor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_step_motor_mode_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_io_mode_normal, 'NORMAL'],
                                [Lang.Blocks.ROBOID_io_mode_power, 'POWER'],
                            ],
                            value: 'NORMAL',
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
                        type: 'cheeselite_set_step_motor_mode_to',
                    },
                    paramsKeyMap: {
                        MODE: 0,
                    },
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setStepMotorMode(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_step_count: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_step_count',
                    },
                    paramsKeyMap: {},
                    class: 'cheeselite_step_motor',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.getStepCount(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_led_to_color: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_led_intensity_dark, 'DARK'],
                                [Lang.Blocks.ROBOID_led_intensity_normal, 'NORMAL'],
                                [Lang.Blocks.ROBOID_led_intensity_bright, 'BRIGHT'],
                            ],
                            value: 'NORMAL',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                        params: [null, null, null, null],
                        type: 'cheeselite_set_led_to_color',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        INTENSITY: 1,
                        COLOR: 2,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setLedColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pick_led_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Color',
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
                        type: 'cheeselite_pick_led_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        COLOR: 1,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setLedRgbArray(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_change_led_by_rgb: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                            null,
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_change_led_by_rgb',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.changeLedRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_setLed_to_rgb: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                            null,
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_setLed_to_rgb',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setLedRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_clear_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
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
                        type: 'cheeselite_clear_led',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.clearLed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_led_type_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['L', 'L'],
                                ['S', 'S'],
                            ],
                            value: 'L',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_led_type_default, 'DEFAULT'],
                                [Lang.Blocks.ROBOID_led_type_crgb, '-RGB'],
                                [Lang.Blocks.ROBOID_led_type_crbg, '-RBG'],
                                [Lang.Blocks.ROBOID_led_type_cgrb, '-GRB'],
                                [Lang.Blocks.ROBOID_led_type_cgbr, '-GBR'],
                                [Lang.Blocks.ROBOID_led_type_cbrg, '-BRG'],
                                [Lang.Blocks.ROBOID_led_type_cbgr, '-BGR'],
                                [Lang.Blocks.ROBOID_led_type_argb, '+RGB'],
                                [Lang.Blocks.ROBOID_led_type_arbg, '+RBG'],
                                [Lang.Blocks.ROBOID_led_type_agrb, '+GRB'],
                                [Lang.Blocks.ROBOID_led_type_agbr, '+GBR'],
                                [Lang.Blocks.ROBOID_led_type_abrg, '+BRG'],
                                [Lang.Blocks.ROBOID_led_type_abgr, '+BGR'],
                            ],
                            value: 'DEFAULT',
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
                        type: 'cheeselite_set_led_type_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        TYPE: 1,
                    },
                    class: 'cheeselite_led',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setLedType(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_number_and_type_to: {
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
                            type: 'Dropdown',
                            options: [
                                ['GRB', 'GRB'],
                                ['GRBW', 'GRBW'],
                            ],
                            value: 'GRB',
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
                        params: [
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_number_and_type_to',
                    },
                    paramsKeyMap: {
                        NUMBER: 0,
                        TYPE: 1,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetNumberAndType(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_all_leds_to_pattern: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                                [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                                [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                                [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                                [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                            ],
                            value: 'FILL_3_COLORS',
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
                        type: 'cheeselite_neopixel_set_all_leds_to_pattern',
                    },
                    paramsKeyMap: {
                        PATTERN: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetAllPattern(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_all_leds_to_color: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                        type: 'cheeselite_neopixel_set_all_leds_to_color',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetAllColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_pick_all_leds_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Color',
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
                        type: 'cheeselite_neopixel_pick_all_leds_to',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetAllRgbArray(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_change_all_leds_by_rgb: {
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
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_change_all_leds_by_rgb',
                    },
                    paramsKeyMap: {
                        RED: 0,
                        GREEN: 1,
                        BLUE: 2,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelChangeAllRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_all_leds_to_rgb: {
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
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_all_leds_to_rgb',
                    },
                    paramsKeyMap: {
                        RED: 0,
                        GREEN: 1,
                        BLUE: 2,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetAllRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_clear_all_leds: {
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
                        type: 'cheeselite_neopixel_clear_all_leds',
                    },
                    paramsKeyMap: {},
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelClearAll(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_led_to_color: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_led_to_color',
                    },
                    paramsKeyMap: {
                        PIXEL: 0,
                        COLOR: 1,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetLedColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_pick_led_to: {
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
                            type: 'Color',
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
                            null,
                        ],
                        type: 'cheeselite_neopixel_pick_led_to',
                    },
                    paramsKeyMap: {
                        PIXEL: 0,
                        COLOR: 1,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetLedRgbArray(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_change_led_by_rgb: {
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
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_change_led_by_rgb',
                    },
                    paramsKeyMap: {
                        PIXEL: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelChangeLedRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_led_to_rgb: {
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
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_led_to_rgb',
                    },
                    paramsKeyMap: {
                        PIXEL: 0,
                        RED: 1,
                        GREEN: 2,
                        BLUE: 3,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetLedRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_clear_led: {
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
                        type: 'cheeselite_neopixel_clear_led',
                    },
                    paramsKeyMap: {
                        PIXEL: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelClearLed(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_led_range_to_pattern: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_neopixel_3_colors, 'FILL_3_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_6_colors, 'FILL_6_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_12_colors, 'FILL_12_COLORS'],
                                [Lang.Blocks.ROBOID_neopixel_red_green, 'GRADIENT_RED_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_red_blue, 'GRADIENT_RED_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_red_white, 'GRADIENT_RED_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_green_red, 'GRADIENT_GREEN_RED'],
                                [Lang.Blocks.ROBOID_neopixel_green_blue, 'GRADIENT_GREEN_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_green_white, 'GRADIENT_GREEN_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_blue_red, 'GRADIENT_BLUE_RED'],
                                [Lang.Blocks.ROBOID_neopixel_blue_green, 'GRADIENT_BLUE_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_blue_white, 'GRADIENT_BLUE_WHITE'],
                                [Lang.Blocks.ROBOID_neopixel_white_red, 'GRADIENT_WHITE_RED'],
                                [Lang.Blocks.ROBOID_neopixel_white_green, 'GRADIENT_WHITE_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_white_blue, 'GRADIENT_WHITE_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_red_black, 'GRADIENT_RED_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_green_black, 'GRADIENT_GREEN_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_blue_black, 'GRADIENT_BLUE_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_white_black, 'GRADIENT_WHITE_BLACK'],
                                [Lang.Blocks.ROBOID_neopixel_black_red, 'GRADIENT_BLACK_RED'],
                                [Lang.Blocks.ROBOID_neopixel_black_green, 'GRADIENT_BLACK_GREEN'],
                                [Lang.Blocks.ROBOID_neopixel_black_blue, 'GRADIENT_BLACK_BLUE'],
                                [Lang.Blocks.ROBOID_neopixel_black_white, 'GRADIENT_BLACK_WHITE'],
                            ],
                            value: 'FILL_3_COLORS',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_led_range_to_pattern',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        PATTERN: 2,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetRangePattern(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_led_range_to_color: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_led_range_to_color',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        INCREMENT: 2,
                        COLOR: 3,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetRangeColor(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_pick_led_range_to: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Color',
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
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_neopixel_pick_led_range_to',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        INCREMENT: 2,
                        COLOR: 3,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetRangeRgbArray(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_change_led_range_by_rgb: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_change_led_range_by_rgb',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        INCREMENT: 2,
                        RED: 3,
                        GREEN: 4,
                        BLUE: 5,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelChangeRangeRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_led_range_to_rgb: {
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
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_led_range_to_rgb',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        INCREMENT: 2,
                        RED: 3,
                        GREEN: 4,
                        BLUE: 5,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetRangeRgb(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_clear_led_range: {
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
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_clear_led_range',
                    },
                    paramsKeyMap: {
                        START: 0,
                        END: 1,
                        INCREMENT: 2,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelClearRange(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_shift: {
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
                        type: 'cheeselite_neopixel_shift',
                    },
                    paramsKeyMap: {
                        BIT: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelShift(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_rotate: {
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
                        type: 'cheeselite_neopixel_rotate',
                    },
                    paramsKeyMap: {
                        BIT: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelRotate(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_change_brightness_by: {
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
                        type: 'cheeselite_neopixel_change_brightness_by',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelChangeBrightness(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_neopixel_set_brightness_to: {
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
                                params: ['50'],
                            },
                            null,
                        ],
                        type: 'cheeselite_neopixel_set_brightness_to',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'cheeselite_neopixel',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.neopixelSetBrightness(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_write_serial: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_serial_string, 'STRING'],
                                [Lang.Blocks.ROBOID_serial_string_line, 'STRING_LINE'],
                            ],
                            value: 'STRING',
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
                                params: ['abc123'],
                            },
                            null,
                        ],
                        type: 'cheeselite_write_serial',
                    },
                    paramsKeyMap: {
                        MODE: 0,
                        STRING: 1,
                    },
                    class: 'cheeselite_serial',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.writeSerial(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_read_serial_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_serial_all, 'ALL'],
                                [Lang.Blocks.ROBOID_serial_until_comma, 'COMMA'],
                                [Lang.Blocks.ROBOID_serial_until_colon, 'COLON'],
                                [Lang.Blocks.ROBOID_serial_until_dollar, 'DOLLAR'],
                                [Lang.Blocks.ROBOID_serial_until_sharp, 'SHARP'],
                                [Lang.Blocks.ROBOID_serial_until_new_line, 'NEW_LINE'],
                            ],
                            value: 'ALL',
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
                        type: 'cheeselite_read_serial_until',
                    },
                    paramsKeyMap: {
                        DELIMITER: 0,
                    },
                    class: 'cheeselite_serial',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.readSerialUntil(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_serial_port_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_serial_port_wa_rb, 'WRITE_READ'],
                                [Lang.Blocks.ROBOID_serial_port_ra_wb, 'READ_WRITE'],
                                [Lang.Blocks.ROBOID_serial_port_wa, 'WRITE'],
                                [Lang.Blocks.ROBOID_serial_port_ra, 'READ'],
                            ],
                            value: 'WRITE_READ',
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
                        type: 'cheeselite_set_serial_port_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'cheeselite_serial',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setSerialPort(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_set_serial_rate_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['9600', '9600'],
                                ['14400', '14400'],
                                ['19200', '19200'],
                                ['28800', '28800'],
                                ['38400', '38400'],
                                ['57600', '57600'],
                                ['76800', '76800'],
                                ['115200', '115200'],
                            ],
                            value: '9600',
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
                        type: 'cheeselite_set_serial_rate_to',
                    },
                    paramsKeyMap: {
                        BAUD: 0,
                    },
                    class: 'cheeselite_serial',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.setSerialRate(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_serial_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'cheeselite_serial_input',
                    },
                    paramsKeyMap: {},
                    class: 'cheeselite_serial',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.getSerialInput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_start: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_pid_10, '10'],
                                [Lang.Blocks.ROBOID_pid_11_1, '11-1'],
                                [Lang.Blocks.ROBOID_pid_11_2, '11-2'],
                                [Lang.Blocks.ROBOID_pid_11_3, '11-3'],
                                [Lang.Blocks.ROBOID_pid_12, '12'],
                                [Lang.Blocks.ROBOID_pid_13, '13'],
                                [Lang.Blocks.ROBOID_pid_14, '14'],
                                //                        [Lang.Blocks.ROBOID_pid_15, '15'],
                                [Lang.Blocks.ROBOID_pid_16, '16'],
                            ],
                            value: '10',
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
                        type: 'cheeselite_pid_start',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidStart(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_set_range_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                            ],
                            value: 'X1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                [Lang.Blocks.ROBOID_range_real, 'REAL'],
                            ],
                            value: 'INTEGER',
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
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['100'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_pid_set_range_to',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        LOW1: 1,
                        HIGH1: 2,
                        LOW2: 3,
                        HIGH2: 4,
                        DECIMAL: 5,
                    },
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidSetRangeTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_set_three_ranges_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                            ],
                            value: 'X1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_range_integer, 'INTEGER'],
                                [Lang.Blocks.ROBOID_range_real, 'REAL'],
                            ],
                            value: 'INTEGER',
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
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['127'],
                            },
                            {
                                type: 'text',
                                params: ['255'],
                            },
                            {
                                type: 'text',
                                params: ['-100'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['100'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_pid_set_three_ranges_to',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                        LOW1: 1,
                        MIDDLE1: 2,
                        HIGH1: 3,
                        LOW2: 4,
                        MIDDLE2: 5,
                        HIGH2: 6,
                        DECIMAL: 7,
                    },
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidSetThreeRangesTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_reset_encoder: {
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
                        type: 'cheeselite_pid_reset_encoder',
                    },
                    paramsKeyMap: {},
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidResetEncoder(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_input: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_pid_distance, 'DISTANCE'],
                                [Lang.Blocks.ROBOID_pid_temperature, 'TEMPERATURE'],
                                [Lang.Blocks.ROBOID_pid_humidity, 'HUMIDITY'],
                                [Lang.Blocks.ROBOID_pid_x1, 'X1'],
                                [Lang.Blocks.ROBOID_pid_y1, 'Y1'],
                                [Lang.Blocks.ROBOID_pid_x2, 'X2'],
                                [Lang.Blocks.ROBOID_pid_y2, 'Y2'],
                                [Lang.Blocks.ROBOID_pid_button1, 'BUTTON1'],
                                [Lang.Blocks.ROBOID_pid_button2, 'BUTTON2'],
                                [Lang.Blocks.ROBOID_pid_encoder, 'ENCODER'],
                            ],
                            value: 'DISTANCE',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_pid_input',
                    },
                    paramsKeyMap: {
                        INPUT: 0,
                    },
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidGetInput(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_pid_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                            ],
                            value: 'CLICKED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'cheeselite_pid_button_state',
                    },
                    paramsKeyMap: {
                        BUTTON: 0,
                        STATE: 1,
                    },
                    class: 'cheeselite_pid',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.pidCheckButtonState(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_start: {
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
                        type: 'cheeselite_hat010_start',
                    },
                    paramsKeyMap: {},
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010Start(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_button: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['A', 'A'],
                                ['B', 'B'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'cheeselite_hat010_button',
                    },
                    paramsKeyMap: {
                        BUTTON: 0,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010GetButton(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_button_state: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['A', 'A'],
                                ['B', 'B'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_clicked, 'CLICKED'],
                                [Lang.Blocks.ROBOID_long_pressed, 'LONG_PRESSED'],
                            ],
                            value: 'CLICKED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'cheeselite_hat010_button_state',
                    },
                    paramsKeyMap: {
                        BUTTON: 0,
                        STATE: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010CheckButtonState(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_background_turn_on_xy: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                        params: [
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_hat010_background_turn_on_xy',
                    },
                    paramsKeyMap: {
                        X: 0,
                        Y: 1,
                        COLOR: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010BackgroundTurnOnXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_background_turn_off_xy: {
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
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_background_turn_off_xy',
                    },
                    paramsKeyMap: {
                        X: 0,
                        Y: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010BackgroundTurnOffXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_background_draw_shape_at_xy: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                                [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                                [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                                [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                                [Lang.Blocks.ROBOID_shape_x, 'X'],
                                [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                                [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                                [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                                [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                                [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                                [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                                [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                                [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                                [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                                [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                                [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                                [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                                [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                                [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                                [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                                [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                                [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                                [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                            ],
                            value: 'SQUARE',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
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
                            null,
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_background_draw_shape_at_xy',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        SHAPE: 1,
                        X: 2,
                        Y: 3,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010BackgroundDrawShapeAtXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_background_draw_string_at_xy: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                            null,
                            {
                                type: 'text',
                                params: ['abc123'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_background_draw_string_at_xy',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        TEXT: 1,
                        X: 2,
                        Y: 3,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010BackgroundDrawStringAtXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_background_draw_pattern_at_xy: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
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
                            null,
                            {
                                type: 'text',
                                params: ['10010'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_background_draw_pattern_at_xy',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        PATTERN: 1,
                        X: 2,
                        Y: 3,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010BackgroundDrawPatternAtXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_clear: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                            ],
                            value: 'BACKGROUND',
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
                        type: 'cheeselite_hat010_clear',
                    },
                    paramsKeyMap: {
                        TARGET: 0,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010Clear(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_scroll_by_xy: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                [Lang.Blocks.ROBOID_hat_all, 'ALL'],
                            ],
                            value: 'BACKGROUND',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
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
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_scroll_by_xy',
                    },
                    paramsKeyMap: {
                        TARGET: 0,
                        X: 1,
                        Y: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010ScrollByXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_set_to_shape: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_shape_square, 'SQUARE'],
                                [Lang.Blocks.ROBOID_shape_triangle, 'TRIANGLE'],
                                [Lang.Blocks.ROBOID_shape_diamond, 'DIAMOND'],
                                [Lang.Blocks.ROBOID_shape_circle, 'CIRCLE'],
                                [Lang.Blocks.ROBOID_shape_x, 'X'],
                                [Lang.Blocks.ROBOID_shape_like, 'LIKE'],
                                [Lang.Blocks.ROBOID_shape_dislike, 'DISLIKE'],
                                [Lang.Blocks.ROBOID_shape_angry, 'ANGRY'],
                                [Lang.Blocks.ROBOID_shape_open_mouth, 'OPEN_MOUTH'],
                                [Lang.Blocks.ROBOID_shape_close_mouth, 'CLOSE_MOUTH'],
                                [Lang.Blocks.ROBOID_shape_walk1, 'WALK1'],
                                [Lang.Blocks.ROBOID_shape_walk2, 'WALK2'],
                                [Lang.Blocks.ROBOID_shape_heart, 'HEART'],
                                [Lang.Blocks.ROBOID_shape_star, 'STAR'],
                                [Lang.Blocks.ROBOID_shape_airplane, 'AIRPLANE'],
                                [Lang.Blocks.ROBOID_shape_puppy, 'PUPPY'],
                                [Lang.Blocks.ROBOID_shape_butterfly, 'BUTTERFLY'],
                                [Lang.Blocks.ROBOID_shape_quarter_note, 'QUARTER_NOTE'],
                                [Lang.Blocks.ROBOID_shape_eighth_note, 'EIGHTH_NOTE'],
                                [Lang.Blocks.ROBOID_shape_left_arrow, 'LEFT_ARROW'],
                                [Lang.Blocks.ROBOID_shape_right_arrow, 'RIGHT_ARROW'],
                                [Lang.Blocks.ROBOID_shape_up_arrow, 'UP_ARROW'],
                                [Lang.Blocks.ROBOID_shape_down_arrow, 'DOWN_ARRAY'],
                            ],
                            value: 'SQUARE',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            null,
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_set_to_shape',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        COLOR: 1,
                        SHAPE: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteSetToShape(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_set_to_string: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            {
                                type: 'text',
                                params: ['abc123'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_set_to_string',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        COLOR: 1,
                        TEXT: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteSetToString(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_set_to_pattern: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_color_red, 'RED'],
                                [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                [Lang.Blocks.ROBOID_color_sky_blue, 'SKY_BLUE'],
                                [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                [Lang.Blocks.ROBOID_color_purple, 'PURPLE'],
                                [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                            ],
                            value: 'RED',
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
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            {
                                type: 'text',
                                params: ['10010'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_set_to_pattern',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        COLOR: 1,
                        PATTERN: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteSetToPattern(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_clear_show_hide: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_clear, 'CLEAR'],
                                [Lang.Blocks.ROBOID_hat_show, 'SHOW'],
                                [Lang.Blocks.ROBOID_hat_hide, 'HIDE'],
                            ],
                            value: 'CLEAR',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_clear_show_hide',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        ACTION: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteClearShowHide(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_change_positions_by_xy: {
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
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_change_positions_by_xy',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        X: 1,
                        Y: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteChangePositionsByXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_set_positions_to_xy: {
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
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_set_positions_to_xy',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        X: 1,
                        Y: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteSetPositionsToXY(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_change_position_by_value: {
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
                            type: 'Dropdown',
                            options: [
                                ['x', 'X'],
                                ['y', 'Y'],
                            ],
                            value: 'X',
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
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_change_position_by_value',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        POSITION: 1,
                        VALUE: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteChangePositionByValue(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_set_position_to_value: {
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
                            type: 'Dropdown',
                            options: [
                                ['x', 'X'],
                                ['y', 'Y'],
                            ],
                            value: 'X',
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
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            {
                                type: 'text',
                                params: ['0'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_set_position_to_value',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        POSITION: 1,
                        VALUE: 2,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteSetPositionToValue(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_rotate: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_clockwise, 'CLOCKWISE'],
                                [Lang.Blocks.ROBOID_hat_counterclockwise, 'COUNTERCLOCKWISE'],
                            ],
                            value: 'CLOCKWISE',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_rotate',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        DIRECTION: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteRotate(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_flip_in_direction: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_left_right, 'LEFT_RIGHT'],
                                [Lang.Blocks.ROBOID_hat_up_down, 'UP_DOWN'],
                            ],
                            value: 'LEFT_RIGHT',
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
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                            null,
                        ],
                        type: 'cheeselite_hat010_sprite_flip_in_direction',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        DIRECTION: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteFlipInDirection(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_stamp_to_background: {
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
                        type: 'cheeselite_hat010_sprite_stamp_to_background',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SpriteStampToBackground(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_position: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['x', 'X'],
                                ['y', 'Y'],
                            ],
                            value: 'X',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        type: 'cheeselite_hat010_sprite_position',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        POSITION: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010GetSpritePosition(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_touching_sprite: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
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
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            {
                                type: 'text',
                                params: ['2'],
                            },
                        ],
                        type: 'cheeselite_hat010_sprite_touching_sprite',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        TARGET: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010CheckCheckSpriteSpriteTouched(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_sprite_touching: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ROBOID_hat_background, 'BACKGROUND'],
                                [Lang.Blocks.ROBOID_hat_other_sprite, 'OTHER_SPRITE'],
                                [Lang.Blocks.ROBOID_hat_left_wall, 'LEFT_WALL'],
                                [Lang.Blocks.ROBOID_hat_right_wall, 'RIGHT_WALL'],
                                [Lang.Blocks.ROBOID_hat_top_wall, 'TOP_WALL'],
                                [Lang.Blocks.ROBOID_hat_bottom_wall, 'BOTTOM_WALL'],
                                [Lang.Blocks.ROBOID_hat_any_wall, 'ANY_WALL'],
                            ],
                            value: 'BACKGROUND',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        type: 'cheeselite_hat010_sprite_touching',
                    },
                    paramsKeyMap: {
                        SPRITE: 0,
                        TARGET: 1,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010CheckCheckSpriteTouched(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_change_brightness_by: {
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
                                params: ['5'],
                            },
                            null,
                        ],
                        type: 'cheeselite_hat010_change_brightness_by',
                    },
                    paramsKeyMap: {
                        BRIGHTNESS: 0,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010ChangeBrightnessBy(script);
                    },
                    syntax: { js: [], py: [] },
                },
                cheeselite_hat010_set_brightness_to: {
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
                        type: 'cheeselite_hat010_set_brightness_to',
                    },
                    paramsKeyMap: {
                        BRIGHTNESS: 0,
                    },
                    class: 'cheeselite_hat010',
                    isNotFor: ['CheeseLite'],
                    func(sprite, script) {
                        return Entry.CheeseLite.hat010SetBrightnessTo(script);
                    },
                    syntax: { js: [], py: [] },
                },
            };
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        cheeselite_value: '%1',
                        cheeselite_boolean: '%1?',
                        cheeselite_play_sound_times: '%1 소리 %2 번 재생하기 %3',
                        cheeselite_play_sound_times_until_done:
                            '%1 소리 %2 번 재생하고 기다리기 %3',
                        cheeselite_change_buzzer_by: '버저 음을 %1 Hz만큼 바꾸기 %2',
                        cheeselite_set_buzzer_to: '버저 음을 %1 Hz로 정하기 %2',
                        cheeselite_clear_sound: '소리 끄기 %1',
                        cheeselite_play_note: '%1 %2 음을 연주하기 %3',
                        cheeselite_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
                        cheeselite_rest_for: '%1 박자 쉬기 %2',
                        cheeselite_change_tempo_by: '연주 속도를 %1 BPM만큼 바꾸기 %2',
                        cheeselite_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
                        cheeselite_set_sound_port_to: '소리 출력을 %1로 정하기 %2',
                        cheeselite_set_input_mode_to: '포트 %1를 %2 입력으로 정하기 %3',
                        cheeselite_set_input_range_to:
                            '입력 %1의 범위 %2 ~ %3을(를) %4 ~ %5 소수점 %6으로 정하기 %7',
                        cheeselite_set_three_input_ranges_to:
                            '입력 %1의 범위 %2 ~ %3 ~ %4을(를) %5 ~ %6 ~ %7 소수점 %8으로 정하기 %9',
                        cheeselite_analog_input: '입력 %1',
                        cheeselite_digital_input: '입력 %1 %2 ?',
                        cheeselite_button_state: '버튼 %1를 %2?',
                        cheeselite_set_pulse_mode_to: '포트 %1를 %2 입력으로 정하기 %3',
                        cheeselite_pulse_input: '포트 %1에서 펄스 감지?',
                        cheeselite_set_digital_output_to: '디지털 출력 %1를 %2(으)로 정하기 %3',
                        cheeselite_change_pwm_output_by: 'PWM 출력 %1를 %2%만큼 바꾸기 %3',
                        cheeselite_set_pwm_output_to: 'PWM 출력 %1를 %2%로 정하기 %3',
                        cheeselite_change_servo_motor_angle_by:
                            '서보 모터 %1의 각도를 %2도만큼 바꾸기 %3',
                        cheeselite_set_servo_motor_angle_to:
                            '서보 모터 %1의 각도를 %2도로 정하기 %3',
                        cheeselite_turn_off_servo_motor: '서보 모터 %1 전원 끄기 %2',
                        cheeselite_change_dc_motor_velocity_by:
                            'DC 모터 %1의 속도를 %2%만큼 바꾸기 %3',
                        cheeselite_set_dc_motor_velocity_to: 'DC 모터 %1의 속도를 %2%로 정하기 %3',
                        cheeselite_stop_dc_motor: 'DC 모터 %1 정지하기 %2',
                        cheeselite_rotate_step_motor:
                            '스텝 모터 %1 스텝을 속도 %2 스텝/초로 회전하기 %3',
                        cheeselite_change_step_motor_velocity_by:
                            '스텝 모터의 속도를 %1 스텝/초만큼 바꾸기 %2',
                        cheeselite_set_step_motor_velocity_to:
                            '스텝 모터의 속도를 %1 스텝/초로 정하기 %2',
                        cheeselite_stop_off_step_motor: '스텝 모터 %1 %2',
                        cheeselite_set_step_motor_mode_to: '스텝 모터를 %1 모드로 정하기 %2',
                        cheeselite_step_count: '스텝 수',
                        cheeselite_set_led_to_color: 'RGB LED %1을(를) %2 %3으로 정하기 %4',
                        cheeselite_pick_led_to: 'RGB LED %1을(를) %2로 정하기 %3',
                        cheeselite_change_led_by_rgb:
                            'RGB LED %1을(를) R: %2 G: %3 B: %4만큼 바꾸기 %5',
                        cheeselite_setLed_to_rgb:
                            'RGB LED %1을(를) R: %2 G: %3 B: %4(으)로 정하기 %5',
                        cheeselite_clear_led: 'RGB LED %1 끄기 %2',
                        cheeselite_set_led_type_to: 'RGB LED %1을(를) %2형으로 정하기 %3',
                        cheeselite_neopixel_set_number_and_type_to:
                            '네오픽셀 LED %1개, %2로 정하기 %3',
                        cheeselite_neopixel_set_all_leds_to_pattern:
                            '네오픽셀 모든 LED를 %1 패턴으로 정하기 %2',
                        cheeselite_neopixel_set_all_leds_to_color:
                            '네오픽셀 모든 LED를 %1으로 정하기 %2',
                        cheeselite_neopixel_pick_all_leds_to: '네오픽셀 모든 LED를 %1로 정하기 %2',
                        cheeselite_neopixel_change_all_leds_by_rgb:
                            '네오픽셀 모든 LED를 R: %1 G: %2 B: %3만큼 바꾸기 %4',
                        cheeselite_neopixel_set_all_leds_to_rgb:
                            '네오픽셀 모든 LED를 R: %1 G: %2 B: %3(으)로 정하기 %4',
                        cheeselite_neopixel_clear_all_leds: '네오픽셀 모든 LED 끄기 %1',
                        cheeselite_neopixel_set_led_to_color:
                            '네오픽셀 %1번째 LED를 %2으로 정하기 %3',
                        cheeselite_neopixel_pick_led_to: '네오픽셀 %1번째 LED를 %2로 정하기 %3',
                        cheeselite_neopixel_change_led_by_rgb:
                            '네오픽셀 %1번째 LED를 R: %2 G: %3 B: %4만큼 바꾸기 %5',
                        cheeselite_neopixel_set_led_to_rgb:
                            '네오픽셀 %1번째 LED를 R: %2 G: %3 B: %4(으)로 정하기 %5',
                        cheeselite_neopixel_clear_led: '네오픽셀 %1번째 LED 끄기 %2',
                        cheeselite_neopixel_set_led_range_to_pattern:
                            '네오픽셀 %1번째부터 %2번째까지의 LED를 %3 패턴으로 정하기 %4',
                        cheeselite_neopixel_set_led_range_to_color:
                            '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 %4으로 정하기 %5',
                        cheeselite_neopixel_pick_led_range_to:
                            '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 %4로 정하기 %5',
                        cheeselite_neopixel_change_led_range_by_rgb:
                            '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 R: %4 G: %5 B: %6만큼 바꾸기 %7',
                        cheeselite_neopixel_set_led_range_to_rgb:
                            '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED를 R: %4 G: %5 B: %6(으)로 정하기 %7',
                        cheeselite_neopixel_clear_led_range:
                            '네오픽셀 %1번째부터 %2번째까지 %3칸 간격의 LED 끄기 %4',
                        cheeselite_neopixel_shift: '네오픽셀 %1칸 이동하기 %2',
                        cheeselite_neopixel_rotate: '네오픽셀 %1칸 회전하기 %2',
                        cheeselite_neopixel_change_brightness_by:
                            '네오픽셀 밝기를 %1%만큼 바꾸기 %2',
                        cheeselite_neopixel_set_brightness_to: '네오픽셀 밝기를 %1%로 정하기 %2',
                        cheeselite_write_serial: '시리얼 %1 %2 쓰기 %3',
                        cheeselite_read_serial_until: '시리얼 %1 읽기 %2',
                        cheeselite_set_serial_port_to: '시리얼 포트를 %1로 정하기 %2',
                        cheeselite_set_serial_rate_to: '시리얼 속도를 %1Bd로 정하기 %2',
                        cheeselite_serial_input: '시리얼 입력',
                        cheeselite_pid_start: '%1 시작하기 %2',
                        cheeselite_pid_set_range_to:
                            'PID %1의 범위 %2 ~ %3을(를) %4 ~ %5 소수점 %6으로 정하기 %7',
                        cheeselite_pid_set_three_ranges_to:
                            'PID %1의 범위 %2 ~ %3 ~ %4을(를) %5 ~ %6 ~ %7 소수점 %8으로 정하기 %9',
                        cheeselite_pid_reset_encoder: 'PID 엔코더 값 초기화하기 %1',
                        cheeselite_pid_input: 'PID %1',
                        cheeselite_pid_button_state: 'PID 버튼 %1을(를) %2?',
                        cheeselite_hat010_start: 'HAT-010 5x5 매트릭스 시작하기 %1',
                        cheeselite_hat010_button: 'HAT-010 버튼 %1',
                        cheeselite_hat010_button_state: 'HAT-010 버튼 %1를 %2?',
                        cheeselite_hat010_background_turn_on_xy:
                            'HAT-010 배경 x: %1 y: %2 %3으로 켜기 %4',
                        cheeselite_hat010_background_turn_off_xy:
                            'HAT-010 배경 x: %1 y: %2 끄기 %3',
                        cheeselite_hat010_background_draw_shape_at_xy:
                            'HAT-010 배경 %1 %2을(를) x: %3 y: %4에 그리기 %5',
                        cheeselite_hat010_background_draw_string_at_xy:
                            'HAT-010 배경 %1 글자 %2을(를) x: %3 y: %4에 그리기 %5',
                        cheeselite_hat010_background_draw_pattern_at_xy:
                            'HAT-010 배경 %1 패턴 %2을(를) x: %3 y: %4에 그리기 %5',
                        cheeselite_hat010_clear: 'HAT-010 %1 지우기 %2',
                        cheeselite_hat010_scroll_by_xy: 'HAT-010 %1 x: %2 y: %3만큼 이동하기 %4',
                        cheeselite_hat010_sprite_set_to_shape:
                            'HAT-010 그림 %1을(를) %2 %3(으)로 정하기 %4',
                        cheeselite_hat010_sprite_set_to_string:
                            'HAT-010 그림 %1을(를) %2 글자 %3(으)로 정하기 %4',
                        cheeselite_hat010_sprite_set_to_pattern:
                            'HAT-010 그림 %1을(를) %2 패턴 %3(으)로 정하기 %4',
                        cheeselite_hat010_sprite_clear_show_hide: 'HAT-010 그림 %1 %2 %3',
                        cheeselite_hat010_sprite_change_positions_by_xy:
                            'HAT-010 그림 %1의 위치를 x: %2 y: %3만큼 바꾸기 %4',
                        cheeselite_hat010_sprite_set_positions_to_xy:
                            'HAT-010 그림 %1의 위치를 x: %2 y: %3(으)로 정하기 %4',
                        cheeselite_hat010_sprite_change_position_by_value:
                            'HAT-010 그림 %1의 %2 위치를 %3만큼 바꾸기 %4',
                        cheeselite_hat010_sprite_set_position_to_value:
                            'HAT-010 그림 %1의 %2 위치를 %3(으)로 정하기 %4',
                        cheeselite_hat010_sprite_rotate:
                            'HAT-010 그림 %1을(를) %2 방향으로 회전하기 %3',
                        cheeselite_hat010_sprite_flip_in_direction:
                            'HAT-010 그림 %1을(를) %2 방향으로 뒤집기 %3',
                        cheeselite_hat010_sprite_stamp_to_background:
                            'HAT-010 그림 %1을(를) 배경에 도장 찍기 %2',
                        cheeselite_hat010_sprite_position: 'HAT-010 그림 %1의 %2 위치',
                        cheeselite_hat010_sprite_touching_sprite:
                            'HAT-010 그림 %1이(가) 그림 %2에 닿았는가?',
                        cheeselite_hat010_sprite_touching: 'HAT-010 그림 %1이(가) %2에 닿았는가?',
                        cheeselite_hat010_change_brightness_by: 'HAT-010 밝기를 %1%만큼 바꾸기 %2',
                        cheeselite_hat010_set_brightness_to: 'HAT-010 밝기를 %1%로 정하기 %2',
                    },
                    Helper: {},
                    Blocks: {
                        ROBOID_sensor_signal_strength: '신호 세기',
                        ROBOID_sensor_signal_strength_dbm: '신호 세기 (dBm)',
                        ROBOID_sensor_acceleration_x: 'x축 가속도',
                        ROBOID_sensor_acceleration_y: 'y축 가속도',
                        ROBOID_sensor_acceleration_z: 'z축 가속도',
                        ROBOID_sensor_input_sa: '입력 Sa',
                        ROBOID_sensor_input_sb: '입력 Sb',
                        ROBOID_sensor_input_sc: '입력 Sc',
                        ROBOID_sensor_input_la: '입력 La',
                        ROBOID_sensor_input_lb: '입력 Lb',
                        ROBOID_sensor_input_lc: '입력 Lc',
                        ROBOID_sensor_step_count: '스텝 수',
                        ROBOID_monitor_output_sa: '출력 Sa',
                        ROBOID_monitor_output_sb: '출력 Sb',
                        ROBOID_monitor_output_sc: '출력 Sc',
                        ROBOID_monitor_output_la: '출력 La',
                        ROBOID_monitor_output_lb: '출력 Lb',
                        ROBOID_monitor_output_lc: '출력 Lc',
                        ROBOID_monitor_output_mab: '출력 Mab',
                        ROBOID_monitor_output_mcd: '출력 Mcd',
                        ROBOID_monitor_buzzer: '버저',
                        ROBOID_monitor_note: '음표',
                        ROBOID_logo_sky_direction: '로고가 하늘 방향',
                        ROBOID_logo_earth_direction: '로고가 땅 방향',
                        ROBOID_power_switch_sky_direction: '전원 스위치가 하늘 방향',
                        ROBOID_power_switch_earth_direction: '전원 스위치가 땅 방향',
                        ROBOID_port_s_sky_direction: '포트 S가 하늘 방향',
                        ROBOID_port_s_earth_direction: '포트 S가 땅 방향',
                        ROBOID_tap: '두드림',
                        ROBOID_free_fall: '자유 낙하',
                        ROBOID_battery_normal: '배터리 정상',
                        ROBOID_battery_low: '배터리 부족',
                        ROBOID_battery_empty: '배터리 없음',
                        ROBOID_sound_beep: '삐',
                        ROBOID_sound_random_beep: '무작위 삐',
                        ROBOID_sound_noise: '지지직',
                        ROBOID_sound_siren: '사이렌',
                        ROBOID_sound_engine: '엔진',
                        ROBOID_sound_chop: '쩝',
                        ROBOID_sound_robot: '로봇',
                        ROBOID_sound_dibidibidip: '디비디비딥',
                        ROBOID_sound_good_job: '잘 했어요',
                        ROBOID_sound_happy: '행복',
                        ROBOID_sound_angry: '화남',
                        ROBOID_sound_sad: '슬픔',
                        ROBOID_sound_sleep: '졸림',
                        ROBOID_sound_march: '행진',
                        ROBOID_sound_birthday: '생일',
                        ROBOID_note_c: '도',
                        ROBOID_note_c_sharp: '도♯(레♭)',
                        ROBOID_note_d: '레',
                        ROBOID_note_d_sharp: '레♯(미♭)',
                        ROBOID_note_e: '미',
                        ROBOID_note_f: '파',
                        ROBOID_note_f_sharp: '파♯(솔♭)',
                        ROBOID_note_g: '솔',
                        ROBOID_note_g_sharp: '솔♯(라♭)',
                        ROBOID_note_a: '라',
                        ROBOID_note_a_sharp: '라♯(시♭)',
                        ROBOID_note_b: '시',
                        ROBOID_speaker_internal: '내부 스피커',
                        ROBOID_speaker_port_mab: '포트 Mab',
                        ROBOID_io_mode_makey: '메이키',
                        ROBOID_io_mode_button: '버튼',
                        ROBOID_io_mode_digital_pull_up: '디지털 (풀업)',
                        ROBOID_io_mode_digital_pull_down: '디지털 (풀다운)',
                        ROBOID_io_mode_analog: '아날로그',
                        ROBOID_io_mode_voltage: '전압',
                        ROBOID_io_mode_pulse: '펄스',
                        ROBOID_io_mode_pulse_pull_up: '펄스 (풀업)',
                        ROBOID_io_mode_pulse_pull_down: '펄스 (풀다운)',
                        ROBOID_io_mode_normal: '기본',
                        ROBOID_io_mode_power: '파워',
                        ROBOID_io_port_high_current_mab: '고전류 Ma(-)b',
                        ROBOID_io_port_high_current_mcd: '고전류 Mc(-)d',
                        ROBOID_io_action_stop: '정지하기',
                        ROBOID_io_action_turn_off: '전원 끄기',
                        ROBOID_range_integer: '없음',
                        ROBOID_range_real: '있음',
                        ROBOID_led_intensity_dark: '어두운',
                        ROBOID_led_intensity_normal: '기본',
                        ROBOID_led_intensity_bright: '밝은',
                        ROBOID_led_type_default: '기본',
                        ROBOID_led_type_crgb: '-RGB',
                        ROBOID_led_type_crbg: '-RBG',
                        ROBOID_led_type_cgrb: '-GRB',
                        ROBOID_led_type_cgbr: '-GBR',
                        ROBOID_led_type_cbrg: '-BRG',
                        ROBOID_led_type_cbgr: '-BGR',
                        ROBOID_led_type_argb: '+RGB',
                        ROBOID_led_type_arbg: '+RBG',
                        ROBOID_led_type_agrb: '+GRB',
                        ROBOID_led_type_agbr: '+GBR',
                        ROBOID_led_type_abrg: '+BRG',
                        ROBOID_led_type_abgr: '+BGR',
                        ROBOID_color_red: '빨간색',
                        ROBOID_color_orange: '주황색',
                        ROBOID_color_yellow: '노란색',
                        ROBOID_color_green: '초록색',
                        ROBOID_color_sky_blue: '하늘색',
                        ROBOID_color_blue: '파란색',
                        ROBOID_color_violet: '보라색',
                        ROBOID_color_purple: '자주색',
                        ROBOID_color_white: '하얀색',
                        ROBOID_neopixel_3_colors: '3색',
                        ROBOID_neopixel_6_colors: '6색',
                        ROBOID_neopixel_12_colors: '12색',
                        ROBOID_neopixel_red_green: '빨간색부터 초록색까지',
                        ROBOID_neopixel_red_blue: '빨간색부터 파란색까지',
                        ROBOID_neopixel_red_white: '빨간색부터 하얀색까지',
                        ROBOID_neopixel_green_red: '초록색부터 빨간색까지',
                        ROBOID_neopixel_green_blue: '초록색부터 파란색까지',
                        ROBOID_neopixel_green_white: '초록색부터 하얀색까지',
                        ROBOID_neopixel_blue_red: '파란색부터 빨간색까지',
                        ROBOID_neopixel_blue_green: '파란색부터 초록색까지',
                        ROBOID_neopixel_blue_white: '파란색부터 하얀색까지',
                        ROBOID_neopixel_white_red: '하얀색부터 빨간색까지',
                        ROBOID_neopixel_white_green: '하얀색부터 초록색까지',
                        ROBOID_neopixel_white_blue: '하얀색부터 파란색까지',
                        ROBOID_neopixel_red_black: '빨간색 점점 어둡게',
                        ROBOID_neopixel_green_black: '초록색 점점 어둡게',
                        ROBOID_neopixel_blue_black: '파란색 점점 어둡게',
                        ROBOID_neopixel_white_black: '하얀색 점점 어둡게',
                        ROBOID_neopixel_black_red: '빨간색 점점 밝게',
                        ROBOID_neopixel_black_green: '초록색 점점 밝게',
                        ROBOID_neopixel_black_blue: '파란색 점점 밝게',
                        ROBOID_neopixel_black_white: '하얀색 점점 밝게',
                        ROBOID_serial_string: '글자',
                        ROBOID_serial_string_line: '글자 한 줄',
                        ROBOID_serial_all: '모두',
                        ROBOID_serial_until_comma: ',(쉼표)까지',
                        ROBOID_serial_until_colon: ':(쌍점)까지',
                        ROBOID_serial_until_dollar: '$까지',
                        ROBOID_serial_until_sharp: '#까지',
                        ROBOID_serial_until_new_line: '줄 바꿈까지',
                        ROBOID_serial_port_wa_rb: 'La(쓰기) Lb(읽기)',
                        ROBOID_serial_port_ra_wb: 'La(읽기) Lb(쓰기)',
                        ROBOID_serial_port_wa: 'La(쓰기)',
                        ROBOID_serial_port_ra: 'La(읽기)',
                        ROBOID_pid_10: 'PID-10 초음파 센서(HC-SR04+)',
                        ROBOID_pid_11_1: 'PID-11-1 온습도 센서(DHT11)',
                        ROBOID_pid_11_2: 'PID-11-2 온습도 센서(DHT21)',
                        ROBOID_pid_11_3: 'PID-11-3 온습도 센서(DHT22)',
                        ROBOID_pid_12: 'PID-12 온도 센서(DS18B20)',
                        ROBOID_pid_13: 'PID-13 조이스틱과 버튼',
                        ROBOID_pid_14: 'PID-14 듀얼 조이스틱',
                        ROBOID_pid_15: 'PID-15 IR 송수신기',
                        ROBOID_pid_16: 'PID-16 엔코더',
                        ROBOID_pid_distance: '거리 (cm)',
                        ROBOID_pid_temperature: '온도 (℃)',
                        ROBOID_pid_humidity: '습도 (%RH)',
                        ROBOID_pid_x1: 'x1',
                        ROBOID_pid_y1: 'y1',
                        ROBOID_pid_x2: 'x2',
                        ROBOID_pid_y2: 'y2',
                        ROBOID_pid_button1: '버튼1',
                        ROBOID_pid_button2: '버튼2',
                        ROBOID_pid_encoder: '엔코더',
                        ROBOID_clicked: '클릭했는가',
                        ROBOID_double_clicked: '더블클릭했는가',
                        ROBOID_long_pressed: '오래 눌렀는가',
                        ROBOID_shape_square: '사각형',
                        ROBOID_shape_triangle: '삼각형',
                        ROBOID_shape_diamond: '다이아몬드',
                        ROBOID_shape_circle: '원',
                        ROBOID_shape_x: 'X',
                        ROBOID_shape_like: '좋음',
                        ROBOID_shape_dislike: '싫음',
                        ROBOID_shape_angry: '화남',
                        ROBOID_shape_open_mouth: '입 열기',
                        ROBOID_shape_close_mouth: '입 닫기',
                        ROBOID_shape_walk1: '걷기 1',
                        ROBOID_shape_walk2: '걷기 2',
                        ROBOID_shape_heart: '하트',
                        ROBOID_shape_star: '별',
                        ROBOID_shape_airplane: '비행기',
                        ROBOID_shape_puppy: '강아지',
                        ROBOID_shape_butterfly: '나비',
                        ROBOID_shape_quarter_note: '4분 음표',
                        ROBOID_shape_eighth_note: '8분 음표',
                        ROBOID_shape_left_arrow: '왼쪽 화살표',
                        ROBOID_shape_right_arrow: '오른쪽 화살표',
                        ROBOID_shape_up_arrow: '위쪽 화살표',
                        ROBOID_shape_down_arrow: '아래쪽 화살표',
                        ROBOID_hat_background: '배경',
                        ROBOID_hat_all: '모두',
                        ROBOID_hat_clear: '지우기',
                        ROBOID_hat_show: '보이기',
                        ROBOID_hat_hide: '숨기기',
                        ROBOID_hat_clockwise: '시계',
                        ROBOID_hat_counterclockwise: '반시계',
                        ROBOID_hat_left_right: '왼쪽-오른쪽',
                        ROBOID_hat_up_down: '위-아래',
                        ROBOID_hat_auto: '자동',
                        ROBOID_hat_manual: '수동',
                        ROBOID_hat_other_sprite: '다른 그림',
                        ROBOID_hat_left_wall: '왼쪽 벽',
                        ROBOID_hat_right_wall: '오른쪽 벽',
                        ROBOID_hat_top_wall: '위쪽 벽',
                        ROBOID_hat_bottom_wall: '아래쪽 벽',
                        ROBOID_hat_any_wall: '아무 벽',
                    },
                },
                en: {
                    template: {
                        cheeselite_value: '%1',
                        cheeselite_boolean: '%1?',
                        cheeselite_play_sound_times: 'play sound %1 %2 times %3',
                        cheeselite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        cheeselite_change_buzzer_by: 'change buzzer by %1 Hz %2',
                        cheeselite_set_buzzer_to: 'set buzzer to %1 Hz %2',
                        cheeselite_clear_sound: 'clear sound %1',
                        cheeselite_play_note: 'play note %1 %2 %3',
                        cheeselite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        cheeselite_rest_for: 'rest for %1 beats %2',
                        cheeselite_change_tempo_by: 'change tempo by %1 BPM %2',
                        cheeselite_set_tempo_to: 'set tempo to %1 BPM %2',
                        cheeselite_set_sound_port_to: 'set sound output to %1 %2',
                        cheeselite_set_input_mode_to: 'set port %1 to %2 input %3',
                        cheeselite_set_input_range_to:
                            'set input %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
                        cheeselite_set_three_input_ranges_to:
                            'set input %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
                        cheeselite_analog_input: 'input %1',
                        cheeselite_digital_input: 'input %1 %2 ?',
                        cheeselite_button_state: 'button %1 %2 ?',
                        cheeselite_set_pulse_mode_to: 'set port %1 to %2 input %3',
                        cheeselite_pulse_input: 'pulse detected on port %1 ?',
                        cheeselite_set_digital_output_to: 'set digital output %1 to %2 %3',
                        cheeselite_change_pwm_output_by: 'change pwm output %1 by %2% %3',
                        cheeselite_set_pwm_output_to: 'set pwm output %1 to %2% %3',
                        cheeselite_change_servo_motor_angle_by:
                            'change servo motor %1 by %2 degrees %3',
                        cheeselite_set_servo_motor_angle_to: 'set servo motor %1 to %2 degrees %3',
                        cheeselite_turn_off_servo_motor: 'turn off servo motor %1 %2',
                        cheeselite_change_dc_motor_velocity_by:
                            'change dc motor %1 velocity by %2% %3',
                        cheeselite_set_dc_motor_velocity_to: 'set dc motor %1 velocity to %2% %3',
                        cheeselite_stop_dc_motor: 'stop dc motor %1 %2',
                        cheeselite_rotate_step_motor:
                            'rotate step motor %1 steps with velocity %2 step/sec %3',
                        cheeselite_change_step_motor_velocity_by:
                            'change step motor velocity by %1 step/sec %2',
                        cheeselite_set_step_motor_velocity_to:
                            'set step motor velocity to %1 step/sec %2',
                        cheeselite_stop_off_step_motor: '%1 step motor %2',
                        cheeselite_set_step_motor_mode_to: 'set step motor to %1 mode %2',
                        cheeselite_step_count: 'step count',
                        cheeselite_set_led_to_color: 'set rgb led %1 to %2 %3 %4',
                        cheeselite_pick_led_to: 'set rgb led %1 to %2 %3',
                        cheeselite_change_led_by_rgb: 'change rgb led %1 by r: %2 g: %3 b: %4 %5',
                        cheeselite_setLed_to_rgb: 'set rgb led %1 to r: %2 g: %3 b: %4 %5',
                        cheeselite_clear_led: 'clear rgb led %1 %2',
                        cheeselite_set_led_type_to: 'set rgb led %1 to %2 type %3',
                        cheeselite_neopixel_set_number_and_type_to:
                            'neopixel: set %1 leds as %2 %3',
                        cheeselite_neopixel_set_all_leds_to_color:
                            'neopixel: set all leds to %1 %2',
                        cheeselite_neopixel_pick_all_leds_to: 'neopixel: set all leds to %1 %2',
                        cheeselite_neopixel_change_all_leds_by_rgb:
                            'neopixel: change all leds by r: %1 g: %2 b: %3 %4',
                        cheeselite_neopixel_set_all_leds_to_rgb:
                            'neopixel: set all leds to r: %1 g: %2 b: %3 %4',
                        cheeselite_neopixel_set_all_leds_to_pattern:
                            'neopixel: set all leds to pattern %1 %2',
                        cheeselite_neopixel_clear_all_leds: 'neopixel: clear all leds %1',
                        cheeselite_neopixel_set_led_to_color: 'neopixel: set led %1 to %2 %3',
                        cheeselite_neopixel_pick_led_to: 'neopixel: set led %1 to %2 %3',
                        cheeselite_neopixel_change_led_by_rgb:
                            'neopixel: change led %1 by r: %2 g: %3 b: %4 %5',
                        cheeselite_neopixel_set_led_to_rgb:
                            'neopixel: set led %1 to r: %2 g: %3 b: %4 %5',
                        cheeselite_neopixel_clear_led: 'neopixel: clear led %1 %2',
                        cheeselite_neopixel_set_led_range_to_color:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
                        cheeselite_neopixel_pick_led_range_to:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
                        cheeselite_neopixel_change_led_range_by_rgb:
                            'neopixel: change leds (from %1 to %2 with %3 increments) by r: %4 g: %5 b: %6 %7',
                        cheeselite_neopixel_set_led_range_to_rgb:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to r: %4 g: %5 b: %6 %7',
                        cheeselite_neopixel_set_led_range_to_pattern:
                            'neopixel: set leds (from %1 to %2) to pattern %3 %4',
                        cheeselite_neopixel_clear_led_range:
                            'neopixel: clear leds (from %1 to %2 with %3 increments) %4',
                        cheeselite_neopixel_shift: 'neopixel: shift %1 pixels %2',
                        cheeselite_neopixel_rotate: 'neopixel: rotate %1 pixels %2',
                        cheeselite_neopixel_change_brightness_by:
                            'neopixel: change brightness by %1% %2',
                        cheeselite_neopixel_set_brightness_to: 'neopixel: set brightness to %1% %2',
                        cheeselite_write_serial: 'write %1 %2 to serial %3',
                        cheeselite_read_serial_until: 'read serial %1 %2',
                        cheeselite_set_serial_port_to: 'set serial port to %1 %2',
                        cheeselite_set_serial_rate_to: 'set serial rate to %1Bd %2',
                        cheeselite_serial_input: 'serial input',
                        cheeselite_pid_start: 'start %1 %2',
                        cheeselite_pid_set_range_to:
                            'PID: set %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
                        cheeselite_pid_set_three_ranges_to:
                            'PID: set %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
                        cheeselite_pid_reset_encoder: 'PID: clear encoder %1',
                        cheeselite_pid_input: 'PID: %1',
                        cheeselite_pid_button_state: 'PID: button %1 %2?',
                        cheeselite_hat010_start: 'start HAT-010 5x5 matrix %1',
                        cheeselite_hat010_button: 'HAT-010: button %1',
                        cheeselite_hat010_button_state: 'HAT-010: button %1 %2?',
                        cheeselite_hat010_background_turn_on_xy:
                            'HAT-010 background: turn on x: %1 y: %2 in %3 %4',
                        cheeselite_hat010_background_turn_off_xy:
                            'HAT-010 background: turn off x: %1 y: %2 %3',
                        cheeselite_hat010_background_draw_shape_at_xy:
                            'HAT-010 background: draw %1 %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_background_draw_string_at_xy:
                            'HAT-010 background: draw %1 string %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_background_draw_pattern_at_xy:
                            'HAT-010 background: draw %1 pattern %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_clear: 'HAT-010: clear %1 %2',
                        cheeselite_hat010_scroll_by_xy: 'HAT-010: scroll %1 by x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_set_to_shape:
                            'HAT-010 sprite %1: set sprite to %2 %3 %4',
                        cheeselite_hat010_sprite_set_to_string:
                            'HAT-010 sprite %1: set sprite to %2 string %3 %4',
                        cheeselite_hat010_sprite_set_to_pattern:
                            'HAT-010 sprite %1: set sprite to %2 pattern %3 %4',
                        cheeselite_hat010_sprite_clear_show_hide: 'HAT-010 sprite %1: %2 sprite %3',
                        cheeselite_hat010_sprite_change_positions_by_xy:
                            'HAT-010 sprite %1: change position by x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_set_positions_to_xy:
                            'HAT-010 sprite %1: set position to x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_change_position_by_value:
                            'HAT-010 sprite %1: change %2 position by %3 %4',
                        cheeselite_hat010_sprite_set_position_to_value:
                            'HAT-010 sprite %1: set %2 position to %3 %4',
                        cheeselite_hat010_sprite_rotate: 'HAT-010 sprite %1: rotate %2 %3',
                        cheeselite_hat010_sprite_flip_in_direction:
                            'HAT-010 sprite %1: flip in %2 direction %3',
                        cheeselite_hat010_sprite_stamp_to_background:
                            'HAT-010 sprite %1: stamp to background %2',
                        cheeselite_hat010_sprite_position: 'HAT-010 sprite %1: %2 position',
                        cheeselite_hat010_sprite_touching_sprite:
                            'HAT-010 sprite %1: touching sprite %2?',
                        cheeselite_hat010_sprite_touching: 'HAT-010 sprite %1: touching %2?',
                        cheeselite_hat010_change_brightness_by:
                            'HAT-010: change brightness by %1% %2',
                        cheeselite_hat010_set_brightness_to: 'HAT-010: set brightness to %1% %2',
                    },
                    Helper: {},
                    Blocks: {
                        ROBOID_sensor_signal_strength: 'signal strength',
                        ROBOID_sensor_signal_strength_dbm: 'signal strength (dBm)',
                        ROBOID_sensor_acceleration_x: 'x acceleration',
                        ROBOID_sensor_acceleration_y: 'y acceleration',
                        ROBOID_sensor_acceleration_z: 'z acceleration',
                        ROBOID_sensor_input_sa: 'input Sa',
                        ROBOID_sensor_input_sb: 'input Sb',
                        ROBOID_sensor_input_sc: 'input Sc',
                        ROBOID_sensor_input_la: 'input La',
                        ROBOID_sensor_input_lb: 'input Lb',
                        ROBOID_sensor_input_lc: 'input Lc',
                        ROBOID_sensor_step_count: 'step count',
                        ROBOID_monitor_output_sa: 'output Sa',
                        ROBOID_monitor_output_sb: 'output Sb',
                        ROBOID_monitor_output_sc: 'output Sc',
                        ROBOID_monitor_output_la: 'output La',
                        ROBOID_monitor_output_lb: 'output Lb',
                        ROBOID_monitor_output_lc: 'output Lc',
                        ROBOID_monitor_output_mab: 'output Mab',
                        ROBOID_monitor_output_mcd: 'output Mcd',
                        ROBOID_monitor_buzzer: 'buzzer',
                        ROBOID_monitor_note: 'note',
                        ROBOID_logo_sky_direction: 'logo in sky direction',
                        ROBOID_logo_earth_direction: 'logo in earth direction',
                        ROBOID_power_switch_sky_direction: 'power switch in sky direction',
                        ROBOID_power_switch_earth_direction: 'power switch in earth direction',
                        ROBOID_port_s_sky_direction: 'port S in sky direction',
                        ROBOID_port_s_earth_direction: 'port S in earth direction',
                        ROBOID_tap: 'tap',
                        ROBOID_free_fall: 'free fall',
                        ROBOID_battery_normal: 'battery normal',
                        ROBOID_battery_low: 'battery low',
                        ROBOID_battery_empty: 'battery empty',
                        ROBOID_sound_beep: 'beep',
                        ROBOID_sound_random_beep: 'random beep',
                        ROBOID_sound_noise: 'noise',
                        ROBOID_sound_siren: 'siren',
                        ROBOID_sound_engine: 'engine',
                        ROBOID_sound_chop: 'chop',
                        ROBOID_sound_robot: 'robot',
                        ROBOID_sound_dibidibidip: 'dibidibidip',
                        ROBOID_sound_good_job: 'good job',
                        ROBOID_sound_happy: 'happy',
                        ROBOID_sound_angry: 'angry',
                        ROBOID_sound_sad: 'sad',
                        ROBOID_sound_sleep: 'sleep',
                        ROBOID_sound_march: 'march',
                        ROBOID_sound_birthday: 'birthday',
                        ROBOID_note_c: 'C',
                        ROBOID_note_c_sharp: 'C♯(D♭)',
                        ROBOID_note_d: 'D',
                        ROBOID_note_d_sharp: 'D♯(E♭)',
                        ROBOID_note_e: 'E',
                        ROBOID_note_f: 'F',
                        ROBOID_note_f_sharp: 'F♯(G♭)',
                        ROBOID_note_g: 'G',
                        ROBOID_note_g_sharp: 'G♯(A♭)',
                        ROBOID_note_a: 'A',
                        ROBOID_note_a_sharp: 'A♯(B♭)',
                        ROBOID_note_b: 'B',
                        ROBOID_speaker_internal: 'internal speaker',
                        ROBOID_speaker_port_mab: 'port Mab',
                        ROBOID_io_mode_makey: 'makey',
                        ROBOID_io_mode_button: 'button',
                        ROBOID_io_mode_digital_pull_up: 'digital (pull up)',
                        ROBOID_io_mode_digital_pull_down: 'digital (pull down)',
                        ROBOID_io_mode_analog: 'analog',
                        ROBOID_io_mode_voltage: 'voltage',
                        ROBOID_io_mode_pulse: 'pulse',
                        ROBOID_io_mode_pulse_pull_up: 'pulse (pull up)',
                        ROBOID_io_mode_pulse_pull_down: 'pulse (pull down)',
                        ROBOID_io_mode_normal: 'normal',
                        ROBOID_io_mode_power: 'power',
                        ROBOID_io_port_high_current_mab: 'high current Ma(-)b',
                        ROBOID_io_port_high_current_mcd: 'high current Mc(-)d',
                        ROBOID_io_action_stop: 'stop',
                        ROBOID_io_action_turn_off: 'turn off',
                        ROBOID_range_integer: 'without',
                        ROBOID_range_real: 'with',
                        ROBOID_led_intensity_dark: 'dark',
                        ROBOID_led_intensity_normal: 'normal',
                        ROBOID_led_intensity_bright: 'bright',
                        ROBOID_led_type_default: 'default',
                        ROBOID_led_type_crgb: '-rgb',
                        ROBOID_led_type_crbg: '-rbg',
                        ROBOID_led_type_cgrb: '-grb',
                        ROBOID_led_type_cgbr: '-gbr',
                        ROBOID_led_type_cbrg: '-brg',
                        ROBOID_led_type_cbgr: '-bgr',
                        ROBOID_led_type_argb: '+rgb',
                        ROBOID_led_type_arbg: '+rbg',
                        ROBOID_led_type_agrb: '+grb',
                        ROBOID_led_type_agbr: '+gbr',
                        ROBOID_led_type_abrg: '+brg',
                        ROBOID_led_type_abgr: '+bgr',
                        ROBOID_color_red: 'red',
                        ROBOID_color_orange: 'orange',
                        ROBOID_color_yellow: 'yellow',
                        ROBOID_color_green: 'green',
                        ROBOID_color_sky_blue: 'sky blue',
                        ROBOID_color_blue: 'blue',
                        ROBOID_color_violet: 'violet',
                        ROBOID_color_purple: 'purple',
                        ROBOID_color_white: 'white',
                        ROBOID_neopixel_3_colors: '3 colors',
                        ROBOID_neopixel_6_colors: '6 colors',
                        ROBOID_neopixel_12_colors: '12 colors',
                        ROBOID_neopixel_red_green: 'red to green',
                        ROBOID_neopixel_red_blue: 'red to blue',
                        ROBOID_neopixel_red_white: 'red to white',
                        ROBOID_neopixel_green_red: 'green to red',
                        ROBOID_neopixel_green_blue: 'green to blue',
                        ROBOID_neopixel_green_white: 'green to white',
                        ROBOID_neopixel_blue_red: 'blue to red',
                        ROBOID_neopixel_blue_green: 'blue to green',
                        ROBOID_neopixel_blue_white: 'blue to white',
                        ROBOID_neopixel_white_red: 'white to red',
                        ROBOID_neopixel_white_green: 'white to green',
                        ROBOID_neopixel_white_blue: 'white to blue',
                        ROBOID_neopixel_red_black: 'red getting darker',
                        ROBOID_neopixel_green_black: 'green getting darker',
                        ROBOID_neopixel_blue_black: 'blue getting darker',
                        ROBOID_neopixel_white_black: 'white getting darker',
                        ROBOID_neopixel_black_red: 'red getting brighter',
                        ROBOID_neopixel_black_green: 'green getting brighter',
                        ROBOID_neopixel_black_blue: 'blue getting brighter',
                        ROBOID_neopixel_black_white: 'white getting brighter',
                        ROBOID_serial_string: 'string',
                        ROBOID_serial_string_line: 'string line',
                        ROBOID_serial_all: 'all',
                        ROBOID_serial_until_comma: 'until ,(comma)',
                        ROBOID_serial_until_colon: 'until :(colon)',
                        ROBOID_serial_until_dollar: 'until $',
                        ROBOID_serial_until_sharp: 'until #',
                        ROBOID_serial_until_new_line: 'until new line',
                        ROBOID_serial_port_wa_rb: 'La(write) Lb(read)',
                        ROBOID_serial_port_ra_wb: 'La(read) Lb(write)',
                        ROBOID_serial_port_wa: 'La(write)',
                        ROBOID_serial_port_ra: 'La(read)',
                        ROBOID_pid_10: 'PID-10 ultrasonic sensor (HC-SR04+)',
                        ROBOID_pid_11_1: 'PID-11-1 humidity/temperature sensor (DHT11)',
                        ROBOID_pid_11_2: 'PID-11-2 humidity/temperature sensor (DHT21)',
                        ROBOID_pid_11_3: 'PID-11-3 humidity/temperature sensor (DHT22)',
                        ROBOID_pid_12: 'PID-12 temperature sensor (DS18B20)',
                        ROBOID_pid_13: 'PID-13 joystick and button',
                        ROBOID_pid_14: 'PID-14 dual joystick',
                        ROBOID_pid_15: 'PID-15 IR transceiver',
                        ROBOID_pid_16: 'PID-16 encoder',
                        ROBOID_pid_distance: 'distance (cm)',
                        ROBOID_pid_temperature: 'temperature (℃)',
                        ROBOID_pid_humidity: 'humidity (%RH)',
                        ROBOID_pid_x1: 'x1',
                        ROBOID_pid_y1: 'y1',
                        ROBOID_pid_x2: 'x2',
                        ROBOID_pid_y2: 'y2',
                        ROBOID_pid_button1: 'button1',
                        ROBOID_pid_button2: 'button2',
                        ROBOID_pid_encoder: 'encoder',
                        ROBOID_clicked: 'clicked',
                        ROBOID_double_clicked: 'double-clicked',
                        ROBOID_long_pressed: 'long-pressed',
                        ROBOID_shape_square: 'square',
                        ROBOID_shape_triangle: 'triangle',
                        ROBOID_shape_diamond: 'diamond',
                        ROBOID_shape_circle: 'circle',
                        ROBOID_shape_x: 'X',
                        ROBOID_shape_like: 'like',
                        ROBOID_shape_dislike: 'dislike',
                        ROBOID_shape_angry: 'angry',
                        ROBOID_shape_open_mouth: 'open mouth',
                        ROBOID_shape_close_mouth: 'close mouth',
                        ROBOID_shape_walk1: 'walk 1',
                        ROBOID_shape_walk2: 'walk 2',
                        ROBOID_shape_heart: 'heart',
                        ROBOID_shape_star: 'star',
                        ROBOID_shape_airplane: 'airplane',
                        ROBOID_shape_puppy: 'puppy',
                        ROBOID_shape_butterfly: 'butterfly',
                        ROBOID_shape_quarter_note: 'quarter note',
                        ROBOID_shape_eighth_note: 'eighth note',
                        ROBOID_shape_left_arrow: 'left arrow',
                        ROBOID_shape_right_arrow: 'right arrow',
                        ROBOID_shape_up_arrow: 'up arrow',
                        ROBOID_shape_down_arrow: 'down arrow',
                        ROBOID_hat_background: 'background',
                        ROBOID_hat_all: 'all',
                        ROBOID_hat_clear: 'clear',
                        ROBOID_hat_show: 'show',
                        ROBOID_hat_hide: 'hide',
                        ROBOID_hat_clockwise: 'clockwise',
                        ROBOID_hat_counterclockwise: 'counterclockwise',
                        ROBOID_hat_left_right: 'left-right',
                        ROBOID_hat_up_down: 'up-down',
                        ROBOID_hat_auto: 'auto',
                        ROBOID_hat_manual: 'manual',
                        ROBOID_hat_other_sprite: 'other sprite',
                        ROBOID_hat_left_wall: 'left wall',
                        ROBOID_hat_right_wall: 'right wall',
                        ROBOID_hat_top_wall: 'top wall',
                        ROBOID_hat_bottom_wall: 'bottom wall',
                        ROBOID_hat_any_wall: 'any wall',
                    },
                },
                jp: {
                    template: {
                        cheeselite_value: '%1',
                        cheeselite_boolean: '%1?',
                        cheeselite_play_sound_times: '%1 音を %2 回再生する %3',
                        cheeselite_play_sound_times_until_done: '%1 音を %2 回再生して待つ %3',
                        cheeselite_change_buzzer_by: 'ブザー音を %1 Hzずつ変える %2',
                        cheeselite_set_buzzer_to: 'ブザー音を %1 Hzにする %2',
                        cheeselite_clear_sound: '音をオフにする %1',
                        cheeselite_play_note: '%1 %2 音をならす %3',
                        cheeselite_play_note_for: '%1 %2 音を %3 拍子ならす %4',
                        cheeselite_rest_for: '%1 拍子休む %2',
                        cheeselite_change_tempo_by: '演奏のテンポを %1 BPMずつ変える %2',
                        cheeselite_set_tempo_to: '演奏のテンポを %1 BPMにする %2',
                        cheeselite_set_sound_port_to: '音出力を %1にする %2',
                        cheeselite_set_input_mode_to: 'ポート %1を %2 入力にする %3',
                        cheeselite_set_input_range_to:
                            '入力 %1の範囲 %2 ~ %3を %4 ~ %5 小数点 %6にする %7',
                        cheeselite_set_three_input_ranges_to:
                            '入力 %1の範囲 %2 ~ %3 ~ %4を %5 ~ %6 ~ %7 小数点 %8にする %9',
                        cheeselite_analog_input: '入力 %1',
                        cheeselite_digital_input: '入力 %1 %2 ?',
                        cheeselite_button_state: 'ボタン %1を %2?',
                        cheeselite_set_pulse_mode_to: 'ポート %1を %2 入力にする %3',
                        cheeselite_pulse_input: 'ポート %1でパルスが感知されたか?',
                        cheeselite_set_digital_output_to: 'デジタル出力 %1を %2にする %3',
                        cheeselite_change_pwm_output_by: 'PWM出力 %1を %2%ずつ変える %3',
                        cheeselite_set_pwm_output_to: 'PWM出力 %1を %2%にする %3',
                        cheeselite_change_servo_motor_angle_by:
                            'サーボモータ %1の角度を %2度ずつ変える %3',
                        cheeselite_set_servo_motor_angle_to:
                            'サーボモータ %1の角度を %2度にする %3',
                        cheeselite_turn_off_servo_motor: 'サーボモータ %1 の電源をオフにする %2',
                        cheeselite_change_dc_motor_velocity_by:
                            'DCモータ %1の速度を %2%ずつ変える %3',
                        cheeselite_set_dc_motor_velocity_to: 'DCモータ %1の速度を %2%にする %3',
                        cheeselite_stop_dc_motor: 'DCモータ %1 を停止する %2',
                        cheeselite_rotate_step_motor:
                            'ステップモータ %1 ステップを速度 %2 ステップ/秒に回る %3',
                        cheeselite_change_step_motor_velocity_by:
                            'ステップモータの速度を %1 ステップ/秒ずつ変える %2',
                        cheeselite_set_step_motor_velocity_to:
                            'ステップモータの速度を %1 ステップ/秒にする %2',
                        cheeselite_stop_off_step_motor: 'ステップモータを %1 %2',
                        cheeselite_set_step_motor_mode_to: 'ステップモータを %1 モードにする %2',
                        cheeselite_step_count: 'ステップ数',
                        cheeselite_set_led_to_color: 'RGBLED %1を %2 %3にする %4',
                        cheeselite_pick_led_to: 'RGBLED %1を %2にする %3',
                        cheeselite_change_led_by_rgb: 'RGBLED %1を R: %2 G: %3 B: %4ずつ変える %5',
                        cheeselite_setLed_to_rgb: 'RGBLED %1を R: %2 G: %3 B: %4にする %5',
                        cheeselite_clear_led: 'RGBLED %1 をオフにする %2',
                        cheeselite_set_led_type_to: 'RGBLED %1を %2形にする %3',
                        cheeselite_neopixel_set_number_and_type_to:
                            'ネオピクセル: LED %1個、%2にする %3',
                        cheeselite_neopixel_set_all_leds_to_color:
                            'ネオピクセル: すべてのLEDを %1にする %2',
                        cheeselite_neopixel_pick_all_leds_to:
                            'ネオピクセル: すべてのLEDを %1にする %2',
                        cheeselite_neopixel_change_all_leds_by_rgb:
                            'ネオピクセル: すべてのLEDを R: %1 G: %2 B: %3ずつ変える %4',
                        cheeselite_neopixel_set_all_leds_to_rgb:
                            'ネオピクセル: すべてのLEDを R: %1 G: %2 B: %3にする %4',
                        cheeselite_neopixel_set_all_leds_to_pattern:
                            'ネオピクセル: すべてのLEDを %1 パターンにする %2',
                        cheeselite_neopixel_clear_all_leds:
                            'ネオピクセル: すべてのLEDをオフにする %1',
                        cheeselite_neopixel_set_led_to_color:
                            'ネオピクセル: %1番目のLEDを %2にする %3',
                        cheeselite_neopixel_pick_led_to: 'ネオピクセル: %1番目のLEDを %2にする %3',
                        cheeselite_neopixel_change_led_by_rgb:
                            'ネオピクセル: %1番目のLEDを R: %2 G: %3 B: %4ずつ変える %5',
                        cheeselite_neopixel_set_led_to_rgb:
                            'ネオピクセル: %1番目のLEDを R: %2 G: %3 B: %4にする %5',
                        cheeselite_neopixel_clear_led: 'ネオピクセル: %1番目のLEDをオフにする %2',
                        cheeselite_neopixel_set_led_range_to_color:
                            'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを %4にする %5',
                        cheeselite_neopixel_pick_led_range_to:
                            'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを %4にする %5',
                        cheeselite_neopixel_change_led_range_by_rgb:
                            'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを R: %4 G: %5 B: %6ずつ変える %7',
                        cheeselite_neopixel_set_led_range_to_rgb:
                            'ネオピクセル: %1番目から %2番目まで %3間隔のLEDを R: %4 G: %5 B: %6にする %7',
                        cheeselite_neopixel_set_led_range_to_pattern:
                            'ネオピクセル: %1番目から %2番目までのLEDを %3 パターンにする %4',
                        cheeselite_neopixel_clear_led_range:
                            'ネオピクセル: %1番目から %2番目まで %3間隔のLEDをオフにする %4',
                        cheeselite_neopixel_shift: 'ネオピクセル: %1ピクセル移動する %2',
                        cheeselite_neopixel_rotate: 'ネオピクセル: %1ピクセル回転する %2',
                        cheeselite_neopixel_change_brightness_by:
                            'ネオピクセル: 明るさを %1%ずつ変える %2',
                        cheeselite_neopixel_set_brightness_to:
                            'ネオピクセル: 明るさを %1%にする %2',
                        cheeselite_write_serial: 'シリアルに %1 %2 を書き出す %3',
                        cheeselite_read_serial_until: 'シリアルを %1 読み取る %2',
                        cheeselite_set_serial_port_to: 'シリアルポートを %1にする %2',
                        cheeselite_set_serial_rate_to: 'シリアル速度を %1Bdにする %2',
                        cheeselite_serial_input: 'シリアル入力',
                        cheeselite_pid_start: '%1 を開始する %2',
                        cheeselite_pid_set_range_to:
                            'PID %1の範囲 %2 ~ %3を %4 ~ %5 小数点 %6にする %7',
                        cheeselite_pid_set_three_ranges_to:
                            'PID %1の範囲 %2 ~ %3 ~ %4を %5 ~ %6 ~ %7 小数点 %8にする %9',
                        cheeselite_pid_reset_encoder: 'PID エンコーダ値を初期化する %1',
                        cheeselite_pid_input: 'PID %1',
                        cheeselite_pid_button_state: 'PID ボタン %1を %2?',
                        cheeselite_hat010_start: 'HAT-010 5x5マトリックスを開始する %1',
                        cheeselite_hat010_button: 'HAT-010 ボタン %1',
                        cheeselite_hat010_button_state: 'HAT-010 ボタン %1を %2?',
                        cheeselite_hat010_background_turn_on_xy:
                            'HAT-010 背景 x: %1 y: %2を %3に点灯する %4',
                        cheeselite_hat010_background_turn_off_xy:
                            'HAT-010 背景 x: %1 y: %2をオフにする %3',
                        cheeselite_hat010_background_draw_shape_at_xy:
                            'HAT-010 背景 %1 %2を x: %3 y: %4に描画する %5',
                        cheeselite_hat010_background_draw_string_at_xy:
                            'HAT-010 背景 %1 文字列 %2を x: %3 y: %4に描画する %5',
                        cheeselite_hat010_background_draw_pattern_at_xy:
                            'HAT-010 背景 %1 パターン %2を x: %3 y: %4に描画する %5',
                        cheeselite_hat010_clear: 'HAT-010 %1 を消す %2',
                        cheeselite_hat010_scroll_by_xy: 'HAT-010 %1 x: %2 y: %3だけ移動する %4',
                        cheeselite_hat010_sprite_set_to_shape: 'HAT-010 図 %1を %2 %3にする %4',
                        cheeselite_hat010_sprite_set_to_string:
                            'HAT-010 図 %1を %2 文字列 %3にする %4',
                        cheeselite_hat010_sprite_set_to_pattern:
                            'HAT-010 図 %1を %2 パターン %3にする %4',
                        cheeselite_hat010_sprite_clear_show_hide: 'HAT-010 図 %1を %2 %3',
                        cheeselite_hat010_sprite_change_positions_by_xy:
                            'HAT-010 図 %1の位置を x: %2 y: %3ずつ変える %4',
                        cheeselite_hat010_sprite_set_positions_to_xy:
                            'HAT-010 図 %1の位置を x: %2 y: %3にする %4',
                        cheeselite_hat010_sprite_change_position_by_value:
                            'HAT-010 図 %1の %2 位置を %3ずつ変える %4',
                        cheeselite_hat010_sprite_set_position_to_value:
                            'HAT-010 図 %1の %2 位置を %3にする %4',
                        cheeselite_hat010_sprite_rotate: 'HAT-010 図 %1を %2 方向に回転する %3',
                        cheeselite_hat010_sprite_flip_in_direction:
                            'HAT-010 図 %1を %2 方向に反転する %3',
                        cheeselite_hat010_sprite_stamp_to_background:
                            'HAT-010 図 %1を背景にスタンプする %2',
                        cheeselite_hat010_sprite_position: 'HAT-010 図 %1の %2 位置',
                        cheeselite_hat010_sprite_touching_sprite:
                            'HAT-010 図 %1が 図 %2に着いたか?',
                        cheeselite_hat010_sprite_touching: 'HAT-010 図 %1が %2に着いたか?',
                        cheeselite_hat010_change_brightness_by: 'HAT-010 明るさを %1%ずつ変える %2',
                        cheeselite_hat010_set_brightness_to: 'HAT-010 明るさを %1%にする %2',
                    },
                    Helper: {},
                    Blocks: {
                        ROBOID_sensor_signal_strength: '信号の強さ',
                        ROBOID_sensor_signal_strength_dbm: '信号の強さ(dBm)',
                        ROBOID_sensor_acceleration_x: 'x軸の加速度',
                        ROBOID_sensor_acceleration_y: 'y軸の加速度',
                        ROBOID_sensor_acceleration_z: 'z軸の加速度',
                        ROBOID_sensor_input_sa: '入力Sa',
                        ROBOID_sensor_input_sb: '入力Sb',
                        ROBOID_sensor_input_sc: '入力Sc',
                        ROBOID_sensor_input_la: '入力La',
                        ROBOID_sensor_input_lb: '入力Lb',
                        ROBOID_sensor_input_lc: '入力Lc',
                        ROBOID_sensor_step_count: 'ステップ数',
                        ROBOID_monitor_output_sa: '出力Sa',
                        ROBOID_monitor_output_sb: '出力Sb',
                        ROBOID_monitor_output_sc: '出力Sc',
                        ROBOID_monitor_output_la: '出力La',
                        ROBOID_monitor_output_lb: '出力Lb',
                        ROBOID_monitor_output_lc: '出力Lc',
                        ROBOID_monitor_output_mab: '出力Mab',
                        ROBOID_monitor_output_mcd: '出力Mcd',
                        ROBOID_monitor_buzzer: 'ブザー',
                        ROBOID_monitor_note: '音符',
                        ROBOID_logo_sky_direction: 'ロゴが空の方向か',
                        ROBOID_logo_earth_direction: 'ロゴが地の方向か',
                        ROBOID_power_switch_sky_direction: '電源スイッチが空の方向か',
                        ROBOID_power_switch_earth_direction: '電源スイッチが地の方向か',
                        ROBOID_port_s_sky_direction: 'ポートSが空の方向か',
                        ROBOID_port_s_earth_direction: 'ポートSが地の方向か',
                        ROBOID_tap: '叩いたか',
                        ROBOID_free_fall: '落下したか',
                        ROBOID_battery_normal: '電池残量が充分か',
                        ROBOID_battery_low: '電池残量が足りないか',
                        ROBOID_battery_empty: '電池残量がなくなったか',
                        ROBOID_sound_beep: 'ビープ',
                        ROBOID_sound_random_beep: 'ランダムビープ',
                        ROBOID_sound_noise: 'ノイズ',
                        ROBOID_sound_siren: 'サイレン',
                        ROBOID_sound_engine: 'エンジン',
                        ROBOID_sound_chop: 'チョップ',
                        ROBOID_sound_robot: 'ロボット',
                        ROBOID_sound_dibidibidip: 'ディビディビディ',
                        ROBOID_sound_good_job: 'よくできました',
                        ROBOID_sound_happy: 'よろこび',
                        ROBOID_sound_angry: 'いかり',
                        ROBOID_sound_sad: 'かなしみ',
                        ROBOID_sound_sleep: 'ねむい',
                        ROBOID_sound_march: 'マーチ',
                        ROBOID_sound_birthday: 'たんじょうび',
                        ROBOID_note_c: 'ド',
                        ROBOID_note_c_sharp: 'ド♯(レ♭)',
                        ROBOID_note_d: 'レ',
                        ROBOID_note_d_sharp: 'レ♯(ミ♭)',
                        ROBOID_note_e: 'ミ',
                        ROBOID_note_f: 'ファ',
                        ROBOID_note_f_sharp: 'ファ♯(ソ♭)',
                        ROBOID_note_g: 'ソ',
                        ROBOID_note_g_sharp: 'ソ♯(ラ♭)',
                        ROBOID_note_a: 'ラ',
                        ROBOID_note_a_sharp: 'ラ♯(シ♭)',
                        ROBOID_note_b: 'シ',
                        ROBOID_speaker_internal: '内蔵スピーカー',
                        ROBOID_speaker_port_mab: 'ポートMab',
                        ROBOID_io_mode_makey: 'メイキー',
                        ROBOID_io_mode_button: 'ボタン',
                        ROBOID_io_mode_digital_pull_up: 'デジタル(プルアップ)',
                        ROBOID_io_mode_digital_pull_down: 'デジタル(プルダウン)',
                        ROBOID_io_mode_analog: 'アナログ',
                        ROBOID_io_mode_voltage: '電圧',
                        ROBOID_io_mode_pulse: 'パルス',
                        ROBOID_io_mode_pulse_pull_up: 'パルス(プルアップ)',
                        ROBOID_io_mode_pulse_pull_down: 'パルス(プルダウン)',
                        ROBOID_io_mode_normal: '基本',
                        ROBOID_io_mode_power: 'パワー',
                        ROBOID_io_port_high_current_mab: '大電流Ma(-)b',
                        ROBOID_io_port_high_current_mcd: '大電流Mc(-)d',
                        ROBOID_io_action_stop: '停止する',
                        ROBOID_io_action_turn_off: 'オフにする',
                        ROBOID_range_integer: 'なし',
                        ROBOID_range_real: 'あり',
                        ROBOID_led_intensity_dark: '暗い',
                        ROBOID_led_intensity_normal: '基本',
                        ROBOID_led_intensity_bright: '明るい',
                        ROBOID_led_type_default: '基本',
                        ROBOID_led_type_crgb: '-RGB',
                        ROBOID_led_type_crbg: '-RBG',
                        ROBOID_led_type_cgrb: '-GRB',
                        ROBOID_led_type_cgbr: '-GBR',
                        ROBOID_led_type_cbrg: '-BRG',
                        ROBOID_led_type_cbgr: '-BGR',
                        ROBOID_led_type_argb: '+RGB',
                        ROBOID_led_type_arbg: '+RBG',
                        ROBOID_led_type_agrb: '+GRB',
                        ROBOID_led_type_agbr: '+GBR',
                        ROBOID_led_type_abrg: '+BRG',
                        ROBOID_led_type_abgr: '+BGR',
                        ROBOID_color_red: '赤色',
                        ROBOID_color_orange: 'オレンジ色',
                        ROBOID_color_yellow: '黄色',
                        ROBOID_color_green: '緑色',
                        ROBOID_color_sky_blue: '水色',
                        ROBOID_color_blue: '青色',
                        ROBOID_color_violet: '青むらさき色',
                        ROBOID_color_purple: 'むらさき色',
                        ROBOID_color_white: '白色',
                        ROBOID_neopixel_3_colors: '3色',
                        ROBOID_neopixel_6_colors: '6色',
                        ROBOID_neopixel_12_colors: '12色',
                        ROBOID_neopixel_red_green: '赤色から緑色まで',
                        ROBOID_neopixel_red_blue: '赤色から青色まで',
                        ROBOID_neopixel_red_white: '赤色から白色まで',
                        ROBOID_neopixel_green_red: '緑色から赤色まで',
                        ROBOID_neopixel_green_blue: '緑色から青色まで',
                        ROBOID_neopixel_green_white: '緑色から白色まで',
                        ROBOID_neopixel_blue_red: '青色から赤色まで',
                        ROBOID_neopixel_blue_green: '青色から緑色まで',
                        ROBOID_neopixel_blue_white: '青色から白色まで',
                        ROBOID_neopixel_white_red: '白色から赤色まで',
                        ROBOID_neopixel_white_green: '白色から緑色まで',
                        ROBOID_neopixel_white_blue: '白色から青色まで',
                        ROBOID_neopixel_red_black: '赤色ますます暗く',
                        ROBOID_neopixel_green_black: '緑色ますます暗く',
                        ROBOID_neopixel_blue_black: '青色ますます暗く',
                        ROBOID_neopixel_white_black: '白色ますます暗く',
                        ROBOID_neopixel_black_red: '赤色ますます明るく',
                        ROBOID_neopixel_black_green: '緑色ますます明るく',
                        ROBOID_neopixel_black_blue: '青色ますます明るく',
                        ROBOID_neopixel_black_white: '白色ますます明るく',
                        ROBOID_serial_string: '文字列',
                        ROBOID_serial_string_line: '文字列1行',
                        ROBOID_serial_all: '全部',
                        ROBOID_serial_until_comma: '、(読点)まで',
                        ROBOID_serial_until_colon: '：(コロン)まで',
                        ROBOID_serial_until_dollar: '$まで',
                        ROBOID_serial_until_sharp: '#まで',
                        ROBOID_serial_until_new_line: '改行まで',
                        ROBOID_serial_port_wa_rb: 'La(書く)Lb(読む)',
                        ROBOID_serial_port_ra_wb: 'La(読む)Lb(書く)',
                        ROBOID_serial_port_wa: 'La(書く)',
                        ROBOID_serial_port_ra: 'La(読む)',
                        ROBOID_pid_10: 'PID-10 超音波センサー(HC-SR04+)',
                        ROBOID_pid_11_1: 'PID-11-1 温湿度センサー(DHT11)',
                        ROBOID_pid_11_2: 'PID-11-2 温湿度センサー(DHT21)',
                        ROBOID_pid_11_3: 'PID-11-3 温湿度センサー(DHT22)',
                        ROBOID_pid_12: 'PID-12 温度センサー(DS18B20)',
                        ROBOID_pid_13: 'PID-13 ジョイスティックとボタン',
                        ROBOID_pid_14: 'PID-14 デュアルジョイスティック',
                        ROBOID_pid_15: 'PID-15 IRトランシーバー',
                        ROBOID_pid_16: 'PID-16 エンコーダ',
                        ROBOID_pid_distance: '距離(cm)',
                        ROBOID_pid_temperature: '温度(℃)',
                        ROBOID_pid_humidity: '湿度(%RH)',
                        ROBOID_pid_x1: 'x1',
                        ROBOID_pid_y1: 'y1',
                        ROBOID_pid_x2: 'x2',
                        ROBOID_pid_y2: 'y2',
                        ROBOID_pid_button1: 'ボタン1',
                        ROBOID_pid_button2: 'ボタン2',
                        ROBOID_pid_encoder: 'エンコーダ',
                        ROBOID_clicked: 'クリックしたか',
                        ROBOID_double_clicked: 'ダブルクリックしたか',
                        ROBOID_long_pressed: '長く押したか',
                        ROBOID_shape_square: '四角形',
                        ROBOID_shape_triangle: '三角形',
                        ROBOID_shape_diamond: 'ダイヤモンド',
                        ROBOID_shape_circle: '円',
                        ROBOID_shape_x: 'X',
                        ROBOID_shape_like: 'すき',
                        ROBOID_shape_dislike: 'きらい',
                        ROBOID_shape_angry: 'いかり',
                        ROBOID_shape_open_mouth: '開けた口',
                        ROBOID_shape_close_mouth: '閉じた口',
                        ROBOID_shape_walk1: '歩く1',
                        ROBOID_shape_walk2: '歩く2',
                        ROBOID_shape_heart: 'ハート',
                        ROBOID_shape_star: '星',
                        ROBOID_shape_airplane: '飛行機',
                        ROBOID_shape_puppy: '子犬',
                        ROBOID_shape_butterfly: '蝶',
                        ROBOID_shape_quarter_note: '4分音符',
                        ROBOID_shape_eighth_note: '8分音符',
                        ROBOID_shape_left_arrow: '左矢印',
                        ROBOID_shape_right_arrow: '右矢印',
                        ROBOID_shape_up_arrow: '上矢印',
                        ROBOID_shape_down_arrow: '下矢印',
                        ROBOID_hat_background: '背景',
                        ROBOID_hat_all: '全部',
                        ROBOID_hat_clear: '消す',
                        ROBOID_hat_show: 'みせる',
                        ROBOID_hat_hide: 'かくす',
                        ROBOID_hat_clockwise: '時計',
                        ROBOID_hat_counterclockwise: '反時計',
                        ROBOID_hat_left_right: '左-右',
                        ROBOID_hat_up_down: '上-下',
                        ROBOID_hat_auto: '自動',
                        ROBOID_hat_manual: '手動',
                        ROBOID_hat_other_sprite: '他の図',
                        ROBOID_hat_left_wall: '左壁',
                        ROBOID_hat_right_wall: '右壁',
                        ROBOID_hat_top_wall: '上壁',
                        ROBOID_hat_bottom_wall: '下壁',
                        ROBOID_hat_any_wall: '全ての壁',
                    },
                },
                vn: {
                    template: {
                        cheeselite_value: '%1',
                        cheeselite_boolean: '%1?',
                        cheeselite_play_sound_times: 'play sound %1 %2 times %3',
                        cheeselite_play_sound_times_until_done:
                            'play sound %1 %2 times until done %3',
                        cheeselite_change_buzzer_by: 'change buzzer by %1 Hz %2',
                        cheeselite_set_buzzer_to: 'set buzzer to %1 Hz %2',
                        cheeselite_clear_sound: 'clear sound %1',
                        cheeselite_play_note: 'play note %1 %2 %3',
                        cheeselite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        cheeselite_rest_for: 'rest for %1 beats %2',
                        cheeselite_change_tempo_by: 'change tempo by %1 BPM %2',
                        cheeselite_set_tempo_to: 'set tempo to %1 BPM %2',
                        cheeselite_set_sound_port_to: 'set sound output to %1 %2',
                        cheeselite_set_input_mode_to: 'set port %1 to %2 input %3',
                        cheeselite_set_input_range_to:
                            'set input %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
                        cheeselite_set_three_input_ranges_to:
                            'set input %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
                        cheeselite_analog_input: 'input %1',
                        cheeselite_digital_input: 'input %1 %2 ?',
                        cheeselite_button_state: 'button %1 %2 ?',
                        cheeselite_set_pulse_mode_to: 'set port %1 to %2 input %3',
                        cheeselite_pulse_input: 'pulse detected on port %1 ?',
                        cheeselite_set_digital_output_to: 'set digital output %1 to %2 %3',
                        cheeselite_change_pwm_output_by: 'change pwm output %1 by %2% %3',
                        cheeselite_set_pwm_output_to: 'set pwm output %1 to %2% %3',
                        cheeselite_change_servo_motor_angle_by:
                            'change servo motor %1 by %2 degrees %3',
                        cheeselite_set_servo_motor_angle_to: 'set servo motor %1 to %2 degrees %3',
                        cheeselite_turn_off_servo_motor: 'turn off servo motor %1 %2',
                        cheeselite_change_dc_motor_velocity_by:
                            'change dc motor %1 velocity by %2% %3',
                        cheeselite_set_dc_motor_velocity_to: 'set dc motor %1 velocity to %2% %3',
                        cheeselite_stop_dc_motor: 'stop dc motor %1 %2',
                        cheeselite_rotate_step_motor:
                            'rotate step motor %1 steps with velocity %2 step/sec %3',
                        cheeselite_change_step_motor_velocity_by:
                            'change step motor velocity by %1 step/sec %2',
                        cheeselite_set_step_motor_velocity_to:
                            'set step motor velocity to %1 step/sec %2',
                        cheeselite_stop_off_step_motor: '%1 step motor %2',
                        cheeselite_set_step_motor_mode_to: 'set step motor to %1 mode %2',
                        cheeselite_step_count: 'step count',
                        cheeselite_set_led_to_color: 'set rgb led %1 to %2 %3 %4',
                        cheeselite_pick_led_to: 'set rgb led %1 to %2 %3',
                        cheeselite_change_led_by_rgb: 'change rgb led %1 by r: %2 g: %3 b: %4 %5',
                        cheeselite_setLed_to_rgb: 'set rgb led %1 to r: %2 g: %3 b: %4 %5',
                        cheeselite_clear_led: 'clear rgb led %1 %2',
                        cheeselite_set_led_type_to: 'set rgb led %1 to %2 type %3',
                        cheeselite_neopixel_set_number_and_type_to:
                            'neopixel: set %1 leds as %2 %3',
                        cheeselite_neopixel_set_all_leds_to_color:
                            'neopixel: set all leds to %1 %2',
                        cheeselite_neopixel_pick_all_leds_to: 'neopixel: set all leds to %1 %2',
                        cheeselite_neopixel_change_all_leds_by_rgb:
                            'neopixel: change all leds by r: %1 g: %2 b: %3 %4',
                        cheeselite_neopixel_set_all_leds_to_rgb:
                            'neopixel: set all leds to r: %1 g: %2 b: %3 %4',
                        cheeselite_neopixel_set_all_leds_to_pattern:
                            'neopixel: set all leds to pattern %1 %2',
                        cheeselite_neopixel_clear_all_leds: 'neopixel: clear all leds %1',
                        cheeselite_neopixel_set_led_to_color: 'neopixel: set led %1 to %2 %3',
                        cheeselite_neopixel_pick_led_to: 'neopixel: set led %1 to %2 %3',
                        cheeselite_neopixel_change_led_by_rgb:
                            'neopixel: change led %1 by r: %2 g: %3 b: %4 %5',
                        cheeselite_neopixel_set_led_to_rgb:
                            'neopixel: set led %1 to r: %2 g: %3 b: %4 %5',
                        cheeselite_neopixel_clear_led: 'neopixel: clear led %1 %2',
                        cheeselite_neopixel_set_led_range_to_color:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
                        cheeselite_neopixel_pick_led_range_to:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to %4 %5',
                        cheeselite_neopixel_change_led_range_by_rgb:
                            'neopixel: change leds (from %1 to %2 with %3 increments) by r: %4 g: %5 b: %6 %7',
                        cheeselite_neopixel_set_led_range_to_rgb:
                            'neopixel: set leds (from %1 to %2 with %3 increments) to r: %4 g: %5 b: %6 %7',
                        cheeselite_neopixel_set_led_range_to_pattern:
                            'neopixel: set leds (from %1 to %2) to pattern %3 %4',
                        cheeselite_neopixel_clear_led_range:
                            'neopixel: clear leds (from %1 to %2 with %3 increments) %4',
                        cheeselite_neopixel_shift: 'neopixel: shift %1 pixels %2',
                        cheeselite_neopixel_rotate: 'neopixel: rotate %1 pixels %2',
                        cheeselite_neopixel_change_brightness_by:
                            'neopixel: change brightness by %1% %2',
                        cheeselite_neopixel_set_brightness_to: 'neopixel: set brightness to %1% %2',
                        cheeselite_write_serial: 'write %1 %2 to serial %3',
                        cheeselite_read_serial_until: 'read serial %1 %2',
                        cheeselite_set_serial_port_to: 'set serial port to %1 %2',
                        cheeselite_set_serial_rate_to: 'set serial rate to %1Bd %2',
                        cheeselite_serial_input: 'serial input',
                        cheeselite_pid_start: 'start %1 %2',
                        cheeselite_pid_set_range_to:
                            'PID: set %1 range %2 - %3 to %4 - %5 %6 decimal point %7',
                        cheeselite_pid_set_three_ranges_to:
                            'PID: set %1 range %2 - %3 - %4 to %5 - %6 - %7 %8 decimal point %9',
                        cheeselite_pid_reset_encoder: 'PID: clear encoder %1',
                        cheeselite_pid_input: 'PID: %1',
                        cheeselite_pid_button_state: 'PID: button %1 %2?',
                        cheeselite_hat010_start: 'start HAT-010 5x5 matrix %1',
                        cheeselite_hat010_button: 'HAT-010: button %1',
                        cheeselite_hat010_button_state: 'HAT-010: button %1 %2?',
                        cheeselite_hat010_background_turn_on_xy:
                            'HAT-010 background: turn on x: %1 y: %2 in %3 %4',
                        cheeselite_hat010_background_turn_off_xy:
                            'HAT-010 background: turn off x: %1 y: %2 %3',
                        cheeselite_hat010_background_draw_shape_at_xy:
                            'HAT-010 background: draw %1 %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_background_draw_string_at_xy:
                            'HAT-010 background: draw %1 string %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_background_draw_pattern_at_xy:
                            'HAT-010 background: draw %1 pattern %2 at x: %3 y: %4 %5',
                        cheeselite_hat010_clear: 'HAT-010: clear %1 %2',
                        cheeselite_hat010_scroll_by_xy: 'HAT-010: scroll %1 by x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_set_to_shape:
                            'HAT-010 sprite %1: set sprite to %2 %3 %4',
                        cheeselite_hat010_sprite_set_to_string:
                            'HAT-010 sprite %1: set sprite to %2 string %3 %4',
                        cheeselite_hat010_sprite_set_to_pattern:
                            'HAT-010 sprite %1: set sprite to %2 pattern %3 %4',
                        cheeselite_hat010_sprite_clear_show_hide: 'HAT-010 sprite %1: %2 sprite %3',
                        cheeselite_hat010_sprite_change_positions_by_xy:
                            'HAT-010 sprite %1: change position by x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_set_positions_to_xy:
                            'HAT-010 sprite %1: set position to x: %2 y: %3 %4',
                        cheeselite_hat010_sprite_change_position_by_value:
                            'HAT-010 sprite %1: change %2 position by %3 %4',
                        cheeselite_hat010_sprite_set_position_to_value:
                            'HAT-010 sprite %1: set %2 position to %3 %4',
                        cheeselite_hat010_sprite_rotate: 'HAT-010 sprite %1: rotate %2 %3',
                        cheeselite_hat010_sprite_flip_in_direction:
                            'HAT-010 sprite %1: flip in %2 direction %3',
                        cheeselite_hat010_sprite_stamp_to_background:
                            'HAT-010 sprite %1: stamp to background %2',
                        cheeselite_hat010_sprite_position: 'HAT-010 sprite %1: %2 position',
                        cheeselite_hat010_sprite_touching_sprite:
                            'HAT-010 sprite %1: touching sprite %2?',
                        cheeselite_hat010_sprite_touching: 'HAT-010 sprite %1: touching %2?',
                        cheeselite_hat010_change_brightness_by:
                            'HAT-010: change brightness by %1% %2',
                        cheeselite_hat010_set_brightness_to: 'HAT-010: set brightness to %1% %2',
                    },
                    Helper: {},
                    Blocks: {
                        ROBOID_sensor_signal_strength: 'signal strength',
                        ROBOID_sensor_signal_strength_dbm: 'signal strength (dBm)',
                        ROBOID_sensor_acceleration_x: 'x acceleration',
                        ROBOID_sensor_acceleration_y: 'y acceleration',
                        ROBOID_sensor_acceleration_z: 'z acceleration',
                        ROBOID_sensor_input_sa: 'input Sa',
                        ROBOID_sensor_input_sb: 'input Sb',
                        ROBOID_sensor_input_sc: 'input Sc',
                        ROBOID_sensor_input_la: 'input La',
                        ROBOID_sensor_input_lb: 'input Lb',
                        ROBOID_sensor_input_lc: 'input Lc',
                        ROBOID_sensor_step_count: 'step count',
                        ROBOID_monitor_output_sa: 'output Sa',
                        ROBOID_monitor_output_sb: 'output Sb',
                        ROBOID_monitor_output_sc: 'output Sc',
                        ROBOID_monitor_output_la: 'output La',
                        ROBOID_monitor_output_lb: 'output Lb',
                        ROBOID_monitor_output_lc: 'output Lc',
                        ROBOID_monitor_output_mab: 'output Mab',
                        ROBOID_monitor_output_mcd: 'output Mcd',
                        ROBOID_monitor_buzzer: 'buzzer',
                        ROBOID_monitor_note: 'note',
                        ROBOID_logo_sky_direction: 'logo in sky direction',
                        ROBOID_logo_earth_direction: 'logo in earth direction',
                        ROBOID_power_switch_sky_direction: 'power switch in sky direction',
                        ROBOID_power_switch_earth_direction: 'power switch in earth direction',
                        ROBOID_port_s_sky_direction: 'port S in sky direction',
                        ROBOID_port_s_earth_direction: 'port S in earth direction',
                        ROBOID_tap: 'tap',
                        ROBOID_free_fall: 'free fall',
                        ROBOID_battery_normal: 'battery normal',
                        ROBOID_battery_low: 'battery low',
                        ROBOID_battery_empty: 'battery empty',
                        ROBOID_sound_beep: 'beep',
                        ROBOID_sound_random_beep: 'random beep',
                        ROBOID_sound_noise: 'noise',
                        ROBOID_sound_siren: 'siren',
                        ROBOID_sound_engine: 'engine',
                        ROBOID_sound_chop: 'chop',
                        ROBOID_sound_robot: 'robot',
                        ROBOID_sound_dibidibidip: 'dibidibidip',
                        ROBOID_sound_good_job: 'good job',
                        ROBOID_sound_happy: 'happy',
                        ROBOID_sound_angry: 'angry',
                        ROBOID_sound_sad: 'sad',
                        ROBOID_sound_sleep: 'sleep',
                        ROBOID_sound_march: 'march',
                        ROBOID_sound_birthday: 'birthday',
                        ROBOID_note_c: 'C',
                        ROBOID_note_c_sharp: 'C♯(D♭)',
                        ROBOID_note_d: 'D',
                        ROBOID_note_d_sharp: 'D♯(E♭)',
                        ROBOID_note_e: 'E',
                        ROBOID_note_f: 'F',
                        ROBOID_note_f_sharp: 'F♯(G♭)',
                        ROBOID_note_g: 'G',
                        ROBOID_note_g_sharp: 'G♯(A♭)',
                        ROBOID_note_a: 'A',
                        ROBOID_note_a_sharp: 'A♯(B♭)',
                        ROBOID_note_b: 'B',
                        ROBOID_speaker_internal: 'internal speaker',
                        ROBOID_speaker_port_mab: 'port Mab',
                        ROBOID_io_mode_makey: 'makey',
                        ROBOID_io_mode_button: 'button',
                        ROBOID_io_mode_digital_pull_up: 'digital (pull up)',
                        ROBOID_io_mode_digital_pull_down: 'digital (pull down)',
                        ROBOID_io_mode_analog: 'analog',
                        ROBOID_io_mode_voltage: 'voltage',
                        ROBOID_io_mode_pulse: 'pulse',
                        ROBOID_io_mode_pulse_pull_up: 'pulse (pull up)',
                        ROBOID_io_mode_pulse_pull_down: 'pulse (pull down)',
                        ROBOID_io_mode_normal: 'normal',
                        ROBOID_io_mode_power: 'power',
                        ROBOID_io_port_high_current_mab: 'high current Ma(-)b',
                        ROBOID_io_port_high_current_mcd: 'high current Mc(-)d',
                        ROBOID_io_action_stop: 'stop',
                        ROBOID_io_action_turn_off: 'turn off',
                        ROBOID_range_integer: 'without',
                        ROBOID_range_real: 'with',
                        ROBOID_led_intensity_dark: 'dark',
                        ROBOID_led_intensity_normal: 'normal',
                        ROBOID_led_intensity_bright: 'bright',
                        ROBOID_led_type_default: 'default',
                        ROBOID_led_type_crgb: '-rgb',
                        ROBOID_led_type_crbg: '-rbg',
                        ROBOID_led_type_cgrb: '-grb',
                        ROBOID_led_type_cgbr: '-gbr',
                        ROBOID_led_type_cbrg: '-brg',
                        ROBOID_led_type_cbgr: '-bgr',
                        ROBOID_led_type_argb: '+rgb',
                        ROBOID_led_type_arbg: '+rbg',
                        ROBOID_led_type_agrb: '+grb',
                        ROBOID_led_type_agbr: '+gbr',
                        ROBOID_led_type_abrg: '+brg',
                        ROBOID_led_type_abgr: '+bgr',
                        ROBOID_color_red: 'red',
                        ROBOID_color_orange: 'orange',
                        ROBOID_color_yellow: 'yellow',
                        ROBOID_color_green: 'green',
                        ROBOID_color_sky_blue: 'sky blue',
                        ROBOID_color_blue: 'blue',
                        ROBOID_color_violet: 'violet',
                        ROBOID_color_purple: 'purple',
                        ROBOID_color_white: 'white',
                        ROBOID_neopixel_3_colors: '3 colors',
                        ROBOID_neopixel_6_colors: '6 colors',
                        ROBOID_neopixel_12_colors: '12 colors',
                        ROBOID_neopixel_red_green: 'red to green',
                        ROBOID_neopixel_red_blue: 'red to blue',
                        ROBOID_neopixel_red_white: 'red to white',
                        ROBOID_neopixel_green_red: 'green to red',
                        ROBOID_neopixel_green_blue: 'green to blue',
                        ROBOID_neopixel_green_white: 'green to white',
                        ROBOID_neopixel_blue_red: 'blue to red',
                        ROBOID_neopixel_blue_green: 'blue to green',
                        ROBOID_neopixel_blue_white: 'blue to white',
                        ROBOID_neopixel_white_red: 'white to red',
                        ROBOID_neopixel_white_green: 'white to green',
                        ROBOID_neopixel_white_blue: 'white to blue',
                        ROBOID_neopixel_red_black: 'red getting darker',
                        ROBOID_neopixel_green_black: 'green getting darker',
                        ROBOID_neopixel_blue_black: 'blue getting darker',
                        ROBOID_neopixel_white_black: 'white getting darker',
                        ROBOID_neopixel_black_red: 'red getting brighter',
                        ROBOID_neopixel_black_green: 'green getting brighter',
                        ROBOID_neopixel_black_blue: 'blue getting brighter',
                        ROBOID_neopixel_black_white: 'white getting brighter',
                        ROBOID_serial_string: 'string',
                        ROBOID_serial_string_line: 'string line',
                        ROBOID_serial_all: 'all',
                        ROBOID_serial_until_comma: 'until ,(comma)',
                        ROBOID_serial_until_colon: 'until :(colon)',
                        ROBOID_serial_until_dollar: 'until $',
                        ROBOID_serial_until_sharp: 'until #',
                        ROBOID_serial_until_new_line: 'until new line',
                        ROBOID_serial_port_wa_rb: 'La(write) Lb(read)',
                        ROBOID_serial_port_ra_wb: 'La(read) Lb(write)',
                        ROBOID_serial_port_wa: 'La(write)',
                        ROBOID_serial_port_ra: 'La(read)',
                        ROBOID_pid_10: 'PID-10 ultrasonic sensor (HC-SR04+)',
                        ROBOID_pid_11_1: 'PID-11-1 humidity/temperature sensor (DHT11)',
                        ROBOID_pid_11_2: 'PID-11-2 humidity/temperature sensor (DHT21)',
                        ROBOID_pid_11_3: 'PID-11-3 humidity/temperature sensor (DHT22)',
                        ROBOID_pid_12: 'PID-12 temperature sensor (DS18B20)',
                        ROBOID_pid_13: 'PID-13 joystick and button',
                        ROBOID_pid_14: 'PID-14 dual joystick',
                        ROBOID_pid_15: 'PID-15 IR transceiver',
                        ROBOID_pid_16: 'PID-16 encoder',
                        ROBOID_pid_distance: 'distance (cm)',
                        ROBOID_pid_temperature: 'temperature (℃)',
                        ROBOID_pid_humidity: 'humidity (%RH)',
                        ROBOID_pid_x1: 'x1',
                        ROBOID_pid_y1: 'y1',
                        ROBOID_pid_x2: 'x2',
                        ROBOID_pid_y2: 'y2',
                        ROBOID_pid_button1: 'button1',
                        ROBOID_pid_button2: 'button2',
                        ROBOID_pid_encoder: 'encoder',
                        ROBOID_clicked: 'clicked',
                        ROBOID_double_clicked: 'double-clicked',
                        ROBOID_long_pressed: 'long-pressed',
                        ROBOID_shape_square: 'square',
                        ROBOID_shape_triangle: 'triangle',
                        ROBOID_shape_diamond: 'diamond',
                        ROBOID_shape_circle: 'circle',
                        ROBOID_shape_x: 'X',
                        ROBOID_shape_like: 'like',
                        ROBOID_shape_dislike: 'dislike',
                        ROBOID_shape_angry: 'angry',
                        ROBOID_shape_open_mouth: 'open mouth',
                        ROBOID_shape_close_mouth: 'close mouth',
                        ROBOID_shape_walk1: 'walk 1',
                        ROBOID_shape_walk2: 'walk 2',
                        ROBOID_shape_heart: 'heart',
                        ROBOID_shape_star: 'star',
                        ROBOID_shape_airplane: 'airplane',
                        ROBOID_shape_puppy: 'puppy',
                        ROBOID_shape_butterfly: 'butterfly',
                        ROBOID_shape_quarter_note: 'quarter note',
                        ROBOID_shape_eighth_note: 'eighth note',
                        ROBOID_shape_left_arrow: 'left arrow',
                        ROBOID_shape_right_arrow: 'right arrow',
                        ROBOID_shape_up_arrow: 'up arrow',
                        ROBOID_shape_down_arrow: 'down arrow',
                        ROBOID_hat_background: 'background',
                        ROBOID_hat_all: 'all',
                        ROBOID_hat_clear: 'clear',
                        ROBOID_hat_show: 'show',
                        ROBOID_hat_hide: 'hide',
                        ROBOID_hat_clockwise: 'clockwise',
                        ROBOID_hat_counterclockwise: 'counterclockwise',
                        ROBOID_hat_left_right: 'left-right',
                        ROBOID_hat_up_down: 'up-down',
                        ROBOID_hat_auto: 'auto',
                        ROBOID_hat_manual: 'manual',
                        ROBOID_hat_other_sprite: 'other sprite',
                        ROBOID_hat_left_wall: 'left wall',
                        ROBOID_hat_right_wall: 'right wall',
                        ROBOID_hat_top_wall: 'top wall',
                        ROBOID_hat_bottom_wall: 'bottom wall',
                        ROBOID_hat_any_wall: 'any wall',
                    },
                },
            };
        }

        // 블록 메서드 위임(CheeseRobot 으로 넘긴다) + lite 에서 다시 쓴 3종
        getValue(script) {
            return this.robot.getValue(script);
        }
        checkBoolean(script) {
            return this.robot.checkBoolean(script);
        }
        playSound(script) {
            return this.robot.playSound(script);
        }
        playSoundUntil(script) {
            return this.robot.playSoundUntil(script);
        }
        changeBuzzer(script) {
            return this.robot.changeBuzzer(script);
        }
        setBuzzer(script) {
            return this.robot.setBuzzer(script);
        }
        clearSound(script) {
            return this.robot.clearSound(script);
        }
        playNote(script) {
            return this.robot.playNote(script);
        }
        changeTempo(script) {
            return this.robot.changeTempo(script);
        }
        setTempo(script) {
            return this.robot.setTempo(script);
        }
        setSoundPort(script) {
            return this.robot.setSoundPort(script);
        }
        setInputModeTo(script) {
            return this.robot.setInputModeTo(script);
        }
        setInputRangeTo(script) {
            return this.robot.setInputRangeTo(script);
        }
        setThreeInputRangesTo(script) {
            return this.robot.setThreeInputRangesTo(script);
        }
        getAnalogInput(script) {
            return this.robot.getAnalogInput(script);
        }
        checkDigitalInput(script) {
            return this.robot.checkDigitalInput(script);
        }
        checkButtonState(script) {
            return this.robot.checkButtonState(script);
        }
        checkPulseInput(script) {
            return this.robot.checkPulseInput(script);
        }
        setDigitalOutput(script) {
            return this.robot.setDigitalOutput(script);
        }
        changePwmOutput(script) {
            return this.robot.changePwmOutput(script);
        }
        setPwmOutput(script) {
            return this.robot.setPwmOutput(script);
        }
        changeServoMotorAngle(script) {
            return this.robot.changeServoMotorAngle(script);
        }
        setServoMotorAngle(script) {
            return this.robot.setServoMotorAngle(script);
        }
        turnOffServoMotor(script) {
            return this.robot.turnOffServoMotor(script);
        }
        changeDcMotorVelocity(script) {
            return this.robot.changeDcMotorVelocity(script);
        }
        setDcMotorVelocity(script) {
            return this.robot.setDcMotorVelocity(script);
        }
        stopDcMotor(script) {
            return this.robot.stopDcMotor(script);
        }
        changeStepMotorVelocity(script) {
            return this.robot.changeStepMotorVelocity(script);
        }
        setStepMotorVelocity(script) {
            return this.robot.setStepMotorVelocity(script);
        }
        stopOffStepMotor(script) {
            return this.robot.stopOffStepMotor(script);
        }
        setStepMotorMode(script) {
            return this.robot.setStepMotorMode(script);
        }
        getStepCount(script) {
            return this.robot.getStepCount(script);
        }
        setLedColor(script) {
            return this.robot.setLedColor(script);
        }
        setLedRgbArray(script) {
            return this.robot.setLedRgbArray(script);
        }
        changeLedRgb(script) {
            return this.robot.changeLedRgb(script);
        }
        setLedRgb(script) {
            return this.robot.setLedRgb(script);
        }
        clearLed(script) {
            return this.robot.clearLed(script);
        }
        setLedType(script) {
            return this.robot.setLedType(script);
        }
        neopixelSetNumberAndType(script) {
            return this.robot.neopixelSetNumberAndType(script);
        }
        neopixelSetAllPattern(script) {
            return this.robot.neopixelSetAllPattern(script);
        }
        neopixelSetAllColor(script) {
            return this.robot.neopixelSetAllColor(script);
        }
        neopixelSetAllRgbArray(script) {
            return this.robot.neopixelSetAllRgbArray(script);
        }
        neopixelChangeAllRgb(script) {
            return this.robot.neopixelChangeAllRgb(script);
        }
        neopixelSetAllRgb(script) {
            return this.robot.neopixelSetAllRgb(script);
        }
        neopixelClearAll(script) {
            return this.robot.neopixelClearAll(script);
        }
        neopixelSetLedColor(script) {
            return this.robot.neopixelSetLedColor(script);
        }
        neopixelSetLedRgbArray(script) {
            return this.robot.neopixelSetLedRgbArray(script);
        }
        neopixelChangeLedRgb(script) {
            return this.robot.neopixelChangeLedRgb(script);
        }
        neopixelSetLedRgb(script) {
            return this.robot.neopixelSetLedRgb(script);
        }
        neopixelClearLed(script) {
            return this.robot.neopixelClearLed(script);
        }
        neopixelSetRangePattern(script) {
            return this.robot.neopixelSetRangePattern(script);
        }
        neopixelSetRangeColor(script) {
            return this.robot.neopixelSetRangeColor(script);
        }
        neopixelSetRangeRgbArray(script) {
            return this.robot.neopixelSetRangeRgbArray(script);
        }
        neopixelChangeRangeRgb(script) {
            return this.robot.neopixelChangeRangeRgb(script);
        }
        neopixelSetRangeRgb(script) {
            return this.robot.neopixelSetRangeRgb(script);
        }
        neopixelClearRange(script) {
            return this.robot.neopixelClearRange(script);
        }
        neopixelShift(script) {
            return this.robot.neopixelShift(script);
        }
        neopixelRotate(script) {
            return this.robot.neopixelRotate(script);
        }
        neopixelChangeBrightness(script) {
            return this.robot.neopixelChangeBrightness(script);
        }
        neopixelSetBrightness(script) {
            return this.robot.neopixelSetBrightness(script);
        }
        writeSerial(script) {
            return this.robot.writeSerial(script);
        }
        readSerialUntil(script) {
            return this.robot.readSerialUntil(script);
        }
        setSerialPort(script) {
            return this.robot.setSerialPort(script);
        }
        setSerialRate(script) {
            return this.robot.setSerialRate(script);
        }
        getSerialInput(script) {
            return this.robot.getSerialInput(script);
        }
        pidStart(script) {
            return this.robot.pidStart(script);
        }
        pidSetRangeTo(script) {
            return this.robot.pidSetRangeTo(script);
        }
        pidSetThreeRangesTo(script) {
            return this.robot.pidSetThreeRangesTo(script);
        }
        pidResetEncoder(script) {
            return this.robot.pidResetEncoder(script);
        }
        pidGetInput(script) {
            return this.robot.pidGetInput(script);
        }
        pidCheckButtonState(script) {
            return this.robot.pidCheckButtonState(script);
        }
        hat010Start(script) {
            return this.robot.hat010Start(script);
        }
        hat010GetButton(script) {
            return this.robot.hat010GetButton(script);
        }
        hat010CheckButtonState(script) {
            return this.robot.hat010CheckButtonState(script);
        }
        hat010BackgroundTurnOnXY(script) {
            return this.robot.hat010BackgroundTurnOnXY(script);
        }
        hat010BackgroundTurnOffXY(script) {
            return this.robot.hat010BackgroundTurnOffXY(script);
        }
        hat010BackgroundDrawShapeAtXY(script) {
            return this.robot.hat010BackgroundDrawShapeAtXY(script);
        }
        hat010BackgroundDrawStringAtXY(script) {
            return this.robot.hat010BackgroundDrawStringAtXY(script);
        }
        hat010BackgroundDrawPatternAtXY(script) {
            return this.robot.hat010BackgroundDrawPatternAtXY(script);
        }
        hat010Clear(script) {
            return this.robot.hat010Clear(script);
        }
        hat010ScrollByXY(script) {
            return this.robot.hat010ScrollByXY(script);
        }
        hat010SpriteSetToShape(script) {
            return this.robot.hat010SpriteSetToShape(script);
        }
        hat010SpriteSetToString(script) {
            return this.robot.hat010SpriteSetToString(script);
        }
        hat010SpriteSetToPattern(script) {
            return this.robot.hat010SpriteSetToPattern(script);
        }
        hat010SpriteClearShowHide(script) {
            return this.robot.hat010SpriteClearShowHide(script);
        }
        hat010SpriteChangePositionsByXY(script) {
            return this.robot.hat010SpriteChangePositionsByXY(script);
        }
        hat010SpriteSetPositionsToXY(script) {
            return this.robot.hat010SpriteSetPositionsToXY(script);
        }
        hat010SpriteChangePositionByValue(script) {
            return this.robot.hat010SpriteChangePositionByValue(script);
        }
        hat010SpriteSetPositionToValue(script) {
            return this.robot.hat010SpriteSetPositionToValue(script);
        }
        hat010SpriteRotate(script) {
            return this.robot.hat010SpriteRotate(script);
        }
        hat010SpriteFlipInDirection(script) {
            return this.robot.hat010SpriteFlipInDirection(script);
        }
        hat010SpriteStampToBackground(script) {
            return this.robot.hat010SpriteStampToBackground(script);
        }
        hat010GetSpritePosition(script) {
            return this.robot.hat010GetSpritePosition(script);
        }
        hat010CheckCheckSpriteSpriteTouched(script) {
            return this.robot.hat010CheckCheckSpriteSpriteTouched(script);
        }
        hat010CheckCheckSpriteTouched(script) {
            return this.robot.hat010CheckCheckSpriteTouched(script);
        }
        hat010ChangeBrightnessBy(script) {
            return this.robot.hat010ChangeBrightnessBy(script);
        }
        hat010SetBrightnessTo(script) {
            return this.robot.hat010SetBrightnessTo(script);
        }
        rotateStepMotor(script) {
            // CheeseRobot.rotateStepMotor 원문(this -> this.robot) + 펄스 0 즉시 해소
            this.robot.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.robot.__cancelStep();
                this.robot.__setModeMab(this.robot.stepMode);

                let step = script.getNumberValue('STEP');
                let velocity = script.getNumberValue('VELOCITY');

                step = parseInt(step);
                velocity = parseFloat(velocity);

                if (typeof step == 'number' && typeof velocity == 'number') {
                    if (velocity < -500) velocity = -500;
                    else if (velocity > 500) velocity = 500;
                    this.robot.motoring.velocity = velocity;
                    this.robot.__setStep(step);
                    this.robot.stepCallback = function () {
                        script.isMoving = false;
                    };
                } else {
                    this.robot.motoring.velocity = 0;
                    this.robot.__setStep(0);
                    script.isMoving = false;
                }
                // 펄스 0(빈 칸, 문자, 음수 포함)은 완료 신호가 오지 않으므로 바로 끝낸다.
                // 보내는 바이트는 하드웨어 연결 프로그램과 같다.
                if (this.__rd(this.motoring.step) <= 0) {
                    this.robot.stepCallback = undefined;
                    script.isMoving = false;
                }
                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }
        playNoteBeat(script) {
            // CheeseRobot.playNoteBeat 원문(self -> this.robot). 타이머는 __addTimeout(상한 클램프),
            // 취소 시 해소는 __noteScript 로 한다
            this.robot.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.robot.__cancelNote();
                this.robot.__cancelSound();

                let note = script.getField('NOTE');
                let octave = script.getNumberField('OCTAVE');
                let beat = script.getNumberValue('BEAT');

                note = parseInt(this.robot.__NOTES[note]);
                octave = parseInt(octave);
                beat = parseFloat(beat);
                this.robot.motoring.buzzer = 0;
                if (
                    note &&
                    octave &&
                    octave > 0 &&
                    octave < 8 &&
                    beat &&
                    beat > 0 &&
                    this.robot.tempo > 0
                ) {
                    const id = this.robot.__issueNoteBlockId();
                    this.__noteScript = script; // 기다리는 박자 블록. __cancelNote(취소)가 이 script 를 끝낸다
                    note += (octave - 1) * 12;
                    this.robot.__setNote(note);
                    const timeValue = (beat * 60 * 1000) / this.robot.tempo;
                    if (timeValue > 100) {
                        this.robot.noteTimer1 = this.__addTimeout(() => {
                            if (this.robot.noteBlockId == id) {
                                this.robot.__setNote(0);
                                if (this.robot.noteTimer1 !== undefined) {
                                    this.__removeTimeout(this.robot.noteTimer1);
                                }
                                this.robot.noteTimer1 = undefined;
                            }
                        }, timeValue - 100);
                    }
                    this.robot.noteTimer2 = this.__addTimeout(() => {
                        if (this.robot.noteBlockId == id) {
                            this.robot.__setNote(0);
                            this.robot.__cancelNote();
                            script.isPlaying = false;
                            if (this.__noteScript === script) this.__noteScript = null;
                        }
                    }, timeValue);
                    this.robot.__runSound(0);
                } else {
                    this.robot.__setNote(0);
                    this.robot.__runSound(0);
                    script.isPlaying = false;
                    if (this.__noteScript === script) this.__noteScript = null;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                // 다른 블록이 이 블록을 취소해 끝낸 경우 __noteScript 는 이미 비었거나 다른 script 를 가리킨다.
                // 그때는 그 블록이 낸 음을 끄지 않는다. 정상 완료라면 타이머가 이미 음을 0 으로 두었다.
                if (this.__noteScript === script) {
                    this.__noteScript = null;
                    this.robot.__setNote(0);
                }
                return script.callReturn();
            }
        }
        restBeat(script) {
            // CheeseRobot.restBeat 원문(self -> this.robot). 타이머와 __noteScript 처리는 playNoteBeat 와 같다
            this.robot.__setModule();
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.robot.__cancelNote();
                this.robot.__cancelSound();
                let beat = script.getNumberValue('BEAT');

                beat = parseFloat(beat);
                this.robot.motoring.buzzer = 0;
                this.robot.__setNote(0);
                this.robot.__runSound(0);
                if (beat && beat > 0 && this.robot.tempo > 0) {
                    const id = this.robot.__issueNoteBlockId();
                    this.__noteScript = script;
                    const timeValue = (beat * 60 * 1000) / this.robot.tempo;
                    this.robot.noteTimer1 = this.__addTimeout(() => {
                        if (this.robot.noteBlockId == id) {
                            this.robot.__cancelNote();
                            script.isPlaying = false;
                            if (this.__noteScript === script) this.__noteScript = null;
                        }
                    }, timeValue);
                } else {
                    script.isPlaying = false;
                    if (this.__noteScript === script) this.__noteScript = null;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                if (this.__noteScript === script) this.__noteScript = null;
                return script.callReturn();
            }
        }
    }

    Entry.CheeseLite = new CheeseLite();
    module.exports = Entry.CheeseLite;
})();
