'use strict';

Entry.Dalgona_basic = {
    id: '54.2',
    name: 'Dalgona_basic',
    url: 'https://dalgonaedu.co.kr/',
    imageName: 'dalgona.png',
    title: {
        ko: '달고나.에듀 Basic',
        en: 'Dalgona.Edu Basic',
    },
    Static: {
        BUTTON_PRESS_VALUE: 0,
    },

    //정지시 초기화 함수
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                if (Entry.hw.sendQueue.SET[key].type == Entry.Dalgona_basic.sensorTypes.SERVO) {
                    Entry.hw.sendQueue.SET[key].data = 200;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } 
                else if (Entry.hw.sendQueue.SET[key].type == Entry.Dalgona_basic.sensorTypes.SERVO2) {
                    Entry.hw.sendQueue.SET[key].data.value1 = 200;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } 
                else {
                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        READ_BLUETOOTH: 9,
        WRITE_BLUETOOTH: 10,
        LCD: 11,
        LCDCLEAR: 12,
        RGBLED: 13,
        DCMOTOR: 14,
        OLED: 15,
        PIR: 16,
        LCDINIT: 17,
        DHTHUMI: 18,
        DHTTEMP: 19,
        NEOPIXELINIT: 20,
        NEOPIXELBRIGHT: 21,
        NEOPIXEL: 22,
        NEOPIXELALL: 23,
        NEOPIXELCLEAR: 24,
        DOTMATRIXINIT: 25,
        DOTMATRIXBRIGHT: 26,
        DOTMATRIX: 27,
        DOTMATRIXEMOJI: 28,
        DOTMATRIXCLEAR: 29,
        MP3INIT: 30,
        MP3PLAY1: 31,
        MP3PLAY2: 32,
        MP3VOL: 33,
        RESET_: 34,
        LOADINIT: 35,
        LOADSCALE: 36,
        LOADVALUE: 37,
        DUST: 38,
        JOYINIT: 39,
        JOYX: 40,
        JOYY: 41,
        JOYZ: 42,
        JOYMOVE: 43,
        RFIDINIT: 44,
        RFIDTAP: 45,
        RFIDVALUE: 46,
        STEPINIT: 47,
        STEPSPEED: 48,
        STEPROTATE: 49,
        STEPROTATE2: 50,
        STEPROTATE3: 51,
        MLXOBJ: 52,
        MLXAMB: 53,
        SERVO2: 54,
        GYROX: 55,
        GYROY: 56,
        GYROZ: 57,
        PULLUP: 58,
        TONETOGGLE: 59,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
          // 1옥  2옥  3옥  4옥  5옥  6옥   7옥   8옥
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],   // 도
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],   // 도#
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],   // 레
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],   // 미b
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],   // 미
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],   // 파
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],   // 파#
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],   // 솔
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],  // 솔#
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040], // 라
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459], // 시b
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902], // 시
    },
    direction: {
        CENTER: 0,
        UP: 1,
        LEFT: 2,
        RIGHT: 3,
        DOWN: 4,
        LEFT_UP: 5,
        LEFT_DOWN: 6,
        RIGHT_UP: 7,
        RIGHT_DOWN: 8,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    getOffsetX(str) {
        return this.getByteLength(str) * 1.5 - 5;
    },
    getByteLength(s, b, i, c) {
        for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    },
    BlockState: {},
};
Entry.Dalgona_basic.setLanguage = function() {
    return {
        ko: {
            template: {
                // set_neopixelinit: '디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 LED 사용하기 %3',
				// set_neopixel: '디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6',

                // FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                // FND_Control_init: 'FND %1 번 : 디지털 CLK %2, DIO %3 번 핀으로 설정',
                // FND_Control_diplay_brightness: 'FND %1 번 : 밝기 %2 단계로 설정',
                // FND_Control_display_onoff: 'FND %1 번 : 전원 %2',
                // FND_Control_diplay_char:
                //     'FND %1 번 : %2 출력하기:나머지0채우기 %3  %4 초 대기',
				




                dalgona_basic_digital_title:'달고나 디지털 블럭',
                dalgona_basic_analog_title:'달고나 아날로그 블럭',
                dalgona_basic_pwm_title:'달고나 PWM 블럭',
                dalgona_basic_library_title:'달고나 라이브러리 블럭',
                dalgona_basic_neopixel_title:'달고나 네오픽셀 블럭',
                dalgona_basic_ultrasonic_title: '달고나 초음파센서 블럭',
                dalgona_basic_buzzer_title: '달고나 피에조 부저 블럭',
                dalgona_basic_dotmatrix_title:'달고나 8X8 도트매트릭스 블럭',
                dalgona_basic_rfid_title:'달고나 RFID 블럭',
                dalgona_basic_motor_title:'달고나 모터 블럭',
                dalgona_basic_stepmotor_title:'달고나 스텝모터 블럭',
                dalgona_basic_joystick_title:'달고나 조이스틱 블럭',
                dalgona_basic_LCD_title:'달고나 LCD 블럭',
                dalgona_basic_mp3_title:'달고나 mp3 블럭',
                dalgona_basic_HX711_title:'달고나 HX711 로드셀 블럭',
                dalgona_basic_sensor_title:'달고나 센서 블럭',
                dalgona_basic_toggle_on: '켜기',
                dalgona_basic_toggle_off: '끄기',
                dalgona_basic_lcd_first_line: '첫 번째',
                dalgona_basic_lcd_seconds_line: '두 번째',
                dalgona_basic_get_analog_value: '아날로그 %1 핀 읽기',
                dalgona_basic_get_light_value: '조도센서(AO %1)값',
                dalgona_basic_get_moisture_value: '토양수분센서(AO %1)값',
                dalgona_basic_get_sound_value: '사운드센서(AO %1)값',
                dalgona_basic_get_infrared_value: '적외선센서(AO %1)값',
                dalgona_basic_get_pullup: '풀업 저항 사용 버튼 %1 핀 눌림 상태',
                dalgona_basic_get_button: '버튼 %1 핀 눌림 상태',
                dalgona_basic_get_analog_mapping: '아날로그 %1 번 핀 센서 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                dalgona_basic_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                dalgona_basic_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                dalgona_basic_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',
                dalgona_basic_get_digital: '디지털 %1 핀 읽기',
                dalgona_basic_get_digital_toggle: '디지털 %1 핀 센서 값',
                dalgona_basic_get_digital_pir: 'PIR %1 핀 센서 값',
                dalgona_basic_set_digital_toggle: '디지털 %1 핀 %2 %3',
                dalgona_basic_set_led_toggle: 'LED %1 핀 %2 %3',
                dalgona_basic_set_digital_pwm: 'LED (PWM %1 핀)밝기 %2 출력 (0 ~ 255)%3',
                dalgona_basic_set_digital_rgbled: 'RGB LED (R %1 핀, G %2 핀, B %3 핀) 색 (R: %4, G: %5, B: %6) 출력 %7',
                dalgona_basic_set_digital_servo: '서보 모터 %1 핀 %2 각도로 회전 %3',
                dalgona_basic_set_digital_servo2: "서보 모터 %1 핀 %2 ~ %3 각도로 %4 초 동안 회전 %5",
                dalgona_basic_set_digital_buzzer_toggle: '피에조부저 %1 핀 %2 %3',
                dalgona_basic_set_digital_buzzer_volume: '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                dalgona_basic_set_digital_buzzer: '피에조부저 %1 핀 %2 %3 음 %4 박자 연주 %5',
                dalgona_basic_set_digital_dcmotor: 'DC모터 %1핀 %2 %3',
                dalgona_basic_set_analog_dcmotor: 'DC모터(PWM %1 핀) 세기 %2 출력 (0 ~ 255) %3',
                dalgona_basic_set_neopixel_init: '네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                dalgona_basic_set_neopixel_bright: '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                dalgona_basic_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                dalgona_basic_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                dalgona_basic_set_neopixel_clear: '네오픽셀 LED ( %1 핀) 모든 LED 끄기 %2',
                dalgona_basic_set_dotmatrix_init: '8x8 도트매트릭스 시작하기 설정 (DIN %1, CLK %2, CS %3) %4',
                dalgona_basic_set_dotmatrix_bright: '도트매트릭스 밝기 %1 으로 설정 (0 ~ 8) %2',
                dalgona_basic_set_dotmatrix: '도트매트릭스 LED %1 그리기 %2',
                dalgona_basic_set_dotmatrix_emoji: '도트매트릭스 LED %1 그리기 %2',
                dalgona_basic_set_dotmatrix_clear: '도트매트릭스 LED 지우기 %1',
                dalgona_basic_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',
                dalgona_basic_get_lcd_row: '%1',
                dalgona_basic_get_lcd_col: '%1',
                dalgona_basic_module_digital_lcd: 'LCD화면 %1 열 %2 행 부터 %3 출력 %4',
                dalgona_basic_lcd_clear: 'LCD 화면 지우기 %1',
                dalgona_basic_get_dht: 'DHT11 온습도센서(out %1)의 %2값',
                //dalgona_basic_get_dht_temp_value: 'DHT11 온습도센서(out %1)의 온도(°C)값',
                //dalgona_basic_get_dht_humi_value: 'DHT11 온습도센서(out %1)의 습도(%)값',

                dalgona_basic_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                dalgona_basic_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                dalgona_basic_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                dalgona_basic_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',
                dalgona_basic_get_analog_temp_value: 'DHT11 포트 %1의 %2 센서 값',

                dalgona_basic_load_init: 'HX711 로드셀 시작하기 설정 (DOUT %1, SCK %2) %3',
                dalgona_basic_load_scale: 'HX711 로드셀 보정하기 %1 %2',
                dalgona_basic_load_value: 'HX711 로드셀 값',

                dalgona_basic_get_dust: '미세먼지센서 (LED %1, AO %2) 값',

                dalgona_basic_rfid_init: 'RFID 시작하기 설정 (SS %1, RST %2) %3',
                dalgona_basic_is_rfid_tapped: 'RFID 카드가 인식되었는가?',
                dalgona_basic_get_rfid_value: 'RFID 카드 값',
                dalgona_basic_joy_init: '%1 조이스틱 시작하기 설정 (X AO %2, Y AO %3, Z %4) %5',
                dalgona_basic_get_joy_x: '%1 조이스틱 X값',
                dalgona_basic_get_joy_y: '%1 조이스틱 y값',
                dalgona_basic_get_joy_z: '%1 조이스틱 버튼 눌림 상태',
                dalgona_basic_get_joy_move: '%1 조이스틱이 %2 방향으로 움직였을 때',

                dalgona_basic_get_mlx: 'mlx90614 비접촉 온도센서 %1값',

                dalgona_basic_step_init: '%1 스텝모터 시작하기 설정 (IN1 %2, IN2 %3, IN3 %4, IN4 %5) %6',
                dalgona_basic_step_speed: '%1 스텝모터 속도를 %2 로 설정하기 (0 ~ 20) %3',
                dalgona_basic_step_rotate: '%1 스텝모터 %2 으로 %3 바퀴 회전하기 %4',
                dalgona_basic_step_rotate2: '%1 스텝모터 %2 으로 %3 도 회전하기 %4',
                dalgona_basic_step_rotate3: '%1 스텝모터 %2 으로 %3 초 동안 회전하기 %4',

                // dalgona_basic_get_digital_bluetooth: '블루투스 RX 2 핀 데이터 값',
                // dalgona_basic_module_digital_bluetooth: '블루투스 TX 3 핀에 %1 데이터 보내기 %2',

            },
        },
        en: {
            template: {
                // FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                // FND_Control_init: 'FND %1 번 : 디지털 CLK %2, DIO %3 번 핀으로 설정',
                // FND_Control_diplay_brightness: 'FND %1 번 : 밝기 %2 단계로 설정',
                // FND_Control_display_onoff: 'FND %1 번 : 전원 %2',
                // FND_Control_diplay_char:
                //     'FND %1 번 : %2 출력하기:나머지0채우기 %3  %4 초 대기',



                set_neopixelinit: '디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 LED 사용하기 %3',
				set_neopixel: '디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6',
				
                dalgona_basic_digital_title:'달고나 디지털 블럭',
                dalgona_basic_analog_title:'달고나 아날로그 블럭',
                dalgona_basic_pwm_title:'달고나 PWM 블럭',
                dalgona_basic_library_title:'달고나 라이브러리 블럭',
                dalgona_basic_neopixel_title:'달고나 네오픽셀 블럭',
                dalgona_basic_ultrasonic_title: '달고나 초음파센서 블럭',
                dalgona_basic_buzzer_title: '달고나 피에조 부저 블럭',
                dalgona_basic_dotmatrix_title:'달고나 8X8 도트매트릭스 블럭',
                dalgona_basic_rfid_title:'달고나 RFID 블럭',
                dalgona_basic_motor_title:'달고나 모터 블럭',
                dalgona_basic_stepmotor_title:'달고나 스텝모터 블럭',
                dalgona_basic_joystick_title:'달고나 조이스틱 블럭',
                dalgona_basic_LCD_title:'달고나 LCD 블럭',
                dalgona_basic_mp3_title:'달고나 mp3 블럭',
                dalgona_basic_HX711_title:'달고나 HX711 로드셀 블럭',
                dalgona_basic_sensor_title:'달고나 센서 블럭',

                dalgona_basic_toggle_on: 'on',
                dalgona_basic_toggle_off: 'off',
                dalgona_basic_lcd_first_line: 'first',
                dalgona_basic_lcd_seconds_line: 'seconds',
                dalgona_basic_get_analog_value: 'Read analog %1 pin sensor value',
                dalgona_basic_get_analog_mapping: 'Map analog %1 pin sensor value from %2 ~ %3 to %4 ~ %5',
                dalgona_basic_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                dalgona_basic_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                dalgona_basic_get_digital_bluetooth: 'Bluetooth RX 2 value',
                dalgona_basic_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',
                dalgona_basic_get_digital: 'Digital %1 pin sensor value',
                dalgona_basic_get_digital_toggle: 'Digital %1 pin sensor value',
                dalgona_basic_set_digital_toggle: 'Digital %1 pin %2 %3',
                dalgona_basic_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',
                dalgona_basic_set_digital_rgbled: 'Digital %1 pin RGB LED Red %2 Green %3 Blue %4 %5',
                dalgona_basic_set_digital_servo: '서보 모터 %1 핀 %2 각도로 회전 %3',
                dalgona_basic_set_digital_buzzer_toggle: '피에조부저 %1 핀 %2 %3',
                dalgona_basic_set_digital_buzzer_volume: '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                dalgona_basic_set_digital_buzzer:'피에조부저 %1 번 핀의 버저를 %2 %3 음으로 %4 박자 연주 %5',
                dalgona_basic_set_digital_dcmotor: 'DC Motor %1 pin direction %2 %3 pin speed %4 %5',
                dalgona_basic_set_neopixel_init:'네오픽셀 LED 시작하기 설정 ( %1 핀에 %2 개의 LED 연결) %3',
                dalgona_basic_set_neopixel_bright: '네오픽셀 LED ( %1 핀) 밝기 %2 으로 설정 (0 ~ 255) %3',
                dalgona_basic_set_neopixel: '네오픽셀 LED ( %1 핀) %2 번째 LED 색 %3 출력 %4',
                dalgona_basic_set_neopixel_all: '네오픽셀 LED ( %1 핀) 모든 LED 색 %2 출력 %3',
                dalgona_basic_set_neopixel_clear: '네오픽셀 LED ( %1 핀) 모든 LED 끄기 %2',
                dalgona_basic_set_dotmatrix_init: '8x8 도트매트릭스 시작하기 설정 (DIN %1, CLK %2, CS %3) %4',
                dalgona_basic_set_dotmatrix_bright: '도트매트릭스 밝기 %1 으로 설정 (0 ~ 8) %2',
                dalgona_basic_set_dotmatrix: '도트매트릭스 LED 그리기 %1 %2',
                dalgona_basic_set_dotmatrix_emoji: '도트매트릭스 LED %1 그리기 %2',
                dalgona_basic_module_digital_lcd: 'LCD %1 열 %2 행 부터 %3 출력',
                dalgona_basic_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',

                dalgona_basic_module_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
                dalgona_basic_module_digital_oled: 'OLED X codinate %1 Y coodinate %2 appear %3 %4',
                dalgona_basic_get_dht_temp_value: '온습도센서의 온도값',
                dalgona_basic_get_dht_humi_value: '온습도센서의 습도값',

                dalgona_basic_set_mp3_init: 'mp3 초기화 ( tx: %1, rx: %2 ) %3',
                dalgona_basic_set_mp3_play: 'mp3 %1 번 파일 재생 %2',
                dalgona_basic_set_mp3_play2: 'mp3 %1 번 파일 %2 초 동안 재생 %3',
                dalgona_basic_set_mp3_vol: 'mp3 볼륨 %1 으로 설정 (0 ~ 30) %2',

                dalgona_basic_load_init: 'HX711 로드셀 시작하기 설정 (DOUT %1, SCK %2) %3',
                dalgona_basic_load_scale: 'HX711 로드셀 보정하기 %1 %2',
                dalgona_basic_load_value: 'HX711 로드셀 값',

                dalgona_basic_get_dust: '미세먼지센서(LED %1, AO %2) 값(μg/m³)',

                dalgona_basic_rfid_init: 'RFID 시작하기 설정 (RST %1, SS %2) %3',
                dalgona_basic_is_rfid_tapped: 'RFID 카드가 인식되었는가?',
                dalgona_basic_get_rfid_value: 'RFID 카드 값',

                dalgona_basic_joy_init: '%1 조이스틱 시작하기 설정 (X AO %2, Y AO %3, Z %4) %5',
                dalgona_basic_get_joy_x: '%1 조이스틱 X값',
                dalgona_basic_get_joy_y: '%1 조이스틱 y값',
                dalgona_basic_get_joy_z: '%1 조이스틱 버튼 눌림 상태',
                dalgona_basic_get_joy_move: '%1 조이스틱이 %2 방향으로 움직였을 때',

                dalgona_basic_step_init: '%1 스텝모터 시작하기 설정 (IN1 %2, IN2 %3, IN3 %4, IN4 %5) %6',
                dalgona_basic_step_speed: '%1 스텝모터 속도를 %2 로 설정하기 (0 ~ 20) %3',
                dalgona_basic_step_rotate: '%1 스텝모터 %2 으로 %3 바퀴 회전하기 %4',
                dalgona_basic_step_rotate2: '%1 스텝모터 %2 으로 %3 도 회전하기 %4',
                dalgona_basic_step_rotate3: '%1 스텝모터 %2 으로 %3 초 동안 회전하기 %4',

                dalgona_basic_mlx: 'mlx90614 값',
            },
        },
    };
};
Entry.Dalgona_basic.blockMenuBlocks = [

    // 'FND_event',
    // 'FND_Control_diplay_brightness',
    // 'FND_Control_display_onoff',
    // 'FND_Control_diplay_char',

    'dalgona_basic_digital_title',
    'dalgona_basic_set_digital_toggle',
    'dalgona_basic_get_digital',
    'dalgona_basic_set_led_toggle',

    'dalgona_basic_analog_title',
    'dalgona_basic_get_analog_value',
    'dalgona_basic_get_analog_mapping',
    'dalgona_basic_mapping1',
    'dalgona_basic_mapping2',
    
    'dalgona_basic_pwm_title',
    'dalgona_basic_set_digital_pwm',
    'dalgona_basic_set_digital_rgbled',

    'dalgona_basic_library_title',

    'dalgona_basic_neopixel_title',
    'dalgona_basic_set_neopixel_init',
    'dalgona_basic_set_neopixel_bright',
    'dalgona_basic_set_neopixel',
    'dalgona_basic_set_neopixel_all',
    'dalgona_basic_set_neopixel_clear',

    'dalgona_basic_ultrasonic_title',
    'dalgona_basic_get_digital_ultrasonic',

    'dalgona_basic_buzzer_title',
    'dalgona_basic_set_digital_buzzer_toggle',
    'dalgona_basic_set_digital_buzzer_volume',
    'dalgona_basic_set_digital_buzzer',

    // 'dalgona_basic_dotmatrix_title',
    // 'dalgona_basic_set_dotmatrix_init',
    // 'dalgona_basic_set_dotmatrix_bright',
    // 'dalgona_basic_set_dotmatrix',
    // 'dalgona_basic_set_dotmatrix_emoji',
    // 'dalgona_basic_set_dotmatrix_clear',

    // 'dalgona_basic_rfid_title',
    // 'dalgona_basic_rfid_init',
    // 'dalgona_basic_is_rfid_tapped',
    // 'dalgona_basic_get_rfid_value',

    'dalgona_basic_motor_title',
    'dalgona_basic_set_digital_dcmotor',
    'dalgona_basic_set_analog_dcmotor',
    // 'dalgona_basic_set_digital_servo',
    // 'dalgona_basic_set_digital_servo2',

    // 'dalgona_basic_stepmotor_title',
    // 'dalgona_basic_step_init',
    // 'dalgona_basic_step_speed',
    // 'dalgona_basic_step_rotate',
    // 'dalgona_basic_step_rotate2',
    // 'dalgona_basic_step_rotate3',

    // 'dalgona_basic_joystick_title',
    // 'dalgona_basic_joy_init',
    // 'dalgona_basic_get_joy_x',
    // 'dalgona_basic_get_joy_y',
    // 'dalgona_basic_get_joy_z',
    // 'dalgona_basic_get_joy_move',

    // 'dalgona_basic_LCD_title',
    // 'dalgona_basic_lcd_init',
    // 'dalgona_basic_module_digital_lcd',
    // 'dalgona_basic_get_lcd_row',
    // 'dalgona_basic_get_lcd_col',
    // 'dalgona_basic_lcd_clear',

    // 'dalgona_basic_mp3_title',
    // 'dalgona_basic_set_mp3_init',
    // 'dalgona_basic_set_mp3_vol',
    // 'dalgona_basic_set_mp3_play',
    // 'dalgona_basic_set_mp3_play2',

    // 'dalgona_basic_HX711_title',
    // 'dalgona_basic_load_init',
    // 'dalgona_basic_load_scale',
    // 'dalgona_basic_load_value',

    'dalgona_basic_sensor_title',

    // 'dalgona_basic_get_dust',
    'dalgona_basic_get_digital_toggle',
    'dalgona_basic_get_digital_pir',
    'dalgona_basic_get_light_value',
    // 'dalgona_basic_get_moisture_value',
    'dalgona_basic_get_sound_value',
    'dalgona_basic_get_infrared_value',
    // 'dalgona_basic_get_dht',
    //'dalgona_basic_get_dht_temp_value',
    //'dalgona_basic_get_dht_humi_value',
    'dalgona_basic_get_pullup',
    'dalgona_basic_get_button',
    // 'dalgona_basic_get_mlx',
    // 'dalgona_basic_get_digital_bluetooth',
    // 'dalgona_basic_module_digital_bluetooth',
];
Entry.Dalgona_basic.getBlocks = function() {
    var tx;
    var din;
    // var clk;
    // var cs; 
    var dout;
    var sck;
    var joyx, joyy, joyz;
    var joyx2, joyy2, joyz2;
    var portpin1, portpin2, portpin3;
    var ss;
    var RGBport;
    var mlxport;
    var speed1 = 14;
    var speed2 = 14;
    var speed3 = 14;
    var num = 0;

    return {

        // FND_Control_init: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['1', 1]],
        //             value: 1,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [['5', 5]],
        //             value: 5,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [['4', 4]],
        //             value: 4,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //     ],
        //     def: { params: [], type: 'FND_Control_init' },
        //     paramsKeyMap: { fnd_device: 0, CLK: 1, DIO: 2 },
        //     class: 'other',
        //     isNotFor: ['Dalgona'],
        //     func(sprite, script) {
        //         const device = script.getNumberValue('fnd_device', script);
        //         const clk_val = script.getNumberValue('CLK', script);
        //         const dio_val = script.getNumberValue('DIO', script);

        //         // index number patched by Remoted 2020-11-20
        //         if (!Entry.hw.sendQueue.SET) {
        //             Entry.hw.sendQueue.SET = {};
        //         }
        //         // FND_Init type data protocol defined
        //         Entry.hw.sendQueue.SET[device] = {
        //             type: Entry.Dalgona.sensorTypes.FNDINIT,
        //             data: {
        //                 clk_pin: clk_val,
        //                 dio_pin: dio_val,
        //             },
        //             time: new Date().getTime(),
        //         };

        //         return script.callReturn();
        //     },
        //     syntax: { js: [], py: ['RichShield_FND_init(%1, %2)'] },
        // },
        // FND_Control_diplay_brightness: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['1', 1]],
        //             value: 1,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [
        //                 ['1', 1],
        //                 ['2', 2],
        //                 ['3', 3],
        //                 ['4', 4],
        //                 ['5', 5],
        //                 ['6', 6],
        //                 ['7', 7],
        //             ],
        //             value: 3,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //     ],
        //     def: { params: [], type: 'FND_Control_diplay_brightness' },
        //     paramsKeyMap: { fnd_device: 0, level: 1 },
        //     class: 'other',
        //     isNotFor: ['Dalgona'],
        //     func(sprite, script) {
        //         const device = script.getNumberValue('fnd_device', script);
        //         const level_val = script.getNumberValue('level', script);

        //         if (!script.isStart) {
        //             // index number patched by Remoted 2020-11-20
        //             if (!Entry.hw.sendQueue.SET) {
        //                 Entry.hw.sendQueue.SET = {};
        //             }


        //             script.isStart = true;
        //             script.timeFlag = 1;
        //             const fps = Entry.FPS || 60;
        //             const timeValue = (60 / fps) * 50;

        //             // FND_Init type data protocol defined
        //             Entry.hw.sendQueue.SET[device] = {
        //                 type: Entry.Dalgona.sensorTypes.FNDINIT,
        //                 data: {
        //                     level_val,
        //                     block_index: 1,
        //                 },
        //                 time: new Date().getTime(),
        //             };
        //             setTimeout(() => {
        //                 script.timeFlag = 0;
        //             }, timeValue);
        //             return script;
        //         } else if (script.timeFlag == 1) {
        //             return script;
        //         } else {
        //             delete script.timeFlag;
        //             delete script.isStart;
        //             Entry.engine.isContinue = false;
        //             return script.callReturn();
        //         }
        //     },
        //     syntax: { js: [], py: ['RichShield_FND_Control_diplay_brightness(%1, %2)'] },
        // },
        // FND_Control_display_onoff: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['1', 1]],
        //             value: 1,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [
        //                 [Lang.Blocks.RichShield_toggle_off, 0],
        //                 [Lang.Blocks.RichShield_toggle_on, 1],
        //             ],
        //             value: 1,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //     ],
        //     def: { params: [], type: 'FND_Control_display_onoff' },
        //     paramsKeyMap: { fnd_device: 0, onoff: 1 },
        //     class: 'other',
        //     isNotFor: ['Dalgona'],
        //     func(sprite, script) {
        //         const device = script.getNumberValue('fnd_device', script);
        //         const onoff = script.getNumberValue('onoff', script);

        //         if (!script.isStart) {
        //             // index number patched by Remoted 2020-11-20
        //             if (!Entry.hw.sendQueue.SET) {
        //                 Entry.hw.sendQueue.SET = {};
        //             }

        //             script.isStart = true;
        //             script.timeFlag = 1;
        //             const fps = Entry.FPS || 60;
        //             const timeValue = (60 / fps) * 50;

        //             // FND_Init type data protocol defined
        //             Entry.hw.sendQueue.SET[device] = {
        //                 type: Entry.Dalgona.sensorTypes.FNDINIT,
        //                 data: {
        //                     onoff,
        //                     block_index: 2,
        //                 },
        //                 time: new Date().getTime(),
        //             };
                    
        //             setTimeout(() => {
        //                 script.timeFlag = 0;
        //             }, timeValue);
        //             return script;
        //         } else if (script.timeFlag == 1) {
        //             return script;
        //         } else {
        //             delete script.timeFlag;
        //             delete script.isStart;
        //             Entry.engine.isContinue = false;
        //             return script.callReturn();
        //         }

        //     },
        //     syntax: { js: [], py: ['RichShield_FND_Control_display_onoff(%1, %2)'] },
        // },
        // FND_Control_diplay_char: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Dropdown',
        //             options: [['1', 1]],
        //             value: 1,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Block',
        //             accept: 'string',
        //         },
        //         {
        //             type: 'Dropdown',
        //             options: [
        //                 [Lang.Blocks.RichShield_toggle_off, 0],
        //                 [Lang.Blocks.RichShield_toggle_on, 1],
        //             ],
        //             value: 0,
        //             fontSize: 11,
        //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
        //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
        //         },
        //         {
        //             type: 'Block',
        //             accept: 'string',
        //         },
        //     ],
        //     events: {},
        //     def: {
        //         params: [
        //             '1',
        //             {
        //                 type: 'number',
        //                 params: ['1234'],
        //             },
        //             '0',
        //             {
        //                 type: 'number',
        //                 params: ['0.1'],
        //             },
        //         ],
        //         type: 'FND_Control_diplay_char',
        //     },
        //     events: {},
        //     paramsKeyMap: { fnd_device: 0, display_value: 1, onoff: 2, delay_ms: 3 },
        //     class: 'other',
        //     isNotFor: ['Dalgona'],
        //     func(sprite, script) {
        //         const device = script.getNumberValue('fnd_device', script);
        //         const display_str = script.getNumberValue('display_value', script);
        //         const onoff = script.getNumberValue('onoff', script);
        //         const delay_ms_sec = script.getNumberValue('delay_ms', script);
        //         const splited_array = [];
        //         let display_str_converted = 0;

        //         if (!script.isStart) {
        //             if (!Entry.hw.sendQueue.SET) {
        //                 Entry.hw.sendQueue.SET = {};
        //             }

        //             display_str_converted = display_str.toString();

        //             script.isStart = true;
        //             script.timeFlag = 1;
        //             const fps = Entry.FPS || 60;
        //             const timeValue = (60 / fps) * 100;

        //             for (let i = 0; i < display_str_converted.length; i++) {
        //                 splited_array.push(parseInt(display_str_converted.charAt(i)));
        //             }

        //             console.log(`splited_array :${splited_array}`);

        //             // FND_Init type data protocol defined
        //             Entry.hw.sendQueue.SET[device] = {
        //                 type: Entry.Dalgona.sensorTypes.FNDINIT,
        //                 data: {
        //                     display_str,
        //                     onoff,
        //                     block_index: 3,
        //                     str_length: display_str_converted.length,
        //                     data_0: splited_array[0],
        //                     data_1: splited_array[1],
        //                     data_2: splited_array[2],
        //                     data_3: splited_array[3],
        //                     delay_ms: delay_ms_sec,
        //                 },
        //                 time: new Date().getTime(),
        //             };

                        
        //             setTimeout(() => {
        //                 script.timeFlag = 0;
        //             }, timeValue);
        //             return script;
        //         } else if (script.timeFlag == 1) {
        //             return script;
        //         } else {
        //             delete script.timeFlag;
        //             delete script.isStart;
        //             Entry.engine.isContinue = false;
        //             return script.callReturn();
        //         }
        //     },
        //     syntax: { js: [], py: ['RichShield_FND_Control_diplay_char(%1, %2, %3, %4)'] },
        // },
        dalgona_basic_digital_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_digital_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_digital_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_digital_title',
            },
            class: 'digital',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_analog_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_analog_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_analog_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_analog_title',
            },
            class: 'analog',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_pwm_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_pwm_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_pwm_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_pwm_title',
            },
            class: 'pwm',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_library_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_library_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_library_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_library_title',
            },
            class: 'library',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_neopixel_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_neopixel_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_neopixel_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_neopixel_title',
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_ultrasonic_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_ultrasonic_title),
                    offsetY: 7,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_ultrasonic_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_ultrasonic_title',
            },
            class: 'ultrasonic',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_buzzer_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_buzzer_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_buzzer_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_buzzer_title',
            },
            class: 'buzzer',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_dotmatrix_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_dotmatrix_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_dotmatrix_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_dotmatrix_title',
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_rfid_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_rfid_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_rfid_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_rfid_title',
            },
            class: 'RFID',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_motor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_motor_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_motor_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_motor_title',
            },
            class: 'motor',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_stepmotor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_stepmotor_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_stepmotor_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_stepmotor_title',
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_joystick_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_joystick_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_joystick_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_joystick_title',
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_LCD_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_LCD_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_LCD_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_LCD_title',
            },
            class: 'LCD',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_mp3_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_mp3_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_mp3_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_mp3_title',
            },
            class: 'mp3',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_HX711_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_HX711_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_HX711_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_HX711_title',
            },
            class: 'HX711',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },
        dalgona_basic_sensor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.dalgona_basic_sensor_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.dalgona_basic_sensor_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'dalgona_basic_sensor_title',
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            events: {},
        },




        dalgona_basic_list_analog_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        dalgona_basic_list_digital_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                    ],
                    value: '10',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        dalgona_basic_list_digital_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        ['8', '8'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        dalgona_basic_list_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['5', '5'],
                        ['6', '6'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                    ],
                    value: '11',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        dalgona_basic_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.dalgona_basic_toggle_on, 'on'],
                        [Lang.template.dalgona_basic_toggle_off, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        dalgona_basic_list_digital_toggle_en: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['HIGH', 'on'],
                        ['LOW', 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        dalgona_basic_list_digital_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
            },
        },
        dalgona_basic_set_neopixel_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('NUM');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.NEOPIXELINIT,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_neopixel_bright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_neopixel_bright',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('NUM');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.NEOPIXELBRIGHT,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_neopixel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'dalgona_basic_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
                COLOR: 2,
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var num = script.getNumberValue('NUM', script);
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.NEOPIXEL,
                        data: {
                            num: num,
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_neopixel_all: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                    null,
                ],
                type: 'dalgona_basic_set_neopixel_all',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;
                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.NEOPIXELALL,
                        data: {
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_neopixel_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_neopixel_clear',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neopixel',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.NEOPIXELCLEAR,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_lcd_list_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0x27', '0'],
                        ['0x3F', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        dalgona_basic_set_dotmatrix_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['12'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_dotmatrix_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                din = port1;
                // clk = port2;
                // cs = port3;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port1] = {
                        type: Entry.Dalgona_basic.sensorTypes.DOTMATRIXINIT,
                        data: {
                            port1: port1,
                            port2: port2,
                            port3: port3,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_dotmatrix_bright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    {
                        type: 'number',
                        params: ['8'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_dotmatrix_bright',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);

                num = Math.round(num);
                num = Math.min(num, 8);
                num = Math.max(num, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.Dalgona_basic.sensorTypes.DOTMATRIXBRIGHT,
                        data: num,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_dotmatrix_clear: {
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
                type: 'dalgona_basic_set_dotmatrix_clear',
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (1 + 0.5) * 0.1; //0.15
                    timeValue = (60 / fps) * timeValue * 100;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.Dalgona_basic.sensorTypes.DOTMATRIXCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_set_dotmatrix: {
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
                params: [
                    {
                        type: 'text',
                        params: ['003c420024242400'],
                    },
                ],
                type: 'dalgona_basic_set_dotmatrix',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var text = script.getValue('STRING');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.Dalgona_basic.sensorTypes.DOTMATRIX,
                        data: {
                            text: text,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_dotmatrix_emoji_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['🖤', '1'],
                        ['🤍', '2'],
                        ['👆', '3'],
                        ['👇', '4'],
                        ['👈', '5'],
                        ['👉', '6'],
                        ['😊', '7'],
                        ['😥', '8'],
                        ['😡', '9'],
                        ['😆', '10'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        dalgona_basic_set_dotmatrix_emoji: {
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
                params: [
                    {
                        type: 'dalgona_basic_dotmatrix_emoji_list',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_dotmatrix_emoji',
            },
            paramsKeyMap: {
                LIST: 0,
            },
            class: 'dotmatrix',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var value = script.getNumberValue('LIST');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][din] = {
                        type: Entry.Dalgona_basic.sensorTypes.DOTMATRIXEMOJI,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.dalgona_basic_lcd_first_line, '0'],
                        [Lang.template.dalgona_basic_lcd_seconds_line, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        dalgona_basic_get_lcd_row: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'dalgona_basic_get_lcd_row',
                    },
                ],
            },
        },

        dalgona_basic_get_lcd_col: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '0'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                    ['9', '9'],
                                    ['10', '10'],
                                    ['11', '11'],
                                    ['12', '12'],
                                    ['13', '13'],
                                    ['14', '14'],
                                    ['15', '15'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'dalgona_basic_get_lcd_col',
                    },
                ],
            },
        },
        dalgona_basic_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.dalgona_basic_get_analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                    },
                ],
                type: 'dalgona_basic_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'analog',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {},
        },
        dalgona_basic_get_light_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                    },
                ],
                type: 'dalgona_basic_get_light_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { },
        },
        dalgona_basic_get_moisture_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.dalgona_basic_get_analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                        params: ['1'],
                    },
                ],
                type: 'dalgona_basic_get_moisture_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {},
        },

        dalgona_basic_set_digital_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_dcmotor,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                    {
                        type: 'dalgona_basic_list_digital_toggle',
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_dcmotor',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Dalgona_basic.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Dalgona_basic.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {},
        },
        dalgona_basic_set_analog_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_analog_dcmotor,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_analog_dcmotor',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {},
        },
        dalgona_basic_get_sound_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                    },
                ],
                type: 'dalgona_basic_get_sound_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {},
        },
        dalgona_basic_get_infrared_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                    },
                ],
                type: 'dalgona_basic_get_infrared_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {},
        },
        dalgona_basic_get_pullup: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                ],
                type: 'dalgona_basic_get_pullup',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                // var pu = Entry.hw.portData.PULLUP;
                var pu = Entry.hw.portData.DIGITAL;
                
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                // Entry.hw.sendQueue['GET'][Entry.Dalgona.sensorTypes.PULLUP] = {
                //     port: port,
                //     data: 2,
                //     time: new Date().getTime(),
                // };

                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                }

                var pullupvalue = pu ? pu[port] || 0 : 0;
                return !pullupvalue;

                
            },
            
            syntax: { js: [], py: [] },
        },
        dalgona_basic_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                ],
                type: 'dalgona_basic_get_button',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                    port: port,
                    data: 2,
                    time: new Date().getTime(),
                };

                var value = DIGITAL ? DIGITAL[port] || 0 : 0;
                return !value;
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.dalgona_basic_get_analog_mapping,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_analog_basic',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'dalgona_basic_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'analog',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                result = ANALOG ? ANALOG[port] || 0 : 0;
                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

                return result;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_mapping1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                ],
                type: 'dalgona_basic_mapping1',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: 'analog',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }

                num = Math.min(value3, num);
                num = Math.max(value2, num);

                return parseInt(num);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_mapping2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1024'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'dalgona_basic_mapping2',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'analog',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var flag = 0;

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var value4_1 = value4;
                var value5_1 = value5;

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }

                if (value4 > value5) {
                    flag = 1;
                    var swap = value4;
                    value4_1 = value5;
                    value5_1 = swap;
                }

                num -= value2;
                num = num * ((value5_1 - value4_1) / (value3 - value2));

                if (flag == 1) {
                    num = value4 - num;
                    num = Math.min(value4, num);
                    num = Math.max(value5, num);
                } else {
                    num = num + value4;
                    num = Math.min(value5, num);
                    num = Math.max(value4, num);
                }

                return parseInt(num);
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_get_digital_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.dalgona_basic_get_digital_ultrasonic,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['13'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['12'],
                    },
                ],
                type: 'dalgona_basic_get_digital_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'ultrasonic',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1');
                var port2 = script.getNumberValue('PORT2');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                Entry.Utils.sleep(700);

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC[port2] || 0;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_get_dust: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['7'],
                    },
                    {
                        type: 'dalgona_basic_list_analog_basic',
                        params: ['0'],
                    },
                ],
                type: 'dalgona_basic_get_dust',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1');
                var port2 = script.getNumberValue('PORT2');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DUST] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.DUST || 0;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.dalgona_basic_get_digital,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                ],
                type: 'dalgona_basic_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'digital',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.dalgona_basic_get_digital_toggle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                ],
                type: 'dalgona_basic_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_get_digital_pir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.dalgona_basic_get_digital_pir,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                ],
                type: 'dalgona_basic_get_digital_pir',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.PIR] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['dalgona_basic.get_digital_pir(%1)'] },
        },

        dalgona_basic_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_toggle,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                    },
                    {
                        type: 'dalgona_basic_list_digital_toggle_en',
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'digital',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Dalgona_basic.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Dalgona_basic.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_set_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['13'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_toggle',
                    },
                    null,
                ],
                type: 'dalgona_basic_set_led_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'digital',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Dalgona_basic.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Dalgona_basic.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_pwm,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                        params: ['5'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'pwm',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_set_digital_rgbled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_rgbled,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                        params: ['9'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                        params: ['10'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                        params: ['11'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_rgbled',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                VALUE1: 3,
                VALUE2: 4,
                VALUE3: 5,
            },
            class: 'pwm',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                RGBport = port1;

                // if (!Entry.hw.sendQueue['SET']) {
                //     Entry.hw.sendQueue['SET'] = {};
                // }
                // Entry.hw.sendQueue['SET'][RGBport] = {
                //     type: Entry.Dalgona.sensorTypes.RGBLED,
                //     data: {
                //         port1: port1,
                //         port2: port2,
                //         port3: port3,
                //         value1: value1,
                //         value2: value2,
                //         value3: value3,
                //     },
                //     time: new Date().getTime(),
                // };
                // return script.callReturn();
                

                // if (!script.isStart) {
                //     script.isStart = true;
                //     script.timeFlag = 1;
                //     var fps = Entry.FPS || 60;
                //     var timeValue = (60 / fps) * 50;

                //     value1 = Math.round(value1);
                //     value1 = Math.min(value1, 255);
                //     value1 = Math.max(value1, 0);
                //     value2 = Math.round(value2);
                //     value2 = Math.min(value2, 255);
                //     value2 = Math.max(value2, 0);
                //     value3 = Math.round(value3);
                //     value3 = Math.min(value3, 255);
                //     value3 = Math.max(value3, 0);

                //     if (!Entry.hw.sendQueue['SET']) {
                //         Entry.hw.sendQueue['SET'] = {};
                //     }
                //     Entry.hw.sendQueue['SET'][RGBport] = {
                //         type: Entry.Dalgona.sensorTypes.RGBLED,
                //         data: {
                //             port1: port1,
                //             port2: port2,
                //             port3: port3,
                //             value1: value1,
                //             value2: value2,
                //             value3: value3,
                //         },
                //         time: new Date().getTime(),
                //     };
                //     setTimeout(function() {
                //         script.timeFlag = 0;
                //     }, 10);
                //     return script;
                // } else if (script.timeFlag == 1) {
                //     return script;
                // } else {
                //     delete script.timeFlag;
                //     delete script.isStart;
                //     Entry.engine.isContinue = false;
                //     return script.callReturn();
                // }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port1] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value1,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port2] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port3] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value3,
                    time: new Date().getTime(),
                };
                 return script.callReturn();
            },
            syntax: { js: [], py: [{}] },
        },
        dalgona_basic_set_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_servo,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['8'],
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, 180);
                value = Math.max(value, 0);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_set_digital_servo2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_servo2,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['8'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['180'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_servo2',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE1: 1,
                VALUE2: 2,
                STIME: 3,
            },
            class: 'motor',
            isNotFor: ['Dalgona_basic'],
            // func: function(sprite, script) {
            //     var port = script.getNumberValue('PORT');
            //     var value1 = script.getNumber    Value('VALUE1', script);
            //     var value2 = script.getNumberValue('VALUE2', script);
            //     var stime = script.getNumberValue('STIME', script);

            //     value1 = Math.min(value1, 180);
            //     value1 = Math.max(value1, 0);
            //     value2 = Math.min(value2, 180);
            //     value2 = Math.max(value2, 0);

            //     if (!Entry.hw.sendQueue['SET']) {
            //         Entry.hw.sendQueue['SET'] = {};
            //     }
                
            //     Entry.hw.sendQueue['SET'][port] = {
            //         type: Entry.Dalgona.sensorTypes.SERVO2,
            //         data: {
            //             value1: value1,
            //             value2: value2,
            //             stime: stime,
            //         },
            //         time: new Date().getTime(),
            //     };
            //     return script.callReturn();
            // },
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var stime = script.getNumberValue('STIME', script);

                value1 = Math.min(value1, 180);
                value1 = Math.max(value1, 0);
                value2 = Math.min(value2, 180);
                value2 = Math.max(value2, 0);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.SERVO2,
                        data: {
                            value1: value1,
                            value2: value2,
                            stime: stime,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [{}] },
        },
        dalgona_basic_set_digital_buzzer_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['6'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_toggle',
                    },

                    null,
                ],
                type: 'dalgona_basic_set_digital_buzzer_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'buzzer',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Dalgona_basic.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Dalgona_basic.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.TONETOGGLE,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_set_digital_buzzer_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_pwm',
                        params: ['6'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_buzzer_volume',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'buzzer',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Dalgona_basic.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_set_digital_buzzer,
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
                params: [
                    {
                        type: 'dalgona_basic_list_digital_basic',
                        params: ['6'],
                    },
                    {
                        type: 'dalgona_basic_list_digital_tone',
                    },
                    {
                        type: 'dalgona_basic_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_digital_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'buzzer',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.Dalgona_basic.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration === 0) {
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.Dalgona_basic.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 8) {
                        octave = 8;
                    }
                    if (note != 0) {
                        value = Entry.Dalgona_basic.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        dalgona_basic_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'dalgona_basic_lcd_list_init',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'dalgona_basic_lcd_init',
            },
            paramsKeyMap: {
                LIST: 0,
                COL: 1,
                LINE: 2,
            },
            class: 'LCD',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var list = script.getNumberValue('LIST');
                var col = script.getNumberValue('COL');
                var line = script.getValue('LINE');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 0.1 * 1000;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.Dalgona_basic.sensorTypes.LCDINIT,
                        data: {
                            list: list,
                            col: col,
                            line: line,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_module_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                params: [
                    {
                        type: 'dalgona_basic_get_lcd_col',
                        params: ['0'],
                    },
                    {
                        type: 'dalgona_basic_get_lcd_row',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Hello, dalgona_basic'],
                    },
                    null,
                ],
                type: 'dalgona_basic_module_digital_lcd',
            },
            paramsKeyMap: {
                COL: 0,
                ROW: 1,
                STRING: 2,
            },
            class: 'LCD',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var row = script.getNumberValue('ROW');
                var col = script.getNumberValue('COL');
                var text = script.getValue('STRING');
                text += ' ';

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.Dalgona_basic.sensorTypes.LCD,
                        data: {
                            line: row,
                            column: col,
                            text: text,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_lcd_clear: {
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
                type: 'dalgona_basic_lcd_clear',
            },
            class: 'LCD',
            isNotFor: ['Dalgona_basic'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.Dalgona_basic.sensorTypes.LCDCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_get_dht: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['온도(°C)', '0'],
                        ['습도(%)', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },

                ],
                type: 'dalgona_basic_get_dht',
            },
            paramsKeyMap: {
                PORT: 0,
                DHT_SELECT: 1,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var type = script.getNumberValue('DHT_SELECT');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                if (type == 0) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DHTTEMP] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return Entry.hw.portData.DHTTEMP || 0;
                } else if (type == 1) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DHTHUMI] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return Entry.hw.portData.DHTHUMI || 0;
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_set_mp3_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_mp3_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'mp3',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                tx = script.getNumberValue('PORT1');
                var rx = script.getNumberValue('PORT2');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.Dalgona_basic.sensorTypes.MP3INIT,
                        data: {
                            tx: tx,
                            rx: rx,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_set_mp3_play: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_mp3_play',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'mp3',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                script.isStart = true;
                script.timeFlag = 1;
                var fps = Entry.FPS || 60;
                var timeValue = (60 / fps) * 50;

                Entry.hw.sendQueue['SET'][tx] = {
                    type: Entry.Dalgona_basic.sensorTypes.MP3PLAY1,
                    data: {
                        tx: tx,
                        num: num,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_set_mp3_play2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_mp3_play2',
            },
            paramsKeyMap: {
                NUM: 0,
                TIME: 1,
            },
            class: 'mp3',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM');
                var time_value = script.getNumberValue('TIME');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    time_value = (60 / fps) * time_value * 1000;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.Dalgona_basic.sensorTypes.MP3PLAY1,
                        data: {
                            tx: tx,
                            num: num,
                            //time_value: time_value,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, time_value);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.Dalgona_basic.sensorTypes.MP3PLAY1,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_set_mp3_vol: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    {
                        type: 'number',
                        params: ['15'],
                    },
                    null,
                ],
                type: 'dalgona_basic_set_mp3_vol',
            },
            paramsKeyMap: {
                VOL: 0,
            },
            class: 'mp3',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var vol = script.getNumberValue('VOL');

                vol = Math.round(vol);
                vol = Math.min(vol, 30);
                vol = Math.max(vol, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][tx] = {
                        type: Entry.Dalgona_basic.sensorTypes.MP3VOL,
                        data: {
                            tx: tx,
                            vol: vol,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_load_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['6'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    null,
                ],
                type: 'dalgona_basic_load_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'HX711',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);

                dout = port1;
                sck = port2;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][sck] = {
                        type: Entry.Dalgona_basic.sensorTypes.LOADINIT,
                        data: {
                            port1: port1,
                            port2: port2,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_load_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                    {
                        type: 'number',
                        params: ['-20000'],
                    },
                    null,
                ],
                type: 'dalgona_basic_load_scale',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'HX711',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][sck] = {
                        type: Entry.Dalgona_basic.sensorTypes.LOADSCALE,
                        data: {
                            num: num,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_load_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'dalgona_basic_load_value',
            },
            paramsKeyMap: {},
            class: 'HX711',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][sck];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.LOADVALUE] = {
                    port: sck,
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.LOADVALUE || 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_list_joy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['첫번째', '1'],
                        ['두번째', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NUM: 0,
            },
            func: function(sprite, script) {
                return script.getField('NUM');
            },
        },
        dalgona_basic_joy_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_joy',
                        params: ['1'],
                    },
                    {
                        type: 'dalgona_basic_list_analog_basic',
                        params: ['0'],
                    },
                    {
                        type: 'dalgona_basic_list_analog_basic',
                        params: ['1'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['8'],
                    },
                    null,
                ],
                type: 'dalgona_basic_joy_init',
            },
            paramsKeyMap: {
                NUM: 0,
                PORT1: 1,
                PORT2: 2,
                PORT3: 3,
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                if (num == 1) {
                    joyx = port1;
                    joyy = port2;
                    joyz = port3;
                } else if (num == 2) {
                    joyx2 = port1;
                    joyy2 = port2;
                    joyz2 = port3;
                }

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][joyx] = {
                            type: Entry.Dalgona_basic.sensorTypes.JOYINIT,
                            data: {
                                num: num,
                                port1: port1,
                                port2: port2,
                                port3: port3,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][joyx2] = {
                            type: Entry.Dalgona_basic.sensorTypes.JOYINIT,
                            data: {
                                num: num,
                                port1: port1,
                                port2: port2,
                                port3: port3,
                            },
                            time: new Date().getTime(),
                        };
                    }
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_get_joy_x: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_joy',
                        params: ['1'],
                    },
                ],
                type: 'dalgona_basic_get_joy_x',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                var num = script.getNumberValue('NUM', script);
                if (num == 1) {
                    return ANALOG ? ANALOG[joyx] || 0 : 0;
                } else if (num == 2) {
                    return ANALOG ? ANALOG[joyx2] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_get_joy_y: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_joy',
                        params: ['1'],
                    },
                ],
                type: 'dalgona_basic_get_joy_y',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                var num = script.getNumberValue('NUM', script);
                if (num == 1) {
                    return ANALOG ? ANALOG[joyy] || 0 : 0;
                } else if (num == 2) {
                    return ANALOG ? ANALOG[joyy2] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        dalgona_basic_get_joy_z: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_joy',
                        params: ['1'],
                    },
                ],
                type: 'dalgona_basic_get_joy_z',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var DIGITAL = Entry.hw.portData.DIGITAL;
                var num = script.getNumberValue('NUM', script);

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                if (num == 1) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                        port: joyz,
                        data: 2,
                        time: new Date().getTime(),
                    };

                    var value = DIGITAL ? DIGITAL[joyz] || 0 : 0;
                    return !value;
                } else if (num == 2) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.DIGITAL] = {
                        port: joyz2,
                        data: 2,
                        time: new Date().getTime(),
                    };

                    var value = DIGITAL ? DIGITAL[joyz2] || 0 : 0;
                    return !value;
                }
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_list_joy_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가운데', '0'],
                        ['위', '1'],
                        ['아래', '4'],
                        ['왼쪽', '2'],
                        ['오른쪽', '3'],
                        ['왼쪽위', '5'],
                        ['왼쪽아래', '6'],
                        ['오른쪽위', '7'],
                        ['오른쪽아래', '8'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                DIR: 0,
            },
            func: function(sprite, script) {
                return script.getField('DIR');
            },
        },
        dalgona_basic_get_joy_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_basic_list_joy',
                        params: ['1'],
                    },
                    {
                        type: 'dalgona_basic_list_joy_direction',
                        params: ['0'],
                    },
                ],
                type: 'dalgona_basic_get_joy_move',
            },
            paramsKeyMap: {
                NUM: 0,
                DIR: 1,
            },
            class: 'joystick',
            isNotFor: ['Dalgona_basic'],
            func(sprite, script) {
                var direction = script.getNumberValue('DIR');
                const ANALOG = Entry.hw.portData.ANALOG;
                num = script.getNumberValue('NUM', script);

                const getValue = function(w) {
                    return ANALOG[w] <= 100 ? 0 : ANALOG[w] >= 930 ? 2 : 1;
                };

                var xpin;
                var ypin;
                if (num == 1) {
                    xpin = joyx;
                    ypin = joyy;
                } else if (num == 2) {
                    xpin = joyx2;
                    ypin = joyy2;
                }
                if (
                    direction == Entry.Dalgona_basic.direction.CENTER &&
                    getValue(xpin) == 1 &&
                    getValue(ypin) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.DOWN &&
                    getValue(xpin) == 1 &&
                    getValue(ypin) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.LEFT &&
                    getValue(xpin) == 0 &&
                    getValue(ypin) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.LEFT_DOWN &&
                    getValue(xpin) == 0 &&
                    getValue(ypin) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.LEFT_UP &&
                    getValue(xpin) == 0 &&
                    getValue(ypin) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.RIGHT &&
                    getValue(xpin) == 2 &&
                    getValue(ypin) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.RIGHT_DOWN &&
                    getValue(xpin) == 2 &&
                    getValue(ypin) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.RIGHT_UP &&
                    getValue(xpin) == 2 &&
                    getValue(ypin) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.Dalgona_basic.direction.UP &&
                    getValue(xpin) == 1 &&
                    getValue(ypin) == 0
                ) {
                    return 1;
                }

                return 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_list_step: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['첫번째', '1'],
                        ['두번째', '2'],
                        ['세번째', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NUM: 0,
            },
            func: function(sprite, script) {
                return script.getField('NUM');
            },
        },
        dalgona_basic_step_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_step',
                        params: ['1'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['8'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['9'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    null,
                ],
                type: 'dalgona_basic_step_init',
            },
            paramsKeyMap: {
                NUM: 0,
                PORT1: 1,
                PORT2: 2,
                PORT3: 3,
                PORT4: 4,
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);
                var port4 = script.getNumberValue('PORT4', script);

                if (num == 1) {
                    portpin1 = port1;
                } else if (num == 2) {
                    portpin2 = port1;
                } else if (num == 3) {
                    portpin3 = port1;
                }

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    if (num == 1) {
                        console.log('STEP INIT 1st');
                        console.log(num);
                        console.log(port1);
                        console.log(port2);
                        console.log(port3);
                        console.log(port4);

                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPINIT,
                            data: {
                                num: num,
                                port1: port1,
                                port2: port2,
                                port3: port3,
                                port4: port4,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        console.log('STEP INIT 2nd');
                        console.log(num);
                        console.log(port1);
                        console.log(port2);
                        console.log(port3);
                        console.log(port4);
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPINIT,
                            data: {
                                num: num,
                                port1: port1,
                                port2: port2,
                                port3: port3,
                                port4: port4,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        console.log('STEP INIT 3rd');
                        console.log(num);
                        console.log(port1);
                        console.log(port2);
                        console.log(port3);
                        console.log(port4);
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPINIT,
                            data: {
                                num: num,
                                port1: port1,
                                port2: port2,
                                port3: port3,
                                port4: port4,
                            },
                            time: new Date().getTime(),
                        };
                    }

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_step_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_step',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['14'],
                    },
                    null,
                ],
                type: 'dalgona_basic_step_speed',
            },
            paramsKeyMap: {
                NUM: 0,
                SPEED: 1,
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var sp = script.getNumberValue('SPEED', script);

                sp = Math.round(sp);
                sp = Math.min(sp, 20);
                sp = Math.max(sp, 0);

                if (num == 1) {
                    speed1 = sp;
                } else if (num == 2) {
                    speed2 = sp;
                } else if (num == 3) {
                    speed3 = sp;
                }

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPSPEED,
                            data: {
                                num: num,
                                speed: speed1,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPSPEED,
                            data: {
                                num: num,
                                speed: speed2,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPSPEED,
                            data: {
                                num: num,
                                speed: speed3,
                            },
                            time: new Date().getTime(),
                        };
                    }

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_list_step_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['정방향', '1'],
                        ['역방향', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                DIR: 0,
            },
            func: function(sprite, script) {
                return script.getField('DIR');
            },
        },
        dalgona_basic_step_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_step',
                        params: ['1'],
                    },
                    {
                        type: 'dalgona_basic_list_step_direction',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dalgona_basic_step_rotate',
            },
            paramsKeyMap: {
                NUM: 0,
                DIR: 1,
                VALUE: 2,
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var dir = script.getNumberValue('DIR', script);
                num = script.getNumberValue('NUM', script);
                var val = script.getNumberValue('VALUE', script);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue;

                    if (num == 1) {
                        timeValue = (60 / speed1) * val * 1000 + 32;
                        console.log(timeValue);
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE,
                            data: {
                                num: num,
                                dir: dir,
                                val: val * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        timeValue = (60 / speed2) * val * 1000 + 32;
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE,
                            data: {
                                num: num,
                                dir: dir,
                                val: val * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        timeValue = (60 / speed3) * val * 1000 + 32;
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE,
                            data: {
                                num: num,
                                dir: dir,
                                val: val * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    }

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes_basic.STEPROTATE,
                            data: 0,
                            time: new Date().getTime(),
                        };_basic
                    } else if (num == 3) {
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    }
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_step_rotate2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_step',
                        params: ['1'],
                    },
                    {
                        type: 'dalgona_basic_list_step_direction',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'dalgona_basic_step_rotate2',
            },
            paramsKeyMap: {
                NUM: 0,
                DIR: 1,
                VALUE: 2,
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var dir = script.getNumberValue('DIR', script);
                num = script.getNumberValue('NUM', script);
                var val = script.getNumberValue('VALUE', script);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;

                    var timeValue;

                    if (num == 1) {
                        timeValue = (60 / (speed1 * 360)) * val * 1000 + 32;
                        console.log(timeValue);
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: {
                                num: num,
                                dir: dir,
                                val: (val / 360) * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        timeValue = (60 / (speed2 * 360)) * val * 1000 + 32;
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: {
                                num: num,
                                dir: dir,
                                val: (val / 360) * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        timeValue = (60 / (speed3 * 360)) * val * 1000 + 32;
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: {
                                num: num,
                                dir: dir,
                                val: (val / 360) * 2048,
                            },
                            time: new Date().getTime(),
                        };
                    }

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE2,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    }
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_step_rotate3: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'dalgona_basic_list_step',
                        params: ['1'],
                    },
                    {
                        type: 'dalgona_basic_list_step_direction',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['5'],
                    },
                    null,
                ],
                type: 'dalgona_basic _step_rotate3',
            },
            paramsKeyMap: {
                NUM: 0,
                DIR: 1,
                SEC: 2,
            },
            class: 'step',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                num = script.getNumberValue('NUM');
                var dir = script.getNumberValue('DIR');
                var sec = script.getNumberValue('SEC');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: {
                                num: num,
                                dir: dir,
                                sec: sec,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: {
                                num: num,
                                dir: dir,
                                sec: sec,
                            },
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: {
                                num: num,
                                dir: dir,
                                sec: sec,
                            },
                            time: new Date().getTime(),
                        };
                    }

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, sec * 1000 + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    if (num == 1) {
                        Entry.hw.sendQueue['SET'][portpin1] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    } else if (num == 2) {
                        Entry.hw.sendQueue['SET'][portpin2] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    } else if (num == 3) {
                        Entry.hw.sendQueue['SET'][portpin3] = {
                            type: Entry.Dalgona_basic.sensorTypes.STEPROTATE3,
                            data: 0,
                            time: new Date().getTime(),
                        };
                    }
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_module_digital_oled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.dalgona_basic_module_digital_oled,
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
                params: [
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'dalgona_basic_module_digital_oled',
            },
            paramsKeyMap: {
                VALUE0: 0,
                VALUE1: 1,
                STRING: 2,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port = 0;
                var coodinate_x = script.getNumberValue('VALUE0');
                var coodinate_y = script.getNumberValue('VALUE1');
                var string = script.getValue('STRING');
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    coodinate_x = Math.min(coodinate_x, 127);
                    coodinate_x = Math.max(coodinate_x, 0);
                    coodinate_y = Math.min(coodinate_y, 63);
                    coodinate_y = Math.max(coodinate_y, 0);

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Dalgona_basic.sensorTypes.OLED,
                        data: {
                            value0: coodinate_x,
                            value1: coodinate_y,
                            text0: text[0],
                            text1: text[1],
                            text2: text[2],
                            text3: text[3],
                            text4: text[4],
                            text5: text[5],
                            text6: text[6],
                            text7: text[7],
                            text8: text[8],
                            text9: text[9],
                            text10: text[10],
                            text11: text[11],
                            text12: text[12],
                            text13: text[13],
                            text14: text[14],
                            text15: text[15],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },

        dalgona_basic_rfid_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['9'],
                    },
                    null,
                ],
                type: 'dalgona_basic_rfid_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'RFID',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);

                ss = port1;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][ss] = {
                        type: Entry.Dalgona_basic.sensorTypes.RFIDINIT,
                        data: {
                            port1: port1,
                            port2: port2,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_is_rfid_tapped: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'dalgona_basic_is_rfid_tapped',
            },
            paramsKeyMap: {},
            class: 'RFID',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.RFIDTAP] = {
                    port: ss,
                    time: new Date().getTime(),
                };

                var value = Entry.hw.portData.RFIDTAP || 0;
                return value;
            },
            syntax: { js: [], py: [] },
        },
        dalgona_basic_get_rfid_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'dalgona_basic_get_rfid_value',
            },
            paramsKeyMap: {},
            class: 'RFID',
            isNotFor: ['Dalgona_basic'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][ss];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.RFIDVALUE] = {
                    port: ss,
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.RFIDVALUE || 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        dalgona_basic_get_mlx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['목표물', '0'],
                        ['주변', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'dalgona_basic_get_mlx',
            },
            paramsKeyMap: {
                MLX_SELECT: 0,
            },
            class: 'sensor',
            isNotFor: ['Dalgona_basic'],
            
            func: function(sprite, script) {
                var type = script.getNumberValue('MLX_SELECT')


                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }

                if (type == 0) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.MLXOBJ] = {
                        port: 0,
                        time: new Date().getTime(),
                    };
                    return Entry.hw.portData.MLXOBJ || 0;
                } else if (type == 1) {
                    Entry.hw.sendQueue['GET'][Entry.Dalgona_basic.sensorTypes.MLXAMB] = {
                        port: 0,
                        time: new Date().getTime(),
                    };
                    return Entry.hw.portData.MLXAMB || 0;
                }                    
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
    };
};

module.exports = Entry.Dalgona_basic;