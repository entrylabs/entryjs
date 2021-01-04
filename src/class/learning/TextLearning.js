import Bayes, { fromJson } from './bayes';
import InputPopup from './InputPopup';

const { callApi } = require('../../util/common');

export const classes = [
    'ai_learning_classification',
    'ai_learning_text'
];

class TextNaiveBaye {
    #type = 'text';
    #url = '';
    #labels = [];
    #popup = null;
    #result = [];
    constructor({ url, labels }) {
        this.#url = url;
        this.#labels = labels;
        this.classifier = new Bayes({
            tokenizer: this.tokenizer,
        });
        this.load(`/uploads/${url}/model.json`);
    }

    unbanBlocks(blockMenu) {
        blockMenu.unbanClass(`ai_learning_classification`);
        blockMenu.unbanClass(`ai_learning_text`);
    }

    isAvailable() {
        if (!this.isLoaded) {
            throw new Error('ai learning text model load error');
        }
        return true;
    }

    getResult(index) {
        const result = this.#result.length ? this.#result : this.#popup?.result || [];
        const defaultResult = {probability: 0, className: ''};
        if(index !== undefined && index > -1) {
            return result.find(({className}) => className === this.#labels[index]) || defaultResult;
        }
        return result[0] || defaultResult;
    }

    openInputPopup() {
        const isAvailable = this.isAvailable();
        if (!isAvailable) {
            return;
        }
        this.#result = [];
        this.#popup = new InputPopup({
            url: this.#url, 
            labels: this.#labels,
            type: this.#type
        });
        this.#popup.open();
    }

    async tokenizer(text) {
        const params = { q: text };
        try {
            const { data } = await callApi(text, { url: '/learning/mecab', params });
            return data;
        } catch (e) {
            return text.split(/[^A-Za-zㄱ-힣0-9]+/);
        }
    }

    async predict(text) {
        this.#result = await this.classifier.categorize(text);
        return this.#result;
    }

    async load(url) {
        const { data } = await callApi(url, { url });
        this.classifier = fromJson(JSON.stringify(data));
        this.classifier.tokenizer = this.tokenizer;
        this.isLoaded = true;
    }
}

export default TextNaiveBaye;
