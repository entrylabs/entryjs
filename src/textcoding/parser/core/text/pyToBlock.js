/*
 *
 */
"use strict";

goog.provide("Entry.PyToBlockParser");

goog.require("Entry.KeyboardCode");
goog.require("Entry.TextCodingUtil");
goog.require("Entry.TextCodingError");
goog.require("Entry.Queue");

Entry.PyToBlockParser = function(blockSyntax) {
    console.log(blockSyntax);

    this._type ="PyToBlockParser";
    this.blockSyntax = blockSyntax;

    this._funcMap = {};
};

(function(p){
    p.util = Entry.TextCodingUtil;

    p.Program = function(astArr) {
        try {
            return this.processProgram(astArr);
        } catch(error) {
            var err = {};
            err.title = error.title;
            err.message = error.message;
            err.line = error.line;
            throw err;
        }
    };

    p.processProgram = function(astArr) {
        var code = [];

        for(i=0; i < astArr.length; i++) {
            var ast = astArr[i];
            var nodes = ast.body;
            var thread = []; 

            if(ast.type !== "Program")
                return;

            for(var j=0; j<nodes.length; j++) {
                var node = nodes[j];
                thread.push(this[node.type](node));
            }
            code.push(thread);
        }

        return code;
    }

    p.ExpressionStatement = function(component) {
        console.log("@ExpressionStatement");
        
        component = component.expression;
        return this[component.type](component);
    };

    p.CallExpression = function(component) {
        console.log("@callExpression");

        var callee = component.callee;
        var property = component.property;
        var name = property.name;
        var args = component.arguments;
        var params = [];

        if(component.arguments) {    
            component.arguments.map(function(argument){
                params.push(this[argument.type](argument));
            }, this)
        }

        var obj = this[callee.type](callee);
        obj.params = this.sortParams(obj.syntax , params);

        return obj;

    };

    p.Identifier = function(component, paramMeta, paramDefMeta) {
        console.log('@Identifier');

        return component.name;
    };

    p.VariableDeclaration = function(component) {};

    p.VariableDeclarator = function(component) {};

    p.AssignmentExpression = function(component) {};

    p.Literal = function(component, paramMeta, paramDefMeta, textParam) {
       console.log('@Literal');

       return {
            type: 'number',
            params : [ component.value ]
       }

    };

    p.ParamBlock = function(value, paramMeta, paramDefMeta) {};

    p.ParamAngle = function (value, paramMeta, paramDefMeta) {};

    p.ParamTextInput = function(value, paramMeta, paramDefMeta) {};

    p.ParamColor = function(value, paramMeta, paramDefMeta, textParam) {};

    p.ParamDropdown = function(value, paramMeta, paramDefMeta, textParam) {};

    p.ParamDropdownDynamic = function(value, paramMeta, paramDefMeta, textParam, currentObject) {};

    p.ParamKeyboard = function(value, paramMeta, paramDefMeta) {};

    p.Indicator = function(blockParam, blockDefParam, arg) {};

    p.MemberExpression = function(component) {
        console.log("@MemberExpression");
        var obj = component.object;
        var property = component.property;
        var type = {};

        var blockInfo = this.blockSyntax[obj.name][this[property.type](property)];
        if(property && property.type){
            type.type = blockInfo.key;
            type.syntax = blockInfo.syntax;
        }

        return type;
    };

    p.WhileStatement = function(component) {};

    p.BlockStatement = function(component) {
        console.log("@BlockStatement");
        this.callFunc(component , 'body')
    };

    p.IfStatement = function(component) {};

     p.ForStatement = function(component) {};

    p.ForInStatement = function(component) {};


    p.BreakStatement = function(component) {};

    p.UnaryExpression = function(component) {};

    p.LogicalExpression = function(component) {};

    p.BinaryExpression = function(component) {};

    p.UpdateExpression = function(component) {};

    p.FunctionDeclaration = function(component) {
        console.log("@FunctionDeclaration component" , component );

        var id = component.id;
        var idData = this[id.type](id);

        this.callFunc(component , 'body');

        // this[component.type](component ,)
    };

    p.FunctionExpression = function(component) {

    };

    p.ReturnStatement = function(component) {
        console.log("@ReturnStatement");
        this.callFunc(component , 'argument');
    };

    p.ThisExpression = function(component) {};

    p.NewExpression = function(component) {};

    /////////////////////////////////////////////////////////////////
    // Utils
    p.codeInit = function() {};

    p.threadInit = function() {};

    p.getBlockSyntax = function(syntax) {

    };

    p.getParamIndex = function(syntax) {}

    p.extractContents = function(content, thread) {}

    ///////////////////////////////////////////////////////////
    //Not Yet Used Syntax
    ///////////////////////////////////////////////////////////

    p.RegExp = function(component) {};

    p.Function = function(component) {};

    p.EmptyStatement = function(component) {};

    p.DebuggerStatement = function(component) {};

    p.WithStatement = function(component) {};

    p.LabeledStatement = function(component) {};

    p.ContinueStatement = function(component) {};

    p.SwitchStatement = function(component) {};

    p.SwitchCase = function(component) {};

    p.ThrowStatement = function(component) {};

    p.TryStatement = function(component) {};

    p.CatchClause = function(component) {};

    p.DoWhileStatement = function(component) {};

    p.ArrayExpression = function(component) {};

    p.ObjectExpression = function(component) {};

    p.Property = function(component) {};

    p.ConditionalExpression = function(component) {};

    p.SequenceExpression = function(component) {};

    p.searchSyntax = function(datum) {};


    p.callFunc = function(component , type) {
        var arr = component[type];

        arr.map(function(a){
            this[component.type](a);
        } ,this);
        return;
    }

    p.sortParams = function(syntax , arr) {
        var indexes = syntax.match( /\d+/g, '');
        var returnArr = new Array();

        for(var i=0; i < indexes.length; i++) {
            var idx = parseInt(indexes[i])-1;
            returnArr[idx] = arr[i];
        }

        return returnArr;
    }
 
})(Entry.PyToBlockParser.prototype);
