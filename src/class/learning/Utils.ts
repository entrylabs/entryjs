 

const toFixed = (num: number) => parseFloat(num.toFixed(2));

export const CommonUtil = {
    isWebGlSupport:() => {
        try {
            const currentCanvas = document.createElement('canvas');
            return !!currentCanvas.getContext('webgl', { premultipliedalpha: false });
        } catch (e) {
            console.log('error', e);
            return false;
        }
    },
    stringToNumber: (
        i: number,
        value: string,
        tempMap: {
            [key: number]: {
                [key: string]: number;
            };
        },
        tempMapCount: {
            [key: string]: number;
        }
    ) => {
        // if (!isNaN(parseFloat(value))) {
        //     return parseFloat(value);
        // }
        if (!tempMap[i]) {
            tempMap[i] = {};
        }
        if (!tempMap[i]?.[value]) {
            if (!tempMapCount[i]) {
                tempMapCount[i] = 0;
            }
            tempMapCount[i] = tempMapCount[i] + 1;
            tempMap[i][value] = tempMapCount[i];
        }
        return tempMap[i][value];
    },
    shuffle: (arr: Array<any>) => {
        let j; let x; let i;
        for (i = arr.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = arr[i - 1];
            arr[i - 1] = arr[j];
            arr[j] = x;
        }
    },
    getScores:(confusionMatrix: any, numClasses: number) => {
        let total = 0; let acc = 0;
        const precisions = []; const recalls = [];
        for (let i = 0; i < numClasses; i++) {
            let rowSum = 0; let colSum = 0;
            for (let j = 0; j < numClasses; j++) {
                rowSum += confusionMatrix[i][j];
                colSum += confusionMatrix[j][i];
            }
        
            precisions.push(confusionMatrix[i][i] / rowSum || 0);
            recalls.push(confusionMatrix[i][i] / colSum || 0);
    
            total += rowSum;
            acc += confusionMatrix[i][i];
        }
        const precision = precisions.reduce((a, b) => a + b, 0) / precisions.length;
        const recall = recalls.reduce((a, b) => a + b, 0) / recalls.length;
        return {
            accuracy: toFixed(acc / total),
            precision: toFixed(precision),
            recall: toFixed(recall),
            f1: toFixed(2 / (1 / precision + 1 / recall)),
        };
    },
    arrayToMatrix(array: Array<number>, columns: number) {
        return Array(Math.ceil(array.length / columns))
            .fill('')
            .reduce((acc, cur, index) => (
                [...acc, [...array].splice(index * columns, columns)]
            ), []);
    }
};

export default CommonUtil;
