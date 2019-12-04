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

    banExpansionBlocks(blockNames = []) {
        if (blockNames.length < 1) {
            return;
        }
        const expansions = Object.keys(Entry.EXPANSION_BLOCK_LIST);
        const blockTypes = blockNames.filter((x) => expansions.includes(x));
        if (blockTypes.length < 1) {
            console.warn('not exist blockType', blockTypes);
            return;
        }
        const currentObjectId = Entry.playground.object.id;
        Entry.do('selectObject', currentObjectId);
        blockTypes.forEach((blockType) => {
            const blocks = Entry.EXPANSION_BLOCK_LIST[blockType].getBlocks();
            Object.keys(blocks).forEach((blockType) => {
                Entry.Utils.removeBlockByType(blockType);
            });
        });
        Entry.do('selectObject', currentObjectId).isPass(true);
        Entry.do('objectRemoveExpansionBlocks', blockNames).isPass(true);
    }

    addExpansionBlocks(blockNames) {
        Entry.do('objectAddExpansionBlocks', blockNames);
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
