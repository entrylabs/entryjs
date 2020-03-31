export default class AILearning {
    #playground;
    #categoryName = 'ai_learning';
    #labels = [];

    constructor(playground) {
        this.#playground = playground;
    }

    get labels() {
        return this.#labels;
    }

    async load(url, labels = []) {
        this.#labels = labels;
        this.unbanBlocks();
        if(this.#playground) {
            this.#playground.reloadPlayground()
        }
    }

    unbanBlocks() {
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.unbanClass(this.#categoryName);
        }
    }

    banBlocks() {
        const blockMenu =  this.getBlockMenu(this.#playground);
        if (blockMenu) {
            blockMenu.banClass(this.#categoryName);
        }
    }

    getBlockMenu = (playground) => {
        const { mainWorkspace } = playground;
        if (!mainWorkspace) {
            return;
        }

        const blockMenu = _.result(mainWorkspace, 'blockMenu');
        if (!blockMenu) {
            return;
        }
        return blockMenu;
    }

    destroy() {
        this.#labels = [];
    }
}
