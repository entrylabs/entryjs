'use strict';

Entry.CodeWiz = {
    id: '1.12',
    name: 'CodeWiz',
    url: 'http://codable.co.kr/page/?pid=codewiz',
    imageName: 'codewiz.png',
    title: {
        ko: '코드위즈',
        en: 'CodeWiz',
    },
    setZero: function() {
        Entry.hw.sendQueue = {
            ORDER: {},
            RESET: 1,
        };
        Entry.hw.update();
        setTimeout(() => {
            Entry.hw.sendQueue.RESET = 0;
            Entry.hw.update();
        }, 100);
    },
    getHashKey(opcode) {
        // let key = new Date().getSeconds().toString(16);
        // if (key.length === 1) {
        //     key += ((Math.random() * 16) | 0).toString(16);
        // }
        // return Entry.generateHash() + key;
        // return Entry.generateHash(6)+opcode;
        return Date.now().toString().substring(6)+opcode;
    },
    sendOrder(order) {
        const sq = Entry.hw.sendQueue;
        Entry.CodeWiz.intervalId=true;
        if (!sq.ORDER) {
            sq.ORDER = {};
        }//order.value.opcodescript.key
        const id = this.getHashKey(order.value.opcode);
        sq.ORDER[id] = order;
        Entry.hw.update();
        // return id;
        this.deleteOrder(id);

        return id;
    },
    deleteOrder(id) {
        // Entry.hw.portData.runOK = false;
        /** */
        Entry.hw.portData[id]={value:null}
        /** */
        delete Entry.hw.sendQueue.ORDER[id];
        Entry.hw.update();
    },
    getOffsetX(str) {
        return this.getByteLength(str) * 1.5 - 18;
    },
    getByteLength(s, b, i, c) {
        for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    },
    monitorTemplate: {
        imgPath: 'hw/codeino.png',
        width: 431,
        height: 354,

        mode: 'both',
    },
    sensorTypes: {
        READ: 1,
        WRITE: 0,
    },

    // preWaitList: [],
    // preWaitResult: null,
};

