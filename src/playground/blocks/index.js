'use strict';

const hardware = require('./hardware/index');
const _union = require('lodash/union');
const _flatten = require('lodash/flatten');

const basicBlockList = [
    require('./block_start'),
    require('./block_flow'),
    require('./block_moving'),
    require('./block_looks'),
    require('./block_brush'),
    require('./block_text'),
    require('./block_sound'),
    require('./block_judgement'),
    require('./block_calc'),
    require('./block_variable'),
    require('./block_func'),
    require('./block_ai'),
    require('./block_analysis'),
    require('./block_ai_learning'),
];

Entry.AI_UTILIZE_BLOCK = {};
require('./block_ai_utilize_audio');
require('./block_ai_utilize_tts');
require('./block_ai_utilize_translate');
require('./block_ai_utilize_video');
Entry.AI_UTILIZE_BLOCK_LIST = {
    audio: Entry.AI_UTILIZE_BLOCK.audio,
    tts: Entry.AI_UTILIZE_BLOCK.tts,
    translate: Entry.AI_UTILIZE_BLOCK.translate,
    video: Entry.AI_UTILIZE_BLOCK.video,
};

Entry.EXPANSION_BLOCK = {};
require('./block_expansion_weather');
require('./block_expansion_festival');
require('./block_expansion_behaviorconduct_disaster');
require('./block_expansion_behaviorconduct_lifesafety');

Entry.EXPANSION_BLOCK_LIST = {
    weather: Entry.Expansion_Weather,
    festival: Entry.EXPANSION_BLOCK.festival,
    behaviorConductDisaster: Entry.EXPANSION_BLOCK.behaviorConductDisaster,
    behaviorConductLifeSafety: Entry.EXPANSION_BLOCK.behaviorConductLifeSafety,
};

function getBlockObject(items) {
    const blockObject = {};
    items.forEach((item) => {
        if ('getBlocks' in item) {
            Object.assign(blockObject, item.getBlocks());
        }
    });
    return blockObject;
}

/**
 * 하드웨어 블록을 EntryStatic 에 등록한다.
 * 하드웨어 블록에만 사용하는 이유는,
 * 기존 블록은 legacy 블록이 존재하기 때문에 전부 등록하면 안되기 때문이다.
 * 또한 값블록으로서만 사용하는 블록이 블록메뉴에 따로 나타나게 될 수 있다.
 *
 * @param {Object} hardwareModules
 * @return {void}
 */
function registerHardwareBlockToStatic(hardwareModules) {
    EntryStatic.DynamicHardwareBlocks = _union(
        _flatten(hardwareModules.map((hardware) => hardware.blockMenuBlocks || [])),
        EntryStatic.DynamicHardwareBlocks
    );
}

module.exports = {
    getBlocks() {
        const hardwareModules = hardware.getHardwareModuleList();
        registerHardwareBlockToStatic(hardwareModules);
        const basicAndExpansionBlockObjectList = getBlockObject(
            basicBlockList
                .concat(Object.values(Entry.EXPANSION_BLOCK_LIST))
                .concat(Object.values(Entry.AI_UTILIZE_BLOCK_LIST))
        );
        const hardwareBlockObjectList = getBlockObject(hardwareModules);
        return Object.assign({}, basicAndExpansionBlockObjectList, hardwareBlockObjectList);
    },
};
