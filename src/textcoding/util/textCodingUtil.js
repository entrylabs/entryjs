/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtil");

goog.require("Entry.Queue");

Entry.TextCodingUtil = {};

(function(tu) {
    this._funcParams;
    this._funcParamQ;
    this._currentObject;

    /*tu.init = function() {
        this._funcParams = [];
    };*/

    tu.initQueue = function() {
        var queue = new Entry.Queue();
        this._funcParamQ = queue;

        var fNameQueue = new Entry.Queue();
        this._funcNameQ = fNameQueue;
    };

    tu.clearQueue = function() {
        this._funcParamQ.clear();
        this._funcNameQ.clear();
    };

	tu.indent = function(textCode) {
        var result = "\t";
        var indentedCodeArr = textCode.split("\n");
        indentedCodeArr.pop();
        result += indentedCodeArr.join("\n\t");
        result = "\t" + result.trim();//.concat('\n');

        return result;
    };

    tu.isNumeric = function(value) {
        value = String(Math.abs(value));
        if(value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false;
    };

    tu.isBinaryOperator = function(value) {
        if(value == "==" || value == ">" || value == "<" || value == ">="|| value == "<=" ||
            value == "+" || value == "-" || value == "*" || value == "/") {
            return true;
        }

        return false;
    };

    tu.binaryOperatorConvert = function(operator) {
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

    tu.logicalExpressionConvert = function(operator) {
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

    tu.dropdownDynamicNameToIdConvertor = function(name, menuName, currentObject) {
        var result = name;
        if(Entry.getMainWS() && Entry.getMainWS().vimBoard) {
            var VIM = Entry.getMainWS().vimBoard;
            if(VIM) var currentScene = VIM._currentScene;
        }

        if(menuName == "scenes") {
            var scenes = Entry.scene.getScenes();
            for(var s in scenes) {
                var scene = scenes[s];
                if(name == scene.name) {
                    return scene.id;
                }
            }
        }
        else if(menuName == "spritesWithMouse" || menuName == "spritesWithSelf" ||
            menuName == "collision" || menuName == "clone") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                if(object.scene.id == currentScene.id)
                    if(name == object.name)
                        return object.id;
            }
        }
        else if(menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.name_ == name) {
                    if(currentObject) {
                        if(currentObject.id == entryVariable.object_)
                            return entryVariable.id_;
                    }
                    else
                        return entryVariable.id_;
                }
            }
        }
        else if(menuName == "lists") {
            var entryLists = Entry.variableContainer.lists_;
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.name_ == name) {
                    if(currentObject) {
                        if(currentObject.id == entryList.object_)
                            return entryList.id_;
                    }
                    else
                        return entryList.id_;
                }

            }
        }
        else if(menuName == "messages") {
            var entryMessages = Entry.variableContainer.messages_;
            for(var e in entryMessages) {
                var entryMessage = entryMessages[e];
                if(entryMessage.name == name) {
                    return entryMessage.id;

                }

            }
        }
        else if(menuName == "pictures") {
            currentObject = VIM._currentObject;
            var pictures = currentObject.pictures;
            for(var p in pictures) {
                var picture = pictures[p];
                if(picture.name == name) {
                    return picture.id;
                }
            }
        }
        else if(menuName == "sounds") {
            currentObject = VIM._currentObject;
            var sounds = currentObject.sounds;
            for(var p in sounds) {
                var sound = sounds[p];
                if(sound.name == name) {
                    return sound.id;
                }
            }
        }

        return result;
    };

    tu.dropdownDynamicIdToNameConvertor = function(id, menuName) {
        //var found = false;
        var result;

        if(menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.id_ == id) {
                    if(entryVariable.object_)
                        result = "self." + entryVariable.name_;
                    else
                        result = entryVariable.name_;
                    break;
                }

            }
        }
        else if(menuName == "lists") {
            var entryLists = Entry.variableContainer.lists_;
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.id_ == id) {
                    if(entryList.object_)
                        result = "self." + entryList.name_;
                    else
                        result = entryList.name_;
                    break;
                }

            }
        }
        else if(menuName == "messages") {
            var entryMessages = Entry.variableContainer.messages_;
            for(var e in entryMessages) {
                var entryList = entryMessages[e];
                if(entryList.id == id) {
                    result = entryList.name;
                    break;
                }

            }
        }
        else if(menuName == "pictures") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var pictures = object.pictures;
                for(var p in pictures) {
                    var picture = pictures[p];
                    if(picture.id == id) {
                        result = picture.name;
                        return result;
                    }
                }
            }
        }
        else if(menuName == "sounds") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var sounds = object.sounds;
                for(var p in sounds) {
                    var sound = sounds[p];
                    if(sound.id == id) {
                        result = sound.name;
                        return result;
                    }
                }
            }
        }
        else if(menuName == "scenes") {
            var scenes = Entry.scene.getScenes();
            for(var s in scenes) {
                var scene = scenes[s];
                if(scene.id == id) {
                    result = scene.name;
                    break;
                }
            }
        }


        return result;

    };

    tu.getDynamicIdByNumber = function(value, textParam) {
        var result = value;
        if(Entry.getMainWS() && Entry.getMainWS().vimBoard)
            var VIM = Entry.getMainWS().vimBoard;
        else return result;

        var currentObject = VIM._currentObject;

        if(typeof value == "number") {
            result = "None";
            if(textParam.menuName == "pictures") {
                if(value > 0) {
                    var objects = Entry.container.getAllObjects();
                    for(var o in objects) {
                        var object = objects[o];
                        if(object.id == currentObject.id) {
                            var pictures = object.pictures;
                            var picture = pictures[value-1];
                            if(picture) {
                                result = picture.name;
                                break;
                            }
                        }
                    }
                }
            }
            else if(textParam.menuName == "sounds") {
                if(value > 0) {
                    var objects = Entry.container.getAllObjects();
                    for(var o in objects) {
                        var object = objects[o];
                        if(object.id == currentObject.id) {
                            var sounds = object.sounds;
                            var sound = sounds[value-1];
                            if(sound) {
                                result = sound.name;
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            result = Entry.TextCodingUtil.dropdownDynamicNameToIdConvertor(value, textParam.menuName);
        }


        return result;

        function isNumeric(value) {
            return /^\d+$/.test(value);
        }
    };

    tu.isLocalType = function(id, menuName) {
        var result = id;

        if(menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.id_ == id) {
                    if(entryVariable.object_)
                        return true;
                    else
                        return false;
                }
            }
        }
        else if(menuName == "lists") {
            var entryLists = Entry.variableContainer.lists_;
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.id_ == id) {
                    if(entryList.object_)
                        return true;
                    else
                        return false;
                }

            }
        }

        return false;
    };

    tu.binaryOperatorValueConvertor = function(operator) {
        var result;
        switch(operator) {
            case '\"EQUAL\"': {
                result = "==";
                break;
            }
            case '\"GREATER\"': {
                result = ">";
                break;
            }
            case '\"LESS\"': {
                result = "<";
                break;
            }
            case '\"GREATER_OR_EQUAL\"': {
                result = ">=";
                break;
            }
            case '\"LESS_OR_EQUAL\"': {
                result = "<=";
                break;
            }
            case '\"그리고\"': {
                result = "&&";
                break;
            }
            case '\"또는\"': {
                result = "||";
                break;
            }
            case '\"PLUS\"': {
                result = "+";
                break;
            }
            case '\"MINUS\"': {
                result = "-";
                break;
            }
            case '\"MULTI\"': {
                result = "*";
                break;
            }
            case '\"DIVIDE\"': {
                result = "/";
                break;
            }
            default: {
                result = operator;
            }
        }

        return result;
    };

    tu.variableListFilter = function(block, index, param) {

        if(param == "None")
            return result = param;

        var result = param;
        var type = block.data.type;
        if(type == "change_variable" || type == "set_variable" || type == "get_variable" ) {
            if(index == 1) {
                result = eval(param);
            }
        } else if(type == "length_of_list" || type == "is_included_in_list") {
            if(index == 2) {
                result = eval(param);
            }
        } else if(type == "value_of_index_from_list") {
            if(index == 2) {
                result = eval(param);
            }
            else if(index == 4) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "remove_value_from_list") {
            if(index == 2) {
                result = eval(param);
            }
            else if(index == 1) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "insert_value_to_list") {
            if(index == 2) {
                result = eval(param);
            }
            else if(index == 3) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "change_value_list_index") {
            if(index == 1) {
                result = eval(param);
            }
            else if(index == 2) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "add_value_to_list") {
            if(index == 2) {
                result = eval(param);
            }
        }

        return result;
    };

    /*tu.variableListSpaceMessage = function() {
        var error = {};
        error.title = "파이썬변환(Converting) 오류";
        error.message = "공백(띄어쓰기)이 포함된 변수 또는 리스트는 변환할 수 없습니다.";
        error.line = this._blockCount;
        throw error;
    };*/

    tu.isGlobalVariableExisted = function(name) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            if(entryVariable.object_ === null && entryVariable.name_ == name) {
                return true;
            }

        }

        return false;
    };

    tu.updateGlobalVariable = function(name, value) {
        var variables = Entry.variableContainer.variables_;
        for(var i in variables) {
            var variable = variables[i];
            if(variable.object_ === null && variable.name_ == name) {
                var model = variable.toJSON();
                model.name = name;
                model.value = value;
                variable.syncModel_(model);
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createGlobalVariable = function(name, value) {
        if(this.isGlobalVariableExisted(name))
            return;

        var variable = {
            name: name,
            value: value,
            variableType: 'variable'
        };


        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    tu.isLocalVariableExisted = function(name, object) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                return true;
            }

        }

        return false;
    };

    tu.updateLocalVariable = function(name, value, object) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                var model = entryVariable.toJSON();
                model.name = name;
                model.value = value;
                entryVariable.syncModel_(model);
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createLocalVariable = function(name, value, object) {
        if(this.isLocalVariableExisted(name, object))
            return;

        var variable = {
            name: name,
            value: value,
            object: object.id,
            variableType: 'variable'
        };


        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    tu.isLocalVariable = function(variableId) {
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

    tu.isGlobalListExisted = function(name) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            if(entryList.object_ === null && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    };

    tu.updateGlobalList = function(name, array) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            if(entryList.object_ === null && entryList.name_ == name) {
                list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isCloud_,
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

    tu.createGlobalList = function(name, array) {
        if(this.isGlobalListExisted(name))
            return;

        var list = {
            name: name,
            array: array,
            variableType: 'list'
        };


        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    tu.isLocalListExisted = function(name, object) {
        if(!object) return false;
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            if(entryList.object_ === object.id && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    };

    tu.updateLocalList = function(name, array, object) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            if(entryList.object_ === object.id && entryList.name_ == name) {
                var list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isCloud_,
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

    tu.createLocalList = function(name, array, object) {
        if(this.isLocalListExisted(name, object))
            return;

        var list = {
            name: name,
            array: array,
            object: object.id,
            variableType: 'list'
        };


        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    tu.isLocalList = function(listId) {
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

    tu.createMessage = function(name) {
        var messages = Entry.variableContainer.messages_;
        var exist = Entry.isExist(name, 'name', messages);
        if(exist)
            return;
        var message = {
            name: name
        };

        Entry.variableContainer.addMessage(message);
        Entry.variableContainer.updateList();
    };

    /*tu.isLocalType = function(block, id) {
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
    };*/

    tu.isEventBlock = function(block) {
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

    tu.isEntryEventBlockWithParam = function(block) {
        var blockType = block.data.type;
        if( blockType == "when_some_key_pressed" ||
            blockType == "when_message_cast")
            return true;

        return false;
    };

    tu.isEventBlockByType = function(blockType) {
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

    tu.makeDefinition = function(block) {
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

    /*tu.isNoPrintBlock = function(block) {
        var blockType = block.data.type;

        return false;
    };*/

    tu.entryEventFilter = function(text) {
        var startIndex = text.indexOf("(");
        var endIndex = text.indexOf(")");

        var stmt = text.substring(0, startIndex);
        var param = text.substring(startIndex+1, endIndex);
        param = param.replace(/\"/g, "");

        if(param) {
            if(isNaN(param)) {
                param = param.replace(/ /g, "_space_");
            }
            else {
                param = 'num' + param;
            }

            if(param == 'None')
                param = 'none';
        }


        text = stmt + "(" + param + "):\n";



        return text;
    }

    tu.entryEventFuncFilter = function(threads) {
        var result;
        var eventFound = false;
        var threadArr = threads.split('\n');

        for(var i in threadArr) {
                var thread = threadArr[i];
                var trimedThread = threadArr[i].trim();
                var colonIndex = trimedThread.indexOf(":");
                var preText = "";

                if(colonIndex > 0) {
                    preText = trimedThread.substring(0, colonIndex+1);
                }


                preText = preText.split("(");
                preText = preText[0];

                /*if( preText == "def entry_event_start():" ||
                    preText == "def entry_event_mouse_down():" ||
                    preText == "def entry_event_mouse_up():" ||
                    preText == "def entry_event_object_down():" ||
                    preText == "def entry_event_object_up():" ||
                    preText == "def entry_event_scene_start():" ||
                    preText == "def entry_event_clone_create():" ) {

                    //var tokens = [];
                    //tokens = funcPart.split("def");
                    //funcPart = tokens[1].substring(0, tokens[1].length-1).trim();

                    thread = thread.replace(/def /, "");
                    var colonIndex = thread.indexOf(":");
                    var funcPart = "";
                    var restPart = "";

                    if(colonIndex > 0) {
                        funcPart = thread.substring(0, colonIndex+1);
                        restPart = thread.substring(colonIndex+1, thread.length);
                    }

                    if(restPart) {
                        var newThread = funcPart.concat("\n").concat(restPart.trim());
                    }
                    else {
                        var newThread = funcPart;
                    }

                    threadArr[i] = newThread;
                    eventFound = true;
                }
                else */if(preText == "def when_press_key" || preText == "def when_get_signal") {
                    thread = thread.replace(/def /, "");
                    var colonIndex = thread.indexOf(":");
                    var funcPart = "";
                    var restPart = "";

                    if(colonIndex > 0) {
                        funcPart = thread.substring(0, colonIndex);
                        restPart = thread.substring(colonIndex+1, thread.length);
                    }

                    if(restPart) {
                        var newThread = funcPart.concat("\n").concat(restPart.trim());
                    }
                    else {
                        var newThread = funcPart;
                    }

                    threadArr[i] = newThread;
                    eventFound = true;
                }
                else {
                    if(eventFound) {
                        var newThread = threadArr[i];
                        newThread = newThread.replace(/\t/g, "    ");
                        newThread = newThread.replace(/    /, "");
                        threadArr[i] = newThread;
                    }
                }
        }


        result = threadArr.join('\n');
        return result;
    };

    tu.eventBlockSyntaxFilter = function(name) {
        var result;
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {

            name = "def " + name;
            result = name;
            return name;
        }

        return result;

    };


    tu.isEntryEventFunc = function(name) {
        if( name == "def when_start" ||
            name == "def when_press_key" ||
            name == "def when_click_mouse_on" ||
            name == "def when_click_mouse_off" ||
            name == "def when_click_object_on" ||
            name == "def when_click_object_off" ||
            name == "def when_get_signal" ||
            name == "def when_start_scene" ||
            name == "def when_make_clone") {

            return true;
        }

        return false;

    };

    /////////////////////////////////////////////////////
    //Important
    ////////////////////////////////////////////////////
    tu.isEntryEventFuncByFullText = function(text) {
        var index = text.indexOf("(");
        var name = text.substring(0, index);

        if( name == "def when_start" ||
            name == "def when_press_key" ||
            name == "def when_click_mouse_on" ||
            name == "def when_click_mouse_off" ||
            name == "def when_click_object_on" ||
            name == "def when_click_object_off" ||
            name == "def when_get_signal" ||
            name == "def when_start_scene" ||
            name == "def when_make_clone") {

            return true;
        }
        else if(name == "def entry_event_start" ||
            name == "def entry_event_key" ||
            name == "def entry_event_mouse_down" ||
            name == "def entry_event_mouse_up" ||
            name == "def entry_event_object_down" ||
            name == "def entry_event_object_up" ||
            name == "def entry_event_signal" ||
            name == "def entry_event_scene_start" ||
            name == "def entry_event_clone_create") {


            return true;
        }

        return false;

    };


    tu.eventBlockSyntaxFilter = function(name) {
        var result;
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {

            name = "def " + name;
            result = name;
            return name;
        }
        else if(name == "entry_event_start" ||
            name == "entry_event_key" ||
            name == "entry_event_mouse_down" ||
            name == "entry_event_mouse_up" ||
            name == "entry_event_object_down" ||
            name == "entry_event_object_up" ||
            name == "entry_event_signal" ||
            name == "entry_event_scene_start" ||
            name == "entry_event_clone_create") {

            name = "def " + name;
            result = name;
            return name;
        }

        return result;

    };

    tu.isEntryEventFuncName = function(name) {
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {


            return true;
        }
        else if(name == "entry_event_start" ||
            name == "entry_event_key" ||
            name == "entry_event_mouse_down" ||
            name == "entry_event_mouse_up" ||
            name == "entry_event_object_down" ||
            name == "entry_event_object_up" ||
            name == "entry_event_signal" ||
            name == "entry_event_scene_start" ||
            name == "entry_event_clone_create") {


            return true;
        }

        return false;
    };

    tu.isEntryEventFuncByType = function(type) {
        if( type == "when_run_button_click" ||
            type == "when_some_key_pressed" ||
            type == "mouse_clicked" ||
            type == "mouse_click_cancled" ||
            type == "when_object_click" ||
            type == "when_object_click_canceled" ||
            type == "when_message_cast" ||
            type == "when_scene_start" ||
            type == "when_clone_start") {

            return true;
        }
        return false;
    }
    /////////////////////////////////////////////////////
    //Important
    ////////////////////////////////////////////////////

    tu.isEntryEventFuncNameWithParam = function(name) {
        var lastIndex = name.lastIndexOf("_");

        if(lastIndex > 0) {
            var preText = name.substring(0, lastIndex);
            if( preText == "when_press_key" ||
                preText == "when_get_signal") {
                return true;
            }
        }

        return false;
    };

    tu.searchFuncDefParam = function(block) {
        if(block.data.type == "function_field_label") {
            var name = block.data.params[0];
            this._funcNameQ.enqueue(name);

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

    tu.isEntryEventFuncTypeWithParam = function(block) {
        if(block.type == "when_some_key_pressed" ||
            block.type == "when_message_cast")
            return true;

        return false;
    };

    tu.isEntryEventDesignatedParamName = function(paramName) {
        var result = false;

        if(paramName == "key") {
            result = true;
        }
        else if(paramName == "signal") {
            result = true;
        }

        return result;
    };

    tu.gatherFuncDefParam = function(block) {
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

    tu.getLastParam = function(funcBlock) {
        if(funcBlock && funcBlock.data && funcBlock.data.params[1]) {
            var result = this.getLastParam(funcBlock.data.params[1]);
        }
        else {
            return funcBlock;
        }

        return result;
    };

    tu.isFuncContentsMatch = function(blockFuncContents, textFuncStatements, paramMap, paramInfo, currentFuncKey) {
        var matchFlag = true;

        if(textFuncStatements.length != blockFuncContents.length) {
            matchFlag = false;
            return matchFlag;
        }

        for(var i = 0; i < blockFuncContents.length; i++) {
            if(!matchFlag)
                break;
            matchFlag = false;
            var blockFuncContent = blockFuncContents[i];
            var textFuncStatement = textFuncStatements[i];

            if(blockFuncContent && !textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            if(!blockFuncContent && textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }


            if(blockFuncContent._schema && blockFuncContent._schema.template) {
                var template = blockFuncContent._schema.template;
                var blockFuncName = template.trim().split(' ')[0];
                if(blockFuncName == textFuncStatement.funcName)
                    var reculsive = true;
                else
                    var reculsive = false;
            }

            if(textFuncStatement.type == blockFuncContent.data.type || reculsive) {
                matchFlag = true;
                if(currentFuncKey != textFuncStatement.type)
                    matchFlag = false;

                var textFuncStatementParams = textFuncStatement.params;
                var blockFuncContentParams = blockFuncContent.data.params;
                var cleansingParams = [];
                if(textFuncStatementParams == undefined || textFuncStatementParams == null)
                    textFuncStatementParams = [];
                if(blockFuncContentParams == undefined || blockFuncContentParams == null)
                    blockFuncContentParams = [];

                blockFuncContentParams.map(function(blockFuncContentParam, index) {
                    if(blockFuncContentParam)
                        cleansingParams.push(blockFuncContentParam);
                });
                blockFuncContentParams = cleansingParams;

                cleansingParams = [];
                textFuncStatementParams.map(function(textFuncStatementParam, index) {
                    if(textFuncStatementParam)
                        cleansingParams.push(textFuncStatementParam);
                });
                textFuncStatementParams = cleansingParams;

                if(textFuncStatementParams.length == blockFuncContentParams.length) { //Statement Param Length Comparison
                    matchFlag = true;
                    for(var j = 0; j < textFuncStatementParams.length; j++) {
                        if(!matchFlag)
                            break;
                        matchFlag = false;

                        if(typeof textFuncStatementParams[j] !== "object") {
                            if(textFuncStatementParams[j] == blockFuncContentParams[j]) {
                                matchFlag = true;
                            }
                            else {
                                matchFlag = false;
                            }
                        }
                        else if(textFuncStatementParams[j].name) {
                            var paramKey = textFuncStatementParams[j].name;
                            var paramBlockType = paramInfo[paramKey];

                            if(paramBlockType) {
                                if(blockFuncContentParams[j].data.type == paramBlockType)
                                    matchFlag = true;
                            }
                            else {
                                if(textFuncStatementParams[j].params && blockFuncContentParams[j].data.params && (textFuncStatementParams[j].params[0] == blockFuncContentParams[j].data.params[0]))
                                    matchFlag = true;
                            }
                        }
                        else if(textFuncStatementParams[j].type == "True" || textFuncStatementParams[j].type == "False") {
                            if(blockFuncContentParams[j].data) {
                                if(textFuncStatementParams[j].type == blockFuncContentParams[j].data.type) {
                                     matchFlag = true;
                                }
                            }
                            else if(textFuncStatementParams[j].type == blockFuncContentParams[j].type) {
                                matchFlag = true;
                            }
                        }
                        else if(textFuncStatementParams[j].type && textFuncStatementParams[j].params) {
                            matchFlag = this.isFuncContentsParamsMatch(blockFuncContentParams[j], textFuncStatementParams[j], paramMap, paramInfo);
                        }
                    }

                    if(matchFlag && textFuncStatement.statements && textFuncStatement.statements.length != 0) {
                        for(var kkk in textFuncStatement.statements)
                            matchFlag = this.isFuncContentsMatch(blockFuncContent.data.statements[kkk]._data, textFuncStatement.statements[kkk], paramMap, paramInfo);
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

    tu.isFuncContentsParamsMatch = function(blockFuncContentParam, textFuncStatementParam, paramMap, paramInfo) {

        var matchFlag = false;

        var tfspType = textFuncStatementParam.type;
        var bfcpType = blockFuncContentParam.data.type;

        if(tfspType == "text") {
            tfspType = "literal";
        }
        else if(tfspType == "number") {
            tfspType = "literal";
        }
        else {
            if(textFuncStatementParam.isParamFromFunc)
                tfspType = paramInfo[tfspType];
        }


        if(bfcpType == "text") {
            bfcpType = "literal";
        }
        else if(bfcpType == "number") {
            bfcpType = "literal";
        }


        if(tfspType == bfcpType) {
            var textSubParams = textFuncStatementParam.params;
            //var blockSubParamsUncleansed = blockFuncContentParam.data.params;
            var blockSubParams = blockFuncContentParam.data.params;

            /*for(var b in blockSubParamsUncleansed) {
                var blockSubParamUncleansed = blockSubParamsUncleansed[b];
                if(blockSubParamUncleansed)
                    blockSubParams.push(blockSubParamUncleansed);
            }*/

            if(!textSubParams && !blockSubParams) {
                matchFlag = true;
            }
            else if(textSubParams.length == blockSubParams.length) {
                matchFlag = true;
                for(var t in textSubParams) {
                    if(!matchFlag)
                        break;
                    matchFlag = false;
                    var textSubParam = textSubParams[t];
                    var blockSubParam = blockSubParams[t];
                    if(!textSubParam && !blockSubParam) {
                        matchFlag = true;
                    }
                    else if(typeof textSubParam !== "object") {
                        if(textSubParam == blockSubParam) {
                            matchFlag = true;
                        }
                    }
                    else if(textSubParam.name) {
                        var paramKey = textSubParam.name;
                        var paramBlockType = paramInfo[paramKey];
                        if(paramBlockType) {
                            if(blockSubParam.data.type == paramBlockType)
                                matchFlag = true;
                        } else {
                            if(textSubParam.params[0] == blockSubParam.data.params[0])
                                matchFlag = true;
                        }
                    }
                    else if(textSubParam.type == "True" || textSubParam.type == "False") {
                        if(blockSubParam.data) {
                            if(textSubParam.type == blockSubParam.data.type) {
                                 matchFlag = true;
                            }
                        }
                        else if(textSubParam.type == blockSubParam.type) {
                            matchFlag = true;
                        }
                    }
                    else if(textSubParam.type && textSubParam.params) {
                        matchFlag = this.isFuncContentsParamsMatch(blockSubParam, textSubParam, paramMap, paramInfo);
                    }
                }
            }
            else {
                matchFlag = false;
            }
        }
        else {
                matchFlag = false;
        }


        return matchFlag;
    };

    tu.isParamBlock = function(block) {
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

    tu.hasBlockInfo = function(data, blockInfo) {
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

    tu.makeFuncParamBlock = function(targetBlock, paramInfo, blockCount) {
        /*if(targetBlock.type == cFuncKey) {
            targetBlock.type = cFuncType;
        }*/
        var tParams = targetBlock.params;



        for(var i in tParams) {
            var param = tParams[i];
            if(!param)
                continue;

            if(typeof param != "object")
                continue;

            if(param.type && param.params && param.params.length != 0) {
                this.makeFuncParamBlock(param, paramInfo, blockCount);
            }
            else if(param.type && param.params && param.params.length == 0) {
                var paramKey = param.type;
                var paramBlockType = paramInfo[paramKey];
                if(paramBlockType) {
                    var paramBlock = {};
                    paramBlock.type = paramBlockType;
                    paramBlock.params = [];
                    targetBlock.params[i] = paramBlock;
                }
            }
            else if(param.name) {
                var paramKey = param.name;
                var paramBlockType = paramInfo[paramKey];
                if(paramBlockType) {
                    var paramBlock = {};
                    paramBlock.type = paramBlockType;
                    paramBlock.params = [];
                    targetBlock.params[i] = paramBlock;
                }
                else if(param.type != "get_variable" ) {
                    var keyword = param.name;
                    Entry.TextCodingError.error(
                        Entry.TextCodingError.TITLE_CONVERTING,
                        Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                        keyword,
                        blockCount,
                        Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
                }
            }
            else if(param.object && param.property) { //self.xx
                var keyword = param.object.name + '.' + param.property.name;
                Entry.TextCodingError.error(
                    Entry.TextCodingError.TITLE_CONVERTING,
                    Entry.TextCodingError.MESSAGE_CONV_NO_VARIABLE,
                    keyword,
                    blockCount,
                    Entry.TextCodingError.SUBJECT_CONV_VARIABLE);
            }

        }

        var stmts = targetBlock.statements;

        if(stmts && stmts[0] && stmts[0].length != 0) {
            var statements0 = stmts[0];
            for(var s0 in statements0) {
                var statement0 = statements0[s0];
                this.makeFuncParamBlock(statement0, paramInfo, blockCount);
            }
        }

        if(stmts && stmts[1] && stmts[1].length != 0) {
            var statements1 = stmts[1];
            for(var s1 in statements1) {
                var statement1 = statements1[s1];
                this.makeFuncParamBlock(statement1, paramInfo, blockCount);
            }
        }
    };

    tu.updateBlockInfo = function(data, blockInfo) {
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

    tu.assembleRepeatWhileTrueBlock = function(block, syntax) {
        var result = '';
        if(block.data.type == "repeat_while_true") {
            var blockArr = syntax.split(" ");
            var lastIndex = blockArr.length-1;
            var option = blockArr[lastIndex];

            if(option == 'until') {
                var condition = "not";
                blockArr.splice(1, 0, condition);
                lastIndex += 1;
                blockArr.splice(lastIndex, 1);
                result = blockArr.join(" ");
            }
            else if(option == 'while') {
                blockArr.splice(lastIndex, 1);
                result = blockArr.join(" ");
            }
            else {
                result = syntax;
            }
        }
        else {
            result = syntax;
        }


        return result;
    };

    tu.isJudgementBlock = function(blockType) {
        if(blockType == "is_clicked" ||
            blockType == "is_press_some_key" ||
            blockType == "reach_something" ||
            blockType == "boolean_basic_operator" ||
            blockType == "boolean_and" ||
            blockType == "boolean_or" ||
            blockType == "boolean_not") {

            return true;
        }

        return false;
    };

    tu.isCalculationBlock = function(blockType) {
        if(blockType == "calc_basic" ||
            blockType == "calc_rand" ||
            blockType == "coordinate_mouse" ||
            blockType == "coordinate_object" ||
            blockType == "get_sound_volume" ||
            blockType == "quotient_and_mod" ||
            blockType == "calc_operation" ||
            blockType == "get_project_timer_value" ||
            blockType == "get_date" ||
            blockType == "distance_something" ||
            blockType == "get_sound_duration" ||
            blockType == "length_of_string" ||
            blockType == "combine_something" ||
            blockType == "char_at" ||
            blockType == "substring" ||
            blockType == "index_of_string" ||
            blockType == "replace_string" ||
            blockType == "change_string_case") {

            return true;
        }

        return false;
    };

    tu.isVariableDeclarationBlock = function(blockType) {
         if(blockType == "set_variable")
            return true;

        return false;
    };

    tu.isHWParamBlock = function(blockType) {
        if(blockType == "hamster_hand_found" ||
            blockType == "hamster_value" ||
            blockType == "arduino_get_port_number" ||
            blockType == "arduino_get_number_sensor_value" ||
            blockType == "arduino_get_digital_value" ||
            blockType == "arduino_convert_scale" ||
            blockType == "arduino_ext_get_analog_value" ||
            blockType == "arduino_ext_get_analog_value_map" ||
            blockType == "arduino_ext_get_ultrasonic_value" ||
            blockType == "arduino_ext_get_digital" ||
            blockType == "arduino_ext_tone_list" ||
            blockType == "arduino_ext_octave_list") {

            return true;
        }

        return false;
    };

    tu.isMaterialBlock = function(blockType) {
        if(blockType == "get_canvas_input_value" ||
            blockType == "get_variable" ||
            blockType == "value_of_index_from_list" ||
            blockType == "length_of_list" ||
            blockType == "is_included_in_list") {

            return true;
        }

        return false;
    };

    tu.jsAdjustSyntax = function(block, syntax) {
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

    tu.bTojBinaryOperatorConvertor = function(operator) {
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

    tu.jTobBinaryOperatorConvertor = function(operator) {
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

    tu.radarVariableConvertor = function(variable) {
        var items = variable.split('_');
        var result = items[1].toUpperCase();

        return result;
    };

    tu.tTobDropdownValueConvertor = function(value) {
        var result;
        if(value == "stone") {
            result = "OBSTACLE";
        } else if(value == "wall") {
            result = value.toUpperCase();
        } else if(value == "item") {
            result = value.toUpperCase();
        } else {
            result = value;
        }

        return result;
    };

    tu.canConvertTextModeForOverlayMode = function(convertingMode) {
        var message;
        var oldMode = Entry.getMainWS().oldMode;

        if(oldMode == Entry.Workspace.MODE_OVERLAYBOARD && convertingMode == Entry.Workspace.MODE_VIMBOARD) {
            message = Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_EDITOR];
            return message;
        }

        return message;
    };

    tu.isNamesIncludeSpace = function() {
        var vc = Entry.variableContainer;
        if(!vc)
            return;
        //inspect variables
        var targets = vc.variables_ || [];
        for (var i=0; i<targets.length; i++) {
            if (test(targets[i].name_)) {
                return Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT];
            }
        }

        //inspect lists
        targets = vc.lists_ || [];
        for (i=0; i<targets.length; i++) {
            if (test(targets[i].name_))
                return Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT];
        }

        //this doesn't need for now
        //inspect messages
        /*targets = vc.messages_ || [];
        for (i=0; i<targets.length; i++) {
            if (test(targets[i].name_))
                return "메시지 이름이 공백 포함";
        }*/

        //inspect functions
        targets = vc.functions_ || {};
        for (i in targets) {
            var target = targets[i];

            var funcThread = target.content._data[0];
            var funcBlock = funcThread._data[0];
            if(funcBlock.data.type == "function_create") {
                if(funcBlock.params.length == 2) {
                    var paramBlock = funcBlock.params[0];
                    if(paramBlock.data.type == "function_field_label") {
                        var paramBlockParams = paramBlock.data.params;
                        if(paramBlockParams.length == 2) {
                            if(paramBlockParams[1] == undefined) {
                                var name = paramBlockParams[0];
                                if (test(name))
                                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_EMPTY_TEXT];
                            }
                            else
                                if(paramBlockParams[1].data.type == "function_field_label")
                                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_FIELD_MULTI];
                                else
                                    if(this.hasFunctionFieldLabel(paramBlockParams[1]))
                                        return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_FIELD_MULTI];
                        }
                        else
                            return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
                    }
                    else
                        return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
                } else
                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
            } else
                return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
        }

        return false;
        function test(name) {
            return / /.test(name);
        }
    };

    tu.isNameIncludeSpace = function(name, type) {
        if (type == "variable" && test(name)) {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT_ADD_CHANGE];
        }
        else if (type == "list" && test(name)) {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT_ADD_CHANGE];
        }
        else if (type == "function" && test(name)) {
            return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_EMPTY_TEXT_ADD_CHANGE];
        }

        return false;

        function test(name) {
            return / /.test(name);
        }
    };

    tu.hasFunctionFieldLabel = function(fBlock) {
        if(!fBlock || !fBlock.data) return;
        if(fBlock.data.type == "function_field_label")
            return true;
        var params = fBlock.data.params;
        if(params[0]) {
            var type = params[0].data.type;
            if(type == "function_field_label")
                return true;
            if(params[0].data.params)
                if(this.hasFunctionFieldLabel(params[0]))
                    return true;
        }

        if(params[1]) {
            var type = params[1].data.type;
            if(type == "function_field_label")
                return true;
            if(params[1].data.params)
                if(this.hasFunctionFieldLabel(params[1]))
                    return true;
        }

        return false;

    };

    /*tu.addFuncParam = function(param) {
        this._funcParams.push(param);
    };

    tu.clearFuncParam = function() {
        this._funcParams = [];
    };

    tu.isFuncParam = function(paramName) {
        var result = false;

        var funcParams = this._funcParams;

        if(funcParams.length == 0)
            return false;

        for(var p in funcParams) {
            var funcParam = funcParams[p];
            if(funcParam == paramName) {
                result = true;
                break;
            }
        }

        return result;
    };*/

    tu.makeExpressionStatementForEntryEvent = function(calleName, arg) {
        var expressionStatement = {};

        var type = "ExpressionStatement";
        var expression = {};

        expression.type = "CallExpression";

        var callee = {};
        callee.name = calleName;
        callee.type = "Identifier";
        expression.callee = callee;

        var arguments = [];
        var argument = {};
        argument.type = "Literal";
        argument.value = arg;
        arguments.push(argument);
        expression.arguments = arguments;

        expressionStatement.expression = expression;
        expressionStatement.type = type;

        return expressionStatement;
    };

    tu.setMathParams = function(propertyName, params) {
        var optionParam;

        if(propertyName == "pow") {
            optionParam = "square";
            params[3] = optionParam;
        }
        else if(propertyName == "sqrt") {
            optionParam = "root";
            params[3] = optionParam;
        }
        else if(propertyName == "sin") {
            optionParam = "sin";
            params[3] = optionParam;
        }
        else if(propertyName == "cos") {
            optionParam = "cos";
            params[3] = optionParam;
        }
        else if(propertyName == "tan") {
            optionParam = "tan";
            params[3] = optionParam;
        }
        else if(propertyName == "asin") {
            optionParam = "asin_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "acos") {
            optionParam = "acos_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "atan") {
            optionParam = "atan_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "log") {
            optionParam = "ln";
            params[3] = optionParam;
        }
        else if(propertyName == "log10") {
            optionParam = "log";
            params[3] = optionParam;
        }
        else if(propertyName == "floor") {
            optionParam = "floor";
            params[3] = optionParam;
        }
        else if(propertyName == "ceil") {
            optionParam = "ceil";
            params[3] = optionParam;
        }
        else if(propertyName == "round") {
            optionParam = "round";
            params[3] = optionParam;
        }
        else if(propertyName == "factorial") {
            optionParam = "factorial";
            params[3] = optionParam;
        }
        else if(propertyName == "fabs") {
            optionParam = "abs";
            params[3] = optionParam;
        }

        return optionParam;
    };

    tu.isMathExpression = function(text) {
        var textTokens = text.split("(");
        var textName = textTokens[0];

        if(textName == "Entry.math_operation")
            return true;

        return false;
    };

    tu.makeMathExpression = function(text) {
        var result = text;
        var textTokens = text.split("(");
        var paramsParts = textTokens[1];
        var paramsTokens = paramsParts.split(",");
        var mathValue = paramsTokens[0];
        var mathOption = paramsTokens[1];

        mathOption = mathOption.substring(2, mathOption.length-2).trim();


        if(mathOption == "square") {
            mathProperty = "pow";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "root") {
            mathProperty = "sqrt";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "sin") {
            mathProperty = "sin";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "cos") {
            mathProperty = "cos";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "tan") {
            mathProperty = "tan";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "asin_radian") {
            mathProperty = "asin";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "acos_radian") {
            mathProperty = "acos";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "atan_radian") {
            mathProperty = "atan";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "ln") {
            mathProperty = "log";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "log") {
            mathProperty = "log10";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "floor") {
            mathProperty = "floor";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "ceil") {
            mathProperty = "ceil";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "round") {
            mathProperty = "round";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "factorial") {
            mathProperty = "factorial";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "abs") {
            mathProperty = "fabs";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }


        return result;
    };

    tu.generateVariablesDeclaration = function() {
        var result = "";
        var currentObject = Entry.playground.object;
        var vc = Entry.variableContainer;
        if(!vc) return;
        //inspect variables
        var targets = vc.variables_ || [];

        for (var i=targets.length-1; i>=0; i--) {
            var v = targets[i];
            var name = v.name_;
            var value = v.value_;

            if(v.object_) {
                if(v.object_ == currentObject.id) {
                    name = "self." + name;
                }
                else continue;
            }

            if(typeof value === "string")
                value = '"()"'.replace('()', value);

            result += name + " = " + value + "\n";
        }

        return result;
    };

    tu.generateListsDeclaration = function() {
        var result = "";
        var currentObject = Entry.playground.object;
        var vc = Entry.variableContainer;
        if(!vc)
            return;

        //inspect lists
        targets = vc.lists_ || [];

        for (var i=targets.length-1; i>=0; i--) {
            var l = targets[i];
            var name = l.name_;
            var value = "";
            var lArray = l.array_;
            if(l.object_) {
                if(l.object_ == currentObject.id) {
                    name = "self." + name;
                }
                else
                    continue;
            }

            for(var va in lArray) {
                var vItem = lArray[va];
                var data = vItem.data;

                /*if(Entry.Utils.isNumber(pData)) {
                    data = pData;
                    data = parseFloat(data);

                }*/

                if(isNaN(data))
                    data = "\"" + data + "\"";
                value += data;
                if(va != lArray.length-1)
                    value += ", ";
            }

            result += name + " = [" + value + "]" + "\n";

        }

        return result;
    };

    tu.isVariableNumber = function(id, type) {
        var currentObject = Entry.playground.object;
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            if(type == "global") {
                if(entryVariable.object_ === null && entryVariable.id_ == id) {
                    if(Entry.Utils.isNumber(entryVariable.value_))
                        return true;
                }
            }
            else if(type == "local") {
                if(entryVariable.object_ === currentObject.id && entryVariable.id_ == id) {
                    if(Entry.Utils.isNumber(entryVariable.value_))
                        return true;
                }
            }

        }

        return false;
    };

    tu.generateForStmtIndex = function(index, str) {
        str = str || "";
        var ref = ["i", "j", "k"];
        var quotient = Math.floor(index / 3);
        var remainder = index % 3;

        str = ref[remainder] + str;

        if (quotient) return this.generateForStmtIndex(quotient - 1, str);
        else return str;

    };

    tu.isExpressionLiteral = function(component, syntax) {
        switch (component.type) {
            case "CallExpression":
                if (component.callee.type === "MemberExpression") {
                    var calleeName = component.callee.property.name;
                    calleeName = syntax["%2"][calleeName];
                    if (calleeName) {
                        var key = calleeName.key;
                        return Entry.block[key].skeleton === "basic_string_field";
                    }
                }
                break;
            case "Literal":
                return true;
        }
        return false;
    };
})(Entry.TextCodingUtil);
