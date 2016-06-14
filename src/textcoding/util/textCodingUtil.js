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
        var indentedCodeArr = textCode.split("\n");
        indentedCodeArr.pop();
        result += indentedCodeArr.join("\n\t");
        
        console.log("indent result", result);
        
        return result;
    };

    p.isNumeric = function(value) {
        if(value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false; 
    };

    p.isBinaryOperator = function(value) {
        if(value == "==" || value == ">" || value == "<" || value == ">="|| value == "<=" ||
            value == "+" || value == "-" || value == "*" || value == "/") {
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
            case '+': {
                result = "PLUS";
                break;
            }
            case '-': {
                result = "MINUS";
                break;
            }
            case '*': {
                result = "MULTIFLY";
                break;
            }
            case '/': {
                result = "DIVIDE";
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

    p.dropdownDynamicValueConvertor = function(value, param) {
        var options = param.options;
        console.log("dropdownDynamicValueConvertor value", value, "options", options);
        var found = false;
        var result = null;
        for(var index in options) {
            var option = options[index];
            if(option[1] == "null") {
                result = "none";
                found = true;
                return result; 
            }

            if(value == "mouse" || value == "wall" || value == "wall_up" || 
               value == "wall_down" || value == "wall_right" || value == "wall_left") {
                found = true;
                return value;
            }

            console.log("dropdownDynamicValueConvertor check value", value, "option", option);

            if(value == option[1]) {
                result = option[0];
                found = true;
                return result;
            }
        }

        result = value;

        if(!found && param.menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            console.log("dropdownDynamicValueConvertor entryVariables", entryVariables);
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.id_ == value) {
                    result = entryVariable.name_;
                    break; 
                }

            }
        } 
        else if(!found && param.menuName == "lists") {
            var entryLists = Entry.variableContainer.lists;
            console.log("dropdownDynamicValueConvertor entryLists", entryLists);
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.id_ == value) {
                    result = entryList.name_;
                    break; 
                }

            }
        } 
        else if(!found && param.menuName == "pictures") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var pictures = object.pictures;
                for(var p in pictures) {
                    var picture = pictures[p];
                    if(picture.id == value) {
                        result = picture.name;
                        return result;
                    }
                }
            }
        }
        else if(!found && param.menuName == "sounds") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var sounds = object.sounds;
                for(var p in sounds) {
                    var sound = sounds[p];
                    if(sound.id == value) {
                        result = sound.name;
                        return result;
                    }
                }
            }
        }

        console.log("b to py dd", result);

        return result;

    };

    p.binaryOperatorValueConvertor = function(operator) {
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

        console.log("binaryOperatorValueConvertor result", result);
        return result;
    }; 

    p.variableFilter = function(block, index, param) {
        console.log("paramFilter block index param", block, index, param);
        var result = param;
        var type = block.data.type;
        if(type == "change_variable" || type == "set_variable" || type == "get_variable") {
            if(index == 1) {
                console.log("paramFilter", eval(param));
                result = eval(param);
            }
        }

        return result;
    }

})(Entry.TextCodingUtil.prototype);