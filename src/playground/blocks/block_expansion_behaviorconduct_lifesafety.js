'use strict';

const PromiseManager = require('../../core/promiseManager');
const { callApi } = require('../../util/common');

Entry.EXPANSION_BLOCK.behaviorConductLifeSafety = {
    name: 'behaviorConductLifeSafety',
    imageName: 'firstaid.png',
    title: {
        'ko': '생활안전',
        'en': 'LifeSafety',
    },
    description: Lang.Msgs.expansion_behaviorConductLifeSafety_description,
    isInitialized: false,
    init: function() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.isInitialized = true;
    },
    api: '/api/expansionBlock/behaviorConduct',
    apiType: '03',
    categoryMap: {
        '03002': {
            lang: Lang.Blocks.behaviorConduct03002,
            sub: ['03002002', '03002003', '03002004', '03002005', '03002006'],
        },
        '03003': {
            lang: Lang.Blocks.behaviorConduct03003,
            sub: ['03003001', '03003002', '03003003'],
        },
        '03004': {
            lang: Lang.Blocks.behaviorConduct03004,
            sub: ['03004001'],
        },
        '03016': {
            lang: Lang.Blocks.behaviorConduct03016,
            sub: ['03016001'],
        },
        '03005': {
            lang: Lang.Blocks.behaviorConduct03005,
            sub: ['03005001'],
        },
        '03006': {
            lang: Lang.Blocks.behaviorConduct03006,
            sub: ['03006004', '03006005', '03006002', '03006003'],
        },
        '03008': {
            lang: Lang.Blocks.behaviorConduct03008,
            sub: ['03008001'],
        },
        '03009': {
            lang: Lang.Blocks.behaviorConduct03009,
            sub: ['03009001'],
        },
        '03010': {
            lang: Lang.Blocks.behaviorConduct03010,
            sub: ['03010001'],
        },
        '03011': {
            lang: Lang.Blocks.behaviorConduct03011,
            sub: ['03011001'],
        },
        '03012': {
            lang: Lang.Blocks.behaviorConduct03012,
            sub: ['03012001'],
        },
        '03013': {
            lang: Lang.Blocks.behaviorConduct03013,
            sub: ['03013002', '03013005'],
        },
        '03014': {
            lang: Lang.Blocks.behaviorConduct03014,
            sub: ['03014001', '03014003', '03014004'],
        },
        '03015' : {
            lang: Lang.Blocks.behaviorConduct03015,
            sub: ['03015007', '03015003'],
        }
    },
};

Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.getBlocks = function() {
    const categoryMap = Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.categoryMap;
    const getCategory = function() {
        return Object.keys(categoryMap).map(category => {
            return [categoryMap[category].lang, category];
        });
    };
    const defaultCategory = Object.keys(categoryMap)[0];
    let params = {
        getCategory: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: getCategory(),
                value: defaultCategory,
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getSubCategory: function(targetIndex = 0, isPython = false) {
            let param = {
                type: 'DropdownDynamic',
                value: null,
                menuName: function(value) {
                    if (value) {
                        return categoryMap[value].sub.map((category) => {
                            return [Lang.Blocks["behaviorConduct" + category], category];
                        });
                    }

                    if (this._contents.options) {
                        return this._contents.options;
                    } else {
                        return categoryMap[defaultCategory].sub.map((category) => {
                            return [Lang.Blocks["behaviorConduct" + category], category];
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

    const getBehavior = (params, defaultValue, index = null) => {
        const key = `behaviorConduct-${params.category}/${params.subCategory}`;
        return new PromiseManager().Promise(function(resolve) {
            callApi(key, {
                url: `${Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.api}/${params.category}/${params.subCategory}`
            }).then((result) => {
                if (result) {
                    let items = result.data.response.body.items.item.filter(i => {
                        return i.hasOwnProperty("actRmks") && i.safetyCate3 == params.subCategory2;
                    });
                    if(index) {
                        return resolve(items[index -1].actRmks);
                    }
                    return resolve(items.length);
                }
                return resolve(defaultValue);
            }).catch(() => {
                return resolve(defaultValue);
            });
        }).catch(() => defaultValue);
    };

    return {
        behaviorConductLifeSafety_title: {
            skeleton: 'basic_text',
            color: '#e5e5e5',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.behaviorConductLifeSafety_title_text,
                    color: '#333',
                    align: 'center',
                },
            ],
            def: {
                type: 'behaviorConductLifeSafety_title',
            },
            class: 'behaviorConductLifeSafety',
            isNotFor: ['behaviorConductLifeSafety'],
            events: {},
        },
        count_lifeSafety_behavior: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                params.getCategory(),
                params.getSubCategory(0)
            ],
            events: {},
            def: {
                params: [
                    params.getCategory().value,
                    null,
                ],
                type: 'count_lifeSafety_behavior',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value'],
                type: 'count_lifeSafety_behavior',
            },
            paramsKeyMap: {
                CATEGORY: 0,
                SUB_CATEGORY: 1
            },
            class: 'behaviorConductLifeSafety',
            isNotFor: ['behaviorConductLifeSafety'],
            func: function(sprite, script) {
                const params = {
                    category: Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.apiType,
                    subCategory: script.getField('CATEGORY', script),
                    subCategory2: script.getField('SUB_CATEGORY', script)
                };

                return getBehavior(params, 0);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        get_lifeSafety_behavior: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                params.getCategory(),
                params.getSubCategory(0),
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    params.getCategory().value,
                    null,
                    1
                ],
                type: 'get_lifeSafety_behavior',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'get_lifeSafety_behavior',
            },
            paramsKeyMap: {
                CATEGORY: 0,
                SUB_CATEGORY: 1,
                NUMBER: 2
            },
            class: 'behaviorConductLifeSafety',
            isNotFor: ['behaviorConductLifeSafety'],
            func: function(sprite, script) {
                const number = script.getStringValue('NUMBER', script);
                const defaultValue = Lang.Blocks.no_data;
                const params = {
                    category: Entry.EXPANSION_BLOCK.behaviorConductLifeSafety.apiType,
                    subCategory: script.getField('CATEGORY', script),
                    subCategory2: script.getField('SUB_CATEGORY', script)
                };

                return getBehavior(params, defaultValue, number);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
    };
};