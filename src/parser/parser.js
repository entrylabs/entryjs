/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JSParser");

Entry.Parser = function(mode) {
    this._mode = mode; // maze ai workspace
    this.syntax = {};

    this.mappingSyntax(mode);
    this._parser = new Entry.JSParser(this.syntax);
};

(function(p) {
    p.parse = function(code) {
        var astTree = acorn.parse(code),
            block = null;

        block = this._parser.Program(astTree);
        console.log("asTree ====", block);

        return block;
    };

    p.mappingSyntax = function(mode) {
        var types = Object.keys(Entry.block);

        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var block = Entry.block[type];
            if (block.mode === mode) {
                var syntaxArray = block.syntax;
                if (!syntaxArray)
                    continue;
                var syntax = this.syntax;
                for (var j = 0; j < syntaxArray.length; j++) {
                    var key = syntaxArray[j];
                    if (!syntax[key]) {
                        syntax[key] = {};
                    }
                    if (j === syntaxArray.length - 1) {
                        syntax[key] = type;
                    } else {
                        syntax = syntax[key];
                    }
                }
            }
        }
    };
})(Entry.Parser.prototype);
