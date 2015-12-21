/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JSParser");

Entry.Parser = function(mode) {
    this._mode = mode; // maze ai workspace
    this.scope = {};

    this.mappingScope();
    this._parser = new Entry.JSParser(this.scope);
};

(function(p) {
    p.parse = function(code) {
        var astTree = acorn.parse(code),
            block = null;

        block = this._parser.Program(astTree);
        console.log("asTree ====", block);

        return block;
    };

    p.mappingScope = function(mode) {
        var types = Entry.blocks;

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var block = Entry.blocks[type];
            if (block.mode) {
                this.scope
            }
        }
    };
})(Entry.Parser.prototype);
