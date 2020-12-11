import LearningView from './LearningView';
import Chart from './Chart';
const { callApi } = require('../../util/common');
import _uniq from 'lodash/uniq';
import _floor from 'lodash/floor';
import _sum from 'lodash/sum';
import _mean from 'lodash/mean';

export const classes = [
    'ai_learning_train',
    'ai_learning_number',
    'number_learning_attr_1',
    'number_learning_attr_2',
    'number_learning_attr_3'
];

class NumberClassification {
    #attrLength = 0;
    #trainParam = null;
    #table = {};
    #trainCallback;
    #chart = null;
    #isTrained = false;
    #chartEnable = false;
    #view = null;
    #predictResult = null;
    #name = ''
    constructor({ name, url, table, trainParam }) {
        this.#view = new LearningView({ name, status: 0 });
        this.#name = name;
        this.#trainParam = trainParam;
        this.#table = table;
        this.#trainCallback = (value) => {
            this.#view.setValue(value)
        };;
        this.#isTrained = true;

        this.#attrLength = table?.select?.[0]?.length || 0;
        if (this.#attrLength === 2) {
            this.#chartEnable = true;
        }
        this.load(`/uploads/${url}/model.json`);
    }

    destroy() {
        this.#view.destroy();
        if(this.#chart) {
            this.#chart.destroy();
            this.#chart = null;
        }
    }

    createColor() {
        return this.#trainParam.labels.reduce((acc, cur, idx, arr) => {
            return {
                ...acc,
                [cur]: Entry.Utils.randomColor(),
            }
        }, {}); 
    }

    setVisible(visible) {
        this.#view.setVisible(visible);
    }

    unbanBlocks(blockMenu) {
        blockMenu.unbanClass(`ai_learning_train`);
        blockMenu.unbanClass(`ai_learning_number`);
        blockMenu.unbanClass(`number_learning_attr_${this.#attrLength}`);
        if (this.#chartEnable) {
            blockMenu.unbanClass('ai_learning_train_chart');
        }
    }

    isTrained() {
        return this.#isTrained;
    }

    openChart() {
        if (!this.#chartEnable) {
            return ;
        }
        if (!this.#chart) {
            this.#chart = new Chart({
                title: this.#name,
                source: this.chartData,
            });
        } else {
            this.#chart.show();
        }
    }

    closeChart() {
        if (this.#chart) {
            this.#chart.hide();
        }
    }

    setTrainOption(type, value) {
        this.#trainParam[type] = value;
    }

    getTrainOption() {
        return this.#trainParam;
    }

    getResult() {
        return this.#predictResult;
    }

    train() {
        this.#trainCallback(0);
        this.#isTrained = false;
        this.#chart = null;
        const { data: trainData, labels } = convertTableToKnnData(this.#table);
        const trainLabels = labels[0];
        const uniqLabels = _uniq(labels[0]).sort((a, b) => String(a).localeCompare(String(b)));
        const numLabels = uniqLabels.length;
        const maxVector = new Array(trainData[0].length).fill(-Infinity);
        trainData.forEach(e => {
            for (let i = 0; i < maxVector.length; i++) {
                maxVector[i] = maxVector[i] > e[i] ? maxVector[i] : e[i];
            }
        });

        const minVector = new Array(trainData[0].length).fill(Infinity);
        trainData.forEach(e => {
            for (let i = 0; i < minVector.length; i++) {
                minVector[i] = minVector[i] < e[i] ? minVector[i] : e[i];
            }
        });
        this.#trainParam = {
            ...this.#trainParam,
            trainData,
            trainLabels,
            labels: uniqLabels,
            numLabels,
            maxVector,
            minVector,
        };
        this.#trainCallback(100);
        this.#isTrained = true;
        this.colors = this.createColor();
    }

    async load(url) {
        const { data: savedData } = await callApi(url, { url });
        this.#trainParam.trainData = savedData.data;
        this.#trainParam.trainLabels = savedData.labels;
        this.#trainParam.labels = _uniq(savedData.labels).sort((a, b) => String(a).localeCompare(String(b)));
        this.#trainParam.maxVector = savedData.maxVector;
        this.#trainParam.minVector = savedData.minVector;
        this.#trainParam.numLabels = savedData.numLabels;
        this.#trainParam.neighbors = savedData.neighbors;
        this.#trainParam.isLoaded = true;
        this.colors = this.createColor();
    }

    normalize(data = []) {
        const normData = [];
        const { minVector, maxVector } = this.#trainParam;
        for (let i = 0; i < data.length; i++) {
            normData.push((data[i] - minVector[i]) / (maxVector[i] - minVector[i]));
        }
        return normData;
    }

    predict(data) {
        let distData = [];
        const { trainData, trainLabels, neighbors } = this.#trainParam;

        for (let i = 0; i < trainData.length; i++) {
            let dist = eudist(this.normalize(data), this.normalize(trainData[i]));
            distData.push({
                "index": i,
                "dist": dist,
                "label": trainLabels[i]
            });
        }

        distData.sort((a, b) => a.dist - b.dist);
       
        let counts = {};
        for (let i = 0; i < neighbors; i++) {
            const { label, dist } = distData[i];
            if (!counts[label]) {
                counts[label] = []
            }
            counts[label].push(dist);
        }

        const totalDistance = _sum(Object.values(counts).flat());
        this.#predictResult = Object.keys(counts).map(className => {
            const dist = _mean(counts[className]);
            const count = counts[className].length;
            const distProbability = totalDistance === 0 ? 1 : (totalDistance - dist) / totalDistance;
            const probability = (count / neighbors) * 99 + distProbability;
            return {
                className,
                count,
                probability
            }
        }).sort((a, b) => b.probability - a.probability);
        return this.#predictResult;
    }
    
    findColor(id, a, b) {
        if (id === 'y') {
            const index = this.#trainParam.trainData.findIndex((row) => row[0] === a && row[1] === b);
            const type = this.#trainParam.trainLabels[index];
            return this.colors[type];
        }
        return undefined;
    }

    get chartData() {
        const json = this.#trainParam.trainData.map((row, idx) => ({
            x: row[0], 
            y: row[1],
            index: this.#trainParam.trainLabels[idx],
        }));
        return {
            data: {
                type: 'scatter',
                json,
                keys: { value: ['y'], x: 'x', },
                color: (color, d) => this.findColor(d.id, d.x, d.value) || color,
                labels: false,
            },
            options: {
                point: {
                    pattern: [
                        "circle",
                        "<g><circle cx='10' cy='10' r='10'></circle><rect x='5' y='5' width='10' height='10' style='fill:#fff'></rect></g>"
                    ]
                },
                legend: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                axis: {
                    x: {
                        tick: {
                            fit: false,
                            count: 5
                        },
                    }
                },
                grid: {
                    x: {
                        show: true
                    },
                    y: {
                        show: true
                    }
                }
            }
        }
    }
};

export default NumberClassification;

function eudist(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        let d = (a[i] || 0) - (b[i] || 0);
        sum += d * d;
    }

    return sum;
}

function convertTableToKnnData(tableData) {
    const { select = [[0], [1]], data: table } = tableData;
    const [attr, predict] = select;
    return table.reduce((accumulator, row) => {
        const { data = [], labels = [] } = accumulator;
        return {
            data: [
                ...data,
                row.filter((data, index) => attr.includes(index))
            ],
            labels: predict.map((i, idx) => {
                const arr = labels[idx] || [];
                return [...arr, row[i]];
            }),
        };
    }, { data: [], labels: [] });
}