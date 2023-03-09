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
                GET: {},
                SET: {},
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
            },
            Helper:{ // 블록 선택시 나타나는 한글 설명
                Parodule_Update : "파로듈을 업데이트하는 블록"
            },  
            Blocks : {
            }
        },
        en: {
            template: {
                Parodule_Update: 'Parodule Update %1',
            },
            Helper:{
                Parodule_Update : "파로듈을 업데이트하는 블록"
            }, 
            Blocks : {
            },
        },
    };
};

// 블록의 배치 순서
Entry.Robotry_Parodule.blockMenuBlocks = [
    'Parodule_Update',
];

/* 
 *  로보트리의 아두이노 제어 블록 리스트
 *  주석에 블록이라고 표시된것만 제어 블록임 나머진 포트 리스트
 */
Entry.Robotry_Parodule.getBlocks = function() {
    return {
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
            class: 'Set',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const comand = "update\n";
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.Robotry_Parodule.controlTypes.STRING,
                    data: comand,
                    time: new Date().getTime(),
                };
            },
            syntax: {
                js: [],
                py: [],
            }
        }
    };
};


module.exports = Entry.Robotry_Parodule;