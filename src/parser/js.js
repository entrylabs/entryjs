/*
 *
 */
"use strict";

goog.provide("Entry.JSParser");

Entry.JSParser = {};

(function(p){
    p.Program = function(node) {
        var block = [];
        var body = node.body;

        for (var i = 0; i < body.length; i++) {
            var childNode = body[i];
            console.log(childNode.type);
            block.push(this[childNode.type](childNode));
        }

        console.log("block" , block);
        return block;
    };

    p.Identifier = function(node) {
        return node.name;
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
        // console.log("init  =" ,init);
        // console.log("test  = " ,test);
        // console.log("update = " ,update);
        // console.log("body = " ,body);


        return { 'init' : init , 
                 'test': test , 
                 'update' : update, 
                 'body' :body} ;
    };

    p.BlockStatement = function(node) {
        var body = node.body;

        return new Error();
    };

    p.EmptyStatement = function(node) {
        return new Error();
    };

    p.DebuggerStatement = function(node) {
        return new Error();
    }

    p.WithStatement = function(node) {
        var object = node.object,
            body = node.body;

        return new Error();
    }

    //control flow
    p.ReturnStaement = function(node) {
        var args = node.arguments;

        return new Error();
    };

    p.LabeledStatement = function(node) {
        var label = node.label,
            body = node.body;

        return new Error();
    };

    p.BreakStatement = function(node) {
        var label = node.label;

        return new Error();  
    };

    p.ContinueStatement = function(node) {
        var label = node.label;

        return new Error();
    }

    p.IfStatement = function(node) {    
        var test = node.test,
            consequent = node.consequent,
            alternate  = node.alternate;

        return {
            'test' : test,
            'consequent' : consequent,
            'alternate' : alternate
        };   
    }    

    p.SwitchStatement = function(node) {
        var discriminant = node.discriminant,
            cases = node.cases;

        return new Error();
    }

    p.SwitchCase = function(node) {
        var test = node.test,
            consequent = node.consequent;

        return new Error();
    };

    //throwstatement

    p.ThrowStatement = function(node) {
        var args = node.arguments;

        return new Error();
    }

    p.TryStatement = function(node) {
        var block = node.block,
            handler = node.handler,
            finalizer = node.finalizer;

        return new Error();
    }

    p.CatchClause = function(node) {
        var param = node.param,
            body = node.body;

        return new Error();
    }

    p.WhileStatement = function(node) {
        test = node.test,
        body = node.body;

        return new Error();
    }

    p.DoWhileStatement = function(node) {
        var body = node.body,
            test = node.test;

        return new Error();
    }


    p.ForInStatement = function(node) {
        var left = node.left,
            right = node.right,
            body = node.body;

        return new Error();
    }

    //Declaration

    p.FunctionDeclaration = function(node) {
        var id = node.id;

        return new Error();
    };

    p.VariableDeclaration = function(node) {
        var declaration = node.declarations,
            kind = node.kind;        

        return new Error();
    };

    p.VariableDeclaration = function(node) {
        var id = node.id,
            init = node.init;

        return new Error();
    };

    // Expression
    p.ThisExpression = function(node) {
        return Entry.Parser.ThisObject;
    };

    p.ArrayExpression = function(node) {
        var elements = node.elements;

        return new Error();
    };

    p.ObjectExpression = function(node) {
        var property = node.property;

        return new Error();
    };

    p.property = function(node) {
        var key = node.key,
            value = node.value,
            kind = node.kind;

        return new Error();
    };

    p.FunctionExpression = function(node) {

        return new Error();
    };
    // unary expression 

    p.UnaryExpression = function(node) {
        var operator = node.operator,
            prefix = node.prefix,
            args  = node.argument;

        return new Error();
    };

    p.UnaryOperator = function(){
        return  ["-" , "+" , "!" , "~" , "typeof" , "void" , "delete"];
    }

    p.updateOperator = function() {
        return ["++" , "--"];
    };

    //Binary expression 
    p.BinaryOperator = function() {

        return ["==" , "!=" , "===" , "!=="
         , "<" , "<=" , ">" , ">="
         , "<<" , ">>" , ">>>"
         , "+" , "-" , "*" , "/" , "%"
         , "," , "^" , "&" , "in"
         , "instanceof"];
    };

    p.AssignmentExpression = function(node) {
        var operator = node.operator,
            left = node.left,
            right = node.right;

        return new Error();
    };

    p.AssignmentOperator = function() {

        return ["=" , "+=" , "-=" , "*=" , "/=" , "%="
        , "<<=" , ">>=" , ">>>="
        , ",=" , "^=" , "&="];
    };

    p.LogicalExpression = function(node) {
        var operator = node.operator,
            left = node.left,
            right = node.right;
        return new Error();
    };

    p.LogicalOperator = function() {
        return ["||" , "&&"];
    };

    p.MemberExpression = function(node) {
        var object = node.object,
            property = node.property,
            computed = node.computed;

        object = this[object.type](object);

        property = this[property.type](property);

        var blockType = object[property];
        return blockType;
    };

    p.ConditionalExpression = function(node) {
        var test = node.test,
            alternate = node.alternate,
            consequent = node.consequent;

        return new Error();
    };

    p.UpdateExpression = function(node) {
        var operator = node.operator,
            args = node.argument,
            prefix = node.prefix;

        return new Error();
    };

    p.CallExpression = function(node) {
        var callee = node.callee,
            args = node.arguments;
        var blockType = this[callee.type](callee);
        return {
            type: blockType
        };
    };

    p.NewExpression = function(node) {
        return new Error();
    };

    p.SequenceExpression = function(node) {
        var expressions = node.expressions;

        return new Error();
    };

})(Entry.JSParser);
