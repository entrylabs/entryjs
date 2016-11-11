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
    var variableMap = new Entry.Map();
    this._variableMap = variableMap;

    var funcMap = new Entry.Map();
    this._funcMap = funcMap;

    var queue = new Entry.Queue();
    this._queue = queue;

    var funcDefMap = {};
    this._funcDefMap = {};
};

(function(p){
    p.Code = function(code, parseMode) {
        this._parseMode = parseMode;
        //console.log("parseMode", this._parseMode);

        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

            //console.log("threads", threads);

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            textCode += this.Thread(thread) + '\n';
        }

        textCode = textCode.trim();

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var result = "",
            blocks = thread.getBlocks();

            //console.log("blocks", blocks);

        var isEventBlock = false;
        var rootBlock;
        var rootResult = '';
        var contentResult = '';
        var definition = '';
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            console.log("blockToPy block", block, "this._parseMode", this._parseMode);
            if(this._parseMode == Entry.Parser.PARSE_GENERAL) {
                if(Entry.TextCodingUtil.isNoPrintBlock(block))
                    continue;
                if(i == 0) {
                    rootBlock = block;
                    isEventBlock = Entry.TextCodingUtil.isEventBlock(block);

                    if(isEventBlock) {
                        rootResult = this.Block(block) + '\n';
                        console.log("eventParamCheck first", block);
                        /*if(Entry.TextCodingUtil.isEntryEventBlockWithParam(block)) {
                            rootResult += "\t";
                        }*/
                        //definition = Entry.TextCodingUtil.prototype.makeDefinition(block) + '\n';
                    }
                    else {
                        contentResult += this.Block(block) + '\n';
                    }
                }
                else if(i != 0) {
                    var content = this.Block(block) + '\n';
                    /*if(Entry.TextCodingUtil.isEntryEventBlockWithParam(rootBlock)) {
                        console.log("contentResult1", content);
                        content = "\t" + content;
                        console.log("contentResult2", content);
                    }*/
                    contentResult += content;


                }
            } else if(this._parseMode == Entry.Parser.PARSE_SYNTAX) {
                isEventBlock = Entry.TextCodingUtil.isEventBlock(block);
                if(isEventBlock) {
                    //definition = Entry.TextCodingUtil.prototype.makeDefinition(block) + '\n';
                    result = definition;
                } else {
                    result = this.Block(block) + '\n';
                }

                console.log("syntax mode result", result);
            }

            this._queue.clear();
            this._variableMap.clear();
        }

        if(this._parseMode == Entry.Parser.PARSE_GENERAL) {
            if(isEventBlock) {
                contentResult = Entry.TextCodingUtil.indent(contentResult);
                /*if(Entry.TextCodingUtil.isEntryEventBlockWithParam(rootBlock)) {
                    contentResult = "\t" + contentResult;
                }*/

                result = rootResult + contentResult + '\n';

                // Declaration
                /*var declaration = rootResult.split('def')[1];
                declaration = declaration.substring(0, declaration.length-1);
                result = result.trim() + '\n\n' + declaration.trim() + '\n';*/

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
        /*if(!block._schema)
            return "";*/
        var result = "";
        var syntaxObj, syntax;

        syntaxObj = this.searchSyntax(block);
        if (syntaxObj)
            syntax = syntaxObj.syntax;

        // User Function
        if(this.isFunc(block)) {
            console.log("Block isFunc", block);
            console.log("Block makeFuncDef", this.makeFuncDef(block));
            this._funcDefMap[block.data.type] = this.makeFuncDef(block);
            //result += this.makeFuncDef(block);

            console.log("result0", result);

            if(this.isRegisteredFunc(block)) {
                syntax = this.makeFuncSyntax(block);
                console.log("Func Fianl Syntax", syntax);
                if(this._parseMode == Entry.Parser.PARSE_SYNTAX) {
                    return syntax;
                }
            }
        } else if(this.isFuncStmtParam(block)) {
            result += block.data.type;
        } /*else if(this.isFuncDefUnit(block)) {

        }*/

        //console.log("Block Syntax", syntax);

        if(!syntax || syntax == null)
            return result;

        console.log("result1", result);

        var blockReg = /(%.)/mi;
        var statementReg = /(\$.)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        //console.log("Block blockTokens", blockTokens);

        var currentBlock = block;
        var currentBlockSkeleton = currentBlock._schema.skeleton;
        var currentBlockParamsKeyMap = currentBlock._schema.paramsKeyMap;


        //console.log("currentBlock", currentBlock, "currentBlockSkeleton", currentBlockSkeleton,
            //"currentBlockParamsKeyMap", currentBlockParamsKeyMap);

        var blockParam = "";
        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PASRSE_VARIABLE Mode
            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                    blockParam = "";
                    var blockParamIndex = 0;
                }
            }
        }

        //console.log("Block schemaParams", schemaParams);
        //console.log("Block dataParams", dataParams);

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
                        //console.log("Block dataParams[index]", dataParams[index]);

                        //console.log("Block param current block1", currentBlock);
                        var param = this.Block(dataParams[index]).trim();

                        //console.log("funcMap", this._funcMap.toString());
                        var funcParam = this._funcMap.get(param);

                        console.log("param", param, "func param", funcParam);
                        if(funcParam) {
                            //console.log("func param current result", result);
                            result += funcParam;
                            continue;
                        } else {
                            var funcParamTokens = param.split('_');
                            //console.log("funcParamTokens", funcParamTokens);
                            var prefix = funcParamTokens[0];
                            if(funcParamTokens.length == 2) {
                                if(prefix == "stringParam"){
                                    param = "string_param";
                                } else if(prefix == "booleanParam") {
                                    param = "boolean_param";
                                }
                            }
                        }

                        console.log("Block param current block2", currentBlock);

                        param = Entry.TextCodingUtil.variableListFilter(block, blockParamIndex, param);

                        console.log("currentBlock", currentBlock);
                        syntaxObj = this.searchSyntax(currentBlock);
                        console.log("syntaxObj", syntaxObj);
                        if (syntaxObj) {
                            console.log("syntaxObj", syntaxObj, "i", i, "index", index);
                            if(syntaxObj.paramCodes) {
                                var paramCodes = syntaxObj.paramCodes;
                                var paramCode = paramCodes[index];
                                if(paramCode) {
                                    var pCode = paramCode[param];
                                    if(pCode)
                                        param = pCode[0];
                                }
                            }
                        }

                        result += param;

                        console.log("block param", param);

                        //console.log("PARAM BLOCK", param);
                        //console.log("PARAM BLOCK RESULT ", result);

                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
                            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                                    blockParam = param;
                                    //console.log("basic block param", param, "i", i);

                                    var paramsKey = Object.keys(currentBlockParamsKeyMap);
                                    var variable = String(paramsKey[blockParamIndex++]);
                                    variable = variable.toLowerCase();
                                    //console.log("variable", variable);

                                    var value = blockParam;
                                    //console.log("value", value);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable);
                                    //console.log("Variable Map", this._variableMap.toString());
                                    //console.log("Queue", this._queue.toString());
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

                        param = Entry.TextCodingUtil.binaryOperatorValueConvertor(param);
                        param = String(param);

                        if(!Entry.TextCodingUtil.isNumeric(param) &&
                            !Entry.TextCodingUtil.isBinaryOperator(param)) {
                                param = String("\"" + param + "\"");
                        }

                        console.log("result and param text", result, param);

                        if(param == String('\"None\"')) {
                            var data = {None:"None"};
                            var x = "None";
                            param = data[x];
                        }

                        param = Entry.TextCodingUtil.variableListFilter(block, blockParamIndex, param);

                        console.log("here pa param", param);
                        //Local Type Processing
                        if(Entry.TextCodingUtil.isLocalType(currentBlock, dataParams[index]))
                            param = "self".concat('.').concat(param);

                        //console.log("param variableFilter", param);

                        console.log("currentBlock", currentBlock);
                        syntaxObj = this.searchSyntax(currentBlock);
                        if (syntaxObj) {
                            console.log("syntaxObj", syntaxObj, "i", i, "index", index);
                            if(syntaxObj.paramCodes) {
                                var paramCodes = syntaxObj.paramCodes;
                                var paramCode = paramCodes[index];
                                if(paramCode) {
                                    var pCode = paramCode[param];
                                    if(pCode)
                                        param = pCode[0];
                                }
                            }
                        }

                        result += param;
                        console.log("btop parser param result", result);

                        result = Entry.TextCodingUtil.assembleRepeatWhileTrueBlock(currentBlock, result);

                        //console.log("PARAM BLOCK", param);
                        //console.log("PARAM BLOCK RESULT ", result);

                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
                            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                                    blockParam = param;
                                    //console.log("basic block param", param, "i", i);

                                    var param = "";
                                    var paramsKey = Object.keys(currentBlockParamsKeyMap);
                                    var variable = String(paramsKey[blockParamIndex++]);
                                    variable = variable.toLowerCase();
                                    //console.log("variable", variable);

                                    var value = blockParam;
                                    //console.log("value", value);

                                    this._variableMap.put(variable, value);
                                    this._queue.enqueue(variable);
                                    //console.log("Variable Map", this._variableMap);
                                    //console.log("Queue", this._queue);
                                }
                            }
                        }

                    }
                } else {
                    //console.log("This Block has No Schema");
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
                    else {
                        result += statementToken;

                        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
                            if(this._currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_LOOP ||
                            this._currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC_DOUBLE_LOOP) { //If Block Sekeleton is basic
                                if(this._currentBlockParamsKeyMap) {  //If Block has Parameters
                                    if(j == 0) { //The beginning of Block Statement
                                        //console.log("This result is the beginning of Block Statement");
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                var tagIndex = 0;
                console.log("block Token shit", blockToken);

                if(blockToken.search('#') != -1) {
                    var tagIndex = blockToken.indexOf('#');
                    blockToken = blockToken.substring(tagIndex+1);
                }

                result += blockToken;

                console.log("btop parser block result", result);

                //console.log("check result", result);

            }
        }

        if(this._parseMode == Entry.Parser.PARSE_VARIABLE) { //In PARSE_VARIABLE Mode
            //console.log("check1");
            if(currentBlockSkeleton == Entry.Parser.BLOCK_SKELETON_BASIC) { //If Block Sekeleton is basic
                //console.log("check2");
                if(currentBlockParamsKeyMap) {  //If Block has Parameters
                    //console.log("check3");
                    var paramsCount = Object.keys(currentBlockParamsKeyMap).length;
                    if(paramsCount)
                        result = this.makeExpressionWithVariable(result, paramsCount);
                }
            }
        }

        console.log("block result check", result);

        if(Entry.TextCodingUtil.isMathExpression(result)) {
            result = Entry.TextCodingUtil.makeMathExpression(result);
        }

        return result;
    };

    p.searchSyntax = function(datum) {
        var schema;
        if(datum instanceof Entry.BlockView) {
            schema = datum.block._schema;
        } else if (datum instanceof Entry.Block)
            schema = datum._schema;
        else schema = datum;

        if(schema && schema.syntax) {
            var syntaxes = schema.syntax.py.concat();
            while (syntaxes.length) {
                var isFail = false;
                var syntax = syntaxes.shift();
                if (typeof syntax === "string")
                    return {syntax: syntax};
                if (syntax.params) {
                    var params = block.params;
                    for (var i = 0; i < syntax.params.length; i++) {
                        if (syntax.params[i] && syntax.params[i] !== block.params[i]) {
                            isFail = true;
                            break;
                        }
                    }
                }
                if (isFail) {
                    continue;
                }
                return syntax;
            }
        }
        return null;
    };

    p.FieldAngle = function(dataParam) {
        //console.log("FieldAngle", dataParam);

        return dataParam;
    };

    p.FieldColor = function(dataParam) {
        //console.log("FieldColor", dataParam);

        return dataParam;
    };

    p.FieldDropdown = function(dataParam) {
        console.log("FieldDropdown", dataParam, typeof dataParam);

        if(typeof dataParam == "object")
            return "None";

        return dataParam;
    };

    p.FieldDropdownDynamic = function(dataParam, schemaParam) {
        console.log("FieldDropdownDynamic", dataParam, schemaParam);
        var object = Entry.playground.object;
        console.log("FieldDropdownDynamic Object", object);

        if(dataParam == "None") {
            dataParam = "None";
        }
        else if(dataParam == "null") {
            dataParam = "None";
        }
        else {
            dataParam = Entry.TextCodingUtil.dropdownDynamicValueConvertor(dataParam, schemaParam);
        }

        console.log("FieldDropdownDynamic result ", dataParam);
        return dataParam;
    };

    p.FieldImage = function(dataParam) {
        //console.log("FieldImage", dataParam);

        return dataParam;
    };

    p.FieldIndicator = function(dataParam) {
        //console.log("FieldIndicator", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        //console.log("FieldKeyboardInput", dataParam);

        return dataParam;
    };

    p.FieldOutput = function(dataParam) {
        //console.log("FieldOutput", dataParam);

        return dataParam;
    };

    p.FieldText = function(dataParam) {
        //console.log("FieldText", dataParam);

        return dataParam;
    };

    p.FieldTextInput = function(dataParam) {
        //console.log("FieldTextInput", dataParam);

        return dataParam;
    };

    p.FieldNumber = function(dataParam) {
        //console.log("FieldNumber", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        //console.log("FieldKeyboard Before", dataParam);

        dataParam = Entry.KeyboardCode.keyCodeToChar[dataParam];

        if(!dataParam || dataParam == null)
            dataParam = "Q";

        //console.log("FieldKeyboard After", dataParam);

        return dataParam;
    };

    p.makeExpressionWithVariable = function(blockExp, paramCount) {
        //console.log("makeExpressionWithVariable blockExp", blockExp);
        //console.log("makeExpressionWithVariable Queue", this._queue.toString());
        //console.log("makeExpressionWithVariable VariableMap", this._variableMap.toString());

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
                //console.log("makeExpressionWithVariable variable", variable);

                var value = this._variableMap.get(variable);
                //console.log("makeExpressionWithVariable value", value);

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

        //console.log("makeExpressionWithVariable result", result);

        return result;
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
        //console.log("isFuncStmtParam prefix", prefix);
        if(prefix == "stringParam" || prefix == "booleanParam")
            return true;
        else
            return false;
    };

    p.makeFuncSyntax = function(funcBlock) {
        var syntax = "";
        var schemaTemplate = funcBlock._schema.template.trim();
        //console.log("Func schemaTemplate", schemaTemplate);
        var schemaParams = funcBlock._schema.params;
        //console.log("Func schemaParams", schemaParams);

        var paramReg = /(%.)/mi;

        var funcTokens = schemaTemplate.trim().split(paramReg);
        //console.log("funcTokens", funcTokens);

        var funcName = "";
        var funcParams = "";

        for(var f in funcTokens) {
            var funcToken = funcTokens[f].trim();
            //console.log("funcToken", funcToken);
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

        //console.log("makeFuncDef func", func);

        if(!this.isRegisteredFunc(funcBlock))
            func.name = "f";


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

        //console.log("curious func statements", func.statements);

        if(func.statements && func.statements.length) {
            var stmtResult = "";
            for(var s in func.statements) {
                var block = func.statements[s];
                //console.log("makeFuncDef statements", block);
                stmtResult += this.Block(block).concat('\n');

            }
            stmtResult = stmtResult.concat('\n');
            result += Entry.TextCodingUtil.indent(stmtResult).concat('\n');
        }

        //console.log("makeFuncDef result", result);

        this._funcMap.clear();

        return result;
    };

    p.getFuncInfo = function(funcBlock) {
        //console.log("getFuncInfo funcBlock", funcBlock);
        var result = {};

        var tokens = funcBlock.data.type.split('_');
        var prefix = tokens[0];
        var id = tokens[1];

        //console.log("getFuncInfo id", id);
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

        //console.log("getFuncInfo func", func);

        var template = func.block.template;
        var index = template.search(/(%.)/);
        //console.log("getFuncInfo index", index);
        var funcNameTemplate = template.substring(0, index).trim();
        var funcNameArr = funcNameTemplate.split(' ');

        //func name join
        var funcName = funcNameArr.join('__');
        //console.log("getFuncInfo funcName", funcName);

        Entry.TextCodingUtil.initQueue();
        Entry.TextCodingUtil.gatherFuncDefParam(func.content._data[0]._data[0].data.params[0]);
        //console.log("Entry.TextCodingUtil._funcParamQ", Entry.TextCodingUtil.prototype._funcParamQ);
        var funcParams = [];

        var paramMap = {};
        while(param = Entry.TextCodingUtil._funcParamQ.dequeue()) {
            funcParams.push(param);
            //console.log("param", param);
        }
        //console.log("funcParams", funcParams);
        for(var p in funcParams) {
            var funcParam = funcParams[p];
            paramMap[funcParam] = p;
        }
        Entry.TextCodingUtil.clearQueue();
        //console.log("paramMap", paramMap);


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

        //console.log("getFuncInfo funcContents", funcContents);

        if(funcName)
            result.name = funcName;
        if(Object.keys(funcParams).length != 0)
            result.params = funcParams;
        if(funcContents.length != 0)
            result.statements = funcContents;

        return result;
    };


})(Entry.BlockToPyParser.prototype);
