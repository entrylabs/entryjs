/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.Map");
goog.require("Entry.Queue");

Entry.PyToBlockParser = function(blockSyntax) { 
    this.blockSyntax = blockSyntax;
    this._blockStatmentIndex = 0;
    this._blockStatments = [];

    var variableMap = new Entry.Map();
    this._variableMap = variableMap;

    var funcMap = new Entry.Map();
    this._funcMap = funcMap;

    var paramQ = new Entry.Queue();
    this._paramQ = paramQ;

    this._threadCount = 0;
    this._blockCount = 0;
};

(function(p){
    p.Program = function(astArr) { 
        console.log("this.syntax", this.blockSyntax);
        try {
            var code = [];
            
            this._threadCount = 0;
            this._blockCount = 0;
            for(var index in astArr) { 
                if(astArr[index].type != 'Program') return;
                this._threadCount++;
                var thread = []; 
                var nodes = astArr[index].body;

                console.log("nodes", nodes);

                for(var index in nodes) {
                    
                    var node = nodes[index];
                    console.log("Program node", node);
                                    
                    var block = this[node.type](node);
                    console.log("result block", block); 
                    console.log("this._block")

                    if(block && block.type) {
                        console.log("block.type", block.type);
                        if(Entry.TextCodingUtil.prototype.isJudgementBlock(block.type)) {
                            continue;
                        }
                        else if(Entry.TextCodingUtil.prototype.isCalculationBlock(block.type)) {
                            continue;
                        }
                        else if(Entry.TextCodingUtil.prototype.isMaterialBlock(block.type)) {
                            continue;
                        }

                        thread.push(block); 
                    } 
                }

                console.log("thread", thread);
                if(thread.length != 0)
                    code.push(thread);    
            }
            return code;
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
        this._blockCount++;
        console.log("ExpressionStatement blockCount++");
        var reusult;
        var structure = {};

        var expression = component.expression;
        
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
            var error = {};
            error.title = "블록변환(Converting) 오류";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + result.name + "\'" + "을 삭제하세요.";
            error.line = this._blockCount; 
            console.log("send error", error); 
            throw error;   
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

        if(callee.type == "Identifier") {
            console.log("CallExpression Identifier calleeData", calleeData);
            result.callee = calleeData; 
    
            name = Entry.TextCodingUtil.prototype.eventBlockSyntaxFilter(calleeData.name);
            type = this.getBlockType(name);

            console.log("bb type", type);

            if(!type) {
                if(calleeData.name && arguments.length != 0 && arguments[0].type == "Literal") {
                    console.log("callex error calleeData", calleeData);
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다. \'range()\'를 사용하세요.";
                    error.line = this._blockCount; 
                    console.log("send error", error);
                    throw error;
                }
            }
        }
        else {
            var object = calleeData.object;
            var property = calleeData.property;

            if(object.statements && property.name == "call" && property.userCode == false)
            {
                var statements = object.statements;
                console.log("CallExpression statement", statements);
                result.statements = statements;
            } else if(object.name) {
                var calleeName = String(object.name).concat('.').concat(String(property.name));
            } else if(object.object.name) {
                var calleeName = String(object.object.name).concat('.')
                                .concat(String(object.property.name))
                                .concat('.').concat(String(property.name));
            } else {
                var calleeName = null;
            }

            console.log("CallExpression calleeName", calleeName);

            type = this.getBlockType(calleeName);

            console.log("CallExpression type before", type);

            if(calleeName)
                var calleeTokens = calleeName.split('.');
            
            console.log("CallExpression calleeTokens", calleeTokens);
            
            if(calleeName == "__pythonRuntime.functions.range"){
                var syntax = String("%1number#");
                type = this.getBlockType(syntax);
            }
            else if(calleeName == "__pythonRuntime.ops.add") {
                var syntax = String("(%1 %2calc_basic# %3)");
                type = this.getBlockType(syntax);

                argumentData = {raw:"PLUS", type:"Literal", value:"PLUS"};
                console.log("arguments geniuse", arguments);
                if(arguments.length == 2)
                    arguments.splice(1, 0, argumentData);

                result.operator = "PLUS";
            }
            else if(calleeName == "__pythonRuntime.ops.multiply") {
                var syntax = String("(%1 %2calc_basic# %3)");
                type = this.getBlockType(syntax);
        
                argumentData = {raw:"MULTI", type:"Literal", value:"MULTI"};
                if(arguments.length == 2)
                    arguments.splice(1, 0, argumentData); 

                result.operator = "MULTI";
            } 
            else if(calleeName == "__pythonRuntime.ops.in") {
                var syntax = String("%4 in %2");
                type = this.getBlockType(syntax);   
            }
            else if(calleeName == "__pythonRuntime.functions.len") {
                var syntax = String("len");
                type = this.getBlockType(syntax);
            } 
            else if((callee.object.type == "Identifier" && calleeTokens[1] == "append") ||
                (callee.object.type == "MemberExpression" && calleeTokens[0] == "self" && calleeTokens[2] == "append")) {
                var syntax = String("%2.append");
                type = this.getBlockType(syntax);   
            }
            else if((callee.object.type == "Identifier" && calleeTokens[1] == "insert") || 
                (callee.object.type == "MemberExpression" && calleeTokens[0] == "self" && calleeTokens[2] == "insert")) {
                var syntax = String("%2.insert");
                type = this.getBlockType(syntax);  
            }
            else if((callee.object.type == "Identifier" && calleeTokens[1] == "pop") || 
                (callee.object.type == "MemberExpression" && calleeTokens[0] == "self" && calleeTokens[2] == "pop")) {
                var syntax = String("%2.pop");
                type = this.getBlockType(syntax);   
            }

            if(!type) {
                if(calleeData.object.name) {
                    console.log("callex error calleeData", calleeData);
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다. 변환가능한 함수를 사용하세요.";
                    error.line = this._blockCount; 
                    console.log("send error", error);
                    throw error;
                } 
            }

            result.callee = calleeName;
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

            console.log("CallExpression arguments", arguments); 

            for(var i in arguments) { 
                var argument = arguments[i];
                
                if(argument) {
                    console.log("CallExpression argument", argument, "typeof", typeof argument);
                    var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                    console.log("CallExpression param", param);
                    
                    if(param === undefined) {
                        var error = {};
                        error.title = "블록변환(Converting) 오류";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + argument.value + "\'" + " 을 올바른 파라미터 값 또는 타입으로 변경하세요.";
                        error.line = this._blockCount; 
                        console.log("send error", error); 
                        throw error;
                    } 

                    if(param != null && param.name && (typeof param.name != 'function')) {
                        console.log("babo");
                        if(calleeName == '__pythonRuntime.functions.range')
                            this._blockCount++;
                        console.log("callex error calleeData", calleeData);
                        var error = {};
                        error.title = "블록변환(Converting) 오류";
                        error.message = "블록으로 변환될 수 없는 코드입니다." + " \'" + param.name + "\'' 을 올바른 파라미터 값 또는 타입으로 변경하세요.";
                        error.line = this._blockCount; 
                        console.log("send error", error);
                        throw error;
                    }
                } else {
                    continue;
                }

                if(calleeName == "__pythonRuntime.functions.range" && param.type) {
                    type = param.type;
                    params = param.params;
                } else {
                    params.push(param);
                }                              
            } 

            console.log("CallExpression syntax", syntax);
            console.log("CallExpression argument params", params);

            if(syntax == String("%2.append") || syntax == String("%2.pop")) {
                if(calleeTokens[0] == "self") {
                    var object = Entry.playground.object;
                    var name = calleeTokens[1];
                    if(!Entry.TextCodingUtil.prototype.isLocalListExisted(name, object))
                        return result;
                }
                else {
                    var name = calleeTokens[0];
                    if(!Entry.TextCodingUtil.prototype.isGlobalListExisted(name))
                        return result;
                }

                console.log("CallExpression append calleeData", calleeData);
                var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);
                console.log("CallExpression listName", listName);
                params.push(listName);
                console.log("CallExpression params[0]", params[0]);
                if(syntax == String("%2.pop")) {
                    if(params[0].type == "number")
                        params[0].params[0] += 1;
                    else if(params[0].type == "text") {
                        params[0].params[0] = String(Number(params[0].params[0]) + 1);
                    }   
                }
            } else if(syntax == String("%2.insert")) {
                if(calleeTokens[0] == "self") {
                    var object = Entry.playground.object;
                    var name = calleeTokens[1];
                    if(!Entry.TextCodingUtil.prototype.isLocalListExisted(name, object))
                        return result;
                }
                else {
                    var name = calleeTokens[0];
                    if(!Entry.TextCodingUtil.prototype.isGlobalListExisted(name))
                        return result;
                }

                console.log("CallExpression insert params", params);

                params.pop();
                console.log("CallExpression append calleeData", calleeData);
                var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);
                console.log("CallExpression listName", listName);
                params.splice(0, 0, listName);
                console.log("CallExpression check arguments", arguments);

                console.log("CallExpression arguments[1] 2", arguments[1]);
                var param = this[arguments[1].type](arguments[1], paramsMeta[2], paramsDefMeta[2], true);
                console.log("CallExpression check param", param);


                params.splice(0, 0, param);
                console.log("CallExpression insert params", params);
                if(params[2].type == "number")
                    params[2].params[0] += 1;
                else if(params[2].type == "text") {
                    params[2].params[0] = String(Number(params[2].params[0]) + 1);
                }
            } else if(syntax == String("len")) {
                var listName = this.ParamDropdownDynamic(params[1].name, paramsMeta[1], paramsDefMeta[1]);
                delete params[1];
                params[1] = listName;
            } else if(syntax == String("%4 in %2")) {
                var argument = component.arguments[1];
                var param = this[argument.type](argument, paramsMeta[3], paramsDefMeta[3], true);
                var listName = component.arguments[3].name;
                listName = this.ParamDropdownDynamic(listName, paramsMeta[1], paramsDefMeta[1]);
                params = [];
                params.push("");
                params.push(listName);
                params.push("");
                params.push(param);
                params.push("");
            }
             
            if(type) {
                structure.type = type; 
                result.type = structure.type;
            }

            if(params) {
                structure.params = params;
                result.params = structure.params;
            }   
        } else { // Function Arguments
            var args = [];
            for(var i in arguments) { 
                var argument = arguments[i];
                console.log("CallExpression argument", argument, "typeof", typeof argument);
                
                var argumentData = this[argument.type](argument);
                console.log("CallExpression argumentData", argumentData);
               
                if(argumentData.callee == "__pythonRuntime.utils.createParamsObj")
                    args = argumentData.arguments;
                else 
                    args.push(argumentData);
                                              
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
            if(result.arguments)
                var idNumber = result.arguments.length;
            else
                var idNumber = 0;
            var funcKey = result.callee.name + idNumber;
            console.log("funcKey", funcKey);
            var type = this._funcMap.get(funcKey);
            if(type) {
                result = {};
                result.type = type;
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
        
        var syntax = String("%1");
        var type = this.getBlockType(syntax);

        if(type) {
            structure.type = type;
            var name = component.name;
            var block = Entry.block[type]; 
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params; 

            if(!Entry.TextCodingUtil.prototype.isGlobalVariableExisted(name))
                return result;
            
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
        /*var existed = false;
        var variableFlag = true;*/

        var id = component.id;
        var init = component.init;

        // This is Function-Related Param
        if(id.name == "__params0" || id.name == "__formalsIndex0" || id.name == "__args0")
            return undefined;

        // This is Function-Related Param
        if(init.callee && init.callee.name == "__getParam0") {
            result.name = id.name;
        
            return result;
        }

        /*if(id.name.includes('__filbert'))
            return undefined;*/


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
        
        if(calleeName == "__pythonRuntime.objects.list") { 
            var idData = this[id.type](id);
            console.log("VariableDeclarator idData", idData);
            result.id = idData;

            var initData = this[init.type](init);
            console.log("VariableDeclarator initData", initData);
            result.init = initData;

            var name = id.name;
            
            var array = [];
            var arguments = initData.arguments; 
            for(var a in arguments) {
                var argument = arguments[a];
                var item = {};
                item.data = String(argument.params[0]);
                array.push(item);
            }

            if(Entry.TextCodingUtil.prototype.isGlobalListExisted(name)) {
                Entry.TextCodingUtil.prototype.updateGlobalList(name, array);
            } 
            else {
                Entry.TextCodingUtil.prototype.createGlobalList(name, array);
            }
        } else { 
            var name = id.name;
            if(init.type == "Literal") {
                var value = init.value;
            } 
            else if(init.type == "Identifier") {
                var value = init.name;
            }
            else {
                var value = NaN;
            } 

            console.log("variable name", name, "value", value);

            if(value && value != NaN) {
                if(!name.includes('__filbert')) {
                    if(Entry.TextCodingUtil.prototype.isGlobalVariableExisted(name)) {
                        Entry.TextCodingUtil.prototype.updateGlobalVariable(name, value);
                    } 
                    else {
                        Entry.TextCodingUtil.prototype.createGlobalVariable(name, value);
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
                var type = this.getBlockType(syntax);
                structure.type = type;
                
            } 
            else {
                if(initData.params && initData.params[0] && initData.params[0].name && (idData.name == initData.params[0].name)) {
                    console.log("VariableDeclarator idData.name", idData.name, "initData.params[0].name", initData.params[0].name);
                    var syntax = String("%1 += %2");
                    var type = this.getBlockType(syntax);
                    structure.type = type; 
                    

                    if(initData.operator != "PLUS") 
                        return result;
                    
                } else {
                    var syntax = String("%1 = %2");
                    var type = this.getBlockType(syntax);
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
                params.push(initData);
            }
            else {
                console.log("VariableDeclarator idData", idData, "initData", initData);
                if(initData.params && initData.params[0] && (idData.name == initData.params[0].name)) {
                    console.log("in initData.params[0]");
                    if(idData.params && idData.params[0])
                        params.push(idData.params[0]); 
                    else
                        params.push(variableId); 
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

    p.Literal = function(component, paramMeta, paramDefMeta, aflag) {
        console.log("Literal component", component, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta, "aflag", aflag);
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

        if(component.value != null) {
            var params = this['Param'+paramMeta.type](value, paramMeta, paramDefMeta);
            console.log("Literal param", param);
            result = params;
        } else {
            // If 'Literal' doesn't have value
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
        
        var paramBlock = Entry.block[paramDefMeta.type];
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

        structure.type = paramDefMeta.type;
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

    p.ParamColor = function(value, paramMeta, paramDefMeta) {
        console.log("ParamColor value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result;
        
        result = value;
        
        console.log("ParamColor result", result);

        return result; 
    };

    p.ParamDropdown = function(value, paramMeta, paramDefMeta) {
        console.log("ParamDropdown value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
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
        if(result)
            result = String(result);
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
            
        var options = paramMeta.options;
        console.log("ParamDropdownDynamic options", options);
        for(var i in options) {
            if(value == options[i][0]){
                console.log("options[i][0]", options[i][0]);
                result = options[i][1];
                break;
            }
        }
        
        if(result)
            result = String(result);
        
        console.log("ParamDropdownDynamic result", result);

        return result;
    };

    p.ParamKeyboard = function(value, paramMeta, paramDefMeta) {
        console.log("ParamKeyboard value, paramMeta, paramDefMeta", value, paramMeta, paramDefMeta);
        var result;

        result = Entry.KeyboardCode.prototype.keyCharToCode[value];
        console.log("ParamKeyboard result", result);
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
        else if(propertyData.callee == "__pythonRuntime.ops.subscriptIndex") {
            var object = Entry.playground.object;
            if(objectData.object && objectData.object.name == "self") {
                var name = objectData.property.name;
                if(!Entry.TextCodingUtil.prototype.isLocalListExisted(name, object))
                    return result;
            }
            else {
                var name = objectData.name;
                if(!Entry.TextCodingUtil.prototype.isGlobalListExisted(name))
                    return result;
            }
            var syntax = String("%2\[%4\]");
            var type = this.getBlockType(syntax);
            structure.type = type;

            var arguments = propertyData.arguments;

            var block = Entry.block[type]; 
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params;

            

            var listName = this.ParamDropdownDynamic(name, paramsMeta[1], paramsDefMeta[1]);

            console.log("MemberExpression listName", listName);

            var params = [];
            params.push("");
            params.push(listName);
            params.push("");
            if(arguments[0].type == "number") {
                arguments[0].params[0] += 1;
            }
            else if(arguments[0].type == "text") {
                arguments[0].params[0] = String(Number(arguments[0].params[0]) + 1);
            }
                        
            params.push(arguments[0]);
            params.push("");

            structure.params = params;
            
            
            result.type = structure.type;
            result.params = structure.params;

        }
        else {
            var param;
            var params = [];

            if(object.name == "self") {
                var syntax = String("%1");
                var type = this.getBlockType(syntax);

                structure.type = type;

                var block = Entry.block[type]; 
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;
            
                var name = property.name;

                var object = Entry.playground.object;
                if(!Entry.TextCodingUtil.prototype.isLocalVariableExisted(name, object))
                    return result;
                
                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);

                params.push(name);

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


        console.log("MemberExpression result", result);

        return result;
    };
    
    p.WhileStatement = function(component) {
        console.log("WhileStatement component", component);
        this._blockCount++;
        console.log("WhileStatement blockCount++");
        var result;
        var structure = {};
        structure.statements = [];
        
        var test = component.test;
        console.log("WhileStatement test", test);
        var whileType = "basic";

        var condBody = component.body;
        if(test.value === true) {
            if(condBody && condBody.body && condBody.body[0].type == "IfStatement") {
                var ifStatement = condBody.body[0];
                var cons = ifStatement.consequent;
                var ifTest = ifStatement.test;
                if(ifTest && ifTest.operator == "!" && cons && cons.body && cons.body.length == 1 && cons.body[0].type == "BreakStatement") {
                    var syntax = String("while %1 %2\n$1");
                    var type = this.getBlockType(syntax);
                    whileType = "while";
                }
                else if(ifTest && cons && cons.body && cons.body.length == 1 && cons.body[0].type == "BreakStatement") {
                    var syntax = String("while %1 %2\n$1");
                    var type = this.getBlockType(syntax);
                    whileType = "until";
                }
                else {
                    var syntax = String("while True:\n$1");
                    var type = this.getBlockType(syntax);
                }
            } else {
                var syntax = String("while True:\n$1");
                var type = this.getBlockType(syntax);
            }
        }

        console.log("while type", type);
        /*else if(test.operator == "!=") {
            var syntax = String("while %1 %2\n$1");
            var type = this.getBlockType(syntax);
        } 
        else if(test.operator == "==") {
            var syntax = String("while %1 %2\n$1");
            var type = this.getBlockType(syntax);
        }*/

        if(test.type == "Identifier") {
            var error = {};
            error.title = "블록변환(Converting) 오류";
            error.message = "블록으로 변환될 수 없는 코드입니다. \'True\' 를 사용하세요.";
            error.line = this._blockCount; 
            console.log("send error", error); 
            throw error;     
        } 

        console.log("WhileStatement type", type);

        if(!type) {
            var error = {};
            error.title = "블록변환(Converting) 오류";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'while\'문의 파라미터를 확인하세요.";
            error.line = this._blockCount; 
            console.log("send error", error); 
            throw error; 
        }

        var paramsMeta = Entry.block[type].params;
        console.log("WhileStatement paramsMeta", paramsMeta);
                
        var params = [];
        if(test.type == "Literal" || test.type == "Identifier" || test.type == "BinaryExpression") {
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
            console.log("WhileStatement Not Literal param", param);
            if(param && param != null)
                params.push(param);       
        }   
                
        var statements = [];
        var body = component.body;
        var bodyData = this[body.type](body);

        console.log("WhileStatement bodyData", bodyData);

        structure.type = type;
        if(type == "repeat_while_true") {
            if(whileType == "until") {
                if(bodyData.data && bodyData.data[0]) {
                    var ifStmt = bodyData.data[0];
                    var param = ifStmt.params[0];
                    params = [];
                    params.push(param);
                    var option = "until";
                    params.push(option);
                }


            }
            else if(whileType == "while") {
                if(bodyData.data && bodyData.data[0]) {
                    var ifStmt = bodyData.data[0];
                    var param = ifStmt.params[0].params[1];

                    params = [];
                    params.push(param);
                    var option = "while";
                    params.push(option); 
                }
            }
            bodyData.statements.shift();
        } 

        console.log("WhileStatement params", params);
        
        structure.statements.push(bodyData.statements);
        structure.params = params;
        
        result = structure;
        
        console.log("WhileStatement result", result); 
        return result;
    };

    p.BlockStatement = function(component) { 
        console.log("BlockStatement component", component);
        if(component.body && component.body.length != 0 && 
            component.body[0].declarations && 
            component.body[0].declarations[0].init &&
            component.body[0].declarations[0].init.callee &&
            component.body[0].declarations[0].init.callee.name) {
            this._blockCount++;
            console.log("BlockStatement blockCount++");
        }
        
        var result = {};
        result.statements = [];
        result.data = [];

        var params = [];
        var statements = [];
        var data = [];

        var bodies = component.body;
        console.log("BlockStatement bodies", bodies);

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
                if(d == 0) {
                    if(data[d].declarations) {
                        var declarations = data[0].declarations;
                        for(var d in declarations){
                            var declaration = declarations[d];
                            var param = declaration.init;
                            if(param)
                                params.push(param);
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
                            if(statement.type) {
                                if(Entry.TextCodingUtil.prototype.isJudgementBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.prototype.isCalculationBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.prototype.isMaterialBlock(statement.type)) {
                                    continue;
                                }
                                statements.push(statement);
                            } else {
                                var error = {};
                                error.title = "블록변환(Converting) 오류";
                                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + statement.name + "\'" + "을 제거하세요.";
                                error.line = this._blockCount; 
                                console.log("send error", error); 
                                throw error;   
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
                            var declarations = data[d].declarations;
                            for(var d in declarations){
                                var declaration = declarations[d];
                                var param = declaration.init;
                                if(param)
                                    params.push(param);
                            }
                            result.params = params;
                        } else {
                            var statement = data[d];
                            if(statement && statement.type) {
                                console.log("statement2 type", statement.type);
                                if(Entry.TextCodingUtil.prototype.isJudgementBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.prototype.isCalculationBlock(statement.type)) {
                                    continue;
                                }
                                else if(Entry.TextCodingUtil.prototype.isMaterialBlock(statement.type)) {
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
                                    if(Entry.TextCodingUtil.prototype.isJudgementBlock(statement.type)) {
                                        continue;
                                    }
                                    else if(Entry.TextCodingUtil.prototype.isCalculationBlock(statement.type)) {
                                        continue;
                                    }
                                    else if(Entry.TextCodingUtil.prototype.isMaterialBlock(statement.type)) {
                                        continue;
                                    }
                                    statements.push(statement);
                                }
                            }
                        }

                        console.log("BlockStatement statements", statements); 
                    }
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

        


        if(test.operator !== 'instanceof') {
            this._blockCount++;
            console.log("IfStatement blockCount++");
        }

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
                        var error = {};
                        error.title = "블록변환(Converting) 오류";
                        error.message = "블록으로 변환될 수 없는 코드입니다. \'True\' 또는 \'False\'를 사용하세요.";
                        error.line = this._blockCount; 
                        console.log("send error", error);
                        throw error;
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
        this._blockCount++;
        console.log("ForStatement blockCount++");
        var result;
        var structure = {};
        structure.statements = [];

        var syntax = String("for i in range");
        var type = this.getBlockType(syntax);

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
        console.log("BreakStatement blockCount++");
        var result;
        var structure = {};

        var syntax = String("break");
        var type = this.getBlockType(syntax);

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
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                    error.line = this._blockCount; 
                    console.log("send error", error); 
                    throw error;
                    break;                 
                case "typeof":
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                    error.line = this._blockCount; 
                    console.log("send error", error); 
                    throw error;
                    break;                    
                case "void":
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                    error.line = this._blockCount; 
                    console.log("send error", error); 
                    throw error;
                    break;                  
                case "delete": 
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                    error.line = this._blockCount; 
                    console.log("send error", error); 
                    throw error;
                    break;                    
                default: 
                    operator = operator;
                    var error = {};
                    error.title = "블록변환(Converting) 오류";
                    error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                    error.line = this._blockCount; 
                    console.log("send error", error); 
                    throw error;
                    break;
            }

            console.log("UnaryExpression type", type);
            console.log("UnaryExpression operator", operator);
            var params = [];
            if(operator == "+" || operator == "-") {
                argument.value = Number(operator.concat(argument.value));
                var value = this[argument.type](argument);
                data = value;
                console.log("UnaryExpression data", data);
                structure.data = data;
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
            }
        }

        console.log("syntax", syntax);
        console.log("type", type);

        structure.type = type;
        structure.params = params;

        result = structure;

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

        var type = this.getBlockType(syntax);
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
            var error = {};
            error.title = "블록변환(Converting) 오류";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + "을 수정하세요";
            error.line = this._blockCount; 
            console.log("send error", error);   
            throw error;     
        } 
        
        operator = String(component.operator);
        console.log("LogicalExpression operator", operator);
        if(operator) {
            operator = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
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
            var error = {};
            error.title = "블록변환(Converting) 오류";
            error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + param.name + "\'" + "을 수정하세요";
            error.line = this._blockCount; 
            console.log("send error", error);   
            throw error;     
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
                var syntax = String("(%1 %2boolean_compare# %3)"); 
                break;      
            case "!=": 
                var syntax = String("not (%2)"); 
                break;                    
            case "===": 
                var syntax = String("(%1 %2boolean_compare# %3)"); 
                break;      
            case "!==":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                     
            case "<": 
                var syntax = String("(%1 %2boolean_compare# %3)");  
                break;                 
            case "<=": 
                var syntax = String("(%1 %2boolean_compare# %3)"); 
                break;               
            case ">": 
                var syntax = String("(%1 %2boolean_compare# %3)"); 
                break;               
            case ">=": 
                var syntax = String("(%1 %2boolean_compare# %3)");  
                break;                
            case "<<":    
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;          
            case ">>": 
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;              
            case ">>>": 
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "+": 
                var syntax = String("(%1 %2calc_basic# %3)"); 
                break;               
            case "-": 
                var syntax = String("(%1 %2calc_basic# %3)"); 
                break;
            case "*": 
                var syntax = String("(%1 %2calc_basic# %3)"); 
                break;                 
            case "/": 
                var syntax = String("(%1 %2calc_basic# %3)"); 
                break;                
            case "%":  
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;               
            case "|":  
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;              
            case "^": 
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "|": 
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;
            case "&":   
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;              
            case "in":     
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;             
            case "instanceof": 
                //used in BlockStatement
                break;                  
            default: 
                operator = operator;
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;
        }

        console.log("BinaryExpression operator", operator); 
        console.log("BinaryExpression syntax", syntax);

        var type = this.getBlockType(syntax);

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
                    if(param && param != null)
                        params.push(param);   
                }
            } else {
                param = this[left.type](left);
                if(param) 
                    params.push(param);
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
                operator = Entry.TextCodingUtil.prototype.binaryOperatorConvert(operator);
                param = operator;
                if(param)
                    params.push(param);

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
                    if(param && param != null)
                        params.push(param);   
                }
            } else {
                param = this[right.type](right);
                if(param) 
                    params.push(param);
            }   
            console.log("BinaryExpression right param", param);
            
            if(type == "boolean_not") {
                params = [];
                params[0] = "";
                params[1] = this[left.type](left, paramsMeta[1], paramsDefMeta[1], true);
                params[2] = "";
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
                if(rightData.callee && rightData.callee.object) {
                    var calleeName = rightData.callee.object.object.name.concat('.')
                        .concat(rightData.callee.object.property.name).concat('.')
                        .concat(rightData.callee.property.name);
                } /*else if(rightData.callee) {
                    calleeName = rightData.callee;
                }*/

                if(calleeName == "__pythonRuntime.objects.list") { 
                    if(leftData.object.name == "self") {
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

                        var object = Entry.playground.object;

                        if(Entry.TextCodingUtil.prototype.isLocalListExisted(name, object)) {
                            Entry.TextCodingUtil.prototype.updateLocalList(name, array, object);
                        } 
                        else {
                            Entry.TextCodingUtil.prototype.createLocalList(name, array, object);
                        }
                    }
                } 

                if(leftData.property && (leftData.property.callee == "__pythonRuntime.ops.subscriptIndex")) {
                    var syntax = String("%1\[%2\] = %3");
                    var type = this.getBlockType(syntax);
                    structure.type = type; 
                }
                else if(right.arguments && right.arguments[0]) {
                    if(component.left.name)
                        var leftEx = component.left.name;
                    else
                        var leftEx = component.left.object.name.concat(component.left.property.name);
                    
                    if(component.right.arguments[0].name) 
                        var rightEx = component.right.arguments[0].name;
                    else
                        var rightEx = component.right.arguments[0].object.name.concat(component.right.arguments[0].property.name);
                    
                    console.log("AssignmentExpression leftEx", leftEx, "rightEx", rightEx);
                    if(component.right.arguments && (leftEx == rightEx)) {
                        var syntax = String("%1 += %2");
                        var type = this.getBlockType(syntax);
                        structure.type = type; 
                    } else {
                        var syntax = String("%1 = %2");
                        var type = this.getBlockType(syntax);
                        structure.type = type;      
                    }
                } else {
                    var syntax = String("%1 = %2");
                    var type = this.getBlockType(syntax);
                    structure.type = type; 
                }
                
                break;
            }
            case "+=":  
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;   
            case "-=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;               
            case "*=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "/=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                 
            case "%=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "<<=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case ">>=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "|=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;               
            case "^=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;                
            case "&=":
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;               
            default: 
                operator = operator;
                var error = {};
                error.title = "블록변환(Converting) 오류";
                error.message = "블록으로 변환될 수 없는 코드입니다." + "\'" + operator + "\'" + " 표현식은 지원하지 않습니다.";
                error.line = this._blockCount; 
                console.log("send error", error); 
                throw error;
                break;
        }

        if(operator) {
            var operatorData = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
        }

        result.operator = operatorData;

        
        

        /*//save the variable to map  
        var variable = leftData;
        var value = rightData;
        console.log("variable", variable, "value", value);
        if(variable && value)
            this._variableMap.put(variable, value);*/
        //save the variable to map

        console.log("AssignmentExpression syntax", syntax);

        if(leftData.object)
            var object = leftData.object;
        else if(leftData.name)
            var object = leftData.name;

        if(leftData.proprty)
            var property = leftData.property;
        else if(leftData.name)
            var property = leftData.name;

        console.log("AssignmentExpression object property value", object, property);
        
        if(syntax == String("%1\[%2\] = %3")) {
            var block = Entry.block[type]; 
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params; 

            /*var listName = leftData.property.arguments[0].property.name;
            listName = this.ParamDropdownDynamic(listName, paramsMeta[0], paramsDefMeta[0]);*/

            var listName = leftData.params[1];

            console.log("AssignmentExpression listName", listName);

            if(!listName)
                return result;

            params.push(listName);
            var param = leftData.property.arguments[0];
            console.log("AssignmentExpression param 1", param);
            /*if(param.type == "number") {
                param.params[0] += 1;
            }
            else if(param.type == "text") { 
                param.params[0] = String(Number(param.params[0]) + 1);
            }*/
            console.log("AssignmentExpression param 2", param);
            params.push(param);
            params.push(rightData);

            structure.params = params; 

        }
        else if(syntax == String("%1 = %2")) {
            console.log("AssignmentExpression calleeName check", calleeName);
            if(object && object.name == "self" && calleeName != "__pythonRuntime.objects.list") {
                var block = Entry.block[type]; 
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;
            
                var name = property.name;
                if(rightData.type == "number" || rightData.type == "text")
                    var value = rightData.params[0]; 
                else
                    var value = NaN;

                if(value && value != NaN) {
                    var object = Entry.playground.object;
                    console.log("final value", value); 
                    console.log("final object", object); 


                    if(Entry.TextCodingUtil.prototype.isLocalVariableExisted(name, object)) {
                        Entry.TextCodingUtil.prototype.updateLocalVariable(name, value, object);
                    } 
                    else {
                        Entry.TextCodingUtil.prototype.createLocalVariable(name, value, object);
                    }
                }

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);
                params.push(rightData);
            }
            else {
                var block = Entry.block[type]; 
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                console.log("property 123", property);
            
                var name = property;
                if(rightData.type == "number" || rightData.type == "text")
                    var value = rightData.params[0]; 
                else
                    var value = NaN;

                if(value && value != NaN) {
                    var object = Entry.playground.object;
                    console.log("final object", object); 
                    console.log("final value", value); 

                    if(Entry.TextCodingUtil.prototype.isGlobalVariableExisted(name, object)) {
                        Entry.TextCodingUtil.prototype.updateGlobalVariable(name, value, object);
                    } 
                    else {
                        Entry.TextCodingUtil.prototype.createGlobalVariable(name, value, object);
                    }
                }

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);
                if(rightData.callee)
                    delete rightData.callee;
                params.push(rightData);
            }

        } 
        else if(syntax == String("%1 += %2")) {
            if(object && object.name == "self") {
                var block = Entry.block[type]; 
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                var name = property.name;

                var object = Entry.playground.object;
                console.log("final object", object); 

                if(!Entry.TextCodingUtil.prototype.isLocalVariableExisted(name, object)) 
                    return result;

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);
                params.push(rightData.params[2]); 
            } 
            else {
                var block = Entry.block[type]; 
                var paramsMeta = block.params;
                var paramsDefMeta = block.def.params;

                var name = property;

                if(!Entry.TextCodingUtil.prototype.isGlobalVariableExisted(name))
                    return result;

                name = this.ParamDropdownDynamic(name, paramsMeta[0], paramsDefMeta[0]);
                params.push(name);
                params.push(rightData.params[2]); 
            }
        } 

        structure.params = params;

        result.type = structure.type;
        result.params = structure.params;

        console.log("AssignmentExpression result", result);
        
        return result;
    };

    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration component", component);
        var result = {};

        var body = component.body;
        var id = component.id;

        if(id.name == "__getParam0")
            return result;

        var bodyData = this[body.type](body); 
        console.log("FunctionDeclaration bodyData", bodyData);

        if(id.type == "Identifier")
            var idData = this[id.type](id);

        console.log("FunctionDeclaration idData", idData);

        var textFuncName;
        var textFuncParams = [];
        var textFuncStatements = [];

        /*var idDataTokens = idData.name.split('_');
        if(idDataTokens.length > 0) {
            var funcName = idDataTokens.join(' ');
            textFuncName = ' ' + funcName;
        }
        else {*/
            textFuncName = idData.name;
        //}

        var funcBodyData = bodyData.data;
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
                    textFuncStatements = statements;
                }
            }
        }

        console.log("FunctionDeclaration textFuncName", textFuncName);
        console.log("FunctionDeclaration textFuncParams", textFuncParams);
        console.log("FunctionDeclaration textFuncStatements", textFuncStatements);

        ////////////////////////////////////////////////////////////////
        //First, Find The Function Block
        ////////////////////////////////////////////////////////////////
        var foundFlag;
        var matchFlag;
        var targetFuncId;
        var entryFunctions = Entry.variableContainer.functions_;
        for(var funcId in entryFunctions) {
            var blockFunc = entryFunctions[funcId];
            Entry.TextCodingUtil.prototype.initQueue();
            Entry.TextCodingUtil.prototype.gatherFuncDefParam(blockFunc.content._data[0]._data[0].data.params[0]);
            console.log("Entry.TextCodingUtil._funcParamQ", Entry.TextCodingUtil.prototype._funcParamQ);
            var funcParams = [];
            
            var paramMap = {}; 
            while(param = Entry.TextCodingUtil.prototype._funcParamQ.dequeue()) {
                funcParams.push(param);
                console.log("param", param);
            }
            console.log("funcParams", funcParams);
            for(var p in funcParams) {
                var funcParam = funcParams[p];
                paramMap[funcParam] = p;
            }
            
            console.log("paramMap", paramMap);
            /*var tokens = blockFunc.block.template.split('%');
            var blockFuncName = tokens[0].trim();*/

            console.log("funcNameQueue", Entry.TextCodingUtil.prototype._funcNameQ);
            var funcNames = [];
            while(nameToken = Entry.TextCodingUtil.prototype._funcNameQ.dequeue()) {
                funcNames.push(nameToken);
                console.log("funcNames", nameToken);
            }
            Entry.TextCodingUtil.prototype.clearQueue();

            blockFuncName = funcNames.join('__').trim();
            console.log("first blockFuncName", blockFuncName);
            console.log("first textFuncName", textFuncName);

            if(textFuncName == blockFuncName) {
                //foundFlag = true;
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

                    matchFlag = Entry.TextCodingUtil.prototype.isFuncContentsMatch(blockFuncCts, textFuncStatements, paramMap);
                    
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
                /*else {
                    foundFlag = false;
                    matchFlag = false;
                } */ 
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
            var targetFunc = Entry.variableContainer.functions_[targetFuncId];
            var thread = targetFunc.content._data[0];
            thread._data.splice(1, thread._data.length-1);

            if(textFuncStatements.length > 0) {
                for(var s in textFuncStatements) {
                    var statement = textFuncStatements[s];
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
            
            console.log("FunctionDeclaration newFunc", newFunc);
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
            var textFuncNameTokens = textFuncName.split('__');
            if(textFuncNameTokens.length > 0) {
                for(var n = 1; n < textFuncNameTokens.length; n++) {
                    var token = textFuncNameTokens[n];
                    var nameFieldBlock = new Entry.Block({ type: "function_field_label" }, thread); 
                    nameFieldBlock.data.params = [];
                    nameFieldBlock.data.params.push(token);
                    var lastParam = Entry.TextCodingUtil.prototype.getLastParam(newFuncDefParamBlock);
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
                var lastParam = Entry.TextCodingUtil.prototype.getLastParam(newFuncDefParamBlock);
                lastParam.data.params[1] = paramFieldBlock;

                newFunc.paramMap[stringParam] = Number(0);
                console.log("FunctionDeclaration paramBlock", newFunc);

                for(var p = 1; p < textFuncParams.length; p++) {
                    var paramFieldBlock = new Entry.Block({ type: "function_field_string" }, thread);
                    paramFieldBlock.data.params = [];
                   
                    var stringParam = Entry.Func.requestParamBlock("string");
                    console.log("FunctionDeclaration stringParam", stringParam);
                    var param = new Entry.Block({ type: stringParam }, thread);
                    paramFieldBlock.data.params.push(param);
                                       
                    var paramBlock = Entry.TextCodingUtil.prototype.searchFuncDefParam(newFuncDefParams[1]);
                    console.log("FunctionDeclaration paramBlock", paramBlock);
                    if(paramBlock.data.params.length == 0)
                        paramBlock.data.params[0] = param;
                    else if(paramBlock.data.params.length == 1)
                        paramBlock.data.params[1] = paramFieldBlock;
                
                    newFunc.paramMap[stringParam] = Number(p);
                    console.log("FunctionDeclaration paramBlock", newFunc);
                } 
                
                /*var paramMap = newFunc.paramMap;
                var paramMapKeys = Object.keys(paramMap);
                for(var i in paramMapKeys) {
                    newFunc.block.template += String(' %' + Number(i+1));
                }*/
            }

            if(textFuncStatements.length > 0) {
                for(var s in textFuncStatements) {
                    var statement = textFuncStatements[s];
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
            console.log("FunctionDeclaration newFunc", newFunc);

        }

        console.log("FunctionDeclaration result", result);   
        //return result;
    };

    p.FunctionExpression = function(component) {
        console.log("FunctionExpression component", component);
        var result = {};
        
        var body = component.body;
        var bodyData = this[body.type](body);

        console.log("FunctionExpression bodyData", bodyData);

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

    p.getBlockType = function(syntax) {
        console.log("why syntax", syntax);
        return this.blockSyntax[syntax];
    };

    ///////////////////////////////////////////////////////////
    //Not Yet Used Syntax
    ///////////////////////////////////////////////////////////
    
    p.RegExp = function(component) {
        console.log("RegExp", component);
        var result;
        
        result = component;

        console.log("RegExp result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "RegExp" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.Function = function(component) {
        console.log("Function component", component);
        var result;

        result = component;

        console.log("Function result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "Function" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.EmptyStatement = function(component) {
        console.log("EmptyStatement component", component);
        var result;

        result = component;

        console.log("EmptyStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "EmptyStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.DebuggerStatement = function(component) {
        console.log("DebuggerStatement component", component);
        var result;

        result = component;

        console.log("DebuggerStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "DebuggerStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.WithStatement = function(component) {
        console.log("WithStatement component", component);
        var result;

        result = component;

        console.log("WithStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "WithStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.LabeledStatement = function(component) {
        console.log("LabeledStatement component", component);
        var result;

        result = component;

        console.log("LabeledStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "LabeledStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.ContinueStatement = function(component) {
        console.log("ContinueStatement component", component);
        var result;

        result = component;

        console.log("ContinueStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "ContinueStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.SwitchStatement = function(component) {
        console.log("SwitchStatement component", component);
        var result;

        result = component;

        console.log("SwitchStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "SwitchStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.SwitchCase = function(component) {
        console.log("SwitchCase component", component);
        var result;

        result = component;

        console.log("SwitchCase result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "SwitchCase" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.ThrowStatement = function(component) {
        console.log("ThrowStatement component", component);
        var result;

        result = component;

        console.log("ThrowStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "ThrowStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.TryStatement = function(component) {
        console.log("TryStatement component", component);
        var result;

        result = component;

        console.log("TryStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "TryStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.CatchClause = function(component) {
        console.log("CatchClause component", component);
        var result;

        result = component;

        console.log("CatchClause result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "CatchClause" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.DoWhileStatement = function(component) {
        console.log("DoWhileStatement component", component);
        var result;

        result = component;

        console.log("DoWhileStatement result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "DoWhileStatement" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.ArrayExpression = function(component) {
        console.log("ArrayExpression component", component);
        var result;

        result = component;

        console.log("ArrayExpression result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "ArrayExpression" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.ObjectExpression = function(component) {
        console.log("ObjectExpression component", component);
        var result;

        result = component;

        console.log("ObjectExpression result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "ObjectExpression" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.Property = function(component) {
        console.log("Property component", component);
        var result;

        result = component;

        console.log("Property result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "Property" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.ConditionalExpression = function(component) {
        console.log("ConditionalExpression component", component);
        var result;

        result = component;

        console.log("ConditionalExpression result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "ConditionalExpression" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };

    p.SequenceExpression = function(component) {
        console.log("SequenceExpression component", component);
        var result;

        result = component;

        console.log("SequenceExpression result", result);

        //Convertin Error Control
        var error = {};
        error.title = "블록변환(Converting) 오류";
        error.message = "블록으로 변환될 수 없는 코드입니다." + "SequenceExpression" + " 표현식은 지원하지 않습니다.";
        error.line = this._blockCount; 
        console.log("send error", error); 
        throw error;
        //Converting Error Control

        return result;
    };
    
})(Entry.PyToBlockParser.prototype);