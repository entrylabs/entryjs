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

Entry.EXPANSION_BLOCK.weather.getData = function (locationStr, type, date, time) {
    if (type === "time") {
        return this.data.find(function (d) {return d.date == date && d.time == time && d.locationStr == locationStr})
    }

    return this.data.filter(function (d) { return d.date == date && d.locationStr == locationStr})
                .reduce(function (prev, next, index, array) {
                    let data = {};
                    let nowIndex = index + 1;

                    Object.keys(prev.data).map(function (key) {
                        data[key] = prev.data[key] + next.data[key];
                    });

                    if(nowIndex == array.length){
                        Object.keys(prev.data).map(function (key) {
                            data[key] = data[key]/array.length;
                        });
                    }

                    return {
                        date: prev.date,
                        locationStr: prev.locationStr,
                        location: prev.location,
                        data: data
                    }
                });
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
    //sky_code에 따라 날씨 분기
    return "sunny";
};


