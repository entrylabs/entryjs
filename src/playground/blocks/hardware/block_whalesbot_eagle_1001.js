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
    setZero: function() {},
    sendCmd(msgString) {
        let sq = Entry.hw.sendQueue;
        sq['cmd'] = msgString;
        Entry.hw.update();
        delete sq['cmd'];
    },

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

Entry.WhalesbotEagle1001.setLanguage = function() {
    return {
        ko: {
            template: {
                whalesbot_eagle_1001_openning_3d_simulator: '3D 시뮬레이터를 엽니 다',
                whalesbot_eagle_1001_clean:'삭제',
                whalesbot_eagle_1001_restart: '재시작',
                whalesbot_eagle_1001_entering_pitch_mode:'준비모드 시작하기',
                whalesbot_eagle_1001_exit_pitch_mode:'준비모드 끝내기',
                whalesbot_eagle_1001_automatic_take_off_height:'자동 이륙 높이 %1 cm',
                whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset:'자동 이륙 고도 %1 cm 속도 %2 X 오프셋 %3 도 Y 오프셋 %4 도 으로 이동하기',
                whalesbot_eagle_1001_automatic_landing:'드로착륙',
                whalesbot_eagle_1001_automatic_descent_speed_offset:'자동 낙하 속도 %1 X 오프셋 %2 도 Y 오프셋 %3 도',
                whalesbot_eagle_1001_set_the_flight_speed:'설정된 비행 속도는 %1 cm/s',
                whalesbot_eagle_1001_get_setting_speed:'설정 속도 가져오기',
                whalesbot_eagle_1001_rise:'위로 %1 cm',
                whalesbot_eagle_1001_down:'아래로 %1 cm',
                whalesbot_eagle_1001_fly_forward:'앞으로 %1 cm',
                whalesbot_eagle_1001_fly_backward:'뒤로 %1 cm',
                whalesbot_eagle_1001_fly_left:'왼쪽으로 %1 cm',
                whalesbot_eagle_1001_fly_right:'오른쪽으로 %1 cm',
                whalesbot_eagle_1001_turn_left:'왼쪽으로 회전 %1 °',
                whalesbot_eagle_1001_turn_right:'오른쪽으로 회전 %1 °',
                whalesbot_eagle_1001_fly_in_the_specified_direction:'속도 %1 , 방향 %2 으로이동하기',
                whalesbot_eagle_1001_flight_designated:'지정된 거리를 비행합니다 x %1 cm y %2 cm z%3 cm 속도 %4 cm/s',
                whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control:'리모컨 4개 채널 로드 설정 Pitch %1 Roll %2 액셀러레이터 %3 Yaw %4',
                whalesbot_eagle_1001_stop_moving_and_hover:'호버링기능',
                whalesbot_eagle_1001_hover_at_specified_altitude:'지정된 높이에 서스펜션 %1 cm',
                whalesbot_eagle_1001_emergency_stop:'긴급정지',
                whalesbot_eagle_1001_set_the_steering_gear:'스티어링기어 ID 설정 포트 %1 속도 %2 각도 %3',
                whalesbot_eagle_1001_execute_script:'스크립트 실행',
            },
            Device: {
                whalesbot_eagle_1001: 'whalesbot_eagle_1001',
            },
            Menus: {
                whalesbot_eagle_1001: 'WhalesbotEagle1001',
            },
            Blocks: {
                whalesbot_eagle_1001_toast_status_title: "드론 상태",
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
                whalesbot_eagle_1001_clean:'Clean',
                whalesbot_eagle_1001_restart: 'Restart',
                whalesbot_eagle_1001_entering_pitch_mode:'Entering Pitch Mode',
                whalesbot_eagle_1001_exit_pitch_mode:'Exit Pitch Mode',
                whalesbot_eagle_1001_automatic_take_off_height:'Automatic Take Off Height %1 cm',
                whalesbot_eagle_1001_automatic_take_off_altitude_speed_offset:'Automatic Take Off Altitude %1 cm, Speed %2, X offset %3 degree, Y offset %4 degree',
                whalesbot_eagle_1001_automatic_landing:'Automatic Landing',
                whalesbot_eagle_1001_automatic_descent_speed_offset:'Automatic Descent Speed %1, X offset %2 degree, Y offset %3 degree',
                whalesbot_eagle_1001_set_the_flight_speed:'Set The Flight Speed To %1 cm/s',
                whalesbot_eagle_1001_get_setting_speed:'Get Setting Speed',
                whalesbot_eagle_1001_rise:'Rise %1 cm',
                whalesbot_eagle_1001_down:'Down %1 cm',
                whalesbot_eagle_1001_fly_forward:'Fly Forward %1 cm',
                whalesbot_eagle_1001_fly_backward:'Fly Backward %1 cm',
                whalesbot_eagle_1001_fly_left:'Fly Left %1 cm',
                whalesbot_eagle_1001_fly_right:'Fly Right %1 cm',
                whalesbot_eagle_1001_turn_left:'Turn Left %1 °',
                whalesbot_eagle_1001_turn_right:'Turn Right %1 °',
                whalesbot_eagle_1001_fly_in_the_specified_direction:'Fly In The Specified Direction Speed %1 cm/s Direction %2 °',
                whalesbot_eagle_1001_flight_designated:'Flight Designated Distance X %1 cm Y %2 cm Z %3 cm Speed %4 cm/s',
                whalesbot_eagle_1001_set_the_four_channel_lever_quantity_of_remote_control:'Set The Four Channel Lever Quantity Of Remote Control Pitch %1° Roll %2° Throttle %3° Roll %4°',
                whalesbot_eagle_1001_stop_moving_and_hover:'Stop Moving And Hover',
                whalesbot_eagle_1001_hover_at_specified_altitude:'Hover At a Specified Altitude %1 cm',
                whalesbot_eagle_1001_emergency_stop:'Emergency Stop',
                whalesbot_eagle_1001_set_the_steering_gear:'Set The Steering Gear Port %1 Speed %2 cm/s Angle %3 °',
                whalesbot_eagle_1001_execute_script:'Execute Script',
            },
            Device: {
                whalesbot_eagle_1001: 'whalesbot_eagle_1001',
            },
            Menus: {
                whalesbot_eagle_1001: 'WhalesbotEagle1001',
            },
            Blocks: {
                whalesbot_eagle_1001_toast_status_title: "Drone Status",
                whalesbot_eagle_1001_toast_download_success: "Download code successed",
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
    'whalesbot_eagle_1001_restart'   
];

// 블록 생성
Entry.WhalesbotEagle1001.getBlocks = function() {   
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
        "whalesbot_eagle_1001_get_setting_speed": "fly_state(SETSPEED)"
    }

    const startBlocks = [
        "when_run_button_click",
        "when_some_key_pressed",
        "mouse_clicked",
        "mouse_click_cancled",
        "when_object_click",
        "when_object_click_canceled",
    ]

    let globlalCVariables = {}

    function _getParameter (parameter) {
        let param = parameter.params[0] != "" ? parameter.params[0] : "0"
        if (parameter.type != "text" && parameter.type != "number" && parameter.type != "get_variable") {
            param = wbVariables[parameter.type]
        } else if (parameter.type == "get_variable") {
            param = globlalCVariables[parameter.params[0]]
        }
        return param
    }

    function _generateConditions (params) {
        let left = _getParameter(params[0])
        let operator = params[1] != undefined ? wbOperators[params[1]] : "0"
        let right = _getParameter(params[2])
        return { left, operator, right }
    }

    function generateCCode (block) {
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
                return `\twhile(!(${generateCCode(rpWhileDecision)})) {\n${block.statements[0].map(generateCCode).join('')}\t}\n`;

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
                return "0";

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

            case 'whalesbot_eagle_1001_get_setting_speed':
                return `\tfly_state(SETSPEED);\n`;

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

            default:
                if (!startBlocks.includes(block.type)) {
                    _this.unsupportBlockExist = true;
                }
                return '';
        }
    }

    function setUpCVariables (variable) {
        if (variable.visible) {
            const varName = `var_${variable.name}`
            globlalCVariables[variable.id] = varName
            const varValue = variable.value;
            return `float ${varName} = ${varValue};\n`
        }
        return ""
    }

    function openedSimulatorPopup () {
        if (_this.simulatorPopup == null) {
            return false;
        }
        return !_this.simulatorPopup.closed;
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
            func (sprite, script) {
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
            func (sprite, script) {
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
            func (sprite, script) {
                _this.sendCmd('stopCode');
                Entry.toast.success(
                    Lang.Blocks.whalesbot_eagle_1001_toast_status_title, 
                    Lang.Blocks.whalesbot_eagle_1001_toast_clean_success
                );
            },
            syntax: { js: [], py: ['Entry.whalesbot_eagle_1001_clean()'] },
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
            func (sprite, script) {
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

                // console.log(sourceCode)

                if (openedSimulatorPopup()) {
                    Entry.toast.success(
                        Lang.Blocks.whalesbot_eagle_1001_toast_status_title,         
                        Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                    );
                    return;
                }

                _this.sendCmd(sourceCode);

                Entry.toast.success(
                    Lang.Blocks.whalesbot_drone_toast_status_title, 
                    Lang.Blocks.whalesbot_drone_toast_download_success
                );
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
                        params: ['50'],
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
                        params: ['50'],
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
    };
};

module.exports = Entry.WhalesbotEagle1001;
