/*
 *
 */
"use strict";

goog.provide("Entry.Parser");

goog.require("Entry.JSParser");
goog.require("Entry.BlockParser");

Entry.Parser = function(mode, syntax, cm) {
    this._mode = mode; // maze ai workspace
    this.syntax = {};
    this.codeMirror = cm;
    this._lang = syntax || "js";

    this.mappingSyntax(mode);
    switch (this._lang) {
        case "js":
            this._parser = new Entry.JSParser(this.syntax);
            break;
        case "block":
            this._parser = new Entry.BlockParser(this.syntax);
            break;
    }
};

(function(p) {
    p.parse = function(code) {
        var result = null;

        switch (this._lang) {
            case "js":
                var astTree = acorn.parse(code);
                console.log(astTree);

                try {
                    result = this._parser.Program(astTree);
                } catch(error) {
                    console.log(error);
                    // alert(error.message);
                    if (this.codeMirror) {
                        var anotation = this.getLineNumber(error.node.start,
                                                           error.node.end);
                        anotation.message = error.message;
                        anotation.severity = "error";
                        var a = this.codeMirror.markText(
                            anotation.from, anotation.to, {
                            className: "CodeMirror-lint-mark-error",
                            __annotation: anotation,
                            clearOnEnter: true
                        });
                    }
                    result = [];
                }
                break;
            case "block":
                result = this._parser.Code(code);
                break;
        }

        return result;
    };

    p.getLineNumber = function (start, end) {
        var value = this.codeMirror.getValue();
        var lines = {
            'from' : {},
            'to' : {}
        };

        var startline = value.substring(0, start).split(/\n/gi);
        lines.from.line = startline.length - 1;
        lines.from.ch = startline[startline.length - 1].length;

        var endline = value.substring(0, end).split(/\n/gi);
        lines.to.line = endline.length - 1;
        lines.to.ch = endline[endline.length - 1].length;

        return lines;
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
                    if (j === syntaxArray.length - 2 &&
                       typeof syntaxArray[j + 1] === "function") {
                        syntax[key] = syntaxArray[j + 1];
                        break;
                    }
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
