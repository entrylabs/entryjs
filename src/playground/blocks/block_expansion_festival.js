'use strict';


const PromiseManager = require('@core/promiseManager');
const { callApi } = require('@util/common');

Entry.EXPANSION_BLOCK.festival = {
    name: 'festival',
    imageName: 'weather.png',
    title: {
        'ko': '행사',
        'en': 'festival',
    },
    description: Lang.Msgs.expansion_translate_description,
    isInitialized: false,
    init: function() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.festival.isInitialized = true;
    },
    api: '/api/expansionBlock/ko/festival',
    locationMap: {
        'Seoul': 1,
        'Gangwon': 32,
        'Gyeonggi-do': 31,
        'Gyeongsangnam-do': 36,
        'Gyeongsangbuk-do': 35,
        'Gwangju': 5,
        'Daegu': 4,
        'Daejeon': 3,
        'Busan': 6,
        'Sejong': 8,
        'Ulsan': 7,
        'Incheon': 2,
        'Jeollanam-do': 38,
        'Jeollabuk-do': 37,
        'Jeju': 15,
        'Chungcheongnam-do': 34,
        'Chungcheongbuk-do': 33,
    },
    infoTypeMap: {
        'title': 'title',
        'address': 'addr1',
        'start_date': 'eventstartdate',
        'end_date': 'eventenddate',
        'coordinatex': 'mapx',
        'coordinatey': 'mapy',
        'area': 'addr2',
        'homepage': 'homepage',
        'overview': 'overview',
    },
    strip: function(html) {
        let tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';

    },
};

