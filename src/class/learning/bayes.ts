import sortBy from 'lodash/sortBy';

const defaultTokenizer = function(text: string) {
    const rgxPunctuation = /[^(a-zA-ZA-Яa-я0-9_)+\s]/g;
    const sanitized = text.replace(rgxPunctuation, ' ');
    return sanitized.split(/\s+/);
};

class Naivebayes {
    static STATE_KEYS: Array<keyof Naivebayes> = [
        'categories',
        'docCount',
        'totalDocuments',
        'vocabulary',
        'vocabularySize',
        'wordCount',
        'wordFrequencyCount',
        'options'
    ];
    public options: {
        tokenizer?: Function;
    } = {};
    public vocabulary: {[key: string]: boolean}  = {};
    public tokenizer: Function;
    public vocabularySize= 0;
    public totalDocuments= 0;
    public docCount:  {[key: string]: number} = {};
    public wordCount:  {[key: string]: number} = {};
    public wordFrequencyCount:  {[key: string]: any}= {};
    public categories: {[key: string]: boolean} = {};

    constructor(options: any) {
        if (typeof options !== 'undefined') {
            if (!options || typeof options !== 'object' || Array.isArray(options)) {
                throw TypeError(`NaiveBayes got invalid options: ${options}. Pass in an object.`);
            }
            this.options = options;
        }
        this.tokenizer = this.options.tokenizer || defaultTokenizer;
    }

    public frequencyTable(tokens: Array<string>) {
        return tokens.reduce((acc: {[key: string]: number}, cur: string) => {
            if (!acc[cur]) {
                acc[cur] = 0;
            }
            acc[cur] = acc[cur] + 1;
            return acc;
        }, {});
    }

    public initializeCategory(categoryName: string) {
        if (!this.categories[categoryName]) {
            this.docCount[categoryName] = 0;
            this.wordCount[categoryName] = 0;
            this.wordFrequencyCount[categoryName] = {};
            this.categories[categoryName] = true;
        }
        return this;
    }

    public async learn(text: string, category: string) {
        this.initializeCategory(category);
        this.docCount[category]++;
        this.totalDocuments++;
        const tokens = await this.tokenizer(text);
        const frequencyTable = this.frequencyTable(tokens);

        Object
            .keys(frequencyTable)
            .forEach((token) => {
                if (!this.vocabulary[token]) {
                    this.vocabulary[token] = true;
                    this.vocabularySize++;
                }
                const frequencyInText = frequencyTable[token];

                if (!this.wordFrequencyCount[category][token]) {
                    this.wordFrequencyCount[category][token] = frequencyInText;
                } else {
                    this.wordFrequencyCount[category][token] += frequencyInText;
                }
                this.wordCount[category] += frequencyInText;
            });
        return this;
    }

    public async categorize(text: string) {
        // let maxProbability = -Infinity;
        // let chosenCategory = null;
        let totalProbabilities = 0;
        const categoryProbabilities: {[key: string]: number} = {};
        const tokens = await this.tokenizer(text);
        const frequencyTable = this.frequencyTable(tokens);
        Object
            .keys(this.categories)
            .forEach((category) => {
                const categoryProbability = this.docCount[category] / this.totalDocuments;
                let logProbability = Math.log(categoryProbability);
                Object
                    .keys(frequencyTable)
                    .forEach((token) => {
                        const frequencyInText = frequencyTable[token];
                        const tokenProbability = this.tokenProbability(token, category);
                        logProbability += frequencyInText * Math.log(tokenProbability);
                    });
                // if (logProbability > maxProbability) {
                //     maxProbability = logProbability;
                //     chosenCategory = category;
                // }
                const expected = Math.exp(logProbability);
                totalProbabilities = totalProbabilities + expected;
                categoryProbabilities[category] = expected;
            });
        const probabilities = Object
            .keys(categoryProbabilities)
            .map((category) => ({
                className: category,
                probability: categoryProbabilities[category] /= totalProbabilities
            }));
        return sortBy(probabilities,['probability']).reverse();
    }

    private tokenProbability(token: string, category: string) {
        const wordFrequencyCount = this.wordFrequencyCount[category][token] || 0;
        const wordCount = this.wordCount[category];
        return (wordFrequencyCount + 1) / (wordCount + this.vocabularySize);
    }

    public toJson() {
        const state = Naivebayes.STATE_KEYS.reduce(
            (acc: {[key: string]: any}, cur: keyof Naivebayes) => {
                acc[cur] = this[cur];
                return acc;
            }, {});
        return JSON.stringify(state);
    }
}

export function fromJson(jsonStr: string) {
    try {
        const parsed = JSON.parse(jsonStr);
        const classifier = new Naivebayes(parsed.options);
        Naivebayes.STATE_KEYS.forEach((k: keyof Naivebayes) => {
            if (typeof parsed[k] === 'undefined' || parsed[k] === null) {
                throw new Error(`FromJson: JSON string is missing an expected property: ${k}.`);
            }
            classifier[k] = parsed[k];
        });

        return classifier;
    } catch (e) {
        throw new Error('Naivebayes.fromJson expects a valid JSON string.')
    }
}

export default Naivebayes;

