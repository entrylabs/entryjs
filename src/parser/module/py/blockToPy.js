/*
 *
 */
"use strict";

goog.provide("Entry.BlockToPyParser");

goog.require("Entry.KeyboardCodeMap");

Entry.BlockToPyParser = function() {

};

(function(p){
    p.Code = function(code) {
        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

            console.log("threads", threads.length);

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            textCode += this.Thread(thread) + '\n';

            console.log("textCode", textCode);
        }

        console.log("textCode in", textCode);

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var result = "",
            blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            result += (this.Block(block) + '\n');
        }
        return result;
    };

    p.Block = function(block) {
        if(!block._schema || !block._schema.syntax)
            return "";
        var syntax = block._schema.syntax.py[0];
        if(!syntax || syntax == null)
            return "";
        var blockReg = /(%\d)/mi;
        var statementReg = /(\$\d)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        console.log("block", block);
        console.log("schemaParams", schemaParams);
        console.log("dataParams", dataParams);

        var result = "";
        for (var i=0; i<blockTokens.length; i++) {
            var blockToken = blockTokens[i];
            console.log("blockToken", blockToken);
            if (blockToken.length === 0) continue;
            if (blockReg.test(blockToken)) {
                var index = Number(blockToken.split('%')[1]) - 1;
                console.log("schemaParams[index].type", schemaParams[index].type);
                if(schemaParams[index].type == "Indicator") {
                    index++;    
                }
                if(schemaParams[index].type == "Block") {
                    result += this.Block(dataParams[index]);
                } 
                else {
                    var param = this['Field' + schemaParams[index].type](dataParams[index]);
                    if(param == null)
                        if(schemaParams[index].text)
                            param = schemaParams[index].text;
                        else
                            param = null;

                    result += param;
                }
            } else if (statementReg.test(blockToken)) {
                var statements = blockToken.split(statementReg);
                for (var j=0; j<statements.length; j++) {
                    var statementToken = statements[j];
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        var index = Number(statementToken.split('$')[1]) - 1;
                        result += this.indent(this.Thread(block.statements[index]));
                    } else result += statementToken;
                }
            } else
                result += blockToken;
        }
        return result;
    };

    p.FieldAngle = function(param) {
        console.log("FieldAngle", param);

        return param;
    };

    p.FieldColor = function(param) {
        console.log("FieldColor", param);

        return param;
    };

    p.FieldDropdown = function(param) {
        console.log("FieldDropdown", param);
        
        return param;
    };

    p.FieldDropdownDynamic = function(param) {
        console.log("FieldDropdownDynamic", param);
       
        return param;
    };

    p.FieldImage = function(param) {
        console.log("FieldImage", param);

        return param;
    };

    p.FieldIndicator = function(param) {
        console.log("FieldIndicator", param);

        return param;
    };

    p.FieldKeyboard = function(param) {
        console.log("FieldKeyboardInput", param);

        return param;
    };

    p.FieldOutput = function(param) {
        console.log("FieldOutput", param);

        return param;
    };

    p.FieldText = function(param) {
        console.log("FieldText", param);

        return param;
    };

    p.FieldTextInput = function(param) {
        console.log("FieldTextInput", param);

        return param;
    };

    p.FieldNumber = function(param) {
        console.log("FieldNumber", param);

        return param;
    };

    p.FieldKeyboard = function(param) {
        console.log("FieldKeyboard Before", param);

        param = Entry.KeyboardCodeMap.prototype.keyCodeToChar[param];

        if(!param || param == null)
            param = "Q";

        console.log("FieldKeyboard After", param);

        return param;
    };

    p.indent = function(textCode) {
        console.log("indent textCode", textCode);
        var result = "\t";
        var indentedCode = textCode.split("\n");
        indentedCode.pop();
        result += indentedCode.join("\n\t");
        return result;
    };

})(Entry.BlockToPyParser.prototype);
