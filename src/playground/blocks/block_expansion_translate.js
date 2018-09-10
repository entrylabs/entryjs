'use strict';

Entry.EXPANSION_BLOCK.translate = {
    name: 'translate',
    imageName: 'weather.png',
    title: {
        'ko': '번역',
        'en': 'translate',
    },
    description: Lang.Msgs.expansion_translate_description,
    isInitialized: false,
    init: function() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.translate.isInitialized = true;
    },
    api: '/api/expansionBlock/papago/',
    typeMap: {
        'dictionary': 'nsmt',
        'artificial_intelligence': 'n2mt',
    },
};

Entry.EXPANSION_BLOCK.translate.getBlocks = function() {
    let params = {
        getType: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.dictionary, 'dictionary'],
                    [Lang.Blocks.artificial_intelligence, 'artificial_intelligence'],
                ],
                value: 'dictionary',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getLang: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.korean, 'ko'],
                    [Lang.Menus.english, 'en'],
                    [Lang.Menus.japan, 'ja'],
                    [Lang.Menus.russia, 'ru'],
                    [Lang.Menus.chinese_simplified, 'zh-CN'],
                    [Lang.Menus.chinese_traditional, 'zh-TW'],
                ],
                value: 'ko',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
    };

    return {
        translate_title: {
            skeleton: 'basic_text',
            color: '#e5e5e5',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.translate_title_text,
                    color: '#333',
                    align: 'center',
                },
            ],
            def: {
                type: 'translate_title',
            },
            class: 'translate',
            isNotFor: ['translate'],
            events: {},
        },
        get_translated_string: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                params.getType(),
                params.getLang(),
                params.getLang(),
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [Lang.Blocks.entry],
                    },
                    params.getType().value,
                    params.getLang().value,
                    params.getLang().value,
                ],
                type: 'get_translated_string',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value', 'D&value'],
                type: 'get_translated_string',
            },
            paramsKeyMap: {
                TEXT: 0,
                TYPE: 1,
                SOURCE: 2,
                TARGET: 3,
            },
            class: 'translate',
            isNotFor: ['translate'],
            func: async function(sprite, script) {
                const param = {
                    text: await script.getStringValue('TEXT', script),
                    target: script.getField('TARGET', script),
                    source: script.getField('SOURCE', script),
                };

                if (param.target == param.source) {
                    return param.text;
                }

                var type = Entry.EXPANSION_BLOCK.translate.typeMap[script.getField('TYPE', script)];
                var result = await $.get(Entry.EXPANSION_BLOCK.translate.api + 'translate/' + type, param);
                if (result) {
                    return result.translatedText;
                } else {
                    return '';
                }

            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Translate.do(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            params.getType(),
                            params.getLang(),
                            params.getLang(),
                        ],
                    },
                ],
            },
        },
        check_language: {
            color: '#ff8888',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                params.getLang(),
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: [Lang.Blocks.entry],
                    },
                    params.getLang().value,
                ],
                type: 'check_language',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value'],
                type: 'check_language',
            },
            paramsKeyMap: {
                TEXT: 0,
                LANG: 1,
            },
            class: 'translate',
            isNotFor: ['translate'],
            func: async function(sprite, script) {
                const query = await script.getStringValue('TEXT', script);
                const lang = script.getField('LANG', script);

                var result = await $.get(Entry.EXPANSION_BLOCK.translate.api + 'dect/langs', { query });
                if (result && result.langCode) {
                    return result.langCode == lang;
                } else {
                    return true;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.is_current_finedust_grade_good(%1)',
                        params: [null, 'good'],
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            params.getLang(true),
                        ],
                    },
                ],
            },
        },
    };
};