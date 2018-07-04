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
    function clone(obj) {
        if (obj === null || typeof(obj) !== 'object')
            return obj;

        var copy = obj.constructor();

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    }

    var params = {
        date: {
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
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.get_date_for_weather[0]',
        },
        location: {
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
            codeMap: 'Entry.CodeMap.Entry.choose_city[0]',
        },
        sky: {
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
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.choose_weather[0]',
        },
        fineDust: {
            type: 'Dropdown',
            options: [
                [Lang.Blocks.EXPANSION_WEATHER_finedust_good, 'good'],
                [Lang.Blocks.EXPANSION_WEATHER_finedust_normal, 'normal'],
                [Lang.Blocks.EXPANSION_WEATHER_finedust_bad, 'bad'],
                [Lang.Blocks.EXPANSION_WEATHER_finedust_very_bad, 'very_bad'],
            ],
            value: 'good',
            fontSize: 11,
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.get_finedust_grade[0]',
        },
        weatherElement: {
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
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.get_weather_type[0]',
        },
        nowWeatherElement: {
            type: 'Dropdown',
            options: [
                [Lang.Blocks.EXPANSION_WEATHER_temperature, 'temperature'],
                [Lang.Blocks.EXPANSION_WEATHER_finedust, 'concentration_of_fine_dust'],
            ],
            value: 'temperature',
            fontSize: 11,
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.weather_api_type[0]',
        },
        time: {
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
            arrowColor: EntryStatic.ARROW_COLOR_EXPANSION,
            codeMap: 'Entry.CodeMap.Entry.get_time_for_weahter[0]'
        }
    };
    var pyParams = {};
    Object.keys(params).forEach(function (key) {
        let result = clone(params[key]);
        result.converter = Entry.block.converters.returnStringValue;
        pyParams[key] = result;
    });

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
            params: [params.date, params.location, params.sky],
            events: {},
            def: {
                params: [params.date.value, params.location.value, params.sky.value],
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
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_partly_cloudy(%1, %2)',
                        params: [null, null, 'partly_cloudy'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_mostly_cloudy(%1, %2)',
                        params: [null, null, 'mostly_cloudy'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_cloudy(%1, %2)',
                        params: [null, null, 'cloudy'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_rainy(%1, %2)',
                        params: [null, null, 'rainy'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_sleet(%1, %2)',
                        params: [null, null, 'sleet'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },
                    {
                        syntax: 'Weather.is_condition_snowy(%1, %2)',
                        params: [null, null, 'snowy'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.sky]
                    },

                ],
            },
        },
        check_finedust: {
            color: '#ff8888',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [params.date, params.location, params.fineDust],
            events: {},
            def: {
                params: [params.date.value, params.location.value, params.fineDust.value],
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
                        textParams: [pyParams.date, pyParams.location, pyParams.fineDust]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_normal(%1, %2)',
                        params: [null, null, 'normal'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.fineDust]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_bad(%1, %2)',
                        params: [null, null, 'bad'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.fineDust]
                    },
                    {
                        syntax: 'Weather.is_finedust_grade_very_bad(%1, %2)',
                        params: [null, null, 'very_bad'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.fineDust]
                    },
                ],
            },
        },
        get_weather_data: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.date, params.location, params.weatherElement],
            events: {},
            def: {
                params: [params.date.value, params.location.value, params.weatherElement.value],
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
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                    {
                        syntax: 'Weather.get_highest_temperature(%1, %2)',
                        params: [null, null, 'the_highest_temperature'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                    {
                        syntax: 'Weather.get_humidity(%1, %2)',
                        params: [null, null, 'humidity'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                    {
                        syntax: 'Weather.get_precipitation(%1, %2)',
                        params: [null, null, 'precipitation'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                    {
                        syntax: 'Weather.get_precipitation_probability(%1, %2)',
                        params: [null, null, 'precipitation_probability'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                    {
                        syntax: 'Weather.get_wind_speed(%1, %2)',
                        params: [null, null, 'wind_speed'],
                        blockType: 'param',
                        textParams: [pyParams.date, pyParams.location, pyParams.weatherElement]
                    },
                ],
            },
        },
        get_current_weather_data: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.location, params.nowWeatherElement],
            events: {},
            def: {
                params: [params.location.value, params.nowWeatherElement.value],
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
                        syntax: 'Wether.get_current_finedust(%1)',
                        params: [null, 'concentration_of_fine_dust'],
                        blockType: 'param',
                        textParams: [pyParams.location, pyParams.nowWeatherElement]
                    },
                    {
                        syntax: 'Wether.get_current_temperature(%1)',
                        params: [null, 'temperature'],
                        blockType: 'param',
                        textParams: [pyParams.location, pyParams.nowWeatherElement]
                    },
                ],
            },
        },
        get_today_temperature: {
            color: '#ff8888',
            skeleton: 'basic_string_field',
            statements: [],
            params: [params.location, params.time],
            events: {},
            def: {
                params: [params.location.value, params.time.value],
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
                        textParams: [pyParams.location, pyParams.time]
                    },
                ],
            },
        },
    }
}
