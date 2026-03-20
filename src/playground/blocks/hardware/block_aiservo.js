'use strict';

/***************************************************************************************
 * AI 로봇집게 플레이그라운드 블록 정의 (사양 업데이트)
 * - 수정 사항:
 * 1. 관절(좌우): 왼쪽(180), 가운데(90), 오른쪽(0)
 * 2. 관절(상하): 위(0), 가운데(90), 아래(180)
 * 3. 관절(집게): 열기(0), 가운데(90), 닫기(180)
 * 4. 관절(버켓): 담기(0), 가운데(90), 붓기(180) - 바스켓에서 버켓으로 명칭 변경
 ***************************************************************************************/

if (typeof global.Entry !== 'object') {
    global.Entry = {};
}

Entry.aiservo = {
    id: '41.3',
    name: 'aiservo',
    isNotFor: [],
    url: 'http://neo3ds.com',
    imageName: 'aiservo.png',
    title: { ko: 'AI로봇집게', en: 'AIROBOTARM' },
    poses: {},
    setZero: function() {
        if (!Entry.hw.sendQueue) Entry.hw.sendQueue = {};
        var resetValues = {
            MODE: 1,
            SERVO1: 90,
            SERVO2: 90,
            SERVO3: 90,
            PIXEL_IDX: 2,
            RED: 0,
            GREEN: 0,
            BLUE: 0,
            BUZZER: 0,
            BLUE_LED: 0,
        };
        Object.keys(resetValues).forEach(function(key) {
            Entry.hw.sendQueue[key] = resetValues[key];
        });
        Entry.hw.update();
    },
};

Entry.aiservo.setLanguage = function() {
    return {
        ko: {
            template: {
                aiservo_get_sensor_value: '%1 값',
                aiservo_get_cds_value: '밝기센서(CDS) %1 값',
                aiservo_set_servo: '%1 각도를 %2 도로 이동 %3',
                aiservo_set_servo_lr: '관절(좌우)를 %1 (으)로 이동 %2',
                aiservo_set_servo_ud: '관절(상하)를 %1 (으)로 이동 %2',
                aiservo_set_gripper: '집게를 %1 %2',
                aiservo_set_basket: '버켓을 %1 %2', // 바스켓 -> 버켓
                aiservo_save_pose: '현재 포즈를 %1 번에 저장하기 %2',
                aiservo_load_pose: '%1 번 포즈로 이동하기 %2',
                aiservo_set_led_color: '네오픽셀 %1 색상을 %2 (으)로 켜기 %3',
                aiservo_set_led_rgb: '네오픽셀 %1 색상을 R:%2 G:%3 B:%4 (으)로 켜기 %5',
                aiservo_set_led_off: '네오픽셀 전체 끄기 %1',
                aiservo_set_blue_led_onoff: '파란 LED(D6) %1 %2',
                aiservo_set_blue_led_pwm: '파란 LED(D6) 밝기를 %1 (으)로 설정 %2',
                aiservo_set_buzzer: '버저 %1 옥타브 %2 음을 %3 초 동안 연주 %4',
            },
            Blocks: {
                aiservo_pot1: '조종기(왼쪽)',
                aiservo_pot2: '조종기(가운데)',
                aiservo_pot3: '조종기(오른쪽)',
                aiservo_cds1: '1번',
                aiservo_cds2: '2번',
                aiservo_joint_1: '관절(상하)',
                aiservo_joint_2: '관절(좌우)',
                aiservo_joint_3: '관절(집게)',
                aiservo_joint_4: '관절(버켓)', // 바스켓 -> 버켓
                aiservo_left: '왼쪽',
                aiservo_right: '오른쪽',
                aiservo_up: '위',
                aiservo_down: '아래',
                aiservo_middle: '가운데',
                aiservo_open: '열기',
                aiservo_close: '닫기',
                aiservo_pour: '붓기',
                aiservo_release: '담기',
                aiservo_on: '켜기',
                aiservo_off: '끄기',
            },
        },
    };
};

Entry.aiservo.blockMenuBlocks = [
    'aiservo_get_sensor_value',
    'aiservo_get_cds_value',
    'aiservo_set_servo',
    'aiservo_set_servo_lr',
    'aiservo_set_servo_ud',
    'aiservo_set_gripper',
    'aiservo_set_basket',
    'aiservo_save_pose',
    'aiservo_load_pose',
    'aiservo_set_led_color',
    'aiservo_set_led_rgb',
    'aiservo_set_led_off',
    'aiservo_set_blue_led_onoff',
    'aiservo_set_blue_led_pwm',
    'aiservo_set_buzzer',
];

