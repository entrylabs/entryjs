'use strict';

Entry.avatarbot = {
    id: ['64.1'], // 엔트리에서 발급받은 하드웨어 번호를 기술합니다.
    name: 'avatarbot', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://avatarmecha.co.kr', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'avatarbot.png', // images/hardware, images/hw 폴더 내에 존재하는 이미지입니다.
    title: {
        ko: 'AvatarBot',
        // en: 'AvatarBot',
    },
    /*
    setZero() { 
		// 엔트리 정지시 하드웨어 초기화 로직
        Entry.hw.sendQueue.readablePorts = [];
        for (let port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    */
   	sendBuffer: new Array(210).fill(0),
    avatarBotDataSet : 210,
    setZero() { 
		// 엔트리 정지시 하드웨어 초기화 로직
		this.dataTableReset();
    },
    
    dataTableReset() {
		this.sendBuffer.fill(0);
		Entry.hw.sendQueue.CMD = this.sendBuffer;
		
        this.dc_m_index.fill(0);
        this.buzzer_index = 0;
        /*
        Entry.hw.sendQueue.readablePorts = [];
        // data buffer 23*10 table value.
        for (let index = 0; index < 230; index++) {
            Entry.hw.sendQueue[index] = 0;
            Entry.hw.sendQueue.readablePorts.push(index);
        }
        */
        //
        
        var index = Entry.avatarbot.BoardFunType.Info;
		Entry.hw.sendQueue.CMD[index+0] = 0x99;
		Entry.hw.sendQueue.CMD[index+1] = 0x01;
		Entry.hw.sendQueue.CMD[index+2] = 0x01;
		Entry.hw.sendQueue.CMD[index+3] = Entry.avatarbot.avatarBotDataSet;
		
		// pwm. 2~5 pad
		index = Entry.avatarbot.BoardFunType.GPIO_PWM_SET;
		Entry.hw.sendQueue.CMD[index+1] = (Entry.avatarbot.Board_PWM.Freq)&0xff;
		Entry.hw.sendQueue.CMD[index+2] = (Entry.avatarbot.Board_PWM.Freq>>8)&0xff;
		Entry.hw.sendQueue.CMD[index+3] = (Entry.avatarbot.Board_PWM.Freq>>16)&0xff;
		Entry.hw.sendQueue.CMD[index+4] = (Entry.avatarbot.Board_PWM.Resolution)&0xff;
		
		// adc
		index = Entry.avatarbot.BoardFunType.ADC;
		Entry.hw.sendQueue.CMD[index+4] = (Entry.avatarbot.Board_ADC.Attenuation_11db)&0xff;
		Entry.hw.sendQueue.CMD[index+5] = (Entry.avatarbot.Board_ADC.Resolution)&0xff;
		
        // ir receiver 
        index = Entry.avatarbot.BoardFunType.IR_Remote;
        Entry.hw.sendQueue.CMD[index+1] = (Entry.avatarbot.Board_IR_Remote.Value)&0xff;
		
		// pca9568
		index = Entry.avatarbot.BoardFunType.PCA9568;
		Entry.hw.sendQueue.CMD[index+1] = (Entry.avatarbot.Board_PCA9568.Freq)&0xff;
		Entry.hw.sendQueue.CMD[index+2] = (Entry.avatarbot.Board_PCA9568.Freq>>8)&0xff;
		Entry.hw.sendQueue.CMD[index+3] = (Entry.avatarbot.Board_PCA9568.Freq>>16)&0xff;
		Entry.hw.sendQueue.CMD[index+4] = (Entry.avatarbot.Board_PCA9568.Freq>>24)&0xff;
		
		Entry.hw.sendQueue.CMD[index+5] = (Entry.avatarbot.Board_PCA9568.Osci)&0xff;
		Entry.hw.sendQueue.CMD[index+6] = (Entry.avatarbot.Board_PCA9568.Osci>>8)&0xff;
		Entry.hw.sendQueue.CMD[index+7] = (Entry.avatarbot.Board_PCA9568.Osci>>16)&0xff;
		Entry.hw.sendQueue.CMD[index+8] = (Entry.avatarbot.Board_PCA9568.Osci>>24)&0xff;

        this.servo_on.fill(0);
        this.servo_init.fill(0);
        this.servo_speed.fill(3);
		
        // servo moter
		for(var i=0; i<8; i++)
		{
			index = Entry.avatarbot.BoardFunType.Servo_M0 + (i*10);
			Entry.hw.sendQueue.CMD[index+1] = (Entry.avatarbot.Board_Servo.Pulse_Min)&0xff;	
			Entry.hw.sendQueue.CMD[index+2] = (Entry.avatarbot.Board_Servo.Pulse_Min>>8)&0xff;	
			
			Entry.hw.sendQueue.CMD[index+3] = (Entry.avatarbot.Board_Servo.Pulse_Max)&0xff;	
			Entry.hw.sendQueue.CMD[index+4] = (Entry.avatarbot.Board_Servo.Pulse_Max>>8)&0xff;	
			
			Entry.hw.sendQueue.CMD[index+5] = (Entry.avatarbot.Board_Servo.us_Min)&0xff;	
			Entry.hw.sendQueue.CMD[index+6] = (Entry.avatarbot.Board_Servo.us_Min>>8)&0xff;	
			
			Entry.hw.sendQueue.CMD[index+7] = (Entry.avatarbot.Board_Servo.us_Max)&0xff;	
			Entry.hw.sendQueue.CMD[index+8] = (Entry.avatarbot.Board_Servo.us_Max>>8)&0xff;	

            Entry.hw.sendQueue.CMD[index+9] = (Entry.avatarbot.Board_Servo.angle)&0xff;
		}
		
		// led 
		index = Entry.avatarbot.BoardFunType.LED_Strip;
		Entry.hw.sendQueue.CMD[index+2] = (Entry.avatarbot.Board_LED_Strip.led_num)&0xff;
		Entry.hw.sendQueue.CMD[index+7] = (Entry.avatarbot.Board_LED_Strip.brightness)&0xff;
		
        //
        /*
        for(var i=0; i<(data.length/10); i++)
		{
			var index = i*10;
			console.log('[jhkim] setZero - DataSet[', i, ']: ', 
				Entry.hw.sendQueue.CMD[index+0], ' | ', Entry.hw.sendQueue.CMD[index+1], ' | ', Entry.hw.sendQueue.CMD[index+2], ' | ', 
				Entry.hw.sendQueue.CMD[index+3], ' | ', Entry.hw.sendQueue.CMD[index+4], ' | ', Entry.hw.sendQueue.CMD[index+5], ' | ', 
				Entry.hw.sendQueue.CMD[index+6], ' | ', Entry.hw.sendQueue.CMD[index+7], ' | ', Entry.hw.sendQueue.CMD[index+8], ' | ', 
				Entry.hw.sendQueue.CMD[index+9]);
		}
		*/
        //
        Entry.hw.update();
	},
    BoardFunType : {
    	Info: 0,
        Info_isConnect: 5,
    	Button:10,
        OLED:12, // OLED : 12(EN),13(Sample)
        GPIO_PWM_SET: 20,
        GPIO_PWM: 30,
        ADC: 40,
        IR_Remote: 50,
        Buzzer: 60,
        PCA9568: 70,
        Servo_M0: 80,
        Servo_M1: 90,
        Servo_M2: 100,
        Servo_M3: 110,
        Servo_M4: 120,
        Servo_M5: 130,
        Servo_M6: 140,
        Servo_M7: 150,
        DC_M: 160,
        MPU6050_1: 170,
        MPU6050_2: 180,
        LED_Strip: 190,
        ULTRA_SONIC: 200
	},
	
	Board_Buttton:{
		En: 0,
		getValue:0
	},
	
	Board_GPIO :{
		// gpio0
		En0: 0,
		Type0: 0, // gpio(0), ledc(1), pwm(2)
		value0: 0, //0~255, duty or value
		getValue0: 0, // input value
		
		// gpio1
		En1: 0,
		Type1: 0,
		value1: 0,
		getValue1: 0,
	},
	
	Board_PWM : { // default gpio resolution, freq
		Resolution: 13,
		Freq: 5000
	},
	
	Board_ADC : {
		En0: 0,
		getValue0: 0, // 12bit default. 0 ~ 4095
		En1: 0,
		getValue1: 0, 
		// common
		Resolution: 12,
		Attenuation_0db: 0,
		Attenuation_2_5db: 1,
		Attenuation_6db: 2,
		Attenuation_11db: 3 // default db value.
	},
	
	Board_IR_Remote : {
		Flag: 0,
        Value: 0xff,
        Repeat: 0,
        Address: 0,
        Command: 0,
        Raw_data: 0
	},

	buzzer_index: 0,
	Board_Buzzer : {
		En: 0,
		sample: 0,
		tone0: 0,
		tone1: 0,
		tone2: 0,
		tone3: 0,
		time0: 0,
		tone1: 0,
		tone2: 0,
		tone3: 0,
	},
	
	Board_PCA9568 : {
		Osci: 27000000,
		Freq: 50
	},
	
    // default - sg90
    servo_on: new Array(8).fill(0),
    servo_init: new Array(8).fill(0),
    servo_speed: new Array(8).fill(3),
	Board_Servo : {
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},

	Board_Servo_SelectType : {
		// sg90
        sg90_us_min: 400,
		sg90_us_max: 2100,
        // mg996r
        mg996r_us_min: 400,
		mg996r_us_max: 2360,
	},
    //
	Board_Servo_M0 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M1 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M2 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M3 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M4 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M5 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M6 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
	Board_Servo_M7 : {
		En:0,
		Pulse_Min: 150,
		Pulse_Max: 600,
		us_Min: 400,
		us_Max: 2100,
        angle: 90
	},
	
    dc_m_index: new Array(4).fill(0),
	Board_DC_M : {
		En0:0,
		CCW0:0,
		En1:0,
		CCW1:0,
		En2:0,
		CCW2:0,
		En3:0,
		CCW3:0
	},
    //
    dc_lineCar_index: new Array(16).fill(0), // 4(control)*4(index)
	dc_lineCar_ir_index: new Array(2).fill(0),
    //
	Board_MPU6050 : {
		En:0,
		// get value list
		acceleration_x:0,
		acceleration_y:0,
		acceleration_z:0,
		rotation_x:0,
		rotation_y:0,
		rotation_z:0,
		temperature:0
	},
	Board_LED_Strip : {
		En:0,
		sample: 0,
		led_num: 64,
		color_order: 0,
		r: 0,
		g: 0,
		b: 0,
		brightness:63,
		set_en: 0,
	},
	
	Board_ultraSonic : {
		En0:0,
		En1: 0,
		// get value
		ch0_cm: 0,
		ch0_inch: 0,
		ch1_cm: 0,
		ch2_inch: 0
	},
    
	/*
    monitorTemplate: {
        imgPath: 'hardware/avatarbot.png',
        width: 605,
        height: 434,
        listPorts: {
            '2': {
                name: `${Lang.Hw.port_en} 2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: `${Lang.Hw.port_en} 3 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: `${Lang.Hw.port_en} 4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: `${Lang.Hw.port_en} 5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: `${Lang.Hw.port_en} 6 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: `${Lang.Hw.port_en} 7 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: `${Lang.Hw.port_en} 8 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: `${Lang.Hw.port_en} 9 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: `${Lang.Hw.port_en} 10 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: `${Lang.Hw.port_en} 11 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: `${Lang.Hw.port_en} 12 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: `${Lang.Hw.port_en} 13 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: `${Lang.Hw.port_en} A0 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: `${Lang.Hw.port_en} A1 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: `${Lang.Hw.port_en} A2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: `${Lang.Hw.port_en} A3 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: `${Lang.Hw.port_en} A4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: `${Lang.Hw.port_en} A5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    */
};

