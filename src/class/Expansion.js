export default class Expansion {
    constructor(playground) {
        this.playground = playground;
    }

    banAllExpansionBlock() {
        const { mainWorkspace } = this.playground;
        if (!mainWorkspace) {
            return;
        }

        const blockMenu = _.result(mainWorkspace, 'blockMenu');
        if (!blockMenu) {
            return;
        }

        Object.values(Entry.EXPANSION_BLOCK_LIST).forEach((block) => {
            blockMenu.banClass(block.name, true);
            blockMenu.banClass(`${block.name}_legacy`, true);
        });
    }

    banExpansionBlock(blockName) {
        Entry.do('objectRemoveExpansionBlock', blockName);
    }

    addExpansionBlock(blockName) {
        Entry.do('objectAddExpansionBlock', blockName);
    }

    getExpansions(blockList) {
        let expansionList = [];
        const expansionBlockList = Object.keys(Entry.EXPANSION_BLOCK_LIST);
        blockList.forEach((block) => {
            const { _schema = {} } = block || {};
            const { isFor, isNotFor = [] } = _schema;
            const [expansionKey] = isNotFor;
            if (expansionKey && isFor && isFor.indexOf('category_expansion') >= 0) {
                expansionList = _.union(expansionList, [expansionKey]);
            }
        });
        return expansionList;
    }

    destroy() {
        // 우선 interface 만 정의함.
    }
}