Entry.aiservo.getBlocks = function() {
    var hwrColor = '#15b59f';
    var hwrDarken = '#129a88';

    return {
        aiservo_get_sensor_value: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_pot1, 'POT1'],
                        [Lang.Blocks.aiservo_pot2, 'POT2'],
                        [Lang.Blocks.aiservo_pot3, 'POT3'],
                    ],
                    value: 'POT1',
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
            ],
            def: { params: [null], type: 'aiservo_get_sensor_value' },
            paramsKeyMap: { SIGNAL: 0 },
            class: 'aiservo_sensor',
            func: function(sprite, script) {
                return Entry.hw.portData[script.getField('SIGNAL', script)] || 0;
            },
        },
        aiservo_get_cds_value: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_cds1, 'CDS1'],
                        [Lang.Blocks.aiservo_cds2, 'CDS2'],
                    ],
                    value: 'CDS1',
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
            ],
            def: { params: [null], type: 'aiservo_get_cds_value' },
            paramsKeyMap: { SIGNAL: 0 },
            class: 'aiservo_sensor',
            func: function(sprite, script) {
                var val = Entry.hw.portData[script.getField('SIGNAL', script)] || 0;
                var result = (255 - val) * 4 - 400;
                return Math.min(1023, result);
            },
        },
        aiservo_set_servo: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_joint_1, 'SERVO1'],
                        [Lang.Blocks.aiservo_joint_2, 'SERVO2'],
                        [Lang.Blocks.aiservo_joint_3, 'SERVO3'],
                        [Lang.Blocks.aiservo_joint_4, 'SERVO3'],
                    ],
                    value: 'SERVO1',
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [null, { type: 'number', params: ['90'] }, null],
                type: 'aiservo_set_servo',
            },
            paramsKeyMap: { PORT: 0, VALUE: 1 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var val = Math.max(0, Math.min(180, script.getNumberValue('VALUE', script)));
                Entry.hw.sendQueue[port] = val;
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_servo_lr: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_left, 180], // 왼쪽: 180
                        [Lang.Blocks.aiservo_middle, 90],
                        [Lang.Blocks.aiservo_right, 0], // 오른쪽: 0
                    ],
                    value: 90,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, null], type: 'aiservo_set_servo_lr' },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['SERVO2'] = script.getField('VALUE', script);
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_servo_ud: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_up, 0], // 위: 0
                        [Lang.Blocks.aiservo_middle, 90],
                        [Lang.Blocks.aiservo_down, 180], // 아래: 180
                    ],
                    value: 90,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, null], type: 'aiservo_set_servo_ud' },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['SERVO1'] = script.getField('VALUE', script);
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_gripper: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_open, 0], // 열기: 0
                        [Lang.Blocks.aiservo_middle, 90],
                        [Lang.Blocks.aiservo_close, 180], // 닫기: 180
                    ],
                    value: 90,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, null], type: 'aiservo_set_gripper' },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['SERVO3'] = script.getField('VALUE', script);
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_basket: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_release, 0], // 담기: 0
                        [Lang.Blocks.aiservo_middle, 90],
                        [Lang.Blocks.aiservo_pour, 180], // 붓기: 180
                    ],
                    value: 90,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, null], type: 'aiservo_set_basket' },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['SERVO3'] = script.getField('VALUE', script);
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_save_pose: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [{ type: 'number', params: ['1'] }, null], type: 'aiservo_save_pose' },
            paramsKeyMap: { ID: 0 },
            func: function(sprite, script) {
                var id = script.getNumberValue('ID', script);
                Entry.aiservo.poses[id] = {
                    s1: Entry.hw.sendQueue['SERVO1'] || 90,
                    s2: Entry.hw.sendQueue['SERVO2'] || 90,
                    s3: Entry.hw.sendQueue['SERVO3'] || 90,
                };
                return script.callReturn();
            },
        },
        aiservo_load_pose: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [{ type: 'number', params: ['1'] }, null], type: 'aiservo_load_pose' },
            paramsKeyMap: { ID: 0 },
            func: function(sprite, script) {
                var id = script.getNumberValue('ID', script);
                var pose = Entry.aiservo.poses[id];
                if (pose) {
                    Entry.hw.sendQueue['SERVO1'] = pose.s1;
                    Entry.hw.sendQueue['SERVO2'] = pose.s2;
                    Entry.hw.sendQueue['SERVO3'] = pose.s3;
                    Entry.hw.sendQueue['MODE'] = 1;
                }
                return script.callReturn();
            },
        },
        aiservo_set_led_color: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', 0],
                        ['2번', 1],
                        ['모두', 2],
                    ],
                    value: 2,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Color' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, '#ff0000', null], type: 'aiservo_set_led_color' },
            paramsKeyMap: { INDEX: 0, COLOR: 1 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.startTime = Date.now();
                    var color = script.getField('COLOR', script);
                    Entry.hw.sendQueue['PIXEL_IDX'] = script.getField('INDEX', script);
                    if (color && color.length >= 7) {
                        Entry.hw.sendQueue['RED'] = parseInt(color.substr(1, 2), 16);
                        Entry.hw.sendQueue['GREEN'] = parseInt(color.substr(3, 2), 16);
                        Entry.hw.sendQueue['BLUE'] = parseInt(color.substr(5, 2), 16);
                    }
                    Entry.hw.sendQueue['MODE'] = 1;
                    return script;
                }
                if (Date.now() - script.startTime < 30) return script;
                delete script.isStart;
                return script.callReturn();
            },
        },
        aiservo_set_led_rgb: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', 0],
                        ['2번', 1],
                        ['모두', 2],
                    ],
                    value: 2,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [
                    null,
                    { type: 'number', params: ['255'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    null,
                ],
                type: 'aiservo_set_led_rgb',
            },
            paramsKeyMap: { INDEX: 0, R: 1, G: 2, B: 3 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.startTime = Date.now();
                    Entry.hw.sendQueue['PIXEL_IDX'] = script.getField('INDEX', script);
                    Entry.hw.sendQueue['RED'] = Math.max(
                        0,
                        Math.min(255, script.getNumberValue('R', script))
                    );
                    Entry.hw.sendQueue['GREEN'] = Math.max(
                        0,
                        Math.min(255, script.getNumberValue('G', script))
                    );
                    Entry.hw.sendQueue['BLUE'] = Math.max(
                        0,
                        Math.min(255, script.getNumberValue('B', script))
                    );
                    Entry.hw.sendQueue['MODE'] = 1;
                    return script;
                }
                if (Date.now() - script.startTime < 30) return script;
                delete script.isStart;
                return script.callReturn();
            },
        },
        aiservo_set_led_off: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            def: { params: [null], type: 'aiservo_set_led_off' },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['PIXEL_IDX'] = 2;
                Entry.hw.sendQueue['RED'] = 0;
                Entry.hw.sendQueue['GREEN'] = 0;
                Entry.hw.sendQueue['BLUE'] = 0;
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_blue_led_onoff: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.aiservo_on, 255],
                        [Lang.Blocks.aiservo_off, 0],
                    ],
                    value: 255,
                    fontSize: 11,
                    bgColor: hwrDarken,
                    arrowColor: hwrColor,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: { params: [null, null], type: 'aiservo_set_blue_led_onoff' },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['BLUE_LED'] = script.getField('VALUE', script);
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_blue_led_pwm: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [{ type: 'number', params: ['255'] }, null],
                type: 'aiservo_set_blue_led_pwm',
            },
            paramsKeyMap: { VALUE: 0 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                Entry.hw.sendQueue['BLUE_LED'] = Math.max(
                    0,
                    Math.min(255, script.getNumberValue('VALUE', script))
                );
                Entry.hw.sendQueue['MODE'] = 1;
                return script.callReturn();
            },
        },
        aiservo_set_buzzer: {
            color: hwrColor,
            outerLine: hwrDarken,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '4',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['도', '33'],
                        ['레', '37'],
                        ['미', '41'],
                        ['파', '44'],
                        ['솔', '49'],
                        ['라', '55'],
                        ['시', '62'],
                    ],
                    value: '33',
                },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [null, null, { type: 'number', params: ['0.1'] }, null],
                type: 'aiservo_set_buzzer',
            },
            paramsKeyMap: { OCTAVE: 0, NOTE: 1, DURATION: 2 },
            class: 'aiservo_control',
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.startTime = Date.now();
                    var note = Math.round(
                        Number(script.getField('NOTE', script)) *
                            Math.pow(2, Number(script.getField('OCTAVE', script)) - 4)
                    );
                    Entry.hw.sendQueue['BUZZER'] = note;
                    Entry.hw.sendQueue['MODE'] = 1;
                    Entry.hw.update();
                    return script;
                }
                if (
                    Date.now() - script.startTime <
                    script.getNumberValue('DURATION', script) * 1000
                )
                    return script;
                Entry.hw.sendQueue['BUZZER'] = 0;
                Entry.hw.update();
                delete script.isStart;
                return script.callReturn();
            },
        },
    };
};

module.exports = Entry.aiservo;
