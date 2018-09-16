/*
 *
 */
'use strict';

Entry.Executor = function(block, entity) {
    this.scope = new Entry.Scope(block, this);
    this.entity = entity;
    this._callStack = [];
    this.register = {};
    this.parentExecutor = null;
    this.id = Entry.Utils.generateId();
};

Entry.Executor.MAXIMUM_CALLSTACK = 100;

(function(p) {
    p.execute = function(isFromOrigin) {
        if (this.isEnd()) {
            return;
        }

        const executedBlocks = [];
        let block;
        if (isFromOrigin) {
            Entry.callStackLength = 0;
        }

        const entity = this.entity;

        while (true) {
            let returnVal = null;
            executedBlocks.push(this.scope.block);

            try {
                const schema = this.scope.block.getSchema();
                if (schema && Entry.skeleton[schema.skeleton].executable) {
                    Entry.dispatchEvent('blockExecute', this.scope.block && this.scope.block.view);
                    returnVal = schema.func.call(this.scope, entity, this.scope);
                    this.scope.key = Entry.generateHash();
                }
            } catch (e) {
                if (e.name === 'AsyncError') {
                    returnVal = Entry.STATIC.BREAK;
                } else if (this.isFuncExecutor) {
                    //function executor
                    throw new Error();
                } else {
                    Entry.Utils.stopProjectWithToast(this.scope, undefined, e);
                }
            }

            //executor can be ended after block function call
            if (this.isEnd()) {
                return executedBlocks;
            }

            if (returnVal === undefined || returnVal === null || returnVal === Entry.STATIC.PASS) {
                this.scope = new Entry.Scope(this.scope.block.getNextBlock(), this);
                if (this.scope.block === null) {
                    if (this._callStack.length) {
                        const oldScope = this.scope;
                        this.scope = this._callStack.pop();
                        if (this.scope.isLooped !== oldScope.isLooped) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } else if (returnVal === Entry.STATIC.CONTINUE) {
            } else if (returnVal === Entry.STATIC.BREAK || this.scope === returnVal) {
                break;
            }
        }
        return executedBlocks;
    };

    p.stepInto = function(thread) {
        if (!(thread instanceof Entry.Thread)) {
            console.error('Must step in to thread');
        }

        const block = thread.getFirstBlock();
        if (!block) {
            return Entry.STATIC.BREAK;
        }

        this._callStack.push(this.scope);

        this.scope = new Entry.Scope(block, this);
        return Entry.STATIC.CONTINUE;
    };

    p.break = function() {
        if (this._callStack.length) {
            this.scope = this._callStack.pop();
        }
        return Entry.STATIC.PASS;
    };

    p.breakLoop = function() {
        if (this._callStack.length) {
            this.scope = this._callStack.pop();
        }
        while (this._callStack.length) {
            const schema = Entry.block[this.scope.block.type];
            if (schema.class === 'repeat') {
                break;
            }
            this.scope = this._callStack.pop();
        }
        return Entry.STATIC.PASS;
    };

    p.end = function() {
        Entry.dispatchEvent('blockExecuteEnd', this.scope.block && this.scope.block.view);
        this.scope.block = null;
    };

    p.isEnd = function() {
        return this.scope.block === null;
    };
})(Entry.Executor.prototype);

Entry.Scope = function(block, executor) {
    this.block = block;
    this.key = Entry.generateHash();
    this.result = {};
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

    p.getAsyncValue = async function(key, block) {
        const fieldBlock = this.block.params[this._getParamIndex(key, block)];
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        newScope.key = block.key;
        const result = await Entry.block[fieldBlock.type].func.call(
            newScope,
            this.entity,
            newScope
        );
        return result;
    };

    p.getValues = function(...keys) {};
    p.getValue = function(key, block) {
        const fieldBlock = this.block.params[this._getParamIndex(key, block)];
        if (!fieldBlock.cache) {
            fieldBlock.cache = {};
        }
        if (fieldBlock.cache[`${block.key}`] === 'isPending') {
            throw new Entry.Utils.AsyncError();
        } else if (fieldBlock.cache[`${block.key}`] !== undefined) {
            return fieldBlock.cache[`${block.key}`];
        }
        const newScope = new Entry.Scope(fieldBlock, this.executor);
        newScope.key = block.key;
        const result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        if (result instanceof Promise) {
            fieldBlock.cache[`${block.key}`] = 'isPending';
            result.then((r) => {
                console.log(block.key);
                fieldBlock.cache[`${block.key}`] = r;
            });
            throw new Entry.Utils.AsyncError();
        }
        return result;
    };

    p.getStringValue = function(key, block) {
        return String(this.getValue(key, block));
    };

    p.getNumberValue = function(key, block) {
        return Number(this.getValue(key, block));
    };

    p.getBooleanValue = function(key, block) {
        let value = this.getValue(key, block);
        if (value === undefined) {
            return false;
        }
        value = Number(value);
        return isNaN(value) ? true : value; // handle "0" or "0.00"
    };

    p.getField = function(key, block) {
        return this.block.params[this._getParamIndex(key)];
    };

    p.getStringField = function(key, block) {
        return String(this.getField(key));
    };

    p.getNumberField = function(key) {
        return Number(this.getField(key));
    };

    p.getStatement = function(key, block) {
        return this.executor.stepInto(this.block.statements[this._getStatementIndex(key, block)]);
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
