'use strict';
import _range from 'lodash/range';
import DataTable from '../../../class/DataTable';
import entryModuleLoader from '../../../class/entryModuleLoader';
import metadata from '../hardwareLite/metadata_whalesbot_drone_lite.json';

Entry.WhalesbotEagle1001 = {
    id: '62.1',
    name: 'whalesbot_eagle_1001',
    url: '',
    imageName: '',
    title: {
        ko: 'Whalesbot Eagle 1001',
        en: '웨일스봇 Eagle 1001',
    },
    simulatorPopup: null,
    unsupportBlockExist: false,
    setZero: function () { },
    sendCmd(msgString) {
        let sq = Entry.hw.sendQueue;
        sq['cmd'] = msgString;
        Entry.hw.update();
        delete sq['cmd'];
    },
    invalidParamValue: false,

    exportProject() {
        let project = {};

        project.objects = Entry.container.toJSON();
        const objects = project.objects;
        project.scenes = Entry.scene.toJSON();
        project.variables = Entry.variableContainer.getVariableJSON();
        project.messages = Entry.variableContainer.getMessageJSON();
        project.functions = Entry.variableContainer.getFunctionJSON();
        project.tables = DataTable.getTableJSON();
        project.speed = Entry.FPS;
        project.interface = Entry.captureInterfaceState();
        project.expansionBlocks = Entry.expansionBlocks;
        project.aiUtilizeBlocks = Entry.aiUtilizeBlocks;
        project.hardwareLiteBlocks = Entry.hardwareLiteBlocks;
        project.learning = Entry.aiLearning?.toJSON();
        project.externalModules = entryModuleLoader.moduleList;
        project.externalModulesLite = entryModuleLoader.moduleListLite;

        if (!objects || !objects.length) {
            return false;
        }

        return project;
    }
};