Entry.CodeWiz.setLanguage = function() {
    return {
        ko: {
            template: {
                CodeWiz_sensor_title: '기본 센서',
                CodeWiz_get_sensor: '%1센서 값',
                CodeWiz_get_gyroSensor: '3축 센서 %1값',
                CodeWiz_isPushedButton: '%1 스위치 버튼 값',
                CodeWiz_touchPin: '터치핀 %1 값',

                CodeWiz_buzzer_title: '스피커',
                CodeWiz_default_buzzer: '스피커를 %1옥타브, %2음, %3분음표로 연주하기 %4',

                CodeWiz_neopixel_title: '네오픽셀',
                CodeWiz_neopixel_init: '네오픽셀 %1에 %2개로 시작설정%3',
                CodeWiz_neopixel_brightness: '네오픽셀 밝기를 %1로 설정(0~255)%2',
                CodeWiz_neopixel_setColor_one: '네오픽셀 %1번 LED를 %2(으)로 켜기%3',
                CodeWiz_neopixel_setColor_one2:
                    '네오픽셀 %1번 LED를 빨강%2초록%3파랑%4(으)로 켜기%5',
                CodeWiz_neopixel_off_one: '네오픽셀 %1번 LED 끄기%2',
                CodeWiz_neopixel_setColor_all: '네오픽셀 %1(으)로 모두 켜기%2',
                CodeWiz_neopixel_setColor_all2: '네오픽셀 빨강%1초록%2파랑%3(으)로 모두 켜기%4',
                CodeWiz_neopixel_off_all: '네오픽셀 모두 끄기%1',
                CodeWiz_neopixel_OnPixelRandomColor:'네오픽셀 %1번 LED 무작위 색으로 켜기%2',
                CodeWiz_neopixel_fillRandom:'네오픽셀 무작위 색으로 채우기%1',
                CodeWiz_neopixel_rotate:'네오픽셀 LED %1으로 회전시키기%2',
                CodeWiz_neopixel_shift:'네오픽셀 LED %1으로 밀기%2',
                CodeWiz_neopixel_gradationRGB:'네오픽셀 %1번부터 %2번까지 RGB그라데이션(%3,%4)으로 켜기%5',
                CodeWiz_neopixel_gradationHSL:'네오픽셀 %1번부터 %2번까지 HSL그라데이션(%3,%4)으로 켜기%5',
                CodeWiz_neopixel_wheeeeeeel:'네오픽셀 휠%1',

                CodeWiz_OLED_title: 'OLED',
                CodeWiz_OLED_clear: 'OLED 지우기%1',
                CodeWiz_OLED_mirror: 'OLED 반전 모드%1 %2',
                CodeWiz_OLED_setSize: 'OLED 문자 크기를 %1(으)로 설정%2',
                CodeWiz_OLED_setPosition: 'OLED 커서위치(%1,%2)(으)로 지정%3',
                CodeWiz_OLED_println: 'OLED에 %1 출력%2',
                CodeWiz_OLED_isCollision: 'OLED 자동 줄바꿈%1%2',
                CodeWiz_OLED_specialChar: 'OLED에 기호%1 출력하기%2',
                CodeWiz_OLED_setFont: 'OLED 폰트%1를 크기%2(으)로 설정%3',
                CodeWiz_OLED_startScroll: 'OLED 스크롤 시키기%1 시작%2~종료%3(0~7)%4',
                CodeWiz_OLED_stopScroll: 'OLED 스크롤 멈추기%1',
                CodeWiz_OLED_drawPoint: 'OLED 점찍기 (%1,%2)%3%4',
                CodeWiz_OLED_drawLine1: 'OLED 선 그리기 시작(%1,%2) 끝(%3,%4)%5%6',
                CodeWiz_OLED_drawLine2: 'OLED 수직선 시작(%1,%2) 길이%3%4%5',
                CodeWiz_OLED_drawLine3: 'OLED 수평선 시작(%1,%2) 길이%3%4%5',
                CodeWiz_OLED_drawRect: 'OLED 직사각형 시작(%1,%2) 가로%3세로%4%5%6%7',
                CodeWiz_OLED_drawCircle: 'OLED 원 중심(%1,%2) 반지름%3%4%5%6',
                CodeWiz_OLED_drawPoligon: 'OLED 삼각형 점1(%1,%2)점2(%3,%4)점3(%5,%6)%7%8%9',
                CodeWiz_OLED_printHG:'OLED에 한글포함%1 출력, 줄바꿈%2%3',

                CodeWiz_DIGITAL_OUTPUT_title: '기본 출력',
                CodeWiz_DIGITAL_OUTPUT_digitalWrite: 'PIN%1(으)로 %2내보내기%3',
                CodeWiz_DIGITAL_OUTPUT_pwmWrite: 'PIN%1(으)로 PWM %2내보내기(0~1023)%3',

                CodeWiz_HuskyLens_title: '허스키렌즈',
                CodeWiz_HuskyLens_initHuskyLens: '허스키렌즈 시작설정%1',
                CodeWiz_HuskyLens_setModeOfHuskyLens: '허스키렌즈 %1알고리즘으로 설정%2',
                CodeWiz_HuskyLens_readHuskyLens: '허스키렌즈 데이터 요청(읽기)%1',
                CodeWiz_HuskyLens_isLearnedHuskyLens: '허스키렌즈 ID가%1인 데이터를 학습했는가?%2',
                CodeWiz_HuskyLens_isContainHuskyLens:
                    '허스키렌즈 ID:%1로 인식한 %2데이터가 있는가?%3',
                CodeWiz_HuskyLens_getCountLearnedHuskyLens: '허스키렌즈가 감지한 학습데이터 수%1',
                CodeWiz_HuskyLens_hasTypeHuskyLens: '허스키렌즈가 읽은 데이터 타입이%1인가?%2',
                CodeWiz_HuskyLens_getArrowInfoHuskyLens:
                    '허스키렌즈가 읽은 화살표정보%1(첫 인식 1개)%2',
                CodeWiz_HuskyLens_getBoxInfoHuskyLens:
                    '허스키렌즈가 읽은 사각형정보%1(중심좌표가 중앙에 가장 가까운 것)%2',
                CodeWiz_HuskyLens_writeTextHuskyLens: '허스키렌즈 (%1,%2)에 %3출력%4',
                CodeWiz_HuskyLens_clearTextHuskyLens: '허스키렌즈 텍스트 지우기%1',

                CodeWiz_Servo_title: '서보모터',
                CodeWiz_Servo_setAngle: '서보모터(%1) 각도를 %2(으)로 바꾸기%3',
                CodeWiz_Servo_menuSpeed: '무한회전 서보모터(%1) %2속도로 정하기%3',
                CodeWiz_Servo_customSpeed: '무한회전 서보모터(%1) %2속도로 정하기(-100~100)%3',

                CodeWiz_Dc_title: 'DC 모터',
                CodeWiz_Dc_setValue: 'WizCar 모터(%1)에 %2방향으로 %3내보내기(0~1023)%4',
                CodeWiz_Dc_setValue_Waterpump: '워터펌프(%1)에 %2내보내기(0~1023)%3',

                CodeWiz_DotMatrix_title: '도트매트릭스',
                CodeWiz_DotMatrix_init: '도트매트릭스 %1개 DIN%2, CS%3, CLK%4로 설정%5',
                CodeWiz_DotMatrix_setBrightness: '도트매트릭스 %1번 밝기를 %2(으)로 설정%3',
                CodeWiz_DotMatrix_printString: '도트매트릭스 %1번에 문자열%2 출력%3',
                CodeWiz_DotMatrix_setLine: '도트매트릭스 %1번의 %2%3 %4(으)로 만들기%5',
                CodeWiz_DotMatrix_setDot: '도트매트릭스 %1번의 %2행%3열 %4%5',
                CodeWiz_DotMatrix_clear: '도트매트릭스 %1번 지우기%2',
                CodeWiz_DotMatrix_clearAll: '도트매트릭스 모두 지우기%1',

                CodeWiz_ColorSensor_title: '컬러센서',
                CodeWiz_ColorSensor_isColor: 'MCON 컬러센서 감지된 색이 %1인가%2',
                CodeWiz_ColorSensor_getColorValue: 'MCON 컬러센서 %1값%2',

                CodeWiz_DHT_title: '디지털 온습도',
                CodeWiz_DHT_init: '디지털 온습도 pin%1에 설정%2',
                CodeWiz_DHT_getValue: '디지털 온습도 %1값%2',

                CodeWiz_Joystick_title:'조이스틱',
                CodeWiz_Joystick_setPin:'조이스틱 설정하기(X축%1, Y축%2, 버튼%3, 범위%4)%5',
                CodeWiz_Joystick_readAxis:'조이스틱 %1의 값%2',
                CodeWiz_Joystick_readButton:'조이스틱 버튼 값%1',

                CodeWiz_etcReadSensor_title: '기타 입력센서',
                CodeWiz_etcReadSensor_mconRead: 'MCON%1(pin%2)의 측정값%3',
                CodeWiz_etcReadSensor_digitalRead: '%1(pin%2)의 측정값%3',
                CodeWiz_etcReadSensor_InfraredThermometerRead: '비접촉온도센서 %1에 %2로 읽기%3',
            },

            Helper: {
                CodeWiz_get_sensor: `주변의 소리값을 0~1023 사이 값으로 알려줍니다.

                ▼을 클릭하여 빛, 거리, 홀, 온도를 선택하여
                주변의 밝기, 거리, 자성, 보드의 온도를 확인할 수 있습니다.`,
                CodeWiz_get_gyroSensor: `선택된 축의 기울기를 -90~90 사이 값으로 알려줍니다.
                ▼을 눌러 X축, Y축, Z축을 선택할 수 있습니다.`,
                CodeWiz_isPushedButton: `왼쪽/오른쪽 버튼을 누르면 “참” 으로 판단합니다.
                ▼을 눌러 왼쪽, 오른쪽을 선택할 수 있습니다.`,
                CodeWiz_touchPin: `🐻 모양의 터치센서를 손가락으로 터치하면 “참“으로 판단합니다.
                ▼을 눌러 🔆,⭕, 🖐, 👊, ❌ 모양의 터치센서를 선택하면 해당 모양의 터치센서의 터치 여부도 확인할 수 있습니다.`,

                CodeWiz_default_buzzer: `지정된 옥타브의 음을 지정된 음표로 스피커(부저)를 재생합니다.`,

                CodeWiz_neopixel_init: `코드위즈의 네오 RGB LED 5개의 사용을 설정합니다.
                ▼을 눌러 SCON에 연결된 네오픽셀의 개수와 사용을 설정할 수 있습니다.`,
                CodeWiz_neopixel_brightness: `밝기를 0~255 사이 값으로 지정합니다.`,
                CodeWiz_neopixel_setColor_one: `입력한 번호의 LED를 선택한 색으로 켭니다.`,
                CodeWiz_neopixel_setColor_one2:
                    `입력한 번호의 LED를 빨강, 초록, 파랑에 입력된 값의 색으로 켭니다.
                    각 값을 0~255 사이 값으로 지정합니다.`,
                CodeWiz_neopixel_off_one: `입력한 번호의 LED를 끕니다.`,
                CodeWiz_neopixel_setColor_all: `모든 LED를 선택한 색으로 켭니다.`,
                CodeWiz_neopixel_setColor_all2: `모든 LED를 빨강, 초록, 파랑에 입력된 값의 색으로 켭니다.
                각 값을 0~255 사이 값으로 지정합니다.`,
                CodeWiz_neopixel_off_all: `모든 LED를 끕니다.`,
                CodeWiz_neopixel_OnPixelRandomColor:`입력한 번호의 LED를 무작위 색으로 켭니다.`,
                CodeWiz_neopixel_fillRandom:`모든 LED를 무작위 색으로 채웁니다.`,
                CodeWiz_neopixel_rotate:`모든 LED를 지정한 방향으로 회전시킵니다.
                방향은 ▼을 눌러 설정합니다.`,
                CodeWiz_neopixel_shift:`모든 LED를 지정한 방향으로 밀어냅니다.
                빈자리는 기존 색으로 채워집니다.
                방향은 ▼을 눌러 설정합니다.`,
                CodeWiz_neopixel_gradationRGB:`지정범위의 LED를 선택한 색의 그라데이션으로 채웁니다.
                왼쪽색부터 오른쪽색까지 RGB색표현의 그라데이션으로 채워집니다.
                범위는 초기화한 LED범위를 벗어날 수 없으며 서로 다른 값이여야 합니다.
                LED 번호가 작은 값은 왼쪽에 큰 값은 오른쪽에 위치해야합니다.`,
                CodeWiz_neopixel_gradationHSL:`지정범위의 LED를 선택한 색의 그라데이션으로 채웁니다.
                왼쪽색부터 오른쪽색까지 HSL색표현의 그라데이션으로 채워집니다.
                범위는 초기화한 LED범위를 벗어날 수 없으며 서로 다른 값이여야 합니다.
                LED 번호가 작은 값은 왼쪽에 큰 값은 오른쪽에 위치해야합니다.`,
                CodeWiz_neopixel_wheeeeeeel:`모든 LED를 휠시켜 색상을 나타냅니다.`,

                CodeWiz_OLED_clear: `OLED에 표시된 내용을 지웁니다.`,
                CodeWiz_OLED_mirror: `OLED에 표시할 내용의 출력 상태를 설정합니다.
                OFF가 기본이며, ON을 선택하면 OLED 배경에 색이 채워지고 내용이 표시됩니다.`,
                CodeWiz_OLED_setSize: `글자 크기를 지정합니다.
                1~10 사이의 범위로 설정할 수 있습니다.`,
                CodeWiz_OLED_setPosition: `글자가 출력될 위치(x좌표, y좌표)를 지정합니다.
                X는 0~127, Y는 0~63 사이의 범위로 설정할 수 있습니다.`,
                CodeWiz_OLED_println: `입력한 내용을 OLED에 출력합니다.`,
                CodeWiz_OLED_isCollision: `OLED에 출력된 내용의 줄바꿈을 설정합니다.`,
                CodeWiz_OLED_specialChar: `OLED에 기호를 출력합니다.`,
                CodeWiz_OLED_setFont: `글꼴과 글자 크기를 ▼ 을 눌러 설정합니다.`,
                CodeWiz_OLED_startScroll: `OLED에 입력된 내용을 지정한 화살표방향으로 이동시킵니다. 시작과 종료는 y좌표를 0~7 페이지로 나눈 것으로 각 페이지는 다음과 같은 y 좌표를 가집니다.
                
                0 : y좌표 0~7
                1 : y좌표 8~15
                2 : y좌표 16~23
                3 : y좌표 24~31
                4 : y좌표 32~39
                5 : y좌표 40~47
                6 : y좌표 48~55
                7 : y좌표 56~63`,
                CodeWiz_OLED_stopScroll: `이동을 멈춥니다.`,
                CodeWiz_OLED_drawPoint: `지정된 위치 (x좌표, y좌표)에 점을 찍습니다.
                X는 0~127, Y는 0~63 사이의 범위로 설정할 수 있습니다.`,
                CodeWiz_OLED_drawLine1: `시작 위치 (x좌표, y좌표)에서 끝 위치 (x좌표, y좌표)까지 흰색 선을 그립니다.`,
                CodeWiz_OLED_drawLine2: `시작 위치 (x좌표, y좌표)에서 지정된 길이의 흰색 수직선을 그립니다.`,
                CodeWiz_OLED_drawLine3: `시작 위치 (x좌표, y좌표)에서 지정된 길이의 흰색 수평선을 그립니다.`,
                CodeWiz_OLED_drawRect: `시작 위치 (x좌표, y좌표)에서 지정된 가로, 세로 길이의 흰색 선 직사각형을 그립니다.
                ▼을 눌러 ‘비움’ 대신 ‘채움‘을 선택하면 직사각형 내부가 채워집니다.`,
                CodeWiz_OLED_drawCircle: `중심(x좌표, y좌표)에서 지정된 반지름을 가지는 흰색 선 원을 그립니다.
                ▼을 눌러 ‘비움’ 대신 ‘채움‘을 선택하면 원 내부가 채워집니다.`,
                CodeWiz_OLED_drawPoligon: `점1(x좌표, y좌표), 점2 (x좌표, y좌표), 점3 (x좌표, y좌표)을 연결하여 흰색 선 삼각형을 그립니다.
                ▼을 눌러 ‘비움’ 대신 ‘채움‘을 선택하면 원 내부가 채워집니다.`,
                CodeWiz_OLED_printHG:`입력한 내용(한글포함)을 OLED에 출력합니다.
                ▼을 눌러 ‘⭕’를 선택하면 아랫줄로 커서를 이동시키고 ‘❌‘를 선택하면 마지막 글자 오른쪽으로 커서를 이동시킵니다.`,

                CodeWiz_DIGITAL_OUTPUT_digitalWrite: `지정된 핀(터치센서 또는 SCON)에 연결된 센서로 HIGH 또는 LOW 를 내보냅니다.
                
                <현재 활용 가능한 확장도구>
                진동모터`,
                CodeWiz_DIGITAL_OUTPUT_pwmWrite: `지정된 핀(터치센서 또는 SCON)에 연결된 센서로 입력된 값을 내보냅니다.
                
                <현재 활용 가능한 확장도구>
                프로펠러`,

                CodeWiz_HuskyLens_initHuskyLens: `허스키렌즈 시작을 설정합니다.`,
                CodeWiz_HuskyLens_setModeOfHuskyLens: `허스키렌즈를 선택된 알고리즘으로 설정합니다.

                1.FACE_RECOGNITION
                2.OBJECT_TRACKING
                3.OBJECT_RECOGNITION
                4.LINE_TRACKING
                5.COLOR_RECOGNITION
                6.TAG_RECOGNITION
                7.OBJECT_CLASSIFICATION`,
                CodeWiz_HuskyLens_readHuskyLens: `허스키렌즈가 인식한 결과를 읽어옵니다.`,
                CodeWiz_HuskyLens_isLearnedHuskyLens: `입력한 ID 번호 데이터를 학습했다면 ‘참’으로 판단하여 알려줍니다.`,
                CodeWiz_HuskyLens_isContainHuskyLens:
                    `입력한 ID 번호의 사각형 데이터가 인식된다면 ‘참’으로 판단하여 알려줍니다.
                    ▼을 눌러 화살표를 선택하면 화살표 데이터가 인식될 때 ‘참’으로 판단하여 알려줍니다.`,
                CodeWiz_HuskyLens_getCountLearnedHuskyLens: `화면에 감지된 학습한 데이터 수를 알려줍니다.`,
                CodeWiz_HuskyLens_hasTypeHuskyLens: `읽어온 데이터 타입이 선택한 타입(사각형/화살표)과 같다면 ‘참’으로 판단하여 알려줍니다.`,
                CodeWiz_HuskyLens_getArrowInfoHuskyLens:
                    `읽어온 화살표 데이터의 좌표 값을 알려줍니다. 좌표 값은 ‘시작 X좌표‘, ‘시작 Y좌표‘, ‘종료 X좌표‘, ‘종료 Y좌표‘ 중 하나를 선택합니다.`,
                CodeWiz_HuskyLens_getBoxInfoHuskyLens:
                    `읽어온 사각형 데이터의 정보를 알려줍니다. 정보는 ‘ID’, ‘중심 X좌표‘, ‘중심 Y좌표’, ‘너비‘, ‘높이’ 중 하나를 선택합니다.`,
                CodeWiz_HuskyLens_writeTextHuskyLens: `허스키렌즈 화면의 지정된 좌표에 입력된 데이터를 출력합니다.`,
                CodeWiz_HuskyLens_clearTextHuskyLens: `허스키렌즈 화면에 출력되어 있는 데이터를 지웁니다.`,

                CodeWiz_Servo_setAngle: `선택된 커넥터(MCON/SCON)에 연결된 180도 서보모터의 각도를 입력된 각도로 회전시킵니다.(0~180)`,
                CodeWiz_Servo_menuSpeed: `선택된 커넥터(MCON/SCON)에 무한회전 서보모터를 지정된 속도로 회전시킵니다.
                ▼을 눌러 속도를 선택합니다.(빠른/보통/느림/멈춘)`,
                CodeWiz_Servo_customSpeed: `선택된 커넥터(MCON/SCON)에 무한회전 서보모터를 지정된 속도로 회전시킵니다.

                속도 = 0 : 모터의 회전이 멈춥니다.
                속도 > 0 : 모터가 지정된 속도로 정방향 회전합니다.
                속도 < 0 : 모터가 지정된 속도로 역방향 회전합니다.`,

                CodeWiz_Dc_setValue: `선택된 WizCar 모터를 지정한 방향의 입력한 속도로 회전시킵니다.
                ▼을 눌러 회전시킬 모터(MOTOR_L, MOROT_R)와 방향(반시계, 시계)을 선택하고 속도는 0~1023 사이 값으로 직접 입력합니다.`,
                CodeWiz_Dc_setValue_Waterpump: `선택된 워터펌프를 입력한 속도로 회전시킵니다.
                ▼을 눌러 회전시킬 모터(MOTOR_L, MOROT_R)를 선택하고 속도는 0~1023 사이 값으로 직접 입력합니다.`,

                CodeWiz_DotMatrix_init: `도트매트릭스가 연결된 핀을 설정합니다.

                18, 19번 : SCON                
                15, 27번 : 터치센서`,
                CodeWiz_DotMatrix_setBrightness: `입력된 값으로 도트매트릭스의 밝기를 설정합니다.(1~8)`,
                CodeWiz_DotMatrix_printString: `입력된 문자열을 한 글자씩 출력합니다.`,
                CodeWiz_DotMatrix_setLine: `지정된 행/열에 위치한 8개 LED의 ON/OFF를 각각 지정해서 제어합니다.

                1 : ON                
                0 : OFF`,
                CodeWiz_DotMatrix_setDot: `입력된 행,열에 위치한 LED의 ON/OFF를 지정합니다.

                켜기 : ON
                끄기 : OFF`,
                CodeWiz_DotMatrix_clear: `입력된 도트 매트릭스를 지웁니다.(끕니다.)`,
                CodeWiz_DotMatrix_clearAll: `연결된 모든 도트 매트릭스를 지웁니다.(끕니다.)`,

                CodeWiz_ColorSensor_isColor: `MCON에 연결된 컬러센서에 인식된 색 값이 지정된 색이라면 ‘참’으로 판단하여 알려줍니다.
                ▼을 빨강, 초록, 파랑, 검정, 흰색을 선택할 수 있습니다.`,
                CodeWiz_ColorSensor_getColorValue: `MCON에 연결된 컬러센서에 인식된 빨강의 색상 값을 0~255 사이값으로 알려줍니다.
                ▼을 눌러 초록, 파랑을 선택할 수 있습니다.`,

                CodeWiz_DHT_init:`지정한 핀으로 디지털 온습도를 설정합니다.`,
                CodeWiz_DHT_getValue:`앞서 설정한 디지털 온습도에서 선택한 값을 가져옵니다.`,

                CodeWiz_Joystick_setPin:'지정한 핀으로 조이스틱을 설정합니다.',
                CodeWiz_Joystick_readAxis:'설정된 조이스틱의 지정한 축의 레버값을 읽어옵니다.',
                CodeWiz_Joystick_readButton:'설정된 조이스틱의 버튼이 눌렸는지 값을 읽어옵니다.',

                CodeWiz_etcReadSensor_mconRead: `가변저항/워터센서/토양수분센서의 측정값
                선택한 센서에 따라서 값이 적절히 매핑되어 반환됩니다.`,
                CodeWiz_etcReadSensor_digitalRead: `버튼/포토인터럽트의 측정값
                해당핀의 digitalRead값을 가져옵니다.
                버튼의 경우 눌렸을 때 참을 반환하기 위해서 인버스를 취하고,
                포토인터럽트는 읽은 값 그대로 반환됩니다.
                `,
                CodeWiz_etcReadSensor_InfraredThermometerRead: `선택된 커넥터(MCON/SCON)에 연결된 비접촉 온도 센서에 인식된 온도를 알려줍니다.
                ▼을 눌러 온도 단위를 선택합니다.`,
            },
        },
    };
};
Entry.CodeWiz.blockMenuBlocks = [
    'CodeWiz_sensor_title',
    'CodeWiz_get_sensor',
    'CodeWiz_get_gyroSensor',
    'CodeWiz_isPushedButton',
    'CodeWiz_touchPin',

    'CodeWiz_buzzer_title',
    'CodeWiz_default_buzzer',

    'CodeWiz_neopixel_title',
    'CodeWiz_neopixel_init',
    'CodeWiz_neopixel_brightness',
    'CodeWiz_neopixel_setColor_one',
    'CodeWiz_neopixel_setColor_one2',
    'CodeWiz_neopixel_off_one',
    'CodeWiz_neopixel_setColor_all',
    'CodeWiz_neopixel_setColor_all2',
    'CodeWiz_neopixel_off_all',
    'CodeWiz_neopixel_OnPixelRandomColor',
    'CodeWiz_neopixel_fillRandom',
    'CodeWiz_neopixel_rotate',
    'CodeWiz_neopixel_shift',
    'CodeWiz_neopixel_gradationRGB',
    'CodeWiz_neopixel_gradationHSL',
    'CodeWiz_neopixel_wheeeeeeel',

    'CodeWiz_OLED_title',
    'CodeWiz_OLED_clear',
    'CodeWiz_OLED_mirror',
    'CodeWiz_OLED_setSize',
    'CodeWiz_OLED_setPosition',
    'CodeWiz_OLED_println',
    'CodeWiz_OLED_isCollision',
    'CodeWiz_OLED_specialChar',
    'CodeWiz_OLED_setFont',
    'CodeWiz_OLED_startScroll',
    'CodeWiz_OLED_stopScroll',
    'CodeWiz_OLED_drawPoint',
    'CodeWiz_OLED_drawLine1',
    'CodeWiz_OLED_drawLine2',
    'CodeWiz_OLED_drawLine3',
    'CodeWiz_OLED_drawRect',
    'CodeWiz_OLED_drawCircle',
    'CodeWiz_OLED_drawPoligon',
    'CodeWiz_OLED_printHG',

    'CodeWiz_DIGITAL_OUTPUT_title',
    'CodeWiz_DIGITAL_OUTPUT_digitalWrite',
    'CodeWiz_DIGITAL_OUTPUT_pwmWrite',

    'CodeWiz_HuskyLens_title',
    'CodeWiz_HuskyLens_initHuskyLens',
    'CodeWiz_HuskyLens_setModeOfHuskyLens',
    'CodeWiz_HuskyLens_readHuskyLens',
    'CodeWiz_HuskyLens_isLearnedHuskyLens',
    'CodeWiz_HuskyLens_isContainHuskyLens',
    'CodeWiz_HuskyLens_getCountLearnedHuskyLens',
    'CodeWiz_HuskyLens_hasTypeHuskyLens',
    'CodeWiz_HuskyLens_getArrowInfoHuskyLens',
    'CodeWiz_HuskyLens_getBoxInfoHuskyLens',
    'CodeWiz_HuskyLens_writeTextHuskyLens',
    'CodeWiz_HuskyLens_clearTextHuskyLens',

    'CodeWiz_Servo_title',
    'CodeWiz_Servo_setAngle',
    'CodeWiz_Servo_menuSpeed',
    'CodeWiz_Servo_customSpeed',

    'CodeWiz_Dc_title',
    'CodeWiz_Dc_setValue',
    'CodeWiz_Dc_setValue_Waterpump',

    'CodeWiz_DotMatrix_title',
    'CodeWiz_DotMatrix_init',
    'CodeWiz_DotMatrix_setBrightness',
    'CodeWiz_DotMatrix_printString',
    'CodeWiz_DotMatrix_setLine',
    'CodeWiz_DotMatrix_setDot',
    'CodeWiz_DotMatrix_clear',
    'CodeWiz_DotMatrix_clearAll',

    'CodeWiz_ColorSensor_title',
    'CodeWiz_ColorSensor_isColor',
    'CodeWiz_ColorSensor_getColorValue',

    'CodeWiz_DHT_title',
    'CodeWiz_DHT_init',
    'CodeWiz_DHT_getValue',

    'CodeWiz_Joystick_title',
    'CodeWiz_Joystick_setPin',
    'CodeWiz_Joystick_readAxis',
    'CodeWiz_Joystick_readButton',

    'CodeWiz_etcReadSensor_title',
    'CodeWiz_etcReadSensor_mconRead',
    'CodeWiz_etcReadSensor_digitalRead',
    'CodeWiz_etcReadSensor_InfraredThermometerRead',
];
Entry.CodeWiz.preWait = function() {
    return new Promise((resolve) => {
        let tmp = setInterval(() => {
            // console.log('preWait:', Entry.CodeWiz.intervalId);
            if (!Entry.CodeWiz.intervalId) {
                clearInterval(tmp);
                // Entry.CodeWiz.preWaitResult = Entry.CodeWiz.preWaitList.shift() || null;
                resolve();
            }
        }, 11);
    });
};
Entry.CodeWiz.checkComplete = function(timeout, id) {
    let _promise = new Promise((resolve) => {
        timeout = timeout?? 1000;
        Entry.CodeWiz.intervalId = setInterval(() => {
            // console.log(Entry.CodeWiz.intervalId, 'runOK:', Entry.hw.portData[id]);
            let ret = Entry.hw.portData[id]?.value;
            if (ret!==undefined&& ret !== null) {
                clearInterval(Entry.CodeWiz.intervalId);
                clearTimeout(Entry.CodeWiz.timeoutId);
                Entry.CodeWiz.intervalId = null;
                Entry.CodeWiz.timeoutId = null;
                resolve();
            }
        }, 7);
        Entry.CodeWiz.timeoutId = setTimeout(() => {
            clearInterval(Entry.CodeWiz.intervalId);
            // console.log(Entry.CodeWiz.intervalId, 'timeOut');
            Entry.CodeWiz.intervalId = null;
            Entry.CodeWiz.timeoutId = null;
            // throw new Entry.Utils.AsyncError('TimeOutOccurred');
            resolve();
        }, timeout);
    });
    return _promise;
};

