import * as Utils from './extUtils';

export default class Expansion {
    constructor(playground) {
        this.playground = playground;
    }

    banAllExpansionBlock() {
        Utils.banAllBlocks(this.playground, Entry.EXPANSION_BLOCK_LIST);
    }

    banExpansionBlocks(expansionNames = []) {
        Utils.banListedBlocks(
            expansionNames,
            Entry.EXPANSION_BLOCK_LIST,
            'objectRemoveExpansionBlocks'
        );
    }

    isActive(expansionName) {
        return Utils.isActive(Entry.EXPANSION_BLOCK_LIST, expansionName);
    }

    addExpansionBlocks(blockNames) {
        Entry.do('objectAddExpansionBlocks', blockNames);
    }

    getExpansions(blockList) {
        return Utils.getBlocks('category_expansion', blockList);
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
