/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtil");

Entry.TextCodingUtil = function() {

};

(function(p) {
	p.indent = function(textCode) {
        console.log("indent textCode", textCode);
        var result = "\t";
        var indentedCode = textCode.split("\n");
        indentedCode.pop();
        result += indentedCode.join("\n\t");
        return result;
    };

    

    p.isNumeric = function(value) {
        if(value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false; 
    };

    p.isBinaryOperator = function(value) {
        if(value == "==" || value == ">" || value == "<" || value == ">="|| value == "<=") {
            return true;
        }
        
        return false;
    };

    p.binaryOperatorConvert = function(operator) {
        console.log("binaryOperatorConvert", operator);
        var result;
        switch(operator) {
            case '==': {
                result = "EQUAL";
                break;
            }
            case '>': {
                result = "GREATER";
                break;
            }
            case '<': {
                result = "LESS";
                break;
            }
            case '>=': {
                result = "GREATER_OR_EQUAL";
                break;
            }
            case '<=': {
                result = "LESS_OR_EQUAL";
                break;
            }
            case '&&': {
                result = null;
                break;
            }
            case '||': {
                result = null;
                break;
            }
            case '!': {
                result = null;
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    };

})(Entry.TextCodingUtil.prototype);