Entry.WhalesbotEagle1001.setLanguage = function () {
    return {
        ko: {
            template: {
                whalesbot_eagle_1001_openning_3d_simulator: '3D 시뮬레이터를 엽니 다',
                whalesbot_eagle_1001_clean: '삭제',
                whalesbot_eagle_1001_restart: '재시작',
                whalesbot_eagle_1001_get_status: '상태 가져오기',
                whalesbot_eagle_1001_entering_pitch_mode: '준비모드 시작하기',
                whalesbot_eagle_1001_exit_pitch_mode: '준비모드 끝내기',
                whalesbot_eagle_1001_automatic_take_off_height: '자동 이륙 높이 %1 cm',
                whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset: '자동 이륙 고도 %1 cm 속도 %2 X 오프셋 %3 도 Y 오프셋 %4 도 으로 이동하기',
                whalesbot_eagle_1001_automatic_landing: '드론착륙',
                whalesbot_eagle_1001_automatic_descent_speed_offset: '자동 낙하 속도 %1 X 오프셋 %2 도 Y 오프셋 %3 도',
                whalesbot_eagle_1001_set_the_flight_speed: '설정된 비행 속도는 %1 cm/s',
                whalesbot_eagle_1001_get_setting_speed: '설정 속도 가져오기',
                whalesbot_eagle_1001_rise: '위로 %1 cm',
                whalesbot_eagle_1001_down: '아래로 %1 cm',
                whalesbot_eagle_1001_fly_forward: '앞으로 %1 cm',
                whalesbot_eagle_1001_fly_backward: '뒤로 %1 cm',
                whalesbot_eagle_1001_fly_left: '왼쪽으로 %1 cm',
                whalesbot_eagle_1001_fly_right: '오른쪽으로 %1 cm',
                whalesbot_eagle_1001_turn_left: '왼쪽으로 회전 %1 °',
                whalesbot_eagle_1001_turn_right: '오른쪽으로 회전 %1 °',
                whalesbot_eagle_1001_fly_in_the_specified_direction: '속도 %1 , 방향 %2 으로이동하기',
                whalesbot_eagle_1001_flight_designated: '지정된 거리를 비행합니다 x %1 cm y %2 cm z%3 cm 속도 %4 cm/s',
                whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control: '리모컨 4개 채널 설정 Pitch %1 Roll %2 Throttle %3 Yaw %4',
                whalesbot_eagle_1001_stop_moving_and_hover: '호버링기능',
                whalesbot_eagle_1001_hover_at_specified_altitude: '지정된 높이에 서스펜션 %1 cm',
                whalesbot_eagle_1001_emergency_stop: '긴급정지',
                whalesbot_eagle_1001_set_the_steering_gear: '스티어링기어 ID 설정 포트 %1 속도 %2 각도 %3',
                whalesbot_eagle_1001_execute_script: '스크립트 실행',
                // light & speaker blocks
                whalesbot_eagle_1001_ls_debug_value: '센서 값 확인 %1 %2',
                whalesbot_eagle_1001_ls_display_symbol: '도트매트릭스 %1 포트 %2',
                whalesbot_eagle_1001_ls_off_LED: '표현스크린 닫기 포트 %1',
                whalesbot_eagle_1001_ls_display_digital_tube: '디지털튜브 포트 %1 %2',
                whalesbot_eagle_1001_ls_display_digital_tube_score: '디지털튜브에 점수 표시 포트 %1 %2 : %3',
                whalesbot_eagle_1001_ls_off_digital_tube: '디지털튜브 닫기 포트 %1',
                whalesbot_eagle_1001_ls_set_RGB: 'LED색상설정 포트 %1 색상 R %2 G %3 B %4',
                whalesbot_eagle_1001_ls_fly_RGB: 'Led 조명인가요? %1',
                whalesbot_eagle_1001_ls_set_DO: '전자석 포트 %1 %2',
                whalesbot_eagle_1001_ls_execute_script: '동작 없이 스크립트 실행',
                // sensors
                whalesbot_eagle_1001_ss_fly_state_POS_Z: '비행 고도 cm',
                whalesbot_eagle_1001_ss_fly_state_LASER: '동체 내부 레이저 거리 측정 cm',
                whalesbot_eagle_1001_ss_battery_voltage: '배터리 전압 (V)',
                whalesbot_eagle_1001_ss_fly_state_STATE_TEMP: '메인보드 온도 (°)',
                whalesbot_eagle_1001_ss_attitude_angle: '자세각 %1 (°)',
                whalesbot_eagle_1001_ss_flight_angular_velocity: '비행각속도 %1 cm/s',
                whalesbot_eagle_1001_ss_flight_acceleration: '비행 가속도 %1 (1g)',
                whalesbot_eagle_1001_ss_optical_flow: '광류 %1 (cm)',
                whalesbot_eagle_1001_ss_get_infrared_distance: '적외선센 포트 %1 값',
                whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool: '적외선센서 포트 %1 장애물 감지',
                whalesbot_eagle_1001_ss_obstacle_infrared_detected_string: '적외선센서 포트 %1 장애물 감지',
                whalesbot_eagle_1001_ss_human_infrared_value_bool: '인체 감지 센서 포트 %1 사람을 감지하다',
                whalesbot_eagle_1001_ss_human_infrared_value_string: '인체 감지 센서 포트 %1 사람을 감지하다',
                whalesbot_eagle_1001_ss_AI: '아날로그 입력 포트 %1 값',
                whalesbot_eagle_1001_ss_get_ultrasonic_distance: '초음파센서 포트 %1 거리 강지 cm',
                whalesbot_eagle_1001_ss_get_ambient_light: '조도센서 입력 포트 %1 값',
                whalesbot_eagle_1001_ss_get_temperature: '온도 센서 포트 %1 °C',
                whalesbot_eagle_1001_ss_get_humidity: '습도 센서 포트 %1 값 %',
                whalesbot_eagle_1001_ss_get_flame: '불꽃센서 포트 %1 값',
                whalesbot_eagle_1001_ss_get_gesture: '동작인식 포트 %1',
                whalesbot_eagle_1001_ss_get_tof: '레이저 거리 측정 포트 %1',
                whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE: '레이저 높이 %1',
                whalesbot_eagle_1001_ss_get_bt_remote_control: '리모콘 버튼 %1 값',
                whalesbot_eagle_1001_ss_seconds: '현재 타이머 값',
                whalesbot_eagle_1001_ss_resettime: '타이머 재설정',
            },
            Device: {
                whalesbot_eagle_1001: 'whalesbot_eagle_1001',
            },
            Menus: {
                whalesbot_eagle_1001: 'WhalesbotEagle1001',
            },
            Blocks: {
                light_speaker: {
                    electro_magnet: { absorption: '붙다', break_off: '떨어지다' },
                },
                sensor: {
                    attitude_angle: { pitch: 'Pitch', roll: 'Roll', yaw: 'Yaw' },
                    laser_height_determination: { on: 'On', off: 'Off' },
                    remote_control_button: { key: 'Key', left_rocker_x: 'Left rocker X', left_rocker_y: 'Left rocker Y', right_rocker_x: 'Right rocker X', right_rocker_y: 'Right rocker Y' },
                },
                whalesbot_eagle_1001_toast_status_title: "드론 상태",
                whalesbot_eagle_1001_toast_prepare_download: "다운로드 준비...",
                whalesbot_eagle_1001_toast_downloading_code: "코드 다운로드...",
                whalesbot_eagle_1001_toast_download_success: "다운로드 코드가 성공했습니다",
                whalesbot_eagle_1001_toast_download_failed: "다운로드 코드가 실패했습니다",
                whalesbot_eagle_1001_toast_clean_failed: "깨끗한 코드가 실패했습니다",
                whalesbot_eagle_1001_toast_clean_success: "깨끗한 코드 성공",
                whalesbot_eagle_1001_toast_unsupport_block_title: "지원되지 않는 블록",
                whalesbot_eagle_1001_toast_unsupport_block_msg: "하드웨어에서는 일부 블록이 지원되지 않습니다"
            }
        },
        en: {
            template: {
                whalesbot_eagle_1001_openning_3d_simulator: 'Open 3D Simulator',
                whalesbot_eagle_1001_clean: 'Clean',
                whalesbot_eagle_1001_restart: 'Restart',
                whalesbot_eagle_1001_get_status: 'Get Status',
                whalesbot_eagle_1001_entering_pitch_mode: 'Entering Pitch Mode',
                whalesbot_eagle_1001_exit_pitch_mode: 'Exit Pitch Mode',
                whalesbot_eagle_1001_automatic_take_off_height: 'Automatic Take Off Height %1 cm',
                whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset: 'Automatic Take Off Altitude %1 cm, Speed %2, X offset %3 degree, Y offset %4 degree',
                whalesbot_eagle_1001_automatic_landing: 'Automatic Landing',
                whalesbot_eagle_1001_automatic_descent_speed_offset: 'Automatic Descent Speed %1, X offset %2 degree, Y offset %3 degree',
                whalesbot_eagle_1001_set_the_flight_speed: 'Set The Flight Speed To %1 cm/s',
                whalesbot_eagle_1001_get_setting_speed: 'Get Setting Speed',
                whalesbot_eagle_1001_rise: 'Rise %1 cm',
                whalesbot_eagle_1001_down: 'Down %1 cm',
                whalesbot_eagle_1001_fly_forward: 'Fly Forward %1 cm',
                whalesbot_eagle_1001_fly_backward: 'Fly Backward %1 cm',
                whalesbot_eagle_1001_fly_left: 'Fly Left %1 cm',
                whalesbot_eagle_1001_fly_right: 'Fly Right %1 cm',
                whalesbot_eagle_1001_turn_left: 'Turn Left %1 °',
                whalesbot_eagle_1001_turn_right: 'Turn Right %1 °',
                whalesbot_eagle_1001_fly_in_the_specified_direction: 'Fly In The Specified Direction Speed %1 cm/s Direction %2 °',
                whalesbot_eagle_1001_flight_designated: 'Flight Designated Distance X %1 cm Y %2 cm Z %3 cm Speed %4 cm/s',
                whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control: 'Set The Four Channel Lever Quantity Of Remote Control Pitch %1° Roll %2° Throttle %3° Roll %4°',
                whalesbot_eagle_1001_stop_moving_and_hover: 'Stop Moving And Hover',
                whalesbot_eagle_1001_hover_at_specified_altitude: 'Hover At a Specified Altitude %1 cm',
                whalesbot_eagle_1001_emergency_stop: 'Emergency Stop',
                whalesbot_eagle_1001_set_the_steering_gear: 'Set The Steering Gear Port %1 Speed %2 cm/s Angle %3 °',
                whalesbot_eagle_1001_execute_script: 'Execute Script',
                // light & speaker blocks
                whalesbot_eagle_1001_ls_debug_value: 'Debugging: Data %1 %2',
                whalesbot_eagle_1001_ls_display_symbol: 'Emotion screen symbols %1 port %2',
                whalesbot_eagle_1001_ls_off_LED: 'Clear emotion screen port %1',
                whalesbot_eagle_1001_ls_display_digital_tube: 'Digital tube port %1 %2',
                whalesbot_eagle_1001_ls_display_digital_tube_score: 'Digital tube score display port %1 %2 : %3',
                whalesbot_eagle_1001_ls_off_digital_tube: 'Clear digital tube port %1',
                whalesbot_eagle_1001_ls_set_RGB: 'Set LED lights port %1 color R %2 G %3 B %4',
                whalesbot_eagle_1001_ls_fly_RGB: 'Airborne lighting %1',
                whalesbot_eagle_1001_ls_set_DO: 'Electromagnet port %1 %2',
                whalesbot_eagle_1001_ls_execute_script: 'Execute Script Without Motion',
                // sensors
                whalesbot_eagle_1001_ss_fly_state_POS_Z: 'Flight attitude cm',
                whalesbot_eagle_1001_ss_fly_state_LASER: 'Laser ranging inside the fuselage cm',
                whalesbot_eagle_1001_ss_battery_voltage: 'Battery voltage (V)',
                whalesbot_eagle_1001_ss_fly_state_STATE_TEMP: 'Main board temperature (°C)',
                whalesbot_eagle_1001_ss_attitude_angle: 'Attitude angle %1 (°)',
                whalesbot_eagle_1001_ss_flight_angular_velocity: 'Flight angular velocity %1 cm/s',
                whalesbot_eagle_1001_ss_flight_acceleration: 'Flight acceleration %1 (1g)',
                whalesbot_eagle_1001_ss_optical_flow: 'Optical flow %1 (cm)',
                whalesbot_eagle_1001_ss_get_infrared_distance: 'Infrared ranging sensor port %1 value',
                whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool: 'Infrared port %1 obstacle detected',
                whalesbot_eagle_1001_ss_obstacle_infrared_detected_string: 'Infrared port %1 obstacle detected',
                whalesbot_eagle_1001_ss_human_infrared_value_bool: 'Human infrared sensor port %1 detects a person',
                whalesbot_eagle_1001_ss_human_infrared_value_string: 'Human infrared sensor port %1 detects a person',
                whalesbot_eagle_1001_ss_AI: 'Analog input port %1 value',
                whalesbot_eagle_1001_ss_get_ultrasonic_distance: 'Ultrasonic sensor port %1 detect distance cm',
                whalesbot_eagle_1001_ss_get_ambient_light: 'Ambient light port %1 value',
                whalesbot_eagle_1001_ss_get_temperature: 'Temperature sensor port %1 °C',
                whalesbot_eagle_1001_ss_get_humidity: 'Humidity sensor port %1 value %',
                whalesbot_eagle_1001_ss_get_flame: 'Flame sensor port %1 value',
                whalesbot_eagle_1001_ss_get_gesture: 'Gesture recognition port %1',
                whalesbot_eagle_1001_ss_get_tof: 'Laser ranging port %1',
                whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE: 'Laser height determination %1',
                whalesbot_eagle_1001_ss_get_bt_remote_control: 'Remote control button %1 value',
                whalesbot_eagle_1001_ss_seconds: 'current timer value',
                whalesbot_eagle_1001_ss_resettime: 'Reset timer',
            },
            Device: {
                whalesbot_eagle_1001: 'whalesbot_eagle_1001',
            },
            Menus: {
                whalesbot_eagle_1001: 'WhalesbotEagle1001',
            },
            Blocks: {
                light_speaker: {
                    electro_magnet: { absorption: 'Absorption', break_off: 'Break off' },
                },
                sensor: {
                    attitude_angle: { pitch: 'Pitch', roll: 'Roll', yaw: 'Yaw' },
                    laser_height_determination: { on: 'On', off: 'Off' },
                    remote_control_button: { key: 'Key', left_rocker_x: 'Left rocker X', left_rocker_y: 'Left rocker Y', right_rocker_x: 'Right rocker X', right_rocker_y: 'Right rocker Y' },
                },
                whalesbot_eagle_1001_toast_status_title: "Drone Status",
                whalesbot_eagle_1001_toast_prepare_download: "Prepare Downloading...",
                whalesbot_eagle_1001_toast_downloading_code: "Downloading Code...",
                whalesbot_eagle_1001_toast_download_success: "Download Code Successed",
                whalesbot_eagle_1001_toast_download_failed: "Download code failed",
                whalesbot_eagle_1001_toast_clean_failed: "Clean code failed",
                whalesbot_eagle_1001_toast_clean_success: "Clean code success",
                whalesbot_eagle_1001_toast_unsupport_block_title: "Unsupport Block",
                whalesbot_eagle_1001_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
            }
        },
    };
};

