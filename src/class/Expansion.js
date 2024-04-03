import ExtraBlockUtils from '../util/extrablockUtils';

Entry.EXPANSION_BLOCK = {};
// import '../playground/blocks/block_expansion_weather';
// import '../playground/blocks/block_expansion_festival';
// import '../playground/blocks/block_expansion_behaviorconduct_disaster';
// import '../playground/blocks/block_expansion_behaviorconduct_lifesafety';
// require('../playground/blocks/block_expansion_weather');
// require('../playground/blocks/block_expansion_festival');
// require('../playground/blocks/block_expansion_behaviorconduct_disaster');
// require('../playground/blocks/block_expansion_behaviorconduct_lifesafety');

export default class Expansion {
    constructor(playground) {
        this.playground = playground;
        // this.init();
    }

    async init() {
        await Promise.all([
            import('../playground/blocks/block_expansion_weather'),
            import('../playground/blocks/block_expansion_festival'),
            import('../playground/blocks/block_expansion_behaviorconduct_disaster'),
            import('../playground/blocks/block_expansion_behaviorconduct_lifesafety'),
        ]);

        Entry.EXPANSION_BLOCK_LIST = {
            weather: Entry.Expansion_Weather,
            festival: Entry.EXPANSION_BLOCK.festival,
            behaviorConductDisaster: Entry.EXPANSION_BLOCK.behaviorConductDisaster,
            behaviorConductLifeSafety: Entry.EXPANSION_BLOCK.behaviorConductLifeSafety,
        };
        const items = Object.values(Entry.EXPANSION_BLOCK_LIST);
        const blockObject = {};
        items.forEach((item) => {
            try {
                if ('getBlocks' in item) {
                    Object.assign(blockObject, item.getBlocks());
                }
            } catch (err) {
                console.log(err, item);
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
