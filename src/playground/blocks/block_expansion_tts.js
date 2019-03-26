'use strict';

const { toQueryString } = require('../../util/common');
const _trim = require('lodash/trim');

Entry.EXPANSION_BLOCK.tts = {
    name: 'tts',
    imageName: 'tts.png',
    title: {
        ko: '읽어주기',
        en: 'read',
        jp: 'を読み上げる',
    },
    titleKey: 'template.tts_title_text',
    description: Lang.Msgs.expansion_tts_description,
    descriptionKey: 'Msgs.expansion_tts_description',
    isInitialized: false,
    init() {
        if (this.isInitialized) {
            return;
        }
        this.soundQueue = new createjs.LoadQueue();
        this.soundQueue.installPlugin(createjs.Sound);
        this.soundQueue.on('complete', ({ currentTarget }) => {
            const items = currentTarget.getItems().map(item => item.item);
            this.loadQueue = this.loadQueue.filter(id => {
                const filtered = items.filter(item => item.id === id);
                if (filtered.length > 0) {
                    createjs.Sound.play(id);
                    return false;
                }
                setTimeout(() => createjs.Sound.play(id), 1000);
                return false;
            });
        });
        Entry.EXPANSION_BLOCK.tts.isInitialized = true;
    },
    api: '/api/expansionBlock/tts/read',
    loadQueue: [],
};

Entry.EXPANSION_BLOCK.tts.getBlocks = function() {
    const params = {
        getSpeaker(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.tts_female, 'kyuri'],
                    [Lang.Blocks.tts_male, 'jinho'],
                    [Lang.Blocks.tts_kind, 'hana'],
                    [Lang.Blocks.tts_sweet, 'dinna'],
                    [Lang.Blocks.tts_echo, 'brown'],
                    [Lang.Blocks.tts_mischievous, 'minions'],
                    [Lang.Blocks.tts_dainty, 'sally'],
                ],
                value: 'kyuri',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getSpeed(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.tts_veryslow, '5'],
                    [Lang.Blocks.tts_slow, '3'],
                    [Lang.Blocks.tts_normal, '0'],
                    [Lang.Blocks.tts_fast, '-3'],
                    [Lang.Blocks.tts_veryfast, '-5'],
                ],
                value: '0',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getPitch(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.tts_verylow, '5'],
                    [Lang.Blocks.tts_low, '3'],
                    [Lang.Blocks.tts_normal, '0'],
                    [Lang.Blocks.tts_high, '-3'],
                    [Lang.Blocks.tts_veryhigh, '-5'],
                ],
                value: '0',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
    };

    const hashCode = s => s.split('').reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    const checkText = function(text) {
        const result = {
            result: false,
            message: Lang.Blocks.unknown_sentence,
        };

        if (!text) {
            result.message = Lang.Blocks.no_sentence;
            return result;
        }

        if (text.length > 2500) {
            result.message = Lang.Blocks.sentence_over_2500_charactor;
            return result;
        }

        return {
            result: true,
            message: _trim(text),
            code: hashCode(text),
        };
    };

    return {
        tts_title: {
            skeleton: 'basic_text',
            color: '#ecf8ff',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.tts_title_text,
                    color: '#333',
                    align: 'center',
                },
            ],
            def: {
                type: 'tts_title',
            },
            class: 'tts',
            isNotFor: ['tts'],
            events: {},
        },
        read_text: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic',
            statements: [],
            params: [
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
                        params: [Lang.Blocks.entry],
                    },
                ],
                type: 'read_text',
            },
            pyHelpDef: {
                params: ['A&value'],
                type: 'read_text',
            },
            paramsKeyMap: {
                TEXT: 0,
            },
            class: 'tts',
            isNotFor: ['tts'],
            func(sprite, script) {
                const tts = Entry.EXPANSION_BLOCK.tts;
                const textObj = checkText(script.getStringValue('TEXT', script));
                if (textObj.result && tts.isInitialized) {
                    const prop = sprite.getVoiceProp();
                    const id = `tts-${textObj.code}-${JSON.stringify(prop)}`;
                    const sound = tts.soundQueue.getItem(id);
                    if (sound) {
                        createjs.Sound.play(id);
                    } else {
                        const src = `${Entry.EXPANSION_BLOCK.tts.api}.mp3?${toQueryString({ text: encodeURI(textObj.message), ...prop })}`;
                        const type = createjs.LoadQueue.SOUND;
                        tts.soundQueue.loadFile({ id, src, type });
                        tts.loadQueue.push(id);
                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'TTS.read(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        set_tts_property: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic',
            statements: [],
            params: [
                params.getSpeaker(),
                params.getSpeed(),
                params.getPitch(),
            ],
            events: {},
            def: {
                params: [
                    params.getSpeaker().value,
                    params.getSpeed().value,
                    params.getPitch().value,
                ],
                type: 'set_tts_property',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'set_tts_property',
            },
            paramsKeyMap: {
                SPEAKER: 0,
                SPEED: 1,
                PITCH: 2,
            },
            class: 'tts',
            isNotFor: ['tts'],
            func(sprite, script) {
                const speaker = script.getField('SPEAKER', script);
                const speed = script.getField('SPEED', script);
                const pitch = script.getField('PITCH', script);
                sprite.setVoiceProp({ speaker, speed, pitch });
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'TTS.set(%1, %2, %3)',
                        blockType: 'param',
                        textParams: [
                            params.getSpeaker(true),
                            params.getSpeed(true),
                            params.getPitch(true),
                        ],
                    },
                ],
            },
        },
    };
};
