import InputPopup from './InputPopup';

export const classes = [
    'ai_learning_image',
    'ai_learning_speech'
];

class Classification {
    #type = null;
    #url = '';
    #labels = [];
    #recordTime = 2000;
    #popup = null;

    constructor({ url, labels, type, recordTime }) {
        this.#type = type;
        this.#url = url;
        this.#labels = labels;
        this.#recordTime = recordTime;
    }

    getResult(index) {
        const result = this.#popup?.result || [];
        const defaultResult = {probability: 0, className: ''};
        if(index !== undefined && index > -1) {
            return result.find(({className}) => className === this.#labels[index]) || defaultResult;
        }
        return result[0] || defaultResult;
    }

    unbanBlocks(blockMenu) {
        blockMenu.unbanClass(`ai_learning_classification`);
        if (this.#type) {
            blockMenu.unbanClass(`ai_learning_${this.#type}`);
        }
    }

    openInputPopup() {
        this.#popup = new InputPopup({
            url: this.#url, 
            labels: this.#labels,
            type: this.#type,
            recordTime: this.#recordTime
        });
        this.#popup.open();
    }
}

export default Classification;
