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

    banAIUtilizeBlock(blockName) {
        Entry.do('objectRemoveAIUtilizeBlock', blockName);
    }

    addAIUtilizeBlock(blockName) {
        Entry.do('objectAddAIUtilizeBlock', blockName);
    }

    getAIUtilizes(blockList) {
        let aiUtilizeList = [];
        const aiUtilizeBlockList = Object.keys(Entry.AI_UTILIZE_BLOCK_LIST);
        blockList.forEach((block) => {
            const { _schema = {} } = block || {};
            const { isFor, isNotFor = [] } = _schema;
            const [aiUtilizeKey] = isNotFor;
            if (aiUtilizeKey && isFor && isFor.indexOf('category_aiUtilize') >= 0) {
                aiUtilizeList = _.union(aiUtilizeList, [aiUtilizeKey]);
            }
        });
        return aiUtilizeList;
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
