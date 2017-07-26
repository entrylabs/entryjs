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
    this._type ="PyToBlockParser";
    this.blockSyntax = blockSyntax;

    this._funcMap = {};
};

(function(p){
    p.util = Entry.TextCodingUtil;

    p.Programs = function(astArr) {
        try {
            return this.processPrograms(astArr);
        } catch(error) {
            var err = {};
            err.title = error.title;
            err.message = error.message;
            err.line = error.line;
            throw err;
        }
    };

    p.processPrograms = function(astArr) {
        return astArr.map(this.processNode, this)
    };

    p.Program = function(component) {
        return component.body.map(this.processNode, this)
    };

    p.ExpressionStatement = function(component) {
        return this.processNode(component.expression);
    };

    p.CallExpression = function(component) {
        var callee = component.callee;
        var property = component.property;
        var name = property.name;
        var args = component.arguments;
        var params = [];

        if(component.arguments) {
            params = component.arguments.map(this.processNode, this)
        }

        var obj = this.processNode(callee);
        obj.params = this.sortParams(obj.syntax , params);

        return obj;
    };

    p.Identifier = function(component, paramMeta, paramDefMeta) {
        return component.name;
    };

    p.VariableDeclaration = function(component) {};

    p.VariableDeclarator = function(component) {};

    p.AssignmentExpression = function(component) {};

    p.Literal = function(component, paramMeta, paramDefMeta, textParam) {
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
        var obj = component.object;
        var property = component.property;
        var type = {};

        var blockInfo = this.blockSyntax[obj.name][this.processNode(property)];
        if(property && property.type){
            type.type = blockInfo.key;
            type.syntax = blockInfo.syntax;
        }

        return type;
    };

    p.WhileStatement = function(component) {};

    p.BlockStatement = function(component) {
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
        var id = component.id;
        var idData = this.processNode(id);

        this.callFunc(component , 'body');

        // this[component.type](component ,)
    };

    p.FunctionExpression = function(component) {

    };

    p.ReturnStatement = function(component) {
        this.callFunc(component , 'argument');
    };

    p.ThisExpression = function(component) {};

    p.NewExpression = function(component) {};

    /**
     * Not Supported
     */

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

    /**
     * util Function
     */

    p.callFunc = function(component , type) {
        var arr = component[type];

        arr.map(function(a){
            this[component.type](a);
        } ,this);
        return;
    };

    p.sortParams = function(syntax , arr) {
        var indexes = syntax.match( /\d+/g, '');
        var returnArr = new Array();

        for(var i=0; i < indexes.length; i++) {
            var idx = parseInt(indexes[i])-1;
            returnArr[idx] = arr[i];
        }

        return returnArr;
    };

    p.processNode = function(nodeType, node) {
        if (typeof nodeType === "string" && nodeType !== node.type)
            throw new Error("Not expected node type");
        else
            node = nodeType;
        return this[node.type](node);
    };

})(Entry.PyToBlockParser.prototype);
