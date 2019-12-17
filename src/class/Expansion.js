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

    banExpansionBlocks(expansionNames = []) {
        if (!expansionNames.length) {
            return;
        }
        const expansions = Object.keys(Entry.EXPANSION_BLOCK_LIST);
        const expansionTypes = expansionNames.filter((x) => expansions.includes(x));
        if (!expansionTypes.length) {
            console.warn('not exist expansion', expansionTypes);
            return;
        }
        const currentObjectId = Entry.playground.object.id;
        Entry.do('selectObject', currentObjectId);
        expansionTypes.forEach((expansion) => {
            if (this.isActive(expansion)) {
                const blocks = Entry.EXPANSION_BLOCK_LIST[expansion].getBlocks();
                Object.keys(blocks).forEach((blockType) => {
                    Entry.Utils.removeBlockByType(blockType);
                });
            }
        });
        Entry.do('selectObject', currentObjectId).isPass(true);
        Entry.do('objectRemoveExpansionBlocks', expansionTypes).isPass(true);
    }

    isActive(expansionName) {
        const expansion = Entry.EXPANSION_BLOCK_LIST[expansionName];
        if (!expansion) {
            console.warn('not exist expansion', expansion);
            return;
        }
        const blocks = expansion.getBlocks();
        return Object.keys(blocks).some((blockName) => Entry.Utils.isUsedBlockType(blockName));
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
