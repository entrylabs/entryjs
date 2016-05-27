/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCodeMap");
goog.require("Entry.TextCodingUtil");


Entry.PyToBlockParser = function(blockSyntax) {
    this.blockSyntax = blockSyntax;
    this._blockStatmentIndex = 0;
    this._blockStatments = [];
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
                thread.push(block);   
            }

            console.log("thread", thread);
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

            if(expressionData.params) {
                structure.type = expressionData.type;
                structure.params = expressionData.params;

                result = structure;
            }
            else {
                structure.type = expressionData.type;
                    
                result = structure;
            }
        } else {
            //To Do
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

        console.log("CallExpression calleeData", calleeData, "calleeData typeof", typeof calleeData);

        if(typeof calleeData.object != "object")
            var syntax = String(calleeData.object).concat('.').concat(String(calleeData.property));
        else 
            var syntax = String(calleeData.object.object).concat('.')
                            .concat(String(calleeData.object.property))
                            .concat('.').concat(String(calleeData.property));

        console.log("CallExpression syntax", syntax);

        var type = this.getBlockType(syntax);

        console.log("CallExpression type before", type);
        
        if(syntax == "__pythonRuntime.functions.range"){
            var syntax = String("%1number#");
            type = this.getBlockType(syntax);
        } 
        else if(syntax == "__pythonRuntime.ops.add") {
            if(typeof arguments[0].value == "number") {
                var syntax = String("(%1 %2 %3)");
                type = this.getBlockType(syntax);

                argumentData = {raw:"PLUS", type:"Literal", value:"PLUS"};
                arguments.splice(1, 0, argumentData);
            } else if(typeof arguments[0].value == "string") {
                var syntax = String("%2 + %4");
                type = this.getBlockType(syntax);
            } 
        }
        else if(syntax == "__pythonRuntime.ops.multiply"){
            var syntax = String("(%1 %c %3)");
            type = this.getBlockType(syntax);
    
            argumentData = {raw:"MULTI", type:"Literal", value:"MULTI"};
            arguments.splice(1, 0, argumentData);
            
        } 
        else if(syntax == "__pythonRuntime.functions.len") {
            var syntax = String("len(%2)");
            type = this.getBlockType(syntax);
        }

        console.log("CallExpression type after", type);
        
        if(type) {

            var block = Entry.block[type];
            var paramsMeta = block.params;
            var paramsDefMeta = block.def.params; 

            var params = [];

            console.log("CallExpression componet.arguments", arguments);
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

            for(var i in arguments) { 
                var argument = arguments[i];
                console.log("CallExpression argument", argument);
                          
                var param = this[argument.type](argument, paramsMeta[i], paramsDefMeta[i]);
                params.push(param);   
            }
            
            data.type = type;
            data.params = params;
        } else {
            data = null;
        }

        result = data;

        console.log("CallExpression result", result);
        return result;
    };

    p.Literal = function(component, paramMeta, paramDefMeta) {
        console.log("Literal component", component, "paramMeta", paramMeta, "paramDefMeta", paramDefMeta);

        var result;

        var value = component.value;

        console.log("Literal value", value);

        if(!paramMeta) 
            var paramMeta = { type: "Block" };

        if(!paramDefMeta) {
            if(typeof value == "number")
                var paramDefMeta = { type: "number" };
            else 
                var paramDefMeta = { type: "text" };
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

            console.log("Literam param", param);
    
            result = params;
        } else {
            // Literal doesn't have value
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
        
        var paramBlock = Entry.block[paramDefMeta.type];
        var paramsMeta = paramBlock.params;
        var paramsDefMeta = paramBlock.paramsDefMeta;

        for(var i in paramsMeta) {
            if(paramsMeta[i].type == "Block") {
                param = this.ParamBlock(value, paramsMeta[i], paramsDefMeta[i]);
                break;
            }

            var options = paramsMeta[i].options;
            console.log("options", options);
            for(var j in options) {
                var option = options[j];
                if(value == option[0]) {
                    param = option[1];
                    break;
                }
            }
        }

        console.log("ParamBlock param", param);
        if(param == true || param == false)
            param = null;

        params.push(param);

        structure.type = paramDefMeta.type;
        structure.params = params;
            
        result = structure;
        console.log("ParamBlock result", result);

        return result;

    };

    p.ParamTextInput = function(value, paramMeta, paramDefMeta) {
        var result;

        result = value;

        return result;
    };

    p.ParamColor = function(value, paramMeta) {
        console.log("ParamColor value, paramMeta", value, paramMeta);
        var result;
        
        result = value;
        
        console.log("ParamColor result", result);

        return result; 
    };

    p.ParamDropdown = function(value, paramMeta) {
        console.log("ParamDropdown value, paramMeta", value, paramMeta);
        var result;
        
        result = String(value);
        
        console.log("ParamDropdownDynamic result", result);

        return result; 
    };

    p.ParamDropdownDynamic = function(value, paramMeta) {
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

    p.ParamKeyboard = function(value, paramMeta) {
        console.log("ParamKeyboard value, paramMeta", value, paramMeta);
        var result;
        result = Entry.KeyboardCodeMap.prototype.keyCharToCode[value];

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
        console.log("MemberExpression structure", propertyData);
        
        data.object = objectData;
        data.property = propertyData;

        result = data;

        console.log("MemberExpression result", result);

        return result;
    };
    
    p.Identifier = function(component) {
        console.log("Identifiler component", component);
        var result;
        var value = component.name;
        
        result = value;

        console.log("Identifiler result", result);
        return result;
    };

    p.WhileStatement = function(component) {
        console.log("WhileStatement component", component);
        var result;
        var structure = {};
        
        var test = component.test;
        
        var syntax;
        var type;

       
        if(test.value == true) {
            syntax = String("while True:\n$1");
            type = this.getBlockType(syntax);
        } else if(test.value == false) {

        } else {

        }

        console.log("WhileStatement type", type);

        var paramsMeta = Entry.block[type].params;
        console.log("WhileStatement paramsMeta", paramsMeta);
                
        var params = [];
        if(test) {
            if(test.type = "Literal") {
                var paramMeta = paramsMeta[0];
                if(paramMeta.type == "Indicator") {
                    var param = null;
                }
                else {
                    var param = this[test.type](test, paramMeta);
                }
                params.push(param);  
                        
            }
            else {
                //To Do : when argument.type is not "Literal"
            }
        }
                
        var statements = [];
        var bodies = component.body.body;
        
        for(var index in bodies) {
            var body = bodies[index];
            var bodyData = this[body.type](body);
            statements.push(bodyData);
        }

        structure.type = type;
        structure.params = params;
        structure.statements = [];
        structure.statements.push(statements);

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
            if(bodyData && bodyData == null)
                continue;

            console.log("BlockStatement bodyData", bodyData);

            data.push(bodyData);
            console.log("BlockStatement data", data);
        }

        

        console.log("BlockStatement final data", data);

        

        /*if(data && data[0]) { //For Statement Params
            var declarations = data[0].declarations;

            for(var d in declarations) {
                var declaration = declarations[d];
                var param = declaration.init;
                params.push(param);
            }

            if(params && params.length != 0)
                result.params = params;
        }

        if(data && data[1]) {
            result.type = data[1].type;

            statements = data[1].statements;
            result.statements = statements;
        }*/


        result.data = data;

        if(data[0] && data[0].declarations) {
            result = data[1];
        }

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
        if(test != null){
            console.log("IfStatement test", test);
            if(test.type == "Literal") {
                var arguments = [];
                arguments.push(test.value);
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
                              
                    var param = this[test.type](test, paramsMeta[i], paramsDefMeta[i]);
                    console.log("IfStatement param", param);
                    if(param && param != null)
                        params.push(param);   
                }
              
            } else if (test.type == "BinaryExpression") {
                var param = this[test.type](test);
                console.log("IfStatement BinaryExpression param", param);
                if(param && param != null)
                    params.push(param);   
                
            }   

            if(params && params.length != 0) {
                structure.params = params;         
            }
        }

        console.log("IfStatement params result", params);

        if(alternate != null) {
            var altStmts = [];
            console.log("IfStatement alternate", alternate);
            var alternates = this[alternate.type](alternate);
            
            console.log("IfStatement alternate data", alternates);
            var alternatesData = alternates.data;
            for(var i in alternatesData) {
                var altData = alternatesData[i];
                if(altData) {
                    altStmts.push(altData); 
                }
            }
            if(altStmts.length != 0)
                structure.statements.push(altStmts);
        } 



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
                    
                if(consData.init) { //ForStatement Block
                    structure.type = consData.type; //ForStatement Type

                    console.log("IfStatement Check params", params);

                    if(params && params.length == 0) { //If this params is not "IfStatement"' params 
                        var declarations = consData.init.declarations;
                        console.log("IfStatement declarations", declarations);

                        for(var d in declarations) { //ForStatement Params
                            var declaration = declarations[d];
                            var param = declaration.init;

                            params.push(param); 
                        }

                        if(params && params.length != 0) {
                            structure.params = params;         
                        }

                        console.log("IfStatement consData Params", params);
                    }

                    if(consData.statements) { //ForStatement Statements
                        consStmts = consData.statements;
                    }
                }
                else if(consData.type) { //IfStatement Block 
                    consStmts.push(consData); //IfStatement Statements
                } 
            }

            if(consStmts.length != 0)
                structure.statements.push(consStmts);
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
        if(bodies) {
            for(var i in bodies) {
                if(i != 0) {
                    var bodyData = bodies[i];
                    console.log("ForStatement bodyData", bodyData, "index", i);
                    var stmtData = this[bodyData.type](bodyData);
                    console.log("ForStatement data", stmtData), "index", i;
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
        data.init = initData;

        console.log("VariableDeclarator initData", initData);

        result = data;

        console.log("VariableDeclarator result", result);
        return result;

    };

    
    p.BreakStatement = function(component) {
        console.log("BreakStatement component", component);
        var result;
        var structure = {};

        var syntax = String("break");
        var type = this.getBlockType(syntax);

        structure.type = type;
        result = structure;

        console.log("BreakStatement result", result);
        return result;
    };
    
    p.UnaryExpression = function(component) {
        console.log("UnaryExpression component", component);
        
        var params = [];
        var param;
        if(component.prefix){
            var operator = component.operator;
            var argument = component.argument;
            switch(operator){
                case "-": break;
                case "+": break;                    
                case "!": break;                    
                case "~": break;                
                case "typeof": break;                   
                case "void": break;                 
                case "delete": break;                   
                default: 
                    operator = operator;
            }
            var arg = operator.concat(argument.value);
            param  = arg;
            params.push(param);
        }

        result.params = params;

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
                var syntax = String("%1 and %3");
                break;
            case '||': 
                var syntax = String("%1 or %3");
                break;
            default: 
                var syntax = String("%1 and %3");
                break;
        }
        

        var type = this.getBlockType(syntax);

        var paramsMeta = Entry.block[type].params;
        console.log("LogicalExpression paramsMeta", paramsMeta);


        var params = [];
        var param;
           
        var left = component.left;
        if(left.type) {
            if(left.type == "Literal") {
                param = this[left.type](left, paramsMeta[0]);
                console.log("LogicalExpression left Literal param", param);
                if(param) 
                    params.push(param);
            } else {
                param = this[left.type](left);
                if(param) 
                    params.push(param);
            }
            console.log("LogicalExpression left param", param);
        } else {
            left = component.left;
            this[left.type](left);
        }

        operator = String(component.operator);
        console.log("LogicalExpression operator", operator);
        if(operator) {
            operator = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
            param = operator;
            params.push(param);
        }

        var right = component.right;
        if(right.type) {
            if(right.type == "Literal") {
                param = this[right.type](right, paramsMeta[2]);
                console.log("LogicalExpression right Literal param", param);
                if(param) 
                    params.push(param);
            } else {
                param = this[right.type](right);
                if(param) 
                    params.push(param);
            }
            
            console.log("LogicalExpression right param", param);
        } else {
            right = component.right;
            this[right.type](right);
        }

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
                var syntax = String("%1 %2 %3"); 
                break;
                       
            case "!=": 
                var syntax = String("%2 != True"); 
                break; break;               
            case "===": break;               
            case "!==": break;               
            case "<": 
                var syntax = String("%1 %2 %3"); 
                break;                 
            case "<=": 
                var syntax = String("%1 %2 %3"); 
                break;               
            case ">": 
                var syntax = String("%1 %2 %3"); 
                break;               
            case ">=": 
                var syntax = String("%1 %2 %3"); 
                break;                
            case "<<": break;              
            case ">>": break;               
            case ">>>": break;                
            case "+": 
                var syntax = String("(%1 %2 %3)"); 
                break;               
            case "-": 
                var syntax = String("(%1 %2 %3)"); 
                break;
            case "*": 
                var syntax = String("(%1 %2 %3)"); 
                break;                 
            case "/": 
                var syntax = String("(%1 %2 %3)"); 
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

            var paramsMeta = Entry.block[type].params;
            console.log("BinaryExpression paramsMeta", paramsMeta);


            var params = []; 
            var param;
               
            var left = component.left;

            console.log("BinaryExpression left", left);
            if(left.type) {
                if(left.type == "Literal") {
                    param = this[left.type](left, paramsMeta[0]);

                    console.log("BinaryExpression left Literal param", param);
                    if(param) 
                        params.push(param);
                } else {
                    param = this[left.type](left);
                    if(param) 
                        params.push(param);
                }
                console.log("BinaryExpression left param", param);
            } else {
                left = component.left;
                this[left.type](left);
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
            if(right.type) {
                if(right.type == "Literal") {
                    param = this[right.type](right, paramsMeta[2]);
                    console.log("BinaryExpression right Literal param", param);
                    if(param) 
                        params.push(param);
                } else {
                    param = this[right.type](right);
                    if(param) 
                        params.push(param);
                }
                
                console.log("BinaryExpression right param", param);
            } else {
                right = component.right;
                this[right.type](right);
            }

            if(type == "boolean_not") {
                params = [];
                params[0] = "";
                params[1] = this[left.type](left, paramsMeta[1]);
                params[2] = "";
            }

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
        var structure = {};

        var params = [];
        var param;
           
        var left = component.left;
        if(left.type) {
                param = this[left.type](left);
                console.log("AssignmentExpression left Literal param", param);
                if(param) 
                    params.push(param);

            console.log("AssignmentExpression left params", params);
        } else {
            left = component.left;
            this[left.type](left);
        }

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
            operator = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
            param = operator;
            params.push(param);
        }

        var right = component.right;
        if(right.type) {
            param = this[right.type](right);
            console.log("AssignmentExpression right Literal param", param);
            if(param) 
                params.push(param);
            console.log("AssignmentExpression right params", params);
        } else {
            right = component.right;
            this[right.type](right);
        }

        console.log("AssignmentExpression params", params);
        console.log("AssignmentExpression result", result);
        return result;
    };


    p.getBlockType = function(syntax) {
        return this.blockSyntax[syntax];
    };


    
    ///////////////////////////////////////////////////////////
    //Not Suported Syntax
    ///////////////////////////////////////////////////////////
    
    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration component", component);
        var result;

        console.log("FunctionDeclaration result", result);
        return component;
    };

    p.RegExp = function(component) {
        console.log("RegExp", component);
        var result;

        console.log("RegExp result", result);
        return component;
    };

    p.Function = function(component) {
        console.log("Function", component);
        var result;

        console.log("Function result", result);
        return component;
    };

    p.EmptyStatement = function(component) {
        console.log("EmptyStatement", component);
        var result;

        console.log("EmptyStatement result", result);
        return component;
    };

    p.DebuggerStatement = function(component) {
        console.log("DebuggerStatement", component);
        var result;

        console.log("DebuggerStatement result", result);
        return component;
    };

    p.WithStatement = function(component) {
        console.log("WithStatement", component);
        var result;

        console.log("WithStatement result", result);
        return component;
    };
    p.ReturnStaement = function(component) {
        console.log("ReturnStaement", component);
        var result;

        console.log("ReturnStaement result", result);
        return component;
    };

    p.LabeledStatement = function(component) {
        console.log("LabeledStatement", component);
        var result;

        console.log("LabeledStatement result", result);
        return component;
    };

    p.BreakStatement = function(component) {
        console.log("BreakStatement", component);
        var result;

        console.log("BreakStatement result", result);
        return component;
    };

    p.ContinueStatement = function(component) {
        console.log("ContinueStatement", component);
        var result;

        console.log("ContinueStatement result", result);
        return component;
    };

    p.SwitchStatement = function(component) {
        console.log("SwitchStatement", component);
        var result;

        console.log("SwitchStatement result", result);
        return component;
    };

    p.SwitchCase = function(component) {
        console.log("SwitchCase", component);
        var result;

        console.log("SwitchCase result", result);
        return component;
    };

    p.ThrowStatement = function(component) {
        console.log("ThrowStatement", component);
        var result;

        console.log("ThrowStatement result", result);
        return component;
    };

    p.TryStatement = function(component) {
        console.log("TryStatement", component);
        var result;

        console.log("TryStatement result", result);
        return component;
    };

    p.CatchClause = function(component) {
        console.log("CatchClause", component);
        var result;

        console.log("CatchClause result", result);
        return component;
    };

    p.DoWhileStatement = function(component) {
        console.log("DoWhileStatement", component);
        var result;

        console.log("DoWhileStatement result", result);
        return component;
    };

    p.FunctionDeclaration = function(component) {
        console.log("FunctionDeclaration", component);
        var result;

        console.log("FunctionDeclaration result", result);
        return component;
    };

    p.ThisExpression = function(component) {
        console.log("ThisExpression", component);
        var result;

        console.log("ThisExpression result", result);
        return component;
    };

    p.ArrayExpression = function(component) {
        console.log("ArrayExpression", component);
        var result;

        console.log("ArrayExpression result", result);
        return component;
    };

    p.ObjectExpression = function(component) {
        console.log("ObjectExpression", component);
        var result;

        console.log("ObjectExpression result", result);
        return component;
    };

    p.Property = function(component) {
        console.log("Property", component);
        var result;

        console.log("Property result", result);
        return component;
    };

    p.FunctionExpression = function(component) {
        console.log("FunctionExpression", component);
        var result;

        console.log("FunctionExpression result", result);
        return component;
    };

    p.ConditionalExpression = function(component) {
        console.log("ConditionalExpression", component);
        var result;

        console.log("ConditionalExpression result", result);
        return component;
    };

    p.NewExpression = function(component) {
        console.log("NewExpression", component);
        var result;

        console.log("NewExpression result", result);
        return component;
    };

    p.SequenceExpression = function(component) {
        console.log("SequenceExpression", component);
        var result;

        console.log("SequenceExpression result", result);
        return component;
    };
    
})(Entry.PyToBlockParser.prototype);