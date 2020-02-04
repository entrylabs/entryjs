'use strict';

/**
 * static.js 의 default colorSet 과 동일합니다.
 * 정확한 기획스펙이 없는 상태에서 page reload 없이 ws 만 재로딩 하는 경우
 * 다른 theme -> 초기 theme 로 돌아갈때 필요할 수 있어서 만들어둔 테마입니다.
 */
module.exports = {
    arrow: {
        default: {
            DEFAULT: '#FFFFFF',
            START: '#FFFFFF',
            FLOW: '#3A71BC',
            MOVING: '#8641B6',
            LOOKS: '#D8234E',
            TEXT: '#DC9C32',
            SOUND: '#83A617',
            JUDGE: '#89A1F7',
            CALC: '#E8B349',
            VARIABLE: '#CE38CE',
            HARDWARE: '#097E84',
            EXPANSION: '#FF8888',
        },
    },
    block: {
        default: {
            START: '#10D35E',
            FLOW: '#31C1EC',
            MOVING: '#BF63FF',
            LOOKS: '#FF5174',
            BRUSH: '#FC7E01',
            SOUND: '#82D214',
            HARDWARE: '#00CFCA',
            CALC: '#FEB71A',
            VARIABLE: '#F57DF1',
            FUNC: '#DE6E22',
            JUDGE: '#7E8EFE',
            TEXT: '#FC5D01',
            EXPANSION: '#FF8888',
        },
        lighten: {
            //NOTE not have boolean, extension block color
            START: '#53E68E',
            FLOW: '#4ADAFB',
            MOVING: '#CA7DFF',
            LOOKS: '#FF7792',
            BRUSH: '#FF9831',
            SOUND: '#9FEC35',
            HARDWARE: '#65E3E0',
            CALC: '#FFDE82',
            VARIABLE: '#FAA0F7',
            FUNC: '#F3853B',
            TEXT: '#FF9354',
        },
        darken: {
            START: '#13BF68',
            FLOW: '#08ACDD',
            MOVING: '#B13EFE',
            LOOKS: '#EE3157',
            BRUSH: '#FC5E01',
            SOUND: '#6EBC02',
            HARDWARE: '#04B5B0',
            CALC: '#FF9C00',
            VARIABLE: '#EC52E7',
            FUNC: '#C85404',
            JUDGE: '#1B3AD8',
            TEXT: '#E43500',
            EXPANSION: '#EF6D6D',
        },
        emphasize: {
            '#10D35E': '#5BC982',
            '#31C1EC': '#62A5F4',
            '#BF63FF': '#C08FF7',
            '#FF5174': '#F46487',
            '#FC7E01': '#FFB05A',
            '#82D214': '#C4DD31',
            '#00CFCA': '#09BAB5',
            '#FEB71A': '#FCDA90',
            '#F57DF1': '#F279F2',
            '#DE6E22': '#DD884E',
            '#7E8EFE': '#C0CBFF',
            '#FC5D01': '#F2C670',
        },
    },
    common: {
        WHITE: '#FFFFFF',
        DARK: '#000000'
    }
};