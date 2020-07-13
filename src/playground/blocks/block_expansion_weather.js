'use strict';
const { getStateOptions, getCityOptions } = require('../../util/location');

Entry.Expansion_Weather = {
    name: 'weather',
    imageName: 'weather.png',
    title: {
        ko: '날씨',
        en: 'weather',
        jp: '拡張ブロックを追加する',
    },
    titleKey: 'template.weather_title_text',
    description: Lang.Msgs.expansion_weather_description,
    descriptionKey: 'Msgs.expansion_weather_description',
};

Entry.Expansion_Weather.getBlocks = function() {
    const params = {
        getDate(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.date_yesterday, 'yesterday'],
                    [Lang.Blocks.date_today, 'today'],
                    [Lang.Blocks.date_tomorrow, 'tomorrow'],
                    [Lang.Blocks.date_after_2_days, 'After_2_days'],
                    [Lang.Blocks.date_after_3_days, 'After_3_days'],
                    [Lang.Blocks.date_after_4_days, 'After_4_days'],
                    [Lang.Blocks.date_after_5_days, 'After_5_days'],
                    [Lang.Blocks.date_after_6_days, 'After_6_days'],
                ],
                value: 'today',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getLocation(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: getStateOptions(),
                value: 'Seoul',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
                dropdownSync: 'weather',
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getSubLocation(isPython = false) {
            const param = {
                type: 'DropdownDynamic',
                value: null,
                menuName() {
                    const value = this.getTargetValue('weather');
                    if (!value) {
                        return [[Lang.Blocks.no_target, 'null']];
                    }
                    return getCityOptions(value);
                },
                needDeepCopy: true,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
                defaultValue: (value, options) => {
                    if (options.length) {
                        return options[0][1];
                    }
                    return null;
                },
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getSky(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_sunny, 'sunny'],
                    [Lang.Blocks.EXPANSION_WEATHER_partly_cloudy, 'partly_cloudy'],
                    [Lang.Blocks.EXPANSION_WEATHER_mostly_cloudy, 'mostly_cloudy'],
                    [Lang.Blocks.EXPANSION_WEATHER_cloudy, 'cloudy'],
                    [Lang.Blocks.EXPANSION_WEATHER_rainy, 'rainy'],
                    [Lang.Blocks.EXPANSION_WEATHER_sleet, 'sleet'],
                    [Lang.Blocks.EXPANSION_WEATHER_snowy, 'snowy'],
                ],
                value: 'sunny',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getFineDust(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_good, 'good'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_normal, 'normal'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_bad, 'bad'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_very_bad, 'very_bad'],
                ],
                value: 'good',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getWeatherElements(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_lowest_temperature, 'the_lowest_temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_highest_temperature, 'the_highest_temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_humidity, 'humidity'],
                    [Lang.Blocks.EXPANSION_WEATHER_precipitation, 'precipitation'],
                    [
                        Lang.Blocks.EXPANSION_WEATHER_precipitation_probability,
                        'precipitation_probability',
                    ],
                    [Lang.Blocks.EXPANSION_WEATHER_wind_speed, 'wind_speed'],
                ],
                value: 'the_lowest_temperature',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getNowWeatherElement(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_temperature, 'temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust, 'concentration_of_fine_dust'],
                ],
                value: 'temperature',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getTime(isPython = false) {
            const param = {
                type: 'Dropdown',
                options: [
                    ['00', '00'],
                    ['03', '03'],
                    ['06', '06'],
                    ['09', '09'],
                    ['12', '12'],
                    ['15', '15'],
                    ['18', '18'],
                    ['21', '21'],
                ],
                value: '00',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.EXPANSION,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
            if (isPython) {
                param.converter = Entry.block.converters.returnStringOrNumberByValue;
            }
            return param;
        },
    };

    function pad2(n) {
        return n < 10 ? `0${n}` : n;
    }

    return {
        weather_title: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.weather_title_text,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'center',
                },
            ],
            def: {
                type: 'weather_title',
            },
            class: 'weather',
            isNotFor: ['weather'],
            events: {},
        },
        check_city_weather: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                params.getDate(),
                params.getLocation(),
                params.getSubLocation(),
                params.getSky(),
            ],
            events: {},
            def: {
                params: [
                    params.getDate().value,
                    params.getLocation().value,
                    params.getSubLocation().value,
                    params.getSky().value,
                ],
                type: 'check_city_weather',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', 'D&value', null],
                type: 'check_city_weather',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                SUBLOCATION: 2,
                WEATHER: 3,
            },
            class: 'weather',
            isNotFor: ['weather'],
            async func(sprite, script) {
                const location = {
                    parent: script.getField('LOCATION', script),
                    sub: script.getField('SUBLOCATION', script),
                };
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'week',
                    location,
                    script.getField('DATE', script)
                );

                return Entry.EXPANSION_BLOCK.weather.checkWeather(
                    apiResult.sky_code,
                    script.getField('WEATHER', script)
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.is_condition_sunny(%1, %2, %3)',
                        params: [null, null, null, 'sunny'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_partly_cloudy(%1, %2, %3)',
                        params: [null, null, null, 'partly_cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_mostly_cloudy(%1, %2, %3)',
                        params: [null, null, null, 'mostly_cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_cloudy(%1, %2, %3)',
                        params: [null, null, null, 'cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_rainy(%1, %2, %3)',
                        params: [null, null, null, 'rainy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_sleet(%1, %2, %3)',
                        params: [null, null, null, 'sleet'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_condition_snowy(%1, %2, %3)',
                        params: [null, null, null, 'snowy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getSky(true),
                        ],
                    },
                ],
            },
        },
        check_city_finedust: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.getLocation(), params.getSubLocation(), params.getFineDust()],
            events: {},
            def: {
                params: [params.getLocation().value, null, params.getFineDust().value],
                type: 'check_city_finedust',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'check_city_finedust',
            },
            paramsKeyMap: {
                LOCATION: 0,
                SUBLOCATION: 1,
                FINEDUST: 2,
            },
            class: 'weather',
            isNotFor: ['weather'],
            async func(sprite, script) {
                const location = {
                    parent: script.getField('LOCATION', script),
                    sub: script.getField('SUBLOCATION', script),
                };
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'now',
                    location,
                    null
                );
                return Entry.EXPANSION_BLOCK.weather.checkFineDust(
                    apiResult.pm10,
                    script.getField('FINEDUST', script)
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.is_current_finedust_grade_good(%1, %2)',
                        params: [null, null, 'good'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getFineDust(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_current_finedust_grade_normal(%1, %2)',
                        params: [null, null, 'normal'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getFineDust(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_current_finedust_grade_bad(%1, %2)',
                        params: [null, null, 'bad'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getFineDust(true),
                        ],
                    },
                    {
                        syntax: 'Weather.is_current_finedust_grade_very_bad(%1, %2)',
                        params: [, null, null, 'very_bad'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getFineDust(true),
                        ],
                    },
                ],
            },
        },
        get_city_weather_data: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                params.getDate(),
                params.getLocation(),
                params.getSubLocation(),
                params.getWeatherElements(),
            ],
            events: {},
            def: {
                params: [
                    params.getDate().value,
                    params.getLocation().value,
                    null,
                    params.getWeatherElements().value,
                ],
                type: 'get_city_weather_data',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', 'D&value', null],
                type: 'get_city_weather_data',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                SUBLOCATION: 2,
                TYPE: 3,
            },
            class: 'weather',
            isNotFor: ['weather'],
            async func(sprite, script) {
                const location = {
                    parent: script.getField('LOCATION', script),
                    sub: script.getField('SUBLOCATION', script),
                };
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'week',
                    location,
                    script.getField('DATE', script)
                );

                const type =
                    Entry.EXPANSION_BLOCK.weather.propertyMap[script.getField('TYPE', script)];
                return apiResult[type];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_lowest_temperature(%1, %2, %3)',
                        params: [null, null, null, 'the_lowest_temperature'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_highest_temperature(%1, %2, %3)',
                        params: [null, null, null, 'the_highest_temperature'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_humidity(%1, %2, %3)',
                        params: [null, null, null, 'humidity'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_precipitation(%1, %2, %3)',
                        params: [null, null, null, 'precipitation'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_precipitation_probability(%1, %2, %3)',
                        params: [null, null, null, 'precipitation_probability'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_wind_speed(%1, %2, %3)',
                        params: [null, null, null, 'wind_speed'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                ],
            },
        },
        get_current_city_weather_data: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getLocation(), params.getSubLocation(), params.getNowWeatherElement()],
            events: {},
            def: {
                params: [params.getLocation().value, null, params.getNowWeatherElement().value],
                type: 'get_current_city_weather_data',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'get_current_city_weather_data',
            },
            paramsKeyMap: {
                LOCATION: 0,
                SUBLOCATION: 1,
                TYPE: 2,
            },
            class: 'weather',
            isNotFor: ['weather'],
            func(sprite, script) {
                const location = {
                    parent: script.getField('LOCATION', script),
                    sub: script.getField('SUBLOCATION', script),
                };
                const type =
                    Entry.EXPANSION_BLOCK.weather.propertyMap[script.getField('TYPE', script)];

                return new Promise((resolve) => {
                    Entry.EXPANSION_BLOCK.weather
                        .getData('now', location, null)
                        .then((data) => resolve(data[type]));
                });
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_current_finedust(%1, %2)',
                        params: [null, null, 'concentration_of_fine_dust'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getNowWeatherElement(true),
                        ],
                    },
                    {
                        syntax: 'Weather.get_current_temperature(%1, %2)',
                        params: [null, null, 'temperature'],
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getNowWeatherElement(true),
                        ],
                    },
                ],
            },
        },
        get_today_city_temperature: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getLocation(), params.getSubLocation(), params.getTime()],
            events: {},
            def: {
                params: [params.getLocation().value, null, params.getTime().value],
                type: 'get_today_city_temperature',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value', 'C&value'],
                type: 'get_today_city_temperature',
            },
            paramsKeyMap: {
                LOCATION: 0,
                SUBLOCATION: 1,
                TIME: 2,
            },
            class: 'weather',
            isNotFor: ['weather'],
            async func(sprite, script) {
                const location = {
                    parent: script.getField('LOCATION', script),
                    sub: script.getField('SUBLOCATION', script),
                };
                const date = Entry.EXPANSION_BLOCK.weather.date
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');
                let time = script.getField('TIME', script);
                // db에 저장하지 않으면서 00시가 없어져서 03시부터 가능..
                if (time == '00') {
                    time = '03';
                }
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'hour',
                    location,
                    date + pad2(time - (time % 3))
                );

                return apiResult.temp;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_today_temperature(%1, %2, %3)',
                        blockType: 'param',
                        textParams: [
                            params.getLocation(true),
                            params.getSubLocation(true),
                            params.getTime(true),
                        ],
                    },
                ],
            },
        },

        //시군구 추가로 인한 legacy code 기존 블럭유지를 위해 필요.
        check_weather: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.getDate(), params.getLocation(), params.getSky()],
            events: {},
            def: {
                params: [params.getDate().value, params.getLocation().value, params.getSky().value],
                type: 'check_weather',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'check_weather',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                WEATHER: 2,
            },
            class: 'weather_legacy',
            isNotFor: ['weather_legacy'],
            async func(sprite, script) {
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'week',
                    script.getField('LOCATION', script),
                    script.getField('DATE', script)
                );
                return Entry.EXPANSION_BLOCK.weather.checkWeather(
                    apiResult.sky_code,
                    script.getField('WEATHER', script)
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Legacy.Weather.is_condition_sunny(%1, %2)',
                        params: [null, null, 'sunny'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_partly_cloudy(%1, %2)',
                        params: [null, null, 'partly_cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_mostly_cloudy(%1, %2)',
                        params: [null, null, 'mostly_cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_cloudy(%1, %2)',
                        params: [null, null, 'cloudy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_rainy(%1, %2)',
                        params: [null, null, 'rainy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_sleet(%1, %2)',
                        params: [null, null, 'sleet'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.is_condition_snowy(%1, %2)',
                        params: [null, null, 'snowy'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getSky(true),
                        ],
                    },
                ],
            },
        },
        check_finedust: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.getLocation(), params.getFineDust()],
            events: {},
            def: {
                params: [params.getLocation().value, params.getFineDust().value],
                type: 'check_finedust',
            },
            pyHelpDef: {
                params: ['B&value', null],
                type: 'check_finedust',
            },
            paramsKeyMap: {
                LOCATION: 0,
                FINEDUST: 1,
            },
            class: 'weather_legacy',
            isNotFor: ['weather_legacy'],
            async func(sprite, script) {
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'now',
                    script.getField('LOCATION', script),
                    null
                );
                return Entry.EXPANSION_BLOCK.weather.checkFineDust(
                    apiResult.pm10,
                    script.getField('FINEDUST', script)
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Legacy.Weather.is_current_finedust_grade_good(%1)',
                        params: [null, 'good'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getFineDust(true)],
                    },
                    {
                        syntax: 'Legacy.Weather.is_current_finedust_grade_normal(%1)',
                        params: [null, 'normal'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getFineDust(true)],
                    },
                    {
                        syntax: 'Legacy.Weather.is_current_finedust_grade_bad(%1)',
                        params: [null, 'bad'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getFineDust(true)],
                    },
                    {
                        syntax: 'Legacy.Weather.is_current_finedust_grade_very_bad(%1)',
                        params: [, null, 'very_bad'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getFineDust(true)],
                    },
                ],
            },
        },
        get_weather_data: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getDate(), params.getLocation(), params.getWeatherElements()],
            events: {},
            def: {
                params: [
                    params.getDate().value,
                    params.getLocation().value,
                    params.getWeatherElements().value,
                ],
                type: 'get_weather_data',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'get_weather_data',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                TYPE: 2,
            },
            class: 'weather_legacy',
            isNotFor: ['weather_legacy'],
            async func(sprite, script) {
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'week',
                    script.getField('LOCATION', script),
                    script.getField('DATE', script)
                );
                const type =
                    Entry.EXPANSION_BLOCK.weather.propertyMap[script.getField('TYPE', script)];
                return apiResult[type];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Legacy.Weather.get_lowest_temperature(%1, %2)',
                        params: [null, null, 'the_lowest_temperature'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.get_highest_temperature(%1, %2)',
                        params: [null, null, 'the_highest_temperature'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.get_humidity(%1, %2)',
                        params: [null, null, 'humidity'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.get_precipitation(%1, %2)',
                        params: [null, null, 'precipitation'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.get_precipitation_probability(%1, %2)',
                        params: [null, null, 'precipitation_probability'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                    {
                        syntax: 'Legacy.Weather.get_wind_speed(%1, %2)',
                        params: [null, null, 'wind_speed'],
                        blockType: 'param',
                        textParams: [
                            params.getDate(true),
                            params.getLocation(true),
                            params.getWeatherElements(true),
                        ],
                    },
                ],
            },
        },
        get_current_weather_data: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getLocation(), params.getNowWeatherElement()],
            events: {},
            def: {
                params: [params.getLocation().value, params.getNowWeatherElement().value],
                type: 'get_current_weather_data',
            },
            pyHelpDef: {
                params: ['B&value', null],
                type: 'get_current_weather_data',
            },
            paramsKeyMap: {
                LOCATION: 0,
                TYPE: 1,
            },
            class: 'weather_legacy',
            isNotFor: ['weather_legacy'],
            async func(sprite, script) {
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'now',
                    script.getField('LOCATION', script),
                    null
                );
                const type =
                    Entry.EXPANSION_BLOCK.weather.propertyMap[script.getField('TYPE', script)];

                return apiResult[type];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Legacy.Weather.get_current_finedust(%1)',
                        params: [null, 'concentration_of_fine_dust'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getNowWeatherElement(true)],
                    },
                    {
                        syntax: 'Legacy.Weather.get_current_temperature(%1)',
                        params: [null, 'temperature'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getNowWeatherElement(true)],
                    },
                ],
            },
        },
        get_today_temperature: {
            color: EntryStatic.colorSet.block.default.EXPANSION,
            outerLine: EntryStatic.colorSet.block.darken.EXPANSION,
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getLocation(), params.getTime()],
            events: {},
            def: {
                params: [params.getLocation().value, params.getTime().value],
                type: 'get_today_temperature',
            },
            pyHelpDef: {
                params: ['A&value', 'B&value'],
                type: 'get_today_temperature',
            },
            paramsKeyMap: {
                LOCATION: 0,
                TIME: 1,
            },
            class: 'weather_legacy',
            isNotFor: ['weather_legacy'],
            async func(sprite, script) {
                const date = Entry.EXPANSION_BLOCK.weather.date
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, '');
                let time = script.getField('TIME', script);
                // db에 저장하지 않으면서 00시가 없어져서 03시부터 가능..
                if (time == '00') {
                    time = '03';
                }
                const apiResult = await Entry.EXPANSION_BLOCK.weather.getData(
                    'hour',
                    script.getField('LOCATION', script),
                    date + pad2(time - (time % 3))
                );

                return apiResult.temp;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Legacy.Weather.get_today_temperature(%1, %2)',
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getTime(true)],
                    },
                ],
            },
        },
    };
};
