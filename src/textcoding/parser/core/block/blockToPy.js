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

    var funcParamMap = new Entry.Map();
    this._funcParamMap = funcParamMap;

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

    p.Block = function(block, template) {
        console.log("this._parseMode", this._parseMode);
        console.log("block unit", block);
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
            console.log("func block", block);
            console.log("this._hasRootFunc", this._hasRootFunc);
            if(!this._hasRootFunc) {
                this._rootFuncId = block.data.type;
                this._funcDefMap[block.data.type] = this.makeFuncDef(block, this._hasRootFunc);
                this._hasRootFunc = false;
            }
            if(this.isRegisteredFunc(block))
                syntax = this.makeFuncSyntax(block);
                if(this._parseMode == Entry.Parser.PARSE_SYNTAX)
                    return syntax;
        } else if(this.isFuncStmtParam(block)) {
            result += block.data.type;
        } 

        console.log("block syntax", syntax);  
        /*if(block && block.data) {
            var btype = block.data.type;
            var prefix = btype.split('_')[0]
            if(prefix == "stringParam" || prefix == "booleanParam")
                return result;
        }
        if(template) syntax = template;
        if(this._parseMode == Entry.Parser.PARSE_GENERAL) {
            if(!syntax || syntax == null || syntax == "def when_start():") {
                var error = {};
                var message = Lang.TextCoding[Entry.TextCodingError.ALERT_LEGACY_NO_SUPPORT];
                var block_name = this.Block(block, Lang.template[block.data.type]);
                var alert_message = message + '\n' + Lang.TextCoding[block_name] + ':' + block_name;                

                alert(alert_message);
            } 
        }*/

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

                        var funcParam = this._funcParamMap.get(param);

                        if(funcParam) {
                            param = funcParam;
                            //continue;
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

                        if(textParam && textParam.paramType == "index") { 
                            if(!isNaN(param)) 
                                param = param - 1;
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
                        console.log("middle result", result, "textParam", textParam);

                        if(textParam && textParam.paramType == "integer") { 
                            if(!isNaN(param) && param % 1 !== 0)
                                result = result.replace("randint", "uniform");
                        }
                        console.log("btop param", param);
                        console.log("btop this._funcParamMap", this._funcParamMap);
                        
                        result += param;
                    } else {
                        if(syntaxObj.textParams)
                            var textParams = syntaxObj.textParams
                        else var textParams = [];

                        param = this['Field' + schemaParams[index].type](dataParams[index], textParams[index]);

                        result += param;
                        if(syntaxObj && syntaxObj.key == "repeat_while_true")
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
                console.log("blockTokenss", blockToken, "syntaxObj", syntaxObj, "i", i, blockToken.length);
                if(syntaxObj && syntaxObj.key == "repeat_basic" && i == 0) {
                    var forStmtTokens = blockToken.split(" ");
                    forStmtTokens[1] = Entry.TextCodingUtil.generateForStmtIndex(this._forIdCharIndex++);
                    var forStmtText = forStmtTokens.join(" ");
                    blockToken = forStmtText; 
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
        if(typeof dataParam == "object")
             return "None".replace(/\"/gm, '');
            
        if(textParam && textParam.converter && textParam.options) {
            var options = textParam.options;
            for(var i in options) {
                var key = options[i][0];
                var value = options[i][1];
                if(dataParam == value) { 
                    return dataParam = textParam.converter(key, value);
                }   
            }
            dataParam = textParam.converter(dataParam, dataParam);
        } 

        return dataParam;
    };

    p.FieldDropdownDynamic = function(dataParam, textParam) { 
        console.log("FieldDropdownDynamic", dataParam, textParam); 
        if(typeof dataParam == "object")
             return "None".replace(/\"/gm, ''); 

        if(textParam && textParam.converter && textParam.options) { 
            var options = textParam.options;
            for(var i in options) {
                var key = options[i][0];
                var value = options[i][1];
                if(dataParam == value) { 
                    var name = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(value, textParam.menuName);
                    if(name) key = name;
                    return dataParam = textParam.converter(key, value);
                }   
            }
            var value = Entry.TextCodingUtil.dropdownDynamicIdToNameConvertor(dataParam, textParam.menuName);
            if(value) dataParam = textParam.converter(value, value);
            else dataParam = textParam.converter(dataParam, dataParam);

            var reg = /None/;
            if(reg.test(dataParam)) {
                dataParam = dataParam.replace(/\"/gm, '');
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
        var reg = /None/;
        if(reg.test(dataParam)) {
            return dataParam.replace(/\"/gm, '');
        }

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
        console.log("FiedlText Length", dataParam.length);
        if(textParam && textParam.converter)
            dataParam = textParam.converter(null, dataParam);

        return dataParam;
    };

    p.FieldTextInput = function(dataParam, textParam) {
        console.log("dataParam FieldTextInput", dataParam);
        if(typeof dataParam != "number") {
            dataParam = dataParam.replace('\t', '    ');
            var spaces = dataParam.split(/ /);  
           
            if(dataParam.length == spaces.length-1)
                dataParam = '"()"'.replace('()', dataParam);
        }

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
        if(!block || !block.data || !block.data.type) 
            return false;
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
        if(!block || !block.data || !block.data.type) 
            return false;
        var blockType = block.data.type;
        var tokens = blockType.split('_');
        var prefix = tokens[0];

        if(prefix == "stringParam" || prefix == "booleanParam")
            return true;
        else
            return false;
    };

    p.makeFuncSyntax = function(funcBlock) {
        console.log("ggg funcBlock", funcBlock);
        var syntax = "";
        if(funcBlock && funcBlock._schema)
            if(funcBlock._schema.template)
                var schemaTemplate = funcBlock._schema.template.trim();
            else if(funcBlock._schema.params)
                var schemaParams = funcBlock._schema.params;
        else if(funcBlock && !funcBlock._schema) {
            if(this._hasRootFunc) {
                var rootFunc = Entry.block[this._rootFuncId];
                var schemaParams = rootFunc.block.params;
                var schemaTemplate = rootFunc.block.template;
            }
        }
        
        var paramReg = /(%.)/mi;
        if(schemaTemplate)
            var funcTokens = schemaTemplate.trim().split(paramReg);
        
        var funcName = "";
        var funcParams = "";
        console.log("funcTokens", funcTokens);

        for(var f in funcTokens) {
            var funcToken = funcTokens[f].trim();
            if(paramReg.test(funcToken)) {
                var num = funcToken.split('%')[1];
                if(num == 1) continue;
                else num -= 1;
                var index = num - 1;
                if(schemaParams && schemaParams[index] && 
                    schemaParams[index].type == "Indicator")
                    continue;
                
                funcParams += '%'.concat(num).concat(', ');
            }
            else {
                var funcTokenArr = funcToken.split(' ');
                funcName += funcTokenArr.join('__'); 
            }
        }

        var index = funcParams.lastIndexOf(',');
        console.log("funcParams", funcParams, "index", index);
        funcParams = funcParams.substring(0, index);
        console.log("funcParams2", funcParams, "index2", index);

        syntax = funcName.trim().concat('(').concat(funcParams.trim()).concat(')');

        return syntax;
    };

    p.makeFuncDef = function(funcBlock, exp) {
        if(!this.isRegisteredFunc(funcBlock))
            return;
        var result = '';
        var func = this.getFuncInfo(funcBlock);
        console.log("makeFuncDef func", func);
        if(func) result += func.name;
        else return;

        var paramResult = '';
        if(func.params && func.params.length != 0) {
            for(var p in func.params) {
                //var param = func.params[p];
                /*if(param instanceof Entry.Block) 
                    paramResult += this.Block(param);
                else*/
                    paramResult += func.params[p];
                console.log("p", p, "func.params", func.params, "func.params.length", func.params.length);
                if(p != func.params.length-1)
                    paramResult = paramResult.concat(', ');
            }
            console.log("middle paramResult", paramResult); 
            paramResult = paramResult.trim();
        }
        result = result.concat('(').concat(paramResult).concat(')');
        console.log("func middle check", result);
        if(exp) return result;
        else result =  'def ' + result;

        this._hasRootFunc = true;

        result = result.concat(':\n');
        if(func.statements && func.statements.length) {
            var stmtResult = "";
            for(var s in func.statements) {
                var block = func.statements[s];
                console.log("func check block", block);
                console.log("this.getFuncInfo(block)", this.getFuncInfo(block), "func", func);

                if(this.getFuncInfo(block)){
                    console.log("func check name same");
                    stmtResult += this.makeFuncDef(block, true).concat('\n');
                }
                else{
                    console.log("func check name diff");
                    stmtResult += this.Block(block).concat('\n');
                }
            }
            //stmtResult = stmtResult.concat('\n');
            result += Entry.TextCodingUtil.indent(stmtResult).concat('\n');
        }
        console.log("func this._funcParamMap", this._funcParamMap);
        //this._funcParamMap.clear();
        console.log("func result", result);

        return result.trim();
    };

    p.getFuncInfo = function(funcBlock) {
        console.log("getFuncInfo funcBlock", funcBlock);
        var result = {};
        var tokens = funcBlock.data.type.split('_');
        var prefix = tokens[0];
        var id = tokens[1];

        if(id) {
            var _functions = Entry.variableContainer.functions_;
            var func = _functions[id];
            if(!func) {
                return null;
            }
        } else {
            return null;
        }

        var template = func.block.template;
        var index = template.search(/(%.)/);
        var funcNameTemplate = template.substring(0, index).trim();
        var funcNameArr = funcNameTemplate.split(' ');

        //func name join
        var funcName = funcNameArr.join('__');
        Entry.TextCodingUtil.initQueue();
        Entry.TextCodingUtil.gatherFuncDefParam(func.content._data[0]._data[0].data.params[0]);
        var funcDefParams = [];

        if(!this._hasRootFunc) {
            while(param = Entry.TextCodingUtil._funcParamQ.dequeue()) {
                funcDefParams.push(param);
            }
        }
        console.log("funcDefParams", funcDefParams);

        /*var funcParamMap = {}; 
        for(var p in funcParams) {
            var funcParam = funcParams[p];
            funcParamMap[funcParam] = p;
        }*/

        Entry.TextCodingUtil.clearQueue();
        //var funcParamMap = paramMap;

        //console.log("funcParamMap", funcParamMap);

        //var funcParams = {}; 
        var funcParams = [];
        if(!this._hasRootFunc) {
            //if(Object.keys(funcParamMap).length != 0) {
                for(var index in funcDefParams) {
                    var value = funcDefParams[index];
                    console.log("paramName index", parseInt(index)+1);
                    var i = value.search('_');
                    var fieldType = value.substring(0, i);

                    if(fieldType == 'stringParam')
                        var name = 'param' + (parseInt(index)+1);
                    else if (fieldType == 'booleanParam')
                        var name = 'param' + (parseInt(index)+1);
                    
                    if(name) {
                        //funcParams[index] = name;
                        funcParams.push(name);
                        this._funcParamMap.put(value, name);
                    }
                }
            //}
        }
        else {
            var params = funcBlock.data.params;
            for(var i in params) {
                var param = params[i];
                if(param) {
                    var paramText = this.Block(param);
                    if(paramType = this._funcParamMap.get(paramText))
                        paramText = paramType;
                    funcParams.push(paramText); 
                }
            } 
        }
        console.log("this._funcParamMap", this._funcParamMap);
        
        /*var params = funcBlock.data.params; 
        for(var i in params) {
            var param = params[i];
            console.log("getFuncInfo param", param);
            if(param) {
                var paramText = this.Block(param); 
                console.log("getFuncInfo paramText", paramText);
                if(pText = this._funcParamMap.get(paramText)) 
                    paramText = pText;
                funcParams.push(paramText);
            }
            
        }*/

        var contents  = func.content._data[0]._data;
        var funcContents = [];
        for(var c = 1; c < contents.length; c++) {
            var block = contents[c]
            funcContents.push(block);
        }

        if(funcName)
            result.name = funcName;

        if(funcParams.length != 0)
            result.params = funcParams;

        if(funcContents.length != 0)
            result.statements = funcContents;

        console.log("getFuncInfo result", result);
        return result;
    };


})(Entry.BlockToPyParser.prototype);
