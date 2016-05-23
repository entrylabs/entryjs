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
        
        if(expression.type == "Literal") {
            var paramMeta = { type: "Block", accept: "booleanMagnet" };
            var expressionData = this[expression.type](expression, paramMeta);

            structure.type = expressionData.type;

            result = structure;
            console.log("ExpressionStatement type literal", result);
        }
        else {
            var expressionData = this[expression.type](expression);

            structure.type = expressionData.type;
            structure.params = expressionData.params;
                
            result = structure;
            console.log("ExpressionStatement type not literal", result);
        } 

        console.log("ExpressionStatement result", result);
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
            if(left.type == "Literal") {
                param = this[left.type](left, paramsMeta[0]);
                console.log("AssignmentExpression left Literal param", param);
                if(param) 
                    params.push(param);
            } else {
                param = this[left.type](left);
                if(param) 
                    params.push(param);
            }
            console.log("AssignmentExpression left param", param);
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
            if(right.type == "Literal") {
                param = this[right.type](paramsMeta[2], right);
                console.log("AssignmentExpression right Literal param", param);
                if(param) 
                    params.push(param);
            } else {
                param = this[right.type](right);
                if(param) 
                    params.push(param);
            }
            
            console.log("AssignmentExpression right param", param);
        } else {
            right = component.right;
            this[right.type](right);
        }

        console.log("AssignmentExpression params", params);
        console.log("AssignmentExpression result", result);
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

        console.log("CallExpression type1", type);
        
        if(!type) {
            if(syntax == "__pythonRuntime.functions.range") {
                var syntax = String("for i in range(%1):\n$1");
                type = this.getBlockType(syntax);
                //type = String("repeat_basic");
            }
            else if(syntax == "__pythonRuntime.ops.add") {
                if(typeof arguments[0].value == "number") {
                    var syntax = String("(%1 %2 %3)");
                    type = this.getBlockType(syntax);
                    //type = String("calc_basic");
                    argumentData = {raw:"PLUS", type:"Literal", value:"PLUS"};
                    arguments.splice(1, 0, argumentData);
                } else if(typeof arguments[0].value == "string") {
                    var syntax = String("%2 + %4");
                    type = this.getBlockType(syntax);
                    //type = String("combine_somethig");
                } 
            }
            else if(syntax == "__pythonRuntime.ops.multiply"){
                var syntax = String("(%1 %c %3)");
                type = this.getBlockType(syntax);
                //type = String("calc_basic");
                argumentData = {raw:"MULTI", type:"Literal", value:"MULTI"};
                arguments.splice(1, 0, argumentData);
                
            } 
            else if(syntax == "__pythonRuntime.functions.len") {
                var syntax = String("len(%2)");
                type = this.getBlockType(syntax);
            }
        }

        console.log("CallExpression type2", type);

        var paramsMeta = Entry.block[type].params;
        console.log("CallExpression paramsMeta", paramsMeta);
    
        
        
        var params = [];

        console.log("CallExpression componet.arguments", arguments);
        console.log("CallExpression paramsMeta", paramsMeta);
        
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
            
            if(argument.type == "Literal") {           
                console.log("CallExpression argument index", argument.type, i);
                var param = this[argument.type](argument, paramsMeta[i], type, i);
                params.push(param); 
                
                console.log("CallExpression i", i);
                        
            }
            else {
                //To Do : when argument.type is not "Literal"
            }
        }
      
        console.log("CallExpression params", params);
        
        data.type = type;
        data.params = params;

        result = data;

        console.log("CallExpression result", result);
        return result;
    };

    p.Literal = function(component, paramMeta, blockType, particularIndex) {
        console.log("Literal component paramMeta bockType particularIndex", component, paramMeta, blockType, particularIndex);
        var result;

        var value = component.value;

        if(paramMeta) {
            if(paramMeta.type == "Indicator") { 
                var param = null;
                result = param;
                return result; 
            } else if(paramMeta.type == "Text") {
                var param = "";
                result = param;
                return result;
            }
        }

        if(value != undefined && value != null) {
            console.log("Literal value", value);
            if(paramMeta) {
                if(blockType)
                    var param = this['Param'+paramMeta.type](value, paramMeta, blockType, particularIndex);
                else 
                    var param = this['Param'+paramMeta.type](value, paramMeta);
            } else {
                var param = value;
            }
            result = param;
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

    /*p.ParamText = function(value, paramMeta) {
        console.log("ParamText value, paramMeta", value, paramMeta);
        var result;

        if(value == "mouse" || value == "wall" || value == "wall_up" || 
            value == "wall_down" || value == "wall_right" || value == "wall_left")
                return value;
        
        var options = paramMeta.options;
        for(var i in options) {
            console.log("options", options);
            if(value == options[i][0]){
                console.log("options[i][0]", options[i][0]);
                result = options[i][1];
                break;
            }
        }
        
        
        console.log("ParamDropdownDynamic result", result);

        return result;
    };*/

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
        
        result = value;
        
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

    p.ParamBlock = function(value, paramMeta, blockType, particularIndex) {
        console.log("ParamBlock value, paramMeta blockType particularIndex", value, paramMeta, blockType, particularIndex);
        var result;
        var structure = {};
        
        var type;
        var params = [];

        var particularTypeResult = Entry.TextCodingUtil.prototype.particularParam(blockType);

        if(particularTypeResult != null) {
            var particularType = particularTypeResult[particularIndex];

            if(particularType) {
                var particularType = particularTypeResult[particularIndex];

                console.log("ParamBlock particularType", particularType);
                
                var valueType = particularType;

                structure.type = valueType;

                var paramsMeta = Entry.block[valueType].params;
                console.log("ParamBlock particular block paramsMeta", paramMeta);
                var param;
                for(var i in paramsMeta) {
                    var paramMeta = paramsMeta[i];
                    var options = paramMeta.options;
                    for(var j in options) {
                        var option = options[j];
                        if(value == option[0]) 
                            param = option[1];
                    }
                }
                params.push(param);
                structure.params = params;
            } else {
                var valueType = typeof value;
                switch(valueType) {
                    case 'number':
                        structure.type = "number";
                        params.push(value);
                        structure.params = params;
                        break;
                    case 'boolean': 
                        if(value == true) {
                            structure.type = "True";
                        }
                        else if(value == false) {
                            structure.type = "False";
                        }
                        break;
                    default: 
                        structure.type = "text";
                        params.push(value);
                        structure.params = params;  
                }
            }

        } else {
            var valueType = typeof value;
            switch(valueType) {
                case 'number':
                    structure.type = "number";
                    params.push(value);
                    structure.params = params;
                    break;
                case 'boolean': 
                    if(value == true) {
                        structure.type = "True";
                    }
                    else if(value == false) {
                        structure.type = "False";
                    }
                    break;
                default: 
                    structure.type = "text";
                    params.push(value);
                    structure.params = params;  
            }
        } 

        console.log("ParamBlock valueType", valueType);
        
        

        result = structure;

        console.log("ParamBlock result", result);

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
        this._blockStatments = [];

        var result;
        var structure = {};
        var statements = [];
        var bodies = component.body;
        console.log("block body", bodies);


        for(var i in bodies) {
            var body = bodies[i];
            console.log("BlockStatement body", body);
            if(body.type == "ExpressionStatement") {
                var bodyData = this[body.type](body);
                console.log("bodyData", bodyData);
                this._blockStatments.push(bodyData);
            } else if(body.type != "ForStatement") {
                    
                var bodyData = this[body.type](body);
                if(bodyData.type) {
                    this._blockStatments.push(bodyData);
                    console.log("body block", bodyData);

                }
                if(bodyData.declarations) {
                    var declaration = bodyData.declarations[0];
                    
                    structure.params = declaration.init.params;
                    structure.type = declaration.init.type;
                    console.log("BlockStatement structure", structure);

                } else if(bodyData != "ForInStatement") {
                    if(bodyData.type) {
                        //var bodyData = this[bodyData.type](bodyData);
                        console.log("final", bodyData);
                        if(bodyData.body) {
                            var bodyData = this[bodyData.type](bodyData);
                            var bodies = bodyData.body.body;
                            for(var s in bodies) {
                                var body = bodies[s];
                                var stmtData = this[body.type](body);
                                console.log("Ex stmtData big", stmtData);
                                
                                        if(stmtData.type) {
                                            this._blockStatments.push(stmtData);
                                            console.log("BlockStatement stmtData", stmtData, "index", this._blockStatmentIndex);
                                            
                                        }
                            }
                            this._blockStatments.splice(0, this._blockStatments.length/2);
                            return;
                        }
                    }
                }
                
            } 
        } 
        
        
        console.log("BlockStatement structure", structure);
        console.log("BlockStatement statements", this._blockStatments, "global index", this._blockStatmentIndex);
        console.log("BlockStatement total index", this._blockStatmentIndex, "structure", structure, "stmt", this._blockStatments); 
        this._blockStatmentIndex++;
        
        
      
        

        
        structure.statements = [this._blockStatments];
        result = structure;

        console.log("BlockStatement statement result", result, "index", this._blockStatmentIndex);
        

        //this._blockStatmentIndex++;

        return result;

         
    };

    

    p.IfStatement = function(component) {

        console.log("IfStatement component", component);
        var result;
        var structure = {};
        structure.statements = [];
        

        var type;
        var params = [];
        var consequentStatements = [];
        var alternateStatements = [];

        var test = component.test;
        var alternate = component.alternate;
        var consequent = component.consequent;
        
        if(test != null){

            var params = [];

            if(test.type = "Literal") {
                if(test.value) {
                    if(alternate == null) {
                        var syntax = String("if %1:\n$1");
                        var type = this.getBlockType(syntax);
                    } else {
                        var syntax = String("if %1:\n$1\nelse:\n$2");
                        var type = this.getBlockType(syntax);
                    }
                    structure.type = type;

                    var paramsMeta = Entry.block[type].params;
                    console.log("IfStatement paramsMeta", paramsMeta); 

                    var param = this[test.type](test, paramsMeta[0]);
                    params.push(param);
                    console.log("IfStatement param", param);
                    params.push(null);

                    /*var paramMeta = paramsMeta[0];
                    if(paramMeta.type == "Indicator") {
                        var param = null;
                    }
                    else {
                        var param = this[test.type](test, paramMeta);
                    }
                    params.push(param);*/
                } else {
                    //test doesn't have value - (ex) when test is binary expression
                    /*var paramArr = this[test.type](test, paramMeta);
                    params = paramArr;
                    console.log("IfStatement paramArr", params);*/
                    var leftData = this[test.left.type](test.left);
                    var operator = test.operator;
                    var rightData = this[test.right.type](test.right);
                    var testLiteral = leftData.concat(' ').concat(operator).concat(' ').concat(rightData);
                    structure.test = testLiteral;

                }           
            }
            else {
                //To Do : when argument.type is not "Literal" 
            }       
        }

        if(consequent != null) {
            var consequentData = this[consequent.type](consequent);
            console.log("IfStatement consequentData", consequentData);
            if(consequentData) {
                structure.statements.push(consequentData.statements[0]);
            }
        } 

        if(alternate != null) {
            var alternateData = this[alternate.type](alternate);
            console.log("IfStatement alternateData", alternateData);
            if(alternateData) {
                structure.statements.push(alternateData.statements[0]);
            }    
        } 

        
        console.log("IfStatement params", params);

        /*if(params.length != 0)
            structure.params = params;
        if(statements.length != 0)
            structure.statements.push(statements);*/

        structure.params = params;


        result = structure;

        console.log("IfStatement result", result);
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
        structure.params = [];

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

        console.log("BinaryExpression params", params);
        //result = { type: blockType, params: params };

        structure.type = type;
        structure.params = params;

        result = structure;
        
        console.log("BinaryExpression result", result);
        return result;
    };

    p.ForStatement = function(component) {
        console.log("ForStatement component", component);
        var result;
        var data = {};
        data.statements = [];

        var body = component.body;
        console.log("ForStatement body", body);
        
        var bodyData = this[body.type](body);
        data.body = data.bodyData;
        /*for(var i in bodies) {
            var body = bodies[i];
            var bodyData = this[body.type](body);
            data.statements.push(bodyData);
            console.log("ForStatement bodyData", bodyData);
        }*/

        console.log("ForStatement statements", data.statements);

        var init = component.init;
        if(init)
            var initData = this[init.type](init);
        data.init = initData; 

        console.log("ForStatement init", data.init);

        var test = component.test;
        console.log("ForStatement test type", test.type);
        if(test)
            var testData = this[test.type](test);
        data.test = testData;

        console.log("ForStatement test", data.test);

        var update = component.update;
        if(update) 
            var updateData = this[update.type](update);
        console.log("ForStatement updateData", updateData);
        data.update = updateData;

        console.log("ForStatement update", data.update);

        result = data;
        
        console.log("ForStatement result", result);
        return component;
    };

    p.ForInStatement = function(component) {
        console.log("ForInStatement component", component);
        var result;
        var data = {};
        data.statements = [];

        var body = component.body;
        console.log("ForInStatement body", body);
        
        var bodyData = this[body.type](body);
        data.body = data.bodyData;

        var left = component.left;
        if(left) {
            var leftData = this[left.type](left);
        }
        data.left = leftData;

        var right = component.right;
        if(right) {
            var rightData = this[right.type](right);
        }
        data.right = rightData;

        result = data;

        console.log("ForInStatement result", result);
        return component;
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