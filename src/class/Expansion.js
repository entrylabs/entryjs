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
}
