Entry.Scope = function(block, executor) {
    this.block = block;
    this.type = block ? block.type : null; //legacy
    this.executor = executor;
    this.entity = executor.entity;
};

(function(p) {
    p.callReturn = function() {
        return undefined;
    };

    p.getParam = function(index) {
        const fieldBlock = this.block.params[index];
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        const result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        return result;
    };

    p.getParams = function() {
        const that = this;
        return this.block.params.map(function(param) {
            if (param instanceof Entry.Block) {
                const fieldBlock = param;
                const newScope = new Entry.Scope(fieldBlock, that.executor);
                return Entry.block[fieldBlock.type].func.call(newScope, that.entity, newScope);
            } else {
                return param;
            }
        });
    };

    p.getValues = function(keys, scope) {
        const valueState = this.executor.valueState || {};
        const fieldBlocks = keys.map((key) => this.block.params[this._getParamIndex(key, scope)]);
        const currentBlockId = scope.block.data.id;
        valueState[currentBlockId] = valueState[currentBlockId] || { state: 'wait' };

        let hasWait = false;
        let hasPending = false;
        if (valueState[currentBlockId].state === 'wait') {
            fieldBlocks.forEach((fieldBlock) => {
                const blockId = fieldBlock.data.id;
                valueState[blockId] = valueState[blockId] || { state: 'wait' };

                if (valueState[blockId] && valueState[blockId].state === 'pending') {
                    hasPending = true;
                }

                if (valueState[blockId].state === 'wait') {
                    hasWait = true;
                    this._checkValueState(fieldBlock, valueState, blockId);
                }
            });
        }

        if (!hasWait && hasPending && valueState[currentBlockId].state === 'wait') {
            valueState[currentBlockId].state = 'pending';
            throw new Entry.Utils.AsyncError();
        }

        fieldBlocks.forEach((fieldBlock) => {
            const blockId = fieldBlock.data.id;
            if (valueState[blockId].state === 'pending') {
                this._checkValueState(fieldBlock, valueState, blockId);
            }
        });

        return fieldBlocks.map((fieldBlock) => valueState[fieldBlock.data.id].value);
    };

    p.getValue = function(key, scope) {
        const executorValueMap = this.executor.valueMap;
        const fieldBlock = this.block.params[this._getParamIndex(key, scope)];
        const blockId = fieldBlock.data.id;

        this._setExecutorValueMap(fieldBlock);
        return executorValueMap[blockId];
    };

    /**
     * 일반 getValue 값을 가져오기 전,
     * 현 Scope 상태에서의 executor.valueMap 을 세팅한다.
     * 이 로직은 Promise.all[] 과 유사하며, 모든 값이 준비될 때까지 Scope 를 멈춘다.
     * @param{Array} fieldBlocks getValue 에 의한 호출의 경우 1, getValues 의 경우 1 이상
     */
    p._setExecutorValueMap = function(...fieldBlocks) {
        const executorValueMap = this.executor.valueMap;

        fieldBlocks.forEach((block) => {
            const blockId = block.data.id;

            if (executorValueMap[blockId] === 'isPending') {
                throw new Entry.Utils.AsyncError();
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
    };

    p.getStringValue = function(key, scope) {
        return String(this.getValue(key, scope));
    };

    p.getNumberValue = function(key, scope) {
        return Number(this.getValue(key, scope));
    };

    p.getBooleanValue = function(key, scope) {
        let value = this.getValue(key, scope);
        if (value === undefined) {
            return false;
        }
        value = Number(value);
        return isNaN(value) ? true : value; // handle "0" or "0.00"
    };

    p.getField = function(key) {
        return this.block.params[this._getParamIndex(key)];
    };

    p.getStringField = function(key) {
        return String(this.getField(key));
    };

    p.getNumberField = function(key) {
        return Number(this.getField(key));
    };

    p.getStatement = function(key, scope) {
        return this.executor.stepInto(this.block.statements[this._getStatementIndex(key, scope)]);
    };

    p._getParamIndex = function(key) {
        if (!this._schema) {
            this._schema = Entry.block[this.type];
        }
        return this._schema.paramsKeyMap[key];
    };

    p._getStatementIndex = function(key) {
        if (!this._schema) {
            this._schema = Entry.block[this.type];
        }
        return this._schema.statementsKeyMap[key];
    };

    p._checkValueState = function(fieldBlock, valueState, blockId) {
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        const result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);

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
    };

    p.die = function() {
        this.block = null;
        return Entry.STATIC.BREAK;
    };
})(Entry.Scope.prototype);
