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


    // Expression
    p.CallExpression = function(node) {
        var callee = node.callee,
            args = node.arguments;
        var blockType = this[callee.type](callee);
        return {
            type: blockType
        };
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

    p.ThisExpression = function(node) {
        return Entry.Parser.ThisObject;
    };



})(Entry.JSParser);
