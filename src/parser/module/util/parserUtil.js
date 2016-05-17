/*
 *
 */
"use strict";

goog.provide("Entry.ParserUtil");

Entry.ParserUtil = function() {

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

    p.dropdownDynamicValueConvertor = function(value, param) {
        console.log("dropdownDynamicValueConvertor", value, param);
        var options = param.options;
        var result = null;
        for(var index in options) {
            var option = options[index];
            if(option[1] == "null") {
                result = "none";
                return result;
            }

            if(value == option[1]) {
                result = option[0];
                return result;
            }
        }

        result = value;

        console.log("b to py dd", result);

        return result;

    };

    p.isNumeric = function(value) {
        if(value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false;
    };

    p.booleanOperatorConvertor = function(operator) {
        console.log("booleanOperatorConvertor", operator);
        var result;
        switch(operator) {
            case 'EQUAL': {
                console.log("EQUAL");
                result = "==";
                break;
            }
            case 'GREATER': {
                result = ">";
                break;
            }
            case 'LESS': {
                result = "<";
                break;
            }
            case 'GREATER_OR_EQUAL': {
                result = ">=";
                break;
            }
            case 'LESS_OR_EQUAL': {
                result = "<=";
                break;
            }
            case '그리고': {
                result = "&&";
                break;
            }
            case '또는': {
                result = "||";
                break;
            }
            case '(이)가 아니다' : {
                result = "!=";
                break;
            }
            default: {
                result = operator;
            }
        }

        console.log("booleanOperatorConvertor result", result);
        return result;
    }; 

})(Entry.ParserUtil.prototype);