import Variable from './variable';
import { dmetTable } from '../../extensions/dmet';

class TableVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'table', 'Invalid variable type given');
        super(variable);
        this.type = 'table';
        if (!variable.isClone) {
            this.width_ = variable.width ? variable.width : 100;
            this.height_ = variable.height ? variable.height : 120;
            this.scrollPosition = 0;
        }
        this.data = new dmetTable(variable);
        this.originData = this.data.toJSON();
        // 정지시 data 초기화.
        Entry.addEventListener('stop', () => {
            console.log('init tableVariable');
            this.data.from(variable);
        });
    }

    getLabels() {
        return this.data.labels;
    }

    getArray() {
        const { array } = this.data;
        return array;
    }

    getValue(index) {
        return this.data.getValue(index);
    }

    setArray(array) {
        this.data.from(array.map(({ data }) => data));
    }

    appendValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const appendOp = this.data.getOperation({ type: 'append', index, data });
                this.data.exec(appendOp);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteValue(index) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteOp = this.data.getOperation({ type: 'delete', index });
                this.data.exec(deleteOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    insertValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const insertOp = this.data.getOperation({ type: 'insert', index, data });
                this.data.exec(insertOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    replaceValue(index, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const replaceOp = this.data.getOperation({ type: 'replace', index, data });
                this.data.exec(replaceOp);
            } catch (e) {
                reject(e);
            }
        });
    }

    toJSON() {
        const json = super.toJSON();
        json.width = this.getWidth();
        json.height = this.getHeight();
        json.array = JSON.parse(JSON.stringify(this.getArray()));

        return json;
    }

}

export default TableVariable;
