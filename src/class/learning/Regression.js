import * as tf from '@tensorflow/tfjs';
const { callApi } = require('../../util/common');
import _floor from 'lodash/floor';
import _max from 'lodash/max';
import LearningView from './LearningView';
import Chart from './Chart';
import _sum from 'lodash/sum';
import _mean from 'lodash/mean';

export const classes = [
    'ai_learning_train',
    'ai_learning_regression',
    'regression_attr_1',
    'regression_attr_2',
    'regression_attr_3',
    'ai_learning_train_chart'
];

class Regression {
    #attrLength = 0;
    #trainParam = null;
    #result = {};
    #table = {};
    #trainCallback;
    #chart = null;
    #isTrained = false;
    #chartEnable = false;
    #view = null;
    #model = null;
    #predictResult = null;
    #name = '';
    #fields = [];
    #predictFields = [];

    constructor({ name, url, result, table, trainParam }) {
        this.#view = new LearningView({ name, status: 0 });
        this.#name = name;
        this.#trainParam = trainParam;
        this.#result = result;
        this.#table = table;
        this.#trainCallback = (value) => {
            this.#view.setValue(value)
        };;
        this.#isTrained = true;

        this.#attrLength = table?.select?.[0]?.length || 0;
        if (this.#attrLength === 1) {
            this.#chartEnable = true;
        }
        this.load(`/uploads/${url}/model.json`);

