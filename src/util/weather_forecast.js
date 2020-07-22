'use strict';

const PromiseManager = require('../core/promiseManager');
const { callApi } = require('../util/common');
const { locationData } = require('../util/location');

Entry.EXPANSION_BLOCK.weather = {
    isInitialized: false,
    api: '/api/expansionBlock/weather/',
    date : new Date(),
    apiFail: {},
    init: function() {
        if (this.isInitialized) {
            return;
        }
        Entry.EXPANSION_BLOCK.weather.date = new Date();
        Entry.EXPANSION_BLOCK.weather.getData("week","Seoul","today");
        Entry.EXPANSION_BLOCK.weather.getData("hour","Seoul","00");
        Entry.EXPANSION_BLOCK.weather.getData("now","Seoul");
        Entry.EXPANSION_BLOCK.weather.isInitialized = true;
    },
    locationMap: {
        Seoul : {
            code : "1100000000",
            sub : {
                "jongno_gu" : "1111000000",
                "jung_gu" : "1114000000",
                "yongsan_gu" : "1117000000",
                "seongdong_gu" : "1120000000",
                "gwangjin_gu" : "1121500000",
                "dongdaemun_gu" : "1123000000",
                "jungnang_gu" : "1126000000",
                "seongbuk_gu" : "1129000000",
                "gangbuk_gu" : "1130500000",
                "dobong_gu" : "1132000000",
                "nowon_gu" : "1135000000",
                "eunpyeong_gu" : "1138000000",
                "seodaemun_gu" : "1141000000",
                "mapo_gu" : "1144000000",
                "yangcheon_gu" : "1147000000",
                "gangseo_gu" : "1150000000",
                "guro_gu" : "1153000000",
                "geumcheon_gu" : "1154500000",
                "yeongdeungpo_gu" : "1156000000",
                "dongjak_gu" : "1159000000",
                "gwanak_gu" : "1162000000",
                "seocho_gu" : "1165000000",
                "gangnam_gu" : "1168000000",
                "songpa_gu" : "1171000000",
                "gangdong_gu" : "1174000000",
            }
        },
        Busan : {
            code : "2600000000",
            sub : {
                "jung_gu" : "2611000000",
                "seo_gu" : "2614000000",
                "dong_gu" : "2617000000",
                "yeongdo_gu" : "2620000000",
                "busanjin_gu" : "2623000000",
                "dongnae_gu" : "2626000000",
                "nam_gu" : "2629000000",
                "buk_gu" : "2632000000",
                "haeundae_gu" : "2635000000",
                "saha_gu" : "2638000000",
                "geumjeong_gu" : "2641000000",
                "gangseo_gu" : "2644000000",
                "yeonje" : "2647000000",
                "suyeong_gu" : "2650000000",
                "sasang_gu" : "2653000000",
                "gijang" : "2671000000",
            }
        },
        Daegu : {
            code : "2700000000",
            sub : {
                "jung_gu" : "2711000000",
                "dong_gu" : "2714000000",
                "seo_gu" : "2717000000",
                "nam_gu" : "2720000000",
                "buk_gu" : "2723000000",
                "suseong_gu" : "2726000000",
                "dalseo_gu" : "2729000000",
                "dalseong" : "2771000000",
            }
        },
        Incheon :{
            code : "2800000000",
            sub : {
                "jung_gu" : "2811000000",
                "dong_gu" : "2814000000",
                "nam_gu" : "2817000000",
                "yeonsu_gu" : "2818500000",
                "namdong_gu" : "2820000000",
                "bupyeong_gu" : "2823700000",
                "gyeyang_gu" : "2824500000",
                "seo_gu" : "2826000000",
                "ganghwa" : "2871000000",
                "ongjin_gun" : "2872000000",
            }
        },
        Gwangju : {
            code : "2900000000",
            sub : {
                "dong_gu" : "2911000000",
                "seo_gu" : "2914000000",
                "nam_gu" : "2915500000",
                "buk_gu" : "2917000000",
                "gwangsan_gu" : "2920000000",
            }
        },
        Daejeon : {
            code : "3000000000",
            sub : {
                "dong_gu" : "3011000000",
                "jung_gu" : "3014000000",
                "western" : "3017000000",
                "yuseong_gu" : "3020000000",
                "daedeok_gu" : "3023000000",
            }
        },
        Ulsan : {
            code : "3100000000",
            sub : {
                "jung_gu" : "3111000000",
                "nam_gu" : "3114000000",
                "dong_gu" : "3117000000",
                "buk_gu" : "3120000000",
                "ulju" : "3171000000",
            }
        },
        Sejong : {
            code : "3600000000",
            sub : {

            }
        },


        "Gyeonggi-do" : {
            code : "4100000000",
            sub : {
                "suwon_si" : "4111000000",
                "seongnam" : "4113000000",
                "uijeongbu" : "4115000000",
                "anyang_si" : "4117000000",
                "bucheon_si" : "4119000000",
                "gwangmyeong_si" : "4121000000",
                "pyeongtaek_si" : "4122000000",
                "dongducheon_si" : "4125000000",
                "ansan_si" : "4127000000",
                "goyang_si" : "4128000000",
                "gwacheon_si" : "4129000000",
                "guri" : "4131000000",
                "namyangju_si" : "4136000000",
                "osan" : "4137000000",
                "siheung" : "4139000000",
                "gunpo_si" : "4141000000",
                "uiwang_si" : "4143000000",
                "hanam" : "4145000000",
                "yongin_si" : "4146000000",
                "paju" : "4148000000",
                "icheon" : "4150000000",
                "anseong_si" : "4155000000",
                "gimpo" : "4157000000",
                "hwaseong_si" : "4159000000",
                "gwangju" : "4161000000",
                "yangju_si" : "4163000000",
                "pocheon" : "4165000000",
                "yeoju" : "4167000000",
                "yeoncheon_gun" : "4180000000",
                "gapyeong_gun" : "4182000000",
                "yangpyeong" : "4183000000",
            }
        },
        "Gangwon" : {
            code : "4200000000",
            sub : {
                "chuncheon" : "4211000000",
                "wonju" : "4213000000",
                "gangneung_si" : "4215000000",
                "donghae" : "4217000000",
                "taebaek_si" : "4219000000",
                "sokcho city" : "4221000000",
                "samcheok_si" : "4223000000",
                "hongcheon" : "4272000000",
                "hoengseong_gun" : "4273000000",
                "yeongwol_gun" : "4275000000",
                "pyeongchang" : "4276000000",
                "jeongseon" : "4277000000",
                "cheolwon" : "4278000000",
                "hwacheon" : "4279000000",
                "yanggu" : "4280000000",
                "inje" : "4281000000",
                "goseong" : "4282000000",
                "yangyang" : "4283000000",
            }
        },
        "Chungcheongbuk-do" : {
            code : "4300000000",
            sub : {
                "cheongju" : "4311000000",
                "chungju" : "4313000000",
                "jecheon" : "4315000000",
                "boeun" : "4372000000",
                "okcheon" : "4373000000",
                "yeongdong" : "4374000000",
                "jeungpyeong" : "4374500000",
                "jincheon" : "4375000000",
                "goesan" : "4376000000",
                "eumseong" : "4377000000",
                "danyang" : "4380000000",
            }
        },
        "Chungcheongnam-do" : {
            code : "4400000000",
            sub : {
                "cheonan" : "4413000000",
                "gongju" : "4415000000",
                "boryeong" : "4418000000",
                "asan" : "4420000000",
                "seosan" : "4421000000",
                "nonsan" : "4423000000",
                "gyeryong" : "4425000000",
                "dangjin" : "4427000000",
                "geumsan" : "4471000000",
                "buyeo" : "4476000000",
                "seocheon" : "4477000000",
                "cheongyang" : "4479000000",
                "hongseong" : "4480000000",
                "yesan" : "4481000000",
                "taean" : "4482500000",
            }
        },



        "Jeollabuk-do" : {
            code : "4500000000",
            sub: {
                "jeonju" : "4511000000",
                "gunsan_si" : "4513000000",
                "iksan" : "4514000000",
                "jeongeup" : "4518000000",
                "namwon" : "4519000000",
                "gimje_si" : "4521000000",
                "wanju" : "4571000000",
                "jinan" : "4572000000",
                "muju" : "4573000000",
                "jangsu" : "4574000000",
                "imsil" : "4575000000",
                "sunchang" : "4577000000",
                "gochang" : "4579000000",
                "buan" : "4580000000",
            }
        },
        "Jeollanam-do" : {
            code : "4600000000",
            sub : {
                "mokpo" : "4611000000",
                "yosu" : "4613000000",
                "suncheon_si" : "4615000000",
                "naju" : "4617000000",
                "gwangyang_si" : "4623000000",
                "damyang" : "4671000000",
                "gokseong" : "4672000000",
                "gurye" : "4673000000",
                "goheung" : "4677000000",
                "boseong" : "4678000000",
                "hwasun" : "4679000000",
                "jangheung" : "4680000000",
                "gangjin" : "4681000000",
                "haenam" : "4682000000",
                "yeongam" : "4683000000",
                "muan" : "4684000000",
                "hampyeong" : "4686000000",
                "yeonggwang" : "4687000000",
                "jangseong" : "4688000000",
                "wando" : "4689000000",
                "jindo" : "4690000000",
                "sinan" : "4691000000",
            }
        },
        "Gyeongsangbuk-do" : {
            code : "4700000000",
            sub : {
                "pohang_si" : "4711000000",
                "gyeongju_si" : "4713000000",
                "gimcheon_si" : "4715000000",
                "andong_si" : "4717000000",
                "gumi_si" : "4719000000",
                "yeongju_si" : "4721000000",
                "yeongcheon_si" : "4723000000",
                "sangju_si" : "4725000000",
                "mungyeong_si" : "4728000000",
                "gyeongsan_si" : "4729000000",
                "gunwi" : "4772000000",
                "uiseong" : "4773000000",
                "cheongsong" : "4775000000",
                "goryong" : "4776000000",
                "yeongdeok" : "4777000000",
                "cheongdo" : "4782000000",
                "golyeong" : "4783000000",
                "seongju" : "4784000000",
                "chilgok" : "4785000000",
                "yecheon" : "4790000000",
                "bonghwa" : "4792000000",
                "uljin" : "4793000000",
                "ulleung" : "4794000000",
            }
        },
        "Gyeongsangnam-do" : {
            code : "4800000000",
            sub : {
                "changwon_si" : "4811000000",
                "jinju" : "4817000000",
                "tongyeong_si" : "4822000000",
                "sacheon_si" : "4824000000",
                "gimhae_si" : "4825000000",
                "miryang_si" : "4827000000",
                "geoje_si" : "4831000000",
                "yangsan_si" : "4833000000",
                "uiryeong" : "4872000000",
                "haman" : "4873000000",
                "changnyeong" : "4874000000",
                "goseong" : "4882000000",
                "namhae" : "4884000000",
                "hadong" : "4885000000",
                "sancheong" : "4886000000",
                "hamyang" : "4887000000",
                "geochang" : "4888000000",
                "hapcheon" : "4889000000",
            }
        },
        "Jeju" : {
            code : "5000000000",
            sub : {
                "jeju_si" : "5011000000",
                "seogwipo" : "5013000000"
            }
        },
    },
    propertyMap: {
        //날짜별
        'the_lowest_temperature': 'min_temp',
        'the_highest_temperature': 'max_temp',
        'humidity': 'humidity',
        'precipitation': 'rain',
        'precipitation_probability': 'rain_p',
        'wind_speed': 'windspd',
        //현재
        'temperature': 'temp',
        'concentration_of_fine_dust': 'pm10',
    },
    //api 조회 실패시 노출될 값.
    defaultData: {
        //week
        //aplYmd: 20180905,
        max_temp: 0,
        min_temp: 0,
        sky: '구름조금',
        sky_code: '2',
        winddir: 'W',
        windspd: 0,
        rain: 0,
        rain_p: 0,
        humidity: 0,
        locationCode: '1100000000',
        updated: '2018-09-05T03:27:42.804Z',
        //hour
        //aplYmdt: "2018090500",
        rainAmt: 0,
        temp: 0,
        //now
        pm10: 0,
        pm10_s: '좋음',
    },
};

