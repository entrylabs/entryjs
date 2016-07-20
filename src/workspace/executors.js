/*
 *
 */
"use strict";

goog.provide("Entry.Executor");

Entry.Executor = function(block, entity) {
    this.scope = new Entry.Scope(block, this);
    this.entity = entity;
    this._callStack = [];
    this.register = {};
};

(function(p) {
    p.execute = function() {
        if (this.isEnd())
            return;
        while (true) {
            try {
                var returnVal = this.scope.block.getSchema().func.call(this.scope, this.entity, this.scope);
            } catch(e) {
                var errorMsg = '런타임 에러';
                var isToastHide = false;
                if(e.message != errorMsg) {
                    isToastHide = true;
                }
                Entry.Utils.stopProjectWithToast(this.scope, errorMsg, isToastHide);
            }
            //executor can be ended after block function call
            if (this.isEnd()) return;

            if (returnVal === undefined || returnVal === null || returnVal === Entry.STATIC.PASS) {
                this.scope = new Entry.Scope(this.scope.block.getNextBlock(), this);
                if (this.scope.block === null) {
                    if (this._callStack.length) {
                        var oldScope = this.scope;
                        this.scope = this._callStack.pop();
                        if (this.scope.isLooped !== oldScope.isLooped)
                            break;
                    }
                    else
                        break;
                }
            } else if (returnVal === Entry.STATIC.CONTINUE) {
            } else if (returnVal === Entry.STATIC.BREAK || this.scope === returnVal) {
                break;
            }
        }
    };

    p.stepInto = function(thread) {
        if (!(thread instanceof Entry.Thread))
            console.error("Must step in to thread");

        var block = thread.getFirstBlock();
        if (!block) {
            return Entry.STATIC.BREAK;
        }

        this._callStack.push(this.scope);

        this.scope = new Entry.Scope(block, this);
        return Entry.STATIC.CONTINUE;
    };

    p.break = function() {
        if (this._callStack.length)
            this.scope = this._callStack.pop();
        return Entry.STATIC.PASS;
    };

    p.breakLoop = function() {
        if (this._callStack.length)
            this.scope = this._callStack.pop();
        while (this._callStack.length) {
            var schema = Entry.block[this.scope.block.type];
            if (schema.class === "repeat")
                break;
            this.scope = this._callStack.pop();
        }
        return Entry.STATIC.PASS;
    };

    p.end = function() {
        this.scope.block = null;
    };

    p.isEnd = function() {
        return this.scope.block === null;
    };
})(Entry.Executor.prototype);

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
        var fieldBlock = this.block.params[index];
        var newScope = new Entry.Scope(fieldBlock, this.executor);
        var result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        return result;
    };

    p.getParams = function() {
        var that = this;
        return this.block.params.map(function(param){
            if (param instanceof Entry.Block) {
                var fieldBlock = param;
                var newScope = new Entry.Scope(fieldBlock, that.executor);
                return Entry.block[fieldBlock.type].func.call(newScope, that.entity, newScope);
            } else return param;
        });
    };

    p.getValue = function(key, block) {
        var fieldBlock = this.block.params[this._getParamIndex(key, block)];
        var newScope = new Entry.Scope(fieldBlock, this.executor);
        var result = Entry.block[fieldBlock.type].func.call(newScope, this.entity, newScope);
        return result;
    };

    p.getStringValue = function(key, block) {
        return String(this.getValue(key, block));
    };

    p.getNumberValue = function(key, block) {
        return Number(this.getValue(key));
    };

    p.getBooleanValue = function(key, block) {
        return Number(this.getValue(key, block)) ? true : false;
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
        return this.executor.stepInto(this.block.statements[
            this._getStatementIndex(key, block)
        ]);
    };

    p._getParamIndex = function(key) {
        if (!this._schema)
            this._schema = Entry.block[this.type];
        return this._schema.paramsKeyMap[key];
    };

    p._getStatementIndex = function(key) {
        if (!this._schema)
            this._schema = Entry.block[this.type];
        return this._schema.statementsKeyMap[key];
    };

    p.die = function() {
        this.block = null;
        return Entry.STATIC.BREAK;
    };
})(Entry.Scope.prototype);
