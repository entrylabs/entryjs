'use strict';

Entry.RichShield = {
    id: '36.2',
    name: 'RichShield',
    url: 'https://gorillacell.kr/',
    imageName: 'RichShield.png',
    title: {
        ko: '아두이노 부자실드',
        en: 'Arduino RichShield',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                if (Entry.hw.sendQueue.SET[key].type == Entry.RichShield.sensorTypes.DCMOTOR) {
                    Entry.hw.sendQueue.SET[key].data.value1 = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } else {
                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
        }
        Entry.hw.sendQueue.GET = {};
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
        RGBLED: 12,
        DCMOTOR: 13,
        OLED: 14,
        PIR: 15,
        FND: 16,
        DHT: 12,
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
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.RichShield.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                RichShield_pulldown: '기본',
                RichShield_pullup: '풀업',
                chocopi_control_event_pressed: '누를 때',
                chocopi_control_event_released: '뗄 때',
                chocopi_joystick_X: '조이스틱 좌우',
                chocopi_joystick_Y: '조이스틱 상하',
                chocopi_motion_photogate_event_blocked: '막았을 때',
                chocopi_motion_photogate_event_unblocked: '열었을 때',
                chocopi_motion_photogate_time_blocked: '막은 시간',
                chocopi_motion_photogate_time_unblocked: '연 시간',
                chocopi_motion_angle_x: '각도X',
                chocopi_motion_angle_y: '각도Y',
                chocopi_motion_angle_z: '각도Z',
                chocopi_port: '포트',
                chocopi_pot: '볼륨',
                chocopi_touch_event_touch: '만질 때',
                chocopi_touch_event_untouch: '뗄 때',
                RichShield_lcd_first_line: '첫 번째',
                RichShield_lcd_seconds_line: '두 번째',
                RichShield_toggle_on: '켜기',
                RichShield_toggle_off: '끄기',
            },
            template: {
                RichShield_get_Analog_value: '아날로그 %1 번 핀의 값',
                RichShield_set_digital_toggle: '디지털 %1 번 핀 %2 %3',
                RichShield_get_digital: '디지털 %1 번 핀 센서 %2 값',
                RichShield_get_digital_toggle: '디지털 %1 번 핀 센서 %2 값',
                RichShield_LCD_event: 'LCD Display(1602)-I2C',
                RichShield_LCD_Control_init: 'LCD %1 번 :  주소 %2 로 설정',
                RichShield_LCD_Control_Display: 'LCD화면 %1 줄에 %2 나타내기 %3',
                RichShield_FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                RichShield_FND_Control_init: 'FND %1 번 : 디지털 CLK %2, DIO %3 번 핀으로 설정',
                RichShield_FND_Control_diplay_brightness: 'FND %1 번 : 밝기 %2 단계로 설정',
                RichShield_FND_Control_display_onoff: 'FND %1 번 : 전원 %2',
                RichShield_FND_Control_diplay_char:
                    'FND %1 번 : %2 출력하기:나머지0채우기 %3  %4 초 대기',
                RichShield_DHT_event: '온습도센서(DHT11/22)-디지털 12번 핀',
                RichShield_DHT_Control_Init_Process: '온습도 %1 번 : 디지털 %2 번 핀 / 버전 %3',
                RichShield_DHT_Control_Read_Temper: '온습도 %1 번 : 온도값 읽기 %2',
                /*
                chocopi_control_button: '%1 컨트롤 %2번을 누름',
                chocopi_control_event: '%1 %2 컨트롤 %3을 %4',
                chocopi_control_joystick: '%1 컨트롤 %2의 값',
                chocopi_dc_motor: '%1 DC모터 %2 %3% 세기 %4 방향 %5',
                chocopi_led: '%1 LED %2 RGB(%3 %4 %5) %6',
                chocopi_motion_photogate_event: '%1 %2 포토게이트 %3번을 %4',
                chocopi_motion_photogate_status: '%1 포토게이트 %2번이 막힘',
                chocopi_motion_photogate_time: '%1 포토게이트%2번을 %3',
                chocopi_motion_value: '%1 모션 %2의 값',
                chocopi_motion_angle: '%1 모션 %2',
                chocopi_sensor: '%1 센서 %2',
                chocopi_servo_motor: '%1 서보모터 %2번 %3도 %4',
                chocopi_touch_event: '%1 %2 터치 %3번을 %4',
                chocopi_touch_status: '%1 터치 %2번을 만짐',
                chocopi_touch_value: '%1 터치 %2번의 값',
                chocopi_map_range: '%1을 %2~%3에서 %4~%5로',
                */
            },
            /*
            Helper: {
                chocopi_control_button:
                    '버튼이 눌리면 참이 됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_control_event:
                    '버튼을 누르거나 뗄 때 처리할 엔트리 블록들을 연결합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_control_joystick:
                    '조이스틱 좌우, 상하, 볼륨의 값은 0~4095까지 입니다.<br/>따라서 2047 근처가 중간이 됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_dc_motor:
                    'DC모터 모듈에는 직류전동기 두개를 연결 할 수 있습니다.<br/> 직류 전동기는 최대 5V로 동작하게 됩니다.<br/>값은 100이 최대(100%)이고 음수를 넣으면 반대 방향으로 회전합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_led:
                    'LED번호는 LED블록에 연결된 순서이고 1번부터 시작합니다.<br/>RGB값은 0~255사이의 값입니다.<br/>빨강(Red),녹색(Green), 파랑(Blue)순서로  입력합니다.<br/>밝은 LED를 직접보면 눈이 아프니까 값을 0~5정도로 씁니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_event:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br/>빛센서를 물체로 가리거나 치우면 시작되는 엔트리 블록을 연결합니다<br/>모션 모듈에는 포토게이트 2개를 연결할 수 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_status:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br>물체가 빛센서를 가리면 참</b>이됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_time:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br>이 블록은 물체가 빛센서를 가리거나 벗어난 시간을 가집니다.<br/>1/10000초까지 측정할 수 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_value:
                    '모션 모듈에는 3개의 적외선 센서가 있습니다.<br/>0~4095사이의 값을 가질 수 있는데 물체가 빛을 많이 반사할 수록 작은 값을 가집니다. <br/>거리를 대략적으로 측정할 수 있습니다. <br/>가속도와 각가속도 값의 범위는 -32768~32767 까지입니다.<br/>가속도를 이용해서 센서의 기울기를 측정할 수도 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_angle:
                    '모션 모듈의 가속도 센서를 이용하여 기울기를 측정합니다.<br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_sensor:
                    '온도 값은 섭씨 온도입니다.<br/>습도 값은 백분율로 나타낸 상대습도 값입니다.<br/>빛은 로그스케일로 0~4095사이입니다.<br/>아날로그 값은 0~4095사이입니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_servo_motor:
                    '서보모터 모듈에는 4개의 서보모터를 연결 할 수 있습니다.<br/>서보모터는 5V로 동작하게 됩니다.<br/>각도는 0~200도까지 지정할 수 있습니다.<br/>연속회전식 서보모터를 연결하면 각도에 따라 속도가 변하게됩니다.<br/>90~100 사이가 중간값입니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_event:
                    '터치 모듈에는 1~12번의 연결 패드가 있습니다. <br/>만지거나 뗄 때 처리할 엔트리 블록들을 연결합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_status:
                    '터치 모듈의 패드를 만지면 참이됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_value:
                    '터치패드에 연결된 물체의 전기용량이 커지면 값이 작아집니다.<br/>여러 명이 손잡고 만지면 더 작은 값이 됩니다.<br/>전기용량이란 물체에 전기를 띈 입자를 얼마나 가지고 있을 수 있는 지를 말합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_map_range:
                    '예를 들어 설명하면, 컨트럴 블럭의 조이스틱X의 위치에 따라 인형의 위치를 -100에서 100사이로 정해주고 싶다면. 조이스틱X, 0, 4095, -100,100 순서대로 입력합니다.',
            },
            */
        },
        en: {
            // en.js에 작성하던 내용
            Blocks: {
                RichShield_pulldown: 'Pull Down',
                RichShield_pullup: 'Pull Up',
                chocopi_control_event_pressed: 'pressed',
                chocopi_control_event_released: 'released',
                chocopi_joystick_X: 'joystick X',
                chocopi_joystick_Y: 'joystick Y',
                chocopi_motion_photogate_event_blocked: 'blocked',
                chocopi_motion_photogate_event_unblocked: 'unblocked',
                chocopi_motion_photogate_time_blocked: 'blocked',
                chocopi_motion_photogate_time_unblocked: 'unblocked',
                chocopi_motion_angle_x: 'angle X',
                chocopi_motion_angle_y: 'angle Y',
                chocopi_motion_angle_z: 'angle Z',
                chocopi_port: 'P',
                chocopi_pot: 'potentiometer',
                chocopi_touch_event_touch: 'touched',
                chocopi_touch_event_untouch: 'untouched',
                RichShield_lcd_first_line: 'first',
                RichShield_lcd_seconds_line: 'second',
                RichShield_toggle_on: 'on',
                RichShield_toggle_off: 'off',
            },
            template: {
                RichShield_get_Analog_value: 'Get Analog %1 pin value',
                RichShield_set_digital_toggle: 'Digital %1 pin %2 %3',
                RichShield_get_digital: 'Digital %1 pin sensor value %2',
                RichShield_get_digital_toggle: 'Digital %1 pin sensor value %2',
                RichShield_LCD_event: 'LCD Display(1602)-I2C',
                RichShield_LCD_Control_init: 'LCD %1 :  Address set to %2',
                RichShield_LCD_Control_Display: 'LCD %1 line %2 appear %3',
                RichShield_FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                RichShield_FND_Control_init: 'FND %1 : Digital CLK %2  , DIO %3 pin setting',
                RichShield_FND_Control_diplay_brightness: 'FND %1 : Brightness %2 level setting',
                RichShield_FND_Control_display_onoff: 'FND %1 : Power %2',
                RichShield_FND_Control_diplay_char:
                    'FND %1 : %2 display:zero-fill %3  %4 sec waiting',
                RichShield_DHT_event: 'Humidity/Temperature(DHT11/22)-Digital 12 pin',
                RichShield_DHT_Control_Init_Process:
                    'Humidity/Temperature %1 : Digital %2 Pin, Version %3',

                RichShield_DHT_Control_Read_Temper: 'Humidity/Temperature %1 : read Temperature %2',
                /*
                chocopi_control_button: '%1 controller %2 is pressed',
                chocopi_control_event: '%1 When %2 controller %3 is %4',
                chocopi_control_joystick: '%1 controller %2 value',
                chocopi_dc_motor: '%1 DC motor #%2  %3 % direction %4 %5',
                chocopi_led: '%1 LED #%2 RGB(%3 %4 %5) %6',
                chocopi_motion_photogate_event: '%1 When %2 photogate %3 is %4',
                chocopi_motion_photogate_status: '%1 photogate #%2 is blocked',
                chocopi_motion_photogate_time: 'time when %1 photogate %2 was %3',
                chocopi_motion_value: '%1 motion %2 value',
                chocopi_sensor: '%1 sensor %2',
                chocopi_servo_motor: '%1 set servo motor #%2 %3 degree %4',
                chocopi_touch_event: '%1 When %2 touch pad%3 is %4',
                chocopi_touch_status: '%1 touch pad%2 is touched',
                chocopi_touch_value: '%1 touch pad%2 value',
                chocopi_map_range: 'map %1 in %2~%3 to %4~%5',
                */
            },
            /*
            Helper: {
                chocopi_control_button:
                    'This block will be true if the button is pressed.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_control_event:
                    'You can attach blocks to process when the button is pressed or released <br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_control_joystick:
                    'Joystick X,Y and potentiometer has range of  0~4095.<br/>so, around 2047 will be center value.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_dc_motor:
                    "Two DC motors can be connected to 'DC motor' module<br/> The motor will be supplied with maximum 5V.<br/>Maximum value is 100 (100%), is negative value is used then it will rotate opposite direction.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_led:
                    'LED number start from 1 and is the connecting order from the LED module.<br/>You can assign RGB values from 0 to 255<br/>RGB(Red Green Blue) order<br/>To watch an LED with bright light can be painful,<br/>so, please use small number like 0 to 5.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_motion_photogate_event:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>You can attach blocks when an object blocks or unblocks light sensor<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_photogate_status:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>This block will be <b>true if an object blocks sensor</b><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_photogate_time:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>This block will have the time when an object blocked or unblocked the sensor<br/>It can measure time with resolution of 1/10000 sec<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_value:
                    "'Motion' module has three infrared sensors<br/>The value has range of 0~4095, the more reflection from object, the smaller the value is<br/>It can be used to measure approximate distance between the sensor and an object <br/>Acceleration and angular acceleration value ranges from -32768 to 32767.<br/>You can measure inclination of the sensor using these values.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_sensor:
                    'Temperature value is Celsius.<br/>Relative humidity value ranges from 0 to 100%.<br/>Light value ranges 0~4095 in log scale.<br/>Analog value ranges from 0 to 4095.<br/><br/>Port number(P1~P8) is automatically selected internally.<br>It is needed only when multiple modules with the same kind are used',
                chocopi_servo_motor:
                    "'Servo' module can be connected to four servo motors<br/>Servo motors are provided with 5V<br/>You can assign 0~200 in degree unit.<br/>If a contineous rotational servo motor is connected, it's speed is determined by the degree value.<br/>Center value is from 90 to 100 varying by motor model.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_touch_event:
                    'Touch module has #1~12 connecting pads.<br/>You can attach block to process when these pads are touched or untouched.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_touch_status:
                    'It will be true if the pad is touched.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_touch_value:
                    "The value will be smaller if the capacitance of the obeject is larger.<br/>If many people hold each other's hand and touch, the value will be smaller<br/>'Capacitance' means how many electric particles the object can hold.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_map_range:
                    'Usage example: If you want to set a sprite position x according to joystic x position between -100 and 100, you can put five values as Joystic X, 0, 4095, -100, 100.',
            },
            */
        },
    };
};

