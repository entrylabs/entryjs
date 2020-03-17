import * as Utils from './extUtils';

export default class AIUtilize {
    constructor(playground) {
        this.playground = playground;
    }

    banAllAIUtilizeBlock() {
        Utils.banAllBlocks(this.playground, Entry.AI_UTILIZE_BLOCK_LIST);
    }

    banAIUtilizeBlocks(aiUtilizeNames = []) {
        Utils.banListedBlocks(
            aiUtilizeNames,
            Entry.AI_UTILIZE_BLOCK_LIST,
            'objectRemoveAIUtilizeBlocks'
        );
    }

    isActive(aiUtilizeName) {
        return Utils.isActive(Entry.AI_UTILIZE_BLOCK_LIST, aiUtilizeName);
    }

    addAIUtilizeBlocks(blockNames) {
        Entry.do('objectAddAIUtilizeBlocks', blockNames);
    }

    getAIUtilizes(blockList) {
        return Utils.getBlocks('category_ai_utilize', blockList);
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
