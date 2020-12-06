import { eudist } from 'skmeans/distance';
import { kmpp } from 'skmeans/kinit';
import floor from 'lodash/floor';

class Cluster {
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
        this.isTrained = false;
        const { data, select } = this.table;
        const [attr] = select;
        
        const { centroids, indexes } = kmeans(
            data.map((row) => attr.map((i) => parseFloat(row[i]) || 0)), 
            this.trainParam
        );
        this.result = {
            graphData: convertGraphData(data, centroids, indexes),
            centroids
        };
    }

    predict({ x, y }) {
        if (!this.isTrained) {
            return ;
        }
        const { k } = this.trainParam;
        const { centroids } = this.result;
        return predictCluster(x, y, k, centroids);
    }
}

export default Cluster;

function convertGraphData(data, centroids, indexes) {
    return data.map((cur, index) => {
        return cur.reduce((acc, cur, idx, arr) => {
            if (idx === 0) {
                acc['x'] = cur;
            } else if (idx === 1) {
                acc['y'] = cur;
            }
            return acc;
        }, { index, type: indexes[index] });
    }).concat(
        centroids.map(([x = 0, centroid = 0], type) => ({
            x,
            centroid,
            type
        }))
    )
}

function predictCluster(x, y, k, centroids) {
    let min = Infinity;
    let closestCentroidIndex = 0;
    for(let i = 0 ; i < k ; i ++) {
        let dist = eudist([x, y], centroids[i]);
        if (dist < min) {
            min = dist;
            closestCentroidIndex = i;
        }
    }
    return closestCentroidIndex;
}

function kmeans(inputs, trainParam) {
    let dim = inputs[0].length;
    let centroids = [];

    if (!trainParam.initialCentroids) {
        let _idxs = {};

        while (centroids.length < trainParam.k) {
            let idx = Math.floor(Math.random() * inputs.length);

            if (!_idxs[idx]) {
                _idxs[idx] = true;
                centroids.push(inputs[idx].slice());
            }
        }
    } else if (trainParam.initialCentroids === "random") {
        let maxs = new Array(dim).fill(-Infinity);
        let mins = new Array(dim).fill(Infinity);
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < inputs.length; j++) {
                if (inputs[j][i] < mins[i]) {
                    mins[i] = inputs[j][i];
                }
                if (inputs[j][i] > maxs[i]) {
                    maxs[i] = inputs[j][i];
                }
            }
        }

        for (let i = 0; i < trainParam.k; i++) {
            let temp = [];
            for (let j = 0; j < dim; j++) {
                temp.push(Math.random() * (maxs[j] - mins[j]) + mins[j]);
            }
            centroids.push(temp);
        }
    } else if (trainParam.initialCentroids === "kmpp") {
        centroids = kmpp(inputs.map(e => e.slice()), trainParam.k);
    } else {
        centroids = trainParam.initialCentroids;
    }

    let indexes = new Array(inputs.length).fill(0);

    let iter = 0;
    let maxIter = trainParam.maxIter || 10000;
    let conv = false;
    while (!conv && iter < maxIter) {
        // copy old centroids
        let oldCentroids = centroids.map((e) => e.slice());

        // set inputs idx (closest centroid index)
        for (let i = 0; i < inputs.length; i++) {
            const [x, y] = inputs[i];
            indexes[i] = predictCluster(x, y, trainParam.k, centroids);
        }

        // move centroid to avg inputs
        let sums = Array.from(new Array(trainParam.k), () => new Array(dim).fill(0));
        let counts = new Array(trainParam.k).fill(0);

        for (let i = 0; i < inputs.length; i++) {
            counts[indexes[i]]++;
            for (let j = 0; j < dim; j++) {
                sums[indexes[i]][j] += inputs[i][j];
            }
        }

        for (let i = 0; i < trainParam.k; i++) {
            for (let j = 0; j < dim; j++) {
                centroids[i][j] = floor(sums[i][j] / counts[i], 2);
            }
        }

        // check conv
        let centroidsUpdateDistance = 0;
        centroids.forEach((e, i) => {
            centroidsUpdateDistance += eudist(e, oldCentroids[i]);
        });

        if (centroidsUpdateDistance === 0) {
            conv = true;
        }

        if (trainParam.onIterEnd) {
            trainParam.onIterEnd(oldCentroids.map((e) => e.slice()), centroids.map((e) => e.slice()));
        }

        iter++;
    }

    return {
        iter,
        indexes,
        centroids,
    };
}

