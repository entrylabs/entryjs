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
            default: {
                result = operator;
            }
        }
        return result;
    };

    p.logicalExpressionConvert = function(operator) {
        console.log("logicalExpressionConvert", operator);
        var result;
        switch(operator) {
            case '&&': {
                result = null;
                break;
            }
            case '||': {
                result = null;
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    };

    p.particularParam = function(blockType) {
        console.log("particularParamBlock", blockType);
        var result;
        switch(blockType) {
            case 'rotate_relative': {
                result = {0: "angle"};
                break;
            }
            case 'direction_relative': {
                result = {0: "angle"};
                break;
            }
            case 'rotate_by_time': {
                result = {1: "angle"};
                break;
            }
            case 'direction_relative_duration': {
                result = {1: "angle"};
                break;
            }
            case 'rotate_absolute': {
                result = {0: "angle"};
                break;
            }
            case 'direction_absolute': {
                result = {0: "angle"};
                break;
            }
            case 'move_to_angle': {
                result = {0: "angle"};
                break;
            }
            case 'change_to_some_shape': {
                result = {0: "get_pictures"};
                break;
            }
            case 'sound_something_with_block': {
                result = {0: "get_sounds"};
                break;
            }
            case 'sound_something_second_with_block': {
                result = {0: "get_sounds"};
                break;
            }
            case 'sound_from_to': {
                result = {0: "get_sounds"};
                break;
            }
            case 'sound_something_wait_with_block': {
                result = {0: "get_sounds"};
                break;
            }
            case 'sound_something_second_wait_with_block': {
                result = {0: "get_sounds"};
                break;
            }
            case 'sound_from_to_and_wait': {
                result = {0: "get_sounds"};
                break;
            }
            default: {
                result = null;
            }
        }
        return result;
    };

})(Entry.TextCodingUtil.prototype);