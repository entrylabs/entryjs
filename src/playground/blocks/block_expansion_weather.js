'use strict';


Entry.Expansion_Weather = {
    name: 'weather',
    imageName: 'arduino.png',
    title: {
        "ko": "날씨",
        "en": "weather"
    },
};

Entry.Expansion_Weather.getBlocks = function () {
    let params = {
        getDate : function(isPython) {
            let param = {
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
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getLocation: function(isPython) {
            let param =  {
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
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getSky: function(isPython) {
            let param =  {
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
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getFineDust: function(isPython) {
            let param =  {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_good, 'good'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_normal, 'normal'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_bad, 'bad'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust_very_bad, 'very_bad'],
                ],
                value: 'good',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getWeatherElements: function(isPython) {
            let param =  {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_lowest_temperature, 'the_lowest_temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_highest_temperature, 'the_highest_temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_humidity, 'humidity'],
                    [Lang.Blocks.EXPANSION_WEATHER_precipitation, 'precipitation'],
                    [Lang.Blocks.EXPANSION_WEATHER_precipitation_probability, 'precipitation_probability'],
                    [Lang.Blocks.EXPANSION_WEATHER_wind_speed, 'wind_speed'],
                ],
                value: 'the_lowest_temperature',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getNowWeatherElement: function(isPython) {
            let param =  {
                type: 'Dropdown',
                options: [
                    [Lang.Blocks.EXPANSION_WEATHER_temperature, 'temperature'],
                    [Lang.Blocks.EXPANSION_WEATHER_finedust, 'concentration_of_fine_dust'],
                ],
                value: 'temperature',
                fontSize: 11,
                arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
            };
            if(isPython) {
                param.converter = Entry.block.converters.returnStringValue;
            }
            return param;
        },
        getTime: function(isPython) {
            let param =   {
                    type: 'Dropdown',
                    options: [
                        ["00", "00"],
                        ["03", "03"],
                        ["06", "06"],
                        ["09", "09"],
                        ["12", "12"],
                        ["15", "15"],
                        ["18", "18"],
                        ["21", "21"],
                    ],
                        value: "00",
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_EXPANSION
                    }
            if(isPython) {
                param.converter = Entry.block.converters.returnStringOrNumberByValue;
            }
            return param;
        }
    };

    return {
        weather_title: {
            skeleton: 'basic_text',
            color: '#e5e5e5',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.weather_title_text,
                    color: '#333',
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
        check_weather: {
            color: '#ff8888',
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
                WEATHER: 2
            },
            class: 'weather',
            isNotFor: ['weather'],
            func: function (sprite, script) {
                var date = Entry.EXPANSION_BLOCK.weather.getDate(script.getField('DATE', script));
                var location = script.getField('LOCATION', script);
                var weather = script.getField('WEATHER', script);
                var apiResult = Entry.EXPANSION_BLOCK.weather.getData(location, "date", date, 0);

                return Entry.EXPANSION_BLOCK.weather.checkWeather(apiResult.data.sky_code) == weather;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.is_condition_sunny(%1, %2)',
                        params: [null, null, 'sunny'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_partly_cloudy(%1, %2)',
                        params: [null, null, 'partly_cloudy'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_mostly_cloudy(%1, %2)',
                        params: [null, null, 'mostly_cloudy'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_cloudy(%1, %2)',
                        params: [null, null, 'cloudy'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_rainy(%1, %2)',
                        params: [null, null, 'rainy'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_sleet(%1, %2)',
                        params: [null, null, 'sleet'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },
                    {
                        syntax: 'Weather.is_condition_snowy(%1, %2)',
                        params: [null, null, 'snowy'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getSky(true)]
                    },

                ],
            },
        },
        check_finedust: {
            color: '#ff8888',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.getDate(), params.getLocation(), params.getFineDust()],
            events: {},
            def: {
                params: [params.getDate().value, params.getLocation().value, params.getFineDust().value],
                type: 'check_finedust',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'check_finedust',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                FINEDUST: 2
            },
            class: 'weather',
            isNotFor: ['weather'],
            func: function (sprite, script) {
                var date = Entry.EXPANSION_BLOCK.weather.getDate(script.getField('DATE', script));
                var location = script.getField('LOCATION', script);
                var finedust = script.getField('FINEDUST', script);

                var apiResult = Entry.EXPANSION_BLOCK.weather.getData(location, "date", date, "0000");

                return Math.round(apiResult.data["pm10Grade"]) == finedust;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.is_finedust_grade_good(%1, %2)',
                        params: [null, null, 'good'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getFineDust(true)]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_normal(%1, %2)',
                        params: [null, null, 'normal'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getFineDust(true)]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_bad(%1, %2)',
                        params: [null, null, 'bad'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getFineDust(true)]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_very_bad(%1, %2)',
                        params: [null, null, 'very_bad'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getFineDust(true)]
                    },
                ],
            },
        },
        get_weather_data: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.getDate(), params.getLocation(), params.getWeatherElements()],
            events: {},
            def: {
                params: [params.getDate().value, params.getLocation().value, params.getWeatherElements().value],
                type: 'get_weather_data',
            },
            pyHelpDef: {
                params: ['B&value', 'C&value', null],
                type: 'get_weather_data',
            },
            paramsKeyMap: {
                DATE: 0,
                LOCATION: 1,
                TYPE: 2
            },
            class: 'weather',
            isNotFor: ['weather'],
            func: function (sprite, script) {
                var date = Entry.EXPANSION_BLOCK.weather.getDate(script.getField('DATE', script));
                var location = script.getField('LOCATION', script);
                var type = script.getField('TYPE', script);
                var apiResult = Entry.EXPANSION_BLOCK.weather.getData(location, "date", date, "0000");

                return apiResult.data[type];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_lowest_temperature(%1, %2)',
                        params: [null, null, 'the_lowest_temperature'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                    {
                        syntax: 'Weather.get_highest_temperature(%1, %2)',
                        params: [null, null, 'the_highest_temperature'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                    {
                        syntax: 'Weather.get_humidity(%1, %2)',
                        params: [null, null, 'humidity'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                    {
                        syntax: 'Weather.get_precipitation(%1, %2)',
                        params: [null, null, 'precipitation'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                    {
                        syntax: 'Weather.get_precipitation_probability(%1, %2)',
                        params: [null, null, 'precipitation_probability'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                    {
                        syntax: 'Weather.get_wind_speed(%1, %2)',
                        params: [null, null, 'wind_speed'],
                        blockType: 'param',
                        textParams: [params.getDate(true), params.getLocation(true), params.getWeatherElements(true)]
                    },
                ],
            },
        },
        get_current_weather_data: {
            color: '#ff8888',
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
                TYPE: 1
            },
            class: 'weather',
            isNotFor: ['weather'],
            func: function (sprite, script) {
                var now = new Date();
                var location = script.getField('LOCATION', script);
                var type = script.getField('TYPE', script);
                var date = now.toISOString().slice(0, 10).replace(/-/g, "");
                var time = now.getHours();  // [0, 3, 6, 9, 12, 15, 18, 21]
                time = time - time%3;
                var apiResult = Entry.EXPANSION_BLOCK.weather.getData(location, "time", date, time);
                return apiResult.data[type];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_current_finedust(%1)',
                        params: [null, 'concentration_of_fine_dust'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getNowWeatherElement(true)]
                    },
                    {
                        syntax: 'Weather.get_current_temperature(%1)',
                        params: [null, 'temperature'],
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getNowWeatherElement(true)]
                    },
                ],
            },
        },
        get_today_temperature: {
            color: '#ff8888',
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
                TIME: 1
            },
            class: 'weather',
            isNotFor: ['weather'],
            func: function (sprite, script) {
                var location = script.getField('LOCATION', script);
                var time = script.getField('TIME', script);
                var date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
                var apiResult = Entry.EXPANSION_BLOCK.weather.getData(location, "time", date, time);
                return apiResult.data.temperature;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Weather.get_today_temperaturet(%1, %2)',
                        blockType: 'param',
                        textParams: [params.getLocation(true), params.getTime(true)]
                    },
                ],
            },
        },
    }
}
