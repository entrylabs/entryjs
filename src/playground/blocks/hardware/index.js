'use strict';

/*
 * ex)
 * '1.1': Entry.Arduino,
 * '1.2': Entry.SensorBoard,
 * '1.3': Entry.CODEino,
 * '1.4': Entry.joystick,
 * '1.5': Entry.dplay
 * ...
 */
Entry.HARDWARE_LIST = {};
Entry.PRACTICAL_HARDWARE_BLOCK_LIST = {};

/*
 * index.js 를 제외한 해당 폴더의 모든 모듈을 import 한다.
 * 모듈은 id 가 있어야 등록된다.
 * 등록된 모듈은 Entry.HARDWARE_LIST 에 포함된다.
 * isPracticalCourse 속성값으로 교과형 하드웨어 여부를 판별하여 각 모듈리스트에 추가한다.
 */
const moduleListReq = require.context('.', false, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/im);

function addHardwareModule(module, id) {
    // 일반모드, 일반 하드웨어 > 리스트에만 추가
    // 일반모드, 교과용 하드웨어 > 추가안함
    // 교과모드, 일반 하드웨어 > 리스트에만 추가
    // 교과모드, 교과용 하드웨어 > 리스트에 추가, 모듈리스트에도 추가
    if (!module.isPracticalCourse) {
        Entry.HARDWARE_LIST[id] = module;
    } else if (EntryStatic.isPracticalCourse) {
        Entry.HARDWARE_LIST[id] = module;
        Object.assign(Entry.PRACTICAL_HARDWARE_BLOCK_LIST, module.getBlocks ?? module.getBlocks());
        EntryStatic.hwMiniSupportList.push(module.name);
    }
}

function addHardwareList(module) {
    if (typeof module.id === 'string') {
        addHardwareModule(module, module.id);
    } else if (module.id instanceof Array) {
        module.id.forEach((id) => {
            addHardwareModule(module, id);
        });
    }
}

function getHardwareModuleList() {
    return Object.values(Entry.HARDWARE_LIST);
}

function getPracticalCourseHardwareBlockList() {
    return Entry.PRACTICAL_HARDWARE_BLOCK_LIST;
};

function getHardwareModule(hardware, callback) {
    return new Promise((resolve) => {
        require.ensure([], function (require) {
            resolve(require('./' + hardware));
        });
    });
}

moduleListReq.keys().forEach((fileName) => {
    const module = moduleListReq(fileName);

    if (module instanceof Array) {
        module.forEach(addHardwareList);
    } else {
        addHardwareList(module);
    }
});

module.exports = {
    getHardwareModuleList,
    getPracticalCourseHardwareBlockList
};
