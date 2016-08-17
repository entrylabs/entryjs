/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtil");

goog.require("Entry.Queue");

Entry.TextCodingUtil = function() {
    
};

(function(p) {
    p._funcParamQ;

    p.initQueue = function() {
        var queue = new Entry.Queue();
        this._funcParamQ = queue;

        var fNameQueue = new Entry.Queue();
        this._funcNameQ = fNameQueue;
        //console.log("initQueue this._funcParamQ", this._funcParamQ);
    };

    p.clearQueue = function() {
        this._funcParamQ.clear();
        this._funcNameQ.clear();
    };

	p.indent = function(textCode) {
        //console.log("indent textCode", textCode);
        var result = "\t";
        var indentedCodeArr = textCode.split("\n");
        indentedCodeArr.pop();
        result += indentedCodeArr.join("\n\t");
        result = "\t" + result.trim();//.concat('\n');
        //console.log("indent result", result);
        
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
        //console.log("binaryOperatorConvert", operator);
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
        //console.log("logicalExpressionConvert", operator);
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
        //console.log("dropdownDynamicValueConvertor value", value, "options", options);
        var found = false;
        var result = null;
        for(var index in options) {
            var option = options[index];
            if(option[1] == "null") {
                var item = {};
                var None = {};
                item.None = None;
                result = item.None;

                found = true;
                return result; 
            }

            if(value == "mouse" || value == "wall" || value == "wall_up" || 
               value == "wall_down" || value == "wall_right" || value == "wall_left") {
                found = true;
                return value;
            }

            //console.log("dropdownDynamicValueConvertor check value", value, "option", option);

            if(value == option[1]) {
                result = option[0];
                found = true;
                return result;
            }
        }

        result = value;

        if(!found && param.menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            //console.log("dropdownDynamicValueConvertor entryVariables", entryVariables);
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
            //console.log("dropdownDynamicValueConvertor entryLists", entryLists);
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

        //console.log("b to py dd", result);

        return result;

    };

    p.binaryOperatorValueConvertor = function(operator) {
        var result;
        switch(operator) {
            case 'EQUAL': {
                //console.log("EQUAL");
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

        //console.log("binaryOperatorValueConvertor result", result);
        return result;
    }; 

    p.variableFilter = function(block, index, param) {
        //console.log("paramFilter block index param", block.data.type, index, param);
        var result = param;
        var type = block.data.type;
        if(type == "change_variable" || type == "set_variable" || type == "get_variable" ) {
            if(index == 1) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
        } else if(type == "length_of_list" || type == "is_included_in_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
        } else if(type == "value_of_index_from_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
            else if(index == 4) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "remove_value_from_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
            else if(index == 1) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "insert_value_to_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
            else if(index == 3) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "change_value_list_index") {
            if(index == 1) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
            else if(index == 2) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "add_value_to_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            } 
        }

        return result;
    };

    p.isGlobalVariableExisted = function(name) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) { 
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === null && entryVariable.name_ == name) {
                return true;
            }       

        }

        return false;
    };

    p.updateGlobalVariable = function(name, value) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) { 
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === null && entryVariable.name_ == name) {
                variable = {
                    x: entryVariable.x_,
                    y: entryVariable.y_,
                    id: entryVariable.id_,
                    visible: entryVariable.visible_,
                    value: value,
                    name: name,
                    isCloud: entryVariable.isClud_,
                };
                
                entryVariable.syncModel_(variable);
                Entry.variableContainer.updateList();
                
                break;
            }       
        }
    };

    p.createGlobalVariable = function(name, value) {
        if(this.isGlobalVariableExisted(name))
            return;

        var variable = {
            name: name,
            value: value,
            variableType: 'variable'
        };

        //console.log("TextCodingUtil variable", variable);

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    p.isLocalVariableExisted = function(name, object) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) { 
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                return true;
            }       

        }

        return false;
    };

    p.updateLocalVariable = function(name, value, object) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) { 
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                var variable = {
                    x: entryVariable.x_,
                    y: entryVariable.y_,
                    id: entryVariable.id_,
                    visible: entryVariable.visible_,
                    value: value,
                    name: name,
                    isCloud: entryVariable.isClud_,
                };
                
                entryVariable.syncModel_(variable);
                Entry.variableContainer.updateList();
                
                break;
            }       
        }
    };

    p.createLocalVariable = function(name, value, object) {
        if(this.isLocalVariableExisted(name, object))
            return;

        var variable = {
            name: name,
            value: value,
            object: object.id,
            variableType: 'variable'
        };

        //console.log("TextCodingUtil variable name", name);

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    p.isLocalVariable = function(variableId) {
        //console.log("TextCodingUtil isLocalVariable", variableId);
        var object = Entry.playground.object;
        var entryVariables = Entry.variableContainer.variables_;
        for(var e in entryVariables) {
            var entryVariable = entryVariables[e];
            if(entryVariable.object_ == object.id && entryVariable.id_ == variableId) {
                return true;
            }
        }

        return false;

    };

    p.isGlobalListExisted = function(name) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) { 
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === null && entryList.name_ == name) {
                return true;
            }       
        }

        return false;
    };

    p.updateGlobalList = function(name, array) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) { 
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === null && entryList.name_ == name) {
                list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isClud_,
                        width: entryList.width_,
                        height: entryList.height_,
                        array: array,
                    };
                    
                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();
                
                break;
            }       
        }
    };

    p.createGlobalList = function(name, array) {
        if(this.isGlobalListExisted(name))
            return;

        var list = {
            name: name,
            array: array,
            variableType: 'list'
        };

        //console.log("TextCodingUtil list", list);

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    p.isLocalListExisted = function(name, object) {
        //console.log("TextCodingUtil isLocalListExisted", name, object);
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) { 
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === object.id && entryList.name_ == name) {
                return true;
            }       
        }

        return false;
    };

    p.updateLocalList = function(name, array, object) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) { 
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === object.id && entryList.name_ == name) {
                var list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isClud_,
                        width: entryList.width_,
                        height: entryList.height_,
                        array: array,
                    };
                    
                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();
                
                break;
            }       
        }
    };

    p.createLocalList = function(name, array, object) {
        if(this.isLocalListExisted(name, object))
            return;

        var list = {
            name: name,
            array: array,
            object: object.id,
            variableType: 'list'
        };

        //console.log("TextCodingUtil list", list);

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    p.isLocalList = function(listId) {
        //console.log("TextCodingUtil listId", listId);
        var object = Entry.playground.object;
        var entryLists = Entry.variableContainer.lists_;
        for(var e in entryLists) {
            var entryList = entryLists[e];
            if(entryList.object_ == object.id && entryList.id_ == listId) {
                return true;
            }
        }

        return false;

    };

    p.isLocalType = function(block, id) {
        if(block.data.type == "get_variable" || 
            block.data.type == "set_variable" || 
            block.data.type == "change_variable" ) {
            
            if(this.isLocalVariable(id))
                return true;
                
        } else if(block.data.type == "value_of_index_from_list" || 
            block.data.type == "add_value_to_list" ||
            block.data.type == "remove_value_from_list" ||
            block.data.type == "insert_value_to_list" ||
            block.data.type == "change_value_list_index" ||
            block.data.type == "length_of_list" ||
            block.data.type == "is_included_in_list") {

            if(this.isLocalList(id))
                return true;
        }
    };

    p.isEventBlock = function(block) {
        var blockType = block.data.type;
        if( blockType == "when_run_button_click" || 
            blockType == "when_some_key_pressed" || 
            blockType == "mouse_clicked" || 
            blockType == "mouse_click_cancled" || 
            blockType == "when_object_click" || 
            blockType == "when_object_click_canceled" || 
            blockType == "when_message_cast" || 
            blockType == "when_scene_start" ||
            blockType == "when_clone_start") {
            return true;
        } 

        return false;
    };

    p.makeDefinition = function(block) {
        var blockType = block.data.type;
        var syntax = Entry.block[blockType].syntax.py[0];

        var paramReg = /(%.)/mi;
        var tokens = syntax.split(paramReg);

        var result = '';
        for (var i = 0; i < tokens.length; i++) { 
            var token = tokens[i];
            if (paramReg.test(token)) {
                result += 'event';
            } else {
                result += token;
            }
        }

        return result;
    };

    p.isNoPrintBlock = function(block) { 
        var blockType = block.data.type;

        return false;
    };

    p.entryEventFuncFilter = function(threads) { 
        var result;
        var eventFound = false;
        var threadArr = threads.split('\n');
        
        for(var i in threadArr) {
                var thread = threadArr[i]; 
                
                if( thread == "def entry_event_start():" || 
                    thread == "def entry_event_mouse_down():" || 
                    thread == "def entry_event_mouse_up():" || 
                    thread == "def entry_event_object_down():" || 
                    thread == "def entry_event_scene_start():" || 
                    thread == "def entry_event_clone_create():") {
                
                    tokens = thread.split("def");
                    thread = tokens[1].substring(0, tokens[1].length-1).trim() + '\n';
                    threadArr[i] = thread;
                    eventFound = true;
                } 
                else if(new RegExp(/^def entry_event_key(.+):$/).test(thread) || 
                    new RegExp(/^def entry_event_signal(.+):$/).test(thread)) {
                    
                    tokens = thread.split("def");
                    thread = tokens[1].substring(0, tokens[1].length-1).trim() + '\n';
                    threadArr[i] = thread;
                    eventFound = true;
                } 
                else {
                    if(eventFound) {
                        var thread = threadArr[i];
                        thread = thread.replace('\t', '');
                        threadArr[i] = thread;
                    }
                }  
        }

        result = threadArr.join('\n');
        return result;
    };

    p.eventBlockSyntaxFilter = function(name) {      
        if( name == "entry_event_start" || 
            name == "entry_event_key" || 
            name == "entry_event_mouse_down" || 
            name == "entry_event_mouse_up" || 
            name == "entry_event_object_down" || 
            name == "entry_event_signal" || 
            name == "entry_event_scene_start" || 
            name == "entry_event_clone_create") {
            
            name = "def " + name;
            return name;
        }

        return name;
            
    };

    p.isEntryEventFunc = function(name) {
        if( name == "def entry_event_start" || 
            name == "def entry_event_key" || 
            name == "def entry_event_mouse_down" || 
            name == "def entry_event_mouse_up" || 
            name == "def entry_event_object_down" || 
            name == "def entry_event_signal" || 
            name == "def entry_event_scene_start" || 
            name == "def entry_event_clone_create") {
            
            return true;
        }

        return false;
            
    };

    p.searchFuncDefParam = function(block) {
        //console.log("searchFuncDefParam block", block);
        if(block.data.type == "function_field_label") {
            var name = block.data.params[0];
            this._funcNameQ.enqueue(name);
            //console.log("searchFuncDefParam name enqueue", name);

        }

        if(block && block.data && block.data.params && block.data.params[1]){
            if(block.data.type == "function_field_string" || block.data.type == "function_field_boolean") {
                var param = block.data.params[0].data.type;
                this._funcParamQ.enqueue(param);
            }

            var result = this.searchFuncDefParam(block.data.params[1]);  
            return result;
        }
        else {
            return block;
        }
    };

    p.gatherFuncDefParam = function(block) {
        if(block && block.data) {
            if(block.data.params[0]) {
                if(block.data.params[0].data) {
                    var param = block.data.params[0].data.type;
                    if(block.data.type == "function_field_string" || block.data.type == "function_field_boolean") {
                        this._funcParamQ.enqueue(param);

                    } 
                } else if(block.data.type == "function_field_label") {
                    var name = block.data.params[0];
                    this._funcNameQ.enqueue(name);
                }
            }
            if(block.data.params[1]){
                var result = this.searchFuncDefParam(block.data.params[1]);  

                if(result.data.params[0].data) {
                    var param = result.data.params[0].data.type;
                    
                    if(result.data.type == "function_field_string" || result.data.type == "function_field_boolean") {
                        this._funcParamQ.enqueue(param);
                    }
                }

                if(result.data.params[1]) {
                    if(result.data.params[1].data.params[0].data) {
                        var param = result.data.params[1].data.params[0].data.type;
                                        
                        if(result.data.params[1].data.type == "function_field_string" || result.data.params[1].data.type == "function_field_boolean") {
                            this._funcParamQ.enqueue(param);
                        } 
                    }
                }
            }
        }

        return result;
        
    };

    p.getLastParam = function(funcBlock) {
        if(funcBlock && funcBlock.data && funcBlock.data.params[1]) {
            var result = this.getLastParam(funcBlock.data.params[1]);
        }
        else {
            return funcBlock;
        }

        return result;
    };

    p.isFuncContentsMatch = function(blockFuncContents, textFuncStatements, paramMap) {
        var matchFlag = true; 
        for(var i = 0; i < blockFuncContents.length; i++) {
            if(!matchFlag)
                break;
            matchFlag = false;
            var blockFuncContent = blockFuncContents[i];
            var textFuncStatement = textFuncStatements[i];

            if(blockFuncContent && !textFuncStatement) {
                matchFlag = fasle;
                return matchFlag;
            }

            if(!blockFuncContent && textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            if(textFuncStatement.type == blockFuncContent.data.type) { //Type Check
                matchFlag = true;
                var textFuncStatementParams = textFuncStatement.params;
                var blockFuncContentParams = blockFuncContent.data.params;
                var cleansingParams = [];
                blockFuncContentParams.map(function(blockFuncContentParam, index) {
                    if(blockFuncContentParam)
                        cleansingParams.push(blockFuncContentParam);
                });
                blockFuncContentParams = cleansingParams;

                if(textFuncStatementParams.length == blockFuncContentParams.length) { //Statement Param Length Comparison   
                    matchFlag = true;
                    for(var j = 0; j < textFuncStatementParams.length; j++) {
                        if(!matchFlag)
                            break;
                        matchFlag = false;
                        if(textFuncStatementParams[j].name) {
                            for(var k in textFuncParams) {
                                if(textFuncStatementParams[j].name == textFuncParams[k]) { // Pram Locatin Comparision
                                    //console.log("textFuncStatementParams[j].name", textFuncStatementParams[j].name);
                                    //console.log("textFuncParams[k]", textFuncParams[k]);
                                    for(var bfcParam in paramMap) {
                                        if(blockFuncContentParams[j].data.type == bfcParam) {
                                            //console.log("blockFuncContentParams[j].data.type", blockFuncContentParams[j].data.type);
                                            //console.log("bfcParam", bfcParam);
                                            if(paramMap[bfcParam] == k) {
                                                matchFlag = true;
                                                break;
                                                //console.log("Function Definition Param Found", paramMap[bfcParam], "index k", j);
                                            }  
                                        }   
                                    } 
                                    if(matchFlag) 
                                        break;
                                }
                            }
                        } 
                        else if(textFuncStatementParams[j].type == "True" || textFuncStatementParams[j].type == "False") {
                            if(textFuncStatementParams[j].type == blockFuncContentParams[j].data.type) {
                                matchFlag = true;
                            }      
                        } else if(textFuncStatementParams[j].type && textFuncStatementParams[j].params) {
                            if(textFuncStatementParams[j].params[0] == blockFuncContentParams[j].data.params[0]) {
                                matchFlag = true;
                            }  
                        }   
                    }

                    if(matchFlag && textFuncStatement.statements && textFuncStatement.statements.length != 0) {
                        matchFlag = this.isFuncContentsMatch(blockFuncContent.data.statements[0]._data, textFuncStatement.statements[0]);
                    }
                }
                else {
                    matchFlag = false;
                    break;
                } 
            } 
            else {
                matchFlag = false;
                break;
            }
        }

        return matchFlag;
    };

    p.isParamBlock = function(block) {
        var type = block.type;
        if(type == "ai_boolean_distance" ||
            type == "ai_distance_value" ||
            type == "ai_boolean_object" ||
            type == "ai_boolean_and") {
            return true;
        } else {
            return false;
        }
    };

    p.hasBlockInfo = function(data, blockInfo) {
        var result = false;
        for(var key in blockInfo) {
            var info = blockInfo[key]; 
            if(key == data.type) {
                for(var j in info) {
                    var loc = info[j];
                    if(loc.start == data.start && loc.end == data.end) {
                       result = true;
                       break;
                    } 
                }
            }
        }

        return result;
    };

    p.updateBlockInfo = function(data, blockInfo) {
        var infoArr = blockInfo[data.type];
        if(infoArr && Array.isArray(infoArr) && infoArr.legnth != 0) {
            for(var i in infoArr) {
                var info = infoArr[i];
                if(info.start == data.start && info.end == data.end) {
                    break;
                }
                else {
                    var loc = {};
                    loc.start = data.start;
                    loc.end = data.end;

                    infoArr.push(loc);
                }
            }
        } else {
            blockInfo[data.type] = []; 

            var loc = {};
            loc.start = data.start;
            loc.end = data.end;

            blockInfo[data.type].push(loc);
        }
    };

    p.jsAdjustSyntax = function(block, syntax) {
        var result = '';
        if(block.data.type == 'ai_boolean_distance') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            secondParam = this.bTojBinaryOperatorConvertor(secondParam);
            var thirdParam = tokens[2];

            result = firstParam + ' ' + secondParam + ' ' + thirdParam;

        } else if(block.data.type == 'ai_boolean_object') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            var thirdParam = tokens[2];

            result = firstParam + ' ' + secondParam + ' ' + thirdParam;
        } else if(block.data.type == 'ai_distance_value') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            
            result = firstParam;
        } else {
            result = syntax;
        }

        return result;
    };

    p.bTojBinaryOperatorConvertor = function(operator) {
        var result;
        switch(operator) {
            case '\'BIGGER\'': result = ">"; break;
            case '\'BIGGER_EQUAL\'': result = ">="; break; 
            case '\'EQUAL\'': result = "=="; break;
            case '\'SMALLER\'': result = "<"; break;
            case '\'SMALLER_EQUAL\'': result = "<="; break;
        }

        return result;
    };

    p.jTobBinaryOperatorConvertor = function(operator) {
        var result;
        switch(operator) {
            case '>': result = "BIGGER"; break;
            case '>=': result = "BIGGER_EQUAL"; break; 
            case '==': result = "EQUAL"; break;
            case '<': result = "SMALLER"; break;
            case '<=': result = "SMALLER_EQUAL"; break;
        }

        return result;
    };

    p.radarVariableConvertor = function(variable) {
        var items = variable.split('_');
        var result = items[1].toUpperCase();

        return result;
    };

})(Entry.TextCodingUtil.prototype);