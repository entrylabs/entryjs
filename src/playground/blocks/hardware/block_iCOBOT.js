'use strict';

Entry.iCOBOT = {
    id: '50.2',
    name: 'iCOBOT',
    url: 'https://aicontrol.ai/',
    imageName: 'iCOBOT.png',
    title:
    {
        ko: '아이코봇',
        en: 'iCOBOT',
    },

    setZero: function() 
    {
        if (!Entry.hw.sendQueue.SET) 
        {
            Entry.hw.sendQueue = 
            {
                GET: {},
                SET: {},
            };    
        } 
		else 
		{ 
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) 
            {             
                if(Entry.hw.sendQueue.SET[key].type === 2)
                {
                    Entry.hw.sendQueue.SET[key].data = 
                    {
                        mode: 0,
                        value: 0,
                    };  
                }
                else if(Entry.hw.sendQueue.SET[key].type === 4)
                {
                    Entry.hw.sendQueue.SET[key].data = {
                        n: 0,
                        r: 0,
                        g: 0,
                        b: 0,
                    };

                }
                else Entry.hw.sendQueue.SET[key].data = 0;                                                                  
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });                                 
        } 
        Entry.hw.update();    
    },
	
    sensorTypes: {
        ALIVE: 0,
        SENSOR: 1,
        MOTOR: 2,
        BUZZER: 3,
        RGBLED: 4,
        TONE: 5,
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
};

Entry.iCOBOT.blockMenuBlocks = [
    'icobot_sensor_input_title',
    'icobot_get_cds_value',
    'icobot_get_sound_value',
    'icobot_get_distsensor_value',
    'icobot_get_analog_temp_value',
    'icobot_get_discomfort_index_value',
    'icobot_buzzer_title',
    'icobot_buzzer_onoff',		
    'icobot_set_digital_buzzer_notime',		
    'icobot_set_digital_buzzer',
    'icobot_led_title',
    'icobot_digital_rgbled_off',    
    'icobot_digital_rgbled_onoff',      
    'icobot_digital_set_rgbled_value',
    'icobot_motor_title',
    'icobot_digital_motor_stop',	
    'icobot_digital_set_motor_speed',
    'icobot_digital_set_motor_direction',
    'icobot_digital_set_motor_angle',
    'icobot_digital_wait_motor_angle',
];

