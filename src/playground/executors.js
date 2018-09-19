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
    this.valueMap = {};
    this.valueState = {};
    this.id = Entry.Utils.generateId();
};

Entry.Executor.MAXIMUM_CALLSTACK = 100;

(function(p) {
    p.execute = function(isFromOrigin) {
        if (this.isEnd()) {
            return;
        }

        const executedBlocks = [];
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
                this.valueMap = {};
                this.valueState = {};
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
                this.valueMap = {};
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
