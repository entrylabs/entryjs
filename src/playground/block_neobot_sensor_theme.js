Entry.NeobotSensorTheme = {
    name: 'neobot_sensor_theme',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot_sensor_theme.png',
    title: {
        "en": "NEOBOT Senosor Theme",
        "ko": "네오봇 센서 테마"
    },
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
        imgPath: 'hw/neobot_sensor_theme.png',
        width: 800,
        height: 800,
        listPorts: {
        },
        ports: {
            'IN1':{name: 'PORT1', type: 'input', pos: {x: 145, y: 429}},
            'IN2':{name: 'PORT2', type: 'input', pos: {x : 314, y: 429}},
            'IN3':{name: 'PORT3', type: 'input', pos: {x: 484, y: 429}},
            'BAT':{name: 'PORT4', type: 'input', pos: {x: 653, y: 429}}
        },
        mode: 'both'
    }
}