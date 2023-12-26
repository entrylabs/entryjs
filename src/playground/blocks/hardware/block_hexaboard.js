'use strict';

Entry.HEXABOARD = {
  id: '5A0101', // 엔트리에서 발급받은 하드웨어 번호를 기술합니다.
  name: 'HEXABOARD', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
  url: 'http://makeitnow.kr/', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
  imageName: 'HEXABOARD.png', // images/hardware, images/hw 폴더 내에 존재하는 이미지입니다.
  title: {
    'ko': '헥사보드',
    'en': 'HEXABOARD'
  },
  sensorTypes:{
    DIGITAL_WRITE: 0x01, // 디지털 출력 변경
    ANALOG_WRITE: 0x02, // PWM을 이용한 아날로그 출력 변경
    DIGITAL_READ: 0x03, // 디지털 입력 상태 요청
    ANALOG_READ: 0x04, // 아날로그 입력 값 요청
    PLAY_TONE: 0x05, // 부저에 음 재생
    READ_COLOR_SENSOR: 0x06, // 색상 센서 값 요청 (R,G,B,W)
    READ_GYRO_SENSOR: 0x07, // 자이로 센서 값 요청
    READ_GYRO_ANGLE_SENSOR: 0x17, // 자이로 센서 값 요청
    READ_DHT_SENSOR : 0x13, //DHT11 센서 값
    UPDATE_NEOPIXEL: 0x08, // 네오픽셀 LED 상태 변경
    SLIDE_NEOPIXEL: 0x09, //네오픽셀 텍스트 출력
    DISPLAY_OLED: 0x10, // OLED 값 정의
    UPDATE_ALL_NEOPIXEL: 0x11, //모든 네오픽셀 켜기
    DISPLAY_INIT_OLED: 0x12, // OLED 값 정의
    CONNECT_WIFI: 0x21, //WIFI 연결
    CONNECT_BLYNK: 0x21, //BLYNK서버 연결
    BLYNK_VIRTUAL_WRITE: 0x22, //BLYNK 가상의 핀 데이터 전송
    BLYNK_WRITE: 0x23, //BLYNK 상태값 바뀌었을때
    CONNECTED_BLYNK: 0x24, //BLYNK서버 연결
  },
  // 자이로 센서에 대한 추가적인 세부 명령 정의
  gyro_command : {
    LEFT: 0x11,
    RIGHT: 0x12,
    FRONT: 0x13,
    BACK: 0x14,
    UP: 0x15,
    DOWN: 0x16,
    ANGLE_X: 0x17,
    ANGLE_Y: 0x18,
    ANGLE_Z: 0x19,
  },
  command: {
    READ: 1,
    WRITE: 0,
  },

  rgbToHex(r, g, b) {
    const toHex = c => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  },

  reduceColorHex(hex, percent) {
    // 16진수 색상 코드를 R, G, B로 분리
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // 각 색상 구성 요소에 백분율 적용
    const newR = Math.round(r * percent / 100);
    const newG = Math.round(g * percent / 100);
    const newB = Math.round(b * percent / 100);

    // 새로운 색상 코드 생성
    return "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase();
  },

  setZero: function () {
    // 엔트리 정지시 하드웨어 초기화 로직
    // for(let i = 2 ; i <= 13 ; i++) {
    //   Entry.hw.sendQueue.PORT[i] = 0;
    // }
    Entry.hw.update(); // 하드웨어에 명시적으로 정보를 보냄.
  },

};

