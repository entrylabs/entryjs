'use strict';

const PromiseManager = require('../../core/promiseManager');
const { callApi } = require('../../util/common');

Entry.EXPANSION_BLOCK.behaviorConductDisaster = {
    name: 'behaviorConductDisaster',
    imageName: 'disaster.png',
    title: {
        'ko': '자연재난',
        'en': 'Disaster',
    },
    description: Lang.Msgs.expansion_behaviorConductDisaster_description,
    isInitialized: false,
    init: function() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.behaviorConductDisaster.isInitialized = true;
    },
    api: '/api/expansionBlock/behaviorConduct',
    apiType: '01',
    categoryMap: {
        '01001': {
            lang: Lang.Blocks.behaviorConduct01001,
            sub: ['01001002', '01001003', '01001004', '01001005'],
        },
        '01002': {
            lang: Lang.Blocks.behaviorConduct01002,
            sub: ['01002002', '01002003', '01002004'],
        },
        '01003': {
            lang: Lang.Blocks.behaviorConduct01003,
            sub: ['01003002', '01003003', '01003004'],
        },
        '01004': {
            lang: Lang.Blocks.behaviorConduct01004,
            sub: ['01004002', '01004003', '01004004'],
        },
        '01005': {
            lang: Lang.Blocks.behaviorConduct01005,
            sub: ['01005002'],
        },
        '01006': {
            lang: Lang.Blocks.behaviorConduct01006,
            sub: ['01006002'],
        },
        '01007': {
            lang: Lang.Blocks.behaviorConduct01007,
            sub: ['01007002', '01007003'],
        },
        '01008': {
            lang: Lang.Blocks.behaviorConduct01008,
            sub: ['01008002', '01008003', '01008004'],
        },
        '01009': {
            lang: Lang.Blocks.behaviorConduct01009,
            sub: ['01009001', '01009002', '01009003'],
        },
        '01010': {
            lang: Lang.Blocks.behaviorConduct01010,
            sub: ['01010001'],
        },
        '01011': {
            lang: Lang.Blocks.behaviorConduct01011,
            sub: ['01011009', '01011010', '01011012'],
        },
        '01013': {
            lang: Lang.Blocks.behaviorConduct01013,
            sub: ['01013002', '01013003'],
        },
        '01014': {
            lang: Lang.Blocks.behaviorConduct01014,
            sub: ['01014001', '01014002'],
        },
    },
};

Entry.EXPANSION_BLOCK.behaviorConductDisaster.getBlocks = function() {
    const categoryMap = Entry.EXPANSION_BLOCK.behaviorConductDisaster.categoryMap;
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
                url: `${Entry.EXPANSION_BLOCK.behaviorConductDisaster.api}/${params.category}/${params.subCategory}`
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
        behaviorConductDisaster_title: {
            skeleton: 'basic_text',
            color: '#e5e5e5',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.behaviorConductDisaster_title_text,
                    color: '#333',
                    align: 'center',
                },
            ],
            def: {
                type: 'behaviorConductDisaster_title',
            },
            class: 'behaviorConductDisaster',
            isNotFor: ['behaviorConductDisaster'],
            events: {},
        },
        count_disaster_behavior: {
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
                type: 'count_disaster_behavior',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value'],
                type: 'count_disaster_behavior',
            },
            paramsKeyMap: {
                CATEGORY: 0,
                SUB_CATEGORY: 1
            },
            class: 'behaviorConductDisaster',
            isNotFor: ['behaviorConductDisaster'],
            func: function(sprite, script) {
                const params = {
                    category: Entry.EXPANSION_BLOCK.behaviorConductDisaster.apiType,
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
        get_disaster_behavior: {
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
                type: 'get_disaster_behavior',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'get_disaster_behavior',
            },
            paramsKeyMap: {
                CATEGORY: 0,
                SUB_CATEGORY: 1,
                NUMBER: 2
            },
            class: 'behaviorConductDisaster',
            isNotFor: ['behaviorConductDisaster'],
            func: function(sprite, script) {
                const number = script.getStringValue('NUMBER', script);
                const defaultValue = Lang.Blocks.no_data;
                const params = {
                    category: Entry.EXPANSION_BLOCK.behaviorConductDisaster.apiType,
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