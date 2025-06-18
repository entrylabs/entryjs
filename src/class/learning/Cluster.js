import { kmpp } from 'skmeans/kinit';
// import { kmpp } from 'skmeans/dist/node/kinit';
import floor from 'lodash/floor';
import _toNumber from 'lodash/toNumber';
import _isNaN from 'lodash/isNaN';
import LearningView from './LearningView';
import Chart from './Chart';
import DataTable from '../DataTable';

const GRAPH_COLOR = [
    '#4f80ff',
    '#f16670',
    '#6e5ae6',
    '#00b6b1',
    '#9fbaff',
    '#fcad93',
    '#c5b4ff',
    '#b3c3cd',
    '#2d51ac',
    '#a23941',
    '#423496',
    '#2a7d7f',
];

export const classes = [
    'ai_learning_train',
    'ai_learning_cluster',
    'cluster_attr_1',
    'cluster_attr_2',
    'cluster_attr_3',
    'cluster_attr_4',
    'cluster_attr_5',
    'cluster_attr_6',
    'ai_learning_train_chart',
];

class Cluster {
    #attrLength = 0;
    #trainParam = null;
    #result = {};
    #table = {};
    #trainCallback;
    #chart = null;
    #isTrained = false;
    #chartEnable = false;
    #view = null;
    #predictResult = null;
    #fields = [];
    #name = '';

