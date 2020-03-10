/*
 *
 */
'use strict';
class Executor {
    constructor(block, entity, code) {
        this.scope = new Entry.Scope(block, this);
        this.isUpdateTime = 0;
        this.entity = entity;
        this.code = code;
        this._callStack = [];
        this.register = {};
        this.paused = false;
        this.parentExecutor = null;
        this.valueMap = {};
        this.valueState = {};
        this.id = Entry.Utils.generateId();
    }

    execute(isFromOrigin) {
        if (Entry.isTurbo && !this.isUpdateTime) {
            this.isUpdateTime = performance.now();
        }
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
                    returnVal = this.scope.run(entity);
                    this.scope.key = Entry.generateHash();
                }
            } catch (e) {
                returnVal = this.checkExecutorError(e);
            }

            //executor can be ended after block function call
            if (this.isEnd()) {
                return executedBlocks;
            }

            if (returnVal instanceof Promise) {
                this.paused = true;
                returnVal
                    .then((result) => {
                        this.checkExecutorResult(result);
                        this.paused = false;
                    })
                    .catch((e) => {
                        this.paused = false;
                        this.checkExecutorError(e);
                    });
                break;
            }
            const isBreak = this.checkExecutorResult(returnVal);
            if (isBreak) {
                break;
            }
        }
        return executedBlocks;
    }

    checkExecutorError(error) {
        if (error.name === 'AsyncError') {
            return Entry.STATIC.BREAK;
        } else if (this.isFuncExecutor) {
            throw error;
        } else {
            Entry.Utils.stopProjectWithToast(this.scope, undefined, error);
        }
    }

    checkExecutorResult(returnVal) {
        if (returnVal === undefined || returnVal === null || returnVal === Entry.STATIC.PASS) {
            this.scope = new Entry.Scope(this.scope.block.getNextBlock(), this);
            this.valueMap = {};
            this.valueState = {};
            if (this.scope.block === null) {
                if (this._callStack.length) {
                    const oldScope = this.scope;
                    this.scope = this._callStack.pop();
                    if (this.scope.isLooped !== oldScope.isLooped) {
                        this.isLooped = true;
                        return true;
                    }
                } else {
                    return true;
                }
            }
        } else if (returnVal === Entry.STATIC.CONTINUE) {
            this.valueMap = {};
            this.valueState = {};
        } else if (returnVal === this.scope) {
            this.valueMap = {};
            this.valueState = {};
            return true;
        } else if (returnVal === Entry.STATIC.BREAK) {
            return true;
        }
    }

    stepInto(thread) {
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
    }

    break() {
        if (this._callStack.length) {
            this.scope = this._callStack.pop();
        }
        return Entry.STATIC.PASS;
    }

    breakLoop() {
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
    }

    end() {
        Entry.dispatchEvent('blockExecuteEnd', this.scope.block && this.scope.block.view);
        this.scope.block = null;
    }

    isPause() {
        return this.paused;
    }

    isEnd() {
        return this.scope.block === null;
    }
}

Entry.Executor = Executor;
