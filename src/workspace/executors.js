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
    };

    p.stepInto = function() {
    };
})(Entry.Executor.prototype);