// 언어 적용
Entry.HEXABOARD.setLanguage = function () {
  return {
    ko: {
      // ko.js에 작성하던 내용
      template: {
        sample_block: '이거는 뭐지 %1',
        makeitnow_main_hexa_title : '헥사보드',
        makeitnow_sensor_title : '센서',
        makeitnow_digitalwrite_hexa : '디지털 출력 %1 핀에 %2 값 %3',
        makeitnow_pwm_hexa : '아날로그 출력 %1핀에 %2 값 %3',
        makeitnow_buttonRead_hexa : '%1 버튼 값 읽기',
        makeitnow_digitalRead_hexa : '%1 디지털 신호 읽기',
        makeitnow_analogRead_hexa : '%1 아날로그 신호 읽기',
        makeitnow_sensor_dht11: '온습도센서 %1, %2값 가져오기',
        makeitnow_buzzer_hexa: '소리내기 옥타브 %1, 음이름 %2, 지속시간 %3 %4',
        makeitnow_buzzer_off_hexa : '소리 끄기 %1',
        makeitnow_gyro_hexa : '보드 기울기 각도 %1',
        makeitnow_gyro_direction_hexa : '보드의 기울어진 방향 %1',
        makeitnow_getColor_hexa : '색상값 읽어오기 %1 ',
        makeitnow_get_RGBColor_hexa : '색깔 탐지 %1',
        makeitnow_neo_messageslide_hexa : '문자출력 %1 빠르기 %2 색상 %3 %4',
        makeitnow_neo_bitmap_hexa : 'LED 출력하기 ' +
          '%1%2%3%4%5'+
          '%6%7%8%9%10' +
          '%11%12%13%14%15' +
          '%16%17%18%19%20' +
          '%21%22%23%24%25',
        makeitnow_neoled_onecolorset_hexa : '%1 %2개중 %3번째 빨강%4 초록%5 파랑%6 %7',
        makeitnow_neoled_allColorSet_hexa : '%1 %2개 모두 빨강%3 초록%4 파랑%5 %6',
        makeitnow_neoled_oneColorSelect_hexa : '%1 %2개중 %3번째 %4 밝기 %5% %6',
        makeitnow_neoled_AllColorSelect_hexa : '%1 %2개 모두 %3 밝기 %4% %5',
        makeitnow_neoled_AllOff_hexa : '%1 %2개 모두 끄기 %3',
        makeitnow_neo_title : '네오픽셀',
        makeitnow_oled_title : 'OLED 디스플레이',
        makeitnow_oled_setting_hexa : 'OLED 사용하기 주소%1 %2',
        makeitnow_oled_clear_hexa: 'OLED 모두 지우기 %1',
        makeitnow_oled_print_hexa : 'X:%1 Y:%2에 %3출력 크기%4 %5',
        makeitnow_wireless_title : '무선통신',
        makeitnow_wireless_wifiConnect_hexa : 'WIFI연결 이름%1 비밀번호%2 인증번호%3 %4',
        makeitnow_wireless_serverConnect_hexa: '서버 인증번호:%1 %2',
        makeitnow_wireless_serverSend_hexa : '가상핀 %1에 %2값 전송 %3',
        makeitnow_wireless_serverReceived_hexa: '가상핀 ( V%1 )값을 가져오기',
        makeitnow_wireless_checkConnection_hexa: '서버에 연결이 되었는가?',
        makeitnow_wireless_blynk_title : '',
      }
    },
    en: {
      // en.js에 작성하던 내용
      template: {
        sample_block: '이거는 뭐지 %1',
        makeitnow_main_hexa_title: 'Hexa Board',
        makeitnow_sensor_title: 'Sensor',
        makeitnow_digitalwrite_hexa: 'Digital output to pin %1 value %2 %3',
        makeitnow_pwm_hexa: 'Analog output to pin %1 value %2 %3',
        makeitnow_buttonRead_hexa: 'Read %1 button value',
        makeitnow_digitalRead_hexa: 'Read %1 digital signal',
        makeitnow_analogRead_hexa: 'Read %1 analog signal',
        makeitnow_sensor_dht11: 'Humidity sensor %1, get %2 value',
        makeitnow_buzzer_hexa: 'Sound octave %1, note %2, duration %3 %4',
        makeitnow_buzzer_off_hexa: 'Turn off sound %1',
        makeitnow_gyro_hexa: 'Board tilt angle %1',
        makeitnow_gyro_direction_hexa: 'Direction of board tilt %1',
        makeitnow_getColor_hexa: 'Read color value %1',
        makeitnow_get_RGBColor_hexa: 'Detect color %1',
        makeitnow_neo_messageslide_hexa: 'Display text %1 speed %2 color %3 %4',
        makeitnow_neo_bitmap_hexa: 'LED output ' +
          '%1%2%3%4%5'+
          '%6%7%8%9%10' +
          '%11%12%13%14%15' +
          '%16%17%18%19%20' +
          '%21%22%23%24%25',
        makeitnow_neoled_onecolorset_hexa: '%1 Set LED %2 at position %3 red%4 green%5 blue%6 %7',
        makeitnow_neoled_allColorSet_hexa: '%1 Set all %2 LEDs red%3 green%4 blue%5 %6',
        makeitnow_neoled_oneColorSelect_hexa: '%1 Set LED %2 at position %3 brightness %4% %5',
        makeitnow_neoled_AllColorSelect_hexa: '%1 Set all %2 LEDs brightness %3% %4',
        makeitnow_neoled_AllOff_hexa: '%1 Turn off all %2 LEDs %3',
        makeitnow_neo_title: 'NeoPixel',
        makeitnow_oled_title: 'OLED Display',
        makeitnow_oled_setting_hexa: 'Setup OLED address %1 %2',
        makeitnow_oled_print_hexa: 'Print at X:%1 Y:%2 %3 size%4 %5',
        makeitnow_oled_clear_hexa: 'Clear OLED %1',
        makeitnow_wireless_title: 'Wireless Communication',
        makeitnow_wireless_wifiConnect_hexa: 'Connect to WiFi name %1 password %2 auth %3 %4',
        makeitnow_wireless_serverReceived_hexa: 'Retrieve value from virtual pin ( V%1 )',
        makeitnow_wireless_checkConnection_hexa: 'Is it connected to the server?',
        makeitnow_wireless_blynk_title: 'Blynk Wireless'

      }
    }
  }
};

