/*
 *
 */
"use strict";

goog.provide("Entry.PythonBlockParser");

Entry.PythonBlockParser = function(syntax) {
    this.syntax = syntax;

    this._iterVariableCount = 0;
    this._iterVariableChunk = ["i", "j", "k"];
};

(function(p){
    p.Code = function(code) {
        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            textCode += this.Thread(thread);
        }

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var code = "",
            blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            code += this.Block(block);
        }
        return code;
    };

    p.Block = function(block) { 
        console.log("block.params", block.params);
        var syntax = block._schema.syntax;
        if (!syntax)
            return "";

        syntax = block._schema.syntax.py[0];
        var reg = /(%\d)/mi;
        var templateParams = syntax.split(reg);

        var params = block._schema.params;

        var result = "";
        for (var i=0; i<templateParams.length; i++) {
            var param = templateParams[i];
            if (param.length === 0) continue;
            if (reg.test(param)) {
                var paramIndex = Number(param.split('%')[1]) - 1;
                console.log("type", params[paramIndex].type);
                result += this['Field' + params[paramIndex].type](block.params[paramIndex]);
            }
            else
                result += param;
        }
        return result;
    };

    p.FieldBlock = function(param) {
        return this.Block(param);
    };

    p.FieldIndicator = function(param) {
        return this.Block(param);
    };

})(Entry.PythonBlockParser.prototype);
