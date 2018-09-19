'use strict';

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
        const fieldBlocks = keys.map((key) => this.block.params[this._getParamIndex(key, scope)]);
        
        this._setValueMap(fieldBlocks);
        return fieldBlocks.map((fieldBlocks) => this._getValueFromValueMap(fieldBlocks));
    };

    p.getValue = function(key, scope) {
        const fieldBlock = this.block.params[this._getParamIndex(key, scope)];

        this._setValueMap(fieldBlock);
        return this._getValueFromValueMap(fieldBlock);
    };

    /**
     * getValue(s) 에서 사용되는 함수. executor 의 valueMap 에 데이터가 있는지 가져온다.
     * 데이터가 아예 없는 경우 (말단 값블럭이 아닌경우) func 를 호출한다.
     * 또한 isResolved === false 인 경우는 Promise 가 pending 중인 경우이므로 AsyncError 를 던진다.
     *
     * @param block 값을 가져올 블럭
     * @returns {*} 블록의 결과 값
     * @throws Entry.Utils.AsyncError Promise pending 중인 값을 호출한 경우
     */
    p._getValueFromValueMap = function(block) {
        const result = this.executor.valueMap[block.data.id];
        if (result === undefined) {
            const newScope = new Entry.Scope(block, this.executor);
            return Entry.block[block.type].func.call(newScope, this.entity, newScope);
        } else if (result.isResolved) {
            return result.value;
        } else {
            throw new Entry.Utils.AsyncError();
        }
    };

    /**
     * 현재 블록을 기준으로 중첩된 블록을 전부 순회하며 말단 블록을 가져온다.
     * 말단 블록 리스트는 executor 에 기록되며 한번 기록이 된 이후에는 다음 scope 가 되기전까지 변하지 않는다.
     * 해당 scope 에서 한번 실행된 함수는 더이상 트리를 순회하지 않는다.
     * @param rootBlocks 기준 블록
     */
    p._setValueMap = function(blocks) {
        const rootBlocks = blocks instanceof Array ? blocks : [blocks];
        const executorValueMap = this.executor.valueMap;
        // 현재 스코프에서 한번 생성된 트리를 다시 순회하지 않는다.
        if (Object.keys(executorValueMap).length > 0) {
            return;
        }

        const leafBlocks = this._getLeafBlocks(rootBlocks);
        leafBlocks.forEach((block) => {
            const blockId = block.data.id;
            const newScope = new Entry.Scope(block, this.executor);
            const result = Entry.block[block.type].func.call(newScope, this.entity, newScope);

            if (result instanceof Promise) {
                executorValueMap[blockId] = { isResolved: false };
                result.then((value) => {
                    executorValueMap[blockId] = {
                        value,
                        isResolved: true,
                    };
                });
            } else {
                executorValueMap[blockId] = {
                    value: result,
                    isResolved: true,
                };
            }
        });
    };

    p._getLeafBlocks = function(rootBlocks) {
        const leafBlocks = [];
        const addValueBlockRecursive = (block) => {
            const params = block.data && block.data.params;
            if (params.length <= 1) {
                leafBlocks.push(block);
            } else {
                params.forEach((value) => {
                    if (typeof value === 'object') {
                        addValueBlockRecursive(value);
                    }
                });
            }
        };

        rootBlocks.forEach(addValueBlockRecursive);
        return leafBlocks;
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

    p.die = function() {
        this.block = null;
        return Entry.STATIC.BREAK;
    };
})(Entry.Scope.prototype);
