/*
 *
 */
"use strict";

goog.provide("Entry.Executor");


Entry.Executor = function(block) {
    this.scope = {
        block: block,
        executor: this
    };
    this._callStack = [];
};

(function(p) {
    p.execute = function() {
        var returnVal = this.scope.block._schema.func.call(this.scope);
        if (returnVal === undefined) {
            this.scope = {
                block: this.scope.block.next,
                executor: this
            };
        }
        if (this.scope.block === null) {
            if (this._callStack.length)
                this.scope = this._callStack.pop();
        }
    };

    p.stepInto = function(thread) {
        if (!(thread instanceof Entry.Thread))
            console.error("Must step in to thread");

        this._callStack.push(this.scope);

        var block = thread.getFirstBlock();
        if (block.isDummy) block = block.next;

        this.scope = {
            block: block,
            executor: this
        };
    };
})(Entry.Executor.prototype);
