/*
 *
 */
/*"use strict";

goog.provide("Entry.ParserValueConvertor");

Entry.ParserValueConvertor = function() {

};

(function(p) {
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

            if(value == "mouse" || value == "wall" || value == "wall_up" || 
               value == "wall_down" || value == "wall_right" || value == "wall_left")
            	return value;

            console.log("value", value, "option[1]", option[1], "option[0]", option[0]);

            if(value == option[1]) {
                result = option[0];
                return result;
            }
        }

        result = value;

        console.log("b to py dd", result);

        return result;

    };

    p.binaryOperatorValueConvertor = function(operator) {
        console.log("booleanOperatorValueConvertor", operator);
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
            case 'PLUS': {
                result = "+";
                break;
            }
            case 'MINUS': {
                result = "-";
                break;
            }
            case 'MULTI': {
                result = "*";
                break;
            }
            case 'DIVIDE': {
                result = "/";
                break;
            }
            default: {
                result = operator;
            }
        }

        console.log("booleanOperatorConvertor result", result);
        return result;
    }; 
})(Entry.ParserValueConvertor.prototype);*/