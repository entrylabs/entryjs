'use strict';

Entry.Robotry_Parodule = {
    id: ['4B.2'],
    name: 'Robotry_Parodule',
    url: 'http://robotry.co.kr',
    imageName: 'arduinoNano.png',
    title: {
        ko: '파로듈',
        en: 'Parodule',
    },

   setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {},
                CMD: {},
                GET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },

    controlTypes: {
        DIGITAL: 0,
        ANALOG: 1,
        STRING: 2,
    },
    BlockState: {},
};

Entry.Robotry_Parodule.setLanguage = function() {
    return {
        ko: {
            template: {
                Parodule_Update: '파로듈 업데이트 %1',
                Parodule_Motor: '%1 번 모터를 %2 방항으로 %3 의 파워로 회전 %4',
                Parodule_LED: '%1 번 LED를 %2 으로 설정 %4',
            },
            Helper:{ // 블록 선택시 나타나는 한글 설명
                Parodule_Update : "파로듈을 업데이트하는 블록",
                Parodule_Motor: '모터를 제어하는 블록'
            },  
            Blocks : {
            }
        },
        en: {
            template: {
                Parodule_Update: 'Parodule Update %1',
                Parodule_Motor: '%1 번 모터를 %2 방항으로 %3 의 파워로 회전 %4',
                Parodule_LED: '%1 번 LED를 %2 으로 설정 %4',
            },
            Helper:{
                Parodule_Update : "파로듈을 업데이트하는 블록",
                Parodule_Motor: '모터를 제어하는 블록'
            }, 
            Blocks : {
            },
        },
    };
};

// 블록의 배치 순서
Entry.Robotry_Parodule.blockMenuBlocks = [
    'Parodule_Update',
    'Parodule_Motor',
    'Parodule_LED',
];

/* 
 *  로보트리의 아두이노 제어 블록 리스트
 *  주석에 블록이라고 표시된것만 제어 블록임 나머진 포트 리스트
 */
Entry.Robotry_Parodule.getBlocks = function() {
    return {
        /* Parodule Upadate Start */
        Parodule_Update: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_Update',
            },
            paramsKeyMap: {},
            class: 'CMD',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const update = "update\r\n";
                if (!Entry.hw.sendQueue.CMD) {
                    Entry.hw.sendQueue.CMD = {};
                }
                Entry.hw.sendQueue.CMD = {
                    type: Entry.Robotry_Parodule.controlTypes.STRING,
                    data: update,
                    time: new Date().getTime(),
                } 
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            }
        },
        /* Parodule Update END */

        /* Paroduel Motor Start */
        Parodule_Motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                    ],
                    value: [1],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['정회전', 0],
                        ['역회전', 34],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', 39],
                        [ '75%', 38],
                        [ '50%', 37],
                        [ '25%', 36],
                    ],
                    value: [39],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_Motor',
            },
            paramsKeyMap: {
                PORT: 0,
                STATE: 1,
                VALUE: 2 
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const state = script.getNumberValue('STATE');
                const value = script.getNumberValue('VALUE');
                if(!Entry.hw.sendQueue.SET){
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: state + value,
                    time: new Date().getTime(),
                } 
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            }
        },
        /* Parodule Motor End */


        /* Paroduel Motor Start */
        Parodule_LED: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                    ],
                    value: [1],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['없음',    238],
                        ['빨강색',   19],
                        ['다홍색',   20],
                        ['주황색',   21],
                        ['귤색',     22],
                        ['노랑색',   23],
                        ['연두색',   24],
                        ['녹색',     25],
                        ['청록색',   26],
                        ['파랑색',   27],
                        ['감청색',   28],
                        ['남색',     29],
                        ['남보라색', 30],
                        ['보라색',   31],
                        ['자주색',   32],
                    ],
                    value: [19],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_LED',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1 
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
                if(!Entry.hw.sendQueue.SET){
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                } 
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            }
        },
        /* Parodule Motor End */
    };
};


module.exports = Entry.Robotry_Parodule;