Entry.CodeWiz.getBlocks = function() {
    return {
        //region codeino 코드위즈
        CodeWiz_sensor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_sensor_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_sensor_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_sensor_title',
            },
            class: 'CodeWiz_default_sensor',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_get_sensor: {
            // Block UI : %1센서 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['소리', 'SOUND'],
                        ['빛', 'LIGHT'],
                        ['거리', 'DIST'],
                        ['홀', 'HALL'],
                        ['온도', 'tempSensor'],
                    ],
                    value: 'SOUND',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'CodeWiz_get_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SENSOR', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData[sensor] ?? 0;
            },
        },
        CodeWiz_get_gyroSensor: {
            // Block UI : 자이로 센서 %1값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', 'GYRO_X'],
                        ['Y', 'GYRO_Y'],
                        ['Z', 'GYRO_Z'],
                    ],
                    value: 'GYRO_X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'CodeWiz_get_gyroSensor',
            },
            paramsKeyMap: {
                GYRO_TYPE: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('GYRO_TYPE', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData[sensor]?? 0;
            },
        },
        CodeWiz_isPushedButton: {
            // Block UI : %1 스위치 버튼 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'switchButton_26'],
                        ['오른쪽', 'switchButton_4'],
                    ],
                    value: 'switchButton_26',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_isPushedButton',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SWITCH', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData[sensor] ?? false;
            },
        },
        CodeWiz_touchPin: {
            // Block UI : "터치핀 %1 값",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['🔆(13)', 'touchPin_13'],
                        ['⭕(14)', 'touchPin_14'],
                        ['🖐(15)', 'touchPin_15'],
                        ['👊(27)', 'touchPin_27'],
                        ['🐻(32)', 'touchPin_32'],
                        ['❌(33)', 'touchPin_33'],
                    ],
                    value: 'touchPin_32',
                    fontSize: 14,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_touchPin',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SWITCH', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData[sensor] ?? 0;
            },
        },
        CodeWiz_buzzer_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_buzzer_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_buzzer_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_buzzer_title',
            },
            class: 'CodeWiz_buzzer',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_default_buzzer: {
            // Block UI : "스피커를 %1옥타브, %2음, %3분음표로 연주하기%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['도', '0'],
                        ['도#', '1'],
                        ['레', '2'],
                        ['미♭', '3'],
                        ['미', '4'],
                        ['파', '5'],
                        ['파#', '6'],
                        ['솔', '7'],
                        ['솔#', '8'],
                        ['라', '9'],
                        ['시♭', '10'],
                        ['시', '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['4', '4'],
                        ['8', '8'],
                        ['16', '16'],
                        ['32', '32'],
                    ],
                    value: '4',
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
                params: [null, null, null],
                type: 'CodeWiz_default_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                BEAT: 2,
            },
            class: 'CodeWiz_buzzer',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let octave = Number.parseInt(script.getValue('OCTAVE', script));
                let note = Number.parseInt(script.getValue('NOTE', script));
                let beat = Number.parseInt(script.getValue('BEAT', script));

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 1,
                        params: [octave, note, beat],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);

                await Entry.CodeWiz.checkComplete(1234, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_neopixel_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_neopixel_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_neopixel_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_neopixel_title',
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_neopixel_init: {
            // Block UI : "네오픽셀 %1에 %2개로 시작설정%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['코드위즈', '23'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '23',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: 5,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_neopixel_init',
            },
            paramsKeyMap: {
                PIN: 0,
                COUNT: 1,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _pin = script.getNumberValue('PIN', script);
                let _count = script.getNumberValue('COUNT', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 32,
                        params: [_pin, _count],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_brightness: {
            // Block UI : "네오픽셀 밝기를 %1로 설정(0~255)%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: 22,
                },

                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'CodeWiz_neopixel_brightness',
            },
            paramsKeyMap: {
                BRIGHTNESS: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let value = script.getNumberValue('BRIGHTNESS', script);
                value = Math.round(value);
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 2,
                        params: [value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_setColor_one: {
            // Block UI : "네오픽셀 %1번 LED를 <색상표>%2(으)로 켜기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', null, null],
                type: 'CodeWiz_neopixel_setColor_one',
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let num = script.getNumberValue('NUM', script) - 1;
                let value = script.getStringField('COLOR', script);

                let colorValue = [
                    parseInt(value.substr(1, 2), 16),
                    parseInt(value.substr(3, 2), 16),
                    parseInt(value.substr(5, 2), 16),
                ];
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 3,
                        params: [num, ...colorValue],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_setColor_one2: {
            // Block UI : "네오픽셀 %1번 LED를 빨강%2초록%3파랑%4(으)로 켜기%5",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '255', '255', '255', null],
                type: 'CodeWiz_neopixel_setColor_one2',
            },
            paramsKeyMap: {
                NUM: 0,
                R: 1,
                G: 2,
                B: 3,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let num = script.getNumberValue('NUM', script) - 1;
                let r = script.getNumberValue('R', script);
                let g = script.getNumberValue('G', script);
                let b = script.getNumberValue('B', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 3,
                        params: [num, r, g, b],
                    },
                };

                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_off_one: {
            // Block UI : "네오픽셀 %1번 LED 끄기%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', null],
                type: 'CodeWiz_neopixel_off_one',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let num = script.getNumberValue('NUM', script) - 1;
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 4,
                        params: [num],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_setColor_all: {
            // Block UI : "네오픽셀 %1(으)로 모두 켜기%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_neopixel_setColor_all',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let value = script.getStringField('COLOR', script);

                let colorValue = [
                    parseInt(value.substr(1, 2), 16),
                    parseInt(value.substr(3, 2), 16),
                    parseInt(value.substr(5, 2), 16),
                ];
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 5,
                        params: [...colorValue],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_setColor_all2: {
            // Block UI : "네오픽셀 빨강%1초록%2파랑%3(으)로 모두 켜기%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['255', '255', '255', null],
                type: 'CodeWiz_neopixel_setColor_all2',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let r = script.getNumberValue('R', script);
                let g = script.getNumberValue('G', script);
                let b = script.getNumberValue('B', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 5,
                        params: [r, g, b],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_off_all: {
            // Block UI : "네오픽셀 모두 끄기%1",
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
                params: [],
                type: 'CodeWiz_neopixel_off_all',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 6,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_OnPixelRandomColor: {
            // 랜덤색상 켜기 - 단일
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', null],
                type: 'CodeWiz_neopixel_OnPixelRandomColor',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let num = script.getNumberValue('NUM', script) - 1;
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 3,
                        params: [
                            num, 
                            Math.floor(Math.random()*256), 
                            Math.floor(Math.random()*256),
                            Math.floor(Math.random()*256)
                        ],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_fillRandom: {
            // 랜덤색상 켜기 - 전체
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
                params: [],
                type: 'CodeWiz_neopixel_fillRandom',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 43,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_rotate: {
            // rotate 네오픽셀
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['역방향', '0'],
                        ['정방향', '1'],
                    ],
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
            def: {
                params: [null],
                type: 'CodeWiz_neopixel_rotate',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _dir = script.getNumberValue('DIR', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 44,
                        params: [_dir],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_shift: {
            // shift 네오픽셀
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['역방향', '0'],
                        ['정방향', '1'],
                    ],
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
            def: {
                params: [null],
                type: 'CodeWiz_neopixel_shift',
            },
            paramsKeyMap: {
                DIR: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _dir = script.getNumberValue('DIR', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 45,
                        params: [_dir],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_gradationRGB: {
            // RGB그라데이션
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '8', '#ff0000', '#00ff00'],
                type: 'CodeWiz_neopixel_gradationRGB',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                S_COLOR:2,
                E_COLOR: 3,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _start = script.getNumberValue('START', script) - 1;
                let _end = script.getNumberValue('END', script) - 1;
                let _sColor = script.getStringField('S_COLOR', script);
                let _eColor = script.getStringField('E_COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 46,
                        params: [_start, _end, _sColor, _eColor],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_gradationHSL: {
            // HSL그라데이션
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '8', '#ff0000', '#611ca1'],
                type: 'CodeWiz_neopixel_gradationHSL',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                S_COLOR:2,
                E_COLOR: 3,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _start = script.getNumberValue('START', script) - 1;
                let _end = script.getNumberValue('END', script) - 1;
                let _sColor = script.getStringField('S_COLOR', script);
                let _eColor = script.getStringField('E_COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 47,
                        params: [_start, _end, _sColor, _eColor],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_neopixel_wheeeeeeel: {
            // 휠 - 엔트리에선 느려서 활용도가 떨어질 것으로 예상해서 일단 주석
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
                params: [],
                type: 'CodeWiz_neopixel_wheeeeeeel',
            },
            paramsKeyMap: {
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 49,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                // console.log(script.key);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_OLED_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_OLED_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_OLED_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_OLED_title',
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_OLED_clear: {
            // Block UI : "OLED 지우기%1",
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
                params: [],
                type: 'CodeWiz_OLED_clear',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 7,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_mirror: {
            // Block UI : "OLED 반전모드%1 %2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_OLED_mirror',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getNumberValue('SWITCH', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 8,
                        params: [_value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_setSize: {
            // Block UI : "OLED 문자 크기를 %1(으)로 설정%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [3],
                type: 'CodeWiz_OLED_setSize',
            },
            paramsKeyMap: {
                SIZE: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getNumberValue('SIZE', script);
                _value = Math.round(_value);
                if (_value < 1) {
                    _value = 1;
                } else if (_value > 10) {
                    _value = 10;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 9,
                        params: [_value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_setPosition: {
            // Block UI : "OLED 커서위치(%1,%2)(으)로 지정%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['0', '0'],
                type: 'CodeWiz_OLED_setPosition',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _x = script.getNumberValue('X', script);
                _x = Math.round(_x);
                if (_x < 0) {
                    _x = 0;
                } else if (_x > 255) {
                    _x = 255;
                }

                let _y = script.getNumberValue('Y', script);
                _y = Math.round(_y);
                if (_y < 0) {
                    _y = 0;
                } else if (_y > 255) {
                    _y = 255;
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 10,
                        params: [_x, _y],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_println: {
            // Block UI : "OLED에 %1출력%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['Hello, World!!'],
                type: 'CodeWiz_OLED_println',
            },
            paramsKeyMap: {
                TEXT: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getStringValue('TEXT');

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 11,
                        params: [_value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_isCollision: {
            // Block UI : "OLED 문자겹침 모드%1%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
                    ],
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
            def: {
                params: [null],
                type: 'CodeWiz_OLED_isCollision',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getNumberValue('SWITCH', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 12,
                        params: [_value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_specialChar: {
            // Block UI : "OLED에 기호%1 출력하기%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['♥', '3'],
                        ['◆', '4'],
                        ['♣', '5'],
                        ['♠', '6'],
                        ['♬', '14'],
                        ['▲', '30'],
                        ['▼', '31'],

                        ['😧', '1'],
                        ['😀', '2'],
                        ['♂', '11'],
                        ['♀', '12'],
                        ['↑', '24'],
                        ['↓', '25'],
                        ['→', '26'],
                        ['←', '27'],
                    ],
                    value: '14',
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
                params: [null],
                type: 'CodeWiz_OLED_specialChar',
            },
            paramsKeyMap: {
                CHAR: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getNumberValue('CHAR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 13,
                        params: [_value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_setFont: {
            // Block UI : "OLED 폰트%1를 크기%2(으)로 설정%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Serif', '0'],
                        ['Sans', '1'],
                        ['Mono', '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['9', '0'],
                        ['12', '1'],
                        ['18', '2'],
                    ],
                    value: '0',
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
                params: [null, null],
                type: 'CodeWiz_OLED_setFont',
            },
            paramsKeyMap: {
                FONT: 0,
                SIZE: 1,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getNumberValue('FONT', script);
                let _size = script.getNumberValue('SIZE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 14,
                        params: [_value, _size],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_startScroll: {
            // Block UI : "OLED 스크롤 시키기 옵션(%1, 범위%2~%3(0~7))%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['→', '0'],
                        ['←', '1'],
                        ['↗', '2'],
                        ['↖', '3'],
                    ],
                    value: '0',
                    fontSize: 14,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '0', '0'],
                type: 'CodeWiz_OLED_startScroll',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                START: 1,
                END: 2,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = Number.parseInt(script.getNumberValue('DIRECTION', script));
                let _st = Number.parseInt(script.getNumberValue('START', script));
                _st = Math.round(_st);
                if (_st < 0) {
                    _x = 0;
                } else if (_st > 7) {
                    _st = 7;
                }
                let _ed = script.getNumberValue('END', script);
                _ed = Math.round(_ed);
                if (_ed < 0) {
                    _ed = 0;
                } else if (_ed > 7) {
                    _ed = 7;
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 15,
                        params: [_value, _st, _ed],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_stopScroll: {
            // Block UI : "OLED 스크롤 멈추기%1",
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
                params: [],
                type: 'CodeWiz_OLED_stopScroll',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 16,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawPoint: {
            // Block UI : "OLED에 점찍기 옵션((%1,%2), %3)%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: [63, 31, null],
                type: 'CodeWiz_OLED_drawPoint',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                COLOR: 2,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _x = script.getNumberValue('X', script);
                _x = Math.round(_x);
                if (_x < 0) {
                    _x = 0;
                } else if (_x > 128) {
                    _x = 128;
                }

                let _y = script.getNumberValue('Y', script);
                _y = Math.round(_y);
                if (_y < 0) {
                    _y = 0;
                } else if (_y > 64) {
                    _y = 64;
                }

                let _color = script.getNumberValue('COLOR', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 17,
                        params: [_x, _y, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawLine1: {
            // Block UI : "OLED에 선 그리기 옵션((%1,%2)~(%3,%4), %5)%6",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['0', '0', '10', '0', null],
                type: 'CodeWiz_OLED_drawLine1',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                EX: 2,
                EY: 3,
                COLOR: 4,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _ex = script.getNumberValue('EX', script);
                _ex = Math.round(_ex);
                if (_ex < 0) {
                    _ex = 0;
                } else if (_ex > 128) {
                    _ex = 128;
                }
                let _ey = script.getNumberValue('EY', script);
                _ey = Math.round(_ey);
                if (_ey < 0) {
                    _ey = 0;
                } else if (_ey > 64) {
                    _ey = 64;
                }
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 18,
                        params: [_sx, _sy, _ex, _ey, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawLine2: {
            // Block UI : "OLED에 수직 선 그리기 옵션((%1,%2), 길이%3, %4)%5",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['0', '0', '10', null],
                type: 'CodeWiz_OLED_drawLine2',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                LEN: 2,
                COLOR: 3,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _len = script.getNumberValue('LEN', script);
                _len = Math.round(_len);
                if (_len < 0) {
                    _len = 0;
                } else if (_len > 64) {
                    _len = 64;
                }
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 19,
                        params: [_sx, _sy, _len, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawLine3: {
            // Block UI : "OLED에 수평 선 그리기 옵션((%1,%2), 길이%3, %4)%5",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['0', '0', '10', null],
                type: 'CodeWiz_OLED_drawLine3',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                LEN: 2,
                COLOR: 3,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _len = script.getNumberValue('LEN', script);
                _len = Math.round(_len);
                if (_len < 0) {
                    _len = 0;
                } else if (_len > 128) {
                    _len = 128;
                }
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 20,
                        params: [_sx, _sy, _len, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawRect: {
            // Block UI : "OLED에 직사각형 그리기 옵션(좌상단점(%1,%2), 가로%3, 세로%4, %5, %6)%7",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['비움', '0'],
                        ['채움', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['0', '0', '10', '10', null, null],
                type: 'CodeWiz_OLED_drawRect',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                WIDTH: 2,
                HEIGHT: 3,
                ISFILL: 4,
                COLOR: 5,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _width = script.getNumberValue('WIDTH', script);
                _width = Math.round(_width);
                if (_width < 0) {
                    _width = 0;
                } else if (_width > 128) {
                    _width = 128;
                }
                let _height = script.getNumberValue('HEIGHT', script);
                _height = Math.round(_height);
                if (_height < 0) {
                    _height = 0;
                } else if (_height > 64) {
                    _height = 64;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 21,
                        x: _sx,
                        y: _sy,
                        params: [_sx, _sy, _width, _height, _isFill, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawCircle: {
            // Block UI : "OLED에 원 그리기 옵션(중심(%1,%2) 반지름%3, %4, %5)%6",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['비움', '0'],
                        ['채움', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['30', '30', '10', null, null],
                type: 'CodeWiz_OLED_drawCircle',
            },
            paramsKeyMap: {
                RX: 0,
                RY: 1,
                RAD: 2,
                ISFILL: 3,
                COLOR: 4,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _rx = script.getNumberValue('RX', script);
                _rx = Math.round(_rx);
                if (_rx < 0) {
                    _rx = 0;
                } else if (_rx > 128) {
                    _rx = 128;
                }
                let _ry = script.getNumberValue('RY', script);
                _ry = Math.round(_ry);
                if (_ry < 0) {
                    _ry = 0;
                } else if (_ry > 64) {
                    _ry = 64;
                }
                let _rad = script.getNumberValue('RAD', script);
                _rad = Math.round(_rad);
                if (_rad < 0) {
                    _rad = 0;
                } else if (_rad > 255) {
                    _rad = 255;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 22,
                        params: [_rx, _ry, _rad, _isFill, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_drawPoligon: {
            // Block UI : "OLED에 삼각형 그리기 옵션((%1,%2), (%3,%4), (%5,%6), %7, %8)%9",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['비움', '0'],
                        ['채움', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['검은색', '0'],
                        ['흰색', '1'],
                    ],
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
            def: {
                params: ['0', '9', '6', '9', '3', '0', null, null],
                type: 'CodeWiz_OLED_drawPoligon',
            },
            paramsKeyMap: {
                X1: 0,
                Y1: 1,
                X2: 2,
                Y2: 3,
                X3: 4,
                Y3: 5,
                ISFILL: 6,
                COLOR: 7,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _x1 = script.getNumberValue('X1', script);
                _x1 = Math.round(_x1);
                if (_x1 < 0) {
                    _x1 = 0;
                } else if (_x1 > 128) {
                    _x1 = 128;
                }
                let _y1 = script.getNumberValue('Y1', script);
                _y1 = Math.round(_y1);
                if (_y1 < 0) {
                    _y1 = 0;
                } else if (_y1 > 64) {
                    _y1 = 64;
                }
                let _x2 = script.getNumberValue('X2', script);
                _x2 = Math.round(_x2);
                if (_x2 < 0) {
                    _x2 = 0;
                } else if (_x2 > 128) {
                    _x2 = 128;
                }
                let _y2 = script.getNumberValue('Y2', script);
                _y2 = Math.round(_y2);
                if (_y2 < 0) {
                    _y2 = 0;
                } else if (_y2 > 64) {
                    _y2 = 64;
                }
                let _x3 = script.getNumberValue('X3', script);
                _x3 = Math.round(_x3);
                if (_x3 < 0) {
                    _x3 = 0;
                } else if (_x3 > 128) {
                    _x3 = 128;
                }
                let _y3 = script.getNumberValue('Y3', script);
                _y3 = Math.round(_y3);
                if (_y3 < 0) {
                    _y3 = 0;
                } else if (_y3 > 64) {
                    _y3 = 64;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 23,
                        params: [_x1, _y1, _x2, _y2, _x3, _y3, _isFill, _color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_OLED_printHG: {
            // OLED 한글 출력
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['❌', '0'],
                        ['⭕', '1'],
                    ],
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
            def: {
                params: ['코드위즈 Magic!!', null],
                type: 'CodeWiz_OLED_printHG',
            },
            paramsKeyMap: {
                TEXT: 0,
                isLB: 1,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _value = script.getStringValue('TEXT');
                let _isLB = script.getNumberValue('isLB', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 42,
                        params: [_value, _isLB],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DIGITAL_OUTPUT_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_DIGITAL_OUTPUT_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_DIGITAL_OUTPUT_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_DIGITAL_OUTPUT_title',
            },
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_DIGITAL_OUTPUT_digitalWrite: {
            // Block UI : "터치센서 디지털 %1(으)로 %2내보내기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['LOW', '0'],
                        ['HIGH', '1'],
                    ],
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
            def: {
                params: [null, null],
                type: 'CodeWiz_DIGITAL_OUTPUT_digitalWrite',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _pin = script.getNumberValue('PIN', script);
                let _val = script.getNumberValue('VALUE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 25,
                        params: [_pin, _val],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DIGITAL_OUTPUT_pwmWrite: {
            // Block UI : "터치센서 PWM %1(으)로 %2내보내기(0~1023)%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '0'],
                type: 'CodeWiz_DIGITAL_OUTPUT_pwmWrite',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _pin = script.getNumberValue('PIN', script);
                let _val = script.getNumberValue('VALUE', script);
                _val = Math.round(_val);
                if (_val < 0) {
                    _val = 0;
                } else if (_val > 1023) {
                    _val = 1023;
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 26,
                        params: [_pin, _val],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_HuskyLens_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_HuskyLens_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_HuskyLens_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_HuskyLens_title',
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_HuskyLens_initHuskyLens: {
            // Block UI : '허스키렌즈 시작설정%1',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_initHuskyLens',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 27,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_HuskyLens_setModeOfHuskyLens: {
            // Block UI : '허스키렌즈 %1알고리즘으로 설정%2'
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1.FACE_RECOGNITION', '0'],
                        ['2.OBJECT_TRACKING', '1'],
                        ['3.OBJECT_RECOGNITION', '2'],
                        ['4.LINE_TRACKING', '3'],
                        ['5.COLOR_RECOGNITION', '4'],
                        ['6.TAG_RECOGNITION', '5'],
                        ['7.OBJECT_CLASSIFICATION', '6'],
                    ],
                    value: '2',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_setModeOfHuskyLens',
            },
            paramsKeyMap: {
                MODE: 0,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let mode = script.getNumberValue('MODE', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 28,
                        params: [mode],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_HuskyLens_readHuskyLens: {
            // Block UI : "허스키렌즈 데이터 요청(읽기)%1",
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
                params: [],
                type: 'CodeWiz_HuskyLens_readHuskyLens',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 29,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_HuskyLens_isLearnedHuskyLens: {
            // Block UI : "허스키렌즈 ID가%1인 데이터를 학습했는가?%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1, null],
                type: 'CodeWiz_HuskyLens_isLearnedHuskyLens',
            },
            paramsKeyMap: {
                ID: 0,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let learnId = script.getNumberValue('ID', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 1,
                        params: [learnId],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                let retVal = Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];

                return retVal;
            },
        },
        CodeWiz_HuskyLens_isContainHuskyLens: {
            // Block UI : "허스키렌즈 ID:%1로 인식한 %2데이터가 있는가?%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['사각형', '42'],
                        ['화살표', '43'],
                    ],
                    value: '42',
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
                params: [1, null, null],
                type: 'CodeWiz_HuskyLens_isContainHuskyLens',
            },
            paramsKeyMap: {
                ID: 0,
                TYPE: 1,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _learnId = script.getNumberValue('ID', script);
                let _type = script.getNumberValue('TYPE', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 2,
                        params: [_learnId, _type],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                let retVal= Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];
                return retVal;
            },
        },
        CodeWiz_HuskyLens_getCountLearnedHuskyLens: {
            // Block UI : "허스키렌즈가 학습한 데이터의 개수%1",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_getCountLearnedHuskyLens',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 3,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal;
            },
        },
        CodeWiz_HuskyLens_hasTypeHuskyLens: {
            // Block UI : "허스키렌즈가 읽은 데이터 타입이%1인가?%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['사각형', '42'],
                        ['화살표', '43'],
                    ],
                    value: '42',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_hasTypeHuskyLens',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _type = script.getNumberValue('TYPE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 4,
                        params: [_type],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_HuskyLens_getArrowInfoHuskyLens: {
            // Block UI : "허스키렌즈가 읽은 화살표정보%1(첫 인식 1개)%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['시작 X좌표', '0'],
                        ['시작 Y좌표', '1'],
                        ['종료 X좌표', '2'],
                        ['종료 Y좌표', '3'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_getArrowInfoHuskyLens',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _arrowType = script.getNumberValue('TYPE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 5,
                        params: [_arrowType],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_HuskyLens_getBoxInfoHuskyLens: {
            // Block UI : "허스키렌즈가 읽은 사각형정보%1(중심좌표가 중앙에 가장 가까운 것)%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID', '0'],
                        ['중심 X좌표', '1'],
                        ['중심 Y좌표', '2'],
                        ['너비', '3'],
                        ['높이', '4'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_HuskyLens_getBoxInfoHuskyLens',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _boxType = script.getNumberValue('TYPE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 6,
                        params: [_boxType],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_HuskyLens_writeTextHuskyLens: {
            // Block UI : "허스키렌즈 x:%1 y:%2에 %3출력%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [0, 0, 'CodeWiz'],
                type: 'CodeWiz_HuskyLens_writeTextHuskyLens',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                TEXT: 2,
            },
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _x = script.getNumberValue('X', script);
                let _y = script.getNumberValue('Y', script);
                let _text = script.getStringValue('TEXT');

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 30,
                        params: [_x, _y, _text],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_HuskyLens_clearTextHuskyLens: {
            // Block UI : "허스키렌즈 텍스트 지우기%1",
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
                params: [],
                type: 'CodeWiz_HuskyLens_clearTextHuskyLens',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_HuskyLens',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 31,
                        params: [],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_Servo_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_Servo_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_Servo_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_Servo_title',
            },
            class: 'CodeWiz_Servo',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_Servo_setAngle: {
            // Block UI : "서보모터(%1) 각도를 %2로 바꾸기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['SCON', '18.0'],
                        ['MCON-18', '18.1'],
                        ['MCON-19', '19'],
                        ['MCON-15', '15'],
                        ['MCON-27', '27'],
                    ],
                    value: '18.0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '0'],
                type: 'CodeWiz_Servo_setAngle',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_Servo',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _pin = Number.parseInt(script.getNumberValue('PIN', script));
                let _value = Number.parseInt(script.getNumberValue('VALUE', script));
                _value = Math.round(_value);
                if (_value < 0) {
                    _value = 0;
                } else if (_value > 180) {
                    _value = 180;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 33,
                        params: [_pin, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_Servo_menuSpeed: {
            // Block UI : "무한회전 서보모터(%1) %2속도로 정하기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['SCON', '18.0'],
                        ['MCON-18', '18.1'],
                        ['MCON-19', '19'],
                        ['MCON-15', '15'],
                        ['MCON-27', '27'],
                    ],
                    value: '18.0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['빠른', '21'],
                        ['보통', '39'],
                        ['느린', '58'],
                        ['멈춘', '76'],
                    ],
                    value: '21',
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
                params: [null, null],
                type: 'CodeWiz_Servo_menuSpeed',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_Servo',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _pin = Number.parseInt(script.getNumberValue('PIN', script));
                let _value = script.getNumberValue('VALUE', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 34,
                        params: [_pin, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_Servo_customSpeed: {
            // Block UI : "무한회전 서보모터(%1) %2속도로 정하기(-100~100)%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['SCON', '18.0'],
                        ['MCON-18', '18.1'],
                        ['MCON-19', '19'],
                        ['MCON-15', '15'],
                        ['MCON-27', '27'],
                    ],
                    value: '18.0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '100'],
                type: 'CodeWiz_Servo_customSpeed',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_Servo',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _pin = Number.parseInt(script.getNumberValue('PIN', script));
                let _value = Number.parseInt(script.getNumberValue('VALUE', script));
                if (_value < -100) {
                    _value = -100;
                } else if (_value > 100) {
                    _value = 100;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 35,
                        params: [_pin, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_Dc_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_Dc_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_Dc_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_Dc_title',
            },
            class: 'CodeWiz_Dc',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_Dc_setValue: {
            // Block UI : 'WizCar 모터(%1)에 %2방향으로 %3내보내기(0~1023)%4',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['MOTOR_L', '0'],
                        ['MOTOR_R', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계', '0'],
                        ['반시계', '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, '1023'],
                type: 'CodeWiz_Dc_setValue',
            },
            paramsKeyMap: {
                PIN: 0,
                DIR: 1,
                VALUE: 2,
            },
            class: 'CodeWiz_Dc',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _pin = script.getNumberValue('PIN', script);
                let _dir = script.getNumberValue('DIR', script);
                let _value = Number.parseInt(script.getNumberValue('VALUE', script));
                if (_value < 0) {
                    _value = 0;
                } else if (_value > 1023) {
                    _value = 1023;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 36,
                        params: [_pin, _dir, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_Dc_setValue_Waterpump: {
            // 워터펌프
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['MOTOR_L', '0'],
                        ['MOTOR_R', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '1023'],
                type: 'CodeWiz_Dc_setValue_Waterpump',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_Dc',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _pin = script.getNumberValue('PIN', script);
                let _value = Number.parseInt(script.getNumberValue('VALUE', script));
                if (_value < 0) {
                    _value = 0;
                } else if (_value > 1023) {
                    _value = 1023;
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 36,
                        params: [_pin, 1, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_DotMatrix_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_DotMatrix_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_DotMatrix_title',
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_DotMatrix_init: {
            // Block UI : '도트매트릭스 %1개 DIN%2, CS%3, CLK%4에 시작설정%5',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['18', '18'],
                        ['19', '19'],
                        ['15', '15'],
                        ['27', '27'],
                    ],
                    value: '18',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['18', '18'],
                        ['19', '19'],
                        ['15', '15'],
                        ['27', '27'],
                    ],
                    value: '19',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['18', '18'],
                        ['19', '19'],
                        ['15', '15'],
                        ['27', '27'],
                    ],
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
            def: {
                params: ['1', null, null, null],
                type: 'CodeWiz_DotMatrix_init',
            },
            paramsKeyMap: {
                COUNT: 0,
                PIN1: 1,
                PIN2: 2,
                PIN3: 3,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _count = Number.parseInt(script.getNumberValue('COUNT', script));
                if (_count <= 0) {
                    return;
                } else if (_count > 8) {
                    _count = 8;
                }
                let _pins = [
                    script.getNumberValue('PIN1', script),
                    script.getNumberValue('PIN2', script),
                    script.getNumberValue('PIN3', script),
                ];

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 24,
                        params: [_count, ..._pins],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_setBrightness: {
            // Block UI : '도트매트릭스 %1번 밝기를 %2로 설정%3',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '8'],
                type: 'CodeWiz_DotMatrix_setBrightness',
            },
            paramsKeyMap: {
                NUM: 0,
                BRIGHTNESS: 1,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _num = Number.parseInt(script.getNumberValue('NUM', script));
                if (_num < 1) {
                    num = 1;
                } else if (_num > 8) {
                    _num = 8;
                }
                let _brightness = Number.parseInt(script.getNumberValue('BRIGHTNESS', script));
                if (_brightness < 1) {
                    _brightness = 1;
                } else if (_brightness > 15) {
                    _brightness = 15;
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 37,
                        params: [_num, _brightness],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_printString: {
            // Block UI : '도트매트릭스 %1번에 문자열%2 출력%3',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', 'HELLO'],
                type: 'CodeWiz_DotMatrix_printString',
            },
            paramsKeyMap: {
                NUM: 0,
                TEXT: 1,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _num = Number.parseInt(script.getNumberValue('NUM', script));
                if (_num < 1) {
                    num = 1;
                } else if (_num > 8) {
                    _num = 8;
                }
                let _value = script.getStringValue('TEXT');

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 38,
                        params: [_num, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_setLine: {
            // Block UI : '도트매트릭스 %1번에 %2번%3 %4로 만들기%5',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['행', '1'],
                        ['열', '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '2', null, '11111111'],
                type: 'CodeWiz_DotMatrix_setLine',
            },
            paramsKeyMap: {
                NUM: 0,
                NUM_LINE: 1,
                IS_ROW: 2,
                VALUE: 3,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _num = Number.parseInt(script.getNumberValue('NUM', script));
                if (_num < 1) {
                    num = 1;
                } else if (_num > 8) {
                    _num = 8;
                }
                let _numLine = Number.parseInt(script.getNumberValue('NUM_LINE', script));
                if (_numLine < 1) {
                    _numLine = 1;
                } else if (_numLine > 8) {
                    _numLine = 8;
                }
                let _isRow = script.getNumberValue('IS_ROW', script);
                let _value = script.getStringValue('VALUE');
                const _f = (str) => {
                    str = str.substring(0, 8);
                    let retVal = '';
                    for (let i = 0; i < str.length; ++i) {
                        if (str[i] === '0' || str[i] === ' ') {
                            retVal += '0';
                        } else {
                            retVal += '1';
                        }
                    }
                    return retVal.padStart(8, '0');
                };
                _value = _f(_value);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 39,
                        params: [_num, _numLine, _isRow, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_setDot: {
            // Block UI : '도트매트릭스 %1번에 %2행%3열 %4%5',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', '1'],
                        ['끄기', '0'],
                    ],
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
            def: {
                params: ['1', '2', '2', null],
                type: 'CodeWiz_DotMatrix_setDot',
            },
            paramsKeyMap: {
                NUM: 0,
                ROW: 1,
                COL: 2,
                VALUE: 3,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _num = Number.parseInt(script.getNumberValue('NUM', script));
                if (_num < 1) {
                    num = 1;
                } else if (_num > 8) {
                    _num = 8;
                }
                let _numRow = Number.parseInt(script.getNumberValue('ROW', script));
                if (_numRow < 1) {
                    _numRow = 1;
                } else if (_numRow > 8) {
                    _numRow = 8;
                }
                let _numCol = Number.parseInt(script.getNumberValue('COL', script));
                if (_numCol < 1) {
                    _numCol = 1;
                } else if (_numCol > 8) {
                    _numCol = 8;
                }
                let _value = script.getNumberValue('VALUE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 40,
                        params: [_num, _numRow, _numCol, _value],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_clear: {
            // Block UI : '도트매트릭스 %1번 지우기%2',
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'CodeWiz_DotMatrix_clear',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _num = Number.parseInt(script.getNumberValue('NUM', script));
                if (_num < 1) {
                    num = 1;
                } else if (_num > 8) {
                    _num = 8;
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 41,
                        params: [_num - 1],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },
        CodeWiz_DotMatrix_clearAll: {
            // Block UI : '도트매트릭스 모두 지우기%1',
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
                params: [],
                type: 'CodeWiz_DotMatrix_clearAll',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_DotMatrix',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 41,
                        params: [-1],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                delete Entry.hw.portData[id];
            },
        },

        CodeWiz_ColorSensor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_ColorSensor_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_ColorSensor_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_ColorSensor_title',
            },
            class: 'CodeWiz_ColorSensor',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_ColorSensor_isColor: {
            // Block UI : "MCON 컬러센서 감지된 색이 %1인가%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', '0'],
                        ['초록', '1'],
                        ['파랑', '2'],
                        ['검정', '3'],
                        ['흰색', '4'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_ColorSensor_isColor',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'CodeWiz_ColorSensor',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _color = script.getNumberValue('COLOR', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 8,
                        params: [_color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_ColorSensor_getColorValue: {
            // Block UI : "MCON 컬러센서 %1값%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', '0'],
                        ['초록', '1'],
                        ['파랑', '2'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_ColorSensor_getColorValue',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'CodeWiz_ColorSensor',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _color = script.getNumberValue('COLOR', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 9,
                        params: [_color],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal
            },
        },

        CodeWiz_DHT_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_DHT_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_DHT_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_DHT_title',
            },
            class: 'CodeWiz_DHT',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_DHT_init: {
            // 디지털온습도 설정
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '18',
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
                params: [null],
                type: 'CodeWiz_DHT_init',
            },
            paramsKeyMap: {
                PIN: 0,
            },
            class: 'CodeWiz_DHT',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _pin = script.getNumberValue('PIN', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 48,
                        params: [_pin],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
            },
        },
        CodeWiz_DHT_getValue: {
            // 디지털 온습도 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['℃', '0'],
                        ['℉', '1'],
                        ['습도', '2'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_DHT_getValue',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'CodeWiz_DHT',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _type = script.getNumberValue('TYPE', script);
                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 12,
                        params: [_type],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0.0;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_Joystick_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.CodeWiz_Joystick_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_Joystick_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_Joystick_title',
            },
            class: 'CodeWiz_Joystick',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_Joystick_setPin: {
            // 조이스틱 설정
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['32', '32'],
                        ['33', '33'],
                        ['36', '36'],
                        ['39', '39'],
                    ],
                    value: '36',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['32', '32'],
                        ['33', '33'],
                        ['36', '36'],
                        ['39', '39'],
                    ],
                    value: '39',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '15',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null, 12],
                type: 'CodeWiz_Joystick_setPin',
            },
            paramsKeyMap: {
                PIN_X: 0,
                PIN_Y: 1,
                PIN_B: 2,
                RANGE: 3,
            },
            class: 'CodeWiz_Joystick',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                let _pinX = script.getNumberValue('PIN_X', script);
                let _pinY = script.getNumberValue('PIN_Y', script);
                let _pinB = script.getNumberValue('PIN_B', script);
                let _range = script.getNumberValue('RANGE', script);


                const order = {
                    type: Entry.CodeWiz.sensorTypes.WRITE,
                    value: {
                        opcode: 50,
                        params: [_pinX, _pinY, _pinB, _range],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
            },
        },
        CodeWiz_Joystick_readAxis: {
            // 조이스틱 XY레버값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X축', '0'],
                        ['Y축', '1'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_Joystick_readAxis',
            },
            paramsKeyMap: {
                TYPE: 0
            },
            class: 'CodeWiz_Joystick',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _type = script.getNumberValue('TYPE', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 13,
                        params: [_type],
                    },
                };

                const id =Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                
                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                // console.log(_type===0?"X:":"Y:",retVal);
                return retVal
            },
        },
        CodeWiz_Joystick_readButton: {
            // 조이스틱 버튼값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
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
                params: [null],
                type: 'CodeWiz_Joystick_readButton',
            },
            paramsKeyMap: {
            },
            class: 'CodeWiz_Joystick',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 14,
                        params: [],
                    },
                };
                const id =Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);
                let retVal= Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];
                // console.log("Button:",retVal);
                return retVal
            },
        },

        CodeWiz_etcReadSensor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: 5+this.getOffsetX(Lang.template.CodeWiz_etcReadSensor_title),
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.CodeWiz_etcReadSensor_title,
                    color: '#333333',
                    align: 'left',
                },
            ],
            def: {
                type: 'CodeWiz_etcReadSensor_title',
            },
            class: 'CodeWiz_etcReadSensor',
            isNotFor: ['CodeWiz'],
            events: {},
        },
        CodeWiz_etcReadSensor_mconRead: {
            // 가변저항, 워터센서, 토양수분센서
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가변저항', '0'],
                        ['워터센서', '1'],
                        ['토양수분센서', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['32', '32'],
                        ['33', '33'],
                        ['36', '36'],
                        ['39', '39'],
                    ],
                    value: '36',
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
                params: [null],
                type: 'CodeWiz_etcReadSensor_mconRead',
            },
            paramsKeyMap: {
                TYPE: 0,
                PIN: 1,
            },
            class: 'CodeWiz_etcReadSensor',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _type = script.getNumberValue('TYPE', script);
                let _pin = script.getNumberValue('PIN', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 10,
                        params: [_type, _pin],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_etcReadSensor_digitalRead: {
            // 버튼, 포토인터럽트
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['버튼', '0'],
                        ['포토인터럽트', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                        ['18', '18'],
                        ['19', '19'],
                    ],
                    value: '18',
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
                params: [null],
                type: 'CodeWiz_etcReadSensor_digitalRead',
            },
            paramsKeyMap: {
                TYPE: 0,
                PIN: 1,
            },
            class: 'CodeWiz_etcReadSensor',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _type = script.getNumberValue('TYPE', script);
                let _pin = script.getNumberValue('PIN', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 11,
                        params: [_type, _pin],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal= Entry.hw.portData[id]?.value ?? false;
                delete Entry.hw.portData[id];
                return retVal
            },
        },
        CodeWiz_etcReadSensor_InfraredThermometerRead: {
            // Block UI : "비접촉온도센서 %1에 %2로 읽기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['SCON', '0'],
                        ['MCON', '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['℃', '0'],
                        ['℉', '1'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_etcReadSensor_InfraredThermometerRead',
            },
            paramsKeyMap: {
                IS_M: 0,
                IS_F: 1,
            },
            class: 'CodeWiz_etcReadSensor',
            isNotFor: ['CodeWiz'],
            async func(sprite, script) {
                if (Entry.CodeWiz.intervalId) {
                    await Entry.CodeWiz.preWait();
                }
                let _isM = script.getNumberValue('IS_M', script);
                let _isF = script.getNumberValue('IS_F', script);

                const order = {
                    type: Entry.CodeWiz.sensorTypes.READ,
                    value: {
                        opcode: 8,
                        params: [_isM, _isF],
                    },
                };
                const id = Entry.CodeWiz.sendOrder(order);
                await Entry.CodeWiz.checkComplete(1000, id);

                let retVal = Entry.hw.portData[id]?.value ?? 0;
                delete Entry.hw.portData[id];
                return retVal;
            },
        },
        //endregion CodeWiz 코드위즈
    };
};

module.exports = Entry.CodeWiz;
