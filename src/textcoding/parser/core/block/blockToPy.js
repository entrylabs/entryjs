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
        this._mode = parseMode;
        console.log("this._mode", this._mode);

        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

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

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            this._currentMainBlock = block; 
            this._currentMainBlockSkeleton = this._currentMainBlock._schema.skeleton;
            this._currentMainBlockParamsKeyMap = this._currentMainBlock._schema.paramsKeyMap;
            this._currentmainBlockIndex = 0;

            console.log("Thread MainBlock", this._currentMainBlock, "Thread Skeleton", this._currentMainBlockSkeleton,
                "ParamsKeyMap", this._currentMainBlockParamsKeyMap);

            result += (this.Block(block) + '\n');

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

        for (var i = 0; i < blockTokens.length; i++) { 
            var blockToken = blockTokens[i];
            console.log("Block blockToken check1", blockToken, "i", i);
            if (blockToken.length === 0) continue;
            if (blockReg.test(blockToken)) {
                var blockParam = blockToken.split('%')[1];
                var index = Number(blockParam) - 1;
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Indicator") {
                        index++;    
                    } else if(schemaParams[index].type == "Block") {
                        result += this.Block(dataParams[index]).trim();
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
                       
                        console.log("this._currentMainBlockSkeleton", this._currentMainBlockSkeleton, "SYMBOL", Entry.Parser.BLOCK_SKELETON_BASIC);

                        //In PARSE_LANGUAGE Mode
                        if(this._mode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                            if(this._currentMainBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(this._currentMainBlockParamsKeyMap) {  //If Block has Parameters
                                    console.log("Check paramsKeyMap", this._currentMainBlockParamsKeyMap); 
                                    var paramsKey = Object.keys(this._currentMainBlockParamsKeyMap);        
                                    var variable = String(paramsKey[this._currentmainBlockIndex++]);
                                    variable = variable.toLowerCase();

                                    var value = param;

                                    console.log("Block param into Queue", param);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable); 
                                    console.log("Queue", this._queue.toString());
                                } else {
                                    console.log("Block Param check1", param);
                                    result += param;
                                }
                            } else {
                                console.log("Block Param check2", param);
                                result += param;
                            }
                        } else { //Not in the above condition
                            console.log("Block Param check3", param);
                            result += param;
                        }
                    }
                }
            } else if (statementReg.test(blockToken)) {
                var statements = blockToken.split(statementReg);
                for (var j=0; j<statements.length; j++) {
                    var statementToken = statements[j];
                    console.log("Block statementToken check1", statementToken, "j", j);
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        var index = Number(statementToken.split('$')[1]) - 1;
                        result += Entry.TextCodingUtil.prototype.indent(this.Thread(block.statements[index]));
                    } 
                    else {
                        console.log("Block statementToken check2", "j", j);
                        result += statementToken;  
                        
                        //In PARSE_LANGUAGE Mode
                        if(this._mode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                            if(this._currentMainBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_LOOP ||
                            this._currentMainBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_DOUBLE_LOOP) { //If Block Sekeleton is basic
                                if(this._currentMainBlockParamsKeyMap) {  //If Block has Parameters
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

                console.log("Block blockToken check2", blockToken, "i", i);
                result += blockToken;

                console.log("this._currentMainBlockSkeleton", this._currentMainBlockSkeleton, "SYMBOL", Entry.Parser.BLOCK_SKELETON_BASIC);
                if(blockToken && i == blockTokens.length-1) { //This result is the end of CallExpression
                    console.log("go to makeExpressionWithVariable check1")
                    if(this._mode == Entry.Parser.PARSE_LANGUAGE) { //In PASRSE_LANGUAGE Mode
                        console.log("go to makeExpressionWithVariable check2")
                        if(this._currentMainBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                            console.log("go to makeExpressionWithVariable check3")
                            if(this._currentMainBlockParamsKeyMap) {  //If Block has Parameters
                                console.log("result : Block about to enter Language Combination", result);
                                
                                var paramsCount = Object.keys(this._currentMainBlockParamsKeyMap).length;
                                if(paramsCount)
                                    result = this.makeExpressionWithVariable(result, paramsCount); 
                            }
                        }
                    }
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
        var result;
        var expression = "";
        var variableDeclarations = "";

        console.log("exp", exp);

        //if(exp.match(/.*\..*\)/)) {
        var index = exp.indexOf('(');
        exp = exp.substring(0, index);
        //}
        
        var expression = exp.trim().concat("(");

        for(var i = 0; i < paramCount; i++) {
            var variable = this._queue.dequeue();
            console.log("this._queue", this._queue.toString());
            var value = this._variableMap.get(variable);
            console.log("this._variableMap", this._variableMap);
            var variableDeclaration = variable.concat(" = ").concat(value).concat('\n');
            variableDeclarations += variableDeclaration;
            
            if(i == paramCount -1) {
                expression = expression.concat(variable).concat(')');
            }
            else {    
                expression = expression.concat(variable).concat(', ');
            }
       
        }
       
        result = variableDeclarations.concat(expression);

        console.log("makeExpressionWithVariable result", result);

        return result;
    };

    
})(Entry.BlockToPyParser.prototype);
