'use strict';

const PromiseManager = require('@core/promiseManager');
const { callApi } = require('@util/common');

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
    apiType : "nsmt",
    langCodeMap : {
        "ko" : Lang.Blocks.lang_ko,
        "en" : Lang.Blocks.lang_en,
        "es" : Lang.Blocks.lang_es,
        "fr" : Lang.Blocks.lang_fr,
        "id" : Lang.Blocks.lang_id,
        "ja" : Lang.Blocks.lang_ja,
        "th" : Lang.Blocks.lang_th,
        "vi" : Lang.Blocks.lang_vi,
        "zh-CN" : Lang.Blocks.lang_zh_cn,
        "zh-TW" : Lang.Blocks.lang_zh_tw,
        "it" : Lang.Blocks.lang_it
    }
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
        getSourceLang: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.lang_ko, 'ko'],
                    [Lang.Blocks.lang_en, 'en'],
                    [Lang.Blocks.lang_ja, 'ja'],
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
        getTargetLang: function(isPython) {
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

    const translate = (params, type, defaultValue) => {
        const key = 'translate-' + type + JSON.stringify(params);
        return new PromiseManager().Promise(function(resolve) {
            callApi(key, {
                url: Entry.EXPANSION_BLOCK.translate.api + 'translate/' + type,
                params: params,
            }).then((result) => {
                if (result.data) {
                    return resolve(result.data.translatedText);
                }
                return resolve(defaultValue);
            }).catch(() => {
                return resolve(defaultValue);
            });
        });
    };

    const checkLang = (query, defaultValue) => {
        return new PromiseManager().Promise(function(resolve) {
            callApi('translate-detect-' + query, {
                url: Entry.EXPANSION_BLOCK.translate.api + 'dect/langs',
                params: { query },
            }).then((result) => {
                if (result.data && result.data.langCode) {
                    return resolve(result.data.langCode);
                }
                return resolve(defaultValue);
            }).catch(() => {
                return resolve(defaultValue);
            });
        });
    };

    const checkText = function(text) {
        let result = {
            result : false,
            message : "알수없는 문장입니다."
        };

        if(!text) {
            result.message = "문장이 없습니다."
            return result;
        }

        if(text.length > 20) {
            result.message = "20자 이내로 작성해 주십시오.";
            return result;
        }

        return {
            result : true,
            message : text
        };
    }
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
                params.getSourceLang(),
                {
                    type: 'Block',
                    accept: 'string',
                },
                params.getTargetLang(),
            ],
            events: {},
            def: {
                params: [
                    params.getSourceLang().value,
                    {
                        type: 'text',
                        params: [Lang.Blocks.entry],
                    },
                    params.getTargetLang().value,
                ],
                type: 'get_translated_string',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'get_translated_string',
            },
            paramsKeyMap: {
                SOURCE: 0,
                TEXT: 1,
                TARGET: 2,
            },
            class: 'translate',
            isNotFor: ['translate'],
            func: async function(sprite, script) {
                const textObj = checkText(await script.getStringValue('TEXT', script));
                if(!textObj.result) {
                    return textObj.message;
                };

                const type = Entry.EXPANSION_BLOCK.translate.apiType;
                const params = {
                    text: textObj.message,
                    target: script.getField('TARGET', script),
                    source: script.getField('SOURCE', script),
                };

                if (params.target == params.source) {
                    return params.text;
                }

                return await translate(params, type, '알 수 없는 문장입니다.');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Translate.do(%1, %2, %3)',
                        blockType: 'param',
                        textParams: [
                            params.getSourceLang(true),
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            params.getTargetLang(true),
                        ],
                    },
                ],
            },
        },
        check_language: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
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
                type: 'check_language',
            },
            pyHelpDef: {
                params: ['A&value'],
                type: 'check_language',
            },
            paramsKeyMap: {
                TEXT: 0,
                LANG: 1,
            },
            class: 'translate',
            isNotFor: ['translate'],
            func: async function(sprite, script) {
                const textObj = checkText(await script.getStringValue('TEXT', script));
                if(!textObj.result) {
                    return textObj.message;
                }

                const langCode = await checkLang(textObj.message, langCode);
                const result = Entry.EXPANSION_BLOCK.translate.langCodeMap[langCode];
                if(result) {
                    return result;
                }
                return "알 수 없는 문장입니다.";
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Translate.getLang(%1)',
                        params: [null],
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            }
                        ],
                    },
                ],
            },
        },
    };
};