    constructor(params = {}) {
        this.#view = new LearningView({ name: params.name || '', status: 0 });
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            this.init({ ...params });
        });
        this.init({ ...params });
    }

    init({ name, result, table, trainParam }) {
        this.#name = name;
        this.#trainParam = trainParam;
        this.#result = result;
        this.#table = table;
        this.#trainCallback = (value) => {
            this.#view.setValue(value);
        };
        this.#isTrained = true;

        this.#attrLength = table?.select?.[0]?.length || 0;
        if (this.#attrLength === 2) {
            this.#chartEnable = true;
        }
        this.#fields = table?.select?.[0]?.map((index) => table?.fields[index]);
    }

    setTable() {
        const tableSource = DataTable.getSource(this.#table.id);
        if (this.#table?.fieldsInfo?.length !== tableSource?.fields?.length) {
            Entry.toast.alert(Lang.Msgs.warn, Lang.AiLearning.train_param_error);
            throw Error(Lang.AiLearning.train_param_error);
        }
        this.#table.data = tableSource.rows;
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
        blockMenu.unbanClass(`ai_learning_cluster`);
        blockMenu.unbanClass(`cluster_attr_${this.#attrLength}`);
        if (this.#chartEnable) {
            blockMenu.unbanClass('ai_learning_train_chart');
        }
    }

    isTrained() {
        return this.#isTrained;
    }

    openChart() {
        if (!this.#chartEnable) {
            return;
        }
        if (!this.#chart) {
            const { k } = this.#trainParam;
            this.#chart = new Chart({
                source: this.chartData,
                title: Lang.AiLearning.chart_title,
                description: `
                    <em>${Lang.AiLearning.cluster_number}</em>   ${k}
                    ${this.#fields.map(
                        (field, index) =>
                            `<em>${Lang.AiLearning.model_attr_str} ${index + 1}</em>${field}`
                    )}
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
        this.#trainParam = {
            ...this.#trainParam,
            [type]: value,
        };
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

    train() {
        this.setTable();
        this.#trainCallback(1);
        this.#isTrained = false;
        const { data, select } = this.#table;
        const filtered = data.filter(
            (row) => !select.flat().some((selected) => _isNaN(_toNumber(row[selected])))
        );
        const [attr] = select;

        const { centroids, indexes } = kmeans(
            filtered.map((row) => attr.map((i) => parseFloat(row[i]) || 0)),
            this.#trainParam
        );
        this.#result = {
            graphData: convertGraphData(filtered, centroids, indexes, attr),
            centroids,
        };
        this.#isTrained = true;
        const { k } = this.#trainParam;
        this.#chart?.load({
            source: this.chartData,
            description: `
                    <em>${Lang.AiLearning.cluster_number}</em>   ${k}
                    ${this.#fields.map(
                        (field, index) =>
                            `<em>${Lang.AiLearning.model_attr_str} ${index + 1}</em>${field}`
                    )}
                `,
        });
        this.#trainCallback(100);
    }

    predict(arr = []) {
        if (!this.isTrained) {
            return;
        }
        const { k } = this.#trainParam;
        const { centroids } = this.#result;

        this.#predictResult = predictCluster(arr, k, centroids) + 1;
        return this.#predictResult;
    }

    findColor(id, a, b) {
        const { centroids, graphData } = this.#result;
        if (id === 'y') {
            const { type = 0 } =
                graphData?.find(({ x, y }) => String(x) === String(a) && String(y) === String(b)) ||
                {};
            return GRAPH_COLOR[type];
        } else if (id === 'centroid' && b) {
            const type = centroids?.findIndex(([x]) => String(x) === String(a)) || 0;
            return GRAPH_COLOR[type];
        }
        return undefined;
    }

    get chartData() {
        return {
            data: {
                type: 'scatter',
                json: this.#result.graphData,
                keys: { value: ['y', 'centroid'], x: 'x' },
                color: (color, d) => this.findColor(d.id, d.x, d.value) || color,
                labels: false,
            },
            options: {
                point: {
                    pattern: [
                        'circle',
                        // eslint-disable-next-line max-len
                        "<g><circle cx='10' cy='10' r='10'></circle><rect x='5' y='5' width='10' height='10' style='fill:#fff'></rect></g>",
                    ],
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    contents: (data) => {
                        const [{ x, value, id }] = data;
                        if (id === 'centroid' && value) {
                            const { centroids } = this.#result;
                            const type = centroids?.findIndex(([a, b]) => x === a && value === b);
                            return `
                                <div class="chart_handle_wrapper">
                                    ${Lang.AiLearning.centriod} ${type + 1}| ${
                                this.#fields[0]
                            }: ${x}, ${this.#fields[1]}: ${value}
                                <div>
                            `;
                        }
                        return `
                            <div class="chart_handle_wrapper">
                                ${this.#fields[0]}: ${x}, ${this.#fields[1]}: ${value}
                            <div>
                        `;
                    },
                },
                axis: {
                    x: {
                        tick: {
                            fit: false,
                            count: 5,
                        },
                    },
                },
                grid: {
                    x: {
                        show: true,
                    },
                    y: {
                        show: true,
                    },
                },
            },
        };
    }
}

export default Cluster;

function convertGraphData(data, centroids, indexes, attr) {
    return data
        .map((cur, index) =>
            cur.reduce(
                (acc, cur, idx) => {
                    if (idx === attr[0]) {
                        acc.x = cur;
                    } else if (idx === attr[1]) {
                        acc.y = cur;
                    }
                    return acc;
                },
                { index, type: indexes[index] }
            )
        )
        .concat(
            centroids.map(([x = 0, centroid = 0], type) => ({
                x,
                centroid,
                type,
            }))
        );
}

function eudist(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const d = (a[i] || 0) - (b[i] || 0);
        sum += d * d;
    }

    return sum;
}

function predictCluster(arr, k, centroids) {
    let min = Infinity;
    let closestCentroidIndex = 0;
    for (let i = 0; i < k; i++) {
        const dist = eudist(arr, centroids[i]);
        if (dist < min) {
            min = dist;
            closestCentroidIndex = i;
        }
    }
    return closestCentroidIndex;
}

function kmeans(inputs, trainParam) {
    const dim = inputs[0].length;
    let centroids = [];

    if (!trainParam.initialCentroids) {
        const _idxs = {};

        while (centroids.length < trainParam.k) {
            const idx = Math.floor(Math.random() * inputs.length);

            if (!_idxs[idx]) {
                _idxs[idx] = true;
                centroids.push(inputs[idx].slice());
            }
        }
    } else if (trainParam.initialCentroids === 'random') {
        const maxs = new Array(dim).fill(-Infinity);
        const mins = new Array(dim).fill(Infinity);
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
            const temp = [];
            for (let j = 0; j < dim; j++) {
                temp.push(Math.random() * (maxs[j] - mins[j]) + mins[j]);
            }
            centroids.push(temp);
        }
    } else if (trainParam.initialCentroids === 'kmpp') {
        centroids = kmpp(
            inputs.map((e) => e.slice()),
            trainParam.k
        );
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
            indexes[i] = predictCluster(inputs[i], trainParam.k, centroids);
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
            trainParam.onIterEnd(
                oldCentroids.map((e) => e.slice()),
                centroids.map((e) => e.slice())
            );
        }

        iter++;
    }

    return {
        iter,
        indexes,
        centroids,
    };
}