        this.#fields = table?.select?.[0]?.map((index) => {
            return table?.fields[index];
        });
        this.#predictFields = table?.select?.[1]?.map((index) => {
            return table?.fields[index];
        });
    }
    
    destroy() {
        this.#view.destroy();
        if (this.#chart) {
            this.#chart.destroy();
            this.#chart = null;
        }
    }

    setVisible(visible) {
        this.#view.setVisible(visible);
    }

    unbanBlocks(blockMenu) {
        blockMenu.unbanClass(`ai_learning_train`);
        blockMenu.unbanClass(`ai_learning_regression`);
        blockMenu.unbanClass(`regression_attr_${this.#attrLength}`);
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
                source: this.chartData,
                title: this.#name,
                description: `
                    ${this.#fields.map((field, index) => `<em>${Lang.AiLearning.model_attr_str} ${index + 1}</em>: ${field}`)}
                    <em>${Lang.AiLearning.predict}</em>${this.#predictFields[0]}<em>${Lang.AiLearning.equation}</em>${this.#result.equation}
                `,
            });
        } else {
            this.#chart.show();
        }
    }

    closeChart() {
        this.#chart?.hide();
    }

    setTrainOption(type, value) {
        this.#trainParam[type] = value;
    }

    getTrainOption() {
        return this.#trainParam;
    }

    getTrainResult() {
        return this.#result;
    }

    getResult() {
        return this.#predictResult;
    }

    async train() {
        this.#isTrained = false;
        this.percent = 0;
        this.#trainCallback(1);
        const { inputs, outputs, totalDataSize } = convertToTfData(this.#table, this.#trainParam);
        const { model, trainHistory, a, b, graphData = [], rsquared } = await train(
            inputs,
            outputs,
            this.#trainParam,
            () => {
                this.percent = this.percent + 1;
                const percent = _floor((this.percent / totalDataSize) * 100);
                this.#trainCallback(Math.max(percent, 100));
            }
        );
        this.#model = model;
        const { acc = [] } = trainHistory?.history || {};
        const accuracy = _max(acc) || 0;
        if (inputs.length == 1) {
            graphData.predictedPoints.map(({ x, y }) => {
                const index = graphData.originalPoints.findIndex((p) => _floor(p.x, 1) === _floor(x, 1));
                if (graphData.originalPoints[index]) {
                    graphData.originalPoints[index].equation = y;
                }
            })
        }
        
        this.#result = {
            graphData: (graphData.originalPoints || []).slice(0, 1000),
            accuracy,
            rsquared,
            equation: `Y = ${a.map((a, i) => i === 0 ? `${a}X` : `${addSign(a)}X^${i + 1}`).join('')} ${addSign(b)}`
        }
        this.#isTrained = true;
        this.#chart?.load({
            source: this.chartData,
            description: `
                ${this.#fields.map((field, index) => `<em>${Lang.AiLearning.model_attr_str} ${index + 1}</em> ${field}`)}
                <em>${Lang.AiLearning.predict}</em> ${this.#predictFields[0]}<em>${Lang.AiLearning.equation}</em>${this.#result.equation}
            `
        });
        this.#trainCallback(100);
    }

    async load(url) {
        this.#model = await tf.loadLayersModel(url);
    }

    async predict(data) {
        return tf.tidy(() => {
            let convertedData;
            if(Array.isArray(data)) {
                convertedData = tf.tensor2d([data]);
            } else {
                convertedData = tf.tensor1d([data]);
            }
            const preds = this.#model.predict(convertedData);
            const [result] = preds.dataSync();
            this.#predictResult = _floor(result, 2);
            return this.#predictResult;
        });
    }

    get chartData() {
        return {
            data: {
                json: this.#result.graphData,
                keys: { value: ['equation', 'y'], x: 'x' },
                types: {
                    y: 'scatter',
                    equation: 'line'
                },
            },
            options: {
                legend: {
                    show: false
                },
                tooltip: {
                    contents: (data) =>{
                        const [{ x, value, id }] = data;
                        return `
                            <div class="chart_handle_wrapper">
                                ${this.#fields[0]}: ${x}, ${this.#predictFields[0]}: ${value}
                            <div>
                        `;
                    }
                },
                line: {
                    connectNull: true,
                    point: false,
                },
                axis: {
                    x: {
                        tick: {
                            fit: false,
                            count: 15
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
        };
    }
}

export default Regression;

function addSign(x) {
    return x < 0 ? x : `+${x}`;
}

function convertToTfData(data, trainParam) {
    const { select = [[0], [1]], data: table } = data;
    const [attr, predict] = select;
    const { epochs = 1, batchSize = 1 } = trainParam;
    const totalDataSize = Math.ceil(table.length / batchSize) * epochs;
    return table.reduce((accumulator, row) => {
        const { inputs = [], outputs = [] } = accumulator;
        return {
            inputs: attr.map((i, idx) => {
                const arr = inputs[idx] || [];
                return [...arr, parseFloat(row[i]) || 0];
            }),
            outputs: predict.map((i, idx) => {
                const arr = outputs[idx] || [];
                return [...arr, parseFloat(row[i]) || 0];
            }),
            totalDataSize,
        };
    }, { inputs: [], outputs: [] });
}

function convertToTensor(inputs, outputs) {
    return tf.tidy(() => {
        const inputTensor = tf.tensor2d(inputs).transpose();
        const outputTensor = tf.tensor2d(outputs).transpose();

        const inputMax = inputTensor.max(0);
        const inputMin = inputTensor.min(0);
        const outputMax = outputTensor.max(0);
        const outputMin = outputTensor.min(0);

        // (d - min) / (max - min)
        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedOutputs = outputTensor.sub(outputMin).div(outputMax.sub(outputMin));

        return {
            inputs: normalizedInputs,
            outputs: normalizedOutputs,
            inputMax,
            inputMin,
            outputMax,
            outputMin,
        };
    });
}

function createModel(inputShape) {
    const model = tf.sequential();

    model.add(tf.layers.dense({ inputShape: [inputShape], units: 1 }));
    model.summary();

    return model;
}

async function trainModel(
    model,
    inputs,
    outputs,
    trainParam,
    onBatchEnd,
    onEpochEnd) {
    model.compile({
        optimizer: tf.train.adam(trainParam.learningRate),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse', 'acc', 'ce']
    });

    return await model.fit(inputs, outputs, {
        batchSize: trainParam.batchSize,
        epochs: trainParam.epochs,
        shuffle: trainParam.shuffle,
        validationSplit: trainParam.validationRate,
        callbacks: {
            onBatchEnd,
            onEpochEnd,
        }
    });
}

const TEST_POINT_COUNT = 100;
function testModel(model, normalizationData) {
    const { inputMin, inputMax, outputMin, outputMax } = normalizationData;

    const [xs, preds] = tf.tidy(() => {
        const xs = tf.linspace(0, 1, TEST_POINT_COUNT);
        const preds = model.predict(xs.reshape([TEST_POINT_COUNT, 1]));

        // d * (max - min) + min
        const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);
        // @ts-ignore
        const unNormPreds = preds.mul(outputMax.sub(outputMin)).add(outputMin);
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    return Array.from(xs).map((val, i) => ({
        x: val,
        y: preds[i]
    }));
}

function getR2Score(model, normResult, y) {
    const yData = y[0];
    const yHat = model.predict(normResult.inputs).mul(normResult.outputMax.sub(normResult.outputMin)).add(normResult.outputMin).dataSync();
    const yMean = yData.reduce((acc, cur) => acc + cur) / yData.length;

    const ssr = yHat.map((e, index) => (e - yData[index]) * (e - yData[index])).reduce((acc, cur) => acc + cur);
    const sst = yData.map(e => (e - yMean) * (e - yMean)).reduce((acc, cur) => acc + cur);
    const r2 = 1 - (ssr / sst);

    return Math.max(r2, 0);
}

async function train(
    inputs,
    outputs,
    trainParam,
    onBatchEnd,
    onEpochEnd
) {
    const normResult = convertToTensor(inputs, outputs);
    const model = createModel(inputs.length);
    const history = await trainModel(model, normResult.inputs, normResult.outputs, trainParam, onBatchEnd, onEpochEnd);

    // @ts-ignore
    const weight = model.layers[0].weights[0].val;
    // @ts-ignore
    const bias = model.layers[0].weights[1].val;

    const inputMin = normResult.inputMin;
    const inputMax = normResult.inputMax;
    const outputMin = normResult.outputMin;
    const outputMax = normResult.outputMax;

    const o = outputMax.sub(outputMin);
    const oi = o.div(inputMax.sub(inputMin));

    const a = oi.mul(weight.transpose());
    const b = bias.mul(o).add(outputMin).sub(a.matMul(inputMin.expandDims(0).transpose()));
    const r2 = getR2Score(model, normResult, outputs);
    let graphData = {
        originalPoints: [],
        predictedPoints: []
    };
    if (inputs.length === 1) {
        graphData.originalPoints = inputs[0].map((e, i) => ({
            x: e,
            y: outputs[0][i]
        }));
        graphData.predictedPoints = testModel(model, normResult);
    }

    return {
        model,
        trainHistory: history,
        a: Array.from(a.dataSync()).map(x => _floor(x, 2)),
        b: _floor(b.dataSync()[0], 2),
        rsquared: _floor(r2, 2),
        graphData
    };
}
