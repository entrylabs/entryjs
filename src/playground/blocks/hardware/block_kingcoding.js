'use strict';

Entry.Kingcoding = {
    id: 'FF.FE',
    name: 'kingcoding',
    url: 'http://www.kingkongedu.co.kr/',
    imageName: 'kingcoding_line.png',
    title: {
        ko: '킹코딩(유선연결)',
        en: 'Kingcoding(Line)',
    },
    setZero: function() {
        //정지시 초기화 부분  
      Entry.hw.sendQueue.PORT[0] = 40; //모두정지
      //  Entry.hw.setDigitalPortValue(0, 40); //port:0
        Entry.hw.update(); 
//        Entry.hw.sendQueue.readablePorts = [];
//        for (var port = 0; port < 20; port++) {
//            Entry.hw.sendQueue[port] = 0;
//            Entry.hw.sendQueue.readablePorts.push(port);
//        }
//        Entry.hw.update();
    },
};

Entry.Kingcoding.setLanguage = function() {
    return {
        ko: {
            template: {
                kingcoding_set_motor: '킹코딩 모터 제어 %1 %2',
                kingcoding_set_led: '킹코딩 LED 제어 %1 %2',
                kingcoding_set_buzzer: '킹코딩 버저 제어 %1 %2',
            },
        },
        en: {
            template: {
                kingcoding_set_motor: 'Motor Control',
                kingcoding_set_led: 'LED Control',
                kingcoding_set_buzzer: 'Buzzer Control',
            },
        },
    };
};


Entry.Kingcoding.blockMenuBlocks = [
    'kingcoding_set_motor',
    'kingcoding_set_led',
    'kingcoding_set_buzzer',
];


Entry.Kingcoding.getBlocks = function() {
    return {
        kingcoding_set_motor:{ //블록이름
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [ //입력 파라미터 속성정의
                {
                    type: 'Dropdown',
                    options: [['1번 정회전', '1'],
                              ['1번 역회전', '2'],
                              ['1번 정지', '3'],
                              ['2번 정회전', '4'], 
                              ['2번 역회전', '5'],
                              ['2번 정지', '6'], 
                              ['1,2번 정회전', '7'], 
                              ['1,2번 역회전', '8'],
                              ['1번 정회전, 2번 역회전', '34'], 
                              ['1번 역회전, 2번 정회전', '35'],
                              ['모든 모터 정지', '36']],
                    value: '1',
                    
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator', 
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: { //파라미터에 들어갈 기본 값.
                params: [null, null],
                type: 'kingcoding_set_motor', //상속, 블록명과 동일
            },
            paramsKeyMap: { // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                PORT: 0,
            },
            class: 'Kingcoding',
           // isNotFor: ['Kingcoding'],
            func: function(sprite, script) {
                var value = script.getNumberField('PORT', script);
                Entry.hw.setDigitalPortValue(0, value); //port:0
                return script.callReturn();
            },
            syntax: { js: [], py: ['Kingcoding.set_motor(%1)'] },
        },
        
         kingcoding_set_led:{ //블록이름
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [ //입력 파라미터 속성정의
                {
                    type: 'Dropdown',
                    options: [['적색 LED 켜기', '15'], 
                    ['청색 LED 켜기', '16'], 
                    ['녹색 LED 켜기', '17'], 
                    ['주황색 LED 켜기', '18'], 
                    ['보라색 LED 켜기', '19'], 
                    ['하늘색 LED 켜기', '20'], 
                    ['백색 LED 켜기', '12'], 
                    ['LED 끄기', '22']],
                    value: '15',               
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator', 
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: { //파라미터에 들어갈 기본 값.
                params: [null, null],
                type: 'kingcoding_set_led', //상속, 블록명과 동일
            },
            paramsKeyMap: { // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                PORT: 0,
            },
            class: 'Kingcoding',
            //isNotFor: ['Kingcoding'],
            func: function(sprite, script) {
                var value = script.getNumberField('PORT', script);
                Entry.hw.setDigitalPortValue(0, value); //port:0
                return script.callReturn();
            },
            syntax: { js: [], py: ['Kingcoding.set_led(%1)'] },
        },
        
         kingcoding_set_buzzer:{ //블록이름
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [ //입력 파라미터 속성정의
                {
                    type: 'Dropdown',
                    options: [['낮은음', '37'], ['중간음', '38'], ['높은음', '39'], ['버저 끄기', '23']],
                    value: '37',
                    
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator', 
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: { //파라미터에 들어갈 기본 값.
                params: [null, null],
                type: 'kingcoding_set_buzzer', //상속, 블록명과 동일
            },
            paramsKeyMap: { // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                PORT: 0,
            },
            class: 'Kingcoding',
            //isNotFor: ['Kingcoding'],
            func: function(sprite, script) {
                var value = script.getNumberField('PORT', script);
                Entry.hw.setDigitalPortValue(0, value); //port:0
                return script.callReturn();
              },
            syntax: { js: [], py: ['Kingcoding.set_buzzer(%1)'] },
        },
    };
};

module.exports = Entry.Kingcoding;
