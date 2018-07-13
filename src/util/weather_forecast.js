'use strict';
Entry.EXPANSION_BLOCK.weather = {
    isInitialized : false,
    init: function () {
        if(this.isInitialized) {
            return ;
        }
        $.get("/api/expansionBlock/weather").done(function(data) {
            Entry.EXPANSION_BLOCK.weather.data = data;
            Entry.EXPANSION_BLOCK.weather.isInitialized = true;
        });
    }
};

Entry.EXPANSION_BLOCK.weather.getData = function (locationStr, datetime) {
    return this.data.find(function (d) {return d.aplYmdt == datetime && d.locationStr == locationStr})
};

Entry.EXPANSION_BLOCK.weather.propertyMap ={
    //날짜별
    'the_lowest_temperature' : 'min_temp',
    'the_highest_temperature' : 'max_temp',
    'humidity' : 'humidity',
    'precipitation' : 'rain',
    'precipitation_probability' : 'rain_p',
    'wind_speed' : 'windspd',
    //현재
    'temperature' : 'temp',
    'concentration_of_fine_dust' : 'pm10'
};

Entry.EXPANSION_BLOCK.weather.getDate = function (key) {
    var date = new Date();
    switch (key) {
        case "yesterday":
            date.setDate(date.getDate() - 1);
            break;
        case "today":
            break;
        case "tomorrow":
            date.setDate(date.getDate() + 1);
            break;
        case "After_2_days":
            date.setDate(date.getDate() + 2);
            break;
        case "After_3_days":
            date.setDate(date.getDate() + 3);
            break;
        case "After_4_days":
            date.setDate(date.getDate() + 4);
            break;
        case "After_5_days":
            date.setDate(date.getDate() + 5);
            break;
        case "After_6_days":
            date.setDate(date.getDate() + 6);
            break;
        default:
            break;
    }
    return date.toISOString().slice(0, 10).replace(/-/g, "");
};

Entry.EXPANSION_BLOCK.weather.checkWeather = function (sky_code) {
    const skyCodeMap = {
        "1"  : "sunny", //"맑음",
        "2"  : "partly_cloudy", //"구름조금",
        "3"  : "cloudy", //"흐림",
        "4"  : "rainy", //"비",
        "5"  : "snowy", //"눈",
        "6"  : "sleet", //"눈비",

        "7"  : "rainy", //"소나기",
        "8"  : "snowy", //"소낙눈",
        "9"  : "cloudy", //"안개",
        "10" : "rainy", //"뇌우",
        "11" : "cloudy", //"차차 흐려짐",
        "12" : "rainy", //"흐려져 뇌우",
        "13" : "rainy", //"흐려져 비",
        "14" : "snowy", //"흐려져 눈",
        "15" : "sleet", //"흐려져 눈비",
        "16" : "cloudy", //"흐린 후 갬",
        "17" : "rainy", //"뇌우 후 갬",
        "18" : "rainy", //"비 후 갬",
        "19" : "snowy", //"눈 후 갬",
        "20" : "sleet", //"눈비 후 갬",
        "21" : "mostly_cloudy", //"구름많음",
        "22" : "cloudy"
    }
    if(skyCodeMap[sky_code]) {
        return skyCodeMap[sky_code];
    }else {
        return "sunny";
    }
};

Entry.EXPANSION_BLOCK.weather.checkFineDust = function(pm10) {
    const fineDustMap = {
        "good" : {"min" :0, "max" : 30},
        "normal" : {"min" :31, "max" : 80},
        "bad" : {"min" :81, "max" : 150},
        "very_bad" : {"min" :150, "max" : 9999}
    };

    for(var key in fineDustMap){
        if(fineDustMap[key].min <= pm10 && pm10 <= fineDustMap[key].max) {
            return key;
        }
    }
    return "very_bad";
}


