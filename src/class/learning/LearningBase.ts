import LearningView from './LearningView';
import DataTable from '../DataTable';

type Table = {
    id: string;
    fieldsInfo: Array<any>;
    data: Array<any>;
};
class LearningBase {
    type = 'base';
    attrLength = 0;
    name: string = '';
    view?: LearningView = null;
    trained: boolean = false;
    chartEnable: boolean = false;
    fields: Array<String> = [];
    predictFields: Array<String> = [];
    result = {};
    loadModel: () => {};
    table: Table;
    trainParam: any = null;
    trainCallback: (value: any) => void;

    chart: any = null;
    predictResult: any = null;

    constructor(params: any = {}) {
        this.view = new LearningView({ name: params.name || '', status: 0 });
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            this.init({ ...params });
        });
        this.init({ ...params });
    }

    init({ name, result, table, trainParam }: any) {
        this.name = name;
        this.trainParam = trainParam;
        this.result = result;
        this.table = table;
        this.trainCallback = (value: any) => {
            this.view.setValue(value);
        };
        this.trained = true;
        this.attrLength = table?.select?.[0]?.length || 0;
        if (this.attrLength === 2) {
            this.chartEnable = true;
        }
        this.fields = table?.select?.[0]?.map((index: number) => table?.fields[index]);
    }

    isTrained() {
        return this.trained;
    }

    setTable() {
        const tableSource = DataTable.getSource(this.table.id);
        if (this.table.fieldsInfo.length !== tableSource.fields.length) {
            Entry.toast.alert(Lang.Msgs.warn, Lang.AiLearning.train_param_error);
            throw Error(Lang.AiLearning.train_param_error);
        }
        this.table.data = tableSource.rows;
    }

    destroy() {
        this.view.destroy();
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    setVisible(visible: boolean) {
        this.view.setVisible(visible);
    }

    unbanBlocks(blockMenu: any) {
        blockMenu.unbanClass(`ai_learning_train`);
        blockMenu.unbanClass(`ai_learning_${this.type}`);
        blockMenu.unbanClass(`${this.type}_attr_${this.attrLength}`);
        if (this.chartEnable) {
            blockMenu.unbanClass('ai_learning_train_chart');
        }
    }

    openChart() {
        if (!this.chartEnable) {
            return;
        }
        if (!this.chart) {
            this.generateChart();
        } else {
            this.chart.show();
        }
    }

    closeChart() {
        this.chart?.hide();
    }

    setTrainOption(type: string, value: any) {
        this.trainParam = {
            ...this.trainParam,
            [type]: value,
        };
    }

    getTrainOption() {
        return this.trainParam;
    }

    getTrainResult() {
        return this.result;
    }

    getResult() {
        return this.predictResult;
    }

    generateChart() {
        throw new Error('Method not implemented.');
    }

    train() {
        throw new Error('Method not implemented.');
    }

    load() {
        throw new Error('Method not implemented.');
    }

    predict() {
        throw new Error('Method not implemented.');
    }
}

export default LearningBase;
