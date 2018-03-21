'use strict';

Entry.joystick = {
    name: 'joystick',
    url: 'http://www.kocoafab.cc/',
    imageName: 'joystick.png',
    title: {
        "ko": "조이스틱 센서 쉴드",
        "en": "Joystick Sensor Shield"
    },
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
};

Entry.joystick.getBlocks = function() {
    return {
        //region joystick 조이스틱
        joystick_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['joystick'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'joystick_get_number_sensor_value',
            },
            class: 'arduino_value',
        },
        joystick_get_digital_value: {
            parent: 'arduino_get_digital_value',
            isNotFor: ['joystick'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'joystick_get_digital_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: [] },
        },
        joystick_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['joystick'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'joystick_toggle_led',
            },
            class: 'arduino_set',
        },
        joystick_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['joystick'],
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'joystick_toggle_pwm',
            },
            class: 'arduino_set',
        },
        joystick_convert_scale: {
            parent: 'arduino_convert_scale',
            isNotFor: ['joystick'],
            def: {
                params: [
                    {
                        type: 'arduino_get_number_sensor_value',
                        params: [
                            {
                                type: 'arduino_get_sensor_number',
                            },
                        ],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'joystick_convert_scale',
            },
            class: 'arduino',
        },
        //endregion joystick 조이스틱
    };
};
