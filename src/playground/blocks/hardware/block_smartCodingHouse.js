'use strict';

Entry.smartCodingHouse = {
    id: '67.1',
    name: 'smartCodingHouse',
    url: 'http://www.sciencetime.co.kr/',
    imageName: 'smartCodingHouse.png',
    title: {
        en: 'smartCodingHouse',
        ko: '스마트 코딩 하우스',
    },
    // 하드웨어 출력을 초기화할 때, 센서용 포트와 출력용 포트를 분리합니다.
    setZero: function () {
        // sendQueue 객체 초기화
        Entry.hw.sendQueue = {};
        // 센서는 아날로그 채널(0~5)만 읽기용으로 등록합니다.
        Entry.hw.sendQueue.readablePorts = [
            Entry.smartCodingHouse.analogPin.ULTRASONIC_ECHO,
            Entry.smartCodingHouse.analogPin.TEMP_HUM,
            Entry.smartCodingHouse.analogPin.IR_SENSOR,
            Entry.smartCodingHouse.analogPin.LIGHT_SENSOR,
            Entry.smartCodingHouse.analogPin.RAIN_SENSOR,
        ];
        // 출력용 디지털 포트는 0으로 초기화 (readablePorts에 포함시키지 않음)
        for (let key in Entry.smartCodingHouse.digitalPin) {
            let port = Entry.smartCodingHouse.digitalPin[key];
            Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update && Entry.hw.update();
    },

    // 핀 매핑 (참고용)
    analogPin: {
        ULTRASONIC_TRIG: 0, // 초음파센서 trig
        ULTRASONIC_ECHO: 1, // 초음파센서 echo
        TEMP_HUM: 2, // 온습도센서
        IR_SENSOR: 3, // 적외선센서
        LIGHT_SENSOR: 4, // 조도센서
        RAIN_SENSOR: 5, // 레인센서서
    },
    digitalPin: {
        SERVO_MOTOR: 2, // 서보모터
        DC_MOTOR: 3, // DC모터 – 방향과 속도를 하나의 값으로 결합
        OUTDOOR1_LED_RED: 5, // 1층 실외 빨강 LED
        OUTDOOR1_LED_GREEN: 6, // 1층 실외 초록 LED
        OUTDOOR1_LED_BLUE: 7, // 1층 실외 파란 LED
        INDOOR_LED_RED: 8, // 실내 빨강 LED
        INDOOR_LED_GREEN: 9, // 실내 초록 LED
        INDOOR_LED_BLUE: 10, // 실내 파란 LED
        TERRACE2_LED_RED: 11, // 2층 테라스 빨강 LED
        TERRACE2_LED_GREEN: 12, // 2층 테라스 초록 LED
        TERRACE2_LED_BLUE: 13, // 2층 테라스 파란 LED
    },
};

Entry.smartCodingHouse.setLanguage = function () {
    return {
        ko: {
            template: {
                // 입력 블록
                set_ultrasonic_input: '초음파 센서: %1',
                set_light_input: '조도 센서: %1',
                set_temp_hum_input: '온습도 센서의 %1 가 %2 ',
                set_ir_input: '적외선 센서: %1',
                set_rain_input: '빗물 감지 센서: %1',
                // 모드 블록
                run_smart_mode: '스마트코딩하우스 모드 실행: %1 시작하기',
                // 출력 블록
                auto_door: '서보모터: 자동문 시스템',
                open_door: '서보모터: 출입문 열기',
                close_door: '서보모터: 출입문 닫기',
                run_ceiling_fan: 'DC모터: 실링팬 가동 (%1)',
                led_set_color: 'LED 조명 제어: 위치 %1, 색상 %2 으로 설정',
                led_off: 'LED 끄기: 위치 %1',
            },
        },
        en: {
            template: {
                set_ultrasonic_input: 'Ultrasonic Sensor: %1',
                set_light_input: 'Light Sensor: %1',
                set_temp_hum_input: 'Temp/Humidity Sensor: %1 %2',
                set_ir_input: 'IR Sensor: %1',
                set_rain_input: 'Rain Sensor: %1',
                run_smart_mode: 'Run SmartCodingHouse mode: %1',
                auto_door: 'Servo Motor: Auto Door',
                open_door: 'Servo Motor: Open Door',
                close_door: 'Servo Motor: Close Door',
                run_ceiling_fan: 'DC Motor: Run ceiling fan (%1)',
                led_set_color: 'LED Control: Location %1, Color %2',
                led_off: 'LED Off: Location %1',
            },
        },
    };
};

Entry.smartCodingHouse.blockMenuBlocks = [
    // 입력 블록
    'set_ultrasonic_input',
    'set_light_input',
    'set_temp_hum_input',
    'set_ir_input',
    'set_rain_input',
    // 모드 블록
    'run_smart_mode',
    // 출력 블록
    'auto_door',
    'open_door',
    'close_door',
    'run_ceiling_fan',
    'led_set_color',
    'led_off',
];

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((x) => x + x)
            .join('');
    }
    let num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// RGB를 HSV로 변환하는 함수
