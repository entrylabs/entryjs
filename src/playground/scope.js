'use strict';

class Scope {
    constructor(block, executor) {
        this.block = block;
        this.type = block ? block.type : null; //legacy
        this.executor = executor;
        this.entity = executor.entity;
    }

    callReturn() {
        return undefined;
    }

    getParam(index) {
        const fieldBlock = this.block.params[index];
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        const result = newScope.run(this.entity);
        return result;
    }

    getParams() {
        const that = this;
        return this.block.params.map((param) => {
            if (param instanceof Entry.Block) {
                const fieldBlock = param;
                const newScope = new Entry.Scope(fieldBlock, that.executor);
                return newScope.run(this.entity);
            } else {
                return param;
            }
        });
    }

    _setBlockState(fieldBlock, valueState) {
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        const result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        const blockId = fieldBlock.data.id;

        if (result instanceof Promise) {
            if (valueState[blockId].state === 'pending') {
                throw new Entry.Utils.AsyncError();
            }
            valueState[blockId].state = 'pending';
            result.then((value) => {
                valueState[blockId].state = 'complete';
                valueState[blockId].value = value;
            });
        } else {
            valueState[blockId].state = 'complete';
            valueState[blockId].value = result;
        }
    }

    _setChildBlockState(fieldBlocks, currentBlockId) {
        const valueState = this.executor.valueState || {};

        let hasPending = false;
        if (valueState[currentBlockId].state === 'wait') {
            fieldBlocks.forEach((fieldBlock) => {
                const blockId = fieldBlock.data.id;
                valueState[blockId] = valueState[blockId] || { state: 'wait' };
                if (valueState[blockId].state === 'wait') {
                    this._setBlockState(fieldBlock, valueState);
                }
                hasPending = hasPending || valueState[blockId].state === 'pending';
            });
        }

        if (hasPending && valueState[currentBlockId].state === 'wait') {
            valueState[currentBlockId].state = 'pending';
            throw new Entry.Utils.AsyncError();
        }
    }

    getValues(keys, scope) {
        return keys.map((key) => {
            return this.values[this._getParamIndex(key, scope)];
        });
    }

    getValue(key, scope) {
        return this.values[this._getParamIndex(key, scope)];
    }

    /**
     * 일반 getValue 값을 가져오기 전,
     * 현 Scope 상태에서의 executor.valueMap 을 세팅한다.
     * 이 로직은 Promise.all[] 과 유사하며, 모든 값이 준비될 때까지 Scope 를 멈춘다.
     * @param{Array} fieldBlocks getValue 에 의한 호출의 경우 1, getValues 의 경우 1 이상
     */
    _setExecutorValueMap(fieldBlocks) {
        const executorValueMap = this.executor.valueMap;

        fieldBlocks.forEach((block) => {
            const blockId = block.data.id;

            if (executorValueMap[blockId] === 'isPending') {
                throw new Entry.Utils.AsyncError();
            } else if (
                executorValueMap[blockId] &&
                executorValueMap[blockId].name === 'IncompatibleError'
            ) {
                throw executorValueMap[blockId];
            } else if (executorValueMap[blockId] !== undefined) {
                return executorValueMap[blockId];
            }

            const newScope = new Entry.Scope(block, this.executor);
            const result = Entry.block[block.type].func.call(newScope, this.entity, newScope);

            if (result instanceof Promise) {
                executorValueMap[blockId] = 'isPending';
                result.then((value) => {
                    executorValueMap[blockId] = value;
                });
                throw new Entry.Utils.AsyncError();
            } else {
                executorValueMap[blockId] = result;
            }
        });
    }

    getStringValue(key, scope) {
        return String(this.getValue(key, scope));
    }

    getNumberValue(key, scope) {
        return Number(this.getValue(key, scope));
    }

    getBooleanValue(key, scope) {
        let value = this.getValue(key, scope);
        if (value === undefined) {
            return false;
        }
        value = Number(value);
        return isNaN(value) ? true : value; // handle "0" or "0.00"
    }

    getField(key) {
        return this.block.params[this._getParamIndex(key)];
    }

    getStringField(key) {
        return String(this.getField(key));
    }

    getNumberField(key) {
        return Number(this.getField(key));
    }

    getStatement(key, scope) {
        return this.executor.stepInto(this.block.statements[this._getStatementIndex(key, scope)]);
    }

    _getParamIndex(key) {
        if (!this._schema) {
            this._schema = Entry.block[this.type];
        }
        return this._schema.paramsKeyMap[key];
    }

    _getStatementIndex(key) {
        if (!this._schema) {
            this._schema = Entry.block[this.type];
        }
        return this._schema.statementsKeyMap[key];
    }

    die() {
        this.block = null;
        return Entry.STATIC.BREAK;
    }

    run(entity) {
        const values = this.getParams();
        const isPromise = values.some((value) => {
            return value instanceof Promise;
        });
        const schema = this.block.getSchema();
        if (!isPromise) {
            this.values = values;
            return schema.func.call(this, entity, this);
        } else {
            return Promise.all(values).then((values) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        this.values = values;
                        await schema.func.call(this, entity, this);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    }
}

Entry.Scope = Scope;
