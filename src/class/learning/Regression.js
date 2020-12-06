import * as tf from '@tensorflow/tfjs';
const { callApi } = require('../../util/common');

class Regression {
    constructor({ result, table, trainParam }) {
        this.trainParam = trainParam;
        this.result = result;
        this.table = table;
        this.isTrained = true;
    }
    
    setTrainOption(type, value) {
        this.trainParam[type] = value;
    }

    getTrainOption() {
        return this.trainParam;
    }

    train() {

    }

    async load(url) {
        this.model = await tf.loadLayersModel(url);
    }

    async predict() {
        
    }
}

export default Regression;
