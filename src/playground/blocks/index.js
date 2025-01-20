'use strict';

const hardware = require('./hardware/index');
const hardwareLite = require('./hardwareLite/index');
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
    require('./block_analysis'),
];

const destroyBlockList = [];

function getBlockObject(items) {
    const blockObject = {};
    items.forEach((item) => {
        try {
            if ('getBlocks' in item) {
                Object.assign(blockObject, item.getBlocks());
            }
            if ('destroy' in item) {
                destroyBlockList.push(item.destroy);
            }
        } catch (err) {
            console.log(err, item);
        }
    });
    return blockObject;
}

function getHardwareBlockObject(items) {
    const blockObject = {};
    items.forEach((item) => {
        // 일반모드, 교과블록 미포함 하드웨어 > 일반블록만 출력
        // 일반모드, 교과블록 포함 하드웨어 > 일반블록만 출력
        // 교과모드, 교과블록 미포함 하드웨어 > 일반블록만 출력
        // 교과모드, 교과블록 포함 하드웨어 > 교과블록만 출력
        try {
            if (item.hasPracticalCourse && EntryStatic.isPracticalCourse) {
                Object.assign(
                    blockObject,
                    'getPracticalBlocks' in item ? item.getPracticalBlocks() : {}
                );
                EntryStatic.hwMiniSupportList.push(item.name);
            } else {
                Object.assign(blockObject, 'getBlocks' in item ? item.getBlocks() : {});
            }
        } catch (err) {
            console.log(err, item);
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
    // TODO : getHardwareBlockObject과의 병합 고려
    hardwareModules.forEach((hardware) => {
        try {
            if (hardware.hasPracticalCourse && EntryStatic.isPracticalCourse) {
                if (hardware.practicalBlockMenuBlocks) {
                    for (const category in hardware.practicalBlockMenuBlocks) {
                        EntryStatic.DynamicPracticalHardwareBlocks[category] = _union(
                            hardware.practicalBlockMenuBlocks[category],
                            EntryStatic.DynamicPracticalHardwareBlocks[category]
                        );
                    }
                }
            } else {
                EntryStatic.DynamicHardwareBlocks = _union(
                    hardware.blockMenuBlocks || [],
                    EntryStatic.DynamicHardwareBlocks || []
                );
            }
        } catch (err) {
            console.log(err, hardware);
        }
    });
}

module.exports = {
    getBlocks() {
        const hardwareModules = hardware.getHardwareModuleList();
        const hardwareLiteModules = hardwareLite.getHardwareLiteModuleList();
        registerHardwareBlockToStatic(hardwareModules);
        registerHardwareBlockToStatic(hardwareLiteModules);
        const basicAndExpansionBlockObjectList = getBlockObject(basicBlockList);
        const hardwareBlockObjectList = getHardwareBlockObject(hardwareModules);
        const hardwareLiteBlockObjectList = getHardwareBlockObject(hardwareLiteModules);
        return Object.assign(
            {},
            basicAndExpansionBlockObjectList,
            hardwareBlockObjectList,
            hardwareLiteBlockObjectList
        );
    },
    destroyBlockList,
};