function resolveData(weatherData, type, dateStr) {
    if (type === 'now') {
        return weatherData[Object.keys(weatherData)[0]];
    } else if (type === 'hour') {
        return weatherData[dateStr];
    } else {
        return weatherData[Entry.EXPANSION_BLOCK.weather.getDate(dateStr)];
    }
}

Entry.EXPANSION_BLOCK.weather.getData = function(type, location, dateStr) {
    let cityCode = null;
    if (typeof location === 'string') {
        cityCode = this.locationMap[location].code;
    } else {
        if (location.sub == locationData.initialData[1]) {
            cityCode = this.locationMap[location.parent].code;
        } else {
            cityCode = this.locationMap[location.parent].sub[location.sub];
        }
    }

    const url = this.api + type;
    return new PromiseManager().Promise(function(resolve) {
            callApi(url, { url })
                .then((response) => {
                    Entry.EXPANSION_BLOCK.weather.apiFail[type] = false;
                    resolve(resolveData(response.data[cityCode], type, dateStr));
                })
                .catch((error) => {
                    Entry.EXPANSION_BLOCK.weather.apiFail[type] = { error };
                    resolve(Entry.EXPANSION_BLOCK.weather.defaultData);
                });
        })
        .catch(() => Entry.EXPANSION_BLOCK.weather.defaultData);
};