Entry.iCOBOT.setLanguage = function() {
    return {
        ko: {
            template: {
				icobot_sensor_input_title: "▶ 아이코봇 센서 입력 값",
				icobot_get_cds_value: "조도(밝기) 센서 값",
				icobot_get_sound_value: "사운드(소리)감지 센서 값",
				icobot_get_distsensor_value: "거리(IR) %1 센서 값",
				icobot_get_analog_temp_value: "%1 센서 값",
				icobot_get_discomfort_index_value: "불쾌 지수 값",
				icobot_buzzer_title: "▶ 아이코봇 부저 출력",
				icobot_buzzer_onoff: "부저 %1 %2",
                icobot_set_digital_buzzer: "부저를 %1 옥타브 %2 음 %3 초 연주 %4",
                icobot_set_digital_buzzer_notime: "부저를 %1 옥타브 %2 음 연주 %3",
				icobot_led_title: "▶ 아이코봇 RGB LED 출력",
                icobot_digital_rgbled_onoff: "%1 RGB LED %2 색 켜기 %3",
				icobot_digital_rgbled_off: "%1 RGB LED 끄기 %2",
                icobot_digital_set_rgbled_value: "%1 RGB LED 빨강 %2 초록 %3 파랑 %4 으로 켜기 %5",
				icobot_motor_title: "▶ 아이코봇 모터 출력",
				icobot_digital_set_motor_direction: "%1 모터 방향을 %2 방향으로 정하기 %3",
				icobot_digital_set_motor_angle: "%1 방향으로 %2 도 회전하기 %3",
				icobot_digital_set_motor_speed: "%1 모터의 속도를 %2 로 정하기 %3",
				icobot_digital_motor_stop: "%1 모터 정지하기 %2",
                icobot_digital_wait_motor_angle: "회전이 끝날때까지 기다리기"
            },
            Helper: {
				icobot_get_cds_value: "현재 조도(밝기) 값을 읽어 옵니다.",
				icobot_get_sound_value: "현재 주변의 사운드(소리)감지하여 읽어 옵니다.\n 값이 순간적으로 변화합니다.",
				icobot_get_distsensor_value: "선택한 거리(IR)센서의 값을 읽어 옵니다.\n 값이 클 수록 물체와의 거리가 가까움을 나타내거나, 흰색을 감지하고 있음을 나타냅니다.",
				icobot_get_analog_temp_value: "현재 온도/습도 값을 읽어 옵니다.",
				icobot_get_discomfort_index_value: "현재의 온도와 상대습도 값을 이용하여 불쾌 지수 값을 계산합니다.\n\n 불쾌지수 = ((9/5)T)-(0.55(1-RH)((9/5)T-26))+32 \n\n T : 온도,  RH : 상대습도",
				icobot_buzzer_onoff: "부저를 울리거나, 끌수있습니다.",
                icobot_set_digital_buzzer: "선택한 계이름과 옥타브의 음을 입력한 시간만큼 소리 냅니다.",
                icobot_set_digital_buzzer_notime: "선택한 계이름과 옥타브의 음을 계속 소리 냅니다.",
                icobot_digital_rgbled_onoff: "LED를 선택한 색깔로 켭니다.",
				icobot_digital_rgbled_off: "LED를 끕니다.",
                icobot_digital_set_rgbled_value: "LED의 R, G, B 값을 입력한 값으로 각각 설정하여 켭니다.",
				icobot_digital_set_motor_direction: "선택한 모터의 구동 방향을 정하고, 그 방향으로 이동합니다.",
				icobot_digital_set_motor_angle: "원하는 각도만큼 i-COBOT이 움직입니다.",
				icobot_digital_set_motor_speed: "선택한 모터의 속도를 정하고, 그 속도로 구동됩니다.",
				icobot_digital_motor_stop: "선택한 모터가 정지합니다.",
                icobot_digital_wait_motor_angle: "회전이 끝날때까지 실행을 멈추고 기다립니다."
            },
            Blocks: {
                icobot_Sound: "소리감지",
                icobot_Brightness: "밝기(조도)",
                monitor_ir_front: "정면 거리",
                monitor_ir_left: "왼쪽 거리",
                monitor_ir_right: "오른쪽 거리",
                monitor_ir_bottom_mid: "아래중앙 거리",
                monitor_ir_bottom_left: "아래왼쪽 거리",
                monitor_ir_bottom_right: "아래오른쪽 거리",
                icobot_Temperature: "온도(°C)",
                icobot_Humidity: "습도(%)",
                icobot_ir_front: "정면",
                icobot_ir_left: "왼쪽",
                icobot_ir_right: "오른쪽",
                icobot_ir_bottom_mid: "아래중앙",
                icobot_ir_bottom_left: "아래왼쪽",
                icobot_ir_bottom_right: "아래오른쪽",
                icobot_buzzer_on: "켜기",
                icobot_buzzer_off: "끄기",
                icobot_buzzer_silent: "무음",
                icobot_buzzer_do: "도",
                icobot_buzzer_do_sharp: "도＃(레♭)",
                icobot_buzzer_re: "레",
                icobot_buzzer_re_sharp: "레＃(미♭)",
                icobot_buzzer_mi: "미",
                icobot_buzzer_fa: "파",
                icobot_buzzer_fa_sharp: "파＃(솔♭)",
                icobot_buzzer_sol: "솔",
                icobot_buzzer_sol_sharp: "솔＃(라♭)",
                icobot_buzzer_la: "라",
                icobot_buzzer_la_sharp: "라＃(시♭)",
                icobot_buzzer_si: "시",
                icobot_led_total: "모든",
                icobot_led_left_up: "왼쪽 위",
                icobot_led_left_down: "왼쪽 아래",
                icobot_led_right_up: "오른쪽 위",
                icobot_led_right_down: "오른쪽 아래",
                icobot_color_white: "흰",
                icobot_color_red: "빨간",
                icobot_color_orange: "주황",
                icobot_color_yellow: "노란",
                icobot_color_green: "초록",
                icobot_color_blue: "파란",
                icobot_color_sky_blue: "하늘",
                icobot_color_purple: "보라",
                icobot_motor_both_wheels: "양쪽",
                icobot_motor_left_wheels: "왼쪽",
                icobot_motor_right_wheels: "오른쪽",
                icobot_motor_front_move: "전진",
                icobot_motor_back_move: "후진",
                icobot_motor_left_turn: "왼쪽",
                icobot_motor_right_turn: "오른쪽",
                icobot_motor_30_degrees: "30°",
                icobot_motor_45_degrees: "45°",
                icobot_motor_60_degrees: "60°",
                icobot_motor_90_degrees: "90°",
                icobot_motor_120_degrees: "120°",
                icobot_motor_135_degrees: "135°",
                icobot_motor_150_degrees: "150°",
                icobot_motor_180_degrees: "180°",
                icobot_motor_210_degrees: "210°",
                icobot_motor_225_degrees: "225°",
                icobot_motor_240_degrees: "240°",
                icobot_motor_270_degrees: "270°",
                icobot_motor_300_degrees: "300°",
                icobot_motor_315_degrees: "315°",
                icobot_motor_330_degrees: "330°",
                icobot_motor_360_degrees: "360°",
            }
        },
        en: {
            template: {
				icobot_sensor_input_title: "▶ i-COBOT Input Sensor Value",
				icobot_get_cds_value: "CDS(Brightness) Sensor Value",
				icobot_get_sound_value: "Sound Sensor Value",
				icobot_get_distsensor_value: "Distance(IR) %1 Sensor Value",
				icobot_get_analog_temp_value: "%1 Sensor Value",
				icobot_get_discomfort_index_value: "Discomfort Index Value",
				icobot_buzzer_title: "▶ i-COBOT Buzzer Output",
				icobot_buzzer_onoff: "Buzzer %1 %2",
                icobot_set_digital_buzzer: "Play %1 Octave %2 for %3 Sec with Buzzer %4",
                icobot_set_digital_buzzer_notime: "Play %1 Octave %2 with Buzzer %3",
				icobot_led_title: "▶ i-COBOT RGB LED Output",
                icobot_digital_rgbled_onoff: "Turn On %1 RGB LED as %2 Color %3",
				icobot_digital_rgbled_off: "Turn Off %1 RGB LED %2",
                icobot_digital_set_rgbled_value: "Set the %1 RGB LED value to RED %2 GREEN %3 BLUE %4 %5",
				icobot_motor_title: "▶ i-COBOT Motor Output",
				icobot_digital_set_motor_direction: "Set %1 Motor Direction to %2 %3",
				icobot_digital_set_motor_angle: "Rotate %1 by %2 degrees %3",
				icobot_digital_set_motor_speed: "Set %1 Motor Speed to %2 %3",
				icobot_digital_motor_stop: "Stop %1 Motor %2",
                icobot_digital_wait_motor_angle: "Wait until the finish Rotation"
            },
            Helper: {
				icobot_get_cds_value: "i-COBOT reads the current value of CDS photocell.\n\n A CDS photocell(or Light Dependant Resistor / LDR) is a resistor that changes the resistance based on the amount of light.",
				icobot_get_sound_value: "Senses the surrounding sound.\n The value changes minute by minute.",
				icobot_get_distsensor_value: "Reads the value of selected IR sensor.\n A larger value indicates that the distance from the object is close, or that it is detecting a white color.",
				icobot_get_analog_temp_value: "Reads the value of current temperature or humidity.",
				icobot_get_discomfort_index_value: "Calculate the Temperature-Humidity Index(THI) using the current temperature and relative humidity values.\n\n THI = ((9/5)T)-(0.55(1-RH)((9/5)T-26))+32 \n\n T : Temperature,  RH : Relative Humidity",
				icobot_buzzer_onoff: "You can turn on/off the buzzer.",
                icobot_set_digital_buzzer: "Let i-COBOT play the pitch you entered for the seconds you entered.",
                icobot_set_digital_buzzer_notime: "Let i-COBOT keep playing the pitch you entered.",
                icobot_digital_rgbled_onoff: "Turn the LED on as the selected color.",
				icobot_digital_rgbled_off: "Turns off the LED.",
                icobot_digital_set_rgbled_value: "Set the R, G, and B values of the LED to the entered values and turn them on.",
				icobot_digital_set_motor_direction: "Determine the driving path of the motor.",
				icobot_digital_set_motor_angle: "Let i-COBOT rotate as much as you want.",
				icobot_digital_set_motor_speed: "Determine the speed of the motor.",
				icobot_digital_motor_stop: "The selected motor stops.",
                icobot_digital_wait_motor_angle: "Stop running and wait until the finish Rotation"
            },
            Blocks: {
                icobot_Sound: "Noise",
                icobot_Brightness: "Brightness(CDS)",
                monitor_ir_front: "Front Dist.",
                monitor_ir_left: "Left Dist.",
                monitor_ir_right: "Right Dist.",
                monitor_ir_bottom_mid: "Bottom_Mid Dist.",
                monitor_ir_bottom_left: "Bottom_Left Dist.",
                monitor_ir_bottom_right: "Bottom_Right Dist.",
                icobot_Temperature: "Temperature(°C)",
                icobot_Humidity: "Humidity(%)",
                icobot_ir_front: "Front",
                icobot_ir_left: "Left",
                icobot_ir_right: "Right",
                icobot_ir_bottom_mid: "Bottom_Mid",
                icobot_ir_bottom_left: "Bottom_Left",
                icobot_ir_bottom_right: "Bottom_Right",
                icobot_buzzer_on: "On",
                icobot_buzzer_off: "Off",
                icobot_buzzer_silent: "NoTone",
                icobot_buzzer_do: "C",
                icobot_buzzer_do_sharp: "C＃(D♭)",
                icobot_buzzer_re: "D",
                icobot_buzzer_re_sharp: "D＃(E♭)",
                icobot_buzzer_mi: "E",
                icobot_buzzer_fa: "F",
                icobot_buzzer_fa_sharp: "F＃(G♭)",
                icobot_buzzer_sol: "G",
                icobot_buzzer_sol_sharp: "G＃(A♭)",
                icobot_buzzer_la: "A",
                icobot_buzzer_la_sharp: "A＃(B♭)",
                icobot_buzzer_si: "B",
                icobot_led_total: "All",
                icobot_led_left_up: "Left Top",
                icobot_led_left_down: "Left Bottom",
                icobot_led_right_up: "Right Top",
                icobot_led_right_down: "Right Bottom",
                icobot_color_white: "White",
                icobot_color_red: "Red",
                icobot_color_orange: "Orange",
                icobot_color_yellow: "Yellow",
                icobot_color_green: "Green",
                icobot_color_blue: "Blue",
                icobot_color_sky_blue: "Sky Blue",
                icobot_color_purple: "Purple",
                icobot_motor_both_wheels: "Both",
                icobot_motor_left_wheels: "Left",
                icobot_motor_right_wheels: "Right",
                icobot_motor_front_move: "Front",
                icobot_motor_back_move: "Back",
                icobot_motor_left_turn: "Left",
                icobot_motor_right_turn: "Right",
                icobot_motor_30_degrees: "30°",
                icobot_motor_45_degrees: "45°",
                icobot_motor_60_degrees: "60°",
                icobot_motor_90_degrees: "90°",
                icobot_motor_120_degrees: "120°",
                icobot_motor_135_degrees: "135°",
                icobot_motor_150_degrees: "150°",
                icobot_motor_180_degrees: "180°",
                icobot_motor_210_degrees: "210°",
                icobot_motor_225_degrees: "225°",
                icobot_motor_240_degrees: "240°",
                icobot_motor_270_degrees: "270°",
                icobot_motor_300_degrees: "300°",
                icobot_motor_315_degrees: "315°",
                icobot_motor_330_degrees: "330°",
                icobot_motor_360_degrees: "360°",
            }
        }
    }
};

