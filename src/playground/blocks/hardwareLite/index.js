'use strict';

Entry.HARDWARE_LITE_LIST = {};

const moduleListReq = require.context('.', false, /^(?!.*index.js)((.*_lite\.(js))*$)/im);
const metaDataListReq = require.context('.', false, /^(?!.*index.js)((.*_lite\.(json))*$)/im);

function addHardwareLiteList(module) {
    if (typeof module.id === 'string') {
        Entry.HARDWARE_LITE_LIST[module.id] = module;
    } else if (module.id instanceof Array) {
        module.id.forEach((id) => {
            Entry.HARDWARE_LITE_LIST[id] = module;
        });
    }
}

function initHardwareLiteList() {
    moduleListReq.keys().forEach((fileName) => {
        const module = moduleListReq(fileName);

        if (module instanceof Array) {
            module.forEach(addHardwareLiteList);
        } else {
            addHardwareLiteList(module);
        }
    });

    metaDataListReq.keys().forEach((fileName) => {
        const metaData = metaDataListReq(fileName);
        const moduleId = `${metaData.moduleId.substring(0, 2).replace(/(^0+)/, "")}.${metaData.moduleId.substring(2, 4).replace(/(^0+)/, "")}`;

        if (Entry.HARDWARE_LITE_LIST[moduleId]) {
            Entry.HARDWARE_LITE_LIST[moduleId].title = { ko: metaData.title };
            Entry.HARDWARE_LITE_LIST[moduleId].description = metaData.description;
            Entry.HARDWARE_LITE_LIST[moduleId].linkBox = { desc: '고객센터', url: Entry.HARDWARE_LITE_LIST[moduleId].url }
        } else {
            console.error(`Error, HardwareLiteID ${moduleId} not contain module`);
        };
    });
}

function getHardwareLiteModuleList() {
    return Object.values(Entry.HARDWARE_LITE_LIST);
}

initHardwareLiteList();

module.exports = {
    getHardwareLiteModuleList,
};