function rgbToHsv(r, g, b) {
    // 0~255 범위의 값을 0~1 범위로 정규화
    r /= 255;
    g /= 255;
    b /= 255;
  
    // 최대값과 최소값 찾기
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
      s,
      v = max;
    let d = max - min;
  
    // 채도(saturation) 계산: 최대값이 0이면 0, 아니면 (최대-최소)/최대
    s = max === 0 ? 0 : d / max;
  
    // 색조(hue) 계산
    if (max === min) {
      // 무채색인 경우(hue는 정의할 수 없음; 0으로 지정)
      h = 0;
    } else {
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / d + 2;
      } else {
        h = (r - g) / d + 4;
      }
      h /= 6; // 0~1 사이의 값으로 정규화
    }
  
    // 결과 객체 반환: h는 0~1, s는 0~1, v는 0~1
    return { h: h, s: s, v: v };
  }
  
  // HSV 값을 RGB로 변환하는 함수
  function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

// 블록이 아니라, 일반 함수로 선언
Entry.smartCodingHouse.modeDoor = function() {
    let port = Entry.smartCodingHouse.digitalPin.SERVO_MOTOR;
    // 서보모터를 90도로 설정
    Entry.hw.sendQueue[port] = 4;
    Entry.hw.update && Entry.hw.update();
    
    setTimeout(() => {
        Entry.hw.sendQueue[port] = 0;
        Entry.hw.update && Entry.hw.update();
    }, 26);
};