Entry.EXPANSION_BLOCK.festival.getBlocks = function() {
    let params = {
        getLocation: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.location_seoul, 'Seoul'],
                    [Lang.Blocks.location_gangwon, 'Gangwon'],
                    [Lang.Blocks.location_gyeonggi, 'Gyeonggi-do'],
                    [Lang.Blocks.location_gyeongsangnam, 'Gyeongsangnam-do'],
                    [Lang.Blocks.location_gyeongsangbuk, 'Gyeongsangbuk-do'],
                    [Lang.Blocks.location_gwangju, 'Gwangju'],
                    [Lang.Blocks.location_daegu, 'Daegu'],
                    [Lang.Blocks.location_daejeon, 'Daejeon'],
                    [Lang.Blocks.location_busan, 'Busan'],
                    [Lang.Blocks.location_sejong, 'Sejong'],
                    [Lang.Blocks.location_ulsan, 'Ulsan'],
                    [Lang.Blocks.location_incheon, 'Incheon'],
                    [Lang.Blocks.location_jeollanam, 'Jeollanam-do'],
                    [Lang.Blocks.location_jeollabuk, 'Jeollabuk-do'],
                    [Lang.Blocks.location_jeju, 'Jeju'],
                    [Lang.Blocks.location_chungcheongnam, 'Chungcheongnam-do'],
                    [Lang.Blocks.location_chungcheongbuk, 'Chungcheongbuk-do'],
                ],
                value: 'Seoul',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getMonth: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Menus.jan, '1'],
                    [Lang.Menus.feb, '2'],
                    [Lang.Menus.mar, '3'],
                    [Lang.Menus.apr, '4'],
                    [Lang.Menus.may, '5'],
                    [Lang.Menus.jun, '6'],
                    [Lang.Menus.jul, '7'],
                    [Lang.Menus.aug, '8'],
                    [Lang.Menus.sep, '9'],
                    [Lang.Menus.oct, '10'],
                    [Lang.Menus.nov, '11'],
                    [Lang.Menus.dec, '12'],
                ],
                value: '1',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getInfoType: function(isPython) {
            let param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_FESTIVAL_title, 'title'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_area, 'area'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_start_date, 'start_date'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_end_date, 'end_date'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_address, 'address'],
                    //[Lang.Blocks.EXPANSION_FESTIVAL_coordinate, 'coordinate'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_overview, 'overview'],
                    [Lang.Blocks.EXPANSION_FESTIVAL_homepage, 'homepage'],
                ],
                value: 'title',
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
        festival_title: {
            skeleton: 'basic_text',
            color: '#e5e5e5',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.festival_title_text,
                    color: '#333',
                    align: 'center',
                },
            ],
            def: {
                type: 'festival_title',
            },
            class: 'festival',
            isNotFor: ['festival'],
            events: {},
        },
        count_festival: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                params.getLocation(),
                params.getMonth(),
            ],
            events: {},
            def: {
                params: [
                    params.getLocation().value,
                    params.getMonth().value,
                ],
                type: 'count_festival',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value', 'D&value'],
                type: 'count_festival',
            },
            paramsKeyMap: {
                LOCATION: 0,
                MONTH: 1,
            },
            class: 'festival',
            isNotFor: ['festival'],
            func: function(sprite, script) {
                const defaultValue = 0;
                const params = {
                    area: Entry.EXPANSION_BLOCK.festival.locationMap[script.getField('LOCATION', script)],
                    month: script.getField('MONTH', script),
                    list: 'N',
                };
                const key = "festival.api-" + JSON.stringify(params);
                return new PromiseManager().Promise((resolve, reject) => {
                    callApi(key, {url:Entry.EXPANSION_BLOCK.festival.api, params:params}).then((result) => {
                        if (result && result.hasOwnProperty("data")) {
                            return resolve(result.data.response.body.items.item.totalCnt);
                        }
                        reject(defaultValue);
                    }).catch(()=> { return reject(defaultValue);});
                }).catch(()=> defaultValue);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Event.get_len(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getMonth(true)
                        ],
                    },
                ],
            },
        },
        get_festival_info: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                params.getLocation(),
                params.getMonth(),
                {
                    type: 'Block',
                    accept: 'string',
                },
                params.getInfoType(),
            ],
            events: {},
            def: {
                params: [
                    params.getLocation().value,
                    params.getMonth().value,
                    1,
                    params.getInfoType().value,
                ],
                type: 'get_festival_info',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value', 'D&value'],
                type: 'get_festival_info',
            },
            paramsKeyMap: {
                LOCATION: 0,
                MONTH: 1,
                NUMBER: 2,
                TYPE: 3,
            },
            class: 'festival',
            isNotFor: ['festival'],
            func: function(sprite, script) {
                const type = script.getField('TYPE', script);
                const infoType = Entry.EXPANSION_BLOCK.festival.infoTypeMap[type];
                const defaultValue = '정보없음';

                return new PromiseManager().Promise((resolve) => {
                    //1. 몇번째 행사인지 숫자 가지고오기.
                    resolve(script.getStringValue('NUMBER', script));
                }).then(number => {
                    if (number < 1) {
                        throw defaultValue;
                    }

                    const num = number % 10 || 10;
                    const params = {
                        area: Entry.EXPANSION_BLOCK.festival.locationMap[script.getField('LOCATION', script)],
                        month: script.getField('MONTH', script),
                        page: Math.floor((number - 1) / 10 + 1),
                    }
                    const key = "festival.api-" + JSON.stringify(params);
                    return new PromiseManager().Promise(function(resolve, reject) {
                        //2. 숫자에 따라 페이지를 구해 리스트 api에서 기본정보 가지고 오기.
                        callApi(key, {url : Entry.EXPANSION_BLOCK.festival.api, params:params}).then((result) => {
                            console.log(result);
                            let items = result.data.response.body.items.item;
                            let item = items[num - 1];
                            switch (type) {
                                case 'homepage':
                                case 'overview':
                                    return resolve(item.contentid);
                                default:
                                    if (item && item.hasOwnProperty(infoType)) {
                                        reject(item[infoType]);
                                    }
                                    return reject(defaultValue);
                            }
                        }).catch(()=> { return reject(defaultValue);});
                    });
                }).then(contentid => {
                    const key = "festival.api.detail_" + contentid;
                    return new PromiseManager().Promise(function(resolve, reject) {
                        //3. homepage나 overview인 경우 detail api에서 정보 가지고오기.
                        callApi(key, {url : Entry.EXPANSION_BLOCK.festival.api + '/' + contentid}).then((response) => {
                            console.log(response);
                            let result = response.data.response.body.items.item[infoType];
                            if (result) {
                                return resolve(Entry.EXPANSION_BLOCK.festival.strip(result));
                            }
                            reject(defaultValue);
                        }).catch(()=> { return reject(defaultValue);});
                    });
                }).catch((data) => data);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Event.get_info(%1, %2, %3, %4)',
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getMonth(true),
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            params.getInfoType(true),
                        ],
                    },
                ],
            },
        },

    };
};