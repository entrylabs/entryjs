export default class AIUtilize {
    constructor(playground) {
        this.playground = playground;
    }

    banAllAIUtilizeBlock() {
        const { mainWorkspace } = this.playground;
        if (!mainWorkspace) {
            return;
        }

        const blockMenu = _.result(mainWorkspace, 'blockMenu');
        if (!blockMenu) {
            return;
        }

        Object.values(Entry.AI_UTILIZE_BLOCK_LIST).forEach((block) => {
            blockMenu.banClass(block.name, true);
            blockMenu.banClass(`${block.name}_legacy`, true);
        });
    }

    banAIUtilizeBlocks(aiUtilizeNames = []) {
        if (!aiUtilizeNames.length) {
            return;
        }
        const aiUtilizes = Object.keys(Entry.AI_UTILIZE_BLOCK_LIST);
        const aiUtilizeTypes = aiUtilizeNames.filter((x) => aiUtilizes.includes(x));
        if (!aiUtilizeTypes.length) {
            console.warn('not exist aiUtilize', aiUtilizeTypes);
            return;
        }
        const currentObjectId = Entry.playground.object.id;
        Entry.do('selectObject', currentObjectId);
        aiUtilizeTypes.forEach((aiUtilize) => {
            if (this.isActive(aiUtilize)) {
                const blocks = Entry.AI_UTILIZE_BLOCK_LIST[aiUtilize].getBlocks();
                Object.keys(blocks).forEach((blockType) => {
                    Entry.Utils.removeBlockByType(blockType);
                });
            }
        });
        Entry.do('selectObject', currentObjectId).isPass(true);
        Entry.do('objectRemoveAIUtilizeBlocks', aiUtilizeTypes).isPass(true);
    }

    isActive(aiUtilizeName) {
        const aiUtilize = Entry.AI_UTILIZE_BLOCK_LIST[aiUtilizeName];
        if (!aiUtilize) {
            console.warn('not exist aiUtilize', aiUtilize);
            return;
        }
        const blocks = aiUtilize.getBlocks();
        return Object.keys(blocks).some((blockName) => Entry.Utils.isUsedBlockType(blockName));
    }

    addAIUtilizeBlocks(blockNames) {
        Entry.do('objectAddAIUtilizeBlocks', blockNames);
    }

    getAIUtilizes(blockList) {
        let aiUtilizeList = [];
        const aiUtilizeBlockList = Object.keys(Entry.AI_UTILIZE_BLOCK_LIST);
        blockList.forEach((block) => {
            const { _schema = {} } = block || {};
            const { isFor, isNotFor = [] } = _schema;
            const [aiUtilizeKey] = isNotFor;
            if (aiUtilizeKey && isFor && isFor.indexOf('category_ai_utilize') >= 0) {
                aiUtilizeList = _.union(aiUtilizeList, [aiUtilizeKey]);
            }
        });
        return aiUtilizeList;
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
