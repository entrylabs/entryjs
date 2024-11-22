'use strict';
import _range from 'lodash/range';
import DataTable from '../../../class/DataTable';
import entryModuleLoader from '../../../class/entryModuleLoader';

Entry.WhalesbotMC102 = {
    id: '62.3',
    name: 'whalesbot_mc_102',
    url: '',
    imageName: '',
    title: {
        en: 'Whalesbot MC 102',
        ko: '웨일스봇 MC 102',
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

Entry.WhalesbotMC102.setLanguage = function() {
    return {
        ko: {
            template: {
                whalesbot_mc_102_move: '이동 왼쪽 모터 %1 오른쪽 모터 %2 %3 줄력 %4 %',
                whalesbot_mc_102_move_time: '이동 왼쪽 모터 %1 오른쪽 모터 %2 %3 줄력 %4 % 시간 %5 초',
                whalesbot_mc_102_stop_move: '정지 왼쪽 모터 %1 오른쪽 모터 %2',
                whalesbot_mc_102_set_motor: '모터 설정 %1 출력 %2 %',
                whalesbot_mc_102_set_dual_motor_time: '모터 설정 %1 출력 %2 % 모터 %3 출력 %4 % 시간 %5 초',
                whalesbot_mc_102_set_motor_time: '모터 설정 %1 출력 %2 % 시간 %3 초',
                whalesbot_mc_102_set_dual_motor_angle: '모터 설정 %1 출력 %2 % 모터 %3 출력 %4 % 희전 %5 도',
                whalesbot_mc_102_set_motor_angle: '모터 설정 %1 출력 %2 % 희전 %3 도',
                whalesbot_mc_102_reverse_motor: '모터 반대로 돌리기 %1',
                whalesbot_mc_102_off_motor: '모터정지 %1',
                whalesbot_mc_102_set_servo_angle: '스티어링기어 각도모드 ID 설정 %1 속도 %2 각도 %3',
                whalesbot_mc_102_set_servo_rotation: '스티어링기어 각도모드 ID 설정 %1 속도 %2',
                whalesbot_mc_102_Servo_IDscan: '단일 서보 ID 표시',
                whalesbot_mc_102_servo_id_change: '스티어링기어 ID를 수정 %1 까지 %2',
                whalesbot_mc_102_play_page: '동작 실행 %1',
                whalesbot_mc_102_quit_page: '동작 페이지 종료',
                whalesbot_mc_102_stop_page: '동작 페이지 중지',
                whalesbot_mc_102_omni_wheel_ctrl: 'Omni바퀴 이동 출력 %1 % 향하다 %2 각도이동',
                whalesbot_mc_102_omni_wheel_turn: 'Ommi바퀴 방향전환 %1 출력 %2 %',
                whalesbot_mc_102_omni_wheel_stop: 'Omni바퀴 이동 정지',
                whalesbot_mc_102_getplay_page_index: '현재 작업 페이지',
                whalesbot_mc_102_end: '종료 %1',
                whalesbot_mc_102_download: '다운로드',
                whalesbot_mc_102_execute_script: '실행',
                // whalesbot_mc_102_clean: 'Clean',
                // whalesbot_mc_102_restart: 'Restart',
            },
            Device: {
                whalesbot_mc_102: 'whalesbot_mc_102',
            },
            Menus: {
                whalesbot_mc_102: 'WhalesbotMC102',
            },
            Blocks: {
                params: {
                    move_forward: '전진', move_backward: '후신', move_turnleft: '좌회전', move_turnright: '우회전', MotorAll: '모두'
                },
                notifications: {
                    POWER: '줄력', TIME: '초', ANGLE: '각도', ACTION: '동작'
                },
                whalesbot_mc_102_toast_status_title: "Drone Status",
                whalesbot_mc_102_toast_download_success: "Download code successed",
                whalesbot_mc_102_toast_download_failed: "Download code failed",
                whalesbot_mc_102_toast_clean_failed: "Clean code failed",
                whalesbot_mc_102_toast_clean_success: "Clean code success",
                whalesbot_mc_102_toast_unsupport_block_title: "Unsupport Block",
                whalesbot_mc_102_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
            }
        },
        en: {
            template: {
                whalesbot_mc_102_move: 'Move left motor %1 right motor %2 %3 power %4 %',
                whalesbot_mc_102_move_time: 'Move left motor %1 right motor %2 %3 power %4 % run for %5 secs',
                whalesbot_mc_102_stop_move: 'Stop left motor %1 right motor %2',
                whalesbot_mc_102_set_motor: 'Set motor %1 power %2 %',
                whalesbot_mc_102_set_dual_motor_time: 'Set motor %1 power %2 % motor %3 power %4 % run for %5 secs',
                whalesbot_mc_102_set_motor_time: 'Set motor %1 power %2 % run for %3 secs',
                whalesbot_mc_102_set_dual_motor_angle: 'Set motor %1 power %2 % motor %3 power %4 % rotate for %5 degrees',
                whalesbot_mc_102_set_motor_angle: 'Set motor %1 power %2 % rotate for %3 degrees',
                whalesbot_mc_102_reverse_motor: 'Reserve motor %1',
                whalesbot_mc_102_off_motor: 'Stop motor %1',
                whalesbot_mc_102_set_servo_angle: 'Set up steering gear angle mode ID %1 speed $2 angle %3',
                whalesbot_mc_102_set_servo_rotation: 'Set up steering gear rotation mode ID %1 speed %2',
                whalesbot_mc_102_Servo_IDscan: 'Display a single servo ID',
                whalesbot_mc_102_servo_id_change: 'Modify the steering ID %1 to %2',
                whalesbot_mc_102_play_page: 'Play action %1',
                whalesbot_mc_102_quit_page: 'Exit action page',
                whalesbot_mc_102_stop_page: 'Stop action page',
                whalesbot_mc_102_omni_wheel_ctrl: 'Omni-wheel move power %1 % towards %2 degree',
                whalesbot_mc_102_omni_wheel_turn: 'Ommi-wheel turn %1 power %2 %',
                whalesbot_mc_102_omni_wheel_stop: 'Stop omni-wheel move',
                whalesbot_mc_102_getplay_page_index: 'Current action page',
                whalesbot_mc_102_end: 'End block %1',
                whalesbot_mc_102_download: 'Download code',
                whalesbot_mc_102_execute_script: 'Excute',
                // whalesbot_mc_102_clean: 'Clean',
                // whalesbot_mc_102_restart: 'Restart',
            },
            Device: {
                whalesbot_mc_102: 'whalesbot_mc_102',
            },
            Menus: {
                whalesbot_mc_102: 'WhalesbotMC102',
            },
            Blocks: {
                params: {
                    move_forward: 'Forward', move_backward: 'Backward', move_turnleft: 'Turn left', move_turnright: 'Turn right', MotorAll: 'All'
                },
                notifications: {
                    POWER: 'power', TIME: 'secs', ANGLE: 'angle', ACTION: 'action'
                },
                whalesbot_mc_102_toast_success_title: "SUCCESS",
                whalesbot_mc_102_toast_alert_title: "ALERT",
                // whalesbot_mc_102_toast_download_success: "Download code successed",
                // whalesbot_mc_102_toast_download_failed: "Download code failed",
                // whalesbot_mc_102_toast_clean_failed: "Clean code failed",
                // whalesbot_mc_102_toast_clean_success: "Clean code success",
                // whalesbot_mc_102_toast_unsupport_block_title: "Unsupport Block",
                // whalesbot_mc_102_toast_unsupport_block_msg: "There is some blocks is not supported by hardware"
            }
        },
    };
};

Entry.WhalesbotMC102.blockMenuBlocks = [
    'whalesbot_mc_102_move',
    'whalesbot_mc_102_move_time',
    'whalesbot_mc_102_stop_move',
    'whalesbot_mc_102_set_motor',
    'whalesbot_mc_102_set_dual_motor_time',
    'whalesbot_mc_102_set_motor_time',
    'whalesbot_mc_102_set_dual_motor_angle',
    'whalesbot_mc_102_set_motor_angle',
    'whalesbot_mc_102_reverse_motor',
    'whalesbot_mc_102_off_motor',
    'whalesbot_mc_102_set_servo_angle',
    'whalesbot_mc_102_set_servo_rotation',
    'whalesbot_mc_102_Servo_IDscan',
    'whalesbot_mc_102_servo_id_change',
    'whalesbot_mc_102_play_page',
    'whalesbot_mc_102_quit_page',
    'whalesbot_mc_102_stop_page',
    'whalesbot_mc_102_getplay_page_index',
    'whalesbot_mc_102_omni_wheel_ctrl',
    'whalesbot_mc_102_omni_wheel_turn',
    'whalesbot_mc_102_omni_wheel_stop',
    'whalesbot_mc_102_end',
    'whalesbot_mc_102_download',
    'whalesbot_mc_102_execute_script',
    // 'whalesbot_mc_102_clean',
    // 'whalesbot_mc_102_restart'
];

// 블록 생성
Entry.WhalesbotMC102.getBlocks = function() {
    let _this = this;
    let sourceCode;

    const notificationType = {
        "SUCCESS": "success",
        "UNSUPPORTED": "unsupported",
        "ALERT": "alert",
    }

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
        "whalesbot_mc_102_getplay_page_index": "getplay_page_index()"
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
        if (typeof parameter === "string") return parameter
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
            case 'whalesbot_mc_102_move':
                let moveDirection = _getParameter(block.params[2]);
                let movePower = _getParameter(block.params[3]);
                return `\tmove(${moveDirection},${movePower});\n`;

            case 'whalesbot_mc_102_move_time':
                let moveTimeDirection = block.params[2];
                let moveTimePower = _getParameter(block.params[3]);
                let moveTime = _getParameter(block.params[4]);
                return `\tmove_time(${moveTimeDirection},${moveTimePower},${moveTime});\n`;

            case 'whalesbot_mc_102_stop_move':
                return `\tstop_move();\n`;

            case 'whalesbot_mc_102_set_motor':
                let motorNumber = _getParameter(block.params[0]);
                let motorSpeed = _getParameter(block.params[1]);
                return `\tset_motor(${motorNumber},${motorSpeed});\n`;

            case 'whalesbot_mc_102_set_dual_motor_time':
                let dualMotorTime1 = _getParameter(block.params[0]);
                let dualMotorTime1Power = _getParameter(block.params[1]);
                let dualMotorTime2 = _getParameter(block.params[2]);
                let dualMotorTime2Power = _getParameter(block.params[3]);
                let dualMotorTime = _getParameter(block.params[4]);
                return `\tset_dual_motor_time(${dualMotorTime1},${dualMotorTime1Power},${dualMotorTime2},${dualMotorTime2Power},${dualMotorTime});\n`;

            case 'whalesbot_mc_102_set_motor_time':
                let motorTimeNumber = _getParameter(block.params[0]);
                let motorTimeSpeed = _getParameter(block.params[1]);
                let motorTime = _getParameter(block.params[2]);
                return `\tset_motor_time(${motorTimeNumber},${motorTimeSpeed},${motorTime});\n`;

            case 'whalesbot_mc_102_set_dual_motor_angle':
                let dualMotorAngle1 = _getParameter(block.params[0]);
                let dualMotorAngle1Power = _getParameter(block.params[1]);
                let dualMotorAngle2 = _getParameter(block.params[2]);
                let dualMotorAngle2Power = _getParameter(block.params[3]);
                let dualMotorAngle = _getParameter(block.params[4]);
                return `\tset_dual_motor_angle(${dualMotorAngle1},${dualMotorAngle1Power},${dualMotorAngle2},${dualMotorAngle2Power},${dualMotorAngle});\n`;

            case 'whalesbot_mc_102_set_motor_angle':
                let motorAngleNumber = _getParameter(block.params[0]);
                let motorAnglePower = _getParameter(block.params[1]);
                let motorAngle = _getParameter(block.params[2]);
                return `\tset_motor_angle(${motorAngleNumber},${motorAnglePower},${motorAngle});\n`;

            case 'whalesbot_mc_102_reverse_motor':
                let reverseMotorNumber = _getParameter(block.params[0]);
                return `\treverse_motor(${reverseMotorNumber});\n`;

            case 'whalesbot_mc_102_off_motor':
                let offMotorNumber = _getParameter(block.params[0]);
                return `\toff_motor(${offMotorNumber});\n`;

            case 'whalesbot_mc_102_set_servo_angle':
                let servoAngleNumber = _getParameter(block.params[0]);
                let serveAnglePower = _getParameter(block.params[1]);
                let servoAngle = _getParameter(block.params[2]);
                return `\tset_servo_angle(S${servoAngleNumber},${serveAnglePower},${servoAngle});\n`;

            case 'whalesbot_mc_102_set_servo_rotation':
                let servoRotationNumber = _getParameter(block.params[0]);
                let servoRotation = _getParameter(block.params[1]);
                return `\tset_servo_rotation(S${servoRotationNumber},${servoRotation});\n`;

            case 'whalesbot_mc_102_Servo_IDscan':
                return `\tServo_IDscan();\n`;

            case 'whalesbot_mc_102_servo_id_change':
                let oldServoID = _getParameter(block.params[0]);
                let newServoID = _getParameter(block.params[1]);
                return `\tservo_id_change(${oldServoID},${newServoID});\n`;

            case 'whalesbot_mc_102_play_page':
                let playPageNumber = _getParameter(block.params[0]);
                return `\tplay_page(${playPageNumber});\n`;

            case 'whalesbot_mc_102_quit_page':
                return `\tquit_page();\n`;

            case 'whalesbot_mc_102_stop_page':
                return `\tstop_page();\n`;

            case 'whalesbot_mc_102_getplay_page_index':
                return `\tgetplay_page_index();\n`;

            case 'whalesbot_mc_102_omni_wheel_ctrl':
                let omniWheelCtrlPower = _getParameter(block.params[0]);
                let omniWheelCtrlAngle = _getParameter(block.params[1]);
                return `\tomni_wheel_ctrl(${omniWheelCtrlPower},${omniWheelCtrlAngle});\n`;

            case 'whalesbot_mc_102_omni_wheel_turn':
                let omniWheelTurnAngle = _getParameter(block.params[0]);
                let omniWheelTurnPower = _getParameter(block.params[1]);
                return `\tomni_wheel_turn(${omniWheelTurnAngle},${omniWheelTurnPower});\n`;

            case 'whalesbot_mc_102_omni_wheel_stop':
                return `\tomni_wheel_stop();\n`;

            case 'whalesbot_mc_102_end':
                return "";

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

    function openedSimulatorPopup () {
        if (_this.simulatorPopup == null) {
            return false;
        }
        return !_this.simulatorPopup.closed;
    }

    return {
        // whalesbot_mc_102_openning_3d_simulator: {
        //     color: EntryStatic.colorSet.block.default.HARDWARE,
        //     outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
        //     fontColor: '#fff',
        //     skeleton: 'basic_without_next',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Block',
        //             accept: 'string',
        //             defaultType: 'number',
        //         },
        //     ],
        //     events: {},
        //     def: {
        //         type: 'whalesbot_mc_102_openning_3d_simulator',
        //     },
        //     paramsKeyMap: {
        //         VALUE: 0,
        //     },
        //     class: 'whalesbot_mc_102',
        //     isNotFor: ['whalesbot_mc_102'],
        //     func (sprite, script) {
        //         const width = window.innerWidth * 0.8;
        //         const height = window.innerHeight * 0.8;
        //         _this.simulatorPopup = window.open(
        //             metadata.simulator_url,
        //             'DroneSimulatorPopup',
        //             `width=${width},height=${height}`
        //         );
        //     },
        //     syntax: { js: [], py: ['Entry.whalesbot_mc_102_openning_3d_simulator()'] },
        // },

        whalesbot_mc_102_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['B', 'B'],
                    ],
                    value: 'B',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.params.move_forward, 'move_forward'],
                        [Lang.Blocks.params.move_backward, 'move_backward'],
                        [Lang.Blocks.params.move_turnleft, 'move_turnleft'],
                        [Lang.Blocks.params.move_turnright, 'move_turnright']
                    ],
                    value: 'move_forward',
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                ],
                type: 'whalesbot_mc_102_move',
            },
            paramsKeyMap: {
                MOTOR_LEFT: 0,
                MOTOR_RIGHT: 1,
                DIRECTION: 2,
                POWER: 3
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[3]);
                if (power < 0 || power > 100) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_move()'] },
        },

        whalesbot_mc_102_move_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['B', 'B'],
                    ],
                    value: 'B',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.params.move_forward, 'move_forward'],
                        [Lang.Blocks.params.move_backward, 'move_backward'],
                        [Lang.Blocks.params.move_turnleft, 'move_turnleft'],
                        [Lang.Blocks.params.move_turnright, 'move_turnright']
                    ],
                    value: 'move_forward',
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'whalesbot_mc_102_move_time',
            },
            paramsKeyMap: {
                MOTOR_LEFT: 0,
                MOTOR_RIGHT: 1,
                DIRECTION: 2,
                POWER: 3,
                TIME: 4,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[3]);
                var time =  Number(script.values[4]);
                if (power < 0 || power > 100) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (time < 0 || time > 60) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.TIME} <= 60`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_move_time()'] },
        },

        whalesbot_mc_102_stop_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['B', 'B'],
                    ],
                    value: 'B',
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
                    {
                        type: 'number',
                        params: ['40'],
                    },
                ],
                type: 'whalesbot_mc_102_stop_move',
            },
            paramsKeyMap: {
                MOTOR_LEFT: 0,
                MOTOR_RIGHT: 1,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_stop_move()'] },
        },

        whalesbot_mc_102_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                ],
                type: 'whalesbot_mc_102_set_motor',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[1]);
                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_motor()'] },
        },

        whalesbot_mc_102_set_dual_motor_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'B',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'whalesbot_mc_102_set_dual_motor_time',
            },
            paramsKeyMap: {
                MOTOR1: 0,
                POWER1: 1,
                MOTOR2: 2,
                POWER2: 3,
                TIME: 4
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power1 = Number(script.values[1]);
                var power2 = Number(script.values[3]);
                var time = Number(script.values[4]);

                if (power1 < -100 || power1 > 100 || power2 < -100 || power2 > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (time < 0 || time > 60) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.TIME} <= 60`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_dual_motor_time()'] },
        },

        whalesbot_mc_102_set_motor_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                        params: ['1'],
                    },
                ],
                type: 'whalesbot_mc_102_set_motor_time',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
                TIME: 2
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[1]);
                var time = Number(script.values[2]);

                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (time < 0 || time > 60) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.TIME} <= 60`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_motor_time()'] },
        },

        whalesbot_mc_102_set_dual_motor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'B',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                    {
                        type: 'number',
                        params: ['360'],
                    },
                ],
                type: 'whalesbot_mc_102_set_dual_motor_angle',
            },
            paramsKeyMap: {
                MOTOR1: 0,
                POWER1: 1,
                MOTOR2: 2,
                POWER2: 3,
                ANGLE: 4
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power1 = Number(script.values[1]);
                var power2 = Number(script.values[3]);
                var angle = Number(script.values[4]);

                if (power1 < -100 || power1 > 100 || power2 < -100 || power2 > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (angle < 0 || angle > 360) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.ANGLE} <= 360`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_dual_motor_angle()'] },
        },

        whalesbot_mc_102_set_motor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                        params: ['360'],
                    },
                ],
                type: 'whalesbot_mc_102_set_motor_angle',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
                ANGLE: 2
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[1]);
                var angle = Number(script.values[2]);

                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (angle < 0 || angle > 360) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.ANGLE} <= 360`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_motor_angle()'] },
        },

        whalesbot_mc_102_reverse_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'A',
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
                type: 'whalesbot_mc_102_reverse_motor',
            },
            paramsKeyMap: {
                MOTOR: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_reverse_motor()'] },
        },

        whalesbot_mc_102_off_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.params.MotorAll, 'MotorAll'],
                        ['A', 'A'],
                        ['B', 'B'],
                        ['C', 'C'],
                        ['D', 'D']
                    ],
                    value: 'MotorAll',
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
                type: 'whalesbot_mc_102_off_motor',
            },
            paramsKeyMap: {
                MOTOR: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_off_motor()'] },
        },

        whalesbot_mc_102_set_servo_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                        ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'],
                        ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18']
                    ],
                    value: '1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
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
                        params: ['0'],
                    },
                ],
                type: 'whalesbot_mc_102_set_servo_angle',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
                ANGLE: 2
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[1]);
                var angle = Number(script.values[2]);

                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (angle < 0 || angle > 360) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.ANGLE} <= 360`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_servo_angle()'] },
        },

        whalesbot_mc_102_set_servo_rotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                        ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'],
                        ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18']
                    ],
                    value: '1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                ],
                type: 'whalesbot_mc_102_set_servo_rotation',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[1]);
                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_set_servo_rotation()'] },
        },

        whalesbot_mc_102_Servo_IDscan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_mc_102_Servo_IDscan',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_Servo_IDscan()'] },
        },

        whalesbot_mc_102_servo_id_change: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                        ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'],
                        ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18']
                    ],
                    value: '1',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'],
                        ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'],
                        ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18']
                    ],
                    value: '2',
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
                type: 'whalesbot_mc_102_servo_id_change',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_servo_id_change()'] },
        },

        whalesbot_mc_102_play_page: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'whalesbot_mc_102_play_page',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var action = Number(script.values[0]);
                if (action < 1 || action > 128) {
                    notify(notificationType.ALERT, `1 <= ${Lang.Blocks.notifications.ACTION} <= 128`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_play_page()'] },
        },

        whalesbot_mc_102_quit_page: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_mc_102_quit_page',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_quit_page()'] },
        },

        whalesbot_mc_102_stop_page: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_mc_102_stop_page',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_stop_page()'] },
        },

        whalesbot_mc_102_getplay_page_index: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_mc_102_getplay_page_index',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_getplay_page_index()'] },
        },

        whalesbot_mc_102_omni_wheel_ctrl: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['40'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'whalesbot_mc_102_omni_wheel_ctrl',
            },
            paramsKeyMap: {
                POWER: 0,
                ANGLE: 1,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[0]);
                var angle = Number(script.values[1]);

                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
                if (angle < 0 || angle > 360) {
                    notify(notificationType.ALERT, `0 <= ${Lang.Blocks.notifications.ANGLE} <= 360`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_omni_wheel_ctrl()'] },
        },

        whalesbot_mc_102_omni_wheel_turn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.params.move_turnleft, 'omni_turnleft'],
                        [Lang.Blocks.params.move_turnright, 'omni_turnright']
                    ],
                    value: 'omni_turnleft',
                    fontSize: 10,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 40,
                    defaultType: 'number',
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['40'],
                    },
                ],
                type: 'whalesbot_mc_102_omni_wheel_turn',
            },
            paramsKeyMap: {
                POWER: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {
                var power = Number(script.values[0]);
                if (power < -100 || power > 100) {
                    notify(notificationType.ALERT, `100 <= ${Lang.Blocks.notifications.POWER} <= 100`)
                    _this.invalidParamValue = true;
                    throw new Error();
                }
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_omni_wheel_turn()'] },
        },

        whalesbot_mc_102_omni_wheel_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'whalesbot_mc_102_omni_wheel_stop',
            },
            paramsKeyMap: {},
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func (sprite, script) {},
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_omni_wheel_stop()'] },
        },

        whalesbot_mc_102_end: {
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
                params: [
                    {
                        type: 'number',
                        params: ['RunA'],
                    },
                ],
                type: 'whalesbot_mc_102_end',
            },
            paramsKeyMap: {
                FILENAME: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func(sprite, script) {
                let filename = script.values[0];
                const project = _this.exportProject();
                const listVariables = project.variables;
                const rawScript = project.objects[0].script;
                const allScript = JSON.parse(rawScript);
                const hardwareScript = allScript.filter((arr) => arr.length > 2);

                let sourceCode = `#include "whalesbot.h"\n${listVariables.map(setUpCVariables).join('')}\nvoid user_main() {\n`;
                sourceCode += `${hardwareScript[0].map(generateCCode).join('')}}`;

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

                console.log(sourceCode)
                // if (openedSimulatorPopup()) {
                //     Entry.toast.success(
                //         Lang.Blocks.whalesbot_eagle_1001_toast_status_title,
                //         Lang.Blocks.whalesbot_eagle_1001_toast_download_success
                //     );
                //     return;
                // }

                _this.sendCmd([sourceCode, filename]);

                Entry.toast.success(
                    Lang.Blocks.whalesbot_drone_toast_status_title,
                    Lang.Blocks.whalesbot_drone_toast_download_success
                );
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_end()'] },
        },

        whalesbot_mc_102_download: {
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
                type: 'whalesbot_mc_102_download',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func(sprite, script) {
                _this.sendCmd("download");
                Entry.toast.success(
                    Lang.Blocks.whalesbot_drone_toast_status_title,
                    Lang.Blocks.whalesbot_drone_toast_download_success
                );
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_download()'] },
        },

        whalesbot_mc_102_execute_script: {
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
                type: 'whalesbot_mc_102_execute_script',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'whalesbot_mc_102',
            isNotFor: ['whalesbot_mc_102'],
            func(sprite, script) {
                if (openedSimulatorPopup()) {
                    _this.simulatorPopup.postMessage({
                        script: sourceCode
                    }, '*');
                    return;
                }
                _this.sendCmd('runCode');
            },
            syntax: { js: [], py: ['Entry.whalesbot_mc_102_execute_script()'] },
        },
    };
};

module.exports = Entry.WhalesbotMC102;