Entry.EXPANSION_BLOCK.weather.getDate = function(key) {
    Entry.EXPANSION_BLOCK.weather.date = Entry.EXPANSION_BLOCK.weather.date || new Date();
    const date = new Date(Entry.EXPANSION_BLOCK.weather.date);
    switch (key) {
        case 'yesterday':
            date.setDate(date.getDate() - 1);
            break;
        case 'today':
            break;
        case 'tomorrow':
            date.setDate(date.getDate() + 1);
            break;
        case 'After_2_days':
            date.setDate(date.getDate() + 2);
            break;
        case 'After_3_days':
            date.setDate(date.getDate() + 3);
            break;
        case 'After_4_days':
            date.setDate(date.getDate() + 4);
            break;
        case 'After_5_days':
            date.setDate(date.getDate() + 5);
            break;
        case 'After_6_days':
            date.setDate(date.getDate() + 6);
            break;
        default:
            break;
    }
    return date.toISOString().slice(0, 10).replace(/-/g, '');
};

Entry.EXPANSION_BLOCK.weather.checkWeather = function(sky_code, weather) {
    if (Entry.EXPANSION_BLOCK.weather.apiFail.week) {
        return true;
    }

    const skyCodeMap = {
        '1': 'sunny', //"맑음",
        '2': 'partly_cloudy', //"구름조금",
        '3': 'cloudy', //"흐림",
        '4': 'rainy', //"비",
        '5': 'snowy', //"눈",
        '6': 'sleet', //"눈비",

        '7': 'rainy', //"소나기",
        '8': 'snowy', //"소낙눈",
        '9': 'cloudy', //"안개",
        '10': 'rainy', //"뇌우",
        '11': 'cloudy', //"차차 흐려짐",
        '12': 'rainy', //"흐려져 뇌우",
        '13': 'rainy', //"흐려져 비",
        '14': 'snowy', //"흐려져 눈",
        '15': 'sleet', //"흐려져 눈비",
        '16': 'cloudy', //"흐린 후 갬",
        '17': 'rainy', //"뇌우 후 갬",
        '18': 'rainy', //"비 후 갬",
        '19': 'snowy', //"눈 후 갬",
        '20': 'sleet', //"눈비 후 갬",
        '21': 'mostly_cloudy', //"구름많음",
        '22': 'cloudy',
    };

    if (skyCodeMap[sky_code]) {
        return skyCodeMap[sky_code] === weather;
    } else {
        return 'sunny' === weather;
    }
};

Entry.EXPANSION_BLOCK.weather.checkFineDust = function(pm10, finedust) {
    if (Entry.EXPANSION_BLOCK.weather.apiFail.now) {
        return true;
    }

    const fineDustMap = {
        'good': { 'min': 0, 'max': 30 },
        'normal': { 'min': 31, 'max': 80 },
        'bad': { 'min': 81, 'max': 150 },
        'very_bad': { 'min': 150, 'max': 9999 },
    };

    for (let key in fineDustMap) {
        if (fineDustMap[key].min <= pm10 && pm10 <= fineDustMap[key].max) {
            return key === finedust;
        }
    }
    return 'very_bad' === finedust;
};