// 엔트리에 등록할 블록들의 블록명 작성
Entry.HEXABOARD.blockMenuBlocks = [
  'makeitnow_main_hexa_title',
  'makeitnow_digitalwrite_hexa',
  'makeitnow_pwm_hexa',
  'makeitnow_buttonRead_hexa',
  'makeitnow_digitalRead_hexa',
  'makeitnow_analogRead_hexa',

  'makeitnow_sensor_title',
  'makeitnow_buzzer_hexa',
  'makeitnow_buzzer_off_hexa',
  'makeitnow_sensor_dht11',
  'makeitnow_gyro_hexa',
  'makeitnow_gyro_direction_hexa',
  'makeitnow_getColor_hexa',
  'makeitnow_get_RGBColor_hexa',

  'makeitnow_neo_title',
  'makeitnow_neo_messageslide_hexa',
  // 'makeitnow_neo_bitmap_hexa',
  'makeitnow_neoled_onecolorset_hexa',
  'makeitnow_neoled_allColorSet_hexa',
  'makeitnow_neoled_oneColorSelect_hexa',
  'makeitnow_neoled_AllColorSelect_hexa',
  'makeitnow_neoled_AllOff_hexa',

  'makeitnow_oled_title',
  'makeitnow_oled_setting_hexa',
  'makeitnow_oled_print_hexa',
  'makeitnow_oled_clear_hexa',

  'makeitnow_wireless_title',
  'makeitnow_wireless_wifiConnect_hexa',
  // 'makeitnow_wireless_serverConnect_hexa',
  'makeitnow_wireless_serverSend_hexa',
  // 'makeitnow_wireless_serverReceived_hexa',
  'makeitnow_wireless_checkConnection_hexa',
  'makeitnow_wireless_blynk_title',
];

