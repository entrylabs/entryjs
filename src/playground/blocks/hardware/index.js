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

/*
 * index.js 를 제외한 해당 폴더의 모든 모듈을 import 한다.
 * 모듈은 id 가 있어야 등록된다.
 * 등록된 모듈은 Entry.HARDWARE_LIST 에 포함된다.
 */
const moduleListReq = require.context('.', false, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/im);
moduleListReq.keys().forEach((fileName) => {
    const module = moduleListReq(fileName);
    const addHardwareList = (module) => {
        if (typeof module.id === 'string') {
            Entry.HARDWARE_LIST[module.id] = module;
        } else if (module.id instanceof Array) {
            module.id.forEach((id) => {
                Entry.HARDWARE_LIST[id] = module;
            });
        }
    };

    if (module instanceof Array) {
        module.forEach(addHardwareList);
    } else {
        addHardwareList(module);
    }
});

function getHardwareModule(hardware, callback) {
    return new Promise((resolve) => {
        require.ensure([], function(require) {
            resolve(require('./' + hardware));
        });
    });
}

module.exports = {
    getHardwareModuleList() {
        return Object.values(Entry.HARDWARE_LIST);
    },
};
