/*
 *
 */
"use strict";

goog.provide("Entry.Executor");


Entry.Executor = function(block) {
    this.block = block;
    this._callStack = [];
};

(function(p) {
    p.execute = function() {
        var returnVal = this.block._schema.func.call(this);
        if (returnVal === undefined) {
            this.block = this.block.next;
        }
        if (this.block === null) {
            if (this._callStack.length)
                this.block = this._callStack.pop();
        }
    };

    p.stepInto = function(thread) {
        if (!(thread instanceof Entry.Thread))
            console.error("Must step in to thread");

        this._callStack.push(this.block);

        var block = thread.getFirstBlock();
        if (block instanceof Entry.DummyBlock)
            block = block.next;
        this.block = block;
    };
})(Entry.Executor.prototype);
