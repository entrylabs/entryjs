'use strict';

const _set = require('lodash/set');
const _get = require('lodash/get');
const _merge = require('lodash/merge');

Entry.Armz = new class Armz {
    constructor() {
//        this.id = 'FF.FF'; 
        this.id = '2C.1';       
        this.url = 'http://www.myarmz.com';
        this.imageName = 'armz.png';
		    this.title = {
		        ko: '암즈', 
		        en: 'armz',
		    }; 
        this.name = 'armz'; 
        this.timeouts = [];
    }

    getHashKey() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16); 
        }
        return Entry.generateHash() + key;
    }

    setZero() {
        Entry.hw.sendQueue = {
            [this.getHashKey()]: {
                type: 'RST',
            },
        };
        Entry.hw.update();
    }

    sendMessage({ socket, sendQueue = {} }) {
        if (!_.isEmpty(sendQueue)) {
            const keys = Object.keys(sendQueue);
            const uniqueKey = this.getHashKey();
            socket.emit(
                'message',
                {
                    data: JSON.stringify(sendQueue),
                    mode: socket.mode,
                    type: 'utf8',
                    key: uniqueKey,
                },
                (data) => {
                    if (data === uniqueKey) {
                        keys.forEach((key) => {
                            delete sendQueue[key];
                        });
                    }
                }
            );
        }
    }

    removeTimeout(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    }
    
    removeAllTimeouts() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    }   
    
		checkInterval(script, delay)	{
				if (!script.isStart) {
						script.isStart = true;
						script.timeFlag = 1;
						
				    var timeValue = delay * 1000; 
            setTimeout(function() {
                script.timeFlag = 0;
            }, timeValue);
/*
				    var timer = setTimeout(function() {
				        script.timeFlag = 0;
				        Entry.Armz.removeTimeout(timer);
				    }, timeValue);
				    Entry.Armz.timeouts.push(timer);  
*/	    
				    return 'Start'; 
				} else if (script.timeFlag == 1) {
				    return 'Run'; 
				} else { 
				    delete script.isStart;
				    delete script.timeFlag;
				    Entry.engine.isContinue = false;
				    return 'Finish';
				}
		} 

    postSendQueue({ script, data }, scope) {
				const blockId = this.getHashKey();
				_merge(Entry.hw.sendQueue, {
				    [blockId]: data,
				});
    }

    postCallReturn(args) { 
        const { script } = args;
        this.postSendQueue(args, script);
		} 
 
    postCallReturnDelay(args, delay) {
        const { script } = args;

        switch (this.checkInterval(script, delay)) { 
            case 'Start':
                {
                    this.postSendQueue(args, script); 
                }
                return script; 

            case 'Run':
                return script;

            case 'Finish':
                return script.callReturn();

            default:
                return script.callReturn();
        }        
    }     
};

Entry.Armz.setLanguage = function() { 
    return {
        en: {
            Blocks: {
                Action: 'Action',
                Sound: 'Sound',
                Right: 'Right',
                Left: 'Left',  
                Back: 'Back',
                Red: 'Red',
                Green: 'Green',
                Blue: 'Blue',                        
                Cheer: 'Cheer',
                Glad: 'Glad',
                Dissatisfaction: 'Dissatisfaction',
                Angry: 'Angry',  
                Laughter: 'Laughter',
                Praise: 'Praise',
                Praise2: 'Praise2',                
                Consolation: 'Consolation',
                Surprised: 'Surprised',    
                Warning: 'Warning',
                Fear: 'Fear',                                           
            },        	
            template: {
                armz_run_action: "%1 : Number %2 Run %3", 
                armz_block_coding_MF: "Move to forward %1sec %2",
                armz_block_coding_MB: "Move to backward %1sec %2",
                armz_block_coding_T: "Turn %1 %2",  
                armz_block_coding_LO: "LED %1 Color Turn on 1sec %2",        
                armz_block_coding_LB: "LED %1 Color Blink %2",    
                armz_block_coding_LR: "LED Rainbow Color Turn on 3sec %1",                    
                armz_block_coding_E: "Eexpression of %1 Emotion %2",                                                                      
            },
        },
        ko: { 
            Blocks: {
                Action: '동작',
                Sound: '소리',
                Right: '오른쪽',
                Left: '왼쪽',  
                Back: '뒤쪽',
                Red: '빨강',
                Green: '초록',
                Blue: '파랑',    
                Cheer: '환호',
                Glad: '반가움',
                Dissatisfaction: '불만',
                Angry: '화남',  
                Laughter: '웃음',
                Praise: '칭찬',
                Praise2: '칭찬2',                
                Consolation: '위로',
                Surprised: '놀람',    
                Warning: '경고',
                Fear: '공포',                                 
            },        	
            template: {
                armz_run_action: "%1 : 번호 %2 실행 %3",  
                armz_block_coding_MF: "앞으로 %1초간 이동 %2",
                armz_block_coding_MB: "뒤로 %1초간 이동 %2",
                armz_block_coding_T: "%1 방향으로 회전 %2",  
                armz_block_coding_LO: "%1 색깔 램프 1초간 켜기 %2", 
                armz_block_coding_LB: "%1 색깔 램프 깜박이기 %2",   
                armz_block_coding_LR: "무지개 색깔 램프 3초간 켜기 %1",                                                 
                armz_block_coding_E: "%1의 감정 표현하기 %2",                                       
            },
        },
    };
};