Entry.WhalesbotEagle1001.blockMenuBlocks = [
    // 'whalesbot_eagle_1001_openning_3d_simulator',
    'whalesbot_eagle_1001_entering_pitch_mode',
    'whalesbot_eagle_1001_exit_pitch_mode',
    'whalesbot_eagle_1001_automatic_take_off_height',
    'whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset',
    'whalesbot_eagle_1001_automatic_landing',
    'whalesbot_eagle_1001_automatic_descent_speed_offset',
    'whalesbot_eagle_1001_set_the_flight_speed',
    'whalesbot_eagle_1001_get_setting_speed',
    'whalesbot_eagle_1001_rise',
    'whalesbot_eagle_1001_down',
    'whalesbot_eagle_1001_fly_forward',
    'whalesbot_eagle_1001_fly_backward',
    'whalesbot_eagle_1001_fly_left',
    'whalesbot_eagle_1001_fly_right',
    'whalesbot_eagle_1001_turn_left',
    'whalesbot_eagle_1001_turn_right',
    'whalesbot_eagle_1001_fly_in_the_specified_direction',
    'whalesbot_eagle_1001_flight_designated',
    'whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control',
    'whalesbot_eagle_1001_stop_moving_and_hover',
    'whalesbot_eagle_1001_hover_at_specified_altitude',
    'whalesbot_eagle_1001_emergency_stop',
    'whalesbot_eagle_1001_set_the_steering_gear',
    'whalesbot_eagle_1001_execute_script',
    'whalesbot_eagle_1001_clean',
    'whalesbot_eagle_1001_restart',
    'whalesbot_eagle_1001_get_status',
    // light & speaker blocks
    'whalesbot_eagle_1001_ls_debug_value',
    'whalesbot_eagle_1001_ls_display_symbol',
    'whalesbot_eagle_1001_ls_off_LED',
    'whalesbot_eagle_1001_ls_display_digital_tube',
    'whalesbot_eagle_1001_ls_display_digital_tube_score',
    'whalesbot_eagle_1001_ls_off_digital_tube',
    'whalesbot_eagle_1001_ls_set_RGB',
    'whalesbot_eagle_1001_ls_fly_RGB',
    // 'whalesbot_eagle_1001_ls_set_DO',
    // 'whalesbot_eagle_1001_ls_execute_script',
    // sensors
    'whalesbot_eagle_1001_ss_fly_state_POS_Z',
    'whalesbot_eagle_1001_ss_fly_state_LASER',
    'whalesbot_eagle_1001_ss_battery_voltage',
    'whalesbot_eagle_1001_ss_fly_state_STATE_TEMP',
    'whalesbot_eagle_1001_ss_attitude_angle',
    'whalesbot_eagle_1001_ss_flight_angular_velocity',
    'whalesbot_eagle_1001_ss_flight_acceleration',
    'whalesbot_eagle_1001_ss_optical_flow',
    'whalesbot_eagle_1001_ss_get_infrared_distance',
    'whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool',
    // 'whalesbot_eagle_1001_ss_obstacle_infrared_detected_string',
    // 'whalesbot_eagle_1001_ss_human_infrared_value_bool',
    // 'whalesbot_eagle_1001_ss_human_infrared_value_string',
    'whalesbot_eagle_1001_ss_AI',
    // 'whalesbot_eagle_1001_ss_get_ultrasonic_distance',
    'whalesbot_eagle_1001_ss_get_ambient_light',
    // 'whalesbot_eagle_1001_ss_get_temperature',
    // 'whalesbot_eagle_1001_ss_get_humidity',
    // 'whalesbot_eagle_1001_ss_get_flame',
    // 'whalesbot_eagle_1001_ss_get_gesture',
    // 'whalesbot_eagle_1001_ss_get_tof',
    // 'whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE',
    // 'whalesbot_eagle_1001_ss_get_bt_remote_control',
    // 'whalesbot_eagle_1001_ss_seconds',
    // 'whalesbot_eagle_1001_ss_resettime',
];

