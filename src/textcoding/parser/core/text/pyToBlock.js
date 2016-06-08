/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.Map");

Entry.PyToBlockParser = function(blockSyntax) { 
    this.blockSyntax = blockSyntax;
    this._blockStatmentIndex = 0;
    this._blockStatments = [];

    var variableMap = new Entry.Map();
    this._variableMap = variableMap;
};

(function(p){
    p.Program = function(astArr) { 
        var code = [];
        
        for(var index in astArr) { 
            if(astArr[index].type != 'Program') return;
            var thread = []; 
            var nodes = astArr[index].body;

            console.log("nodes", nodes);

            for(var index in nodes) {
                var node = nodes[index];
                                
                var block = this[node.type](node);
                console.log("result block", block); 

                if(block.type)
                    thread.push(block); 
            }

            console.log("thread", thread);
            if(thread.length != 0)
                code.push(thread);    
        }
        return code;
    };

    p.ExpressionStatement = function(component) {    
        console.log("ExpressionStatement component", component);
        var reusult;
        var structure = {};

        var expression = component.expression;
        
        if(expression.type) {
            var expressionData = this[expression.type](expression);

            if(expressionData.type && expressionData.params) {
                structure.type = expressionData.type;
                structure.params = expressionData.params;

                result = structure;
            }
            else if(expressionData.type) {
                structure.type = expressionData.type;
                    
                result = structure;
            } else {
                structure = expressionData;

                result = structure; 
            }
        } 

        console.log("ExpressionStatement result", result);
        return result;
    };


    p.CallExpression = function(component) {
        console.log("CallExpression component", component);
        var result;
        var data = {};

        var callee = component.callee;

        var calleeData = this[callee.type](callee);

        var arguments = component.arguments;

        console.log("CallExpression calleeData", calleeData, "calleeData typeof", typeof calleeData.object);

        if(typeof calleeData.object != "object")
            var calleeName = String(calleeData.object).concat('.').concat(String(calleeData.property));
        else 
            var calleeName = String(calleeData.object.object).concat('.')
                            .concat(String(calleeData.object.property))
                            .concat('.').concat(String(calleeData.property));

        console.log("CallExpression calleeName", calleeName);

        var type = this.getBlockType(calleeName);

        console.log("CallExpression type before", type);
        
        if(calleeName == "__pythonRuntime.functions.range"){
            var syntax = String("%1number#");
            type = this.getBlockType(syntax);
        }
        else if(calleeName == "__pythonRuntime.ops.add") {
            //if(typeof arguments[0].value == "number") {
                var syntax = String("(%1 %2calc_basic# %3)");
                type = this.getBlockType(syntax);

                argumentData = {raw:"PLUS", type:"Literal", value:"PLUS"};
                arguments.splice(1, 0, argumentData);
            /*} else if(typeof arguments[0].value == "string") {
                var syntax = String("%2 + %4");
                type = this.getBlockType(syntax);
            } */
        }
        else if(calleeName == "__pythonRuntime.ops.multiply") {
            var syntax = String("(%1 %2calc_basic# %3)");
            type = this.getBlockType(syntax);
    
            argumentData = {raw:"MULTI", type:"Literal", value:"MULTI"};
            arguments.splice(1, 0, argumentData);
            
        } 
        else if(calleeName == "__pythonRuntime.functions.len") {
            var syntax = String("len(%2)");
            type = this.getBlockType(syntax);
        } 

        console.log("CallExpression type after", type); 
        
        if(type) {
            var block = Entry.block[type]; 
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params; 

            var params = [];

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
                console.log("CallExpression argument", argument, "typeof", typeof argument);
                
                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i], true);
                console.log("CallExpression param", param);

                if(calleeName == "__pythonRuntime.functions.range" && param.type) {
                    type = param.type;
                    params = param.params;
                } else {
                    params.push(param);
                }                              
            }
            
            data.type = type; 
            data.params = params;
        } else {
            data = null;
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : component
            };
        }

        result = data;

        console.log("CallExpression result", result);
        return result;
    };

    p.Identifier = function(component, paramMeta, paramDefMeta, aflag) {
       console.log("Identifier component", component, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta, "aflag", aflag);
        var result;

        if(aflag) {
            var variable = component.name;
            var value = this._variableMap.get(variable);

            console.log("Identifier this._variableMap", this._variableMap.toString());
            console.log("Identifier value", value); 

            if(value) {
                if(value.type == "text" || value.type == "number") {
                    value = this['Param'+paramMeta.type](value.params[0], paramMeta, paramDefMeta);
                    console.log("Identifier value", value);
                }
                result = value;
                console.log("Identifiler value result", result);
                return result;
            } else {
                var defaultValue = {};
                defaultValue.type = paramDefMeta.type;
                defaultValue.params = paramDefMeta.params;
                result = defaultValue;

                console.log("Identifiler default result", result);
                return result;
            }
        }

        result = component.name;
        
        console.log("Identifiler result", result);
        return result;
    };

    p.VariableDeclaration = function(component) {
        console.log("VariableDeclaration component", component);
        var result;
        var data = {};
        data.declarations = [];

        var declarations = component.declarations;
        
        for(var i in declarations) {

            var declaration = declarations[i];
            var declarationData = this[declaration.type](declaration);

            console.log("VariableDeclaration declarationData", declarationData);
            data.declarations.push(declarationData);
        }

        result = data;

        console.log("VariableDeclaration result", result);

        return result; 

    };

    p.VariableDeclarator = function(component) {
        console.log("VariableDeclarator component", component);
        
        var result; 
        var data = {}; 
        
        var id = component.id;
        var idData = this[id.type](id);
        console.log("VariableDeclarator idData", idData);
        data.id = idData;

        var init = component.init;
        var initData = this[init.type](init);
        console.log("VarialeDeclarator initData", initData);
        data.init = initData;

        var variable = idData;
        var value = initData;
        console.log("variable", variable, "value", value);

        if(variable && value)
            this._variableMap.put(variable, value);
        

        result = data;

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
        var result;

        result = value;

        return result;
    };

    p.ParamTextInput = function(value, paramMeta, paramDefMeta) {
        var result;

        result = value;

        return result;
    };

    p.ParamColor = function(value, paramMeta, paramDefMeta) {
        console.log("ParamColor value, paramMeta", value, paramMeta);
        var result;
        
        result = value;
        
        console.log("ParamColor result", result);

        return result; 
    };

    p.ParamDropdown = function(value, paramMeta, paramDefMeta) {
        console.log("ParamDropdown value, paramMeta", value, paramMeta);
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
        result = String(result);
        console.log("ParamDropdown result", result);

        return result; 
    };

    p.ParamDropdownDynamic = function(value, paramMeta, paramDefMeta) {
        console.log("ParamDropdownDynamic value, paramMeta", value, paramMeta);
        var result;

        if(value == "mouse" || value == "wall" || value == "wall_up" || 
               value == "wall_down" || value == "wall_right" || value == "wall_left"){
            result = value;
            return result;
        } 
            
        var options = paramMeta.options;
        console.log("ParamDropdownDynamic options", options);
        for(var i in options) {
            console.log("options", options);
            if(value == options[i][0]){
                console.log("options[i][0]", options[i][0]);
                result = options[i][1];
                break;
            }
        }
        
        result = String(result);
        
        console.log("ParamDropdownDynamic result", result);

        return result;
    };

    p.ParamKeyboard = function(value, paramMeta, paramDefMeta) {
        console.log("ParamKeyboard value, paramMeta", value, paramMeta);
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
        var result;
        var data = {}
        var object = component.object;
        var property = component.property;
        var objectData = this[object.type](object);
        var propertyData = this[property.type](property);

        console.log("MemberExpression objectData", objectData);
        console.log("MemberExpression propertyData", propertyData);
        
        data.object = objectData;      
        data.property = propertyData;

        result = data;
        console.log("MemberExpression result", result);

        return result;
    };
    

    p.WhileStatement = function(component) {
        console.log("WhileStatement component", component);
        var result;
        var structure = {};
        structure.statements = [];
        
        var test = component.test;
        console.log("WhileStatement test", test);

        if(test.value === true) {
            var syntax = String("while True:\n$1");
            var type = this.getBlockType(syntax);
        } else if(test.value === false) {
            //This Expression Not Supported
        } 

        console.log("WhileStatement type", type);

        var paramsMeta = Entry.block[type].params;
        console.log("WhileStatement paramsMeta", paramsMeta);
                
        var params = [];
        if(test.type == "Literal" || test.type == "Identifier") {
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
        structure.params = params; 
        structure.statements.push(bodyData.statements);

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
                    console.log("BlockStatement allStatements", allStatements);
                    if(allStatements && allStatements.length != 0) {
                        for(var i in allStatements) {
                            var statement = allStatements[i];
                            console.log("BlockStatement(for) statement", statement);
                            if(statement.type)
                                statements.push(statement);
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
                            if(statement && statement.type)
                                    statements.push(statement);
                        }
                    }
                    else {
                        var statements = [];
                        var allStatements = data;
                        if(allStatements && allStatements.length != 0) {
                            for(i in allStatements) {
                                var statement = allStatements[i];
                                console.log("BlockStatement statement", statement);
                                if(statement && statement.type)
                                    statements.push(statement);
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


        console.log("jhlee data check", data);
        
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

        if(alternate != null) {
             var type = String("if_else")
        } else {
             var type = String("_if");
        }

        structure.type = type;

        
        console.log("IfStatement type", type);
        
        var test = component.test;
        //if(test != null){
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
                    if(param && param != null)
                        params.push(param);   
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
        //}

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
        var result;
        var structure = {};
        structure.statements = [];

        var syntax = String("for i in range(%1):\n$1");
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
        

        if(component.prefix){
            var operator = component.operator;
            var argument = component.argument;
            switch(operator){
                case "-": 
                    operator = operator; 
                    break;
                case "+": 
                    operator = operator; 
                    break;                   
                case "!": break;                    
                case "~": break;                
                case "typeof": break;                   
                case "void": break;                 
                case "delete": break;                   
                default: 
                    operator = operator;
            }

            console.log("UnaryExpression operator", operator);

            argument.value = Number(operator.concat(argument.value));

            var value = this[argument.type](argument);

            data = value;

            console.log("UnaryExpression data", data);
        }

        result = data;

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

        structure.type = type;
        structure.params = params;
        
        result = structure;

        console.log("LogicalExpression result", result);

        return result;
    };

    p.BinaryExpression = function(component) {
        console.log("BinaryExpression component", component);
        
        var result;
        var structure = {}; 

        var operator = String(component.operator);  

        switch(operator){ 
            case "==": 
                var syntax = String("(%1 %2boolean_compare# %3)"); 
                break;
                       
            case "!=": 
                var syntax = String("(%2 != True)");  
                break; break;               
            case "===": break;               
            case "!==": break;               
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
            case "<<": break;              
            case ">>": break;               
            case ">>>": break;                
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
            case "%": break;                
            case "|": break;               
            case "^": break;                
            case "|": break;
            case "&": break;                
            case "in": break;                 
            case "instanceof": break;                  
            default: 
                operator = operator;
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
            
            /*if(type == "boolean_not") {
                params = [];
                params[0] = "";
                params[1] = this[left.type](left, paramsMeta[1], paramsDefMeta[1], true);
                params[2] = "";
            }*/

            structure.type = type;
            structure.params = params;
        } else {
            structure = null;

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
        var reusult;
        var data = {};

        var params = [];
        var param;
           
        var left = component.left;
        if(left.type) {
            var leftData = this[left.type](left);

            console.log("AssignmentExpression leftData", leftData);
        } 

        data.left = leftData

        operator = String(component.operator);
        console.log("AssignmentExpression operator", operator);

        switch(operator){
            case "=": break;
            case "+=": break;    
            case "-=": break;              
            case "*=": break;               
            case "/=": break;                
            case "%=": break;               
            case "<<=": break;               
            case ">>=": break;               
            case "|=": break;              
            case "^=": break;               
            case "&=": break;              
            default: 
                operator = operator;
        }

        if(operator) {
            var operatorData = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
        }

        data.operator = operatorData;

        var right = component.right;
        if(right.type) {
            var rightData = this[right.type](right);
            console.log("AssignmentExpression rightData", rightData);
        } 

        //save the variable to map  
        var variable = leftData;
        var value = rightData;

        console.log("variable", variable, "value", value);

        if(variable && value)
            this._variableMap.put(variable, value);
        //save the variable to map

        data.right = rightData;

        result = data;

        console.log("AssignmentExpression result", result);
        
        return result;
    };

    


    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };


    
    ///////////////////////////////////////////////////////////
    //Not Suported Syntax
    ///////////////////////////////////////////////////////////
    p.NewExpression = function(component) {
        console.log("NewExpression component", component);
        var result;
        var data = {};
        data.params = [];

        var callee = component.callee;
        var calleeData = this[callee.type](callee);

        var arguments = component.arguments;
        var params = [];
        for(var i in arguments) { 
            var argument = arguments[i];
            console.log("NewExpression argument", argument);
                      
            var param = this[argument.type](argument);
            params.push(param);   
        }

        data.callee = calleeData;
        data.params = params;

        result = data;

        console.log("NewExpression result", result);
        return result;
    };
    
    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration component", component);
        var result;

        result = component;

        console.log("FunctionDeclaration result", result);
        return result;
    };

    p.RegExp = function(component) {
        console.log("RegExp", component);
        var result;
        
        result = component;

        console.log("RegExp result", result);
        return result;
    };

    p.Function = function(component) {
        console.log("Function", component);
        var result;

        result = component;

        console.log("Function result", result);
        return result;
    };

    p.EmptyStatement = function(component) {
        console.log("EmptyStatement", component);
        var result;

        result = component;

        console.log("EmptyStatement result", result);
        return result;
    };

    p.DebuggerStatement = function(component) {
        console.log("DebuggerStatement", component);
        var result;

        result = component;

        console.log("DebuggerStatement result", result);
        return result;
    };

    p.WithStatement = function(component) {
        console.log("WithStatement", component);
        var result;

        result = component;

        console.log("WithStatement result", result);
        return result;
    };
    p.ReturnStaement = function(component) {
        console.log("ReturnStaement", component);
        var result;

        result = component;

        console.log("ReturnStaement result", result);
        return result;
    };

    p.LabeledStatement = function(component) {
        console.log("LabeledStatement", component);
        var result;

        result = component;

        console.log("LabeledStatement result", result);
        return result;
    };

    p.ContinueStatement = function(component) {
        console.log("ContinueStatement", component);
        var result;

        result = component;

        console.log("ContinueStatement result", result);
        return result;
    };

    p.SwitchStatement = function(component) {
        console.log("SwitchStatement", component);
        var result;

        result = component;

        console.log("SwitchStatement result", result);
        return result;
    };

    p.SwitchCase = function(component) {
        console.log("SwitchCase", component);
        var result;

        result = component;

        console.log("SwitchCase result", result);
        return result;
    };

    p.ThrowStatement = function(component) {
        console.log("ThrowStatement", component);
        var result;

        result = component;

        console.log("ThrowStatement result", result);
        return result;
    };

    p.TryStatement = function(component) {
        console.log("TryStatement", component);
        var result;

        result = component;

        console.log("TryStatement result", result);
        return result;
    };

    p.CatchClause = function(component) {
        console.log("CatchClause", component);
        var result;

        result = component;

        console.log("CatchClause result", result);
        return result;
    };

    p.DoWhileStatement = function(component) {
        console.log("DoWhileStatement", component);
        var result;

        result = component;

        console.log("DoWhileStatement result", result);
        return result;
    };

    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration", component);
        var result;

        result = component;

        console.log("FunctionDeclaration result", result);
        return result;
    };

    p.ThisExpression = function(component) {
        console.log("ThisExpression", component);
        var result;

        result = component;

        console.log("ThisExpression result", result);
        return result;
    };

    p.ArrayExpression = function(component) {
        console.log("ArrayExpression", component);
        var result;

        result = component;

        console.log("ArrayExpression result", result);
        return result;
    };

    p.ObjectExpression = function(component) {
        console.log("ObjectExpression", component);
        var result;

        result = component;

        console.log("ObjectExpression result", result);
        return result;
    };

    p.Property = function(component) {
        console.log("Property", component);
        var result;

        result = component;

        console.log("Property result", result);
        return result;
    };

    p.FunctionExpression = function(component) {
        console.log("FunctionExpression", component);
        var result;

        result = component;

        console.log("FunctionExpression result", result);
        return result;
    };

    p.ConditionalExpression = function(component) {
        console.log("ConditionalExpression", component);
        var result;

        result = component;

        console.log("ConditionalExpression result", result);
        return result;
    };

    p.SequenceExpression = function(component) {
        console.log("SequenceExpression", component);
        var result;

        result = component;

        console.log("SequenceExpression result", result);
        return result;
    };
    
})(Entry.PyToBlockParser.prototype);