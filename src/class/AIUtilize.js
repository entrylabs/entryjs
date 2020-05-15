import ExtraBlockUtils from '../util/extrablockUtils';

export default class AIUtilize {
    constructor(playground) {
        this.playground = playground;
    }

    banAllAIUtilizeBlock() {
        ExtraBlockUtils.banAllBlocks(this.playground, Entry.AI_UTILIZE_BLOCK_LIST);
    }

    banAIUtilizeBlocks(aiUtilizeNames = []) {
        ExtraBlockUtils.banBlocks(aiUtilizeNames, Entry.AI_UTILIZE_BLOCK_LIST, (aiUtilizeTypes) =>
            Entry.do('objectRemoveAIUtilizeBlocks', aiUtilizeTypes).isPass(true)
        );
    }

    isActive(aiUtilizeName) {
        return ExtraBlockUtils.isActive(aiUtilizeName, Entry.AI_UTILIZE_BLOCK_LIST);
    }

    addAIUtilizeBlocks(blockNames) {
        Entry.do('objectAddAIUtilizeBlocks', blockNames);
    }

    getAIUtilizes(blockList) {
        return ExtraBlockUtils.getExtras(blockList, 'category_ai_utilize');
        // let aiUtilizeList = [];
        // blockList.forEach((block) => {
        //     const { _schema = {} } = block || {};
        //     const { isFor, isNotFor = [] } = _schema;
        //     const [aiUtilizeKey] = isNotFor;
        //     if (aiUtilizeKey && isFor && isFor.indexOf('category_ai_utilize') >= 0) {
        //         aiUtilizeList = _.union(aiUtilizeList, [aiUtilizeKey]);
        //     }
        // });
        // return aiUtilizeList;
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
