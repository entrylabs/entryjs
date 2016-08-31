function CallExpression(component) {
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