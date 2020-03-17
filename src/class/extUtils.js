export function banAllBlocks(playground, blockList) {
    const { mainWorkspace } = playground;
    if (!mainWorkspace) {
        return;
    }

    const blockMenu = _.result(mainWorkspace, 'blockMenu');
    if (!blockMenu) {
        return;
    }

    Object.values(blockList).forEach((block) => {
        blockMenu.banClass(block.name, true);
        blockMenu.banClass(`${block.name}_legacy`, true);
    });
}

export function banListedBlocks(blockNames = [], globalList, action) {
    if (!blockNames.length) {
        return;
    }
    const blocks = Object.keys(globalList);
    const types = blockNames.filter((x) => blocks.includes(x));
    if (!types.length) {
        console.warn('not exist', types);
        return;
    }
    const currentObjectId = Entry.playground.object.id;
    Entry.do('selectObject', currentObjectId);
    types.forEach((block) => {
        if (isActive(globalList, block)) {
            const blocks = globalList[block].getBlocks();
            Object.keys(blocks).forEach((blockType) => {
                Entry.Utils.removeBlockByType(blockType);
            });
        }
    });
    Entry.do('selectObject', currentObjectId).isPass(true);
    Entry.do(action, types).isPass(true);
}

export function isActive(globalList, name) {
    const exists = globalList[name];
    if (!exists) {
        console.warn('not exist', exists);
        return;
    }
    const blocks = exists.getBlocks();
    return Object.keys(blocks).some((blockName) => Entry.Utils.isUsedBlockType(blockName));
}

export function getBlocks(category, blockList) {
    let list = [];
    blockList.forEach((block) => {
        const { _schema = {} } = block || {};
        const { isFor, isNotFor = [] } = _schema;
        const [keys] = isNotFor;
        if (keys && isFor && isFor.indexOf(category) >= 0) {
            list = _.union(list, [keys]);
        }
    });
    return list;
}