// 블록 생성
Entry.WhalesbotEagle1001.getBlocks = function () {
    const blockColors = {
        color: {
            light_speaker: '#5b90ff',
            sensor: '#8066f9'
        },
        outerLine: {
            light_speaker: '#2b6eff',
            sensor: '#8a6bf0'
        },
    }

    const notificationType = {
        "SUCCESS": "success",
        "UNSUPPORTED": "unsupported",
        "ALERT": "alert",
    }

    let _this = this;
    let sourceCode;

    const defaultSpeed = "10";
    const defaultAltitude = "50";
    const defaultOffset = "0";

    const wbOperators = {
        "EQUAL": "==",
        "NOT_EQUAL": "!=",
        "GREATER": ">",
        "GREATER_OR_EQUAL": ">=",
        "LESS": "<",
        "LESS_OR_EQUAL": "<=",
        "AND": "&&",
        "OR": "||",
    };

    const wbVariables = {
        'whalesbot_eagle_1001_get_setting_speed': 'fly_state(SETSPEED)',
        'whalesbot_eagle_1001_ss_fly_state_POS_Z': 'fly_state(POS_Z)',
        'whalesbot_eagle_1001_ss_fly_state_LASER': 'fly_state(LASER)',
        'whalesbot_eagle_1001_ss_battery_voltage': 'battery()',
        'whalesbot_eagle_1001_ss_fly_state_STATE_TEMP': 'fly_state(STATE_TEMP)',
        'whalesbot_eagle_1001_ss_attitude_angle': 'fly_state($VALUE)',
        'whalesbot_eagle_1001_ss_flight_angular_velocity': 'fly_state($VALUE)',
        'whalesbot_eagle_1001_ss_flight_acceleration': 'fly_state($VALUE)',
        'whalesbot_eagle_1001_ss_optical_flow': 'fly_state($VALUE)',
        'whalesbot_eagle_1001_ss_get_infrared_distance': 'get_infrared_distance($VALUE)',
        'whalesbot_eagle_1001_ss_obstacle_infrared_detected_string': 'obstacle_infrared_detected($VALUE)',
        'whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool': 'obstacle_infrared_detected($VALUE)',
        'whalesbot_eagle_1001_ss_human_infrared_value_string': 'human_infrared_value($VALUE)',
        'whalesbot_eagle_1001_ss_human_infrared_value_bool': 'human_infrared_value($VALUE)',
        'whalesbot_eagle_1001_ss_AI': 'AI($VALUE)',
        'whalesbot_eagle_1001_ss_get_ultrasonic_distance': 'get_ultrasonic_distance($VALUE)',
        'whalesbot_eagle_1001_ss_get_ambient_light': 'get_ambient_light($VALUE)',
        'whalesbot_eagle_1001_ss_get_temperature': 'get_temperature($VALUE)',
        'whalesbot_eagle_1001_ss_get_humidity': 'get_humidity($VALUE)',
        'whalesbot_eagle_1001_ss_get_flame': 'get_flame($VALUE)',
        'whalesbot_eagle_1001_ss_get_gesture': 'get_gesture($VALUE)',
        'whalesbot_eagle_1001_ss_get_tof': 'get_tof($VALUE)',
        'whalesbot_eagle_1001_ss_get_bt_remote_control': 'get_bt_remote_control($VALUE)',
        'whalesbot_eagle_1001_ss_seconds': 'seconds()',
    }

    const startBlocks = [
        "when_run_button_click",
        "when_some_key_pressed",
        "mouse_clicked",
        "mouse_click_cancled",
        "when_object_click",
        "when_object_click_canceled",
        'whalesbot_eagle_1001_execute_script',
        'whalesbot_eagle_1001_ls_debug_value',
        'whalesbot_eagle_1001_ls_display_symbol',
        'whalesbot_eagle_1001_ls_off_LED',
        'whalesbot_eagle_1001_ls_display_digital_tube',
        'whalesbot_eagle_1001_ls_display_digital_tube_score',
        'whalesbot_eagle_1001_ls_off_digital_tube',
        'whalesbot_eagle_1001_ls_set_RGB',
        'whalesbot_eagle_1001_ls_fly_RGB',
        'whalesbot_eagle_1001_ls_set_DO',
        'whalesbot_eagle_1001_ls_execute_script',
    ]

    let globlalCVariables = {}

    function _getParameter(parameter) {
        let param = parameter.params[0] != "" ? parameter.params[0] : "0"
        if (parameter.type != "text" && parameter.type != "number" && parameter.type != "get_variable") {
            let raw_param = wbVariables[parameter.type]
            param = raw_param.includes("$VALUE") ? raw_param.replace("$VALUE", parameter.params[0]) : raw_param;
        } else if (parameter.type == "get_variable") {
            param = globlalCVariables[parameter.params[0]]
        }
        return param
    }

    function _generateConditions(params) {
        let left = _getParameter(params[0])
        let operator = params[1] != undefined ? wbOperators[params[1]] : "0"
        let right = _getParameter(params[2])
        return { left, operator, right }
    }

    function generateCCode(block) {
        switch (block.type) {
            // LOOP
            case 'repeat_basic':
                let times = _getParameter(block.params[0]);
                return `\tfor(int i=0; i<${times}; ++i) {\n${block.statements[0].map((generateCCode)).join('')}\t}\n`;

            case 'repeat_inf':
                return `\twhile(1) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

            case 'repeat_while_true':
                let rpWhileDecision = {
                    "type": block.params[0].type,
                    "params": block.params[0].params,
                };
                let rpWhileMark = block.params[1] == 'until' ? '!' : '';
                return `\twhile(${rpWhileMark}(${generateCCode(rpWhileDecision)})) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

            case 'wait_second':
                let second = _getParameter(block.params[0]);
                return `\twait(${second});\n`;

            case 'wait_until_true':
                let waitUntilTrueDecision = {
                    "type": block.params[0].type,
                    "params": block.params[0].params,
                };
                return `\twhile(!(${generateCCode(waitUntilTrueDecision)})) {\n\t}\n`;

            case 'stop_repeat':
                return `\tbreak;\n`;

            // CONDITION
            case '_if':
                let ifDecision = {
                    "type": block.params[0].type,
                    "params": block.params[0].params,
                };
                return `\tif(${generateCCode(ifDecision)}) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

            case 'if_else':
                let ifElseDecision = {
                    "type": block.params[0].type,
                    "params": block.params[0].params,
                };
                return `\tif(${generateCCode(ifElseDecision)}) {\n${block.statements[0].map(generateCCode).join('')}\t} else {\n${block.statements[1].map(generateCCode).join('')}\t}\n`;

            // DECISION
            case 'boolean_and_or':
                let boolAndOrBasicLeftValue = generateCCode(block.params[0]);
                let boolAndOrBasicOperator = wbOperators[block.params[1]];
                let boolAndOrBasicRightValue = generateCCode(block.params[2]);
                return `(${boolAndOrBasicLeftValue} ${boolAndOrBasicOperator} ${boolAndOrBasicRightValue})`;

            case 'boolean_not':
                let boolNotDecision = generateCCode(block.params[1]);
                return `!(${boolNotDecision})`;

            case 'boolean_basic_operator':
                let boolBasicCondition = "0"
                if (block.params[0].params[0] != null) {
                    let boolBasicLeftValue = _generateConditions(block.params).left;
                    let boolBasicOperator = _generateConditions(block.params).operator;
                    let boolBasicRightValue = _generateConditions(block.params).right;
                    boolBasicCondition = `(${boolBasicLeftValue} ${boolBasicOperator} ${boolBasicRightValue})`;
                }
                return `${boolBasicCondition}`;

            // VARIABLE
            case 'True':
                return "1";

            case 'False':
                return "0";

            case 'set_variable':
                let variableName = globlalCVariables[block.params[0]];
                let variableValue = _getParameter(block.params[1]);
                return `\t${variableName} = ${variableValue};\n`;

            case 'change_variable':
                let changedVariableName = globlalCVariables[block.params[0]];
                let changedVariableValue = _getParameter(block.params[1]);
                return `\t${changedVariableName} += ${changedVariableValue};\n`;

            // HARDWARE
            case 'whalesbot_eagle_1001_entering_pitch_mode':
                return '\tfly_unlock();\n';

            case 'whalesbot_eagle_1001_exit_pitch_mode':
                return '\tfly_lock();\n';

            case 'whalesbot_eagle_1001_automatic_take_off_height':
                let takeOffHeight = _getParameter(block.params[0]);
                return `\tfly_start(${takeOffHeight});\n`;

            case 'whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset':
                let takeOffAltitude = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultAltitude;
                let takeOffSpeed = _getParameter(block.params[1]) != "" ? _getParameter(block.params[1]) : defaultSpeed;
                let takeOffXoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                let takeOffYoffset = (-10.00 <= _getParameter(block.params[3]) || _getParameter(block.params[3]) <= 10.00) ? _getParameter(block.params[3]) : defaultOffset;
                return `\tfly_start_2(${takeOffAltitude},${takeOffSpeed},${takeOffXoffset},${takeOffYoffset});\n`

            case 'whalesbot_eagle_1001_automatic_landing':
                return `\tfly_land();\n`;

            case 'whalesbot_eagle_1001_automatic_descent_speed_offset':
                let automaticSpeed = _getParameter(block.params[0]) != "" ? _getParameter(block.params[0]) : defaultSpeed;
                let automaticXoffset = (-10.00 <= _getParameter(block.params[1]) || _getParameter(block.params[1]) <= 10.00) ? _getParameter(block.params[1]) : defaultOffset;
                let automaticYoffset = (-10.00 <= _getParameter(block.params[2]) || _getParameter(block.params[2]) <= 10.00) ? _getParameter(block.params[2]) : defaultOffset;
                return `\tfly_land_2(${automaticSpeed},${automaticXoffset},${automaticYoffset});\n`

            case 'whalesbot_eagle_1001_set_the_flight_speed':
                let speed = _getParameter(block.params[0]);
                return `\tfly_setspeed(${speed});\n`;

            case 'whalesbot_eagle_1001_rise':
                let up = _getParameter(block.params[0]);
                return `\tfly_moveto(UP,${up});\n`;

            case 'whalesbot_eagle_1001_down':
                let down = _getParameter(block.params[0]);
                return `\tfly_moveto(DOWN,${down});\n`;

            case 'whalesbot_eagle_1001_fly_forward':
                let front = _getParameter(block.params[0]);
                return `\tfly_moveto(FRONT,${front});\n`;

            case 'whalesbot_eagle_1001_fly_backward':
                let back = _getParameter(block.params[0]);
                return `\tfly_moveto(BACK,${back});\n`;

            case 'whalesbot_eagle_1001_fly_left':
                let left = _getParameter(block.params[0]);
                return `\tfly_moveto(LEFT,${left});\n`;

            case 'whalesbot_eagle_1001_fly_right':
                let right = _getParameter(block.params[0]);
                return `\tfly_moveto(RIGHT,${right});\n`;

            case 'whalesbot_eagle_1001_turn_left':
                let turnLeft = _getParameter(block.params[0]);
                if (0 > turnLeft || turnLeft > 360) {
                    turnLeft = 360
                }
                return `\tfly_turn(CCW,${turnLeft});\n`;

            case 'whalesbot_eagle_1001_turn_right':
                let turnRight = _getParameter(block.params[0]);
                if (0 > turnRight || turnRight > 360) {
                    turnRight = 360
                }
                return `\tfly_turn(CW,${turnRight});\n`;

            case 'whalesbot_eagle_1001_fly_in_the_specified_direction':
                let dirSpeed = _getParameter(block.params[0]);
                let dirDirection = _getParameter(block.params[1]);
                if (0 > dirDirection || dirDirection > 360) {
                    dirDirection = 360
                }
                return `\tfly_dir(${dirSpeed},${dirDirection});\n`;

            case 'whalesbot_eagle_1001_flight_designated':
                let disX = _getParameter(block.params[0]);
                let disY = _getParameter(block.params[1]);
                let disZ = _getParameter(block.params[2]);
                let disSpeed = _getParameter(block.params[3]);
                return `\tfly_move_dis(${disX},${disY},${disZ},${disSpeed});\n`;

            case 'whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control':
                let pitch = _getParameter(block.params[0]);
                let roll = _getParameter(block.params[1]);
                let throttle = _getParameter(block.params[2]);
                let yaw = _getParameter(block.params[3]);
                return `\tfly_move(${pitch},${roll},${throttle},${yaw});\n`;

            case 'whalesbot_eagle_1001_stop_moving_and_hover':
                return `\tfly_hover();\n`;

            case 'whalesbot_eagle_1001_hover_at_specified_altitude':
                let hoverSpecifiedAltitude = (_getParameter(block.params[0]) == "" || _getParameter(block.params[0]) < 20) ? "20" : _getParameter(block.params[0]);
                hoverSpecifiedAltitude = (_getParameter(block.params[0]) > 200) ? "200" : _getParameter(block.params[0]);
                return `\tfly_hover_laser(${hoverSpecifiedAltitude});\n`;

            case 'whalesbot_eagle_1001_emergency_stop':
                return `\tfly_lock();\n`;

            case 'whalesbot_eagle_1001_set_the_steering_gear':
                let servoSpeed = _getParameter(block.params[1]);
                let servoAngle = _getParameter(block.params[2]);
                if (0 > servoAngle || servoAngle > 360) {
                    servoAngle = 360
                }
                return `\tSetServo(P2,${servoSpeed},${servoAngle});\n`;

            // light & speaker blocks
            case 'whalesbot_eagle_1001_ls_debug_value':
                let lsDebugValue1 = _getParameter(block.params[0]);
                let lsDebugValue2 = _getParameter(block.params[1]);
                return `\tDebugValue(${lsDebugValue1}, ${lsDebugValue2});\n`;

            case 'whalesbot_eagle_1001_ls_display_symbol':
                let lsDisplaySymbol = block.params[0];
                let lsDisplaySymbolPort = block.params[1];
                return `\tdisplay_symbol(${lsDisplaySymbolPort}, ${lsDisplaySymbol});\n`;

            case 'whalesbot_eagle_1001_ls_off_LED':
                let lsOffLedPort = block.params[0];
                return `\toff_LED(${lsOffLedPort});\n`;

            case 'whalesbot_eagle_1001_ls_display_digital_tube':
                let lsDisplayDigitalTubePort = block.params[0];
                let lsDisplayDigitalTubeValue = _getParameter(block.params[1]);
                return `\tdisplay_digital_tube(${lsDisplayDigitalTubePort}, ${lsDisplayDigitalTubeValue});\n`;

            case 'whalesbot_eagle_1001_ls_display_digital_tube_score':
                let lsDisplayDigitalTubeScorePort = block.params[0];
                let lsDisplayDigitalTubeScoreValue1 = _getParameter(block.params[1]);
                let lsDisplayDigitalTubeScoreValue2 = _getParameter(block.params[2]);
                return `\tdisplay_digital_tube_score(${lsDisplayDigitalTubeScorePort}, ${lsDisplayDigitalTubeScoreValue1}, ${lsDisplayDigitalTubeScoreValue2});\n`;

            case 'whalesbot_eagle_1001_ls_off_digital_tube':
                let lsOffDigitalTubePort = block.params[0];
                return `\toff_digital_tube(${lsOffDigitalTubePort});\n`;

            case 'whalesbot_eagle_1001_ls_set_RGB':
                let lsSetRGBPort = block.params[0];
                let lsSetRGBR = _getParameter(block.params[1]);
                let lsSetRGBG = _getParameter(block.params[2]);
                let lsSetRGBB = _getParameter(block.params[3]);
                return `\tset_RGB(${lsSetRGBPort}, ${lsSetRGBR}, ${lsSetRGBG}, ${lsSetRGBB});\n`;

            case 'whalesbot_eagle_1001_ls_fly_RGB':
                let lsFlyRGB = block.params[0];
                // let lsFlyRGBR = _getParameter(block.params[1]);
                // let lsFlyRGBG = _getParameter(block.params[2]);
                // let lsFlyRGBB = _getParameter(block.params[3]);
                return `\tfly_RGB(${lsFlyRGB});\n`;

            case 'whalesbot_eagle_1001_ls_set_DO':
                let lsSetDOPort = block.params[0];
                let lsSetDOValue = block.params[1];
                return `\tSetDO(${lsSetDOPort}, ${lsSetDOValue});\n`;

            // sensors
            case 'whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE':
                let ssFlySetpointToggle = block.params[0];
                return `\tfly_setpoint(LASER_ENABLE, ${ssFlySetpointToggle});\n`;

            case 'whalesbot_eagle_1001_ss_resettime':
                return `\tresettime();\n`;

            case 'whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool':
                let ssBbstacleInfraredDetectedBool = block.params[0];
                return `obstacle_infrared_detected(${ssBbstacleInfraredDetectedBool})`;

            default:
                if (!startBlocks.includes(block.type)) {
                    // console.log("unsupport block: " + block.type);
                    _this.unsupportBlockExist = true;
                }
                return '';
        }
    }

    function setUpCVariables(variable) {
        if (variable.visible) {
            const varName = `var_${variable.name}`
            globlalCVariables[variable.id] = varName
            const varValue = variable.value;
            return `float ${varName} = ${varValue};\n`
        }
        return ""
    }

    function openedSimulatorPopup() {
        if (_this.simulatorPopup == null) {
            return false;
        }
        return !_this.simulatorPopup.closed;
    }

    function notify(type, msg) {
        switch (type) {
            case notificationType["SUCCESS"]:
                Entry.toast.success(
                    Lang.Blocks.whalesbot_mc_102_toast_success_title,
                    msg
                );
                break;
            default:
                Entry.toast.alert(
                    Lang.Blocks.whalesbot_mc_102_toast_alert_title,
                    msg
                );
        }
    }

    return {
        whalesbot_eagle_1001_openning_3d_simulator: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
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
                type: 'whalesbot_eagle_1001_openning_3d_simulator',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                const width = window.innerWidth * 0.8;
                const height = window.innerHeight * 0.8;
                _this.simulatorPopup = window.open(
                    metadata.simulator_url,
                    'DroneSimulatorPopup',
                    `width=${width},height=${height}`
                );
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_openning_3d_simulator()'] },
        },
        whalesbot_eagle_1001_restart: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_restart',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                _this.sendCmd('restartCode');
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_restart()'] },
        },
        whalesbot_eagle_1001_clean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_clean',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                _this.sendCmd('stopCode');
                Entry.toast.success(
                    Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                    Lang.Blocks.whalesbot_eagle_1001_toast_clean_success
                );
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_clean()'] },
        },
        whalesbot_eagle_1001_get_status: {
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
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_get_status',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                _this.sendCmd('get_status');
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_get_status()'] },
        },
        whalesbot_eagle_1001_entering_pitch_mode: {
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
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_entering_pitch_mode',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_entering_pitch_mode");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_entering_pitch_mode()'] },
        },
        whalesbot_eagle_1001_exit_pitch_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
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
                type: 'whalesbot_eagle_1001_exit_pitch_mode',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                const project = _this.exportProject();
                const listVariables = project.variables;
                const rawScript = project.objects[0].script;
                const allScript = JSON.parse(rawScript);
                const droneScript = allScript.filter((arr) => arr.length > 2);

                let sourceCode = `#include "whalesbot.h"\n${listVariables.map(setUpCVariables).join('')}\nvoid user_main() {\n`;
                sourceCode += `${droneScript[0].map(generateCCode).join('')}}\n\nuser_main();`;

                if (_this.unsupportBlockExist) {
                    Entry.toast.alert(
                        Lang.Blocks.whalesbot_eagle_1001_toast_unsupport_block_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_unsupport_block_msg
                    )
                    _this.unsupportBlockExist = false;
                    Entry.engine.toggleStop();
                    return;
                }

                if (_this.invalidParamValue) {
                    _this.invalidParamValue = false;
                    return;
                }

                if (openedSimulatorPopup()) {
                    Entry.toast.success(
                        Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                    );
                    return;
                }

                console.log(sourceCode);

                _this.sendCmd(sourceCode);

                Entry.toast.success(
                    Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                    Lang.Blocks.whalesbot_eagle_1001_toast_prepare_download
                );
                setTimeout(() => {
                    Entry.toast.success(
                        Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_downloading_code
                    );
                    setTimeout(() => {
                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                        );
                    }, 3000);
                }, 4000);
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_exit_pitch_mode()'] },
        },
        whalesbot_eagle_1001_automatic_take_off_height: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_automatic_take_off_height',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_automatic_take_off_height")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_automatic_take_off_height();'] },
        },
        whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset: {
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
            ],
            events: {},
            def: {
                params: [
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset',
            },
            paramsKeyMap: {
                altitude: 0,
                speed: 1,
                x: 2,
                y: 3,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset();'] },
        },
        whalesbot_eagle_1001_automatic_landing: {
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
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_automatic_landing',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_automatic_landing")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_automatic_landing()'] },
        },
        whalesbot_eagle_1001_automatic_descent_speed_offset: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
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
                type: 'whalesbot_eagle_1001_automatic_descent_speed_offset',
            },
            paramsKeyMap: {
                speed: 0,
                x: 1,
                y: 2,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_automatic_descent_speed_offset")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_automatic_descent_speed_offset()'] },
        },
        whalesbot_eagle_1001_set_the_flight_speed: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'whalesbot_eagle_1001_set_the_flight_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_set_the_flight_speed")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_set_the_flight_speed()'] },
        },
        whalesbot_eagle_1001_get_setting_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_get_setting_speed',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_get_setting_speed");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_get_setting_speed()'] },
        },
        whalesbot_eagle_1001_rise: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_rise',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_rise");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_rise();'] },
        },
        whalesbot_eagle_1001_down: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_down',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_down");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_down();'] },
        },
        whalesbot_eagle_1001_fly_forward: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_fly_forward',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_fly_forward");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_fly_forward();'] },
        },
        whalesbot_eagle_1001_fly_backward: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_fly_backward',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_fly_backward");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_fly_backward();'] },
        },
        whalesbot_eagle_1001_fly_left: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_fly_left',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_fly_left");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_fly_left();'] },
        },
        whalesbot_eagle_1001_fly_right: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'whalesbot_eagle_1001_fly_right',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_fly_right");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_fly_right();'] },
        },
        whalesbot_eagle_1001_turn_left: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['90'],
                    },
                ],
                type: 'whalesbot_eagle_1001_turn_left',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_turn_left");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_turn_left();'] },
        },
        whalesbot_eagle_1001_turn_right: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['90'],
                    },
                ],
                type: 'whalesbot_eagle_1001_turn_right',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_turn_right");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_turn_right();'] },
        },
        whalesbot_eagle_1001_fly_in_the_specified_direction: {
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
                        params: ['0'],
                    },
                ],
                type: 'whalesbot_eagle_1001_fly_in_the_specified_direction',
            },
            paramsKeyMap: {
                speed: 0,
                direction: 1,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_fly_in_the_specified_direction");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_fly_in_the_specified_direction();'] },
        },
        whalesbot_eagle_1001_flight_designated: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['30'],
                    },
                ],
                type: 'whalesbot_eagle_1001_flight_designated',
            },
            paramsKeyMap: {
                x: 0,
                y: 1,
                z: 2,
                speed: 3,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_flight_designated");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_flight_designated();'] },
        },
        whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control',
            },
            paramsKeyMap: {
                pitch: 0,
                roll: 1,
                throttle: 2,
                yaw: 3,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control();'] },
        },
        whalesbot_eagle_1001_stop_moving_and_hover: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'whalesbot_eagle_1001_stop_moving_and_hover',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_stop_moving_and_hover");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_stop_moving_and_hover();'] },
        },
        whalesbot_eagle_1001_hover_at_specified_altitude: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['20'],
                    },
                ],
                type: 'whalesbot_eagle_1001_hover_at_specified_altitude',
            },
            paramsKeyMap: {
                altitude: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_hover_at_specified_altitude");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_hover_at_specified_altitude();'] },
        },
        whalesbot_eagle_1001_emergency_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_emergency_stop',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_emergency_stop")
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_emergency_stop()'] },
        },
        whalesbot_eagle_1001_set_the_steering_gear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P2', 'P2'],
                    ],
                    value: 'P2',
                    fontSize: 10,
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
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                ],
                type: 'whalesbot_eagle_1001_set_the_steering_gear',
            },
            paramsKeyMap: {
                port: 0,
                speed: 1,
                angle: 2,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                // console.log("whalesbot_eagle_1001_set_the_steering_gear");
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_set_the_steering_gear();'] },
        },
        whalesbot_eagle_1001_execute_script: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_execute_script',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                if (openedSimulatorPopup()) {
                    _this.simulatorPopup.postMessage({
                        script: sourceCode
                    }, '*');
                    return;
                }
                _this.sendCmd('runCode');
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_execute_script()'] },
        },

        // light & speaker blocks
        whalesbot_eagle_1001_ls_debug_value: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
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
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: [''],
                    },
                ],
                type: 'whalesbot_eagle_1001_ls_debug_value',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var value1 = Number(script.values[0]);
                var value2 = Number(script.values[1]);
                if (value1 < 1 || value1 > 6) {
                    notify(notificationType.ALERT, 'Debugging: Data [1 ~ 6] and [0 ~ 999999]')
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (value2 < 0 || value2 > 999999) {
                    notify(notificationType.ALERT, 'Debugging: Data [1 ~ 6] and [0 ~ 999999]')
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_debug_value()'] },
        },

        whalesbot_eagle_1001_ls_display_symbol: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['?', 'LED_symbol_question_mark'], ['!', 'LED_symbol_exclamation'], ['$', 'LED_symbol_dollar'], ['¥', 'LED_symbol_RMB'],
                        ['=', 'LED_symbol_equal'], ['+', 'LED_symbol_plus'], ['-', 'LED_symbol_minus'], ['x', 'LED_symbol_multiplied'],
                        ['÷', 'LED_symbol_divided'], ['0', 'LED_symbol_0'], ['1', 'LED_symbol_1'], ['2', 'LED_symbol_2'],
                        ['3', 'LED_symbol_3'], ['4', 'LED_symbol_4'], ['5', 'LED_symbol_5'], ['6', 'LED_symbol_6'],
                        ['7', 'LED_symbol_7'], ['8', 'LED_symbol_8'], ['9', 'LED_symbol_9'], ['A', 'LED_symbol_A'],
                        ['B', 'LED_symbol_B'], ['C', 'LED_symbol_C'], ['D', 'LED_symbol_D'], ['E', 'LED_symbol_E'],
                        ['F', 'LED_symbol_F'], ['G', 'LED_symbol_G'], ['H', 'LED_symbol_H'], ['I', 'LED_symbol_I'],
                        ['J', 'LED_symbol_J'], ['K', 'LED_symbol_K'], ['L', 'LED_symbol_L'], ['M', 'LED_symbol_M'],
                        ['N', 'LED_symbol_N'], ['O', 'LED_symbol_O'], ['P', 'LED_symbol_P'], ['Q', 'LED_symbol_Q'],
                        ['R', 'LED_symbol_R'], ['S', 'LED_symbol_S'], ['T', 'LED_symbol_T'], ['U', 'LED_symbol_U'],
                        ['V', 'LED_symbol_V'], ['W', 'LED_symbol_W'], ['X', 'LED_symbol_X'], ['Y', 'LED_symbol_Y'],
                        ['Z', 'LED_symbol_Z'], ['❤︎', 'LED_symbol_big_heart'], ['♥︎', 'LED_symbol_little_heart'], ['↑', 'LED_symbol_forward'],
                        ['↓', 'LED_symbol_backward'], ['←', 'LED_symbol_turnleft'], ['→', 'LED_symbol_turnright'], ['GO', 'LED_symbol_GO'],
                        ['⊘', 'LED_symbol_stop'],
                    ],
                    value: 'LED_symbol_question_mark',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'whalesbot_eagle_1001_ls_display_symbol',
            },
            paramsKeyMap: {
                SYMBOLS: 0,
                PORT: 1,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_display_symbol()'] },
        },

        whalesbot_eagle_1001_ls_off_LED: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ls_off_LED',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_off_LED()'] },
        },

        whalesbot_eagle_1001_ls_display_digital_tube: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        params: [''],
                    },
                ],
                type: 'whalesbot_eagle_1001_ls_display_digital_tube',
            },
            paramsKeyMap: {
                PORT: 0,
                NUMBER: 1,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var number = Number(script.values[1]);
                if (number < 0 || number > 9999) {
                    notify(notificationType.ALERT, '0 ~ 9999')
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_display_digital_tube()'] },
        },

        whalesbot_eagle_1001_ls_display_digital_tube_score: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
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
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: [''],
                    },
                    {
                        type: 'number',
                        params: [''],
                    },
                ],
                type: 'whalesbot_eagle_1001_ls_display_digital_tube_score',
            },
            paramsKeyMap: {
                PORT: 0,
                NUMBER1: 1,
                NUMBER2: 2,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var number1 = Number(script.values[1]);
                var number2 = Number(script.values[2]);
                if (number1 < 0 || number1 > 9999 || number2 < 0 || number2 > 9999) {
                    notify(notificationType.ALERT, '0 ~ 9999')
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_display_digital_tube_score()'] },
        },

        whalesbot_eagle_1001_ls_off_digital_tube: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ls_off_digital_tube',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_off_digital_tube()'] },
        },

        whalesbot_eagle_1001_ls_set_RGB: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
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
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                ],
                type: 'whalesbot_eagle_1001_ls_set_RGB',
            },
            paramsKeyMap: {
                PORT: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var red = Number(script.values[1]);
                var green = Number(script.values[2]);
                var blue = Number(script.values[3]);
                if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
                    notify(notificationType.ALERT, '0 ~ 255')
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_set_RGB()'] },
        },

        whalesbot_eagle_1001_ls_fly_RGB: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['⚪', 'color_white'], ['🟡', 'color_yellow'],
                        ['🟣', 'color_purple'], ['🟦', 'color_cyan'],
                        ['🔴', 'color_red'], ['🟢', 'color_green'],
                        ['🔵', 'color_blue'], ['⚫', 'color_black'],
                    ],
                    value: 'color_white',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ls_fly_RGB',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_fly_RGB()'] },
        },

        whalesbot_eagle_1001_ls_set_DO: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.light_speaker.electro_magnet.absorption, 'true'],
                        [Lang.Blocks.light_speaker.electro_magnet.break_off, 'false']
                    ],
                    value: 'true',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'whalesbot_eagle_1001_ls_set_DO',
            },
            paramsKeyMap: {
                PORT: 0,
                ELECTROMAGNET: 1,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_set_DO()'] },
        },

        whalesbot_eagle_1001_ls_execute_script: {
            color: blockColors.color.light_speaker,
            outerLine: blockColors.outerLine.light_speaker,
            fontColor: '#fff',
            skeleton: 'basic_without_next',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ls_execute_script',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_eagle_1001_ls',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                const project = _this.exportProject();
                const listVariables = project.variables;
                const rawScript = project.objects[0].script;
                const allScript = JSON.parse(rawScript);
                const droneScript = allScript.filter((arr) => arr.length > 2);

                let sourceCode = `#include "whalesbot.h"\n${listVariables.map(setUpCVariables).join('')}\nvoid user_main() {\n`;
                sourceCode += `${droneScript[0].map(generateCCode).join('')}}\n\nuser_main();`;

                if (_this.unsupportBlockExist) {
                    Entry.toast.alert(
                        Lang.Blocks.whalesbot_eagle_1001_toast_unsupport_block_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_unsupport_block_msg
                    )
                    _this.unsupportBlockExist = false;
                    Entry.engine.toggleStop();
                    return;
                }

                if (_this.invalidParamValue) {
                    _this.invalidParamValue = false;
                    return;
                }

                if (openedSimulatorPopup()) {
                    Entry.toast.success(
                        Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                    );
                    return;
                }

                console.log(sourceCode);

                _this.sendCmd(sourceCode);

                Entry.toast.success(
                    Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                    Lang.Blocks.whalesbot_eagle_1001_toast_prepare_download
                );
                setTimeout(() => {
                    Entry.toast.success(
                        Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                        Lang.Blocks.whalesbot_eagle_1001_toast_downloading_code
                    );
                    setTimeout(() => {
                        Entry.toast.success(
                            Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                            Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                        );
                    }, 3000);
                }, 4000);
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ls_execute_script()'] },
        },

        // sensors
        whalesbot_eagle_1001_ss_fly_state_POS_Z: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_fly_state_POS_Z',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var posZ = Entry.hw.portData.state_position_z || '0';
                return posZ;
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_fly_state_POS_Z()'] },
        },

        whalesbot_eagle_1001_ss_fly_state_LASER: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_fly_state_LASER',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var Laser = Entry.hw.portData.LaserTof || '0';
                return Laser;
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_fly_state_LASER()'] },
        },

        whalesbot_eagle_1001_ss_battery_voltage: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_battery_voltage',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var Battery = Entry.hw.portData.Battery || '0';
                return Battery;
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_battery_voltage()'] },
        },

        whalesbot_eagle_1001_ss_fly_state_STATE_TEMP: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_fly_state_STATE_TEMP',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var state = Entry.hw.portData.SPL06_temp || '0';
                return state;
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_fly_state_STATE_TEMP()'] },
        },

        whalesbot_eagle_1001_ss_attitude_angle: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.sensor.attitude_angle.pitch, 'STATE_PITCH'],
                        [Lang.Blocks.sensor.attitude_angle.roll, 'STATE_ROLL'],
                        [Lang.Blocks.sensor.attitude_angle.yaw, 'STATE_YAW'],
                    ],
                    value: 'STATE_PITCH',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_attitude_angle',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var state = script.values[0];
                if (state === 'STATE_PITCH') {
                    return Entry.hw.portData.Pitch || '0';
                } else if (state === 'STATE_ROLL') {
                    return Entry.hw.portData.Roll || '0';
                } else if (state === 'STATE_YAW') {
                    return Entry.hw.portData.Yaw || '0';
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_attitude_angle()'] },
        },

        whalesbot_eagle_1001_ss_flight_angular_velocity: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', 'GYPO_X'], ['Y', 'GYPO_Y'], ['Z', 'GYPO_Z'],
                    ],
                    value: 'GYPO_X',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_flight_angular_velocity',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var state = script.values[0];
                if (state === 'GYPO_X') {
                    return Entry.hw.portData.Gypo_x || '0';
                } else if (state === 'GYPO_Y') {
                    return Entry.hw.portData.Gypo_y || '0';
                } else if (state === 'GYPO_Z') {
                    return Entry.hw.portData.Gypo_z || '0';
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_flight_angular_velocity()'] },
        },

        whalesbot_eagle_1001_ss_flight_acceleration: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', 'ACC_X'], ['Y', 'ACC_Y'], ['Z', 'ACC_Z'],
                    ],
                    value: 'ACC_X',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_flight_acceleration',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
                var state = script.values[0];
                if (state === 'ACC_X') {
                    return Entry.hw.portData.ACC_x || '0';
                } else if (state === 'ACC_Y') {
                    return Entry.hw.portData.ACC_y || '0';
                } else if (state === 'ACC_Z') {
                    return Entry.hw.portData.ACC_z || '0';
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_flight_acceleration()'] },
        },

        whalesbot_eagle_1001_ss_optical_flow: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', 'OPX'], ['Y', 'OPY']
                    ],
                    value: 'OPX',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_optical_flow',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_optical_flow()'] },
        },

        whalesbot_eagle_1001_ss_get_infrared_distance: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_infrared_distance',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_infrared_distance()'] },
        },

        whalesbot_eagle_1001_ss_obstacle_infrared_detected_string: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_obstacle_infrared_detected_string',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_obstacle_infrared_detected_string()'] },
        },

        whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_obstacle_infrared_detected_bool()'] },
        },

        whalesbot_eagle_1001_ss_human_infrared_value_string: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_human_infrared_value_string',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_human_infrared_value_string()'] },
        },

        whalesbot_eagle_1001_ss_human_infrared_value_bool: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_human_infrared_value_bool',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_human_infrared_value_bool()'] },
        },

        whalesbot_eagle_1001_ss_AI: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_AI',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_AI()'] },
        },

        whalesbot_eagle_1001_ss_get_ultrasonic_distance: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_ultrasonic_distance',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_ultrasonic_distance()'] },
        },

        whalesbot_eagle_1001_ss_get_ambient_light: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_ambient_light',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_ambient_light()'] },
        },

        whalesbot_eagle_1001_ss_get_temperature: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_temperature',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_temperature()'] },
        },

        whalesbot_eagle_1001_ss_get_humidity: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_humidity',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_humidity()'] },
        },

        whalesbot_eagle_1001_ss_get_flame: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_flame',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_flame()'] },
        },

        whalesbot_eagle_1001_ss_get_gesture: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_gesture',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_gesture()'] },
        },

        whalesbot_eagle_1001_ss_get_tof: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['P1', 'P1'], ['P2', 'P2']
                    ],
                    value: 'P1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_tof',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_tof()'] },
        },

        whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.sensor.laser_height_determination.on, 'true'],
                        [Lang.Blocks.sensor.laser_height_determination.off, 'false']
                    ],
                    value: 'true',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_fly_setpoint_LASER_ENABLE()'] },
        },

        whalesbot_eagle_1001_ss_get_bt_remote_control: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.sensor.remote_control_button.key, 'BTKEY'],
                        [Lang.Blocks.sensor.remote_control_button.left_rocker_x, 'BTSTICK2'],
                        [Lang.Blocks.sensor.remote_control_button.left_rocker_y, 'BTSTICK1'],
                        [Lang.Blocks.sensor.remote_control_button.right_rocker_x, 'BTSTICK4'],
                        [Lang.Blocks.sensor.remote_control_button.right_rocker_y, 'BTSTICK3'],
                    ],
                    value: 'BTKEY',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'whalesbot_eagle_1001_ss_get_bt_remote_control',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_get_bt_remote_control()'] },
        },

        whalesbot_eagle_1001_ss_seconds: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_seconds',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_seconds()'] },
        },

        whalesbot_eagle_1001_ss_resettime: {
            color: blockColors.color.sensor,
            outerLine: blockColors.outerLine.sensor,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_eagle_1001_ss_resettime',
            },
            paramsKeyMap: {},
            class: 'whalesbot_eagle_1001_ss',
            isNotFor: ['whalesbot_eagle_1001'],
            func(sprite, script) {
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_ss_resettime()'] },
        },
    };
};

module.exports = Entry.WhalesbotEagle1001;
