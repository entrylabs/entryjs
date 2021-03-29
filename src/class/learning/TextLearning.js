import Bayes, { fromJson } from './bayes';

const { callApi } = require('../../util/common');

class TextNaiveBaye {
    constructor() {
        this.classifier = new Bayes({
            tokenizer: this.tokenizer,
        });
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
        return await this.classifier.categorize(text);
    }

    async load(url) {
        const { data } = await callApi(url, { url });
        this.classifier = fromJson(JSON.stringify(data));
        this.classifier.tokenizer = this.tokenizer;
    }
}

export default TextNaiveBaye;
