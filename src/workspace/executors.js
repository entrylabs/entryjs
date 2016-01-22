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
            if (returnVal === undefined || returnVal === null) {
                this.scope = new Entry.Scope(this.scope.block.next, this);
                if (this.scope.block === null) {
                    if (this._callStack.length)
                        this.scope = this._callStack.pop();
                    else
                        break;
                }
            } else if (returnVal === Entry.STATIC.CONTINUE) {
                break;
            }
        }
    };

    p.stepInto = function(thread) {
        if (!(thread instanceof Entry.Thread))
            console.error("Must step in to thread");

        this._callStack.push(this.scope);

        var block = thread.getFirstBlock();
        if (block.isDummy) block = block.next;

        this.scope = new Entry.Scope(block, this);
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

    p.getNumberValue = function(key, block) {
        return 10;
        return Number(this.block.params[0]);
    };

    p.getStatement = function(key) {
        this.executor.stepInto(this.block.statements[0]);
        return Entry.STATIC.CONTINUE;
    };
})(Entry.Scope.prototype);
