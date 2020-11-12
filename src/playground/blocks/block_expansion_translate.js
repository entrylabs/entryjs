'use strict';

const PromiseManager = require('../../core/promiseManager');
const { callApi } = require('../../util/common');
const _uniqueId = require('lodash/uniqueId');

Entry.EXPANSION_BLOCK.translate = {
    name: 'translate',
    imageName: 'papago.png',
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
        Entry.EXPANSION_BLOCK.translate.delayKey = Entry.projectId;
        Entry.EXPANSION_BLOCK.translate.isInitialized = true;
    },
    api: '/api/expansionBlock/papago/',
    typeMap: {
        'dictionary': 'nsmt',
        'artificial_intelligence': 'n2mt',
    },
    apiType: 'nsmt',
    langCodeMap: {
        'auto': {
            lang: Lang.Blocks.auto,
            sub: ['en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id', 'hi', 'ko'],
        },
        'ko': {
            lang: Lang.Blocks.korean,
            sub: ['en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id'],
        },
        'en': {
            lang: Lang.Blocks.english,
            sub: ['ko', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'ja': {
            lang: Lang.Blocks.japan,
            sub: ['ko', 'en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'zh-CN': {
            lang: Lang.Blocks.chinese_simplified,
            sub: ['ko', 'en', 'ja', 'zh-TW', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'zh-TW': {
            lang: Lang.Blocks.chinese_traditional,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'es', 'fr', 'de', 'ru', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'es': {
            lang: Lang.Blocks.spanish,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'fr', 'de', 'ru', 'th', 'vi', 'id'],
        },
        'fr': {
            lang: Lang.Blocks.french,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'de', 'ru', 'th', 'vi', 'id'],
        },
        'de': {
            lang: Lang.Blocks.german,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'ru', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'ru': {
            lang: Lang.Blocks.russian,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'pt', 'th', 'vi', 'id', 'hi'],
        },
        'pt': {
            lang: Lang.Blocks.portuguese,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'de', 'ru', 'hi'],
        },
        'th': {
            lang: Lang.Blocks.thai,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'vi'],
        },
        'vi': {
            lang: Lang.Blocks.vietnamese,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'th', 'id'],
        },
        'id': {
            lang: Lang.Blocks.indonesian,
            sub: ['ko', 'en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ru', 'th', 'vi'],
        },
        'hi': {
            lang: Lang.Blocks.hindi,
            sub: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'de', 'ru', 'pt'],
        },
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
        getSourceLang: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.korean, 'ko'],
                    [Lang.Blocks.english, 'en'],
                    [Lang.Blocks.japan, 'ja'],
                    [Lang.Blocks.chinese_simplified, 'zh-CN'],
                    [Lang.Blocks.chinese_traditional, 'zh-TW'],
                    [Lang.Blocks.spanish, 'es'],
                    [Lang.Blocks.french, 'fr'],
                    [Lang.Blocks.german, 'de'],
                    [Lang.Blocks.russian, 'ru'],
                    [Lang.Blocks.portuguese, 'pt'],
                    [Lang.Blocks.thai, 'th'],
                    [Lang.Blocks.vietnamese, 'vi'],
                    [Lang.Blocks.indonesian, 'id'],
                    [Lang.Blocks.hindi, 'hi'],
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
        getTargetLang: function(targetIndex = 0, isPython = false) {
            let param = {
                type: 'DropdownDynamic',
                value: null,
                menuName: function(value) {
                    const langCodeMap = Entry.EXPANSION_BLOCK.translate.langCodeMap;
                    if (value) {
                        return langCodeMap[value].sub.map((code) => {
                            return [langCodeMap[code].lang, code];
                        });
                    }

                    if (this._contents.options) {
                        return this._contents.options;
                    } else {
                        return langCodeMap['ko'].sub.map((code) => {
                            return [langCodeMap[code].lang, code];
                        });
                    }
                },
                targetIndex: targetIndex,
                needDeepCopy: true,
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
    };
    const getProjectId = function() {
        if(Entry.projectId) {
            Entry.EXPANSION_BLOCK.translate.delayKey = Entry.projectId;
        }

        if(Entry.EXPANSION_BLOCK.translate.delayKey) {
            return Entry.EXPANSION_BLOCK.translate.delayKey;
        }

        Entry.EXPANSION_BLOCK.translate.delayKey = _.uniqueId(Entry.generateHash());
        return Entry.EXPANSION_BLOCK.translate.delayKey;
    }

    const translate = (params, type, defaultValue) => {
        params['projectId'] = getProjectId();
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
        }).catch(() => defaultValue);
    };

    const checkLang = (query, defaultValue) => {
        const langCodeMap = Entry.EXPANSION_BLOCK.translate.langCodeMap;
        return new PromiseManager().Promise(function(resolve) {
            callApi('translate-detect-' + query, {
                url: Entry.EXPANSION_BLOCK.translate.api + 'dect/langs',
                params: { query , projectId : getProjectId()},
            }).then((result) => {
                if (result.data && result.data.langCode && langCodeMap[result.data.langCode]) {
                    return resolve(langCodeMap[result.data.langCode].lang);
                }
                return resolve(defaultValue);
            }).catch(() => {
                return resolve(defaultValue);
            });
        }).catch(() => defaultValue);
    };

    const checkText = function(text) {
        let result = {
            result: false,
            message: Lang.Blocks.unknown_sentence,
        };

        if (!text) {
            result.message = Lang.Blocks.no_sentence;
            return result;
        }

        if (text.length > 20) {
            result.message = Lang.Blocks.sentence_over_20_charactor;
            return result;
        }

        return {
            result: true,
            message: text,
        };
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
                params.getSourceLang(),
                {
                    type: 'Block',
                    accept: 'string',
                },
                params.getTargetLang(0),
            ],
            events: {},
            def: {
                params: [
                    params.getSourceLang().value,
                    {
                        type: 'text',
                        params: [Lang.Blocks.entry],
                    },
                    null,
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
            func: function(sprite, script) {
                const textObj = checkText(script.getStringValue('TEXT', script));
                if (!textObj.result) {
                    return textObj.message;
                }

                const type = Entry.EXPANSION_BLOCK.translate.apiType;
                const params = {
                    text: textObj.message,
                    target: script.getField('TARGET', script),
                    source: script.getField('SOURCE', script),
                };

                if (params.target == params.source) {
                    return params.text;
                }

                return translate(params, type, Lang.Blocks.unknown_sentence);
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
                            params.getTargetLang(0, true),
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
            func: function(sprite, script) {
                const text = script.getStringValue('TEXT', script);
                const textObj = checkText(text);
                if (!textObj.result) {
                    return textObj.message;
                }

                return checkLang(textObj.message, Lang.Blocks.unknown_sentence);
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
                            },
                        ],
                    },
                ],
            },
        },
    };
};