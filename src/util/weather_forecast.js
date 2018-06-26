'use strict';

Entry.WeatherForecast = {};

Entry.WeatherForecast.locationMap = {
    "SEOUL" : {
        x : 60,
        y : 127
    },
    "BUSAN" : {
        x : 98,
        y : 76
    },
    "DAEGU" : {
        x : 89,
        y : 90
    },
    "INCHEON" : {
        x : 55,
        y : 124
    },
    "GWANGJU" : {
        x : 58,
        y: 74
    },
    "DAEJEON" : {
        x : 67,
        y : 100
    },
    "ULSAN" : {
        x : 102,
        y : 84
    },
    "SEJONG" : {
        x : 66,
        y : 103
    },
    "GYEONGGI" : {
        x : 60,
        y : 120
    },
    "GANGWON" : {
        x : 73,
        y : 134
    },
    "CHUNGCHEONGBUK" : {
        x : 69,
        y : 107
    },
    "CHUNGCHEONGNAM": {
        x : 68,
        y : 100
    },
    "JEOLLABUK" : {
        x : 63,
        y : 89
    },
    "JEOLLANAM" : {
        x : 51,
        y : 67
    },
    "GYEONGSANGBUK" : {
        x : 89,
        y : 91
    },
    "GYEONGSANGNAM" : {
        x : 91,
        y : 77
    },
    "JEJU" : {
        x : 52,
        y : 38
    }
};

Entry.WeatherForecast.getLocation = function(key) {
    return Entry.WeatherForecast.locationMap[key];
};

Entry.WeatherForecast.getLocationStr = function(x, y) {
    const locationMap = Entry.WeatherForecast.locationMap;
    for(var location in locationMap) {
        var loc = locationMap[location];
        if(loc.x == x && loc.y == y){
            return location;
        }
    }
    return "NONE";
};

Entry.WeatherForecast.getDate = function(key) {
    var date = new Date();
    switch(key) {
        case "YESTERDAY":
            date.setDate(date.getDate() - 1);
            break;
        case "TODAY":
            break;
        case "TOMORROW":
            date.setDate(date.getDate() + 1);
            break;
        case "AFTER2DAYS":
            date.setDate(date.getDate() + 2);
            break;
        case "AFTER3DAYS":
            date.setDate(date.getDate() + 3);
            break;
        case "AFTER4DAYS":
            date.setDate(date.getDate() + 4);
            break;
        case "AFTER5DAYS":
            date.setDate(date.getDate() + 5);
            break;
        case "AFTER6DAYS":
            date.setDate(date.getDate() + 6);
            break;
        default:
            break;
    }
    return date.toISOString().slice(0,10).replace(/-/g,"");
};

Entry.WeatherForecast.checkWeather = function(pty, sky) {
    const ptyMap = {
        0 : "NONE",
        1 : "RAINY",
        2 : "SLEET",
        3 : "SNOWY"
    };
    const skyMap = {
        1 : "SUNNY",
        2 : "PARTLY_CLOUDY",
        3 : "MOSTLY_CLOUDY"
    };

    if(pty === 0) {
        return skyMap[sky];
    }else{
        return ptyMap[pty];
    }
}


Entry.WeatherForecast.mockData = function(base_date, base_time, nx, ny) {
    //일단위 (오늘) 같은 경우는 어떻게 시간을 날리는가
    //초 단기 실황조회는 바로 가능 , 동네예보조회는 크론잡 필요. (어제 데이터까지만 조회가능해서 무조건 크론으로 돌려서 데이터 저장하고 있어야 할 듯 )

    //동네예보조회 샘플 데이터
    //http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?serviceKey=V2wEzEDVqGxHEd4TBl12v0PgnG5LaZ98yt%2BCxBuUCLrJqzQQbRuqP3i3oBn4sU%2FlSGvZ59rGZop4Xl5v04VJHg%3D%3D&base_date=20180621&base_time=0200&nx=60&ny=127&numOfRows=30&pageSize=30&pageNo=1&startPage=1&_type=json
    const sampleData = {
        response: {
            header: {
                resultCode: "0000",
                resultMsg: "OK"
            },
            body: {
                items: {
                    item: [
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "POP",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 10,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "PTY",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "R06",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "REH",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 80,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "S06",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "SKY",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 2,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "T3H",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 20,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "TMN",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 18,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "UUU",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 1.5,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "VEC",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 231,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "VVV",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 1.2,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "WSD",
                            fcstDate: 20180621,
                            fcstTime: "0600",
                            fcstValue: 1.9,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "POP",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "PTY",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "REH",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 65,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "SKY",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 1,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "T3H",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 22,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "UUU",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 1.6,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "VEC",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 248,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "VVV",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 0.6,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "WSD",
                            fcstDate: 20180621,
                            fcstTime: "0900",
                            fcstValue: 1.7,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "POP",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "PTY",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "R06",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "REH",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 50,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "S06",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 0,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "SKY",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 1,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "T3H",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 26,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "UUU",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 2.6,
                            nx: 60,
                            ny: 127
                        },
                        {
                            baseDate: 20180621,
                            baseTime: "0200",
                            category: "VEC",
                            fcstDate: 20180621,
                            fcstTime: 1200,
                            fcstValue: 292,
                            nx: 60,
                            ny: 127
                        }
                    ]
                },
                numOfRows: 30,
                pageNo: 1,
                totalCount: 155
            }
        }
    };
    //미세먼지 시도별 실시간 측정종보 조회시 아래와 같이나옴.. 값들의 평균일지 어느 특정 위치일지 확인 필요 여기서는 임시로 2로 정하고 테스트
