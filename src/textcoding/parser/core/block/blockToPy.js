/*
 *
 */
"use strict";

goog.provide("Entry.BlockToPyParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.Map");
goog.require("Entry.Queue");

Entry.BlockToPyParser = function(blockSyntax) {
    this.blockSyntax = blockSyntax;

    var variableMap = new Entry.Map();
    this._variableMap = variableMap;

    var queue = new Entry.Queue();
    this._queue = queue;
};

(function(p){
    p.Code = function(code, parseMode) {
        this._parseMode = parseMode;
        console.log("parseMode", this._parseMode);

        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

            console.log("threads", threads);

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            textCode += this.Thread(thread) + '\n';
        }

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var result = "",
            blocks = thread.getBlocks();

            console.log("blocks", blocks);

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            

            result += this.Block(block) + '\n';

            this._queue.clear();
            this._variableMap.clear();
        }
        return result;
    };

    p.Block = function(block) {
        if(!block._schema || !block._schema.syntax)
            return "";
        var syntax = block._schema.syntax.py[0];
        if(!syntax || syntax == null)
            return "";
        var blockReg = /(%.)/mi;
        var statementReg = /(\$.)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        var result = "";  

        console.log("Block blockTokens", blockTokens);

        var currentBlock = block; 
        var currentBlockSkeleton = currentBlock._schema.skeleton;
        var currentBlockParamsKeyMap = currentBlock._schema.paramsKeyMap;

        console.log("currentBlock", currentBlock, "currentBlockSkeleton", currentBlockSkeleton,
            "currentBlockParamsKeyMap", currentBlockParamsKeyMap);

        if(this._parseMode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                    var blockParam = "";
                    var blockParamIndex = 0;
                }
            }
        }

        for (var i = 0; i < blockTokens.length; i++) { 
            var blockToken = blockTokens[i];
            
            if (blockToken.length === 0) continue;
            if (blockReg.test(blockToken)) {
                var blockParam = blockToken.split('%')[1];
                var index = Number(blockParam) - 1;
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Indicator") {
                        index++;    
                    } else if(schemaParams[index].type == "Block") {
                        var param = this.Block(dataParams[index]).trim();
                        result += param;

                        console.log("PARAM BLOCK", param);
                        console.log("PARAM BLOCK RESULT ", result);
                        
                        if(this._parseMode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                                    blockParam = param;
                                    console.log("basic block param", param, "i", i);

                                    var param = "";
                                    var paramsKey = Object.keys(currentBlockParamsKeyMap);        
                                    var variable = String(paramsKey[blockParamIndex++]);
                                    variable = variable.toLowerCase();
                                    console.log("variable", variable);

                                    var value = blockParam;
                                    console.log("value", value);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable); 
                                    console.log("Variable Map", this._variableMap);
                                    console.log("Queue", this._queue);
                                }
                            }
                        }
                    } else {
                        var param = this['Field' + schemaParams[index].type]
                                                    (dataParams[index], schemaParams[index]);
                        
                        if(param == null) {
                            if(schemaParams[index].text) {
                                param = schemaParams[index].text;
                            }
                            else {
                                param = null;   
                            }
                        }  
                        
                        param = Entry.TextCodingUtil.prototype.binaryOperatorValueConvertor(param);   
                        param = String(param);

                        if(!Entry.TextCodingUtil.prototype.isNumeric(param) &&
                           !Entry.TextCodingUtil.prototype.isBinaryOperator(param))
                           param = String("\"" + param + "\"");  
                       
                        result += param;

                        console.log("PARAM BLOCK", param);
                        console.log("PARAM BLOCK RESULT ", result);
                        
                        if(this._parseMode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                                    blockParam = param;
                                    console.log("basic block param", param, "i", i);

                                    var param = "";
                                    var paramsKey = Object.keys(currentBlockParamsKeyMap);        
                                    var variable = String(paramsKey[blockParamIndex++]);
                                    variable = variable.toLowerCase();
                                    console.log("variable", variable);

                                    var value = blockParam;
                                    console.log("value", value);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable); 
                                    console.log("Variable Map", this._variableMap);
                                    console.log("Queue", this._queue);
                                }
                            }
                        }

                    }
                }
            } else if (statementReg.test(blockToken)) {
                var statements = blockToken.split(statementReg);
                for (var j=0; j<statements.length; j++) {
                    var statementToken = statements[j];
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        var index = Number(statementToken.split('$')[1]) - 1;
                        result += Entry.TextCodingUtil.prototype.indent(this.Thread(block.statements[index]));
                    } 
                    else {
                        result += statementToken;  
                        
                        if(this._parseMode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                            if(this._currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_LOOP ||
                            this._currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_DOUBLE_LOOP) { //If Block Sekeleton is basic
                                if(this._currentBlockParamsKeyMap) {  //If Block has Parameters
                                    if(j == 0) { //The beginning of Block Statement
                                        console.log("This result is the beginning of Block Statement");
                                    }
                                }
                            }
                        }
                    } 
                }
            } else {
                var tagIndex = 0;
                var bb = blockToken.search('#');
                if(blockToken.search('#') != -1) {
                    var tagIndex = blockToken.indexOf('#');
                    blockToken = blockToken.substring(tagIndex+1);
                }

                result += blockToken;

                console.log("check result", result);

            }
        }

        if(this._parseMode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
            console.log("check1");
            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                console.log("check2");
                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                    console.log("check3");
                    var paramsCount = Object.keys(currentBlockParamsKeyMap).length;
                    if(paramsCount)
                        result = this.makeExpressionWithVariable(result, paramsCount); 
                }
            }
        }

        return result;
    };

    p.FieldAngle = function(dataParam) {
        console.log("FieldAngle", dataParam);

        return dataParam;
    };

    p.FieldColor = function(dataParam) {
        console.log("FieldColor", dataParam);

        return dataParam;
    };

    p.FieldDropdown = function(dataParam) {
        console.log("FieldDropdown", dataParam);
        
        return dataParam;
    };

    p.FieldDropdownDynamic = function(dataParam, schemaParam) {
        console.log("FieldDropdownDynamic", dataParam);

        if(dataParam == "null") {
            dataParam = "none";
        } else {
            dataParam = Entry.TextCodingUtil.prototype.dropdownDynamicValueConvertor(dataParam, schemaParam);
        }                    
       
        return dataParam;
    };

    p.FieldImage = function(dataParam) {
        console.log("FieldImage", dataParam);

        return dataParam;
    };

    p.FieldIndicator = function(dataParam) {
        console.log("FieldIndicator", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        console.log("FieldKeyboardInput", dataParam);

        return dataParam;
    };

    p.FieldOutput = function(dataParam) {
        console.log("FieldOutput", dataParam);

        return dataParam;
    };

    p.FieldText = function(dataParam) {
        console.log("FieldText", dataParam);

        return dataParam;
    };

    p.FieldTextInput = function(dataParam) {
        console.log("FieldTextInput", dataParam);

        return dataParam;
    };

    p.FieldNumber = function(dataParam) {
        console.log("FieldNumber", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        console.log("FieldKeyboard Before", dataParam);

        dataParam = Entry.KeyboardCode.prototype.keyCodeToChar[dataParam];

        if(!dataParam || dataParam == null)
            dataParam = "Q";

        console.log("FieldKeyboard After", dataParam);

        return dataParam;
    };

    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };

    p.makeExpressionWithVariable = function(exp, paramCount) {
        console.log("makeExpressionWithVariable EXP", exp);
        console.log("makeExpressionWithVariable Queue", this._queue.toString());
        console.log("makeExpressionWithVariable VariableMap", this._variableMap.toString());


        var result;
        var expression = "";
        var variableDeclarations = "";
        var safeIndex = 0;
        

        //if(exp.match(/.*\..*\)/)) {
        var index = exp.indexOf('(');
        exp = exp.substring(0, index);
        //}
        
        var expression = exp.trim().concat("(");  
        var variable;
        while(variable = this._queue.dequeue()) { 
            console.log("makeExpressionWithVariable variable", variable);
            
            var value = this._variableMap.get(variable);
            console.log("makeExpressionWithVariable value", value);
            
            var variableDeclaration = variable.concat(" = ").concat(value).concat('\n');
            variableDeclarations += variableDeclaration;
            
            

            expression = expression.concat(variable).concat(',').concat(' ');
            safeIndex++;

            if(safeIndex > 10)
                break;
        }
       
        var index = expression.lastIndexOf(',');
        expression = expression.substring(0, index);
        expression = expression.trim().concat(')');
       
        result = variableDeclarations.concat(expression);

        console.log("makeExpressionWithVariable result", result);

        return result;
    };

    
})(Entry.BlockToPyParser.prototype);
