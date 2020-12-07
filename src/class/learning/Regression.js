import * as tf from '@tensorflow/tfjs';
const { callApi } = require('../../util/common');
import _floor from 'lodash/floor';
import _max from 'lodash/max';

class Regression {
    constructor({ result, table, trainParam, trainCallback }) {
        this.trainParam = trainParam;
        this.result = result;
        this.table = table;
        this.trainCallback = trainCallback;
        this.isTrained = true;
    }
    
    setTrainOption(type, value) {
        this.trainParam[type] = value;
    }

    getTrainOption() {
        return this.trainParam;
    }

    async train() {
        this.isTrained = false;
        this.percent = 0;
        const { inputs, outputs, totalDataSize } = convertToTfData(this.table, this.trainParam);
        const { model, trainHistory, a, b, graphData = [] } = await train(
            inputs,
            outputs,
            this.trainParam,
            () => {
                this.percent = this.percent + 1;
                const percent = _floor((this.percent / totalDataSize) * 100);
                this.trainCallback(percent);
            }
        );
        this.model = model;
        const { acc = [] } = trainHistory?.history || {};
        const accuracy = _max(acc) || 0;
        this.result = {
            graphData: (graphData.originalPoints || []).slice(0, 1000),
            accuracy,
            equation: `Y = ${a.map((a, i) => i === 0 ? `${a}X` : `${this.addSign(a)}X^${i + 1}`).join('')} ${this.addSign(b)}`
        }
    }

    addSign(x) {
        return x < 0 ? x : `+${x}`;
    }

    async load(url) {
        this.model = await tf.loadLayersModel(url);
    }

    async predict(data) {
        return tf.tidy(() => {
            let convertedData;
            if(Array.isArray(data)) {
                convertedData = tf.tensor2d([data]);
            } else {
                convertedData = tf.tensor1d([data]);
            }
            const preds = this.model.predict(convertedData);
            const [result] = preds.dataSync();
            return _floor(result, 2);
        });
    }
}

export default Regression;

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

const TEST_POINT_COUNT = 2;
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
        graphData
    };
}
