const PromiseManager = require('@core/promiseManager');
const pm = new PromiseManager();

module.exports = {
    getBlocks() {
        return {
            sound_something_with_block: {
                color: '#A4D01D',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                        },
                        null,
                    ],
                    type: 'sound_something_with_block',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'sound_something_with_block',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'sound_play',
                isNotFor: [],
                func: async function(sprite, script) {
                    var soundId = await script.getStringValue('VALUE', script);
                    var sound = sprite.parent.getSound(soundId);

                    if (sound) {
                        Entry.Utils.addSoundInstances(createjs.Sound.play(sound.id));
                    }

                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: 'Entry.play_sound(%1)',
                        },
                    ],
                },
            },
            sound_something_second_with_block: {
                color: '#A4D01D',
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
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                            id: '95dw',
                        },
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'sound_something_second_with_block',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'sound_something_second_with_block',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    SECOND: 1,
                },
                class: 'sound_play',
                isNotFor: [],
                func: async function(sprite, script) {
                    const [soundId, timeValue] = await Promise.all([
                        script.getStringValue('VALUE', script),
                        script.getNumberValue('SECOND', script),
                    ]);
                    const sound = sprite.parent.getSound(soundId);

                    if (sound) {
                        Entry.Utils.addSoundInstances(
                            createjs.Sound.play(sound.id, {
                                startTime: 0,
                                duration: timeValue * 1000,
                            })
                        );
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: 'Entry.play_sound_for_sec(%1, %2)',
                        },
                    ],
                },
            },
            sound_from_to: {
                color: '#A4D01D',
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
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                        },
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'sound_from_to',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'sound_from_to',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    START: 1,
                    END: 2,
                },
                class: 'sound_play',
                isNotFor: [],
                func: async function(sprite, script) {
                    let [start, end, soundId] = await Promise.all([
                        script.getNumberValue('START', script),
                        script.getNumberValue('END', script),
                        script.getStringValue('VALUE', script),
                    ]);
                    start = start * 1000;
                    end = end * 1000;
                    var sound = sprite.parent.getSound(soundId);

                    if (sound) {
                        createjs.Sound.play(sound.id, {
                            startTime: Math.min(start, end),
                            duration: Math.max(start, end) - Math.min(start, end),
                        });
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: 'Entry.play_sound_from_to(%1, %2, %3)',
                        },
                    ],
                },
            },
            sound_something_wait_with_block: {
                color: '#A4D01D',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                        },
                        null,
                    ],
                    type: 'sound_something_wait_with_block',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'sound_something_wait_with_block',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'sound_wait',
                isNotFor: [],
                func: async function(sprite, script) {
                    const soundId = await script.getStringValue('VALUE', script);
                    const sound = sprite.parent.getSound(soundId);
                    if (sound) {
                        const instance = createjs.Sound.play(sound.id);
                        Entry.Utils.addSoundInstances(instance);
                        await pm.sleepWithPause(sound.duration * 1000, script.block.id);
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: 'Entry.play_sound_and_wait(%1)',
                        },
                    ],
                },
            },
            sound_something_second_wait_with_block: {
                color: '#A4D01D',
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
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                        },
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'sound_something_second_wait_with_block',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'sound_something_second_wait_with_block',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    SECOND: 1,
                },
                class: 'sound_wait',
                isNotFor: [],
                func: async function(sprite, script) {
                    const [soundId, timeValue] = await Promise.all([
                        script.getStringValue('VALUE', script),
                        script.getNumberValue('SECOND', script),
                    ]);
                    const sound = sprite.parent.getSound(soundId);
                    if (sound) {
                        const instance = createjs.Sound.play(sound.id);
                        console.log(timeValue * 1000);
                        await pm.sleepWithPause(timeValue * 1000, script.block.id);
                        instance.addEventListener('complete', function(e) {});
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: 'Entry.play_sound_for_sec_and_wait(%1, %2)',
                        },
                    ],
                },
            },
            sound_from_to_and_wait: {
                color: '#A4D01D',
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
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'get_sounds',
                        },
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'sound_from_to_and_wait',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'get_sounds',
                            params: ['A&value'],
                        },
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'sound_from_to_and_wait',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    START: 1,
                    END: 2,
                },
                class: 'sound_wait',
                isNotFor: [],
                func: async function(sprite, script) {
                    let [start, end, soundId] = await Promise.all([
                        script.getNumberValue('START', script),
                        script.getNumberValue('END', script),
                        script.getStringValue('VALUE', script),
                    ]);
                    start = start * 1000;
                    end = end * 1000;
                    const sound = sprite.parent.getSound(soundId);
                    if (sound) {
                        const startTime = Math.min(start, end);
                        const endTime = Math.max(start, end);
                        const duration = endTime - startTime;

                        createjs.Sound.play(sound.id, {
                            duration,
                            startTime,
                        });

                        await pm.sleepWithPause(duration, script.block.id);
                    }
                },
                syntax: {
                    js: [],
                    py: ['Entry.play_sound_from_to_and_wait(%1, %2, %3)'],
                },
            },
            sound_volume_change: {
                color: '#A4D01D',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'sound_volume_change',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'sound_volume_change',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'sound_volume',
                isNotFor: [],
                func: async function(sprite, script) {
                    let value = (await script.getNumberValue('VALUE', script)) / 100;
                    value = value + createjs.Sound.getVolume();
                    if (value > 1) value = 1;
                    if (value < 0) value = 0;
                    createjs.Sound.setVolume(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_sound_volume(%1)'] },
            },
            sound_volume_set: {
                color: '#A4D01D',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'sound_volume_set',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'sound_volume_set',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'sound_volume',
                isNotFor: [],
                func: async function(sprite, script) {
                    let value = (await script.getNumberValue('VALUE', script)) / 100;
                    if (value > 1) value = 1;
                    if (value < 0) value = 0;
                    createjs.Sound.setVolume(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_sound_volume(%1)'] },
            },
            sound_silent_all: {
                color: '#A4D01D',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_03.png',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'sound_silent_all',
                },
                class: 'sound_stop',
                isNotFor: [],
                func: function(sprite, script) {
                    createjs.Sound.stop();
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.stop_sound()'] },
            },
        };
    },
};