Entry.RichShield.blockMenuBlocks = [
    'RichShield_get_Analog_value',
    'RichShield_set_digital_toggle',
    'RichShield_get_digital',
    'RichShield_get_digital_toggle',

    'RichShield_LCD_event',
    'RichShield_LCD_Control_init',
    'RichShield_LCD_Control_Display',

    'RichShield_FND_event',
    'RichShield_FND_Control_init',
    'RichShield_FND_Control_diplay_brightness',
    'RichShield_FND_Control_display_onoff',
    'RichShield_FND_Control_diplay_char',

    'RichShield_DHT_event',
    'RichShield_DHT_Control_Init_Process',
    'RichShield_DHT_Control_Read_Temper',
    //'RichShield_DHT_Control_Read_Temper',
    //'RichShield_get_number_sensor_value',
    /*
    'RichShield_get_number_sensor_value',
    'RichShield_toggle_led',
    'RichShield_toggle_pwm',
    'RichShield_convert_scale',
    */
];

Entry.RichShield.getBlocks = function() {
    return {
        RichShield_list_digital_basic: {
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
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        RichShield_list_pullup_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_pulldown, '0'],
                        [Lang.Blocks.RichShield_pullup, '255'],
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
                OPERATOR: 0,
            },
            func(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        RichShield_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.RichShield_get_digital,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'RichShield_list_digital_basic',
                    },
                    {
                        type: 'RichShield_list_pullup_setting',
                    },
                ],
                type: 'RichShield_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const opr = script.getNumberValue('OPERATOR');
                //"down = 0" or "up = 2"
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.DIGITAL] = {
                        port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield_get_digital(%1,%2)'] },
        },
        RichShield_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.RichShield_get_digital_toggle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                        type: 'RichShield_list_digital_basic',
                    },
                    {
                        type: 'RichShield_list_pullup_setting',
                    },
                ],
                type: 'RichShield_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const opr = script.getNumberValue('OPERATOR');
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue.GET[Entry.Hasseam.sensorTypes.DIGITAL] = {
                        port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield_get_digital_toggle(%1 %2)'] },
        },
        RichShield_list_analog_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
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
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        RichShield_get_Analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.RichShield_get_Analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                        type: 'RichShield_list_analog_basic',
                    },
                ],
                type: 'RichShield_get_Analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') {
                    port = port.substring(1);
                }

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.ANALOG] = {
                    port,
                    time: new Date().getTime(),
                };

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield.Get_Light_Value(%1, %2)'] },
        },
        RichShield_list_digital_basic: {
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
            func(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        RichShield_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_on, 'on'],
                        [Lang.Blocks.RichShield_toggle_off, 'off'],
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
            func(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        RichShield_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.RichShield_set_digital_toggle,
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
                        type: 'RichShield_list_digital_basic',
                    },
                    {
                        type: 'RichShield_list_digital_toggle',
                    },
                    null,
                ],
                type: 'RichShield_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RichShield_set',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.RichShield.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.RichShield.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.RichShield.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield.Set_Digital_Toggle(%1, %2)'] },
        },
        RichShield_LCD_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_LCD_event' },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
        },
        RichShield_LCD_Control_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0x20', 32],
                        ['0x27', 39],
                        ['0x3f', 63],
                    ],
                    value: 32,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_LCD_Control_init' },
            paramsKeyMap: { lcd_device: 0, address: 1 },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('lcd_device', script);
                const addr_val = script.getNumberValue('address', script);

                const text = [];

                // index number patched by Remoted 2020-11-20
                if (!script.isStart) {
                    if (typeof addr_val === 'string') {
                        for (let i = 0; i < 16; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof addr_val === 'number') {
                        text[0] = 1;
                        text[1] = addr_val / 1;
                    } else {
                        text[0] = addr_val;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    // LCD_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.LCD,
                        data: {
                            text0: text[0],
                            text1: text[1],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_LCD_init(%1, %2)'] },
        },
        RichShield_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_lcd_first_line, '0'],
                        [Lang.Blocks.RichShield_lcd_seconds_line, '1'],
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
            func(sprite, script) {
                return script.getField('LINE');
            },
        },
        RichShield_LCD_Control_Display: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.RichShield_LCD_Control_Display,
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
                        type: 'RichShield_list_digital_lcd',
                    },
                    {
                        type: 'text',
                        params: ['Gorilla-Cell!!'],
                    },
                    null,
                ],
                type: 'RichShield_LCD_Control_Display',
            },
            paramsKeyMap: {
                LINE: 0,
                STRING: 1,
            },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const line = script.getNumberValue('LINE');
                const string = script.getValue('STRING');
                const text = [];

                // index number patched by Remoted 2020-11-20
                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (let i = 0; i < 16; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue.SET[line] = {
                        type: Entry.RichShield.sensorTypes.LCD,
                        data: {
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

                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield.LCD_Display(%1, %2)'] },
        },
        RichShield_FND_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_FND_event' },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
        },
        RichShield_FND_Control_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['5', 5]],
                    value: 5,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['4', 4]],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_init' },
            paramsKeyMap: { fnd_device: 0, CLK: 1, DIO: 2 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('fnd_device', script);
                const clk_val = script.getNumberValue('CLK', script);
                const dio_val = script.getNumberValue('DIO', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // FND_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.FND,
                    data: {
                        clk_pin: clk_val,
                        dio_pin: dio_val,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_FND_init(%1, %2)'] },
        },
        RichShield_FND_Control_diplay_brightness: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5],
                        ['6', 6],
                        ['7', 7],
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_diplay_brightness' },
            paramsKeyMap: { fnd_device: 0, level: 1 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('fnd_device', script);
                const level_val = script.getNumberValue('level', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // FND_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.FND,
                    data: {
                        level_val,
                        block_index: 1,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_FND_Control_diplay_brightness(%1, %2)'] },
        },
        RichShield_FND_Control_display_onoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_off, 0],
                        [Lang.Blocks.RichShield_toggle_on, 1],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_display_onoff' },
            paramsKeyMap: { fnd_device: 0, onoff: 1 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('fnd_device', script);
                const onoff = script.getNumberValue('onoff', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // FND_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.FND,
                    data: {
                        onoff,
                        block_index: 2,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_FND_Control_display_onoff(%1, %2)'] },
        },
        RichShield_FND_Control_diplay_char: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    value: 2020,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_off, 0],
                        [Lang.Blocks.RichShield_toggle_on, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    value: 0.1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: { params: [], type: 'RichShield_FND_Control_diplay_char' },
            events: {},
            paramsKeyMap: { fnd_device: 0, display_value: 1, onoff: 2, delay_ms: 3 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('fnd_device', script);
                const display_str = script.getNumberValue('display_value', script);
                const onoff = script.getNumberValue('onoff', script);
                const delay_ms_sec = script.getNumberValue('delay_ms', script);
                const splited_array = [];
                let display_str_converted = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                display_str_converted = display_str.toString();

                for (let i = 0; i < display_str_converted.length; i++) {
                    splited_array.push(parseInt(display_str_converted.charAt(i)));
                }

                // FND_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.FND,
                    data: {
                        display_str,
                        onoff,
                        block_index: 3,
                        str_length: display_str_converted.length,
                        data_0: splited_array[0],
                        data_1: splited_array[1],
                        data_2: splited_array[2],
                        data_3: splited_array[3],
                        delay_ms: delay_ms_sec,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_FND_Control_diplay_char(%1, %2, %3, %4)'] },
        },
        RichShield_DHT_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_DHT_event' },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
        },
        RichShield_DHT_Control_Init_Process: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['12', 12]],
                    value: 12,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['DHT11', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_DHT_Control_Init_Process' },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            paramsKeyMap: { dht_device: 0, pin: 1, ver: 2 },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('dht_device', script);
                const dht_val = script.getNumberValue('pin', script);
                const ver_val = script.getNumberValue('ver', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // DHT_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.DHT,
                    data: {
                        dht_pin: dht_val,
                        ver_info: ver_val,
                        dht_block_index: 0,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_DHT_Control_Init_Process(%1, %2, %3)'] },
        },
        RichShield_DHT_Control_Read_Temper: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['C', 1],
                        ['F', 2],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_DHT_Control_Read_Temper' },
            paramsKeyMap: { dht_device: 0, tempMode: 1 },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                // type이 Block의 경우에는 Field가 아닌 Value로 취급해서 가져 옵니다.
                // 일반적으로는 getValue로 값을 가져오고
                // 명시적으로 숫자형으로 가져오고 싶을때에는 getNumberValue를 사용합니다.
                const device = script.getNumberValue('dht_device', script);
                const tempType = script.getNumberValue('tempMode', script);
                const port = 12;
                const opr = 2;
                //"down = 0" or "up = 2"

                const DIGITAL = Entry.hw.portData.DIGITAL;

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }

                // DHT Temp-Reader type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.DHT,
                    data: {
                        tempMode: tempType,
                        dht_block_index: 1,
                    },
                    time: new Date().getTime(),
                };

                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.DIGITAL] = {
                    port,
                    data: opr,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[12] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield_DHT_Control_Read_Temper(%1, %2)'] },
        },
    };
};
module.exports = Entry.RichShield;
