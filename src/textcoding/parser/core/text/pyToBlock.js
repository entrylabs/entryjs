/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.TextCodingError");
goog.require("Entry.Map");
goog.require("Entry.Queue");

Entry.PyToBlockParser = function(blockSyntax) {
    this._type ="PyToBlockParser";
    this.blockSyntax = blockSyntax;

    this._currentObject = Entry.playground.object;

    var variableMap = new Entry.Map();
    this._variableMap = variableMap;

    var funcMap = new Entry.Map();
    this._funcMap = funcMap;

    var paramQ = new Entry.Queue();
    this._paramQ = paramQ;

    var blockCountMap = new Entry.Map();
    this._blockCountMap = blockCountMap;

    this._funcParamList = [];

    this._threadCount = 0;
    this._blockCount = 0;

    Entry.TextCodingUtil.init();
};

(function(p){
    p.Program = function(astArr) {
        console.log("this.syntax", this.blockSyntax);
        try {
            this._code = [];

            this._threadCount = 0;
            this._blockCount = 0;
            var isEventBlockExisted = false;
            for(var index in astArr) {
                if(astArr[index].type != 'Program') return;
                this._threadCount++;
                this._thread = [];
                var nodes = astArr[index].body;

                console.log("nodes", nodes);
                isEntryEventExisted = false;
                for(var index in nodes) {
                    var node = nodes[index];
                    console.log("Program node", node);

                    var block = this[node.type](node);
                    console.log("result block", block);

                    if(block && block.type) {
                        console.log("block.type", block.type);
                        if(Entry.TextCodingUtil.isJudgementBlock(block.type)) {
                            continue;
                        }
                        else if(Entry.TextCodingUtil.isCalculationBlock(block.type)) {
                            continue;
                        }
                        else if(Entry.TextCodingUtil.isMaterialBlock(block.type)) {
                            continue;
                        }
                        else if(Entry.TextCodingUtil.isHWParamBlock(block.type)) {
                            continue;
                        }

                        if(Entry.TextCodingUtil.isEventBlockByType(block.type)) {
                            isEntryEventExisted = true;
                            console.log("isEntryEventExisted", isEntryEventExisted);
                        }

                        if(Entry.TextCodingUtil.isVariableDeclarationBlock(block.type)) {
                            console.log("isVariableDeclarationBlock block.type", block.type)
                            if(!isEntryEventExisted)
                                continue;
                        }

                        this._thread.push(block);
                    }
                }

                console.log("thread", this._thread);
                if(this._thread.length != 0)
                    this._code.push(this._thread);
            }

            console.log("this._blockCountMap", this._blockCountMap);
            console.log("this._blockCount", this._blockCount);

            return this._code;
        } catch(error) {
            console.log("error", error);
            var err = {};
            err.line = this._blockCount;
            err.title = error.title;
            err.message = error.message;
            console.log("Program catch error", err);
            throw err;
        }
    };

    p.ExpressionStatement = function(component) {
        console.log("ExpressionStatement component", component);

        var reusult;
        var structure = {};

        var expression = component.expression;

        this._blockCount++;
        console.log("BlockCount ExpressionStatement this._blockCount++", this._blockCount);

        if(expression.callee) {
            if(Entry.TextCodingUtil.isEntryEventFuncName(expression.callee.name)) {
                this._blockCount--;
                console.log("BlockCount ExpressionStatement --", "callee.name", expression.callee.name, this._blockCount);
            }
        }

        if(expression.type) {
            var expressionData = this[expression.type](expression);

            console.log("ExpressionStatement expressionData", expressionData);

            if(expressionData.type && expressionData.params) {
                structure.type = expressionData.type;
                structure.params = expressionData.params;

                result = structure;
            } else if(expressionData.type) {
                structure.type = expressionData.type;

                result = structure;
            } else { 
                structure = expressionData;

                result = structure;
            }
        }

        if(!result.type && result.name) {
            /*var error = {};
            error.title = "지원되지 않는 코드";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + result.name + "\'" + "을 삭제하세요.";
            error.line = this._blockCount;
            console.log("send error", error);
            throw error;*/
            var keyword = result.name;
            Entry.TextCodingError.error(
                Entry.TextCodingError.TITLE_CONVERTING,
                Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                keyword,
                this._blockCount);
        }

        console.log("ExpressionStatement result", result);

        return result;
    };


    p.CallExpression = function(component) {
        console.log("CallExpression component", component);
        var result = {};
        var structure = {};

        var params = [];
        var type;

        var callee = component.callee;
        var calleeData = this[callee.type](callee);
        console.log("CallExpression calleeData", calleeData);

        var arguments = component.arguments;

        var addedParamIndex = 0;

        if(callee.type == "Identifier") {
            console.log("CallExpression Identifier calleeData", calleeData);
            result.callee = calleeData;

            var calleeName = Entry.TextCodingUtil.eventBlockSyntaxFilter(calleeData.name);

            if(!type) {
                if(arguments && arguments.length != 0) {
                    for(var a in arguments) {
                        var arg = arguments[a];
                        if(arg.type == "Identifier") {
                            var option = arg.name;
                        }
                        else if(arg.type == "Literal") {
                            var option = arg.value;
                        }
                        else if(arg.type == "MemberExpression") {
                            var option = arg.object.name + "." + arg.property.name;
                        }
                        var syntax = calleeName + "#" + option;
                        var blockSyntax = this.getBlockSyntax(syntax);
                        if(blockSyntax) {
                            type = blockSyntax.key;
                            break;
                        }
                    }
                }
            }

            if(!type) {
                if(arguments && arguments.length != 0) {
                    var argKey = "";
                    for(var a in arguments) {
                        var arg = arguments[a];
                        if(arg.type == "Identifier") {
                            argKey += arg.name;
                        }
                        else if(arg.type == "Literal") {
                            argKey += arg.value;
                        }
                        else if(arg.type == "MemberExpression") {
                            argKey += arg.object.name + "." + arg.property.name;
                        }

                        if(a != arguments.length-1)
                            argKey += ",";
                    }

                }

                var syntax = calleeName + "(" + argKey + ")";
                var blockSyntax = this.getBlockSyntax(syntax);
                if(blockSyntax) {
                    type = blockSyntax.key;
                }
            }

            if(!type) {
                var syntax = calleeName;

                var blockSyntax = this.getBlockSyntax(syntax);
                if(blockSyntax) {
                    type = blockSyntax.key;
                }
            } 

            if(!type) {
                var funcNameKey = calleeData.name + component.arguments.length;
                if(calleeData.name && arguments.length != 0 && arguments[0].type == "Literal") {
                    if(!this._funcMap.contains(funcNameKey)) {
                        var keyword = calleeData.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    }
                }
            }
        }
        else {
            var object = calleeData.object;
            var property = calleeData.property;
            var calleeName = null;

            if(calleeData.property && calleeData.property.name == "call" && calleeData.property.userCode == false) {
                if(calleeData.object && calleeData.object.statements) {
                    var statements = object.statements;
                    console.log("CallExpression statement", statements);
                    result.statements = statements;
                }
            }

            if(calleeData.object) {
                if(calleeData.object.name) {
                    var calleeName = String(calleeData.object.name).concat('.').concat(String(calleeData.property.name));
                }
                else if(calleeData.object.object) {
                    var calleeName = String(calleeData.object.object.name).concat('.')
                                    .concat(String(calleeData.object.property.name))
                                    .concat('.').concat(String(calleeData.property.name));
                }
            }

            result.callee = calleeName;

            if(!type) {
                if(arguments && arguments.length != 0) {
                    for(var a in arguments) {
                        var arg = arguments[a];
                        if(arg.type == "Identifier") {
                            var option = arg.name;
                        }
                        else if(arg.type == "Literal") {
                            var option = arg.value;
                        }
                        else if(arg.type == "MemberExpression") {
                            var option = arg.object.name + "." + arg.property.name;
                        }
                        var syntax = calleeName + "#" + option;
                        console.log("argKey syntax", syntax);
                        var blockSyntax = this.getBlockSyntax(syntax);
                        if(blockSyntax) {
                            type = blockSyntax.key;
                            break;
                        }
                    }
                }
            }

            if(!type) {
                if(arguments && arguments.length != 0) {
                    var argKey = "";
                    for(var a in arguments) {
                        var arg = arguments[a];
                        console.log("arg arg", arg);
                        if(arg.type == "Identifier") {
                            argKey += arg.name;
                        }
                        else if(arg.type == "Literal") {
                            argKey += arg.value;
                        }
                        else if(arg.type == "MemberExpression") {
                            argKey += arg.object.name + "." + arg.property.name;
                        }

                        if(a != arguments.length-1)
                            argKey += ",";
                    }

                }

                console.log("argKey", argKey);

                var syntax = calleeName + "(" + String(argKey) + ")";
                console.log("argKey syntax", syntax);
                var blockSyntax = this.getBlockSyntax(syntax);
                if(blockSyntax) {
                    type = blockSyntax.key;
                }
            }

            if(!type) {
                var syntax = calleeName;
                var blockSyntax = this.getBlockSyntax(syntax);

                if(blockSyntax)
                    type = blockSyntax.key;
            }

            console.log("callee", callee);

            if(callee.object) {
                if(callee.object.name === "Math") {
                    if(callee.property.name === "pow") {
                        var syntax = String("(%2 ** 2");
                        var blockSyntax = this.getBlockSyntax(syntax);
                        if(blockSyntax)
                            type = blockSyntax.key;
                    }
                    else if(callee.property.name === "floor") {
                        var syntax = String("(%2 // %4)");
                        var blockSyntax = this.getBlockSyntax(syntax);
                        if(blockSyntax) {
                            type = blockSyntax.key;
                            var block = Entry.block[type];
                            var paramsMeta = block.params;
                            var paramsDefMeta = block.def.params;
                        }

                        if(component.arguments && component.arguments[0]) {
                            var argument = component.arguments[0];
                            if(argument.left) {
                                param = this[argument.left.type](argument.left.value, paramsMeta, paramsDefMeta, blockSyntax.textParams[1]);
                                params.push(param);
                            }
                            if(argument.right) {
                                param = this[argument.left.type](argument.left.value, paramsMeta, paramsDefMeta, blockSyntax.textParams[3]);
                                params.push(param);
                            }

                            result.type = type;
                            result.params = params;
                            return result;
                        }
                    }
                }
            }

            if(callee.property) {
                if(callee.property.name == "range"){
                    var syntax = String("%1#number");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "add") {
                    var syntax = String("(%1 %2 %3)#calc_basic");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                    argumentData = {raw:"PLUS", type:"Literal", value:"PLUS"};
                    console.log("arguments geniuse", arguments);

                    if(arguments.length == 2)
                        arguments.splice(1, 0, argumentData);

                    result.operator = "PLUS";

                    console.log("callexpression arguments", arguments);
                }
                else if(callee.property.name == "multiply") {
                    var syntax = String("(%1 %2 %3)#calc_basic");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;

                    argumentData = {raw:"MULTI", type:"Literal", value:"MULTI"};
                    if(arguments.length == 2)
                        arguments.splice(1, 0, argumentData);

                    result.operator = "MULTI";
                }
                else if(callee.property.name == "in") {
                    var syntax = String("%4 in %2");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "len") {
                    var syntax = String("len");
                    if(component.arguments && component.arguments[0]) {
                        var arg = component.arguments[0];
                        if(arg.type == "Literal")
                            syntax = String("len#length_of_string");
                    }
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "append") {
                    var syntax = String("%2.append");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name  == "insert") {
                    var syntax = String("%2.insert");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "pop") {
                    var syntax = String("%2.pop");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "subscriptIndex") {
                    if(component.arguments && component.arguments[0]) {
                        var arg = component.arguments[0];
                        if(arg.type == "Literal") {
                            syntax = String("%2\[%4\]#char_at");
                            var blockSyntax = this.getBlockSyntax(syntax);
                            if(blockSyntax)
                                type = blockSyntax.key;
                        }
                    }
                }
                else if(callee.property.name == "_pySlice") {
                    var syntax = String("%2\[%4:%6\]");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "find") {
                    var syntax = String("%2.find");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "replace") {
                    var syntax = String("%2.replace");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "upper") {
                    var syntax = String("%2.upper");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else if(callee.property.name == "lower") {
                    var syntax = String("%2.lower");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
            }

            if(!type) {
                if(calleeData.object.name) {
                    /*console.log("callex error calleeData", calleeData);
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다. 변환가능한 함수를 사용하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    if(callee.property.name)
                        var keyword = calleeData.object.name + '.' + callee.property.name;
                    else
                        var keyword = calleeData.object.name;
                    
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                }
                /*else {
                    var keyword;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                }*/
            }

        }

        console.log("CallExpression type after", type);

        if(type) {
            var block = Entry.block[type];
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params;

            console.log("CallExpression component.arguments", arguments);
            console.log("CallExpression paramsMeta", paramsMeta);
            console.log("CallExpression paramsDefMeta", paramsDefMeta);

            for(var p in paramsMeta) {
                var paramType = paramsMeta[p].type;
                if(paramType == "Indicator")
                    params[p] = null;
                else if(paramType == "Text")
                    params[p] = null;
            }

            console.log("CallExpression arguments", arguments);
            console.log("callex blockSyntax", blockSyntax);

            var paramIndex = this.getParamIndex(syntax);

            if(callee && callee.property) {
                if(callee.property.name == "append") {
                    if(callee.object) {
                        if(callee.object.object) {
                            if(callee.object.object.name == "self") {
                                var name = callee.object.property.name;
                                if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)){
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);

                                    return result;
                                }
                            }
                        }
                        else {
                            var name = callee.object.name;
                            if(!Entry.TextCodingUtil.isGlobalListExisted(name)){
                                var keyword = name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);

                                return result;
                            }
                        }
                    }

                    console.log("CallExpression append calleeData", calleeData);

                    var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);
                    params[paramIndex[0]] = listName;
                    addedParamIndex++;
                }
                else if(callee.property.name == "pop") {
                    if(callee.object) {
                        if(callee.object.object) {
                            if(callee.object.object.name == "self") {
                                var name = callee.object.property.name;
                                if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)){
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);

                                    return result;
                                }
                            }
                        }
                        else {
                            var name = callee.object.name;
                            if(!Entry.TextCodingUtil.isGlobalListExisted(name)){
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/

                                var keyword = name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);

                                return result;
                            }
                        }
                    }

                    console.log("CallExpression append calleeData", calleeData);

                    var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);
                    params[paramIndex[0]] = listName;
                    addedParamIndex++;
                }
                else if(callee.property.name == "insert") {
                    if(callee.object) {
                        if(callee.object.object) {
                            if(callee.object.object.name == "self") {
                                var name = callee.object.property.name;
                                if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)){
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);

                                    return result;
                                }
                            }
                        }
                        else {
                            var name = callee.object.name;
                            if(!Entry.TextCodingUtil.isGlobalListExisted(name)){
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/

                                var keyword = name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);

                                return result;
                            }
                        }
                    }

                    console.log("CallExpression insert params", params);

                    var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);
                    params[paramIndex[0]] = listName;
                    addedParamIndex++;
                }
            }

            var pi = 0;
            pi += addedParamIndex;

            if(blockSyntax.textParams)
                var textParams = blockSyntax.textParams;

            for(var i in arguments) {
                var isParamOption = false; 
                var argument = arguments[i];
                console.log("kkk argument", argument, "typeof", typeof argument);

                if(argument) {
                    console.log("CallExpression argument", argument, "typeof", typeof argument);

                    argument.calleeName = calleeName;
                    if(!textParams)
                        var textParams = [];

                    var param = this[argument.type]
                        (argument, paramsMeta[paramIndex[pi]], paramsDefMeta[paramIndex[pi]], textParams[pi]);


                    console.log("callexpression callee", callee, "param", param);

                    console.log("calleeName", calleeName, "param", param);

                    if(param && param.data) {
                        param = param.data;
                    }

                    console.log("callex block one multi", block);
                    console.log("callex param syntax", syntax, "order", paramIndex, "value", paramIndex[pi], "param", param);
                    console.log("pi", pi);

                    if(param) {
                        var keyOption = blockSyntax.keyOption;
                        console.log("keyOption", keyOption);
                        if(keyOption || keyOption === 0) {
                            console.log("param", param)
                            if(param.object && param.property.name) {
                                var pName = param.object.name + "." + param.property.name;
                                if(keyOption == pName)
                                    isParamOption = true;
                            }
                            else if((param.type == "text" || param.type =="number") && param.params && param.params.length != 0) {
                                var pName = param.params[0];
                                console.log("pName", pName);
                                if(keyOption == pName)
                                    isParamOption = true;
                            }
                        }
                    }

                    if(isParamOption) continue;
                    var pIndex = paramIndex[pi++];
                    if(pIndex === undefined) continue;

                    params[pIndex] = param;

                    console.log("callex realtime params", params);

                    if(param) {
                        if(param.object && param.object.object) {
                            if(param.object.object.name == "self") {
                                var name = param.object.property.name;
                                if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)) {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.property.name + "\'" + " 리스트를 생성하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);
                                }
                            }
                            else {
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.object.name + "\'" + " 리스트 객체는 지원하지 않습니다.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/
                                var name = param.object.object.name;
                                var keyword = name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_OBJECT); 
                            }
                        }
                        else if(param.object) {
                            if(callee.property && callee.property.name == "len" || callee.property.name == "in") {
                                if(param.object.name == "self") {
                                    var name = param.property.name;
                                    if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.property.name + "\'" + " 리스트를 생성하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                                    }
                                }
                                else {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 리스트 객체는 지원하지 않습니다.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/
                                    var name = param.object.name;
                                    var keyword = name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                                }
                            }
                            else {
                                if(param.property.callee == "__pythonRuntime.ops.subscriptIndex") {
                                    console.log("mmm param", param);
                                    if(!param.object.type) {
                                        var name = param.object.name;
                                        if(!Entry.TextCodingUtil.isGlobalListExisted(name, this._currentObject)) {
                                            /*var error = {};
                                            error.title = "지원되지 않는 코드";
                                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 리스트를 생성하세요.";
                                            error.line = this._blockCount;
                                            console.log("send error", error);
                                            throw error;*/

                                            var keyword = name;
                                            Entry.TextCodingError.error(
                                                Entry.TextCodingError.TITLE_CONVERTING,
                                                Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                                keyword,
                                                this._blockCount,
                                                Entry.TextCodingError.SUBJECT_CONV_LIST);
                                        }
                                    }
                                }
                                else {
                                    if(param.object.name == "self") {
                                        var name = param.property.name;
                                        if(!Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject)) {
                                            /*var error = {};
                                            error.title = "지원되지 않는 코드";
                                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.property.name + "\'" + " 변수를 생성하세요.";
                                            error.line = this._blockCount;
                                            console.log("send error", error);
                                            throw error;*/

                                            var keyword = name;
                                            Entry.TextCodingError.error(
                                                Entry.TextCodingError.TITLE_CONVERTING,
                                                Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                                keyword,
                                                this._blockCount,
                                                Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                                        }
                                    } else if(param.object.name == "Hamster") {
                                        continue;
                                    } else {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 변수 객체는 지원하지 않습니다.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var name = param.object.name;
                                        var keyword = name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                                    }
                                }
                            }
                        }
                        else {
                            if(param.name && typeof param == "object") {
                                if(callee.property && (callee.property.name == "len" || callee.property.name == "in")) {
                                    var name = param.name;
                                    if(!Entry.TextCodingUtil.isGlobalListExisted(name, this._currentObject)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + " 리스트를 생성하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                                    }
                                }
                                else {
                                    var name = param.name;
                                    if(!Entry.TextCodingUtil.isGlobalVariableExisted(name)) {
                                        if(!Entry.TextCodingUtil.isFuncParam(name)) {
                                           /* var error = {};
                                            error.title = "지원되지 않는 코드";
                                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + " 변수를 생성하세요.";
                                            error.line = this._blockCount;
                                            console.log("send error", error);
                                            throw error;*/

                                            var keyword = name;
                                            Entry.TextCodingError.error(
                                                Entry.TextCodingError.TITLE_CONVERTING,
                                                Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                                keyword,
                                                this._blockCount,
                                                Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            console.log("call call params", params);

            if(callee.object && callee.property) {
                if(callee.property.name == "range") {
                    if(params.length > 2) {
                        //Just Check
                    }
                    else if(params.length == 2) {
                        for(var p in params) {
                            var param = params[p];
                            console.log("range param", param);
                            var rParamBlock = {};
                            var rParamType = "calc_basic";
                            var rParamParams = [];
                            rParamParams[1] = "MINUS";

                            if(typeof param == "object") {
                                if(param.type == "text" || param.type == "number") {
                                    params[p] = param.params[0];
                                }
                            }

                            console.log("mid range params", params);
                            if(p == 1) {
                                if((typeof params[0] == "string" || typeof params[0] == "number") &&
                                    (typeof params[1] == "string" || typeof params[1] == "number")) {
                                    console.log("came here jjj", parseInt(params[1]));
                                    var count = parseInt(params[1]) - parseInt(params[0]);

                                    if(!isNaN(count)) {
                                        var rParams = [];
                                        rParams.push(count);
                                        params = rParams;
                                    }
                                    else {
                                        var rParams = [];
                                        rParams.push(10);
                                        params = rParams;
                                    }
                                }
                                else {
                                    if(typeof params[0] == "string" || typeof params[0] == "number") {
                                        var rBlock = {};
                                        var rType = "text";
                                        var rParams = [];
                                        rParams.push(params[0]);
                                        rBlock.type = rType;
                                        rBlock.params = rParams;

                                        params[0] = rBlock;
                                    }

                                    if(typeof params[1] == "string" || typeof params[1] == "number") {
                                        var rBlock = {};
                                        var rType = "text";
                                        var rParams = [];
                                        rParams.push(params[1]);
                                        rBlock.type = type;
                                        rBlock.params = rParams;

                                        params[1] = rBlock;
                                    }

                                    rParamParams[0] = params[1];
                                    rParamParams[2] = params[0];

                                    rParamBlock.type = rParamType;
                                    rParamBlock.params = rParamParams;

                                    result = rParamBlock;
                                    return result;
                                }
                            }
                        }
                    }
                    else if(params.length == 1) {
                        console.log("call range params", params);
                        param = params[0];
                        console.log("range here param", param);

                        if(typeof param != "object") {
                            params.splice(0, 1, param);
                        }
                        else {
                            if(param.type && param.params) {
                                console.log("rangeparam param.type", param.type, "param.params", param.params);
                                type = param.type;
                                params = param.params;
                            }
                        }
                    }
                    console.log("range final params", params);
                }
                else if(callee.property.name == "add") {
                    var isStringIncluded = false;
                    for(var p in params) {
                        var param = params[p];
                        if(param && (param.type == "text" || param.type == "number" || param.type == "combine_something" || param == "PLUS")) {
                            if(param.type == "text" || param.type == "number") {
                                if(param.params && param.params.length != 0) {
                                    var p = param.params[0];
                                    if(typeof p == "string") {
                                        console.log("isStringIncluded", param);
                                        isStringIncluded = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if(isStringIncluded) { //retype considering parameter condition
                        var syntax = String("(%2 + %4)");
                        var blockSyntax = this.getBlockSyntax(syntax);
                        if(blockSyntax)
                            type = blockSyntax.key;

                        params[1] = null;
                        params.splice(0, 0, null);
                        params.splice(4, 0, null);

                        console.log("isStringIncluded params", params);
                    }
                }
                else if(callee.property.name == "len") {
                    if(syntax == String("len")) {
                        var p = params[1];
                        p = this.ParamDropdownDynamic(p.name, paramsMeta[1], paramsDefMeta[1]);
                        params[1] = p;
                    }
                }
                else if(callee.property.name == "in") {
                    var p = params[1];
                    p = this.ParamDropdownDynamic(p.name, paramsMeta[1], paramsDefMeta[1]);
                    params[1] = p;
                }
                else if(callee.property.name == "pop") {
                    if(params[0].type == "number" || params[0].type == "text") {
                        if(!isNaN(params[0].params[0]))
                            params[0].params[0] += 1;
                    }
                    else if(params[0].type == "get_variable") {
                        var indexBlock = {};
                        var indexBlockType = "calc_basic"; 
                        indexBlock.type = indexBlockType;
                        var indexParams = [];
                        indexParams[0] = params[0];
                        indexParams[1] = "PLUS";
                        indexParams[2] = {type: "number", params: [1]}; 
                        indexBlock.params = indexParams;
                        params[0] = indexBlock;
                    }
                    else if(params[0].type == "calc_basic") {
                        if(params[0].params[1] == "MINUS" && params[0].params[2].params[0] == "1") {
                            params[0] = params[0].params[0];   
                        }
                        else {
                            var indexBlock = {};
                            var indexBlockType = "calc_basic"; 
                            indexBlock.type = indexBlockType;
                            var indexParams = [];
                            indexParams[0] = params[0];
                            indexParams[1] = "PLUS";
                            indexParams[2] = {type: "number", params: [1]};
                            indexBlock.params = indexParams;
                            params[0] = indexBlock;
                        }
                    }
                   
                }
                else if(callee.property.name == "insert") {
                    if(params[2].type == "number" || params[2].type == "text") {
                        if(!isNaN(params[2].params[0]))
                            params[2].params[0] += 1;
                    }
                    else if(params[2].type == "get_variable") {
                        var indexBlock = {};
                        var indexBlockType = "calc_basic"; 
                        indexBlock.type = indexBlockType;
                        var indexParams = [];
                        indexParams[0] = params[2];
                        indexParams[1] = "PLUS";
                        indexParams[2] = {type: "number", params: [1]};
                        indexBlock.params = indexParams;
                        params[2] = indexBlock;
                    }
                    else if(params[2].type == "calc_basic") {
                        if(params[2].params[1] == "MINUS" && params[2].params[2].params[0] == "1") {
                            params[2] = params[2].params[0];   
                        }
                        else {
                            var indexBlock = {};
                            var indexBlockType = "calc_basic"; 
                            indexBlock.type = indexBlockType;
                            var indexParams = [];
                            indexParams[0] = params[2];
                            indexParams[1] = "PLUS";
                            indexParams[2] = {type: "number", params: [1]};
                            indexBlock.params = indexParams;
                            params[2] = indexBlock;
                        }
                    }
                    
                }
                else if(callee.property.name == "subscriptIndex") {
                    var p = params[3];
                    if(params[3].type == "number" || params[3].type == "text") {
                        if(!isNaN(params[3].params[0]))
                            params[3].params[0] += 1;
                    }
                    else if(params[3].type == "get_variable") {
                        var indexBlock = {};
                        var indexBlockType = "calc_basic"; 
                        indexBlock.type = indexBlockType;
                        var indexParams = [];
                        indexParams[0] = params[3];
                        indexParams[1] = "PLUS";
                        indexParams[2] = {type: "number", params: [1]};
                        indexBlock.params = indexParams;
                        params[3] = indexBlock;
                    }
                    else if(params[3].type == "calc_basic") {
                        if(params[3].params[1] == "MINUS" && params[3].params[2].params[0] == "1") {
                            params[3] = params[3].params[0];   
                        }
                        else {
                            var indexBlock = {};
                            var indexBlockType = "calc_basic"; 
                            indexBlock.type = indexBlockType;
                            var indexParams = [];
                            indexParams[0] = params[3];
                            indexParams[1] = "PLUS";
                            indexParams[2] = {type: "number", params: [1]};
                            indexBlock.params = indexParams;
                            params[3] = indexBlock;
                        }
                    }
                }
                else if(callee.property.name == "_pySlice") {
                    if(callee.object) {
                        var objectData = this[callee.object.type](callee.object);
                        console.log("objectData", objectData);
                        var newParams = [];
                        newParams[1] = objectData;
                        if(params[1].type == "number" || params[1].type == "text") {
                            if(!isNaN(params[1].params[0]))
                                params[1].params[0] += 1;
                        }
                        else if(params[1].type == "get_variable") {
                            var indexBlock = {};
                            var indexBlockType = "calc_basic"; 
                            indexBlock.type = indexBlockType;
                            var indexParams = [];
                            indexParams[0] = params[1];
                            indexParams[1] = "PLUS";
                            indexParams[2] = {type: "number", params: [1]};
                            indexBlock.params = indexParams;
                            params[1] = indexBlock;
                        }
                        else if(params[1].type == "calc_basic") {
                            if(params[1].params[1] == "MINUS" && params[1].params[2].params[0] == "1") {
                                params[1] = params[1].params[0];   
                            }
                            else {
                                var indexBlock = {};
                                var indexBlockType = "calc_basic"; 
                                indexBlock.type = indexBlockType;
                                var indexParams = [];
                                indexParams[0] = params[1];
                                indexParams[1] = "PLUS";
                                indexParams[2] = {type: "number", params: [1]};
                                indexBlock.params = indexParams;
                                params[1] = indexBlock;
                            }
                        }
                        newParams[3] = params[1];
                        newParams[5] = params[3];
                        params = newParams;
                    }
                }
                else if(callee.property.name == "find") {
                    if(callee.object) {
                        var objectData = this[callee.object.type](callee.object);
                        console.log("objectData", objectData);
                        var newParams = [];
                        newParams[1] = objectData;
                        newParams[3] = params[1];
                        params = newParams;
                    }
                }
                else if(callee.property.name == "replace") {
                    if(callee.object) {
                        var objectData = this[callee.object.type](callee.object);
                        console.log("objectData", objectData);
                        var newParams = [];
                        newParams[1] = objectData;
                        newParams[3] = params[1];
                        newParams[5] = params[3];
                        params = newParams;
                    }
                }
                else if(callee.property.name == "upper") {
                    if(callee.object) {
                        var objectData = this[callee.object.type](callee.object);
                        console.log("objectData", objectData);
                        var newParams = [];
                        newParams[1] = objectData;
                        newParams[3] = params[1];
                        params = newParams;
                    }
                }
                else if(callee.property.name == "lower") {
                    if(callee.object) {
                        var objectData = this[callee.object.type](callee.object);
                        console.log("objectData", objectData);
                        var newParams = [];
                        newParams[1] = objectData;
                        newParams[3] = params[1];
                        params = newParams;
                    }
                }
            }

            //HW
            if(callee.object && callee.property) {
                if(callee.object.name == "Hamster") {
                    console.log("params", params);
                    if(callee.property.name == "wheels") {
                        var calleeName = callee.object.name + "." + callee.property.name;
                        var param1 = params[0];
                        var param2 = params[1];
                        //if(param1.params[0] == param2.params[0]) {
                        if(!params[1]) {
                            var keyOption = "SAME";
                            var syntax = calleeName + "#" + keyOption;
                            var blockSyntax = this.getBlockSyntax(syntax);
                            if(blockSyntax) {
                                type = blockSyntax.key;
                            }
                        }
                    }
                    else if(callee.property.name == "wheels_by") {
                        var calleeName = callee.object.name + "." + callee.property.name;
                        var param1 = params[0];
                        var param2 = params[1];
                        //if(param1.params[0] == param2.params[0]) {
                            if(!params[1]) {
                            var keyOption = "SAME";
                            var syntax = calleeName + "#" + keyOption;
                            var blockSyntax = this.getBlockSyntax(syntax);
                            if(blockSyntax) {
                                type = blockSyntax.key;
                            }
                        }
                    }
                }
            }

            console.log("params checkit", params);

            if(blockSyntax.params && blockSyntax.params.length != 0) {
                for(var p in blockSyntax.params) {
                    var param = blockSyntax.params[p];
                    if(param)
                        params[p] = param;
                }
            }

            if(type) {
                structure.type = type;
                result.type = structure.type;
            }

            if(params) {
                structure.params = params;
                result.params = structure.params;
            }
        } else { //special param
            var args = [];
            for(var i in arguments) {
                var argument = arguments[i];
                if(!argument) continue;
                console.log("CallExpression argument", argument, "typeof", typeof argument);

                var argumentData = this[argument.type](argument);
                console.log("CallExpression argument", argument);
                console.log("CallExpression argumentData", argumentData, "??", argumentData.type);

                if(argumentData.callee == "__pythonRuntime.utils.createParamsObj") {
                    args = argumentData.arguments;
                }
                else if(!argumentData.type && argumentData.isCallParam) {
                    if(argument.type != "ThisExpression") {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        console.log("argumentData 123", argumentData);
                        var keyword;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_DEFAULT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_DEFAULT);
                    }
                }
                else {
                    args.push(argumentData);
                }

            }
            console.log("CallExpression args", args);

            result.arguments = args;
        }

        console.log("CallExpression Function Check result", result);

        // Function Check
        if(result.arguments && result.arguments[0] && result.arguments[0].callee == "__pythonRuntime.utils.createParamsObj") {
            return result;
        }

        if(result.callee) {
            if(result.arguments) {
                var idNumber = result.arguments.length;

                var params = [];
                var arguments = result.arguments;
                for(var a in arguments) {
                    var argument = arguments[a];
                    params.push(argument);
                }
            }
            else {
                var idNumber = 0;
            }
            var funcKey = result.callee.name + idNumber;
            //console.log("funcKey", funcKey);
            var type = this._funcMap.get(funcKey);
            if(type) {
                result = {};
                result.type = type;

                if(params && params.length != 0) {
                    result.params = params;
                }
            }
            else {
                if(result.callee.isCallParam == false) {
                    if(!Entry.TextCodingUtil.isEntryEventFuncName(result.callee.name)) {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + result.callee.name + "\'" + "을 제거하세요.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/
                        var name = result.callee.name;
                        var keyword = name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    }
                }
            }
        }

        console.log("CallExpression result", result);
        return result;
    };

    p.Identifier = function(component, paramMeta, paramDefMeta) {
        console.log("Identifier component", component, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta);
        var result = {};
        var structure = {};
        structure.params = [];

        result.name = component.name;
        if(component.userCode === true || component.userCode === false)
            result.userCode = component.userCode;

        var syntax = String("%1#get_variable");
        var blockSyntax = this.getBlockSyntax(syntax);
        var type;
        if(blockSyntax)
            type = blockSyntax.key;

        if(type) {
            structure.type = type;
            var name = component.name;
            var block = Entry.block[type];
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params;

            if(!Entry.TextCodingUtil.isGlobalVariableExisted(name) &&
                !Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject)) {
                if(paramMeta && paramDefMeta) {
                    result.isCallParam = true;
                } else {
                    result.isCallParam = false;
                }
                return result;
            }

            var params = [];
            var param;
            for(var i in paramsMeta) {
                console.log("Identifiler paramsMeta, paramsDefMeta", paramsMeta[i], paramsDefMeta[i]);
                if(paramsMeta[i].type == "Text")
                    continue;
                param = this['Param'+paramsMeta[i].type](name, paramsMeta[i], paramsDefMeta[i]);
            }

            console.log("Identifiler param", param);

            if(param)
                params.push(param);

            result.type = structure.type;
            if(params.length != 0) {
                structure.params = params;
                result.params = structure.params;
            }

        }

        console.log("Identifiler result", result);
        return result;
    };

    p.VariableDeclaration = function(component) {
        console.log("VariableDeclaration component", component);
        var result = {};
        result.declarations = [];

        var structure = {};

        var declarations = component.declarations;

        for(var i in declarations) {
            var declaration = declarations[i];
            var declarationData = this[declaration.type](declaration);

            console.log("VariableDeclaration declarationData", declarationData);
            if(declarationData && declarationData.isFuncParam) {
                Entry.TextCodingUtil.addFuncParam(declarationData.name);
            }

            if(declarationData) {
                result.declarations.push(declarationData);
            }
            if(declarationData && declarationData.type) {
                structure.type = declarationData.type;
            }
            if(declarationData && declarationData.params) {
                structure.params = declarationData.params;
            }
        }

        if(structure.type)
            result.type = structure.type;
        if(structure.params)
            result.params = structure.params;

        console.log("VariableDeclaration result", result);

        return result;

    };

    p.VariableDeclarator = function(component) {
        console.log("VariableDeclarator component", component);

        var result = {};
        var structure = {};
        var params = [];

        this._blockCount++;
        console.log("BlockCount VariableDeclarator ++", this._blockCount);
        if((component.id.name && component.id.name.search("__") != -1) ||
            (component.init && component.init.callee && component.init.callee.name &&
             component.init.callee.name.search("__") != -1)) {
            this._blockCount--;
            console.log("BlockCount VariableDeclarator --", this._blockCount);
        }

        var id = component.id;
        var init = component.init;

        // This is Function-Related Param
        if(id.name == "__params0" || id.name == "__formalsIndex0" || id.name == "__args0")
            return undefined;

        // This is Function-Related Param
        if(init.callee && init.callee.name == "__getParam0") {
            result.isFuncParam = true;
            result.name = id.name;

            return result;
        }

        var idData = this[id.type](id);
        var initData = this[init.type](init);

        //var params = [];
        if(init.type == "Identifier" || init.type == "MemberExpression") {
            if(initData.property && initData.property.callee == "__pythonRuntime.ops.subscriptIndex") {
                if(initData.object && initData.object.object) {
                    if(initData.object.object.name != "self") { // Not Self List
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.object.object.name + "\'" + " 객체 리스트는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var name = initData.object.object.name;
                        var keyword = name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                    }
                    else if(initData.object.property) { // Self List
                        var name = initData.object.property.name;
                        if(!Entry.TextCodingUtil.isLocalListExisted(initData.object.property.name, this._currentObject)) {
                            /*var error = {};
                            error.title = "지원되지 않는 코드";
                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.object.property.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                            error.line = this._blockCount;
                            console.log("send error", error);
                            throw error;*/

                            var keyword = name;
                            Entry.TextCodingError.error(
                                Entry.TextCodingError.TITLE_CONVERTING,
                                Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                keyword,
                                this._blockCount,
                                Entry.TextCodingError.SUBJECT_CONV_LIST);
                        }
                    }
                }
                else if(initData.object) { // List
                    var name = initData.object.name;
                    if(!Entry.TextCodingUtil.isGlobalListExisted(name)) {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.object.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                    }
                }
            }
            else {
                if(initData.object) {
                    if(initData.object.name != "self") { // Not Self List
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.object.name + "\'" + " 객체 변수는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = initData.object.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_OBJECT);

                    }
                    else if(initData.property.name) { // Self List
                        var name = initData.property.name;
                        if(!Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject)) {
                            /*var error = {};
                            error.title = "지원되지 않는 코드";
                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.property.name + "\'" + " 변수를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                            error.line = this._blockCount;
                            console.log("send error", error);
                            throw error;*/

                            var keyword = name;
                            Entry.TextCodingError.error(
                                Entry.TextCodingError.TITLE_CONVERTING,
                                Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                keyword,
                                this._blockCount,
                                Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                        }
                    }
                }
                else {
                    var name = initData.name;
                    if(!Entry.TextCodingUtil.isGlobalVariableExisted(name)) {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + initData.name + "\'" + " 변수는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                    }
                }
            }
        }

        var calleeName;

        console.log("VariableDeclarator init", init);

        if(init.callee && init.callee.object && init.callee.property) {
            if(init.callee.object.object && init.callee.object.object.name)
                var objectObjectName  = init.callee.object.object.name;
            if(init.callee.object.property && init.callee.object.property.name)
                var objectPropertyName = init.callee.object.property.name;
            if(init.callee.property.name)
                var propertyName = init.callee.property.name;

            if(objectObjectName && objectPropertyName && propertyName)
                calleeName = objectObjectName.concat('.').concat(objectPropertyName).concat('.').concat(propertyName);
        }

        console.log("calleeName", calleeName);

        if(calleeName == "__pythonRuntime.objects.list") {
            console.log("VariableDeclarator idData", idData);
            result.id = idData;

            console.log("VariableDeclarator initData", initData);
            result.init = initData;

            var name = id.name;

            var array = [];
            var arguments = initData.arguments;
            for(var a in arguments) {
                var argument = arguments[a];
                var item = {};
                if(argument.type) {
                    var arg = argument.params[0]; 
                    if(typeof arg === "string")
                        arg = "\"" + arg + "\"";
                    item.data = String(argument.params[0]);
                }
                else if(argument.name) {
                   /* var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + argument.name + "\'" + " 변수는 리스트에 포함될 수 없습니다.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = argument.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                }

                array.push(item);
            }

            console.log("vd name", name);

            if(Entry.TextCodingUtil.isGlobalListExisted(name)) {
                Entry.TextCodingUtil.updateGlobalList(name, array);
            }
            else {
                Entry.TextCodingUtil.createGlobalList(name, array);
            }
        } else {
            var name = id.name;
            if(init.type == "Literal") {
                var value = init.value;
                if(typeof value === "string")
                    value = "\"" + value + "\"";
            }
            else if(init.type == "Identifier") {
                var value = init.name;
            }
            else if(init.type == "UnaryExpression") {
                var initData = this[init.type](init);
                console.log("VariableDeclarator initData UnaryExpression", initData);
                var value = initData.params[0];
                console.log("gl initData", initData, "type", typeof value);
                if(typeof value != "string" && typeof value != "number") {
                    value = 0;
                }
            }
            else {
                value = 0
            }

            console.log("variable name", name, "value", value);

            if((value && !isNaN(value)) || value == 0) {
                if(name && name.indexOf('__filbert') < 0) {
                    if(Entry.TextCodingUtil.isGlobalVariableExisted(name)) {
                        console.log("this is update", name, value);
                        Entry.TextCodingUtil.updateGlobalVariable(name, value);
                    }
                    else {
                        Entry.TextCodingUtil.createGlobalVariable(name, value);
                    }
                }
            }

            var idData = this[id.type](id);
            console.log("VariableDeclarator idData", idData);
            result.id = idData;

            var initData = this[init.type](init);
            console.log("VariableDeclarator initData", initData);
            result.init = initData;

            console.log("VariableDeclarator init.type", init.type);
            if(init.type == "Literal") {
                var syntax = String("%1 = %2");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;
                structure.type = type;
            }
            else {
                if(initData.params && initData.params[0] && initData.params[0].name &&
                    idData.name == initData.params[0].name &&
                    initData.operator == "PLUS" || initData.operator == "MINUS") {

                    console.log("VariableDeclarator idData.name", idData.name, "initData.params[0].name", initData.params[0].name);
                    var syntax = String("%1 = %1 + %2");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;
                } else {
                    var syntax = String("%1 = %2");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;
                }

            }

            var block = Entry.block[type];
            console.log("vblock", block);
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params;

            if(idData.name)
                var variableId = this.ParamDropdownDynamic(idData.name, paramsMeta[0], paramsDefMeta[0]);

            var params = [];
            if(init.type == "Literal") {
                if(idData.params && idData.params[0])
                    params.push(idData.params[0]);
                else
                    params.push(variableId);
                var pData = initData.params[0];
                if(typeof pData == "string")
                    pData = "\"" + pData + "\"";
                initData.params[0] = pData;
                params.push(initData);
            }
            else {
                console.log("VariableDeclarator idData", idData, "initData", initData);
                if(initData.params && initData.params[0] && idData.name == initData.params[0].name &&
                    initData.operator == "PLUS" || initData.operator == "MINUS") {
                    console.log("in initData.params[0]");
                    if(idData.params && idData.params[0])
                        params.push(idData.params[0]);
                    else
                        params.push(variableId);

                    if(initData.operator == "MINUS") {
                        if(initData.params[2].params[0] != 0)
                            initData.params[2].params[0] = "-" + initData.params[2].params[0];
                    }

                    params.push(initData.params[2]);
                } else {
                    console.log("in initData");
                    if(idData.params && idData.params[0])
                        params.push(idData.params[0]);
                    else
                        params.push(variableId);
                    params.push(initData);
                }
            }

            structure.params = params;

            result.type = structure.type;
            result.params = structure.params;
        }

        console.log("VariableDeclarator result", result);
        return result;

    };

    p.AssignmentExpression = function(component) {
        console.log("AssignmentExpression component", component);
        var result = {};
        var structure = {};

        var params = [];
        var param;

        var left = component.left;
        if(left.type) {
            var leftData = this[left.type](left);
            console.log("AssignmentExpression leftData", leftData);
        }

        console.log("AssignmentExpression leftData", leftData);

        result.left = leftData

        operator = String(component.operator);
        console.log("AssignmentExpression operator", operator);

        var right = component.right;
        if(right.type) {
            var rightData = this[right.type](right);
            console.log("AssignmentExpression rightData", rightData);
        }

        result.right = rightData;

        switch(operator){
            case "=": {
                if(rightData && rightData.callee && rightData.callee.object) {
                    var calleeName = rightData.callee.object.object.name.concat('.')
                        .concat(rightData.callee.object.property.name).concat('.')
                        .concat(rightData.callee.property.name);
                }

                if(calleeName == "__pythonRuntime.objects.list") {
                    if(leftData && leftData.object && leftData.object.name == "self") {
                        if(leftData.property) {
                            var calleeName;
                            var name = leftData.property.name;

                            var array = [];
                            var arguments = rightData.arguments;
                            for(var a in arguments) {
                                var argument = arguments[a];
                                var item = {};
                                item.data = String(argument.params[0]);
                                array.push(item);
                            }

                            if(Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject)) {
                                Entry.TextCodingUtil.updateLocalList(name, array, object);
                            }
                            else {
                                Entry.TextCodingUtil.createLocalList(name, array, object);
                            }
                        }
                    }
                }

                //left expressoin
                if(left.name) {
                    var leftEx = left.name;
                }
                else if(left.object && left.object.name) {
                    var leftEx = left.object.name.concat(left.property.name);
                }

                //right expression
                if(right.arguments && right.arguments.length != 0 && right.arguments[0].name) {
                    var rightEx = right.arguments[0].name;
                }
                else if(right.arguments && right.arguments.length != 0 && right.arguments[0].object) {
                    var rightEx = right.arguments[0].object.name.concat(right.arguments[0].property.name);
                }
                else if(right.left && right.left.name) {
                    var rightEx = right.left.name;
                }
                else if(right.left && right.left.object) {
                    var rightEx = right.left.object.name.concat(right.left.property.name);
                }

                console.log("AssignmentExpression leftEx", leftEx, "rightEx", rightEx);

                if(leftData && leftData.property && leftData.property.callee == "__pythonRuntime.ops.subscriptIndex") {
                    var syntax = String("%1\[%2\] = %3");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;
                }
                else if(leftEx && rightEx && leftEx == rightEx) {
                    var syntax = String("%1 = %1 + %2");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;
                }
                else {
                    var syntax = String("%1 = %2");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;
                }

                break;
            }
            case "+=":
                var syntax = String("%1 = %1 + %2");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                structure.type = type;
                break;
            case "-=":
                var syntax = String("%1 = %1 + %2");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                structure.type = type;
                break;
            case "*=":
                var syntax = String("%1 = %1 + %2");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                structure.type = type;
                break;
            case "/=":
                var syntax = String("%1 = %1 + %2");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                structure.type = type;
                break;
            case "%=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "<<=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case ">>=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "|=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "^=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "&=":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            default:
                operator = operator;
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
        }

        if(operator) {
            var operatorData = Entry.TextCodingUtil.logicalExpressionConvert(operator);
        }

        result.operator = operatorData;

        console.log("AssignmentExpression syntax", syntax);

        if(leftData && leftData.property && leftData.property.callee == "__pythonRuntime.ops.subscriptIndex") { // In Case of List
            if(leftData.object && leftData.object.object) {
                if(leftData.object.object.name != "self") { // Not Self List
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + leftData.object.object.name + "\'" + " 객체 리스트는 지원하지 않습니다.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = leftData.object.object.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_OBJECT);

                }
                else if(leftData.object.property) { // Self List, Because of Left Variable
                }
            }
            else if(leftData.object) { // List
                if(!Entry.TextCodingUtil.isGlobalListExisted(leftData.object.name)) {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + leftData.object.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = leftData.object.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_LIST);
                }
            }
        }
        else { // In Case of Variable
            if(leftData.object) {
                if(leftData.object.name != "self") {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + leftData.object.name + "\'" + " 객체 변수는 지원하지 않습니다.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = leftData.object.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                }
                else if(leftData.property) { //Because of Left Variable
                }
            }
        }

        if(right.type == "Identifier" || right.type == "MemberExpression") {
            if(rightData && rightData.property && rightData.property.callee == "__pythonRuntime.ops.subscriptIndex") { // In Case of List
                if(rightData.object && rightData.object.object) {
                    if(rightData.object.object.name != "self") { // Not Self List
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.object.object.name + "\'" + " 객체 리스트는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = rightData.object.object.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                    }
                    else if(rightData.object.property) { // Self List
                        if(!Entry.TextCodingUtil.isLocalListExisted(rightData.object.property.name, this._currentObject)) {
                            /*var error = {};
                            error.title = "지원되지 않는 코드";
                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.object.property.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                            error.line = this._blockCount;
                            console.log("send error", error);
                            throw error;*/

                            var keyword = rightData.object.property.name;
                            Entry.TextCodingError.error(
                                Entry.TextCodingError.TITLE_CONVERTING,
                                Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                keyword,
                                this._blockCount,
                                Entry.TextCodingError.SUBJECT_CONV_LIST);
                        }
                    }
                }
                else if(rightData.object) { // List
                    if(!Entry.TextCodingUtil.isGlobalListExisted(rightData.object.name)) {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.object.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = rightData.object.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                    }
                }
            }
            else { // In Case of Variable
                if(rightData.object) {
                    if(rightData.object.name != "self") {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.object.name + "\'" + " 객체 변수는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = rightData.object.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                    }
                    else if(rightData.property) {
                        if(!Entry.TextCodingUtil.isLocalVariableExisted(rightData.property.name, this._currentObject)) {
                            /*var error = {};
                            error.title = "지원되지 않는 코드";
                            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.property.name + "\'" + "변수를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                            error.line = this._blockCount;
                            console.log("send error", error);
                            throw error;*/

                            var keyword = rightData.object.name;
                            Entry.TextCodingError.error(
                                Entry.TextCodingError.TITLE_CONVERTING,
                                Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                keyword,
                                this._blockCount,
                                Entry.TextCodingError.SUBJECT_CONV_LIST);
                        }
                    }
                }
                else {
                    if(!Entry.TextCodingUtil.isGlobalVariableExisted(rightData.name)) {
                        /*var error = {};
                        error.title = "지원되지 않는 코드";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + rightData.name + "\'" + " 변수는 지원하지 않습니다.";
                        error.line = this._blockCount;
                        console.log("send error", error);
                        throw error;*/

                        var keyword = rightData.name;
                        Entry.TextCodingError.error(
                            Entry.TextCodingError.TITLE_CONVERTING,
                            Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                            keyword,
                            this._blockCount,
                            Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                    }
                }
            }
        }

        console.log("leftData yyy", leftData);

        if(syntax == String("%1\[%2\] = %3")) {
            var block = Entry.block[type];
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params;

            if(!leftData || !leftData.params) {
                /*var error = {};
                error.title = "지원되지 않는 코드";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                error.line = this._blockCount;
                console.log("send error", error);
                throw error;*/

                var keyword;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
            }

            var listName = leftData.params[1];

            console.log("AssignmentExpression listName", listName);

            params.push(listName);
            if(leftData && leftData.property) {
                var param = leftData.property.arguments[0];
                console.log("AssignmentExpression left param", param);

                params.push(param);
                param = leftData.property.arguments[1];

                console.log("arg1 param", param);

                if(param.type == "number" || param.type == "text") {
                    params.push(param);
                }
                else if(param.type == "get_variable") {
                    var indexBlock = {};
                    var type = "calc_basic"; 
                    indexBlock.type = type;
                    var indexParams = [];
                    indexParams[0] = param;
                    indexParams[1] = "PLUS";
                    indexParams[2] = {type: "number", params: [1]};
                    indexBlock.params = indexParams;
                    params.push(indexBlock);
                }
                else if(param.type == "calc_basic") {
                    if(param.params[1] == "MINUS" && param.params[2].params[0] == "1") {
                        params.push(param.params[0]);   
                    }
                    else {
                        var indexBlock = {};
                        var type = "calc_basic"; 
                        indexBlock.type = type;
                        var indexParams = [];
                        indexParams[0] = param;
                        indexParams[1] = "PLUS";
                        indexParams[2] = {type: "number", params: [1]};
                        indexBlock.params = indexParams;
                        params.push(indexBlock);
                    }
                }
                console.log("AssignmentExpression left param", param);
            }

            if(rightData)
                params.push(rightData);

            if(params.length == 4) {
                params.splice(1,1);
            }

            structure.params = params;

        }
        else if(syntax == String("%1 = %2")) {
            console.log("AssignmentExpression calleeName check", calleeName);
            if(leftData && leftData.object && leftData.property) {
                var block = Entry.block[type];
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                console.log("assi leftData.property", leftData.property);

                if(leftData.object.name == "self") {
                    var name = leftData.property.name;
                    if(rightData.type == "number" || rightData.type == "text")
                        var value = rightData.params[0];
                    else
                        var value = 0;

                    if((value && !isNaN(value)) || value == 0) {
                        console.log("final value", value);
                        console.log("final currentObject", currentObject);


                        if(Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject)) {
                            Entry.TextCodingUtil.updateLocalVariable(name, value, this._currentObject);
                        }
                        else {
                            Entry.TextCodingUtil.createLocalVariable(name, value, this._currentObject);
                        }
                    }

                    name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                    params.push(name);
                    params.push(rightData);
                }
            }
            else {
                var block = Entry.block[type];
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                var name = leftData.name;
                if(rightData.type == "number" || rightData.type == "text")
                    var value = rightData.params[0];
                else
                    var value = 0;

                if((value && !isNaN(value)) || value == 0) {
                    console.log("final currentObject", this._currentObject);
                    console.log("final value", value);

                    if(Entry.TextCodingUtil.isGlobalVariableExisted(name, this._currentObject)) {
                        Entry.TextCodingUtil.updateGlobalVariable(name, value, this._currentObject);
                    }
                    else {
                        Entry.TextCodingUtil.createGlobalVariable(name, value, this._currentObject);
                    }
                }

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);
                if(rightData.callee)
                    delete rightData.callee;
                params.push(rightData);
            }

        }
        else if(syntax == String("%1 = %1 + %2")) {
            if(leftData && leftData.object && leftData.property) {
                if(leftData.object.name == "self") {
                    var block = Entry.block[type];
                    var paramsMeta = block.params;
                    var paramsDefMeta = block.def.params;

                    var name = leftData.property.name;
                    console.log("final currentObject", this._currentObject);

                    if(!Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject))
                        return result;

                    name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                    params.push(name);


                    console.log("assignment check operator, rightData", operator, rightData);
                    if(operator == "=") {
                        if(rightData.operator == "PLUS") { //possible
                            params.push(rightData.params[2]);
                        }
                        else if(rightData.operator == "MINUS") { //posiible
                            if(rightData.type == "calc_basic" && (rightData.params[2].type == "text" || rightData.params[2].type == "number")) {
                                rightData.params[2].params[0] = -rightData.params[2].params[0];
                                params.push(rightData.params[2]);
                            }
                            else {
                                var structure = {};

                                structure.type = "set_variable";
                                structure.params = [];
                                structure.params.push(leftData.params[0]);
                                structure.params.push(rightData);

                                result = structure;

                                console.log("ex result1", result);

                                return result;
                            }
                        }
                        else if(rightData.operator == "MULTI") {
                            var structure = {};

                            structure.type = "set_variable";
                            structure.params = [];
                            structure.params.push(leftData.params[0]);
                            structure.params.push(rightData);

                            result = structure;

                            console.log("ex result4", result);

                            return result;
                        }
                        else if(rightData.operator == "DIVIDE") {
                            var structure = {};

                            structure.type = "set_variable";
                            structure.params = [];
                            structure.params.push(leftData.params[0]);
                            structure.params.push(rightData);

                            result = structure;

                            console.log("ex result2", result);

                            return result;
                        }
                        else {
                            params.push(rightData);
                        }
                    }
                    else if(operator == "+=") { //possible
                        params.push(rightData);
                    }
                    else if(operator == "-=") { //possible
                        if(rightData.type == "text" || rightData.type == "number") {
                            rightData.params[0] = -rightData.params[0];
                            params.push(rightData);
                        }
                        else {
                            var structure = {};

                            structure.type = "set_variable";
                            structure.params = [];
                            structure.params.push(leftData.params[0]);

                            var paramBlock = {};
                            paramBlock.type = "calc_basic";
                            paramBlock.params = [];
                            paramBlock.params.push(leftData);
                            paramBlock.params.push("MINUS");
                            paramBlock.params.push(rightData);

                            structure.params.push(paramBlock);

                            result = structure;

                            console.log("ex result3", result);

                            return result;
                        }
                    }
                    else if(operator == "*=") {
                        var structure = {};

                        structure.type = "set_variable";
                        structure.params = [];
                        structure.params.push(leftData.params[0]);
                        structure.params.push(rightData);

                        result = structure;

                        console.log("ex result4", result);

                        return result;
                    }
                    else if(operator == "/=") {
                        var structure = {};

                        var structure = {};

                        structure.type = "set_variable";
                        structure.params = [];
                        structure.params.push(leftData.params[0]);

                        var paramBlock = {};
                        paramBlock.type = "calc_basic";
                        paramBlock.params = [];
                        paramBlock.params.push(leftData);
                        paramBlock.params.push("DIVIDE");
                        paramBlock.params.push(rightData);

                        structure.params.push(paramBlock);

                        result = structure;

                        console.log("ex result5", result);

                        return result;
                    }
                    else {
                        params.push(rightData);
                    }
                }
            }
            else {
                var block = Entry.block[type];
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                var name = leftData.name;

                if(!Entry.TextCodingUtil.isGlobalVariableExisted(name))
                    return result;

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);

                console.log("check 123 operator, rightData", operator, rightData);
                if(operator == "=") {
                    if(rightData.operator == "PLUS") { //possible
                        params.push(rightData.params[2]);
                    }
                    else if(rightData.operator == "MINUS") { //posiible
                        if(rightData.type == "calc_basic" && (rightData.params[2].type == "text" || rightData.params[2].type == "number")) {
                            rightData.params[2].params[0] = -rightData.params[2].params[0];
                            params.push(rightData.params[2]);
                        }
                        else {
                            var structure = {};

                            structure.type = "set_variable";
                            structure.params = [];
                            structure.params.push(leftData.params[0]);
                            structure.params.push(rightData);

                            result = structure;

                            console.log("ex result1", result);

                            return result;
                        }
                    }
                    else if(rightData.operator == "MULTI") {
                        var structure = {};

                        structure.type = "set_variable";
                        structure.params = [];
                        structure.params.push(leftData.params[0]);
                        structure.params.push(rightData);

                        result = structure;

                        console.log("ex result4", result);

                        return result;
                    }
                    else if(rightData.operator == "DIVIDE") {
                        var structure = {};

                        structure.type = "set_variable";
                        structure.params = [];
                        structure.params.push(leftData.params[0]);
                        structure.params.push(rightData);

                        result = structure;

                        console.log("ex result2", result);

                        return result;
                    }
                    else {
                        params.push(rightData);
                    }
                }
                else if(operator == "+=") { //possible
                    params.push(rightData);
                }
                else if(operator == "-=") { //possible
                    if(rightData.type == "text" || rightData.type == "number") {
                        rightData.params[0] = -rightData.params[0];
                        params.push(rightData);
                    }
                    else {
                        var structure = {};

                        structure.type = "set_variable";
                        structure.params = [];
                        structure.params.push(leftData.params[0]);

                        var paramBlock = {};
                        paramBlock.type = "calc_basic";
                        paramBlock.params = [];
                        paramBlock.params.push(leftData);
                        paramBlock.params.push("MINUS");
                        paramBlock.params.push(rightData);

                        structure.params.push(paramBlock);

                        result = structure;

                        console.log("ex result3", result);

                        return result;
                    }
                }
                else if(operator == "*=") {
                    var structure = {};

                    structure.type = "set_variable";
                    structure.params = [];
                    structure.params.push(leftData.params[0]);
                    structure.params.push(rightData);

                    result = structure;

                    console.log("ex result4", result);

                    return result;
                }
                else if(operator == "/=") {
                    var structure = {};

                    var structure = {};

                    structure.type = "set_variable";
                    structure.params = [];
                    structure.params.push(leftData.params[0]);

                    var paramBlock = {};
                    paramBlock.type = "calc_basic";
                    paramBlock.params = [];
                    paramBlock.params.push(leftData);
                    paramBlock.params.push("DIVIDE");
                    paramBlock.params.push(rightData);

                    structure.params.push(paramBlock);

                    result = structure;

                    console.log("ex result5", result);

                    return result;
                }
                else {
                    params.push(rightData);
                }
            }
        }

        structure.params = params;
        result.type = structure.type;
        result.params = structure.params;

        console.log("AssignmentExpression result", result);

        return result;
    };

    p.Literal = function(component, paramMeta, paramDefMeta, textParam) {
        console.log("Literal component", component, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta, "textParam", textParam);
        var result;
        var value = component.value;

        console.log("Literal value", value);

        if(!paramMeta) {
            var paramMeta = { type: "Block" };
            if(!paramDefMeta) {
                if(typeof value == "number")
                    var paramDefMeta = { type: "number" };
                else
                    var paramDefMeta = { type: "text" };
            }
        }

        if(paramMeta.type == "Indicator") {
            var param = null;
            result = param;
            return result;
        } else if(paramMeta.type == "Text") {
            var param = "";
            result = param;
            return result;
        }

        console.log("Literal paramMeta", paramMeta, "paramDefMeta", paramDefMeta);

        if(value == true || value == false || value)
        {
            var params = this['Param'+paramMeta.type](value, paramMeta, paramDefMeta, textParam);
            result = params;
        }
        else if(component.left && component.operator && component.right) {//If 'Literal' doesn't have value
            var params = [];
            var leftParam = this[component.left.type](component.left);
            params.push(leftParam);
            var operatorParam = component.operator;
            params.push(operatorParam);
            var rightParam = this[component.right.type](component.right);
            params.push(rightParam);

            result = params;
        }
        console.log("Literal result", result);

        return result;
    };


    p.ParamBlock = function(value, paramMeta, paramDefMeta) {
        console.log("ParamBlock value", value, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta);
        var result;
        var structure = {};

        var type;
        var param = value;
        var params = [];

        if(value === true){
            structure.type = "True";
            result = structure;
            return result;
        }
        else if(value === false) {
            structure.type = "False";
            result = structure;
            return result;
        }

        if(paramDefMeta)
            paramDefMetaType = paramDefMeta.type;
        else
            paramDefMetaType = "text";

        var paramBlock = Entry.block[paramDefMetaType];
        var paramsMeta = paramBlock.params;
        var paramsDefMeta = paramBlock.def.params;

        if(paramsMeta && paramsMeta.length != 0) {
            for(var i in paramsMeta) {
                console.log("aaa", paramsMeta[i], "bbb", paramsDefMeta[i]);
                param = this['Param'+paramsMeta[i].type](value, paramsMeta[i], paramsDefMeta[i]);
            }
        } else {
            param = value;
        }

        console.log("ParamBlock param", param);
        params.push(param);

        structure.type = paramDefMetaType;
        structure.params = params;

        result = structure;
        console.log("ParamBlock result", result);

        return result;

    };

    p.ParamAngle = function (value, paramMeta, paramDefMeta) {
        console.log("ParamAngle value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result;

        result = value;

        return result;
    };

    p.ParamTextInput = function(value, paramMeta, paramDefMeta) {
        console.log("ParamTextInput value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result;

        result = value;

        return result;
    };

    p.ParamColor = function(value, paramMeta, paramDefMeta, textParam) {
        console.log("ParamColor value, paramMeta, paramDefMeta, textParam", value, paramMeta, paramDefMeta, textParam);
        var result;

        if(textParam && textParam.codeMap) {
            var codeMap = textParam.codeMap;
            console.log("codeMap", codeMap);
            var map = eval(codeMap);
            console.log("codeMap", map);
            value = value.toLowerCase();
            console.log("codeMap value", value);
            result = map[value];
        }

        console.log("ParamColor result", result);

        return result;
    };

    p.ParamDropdown = function(value, paramMeta, paramDefMeta, textParam) {
        console.log("ParamDropdown value, paramMeta, paramDefMeta textParam", value, paramMeta, paramDefMeta, textParam);
        var result;

        var options = paramMeta.options;
        console.log("options", options);
        for(var j in options) {
            var option = options[j];
            if(value == option[1]) {
                result = option[1];
                break;
            }
        }

        if(!result)
            result = value;

        if(textParam && textParam.codeMap) {
            var codeMap = textParam.codeMap;
            console.log("codeMap", codeMap);
            var map = eval(codeMap);
            console.log("codeMap", map);
            result = result.toLowerCase();
            console.log("codeMap result", result);
            result = map[result];
        }

        console.log("ParamDropdown result", result);

        return result;
    };

    p.ParamDropdownDynamic = function(value, paramMeta, paramDefMeta) {
        console.log("ParamDropdownDynamic value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result;

        if(value == "mouse" || value == "wall" || value == "wall_up" ||
               value == "wall_down" || value == "wall_right" || value == "wall_left"){
            result = value;
            return result;
        }

        if(paramMeta) {
            var options = paramMeta.options;
            console.log("ParamDropdownDynamic options", options);
            for(var i in options) {
                if(value == options[i][0]){
                    console.log("options[i][0]", options[i][0]);
                    result = options[i][1];
                    break;
                }
                else if(value == 'mouse_pointer' || value == '마우스포인터') {
                    result = 'mouse';
                    break;
                }
            }
        }

        if(!result)
            result = Entry.TextCodingUtil.dropdownDynmaicNameToIdConvertor(value, paramMeta.menuName);


        console.log("ParamDropdownDynamic result", result);

        return result;
    };

    p.ParamKeyboard = function(value, paramMeta, paramDefMeta) {
        console.log("ParamKeyboard value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result = Entry.KeyboardCode.map[value.toLowerCase()];
        return result;
    };

    p.Indicator = function(blockParam, blockDefParam, arg) {
        var result;

        return result;
    };

    p.MemberExpression = function(component) {
        console.log("MemberExpression component", component);
        var result = {};
        var structure = {};

        var object = component.object;
        var property = component.property;

        var objectData = this[object.type](object);
        result.object = objectData;

        var propertyData = this[property.type](property);
        result.property = propertyData;

        console.log("MemberExpression objectData", objectData);
        console.log("MemberExpression propertyData", propertyData);

        if(propertyData.name == "call" && propertyData.userCode == false) {
            return result;
        }
        else {
            if(propertyData.callee == "__pythonRuntime.ops.subscriptIndex") { // List
                if(objectData.object) {
                    if(objectData.object.name == "self") {
                        var name = objectData.property.name;
                        if(!Entry.TextCodingUtil.isLocalListExisted(name, this._currentObject))
                            return result;
                    }
                }
                else {
                    var name = objectData.name;
                    if(!Entry.TextCodingUtil.isGlobalListExisted(name)) {
                        result.type = propertyData.type;
                        result.params = propertyData.params;
                        return result;
                    }
                }

                var arguments = propertyData.arguments;
                console.log("member ex args", arguments);

                var syntax = String("%2\[%4\]");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                structure.type = type;

                var block = Entry.block[type];
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);

                console.log("MemberExpression listName", listName);

                var params = [];
                params.push("");
                params.push(listName);
                params.push("");

                if(arguments[1].type == "number" || arguments[1].type == "text") {
                    if(!isNaN(arguments[1].params[0]))
                        arguments[1].params[0] += 1;
                    params.push(arguments[1]);
                }
                else if(arguments[1].type == "get_variable") {
                    var indexBlock = {};
                    var type = "calc_basic"; 
                    indexBlock.type = type;
                    var indexParams = [];
                    indexParams[0] = arguments[1];
                    indexParams[1] = "PLUS";
                    indexParams[2] = {type: "number", params: [1]};
                    indexBlock.params = indexParams;
                    params.push(indexBlock);
                }
                else if(arguments[1].type == "calc_basic") {
                    console.log("value list", arguments[1], "arguments[1].params[2].params[0]", arguments[1].params[2].params[0]);
                    if(arguments[1].params[1] == "MINUS" && arguments[1].params[2].params[0] == "1") {
                        params.push(arguments[1].params[0]);   
                    }
                    else {
                        var indexBlock = {};
                        var type = "calc_basic"; 
                        indexBlock.type = type;
                        var indexParams = [];
                        indexParams[0] = arguments[1];
                        indexParams[1] = "PLUS";
                        indexParams[2] = {type: "number", params: [1]};
                        indexBlock.params = indexParams;
                        params.push(indexBlock);
                    }
                }
                else if(!arguments[1].type) {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_DEFAULT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_DEFAULT);
                }
                    
                //params.push("");

                structure.params = params;

                result.type = structure.type;
                result.params = structure.params;


            }
            else {
                var param;
                var params = [];

                if(objectData.name == "self") {
                    var syntax = String("%1");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;

                    structure.type = type;

                    var block = Entry.block[type];
                    var paramsMeta = block.params;
                    var paramsDefMeta = block.def.params;

                    var name = propertyData.name;

                    if(!Entry.TextCodingUtil.isLocalVariableExisted(name, this._currentObject))
                        return result;

                    var convertedName = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);

                    params.push(convertedName);

                    result.type = structure.type;

                    if(params.length != 0) {
                        structure.params = params;
                        result.params = structure.params;
                    }
                }
                else {
                    return result;
                }
            }
        }

        console.log("MemberExpression result", result);

        return result;
    };

    p.WhileStatement = function(component) {
        console.log("WhileStatement component", component);
        this._blockCount++;
        console.log("WhileStatement this._blockCount++");

        var result;
        var structure = {};
        structure.statements = [];

        var test = component.test;
        console.log("WhileStatement test", test);
        var whileType = "basic";

        var condBody = component.body;

        if(test.type) {
            if(test.type == "Literal") {
                if(test.value === true) {
                    var syntax = String("while True:\n$1");
                    var blockSyntax = this.getBlockSyntax(syntax);
                    var type;
                    if(blockSyntax)
                        type = blockSyntax.key;
                }
                else {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다. \'True\' 를 사용하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = test.value;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    
                }
            }
            else if(test.type == "Identifier") {
                var syntax = String("while %1 %2\n$1");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;

                if(!Entry.TextCodingUtil.isFuncParam(test.name)) {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다. 파라미터를 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword = test.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);

                }
            }
            else {
                var syntax = String("while %1 %2:\n$1");
                var blockSyntax = this.getBlockSyntax(syntax);
                var type;
                if(blockSyntax)
                    type = blockSyntax.key;
            }
        }

        console.log("WhileStatement type", type);

        if(!type) {
            /*var error = {};
            error.title = "지원되지 않는 코드";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'while\'문의 파라미터를 확인하세요.";
            error.line = this._blockCount;
            console.log("send error", error);
            throw error;*/

            var keyword;
            Entry.TextCodingError.error(
                Entry.TextCodingError.TITLE_CONVERTING,
                Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                keyword,
                this._blockCount,
                Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        }

        var paramsMeta = Entry.block[type].params;
        console.log("WhileStatement paramsMeta", paramsMeta);

        var params = [];
        if(test.type == "Literal") {
            var arguments = [];
            arguments.push(test);
            var paramsMeta = Entry.block[type].params;
            var paramsDefMeta = Entry.block[type].def.params;
            console.log("WhileStatement paramsMeta", paramsMeta);
            console.log("WhileStatement paramsDefMeta", paramsDefMeta);

            for(var p in paramsMeta) {
                var paramType = paramsMeta[p].type;
                if(paramType == "Indicator") {
                    var pendingArg = {raw: null, type: "Literal", value: null};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
                else if(paramType == "Text") {
                    var pendingArg = {raw: "", type: "Literal", value: ""};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
            }

            console.log("WhileStatement arguments", arguments);

            for(var i in arguments) {
                var argument = arguments[i];
                console.log("WhileStatement argument", argument);

                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                console.log("WhileStatement Literal param", param);
                if(param && param != null)
                    params.push(param);
            }
        } else {
            var param = this[test.type](test);
            console.log("WhileStatement block param not True block", param);
            if(param && param != null) {
                if(test.type == "UnaryExpression" && test.operator == "!") {
                    if(param.type == "boolean_not") {
                        param = param.params[1];
                        params.push(param);
                        var option = "until";
                        params.push(option);
                    }
                }
                else {
                    console.log("WhileStatement block param not True block confirm", param);
                    params.push(param);
                    var option = "while";
                    params.push(option);
                }
            }
        }

        var statements = [];
        var body = component.body;
        var bodyData = this[body.type](body);

        console.log("WhileStatement bodyData", bodyData);

        structure.type = type;

        console.log("WhileStatement params", params);

        structure.statements.push(bodyData.data);
        structure.params = params;

        result = structure;
        console.log("WhileStatement result", result);
        return result;
    };

    p.BlockStatement = function(component) {
        console.log("BlockStatement component", component);

        var result = {};
        result.statements = [];
        result.data = [];

        var params = [];
        var statements = [];
        var data = [];

        var bodies = component.body;
        console.log("BlockStatement bodies", bodies);

        if(bodies[1] && bodies[1].consequent && bodies[1].consequent.body && bodies[1].consequent.body[0])
            if(bodies[1].consequent.body[0].type == "ForStatement") {
                this._blockCount++;
                console.log("BlockCount ForStatement in BlockStatement", this._blockCount);
            }

        for(var i in bodies) {
            var body = bodies[i];
            var bodyData = this[body.type](body);
            console.log("BlockStatement bodyData", bodyData);

            if(bodyData && bodyData == null)
                continue;

            data.push(bodyData);
            console.log("BlockStatement data", data);
        }

        console.log("BlockStatement final data", data);

        result.data = data;

        console.log("jhlee data check", data);

        //The Optimized Code
        for(var d in data) {
            if(data[1] && data[1].type == "repeat_basic") {
                if(d == 0 && data[d]) {
                    if(data[d].declarations) {
                        var declarations = data[0].declarations;
                        for(var d in declarations){
                            var declaration = declarations[d];
                            var param = declaration.init;
                            console.log("ppp param", param);
                            if(param) {
                                if(param.params && param.params[0])
                                {
                                    if(param.type == "number" || param.type == "text") {
                                        var subParam = param.params[0];

                                        console.log("param kekeke", param);
                                        if(param.callee == "__pythonRuntime.functions.range") {
                                            if(typeof subParam == "object") {
                                                if(typeof subParam.name == "string") {
                                                    if(Entry.TextCodingUtil.isFuncParam(subParam.name)) {
                                                        var oParam = {};
                                                        oParam.type = subParam.name;
                                                        oParam.params = [];
                                                        oParam.isParamFromFunc = true;

                                                        param = oParam;
                                                        console.log("range func param", param);
                                                    }
                                                }
                                            }
                                            params.push(param);
                                        }
                                    } else {
                                        console.log("ttt param1", param);
                                        params.push(param);
                                    }
                                } else {
                                    console.log("ttt param2", param);
                                    params.push(param);
                                }
                            }
                        }
                        result.params = params;
                    }
                }
                else if (d == 1) {
                    result.type = data[d].type;
                    var statements = [];
                    var allStatements = data[d].statements[0]; //Consequent Data of "IF" Statement
                    if(allStatements && allStatements.length != 0) {
                        for(var i in allStatements) {
                            var statement = allStatements[i];
                            console.log("BlockStatement(for) statement", statement);
                            if(!statement)
                                continue;

                            console.log("statement1 type", statement.type);
                            if(statement.type) {
                                if(Entry.TextCodingUtil.isJudgementBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.isCalculationBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.isMaterialBlock(statement.type)) {
                                    continue;
                                }
                                statements.push(statement);
                            } else {
                                if(statement.callee) {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + statement.callee.name + "\'" + "을 제거하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = statement.callee.name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                                }
                                else {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + statement.name + "\'" + "을 제거하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                                }
                            }
                        }
                    }

                    console.log("BlockStatement(for) statements", statements);

                    result.statements.push(statements);
                }
            }
            else {
                if(data) {
                    if(d == 0) {
                        if(data[d] && data[d].declarations) {
                            console.log("statement2 declarations", data[d]);
                            var declarations = data[d].declarations;
                            for(var d in declarations){
                                var declaration = declarations[d];
                                var param = declaration.init;
                                if(param)
                                    params.push(param);
                            }
                        } else {
                            var statement = data[d];
                            if(statement && statement.type) {
                                console.log("statement2 type", statement.type);
                                if(Entry.TextCodingUtil.isJudgementBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.isCalculationBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.isMaterialBlock(statement.type)) {
                                    continue;
                                }
                                statements.push(statement);
                            }
                        }
                    }
                    else {
                        var statements = [];
                        var allStatements = data;
                        if(allStatements && allStatements.length != 0) {
                            for(i in allStatements) {
                                var statement = allStatements[i];
                                console.log("BlockStatement statement", statement);
                                if(statement && statement.type){
                                    console.log("statement3 type", statement.type);
                                    if(Entry.TextCodingUtil.isJudgementBlock(statement.type)) {
                                        continue;
                                    }
                                    else if(Entry.TextCodingUtil.isCalculationBlock(statement.type)) {
                                        continue;
                                    }
                                    else if(Entry.TextCodingUtil.isMaterialBlock(statement.type)) {
                                        continue;
                                    }
                                    statements.push(statement);
                                }
                            }
                        }

                        console.log("BlockStatement statements", statements);
                    }
                    result.params = params;
                    result.statements = statements;
                }
            }
        }

        //////////////////////////////////////////////////////////////////////
        //Second Backup Code
        //////////////////////////////////////////////////////////////////////
        /*if(data[0] && data[0].declarations && data[1]) {
            result.type = data[1].type;
            var declarations = data[0].declarations;
            for(var d in declarations){
                var declaration = declarations[d];
                var param = declaration.init;
                if(param)
                    params.push(param);
            }
            result.params = params;
            var statements = []
            var allStatements = data[1].statements[0];
            console.log("BlockStatement allStatements", allStatements);
            if(allStatements && allStatements.length != 0) {
                for(var i in allStatements) {
                    var statement = allStatements[i];
                    console.log("BlockStatement statement", statement);
                    if(statement.type)
                        statements.push(statement);
                }
            }
            console.log("BlockStatement statements", statements);
            result.statements.push(statements);

        }*/



        console.log("BlockStatement statement result", result);
        return result;


    };

    p.IfStatement = function(component) {
        console.log("IfStatement component", component);
        var result;
        var structure = {};
        structure.statements = [];

        var type;
        var params = [];

        var consequent = component.consequent;
        var alternate = component.alternate;
        var test = component.test;

        if(alternate != null) {
            var type = String("if_else");
        } else {
            var type = String("_if");
        }

        structure.type = type;

        console.log("IfStatement type", type);
        console.log("IfStatement test", test);


        if(test.type == "Literal" || test.type == "Identifier") {
            var arguments = [];
            arguments.push(test);
            var paramsMeta = Entry.block[type].params;
            var paramsDefMeta = Entry.block[type].def.params;
            console.log("IfStatement paramsMeta", paramsMeta);
            console.log("IfStatement paramsDefMeta", paramsDefMeta);

            for(var p in paramsMeta) {
                var paramType = paramsMeta[p].type;
                if(paramType == "Indicator") {
                    var pendingArg = {raw: null, type: "Literal", value: null};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
                else if(paramType == "Text") {
                    var pendingArg = {raw: "", type: "Literal", value: ""};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
            }

            for(var i in arguments) {
                var argument = arguments[i];
                console.log("IfStatement argument", argument);

                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                console.log("IfStatement Literal param", param);
                if(param && param != null) {
                    params.push(param);

                    if(!param.type) {
                        if(!Entry.TextCodingUtil.isFuncParam(param.name)) {
                            /*var error = {};
                            error.title = "지원되지 않는 코드";
                            error.message = "블록으로 변환될 수 없는 코드입니다. \'True\' 또는 \'False\'를 사용하세요.";
                            error.line = this._blockCount;
                            console.log("send error", error);
                            throw error;*/

                            var keyword = param.name;
                            Entry.TextCodingError.error(
                                Entry.TextCodingError.TITLE_CONVERTING,
                                Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                                keyword,
                                this._blockCount,
                                Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                        }
                    }
                }
            }
        } else {
            var param = this[test.type](test);
            console.log("IfStatement Not Literal param", param);
            if(param && param != null)
                params.push(param);
        }

        if(params && params.length != 0) {
            structure.params = params;
        }


        console.log("IfStatement params result", params);

        if(consequent != null) {
            if(test.operator !== 'instanceof') {
                this._blockCount++;
                console.log("BlockCount IfStatement If", this._blockCount);
            }

            var consStmts = [];
            console.log("IfStatement consequent", consequent);
            var consequents = this[consequent.type](consequent);

            console.log("IfStatement consequent data", consequents);
            var consequentsData = consequents.data;
            console.log("IfStatement consequentsData", consequentsData);
            for(var i in consequentsData) {
                var consData = consequentsData[i];
                console.log("IfStatement consData", consData);
                if(consData) {
                    if(consData.init && consData.type) { //ForStatement Block
                        structure.type = consData.type; //ForStatement Type

                        var consStatements = consData.statements;
                        if(consStatements) { //ForStatement Statements
                            consStmts = consStatements;
                        }
                    }
                    else if(!consData.init && consData.type) { //IfStatement Block
                        consStmts.push(consData); //IfStatement Statements
                    }
                }
            }

            if(consStmts.length != 0)
                structure.statements[0] = consStmts;
        }

        if(alternate != null) {
            if(test.operator !== 'instanceof') {
                this._blockCount++;
                console.log("BlockCount IfStatement Else", this._blockCount);
            }
            var altStmts = [];
            console.log("IfStatement alternate", alternate);
            var alternates = this[alternate.type](alternate);

            console.log("IfStatement alternate data", alternates);
            var alternatesData = alternates.data;
            for(var i in alternatesData) {
                var altData = alternatesData[i];
                if(altData && altData.type) {
                    altStmts.push(altData);
                }
            }
            if(altStmts.length != 0)
                structure.statements[1] = altStmts;
        }

        result = structure;
        console.log("IfStatement result", result);
        return result;
    };

     p.ForStatement = function(component) {
        console.log("ForStatement component", component);
        var result;
        var structure = {};
        structure.statements = [];

        var syntax = String("for i in range");
        var blockSyntax = this.getBlockSyntax(syntax);
        var type;
        if(blockSyntax)
            type = blockSyntax.key;

        structure.type = type;

        var init = component.init;

        if(init)
            var initData = this[init.type](init);
        structure.init = initData;

        console.log("ForStatement init", init);

        var bodies = component.body.body;
        console.log("ForStatement bodies", bodies);
        if(bodies) {
            for(var i in bodies) {
                if(i != 0) { // "i == 0" is conditional statement of "For" Statement
                    var bodyData = bodies[i];
                    console.log("ForStatement bodyData", bodyData, "index", i);
                    var stmtData = this[bodyData.type](bodyData);
                    console.log("ForStatement bodyData result", stmtData, "index", i);
                    structure.statements.push(stmtData);
                }
            }
        }

        console.log("ForStatement bodyData result", structure);

        var test = component.test;
        if(test)
            var testData = this[test.type](test);
        console.log("for test", testData);
        structure.test = testData;

        console.log("ForStatement testData", testData);

        var update = component.update;
        if(update)
            var updateData = this[update.type](update);
        structure.update = updateData;

        console.log("ForStatement updateData", updateData);

        result = structure;

        console.log("ForStatement result", result);

        return result;
    };

    p.ForInStatement = function(component) {
        console.log("ForInStatement component", component);

        var result;
        var data = {};

        data = null;

        result = data;

        console.log("ForInStatement result", result);
        return result;
    };


    p.BreakStatement = function(component) {
        console.log("BreakStatement component", component);
        this._blockCount++;
        console.log("BreakStatement this._blockCount++");

        var result;
        var structure = {};

        var syntax = String("break");
        var blockSyntax = this.getBlockSyntax(syntax);
        var type;
        if(blockSyntax)
            type = blockSyntax.key;

        console.log("BreakStatement type", type);

        structure.type = type;
        result = structure;

        console.log("BreakStatement result", result);
        return result;
    };

    p.UnaryExpression = function(component) {
        console.log("UnaryExpression component", component);
        var result;
        var data;
        var structure = {};

        if(component.prefix){
            var type;
            var syntax;
            var operator = component.operator;
            var argument = component.argument;

            switch(operator){
                case "-":
                    operator = operator;
                    break;
                case "+":
                    operator = operator;
                    break;
                case "!":
                    operator = operator;
                    type = "boolean_not";
                    break;
                case "~":
                    var keyword = operator;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    break;
                case "typeof":
                    var keyword = operator;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    break;
                case "void":
                    var keyword = operator;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    break;
                case "delete":
                    var keyword = operator;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    break;
                default:
                    operator = operator;
                    var keyword = operator;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                    break;
            }

            console.log("UnaryExpression type", type);
            console.log("UnaryExpression operator", operator);
            var params = [];
            if(operator == "+" || operator == "-") {
                if(argument.value >= 0)
                    argument.value = operator + argument.value;

                console.log("UnaryExpression argument", argument);
                var value = this[argument.type](argument);
                data = value;
                console.log("UnaryExpression data", data);
                structure.data = data;
                structure.params = data;
                result = structure.params;
            }
            else if(operator == "!") {
                if(argument.type == "Literal" || argument.type == "Identifier") {
                    var arguments = [];
                    arguments.push(argument);
                    var paramsMeta = Entry.block[type].params;
                    var paramsDefMeta = Entry.block[type].def.params;
                    console.log("UnaryExpression paramsMeta", paramsMeta);
                    console.log("UnaryExpression paramsDefMeta", paramsDefMeta);

                    for(var p in paramsMeta) {
                        var paramType = paramsMeta[p].type;
                        if(paramType == "Indicator") {
                            var pendingArg = {raw: null, type: "Literal", value: null};
                            if(p < arguments.length)
                                arguments.splice(p, 0, pendingArg);
                        }
                        else if(paramType == "Text") {
                            var pendingArg = {raw: "", type: "Literal", value: ""};
                            if(p < arguments.length)
                                arguments.splice(p, 0, pendingArg);
                        }
                    }

                    for(var i in arguments) {
                        var argument = arguments[i];
                        console.log("UnaryExpression argument", argument);

                        var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                        console.log("UnaryExpression param", param);
                        if(param && param != null) {
                            params.push(param);
                            params.splice(0, 0, "");
                            params.splice(2, 0, "");

                        }
                    }
                } else {
                    param = this[argument.type](argument);
                    if(param) {
                        params.push(param);
                        params.splice(0, 0, "");
                        params.splice(2, 0, "");
                    }
                }
                structure.type = type;
                structure.params = params;
                result = structure;
            }
        }

        console.log("syntax", syntax);
        console.log("type", type);

        console.log("UnaryExpression result", result);

        return result;
    };

    p.LogicalExpression = function(component) {
        console.log("LogicalExpression component", component);
        var result;
        var structure = {};

        var operator = String(component.operator);

        switch(operator){
            case '&&':
                var syntax = String("(%1 and %3)");
                break;
            case '||':
                var syntax = String("(%1 or %3)");
                break;
            default:
                var syntax = String("(%1 and %3)");
                break;
        }

        var blockSyntax = this.getBlockSyntax(syntax);
        var type;
        if(blockSyntax)
            type = blockSyntax.key;

        var params = [];
        var left = component.left;

        if(left.type == "Literal" || left.type == "Identifier") {
            var arguments = [];
            arguments.push(left);
            var paramsMeta = Entry.block[type].params;
            var paramsDefMeta = Entry.block[type].def.params;
            console.log("LogicalExpression paramsMeta", paramsMeta);
            console.log("LogicalExpression paramsDefMeta", paramsDefMeta);

            for(var p in paramsMeta) {
                var paramType = paramsMeta[p].type;
                if(paramType == "Indicator") {
                    var pendingArg = {raw: null, type: "Literal", value: null};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
                else if(paramType == "Text") {
                    var pendingArg = {raw: "", type: "Literal", value: ""};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
            }

            for(var i in arguments) {
                var argument = arguments[i];
                console.log("LogicalExpression argument", argument);

                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                console.log("LogicalExpression param", param);
                if(param && param != null)
                    params.push(param);
            }
        } else {
            param = this[left.type](left);
            if(param)
                params.push(param);
        }
        console.log("LogicalExpression left param", param);

        if(!param.type && param.name) {
            if(!Entry.TextCodingUtil.isFuncParam(param.name)) {
                /*var error = {};
                error.title = "지원되지 않는 코드";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + "을 수정하세요";
                error.line = this._blockCount;
                console.log("send error", error);
                throw error;*/

                var keyword = param.name;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
            }
        }

        operator = String(component.operator);
        console.log("LogicalExpression operator", operator);
        if(operator) {
            operator = Entry.TextCodingUtil.logicalExpressionConvert(operator);
            param = operator;
            params.push(param);
        }

        var right = component.right;

        if(right.type == "Literal" || right.type == "Identifier") {
            var arguments = [];
            arguments.push(right);
            var paramsMeta = Entry.block[type].params;
            var paramsDefMeta = Entry.block[type].def.params;
            console.log("LogicalExpression paramsMeta", paramsMeta);
            console.log("LogicalExpression paramsDefMeta", paramsDefMeta);

            for(var p in paramsMeta) {
                var paramType = paramsMeta[p].type;
                if(paramType == "Indicator") {
                    var pendingArg = {raw: null, type: "Literal", value: null};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
                else if(paramType == "Text") {
                    var pendingArg = {raw: "", type: "Literal", value: ""};
                    if(p < arguments.length)
                        arguments.splice(p, 0, pendingArg);
                }
            }

            for(var i in arguments) {
                var argument = arguments[i];
                console.log("LogicalExpression argument", argument);

                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                console.log("LogicalExpression param", param);
                if(param && param != null)
                    params.push(param);
            }
        } else {
            param = this[right.type](right);
            if(param)
                params.push(param);
        }

        console.log("LogicalExpression right param", param);

        if(!param.type && param.name) {
            /*var error = {};
            error.title = "지원되지 않는 코드";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + "을 수정하세요";
            error.line = this._blockCount;
            console.log("send error", error);
            throw error;*/

            var keyword = param.name;
            Entry.TextCodingError.error(
                Entry.TextCodingError.TITLE_CONVERTING,
                Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                keyword,
                this._blockCount,
                Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        }

        structure.type = type;
        structure.params = params;

        result = structure;

        console.log("LogicalExpression result", result);

        return result;
    };

    p.BinaryExpression = function(component) {
        console.log("BinaryExpression component", component);

        var result = {};
        var structure = {};

        var operator = String(component.operator);

        switch(operator){
            case "==":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case "!=":
                var syntax = String("not (%2)");
                break;
            case "===":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case "!==":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "<":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case "<=":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case ">":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case ">=":
                var syntax = String("(%1 %2 %3)#boolean_basic_operator");
                break;
            case "<<":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case ">>":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case ">>>":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "+":
                var syntax = String("(%1 %2 %3)#calc_basic");
                break;
            case "-":
                var syntax = String("(%1 %2 %3)#calc_basic");
                break;
            case "*":
                var syntax = String("(%1 %2 %3)#calc_basic");
                break;
            case "/":
                var syntax = String("(%1 %2 %3)#calc_basic");
                break;
            case "%":
                var syntax = String("(%2 % %4)");
                break;
                break;
            case "|":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "^":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "|":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "&":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "in":
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
            case "instanceof":
                //used in BlockStatement
                break;
            default:
                var keyword = operator;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                    keyword,
                    this._blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                break;
        }

        console.log("BinaryExpression operator", operator);
        console.log("BinaryExpression syntax", syntax);

        var blockSyntax = this.getBlockSyntax(syntax);
        var type;
        if(blockSyntax)
            type = blockSyntax.key;

        if(type) {
            console.log("BinaryExpression type", type);
            var params = [];
            var left = component.left;

            console.log("BinaryExpression left", left);

            if(left.type == "Literal" || left.type == "Identifier") {
                var arguments = [];
                arguments.push(left);
                var paramsMeta = Entry.block[type].params;
                var paramsDefMeta = Entry.block[type].def.params;
                console.log("BinaryExpression paramsMeta", paramsMeta);
                console.log("BinaryExpression paramsDefMeta", paramsDefMeta);

                for(var p in paramsMeta) {
                    var paramType = paramsMeta[p].type;
                    if(paramType == "Indicator") {
                        var pendingArg = {raw: null, type: "Literal", value: null};
                        if(p < arguments.length)
                            arguments.splice(p, 0, pendingArg);
                    }
                    else if(paramType == "Text") {
                        var pendingArg = {raw: "", type: "Literal", value: ""};
                        if(p < arguments.length)
                            arguments.splice(p, 0, pendingArg);
                    }
                }

                for(var i in arguments) {
                    var argument = arguments[i];
                    console.log("BinaryExpression argument", argument);

                    var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                    console.log("BinaryExpression param", param);
                    console.log("check binary", typeof param, "$", param.type, "$", param.isCallParam);

                    if(param && typeof param == "object") {
                        if(param.name && param.name.indexOf("__filbert") < 0) {
                            if(!Entry.TextCodingUtil.isFuncParam(param.name)) {
                                if(!Entry.TextCodingUtil.isEntryEventDesignatedParamName(param.name)) {
                                    if(!Entry.TextCodingUtil.isGlobalVariableExisted(param.name)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = param.name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_LIST);
                                    }
                                }
                            }
                        }
                    }

                    if(param && param.type)
                        params.push(param);
                    /*else {
                        if(param.name == "key") {
                            var keyBlock = {};
                            keyBlock.type = "get_variable";
                            var keyParams = [];
                            keyParams.push(param.name);
                            keyBlock.params = keyParams;

                            params.push(keyBlock);
                        }
                        else if(param.name == "signal") {
                            var keyBlock = {};
                            keyBlock.type = "get_variable";
                            var keyParams = [];
                            keyParams.push(param.name);
                            keyBlock.params = keyParams;

                            params.push(keyBlock);
                        }
                    }*/
                }
            }
            else if(left.type == "MemberExpression") {
                param = this[left.type](left);
                console.log("BinaryExpression extra left param", param);
                if(param && param.type) {
                    params.push(param);
                }
                else if(param.object && param.property) {
                    if(param.property.callee == "__pythonRuntime.ops.subscriptIndex") { // In Case of List
                        if(param.object && param.object.object) {
                            if(param.object.object.name != "self") { // Not Self List
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.object.name + "\'" + " 객체 리스트는 지원하지 않습니다.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/
                                var keyword = param.object.object.name; 
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);
                            }
                            else if(param.object.property) { // Self List
                                if(!Entry.TextCodingUtil.isLocalListExisted(param.object.property.name, this._currentObject)) {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.property.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = param.object.property.name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);
                                }
                            }
                        }
                        else if(param.object) { // List
                            if(!Entry.TextCodingUtil.isGlobalListExisted(param.object.name)) {
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/

                                var keyword = param.object.name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);
                            }
                        }
                    }
                    else { // In Case of Variable
                        if(param.object) {
                            if(param.object.name.indexOf("__filbert") < 0) {
                                if(param.object.name != "self") {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 객체 변수는 지원하지 않습니다.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = param.object.name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                                }
                                else if(param.property) {
                                    if(!Entry.TextCodingUtil.isLocalVariableExisted(param.property.name, this._currentObject)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.property.name + "\'" + "변수를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = param.property.name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                                    }
                                }
                            }
                        }
                    }

                    if(param.object.name.indexOf("__filbert") < 0) {
                        var paramBlock = {};
                        paramBlock.type = "text";
                        var textParams = [];
                        textParams.push(param.object.name + "." + param.property.name);
                        paramBlock.params = textParams;

                        params.push(paramBlock);
                    }
                }
            }
            else {
                param = this[left.type](left);
                console.log("BinaryExpression extra left param", param);
                if(param.type) {
                    params.push(param);
                }
                else {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "올바른 파라미터 값 또는 타입으로 변경하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_DEFAULT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_DEFAULT);
                }

            }
            console.log("BinaryExpression left params", params);

            if(type == "boolean_not") {
                params.splice(0, 0, "");
                params.splice(2, 0, "");

                console.log("BinaryExpression boolean_not params", params);
                structure.type = type;
                structure.params = params;

                result = structure;

                return result;
            }

            operator = String(component.operator);
            if(operator) {
                console.log("BinaryExpression operator", operator);
                //operator = Entry.TextCodingUtil.binaryOperatorConvert(operator);
                if(operator != '%') {
                    var textParam = blockSyntax.textParams[1];
                    console.log("textParam", textParam);
                    if(textParam.converter)
                        param = textParam.converter(null, operator);
                    else
                        param = operator;
                    if(param)
                        params.push(param);
                }

                structure.operator = operator;
            }

            var right = component.right;

            if(right.type == "Literal" || right.type == "Identifier") {
                var arguments = [];
                arguments.push(right);
                var paramsMeta = Entry.block[type].params;
                var paramsDefMeta = Entry.block[type].def.params;
                console.log("BinaryExpression paramsMeta", paramsMeta);
                console.log("BinaryExpression paramsDefMeta", paramsDefMeta);

                for(var p in paramsMeta) {
                    var paramType = paramsMeta[p].type;
                    if(paramType == "Indicator") {
                        var pendingArg = {raw: null, type: "Literal", value: null};
                        if(p < arguments.length)
                            arguments.splice(p, 0, pendingArg);
                    }
                    else if(paramType == "Text") {
                        var pendingArg = {raw: "", type: "Literal", value: ""};
                        if(p < arguments.length)
                            arguments.splice(p, 0, pendingArg);
                    }
                }

                for(var i in arguments) {
                    var argument = arguments[i];
                    console.log("BinaryExpression argument", argument);

                    var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                    console.log("BinaryExpression param", param);
                    if(param && typeof param == "object") {
                        if(param.name && param.name.indexOf("__filbert") < 0) {
                            if(!param.type && param.isCallParam) {
                                if(!Entry.TextCodingUtil.isFuncParam(param.name)) {
                                    if(!Entry.TextCodingUtil.isGlobalVariableExisted(param.property.name)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "해당 변수나 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = param.property.name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                                    }
                                }
                            }
                        }
                        params.push(param);
                    }
                }
            }
            else if(right.type == "MemberExpression") {
                param = this[right.type](right);
                console.log("BinaryExpression extra left param", param);
                if(param && param.type) {
                    params.push(param);
                }
                else if(param.object && param.property) {
                    if(param.property.callee == "__pythonRuntime.ops.subscriptIndex") { // In Case of List
                        if(param.object.object) {
                            if(param.object.object.name != "self") { // Object Name
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.object.name + "\'" + " 객체 리스트는 지원하지 않습니다.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/

                                var keyword = param.object.object.name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                            }
                            else if(param.object.property) { // List Name
                                if(!Entry.TextCodingUtil.isLocalListExisted(param.object.property.name, this._currentObject)) {
                                    /*var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.property.name + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = param.object.property.name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_LIST);
                                }
                            }
                        }
                        else if(param.object.name) { // List
                            var objectName = param.object.name;

                            if(!Entry.TextCodingUtil.isGlobalListExisted(objectName)) {
                                /*var error = {};
                                error.title = "지원되지 않는 코드";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + objectName + "\'" + " 리스트를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                error.line = this._blockCount;
                                console.log("send error", error);
                                throw error;*/

                                var keyword = param.object.name;
                                Entry.TextCodingError.error(
                                    Entry.TextCodingError.TITLE_CONVERTING,
                                    Entry.TextCodingError.MESSAGE_CONV_NO_LIST,
                                    keyword,
                                    this._blockCount,
                                    Entry.TextCodingError.SUBJECT_CONV_LIST);
                            }
                        }
                    }
                    else { // In Case of Variable
                        if(param.object) {
                            if(param.object.name.indexOf("__filbert") < 0) {
                                if(param.object.name != "self") {
                                   /* var error = {};
                                    error.title = "지원되지 않는 코드";
                                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.object.name + "\'" + " 객체 변수는 지원하지 않습니다.";
                                    error.line = this._blockCount;
                                    console.log("send error", error);
                                    throw error;*/

                                    var keyword = param.object.name;
                                    Entry.TextCodingError.error(
                                        Entry.TextCodingError.TITLE_CONVERTING,
                                        Entry.TextCodingError.MESSAGE_CONV_NO_OBJECT,
                                        keyword,
                                        this._blockCount,
                                        Entry.TextCodingError.SUBJECT_CONV_OBJECT);
                                }
                                else if(param.property) {
                                    if(!Entry.TextCodingUtil.isLocalVariableExisted(param.property.name, this._currentObject)) {
                                        /*var error = {};
                                        error.title = "지원되지 않는 코드";
                                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.property.name + "\'" + "변수를 생성하거나 올바른 파라미터 값 또는 타입으로 변경하세요.";
                                        error.line = this._blockCount;
                                        console.log("send error", error);
                                        throw error;*/

                                        var keyword = param.property.name;
                                        Entry.TextCodingError.error(
                                            Entry.TextCodingError.TITLE_CONVERTING,
                                            Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                                            keyword,
                                            this._blockCount,
                                            Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                                    }
                                }
                            }
                        }
                    }

                    if(param.object.name.indexOf("__filbert") < 0) {
                        var paramBlock = {};
                        paramBlock.type = "text";
                        var textParams = [];
                        textParams.push(param.object.name + "." + param.property.name);
                        paramBlock.params = textParams;

                        params.push(paramBlock);
                    }
                }
            }
            else {
                param = this[right.type](right);
                console.log("BinaryExpression extra right param", param);
                if(param && param.type) {
                    params.push(param);
                }
                else {
                    /*var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "올바른 파라미터 값 또는 타입으로 변경하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;*/

                    var keyword;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
                        keyword,
                        this._blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_GENERAL);
                }
            }
            console.log("BinaryExpression right param", param);

            /*if(syntax == "not (%2)") {
                params = [];
                params[0] = "";
                params[1] = this[left.type](left, paramsMeta[1], paramsDefMeta[1], true);
                params[2] = "";
            }
            else */if(syntax == "(%2 % %4)") {
                tempParams = [];
                tempParams[1] = params[0];
                tempParams[3] = params[1];
                tempParams[5] = "MOD";
                params = tempParams;
            }

            structure.type = type;
            structure.params = params;
        } else {
            return result;
        }

        console.log("BinaryExpression params", params);
        //result = { type: blockType, params: params };

        result = structure;

        console.log("BinaryExpression result", result);
        return result;
    };



    p.UpdateExpression = function(component) {
        console.log("UpdateExpression", component);
        var result;
        var data = {};

        var argument = component.argument;
        if(argument)
            var argumentData = this[argument.type](argument);
        data.argument = argumentData;

        var operator = component.operator;
        data.operator = operator;

        var prefix = component.prefix;
        data.prefix = prefix;

        result = data;

        console.log("UpdateExpression result", result);
        return result;
    };

    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration component", component);
        var result = {};

        var body = component.body;
        var id = component.id;

        if(id.name == "__getParam0") {
            return result;
        }

        this._blockCount++;
        console.log("BlockCount FunctionDeclaration", this._blockCount);

        var bodyData = this[body.type](body);
        console.log("FunctionDeclaration bodyData", bodyData);

        if(id.type == "Identifier")
            var idData = this[id.type](id);

        console.log("FunctionDeclaration idData", idData);

        var textFuncName;
        var textFuncParams = [];
        var textFuncStatements = [];

        textFuncName = idData.name;

        var funcBodyData = bodyData.data;
        console.log("funcBodyData", funcBodyData);
        for(var i in funcBodyData) {
            if(funcBodyData[i].declarations) {
                var declarations = funcBodyData[i].declarations;
                if(declarations.length > 0) {
                    textFuncParams.push(declarations[0].name);
                }
            }
            else if(funcBodyData[i].argument) {
                var argument = funcBodyData[i].argument;
                var statements = argument.statements;
                if(statements && statements.length > 0) {
                    var cleansedStmt = [];
                    for(var s in statements) {
                        var stmt = statements[s];
                        if(stmt) {
                            cleansedStmt.push(stmt);
                        }

                    }
                    textFuncStatements = cleansedStmt;
                }
            }
        }

        console.log("FunctionDeclaration textFuncName", textFuncName);
        console.log("FunctionDeclaration textFuncParams", textFuncParams);
        console.log("FunctionDeclaration textFuncStatements", textFuncStatements);


        //In case of Entry Event Function
        if(Entry.TextCodingUtil.isEntryEventFuncName(id.name)) {
            if(textFuncParams.length != 0) {
                var arg = textFuncParams[0];
                arg = arg.replace(/_space_/g, " ");
                console.log("event arg", arg);
                if(arg == "none")
                    arg = "None";
                var param = arg;
            }
            var component = Entry.TextCodingUtil.makeExpressionStatementForEntryEvent(id.name, param);
            var entryEventBlock = this.ExpressionStatement(component);

            this._thread.push(entryEventBlock);

            console.log("entry event block", entryEventBlock);

            /*if(Entry.TextCodingUtil.isEntryEventFuncTypeWithParam(block)) {
                var ifStatement = textFuncStatements[0];

                if(textFuncStatements.length > 1) {
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다1." + "\'if\'문을 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;
                }
                else if(!ifStatement) {
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다2." + "\'if\'문을 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;
                }
                else if(ifStatement.type != "_if") {
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다3." + "\'if\'문을 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;
                }
                else if(ifStatement.params[0].type != "boolean_basic_operator") {
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다4." + "\'if\'문을 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;
                }

                console.log("entry event block ifStatement", ifStatement);
                console.log("entry event block ifStatement param detail", ifStatement.params[0].params[1]);


                var ifStatementParams = ifStatement.params[0];

                var ifStatementParamsType = ifStatementParams.params[0].params[0];
                var ifStatementParamsValue = ifStatementParams.params[2].params[0]
                if(ifStatementParamsType == "key") {
                    var keyCodeValue = ifStatementParamsValue;
                    if(typeof ifStatementParamsValue == "string")
                        keyCodeValue = ifStatementParamsValue.toLowerCase();

                    console.log("keyCodeValue", keyCodeValue)
                    var value = Entry.KeyboardCode.keyCharToCode[keyCodeValue];
                    block.params.push(null);
                    block.params.push(value);
                }
                else if(ifStatementParamsType == "signal") {
                    var signalValue = ifStatementParamsValue;

                    console.log("signalValue", signalValue);

                    var targetBlock = Entry.block[block.type];

                    var paramsMeta = targetBlock.params;
                    var paramsDefMeta = targetBlock.def.params;

                    var value = this.ParamDropdownDynamic(signalValue, paramsMeta[1], paramsDefMeta[1]);
                    block.params.push(null);
                    block.params.push(value);
                }
                else {
                    var error = {};
                    error.title = "지원되지 않는 코드";
                    error.message = "블록으로 변환될 수 없는 코드입니다5." + "\'if\'문을 확인하세요.";
                    error.line = this._blockCount;
                    console.log("send error", error);
                    throw error;
                }

                var ifStatementStatements = ifStatement.statements[0];

                console.log("ifStatementStatements", ifStatementStatements);
                for(var t in ifStatementStatements) {
                    var tfs = ifStatementStatements[t];
                    var sblock = {};
                    sblock.type = tfs.type;
                    if(tfs.params)
                        sblock.params = tfs.params;
                    if(tfs.statements)
                        sblock.statements = tfs.statements;

                    this._thread.push(sblock);
                }
            }*/

            for(var t in textFuncStatements) {
                var tfs = textFuncStatements[t];
                var sblock = {};
                sblock.type = tfs.type;
                if(tfs.params)
                    sblock.params = tfs.params;
                if(tfs.statements)
                    sblock.statements = tfs.statements;

                this._thread.push(sblock);
            }

            return null;
        }

        ////////////////////////////////////////////////////////////////
        //First, Find The Function Block
        ////////////////////////////////////////////////////////////////
        var foundFlag;
        var matchFlag;
        var targetFuncId;
        var paramMap = {};
        var paramInfo = {};
        var entryFunctions = Entry.variableContainer.functions_;
        for(var funcId in entryFunctions) {
            var blockFunc = entryFunctions[funcId];
            Entry.TextCodingUtil.initQueue();
            Entry.TextCodingUtil.gatherFuncDefParam(blockFunc.content._data[0]._data[0].data.params[0]);
            console.log("Entry.TextCodingUtil._funcParamQ", Entry.TextCodingUtil._funcParamQ);
            var funcParams = [];

            paramMap = {};
            paramInfo = {};

            while(param = Entry.TextCodingUtil._funcParamQ.dequeue()) {
                funcParams.push(param);
                console.log("param", param);
            }
            console.log("funcParams", funcParams);
            for(var p in funcParams) {
                var funcParam = funcParams[p];
                paramMap[funcParam] = p;
                paramInfo[textFuncParams[p]] = funcParam;
            }

            console.log("paramMap", paramMap);
            console.log("funcNameQueue", Entry.TextCodingUtil._funcNameQ);
            var funcNames = [];
            while(nameToken = Entry.TextCodingUtil._funcNameQ.dequeue()) {
                funcNames.push(nameToken);
                console.log("funcNames", nameToken);
            }
            Entry.TextCodingUtil.clearQueue();

            blockFuncName = funcNames.join('__').trim();
            console.log("first blockFuncName", blockFuncName);
            console.log("first textFuncName", textFuncName);

            if(textFuncName == blockFuncName) {
                console.log("textFuncName", textFuncName);
                console.log("blockFuncName", blockFuncName);
                console.log("textFuncParams.length", textFuncParams.length);
                console.log("Object.keys(paramMap).length", Object.keys(paramMap).length);
                if(textFuncParams.length == Object.keys(paramMap).length) {
                    foundFlag = true;

                    console.log("textFuncParams.length", textFuncParams.length);
                    console.log("Object.keys(paramMap).length", Object.keys(paramMap).length);
                    var funcThread = blockFunc.content._data[0]; //The Function Thread, index 0
                    var blockFuncContents = funcThread._data; //The Function Definition Block, index 0
                    var blockFuncDef = blockFuncContents[0];
                    var blockFuncCts = blockFuncContents.slice();
                    blockFuncCts.shift();
                    console.log("blockFuncContents", blockFuncContents);

                    console.log("paramMap", paramMap);

                    matchFlag = Entry.TextCodingUtil.isFuncContentsMatch(blockFuncCts, textFuncStatements, paramMap, paramInfo);

                }
                else {
                    foundFlag = false;
                    matchFlag = false;
                }

                // Final Decision In Terms of Conditions
                if(foundFlag && matchFlag) {
                    var funcPrefix = "func";
                    targetFuncId = funcPrefix.concat('_').concat(funcId);
                    //foundFlag = true;
                    break;
                } else if(foundFlag && !matchFlag) {
                    //var funcPrefix = "func";
                    targetFuncId = funcId;
                    break;
                }
            }
        }

        console.log("FunctionDeclaration foundFlag", foundFlag);
        console.log("FunctionDeclaration matchFlag", matchFlag);

        if(foundFlag && matchFlag) {
            console.log("targetFuncId", targetFuncId);
            var name = textFuncName;
            var paramCount = textFuncParams.length;
            var funcKey = name + paramCount;
            this._funcMap.put(funcKey, targetFuncId);
            console.log("FunctionDeclaration this._funcMap", this._funcMap);

            result = targetFuncId;
        }
        else if (foundFlag && !matchFlag) {
            console.log("this is function changed...");
            var targetFunc = Entry.variableContainer.functions_[targetFuncId];
            var thread = targetFunc.content._data[0];
            thread._data.splice(1, thread._data.length-1);

            console.log("paramInfo", paramInfo);
            if(textFuncStatements.length > 0) {
                for(var s in textFuncStatements) {
                    var statement = textFuncStatements[s];
                    Entry.TextCodingUtil.makeParamBlock(statement, paramInfo);
                    console.log("textFunction statement", statement);
                    var stmtBlock = new Entry.Block(statement, thread);
                    thread._data.push(stmtBlock);
                }
            }

            Entry.variableContainer.saveFunction(targetFunc);
            Entry.variableContainer.updateList();

            result = targetFuncId;

            console.log("textFuncName", textFuncName);

            var name = textFuncName;
            var paramCount = textFuncParams.length;
            var funcKey = name + paramCount;
            var funcId = targetFuncId;
            var funcPrefix = "func";
            targetFuncId = funcPrefix.concat('_').concat(funcId);
            this._funcMap.put(funcKey, targetFuncId);

            console.log("FunctionDeclaration result", result);

        }
        else {
            ////////////////////////////////////////////////////////////////
            //If Not Exist, Create New Function Block
            ////////////////////////////////////////////////////////////////

            console.log("FunctionDeclaration textFuncName", textFuncName);
            console.log("FunctionDeclaration textFuncParams", textFuncParams);
            console.log("FunctionDeclaration textFuncStatements", textFuncStatements);

            // Func Create
            var newFunc = new Entry.Func();
            newFunc.generateBlock(true);


            console.log("FunctionDeclaration newFunc before", newFunc);
            var templateArr = [];

            for(var i = 1; i <= textFuncParams.length+1; i++)
                templateArr.push('%'+i);

            // Func Name
            newFunc.block.template = textFuncName + ' ' + templateArr.join(' ');
            console.log("newFunc template", newFunc.block.template);

            var thread = newFunc.content._data[0];
            var newFuncDefParamBlock = thread._data[0].data.params[0];
            var newFuncDefParams = newFuncDefParamBlock.data.params;
            newFunc.description = '';

            // inject block func name
            // func name join
            var textFuncNameTokens = textFuncName.split('!@#$');
            if(textFuncNameTokens.length > 1) {
                for(var n = 1; n < textFuncNameTokens.length; n++) {
                    var token = textFuncNameTokens[n];
                    var nameFieldBlock = new Entry.Block({ type: "function_field_label" }, thread);
                    nameFieldBlock.data.params = [];
                    nameFieldBlock.data.params.push(token);
                    var lastParam = Entry.TextCodingUtil.getLastParam(newFuncDefParamBlock);
                    lastParam.data.params[1] = nameFieldBlock;
                    newFunc.description += token.concat(' ');
                }

                newFunc.description += ' ';
            }
            else
            {
                newFuncDefParams[0] = textFuncName;
                newFunc.description = textFuncName + ' ';
            }

            if(textFuncParams.length > 0) {
                var paramFieldBlock = new Entry.Block({ type: "function_field_string" }, thread);
                paramFieldBlock.data.params = [];
                var stringParam = Entry.Func.requestParamBlock("string");
                console.log("FunctionDeclaration stringParam", stringParam);
                var param = new Entry.Block({ type: stringParam }, thread);
                paramFieldBlock.data.params.push(param);

                //newFuncDefParams[1] = paramFieldBlock;
                var lastParam = Entry.TextCodingUtil.getLastParam(newFuncDefParamBlock);
                lastParam.data.params[1] = paramFieldBlock;

                newFunc.paramMap[stringParam] = Number(0);
                console.log("FunctionDeclaration paramBlock", newFunc);

                paramInfo = {};
                console.log("textFuncParams ppp", textFuncParams[p]);
                paramInfo[textFuncParams[0]] = stringParam;

            for(var p = 1; p < textFuncParams.length; p++) {
                    var paramFieldBlock = new Entry.Block({ type: "function_field_string" }, thread);
                    paramFieldBlock.data.params = [];

                    var stringParam = Entry.Func.requestParamBlock("string");
                    console.log("FunctionDeclaration stringParam", stringParam);
                    var param = new Entry.Block({ type: stringParam }, thread);
                    paramFieldBlock.data.params.push(param);

                    var paramBlock = Entry.TextCodingUtil.searchFuncDefParam(newFuncDefParams[1]);
                    console.log("FunctionDeclaration paramBlock", paramBlock);
                    if(paramBlock.data.params.length == 0)
                        paramBlock.data.params[0] = param;
                    else if(paramBlock.data.params.length == 1)
                        paramBlock.data.params[1] = paramFieldBlock;

                    newFunc.paramMap[stringParam] = Number(p);
                    console.log("textFuncParams ppp", textFuncParams[p]);
                    paramInfo[textFuncParams[p]] = stringParam;
                    console.log("FunctionDeclaration paramBlock", newFunc);
                }
            }

            if(textFuncStatements.length > 0) {
                for(var s in textFuncStatements) {
                    var statement = textFuncStatements[s];
                    console.log("paramInfo yyyyy", paramInfo);
                    Entry.TextCodingUtil.makeParamBlock(statement, paramInfo);
                    var stmtBlock = new Entry.Block(statement, thread);
                    thread._data.push(stmtBlock);
                }
            }

            Entry.Func.generateWsBlock(newFunc);
            Entry.variableContainer.saveFunction(newFunc);
            Entry.variableContainer.updateList();

            var name = textFuncName;
            var paramCount = textFuncParams.length;
            var funcKey = name + paramCount;
            var funcId = newFunc.id;
            var funcPrefix = "func";
            targetFuncId = funcPrefix.concat('_').concat(funcId);
            this._funcMap.put(funcKey, targetFuncId);
            console.log("FunctionDeclaration newFunc after", newFunc);

        }

        Entry.TextCodingUtil.clearFuncParam();

        console.log("FunctionDeclaration result", result);
        //return result;
    };

    p.FunctionExpression = function(component) {
        console.log("FunctionExpression component", component);
        var result = {};

        var body = component.body;
        var bodyData = this[body.type](body);

        console.log("FunctionExpression bodyData", bodyData);

        if(bodyData.data && bodyData.data.length != 0)
            result.statements = bodyData.data;
        else
            result.statements = bodyData.statements;

        console.log("FunctionExpression result", result);
        return result;
    };

    p.ReturnStatement = function(component) {
        console.log("ReturnStatement component", component);
        var result = {};

        var argument = component.argument;
        if(argument)
            var argumentData = this[argument.type](argument);

        if(argumentData)
            result.argument = argumentData;

        console.log("ReturnStaement result", result);
        return result;
    };

    p.ThisExpression = function(component) {
        console.log("ThisExpression component", component);
        var result = {};

        var userCode = component.userCode;
        if(userCode)
            result.userCode = userCode;

        console.log("ThisExpression result", result);
        return result;
    };

    p.NewExpression = function(component) {
        console.log("NewExpression component", component);
        var result = {};

        var callee = component.callee;
        var calleeData = this[callee.type](callee);

        var arguments = component.arguments;
        var args = [];
        for(var i in arguments) {
            var argument = arguments[i];
            console.log("NewExpression argument", argument);

            var arg = this[argument.type](argument);
            args.push(arg);
        }

        result.callee = calleeData;
        result.arguments = args;

        console.log("NewExpression result", result);
        return result;
    };

    p.getBlockSyntax = function(syntax) {
        console.log("why syntax", syntax);
        if (!syntax)
            return null;
        syntax = syntax.split(".");

        var syntaxTokens = [];
        syntaxTokens.push(syntax.shift());
        var restSyntax = syntax.join('.');
        if(restSyntax != '')
            syntaxTokens.push(restSyntax);
        syntax = syntaxTokens;

        var blockSyntax = this.blockSyntax;
        while (syntax.length) {
            var key = syntax.shift();
            blockSyntax = blockSyntax[key];
            if (!blockSyntax) return null;
        }
        if (!blockSyntax)
            return null;
        else if (typeof blockSyntax === "string")
            return blockSyntax;
        else
            return blockSyntax;
    };

    p.getParamIndex = function(syntax) {
        var result = {};
        var blockSyntax = this.getBlockSyntax(syntax);
        var fullSyntax = blockSyntax.syntax;
        var paramReg = /(%.)/mi;
        var paramTokens = fullSyntax.split(paramReg);

        var index = 0;
        for(var i in paramTokens) {
            var paramToken = paramTokens[i];
            if(paramReg.test(paramToken)) {
                var paramIndex = paramToken.split('%')[1];
                result[index++] = Number(paramIndex)-1;
            }
        }

        console.log("getParamIndex result", result);
        return result;
    }

    ///////////////////////////////////////////////////////////
    //Not Yet Used Syntax
    ///////////////////////////////////////////////////////////

    p.RegExp = function(component) {
        console.log("RegExp", component);
        var result;

        result = component;

        console.log("RegExp result", result);

        //Convertin Error Control
        var keyword = "RegExp";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.Function = function(component) {
        console.log("Function component", component);
        var result;

        result = component;

        console.log("Function result", result);

        //Convertin Error Control
        var keyword = "Function";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.EmptyStatement = function(component) {
        console.log("EmptyStatement component", component);
        var result;

        result = component;

        console.log("EmptyStatement result", result);

        //Convertin Error Control
        var keyword = "EmptyStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.DebuggerStatement = function(component) { 
        console.log("DebuggerStatement component", component);
        var result;

        result = component;

        console.log("DebuggerStatement result", result);

        //Convertin Error Control
        var keyword = "DebuggerStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.WithStatement = function(component) {
        console.log("WithStatement component", component);
        var result;

        result = component;

        console.log("WithStatement result", result);

        //Convertin Error Control
        var keyword = "WithStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.LabeledStatement = function(component) {
        console.log("LabeledStatement component", component);
        var result;

        result = component;

        console.log("LabeledStatement result", result);

        //Convertin Error Control
        var keyword = "LabeledStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.ContinueStatement = function(component) {
        console.log("ContinueStatement component", component);
        var result;

        result = component;

        console.log("ContinueStatement result", result);

        //Convertin Error Control
        var keyword = "ContinueStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.SwitchStatement = function(component) {
        console.log("SwitchStatement component", component);
        var result;

        result = component;

        console.log("SwitchStatement result", result);

        //Convertin Error Control
        var keyword = "SwitchStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.SwitchCase = function(component) {
        console.log("SwitchCase component", component);
        var result;

        result = component;

        console.log("SwitchCase result", result);

        //Convertin Error Control
        var keyword = "SwitchCase";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.ThrowStatement = function(component) {
        console.log("ThrowStatement component", component);
        var result;

        result = component;

        console.log("ThrowStatement result", result);

        //Convertin Error Control
        var keyword = "ThrowStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.TryStatement = function(component) {
        console.log("TryStatement component", component);
        var result;

        result = component;

        console.log("TryStatement result", result);

        //Convertin Error Control
        var keyword = "TryStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.CatchClause = function(component) {
        console.log("CatchClause component", component);
        var result;

        result = component;

        console.log("CatchClause result", result);

        //Convertin Error Control
        var keyword = "CatchClause";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.DoWhileStatement = function(component) {
        console.log("DoWhileStatement component", component);
        var result;

        result = component;

        console.log("DoWhileStatement result", result);

        //Convertin Error Control
        var keyword = "DoWhileStatement";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.ArrayExpression = function(component) {
        console.log("ArrayExpression component", component);
        var result;

        result = component;

        console.log("ArrayExpression result", result);

        //Convertin Error Control
        var keyword = "ArrayExpression";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.ObjectExpression = function(component) {
        console.log("ObjectExpression component", component);
        var result;

        result = component;

        console.log("ObjectExpression result", result);

        //Convertin Error Control
        var keyword = "ObjectExpression";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.Property = function(component) {
        console.log("Property component", component);
        var result;

        result = component;

        console.log("Property result", result);

        //Convertin Error Control
        var keyword = "Property";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.ConditionalExpression = function(component) {
        console.log("ConditionalExpression component", component);
        var result;

        result = component;

        console.log("ConditionalExpression result", result);

        //Convertin Error Control
        var keyword = "ConditionalExpression";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

        return result;
    };

    p.SequenceExpression = function(component) {
        console.log("SequenceExpression component", component);
        var result;

        result = component;

        console.log("SequenceExpression result", result);

        //Convertin Error Control
        var keyword = "SequenceExpression";
        Entry.TextCodingError.error(
            Entry.TextCodingError.TITLE_CONVERTING,
            Entry.TextCodingError.MESSAGE_CONV_NO_SUPPORT,
            keyword,
            this._blockCount,
            Entry.TextCodingError.SUBJECT_CONV_GENERAL);
        //Converting Error Control

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

})(Entry.PyToBlockParser.prototype);