Entry.Armz.blockMenuBlocks = [
		'armz_run_action',
		'armz_block_coding_MF',
		'armz_block_coding_MB',
		'armz_block_coding_T',
		'armz_block_coding_LO',
		'armz_block_coding_LB',					
		'armz_block_coding_LR',
		'armz_block_coding_E',	
];

Entry.Armz.getBlocks = function() { 
    return {
        armz_run_action: { 
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Action, 'ACTION'], [Lang.Blocks.Sound, 'SOUND']],
                    value: 'ACTION',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number', 
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'armz_run_action',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['armz'],
       			func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getValue('VALUE', script);
                const data = {
                    type: 'RUN_PLAY',  
                    data: {
                        port,
                        value,
                    },
                };  
								return Entry.Armz.postCallReturnDelay({script, data}, 3);  
            },
        },    	
        armz_block_coding_MF: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['0.5', 51], ['1', 52], ['2', 53], ['3', 54]],
                    value: 51, 
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
            def: {
                type: 'armz_block_coding_MF',
            },
            paramsKeyMap: {
                VALUE: 0,
            },            
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION'; 
                var value = script.getNumberField('VALUE', script);
                var time = value - 50; 
                const data = {
                    type: 'RUN_PLAY',
                    data: {
                        port,
                        value,
                    },
                };
								return Entry.Armz.postCallReturnDelay({script, data}, time); 
            },
        },     
        armz_block_coding_MB: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['0.5', 55], ['1', 56], ['2', 57], ['3', 58]],
                    value: 55,
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
            def: {
                type: 'armz_block_coding_MB', 
            },
            paramsKeyMap: {
                VALUE: 0,
            },             
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION'; 
                var value = script.getNumberField('VALUE', script);
                var time = value - 54; 
                const data = {
                    type: 'RUN_PLAY', 
                    data: {
                        port,
                        value,
                    },
                };   
								return Entry.Armz.postCallReturnDelay({script, data}, time);                   				
            },
        },       
        armz_block_coding_T: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Right, 59], [Lang.Blocks.Left, 60], [Lang.Blocks.Back, 61]], 
                    value: 59,
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
            def: {
                type: 'armz_block_coding_T', 
            },
            paramsKeyMap: {
                VALUE: 0,
            },             
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION';
                var value = script.getNumberField('VALUE', script);
                const data = {
                    type: 'RUN_PLAY', 
                    data: {
                        port, 
                        value,
                    },
                };
                return Entry.Armz.postCallReturnDelay({script, data}, 2);
            },
        },  
				armz_block_coding_LO: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Red, 62], [Lang.Blocks.Green, 64], [Lang.Blocks.Blue, 66]], 
                    value: 62,
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
            def: {
                type: 'armz_block_coding_LO',  
            },
            paramsKeyMap: {
                VALUE: 0,
            },             
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION'; 
                var value = script.getNumberField('VALUE', script);
                const data = {
                    type: 'RUN_PLAY', 
                    data: {
                        port,
                        value,
                    },
                };       				
                return Entry.Armz.postCallReturnDelay({script, data}, 2); 
            },
        },             
				armz_block_coding_LB: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Red, 63], [Lang.Blocks.Green, 65], [Lang.Blocks.Blue, 67]], 
                    value: 63, 
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
            def: {
                type: 'armz_block_coding_LB', 
            },
            paramsKeyMap: {
                VALUE: 0,
            },             
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION';
                var value = script.getNumberField('VALUE', script);
                const data = {
                    type: 'RUN_PLAY', 
                    data: {
                        port,
                        value,
                    },
                };
                return Entry.Armz.postCallReturnDelay({script, data}, 3); 
            },
        },          
				armz_block_coding_LR: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }, 
            ],
            events: {}, 
            def: {
                type: 'armz_block_coding_LR',  
            },
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
                var port = 'ACTION'; 
                var value = 68;			 
		                const data = {
		                    type: 'RUN_PLAY', 
		                    data: {
		                        port,
		                        value, 
		                    },
		                };       				
								return Entry.Armz.postCallReturnDelay({script, data}, 3); 
            },                  
        },  
				armz_block_coding_E: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Cheer, 200], [Lang.Blocks.Glad, 201], [Lang.Blocks.Dissatisfaction, 202],
					                    [Lang.Blocks.Angry, 203], [Lang.Blocks.Laughter, 204], [Lang.Blocks.Praise, 205],
					                    [Lang.Blocks.Praise2, 206], [Lang.Blocks.Consolation, 207], [Lang.Blocks.Surprised, 208], 
					                    [Lang.Blocks.Warning, 209], [Lang.Blocks.Fear, 210]
                    ], 
                    value: 200, 
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
            def: {
                type: 'armz_block_coding_E',  
            },
            paramsKeyMap: {
                VALUE: 0, 
            },             
            class: 'block',
            isNotFor: ['armz'], 
       			func: function(sprite, script) {
              	var port = 'ACTION'; 
                var value = script.getNumberField('VALUE', script);
                const data = {
                    type: 'RUN_PLAY', 
                    data: {
                        port,
                        value,
                    },
                };
								return Entry.Armz.postCallReturnDelay({script, data}, 3);
            },
        },          
    };
};

module.exports = Entry.Armz; 
