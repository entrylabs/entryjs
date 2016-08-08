"use strict";

Entry.Codestar = {
    name: 'codestar',
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/codestar.png',
        width: 333,
        height: 409,
        listPorts: {
            '13':{name: '진동모터', type: 'output', pos: {x: 0, y: 0}},
            '6':{name: '진동센서', type: 'input', pos: {x: 0, y: 0}},
            'geomagnetic':{name: '3축 지자기', type: 'input', pos: {x: 0, y: 0}}
        },
        ports: {
            '4':{name: '리모콘', type: 'input', pos: {x: 254, y: 9}},
            '7':{name: '빨간색', type: 'output', pos: {x: 238, y: 108}},
            '8':{name: '파란색', type: 'output', pos: {x: 265, y: 126}},
            '9':{name: '3색 빨간색', type: 'output', pos: {x: 292, y: 34}},
            '10':{name: '3색 녹색', type: 'output', pos: {x: 292, y: 34}},
            '11':{name: '3색 파란색', type: 'output', pos: {x: 292, y: 34}},
            '12':{name: '버튼', type: 'input', pos: {x: 248, y: 142}},
            'a0':{name: '왼쪽 벽감지', type: 'input', pos: {x: 24, y: 231}},
            'a2':{name: '마이크', type: 'input', pos: {x: 225, y: 67}},
            'a3':{name: '부저', type: 'output', pos: {x: 283, y: 105}},
            'a4':{name: '왼쪽 라인감지', type: 'input', pos: {x: 37, y: 353}},
            'a5':{name: '오른쪽 라인감지', type: 'input', pos: {x: 50, y: 368}},
            'a6':{name: '조도센서', type: 'input', pos: {x : 273, y: 22}},   
            'a7':{name: '오른쪽 벽감지', type: 'input', pos: {x: 103, y: 381}},
            'temperature':{name: '온도센서', type: 'input', pos: {x: 311, y: 238}},
            'sonar':{name: '초음파', type: 'input', pos: {x: 7, y: 277}},
            'leftwheel':{name: '왼쪽 바퀴', type: 'output', pos: {x: 177, y: 370}},
            'rightwheel':{name: '오른쪽 바퀴', type: 'output', pos: {x: 83, y: 218}},
        },
        mode: 'both'
    }
};