// 블록 생성
Entry.HEXABOARD.getBlocks = function () {

  const HEXABOARD = Entry.HEXABOARD;

  return {
    /*
    * 헥사보드 관련 블록
    */
    makeitnow_main_hexa_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      def: {
        type: 'makeitnow_main_hexa_title',
      },
      isNotFor: ['HEXABOARD'],
      class : 'hexaboard',
    },
    makeitnow_digitalwrite_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "보드LED", "2" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "value": "2",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          "type": "Dropdown",
          "options": [
            [ "낮은", "0" ],
            [ "높은", "1" ],
          ],
          "value": "1",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'hexaboard',
      paramsKeyMap: {
        PIN: 0,
        VALUE : 1,
      },
      func: function (sprite, script) {
        var pin = script.getField('PIN', script); // 핀 번호를 가져옵니다.
        var value = script.getField('VALUE', script); // 설정할 값을 가져옵니다.

        // 하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.DIGITAL_WRITE,
            pin : pin,
            value: value
          },
        };
        console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_pwm_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        {
          "type": "Dropdown",
          "options": [
            [ "보드LED", "2" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "value": "2",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type: "Block",
          accept: "string",
          "value": "1023",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'hexaboard',
      paramsKeyMap: {
        PIN: 0,
        VALUE : 1,
      },
      func: function (sprite, script) {
        const pin = script.getField('PIN', script); // 핀 번호를 가져옵니다.
        const value = script.getNumberValue('VALUE', script); // 설정할 값을 가져옵니다.
        console.log(value);
        // 하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.ANALOG_WRITE,
            pin : pin,
            value: value
          },
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_buttonRead_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_boolean_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "A", "35" ],
            [ "B", "34" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'hexaboard',
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["35"],
        type: "makeitnow_buttonRead_hexa",
      },
      paramsKeyMap: {
        PIN : 0,
      },
      func: async function (sprite, script) {
        const pin_num = script.getField('PIN', script);

        let hwVal = Entry.hw.portData[pin_num];
        if ( hwVal !== undefined ){
          return hwVal === 1; // 하드웨어에서 읽은 값 반환
        }else{
          return script.callReturn();
        }
      },
    },

    makeitnow_digitalRead_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_boolean_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            ["PIN1", "32"],
            ["PIN2", "33"],
            ["PIN3", "4"],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class: 'hexaboard',
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["32"],
        type: "makeitnow_digitalRead_hexa",
      },
      paramsKeyMap: {
        PIN: 0,
      },
      func: function(sprite, script) {
        const pin_num = script.getField('PIN', script);

        let hwVal = Entry.hw.portData[pin_num];
        if (hwVal !== undefined) {
          return hwVal === 1;
        } else {
          return script.callReturn();
        }
      }
    },

    makeitnow_analogRead_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_string_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "value": "32",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["32"],
        type: "makeitnow_analogRead_hexa",
      },
      class : 'hexaboard',
      paramsKeyMap: {
        PIN : 0,
      },
      func: function(sprite, script) {
        const pin = script.getField('PIN', script);
        const pinName = `A${pin}`

        let hwVal = Entry.hw.portData[pinName];
        if (hwVal !== undefined ){
          return hwVal;
        }else{
          return script.callReturn();
        }
      }
    },


    /*
    * 센서 블록 섹션
    * */
    makeitnow_sensor_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      def: {
        type: 'makeitnow_sensor_title',
      },
      isNotFor: ['HEXABOARD'],
      class : 'sensor',
    },

    makeitnow_buzzer_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type: "Dropdown",
          options: [
            [ "1", "1" ],
            [ "2", "2" ],
            [ "3", "3" ],
            [ "4", "4" ],
            [ "5", "5" ],
            [ "6", "6" ],
          ],
          "value": "1",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type: "Dropdown",
          options: [
            [ "도", "32.7032" ],
            [ "도#", "34.6478" ],
            [ "레", "36.7081" ],
            [ "레#", "38.8909" ],
            [ "미", "41.2034" ],
            [ "파", "43.6535" ],
            [ "파#", "46.2493" ],
            [ "솔", "48.9994" ],
            [ "솔#", "51.9130" ],
            [ "라", "55.0000" ],
            [ "라#", "58.2705" ],
            [ "시", "61.7354" ],
          ],
          "value": "32.7032",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type: "Block",
          accept: "string",
          value : "0.3",
          fontSize: 11,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'sensor',
      paramsKeyMap: {
        OCTAVE : 0,
        SCALE : 1,
        DURATION : 2,
      },
      func: function (sprite, script) {
        const octave = script.getField('OCTAVE', script); // 핀 번호를 가져옵니다.
        const scale = script.getField('SCALE', script); // 핀 번호를 가져옵니다.
        const duration = script.getNumberValue('DURATION', script); // 설정할 값을 가져옵니다.

        let multiplier = Math.pow(2, octave - 1);
        let note_value = Math.round(scale * multiplier);

        /***
         * TODO : 부저 빠르게 출력하면 출력이 되지 않는 이슈
         */
        // 하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.PLAY_TONE,
            pin : 27,
            value : note_value,
            duration : duration,
          },
          time: new Date().getTime()
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_buzzer_off_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'sensor',
      func: function (sprite, script) {
        // 하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.PLAY_TONE,
            pin : 27,
            value: 0,
            duration : 0,
          },
          time: new Date().getTime()
        };
        console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_sensor_dht11 : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_string_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "value": "32",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          "type": "Dropdown",
          "options": [
            [ "온도", "D1" ],
            [ "습도", "D0" ],
          ],
          "value": "humi",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["32", "D1"],
        type: "makeitnow_sensor_dht11",
      },
      paramsKeyMap: {
        PIN : 0,
        VALUE : 1,
      },
      class : 'sensor',
      func: function (sprite, script) {
        const pin = script.getField('PIN', script);
        const DHT11 = script.getField('VALUE', script);

        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.READ,
          data: {
            command : Entry.HEXABOARD.sensorTypes.READ_DHT_SENSOR,
            pin : pin,
          },
        };
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;

        let hwVal = Entry.hw.portData[DHT11];
        if (hwVal !== undefined ){
          return hwVal;
        }else{
          return script.callReturn();
        }
      },
    },

    makeitnow_gyro_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_string_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "좌우", HEXABOARD.gyro_command.ANGLE_X ],
            [ "상하", HEXABOARD.gyro_command.ANGLE_Y ],
            [ "앞뒤", HEXABOARD.gyro_command.ANGLE_Z ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: [HEXABOARD.gyro_command.ANGLE_X],
        type: "makeitnow_gyro_hexa",
      },
      class : 'sensor',
      paramsKeyMap: {
        GYRO : 0,
      },
      func: function (sprite, script) {
        const gyro = script.getField('GYRO', script); // 핀 번호를 가져옵니다.

        let hwVal = Entry.hw.portData[gyro] ?? 0;
        if (hwVal !== undefined){
          return hwVal;
        }else {
          return script.callReturn();
        }
      },
    },

    makeitnow_gyro_direction_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_boolean_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "왼쪽", HEXABOARD.gyro_command.LEFT ],
            [ "오른쪽", HEXABOARD.gyro_command.RIGHT ],
            [ "앞쪽", HEXABOARD.gyro_command.FRONT ],
            [ "뒤쪽", HEXABOARD.gyro_command.BACK ],
            [ "앞면", HEXABOARD.gyro_command.UP ],
            [ "뒷면", HEXABOARD.gyro_command.DOWN ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: [HEXABOARD.gyro_command.LEFT],
        type: "makeitnow_gyro_direction_hexa",
      },
      class : 'sensor',
      paramsKeyMap: {
        GYRO : 0,
      },
      func: function (sprite, script) {
        const gyro = script.getField('GYRO', script); // 핀 번호를 가져옵니다.
        // 하드웨어 큐에 데이터 추가
        let hwVal = Entry.hw.portData[gyro];
        if ( hwVal !== undefined ){
          return hwVal;
        }else {
          return script.callReturn();
        }
      },
    },

    makeitnow_getColor_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_string_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "빨강", "C0" ],
            [ "초록", "C1" ],
            [ "파랑", "C2" ],
            [ "밝기(lux)", "C3" ],
          ],
          "value": "r",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["C3"],
        type: "makeitnow_getColor_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class : 'sensor',
      paramsKeyMap: {
        PIN : 0,
      },
      func: function (sprite, script) {
        //TODO : 이 곳에 통신 코드 작성하기
        const pin_num = script.getField('PIN', script);
        let hwVal = Entry.hw.portData[pin_num];
        // console.log(`pin_num : ${pin_num} , hwVal : ${hwVal}`);
        if ( hwVal !== undefined ){
          return hwVal; // 하드웨어에서 읽은 값 반환
        }else{
          return script.callReturn();
        }
      },
    },

    makeitnow_get_RGBColor_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic_boolean_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "빨강", "C0" ],
            [ "초록", "C1" ],
            [ "파랑", "C2" ],
          ],
          "value": "r",
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'sensor',
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["C0"],
        type: "makeitnow_get_RGBColor_hexa",
      },
      paramsKeyMap: {
        VALUE : 0,
      },
      func: function (sprite, script) {
        //TODO : 이 곳에 통신 코드 작성하기
        const colorChoice = script.getField('VALUE', script);
        const redValue = Entry.hw.portData['C0'];
        const greenValue = Entry.hw.portData['C1'];
        const blueValue = Entry.hw.portData['C2'];

        if (colorChoice === "C0") { // 빨강 선택
          return redValue > greenValue && redValue > blueValue;
        } else if (colorChoice === "C1") { // 초록 선택
          return greenValue > redValue && greenValue > blueValue;
        } else if (colorChoice === "C2") { // 파랑 선택
          return blueValue > redValue && blueValue > greenValue;
        }
        return script.callReturn();
      },
    },

    /*
    * 네오픽셀 섹션
    * */
    makeitnow_neo_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      def: {
        type: 'makeitnow_neo_title',
      },
      isNotFor: ['HEXABOARD'],
      class : 'neopixel_hexa',
    },

    makeitnow_neo_messageslide_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string"
        },
        {
          type : "Block",
          accept : "string"
        },
        {
          type: "Color",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      events: {},
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["HEXABOARD", '1', null],
        type: "makeitnow_neo_messageslide_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        TEXT: 0,
        SPEED: 1,
        COLOR: 2,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const text = script.getStringValue('TEXT', script);
        const slide_speed = script.getNumberValue('SPEED', script);
        const color_value = script.getStringField('COLOR', script);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }
        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.SLIDE_NEOPIXEL,
            message : text,
            speed : slide_speed,
            color : color_value,
          },
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_neo_bitmap_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        { type: "Color", },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      events: {},
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: [null, null, null, null, null,
          null, null, null, null, null,
          null, null, null, null, null,
          null, null, null, null, null,
          null, null, null, null, null],
        type: "makeitnow_neo_bitmap_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'neopixel_hexa',
      func: function (sprite, script) {
        //TODO : 이 곳에 통신 코드 작성하기
      },
    },
    makeitnow_neoled_onecolorset_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "HEXABOARD", "23" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },

        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["23", "25", "1", "0", "0", "0"],
        type: "makeitnow_neoled_onecolorset_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        PIN: 0,
        NUM: 1,
        INDEX: 2,
        RED: 3,
        GREEN: 4,
        BLUE: 5,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const pin_num = script.getField('PIN', script);
        const led_num = script.getNumberValue('NUM', script);
        const led_index = script.getNumberValue('INDEX', script);
        const redColor = script.getNumberValue('RED', script);
        const greenColor = script.getNumberValue('GREEN', script);
        const blueColor = script.getNumberValue('BLUE', script);

        let color_value = Entry.HEXABOARD.rgbToHex(redColor, greenColor, blueColor);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.UPDATE_NEOPIXEL,
            pin : pin_num,
            ledNum : led_num,
            ledIndex : led_index,
            color : color_value,
          },
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_neoled_allColorSet_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "HEXABOARD", "23" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },

        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["23", "25", "0", "0", "0"],
        type: "makeitnow_neoled_allColorSet_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        PIN: 0,
        LEDNUM: 1,
        RED: 2,
        GREEN: 3,
        BLUE: 4,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const pin_num = script.getField('PIN', script);
        const led_num = script.getNumberValue('LEDNUM', script);
        const redColor = script.getNumberValue('RED', script);
        const greenColor = script.getNumberValue('GREEN', script);
        const blueColor = script.getNumberValue('BLUE', script);
        let color_value = Entry.HEXABOARD.rgbToHex(redColor, greenColor, blueColor);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.UPDATE_ALL_NEOPIXEL,
            pin : pin_num,
            ledNum : led_num,
            color : color_value,
          },
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_neoled_oneColorSelect_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "HEXABOARD", "23" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Color",
        },
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["23", "25","1" , null, "20"],
        type: "makeitnow_neoled_oneColorSelect_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        PIN: 0,
        NUM: 1,
        INDEX: 2,
        COLOR : 3,
        BRIGHTNESS : 4,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const pin_num = script.getField('PIN', script);
        const led_num = script.getNumberValue('NUM', script);
        const led_index = script.getNumberValue('INDEX', script);
        const color_value = script.getStringField('COLOR', script);
        const brightness_value = script.getNumberValue('BRIGHTNESS', script);
        let cal_color_value = Entry.HEXABOARD.reduceColorHex(color_value, brightness_value);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.UPDATE_NEOPIXEL,
            pin : pin_num,
            ledNum : led_num,
            ledIndex : led_index,
            color : cal_color_value,
          },
        };
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_neoled_AllColorSelect_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "HEXABOARD", "23" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Color",
        },
        {
          type : "Block",
          accept : "string",
        },

        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        params: ["23", "25", null, "20"],
        type: "makeitnow_neoled_AllColorSelect_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        PIN: 0,
        NUM: 1,
        COLOR : 2,
        BRIGHTNESS : 3,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const pin_num = script.getField('PIN', script);
        const led_num = script.getNumberValue('NUM', script);
        const color_value = script.getStringField('COLOR', script);
        const brightness_value = script.getNumberValue('BRIGHTNESS', script);
        let cal_color_value = Entry.HEXABOARD.reduceColorHex(color_value, brightness_value);

        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.UPDATE_ALL_NEOPIXEL,
            pin : pin_num,
            ledNum : led_num,
            color : cal_color_value,
          },
        };
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_neoled_AllOff_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          "type": "Dropdown",
          "options": [
            [ "HEXABOARD", "23" ],
            [ "PIN1", "32" ],
            [ "PIN2", "33" ],
            [ "PIN3", "4" ],
          ],
          "fontSize": 11,
          bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
          arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        },
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["23", "25"],
        type: "makeitnow_neoled_AllOff_hexa",
      },
      class: 'neopixel_hexa',
      paramsKeyMap: {
        PIN: 0,
        NUM: 1,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const pin_num = script.getField('PIN', script);
        const led_num = script.getNumberValue('NUM', script); // 핀 번호를 가져옵니다.
        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.UPDATE_ALL_NEOPIXEL,
            pin : pin_num,
            ledNum : led_num,
            color : '#000000',
          },
          time: new Date().getTime()
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    /*
     * 디스플레이 : OLED
     * */
    makeitnow_oled_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      skeletonOptions: {
        box: {
          offsetX: 20,
        },
      },
      params: [
        {
          type: 'Text',
          text: Lang.template.makeitnow_oled_title,
          color: '#333333',
          align: 'left',
        },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'oled_hexa',
    },


    makeitnow_oled_setting_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [
        {
          accept: 'basic',
        },
      ],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["60"],
        type: "makeitnow_oled_setting_hexa",
      },
      class: 'oled_hexa',
      paramsKeyMap: {
        I2C_ADDRESS: 0,
      },
      isNotFor: ['HEXABOARD'],
      func: function (sprite, script) {
        const i2c_addr = script.getNumberValue('I2C_ADDRESS', script); // 핀 번호를 가져옵니다.
        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.DISPLAY_INIT_OLED,
            address : i2c_addr,
          },
          time: new Date().getTime()
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_oled_print_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["0", "0", "HEXABOARD", "1"],
        type: "makeitnow_oled_print_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'oled_hexa',
      paramsKeyMap: {
        POSITION_X: 0,
        POSITION_Y: 1,
        TEXT : 2,
        FONTSIZE : 3,
      },
      func: function (sprite, script) {
        const position_x = script.getNumberValue('POSITION_X', script);
        const position_y = script.getNumberValue('POSITION_Y', script);
        const text = script.getStringValue('TEXT', script);
        const font_size = script.getNumberValue('FONTSIZE', script);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.DISPLAY_OLED,
            x : position_x,
            y : position_y,
            message : text,
            fontsize : font_size,
          },
          time: new Date().getTime()
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_oled_clear_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [
        {
          accept: 'basic',
        },
      ],
      params: [
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        type: "makeitnow_oled_clear_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'oled_hexa',
      func: function (sprite, script) {
        //TODO : 이 곳에 통신 코드 작성하기
      },
    },

    /*
 * 디스플레이 : 무선통신
 * */
    makeitnow_wireless_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      skeletonOptions: {
        box: {
          offsetX: 20,
        },
      },
      params: [
        {
          type: 'Text',
          text: Lang.template.makeitnow_oled_title,
          color: '#333333',
          align: 'left',
        },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'wireless_hexa',
    },

    
    makeitnow_wireless_wifiConnect_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        // params: ["SSID", "PASSWORD", "AUTH_TOKEN"],
        params: ["KT_GiGA_2G_makeitnow", "makeitnow1", "kSpy0al0nPmop9KGT5yRhbqyRl57Hj2X"],
        type: "makeitnow_wireless_wifiConnect_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'wireless_hexa',
      paramsKeyMap: {
        SSID: 0,
        PW: 1,
        AUTH_TOKEN: 2,
      },
      func: function (sprite, script) {
        const ssid = script.getStringValue('SSID', script);
        const password = script.getStringValue('PW', script);
        const authToken = script.getStringValue('AUTH_TOKEN', script);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.CONNECT_WIFI,
            ssid : ssid,
            password : password,
            authToken : authToken,
          },
          time: new Date().getTime()
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_wireless_serverConnect_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["AUTH_TOKEN"],
        type: "makeitnow_wireless_serverConnect_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'wireless_hexa',
      func: function (sprite, script) {
        //TODO : 이 곳에 통신 코드 작성하기
      },
    },

    makeitnow_wireless_serverSend_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["0", "숫자"],
        type: "makeitnow_wireless_serverSend_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'wireless_hexa',
      paramsKeyMap: {
        VIRTUAL_PIN: 0,
        DATA: 1,
      },
      func: function (sprite, script) {
        const virtual_pin = script.getNumberValue('VIRTUAL_PIN', script);
        const send_data = script.getStringValue('DATA', script);

        //하드웨어 큐에 데이터 추가
        if (!Entry.hw.sendQueue.SET) {
          Entry.hw.sendQueue.SET = {};
        }

        Entry.hw.sendQueue.SET = {
          type: Entry.HEXABOARD.command.WRITE,
          data: {
            command : Entry.HEXABOARD.sensorTypes.BLYNK_VIRTUAL_WRITE,
            virtualPin : virtual_pin,
            value : send_data,
          },
        };
        // console.log(Entry.hw.sendQueue.SET);
        Entry.hw.update();
        delete Entry.hw.sendQueue.SET;
        return script.callReturn();
      },
    },

    makeitnow_wireless_serverReceived_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      // fontSize: 13,
      skeleton: 'basic_string_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [
        {
          accept: 'basic',
        },
      ],
      params: [
        //입력될 파라미터들의 속성을 정의
        {
          type : "Block",
          accept : "string",
        },
        // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
        // { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
      ],
      def: {
        // def의 params의 경우는 초기값을 지정할수 있습니다.
        params: ["0"],
        type: "makeitnow_wireless_serverReceived_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'wireless_hexa',
      paramsKeyMap: {
        VIRTUAL_PIN: 0,
      },
      func: function (sprite, script) {
        const virtual_pin = script.getNumberValue('VIRTUAL_PIN', script);
        const dataStream = `V${virtual_pin}`;
        //하드웨어 큐에 데이터 추가
        let hwVal = Entry.hw.portData[dataStream];
        // console.log(`DataStream ${dataStream}  value : ${hwVal}`);
        if ( hwVal !== undefined ){
          return hwVal; // 하드웨어에서 읽은 값 반환
        }else{
          return script.callReturn();
        }
      },
    },

    makeitnow_wireless_checkConnection_hexa : {
      color: EntryStatic.colorSet.block.default.HARDWARE,
      outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
      fontColor: '#ffffff',
      // fontSize: 13,
      skeleton: 'basic_boolean_field', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
      statements: [
        {
          accept: 'basic',
        },
      ],
      params: [],
      def: {
        type: "makeitnow_wireless_checkConnection_hexa",
      },
      isNotFor: ['HEXABOARD'],
      class: 'wireless_hexa',
      paramsKeyMap: {},
      func: function (sprite, script) {

        let hwVal = Entry.hw.portData['BC'];
        // console.log(`Blynk Connected : ${hwVal}`);
        if (hwVal !== undefined) {
          return hwVal === 1;
        } else {
          return script.callReturn();
        }
      },
    },


    makeitnow_wireless_blynk_title :{
      skeleton: 'basic_text',
      color: EntryStatic.colorSet.common.TRANSPARENT,
      fontColor: '#333333',
      skeletonOptions: {
        box: {
          offsetX: 20,
        },
      },
      params: [
        {
          type: 'Text',
          text: Lang.template.makeitnow_oled_title,
          color: '#333333',
          align: 'left',
        },
      ],
      isNotFor: ['HEXABOARD'],
      class : 'wireless_hexa',
    },
  }
};

// 엔트리에서 하드웨어 블록 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.HEXABOARD;
