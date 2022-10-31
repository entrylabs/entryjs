import LearningBase from "./LearningBase";

const SVM = require('libsvm-js/asm');

export const classes = [
    'ai_learning_train',
];

class Svm extends LearningBase {
    type = 'svm';

    init(){

    }

    async train() {

    }

    async load() {

    }
    
    async predict() {

    }
}

export default Svm;

function createModel() {
    return new SVM({ type: SVM.SVM_TYPES.C_SVC, probabilityEstimates: true });
}

function trainModel() {

}