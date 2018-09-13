/*
 *
 */
'use strict';

Entry.Executor = class {
    constructor(block, entity) {
        this.scope = new Entry.Scope(block, this);
        this.entity = entity;
        this._callStack = [];
        this.register = {};
        this.parentExecutor = null;
        this._isPending = false;
        this.id = Entry.Utils.generateId();
    }

    get MAXIMUM_CALLSTACK() {
        return 100;
    }

    async execute(isFromOrigin) {
        if (this.isEnd()) {
            return;
        }

        const executedBlocks = [];
        if (isFromOrigin) Entry.callStackLength = 0;

        const entity = this.entity;
        this.scope.executedBlocks = executedBlocks;
        while (true) {
            this._isPending = true;
            let result = await new Promise(async (resolve) => {
                var returnVal = null;

                const { selectedScene = {} } = Entry.scene || {};
                const { sessionSceneId } = selectedScene;
                if (
                    this.isEnd() ||
                    (this.sessionSceneId && this.sessionSceneId !== sessionSceneId)
                ) {
                    return resolve('end');
                }
                try {
                    executedBlocks.push(this.scope.block);
                    var schema = this.scope.block.getSchema();
                    if (schema && Entry.skeleton[schema.skeleton].executable) {
                        Entry.dispatchEvent(
                            'blockExecute',
                            this.scope.block && this.scope.block.view
                        );
                        returnVal = await schema.func.call(this.scope, entity, this.scope);
                    }
                } catch (e) {
                    if (e.name === 'AsyncError') {
                        returnVal = Entry.STATIC.BREAK;
                    } else if (this.isFuncExecutor)
                        //function executor
                        throw new Error();
                    else {
                        Entry.Utils.stopProjectWithToast(this.scope, undefined, e);
                    }
                }

                //executor can be ended after block function call
                if (this.isEnd()) {
                    return resolve('end');
                }

                if (
                    returnVal === undefined ||
                    returnVal === null ||
                    returnVal === Entry.STATIC.PASS
                ) {
                    this.scope = new Entry.Scope(this.scope.block.getNextBlock(), this);
                    if (this.scope.block === null) {
                        if (this._callStack.length) {
                            var oldScope = this.scope;
                            this.scope = this._callStack.pop();
                            if (this.scope.isLooped !== oldScope.isLooped) {
                                return resolve('break');
                            }
                        } else {
                            return resolve('break');
                        }
                    }
                } else if (returnVal === Entry.STATIC.CONTINUE) {
                } else if (returnVal === Entry.STATIC.BREAK || this.scope === returnVal) {
                    return resolve('break');
                }
                resolve();
            });
            this._isPending = false;
            if (result === 'break' || result === 'end') {
                return executedBlocks;
            }
        }
    }

    stepInto(thread) {
        if (!(thread instanceof Entry.Thread)) {
            console.error('Must step in to thread');
        }

        var block = thread.getFirstBlock();
        if (!block) {
            return Entry.STATIC.BREAK;
        }

        this._callStack.push(this.scope);

        this.scope = new Entry.Scope(block, this);
        return Entry.STATIC.CONTINUE;
    }

    break() {
        if (this._callStack.length) this.scope = this._callStack.pop();
        return Entry.STATIC.PASS;
    }

    breakLoop() {
        if (this._callStack.length) this.scope = this._callStack.pop();
        while (this._callStack.length) {
            var schema = Entry.block[this.scope.block.type];
            if (schema.class === 'repeat') break;
            this.scope = this._callStack.pop();
        }
        return Entry.STATIC.PASS;
    }

    end() {
        Entry.dispatchEvent('blockExecuteEnd', this.scope.block && this.scope.block.view);
        this.scope.block = null;
    }

    isEnd() {
        return this.scope.block === null;
    }

    isPending() {
        return this._isPending;
    }
};

Entry.Scope = class {
    constructor(block, executor) {
        this.block = block;
        this.type = block ? block.type : null; //legacy
        this.executor = executor;
        this.entity = executor.entity;
        const { selectedScene = {} } = Entry.scene || {};
        const { sessionSceneId } = selectedScene;
        this.sessionSceneId = sessionSceneId;
    }

    callReturn() {
        return undefined;
    }

    getParam(index) {
        var fieldBlock = this.block.params[index];
        var newScope = new Entry.Scope(fieldBlock, this.executor);
        var result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        return result;
    }

    getParams() {
        var that = this;
        return this.block.params.map(function(param) {
            if (param instanceof Entry.Block) {
                var fieldBlock = param;
                var newScope = new Entry.Scope(fieldBlock, that.executor);
                return Entry.block[fieldBlock.type].func.call(newScope, that.entity, newScope);
            } else return param;
        });
    }

    async getValue(key, block) {
        var fieldBlock = this.block.params[this._getParamIndex(key, block)];
        var newScope = new Entry.Scope(fieldBlock, this.executor);
        var result = await Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        const { selectedScene = {} } = Entry.scene || {};
        const { sessionSceneId } = selectedScene;
        if (this.sessionSceneId !== sessionSceneId) {
            throw new Entry.Utils.AsyncError('Scene Match Miss');
        }
        return result;
    }

    async getStringValue(key, block) {
        return String(await this.getValue(key, block));
    }

    async getNumberValue(key, block) {
        return Number(await this.getValue(key));
    }

    async getBooleanValue(key, block) {
        let value = await this.getValue(key);
        if (value === undefined) return false;
        value = Number(value);
        return isNaN(value) ? true : value; // handle "0" or "0.00"
    }

    getField(key) {
        if (!this.block) {
            throw new Entry.Utils.AsyncError('getField Pass');
        }
        const { params } = this.block;
        return params[this._getParamIndex(key)];
    }

    getStringField(key, block) {
        return String(this.getField(key));
    }

    getNumberField(key) {
        return Number(this.getField(key));
    }

    getStatement(key, block) {
        if (!this.block) {
            throw new Entry.Utils.AsyncError('getStatement Pass');
        }
        return this.executor.stepInto(this.block.statements[this._getStatementIndex(key, block)]);
    }

    _getParamIndex(key) {
        if (!this._schema) this._schema = Entry.block[this.type];
        return this._schema.paramsKeyMap[key];
    }

    _getStatementIndex(key) {
        if (!this._schema) this._schema = Entry.block[this.type];
        return this._schema.statementsKeyMap[key];
    }

    die() {
        this.block = null;
        return Entry.STATIC.BREAK;
    }
};
