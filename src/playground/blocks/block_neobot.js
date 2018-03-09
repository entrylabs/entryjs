Entry.Neobot = {
    name: 'neobot',
    LOCAL_MAP: [
        'IN1',
        'IN2',
        'IN3',
        'IR',
        'BAT'
    ],
    REMOTE_MAP: [
        'OUT1',
        'OUT2',
        'OUT3',
        'DCR',
        'DCL',
        'SND',
        'FND',
        'OPT'
    ],
    setZero: function () {
        for(var port in Entry.Neobot.REMOTE_MAP) {
            Entry.hw.sendQueue[Entry.Neobot.REMOTE_MAP[port]] = 0;
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot.png',
        width: 700,
        height: 700,
        listPorts: {
            'IR':{name: '리모컨', type: 'input', pos: {x: 0, y: 0}},
            'BAT':{name: '배터리', type: 'input', pos: {x: 0, y: 0}},
            'SND':{name: Lang.Hw.buzzer , type: 'output', pos: {x: 0, y: 0}},
            'FND':{name: 'FND', type: 'output', pos: {x: 0, y: 0}}
        },
        ports: {
            'IN1':{name: 'IN1', type: 'input', pos: {x: 270, y: 200}},
            'IN2':{name: 'IN2', type: 'input', pos: {x : 325, y: 200}},
            'IN3':{name: 'IN3', type: 'input', pos: {x: 325, y: 500}},
            'DCL':{name: 'L-Motor', type: 'output', pos: {x: 270, y: 500}},
            'DCR':{name: 'R-Motor', type: 'output', pos: {x: 435, y: 500}},
            'OUT1':{name: 'OUT1', type: 'output', pos: {x: 380, y: 200}},
            'OUT2':{name: 'OUT2', type: 'output', pos: {x: 435, y: 200}},
            'OUT3':{name: 'OUT3', type: 'output', pos: {x: 380, y: 500}}
        },
        mode: 'both'
    }
}