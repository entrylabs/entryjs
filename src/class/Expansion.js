import ExtraBlockUtils from '../util/extrablockUtils';

export default class Expansion {
    constructor(playground) {
        this.playground = playground;
    }

    banAllExpansionBlock() {
        ExtraBlockUtils.banAllBlocks(this.playground, Entry.EXPANSION_BLOCK_LIST);
    }

    banExpansionBlocks(expansionNames) {
        ExtraBlockUtils.banBlocks(expansionNames, Entry.EXPANSION_BLOCK_LIST, (expansionTypes) =>
            Entry.do('objectRemoveExpansionBlocks', expansionTypes).isPass(true)
        );
    }

    isActive(expansionName) {
        return ExtraBlockUtils.isActive(expansionName, Entry.EXPANSION_BLOCK_LIST);
    }

    addExpansionBlocks(blockNames) {
        Entry.do('objectAddExpansionBlocks', blockNames);
    }

    getExpansions(blockList) {
        return ExtraBlockUtils.getExtras(blockList, 'category_expansion');
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
