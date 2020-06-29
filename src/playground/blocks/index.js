'use strict';

require('./block_arduino');
require('./block_sensorboard');
require('./block_joystick');
require('./block_dplay');
require('./block_nemoino');
require('./block_ardublock');
require('./block_arduino_nano');
require('./block_roboid');
require('./block_mkboard');
require('./block_memaker');
require('./block_smartboard');
require('./block_rokoboard');
require('./block_albert');
require('./block_altino');
require('./block_arduino_ext');
require('./block_coding_box');
require('./block_bitbrick');
require('./block_blacksmith');
require('./block_byrobot_dronefighter_controller');
require('./block_byrobot_dronefighter_drive');
require('./block_byrobot_dronefighter_flight');
require('./block_byrobot_petrone_v2_controller');
require('./block_byrobot_petrone_v2_drive');
require('./block_byrobot_petrone_v2_flight');
require('./block_chocopi');
require('./block_cobl');
require('./block_coconut');
require('./block_codeino');
require('./block_codestar');
require('./block_dadublock');
require('./block_edumaker');
require('./block_ev3');
require('./block_hamster');
require('./block_hummingbird');
require('./block_iboard');
require('./block_jdkit');
require('./block_mechatronics_4d');
require('./block_modi');
require('./block_neobot');
require('./block_neobot_sensor_theme');
require('./block_neobot_robot_theme');
require('./block_roborobo');
require('./block_robotis');
require('./block_robotori');
require('./block_truerobot');
require('./block_turtle');
require('./block_xbot');
require('./block_playcode');
require('./block_mechatro');
require('./block_creamo');
require('./block_funboard');
require('./block_microbit');
require('./block_mrt');
require('./block_dash');
require('./block_bingles');
require('./block_proboconnect');
require('./block_sciencecube');
require('./block_codingmachine');

Entry.HARDWARE_LIST = {
    '1.1': Entry.Arduino,
    '1.2': Entry.SensorBoard,
    '1.3': Entry.CODEino,
    '1.4': Entry.joystick,
    '1.5': Entry.dplay,
    '1.6': Entry.nemoino,
    '1.7': Entry.Xbot,
    '1.8': Entry.ardublock,
    '1.9': Entry.ArduinoExt,
    '1.10': Entry.ArduinoNano,
    '1.A': Entry.Cobl,
    '1.B': Entry.Blacksmith,
    '1.C': Entry.CodingBox,
    '2.4': Entry.Hamster,
    '2.5': Entry.Albert,
    '2.9': Entry.Turtle,
    '2.FF': Entry.Roboid,
    '3.1': Entry.Bitbrick,
    '4.2': Entry.ArduinoExt,
    '5.1': Entry.Neobot,
    '5.2': Entry.NeobotSensorTheme,
    '5.3': Entry.NeobotRobotTheme,
    '6.1': Entry.mkboard,
    '6.2': Entry.memaker,
    '7.1': Entry.Robotis_carCont,
    '7.2': Entry.Robotis_openCM70,
    '8.1': Entry.Arduino,
    '9.1': Entry.iboard,
    'A.1': Entry.SmartBoard,
    'B.1': Entry.Codestar,
    'C.1': Entry.DaduBlock,
    'C.2': Entry.DaduBlock_Car,
    'D.1': Entry.robotori,
    'F.1': Entry.byrobot_dronefighter_controller,
    'F.2': Entry.byrobot_dronefighter_drive,
    'F.3': Entry.byrobot_dronefighter_flight,
    'F.4': Entry.byrobot_petrone_v2_controller,
    'F.5': Entry.byrobot_petrone_v2_drive,
    'F.6': Entry.byrobot_petrone_v2_flight,
    '10.1': Entry.Roborobo_Roduino,
    '10.2': Entry.Roborobo_SchoolKit,
    '12.1': Entry.EV3,
    '13.1': Entry.rokoboard,
    '14.1': Entry.Chocopi,
    '15.1': Entry.coconut,
    '16.1': Entry.MODI,
    '18.1': Entry.Altino,
    '19.1': Entry.trueRobot,
    '1A.1': Entry.ArduinoNano,
    '1B.1': Entry.EduMaker,
    '1C.1': Entry.hummingbird,
    '1D.1': Entry.JDKit,
    '1E.1': Entry.playcode,
    '1F.1': Entry.mechatro,
    '20.1': Entry.Creamo,
    '21.1': Entry.FunBoard,
    '22.1': Entry.Microbit,
    '23.1': Entry.MRT,
    '24.1': Entry.Dash,
    '1.D': Entry.BINGLES,
    '25.1': Entry.sciencecube,
    '26.1': Entry.Codingmachine,
    '27.1': Entry.ProboConnect,
};

const startBlock = require('./block_start');
const flowBlock = require('./block_flow');
const movingBlock = require('./block_moving');
const looksBlock = require('./block_looks');
const brushBlock = require('./block_brush');
const textBlock = require('./block_text');
const soundBlock = require('./block_sound');
const judgementBlock = require('./block_judgement');
const calcBlock = require('./block_calc');
const variableBlock = require('./block_variable');
const funcBlock = require('./block_func');

Entry.EXPANSION_BLOCK = {};
require('./block_expansion_weather');
require('./block_expansion_festival');
require('./block_expansion_translate');
require('./block_expansion_behaviorconduct_disaster');
require('./block_expansion_behaviorconduct_lifesafety');

Entry.EXPANSION_BLOCK_LIST = {
    weather: Entry.Expansion_Weather,
    festival: Entry.EXPANSION_BLOCK.festival,
    translate : Entry.EXPANSION_BLOCK.translate,
    behaviorConductDisaster : Entry.EXPANSION_BLOCK.behaviorConductDisaster,
    behaviorConductLifeSafety : Entry.EXPANSION_BLOCK.behaviorConductLifeSafety
};

function getBlockObject(items) {
    const blockObject = {};
    items.forEach((item)=> {
        if('getBlocks' in item) {
            Object.assign(blockObject, item.getBlocks());
        }
    });
    return blockObject;
}

module.exports = {
    getBlocks() {
        const basicBlockList = [
            startBlock,
            flowBlock,
            movingBlock,
            looksBlock,
            brushBlock,
            textBlock,
            soundBlock,
            judgementBlock,
            calcBlock,
            variableBlock,
            funcBlock
        ];
        const expansionBlockList = Object.values(Entry.EXPANSION_BLOCK_LIST);
        const hardwareList = Object.values(Entry.HARDWARE_LIST);
        return getBlockObject(basicBlockList.concat(hardwareList).concat(expansionBlockList));
    }
}
