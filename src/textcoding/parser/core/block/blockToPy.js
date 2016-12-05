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
    this._type ="BlockToPyParser";

    var funcMap = new Entry.Map();
    this._funcMap = funcMap;

    var funcDefMap = {};
    this._funcDefMap = {};

    this._variableDeclaration = null;
    this._listDeclaration = null;
    this._forIdCharIndex = 0;
};

(function(p){ 
    p.Code = function(code, parseMode) {
        this._parseMode = parseMode;
        if(!code) return;
        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

        for (var i = 0; i < threads.length; i++) {
            this._forIdCharIndex = 0;
            var thread = threads[i];

            textCode += this.Thread(thread) + '\n';
        }
        textCode = textCode.trim();

        return textCode;
    };

    p.Thread = function(thread) {
        console.log("start thread");
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var result = "",
            blocks = thread.getBlocks();
        var isEventBlock = false;
        var rootBlock;
        var rootResult = '';
        var contentResult = '';
        var definition = '';
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if(this._parseMode == Entry.Parser.PARSE_GENERAL) {
                if(Entry.TextCodingUtil.isNoPrintBlock(block))
                    continue;
                if(i == 0) {
                    rootBlock = block;
                    isEventBlock = Entry.TextCodingUtil.isEventBlock(block);
                    if(isEventBlock)
                        rootResult = this.Block(block) + '\n';
                    else
                        contentResult += this.Block(block) + '\n';
                }
                else if(i != 0) {
                    var content = this.Block(block) + '\n';
                    contentResult += content;
                }
            } else if(this._parseMode == Entry.Parser.PARSE_SYNTAX) {
                isEventBlock = Entry.TextCodingUtil.isEventBlock(block);
                if(isEventBlock)
                    result = definition;
                else
                    result = this.Block(block) + '\n';
            }
        }

        if(this._parseMode == Entry.Parser.PARSE_GENERAL) {
            if(isEventBlock) {
                contentResult = Entry.TextCodingUtil.indent(contentResult);
                result = rootResult + contentResult + '\n';
            }
            else {
                result = rootResult + contentResult + '\n';
            }
        }
        result = result.trim() + '\n';
        return result;
    };

    p.Block = function(block) {
        console.log("this._parseMode", this._parseMode);
        var result = "";
        var syntaxObj, syntax, textParams;

        syntaxObj = this.searchSyntax(block);
        console.log("syntaxObj", syntaxObj);
        if(syntaxObj)
            syntax = syntaxObj.syntax;
            if(syntaxObj.textParams)
                textParams = syntaxObj.textParams;

        // User Function
        if(this.isFunc(block)) {
            this._funcDefMap[block.data.type] = this.makeFuncDef(block);
            if(this.isRegisteredFunc(block))
                syntax = this.makeFuncSyntax(block);
                if(this._parseMode == Entry.Parser.PARSE_SYNTAX)
                    return syntax;
        } else if(this.isFuncStmtParam(block)) {
            result += block.data.type;
        }

        if(!syntax || syntax == null)
            return result;


        var blockReg = /(%.)/mi;
        var statementReg = /(\$.)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;
        var currentBlock = block;
        var currentBlockSkeleton = currentBlock._schema.skeleton;
        var currentBlockParamsKeyMap = currentBlock._schema.paramsKeyMap;
        var blockParam = "";

        for (var i = 0; i < blockTokens.length; i++) {
            var blockToken = blockTokens[i];
            if (blockToken.length === 0) continue;
            if (blockToken == '% ') { result += blockToken; continue; }
            if (blockReg.test(blockToken)) {
                var blockParamIndex = blockToken.split('%')[1];
                var index = Number(blockParamIndex) - 1;
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Indicator") {
                        index++;
                    } else if(schemaParams[index].type == "Block") {
                        var param = this.Block(dataParams[index]).trim();
                        if(syntaxObj.textParams && syntaxObj.textParams[index])
                            var textParam = syntaxObj.textParams[index];
                        if(textParam && textParam.paramType == "index") { 
                            if(!isNaN(param)) param = String(parseInt(param) - 1);
                            else {
                                var tokens = param.split('+');
                                console.log("index tokens", tokens);
                                if(tokens[tokens.length-1] == ' 1)') {
                                    delete tokens[tokens.length-1];
                                    param = tokens.join("+");
                                    param = param.substring(1, param.length-2); 
                                }
                                else param += " - 1";
                            }
                        }

                        var funcParam = this._funcMap.get(param);
                        if(funcParam) {
                            result += funcParam;
                            continue;
                        } else {
                            var funcParamTokens = param.split('_');
                            var prefix = funcParamTokens[0];
                            if(funcParamTokens.length == 2) {
                                if(prefix == "stringParam"){
                                    param = "string_param";
                                } else if(prefix == "booleanParam") {
                                    param = "boolean_param";
                                }
                            }
                        }

                        result += param;
                    } else {
                        if(syntaxObj.textParams)
                            var textParams = syntaxObj.textParams
                        else var textParams = [];

                        param = this['Field' + schemaParams[index].type](dataParams[index], textParams[index]);


                        if(Entry.TextCodingUtil.isLocalType(currentBlock, block.params[index]))
                            param = "self".concat('.').concat(param);

                        result += param;
                        result = Entry.TextCodingUtil.assembleRepeatWhileTrueBlock(currentBlock, result);
                    }
                }
            } else if (statementReg.test(blockToken)) {
                var statements = blockToken.split(statementReg);
                for (var j=0; j<statements.length; j++) {
                    var statementToken = statements[j];
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        var index = Number(statementToken.split('$')[1]) - 1;
                        result += Entry.TextCodingUtil.indent(this.Thread(block.statements[index]));
                    }
                    else result += statementToken; 
                }
            } else {
                console.log("blockTokenss", blockToken, "syntaxObj", syntaxObj, "i", i);
                if(syntaxObj && syntaxObj.key == "repeat_basic" && i == 0) {
                    if(syntaxObj.idChar) {
                        var forStmtTokens = blockToken.split(" ");
                        console.log("forStmtTokens", forStmtTokens);
                        forStmtTokens[1] = syntaxObj.idChar[this._forIdCharIndex++];
                        var forStmtText = forStmtTokens.join(" ");
                        console.log("forStmtText", forStmtText);
                        blockToken = forStmtText;
                    }
                }
                result += blockToken; 
            }
        }
        return result;
    };

    p.searchSyntax = function(datum) { 
        var schema; 
        var appliedParams;
        if(datum instanceof Entry.BlockView) {
            schema = datum.block._schema;
            applliedParams = datum.block.data.params;
        } else if (datum instanceof Entry.Block) {
            schema = datum._schema;
            applliedParams = datum.params;
        }
        else schema = datum;

        if(schema && schema.syntax) {
            var syntaxes = schema.syntax.py.concat();
            while (syntaxes.length) {
                var isFail = false;
                var syntax = syntaxes.shift();
                if (typeof syntax === "string")
                    return {syntax: syntax, template: syntax};
                if (syntax.params) {
                    for (var i = 0; i < syntax.params.length; i++) {
                        if (syntax.params[i] && syntax.params[i] !== applliedParams[i]) {
                            isFail = true;
                            break;
                        }
                    }
                }
                if(!syntax.template)
                    syntax.template = syntax.syntax;
                if (isFail) {
                    continue;
                }
                return syntax;
            }
        }
        return null;
    };

    p.FieldAngle = function(dataParam, textParam) {
        console.log("FieldAngle", dataParam, textParam);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(dataParam);

        return dataParam;
    };

    p.FieldColor = function(dataParam, textParam) {
        console.log("FieldColor", dataParam, textParam);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);
        return dataParam;
    };

    p.FieldDropdown = function(dataParam, textParam) {
        console.log("FieldDropdown", dataParam, textParam);
        var key, value;

        if(textParam && textParam.converter && textParam.options) { 
            for(var i in textParam.options) {
                var option = textParam.options[i];
                console.log("option", option);
                var op0 = option[0];
                var op1 = option[1];
                console.log("dataparam", dataParam);

                if(dataParam == op1) { 
                    key = op0;
                    value = op1;
                    if(textParam.codeMap) {
                        var codeMap = eval(textParam.codeMap);
                        var code = codeMap[value];
                        if(code)
                            value = code;  
                    }
                    console.log("dropdown key, value", key, value);
                    if(isNaN(key) && isNaN(value)) {
                        if(textParam.caseType == "no") {
                            key = key;
                            value = value;
                        }
                        else if(textParam.caseType == "upper") {
                            key = key.toUpperCase();
                            value = value.toUpperCase();
                        }
                        else {
                            key = key.toLowerCase();
                            value = value.toLowerCase();
                        }
                    }

                    dataParam = textParam.converter(key, value);
                    if(textParam.paramType == "variable") {
                        dataParam = dataParam.replace(/\"/g, "");
                    }
                    break;
                }
            }
        }

        return dataParam;
    };

    p.FieldDropdownDynamic = function(dataParam, textParam) {
        console.log("FieldDropdown", dataParam, textParam); 
        var options;
        var returnValue = dataParam;
        if(textParam && textParam.converter && textParam.options) {
            options = textParam.options;
            for(var i in options) {
                var option = options[i];
                console.log("option", option);
                var op0 = option[0];
                var op1 = option[1];
                if(dataParam === op1) { 
                    key = op0;
                    value = op1; 
                    dataParam = textParam.converter(key, value);
                    
                    console.log("dataParam convert result", dataParam);
                    if(textParam.codeMap) { 
                        dataParam = dataParam.replace(/\"/g, "");
                        var codeMap = eval(textParam.codeMap); 
                        var code = codeMap[dataParam];
                        console.log("codeMap", codeMap, "code", code, "dataParam", dataParam);
                        if(code) 
                            dataParam = code; 
                        dataParam = '"()"'.replace('()', dataParam);
                    } 



                    if(isNaN(dataParam)) {
                        if(textParam.caseType == "no") {
                            dataParam = dataParam;
                        }
                        else if(textParam.caseType == "upper") {
                            dataParam = dataParam.toUpperCase();
                        }
                        else {
                            dataParam = dataParam.toLowerCase();
                        }
                    }

                    if(textParam.paramType == "variable") {
                        dataParam = dataParam.replace(/\"/g, "");
                    }

                    break;
                }
            }
        }

        return dataParam;
    };

    p.FieldImage = function(dataParam, textParam) {
        console.log("FieldImage", dataParam, textParam);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    };

    p.FieldIndicator = function(dataParam, textParam) {
        console.log("FieldIndicator", dataParam, textParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam, textParam) {
        console.log("FieldKeyboardInput", dataParam, textParam);
        var map = Entry.KeyboardCode.map;
        for(var key in map) {
            var value = map[key];
            if(value == dataParam) {
                dataParam = key;
                break;
            }
        }

        if(textParam && textParam.converter)
            dataParam = textParam.converter(dataParam, null);

        dataParam = dataParam.toLowerCase();
        return dataParam;
    };

    p.FieldOutput = function(dataParam, textParam) {
        console.log("FieldOutput", dataParam, textParam);

        return dataParam;
    };

    p.FieldText = function(dataParam, textParam) {
        console.log("FieldText", dataParam, textParam);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    };

    p.FieldTextInput = function(dataParam, textParam) {
        console.log("FieldTextInput", dataParam, textParam);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    };

    p.FieldNumber = function(dataParam, textParam) {
        console.log("FieldNumber", dataParam, textParam);

        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    };

    p.isFunc = function(block) {
        var tokens = block.data.type.split('_');
        var prefix = tokens[0];
        var funcId = tokens[1];

        if(prefix == "func")
            return true;
        else
            return false;
    };

    p.isRegisteredFunc = function(block) {
        var tokens = block.data.type.split('_');
        var prefix = tokens[0];
        var funcId = tokens[1];
        var funcBlock = Entry.variableContainer.functions_[funcId];

        if(funcBlock)
            return true;
        else
            return false;
    };

    p.isFuncStmtParam = function(block) {
        var blockType = block.data.type;
        var tokens = blockType.split('_');
        var prefix = tokens[0];

        if(prefix == "stringParam" || prefix == "booleanParam")
            return true;
        else
            return false;
    };

    p.makeFuncSyntax = function(funcBlock) {
        var syntax = "";
        var schemaTemplate = funcBlock._schema.template.trim();
        var schemaParams = funcBlock._schema.params;
        var paramReg = /(%.)/mi;
        var funcTokens = schemaTemplate.trim().split(paramReg);
        var funcName = "";
        var funcParams = "";

        for(var f in funcTokens) {
            var funcToken = funcTokens[f].trim();
            if(paramReg.test(funcToken)) {
                var num = funcToken.split('%')[1];
                var index = Number(num) - 1;
                if(schemaParams[index].type == "Indicator")
                    continue;
                funcParams += funcToken.concat(', ');
            }
            else {
                var funcTokenArr = funcToken.split(' ');
                funcName += funcTokenArr.join('__');
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

        if(!this.isRegisteredFunc(funcBlock))
            func.name = "F";

        if(!func.name) {
            return result;
        }
        else {
            result += func.name;
        }

        result = result.concat('(');
        if(func.params && func.params.length != 0) {
            for(var p in func.params) {
                result += func.params[p]
                result = result.concat(', ');
            }
            var index = result.lastIndexOf(',');
            result = result.substring(0, index);
            result = result.trim();
        }
        result = result.concat('):').concat('\n');

        if(func.statements && func.statements.length) {
            var stmtResult = "";
            for(var s in func.statements) {
                var block = func.statements[s];
                stmtResult += this.Block(block).concat('\n');
            }
            stmtResult = stmtResult.concat('\n');
            result += Entry.TextCodingUtil.indent(stmtResult).concat('\n');
        }
        this._funcMap.clear();

        return result.trim();
    };

    p.getFuncInfo = function(funcBlock) {
        var result = {};
        var tokens = funcBlock.data.type.split('_');
        var prefix = tokens[0];
        var id = tokens[1];

        if(id) {
            var _functions = Entry.variableContainer.functions_;
            var func = _functions[id];
            if(!func) {
                result.name = "함수";
                return result;
            }
        } else {
            return result;
        }

        var template = func.block.template;
        var index = template.search(/(%.)/);
        var funcNameTemplate = template.substring(0, index).trim();
        var funcNameArr = funcNameTemplate.split(' ');

        //func name join
        var funcName = funcNameArr.join('__');
        Entry.TextCodingUtil.initQueue();
        Entry.TextCodingUtil.gatherFuncDefParam(func.content._data[0]._data[0].data.params[0]);
        var funcParams = [];

        var paramMap = {}; 
        while(param = Entry.TextCodingUtil._funcParamQ.dequeue()) {
            funcParams.push(param);
        }

        for(var p in funcParams) {
            var funcParam = funcParams[p];
            paramMap[funcParam] = p;
        }

        Entry.TextCodingUtil.clearQueue();
        var funcParamMap = paramMap;

        if(funcParamMap) {
            var funcParams = {};
            for(var key in funcParamMap) {
                var index = funcParamMap[key];
                console.log("paramName index", Number(parseInt(index)+1));
                var i = key.search('_');
                var nickname = key.substring(0, i);

                if(nickname == 'stringParam')
                    var name = 'param' + Number(parseInt(index)+1);
                else if (nickname == 'booleanParam')
                    var name = 'param' + Number(parseInt(index)+1);

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

        if(funcName)
            result.name = funcName;
        if(Object.keys(funcParams).length != 0)
            result.params = funcParams;
        if(funcContents.length != 0)
            result.statements = funcContents;

        return result;
    };


})(Entry.BlockToPyParser.prototype);
