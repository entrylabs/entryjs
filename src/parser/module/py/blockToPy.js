/*
 *
 */
"use strict";

goog.provide("Entry.BlockToPyParser");

Entry.BlockToPyParser = function() {
    //Construtor
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
        return code + '\n';
    };

    p.Block = function(block) {
        if(!block._schema || !block._schema.syntax)
            return "";
        var syntax = block._schema.syntax.py[0];
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
                //console.log("schema param", schemaParams[paramIndex]);
                result += this['Field' + schemaParams[paramIndex].type](
                    block.params[paramIndex], schemaParams[paramIndex]);
            } else if (sreg.test(token)) {
                var stokens = token.split(sreg);

                for (var j=0; j<stokens.length; j++) {
                    var token2 = stokens[j];
                    if (token2.length === 0) continue;
                    if (sreg.test(token2)) {
                        var paramIndex = Number(token2.split('$')[1]) - 1;
                        result += this.indent(this.Thread(block.statements[paramIndex]));
                    } else result += token2;
                }
            } else
                result += token;
        }

        return result;
    };

    p.FieldAngle = function(param) {
        //console.log("FieldAngle", param);

        return this.Block(param);
    };

    p.FieldBlock = function(param) {
        //console.log("FieldBlock", param);

        return this.Block(param);
    };

    p.FieldColor = function(param) {
        //console.log("FieldColor", param);

        return "'" + param + "'";
    };

    p.FieldDropdown = function(param, schema) {
        //console.log("FieldDropdown", param);
        /*var value = param;
        var options = schema.options;
        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            if (option[1] == value){
                console.log("option", option[0]);
                return option[0];
            }
        }*/
        return param;
    };

    p.FieldDropdownDynamic = function(param, schema) {
        //console.log("FieldDropdownDynamic", param);
        /*var value = param;
        var options = schema.options;
        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            if (option[1] == value){
                console.log("option", option[0]);
                return option[0];
            }
        }*/
        return param;
    };

    p.FieldImage = function(param) {
        //console.log("FieldImage", param);
        return this.Block(param);
    };

    p.FieldIndicator = function(param, schema) {
        //console.log("FieldIndicator", param);
        //console.log("schema", schema);
        return param;
    };

    p.FieldKeyboard = function(param) {
        //console.log("FieldKeyboardInput", param);
        return this.Block(param);
    };

    p.FieldOutput = function(param) {
        //console.log("FieldOutput", param);
        return this.Block(param);
    };

    p.FieldStatement = function(param) {
        //console.log("FieldStatement", param);
        return this.Block(param);
    };

    p.FieldText = function(param) {
        //console.log("FieldText", param);
        return this.Block(param);
    };

    p.FieldTextInput = function(param) {
        //console.log("FieldTextInput", param);
        return param;
    };

    p.indent = function(textCode) {
        var result = "\t";
        var indentedCode = textCode.split("\n");
        indentedCode.pop();
        result += indentedCode.join("\n\t") + "\n";
        return result;
    };

})(Entry.BlockToPyParser.prototype);