Entry.iCOBOT.monitorTemplate = function() {

    return {
        imgPath: 'hw/iCOBOT_Front.png',
        width: 550,
        height: 600,
        listPorts: {
            BLeft_IR: {
                name: Lang.Blocks.monitor_ir_bottom_left,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            BMid_IR: {
                name: Lang.Blocks.monitor_ir_bottom_mid,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            BRight_IR: {
                name: Lang.Blocks.monitor_ir_bottom_right,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            Real_T: {
                name: Lang.Blocks.icobot_Temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            Real_H: {
                name: Lang.Blocks.icobot_Humidity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            Sound: {
                name: Lang.Blocks.icobot_Sound,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            Brightness: {
                name: Lang.Blocks.icobot_Brightness,
                type: 'input',
                pos: { x: 295, y: 350 },
            },
            Front_IR: {
                name: Lang.Blocks.monitor_ir_front,
                type: 'input',
                pos: { x: 250, y: 300 },
            },
            Left_IR: {
                name: Lang.Blocks.monitor_ir_left,
                type: 'input',
                pos: { x: 20, y: 450 },
            },
            Right_IR: {
                name: Lang.Blocks.monitor_ir_right,
                type: 'input',
                pos: { x: 525, y: 450 },
            },
        },
        mode: 'both',
    };
};

Entry.iCOBOT.getBlocks = function() {
    return {
        //1. 센서 입력			
        icobot_sensor_input_title: {
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#191970',
            skeleton: 'basic_text',
            skeletonOptions: {
                contentPos: {
                    x: 5,
                },
            },
            params: [
                {
                    type: 'Text',
                    text: Lang.template.icobot_sensor_input_title,
                    color: '#191970',
                    align: 'left',
                },
            ],
            def: {
                type: 'icobot_sensor_input_title',
            },
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            events: {},
        },
		
		// 조도(밝기) - 센서 값 				
        icobot_get_cds_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_cds_value,
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'icobot_get_cds_value',
            },
            paramsKeyMap: {},
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = 0;
                var CDS = Entry.hw.portData.SENSOR;

                return CDS[port];
            },
            syntax: { js: [], py: [] },
        },
		
		// 소리(소음) - 센서 값 				
        icobot_get_sound_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_sound_value,
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
                type: 'icobot_get_sound_value',
            },
            paramsKeyMap: {},
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = 4;
                var SOUND = Entry.hw.portData.SENSOR;
                return SOUND[port];
            },
            syntax: { js: [], py: [] },
        },
				
        icobot_get_analog_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
            fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_Temperature, '8'],
                        [Lang.Blocks.icobot_Humidity, '9'],
                    ],
                    value: '8',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_get_analog_temp_value',
            },
            paramsKeyMap: {
               PORT: 0,
            },
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
            {
                var port = script.getValue('PORT', script);
                var temp = Entry.hw.portData.SENSOR;

                return temp[port];
            },
            syntax: { js: [], py: [] },
        },
		
		// 불쾌지수				
        icobot_get_discomfort_index_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_discomfort_index_value,
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'icobot_get_discomfort_index_value',
            },
            paramsKeyMap: {},
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var temp = Entry.hw.portData.SENSOR;
                var Temperature = temp[8];
                var Humidity = (temp[9])/100;
                var Discomfort_index = (((9/5)*Temperature) - (0.55*(1-Humidity)*(((9/5)*Temperature)-26)) + 32);
                return Discomfort_index;
            },
            syntax: { js: [], py: [] },
        },
		
        icobot_get_distsensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_ir_front, '2'],
                        [Lang.Blocks.icobot_ir_left, '7'],
                        [Lang.Blocks.icobot_ir_right, '5'],
                        [Lang.Blocks.icobot_ir_bottom_left, '1'],
                        [Lang.Blocks.icobot_ir_bottom_mid, '6'],
                        [Lang.Blocks.icobot_ir_bottom_right, '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_get_distsensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = script.getValue('PORT', script);	
                var IR = Entry.hw.portData.SENSOR;
                return IR[port];
            },
            syntax: { js: [], py: [] },
        },

        //2. 부저 관련	
        icobot_buzzer_title: {
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#191970',
            skeleton: 'basic_text',
            skeletonOptions: {
                contentPos: {
                    x: 5,
                },
            },
            params: [
                {
                    type: 'Text',
                    text: Lang.template.icobot_buzzer_title,
                    color: '#191970',
                    align: 'left',
                },
            ],
            def: {
                type: 'icobot_buzzer_title',
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            events: {},
        },

        icobot_buzzer_onoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_buzzer_on, '1'],
                        [Lang.Blocks.icobot_buzzer_off, '0'],
                    ],					
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
				var port = 6;
                var mode = script.getNumberValue('VALUE');		
				
                if (!Entry.hw.sendQueue['SET']) {
                Entry.hw.sendQueue['SET'] = {};
                }
				
                Entry.hw.sendQueue['SET'][port] = {
                type: Entry.iCOBOT.sensorTypes.BUZZER,
                data: mode,
                time: new Date().getTime(),
                };				
            },
            syntax: { js: [], py: [] },
        },
		
		// 부저 - 부저 옥타브/음/초 동안 연주
        icobot_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.icobot_set_digital_buzzer,
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
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_buzzer_silent, '0'],
                        [Lang.Blocks.icobot_buzzer_do, 'C'],
                        [Lang.Blocks.icobot_buzzer_do_sharp, 'CS'],
                        [Lang.Blocks.icobot_buzzer_re, 'D'],
                        [Lang.Blocks.icobot_buzzer_re_sharp, 'DS'],
                        [Lang.Blocks.icobot_buzzer_mi, 'E'],
                        [Lang.Blocks.icobot_buzzer_fa, 'F'],
                        [Lang.Blocks.icobot_buzzer_fa_sharp, 'FS'],
                        [Lang.Blocks.icobot_buzzer_sol, 'G'],
                        [Lang.Blocks.icobot_buzzer_sol_sharp, 'GS'],
                        [Lang.Blocks.icobot_buzzer_la, 'A'],
                        [Lang.Blocks.icobot_buzzer_la_sharp, 'AS'],
                        [Lang.Blocks.icobot_buzzer_si, 'B'],
                    ],
                    value: 'C',
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
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'number',
						params: ["1"],
                    },
                    null,
                ],
                type: 'icobot_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) {
                var port = 6;
                var octave = script.getNumberValue('OCTAVE') - 1;
                var duration = script.getNumberValue('DURATION', script);
                var value = 0;

                if (!script.isStart) 
				{
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) 
					{
                        note = Entry.iCOBOT.toneTable[note];
                    }
                    if (note < 0) note = 0;
                    else if (note > 12) note = 12;

                    if (duration < 0) duration = 0;
					
                    if (!Entry.hw.sendQueue['SET']) 
					{
                        Entry.hw.sendQueue['SET'] = {};
                    }
					
                    if (duration == 0) 
					{
                        Entry.hw.sendQueue['SET'][port] = 
						{
                            type: Entry.iCOBOT.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
					
                    if (octave < 0) octave = 0;
                    else if (octave > 8) octave = 8;
                    if (note != 0) value = Entry.iCOBOT.toneMap[note][octave];

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.iCOBOT.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),  //millis()여서 duration에 1000를 곱함
                    };

                    setTimeout(function() 
					{
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } 
				else if (script.timeFlag == 1) 
				{
                    return script;
                } 
				else 
				{
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.iCOBOT.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
		// 부저 - 부저 옥타브/음/초 동안 연주
        icobot_set_digital_buzzer_notime: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.icobot_set_digital_buzzer_notime,
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
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_buzzer_silent, '0'],
                        [Lang.Blocks.icobot_buzzer_do, 'C'],
                        [Lang.Blocks.icobot_buzzer_do_sharp, 'CS'],
                        [Lang.Blocks.icobot_buzzer_re, 'D'],
                        [Lang.Blocks.icobot_buzzer_re_sharp, 'DS'],
                        [Lang.Blocks.icobot_buzzer_mi, 'E'],
                        [Lang.Blocks.icobot_buzzer_fa, 'F'],
                        [Lang.Blocks.icobot_buzzer_fa_sharp, 'FS'],
                        [Lang.Blocks.icobot_buzzer_sol, 'G'],
                        [Lang.Blocks.icobot_buzzer_sol_sharp, 'GS'],
                        [Lang.Blocks.icobot_buzzer_la, 'A'],
                        [Lang.Blocks.icobot_buzzer_la_sharp, 'AS'],
                        [Lang.Blocks.icobot_buzzer_si, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_set_digital_buzzer_notime',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) {
                var port = 6;
                var octave = script.getNumberValue('OCTAVE') - 1;
                var duration = 7;
                var value = 0;

                var note = script.getValue('NOTE');
                if (!Entry.Utils.isNumber(note)) 
                {
                    note = Entry.iCOBOT.toneTable[note];
                }
                if (note < 0) note = 0;
                else if (note > 12) note = 12;
                
                if (!Entry.hw.sendQueue['SET']) 
                {
                    Entry.hw.sendQueue['SET'] = {};
                }
                
                if (octave < 0) octave = 0;
                else if (octave > 8) octave = 8;
                if (note != 0) value = Entry.iCOBOT.toneMap[note][octave];

                Entry.hw.sendQueue['SET'][port] = 
                {
                    type: Entry.iCOBOT.sensorTypes.TONE,
                    data: 
                    {
                        value: value,
                        duration: duration,
                    },
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [], py: [] },
        },

        //3. LED 관련
        icobot_led_title: {
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#191970',
            skeleton: 'basic_text',
            skeletonOptions: {
                contentPos: {
                    x: 5,
                },
            },
            params: [
                {
                    type: 'Text',
                    text: Lang.template.icobot_led_title,
                    color: '#191970',
                    align: 'left',
                },
            ],
            def: {
                type: 'icobot_led_title',
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            events: {},
        },
        
        icobot_rgb_list: {
             color: EntryStatic.colorSet.block.default.HARDWARE,
             outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
             fontColor: '#fff',			
             skeleton: 'basic_string_field',
             statements: [],
             template: '%1',
             params: [
                 {
                     type: 'Dropdown',
                     options: [
                         [Lang.Blocks.icobot_led_total, '0'],
                         [Lang.Blocks.icobot_led_left_up, '1'],
                         [Lang.Blocks.icobot_led_right_up, '2'],
                         [Lang.Blocks.icobot_led_left_down, '3'],
                         [Lang.Blocks.icobot_led_right_down, '4'],				
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
		
		// RGBLED - 종류 선택 및 On/Off
		icobot_digital_rgbled_onoff: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    // type: 'Dropdown',
                    // options: [
                    //     [Lang.Blocks.icobot_led_total, '0'],
                    //     [Lang.Blocks.icobot_led_left_up, '1'],
                    //     [Lang.Blocks.icobot_led_right_up, '2'],
                    //     [Lang.Blocks.icobot_led_left_down, '3'],
                    //     [Lang.Blocks.icobot_led_right_down, '4'],
                    // ],
                    // value: '0',
                    // fontSize: 11,
                    // bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    // arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_color_white, '1'],
                        [Lang.Blocks.icobot_color_red, '2'],
                        [Lang.Blocks.icobot_color_orange, '3'],
                        [Lang.Blocks.icobot_color_yellow, '4'],
                        [Lang.Blocks.icobot_color_green, '5'],
                        [Lang.Blocks.icobot_color_blue, '6'],
                        [Lang.Blocks.icobot_color_sky_blue, '7'],
                        [Lang.Blocks.icobot_color_purple, '8'],						
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'icobot_rgb_list',
                    },
                    null
                ],
                type: 'icobot_digital_rgbled_onoff',
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{	
				var port = 9;
                var num = script.getNumberValue('NUM', script);
                var color = script.getNumberValue('COLOR', script);
                var delay_time = 0;

				var rLED, gLED, bLED;

				switch(color)
				{
					case 0:	rLED = gLED = bLED = 0;			        // Black
								break;
					case 1:	rLED = gLED = bLED = 255;		        // white
								break;
					case 2:	rLED = 255; gLED = bLED = 0;	        // Red
								break;
                    case 3:	rLED = 255; gLED = 50; bLED = 0;         // orange
                                break;
                    case 4:	rLED = gLED = 255; bLED = 0;            // Yellow
                                break;
					case 5:	rLED = bLED = 0; gLED = 255;	        // green
								break;
					case 6:	rLED = gLED = 0; bLED = 255;	        // Blue
								break;
					case 7:	rLED = 0; gLED = bLED = 255;            // sky_blue
								break;
					case 8:	rLED = bLED = 255; gLED = 0;		    // purple
								break;
				}

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.RGBLED,
                        data: {
                            n: num,
                            r: rLED,
                            g: gLED,
                            b: bLED,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script .timeFlag == 1) 
                {
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        
		// RGBLED - Off
		icobot_digital_rgbled_off: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [    
                {
                    type: 'Block',
                    accept: 'string',
                    // type: 'Dropdown',
                    // options: [
                    //     [Lang.Blocks.icobot_led_total, '0'],
                    //     [Lang.Blocks.icobot_led_left_up, '1'],
                    //     [Lang.Blocks.icobot_led_right_up, '2'],
                    //     [Lang.Blocks.icobot_led_left_down, '3'],
                    //     [Lang.Blocks.icobot_led_right_down, '4'],
                    // ],
                    // value: '0',
                    // fontSize: 11,
                    // bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    // arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'icobot_rgb_list',
                    },
                    null
                ],
                type: 'icobot_digital_rgbled_off',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{	
				var port = 9;
                var num = script.getNumberValue('NUM', script);
				var rLED = 0, gLED = 0, bLED = 0;
                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.RGBLED,
                        data: {
                            n: num,
                            r: rLED,
                            g: gLED,
                            b: bLED,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script .timeFlag == 1) 
                {
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },        

		// RGBLED - RGB 값으로 켜기
		icobot_digital_set_rgbled_value: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    // type: 'Dropdown',
                    // options: [
                    //     [Lang.Blocks.icobot_led_total, '0'],
                    //     [Lang.Blocks.icobot_led_left_up, '1'],
                    //     [Lang.Blocks.icobot_led_right_up, '2'],
                    //     [Lang.Blocks.icobot_led_left_down, '3'],
                    //     [Lang.Blocks.icobot_led_right_down, '4'],
                    // ],
                    // value: '0',
                    // fontSize: 11,
                    // bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    // arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    img: 'block_icon/hardware_led.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'icobot_rgb_list',
                    },		
                    {
                        type: 'number',
						params: ["0"],
                    },
                    {
                        type: 'number',
						params: ["0"],
                    },				
					{
                        type: 'number',
						params: ["0"],
                    },	
                    null,
                ],
                type: 'icobot_digital_set_rgbled_value',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE0:1,
                VALUE1:2,
				VALUE2:3,
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = 9;      
                var num = script.getNumberValue('NUM', script);
                var rLED = script.getNumberValue('VALUE0', script);
                var gLED = script.getNumberValue('VALUE1', script);
                var bLED = script.getNumberValue('VALUE2', script);
                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.RGBLED,
                        data: {
                            n: num,
                            r: rLED,
                            g: gLED,
                            b: bLED,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script .timeFlag == 1) 
                {
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },      

        //4. 모터 관련
        icobot_motor_title: {
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#191970',
            skeleton: 'basic_text',
            skeletonOptions: {
                contentPos: {
                    x: 5,
                },
            },
            params: [
                {
                    type: 'Text',
                    text: Lang.template.icobot_motor_title,
                    color: '#191970',
                    align: 'left',
                },
            ],
            def: {
                type: 'icobot_motor_title',
            },
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            events: {},
        },

		// 모터 - 방향 바꾸기		
		icobot_digital_set_motor_direction: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_both_wheels, '2'],	
                        [Lang.Blocks.icobot_motor_left_wheels, '1'],
                        [Lang.Blocks.icobot_motor_right_wheels, '3'],						
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_front_move, '0'],
                        [Lang.Blocks.icobot_motor_back_move, '1'],		
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },			
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_digital_set_motor_direction',
            },
            paramsKeyMap: {
                PORT: 0,
				DIR: 1,
			},
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var dir = script.getNumberValue('DIR', script);
				var mode = 1;
                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.MOTOR,
                        data: {
                            mode: mode,
                            value: dir,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script.timeFlag <= 1) 
                {
                    script.timeFlag += 1;
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },

		// 모터 - 회전하기		
		icobot_digital_set_motor_angle: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_left_turn, '3'],
                        [Lang.Blocks.icobot_motor_right_turn, '1'],						
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_30_degrees, '0'],
                        [Lang.Blocks.icobot_motor_45_degrees, '1'],
                        [Lang.Blocks.icobot_motor_60_degrees, '2'],
                        [Lang.Blocks.icobot_motor_90_degrees, '3'],
                        [Lang.Blocks.icobot_motor_120_degrees, '4'],
                        [Lang.Blocks.icobot_motor_135_degrees, '5'],
                        [Lang.Blocks.icobot_motor_150_degrees, '6'],
                        [Lang.Blocks.icobot_motor_180_degrees, '7'],
                        [Lang.Blocks.icobot_motor_210_degrees, '8'],
                        [Lang.Blocks.icobot_motor_225_degrees, '9'],
                        [Lang.Blocks.icobot_motor_240_degrees, '10'],
                        [Lang.Blocks.icobot_motor_270_degrees, '11'],
                        [Lang.Blocks.icobot_motor_300_degrees, '12'],
                        [Lang.Blocks.icobot_motor_315_degrees, '13'],
                        [Lang.Blocks.icobot_motor_330_degrees, '14'],
                        [Lang.Blocks.icobot_motor_360_degrees, '15'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },		
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_digital_set_motor_angle',
            },
            paramsKeyMap: {
                PORT: 0,
				DIR: 1,
			},
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var dir = script.getNumberValue('DIR', script);
				var mode = 4;
                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.MOTOR,
                        data: {
                            mode: mode,
                            value: dir,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
		// 모터 - 모터 속도 정하기		
		icobot_digital_set_motor_speed: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_both_wheels, '2'],	
                        [Lang.Blocks.icobot_motor_left_wheels, '1'],
                        [Lang.Blocks.icobot_motor_right_wheels, '3'],						
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },				
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
						params: ["0"],
                    },				
                    null,
                ],
                type: 'icobot_digital_set_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
				SPEED: 1,
            },
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
				var mode = 2;
						
                speed = Math.min(1000, speed);
                speed = Math.max(0, speed);	

                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true; 
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.MOTOR,
                        data: {
                            mode: mode,
                            value: speed,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script.timeFlag <= 1) 
                {
                    script.timeFlag += 1;
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
		// 모터 - 모터 정지하기		
		icobot_digital_motor_stop: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.icobot_motor_both_wheels, '2'],	
                        [Lang.Blocks.icobot_motor_left_wheels, '1'],
                        [Lang.Blocks.icobot_motor_right_wheels, '3'],						
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_digital_motor_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
				var mode = 3;
				var speed = 0;
                var delay_time = 0;

                if (!script.isStart)
                {
									
                    if (!Entry.hw.sendQueue['SET']) 
                    {
                        Entry.hw.sendQueue['SET'] = {};
                    }                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.iCOBOT.sensorTypes.MOTOR,
                        data: {
                            mode: mode,
                            value: speed,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout (function ()
                    {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                }
                else if (script.timeFlag == 1) 
                {
                    return script;
                }
                else
                {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },

        
        icobot_digital_wait_motor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'icobot_digital_wait_motor_angle',
            },
            paramsKeyMap: {
                // BOOL: 0,
            },
            class: 'iCOBOT_DC',
            isNotFor: [],
            func(sprite, script) {
                var port = 10;
                var Bool_Motor = Entry.hw.portData.SENSOR;
                var Result = Bool_Motor[port];
                if (Result) {
                    return script.callReturn();
                } else {
                    return script;
                }
            },
            syntax: { js: [], py: [] },
        },
    };
};

module.exports = Entry.iCOBOT;