Entry.smartCodingHouse.getBlocks = function () {
    return {
        set_ultrasonic_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가까움', 'near'],
                        ['멀음', 'far'],
                    ],
                    value: 'near',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: { EXPECTED: 0, THRESHOLD: 1 },
            def: {
                type: 'set_ultrasonic_input',
                params: [null, { type: 'number', params: ['20'] }],
            },
            class: 'SmartCodingHouseSensor',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var expected = script.getField('EXPECTED', script); // "near" 또는 "far"
                var threshold = script.getNumberValue('THRESHOLD', script); // 임계값 (기본 20cm)
                var distance = Number(Entry.hw.portData.ultrasonic);
                
                if (isNaN(distance)) {
                    // 만약 ultrasonic이 NaN이면, a1 값을 대신 사용
                    distance = Number(Entry.hw.portData.a1);
                }
                // console.log('[DEBUG] Ultrasonic sensor reading: ' + distance + ' cm');

                // 센서 값이 임계값보다 작으면 "near", 이상이면 "far"
                var actual = distance < threshold ? 'near' : 'far';
                return actual === expected;
            },
        },

        set_temp_hum_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['온도', 'temperature'],
                        ['습도', 'humidity'],
                    ],
                    value: 'temperature',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    // 온도일 경우 "덥다"/"춥다", 습도일 경우 "습하다"/"건조하다"
                    options: [
                        ['덥다', 'hot'],
                        ['춥다', 'cold'],
                        ['습하다', 'wet'],
                        ['건조하다', 'dry'],
                    ],
                    value: 'hot',
                    fontSize: 11,
                },
            ],
            paramsKeyMap: { TYPE: 0, EXPECTED: 1 },
            def: { type: 'set_temp_hum_input', params: [null, null] },
            class: 'SmartCodingHouseSensor',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var sensorType = script.getField('TYPE', script); // "temperature" 또는 "humidity"
                var expected = script.getField('EXPECTED', script);
                // a2 채널에서 수신한 결합된 값을 가져옴
                var combined = Number(Entry.hw.portData.a2);
                // Arduino에서 보낸 값은 (온도×100 + 습도)를 5로 나눈 값이므로,
                // 원래 값을 복원하려면 5를 곱해줌
                var value = combined * 5;
                // 온도는 몫, 습도는 나머지로 분리 (예: 25°C, 50% → 25×100+50 = 2550)
                var temp = Math.floor(value / 100);
                var humi = value % 100;

                console.log('[DEBUG] combined: ' + combined);
                console.log('[DEBUG] temp: ' + temp);
                console.log('[DEBUG] humi: ' + humi);

                if (isNaN(combined)) {
                    combined = Number(Entry.hw.portData.a2);
                }
                
                if (sensorType === 'temperature') {
                    var actual = temp > 25 ? 'hot' : 'cold';
                    if (expected !== 'hot' && expected !== 'cold') return false;
                    return actual === expected;
                } else {
                    var actual = humi > 50 ? 'wet' : 'dry';
                    if (expected !== 'wet' && expected !== 'dry') return false;
                    return actual === expected;
                }
                
            },
        },
        

        set_light_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['어둡다', 'dark'],
                        ['밝다', 'bright'],
                    ],
                    value: 'dark',
                    fontSize: 11,
                },
            ],
            paramsKeyMap: { EXPECTED: 0 },
            def: { type: 'set_light_input', params: [null] },
            class: 'SmartCodingHouseSensor',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var expected = script.getField('EXPECTED', script); // "dark" 또는 "bright"
                var value = Number(Entry.hw.portData.a4);
                if (isNaN(value)) return false;
                // 값이 500 미만이면 "dark", 이상이면 "bright"
                var actual = value > 500 ? 'dark' : 'bright';
                return actual === expected;
            },
        },

        set_ir_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['움직임 있음', 'move'],
                        ['움직임 없음', 'nomove'],
                    ],
                    value: 'move',
                    fontSize: 11,
                },
            ],
            paramsKeyMap: { EXPECTED: 0 },
            def: { type: 'set_ir_input', params: [null] },
            class: 'SmartCodingHouseSensor',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var expected = script.getField('EXPECTED', script); // 'move' 또는 'nomove'
                var sensorVal = Number(Entry.hw.portData.a3);
                if (isNaN(sensorVal)) return false;
                // 예를 들어, 센서가 움직임 있을 때 높은 값을 반환한다면:
                var actual = sensorVal < 500 ? 'move' : 'nomove';
                return actual === expected;
            },
        },

        set_rain_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빗물 있음', 'rain'],
                        ['빗물 없음', 'norain'],
                    ],
                    value: 'rain',
                    fontSize: 11,
                },
            ],
            paramsKeyMap: { EXPECTED: 0 },
            def: { type: 'set_rain_input', params: [null] },
            class: 'SmartCodingHouseSensor',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var expected = script.getField('EXPECTED', script); // 'rain' 또는 'norain'
                let value = Number(Entry.hw.portData.a5);
                if (isNaN(value)) return false;
                var actual = value > 100 && value < 800 ? 'rain' : 'norain';
                return actual === expected;
            },
        },
        // 모드 실행 블록 – 기획안의 모드(아침, 저녁, 비상, 시험 공부, 생일 파티)에 따라 LED, 모터, 서보모터를 제어
        // 모드 실행 블록 – 수정된 morning 케이스
        run_smart_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['아침 루틴', 'morning'],
                        ['저녁 루틴', 'evening'],
                        ['비상 상황 모드', 'emergency'],
                        ['시험 공부 모드', 'study'],
                        ['생일 파티 모드', 'party'],
                    ],
                    value: 'morning',
                    fontSize: 11,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            paramsKeyMap: { MODE: 0 },
            def: { params: [null, null], type: 'run_smart_mode' },
            class: 'SmartCodingHouseMode',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                var mode = script.getField('MODE', script);
                var sq = Entry.hw.sendQueue;
                switch (mode) {
                    case 'morning':
                        // 1,2층 실내: white LED
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE] = 255;

                        // 1층 실외: green LED
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE] = 0;

                        // 2층 테라스: green LED
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE] = 0;

                        // 실링팬 구동
                        sq[Entry.smartCodingHouse.digitalPin.DC_MOTOR] = 127 | 0x80;
                        break;

                    case 'evening':
                        // 1층 실외(yellow), 2층 테라스(yellow)는 고정
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE] = 0;

                        // 실내 조명을 여러 색상으로 순환
                        const indoorR = Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED;
                        const indoorG = Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN;
                        const indoorB = Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE;

                        // 반복할 색상 배열 (red, orange, yellow, green, blue, purple)
                        const colorCycle = [
                            [255, 0, 0], // red
                            [255, 165, 0], // orange
                            [255, 255, 0], // yellow
                            [0, 255, 0], // green
                            [0, 0, 255], // blue
                            [128, 0, 128], // purple
                        ];
                        let idx = 0;

                        // 재귀적으로 호출해서 색 변경
                        function cycleIndoorColor() {
                            const [r, g, b] = colorCycle[idx];
                            sq[indoorR] = r;
                            sq[indoorG] = g;
                            sq[indoorB] = b;
                            // 하드웨어에 갱신
                            Entry.hw.update && Entry.hw.update();

                            // 다음 색상
                            idx = (idx + 1) % colorCycle.length;

                            // 1초 후 다음 색으로
                            setTimeout(cycleIndoorColor, 2000);
                        }

                        // 순환 시작
                        cycleIndoorColor();

                        break;

                    case 'emergency':
                        // 비상 상황 모드: 모든 LED red, 2층 테라스 팬, 1층 출입문 개방(서보모터 90도)
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE] = 0;

                        // 실링팬 구동
                        sq[Entry.smartCodingHouse.digitalPin.DC_MOTOR] = 127 | 0x80;
                        // 서보모터 구동
                        sq[Entry.smartCodingHouse.digitalPin.SERVO_MOTOR] = 90;
                        Entry.smartCodingHouse.modeDoor();
                        break;

                    case 'study':
                        // 시험 공부 모드: 실내 yellow, 야외/테라스 orange
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN] = 165;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN] = 165;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE] = 0;
                        break;

                    case 'party':
                        // 생일 파티 모드: 실내 red, 1층 실외 white, 2층 테라스 purple, 팬과 출입문 개방
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE] = 255;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED] = 128;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN] = 0;
                        sq[Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE] = 128;

                        // 실링팬 구동
                        sq[Entry.smartCodingHouse.digitalPin.DC_MOTOR] = 127 | 0x80;
                        // 서보모터 구동
                        sq[Entry.smartCodingHouse.digitalPin.SERVO_MOTOR] = 90;
                        Entry.smartCodingHouse.modeDoor();
                        break;
                    default:
                        console.log('Unknown mode: ' + mode);
                }
                return script.callReturn();
            },
        },
        auto_door: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            def: { type: 'auto_door' },
            class: 'SmartCodingHouseActuator',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                let port = Entry.smartCodingHouse.digitalPin.SERVO_MOTOR;

                // 서보모터를 90으로 설정
                Entry.hw.sendQueue[port] = 3;
                Entry.hw.update && Entry.hw.update();

                // 1초 후 서보모터를 다시 0으로 자동 복귀
                setTimeout(() => {
                    Entry.hw.sendQueue[port] = 0;
                    Entry.hw.update && Entry.hw.update();
                }, 26);

                return script.callReturn();
            },
        },
        open_door: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            def: { type: 'open_door' },
            class: 'SmartCodingHouseActuator',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                let port = Entry.smartCodingHouse.digitalPin.SERVO_MOTOR;

                // 서보모터를 90으로 설정
                Entry.hw.sendQueue[port] = 1;
                Entry.hw.update && Entry.hw.update();

                // 1초 후 서보모터를 다시 0으로 자동 복귀
                setTimeout(() => {
                    Entry.hw.sendQueue[port] = 0;
                    Entry.hw.update && Entry.hw.update();
                }, 26);

                return script.callReturn();
            },
        },
        close_door: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [{ type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 }],
            def: { type: 'close_door' },
            class: 'SmartCodingHouseActuator',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                let port = Entry.smartCodingHouse.digitalPin.SERVO_MOTOR;

                // 서보모터를 90으로 설정
                Entry.hw.sendQueue[port] = 2;
                Entry.hw.update && Entry.hw.update();

                // 1초 후 서보모터를 다시 0으로 자동 복귀
                setTimeout(() => {
                    Entry.hw.sendQueue[port] = 0;
                    Entry.hw.update && Entry.hw.update();
                }, 26);

                return script.callReturn();
            },
        },

        run_ceiling_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ON', 'on'],
                        ['OFF', 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            paramsKeyMap: { STATE: 0 },
            def: { type: 'run_ceiling_fan', params: [null, null] },
            class: 'SmartCodingHouseActuator',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                // 드롭다운 메뉴에서 선택한 상태 읽기 ("on" 또는 "off")
                var state = script.getField('STATE', script);
                let port = Entry.smartCodingHouse.digitalPin.DC_MOTOR;
                // "ON"이면 최대 속도 127, "OFF"이면 0
                let speed = state === 'on' ? 127 : 0;
                // 기존값에서 방향 비트를 유지하고 속도 값만 업데이트
                let current = Entry.hw.sendQueue[port] || 0;
                current = (current & 0x80) | speed;
                // 강제로 시계방향 (0x80) 설정
                current |= 0x80;
                Entry.hw.sendQueue[port] = current;
                Entry.hw.update && Entry.hw.update();
                return script.callReturn();
            },
        },
        led_set_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1층 실외', 'OUTDOOR1'],
                        ['실내', 'INDOOR'],
                        ['2층 테라스', 'TERRACE2'],
                    ],
                    value: 'OUTDOOR1',
                    fontSize: 11,
                },
                { type: 'Color' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            paramsKeyMap: { LOCATION: 0, COLOR: 1 },
            def: { params: [null, null, null], type: 'led_set_color' },
            class: 'SmartCodingHouseLED',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                let location = script.getField('LOCATION', script);
                let color = script.getStringField('COLOR', script);
                if (!location) {
                    console.error('Error: LOCATION 값이 undefined!');
                    return script.callReturn();
                }
                let rgb = hexToRgb(color);
                let pinR, pinG, pinB;
                if (location === 'OUTDOOR1') {
                    pinR = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED;
                    pinG = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN;
                    pinB = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE;
                } else if (location === 'INDOOR') {
                    pinR = Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED;
                    pinG = Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN;
                    pinB = Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE;
                } else if (location === 'TERRACE2') {
                    pinR = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED;
                    pinG = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN;
                    pinB = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE;
                }
                // 콘솔 로그로 선택된 포트 번호 확인
                // console.log('LED OFF - Location:', location);
                // console.log('Port Red:', pinR, 'Port Green:', pinG, 'Port Blue:', pinB);

                // LED 출력: 하드웨어 업데이트 전에 값 할당
                Entry.hw.sendQueue[pinR] = rgb.r;
                Entry.hw.sendQueue[pinG] = rgb.g;
                Entry.hw.sendQueue[pinB] = rgb.b;
                // 강제로 하드웨어 업데이트 호출 (다른 LED 블록에서도 사용하는 패턴)
                Entry.hw.update && Entry.hw.update();
                return script.callReturn();
            },
        },

        led_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.default.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['실내', 'INDOOR'],
                        ['1층 실외', 'OUTDOOR1'],
                        ['2층 테라스', 'TERRACE2'],
                    ],
                    value: 'INDOOR',
                    fontSize: 11,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            paramsKeyMap: { LOCATION: 0 },
            def: { type: 'led_off', params: [null] },
            class: 'SmartCodingHouseLED',
            isNotFor: ['smartCodingHouse'],
            func: function (sprite, script) {
                let location = script.getField('LOCATION', script);
                let portR, portG, portB;
                if (location === 'INDOOR') {
                    portR = Entry.smartCodingHouse.digitalPin.INDOOR_LED_RED;
                    portG = Entry.smartCodingHouse.digitalPin.INDOOR_LED_GREEN;
                    portB = Entry.smartCodingHouse.digitalPin.INDOOR_LED_BLUE;
                } else if (location === 'OUTDOOR1') {
                    portR = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_RED;
                    portG = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_GREEN;
                    portB = Entry.smartCodingHouse.digitalPin.OUTDOOR1_LED_BLUE;
                } else if (location === 'TERRACE2') {
                    portR = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_RED;
                    portG = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_GREEN;
                    portB = Entry.smartCodingHouse.digitalPin.TERRACE2_LED_BLUE;
                }
                Entry.hw.sendQueue[portR] = 0;
                Entry.hw.sendQueue[portG] = 0;
                Entry.hw.sendQueue[portB] = 0;
                return script.callReturn();
            },
        },
    };
};

module.exports = Entry.smartCodingHouse;
