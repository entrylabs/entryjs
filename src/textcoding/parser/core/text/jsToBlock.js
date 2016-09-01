/*
 *
 */
"use strict";

goog.provide("Entry.JsToBlockParser");
goog.require("Entry.TextCodingUtil");

Entry.JsToBlockParser = function(syntax) {
    this.syntax = syntax;

    this.scopeChain = [];
    this.scope = null;

    this._blockCount = 0;
    this._blockInfo = {};
};

(function(p){
    p.Program = function(astArr) {
        var code = [];
        var thread = []; 

        thread.push({
            type: this.syntax.Program
        });
        
        for(var index in astArr) { 
            var node = astArr[index];
            if(node.type != 'Program') return;
            
            //block statement
            var separatedBlocks = this.initScope(node);
            var blocks = this.BlockStatement(node);

            for(var i in blocks) {
                var block = blocks[i];
                
                thread.push(block);
            }

            this.unloadScope();
            if(thread.length != 0)
                code.push(thread);    
        }
        return code;
    };

    p.Identifier = function(node) {
        return node.name;
    };

    p.Literal = function(node, type) {
        ////console.log("literal node", node, "type", type);
        if(node.value === true)
            return {type:'True'};
        else if(node.value === false)
            return {type:'False'};
         
        if(type == "ai_distance_value")
            return node.value;
        else if(type == "ai_boolean_object")
            return node.value;
        else
            return {type: 'text', params: [node.value] };
    };

    // Statement
    p.ExpressionStatement = function(node) {
        var expression = node.expression;
        return this[expression.type](expression);
    };

    p.ForStatement = function(node) { 
        var init = node.init,
            test = node.test,
            update = node.update,
            body = node.body;

        var contents = "";

        var blockType = this.syntax.ForStatement;

        if (!blockType) {
            body = this[body.type](body);

            var startVal = init.declarations[0].init.value;
            var test = test;
            var op = test.operator;
            var endVal = test.right.value;
            var updateOp = update.operator;

            var res = 0;
            if(!(updateOp == '++')){
                var temp = startVal;
                var startVal = endVal;
                var endVal = temp;
            }

            switch (op) {
                case '<':
                    res = endVal - startVal;
                break;

                case '<=':
                    res = ((endVal+1) - startVal);
                break;

                case '>':
                    res =  startVal - endVal;
                break;

                case '>=':
                    res = ((startVal+ 1) - endVal);
                break;
            }

            return this.BasicIteration(node, res, body);
        } else {
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : node
            };
        }
    };

    p.BlockStatement = function(node) {
        var blocks = [];
        var body = node.body;

        for (var i = 0; i < body.length; i++) {
            var bodyData = body[i];
            var block = this[bodyData.type](bodyData);

            if(!Entry.TextCodingUtil.prototype.hasBlockInfo(bodyData, this._blockInfo))
                this._blockCount++;

            Entry.TextCodingUtil.prototype.updateBlockInfo(bodyData, this._blockInfo);
            
            if(!block) {  
                continue;
            }
            else if(block.type === undefined) {
                throw {
                    title : '블록변환 오류',
                    message : '지원하지 않는 블록입니다.',
                    node : bodyData,
                    blockCount : this._blockCount
                };
            }
            else if(Entry.TextCodingUtil.prototype.isParamBlock(block)) { 
              
                /*throw {
                    title : '파라미터 블록 오류',
                    node : node,
                    blockCount : this._blockCount
                };*/
            }
            else if (block) {
                blocks.push(block);
            }
        }

        return blocks;
    };

    p.EmptyStatement = function(node) {
        ////console.log("EmptyStatement", node);
        throw {
            message : 'empty는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.DebuggerStatement = function(node) {
        ////console.log("DebuggerStatement", node);
        throw {
            message : 'debugger는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.WithStatement = function(node) {
        ////console.log("WithStatement", node);
        var object = node.object,
            body = node.body;

        throw {
            message : 'with는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    //control flow
    p.ReturnStaement = function(node) {
        ////console.log("ReturnStaement", node);
        var args = node.arguments;

        throw {
            message : 'return은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.LabeledStatement = function(node) {
        ////console.log("LabeledStatement", node);
        var label = node.label,
            body = node.body;

        throw {
            message : 'label은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.BreakStatement = function(node) {
        ////console.log("BreakStatement", node);
        var label = node.label;

        throw {
            message : 'break는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.ContinueStatement = function(node) {
        ////console.log("ContinueStatement", node);
        var label = node.label;

        throw {
            message : 'continue는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.IfStatement = function(node) {
        //console.log("IfStatement", node);
        var test = node.test,
            consequent = node.consequent,
            alternate  = node.alternate;

        var blockType = this.syntax.BasicIf;
        if (blockType) {
            ////console.log("IfStatement return", this.BasicIf(node));
            return this.BasicIf(node);
        } else {
            throw {
                message : 'if는 지원하지 않는 표현식 입니다.',
                node : node
            };
        }

    };

    p.SwitchStatement = function(node) {
        ////console.log("SwitchStatement", node);
        var discriminant = node.discriminant,
            cases = node.cases;

        throw {
            message : 'switch는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.SwitchCase = function(node) {
        ////console.log("SwitchCase", node);
        var test = node.test,
            consequent = node.consequent;

        throw {
            message : 'switch ~ case는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    //throwstatement

    p.ThrowStatement = function(node) {
        ////console.log("ThrowStatement", node);
        var args = node.arguments;

        throw {
            message : 'throw는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.TryStatement = function(node) {
        ////console.log("TryStatement", node);
        var block = node.block,
            handler = node.handler,
            finalizer = node.finalizer;

        throw {
            message : 'try는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.CatchClause = function(node) {
        ////console.log("CatchClause", node);
        var param = node.param,
            body = node.body;

        throw {
            message : 'catch는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.WhileStatement = function(node) {
        ////console.log("WhileStatement", node);
        var test = node.test,
            body = node.body;
        var blockType = this.syntax.WhileStatement;
        body = this[body.type](body);

        if (!blockType) {
            return this.BasicWhile(node, body);
        } else {

            throw {
                message : 'while은 지원하지 않는 표현식 입니다.',
                node : node
            };
        }
    };

    p.DoWhileStatement = function(node) {
        ////console.log("DoWhileStatement", node);
        var body = node.body,
            test = node.test;

        throw {
            message : 'do ~ while은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };


    p.ForInStatement = function(node) {
        ////console.log("ForInStatement", node);
        var left = node.left,
            right = node.right,
            body = node.body;

        throw {
            message : 'for ~ in은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    //Declaration

    p.FunctionDeclaration = function(node) {
        ////console.log("FunctionDeclaration", node);
        var id = node.id;

        var blockType = this.syntax.FunctionDeclaration;

        if (!blockType) {
            return null;
        } else {
            throw {
                message : 'function은 지원하지 않는 표현식 입니다.',
                node : node
            };
        }
    };

    p.VariableDeclaration = function(node) {
        ////console.log("VariableDeclaration", node);
        var declaration = node.declarations,
            kind = node.kind;

        throw {
            message : 'var은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    // Expression
    p.ThisExpression = function(node) {
        ////console.log("ThisExpression", node);
        return this.scope.this;
    };

    p.ArrayExpression = function(node) {
        ////console.log("ArrayExpression", node);
        var elements = node.elements;

        throw {
            message : 'array는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.ObjectExpression = function(node) {
        ////console.log("ObjectExpression", node);
        var property = node.property;

        throw {
            message : 'object는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.Property = function(node) {
        ////console.log("Property", node);
        var key = node.key,
            value = node.value,
            kind = node.kind;

        throw {
            message : 'init, get, set은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.FunctionExpression = function(node) {
        ////console.log("FunctionExpression", node);
        throw {
            message : 'function은 지원하지 않는 표현식 입니다.',
            node : node
        };
    };
    // unary expression

    p.UnaryExpression = function(node) {
        ////console.log("UnaryExpression", node);
        var operator = node.operator,
            prefix = node.prefix,
            args  = node.argument;

        throw {
            message : operator + '은(는) 지원하지 않는 명령어 입니다.',
            node : node
        };
    };

    p.UnaryOperator = function(){
        return  ["-" , "+" , "!" , "~" , "typeof" , "void" , "delete"];
    };

    p.updateOperator = function() {
        return ["++" , "--"];
    };

    //Binary expression
    p.BinaryOperator = function() {
        return [
            "==" , "!=" , "===" , "!==",
            "<" , "<=" , ">" , ">=",
            "<<" , ">>" , ">>>",
            "+" , "-" , "*" , "/" , "%",
            "," , "^" , "&" , "in",
            "instanceof"
        ];
    };

    p.AssignmentExpression = function(node) {
        var operator = node.operator,
            left = node.left,
            right = node.right;

        throw {
            message : operator + '은(는) 지원하지 않는 명령어 입니다.',
            node : node
        };
    };

    p.AssignmentOperator = function() {
        return [
            "=" , "+=" , "-=" , "*=" , "/=" , "%=",
            "<<=" , ">>=" , ">>>=",
            ",=" , "^=" , "&="
        ];
    };

    p.BinaryExpression = function(node) {
        ////console.log("BinaryExpression node", node);
        
        var result = {};
        var structure = {}; 

        var operator = String(node.operator);  
        var nodeName = node.left.name;

        switch(operator){ 
            case "==": 
                if(nodeName == "object_up" || nodeName == "object_right" || nodeName == "object_down")
                    var type = "ai_boolean_object";
                else if(nodeName == "radar_up" || nodeName == "radar_right" || nodeName == "radar_down")
                    var type = "ai_boolean_distance";
                else
                    var type = null;
                break;         
            case "<": 
                var type = "ai_boolean_distance";
                break;                 
            case "<=": 
                var type = "ai_boolean_distance"; 
                break;               
            case ">": 
                var type = "ai_boolean_distance";
                break;               
            case ">=": 
                var type = "ai_boolean_distance";
                break;                
                             
            default: 
                operator = operator;
        }

        if(type) {
            //console.log("BinaryExpression type", type);

            var params = []; 
            var left = node.left;
            
            if(left.type == "Literal" || left.type == "Identifier") {
                var arguments = [];
                arguments.push(left);
                var paramsMeta = Entry.block[type].params;
                
                ////console.log("BinaryExpression paramsMeta", paramsMeta);

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
                    ////console.log("BinaryExpression argument", argument);
                              
                    var param = this[argument.type](argument);
                    ////console.log("BinaryExpression param", param);
                    param = Entry.TextCodingUtil.prototype.radarVariableConvertor(param);

                    if(param && param != null)
                        params.push(param);   
                }
            } else {
                param = this[left.type](left);
                param = Entry.TextCodingUtil.prototype.radarVariableConvertor(param);
                if(param) 
                    params.push(param);
            }
            
            operator = String(node.operator);
            if(operator) {
                operator = Entry.TextCodingUtil.prototype.jTobBinaryOperatorConvertor(operator);
                param = operator;
                if(param)
                    params.push(param);

                structure.operator = operator;
            }

            var right = node.right;
           
            if(right.type == "Literal" || right.type == "Identifier") {
                var arguments = [];
                arguments.push(right);
                var paramsMeta = Entry.block[type].params;

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
                    var param = this[argument.type](argument);

                    ////console.log("param1", param, "type", type);

                    if(typeof param == "string") {
                        var nameTokens = param.split("_");

                        if(nameTokens[0] == 'radar') {
                            var result = {};
                            result.type = "ai_distance_value";
                            result.params = [];
                            result.params.push(nameTokens[1].toUpperCase());
                            param = result;
                        } 
                    }
                    
                    if(param && param != null) {
                        ////console.log("typebbb", type, "parambbb", param);
                        if(type == "ai_boolean_object") {
                            param = param.params[0];
                            params.splice(1, 1); 
                            ////console.log("param vvv", param);
                        }

                        param = Entry.TextCodingUtil.prototype.tTobDropdownValueConvertor(param);

                        params.push(param);   
                    }
                }
            } else {
                param = this[right.type](right);
                if(type == "ai_boolean_object") {
                    param = param.params[0];
                    params.splice(1, 1); 
                }

                if(param) 
                    params.push(param);
            }   

            structure.type = type;
            structure.params = params;
            ////console.log("be structure", structure);
        } else {
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : node.test
            };
        }

        result = structure;
        
        return result;
    };

    p.LogicalExpression = function(node) {
        var result;
        var structure = {};

        var operator = String(node.operator);
        
        switch(operator){
            case '&&': 
                var type = "ai_boolean_and";
                break;
            default: 
                var type = "ai_boolean_and";
                break; 
        }

        var params = [];    
        var left = node.left;
        
        if(left.type == "Literal" || left.type == "Identifier") {
            var arguments = [];
            arguments.push(left);
            var paramsMeta = Entry.block[type].params;

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
                var param = this[argument.type](argument);
                if(param && param != null)
                    params.push(param);   
            }
        } else {
            param = this[left.type](left);
            if(param) 
                params.push(param);
        }
        
        operator = String(node.operator);
        if(operator) {
            operator = Entry.TextCodingUtil.prototype.logicalExpressionConvert(operator);
            param = operator;
            params.push(param);
        }

        var right = node.right;
       
        if(right.type == "Literal" || right.type == "Identifier") {
            var arguments = [];
            arguments.push(right);
            var paramsMeta = Entry.block[type].params;
            //var paramsDefMeta = Entry.block[type].def.params;

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
                var param = this[argument.type](argument);
                
                if(param && param != null)
                    params.push(param);    
            }
        } else {
            param = this[right.type](right);
            if(param) 
                params.push(param);
        }

        structure.type = type;
        structure.params = params;
        
        result = structure;
        return result;
    };

    p.LogicalOperator = function() {
        return ["||" , "&&"];
    };

    p.MemberExpression = function(node) {
        var object = node.object,
            property = node.property,
            computed = node.computed;

        //console.log(object.type)
        object = this[object.type](object);
        //console.log(object);

        property = this[property.type](property, object);

        if(!(Object(object) === object && Object.getPrototypeOf(object) === Object.prototype)) {
            throw {
                message : object + '은(는) 잘못된 멤버 변수입니다.',
                node : node
            };
        }

        var blockType = property;
        if(!blockType) {
            throw {
                message : property + '이(가) 존재하지 않습니다.',
                node : node
            };
        }
        return blockType;
    };

    p.ConditionalExpression = function(node) {
        var test = node.test,
            alternate = node.alternate,
            consequent = node.consequent;

        throw {
            message : '지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.UpdateExpression = function(node) {
        var operator = node.operator,
            args = node.argument,
            prefix = node.prefix;

        throw {
            message : operator + '은(는) 지원하지 않는 명렁어 입니다.',
            node : node
        };
    };

    p.CallExpression = function(node) {
        ////console.log("CallExpression node", node);
        var callee = node.callee,
            args = node.arguments;
        var params = [];
        var blockType = this[callee.type](callee);
        ////console.log("blockType", blockType);

        var type = this.syntax.Scope[blockType];
        var block = Entry.block[type];
        ////console.log("callex block", block);

        for(var i = 0; i < args.length; i++) {
            var arg = args[i];
            var value = this[arg.type](arg, type);
            ////console.log("value", value);

            if(block.params[i].type == "Dropdown") {
                var paramBlock = value;
                ////console.log("Dropdown block", value);
                params.push(paramBlock);
            }
            else if(block.params[i].type === 'Block') {
                if(typeof value == 'string') {
                    var paramBlock = {type: 'text', params:[value]};
                } else if (typeof value == 'number') {
                    var paramBlock = {type: 'number', params:[value]};
                } else {
                    var paramBlock = value;
                } 

                params.push(paramBlock);
            }
            else {
                ////console.log("value", value);
                params.push(value);
            }
        }

        return {
            type: type,
            params: params
        };
    };

    p.NewExpression = function(node) {
        throw {
            message : 'new는 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    p.SequenceExpression = function(node) {
        var expressions = node.expressions;

        throw {
            message : 'SequenceExpression 지원하지 않는 표현식 입니다.',
            node : node
        };
    };

    // scope method
    p.initScope = function(node) {
        if (this.scope === null) {
            var scoper = function() {};
            scoper.prototype = this.syntax.Scope;
            this.scope = new scoper();
        } else {
            var scoper = function() {};
            scoper.prototype = this.scope;
            this.scope = new scoper();
        }

        this.scopeChain.push(this.scope);
        return this.scanDefinition(node);
    };

    p.unloadScope = function() {
        this.scopeChain.pop();
        if (this.scopeChain.length)
            this.scope = this.scopeChain[this.scopeChain.length - 1];
        else
            this.scope = null;
    };

    p.scanDefinition = function(node) {
        var body = node.body;
        var separatedBlocks = [];
        for (var i = 0; i < body.length; i++) {
            var childNode = body[i];
            if (childNode.type === "FunctionDeclaration") {
                this.scope[childNode.id.name] = this.scope.promise;
                if (this.syntax.BasicFunction) {
                    var childBody = childNode.body;
                    separatedBlocks.push([{
                        type: this.syntax.BasicFunction,
                        statements: [this[childBody.type](childBody)]
                    }]);
                }
            }
        }
        return separatedBlocks; 
    };

    p.BasicFunction = function(node, body) {
        ////console.log("BasicFunction node", node);
        return null;
    };

    // custom node parser
    p.BasicIteration = function(node, iterCount, body) {
        ////console.log("BasicIteration node", node);
        if(iterCount > 10) {
            throw {
                message : '반복 숫자값이 10을 넘으면 안됩니다.',
                node : node.test
            };
        }

        var blockType = this.syntax.BasicIteration;
        if (!blockType)
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : node
            };
        return {
            params: [iterCount],
            type: blockType,
            statements: [body]
        };
    };

    p.BasicWhile = function(node, body) {
        ////console.log("BasicWhile node", node);
        var raw = node.test.raw;
        if (this.syntax.BasicWhile[raw]) {
            return {
                type: this.syntax.BasicWhile[raw],
                statements: [body]
            }
        } else {
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : node.test
            };
        }
    };

    p.BasicIf = function(node) { 
        //console.log("BasicIf node", node);  
        var result = {};
        result.params = [];
        result.statements = [];
        var type;
        var stmtCons = [];
        var stmtAlt = [];
        var params = [];
        var cons = node.consequent;
        if(cons)
            var consequent = this[cons.type](cons);
        
        var alt = node.alternate;
        if(alt)
            var alternate = this[alt.type](alt);

        try{
            var test = ''; 
            if(node.test.operator)
                var operator = (node.test.operator === '===') ? '==' : node.test.operator;
            else 
                var operator = null;

            if(node.test.left && node.test.right)
                var testCondition = node.test.left.name + node.test.right.value;
            else
                var testCondition = null;

            if(testCondition == "frontwall" && (operator == "==")) {
                test = "front == \'wall\'";
                type = this.syntax.BasicIf[test];
            } else if(testCondition == "fronthump" && (operator == "==")) {
                test = "front == \'hump\'";
                type = this.syntax.BasicIf[test];
            } else if(testCondition == "frontstone" && (operator == "==")) {
                test = "front == \'stone\'";
                type = this.syntax.BasicIf[test]; 
            } else if(testCondition == "frontbee" && (operator == "==")) {
                test = "front == \'bee\'";
                type = this.syntax.BasicIf[test]; 
            } else {
                if(node.test.value || (node.test.left && node.test.right)) {
                    type = "ai_if_else";
                    var callExData = this[node.test.type](node.test, this.syntax.Scope);
                    console.log("callExData", callExData);
                    var value = callExData.params[2];

                    if(typeof value.params[0] != "number" && value.type != "ai_distance_value") {
                        throw {
                            message : '지원하지 않는 표현식 입니다.',
                            node : node.test
                        };
                    }
                    params.push(callExData);
                } else {
                    throw {
                        message : '지원하지 않는 표현식 입니다.',
                        node : node.test
                    };
                }

            }
            
            if (type) {    
                if(consequent && consequent.length != 0){
                    stmtCons = consequent;
                    result.statements.push(stmtCons);
                }

                if(alternate && alternate.length != 0) {
                    stmtAlt = alternate;
                    result.statements.push(stmtAlt);
                }

                if(type)
                    result.type = type;
                if(params && params.length != 0)
                    result.params = params;
                
                return result;
            } else {
                if(consequent && consequent.length != 0)
                    stmtCons = consequent;

                if(alternate && alternate.length != 0)
                    stmtAlt = alternate;

                if(type)
                    result.type = type;
                if(params && params.length != 0)
                    result.params = params;
                
                result.statements = [stmtCons, stmtAlt];
                
                return result;
                //throw new Error();
            }
        } catch (e) {
            throw {
                message : '지원하지 않는 표현식 입니다.',
                node : node.test
            };
        }
    };
})(Entry.JsToBlockParser.prototype);
