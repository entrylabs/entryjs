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

    var funcMap = new Entry.Map();
    this._funcMap = funcMap;

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
        /*if(!block._schema)
            return "";*/
        var result = ""; 
        var syntax;

        if(block._schema && block._schema.syntax)
            syntax = block._schema.syntax.py[0];
        
        // User Function
        if(this.isFunc(block)) {
            console.log("Block isFunc", block);
            result += this.makeFuncDef(block);

            syntax = this.makeFuncSyntax(block);
            
            console.log("Func Fianl Syntax", syntax);
        } else if(this.isFuncParam(block)) {
            result += block.data.type;
        }

        console.log("Block Syntax", syntax);

        if(!syntax || syntax == null)
            return result;

        var blockReg = /(%.)/mi;
        var statementReg = /(\$.)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        console.log("Block blockTokens", blockTokens);

        var currentBlock = block; 
        var currentBlockSkeleton = currentBlock._schema.skeleton;
        var currentBlockParamsKeyMap = currentBlock._schema.paramsKeyMap;


        console.log("currentBlock", currentBlock, "currentBlockSkeleton", currentBlockSkeleton,
            "currentBlockParamsKeyMap", currentBlockParamsKeyMap);

        var blockParam = "";
        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PASRSE_VARIABLE Mode
            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                    blockParam = "";
                    var blockParamIndex = 0;
                }
            }
        }

        console.log("Block schemaParams", schemaParams);
        console.log("Block dataParams", dataParams);

        for (var i = 0; i < blockTokens.length; i++) { 
            var blockToken = blockTokens[i];  
            if (blockToken.length === 0) continue;
            if (blockReg.test(blockToken)) {
                var blockParamIndex = blockToken.split('%')[1];
                var index = Number(blockParamIndex) - 1;
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Indicator") {
                        index++;    
                    } else if(schemaParams[index].type == "Block") {
                        console.log("Block dataParams[index]", dataParams[index]);

                        console.log("Block param current block1", currentBlock);
                        var param = this.Block(dataParams[index]).trim();

                        console.log("funcMap", this._funcMap.toString());
                        var funcParam = this._funcMap.get(param);

                        console.log("param", param, "func param", funcParam);
                        if(funcParam) {
                            console.log("func param current result", result);
                            result += funcParam;
                            continue;
                        }

                        console.log("Block param current block2", currentBlock);
                        

                        result += param;

                        console.log("PARAM BLOCK", param);
                        console.log("PARAM BLOCK RESULT ", result);
                        
                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
                            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                                    blockParam = param;
                                    console.log("basic block param", param, "i", i);

                                    var paramsKey = Object.keys(currentBlockParamsKeyMap);        
                                    var variable = String(paramsKey[blockParamIndex++]);
                                    variable = variable.toLowerCase();
                                    console.log("variable", variable);

                                    var value = blockParam;
                                    console.log("value", value);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable); 
                                    console.log("Variable Map", this._variableMap.toString());
                                    console.log("Queue", this._queue.toString());
                                }
                            }
                        }
                    } else {
                        var maybeId = dataParams[index];
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

                        param = Entry.TextCodingUtil.prototype.variableFilter(block, blockParamIndex, param);

                        //Variable Processing
                        if(currentBlock.data.type == "get_variable" || 
                            currentBlock.data.type == "set_variable" || 
                            currentBlock.data.type == "change_variable") {
                            console.log("check in set_variable");
                            var entryVariables = Entry.variableContainer.variables_;
                            console.log("entryVariables", entryVariables, "param", param);
                            for(var e in entryVariables) {
                                var entryVariable = entryVariables[e];
                                if(maybeId == entryVariable.id_)// entryVariable.name_ == param)
                                    if(entryVariable.object_) {
                                        var object = Entry.container.getObject(entryVariable.object_);
                                        console.log("entry variable object", object);
                                        param = object.name.concat('.').concat(param);
                                    }

                            }
                        }
                       
                        result += param;

                        console.log("PARAM BLOCK", param);
                        console.log("PARAM BLOCK RESULT ", result);
                        
                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
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
                } else {
                    console.log("This Block has No Schema");
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
                        
                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
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

        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
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
        console.log("FieldDropdownDynamic", dataParam, schemaParam);
        var object = Entry.stage.selectedObject;
        console.log("FieldDropdownDynamic Object", object);

        if(dataParam == "null") {
            dataParam = "none";
        } else {
            dataParam = Entry.TextCodingUtil.prototype.dropdownDynamicValueConvertor(dataParam, schemaParam);
        }                    
       
        console.log("FieldDropdownDynamic result ", dataParam);
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

    p.makeExpressionWithVariable = function(blockExp, paramCount) {
        console.log("makeExpressionWithVariable blockExp", blockExp);
        console.log("makeExpressionWithVariable Queue", this._queue.toString());
        console.log("makeExpressionWithVariable VariableMap", this._variableMap.toString());

        var result;
        var expression = "";
        var variableDeclarations = "";
        var safeIndex = 0;
        
        //if(exp.match(/.*\..*\)/)) {
        var index = blockExp.indexOf('(');
        var exp = blockExp.substring(0, index);
        //}
        
        var expression = exp.trim().concat("(");  
        
        if(this._queue.toString()) {
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
        } else {
            result = blockExp;
        }

        console.log("makeExpressionWithVariable result", result);

        return result;
    };

    p.isFunc = function(block) {
        var prefix = block.data.type.substring(0, 4);
        if(prefix == "func")
            return true;
        else 
            return false;
    };

    p.isFuncParam = function(block) {
        var type = block.data.type;
        var index = type.search('_');
        var prefix = type.substring(0, index);
        console.log("isFuncParam prefix", prefix);
        if(prefix == "stringParam" || prefix == "booleanParam")
            return true;
        else 
            return false;
    }

    p.makeFuncSyntax = function(funcBlock) {
        var syntax = "";
        var schemaTemplate = funcBlock._schema.template.trim();
        console.log("Func schemaTemplate", schemaTemplate);
        var schemaParams = funcBlock._schema.params;
        console.log("Func schemaParams", schemaParams);
        
        var paramReg = /(%.)/mi;

        var funcTokens = schemaTemplate.trim().split(paramReg);
        console.log("funcTokens", funcTokens);

        var funcName = "";
        var funcParams = "";
       
        for(var f in funcTokens) {
            var funcToken = funcTokens[f].trim();
            console.log("funcToken", funcToken);
            if(paramReg.test(funcToken)) {
                var num = funcToken.split('%')[1];
                var index = Number(num) - 1;
                if(schemaParams[index].type == "Indicator")
                    continue;
                funcParams += funcToken.concat(', ');
            }
            else {
                var funcTokenArr = funcToken.split(' ');
                funcName += funcTokenArr.join('_');
            }
        }

        var index = funcParams.lastIndexOf(',');
        funcParams = funcParams.substring(0, index);

        syntax = funcName.trim().concat('(').concat(funcParams.trim()).concat(')');

        return syntax;
    };

    p.makeFuncDef = function(funcBlock) {
        var result = 'def ';
        var func = this.getFuncInfo(funcBlock);

        if(!func.name) 
            return;
        else 
            result += func.name;

        result = result.concat('(');
        if(func.params.length != 0) {
            for(var p in func.params) {
                result += func.params[p]
                result = result.concat(', ');
            }
            var index = result.lastIndexOf(',');
            result = result.substring(0, index);
            result = result.trim();
        }
        result = result.concat('):').concat('\n');

        if(func.statements.length) {
            var stmtResult = "";
            for(var s in func.statements) {
                var block = func.statements[s];
                console.log("makeFuncDef statements", block);
                stmtResult += this.Block(block).concat('\n');

            }
            stmtResult = stmtResult.concat('\n');
            result += Entry.TextCodingUtil.prototype.indent(stmtResult).concat('\n');
        }
        
        console.log("makeFuncDef result", result);

        this._funcMap.clear();

        return result;
    };

    p.getFuncInfo = function(funcBlock) {
        var result = {};

        var id = funcBlock.data.type.substring(5);
        console.log("getFuncInfo id", id);
        var _functions = Entry.variableContainer.functions_;
        var func = _functions[id];

        console.log("getFuncInfo func", func);

        var template = func.block.template;
        var index = template.search(/(%.)/);
        console.log("getFuncInfo index", index);
        var funcNameTemplate = template.substring(0, index).trim();
        var funcNameArr = funcNameTemplate.split(' ');

        var funcName = funcNameArr.join('_');
        console.log("makeFuncDef funcName", funcName);
        var funcParamMap = func.paramMap;

        if(funcParamMap) {
            var funcParams = {};
            for(var key in funcParamMap) {
                var index = funcParamMap[key];
                var i = key.search('_');
                var nickname = key.substring(0, i);
                if(nickname == 'stringParam')
                    var name = 'param' + String(index+1);
                else if (nickname == 'booleanParam')
                    var name = 'param' + String(index+1);

                var param = name;
                funcParams[index] = param;
                this._funcMap.put(key, param);
            }
        }

        var contents  = func.content._data[0]._data;
        var funcContents = [];
        for(var c = 1; c < contents.length; c++) {
            var block = contents[c]
            funcContents.push(block);
        }

        console.log("getFuncInfo funcContents", funcContents);

        result.name = funcName;
        result.params = funcParams;
        result.statements = funcContents;

        return result;
    };

    
})(Entry.BlockToPyParser.prototype);
