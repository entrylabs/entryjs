/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.PyBlockAssembler");

Entry.PyToBlockParser = function(blockSyntax) {
    this._assembler = new Entry.PyBlockAssembler(blockSyntax);
};

(function(p){
    p.Program = function(node) {
        if(node.type != 'Program') return;
        var code = [];
        var thread = []; 

        var nodes = node.body;

        for(var index in nodes) {
            var node = nodes[index];
            var unit = this[node.type](node);
            console.log("checkitout", unit);
            
            var block = this._assembler.assemble(unit);

            thread.push(block);
        }

        code.push(thread);

        return code;
    };

    p.Identifier = function(node) {
        console.log("Identifier", node);
        var name = node.name;
        return {
            type: node.type,
            name: name
        };
    };

    p.Literal = function(node) {
        console.log("Literal", node);
        console.log("typeof node at Literal", typeof node.value);

        var value;
        if(typeof node.value === 'string') {
            value = node.value; 
        } 
        else if(typeof node.value === 'boolean') {
            value = node.value;
        } 
        else if(typeof node.value === null) {
            value = node.value;
        }
        else if(typeof node.value === 'number') {
            value = node.value;
        } 
        else if(typeof node.value === 'RegExp') {
            var value = this[typeof node.value](node);
            value = value.regex.pattern;
        }
        else {
            value = null;
        }

        console.log("value", value);

        return {
            type: node.type,
            value: value 
        };

    };

    p.RegExp = function(node) {
        console.log("RegExp", node);
        var regex = node.regex;
        return {
            regex: regex
        };
    };

    p.Function = function(node) {
        console.log("Function", node);
        var id = this[node.id](node);
        
        var params = [];
        for(var index in node.params){
            var param = node.params[index];
            params.push(param);
        }

        var body = this[node.body](node);

        return {
            id: id,
            params: params,
            body: body
        };
    };

    p.ExpressionStatement = function(node) {
        var expression = this[node.expression.type](node.expression);

        return { 
            type: node.type,
            expression: expression,
        }    
    };

    p.BlockStatement = function(node) {
       console.log("BlockStatement", node);
       var bodies = [];
       for(var index in node.body) {
            var statement = node.body[index];
            console.log("statement", statement);
            var body = this[statement.type](statement);
            console.log("body222", body);
            bodies.push(body);
        }
        console.log("bodies", bodies);
        return {
            type: node.type,
            body: bodies 
        };
    };

    p.EmptyStatement = function(node) {
        console.log("EmptyStatement", node);
        return {
            type: node.type
        };
    };

    p.DebuggerStatement = function(node) {
        console.log("DebuggerStatement", node);
        return {
            type: node.type
        };
    };

    p.WithStatement = function(node) {
        console.log("WithStatement", node);
        var object = this[node.object.type](node.object);
        var body = this[node.body.type](node.body);

        return {
            type: node.type,
            object: object,
            body: body
        };
    };

    p.ReturnStaement = function(node) {
        console.log("ReturnStaement", node);
        var argument;
        if(node.argument === null) 
            argument = null;
        else 
            argument = this[node.argument.type](node.argument);

        return {
            type: node.type,
            argument: argument
        };
    };

    p.LabeledStatement = function(node) {
        console.log("LabeledStatement", node);
        var label = this[node.label.type](node.label);
        var body = this[node.body.type](node.body);

        return {
            type: node.type,
            label: label,
            body: body
        };
    };

    p.BreakStatement = function(node) {
        console.log("BreakStatement", node);
        var label;
        if(node.label === null)
            label = null;
        else 
            label = this[node.label.type](node.label);

        return {
            type: node.type,
            label: label
        };
    };

    p.ContinueStatement = function(node) {
        console.log("ContinueStatement", node);
        var label;
        if(node.label === null)
            label = null;
        else 
            label = this[node.label.type](node.label);

        return {
            type: node.type,
            label: label
        };
    };

    p.IfStatement = function(node) {
        console.log("IfStatement", node);
        var test = this[node.test.type](node.test);

        var alternate = {};
        alternate.body = [];
        if(node.alternate === null) {
            alternate = null;
        }
        else {
            for(var index in node.alternate.body) {
                var body = node.alternate.body[index];
                if(body.type == 'ForInStatement') {
                    var a = this[body.body.type](body.body);
                } else if(body.type == 'ExpressionStatement') {
                    var a = this[body.type](body);
                }
                alternate.body.push(a);
            }
        }

        var consequent = {};
        consequent.body = [];
        for(var index in node.consequent.body) {
            var body = node.consequent.body[index];
            if(body.type == 'ForStatement') {
                var c = this[body.body.type](body.body);
            } else if(body.type == 'ExpressionStatement') {
                var c = this[body.type](body);
            }
            consequent.body.push(c);
        }
        
        console.log("alternate", alternate);
        console.log("consequent", consequent);
        
        
        return {
            type: node.type,
            test: test,
            consequent: consequent,
            alternate: alternate
        };
    };

    p.SwitchStatement = function(node) {
        console.log("SwitchStatement", node);
        var discriminant = this[node.discriminant.type](node.discriminant);
        var cases = [];
        for(var index in node.cases) {
            var switchCase = node.cases[index];
            var caseStmt = this[switchCase.type](switchCase);
            cases.push(caseStmt);
        }

        return {
            type: node.type,
            discriminant: discriminant,
            cases: cases
        };

    };

    p.SwitchCase = function(node) {
        console.log("SwitchCase", node);
        var test;
        if(node.test === null)
            test = null;
        else
            test = this[node.test.type](node.test);

        var consequents;
        for(var index in node.consequent){
            var statement = node.consequent[index];
            var consequent = this[statment.type](statment);
            consequents.push(consequent);
        } 

        return {
            test: test,
            consequent: consequents
        };
    };

    p.ThrowStatement = function(node) {
        console.log("ThrowStatement", node);
        var arg = this[node.argument.type](node.argument);

        return {
            type: node.type,
            argument: arg
        };
    };

    p.TryStatement = function(node) {
        console.log("TryStatement", node);
        var block = this[node.block.type](node.block);
        
        var handler;
        if(node.handler === null)
            handler = null;
        else
            handler = this[node.handler.type](node.handler);

        var finalizer;
        if(node.finalizer === null)
            finalizer = null;
        else
            finalizer = this[node.finalizer.type](node.finalizer);

        return {
            type: node.type,
            block: block,
            handler: handler,
            finalizer: finalizer
        };
    };

    p.CatchClause = function(node) {
        console.log("CatchClause", node);
        var param = node.param;
        var body = this[node.body.type](node.body);

        return {
            param: param,
            body: body
        };
    };

    p.WhileStatement = function(node) {
        console.log("WhileStatement", node);

        var test = this[node.test.type](node.test);
        var body = this[node.body.type](node.body);

        console.log("test11", test);
        console.log("body11", body);

        return {
            type: node.type,
            test: test,
            body: body
        };
    };

    p.DoWhileStatement = function(node) {
        console.log("DoWhileStatement", node);
        var init;
        if(node.init === null)
            init = this[node.init.type](node.init);
        else
            init = this[node.init.type](node.init);

        var test;
        if(node.test === null)
            test = null;
        else
            test = this[node.test.type](node.test);

        var update;
        if(node.update === null)
            update = null;
        else
            update = this[node.update.type](node.update);

        var body = this[node.body.type](node.body);

        return {
            type: node.type,
            init: init,
            test: test,
            update: update,
            body: body
        };
    };

    p.ForStatement = function(node) {
        console.log("ForStatement", node);
        
        var init;
        if(node.init === null)
            init = null;
        else
            this[node.init.type](node.init);

        var test;
        if(node.test === null)
            test = null;
        else
            test = this[node.test.type](node.test);       

        var update;
        if(node.update === null)
            update = null;
        else
            update = this[node.update.type](node.update);

        var body = this[node.body.type](node.body);

        console.log("body", body);

        return {
            type: node.type,
            init: init,
            test: test,
            update: update,
            body: statement
        };
    };

    p.ForInStatement = function(node) {
        console.log("ForInStatement", node);
        var left;
        if(node.left.type != 'VariableDeclaration')
            left = this[node.left.type](node.left);
        else
            left = node.left;

        var right = this[node.right.type](node.right);
        var body = this[node.body.type](node.body);

        return {
            type: node.type,
            left: left,
            right: right,
            body: body
        };
    };

    p.FunctionDeclaration = function(node) {
        console.log("FunctionDeclaration", node);
        var id = this[node.id.type](node.id);

        return {
            id: id
        };
    };

    p.VariableDeclaration = function(node) {
        console.log("VariableDeclaration", node);
        var declarations = [];

        for(var index in node.declarations) {
            var variableDeclaration = node.declarations[index];
            var declaration = this[variableDeclaration.type](variableDeclaration);
            console.log("declaration", declaration);
            declarations.push(declaration);
        }

        var kind = "var";

        console.log("declarations", declarations);

        return {
            type: node.type,
            declarations: declarations,
            kind: kind
        };
    };

    p.VariableDeclarator = function(node) {
        console.log("VariableDeclarator", node);
        var id = node.id;
        
        var init;
        if(node.init === null)
            init = null;
        else
            init = this[node.init.type](node.init);

        console.log("id", id);
        console.log("init", init);

        return {
            type: node.type,
            id: id,
            init: init
        };
    };

    p.ThisExpression = function(node) {
        console.log("ThisExpression", node);
        return {
            type: node.type,
            type: node.type
        }
    };

    p.ArrayExpression = function(node) {
        console.log("ArrayExpression", node);
        var elements;

        if(node.elements === null) {
            elements = null;
        }
        else {
            for(var index in node.elements) {
                var expression = node.elements[index];
                var element = this[expression.type](expression);
                elements.push(element);
            }
        }

        return {
            type: node.type,
            elements: elements
        };
    };

    p.ObjectExpression = function(node) {
        console.log("ObjectExpression", node);
        var properties;

        for(var index in node.properties){
            var property = node.properties[index];
            var prop = this[property.type](property);
            properties.push(prop);
        }

        return {
            type: node.type,
            properties: properties
        };
    };

    p.Property = function(node) {
        console.log("Property", node);
        var key = this[node.key.type](node.key);
        var value = this[node.value.type](node.value);
        var kind = node.kind;

        return {
            type: node.type,
            key: key,
            value: value,
            kind: kind
        };
    };

    p.FunctionExpression = function(node) {
        console.log("FunctionExpression", node);
        return {
            type: node.type
        };
    };

    p.UnaryExpression = function(node) {
        console.log("UnaryExpression", node);
        var operator;
        switch(node.operator){
            case "-": 
                operator = node.operator;
                break;
            case "+": 
                operator = node.operator;
                break;
            case "!": 
                operator = node.operator;
                break;
            case "~": 
                operator = node.operator;
                break;
            case "typeof": 
                operator = node.operator;
                break;
            case "void": 
                operator = node.operator;
                break;
            case "delete": 
                operator = node.operator;
                break;
            default: 
                operator = null;
        }

        var prefix = node.prefix;

        var argument = this[node.argument.type](node.argument);

        return {
            type: node.type,
            operator: operator,
            prefix: prefix,
            argument: argument
        };
    };

    p.UpdateExpression = function(node) {
        console.log("UpdateExpression", node);
        var operator;
        switch(node.operator){
            case "++": 
                operator = node.operator;
                break;
            case "--": 
                operator = node.operator;
                break;
            default: 
                operator = null;
        }

        var argument = this[node.argument.type](node.argument);

        var prefix = node.prefix;

        return {
            operator: operator,
            prefix: prefix,
            argument: argument
        };
    };

    p.BinaryExpression = function(node) {
        console.log("BinaryExpression", node);
        var operator;

        switch(node.operator){
            case "==": 
                operator = node.operator;
                break;
            case "!=": 
                operator = node.operator;
                break;
            case "===": 
                operator = node.operator;
                break;
            case "!==": 
                operator = node.operator;
                break;
            case "<": 
                operator = node.operator;
                break;
            case "<=": 
                operator = node.operator;
                break;
            case ">": 
                operator = node.operator;
                break;
            case ">=": 
                operator = node.operator;
                break;
            case "<<": 
                operator = node.operator;
                break;
            case ">>": 
                operator = node.operator;
                break;
            case ">>>": 
                operator = node.operator;
                break;
            case "+": 
                operator = node.operator;
                break;
            case "-": 
                operator = node.operator;
                break;
            case "*": 
                operator = node.operator;
                break; 
            case "/": 
                operator = node.operator;
                break; 
            case "%": 
                operator = node.operator;
                break; 
            case "|": 
                operator = node.operator;
                break;
            case "^": 
                operator = node.operator;
                break;
            case "|": 
                operator = node.operator;
                break;
            case "&": 
                operator = node.operator;
                break;
            case "in": 
                operator = node.operator;
                break;
            case "instanceof": 
                operator = node.operator;
                break;     
            default: 
                operator = null;
        }

        var left = this[node.left.type](node.left);
        var right = this[node.right.type](node.right);

        return {
            operator: operator,
            left: left,
            right: right
        };
    };


    p.AssignmentExpression = function(node) {
        console.log("AssignmentExpression", node);
        var operator;

        switch(node.operator){
            case "=": 
                operator = node.operator;
                break;
            case "+=": 
                operator = node.operator;
                break;
            case "-=": 
                operator = node.operator;
                break;
            case "*=": 
                operator = node.operator;
                break;
            case "/=": 
                operator = node.operator;
                break;
            case "%=": 
                operator = node.operator;
                break;
            case "<<=": 
                operator = node.operator;
                break;
            case ">>=": 
                operator = node.operator;
                break;
            case "|=": 
                operator = node.operator;
                break;
            case "^=": 
                operator = node.operator;
                break;
            case "&=": 
                operator = node.operator;
                break;
            default: 
                operator = null;
        }

        var left;
        if(node.left.type == 'ThisExpression' || 'ArrayExpression' || 'ObjectExpression' || 'FunctionExpression' ||
            'UnaryExpression' || 'UpdateExpression' || 'BinaryExpression' || 'AssignmentExpression' ||
            'LogicalExpression' || 'MemberExpression' || 'ConditionalExpression' || 'CallExpression' ||
            'NewExpression' || 'SequenceExpression') {
            left = node.left;
        }
        else{
            left = this[node.left.type](node.left);
        }

        var right = this[node.right.type](node.right);

        return {
            operator: operator,
            left: left,
            right: right
        };
    };

    p.LogicalExpression = function(node) {
        console.log("LogicalExpression", node);
        var operator;

        switch(node.operator){
            case "||": 
                operator = node.operator;
                break;
            case "&&": 
                operator = node.operator;
                break;
            default: 
                operator = null;
        }

        var left = this[node.left.type](node.left);
        var right = this[node.right.type](node.right);

        return {
            operator: operator,
            left: left,
            right: right
        };
    };

    p.MemberExpression = function(node) {
        console.log("MemberExpression", node);
        var object = this[node.object.type](node.object);
        var property = this[node.property.type](node.property);
        var computed = node.computed; 

        console.log("object", object);
        console.log("property", property);

        return {
            type: node.type,
            object: object,
            property: property,
            computed: computed
        };
    };
    
    p.ConditionalExpression = function(node) {
        console.log("ConditionalExpression", node);
        var callee = this[node.callee.type](node.callee);
        
        var args;
        for(var index in node.arguments) {
            var expression = node.arguments[index];
            var arg = this[expression.type](expression);
            args.push(arg);
        }

        return {
            callee: callee,
            arguments: args
        };
    };

    p.CallExpression = function(node) {
        console.log("CallExpression", node);
        var callee = this[node.callee.type](node.callee);

        var args = [];
        for(var index in node.arguments) {
            var expression = node.arguments[index];
            var arg = this[expression.type](expression);
        
            args.push(arg);      
        } 

        console.log("callee", callee);
        console.log("arguments", args);

        return {
            type: node.type,
            callee: callee,
            arguments: args
        };
    };

    p.NewExpression = function(node) {
        console.log("NewExpression", node);
        return {
            type: node.type
        };
    };

    p.SequenceExpression = function(node) {
        console.log("SequenceExpression", node);
        var expressions;
        for(var index in node.expressions) {
            var expression = node.expressions[index];
            var express = this[expression.type](expression);
            expressions.push(express);
        }

        return {
            expressions: expressions
        };
    };

})(Entry.PyToBlockParser.prototype);
