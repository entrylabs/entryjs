/*
 *
 */
"use strict";

goog.provide("Entry.BlockParser");

Entry.BlockParser = function(syntax) {
    this.syntax = syntax;
};

(function(p){
    p.Code = function(code) {
        var textCode = "";

        var threads = code.getThreads();

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            textCode += this.Thread(thread);
        }

        return textCode;
    };

    p.Thread = function(thread) {
        var code = "";
        var blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            code += this.Block(block);
        }
        return code;
    };

    p.Block = function(block) {
        var syntax = block._schema.syntax;
        if (!syntax)
            return "";
        var syntaxType = syntax[0];
        return this[syntaxType](block);
    };

    p.Program = function(block) {
        return "";
    };

    p.Scope = function(block) {
        var syntax = block._schema.syntax.concat();
        return syntax.splice(1, syntax.length - 1).join(".") + "();\n";
    };

    p.ForStatement = function(block) {
        var iterateNumber = block.params[0];
        console.log(block.statements[0]);
        var statementCode = this.Thread(block.statements[0]);
        var code = "for (var i = 0; i < " + iterateNumber + "; i++){\n" +
            this.indent(statementCode) + "}\n"
        return code;
    };

    p.indent = function(textCode) {
        var result = "    ";
        var indentedCode = textCode.split("\n");
        indentedCode.pop();
        result += indentedCode.join("\n    ") + "\n";
        return result;
    };

})(Entry.BlockParser.prototype);
