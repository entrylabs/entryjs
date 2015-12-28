/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JSParser");
goog.require("Entry.BlockParser");

Entry.Parser = function(mode, cm) {
    this._mode = mode; // maze ai workspace
    this.syntax = {};
    this.codeMirror = cm;

    this.mappingSyntax(mode);
    this._parser = new Entry.JSParser(this.syntax);
};

(function(p) {
    p.parse = function(code) {
        var astTree = acorn.parse(code),
            block = null;

        try {
            block = this._parser.Program(astTree);
        } catch(error) {
            // alert(error.message);
            if (this.codeMirror) {
                var anotation = this.getLineNumber(error.node.start, error.node.end);
                anotation.message = error.message;
                anotation.severity = "error";
                var a = this.codeMirror.markText(anotation.from, anotation.to, {
                    className: "CodeMirror-lint-mark-error",
                    __annotation: anotation,
                    clearOnEnter: true
                });
            }
            block = [];
        }

        console.log("asTree ====", block);

        return block;
    };

    p.getLineNumber = function (start, end) {
        var value = this.codeMirror.getValue();
        var lines = {
            'from' : {},
            'to' : {}
        }

        var startline = value.substring(0, start).split(/\n/gi);
        lines.from.line = startline.length - 1;
        lines.from.ch = startline[startline.length - 1].length;

        var endline = value.substring(0, end).split(/\n/gi);
        lines.to.line = endline.length - 1;
        lines.to.ch = endline[endline.length - 1].length;

        return lines;
    }

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
