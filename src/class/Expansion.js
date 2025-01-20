import ExtraBlockUtils from '../util/extrablockUtils';
import '../playground/blocks/block_expansion_weather';
import '../playground/blocks/block_expansion_festival';
import '../playground/blocks/block_expansion_behaviorconduct_disaster';
import '../playground/blocks/block_expansion_behaviorconduct_lifesafety';
import '../playground/blocks/block_expansion_emergencyActionGuidelines';
import '../playground/blocks/block_expansion_disasterAlert';

export default class Expansion {
    constructor(playground) {
        this.playground = playground;
    }

    async init() {
        const blockObject = {};
        Object.entries(Entry.EXPANSION_BLOCK).forEach(([key, value]) => {
            if (!value.disabled) {
                Entry.EXPANSION_BLOCK_LIST[key] = value;
            }
            if ('getBlocks' in value) {
                Object.assign(blockObject, value.getBlocks());
            }
        });
        Entry.block = Object.assign(Entry.block, blockObject);
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
