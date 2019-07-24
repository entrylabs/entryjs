/**
 * doxdox 'src/class/Expansion.js' --layout markdown --output documentation/src/class/Expansion.md
 *
 * Class for a ExpansionBlock.
 * This defines base structure for Expansion blocks.
 * 현재 `**playground**` 객체를 받아들이는 생성자
 * @constructor
 */
export default class Expansion {
    constructor(playground) {
        this.playground = playground;
    }
    /**
     * 확장블럭 전체 제거
     */
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
    /**
     * 확장블럭 제거
     */
    banExpansionBlock(blockName) {
        Entry.do('objectRemoveExpansionBlock', blockName);
    }
    /**
     * 확장블럭 추가
     */
    addExpansionBlock(blockName) {
        Entry.do('objectAddExpansionBlock', blockName);
    }
    /**
     * 확장블럭만 리턴하는 필터
     * @param {Entry.Block[]} getBlockList
     * @return {Entry.Block[]} expansionList
     */
    getExpansions(blockList) {
        let expansionList = [];
        const expansionBlockList = Object.keys(Entry.EXPANSION_BLOCK_LIST);
        blockList.forEach((block) => {
            const { _schema = {} } = block || {};
            const { isFor, isNotFor = [] } = _schema;
            const [expansionKey] = isNotFor;
            if (expansionKey && isFor.indexOf('category_expansion') >= 0) {
                expansionList = _.union(expansionList, [expansionKey]);
            }
        });
        return expansionList;
    }
    /**
     * destroy Interface
     */
    destroy() {
        // 우선 interface 만 정의함.
    }
}
