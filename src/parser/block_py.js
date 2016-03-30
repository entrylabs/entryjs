/*
 *
 */
"use strict";

goog.provide("Entry.PythonBlockParser");

Entry.PyBlockParser = function(syntax) {
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
            console.log("threadblock", block);
            code += this.Block(block);
        }
        return code;
    };

    p.Block = function(block) { 
        var syntax = block._schema.syntax;
        if (!syntax)
            return "";

        syntax = block._schema.syntax.py[0];
        var breg = /(%\d)/mi;
        var sreg = /(\$\d)/mi;
        var btokens = syntax.split(breg);

        var schemaParams = block._schema.params;

        var result = "";
        for (var i=0; i<btokens.length; i++) {
            var token = btokens[i];
            if (token.length === 0) continue;
            if (breg.test(token)) {
                var paramIndex = Number(token.split('%')[1]) - 1;
                result += this['Field' + schemaParams[paramIndex].type](block.params[paramIndex]);
            } 
            else if (sreg.test(token)) {
                var stokens = token.split(sreg);
                console.log("stokens", stokens);

                for (var j=0; j<stokens.length; j++) {
                    var token2 = stokens[j];
                    console.log("token2", token2);
                    if (token2.length === 0) continue;
                    if (sreg.test(token2)) {
                        console.log("in!!!");
                        var paramIndex = Number(token2.split('$')[1]) - 1;
                        console.log("block.statement", block.statements[paramIndex]);
                        result += this.Thread(block.statements[paramIndex]);
                        
                    } else
                    result += token2;
                }
            }
            else
                result += token;
        }

        return result;
    };

    p.FieldBlock = function(param) {
        
        return this.Block(param);
    };

    p.FieldIndicator = function(param) {
       
        return this.Block(param);
    };

    p.FieldTextInput = function(param) {
        
        return this.Block(param);
    }

})(Entry.PyBlockParser.prototype);
