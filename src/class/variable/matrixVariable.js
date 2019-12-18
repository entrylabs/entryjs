import Variable from './variable';
import { dmetMatrix } from '../../extensions/dmet';

class MatrixVariable extends Variable {
    constructor(variable) {
        Entry.assert(variable.variableType === 'matrix', 'Invalid variable type given');
        super(variable);
        this.type = 'matrix';
        if (!variable.isClone) {
            this.width_ = variable.width ? variable.width : 100;
            this.height_ = variable.height ? variable.height : 120;
            this.scrollPosition = 0;
        }
        this.data = new dmetMatrix(variable);
    }

    getArray() {
        const { array } = this.data;
        return array;
    }

    getValue(index) {
        const result = this.data.get(index);
        if (index.length > 1 && Array.isArray(result)) {
            return null;
        }
        return result;
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
                console.log('deleteValue', deleteOp, index);
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
                console.log('insertValue', insertOp, index);
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
                console.log('replaceValue', replaceOp, index);
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

export default MatrixVariable;
