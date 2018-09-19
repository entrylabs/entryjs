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

        this._makeLeafValueTree(fieldBlocks);
        return fieldBlocks.map((fieldBlocks) => this._getValueFromValueMap(fieldBlocks));
    };

    p.getValue = function(key, scope) {
        const fieldBlock = this.block.params[this._getParamIndex(key, scope)];

        this._makeLeafValueTree(fieldBlock);
        return this._getValueFromValueMap(fieldBlock);
    };

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

    p._makeLeafValueTree = function(...rootBlocks) {
        const executorValueMap = this.executor.valueMap;
        const leafBlocks = [];

        if (Object.keys(executorValueMap).length > 0) {
            return;
        }

        const addValueBlockRecursive = (block) => {
            const params = block.data && block.data.params;

            if (params instanceof Array === false || params.length <= 1) {
                leafBlocks.push(block);
            } else {
                params.forEach((value) => {
                    if (typeof value === 'object') {
                        addValueBlockRecursive(value);
                    }
                });
            }
        };
        rootBlocks.flat().forEach(addValueBlockRecursive);

        leafBlocks.forEach((block) => {
            const blockId = block.data.id;

            if (executorValueMap[blockId] === 'isPending') {
                throw new Entry.Utils.AsyncError();
            } else if (executorValueMap[blockId] === undefined) {
                const newScope = new Entry.Scope(block, this.executor);
                const result = Entry.block[block.type].func.call(newScope, this.entity, newScope);

                if (result instanceof Promise) {
                    executorValueMap[blockId] = {
                        isResolved : false,
                    };
                    result.then((value) => {
                        executorValueMap[blockId] = {
                            value,
                            isResolved : true,
                        };
                    });
                } else {
                    executorValueMap[blockId] = {
                        value : result,
                        isResolved : true,
                    };
                }
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

    p.die = function() {
        this.block = null;
        return Entry.STATIC.BREAK;
    };
})(Entry.Scope.prototype);
