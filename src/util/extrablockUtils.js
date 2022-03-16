const banAllBlocks = (playground, type) => {
    const { mainWorkspace } = playground;
    if (!mainWorkspace) {
        return;
    }

    const blockMenu = _.result(mainWorkspace, 'blockMenu');
    if (!blockMenu) {
        return;
    }

    Object.values(type).forEach((block) => {
        blockMenu.banClass(block.name, true);
        blockMenu.banClass(`${block.name}_legacy`, true);
        blockMenu.banClass(`${block.name.toLowerCase()}`, true);
    });
};

const banBlocks = (blockNames = [], typedList, callback) => {
    if (!blockNames.length) {
        return;
    }

    const extraBlocks = Object.keys(typedList);
    const extraBlockTypes = blockNames.filter((x) => extraBlocks.includes(x));
    if (!extraBlockTypes.length) {
        console.warn('not exist extra block', extraBlockTypes);
        return;
    }
    const currentObjectId = Entry.playground.object.id;
    Entry.do('selectObject', currentObjectId);
    extraBlockTypes.forEach((type) => {
        if (isActive(type, typedList)) {
            const blocks = typedList[type].getBlocks();
            Object.keys(blocks).forEach((blockType) => {
                Entry.Utils.removeBlockByType(blockType);
            });
        }
    });
    Entry.do('selectObject', currentObjectId).isPass(true);
    callback(extraBlockTypes);
};

const isActive = (name, typedList) => {
    const activeList = typedList[name];
    if (!activeList) {
        console.warn('not exist extra block', activeList);
        return;
    }
    const blocks = activeList.getBlocks();
    return Object.keys(blocks).some((blockName) => Entry.Utils.isUsedBlockType(blockName));
};

const getExtras = (blockList, categoryFlag) => {
    let resultList = [];
    blockList.forEach((block) => {
        const { _schema = {} } = block || {};
        const { isFor, isNotFor = [] } = _schema;
        const [key] = isNotFor;
        if (key && isFor && isFor.indexOf(categoryFlag) >= 0) {
            resultList = _.union(resultList, [key]);
        }
    });
    return resultList;
};

module.exports = {
    isActive,
    banAllBlocks,
    banBlocks,
    getExtras,
};