// 언어 적용
Entry.avatarbot.setLanguage = function() {
    return {
        ko: {
            template: {
				// global.
				avatarbot: 'avatarbot',
				avatarbot_text: '%1',
                avatarbot_get_timer_number: '%1  ',
			    avatarbot_get_adc_dac_sonic_number: '%1  ',
			    avatarbot_get_gpio_dc_number: '%1  ',
			    avatarbot_get_serve_number: '%1  ',
                avatarbot_get_oled_number: '%1  ',
			    avatarbot_get_pwm_port_number: '%1  ',
			    avatarbot_get_buzzer_tone_number: '%1 ',
			    avatarbot_get_buzzer_time_number: '%1 ',
                avatarbot_get_servo_speed_number: '%1 ',
			    avatarbot_get_sensor_number: '%1  ',
			    avatarbot_get_port_number: '%1  ',
			    avatarbot_get_digital_toggle: '%1  ',
			    avatarbot_get_pwm_port_number: '%1  ',
			    avatarbot_get_number_sensor_value: '아날로그 %1 번 센서값  ',
			    avatarbot_ext_get_analog_value: '아날로그 %1 번 센서값',
			    avatarbot_ext_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
			    avatarbot_ext_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
			    avatarbot_ext_toggle_led: '디지털 %1 번 핀 %2 %3',
			    avatarbot_ext_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
			    avatarbot_ext_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
			    avatarbot_ext_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
			    avatarbot_ext_get_digital: '디지털 %1 번 센서값',
			    avatarbot_DC_CW: '정회전',
    			avatarbot_DC_CCW: '역회전',
                //
                avatarbot_DC_CAR_F: ' 앞 ',
    			avatarbot_DC_CAR_B: ' 뒷 ',
                //
                avatarbot_func_on: '시작',
    			avatarbot_func_off: '정지',
    			//
                avatarbot_DC_LINECAR_STOP: '정지',
                avatarbot_DC_LINECAR_RUN: '전진',
                avatarbot_DC_LINECAR_BACK: '후진',
                avatarbot_DC_LINECAR_LEFT: '왼쪽',
                avatarbot_DC_LINECAR_RIGHT: '오른쪽',
                //
                avatarbot_DC_LINECAR_DETECTION_BOTH: '라인 둘 다 감지',
                avatarbot_DC_LINECAR_DETECTION_LEFT: '라인 왼쪽 감지',
                avatarbot_DC_LINECAR_DETECTION_RIGHT: '라인 오른쪽 감지',
                avatarbot_DC_LINECAR_DETECTION_NONE: '라인 잃어버림',
                //
                avatarbot_servo_type_sg90: 'SG90',
    			avatarbot_servo_type_mg996r: 'MG996R',
				//
			   	// avatarbot_hw_test: 'AvatarBot HW Test %1 번 값 ',
                //
                // avatarbot_get_button: '버튼 값 가져오기 ',
                avatarbot_get_number_sensor_value: '아날로그 %1 번 센서값 가져오기 ', // adc
                avatarbot_convert_scale: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값 가져오기 ',
                avatarbot_get_digital_value: '디지털 %1 번 센서값 가져오기 ',
                avatarbot_toggle_led: 'LED %1 번 핀 %2 ',
                avatarbot_toggle_pwm: 'PWM %1 번 핀을 %2 % 로 %3 ',
                //
                // avatarbot_pca9568: '모터 컨트롤 주파수 %1 와 오실레이터 %2 (으)로 설정 ',
                avatarbot_servo: '서보 모터 %1 을 %2 속도, PWM 시간(us) %3 ~ %4 로 %5 ° %6 ',
                avatarbot_servo_sample: '서보 모터 %1 을 %2 속도, %3 로 %4 ° %5 ',
                avatarbot_dc: 'DC 모터 %1 을 %2 방향으로 %3 % %4 동작 ',
                avatarbot_robot_arm_on: '로봇 팔 %1(주의! 시작 전 초기 위치에 각 관절을 위치해주세요.)',
                avatarbot_robot_arm_speed: '로봇 팔 몸통 %1, 팔[축1 %2, 축2 %3], 헤드[축1 %4, 축2 %5], 집게 %6 속도 설정',
                avatarbot_robot_arm: '로봇 팔 몸통 %1°, 팔[축1 %2°, 축2 %3°], 헤드[축1 %4°, 축2 %5°], 집게 %6° 동작',            
                avatarbot_dc_car: '자동차 앞[%1 방향, 속도(좌 %2 %, 우 %3 %)], 뒷[%4 방향, 속도(좌 %5 %, 우 %6 %)] %7 동작',
                //
                avatarbot_line_car_ir_init: '라인트레이서 좌측 센서 %1 %, 우측 센서 %2 % 감도 설정',
                avatarbot_line_car_motor_init: '라인트레이서 %1 조건일 때 앞[좌 %2 %, 우 %3 %], 뒷[좌 %4 %, 우 %5 %] 속도 설정',
                avatarbot_line_car: '라인트레이서 %1',
                //
                avatarbot_buzzer_sample: '부저 샘플 %1 %2 초 동안 시작 ',
                avatarbot_buzzer: '부저 %1 소리로 %2 초 동안 시작 ',
                //
                avatarbot_led_strip_sample: 'LED 스트립 샘플 %1 동작',
                avatarbot_led_strip_set: 'LED 스트립 LED %1 개, 밝기 %2 % 설정 ',
                avatarbot_led_strip_indexOn: 'LED 스트립 LED %1 번 R %2, G %3, B %4 %5',

                // avatarbot_ir_remote: '리모컨 %1 (으)로 동작 ',
                avatarbot_get_mpu6050: '자이로 가속도 센서 %1 정보 확인 ',
                avatarbot_get_mpu6050_detail: '자이로 가속도 센서 %1 의 %2 값 가져오기 ',
                avatarbot_ultra_sonic:'초음파 %1 번 센서 정보 확인 ',
                avatarbot_ultra_sonic_detail:'초음파 %1 번 센서 값(%2)',
                //
                avatarbot_ir_receiver:'리모컨 %1 모드로 값 가져오기 ',

                avatarbot_oled_sample:'OLED %1 화면으로 %2 ',
                //
            },
            Device: {
                avatarbot: 'avatarbot',
            },
            Menus: {
                avatarbot: 'avatarbot',
            },
        },
        /*
        en: {
            template: {
                avatarbot_get_number_sensor_value: 'Analog %1 Sensor value  ',
                avatarbot_get_digital_value: 'Digital %1 Sensor value  ',
                avatarbot_toggle_led: 'Digital %1 Pin %2 %3',
                avatarbot_toggle_pwm: 'PWM %1 Pin %2 %3',
                avatarbot_convert_scale: 'Map Value %1 %2 ~ %3 to %4 ~ %5  ',
            },
            Device: {
                avatarbot: 'avatarbot',
            },
            Menus: {
                avatarbot: 'avatarbot',
            },
        },
        */
    };
};

// 엔트리에 등록할 블록들의 블록명 작성
Entry.avatarbot.blockMenuBlocks = [
    // hw data 통신 test
    // 'avatarbot_hw_test',
    // base block
    // 'avatarbot_get_button',
    'avatarbot_get_number_sensor_value',
    'avatarbot_convert_scale',
    //
    'avatarbot_get_digital_value',
    'avatarbot_toggle_led',
    'avatarbot_toggle_pwm',
    //
    // 'avatarbot_pca9568',
    'avatarbot_servo',
    'avatarbot_servo_sample',
    'avatarbot_dc',
    'avatarbot_robot_arm_on',
    'avatarbot_robot_arm_speed',
    'avatarbot_robot_arm',
    'avatarbot_dc_car',
    //
    'avatarbot_line_car_ir_init',
    'avatarbot_line_car_motor_init',
    'avatarbot_line_car',
    //
    'avatarbot_buzzer_sample',
    'avatarbot_buzzer',
    
    'avatarbot_led_strip_sample',
    'avatarbot_led_strip_set',
    'avatarbot_led_strip_indexOn',
    // 'avatarbot_led_strip',
    
    // 'avatarbot_ir_remote',
    'avatarbot_get_mpu6050',
    'avatarbot_get_mpu6050_detail',
    'avatarbot_ultra_sonic',
    'avatarbot_ultra_sonic_detail',
    //
    'avatarbot_ir_receiver',
    'avatarbot_oled_sample',
];

