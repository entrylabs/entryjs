/*
 *
 */
"use strict";

goog.provide("Entry.Executor");

Entry.Executor = function(block, entity) {
    this.scope = new Entry.Scope(block, this);
    this.entity = entity;
    this._callStack = [];
};

(function(p) {
    p.execute = function() {
        while (true) {
            var returnVal = this.scope.block._schema.func.call(this.scope, this.entity, this.scope);
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
        return Number(this.getValue(key, block));
    };

    p.getBooleanValue = function(key, block) {
        return Number(this.getValue(key, block)) ? true : false;
    };

    p.getField = function(key, block) {
        return this.block.params[this._getParamIndex(key)];
    };

    p.getStringField = function() {
        return String(this.getField());
    };

    p.getNumberField = function() {
        return Number(this.getField());
    };

    p.getStatement = function(key, block) {
        return this.executor.stepInto(this.block.statements[
            this._getStatementIndex(key, block)
        ]);
    };

    p._getParamIndex = function(key) {
        return Entry.block[this.type].paramsKeyMap[key];
    };

    p._getStatementIndex = function(key) {
        return Entry.block[this.type].statementsKeyMap[key];
    };
})(Entry.Scope.prototype);