/*
{
   "fields":[
        ...

      {
         "id":"pm10Grade1h"
      },
      {
         "id":"pm25Grade1h"
      }
   ],
   "records":[
      {
         "so2Grade":"1",
         "pm25Grade1h":"2",
         "pm10Value24":"31",
         "khaiValue":"80",
         "so2Value":"0.003",
         "coValue":"0.3",
         "pm10Grade1h":"1",
         "o3Grade":"2",
         "pm10Value":"29",
         "khaiGrade":"2",
         "pm25Value":"20",
         "no2Grade":"1",
         "pm25Value24":"19",
         "pm25Grade":"2",
         "mangName":"도시대기",
         "coGrade":"1",
         "dataTime":"2018-06-21 17:00",
         "stationName":"중구",
         "no2Value":"0.013",
         "pm10Grade":"2",
         "o3Value":"0.066"
      },
 */
    var pm10Grade = 2;

    sampleData.response.body.items.item.push({
        baseDate: 20180621,
        baseTime: "0200",
        category: "pm10Grade",
        fcstDate: 20180621,
        fcstTime: 1200,
        fcstValue: 2,
        nx: 60,
        ny: 127
    });

    sampleData.response.body.items.item.push({
        baseDate: 20180621,
        baseTime: "0200",
        category: "pm10Value",
        fcstDate: 20180621,
        fcstTime: 1200,
        fcstValue: 29,
        nx: 60,
        ny: 127
    });

    sampleData.response.body.items.item.push({
        baseDate: 20180621,
        baseTime: "0200",
        category: "pm10Grade",
        fcstDate: 20180621,
        fcstTime: "0600",
        fcstValue: 2,
        nx: 60,
        ny: 127
    });

    sampleData.response.body.items.item.push({
        baseDate: 20180621,
        baseTime: "0200",
        category: "pm10Value",
        fcstDate: 20180621,
        fcstTime: "0600",
        fcstValue: 29,
        nx: 60,
        ny: 127
    });

    //우리동네 예보일 경우 데이터 변환 필요. db에 넣는 예상 데이터 셋
    /* {
        date: "20180620",
        time: "0000",
        locationStr: "SEOUL",
        location: {
            x: 60,
            y: 127,
        },
        data: {
            "POP": 10,
            "PTY": 0,
            "R06": 0,
            "REH": 55,
            "S06": 0,
            "SKY": 2,
            "T3H": 26,
            "UUU": 3.6,
            "VEC": 245,
            "VVV": 1.7
        }
    };
    */

    var data = sampleData.response.body.items.item.map((x) => {
        let data = {};
        data[x.category] = x.fcstValue;
        return {
            "date" : String(x.fcstDate),
            "time" : String(x.fcstTime),
            "location" : {
                "x" : x.nx,
                "y" : x.ny
            },
            "locationStr" : Entry.WeatherForecast.getLocationStr(x.nx, x.ny),
            "data" : data
        }

    }).reduce(function(accumulator, value) {
        for(var i in accumulator) {
            if(accumulator[i].date == value.date && accumulator[i].time == value.time && accumulator[i].location.x == value.location.x && accumulator[i].location.y == value.location.y){
                accumulator[i].data = Object.assign({}, accumulator[i].data, value.data);
                return accumulator;
            }
        }
        accumulator.push(value);
        return accumulator;
    }, []);

    return data[0];
}