// 블록 생성
Entry.avatarbot.getBlocks = function() {
    return {
		//---------------------------------------------------------------
        //region avatarbot 아두이노
        //---------------------------------------------------------------
        // 공용 function.
        //---------------------------------------------------------------
        avatarbot_text: {
            color: '#FFD974',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['10'],
            },
            paramsKeyMap: {
                NAME: 0,
            },
            func(sprite, script) {
                return script.getStringField('NAME');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'TextInput',
                                value: 10,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'avatarbot_text',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        /*
        avatarbot_get_sensor_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                	// [["key1", "value1"], ["key2", "value2"]]
                	// 처럼 구성이 됩니다.
                    options: [
                        ['0', 'A0'],
                        ['1', 'A1'],
                    ],
                    value: 'A0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE, // 기본 컬러는 EntryStatic.ARROW_COLOR_VARIABLE 입니다.
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', 'A0'],
                                    ['1', 'A1'],
                                ],
                                value: 'A0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'avatarbot_get_sensor_number',
                    },
                ],
            },
        },
        */
	   	//
        avatarbot_get_buzzer_tone_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                	// [["key1", "value1"], ["key2", "value2"]]
                	// 처럼 구성이 됩니다.
                    options: [
                            ['B0', '0'],
						    ['C1', '1'],
						    ['CS1', '2'],
						    ['D1', '3'],
						    ['DS1', '4'],
						    ['E1', '5'],
						    ['F1', '6'],
						    ['FS1', '7'],
						    ['G1', '8'],
						    ['GS1', '9'],
						    ['A1', '10'],
						    ['AS1', '11'],
						    ['B1', '12'],
						    ['C2', '13'],
						    ['CS2', '14'],
						    ['D2', '15'],
						    ['DS2', '16'],
						    ['E2', '17'],
						    ['F2', '18'],
						    ['FS2', '19'],
						    ['G2', '20'],
						    ['GS2', '21'],
						    ['A2', '22'],
						    ['AS2', '23'],
						    ['B2', '24'],
						    ['C3', '25'],
						    ['CS3', '26'],
						    ['D3', '27'],
						    ['DS3', '28'],
						    ['E3', '29'],
						    ['F3', '30'],
						    ['FS3', '31'],
						    ['G3', '32'],
						    ['GS3', '33'],
						    ['A3', '34'],
						    ['AS3', '35'],
						    ['B3', '36'],
						    ['C4', '37'],
						    ['CS4', '38'],
						    ['D4', '39'],
						    ['DS4', '40'],
						    ['E4', '41'],
						    ['F4', '42'],
						    ['FS4', '43'],
						    ['G4', '44'],
						    ['GS4', '45'],
						    ['A4', '46'],
						    ['AS4', '47'],
						    ['B4', '48'],
						    ['C5', '49'],
						    ['CS5', '50'],
						    ['D5', '51'],
						    ['DS5', '52'],
						    ['E5', '53'],
						    ['F5', '54'],
						    ['FS5', '55'],
						    ['G5', '56'],
						    ['GS5', '57'],
						    ['A5', '58'],
						    ['AS5', '59'],
						    ['B5', '60'],
						    ['C6', '61'],
						    ['CS6', '62'],
						    ['D6', '63'],
						    ['DS6', '64'],
						    ['E6', '65'],
						    ['F6', '66'],
						    ['FS6', '67'],
						    ['G6', '68'],
						    ['GS6', '69'],
						    ['A6', '70'],
						    ['AS6', '71'],
						    ['B6', '72'],
						    ['C7', '73'],
						    ['CS7', '74'],
						    ['D7', '75'],
						    ['DS7', '76'],
						    ['E7', '77'],
						    ['F7', '78'],
						    ['FS7', '79'],
						    ['G7', '80'],
						    ['GS7', '81'],
						    ['A7', '82'],
						    ['AS7', '83'],
						    ['B7', '84'],
						    ['C8', '85'],
						    ['CS8', '86'],
						    ['D8', '87'],
						    ['DS8', '88']
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE, // 기본 컬러는 EntryStatic.ARROW_COLOR_VARIABLE 입니다.
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                TONE: 0,
            },
            func(sprite, script) {
                return script.getStringField('TONE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
	                                    ['B0', '0'],
									    ['C1', '1'],
									    ['CS1', '2'],
									    ['D1', '3'],
									    ['DS1', '4'],
									    ['E1', '5'],
									    ['F1', '6'],
									    ['FS1', '7'],
									    ['G1', '8'],
									    ['GS1', '9'],
									    ['A1', '10'],
									    ['AS1', '11'],
									    ['B1', '12'],
									    ['C2', '13'],
									    ['CS2', '14'],
									    ['D2', '15'],
									    ['DS2', '16'],
									    ['E2', '17'],
									    ['F2', '18'],
									    ['FS2', '19'],
									    ['G2', '20'],
									    ['GS2', '21'],
									    ['A2', '22'],
									    ['AS2', '23'],
									    ['B2', '24'],
									    ['C3', '25'],
									    ['CS3', '26'],
									    ['D3', '27'],
									    ['DS3', '28'],
									    ['E3', '29'],
									    ['F3', '30'],
									    ['FS3', '31'],
									    ['G3', '32'],
									    ['GS3', '33'],
									    ['A3', '34'],
									    ['AS3', '35'],
									    ['B3', '36'],
									    ['C4', '37'],
									    ['CS4', '38'],
									    ['D4', '39'],
									    ['DS4', '40'],
									    ['E4', '41'],
									    ['F4', '42'],
									    ['FS4', '43'],
									    ['G4', '44'],
									    ['GS4', '45'],
									    ['A4', '46'],
									    ['AS4', '47'],
									    ['B4', '48'],
									    ['C5', '49'],
									    ['CS5', '50'],
									    ['D5', '51'],
									    ['DS5', '52'],
									    ['E5', '53'],
									    ['F5', '54'],
									    ['FS5', '55'],
									    ['G5', '56'],
									    ['GS5', '57'],
									    ['A5', '58'],
									    ['AS5', '59'],
									    ['B5', '60'],
									    ['C6', '61'],
									    ['CS6', '62'],
									    ['D6', '63'],
									    ['DS6', '64'],
									    ['E6', '65'],
									    ['F6', '66'],
									    ['FS6', '67'],
									    ['G6', '68'],
									    ['GS6', '69'],
									    ['A6', '70'],
									    ['AS6', '71'],
									    ['B6', '72'],
									    ['C7', '73'],
									    ['CS7', '74'],
									    ['D7', '75'],
									    ['DS7', '76'],
									    ['E7', '77'],
									    ['F7', '78'],
									    ['FS7', '79'],
									    ['G7', '80'],
									    ['GS7', '81'],
									    ['A7', '82'],
									    ['AS7', '83'],
									    ['B7', '84'],
									    ['C8', '85'],
									    ['CS8', '86'],
									    ['D8', '87'],
									    ['DS8', '88']
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'avatarbot_get_buzzer_tone_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_buzzer_time_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
						['정지', '0'],
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
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                TIME: 0,
            },
            func(sprite, script) {
                return script.getStringField('TIME');
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
									['정지', '0'],
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
                        ],
                        keyOption: 'avatarbot_get_buzzer_time_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_servo_speed_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
						['1단계', '1'],
                        ['2단계', '2'],
                        ['3단계', '3'],
                        ['4단계', '4'],
                        ['5단계', '5'],
                        ['6단계', '6'],
                        ['7단계', '7'],
                        ['8단계', '8'],
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
                SPEED: 0,
            },
            func(sprite, script) {
                return script.getStringField('SPEED');
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
									['1단계', '1'],
                                    ['2단계', '2'],
                                    ['3단계', '3'],
                                    ['4단계', '4'],
                                    ['5단계', '5'],
                                    ['6단계', '6'],
                                    ['7단계', '7'],
                                    ['8단계', '8'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_servo_speed_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        // get port(module, function) number
        // - gpio(4), pwm(3), adc(2), dac(2), servo_m(8), dc_m(4), ulrasonic(2) 
        //---------------------------------------------------------------
        avatarbot_get_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
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
                return script.getStringField('PORT');
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
			                        ['1', '0'],
			                        ['2', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_port_number',
                    },
                ],
            },
        },
        //
        //
        avatarbot_get_led_strip_type: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                	// [["key1", "value1"], ["key2", "value2"]]
                	// 처럼 구성이 됩니다.
                    options: [
                            ['LPD6803', '0'],
						    ['LPD8806', '1'],
						    ['WS2801', '2'],
						    ['WS2803', '3'],
						    ['SM16716', '4'],
						    ['P9813', '5'],
						    ['APA102', '6'],
						    ['SK9822', '7'],
						    ['SK9822HD', '8'],
						    ['DOTSTAR', '9'],
						    ['DOTSTARHD', '10'],
						    ['APA102HD', '11']
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE, // 기본 컬러는 EntryStatic.ARROW_COLOR_VARIABLE 입니다.
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            func(sprite, script) {
                return script.getStringField('TYPE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
	                                    ['LPD6803', '0'],
									    ['LPD8806', '1'],
									    ['WS2801', '2'],
									    ['WS2803', '3'],
									    ['SM16716', '4'],
									    ['P9813', '5'],
									    ['APA102', '6'],
									    ['SK9822', '7'],
									    ['SK9822HD', '8'],
									    ['DOTSTAR', '9'],
									    ['DOTSTARHD', '10'],
									    ['APA102HD', '11']
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'avatarbot_get_led_strip_type',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_gpio_dc_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
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
                return script.getStringField('PORT');
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
			                        ['1', '0'],
			                        ['2', '1'],
			                        ['3', '2'],
			                        ['4', '3'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_gpio_dc_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_serve_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
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
                return script.getStringField('PORT');
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
			                        ['1', '0'],
			                        ['2', '1'],
			                        ['3', '2'],
			                        ['4', '3'],
			                        ['5', '4'],
			                        ['6', '5'],
                                    ['7', '6'],
                                    ['8', '7'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_serve_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_oled_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['none', '0'],
                        ['lines', '1'],
                        ['rectangles', '2'],
                        ['fill rectangles', '3'],
                        ['circles', '4'],
                        ['fill circles', '5'],
                        ['round', '6'],
                        ['fill round', '7'],
                        ['triangles', '8'],
                        ['fill triangles', '9'],
                        ['text', '10'],
                        ['stylized text', '11'],
                        ['scroll text', '12'],
                        ['bitmap', '13'],
                        ['snow bitmap', '14'],
                        ['logo text', '15'],
                        ['image', '16'],
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
                return script.getStringField('PORT');
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
			                        ['none', '0'],
                                    ['lines', '1'],
                                    ['rectangles', '2'],
                                    ['fill rectangles', '3'],
                                    ['circles', '4'],
                                    ['fill circles', '5'],
                                    ['round', '6'],
                                    ['fill round', '7'],
                                    ['triangles', '8'],
                                    ['fill triangles', '9'],
                                    ['text', '10'],
                                    ['stylized text', '11'],
                                    ['scroll text', '12'],
                                    ['bitmap', '13'],
                                    ['snow bitmap', '14'],
                                    ['logo text', '15'],
                                    ['image', '16'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_oled_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_timer_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['정지', '0'],
                        ['1 초', '1'],
                        ['2 초', '2'],
                        ['3 초', '3'],
                        ['4 초', '4'],
                        ['5 초', '5'],
                        ['6 초', '6'],
                        ['7 초', '7'],
                        ['8 초', '8'],
                        ['9 초', '9'],
                        ['10초', '10'],
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
                TIME: 0,
            },
            func(sprite, script) {
                return script.getStringField('TIME');
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
			                        ['정지', '0'],
                                    ['1 초', '1'],
                                    ['2 초', '2'],
                                    ['3 초', '3'],
                                    ['4 초', '4'],
                                    ['5 초', '5'],
                                    ['6 초', '6'],
                                    ['7 초', '7'],
                                    ['8 초', '8'],
                                    ['9 초', '9'],
                                    ['10초', '10'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avatarbot_get_timer_number',
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        /*
        avatarbot_get_pwm_port_number: {
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
                return script.getStringField('PORT');
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
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'avatarbot_get_pwm_port_number',
                    },
                ],
            },
        },
        */
        //---------------------------------------------------------------
        // hw test
        //---------------------------------------------------------------
        /*
        avatarbot_hw_test:{
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
                        type: 'avatarbot_get_gpio_dc_number',
                    },
                ],
                type: 'avatarbot_hw_test',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'avatarbot_value',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
                const signal = script.getNumberValue('PORT', script);
                // console.log("avatarbot_hw_test : %d", Entry.hw.portData[signal]);
                // console.log("avatarbot value test....");
                // console.log("%d %d", 	what, speed);
                
                // return Entry.hw.portData[signal];
                // Entry.hw.update();
                
                return Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.GPIO_LED_PWM0+signal];
                // return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.hw_test(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },     		   
	   	},
	   	*/
	   	//---------------------------------------------------------------
	   	// base function.
	   	//---------------------------------------------------------------
        /*
        avatarbot_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
                type: 'avatarbot_get_button', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                // VALUE: 0,
            },
            class: 'avatarbot_button',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                let sensorData = Entry.hw.portData.CMD[Entry.avatarbot.BoardFunType.Button+1] == 0 ? 0 : 1;
                Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.Button+1] = 0;
                Entry.hw.update();
            	return sensorData;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_button()',
                        blockType: 'param',
                        textParams: [
                        ],
                    },
                ],
            },
        },
        */
        //---------------------------------------------------------------
        avatarbot_get_number_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
                params: [
                    {
                        type: 'avatarbot_get_port_number', // 상단 func 가져와서 사용.
                    },
                ],
                type: 'avatarbot_get_number_sensor_value', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE: 0,
            },
            class: 'avatarbot_adc',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
	            if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                const signal = script.getNumberValue('VALUE', script);
                let index = (signal*2) + Entry.avatarbot.BoardFunType.ADC;
                let sensorData_low = Entry.hw.portData.CMD[index + 6]; // low
                let sensorData_high = Entry.hw.portData.CMD[index + 7]<<8; // high
                let sensorData = sensorData_low + sensorData_high;
                
                Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC + signal] = 1;
                Entry.hw.update();
            	
                return sensorData;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_convert_scale: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_number_sensor_value',
                        params: [
                            {
                                type: 'avatarbot_get_port_number',
                                id: 'bl5e',
                            },
                        ],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['4095'],
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
                type: 'avatarbot_convert_scale',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'avatarbot_adc',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
                const value1 = script.getNumberValue('VALUE1', script);
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);

                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                let result = value1;
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

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }

                return result;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.convert_scale(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
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
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field', //'basic_boolean_field',
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
                        type: 'avatarbot_get_port_number',
                    },
                ],
                type: 'avatarbot_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'avatarbot_gpio_pwm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                const signal = script.getNumberValue('PORT', script);
                // return Entry.hw.getDigitalPortValue(signal);
                let index = (signal*4) + Entry.avatarbot.BoardFunType.GPIO_PWM;
                let sensorData = Entry.hw.portData.CMD[index+3] == 0 ? 0 : 1; // ch0, ch1 value
                
                // digital setting
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = 0; // duty
                Entry.hw.sendQueue.CMD[index+2] = 0; // type in(0)
                Entry.hw.update();
                
            	return sensorData;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.digitalRead(%1)',
                        blockType: 'param',
                        // replaceBlockType: 'avatarbot_ext_get_digital',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_toggle_led: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ARDUINO_on, 'on'],
                        [Lang.Blocks.ARDUINO_off, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                /*{
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },*/
                /*
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                */
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_port_number',
                    },
                    null,
                    // null,
                ],
                type: 'avatarbot_toggle_led',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
                // RUN:2,
            },
            class: 'avatarbot_gpio_pwm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
                //
                if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                const signal = script.getNumberValue('VALUE', script);
                const operator = script.getField('OPERATOR');
                // const run = script.getField('RUN');
                const value = operator == 'on' ? 255 : 0;
                // const on = run == '1' ? 1 : 0;
                const on = operator == 'on' ? 1 : 0;

                let index = (signal*4) + Entry.avatarbot.BoardFunType.GPIO_PWM;
                // let sensorData = Entry.hw.portData.CMD[index+3] == 0 ? 0 : 1; // ch0, ch1 value
                
                // digital setting
                Entry.hw.sendQueue.CMD[index] = on; // 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = value; // duty or value
                Entry.hw.sendQueue.CMD[index+2] = 1; // type out(0)
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.pin_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ARDUINO_on, 'on'],
                                    [Lang.Blocks.ARDUINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            /*
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            */
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_toggle_pwm: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ARDUINO_on, 'on'],
                        [Lang.Blocks.ARDUINO_off, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_port_number',
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['50'],
                    },
                ],
                type: 'avatarbot_toggle_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                RUN:2,
            },
            class: 'avatarbot_gpio_pwm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                const signal = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                const run = script.getField('RUN');
                const on = run == 'on' ? 1 : 0;
                
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);
                
                let index = (signal*4) + Entry.avatarbot.BoardFunType.GPIO_PWM;
                
                // digital setting
                Entry.hw.sendQueue.CMD[index] = on; // 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = value; // duty or value : 0 ~ 255
                Entry.hw.sendQueue.CMD[index+2] = 2; // type pwm(2)
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_pin_digital(%1, %2, %3)',
                        textParams: [
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
                                    [Lang.Blocks.ARDUINO_on, 'on'],
                                    [Lang.Blocks.ARDUINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        
        //---------------------------------------------------------------
        /*
        avatarbot_pca9568: {
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
                        type: 'avatarbot_text',
                        params: ['50'],
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['27000000'],
                    },
                    null,
                ],
                type: 'avatarbot_pca9568',
            },
            paramsKeyMap: {
                FREQ: 0,
                OSC: 1,
            },
            class: 'avatarbot_set',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
                const freq = script.getNumberValue('FREQ');
                const osci = script.getNumberValue('OSC');
                
                let index = Entry.avatarbot.BoardFunType.PCA9568;
                
                // digital setting
                Entry.hw.sendQueue.CMD[index] = 1; // PCA9568 en            
                Entry.hw.sendQueue.CMD[index+1] = (freq)&0xff; // PCA9568 freq0
                Entry.hw.sendQueue.CMD[index+2] = (freq>>8)&0xff; // PCA9568 freq1
                Entry.hw.sendQueue.CMD[index+3] = (freq>>16)&0xff; // PCA9568 freq2
                Entry.hw.sendQueue.CMD[index+4] = (freq>>24)&0xff; // PCA9568 freq3
                Entry.hw.sendQueue.CMD[index+5] = (osci)&0xff; // PCA9568 osci0
                Entry.hw.sendQueue.CMD[index+6] = (osci>>8)&0xff; // PCA9568 osci1
                Entry.hw.sendQueue.CMD[index+7] = (osci>>16)&0xff; // PCA9568 osci2
                Entry.hw.sendQueue.CMD[index+8] = (osci>>24)&0xff; // PCA9568 osci3
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_pca9568(%1 %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        */
        //---------------------------------------------------------------
		avatarbot_servo: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_serve_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number', 
                    },
                    {
                        type: 'number',
                        params: ['400'],
                    },
                    {
                        type: 'number',
                        params: ['2100'],
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'avatarbot_servo',
            },
            paramsKeyMap: {
                VALUE1: 0,
                SPEED:1,
                VALUE2: 2,
                VALUE3: 3,
                VALUE4: 4,
                RUN:5,
            },
            class: 'avatarbot_serbo',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                const speed = script.getNumberValue('SPEED', script);
                const signal = script.getNumberValue('VALUE1', script);
                let us_min = script.getNumberValue('VALUE2', script);
                let us_max = script.getNumberValue('VALUE3', script);
                let value = script.getNumberValue('VALUE4', script);
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;

                us_min = Math.round(us_min);
                us_max = Math.round(us_max);
                value = Math.round(value);
                
                us_min = Math.max(us_min, 200); //150  최소 값.
                us_max = Math.max(us_max, 700); // 600 최소 값.
                
                us_min = Math.min(us_min, us_max); // us_min < us_max :: check.
                us_max = Math.max(us_min, us_max);
                
                value = Math.max(value, 0); //150 
                value = Math.min(value, 180); // 600

                Entry.avatarbot.servo_speed[signal] = speed&0xf;

                let index = (signal*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                
                // digital setting
                Entry.hw.sendQueue.CMD[index] = on + (Entry.avatarbot.servo_speed[signal]<<4); // 1; // ch en
                // Entry.hw.sendQueue.CMD[index+1] = 0; // pulse min low
                // Entry.hw.sendQueue.CMD[index+2] = 0; // pulse min high
                // Entry.hw.sendQueue.CMD[index+3] = 0; // pulse max low
                // Entry.hw.sendQueue.CMD[index+4] = 0; // pulse max high
                Entry.hw.sendQueue.CMD[index+5] = (us_min)&0xff; // us min low
                Entry.hw.sendQueue.CMD[index+6] = (us_min>>8)&0xff; // us min high
                Entry.hw.sendQueue.CMD[index+7] = (us_max)&0xff; // us max low
                Entry.hw.sendQueue.CMD[index+8] = (us_max>>8)&0xff; // us max high
                Entry.hw.sendQueue.CMD[index+9] = (value)&0xff; // angle value. 0 ~ 180
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.servo(%1, %2, %3, %4, %5, %6)',
                        blockType: 'param',
                        textParams: [
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
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
		avatarbot_servo_sample: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_servo_type_sg90, '0'],
                        [Lang.template.avatarbot_servo_type_mg996r, '1'],
                    ],
                    value: '0',
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_serve_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    null,
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'avatarbot_servo_sample',
            },
            paramsKeyMap: {
                VALUE1: 0,
                SPEED:1,
                VALUE2: 2,
                VALUE3: 3,
                RUN:4,
            },
            class: 'avatarbot_serbo_sample',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }

                const speed = script.getNumberValue('SPEED', script);
                const signal = script.getNumberValue('VALUE1', script);
                let servo_type = script.getNumberValue('VALUE2', script);
                let value = script.getNumberValue('VALUE3', script);
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;
                let us_min = Entry.avatarbot.Board_Servo_SelectType.sg90_us_min;
                let us_max = Entry.avatarbot.Board_Servo_SelectType.sg90_us_max;

                value = Math.round(value);
                value = Math.max(value, 0); //150 
                value = Math.min(value, 180); // 600
                
                switch(servo_type)
                {
                    case 0: // sg90 servo motor
                        us_min = Entry.avatarbot.Board_Servo_SelectType.sg90_us_min;
                        us_max = Entry.avatarbot.Board_Servo_SelectType.sg90_us_max;
                        break;
                    case 1: // mg996r servo motor
                        us_min = Entry.avatarbot.Board_Servo_SelectType.mg996r_us_min;
                        us_max = Entry.avatarbot.Board_Servo_SelectType.mg996r_us_max;
                        break;
                    default:
                        break;
                }
                Entry.avatarbot.servo_speed[signal] = speed&0xf;

                let index = (signal*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                
                // digital setting
                // Entry.hw.sendQueue.CMD[index] = on; // 1; // ch en
                Entry.hw.sendQueue.CMD[index] = on + (Entry.avatarbot.servo_speed[signal]<<4); // 1; // ch en
                // Entry.hw.sendQueue.CMD[index+1] = 0; // pulse min low
                // Entry.hw.sendQueue.CMD[index+2] = 0; // pulse min high
                // Entry.hw.sendQueue.CMD[index+3] = 0; // pulse max low
                // Entry.hw.sendQueue.CMD[index+4] = 0; // pulse max high
                Entry.hw.sendQueue.CMD[index+5] = (us_min)&0xff; // us min low
                Entry.hw.sendQueue.CMD[index+6] = (us_min>>8)&0xff; // us min high
                Entry.hw.sendQueue.CMD[index+7] = (us_max)&0xff; // us max low
                Entry.hw.sendQueue.CMD[index+8] = (us_max>>8)&0xff; // us max high
                Entry.hw.sendQueue.CMD[index+9] = (value)&0xff; // angle value. 0 ~ 180
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.servo_sample(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                                defaultType: 'number',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_servo_type_sg90, '0'],
                                    [Lang.template.avatarbot_servo_type_mg996r, '1'],
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
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
       	//---------------------------------------------------------------
       	avatarbot_dc: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_DC_CW, '0'],
                        [Lang.template.avatarbot_DC_CCW, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                /*
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                */
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
                        type: 'avatarbot_get_gpio_dc_number',
                    },
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    // null,
                    {
                        type: 'avatarbot_get_timer_number',
                    },
                ],
                type: 'avatarbot_dc',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                // RUN:3,
                TIME: 3,
            },
            class: 'avatarbot_dc',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                // const dc_m = script.getNumberValue('VALUE1', script); // Channel
                // let cw = script.getNumberValue('VALUE2', script); // cw, ccw
                // let speed = script.getNumberValue('VALUE3', script); // duty speed
                // const cw_value = cw == '정회전' ? 1 : 0;
                const signal = script.getNumberValue('VALUE1', script);
                let cw = script.getNumberValue('VALUE2', script);
                let speed = script.getNumberValue('VALUE3', script);
                // const run = script.getField('RUN');
                // const on = run == '1' ? 1 : 0;
                const time = script.getNumberValue('TIME', script);
                const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0

                speed = Math.round(speed);
                speed = Math.max(speed, 0); 
                speed = Math.min(speed, 100);
                
                Entry.avatarbot.dc_m_index[signal] += 1;
                if(Entry.avatarbot.dc_m_index[signal] > 3)
                {
                    Entry.avatarbot.dc_m_index[signal] = 0;
                }
                
                if(on == 0)
                {
                    Entry.avatarbot.dc_m_index[signal] = 0;
                }

                let index = (signal*2) + Entry.avatarbot.BoardFunType.DC_M; // base+2,4,6,8
                
                // Entry.hw.sendQueue.CMD[index] = (1 + (cw<<4))&0xff; // ch en
                Entry.hw.sendQueue.CMD[index] = (on + (cw<<1) + (Entry.avatarbot.dc_m_index[signal]<<2) + (time<<4))&0xff; // ch en
                Entry.hw.sendQueue.CMD[index+1] = speed&0xff;
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.dc(%1, %2, %3, %4)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_DC_CW, '0'],
	                        		[Lang.template.avatarbot_DC_CCW, '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            /*
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            */
                            {
                                type: 'Block',
                                accept: 'string',
                            },

                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_robot_arm_on: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'avatarbot_robot_arm_on',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'avatarbot_robotArm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                const on = script.getNumberValue('VALUE1', script);

                //
                let value =  [90,    180,  180,   90,    0,    0];
                let us_min = [400,   400,  400,  400,  400,  400];
                let us_max = [2360, 2360, 2360, 2100, 2100, 2100];

                for (let i = 0; i < 6; i++) {
                    // Entry.avatarbot.servo_on[i] = on;
                    Entry.avatarbot.servo_on[i] = 0;

                    value[i] = Math.round(value[i]);
                    value[i] = Math.max(value[i], 0); //150 
                    value[i] = Math.min(value[i], 180); // 600
                    let index = (i*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                    
                    // digital setting
                    // Entry.hw.sendQueue.CMD[index] = 1; // 1; // ch en
                    if(Entry.avatarbot.servo_init[i] == 0)
                    {
                        Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (1<<1) + (Entry.avatarbot.servo_speed[i]<<4); // 1; // ch en
                    }else{
                        Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (Entry.avatarbot.servo_speed[i]<<4); // 1; // ch en
                    }
                    Entry.avatarbot.servo_init[i] = 1;
                    Entry.hw.sendQueue.CMD[index+5] = (us_min[i])&0xff; // us min low
                    Entry.hw.sendQueue.CMD[index+6] = (us_min[i]>>8)&0xff; // us min high
                    Entry.hw.sendQueue.CMD[index+7] = (us_max[i])&0xff; // us max low
                    Entry.hw.sendQueue.CMD[index+8] = (us_max[i]>>8)&0xff; // us max high
                    Entry.hw.sendQueue.CMD[index+9] = (value[i])&0xff; // angle value. 0 ~ 180
                }
                //
                Entry.hw.update();
                /*
                setTimeout(() => {
                    for (let i = 0; i < 6; i++) {
                        Entry.avatarbot.servo_on[i] = on;
                        value[i] = Math.round(value[i]);
                        value[i] = Math.max(value[i], 0); //150 
                        value[i] = Math.min(value[i], 180); // 600
                        let index = (i*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                        Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (Entry.avatarbot.servo_speed[i]<<4); // 1; // ch en
                    }
                    Entry.hw.update();
                    script.callReturn();
                }, 3000); // 1000ms = 1초
                
                // return script.callReturn();
                return;
                */

                if (!script.isStart) {
                    // 스크립트 시작 플래그 설정
                    script.isStart = true;
                    script.timeFlag = 1;
                    
                    // 3000ms 대기 설정
                    setTimeout(() => {
                        script.timeFlag = 0; // 대기 종료
                    }, 3000);
                    return script;
                } else if (script.timeFlag === 1) {
                    // 대기 중인 경우, 스크립트를 멈춤 상태로 유지
                    return script;
                } else {
                    // 대기 종료 후, 다음 블록 실행
                    delete script.isStart;
                    delete script.timeFlag;
                    for (let i = 0; i < 6; i++) 
                    {
                        Entry.avatarbot.servo_on[i] = on;
                        value[i] = Math.round(value[i]);
                        value[i] = Math.max(value[i], 0);
                        value[i] = Math.min(value[i], 180);
                        let index = (i * 10) + Entry.avatarbot.BoardFunType.Servo_M0;
                        Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (Entry.avatarbot.servo_speed[i] << 4);
                    }
                    Entry.hw.update();
                    return script.callReturn();
                }

            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.robot_arm_on(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_robot_arm_speed: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                    {
                        type: 'avatarbot_get_servo_speed_number',
                    },
                ],
                type: 'avatarbot_robot_arm_speed',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
                VALUE6: 5,
            },
            class: 'avatarbot_robotArm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                for (let i = 0; i < 6; i++) {
                    Entry.avatarbot.servo_speed[i] = script.getNumberValue(`VALUE${i + 1}`, script);
                    let index = (i*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                    // digital setting
                    // Entry.hw.sendQueue.CMD[index] = 1; // 1; // ch en
                    Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (Entry.avatarbot.servo_speed[i]<<4); // 1; // ch en
                }

                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.robot_arm_speed(%1, %2, %3, %4, %5, %6)',
                        blockType: 'param',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_robot_arm: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    {
                        type: 'number',
                        params: ['180'],
                    },
                    {
                        type: 'number',
                        params: ['180'],
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'avatarbot_robot_arm',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
                VALUE6: 5,
            },
            class: 'avatarbot_robotArm',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                // const signal = script.getNumberValue('VALUE1', script);
                // let us_min = script.getNumberValue('VALUE2', script);
                // let us_max = script.getNumberValue('VALUE3', script);
                // const int usMinTable[] = {USMIN, 400, 400};
                // const int usMaxTable[] = {USMAX, 2100, 2360};

                let value =  [0,       0,    0,    0,    0,    0];
                let us_min = [400,   400,  400,  400,  400,  400];
                let us_max = [2360, 2360, 2360, 2100, 2100, 2100];

                for (let i = 0; i < 6; i++) {
                    value[i] = script.getNumberValue(`VALUE${i + 1}`, script);
                    value[i] = Math.round(value[i]);
                    value[i] = Math.max(value[i], 0); //150 
                    value[i] = Math.min(value[i], 180); // 600
                    let index = (i*10) + Entry.avatarbot.BoardFunType.Servo_M0; // base+10,20,30,...n
                    // digital setting
                    // Entry.hw.sendQueue.CMD[index] = 1; // 1; // ch en
                    Entry.hw.sendQueue.CMD[index] = Entry.avatarbot.servo_on[i] + (Entry.avatarbot.servo_speed[i]<<4); // 1; // ch en
                    Entry.hw.sendQueue.CMD[index+5] = (us_min[i])&0xff; // us min low
                    Entry.hw.sendQueue.CMD[index+6] = (us_min[i]>>8)&0xff; // us min high
                    Entry.hw.sendQueue.CMD[index+7] = (us_max[i])&0xff; // us max low
                    Entry.hw.sendQueue.CMD[index+8] = (us_max[i]>>8)&0xff; // us max high
                    Entry.hw.sendQueue.CMD[index+9] = (value[i])&0xff; // angle value. 0 ~ 180
                }

                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.robot_arm(%1, %2, %3, %4, %5, %6)',
                        blockType: 'param',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_dc_car: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                // front
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_DC_CAR_F, '0'],
                        [Lang.template.avatarbot_DC_CAR_B, '1'],
                    ],
                    value: '0',
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
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                // back
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_DC_CAR_F, '0'],
                        [Lang.template.avatarbot_DC_CAR_B, '1'],
                    ],
                    value: '0',
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
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                // on/off
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    // front
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    // back
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    // on/off
                    {
                        type: 'avatarbot_get_timer_number',
                    },
                ],
                type: 'avatarbot_dc_car',
            },
            paramsKeyMap: {
                // front
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                // back
                VALUE4: 3,
                VALUE5: 4,
                VALUE6: 5,
                // on/off - timer
                TIME: 6,
            },
            class: 'avatarbot_dcCar',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                // const cw_value = cw == '정회전' ? 1 : 0;
                // const signal = script.getNumberValue('VALUE1', script);
                let f_cw = script.getNumberValue('VALUE1', script);
                let f_speed_l = script.getNumberValue('VALUE2', script); // dc_1
                let f_speed_r = script.getNumberValue('VALUE3', script); // dc_2
                
                let b_cw = script.getNumberValue('VALUE4', script);
                let b_speed_l = script.getNumberValue('VALUE5', script); // dc_1
                let b_speed_r = script.getNumberValue('VALUE6', script); // dc_2

                // const run = script.getField('RUN');
                // const on = run == '1' ? 1 : 0;
                const time = script.getNumberValue('TIME', script);
                const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0
                
                //
                f_speed_l = Math.round(f_speed_l);
                f_speed_l = Math.max(f_speed_l, 0); 
                f_speed_l = Math.min(f_speed_l, 100);
                //
                f_speed_r = Math.round(f_speed_r);
                f_speed_r = Math.max(f_speed_r, 0); 
                f_speed_r = Math.min(f_speed_r, 100);
                //
                b_speed_l = Math.round(b_speed_l);
                b_speed_l = Math.max(b_speed_l, 0); 
                b_speed_l = Math.min(b_speed_l, 100);
                //
                b_speed_r = Math.round(b_speed_r);
                b_speed_r = Math.max(b_speed_r, 0); 
                b_speed_r = Math.min(b_speed_r, 100);
                //
                let cw = [0, 0, 0, 0];
                cw[0] = f_cw;
                cw[1] = (f_cw==0)?1:0;
                cw[2] = b_cw;
                cw[3] = (b_cw==0)?1:0;
                
                let index = Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = f_speed_l&0xff;
                
                index = 2 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = f_speed_r&0xff;
                
                index = 4 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = b_speed_l&0xff;
                
                index = 6 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = b_speed_r&0xff;

                for (let i = 0; i < 4; i++) { // 0 ~ 3
                    Entry.avatarbot.dc_m_index[i] += 1; // 0 ~ 3 => 1 ~ 4
                    if(Entry.avatarbot.dc_m_index[i] > 3) 
                    {
                        Entry.avatarbot.dc_m_index[i] = 0; // 3, 4 => 0
                    }
                    
                    if(on == 0)
                    {
                        Entry.avatarbot.dc_m_index[i] = 0; // 0
                    }

                    index = (i*2) + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                    // 
                    Entry.hw.sendQueue.CMD[index] = (on + (cw[i]<<1) + (Entry.avatarbot.dc_m_index[i]<<2) + (time<<4))&0xff; // ch en
                }
                //
                // Entry.hw.sendQueue.CMD[index+1] = speed&0xff;
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.dc_car(%1, %2, %3, %4, %5, %6, %7)',
                        blockType: 'param',
                        textParams: [
                            // front
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_DC_CAR_F, '0'],
	                        		[Lang.template.avatarbot_DC_CAR_B, '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            // back
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_DC_CAR_F, '0'],
	                        		[Lang.template.avatarbot_DC_CAR_B, '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            // on/off - timer
                            {
                                type: 'Block',
                                accept: 'string',
                            },

                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_line_car_ir_init: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['30'],
                    },
                    {
                        type: 'number',
                        params: ['30'],
                    },
                ],
                type: 'avatarbot_line_car_ir_init',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'avatarbot_LineCar',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                let ir1 = script.getNumberValue('VALUE1', script);
                let ir2 = script.getNumberValue('VALUE2', script);
                
                let result = ir1;
                result = Math.min(100, result);
                result = Math.max(0, result);
                Entry.avatarbot.dc_lineCar_ir_index[0] = Math.round(result*4095/100); // 0 ~ 100 -> 0 ~ 4095
                //
                result = ir2;
                result = Math.min(100, result);
                result = Math.max(0, result);
                Entry.avatarbot.dc_lineCar_ir_index[1] = Math.round(result*4095/100); // 0 ~ 100 -> 0 ~ 4095
                
                // ir adc sensor on
                // Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC] = 1;
                // Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC + 1] = 1;
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.dc_lineCar_ir_init(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_line_car_motor_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_DC_LINECAR_DETECTION_BOTH, '0'],
                        [Lang.template.avatarbot_DC_LINECAR_DETECTION_LEFT, '1'],
                        [Lang.template.avatarbot_DC_LINECAR_DETECTION_RIGHT, '2'],
                        [Lang.template.avatarbot_DC_LINECAR_DETECTION_NONE, '3'],
                    ],
                    value: '0',
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
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'avatarbot_line_car_motor_init',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'avatarbot_LineCar',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                //
                let i = 0;
                let result = 0;
                let speed = [0, 0, 0, 0];
                
                let type = script.getNumberValue('VALUE1', script);
                speed[0] = script.getNumberValue('VALUE2', script); // f_speed_l
                speed[1] = script.getNumberValue('VALUE3', script); // f_speed_r
                speed[2] = script.getNumberValue('VALUE4', script); // b_speed_l
                speed[3] = script.getNumberValue('VALUE5', script); // b_speed_r
                
                let index = type*4; // type = 0 ~ 3 => 0, 4, 8, 12+a
                for(i=0; i<4; i++)
                {
                    result = speed[i];
                    result = Math.min(100, result);
                    result = Math.max(0, result);
                    Entry.avatarbot.dc_lineCar_index[index+i] = result;
                } 
                //
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.dc_lineCar_motor_init(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_DC_LINECAR_DETECTION_BOTH, '0'],
                                    [Lang.template.avatarbot_DC_LINECAR_DETECTION_LEFT, '1'],
                                    [Lang.template.avatarbot_DC_LINECAR_DETECTION_RIGHT, '2'],
                                    [Lang.template.avatarbot_DC_LINECAR_DETECTION_NONE, '3'],
                                ],
                                value: '0',
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
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_line_car: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_off, '0'],
                        [Lang.template.avatarbot_func_on, '1'],
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
                    null,
                ],
                type: 'avatarbot_line_car',
            },
            paramsKeyMap: {
                VALUE1: 0
            },
            class: 'avatarbot_LineCar',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                //
                const lineCar_On = script.getNumberValue('VALUE1', script);
                
                if(lineCar_On == 0)
                {
                    // stop ir adc sensor
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC] = 0;
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC + 1] = 0;
                    
                    // stop motor
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.DC_M] = (0)&0xff; // ch en
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.DC_M + 2] = (0)&0xff; // ch en
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.DC_M + 4] = (0)&0xff; // ch en
                    Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.DC_M + 6] = (0)&0xff; // ch en

                    Entry.hw.update();
                    return script.callReturn();
                }

                let i = 0;
                let ir_index =[0, 0];
                let ir_sensorData = [0, 0];
                ir_index[0] = Entry.avatarbot.BoardFunType.ADC;
                ir_index[1] = Entry.avatarbot.BoardFunType.ADC + 2;
                for(i=0; i<2; i++)
                {
                    let sensorData_low = Entry.hw.portData.CMD[ir_index[i] + 6]; // low
                    let sensorData_high = Entry.hw.portData.CMD[ir_index[i] + 7]<<8; // high
                    ir_sensorData[i] = sensorData_low + sensorData_high;
                }

                // lineCar ir init 에서 on
                Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC] = 1;
                Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.ADC + 1] = 1;
                //
                const time = 2; // default time set.
                const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0

                let f_cw = 0; // 0 = front, 1 = back
                let b_cw = 0; // 0 = front, 1 = back

                let f_speed_l = 0;
                let f_speed_r = 0;
                let b_speed_l = 0;
                let b_speed_r = 0;
                
                if(ir_sensorData[0] > Entry.avatarbot.dc_lineCar_ir_index[0] && ir_sensorData[1] > Entry.avatarbot.dc_lineCar_ir_index[1])
                {
                    // 라인 감지
                    f_cw = 0;
                    b_cw = 0;
                    f_speed_l = Entry.avatarbot.dc_lineCar_index[0];
                    f_speed_r = Entry.avatarbot.dc_lineCar_index[1];
                    b_speed_l = Entry.avatarbot.dc_lineCar_index[2];
                    b_speed_r = Entry.avatarbot.dc_lineCar_index[3];
                }else if(ir_sensorData[0] > Entry.avatarbot.dc_lineCar_ir_index[0]){
                    // 왼쪽 센서 감지
                    f_cw = 0;
                    b_cw = 0;
                    f_speed_l = Entry.avatarbot.dc_lineCar_index[4];
                    f_speed_r = Entry.avatarbot.dc_lineCar_index[5];
                    b_speed_l = Entry.avatarbot.dc_lineCar_index[6];
                    b_speed_r = Entry.avatarbot.dc_lineCar_index[7];
                }else if(ir_sensorData[1] > Entry.avatarbot.dc_lineCar_ir_index[1]){
                    // 오른쪽 센서 감지
                    f_cw = 0;
                    b_cw = 0;
                    f_speed_l = Entry.avatarbot.dc_lineCar_index[8];
                    f_speed_r = Entry.avatarbot.dc_lineCar_index[9];
                    b_speed_l = Entry.avatarbot.dc_lineCar_index[10];
                    b_speed_r = Entry.avatarbot.dc_lineCar_index[11];
                }else{
                    // 라인을 잃음.
                    f_cw = 0;
                    b_cw = 0;
                    f_speed_l = Entry.avatarbot.dc_lineCar_index[12];
                    f_speed_r = Entry.avatarbot.dc_lineCar_index[13];
                    b_speed_l = Entry.avatarbot.dc_lineCar_index[14];
                    b_speed_r = Entry.avatarbot.dc_lineCar_index[15];
                }

                // 백터
                let cw = [0, 0, 0, 0];
                cw[0] = f_cw;
                cw[1] = (f_cw==0)?1:0;
                cw[2] = b_cw;
                cw[3] = (b_cw==0)?1:0;

                // speed setting. base = 160
                let index = Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = f_speed_l&0xff;
                
                index = 2 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = f_speed_r&0xff;
                
                index = 4 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = b_speed_l&0xff;
                
                index = 6 + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                Entry.hw.sendQueue.CMD[index+1] = b_speed_r&0xff;

                // dc motor run
                for (let i = 0; i < 4; i++) { // 0 ~ 3
                    Entry.avatarbot.dc_m_index[i] += 1; // 0 ~ 3 => 1 ~ 4
                    if(Entry.avatarbot.dc_m_index[i] > 3) 
                    {
                        Entry.avatarbot.dc_m_index[i] = 0; // 3, 4 => 0
                    }
                    
                    if(on == 0)
                    {
                        Entry.avatarbot.dc_m_index[i] = 0; // 0
                    }

                    index = (i*2) + Entry.avatarbot.BoardFunType.DC_M; // base+0,2,4,6
                    // 
                    Entry.hw.sendQueue.CMD[index] = (on + (cw[i]<<1) + (Entry.avatarbot.dc_m_index[i]<<2) + (time<<4))&0xff; // ch en
                }
                //
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.dc_lineCar(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_off, '0'],
                                    [Lang.template.avatarbot_func_on, '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
       	//---------------------------------------------------------------
        avatarbot_buzzer_sample: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                /*
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                */
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    // null,
                    {
                        type: 'avatarbot_get_buzzer_time_number', // 0 ~ 4s
                    },
                ],
                type: 'avatarbot_buzzer_sample',
            },
            paramsKeyMap: {
                // PORT: 0,
                // VALUE: 0,
                // RUN:0,
                TIME:0,
            },
            class: 'avatarbot_buzzer',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                let index = Entry.avatarbot.BoardFunType.Buzzer;
                /*
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;
                */
                const time = script.getNumberValue('TIME', script);
                const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0
                
                Entry.avatarbot.buzzer_index += 1;
                if(Entry.avatarbot.buzzer_index > 7)
                {
                    Entry.avatarbot.buzzer_index = 0;
                }
                
                if(on == 0)
                {
                    Entry.avatarbot.buzzer_index = 0;
                }
                
                // digital setting
                // Entry.hw.sendQueue.CMD[index] = on; // 1; // buzzer en
                Entry.hw.sendQueue.CMD[index] = on + (Entry.avatarbot.buzzer_index<<1) + (time<<4); // 1; // buzzer en
                Entry.hw.sendQueue.CMD[index+1] = 1; // buzzer sample
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.buzzer_sample()',
                        textParams: [
                            /*
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            */
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            // skeleton: 'basic',
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
                /*
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                */
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_buzzer_tone_number',
                    },
                    {
                        type: 'avatarbot_get_buzzer_time_number', // 0 ~ 4s
                    },
                    // null,
                ],
                type: 'avatarbot_buzzer',
            },
            paramsKeyMap: {
                VALUE1: 0,
                // VALUE2: 1,
                TIME: 1,
                // RUN: 2,

            },
            class: 'avatarbot_buzzer',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                const tone = script.getNumberValue('VALUE1');
                /*
                const time = script.getNumberValue('VALUE2');
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;
                */
                const time = script.getNumberValue('TIME', script);
                const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0
                
                Entry.avatarbot.buzzer_index += 1;
                if(Entry.avatarbot.buzzer_index > 7)
                {
                    Entry.avatarbot.buzzer_index = 0;
                }
                
                if(on == 0)
                {
                    Entry.avatarbot.buzzer_index = 0;
                }
                
                let index = Entry.avatarbot.BoardFunType.Buzzer;
                // digital setting
                Entry.hw.sendQueue.CMD[index] = on + (Entry.avatarbot.buzzer_index<<1) + (time<<4); // 1; // buzzer en
                Entry.hw.sendQueue.CMD[index+1] = 0; // buzzer sample
                Entry.hw.sendQueue.CMD[index+2] = tone; // tone0
                // Entry.hw.sendQueue.CMD[index+3] = 0; // tone1
                // Entry.hw.sendQueue.CMD[index+4] = 0; // tone2
                // Entry.hw.sendQueue.CMD[index+5] = 0; // tone3
                Entry.hw.sendQueue.CMD[index+6] = time; // time0
                // Entry.hw.sendQueue.CMD[index+7] = 0; // time1
                // Entry.hw.sendQueue.CMD[index+8] = 0; // time2
                // Entry.hw.sendQueue.CMD[index+9] = 0; // time3
                Entry.hw.update();
                
                return script.callReturn();
                // return tone;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_buzzer(%1 %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            /*
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            */
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        /*
        avatarbot_led_strip: {
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
                        type: 'avatarbot_text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'avatarbot_led_strip',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'avatarbot_led',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 10);
                // Entry.hw.setDigitalPortValue(port, value);
                
                let index = Entry.avatarbot.BoardFunType.LED_Strip;
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = value; // sample 0, 1~other...
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_led_strip(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        */
        //---------------------------------------------------------------
        avatarbot_led_strip_sample: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'avatarbot_led_strip_sample',
            },
            paramsKeyMap: {
                RUN: 0,
            },
            class: 'avatarbot_led',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                let index = Entry.avatarbot.BoardFunType.LED_Strip;
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;

                Entry.hw.sendQueue.CMD[index] = on; // 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = 1; // 0 : not run, sample 1, 1~other...
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_led_strip_sample()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_led_strip_set: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_text',
                        params: ['64'],
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['64'],
                    },
                ],
                type: 'avatarbot_led_strip_set',
            },
            paramsKeyMap: {
                VALUE1: 0,
             	VALUE2: 1,
            },
            class: 'avatarbot_led',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                let value = script.getNumberValue('VALUE1'); // led number
                let brightness = script.getNumberValue('VALUE2'); // brighteness
                value = Math.round(value);
                value = Math.max(value, 1);
                value = Math.min(value, 100);
                //
                brightness = Math.round(brightness);
                brightness = Math.max(brightness, 0);
                brightness = Math.min(brightness, 100);
                // Entry.hw.setDigitalPortValue(port, value);
                
                let index = Entry.avatarbot.BoardFunType.LED_Strip;
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = 0; // sample 0, 1~other...
                Entry.hw.sendQueue.CMD[index+2] = value;
                Entry.hw.sendQueue.CMD[index+7] = brightness;
                Entry.hw.sendQueue.CMD[index+8] = 1; // setting enable.
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_led_strip_set(%1 %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_led_strip_indexOn: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_text',
                        params: ['0'],
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['255'],
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['255'],
                    },
                    {
                        type: 'avatarbot_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'avatarbot_led_strip_indexOn',
            },
            paramsKeyMap: {
                VALUE1: 0,
             	VALUE2: 1,
                VALUE3: 2,
             	VALUE4: 3,
                RUN: 4,
            },
            class: 'avatarbot_led_indexOn',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }

                //
                let i = 0;
                let ledNum = script.getNumberValue('VALUE1'); // led number
                let ledRGB = [0,0,0];
                ledRGB[0] = script.getNumberValue('VALUE2'); // Red
                ledRGB[1] = script.getNumberValue('VALUE3'); // Green
                ledRGB[2] = script.getNumberValue('VALUE4'); // Blue
                let on = script.getNumberValue('RUN', script);
                //
                ledNum = Math.round(ledNum);
                ledNum = Math.max(ledNum, 0);
                ledNum = Math.min(ledNum, 99);
                
                if(on == 1)
                {
                    for(i=0; i<3; i++)
                    {
                        ledRGB[i] = Math.round(ledRGB[i]);
                        ledRGB[i] = Math.max(ledRGB[i], 0);
                        ledRGB[i] = Math.min(ledRGB[i], 255);
                    }    
                }else{
                    ledRGB[0] = 0;
                    ledRGB[1] = 0;
                    ledRGB[2] = 0;
                }
                
                //
                let index = Entry.avatarbot.BoardFunType.LED_Strip;
                
                Entry.hw.sendQueue.CMD[index] = 1; // 1; // led strip on
                Entry.hw.sendQueue.CMD[index+1] = 2; // sample type 2
                Entry.hw.sendQueue.CMD[index+3] = ledNum; // led number.
                Entry.hw.sendQueue.CMD[index+4] = ledRGB[0]; // red
                Entry.hw.sendQueue.CMD[index+5] = ledRGB[1]; // green
                Entry.hw.sendQueue.CMD[index+6] = ledRGB[2]; // blue
                
                Entry.hw.update();
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_led_strip_indexOn(%1 %2 %3 %4 %5)',
                        textParams: [
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
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_mpu6050: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Acceleration', '0'],
                        ['Rotation', '1'],
                        ['Temperature', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
            	params: [
                    null,
                ],
                type: 'avatarbot_get_mpu6050', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE: 0,
            },
            class: 'avatarbot_mpu',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
	            // 해당 값을 getField, getValue로 가져오고
	            // 가져 올때 paramsKeyMap에서
	            // 정의한 VALUE라는 키값으로 데이터를 가져옵니다.
                // const signal = script.getValue('VALUE', script);
                // return Entry.hw.getAnalogPortValue(signal[1]);
                const type = script.getNumberValue('VALUE', script);
                let index = Entry.avatarbot.BoardFunType.MPU6050_1;
                // 가속도 값
                let acceleration_x = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let acceleration_y = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                let acceleration_z = ((Entry.hw.portData.CMD[index+5]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+5]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+6]>9)?"":"0") + Entry.hw.portData.CMD[index+6];
                let temperature = ((Entry.hw.portData.CMD[index+7]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+7]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+8]>9)?"":"0") + Entry.hw.portData.CMD[index+8];
                //
                index = Entry.avatarbot.BoardFunType.MPU6050_2;
                // 회전값
                let rotation_x = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let rotation_y = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                let rotation_z = ((Entry.hw.portData.CMD[index+5]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+5]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+6]>9)?"":"0") + Entry.hw.portData.CMD[index+6];
                
                // let mpu6050 = `Acceleration X: ${acceleration_x}, Y: ${acceleration_y}, Z: ${acceleration_z} m/s^2\nRotation X: ${rotation_x}, Y: ${rotation_y}, Z: ${rotation_z} rad/s\nTemperature: ${temperature} degC`;
				let mpu6050 = "";
				if(type == 0){
					mpu6050 = `Acceleration X: ${acceleration_x}, Y: ${acceleration_y}, Z: ${acceleration_z} m/s^2`;
				}else if(type == 1){
					mpu6050 = `Rotation X: ${rotation_x}, Y: ${rotation_y}, Z: ${rotation_z} rad/s`;
				}else if(type == 2){
					mpu6050 = `Temperature: ${temperature} degC`;
				}
				
                // 
                index = Entry.avatarbot.BoardFunType.MPU6050_1;
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.update();
                
                return mpu6050;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_mpu6050()',
                        blockType: 'param',
                        textParams: [
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_get_mpu6050_detail: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Acceleration', '0'],
                        ['Rotation', '1'],
                        // ['Temperature', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['x', '0'],
                        ['y', '1'],
                        ['z', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
            	params: [
                    null,
                ],
                type: 'avatarbot_get_mpu6050_detail', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE1: 0,
                VALUE2: 1,
                
            },
            class: 'avatarbot_mpu',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
	            // 해당 값을 getField, getValue로 가져오고
	            // 가져 올때 paramsKeyMap에서
	            // 정의한 VALUE라는 키값으로 데이터를 가져옵니다.
                // const signal = script.getValue('VALUE', script);
                // return Entry.hw.getAnalogPortValue(signal[1]);
                const type = script.getNumberValue('VALUE1', script);
                let index = Entry.avatarbot.BoardFunType.MPU6050_1;
                // 가속도 값
                let acceleration_x = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let acceleration_y = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                let acceleration_z = ((Entry.hw.portData.CMD[index+5]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+5]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+6]>9)?"":"0") + Entry.hw.portData.CMD[index+6];
                // let temperature = ((Entry.hw.portData.CMD[index+7]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+7]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+8]>9)?"":"0") + Entry.hw.portData.CMD[index+8];
                //
                index = Entry.avatarbot.BoardFunType.MPU6050_2;
                // 회전값
                let rotation_x = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let rotation_y = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                let rotation_z = ((Entry.hw.portData.CMD[index+5]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+5]&0x7f) +"."+ ((Entry.hw.portData.CMD[index+6]>9)?"":"0") + Entry.hw.portData.CMD[index+6];
                
                // let mpu6050 = `Acceleration X: ${acceleration_x}, Y: ${acceleration_y}, Z: ${acceleration_z} m/s^2\nRotation X: ${rotation_x}, Y: ${rotation_y}, Z: ${rotation_z} rad/s\nTemperature: ${temperature} degC`;
				let mpu6050 = "";
                const unit = script.getNumberValue('VALUE2', script);

				if(type == 0){
					// mpu6050 = `Acceleration X: ${acceleration_x}, Y: ${acceleration_y}, Z: ${acceleration_z} m/s^2`;
                    if(unit == 0)
                    {
                        mpu6050 = `${acceleration_x}`;
                    }else if(unit == 1){
                        mpu6050 = `${acceleration_y}`;
                    }else if(unit == 2){
                        mpu6050 = `${acceleration_z}`;
                    }
				}else if(type == 1){
					// mpu6050 = `Rotation X: ${rotation_x}, Y: ${rotation_y}, Z: ${rotation_z} rad/s`;
                    if(unit == 0)
                    {
                        mpu6050 = `${rotation_x}`;
                    }else if(unit == 1){
                        mpu6050 = `${rotation_y}`;
                    }else if(unit == 2){
                        mpu6050 = `${rotation_z}`;
                    }
				}else if(type == 2){
					// mpu6050 = `Temperature: ${temperature} degC`;
				}
				
                // 
                index = Entry.avatarbot.BoardFunType.MPU6050_1;
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.update();
                
                return mpu6050;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_mpu6050_detail(%1, %2)',
                        blockType: 'param',
                        textParams: [
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_ultra_sonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
                params: [
                    {
                        type: 'avatarbot_get_port_number', // 상단 func 가져와서 사용.
                    },
                ],
                type: 'avatarbot_ultra_sonic', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE: 0,
            },
            class: 'avatarbot_sonic',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
	            // 해당 값을 getField, getValue로 가져오고
	            // 가져 올때 paramsKeyMap에서
	            // 정의한 VALUE라는 키값으로 데이터를 가져옵니다.
                const signal = script.getNumberValue('VALUE');
                let index = (signal*5) + Entry.avatarbot.BoardFunType.ULTRA_SONIC;
                let cm = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"." + ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let inch = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"." + ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.update();
                
                let sonic = `${cm} cm, ${inch} inch`;
                return sonic;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_ultra_sonic(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
       	//---------------------------------------------------------------
           avatarbot_ultra_sonic_detail: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['cm', '0'],
                        ['inch', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
                params: [
                    {
                        type: 'avatarbot_get_port_number', // 상단 func 가져와서 사용.
                    },
                    null
                ],
                type: 'avatarbot_ultra_sonic_detail', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'avatarbot_sonic',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
	            // 해당 값을 getField, getValue로 가져오고
	            // 가져 올때 paramsKeyMap에서
	            // 정의한 VALUE라는 키값으로 데이터를 가져옵니다.
                const signal = script.getNumberValue('VALUE1');
                let index = (signal*5) + Entry.avatarbot.BoardFunType.ULTRA_SONIC;
                let cm = ((Entry.hw.portData.CMD[index+1]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+1]&0x7f) +"." + ((Entry.hw.portData.CMD[index+2]>9)?"":"0") + Entry.hw.portData.CMD[index+2];
                let inch = ((Entry.hw.portData.CMD[index+3]&0x80)==0?"":"-") + (Entry.hw.portData.CMD[index+3]&0x7f) +"." + ((Entry.hw.portData.CMD[index+4]>9)?"":"0") + Entry.hw.portData.CMD[index+4];
                
                Entry.hw.sendQueue.CMD[index] = 1; // ch en
                Entry.hw.sendQueue.CMD[index+1] = Entry.hw.portData.CMD[index+1];
                Entry.hw.sendQueue.CMD[index+2] = Entry.hw.portData.CMD[index+2];
                Entry.hw.sendQueue.CMD[index+3] = Entry.hw.portData.CMD[index+3];
                Entry.hw.sendQueue.CMD[index+4] = Entry.hw.portData.CMD[index+4];
                Entry.hw.update();
                //
                let sonic = ``;
                const type = script.getNumberValue('VALUE2', script);
                if(type == 0){
					sonic = `${cm}`;
				}else if(type == 1){
					sonic = `${inch}`;
				}
                
                return sonic;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_ultra_sonic_detail(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
       	//---------------------------------------------------------------
        avatarbot_ir_receiver: {
            color: EntryStatic.colorSet.block.default.HARDWARE, //블록 색상
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, //경계선 색상
            fontColor: '#fff', // 폰트색상 basic_string_field는 기본 색상이 검정색(#000) 입니다.
            skeleton: 'basic_string_field', // 블록 모양 정의
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['기본', '0'],
                        ['상세', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: { // 보여질 블록 정의
            	// def의 params의 경우는 초기값을 지정할수 있습니다.
            	// TextInput의 경우에도 def > params을 통해 값을 지정할수 있습니다.
                params: [
                    null,
                ],
                type: 'avatarbot_ir_receiver', // func name
            },
            paramsKeyMap: { // 파라미터를 사용 할때 쓰는 Key값 정의
                VALUE: 0,
            },
            class: 'avatarbot_ir_receiver_data',
            isNotFor: ['avatarbot'],
            func(sprite, script) { // 블록 기능정의
            	if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                // let sensorData = Entry.hw.portData.CMD[Entry.avatarbot.BoardFunType.Button+1] == 0 ? 0 : 1;
                // Entry.hw.sendQueue.CMD[Entry.avatarbot.BoardFunType.Button+1] = 0;
                // Entry.hw.update();
            	// return sensorData;
                //---
                // 해당 값을 getField, getValue로 가져오고
	            // 가져 올때 paramsKeyMap에서
	            // 정의한 VALUE라는 키값으로 데이터를 가져옵니다.
                // const signal = script.getValue('VALUE', script);
                // return Entry.hw.getAnalogPortValue(signal[1]);
                const type = script.getNumberValue('VALUE', script);

                let index = Entry.avatarbot.BoardFunType.IR_Remote;
                // data list
                let ir_flag = Entry.hw.portData.CMD[index+0]; // 0 or 1
                let ir_value = Entry.hw.portData.CMD[index+1]; // 0 or 1
                let ir_repeat = Entry.hw.portData.CMD[index+2]; // 0 or 1
                let ir_address = Entry.hw.portData.CMD[index+3]; // 0 or 1
                let ir_command = Entry.hw.portData.CMD[index+4]; // 0 or 1

                let ir_raw_data = 0x00000000; // unsigned int
                ir_raw_data = Entry.hw.portData.CMD[index+5]; // unsigned int
                ir_raw_data += (Entry.hw.portData.CMD[index+6]<<8);     
                ir_raw_data += (Entry.hw.portData.CMD[index+7]<<16);
                ir_raw_data += (Entry.hw.portData.CMD[index+8]<<24);
                
                // let mpu6050 = `Acceleration X: ${acceleration_x}, Y: ${acceleration_y}, Z: ${acceleration_z} m/s^2\nRotation X: ${rotation_x}, Y: ${rotation_y}, Z: ${rotation_z} rad/s\nTemperature: ${temperature} degC`;
				
                let ir_revicer = "";
                if(ir_flag == 1)
                {
                    if(type == 1)
                    {
                        ir_revicer = `장치(${ir_address}), 값(${ir_command}), `;
                    } 

                    switch(ir_value)
                    {
                        case 0: // power
                            ir_revicer += `전원`;
                            break;
                        case 1: // up
                            ir_revicer += `위`;
                            break;
                        case 2: // down
                            ir_revicer += `아래`;
                            break;
                        case 3: // left
                            ir_revicer += `왼쪽`;
                            break;
                        case 4: // right
                            ir_revicer += `오른쪽`;
                            break;
                        case 5: // ok
                            ir_revicer += `ok`;
                            break;
                        case 6: // *
                            ir_revicer += `*`;
                            break;
                        case 7: // #
                            ir_revicer += `#`;
                            break;
                        case 8: // nb0
                            ir_revicer += `0`;
                            break;
                        case 9: // 1
                            ir_revicer += `1`;
                            break;
                        case 10:// 2
                            ir_revicer += `2`;
                            break;
                        case 11: // 3
                            ir_revicer += `3`;
                            break;
                        case 12: // 4s
                            ir_revicer += `4`;
                            break;
                        case 13: // 5
                            ir_revicer += `5`;
                            break;
                        case 14: // 6
                            ir_revicer += `6`;
                            break;
                        case 15: // 7
                            ir_revicer += `7`;
                            break;
                        case 16: // 8
                            ir_revicer += `8`;
                            break;
                        case 17: // 9
                            ir_revicer += `9`;
                            break;
                        default:
                            break;        
                    }
                }
                
                Entry.hw.sendQueue.CMD[index] = 0; // flag clear x -> 0
                Entry.hw.update();
                return ir_revicer;

            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.get_ir_receiver()',
                        blockType: 'param',
                        textParams: [
                        ],
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        avatarbot_oled_sample: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.template.avatarbot_func_on, '1'],
                        [Lang.template.avatarbot_func_off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
               /*
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                */
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avatarbot_get_oled_number',
                    },
                    /*
                    {
                        type: 'avatarbot_get_timer_number',
                    },
                    */
                ],
                type: 'avatarbot_oled_sample',
            },
            paramsKeyMap: {
                VALUE1: 0,
                RUN: 1,
                // TIME: 1,
            },
            class: 'avatarbot_oled',
            isNotFor: ['avatarbot'],
            func(sprite, script) {
				if (!Entry.hw.sendQueue.CMD) {
                    Entry.avatarbot.dataTableReset();
                }
                
                const sample = script.getNumberValue('VALUE1', script);
                const run = script.getField('RUN');
                const on = run == '1' ? 1 : 0;
                // const time = script.getNumberValue('TIME', script);
                // const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0

                let index = Entry.avatarbot.BoardFunType.OLED;

                Entry.hw.sendQueue.CMD[index] = on; // 1; // ch en + ch time
                Entry.hw.sendQueue.CMD[index+1] = sample; // 0 : not run, sample 1~n
                Entry.hw.update();
                
                return script.callReturn();

                /*
                if (!script.isStart) {
                    const sample = script.getNumberValue('VALUE1', script);
                    // const run = script.getField('RUN');
                    // const on = run == '1' ? 1 : 0;
                    const time = script.getNumberValue('TIME', script);
                    const on = time>0? 1:0; // 100ms ~ 1s = 1, 0ms = 0

                    let index = Entry.avatarbot.BoardFunType.OLED;

                    Entry.hw.sendQueue.CMD[index] = on + (time<<1); // 1; // ch en + ch time
                    Entry.hw.sendQueue.CMD[index+1] = sample; // 0 : not run, sample 1~n
                    Entry.hw.update();
                    if(time == 0)
                    {
                        return script.callReturn;
                    }
                    var duration = time;
                    duration = duration * 100;
                    script.isStart = true;
                    script.timeFlag = 1;

                    
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;

                    let index = Entry.avatarbot.BoardFunType.OLED;
                    Entry.hw.sendQueue.CMD[index] = 0; // 1; // ch en + ch time
                    Entry.hw.sendQueue.CMD[index+1] = 0; // 0 : not run, sample 1~n
                    Entry.hw.update();
                    return script.callReturn();
                }
                */
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avatarbot.set_oled_sample(%1 %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.template.avatarbot_func_on, '1'],
                                    [Lang.template.avatarbot_func_off, '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            
                           /*
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            */
                        ],
                        
                    },
                ],
            },
        },
        //---------------------------------------------------------------
        //endregion avatarbot 아두이노
        //---------------------------------------------------------------
    };
};

// 엔트리에서 하드웨어 블록 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.avatarbot;
