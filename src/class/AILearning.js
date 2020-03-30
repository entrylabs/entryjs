import * as tf from '@tensorflow/tfjs';

export default class AILearning {
    initialized = false;
    loaded = false;
    #playground;
    #categoryName = 'ai_learning';
    #labels = [];
    #model;

    constructor(playground) {
        this.#playground = playground;
    }

    get labels() {
        return this.#labels;
    }

    async init() {
        this.initialized = true;
    }

    async load(url, labels = []) {
        this.#labels = labels;
        this.unbanBlocks();
        await this.init();
        this.#model = await tf.loadLayersModel(url);
        this.loaded = true;
        if(this.#playground) {
            this.#playground.reloadPlayground()
        }
    }

    async predict(canvas) {
        try {
            const data = this.preprocessImage(canvas);
            const result = await this.#model.predict(data);
            return await this.#namePredictions(result)
        } catch (e) {
            console.log(e);
            return '';
        }

    }

    #namePredictions = async (logits) => {
        const values = Array.from(await logits.data());
        return values
            .map((probability, index) => ({
                className: this.#labels[index] || index,
                probability,
                index,
            }));
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
        this.#model = null;
        this.#labels = null;
        this.initialized = false;
        this.loaded = false;
    }

    preprocessImage(canvas) {
        canvas.width = 224;
        canvas.height = 224;
        return tf.tidy(() => {
            const offset = tf.scalar(127.5);
            return tf.browser
                .fromPixels(canvas)
                .toFloat()
                .sub(offset)
                .div(offset)
                .expandDims(0);
        });
    }
}
