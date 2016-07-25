/*
 *
 */
"use strict";

goog.provide("Entry.BlockToJsParser");

Entry.BlockToJsParser = function(syntax) {
    this.syntax = syntax;
    console.log("BlockToJsParser syntax", this.syntax);

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
        console.log("block", block);
        if(block._schema.syntax.js)
            var syntax = block._schema.syntax.js;
        else
            var syntax = block._schema.syntax;
        console.log("syntax", syntax);
        if (!syntax)
            return "";
        var syntaxType = syntax[0];
        return this[syntaxType](block);
    };

    p.Program = function(block) {
        return "";
    };

    p.Scope = function(block) { 
        var notParenthesis = false;
        var result = '';
        console.log("Scope block", block);
        var paramReg = /(%.)/mi;
        if(block._schema.syntax.js) {
            var syntax = block._schema.syntax.js.concat();
            notParenthesis = true;
        }
        else {
            var syntax = block._schema.syntax.concat();
        }
        
        syntax.shift();
        var syntaxTokens = syntax[0].split(paramReg);
        
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;
        console.log("schemaParams", schemaParams);
        console.log("dataParams", dataParams);

        
        for (var i = 0; i < syntaxTokens.length; i++) { 
            var syntaxToken = syntaxTokens[i];  
            console.log("syntaxToken", syntaxToken);
            if (syntaxToken.length === 0 || syntaxToken === 'Scope') continue;
            if (syntaxToken === 'Judge') {
                console.log("judge", syntaxToken);
                notParenthesis = true;
                continue;
            }
            if (paramReg.test(syntaxToken)) {
                var paramIndex = syntaxToken.split('%')[1];
                var index = parseInt(paramIndex) - 1;
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Image") {
                        index++;    
                    } else if(schemaParams[index].type == "Block") {
                        var param = this.Block(dataParams[index]);
                        result += param;
                    } else {
                        result += this[schemaParams[index].type](dataParams[index], schemaParams[index]);
                    }
                } else {
                    console.log("This Block has No Schema");
                }
            }
            else {
                result += syntaxToken; 
            }
        }

        console.log("charAt", result.charAt(result.length-1));
        if(result.charAt(result.length-1) == '#') {
            notParenthesis = true;
            result = result.substring(0, result.length-1);
        }

        if(!notParenthesis)
            result += "();\n";
        
        return result;

        //return syntax.splice(1, syntax.length - 1).join(".") + "();\n";
    };

    p.BasicFunction = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var code = "function promise() {\n" +
            this.indent(statementCode) + "}\n"
        return code;
    };

    p.BasicIteration = function(block) {
        var iterateNumber = block.params[0];
        var iterVariable = this.publishIterateVariable();
        var statementCode = this.Thread(block.statements[0]);
        this.unpublishIterateVariable();
        var code = "for (var " + iterVariable + " = 0; " + iterVariable +
            " < " + iterateNumber + "; " + iterVariable + "++){\n" +
            this.indent(statementCode) + "}\n"; 
        return code;
    };

    p.BasicIf = function(block) {
        console.log("BasicIf block come on", block);
        
        if(block.data.statements.length == 2) {
            console.log("st1", block.statements[0]);
            var statementCode1 = this.Thread(block.statements[0]);
            var statementCode2 = this.Thread(block.statements[1]);
            var syntax = block._schema.syntax.concat();
            
            console.log("block.data.params[0] 1", block.data.params[0]);
            var paramBlock = block.data.params[0];

            if(paramBlock && paramBlock.data.type == "True") {
                var param = syntax[1];
            }
            else {
                if(paramBlock === undefined)
                    var param = syntax[1];
                else
                    var param = this.Block(paramBlock);
            }
            
            var code = "if (" + param + ") {\n" +
                this.indent(statementCode1) + "}\n" +
                "else {\n" + this.indent(statementCode2) + "}\n";
        } else {
            var statementCode1 = this.Thread(block.statements[0]);
            var syntax = block._schema.syntax.concat();
            
            console.log("block.data.params[0] 2", block.data.params[0]);
            var paramBlock = block.data.params[0];

            if(paramBlock && paramBlock.data.type == "True") {
                var param = syntax[1];
            }
            else {
                if(paramBlock === undefined)
                    var param = syntax[1];
                else
                    var param = this.Block(paramBlock);
            }
            
            var code = "if (" + param + ") {\n" +
                this.indent(statementCode1) + "}\n" 
        }

        return code;
    };

    p.BasicWhile = function(block) {
        var statementCode = this.Thread(block.statements[0]);
        var syntax = block._schema.syntax.concat();
        var code = "while (" + syntax[1] + ") {\n" +
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

    // iterate variable
    p.publishIterateVariable = function() {
        var iterVariable = "";
        var iterVariableCount = this._iterVariableCount;
        do {
            var chunk = this._iterVariableChunk[iterVariableCount % 3];
            iterVariable = chunk + iterVariable;
            iterVariableCount = parseInt(iterVariableCount / 3) - 1;
            if (iterVariableCount === 0)
                iterVariable = this._iterVariableChunk[0] + iterVariable;
        } while (iterVariableCount > 0);
        this._iterVariableCount++;
        return iterVariable;
    };

    p.unpublishIterateVariable = function() {
        if (this._iterVariableCount)
            this._iterVariableCount--;
    };

    p.Dropdown = function(dataParam) {
        console.log("Dropdown", dataParam);

        var result = "\'" + dataParam + "\'";
        
        return result; 
    };

    p.TextInput = function(dataParam) {
        console.log("TextInput", dataParam);

        var result = dataParam;
        
        return result; 
    };

    p.DropdownDynamic = function(dataParam, schemaParam) {
        console.log("FieldDropdownDynamic", dataParam, schemaParam);
        var object = Entry.playground.object;
        console.log("FieldDropdownDynamic Object", object);

        if(dataParam == "null") {
            dataParam = "none";
        } else {
            dataParam = Entry.TextCodingUtil.prototype.dropdownDynamicValueConvertor(dataParam, schemaParam);
        }                    
       
        console.log("FieldDropdownDynamic result ", dataParam);
        return dataParam;
    };

})(Entry.BlockToJsParser.prototype);
