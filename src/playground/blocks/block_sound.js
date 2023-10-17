import _clamp from 'lodash/clamp';

Entry.playbackRateValue = 1;

module.exports = {
    getBlocks() {
        return {
            sound_something_with_block: {
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    const soundId = script.getStringValue('VALUE', script);
                    const sound = sprite.parent.getSound(soundId);

                    if (sound) {
                        const instance = Entry.Utils.playSound(sound.id);
                        Entry.Utils.addSoundInstances(instance);
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
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
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
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    let [soundId, timeValue] = script.getValues(['VALUE', 'SECOND'], script);
                    soundId = String(soundId);
                    timeValue = Number(timeValue);

                    const sound = sprite.parent.getSound(soundId);
                    if (sound) {
                        const instance = Entry.Utils.playSound(sound.id, {
                            startTime: 0,
                            duration: timeValue * 1000,
                        });
                        Entry.Utils.addSoundInstances(instance);
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
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
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
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    const soundId = script.getStringValue('VALUE', script);
                    const sound = sprite.parent.getSound(soundId);

                    if (sound) {
                        let [start, end] = script.getValues(['START', 'END'], script);
                        start = Number(start) * 1000;
                        end = Number(end) * 1000;
                        const instance = Entry.Utils.playSound(sound.id, {
                            startTime: Math.min(start, end),
                            duration: Math.max(start, end) - Math.min(start, end),
                        });
                        Entry.Utils.addSoundInstances(instance);
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
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    if (!script.isPlay) {
                        script.isPlay = true;
                        const soundId = script.getStringValue('VALUE', script);
                        const sound = sprite.parent.getSound(soundId);
                        if (sound) {
                            script.playState = 1;
                            const instance = Entry.Utils.playSound(sound.id);
                            Entry.Utils.addSoundInstances(instance);
                            setTimeout(() => {
                                script.playState = 0;
                            }, sound.duration * 1000);
                        }
                        return script;
                    } else if (script.playState == 1) {
                        return script;
                    } else {
                        delete script.playState;
                        delete script.isPlay;
                        return script.callReturn();
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
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
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
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    if (!script.isPlay) {
                        script.isPlay = true;
                        const soundId = script.getStringValue('VALUE', script);
                        const sound = sprite.parent.getSound(soundId);
                        if (sound) {
                            script.playState = 1;
                            const instance = Entry.Utils.playSound(sound.id);
                            Entry.Utils.addSoundInstances(instance);
                            const timeValue = script.getNumberValue('SECOND', script);
                            setTimeout(() => {
                                instance.stop();
                                script.playState = 0;
                            }, timeValue * 1000);
                            instance.addEventListener('complete', (e) => {});
                        }
                        return script;
                    } else if (script.playState == 1) {
                        return script;
                    } else {
                        delete script.isPlay;
                        delete script.playState;
                        return script.callReturn();
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
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
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
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    if (!script.isPlay) {
                        script.isPlay = true;
                        const soundId = script.getStringValue('VALUE', script);
                        const sound = sprite.parent.getSound(soundId);
                        if (sound) {
                            script.playState = 1;
                            let [start, end] = script.getValues(['START', 'END'], script);
                            start = Number(start) * 1000;
                            end = Number(end) * 1000;

                            const startValue = Math.min(start, end);
                            const endValue = Math.max(start, end);
                            const duration = endValue - startValue;
                            const instance = Entry.Utils.playSound(sound.id, {
                                startTime: startValue,
                                duration,
                            });
                            Entry.Utils.addSoundInstances(instance);

                            setTimeout(() => {
                                script.playState = 0;
                            }, duration);
                        }
                        return script;
                    } else if (script.playState == 1) {
                        return script;
                    } else {
                        delete script.isPlay;
                        delete script.playState;
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: ['Entry.play_sound_from_to_and_wait(%1, %2, %3)'],
                },
            },
            sound_volume_change: {
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    let value = script.getNumberValue('VALUE', script) / 100;
                    value = value + Entry.Utils.getVolume();
                    if (value > 1) {
                        value = 1;
                    }
                    if (value < 0) {
                        value = 0;
                    }
                    Entry.Utils.setVolume(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.add_sound_volume(%1)'] },
            },
            sound_volume_set: {
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
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
                func(sprite, script) {
                    let value = script.getNumberValue('VALUE', script) / 100;
                    if (value > 1) {
                        value = 1;
                    }
                    if (value < 0) {
                        value = 0;
                    }
                    Entry.Utils.setVolume(value);
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.set_sound_volume(%1)'] },
            },
            sound_silent_all: {
                template: '%1 소리 멈추기 %2',
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.FLOW_stop_object_all, 'all'],
                            [Lang.Blocks.FLOW_stop_object_this_object, 'thisOnly'],
                            [Lang.Blocks.FLOW_stop_object_other_objects, 'other_objects'],
                        ],
                        value: 'all',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.SOUND,
                        arrowColor: EntryStatic.colorSet.common.WHITE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'sound_silent_all',
                },
                paramsKeyMap: {
                    TARGET: 0,
                },
                class: 'sound_stop',
                isNotFor: [],
                func(sprite, script) {
                    switch (script.getField('TARGET', script)) {
                        case 'all':
                            Entry.Utils.forceStopSounds();
                            return script.callReturn();
                        case 'thisOnly': {
                            const instances = Entry.soundInstances.getAll(sprite);
                            instances.forEach((instance) => {
                                instance?.dispatchEvent?.('complete');
                                instance.stop();
                            });
                            return script.callReturn();
                        }
                        case 'other_objects': {
                            const instances = Entry.soundInstances.getAllExcept(sprite);
                            instances.forEach((instance) => {
                                instance?.dispatchEvent?.('complete');
                                instance.stop();
                            });
                            return script.callReturn();
                        }
                    }
                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.stop_sound()'] },
            },
            set_sound_speed: {
                template: '소리 빠르기를 %1 배로 정하기 %2',
                color: EntryStatic.colorSet.block.default.SOUND,
                outerLine: EntryStatic.colorSet.block.darken.SOUND,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/sound_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        ,
                        null,
                    ],
                    type: 'set_sound_speed',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'sound_speed',
                isNotFor: [],
                func(sprite, script) {
                    let value = _clamp(script.getNumberValue('VALUE'), 0.5, 2);
                    if (!Entry.Utils.isNumber(value)) {
                        value = 1;
                    }
                    Entry.playbackRateValue = value;
                    const instances = Entry.soundInstances.getAllValues();
                    instances.forEach((instance) => {
                        if (instance.sourceNode?.playbackRate) {
                            instance.sourceNode.playbackRate.value = Entry.playbackRateValue;
                        }
                    });

                    return script.callReturn();
                },
                syntax: { js: [], py: ['Entry.stop_sound()'] },
            },
        };
    },
};
